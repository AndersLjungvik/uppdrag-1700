const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('social-presence');let f;
 async function boot(){await h.boot();f=h.frame;await f.evaluate(()=>{if(interior)leaveInterior();UPPDRAG_CH4_PILOT.state.daler=0;UPPDRAG_CH4_PILOT.persist();path=[];UPPDRAG_CH4_CITY_LIFE.suspend();});}
 async function placeAtBook(side,distance){return f.evaluate(({side,distance})=>{
  UPPDRAG_CH4_CITY_LIFE.suspend();path=[];pendingStreetChat=null;
  const a=UPPDRAG_CH4_CITY_LIFE.find(region,'book');UPPDRAG_CH4_CITY_LIFE.hold(a);
  player={x:a.x+side[0]*distance,y:a.y+side[1]*distance};camera={...player};follow=true;draw();return a;
 },{side,distance});}
 async function clickBook(){
  const point=await f.evaluate(()=>{const a=UPPDRAG_CH4_CITY_LIFE.find(region,'book');return {x:layout.w/2+(a.x-camera.x)*layout.scale,y:layout.h/2+(a.y-camera.y)*layout.scale};});
  await f.locator('#world').click({position:point});
 }
 async function facing(){return f.evaluate(()=>{
  const city=UPPDRAG_CH4_CITY_LIFE,a=city.find(region,city.actor||city.teaser||'book'),view=UPPDRAG_SCENE_PRESENCE.playerView;
  const angle=Math.atan2(a.y-player.y,a.x-player.x);
  return {npc:Math.cos(a.heading-angle-Math.PI),player:Math.cos(view.heading-angle),distance:Math.hypot(a.x-player.x,a.y-player.y),moving:a.moving,playerMoving:view.moving,x:a.x,y:a.y};
 });}
 async function waitFacing(){await f.waitForFunction(()=>{
  const city=UPPDRAG_CH4_CITY_LIFE,a=city.find(region,city.actor||city.teaser||'book'),view=UPPDRAG_SCENE_PRESENCE.playerView,angle=Math.atan2(a.y-player.y,a.x-player.x);
  return Math.cos(a.heading-angle-Math.PI)>.985&&Math.cos(view.heading-angle)>.985;
 },undefined,{timeout:5000});}
 async function alley(reduced){
  await f.evaluate(()=>{
   UPPDRAG_CH4_CITY_LIFE.suspend();path=[];pendingStreetChat=null;
   const a=UPPDRAG_CH4_CITY_LIFE.find(region,'celsius');player={x:a.x-68,y:333};camera={...player};follow=true;draw();
   const old=UPPDRAG_WORLD_LIFE.tick;window.__socialTrace={min:Infinity,maxStep:0,sidestep:false,wait:false,maxSide:0,maxRetreat:0,firstYieldX:null,previous:{...player}};
   UPPDRAG_WORLD_LIFE.tick=function(...args){const result=old.apply(this,args);if(window.__socialTrace){const t=__socialTrace,a=UPPDRAG_CH4_CITY_LIFE.find(region,'celsius');t.min=Math.min(t.min,Math.hypot(a.x-player.x,a.y-player.y));t.maxStep=Math.max(t.maxStep,Math.hypot(player.x-t.previous.x,player.y-t.previous.y));t.previous={...player};if(a.yielding){if(t.firstYieldX===null)t.firstYieldX=a.x;t.maxRetreat=Math.max(t.maxRetreat,a.x-t.firstYieldX);t.maxSide=Math.max(t.maxSide,Math.abs(a.y-333));if(Math.abs(a.y-333)>1)t.sidestep=true;if(!a.moving&&Math.abs(a.y-333)>1&&player.x<a.x+20)t.wait=true;}}return result;};
  });
  await f.locator('#world').focus();await h.page.keyboard.down('ArrowRight');
  try{await f.waitForFunction(()=>player.x>1285,undefined,{timeout:16000});}finally{await h.page.keyboard.up('ArrowRight');}
  const result=await f.evaluate(()=>{const result=__socialTrace;window.__socialTrace=null;return {...result,teaser:UPPDRAG_CH4_CITY_LIFE.teaser,active:UPPDRAG_CH4_CITY_LIFE.active};});
  assert(result.min>=8.7,'feet stay separate in the real alley: '+JSON.stringify(result));assert(result.maxStep<=10,'no jumping through a resident');assert(result.sidestep,'Celsius takes a small sidestep');assert(result.maxRetreat<3,'Celsius stays at the meeting place');assert(result.maxSide<=14.2,'the sidestep is bounded');assert(result.min<28,'paper frames may overlap during the pass');assert(result.wait,'Celsius stops beside the lane while the player passes');assert.equal(result.active,false);assert.equal(result.teaser,null,'a greeting cannot freeze someone across the walking route');
  console.log('PASS real alley between Vetenskapens hus and Kyrkan; small sidestep, waiting, overlapping frames and separate feet without retreat'+(reduced?' with reduced motion':''));
 }
 try{
  await boot();const progress=await f.evaluate(()=>localStorage.getItem('uppdrag1700.mastery.v1.ch4'));
  for(const [index,side] of [[-1,0],[1,0],[0,-1],[0,1]].entries()){
   await placeAtBook(side,index?70:145);
   const viewBefore=await f.evaluate(index=>{if(index===0){camera.x+=100;camera.y+=30;follow=false;}clamp();draw();return {x:camera.x,y:camera.y,follow};},index);
   await clickBook();
   if(index===0){const waiting=await f.evaluate(()=>UPPDRAG_CH4_CITY_LIFE.find(region,'book'));await f.waitForTimeout(120);const still=await f.evaluate(()=>UPPDRAG_CH4_CITY_LIFE.find(region,'book'));assert(Math.hypot(waiting.x-still.x,waiting.y-still.y)<.1,'selected person waits while the player approaches');assert.equal(still.moving,false);}
   await f.waitForFunction(()=>UPPDRAG_CH4_CITY_LIFE.active);await waitFacing();await f.waitForTimeout(900);
   const first=await facing();assert(first.distance>=35.7&&first.distance<=118);
   const turns=await f.evaluate(()=>UPPDRAG_CH4_CITY_LIFE.lines.length);
   for(let turn=0;turn<turns;turn++){
    const pose=await facing();assert(pose.npc>.985&&pose.player>.985,'both face each other on every turn: '+JSON.stringify(pose));assert.equal(pose.moving,false);assert.equal(pose.playerMoving,false);assert(Math.hypot(pose.x-first.x,pose.y-first.y)<.1,'a conversation partner stays put');
    const viewNow=await f.evaluate(()=>({x:camera.x,y:camera.y,follow}));assert(Math.hypot(viewNow.x-viewBefore.x,viewNow.y-viewBefore.y)<.1,'opening or advancing speech leaves the world view still');assert.equal(viewNow.follow,viewBefore.follow,'talking preserves the chosen camera mode');
    if(turn<turns-1)await f.locator('#ch3StreetDialogue').press('Space');
   }
   if(index===0){fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/social-conversation.png')});}
   await f.locator('#ch3StreetDialogue').press('Escape');
  }
  console.log('PASS actual clicks from four directions, patient approach, mutual facing, steady positions and stable camera through both speakers');
  let keyboardPlace=false;
  for(const side of [[0,1],[0,-1],[-1,0],[1,0]]){
   await placeAtBook(side,110);
   keyboardPlace=await f.evaluate(()=>UPPDRAG_WORLD_KEYBOARD.walkablePoint(region,player.x,player.y)&&UPPDRAG_CH4_CITY_LIFE.nearest(region,player,120)?.id==='book');
   if(keyboardPlace)break;
  }
  assert(keyboardPlace,'the person is the actual nearby keyboard target');await f.locator('#world').press('Space');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_CITY_LIFE.active),false,'Space at a distance starts an approach');
  await f.waitForFunction(()=>UPPDRAG_CH4_CITY_LIFE.active);await waitFacing();assert((await facing()).distance<=78);await f.locator('#ch3StreetDialogue').press('Escape');
  console.log('PASS Space walks to the person and starts a face-to-face conversation');
  await placeAtBook([-1,0],165);await clickBook();
  assert.equal(await f.evaluate(()=>pendingStreetChat),'book');
  await f.locator('#world').focus();await h.page.keyboard.down('ArrowDown');await f.waitForTimeout(180);await h.page.keyboard.up('ArrowDown');
  assert.equal(await f.evaluate(()=>pendingStreetChat),null,'manual movement cancels the old meeting');
  const before=await f.evaluate(()=>UPPDRAG_CH4_CITY_LIFE.find(region,'book'));await f.waitForTimeout(1400);
  const after=await f.evaluate(()=>UPPDRAG_CH4_CITY_LIFE.find(region,'book'));assert(Math.hypot(after.x-before.x,after.y-before.y)>1,'cancelled person is released');
  await alley(false);
  await h.page.emulateMedia({reducedMotion:'reduce'});await boot();await alley(true);
  // In reduced motion the resident has no ambient walking. A quiet, nearby
  // invitation should still turn toward the player, without locking movement.
  await f.evaluate(()=>{UPPDRAG_CH4_CITY_LIFE.suspend();path=[];const a=UPPDRAG_CH4_CITY_LIFE.find(region,'book');player={x:a.x,y:a.y+54};camera={...player};follow=true;draw();});
  const idleHeading=await f.evaluate(()=>UPPDRAG_SCENE_PRESENCE.playerView.baseHeading);await f.waitForFunction(()=>UPPDRAG_CH4_CITY_LIFE.teaser==='book',undefined,{timeout:14000});await f.waitForFunction(()=>{const a=UPPDRAG_CH4_CITY_LIFE.find(region,'book');return Math.cos(a.heading-Math.atan2(player.y-a.y,player.x-a.x))>.985;});assert.equal(await f.evaluate(()=>UPPDRAG_SCENE_PRESENCE.playerView.baseHeading),idleHeading,'a passive invitation cannot turn the child');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_CITY_LIFE.active),false);const invite=await facing();assert(invite.npc>.985);
  await f.locator('#world').focus();await h.page.keyboard.down('ArrowLeft');await f.waitForTimeout(150);await h.page.keyboard.up('ArrowLeft');assert.equal(await f.evaluate(()=>UPPDRAG_CH4_CITY_LIFE.teaser),null);
  console.log('PASS a nearby invitation acknowledges the player, and walking away releases it');
  assert.equal(await f.evaluate(()=>localStorage.getItem('uppdrag1700.mastery.v1.ch4')),progress);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.daler),0);assert.deepEqual(h.errors,[]);
 }catch(e){console.error('FAIL social presence',e);if(f){console.error(await f.evaluate(()=>({player,path,meeting:UPPDRAG_CH4_CITY_LIFE.actor,teaser:UPPDRAG_CH4_CITY_LIFE.teaser,view:UPPDRAG_SCENE_PRESENCE.playerView,people:UPPDRAG_CH4_CITY_LIFE.people(region).filter(p=>['celsius','book'].includes(p.id))})).catch(e=>e.message));fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/social-failed.png')}).catch(()=>{});}throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
