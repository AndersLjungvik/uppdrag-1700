'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const c={window:{}};vm.createContext(c);vm.runInContext(read('orchard-model.js'),c);vm.runInContext(read('orchard.js'),c);
const M=c.window.UPPDRAG_ORCHARD_MODEL,home={x:200,y:100},start={x:100,y:100};
function model(raw={},credit=()=>true){let saved,awards=0,practised=[];
 const model=M.create(raw,{save:s=>saved=copy(s),awardApple:()=>{awards++;return credit();},practice:id=>practised.push(id)});
 let now=0;const tick=(p=start,extra={})=>{now+=80;return model.tick(now,p,{region:'main',home,clear:()=>true,route:(a,b)=>[{...b}],canSee:()=>true,...extra});};
 return {model,tick,get saved(){return saved;},get awards(){return awards;},practised};
}
function escape(h){assert(h.model.begin(start,home,'known-task'));for(let i=0;i<100&&h.model.snapshot().phase!=='question';i++)h.tick({x:30,y:100},{inSafe:true,canSee:()=>false});assert.equal(h.model.snapshot().phase,'question');}
{
 const h=model();escape(h);assert.equal(h.awards,0,'escaping alone is not an apple');
 const before=h.model.snapshot();for(let i=0;i<50;i++)h.tick({x:30,y:100},{paused:true});assert.deepEqual(copy(h.model.snapshot().actor),copy(before.actor),'reading freezes the encounter');
 assert.equal(h.model.submit(false,'jag minns inte').reason,'practice');assert.equal(h.awards,0);assert.deepEqual(h.practised,['known-task']);assert.equal(h.saved.claimed,false);
 const retry=model(h.saved);assert.equal(retry.model.begin(start,home,'known-task'),false,'a failed answer cannot be immediately copied for a reward');
}
{
 const h=model();escape(h);assert.equal(h.model.submit(true,'mitt svar').ok,true);assert.equal(h.awards,1);assert.equal(h.saved.claimed,true);
 assert.equal(h.model.submit(true,'mitt svar').ok,false);assert.equal(h.awards,1);h.model.close();assert.equal(h.model.begin(start,home,'known-task'),false);
 const reload=model(h.saved);assert.equal(reload.model.begin(start,home,'known-task'),false);assert.equal(reload.awards,0,'reload cannot award again');
}
{
 const h=model();assert(h.model.begin(start,home,'known-task'));for(let i=0;i<100&&h.model.snapshot().phase!=='idle';i++)h.tick();assert.equal(h.model.snapshot().phase,'idle');assert(h.saved.history.some(h=>h.outcome==='caught'));assert.equal(h.awards,0);
 const active=model();assert(active.model.begin(start,home,'known-task'));const reload=model(active.saved);assert.equal(reload.model.snapshot().phase,'idle');assert.equal(reload.awards,0,'interrupted chase gives no reward');
 const full=model({},()=>false);escape(full);assert.equal(full.model.submit(true,'rätt').reason,'full');assert.equal(full.saved.claimed,false,'full inventory does not consume the chapter bonus');
 const house=model();assert(house.model.begin(start,home,'known-task'));house.tick(start,{shelter:true,paused:true});assert.equal(house.model.snapshot().phase,'question','house or conversation gives real shelter');
}
console.log('PASS orchard state: warning, physical capture, cover/house escape, required answer, wrong-answer practice/cooldown, single reward, full inventory and interrupted/reloaded saves');
{
 const h=model(),patrol=[{x:100,y:160},{x:260,y:160},home];
 for(let i=0;i<70;i++)h.tick({x:500,y:500},{patrol});
 const before=h.model.snapshot().actor;assert(Math.hypot(before.x-home.x,before.y-home.y)>35,'owner visibly patrols before any theft');
 assert.equal(h.model.snapshot().phase,'idle');assert.equal(h.awards,0);
 for(let i=0;i<20;i++)h.tick({x:500,y:500},{patrol,paused:true});assert.deepEqual(copy(h.model.snapshot().actor),{...copy(before),moving:false},'reading pauses patrol');
 assert(h.model.begin(start,home,'known-task'));assert.deepEqual({x:h.model.snapshot().actor.x,y:h.model.snapshot().actor.y},{x:before.x,y:before.y},'pursuit starts at the patrol position, without teleporting');
 for(let i=0;i<15;i++)h.tick({x:30,y:100});assert.equal(h.model.snapshot().phase,'chasing','theft triggers a short warning then pursuit');
 console.log('PASS estate patrol: visible idle movement, reading pause and pursuit from the actual current position');
}
{
 vm.runInContext(read('apple-threats-model.js'),c);const events=[];
 const threats=c.window.UPPDRAG_APPLE_THREAT_MODEL.create({needsRut:true,nextKind:'dog'},{event:(kind,outcome)=>events.push([kind,outcome])});
 const cfg={region:'main',paused:true,apples:0,known:true,bonusClaimed:false};threats.tick(100,start,cfg);assert(threats.snapshot().state.needsRut);
 threats.tick(180,start,{...cfg,apples:1,bonusClaimed:true});const s=threats.snapshot().state;
 assert.equal(s.needsRut,false);assert(s.orchardClaimed);assert.deepEqual(events,[['orchard','recovered']]);
 const nextLoss=c.window.UPPDRAG_APPLE_THREAT_MODEL.create({...s,needsRut:true},{event(){}});nextLoss.tick(200,start,{...cfg,apples:1,bonusClaimed:true});
 assert(nextLoss.snapshot().state.needsRut,'an old bonus cannot erase a later apple loss');
 console.log('PASS apple-risk recovery: a newly earned orchard reward clears the wait once, with a safe period; reload/old bonus cannot erase later losses');
}

const {fixture:worldFixture}=require('./apple-threats-world.cjs'),{fixture:pilotFixture}=require('./mastery-apple-retry.cjs');
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.hidden=true;this.open=false;this.innerHTML='';this.input={value:'',focus(){}};this.button={focus(){}};}
 append(...x){this.children.push(...x);}setAttribute(){}addEventListener(n,f){(this.events[n]??=[]).push(f);}focus(){}closest(){return null;}
 querySelector(q){return q==='input'?this.input:q==='button'?this.button:null;}showModal(){this.open=true;}close(){this.open=false;}
 getBoundingClientRect(){return {left:0,top:0,width:1200,height:850};}
}
for(const [chapter,mode] of [[1,'wrong'],...[1,2,3,4,5].map(ch=>[ch,'right'])]){
 const h=worldFixture('dog',chapter),real=pilotFixture(chapter),c=h.c,doc=c.document,elements=[],canvas=new Element('canvas'),oldGet=doc.getElementById;
 doc.getElementById=id=>id==='world'?canvas:oldGet(id);doc.createElement=tag=>{const e=new Element(tag);elements.push(e);return e;};
 c.region=c.testRegion;c.player={...c.testNavigation(c.region,'manor')};c.path=[];c.follow=true;c.setMessage=()=>{};
 c.UPPDRAG_EVENT_ENGINE.people=()=>[];c.UPPDRAG_EVENT_ENGINE.register=()=>true;
 c['UPPDRAG_CH'+chapter+'_PILOT']=real.p;real.p.state.apples=0;
 const known=c.UPPDRAG_RECALL_BANK.find(t=>t.chapter===chapter&&t.rank===0&&t.kind==='fields'&&t.fields.length===1&&t.fields[0].answers);
 assert(known);real.p.state.encountered.push(known.id);assert(real.p.repetitionTaskIds.includes(known.id));
 vm.runInContext(read('orchard-model.js'),c);vm.runInContext(read('orchard.js'),c);const api=c.UPPDRAG_ORCHARD,g=api.geometry(),dialog=elements.find(e=>e.tag==='dialog');
 assert(g,'real town has an orchard and hiding place');assert(c.UPPDRAG_WORLD_KEYBOARD.clearSegment(c.region,g.pick,g.pick,24));assert(c.UPPDRAG_WORLD_KEYBOARD.clearSegment(c.region,g.safe,g.safe,24));
 assert(g.tree.y+48<439,'entire apple tree stands north of the real pasture fence');
 assert(g.patrol.every(p=>p.y+18<439),'patrol stays outside the animal pasture');
 assert(!elements.filter(e=>e.tag==='section').some(e=>e.children.some(child=>child.tag==='button')),'no choice buttons for picking or running away');
 assert(c.UPPDRAG_EVENT_APPROACH.blockedByCover(g.home,g.safe,[g.cover]),'actual existing tree blocks sight');
 const clear=(a,b)=>c.UPPDRAG_WORLD_KEYBOARD.clearSegment(c.region,a,b,12),route=c.UPPDRAG_EVENT_APPROACH.routeBetween(c.region,g.pick,g.safe,id=>c.testNavigation(c.region,id),clear);assert(route?.length);
 assert.equal(api.pick(),false,'cannot pick remotely');c.player={...g.pick};
 const patrolFrames=mode==='wrong'?72:chapter*16;
 for(let i=0;i<patrolFrames;i++)c.UPPDRAG_WORLD_LIFE.tick(10000+i*80,{region:c.region,player:c.player,activeRoom:null});
 const patrolPosition=api.snapshot.actor;assert.equal(api.snapshot.phase,'idle','patrolling alone never starts a chase');assert(Math.hypot(patrolPosition.x-g.home.x,patrolPosition.y-g.home.y)>30);
 const keys={};c.addEventListener=(type,fn)=>(keys[type]??=[]).push(fn);c.canvas=canvas;c.pending=null;c.pendingRoom=null;c.returnPending=false;c.drag=null;c.cancelPersonArrival=()=>{};c.getComputedStyle=()=>({display:'block',visibility:'visible'});doc.activeElement=canvas;canvas.hidden=false;
 vm.runInContext(api.source('world-keyboard.js',read('_decoded/world-keyboard.js')),c);
 const key=(type,value,repeat=false)=>{const event={key:value,code:value===' '?'Space':value,target:canvas,repeat,preventDefault(){this.defaultPrevented=true;},stopImmediatePropagation(){}};for(const fn of keys[type]||[])fn(event);};
 const kept=copy({daler:real.p.state.daler,record:real.p.state.record,earned:real.p.state.earned,review:real.p.state.reviewQueue});
 key('keydown','ArrowLeft');key('keydown',' ');assert.equal(api.snapshot.phase,'warning');assert.equal(real.p.state.apples,0);
 assert.deepEqual({x:api.snapshot.actor.x,y:api.snapshot.actor.y},{x:patrolPosition.x,y:patrolPosition.y},'Space starts pursuit from the visible patrol position');
 key('keydown',' ',true);assert.equal(api.snapshot.state.attempts,1,'holding Space cannot pick repeatedly');
 assert(c.UPPDRAG_WORLD_KEYBOARD.state.held.includes('ArrowLeft'),'Space picks while the running arrow stays held');
 const beforeRun=c.player.x;c.UPPDRAG_WORLD_KEYBOARD.tick(.05);assert(c.player.x<beforeRun,'player continues running immediately after picking');
 key('keyup',' ');key('keyup','ArrowLeft');
 assert.equal(api.hide(),true,'a click/touch action starts a real route to the safe tree');assert(c.path.length>0);assert.equal(api.snapshot.phase,'warning','hiding is walking, not an instant escape');
 let now=20000,prev=api.snapshot.actor;const walk=c.path.map(p=>({...p}));
 for(let i=0;i<180&&api.snapshot.phase!=='question';i++){
  if(walk.length){const p=walk[0],d=Math.hypot(p.x-c.player.x,p.y-c.player.y),n=Math.min(d,9);if(d){c.player.x+=(p.x-c.player.x)*n/d;c.player.y+=(p.y-c.player.y)*n/d;}if(d<=9)walk.shift();}
  now+=80;c.UPPDRAG_WORLD_LIFE.tick(now,{region:c.region,player:c.player,activeRoom:null});
  const a=api.snapshot.actor;if(a&&prev)assert(Math.hypot(a.x-prev.x,a.y-prev.y)<=8.21,'noble uses the same frame cap as the player and cannot gain speed on a slow screen');prev=a;
 }
 assert.equal(api.snapshot.phase,'question','actual cover and real paths permit escape: '+JSON.stringify({tree:g.tree,pick:g.pick,home:g.home,safe:g.safe,player:c.player,state:api.snapshot}));assert(dialog.open);assert.equal(real.p.state.apples,0);
 const selected=c.UPPDRAG_RECALL_BANK.find(t=>t.id===api.snapshot.taskId);assert(real.p.repetitionTaskIds.includes(selected.id));assert(selected.chapter<=chapter);
 if(mode==='wrong'){
  const higher=c.UPPDRAG_RECALL_BANK.find(t=>t.chapter===selected.chapter&&t.topic===selected.topic&&t.rank===2);assert(higher);
  real.p.state.recallRutFocus=[higher.id];dialog.input.value='Jag vet inte';
  for(const fn of dialog.events.submit)fn({preventDefault(){}});
  assert.equal(real.p.state.apples,0);assert.equal(api.claimed,false);assert.deepEqual(copy(real.p.state.recallRutFocus),[higher.id],'the original explanation keeps priority at Rut');
  assert.match(dialog.innerHTML,/Öva lite till/);assert.equal(api.snapshot.state.history.at(-1).outcome,'practice');
  assert.deepEqual(copy({daler:real.p.state.daler,record:real.p.state.record,earned:real.p.state.earned,review:real.p.state.reviewQueue}),kept);
  console.log('PASS real wrong-answer path: no apple or consumed quota, correct feedback, original higher-level Rut target preserved, no main-result changes');continue;
 }
 dialog.input.value=selected.fields[0].sample;
 for(const fn of dialog.events.submit)fn({preventDefault(){}});
 assert.equal(real.p.state.apples,1,'real chapter pilot receives one apple after correct free recall');assert(api.claimed);
 for(const fn of dialog.events.submit)fn({preventDefault(){}});assert.equal(real.p.state.apples,1);
 assert.deepEqual(copy({daler:real.p.state.daler,record:real.p.state.record,earned:real.p.state.earned,review:real.p.state.reviewQueue}),kept,'no main answer, coin, stamp or review changes');
 assert(JSON.parse(h.memory.get('uppdrag1700.orchard.v1')).chapters[chapter].claimed);
 console.log('PASS real chapter '+chapter+': actual tree cover and walkable paths, physical pick, bounded pursuit, blank short answer from encountered book material, one apple in actual pilot, saved chapter quota and preserved mastery');
}
for(const name of ['world-keyboard.js','world-keyboard-ch3.js','world-keyboard-ch4.js','world-keyboard-ch5.js']){
 let text=read('_decoded/'+name);const context={window:{}};vm.createContext(context);vm.runInContext(read('hat-shop.js'),context);vm.runInContext(read('scene-presence.js'),context);
 text=context.window.UPPDRAG_HAT_SHOP.source(name,text);text=c.window.UPPDRAG_ORCHARD.source(name,text);text=context.window.UPPDRAG_SCENE_PRESENCE.source(name,text);new Function(text);
}
assert(read('integration.js').includes("+orchard+'\\n'"));assert(read('event-engine.js').includes('document.hidden||!!window.UPPDRAG_ORCHARD?.busy'));
console.log('PASS orchard integration: composed keyboard/dialogue hooks and competing-threat suppression');
