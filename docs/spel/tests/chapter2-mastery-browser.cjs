const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
(async()=>{
 const root=path.resolve(__dirname,'../../..'),server=http.createServer((req,res)=>{const p=path.join(root,decodeURIComponent(req.url.split('?')[0]));let file=p;if(fs.existsSync(p)&&fs.statSync(p).isDirectory())file=path.join(p,'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}const type={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.json':'application/json'}[path.extname(file)]||'application/octet-stream';res.setHeader('Content-Type',type);res.end(fs.readFileSync(file));});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,proxy:process.env.GAME_URL&&process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const p=await b.newPage({ignoreHTTPSErrors:!!process.env.GAME_URL,viewport:{width:1200,height:850},reducedMotion:process.env.REDUCED_MOTION==='1'?'reduce':'no-preference'});p.setDefaultTimeout(process.env.GAME_URL?45000:12000);p.on('pageerror',e=>console.log('ERROR',e.message));
 const errors=[];p.on('pageerror',e=>errors.push(e.message));

 const origin='http://127.0.0.1:'+server.address().port;
 const key=process.env.GAME_SAVE_ROOT||'uppdrag1700.integrated.20261023.v1.replay.qa-chapter2.play.';
 const gameURL=process.env.GAME_URL||origin+'/docs/spel/?chapter=2&testChapter=2&replay=qa-chapter2';
 let f;
 const pilotKey='uppdrag1700.ch2-real-world.20261019.v1',previousKey='uppdrag1700.ch1-real-world.20261019.v11';
 async function boot(url=gameURL){await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});f=await(await p.waitForSelector('#game',{timeout:45000})).contentFrame();await f.waitForSelector('#ch1Hud');assert.equal(await p.locator('#error').innerText(),'');}
 const state=()=>f.evaluate(()=>({m:UPPDRAG_MASTERY.snapshot(),s:UPPDRAG_CH2_PILOT.state}));
 async function mb(name){await f.locator('[data-mb="'+name+'"]').first().click();}
 async function room(kind){
  assert.equal(await f.evaluate(kind=>{
   UPPDRAG_CH2_PILOT.close();UPPDRAG_MEETINGS.close(false);if(interior)leaveInterior();path=[];
   const b=region.buildings.find(b=>ROOM_BY_REGION[region.id]?.[b.name]===kind),entry=UPPDRAG_STORY_WORLD.entryFor(region,b)||b.entry;
   player={...navigationPoint(region,entry)};camera={...player};const ok=requestInterior(b);draw();return ok&&interior?.kind===kind;
  },kind),true);
 }
 async function enter(area,level){
  await f.evaluate(()=>UPPDRAG_CH2_PILOT.openBook());await f.locator('[data-area="'+area+'"][data-level="'+level+'"]').click();
  await room(area==='children'?'barnhus':'church');
  await f.evaluate(()=>{UPPDRAG_MEETINGS.close(false);UPPDRAG_CH2_PILOT.enterMemory();});
 }
 async function answer(){
  const task=await f.evaluate(()=>UPPDRAG_CH2_PILOT.recall.current);
  if(await f.locator('[data-action="rc-tf-true"]').count()){
   const statement=await f.locator('.rc-own').innerText(),variant=task.variants.find(v=>v.text===statement);assert(variant,'unknown true/false statement');
   await f.locator('[data-action="rc-tf-'+(variant.truth?'true':'false')+'"]').click();
   if(variant.truth){assert.equal((await f.evaluate(()=>UPPDRAG_CH2_PILOT.recall.ui)).phase,'feedback');await f.locator('[data-action="rc-next"]').click();return;}
  }
  for(let i=0;i<task.fields.length;i++){
   if(task.rank===0&&task.fields[i].options)await f.locator('[data-field-index="'+i+'"]').filter({hasText:task.fields[i].answers[0]}).click();
   else await f.locator('[data-rc-field="'+i+'"]').fill(task.fields[i].sample);
  }
  await f.locator('[data-action="rc-submit"]').click();
  const ui=await f.evaluate(()=>UPPDRAG_CH2_PILOT.recall.ui);assert.equal(ui.phase,'feedback',task.id+': '+JSON.stringify(ui));
  await f.locator('[data-action="rc-next"]').click();
 }
 async function finish(area,level){let guard=0;while((await state()).m.state.areas[area][level].status!=='clear'){assert(++guard<5);await answer();}}
 async function greet(kind){
  await room(kind);
  await f.waitForFunction(()=>!document.getElementById('meetingPerson').hidden||!document.getElementById('meetingDialogue').hidden);
  if(await f.locator('#meetingDialogue').isHidden())await f.locator('#meetingPerson').click();
  for(let i=0;i<8&&await f.locator('#chapter2Replies').isHidden();i++)await f.locator('#meetingDialogue').click();
  assert.equal(await f.locator('#chapter2Replies').isVisible(),true);
 }
 try{
  await boot();await p.evaluate(({key,pilotKey,previousKey})=>{
   for(const k of Object.keys(localStorage))if(k.startsWith(key))localStorage.removeItem(k);
   localStorage.setItem(key+previousKey,JSON.stringify({v:2,daler:5,apples:0,record:[{id:'rc1-queen-0',ok:true}],earned:{'rc1-queen-0':true},encountered:['rc1-queen-0'],complete:false}));
   localStorage.setItem(key+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{2:{wagon:'cleared',wagonSeen:true,thief:'unseen',distance:0,thiefDistance:1800,witness:'unseen',history:[]}}}));
  },{key,pilotKey,previousKey});await boot();
  assert.equal((await state()).s.daler,5);assert.equal((await state()).s.apples,0);
  const previousBefore=await f.evaluate(previousKey=>localStorage.getItem(previousKey),previousKey);
  const all=await f.evaluate(()=>({ids:UPPDRAG_CH2_PILOT.scenes.flatMap(r=>r.f),bank:UPPDRAG_RECALL_BANK.filter(t=>t.chapter===2).map(t=>t.id)}));assert.deepEqual(all.ids.slice().sort(),all.bank.slice().sort());assert.equal(new Set(all.ids).size,15);
  assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH2_PILOT.repetitionTaskIds),['rc1-queen-0'],'Rut and thief use encountered topics across chapter boundaries');
  await mb('book');assert.equal(await f.locator('[data-level="journeyman"]:disabled').count(),3);assert.equal(await f.locator('[data-level="master"]:disabled').count(),3);
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});await p.screenshot({path:path.join(root,'qa/chapter2-book.png')});
  // Choose a document with the real NPC dialogue; player answers stay outside speech.
  await greet('church');assert.equal(await f.locator('#meetingDialogue [data-ch1-choice]').count(),0);
  assert.equal(await f.locator('[data-ch1-choice^="area:"]').count(),2);assert.doesNotMatch(await f.locator('#meetingLine').innerText(),/Olof (visar|lägger|granskar)/);
  await p.screenshot({path:path.join(root,'qa/chapter2-olof-choices.png')});
  await p.setViewportSize({width:390,height:844});await f.evaluate(()=>draw());
  const bubble=await f.locator('#meetingDialogue').boundingBox(),reply=await f.locator('#chapter2Replies').boundingBox();assert(bubble.x>=0&&bubble.x+bubble.width<=391);assert(reply.y>=bubble.y+bubble.height+8,'player replies and speech stay separate on mobile');
  await p.screenshot({path:path.join(root,'qa/chapter2-choices-mobile.png')});await p.setViewportSize({width:1200,height:850});
  await f.locator('[data-ch1-choice="area:power"]').press('Enter');
  assert.equal(await f.locator('#ch1CutPaperScene').getAttribute('data-place'),'church');assert.equal(await f.locator('#chapter2Replies').isHidden(),true);
  await f.locator('[data-action="rc-hint"]').click();assert.equal((await state()).s.daler,4);await answer();
  await f.locator('[data-action="rc-skip"]').click();assert.equal((await state()).m.state.areas.power.learner.status,'failed');assert.equal(await f.locator('[data-mb="retry"]').isDisabled(),true);
  await enter('children','learner');await finish('children','learner');assert.equal((await state()).m.summary.done,1);
  // The delivered bread and wood exist in both the room and the close-up.
  await room('barnhus');await f.evaluate(()=>{UPPDRAG_MEETINGS.close(false);UPPDRAG_MEETINGS.start();});await f.waitForSelector('#meetingDialogue:not([hidden])');assert.match(await f.locator('#meetingLine').innerText(),/Välkommen tillbaka/);
  // A cleared learner area can still have a natural idle greeting with the delivery acknowledged.
  await f.evaluate(()=>UPPDRAG_MEETINGS.close(false));
  await enter('women','learner');await finish('women','learner');assert.equal((await state()).m.summary.done,2);
  await room('archive');await f.evaluate(()=>{UPPDRAG_MEETINGS.close(false);UPPDRAG_CH2_PILOT.enterArchive();});
  let guard=0;while((await state()).s.archiveMode!=='reward'){assert(++guard<10);await answer();}
  assert.equal((await state()).s.apples,1);await f.locator('[data-action="rc-rut-exit"]').click();
  await enter('power','learner');await mb('retry');assert.equal((await state()).s.apples,0);assert.equal((await state()).s.index,0);await finish('power','learner');
  assert.equal((await state()).m.summary.level,'journeyman');assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'cleared');
  for(const area of ['children','power','women']){await enter(area,'journeyman');assert.equal(await f.locator('[data-action="rc-hint"]').count(),0);await finish(area,'journeyman');}
  assert.equal((await state()).m.summary.level,'master');
  await enter('women','master');await f.locator('[data-rc-field="0"]').fill('Det här vill jag granska tillsammans med min lärare.');await f.locator('[data-action="rc-submit"]').click();await f.locator('[data-action="rc-save-review"]').click();
  assert.equal((await state()).m.state.areas.women.master.status,'pending');
  await boot();await enter('women','master');await mb('review');await mb('approve');assert.equal((await state()).m.state.areas.women.master.status,'pending');
  await mb('revise');const reviewed=await f.evaluate(()=>UPPDRAG_CH2_PILOT.recall.current);await f.locator('[data-rc-field="0"]').fill(reviewed.fields[0].sample);await f.locator('[data-action="rc-submit"]').click();
  await mb('review');await f.locator('#mbTeacher').check();await mb('approve');await f.locator('[data-action="rc-next"]').click();await finish('women','master');
  for(const area of ['children','power']){await enter(area,'master');await finish(area,'master');}
  assert.equal((await state()).m.summary.chapterComplete,true);assert.equal((await state()).s.complete,true);assert.equal((await state()).s.record.filter(r=>r.assessment==='teacher-approved').length,1);
  assert.equal(await f.evaluate(previousKey=>localStorage.getItem(previousKey),previousKey),previousBefore);
  await boot();assert.equal((await state()).s.complete,true);await mb('book');await p.setViewportSize({width:390,height:844});await p.screenshot({path:path.join(root,'qa/chapter2-book-mobile.png')});
  assert.equal(await f.locator('#ch1Modal').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
  await f.locator('#ch1Modal').press('Escape');await p.setViewportSize({width:1200,height:850});
  // The isolated chapter test opens the next chapter only after genuine chapter-2 stamps.
  await p.locator('#menuButton').click();const ch3=p.locator('#chapterList button').filter({hasText:'3. Krig eller fred?'});assert.equal(await ch3.isEnabled(),true);await p.locator('#closeMenu').click();
  console.log('PASS chapter 2: all 15 original tasks, three areas, real NPC document choice, on-site closeups, hints, full apple retry, cross-chapter Rut, review, gates, resources, persistent wagon, save/reload and mobile');
  assert.deepEqual(errors,[]);
 }catch(e){console.error('Parent',await p.locator('#error').textContent().catch(()=>''));console.error(await f?.evaluate(()=>({pilot:UPPDRAG_CH2_PILOT?.state,summary:UPPDRAG_MASTERY?.summary(),room:interior?.kind,meeting:UPPDRAG_MEETINGS?.state})));throw e;}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
