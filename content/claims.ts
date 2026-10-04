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
    usedIn: ['content/site.ts'],
  },
  {
    id: 'indian-sizing',
    text: 'Cut for Indian bodies with Indian-tailored sizing',
    status: 'todo',
    usedIn: ['app/page.tsx', 'content/drop01.ts'],
  },
  {
    id: 'japanese-craft-indian-cloth',
    text: 'Japanese craft sensibility, Indian cloth and hands',
    status: 'todo',
    usedIn: ['app/page.tsx'],
  },
  {
    id: 'never-restocked',
    text: 'Numbered. Never restocked.',
    status: 'todo',
    usedIn: ['app/page.tsx'],
  }
];
