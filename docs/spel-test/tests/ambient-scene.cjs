'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../ambient-scene.js'),'utf8');
function fixture(){
 const listeners=new Map();let now=100,gestures=0;
 const c={window:{__INTEGRATED_CHAPTER:4,__ROOM_BOOTING:false,parent:{UPPDRAG_AMBIENT:{gesture(){gestures++;}}}},document:{hidden:false,body:{classList:{contains:()=>false}},querySelector:()=>null,getElementById:()=>null,addEventListener:(name,callback,capture)=>listeners.set(name,{callback,capture})},performance:{now:()=>now},region:{id:'main',harbor:'quay'},interior:null,voyage:null,sailing:null,player:{x:800,y:700},navigationPoint:()=>({x:200,y:700})};
 vm.createContext(c);vm.runInContext(source,c);
 return {c,listeners,get gestures(){return gestures;},advance(ms=200){now+=ms;},read(){return JSON.parse(JSON.stringify(c.window.UPPDRAG_AMBIENCE_STATE()));}};
}
{
 const h=fixture(),before=JSON.stringify({region:h.c.region,player:h.c.player,interior:h.c.interior});
 assert.deepEqual(h.read(),{scene:'city',place:'',region:'main',walking:false,study:false,dialogue:false,narration:false,visible:true});
 assert.equal(JSON.stringify({region:h.c.region,player:h.c.player,interior:h.c.interior}),before,'reader changes no game state');
 for(const [place,scene] of [['print','print'],['workshop','workshop'],['farm','country'],['cafe','home'],['homes','home'],['barnhus','home'],['archive','quiet'],['science','quiet'],['palace','quiet'],['church','quiet'],['fort','quiet'],['opera','quiet']]){
  h.c.interior={kind:place};assert.equal(h.read().scene,scene,place);
 }
 h.c.interior={kind:'waterfront',outdoor:true,regionId:'main'};assert.equal(h.read().scene,'harbour');
 for(const place of ['quay','marstrandHarbor','colonyHarbor']){h.c.interior={kind:place};assert.equal(h.read().scene,'harbour',place);}
 h.c.interior=null;h.c.player={x:410,y:700};assert.equal(h.read().scene,'harbour','walking close to the quay changes ambience');
 h.c.player.x=430;assert.equal(h.read().scene,'city','city resumes beyond quay radius');
 for(const id of ['marstrand','colony']){h.c.region={id,harbor:'port'};h.c.player={x:1200,y:400};assert.equal(h.read().scene,'harbour',id+' outdoors');}
 h.c.interior={kind:'fort'};h.c.voyage={to:'main'};assert.equal(h.read().scene,'sailing','voyage overrides room');
 h.c.voyage=null;h.c.sailing={to:'marstrand'};assert.equal(h.read().scene,'sailing','legacy sailing supported');
}
{
 const h=fixture();h.read();h.advance();assert.equal(h.read().walking,false,'standing has no footsteps');
 h.c.player.x+=10;h.advance();assert.equal(h.read().walking,true,'actual coordinate movement');
 h.advance();assert.equal(h.read().walking,false,'a path that has stopped does not keep walking');
 h.c.path=[{x:1000,y:700}];h.advance();assert.equal(h.read().walking,false,'a planned path alone is not movement');
 h.c.player.x+=2000;h.advance();assert.equal(h.read().walking,false,'teleport is not a footstep');
 h.c.region={id:'marstrand',harbor:'port'};h.c.player.x=810;h.advance();assert.equal(h.read().walking,false,'region switch');
 h.c.player.x+=10;h.advance();assert.equal(h.read().walking,true,'walking begins on the next real island step');
 h.c.interior={kind:'fort'};h.c.player.x+=10;h.advance();assert.equal(h.read().walking,false,'indoors');
 h.c.interior=null;h.c.player.x+=10;h.advance();assert.equal(h.read().walking,false,'leaving a doorway resets motion sampling');
 h.c.player.x+=10;h.advance();assert.equal(h.read().walking,true);
 h.c.voyage={to:'main'};h.c.player.x+=10;h.advance();assert.equal(h.read().walking,false,'sailing');
 h.c.voyage=null;h.c.player.x+=10;h.advance();assert.equal(h.read().walking,false,'voyage arrival resets motion sampling');
 h.c.player.x+=10;h.advance(1600);assert.equal(h.read().walking,false,'stale sample');
 h.c.document.hidden=true;h.c.player.x+=10;h.advance();assert.equal(h.read().walking,false);assert.equal(h.read().visible,false);
 h.c.document.hidden=false;h.c.player.x+=10;h.advance();assert.equal(h.read().walking,false,'return from hidden is not a step');
}
{
 const h=fixture();h.c.window.UPPDRAG_CH4_PILOT={studyBusy:true};assert.equal(h.read().study,true);
 h.c.window.UPPDRAG_CH4_PILOT.studyBusy=false;h.c.document.body.classList.contains=name=>name==='ch1-open';assert.equal(h.read().study,true);
 h.c.document.body.classList.contains=()=>false;h.c.document.querySelector=()=>({hidden:false});assert.equal(h.read().study,true);
 h.c.document.querySelector=()=>null;assert.equal(h.read().study,false);
 h.c.window.UPPDRAG_MEETINGS={state:{talking:true}};assert.equal(h.read().dialogue,true);
 h.c.window.UPPDRAG_MEETINGS.state.talking=false;h.c.window.UPPDRAG_CH4_CITY_LIFE={active:true};assert.equal(h.read().dialogue,true);
 h.c.window.UPPDRAG_CH4_CITY_LIFE.active=false;h.c.window.UPPDRAG_EVENT_ENGINE={roomSpeaker:'Sam',blocking:false};assert.equal(h.read().dialogue,true);
 h.c.window.UPPDRAG_EVENT_ENGINE={blocking:true,state:{thief:'unseen'}};assert.equal(h.read().dialogue,true);
 h.c.window.UPPDRAG_EVENT_ENGINE={busy:true,blocking:false,state:{thief:'chasing'}};assert.equal(h.read().dialogue,false,'plain thief chase is not speech');
 h.c.window.UPPDRAG_EVENT_ENGINE.blocking=true;assert.equal(h.read().dialogue,false,'plain blocked chase without dialogue stays distinct');
 h.c.document.getElementById=id=>id==='adventureDialog'?{open:true}:null;assert.equal(h.read().dialogue,true,'caught-thief question is dialogue');
 h.c.window.speechSynthesis={speaking:true,pending:false};assert.equal(h.read().narration,true);
 h.c.window.speechSynthesis={speaking:false,pending:true};assert.equal(h.read().narration,true,'queued reading ducks before speech begins');
 h.c.window.speechSynthesis={speaking:false,pending:false};assert.equal(h.read().narration,false);
 h.c.window.__INTEGRATED_CHAPTER=5;h.c.window.UPPDRAG_CH5_PILOT={studyBusy:true};h.c.window.UPPDRAG_CH5_CITY_LIFE={active:true};assert.equal(h.read().study,true);assert.equal(h.read().dialogue,true);
}
{
 const h=fixture();for(const name of ['pointerdown','keydown'])assert.equal(h.listeners.get(name).capture,true);
 h.listeners.get('pointerdown').callback({isTrusted:true});assert.equal(h.gestures,1,'gesture forwarded synchronously');
 h.listeners.get('keydown').callback({isTrusted:true,repeat:false});assert.equal(h.gestures,2);
 h.listeners.get('keydown').callback({isTrusted:true,repeat:true});h.listeners.get('pointerdown').callback({isTrusted:false});assert.equal(h.gestures,2);
 h.c.window.parent={};h.listeners.get('pointerdown').callback({isTrusted:true});assert.equal(h.gestures,2,'missing outer audio fails quietly');
 vm.runInContext(source,h.c);assert.equal(h.listeners.size,2,'script does not register duplicate listeners');
}
{
 const c={window:{__ROOM_BOOTING:true},document:{}};vm.createContext(c);vm.runInContext(source,c);
 assert.deepEqual(JSON.parse(JSON.stringify(c.window.UPPDRAG_AMBIENCE_STATE())),{scene:'quiet',place:'',region:'',walking:false,study:false,dialogue:false,narration:false,visible:false},'early boot and absent optional APIs');
 vm.runInContext('let region; let player; let interior; let voyage; let sailing;',c);assert.equal(c.window.UPPDRAG_AMBIENCE_STATE().visible,false,'uninitialized world values');
}
console.log('PASS ambient scene: read-only chapter 4/5 rooms, quay proximity/islands, modern and legacy sailing, real movement sampling, study/dialogue/TTS, trusted capture gestures and missing/early APIs');
