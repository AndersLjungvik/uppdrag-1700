const {launch,assert,fs,path}=require('./chapter5-test-utils.cjs');
(async()=>{
 const h=await launch('world');let f;
 const resources=()=>f.evaluate(()=>({daler:UPPDRAG_CH5_PILOT.state.daler,apples:UPPDRAG_CH5_PILOT.state.apples,records:UPPDRAG_CH5_PILOT.state.record.length,stamps:Object.values(UPPDRAG_MASTERY.snapshot().state.areas).map(a=>Object.values(a).map(l=>l.status==='clear'))}));
 async function meet(id){
  assert.equal(await f.evaluate(id=>{
   if(interior)leaveInterior();path=[];UPPDRAG_CH5_CITY_LIFE.suspend();
   const actor=UPPDRAG_CH5_CITY_LIFE.find(region,id);UPPDRAG_CH5_CITY_LIFE.hold(actor);
   player={x:actor.x-65,y:actor.y};camera={x:player.x+35,y:player.y};follow=false;draw();
   return UPPDRAG_CH5_CITY_LIFE.open(actor);
  },id),true,id);await f.waitForTimeout(950);
 }
 async function finish(){
  for(let i=0;i<12&&await f.evaluate(()=>UPPDRAG_CH5_CITY_LIFE.active);i++)await f.locator('#ch3StreetDialogue').press('Space');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH5_CITY_LIFE.active),false);
 }
 try{
  await h.boot();f=h.frame;const before=await resources();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.completedConversation('prisoner',true)),false);
  for(const [area,place] of [['power','riksdag'],['reforms','palace'],['press','print'],['rights','church']]){
   await h.room(place);await h.greet();assert.equal(await f.locator('#adventureDialog button').count(),0);await h.choose('study');
   assert.equal(await f.locator('#ch1CutPaperScene').getAttribute('data-place'),place);assert.equal(await f.locator('#ch1Modal').evaluate(e=>e.classList.contains('ch1MemoryFull')),true);
   await f.evaluate(()=>UPPDRAG_CH5_PILOT.close());
  }
  await h.room('barnhus');assert.equal(await f.locator('#ch4CajsaVisitor').isHidden(),true);assert.equal(await f.locator('#ch4BookAction').isHidden(),true);await h.greet();assert.doesNotMatch(await f.locator('.ad-utterance').innerText(),/Cajsa/);await h.speechClose();
  await h.room('fort');await h.greet();assert.match(await f.locator('.ad-utterance').innerText(),/ordning/);await h.speechClose();
  await f.evaluate(()=>{leaveInterior();player={x:50,y:50};path=[];draw();});
  assert.equal(await f.evaluate(()=>UPPDRAG_CH5_CITY_LIFE.open(UPPDRAG_CH5_CITY_LIFE.find(region,'prisoner'))),false,'remote interaction');
  await meet('prisoner');assert.match(await f.locator('#ch5StreetTime').innerText(),/fiktiv/);assert.doesNotMatch(await f.locator('.ch3Words').innerText(),/påhittad|fiktiv|dramatis/);
  await f.locator('#ch3StreetDialogue').press('Escape');assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.phase),'waiting');assert.equal(await f.locator('#ch5StreetTime').isHidden(),true);
  await meet('prisoner');const camera=await f.evaluate(()=>({x:camera.x,y:camera.y,follow}));
  await finish();assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.phase),'carrying');
  assert.deepEqual(await f.evaluate(()=>({x:camera.x,y:camera.y,follow})),camera,'conversation never recentres the view');
  assert.deepEqual(await resources(),before,'letter and reading do not award stamps or resources');
  await h.boot();f=h.frame;assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.hasLetter),true);assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.completedConversation('wharf',true)),false);
  await h.room('fort');await meet('wharf');await f.locator('#ch3StreetDialogue').press('Escape');assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.phase),'carrying','an interrupted hand-in preserves the letter');
  await meet('wharf');await finish();assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.delivered),true);assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.completedConversation('wharf',true)),false);
  assert.deepEqual(await resources(),before);
  await h.boot();f=h.frame;assert.equal(await f.evaluate(()=>UPPDRAG_CH5_LETTER.delivered),true);
  await f.locator('#adventureJournal').click();assert.match(await f.locator('#adventureDialog').innerText(),/Brevet är lämnat/);assert.doesNotMatch(await f.locator('#adventureDialog').innerText(),/hjulaxel|Sök smeden/);await f.locator('#adventureDialog').press('Escape');
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openWagon()),false);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openSmith()),false);
  // An actual street conversation still holds both people and the camera steady.
  await f.evaluate(()=>{if(interior)leaveInterior();switchRegion('main',REGIONS.main.harbor);if(interior)leaveInterior();draw();});
  await meet('book');const pose=await f.evaluate(()=>({person:UPPDRAG_CH5_CITY_LIFE.find(region,'book'),camera:{...camera},player:{...player}}));
  await f.waitForTimeout(700);const after=await f.evaluate(()=>({person:UPPDRAG_CH5_CITY_LIFE.find(region,'book'),camera:{...camera},player:{...player},heading:UPPDRAG_SCENE_PRESENCE.playerView.heading}));
  assert(Math.hypot(pose.person.x-after.person.x,pose.person.y-after.person.y)<.1);assert.deepEqual(after.camera,pose.camera);assert.deepEqual(after.player,pose.player);
  const angle=Math.atan2(after.person.y-after.player.y,after.person.x-after.player.x);assert(Math.cos(after.person.heading-angle-Math.PI)>.98);assert(Math.cos(after.heading-angle)>.98);
  fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ch5-street.png')});await f.locator('#ch3StreetDialogue').press('Escape');
  await h.page.setViewportSize({width:390,height:844});await h.page.emulateMedia({reducedMotion:'reduce'});await h.room('palace');await h.greet();assert.equal(await f.locator('#adventureDialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true);assert.equal(await f.evaluate(()=>{const s=stage.getBoundingClientRect(),faces=UPPDRAG_SCENE_PRESENCE.sceneGeometry().faces;return ['adventureDialog','adventureReplies'].every(id=>{const e=document.getElementById(id);if(e.hidden)return true;const r=e.getBoundingClientRect(),b={x:r.left-s.left,y:r.top-s.top,w:r.width,h:r.height};return faces.every(f=>Math.max(0,Math.min(b.x+b.w,f.x+f.w)-Math.max(b.x,f.x))*Math.max(0,Math.min(b.y+b.h,f.y+f.h)-Math.max(b.y,f.y))<.1);});}),true,'both speech and replies leave both faces visible');await h.page.screenshot({path:path.join(h.root,'qa/ch5-palace-mobile.png')});await h.speechClose();
  await h.page.setViewportSize({width:844,height:390});await h.room('print');await h.greet();assert.equal(await f.locator('#adventureDialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true);await h.page.screenshot({path:path.join(h.root,'qa/ch5-print-landscape.png')});
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 5 world: original closeups, natural dialogue, no live Cajsa/old wagon, nearby letter pickup and hand-in, Escape/reload/exact-once, independent resources, mutual facing/stable camera, mobile/landscape');
 }catch(e){console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
