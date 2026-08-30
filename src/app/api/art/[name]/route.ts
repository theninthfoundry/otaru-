import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mapping of art names to uploaded files
const ART_FILES: Record<string, string[]> = {
  'cherry-blossom': [
    'media_1788082479943.jpg',
    'media_1788082526036.png',
    'media_1788082684667.jpg',
    'media_1788078764562.jpg',
    'media_1788076039382.jpg',
  ],
  'poppies': [
    'media_1788082526036.png',
    'media_1788082479943.jpg',
    'media_1788082684667.jpg',
  ],
  'great-wave': [
    'media_1788082684667.jpg',
    'media_1788082479943.jpg',
    'media_1788082526036.png',
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;
  const userUploadedDir = path.join(
    process.env.USERPROFILE || 'C:\\Users\\namir',
    '.gemini',
    'antigravity-ide',
    'brain',
    '5b8a5460-c170-4dc0-8e26-3e0fa707a8ae',
    '.user_uploaded'
  );

  // Determine which file to serve
  let targetFilename: string | undefined;
  if (name === 'cherry-blossom') {
    targetFilename = 'media_1788082479943.jpg';
  } else if (name === 'poppies') {
    targetFilename = 'media_1788082526036.png';
  } else if (name === 'great-wave') {
    targetFilename = 'media_1788082684667.jpg';
  }

  if (targetFilename) {
    const fullPath = path.join(userUploadedDir, targetFilename);
    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      const ext = path.extname(targetFilename).toLowerCase();
      const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  }

  // Fallback: check other files
  const candidates = ART_FILES[name] || [];
  for (const file of candidates) {
    const fullPath = path.join(userUploadedDir, file);
    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      const ext = path.extname(file).toLowerCase();
      const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  }

  return new NextResponse('Not Found', { status: 404 });
}
