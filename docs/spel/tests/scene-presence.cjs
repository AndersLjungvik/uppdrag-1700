const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const c={window:{}};vm.createContext(c);vm.runInContext(read('scene-presence.js'),c);const P=c.window.UPPDRAG_SCENE_PRESENCE;
for(const name of ['paper-dialogues.js','living-dialogues.js','world-keyboard.js','world-keyboard-ch3.js','world-keyboard-ch4.js','world-keyboard-ch5.js','world-life.js','world-life-ch3.js','world-life-ch4.js','world-life-ch5.js','meeting-ch1-pilot.js','meeting-ch2-pilot.js','meeting-ch3-pilot.js','meeting-ch4-pilot.js','meeting-ch5-pilot.js','chapter3-street-life.js','chapter4-street-life.js','chapter5-street-life.js','world-street-pilot.js','world-classic-pilot.js']){
 let s=read('_decoded/'+name);if(name.startsWith('world-street')||name.startsWith('world-classic'))s=s.replace('UPPDRAG_MEETINGS.drawMapPlayer(ctx,player,window.UPPDRAG_WORLD_KEYBOARD?.motionPath||path,performance.now());','UPPDRAG_MEETINGS.drawMapPlayer(ctx,player,window.UPPDRAG_WORLD_KEYBOARD?.motionPath||path,performance.now());window.UPPDRAG_EVENT_ENGINE?.drawCover(ctx,region);');new Function(P.source(name,s));
}
const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
for(const bounds of [{x:8,y:8,w:374,h:590},{x:8,y:8,w:744,h:250},{x:8,y:8,w:1184,h:680}]){
 const faces=[{x:bounds.w*.3,y:bounds.h*.68,w:62,h:62},{x:bounds.w*.57,y:bounds.h*.52,w:66,h:66},{x:bounds.w*.86,y:bounds.h*.7,w:48,h:60}];
 const b=P.bubbleLayout({box:{x:bounds.w*.3,y:bounds.h*.65,w:Math.min(365,bounds.w),h:160},anchor:{x:faces[1].x,y:faces[1].y},bounds,faces,bodies:faces});
 assert(b.x>=bounds.x&&b.y>=bounds.y&&b.x+b.w<=bounds.x+bounds.w+.01&&b.y+b.h<=bounds.y+bounds.h+.01);assert(faces.every(f=>overlap(b,f)<.1),'all faces remain free: '+JSON.stringify(bounds));
}
const body={id:'resident',x:150,y:150,radius:18};assert.equal(P.bodyStep({x:100,y:150},{x:160,y:150},[body]),false,'swept collision prevents walking through a person');assert.equal(P.bodyStep({x:150,y:150},{x:147,y:150},[body]),true,'an old overlapping spawn can escape');
for(const target of [{x:260,y:150},{x:150,y:260},{x:260,y:260}]){
 let p=target.y===260&&target.x===150?{x:150,y:40}:target.x===260&&target.y===260?{x:40,y:40}:{x:40,y:150};const memory=new Map();let i=0;
 for(;i<600&&Math.hypot(target.x-p.x,target.y-p.y)>.2;i++){
  const q=P.walkStep(p,target,3,[body],(a,b)=>b.x>=10&&b.y>=10&&b.x<300&&b.y<300,memory);
  assert(Math.hypot(q.x-p.x,q.y-p.y)<=3.001,'no teleport or speed boost');assert(Math.hypot(q.x-body.x,q.y-body.y)>=23.9,'physical separation');p=q;
 }
 assert(i<600,'a route around a stationary person makes progress');
}
let p={x:40,y:150};const memory=new Map();for(let i=0;i<100;i++){const q=P.walkStep(p,{x:260,y:150},3,[body],(a,b)=>b.y>=140&&b.y<=160,memory);assert(Math.hypot(q.x-body.x,q.y-body.y)>=23.9);p=q;}assert(p.x<127,'a blocked narrow passage stops rather than crossing a person');
c.player={x:100,y:150};c.interior=null;c.window.UPPDRAG_WORLD_KEYBOARD={buildingStep:()=>true};
let previous=null;
for(let i=0;i<240;i++){
 const raw={id:'approaching-resident',x:Math.min(200,i*2),y:150,heading:0,moving:i<100};
 const p=P.cityPose(raw,{id:'test'},i*20,false);
 assert(Math.hypot(p.x-100,p.y-150)>=11.9,'a moving NPC leaves the player feet clear');
 if(previous)assert(Math.hypot(p.x-previous.x,p.y-previous.y)<=2.31,'NPC sidestep never teleports');
 previous=p;
}
assert(previous.x>175,'NPC completes the pass after yielding');
assert(Math.abs(P.turn(Math.PI-.05,-Math.PI+.05,.2)-(Math.PI+.05))<.001,'a look across the angle boundary does not spin around');
// Paper silhouettes may overlap. Small sidesteps leave the feet clear in
// either direction, without moving the resident along the alley to its exit.
let clock=0;c.performance={now:()=>clock};c.window.__INTEGRATED_CHAPTER=4;
for(const direction of [1,-1]){
 let resident={id:'alley-resident',x:direction>0?205:195,y:150,heading:direction>0?Math.PI:0,moving:false};
 c.player={x:direction>0?145:255,y:150};
 const alley={id:'alley-'+direction},rawResident={...resident},goal={x:direction>0?400:50,y:150};
 const ground=q=>q.x>=25&&q.x<=475&&q.y>=25&&q.y<=275&&(!(q.x>100&&q.x<300)||(q.y>=140&&q.y<=160));
 c.window.UPPDRAG_WORLD_KEYBOARD={buildingStep:(r,a,b)=>ground(b)};
 c.window.UPPDRAG_CH4_CITY_LIFE={people:()=>[resident]};
 let steppedAside=false,waited=false,overlappingFrames=false;
 for(let i=0;i<500&&Math.hypot(c.player.x-goal.x,c.player.y-goal.y)>1;i++){
  clock=i*20;const next=P.advance(alley,c.player,goal,3.6);c.player={x:next.x,y:next.y};
  const last={...resident};resident=P.cityPose(rawResident,alley,clock);
  assert(Math.hypot(resident.x-last.x,resident.y-last.y)<=2.31,'yielding respects walking speed');
  assert(Math.hypot(c.player.x-resident.x,c.player.y-resident.y)>=8.9,'ground centres stay separate during a close pass');
  assert(ground(resident)&&ground(c.player),'both stay clear of the houses');
  assert(Math.abs(resident.x-rawResident.x)<.1,'the resident does not retreat down the alley');
  assert(Math.abs(resident.y-rawResident.y)<=14.01,'the sidestep stays small');
  if(Math.abs(resident.y-150)>1)steppedAside=true;
  if(steppedAside&&!resident.moving&&direction*(c.player.x-resident.x)<20)waited=true;
  if(Math.hypot(c.player.x-resident.x,c.player.y-resident.y)<28)overlappingFrames=true;
 }
 assert(steppedAside,'the resident takes a small sidestep');assert(waited,'the resident waits beside the walking lane');assert(overlappingFrames,'paper frames may cross during the close pass');assert(Math.hypot(c.player.x-goal.x,c.player.y-goal.y)<=1,'a head-on narrow meeting actually lets the player through in either direction');
}
// Held arrows keep requesting the same compass direction, even after a
// sidestep. A yielding resident must not pull that walk sideways into a house.
let resident={id:'book',x:485,y:705,heading:0,moving:false};const rawBook={...resident},street={id:'courtesy-regression'};
c.player={x:385,y:705};clock=0;
c.window.UPPDRAG_WORLD_KEYBOARD={buildingStep:(r,a,b)=>b.x>25&&b.x<900&&b.y>25&&b.y<1000&&!(b.x>226&&b.x<499&&b.y>376&&b.y<605)};
c.window.UPPDRAG_CH4_CITY_LIFE={people:()=>[resident]};resident=P.cityPose(rawBook,street,clock,true);
for(let i=1;i<350&&c.player.x<580;i++){
 clock=i*20;const next=P.advance(street,c.player,{x:c.player.x+120,y:c.player.y},3.6,'manual');c.player={x:next.x,y:next.y};resident=P.cityPose(rawBook,street,clock);
 assert(Math.abs(c.player.y-705)<12,'two people do not chase each other sideways');
 assert(Math.hypot(c.player.x-resident.x,c.player.y-resident.y)>=11.8);
}
assert(c.player.x>=580,'held arrows continue past the yielding resident beside the house');
const host={id:'host',x:150,y:150};c.player={x:100,y:150};c.window.UPPDRAG_WORLD_KEYBOARD={buildingStep:()=>true};c.window.UPPDRAG_CH4_CITY_LIFE={people:()=>[host]};
let arrived=false;for(let i=0;i<300&&!arrived;i++){clock+=20;const next=P.advance({id:'occupied-target'},c.player,host,3);c.player={x:next.x,y:next.y};arrived=next.arrived;}
assert(arrived,'an occupied route node finishes beside the person without orbiting');assert(Math.hypot(c.player.x-host.x,c.player.y-host.y)>=11.9,'arrival keeps foot centres separate');
// The child controls its own orientation until an actual conversation starts.
c.region={id:'attention'};c.player={x:0,y:0};c.interior=null;let reduced=false,hostPoint={id:'book',x:60,y:60};
c.window.matchMedia=()=>({matches:reduced});const city={teaser:'book',actor:null,find:()=>hostPoint};c.window.UPPDRAG_CH4_CITY_LIFE=city;
let view=P.playerPose(c.player,[],0,0);
for(let i=1;i<=100;i++){hostPoint={...hostPoint,x:Math.cos(i)*100,y:Math.sin(i)*100};view=P.playerPose(c.player,[],view.heading,i*80);assert.equal(view.baseHeading,0,'a nearby invitation cannot keep rotating the child');}
assert.equal(view.moving,false);assert.equal(view.x,0);assert.equal(view.y,0);
hostPoint={id:'book',x:60,y:60};city.actor='book';
for(let i=101;i<=130;i++)view=P.playerPose(c.player,[],view.heading,i*80);
assert(Math.abs(view.baseHeading-Math.PI/4)<.001,'turn toward the person when the conversation begins');
hostPoint={...hostPoint,y:-60};for(let i=131;i<=160;i++)view=P.playerPose(c.player,[],view.heading,i*80);
assert(Math.abs(view.baseHeading-Math.PI/4)<.001,'do not track every movement during a conversation');
c.player={x:0,y:3};view=P.playerPose(c.player,[{x:0,y:100}],view.heading,12900);assert(Math.abs(view.heading-Math.PI/2)<.001,'walking direction takes priority');assert(view.moving);
city.actor=null;reduced=true;for(let i=1;i<=100;i++)view=P.playerPose(c.player,[],view.heading,12900+i*80);assert.equal(view.heading,view.baseHeading,'reduced motion disables idle looks');
const calls=[],ctx={globalAlpha:.77,getTransform:()=>({a:1,b:0,c:0,d:1,e:0,f:0}),save(){},restore(){},setTransform(){}};
P.begin(ctx);P.enqueue(ctx,90,()=>calls.push('front'),'front');P.enqueue(ctx,30,()=>calls.push('player'),'player');P.enqueue(ctx,10,()=>calls.push('back'),'back');P.flush();assert.equal(calls.join(','),'back,player,front','player is drawn among people by ground depth');
assert.equal(P.enqueue(ctx,0,()=>{},'outside'),false);
console.log('PASS scene presence: source anchors, all-face bubbles, body separation, safe escape, 3 detours, bounded turns, small sidesteps, overlapping frames with separate feet, no retreat in either direction, no teleport/speed boost and shared depth');
