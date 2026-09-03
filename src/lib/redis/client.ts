export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<boolean>;
  setNx(key: string, value: string, ttlSeconds?: number): Promise<boolean>;
  del(key: string): Promise<boolean>;
  incr(key: string): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<boolean>;
}

const hasRedisConfig = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

// Fail-Closed Production Exception Handler
class StrictProductionRedisClient implements RedisClient {
  private url = process.env.UPSTASH_REDIS_REST_URL;
  private token = process.env.UPSTASH_REDIS_REST_TOKEN;

  private checkConfig() {
    if (!this.url || !this.token) {
      throw new Error('[FATAL SECURITY INVARIANTS VIOLATION]: Production Redis environment variables (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) are unconfigured. Distributed rate-limiting and payment nonces cannot operate safely.');
    }
  }

  async get(key: string): Promise<string | null> {
    this.checkConfig();
    try {
      const res = await fetch(`${this.url}/get/${key}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (!res.ok) throw new Error(`Redis HTTP status ${res.status}`);
      const data = await res.json();
      return data.result ?? null;
    } catch (err) {
      throw new Error(`[Production Redis Fault]: Failed to read key '${key}': ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    this.checkConfig();
    try {
      const endpoint = ttlSeconds ? `${this.url}/set/${key}/${value}/EX/${ttlSeconds}` : `${this.url}/set/${key}/${value}`;
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return res.ok;
    } catch (err) {
      throw new Error(`[Production Redis Fault]: Failed to set key '${key}': ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async setNx(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    this.checkConfig();
    try {
      const endpoint = ttlSeconds
        ? `${this.url}/set/${key}/${value}/NX/EX/${ttlSeconds}`
        : `${this.url}/set/${key}/${value}/NX`;
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const data = await res.json();
      return data.result === 'OK';
    } catch (err) {
      throw new Error(`[Production Redis Fault]: Failed atomic lock setNx for key '${key}': ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async del(key: string): Promise<boolean> {
    this.checkConfig();
    try {
      const res = await fetch(`${this.url}/del/${key}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return res.ok;
    } catch (err) {
      throw new Error(`[Production Redis Fault]: Failed to delete key '${key}': ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async incr(key: string): Promise<number> {
    this.checkConfig();
    try {
      const res = await fetch(`${this.url}/incr/${key}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const data = await res.json();
      return data.result ?? 1;
    } catch (err) {
      throw new Error(`[Production Redis Fault]: Failed to increment key '${key}': ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    this.checkConfig();
    try {
      const res = await fetch(`${this.url}/expire/${key}/${ttlSeconds}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return res.ok;
    } catch (err) {
      throw new Error(`[Production Redis Fault]: Failed to set expiration for key '${key}': ${err instanceof Error ? err.message : String(err)}`);
    }
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

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.store.set(key, { value, expiresAt });
    return true;
  }

  async setNx(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (await this.get(key)) return false;
    return this.set(key, value, ttlSeconds);
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
}

export const redis: RedisClient = hasRedisConfig
  ? new StrictProductionRedisClient()
  : new InMemoryRedisAdapter();
