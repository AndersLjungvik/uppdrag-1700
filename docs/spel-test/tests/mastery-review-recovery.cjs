'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const LEVELS=['learner','journeyman','master'];
const SAVED='2026-11-03T09:10:02.000Z',SUBMITTED='2026-11-03T09:10:00.000Z';
function fixture({chapter=4,rank=0,status='pending',attempt=2,legacy=false}={}){
 const areas=legacy?[{id:'start',p:'cafe'},{id:'law',p:'riksdag'},{id:'trade',p:'quay'}]:[{id:'reading',p:'church'},{id:'freedoms',p:'print'},{id:'research',p:'science'},{id:'ekeblad',p:'farm'}];
 const target=legacy?areas[0]:areas[2],slot=areas.indexOf(target)+1,step=slot+rank*areas.length;
 const bank=[],runs=[{p:'cafe',r:0,f:[]}];
 for(let r=0;r<3;r++)for(const a of areas){
  const task={id:'rc'+chapter+'-'+a.id+'-'+r,chapter,rank:r,place:a.p,fields:[{label:'Förklaring'},{label:'Ett konkret exempel'}]};bank.push(task);
  runs.push({p:a.p,r,f:[task.id],...(!legacy?{area:a.id}:{})});
 }
 const core=bank.find(t=>t.id===runs[step].f[0]);
 const one={id:'rc'+chapter+'-one-field-1',chapter,rank:1,place:target.p,fields:[{label:'Ditt svar'}]};bank.push(one);runs[slot+areas.length].f.push(one.id);
 const material={id:'material'+chapter+'-sos-rut',chapter,rank:0,reviewOnly:true,fields:[{label:'Ditt korta svar'}]};bank.push(material);
 const foreign={id:'rc'+(chapter===1?2:1)+'-foreign-0',chapter:chapter===1?2:1,rank:0,fields:[{label:'Ditt svar'}]};bank.push(foreign);
 const cells={};for(const a of areas){cells[a.id]={};for(let r=0;r<3;r++)cells[a.id][LEVELS[r]]={status:r<rank?'clear':r===rank?'available':'locked',attempt:1};}
 cells[target.id][LEVELS[rank]]={status,attempt};
 const raw={v:1,chapter,areas:cells,history:[{type:'begin',area:target.id,level:LEVELS[rank],attempt,at:'2026-11-03T09:00:00.000Z'}]};
 const memory=new Map([['uppdrag1700.mastery.v1.ch'+chapter,JSON.stringify(raw)],['uppdrag1700.side-adventures.v1','{"v":1,"chapters":{"4":{"thief":"won","wagon":"cleared"}}}']]);
 const sandbox={window:{},localStorage:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v))}};vm.createContext(sandbox);
 vm.runInContext(read('mastery-progression.js'),sandbox);vm.runInContext(read('mastery-review-recovery.js'),sandbox);
 const mastery=sandbox.window.UPPDRAG_MASTERY.configure({chapter,areas,resources:{getApples:()=>3,getDaler:()=>9,setApples(){throw Error('Recovery must not spend apples');},setDaler(){throw Error('Recovery must not change money');}}});
 const state={v:2,step,trial:attempt,index:0,daler:9,apples:3,earned:{older:true},record:[{id:'older-main',ok:true,answer:['Eget tidigare svar']}],history:[{kind:'story',value:'brevet kvar'}],sessions:{[step]:{index:0,draft:'Bevarat huvudutkast',recallUI:{phase:'question',drafts:['Mitt svar','']}}},reviewQueue:[],recallEvidence:[]};
 const context={chapter,state,bank,runs,areas,mastery},api=sandbox.window.UPPDRAG_MASTERY_REVIEW;
 const queue=(id=material.id,answer=['Ett svar hos Rut'],extra={})=>{const e={id,step,trial:attempt,index:0,answer:copy(answer),at:SAVED,...extra};state.reviewQueue.push(e);return e;};
 const evidence=(entry,effectiveRank=1,extra={})=>state.recallEvidence.push({id:entry.id,step:entry.step,rank:effectiveRank,answer:copy(entry.answer),assessment:'review',at:SUBMITTED,...extra});
 return {api,context,state,bank,runs,areas,mastery,memory,core,material,foreign,one,step,target,level:LEVELS[rank],queue,evidence,cell:()=>mastery.snapshot().state.areas[target.id][LEVELS[rank]],recover:()=>copy(api.recover(context))};
}
// A non-main id must never be rendered or approved as part of an area's test.
{
 const h=fixture(),e=h.queue();assert.equal(h.api.mainTask(e,h.context),null);assert.equal(h.api.mainTask({...e,id:h.foreign.id},h.context),null);
 assert.equal(h.api.mainTask({...e,id:h.core.id},h.context).id,h.core.id);
 assert.equal(h.api.mainTask({...e,id:h.core.id,step:999},h.context),null);
 const other=h.bank.find(t=>t.chapter===4&&t.place==='church'&&t.rank===0);assert.equal(h.api.mainTask({...e,id:other.id},h.context),null,'right chapter and rank still require the right run');
 assert.equal(h.api.mainTask({...e,id:h.core.id,step:h.step+h.areas.length},h.context),null,'a task from another level cannot qualify');
 const wrongRank=h.bank.find(t=>t.place==='science'&&t.rank===1);h.runs[h.step].f.push(h.material.id,h.foreign.id,wrongRank.id);
 assert.equal(h.api.mainTask({...e,id:h.material.id},h.context),null,'reviewOnly remains excluded even if accidentally listed in a run');
 assert.equal(h.api.mainTask({...e,id:h.foreign.id},h.context),null,'a foreign chapter remains excluded even if accidentally listed in a run');
 assert.equal(h.api.mainTask({...e,id:wrongRank.id},h.context),null,'rank must match even if an id is accidentally listed in a run');
}
// The actual mastery engine resumes a proven false block without any new credit.
{
 const h=fixture(),e=h.queue(),original=copy(h.state),mBefore=copy(h.mastery.snapshot().state),side=h.memory.get('uppdrag1700.side-adventures.v1');
 assert.deepEqual(h.recover(),{moved:1,resumed:1});assert.equal(e.resolved,'practice-separated');assert.equal(e.reviewSource,'practice');assert.equal(h.cell().status,'in-progress');assert.equal(h.cell().attempt,2);
 assert.deepEqual(copy(h.state.recallPendingReview),[{id:e.id,answer:original.reviewQueue[0].answer,at:SAVED,source:'practice',originStep:h.step,originTrial:2}]);
 for(const k of ['daler','apples','earned','record','history','sessions','recallEvidence'])assert.deepEqual(copy(h.state[k]),original[k],k+' is preserved');
 assert.deepEqual(copy(h.mastery.snapshot().state.history),mBefore.history);assert.equal(h.memory.get('uppdrag1700.side-adventures.v1'),side);assert.equal(h.mastery.chapterComplete(),false);
 const after=copy(h.state),masteryAfter=copy(h.mastery.snapshot().state);assert.deepEqual(h.recover(),{moved:0,resumed:0});assert.deepEqual(copy(h.state),after);assert.deepEqual(copy(h.mastery.snapshot().state),masteryAfter);
}
// A Rut drill can have the same core id as the paused test: its evidence identifies it.
for(const rank of [0,1,2]){
 const h=fixture({rank}),e=h.queue(h.core.id,['Kort drill-svar']);h.evidence(e,1);
 assert.deepEqual(h.recover(),{moved:1,resumed:1},'same id drill at level '+rank);assert.equal(h.cell().status,'in-progress');
}
// A genuine unfinished answer keeps all its field slots, including an empty slot.
{
 const h=fixture({rank:1}),e=h.queue(h.core.id,['Egen ofullständig förklaring','']);h.evidence(e,1);
 assert.deepEqual(h.recover(),{moved:0,resumed:0});assert.equal(h.cell().status,'pending');assert.equal(e.resolved,undefined);assert.equal(h.state.recallPendingReview,undefined);
}
// A one-field rank-one question is ambiguous and must retain its genuine pending state.
{
 const h=fixture({rank:1}),run=h.runs[h.step],e=h.queue(h.one.id,['Mina egna ord'],{index:run.f.indexOf(h.one.id)});h.evidence(e,1);
 assert.deepEqual(h.recover(),{moved:0,resumed:0});assert.equal(h.cell().status,'pending');assert.equal(e.resolved,undefined);
}
// Supported but correct master answers are also legitimate pending reviews, even without evidence.
{
 const h=fixture({rank:2}),e=h.queue(h.core.id,['Förklaring med stöd','Rätt konkret exempel']);
 h.state.record.push({version:'recall-2-rubric',id:e.id,step:e.step,trial:e.trial,ok:true,support:true,independent:false,assessment:'rubric-checked',answer:copy(e.answer)});
 assert.deepEqual(h.recover(),{moved:0,resumed:0});assert.equal(h.cell().status,'pending');assert.equal(e.resolved,undefined);
}
// Practice may be separated while a genuine review still blocks the same attempt.
{
 const h=fixture({rank:2});h.core.fields=[{label:'Förklaring'}];const e=h.queue(h.core.id,['Samma egna formulering']);h.evidence(e,1);
 h.state.record.push({version:'recall-2-rubric',id:e.id,step:e.step,trial:e.trial,ok:true,support:true,independent:false,answer:copy(e.answer),at:'2026-11-03T09:10:01.000Z'});
 assert.deepEqual(h.recover(),{moved:0,resumed:0},'newer real supported main evidence overrides an older identical drill answer');assert.equal(h.cell().status,'pending');
}
{
 const h=fixture({rank:1}),bad=h.queue(),valid=h.queue(h.core.id,['Mitt ofullständiga svar','']);h.evidence(valid,1);
 assert.deepEqual(h.recover(),{moved:1,resumed:0});assert.equal(bad.resolved,'practice-separated');assert.equal(valid.resolved,undefined);assert.equal(h.cell().status,'pending');
}
for(const status of ['failed','clear','in-progress','available']){
 const h=fixture({status}),before=copy(h.mastery.snapshot().state);h.queue();assert.deepEqual(h.recover(),{moved:1,resumed:0});assert.deepEqual(copy(h.mastery.snapshot().state),before,status+' cannot be converted to a fresh attempt');
}
{
 const h=fixture({attempt:3});h.queue(undefined,undefined,{trial:2});assert.deepEqual(h.recover(),{moved:1,resumed:0});assert.equal(h.cell().status,'pending');assert.equal(h.cell().attempt,3);
}
// Only the closest preceding matching evidence may disambiguate a reused id/answer.
{
 const h=fixture({rank:0}),e=h.queue(h.core.id,['Första ledet','Andra ledet']);h.evidence(e,1,{at:'2026-11-03T09:09:00.000Z'});h.evidence(e,0,{at:'2026-11-03T09:10:01.000Z'});
 assert.deepEqual(h.recover(),{moved:0,resumed:0},'a later genuine answer supersedes older drill evidence');
}
{
 const h=fixture({rank:0}),e=h.queue(h.core.id,['Första ledet','Andra ledet']);h.evidence(e,0);h.evidence(e,1,{at:'2026-11-03T09:10:03.000Z'});
 assert.deepEqual(h.recover(),{moved:0,resumed:0},'evidence after the save cannot classify an older review');
}
{
 const h=fixture(),e=h.queue();h.state.recallPendingReview=[{id:e.id,answer:copy(e.answer),at:e.at,source:'practice'}];assert.deepEqual(h.recover(),{moved:1,resumed:1});assert.equal(h.state.recallPendingReview.length,1,'existing saved practice is not duplicated');
}
{
 const h=fixture(),e=h.queue(undefined,undefined,{resolved:'approved'}),before=copy(h.state);assert.deepEqual(h.recover(),{moved:0,resumed:0});assert.deepEqual(copy(h.state),before);assert.equal(e.resolved,'approved','resolved history stays intact');
}
// Chapter one has no run.area; its original place mapping still identifies the cell.
{
 const h=fixture({chapter:1,legacy:true});assert.equal(h.runs[h.step].area,undefined);assert.equal(h.target.id,'start');h.queue();assert.deepEqual(h.recover(),{moved:1,resumed:1});assert.equal(h.cell().status,'in-progress');
}
for(const chapter of [2,3,5]){
 const h=fixture({chapter}),e=h.queue();assert.deepEqual(h.recover(),{moved:1,resumed:1});assert.equal(h.state.recallPendingReview[0].id,e.id);assert.equal(h.cell().status,'in-progress');
}
console.log('PASS review recovery: foreign and same-id practice, all chapters, real mastery resumption, preserved genuine/ambiguous/supported reviews, mixed queues, attempt/status guards, evidence chronology, idempotence and unchanged resources/history');
