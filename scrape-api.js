const https = require('https');

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

function postRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://www.prometric.com',
        'Referer': 'https://www.prometric.com/find-your-exam',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
    req.write(postData);
    req.end();
  });
}

function extractLinks(html) {
  const results = [];
  // Match href and span text
  const linkRegex = /href="https:\/\/www\.prometric\.com\/exams\/([^"]+)"[^>]*>[\s\S]*?<span>([^<]+)<\/span>/g;
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    results.push({ slug: m[1], name: m[2].trim() });
  }
  return results;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const results = {};
  
  // First let's try searching for a batch - search the suggestion endpoint
  // The API takes a search term and returns matching exams
  // Let's first do a broad search to get all exams
  
  // Try to get ALL exams by searching empty string or common terms
  console.log('Trying broad search...');
  try {
    const resp = await postRequest('https://www.prometric.com/actions/wbd/resourcefeed/getexamsuggetion', {
      search: '',
      lang: 'en'
    });
    console.log('Status:', resp.status);
    console.log('Response (first 1000):', resp.body.substring(0, 1000));
    const links = extractLinks(resp.body);
    console.log('Links found from empty search:', links.length, links.slice(0, 5));
  } catch(e) {
    console.log('Empty search error:', e.message);
  }
  
  await sleep(1000);
  
  // Try the full exam search endpoint (different from suggestion)
  console.log('\nTrying full exam search...');
  try {
    const resp = await postRequest('https://www.prometric.com/actions/wbd/resourcefeed/getexamsearch', {
      search: '',
      lang: 'en'
    });
    console.log('Status:', resp.status);
    console.log('Response (first 1000):', resp.body.substring(0, 1000));
  } catch(e) {
    console.log('Full search error:', e.message);
  }
}

main().catch(console.error);
