import { PRODUCT_CATALOG, CHAPTERS_DATA, JOURNAL_POSTS } from './catalog';

export interface SearchRecord {
  kind: 'Artifacts' | 'Chapters' | 'Journal';
  id: string | null;
  title: string;
  sub: string;
  url: string;
  kw: string;
}

function fieldScore(q: string, text: string): number | null {
  if (!text || !q) return null;
  const lowerText = text.toLowerCase();
  if (lowerText === q) return 1;
  if (lowerText.indexOf(q) === 0) return 0.9;
  const idx = lowerText.indexOf(q);
  if (idx !== -1) return 0.75 - (idx / lowerText.length) * 0.15;
  
  // Fuzzy subsequence matching
  let qi = 0;
  for (let i = 0; i < lowerText.length && qi < q.length; i++) {
    if (lowerText[i] === q[qi]) qi++;
  }
  return qi === q.length ? 0.45 : null;
}

export function getSearchIndex(formatPrice: (usd: number) => string): SearchRecord[] {
  const artifacts: SearchRecord[] = Object.keys(PRODUCT_CATALOG)
    .filter((id) => Boolean(PRODUCT_CATALOG[id]))
    .map((id) => {
      const p = PRODUCT_CATALOG[id]!;
      return {
        kind: 'Artifacts',
        id,
        title: p.name,
        sub: `${p.material.split(',')[0]} — ${formatPrice(p.price)}`,
        url: `/product/${id}`,
        kw: `${id} ${p.category} ${p.name} ${p.material}`,
      };
    });

  const chapters: SearchRecord[] = CHAPTERS_DATA.map((c) => ({
    kind: 'Chapters',
    id: null,
    title: `${c.numeral} — ${c.title}`,
    sub: `${c.season} · ${c.pieces} pieces`,
    url: '/chapters',
    kw: `chapter ${c.title} ${c.season}`,
  }));

  const journal: SearchRecord[] = JOURNAL_POSTS.map((j) => ({
    kind: 'Journal',
    id: null,
    title: j.title,
    sub: `${j.date} · ${j.cat}`,
    url: '/journal',
    kw: `journal ${j.cat} ${j.title}`,
  }));

  return [...artifacts, ...chapters, ...journal];
}

export function searchIndex(query: string, formatPrice: (usd: number) => string): SearchRecord[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  
  const records = getSearchIndex(formatPrice);
  const results: { rec: SearchRecord; score: number }[] = [];

  records.forEach((rec) => {
    const tokenScores: number[] = [];
    for (let t = 0; t < tokens.length; t++) {
      const token = tokens[t] ?? '';
      const sTitle = fieldScore(token, rec.title);
      const sSub = fieldScore(token, rec.sub);
      const sKw = fieldScore(token, rec.kw);

      const s = Math.max(
        sTitle !== null ? sTitle * 1.0 : -1,
        sSub !== null ? sSub * 0.55 : -1,
        sKw !== null ? sKw * 0.4 : -1
      );
      if (s < 0) return;
      tokenScores.push(s);
    }

    if (tokenScores.length === tokens.length) {
      const avg = tokenScores.reduce((a, b) => a + b, 0) / tokenScores.length;
      results.push({ rec, score: avg });
    }
  });

  results.sort((a, b) => b.score - a.score);
  return results.map((r) => r.rec);
}
