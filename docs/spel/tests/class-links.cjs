'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'..','integration.js'),'utf8');
const preamble=source.slice(source.indexOf("'use strict';"),source.indexOf('function showError('));
const bridge=source.slice(source.indexOf('function bridge(id){'),source.indexOf('async function makePage('));
const sourceFn=source.slice(source.indexOf('async function source(name){'),source.indexOf('function bridge(id){'));
const ROOT='uppdrag1700.integrated.20261023.v1.',SCOPE=ROOT+'lesson.1.play.';
const firstKey='uppdrag1700.ch1-real-world.20261019.v11';
function boot(query,memory=new Map()){
 const nodes=new Map(),document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,{});return nodes.get(id);}};
 const c={document,location:{search:query},URLSearchParams,console,UPPDRAG_AMBIENT_UI:{install(){}},localStorage:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)}};
 c.window=c;vm.createContext(c);vm.runInContext(preamble+sourceFn+bridge+'\nwindow.test={lessonLimit,teacher,chapterTest,available,prefix,read,write,bridge,access(ch){chapter=ch;return source("chapter-access-pilot.js");}};',c);
 return {api:c.test,memory};
}
(async()=>{
for(const [name,version] of [['6A','2.7.1'],['6B','2.9.0']]){
 const query='?only=1&chapter=1&v='+version;
 let h=boot(query);assert.equal(h.api.lessonLimit,5);assert.equal(h.api.prefix(),SCOPE);assert.equal(h.api.teacher,false);assert.equal(h.api.chapterTest,0);
 for(let chapter=1;chapter<=5;chapter++){
  assert.equal(h.api.available(chapter),true,'all five chapters are available before any stamps');
  assert((await h.api.access(chapter)).includes('authorized by the integration gate'),'the room prerequisite is bypassed too');
 }
 assert.equal(h.api.read(firstKey),null,'opening chapters cannot generate an artificial completion');
 h.memory.set(SCOPE+firstKey,JSON.stringify({v:2,complete:false,daler:7,apples:2,record:[{id:'kept-answer',answer:['Mitt sparade svar']}],earned:{kept:true}}));
 h.memory.set(SCOPE+'uppdrag1700.mastery.v1.ch1',JSON.stringify({v:1,areas:{start:{learner:{status:'clear'},journeyman:{status:'pending'}}},history:[{kept:true}]}));
 const saved=Array.from(h.memory.entries());h=boot(query,h.memory);assert.deepEqual(Array.from(h.memory.entries()),saved,'all written answers, stamps, pending reviews and resources remain identical');
 for(let chapter=6;chapter<=10;chapter++)assert.equal(h.api.available(chapter),false);
 for(const invalid of [0,11])assert.equal(h.api.available(invalid),false);
 assert(h.api.bridge(1).includes('window.__UPPDRAG_LESSON_ONLY=5;'));
 const tampered=boot(query+'&teacher=1&testChapter=5',h.memory);assert.equal(tampered.api.teacher,false);assert.equal(tampered.api.chapterTest,0);assert.equal(tampered.api.available(6),false);
 for(const only of [2,5]){
  const canonical=boot('?only='+only+'&chapter=5&v='+version,h.memory);assert.equal(canonical.api.lessonLimit,5);assert.equal(canonical.api.prefix(),SCOPE);assert.equal(canonical.api.read(firstKey),h.api.read(firstKey));
 }
 const replay=boot(query+'&replay=existing-round',h.memory);assert.equal(replay.api.lessonLimit,5);assert.equal(replay.api.prefix(),ROOT+'lesson.1.replay.existing-round.play.');
 const ordinary=boot('?chapter=1&v='+version,h.memory);assert.equal(ordinary.api.lessonLimit,0);assert.equal(ordinary.api.prefix(),ROOT+'play.');assert.equal(ordinary.api.available(2),false);
 console.log('PASS '+name+': five immediately open chapters, real source gate bypass, identical saves, canonical navigation/reload, replay preserved, chapters 6–10 blocked');
}
for(const query of ['?only=1&chapter=1','?only=1&chapter=1&v=2.8.0','?only=1&chapter=1&v=2.15.0','?only=2&chapter=1']){
 const h=boot(query);assert.equal(h.api.available(2),false,'other links retain their original progression');
}
console.log('PASS other links retain their original scope and prerequisites');
})().catch(e=>{console.error(e);process.exitCode=1;});
// A completed fifth chapter must not advertise an unreleased sixth chapter.
{
 const {fixture}=require('./mastery-apple-retry.cjs');
 for(const limit of [0,5]){
  const h=fixture(5,new Map(),limit),areas=h.m.snapshot().config.areas;
  for(const level of ['learner','journeyman','master'])for(const area of areas){h.m.begin(area.id,level);h.m.pass(area.id,level);}
  h.p.refresh();h.action('book');
  assert.equal(h.modal.innerHTML.includes('chapter6-pilot.html'),limit!==5,'only ordinary unrestricted games offer chapter 6 after completion');
 }
 console.log('PASS chapter 5 ending respects the classroom release limit');
}
