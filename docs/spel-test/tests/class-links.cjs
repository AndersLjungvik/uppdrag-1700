'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'..','integration.js'),'utf8');
const preamble=source.slice(source.indexOf("'use strict';"),source.indexOf('function showError('));
const bridge=source.slice(source.indexOf('function bridge(id){'),source.indexOf('async function makePage('));
const sourceFn=source.slice(source.indexOf('async function source(name){'),source.indexOf('function bridge(id){'));
const ROOT='uppdrag1700.integrated.20261023.v1.',SCOPE=ROOT+'lesson.1.play.';
const firstKey='uppdrag1700.ch1-real-world.20261019.v11';
function boot(query,memory=new Map()){
 // Keep the original assessed-round contract covered explicitly. The default
 // independent-practice bookmarks and migration are tested in self-practice.cjs.
 query+='&practice=0';
 const nodes=new Map(),document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,{});return nodes.get(id);}};
 const c={document,location:{search:query},URLSearchParams,console,UPPDRAG_AMBIENT_UI:{install(){}},localStorage:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)}};
 c.window=c;vm.createContext(c);vm.runInContext(preamble+sourceFn+bridge+'\nwindow.test={lessonLimit,teacher,chapterTest,available,progressAllowed,initialChapter,prefix,read,write,bridge,access(ch){chapter=ch;return source("chapter-access-pilot.js");}};',c);
 return {api:c.test,memory};
}
(async()=>{
for(const [name,version] of [['6A','2.7.1'],['6B','2.9.0']]){
 const query='?only=1&chapter=1&v='+version;
 let h=boot(query);assert.equal(h.api.lessonLimit,4);assert.equal(h.api.prefix(),SCOPE);assert.equal(h.api.teacher,false);assert.equal(h.api.chapterTest,0);
 for(let chapter=1;chapter<=4;chapter++){
  assert.equal(h.api.available(chapter),true,'pupils can visit every released chapter without prerequisites');
 }
 h.memory.set(SCOPE+firstKey,JSON.stringify({v:2,complete:true}));assert.equal(h.api.available(2),true,'chapter access does not depend on completion flags');h.memory.delete(SCOPE+firstKey);
 assert.equal(h.api.progressAllowed(1),true);assert.equal(h.api.progressAllowed(2),true);assert.equal(h.api.progressAllowed(4),true);
 assert.equal(h.api.read(firstKey),null,'opening chapters cannot generate an artificial completion');
 h.memory.set(SCOPE+firstKey,JSON.stringify({v:2,complete:false,daler:7,apples:2,record:[{id:'kept-answer',answer:['Mitt sparade svar']}],earned:{kept:true}}));
 h.memory.set(SCOPE+'uppdrag1700.mastery.v1.ch1',JSON.stringify({v:1,areas:{start:{learner:{status:'clear'},journeyman:{status:'pending'}}},history:[{kept:true}]}));
 const saved=Array.from(h.memory.entries());h=boot(query,h.memory);assert.deepEqual(Array.from(h.memory.entries()),saved,'all written answers, stamps, pending reviews and resources remain identical');
 for(let chapter=5;chapter<=10;chapter++)assert.equal(h.api.available(chapter),false);
 for(const invalid of [0,11,1.5,NaN,'2'])assert.equal(h.api.available(invalid),false);
 assert(h.api.bridge(1).includes('window.__UPPDRAG_LESSON_ONLY=4;'));
 const tampered=boot(query+'&teacher=1&testChapter=5',h.memory);assert.equal(tampered.api.teacher,false);assert.equal(tampered.api.chapterTest,0);assert.equal(tampered.api.available(5),false);
 for(const only of [2,4,5]){
  const canonical=boot('?only='+only+'&chapter=5&v='+version,h.memory);assert.equal(canonical.api.lessonLimit,4);assert.equal(canonical.api.prefix(),SCOPE);assert.equal(canonical.api.read(firstKey),h.api.read(firstKey));
 }
 const replay=boot(query+'&replay=existing-round',h.memory);assert.equal(replay.api.lessonLimit,4);assert.equal(replay.api.prefix(),ROOT+'lesson.1.replay.existing-round.play.');
 const ordinary=boot('?chapter=1&v='+version,h.memory);assert.equal(ordinary.api.lessonLimit,0);assert.equal(ordinary.api.prefix(),ROOT+'play.');assert.equal(ordinary.api.available(2),false);
 const keys=['',firstKey,'uppdrag1700.ch2-real-world.20261019.v1','uppdrag1700.ch3-real-world.20261019.v1'];
 const areasByChapter=[[],['start','law','trade'],['women','power','children'],['parties','war','uprising','david']];
 for(let ch=1;ch<=3;ch++){
  const areas=Object.fromEntries(areasByChapter[ch].map(id=>[id,Object.fromEntries(['learner','journeyman','master'].map(l=>[l,{status:'clear'}]))]));
  h.memory.set(SCOPE+'uppdrag1700.mastery.v1.ch'+ch,JSON.stringify({v:1,areas}));
  const prior=JSON.parse(h.memory.get(SCOPE+keys[ch])||'{}');h.memory.set(SCOPE+keys[ch],JSON.stringify({...prior,v:2,complete:true}));
  assert.equal(h.api.available(ch+1),true,'completed chapters do not restrict chapter choice');
  assert.equal(h.api.progressAllowed(ch+1),true,'tests in the selected chapter remain available');
  for(let later=ch+2;later<=4;later++)assert.equal(h.api.available(later),true,'later released chapters remain freely selectable');
 }
 assert.equal(h.api.available(5),false,'completing earlier chapters does not release chapter 5');
 // Simulate already saved classroom work from before a code update. Reopen
 // the exact distributed URL and its canonical chapter-four URL without
 // rewriting any answer, unfinished draft, teacher review or earned stamp.
 const priorRound=new Map(),chapterKeys=['',firstKey,'uppdrag1700.ch2-real-world.20261019.v1','uppdrag1700.ch3-real-world.20261019.v1','uppdrag1700.ch4-real-world.20261020.v1'];
 const chapterAreas=[...areasByChapter,['reading','freedoms','research','ekeblad']];
 for(let ch=1;ch<=4;ch++){
  priorRound.set(SCOPE+chapterKeys[ch],JSON.stringify({v:2,complete:ch<4,daler:ch*7,apples:2,record:[{id:'saved-answer-'+ch,answer:['Mitt svar i kapitel '+ch],independent:true}],earned:{['stamp-'+ch]:true},
   recallUI:{phase:'question',drafts:['Mitt ännu oskickade svar '+ch]},draft:'Påbörjad förklaring '+ch,reviewQueue:[{id:'review-'+ch,answer:['Svar till läraren '+ch],step:1,trial:2}],sessions:{learner:{index:1,trial:2,draft:'Sparat utkast '+ch}}}));
  priorRound.set(SCOPE+'uppdrag1700.mastery.v1.ch'+ch,JSON.stringify({v:1,areas:Object.fromEntries(chapterAreas[ch].map(area=>[area,Object.fromEntries(['learner','journeyman','master'].map(level=>[level,{status:ch<4?'clear':level==='learner'?'clear':'pending'}]))])),history:[{area:chapterAreas[ch][0],level:'learner',answer:'Bevarat stämpelunderlag '+ch}]}));
 }
 priorRound.set(SCOPE+'lastChapter','4');const beforeUpdate=Array.from(priorRound.entries());
 const preservedKeys=beforeUpdate.map(([key])=>key.slice(SCOPE.length));
 for(const reopen of [query,'?only=4&chapter=4&v='+version,query]){
  const restored=boot(reopen,priorRound);assert.equal(restored.api.prefix(),SCOPE);assert.equal(restored.api.initialChapter(),4,'the original classroom bookmark resumes the saved chapter');
  for(const key of preservedKeys)assert.equal(restored.api.read(key),priorRound.get(SCOPE+key),name+' reads the same saved chapter data after update/reload');
  assert.deepEqual(Array.from(priorRound.entries()),beforeUpdate,name+' update/reload preserves every saved byte across chapters 1–4');
 }
 for(let denied=5;denied<=10;denied++)for(const extra of ['','&teacher=1&testChapter='+denied,'&teacher=1&testChapter='+denied+'&replay=forced-later']){
  const forced=boot('?only=1&chapter='+denied+'&v='+version+extra,priorRound);
  assert.equal(forced.api.teacher,false);assert.equal(forced.api.chapterTest,0);assert.equal(forced.api.available(denied),false);assert.equal(forced.api.progressAllowed(denied),false,'class query parameters cannot release chapter '+denied);
  assert.deepEqual(Array.from(priorRound.entries()),beforeUpdate,'a denied chapter request cannot alter the ordinary save');
 }
 console.log('PASS '+name+' saved classroom update: all four chapter answers, drafts, review records, resources and stamps byte-preserved; chapters 5–10 denied even with forced chapter/test/teacher/replay parameters');
 console.log('PASS '+name+': free choice of four chapters without fabricated mastery, identical saves, canonical navigation/reload, replay preserved, chapters 5–10 blocked');
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

{
 const {fixture}=require('./mastery-apple-retry.cjs');
 for(const limit of [0,4]){
  const h=fixture(4,new Map(),limit),areas=h.m.snapshot().config.areas;
  for(const level of ['learner','journeyman','master'])for(const area of areas){h.m.begin(area.id,level);h.m.pass(area.id,level);}
  h.p.refresh();h.action('book');
  assert.equal(h.modal.innerHTML.includes('chapter5-pilot.html'),limit!==4);
  assert.equal(h.modal.innerHTML.includes('Kapitel 5 är öppet'),limit!==4);
 }
 console.log('PASS classroom chapter 4 ending keeps chapter 5 locked');
}
