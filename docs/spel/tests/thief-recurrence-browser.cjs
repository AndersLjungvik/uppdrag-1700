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
  async function freeze(){
   f=await(await p.waitForSelector('#game',{timeout:30000})).contentFrame();await f.waitForSelector('#ch1Hud');
   await f.evaluate(()=>{UPPDRAG_CH1_PILOT.close();UPPDRAG_MEETINGS.close(false);window.requestAnimationFrame=()=>0;});await p.waitForTimeout(60);
   await f.evaluate(()=>{
    path=[];window.qaTime=10000;
    window.qaTick=()=>{qaTime+=40;UPPDRAG_WORLD_LIFE.tick(qaTime,{region,player,activeRoom:interior?.kind||null});};
    window.qaWalk=target=>{let n=0;while(Math.hypot(target.x-player.x,target.y-player.y)>.01&&n++<1000){const d=Math.hypot(target.x-player.x,target.y-player.y),step=Math.min(d,7.2),next={x:player.x+(target.x-player.x)/d*step,y:player.y+(target.y-player.y)/d*step};if(!UPPDRAG_WORLD_KEYBOARD.clearSegment(region,player,next,12))throw Error('blocked fixture walk');player=next;qaTick();}};
    UPPDRAG_CH1_PILOT.state.encountered=['rc1-queen-0'];UPPDRAG_CH1_PILOT.persist();
   });
  }
  async function earn(area){
   await f.evaluate(()=>UPPDRAG_CH1_PILOT.openBook());
   await f.locator('[data-area="'+area+'"][data-level="learner"]').click();
   await f.evaluate(room=>{
    const building=room==='waterfront'?null:region.buildings.find(b=>ROOM_BY_REGION[region.id]?.[b.name]===room);
    const entry=room==='waterfront'?region.harbor:(UPPDRAG_STORY_WORLD.entryFor(region,building)||building.entry);
    player={...navigationPoint(region,entry)};camera={...player};path=[];
    const opened=room==='waterfront'?requestHarbour():requestInterior(building);if(!opened||interior?.kind!==room)throw Error('could not enter reward workspace');
    UPPDRAG_MEETINGS.close(false);UPPDRAG_CH1_PILOT.enterMemory();
   },{trade:'waterfront',law:'riksdag'}[area]);
   let guard=0;
   while(await f.evaluate(area=>UPPDRAG_MASTERY.snapshot().state.areas[area].learner.status!=='clear',area)){
    assert(++guard<5);
    const task=await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.current);
    for(let i=0;i<task.fields.length;i++)await f.locator('[data-field-index="'+i+'"]').filter({hasText:task.fields[i].answers[0]}).click();
    await f.locator('[data-action="rc-submit"]').click();await f.locator('[data-action="rc-next"]').click();
   }
   await f.evaluate(()=>qaTick());
  }
  async function outside(){await f.evaluate(()=>{UPPDRAG_CH1_PILOT.close();UPPDRAG_MEETINGS.close(false);leaveInterior();path=[];});}
  async function waitAndWalk(){await f.evaluate(()=>{
   // Time alone and travel alone are both insufficient without new earnings.
   for(let i=0;i<1400;i++)qaTick();
   for(let pass=0;pass<2;pass++)for(let x=700;x<=1400;x+=5){player={x,y:705};qaTick();if(UPPDRAG_EVENT_ENGINE.busy)break;}
  });}
  async function ambush(){return f.evaluate(()=>{
   for(let x=100;x<=1100;x+=5){player={x,y:705};qaTick();}
   camera={x:1030,y:760};draw();return UPPDRAG_EVENT_ENGINE.approach;
  });}
  const sideKey='uppdrag1700.side-adventures.v1';
  await p.goto(gameURL,{waitUntil:'domcontentloaded',timeout:60000});
  await p.evaluate(({key,sideKey})=>localStorage.setItem(key+sideKey,JSON.stringify({v:1,chapters:{1:{wagon:'cleared',thief:'won',thiefSeen:true,stolenDaler:false,witness:'heard',distance:2000,thiefDistance:620,history:[{kind:'thief',value:'won'}]}}})),{key,sideKey});
  await p.reload();await freeze();
  const initial=await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler);
  const firstLoss=Math.ceil((initial+1)/2),secondLoss=Math.ceil((initial+2)/2);
  await waitAndWalk();
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'won');assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.point),null);
  // A real new reward in the existing quay workspace unlocks another encounter.
  await earn('trade');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),initial+1);
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.earned),true);
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.point),null,'no thief can appear while the learner is working in a room');
  await outside();assert.equal((await ambush()).phase,'approaching');
  await f.evaluate(()=>{for(let i=0;i<180&&UPPDRAG_EVENT_ENGINE.state.thief!=='chasing';i++)qaTick();draw();});
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'chasing');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),initial+1-firstLoss);
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.encounters),2);
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});await p.screenshot({path:path.join(root,'qa/thief-returns-after-reward.png')});
  // Reload closes the live chase, preserving the exact lost purse and the new rest.
  await p.reload();await freeze();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),initial+1-firstLoss);
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'lost');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.unclaimed),firstLoss);
  assert(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.rest>=29000));
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.earned),false);
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.snapshot().state.areas.trade.learner.status),'clear');
  await f.evaluate(()=>{player={x:1005,y:713};qaTick();UPPDRAG_EVENT_ENGINE.openWitness();draw();});
  await f.locator('[data-adventure="kind"]').click();await f.locator('.ad-utterance').click();await f.locator('#adventureDialog').press('Enter');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),initial+1);
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.unclaimed),0);
  await waitAndWalk();
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'lost','the purse refund does not invite another theft');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.approach.point),null);
  // A second actual reward permits a third encounter in the same chapter.
  await earn('law');await outside();assert.equal((await ambush()).phase,'approaching');
  await f.evaluate(()=>{for(let i=0;i<180&&UPPDRAG_EVENT_ENGINE.state.thief!=='chasing';i++)qaTick();});
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.encounters),3);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),initial+2-secondLoss);
  await f.locator('#adventureChase').click();
  await f.evaluate(()=>{
   for(let i=0;i<1000&&UPPDRAG_EVENT_ENGINE.approach.phase!=='caught';i++){
    const target=path[0];if(target){const d=Math.hypot(target.x-player.x,target.y-player.y),step=Math.min(d,7.2);if(d<.01)path.shift();else{player={x:player.x+(target.x-player.x)/d*step,y:player.y+(target.y-player.y)/d*step};if(step>=d)path.shift();}}
    qaTick();
   }draw();
  });
  const prompt=await f.locator('.ad-event-question p').first().innerText();
  const answer=await f.evaluate(prompt=>{const task=UPPDRAG_RECALL_BANK.find(t=>t.prompt===prompt);return task.fields[0].options.find(o=>task.fields[0].answers.some(a=>a.toLocaleLowerCase('sv')===o.toLocaleLowerCase('sv')));},prompt);
  await f.getByRole('button',{name:answer,exact:true}).click();await f.locator('[data-adventure="close"]').click();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),initial+2);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'won');
  await waitAndWalk();assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'won','a successful chase refund also cannot invite another theft');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'cleared','repeat visits do not reset the wagon or chapter progress');
  await p.reload();await freeze();assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.recurrence.encounters),3);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH1_PILOT.state.daler),initial+2);
  assert.equal(await p.locator('#error').innerText(),'');assert.deepEqual(errors,[]);
  console.log('PASS recurring thief browser: legacy completed save, two real task rewards, second and third encounters, active-chase reload, child and chase refunds excluded, persistence and intact progress');
 }catch(e){console.error('parent',await p.locator('#error').textContent().catch(()=>''));console.error(await f?.evaluate(()=>({motion:UPPDRAG_EVENT_ENGINE.approach,state:UPPDRAG_EVENT_ENGINE.state,player,path,interior,pilot:UPPDRAG_CH1_PILOT.state.daler})));throw e;}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
