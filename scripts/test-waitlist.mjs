import fs from 'fs';
import path from 'path';

async function run() {
  console.log('--- WAITLIST API TESTS ---');
  const baseUrl = 'http://localhost:3000/api/residents';

  // 1. Normal signup
  const res1 = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', igHandle: '@test' })
  });
  console.log('1. Normal signup:', await res1.json());

  // 2. Same email twice (idempotency check)
  const res2 = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com' })
  });
  console.log('2. Duplicate signup:', await res2.json());

  // 3. Bad email
  const res3 = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email' })
  });
  console.log('3. Bad email:', await res3.json());

  // 4. Honeypot test
  const res4 = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bot@example.com', honeypot: 'spam' })
  });
  console.log('4. Honeypot check:', await res4.json());

  // 5. Rate limiting (Simulated rapid submits)
  console.log('5. Rate limit check (sending 65 requests)...');
  let rateLimitHit = false;
  for (let i = 0; i < 65; i++) {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `test${i}@example.com` })
    });
    if (res.status === 429) {
      rateLimitHit = true;
      console.log('Rate limit hit at request #', i);
      break;
    }
  }
  if (!rateLimitHit) console.log('Rate limit not hit (might need middleware configuration).');
}

run().catch(console.error);
