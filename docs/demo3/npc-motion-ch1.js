/* Kapitel 1: tiny, stationary character presence in each paper room.
 * No walking to/from an "origin" when a conversation opens/closes.
 * Faces and gestures, not travel, give life. No learning/save/map writes. */
(function(){
'use strict';
const ACTORS={
 cafe:{name:'Maja',work:{wide:[440,684,.92],tall:[211,875,.87]},duration:350,cycle:4650,breath:.65,angle:.045},
 palace:{name:'Amira',work:{wide:[890,678,.86],tall:[684,911,.60]},duration:410,cycle:5370,breath:.55,angle:.052},
 quay:{name:'Jo',work:{wide:[1130,683,.45],tall:[1130,683,.45]},duration:280,cycle:3710,breath:.78,angle:.048},
 riksdag:{name:'Elin',work:{wide:[844,676,.86],tall:[687,906,.60]},duration:440,cycle:6020,breath:.50,angle:.038},
 archive:{name:'Rut',work:{wide:[1035,679,.92],tall:[686,899,.57]},duration:510,cycle:6350,breath:.25,angle:.024}
};
let actor=null,from=0,target=0,at=0;
const clamp=v=>Math.min(1,Math.max(0,v));
const smooth=t=>t*t*(3-2*t);
function position(now){
 if(!actor)return 0;
 const spec=ACTORS[actor],t=clamp(Math.max(0,now-at)/spec.duration);
 return from+(target-from)*smooth(t);
}
function attach(key,now=performance.now()){
 const next=ACTORS[key]?key:null;
 if(next!==actor){actor=next;from=0;target=0;at=now;}
}
function set(next,now=performance.now()){
 if(!actor)return false;
 from=position(now);target=next?1:0;at=now;
 return true;
}
function pose(key,tall,now=performance.now(),reduced=false){
 const spec=ACTORS[key];if(!spec)return null;
 attach(key,now);
 const [x,y,size]=spec.work[tall?'tall':'wide'];
 const engaged=reduced?target:position(now);
 const settling=!reduced&&Math.abs(target-from)>.001&&now-at<spec.duration;
 // Maximum displacement is under half a canvas coordinate. No footstep.
 const breathing=reduced?0:Math.sin(now/spec.cycle*Math.PI*2+key.length)*spec.breath;
 // A nearly imperceptible body turn from the task to the visitor.
 const turn=reduced?0:spec.angle*(engaged-.5)+Math.sin(now/spec.cycle*Math.PI*2)*.0016;
 return {x,y:y+breathing,size,turn,
   moving:false,working:engaged<.25,greeting:engaged,active:target===1,settling};
}
function animating(now=performance.now(),reduced=false){
 return !reduced&&!!actor&&Math.abs(target-from)>.001&&now-at<ACTORS[actor].duration;
}
window.UPPDRAG_CH1_NPC_MOTION={
 ACTORS,attach,approach:now=>set(1,now),returnToWork:now=>set(0,now),pose,animating,
 get actor(){return actor},get greeting(){return target}
};
})();