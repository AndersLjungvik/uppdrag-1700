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
 const pilotKey='uppdrag1700.ch2-real-world.20261019.v1',previousKey='uppdrag1700.ch1-real-world.20261019.v11',masteryKey='uppdrag1700.mastery.v1.ch2';
 async function boot(url=gameURL){await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});f=await(await p.waitForSelector('#game',{timeout:45000})).contentFrame();await f.waitForSelector('#ch1Hud');assert.equal(await p.locator('#error').innerText(),'');}
 async function seed(record){await p.evaluate(({key,pilotKey,previousKey,masteryKey,record})=>{
  for(const k of Object.keys(localStorage))if(k.startsWith(key))localStorage.removeItem(k);
  localStorage.setItem(key+previousKey,JSON.stringify({v:2,complete:false,daler:2,apples:0,record:[],earned:{}}));
  localStorage.setItem(key+pilotKey,JSON.stringify({v:2,complete:true,step:6,index:0,mode:'end',daler:9,apples:2,record,earned:{},draft:'Mitt tidigare svar'}));
  localStorage.setItem(key+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{2:{wagon:'cleared',thief:'won',witness:'heard',distance:1400,thiefDistance:900,history:[]}}}));
 },{key,pilotKey,previousKey,masteryKey,record});await boot();}
 try{
  await boot();const bank=await f.evaluate(()=>UPPDRAG_RECALL_BANK.filter(t=>t.chapter===2));
  // A legacy complete flag proves no knowledge by itself.
  await seed([]);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.complete),false);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.daler),9);assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.apples),2);
  const backup=await f.evaluate(pilotKey=>JSON.parse(localStorage.getItem(pilotKey+'.before-mastery-2')),pilotKey);assert.equal(backup.draft,'Mitt tidigare svar');assert.equal(backup.complete,true);
  await p.locator('#menuButton').click();assert.equal(await p.locator('#chapterList button').filter({hasText:'3. Krig eller fred?'}).isDisabled(),true);await p.locator('#closeMenu').click();
  // Full original attempts prove the new areas, grouped by the old visit/trial.
  const proof=bank.map(t=>({version:'recall-2-rubric',chapter:2,id:t.id,step:(t.place==='church'?1:2)+t.rank*2,trial:7,ok:true,independent:true,assessment:'local',answer:t.fields.map(f=>f.sample)}));
  await seed(proof);
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().chapterComplete),true);assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.complete),true);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.daler),9,'migration does not mint rewards');assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'cleared');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.record.length),15);
  await boot();assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.daler),9);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().chapterComplete),true);
  // Correct answers scattered across failed trials cannot be combined into a stamp.
  const partial=proof.filter(t=>t.step<=2).map(t=>({...t,trial:t.id==='rc2-power-0'?8:7}));await seed(partial);
  const cells=await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas);
  assert.equal(cells.women.learner.status,'clear');assert.equal(cells.children.learner.status,'clear');assert.equal(cells.power.learner.status,'available');assert.equal(cells.power.journeyman.status,'locked');
  await f.evaluate(()=>UPPDRAG_CH2_PILOT.selectArea('power','learner'));assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.recall.stageSolved()),false);
  // A new isolated round starts chapter 2, keeps the old round and uses pupil rules.
  await p.locator('#menuButton').click();assert.equal(await p.locator('#replayChapter').innerText(),'Spela om kapitel 2');const oldReplay=new URL(p.url()).searchParams.get('replay');
  await Promise.all([p.waitForURL(u=>u.searchParams.get('replay')!==oldReplay),p.locator('#replayChapter').click()]);
  f=await(await p.waitForSelector('#game',{timeout:45000})).contentFrame();await f.waitForSelector('#ch1Hud');
  assert.equal(await f.evaluate(()=>__INTEGRATED_CHAPTER),2);assert.equal(new URL(p.url()).searchParams.get('testChapter'),'2');assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.record.length),0);assert.equal(await f.evaluate(()=>UPPDRAG_CH2_PILOT.state.daler),3);
  const oldStill=await p.evaluate(({key,pilotKey})=>JSON.parse(localStorage.getItem(key+pilotKey)),{key,pilotKey});assert.equal(oldStill.daler,9);assert.equal(oldStill.record.length,partial.length);
  // The normal gate still requires chapter 1; adding testChapter without a replay does not unlock it.
  const normal=new URL(gameURL);normal.searchParams.delete('replay');normal.searchParams.delete('testChapter');normal.searchParams.set('chapter','2');await boot(normal.href);assert.equal(await f.evaluate(()=>__INTEGRATED_CHAPTER),1);
  normal.searchParams.set('testChapter','2');await boot(normal.href);assert.equal(await f.evaluate(()=>__INTEGRATED_CHAPTER),1);
  assert.deepEqual(errors,[]);console.log('PASS chapter 2 migration and isolation: no stamps from complete flag, preserved resources/answers, evidenced original trials, no mixed-trial stamp, fresh pupil test, previous replay intact and normal gates');
 }catch(e){console.error('Parent',await p.locator('#error').textContent().catch(()=>''));throw e;}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
