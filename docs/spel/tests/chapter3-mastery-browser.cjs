const {launch,assert,fs,path}=require('./chapter3-test-utils.cjs');
(async()=>{
 const h=await launch('mastery');let f;const rooms={parties:'riksdag',war:'palace',uprising:'square',david:'fort'};
 const pilotKey='uppdrag1700.ch3-real-world.20261019.v1',priorKey='uppdrag1700.ch2-real-world.20261019.v1';
 const state=()=>f.evaluate(()=>({m:UPPDRAG_MASTERY.snapshot(),s:UPPDRAG_CH3_PILOT.state}));
 const mb=name=>f.locator('[data-mb="'+name+'"]').first().click();
 async function enter(area,level){
  await h.speechClose();await f.evaluate(()=>UPPDRAG_CH3_PILOT.openBook());await f.locator('[data-area="'+area+'"][data-level="'+level+'"]').click();
  await h.room(rooms[area]);await h.speechClose();await f.evaluate(id=>{UPPDRAG_MEETINGS.close(false);UPPDRAG_CH3_PILOT.enterMemory(id);},area);
 }
 async function answer(){
  const task=await f.evaluate(()=>UPPDRAG_CH3_PILOT.recall.current);
  if(await f.locator('[data-action="rc-tf-true"]').count()){
   const statement=await f.locator('.rc-own').innerText(),variant=task.variants.find(v=>v.text===statement);assert(variant);
   await f.locator('[data-action="rc-tf-'+(variant.truth?'true':'false')+'"]').click();
   if(variant.truth){await f.locator('[data-action="rc-next"]').click();return;}
  }
  for(let i=0;i<task.fields.length;i++){
   if(task.rank===0&&task.fields[i].options)await f.locator('[data-field-index="'+i+'"]').filter({hasText:task.fields[i].answers[0]}).click();
   else await f.locator('[data-rc-field="'+i+'"]').fill(task.fields[i].sample);
  }
  await f.locator('[data-action="rc-submit"]').click();
  const ui=await f.evaluate(()=>UPPDRAG_CH3_PILOT.recall.ui);assert.equal(ui.phase,'feedback',task.id+': '+JSON.stringify(ui));
  await f.locator('[data-action="rc-next"]').click();
 }
 async function finish(area,level){let guard=0;while((await state()).m.state.areas[area][level].status!=='clear'){assert(++guard<5);await answer();}}
 try{
  await h.boot();f=h.frame;
  await h.page.evaluate(({scope,priorKey})=>{
   for(const k of Object.keys(localStorage))if(k.startsWith(scope))localStorage.removeItem(k);
   localStorage.setItem(scope+priorKey,JSON.stringify({v:2,daler:5,apples:0,record:[{id:'rc2-mother-0',ok:true}],encountered:['rc2-mother-0'],earned:{},complete:false}));
  },{scope:h.scope,priorKey});await h.boot();f=h.frame;
  const prior=await f.evaluate(k=>localStorage.getItem(k),priorKey);
  assert.equal((await state()).s.daler,5);
  const map=await f.evaluate(()=>({ids:UPPDRAG_CH3_PILOT.scenes.flatMap(r=>r.f),bank:UPPDRAG_RECALL_BANK.filter(t=>t.chapter===3).map(t=>t.id)}));
  assert.deepEqual(map.ids.slice().sort(),map.bank.slice().sort());assert.equal(new Set(map.ids).size,18);
  await mb('book');assert.equal(await f.locator('[data-level="journeyman"]:disabled').count(),4);assert.equal(await f.locator('[data-level="master"]:disabled').count(),4);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.selectArea('david','master')),false);
  await enter('parties','learner');assert.equal(await f.locator('#ch1CutPaperScene').getAttribute('data-place'),'riksdag');
  await f.locator('[data-action="rc-hint"]').click();assert.equal((await state()).s.daler,4);await answer();
  await f.locator('[data-action="rc-skip"]').click();assert.equal((await state()).m.state.areas.parties.learner.status,'failed');assert.equal(await f.locator('[data-mb="retry"]').isDisabled(),true);
  for(const a of ['david','uprising','war']){await enter(a,'learner');await finish(a,'learner');}
  assert.equal((await state()).m.summary.done,3);assert.equal((await state()).m.summary.level,'learner');
  // Rut is free and includes both earlier chapters plus encountered chapter-3 topics.
  await h.room('archive');await h.speechClose();await f.evaluate(()=>UPPDRAG_CH3_PILOT.enterArchive());
  const practice=await f.evaluate(()=>UPPDRAG_CH3_PILOT.repetitionTaskIds);assert(practice.some(x=>x.startsWith('rc1-')));assert(practice.some(x=>x.startsWith('rc2-')));assert(practice.some(x=>x.startsWith('rc3-')));assert(!practice.some(x=>x.startsWith('rc4-')));
  let guard=0;while((await state()).s.archiveMode!=='reward'){assert(++guard<10);await answer();}
  assert.equal((await state()).s.apples,1);await f.locator('[data-action="rc-rut-exit"]').click();
  const world=await f.evaluate(()=>({story:localStorage.getItem('uppdrag1700.ch3-timeline.v1'),court:localStorage.getItem('uppdrag1700.ch3-courtyard.v1')}));
  await enter('parties','learner');await mb('retry');assert.equal((await state()).s.apples,0);assert.equal((await state()).s.index,0);await finish('parties','learner');
  assert.equal((await state()).m.summary.level,'journeyman');
  assert.equal(await f.evaluate(()=>localStorage.getItem('uppdrag1700.ch3-courtyard.v1')),world.court);
  for(const a of ['uprising','war','parties','david']){await enter(a,'journeyman');assert.equal(await f.locator('[data-action="rc-hint"]').count(),0);await finish(a,'journeyman');}
  assert.equal((await state()).m.summary.level,'master');
  await enter('parties','master');await f.locator('[data-rc-field="0"]').fill('Jag vill granska min förklaring tillsammans med läraren.');await f.locator('[data-action="rc-submit"]').click();await f.locator('[data-action="rc-save-review"]').click();assert.equal((await state()).m.state.areas.parties.master.status,'pending');
  await h.boot();f=h.frame;await enter('parties','master');await mb('review');await mb('approve');assert.equal((await state()).m.state.areas.parties.master.status,'pending');
  await mb('revise');const t=await f.evaluate(()=>UPPDRAG_CH3_PILOT.recall.current);await f.locator('[data-rc-field="0"]').fill(t.fields[0].sample);await f.locator('[data-action="rc-submit"]').click();await mb('review');await f.locator('#mbTeacher').check();await mb('approve');await f.locator('[data-action="rc-next"]').click();await finish('parties','master');
  for(const a of ['david','uprising','war']){await enter(a,'master');await finish(a,'master');}
  assert.equal((await state()).m.summary.chapterComplete,true);assert.equal((await state()).s.complete,true);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.phase),'available','the optional courtyard cannot gate chapter completion');
  assert.equal(await f.evaluate(k=>localStorage.getItem(k),priorKey),prior);
  await h.boot();f=h.frame;await mb('book');await h.page.setViewportSize({width:390,height:844});assert.equal(await f.locator('#ch1Modal').evaluate(e=>e.scrollWidth<=e.clientWidth),true);fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ch3-book-mobile.png')});
  await h.page.locator('#menuButton').click();assert.equal(await h.page.locator('#chapterList button').filter({hasText:'4. Nya tider'}).isEnabled(),true);
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 3 mastery: all 18 original tasks, four areas, free order, level/chapter gates, original closeups, apple area retry, Rut across 1–3, local review, untouched prior save, optional courtyard and mobile');
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await f.evaluate(()=>({state:UPPDRAG_CH3_PILOT?.state,summary:UPPDRAG_MASTERY?.summary(),room:interior?.kind})).catch(e=>e.message));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
