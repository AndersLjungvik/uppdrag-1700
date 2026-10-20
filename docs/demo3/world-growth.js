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
const COTTAGE_SCALE=.45;
function villageHouseSprite(g,building){
 // paintBuildings runs after paper-look has drawn the ordinary buildings.
 // Reuse that actual house artwork instead of approximating it with polygons.
 // Copy only the roof/building: labels and surrounding roads are not included.
 const sprite=document.createElement('canvas');
 sprite.width=building.w;sprite.height=building.h;
 sprite.getContext('2d').drawImage(g.canvas,building.x,building.y,
   building.w,building.h,0,0,building.w,building.h);
 return sprite;
}
function torp(g,x,y,sprite,animals='hens'){
 // Exactly 45% of the village house's width AND height, not 45% of its area.
 const w=sprite.width*COTTAGE_SCALE,h=sprite.height*COTTAGE_SCALE;
 // The base and doorstep follow the same scaled footprint as the source house.
 g.save();
 g.shadowColor='#382e2145';g.shadowBlur=4*COTTAGE_SCALE;
 g.shadowOffsetX=2*COTTAGE_SCALE;g.shadowOffsetY=5*COTTAGE_SCALE;
 g.fillStyle='#b4a183';g.fillRect(x+4*COTTAGE_SCALE,y+7*COTTAGE_SCALE,
   w,h+5*COTTAGE_SCALE);
 g.shadowColor='transparent';
 g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
 g.drawImage(sprite,x,y,w,h);
 g.strokeStyle='#f0e3c8';g.lineWidth=2*COTTAGE_SCALE;
 g.strokeRect(x,y,w,h);
 g.fillStyle='#50524d';
 g.fillRect(x+w/2-12*COTTAGE_SCALE,y+h-2*COTTAGE_SCALE,
   24*COTTAGE_SCALE,9*COTTAGE_SCALE);
 g.restore();
 // Keep the garden and livestock small: only the HOUSE has been enlarged.
 const gx=x+w+8,gy=y+h*.66;
 cut(g,[[gx,gy-2],[gx+31,gy-5],[gx+33,gy+21],[gx-1,gy+24]],'#9c9875');
 for(let i=0;i<3;i++)cut(g,[[gx+5+i*9,gy+1],[gx+9+i*9,gy],
   [gx+11+i*9,gy+17],[gx+6+i*9,gy+19]],'#78865c');
 if(animals==='cow'){
  cut(g,[[gx+3,gy+28],[gx+18,gy+26],[gx+21,gy+33],[gx+5,gy+36]],'#e1d7c1');
  cut(g,[[gx+17,gy+27],[gx+23,gy+29],[gx+23,gy+34],[gx+17,gy+34]],'#9a8a77');
 }else{
  for(const [dx,dy] of [[5,29],[17,37]]){
   cut(g,[[gx+dx,gy+dy],[gx+dx+5,gy+dy-2],
     [gx+dx+8,gy+dy+3],[gx+dx+2,gy+dy+6]],'#f0e5d0');
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
 const village=r.buildings.find(b=>b.name==='Byn');
 if(!village)return;
 const sprite=villageHouseSprite(g,village);
 // Keep the existing chapter placement; leave room for the larger roofs,
 // gardens and the road to the manor in the later landscape.
 if(!late){
   torp(g,3000,1041,sprite,'hens');
   torp(g,3438,1016,sprite,'cow');
 }else{
   torp(g,2840,240,sprite,'hens');
   torp(g,3120,215,sprite,'cow');
 }
}
window.UPPDRAG_WORLD_GROWTH={chapter,paintFields,paintBuildings};
})();
