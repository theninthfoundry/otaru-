import { rateLimit } from '@/server/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Collects CSP violation reports during the report-only phase. Bounded + rate-limited: it is a public endpoint.
export async function POST(req: Request) {
  if (await rateLimit(req, { name: 'csp-report', limit: 30, window: '1 m' })) return new Response(null, { status: 204 });
  const raw = (await req.text()).slice(0, 8192);
  try {
    const r = (JSON.parse(raw) as { 'csp-report'?: Record<string, string> })['csp-report'];
    if (r) {
      console.warn('[csp]', {
        directive: r['violated-directive'],
        blocked: r['blocked-uri'],
        page: r['document-uri'],
      });
    }
  } catch {
    /* ignore malformed reports */
  }
  return new Response(null, { status: 204 });
}
