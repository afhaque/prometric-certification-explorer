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
  // Match href and span text from the suggestion API
  const linkRegex = /href="https:\/\/www\.prometric\.com\/exams\/([^"]+)"[\s\S]*?<span>([^<]+)<\/span>/g;
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    results.push({ slug: m[1].trim(), name: m[2].trim() });
  }
  return results;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

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
  
  console.log('Loading page...');
  await page.goto('https://www.prometric.com/find-your-exam', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  
  console.log('Page loaded. Getting cookies and headers...');
  
  // Get cookies
  const cookies = await context.cookies();
  const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  
  const results = {};
  const allFound = {};
  
  // Function to search via fetch in browser context
  async function searchInBrowser(query) {
    const response = await page.evaluate(async (q) => {
      try {
        const r = await fetch('/actions/wbd/resourcefeed/getexamsuggetion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ search: q, lang: 'en' })
        });
        return { status: r.status, body: await r.text() };
      } catch(e) {
        return { error: e.message };
      }
    }, query);
    return response;
  }
  
  // First, try to get all exams with common letter searches
  console.log('\nSearching for all exams by letter...');
  const allExams = {};
  
  // Search with single characters to get broad results
  const searchTerms = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
  
  for (const term of searchTerms) {
    process.stdout.write(`Searching '${term}'... `);
    try {
      const resp = await searchInBrowser(term);
      if (resp.error) {
        console.log('Error:', resp.error);
        continue;
      }
      const links = extractLinksFromHtml(resp.body);
      console.log(`found ${links.length} exams`);
      for (const l of links) {
        allExams[l.slug] = l.name;
      }
    } catch(e) {
      console.log('Exception:', e.message);
    }
    await sleep(300);
  }
  
  console.log('\n\nAll unique exams found:', Object.keys(allExams).length);
  console.log('\nMapping for requested slugs:');
  
  const mapping = {};
  for (const slug of slugsToFind) {
    if (allExams[slug]) {
      mapping[slug] = allExams[slug];
    }
  }
  
  console.log('\nFOUND MAPPING:');
  console.log(JSON.stringify(mapping, null, 2));
  
  console.log('\nNOT FOUND slugs:', slugsToFind.filter(s => !allExams[s]));
  
  console.log('\nFULL EXAM LIST:');
  console.log(JSON.stringify(allExams, null, 2));
  
  await browser.close();
}

main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
