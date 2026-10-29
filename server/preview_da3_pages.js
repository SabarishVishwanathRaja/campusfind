const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlFile = path.resolve(__dirname, 'da3_preview.html');
const outDir = path.resolve(__dirname, '../pdf_previews/da3');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function renderPages() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlFile}`, { waitUntil: 'domcontentloaded' });

  const pageEls = await page.$$('.page');
  console.log(`Found ${pageEls.length} pages.`);

  for (let i = 0; i < pageEls.length; i++) {
    const el = pageEls[i];
    const outPath = path.join(outDir, `page_${i + 1}.png`);
    await el.screenshot({ path: outPath });
    console.log(`Captured da3 page_${i + 1}.png`);
  }

  await browser.close();
}

renderPages().catch(console.error);
