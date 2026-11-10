'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict'),{createCanvas}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),scene=read('chapter3-scenes.js');
const c={console,devicePixelRatio:1,court:{phase:'available'},timeline:{afterUprising:false},room:()=>c.interior.kind,interior:{kind:'square'},UPPDRAG_PAPER_FIBRES:{material:(g,color)=>color},UPPDRAG_ROOM_ART:{},UPPDRAG_ROOM_STAGING:{PLANS:{}},ROOM_BY_REGION:{main:{}}};c.window=c;vm.createContext(c);
vm.runInContext(scene.slice(scene.indexOf('function supportingActors('),scene.indexOf('function speak(lines,'))+';window.registry={roomActors,personPose,supportingActors};',c);
vm.runInContext(read('scene-presence.js'),c);const P=c.UPPDRAG_SCENE_PRESENCE;
c.UPPDRAG_CH3_SCENES={roomActors:c.registry.roomActors,story:{afterUprising:false}};
const copy={style:{},scrollTop:0},bubble={hidden:false,style:{setProperty(k,v){this[k]=v;}},getClientRects:()=>[{}],querySelector:()=>copy,getBoundingClientRect(){return {height:94,width:parseFloat(this.style.width)||300};}};
c.document={getElementById:id=>id==='adventureDialog'?bubble:null};c.getComputedStyle=()=>({paddingTop:'14px',paddingBottom:'14px',borderTopWidth:'0px',borderBottomWidth:'0px'});
const target={id:'adventureTail',dataset:{},__presenceBubble:bubble};
for(const tall of [false,true]){
 const geo={w:tall?430:1200,h:tall?760:675,left:0,top:0,p:{scale:tall?.58:.93,x:0,y:0},c:{key:'square',cast:{name:'Bonden'}},poses:tall?[[157,990,.57],[435,962,.57]]:[[325,688,.63],[710,642,.59]]};
 c.stage={getBoundingClientRect:()=>({width:geo.w,height:geo.h})};c.UPPDRAG_MEETINGS={geometryForRoom:()=>geo};
 const extra=c.registry.roomActors(geo);assert.equal(extra.length,1,'the square has just the farmer, soldier and player');assert.equal(extra[0].name,'Soldaten');assert.equal(extra[0].role,'soldier-guard');
 const heads=P.sceneGeometry().heads;assert.deepEqual(Array.from(heads,a=>a.name),['Du','Bonden','Soldaten']);
 const tip=who=>{const p=c.registry.personPose(who,geo);return {x:geo.left+geo.p.x+p[0]*geo.p.scale,y:geo.top+geo.p.y+(p[1]-305*p[2])*geo.p.scale};};
 const farmer=tip('Bonden'),soldier=tip('Soldaten');assert(Math.hypot(farmer.x-soldier.x,farmer.y-soldier.y)>65);
 // Reproduce the original failure: no supporting actor in bubble geometry.
 c.UPPDRAG_CH3_SCENES.roomActors=undefined;
 assert.equal(P.speech(target,{box:{x:50,y:50,w:260,h:94},tip:soldier}).speaker,'Bonden');
 c.UPPDRAG_CH3_SCENES.roomActors=c.registry.roomActors;
 for(const who of ['Bonden','Soldaten','Du','Soldaten','Bonden']){
  const result=P.speech(target,{box:{x:50,y:50,w:260,h:94},tip:tip(who)});
  assert.equal(result.speaker,who,'each actual bubble anchors to the named speaker in '+(tall?'portrait':'landscape'));
 }
}
// Supporting speakers in the other chapter-three rooms use the same registry.
const squareGeometry=c.UPPDRAG_MEETINGS.geometryForRoom();
for(const [place,primary,names]of [['riksdag','Elin',['Hatten','Mössan']],['fort','David',['Fästningsvakten']]]){
 c.interior={kind:place};const geo={...squareGeometry,c:{key:place,cast:{name:primary}},poses:[[135,996,.77],[450,900,.77]]};c.UPPDRAG_MEETINGS={geometryForRoom:()=>geo};
 for(const name of names){const pos=c.registry.personPose(name,geo),tip={x:geo.p.x+pos[0]*geo.p.scale,y:geo.p.y+(pos[1]-305*pos[2])*geo.p.scale};assert.equal(P.speech(target,{box:{x:30,y:30,w:260,h:94},tip}).speaker,name);}
}
c.interior={kind:'square'};c.UPPDRAG_MEETINGS={geometryForRoom:()=>squareGeometry};
// Use the real painting path too: the soldier is drawn once, in uniform,
// and the same three names used by the speech engine are shown below the actors.
vm.runInContext(scene.slice(scene.indexOf('function drawProps('),scene.indexOf('function drawInheritedBed('))+';window.drawProps=drawProps;',c);
for(const speaking of ['Bonden','Soldaten','Du']){
 c.engine={roomSpeaker:speaking};const painted=[],labels=[],g=createCanvas(720,1040).getContext('2d'),fill=g.fillText.bind(g);g.fillText=(name,...args)=>{labels.push(name);return fill(name,...args);};
 c.drawProps(g,'square',true,0,{side(...args){painted.push({actor:args[3],speaking:args[6]});}});
 assert.equal(painted.length,1);assert.equal(painted[0].actor.name,'Soldaten');assert.equal(painted[0].actor.role,'soldier-guard');assert.equal(painted[0].speaking,speaking==='Soldaten');assert.deepEqual(labels,['Du','Bonden','Soldaten']);
}
assert(read('index.html').includes('scene-presence.js?v=1.4.2'));assert(read('integration.js').includes('scene-presence.js?v=1.4.2'));
console.log('PASS square speaker regression: reproduced soldier-to-farmer snapping, correct farmer/soldier/player bubbles in both orientations, shared paint/anchor geometry, three clear labels and one uniformed soldier');
