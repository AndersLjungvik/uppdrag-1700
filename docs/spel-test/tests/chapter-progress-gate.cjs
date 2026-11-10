'use strict';
const assert=require('node:assert/strict'),{fixture}=require('./mastery-apple-retry.cjs');
const copy=x=>JSON.parse(JSON.stringify(x));
for(const ch of [2,3,4]){
 const h=fixture(ch),p=h.p,m=h.m,a=m.snapshot().config.areas[0];
 // A real saved attempt may already be in progress when the teacher restores
 // the prerequisite. It must be retained, but cannot produce another stamp.
 h.room(a.p);p.selectArea(a.id,'learner');p.enterMemory();
 const before=copy({mastery:m.snapshot().state,record:p.state.record,apples:p.state.apples,daler:p.state.daler});
 h.c.UPPDRAG_CHAPTER_PROGRESS_ALLOWED=()=>false;
 assert.equal(m.levelUnlocked('learner'),false);assert.equal(m.begin(a.id,'learner').ok,false);assert.equal(m.pass(a.id,'learner').ok,false);
 assert.equal(m.buyHint(a.id,'learner').ok,false);assert.equal(m.retryWithApple(a.id,'learner').ok,false);
 p.recall.action('rc-submit');assert(h.modal.innerHTML.includes('proven är låsta'));
 assert(h.modal.innerHTML.includes('data-level="learner" class="mb-locked" disabled'));
 assert.equal(p.selectArea(a.id,'learner'),false);
 assert.deepEqual(copy({mastery:m.snapshot().state,record:p.state.record,apples:p.state.apples,daler:p.state.daler}),before,'the lock never removes saved answers, consumes resources or awards a stamp');
 // Once the real prerequisite is complete, the exact paused attempt resumes.
 h.c.UPPDRAG_CHAPTER_PROGRESS_ALLOWED=()=>true;
 assert.equal(m.levelUnlocked('learner'),true);assert.equal(p.selectArea(a.id,'learner'),true);p.enterMemory();assert(p.recall.current);
 assert.equal(m.snapshot().state.areas[a.id].learner.attempt,before.mastery.areas[a.id].learner.attempt);
 assert.equal(m.levelUnlocked('journeyman'),false,'within-chapter level gates remain in force');
}
console.log('PASS sequential chapter mastery: blocked learner/pass/hint/retry and saved quiz actions, clear explanation, preserved attempt, genuine unlock');
