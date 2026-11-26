const {launch,assert}=require('./chapter5-test-utils.cjs');
(async()=>{
 const h=await launch('replies');let f;
 try{
  await h.page.addInitScript(scope=>{if(window===top&&!localStorage.getItem(scope+'uppdrag1700.side-adventures.v1'))localStorage.setItem(scope+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{5:{thief:'won',thiefSeen:true,witness:'unseen',history:[]}}}));},h.scope);
  await h.boot();f=h.frame;await h.page.setViewportSize({width:390,height:844});await h.room('palace');await h.greet();
  for(let i=0;i<6&&!await f.locator('[data-adventure="room:later"]').count();i++)await f.locator('.ad-utterance').click();
  assert.notEqual(await f.locator('#adventureReplies').evaluate(e=>e.style.top),'','mobile room choices move clear of the player');await h.speechClose();
  await f.evaluate(()=>{leaveInterior();UPPDRAG_CH5_CITY_LIFE.suspend();player={x:1005,y:713};path=[];camera={...player};draw();});await f.waitForTimeout(100);
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openWitness()),true);
  for(let i=0;i<6&&!await f.locator('[data-adventure="kind"]').count();i++)await f.locator('.ad-utterance').click();
  assert.equal(await f.locator('#adventureReplies').evaluate(e=>e.style.top),'','a new street conversation resets the room placement');
  assert.equal(await f.locator('#adventureReplies').evaluate(e=>getComputedStyle(e).bottom),'12px');
  await f.locator('[data-adventure="kind"]').click();await h.speechClose();
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 5 mobile transition: displaced room choices reset before the child’s street conversation');
 }catch(e){console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
