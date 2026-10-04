import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const widths = [360, 390, 768, 1440];
  const urls = [
    { path: '/', name: 'home' },
    { path: '/drop-01', name: 'drop-01' },
    { path: '/product/atelier-jacket-01', name: 'product' },
    { path: '/residents/1', name: 'resident' }
  ];

  const outDir = path.join(process.cwd(), 'docs', 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const url of urls) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`http://localhost:3000${url.path}`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(outDir, `${url.name}-${width}.png`), fullPage: true });
      console.log(`Screenshot taken for ${url.path} at ${width}px`);
    }
  }

  await browser.close();
}

run().catch(console.error);
