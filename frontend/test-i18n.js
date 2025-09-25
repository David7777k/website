const puppeteer = require('puppeteer');

(async () => {
  const url = process.env.URL || 'http://localhost:3000';
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  // wait longer for CRA to boot and HMR to settle
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

  // ensure root element is present
  await page.waitForSelector('#root', { timeout: 30000 }).catch(() => null);

  // wait for the header or nav to appear
  const langExists = await page.waitForSelector('.lang-switcher', { timeout: 15000 }).catch(() => null);

  if (!langExists) {
    console.log('lang-switcher not found in DOM');
  }

  // get language buttons if present
  const langs = await page.$$eval('.lang-switcher button', els => els.map(e => e.textContent.trim())).catch(() => []);
  console.log('lang buttons:', langs);

  // get nav links
  const navBefore = await page.$$eval('.nav .nav-link', els => els.map(e => e.textContent.trim())).catch(() => []);
  console.log('navBefore sample:', navBefore.slice(0, 5));

  if (langs.length >= 2) {
    // click second lang (UK)
    await page.click('.lang-switcher button:nth-child(2)').catch(() => null);

    // wait for nav text to change (compare first link)
    const changed = await page.waitForFunction(
      (old) => {
        const el = document.querySelector('.nav .nav-link');
        return el && el.textContent.trim() !== old;
      },
      { timeout: 5000 }, navBefore[0] || ''
    ).catch(() => null);

    const navAfter = await page.$$eval('.nav .nav-link', els => els.map(e => e.textContent.trim())).catch(() => []);
    console.log('navAfter sample:', navAfter.slice(0,5));
    console.log('change detected:', !!changed);
  } else {
    console.log('not enough lang buttons to test click');
  }

  await browser.close();
})();