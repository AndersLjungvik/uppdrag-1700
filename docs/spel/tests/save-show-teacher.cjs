'use strict';
const assert=require('node:assert/strict'),{fixture}=require('./mastery-apple-retry.cjs');
const copy=x=>JSON.parse(JSON.stringify(x));
for(let ch=1;ch<=5;ch++)for(let rank=0;rank<=2;rank++){
 let h=fixture(ch),{p,m}=h,levels=['learner','journeyman','master'],areas=m.snapshot().config.areas;
 for(let r=0;r<rank;r++)for(const a of areas){m.begin(a.id,levels[r]);m.pass(a.id,levels[r]);}
 const area=areas[0];h.room(area.p);p.selectArea(area.id,levels[rank]);p.enterMemory();
 const task=p.recall.current,answer=task.fields.map(()=>'Jag har ett svar som min lärare behöver läsa.');
 answer.forEach((v,i)=>p.recall.input({target:{dataset:{rcField:String(i)},value:v}}));p.recall.action('rc-submit');assert.equal(p.recall.ui.phase,'review');
 const before=copy({record:p.state.record,earned:p.state.earned,apples:p.state.apples,daler:p.state.daler});
 p.recall.action('rc-save-review');
 assert(h.modal.innerHTML.includes(ch<=2?'id="mbTeacherCode"':'id="mbTeacher"'),'same click opens teacher review in chapter '+ch);
 assert(h.modal.innerHTML.includes(answer[0]));assert(h.modal.innerHTML.includes('data-mb="approve"'));
 assert.equal(m.snapshot().state.areas[area.id][levels[rank]].status,'pending');
 assert.deepEqual(copy({record:p.state.record,earned:p.state.earned,apples:p.state.apples,daler:p.state.daler}),before,'opening review is free and never approves itself');
 assert.deepEqual(copy(p.state.reviewQueue.at(-1).answer),copy(answer));
 p.recall.action('rc-save-review');assert.equal(p.state.reviewQueue.filter(x=>!x.resolved).length,1,'double tap never duplicates review');
 p.persist();h=fixture(ch,h.memory);assert.deepEqual(copy(h.p.state.reviewQueue.at(-1).answer),copy(answer),'written answer survives reload');
}
const h=fixture(1),p=h.p;h.room('archive');p.enterArchive();
const t=p.recall.current;t.fields.forEach((f,i)=>p.recall.input({target:{dataset:{rcField:String(i)},value:'Det här vill jag visa för läraren.'}}));p.recall.action('rc-submit');assert.equal(p.recall.ui.phase,'review');
const original=copy({queue:p.state.reviewQueue,record:p.state.record,apples:p.state.apples});p.recall.action('rc-save-review');assert(h.modal.innerHTML.includes('Svaret är sparat – visa din lärare'));assert(h.modal.innerHTML.includes('Det här vill jag visa för läraren.'));
p.recall.action('rc-save-review');assert.equal(p.state.recallPendingReview.filter(x=>x.source==='practice').length,1);assert.deepEqual(copy({queue:p.state.reviewQueue,record:p.state.record,apples:p.state.apples}),original);
p.recall.action('rc-revise');assert.equal(p.recall.ui.phase,'question');assert.equal(p.recall.ui.practiceReviewShown,false);
console.log('PASS save and show: all five chapters and three levels, one-click review, no cost/false stamp, reload, double tap and separate Rut review');
