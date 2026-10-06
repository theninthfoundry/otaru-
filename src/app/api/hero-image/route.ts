import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedAtelierBuffer: Buffer | null = null;
let cachedToriiBuffer: Buffer | null = null;

const ATELIER_SOURCE_PATHS = [
  path.join(process.cwd(), 'public', 'images', 'hero', 'hero-atelier.jpg'),
  path.join(process.cwd(), 'public', 'images', 'hero', 'atelier-indigo.jpg'),
  'C:/Users/namir/.gemini/antigravity-ide/brain/d99372f4-137f-400c-8ca7-53cfb22560ee/.tempmediaStorage/media_1791313662732.jpg',
  'C:/Users/namir/.gemini/antigravity-ide/brain/4bc2bd3d-ccb4-4fd5-a1fa-496dd5ca5dd9/atelier_indigo_hero_1791225223047.jpg',
  'C:/Users/namir/.gemini/antigravity-ide/brain/4bc2bd3d-ccb4-4fd5-a1fa-496dd5ca5dd9/.user_uploaded/media_1791224934993.png',
];

const TORII_SOURCE_PATHS = [
  path.join(process.cwd(), 'public', 'images', 'hero', 'hero-bg.jpg'),
  'C:/Users/namir/.gemini/antigravity-ide/brain/4bc2bd3d-ccb4-4fd5-a1fa-496dd5ca5dd9/.tempmediaStorage/media_1791225139058.jpg',
];

function getBufferFromPaths(paths: string[]): Buffer | null {
  for (const p of paths) {
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
    const { searchParams } = new URL(request.url);
    const slide = searchParams.get('slide') || searchParams.get('type') || 'atelier';

    // Slide 1 / Torii Gate / Mt Fuji
    if (slide === 'torii' || slide === '1') {
      if (!cachedToriiBuffer) {
        cachedToriiBuffer = getBufferFromPaths(TORII_SOURCE_PATHS);
      }

      if (cachedToriiBuffer) {
        return new NextResponse(new Uint8Array(cachedToriiBuffer), {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    // Default / Slide 0 / Atelier Indigo Jacket Still Life
    if (!cachedAtelierBuffer) {
      cachedAtelierBuffer = getBufferFromPaths(ATELIER_SOURCE_PATHS);

      // Best effort cache to public directory
      if (cachedAtelierBuffer) {
        try {
          const publicDir = path.join(process.cwd(), 'public', 'images', 'hero');
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }
          const targetFile = path.join(publicDir, 'atelier-indigo.jpg');
          if (!fs.existsSync(targetFile)) {
            fs.writeFileSync(targetFile, cachedAtelierBuffer);
          }
        } catch (e) {
          // ignore cache write error
        }
      }
    }

    if (cachedAtelierBuffer) {
      return new NextResponse(new Uint8Array(cachedAtelierBuffer), {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Fallback to Torii if atelier buffer couldn't be loaded
    if (!cachedToriiBuffer) {
      cachedToriiBuffer = getBufferFromPaths(TORII_SOURCE_PATHS);
    }
    if (cachedToriiBuffer) {
      return new NextResponse(new Uint8Array(cachedToriiBuffer), {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Hero image not found', { status: 404 });
  } catch (error) {
    console.error('Error serving hero image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
