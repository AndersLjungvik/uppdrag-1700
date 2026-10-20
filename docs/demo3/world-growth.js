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
function torp(g,x,y,k=.72,roof='#89634d'){
 g.save();g.translate(x,y);g.scale(k,k);
 // Two individually cut paper buildings with actual pitched roofs.
 cut(g,[[-55,-1],[50,-4],[51,39],[-55,40]],'#c7b397');
 cut(g,[[-66,0],[-18,-35],[40,-36],[63,-2],[31,11],[-53,10]],roof);
 cut(g,[[-12,18],[6,17],[7,40],[-12,41]],'#594c3b');
 cut(g,[[27,17],[39,17],[39,28],[26,28]],'#e5d4b5');
 cut(g,[[25,-34],[37,-35],[36,-49],[26,-48]],'#ac9679');
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
   torp(g,3084,1033,.64,'#8e6c55'); // soldier
   torp(g,3430,1021,.66,'#86654d'); // day labourer
 }else{
   torp(g,2924,266,.65,'#8e6c55');
   torp(g,3126,270,.67,'#86654d');
 }
}
window.UPPDRAG_WORLD_GROWTH={chapter,paintFields,paintBuildings};
})();