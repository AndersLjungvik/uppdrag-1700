'use strict';
const assert=require('node:assert/strict'),{fixture}=require('./mastery-apple-retry.cjs');
const copy=x=>JSON.parse(JSON.stringify(x));
function prepare(ch,rank){
 const h=fixture(ch),levels=['learner','journeyman','master'],areas=h.m.snapshot().config.areas;
 for(let r=0;r<rank;r++)for(const a of areas){h.m.begin(a.id,levels[r]);h.m.pass(a.id,levels[r]);}
 const area=areas[0];h.room(area.p);h.p.selectArea(area.id,levels[rank]);h.p.enterMemory();
 const run=h.p.scenes[h.p.state.step],byId=h.c.UPPDRAG_RECALL_ENGINE.byId;
 const index=run.f.findIndex(id=>byId.get(id).fields.some(f=>!f.answers));if(index>=0)h.p.state.index=index;
 h.p.state.recallUI=null;h.p.recall.render();
 h.p.state.encountered=[...new Set([...h.p.state.encountered,...h.c.UPPDRAG_RECALL_BANK.filter(t=>t.chapter<=ch&&t.rank===0).map(t=>t.id)])];
 return {...h,area,rank,levels};
}
function answer(p){const t=p.recall.current;t.fields.forEach((f,i)=>p.recall.input({target:{dataset:{rcField:String(i)},value:f.sample}}));p.recall.action('rc-submit');assert.equal(p.recall.ui.result.status,'right',t.id);p.recall.action('rc-next');}
for(const ch of [1,2,3,4,5])for(const rank of [0,1,2]){
 let h=prepare(ch,rank),p=h.p,t=p.recall.current;const id=t.id,original=copy(t);
 if(rank===0)p.recall.action('rc-skip');
 else{t.fields.forEach((f,i)=>p.recall.input({target:{dataset:{rcField:String(i)},value:'Jag vill fundera mer på den här frågan.'}}));p.recall.action('rc-submit');assert.equal(p.recall.ui.phase,'review');if(rank===1)p.recall.action('rc-save-review');}
 assert(p.state.recallRutFocus.includes(id),'the actual failed or uncertain task is remembered');
 const before=copy({record:p.state.record,earned:p.state.earned,daler:p.state.daler,mastery:h.m.snapshot().state,reviewQueue:p.state.reviewQueue});
 p.persist();h=fixture(ch,h.memory);p=h.p;h.room('archive');assert.equal(p.enterArchive(),true);
 assert.equal(p.state.archiveList[0],id,'the specific missed task starts the round, before random known topics');
 assert.equal(p.recall.current.prompt,original.kind==='tf'?original.drill.prompt:original.prompt,'the full question is kept, with true/false knowledge as a recall question');
 if(original.kind!=='tf')assert.equal(p.recall.current.fields.length,h.c.UPPDRAG_PROMPT_ALIGNMENT.openTask(original).fields.length,'all parts of an explanation are practised');
 assert(h.modal.innerHTML.includes('Vi börjar med det du vill öva mer på.'));
 const topic=original.chapter+'/'+original.topic;
 assert.equal(p.state.archiveList.filter(x=>{const q=h.c.UPPDRAG_RECALL_ENGINE.byId.get(x);return q.chapter+'/'+q.topic===topic;}).length,1,'a simpler same-topic question cannot replace or duplicate the focus');
 assert.equal(p.state.apples,0);p.recall.action('rc-skip');p.recall.action('rc-next');
 assert.notEqual(p.recall.current.id,id,'another memory separates retries of the missed question');assert(p.state.recallRutFocus.includes(id));
 let returned=false,n=0;while(p.state.archiveMode!=='reward'){assert(++n<15);if(p.recall.current.id===id)returned=true;answer(p);}
 assert(returned,'the focused question is actually asked again before the reward');assert.equal(p.state.apples,1);
 assert(!p.state.recallRutFocus.includes(id),'successful focused practice clears its priority');
 assert.deepEqual(copy({record:p.state.record,earned:p.state.earned,daler:p.state.daler,mastery:h.m.snapshot().state,reviewQueue:p.state.reviewQueue}),before,'Rut does not resolve the main test or replace the saved response');
 p.recall.action('rc-rut-again');assert(!p.state.archiveFocused.includes(id),'completed focused practice is not an endless pending-review priority');
 console.log('PASS targeted Rut chapter '+ch+', rank '+rank+': exact knowledge first, complete explanation, spaced retry, reward only after practice, saved progress');
}
// Older saves have no focus field: failed needs and pending reviews still win
// over topic deduplication; leaving halfway never loses the request.
for(const mode of ['needs','review','unsaved-review']){
 let h=prepare(1,2),p=h.p,id=p.recall.current.id;
 p.recall.current.fields.forEach((f,i)=>p.recall.input({target:{dataset:{rcField:String(i)},value:'Jag vill fundera vidare på det.'}}));p.recall.action('rc-submit');
 if(mode==='review')p.recall.action('rc-save-review');
 delete p.state.recallRutFocus;if(mode==='needs')p.state.recallNeeds=[id,'missing-task','rc5-power-2'];p.persist();
 h=fixture(1,h.memory);p=h.p;h.room('archive');p.enterArchive();assert.equal(p.state.archiveList[0],id);assert(p.state.archiveList.every(x=>h.c.UPPDRAG_RECALL_ENGINE.byId.get(x).chapter<=1));
 p.close();p.persist();h=fixture(1,h.memory);h.room('archive');h.p.enterArchive();assert.equal(h.p.state.archiveList[0],id);assert.equal(h.p.state.apples,0);
}
console.log('PASS targeted Rut migration: old failed/pending/unsaved review, interrupted practice, reload and no future questions');
for(const ch of [4,5]){
 const h=prepare(ch,2),p=h.p,focus=p.recall.current.id;p.state.recallRutFocus=[focus];h.room('archive');assert.equal(p.enterMaterialReview(),true);
 assert.equal(p.state.archiveFocused.length,0);assert(p.state.archiveList.length>0);assert(p.state.archiveList.every(id=>id.startsWith('material'+ch+'-')),'explicit material practice keeps its chosen bank');
 p.close();h.room('archive');p.enterArchive();assert.equal(p.state.archiveList[0],focus,'the normal mixed round still starts with the focused main question');
}
console.log('PASS targeted Rut and explicit material practice remain separate in chapters 4–5');
