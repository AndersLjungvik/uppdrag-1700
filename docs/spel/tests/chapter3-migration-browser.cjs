const {launch,assert}=require('./chapter3-test-utils.cjs');
(async()=>{
 const h=await launch('migration');let f;const pilotKey='uppdrag1700.ch3-real-world.20261019.v1';
 async function seed(record){await h.page.evaluate(({scope,pilotKey,record})=>{for(const k of Object.keys(localStorage))if(k.startsWith(scope))localStorage.removeItem(k);localStorage.setItem(scope+pilotKey,JSON.stringify({v:2,complete:true,step:9,index:0,mode:'end',daler:9,apples:2,record,earned:{},draft:'Tidigare elevsvar'}));localStorage.setItem(scope+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{3:{wagon:'need-smith',thief:'unseen',history:[]}}}));},{scope:h.scope,pilotKey,record});await h.boot();f=h.frame;}
 try{
  await h.boot();f=h.frame;const bank=await f.evaluate(()=>UPPDRAG_RECALL_BANK.filter(t=>t.chapter===3));
  await seed([]);assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.complete),false);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0);assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),9);assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.apples),2);assert.equal(await f.evaluate(k=>JSON.parse(localStorage.getItem(k+'.before-mastery-3')).draft,pilotKey),'Tidigare elevsvar');
  await h.page.locator('#menuButton').click();assert.equal(await h.page.locator('#chapterList button').filter({hasText:'4. Nya tider'}).isDisabled(),true);await h.page.locator('#closeMenu').click();
  const proof=bank.map(t=>({version:'recall-2-rubric',chapter:3,id:t.id,step:(['parties','bribes'].includes(t.topic)?1:['war','successor'].includes(t.topic)?2:3)+t.rank*3,trial:7,ok:true,independent:true,assessment:'local',answer:t.fields.map(f=>f.sample)}));
  await seed(proof);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().chapterComplete),true);assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),9);assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.record.length),18);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'need-smith');assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openSmith()),false);
  await h.boot();f=h.frame;assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.complete),true);
  // The same isolated round can revisit an actually saved chapter 2 and
  // continue from chapter 2 to 3 without inventing chapter-1 stamps.
  await h.page.evaluate(scope=>{
   localStorage.setItem(scope+'uppdrag1700.ch2-real-world.20261019.v1',JSON.stringify({v:2,complete:true,daler:6,apples:1,record:[],earned:{}}));
   const areas={};for(const id of ['women','power','children']){areas[id]={};for(const l of ['learner','journeyman','master'])areas[id][l]={status:'clear',attempt:1};}
   localStorage.setItem(scope+'uppdrag1700.mastery.v1.ch2',JSON.stringify({v:1,chapter:2,areas,history:[]}));
  },h.scope);
  const back=new URL(h.url);back.searchParams.set('chapter','2');await h.page.goto(back.href,{waitUntil:'domcontentloaded'});await h.page.waitForFunction(()=>document.querySelector('#game')?.contentWindow?.UPPDRAG_CH2_PILOT);assert.equal(await h.page.locator('#error').innerText(),'');
  const forward=new URL(h.url);forward.searchParams.set('testChapter','2');await h.boot(forward.href);f=h.frame;assert.equal(await f.evaluate(()=>__INTEGRATED_CHAPTER),3);
  // Restore the direct chapter-3 test after the transition check.
  await h.boot(h.url);f=h.frame;
  const partial=proof.filter(x=>x.step<=3).map(x=>({...x,trial:x.id==='rc3-bribes-0'?8:7}));await seed(partial);const cells=await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas);assert.equal(cells.parties.learner.status,'available');assert.equal(cells.war.learner.status,'clear');assert.equal(cells.uprising.learner.status,'clear');assert.equal(cells.david.learner.status,'clear');assert.equal(cells.david.journeyman.status,'locked');
  await f.evaluate(()=>UPPDRAG_CH3_PILOT.selectArea('parties','learner'));assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.recall.stageSolved()),false);
  await h.page.locator('#menuButton').click();assert.equal(await h.page.locator('#replayChapter').innerText(),'Spela om kapitel 3');const replay=new URL(h.page.url()).searchParams.get('replay');await Promise.all([h.page.waitForURL(u=>u.searchParams.get('replay')!==replay),h.page.locator('#replayChapter').click()]);const next=h.page.url();await h.boot(next);f=h.frame;assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0);assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.state.daler),3);assert.equal(await f.evaluate(()=>localStorage.getItem('uppdrag1700.ch2-real-world.20261019.v1')),null,'isolated round invents no earlier progress');
  const normal=new URL(h.url);normal.searchParams.delete('replay');normal.searchParams.delete('testChapter');
  await h.page.goto(normal.href,{waitUntil:'domcontentloaded'});await h.page.waitForFunction(()=>document.querySelector('#game')?.contentWindow?.__INTEGRATED_CHAPTER===1);normal.searchParams.set('testChapter','3');await h.page.goto(normal.href,{waitUntil:'domcontentloaded'});await h.page.waitForFunction(()=>document.querySelector('#game')?.contentWindow?.__INTEGRATED_CHAPTER===1);
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 3 migration: all 18 old tasks mapped to four areas, only evidenced original attempts, no mixed-trial stamps, one-time backup/resources, old wagon untouched, fresh pupil replay and normal gates');
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
