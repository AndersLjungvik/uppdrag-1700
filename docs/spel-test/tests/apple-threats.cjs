'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const source=fs.readFileSync(path.join(__dirname,'../apple-threats-model.js'),'utf8');
const box={module:{exports:{}}};vm.createContext(box);vm.runInContext(source,box);const {create}=box.module.exports;
const copy=v=>JSON.parse(JSON.stringify(v));
function fixture(kind='dog',raw={}){
 let apples=1,now=0,point={x:0,y:0},saved,losses=0;
 const events=[],untouched={daler:17,stamps:{law:'clear'},answers:['Min egen förklaring'],letter:true};
 const model=create({quietMs:0,nextDistance:0,nextKind:kind,...raw},{save:s=>saved=s,event:(kind,outcome)=>events.push([kind,outcome]),loseApple(){if(!apples)return false;apples--;losses++;return true;}});
 const config={region:'main',apples:1,known:true,completedRound:0,clear:()=>true,route:(a,b)=>[{x:b.x,y:b.y}],canSee:()=>true,anchor:(kind,p)=>({home:{x:p.x+155,y:0,id:'tree-1'},post:{x:p.x+135,y:0}})};
 function tick(extra={},move=0){now+=80;point.x+=move;return copy(model.tick(now,point,{...config,apples,...extra}));}
 function wait(count,extra={}){for(let i=0;i<count;i++)tick(extra);return copy(model.snapshot());}
 tick();tick({},5);
 return {model,config,events,untouched,tick,wait,get saved(){return copy(saved);},get apples(){return apples;},set apples(v){apples=v;},get losses(){return losses;},get point(){return point;}};
}
for(const kind of ['dog','guard']){
 const h=fixture(kind),before=copy(h.untouched);
 assert.equal(h.model.snapshot().active.kind,kind);h.wait(35);assert.equal(h.losses,0,'three-second warning before any contact');
 if(kind==='guard'){
  const first=copy(h.model.snapshot().active.point);h.wait(85);assert.equal(h.losses,0,'guard does not chase a distant player');assert(Math.abs(h.model.snapshot().active.point.x-first.x)<25);
  for(let i=0;i<7;i++)h.tick({},10);
 }
 for(let i=0;i<180&&h.apples;i++)h.tick();
 assert.equal(h.apples,0,kind+' contact takes one real apple');assert.equal(h.losses,1);assert.equal(h.saved.needsRut,true);assert.equal(h.saved.nextKind,kind==='dog'?'guard':'dog');
 h.wait(800);assert.equal(h.losses,1,'no duplicate debit or new attack without an apple');assert.deepEqual(h.untouched,before,'coins, answers, stamps and story do not change');
 const restored=fixture(kind,h.saved);restored.apples=0;restored.wait(100);assert.equal(restored.losses,0,'reload never reapplies a debit');assert.equal(restored.model.snapshot().state.needsRut,true);
 // Neither visiting Rut nor importing an apple is a completed retrieval round.
 h.apples=1;h.wait(2,{completedRound:0});assert.equal(h.model.snapshot().state.needsRut,true);
 h.apples=0;h.wait(2,{completedRound:1});assert.equal(h.model.snapshot().state.needsRut,true,'completion without a reward cannot clear recovery');
 h.apples=1;h.wait(2,{completedRound:2});assert.equal(h.model.snapshot().state.needsRut,false);assert(h.model.snapshot().state.quietMs>44000);assert(h.model.snapshot().state.nextDistance>=h.model.snapshot().state.distance+690);
 const n=h.model.snapshot().state.encounters;h.wait(700,{completedRound:2});assert.equal(h.model.snapshot().state.encounters,n,'standing cannot spend the safe walking distance');
 for(let i=0;i<75;i++)h.tick({completedRound:2},10);
 assert.equal(h.model.snapshot().active.kind,kind==='dog'?'guard':'dog','the other kind returns after a new apple, rest and walking');
}
for(const shelter of ['house','conversation']){
 const h=fixture();h.tick({shelter});assert(!h.model.snapshot().active||h.model.snapshot().active.phase==='retreat');h.wait(200);assert.equal(h.apples,1);assert(h.events.some(x=>x[1]==='shelter'));
 const saved=h.saved,r=fixture('dog',saved);assert.equal(r.model.snapshot().active,null,'cooldown survives reload');
 const paused=fixture();paused.tick({shelter,paused:true});assert.equal(paused.model.snapshot().active.phase,'retreat','shelter ends pursuit while a dialogue pauses the clock');
 const remaining=paused.model.snapshot().state.quietMs;paused.wait(100,{shelter,paused:true});assert.equal(paused.model.snapshot().state.quietMs,remaining);assert.equal(paused.apples,1);
}
{
 const h=fixture();h.wait(40);h.wait(30,{canSee:()=>false});assert(h.events.some(x=>x[1]==='cover'));assert.equal(h.apples,1,'a tree or wall breaks pursuit');
}
{
 const h=fixture(),before=copy(h.model.snapshot().active);before.point.moving=false;h.wait(150,{paused:true});assert.deepEqual(copy(h.model.snapshot().active),before);h.wait(150,{hidden:true});assert.deepEqual(copy(h.model.snapshot().active),before);
 h.wait(40);const p=copy(h.model.snapshot().active.point);h.wait(20,{route:()=>null,clear:()=>false});assert.equal(h.apples,1);assert.equal(h.model.snapshot().active.point.x,p.x,'cannot walk through a blocked segment');
}
for(const extra of [{apples:0},{known:false},{otherThreat:true},{paused:true},{hidden:true},{region:'marstrand'}]){
 const h=fixture(); // Start a fresh, unarmed model for each condition.
 const m=create({quietMs:0,nextDistance:0},{loseApple(){throw Error('unsafe contact');}});let result;
 for(let i=0;i<100;i++)result=m.tick(i*80,{x:i*5,y:0},{...h.config,...extra});
 assert.equal(result.active,null,JSON.stringify(extra)+' cannot start a new encounter');
}
{
 const h=fixture(),before=copy(h.untouched);h.tick({},500);assert.equal(h.apples,1);assert.equal(h.model.snapshot().active,null,'teleports or map changes end the encounter safely');assert.deepEqual(h.untouched,before);
}
{
 const h=fixture();for(let i=0;i<400;i++)h.tick({},14);assert.equal(h.apples,1,'running away is an effective counterplay');assert(h.events.some(e=>e[1]==='evaded'));
}
for(const raw of [null,[],{quietMs:NaN,nextDistance:-100,nextKind:'unknown',history:{} }])assert.doesNotThrow(()=>create(raw));
{
 const m=create({quietMs:0,nextDistance:0}),config={region:'main',apples:1,known:true,completedRound:1};
 m.tick(0,{x:10,y:0},config);assert.equal(m.snapshot().state.quietMs,45000,'the first earned Rut apple also gives a safe journey');assert.equal(m.snapshot().state.nextDistance,700);
}
console.log('PASS apple threats: both physical losses, warnings and stationary guard, shelter/cover/escape, no walls or teleports, study/hidden/other-threat pause, one debit and saved recovery, actual completion signal required, safe rest and walk, alternating return, unchanged progress');
