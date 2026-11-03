/* Read-only sound context for the outer audio controller. No game writes,
 * animation loop, camera changes or new movement logic. */
(function(){
'use strict';
if(window.UPPDRAG_AMBIENCE_STATE)return;
const read=(fn,fallback=null)=>{try{return fn()??fallback;}catch{return fallback;}};
let previous=null;
function state(){
 const r=read(()=>region),room=read(()=>interior),point=read(()=>player);
 const regionId=typeof r?.id==='string'?r.id:'',place=typeof room?.kind==='string'?room.kind:'';
 const travelling=!!(read(()=>voyage)||read(()=>sailing));
 const pilot=window['UPPDRAG_CH'+window.__INTEGRATED_CHAPTER+'_PILOT'];
 const visible=!!regionId&&!read(()=>document.hidden,false)&&!window.__ROOM_BOOTING;
 const study=!!(read(()=>pilot?.studyBusy,false)||read(()=>document.body.classList.contains('ch1-open'),false)||read(()=>document.querySelector('#ch1Modal:not([hidden])'),false));
 const event=window.UPPDRAG_EVENT_ENGINE,openEvent=read(()=>document.getElementById('adventureDialog')?.open,false);
 // busy also includes the thief's running chase; it is not itself dialogue.
 const eventDialogue=!!(read(()=>event?.roomSpeaker,false)||(read(()=>event?.blocking,false)&&(openEvent||read(()=>event.state?.thief,'')!=='chasing')));
 const dialogue=!!(read(()=>window.UPPDRAG_MEETINGS.state.talking,false)||read(()=>window['UPPDRAG_CH'+window.__INTEGRATED_CHAPTER+'_CITY_LIFE'].active,false)||eventDialogue);
 const narration=!!read(()=>window.speechSynthesis?.speaking||window.speechSynthesis?.pending,false);
 let scene='quiet';
 if(travelling)scene='sailing';
 else if(room?.outdoor||['waterfront','quay','marstrandHarbor','colonyHarbor'].includes(place))scene='harbour';
 else if(room){
  if(place==='print')scene='print';
  else if(place==='workshop')scene='workshop';
  else if(place==='farm')scene='country';
  else if(['cafe','homes','barnhus'].includes(place))scene='home';
 }else if(regionId){
  scene=regionId==='main'?'city':'harbour';
  const harbour=read(()=>navigationPoint(r,r.harbor));
  if(harbour&&point&&Math.hypot(point.x-harbour.x,point.y-harbour.y)<220)scene='harbour';
 }
 const now=read(()=>performance.now(),Date.now()),outside=visible&&!room&&!travelling;
 const coordinates=Number.isFinite(point?.x)&&Number.isFinite(point?.y);
 let walking=false;
 if(outside&&coordinates&&previous?.outside&&previous.region===regionId){
  const elapsed=now-previous.at,distance=Math.hypot(point.x-previous.x,point.y-previous.y);
  // A fresh region, doorway, stale sample or teleport must not make footsteps.
  walking=elapsed>=0&&elapsed<1500&&distance>.3&&distance<=Math.min(420,Math.max(50,elapsed*.7+24));
 }
 previous={region:regionId,x:point?.x,y:point?.y,at:now,outside:outside&&coordinates};
 return {scene,place,region:regionId,walking,study,dialogue,narration,visible};
}
window.UPPDRAG_AMBIENCE_STATE=state;
function gesture(event){
 if(event?.isTrusted===false||event?.repeat)return;
 try{window.parent?.UPPDRAG_AMBIENT?.gesture?.();}catch{}
}
read(()=>document.addEventListener('pointerdown',gesture,true));
read(()=>document.addEventListener('keydown',gesture,true));
})();
