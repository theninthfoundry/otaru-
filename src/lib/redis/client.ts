export type SetOptions = number | { ex?: number };

export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSecondsOrOptions?: SetOptions): Promise<boolean>;
  setNx(key: string, value: string, ttlSecondsOrOptions?: SetOptions): Promise<boolean>;
  del(key: string): Promise<boolean>;
  incr(key: string): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<boolean>;
  claimNonce(key: string, expectedOrderId: string): Promise<'OK' | 'NOT_FOUND' | 'ORDER_MISMATCH'>;
}

const hasRedisConfig = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

function parseTtl(ttlSecondsOrOptions?: SetOptions): number | undefined {
  if (typeof ttlSecondsOrOptions === 'number') {
    return ttlSecondsOrOptions;
  }
  if (typeof ttlSecondsOrOptions === 'object' && ttlSecondsOrOptions !== null) {
    return ttlSecondsOrOptions.ex;
  }
  return undefined;
}

// Fail-Closed Production Exception Handler
class StrictProductionRedisClient implements RedisClient {
  private url = process.env.UPSTASH_REDIS_REST_URL;
  private token = process.env.UPSTASH_REDIS_REST_TOKEN;

  private checkConfig() {
    if (!this.url || !this.token) {
      throw new Error('[FATAL SECURITY INVARIANTS VIOLATION]: Production Redis environment variables (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) are unconfigured. Distributed rate-limiting and payment nonces cannot operate safely.');
    }
  }

  private async execCommand<T = unknown>(command: (string | number)[]): Promise<T> {
    this.checkConfig();
    try {
      const res = await fetch(this.url!, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });
      if (!res.ok) throw new Error(`Redis HTTP status ${res.status}`);
      const data = await res.json();
      return data.result as T;
    } catch (err) {
      throw new Error(`[Production Redis Fault]: Command ${command[0]} failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async get(key: string): Promise<string | null> {
    const result = await this.execCommand<string | null>(['GET', key]);
    return result ?? null;
  }

  async set(key: string, value: string, ttlSecondsOrOptions?: SetOptions): Promise<boolean> {
    const ttl = parseTtl(ttlSecondsOrOptions);
    const cmd: (string | number)[] = ttl
      ? ['SET', key, value, 'EX', ttl]
      : ['SET', key, value];
    const result = await this.execCommand<string>(cmd);
    return result === 'OK';
  }

  async setNx(key: string, value: string, ttlSecondsOrOptions?: SetOptions): Promise<boolean> {
    const ttl = parseTtl(ttlSecondsOrOptions);
    const cmd: (string | number)[] = ttl
      ? ['SET', key, value, 'EX', ttl, 'NX']
      : ['SET', key, value, 'NX'];
    const result = await this.execCommand<string | null>(cmd);
    return result === 'OK';
  }

  async del(key: string): Promise<boolean> {
    const result = await this.execCommand<number>(['DEL', key]);
    return typeof result === 'number' && result >= 0;
  }

  async incr(key: string): Promise<number> {
    return await this.execCommand<number>(['INCR', key]);
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.execCommand<number>(['EXPIRE', key, ttlSeconds]);
    return result === 1;
  }

  async claimNonce(key: string, expectedOrderId: string): Promise<'OK' | 'NOT_FOUND' | 'ORDER_MISMATCH'> {
    // Atomic Lua script execution: get, check orderId, and delete in single indivisible operation
    const luaScript = `
local val = redis.call('get', KEYS[1])
if not val then
  return 'NOT_FOUND'
end
local ok, decoded = pcall(cjson.decode, val)
if not ok or not decoded then
  redis.call('del', KEYS[1])
  return 'NOT_FOUND'
end
if decoded.orderId ~= ARGV[1] then
  return 'ORDER_MISMATCH'
end
redis.call('del', KEYS[1])
return 'OK'
`;
    const result = await this.execCommand<string>(['EVAL', luaScript, 1, key, expectedOrderId]);
    if (result === 'OK' || result === 'NOT_FOUND' || result === 'ORDER_MISMATCH') {
      return result;
    }
    return 'NOT_FOUND';
  }
}

// In-Memory Fallback Adapter for local development & unit testing
class InMemoryRedisAdapter implements RedisClient {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  private cleanKey(key: string) {
    const entry = this.store.get(key);
    if (entry && entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry;
  }

  async get(key: string): Promise<string | null> {
    const entry = this.cleanKey(key);
    return entry ? entry.value : null;
  }

  async set(key: string, value: string, ttlSecondsOrOptions?: SetOptions): Promise<boolean> {
    const ttl = parseTtl(ttlSecondsOrOptions);
    const expiresAt = ttl ? Date.now() + ttl * 1000 : undefined;
    this.store.set(key, { value, expiresAt });
    return true;
  }

  async setNx(key: string, value: string, ttlSecondsOrOptions?: SetOptions): Promise<boolean> {
    if (await this.get(key)) return false;
    return this.set(key, value, ttlSecondsOrOptions);
  }

  async del(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  async incr(key: string): Promise<number> {
    const currentStr = await this.get(key);
    const current = currentStr ? parseInt(currentStr, 10) : 0;
    const next = current + 1;
    await this.set(key, next.toString());
    return next;
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    const entry = this.cleanKey(key);
    if (!entry) return false;
    entry.expiresAt = Date.now() + ttlSeconds * 1000;
    return true;
  }

  async claimNonce(key: string, expectedOrderId: string): Promise<'OK' | 'NOT_FOUND' | 'ORDER_MISMATCH'> {
    const entry = this.cleanKey(key);
    if (!entry) return 'NOT_FOUND';
    try {
      const parsed = JSON.parse(entry.value);
      if (parsed.orderId !== expectedOrderId) return 'ORDER_MISMATCH';
      this.store.delete(key);
      return 'OK';
    } catch {
      this.store.delete(key);
      return 'NOT_FOUND';
    }
  }
}

export const redis: RedisClient = hasRedisConfig
  ? new StrictProductionRedisClient()
  : new InMemoryRedisAdapter();
