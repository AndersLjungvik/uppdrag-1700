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
 async function room(kind){return f.evaluate(kind=>{
  UPPDRAG_CH2_PILOT.close();UPPDRAG_MEETINGS.close(false);if(interior)leaveInterior();path=[];
  const b=region.buildings.find(b=>ROOM_BY_REGION[region.id]?.[b.name]===kind),entry=UPPDRAG_STORY_WORLD.entryFor(region,b)||b.entry;
  player={...navigationPoint(region,entry)};camera={...player};const ok=requestInterior(b);draw();return ok&&interior?.kind===kind;
 },kind);}
 try{
  await p.goto(gameURL,{waitUntil:'domcontentloaded',timeout:60000});
  await p.evaluate(key=>localStorage.setItem(key+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{2:{wagon:'unseen',thief:'unseen',witness:'unseen',distance:1600,thiefDistance:620,history:[]}}})),key);
  await p.reload();f=await(await p.waitForSelector('#game',{timeout:45000})).contentFrame();await f.waitForSelector('#ch1Hud');
  await f.evaluate(()=>{UPPDRAG_CH2_PILOT.close();UPPDRAG_MEETINGS.close(false);});
  const initial=await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.daler);
  assert.equal(await f.evaluate(()=>{const c=document.createElement('canvas');c.width=400;c.height=200;return UPPDRAG_CH2_SUPPLIES.draw(c.getContext('2d'),200,110,1);}),false);
  await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openWagon());assert.equal(await f.locator('#adventureDialog').isVisible(),false);
  await f.evaluate(()=>{player={x:2950,y:367};camera={x:3040,y:367};path=[];UPPDRAG_WORLD_LIFE.tick(performance.now(),{region,player,activeRoom:null});draw();UPPDRAG_EVENT_ENGINE.openWagon();});
  assert.match(await f.locator('.ad-utterance').innerText(),/Brödet och veden/);assert.equal(await f.locator('#adventureDialog [data-adventure]').count(),0);
  await f.locator('[data-adventure="smith"]').click();
  await f.evaluate(()=>{player={x:2680,y:705};camera={x:2710,y:705};path=[];UPPDRAG_WORLD_LIFE.tick(performance.now(),{region,player,activeRoom:null});draw();UPPDRAG_EVENT_ENGINE.openSmith();});
  await f.locator('.ad-utterance').click();assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'advice');
  await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openWagon());assert.equal(await f.locator('#adventureDialog').isVisible(),false);
  await f.evaluate(()=>{player={x:2950,y:367};camera={x:3040,y:367};path=[];UPPDRAG_WORLD_LIFE.tick(performance.now(),{region,player,activeRoom:null});draw();UPPDRAG_EVENT_ENGINE.openWagon();});
  await f.locator('.ad-utterance').click();await f.locator('[data-adventure="fix"]').click();await f.locator('#adventureDialog').press('Enter');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'cleared');
  const supplies=await f.evaluate(()=>{const c=document.createElement('canvas');c.width=400;c.height=200;const g=c.getContext('2d'),shown=UPPDRAG_CH2_SUPPLIES.draw(g,200,110,1),d=g.getImageData(0,0,400,200).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i])n++;return {shown,pixels:n};});assert.equal(supplies.shown,true);assert(supplies.pixels>1000);
  assert.equal(await room('barnhus'),true);await f.evaluate(()=>{UPPDRAG_MEETINGS.close(false);UPPDRAG_MEETINGS.start();});
  await f.waitForSelector('#meetingDialogue:not([hidden])');
  for(let i=0;i<8&&await f.locator('#chapter2Replies').isHidden();i++)await f.locator('#meetingDialogue').click();
  assert.match(await f.locator('#meetingLine').innerText(),/Brödet och veden kom fram/);
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});await p.screenshot({path:path.join(root,'qa/chapter2-supplies.png')});
  await f.locator('[data-ch1-choice="area:children"]').click();assert.equal(await f.locator('#ch1CutPaperScene').getAttribute('data-place'),'barnhus');
  await p.screenshot({path:path.join(root,'qa/chapter2-barnhus-workspace.png')});
  assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH2_PILOT.repetitionTaskIds),['rc2-barnhus-0'],'thief gets only a chapter-2 topic actually encountered');
  await f.evaluate(()=>{UPPDRAG_CH2_PILOT.close();UPPDRAG_MEETINGS.close(false);leaveInterior();path=[];window.requestAnimationFrame=()=>0;});await p.waitForTimeout(60);
  await f.evaluate(()=>{
   window.qaTime=performance.now()+10000;window.qaTick=()=>{qaTime+=40;UPPDRAG_WORLD_LIFE.tick(qaTime,{region,player,activeRoom:interior?.kind||null});};
   for(let x=700;x<=1100;x+=5){player={x,y:705};qaTick();}
   for(let i=0;i<180&&UPPDRAG_EVENT_ENGINE.state.thief!=='chasing';i++)qaTick();draw();
  });
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'chasing');assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.daler),initial-1);
  await f.locator('#adventureChase').click();await f.evaluate(()=>{
   for(let i=0;i<1000&&UPPDRAG_EVENT_ENGINE.approach.phase!=='caught';i++){
    const target=path[0];if(target){const d=Math.hypot(target.x-player.x,target.y-player.y),step=Math.min(d,7.2);if(d<.01)path.shift();else{player={x:player.x+(target.x-player.x)/d*step,y:player.y+(target.y-player.y)/d*step};if(step>=d)path.shift();}}qaTick();
   }draw();
  });
  assert.match(await f.locator('.ad-event-question p').first().innerText(),/barn behövde barnhus/);
  await f.getByRole('button',{name:'Ingen ville eller kunde ta hand om dem.',exact:true}).click();await f.locator('[data-adventure="close"]').click();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.daler),initial);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0,'the chase and wagon do not award knowledge stamps');
  // Earn a real new chapter-2 reward; the same thief can return in this chapter.
  await room('barnhus');await f.evaluate(()=>{UPPDRAG_MEETINGS.close(false);UPPDRAG_CH2_PILOT.enterMemory();});
  await f.locator('[data-field-index="0"]').filter({hasText:'Ingen ville eller kunde ta hand om dem.'}).click();await f.locator('[data-action="rc-submit"]').click();await f.locator('[data-action="rc-next"]').click();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.daler),initial+1);
  await f.evaluate(()=>{qaTick();for(let i=0;i<1400;i++)qaTick();UPPDRAG_CH2_PILOT.close();leaveInterior();path=[];for(let x=100;x<=1100;x+=5){player={x,y:705};qaTick();}for(let i=0;i<180&&UPPDRAG_EVENT_ENGINE.state.thief!=='chasing';i++)qaTick();draw();});
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.encounters),2);assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.daler),initial);
  await p.screenshot({path:path.join(root,'qa/chapter2-thief-returns.png')});
  await p.reload();f=await(await p.waitForSelector('#game',{timeout:45000})).contentFrame();await f.waitForSelector('#ch1Hud');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'cleared');assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.unclaimed),1);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas.children.learner.status),'clear');
  assert.equal(await p.locator('#error').innerText(),'');assert.deepEqual(errors,[]);
  console.log('PASS chapter 2 world: actual wagon/smith steps, bread and wood drawn and acknowledged by Siri, existing barnhus close-up, known-topic pursuit, no sidequest stamps, new reward and recurring thief, persisted supplies and progress');
 }catch(e){console.error('Parent',await p.locator('#error').textContent().catch(()=>''));console.error(await f?.evaluate(()=>({events:UPPDRAG_EVENT_ENGINE?.state,approach:UPPDRAG_EVENT_ENGINE?.approach,pilot:UPPDRAG_CH2_PILOT?.state.daler,room:interior?.kind,path})));throw e;}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
