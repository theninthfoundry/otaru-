/**
 * Fuzzy search / ranking algorithm.
 * -----------------------------------------------------------------
 * No external dependency (no Fuse.js/Algolia) — this is a small,
 * self-contained ranked matcher, good for a catalog in the hundreds
 * to low thousands of records held in memory. If the archive grows
 * well past that, swap `search()`'s body for a call to a real search
 * service and keep this file's types/scoring as your local fallback
 * (e.g. for instant-feel results while a network search is in flight).
 *
 * Scoring, per field, per token, highest first:
 *   1.00  exact match
 *   0.90  field starts with the token
 *   0.75  field contains the token as a substring (earlier position scores higher)
 *   ≤0.74 fuzzy subsequence — every character of the token appears in the
 *         field in order, not necessarily contiguous (rewards tight,
 *         early clusters over scattered ones — the same idea fzf/Sublime's
 *         "go-to-anything" use)
 *   null  no match at all
 *
 * A record's field score is weighted (title > subtitle > keywords) and
 * a record's total score is the *average* of its best per-token score —
 * multi-word queries ("indigo jacket") require every token to match
 * *something*, so a record missing any token is excluded entirely.
 */
import type { SearchableRecord, SearchResult } from "./types";

const FIELD_WEIGHTS = { title: 1, subtitle: 0.55, keyword: 0.4 } as const;

function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .trim();
}

/** All characters of `token` appear in `text` in order — not necessarily adjacent. */
function fuzzySubsequenceScore(token: string, text: string): number | null {
  let ti = 0;
  let qi = 0;
  let firstMatch = -1;
  let lastMatch = -1;
  let consecutiveRuns = 0;

  while (ti < text.length && qi < token.length) {
    if (text[ti] === token[qi]) {
      if (firstMatch === -1) firstMatch = ti;
      if (lastMatch === ti - 1) consecutiveRuns += 1;
      lastMatch = ti;
      qi += 1;
    }
    ti += 1;
  }

  if (qi < token.length) return null; // not every character was found, in order

  const span = lastMatch - firstMatch + 1;
  const compactness = token.length / span; // 1 = fully contiguous, → 0 = spread thin
  const earliness = 1 - firstMatch / text.length; // rewards an early first hit
  const runBonus = consecutiveRuns / token.length; // rewards unbroken runs within the match

  const score = 0.35 + compactness * 0.2 + earliness * 0.1 + runBonus * 0.15;
  return Math.min(score, 0.74); // stays below every substring-match score
}

/** Best score for a single token against a single field's text. */
function tokenFieldScore(token: string, fieldText: string): number | null {
  if (!fieldText) return null;
  const text = normalize(fieldText);
  if (text === token) return 1;
  if (text.startsWith(token)) return 0.9;
  const idx = text.indexOf(token);
  if (idx !== -1) {
    const positionPenalty = (idx / text.length) * 0.15;
    return 0.75 - positionPenalty;
  }
  return fuzzySubsequenceScore(token, text);
}

/** Best weighted score for one token against every field of one record. */
function tokenRecordScore(token: string, record: SearchableRecord): number | null {
  const candidates: number[] = [];

  const titleScore = tokenFieldScore(token, record.title);
  if (titleScore !== null) candidates.push(titleScore * FIELD_WEIGHTS.title);

  const subtitleScore = record.subtitle ? tokenFieldScore(token, record.subtitle) : null;
  if (subtitleScore !== null) candidates.push(subtitleScore * FIELD_WEIGHTS.subtitle);

  for (const kw of record.keywords ?? []) {
    const kwScore = tokenFieldScore(token, kw);
    if (kwScore !== null) candidates.push(kwScore * FIELD_WEIGHTS.keyword);
  }

  return candidates.length > 0 ? Math.max(...candidates) : null;
}

export function search(
  records: SearchableRecord[],
  query: string,
  options: { limit?: number; kinds?: SearchableRecord["kind"][] } = {}
): SearchResult[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const pool = options.kinds ? records.filter((r) => options.kinds!.includes(r.kind)) : records;

  const results: SearchResult[] = [];
  for (const record of pool) {
    const tokenScores: number[] = [];
    let missedAToken = false;

    for (const token of tokens) {
      const score = tokenRecordScore(token, record);
      if (score === null) {
        missedAToken = true;
        break;
      }
      tokenScores.push(score);
    }

    if (missedAToken) continue; // every token must match *something* on the record
    const combined = tokenScores.reduce((sum, s) => sum + s, 0) / tokenScores.length;
    results.push({ record, score: combined });
  }

  results.sort((a, b) => b.score - a.score);
  return options.limit ? results.slice(0, options.limit) : results;
}
