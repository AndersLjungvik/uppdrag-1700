'use strict';
const assert=require('node:assert/strict');
const {fixture}=require('./mastery-apple-retry.cjs');
const copy=v=>JSON.parse(JSON.stringify(v));
function prepare(ch,apples=0){
 const h=fixture(ch),p=h.p,bank=h.c.UPPDRAG_RECALL_BANK;
 p.state.encountered=bank.filter(t=>t.chapter===ch&&t.rank===0&&!t.reviewOnly).map(t=>t.id);
 p.state.apples=apples;h.room('archive');assert(p.enterArchive());
 return h;
}
function answer(p){
 const t=p.recall.current;assert(t,'a real question is shown');
 t.fields.forEach((f,i)=>p.recall.input({target:{dataset:{rcField:String(i)},value:f.sample}}));
 p.recall.action('rc-submit');assert.equal(p.recall.ui.result?.status,'right',t.id);p.recall.action('rc-next');
}
function finish(p){let n=0;while(p.state.archiveMode!=='reward'){assert(++n<18,'the round finishes');answer(p);}return n;}
for(const ch of [1,2,3,4,5])for(const start of [0,1,2,3,5]){
 let h=prepare(ch,start),p=h.p;const initial=p.state.apples;
 assert(h.modal.innerHTML.includes('data-action="rc-rut-challenge"'),'challenge has a real pupil control');
 const a=h.m.snapshot().config.areas[0];h.m.begin(a.id,'learner');h.m.pass(a.id,'learner');
 p.state.record.push({id:'kept-original',answer:['Mitt tidigare svar'],ok:true});p.persist();
 const kept=copy({mastery:h.m.snapshot().state,record:p.state.record,earned:p.state.earned,daler:p.state.daler,trial:p.state.trial});
 const allowedIds=Array.from(p.recall.available);
 p.recall.action('rc-rut-challenge');assert.equal(p.state.archiveChallenge,true);assert.equal(p.state.archiveList.length,6);assert.equal(new Set(p.state.archiveList).size,6);
 const known=new Set(allowedIds.map(id=>{const t=h.c.UPPDRAG_RECALL_ENGINE.byId.get(id);return t.chapter+'/'+t.topic;}));
 for(const id of p.state.archiveList){const t=h.c.UPPDRAG_RECALL_ENGINE.byId.get(id);assert(t.chapter<=ch);assert(known.has(t.chapter+'/'+t.topic),'challenge stays within encountered content');assert(!t.reviewOnly);}
 const skipped=p.recall.current.id;p.recall.action('rc-skip');assert.equal(p.state.apples,initial,'a miss gives no apple');p.recall.action('rc-next');
 assert.notEqual(p.recall.current.id,skipped,'a missed card comes back after another memory');
 for(let i=0;i<4;i++)answer(p);
 assert.equal(p.state.apples,initial,'no partial reward before all six questions');assert.notEqual(p.state.archiveMode,'reward');
 finish(p);assert.equal(p.state.apples,Math.max(initial,3),'challenge fills the reserve without taking older apples');
 assert(h.modal.innerHTML.includes('Stora utmaningen är klar'));assert.equal(Object.keys(p.state.recallRutPassed).length,6);
 assert.deepEqual(copy({mastery:h.m.snapshot().state,record:p.state.record,earned:p.state.earned,daler:p.state.daler,trial:p.state.trial}),kept,'a resource challenge cannot award knowledge stamps or overwrite answers');
 const count=p.state.apples;for(let i=0;i<5;i++)p.recall.action('rc-next');assert.equal(p.state.apples,count,'duplicate completion actions cannot pay twice');
 p.close();p.persist();h=fixture(ch,h.memory);p=h.p;assert.equal(p.state.apples,count,'earned reserve survives reload');assert.deepEqual(copy(p.state.record),kept.record);
 if(ch<=2){p.state.apples=9;assert.equal(p.state.apples,3,'classroom reserve remains bounded at three');}
 console.log('PASS challenge chapter '+ch+', start '+initial+': six known tasks, delayed retry, no partial/double reward, kept stamps and saved reserve');
}
for(const ch of [1,2,3,4,5]){
 let h=prepare(ch),p=h.p;p.recall.action('rc-rut-challenge');for(let i=0;i<5;i++)answer(p);p.persist();h=fixture(ch,h.memory);
 assert.equal(h.p.state.apples,0,'interruption before completion never pays');assert.equal(h.p.state.archiveActive,false);
}
{
 const h=fixture(1),p=h.p;h.room('archive');p.enterArchive();const round=p.state.archiveRounds;
 assert(h.modal.innerHTML.includes(' disabled'),'starter has a visible unavailable challenge');p.recall.action('rc-rut-challenge');
 assert.notEqual(p.state.archiveChallenge,true);assert.equal(p.state.archiveRounds,round);assert.equal(p.state.apples,0);finish(p);assert.equal(p.state.apples,1,'normal repetition remains available with little prior content');
}
{
 let h=prepare(1);h.p.recall.action('rc-rut-challenge');finish(h.p);h.p.close();h.p.persist();const second=fixture(2,h.memory);assert.equal(second.p.state.apples,3,'three apples carry from the first pupil chapter into the second');
}
for(const ch of [4,5]){
 const h=prepare(ch),p=h.p;p.close();h.room('archive');p.enterMaterialReview();
 assert(!h.modal.innerHTML.includes('data-action="rc-rut-challenge"'),'explicit book-term practice has its own controls');
}
console.log('PASS interruptions, early-game alternative, classroom chapter transfer and separate material practice');
