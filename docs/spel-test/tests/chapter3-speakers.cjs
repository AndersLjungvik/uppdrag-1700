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
 const extra=c.registry.roomActors(geo);assert.equal(extra.length,8,'four more farmers and a group of four soldiers');assert.equal(extra.filter(a=>a.role.startsWith('farmer-')).length,4);assert.equal(extra.filter(a=>a.role==='soldier-guard').length,4);
 const soldierActor=extra.find(a=>a.name==='Soldaten');assert.equal(soldierActor.role,'soldier-guard');assert(extra.filter(a=>a.role.startsWith('farmer-')).every(a=>a.pos[0]<soldierActor.pos[0]-65),'two visually separate groups');
 const heads=P.sceneGeometry().heads;assert.deepEqual(Array.from(heads,a=>a.name),['Du','Bonden',...Array.from(extra,a=>a.name)]);
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
c.UPPDRAG_CH3_SCENES.drawProps=c.drawProps;
vm.runInContext(read('chapter3-presentation.js'),c);const meeting=c.UPPDRAG_CH3_PRESENTATION.source('meeting-ch3-pilot.js',read('_decoded/meeting-ch3-pilot.js'));
const start=meeting.indexOf('    const drawings='),end=meeting.indexOf('    g.restore();',start),paint=meeting.slice(start,end);
for(const speaking of ['Bonden','Soldaten','Du']){
 c.engine={roomSpeaker:speaking};const painted=[],labels=[],g=createCanvas(720,1040).getContext('2d'),fill=g.fillText.bind(g);g.fillText=(name,...args)=>{labels.push(name);return fill(name,...args);};
 Object.assign(c,{g,a:{side(...args){painted.push({y:args[1],actor:args[3],speaking:args[6]});}},geometry:squareGeometry,poses:squareGeometry.poses,CAST:{player:{name:'Du'}},c:squareGeometry.c,now:0,speaker:speaking});
 vm.runInContext('{'+paint+'}',c);assert.equal(painted.length,10);assert.equal(painted.filter(a=>a.actor.name==='Soldaten').length,1);assert.equal(painted.filter(a=>a.actor.role==='soldier-guard').length,4);assert(painted.every((a,i)=>!i||a.y>=painted[i-1].y),'all people share one depth order');assert(painted.filter(a=>a.speaking).every(a=>a.actor.name===speaking));assert.deepEqual(labels,['Du','Bonden','Soldaten']);
}
assert(read('index.html').includes('scene-presence.js?v=1.5.0'));assert(read('integration.js').includes('scene-presence.js?v=1.5.0'));
console.log('PASS square groups: five farmers face four uniformed soldiers, separated in both orientations, every person painted once in depth order, correct speaker anchors and three clear speaking-role labels');
