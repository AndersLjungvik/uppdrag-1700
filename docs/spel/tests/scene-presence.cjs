const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const c={window:{}};vm.createContext(c);vm.runInContext(read('scene-presence.js'),c);const P=c.window.UPPDRAG_SCENE_PRESENCE;
for(const name of ['paper-dialogues.js','world-keyboard.js','world-keyboard-ch3.js','world-keyboard-ch4.js','world-life.js','world-life-ch3.js','world-life-ch4.js','meeting-ch1-pilot.js','meeting-ch2-pilot.js','meeting-ch3-pilot.js','meeting-ch4-pilot.js','chapter3-street-life.js','chapter4-street-life.js','world-street-pilot.js','world-classic-pilot.js']){
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
  assert(Math.hypot(q.x-p.x,q.y-p.y)<=3.001,'no teleport or speed boost');assert(Math.hypot(q.x-body.x,q.y-body.y)>=35.9,'physical separation');p=q;
 }
 assert(i<600,'a route around a stationary person makes progress');
}
let p={x:40,y:150};const memory=new Map();for(let i=0;i<100;i++){const q=P.walkStep(p,{x:260,y:150},3,[body],(a,b)=>b.y>=140&&b.y<=160,memory);assert(Math.hypot(q.x-body.x,q.y-body.y)>=35.9);p=q;}assert(p.x<115,'a blocked narrow passage stops rather than crossing a person');
c.player={x:100,y:150};c.interior=null;c.window.UPPDRAG_WORLD_KEYBOARD={buildingStep:()=>true};
let previous=null;
for(let i=0;i<240;i++){
 const raw={id:'approaching-resident',x:Math.min(200,i*2),y:150,heading:0,moving:i<100};
 const p=P.cityPose(raw,{id:'test'},i*20,false);
 assert(Math.hypot(p.x-100,p.y-150)>=35.9,'a moving NPC also respects a stationary player');
 if(previous)assert(Math.hypot(p.x-previous.x,p.y-previous.y)<=2.31,'NPC sidestep never teleports');
 previous=p;
}
assert(previous.x>175,'NPC completes the pass after yielding');
const calls=[],ctx={globalAlpha:.77,getTransform:()=>({a:1,b:0,c:0,d:1,e:0,f:0}),save(){},restore(){},setTransform(){}};
P.begin(ctx);P.enqueue(ctx,90,()=>calls.push('front'),'front');P.enqueue(ctx,30,()=>calls.push('player'),'player');P.enqueue(ctx,10,()=>calls.push('back'),'back');P.flush();assert.equal(calls.join(','),'back,player,front','player is drawn among people by ground depth');
assert.equal(P.enqueue(ctx,0,()=>{},'outside'),false);
console.log('PASS scene presence: all frozen source anchors, all-face bubble placement at three sizes, swept body separation, safe escape, 3 reachable detours, narrow passages, no teleport/speed boost and shared ground-depth drawing');
