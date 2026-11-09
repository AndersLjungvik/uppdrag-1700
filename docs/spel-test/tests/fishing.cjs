'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const c={window:{}};vm.createContext(c);vm.runInContext(read('fishing-model.js'),c);vm.runInContext(read('fishing.js'),c);const M=c.window.UPPDRAG_FISHING_MODEL;
function harness(raw={},balance=12){let saved,near=true,kitchen=false,payments=0,debits=0,now=0;const practice=[];
 const model=M.create(raw,{save:s=>saved=copy(s),wallet:()=>balance,atShop:()=>near,atWater:()=>near,atKitchen:()=>kitchen,random:()=>0,
 debit(n,expected){assert.equal(balance,expected);debits++;assert.equal(model.buy().reason,'busy');balance-=n;return true;},credit(n){payments++;balance+=n;return true;},practice:id=>practice.push(id)});
 const tick=(cfg={})=>{now+=100;return model.tick(now,cfg);};
 const bite=(ch=4,id='known')=>{assert(model.cast(ch,id).ok);for(let i=0;i<40&&model.snapshot().phase==='waiting';i++)tick();assert.equal(model.snapshot().phase,'question');};
 return {model,tick,bite,practice,set near(v){near=v;},set kitchen(v){kitchen=v;},get saved(){return saved;},get balance(){return balance;},get payments(){return payments;},get debits(){return debits;}};
}
{
 const poor=harness({},9);assert.equal(poor.model.buy().reason,'funds');assert.equal(poor.balance,9);
 const h=harness();h.near=false;assert.equal(h.model.buy().reason,'away');h.near=true;assert.equal(h.model.buy().paid,10);assert.equal(h.balance,2);assert.equal(h.model.buy().paid,0);assert.equal(h.debits,1);
 h.bite();assert.equal(h.model.submit(false,'minns inte').reason,'practice');assert.deepEqual(h.practice,['known']);assert.equal(h.saved.fish.length,0);h.model.close();
 assert(h.model.cast(4,'known').ok);for(let i=0;i<50;i++)h.tick({paused:true});assert.equal(h.model.snapshot().phase,'waiting');h.tick({present:false});assert.equal(h.model.snapshot().phase,'idle');assert.equal(h.model.submit(true).reason,'inactive');
 h.bite();const restored=harness(h.saved);assert(restored.model.snapshot().state.rod);assert.equal(restored.model.snapshot().phase,'idle');assert.equal(restored.model.submit(true).reason,'inactive','reload cannot turn waiting into a catch');
 h.model.submit(true,'rätt');assert.equal(h.model.snapshot().state.fish.length,1);assert.equal(h.model.submit(true).reason,'inactive');h.model.close();
 assert.equal(h.model.deliver(4).reason,'away');h.kitchen=true;assert.equal(h.model.deliver(4).amount,1);assert.equal(h.balance,3);assert.equal(h.model.deliver(4).reason,'empty');assert.equal(h.payments,1);
 for(let i=0;i<2;i++){h.bite();h.model.submit(true);h.model.close();assert.equal(h.model.deliver(4).amount,1);}
 assert.equal(h.model.snapshot().state.chapters[4].delivered,3);assert.equal(h.balance,5);
 h.bite();assert.equal(h.model.submit(true).reason,'released');assert.equal(h.model.snapshot().state.fish.length,0);h.model.close();assert.equal(h.model.deliver(4).reason,'limit');assert.equal(h.payments,3);
 const next=harness(h.saved,5);next.bite(5);assert.equal(next.model.submit(true).reason,'caught');assert(next.model.snapshot().state.rod);assert.equal(next.debits,0,'equipment is retained across chapters');
 console.log('PASS fishing economy: 10-daler permanent rod, physical trades, insufficient funds, no double debit, bounded delivery, correct/wrong/released catches, interruption, pause and reload');
}
const {fixture:worldFixture}=require('./apple-threats-world.cjs'),{fixture:pilotFixture}=require('./mastery-apple-retry.cjs');
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.style={};this.hidden=false;this.open=false;this.innerHTML='';this.input={value:'',focus(){}};this.button={focus(){}};}
 append(...n){this.children.push(...n);}setAttribute(){}addEventListener(n,f){(this.events[n]??=[]).push(f);}focus(){}closest(){return null;}
 querySelector(q){return q==='input'?this.input:q==='button'||q==='input,button:not([disabled])'?this.button:null;}showModal(){this.open=true;}close(){this.open=false;}
}
function adapter(ch,demo=false){
 const h=worldFixture(null,ch),real=pilotFixture(ch),c=h.c,els=[],canvas=new Element('canvas'),doc=c.document,oldGet=doc.getElementById;
 doc.createElement=tag=>{const e=new Element(tag);els.push(e);return e;};doc.getElementById=id=>['world','interiorCanvas'].includes(id)?canvas:oldGet(id);
 c.roomView=new Element();c.roomFooter=new Element();c.region=c.testRegion;c.player={...c.testNavigation(c.region,'square')};c.path=[];c.voyage=null;c.interior=null;c.__UPPDRAG_FISHING_TEST=demo;
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
 return {c,h,real,api,dialog,els,click,room,tick,answer,key,get harbourRequests(){return harbourRequests;},get roomRequests(){return roomRequests;},get speech(){return speech;}};
}
for(const ch of [1,2,3]){const h=adapter(ch);assert.equal(h.api.cast,undefined);assert(!h.els.length,'no early fishing controls, money or questions');}
for(const ch of [4,5]){
 const h=adapter(ch),p=h.real.p,api=h.api;
 const known=h.c.UPPDRAG_RECALL_BANK.find(t=>t.chapter===ch&&t.rank===0&&t.kind==='fields'&&t.fields?.length===1&&t.fields[0].answers?.length);assert(known);p.state.encountered.push(known.id);
 const kept=copy({record:p.state.record,earned:p.state.earned,apples:p.state.apples,review:p.state.reviewQueue,mastery:h.real.m.snapshot().state});
 assert.equal(api.shop(),false);assert(api.travel());assert.equal(h.harbourRequests,1);assert.equal(h.c.interior,null,'a travel request does not teleport or open the shop');
 h.room('quay');h.key('keydown',' ');h.key('keyup',' ');assert(h.dialog.open,'real Space opens the physical rod purchase');h.click('buy');assert.equal(p.state.daler,2);assert(api.snapshot.state.rod);assert.equal(h.dialog.open,false);
 const available=new Set(p.repetitionTaskIds),eligible=h.c.UPPDRAG_RECALL_BANK.filter(t=>available.has(t.id)&&t.chapter<=ch&&t.rank===0&&t.kind==='fields'&&t.fields?.length===1&&t.fields[0].answers?.length),target=eligible.findIndex(t=>h.c.UPPDRAG_RECALL_BANK.some(x=>x.chapter===t.chapter&&x.topic===t.topic&&x.rank===2));assert(target>=0);h.c.Math=Object.create(Math);h.c.Math.random=()=>(target+.1)/eligible.length;
 h.key('keydown',' ');assert.equal(api.snapshot.phase,'waiting');h.key('keydown',' ',true);assert.equal(api.snapshot.phase,'waiting','held Space cannot immediately reel in');h.key('keyup',' ');for(let i=0;i<60&&api.snapshot.phase==='waiting';i++)h.tick();assert.equal(api.snapshot.phase,'question');assert(h.dialog.open);assert(h.dialog.innerHTML.includes('fishingAnswer'));assert(!h.dialog.innerHTML.includes('<select'));
 const selected=h.c.UPPDRAG_RECALL_BANK.find(t=>t.id===api.snapshot.taskId);assert(p.repetitionTaskIds.includes(selected.id));assert(selected.chapter<=ch);
 const higher=h.c.UPPDRAG_RECALL_BANK.find(t=>t.chapter===selected.chapter&&t.topic===selected.topic&&t.rank===2);assert(higher);p.state.recallRutFocus=[higher.id];h.answer('Jag minns inte');assert.equal(api.fishCount,0);assert.deepEqual(copy(p.state.recallRutFocus),[higher.id]);assert(h.dialog.innerHTML.includes('Ett exempel på rätt svar'));h.click('close');
 assert(api.cast());for(let i=0;i<60&&api.snapshot.phase==='waiting';i++)h.tick();const t=h.c.UPPDRAG_RECALL_BANK.find(t=>t.id===api.snapshot.taskId);h.answer(t.fields[0].sample);assert.equal(api.fishCount,1);h.answer(t.fields[0].sample);assert.equal(api.fishCount,1);h.click('close');
 assert.equal(api.deliver(),false);h.room('barnhus');assert(api.deliver());assert.equal(p.state.daler,3);assert.equal(api.fishCount,0);assert.equal(api.deliver(),false);assert.equal(p.state.daler,3);assert(h.speech.lines[0][1].includes('Här får du 1 daler'));
 assert.deepEqual(copy({record:p.state.record,earned:p.state.earned,apples:p.state.apples,review:p.state.reviewQueue,mastery:h.real.m.snapshot().state}),kept,'fishing never awards a stamp or changes main answers/apples');
 assert(JSON.parse(h.h.memory.get('uppdrag1700.fishing.v1')).rod);assert(p.state.fishingRodReceipt);assert.equal(Object.keys(p.state.fishingPayments).length,1);
 console.log('PASS real chapter '+ch+': real known bank question, short written recall, failed-answer Rut priority, exact currency, physical kitchen, saved equipment and preserved mastery');
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
