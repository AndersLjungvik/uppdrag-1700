'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),zlib=require('zlib'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const frozen=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz')))).scripts;
class Element{
 constructor(){this.children=[];this.dataset={};this.hidden=false;this.innerHTML='';this.style={};this.events={};this.classList={add(){},remove(){},toggle(){}};}
 append(...n){this.children.push(...n);}setAttribute(){}focus(){}querySelector(){return null;}querySelectorAll(){return [];}addEventListener(n,f){this.events[n]=f;}
}
const integration=read('integration.js'),preamble=integration.slice(integration.indexOf("'use strict';"),integration.indexOf('function showError('));
const ROOT='uppdrag1700.integrated.20261023.v1.',original=ROOT+'lesson.1.play.',practice=ROOT+'self-practice.lesson.1.play.';
function access(query,memory=new Map()){
 const c={document:{getElementById:()=>({})},location:{search:query},URLSearchParams,UPPDRAG_AMBIENT_UI:{install(){}},localStorage:{get length(){return memory.size;},key:i=>[...memory.keys()][i],getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)}};
 c.window=c;vm.createContext(c);vm.runInContext(preamble+'window.test={selfPractice,lessonLimit,teacher,chapterTest,prefix,initialChapter,available,progressAllowed,read,write};',c);return c.test;
}
async function build(){
 const c={};c.window=c;vm.createContext(c);
 for(const n of ['gameplay-tuning.js','world-restoration.js','chapter6-build.js'])vm.runInContext(read(n),c);
 return c.UPPDRAG_CH6_BUILD.build(async n=>c.UPPDRAG_GAMEPLAY_TUNING.source(n,read('_decoded/'+n)),async n=>read(n.split('?')[0]));
}
function fixture(files,prior=new Map(),solo=true){
 const memory=new Map(prior),stage=new Element(),document={head:new Element(),body:new Element(),createElement:()=>new Element(),getElementById:()=>null};
 const c={document,stage,roomView:new Element(),roomFooter:new Element(),interior:null,region:{id:'main',buildings:[]},console,
  __INTEGRATED_CHAPTER:6,__UPPDRAG_LESSON_ONLY:6,addEventListener(){},setMessage(){},leaveInterior(){c.interior=null;},requestInterior(){},requestHarbour(){},
  UPPDRAG_MEETINGS:{memoryThanks(){},close(){}},UPPDRAG_CH6_STORY:{openMap(){}},
  localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,String(v))}};c.window=c;vm.createContext(c);
 for(const n of ['recall-bank.js','recall-assessment.js'])vm.runInContext(frozen[n],c);
 for(const n of ['questions/fixes.js','questions/alignment.js','questions/power-language.js','gameplay-tuning.js','self-practice.js'])vm.runInContext(read(n),c);
 for(const ch of [2,3,4,5])vm.runInContext(read('_decoded/chapter'+ch+'-content.js'),c);
 vm.runInContext(c.UPPDRAG_GAMEPLAY_TUNING.source('chapter6-content.js',files['chapter6-content.js']),c);
 c.UPPDRAG_PROMPT_ALIGNMENT.install();
 let flow=c.UPPDRAG_GAMEPLAY_TUNING.source('recall-flow.js',frozen['recall-flow.js']),pilot=files['chapter6-pilot.js'];
 if(solo){flow=c.UPPDRAG_SELF_PRACTICE.source('recall-flow.js',flow);pilot=c.UPPDRAG_SELF_PRACTICE.source('chapter6-pilot.js',pilot);}
 vm.runInContext(c.UPPDRAG_PROMPT_ALIGNMENT.flow(flow),c);vm.runInContext(pilot,c);
 const p=c.UPPDRAG_CH6_PILOT,modal=stage.children.find(e=>e.id==='ch1Modal');
 const room=kind=>{c.interior={kind,name:({farm:'Byn',workshop:'Verkstäderna',cafe:'Kaffehuset',print:'Tryckeriet',archive:'Arkivet'})[kind]};};
 return {c,p,modal,memory,room};
}
(async()=>{
 const files=await build();assert.match(files['chapter6-pilot.html'],/!window\.UPPDRAG_CHAPTER_PROGRESS_ALLOWED\?\.\(\)/);
 for(const version of ['2.7.1','2.9.0']){
  const memory=new Map([[original+'lastChapter','5'],[original+'uppdrag1700.ch5-real-world.20261020.v1','{"v":2,"complete":false,"daler":7,"draft":"Mitt svar","record":[]}']]),before=[...memory];
  const a=access('?only=1&chapter=1&v='+version,memory);assert.equal(a.lessonLimit,6);assert.equal(a.prefix(),practice);assert(a.selfPractice);assert.equal(a.initialChapter(),5);
  for(let ch=1;ch<=6;ch++){assert(a.available(ch));assert(a.progressAllowed(ch));}for(let ch=7;ch<=10;ch++)assert.equal(a.available(ch),false);
  for(const[k,v]of before){assert.equal(memory.get(k),v);assert.equal(memory.get(practice+k.slice(original.length)),v);}
  a.write('lastChapter','6');const saved=[...memory];assert.equal(access('?only=1&chapter=1&v='+version,memory).initialChapter(),6);assert.deepEqual([...memory],saved);
  const assessed=access('?only=1&chapter=6&v='+version+'&practice=0&teacher=1&testChapter=7',memory);assert.equal(assessed.prefix(),original);assert.equal(assessed.teacher,false);assert.equal(assessed.chapterTest,0);assert(assessed.available(6));assert.equal(assessed.available(7),false);
 }
 for(const limit of [4,5]){const a=access('?only='+limit+'&chapter='+limit);assert.equal(a.lessonLimit,limit);assert.equal(a.available(limit+1),false);}
 const sentinels=new Map([['uppdrag1700.ch5-real-world.20261020.v1','{"v":2,"complete":false,"daler":7,"draft":"Bevarat femmanssvar","record":[]}'],['uppdrag1700.ch5-marstrand-letter.20261020.v1','{"version":1,"phase":"carrying"}']]);
 let h=fixture(files,sentinels);h.room('cafe');h.p.acceptMajaMission();assert.equal(h.p.state.step,1);assert.equal(h.p.state.record.length,0);
 h.room('farm');h.p.enterMemory();assert.equal(h.p.state.ch6MapSolved,undefined,'opening the visit does not solve the map');
 // The map's real UI is checked separately. Here its saved outcome is a fixture.
 h.p.state.ch6MapSolved=true;h.p.state.ch6LetterDelivered=true;h.p.persist();
 let questions=0,comparisons=0;
 for(let step=1;step<=12;step++){
  assert.equal(h.p.state.step,step);h.room(h.p.current().p);h.p.enterMemory();let guard=0;
  while(h.p.state.mode!=='end'){
   assert(++guard<=3,'each real visit has exactly three questions');const task=h.p.recall.current;assert.equal(task.chapter,6);
   const compare=task.rank>0&&guard===1;
   task.fields.forEach((f,i)=>h.p.recall.input({target:{dataset:{rcField:String(i)},value:compare?'Min egen förklaring med andra ord.':f.sample}}));
   h.p.recall.action('rc-submit');
   if(h.p.recall.ui.phase==='review'){
    h.p.recall.action('rc-practice-revise');assert.equal(h.p.recall.ui.phase,'question');h.p.recall.action('rc-submit');h.p.recall.action('rc-practice-next');
    const entry=h.p.state.record.at(-1),n=h.p.state.record.length;assert.equal(entry.assessment,'self-checked-practice');assert.equal(entry.ok,false);assert.equal(entry.independent,false);h.p.recall.action('rc-practice-next');assert.equal(h.p.state.record.length,n);comparisons++;
   }
   assert.equal(h.p.recall.ui.phase,'feedback');questions++;h.p.recall.action('rc-next');
  }
  if(step===5){const records=JSON.stringify(h.p.state.record);h.p.persist();h=fixture(files,h.memory);h.room('farm');assert.equal(h.p.state.mode,'end','a compared visit survives reload');assert.equal(JSON.stringify(h.p.state.record),records);}
  h.p.finishMemory();
 }
 assert.equal(questions,36);assert(comparisons>=8);assert.equal(h.p.state.complete,false);assert.equal(h.p.state.deliveryReady,true);assert.equal(h.p.advance(),false,'the final page cannot be delivered from the press');
 h.room('cafe');assert.equal(h.p.advance(),true);assert(h.p.state.complete);assert.equal(h.p.state.record.length,36);assert.equal(new Set(h.p.state.record.map(r=>r.id)).size,36);
 for(const[k,v]of sentinels)assert.equal(h.memory.get(k),v,'earlier answers, resources and letter are unchanged');
 h.p.persist();h=fixture(files,h.memory);assert(h.p.state.complete,'completion survives reload');assert.equal(h.p.state.record.length,36);assert(!h.p.state.record.some(r=>r.assessment==='teacher-approved'));
 // The retained assessed mode does not accept the self-comparison action.
 const assessed=fixture(files,new Map(),false);assessed.room('cafe');assessed.p.acceptMajaMission();assessed.p.state.ch6MapSolved=true;assessed.room('farm');assessed.p.enterMemory();const n=assessed.p.state.record.length;assessed.p.recall.action('rc-practice-next');assert.equal(assessed.p.state.record.length,n);
 console.log('PASS chapter 6 classroom: both existing bookmarks, six free chapters, chapters 7–10 blocked, original/practice save isolation, authorized inner gate, 36 real questions through 12 generated visits, 8 self-comparisons without false assessment, reload, physical final delivery, preserved chapter-five answers/letter and retained assessed mode');
})().catch(e=>{console.error(e);process.exitCode=1;});
