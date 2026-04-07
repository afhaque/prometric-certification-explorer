const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
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
  
  // Capture all network requests
  const apiCalls = [];
  page.on('request', req => {
    if (req.url().includes('api') || req.url().includes('search') || req.url().includes('exam') || req.url().includes('sponsor')) {
      apiCalls.push({ url: req.url(), method: req.method() });
    }
  });
  page.on('response', async res => {
    if (res.url().includes('api') || res.url().includes('search') || res.url().includes('exam')) {
      try {
        const ct = res.headers()['content-type'] || '';
        if (ct.includes('json')) {
          const body = await res.text().catch(() => '');
          if (body.length < 50000) {
            console.log('API JSON response:', res.url());
            console.log(body.substring(0, 2000));
          }
        }
      } catch(e) {}
    }
  });
  
  console.log('Navigating...');
  await page.goto('https://www.prometric.com/find-your-exam', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  
  // Find search box and type something
  const searchInput = await page.$('input[type="text"], input[type="search"], input[placeholder*="search" i], input[placeholder*="exam" i]');
  if (searchInput) {
    console.log('Found search input, typing...');
    await searchInput.click();
    await searchInput.type('nursing', { delay: 100 });
    await page.waitForTimeout(3000);
  } else {
    console.log('No search input found');
    // Log all inputs
    const inputs = await page.$$eval('input', els => els.map(e => ({ type: e.type, placeholder: e.placeholder, id: e.id, name: e.name })));
    console.log('Inputs:', JSON.stringify(inputs));
  }
  
  await page.screenshot({ path: '/tmp/prometric3.png' });
  
  // Get results
  const body = await page.evaluate(() => document.body.innerText);
  console.log('Body after search:\n', body.substring(0, 3000));
  
  console.log('\nAll API calls captured:', JSON.stringify(apiCalls, null, 2));
  
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
