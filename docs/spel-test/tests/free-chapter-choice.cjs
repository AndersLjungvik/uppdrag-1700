'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const {fixture}=require('./mastery-apple-retry.cjs');
const source=fs.readFileSync(path.join(__dirname,'../integration.js'),'utf8');
const preamble=source.slice(source.indexOf("'use strict';"),source.indexOf('function showError('));
const sourceFn=source.slice(source.indexOf('async function source(name){'),source.indexOf('function bridge(id){'));
const ROOT='uppdrag1700.integrated.20261023.v1.',SCOPE=ROOT+'lesson.1.play.';
const keys=['','uppdrag1700.ch1-real-world.20261019.v11','uppdrag1700.ch2-real-world.20261019.v1','uppdrag1700.ch3-real-world.20261019.v1','uppdrag1700.ch4-real-world.20261020.v1'];
function boot(query,memory=new Map()){
 // Exercise chapter choice in the retained assessed round as well as the
 // default practice round, which has its own complete progression regression.
 query+='&practice=0';
 const c={document:{getElementById:()=>({})},location:{search:query},URLSearchParams,console,UPPDRAG_AMBIENT_UI:{install(){}},localStorage:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)}};
 c.window=c;vm.createContext(c);vm.runInContext(preamble+sourceFn+'\nwindow.test={available,progressAllowed,initialChapter,async access(ch){chapter=ch;return source("chapter-access-pilot.js");}};',c);return c.test;
}
(async()=>{
for(const version of ['2.7.1','2.9.0']){
 const query='?only=1&chapter=1&v='+version,memory=new Map(),api=boot(query,memory);
 for(const ch of [4,2,3,1]){
  assert.equal(api.available(ch),true);assert.equal(api.progressAllowed(ch),true);
  assert.match(await api.access(ch),/authorized/,'the legacy inner lock must also be removed');
 }
 assert.equal(memory.size,0,'choosing access never creates previous results');
 // Enter each actual chapter engine with no previous chapter or fake stamps.
 for(const ch of [2,3,4]){
  const h=fixture(ch,new Map(),4),m=h.m,p=h.p,a=m.snapshot().config.areas[0];
  h.c.UPPDRAG_CHAPTER_PROGRESS_ALLOWED=()=>api.progressAllowed(ch);
  assert.equal(m.levelUnlocked('learner'),true);
  assert.equal(m.levelUnlocked('journeyman'),false);assert.equal(m.levelUnlocked('master'),false);
  h.room(a.p);assert.equal(p.selectArea(a.id,'learner'),true);p.enterMemory();assert(p.recall.current,'a real quiz can start immediately');
  const draft='Mitt påbörjade svar i kapitel '+ch;
  p.recall.input({target:{dataset:{rcField:'0'},value:draft}});
  assert.equal(m.snapshot().state.areas[a.id].learner.status,'in-progress');
  assert.equal(p.state.complete,false,'visiting is not completion');
  assert.equal(p.state.record.length,0,'an unsubmitted draft is not an assessed answer');
  const taskId=p.recall.current.id,before=JSON.parse(JSON.stringify(p.state));
  const restored=fixture(ch,h.memory,4);restored.c.UPPDRAG_CHAPTER_PROGRESS_ALLOWED=()=>api.progressAllowed(ch);
  restored.room(a.p);restored.p.selectArea(a.id,'learner');restored.p.enterMemory();
  assert.equal(restored.p.recall.current.id,taskId);
  assert.equal(restored.p.recall.ui.drafts[0],draft,'chapter switching resumes the unfinished answer');
  assert.equal(restored.p.state.daler,before.daler);assert.equal(restored.p.state.apples,before.apples);
  assert.equal(restored.m.levelUnlocked('journeyman'),false,'access never bypasses the chapter learning levels');
  for(const key of h.memory.keys())assert(!keys.slice(1,ch).includes(key),'earlier chapters are never marked as complete');
 }
 // The distributed bookmark resumes the pupil's saved chapter, while actual
 // menu navigation to chapter one remains an explicit choice.
 memory.set(SCOPE+'lastChapter','4');assert.equal(boot(query,memory).initialChapter(),4);
 assert.equal(boot('?only=4&chapter=1&v='+version,memory).initialChapter(),1);
 assert.equal(boot('?only=4&chapter=3&v='+version,memory).initialChapter(),3);
 assert.equal(boot('?only=4&chapter=5&v='+version,memory).initialChapter(),1);
 memory.set(SCOPE+'lastChapter','5');assert.equal(boot(query,memory).initialChapter(),1);
 for(const ch of [5,6,7,8,9,10])assert.equal(api.available(ch),false);
 console.log('PASS '+version+': direct real quizzes in chapters 2–4, draft/resume/resources, no invented completion, within-chapter levels, bookmark resume and release cap');
}
})().catch(e=>{console.error(e);process.exitCode=1;});
