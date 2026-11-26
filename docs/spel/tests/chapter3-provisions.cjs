'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const c={};c.window=c;vm.createContext(c);vm.runInContext(read('chapter3-provisions-model.js'),c);const M=c.UPPDRAG_CH3_PROVISIONS_MODEL;
assert.equal(M.price,5);assert.equal(M.reward,1);
for(const start of [0,4,5,17]){
 const state={daler:start,apples:0,record:[{answer:['Mitt svar']}],earned:{kept:true}};let shop=false,square=false,saved,model;
 model=M.create(state,{atWagon:()=>shop,atSquare:()=>square,save(){saved=copy(state);assert.equal(model.buy().reason,'busy');assert.equal(model.deliver().reason,'busy');}});
 assert.equal(model.buy().reason,'away');shop=true;
 if(start<5){assert.equal(model.buy().reason,'funds');assert.equal(state.daler,start);continue;}
 assert.equal(model.buy().paid,5);assert.equal(state.daler,start-5);assert.equal(state.apples,0);assert.equal(model.buy().reason,'carrying');assert.equal(model.deliver().reason,'away');
 const reloaded=copy(saved),restored=M.create(reloaded,{atWagon:()=>true,atSquare:()=>square,save:()=>saved=copy(reloaded)});assert(restored.snapshot().carrying);square=true;
 assert.equal(restored.deliver().apples,1);assert.equal(reloaded.apples,1);assert.equal(reloaded.daler,start-5);assert.equal(restored.deliver().reason,'empty');assert.equal(restored.snapshot().delivered,1);
 assert.deepEqual(reloaded.record,state.record);assert.deepEqual(reloaded.earned,state.earned);assert.equal(M.create(copy(saved)).snapshot().carrying,null);
}
const {fixture:worldFixture}=require('./apple-threats-world.cjs'),{fixture:pilotFixture}=require('./mastery-apple-retry.cjs');
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.hidden=false;this.open=false;this.style={};this.textContent='';this.status={textContent:''};}
 append(...n){this.children.push(...n);}setAttribute(){}addEventListener(n,f){(this.events[n]??=[]).push(f);}querySelector(s){return s==='#provisionsStatus'?this.status:{focus(){}};}focus(){}showModal(){this.open=true;}close(){this.open=false;for(const f of this.events.close||[])f();}
}
{
 const world=worldFixture(null,3),real=pilotFixture(3),v=world.c,p=real.p,els=[],footer=new Element(),canvas=new Element('canvas'),oldGet=v.document.getElementById;
 v.document.createElement=tag=>{const e=new Element(tag);els.push(e);return e;};v.document.getElementById=id=>id==='worldFooter'?footer:['world','interiorCanvas'].includes(id)?canvas:oldGet(id);v.document.querySelector=()=>null;
 v.roomFooter=new Element();v.roomView=new Element();v.region=v.testRegion;v.player={...v.testNavigation(v.region,'square')};v.interior=null;v.voyage=null;v.sailing=null;v.path=[];v.setMessage=()=>{};v.UPPDRAG_CH3_PILOT=p;p.state.daler=17;p.state.apples=0;
 v.UPPDRAG_MEETINGS.state={talking:false};v.UPPDRAG_HAT_SHOP={busy:false};let travel=0,thanks=null;
 const point={x:3110,y:397,region:'main'};
 v.UPPDRAG_EVENT_ENGINE={busy:false,wagonShopPoint:point,register:()=>true,travelWagon(){travel++;const route=v.UPPDRAG_EVENT_APPROACH.routeBetween(v.region,v.player,{x:3040,y:367},id=>v.testNavigation(v.region,id),(a,b)=>v.UPPDRAG_WORLD_KEYBOARD.clearSegment(v.region,a,b,12),true);assert(route?.length);v.path=route;return true;},speakRoom:s=>thanks=s};
 v.UPPDRAG_CH3_SCENES={drawProps(){},personPose(){},travel(p){assert.equal(p,'square');return true;}};v.UPPDRAG_MEETINGS.drawMapPlayer=()=>{};
 vm.runInContext(read('chapter3-provisions-model.js'),v);vm.runInContext(read('chapter3-provisions.js'),v);
 const api=v.UPPDRAG_CH3_PROVISIONS,dialog=els.find(e=>e.tag==='dialog'),before=copy({record:p.state.record,earned:p.state.earned,mastery:real.m.snapshot().state,review:p.state.reviewQueue}),start=copy(v.player);
 assert.equal(api.shop(),true);assert.equal(travel,1);assert.equal(dialog.open,false);assert.deepEqual(copy(v.player),start,'travel cannot teleport or debit');assert.equal(p.state.daler,17);
 v.player={x:3040,y:367};v.path=[];assert(api.shop());assert(dialog.open);
 const click=code=>dialog.events.click.forEach(f=>f({target:{closest:()=>({dataset:{provisions:code}})}}));click('buy');assert.equal(p.state.daler,12);assert(api.snapshot.carrying);click('buy');assert.equal(p.state.daler,12);
 assert.equal(api.deliver(),false,'no remote hand-in');click('close');assert(!dialog.open);
 const persisted=real.memory.get(p.saveKey);assert(persisted&&JSON.parse(persisted).provisions.carrying,'the paid parcel is in the same saved record as the purse');
 v.interior={kind:'square'};assert(api.deliver());assert.equal(p.state.apples,1);assert.equal(p.state.daler,12);assert.equal(api.snapshot.carrying,null);assert.equal(thanks.lines[0][0],'Bonden');assert.equal(api.deliver(),false);
 assert.deepEqual(copy({record:p.state.record,earned:p.state.earned,mastery:real.m.snapshot().state,review:p.state.reviewQueue}),before,'the trade never changes mastery or answers');
 v.interior=null;v.player={x:3040,y:367};assert(api.shop());assert(dialog.open);v.document.hidden=true;click('buy');assert.equal(p.state.daler,12,'a background page cannot buy');
}
// Compose all world-keyboard adapters in the same order used by integration.
{
 const ctx={};ctx.window=ctx;vm.createContext(ctx);for(const f of ['chapter3-presentation.js','hat-shop.js','hat-reactions.js','orchard.js','scene-presence.js'])vm.runInContext(read(f),ctx);
 let source=read('_decoded/world-keyboard-ch3.js');source=ctx.UPPDRAG_CH3_PRESENTATION.source('world-keyboard-ch3.js',source);for(const a of ['UPPDRAG_HAT_SHOP','UPPDRAG_HAT_REACTIONS','UPPDRAG_ORCHARD','UPPDRAG_SCENE_PRESENCE'])source=ctx[a].source('world-keyboard-ch3.js',source);new vm.Script(source);assert(source.includes('UPPDRAG_CH3_PROVISIONS?.busy'));
}
console.log('PASS provision trade: exact 5-to-1 exchange, physical wagon and square, one parcel, atomic pilot save/reload, no double charges/rewards, preserved answers/mastery and composed keyboard hooks');
