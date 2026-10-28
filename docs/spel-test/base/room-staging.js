/* Rooms v2: original cut-paper art, shared floor anchors and per-place work.
 * Presentation only: no chapter, question, currency, or save writes.
 * Uses the existing game loop. Walking and attention are distinct states.
 */
(function(){
'use strict';
const PLANS={
 cafe:{wait:550,duration:2900,auto:true,wide:[[1115,489,.74],[935,537,.78],[690,620,.86]],tall:[[600,686,.70],[576,745,.75],[442,902,.83]],player:{wide:[285,694,.84],tall:[114,982,.80]}},
 palace:{wait:600,duration:2350,auto:true,wide:[[885,522,.73],[737,534,.76],[550,583,.79]],tall:[[539,696,.68],[504,780,.73],[450,907,.80]],player:{wide:[260,690,.81],tall:[135,982,.76]}},
 archive:{tilt:.20,wide:[[705,592,.82]],tall:[[449,900,.80]],player:{wide:[374,690,.81],tall:[136,995,.78]}},
 riksdag:{tilt:.10,wide:[[550,581,.80]],tall:[[450,900,.78]],player:{wide:[280,694,.81],tall:[135,996,.77]}},
 print:{tilt:.065,workFace:{wide:false,tall:true},wide:[[1145,650,.82]],tall:[[261,750,.74]],player:{wide:[817,692,.81],tall:[136,995,.78]}},
 church:{duration:1300,returning:true,tilt:.06,wide:[[678,551,.79],[678,652,.84]],tall:[[398,742,.72],[398,898,.77]],player:{wide:[530,696,.80],tall:[138,1000,.76]}},
 barnhus:{tilt:.08,wide:[[881,619,.80]],tall:[[535,743,.71]],player:{wide:[282,690,.80],tall:[136,995,.76]}},
 science:{tilt:.12,wide:[[555,583,.80]],tall:[[449,901,.78]],player:{wide:[280,694,.81],tall:[135,996,.77]}},
 homes:{tilt:.055,workFace:true,wide:[[995,580,.78]],tall:[[479,759,.72]],player:{wide:[282,695,.80],tall:[136,1000,.77]}},
 farm:{tilt:.09,wide:[[542,582,.80]],tall:[[450,903,.79]],player:{wide:[280,694,.81],tall:[135,996,.77]}},
 fort:{tilt:.055,wide:[[550,584,.79]],tall:[[450,900,.77]],player:{wide:[280,694,.81],tall:[135,996,.77]}},
 quay:{tilt:.04,workFace:true,wide:[[1130,683,.45]],tall:[[1130,683,.45]],player:{wide:[1025,706,.41],tall:[1025,706,.41]}}
};
const STANDING={wide:[280,694,.81],tall:[135,996,.77]};
let visit=null;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x);
function enter(key,now=performance.now()){
 const p=PLANS[key];
 visit=p?{key,pending:false,greeted:false,from:0,target:0,at:now,
  routeFrom:0,routeTarget:p.auto?1:0,routeAt:now+(p.wait||0)}:null;
}
function attention(now){return visit?visit.from+(visit.target-visit.from)*ease(clamp((now-visit.at)/360)):0;}
function progress(now,reduced=false){
 if(!visit)return 1;
 const p=PLANS[visit.key];
 if(reduced||!p.duration)return visit.routeTarget;
 return visit.routeFrom+(visit.routeTarget-visit.routeFrom)*clamp((now-visit.routeAt)/p.duration);
}
function travel(to,now){
 visit.routeFrom=progress(now);visit.routeTarget=to;visit.routeAt=now;
}
function pose(key,tall,now=performance.now(),reduced=false){
 const p=PLANS[key];if(!p)return null;
 if(!visit||visit.key!==key)enter(key,now);
 const route=p[tall?'tall':'wide'],t=progress(now,reduced);
 const lengths=route.slice(1).map((a,i)=>Math.hypot(a[0]-route[i][0],a[1]-route[i][1]));
 let left=t*lengths.reduce((a,b)=>a+b,0),j=0;
 while(j<lengths.length-1&&left>lengths[j])left-=lengths[j++];
 const a=route[j],b=route[Math.min(j+1,route.length-1)],u=lengths[j]?left/lengths[j]:1;
 const moving=!reduced&&route.length>1&&now>=visit.routeAt&&Math.abs(t-visit.routeTarget)>.001;
 const engaged=reduced?visit.target:attention(now),work=!moving&&engaged<.35&&!p.auto;
 return {x:a[0]+(b[0]-a[0])*u,y:a[1]+(b[1]-a[1])*u,size:a[2]+(b[2]-a[2])*u,
  moving,working:work,headTilt:(p.tilt||0)*(1-engaged),
  faceRight:moving?((b[0]>a[0])===(visit.routeTarget>visit.routeFrom)):(engaged<.5&&(typeof p.workFace==='object'?p.workFace[tall?'tall':'wide']:p.workFace)||false),
  turn:0,greeting:engaged,active:visit.target===1,settling:now-visit.at<360,
  staged:true,arrived:Math.abs(t-visit.routeTarget)<.001};
}
function approach(now=performance.now()){if(!visit)return false;visit.from=attention(now);visit.target=1;visit.at=now;return true;}
function returnToWork(now=performance.now()){
 if(!visit)return false;
 visit.from=attention(now);visit.target=0;visit.at=now;
 if(PLANS[visit.key].returning)travel(0,now);
 return true;
}
function ready(now=performance.now(),reduced=false){return !visit||reduced||Math.abs(progress(now)-visit.routeTarget)<.001;}
function deferTalk(now=performance.now(),reduced=false){
 if(!visit)return false;
 const p=PLANS[visit.key];
 if(p.duration&&!p.auto&&visit.routeTarget!==1)travel(1,now);
 if(ready(now,reduced))return false;
 visit.pending=true;return true;
}
function greetingDue(now=performance.now(),reduced=false){
 if(!visit||!ready(now,reduced))return false;
 if(visit.pending){visit.pending=false;visit.greeted=true;return true;}
 if(PLANS[visit.key].auto&&!visit.greeted){visit.greeted=true;return true;}
 return false;
}
function animating(now=performance.now(),reduced=false){return !!visit&&!reduced&&(!ready(now,false)||now-visit.at<360);}
function playerPose(key,tall){return (PLANS[key]?.player||STANDING)[tall?'tall':'wide'];}
window.UPPDRAG_ROOM_STAGING={PLANS,enter,pose,approach,returnToWork,deferTalk,greetingDue,animating,playerPose,get actor(){return visit?.key||null;},get state(){return visit?{...visit}:null;}};
// Reserve real layout space for the chapter controls while indoors. Nothing is
// hidden from keyboard users, and no HUD sits on top of a door or a room title.
function installRoomHud(){
 const style=document.createElement('style');style.textContent=`
 body[data-room] #ch1Hud{position:relative!important;inset:auto!important;max-width:none!important;width:auto;margin:0!important;border:0;border-bottom:1px solid #baa98b;border-radius:0;padding:6px 12px!important;box-shadow:none;flex:0 0 auto;display:flex;gap:5px 15px;flex-wrap:wrap;align-items:center;background:#f8efdc;font:12px/1.4 system-ui}
 body[data-room] #ch1Hud strong{font:600 13px/1.3 Georgia,serif}
 body[data-room] #ch1Hud .ch1Wallet{font-size:12px;margin:0}
 body[data-room] #ch1Hud>div:last-child{margin-left:auto;display:flex;flex-wrap:wrap;gap:4px}
 body[data-room] #ch1Hud button{margin:0!important;min-height:36px}
 body[data-room] #interiorView .room-top{padding:7px 12px;flex-shrink:0}
 body[data-room] #interiorView .room-top h2{font-size:21px}
 @media(max-width:640px){body[data-room] #ch1Hud{padding:5px 9px!important;gap:4px 10px}body[data-room] #ch1Hud>div:last-child{margin:0;width:100%}body[data-room] #ch1Hud button{min-height:40px;padding:6px 8px;font-size:12px}body[data-room] #roomReturnText{display:none}}
 `;document.head.append(style);
 function sync(){
  const hud=document.getElementById('ch1Hud'),view=document.getElementById('interiorView'),stage=document.getElementById('stage');
  if(!hud||!view||!stage)return;
  if(document.body.dataset.room){const canvas=document.getElementById('interiorCanvas');if(hud.parentElement!==view)view.insertBefore(hud,canvas);}
  else if(hud.parentElement!==stage)stage.append(hud);
 }
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-room']});sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installRoomHud,{once:true});else installRoomHud();
})();
