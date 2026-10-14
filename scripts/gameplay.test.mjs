import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const DAY=86400000, NOW=Date.now();
function engine(){
  const c=vm.createContext({window:{__ADVENTURE_TEST__:true},console,Date,Math,JSON,Object,Array,Set,Map,Number,String});
  for(const file of ['practice.js','curriculum.js','game.js'])vm.runInContext(fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8'),c);
  return c.window.__adventure;
}
function studied(e,ids=['trade']){
  const s=e.blankState();s.started=true;s.completed=ids;s.food=3;s.time=2;e.setState(s);
}
function solve(e,now=NOW){
  let result;
  while(e.state.rehearsal){const q=e.reviewQuestion();result=e.logicReviewAnswer(q.answer,now)}
  return result;
}
test('old saved adventures gain new fields without losing harbor pay or seals',()=>{
  const e=engine(), old={version:2,started:true,scene:'harbor',coins:8,completed:['trade'],inventory:{trade:1}};
  e.setState(old);assert.equal(e.state.coins,8);assert.equal(e.state.inventory.trade,1);assert.equal(e.state.scene,'harbor');
  assert.equal(e.state.lastAppleAt,null);assert.equal(e.state.workshop.printed,false);assert.equal(e.state.rehearsal,null);
});
test('retrieval uses only studied short questions, with a unique bounded session',()=>{
  const e=engine();assert.equal(e.logicBeginReview(NOW).reason,'no-topics');studied(e);
  assert(e.logicBeginReview(NOW).ok);assert.equal(e.state.rehearsal.ids.length,4);
  assert.equal(new Set(e.state.rehearsal.ids).size,4);
  for(const id of e.state.rehearsal.ids)assert(e.mission('trade').cards.some(q=>q.type==='short'&&q.id===id));
});
test('due questions and prior errors return; future topics never enter the session',()=>{
  const e=engine();studied(e,['trade','nature','power']);
  e.state.practice['trade-company']={nextDueAt:NOW-DAY,lastReviewedAt:NOW-2*DAY,lastCorrect:false};
  e.state.practice['nature-linne']={nextDueAt:NOW+DAY,lastReviewedAt:NOW,lastCorrect:true};
  const ids=e.reviewSelection(NOW);assert(ids.includes('trade-company'));assert(ids.includes('nature-linne'));
  assert.equal(ids.length,6);assert(!ids.some(id=>id.startsWith('king-')));
});
test('a wrong retrieval answer gives a recorded gap without costing food or locking work',()=>{
  const e=engine();studied(e);e.logicBeginReview(NOW);const q=e.reviewQuestion();
  const result=e.logicReviewAnswer('vet inte',NOW);
  assert.equal(result.correct,false);assert.equal(result.finished,false);assert.equal(e.state.food,3);assert.equal(e.state.time,2);
  assert.equal(e.state.failedToday.length,0);assert(e.state.gaps.includes(q.id));assert.equal(e.state.answers[q.id].lastSource,'review');
});
test('a saved review resumes at the next question and can award only once per real day',()=>{
  const e=engine();studied(e);e.logicBeginReview(NOW);e.logicReviewAnswer(e.reviewQuestion().answer,NOW);
  const saved=JSON.parse(JSON.stringify(e.state));e.setState(saved);assert.equal(e.state.rehearsal.index,1);
  assert(solve(e,NOW).rewarded);assert.equal(e.state.inventory.apple,1);
  e.setState(JSON.parse(JSON.stringify(e.state)));e.logicBeginReview(NOW+1000);assert.equal(solve(e,NOW+1000).rewarded,false);
  for(let i=0;i<5;i++)e.logicNewDay();e.logicBeginReview(NOW+2000);assert.equal(solve(e,NOW+2000).rewarded,false);
  e.logicBeginReview(NOW+DAY);assert(solve(e,NOW+DAY).rewarded);assert.equal(e.state.inventory.apple,2);
  assert.equal(e.logicReviewAnswer('import',NOW+DAY).ok,false);
});
test('poor performance and cancellation do not yield apples; rehearsal blocks concurrent jobs',()=>{
  const e=engine();studied(e);e.logicBeginReview(NOW);assert.equal(e.logicBeginJob('king').reason,'busy');
  while(e.state.rehearsal)e.logicReviewAnswer('fel',NOW);assert(!e.state.inventory.apple);
  e.logicBeginReview(NOW);e.logicCancelReview();assert.equal(e.state.rehearsal,null);assert(!e.state.inventory.apple);
});
test('apple hints are consumed once, survive reload and mark the answer as supported',()=>{
  const e=engine();studied(e);e.state.inventory.apple=1;
  assert(e.logicOfferApple('king').ok);assert(!e.state.inventory.apple);assert.equal(e.state.hintCredits.king,1);
  assert(e.logicBeginJob('king').ok);assert(e.logicJobHint().ok);assert.equal(e.logicJobHint().ok,false);
  e.setState(JSON.parse(JSON.stringify(e.state)));assert.equal(e.state.working.hintUsed,true);
  const q=e.mission('king').cards[0];assert(e.logicAnswer(q,q.answer,false).correct);
  assert.equal(e.state.answers[q.id].lastSupported,true);assert.equal(e.state.answers[q.id].supported,1);
  assert.equal(e.state.working.hintUsed,false);assert.equal(e.logicJobHint().reason,'no-apple');
});
test('the printing puzzle has real inventory, reload-safe progress and one non-knowledge reward',()=>{
  const e=engine();assert.equal(e.logicPrint().reason,'missing');
  for(const id of ['type','ink','paper']){assert(e.logicCollect(id).ok);assert.equal(e.logicCollect(id).ok,false);assert(e.logicPlace(id).ok);assert(!e.state.inventory[id])}
  e.setState(JSON.parse(JSON.stringify(e.state)));assert(e.logicPrint().ok);assert.equal(e.state.inventory.proof,1);
  assert.equal(e.logicPrint().ok,false);assert(e.logicDeliverProof().ok);assert.equal(e.logicDeliverProof().ok,false);
  assert.equal(e.state.hintCredits.ideas,1);assert.equal(Object.keys(e.state.answers).length,0);assert.equal(e.state.food,2);
});
test('book references and tailored hints can be imported without inventing page numbers',()=>{
  const e=engine(),bank=JSON.parse(JSON.stringify(e.data));bank.missions[0].bookReference='SO-boken, sidan 42';
  bank.missions[0].cards[0].learningHint='Tänk på året i bokens tidslinje.';
  assert(e.applyBank(bank));assert.equal(e.bookGuide('press'),'SO-boken, sidan 42');
  assert(e.logicBeginJob('press').ok);e.state.inventory.apple=1;
  assert.equal(e.logicJobHint().hint,'Tänk på året i bokens tidslinje.');
});
