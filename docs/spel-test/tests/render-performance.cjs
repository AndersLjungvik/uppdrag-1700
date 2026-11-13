'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const {createCanvas}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'@napi-rs/canvas'):'@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const c={document:{createElement:()=>createCanvas(1,1)},matchMedia:()=>({matches:false}),CAST:{player:{color:'#8d7656'}},renderers:new WeakMap()};c.window=c;vm.createContext(c);
const meeting=read('_decoded/meeting-ch3-pilot.js'),puppet=meeting.slice(meeting.indexOf('  function puppets(ctx){'),meeting.indexOf('function limb('))+'return mapPuppet;}';
vm.runInContext(puppet+';window.makePuppet=puppets;',c);
const renderers=new WeakMap();let painted=0;
function original(ctx,pos,who,now){painted++;if(!renderers.has(ctx))renderers.set(ctx,c.makePuppet(ctx));renderers.get(ctx)(pos.x,pos.y,who,pos.heading,pos.moving,pos.animationTime??now);}
c.UPPDRAG_MEETINGS={drawMapPerson:original};vm.runInContext(read('scene-presence.js'),c);const P=c.UPPDRAG_SCENE_PRESENCE;P.install();
const cached=c.UPPDRAG_MEETINGS.drawMapPerson;
// The original painter produces all cached images. Compare actual pixels at
// two densities and rotations, including apron/skin/head/foot silhouettes.
for(const density of [1,2])for(const heading of [0,Math.PI/2,Math.PI,-.6])for(const who of [{color:'#8d7656'},{color:'#7d8971',woman:true,apron:true}]){
 const a=createCanvas(240*density,180*density),b=createCanvas(a.width,a.height),ga=a.getContext('2d'),gb=b.getContext('2d');ga.scale(density,density);gb.scale(density,density);
 const pos={x:120,y:90,heading,moving:false};original(ga,pos,who,0);cached(gb,pos,who,0);
 const ap=ga.getImageData(0,0,a.width,a.height).data,bp=gb.getImageData(0,0,b.width,b.height).data;let union=0,miss=0,diff=0;
 for(let i=0;i<ap.length;i+=4)if(ap[i+3]||bp[i+3]){union++;if((ap[i+3]>128)!==(bp[i+3]>128))miss++;for(let k=0;k<4;k++)diff+=Math.abs(ap[i+k]-bp[i+k]);}
 assert(union>100);assert(miss/union<.08,'cached drawing preserves the paper silhouette');assert(diff/(union*4)<16,'colour, apron, face and feet retain the original appearance');
}
const canvas=createCanvas(640,480),g=canvas.getContext('2d'),who={color:'#735b43',woman:false};let before=painted;
for(let i=0;i<600;i++)cached(g,{x:100+i*.2,y:100,heading:i*.01,moving:true,animationTime:i*20},who,i*20);
assert.equal(painted-before,16,'600 moving figures require only 16 original paper drawings');
c.UPPDRAG_PAPER_FIBRES={revision:1,loaded:false,kindFor:()=>"piece",material:(g,color)=>color};before=painted;cached(g,{x:100,y:100,heading:0,moving:false},who,0);assert.equal(painted,before+1,'paper revision invalidates cached images');
before=painted;cached(g,{x:100,y:100,heading:0,moving:false},who,100);assert.equal(painted,before,'unchanged figures reuse the cached drawing');
for(let i=0;i<270;i++)cached(g,{x:100,y:100,heading:0,moving:false},{color:'#'+i.toString(16).padStart(6,'0')},0);
before=painted;cached(g,{x:100,y:100,heading:0,moving:false},who,0);assert.equal(painted,before+1,'sprite memory is bounded and old appearances are evicted');
const state={x:10000,y:100,moving:true},unchanged=JSON.stringify(state);before=painted;P.begin(g);cached(g,state,who,0);P.flush();assert.equal(painted,before,'off-screen people are not painted');assert.equal(JSON.stringify(state),unchanged,'render culling never changes movement or game state');
let paints=0;P.begin(g);P.enqueue(g,100,()=>paints++,'farmers',{x:canvas.width+100,y:100});P.flush();assert.equal(paints,1,'crowd margin keeps long weapons and followers at the screen edge');
P.begin(g);P.enqueue(g,100,()=>paints++,'person',{x:canvas.width+100,y:100});P.flush();assert.equal(paints,1,'a fully invisible ordinary figure is culled');
g.setTransform(0,2,-2,0,300,0);assert(P.onScreen(g,{x:50,y:40}));assert(!P.onScreen(g,{x:1000,y:1000}));g.resetTransform();
// Explicit viewport cropping must leave the visible map pixel-identical.
const map=createCanvas(900,600),mg=map.getContext('2d');for(let x=0;x<900;x+=30)for(let y=0;y<600;y+=30){mg.fillStyle='rgb('+x%255+','+y%255+',110)';mg.fillRect(x,y,30,30);}
for(const scale of [.62,1,1.08])for(const camera of [{x:0,y:0},{x:470.3,y:240.8},{x:899,y:599}]){
 const a=createCanvas(320,220),b=createCanvas(320,220),ga=a.getContext('2d'),gb=b.getContext('2d'),layout={w:320,h:220,scale};
 for(const ctx of [ga,gb]){ctx.translate(layout.w/2-camera.x*scale,layout.h/2-camera.y*scale);ctx.scale(scale,scale);}
 ga.drawImage(map,0,0);P.drawMapLayer(gb,map,camera,layout);assert.deepEqual(gb.getImageData(0,0,320,220).data,ga.getImageData(0,0,320,220).data,'visible map pixels survive cropping');
}
const city=read('_decoded/world-street-pilot.js').replace('UPPDRAG_MEETINGS.drawMapPlayer(ctx,player,window.UPPDRAG_WORLD_KEYBOARD?.motionPath||path,performance.now());','UPPDRAG_MEETINGS.drawMapPlayer(ctx,player,window.UPPDRAG_WORLD_KEYBOARD?.motionPath||path,performance.now());window.UPPDRAG_EVENT_ENGINE?.drawCover(ctx,region);');
const transformed=P.source('world-street-pilot.js',city),prefix=transformed.slice(transformed.indexOf('function animate(now){'),transformed.indexOf('const dt=',transformed.indexOf('function animate(now){')));
let scheduled=0;c.requestAnimationFrame=()=>scheduled++;c.last=0;c.UPPDRAG_MENU_OPEN=()=>false;c.document.hidden=true;vm.runInContext(prefix+'throw Error("unexpected world update");};animate(1234);',c);assert.equal(c.last,1234);assert.equal(scheduled,1);
c.document.hidden=false;c.UPPDRAG_MENU_OPEN=()=>true;vm.runInContext('animate(1456);',c);assert.equal(c.last,1456);assert.equal(scheduled,2,'menu pause keeps one animation loop and resets elapsed time');
console.log('PASS render performance: original paper pixels/silhouettes, 600 draws reduced to 16 paints, material invalidation, bounded cache, off-screen culling with crowd margins, identical cropped map pixels and hidden/menu loop pause');
