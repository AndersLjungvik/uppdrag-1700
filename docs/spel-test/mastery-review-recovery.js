/* Repair reviews that the old adapter accidentally attached to a paused test.
 * Preserve answers and history. Resume only a proven, same-attempt false block;
 * never infer a pass, spend resources, or dismiss an ambiguous genuine review. */
(function(){
'use strict';
const levels=['learner','journeyman','master'];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function mainTask(entry,{chapter,bank,runs}){
 const run=runs[entry?.step],task=bank.find(t=>t.id===entry?.id);
 return run&&task&&!task.reviewOnly&&task.chapter===chapter&&task.rank===run.r&&run.f.includes(task.id)?task:null;
}
function practice(entry,context){
 const task=mainTask(entry,context);if(!task)return true;
 const run=context.runs[entry.step];
 if(Number.isInteger(entry.index)&&run.f[entry.index]!==entry.id)return true;
 const savedAt=Date.parse(entry.at);
 const evidence=(context.state.recallEvidence||[]).filter(e=>e.id===entry.id&&e.step===entry.step&&same(e.answer,entry.answer)&&Number.isFinite(savedAt)&&Date.parse(e.at)<=savedAt).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at))[0];
 // A later, genuinely recorded main answer can reuse words from an earlier
 // drill. Supported correct master answers still need their real review.
 const mainAnswer=(context.state.record||[]).some(e=>e.version==='recall-2-rubric'&&e.id===entry.id&&e.step===entry.step&&e.trial===entry.trial&&e.ok&&!e['beforeChapter'+context.chapter+'Mastery']&&same(e.answer,entry.answer)&&Date.parse(e.at)<=savedAt&&(!evidence||Date.parse(e.at)>=Date.parse(evidence.at)));
 if(mainAnswer)return false;
 if(!evidence||evidence.rank!==1)return false;
 return run.r!==1||entry.answer?.length===1&&task.fields.length>1;
}
function recover(context){
 const {state:s,runs,areas,mastery}=context;
 const affected=new Map();let moved=0,resumed=0;
 for(const entry of s.reviewQueue||[]){
  if(entry.resolved||!practice(entry,context))continue;
  s.recallPendingReview??=[];
  if(!s.recallPendingReview.some(e=>e.id===entry.id&&e.at===entry.at&&same(e.answer,entry.answer)))s.recallPendingReview.push({id:entry.id,answer:Array.isArray(entry.answer)?entry.answer.slice():[],at:entry.at,source:'practice',originStep:entry.step,originTrial:entry.trial});
  entry.resolved='practice-separated';entry.reviewSource='practice';moved++;
  affected.set(entry.step+'|'+entry.trial,{step:entry.step,trial:entry.trial});
 }
 for(const {step,trial} of affected.values()){
  const run=runs[step],area=run&&(areas.find(a=>a.id===run.area)||areas.find(a=>a.p===run.p)),level=levels[run?.r];
  if(!area||!level||(s.reviewQueue||[]).some(e=>!e.resolved&&e.step===step&&e.trial===trial))continue;
  const cell=mastery.snapshot().state.areas[area.id]?.[level];
  if(cell?.status==='pending'&&cell.attempt===trial&&mastery.resumePending(area.id,level).ok)resumed++;
 }
 return {moved,resumed};
}
window.UPPDRAG_MASTERY_REVIEW={recover,mainTask};
})();
