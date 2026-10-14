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
  assert.equal(e.state.botany.solved,false);assert.equal(Object.keys(e.state.botany.placements).length,0);
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
  assert(solve(e,NOW).rewarded);assert.equal(e.state.inventory.apple,1);assert.equal(e.state.coins,1);
  e.setState(JSON.parse(JSON.stringify(e.state)));e.logicBeginReview(NOW+1000);assert.equal(solve(e,NOW+1000).rewarded,false);
  for(let i=0;i<5;i++)e.logicNewDay();e.logicBeginReview(NOW+2000);assert.equal(solve(e,NOW+2000).rewarded,false);
  assert.equal(e.state.coins,1);e.logicBeginReview(NOW+DAY);assert(solve(e,NOW+DAY).rewarded);assert.equal(e.state.inventory.apple,2);assert.equal(e.state.coins,2);
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

test('year clues narrow the decade without revealing the full year',()=>{
  const e=engine();assert(e.logicBeginJob('press').ok);e.state.inventory.apple=1;
  const hint=e.logicJobHint().hint;assert(hint.includes('1760-talet'));assert(!hint.includes('1766'));
});

test('plant sorting saves drafts, permits retries and awards and delivers seeds once',()=>{
  const e=engine();assert.equal(e.logicSortPlants().reason,'incomplete');
  assert(e.logicPlantPlacement('canina','Viola').ok);
  assert.equal(e.logicPlantPlacement('unknown','Rosa').ok,false);
  assert.equal(e.logicPlantPlacement('tricolor','bad').ok,false);
  for(const [id,g] of [['tricolor','Viola'],['gallica','Rosa'],['odorata','Viola']])e.logicPlantPlacement(id,g);
  e.setState(JSON.parse(JSON.stringify(e.state)));
  assert.equal(e.state.botany.placements.canina,'Viola');assert.equal(e.logicSortPlants().reason,'order');
  assert.equal(e.state.failedToday.length,0);assert.equal(e.state.food,2);assert.equal(e.state.time,0);
  e.logicPlantPlacement('canina','');assert.equal(e.logicSortPlants().reason,'incomplete');
  e.logicPlantPlacement('canina','Rosa');assert(e.logicSortPlants().ok);assert.equal(e.state.inventory.seeds,1);
  e.setState(JSON.parse(JSON.stringify(e.state)));assert.equal(e.logicSortPlants().reason,'solved');
  assert.equal(e.logicPlantPlacement('canina','Viola').ok,false);assert(e.logicDeliverSeeds().ok);
  assert(!e.state.inventory.seeds);assert.equal(e.state.hintCredits.farm,1);
  e.setState(JSON.parse(JSON.stringify(e.state)));assert.equal(e.logicDeliverSeeds().ok,false);
  assert(e.logicBeginJob('farm').ok);assert(e.logicJobHint().ok);
  const q=e.mission('farm').cards[0];e.logicAnswer(q,q.answer,false);assert(e.state.answers[q.id].lastSupported);
});

test('garden reward preserves finished farm jobs and sanitizes saved choices',()=>{
  const e=engine(),s=e.blankState();s.completed=['farm'];s.inventory.seeds=1;
  s.botany={placements:{canina:'Rosa',odorata:'bad',unknown:'Viola'},solved:true,delivered:false};e.setState(s);
  assert.equal(Object.keys(e.state.botany.placements).length,1);assert.equal(e.logicDeliverSeeds().ok,false);
  assert.equal(e.state.inventory.seeds,1);assert.equal(Object.keys(e.state.answers).length,0);
});

test('repeat printing charges once, limits holdings and daily delivery and resumes after reload',()=>{
  const e=engine();for(const id of ['ink','paper','type']){e.logicCollect(id);e.logicPlace(id)}
  assert(e.logicPrint().ok);assert.equal(e.state.coins,0);assert.equal(e.logicPrint().reason,'holding');
  assert(e.logicDeliverProof().ok);assert.equal(e.logicPrint().reason,'daily');
  e.logicNewDay();assert.equal(e.logicPrint().reason,'money');e.state.coins=2;
  assert(e.logicPrint().ok);assert.equal(e.state.coins,1);assert.equal(e.logicPrint().reason,'holding');
  e.setState(JSON.parse(JSON.stringify(e.state)));assert(e.logicDeliverProof().ok);assert.equal(e.state.hintCredits.ideas,2);
  assert.equal(e.state.workshop.printCount,2);assert.equal(e.logicDeliverProof().ok,false);
  e.logicBeginJob('ideas');assert(e.logicJobHint().ok);assert.equal(e.state.hintCredits.ideas,1);
  const q=e.mission('ideas').cards[0];e.logicAnswer(q,q.answer,false);assert(e.state.answers[q.id].lastSupported);
});

test('old delivered proofs retain today limit and finished cafe rejects repeat printing',()=>{
  const e=engine();e.setState({version:2,day:4,coins:9,workshop:{printed:true,delivered:true}});
  assert.equal(e.state.workshop.lastDeliveredDay,4);assert.equal(e.state.workshop.printCount,1);
  assert.equal(e.logicPrint().reason,'daily');e.logicNewDay();e.state.completed=['ideas'];
  assert.equal(e.logicPrint().reason,'finished');e.state.inventory.proof=1;
  assert.equal(e.logicDeliverProof().reason,'finished');assert.equal(e.state.inventory.proof,1);assert.equal(e.state.coins,9);
});

test('paper errands preserve packages on reload and pay once per game day without knowledge credit',()=>{
  const e=engine();assert.equal(e.logicTakePaperParcel().ok,false);assert(e.logicBeginPaperErrand().ok);
  assert(e.logicTakePaperParcel().ok);assert.equal(e.logicTakePaperParcel().ok,false);
  e.setState(JSON.parse(JSON.stringify(e.state)));assert(e.logicDeliverPaperParcel().ok);
  assert.equal(e.state.coins,1);assert(!e.state.inventory.paperParcel);assert.equal(e.state.food,2);assert.equal(e.state.time,0);
  assert.equal(e.logicBeginPaperErrand().reason,'daily');assert.equal(e.logicDeliverPaperParcel().ok,false);
  e.setState(JSON.parse(JSON.stringify(e.state)));assert.equal(e.logicBeginPaperErrand().reason,'daily');
  e.logicNewDay();assert(e.logicBeginPaperErrand().ok);assert(e.logicTakePaperParcel().ok);assert(e.logicDeliverPaperParcel().ok);
  assert.equal(e.state.coins,2);assert.equal(Object.keys(e.state.answers).length,0);
});
