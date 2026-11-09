/* Persistent equipment and bounded fish orders; waiting never earns a catch. */
(function(root){
'use strict';
const PRICE=10,LIMIT=3,MAX_FISH=3,copy=v=>JSON.parse(JSON.stringify(v));
function create(raw={},hooks={}){
 if(!raw||typeof raw!=='object')raw={};
 const chapters={};for(const ch of [4,5]){const s=raw.chapters?.[ch]||{};chapters[ch]={delivered:Math.max(0,Math.min(LIMIT,Math.floor(Number(s.delivered)||0))),attempts:Math.max(0,Math.floor(Number(s.attempts)||0)),lastTaskId:typeof s.lastTaskId==='string'?s.lastTaskId:''};}
 const fish=Array.isArray(raw.fish)?raw.fish.filter(f=>f&&typeof f.id==='string'&&[4,5].includes(f.chapter)&&typeof f.taskId==='string').slice(0,MAX_FISH):[];
 const state={v:1,rod:raw.rod===true||hooks.hasRodReceipt?.()===true,serial:Math.max(0,Math.floor(Number(raw.serial)||0)),fish,chapters,history:Array.isArray(raw.history)?raw.history.slice(-24):[]};
 let phase='idle',taskId='',chapter=4,waitMs=0,lastTime=null,locked=false;
 const save=()=>hooks.save?.(copy(state));
 function record(outcome,answer=''){state.history.push({chapter,taskId,outcome,answer:String(answer).slice(0,500)});state.history=state.history.slice(-24);save();}
 function buy(){
  if(locked)return {ok:false,reason:'busy'};if(!hooks.atShop?.())return {ok:false,reason:'away'};if(state.rod)return {ok:true,paid:0};
  const balance=hooks.wallet?.();if(!Number.isSafeInteger(balance)||balance<PRICE)return {ok:false,reason:'funds'};
  locked=true;try{if(hooks.debit?.(PRICE,balance)!==true)return {ok:false,reason:'wallet'};state.rod=true;save();return {ok:true,paid:PRICE};}finally{locked=false;}
 }
 function cast(ch,id){
  if(phase!=='idle'||![4,5].includes(ch)||!hooks.atWater?.())return {ok:false,reason:'away'};
  if(!state.rod)return {ok:false,reason:'rod'};if(!id)return {ok:false,reason:'unknown'};
  if(state.fish.length>=MAX_FISH&&chapters[ch].delivered<LIMIT)return {ok:false,reason:'full'};
  chapter=ch;taskId=id;state.chapters[ch].attempts++;state.chapters[ch].lastTaskId=id;phase='waiting';waitMs=2200+Math.max(0,Math.min(1,hooks.random?.()??Math.random()))*1800;lastTime=null;save();return {ok:true};
 }
 function cancel(){if(['waiting','question'].includes(phase))record('cancelled');phase='idle';taskId='';waitMs=0;}
 function tick(now,{present=true,paused=false}={}){
  const dt=lastTime===null?0:Math.max(0,Math.min(100,now-lastTime));lastTime=now;
  if(!present&&['waiting','question'].includes(phase)){cancel();return snapshot();}
  if(phase==='waiting'&&!paused){waitMs=Math.max(0,waitMs-dt);if(!waitMs)phase='question';}return snapshot();
 }
 function submit(ok,answer=''){
  if(phase!=='question')return {ok:false,reason:'inactive'};phase='feedback';
  if(!ok){record('practice',answer);hooks.practice?.(taskId);return {ok:false,reason:'practice'};}
  if(state.chapters[chapter].delivered>=LIMIT){record('released',answer);return {ok:true,reason:'released'};}
  if(state.fish.length>=MAX_FISH){record('full',answer);return {ok:false,reason:'full'};}
  state.serial++;state.fish.push({id:'fish-'+chapter+'-'+state.serial,chapter,taskId});record('caught',answer);return {ok:true,reason:'caught'};
 }
 function deliver(ch){
  if(locked||phase!=='idle')return {ok:false,reason:'busy'};if(!chapters[ch]||!hooks.atKitchen?.())return {ok:false,reason:'away'};
  const amount=Math.min(state.fish.length,LIMIT-chapters[ch].delivered);if(!amount)return {ok:false,reason:chapters[ch].delivered>=LIMIT?'limit':'empty'};
  const id='fish-delivery-'+ch+'-'+chapters[ch].delivered+'-'+state.fish.slice(0,amount).map(f=>f.id).join('.');locked=true;
  try{if(hooks.credit?.(amount,id)!==true)return {ok:false,reason:'wallet'};state.fish.splice(0,amount);chapters[ch].delivered+=amount;chapter=ch;record('delivered');return {ok:true,amount};}finally{locked=false;}
 }
 function close(){if(phase==='question'||phase==='waiting')cancel();else phase='idle';}
 const snapshot=()=>({state:copy(state),phase,taskId,chapter,waitMs});
 return {buy,cast,tick,submit,deliver,cancel,close,snapshot};
}
root.UPPDRAG_FISHING_MODEL={create,price:PRICE,limit:LIMIT,maxFish:MAX_FISH};
})(window);
