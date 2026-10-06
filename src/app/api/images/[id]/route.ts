import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIRS = [
  'C:/Users/namir/.gemini/antigravity-ide/brain/4bc2bd3d-ccb4-4fd5-a1fa-496dd5ca5dd9',
  'C:/Users/namir/.gemini/antigravity-ide/brain/162753e9-e443-47b9-9c9b-5a5b41ace49d',
  path.join(process.cwd(), 'public', 'images', 'products'),
  path.join(process.cwd(), 'public', 'images', 'hero'),
];

const IMAGE_MAP: Record<string, string> = {
  '041': 'yama_field_jacket_1791216680861.jpg',
  '041-primary': 'yama_field_jacket_1791216680861.jpg',
  '041-secondary': 'yama_jacket_onbody_1791220971967.jpg',
  '041-detail': 'yama_jacket_detail_1791220999122.jpg',
  '042': 'kiryu_wrap_trouser_1791216717196.jpg',
  '042-primary': 'kiryu_wrap_trouser_1791216717196.jpg',
  '043': 'biratori_overshirt_1791216737449.jpg',
  '043-primary': 'biratori_overshirt_1791216737449.jpg',
  '044': 'omi_hemp_tote_1791216815305.jpg',
  '044-primary': 'omi_hemp_tote_1791216815305.jpg',
  'macro-indigo': 'macro_indigo_twill_1791216835608.jpg',
  'studio-hands': 'studio_hands_craft_1791216857752.jpg',
  'atelier': 'atelier_indigo_hero_1791225223047.jpg',
  'hero-atelier': 'atelier_indigo_hero_1791225223047.jpg',
  'atelier-indigo': 'atelier-indigo.jpg',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const filename = IMAGE_MAP[cleanId] || `${cleanId}.jpg`;

    for (const dir of ARTIFACT_DIRS) {
      const filePath = path.join(dir, filename);
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);

        // Best effort cache to public directory
        try {
          const publicDir = path.join(process.cwd(), 'public', 'images', 'products');
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }
          const publicFile = path.join(publicDir, `${cleanId}.jpg`);
          if (!fs.existsSync(publicFile)) {
            fs.writeFileSync(publicFile, buffer);
          }
        } catch (e) {
          // Ignore background caching errors
        }

        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    return new NextResponse('Asset source file missing', { status: 404 });
  } catch (err) {
    console.error('Error serving image:', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
