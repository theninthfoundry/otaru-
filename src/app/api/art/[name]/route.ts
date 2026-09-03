import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


function generateArchivalSvg(name: string): string {
  const titles: Record<string, { kanji: string; title: string; color: string; accent: string }> = {
    'cherry-blossom': { kanji: '桜', title: 'CHERRY BLOSSOM ARCHIVE', color: '#161a1d', accent: '#e8a598' },
    'poppies': { kanji: '芥子', title: 'POPPY MOTIF STUDY', color: '#1a1616', accent: '#c85a48' },
    'great-wave': { kanji: '波', title: 'GREAT WAVE CANVAS', color: '#0f172a', accent: '#38bdf8' },
    'pine-tree': { kanji: '松', title: 'PINE ARCHIVE STUDY', color: '#141f17', accent: '#4ade80' },
    'mount-fuji': { kanji: '富士', title: 'FUJI VOLCANIC STUDY', color: '#18181b', accent: '#e2e8f0' },
    'lanterns': { kanji: '燈籠', title: 'LANTERN LIGHT STUDY', color: '#1f1610', accent: '#fbbf24' },
    'furin': { kanji: '風鈴', title: 'FURIN CHIME RESONANCE', color: '#131e24', accent: '#67e8f9' },
  };

  const meta = titles[name] || { kanji: '雅', title: 'OTARU ARCHIVE STUDY', color: '#121212', accent: '#d4af37' };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${meta.color}" />
      <stop offset="100%" stop-color="#080808" />
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <rect x="40" y="40" width="720" height="920" fill="none" stroke="${meta.accent}" stroke-width="1" stroke-opacity="0.3"/>
  <text x="400" y="480" font-family="'Noto Serif JP', serif" font-size="120" font-weight="300" fill="${meta.accent}" text-anchor="middle" opacity="0.85">${meta.kanji}</text>
  <text x="400" y="560" font-family="monospace" font-size="16" letter-spacing="8" fill="#a1a1aa" text-anchor="middle">${meta.title}</text>
  <text x="400" y="600" font-family="monospace" font-size="11" letter-spacing="4" fill="#52525b" text-anchor="middle">OTARU ATELIER · ARCHIVAL EDITION</text>
</svg>`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  // 1. Try serving uploaded media if local path is accessible
  try {
    const userUploadedDir = process.env.USERPROFILE
      ? path.join(process.env.USERPROFILE, '.gemini', 'antigravity-ide', 'brain', '5b8a5460-c170-4dc0-8e26-3e0fa707a8ae', '.user_uploaded')
      : null;

    let targetFilename: string | undefined;
    if (name === 'cherry-blossom') targetFilename = 'media_1788082479943.jpg';
    else if (name === 'poppies') targetFilename = 'media_1788082526036.png';
    else if (name === 'great-wave') targetFilename = 'media_1788082684667.jpg';
    else if (name === 'pine-tree') targetFilename = 'media_1788085046104.png';
    else if (name === 'mount-fuji') targetFilename = 'media_1788085181202.png';
    else if (name === 'lanterns') targetFilename = 'media_1788085315253.png';
    else if (name === 'furin') targetFilename = 'media_1788085342167.png';

    if (userUploadedDir && targetFilename) {
      const fullPath = path.join(userUploadedDir, targetFilename);
      if (fs.existsSync(fullPath)) {
        const buffer = fs.readFileSync(fullPath);
        const ext = path.extname(targetFilename).toLowerCase();
        const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }
  } catch {
    // Disk read failed, continue to SVG fallback
  }

  // 2. Production/Serverless fallback: Return high-resolution Japanese archival graphic
  const svgContent = generateArchivalSvg(name);
  return new NextResponse(svgContent, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
