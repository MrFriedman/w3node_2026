// Controlled transport test. Export web with EXPO_PUBLIC_ASSISTANT_URL=http://127.0.0.1:8788.
// Serve that export locally; set HOWLPAY_TEST_URL. No live model or payment is used.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 844 } });
    let calls = 0;
    let complete;
    await page.route('http://127.0.0.1:8788/intake', async route => {
      calls++;
      if (calls === 1) return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
      await new Promise(resolve => { complete = resolve; });
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ mode: 'fixture', fields: { incident: 'fire', loss: '240' } }) });
    });
    await page.goto(process.env.HOWLPAY_TEST_URL || 'http://127.0.0.1:8092');
    const tab = name => page.getByRole('tab', { name, exact: true });
    const button = name => page.getByRole('button', { name, exact: true });
    await button('Try the demo').click();
    await button('Help me answer').click();
    const message = 'There was a fire. I lost R240.';
    await page.getByLabel('Message', { exact: true }).fill(message);
    await button('Send message').click();
    await button('Retry message').click();
    await page.getByText('Working…', { exact: true }).waitFor();
    await tab('Progress').and(page.locator('[aria-disabled="true"]')).waitFor();
    assert.equal(await tab('Progress').isDisabled(), true);
    while (!complete) await new Promise(resolve => setTimeout(resolve, 10));
    complete();
    await button('Confirm and save draft').waitFor();
    assert.equal(await page.getByText(message, { exact: true }).count(), 1);
    assert.equal(calls, 2);
    await tab('Progress').click();
    await tab('Claim').click();
    await button('Help me answer').click();
    await button('Confirm and save draft').click();
    assert.equal(await button('Confirm and save draft').count(), 0);
    await tab('Claim').click();
    await button('Review form and evidence').click();
    assert.ok((await page.locator('body').innerText()).includes('240'));
    // Desktop focus and reduced available height are only keyboard approximations.
    await tab('Claim').click();
    await button('Help me answer').click();
    await page.setViewportSize({ width: 320, height: 520 });
    await page.getByLabel('Message', { exact: true }).focus();
    const nav = await tab('Progress').boundingBox();
    assert.ok(nav.y + nav.height <= 520);
    await page.evaluate(() => {
      const sizes = [...document.querySelectorAll('*')].map(el => [el, parseFloat(getComputedStyle(el).fontSize)]);
      for (const [el, size] of sizes) el.style.fontSize = size * 1.5 + 'px';
    });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    console.log('Retry, pending navigation lock, proposal persistence, single confirmation, desktop focus and enlarged-text overflow checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
