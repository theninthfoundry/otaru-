import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext();
  const page = await context.newPage();

  const breakpoints = [
    { width: 1920, height: 1080, name: '1920x1080' },
    { width: 1440, height: 900, name: '1440x900' },
    { width: 1024, height: 768, name: '1024x768' },
    { width: 768, height: 1024, name: '768x1024' },
    { width: 390, height: 844, name: '390x844' },
    { width: 360, height: 800, name: '360x800' },
  ];

  const outDir = path.join(process.cwd(), 'docs', 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const bp of breakpoints) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Scroll down to the footer
    await page.evaluate(() => {
      const footer = document.querySelector('footer[aria-label="House of Otaru Editorial Archive"]') || document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'instant', block: 'end' });
      } else {
        window.scrollTo(0, document.body.scrollHeight);
      }
    });

    // Wait a brief moment for any layout transitions
    await page.waitForTimeout(500);

    const footerElement = await page.$('footer[aria-label="House of Otaru Editorial Archive"]') || await page.$('footer');
    if (footerElement) {
      await footerElement.screenshot({
        path: path.join(outDir, `footer-${bp.name}.png`),
      });
      console.log(`✓ Captured footer screenshot: ${bp.name}`);
    } else {
      await page.screenshot({
        path: path.join(outDir, `page-${bp.name}.png`),
        fullPage: false,
      });
      console.log(`✓ Captured fallback screenshot: ${bp.name}`);
    }
  }

  await browser.close();
  console.log('All footer breakpoint screenshots captured successfully.');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
