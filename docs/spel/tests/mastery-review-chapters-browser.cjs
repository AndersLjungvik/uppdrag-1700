const {launch,assert}=require('./chapter4-test-utils.cjs');
(async()=>{const h=await launch('review-chapters');try{
 for(const chapter of [1,2,3,4,5]){
  const url=new URL(h.url);url.searchParams.set('chapter',chapter);url.searchParams.set('teacher','1');
  await h.page.goto(url.href,{waitUntil:'domcontentloaded',timeout:60000});
  await h.page.waitForFunction(ch=>document.getElementById('error')?.textContent||(document.getElementById('game')?.contentWindow?.['UPPDRAG_CH'+ch+'_PILOT']&&document.getElementById('status')?.textContent.startsWith('Kapitel '+ch+' av 10')),chapter,{timeout:45000});
  assert.equal(await h.page.locator('#error').innerText(),'');const f=await(await h.page.locator('#game').elementHandle()).contentFrame();
  assert.equal(await f.evaluate(()=>!!window.UPPDRAG_MASTERY_REVIEW),true);
  assert.equal(await f.evaluate(()=>visitStagingRoom('archive','main')),true);await f.waitForTimeout(80);
  assert.equal(await f.evaluate(ch=>window['UPPDRAG_CH'+ch+'_PILOT'].enterArchive(),chapter),true);
  await f.locator('[data-rc-field="0"]').fill('Jag vill jämföra svaret med mina anteckningar.');await f.locator('[data-action="rc-submit"]').click();
  await f.locator('[data-action="rc-save-review"]').click();
  const result=await f.evaluate(ch=>{const p=window['UPPDRAG_CH'+ch+'_PILOT'];return {queue:p.state.reviewQueue.length,practice:p.state.recallPendingReview.length,stamps:UPPDRAG_MASTERY.summary().done};},chapter);
  assert.deepEqual(result,{queue:0,practice:1,stamps:0});console.log('PASS chapter',chapter,'Rut review at introduction stays separate from mastery');
 }
 assert.deepEqual(h.errors,[]);
}finally{await h.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
