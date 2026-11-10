/* One earned bonus per chapter. The carried fruit is not inventory until the
 * player escapes and recalls a known answer; a reload never completes a run. */
(function(root){
'use strict';
const gap=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),point=p=>({x:p.x,y:p.y});
function create(raw={},hooks={}){
 if(!raw||typeof raw!=='object')raw={};
 const state={v:1,claimed:raw.claimed===true,attempts:Math.max(0,Math.floor(Number(raw.attempts)||0)),lastTaskId:typeof raw.lastTaskId==='string'?raw.lastTaskId:'',
  cooldownMs:Math.max(raw.inProgress?5000:0,Math.min(30000,Number(raw.cooldownMs)||0)),inProgress:false,history:Array.isArray(raw.history)?raw.history.slice(-15):[]};
 let phase='idle',actor=null,home=null,lastSeen=null,route=[],walked=[],routeAt=0,lastTime=null,age=0,unseen=0,retreat=false,taskId='',result='',patrolIndex=0,patrolWait=0;
 const save=()=>hooks.save?.(JSON.parse(JSON.stringify(state)));
 function record(outcome,answer=''){state.history.push({taskId:taskId||state.lastTaskId,outcome,answer:String(answer).slice(0,500)});state.history=state.history.slice(-15);save();hooks.event?.(outcome);}
 // A chase can leave the road graph behind a house. Preserve the physical
 // way in, including patrol turns, so returning never depends on a road node
 // being visible from that pocket. Keep only corners that cannot be skipped.
 function remember(cfg){
  const p=point(actor);
  if(!walked.length)walked.push(p);
  else if(walked.length>1&&cfg.clear?.(walked[walked.length-2],p))walked[walked.length-1]=p;
  else if(gap(walked[walked.length-1],p)>.01)walked.push(p);
 }
 function returning(){if(retreat)return;retreat=true;route=walked.slice().reverse();routeAt=0;if(actor)actor.moving=false;}
 function finish(outcome){phase='idle';state.inProgress=false;state.cooldownMs=outcome==='caught'?12000:5000;returning();record(outcome);}
 function begin(p,h,id){
  if(state.claimed||state.cooldownMs>0||!['idle','feedback'].includes(phase)||retreat||!id)return false;
  state.attempts++;state.inProgress=true;state.lastTaskId=taskId=id;home=point(h);actor=actor||{...home};if(!walked.length)walked=[point(actor)];actor.heading=Math.atan2(p.y-actor.y,p.x-actor.x);actor.moving=false;
  lastSeen=point(p);route=[];routeAt=0;age=unseen=0;phase='warning';result='';save();hooks.event?.('warning');return true;
 }
 function move(to,dt,cfg,speed){
  if(!actor||!to)return;actor.moving=false;routeAt-=dt;
  if(routeAt<=0&&(!retreat||!route.length)){route=cfg.route?.(actor,to)||[];routeAt=.3;}
  let budget=dt*speed;
  while(route.length&&budget>0){const t=route[0],d=gap(actor,t);if(!cfg.clear?.(actor,t)){route=[];break;}if(d<.01){route.shift();continue;}
   const step=Math.min(budget,d);actor.heading=Math.atan2(t.y-actor.y,t.x-actor.x);actor.x+=(t.x-actor.x)/d*step;actor.y+=(t.y-actor.y)/d*step;actor.moving=true;if(!retreat)remember(cfg);budget-=step;if(step>=d)route.shift();
  }
 }
 function escaped(){phase='question';unseen=0;returning();hooks.event?.('escaped');save();}
 function tick(now,p,cfg={}){
  const dt=lastTime===null?0:Math.max(0,Math.min(.05,(now-lastTime)/1000));lastTime=now;
  if(!actor&&cfg.home){home=point(cfg.home);actor={...home,heading:0,moving:false};walked=[point(home)];}
  if(['warning','chasing'].includes(phase)&&cfg.shelter)escaped();
  if(cfg.hidden||cfg.paused){if(actor)actor.moving=false;return snapshot();}
  const oldCooldown=state.cooldownMs;state.cooldownMs=Math.max(0,state.cooldownMs-dt*1000);if(oldCooldown>0&&!state.cooldownMs)save();
  if(retreat){move(home,dt,cfg,145);if(actor&&gap(actor,home)<.01){actor={...home,heading:actor.heading,moving:false};retreat=false;route=[];walked=[point(home)];routeAt=0;patrolWait=1.4;}return snapshot();}
  if(!['warning','chasing'].includes(phase)){
   const patrol=cfg.patrol||[];if(actor)actor.moving=false;
   if(cfg.region==='main'&&patrol.length&&actor&&gap(actor,p)>46){
    patrolWait=Math.max(0,patrolWait-dt);
    if(!patrolWait){const target=patrol[patrolIndex%patrol.length];move(target,dt,cfg,58);if(gap(actor,target)<3){patrolIndex=(patrolIndex+1)%patrol.length;patrolWait=1.4;route=[];routeAt=0;}}
   }
   return snapshot();
  }
  if(cfg.region!=='main'){finish('left');return snapshot();}
  age+=dt;
  if(phase==='warning'){if(cfg.canSee?.(actor,p)??true){lastSeen=point(p);actor.heading=Math.atan2(p.y-actor.y,p.x-actor.x);}if(age>=.7){phase='chasing';age=0;hooks.event?.('chasing');}return snapshot();}
  if(gap(actor,p)<20){finish('caught');return snapshot();}
  const visible=cfg.canSee?.(actor,p)??true;
  if(visible){lastSeen=point(p);unseen=0;move(lastSeen,dt,cfg,164);}
  else {unseen+=dt;if(cfg.inSafe)actor.moving=false;else if(lastSeen&&gap(actor,lastSeen)>4)move(lastSeen,dt,cfg,120);else actor.moving=false;}
  if(!visible&&unseen>=(cfg.inSafe?1.8:4)||gap(actor,p)>560&&age>7){escaped();return snapshot();}
  if(age>35)finish('returned-apple');
  return snapshot();
 }
 function submit(ok,answer=''){
  if(phase!=='question'||state.claimed)return {ok:false,reason:'inactive'};
  phase='feedback';state.inProgress=false;
  if(ok){
   // Reserve the chapter reward before touching inventory, so repeated actions
   // or a restored question can never mint a second apple.
   state.claimed=true;save();
   if(hooks.awardApple?.()===true){result='earned';record('earned',answer);return {ok:true,reason:'earned'};}
   state.claimed=false;result='full';record('full',answer);return {ok:false,reason:'full'};
  }
  state.cooldownMs=30000;result='practice';record('practice',answer);hooks.practice?.(taskId);return {ok:false,reason:'practice'};
 }
 function close(){if(phase==='question')finish('cancelled');else if(phase==='feedback')phase='idle';}
 function cancel(){if(['warning','chasing'].includes(phase))finish('returned-apple');else close();}
 const snapshot=()=>({state:JSON.parse(JSON.stringify(state)),phase,actor:actor?{...actor}:null,retreat,taskId,result,carrying:['warning','chasing','question'].includes(phase)});
 save();return {begin,tick,submit,close,cancel,snapshot,get busy(){return ['warning','chasing','question'].includes(phase);}};
}
root.UPPDRAG_ORCHARD_MODEL={create};
})(window);
