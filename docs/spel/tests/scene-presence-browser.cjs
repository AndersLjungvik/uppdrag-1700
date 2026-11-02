const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('presence');let f;
 async function clearSpeech(){await h.speechClose();await f.evaluate(()=>{UPPDRAG_CH4_CITY_LIFE.suspend();window.UPPDRAG_LIVING_DIALOGUES?.close?.();});}
 async function checkFaces(){
  const result=await f.evaluate(()=>{
   const b=document.querySelector('#adventureDialog[open]')||document.querySelector('#ch3StreetDialogue:not([hidden])');if(!b||!b.getClientRects().length)return {error:'no bubble'};
   const br=b.getBoundingClientRect(),sr=stage.getBoundingClientRect(),box={x:br.left-sr.left,y:br.top-sr.top,w:br.width,h:br.height},g=UPPDRAG_SCENE_PRESENCE.sceneGeometry();
   const overlaps=g.faces.map(q=>Math.max(0,Math.min(box.x+box.w,q.x+q.w)-Math.max(box.x,q.x))*Math.max(0,Math.min(box.y+box.h,q.y+q.h)-Math.max(box.y,q.y)));
   const tail=document.getElementById(b.id==='adventureDialog'?'adventureTail':'ch3StreetTail'),paper=tail?.querySelector('.worldSpeechPaper');let onPaper=true;const outside=[];
   if(paper){const viewport=b.querySelector('.presence-speech-copy')?.getBoundingClientRect()||br,walker=document.createTreeWalker(b,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(!node.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(node);for(const r of range.getClientRects()){const left=Math.max(r.left,viewport.left),right=Math.min(r.right,viewport.right),top=Math.max(r.top,viewport.top),bottom=Math.min(r.bottom,viewport.bottom);if(right-left<6||bottom-top<6)continue;for(const x of [left+3,right-3])for(const y of [top+3,bottom-3])if(!paper.isPointInFill(new DOMPoint(x-sr.left,y-sr.top))){onPaper=false;if(outside.length<4)outside.push({x:x-sr.left,y:y-sr.top,text:node.textContent.slice(0,25)});}}}}
   return {overlaps,box,bounds:g.bounds,onPaper,outside,scroll:(b.querySelector('.presence-speech-copy')?.scrollHeight||0)>(b.querySelector('.presence-speech-copy')?.clientHeight||0)};
  });assert(!result.error,result.error);assert(result.onPaper,'visible speech text stays inside its paper shape: '+JSON.stringify(result));assert(result.overlaps.every(x=>x<1),'speech covers a face: '+JSON.stringify(result));assert(result.box.x>=result.bounds.x-1&&result.box.y>=result.bounds.y-1);return result;
 }
 try{
  await h.boot();f=h.frame;
  const fixture=await f.evaluate(()=>{
   if(interior)leaveInterior();path=[];UPPDRAG_CH4_PILOT.state.daler=0;UPPDRAG_CH4_PILOT.persist();
   for(const p of UPPDRAG_WORLD_LIFE.people(region))UPPDRAG_WORLD_LIFE.freeze(p.id);
   const candidates=UPPDRAG_CH4_CITY_LIFE.people(region),all=UPPDRAG_SCENE_PRESENCE.actors(region);
   const actor=candidates.find(p=>[-1,1].every(x=>all.every(q=>Math.hypot(q.x-(p.x+x*100),q.y-p.y)>45))&&[-1,0,1].every(x=>[-1,0,1].every(y=>UPPDRAG_WORLD_KEYBOARD.walkablePoint(region,p.x+x*100,p.y+y*48))));
   if(!actor)return {error:'no isolated resident on open ground'};
   UPPDRAG_CH4_CITY_LIFE.hold(actor);window.__presenceActor=UPPDRAG_CH4_CITY_LIFE.find(region,actor.id);window.__presenceTrace={min:Infinity,maxStep:0,positions:[]};
   const old=UPPDRAG_WORLD_LIFE.tick;window.__presencePrevious=null;UPPDRAG_WORLD_LIFE.tick=function(...args){const ret=old.apply(this,args);if(window.__recordPresence&&!interior){const t=window.__presenceTrace,p=player,a=UPPDRAG_CH4_CITY_LIFE.find(region,actor.id);t.min=Math.min(t.min,Math.hypot(p.x-a.x,p.y-a.y));if(window.__presencePrevious)t.maxStep=Math.max(t.maxStep,Math.hypot(p.x-__presencePrevious.x,p.y-__presencePrevious.y));window.__presencePrevious={...p};t.positions.push({...p});}else window.__presencePrevious=null;return ret;};
   player={x:actor.x-100,y:actor.y};camera={...player};follow=true;draw();return {id:actor.id,x:actor.x,y:actor.y,record:localStorage.getItem('uppdrag1700.mastery.v1.ch4')};
  });assert(!fixture.error,fixture.error);console.log('Fixture resident:',fixture.id);
  await f.evaluate(()=>{player={x:__presenceActor.x-100,y:__presenceActor.y};camera={...player};path=[{x:__presenceActor.x+100,y:__presenceActor.y}];__recordPresence=true;draw();});
  await f.waitForFunction(()=>!path.length&&Math.hypot(player.x-(__presenceActor.x+100),player.y-__presenceActor.y)<3,undefined,{timeout:20000});
  let trace=await f.evaluate(()=>{__recordPresence=false;return __presenceTrace;});assert(trace.min>=35.7,'click route crosses a resident: '+trace.min);assert(trace.maxStep<=10,'click route teleported: '+trace.maxStep);assert(trace.positions.some(p=>Math.abs(p.y-fixture.y)>15),'click route takes a visible sidestep');
  console.log('PASS actual click route around resident, clearance',trace.min.toFixed(1));
  await f.evaluate(()=>{player={x:__presenceActor.x-100,y:__presenceActor.y};camera={...player};path=[];__presenceTrace={min:Infinity,maxStep:0,positions:[]};window.__presencePrevious=null;__recordPresence=true;draw();});
  await f.locator('#world').focus();await h.page.keyboard.down('ArrowRight');await f.waitForFunction(()=>player.x>__presenceActor.x+85,undefined,{timeout:20000});await h.page.keyboard.up('ArrowRight');
  trace=await f.evaluate(()=>{__recordPresence=false;return __presenceTrace;});assert(trace.min>=35.7,'arrows cross a resident: '+trace.min);assert(trace.maxStep<=10);console.log('PASS actual arrow walk around resident, clearance',trace.min.toFixed(1));
  // Manual walking releases a selected meeting. Hold the resident at its
  // current visible position again before comparing the two depth samples.
  await f.evaluate(()=>{const a=UPPDRAG_CH4_CITY_LIFE.find(region,__presenceActor.id);UPPDRAG_CH4_CITY_LIFE.hold(a);window.__presenceActor=UPPDRAG_CH4_CITY_LIFE.find(region,a.id);});
  for(const side of [-1,1]){
   const order=await f.evaluate(side=>{player={x:__presenceActor.x-60,y:__presenceActor.y+side*55};camera={...player};path=[];draw();return UPPDRAG_SCENE_PRESENCE.lastOrder;},side);
   const pi=order.findIndex(x=>x.id==='player'),ni=order.findIndex(x=>x.id===fixture.id);assert(pi>=0&&ni>=0,JSON.stringify(order));assert.equal(pi>ni,side>0,'ground depth switches in front/behind');
  }
  await f.evaluate(()=>{player={x:__presenceActor.x-70,y:__presenceActor.y};camera={...player};path=[];draw();return requestStreetChat(UPPDRAG_CH4_CITY_LIFE.find(region,__presenceActor.id));});
  await f.locator('#ch3StreetDialogue').waitFor({state:'visible'});await checkFaces();await clearSpeech();console.log('PASS nearby conversation remains reachable after body avoidance');
  for(const size of [{width:1200,height:850},{width:390,height:844},{width:844,height:390}]){
   await h.page.setViewportSize(size);await h.room('barnhus');await f.locator('#ch4CajsaVisitor').focus();await f.locator('#ch4CajsaVisitor').press('Enter');
   for(let i=0;i<3;i++){
    const geometry=await checkFaces();
    if(geometry.scroll){
     const wanted=await f.evaluate(()=>{const c=document.querySelector('#adventureDialog .presence-speech-copy');c.scrollTop=c.scrollHeight;return c.scrollTop;});
     assert(wanted>0,'compact text can be scrolled');await f.waitForTimeout(150);
     assert(await f.evaluate(()=>document.querySelector('#adventureDialog .presence-speech-copy').scrollTop)>=wanted-1,'repainting preserves the reading position');
     await checkFaces();await f.evaluate(()=>document.querySelector('#adventureDialog .presence-speech-copy').scrollTop=0);
    }
    if(i<2)await f.locator('.ad-utterance').click();
   }
   fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/presence-bubbles-'+size.width+'.png')});await clearSpeech();console.log('PASS both speakers and all faces at',size.width+'x'+size.height);
  }
  assert.equal(await f.evaluate(()=>localStorage.getItem('uppdrag1700.mastery.v1.ch4')),fixture.record,'no progress is changed');assert.deepEqual(h.errors,[]);
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f){console.error(await f.evaluate(()=>({player,path,room:interior?.kind,order:UPPDRAG_SCENE_PRESENCE?.lastOrder})).catch(e=>e.message));await h.page.screenshot({path:path.join(h.root,'qa/presence-failed.png')}).catch(()=>{});}throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
