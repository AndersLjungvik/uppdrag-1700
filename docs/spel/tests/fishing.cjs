'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const c={window:{}};vm.createContext(c);vm.runInContext(read('fishing-model.js'),c);vm.runInContext(read('fishing.js'),c);const M=c.window.UPPDRAG_FISHING_MODEL;
function harness(raw={},balance=12){let saved,near=true,kitchen=false,payments=0,debits=0,apples=0,now=0;const practice=[];
 const model=M.create(raw,{save:s=>saved=copy(s),wallet:()=>balance,atShop:()=>near,atWater:()=>near,atKitchen:()=>kitchen,random:()=>0,
 debit(n,expected){assert.equal(balance,expected);debits++;assert.equal(model.buy().reason,'busy');balance-=n;return true;},credit(n){payments++;apples+=n;return true;},practice:id=>practice.push(id)});
 const tick=(cfg={})=>{now+=100;return model.tick(now,cfg);};
 const bite=(ch=4,id='known')=>{assert(model.cast(ch,id).ok);for(let i=0;i<40&&model.snapshot().phase==='waiting';i++)tick();assert.equal(model.snapshot().phase,'question');};
 const reel=()=>{assert.equal(model.submit(true,'rätt').reason,'reel');assert.equal(model.pull().reason,'pull');assert.equal(model.pull().reason,'landing');for(let i=0;i<8;i++)tick();return model.snapshot().outcome;};
 return {model,tick,bite,reel,practice,set near(v){near=v;},set kitchen(v){kitchen=v;},get saved(){return saved;},get balance(){return balance;},get apples(){return apples;},get payments(){return payments;},get debits(){return debits;}};
}
{
 const poor=harness({},9);assert.equal(poor.model.buy().reason,'funds');assert.equal(poor.balance,9);
 const h=harness();h.near=false;assert.equal(h.model.buy().reason,'away');h.near=true;assert.equal(h.model.buy().paid,10);assert.equal(h.balance,2);assert.equal(h.model.buy().paid,0);assert.equal(h.debits,1);
 h.bite();assert.equal(h.model.submit(false,'minns inte').reason,'practice');assert.deepEqual(h.practice,['known']);assert.equal(h.saved.fish.length,0);h.model.close();
 assert(h.model.cast(4,'known').ok);for(let i=0;i<50;i++)h.tick({paused:true});assert.equal(h.model.snapshot().phase,'waiting');h.tick({present:false});assert.equal(h.model.snapshot().phase,'idle');assert.equal(h.model.submit(true).reason,'inactive');
 h.bite();const restored=harness(h.saved);assert(restored.model.snapshot().state.rod);assert.equal(restored.model.snapshot().phase,'idle');assert.equal(restored.model.submit(true).reason,'inactive','reload cannot turn waiting into a catch');
 h.reel();assert.equal(h.model.snapshot().state.fish.length,1);assert.equal(h.model.submit(true).reason,'inactive');assert.equal(h.model.pull().reason,'inactive');h.model.close();
 assert.equal(h.model.deliver(4).reason,'away');h.kitchen=true;assert.equal(h.model.deliver(4).amount,1);assert.equal(h.balance,2);assert.equal(h.apples,1);assert.equal(h.model.deliver(4).reason,'empty');assert.equal(h.payments,1);
 for(let i=0;i<2;i++){h.bite();h.reel();h.model.close();assert.equal(h.model.deliver(4).amount,1);}
 assert.equal(h.model.snapshot().state.chapters[4].delivered,3);assert.equal(h.balance,2);assert.equal(h.apples,3);
 h.bite();assert.equal(h.reel(),'released');assert.equal(h.model.snapshot().state.fish.length,0);h.model.close();assert.equal(h.model.deliver(4).reason,'limit');assert.equal(h.payments,3);
 const next=harness(h.saved,5);next.bite(5);assert.equal(next.reel(),'caught');assert(next.model.snapshot().state.rod);assert.equal(next.debits,0,'equipment is retained across chapters');
 console.log('PASS fishing economy: 10-daler permanent rod, physical trades, insufficient funds, no double debit, bounded delivery, correct/wrong/released catches, interruption, pause and reload');
}
{
 const h=harness({rod:true});assert.equal(h.model.pull().reason,'inactive');h.bite();assert.equal(h.model.submit(true).reason,'reel');assert.equal(h.model.snapshot().state.fish.length,0,'a correct answer alone is not a catch');
 for(let i=0;i<60;i++)h.tick();assert.equal(h.model.snapshot().phase,'reeling','no rush to start pulling');
 assert.equal(h.model.pull().reason,'pull');for(let i=0;i<60;i++)h.tick({paused:true});assert.equal(h.model.snapshot().pullMs,900,'menus pause the double-tap window');
 for(let i=0;i<10;i++)h.tick();assert.equal(h.model.snapshot().pullMs,0);assert.equal(h.model.snapshot().phase,'reeling','slow taps keep the fish');
 assert.equal(h.model.pull().reason,'pull');assert.equal(h.model.pull().reason,'landing');assert.equal(h.model.snapshot().state.fish.length,0,'two taps start the landing animation');
 for(let i=0;i<60;i++)h.tick({paused:true});assert.equal(h.model.snapshot().landingProgress,0,'hidden tabs and other activities pause the landing');
 h.tick();assert(h.model.snapshot().landingProgress>0);h.tick({present:false});assert.equal(h.model.snapshot().phase,'idle');assert.equal(h.model.snapshot().state.fish.length,0,'interrupting the landing cannot award a fish');
 h.bite();h.model.submit(true);h.model.pull();const reload=harness(h.saved);assert.equal(reload.model.snapshot().phase,'idle');assert.equal(reload.model.snapshot().state.fish.length,0,'reload during pulling does not award a fish');
 const legacy=harness({rod:true,chapters:{4:{delivered:3}}});legacy.kitchen=true;assert.equal(legacy.model.deliver(4).reason,'limit');assert.equal(legacy.apples,0,'old paid orders cannot be claimed again as apples');
 console.log('PASS active landing: no automatic catch, forgiving two-tap window, pause, cancellation, reload and legacy delivery limit');
}
const {fixture:worldFixture}=require('./apple-threats-world.cjs'),{fixture:pilotFixture}=require('./mastery-apple-retry.cjs');
{
 const h=worldFixture(null,4),c=h.c,geometry={water:(r,x,y)=>c.waterAt(r,x,y),walkable:(r,x,y,n)=>c.UPPDRAG_WORLD_KEYBOARD.walkablePoint(r,x,y,n),clear:(r,a,b,n)=>c.UPPDRAG_WORLD_KEYBOARD.clearSegment(r,a,b,n)};
 for(const r of vm.runInContext('Object.values(REGIONS)',c)){
  const shores=M.shores(r,geometry);assert(shores.length>20,'many real banks in '+r.id);
  assert(shores.some(a=>shores.some(b=>Math.hypot(a.origin.x-b.origin.x,a.origin.y-b.origin.y)>700)),'fishing is spread across '+r.id);
  for(const s of shores){assert(geometry.walkable(r,s.origin.x,s.origin.y,24));assert(geometry.water(r,s.water.x,s.water.y));assert(s.distance<=100);assert(M.shoreSpot(r,s.origin,geometry));}
 }
 assert.equal(M.shoreSpot(c.testRegion,c.testNavigation(c.testRegion,'square'),geometry),null,'no fishing on the inland plaza');
 const lake={id:'lake',w:640,h:480,water:[[[500,0],[640,0],[640,480],[500,480]]],bridges:[],buildings:[]};
 assert(M.shoreSpot(lake,{x:430,y:240},geometry),'new shorelines work without hand-authored spots');lake.buildings.push({x:460,y:0,w:20,h:480});assert.equal(M.shoreSpot(lake,{x:430,y:240},geometry),null,'a rod cannot cast through a house to reach water');
 console.log('PASS shoreline geometry: many real banks across all three maps, dry standing ground, water floats, no inland casts or casts through buildings');
}
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.style={};this.hidden=false;this.open=false;this.innerHTML='';this.input={value:'',focus(){}};this.button={focus(){}};}
 append(...n){this.children.push(...n);}setAttribute(){}addEventListener(n,f){(this.events[n]??=[]).push(f);}focus(){}closest(){return null;}
 querySelector(q){return q==='input'?this.input:q==='button'||q==='input,button:not([disabled])'?this.button:null;}showModal(){this.open=true;}close(){this.open=false;}
 getBoundingClientRect(){return {left:0,top:0,width:3600,height:1500};}
}
function adapter(ch,demo=false){
 const h=worldFixture(null,ch),real=pilotFixture(ch),c=h.c,els=[],canvas=new Element('canvas'),doc=c.document,oldGet=doc.getElementById;
 doc.createElement=tag=>{const e=new Element(tag);els.push(e);return e;};doc.getElementById=id=>['world','interiorCanvas'].includes(id)?canvas:oldGet(id);
 c.roomView=new Element();c.roomFooter=new Element();c.region=c.testRegion;c.player={...c.testNavigation(c.region,'square')};c.path=[];c.follow=true;c.voyage=null;c.interior=null;c.__UPPDRAG_FISHING_TEST=demo;canvas.width=3600;canvas.height=1500;
 doc.querySelectorAll=()=>[];c.UPPDRAG_WORLD_LIFE.people=()=>[];c.roomKind=()=>null;c.setMessage=()=>{};
 for(const key of ['UPPDRAG_RECALL_BANK','UPPDRAG_RECALL_ENGINE','UPPDRAG_PROMPT_ALIGNMENT'])c[key]=real.c[key];
 c['UPPDRAG_CH'+ch+'_PILOT']=real.p;real.p.state.daler=12;c.UPPDRAG_MEETINGS.geometryForRoom=()=>null;
 let harbourRequests=0,roomRequests=0,speech=null;c.requestHarbour=()=>{harbourRequests++;return true;};c.requestInterior=()=>{roomRequests++;return true;};
 c.UPPDRAG_EVENT_ENGINE.register=()=>true;c.UPPDRAG_EVENT_ENGINE.speakRoom=s=>{speech=s;return true;};
 vm.runInContext(read('fishing-model.js'),c);vm.runInContext(read('fishing.js'),c);const api=c.UPPDRAG_FISHING,dialog=els.find(e=>e.tag==='dialog');let now=10000;
 const keys={};if(api.cast){c.addEventListener=(n,f)=>(keys[n]??=[]).push(f);doc.activeElement=canvas;c.getComputedStyle=()=>({display:'block',visibility:'visible'});vm.runInContext(api.source('world-keyboard-ch'+ch+'.js',read('_decoded/world-keyboard-ch'+ch+'.js')),c);}
 const key=(type,value,repeat=false)=>{for(const f of keys[type]||[])f({key:value,code:value===' '?'Space':value,repeat,target:canvas,preventDefault(){this.defaultPrevented=true;},stopImmediatePropagation(){}});};
 const tick=()=>{now+=100;c.UPPDRAG_WORLD_LIFE.tick(now,{region:c.region,player:c.player,activeRoom:c.interior?.kind||null});};
 const click=code=>{for(const f of dialog.events.click)f({target:{closest:()=>({dataset:{fishing:code}})}});};
 const room=kind=>{c.interior=kind==='quay'?{kind:'waterfront',outdoor:true,regionId:'main'}:kind?{kind}:null;};
 const answer=value=>{dialog.input.value=value;for(const f of dialog.events.submit)f({preventDefault(){}});};
 return {c,h,real,api,dialog,els,canvas,click,room,tick,answer,key,get harbourRequests(){return harbourRequests;},get roomRequests(){return roomRequests;},get speech(){return speech;}};
}
for(const ch of [1,2,3]){const h=adapter(ch);assert.equal(h.api.cast,undefined);assert(!h.els.length,'no early fishing controls, money or questions');}
for(const ch of [4,5]){
 const h=adapter(ch),p=h.real.p,api=h.api;
 const known=h.c.UPPDRAG_RECALL_BANK.find(t=>t.chapter===ch&&t.rank===0&&t.kind==='fields'&&t.fields?.length===1&&t.fields[0].answers?.length);assert(known);p.state.encountered.push(known.id);
 const kept=copy({record:p.state.record,earned:p.state.earned,apples:p.state.apples,review:p.state.reviewQueue,mastery:h.real.m.snapshot().state});
 assert.equal(api.shop(),false);assert(api.travel());assert.equal(h.harbourRequests,1);assert.equal(h.c.interior,null,'a travel request does not teleport or open the shop');
 h.room('quay');h.key('keydown',' ');h.key('keyup',' ');assert(h.dialog.open,'real Space opens the physical rod purchase');h.click('buy');assert.equal(p.state.daler,2);assert(api.snapshot.state.rod);assert.equal(h.dialog.open,false);
 assert.equal(api.cast(),false,'fishing is no longer performed in the harbour close-up');
 h.room(null);const from=copy(h.c.player);assert(api.travel());assert(h.c.path.length);assert.deepEqual(copy(h.c.player),from,'finding a bank sets a walking route, without teleporting');
 let last=from;for(const point of h.c.path){assert(h.c.UPPDRAG_WORLD_KEYBOARD.clearSegment(h.c.region,last,point,24),'every step to the bank is walkable');last=point;}
 h.c.player={...last};h.c.path=[];h.tick();assert(api.spot());assert.equal(api.snapshot.phase,'idle','arrival waits for the player to cast');
 const painter={getTransform:()=>({a:1,b:0,c:0,d:1,e:0,f:0})};h.c.UPPDRAG_WORLD_LIFE.draw(painter,{region:h.c.region});
 let consumed=false;const water=api.spot().water,pointer=(type,x,y)=>{for(const f of h.canvas.events[type]||[])f({clientX:x,clientY:y,preventDefault(){consumed=true;},stopImmediatePropagation(){}});};
 pointer('pointerdown',water.x,water.y);pointer('pointerup',water.x,water.y);assert(consumed);assert(h.c.path.length,'a water click creates a physical walking route');
 const clickRoute=h.c.path;consumed=false;pointer('pointerdown',water.x,water.y);pointer('pointerup',water.x+40,water.y+40);assert.equal(consumed,false,'dragging across water keeps normal map panning');assert.equal(h.c.path,clickRoute);
 let talked=0;h.c.UPPDRAG_WORLD_LIFE.people=()=>[{id:'nearby-person',x:h.c.player.x+8,y:h.c.player.y}];h.c.requestPerson=()=>{talked++;return true;};h.key('keydown',' ');h.key('keyup',' ');assert.equal(talked,1,'a nearby person retains the normal Space interaction');assert.equal(api.snapshot.phase,'idle');h.c.UPPDRAG_WORLD_LIFE.people=()=>[];
 const available=new Set(p.repetitionTaskIds),eligible=h.c.UPPDRAG_RECALL_BANK.filter(t=>available.has(t.id)&&t.chapter<=ch&&t.rank===0&&t.kind==='fields'&&t.fields?.length===1&&t.fields[0].answers?.length),target=eligible.findIndex(t=>h.c.UPPDRAG_RECALL_BANK.some(x=>x.chapter===t.chapter&&x.topic===t.topic&&x.rank===2));assert(target>=0);h.c.Math=Object.create(Math);h.c.Math.random=()=>(target+.1)/eligible.length;
 h.key('keydown',' ');assert.equal(api.snapshot.phase,'waiting');h.key('keydown',' ',true);assert.equal(api.snapshot.phase,'waiting','held Space cannot immediately reel in');h.key('keyup',' ');for(let i=0;i<60&&api.snapshot.phase==='waiting';i++)h.tick();assert.equal(api.snapshot.phase,'question');assert(h.dialog.open);assert(h.dialog.innerHTML.includes('fishingAnswer'));assert(!h.dialog.innerHTML.includes('<select'));
 const selected=h.c.UPPDRAG_RECALL_BANK.find(t=>t.id===api.snapshot.taskId);assert(p.repetitionTaskIds.includes(selected.id));assert(selected.chapter<=ch);
 const higher=h.c.UPPDRAG_RECALL_BANK.find(t=>t.chapter===selected.chapter&&t.topic===selected.topic&&t.rank===2);assert(higher);p.state.recallRutFocus=[higher.id];h.answer('Jag minns inte');assert.equal(api.fishCount,0);assert.deepEqual(copy(p.state.recallRutFocus),[higher.id]);assert(h.dialog.innerHTML.includes('Ett exempel på rätt svar'));h.click('close');
 assert(api.cast());const shore=api.spot();h.c.player.x-=Math.cos(shore.heading)*18;h.c.player.y-=Math.sin(shore.heading)*18;h.tick();assert.equal(api.snapshot.phase,'idle','walking away reels in without a free catch');assert.equal(api.fishCount,0);
 h.c.player={...last};
 assert(api.cast());for(let i=0;i<60&&api.snapshot.phase==='waiting';i++)h.tick();const t=h.c.UPPDRAG_RECALL_BANK.find(t=>t.id===api.snapshot.taskId);h.answer(t.fields[0].sample);assert.equal(api.fishCount,0);assert.equal(api.snapshot.phase,'reeling');assert.equal(h.dialog.open,false,'the answer closes so the real map and pulling animation are visible');h.answer(t.fields[0].sample);assert.equal(api.snapshot.phase,'reeling');
 h.tick();assert(h.els.find(e=>e.id==='fishingHint').textContent.includes('Helt rätt!'));assert(api.blocking);
 h.key('keydown',' ');assert(api.snapshot.pullMs>0);h.key('keydown',' ',true);assert.equal(api.snapshot.phase,'reeling','holding Space cannot count as two pulls');h.key('keyup',' ');
 for(let i=0;i<12;i++)h.tick();assert.equal(api.snapshot.phase,'reeling');assert.equal(api.snapshot.pullMs,0);assert(h.els.find(e=>e.id==='fishingHint').textContent.includes('Fisken är kvar'));
 h.key('keydown',' ');h.key('keyup',' ');h.key('keydown',' ');h.key('keyup',' ');assert.equal(api.snapshot.phase,'landing');assert.equal(api.fishCount,0);h.tick();
 const calls=[],draw=new Proxy({getTransform:()=>({a:1,b:0,c:0,d:1,e:0,f:0})},{get:(o,k)=>k in o?o[k]:(...a)=>calls.push([k,...a]),set:(o,k,v)=>(o[k]=v,true)});
 h.c.UPPDRAG_WORLD_LIFE.draw(draw,{region:h.c.region});assert(calls.some(a=>a[0]==='ellipse'&&a[3]===11),'the landed fish body is drawn');assert(calls.some(a=>a[0]==='quadraticCurveTo'),'the rod and line are drawn during landing');
 for(let i=0;i<8;i++)h.tick();assert.equal(api.fishCount,1);assert(h.dialog.open);assert(h.dialog.innerHTML.includes('ett äpple per fisk'));h.key('keydown',' ');h.key('keyup',' ');assert.equal(api.fishCount,1,'more taps cannot duplicate a landed fish');h.click('close');
 h.tick();assert(h.els.find(e=>e.id==='fishingHint').textContent.includes('1 fisk i korgen'),'the waiting hint is replaced after a successful catch');assert(api.journalHTML().includes('1 fisk i korgen'));
 assert.equal(api.deliver(),false);h.room('barnhus');assert(api.deliver());assert.equal(p.state.daler,2);assert.equal(p.state.apples,kept.apples+1);assert.equal(api.fishCount,0);assert.equal(api.deliver(),false);assert.equal(p.state.daler,2);assert.equal(p.state.apples,kept.apples+1);assert(h.speech.lines[0][1].includes('Här får du ett äpple'));
 assert.deepEqual(copy({record:p.state.record,earned:p.state.earned,apples:p.state.apples-1,review:p.state.reviewQueue,mastery:h.real.m.snapshot().state}),kept,'delivery gives exactly one apple and preserves knowledge progress');
 assert(JSON.parse(h.h.memory.get('uppdrag1700.fishing.v1')).rod);assert(p.state.fishingRodReceipt);assert.equal(Object.keys(p.state.fishingPayments).length,1);
 console.log('PASS real chapter '+ch+': real known bank question, short written recall, failed-answer Rut priority, exact currency, physical kitchen, saved equipment and preserved mastery');
 h.room(null);assert(api.cast());for(let i=0;i<60&&api.snapshot.phase==='waiting';i++)h.tick();h.answer(h.c.UPPDRAG_RECALL_BANK.find(t=>t.id===api.snapshot.taskId).fields[0].sample);
 const button=h.els.find(e=>e.id==='fishingAction');h.tick();assert(!button.hidden);for(const f of button.events.click)f();assert.equal(api.snapshot.phase,'reeling');for(const f of button.events.click)f();assert.equal(api.snapshot.phase,'landing','touch/click uses the same two-pull mechanic');
 h.c.document.hidden=true;for(let i=0;i<20;i++)h.tick();assert.equal(api.fishCount,0,'hidden document cannot finish landing');h.c.document.hidden=false;for(let i=0;i<8;i++)h.tick();assert.equal(api.fishCount,1);h.click('close');
}
{
 const h=adapter(4,true),p=h.real.p;p.state.daler=3;h.tick();assert(h.dialog.open);assert(h.dialog.innerHTML.includes('12 testdaler'));assert.equal(p.state.daler,3,'test credit waits for explicit start');h.click('demo');assert.equal(p.state.daler,12);assert(p.state.fishingDemoGranted);assert.equal(h.harbourRequests,1);assert(p.repetitionTaskIds.length>=3,'the three visibly introduced test memories enter the genuine available pool');h.click('demo');assert.equal(p.state.daler,12);assert.equal(p.state.record.length,0);assert(!h.real.m.chapterComplete());
 console.log('PASS isolated demonstration: explicit 12 testdaler once, visible memory recap, actual known-question pool, no manufactured stamps or answers');
}
for(const name of ['world-keyboard-ch4.js','world-keyboard-ch5.js','meeting-ch4-pilot.js','meeting-ch5-pilot.js']){
 const ctx={window:{}};vm.createContext(ctx);for(const n of ['chapter4-presentation.js','chapter5-presentation.js','hat-shop.js','orchard.js','fishing.js','scene-presence.js'])vm.runInContext(read(n),ctx);
 let text=ctx.window['UPPDRAG_CH'+(name.includes('ch4')?4:5)+'_PRESENTATION'].source(name,read('_decoded/'+name));for(const api of ['UPPDRAG_HAT_SHOP','UPPDRAG_FISHING','UPPDRAG_ORCHARD','UPPDRAG_SCENE_PRESENCE'])text=ctx.window[api].source(name,text);new Function(text);
}
const integration=read('integration.js');assert(integration.includes('const fishing=[4,5].includes(ch)?'));assert(integration.includes("+fishing+'\\n'"));assert(integration.includes("!lessonLimit&&chapterTest===4&&params.get('fiske')==='test'"));
console.log('PASS integration: fishing starts in four, keyboard adapters compose and test funding is excluded from class links');
