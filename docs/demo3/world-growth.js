/* Chapter-aware rural life. Preserve the original buildings and entrances.
 * Draw only NEW separate paper pieces onto unused rural landscape.
 * Do not paint over existing roofs or the main roads. */
(function(){'use strict';
const chapter=Number((document.title.match(/Kapitel\s+(\d+)/i)||[])[1]||1);
const late=chapter>=5;
function cut(g,points,color){
 g.save();g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
 g.shadowColor='#46382937';g.shadowOffsetX=2;g.shadowOffsetY=3;g.shadowBlur=2;
 g.fillStyle=window.UPPDRAG_PAPER_FIBRES?.material?.(g,color,'piece')||color;
 g.fill();g.shadowColor='transparent';g.strokeStyle='#e5d8bd';g.lineWidth=1.2;g.stroke();g.restore();
}
function torp(g,x,y,k=.43,roof='#89634d',animals='hens'){
 g.save();g.translate(x,y);g.scale(k,k);
 // Small house: about one quarter of the main farm house's outer dimensions.
 // A small kitchen garden and a few animals belong to THIS household.
 cut(g,[[-80,42],[-62,27],[24,23],[77,37],[91,83],[-83,89]],'#9eaa80');
 for(let i=0;i<4;i++){
   const xx=15+i*14;
   cut(g,[[xx,54],[xx+8,52],[xx+10,76],[xx+1,77]],i%2?'#7b9467':'#a1b078');
 }
 // Low paper fence with separate wooden posts.
 for(const xx of [-81,-59,-37,72,89]){
   cut(g,[[xx,46],[xx+6,46],[xx+6,83],[xx,83]],'#a48a66');
 }
 cut(g,[[-80,52],[-38,52],[-39,58],[-80,59]],'#927a59');
 cut(g,[[72,52],[91,52],[90,58],[72,59]],'#927a59');
 // Cottage with pitched roof and door.
 cut(g,[[-55,-1],[50,-4],[51,39],[-55,40]],'#c7b397');
 cut(g,[[-66,0],[-18,-35],[40,-36],[63,-2],[31,11],[-53,10]],roof);
 cut(g,[[-12,18],[6,17],[7,40],[-12,41]],'#594c3b');
 cut(g,[[27,17],[39,17],[39,28],[26,28]],'#e5d4b5');
 cut(g,[[25,-34],[37,-35],[36,-49],[26,-48]],'#ac9679');
 if(animals==='cow'){
   cut(g,[[-73,64],[-40,60],[-35,76],[-71,81]],'#e1d7c2');
   cut(g,[[-42,62],[-29,59],[-23,69],[-38,73]],'#d7c8ae');
   for(const xx of [-66,-45])cut(g,[[xx,75],[xx+4,75],[xx+4,92],[xx,92]],'#82705b');
 }else{
   for(const [hx,hy] of [[-65,72],[-45,67]]){
     cut(g,[[hx-7,hy],[hx-2,hy-10],[hx+8,hy-5],[hx+10,hy+4],[hx-6,hy+5]],'#eee2ce');
     cut(g,[[hx+9,hy-5],[hx+17,hy-2],[hx+9,hy+1]],'#b97e59');
   }
 }
 g.restore();
}
function fields(g){
 // Field geometry follows the *manor* land, not the village.
 // They sit north/southwest of the manor, clear of its road and buildings.
 const patches=late?[
   [[2830,129],[3010,103],[3038,201],[2860,233]],
   [[3055,88],[3242,76],[3252,205],[3082,228]],
   [[2910,239],[3081,237],[3060,293],[2925,297]]
 ]:[
   [[2828,127],[2900,111],[2931,225],[2851,236]],
   [[2909,110],[2973,98],[3006,206],[2939,222]],
   [[2991,96],[3055,88],[3078,211],[3013,215]],
   [[3071,88],[3133,85],[3153,201],[3086,214]],
   [[3151,83],[3239,77],[3250,203],[3168,205]]
 ];
 patches.forEach((pts,i)=>cut(g,pts,['#b09e79','#a79970','#b9a984','#a79674'][i%4]));
 // Small grazing animals just outside the manor, not in the village.
 for(const [x,y] of [[2996,281],[3023,286],[3071,274]]){
   cut(g,[[x-11,y],[x+11,y-2],[x+15,y+6],[x-12,y+9]],'#eee0c6');
   cut(g,[[x+8,y-5],[x+14,y-7],[x+18,y-1],[x+10,y+3]],'#e4d6bd');
 }
}
function paintFields(g,r){if(r?.id!=='main')return;fields(g);}
function paintBuildings(g,r){
 if(r?.id!=='main')return;
 // The village's original large house stays untouched. Two small cottages
 // move outward once field holdings begin consolidating (stylised time steps).
 if(!late){
   torp(g,3084,1033,.43,'#8e6c55','hens'); // soldier
   torp(g,3430,1021,.43,'#86654d','cow'); // day labourer
 }else{
   torp(g,2924,266,.43,'#8e6c55','hens');
   torp(g,3126,270,.43,'#86654d','cow');
 }
}
window.UPPDRAG_WORLD_GROWTH={chapter,paintFields,paintBuildings};
})();