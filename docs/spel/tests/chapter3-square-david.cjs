'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict'),{createCanvas}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const delegated=[],c={console,devicePixelRatio:1,localStorage:{setItem(){throw Error('presentation must not write progress');}},UPPDRAG_ROOM_ART:{render:(canvas,kind)=>{delegated.push(kind);return kind;},renderMemoryCloseup:()=>false},UPPDRAG_ROOM_STAGING:{PLANS:{}},ROOM_BY_REGION:{main:{}}};c.window=c;vm.createContext(c);
vm.runInContext(read('chapter3-presentation.js'),c);const P=c.UPPDRAG_CH3_PRESENTATION;vm.runInContext(read('scene-presence.js'),c);vm.runInContext(read('hat-shop.js'),c);
for(const name of ['meeting-ch3-pilot.js','chapter3-street-life.js','more-room-ch3-pilot.js'])new vm.Script(c.UPPDRAG_SCENE_PRESENCE.source(name,c.UPPDRAG_HAT_SHOP.source(name,P.source(name,read('_decoded/'+name)))));
const meeting=c.UPPDRAG_HAT_SHOP.source('meeting-ch3-pilot.js',P.source('meeting-ch3-pilot.js',read('_decoded/meeting-ch3-pilot.js')));
// Use the actual actor table after the source transformation, before generic
// room-life extras are allowed to fill only the still-missing room roles.
vm.runInContext(meeting.slice(meeting.indexOf('  const CAST='),meeting.indexOf('  window.UPPDRAG_ROOM_LIFE'))+';window.testCast=CAST;',c);
assert.equal(c.testCast.fort.name,'David');assert.equal(c.testCast.fort.role,'david');assert(meeting.includes("!woman&&role!=='david'&&role!=='cap-party'"));assert(meeting.includes("role==='cap-party'"));assert(meeting.includes("role==='hat-party'"));
// Render the actual puppet code: the cap must not inherit the broad brim.
c.document={createElement:()=>createCanvas(1,1),hidden:false};c.motion={matches:true};c.renderers=new WeakMap();c.speechAt=0;c.speechEnd=0;
vm.runInContext(meeting.slice(meeting.indexOf('  function puppets(ctx){'),meeting.indexOf('  const PLACEMENT='))+';window.testPuppets=puppets;',c);
const headPixels={};
for(const role of ['hat-party','cap-party']){const cv=createCanvas(240,400),g=cv.getContext('2d');c.testPuppets(g).side(120,380,1,{color:'#7b866b',role},true,0,false);headPixels[role]=g.getImageData(76,79,1,1).data[3];}
assert(headPixels['hat-party']>0);assert.equal(headPixels['cap-party'],0,'the wool cap has no inherited broad hat brim');
// Purchased headwear must still apply only to the player after all adapters.
let worn=0;c.UPPDRAG_HAT_SHOP.wear={id:'red-cap',kind:'cap'};c.UPPDRAG_HAT_SHOP.drawSideHat=()=>worn++;
const playerCanvas=createCanvas(240,400),playerPainter=c.testPuppets(playerCanvas.getContext('2d'));
playerPainter.side(120,380,1,c.testCast.player,true,0,false);assert.equal(worn,1);
playerPainter.side(120,380,1,{color:'#7b866b',role:'cap-party'},true,0,false);assert.equal(worn,1,'NPC heads cannot inherit the player purchase');
assert.equal(c.testCast.square.role,'farmer-pike');
for(const role of ['farmer-pike','farmer-scythe'])for(const afterUprising of [false,true]){
 c.UPPDRAG_CH3_SCENES={story:{afterUprising}};
 const cv=createCanvas(300,600),g=cv.getContext('2d');c.testPuppets(g).side(120,560,1,{color:'#8d7656',role},true,0,false);
 const data=g.getImageData(155,60,70,145).data;let armedPixels=0;for(let i=3;i<data.length;i+=4)if(data[i])armedPixels++;
 assert.equal(armedPixels>0,!afterUprising,'polearms are visible during the uprising, then put away: '+role);
 if(process.env.SCENE_QA_DIR&&!afterUprising)fs.writeFileSync(path.join(process.env.SCENE_QA_DIR,role+'.png'),cv.toBuffer('image/png'));
}
const city=P.source('chapter3-street-life.js',read('_decoded/chapter3-street-life.js'));
let phase=2,drawn=0;const map={phase:()=>phase,paper:()=>drawn++};vm.createContext(map);
vm.runInContext(city.slice(city.indexOf('function drawUprisingWeapon('),city.indexOf('function drawFigure('))+';this.weapon=drawUprisingWeapon;',map);
const context={save(){},restore(){},translate(){},rotate(){}};map.weapon(context,{role:'farmer',x:100,y:100,heading:0});assert(drawn>=3);
drawn=0;phase=3;map.weapon(context,{role:'farmer',x:100,y:100,heading:0});assert.equal(drawn,0,'later street scenes have no marching weapons');

P.install();assert(!c.UPPDRAG_ROOM_STAGING.PLANS.fort.job,'David must not inherit the map clerk quill animation');
assert(c.UPPDRAG_ROOM_STAGING.PLANS.square,'room actors share the square floor anchors');
for(const [w,h]of [[1280,720],[720,1040],[1400,600],[430,900],[900,430]]){
 const canvas=createCanvas(w,h);canvas.getBoundingClientRect=()=>({width:w,height:h});
 const exit=c.UPPDRAG_ROOM_ART.render(canvas,'square');assert(exit&&exit.w>0);const g=canvas.getContext('2d');
 for(const [x,y]of [[0,0],[w-1,0],[0,h-1],[w-1,h-1],[w/2,h/2]])assert.equal(g.getImageData(Math.floor(x),Math.floor(y),1,1).data[3],255,'the scene fills the canvas without letterbox gaps '+w+'x'+h);
 c.UPPDRAG_ROOM_ART.renderMemoryCloseup(canvas,'square');
}
c.UPPDRAG_ROOM_ART.render({},'church');assert.deepEqual(delegated,['church'],'other rooms retain their established renderer');
// Execute the actual story dispatch and its repeat-visit branch.
const scene=read('chapter3-scenes.js');assert(scene.includes("'hat-party'"));assert(scene.includes("'cap-party'"));const offer=scene.slice(scene.indexOf('function offerStudy('),scene.indexOf('function showSummary('));
let place='fort',complete=false,last=null;const timeline={seen:{}},mastery={summary:()=>({label:'Lärling'}),snapshot:()=>({state:{areas:{david:{learner:{status:complete?'clear':'available'}}}}})};
const s={window:null,UPPDRAG_MASTERY:mastery,timeline,order:{fort:3},aid:{fort:'david'},placeKey:()=>place,room:()=>place,idle:()=>true,stampTime:(p,first)=>{if(first)timeline.seen[p]=true;},speak:(lines,choices,action)=>{last={lines,choices,action};return true;},study(){}};s.window=s;vm.createContext(s);vm.runInContext(offer+';window.open=openRoom;',s);
s.open('fort');assert(last.lines.some(([who,line])=>who==='David'&&line.includes('David Hedenquist')),'David introduces himself on the first visit');
s.open('fort');assert.equal(last.lines[0][0],'David','David remains the speaker on return visits');
complete=true;s.open('fort');assert.equal(last.lines[0][0],'David');
place='square';assert.equal(s.open('fort'),false,'remote David conversations are still disallowed');
console.log('PASS square and David: full canvas in five aspect ratios, matching actor staging, source anchors, no art save writes, other rooms preserved, David on first/repeat/completed visits without the clerk job');
