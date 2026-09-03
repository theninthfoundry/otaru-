import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let client: PrismaClient;

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

if (!hasDatabaseUrl) {
  // Safe mock client fallback for build time, offline development & testing without DB
  client = new Proxy({} as PrismaClient, {
    get: (_target, prop) => {
      if (prop === '$transaction') {
        return async (fn: (tx: unknown) => Promise<unknown>) => fn(client);
      }
      return new Proxy({}, {
        get: () => () => Promise.resolve(null),
      });
    },
  });
} else {
  try {
    client =
      globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
  } catch (error) {
    console.warn('[Prisma Initialization Warning]:', error instanceof Error ? error.message : String(error));
    client = new Proxy({} as PrismaClient, {
      get: () => () => Promise.resolve(null),
    });
  }
}

export const prisma = client;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
