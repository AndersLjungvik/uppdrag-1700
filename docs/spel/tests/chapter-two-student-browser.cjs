const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
const {installTeacherCode}=require('./teacher-review-test-utils.cjs');
(async()=>{
 const h=await launch('chapter-two-student'),code=await installTeacherCode(h.page);let f,ch=1;
 const ROOT=process.env.GAME_SAVE_ROOT||'uppdrag1700.integrated.20261023.v1.',scope=ROOT+'lesson.1.play.';
 const keys={1:'uppdrag1700.ch1-real-world.20261019.v11',2:'uppdrag1700.ch2-real-world.20261019.v1'};
 const base=new URL(h.url),version=base.searchParams.get('v');base.search='';
 function url(limit=2,chapter=2){const u=new URL(base);u.searchParams.set('only',limit);u.searchParams.set('chapter',chapter);if(version)u.searchParams.set('v',version);return u;}
 async function loaded(expected){
  await h.page.waitForFunction(()=>document.getElementById('error')?.textContent||(document.getElementById('intro')?.hidden&&document.getElementById('game')?.contentWindow?.UPPDRAG_MASTERY),undefined,{timeout:45000});
  assert.equal(await h.page.locator('#error').innerText(),'');f=await(await h.page.locator('#game').elementHandle()).contentFrame();await f.waitForSelector('#ch1Hud');
  ch=await f.evaluate(()=>__INTEGRATED_CHAPTER);assert.equal(ch,expected);assert.equal(await f.evaluate(()=>typeof visitStagingRoom),'undefined');
 }
 async function boot(u=url(),expected=2){await h.page.goto(u.href||u,{waitUntil:'domcontentloaded',timeout:60000});await loaded(expected);}
 const state=()=>f.evaluate(()=>({s:JSON.parse(JSON.stringify(window['UPPDRAG_CH'+__INTEGRATED_CHAPTER+'_PILOT'].state)),m:UPPDRAG_MASTERY.snapshot().state}));
 async function put(which,snapshot){await h.page.evaluate(({scope,key,which,snapshot})=>{localStorage.setItem(scope+key,JSON.stringify(snapshot.s));localStorage.setItem(scope+'uppdrag1700.mastery.v1.ch'+which,JSON.stringify(snapshot.m));},{scope,key:keys[which],which,snapshot});}
 async function menu(){if(!await h.page.locator('#menu').evaluate(e=>e.open))await h.page.locator('#menuButton').click();}
 async function room(kind){assert.equal(await f.evaluate(kind=>{
  window['UPPDRAG_CH'+__INTEGRATED_CHAPTER+'_PILOT'].close();UPPDRAG_MEETINGS.close(false);if(interior)leaveInterior();path=[];
  if(kind==='quay'){player={...navigationPoint(region,region.harbor)};camera={...player};const ok=requestHarbour();draw();UPPDRAG_MEETINGS.close(false);return ok&&interior?.outdoor;}
  const b=region.buildings.find(b=>ROOM_BY_REGION[region.id]?.[b.name]===kind);if(!b)return false;
  player={...navigationPoint(region,UPPDRAG_STORY_WORLD.entryFor(region,b)||b.entry)};camera={...player};const ok=requestInterior(b);draw();UPPDRAG_MEETINGS.close(false);return ok&&interior?.kind===kind;
 },kind),true,kind);}
 async function start(){await room(ch===1?'quay':'barnhus');await f.evaluate(()=>{const p=window['UPPDRAG_CH'+__INTEGRATED_CHAPTER+'_PILOT'];p.selectArea(__INTEGRATED_CHAPTER===1?'trade':'children','master');p.enterMemory();});}
 async function answer(){const t=await f.evaluate(()=>window['UPPDRAG_CH'+__INTEGRATED_CHAPTER+'_PILOT'].recall.current);for(let i=0;i<t.fields.length;i++)await f.locator('[data-rc-field="'+i+'"]').fill(t.fields[i].sample);await tap('[data-action="rc-submit"]');assert.equal(await f.evaluate(()=>window['UPPDRAG_CH'+__INTEGRATED_CHAPTER+'_PILOT'].recall.ui.phase),'feedback',t.id);await tap('[data-action="rc-next"]');}
 async function tap(selector){const button=f.locator(selector);await button.waitFor({state:'visible'});assert.equal(await button.isEnabled(),true);await button.evaluate(el=>el.click());}
 async function seedLast(which){
  const seed=await state();for(const area of Object.values(seed.m.areas))for(const cell of Object.values(area)){cell.status='clear';cell.attempt=1;}
  seed.m.areas[which===1?'trade':'children'].master={status:'available',attempt:0};
  const known=await f.evaluate(()=>UPPDRAG_RECALL_BANK.filter(t=>t.chapter===1&&t.rank===0).map(t=>t.id));
  Object.assign(seed.s,{step:which===1?8:9,index:0,trial:0,mode:'intro',record:[],sessions:{},reviewQueue:[],reviewPractice:{},encountered:known,recallUI:null,recallInterlude:null,recallShown:{},recallClock:0,recallAttempt:0,recallEvidence:[],archiveActive:false,complete:false,masteryRewards:{}});delete seed.s.recallMainSnapshot;await put(which,seed);
 }
 async function noThree(){assert.equal(await f.locator('a[href*="chapter3-pilot"]').count(),0);await f.evaluate(()=>UPPDRAG_CH2_PILOT.openBook());assert.doesNotMatch(await f.locator('#ch1Modal').innerText(),/kapitel 3/i);await f.evaluate(()=>UPPDRAG_CH2_PILOT.close());}
 const trace=message=>{if(process.env.QA_PROGRESS)console.log(message);};
 const ordinary=()=>h.page.evaluate(ROOT=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith(ROOT+'play.')||k.startsWith(ROOT+'teacher.'))),ROOT);
 try{
  await boot(url(1,1),1);await h.page.evaluate(({ROOT,key})=>{localStorage.setItem(ROOT+'play.'+key,'{"v":2,"daler":77}');localStorage.setItem(ROOT+'teacher.'+key,'{"v":2,"daler":88}');},{ROOT,key:keys[1]});const ordinaryBefore=await ordinary();
  const tampered=url(2,2);tampered.searchParams.set('teacher','1');tampered.searchParams.set('testChapter','2');await boot(tampered,1);
  assert.equal(await f.evaluate(()=>__UPPDRAG_LESSON_ONLY),2);await menu();assert.equal(await h.page.locator('#chapterList button').count(),2);assert.equal(await h.page.locator('#chapterList button').nth(1).isDisabled(),true);assert.equal(await h.page.locator('#teacherSettings').isHidden(),true);await h.page.locator('#closeMenu').click();
  await f.evaluate(()=>{UPPDRAG_CH1_PILOT.state.daler=7;UPPDRAG_CH1_PILOT.state.apples=1;UPPDRAG_CH1_PILOT.persist();});
  await seedLast(1);await boot(url(1,1),1);await start();await answer();assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.chapterComplete()),true);assert.equal(await f.locator('a[href*="chapter2-pilot"]').count(),0,'old one-only link stays restricted');
  const previous=await h.page.evaluate(({scope,key})=>localStorage.getItem(scope+key),{scope,key:keys[1]});
  await boot(url(2,1),1);assert.equal(await f.locator('a[href*="chapter2-pilot"]').count(),1,'new link offers chapter two after real completion');
  await menu();assert.equal(await h.page.locator('#chapterList button').nth(1).isEnabled(),true);const next=h.page.waitForURL(u=>u.searchParams.get('chapter')==='2',{waitUntil:'domcontentloaded'});await h.page.locator('#chapterList button').nth(1).click({noWaitAfter:true});await next;await loaded(2);
  assert.equal(await f.evaluate(()=>__UPPDRAG_LESSON_ONLY),2);assert.equal((await state()).s.daler,8);assert.equal((await state()).s.apples,1);
  assert.equal(await h.page.evaluate(({scope,key})=>localStorage.getItem(scope+key),{scope,key:keys[1]}),previous,'chapter-one progress is reused without copying or reset');
  await f.evaluate(()=>{UPPDRAG_CH2_PILOT.state.apples=9;UPPDRAG_CH2_PILOT.persist();});assert.equal((await state()).s.apples,3);
  trace('PASS old pupil save and real entry to chapter two');await seedLast(2);await boot();await start();const task=await f.evaluate(()=>UPPDRAG_CH2_PILOT.recall.current);
  for(let i=0;i<task.fields.length;i++)await f.locator('[data-rc-field="'+i+'"]').fill('Det här vill jag visa min lärare.');
  await tap('[data-action="rc-submit"]');await tap('[data-action="rc-save-review"]');await tap('[data-mb="review"]');
  assert.equal(await f.locator('#mbTeacher').count(),0);await f.locator('#mbTeacherCode').fill('000000');await tap('[data-mb="approve"]');await f.waitForFunction(()=>!!document.getElementById('mbTeacherError')?.textContent);assert.equal((await state()).m.areas.children.master.status,'pending');
  const pending=await state();await f.locator('#mbTeacherCode').fill(code);await tap('[data-mb="approve"]');await tap('[data-action="rc-next"]');assert.equal((await state()).s.complete,true);await noThree();
  // A pupil can also take a new independent test after a real Rut round.
  await put(2,pending);await boot();await start();assert.equal(await f.locator('[data-mb="practice-retry"]').isDisabled(),true);
  await room('archive');await f.evaluate(()=>UPPDRAG_CH2_PILOT.enterArchive());let guard=0;while((await state()).s.archiveMode!=='reward'){assert(++guard<10);await answer();}
  assert.equal((await state()).s.apples,1);await start();assert.equal(await f.locator('[data-mb="practice-retry"]').isEnabled(),true);await tap('[data-mb="practice-retry"]');assert.equal((await state()).s.trial,2);await answer();
  assert.equal((await state()).s.complete,true);assert((await state()).s.record.some(r=>r.trial===2&&r.independent));await noThree();
  trace('PASS teacher code, practice retry and completed two without three');for(const chapter of [3,4,5,6,7,8,9,10])assert.equal(await h.page.evaluate(c=>openIntegratedChapter(c),chapter),false);await boot();
  await menu();await h.page.getByText('Sparning och version',{exact:true}).click();const downloading=h.page.waitForEvent('download');await h.page.locator('#exportSave').click();fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});const file=path.join(h.root,'qa/chapter-two-student-save.json');await(await downloading).saveAs(file);
  const saved=JSON.parse(fs.readFileSync(file,'utf8'));saved.entries.lastChapter='5';fs.writeFileSync(file,JSON.stringify(saved));h.page.once('dialog',d=>d.accept());const imported=h.page.waitForNavigation({waitUntil:'domcontentloaded'});await h.page.locator('#saveFile').setInputFiles(file);await imported;await loaded(1);assert.equal(new URL(h.page.url()).searchParams.get('only'),'2');await boot();assert.equal((await state()).s.complete,true);
  await h.page.setViewportSize({width:390,height:844});await menu();assert.equal(await h.page.locator('#chapterList button').count(),2);assert.equal(await h.page.locator('#menu').evaluate(e=>e.scrollWidth<=e.clientWidth),true);assert.equal(await h.page.locator('#teacherSettings').isHidden(),true);await h.page.screenshot({path:path.join(h.root,'qa/chapter-two-student-mobile.png')});
  trace('PASS import and mobile cap');const replay=h.page.waitForURL(u=>u.searchParams.has('replay'),{waitUntil:'domcontentloaded'});await h.page.locator('#replayChapter').click({noWaitAfter:true});await replay;await loaded(1);assert.equal(new URL(h.page.url()).searchParams.get('only'),'2');assert.equal(await h.page.evaluate(()=>openIntegratedChapter(2)),false);
  await menu();const returning=h.page.waitForURL(u=>!u.searchParams.has('replay'),{waitUntil:'domcontentloaded'});await h.page.locator('#returnOriginal').click({noWaitAfter:true});await returning;await loaded(2);assert.equal((await state()).s.complete,true);
  await boot(url(1,1),1);await menu();assert.equal(await h.page.locator('#chapterList button').count(),1);assert.equal(await h.page.evaluate(()=>openIntegratedChapter(2)),false);assert.deepEqual(await ordinary(),ordinaryBefore);assert.deepEqual(h.errors,[]);
  console.log('PASS chapter-two student link: same old pupil save, chapter-one gate and real completion, genuine entry to two, one apple, teacher code and independent retry, real final completion with no three, import/replay/return/mobile, original one-only link preserved');
 }catch(e){console.error('URL',h.page.url());console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await state().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
