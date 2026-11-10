const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('rut-review');let f;
 const pilotKey='uppdrag1700.ch4-real-world.20261020.v1',masteryKey='uppdrag1700.mastery.v1.ch4';
 const resources=()=>f.evaluate(()=>({daler:UPPDRAG_CH4_PILOT.state.daler,apples:UPPDRAG_CH4_PILOT.state.apples,record:UPPDRAG_CH4_PILOT.state.record,earned:UPPDRAG_CH4_PILOT.state.earned}));
 async function answer(){
  const t=await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.current);
  for(let i=0;i<t.fields.length;i++)await f.locator('[data-field-index="'+i+'"]').filter({hasText:t.fields[i].answers[0]}).click();
  await f.locator('[data-action="rc-submit"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.ui.phase),'feedback');await f.locator('[data-action="rc-next"]').click();
 }
 try{
  await h.boot();f=h.frame;await h.room('science');await f.evaluate(()=>UPPDRAG_CH4_PILOT.enterMemory('research'));
  const t=await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.current);await f.locator('[data-field-index="0"]').filter({hasText:t.fields[0].answers[0]}).click();
  const before=await resources(),base=await f.evaluate(()=>({pilot:JSON.parse(localStorage.getItem(UPPDRAG_CH4_PILOT.saveKey)),mastery:JSON.parse(localStorage.getItem('uppdrag1700.mastery.v1.ch4'))}));
  await h.room('archive');await h.greet();await h.choose('terms');
  const rut=await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.current),text='Jag behöver jämföra gruppernas namn med mina anteckningar.';
  await f.locator('[data-rc-field="0"]').fill(text);await f.locator('[data-action="rc-submit"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.ui.phase),'review');
  await f.locator('[data-action="rc-save-review"]').click();
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas.research.learner.status),'in-progress','saving Rut review cannot block Sam');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.reviewQueue.length),0);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.recallPendingReview.at(-1).answer[0]),text);assert.deepEqual(await resources(),before);
  await h.room('science');await h.greet();await h.choose('study');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.current.id),'rc4-researchers-0');assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.ui.drafts[0]),t.fields[0].answers[0]);assert.doesNotMatch(await f.locator('#ch1Modal').innerText(),/Rut · repetition|väntar på granskning/);
  await answer();await answer();assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas.research.learner.status),'clear');
  // Reproduce the old malformed save, rather than merely testing a new round.
  const evidenceAt='2026-11-03T09:00:00.000Z',savedAt='2026-11-03T09:00:02.000Z';
  async function corrupt(kind){
   const old=JSON.parse(JSON.stringify(base));old.pilot.archiveActive=false;delete old.pilot.recallMainSnapshot;
   old.mastery.areas.research.learner.status='pending';
   const drillId=kind==='core'?'rc4-researchers-0':rut.id;
   old.pilot.reviewQueue=[{id:drillId,step:3,trial:old.pilot.trial,index:0,answer:[text],at:savedAt}];
   old.pilot.recallEvidence=[{id:drillId,step:3,rank:1,answer:[text],assessment:'review',at:evidenceAt}];
   if(kind==='mixed')old.pilot.reviewQueue.push({id:t.id,step:3,trial:old.pilot.trial,index:0,answer:t.fields.map((x,i)=>i?'':text),at:savedAt});
   await h.page.evaluate(({scope,pilotKey,masteryKey,old})=>{localStorage.setItem(scope+pilotKey,JSON.stringify(old.pilot));localStorage.setItem(scope+masteryKey,JSON.stringify(old.mastery));},{scope:h.scope,pilotKey,masteryKey,old});
   await h.boot();f=h.frame;
  }
  for(const kind of ['material','core']){
   await corrupt(kind);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas.research.learner.status),'in-progress',kind+' saved false block is repaired');
   assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.reviewQueue[0].resolved),'practice-separated');assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.recallPendingReview.at(-1).answer[0]),text);assert.deepEqual(await resources(),before);
   const others=await f.evaluate(()=>Object.fromEntries(Object.entries(UPPDRAG_MASTERY.snapshot().state.areas).filter(([id])=>id!=='research')));assert.deepEqual(others,Object.fromEntries(Object.entries(base.mastery.areas).filter(([id])=>id!=='research')));
   await h.boot();f=h.frame;assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.recallPendingReview.filter(e=>e.at==='2026-11-03T09:00:02.000Z').length),1,'reloading does not duplicate recovered answers');
   await h.room('science');await h.greet();await h.choose('study');assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.current.id),t.id);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.ui.drafts[0]),t.fields[0].answers[0]);
  }
  await corrupt('mixed');assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas.research.learner.status),'pending','genuine main review still waits');
  await h.room('science');await f.evaluate(()=>UPPDRAG_CH4_PILOT.enterMemory('research'));await f.locator('[data-mb="review"]').click();assert.match(await f.locator('#ch1Modal').innerText(),/Koppla arbetsbokens sex/);assert.doesNotMatch(await f.locator('#ch1Modal').innerText(),new RegExp(rut.prompt.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  await f.locator('#mbTeacher').check();await f.locator('[data-mb="approve"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.record.at(-1).id),t.id,'teacher approval uses the main task only');
  fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ch4-rut-review-repaired.png')});
  assert.deepEqual(h.errors,[]);console.log('PASS Rut review isolation and old-save repair: actual Rut→Sam journey, saved drafts/resources, restored learner test, material/core drill ids, idempotent reload, untouched other areas and genuine teacher review');
 }catch(e){console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
