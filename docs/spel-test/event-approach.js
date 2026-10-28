/* Follow the player's walked road, including corners; never cut across houses. */
(function(root){
'use strict';
function create(){
 let trail=[],route=[],walked=[],point=null,phase='waiting',lastTime=null,visible=0,fade=1;
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),copy=p=>({x:p.x,y:p.y});
 function reset(){trail=[];route=[];walked=[];point=null;phase='waiting';lastTime=null;visible=0;fade=1;}
 function tick(now,player,{enabled=false,paused=false,clear=()=>true}={}){
  const dt=lastTime===null?0:Math.max(0,Math.min(.08,(now-lastTime)/1000));lastTime=now;
  if(paused){if(point)point.moving=false;return snapshot();}
  const previous=trail.at(-1),moved=previous?distance(previous,player):0;
  if(previous&&(moved>45||!clear(previous,player))){reset();lastTime=now;}
  if(!trail.length||distance(trail.at(-1),player)>=2){
   trail.push(copy(player));
   if(phase==='approaching')route.push(copy(player));
   let length=0;for(let i=trail.length-1;i>0;i--){length+=distance(trail[i],trail[i-1]);if(length>650){trail.splice(0,i);break;}}
  }
  if(phase==='waiting'&&enabled){
   let length=0;
   for(let i=trail.length-2;i>=0;i--){
    length+=distance(trail[i],trail[i+1]);
    const gap=distance(trail[i],player);
    if(length>=190&&gap>=145&&gap<=240){
     point={...copy(trail[i]),heading:Math.atan2(trail[i+1].y-trail[i].y,trail[i+1].x-trail[i].x),moving:false};
     route=trail.slice(i+1).map(copy);walked=[copy(point)];phase='approaching';visible=0;break;
    }
   }
  }
  if(!point)return snapshot();
  visible+=dt;point.moving=false;
  if(phase==='approaching'&&!enabled){reset();return snapshot();}
  // The encounter is earned by reaching the player, never by a timer teleport.
  if(phase==='approaching'&&distance(point,player)<=34&&visible>=1.6){phase='contact';route=[];return snapshot();}
  if(phase==='approaching'||phase==='departing'){
   let budget=dt*(phase==='departing'?150:105);
   while(route.length&&budget>0){
    const target=route[0],gap=distance(point,target);
    if(!clear(point,target)){reset();return snapshot();}
    if(gap<.01){route.shift();continue;}
    const step=Math.min(gap,budget);point.heading=Math.atan2(target.y-point.y,target.x-point.x);
    point.x+=Math.cos(point.heading)*step;point.y+=Math.sin(point.heading)*step;point.moving=true;budget-=step;
    // Keep every corner, even when it falls between two short animation steps.
    if(phase==='approaching'&&distance(walked.at(-1),point)>.01)walked.push(copy(point));
    if(step>=gap)route.shift();
   }
   if(phase==='departing'&&!route.length){fade=Math.max(0,fade-dt*1.8);if(!fade){point=null;phase='done';}}
  }
  return snapshot();
 }
 function depart(){if(!point)return;phase='departing';route=walked.slice().reverse();fade=1;}
 function hold(){if(point){phase='contact';point.moving=false;}}
 function place(p){reset();point={...copy(p),heading:0,moving:false};phase='contact';walked=[copy(p)];}
 function snapshot(){return {phase,point:point?{...point,alpha:fade}:null,visible};}
 return {tick,reset,depart,hold,place,snapshot};
}
root.UPPDRAG_EVENT_APPROACH={create};
if(typeof module!=='undefined')module.exports={create};
})(typeof window!=='undefined'?window:globalThis);
