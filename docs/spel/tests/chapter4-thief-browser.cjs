const {launch,assert}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('thief');let f;
 async function freeze(){
  await f.evaluate(()=>{UPPDRAG_CH4_PILOT.close();UPPDRAG_MEETINGS.close(false);UPPDRAG_CH4_CITY_LIFE.suspend();window.requestAnimationFrame=()=>0;});await h.page.waitForTimeout(70);
  await f.evaluate(()=>{window.qaTime=performance.now()+10000;window.qaTick=()=>{qaTime+=40;UPPDRAG_WORLD_LIFE.tick(qaTime,{region,player,activeRoom:interior?.kind||null});UPPDRAG_MEETINGS.tick(qaTime);UPPDRAG_CH4_PILOT.tick();};});
 }
 async function ambush(){
  await f.evaluate(()=>{UPPDRAG_CH4_PILOT.close();if(interior)leaveInterior();path=[];for(let x=100;x<=1100;x+=5){player={x,y:705};qaTick();if(UPPDRAG_EVENT_ENGINE.approach.phase==='approaching')break;}});
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.phase),'approaching');assert(await f.evaluate(()=>!!UPPDRAG_EVENT_ENGINE.approach.home?.id));
  await f.evaluate(()=>{for(let i=0;i<240&&UPPDRAG_EVENT_ENGINE.state.thief!=='chasing';i++)qaTick();draw();});assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'chasing');
 }
 try{
  await h.page.addInitScript(scope=>{if(window===top&&!localStorage.getItem(scope+'uppdrag1700.side-adventures.v1'))localStorage.setItem(scope+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{3:{wagon:'cleared',thief:'won',history:[]},4:{wagon:'need-smith',thief:'unseen',witness:'heard',distance:1600,thiefDistance:620,history:[]}}}));},h.scope);
  await h.boot();f=h.frame;
  const earlier=await f.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem('uppdrag1700.side-adventures.v1')).chapters[3]));
  await h.room('print');await f.locator('#ch4BookAction').focus();await f.locator('#ch4BookAction').press('Enter');await h.choose('take');await h.speechClose();assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.hasBook),true);
  await f.evaluate(()=>{UPPDRAG_CH4_PILOT.state.daler=12;UPPDRAG_CH4_PILOT.persist();});
  await h.room('church');await f.evaluate(()=>UPPDRAG_CH4_PILOT.enterMemory('reading'));assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openThief()),false);await freeze();
  const before=await f.evaluate(()=>({m:localStorage.getItem('uppdrag1700.mastery.v1.ch4'),apples:UPPDRAG_CH4_PILOT.state.apples}));
  await ambush();assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.daler),6);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.stolenAmount),6);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.hasBook),true);
  await f.locator('#adventureChase').click();await f.evaluate(()=>{
   for(let i=0;i<1000&&UPPDRAG_EVENT_ENGINE.approach.phase!=='caught';i++){
    const target=path[0];if(target){const d=Math.hypot(target.x-player.x,target.y-player.y),step=Math.min(d,7.2);if(d<.01)path.shift();else{player={x:player.x+(target.x-player.x)/d*step,y:player.y+(target.y-player.y)/d*step};if(step>=d)path.shift();}}qaTick();
   }draw();
  });
  const prompt=await f.locator('.ad-event-question p').first().innerText();
  const answer=await f.evaluate(prompt=>{const t=UPPDRAG_RECALL_BANK.find(t=>t.prompt===prompt);if(t.chapter>4)throw Error('future topic');return t.fields[0].options.find(o=>t.fields[0].answers.some(a=>a.toLocaleLowerCase('sv')===o.toLocaleLowerCase('sv')));},prompt);
  await f.getByRole('button',{name:answer,exact:true}).click();assert.match(await f.locator('#adventureDialog').innerText(),/6 daler/);await f.locator('[data-adventure="close"]').click();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.daler),12);assert.deepEqual(await f.evaluate(()=>({m:localStorage.getItem('uppdrag1700.mastery.v1.ch4'),apples:UPPDRAG_CH4_PILOT.state.apples})),before);
  // An actual knowledge reward, rather than the refund, arms a second theft.
  await h.room('church');await f.evaluate(()=>{UPPDRAG_MEETINGS.close(false);UPPDRAG_CH4_PILOT.enterMemory('reading');});
  const task=await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.current);await f.locator('[data-field-index="0"]').filter({hasText:task.fields[0].answers[0]}).click();await f.locator('[data-action="rc-submit"]').click();await f.locator('[data-action="rc-next"]').click();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.daler),13);await f.evaluate(()=>{for(let i=0;i<1400;i++)qaTick();});await ambush();
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.encounters),2);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.daler),6);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.stolenAmount),7);
  await h.boot();f=h.frame;await freeze();assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.unclaimed),7);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.hasBook),true);
  await f.evaluate(()=>{player={x:1005,y:713};path=[];qaTick();UPPDRAG_EVENT_ENGINE.openWitness();draw();});await f.locator('[data-adventure="kind"]').click();await f.locator('.ad-utterance').click();await f.locator('#adventureDialog').press('Enter');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.daler),13);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.unclaimed),0);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.earned),false);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.hasBook),true);
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas.reading.learner.status),'clear');assert.equal(await f.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem('uppdrag1700.side-adventures.v1')).chapters[3])),earlier);
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 4 thief: real tree ambush and pursuit, 6-daler refund, actual reward and returning 7-daler theft, reload and full child refund, protected study, intact cookbook/stamps/apples/earlier chapter');
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await f.evaluate(()=>({room:interior?.kind,events:UPPDRAG_EVENT_ENGINE?.state,motion:UPPDRAG_EVENT_ENGINE?.approach,money:UPPDRAG_CH4_PILOT?.state.daler})).catch(e=>e.message));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
