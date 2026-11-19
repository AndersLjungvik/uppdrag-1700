const {launch,assert,fs,path}=require('./chapter5-test-utils.cjs');
(async()=>{
 const h=await launch('bookwork');let f;
 const resources=()=>f.evaluate(()=>({daler:UPPDRAG_CH5_PILOT.state.daler,record:UPPDRAG_CH5_PILOT.state.record.length,stamps:UPPDRAG_MASTERY.summary().done}));
 const key='uppdrag1700.ch5-book-writing.v1';
 async function answer(){const t=await f.evaluate(()=>UPPDRAG_CH5_PILOT.recall.current);await f.locator('[data-rc-field="0"]').fill(t.fields[0].sample);await f.locator('[data-action="rc-submit"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH5_PILOT.recall.ui.phase),'feedback',t.id);await f.locator('[data-action="rc-next"]').click();}
 try{
  await h.boot();f=h.frame;const before=await resources();
  await h.room('church');assert.equal(await f.evaluate(()=>UPPDRAG_CH5_BOOKWORK.open()),false);
  await h.room('palace');await h.greet();await h.choose('writing');await f.locator('#ch5Bookwork').waitFor({state:'visible'});
  assert.equal(await f.evaluate(()=>UPPDRAG_CH5_PILOT.studyBusy),true);assert.equal(await f.evaluate(()=>UPPDRAG_CH5_SCENES.travel('print')),false);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openThief()),false);
  assert.equal(await f.locator('.bw-support').count(),0);assert.equal(await f.locator('#ch5Bookwork textarea').count(),2);
  const titles=['Vad var upplysningen?','Rätta påståendet om straffen','Varför både omtyckt och kritiserad?','Ny lag – men samma vardag?','Religionsfrihet med villkor'];
  for(let i=0;i<titles.length;i++){
   assert.equal(await f.locator('#ch5Bookwork h2').innerText(),titles[i]);
   await f.locator('#bw-0').fill('Min egen förklaring på blad '+i+'.');await f.locator('[data-bw="support"]').click();assert.equal(await f.locator('.bw-support').count(),1);
   if(i<titles.length-1)await f.locator('[data-bw="next"]').click();
  }
  assert.equal(await f.locator('[data-bw="next"]').isDisabled(),true);assert.deepEqual(await resources(),before);
  await f.locator('#ch5Bookwork').press('Escape');assert.equal(await f.locator('#ch5Bookwork').count(),0);assert.equal(await f.evaluate(()=>roomView.style.visibility!=='hidden'),true);
  await h.boot();f=h.frame;await h.room('archive');await h.greet();await h.choose('writing');assert.match(await f.locator('#bw-0').inputValue(),/blad 0/);assert.equal(await f.locator('.bw-support').count(),1);
  await h.page.setViewportSize({width:390,height:844});await h.page.emulateMedia({reducedMotion:'reduce'});assert.equal(await f.locator('.bw-sheet').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
  await f.locator('#bw-0').press('Enter');assert.equal(await f.locator('#ch5Bookwork').count(),1,'Enter remains text editing');
  await f.locator('[data-bw="support"]').focus();await f.locator('[data-bw="support"]').press('Enter');assert.equal(await f.locator('.bw-support').count(),1);
  fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ch5-bookwork-mobile.png')});
  await h.page.setViewportSize({width:844,height:390});assert.equal(await f.locator('.bw-sheet').evaluate(e=>e.scrollWidth<=e.clientWidth),true);await h.page.screenshot({path:path.join(h.root,'qa/ch5-bookwork-landscape.png')});await f.locator('#ch5Bookwork').press('Escape');
  await h.greet();await h.choose('terms');const seen=[],apples=await f.evaluate(()=>UPPDRAG_CH5_PILOT.state.apples);
  for(let round=0;round<3;round++){
   let guard=0;while(await f.evaluate(()=>UPPDRAG_CH5_PILOT.state.archiveMode!=='reward')){assert(++guard<5);seen.push(await f.evaluate(()=>UPPDRAG_CH5_PILOT.recall.current.id));await answer();}
   if(round<2)await f.locator('[data-action="rc-rut-again"]').click();
  }
  assert.equal(seen.length,7);assert.equal(new Set(seen).size,7);assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH5_PILOT.materialReviewProgress()),{done:7,total:7});assert.equal(await f.evaluate(()=>UPPDRAG_CH5_PILOT.state.apples),apples+3);assert.deepEqual(await resources(),before);await f.locator('[data-action="rc-rut-exit"]').click();
  await h.page.locator('#menuButton').click();await h.page.getByText('Sparning och version',{exact:true}).click();const download=h.page.waitForEvent('download');await h.page.locator('#exportSave').click();const file=path.join(h.root,'qa/ch5-bookwork-round.json');await(await download).saveAs(file);
  const exported=JSON.parse(fs.readFileSync(file,'utf8'));assert.match(JSON.parse(exported.entries[key]).drafts.enlightenment[0],/blad 0/);
  await f.evaluate(k=>localStorage.removeItem(k),key);h.page.once('dialog',d=>d.accept());await h.page.locator('#saveFile').setInputFiles(file);await h.page.locator('#menu').waitFor({state:'hidden'});await h.boot();f=h.frame;
  assert.match(await f.evaluate(()=>UPPDRAG_CH5_BOOKWORK.state.drafts.enlightenment[0]),/blad 0/);assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH5_PILOT.materialReviewProgress()),{done:7,total:7});assert.deepEqual(await resources(),before);
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 5 bookwork: five source-based written sheets, seven distinct terms, physical location/study protection, free-form drafts/models without stamps, mobile/landscape keyboard, reload/export/import');
 }catch(e){console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
