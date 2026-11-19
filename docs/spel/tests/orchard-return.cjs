'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const context={window:{}};vm.runInNewContext(read('orchard-model.js'),context);const {create}=context.window.UPPDRAG_ORCHARD_MODEL;
const gap=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

// The road graph cannot connect a free-walking corner to home, even though
// the owner physically reached it. Returning must retain both legs of the L.
for(const ending of ['cancelled','practice','caught']){
 const home={x:0,y:0},turn={x:100,y:0},pocket={x:100,y:100};
 const clear=(a,b)=>Math.abs(a.y)<1e-7&&Math.abs(b.y)<1e-7||Math.abs(a.x-100)<1e-7&&Math.abs(b.x-100)<1e-7;
 let now=0,saved,awards=0;
 const m=create({}, {save:s=>saved=copy(s),awardApple:()=>{awards++;return true;}});
 const tick=(player={x:500,y:500},extra={})=>m.tick(now+=50,player,{home,region:'main',patrol:[turn,pocket],route:(a,b)=>clear(a,b)?[{...b}]:gap(b,pocket)<.01&&Math.abs(a.y)<1e-7?[turn,pocket]:null,clear,canSee:()=>true,...extra});
 for(let i=0;i<200&&gap(m.snapshot().actor||home,pocket)>3;i++)tick();
 assert(gap(m.snapshot().actor,pocket)<3);assert.equal(clear(m.snapshot().actor,home),false);
 assert(m.begin(ending==='caught'?m.snapshot().actor:{x:200,y:100},home,'known'));
 if(ending==='caught')for(let i=0;i<30&&m.snapshot().phase!=='idle';i++)tick(m.snapshot().actor,{patrol:[]});
 else {
  tick({x:200,y:100},{shelter:true,paused:true,patrol:[]});assert.equal(m.snapshot().phase,'question');
  if(ending==='practice')assert.equal(m.submit(false,'ett försök').reason,'practice');
  // Returning has already started when feedback closes. Do not restart it
  // towards the old pocket or replace its corners with a failed graph route.
  for(let i=0;i<8;i++)tick(undefined,{patrol:[]});m.close();
 }
 let previous=m.snapshot().actor;
 for(let i=0;i<700;i++){
  const s=tick(undefined,{patrol:[]});assert(clear(s.actor,s.actor),'return cannot enter a wall');assert(gap(previous,s.actor)<=7.251,'no teleport or faster return');previous=s.actor;
 }
 assert.equal(m.snapshot().retreat,false,ending+' releases the next attempt');assert(gap(m.snapshot().actor,home)<.01);assert.equal(awards,0);assert.equal(saved.claimed,false);
 assert(m.begin({x:200,y:100},home,'known-again'),'a later pick starts after the normal cooldown');
}
console.log('PASS orchard return: preserved patrol corners, caught/cancelled/wrong-answer retries, feedback closed during return, collision-safe bounded movement and no free apple');

// Reproduce the real pocket behind the manor with the actual collision map
// and road graph, rather than a direct-route mock.
const {fixture}=require('./apple-threats-world.cjs');
for(const chapter of [1,2,3,4,5]){
 const h=fixture('dog',chapter),c=h.c,r=c.testRegion,home={x:3398,y:380};
 const clear=(a,b)=>c.UPPDRAG_WORLD_KEYBOARD.clearSegment(r,a,b,12);
 const route=(a,b)=>c.UPPDRAG_EVENT_APPROACH.routeBetween(r,a,b,id=>c.testNavigation(r,id),clear);
 assert(clear({x:3400,y:125},{x:3400,y:125}));assert.equal(route({x:3400,y:125},home),null,'reported pocket cannot see a road node');
 let now=0,awards=0;const m=create({}, {awardApple:()=>{awards++;return true;}});
 let player={x:3575,y:310},leg=0;
 const tick=(extra={})=>m.tick(now+=50,player,{home,region:'main',clear,route,canSee:clear,...extra});
 assert(m.begin(player,home,'known'));
 let previous=m.snapshot().actor;
 for(let i=0;i<400;i++){
  const a=m.snapshot().actor;
  if(leg===0&&a.x>=3537){leg=1;player={x:3575,y:90};}
  if(leg===1&&a.y<=129){leg=2;player={x:3400,y:125};}
  const s=tick();assert(clear(previous,s.actor));assert(gap(previous,s.actor)<=8.201);previous=s.actor;
  if(leg===2&&s.actor.x<=3470)break;
 }
 assert.equal(leg,2);assert.equal(m.snapshot().phase,'chasing');assert.equal(route(m.snapshot().actor,home),null,'actual chase reaches the unconnected pocket');
 tick({shelter:true});assert.equal(m.snapshot().phase,'question');m.close();previous=m.snapshot().actor;
 for(let i=0;i<600;i++){
  const s=tick();assert(clear(previous,s.actor),'real manor walls are respected');assert(gap(previous,s.actor)<=7.251);previous=s.actor;
 }
 assert.equal(m.snapshot().retreat,false);assert(gap(m.snapshot().actor,home)<.01);assert(m.begin({x:3555,y:380},home,'known-again'));assert.equal(awards,0);
 console.log('PASS actual chapter '+chapter+': lure behind manor, unavailable road route, physical return around both corners and successful next attempt');
}
