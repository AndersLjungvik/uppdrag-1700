/* Rural village: an inhabited outdoor stage inspired by harbour perspective.
 * Shares room travel, NPC overlay and paper fibres; no second animation loop.
 */
(function(){'use strict';
const base=window.UPPDRAG_ROOM_ART;if(!base)return;
const chapter=Number((document.title.match(/Kapitel\s+(\d+)/i)||[])[1]||1);
const later=chapter>=5;
const fibres=()=>window.UPPDRAG_PAPER_FIBRES;
function piece(g,pts,c,edge=true){
 g.save();g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
 g.shadowColor='#3b2d2252';g.shadowOffsetY=3;g.shadowOffsetX=2;g.shadowBlur=2;
 g.fillStyle=fibres()?.material?.(g,c,'piece')||c;g.fill();g.shadowColor='transparent';
 if(edge){g.lineWidth=1.4;g.strokeStyle='#ece0c3';g.stroke();}
 g.restore();
}
function ell(g,x,y,rx,ry,c){g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fillStyle=fibres()?.material?.(g,c,'piece')||c;g.fill();}
function house(g,x,feet,s,c){
 g.save();g.translate(x,feet);g.scale(s,s);
 // Foot is on the same visual plane as the player; full facades, not map icons.
 ell(g,0,3,103,15,'#766d5744');
 piece(g,[[-96,-174],[80,-177],[91,-6],[-100,-5]],'#d8c5a5');
 piece(g,[[82,-174],[121,-205],[120,-44],[91,-5]],'#b9a586');
 piece(g,[[-120,-172],[-18,-273],[91,-229],[103,-182],[8,-195],[-96,-162]],c);
 piece(g,[[91,-229],[138,-196],[121,-172],[103,-182]],'#755a4b');
 piece(g,[[-20,-232],[-5,-233],[-5,-285],[-20,-285]],'#c9b293');
 piece(g,[[-39,-102],[-3,-103],[0,-7],[-39,-6]],'#68543f');
 for(const xx of [-77,33]){
 piece(g,[[xx,-132],[xx+27,-133],[xx+27,-93],[xx,-91]],'#82745c');
 piece(g,[[xx+5,-126],[xx+22,-126],[xx+22,-99],[xx+5,-99]],'#c8d0c0');}
 g.restore();
}
function shed(g,x,feet,s){g.save();g.translate(x,feet);g.scale(s,s);
 piece(g,[[-57,-77],[63,-81],[61,0],[-61,0]],'#af9577');
 piece(g,[[-69,-77],[-11,-130],[76,-92],[63,-80]],'#806752');
 piece(g,[[-27,-58],[12,-58],[12,0],[-28,0]],'#6c5a46');g.restore();}
function tree(g,x,foot,s){g.save();g.translate(x,foot);g.scale(s,s);
 piece(g,[[-7,-11],[5,-12],[9,-117],[-4,-121]],'#8c7153');
 piece(g,[[-64,-104],[-48,-154],[-8,-179],[34,-171],[70,-129],[54,-83],[6,-72],[-44,-84]],'#7f8a68');
 piece(g,[[-47,-124],[-7,-181],[39,-159],[56,-121],[18,-102]],'#97a17b',false);g.restore();}
function field(g,x,y,w,h,k){
 piece(g,[[x,y+3],[x+w-5,y-4],[x+w+11,y+h-4],[x-8,y+h+3]],
   ['#b39e79','#a89974','#c1ae85','#9d9772'][k%4]);
 g.save();g.strokeStyle='#7f755b';g.lineWidth=1.8;
 for(let i=1;i<5;i++){let u=i/5;g.beginPath();g.moveTo(x+w*u,y+4);g.lineTo(x+w*u+9,y+h);g.stroke();}
 g.restore();
}
function person(g,x,y,s,color){
 g.save();g.translate(x,y);g.scale(s,s);
 ell(g,0,4,21,5,'#66564244');
 piece(g,[[-17,-51],[14,-49],[21,-11],[-20,-9]],color);
 ell(g,0,-68,16,20,'#c7a985');
 piece(g,[[-19,-87],[0,-105],[24,-88],[15,-82],[-18,-83]],'#6b5945');
 piece(g,[[-14,-12],[-1,-13],[0,0],[-14,0]],'#584b3f');
 piece(g,[[4,-13],[17,-14],[18,0],[4,0]],'#584b3f');
 g.restore();}
function render(canvas){
 const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return null;
 const d=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);
 const g=canvas.getContext('2d'),s=Math.min(r.width/1280,r.height/720),ox=(r.width-1280*s)/2,oy=(r.height-720*s)/2;
 g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,r.width,r.height);
 // One continuous outdoor field of vision, not a mural in a brown room.
 g.save();g.fillStyle=fibres()?.material?.(g,'#a4b2ae','sky')||'#a4b2ae';g.fillRect(0,0,r.width,r.height*.58);
 g.fillStyle=fibres()?.material?.(g,'#bcb796','ground')||'#bcb796';g.fillRect(0,r.height*.45,r.width,r.height*.55);
 g.translate(ox,oy);g.scale(s,s);
 piece(g,[[0,0],[1280,0],[1280,290],[1090,257],[907,276],[751,239],[559,278],[386,245],[200,282],[0,256]],'#9faeab',false);
 piece(g,[[0,275],[190,250],[360,263],[582,219],[783,247],[1030,232],[1280,267],[1280,480],[0,475]],'#8d987c');
 piece(g,[[0,332],[224,293],[445,306],[603,284],[825,318],[1040,282],[1280,336],[1280,720],[0,720]],'#bdb18f',false);
 // Fields behind the street and the buildings: their pattern changes with time.
 if(!later){
   for(let i=0;i<9;i++)field(g,18+i*142,329+(i%2)*8,135,96,i);
 }else{
   for(const [i,x,w] of [[0,19,375],[1,424,394],[2,857,380]])field(g,x,316+(i%2)*8,w,116,i);
 }
 tree(g,102,340,.58);tree(g,1172,326,.52);
 // Physical lane recedes into the village. Shared or fractured geometry.
 piece(g,[[562,389],[698,390],[1098,720],[182,720]],'#d7c4a0',false);
 piece(g,[[584,401],[662,404],[764,720],[517,720]],'#e4d2af',false);
 if(!later){
   house(g,310,467,.77,'#866452');
   house(g,608,439,.66,'#83624e');
   house(g,929,463,.73,'#916d51');
   shed(g,1123,479,.58);
   tree(g,760,464,.64);
 }else{
   house(g,190,480,.76,'#866452');
   house(g,685,445,.71,'#83624e');
   house(g,1132,480,.69,'#916d51');
   // Empty plot where the closely-knit farmstead formerly stood.
   piece(g,[[394,472],[484,458],[552,493],[525,513],[419,512]],'#a9a47c');
   tree(g,795,454,.67);
 }
 // Village common: well, hay, fences, locals at eye level.
 piece(g,[[410,551],[450,528],[492,552],[489,603],[409,601]],'#796e53');
 ell(g,451,551,41,13,'#c1b18e');ell(g,451,546,25,8,'#60574c');
 piece(g,[[435,528],[439,487],[449,489],[448,528]],'#836d53');
 piece(g,[[478,530],[480,490],[489,490],[487,530]],'#836d53');
 piece(g,[[427,490],[493,488],[490,499],[431,500]],'#715941');
 for(let i=0;i<7;i++){
  const x=930+i*29;piece(g,[[x,610],[x+9,605],[x+11,666],[x+1,667]],'#7d6850');
 }
 piece(g,[[912,622],[1170,617],[1166,628],[915,632]],'#a18663');
 if(!later){person(g,746,564,.73,'#876a51');person(g,794,571,.64,'#61746b');person(g,830,572,.58,'#916e57');}
 else{person(g,807,573,.66,'#796c61');}
 // Foreground objects cross lower frame: the environment has near/mid/far depth.
 tree(g,-20,760,1.28);tree(g,1268,755,1.38);
 piece(g,[[0,679],[177,666],[243,720],[0,720]],'#a2a381',false);
 piece(g,[[1090,681],[1280,660],[1280,720],[1038,720]],'#aaa783',false);
 g.restore();
 // A visible return button already exists; align its conventional door hit in lower-left.
 return {x:ox+20*s,y:oy+615*s,w:135*s,h:100*s};
}
window.UPPDRAG_ROOM_ART={...base,
 names:{...base.names,farm:'Byn'},
 descriptions:{...base.descriptions,farm:later?'Gårdarna ligger längre ifrån varandra och åkerstyckena har börjat samlas.':'Flera gårdar är samlade längs byvägen mellan smala, oskiftade tegar.'},
 render(canvas,id){return id==='farm'?render(canvas):base.render(canvas,id);}
};
})();