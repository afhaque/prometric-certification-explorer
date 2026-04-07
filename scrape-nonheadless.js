const { chromium } = require('playwright');

const slugsToFind = [
  'aagathr','abcd-0','addcd','amdapp','amftrb','aousc','asqpaperko','att','autolift','awi','awitd','awstd','azcos',
  'bbsm','bpelsg','cafy_center','cafy_remote','california-bilingual-superior-court-employees','cals-center','cals-remote',
  'camlpr','carelink','cbapin','cbapsg','cbaptr','cbapuk','cbeip','ce-1','cels','certi','cffp1','cfpc','cgrn-practice',
  'chgta','chgw','chstc','comba','connecme','cpbc','cplcp','cpwm','csmls-test-drive','cvo','cwqap','dhca','dora.colorado',
  'ebaa','ebas','ecots','eescc','elsevierremote','elseviertestcenter','elsvr','ema','erpa','expertise-hub-co','fabi','fdp',
  'fom','gbta','gcclb','gisi','glcl','gord','hisi','hrpa-practice','hspa','htcc','hwccp','hwkmc','i1','ibsc','icoi','icva',
  'ifm','igns','infre','insurance-vt','ioa','iob','ipta','isba','isccm','kapl','kcfa','kmed','koni','kypi','lihs',
  'lsac-scheduling-notice','lti','mdceprod','mdceprov','merat','merat-practice','met-center','met-remote',
  'mi_assessment_retake','mia','msnicb','mss','mtsur','naccm','nafc','nahma','nala-launcher','nawccb','nbaa','nbbi',
  'ncca','nccsa','ncms','ncpp','ncratm','neec','neiep','nena','neta','nfpt','nga','ngma','nipr','nitc','nitc-launcher',
  'npra','nurseaide-al','nurseaide-ct','nurseaide-de','nurseaide-hi','nurseaide-id','nurseaide-la','nurseaide-ok',
  'ocp','ops','outs','paccc','pbaac','pcert','pdi','pebc-demos','plus','prbpo','qql','qwa','racc','ravadid','rlr',
  'saf','sawa','scatstb','sos','ssh','sto','tdm','theana','thkcd','tssa','ttbu','uop','vacc','vtceprov','webce','wpa','wpr','yswnb'
];

function extractLinksFromHtml(html) {
  const results = [];
  let htmlData = html;
  try {
    const parsed = JSON.parse(html);
    if (parsed.data) htmlData = parsed.data;
  } catch(e) {}
  const linkRegex = /href="https:\/\/www\.prometric\.com\/exams\/([^"]+)"[\s\S]*?<span>([^<]+)<\/span>/g;
  let m;
  while ((m = linkRegex.exec(htmlData)) !== null) {
    results.push({ slug: m[1].trim(), name: m[2].trim() });
  }
  return results;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,900'
    ]
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

  // Intercept API responses
  const allExams = {};
  page.on('response', async res => {
    if (res.url().includes('getexamsuggetion')) {
      try {
        const body = await res.text();
        const links = extractLinksFromHtml(body);
        for (const l of links) {
          allExams[l.slug] = l.name;
        }
        if (links.length > 0) {
          console.log('  API intercepted:', links.length, 'exams');
        }
      } catch(e) {}
    }
  });

  console.log('Loading page...');
  await page.goto('https://www.prometric.com/find-your-exam', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  const searchInput = await page.$('input[type="text"], input[type="search"]');
  if (!searchInput) {
    console.log('No search input found!');
    await browser.close();
    return;
  }

  console.log('Found search input. Starting bulk search...');

  // Get unique 2-letter prefixes of all slugs to minimize searches
  const uniqueStarters = [...new Set(slugsToFind.map(s => s.substring(0, 2).replace(/[_-]/g, '')))];
  console.log('Searching prefixes:', uniqueStarters.join(', '));

  for (const prefix of uniqueStarters) {
    process.stdout.write('Searching ' + prefix + '... ');
    await searchInput.click({ clickCount: 3 });
    await searchInput.type(prefix, { delay: 60 });
    await sleep(2000);

    // Also capture from DOM
    const resultLinks = await page.evaluate(function() {
      var links = Array.from(document.querySelectorAll('a[href*="/exams/"]'));
      return links.map(function(a) {
        return {
          href: a.href,
          text: (a.querySelector('span') || a).textContent.trim()
        };
      }).filter(function(l) { return l.text.length > 0; });
    });

    console.log('DOM results: ' + resultLinks.length);
    for (const l of resultLinks) {
      const slugMatch = l.href.match(/\/exams\/([^/?#]+)/);
      if (slugMatch) {
        allExams[slugMatch[1]] = l.text;
      }
    }

    await sleep(400);
  }

  // Build mapping
  const mapping = {};
  for (const slug of slugsToFind) {
    if (allExams[slug]) {
      mapping[slug] = allExams[slug];
    }
  }

  const notFound = slugsToFind.filter(s => !allExams[s]);
  console.log('\nFound so far:', Object.keys(mapping).length);
  console.log('Not found:', notFound.length, notFound.slice(0, 20));

  // Search for not-found slugs directly by slug name
  console.log('\nSearching remaining slugs directly...');
  for (const slug of notFound) {
    process.stdout.write('Searching slug "' + slug + '"... ');
    await searchInput.click({ clickCount: 3 });
    await searchInput.type(slug, { delay: 30 });
    await sleep(1800);

    const resultLinks = await page.evaluate(function() {
      var links = Array.from(document.querySelectorAll('a[href*="/exams/"]'));
      return links.map(function(a) {
        return {
          href: a.href,
          text: (a.querySelector('span') || a).textContent.trim()
        };
      }).filter(function(l) { return l.text.length > 0; });
    });

    let foundThis = false;
    for (const l of resultLinks) {
      const slugMatch = l.href.match(/\/exams\/([^/?#]+)/);
      if (slugMatch && slugMatch[1] === slug) {
        allExams[slug] = l.text;
        mapping[slug] = l.text;
        foundThis = true;
        console.log('FOUND: ' + l.text);
        break;
      }
    }
    if (!foundThis) {
      console.log('not found (' + resultLinks.length + ' results shown)');
    }
    await sleep(300);
  }

  console.log('\n=== FINAL MAPPING ===');
  console.log(JSON.stringify(mapping, null, 2));

  const stillNotFound = slugsToFind.filter(s => !mapping[s]);
  console.log('\n=== STILL NOT FOUND (' + stillNotFound.length + ') ===');
  console.log(JSON.stringify(stillNotFound));

  await browser.close();
}

main().catch(function(e) { console.error('FATAL:', e.message); process.exit(1); });
