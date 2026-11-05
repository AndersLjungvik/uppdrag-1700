'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),zlib=require('zlib'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz')))).scripts;
class Element{
 constructor(){this.children=[];this.dataset={};this.hidden=false;this.innerHTML='';this.classList={contains:()=>false,add(){},remove(){}};}
 append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=nodes;}setAttribute(){}addEventListener(){}querySelector(){return null;}querySelectorAll(){return [];}getContext(){return {};}
}
function fixture(kind,chapter=1){
 const stage=new Element(),memory=new Map(),document={title:'Kapitel '+chapter,baseURI:'https://example.test/spel/',hidden:false,head:new Element(),body:new Element(),documentElement:new Element(),
  getElementById:id=>id==='stage'?stage:null,createElement:()=>new Element(),createTextNode:text=>text,querySelector:()=>null,addEventListener(){}};
 let now=10000,room=null;const c={document,URL,URLSearchParams,console,Image:class{},setTimeout(){},performance:{now:()=>now},
  location:{search:''},matchMedia:()=>({matches:false}),addEventListener(){},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,String(v))},__INTEGRATED_CHAPTER:chapter,__UPPDRAG_QUERY:'?',
  sailing:null,voyage:null,interior:null,canvas:new Element(),UPPDRAG_WORLD_LIFE:{tick(){},draw(){}},UPPDRAG_MEETINGS:{drawMapPerson(){}},UPPDRAG_EVENT_ENGINE:{busy:false,approach:{point:null}}};
 c.window=c;vm.createContext(c);
 for(const name of ['gameplay-tuning.js','world-restoration.js'])vm.runInContext(read(name),c);
 let art=c.UPPDRAG_GAMEPLAY_TUNING.source('paper-look.js',read('base/paper-look.js'));
 art=art.replace('return {drawRegion,buildingSprite,ready,',"return {getTrees(r){const result=[];for(let i=0;i<65;i++){const x=70+(i*173)%(r.w-140),y=70+(i*229)%(r.h-140);if(clearDecoration(r,x,y,46))result.push({id:'tree-'+i,x,y:y-12,radius:27});}return result;},drawRegion,buildingSprite,ready,");
 vm.runInContext(art,c);
 const world=read('_decoded/world-street-pilot.js');
 vm.runInContext(world.slice(world.indexOf('const N='),world.indexOf('function setMessage')),c);
 vm.runInContext(world.slice(world.indexOf('function navigationPoint('),world.indexOf('function roadProjection(')),c);
 vm.runInContext('window.testRegion=MAIN;window.testNavigation=navigationPoint;',c);
 vm.runInContext(read('base/world-keyboard.js'),c);
 for(const name of ['recall-bank.js','recall-assessment.js'])vm.runInContext(snapshot[name],c);
 for(const name of ['fixes','alignment','power-language'])vm.runInContext(read('questions/'+name+'.js'),c);
 vm.runInContext(read('mastery-recall-adapter.js'),c);vm.runInContext(c.UPPDRAG_MASTERY_RECALL.source(snapshot['recall-flow.js']),c);
 const tasks=c.UPPDRAG_RECALL_BANK.filter(t=>t.chapter===chapter&&t.rank===0).slice(0,3);
 const state={v:2,apples:1,daler:17,step:1,index:0,trial:1,record:[],earned:{older:true},reviewPractice:{},encountered:tasks.map(t=>t.id)};
 const p=c['UPPDRAG_CH'+chapter+'_PILOT']={state,persist(){memory.set('pilot',JSON.stringify(state));},refresh(){},repetitionTaskIds:tasks.map(t=>t.id),goArchive(){room='archive';},studyBusy:false};
 memory.set('uppdrag1700.apple-threats.v1',JSON.stringify({v:1,chapters:{[chapter]:{quietMs:0,nextDistance:0,nextKind:kind}}}));
 for(const name of ['event-approach.js','apple-threats-model.js','apple-threats.js'])vm.runInContext(read(name),c);
 function tick(player,activeRoom=room){now+=80;c.UPPDRAG_WORLD_LIFE.tick(now,{region:c.testRegion,player,activeRoom});return copy(c.UPPDRAG_APPLE_THREATS.snapshot);}
 function spawn(){
  for(const edge of c.testRegion.edges){
   const a=c.testNavigation(c.testRegion,edge.a),b=c.testNavigation(c.testRegion,edge.b),length=Math.hypot(b.x-a.x,b.y-a.y);
   for(let d=0;d<length;d+=8){const p={x:a.x+(b.x-a.x)*d/length,y:a.y+(b.y-a.y)*d/length};
    const s=tick(p);if(s.active)return {point:p,encounter:s.active};
   }
  }throw Error('No actual town route can spawn '+kind);
 }
 return {c,state,p,memory,stage,tasks,tick,spawn,setRoom:value=>room=value};
}
for(const [kind,chapter] of [['dog',3],['dog',4],['guard',4],['dog',5],['guard',5]]){
 const h=fixture(kind,chapter),found=h.spawn(),a=found.encounter;
 assert.equal(a.kind,kind);assert(a.home.id.startsWith('tree-'),'real existing cover');assert(h.c.UPPDRAG_WORLD_KEYBOARD.clearSegment(h.c.testRegion,a.home,a.home,12));
 h.c.UPPDRAG_MENU_OPEN=()=>true;const paused=copy(h.c.UPPDRAG_APPLE_THREATS.snapshot.active);paused.point.moving=false;
 for(let i=0;i<120;i++)h.tick(found.point);assert.deepEqual(copy(h.c.UPPDRAG_APPLE_THREATS.snapshot.active),paused,'parent menu freezes the real adapter');h.c.UPPDRAG_MENU_OPEN=()=>false;
 const path=h.c.UPPDRAG_EVENT_APPROACH.routeBetween(h.c.testRegion,a.home,a.post,id=>h.c.testNavigation(h.c.testRegion,id),(p,q)=>h.c.UPPDRAG_WORLD_KEYBOARD.clearSegment(h.c.testRegion,p,q,12));assert(path?.length,'a real walkable route to the passage');
 const preserved=copy({daler:h.state.daler,record:h.state.record,earned:h.state.earned});
 // Walk toward the actual actor, using the same road graph and collision check.
 let player={...found.point};
 for(let i=0;i<600&&h.state.apples;i++){
  const target=h.c.UPPDRAG_APPLE_THREATS.snapshot.active?.point;if(!target)throw Error('Encounter unexpectedly ended');
  const steps=h.c.UPPDRAG_EVENT_APPROACH.routeBetween(h.c.testRegion,player,target,id=>h.c.testNavigation(h.c.testRegion,id),(p,q)=>h.c.UPPDRAG_WORLD_KEYBOARD.clearSegment(h.c.testRegion,p,q,12));
  if(steps?.length){const t=steps[0],d=Math.hypot(t.x-player.x,t.y-player.y),n=Math.min(d,8);if(d){player={x:player.x+(t.x-player.x)*n/d,y:player.y+(t.y-player.y)*n/d};}}
  h.tick(player);
 }
 assert.equal(h.state.apples,0,kind+' debits the pilot apple');assert(h.c.UPPDRAG_APPLE_THREATS.snapshot.state.needsRut);assert.equal(h.c.UPPDRAG_APPLE_THREATS.suppressesPickpocket,true);
 assert.deepEqual(copy({daler:h.state.daler,record:h.state.record,earned:h.state.earned}),preserved);
 h.setRoom('archive');h.tick(player);const modal=new Element();
 // Exercise the real recall engine and the pilot's unchanged reward callback.
 const pilot=read('chapter'+chapter+'-mastery.js'),begin=pilot.indexOf('const reviewRewards={'),end=pilot.indexOf('\nrecall=',begin);
 h.c.testState=h.state;const rewards=begin>=0?vm.runInContext('(function(s,pupilRound){'+pilot.slice(begin,end)+';return reviewRewards;})(testState,true)',h.c):{};
 const recall=h.c.UPPDRAG_RECALL_ENGINE.attach({chapter,state:()=>h.state,current:()=>({p:'palace',who:'Amira',r:0,f:h.tasks.map(t=>t.id)}),location:()=> 'archive',
  modal,persist:()=>h.p.persist(),drawHud(){},paint(){},openArchive(){},close(){},
  mastery:{...rewards,hasPassed:()=>false,available:()=>h.tasks.map(t=>t.id),renderStatus:()=>false,recorded(){throw Error('Rut must not award a main stamp');}}});
 assert.equal(recall.enterArchive(),true);h.tick(player);assert.equal(h.state.apples,0,'opening Rut is not an apple');assert(h.c.UPPDRAG_APPLE_THREATS.snapshot.state.needsRut);
 recall.input({target:{dataset:{rcField:'0'},value:'Jag vet inte'}});recall.action('rc-submit');h.tick(player);assert.equal(h.state.apples,0,'an empty or incorrect answer is not an apple');
 recall.leavingPanel();assert.equal(recall.enterArchive(),true);h.tick(player);assert(h.c.UPPDRAG_APPLE_THREATS.snapshot.state.needsRut,'an interrupted round is not a recovery');
 let guard=0;while(h.state.archiveMode!=='reward'){
  assert(++guard<12);const task=recall.current;
  task.fields.forEach((field,i)=>recall.input({target:{dataset:{rcField:String(i)},value:field.sample}}));
  recall.action('rc-submit');assert.equal(recall.ui.phase,'feedback',task.id);assert.equal(recall.ui.result.status,'right',task.id);recall.action('rc-next');
  if(h.state.archiveMode!=='reward')assert.equal(h.state.apples,0,'every card must be completed');
 }
 h.tick(player);assert.equal(h.state.apples,1);assert.equal(h.c.UPPDRAG_APPLE_THREATS.snapshot.state.needsRut,false);assert(h.c.UPPDRAG_APPLE_THREATS.snapshot.state.quietMs>44000);
 assert.deepEqual(copy({daler:h.state.daler,record:h.state.record,earned:h.state.earned}),preserved,'real retrieval never changes previous answers or resources');
 assert(h.state.recallRutLog.every(r=>r.chapter<=chapter));console.log('PASS real town '+kind+', chapter '+chapter+': valid cover and paths, real pilot debit, interrupted/wrong/complete Rut retrieval, preserved progress');
}
// Every chapter's existing dog painter accepts the new pose without changing
// quiet animals or requiring a second sprite set.
{
 const integration=read('integration.js'),snippet=integration.slice(integration.indexOf('function appleDogSource('),integration.indexOf('async function source('));const c={};vm.createContext(c);vm.runInContext(snippet,c);
 for(const name of ['world-life.js','world-life-ch3.js','world-life-ch4.js','world-life-ch5.js']){
  const patched=c.appleDogSource(read('base/'+name));assert(patched.includes('drawAppleDog(ctx,pose,time,region)'));new Function(patched);
  const h=fixture('dog',Number(name.match(/ch([345])/)?.[1]||1));vm.runInContext(patched,h.c);
  const painter=new Proxy({globalAlpha:1},{get:(o,k)=>k in o?o[k]:(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
  h.c.UPPDRAG_WORLD_LIFE.drawAppleDog(painter,{x:100,y:705,facing:1,moving:true},30000,h.c.testRegion);
 }
 console.log('PASS dog renderer source hooks in all five mastery chapters');
}
for(const chapter of [1,2])assert.equal(fixture('dog',chapter).c.UPPDRAG_APPLE_THREATS,undefined,'no new threats in early chapter '+chapter);
assert.equal(fixture('guard',3).spawn().encounter.kind,'dog','chapter three cannot load a saved guarding thief');
console.log('PASS staged introduction: no dog/guard in 1–2, dog only in 3, both in 4–5');
