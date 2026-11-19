'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict'),{createCanvas}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),scene=read('chapter3-scenes.js');let now=0,rect={width:1280,height:720,left:17,top:29};
const c={performance:{now:()=>now},devicePixelRatio:1,UPPDRAG_ROOM_ART:{},UPPDRAG_PAPER_FIBRES:{material:(g,color)=>color},ROOM_BY_REGION:{main:{}},motion:{matches:false},pilot:null,roomCanvas:{getBoundingClientRect:()=>rect},roomView:{getBoundingClientRect:()=>({left:0,top:0})},CAST:{player:{name:'Du'},square:{name:'Bonden'},courtyard:{name:'Karin'}},court:{phase:'available'},timeline:{afterUprising:false}};c.window=c;c.room=()=>c.interior?.kind;vm.createContext(c);
let staging=read('_decoded/room-staging.js');vm.runInContext(staging.slice(0,staging.indexOf('// Reserve real layout space'))+'})();',c);vm.runInContext(read('_decoded/npc-motion-ch3.js'),c);vm.runInContext(read('chapter3-presentation.js'),c);vm.runInContext(read('chapter3-courtyard-puzzle.js'),c);const art=c.UPPDRAG_CH3_PRESENTATION.install();
const meeting=c.UPPDRAG_CH3_PRESENTATION.source('meeting-ch3-pilot.js',read('_decoded/meeting-ch3-pilot.js'));
vm.runInContext(meeting.slice(meeting.indexOf('  const PLACEMENT='),meeting.indexOf('  function drawPeople('))+';window.measureLive=measure;',c);
vm.runInContext(scene.slice(scene.indexOf('function supportingActors('),scene.indexOf('function speak(lines,'))+';window.roomActors=roomActors;',c);
for(const place of ['square','courtyard'])for(const phase of ['available','open'])for(const [w,h]of [[1280,720],[720,1040],[1400,600],[430,900],[900,430]])for(const reduced of [false,true]){
 rect={width:w,height:h,left:17,top:29};c.motion.matches=reduced;c.interior={kind:place};c.court={phase};now=0;c.UPPDRAG_ROOM_STAGING.enter(place,now);const first=c.measureLive(),poses=JSON.stringify(first.poses),actors=JSON.stringify(c.roomActors(first));
 for(const time of [100,400,1500,5000]){now=time;c.UPPDRAG_CH3_NPC_MOTION.approach(time);const measured=c.measureLive();assert.equal(JSON.stringify(measured.poses),poses,'starting speech cannot send the host to an old room anchor');c.UPPDRAG_CH3_NPC_MOTION.returnToWork(time+10);now=time+500;assert.equal(JSON.stringify(c.measureLive().poses),poses);assert.equal(JSON.stringify(c.roomActors(measured)),actors);}
 const tall=w/h<1.02,people=Array.from(c.roomActors(first));if(place==='courtyard'){
  assert(people.every(a=>a.role.startsWith('farmer-')),'square soldiers never leak into the courtyard');const Y=art.yardFrame(tall);assert.equal(Y.sx,Y.sy,'people and furniture use a uniform paper scale');const floor=Y.y+40*Y.sy;
  for(const p of [...first.poses,...people.map(a=>a.pos)])assert(p[1]-305*p[2]>floor,'faces and bodies remain in front of the back wall');
  if(phase==='open'){const seated=people.find(a=>a.role==='farmer-rest').pos;assert(Math.abs(seated[1]-(Y.y+240*Y.sy))<.01,'feet touch the same ground as the bench legs');assert(Math.abs(seated[1]-112*seated[2]-(Y.y+174*Y.sy))<.01,'hips meet the seat');}
  for(const slot of Object.values(c.UPPDRAG_CH3_COURTYARD_PUZZLE.slots))assert(Y.y+(slot.y+42.5)*Y.sy>floor,'every barrel footprint is on the floor, including wall slots');
 }else{
  for(const a of people.filter(a=>a.role==='soldier-guard')){assert(a.pos[1]>(tall?755:575));if(!tall)assert(a.pos[0]+65*a.pos[2]<1150,'the line of soldiers stays clear of the foreground house');}
  if(tall){const cv=createCanvas(720,1040);cv.getBoundingClientRect=()=>({width:720,height:1040});c.UPPDRAG_ROOM_ART.render(cv,'square');assert.deepEqual([...cv.getContext('2d').getImageData(687,1000,1,1).data],[178,162,134,255],'the rightmost soldier stands on paving, not a decorative barrel');}
 }
}
console.log('PASS live scene grounding: real room staging + NPC motion + meeting measure, both room transitions, five aspect ratios, start/end speech and reduced motion, uniform courtyard scale, seated bench contact and soldiers clear of walls/barrels');
