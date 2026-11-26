'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
async function setup(patched){
 const image=await loadImage(path.join(root,'../world/assets/town.webp'));
 // Delay the existing load handler until the live canvas has cached fallback
 // colours. Use the real image pixels when that handler eventually runs.
 Object.defineProperty(image,'src',{set(){}});
 const c={document:{createElement:()=>createCanvas(1,1),baseURI:'https://example.test/spel/',title:'Kapitel 1'},Image:class{constructor(){return image;}},URL,setTimeout(){},console};c.window=c;vm.createContext(c);
 let art=read('base/paper-look.js');
 const integration=read('integration.js'),start=integration.indexOf(" if(name==='paper-look.js'){"),end=integration.indexOf(" if(name==='harbour-fibre-art.js'){",start);
 const patch=integration.slice(start,end);
 if(patched){c.text=art;c.name='paper-look.js';vm.runInContext(patch,c);art=c.text;}
 else art=art.replace('return {drawRegion,buildingSprite,ready,',"return {drawTree(g,r,t){tree(g,t.treeX,t.treeY,r.id==='colony');},drawRegion,buildingSprite,ready,");
 vm.runInContext(art,c);return {paper:c.UPPDRAG_PAPER,load:()=>image.onload()};
}
const pixel=(g,x,y)=>Array.from(g.getImageData(x,y,1,1).data);
(async()=>{
 for(const patched of [false,true]){
  const h=await setup(patched),live=createCanvas(600,500).getContext('2d'),map=createCanvas(600,500).getContext('2d'),tree={treeX:240,treeY:240};
  h.paper.drawTree(live,{id:'main'},tree);h.load();
  h.paper.drawTree(map,{id:'main'},tree);live.clearRect(0,0,600,500);live.drawImage(map.canvas,0,0);
  const before=pixel(live,240,220);h.paper.drawTree(live,{id:'main'},tree);
  const after=pixel(live,240,220);
  if(!patched){assert.notDeepEqual(after,before,'fixture reproduces the visible colour change before the fix');continue;}
  assert.deepEqual(after,before,'loaded tree keeps the map colour when it hides the thief');
  // Compare opaque foliage pixels; antialiased edges and shadows blend by
  // design. Exercise both tree shapes and the real camera transformations.
  for(const region of [{id:'main'},{id:'colony'}])for(const scale of [1,.75,1.3]){
   const background=createCanvas(600,500).getContext('2d');h.paper.drawTree(background,region,tree);
   live.setTransform(scale,0,0,scale,13,7);live.clearRect(-100,-100,1000,1000);live.drawImage(background.canvas,0,0);
   const samples=[[240,220],[235,225],[245,215]].map(([x,y])=>[Math.round(x*scale+13),Math.round(y*scale+7)]);
   const baseline=samples.map(([x,y])=>pixel(live,x,y));live.globalAlpha=.77;
   h.paper.drawTree(live,region,tree);
   live.globalAlpha=1;samples.forEach(([x,y],i)=>{
    const actual=pixel(live,x,y);if(baseline[i][3]!==255)return;assert(actual.every((n,j)=>Math.abs(n-baseline[i][j])<=5),JSON.stringify({region,scale,point:[x,y],actual,expected:baseline[i]}));
   });
  }
 }
 console.log('PASS tree cover: reproduced stale fallback colour, original loaded material reused on the live canvas, opaque foliage, tree variants and camera zoom');
})().catch(e=>{console.error(e);process.exitCode=1;});
