const {launch,assert,fs,path}=require('./chapter3-test-utils.cjs');
(async()=>{
 const h=await launch('wealth');let f;
 const sideKey='uppdrag1700.side-adventures.v1',pilotKey='uppdrag1700.ch3-real-world.20261019.v1';
 async function freeze(){
  await f.evaluate(()=>{UPPDRAG_CH3_PILOT.close();UPPDRAG_MEETINGS.close(false);window.requestAnimationFrame=()=>0;});await h.page.waitForTimeout(70);
  await f.evaluate(()=>{window.qaTime=performance.now()+10000;window.qaTick=()=>{qaTime+=40;UPPDRAG_WORLD_LIFE.tick(qaTime,{region,player,activeRoom:interior?.kind||null});UPPDRAG_MEETINGS.tick(qaTime);UPPDRAG_CH3_PILOT.tick();};});
 }
 async function ambush(){
  await f.evaluate(()=>{UPPDRAG_CH3_PILOT.close();if(interior)leaveInterior();path=[];for(let x=100;x<=1100;x+=5){player={x,y:705};qaTick();if(UPPDRAG_EVENT_ENGINE.approach.phase==='approaching')break;}camera={...player};draw();});
  assert(['watching','approaching','searching'].includes(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.phase)),'the chapter-3 thief starts at a real tree');
  assert(await f.evaluate(()=>!!UPPDRAG_EVENT_ENGINE.approach.home?.id));
  await f.evaluate(()=>{for(let i=0;i<240&&UPPDRAG_EVENT_ENGINE.state.thief!=='chasing';i++)qaTick();draw();});
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'chasing');
 }
 async function child(){
  await f.evaluate(()=>{player={x:1005,y:713};path=[];qaTick();UPPDRAG_EVENT_ENGINE.openWitness();draw();});
  await f.locator('[data-adventure="kind"]').click();
  if(await f.locator('#adventureDialog').isVisible())await f.locator('.ad-utterance').click();
  if(await f.locator('#adventureDialog').isVisible())await f.locator('#adventureDialog').press('Enter');
 }
 async function catchAndAnswer(){
  await f.locator('#adventureChase').click();await f.evaluate(()=>{
   for(let i=0;i<1000&&UPPDRAG_EVENT_ENGINE.approach.phase!=='caught';i++){
    const target=path[0];if(target){const d=Math.hypot(target.x-player.x,target.y-player.y),step=Math.min(d,7.2);if(d<.01)path.shift();else{player={x:player.x+(target.x-player.x)/d*step,y:player.y+(target.y-player.y)/d*step};if(step>=d)path.shift();}}qaTick();
   }draw();
  });
  const prompt=await f.locator('.ad-event-question p').first().innerText();
  const answer=await f.evaluate(prompt=>{const t=UPPDRAG_RECALL_BANK.find(t=>t.prompt===prompt);return t.fields[0].options.find(o=>t.fields[0].answers.some(a=>a.toLocaleLowerCase('sv')===o.toLocaleLowerCase('sv')));},prompt);
  await f.getByRole('button',{name:answer,exact:true}).click();
  assert.match(await f.locator('#adventureDialog').innerText(),/6 daler/);await f.locator('[data-adventure="close"]').click();
 }
 try{
  await h.boot();f=h.frame;
  await h.page.evaluate(({scope,sideKey,pilotKey})=>{
   const p=JSON.parse(localStorage.getItem(scope+pilotKey));p.daler=12;localStorage.setItem(scope+pilotKey,JSON.stringify(p));
   localStorage.setItem(scope+sideKey,JSON.stringify({v:1,chapters:{1:{wagon:'cleared',thief:'won',history:[]},3:{wagon:'need-smith',thief:'unseen',witness:'unseen',distance:1600,thiefDistance:620,history:[]}}}));
  },{scope:h.scope,sideKey,pilotKey});await h.boot();f=h.frame;
  const earlier=await f.evaluate(k=>JSON.stringify(JSON.parse(localStorage.getItem(k)).chapters[1]),sideKey);
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.registry.find(x=>x.id==='pickpocket').chapters.includes(3)),true);
  // The staged suppression scene is protected even with a rich armed purse.
  await h.room('square');await h.greet();assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openThief()),false);await h.choose('summary');
  await freeze();assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openThief()),false);await f.evaluate(()=>{for(let i=0;i<200;i++)qaTick();});assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),12);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.point),null);
  await f.locator('[data-summary="close"]').click();
  await h.room('riksdag');await f.evaluate(()=>UPPDRAG_CH3_PILOT.enterMemory('parties'));assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openThief()),false);await f.evaluate(()=>UPPDRAG_CH3_PILOT.close());
  // Not even a manual start can steal while the courtyard material puzzle is active.
  await f.evaluate(()=>localStorage.setItem('uppdrag1700.ch3-courtyard.v1',JSON.stringify({v:1,phase:'arranging',layout:{a:'bench',b:'path'}})));await h.boot();f=h.frame;await h.room('courtyard');await h.greet();await freeze();assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openThief()),false);assert.equal(await f.locator('#ch3CourtyardControls').isVisible(),true);await f.locator('[data-court="close"]').click();
  await f.evaluate(()=>{UPPDRAG_CH3_PILOT.close();if(interior)leaveInterior();path=[];UPPDRAG_CH3_PILOT.state.daler=2;UPPDRAG_CH3_PILOT.persist();for(let x=100;x<=1100;x+=5){player={x,y:705};qaTick();}});
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.point),null);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openThief()),false,'two coins are left alone');
  await f.evaluate(()=>{UPPDRAG_CH3_PILOT.state.daler=12;UPPDRAG_CH3_PILOT.persist();});
  const before=await f.evaluate(()=>({apples:UPPDRAG_CH3_PILOT.state.apples,m:localStorage.getItem('uppdrag1700.mastery.v1.ch3')}));
  await ambush();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),6);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.stolenAmount),6);assert.match(await f.locator('#adventureChase').innerText(),/6 daler/);
  fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/thief-six-daler.png')});
  await catchAndAnswer();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),12);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.stolenAmount),0);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.unclaimed),0);
  await child();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),12,'no duplicate refund after successful pursuit');
  assert.deepEqual(await f.evaluate(()=>({apples:UPPDRAG_CH3_PILOT.state.apples,m:localStorage.getItem('uppdrag1700.mastery.v1.ch3')})),before);
  // A real area reward permits the thief to return with a different exact stake.
  await h.room('riksdag');await f.evaluate(()=>{UPPDRAG_MEETINGS.close(false);UPPDRAG_CH3_PILOT.enterMemory('parties');});
  for(let n=0;n<2;n++){
   const task=await f.evaluate(()=>UPPDRAG_CH3_PILOT.recall.current);
   if(await f.locator('[data-action="rc-tf-true"]').count()){
    const statement=await f.locator('.rc-own').innerText(),variant=task.variants.find(v=>v.text===statement);assert(variant);
    await f.locator('[data-action="rc-tf-'+(variant.truth?'true':'false')+'"]').click();
    if(variant.truth){await f.locator('[data-action="rc-next"]').click();continue;}
   }
   for(let i=0;i<task.fields.length;i++){if(task.rank===0&&task.fields[i].options)await f.locator('[data-field-index="'+i+'"]').filter({hasText:task.fields[i].answers[0]}).click();else await f.locator('[data-rc-field="'+i+'"]').fill(task.fields[i].sample);}
   await f.locator('[data-action="rc-submit"]').click();await f.locator('[data-action="rc-next"]').click();
  }
  assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),13);await f.evaluate(()=>{for(let i=0;i<1400;i++)qaTick();});
  await ambush();assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.encounters),2);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.stolenAmount),7);assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),6);
  // Reloading an active seven-daler chase transfers exactly seven to recovery.
  await h.boot();f=h.frame;await freeze();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),6);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.unclaimed),7);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'lost');
  await h.boot();f=h.frame;await freeze();assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.unclaimed),7);await child();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),13);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.unclaimed),0);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.earned),false);
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas.parties.learner.status),'clear');
  assert.equal(await f.evaluate(k=>JSON.stringify(JSON.parse(localStorage.getItem(k)).chapters[1]),sideKey),earlier);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.phase),'arranging');
  // Existing one-coin losses remain one-coin refunds after this migration.
  await f.evaluate(({sideKey,pilotKey})=>{const p=UPPDRAG_CH3_PILOT.state;p.daler=12;UPPDRAG_CH3_PILOT.persist();const s=JSON.parse(localStorage.getItem(sideKey));s.chapters[3]={wagon:'need-smith',thief:'lost',thiefSeen:true,stolenDaler:true,witness:'unseen',distance:2000,history:[]};localStorage.setItem(sideKey,JSON.stringify(s));},{sideKey,pilotKey});await h.boot();f=h.frame;await freeze();assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.unclaimed),1);await child();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),13);
  assert.deepEqual(h.errors,[]);console.log('PASS larger thief stakes: chapter 3 actual ambush, six-daler pursuit/refund, seven-daler recurring theft and double reload, exact child recovery, no duplicate/new-income refund, legacy coin, protected dialogue/study/suppression/puzzle, untouched stamps/items and earlier chapter');
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await f.evaluate(()=>({events:UPPDRAG_EVENT_ENGINE?.state,approach:UPPDRAG_EVENT_ENGINE?.approach,room:interior?.kind,wallet:UPPDRAG_CH3_PILOT?.state.daler})).catch(e=>e.message));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
