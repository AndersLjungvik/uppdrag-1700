import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createEngine,validBank} from '../dist/world/engine.mjs';
import {buildContent} from '../dist/world/content.mjs';
import {gradeShort,choicesFor} from '../dist/world/learning.mjs';
const ctx=vm.createContext({window:{},Date});for(const f of ['curriculum.js','practice.js'])vm.runInContext(fs.readFileSync(new URL('../dist/'+f,import.meta.url),'utf8'),ctx);
const bank=ctx.window.CURRICULUM,practice=ctx.window.UPPDRAG_PRACTICE;
const make=(initial=null,extra={})=>createEngine({bank,practice,initial,now:()=>1000000000,rng:()=>.37,...extra});
function reload(e){return make(e.snapshot())}
function solve(e){let guard=0;while(e.currentQuiz()){assert(++guard<150);const q=e.question();if(!e.currentQuiz().feedback){const a=q.type==='chain'?q.steps.map(s=>s.answer):q.answer;assert(e.answer(a).correct)}const r=e.nextQuestion();if(r.finished)break;assert(r.ok)}return e}
function finishLevel(e){let guard=0;while(e.active()){assert(++guard<100);e.arrive(e.target());const a=e.active();switch(a.phase){
 case'pickup':assert(e.pickup(e.target()).ok);break;
 case'work':assert(e.beginWork(e.target()).ok);solve(e);break;
 case'materials':for(const id of ['ink','paper','type'])e.placeMaterial(id);assert(e.print());break;
 case'puzzle':assert(e.puzzle(e.level().puzzle==='finland'?'russia':'joined').correct);break;
 case'handoff':assert(e.handoff(e.target()));break;
 case'deliver':assert(e.deliver(e.target()).ok);break;
 default:assert.fail(a.phase);
 }e=reload(e)}return e}
test('the complete original bank remains reachable and every book section has exactly three complete levels',()=>{
 const c=buildContent(bank);assert.equal(c.chapters.length,10);const ids=new Set(c.chapters.flatMap(x=>x.levels.flatMap(l=>l.ids)));
 for(const m of bank.missions)for(const q of m.cards)assert(ids.has(q.id),q.id);
 assert.equal(bank.missions.flatMap(m=>m.cards).length,81);
 for(const ch of c.chapters){assert.equal(ch.levels.length,3);for(const l of ch.levels){assert(l.ids.length);assert(l.giver);assert(l.work);assert(l.recipient)}}
 assert(c.chapters[7].levels.some(l=>l.work==='opera'));assert(c.chapters[8].levels.length===3);
});
test('all ten sections can be played in order with a save and reload after every handover',()=>{
 let e=make();for(let c=1;c<=10;c++){
  assert(e.setChapter(c));for(let l=1;l<=3;l++){e.arrive(e.level().giver);assert(e.accept(e.level().giver).ok);e=finishLevel(e);assert.equal(e.progress().done,l)}
  assert.equal(e.progress().done,3);assert(e.world().unlocked>=Math.min(10,c+1));
 }assert.equal(e.world().effects.length,30);assert.equal(e.state.workSessions.length,30);
 assert(e.content.chapters.every(c=>e.world().jobs[c.id].done===3));
});
test('a proof cannot be made before demand, work and material placement; delivery pays once',()=>{
 let e=make();assert(!e.print());assert(!e.placeMaterial('ink'));assert.equal(e.item(),null);e.arrive('cafe');assert(e.accept('cafe').ok);assert.equal(e.item(),null,'a request does not conjure its future object into the bag');e=finishLevel(e);
 e.arrive('print');e.accept('print');e=finishLevel(e);e.arrive('print');e.accept('print');assert(!e.print());
 assert(e.beginWork('print').ok);solve(e);assert.equal(e.active().phase,'materials');assert(!e.print());
 e.placeMaterial('ink');assert(!e.placeMaterial('ink'));e.placeMaterial('paper');e.placeMaterial('type');assert(e.print());assert.equal(e.item(),'Provtryck');
 assert.equal(e.deliver('cafe').ok,false);e.arrive('cafe');assert(e.handoff('cafe'));assert.equal(e.item(),'Majas godkännande');
 e=reload(e);e.arrive('print');assert(e.handoff('print'));e.arrive('cafe');const coins=e.state.coins;assert(e.deliver('cafe').ok);assert(e.state.coins>coins);const after=e.state.coins;assert(!e.deliver('cafe').ok);assert.equal(e.state.coins,after);assert.equal(e.item(),null);
});
test('wrong answers and shown options remain supported after reload and do not restart a job',()=>{
 let e=make();e.arrive('cafe');e.accept('cafe');e.arrive('print');e.beginWork('print');const q=e.question();assert.equal(e.answer('helt fel').correct,false);assert(!e.nextQuestion().ok);assert(!e.answer(q.answer).ok);
 e=reload(e);assert(e.retry());assert(e.answer(q.answer).correct);assert(e.state.answers[q.id].lastSupported);assert.equal(e.progress().done,0);assert(e.nextQuestion().ok);
 const second=e.question();e.showOptions();e=reload(e);e.answer(second.answer);assert(e.state.answers[second.id].lastSupported);
});
test('legacy saves keep answers, income, rank, inventory, real-time review data and unfinished work',()=>{
 let e=make({version:2,name:'Elev',coins:12,food:4,day:9,completed:['trade'],inventory:{trade:1,bread:2},careers:{trade:{rank:2,promotedAt:10}},answers:{'trade-company':{attempts:2,correct:1}},practice:{'trade-company':{level:2,lastReviewedAt:500,nextDueAt:1000}},studied:['trade'],working:{missionId:'trade',ids:['trade-company','trade-port'],index:1}});
 assert.equal(e.state.coins,12);assert.equal(e.state.inventory.bread,2);assert.equal(e.state.careers.trade.rank,2);assert.equal(e.state.answers['trade-company'].attempts,2);assert.equal(e.state.practice['trade-company'].nextDueAt,1000);
 assert.equal(e.question().id,'trade-port');assert.equal(e.currentQuiz().kind,'legacy');solve(e);assert.equal(e.state.coins,12);assert.equal(e.progress().done,0);
});
test('switching book sections preserves unfinished jobs and never opens a future area accidentally',()=>{
 const e=make();assert(!e.arrive('opera').ok);e.arrive('cafe');e.accept('cafe');e.arrive('print');e.beginWork('print');e.answer(e.question().answer);e.nextQuestion();const id=e.question().id;
 assert(!e.setChapter(8));assert(e.setChapter(8,{unlock:true}));assert(e.availablePlaces().includes('opera'));assert.equal(e.progress().done,0);assert(e.setChapter(1));assert.equal(e.question().id,id);
});
test('repetition selects only introduced facts and rewards each completed pass while spacing still uses actual days',()=>{
 let clock=1000000000;const e=make(null,{now:()=>clock});assert.equal(e.beginReview().reason,'no-topics');e.arrive('cafe');e.accept('cafe');e.arrive('print');e.beginWork('print');solve(e);
 assert(e.reviewIds().every(id=>e.content.chapters[0].levels[0].ids.includes(id)));assert(!e.reviewIds().includes('king-finland'));
 const before=e.state.coins;e.beginReview();solve(e);assert.equal(e.state.coins,before+1);const due=e.state.practice['power-era']?.nextDueAt;e.beginReview();solve(e);assert.equal(e.state.coins,before+2);assert.equal(e.state.practice['power-era']?.nextDueAt,due);
 clock+=86400000;e.beginReview();solve(e);assert.equal(e.state.coins,before+3);
});
test('repeated work gives a new wage while preserving completed chapters and the thirty story effects',()=>{
 let e=make();for(let l=1;l<=3;l++){e.arrive(e.level().giver);e.accept(e.level().giver);e=finishLevel(e)}
 const coins=e.state.coins,oldEffects=[...e.world().effects];e.arrive('cafe');assert(e.accept('cafe',{repeatLevel:1}).ok);e=finishLevel(e);assert.equal(e.progress().done,3);assert.equal(e.state.coins,coins+2);assert.deepEqual(e.world().effects,oldEffects);
});
test('every answer and every supported option set remains valid and shuffled',()=>{
 const c=buildContent(bank);for(const q of c.cards.values())if(q.type==='short'){assert(gradeShort(q,q.answer),q.id);const choices=choicesFor(q,[...c.cards.values()],()=>.5);assert.equal(choices.filter(x=>gradeShort(q,x)).length,1,q.id);assert(new Set(choices).size===choices.length)}
 assert(!gradeShort(c.cards.get('press-year'),'1767'));assert(!gradeShort(c.cards.get('power-era'),'inte frihetstiden'));
});
test('reports preserve practice data and neutralize spreadsheet formulas in names and responses',()=>{
 const e=make({version:2,name:'=HYPERLINK(1)',answers:{'power-era':{attempts:1,correct:1,firstCorrect:true,lastResponse:'@attack'}}});const csv=e.reportCSV();assert(csv.includes("'=HYPERLINK"));assert(csv.includes("'@attack"));assert(csv.includes('1719'));
 assert(validBank(bank,bank));assert(!validBank({missions:[]},bank));
});
