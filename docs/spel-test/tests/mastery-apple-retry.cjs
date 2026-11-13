'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),zlib=require('zlib'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const scripts=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz')))).scripts;
class Element{
 constructor(){this.children=[];this.dataset={};this.hidden=false;this.innerHTML='';this.style={};this.events={};this.classList={add(){},remove(){},toggle(){}};}
 append(...n){this.children.push(...n);}setAttribute(){}focus(){}querySelector(){return null;}querySelectorAll(){return [];}addEventListener(n,f){this.events[n]=f;}
}
function fixture(ch,prior=new Map(),lessonLimit=ch<=2?2:0,options={}){
 const memory=new Map(prior),stage=new Element(),document={head:new Element(),body:new Element(),createElement:()=>new Element(),getElementById:()=>null};
 const c={document,stage,roomView:new Element(),roomFooter:new Element(),interior:null,region:{id:'main',buildings:[]},console,
  __INTEGRATED_CHAPTER:ch,__UPPDRAG_LESSON_ONLY:lessonLimit,addEventListener(){},setMessage(){},leaveInterior(){c.interior=null;},requestInterior(){},requestHarbour(){},
  localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,String(v))}};c.window=c;vm.createContext(c);
 for(const name of ['recall-bank.js','recall-assessment.js'])vm.runInContext(scripts[name],c);
 for(const name of ['questions/fixes.js','questions/alignment.js','questions/power-language.js','gameplay-tuning.js','mastery-recall-adapter.js','mastery-progression.js','mastery-review-recovery.js'])vm.runInContext(read(name),c);
 if(ch>=4)for(const suffix of ['material','review'])vm.runInContext(read('questions/chapter'+ch+'-'+suffix+'.js'),c);
 let flow=c.UPPDRAG_MASTERY_RECALL.source(c.UPPDRAG_GAMEPLAY_TUNING.source('recall-flow.js',scripts['recall-flow.js'])),pilot=read('chapter'+ch+'-mastery.js');
 if(options.selfPractice){c.UPPDRAG_PROMPT_ALIGNMENT.install();vm.runInContext(read('self-practice.js'),c);flow=c.UPPDRAG_SELF_PRACTICE.source('recall-flow.js',flow);pilot=c.UPPDRAG_SELF_PRACTICE.source('chapter'+ch+'-mastery.js',pilot);flow=c.UPPDRAG_PROMPT_ALIGNMENT.flow(flow);if(ch<=2){vm.runInContext(read('pupil-language.js'),c);flow=c.UPPDRAG_PUPIL_LANGUAGE.flow(flow);}flow=c.UPPDRAG_SELF_PRACTICE.copy(flow);}
 vm.runInContext(flow,c);vm.runInContext(pilot,c);
 const p=c['UPPDRAG_CH'+ch+'_PILOT'],modal=stage.children.find(x=>x.id==='ch1Modal');
 function action(name){modal.events.click({target:{closest:sel=>sel==='[data-mb]'?{dataset:{mb:name}}:null}});}
 function room(place){c.interior={kind:place,name:({archive:'Arkivet',church:'Kyrkan',barnhus:'Barnhuset',palace:'Slottet',riksdag:'Riksdagshuset',cafe:'Kaffehuset'})[place]||place};}
 return {c,p,modal,memory,action,room,m:c.UPPDRAG_MASTERY};
}
module.exports={fixture};
if(require.main===module){
for(const ch of [1,2,3,4,5]){
 let h=fixture(ch),{p,m}=h;
 const area=m.snapshot().config.areas[0];h.room(area.p);p.selectArea(area.id,'learner');p.enterMemory();
 assert.equal(m.snapshot().state.areas[area.id].learner.status,'in-progress','entered the real room before starting');const t=p.recall.current;assert(t,'actual chapter task');
 for(let i=0;i<t.fields.length;i++)p.recall.input({target:{dataset:{rcField:String(i)},value:'Jag funderar vidare på frågan.'}});
 p.recall.action('rc-submit');assert.equal(p.recall.ui.phase,'review');
 const oldTrial=p.state.trial,answer=copy(p.recall.ui.drafts);p.state.apples=0;
 p.recall.action('rc-revise');assert.equal(p.state.trial,oldTrial);assert.equal(p.state.apples,0);assert.equal(p.recall.ui.phase,'review');
 assert(h.modal.innerHTML.includes('rc-revise" disabled'),'zero-apple edit is visibly disabled');
 p.recall.action('rc-save-review');assert.equal(m.snapshot().state.areas[area.id].learner.status,'pending');
 assert(h.modal.innerHTML.includes('Ändra mitt svar · 1 äpple'));assert(h.modal.innerHTML.includes('Öva'),'practice route remains visible');
 h.action('revise');assert.equal(m.snapshot().state.areas[area.id].learner.status,'pending');assert.equal(p.state.apples,0);
 const preserved=copy({record:p.state.record,earned:p.state.earned,daler:p.state.daler});
 h.room('archive');assert.equal(p.enterArchive(),true,'Rut is available with no apples and a pending test');
 let guard=0;while(p.state.archiveMode!=='reward'){
  assert(++guard<15);const task=p.recall.current;
  task.fields.forEach((f,i)=>p.recall.input({target:{dataset:{rcField:String(i)},value:f.sample}}));
  p.recall.action('rc-submit');assert.equal(p.recall.ui.result.status,'right',task.id);p.recall.action('rc-next');
 }
 assert.equal(p.state.apples,1,'only real completed practice supplies an apple');
 assert.deepEqual(copy({record:p.state.record,earned:p.state.earned,daler:p.state.daler}),preserved);
 assert.equal(m.snapshot().state.areas[area.id].learner.status,'pending','practice is not a stamp');
 if(ch<=2){
  p.recall.action('rc-rut-again');let n=0;
  while(p.state.archiveMode!=='reward'){assert(++n<15);const task=p.recall.current;task.fields.forEach((f,i)=>p.recall.input({target:{dataset:{rcField:String(i)},value:f.sample}}));p.recall.action('rc-submit');assert.equal(p.recall.ui.result.status,'right');p.recall.action('rc-next');}
  assert.equal(p.state.apples,1,'repeated practice does not exceed the classroom apple limit');
 }
 p.close();h.room(area.p);p.selectArea(area.id,'learner');h.action(ch<=2?'practice-retry':'revise');
 assert.equal(p.state.apples,0);assert.equal(p.state.trial,oldTrial+1);assert.equal(p.state.index,0);assert(p.recall.ui.drafts.every(x=>x===''),'fresh answer fields');
 assert.equal(m.snapshot().state.areas[area.id].learner.status,'in-progress');
 assert(p.state.reviewQueue.some(x=>x.resolved==='apple-retry'&&JSON.stringify(x.answer)===JSON.stringify(answer)),'the original response is preserved');
 assert.deepEqual(copy({record:p.state.record,earned:p.state.earned,daler:p.state.daler}),preserved);
 const history=copy(m.snapshot().state.history);h.action('revise');h.action('retry');assert.equal(p.state.apples,0);assert.deepEqual(copy(m.snapshot().state.history),history,'duplicate actions cannot charge or reopen again');
 p.persist();h=fixture(ch,h.memory);assert.equal(h.p.state.apples,0);assert.equal(h.p.state.trial,oldTrial+1,'paid restart survives reload');
 h.room('archive');assert.equal(h.p.enterArchive(),true,'Rut can always be revisited');
 console.log('PASS chapter '+ch+': no free revision, real Rut practice, one-apple whole-test retry, saved answer, no duplicate charge and reload');
}
for(const ch of [1,2,3,4,5]){
 const h=fixture(ch),p=h.p,area=h.m.snapshot().config.areas[0];h.room(area.p);p.selectArea(area.id,'learner');p.enterMemory();
 p.recall.current.fields.forEach((f,i)=>p.recall.input({target:{dataset:{rcField:String(i)},value:'Jag funderar vidare på frågan.'}}));p.recall.action('rc-submit');assert.equal(p.recall.ui.phase,'review');
 p.state.apples=1;const trial=p.state.trial;p.recall.action('rc-revise');
 assert.equal(p.state.apples,0);assert.equal(p.state.trial,trial+1);assert.equal(p.state.index,0);assert.equal(p.recall.ui.phase,'question');assert.equal(p.state.reviewQueue.at(-1).resolved,'apple-retry');
 p.recall.action('rc-revise');assert.equal(p.state.trial,trial+1);assert.equal(p.state.apples,0);
}
console.log('PASS paid edit directly from the real recall engine in all five chapters');

}
