/* Uppdrag 1700 – shared mastery progression.
 * New rebuild foundation. Does not replace chapter question banks by itself.
 * Each chapter configures stable knowledge areas; story state remains separate.
 */
(function(){
'use strict';
const LEVELS=['learner','journeyman','master'];
const LABELS={learner:'Lärling',journeyman:'Gesäll',master:'Mästare'};
const ROOT='uppdrag1700.mastery.v1.';
let chapter=0,config=null,resourceAdapter=null,state=null;

const clone=v=>JSON.parse(JSON.stringify(v));
const key=()=>ROOT+'ch'+chapter;
function blank(){
 const areas={};
 for(const a of config.areas)areas[a.id]={
   learner:{status:'available',attempt:0},
   journeyman:{status:'locked',attempt:0},
   master:{status:'locked',attempt:0}
 };
 return {v:1,chapter,areas,history:[]};
}
function load(){
 let raw=null;
 try{raw=JSON.parse(localStorage.getItem(key())||'null')}catch{}
 if(!raw||raw.v!==1||raw.chapter!==chapter||typeof raw.areas!=='object')raw=blank();
 for(const a of config.areas){
   if(!raw.areas[a.id])raw.areas[a.id]=blank().areas[a.id];
   for(const l of LEVELS){
     const s=raw.areas[a.id][l];
     if(!s||!['locked','available','in-progress','pending','clear','failed'].includes(s.status))
       raw.areas[a.id][l]={status:l==='learner'?'available':'locked',attempt:0};
   }
 }
 state=raw;recompute();persist();
}
function persist(){try{localStorage.setItem(key(),JSON.stringify(state))}catch{}}
function allClear(level){return config.areas.every(a=>state.areas[a.id][level].status==='clear')}
function recompute(){
 const learnerDone=allClear('learner');
 const journeymanDone=allClear('journeyman');
 for(const a of config.areas){
   if(!learnerDone&&state.areas[a.id].journeyman.status!=='clear')state.areas[a.id].journeyman.status='locked';
   else if(learnerDone&&state.areas[a.id].journeyman.status==='locked')state.areas[a.id].journeyman.status='available';
   if(!journeymanDone&&state.areas[a.id].master.status!=='clear')state.areas[a.id].master.status='locked';
   else if(journeymanDone&&state.areas[a.id].master.status==='locked')state.areas[a.id].master.status='available';
 }
}
function area(id){
 const a=config?.areas.find(x=>x.id===id);
 if(!a)throw Error('Okänt kunskapsområde: '+id);
 return a;
}
function cell(id,level){
 area(id);if(!LEVELS.includes(level))throw Error('Okänd nivå: '+level);
 return state.areas[id][level];
}
function record(type,data={}){state.history.push({type,...data,at:new Date().toISOString()});state.history=state.history.slice(-120)}
function configure(opts){
 if(!opts||!Number.isInteger(opts.chapter)||opts.chapter<1||!Array.isArray(opts.areas)||!opts.areas.length)
   throw Error('Mastery configure kräver kapitel och områden.');
 const ids=new Set();
 for(const a of opts.areas){
   if(!a?.id||ids.has(a.id))throw Error('Varje kunskapsområde behöver unikt id.');
   ids.add(a.id);
 }
 chapter=opts.chapter;config={chapter,areas:clone(opts.areas)};resourceAdapter=opts.resources||null;load();
 return api;
}
function begin(id,level){
 const c=cell(id,level);
 if(c.status==='locked')return {ok:false,reason:'locked'};
 if(c.status==='clear')return {ok:false,reason:'clear'};
 c.status='in-progress';c.attempt=(c.attempt||0)+1;record('begin',{area:id,level,attempt:c.attempt});persist();
 return {ok:true,attempt:c.attempt};
}
function pass(id,level){
 const c=cell(id,level);c.status='clear';c.completedAt=new Date().toISOString();delete c.failedAt;
 record('clear',{area:id,level,attempt:c.attempt||0});recompute();persist();return snapshot();
}
function pending(id,level){
 const c=cell(id,level);c.status='pending';record('pending',{area:id,level,attempt:c.attempt||0});persist();return snapshot();
}
function fail(id,level){
 const c=cell(id,level);c.status='failed';c.failedAt=new Date().toISOString();
 record('failed',{area:id,level,attempt:c.attempt||0});persist();return snapshot();
}
function retryWithApple(id,level){
 const c=cell(id,level);
 if(c.status!=='failed')return {ok:false,reason:'not-failed'};
 if(!resourceAdapter?.getApples||!resourceAdapter?.setApples)return {ok:false,reason:'no-resource-adapter'};
 const apples=Math.max(0,Number(resourceAdapter.getApples())||0);
 if(apples<1)return {ok:false,reason:'no-apples'};
 resourceAdapter.setApples(apples-1);
 c.status='available';record('apple-retry',{area:id,level,remaining:apples-1});persist();
 return {ok:true,remaining:apples-1};
}
function buyHint(id,level){
 cell(id,level);
 if(level!=='learner')return {ok:false,reason:'learner-only'};
 if(!resourceAdapter?.getDaler||!resourceAdapter?.setDaler)return {ok:false,reason:'no-resource-adapter'};
 const daler=Math.max(0,Number(resourceAdapter.getDaler())||0);
 if(daler<1)return {ok:false,reason:'no-daler'};
 resourceAdapter.setDaler(daler-1);record('hint',{area:id,level,remaining:daler-1});persist();
 return {ok:true,remaining:daler-1};
}
function levelUnlocked(level){
 if(level==='learner')return true;
 if(level==='journeyman')return allClear('learner');
 if(level==='master')return allClear('journeyman');
 return false;
}
function chapterComplete(){return allClear('master')}
function summary(){
 const active=LEVELS.find(l=>levelUnlocked(l)&&!allClear(l))||'master';
 const done=config.areas.filter(a=>state.areas[a.id][active].status==='clear').length;
 const remaining=config.areas.filter(a=>state.areas[a.id][active].status!=='clear').map(a=>({
   id:a.id,name:a.name,place:a.place,status:state.areas[a.id][active].status
 }));
 return {level:active,label:LABELS[active],done,total:config.areas.length,remaining,chapterComplete:chapterComplete()};
}
function snapshot(){return {chapter,config:clone(config),state:clone(state),summary:summary()}}
function reset(){state=blank();recompute();persist();return snapshot()}
const api={configure,begin,pass,pending,fail,retryWithApple,buyHint,levelUnlocked,chapterComplete,summary,snapshot,reset,LEVELS:[...LEVELS],LABELS:{...LABELS}};
window.UPPDRAG_MASTERY=api;
})();