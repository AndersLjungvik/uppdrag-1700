const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('mastery');let f;const rooms={reading:'church',freedoms:'print',research:'science',ekeblad:'farm'};
 const pilotKey='uppdrag1700.ch4-real-world.20261020.v1',priorKey='uppdrag1700.ch3-real-world.20261019.v1';
 const state=()=>f.evaluate(()=>({m:UPPDRAG_MASTERY.snapshot(),s:UPPDRAG_CH4_PILOT.state}));
 const mb=name=>f.locator('[data-mb="'+name+'"]').first().click();
 async function enter(area,level){
  await h.speechClose();await f.evaluate(()=>UPPDRAG_CH4_PILOT.openBook());await f.locator('[data-area="'+area+'"][data-level="'+level+'"]').click();
  await h.room(rooms[area]);await h.speechClose();await f.evaluate(id=>{UPPDRAG_MEETINGS.close(false);UPPDRAG_CH4_PILOT.enterMemory(id);},area);
 }
 async function answer(){
  const task=await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.current);
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
  const ui=await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.ui);assert.equal(ui.phase,'feedback',task.id+': '+JSON.stringify(ui));
  await f.locator('[data-action="rc-next"]').click();
 }
 async function finish(area,level){let guard=0;while((await state()).m.state.areas[area][level].status!=='clear'){assert(++guard<5);await answer();}}
 try{
  await h.boot();f=h.frame;
  await h.page.evaluate(({scope,priorKey})=>{
   for(const k of Object.keys(localStorage))if(k.startsWith(scope))localStorage.removeItem(k);
   localStorage.setItem(scope+priorKey,JSON.stringify({v:2,daler:5,apples:0,record:[{id:'rc3-parties-0',ok:true}],encountered:['rc3-parties-0'],earned:{},complete:false}));
  },{scope:h.scope,priorKey});await h.boot();f=h.frame;
  const prior=await f.evaluate(k=>localStorage.getItem(k),priorKey);
  assert.equal((await state()).s.daler,5);
  const map=await f.evaluate(()=>({ids:UPPDRAG_CH4_PILOT.scenes.flatMap(r=>r.f),bank:UPPDRAG_RECALL_BANK.filter(t=>t.chapter===4).map(t=>t.id)}));
  assert.deepEqual(map.ids.slice().sort(),map.bank.slice().sort());assert.equal(new Set(map.ids).size,15);
  await mb('book');assert.equal(await f.locator('[data-level="journeyman"]:disabled').count(),4);assert.equal(await f.locator('[data-level="master"]:disabled').count(),4);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.selectArea('ekeblad','master')),false);
  await enter('research','learner');assert.equal(await f.locator('#ch1CutPaperScene').getAttribute('data-place'),'science');
  await f.locator('[data-action="rc-hint"]').click();assert.equal((await state()).s.daler,4);await answer();
  await f.locator('[data-action="rc-skip"]').click();assert.equal((await state()).m.state.areas.research.learner.status,'failed');assert.equal(await f.locator('[data-mb="retry"]').isDisabled(),true);
  for(const a of ['ekeblad','freedoms','reading']){await enter(a,'learner');await finish(a,'learner');}
  assert.equal((await state()).m.summary.done,3);assert.equal((await state()).m.summary.level,'learner');
  // Rut is free and includes earlier chapters plus encountered chapter-4 topics.
  await h.room('archive');await h.speechClose();await f.evaluate(()=>UPPDRAG_CH4_PILOT.enterArchive());
  const practice=await f.evaluate(()=>UPPDRAG_CH4_PILOT.repetitionTaskIds);assert(practice.some(x=>x.startsWith('rc1-')));assert(practice.some(x=>x.startsWith('rc2-')));assert(practice.some(x=>x.startsWith('rc3-')));assert(practice.some(x=>x.startsWith('rc4-')));assert(!practice.some(x=>x.startsWith('rc5-')));
  let guard=0;while((await state()).s.archiveMode!=='reward'){assert(++guard<10);await answer();}
  assert.equal((await state()).s.apples,1);await f.locator('[data-action="rc-rut-exit"]').click();
  const world=await f.evaluate(()=>({story:localStorage.getItem('uppdrag1700.ch4-meetings.v1'),court:localStorage.getItem('uppdrag1700.ch4-cajsa-cookbook.20261020.v1')}));
  await enter('research','learner');await mb('retry');assert.equal((await state()).s.apples,0);assert.equal((await state()).s.index,0);await finish('research','learner');
  assert.equal((await state()).m.summary.level,'journeyman');
  assert.equal(await f.evaluate(()=>localStorage.getItem('uppdrag1700.ch4-cajsa-cookbook.20261020.v1')),world.court);
  for(const a of ['research','reading','freedoms','ekeblad']){await enter(a,'journeyman');assert.equal(await f.locator('[data-action="rc-hint"]').count(),0);await finish(a,'journeyman');}
  assert.equal((await state()).m.summary.level,'master');
  await enter('freedoms','master');await f.locator('[data-rc-field="0"]').fill('Jag vill granska min förklaring tillsammans med läraren.');await f.locator('[data-action="rc-submit"]').click();await f.locator('[data-action="rc-save-review"]').click();assert.equal((await state()).m.state.areas.freedoms.master.status,'pending');
  await h.boot();f=h.frame;await enter('freedoms','master');await mb('review');await mb('approve');assert.equal((await state()).m.state.areas.freedoms.master.status,'pending');
  await mb('revise');const t=await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.current);await f.locator('[data-rc-field="0"]').fill(t.fields[0].sample);await f.locator('[data-action="rc-submit"]').click();await mb('review');await f.locator('#mbTeacher').check();await mb('approve');await f.locator('[data-action="rc-next"]').click();await finish('freedoms','master');
  for(const a of ['ekeblad','research','reading']){await enter(a,'master');await finish(a,'master');}
  assert.equal((await state()).m.summary.chapterComplete,true);assert.equal((await state()).s.complete,true);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.phase),'unfound','the optional cookbook cannot gate chapter completion');
  assert.equal(await f.evaluate(k=>localStorage.getItem(k),priorKey),prior);
  await h.boot();f=h.frame;await mb('book');await h.page.setViewportSize({width:390,height:844});assert.equal(await f.locator('#ch1Modal').evaluate(e=>e.scrollWidth<=e.clientWidth),true);fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ch4-book-mobile.png')});
  await h.page.locator('#menuButton').click();assert.equal(await h.page.locator('#chapterList button').filter({hasText:'5. Gustavianska'}).isEnabled(),true);
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 4 mastery: all 15 original tasks, four areas, free order, level/chapter gates, original closeups, apple area retry, Rut across 1–4, local review, untouched prior save, optional cookbook and mobile');
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await f.evaluate(()=>({state:UPPDRAG_CH4_PILOT?.state,summary:UPPDRAG_MASTERY?.summary(),room:interior?.kind})).catch(e=>e.message));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
