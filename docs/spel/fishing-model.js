/* Persistent equipment and bounded fish orders; waiting never earns a catch. */
(function(root){
'use strict';
const PRICE=10,LIMIT=3,MAX_FISH=3,PULL_WINDOW=900,LANDING_MS=700,copy=v=>JSON.parse(JSON.stringify(v));
// Query the same water and building geometry used by walking. A cast needs
// reachable dry ground and a clear line to water, rather than a named hotspot.
function shoreSpot(r,p,{water,walkable,clear}={}){
 if(!r||!p||!water||!walkable||!clear||!walkable(r,p.x,p.y,24))return null;
 let best=null;
 for(let i=0;i<32;i++){
  const a=i*Math.PI/16,dx=Math.cos(a),dy=Math.sin(a);let dry={x:p.x,y:p.y};
  for(let d=8;d<=100;d+=4){
   const q={x:p.x+dx*d,y:p.y+dy*d};if(q.x<8||q.y<8||q.x>r.w-8||q.y>r.h-8)break;
   if(water(r,q.x,q.y)){
    const float={x:q.x+dx*20,y:q.y+dy*20};
    if(float.x>=8&&float.y>=8&&float.x<r.w-8&&float.y<r.h-8&&clear(r,p,dry,0)&&[[0,0],[-5,0],[5,0],[0,-5],[0,5]].every(([x,y])=>water(r,float.x+x,float.y+y))&&(!best||d<best.distance))best={origin:{x:p.x,y:p.y},water:float,distance:d,heading:a,region:r.id};
    break;
   }
   dry=q;
  }
 }
 return best;
}
function shores(r,geometry){
 if(!r)return [];const result=[],seen=new Set(),polygons=r.island?[r.island]:r.water||[];
 for(const polygon of polygons)for(let i=0;i<polygon.length;i++){
  const a=polygon[i],b=polygon[(i+1)%polygon.length],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);if(!length)continue;
  for(let j=0,n=Math.ceil(length/48);j<=n;j++)for(const side of [-1,1]){
   const p={x:a[0]+dx*j/n-dy/length*38*side,y:a[1]+dy*j/n+dx/length*38*side},id=Math.round(p.x/12)+':'+Math.round(p.y/12);
   if(seen.has(id))continue;seen.add(id);const spot=shoreSpot(r,p,geometry);if(spot)result.push(spot);
  }
 }
 return result;
}
function create(raw={},hooks={}){
 if(!raw||typeof raw!=='object')raw={};
 const chapters={};for(const ch of [4,5]){const s=raw.chapters?.[ch]||{};chapters[ch]={delivered:Math.max(0,Math.min(LIMIT,Math.floor(Number(s.delivered)||0))),attempts:Math.max(0,Math.floor(Number(s.attempts)||0)),lastTaskId:typeof s.lastTaskId==='string'?s.lastTaskId:''};}
 const fish=Array.isArray(raw.fish)?raw.fish.filter(f=>f&&typeof f.id==='string'&&[4,5].includes(f.chapter)&&typeof f.taskId==='string').slice(0,MAX_FISH):[];
 const state={v:1,rod:raw.rod===true||hooks.hasRodReceipt?.()===true,serial:Math.max(0,Math.floor(Number(raw.serial)||0)),fish,chapters,history:Array.isArray(raw.history)?raw.history.slice(-24):[]};
 let phase='idle',taskId='',chapter=4,waitMs=0,pullMs=0,landingMs=0,pendingAnswer='',outcome='',lastTime=null,locked=false;
 const fishing=()=>['waiting','question','reeling','landing'].includes(phase);
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
  chapter=ch;taskId=id;state.chapters[ch].attempts++;state.chapters[ch].lastTaskId=id;phase='waiting';waitMs=2200+Math.max(0,Math.min(1,hooks.random?.()??Math.random()))*1800;pullMs=landingMs=0;pendingAnswer=outcome='';lastTime=null;save();return {ok:true};
 }
 function cancel(){if(fishing())record('cancelled');phase='idle';taskId='';pendingAnswer=outcome='';waitMs=pullMs=landingMs=0;}
 function tick(now,{present=true,paused=false}={}){
  const dt=lastTime===null?0:Math.max(0,Math.min(100,now-lastTime));lastTime=now;
  if(!present&&fishing()){cancel();return snapshot();}
  if(!paused){
   if(phase==='waiting'){waitMs=Math.max(0,waitMs-dt);if(!waitMs)phase='question';}
   else if(phase==='reeling')pullMs=Math.max(0,pullMs-dt);
   else if(phase==='landing'){landingMs=Math.max(0,landingMs-dt);if(!landingMs)land();}
  }return snapshot();
 }
 function submit(ok,answer=''){
  if(phase!=='question')return {ok:false,reason:'inactive'};
  if(!ok){phase='feedback';outcome='practice';record('practice',answer);hooks.practice?.(taskId);return {ok:false,reason:'practice'};}
  pendingAnswer=String(answer).slice(0,500);phase='reeling';pullMs=0;return {ok:true,reason:'reel'};
 }
 function pull(){
  if(phase!=='reeling')return {ok:false,reason:'inactive'};
  if(!hooks.atWater?.())return {ok:false,reason:'away'};
  if(!pullMs){pullMs=PULL_WINDOW;return {ok:true,reason:'pull'};}
  phase='landing';pullMs=0;landingMs=LANDING_MS;return {ok:true,reason:'landing'};
 }
 function land(){
  phase='feedback';
  if(state.chapters[chapter].delivered>=LIMIT)outcome='released';
  else if(state.fish.length>=MAX_FISH)outcome='full';
  else{state.serial++;state.fish.push({id:'fish-'+chapter+'-'+state.serial,chapter,taskId});outcome='caught';}
  record(outcome,pendingAnswer);pendingAnswer='';
 }
 function deliver(ch){
  if(locked||phase!=='idle')return {ok:false,reason:'busy'};if(!chapters[ch]||!hooks.atKitchen?.())return {ok:false,reason:'away'};
  const amount=Math.min(state.fish.length,LIMIT-chapters[ch].delivered);if(!amount)return {ok:false,reason:chapters[ch].delivered>=LIMIT?'limit':'empty'};
  const id='fish-delivery-'+ch+'-'+chapters[ch].delivered+'-'+state.fish.slice(0,amount).map(f=>f.id).join('.');locked=true;
  try{if(hooks.credit?.(amount,id)!==true)return {ok:false,reason:'wallet'};state.fish.splice(0,amount);chapters[ch].delivered+=amount;chapter=ch;record('delivered');return {ok:true,amount};}finally{locked=false;}
 }
 function close(){if(fishing())cancel();else phase='idle';}
 const snapshot=()=>({state:copy(state),phase,taskId,chapter,waitMs,pullMs,landingProgress:phase==='landing'?1-landingMs/LANDING_MS:0,outcome});
 return {buy,cast,tick,submit,pull,deliver,cancel,close,snapshot};
}
root.UPPDRAG_FISHING_MODEL={create,shoreSpot,shores,price:PRICE,limit:LIMIT,maxFish:MAX_FISH};
})(window);
