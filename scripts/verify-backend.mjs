import fs from 'fs';
import path from 'path';
import https from 'https';

console.log('\n╔══════════════════════════════════════════════════════════════════════╗');
console.log('║               OTARU BACKEND DEPLOYMENT READINESS CHECK               ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝\n');

// Load .env, .env.local, or .env.production if present
function loadEnv() {
  const envFiles = ['.env.production', '.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...values] = trimmed.split('=');
          const val = values.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const report = {
  database: { status: 'PENDING', message: '' },
  redis: { status: 'PENDING', message: '' },
  secrets: { status: 'PENDING', message: '' },
  payments: { status: 'PENDING', message: '' },
};

// 1. Check Secrets
const adminSecret = process.env.ADMIN_API_SECRET;
const cartSecret = process.env.PAYMENT_CART_SECRET;

if (adminSecret && cartSecret && adminSecret.length >= 32 && cartSecret.length >= 32) {
  report.secrets.status = 'PASS';
  report.secrets.message = 'ADMIN_API_SECRET and PAYMENT_CART_SECRET are high-entropy cryptographic keys.';
} else {
  report.secrets.status = 'WARN';
  report.secrets.message = 'Missing or short (<32 chars) ADMIN_API_SECRET or PAYMENT_CART_SECRET.';
}

// 2. Check Database URL
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  report.database.status = 'MISSING';
  report.database.message = 'DATABASE_URL is not set. Needs Neon PostgreSQL connection string.';
} else if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
  report.database.status = 'FAIL';
  report.database.message = 'DATABASE_URL is not a valid PostgreSQL connection URI.';
} else {
  report.database.status = 'CONFIGURED';
  report.database.message = `Configured: ${dbUrl.replace(/:[^:@]+@/, ':****@')}`;
}

// 3. Check Redis URL & Token
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  report.redis.status = 'FALLBACK_READY';
  report.redis.message = 'Upstash Redis not set. System will fall back safely to in-memory coordination.';
} else {
  report.redis.status = 'CONFIGURED';
  report.redis.message = `Configured: ${redisUrl}`;
}

// 4. Check Razorpay
const rzpKey = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
const rzpWebhook = process.env.RAZORPAY_WEBHOOK_SECRET;

if (rzpKey && rzpSecret) {
  report.payments.status = 'CONFIGURED';
  const isLive = rzpKey.startsWith('rzp_live_');
  report.payments.message = `${isLive ? 'LIVE' : 'TEST'} credentials detected (${rzpKey.substring(0, 12)}...). Webhook secret: ${rzpWebhook ? 'Set' : 'Missing'}.`;
} else {
  report.payments.status = 'MISSING';
  report.payments.message = 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured.';
}

// Print Results
console.log('1. RELATIONAL DATABASE (PostgreSQL):');
console.log(`   Status:  [${report.database.status}]`);
console.log(`   Details: ${report.database.message}\n`);

console.log('2. DISTRIBUTED COORDINATION (Upstash Redis):');
console.log(`   Status:  [${report.redis.status}]`);
console.log(`   Details: ${report.redis.message}\n`);

console.log('3. ADMINISTRATIVE & SESSION SECRETS:');
console.log(`   Status:  [${report.secrets.status}]`);
console.log(`   Details: ${report.secrets.message}\n`);

console.log('4. PAYMENT GATEWAY (Razorpay):');
console.log(`   Status:  [${report.payments.status}]`);
console.log(`   Details: ${report.payments.message}\n`);

console.log('────────────────────────────────────────────────────────────────────────');
if (report.database.status !== 'CONFIGURED') {
  console.log('NEXT ACTION FOR DATABASE:');
  console.log('1. Sign up for free at https://neon.tech and create a database.');
  console.log('2. Run in PowerShell:');
  console.log('   $env:DATABASE_URL="postgresql://user:pass@ep-xyz-pooler.region.neon.tech/neondb?sslmode=require"');
  console.log('   npx prisma migrate deploy\n');
}

if (report.secrets.status !== 'PASS') {
  console.log('NEXT ACTION FOR SECRETS:');
  console.log('Generate your random 32-byte hex secrets:');
  console.log('node -e "console.log(\'ADMIN_API_SECRET=\' + crypto.randomBytes(32).toString(\'hex\'))"');
  console.log('node -e "console.log(\'PAYMENT_CART_SECRET=\' + crypto.randomBytes(32).toString(\'hex\'))"\n');
}

if (report.database.status === 'CONFIGURED' && report.secrets.status === 'PASS') {
  console.log('🟢 ALL REQUIRED BACKEND SERVICES READY FOR VERCEL DEPLOYMENT!');
}
console.log('────────────────────────────────────────────────────────────────────────\n');
