import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let client: PrismaClient;

const isProduction = process.env.NODE_ENV === 'production';
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

if (isProduction && !hasDatabaseUrl) {
  throw new Error('[FATAL INVARIANTS VIOLATION]: DATABASE_URL is missing in production deployment. Database persistence tier requires valid PostgreSQL connection URL.');
}

try {
  client =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
} catch (error) {
  if (isProduction) {
    throw new Error(`[FATAL INVARIANTS VIOLATION]: Failed to initialize PrismaClient in production: ${error instanceof Error ? error.message : String(error)}`);
  }
  // Safe mock client fallback exclusively for offline local development & unit testing
  client = new Proxy({} as PrismaClient, {
    get: () => () => Promise.resolve(null),
  });
}

export const prisma = client;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
