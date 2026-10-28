const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
(async()=>{
 const root=path.resolve(__dirname,'../../..'),server=http.createServer((req,res)=>{const p=path.join(root,decodeURIComponent(req.url.split('?')[0]));let file=p;if(fs.existsSync(p)&&fs.statSync(p).isDirectory())file=path.join(p,'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}const type={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.json':'application/json'}[path.extname(file)]||'application/octet-stream';res.setHeader('Content-Type',type);res.end(fs.readFileSync(file));});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,proxy:process.env.GAME_URL&&process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const p=await b.newPage({ignoreHTTPSErrors:!!process.env.GAME_URL,viewport:{width:1200,height:850},reducedMotion:process.env.REDUCED_MOTION==='1'?'reduce':'no-preference'});p.setDefaultTimeout(process.env.GAME_URL?45000:12000);p.on('pageerror',e=>console.log('ERROR',e.message));
 const errors=[];p.on('pageerror',e=>errors.push(e.message));

 const origin='http://127.0.0.1:'+server.address().port;
 const key=process.env.GAME_SAVE_ROOT||'uppdrag1700.integrated.20261023.v1.play.';
 const gameURL=process.env.GAME_URL||origin+'/docs/spel/?chapter=1';
 let f;
 try{
  async function setup(){
   await p.goto(gameURL,{waitUntil:'domcontentloaded',timeout:60000});
   await p.evaluate(key=>localStorage.setItem(key+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{1:{wagon:'unseen',thief:'unseen',witness:'unseen',distance:1600,thiefDistance:620,history:[]}}})),key);
   await p.reload();f=await(await p.waitForSelector('#game',{timeout:30000})).contentFrame();await f.waitForSelector('#ch1Hud');
   await f.evaluate(()=>{UPPDRAG_CH1_PILOT.close();UPPDRAG_MEETINGS.close(false);window.requestAnimationFrame=()=>0;});await p.waitForTimeout(60);
   return f.evaluate(()=>{
    interior=null;path=[];UPPDRAG_CH1_PILOT.state.encountered=['rc1-queen-0'];UPPDRAG_CH1_PILOT.persist();
    window.qaTime=10000;
    window.qaTick=()=>{qaTime+=40;UPPDRAG_WORLD_LIFE.tick(qaTime,{region,player,activeRoom:interior?.kind||null});};
    window.qaWalk=target=>{let n=0;while(Math.hypot(target.x-player.x,target.y-player.y)>.01&&n++<1000){const d=Math.hypot(target.x-player.x,target.y-player.y),step=Math.min(d,7.2),next={x:player.x+(target.x-player.x)/d*step,y:player.y+(target.y-player.y)/d*step};if(!UPPDRAG_WORLD_KEYBOARD.clearSegment(region,player,next,12))throw Error('blocked fixture walk');player=next;qaTick();}};
    for(let x=700;x<=1100;x+=5){player={x,y:705};qaTick();}
    camera={x:1030,y:760};draw();return {motion:UPPDRAG_EVENT_ENGINE.approach,money:UPPDRAG_CH1_PILOT.state.daler};
   });
  }
  let start=await setup();assert.equal(start.motion.phase,'approaching');
  const conversation=await f.evaluate(()=>{
   const person=UPPDRAG_WORLD_LIFE.people(region).filter(p=>p.ponderings?.length&&Math.hypot(player.x-p.x,player.y-p.y)<=80).sort((a,b)=>Math.hypot(player.x-a.x,player.y-a.y)-Math.hypot(player.x-b.x,player.y-b.y))[0];
   if(!person)throw Error('no nearby conversational person');
   const opened=requestPerson(person);qaTick();draw();
   return {opened,id:person.id,gap:Math.hypot(player.x-person.x,player.y-person.y),motion:UPPDRAG_EVENT_ENGINE.approach,money:UPPDRAG_CH1_PILOT.state.daler};
  });
  assert.equal(conversation.opened,true);assert.equal(conversation.motion.phase,'retreating');assert.equal(conversation.motion.reason,'conversation');assert.equal(conversation.money,start.money);
  await p.screenshot({path:path.join(root,'qa/thief-conversation.png')});
  assert.equal(await f.evaluate(()=>{for(let i=0;i<300;i++)qaTick();return UPPDRAG_EVENT_ENGINE.approach.phase;}),'evaded');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),start.money);
  start=await setup();
  const house=await f.evaluate(()=>{
   const building=region.buildings.find(b=>b.entry==='archive');
   qaWalk({x:1240,y:705});qaWalk(region.map.get(building.entry));
   const requested=requestInterior(building);while(path.length){qaWalk(path[0]);path.shift();}finishDoorArrival();qaTick();
   return {requested,interior:interior?.kind,motion:UPPDRAG_EVENT_ENGINE.approach,money:UPPDRAG_CH1_PILOT.state.daler};
  });
  assert.equal(house.interior,'archive');assert.equal(house.motion.reason,'house');assert(['retreating','evaded'].includes(house.motion.phase));assert.equal(house.money,start.money);
  await p.screenshot({path:path.join(root,'qa/thief-house.png')});
  assert.equal(await f.evaluate(()=>{for(let i=0;i<300;i++)qaTick();leaveInterior();qaTick();return UPPDRAG_EVENT_ENGINE.approach.phase;}),'evaded');
  start=await setup();
  const hiding=await f.evaluate(()=>{
   qaWalk({x:1140,y:780});qaWalk({x:1080,y:920});qaWalk({x:935,y:920});qaWalk({x:935,y:810});
   const before=UPPDRAG_EVENT_ENGINE.approach;camera={x:1000,y:850};draw();
   return {before,motion:UPPDRAG_EVENT_ENGINE.approach,money:UPPDRAG_CH1_PILOT.state.daler,player};
  });assert.equal(hiding.before.phase,'searching');assert.equal(hiding.money,start.money);
  await p.screenshot({path:path.join(root,'qa/thief-tree.png')});
  assert.equal(await f.evaluate(()=>{for(let i=0;i<230;i++)qaTick();return UPPDRAG_EVENT_ENGINE.approach.reason;}),'lost-sight');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.phase),'evaded');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),start.money);
  start=await setup();
  const offroad=await f.evaluate(()=>{
   qaWalk({x:1140,y:805});
   const gap=Math.min(...region.edges.map(e=>{const q=roadProjection(player,e);return Math.hypot(player.x-q.x,player.y-q.y);}));
   for(let i=0;i<180&&UPPDRAG_EVENT_ENGINE.state.thief==='unseen';i++)qaTick();draw();
   return {gap,motion:UPPDRAG_EVENT_ENGINE.approach,money:UPPDRAG_CH1_PILOT.state.daler};
  });
  assert(offroad.gap>60,'reproduce the former off-road disappearance');assert.equal(offroad.motion.phase,'fleeing');assert(offroad.motion.point);assert.equal(offroad.money,start.money-1);
  await p.screenshot({path:path.join(root,'qa/thief-offroad.png')});
  await f.evaluate(()=>{for(let i=0;i<450;i++)qaTick();});
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.phase),'escaped');assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),start.money-1);
  start=await setup();
  const hit=await f.evaluate(()=>{draw();const q=UPPDRAG_EVENT_ENGINE.approach.point,m=ctx.getTransform(),r=canvas.getBoundingClientRect();return {x:(m.a*q.x+m.c*q.y+m.e)*r.width/canvas.width,y:(m.b*q.x+m.d*q.y+m.f)*r.height/canvas.height};});
  await f.locator('#world').click({position:hit});await f.evaluate(()=>qaTick());
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.reason),'noticed');assert.equal(await f.locator('#adventureCallout').innerText(),'Varför följer du efter mig?');assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),start.money);
  // Entering a house after a theft abandons pursuit; it cannot duplicate a coin or freeze the escaping actor.
  await setup();
  const lateHouse=await f.evaluate(()=>{
   UPPDRAG_EVENT_ENGINE.resetChapterEvents();path=[];const building=region.buildings.find(b=>b.entry==='archive');player={...region.map.get(building.entry)};qaTick();
   const before=UPPDRAG_CH1_PILOT.state.daler;UPPDRAG_EVENT_ENGINE.openThief();const stolen=UPPDRAG_CH1_PILOT.state.daler;
   requestInterior(building);while(path.length){qaWalk(path[0]);path.shift();}finishDoorArrival();qaTick();const retreat=UPPDRAG_EVENT_ENGINE.approach;
   for(let i=0;i<500;i++)qaTick();leaveInterior();qaTick();
   return {before,stolen,money:UPPDRAG_CH1_PILOT.state.daler,retreat,final:UPPDRAG_EVENT_ENGINE.approach,state:UPPDRAG_EVENT_ENGINE.state};
  });
  assert.equal(lateHouse.stolen,lateHouse.before-1);assert.equal(lateHouse.money,lateHouse.stolen);assert.equal(lateHouse.retreat.phase,'departing');assert(lateHouse.retreat.point);assert.equal(lateHouse.final.phase,'done');assert.equal(lateHouse.state.thief,'lost');
  assert.equal(await p.locator('#error').innerText(),'');assert.deepEqual(errors,[]);
  console.log('PASS shelter browser: real nearby conversation, doorway entry, tree line of sight/search/retreat, off-road theft and escape, noticed thief, and shelter after theft without duplicate money');
 }catch(e){console.error('parent',await p.locator('#error').textContent().catch(()=>''));console.error(await f?.evaluate(()=>({motion:UPPDRAG_EVENT_ENGINE.approach,state:UPPDRAG_EVENT_ENGINE.state,player,path})));throw e;}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
