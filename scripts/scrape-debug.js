const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  
  // Capture response from suggestion API
  let capturedResponse = null;
  page.on('response', async res => {
    if (res.url().includes('getexamsuggetion')) {
      try {
        capturedResponse = await res.text();
        console.log('Captured API response:', capturedResponse.substring(0, 2000));
      } catch(e) {}
    }
  });
  
  await page.goto('https://www.prometric.com/find-your-exam', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  
  // Find search input and type
  const searchInput = await page.$('input[type="text"], input[type="search"]');
  if (searchInput) {
    await searchInput.click();
    await searchInput.type('nursing', { delay: 80 });
    await page.waitForTimeout(3000);
    console.log('Typed nursing, captured:', capturedResponse ? 'yes' : 'no');
    
    // Now try fetch directly
    const fetchResult = await page.evaluate(async () => {
      const r = await fetch('/actions/wbd/resourcefeed/getexamsuggetion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ search: 'nursing', lang: 'en' })
      });
      return { status: r.status, body: await r.text() };
    });
    console.log('\nDirect fetch result status:', fetchResult.status);
    console.log('Direct fetch body (first 2000):', fetchResult.body.substring(0, 2000));
  }
  
  await browser.close();
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
