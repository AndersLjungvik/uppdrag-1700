'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const {fixture}=require('./mastery-apple-retry.cjs');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const integration=read('integration.js'),preamble=integration.slice(integration.indexOf("'use strict';"),integration.indexOf('function showError('));
const ROOT='uppdrag1700.integrated.20261023.v1.',original=ROOT+'lesson.1.play.',practice=ROOT+'self-practice.lesson.1.play.';
function boot(query,memory){
 const c={document:{getElementById:()=>({})},location:{search:query},URLSearchParams,UPPDRAG_AMBIENT_UI:{install(){}},localStorage:{get length(){return memory.size;},key:i=>[...memory.keys()][i],getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)}};c.window=c;vm.createContext(c);vm.runInContext(preamble+'window.test={selfPractice,prefix,read,write,initialChapter,available};',c);return c.test;
}
for(const version of ['2.7.1','2.9.0']){
 const saved=new Map([[original+'lastChapter','4'],[original+'uppdrag1700.answer','{"draft":"Mitt svar","pending":true}'],[original+'uppdrag1700.mastery.v1.ch4','{"v":1,"areas":{},"history":[{"approved":true}]}']]),before=[...saved];
 const a=boot('?only=1&chapter=1&v='+version,saved);assert(a.selfPractice);assert.equal(a.prefix(),practice);assert.equal(a.initialChapter(),4);
 for(const[k,v]of before){assert.equal(saved.get(k),v);assert.equal(saved.get(practice+k.slice(original.length)),v,'first practice copies every saved value exactly');}
 a.write('uppdrag1700.answer','{"draft":"Ny träning"}');const updated=[...saved];const b=boot('?only=4&chapter=4&v='+version,saved);assert.equal(b.read('uppdrag1700.answer'),'{"draft":"Ny träning"}');assert.deepEqual([...saved],updated,'reload never overwrites newer practice');
 for(const[k,v]of before)assert.equal(saved.get(k),v,'practice writes never change the assessed save');
 for(let chapter=5;chapter<=10;chapter++)assert.equal(b.available(chapter),false);
 const ordinary=boot('?chapter=1',saved);assert.equal(ordinary.selfPractice,false);assert.equal(ordinary.prefix(),ROOT+'play.');
}
for(const ch of [1,2,3,4,5]){
 // A genuine saved teacher-review block must become an actionable comparison.
 const old=fixture(ch),a=old.m.snapshot().config.areas[0];old.room(a.p);old.p.selectArea(a.id,'learner');old.p.enterMemory();
 old.p.recall.current.fields.forEach((f,i)=>old.p.recall.input({target:{dataset:{rcField:String(i)},value:'Min förklaring med egna ord.'}}));old.p.recall.action('rc-submit');old.p.recall.action('rc-save-review');old.p.state.apples=0;old.p.persist();
 assert.equal(old.m.snapshot().state.areas[a.id].learner.status,'pending');const before=[...old.memory];
 const h=fixture(ch,old.memory,4,{selfPractice:true});h.room(a.p);h.p.selectArea(a.id,'learner');h.p.enterMemory();
 assert(h.modal.innerHTML.includes('data-mb="self-continue"'));assert(!h.modal.innerHTML.includes('mbTeacher'));h.action('self-continue');
 assert.equal(h.p.recall.ui.phase,'feedback');assert.equal(h.p.state.apples,0);assert.equal(h.p.state.record.at(-1).assessment,'self-checked-practice');assert.equal(h.p.state.record.at(-1).ok,false);assert.equal(h.p.state.record.at(-1).independent,false);
 const n=h.p.state.record.length;h.action('self-continue');h.p.recall.action('rc-practice-next');assert.equal(h.p.state.record.length,n,'repeated clicks cannot duplicate a comparison');assert.deepEqual([...old.memory],before);
 // Complete every real area and level without a teacher action or code.
 const run=fixture(ch,new Map(),4,{selfPractice:true}),areas=run.m.snapshot().config.areas;
 for(const level of ['learner','journeyman','master'])for(const area of areas){
  run.room(area.p);if(area.p==='quay')Object.assign(run.c.interior,{outdoor:true,regionId:'main'});assert(run.p.selectArea(area.id,level));run.p.enterMemory();let count=0;
  while(run.m.snapshot().state.areas[area.id][level].status!=='clear'){
   assert(++count<20,'practice must make forward progress in chapter '+ch+' '+area.id+' '+level);
   const task=run.p.recall.current;assert(task,JSON.stringify({ch,area:area.id,level,mode:run.p.state.mode,step:run.p.state.step,index:run.p.state.index,html:run.modal.innerHTML.slice(0,300)}));task.fields.forEach((f,i)=>run.p.recall.input({target:{dataset:{rcField:String(i)},value:f.sample}}));run.p.recall.action('rc-submit');
   if(run.p.recall.ui.phase==='review'){
    assert(!run.modal.innerHTML.includes('mbTeacher'));const apples=run.p.state.apples;run.p.recall.action('rc-practice-revise');assert.equal(run.p.recall.ui.phase,'question');assert.equal(run.p.state.apples,apples,'revision during self practice is free');
    run.p.recall.action('rc-submit');run.p.recall.action('rc-practice-next');
   }
   assert.equal(run.p.recall.ui.phase,'feedback');assert.notEqual(run.m.snapshot().state.areas[area.id][level].status,'pending');run.p.recall.action('rc-next');
  }
 }
 assert(run.m.chapterComplete());assert(!run.p.state.record.some(e=>e.assessment==='teacher-approved'),'no fabricated teacher assessment');
 assert(run.p.state.record.some(e=>e.assessment==='self-checked-practice'||e.support),'real responses still retain support information');
 console.log('PASS self practice chapter '+ch+': saved review unblocked, no code, free editing, duplicate protection, every real area and level completed with explicit answer provenance');
}
console.log('PASS class bookmarks: isolated one-time copy, exact original saves, practice reload and chapters 5–10 remain closed');
