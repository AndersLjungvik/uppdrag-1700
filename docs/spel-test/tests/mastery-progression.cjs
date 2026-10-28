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
assert.equal(m.retryWithApple('law','journeyman').ok,false);assert.equal(apples,1);
m=load();assert.equal(m.snapshot().state.areas.law.journeyman.status,'pending');
m.resumePending('law','journeyman');m.pass('law','journeyman');
for(const id of ['trade','start']){m.begin(id,'journeyman');m.pass(id,'journeyman');}
for(const id of ['law','trade']){m.begin(id,'master');m.pass(id,'master');}
assert.equal(m.chapterComplete(),false);m.begin('start','master');m.pass('start','master');
assert.equal(m.chapterComplete(),true);m=load();assert.equal(m.chapterComplete(),true);
// Side-adventure data is never modified by any mastery operation or reset.
mem.set('uppdrag1700.side-adventures.v1','{"wagon":"cleared"}');m.reset();assert.equal(mem.get('uppdrag1700.side-adventures.v1'),'{"wagon":"cleared"}');
mem.set('uppdrag1700.mastery.v1.ch1','{"v":1,"chapter":1,"areas":null}');m=load();assert.equal(m.summary().done,0);
console.log('PASS mastery: gates, pending review, whole-attempt retry, hint scope, reload and separate saves');
