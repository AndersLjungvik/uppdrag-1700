const {launch,assert}=require('./chapter5-test-utils.cjs');
(async()=>{
 const h=await launch('migration');let f;
 const pilotKey='uppdrag1700.ch5-real-world.20261020.v1',sideKey='uppdrag1700.ch5-marstrand-letter.20261020.v1';
 async function seed(record){
  await h.page.evaluate(({scope,pilotKey,sideKey,record})=>{
   for(const k of Object.keys(localStorage))if(k.startsWith(scope))localStorage.removeItem(k);
   localStorage.setItem(scope+pilotKey,JSON.stringify({v:2,complete:true,step:12,index:0,mode:'end',daler:9,apples:2,record,earned:{},draft:'Äldre eget svar'}));
   localStorage.setItem(scope+sideKey,JSON.stringify({version:1,phase:'carrying',leftHome:false}));
   localStorage.setItem(scope+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{5:{wagon:'need-smith',thief:'won',thiefSeen:true,witness:'heard',history:[]}}}));
  },{scope:h.scope,pilotKey,sideKey,record});await h.boot();f=h.frame;
 }
 try{
  await h.boot();f=h.frame;const bank=await f.evaluate(()=>UPPDRAG_RECALL_BANK.filter(t=>t.chapter===5&&!t.reviewOnly));assert.equal(bank.length,15);
  await seed([]);assert.equal(await f.evaluate(()=>UPPDRAG_CH5_PILOT.state.complete),false);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0);
  assert.deepEqual(await f.evaluate(()=>[UPPDRAG_CH5_PILOT.state.daler,UPPDRAG_CH5_PILOT.state.apples]),[9,2]);
  assert.equal(await f.evaluate(k=>JSON.parse(localStorage.getItem(k+'.before-mastery-5')).draft,pilotKey),'Äldre eget svar');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.phase),'carrying');
  await h.page.locator('#menuButton').click();assert.equal(await h.page.locator('#chapterList button').filter({hasText:'6. Livet'}).isDisabled(),true);await h.page.locator('#closeMenu').click();
  const proof=bank.map(t=>({version:'recall-2-rubric',chapter:5,id:t.id,step:(t.topic==='coup'?1:['support','reforms'].includes(t.topic)?2:t.topic==='press'?3:4)+t.rank*4,trial:7,ok:true,independent:true,assessment:'local',answer:t.fields.map(f=>f.sample)}));
  const oldProof=proof.map(x=>({...x,answer:x.answer.slice(0,1)}));
  await seed(oldProof);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().chapterComplete),false,'an old ok flag cannot stand in for the added book requirements');
  await seed(proof);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().chapterComplete),true);assert.equal(await f.evaluate(()=>UPPDRAG_CH5_PILOT.state.record.length),15);
  assert.deepEqual(await f.evaluate(()=>[UPPDRAG_CH5_PILOT.state.daler,UPPDRAG_CH5_PILOT.state.apples]),[9,2]);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.phase),'carrying');assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'need-smith');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openWagon()),false);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openSmith()),false);
  const before=await f.evaluate(k=>localStorage.getItem(k+'.before-mastery-5'),pilotKey);await h.boot();f=h.frame;
  assert.equal(await f.evaluate(()=>UPPDRAG_CH5_PILOT.state.complete),true);assert.equal(await f.evaluate(k=>localStorage.getItem(k+'.before-mastery-5'),pilotKey),before);
  const next=new URL(h.url);next.searchParams.set('chapter','6');await h.page.goto(next.href,{waitUntil:'domcontentloaded'});
  await h.page.waitForFunction(()=>document.querySelector('#game')?.contentWindow?.UPPDRAG_CH6_PILOT);assert.equal(await h.page.locator('#error').innerText(),'');await h.boot(h.url);f=h.frame;
  const partial=proof.filter(x=>x.step<=4&&x.id!=='rc5-support-0');
  await seed(partial);const cells=await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas);assert.equal(cells.power.learner.status,'available');for(const a of ['reforms','press','rights'])assert.equal(cells[a].learner.status,'clear');for(const a of Object.values(cells))assert.equal(a.journeyman.status,'locked');
  await f.evaluate(()=>UPPDRAG_CH5_PILOT.selectArea('power','learner'));assert.equal(await f.evaluate(()=>UPPDRAG_CH5_PILOT.recall.stageSolved()),false);
  await h.page.locator('#menuButton').click();assert.equal(await h.page.locator('#replayChapter').innerText(),'Spela om kapitel 5');const oldReplay=new URL(h.page.url()).searchParams.get('replay');
  await Promise.all([h.page.waitForURL(u=>u.searchParams.get('replay')!==oldReplay),h.page.locator('#replayChapter').click()]);await h.boot(h.page.url());f=h.frame;
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0);assert.equal(await f.evaluate(()=>UPPDRAG_CH5_PILOT.state.daler),3);assert.equal(await f.evaluate(()=>localStorage.getItem('uppdrag1700.ch3-real-world.20261019.v1')),null);
  // An isolated test does not loosen the ordinary gate, nor test without a replay.
  const normal=new URL(h.url);normal.searchParams.delete('replay');normal.searchParams.delete('testChapter');
  await h.page.goto(normal.href,{waitUntil:'domcontentloaded'});await h.page.waitForFunction(()=>document.querySelector('#game')?.contentWindow?.__INTEGRATED_CHAPTER===1);
  normal.searchParams.set('testChapter','5');await h.page.goto(normal.href,{waitUntil:'domcontentloaded'});await h.page.waitForFunction(()=>document.querySelector('#game')?.contentWindow?.__INTEGRATED_CHAPTER===1);
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 5 migration: all 15 evidenced tasks, no partial evidence or completion-flag stamps, one-time backup, preserved resources/letter/wagon, fresh replay and normal gates');
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
