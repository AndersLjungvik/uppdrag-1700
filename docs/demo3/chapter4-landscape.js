/* Kapitel 4, reuse the real paper material and world's existing animation frame.
 * Gardens sit off the connected road, so the route graph and collisions remain
 * identical to the chapter-three map. This is fictional stage dressing.
 */
(function(){
'use strict';
const fibres=()=>window.UPPDRAG_PAPER_FIBRES;
function shape(g,points,color){
  const fibre=fibres();g.save();g.beginPath();
  points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
  g.fillStyle=fibre?.material?.(g,color,'piece')||color;g.fill();
  const x=points.map(p=>p[0]),y=points.map(p=>p[1]);
  fibre?.finish?.(g,{x:Math.min(...x),y:Math.min(...y),
    w:Math.max(...x)-Math.min(...x),h:Math.max(...y)-Math.min(...y)},
    {kind:'piece',edge:.38});
  g.restore();
}
function flowers(g,x,y,i){
  g.save();
  g.lineWidth=1.8;g.strokeStyle='#57704e';g.beginPath();
  g.moveTo(x,y+11);g.lineTo(x+2,y-7);g.stroke();
  shape(g,[[x,y+2],[x-7,y-4],[x-4,y-10],[x+3,y-2]],'#778d62');
  shape(g,[[x+2,y+3],[x+9,y-6],[x+14,y-3],[x+6,y+5]],'#879a70');
  if(i%3===0){
    const col=['#eee4d0','#dec69e','#d9dbd0','#e9cab0'][i%4];
    for(const dx of [-5,2,8])shape(g,[[x+dx,y-11],[x+dx-3,y-17],
      [x+dx+1,y-21],[x+dx+5,y-14]],col);
  }
  g.restore();
}
function draw(g,{region,now=0}={}){
  if(region?.id!=='main')return;
  g.save();
  // Former western Russian camp: botany meadow. Entirely to the east of
  // the road to campWest, with no invisible fence or building.
  shape(g,[[335,1025],[476,1033],[481,1151],[324,1157]],'#a6a58a');
  shape(g,[[348,1038],[463,1038],[470,1138],[340,1147]],'#b9b89b');
  for(let i=0;i<20;i++){
    flowers(g,355+i%5*24+(i%3)*2,1054+Math.floor(i/5)*27,i);
  }
  // Linné keeps a box with collected, labelled specimens close to the meadow.
  shape(g,[[408,1152],[472,1153],[472,1174],[403,1173]],'#8a6d4c');
  shape(g,[[413,1155],[467,1157],[464,1167],[413,1168]],'#e5d6b7');
  for(let i=0;i<3;i++)shape(g,[[422+i*13,1161],[426+i*13,1158],
    [429+i*13,1162],[426+i*13,1165]],'#84936f');

  // Former northern Russian encampment: four broad furrows of potatoes,
  // north of Barnhuset, leaving campNorth's street accessible.
  shape(g,[[2285,147],[2580,149],[2590,239],[2279,249]],'#897153');
  for(let row=0;row<4;row++){
    const yy=160+row*20;
    shape(g,[[2297,yy],[2573,yy+2],[2580,yy+13],[2290,yy+12]],
      row%2?'#ab8864':'#a0805e');
    for(let col=0;col<9;col++){
      const xx=2315+col*29+(row%2?4:0),y=yy+5;
      shape(g,[[xx-2,y+4],[xx+1,y-6],[xx+6,y+1]],'#648258');
      shape(g,[[xx+1,y+4],[xx+8,y-3],[xx+12,y+3]],'#7c9569');
    }
  }
  // Workers till and carry a sack just outside the field. Motion is minute,
  // never a separate timer, as the land is peaceful again.
  const bend=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ?0:Math.sin(now/1800)*1.1;
  for(const [i,x] of [2355,2532].entries()){
    const y=268+(i?3:-2);
    shape(g,[[x-11,y-14],[x+10,y-15],[x+16,y+18+bend],[x-11,y+18+bend]],
      i?'#776d5a':'#99785a');
    shape(g,[[x-8,y-25],[x+8,y-25],[x+11,y-13],[x-9,y-13]],'#ddc5a4');
    shape(g,[[x-11,y-29],[x+9,y-31],[x+15,y-25],[x-15,y-24]],'#6b6050');
  }
  shape(g,[[2494,262],[2575,259],[2585,280],[2490,284]],'#a08860');
  for(let i=0;i<5;i++)shape(g,[[2505+i*13,266],[2511+i*13,260],
    [2518+i*13,267],[2511+i*13,274]],'#baa076');
  g.restore();
}
window.UPPDRAG_CH4_LANDSCAPE={draw};
})();