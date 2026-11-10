const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
const {installTeacherCode}=require('./teacher-review-test-utils.cjs');
(async()=>{
 const h=await launch('chapter-one-review');let f;
 const teacherCode=await installTeacherCode(h.page);
 const ROOT=process.env.GAME_SAVE_ROOT||'uppdrag1700.integrated.20261023.v1.';
 const scope=ROOT+'lesson.1.play.',pilotKey='uppdrag1700.ch1-real-world.20261019.v11',masteryKey='uppdrag1700.mastery.v1.ch1';
 const url=new URL(h.url),version=url.searchParams.get('v');url.search='';url.searchParams.set('only','1');url.searchParams.set('chapter','1');if(version)url.searchParams.set('v',version);
 const state=()=>f.evaluate(()=>({s:JSON.parse(JSON.stringify(UPPDRAG_CH1_PILOT.state)),m:UPPDRAG_MASTERY.snapshot().state}));
 async function boot(){
  await h.page.goto(url.href,{waitUntil:'domcontentloaded',timeout:60000});
  await h.page.waitForFunction(()=>document.getElementById('error')?.textContent||(document.getElementById('intro')?.hidden&&document.getElementById('game')?.contentWindow?.UPPDRAG_CH1_PILOT),undefined,{timeout:45000});
  assert.equal(await h.page.locator('#error').innerText(),'');f=await(await h.page.locator('#game').elementHandle()).contentFrame();await f.waitForSelector('#ch1Hud');
  assert.equal(await f.evaluate(()=>__UPPDRAG_LESSON_ONLY),1);
 }
 async function put(snapshot){
  await h.page.evaluate(({scope,pilotKey,masteryKey,snapshot})=>{localStorage.setItem(scope+pilotKey,JSON.stringify(snapshot.s));localStorage.setItem(scope+masteryKey,JSON.stringify(snapshot.m));},{scope,pilotKey,masteryKey,snapshot});await boot();
 }
 async function room(kind){
  assert.equal(await f.evaluate(kind=>{
   UPPDRAG_CH1_PILOT.close();UPPDRAG_MEETINGS.close(false);if(interior)leaveInterior();path=[];
   const b=region.buildings.find(b=>ROOM_BY_REGION[region.id]?.[b.name]===kind);if(!b)return false;
   player={...navigationPoint(region,UPPDRAG_STORY_WORLD.entryFor(region,b)||b.entry)};camera={...player};
   const opened=requestInterior(b);draw();UPPDRAG_MEETINGS.close(false);return opened&&interior?.kind===kind;
  },kind),true,'room '+kind);
 }
 async function start(){await room('palace');await f.evaluate(()=>{UPPDRAG_CH1_PILOT.selectArea('start','master');UPPDRAG_CH1_PILOT.enterMemory();});}
 async function answer(){
  const t=await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.current);
  for(let i=0;i<t.fields.length;i++)await f.locator('[data-rc-field="'+i+'"]').fill(t.fields[i].sample);
  await f.locator('[data-action="rc-submit"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.ui.phase),'feedback',t.id+' sample passes');
  await f.locator('[data-action="rc-next"]').click();
 }
 async function enterRut(){await room('archive');assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.enterArchive()),true);}
 async function finishRut(){let guard=0;while((await state()).s.archiveMode!=='reward'){assert(++guard<=8,'Rut round terminates');await answer();}}
 const retryButton=()=>f.locator('[data-mb="practice-retry"]');
 async function noApproval(){
  const s=await state();assert.equal(s.m.areas.start.master.status,'pending');assert.equal(s.s.complete,false);
  assert.equal(s.s.record.filter(x=>x.assessment==='teacher-approved').length,0);
 }
 try{
  await boot();const seed=await state();
  for(const area of Object.values(seed.m.areas))for(const cell of Object.values(area)){cell.status='clear';cell.attempt=1;}
  seed.m.areas.start.master={status:'available',attempt:0};seed.m.history=[];
  const known=await f.evaluate(()=>UPPDRAG_RECALL_BANK.filter(t=>t.chapter===1&&t.rank===0).map(t=>t.id));
  Object.assign(seed.s,{step:7,index:0,trial:0,mode:'intro',record:[],earned:{},sessions:{},reviewQueue:[],reviewPractice:{},encountered:known,recallUI:null,recallInterlude:null,recallShown:{},recallClock:0,recallAttempt:0,recallEvidence:[],archiveActive:false,complete:false,masteryMigrated:true,apples:1,daler:7});
  delete seed.s.recallMainSnapshot;await put(seed);
  // A round completed BEFORE the review must not satisfy the new request.
  await enterRut();await finishRut();assert.equal((await state()).s.apples,1);const oldRound=(await state()).s.archiveRounds;
  await start();assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.current.id),'rc1-queen-2');await answer();
  assert.equal((await state()).s.index,1);assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.current.id),'rc1-power-2');
  const originalAnswer='Jag behöver fundera vidare på hur det fungerade.';
  await f.locator('[data-rc-field="0"]').fill(originalAnswer);await f.locator('[data-action="rc-submit"]').click();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.ui.phase),'review');
  assert.equal(await f.locator('[data-action="rc-practice-review"]').count(),1,'review has a route to practice instead of self-approval');
  const initialReview=await state();
  await f.locator('[data-action="rc-save-review"]').click();await noApproval();
  await f.locator('[data-mb="review"]').click();
  assert.equal(await f.locator('#mbTeacher').count(),0,'pupils cannot assert that they are the teacher');
  assert.equal(await f.locator('#mbTeacherCode').getAttribute('type'),'password');
  await f.locator('[data-mb="approve"]').click();await f.waitForFunction(()=>!!document.getElementById('mbTeacherError')?.textContent);await noApproval();
  await f.locator('#mbTeacherCode').fill('000000');await f.locator('[data-mb="approve"]').click();
  await f.waitForFunction(()=>!document.querySelector('[data-mb="approve"]')?.disabled&&!!document.getElementById('mbTeacherError')?.textContent);await noApproval();
  const pendingForTeacher=await state();
  // Exercise the direct practice button on the original question review.
  await put(initialReview);await start();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.ui.phase),'review');
  await f.locator('[data-action="rc-practice-review"]').click();await noApproval();
  await start();assert.equal(await retryButton().isDisabled(),true,'an old completed round does not unlock a fresh test');
  // Entering an archive round, leaving it, selecting another area and reloading
  // are all insufficient. Only its real completion callback supplies credit.
  await enterRut();assert((await state()).s.archiveRounds>oldRound);await start();
  assert.equal(await retryButton().isDisabled(),true,'merely entering Rut is insufficient');
  await f.evaluate(()=>UPPDRAG_CH1_PILOT.selectArea('trade','master'));
  await f.evaluate(()=>UPPDRAG_CH1_PILOT.selectArea('start','master'));
  assert.equal(await retryButton().isDisabled(),true,'area switching cannot bypass practice');
  await boot();await start();assert.equal(await retryButton().isDisabled(),true,'reload cannot bypass practice');
  const beforePractice=await state();await enterRut();await finishRut();
  assert.equal((await state()).s.apples,1,'practice still completes when the one-apple pocket is full');
  assert.deepEqual((await state()).m,beforePractice.m,'practice itself cannot award the missing master stamp');
  await boot();await start();assert.equal(await retryButton().isDisabled(),false,'completed practice survives reload');
  // Seeing the example again invalidates immediate independent credit.
  await f.locator('[data-mb="review"]').click();await f.evaluate(()=>UPPDRAG_CH1_PILOT.selectArea('start','master'));
  assert.equal(await retryButton().isDisabled(),true,'a newly exposed example needs intervening retrieval again');
  await enterRut();await finishRut();await start();assert.equal(await retryButton().isDisabled(),false);
  const beforeRetry=await state();await retryButton().click();
  const retried=await state();assert.equal(retried.s.index,0);assert.equal(retried.s.trial,2);assert.equal(retried.m.areas.start.master.status,'in-progress');
  assert.equal(retried.s.apples,beforeRetry.s.apples-1);assert.equal(retried.s.daler,beforeRetry.s.daler);
  assert.equal(retried.s.record.length,beforeRetry.s.record.length,'reopening gives no new correct answer');
  assert(retried.s.reviewQueue.some(x=>x.answer?.[0]===originalAnswer&&x.resolved==='apple-retry'),'original response is preserved as a review, not approved');
  assert.deepEqual(retried.m.areas.law,beforeRetry.m.areas.law);assert.deepEqual(retried.m.areas.trade,beforeRetry.m.areas.trade);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.current.id),'rc1-queen-2','the whole area restarts, including its previously correct question');
  await answer();await answer();
  const finished=await state();assert.equal(finished.m.areas.start.master.status,'clear');assert.equal(finished.s.complete,true);
  const independent=finished.s.record.filter(x=>x.trial===2&&['rc1-queen-2','rc1-power-2'].includes(x.id));
  assert.equal(independent.length,2);assert(independent.every(x=>x.independent&&!x.support),'new answers have genuinely clean recall support flags');
  assert.equal(await f.locator('a[href*="chapter2-pilot"]').count(),0);
  // Local QA uses a substituted digest; GAME_TEACHER_CODE exercises the real
  // classroom module without rewriting or publishing the classroom code.
  {
   await put(pendingForTeacher);await start();await f.locator('[data-mb="review"]').click();
   await h.page.setViewportSize({width:390,height:844});
   await f.locator('#mbTeacherCode').scrollIntoViewIfNeeded();
   assert.equal(await f.locator('#mbTeacherCode').isVisible(),true);
   assert.equal(await f.locator('#ch1Modal').evaluate(e=>e.scrollWidth<=e.clientWidth),true,'review panel fits the mobile screen horizontally');
   const inputBox=await f.locator('#mbTeacherCode').boundingBox();assert(inputBox.height>=44,'teacher code has a usable touch target');
   assert(inputBox.x>=0&&inputBox.x+inputBox.width<=390,'teacher input fits the mobile screen');
   fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/chapter-one-review-mobile.png')});
   await f.locator('#mbTeacherCode').fill(teacherCode);await f.locator('[data-mb="approve"]').click();
   await f.waitForFunction(()=>UPPDRAG_CH1_PILOT.state.record.some(x=>x.assessment==='teacher-approved'));
   const approved=await state(),record=approved.s.record.find(x=>x.assessment==='teacher-approved');
   assert.equal(approved.m.areas.start.master.status,'in-progress');assert.equal(record.independent,false);assert.equal(record.support,true);
   assert.equal(approved.s.reviewQueue.find(x=>x.id==='rc1-power-2').resolved,'approved');
   assert.equal(approved.s.reviewPractice?.[approved.s.step],undefined,'teacher approval discards the old practice ticket');
   assert.equal(await f.locator('#mbTeacherCode').count(),0,'approval does not leave an unlocked teacher input');
   await f.locator('[data-action="rc-next"]').click();assert.equal((await state()).m.areas.start.master.status,'clear');
  }
  assert.deepEqual(h.errors,[]);
  console.log('PASS chapter-one review: no self-approval, blank/wrong code rejected, only fresh completed Rut practice unlocks whole-area retest, exposure/area/reload guards, preserved history/resources, genuinely independent mastery, valid code approves only the pending response');
 }catch(e){console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await state().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
