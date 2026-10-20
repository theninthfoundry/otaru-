import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let client: PrismaClient;

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export const isDatabaseConfigured = (): boolean => Boolean(process.env.DATABASE_URL);

if (!hasDatabaseUrl) {
  // Safe mock client fallback for build time, offline development & testing without DB
  client = new Proxy({} as PrismaClient, {
    get: (_target, prop) => {
      if (prop === '$transaction') {
        if (process.env.NODE_ENV === 'production') {
          return async () => {
            throw new Error('[Prisma Persistence Security Barrier] Database transaction attempted in production without DATABASE_URL configured.');
          };
        }
        return async (fn: (tx: unknown) => Promise<unknown>) => fn(client);
      }
      return new Proxy({}, {
        get: () => () => {
          if (process.env.NODE_ENV === 'production') {
            throw new Error('[Prisma Persistence Security Barrier] Direct database operation attempted in production without DATABASE_URL configured.');
          }
          return Promise.resolve(null);
        },
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
      get: () => () => {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('[Prisma Initialization Failure] Prisma client failed to initialize in production.');
        }
        return Promise.resolve(null);
      },
    });
  }
}

export const prisma = client;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;

