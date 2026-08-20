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

function ensureLedgerFile() {
  const dir = path.dirname(ledgerFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ledgerFilePath)) {
    fs.writeFileSync(ledgerFilePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getTransactions(): Transaction[] {
  try {
    ensureLedgerFile();
    const data = fs.readFileSync(ledgerFilePath, 'utf-8');
    return JSON.parse(data) as Transaction[];
  } catch (error) {
    console.error('[Ledger Service] Error reading transactions:', error);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): boolean {
  try {
    ensureLedgerFile();
    fs.writeFileSync(ledgerFilePath, JSON.stringify(transactions, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('[Ledger Service] Error saving transactions:', error);
    return false;
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
  if (existingIdx !== -1) {
    const existing = transactions[existingIdx];
    if (existing) {
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
    }
  } else {
    transactions.unshift(newTx);
    saveTransactions(transactions);
  }

  // Dual-write to Prisma DB asynchronously if configured
  if (process.env.DATABASE_URL && prisma?.payment) {
    const amountMinor = Math.round(tx.amount * 100);
    prisma.payment.upsert({
      where: { gatewayOrderId: tx.id },
      create: {
        orderId: tx.orderId,
        gateway: 'RAZORPAY',
        gatewayOrderId: tx.id,
        amountMinor,
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

  const resultTx = existingIdx !== -1 ? transactions[existingIdx] : newTx;
  return resultTx || newTx;
}

export function updateTransactionStatus(
  id: string,
  status: Transaction['status'],
  details: string,
  securityUpdates?: Partial<LedgerSecurityInfo>
): Transaction | null {
  const transactions = getTransactions();
  const txIndex = transactions.findIndex(t => t.id === id || t.orderId === id);

  if (txIndex === -1) {
    console.warn(`[Ledger Service] Transaction not found for ID: ${id}`);
    return null;
  }

  const tx = transactions[txIndex];
  if (!tx) return null;

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

  if (process.env.DATABASE_URL && prisma?.payment) {
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
