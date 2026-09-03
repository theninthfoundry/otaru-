import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db/prisma';

export interface LedgerHistoryEntry {
  status: string;
  timestamp: string;
  details: string;
}

export interface LedgerSecurityInfo {
  rateLimitPass: boolean;
  csrfPass: boolean;
  signatureVerified: boolean;
}

export interface Transaction {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  method: string;
  status: 'CREATED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  history: LedgerHistoryEntry[];
  security: LedgerSecurityInfo;
}

export interface LedgerStats {
  ttv: number;
  successRate: number;
  failureRate: number;
  activeSessions: number;
  rateLimitBlocks: number;
  totalOrders: number;
}

const ledgerFilePath = path.join(process.cwd(), 'src', 'data', 'payment-ledger.json');
let inMemoryLedger: Transaction[] = [];

function ensureLedgerFile() {
  try {
    const dir = path.dirname(ledgerFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(ledgerFilePath)) {
      fs.writeFileSync(ledgerFilePath, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch {
    // Read-only filesystem in serverless environments (Vercel / Lambda)
  }
}

export async function getTransactionsAsync(): Promise<Transaction[]> {
  if (process.env.DATABASE_URL) {
    try {
      const payments = await prisma.payment.findMany({
        include: { order: true },
        orderBy: { createdAt: 'desc' },
      });
      if (payments && payments.length > 0) {
        return payments.map(p => ({
          id: p.gatewayOrderId,
          orderId: p.order?.internalId || p.orderId,
          customerId: p.order?.customerEmail || 'collector@otaru.in',
          customerName: p.order?.customerName || 'Archival Collector',
          amount: p.amountMinor / 100,
          currency: p.currency,
          method: p.gateway,
          status: p.status as Transaction['status'],
          createdAt: p.createdAt.toISOString(),
          history: [
            {
              status: p.status,
              timestamp: p.updatedAt.toISOString(),
              details: p.details || `Payment ${p.status}`,
            },
          ],
          security: {
            rateLimitPass: true,
            csrfPass: true,
            signatureVerified: Boolean(p.signature),
          },
        }));
      }
    } catch (err) {
      console.warn('[Ledger DB Fetch Error]:', err);
    }
  }
  return getTransactions();
}

export function getTransactions(): Transaction[] {
  try {
    ensureLedgerFile();
    if (fs.existsSync(ledgerFilePath)) {
      const data = fs.readFileSync(ledgerFilePath, 'utf-8');
      const parsed = JSON.parse(data) as Transaction[];
      if (parsed.length > 0) return parsed;
    }
  } catch {
    // Fall back to memory
  }
  return inMemoryLedger;
}

export function saveTransactions(transactions: Transaction[]): boolean {
  inMemoryLedger = [...transactions];
  try {
    ensureLedgerFile();
    fs.writeFileSync(ledgerFilePath, JSON.stringify(transactions, null, 2), 'utf-8');
    return true;
  } catch {
    // Safely handled in-memory in serverless environments
    return true;
  }
}

export function addTransaction(tx: Omit<Transaction, 'createdAt' | 'history'> & { details?: string }): Transaction {
  const transactions = getTransactions();
  
  const timestamp = new Date().toISOString();
  const newTx: Transaction = {
    ...tx,
    createdAt: timestamp,
    history: [
      {
        status: tx.status,
        timestamp,
        details: tx.details || `Transaction initiated with status: ${tx.status}`,
      },
    ],
  };

  const existingIdx = transactions.findIndex(t => t.orderId === tx.orderId);
  if (existingIdx !== -1 && transactions[existingIdx]) {
    const existing = transactions[existingIdx]!;
    existing.status = tx.status;
    existing.id = tx.id;
    existing.history.push({
      status: tx.status,
      timestamp,
      details: tx.details || `Transaction updated to status: ${tx.status}`,
    });
    existing.security = {
      ...existing.security,
      ...tx.security,
    };
    transactions[existingIdx] = existing;
    saveTransactions(transactions);
  } else {
    transactions.unshift(newTx);
    saveTransactions(transactions);
  }

  // Dual-write to Prisma DB asynchronously if configured
  if (process.env.DATABASE_URL) {
    prisma.payment.upsert({
      where: { gatewayOrderId: tx.id },
      create: {
        orderId: tx.orderId,
        gateway: 'RAZORPAY',
        gatewayOrderId: tx.id,
        amountMinor: Math.round(tx.amount * 100),
        currency: tx.currency,
        status: tx.status,
        details: tx.details,
        signature: tx.security.signatureVerified ? 'VERIFIED' : null,
      },
      update: {
        status: tx.status,
        details: tx.details,
      },
    }).catch(err => console.warn('[Prisma Dual-Write Warning]:', err.message));
  }

  return (existingIdx !== -1 && transactions[existingIdx]) ? transactions[existingIdx]! : newTx;
}

export function updateTransactionStatus(
  id: string,
  status: Transaction['status'],
  details: string,
  securityUpdates?: Partial<LedgerSecurityInfo>
): Transaction | null {
  const transactions = getTransactions();
  const txIndex = transactions.findIndex(t => t.id === id || t.orderId === id);

  if (txIndex === -1 || !transactions[txIndex]) {
    console.warn(`[Ledger Service] Transaction not found for ID: ${id}`);
    return null;
  }

  const tx = transactions[txIndex]!;
  tx.status = status;
  tx.history.push({
    status,
    timestamp: new Date().toISOString(),
    details,
  });

  if (securityUpdates) {
    tx.security = {
      ...tx.security,
      ...securityUpdates,
    };
  }

  transactions[txIndex] = tx;
  saveTransactions(transactions);

  if (process.env.DATABASE_URL) {
    prisma.payment.updateMany({
      where: { OR: [{ gatewayOrderId: id }, { orderId: id }] },
      data: { status, details },
    }).catch(err => console.warn('[Prisma Dual-Write Warning]:', err.message));
  }

  return tx;
}

export function getStats(): LedgerStats {
  const transactions = getTransactions();
  const successfulTx = transactions.filter(t => t.status === 'CAPTURED');
  const failedTx = transactions.filter(t => t.status === 'FAILED');
  
  const ttv = successfulTx.reduce((sum, t) => sum + t.amount, 0);
  
  const totalConcluded = successfulTx.length + failedTx.length;
  const successRate = totalConcluded > 0 ? (successfulTx.length / totalConcluded) * 100 : 100;
  const failureRate = totalConcluded > 0 ? (failedTx.length / totalConcluded) * 100 : 0;
  
  const rateLimitBlocks = transactions.filter(t => t.security.rateLimitPass === false).length;

  return {
    ttv: Math.round(ttv * 100) / 100,
    successRate: Math.round(successRate * 10) / 10,
    failureRate: Math.round(failureRate * 10) / 10,
    activeSessions: transactions.filter(t => t.status === 'CREATED').length,
    rateLimitBlocks,
    totalOrders: transactions.length,
  };
}

export function clearLedger(): void {
  saveTransactions([]);
}
