'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict'),{fixture}=require('./mastery-apple-retry.cjs');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'chapter3-scenes.js'),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const handler=source.slice(source.indexOf('function answerPatrol(index){'),source.indexOf('function readPatrol(){'))+';window.answer=answerPatrol;';
for(const start of [0,1,2,37])for(const choice of [0,1,3]){
 const h=fixture(3),p=h.p;p.state.daler=start;p.state.apples=2;p.persist();let feedback='',writes=0;
 const before=copy({record:p.state.record,earned:p.state.earned,review:p.state.reviewQueue,apples:p.state.apples,mastery:h.m.snapshot().state});
 const c={pilot:p,challenge:{actor:{id:'soldiers'},options:['Rätt','Fel','Fel igen'],answer:'Rätt'}};c.window=c;c.UPPDRAG_CH3_CITY_LIFE={close(){c.challenge=null;},open(actor,lines){feedback=lines[0][1];}};vm.createContext(c);vm.runInContext(handler,c);
 const persist=p.persist;p.persist=function(){writes++;c.answer(choice);persist();};c.answer(choice);c.answer(choice);
 const fee=choice===1?Math.min(2,start):0;assert.equal(p.state.daler,start-fee);assert.equal(writes,fee?1:0,'one persisted transaction, including reentrant clicks');assert.equal(JSON.parse(h.memory.get(p.saveKey)).daler,start-fee);
 assert.deepEqual(copy({record:p.state.record,earned:p.state.earned,review:p.state.reviewQueue,apples:p.state.apples,mastery:h.m.snapshot().state}),before,'only daler change');
 const reload=fixture(3,h.memory);assert.equal(reload.p.state.daler,start-fee);assert.equal(reload.p.state.apples,2);
 if(choice===1){assert(feedback.includes('Rätt'));assert(feedback.includes(fee?'böta '+fee+' daler':'inga daler'));}else assert(!feedback.includes('böta'));
}
for(const chapter of [4,5]){const c={__INTEGRATED_CHAPTER:chapter};c.window=c;vm.runInNewContext(source,c);assert.equal(c.UPPDRAG_CH3_SCENES,undefined,'the chapter-three patrol cannot start in later chapters');}
assert(source.includes('Fel svar kostar upp till <b>2 daler</b>'),'the fee is visible before choosing');assert(source.includes('utan att svara'),'leaving or reading slowly is not fined');
console.log('PASS chapter-three patrol fine: warning before answering, up to 2 daler on wrong answers, zero floor, free right/skip, no double/reentrant debit, real save/reload, unchanged apples/answers/stamps and absent in chapters 4–5');
