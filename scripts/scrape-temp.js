const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  console.log('Navigating...');
  await page.goto('https://www.prometric.com/find-your-exam', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('Waiting for JS...');
  await page.waitForTimeout(8000);
  
  await page.screenshot({ path: '/tmp/prometric1.png' });
  console.log('Screenshot saved');
  console.log('Title:', await page.title());
  
  // Get all anchor links
  const allLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({ 
      href: a.href, 
      text: a.textContent.trim().substring(0, 100) 
    })).filter(l => l.text.length > 0);
  });
  console.log('Total links:', allLinks.length);
  
  // Look for exam-related links
  const examLinks = allLinks.filter(l => 
    l.href.includes('/test-takers/') || 
    l.href.includes('/exam/') ||
    l.href.includes('slug') ||
    l.href.includes('sponsor')
  );
  console.log('Exam links found:', examLinks.length);
  console.log('Sample exam links:', JSON.stringify(examLinks.slice(0, 20), null, 2));
  
  // Body text
  const body = await page.evaluate(() => document.body.innerText);
  console.log('\nBODY (first 5000):\n', body.substring(0, 5000));
  
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
