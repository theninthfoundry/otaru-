import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const publicHeroDir = path.join(projectRoot, 'public', 'images', 'hero');
const publicProductDir = path.join(projectRoot, 'public', 'images', 'products');

if (!fs.existsSync(publicHeroDir)) {
  fs.mkdirSync(publicHeroDir, { recursive: true });
}
if (!fs.existsSync(publicProductDir)) {
  fs.mkdirSync(publicProductDir, { recursive: true });
}

// 1. Copy atelier still life hero image
const heroCandidates = [
  'C:/Users/namir/.gemini/antigravity-ide/brain/d99372f4-137f-400c-8ca7-53cfb22560ee/.tempmediaStorage/media_1791313662732.jpg',
  'C:/Users/namir/.gemini/antigravity-ide/brain/4bc2bd3d-ccb4-4fd5-a1fa-496dd5ca5dd9/atelier_indigo_hero_1791225223047.jpg',
];

let heroCopied = false;
for (const src of heroCandidates) {
  if (fs.existsSync(src)) {
    const buf = fs.readFileSync(src);
    fs.writeFileSync(path.join(publicHeroDir, 'hero-atelier.jpg'), buf);
    fs.writeFileSync(path.join(publicHeroDir, 'atelier-indigo.jpg'), buf);
    console.log(`[SUCCESS] Copied atelier hero image from ${src} to public/images/hero/`);
    heroCopied = true;
    break;
  }
}

if (!heroCopied) {
  console.warn('[WARN] Could not find external hero source candidate.');
}

// 2. Copy product images
const productSourceDir = 'C:/Users/namir/.gemini/antigravity-ide/brain/162753e9-e443-47b9-9c9b-5a5b41ace49d';
if (fs.existsSync(productSourceDir)) {
  const files = fs.readdirSync(productSourceDir);
  for (const f of files) {
    if (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp')) {
      const srcPath = path.join(productSourceDir, f);
      const destPath = path.join(publicProductDir, f);
      fs.copyFileSync(srcPath, destPath);
      console.log(`[COPIED] ${f} -> public/images/products/`);
    }
  }
} else {
  console.log('[INFO] Product source dir not found, skipping products.');
}

console.log('[DONE] Asset sync complete.');
