const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
(async()=>{
 const root=path.resolve(__dirname,'../../..'),server=http.createServer((req,res)=>{const p=path.join(root,decodeURIComponent(req.url.split('?')[0]));let file=p;if(fs.existsSync(p)&&fs.statSync(p).isDirectory())file=path.join(p,'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}const type={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.json':'application/json'}[path.extname(file)]||'application/octet-stream';res.setHeader('Content-Type',type);res.end(fs.readFileSync(file));});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const p=await b.newPage({viewport:{width:1200,height:850},reducedMotion:'reduce'});p.setDefaultTimeout(12000);p.on('pageerror',e=>console.log('ERROR',e.message));
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const origin='http://127.0.0.1:'+server.address().port, url=origin+'/docs/spel/?teacher=1&chapter=1';
 let f;
 const key='uppdrag1700.integrated.20261023.v1.teacher.',pilotKey='uppdrag1700.ch1-real-world.20261019.v11';
 async function boot(target=url){await p.goto(target,{waitUntil:'domcontentloaded'});f=await (await p.waitForSelector('#game',{timeout:30000})).contentFrame();await f.waitForSelector('#ch1Hud');assert.equal(await p.locator('#error').innerText(),'');}
 const state=()=>f.evaluate(()=>({m:UPPDRAG_MASTERY.snapshot(),s:UPPDRAG_CH1_PILOT.state}));
 async function mb(name){await f.locator('[data-mb="'+name+'"]').first().click();}
 async function room(key){assert.equal(await f.evaluate(key=>visitStagingRoom(key,'main'),key),true);await f.evaluate(()=>UPPDRAG_MEETINGS.close(false));}
 async function enter(id,level){
  await f.evaluate(()=>UPPDRAG_CH1_PILOT.openBook());
  await f.locator('[data-area="'+id+'"][data-level="'+level+'"]').click();
  await room({start:'palace',law:'riksdag',trade:'waterfront'}[id]);
  await f.evaluate(()=>UPPDRAG_CH1_PILOT.enterMemory());
 }
 async function answer(){
  const t=await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.current);
  for(let i=0;i<t.fields.length;i++){
   const field=t.fields[i];if(t.rank===0&&field.options){await f.locator('[data-field-index="'+i+'"]').filter({hasText:field.answers[0]}).click();}
   else await f.locator('[data-rc-field="'+i+'"]').fill(field.sample);
  }
  await f.locator('[data-action="rc-submit"]').click();
  const u=await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.ui);
  assert.equal(u.phase,'feedback',t.id+' did not pass sample: '+JSON.stringify(u.result));
  await f.locator('[data-action="rc-next"]').click();
 }
 async function finish(id,level){let guard=0;while((await state()).m.state.areas[id][level].status!=='clear'){assert(++guard<=5);await answer();}}
 try{
  await boot();await p.evaluate(({key,pilotKey})=>{
   localStorage.setItem(key+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{1:{wagon:'cleared',thief:'won',witness:'heard',distance:1400,thiefDistance:950,history:[]}}}));
  },{key,pilotKey});await boot();
  const sideBefore=await f.evaluate(()=>localStorage.getItem('uppdrag1700.side-adventures.v1'));
  await mb('book');assert.equal(await f.locator('[data-level="journeyman"]:disabled').count(),3);assert.equal(await f.locator('[data-level="master"]:disabled').count(),3);
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});await p.screenshot({path:path.join(root,'qa/mastery-book-desktop.png'),timeout:12000});
  // The student chooses the quay first, not the old fixed palace route.
  await enter('trade','learner');assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH1_PILOT.repetitionTaskIds),['rc1-trade-0']);
  await f.locator('[data-action="rc-hint"]').click();assert.equal((await state()).s.daler,2);await finish('trade','learner');
  assert.equal((await state()).m.summary.done,1);
  await enter('law','learner');await f.locator('[data-action="rc-skip"]').click();
  assert.equal((await state()).m.state.areas.law.learner.status,'failed');assert.equal(await f.locator('[data-mb="retry"]').isDisabled(),true);
  const worldBefore=await f.evaluate(()=>localStorage.getItem('uppdrag1700.story.v2.ch1'));
  await boot();await enter('law','learner');assert.equal((await state()).m.state.areas.law.learner.status,'failed');
  // No money or apples are needed at Rut; answer real drill fields.
  await room('archive');await f.evaluate(()=>UPPDRAG_CH1_PILOT.enterArchive());
  let guard=0;while((await state()).s.archiveMode!=='reward'){assert(++guard<8);await answer();}
  assert.equal((await state()).s.apples,1);
  await f.locator('[data-action="rc-rut-exit"]').click();await enter('law','learner');await mb('retry');
  assert.equal((await state()).s.apples,0);assert.equal((await state()).s.index,0);assert.equal((await state()).m.state.areas.trade.learner.status,'clear');
  assert.equal(await f.evaluate(()=>localStorage.getItem('uppdrag1700.story.v2.ch1')),worldBefore);
  await finish('law','learner');await enter('start','learner');await finish('start','learner');assert.equal((await state()).m.summary.level,'journeyman');
  for(const id of ['law','trade','start']){await enter(id,'journeyman');assert.equal(await f.locator('[data-action="rc-hint"]').count(),0);await finish(id,'journeyman');}
  assert.equal((await state()).m.summary.level,'master');
  await enter('trade','master');await f.locator('[data-rc-field="0"]').fill('Min formulering behöver granskas.');await f.locator('[data-action="rc-submit"]').click();await f.locator('[data-action="rc-save-review"]').click();
  assert.equal((await state()).m.state.areas.trade.master.status,'pending');assert.equal((await state()).s.complete,false);const apples=(await state()).s.apples;
  await boot();await enter('trade','master');await mb('review');
  await mb('approve');assert.equal((await state()).m.state.areas.trade.master.status,'pending','must acknowledge teacher review');
  // Teacher asks for a revision; the learner writes a sufficient answer.
  await mb('revise');await f.locator('[data-rc-field="0"]').fill('Det handlade med Asien, bland annat Kina, och importerade exempelvis te.');await f.locator('[data-action="rc-submit"]').click();
  assert.equal((await state()).m.state.areas.trade.master.status,'pending','supported revision needs review');
  await mb('review');await f.locator('#mbTeacher').check();await mb('approve');await f.locator('[data-action="rc-next"]').click();
  assert.equal((await state()).m.state.areas.trade.master.status,'clear');assert.equal((await state()).s.apples,apples);
  for(const id of ['law','start']){await enter(id,'master');await finish(id,'master');}
  assert.equal((await state()).s.complete,true);assert.equal((await state()).m.summary.chapterComplete,true);
  assert.equal(await f.evaluate(()=>localStorage.getItem('uppdrag1700.side-adventures.v1')),sideBefore);
  assert.equal((await state()).s.record.filter(x=>x.assessment==='teacher-approved').length,1);
  const saved=await p.evaluate(key=>Object.fromEntries(Object.keys(localStorage).filter(k=>k.startsWith(key)).map(k=>[k.slice(key.length),localStorage.getItem(k)])),key);
  await boot();assert.equal((await state()).s.complete,true);assert.equal((await state()).m.summary.done,3);
  await p.setViewportSize({width:390,height:844});await mb('book');await p.screenshot({path:path.join(root,'qa/mastery-book-mobile.png'),timeout:12000});
  assert.equal(await f.evaluate(()=>document.getElementById('ch1Modal').scrollWidth<=document.getElementById('ch1Modal').clientWidth),true);
  await f.locator('#ch1Modal').press('Escape');assert.equal(await f.locator('#ch1Modal').isHidden(),true);
  console.log('PASS chapter 1 browser: all 15 tasks, free area order, gates, failure, Rut/apple, review, reload, side continuity and mobile');
  // Export is the real menu download, including all four save namespaces.
  await p.locator('#menuButton').click();await p.locator('summary').filter({hasText:'Sparning och version'}).click();
  const download=await Promise.all([p.waitForEvent('download'),p.locator('#exportSave').click()]);const file=await download[0].path(),exported=JSON.parse(fs.readFileSync(file));
  for(const name of ['uppdrag1700.mastery.v1.ch1','uppdrag1700.story.v2.ch1','uppdrag1700.people.v2.ch1','uppdrag1700.side-adventures.v1'])assert(exported.entries[name]);
  // Normal pupils cannot navigate with only a legacy complete boolean.
  await p.evaluate(({pilotKey})=>{localStorage.setItem('uppdrag1700.integrated.20261023.v1.play.'+pilotKey,JSON.stringify({v:2,step:9,mode:'finished',record:[],complete:true,daler:9,apples:2,earned:{}}));},{pilotKey});
  await boot(origin+'/docs/spel/?chapter=2');assert.match(await p.locator('#status').innerText(),/Kapitel 1/);assert.equal((await state()).s.daler,9);assert.equal((await state()).s.apples,2);assert.equal((await state()).s.complete,false);
  assert(await f.evaluate(()=>localStorage.getItem('uppdrag1700.ch1-real-world.20261019.v11.before-mastery-2')));
  // A fully evidenced save permits the actual next chapter in normal play.
  await p.evaluate(saved=>{for(const[k,v]of Object.entries(saved))localStorage.setItem('uppdrag1700.integrated.20261023.v1.play.'+k,v);},saved);
  await boot(origin+'/docs/spel/?chapter=2');assert.match(await p.locator('#status').innerText(),/Kapitel 2/);
  console.log('PASS export, legacy backup/no invented stamps, separate teacher/pupil saves and real chapter-2 gate');
  assert.deepEqual(errors,[]);
 }catch(e){console.error('Parent error:',await p.locator('#error').textContent().catch(()=>''));throw e;}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
