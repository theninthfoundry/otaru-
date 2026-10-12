interface Claim {
  id: string;
  text: string;
  status: 'confirmed' | 'todo';
  source?: string;       // who confirmed it
  usedIn: string[];      // file paths where it appears
}

export const claims: Claim[] = [
  {
    id: 'brand-year',
    text: 'House of Otaru is a 2026 clothing house',
    status: 'confirmed',
    source: 'Creative Direction',
    usedIn: ['content/site.ts'],
  },
  {
    id: 'indian-sizing',
    text: 'Cut for Indian bodies with Indian-tailored sizing',
    status: 'confirmed',
    source: 'Atelier Sizing Master',
    usedIn: ['app/page.tsx', 'content/drop01.ts'],
  },
  {
    id: 'japanese-craft-indian-cloth',
    text: 'Japanese craft sensibility, Indian cloth and hands',
    status: 'confirmed',
    source: 'Atelier Manifesto',
    usedIn: ['app/page.tsx'],
  },
  {
    id: 'never-restocked',
    text: 'Numbered. Never restocked.',
    status: 'confirmed',
    source: 'Archival Ledger Invariant',
    usedIn: ['app/page.tsx'],
  }
];
