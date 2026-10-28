'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(require('path').join(__dirname,'..','mastery-progression.js'),'utf8');
const mem=new Map();
const sandbox={window:{},localStorage:{getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v))},Date,JSON,Error,Number,Set};
vm.createContext(sandbox);vm.runInContext(code,sandbox);
let apples=2,daler=3;
const m=sandbox.window.UPPDRAG_MASTERY.configure({chapter:1,areas:[
 {id:'start',name:'Frihetstidens början',place:'Slottet'},
 {id:'law',name:'Lagar och inflytande',place:'Riksdagshuset'},
 {id:'trade',name:'Handel med Asien',place:'Kajen'}
],resources:{getApples:()=>apples,setApples:v=>apples=v,getDaler:()=>daler,setDaler:v=>daler=v}});
assert.equal(m.levelUnlocked('journeyman'),false);
assert.equal(m.begin('start','learner').ok,true);
m.pass('start','learner');m.pass('law','learner');
assert.equal(m.levelUnlocked('journeyman'),false);
m.pass('trade','learner');
assert.equal(m.levelUnlocked('journeyman'),true);
assert.equal(m.buyHint('start','journeyman').reason,'learner-only');
assert.equal(m.buyHint('start','learner').ok,true);assert.equal(daler,2);
m.begin('start','journeyman');m.fail('start','journeyman');
assert.equal(m.retryWithApple('start','journeyman').ok,true);assert.equal(apples,1);
m.pass('start','journeyman');m.pass('law','journeyman');m.pass('trade','journeyman');
assert.equal(m.levelUnlocked('master'),true);
m.pass('start','master');m.pass('law','master');assert.equal(m.chapterComplete(),false);
m.pass('trade','master');assert.equal(m.chapterComplete(),true);
console.log('mastery-progression: ok');