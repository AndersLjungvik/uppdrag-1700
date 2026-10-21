/* Room choreography v1. Same artwork, same game loop and no learning-state writes. */
(function(){
'use strict';
const PLANS={
 cafe:{wait:550,duration:2900,auto:true,wide:[[1115,489,.74],[935,537,.78],[690,620,.86]],tall:[[600,686,.70],[576,745,.75],[442,902,.83]],player:{wide:[285,694,.84],tall:[114,982,.80]}},
 palace:{wait:600,duration:2350,auto:true,wide:[[885,522,.73],[737,534,.76],[550,583,.79]],tall:[[539,696,.68],[504,780,.73],[450,907,.80]],player:{wide:[790,696,.81],tall:[135,982,.76]}},
 archive:{wait:0,duration:0,auto:false,wide:[[705,592,.82]],tall:[[449,900,.80]],player:{wide:[374,690,.81],tall:[136,995,.78]}}
};
let visit=null;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x);
function enter(key,now=performance.now()){visit=PLANS[key]?{key,start:now,pending:false,greeted:false,attention:0,from:0,target:0,at:now}:null;}
function attention(now){if(!visit)return 0;return visit.from+(visit.target-visit.from)*ease(clamp((now-visit.at)/360));}
function pose(key,tall,now=performance.now(),reduced=false){
 const plan=PLANS[key];if(!plan)return null;
 if(!visit||visit.key!==key)enter(key,now);
 const route=plan[tall?'tall':'wide'],t=reduced||!plan.duration?1:clamp((now-visit.start-plan.wait)/plan.duration);
 const widths=route.slice(1).map((p,i)=>Math.hypot(p[0]-route[i][0],p[1]-route[i][1]));
 const total=widths.reduce((a,b)=>a+b,0);let left=t*total,j=0;
 while(j<widths.length-1&&left>widths[j])left-=widths[j++];
 const a=route[j],b=route[Math.min(j+1,route.length-1)],u=widths[j]?left/widths[j]:1;
 const moving=!reduced&&t>0&&t<1,engaged=reduced?visit.target:attention(now);
 return {x:a[0]+(b[0]-a[0])*u,y:a[1]+(b[1]-a[1])*u,size:a[2]+(b[2]-a[2])*u,moving,working:key==='archive'&&engaged<.5,headTilt:key==='archive'?.20*(1-engaged):0,faceRight:moving?b[0]>a[0]:false,turn:0,greeting:engaged,active:visit.target===1,settling:now-visit.at<360,staged:true,arrived:t>=1};
}
function approach(now=performance.now()){if(!visit)return false;visit.from=attention(now);visit.target=1;visit.at=now;return true;}
function returnToWork(now=performance.now()){if(!visit)return false;visit.from=attention(now);visit.target=0;visit.at=now;return true;}
function ready(now=performance.now(),reduced=false){if(!visit)return true;const p=PLANS[visit.key];return reduced||now>=visit.start+p.wait+p.duration;}
function deferTalk(now=performance.now(),reduced=false){if(!visit||ready(now,reduced))return false;visit.pending=true;return true;}
function greetingDue(now=performance.now(),reduced=false){
 if(!visit||!ready(now,reduced))return false;
 if(visit.pending){visit.pending=false;visit.greeted=true;return true;}
 if(PLANS[visit.key].auto&&!visit.greeted){visit.greeted=true;return true;}
 return false;
}
function animating(now=performance.now(),reduced=false){return !!visit&&!reduced&&(!ready(now,false)||now-visit.at<360);}
function playerPose(key,tall){return PLANS[key]?.player[tall?'tall':'wide'];}
window.UPPDRAG_ROOM_STAGING={PLANS,enter,pose,approach,returnToWork,deferTalk,greetingDue,animating,playerPose,get actor(){return visit?.key||null;},get state(){return visit?{...visit}:null;}};
})();