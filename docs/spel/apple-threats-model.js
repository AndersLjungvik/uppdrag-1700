/* Small, avoidable apple losses. Resources and Rut's assessment stay with the
 * chapter pilot; this model only controls physical encounters and their pace. */
(function(root){
'use strict';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),copy=p=>({x:p.x,y:p.y});
const bounded=(v,max,fallback=0)=>Number.isFinite(v)?Math.max(0,Math.min(max,v)):fallback;
function create(raw={},hooks={}){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))raw={};
 const kinds=Array.isArray(hooks.kinds)&&hooks.kinds.length?Array.from(new Set(hooks.kinds.filter(k=>['dog','guard'].includes(k)))):['dog','guard'];
 if(!kinds.length)kinds.push('dog');
 const seenKinds=Array.from(new Set((Array.isArray(raw.seenKinds)?raw.seenKinds:[]).filter(k=>['dog','guard'].includes(k))));
 for(const entry of Array.isArray(raw.history)?raw.history:[])if(entry.outcome==='lost-apple'&&['dog','guard'].includes(entry.kind)&&!seenKinds.includes(entry.kind))seenKinds.push(entry.kind);
 const state={v:1,pacing:2,seenKinds,distance:bounded(raw.distance,1e8),nextDistance:bounded(raw.nextDistance,1e8,240),quietMs:bounded(raw.quietMs,60000),
  nextKind:kinds.includes(raw.nextKind)?raw.nextKind:kinds[0],encounters:bounded(raw.encounters,1e6),losses:bounded(raw.losses,1e6),
  needsRut:raw.needsRut===true,orchardClaimed:raw.orchardClaimed===true,
  orchardHarvests:Math.max(raw.orchardClaimed===true?1:0,Math.floor(bounded(raw.orchardHarvests,Number.MAX_SAFE_INTEGER))),
  lossRound:bounded(raw.lossRound,1e6),lastCompletedRound:bounded(raw.lastCompletedRound,1e6),history:Array.isArray(raw.history)?raw.history.slice(-20):[]};
 if(state.orchardHarvests>0)state.orchardClaimed=true;
 if(raw.pacing!==2){state.nextDistance=Math.min(state.nextDistance,state.distance+(seenKinds.includes(state.nextKind)?450:240));state.quietMs=Math.min(state.quietMs,seenKinds.includes(state.nextKind)?15000:0);}
 let active=null,lastTime=null,lastPlayer=null,lastRegion=null,saveAt=0,otherWasActive=false;
 const save=()=>hooks.save?.(JSON.parse(JSON.stringify(state)));
 function record(kind,outcome){state.history.push({kind,outcome});state.history=state.history.slice(-20);save();hooks.event?.(kind,outcome);}
 function rest(introduction=false){state.nextDistance=state.distance+(introduction?240:450);state.quietMs=introduction?0:15000;save();}
 function retire(outcome){
  if(!active||active.phase==='retreat')return;
  active.phase='retreat';active.route=[];active.routeAt=0;active.phaseTime=0;active.outcome=outcome;
  rest();record(active.kind,outcome);
 }
 function move(goal,dt,config,speed){
  const a=active;if(!a)return;
  a.routeAt-=dt;
  if(a.routeAt<=0||!a.route.length){a.route=config.route?.(a.point,goal)||[];a.routeAt=.35;}
  let budget=dt*speed;a.point.moving=false;
  while(a.route.length&&budget>0){
   const target=a.route[0],gap=distance(a.point,target);
   if(!config.clear?.(a.point,target)){a.route=[];break;}
   if(gap<.01){a.route.shift();continue;}
   const step=Math.min(gap,budget);a.point.heading=Math.atan2(target.y-a.point.y,target.x-a.point.x);
   a.point.x+=(target.x-a.point.x)*step/gap;a.point.y+=(target.y-a.point.y)*step/gap;a.point.moving=true;budget-=step;
   if(step>=gap)a.route.shift();
  }
 }
 function tick(now,player,config={}){
  if(!player||!Number.isFinite(player.x)||!Number.isFinite(player.y))return snapshot();
  const elapsed=lastTime===null?0:bounded(now-lastTime,250),dt=Math.min(.08,elapsed/1000);lastTime=now;
  const previous=lastPlayer,same=lastRegion===config.region;lastPlayer=copy(player);lastRegion=config.region;
  const moved=previous&&same?distance(previous,player):0;
  const completed=bounded(config.completedRound,1e6);
  // Observe each completed harvest once. The legacy flag represents only the
  // first one; reloading an already-seen harvest cannot erase a later loss.
  const harvests=Number.isFinite(config.orchardHarvests)?Math.floor(bounded(config.orchardHarvests,Number.MAX_SAFE_INTEGER)):config.bonusClaimed===true?1:0;
  if(harvests>state.orchardHarvests){
   state.orchardHarvests=harvests;state.orchardClaimed=true;
   if(config.apples>0){const recovered=state.needsRut;state.needsRut=false;rest(!state.seenKinds.includes(state.nextKind));if(recovered)hooks.event?.('orchard','recovered');}
   save();
  }
  if(completed>state.lastCompletedRound){
   state.lastCompletedRound=completed;
   if(config.apples>0){
    const recovered=state.needsRut&&completed>state.lossRound;
    if(recovered)state.needsRut=false;
    rest(!state.seenKinds.includes(state.nextKind));if(recovered)hooks.event?.('rut','recovered');
   }
   save();
  }
  // Shelter ends pursuit even when the conversation or room pauses the clock.
  if(config.shelter&&active)retire('shelter');
  if(config.hidden||config.paused){if(active)active.point.moving=false;return snapshot();}
  state.quietMs=Math.max(0,state.quietMs-elapsed);
  if(config.region==='main'&&moved>.1&&moved<45&&!config.shelter)state.distance+=moved;
  // Give one short gap after another event. Repeated peeks must not continually
  // restart a longer delay and permanently starve the apple encounter.
  if(!active&&otherWasActive&&!config.otherThreat){state.quietMs=Math.max(state.quietMs,3000);state.nextDistance=Math.max(state.nextDistance,state.distance+120);save();}
  otherWasActive=!!config.otherThreat;
  if(config.region!=='main'||!same||moved>80){if(active){retire('left');active=null;}return snapshot();}
  if(now-saveAt>=1000){saveAt=now;save();}
  if(!active){
   if(config.shelter||config.otherThreat||config.apples<1||!config.known||state.needsRut||state.quietMs>0||state.distance<state.nextDistance||moved<.1||moved>=45)return snapshot();
   const anchor=config.anchor?.(state.nextKind,player,previous);
   if(!anchor?.home||!anchor?.post||!config.route?.(anchor.home,anchor.post)?.length)return snapshot();
   active={kind:state.nextKind,phase:'warning',point:{...copy(anchor.home),heading:0,moving:false},home:{...anchor.home},post:copy(anchor.post),route:[],routeAt:0,phaseTime:0,age:0,unseen:0};
   state.encounters++;state.nextKind=kinds[(kinds.indexOf(active.kind)+1)%kinds.length];rest();record(active.kind,'warning');
  }
  const a=active;a.phaseTime+=dt;a.age+=dt;
  if(a.phase==='retreat'){
   move(a.home,dt,config,145);
   if(distance(a.point,a.home)<3)active=null;
   return snapshot();
  }
  if(config.shelter){retire('shelter');return snapshot();}
  if(config.apples<1){retire('no-apple');return snapshot();}
  if(distance(a.point,player)>(a.kind==='guard'?1050:420)||a.age>24){retire('evaded');return snapshot();}
  if(a.phase==='warning'){
   move(a.post,dt,config,a.kind==='guard'?120:72);
   if(a.phaseTime>=(a.kind==='guard'?2:3)){a.phase=a.kind==='dog'?'following':'guarding';a.phaseTime=0;if(!state.seenKinds.includes(a.kind)){state.seenKinds.push(a.kind);save();}hooks.event?.(a.kind,'active');}
   return snapshot();
  }
  const visible=config.canSee?.(a.point,player,a.home)??true;
  a.unseen=visible?0:a.unseen+dt;
  if(a.unseen>1.8){retire('cover');return snapshot();}
  const canFollow=a.kind==='dog'||distance(player,a.post)<=110;
  if(visible&&canFollow)move(player,dt,config,a.kind==='dog'?153:138);
  else {a.point.moving=false;if(a.kind==='guard'&&distance(a.point,a.post)>3)move(a.post,dt,config,90);}
  if(visible&&distance(a.point,player)<=28&&config.clear?.(a.point,player)){
   // Only the pilot may debit its real apple. No event grants an apple back.
   if(hooks.loseApple?.(a.kind)===true){state.losses++;state.needsRut=true;state.lossRound=state.lastCompletedRound;retire('lost-apple');}
   else retire('no-apple');
  }
  return snapshot();
 }
 function snapshot(){return {state:JSON.parse(JSON.stringify(state)),active:active?{kind:active.kind,phase:active.phase,point:{...active.point},home:{...active.home},post:{...active.post},age:active.age}:null};}
 return {tick,snapshot,get busy(){return !!active;},get suppressesPickpocket(){return !!active||state.needsRut||(state.encounters>0&&state.quietMs>0);}};
}
root.UPPDRAG_APPLE_THREAT_MODEL={create};
if(typeof module!=='undefined')module.exports={create};
})(typeof window!=='undefined'?window:globalThis);
