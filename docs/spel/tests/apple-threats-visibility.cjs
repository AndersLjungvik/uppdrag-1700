'use strict';
const assert=require('node:assert/strict'),{fixture}=require('./apple-threats-world.cjs');
const journeys=[
 [3,['riksdag','castle']],[3,['square','castle']],[3,['operaTop','riksdag']],[3,['quay','square']],
 [4,['riksdag','castle']],[4,['square','castle']],[4,['operaTop','riksdag']],[4,['quay','square']],
 [4,['church','print']],[4,['science','church']],[4,['print','science']],[4,['village','church']]
];
for(const [chapter,destinations] of journeys){
 // Use default pacing and the real signal from the first completed Rut round.
 // Earlier tests forced timers to zero and searched every road in the city.
 const h=fixture(chapter===3?'dog':null,chapter,{raw:{}}),r=h.c.testRegion,nav=id=>h.c.testNavigation(r,id);
 const clear=(a,b)=>h.c.UPPDRAG_WORLD_KEYBOARD.clearSegment(r,a,b,12);
 h.state.archiveRounds=1;h.state.recallRutRewarded=true;h.state.apples=1;
 let player={...nav('archive')},travelled=0,frames=0,found=null;
 h.tick(player,'archive');h.tick(player,null);
 assert.equal(h.c.UPPDRAG_APPLE_THREATS.suppressesPickpocket,true,'a first apple encounter has priority over another pickpocket peek');
 for(const id of destinations){
  const route=h.c.UPPDRAG_STORY_WORLD.route(r,player,nav(id));assert(route,'ordinary route to '+id);
  for(let j=0;j<route.length;j++){
   const goal=route[j];
   while(Math.hypot(goal.x-player.x,goal.y-player.y)>.1){
    h.c.path=route.slice(j);
    const d=Math.hypot(goal.x-player.x,goal.y-player.y),step=Math.min(d,14.4);
    player={x:player.x+(goal.x-player.x)*step/d,y:player.y+(goal.y-player.y)*step/d};travelled+=step;frames++;
    const snap=h.tick(player,null);
    if(snap.active){found=snap.active;break;}
   }
   if(found)break;
  }
  if(found)break;
 }
 assert(found,'first encounter occurs on '+destinations.join(' → ')+' in chapter '+chapter);
 assert.equal(found.kind,chapter===3?'dog':'guard');assert(travelled<1500,'appears during normal short trips, without 45 seconds of extra waiting');
 assert(h.c.UPPDRAG_WORLD_KEYBOARD.clearSegment(r,found.home,found.home,12),'origin is real walkable ground');assert(/^(tree-|door-)/.test(found.home.id));
 if(chapter===3)assert(Math.hypot(found.point.x-player.x,found.point.y-player.y)<=330,'dog is in the nearby part of the street');
 else{
  assert(Math.hypot(found.post.x-player.x,found.post.y-player.y)<=600,'guard stays in the visible part of the street');
  const remaining=h.c.path;let along=Infinity,walked=0,last=player;
  for(const end of remaining){const dx=end.x-last.x,dy=end.y-last.y,len=Math.hypot(dx,dy);if(len){const t=Math.max(0,Math.min(1,((found.post.x-last.x)*dx+(found.post.y-last.y)*dy)/(len*len)));if(Math.hypot(found.post.x-last.x-dx*t,found.post.y-last.y-dy*t)<=35)along=Math.min(along,walked+t*len);walked+=len;}last=end;}
  const remainingLength=remaining.reduce((sum,q,i)=>sum+Math.hypot(q.x-(i?remaining[i-1].x:player.x),q.y-(i?remaining[i-1].y:player.y)),0);
  assert(along>=179&&along<=561&&along<=remainingLength-39,'guard stands on the selected route before its destination');
 }
 assert.equal(h.state.apples,1,'appearing does not debit the apple');
 console.log('PASS first '+found.kind+' on chapter '+chapter+' '+destinations.join(' → ')+': '+Math.round(travelled)+' map units, '+(frames*.08).toFixed(2)+' walking seconds, '+found.home.id);
}
{
 const h=fixture('dog',3,{raw:{quietMs:45000,nextDistance:700,encounters:1,history:[{kind:'dog',outcome:'warning'},{kind:'dog',outcome:'shelter'}]}}),s=h.c.UPPDRAG_APPLE_THREATS.snapshot.state;
 assert.equal(s.quietMs,0);assert(s.nextDistance<=s.distance+240,'old waiting saves become playable without resetting progress');
}
