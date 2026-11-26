'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict'),{createCanvas}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v)),scene=read('chapter3-scenes.js');
const c={devicePixelRatio:1,localStorage:{setItem(){throw Error('art cannot change a save');}},UPPDRAG_ROOM_ART:{render(){}},UPPDRAG_PAPER_FIBRES:{material:(g,color)=>color},UPPDRAG_ROOM_STAGING:{PLANS:{}},ROOM_BY_REGION:{main:{}},interior:{kind:'courtyard'},timeline:{afterUprising:false}};c.window=c;c.room=()=>c.interior.kind;vm.createContext(c);
for(const f of ['chapter3-courtyard-puzzle.js','chapter3-presentation.js'])vm.runInContext(read(f),c);c.art=c.UPPDRAG_CH3_PRESENTATION.install();c.Q=c.UPPDRAG_CH3_COURTYARD_PUZZLE;
vm.runInContext(scene.slice(scene.indexOf('function supportingActors('),scene.indexOf('function speak(lines,'))+';window.registry={roomActors,personPose};',c);
vm.runInContext(scene.slice(scene.indexOf('function positionTargets(){'),scene.indexOf('function closeArrangement(){'))+';window.alignTargets=positionTargets;',c);
for(const [w,h]of [[1280,720],[720,1040],[1400,600],[430,900],[900,430]]){
 const tall=w/h<1.02,D=tall?{w:720,h:1040}:{w:1280,h:720},scale=Math.min(w/D.w,h/D.h),p={scale,x:(w-D.w*scale)/2,y:(h-D.h*scale)/2},geo={w,h,left:17,top:29,p,c:{key:'courtyard',cast:{name:'Karin'}},poses:[[100,990,.7],[285,975,.7]]};
 const buttons=Object.keys(c.Q.slots).map(slot=>({dataset:{slot},style:{},setAttribute(){}}));c.targets={querySelectorAll:()=>buttons};c.UPPDRAG_MEETINGS={geometryForRoom:()=>geo};c.selected='a';
 const cv=createCanvas(w,h);cv.getBoundingClientRect=()=>({width:w,height:h});const g=cv.getContext('2d'),images=[];
 for(const phase of ['available','open']){
  c.court={phase,layout:phase==='open'?{a:'wall',b:'east'}:{a:'bench',b:'path'}};c.UPPDRAG_CH3_SCENES={courtyard:c.court};const before=copy(c.court);
  c.UPPDRAG_ROOM_ART.render(cv,'courtyard');const first=Buffer.from(g.getImageData(0,0,w,h).data);c.UPPDRAG_ROOM_ART.render(cv,'courtyard');assert(first.equals(Buffer.from(g.getImageData(0,0,w,h).data)),'paper edges do not jump between paints');
  for(const [x,y]of [[0,0],[w-1,0],[0,h-1],[w-1,h-1]])assert.equal(g.getImageData(x,y,1,1).data[3],255,'courtyard fills wide and tall canvases');
  c.alignTargets();const Y=c.art.yardFrame(tall);for(const b of buttons){const slot=c.Q.slots[b.dataset.slot],x=p.x+(Y.x+slot.x*Y.sx)*scale,y=p.y+(Y.y+slot.y*Y.sy)*scale;assert.equal(parseFloat(b.style.left),geo.left+x);assert.equal(parseFloat(b.style.top),geo.top+y);assert(x>0&&x<w&&y>0&&y<h);}
  images.push(['wall','east','bench','path'].map(id=>{const slot=c.Q.slots[id];return [...g.getImageData(Math.round(p.x+(Y.x+slot.x*Y.sx)*scale),Math.round(p.y+(Y.y+slot.y*Y.sy)*scale),1,1).data];}));
  const people=Array.from(c.registry.roomActors(geo));assert.equal(people.length,3);assert(people.every(a=>a.role.startsWith('farmer-')));assert.equal(people.find(a=>a.name==='Den äldre bonden').role,phase==='open'?'farmer-rest':'farmer-staff');assert.deepEqual(copy(c.court),before);
 }for(let i=0;i<4;i++)assert.notDeepEqual(images[0][i],images[1][i],'barrels are painted at their saved clickable slots, including the far wall');
}
let last,saves=0,arranged=false;c.idle=()=>true;c.read=()=>({});c.saveCourt=()=>saves++;c.speak=(lines,choices=[],action=()=>{})=>{last={lines,choices,action};return true;};c.startArrangement=()=>arranged=true;
vm.runInContext(scene.slice(scene.indexOf('function openCourtyard(){'),scene.indexOf('function startArrangement(){'))+';window.talkCourtyard=openCourtyard;',c);
c.court={phase:'available',layout:{a:'bench',b:'path'}};c.talkCourtyard();assert(last.lines.some(([who,text])=>who==='Den äldre bonden'&&text.includes('sitta')));last.action('talk');assert.equal(c.court.phase,'talked');assert(last.lines.some(([who,text])=>who==='Bonden'&&text.includes('några åt gången')));last.action('agree');assert.equal(c.court.phase,'agreed');last.action('arrange');assert(arranged);assert.equal(saves,2);
c.court.phase='open';c.talkCourtyard();assert(last.lines[0][1].includes('Nu kan de vila'));c.talkCourtyard();assert(last.lines[0][1].includes('Några åt gången'));assert.equal(c.court.revisited,true);
console.log('PASS courtyard: full art at five aspect ratios, stable cut edges, shared painted/clickable barrel slots, three ragged farmers, seated elder, coherent negotiation and preserved puzzle state');
