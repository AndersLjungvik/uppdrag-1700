const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const sandbox={};vm.runInNewContext(fs.readFileSync(require('path').join(__dirname,'../event-approach.js'),'utf8'),sandbox);
const create=sandbox.UPPDRAG_EVENT_APPROACH.create;
// Walk east then north: every thief step must stay on those same two roads.
const a=create();let now=0,p={x:0,y:0},s;
const road=(a,b)=>(Math.abs(a.y)<.01&&Math.abs(b.y)<.01)||(Math.abs(a.x-300)<.01&&Math.abs(b.x-300)<.01);
for(let x=0;x<=300;x+=10){now+=50;p={x,y:0};s=a.tick(now,p,{enabled:x>=240,clear:road});}
assert.equal(s.phase,'approaching');assert(Math.hypot(s.point.x-p.x,s.point.y-p.y)>140,'visible from a distance');
for(let y=10;y<=150;y+=10){now+=50;p={x:300,y};s=a.tick(now,p,{enabled:true,clear:road});assert(s.point);assert(s.point.y===0||Math.abs(s.point.x-300)<.01,'no corner cutting');}
const at={...s.point};now+=60000;s=a.tick(now,p,{enabled:true,paused:true,clear:road});assert.equal(s.point.x,at.x);assert.equal(s.point.y,at.y);
now+=50;s=a.tick(now,p,{enabled:true,clear:road});assert(Math.hypot(s.point.x-at.x,s.point.y-at.y)<=8.4,'no catch-up jump after long pause');
for(let i=0;i<100&&s.phase!=='contact';i++){now+=50;s=a.tick(now,p,{enabled:true,clear:road});assert(s.point);assert(s.point.y===0||Math.abs(s.point.x-300)<.01);}
assert.equal(s.phase,'contact');assert(Math.hypot(s.point.x-p.x,s.point.y-p.y)<=34);assert(s.visible>=1.6);
a.depart();let previous=s.point;
for(let i=0;i<150&&s.phase!=='done';i++){now+=50;s=a.tick(now,p,{enabled:false,clear:road});if(s.point){assert(Math.hypot(s.point.x-previous.x,s.point.y-previous.y)<=7.51);previous=s.point;}}
assert.equal(s.phase,'done');assert.equal(s.point,null);
// A teleport and a blocked segment discard stale trails rather than jumping.
const b=create();for(let x=0;x<=240;x+=10)b.tick(x*5,{x,y:0},{enabled:true});
assert(b.snapshot().point);s=b.tick(2000,{x:900,y:0},{enabled:true});assert.equal(s.point,null);
for(let x=900;x<=1150;x+=10)b.tick(x*5,{x,y:0},{enabled:true,clear:()=>false});assert.equal(b.snapshot().point,null);
console.log('PASS thief approach: visible distance, road corners, pause/resume, contact, retreat, teleports and obstructions');
