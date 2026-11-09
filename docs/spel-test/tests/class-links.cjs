'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'..','integration.js'),'utf8');
const preamble=source.slice(source.indexOf("'use strict';"),source.indexOf('function showError('));
const bridge=source.slice(source.indexOf('function bridge(id){'),source.indexOf('async function makePage('));
const ROOT='uppdrag1700.integrated.20261023.v1.',SCOPE=ROOT+'lesson.1.play.';
const firstKey='uppdrag1700.ch1-real-world.20261019.v11';
function boot(query,memory=new Map()){
 const nodes=new Map(),document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,{});return nodes.get(id);}};
 const c={document,location:{search:query},URLSearchParams,console,UPPDRAG_AMBIENT_UI:{install(){}},localStorage:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)}};
 c.window=c;vm.createContext(c);vm.runInContext(preamble+bridge+'\nwindow.test={lessonLimit,teacher,chapterTest,available,prefix,read,write,bridge};',c);
 return {api:c.test,memory};
}
function clearChapterOne(memory){
 const areas=Object.fromEntries(['start','law','trade'].map(id=>[id,Object.fromEntries(['learner','journeyman','master'].map(level=>[level,{status:'clear',attempt:1}]))]));
 memory.set(SCOPE+'uppdrag1700.mastery.v1.ch1',JSON.stringify({v:1,chapter:1,areas,history:[]}));
 memory.set(SCOPE+firstKey,JSON.stringify({v:2,complete:true,daler:7,apples:1,record:[{id:'kept-answer',answer:['Mitt sparade svar']}],earned:{kept:true}}));
}
for(const [name,version] of [['6A','2.7.1'],['6B','2.9.0']]){
 const query='?only=1&chapter=1&v='+version;
 let h=boot(query);assert.equal(h.api.lessonLimit,2);assert.equal(h.api.prefix(),SCOPE);assert.equal(h.api.teacher,false);assert.equal(h.api.chapterTest,0);
 assert.equal(h.api.available(1),true);assert.equal(h.api.available(2),false,'chapter 1 still needs to be completed');
 h.memory.set(SCOPE+firstKey,JSON.stringify({complete:true}));assert.equal(h.api.available(2),false,'an old complete flag cannot replace the nine stamps');
 clearChapterOne(h.memory);h.memory.set(SCOPE+'uppdrag1700.ch2-real-world.20261019.v1',JSON.stringify({v:2,complete:true,daler:9,apples:1,record:[{id:'rc2-mother-0',ok:true}]}));
 const saved=Array.from(h.memory.entries());h=boot(query,h.memory);assert.equal(h.api.available(2),true);assert.deepEqual(Array.from(h.memory.entries()),saved,'loading the old class link preserves every answer and resource');
 for(let chapter=3;chapter<=10;chapter++)assert.equal(h.api.available(chapter),false,'only chapters 1–2 are released');
 assert(h.api.bridge(1).includes('window.__UPPDRAG_LESSON_ONLY=2;'),'the actual chapter pilot receives the same two-chapter pupil mode');
 const tampered=boot(query+'&teacher=1&testChapter=5',h.memory);assert.equal(tampered.api.teacher,false);assert.equal(tampered.api.chapterTest,0);assert.equal(tampered.api.available(5),false);
 const canonical=boot('?only=2&chapter=2&v='+version,h.memory);assert.equal(canonical.api.lessonLimit,2);assert.equal(canonical.api.prefix(),SCOPE);assert.equal(canonical.api.read(firstKey),h.api.read(firstKey));
 const replay=boot(query+'&replay=existing-round',h.memory);assert.equal(replay.api.lessonLimit,2);assert.equal(replay.api.prefix(),ROOT+'lesson.1.replay.existing-round.play.');
 const ordinary=boot('?chapter=1&v='+version,h.memory);assert.equal(ordinary.api.lessonLimit,0);assert.equal(ordinary.api.prefix(),ROOT+'play.');
 console.log('PASS '+name+': existing bookmark opens chapters 1–2 after real completion, same saves and pupil rules, replay preserved, chapters 3–10 blocked');
}
for(const query of ['?only=1&chapter=1','?only=1&chapter=1&v=2.8.0','?only=1&chapter=1&v=2.15.0']){
 const h=boot(query);clearChapterOne(h.memory);assert.equal(h.api.lessonLimit,1);assert.equal(h.api.available(2),false,'unrelated one-chapter links retain their declared limit');
}
console.log('PASS other one-chapter links retain their original scope');
