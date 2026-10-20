import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PRODUCT_DIR = path.join(process.cwd(), 'public', 'images', 'products');
const HERO_DIR = path.join(process.cwd(), 'public', 'images', 'hero');

const FALLBACK_IMAGE = path.join(HERO_DIR, 'hero-atelier.jpg');
const SECONDARY_FALLBACK = path.join(HERO_DIR, 'atelier-indigo.jpg');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Strip any directory traversal tokens and restrict to safe alphanumeric IDs
    const baseName = path.basename(id).replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const cleanId = baseName.replace(/[^a-zA-Z0-9_-]/g, '');

    if (!cleanId) {
      return new NextResponse('Invalid image identifier', { status: 400 });
    }

    // Check products directory
    const candidates = [
      path.join(PRODUCT_DIR, `${cleanId}.jpg`),
      path.join(PRODUCT_DIR, `${cleanId}.png`),
      path.join(PRODUCT_DIR, `${cleanId}.webp`),
      path.join(HERO_DIR, `${cleanId}.jpg`),
    ];

    for (const file of candidates) {
      if (fs.existsSync(file)) {
        const buffer = fs.readFileSync(file);
        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    // Graceful fallback to verified authentic still-life image
    const fallbackPath = cleanId.includes('secondary') ? SECONDARY_FALLBACK : FALLBACK_IMAGE;
    if (fs.existsSync(fallbackPath)) {
      const buffer = fs.readFileSync(fallbackPath);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      });
    }

    return new NextResponse('Asset source file missing', { status: 404 });
  } catch (err) {
    console.error('Error serving product image:', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
