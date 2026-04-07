const { chromium } = require('playwright');

(async () => {
  // Use non-headless chromium with stealth-like settings
  const browser = await chromium.launch({ 
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
    ]
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
  });
  
  const page = await context.newPage();
  
  // Remove webdriver flag
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  
  console.log('Navigating...');
  await page.goto('https://www.prometric.com/find-your-exam', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('Waiting 10s for JS...');
  await page.waitForTimeout(10000);
  
  await page.screenshot({ path: '/tmp/prometric2.png' });
  console.log('Title:', await page.title());
  
  const body = await page.evaluate(() => document.body.innerText);
  console.log('Body preview:\n', body.substring(0, 2000));
  
  // Get all links
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({ 
      href: a.href, text: a.textContent.trim().substring(0,100) 
    })).filter(l=>l.text);
  });
  console.log('Links count:', links.length);
  console.log('Links sample:', JSON.stringify(links.slice(0, 20), null, 2));
  
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
