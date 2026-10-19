/* Kapitel 1: tiny, stationary character presence in each paper room.
 * No walking to/from an "origin" when a conversation opens/closes.
 * Faces and gestures, not travel, give life. No learning/save/map writes. */
(function(){
'use strict';
const ACTORS={
 cafe:{name:'Maja',work:{wide:[967,662,.92],tall:[626,872,.89]},duration:350,cycle:4650,breath:.40,angle:.013},
 palace:{name:'Amira',work:{wide:[872,648,.87],tall:[608,807,.86]},duration:410,cycle:5370,breath:.30,angle:.018},
 quay:{name:'Jo',work:{wide:[1174,680,.45],tall:[1174,680,.45]},duration:280,cycle:3710,breath:.47,angle:.012},
 riksdag:{name:'Elin',work:{wide:[898,652,.88],tall:[626,815,.87]},duration:440,cycle:6020,breath:.22,angle:.011}
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