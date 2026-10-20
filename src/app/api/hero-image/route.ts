import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedHeroBuffer: Buffer | null = null;

const HERO_PATHS = [
  path.join(process.cwd(), 'public', 'images', 'hero', 'hero-atelier.jpg'),
  path.join(process.cwd(), 'public', 'images', 'hero', 'atelier-indigo.jpg'),
];

function getHeroBuffer(): Buffer | null {
  for (const p of HERO_PATHS) {
    if (fs.existsSync(p)) {
      try {
        return fs.readFileSync(p);
      } catch (err) {
        console.error(`Failed reading ${p}:`, err);
      }
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    if (!cachedHeroBuffer) {
      cachedHeroBuffer = getHeroBuffer();
    }

    if (cachedHeroBuffer) {
      return new NextResponse(new Uint8Array(cachedHeroBuffer), {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Hero image missing', { status: 404 });
  } catch (err) {
    console.error('Error serving hero image:', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
