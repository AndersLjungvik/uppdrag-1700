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
 const g=canvas.getContext('2d');
 // Harbour-like stage composition: fixed scene horizon, ground line, buildings
 // as full-height side views, people standing on the same playable street.
 // The whole scene fills the viewport; no vignette or pasted image rectangle.
 const s=Math.max(r.width/1280,r.height/720),ox=(r.width-1280*s)/2,oy=(r.height-720*s)/2;
 g.setTransform(d,0,0,d,0,0);g.save();
 g.fillStyle=fibres()?.material?.(g,'#a7b9be','sky')||'#a7b9be';g.fillRect(0,0,r.width,r.height);
 g.translate(ox,oy);g.scale(s,s);
 piece(g,[[0,0],[1280,0],[1280,357],[1085,353],[923,362],[746,348],[536,356],[318,350],[129,362],[0,352]],'#a7b9bb',false);
 // One distant continuous landscape, NOT separate cut-out fields floating in space.
 piece(g,[[0,353],[184,340],[372,350],[527,335],[714,349],[887,337],[1054,345],[1280,337],[1280,510],[0,510]],'#8b987a',false);
 // Slender historic arable strips belong BEHIND the houses. Later plots consolidate.
 if(!later){
  for(let i=0;i<10;i++)field(g,i*128,364+(i%2)*5,130,112,i);
 }else{
  field(g,0,362,427,118,0);field(g,421,359,439,120,1);field(g,857,358,430,122,2);
 }
 // A single unbroken walkable ground plane like the quay: hard boundary at y=520.
 piece(g,[[0,497],[1280,497],[1280,720],[0,720]],'#c7b99e',false);
 piece(g,[[0,515],[1280,515],[1280,534],[0,534]],'#a18a6b',false);
 piece(g,[[0,538],[1280,538],[1280,548],[0,548]],'#dfcdaa',false);
 // Buildings rise from the common horizontal plane, not in a collage perspective.
 if(!later){
  house(g,218,522,.91,'#87644e');
  house(g,561,522,.92,'#82614b');
  house(g,913,522,.88,'#916e51');
  shed(g,1136,522,.72);
 }else{
  house(g,181,522,.91,'#87644e');
  house(g,670,522,.92,'#82614b');
  house(g,1120,522,.88,'#916e51');
  shed(g,400,522,.61);
 }
 // The village well and neighbours occupy the SAME plane as the houses.
 piece(g,[[437,528],[468,507],[503,528],[507,576],[433,576]],'#857459');
 ell(g,470,527,36,10,'#d8c3a0');ell(g,470,524,24,6,'#615447');
 piece(g,[[446,509],[448,477],[457,477],[456,509]],'#886f52');
 piece(g,[[489,509],[490,477],[499,477],[497,509]],'#886f52');
 piece(g,[[443,479],[500,478],[499,489],[442,489]],'#765b43');
 if(!later){
  person(g,733,525,.79,'#86644e');
  person(g,784,525,.75,'#657568');
  person(g,834,525,.71,'#947257');
 }else{person(g,816,525,.75,'#79695a');}
 // Fence across the front edge: near-ground rather than a decorative patch.
 for(let i=0;i<9;i++){
  let x=1010+i*30;piece(g,[[x,588],[x+10,586],[x+11,651],[x+1,651]],'#8a7151');
 }
 piece(g,[[997,607],[1280,607],[1280,616],[998,618]],'#b59a70');
 tree(g,-38,565,.84);tree(g,1312,550,.82);
 // Exit lies on left foreground; its existing real button also works.
 piece(g,[[20,618],[94,616],[110,627],[22,629]],'#ecdfc5');
 g.restore();
 return {x:ox+15*s,y:oy+570*s,w:108*s,h:117*s};
}
window.UPPDRAG_ROOM_ART={...base,
 names:{...base.names,farm:'Byn'},
 descriptions:{...base.descriptions,farm:later?'Gårdarna ligger längre ifrån varandra och åkerstyckena har börjat samlas.':'Flera gårdar är samlade längs byvägen mellan smala, oskiftade tegar.'},
 render(canvas,id){return id==='farm'?render(canvas):base.render(canvas,id);}
};
})();