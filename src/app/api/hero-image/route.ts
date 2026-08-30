import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedBuffer: Buffer | null = null;

export async function GET() {
  try {
    if (cachedBuffer) {
      return new NextResponse(cachedBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const htmlPath = path.join(process.cwd(), 'otaru-preview (1).html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    const match = content.match(/url\("data:image\/jpeg;base64,([^"]+)"\)/);

    if (match && match[1]) {
      cachedBuffer = Buffer.from(match[1], 'base64');

      // Also persist to public folder for static caching
      try {
        const publicDir = path.join(process.cwd(), 'public', 'images', 'hero');
        fs.mkdirSync(publicDir, { recursive: true });
        fs.writeFileSync(path.join(publicDir, 'hero-bg.jpg'), cachedBuffer);
      } catch (err) {
        console.error('Failed to write public hero image file:', err);
      }

      return new NextResponse(cachedBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Hero image not found in preview html', { status: 404 });
  } catch (error) {
    console.error('Error extracting hero image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
