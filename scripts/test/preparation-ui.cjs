// Optional headless web checks. HOWLPAY_TEST_URL points to an Expo web export.
// All RPC responses below are controlled fixtures, never live payment evidence.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async () => {
 const { CLAIM_TOKEN, DEMO_ESCROW, DEMO_PACK_HASH, DEMO_PAYEE, ESCROW_DEPLOY_TX } = await import('../../shared/claims.ts');
 const { openedTopic, paidTopic } = await import('../../app/src/claim-receipt.ts');
 const hex = n => BigInt(n).toString(16).padStart(64,'0'), addr = a => a.slice(2).padStart(64,'0');
 const openHash='0x'+'1'.repeat(64), paidHash='0x'+'2'.repeat(64);
 const browser=await chromium.launch({headless:true});
 try { for (const width of [320,390,430,1280]) {
  const page=await browser.newPage({viewport:{width,height:900}}); const errors=[], methods=[]; let fail=false;
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://ethereum-sepolia-rpc.publicnode.com/', async route=>{
   const {method,params,id}=route.request().postDataJSON();methods.push(method);
   if(fail) return route.abort();
   let result;
   if(method==='eth_chainId') result='0xaa36a7';
   else if(method==='eth_blockNumber') result='0x22';
   else if(method==='eth_call') result=params[0].data==='0xfc0c546a'?'0x'+addr(CLAIM_TOKEN):DEMO_PACK_HASH+addr(DEMO_PAYEE)+hex(12074452)+hex(2);
   else if(method==='eth_getLogs') result=JSON.stringify(params).includes(openedTopic)?[{topics:[openedTopic,'0x'+hex(1),DEMO_PACK_HASH,'0x'+addr(DEMO_PAYEE)],data:'0x'+hex(12074452)+addr(DEMO_PAYEE),transactionHash:openHash,blockNumber:'0x20'}]:[{topics:[paidTopic,'0x'+hex(1),'0x'+addr(DEMO_PAYEE),'0x'+addr(DEMO_PAYEE)],data:'0x'+hex(12074452),transactionHash:paidHash,blockNumber:'0x21'}];
   else if(method==='eth_getTransactionReceipt') result=params[0]===ESCROW_DEPLOY_TX?{status:'0x1',contractAddress:DEMO_ESCROW,blockNumber:'0x10'}:{status:'0x1',to:DEMO_ESCROW,blockNumber:params[0]===openHash?'0x20':'0x21'};
   else throw Error('Unexpected RPC '+method);
   return route.fulfill({contentType:'application/json',body:JSON.stringify({jsonrpc:'2.0',id,result})});
  });
  await page.goto(process.env.HOWLPAY_TEST_URL||'http://127.0.0.1:8094');
  const button=name=>page.getByRole('button',{name,exact:true}); const tab=name=>page.getByRole('tab',{name,exact:true});
  const role=async name=>{await button('Demo controls').click();await button(name).click()};
  const text=()=>page.locator('body').innerText();
  const noOverflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await button('Try the demo').waitFor();await noOverflow();await page.screenshot({path:'/tmp/howlpay-landing-'+width+'.png',fullPage:true});
  await button('Try the demo').click();assert.match(await text(),/FICTIONAL DEMO · Shop view/);
  await button('Help me answer').click();await page.getByLabel('Message',{exact:true}).fill('There was a theft on 2026-11-13. I lost R240 of stock.');await button('Send message').click();await button('Confirm and save draft').waitFor();
  await tab('Claim').click();assert.match(await text(),/R200.00/);await button('Help me answer').click();await button('Confirm and save draft').click();
  await tab('Claim').click();assert.match(await text(),/R240/);
  await role('Broker');assert.equal(await button('Mark ready for insurer').isDisabled(),true);
  await role('Shop');await tab('Requests').click();await page.getByLabel('Fictional police reference response').fill('DEMO-CAS-123');await button('Send response to demo broker').click();
  await role('Broker');await button('Request clarification').click();assert.match(await text(),/clarification needed/);
  await role('Shop');await page.getByLabel('Fictional police reference response').fill('DEMO-CAS-123, reported 13 Nov');await button('Send response to demo broker').click();await role('Broker');await button('Accept response').click();
  await tab('Claim').click();await button('Review form and evidence').click();await button('Add fictional policy schedule').click();await button('Add fictional damage photos').click();
  assert.equal(await button('Mark ready for insurer').isDisabled(),false);await button('Mark ready for insurer').click();
  await button('Edit fictional form').click();await page.getByLabel('Requested amount (ZAR)',{exact:true}).fill('260.00');await button('Confirm form changes').click();assert.equal(await button('Simulate submission to insurer').count(),0);assert.match(await text(),/Renew broker review/);
  await button('Mark ready for insurer').click();await button('Simulate submission to insurer').click();await role('Insurer');await page.getByLabel('Illustrative approved amount (ZAR)').fill('180');await button('Illustrate approval').click();assert.match(await text(),/Illustrative approved amount: R180/);assert.match(await text(),/No payout for this theft claim/);
  await button('Existing testnet payment example').click();await page.getByText('Test-token settlement confirmed',{exact:true}).waitFor();
  fail=true;await button('Re-check settlement').click();await page.getByText(/Showing a stale, previously verified receipt/).waitFor();assert.match(await text(),/STALE/);
  await noOverflow();await page.screenshot({path:'/tmp/howlpay-progress-'+width+'.png',fullPage:true});
  await role('Broker');await tab('Claim').click();await button('Edit fictional form').click();await page.getByLabel('Requested amount (ZAR)',{exact:true}).fill('280');await button('Confirm form changes').click();await tab('Progress').click();await button('View submission versions').click();assert.match(await text(),/Requested R260.00/);
  await tab('Claim').click();await button('Mark ready for insurer').click();await button('Simulate submission to insurer').click();await role('Insurer');await button('Illustrate rejection').click();assert.match(await text(),/Illustrative rejection/);
  await role('Shop');await tab('Claim').click();await button('Help me answer').click();assert.match(await text(),/I lost R240/);
  await page.setViewportSize({width,height:600});await page.getByLabel('Message',{exact:true}).focus();assert.equal(await page.getByLabel('Message',{exact:true}).evaluate(el=>el===document.activeElement),true);
  await page.evaluate(()=>{const sizes=[...document.querySelectorAll('*')].map(el=>[el,parseFloat(getComputedStyle(el).fontSize),parseFloat(getComputedStyle(el).lineHeight)]);for(const [el,size,line] of sizes){el.style.fontSize=size*1.5+'px';if(Number.isFinite(line))el.style.lineHeight=line*1.5+'px'}});
  await noOverflow();const nav=await tab('Progress').boundingBox();assert.ok(nav.y+nav.height<=600);
  await tab('Claim').click();await button('Demo controls').click();await button('Reset fictional demo').click();assert.match(await text(),/R200.00/);assert.match(await text(),/Preparation · Draft/);
  assert.ok(methods.length>0);assert.ok(methods.every(m=>!(/send|sign/i.test(m))));assert.deepEqual(errors,[]);
  console.log(JSON.stringify({width,flow:'passed',receipt:'mocked + stale refresh',overflow:false,errors}));await page.close();
 }} finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
