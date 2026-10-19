import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import cards,{sources,reflections} from '../curriculum/classroom.mjs';
import {grade,gradeShort,choicesFor} from '../dist/world/learning.mjs';
import {buildContent} from '../dist/world/content.mjs';
import {createEngine,validBank} from '../dist/world/engine.mjs';
const bank=JSON.parse(fs.readFileSync(new URL('../dist/classroom-bank.json',import.meta.url)));
test('the game export exactly matches the authored and sourced questions',()=>{
 const exported=bank.missions.flatMap(m=>m.cards);assert.equal(exported.length,cards.length);
 assert.equal(new Set(cards.map(q=>q.id)).size,cards.length);
 for(const q of exported){const a=cards.find(x=>x.id===q.id);assert(a,q.id);assert.equal(q.question,a.question);assert.deepEqual(q.references,a.references);assert(q.bookReference.length)}
 const ctx=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(new URL('../dist/classroom-curriculum.js',import.meta.url),'utf8'),ctx);assert.equal(JSON.stringify(ctx.window.CLASSROOM_CURRICULUM),JSON.stringify(bank));
});
test('every question, answer and reflection has an exact classroom reference',()=>{
 for(const q of [...cards,...reflections]){assert(q.references.length,q.id);for(const r of q.references){assert(sources[r.source],q.id);assert(r.location.trim(),q.id)}assert(!q.references.some(r=>/https?:|legacy|manuscript/i.test(r.source)),q.id)}
 assert(!bank.sources.some(s=>s.url),'No web or old AI bank masquerades as a source');
});
test('all ten book sections contain all three levels, with no extra unsourced game cards',()=>{
 const assigned=[];for(let c=1;c<=10;c++)for(let level=1;level<=3;level++){const group=cards.filter(q=>q.storyChapter===c&&q.level===level);assert(group.length,`${c}/${level}`);assigned.push(...group.map(q=>q.id))}
 assert.equal(assigned.length,cards.length);assert(assigned.every(id=>id.startsWith('sos-')));
});
test('all 18 concepts in the uploaded concept sheet have an explicit fact question',()=>{
 const required=['frihetstiden','riksrådet','Ostindiska kompaniet','grundlag','barnhus','hattar och mössor','stora daldansen','tryckfrihet','offentlighetsprincipen','vetenskap','upplysningen','religionsfrihet','skifte','fabriker','kultur','koloni','Saint Barthélemy','slavhandel'];
 for(const term of required)assert(cards.some(q=>q.concept===term),term);
});
test('all 17 terms in the two uploaded tests are trained',()=>{
 for(const term of ['hattar och mössor','katekesen','kolt','tryckfrihet','aga','offentlighetsprincipen','oäkta','censur','skampåle','prostituerad','koloni','landsförvisad','dass','skrå','här','rasism','tobak'])assert(cards.some(q=>q.concept===term),term);
});
test('all model answers pass, alternative accepted answers pass, and all chain distractors fail',()=>{
 for(const q of cards){if(q.type==='short'){for(const a of q.accept)assert(gradeShort(q,a),q.id+': '+a);assert(!gradeShort(q,'vet inte'),q.id)}else{assert.equal(q.steps.length,3,q.id);assert(grade(q,q.steps.map(s=>s.answer)),q.id);for(let i=0;i<3;i++){assert.equal(new Set(q.steps[i].options).size,3,q.id);for(const wrong of q.steps[i].options.filter(x=>x!==q.steps[i].answer)){const a=q.steps.map(s=>s.answer);a[i]=wrong;assert(!grade(q,a),q.id)}}}}
});
test('dependencies resolve to actual fact cards, including cross-chapter review',()=>{
 for(const q of cards)for(const id of q.requires||[])assert(cards.some(c=>c.id===id&&c.type==='short'),`${q.id}: ${id}`);
});
test('every optional multiple-choice set contains exactly one accepted answer',()=>{
 const exported=bank.missions.flatMap(m=>m.cards);for(const q of exported.filter(q=>q.type==='short')){const options=choicesFor(q,exported,()=>.43);assert.equal(options.length,q.distractors?.length>=2?3:0,q.id);if(options.length)assert.equal(options.filter(x=>gradeShort(q,x)).length,1,q.id)}
});
test('vetted answer choices never collide with accepted short answers',()=>{
 const exported=bank.missions.flatMap(m=>m.cards);
 const shorts=exported.filter(q=>q.type==='short');
  assert.equal(shorts.length,96);
  assert.equal(shorts.filter(q=>q.distractors?.length===2).length,87);
 for(const q of shorts){const options=choicesFor(q,exported,()=>.37);
  if(!q.distractors){assert.deepEqual(options,[],q.id);continue}
  assert.equal(options.length,3,q.id);
  assert.equal(options.filter(x=>gradeShort(q,x)).length,1,q.id);
  assert.equal(new Set(options).size,3,q.id);
 }
 const chains=exported.filter(q=>q.type==='chain');assert.equal(chains.length,42);
 for(const q of chains)for(let i=0;i<3;i++){
  const step=q.steps[i];assert.equal(step.options.length,3,q.id);
  assert.equal(new Set(step.options).size,3,q.id);
  for(const wrong of step.options.filter(x=>x!==step.answer)){
   const answer=q.steps.map(s=>s.answer);answer[i]=wrong;
   assert(!grade(q,answer),q.id+' part '+(i+1));
  }
 }
});
test('opinions and ambiguous source classification cannot become auto-scored facts',()=>{
 assert(reflections.every(q=>q.scored===false));for(const slug of ['kvinnor','kallval','maskerad','seger'])assert(reflections.some(q=>q.id==='sos-samtal-'+slug));
 assert(!cards.some(q=>q.type==='short'&&/varför tror du|vad tycker du/i.test(q.question)));
});
test('coverage and assessment pools refer only to current questions and keep unscored reflection separate',()=>{
 for(const row of bank.coverage)assert(row.ids.every(id=>cards.some(q=>q.id===id)),`${row.material}: ${row.assignment}`);
 for(const a of bank.assessments){assert(a.ids.length);assert(a.reflections.length);assert(a.ids.every(id=>cards.some(q=>q.id===id)));assert(a.reflections.every(id=>reflections.some(q=>q.id===id)));assert(!a.ids.some(id=>a.reflections.includes(id)))}
});
test('the paper-world game uses only the new source bank and can finish all thirty levels across reloads',()=>{
 const ctx=vm.createContext({window:{},Date});vm.runInContext(fs.readFileSync(new URL('../dist/practice.js',import.meta.url),'utf8'),ctx);const practice=ctx.window.UPPDRAG_PRACTICE;
 assert(validBank(bank,bank));const content=buildContent(bank);assert.equal(content.cards.size,cards.length);
 const reachable=new Set(content.chapters.flatMap(c=>c.levels.flatMap(l=>l.ids)));assert.equal(reachable.size,cards.length);
 let e=createEngine({bank,practice,now:()=>2000000000});
 for(let c=1;c<=10;c++){assert(e.setChapter(c));for(let l=1;l<=3;l++){
  e.arrive(e.level().giver);assert(e.accept(e.level().giver).ok);let guard=0;
  while(e.active()){
   assert(++guard<500,`${c}/${l}`);e.arrive(e.target());switch(e.active().phase){
    case'pickup':assert(e.pickup(e.target()).ok);break;
    case'work':assert(e.beginWork(e.target()).ok);while(e.currentQuiz()){const q=e.question();if(!e.currentQuiz().feedback)assert(e.answer(q.type==='short'?q.answer:q.steps.map(s=>s.answer)).correct,q.id);if(e.nextQuestion().finished)break}break;
    case'materials':for(const item of ['ink','paper','type'])assert(e.placeMaterial(item));assert(e.print());break;
    case'puzzle':assert(e.puzzle(e.level().puzzle==='map'?'joined':'russia').correct);break;
    case'handoff':assert(e.handoff(e.target()));break;
    case'deliver':assert(e.deliver(e.target()).ok);break;
    default:assert.fail(e.active().phase);
   }
   e=createEngine({bank,practice,initial:e.snapshot(),now:()=>2000000000});
  }
  assert.equal(e.progress().done,l);
 }
  if(c<10){
   assert(e.beginGateExam().ok,`chapter ${c} conclusion`);
   while(e.currentQuiz()){
    const q=e.question();assert(e.answer(q.type==='short'?q.answer:q.steps.map(s=>s.answer)).correct,q.id);
    const result=e.nextQuestion();if(result.finished){assert(result.passed,`chapter ${c} conclusion`);break}
   }
   e=createEngine({bank,practice,initial:e.snapshot(),now:()=>2000000000});
  }
 }assert.equal(e.world().effects.length,30);
});
test('old knowledge credits are archived rather than transferred to different classroom questions',()=>{
 const ctx=vm.createContext({window:{},Date});vm.runInContext(fs.readFileSync(new URL('../dist/practice.js',import.meta.url),'utf8'),ctx);
 const e=createEngine({bank,practice:ctx.window.UPPDRAG_PRACTICE,initial:{version:2,bankId:'old-ai-bank',coins:20,inventory:{bread:2},studied:['power','nature'],careers:{power:{rank:3}},answers:{'power-era':{correct:5}},paperWorld:{chapter:10,unlocked:10,jobs:{1:{done:3}},known:['power-era'],effects:['chapter-1-level-3']}}});
 assert.equal(e.state.coins,20);assert.equal(e.state.inventory.bread,2);assert.equal(e.state.learningArchives[0].careers.power.rank,3);assert.deepEqual(e.state.careers,{});assert.equal(e.progress().done,0);assert.equal(e.world().known.length,0);assert.equal(e.world().effects.length,0);
});
test('apple clues cost once per question, survive reload, mark support and never charge for correction',()=>{
 const ctx=vm.createContext({window:{},Date});vm.runInContext(fs.readFileSync(new URL('../dist/practice.js',import.meta.url),'utf8'),ctx);const make=initial=>createEngine({bank,practice:ctx.window.UPPDRAG_PRACTICE,initial});let e=make();e.arrive('cafe');e.accept('cafe');e.arrive('print');e.beginWork('print');assert.equal(e.world().known.length,1);const q=e.question();const clue=e.hint();assert(clue.ok);assert(!e.state.inventory.apple);assert(e.currentQuiz().hint);
 e=make(e.snapshot());assert.equal(e.hint().text,clue.text);assert(!e.state.inventory.apple);assert(e.answer(q.answer).correct);assert(e.state.answers[q.id].lastSupported);assert(!e.hint().ok);e.nextQuestion();assert.equal(e.hint().reason,'no-apple');assert(!e.answer('ett felaktigt svar').correct);assert(e.currentQuiz().feedback);assert(e.retry());assert(!e.state.inventory.apple);
});
