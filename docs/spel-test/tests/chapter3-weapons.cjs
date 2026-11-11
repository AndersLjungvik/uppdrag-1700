'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const {createCanvas}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'@napi-rs/canvas'):'@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
function fixture(){
 const c={console,phase:()=>2,enteredAt:0,reduced:{matches:false},document:{hidden:false,createElement:()=>createCanvas(80,80)},CAST:{player:{color:'#8d7656'}}};c.window=c;vm.createContext(c);
 vm.runInContext(read('chapter3-presentation.js'),c);
 const city=c.UPPDRAG_CH3_PRESENTATION.source('chapter3-street-life.js',read('_decoded/chapter3-street-life.js'));
 const meeting=read('_decoded/meeting-ch3-pilot.js');
 // Use the game's real walking puppet, not a replacement drawing.
 const puppet=meeting.slice(meeting.indexOf('  function puppets(ctx){'),meeting.indexOf('function limb('))+'return mapPuppet;}';
 c.renderers=new WeakMap();vm.runInContext(puppet+';window.mapRenderer=puppets;',c);
 const canvas=createCanvas(1100,700),ctx=canvas.getContext('2d'),map=c.mapRenderer(ctx),bodies=[],shapes=[];
 c.UPPDRAG_MEETINGS={drawMapPerson(g,pos,who,now){bodies.push({...pos});map(pos.x,pos.y,who,pos.heading,pos.moving,now);}};
 vm.runInContext(city.slice(city.indexOf('function paper(ctx,'),city.indexOf('function paperTag('))+';window.renderGroup=drawGroup;',c);
 c.originalPaper=c.paper;
 c.paper=(g,points,color)=>{const m=g.getTransform();shapes.push({color,points:points.map(([x,y])=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f])});c.originalPaper(g,points,color);};
 return {c,canvas,ctx,shapes,bodies,render(actor,time){shapes.length=0;bodies.length=0;c.renderGroup(ctx,actor,time);return shapes;}};
}
module.exports={fixture};
if(require.main===module){
 const h=fixture();let stable;
 // Cross many pixel boundaries, shouting phases and walking/resting frames.
 for(const reduced of [false,true])for(const moving of [false,true])for(let frame=0;frame<300;frame++){
  const actor={id:'farmers',role:'farmer',color:'#8d7656',heading:Math.PI,x:700-frame*.37,y:300+Math.sin(frame*.17),moving,crowdShouting:frame%3===0};
  h.c.reduced.matches=reduced;h.render(actor,frame*137);
  const local=h.shapes.map(s=>({color:s.color,points:s.points.map(([x,y])=>[+(x-actor.x).toFixed(5),+(y-actor.y).toFixed(5)])}));
  if(!stable)stable=local;else{
   assert.deepEqual(local.map(s=>s.color),stable.map(s=>s.color),'the same weapon pieces remain visible');
   local.forEach((shape,i)=>{assert.equal(shape.points.length,stable[i].points.length,'weapon shape never changes');shape.points.forEach((p,j)=>assert(Math.hypot(p[0]-stable[i].points[j][0],p[1]-stable[i].points[j][1])<.001,'polearms stay fixed to the hand within canvas precision'));});
  }
  assert.equal(h.shapes.filter(s=>s.color==='#a4ada3').length,2,'two fixed scythes');
  assert.equal(h.shapes.filter(s=>s.color==='#a5afa6').length,3,'three fixed pikes');
  assert.equal(h.shapes.filter(s=>s.color==='#786247').length,5,'one shaft per marcher');
  assert.equal(h.bodies.length,5);assert(h.bodies.every(b=>b.heading===actor.heading));
  assert(h.bodies.some(b=>b.moving===moving),'the existing foot animation is preserved');
 }
 h.c.phase=()=>3;h.render({id:'farmers',role:'farmer',color:'#8d7656',heading:Math.PI,x:300,y:200,moving:false},0);
 assert.equal(h.shapes.filter(s=>s.color==='#786247').length,0,'weapons stay absent after the uprising');
 h.c.phase=()=>2;h.render({id:'soldiers',role:'soldier',color:'#687b82',heading:0,x:300,y:200,moving:true},0);
 assert.equal(h.shapes.filter(s=>s.color==='#786247').length,0,'farmers weapons never leak into other actors');
 console.log('PASS chapter-three polearms: 1,200 real rendered frames across movement/pixel/shout/reduced-motion changes, stable shapes and hand positions, five fixed weapons, preserved walking and chapter phases');
}
