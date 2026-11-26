const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
(async()=>{
 const root=path.resolve(__dirname,'../../..'),server=http.createServer((req,res)=>{const p=path.join(root,decodeURIComponent(req.url.split('?')[0]));let file=p;if(fs.existsSync(p)&&fs.statSync(p).isDirectory())file=path.join(p,'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}const type={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.json':'application/json'}[path.extname(file)]||'application/octet-stream';res.setHeader('Content-Type',type);res.end(fs.readFileSync(file));});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,proxy:process.env.PREVIEW_URL&&process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const p=await b.newPage({ignoreHTTPSErrors:!!process.env.PREVIEW_URL,viewport:{width:1200,height:850},reducedMotion:'reduce'});p.setDefaultTimeout(12000);p.on('pageerror',e=>console.log('ERROR',e.message));
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const base=process.env.PREVIEW_URL||'http://127.0.0.1:'+server.address().port+'/docs/spel/';
 const scope=process.env.PREVIEW_URL?'uppdrag1700.preview.mastery.20261028.v1.':'uppdrag1700.integrated.20261023.v1.';
 let f;
 async function boot(url){await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});await loaded();}
 async function loaded(){f=await(await p.waitForSelector('#game',{timeout:45000})).contentFrame();await f.waitForSelector('#ch1Hud');assert.equal(await p.locator('#error').innerText(),'');}
 async function original(){return p.evaluate(scope=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith(scope+'play.'))),scope);}
 try{
  await boot(base+'?chapter=1');
  await f.evaluate(()=>{UPPDRAG_CH1_PILOT.state.daler=7;UPPDRAG_CH1_PILOT.state.apples=2;UPPDRAG_CH1_PILOT.state.encountered=['rc1-queen-0'];UPPDRAG_CH1_PILOT.persist();UPPDRAG_MASTERY.begin('start','learner');UPPDRAG_MASTERY.pass('start','learner');window.requestAnimationFrame=()=>0;});
  await p.waitForTimeout(80);
  await f.evaluate(()=>localStorage.setItem('uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{1:{wagon:'cleared',thief:'won',witness:'heard',distance:1600,thiefDistance:620,history:[]}}})));
  const before=await original();
  await p.locator('#menuButton').click();await p.locator('#replayChapter').click();
  await p.waitForURL(url=>url.searchParams.has('replay'));await loaded();
  const replay=p.url(),id=new URL(replay).searchParams.get('replay');assert(id);assert.equal(new URL(replay).searchParams.get('chapter'),'1');
  assert.match(await p.locator('#status').innerText(),/Omspelning/);
  const fresh=await f.evaluate(()=>({pilot:UPPDRAG_CH1_PILOT.state,m:UPPDRAG_MASTERY.snapshot(),side:UPPDRAG_EVENT_ENGINE.state}));
  assert.equal(fresh.pilot.daler,3);assert.equal(fresh.pilot.apples,0);assert.deepEqual(fresh.pilot.encountered,[]);
  assert.equal(fresh.m.summary.done,0);assert.equal(fresh.m.state.areas.start.learner.status,'available');
  assert.equal(fresh.side.wagon,'unseen');assert.equal(fresh.side.thief,'unseen');assert.equal(fresh.side.witness,'unseen');
  assert.deepEqual(await original(),before,'replaying preserves the original progress');
  await f.evaluate(()=>{UPPDRAG_CH1_PILOT.state.daler=1;UPPDRAG_CH1_PILOT.persist();});
  await boot(replay);assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),1,'replay resumes after refresh');
  await p.setViewportSize({width:390,height:844});await p.locator('#menuButton').click();
  assert.equal(await p.locator('#returnOriginal').isVisible(),true);
  assert.equal(await p.locator('#menu').evaluate(el=>el.scrollWidth<=el.clientWidth),true);
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});await p.screenshot({path:path.join(root,'qa/replay-menu-mobile.png'),timeout:12000});
  await p.locator('#returnOriginal').click();await p.waitForURL(url=>!url.searchParams.has('replay'));await loaded();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),7);assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.apples),2);
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas.start.learner.status),'clear');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'won');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'cleared');
  await p.locator('#menuButton').click();await p.locator('#replayChapter').click();await p.waitForURL(url=>url.searchParams.has('replay'));await loaded();
  assert.notEqual(new URL(p.url()).searchParams.get('replay'),id,'another replay starts a fresh save');assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),3);
  assert.deepEqual(errors,[]);console.log('PASS replay: new chapter, fresh mastery and encounters, preserved original, reload, return, another replay and mobile menu');
 }finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
