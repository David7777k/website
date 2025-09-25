const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  const url = process.env.URL || 'http://localhost:3000';
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const logs = [];
  page.on('console', msg => logs.push({type: 'console', text: msg.text()}));
  page.on('pageerror', err => logs.push({type: 'pageerror', text: err.message, stack: err.stack}));
  page.on('requestfailed', req => logs.push({type: 'requestfailed', url: req.url(), reason: req.failure && req.failure.errorText}));

  await page.setViewport({width: 1200, height: 900});
  try {
    await page.goto(url, {waitUntil: 'networkidle2', timeout: 60000});
  } catch(e) {
    logs.push({type: 'goto-error', text: e.message});
  }

  // universal sleep using evaluate (works across puppeteer versions)
  await page.evaluate(() => new Promise(res => setTimeout(res, 2000)));

  const html = await page.content();
  fs.writeFileSync('audit-html.html', html);
  await page.screenshot({path: 'audit-screenshot.png', fullPage: true});
  fs.writeFileSync('audit-logs.json', JSON.stringify(logs, null, 2));

  console.log('audit saved: audit-html.html, audit-screenshot.png, audit-logs.json');
  await browser.close();
})();