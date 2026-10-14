import 'server-only';
import { PrismaClient } from '@prisma/client';

const g = globalThis as unknown as { __otaruPrisma?: PrismaClient };

export const db: PrismaClient =
  g.__otaruPrisma ??
  new PrismaClient({ log: process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error'] });

if (process.env.NODE_ENV !== 'production') g.__otaruPrisma = db;
