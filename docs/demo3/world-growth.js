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
function torp(g,x,y,roof='#855f4e',animals='hens'){
 // Exactly the same top-down roof language as paper-look.drawBuilding:
 // four roof edges, a ridge, material texture, shadow and no front facade.
 // Main village building: 220 x 155. Torp: 57 x 39 (~10% area,
 // ~26% width and height), deliberately subordinate on the town map.
 const w=57,h=39;
 cut(g,[[x-3,y+2],[x+w+2,y+2],[x+w+2,y+h+4],[x-2,y+h+4]],'#b4a183');
 cut(g,[[x,y+1],[x+w*.48,y-2],[x+w+1,y+2],[x+w,y+h],[x+w*.46,y+h+1],[x-1,y+h]],roof);
 cut(g,[[x+4,y+3],[x+w*.49,y],[x+w*.49,y+h-3],[x+3,y+h-2]],'#896a52');
 cut(g,[[x+w*.51,y],[x+w-3,y+3],[x+w-3,y+h-3],[x+w*.51,y+h-3]],'#795c49');
 g.save();g.strokeStyle='#d7bc94';g.lineWidth=1.5;g.beginPath();g.moveTo(x+w*.5,y+1);g.lineTo(x+w*.5,y+h-2);g.stroke();g.restore();
 // Outside details are very small and in the same top-down paper style.
 const gx=x+w+8,gy=y+h*.66;
 cut(g,[[gx,gy-2],[gx+31,gy-5],[gx+33,gy+21],[gx-1,gy+24]],'#9c9875');
 for(let i=0;i<3;i++)cut(g,[[gx+5+i*9,gy+1],[gx+9+i*9,gy],[gx+11+i*9,gy+17],[gx+6+i*9,gy+19]],'#78865c');
 if(animals==='cow'){
  cut(g,[[gx+3,gy+28],[gx+18,gy+26],[gx+21,gy+33],[gx+5,gy+36]],'#e1d7c1');
  cut(g,[[gx+17,gy+27],[gx+23,gy+29],[gx+23,gy+34],[gx+17,gy+34]],'#9a8a77');
 }else{
  for(const [dx,dy] of [[5,29],[17,37]]){
   cut(g,[[gx+dx,gy+dy],[gx+dx+5,gy+dy-2],[gx+dx+8,gy+dy+3],[gx+dx+2,gy+dy+6]],'#f0e5d0');
  }
 }
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
   torp(g,3070,1041,'#8e6c55','hens'); // soldier // soldier
   torp(g,3438,1016,'#86654d','cow'); // day labourer // day labourer
 }else{
   torp(g,2900,247,'#8e6c55','hens');
   torp(g,3120,243,'#86654d','cow');
 }
}
window.UPPDRAG_WORLD_GROWTH={chapter,paintFields,paintBuildings};
})();