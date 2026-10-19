/* Chapter 1 room presence, isolated from the rest of the adventure.
 * Coordinates match the established 1280x720 / 720x1040 paper-room layouts.
 * Motion never affects knowledge, scoring, save state, or the city map. */
(function(){
'use strict';
const ACTORS={
 cafe:{name:'Maja',work:{wide:[967,662,.92],tall:[626,872,.89]},
   greet:{wide:[921,680,.92],tall:[605,904,.89]},duration:640,cycle:4400,shift:1.2},
 palace:{name:'Amira',work:{wide:[872,648,.87],tall:[608,807,.86]},
   greet:{wide:[808,675,.87],tall:[574,839,.86]},duration:750,cycle:5400,shift:1.0},
 quay:{name:'Jo',work:{wide:[1174,680,.45],tall:[1174,680,.45]},
   greet:{wide:[1124,690,.45],tall:[1124,690,.45]},duration:480,cycle:3500,shift:1.5},
 riksdag:{name:'Elin',work:{wide:[898,652,.88],tall:[626,815,.87]},
   greet:{wide:[820,675,.88],tall:[572,846,.87]},duration:720,cycle:6100,shift:.75}
};
let actor=null,from=0,target=0,at=0;
const clamp=v=>Math.min(1,Math.max(0,v));
const smooth=t=>t*t*(3-2*t);
const current=(now=performance.now())=>{
 if(!actor)return 0;
 const spec=ACTORS[actor],age=Math.max(0,now-at),p=clamp(age/spec.duration);
 return from+(target-from)*smooth(p);
};
function attach(key,now=performance.now()){
 const next=ACTORS[key]?key:null;
 if(next!==actor){actor=next;from=target=0;at=now;}
}
function set(next,now=performance.now()){
 if(!actor)return false;
 const fraction=current(now);
 from=fraction;target=next?1:0;at=now;
 return true;
}
function pose(key,tall,now=performance.now(),reduced=false){
 if(!ACTORS[key])return null;
 attach(key,now);
 const spec=ACTORS[key],shape=tall?'tall':'wide',
 work=spec.work[shape],greet=spec.greet[shape];
 const p=reduced?target:current(now);
 const moving=!reduced&&now-at<spec.duration&&Math.abs(target-from)>.01;
 // Very slight presence while waiting: different rhythms, no identical sway.
 const breathe=reduced||moving?0:Math.sin(now/spec.cycle*Math.PI*2+key.length)*spec.shift;
 return {x:work[0]+(greet[0]-work[0])*p,
   y:work[1]+(greet[1]-work[1])*p+breathe,
   size:work[2],moving,greeting:p,
   working:p<.25,active:!!target};
}
function animating(now=performance.now(),reduced=false){
 return !reduced&&!!actor&&Math.abs(target-from)>.01&&now-at<ACTORS[actor].duration;
}
window.UPPDRAG_CH1_NPC_MOTION={ACTORS,attach,approach:now=>set(1,now),returnToWork:now=>set(0,now),pose,animating,
 get actor(){return actor},get greeting(){return target}};
})();