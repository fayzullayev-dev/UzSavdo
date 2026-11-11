const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const outDir = path.join(__dirname, '..', 'docs', 'screenshots', 'v3');

  console.log('1. Capturing Admin Dashboard...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '01_admin_dashboard.png'), fullPage: true });

  console.log('2. Capturing Ratings page...');
  await page.goto('http://localhost:3000/ratings', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '02_ratings_page.png'), fullPage: true });

  console.log('3. Capturing Listing Details & Russian translation...');
  await page.goto('http://localhost:3000/listings/740c4809-466b-479f-ae81-69ce5ba06562', { waitUntil: 'networkidle' });
  // switch to RU
  const ruBtn = await page.getByRole('button', { name: 'RU' });
  if (await ruBtn.isVisible()) {
    await ruBtn.click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(outDir, '03_listing_detail_ru.png'), fullPage: true });

  console.log('4. Capturing Catalog in RU...');
  await page.goto('http://localhost:3000/listings', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '04_listings_catalog_ru.png'), fullPage: true });

  await browser.close();
  console.log('Screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
