// Optional browser smoke test: use a running Expo web export via HOWLPAY_TEST_URL.
// Supply PLAYWRIGHT_MODULE if Playwright is installed outside this repo. Fictional edits only.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 for(const width of [320,390,430]){
 const page=await browser.newPage({viewport:{width,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.HOWLPAY_TEST_URL || 'http://127.0.0.1:8091');
 const button=name=>page.getByRole('button',{name,exact:true});
 const tab=name=>page.getByRole('tab',{name,exact:true});
 await tab('Assistant').click();
 await button('CLM–001 · Small-shop recovery').click();
 await tab('Claims').click();
 await button('Demo settings and operator instructions').click();
 await button('Shop').click();
 await button('Close demo controls').click();
 await button('View claim progress →').click();
 await tab('Assistant').click();
 await page.getByLabel('Message',{exact:true}).fill('What documents do I need?');
 await button('Send message').click();
 assert.ok((await page.locator('body').innerText()).includes('Banking stays unresolved'));
 await page.getByLabel('Message',{exact:true}).fill('There was a fire on 2026-11-13. I lost R200 of stock.');
 await button('Send message').click();
 await button('Confirm and save draft').waitFor();
 assert.equal(await button('Send message').isDisabled(),true);
 await tab('Activity').click();
 await tab('Assistant').click();
 await button('Confirm and save draft').click();
 await tab('Claims').click();
 await button('Preparation').click();
 await page.getByText('Generic claim preparation form — demonstration',{exact:true}).waitFor();
 await button('Edit fictional form').click();
 await page.getByLabel('Requested amount (ZAR)',{exact:true}).fill('220.00');
 await button('Confirm form changes').click();
 await page.getByRole('switch',{name:'Repairs claimed',exact:true}).click();
 await button('Prepare demo pack').click();
 await page.getByText('Off-chain preparation digest',{exact:true}).waitFor();
 await button('Preview bundle JSON').click();
 assert.ok((await page.locator('body').innerText()).includes('220.00'));
 await page.screenshot({path:'/tmp/howlpay-preparation-'+width+'.png'});
 await button('Demo settings and operator instructions').click();
 await button('Broker').click();
 await button('Close demo controls').click();
 await button('Draft document follow-up').click();
 assert.match(await page.getByLabel('Follow-up message for manual review').inputValue(),/Repair quotations/);
 await tab('Assistant').click();
 await page.getByLabel('Message',{exact:true}).fill('Prepare broker handoff');
 await button('Send message').click();
 assert.ok((await page.locator('body').innerText()).includes('220.00'));
 await page.screenshot({path:'/tmp/howlpay-assistant-'+width+'.png'});
 const nav=await tab('Assistant').boundingBox(); assert.ok(nav.y+nav.height<=844);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 assert.equal(overflow,false);
 await tab('Activity').click();await tab('Claims').click();await button('Settlement').click();
 await page.screenshot({path:'/tmp/howlpay-settlement-'+width+'.png'});
 console.log(JSON.stringify({width,errors,overflow,flow:'passed'}));
 assert.deepEqual(errors,[]);
 await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)})
