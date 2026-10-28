const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
(async()=>{
 const root=path.resolve(__dirname,'../../..'),server=http.createServer((req,res)=>{const p=path.join(root,decodeURIComponent(req.url.split('?')[0]));let file=p;if(fs.existsSync(p)&&fs.statSync(p).isDirectory())file=path.join(p,'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}const type={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.json':'application/json'}[path.extname(file)]||'application/octet-stream';res.setHeader('Content-Type',type);res.end(fs.readFileSync(file));});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const p=await b.newPage({viewport:{width:1200,height:850},reducedMotion:process.env.REDUCED_MOTION==='1'?'reduce':'no-preference'});p.setDefaultTimeout(12000);p.on('pageerror',e=>console.log('ERROR',e.message));
 const errors=[];p.on('pageerror',e=>errors.push(e.message));

 const origin='http://127.0.0.1:'+server.address().port;
 const key='uppdrag1700.integrated.20261023.v1.play.';
 let f;
 try{
  await p.goto(origin+'/docs/spel/?chapter=1');
  await p.evaluate(key=>localStorage.setItem(key+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{1:{wagon:'unseen',thief:'unseen',witness:'unseen',distance:1600,thiefDistance:620,history:[]}}})),key);
  await p.reload();f=await(await p.waitForSelector('#game',{timeout:30000})).contentFrame();await f.waitForSelector('#ch1Hud');
  await f.evaluate(()=>{UPPDRAG_CH1_PILOT.close();UPPDRAG_MEETINGS.close(false);window.requestAnimationFrame=()=>0;});
  await p.waitForTimeout(60);
  const start=await f.evaluate(()=>{
   interior=null;path=[];
   const edge=region.edges.map(e=>({a:navigationPoint(region,e.a),b:navigationPoint(region,e.b)})).find(e=>e.a&&e.b&&Math.hypot(e.a.x-e.b.x,e.a.y-e.b.y)>400&&e.a.x<2500&&e.b.x<2500&&UPPDRAG_WORLD_KEYBOARD.clearSegment(region,e.a,e.b,0));
   if(!edge)throw Error('No safe test road');
   const len=Math.hypot(edge.a.x-edge.b.x,edge.a.y-edge.b.y);
   const origin={x:edge.a.x+(edge.b.x-edge.a.x)*.1,y:edge.a.y+(edge.b.y-edge.a.y)*.1};
   const direction={x:(edge.b.x-edge.a.x)/len,y:(edge.b.y-edge.a.y)/len};
   for(let d=0;d<=280;d+=5){player={x:origin.x+d*direction.x,y:origin.y+d*direction.y};UPPDRAG_WORLD_LIFE.tick(10000+d*4,{region,player,activeRoom:null});}
   camera={x:player.x-70*direction.x,y:player.y-70*direction.y};draw();
   return {approach:UPPDRAG_EVENT_ENGINE.approach,busy:UPPDRAG_EVENT_ENGINE.busy,player};
  });
  assert.equal(start.approach.phase,'approaching');assert.equal(start.busy,false);assert(Math.hypot(start.player.x-start.approach.point.x,start.player.y-start.approach.point.y)>120);
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});await p.screenshot({path:path.join(root,'qa/events-sneak.png'),timeout:12000});
  // A dialogue elsewhere pauses the thief at precisely the same position.
  const paused=await f.evaluate(()=>{
   UPPDRAG_EVENT_ENGINE.openJournal();const before=UPPDRAG_EVENT_ENGINE.approach.point;
   UPPDRAG_WORLD_LIFE.tick(12000,{region,player,activeRoom:null});
   const after=UPPDRAG_EVENT_ENGINE.approach.point;
   document.querySelector('[data-adventure="close"]').click();return {before,after};
  });
  assert.equal(paused.before.x,paused.after.x);assert.equal(paused.before.y,paused.after.y);
  await f.evaluate(()=>{for(let i=0;i<150&&!UPPDRAG_EVENT_ENGINE.busy;i++)UPPDRAG_WORLD_LIFE.tick(12050+i*50,{region,player,activeRoom:null});draw();});
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.phase),'contact');
  assert.match(await f.locator('.ad-speaker').innerText(),/Berättaren/);
  while(await f.locator('[data-adventure="next"]').count())await f.locator('[data-adventure="next"]').click();
  const money=await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler);
  await f.locator('[data-adventure="ignore"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),money-1);
  await f.evaluate(()=>{for(let i=0;i<140;i++)UPPDRAG_WORLD_LIFE.tick(20000+i*50,{region,player,activeRoom:null});draw();});
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.phase),'done');
  await f.locator('[data-adventure="close"]').click();
  // Shared paper actors and actual driver speech anchor, including mobile.
  await f.evaluate(()=>{player={x:2950,y:367};camera={x:3040,y:367};UPPDRAG_WORLD_LIFE.tick(30000,{region,player,activeRoom:null});draw();UPPDRAG_EVENT_ENGINE.openWagon();});
  assert.equal(await f.locator('#adventureTail .worldSpeechPaper').count(),1);
  assert.match(await f.locator('#adventureDialog button').first().evaluate(el=>getComputedStyle(el).fontFamily),/Georgia/);
  await p.screenshot({path:path.join(root,'qa/events-wagon.png'),timeout:12000});
  while(await f.locator('[data-adventure="next"]').count())await f.locator('[data-adventure="next"]').click();
  await f.locator('[data-adventure="inspect"]').click();
  while(await f.locator('[data-adventure="next"]').count())await f.locator('[data-adventure="next"]').click();
  await f.locator('[data-adventure="smith"]').click();await f.locator('#adventureDialog').press('Escape');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'need-smith');
  await f.evaluate(()=>{player={x:2680,y:705};camera={x:2710,y:705};UPPDRAG_WORLD_LIFE.tick(31000,{region,player,activeRoom:null});draw();UPPDRAG_EVENT_ENGINE.openSmith();});
  await p.screenshot({path:path.join(root,'qa/events-smith.png'),timeout:12000});await f.locator('#adventureDialog').press('Escape');
  await f.evaluate(()=>{player={x:1005,y:713};camera={x:1075,y:713};UPPDRAG_WORLD_LIFE.tick(32000,{region,player,activeRoom:null});draw();UPPDRAG_EVENT_ENGINE.openWitness();});
  await p.setViewportSize({width:390,height:844});await f.evaluate(()=>draw());
  await p.screenshot({path:path.join(root,'qa/events-witness-mobile.png'),timeout:12000});
  assert.equal(await f.locator('#adventureDialog').evaluate(el=>el.scrollWidth<=el.clientWidth),true);
  const bounds=await f.locator('#adventureDialog').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=391);
  await f.locator('[data-adventure="kind"]').click();
  while(await f.locator('[data-adventure="next"]').count())await f.locator('[data-adventure="next"]').click();
  await f.locator('[data-adventure="close"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),money);
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.witness),'recovered');
  await p.reload();f=await(await p.waitForSelector('#game',{timeout:30000})).contentFrame();await f.waitForSelector('#ch1Hud');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.witness),'recovered');
  assert.equal(await p.locator('#error').innerText(),'');assert.deepEqual(errors,[]);
  console.log('PASS browser: natural thief approach, pause, contact, one-daler loss, departure, wagon, smith, witness recovery, shared speech style, mobile and reload');
 }catch(e){console.error('parent',await p.locator('#error').textContent().catch(()=>''));throw e;}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
