const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('chapter-one-apple');let f;
 const ROOT=process.env.GAME_SAVE_ROOT||'uppdrag1700.integrated.20261023.v1.';
 const scope=ROOT+'lesson.1.play.',pilotKey='uppdrag1700.ch1-real-world.20261019.v11',masteryKey='uppdrag1700.mastery.v1.ch1';
 const base=new URL(h.url),version=base.searchParams.get('v');base.search='';
 const lesson=new URL(base);lesson.searchParams.set('only','1');lesson.searchParams.set('chapter','1');if(version)lesson.searchParams.set('v',version);
 const ordinary=new URL(base);ordinary.searchParams.set('chapter','1');if(version)ordinary.searchParams.set('v',version);
 async function loaded(lessonOnly=true){
  await h.page.waitForFunction(()=>document.getElementById('error')?.textContent||(document.getElementById('intro')?.hidden&&document.getElementById('game')?.contentWindow?.UPPDRAG_CH1_PILOT),undefined,{timeout:45000});
  assert.equal(await h.page.locator('#error').innerText(),'');f=await(await h.page.locator('#game').elementHandle()).contentFrame();await f.waitForSelector('#ch1Hud');
  assert.equal(await f.evaluate(()=>__UPPDRAG_LESSON_ONLY),lessonOnly?1:0);
 }
 async function boot(url=lesson.href,lessonOnly=true){await h.page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});await loaded(lessonOnly);}
 const state=()=>f.evaluate(()=>({s:JSON.parse(JSON.stringify(UPPDRAG_CH1_PILOT.state)),m:UPPDRAG_MASTERY.snapshot().state}));
 async function room(kind){
  assert.equal(await f.evaluate(kind=>{
   UPPDRAG_CH1_PILOT.close();UPPDRAG_MEETINGS.close(false);if(interior)leaveInterior();path=[];
   const b=region.buildings.find(b=>ROOM_BY_REGION[region.id]?.[b.name]===kind);if(!b)return false;
   player={...navigationPoint(region,UPPDRAG_STORY_WORLD.entryFor(region,b)||b.entry)};camera={...player};
   const opened=requestInterior(b);draw();UPPDRAG_MEETINGS.close(false);return opened&&interior?.kind===kind;
  },kind),true,'room '+kind);
 }
 async function start(){await room('palace');await f.evaluate(()=>UPPDRAG_CH1_PILOT.enterMemory());}
 async function answer(){
  const t=await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.current);
  for(let i=0;i<t.fields.length;i++){
   if(t.rank===0&&t.fields[i].options)await f.locator('[data-field-index="'+i+'"]').filter({hasText:t.fields[i].answers[0]}).click();
   else await f.locator('[data-rc-field="'+i+'"]').fill(t.fields[i].sample);
  }
  await f.locator('[data-action="rc-submit"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.ui.phase),'feedback',t.id+' must pass');
  await f.locator('[data-action="rc-next"]').click();
 }
 async function rut(){
  await room('archive');assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.enterArchive()),true);
  let guard=0;while((await state()).s.archiveMode!=='reward'){assert(++guard<10,'Rut round terminates');await answer();}
 }
 async function menu(){if(!await h.page.locator('#menu').evaluate(e=>e.open))await h.page.locator('#menuButton').click();}
 function preserved(x){return {record:x.s.record,earned:x.s.earned,reviewQueue:x.s.reviewQueue,daler:x.s.daler,mastery:x.m};}
 try{
  await boot();assert.equal((await state()).s.apples,0);
  // The rule belongs to the chapter-one pupil link. The ordinary save keeps
  // its existing stock and must not be rewritten by lesson play.
  const ordinarySeed=(await state()).s;ordinarySeed.apples=2;ordinarySeed.daler=13;
  await h.page.evaluate(({ROOT,key,value})=>localStorage.setItem(ROOT+'play.'+key,JSON.stringify(value)),{ROOT,key:pilotKey,value:ordinarySeed});
  await boot(ordinary.href,false);assert.equal((await state()).s.apples,2);
  const ordinaryBefore=await h.page.evaluate(ROOT=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith(ROOT+'play.')||k.startsWith(ROOT+'teacher.'))),ROOT);
  await boot();
  // A real two-question area is failed at its second question. The apple must
  // reopen the whole area, including the first question that was correct.
  await start();assert.equal((await state()).s.index,0);await answer();assert.equal((await state()).s.index,1);
  await f.locator('[data-action="rc-skip"]').click();
  assert.equal((await state()).m.areas.start.learner.status,'failed');assert.equal(await f.locator('[data-mb="retry"]').isDisabled(),true);
  const beforeRut=await state();await rut();assert.equal((await state()).s.apples,1);
  assert.deepEqual((await state()).m,beforeRut.m,'practice does not award or modify test stamps');
  await f.locator('[data-action="rc-rut-again"]').click();
  let guard=0;while((await state()).s.archiveMode!=='reward'){assert(++guard<10);await answer();}
  assert.equal((await state()).s.apples,1,'a second completed practice round cannot stockpile apples');
  const fullCopy=await f.locator('#ch1Modal').innerText();assert.match(fullCopy,/äpple/i);assert.doesNotMatch(fullCopy,/Rut ger dig ett äpple/,'full-pocket feedback must not claim another apple was awarded');
  assert.deepEqual((await state()).m,beforeRut.m);
  await f.locator('[data-action="rc-rut-exit"]').click();await start();
  await f.locator('[data-mb="retry"]').click();
  assert.equal((await state()).s.apples,0);assert.equal((await state()).s.index,0);assert.equal((await state()).s.trial,2);assert.equal((await state()).m.areas.start.learner.status,'in-progress');
  await f.locator('[data-action="rc-skip"]').click();
  assert.equal((await state()).m.areas.start.learner.status,'failed');assert.equal(await f.locator('[data-mb="retry"]').isDisabled(),true);
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.retryWithApple('start','learner').ok),false);
  const secondFailure=await state();await rut();assert.equal((await state()).s.apples,1,'a fresh completed practice round earns the next apple');assert.deepEqual((await state()).m,secondFailure.m);
  await boot();assert.equal((await state()).s.apples,1,'the one apple survives reload');
  const migrationBefore=await state();
  await h.page.evaluate(({scope,key})=>{const saved=JSON.parse(localStorage.getItem(scope+key));saved.apples=5;localStorage.setItem(scope+key,JSON.stringify(saved));},{scope,key:pilotKey});
  await boot();assert.equal((await state()).s.apples,1,'old lesson stock is capped on load');assert.deepEqual(preserved(await state()),preserved(migrationBefore));
  assert.equal(await h.page.evaluate(({scope,key})=>JSON.parse(localStorage.getItem(scope+key)).apples,{scope,key:pilotKey}),1,'the normalized quantity is persisted');
  // Import uses the real save UI, with an older file containing excess stock.
  await menu();await h.page.getByText('Sparning och version',{exact:true}).click();
  const downloading=h.page.waitForEvent('download');await h.page.locator('#exportSave').click();
  fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});const file=path.join(h.root,'qa/chapter-one-apple-save.json');await(await downloading).saveAs(file);
  const exported=JSON.parse(fs.readFileSync(file,'utf8')),imported=JSON.parse(exported.entries[pilotKey]);imported.apples=9;exported.entries[pilotKey]=JSON.stringify(imported);fs.writeFileSync(file,JSON.stringify(exported));
  h.page.once('dialog',dialog=>dialog.accept());const navigation=h.page.waitForNavigation({waitUntil:'domcontentloaded'});await h.page.locator('#saveFile').setInputFiles(file);await navigation;await loaded();
  assert.equal((await state()).s.apples,1,'imported old lesson stock is capped');assert.deepEqual(preserved(await state()),preserved(migrationBefore));
  const ordinaryAfter=await h.page.evaluate(ROOT=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith(ROOT+'play.')||k.startsWith(ROOT+'teacher.'))),ROOT);assert.deepEqual(ordinaryAfter,ordinaryBefore,'lesson play/import leaves ordinary and teacher saves unchanged');
  assert.deepEqual(h.errors,[]);
  console.log('PASS chapter-one apple limit: two real Rut rounds cap stock at one, truthful full-pocket feedback, whole-area retry consumes one, next failure needs fresh practice, reload/import cap old stock without changing stamps/history/money, ordinary stock preserved');
 }catch(e){console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await state().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
