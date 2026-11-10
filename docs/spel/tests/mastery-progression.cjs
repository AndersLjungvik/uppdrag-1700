'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','mastery-progression.js'),'utf8');
const mem=new Map();let apples=2,daler=3;
function load(){const sandbox={window:{},localStorage:{getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v))}};vm.runInNewContext(code,sandbox);return sandbox.window.UPPDRAG_MASTERY.configure({chapter:1,areas:[{id:'start'},{id:'law'},{id:'trade'}],resources:{getApples:()=>apples,setApples:v=>apples=v,getDaler:()=>daler,setDaler:v=>daler=v}});}
let m=load();
assert.equal(m.begin('start','master').reason,'locked');
assert.equal(m.pass('start','master').ok,false);
assert.equal(m.begin('trade','learner').ok,true);
assert.equal(m.buyHint('trade','learner').ok,true);assert.equal(daler,2);
m.fail('trade','learner');
assert.equal(m.begin('trade','learner').reason,'failed','failure cannot bypass apple');
assert.equal(m.pass('trade','learner').ok,false);
assert.equal(m.retryWithApple('trade','learner').ok,true);assert.equal(apples,1);
assert.equal(m.retryWithApple('trade','learner').ok,false);assert.equal(apples,1);
assert.equal(m.begin('trade','learner').attempt,2);m.pass('trade','learner');
assert.equal(m.buyHint('trade','learner').reason,'not-in-progress');
for(const id of ['law','start']){m.begin(id,'learner');m.pass(id,'learner');}
assert.equal(m.levelUnlocked('journeyman'),true);
assert.equal(m.buyHint('start','journeyman').reason,'learner-only');assert.equal(daler,2);
m.begin('law','journeyman');m.pending('law','journeyman');
assert.equal(m.begin('law','journeyman').reason,'pending');
assert.equal(apples,1,'pending review itself is free');
m=load();assert.equal(m.snapshot().state.areas.law.journeyman.status,'pending');
m.resumePending('law','journeyman');m.pass('law','journeyman');
for(const id of ['trade','start']){m.begin(id,'journeyman');m.pass(id,'journeyman');}
for(const id of ['law','trade']){m.begin(id,'master');m.pass(id,'master');}
assert.equal(m.chapterComplete(),false);m.begin('start','master');m.pass('start','master');
assert.equal(m.chapterComplete(),true);m=load();assert.equal(m.chapterComplete(),true);
// Side-adventure data is never modified by any mastery operation or reset.
mem.set('uppdrag1700.side-adventures.v1','{"wagon":"cleared"}');m.reset();assert.equal(mem.get('uppdrag1700.side-adventures.v1'),'{"wagon":"cleared"}');
mem.set('uppdrag1700.mastery.v1.ch1','{"v":1,"chapter":1,"areas":null}');m=load();assert.equal(m.summary().done,0);
// A chapter may reopen a pending review only after it verifies fresh practice.
// The new attempt consumes one apple and allocates no stamp; begin gives it a new identity.
const json=v=>JSON.parse(JSON.stringify(v));
const historyBeforeBlocked=JSON.stringify(m.snapshot().state.history);
assert.equal(m.reopenPending('start','learner').ok,false,'available is not a review');
assert.equal(m.reopenPending('start','master').ok,false,'locked is not a review');
assert.equal(JSON.stringify(m.snapshot().state.history),historyBeforeBlocked);
m.begin('trade','learner');m.pass('trade','learner');
m.begin('law','learner');m.fail('law','learner');
m.begin('start','learner');
assert.equal(m.reopenPending('start','learner').ok,false,'in-progress cannot restart for free');
m.pending('start','learner');
const beforePracticeRetry=json(m.snapshot().state),applesBeforePracticeRetry=apples,dalerBeforePracticeRetry=daler;
apples=0;assert.equal(m.reopenPending('start','learner').reason,'no-apples');assert.deepEqual(json(m.snapshot().state),beforePracticeRetry);apples=applesBeforePracticeRetry;
assert.equal(m.reopenPending('start','learner').ok,true);
const afterPracticeRetry=json(m.snapshot().state);
assert.equal(afterPracticeRetry.areas.start.learner.status,'available');
assert.equal(afterPracticeRetry.areas.start.learner.attempt,1);
assert.deepEqual(afterPracticeRetry.areas.trade,beforePracticeRetry.areas.trade,'other clear stamps are retained');
assert.deepEqual(afterPracticeRetry.areas.law,beforePracticeRetry.areas.law,'other failed areas remain failed');
assert.equal(apples,applesBeforePracticeRetry-1);assert.equal(daler,dalerBeforePracticeRetry);
assert.deepEqual(afterPracticeRetry.history.slice(0,-1),beforePracticeRetry.history,'all previous events are preserved');
assert.equal(afterPracticeRetry.history.at(-1).type,'apple-retry');
assert.equal(afterPracticeRetry.history.at(-1).area,'start');
assert.equal(afterPracticeRetry.history.at(-1).level,'learner');
assert.equal(afterPracticeRetry.history.at(-1).remaining,apples);
assert.equal(m.pass('start','learner').ok,false,'reopening alone cannot award a stamp');
assert.equal(m.reopenPending('start','learner').ok,false,'the same pending review cannot be reopened twice');
assert.equal(m.reopenPending('law','learner').ok,false,'actual failures still require an apple');
assert.equal(m.reopenPending('trade','learner').ok,false,'completed stamps cannot be restarted');
m=load();assert.equal(m.snapshot().state.areas.start.learner.status,'available','reopening persists across reload');
assert.equal(m.begin('start','learner').attempt,2,'the new test gets a new attempt identity');
assert.equal(m.chapterComplete(),false);assert.equal(m.levelUnlocked('journeyman'),false);
console.log('PASS mastery: gates, pending review, whole-attempt retry, hint scope, reload and separate saves');
