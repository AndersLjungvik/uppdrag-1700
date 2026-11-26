/* Physical ambushes: existing cover, last-seen search and a visible retreat. */
(function(root){
'use strict';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),copy=p=>({x:p.x,y:p.y});
function blockedByCover(a,b,covers){
 const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;if(!length)return false;
 return covers.some(c=>{const t=((c.x-a.x)*dx+(c.y-a.y)*dy)/length;return t>.02&&t<1&&Math.hypot(a.x+t*dx-c.x,a.y+t*dy-c.y)<(c.radius||27);});
}
function routeBetween(region,from,to,pointFor,clear,preferRoad=false){
 if(!preferRoad&&clear(from,to))return [copy(to)];
 const points=new Map(),links=new Map();
 const add=(id,p)=>{if(p){points.set(id,p);links.set(id,[]);}};
 add('@from',from);add('@to',to);
 for(const e of region.edges){if(!points.has(e.a))add(e.a,pointFor(e.a));if(!points.has(e.b))add(e.b,pointFor(e.b));}
 const join=(a,b)=>{if(!points.has(a)||!points.has(b)||!clear(points.get(a),points.get(b)))return;const cost=distance(points.get(a),points.get(b));links.get(a).push({id:b,cost});links.get(b).push({id:a,cost});};
 for(const e of region.edges)join(e.a,e.b);
 for(const id of points.keys())if(!id.startsWith('@')){join('@from',id);join('@to',id);}
 const costs=new Map([['@from',0]]),previous=new Map(),remaining=new Set(points.keys());
 while(remaining.size){
  let current=null,best=Infinity;
  for(const id of remaining)if((costs.get(id)??Infinity)<best){current=id;best=costs.get(id);}
  if(current===null)break;remaining.delete(current);if(current==='@to')break;
  for(const next of links.get(current)){const cost=best+next.cost;if(cost<(costs.get(next.id)??Infinity)){costs.set(next.id,cost);previous.set(next.id,current);}}
 }
 if(!costs.has('@to'))return clear(from,to)?[copy(to)]:null;
 const ids=['@to'];while(ids[0]!=='@from'){const p=previous.get(ids[0]);if(!p)return null;ids.unshift(p);}
 return ids.slice(1).map(id=>copy(points.get(id)));
}
function create(){
 let point=null,home=null,route=[],walked=[],phase='waiting',lastTime=null,lastPlayer=null,lastSeen=null;
 let visible=0,flightTime=0,watchTime=0,watchTravel=0,closest=Infinity,searchTime=0,searchElapsed=0,routeWait=0,wait=0,cooldown=0,reason='';
 function reset(){point=null;home=null;route=[];walked=[];phase='waiting';lastTime=null;lastPlayer=null;lastSeen=null;visible=0;flightTime=0;watchTime=0;watchTravel=0;closest=Infinity;searchTime=0;searchElapsed=0;routeWait=0;wait=0;cooldown=0;reason='';}
 function watch(cover,player){
  home={x:cover.x+12,y:cover.y,id:cover.id};point={...copy(home),heading:Math.atan2(player.y-home.y,player.x-home.x),moving:false};
  route=[];walked=[copy(point)];lastSeen=copy(player);phase='watching';closest=distance(point,player);watchTime=0;watchTravel=0;visible=0;reason='';
 }
 function deter(why='noticed'){
  if(!point||!['watching','approaching','searching','contact'].includes(phase))return false;
  reason=why;phase='retreating';route=walked.slice().reverse();wait=.8;point.moving=false;return true;
 }
 function tick(now,player,{enabled=false,paused=false,safety='',covers=[],clear=()=>true,canSee=(a,b)=>clear(a,b)&&!blockedByCover(a,b,covers.filter(c=>!(c.id===home?.id&&visible<.9))),pathTo=(a,b)=>clear(a,b)?[copy(b)]:null}={}){
  const dt=lastTime===null?0:Math.max(0,Math.min(.08,(now-lastTime)/1000));lastTime=now;
  const previous=lastPlayer,moved=previous?distance(previous,player):0;lastPlayer=copy(player);
  if(paused){if(point)point.moving=false;return snapshot();}
  cooldown=Math.max(0,cooldown-dt);routeWait=Math.max(0,routeWait-dt);
  if(phase==='evaded'&&enabled&&!cooldown){phase='waiting';point=null;home=null;}
  if(phase==='waiting'&&enabled&&!safety&&moved>1&&moved<45){
   const options=covers.filter(c=>{
    const p={x:c.x+12,y:c.y},gap=distance(p,player);
    return gap>=90&&gap<=280&&clear(p,p)&&(p.x-player.x)*(player.x-previous.x)+(p.y-player.y)*(player.y-previous.y)>0;
   }).sort((a,b)=>distance(a,player)-distance(b,player));
   const cover=options.find(c=>pathTo({x:c.x+12,y:c.y},player)?.length);if(cover)watch(cover,player);
  }
  if(!point)return snapshot();point.moving=false;
  if(safety)deter(safety);
  if(moved>80)deter('left');
  if(['watching','approaching','searching'].includes(phase)&&!enabled)deter('unavailable');
  if(phase==='watching'){
   watchTime+=dt;watchTravel+=moved<45?moved:0;const gap=distance(point,player);closest=Math.min(closest,gap);point.heading=Math.atan2(player.y-point.y,player.x-point.x);
   if(watchTime>=.6&&watchTravel>=45&&closest<=170&&gap>=closest+24){phase='approaching';visible=0;lastSeen=copy(player);route=pathTo(point,lastSeen)||[];routeWait=.3;}
   else if(gap>370)deter('passed');
  }
  if(phase==='approaching'||phase==='searching'){
   visible+=dt;
   if(distance(point,player)>500)deter('outpaced');
   else if(canSee(point,player)){
    if(phase==='searching'){phase='approaching';routeWait=0;searchTime=0;searchElapsed=0;}
    lastSeen=copy(player);
    if(distance(point,player)<=34&&visible>=1.6){phase='contact';route=[];return snapshot();}
    if(!routeWait){const next=pathTo(point,lastSeen);if(next){route=next;routeWait=.3;}else deter('blocked');}
   }else{
    if(phase==='approaching'){phase='searching';searchTime=0;searchElapsed=0;route=pathTo(point,lastSeen)||[];}
    searchElapsed+=dt;if(!route.length){searchTime+=dt;point.heading+=Math.sin(now/220)*dt*1.8;}
    if(searchTime>=2.4||searchElapsed>=7)deter('lost-sight');
   }
  }
  if(phase==='fleeing'){
   flightTime+=dt;
   if(!safety&&flightTime>.65&&moved>.5&&moved<45&&distance(point,player)<=36){phase='caught';return snapshot();}
  }
  if(['approaching','searching','retreating','fleeing','departing'].includes(phase)){
   wait=Math.max(0,wait-dt);let budget=wait?0:dt*(phase==='fleeing'?125:phase==='retreating'||phase==='departing'?150:visible<1?135:165);
   while(route.length&&budget>0){
    const target=route[0],gap=distance(point,target);
    if(!clear(point,target)){
     if(phase==='approaching'||phase==='searching'){deter('blocked');break;}
     const next=pathTo(point,route.at(-1));if(next&&clear(point,next[0])){route=next;continue;}break;
    }
    if(gap<.01){route.shift();continue;}
    const step=Math.min(gap,budget);point.heading=Math.atan2(target.y-point.y,target.x-point.x);
    point.x+=Math.cos(point.heading)*step;point.y+=Math.sin(point.heading)*step;point.moving=true;budget-=step;
    if(phase==='approaching'||phase==='searching')walked.push(copy(point));
    if(step>=gap)route.shift();
   }
   if(!wait&&!route.length){
    if(phase==='retreating'){phase='evaded';point=null;cooldown=12;}
    else if(phase==='fleeing'||phase==='departing'){point=null;phase=phase==='fleeing'?'escaped':'done';}
   }
  }
  return snapshot();
 }
 function depart(){if(!point)return;if(!route.length)route=walked.slice().reverse();phase='departing';wait=0;}
 function flee(points){if(!point||!points?.length)return false;phase='fleeing';route=points.map(copy);flightTime=0;wait=0;return true;}
 function hold(){if(point){phase='contact';point.moving=false;}}
 function place(p){reset();point={...copy(p),heading:0,moving:false};phase='contact';walked=[copy(p)];}
 function snapshot(){return {phase,point:point?{...point,alpha:1}:null,home:home?{...home}:null,visible,flightTime,reason};}
 return {tick,reset,depart,hold,place,flee,deter,snapshot};
}
function escapeRoute(region,from,player,pointFor,clear,covers=[]){
 if(covers.length){
  const options=covers.filter(c=>distance(from,c)>=350&&distance(from,c)<=1300).sort((a,b)=>{
   const score=c=>((c.x-from.x)*(from.x-player.x)+(c.y-from.y)*(from.y-player.y)>0?10000:0)-Math.abs(distance(from,c)-750);
   return score(b)-score(a);
  });
  for(const c of options){
   const route=routeBetween(region,from,{x:c.x+12,y:c.y},pointFor,clear,true);
   if(route){let length=0,last=from;for(const p of route){length+=distance(last,p);last=p;}if(length>=350&&length<=2200)return route;}
  }
  return null;
 }
 const edges=[];
 for(const edge of region.edges){
  const a=pointFor(edge.a),b=pointFor(edge.b);if(!a||!b||!clear(a,b))continue;
  const dx=b.x-a.x,dy=b.y-a.y,len=dx*dx+dy*dy;if(!len)continue;
  const t=Math.max(0,Math.min(1,((from.x-a.x)*dx+(from.y-a.y)*dy)/len));
  const p={x:a.x+t*dx,y:a.y+t*dy};if(clear(from,p))edges.push({...edge,p,gap:distance(from,p)});
 }
 edges.sort((a,b)=>a.gap-b.gap);const edge=edges[0];if(!edge)return null;
 const candidates=[];
 for(const id of [edge.a,edge.b]){
  let cursor=id,total=distance(edge.p,pointFor(id));
  const points=[edge.p,pointFor(id)],visited=new Set([edge.a,edge.b]);
  const first=pointFor(id),away=(first.x-from.x)*(from.x-player.x)+(first.y-from.y)*(from.y-player.y);
  for(let i=0;i<14&&total<850;i++){
   const here=pointFor(cursor),options=region.edges.filter(e=>e.a===cursor||e.b===cursor).map(e=>e.a===cursor?e.b:e.a).filter(id=>!visited.has(id)&&pointFor(id)&&clear(here,pointFor(id)));
   options.sort((a,b)=>distance(pointFor(b),player)-distance(pointFor(a),player));
   if(!options.length)break;const next=options[0];total+=distance(here,pointFor(next));points.push(pointFor(next));visited.add(next);cursor=next;
  }
  if(total>=300)candidates.push({points,score:(away>0?10000:0)+Math.min(total,850)});
 }
 candidates.sort((a,b)=>b.score-a.score);return candidates[0]?.points||null;
}
root.UPPDRAG_EVENT_APPROACH={create,escapeRoute,routeBetween,blockedByCover};
if(typeof module!=='undefined')module.exports={create,escapeRoute,routeBetween,blockedByCover};
})(typeof window!=='undefined'?window:globalThis);
