const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('chapter-one-only');let f;
 const ROOT=process.env.GAME_SAVE_ROOT||'uppdrag1700.integrated.20261023.v1.';
 const lessonScope=ROOT+'lesson.1.play.',pilotKey='uppdrag1700.ch1-real-world.20261019.v11',masteryKey='uppdrag1700.mastery.v1.ch1';
 const base=new URL(h.url),version=base.searchParams.get('v');base.search='';const lesson=new URL(base);lesson.searchParams.set('only','1');lesson.searchParams.set('chapter','1');if(version)lesson.searchParams.set('v',version);
 async function loaded(){
  await h.page.waitForFunction(()=>document.getElementById('error')?.textContent||(document.getElementById('intro')?.hidden&&document.getElementById('game')?.contentWindow?.UPPDRAG_CH1_PILOT),undefined,{timeout:45000});
  assert.equal(await h.page.locator('#error').innerText(),'');f=await(await h.page.locator('#game').elementHandle()).contentFrame();await f.waitForSelector('#ch1Hud');
  assert.equal(await f.evaluate(()=>__UPPDRAG_LESSON_ONLY),1);assert.equal(await f.evaluate(()=>__INTEGRATED_CHAPTER),1);
 }
 async function boot(url=lesson.href){await h.page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});await loaded();}
 async function menu(){if(!await h.page.locator('#menu').evaluate(e=>e.open))await h.page.locator('#menuButton').click();}
 async function noNext(){
  assert.equal(await f.locator('a[href*="chapter2-pilot"]').count(),0);
  assert.doesNotMatch(await f.locator('#ch1Hud').innerText(),/kapitel 2/i);
  await f.evaluate(()=>UPPDRAG_CH1_PILOT.openBook());assert.doesNotMatch(await f.locator('#ch1Modal').innerText(),/kapitel 2/i);
  assert.equal(await f.locator('a[href*="chapter2-pilot"]').count(),0);await f.evaluate(()=>UPPDRAG_CH1_PILOT.close());
 }
 const original=()=>h.page.evaluate(ROOT=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith(ROOT+'play.')||k.startsWith(ROOT+'teacher.'))),ROOT);
 try{
  await boot();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),3);
  assert.equal(await f.evaluate(()=>typeof visitStagingRoom),'undefined','student link does not inject the teacher inspector');
  await h.page.evaluate(({ROOT,pilotKey})=>{
   localStorage.setItem(ROOT+'play.'+pilotKey,JSON.stringify({v:2,daler:19,record:[],complete:false}));
   localStorage.setItem(ROOT+'teacher.'+pilotKey,JSON.stringify({v:2,daler:88,record:[],complete:false}));
  },{ROOT,pilotKey});const ordinaryBefore=await original();
  // Query combinations that normally select prototypes or teacher preview
  // cannot widen this student entry point.
  const tampered=new URL(lesson);tampered.searchParams.set('chapter','5');tampered.searchParams.set('teacher','1');tampered.searchParams.set('testChapter','5');
  await boot(tampered.href);assert.equal(new URL(h.page.url()).searchParams.get('chapter'),'1');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),3,'lesson progress is independent of ordinary/teacher saves');
  await menu();assert.equal(await h.page.locator('#chapterList button').count(),1);assert.match(await h.page.locator('#chapterIntro').innerText(),/kapitel 1/i);
  assert.equal(await h.page.locator('#teacherSettings').isHidden(),true);assert.equal(await h.page.locator('#toggleTeacher').isDisabled(),true);
  await h.page.evaluate(()=>document.getElementById('toggleTeacher').onclick());
  assert.equal(await f.evaluate(()=>typeof visitStagingRoom),'undefined');assert.equal(await h.page.locator('#chapterList button').count(),1);await h.page.locator('#closeMenu').click();
  for(const ch of [2,3,4,5,6,7,8,9,10])assert.equal(await h.page.evaluate(ch=>openIntegratedChapter(ch),ch),false,'chapter '+ch+' stays unavailable');
  await boot();
  await f.evaluate(()=>{UPPDRAG_CH1_PILOT.state.daler=7;UPPDRAG_CH1_PILOT.persist();});
  assert.equal(await h.page.evaluate(({scope,key})=>JSON.parse(localStorage.getItem(scope+key)).daler,{scope:lessonScope,key:pilotKey}),7);
  assert.deepEqual(await original(),ordinaryBefore);
  // Seed eight real stamps and complete the final master task through the
  // normal question UI. Completion must not advertise or unlock chapter two.
  const seed=await f.evaluate(()=>({pilot:JSON.parse(localStorage.getItem(UPPDRAG_CH1_PILOT.saveKey)),mastery:UPPDRAG_MASTERY.snapshot().state}));
  for(const area of Object.values(seed.mastery.areas))for(const cell of Object.values(area)){cell.status='clear';cell.attempt=1;}
  seed.mastery.areas.trade.master.status='in-progress';
  Object.assign(seed.pilot,{step:8,index:0,trial:1,mode:'question',record:[],earned:{},sessions:{},reviewQueue:[],recallUI:null,recallInterlude:null,recallShown:{},recallClock:0,recallAttempt:1,recallEvidence:[],archiveActive:false,complete:false,masteryMigrated:true});
  delete seed.pilot.recallMainSnapshot;
  await h.page.evaluate(({scope,pilotKey,masteryKey,seed})=>{localStorage.setItem(scope+pilotKey,JSON.stringify(seed.pilot));localStorage.setItem(scope+masteryKey,JSON.stringify(seed.mastery));},{scope:lessonScope,pilotKey,masteryKey,seed});
  await boot();
  assert.equal(await f.evaluate(()=>{
   UPPDRAG_CH1_PILOT.close();UPPDRAG_MEETINGS.close(false);if(interior)leaveInterior();path=[];
   player={...navigationPoint(region,region.harbor)};camera={...player};
   const opened=requestHarbour();draw();UPPDRAG_MEETINGS.close(false);UPPDRAG_CH1_PILOT.enterMemory();return opened&&interior?.outdoor;
  }),true);
  const task=await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.current);assert.equal(task.id,'rc1-trade-2');
  for(let i=0;i<task.fields.length;i++)await f.locator('[data-rc-field="'+i+'"]').fill(task.fields[i].sample);
  await f.locator('[data-action="rc-submit"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.ui.phase),'feedback');await f.locator('[data-action="rc-next"]').click();
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.chapterComplete()),true);assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.complete),true);
  assert.doesNotMatch(await f.locator('#ch1Modal').innerText(),/kapitel 2/i);await noNext();
  assert.equal(await h.page.evaluate(()=>openIntegratedChapter(2)),false,'even full mastery cannot open chapter two in this link');
  await boot();assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.chapterComplete()),true);await noNext();
  const finishedDaler=await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler);assert.equal(finishedDaler,8,'only the genuinely completed last test awards its once-only reward');
  // Real export/import with a foreign lastChapter must land back in chapter 1.
  await menu();await h.page.getByText('Sparning och version',{exact:true}).click();
  const download=h.page.waitForEvent('download');await h.page.locator('#exportSave').click();
  fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});const saveFile=path.join(h.root,'qa/chapter-one-only-save.json');await(await download).saveAs(saveFile);
  const exported=JSON.parse(fs.readFileSync(saveFile,'utf8'));assert.equal(exported.teacher,false);assert(exported.entries[masteryKey]);
  exported.entries.lastChapter='5';exported.entries['uppdrag1700.ch5-real-world.20261020.v1']=JSON.stringify({v:2,complete:true,daler:55,record:[]});fs.writeFileSync(saveFile,JSON.stringify(exported));
  await f.evaluate(()=>{UPPDRAG_CH1_PILOT.state.daler=1;UPPDRAG_CH1_PILOT.persist();});
  h.page.once('dialog',dialog=>dialog.accept());const navigation=h.page.waitForNavigation({waitUntil:'domcontentloaded'});await h.page.locator('#saveFile').setInputFiles(saveFile);await navigation;await loaded();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),finishedDaler);assert.equal(await h.page.evaluate(()=>openIntegratedChapter(5)),false);
  // A new replay remains lesson-only, and returning restores this lesson's
  // base round rather than opening the unrestricted game.
  await menu();const replayNavigation=h.page.waitForURL(url=>url.searchParams.has('replay'));await h.page.locator('#replayChapter').click();await replayNavigation;await loaded();
  assert.equal(new URL(h.page.url()).searchParams.get('only'),'1');assert.equal(new URL(h.page.url()).searchParams.get('chapter'),'1');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),3);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0);
  await f.evaluate(()=>{UPPDRAG_CH1_PILOT.state.daler=1;UPPDRAG_CH1_PILOT.persist();});
  assert.equal(await h.page.evaluate(({scope,key})=>JSON.parse(localStorage.getItem(scope+key)).daler,{scope:lessonScope,key:pilotKey}),finishedDaler);
  await h.page.setViewportSize({width:390,height:844});await menu();assert.equal(await h.page.locator('#chapterList button').count(),1);assert.equal(await h.page.locator('#teacherSettings').isHidden(),true);assert.equal(await h.page.locator('#menu').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
  await h.page.screenshot({path:path.join(h.root,'qa/chapter-one-only-mobile.png')});
  const returnNavigation=h.page.waitForURL(url=>!url.searchParams.has('replay'));await h.page.locator('#returnOriginal').click();await returnNavigation;await loaded();
  assert.equal(new URL(h.page.url()).searchParams.get('only'),'1');assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),finishedDaler);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.chapterComplete()),true);
  assert.deepEqual(await original(),ordinaryBefore);assert.deepEqual(h.errors,[]);
  console.log('PASS chapter-one-only student link: forced chapter, hidden/guarded teacher UI, all later chapters blocked after real final completion/import, separate unchanged normal saves, reload, lesson replay/return and mobile');
 }catch(e){console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await f.evaluate(()=>({chapter:window.__INTEGRATED_CHAPTER,lesson:window.__UPPDRAG_LESSON_ONLY,room:typeof interior==='undefined'?null:interior?.kind,pilot:window.UPPDRAG_CH1_PILOT?.state,mastery:window.UPPDRAG_MASTERY?.summary()})).catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
