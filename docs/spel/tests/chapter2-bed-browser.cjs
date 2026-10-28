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
 const bedKey='uppdrag1700.ch2-window-bed.v1';
 let currentURL=gameURL;
 async function boot(url=currentURL){currentURL=url;await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});f=await(await p.waitForSelector('#game',{timeout:45000})).contentFrame();await f.waitForSelector('#ch1Hud');await f.waitForFunction(()=>!!window.UPPDRAG_CH2_BED);assert.equal(await p.locator('#error').innerText(),'');}
 async function room(kind){assert.equal(await f.evaluate(kind=>{
  UPPDRAG_CH2_PILOT.close();UPPDRAG_MEETINGS.close(false);if(interior)leaveInterior();path=[];
  const b=region.buildings.find(b=>ROOM_BY_REGION[region.id]?.[b.name]===kind),entry=UPPDRAG_STORY_WORLD.entryFor(region,b)||b.entry;
  player={...navigationPoint(region,entry)};camera={...player};const opened=requestInterior(b);draw();return opened&&interior?.kind===kind;
 },kind),true);await p.waitForTimeout(80);}
 async function closeSpeech(){if(await f.locator('#adventureDialog').isVisible())await f.locator('#adventureDialog').press('Escape');}
 async function choose(id){
  for(let i=0;i<9&&!(await f.locator('[data-adventure="room:'+id+'"]').count());i++)await f.locator('.ad-utterance').click();
  await f.locator('[data-adventure="room:'+id+'"]').click();
 }
 async function karin(){await room('homes');await f.locator('#meetingPerson').click();await f.locator('#adventureDialog').waitFor({state:'visible'});}
 async function bed(){await f.evaluate(()=>UPPDRAG_MEETINGS.close(false));await f.locator('#ch2BedButton').waitFor({state:'visible'});await f.locator('#ch2BedButton').click();}
 async function cloth(id,x,y){await f.locator('[data-piece="'+id+'"]').click();const r=await f.locator('#quiltBoard').boundingBox();await f.locator('#quiltBoard').click({position:{x:r.width*x/600,y:r.height*y/280}});}
 try{
  for(const [iteration,pattern]of ['sail','stripe'].entries()){
   await boot();if(iteration===0){
    await p.evaluate(key=>localStorage.setItem(key+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{2:{wagon:'need-smith',wagonSeen:true,thief:'unseen',distance:200,thiefDistance:1500,witness:'unseen',history:[]}}})),key);await boot();
   }
   await p.emulateMedia({reducedMotion:iteration?'reduce':'no-preference'});
   const before=await f.evaluate(()=>({m:localStorage.getItem('uppdrag1700.mastery.v1.ch2'),daler:UPPDRAG_CH2_PILOT.state.daler,apples:UPPDRAG_CH2_PILOT.state.apples,wagon:UPPDRAG_EVENT_ENGINE.state.wagon}));
   assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.openBed()),false,'cannot accept a quest from outside the room');
   assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.openKarin()),false,'Karin cannot help remotely');
   if(iteration===0){
    await karin();assert.match(await f.locator('.ad-utterance').innerText(),/Jag heter Karin/);assert.doesNotMatch(await f.locator('.ad-utterance').innerText(),/Tillbaka/);await closeSpeech();
   }
   await room('barnhus');await bed();assert.match(await f.locator('.ad-utterance').innerText(),/Hålet följer med/);
   assert.equal(await f.locator('#adventureDialog [data-adventure]').count(),0,'player choices stay outside the speaker bubble');
   if(iteration===0){
    await choose('later');await closeSpeech();assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.phase),'available');await bed();
   }
   await choose('accept');assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.phase),'accepted');await closeSpeech();
   await f.evaluate(()=>UPPDRAG_CH2_PILOT.openBook());assert.match(await f.locator('#ch1Modal').innerText(),/Visa täcket för Karin/);assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.openBed()),false,'knowledge work is never interrupted');await f.locator('#ch1Modal').press('Escape');
   await boot();assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.phase),'accepted');
   if(iteration===0){
    await room('barnhus');await bed();await choose('karin');assert.equal(await f.evaluate(()=>interior),null);
    await f.waitForFunction(()=>interior?.kind==='homes',undefined,{timeout:30000});await f.locator('#meetingPerson').click();await f.locator('#adventureDialog').waitFor({state:'visible'});
   }else await karin();
   assert.match(await f.locator('.ad-utterance').innerText(),iteration===0?/Tillbaka redan/:/Lägg det här/);
   await choose('work');await f.locator('#quiltWorkshop').waitFor({state:'visible'});
   assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.phase),'repairing');
   assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.openBed()),false);
   await cloth('small',300,140);await f.locator('[data-quilt="check"]').click();assert.match(await f.locator('.quiltMessage').innerText(),/sticker hålet fortfarande fram/);assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.phase),'repairing');
   if(iteration===0){
    await f.locator('[data-quilt="guide"]').click();assert.match(await f.locator('.quiltMessage').innerText(),/två smala/);
    await boot();assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.phase),'repairing');assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH2_BED.state.layout.small),{x:300,y:140});
    await karin();await choose('work');
   }
   fs.mkdirSync(path.join(root,'qa'),{recursive:true});
   if(iteration===1){await p.setViewportSize({width:390,height:844});const bounds=await f.locator('.quiltSheet').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=391);assert.equal(await f.locator('.quiltSheet').evaluate(e=>e.scrollWidth<=e.clientWidth),true);await p.screenshot({path:path.join(root,'qa/quilt-workshop-mobile.png')});await f.locator('#quiltBoard').press('Escape');assert.equal(await f.evaluate(()=>interior?.kind),'homes');await karin();await choose('work');await p.setViewportSize({width:1200,height:850});}
   await f.locator('[data-quilt="clear"]').click();
   if(iteration===0){await f.locator('[data-piece="wide"]').click();await f.locator('#quiltBoard').press('Enter');}
   else {await cloth('left',260,140);await cloth('right',340,140);}
   const layout=await f.evaluate(()=>UPPDRAG_CH2_BED.state.layout);assert.deepEqual(Object.keys(layout).sort(),iteration===0?['wide']:['left','right']);
   await p.screenshot({path:path.join(root,'qa/quilt-solution-'+pattern+'.png')});
   await f.locator('[data-quilt="check"]').click();assert.equal(await f.locator('#quiltWorkshop').count(),0);assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.phase),'ready');assert.match(await f.locator('.ad-utterance').innerText(),/Jag syr fast det/);await closeSpeech();
   if(iteration===0){await f.locator('#meetingPerson').click();await choose('return');await f.waitForFunction(()=>interior?.kind==='barnhus',undefined,{timeout:30000});}else await room('barnhus');
   await bed();await choose(pattern);assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.phase),'delivered');assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.pattern),pattern);await closeSpeech();
   await p.screenshot({path:path.join(root,'qa/quilt-delivered-'+pattern+'.png')});
   const after=await f.evaluate(()=>({m:localStorage.getItem('uppdrag1700.mastery.v1.ch2'),daler:UPPDRAG_CH2_PILOT.state.daler,apples:UPPDRAG_CH2_PILOT.state.apples,wagon:UPPDRAG_EVENT_ENGINE.state.wagon}));assert.deepEqual(after,before,'the story never spends money, apples or knowledge progress, and preserves old wagon status');
   await boot();await room('barnhus');assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.pattern),pattern);await bed();assert.match(await f.locator('.ad-utterance').innerText(),/inte gömma hålet/);await closeSpeech();await bed();assert.match(await f.locator('.ad-utterance').innerText(),/mitt täcke/);await closeSpeech();
   await karin();assert.match(await f.locator('.ad-utterance').innerText(),/Blev barnet nöjt/);await closeSpeech();await f.locator('#meetingPerson').click();assert.match(await f.locator('.ad-utterance').innerText(),/En stor lapp håller bättre/);await closeSpeech();
   await f.evaluate(()=>UPPDRAG_CH2_PILOT.openBook());assert.match(await f.locator('#ch1Modal').innerText(),/Täcket är lagat/);await f.locator('#ch1Modal').press('Escape');
   // Export includes the independent story save, including pattern and layout.
   await p.locator('#menuButton').click();await p.locator('summary').filter({hasText:'Sparning och version'}).click();const download=await Promise.all([p.waitForEvent('download'),p.locator('#exportSave').click()]);const exported=JSON.parse(fs.readFileSync(await download[0].path()));assert.equal(JSON.parse(exported.entries[bedKey]).pattern,pattern);assert.deepEqual(JSON.parse(exported.entries[bedKey]).layout,layout);await p.locator('#closeMenu').click();
   if(iteration===0){
    const importFile=await download[0].path();await f.evaluate(key=>localStorage.setItem(key,JSON.stringify({v:1,phase:'available',layout:{}})),bedKey);await boot();assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.phase),'available');
    const serial=await f.evaluate(()=>__INTEGRATED_SERIAL);await p.locator('#menuButton').click();
    p.once('dialog',dialog=>dialog.accept());await p.locator('#saveFile').setInputFiles(importFile);
    await p.waitForFunction(serial=>document.querySelector('#game')?.contentWindow?.__INTEGRATED_SERIAL>serial&&document.querySelector('#game')?.contentWindow?.UPPDRAG_CH2_BED?.state.phase==='delivered',serial);
    f=await(await p.locator('#game').elementHandle()).contentFrame();assert.equal(await f.evaluate(()=>UPPDRAG_CH2_BED.state.pattern),pattern);assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH2_BED.state.layout),layout);
   }
   if(iteration===0){await p.locator('#menuButton').click();const replay=new URL(p.url()).searchParams.get('replay');await Promise.all([p.waitForURL(u=>u.searchParams.get('replay')!==replay),p.locator('#replayChapter').click()]);const url=p.url();await boot(url);}
  }
  assert.equal(await p.locator('#error').innerText(),'');assert.deepEqual(errors,[]);console.log('PASS window-bed story: decline/return, Karin before/after, free insufficient attempts, broad and two-piece solutions, saved puzzle, keyboard/Escape, both child choices, persistent visible repair, short revisits, export/import, untouched progress and reduced motion/mobile');
 }catch(e){console.error('Parent',await p.locator('#error').textContent().catch(()=>''));console.error(await f?.evaluate(()=>({bed:UPPDRAG_CH2_BED?.state,room:interior?.kind,event:UPPDRAG_EVENT_ENGINE?.state,scene:document.querySelector('#adventureDialog')?.outerHTML})));throw e;}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
