const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const sandbox={};vm.runInNewContext(fs.readFileSync(require('path').join(__dirname,'../event-approach.js'),'utf8'),sandbox);
const {create,routeBetween,escapeRoute,blockedByCover}=sandbox.UPPDRAG_EVENT_APPROACH;
const covers=[{id:'oak',x:200,y:-80,radius:27}],opts={enabled:true,covers};
function ambush(){const a=create();let now=0,p={x:0,y:0},s;for(let x=0;x<=320;x+=5){now+=40;p={x,y:0};s=a.tick(now,p,opts);if(x===100){assert.equal(s.phase,'watching');assert.equal(s.home.id,'oak');assert.equal(s.point.x,212);}}assert.equal(s.phase,'approaching');return {a,now,p};}
const empty=create();for(let x=0;x<500;x+=5)empty.tick(x*10,{x,y:0},{enabled:true});assert.equal(empty.snapshot().point,null,'no appearance in open air without cover');
let {a,now,p}=ambush();const before=a.snapshot().point;now+=60000;a.tick(now,p,{...opts,paused:true});assert.equal(a.snapshot().point.x,before.x);assert.equal(a.snapshot().point.y,before.y);
// A walk off the road remains a real approach. The player stops 150 units away.
for(let y=5;y<=150;y+=5){now+=40;p={x:320,y};a.tick(now,p,opts);}
for(let i=0;i<150&&a.snapshot().phase!=='contact';i++){now+=40;a.tick(now,p,opts);}
assert.equal(a.snapshot().phase,'contact');assert(a.snapshot().point.y>60);assert(a.snapshot().visible>=1.6);
// Social shelter and noticing cause a physical return to the same hiding tree.
for(const reason of ['conversation','house','noticed']){
 let {a,now,p}=ambush();const old=a.snapshot().point;
 if(reason==='noticed')assert.equal(a.deter(reason),true);else a.tick(now+=40,p,{...opts,safety:reason});
 assert.equal(a.snapshot().phase,'retreating');assert(a.snapshot().point,'does not disappear when deterred');assert.equal(a.snapshot().reason,reason);
 let previous=old,steps=0;
 while(a.snapshot().point&&steps++<150){now+=40;const s=a.tick(now,p,{...opts,safety:reason==='noticed'?'':reason});if(s.point){assert(Math.hypot(s.point.x-previous.x,s.point.y-previous.y)<=6.01);previous=s.point;}}
 assert.equal(a.snapshot().phase,'evaded');assert(Math.hypot(previous.x-212,previous.y+80)<7,'retreat ends inside the original cover');
}
// Cover only works when it breaks the line of sight, not as a radius of safety.
assert.equal(blockedByCover({x:0,y:0},{x:200,y:0},[{x:140,y:0,radius:27}]),true);
assert.equal(blockedByCover({x:0,y:0},{x:200,y:80},[{x:140,y:0,radius:27}]),false);
({a,now,p}=ambush());a.tick(now+=40,p,{...opts,canSee:()=>false});assert.equal(a.snapshot().phase,'searching');
for(let i=0;i<230&&a.snapshot().phase!=='evaded';i++)a.tick(now+=40,p,{...opts,canSee:()=>false});assert.equal(a.snapshot().phase,'evaded');assert.equal(a.snapshot().reason,'lost-sight');
({a,now,p}=ambush());a.tick(now+=40,p,{...opts,canSee:()=>false});a.tick(now+=40,p,opts);assert.equal(a.snapshot().phase,'approaching','visible again: the thief can resume');
// Road routing respects corners and connects open ground farther than 60 units.
const graph={edges:[{a:'a',b:'b'},{a:'b',b:'c'},{a:'c',b:'d'}]},nodes={a:{x:0,y:0},b:{x:400,y:0},c:{x:400,y:500},d:{x:900,y:500}};
const safe=(a,b)=>a.y===0&&b.y===0||a.x===400&&b.x===400||a.y===500&&b.y===500;
const turn=routeBetween(graph,{x:200,y:0},{x:800,y:500},id=>nodes[id],safe);assert(turn&&turn.length>=3);let last={x:200,y:0};for(const p of turn){assert(safe(last,p));last=p;}
const from={x:200,y:160},flight=escapeRoute(graph,from,{x:170,y:160},id=>nodes[id],()=>true,[{id:'far-tree',x:900,y:600}]);assert(flight&&flight.length);assert.equal(flight.at(-1).x,912);assert.equal(flight.at(-1).y,600);
assert(escapeRoute(graph,from,{x:170,y:160},id=>nodes[id],()=>true),'no off-road distance rejection');
// Physical pursuit, quiz capture and pause are retained.
const chase=create();let t=0,hero={x:30,y:0};chase.place({x:0,y:0});chase.flee([{x:-700,y:0}]);
for(let i=0;i<20;i++){t+=50;chase.tick(t,hero);}assert.equal(chase.snapshot().phase,'fleeing');const pausedAt=chase.snapshot().point.x;
t+=60000;chase.tick(t,hero,{paused:true});assert.equal(chase.snapshot().point.x,pausedAt);
for(let i=0;i<100&&chase.snapshot().phase!=='caught';i++){hero.x-=9;t+=50;chase.tick(t,hero);}assert.equal(chase.snapshot().phase,'caught');
const escape=create();escape.place({x:0,y:0});escape.flee([{x:-400,y:0}]);for(let i=0;i<120;i++)escape.tick(i*50,{x:30,y:0});assert.equal(escape.snapshot().phase,'escaped');
console.log('PASS ambush: existing cover, pass-by trigger, pause, off-road contact/escape, conversation/house/noticing retreat, sight-based hiding/search, corners and real chase');
