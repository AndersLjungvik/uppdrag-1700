const {launch,assert}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('migration');let f;
 const pilotKey='uppdrag1700.ch4-real-world.20261020.v1',sideKey='uppdrag1700.ch4-cajsa-cookbook.20261020.v1';
 async function seed(record){
  await h.page.evaluate(({scope,pilotKey,sideKey,record})=>{
   for(const k of Object.keys(localStorage))if(k.startsWith(scope))localStorage.removeItem(k);
   localStorage.setItem(scope+pilotKey,JSON.stringify({v:2,complete:true,step:12,index:0,mode:'end',daler:9,apples:2,record,earned:{},draft:'Äldre eget svar'}));
   localStorage.setItem(scope+sideKey,JSON.stringify({version:1,phase:'carrying',leftHome:false}));
   localStorage.setItem(scope+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{4:{wagon:'need-smith',thief:'won',thiefSeen:true,witness:'heard',history:[]}}}));
  },{scope:h.scope,pilotKey,sideKey,record});await h.boot();f=h.frame;
 }
 try{
  await h.boot();f=h.frame;const bank=await f.evaluate(()=>UPPDRAG_RECALL_BANK.filter(t=>t.chapter===4&&!t.reviewOnly));assert.equal(bank.length,15);
  await seed([]);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.complete),false);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0);
  assert.deepEqual(await f.evaluate(()=>[UPPDRAG_CH4_PILOT.state.daler,UPPDRAG_CH4_PILOT.state.apples]),[9,2]);
  assert.equal(await f.evaluate(k=>JSON.parse(localStorage.getItem(k+'.before-mastery-4')).draft,pilotKey),'Äldre eget svar');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.phase),'carrying');
  await h.page.locator('#menuButton').click();assert.equal(await h.page.locator('#chapterList button').filter({hasText:'5. Gustavianska'}).isDisabled(),true);await h.page.locator('#closeMenu').click();
  const proof=bank.map(t=>({version:'recall-2-rubric',chapter:4,id:t.id,step:(t.topic==='freedoms'?1:t.topic==='reading'?2:t.topic==='ekeblad'?4:3)+t.rank*4,trial:7,ok:true,independent:true,assessment:'local',answer:t.fields.map(f=>f.sample)}));
  const oldProof=proof.map(x=>({...x,answer:x.answer.slice(0,x.id.includes('freedoms')?(x.id.endsWith('-2')?1:2):x.id.includes('researchers')?(x.id.endsWith('-1')?3:x.id.endsWith('-0')?2:1):1)}));
  await seed(oldProof);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().chapterComplete),false,'an old ok flag cannot stand in for the added book requirements');
  await seed(proof);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().chapterComplete),true);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.record.length),15);
  assert.deepEqual(await f.evaluate(()=>[UPPDRAG_CH4_PILOT.state.daler,UPPDRAG_CH4_PILOT.state.apples]),[9,2]);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.phase),'carrying');assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'need-smith');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openWagon()),false);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openSmith()),false);
  const before=await f.evaluate(k=>localStorage.getItem(k+'.before-mastery-4'),pilotKey);await h.boot();f=h.frame;
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.complete),true);assert.equal(await f.evaluate(k=>localStorage.getItem(k+'.before-mastery-4'),pilotKey),before);
  const next=new URL(h.url);next.searchParams.set('chapter','5');await h.page.goto(next.href,{waitUntil:'domcontentloaded'});
  await h.page.waitForFunction(()=>document.querySelector('#game')?.contentWindow?.UPPDRAG_CH5_PILOT);assert.equal(await h.page.locator('#error').innerText(),'');await h.boot(h.url);f=h.frame;
  const mixed=proof.filter(x=>x.step<=4).map(x=>({...x,trial:x.id==='rc4-researchers-0'?8:7}));
  await seed(mixed);const cells=await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas);assert.equal(cells.research.learner.status,'available');for(const a of ['reading','freedoms','ekeblad'])assert.equal(cells[a].learner.status,'clear');for(const a of Object.values(cells))assert.equal(a.journeyman.status,'locked');
  await f.evaluate(()=>UPPDRAG_CH4_PILOT.selectArea('research','learner'));assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.stageSolved()),false);
  await h.page.locator('#menuButton').click();assert.equal(await h.page.locator('#replayChapter').innerText(),'Spela om kapitel 4');const oldReplay=new URL(h.page.url()).searchParams.get('replay');
  await Promise.all([h.page.waitForURL(u=>u.searchParams.get('replay')!==oldReplay),h.page.locator('#replayChapter').click()]);await h.boot(h.page.url());f=h.frame;
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.daler),3);assert.equal(await f.evaluate(()=>localStorage.getItem('uppdrag1700.ch3-real-world.20261019.v1')),null);
  // An isolated test does not loosen the ordinary gate, nor test without a replay.
  const normal=new URL(h.url);normal.searchParams.delete('replay');normal.searchParams.delete('testChapter');
  await h.page.goto(normal.href,{waitUntil:'domcontentloaded'});await h.page.waitForFunction(()=>document.querySelector('#game')?.contentWindow?.__INTEGRATED_CHAPTER===1);
  normal.searchParams.set('testChapter','4');await h.page.goto(normal.href,{waitUntil:'domcontentloaded'});await h.page.waitForFunction(()=>document.querySelector('#game')?.contentWindow?.__INTEGRATED_CHAPTER===1);
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 4 migration: all 15 evidenced tasks, no mixed attempts or completion-flag stamps, one-time backup, preserved resources/cookbook/wagon, fresh replay and normal gates');
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
