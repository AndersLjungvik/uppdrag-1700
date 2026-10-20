/* Uppdrag 1700 — cut-paper landscape, not UI rectangles.
 * All pieces are irregular, softly layered paper cutouts. No changes to
 * navigation graph, hit zones, chapter progress, dialogue or assessments.
 */
(function(){
'use strict';
const chapter=Number((document.title.match(/Kapitel\s+(\d+)/i)||[])[1]||1);
function paper(g,pts,color){
 g.save();g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
 g.shadowColor='#4d3b2933';g.shadowBlur=3;g.shadowOffsetX=2;g.shadowOffsetY=3;
 const f=window.UPPDRAG_PAPER_FIBRES;g.fillStyle=f?.material?.(g,color,'piece')||color;g.fill();
 g.shadowColor='transparent';g.lineWidth=1.2;g.strokeStyle='#ecdec0';g.stroke();g.restore();
}
function fleck(g,x,y,w,h,color){paper(g,[[x+2,y+1],[x+w*.43,y-2],[x+w+2,y+3],[x+w-1,y+h-2],[x+w*.67,y+h+2],[x-2,y+h]],color);}
function cottage(g,x,y,w,h,color){
 // Separate paper roof, gable, chimney and door, never one rectangle.
 paper(g,[[x+4,y+6],[x+w*.43,y-9],[x+w-3,y+3],[x+w+5,y+h*.36],[x+w*.6,y+h*.46],[x-3,y+h*.39]],color);
 paper(g,[[x+2,y+h*.39],[x+w*.59,y+h*.45],[x+w*.57,y+h+1],[x+3,y+h-3]],'#ccb99c');
 paper(g,[[x+w*.32,y+h*.68],[x+w*.48,y+h*.67],[x+w*.47,y+h+1],[x+w*.31,y+h]],'#655441');
 paper(g,[[x+w*.76,y-4],[x+w*.86,y-7],[x+w*.89,y+11],[x+w*.78,y+12]],'#b6a085');
}
function palace(g,b){
 const {x,y,w,h}=b,completed=chapter>=3;
 // The palace reuses the original footprint; unfinished ranges are scaffolded.
 paper(g,[[x+5,y+12],[x+w*.3,y+7],[x+w-7,y+5],[x+w+3,y+h*.48],[x+w-5,y+h-2],[x+3,y+h-5]],'#b9ab91');
 paper(g,[[x+7,y+10],[x+w-8,y+8],[x+w-12,y+43],[x+11,y+47]],'#666259');
 paper(g,[[x+7,y+16],[x+44,y+21],[x+48,y+h-16],[x+11,y+h-12]],'#68645b');
 if(completed){
   paper(g,[[x+w-45,y+16],[x+w-9,y+14],[x+w-7,y+h-13],[x+w-43,y+h-15]],'#6b6860');
   paper(g,[[x+12,y+h-44],[x+w-12,y+h-47],[x+w-10,y+h-12],[x+11,y+h-11]],'#74716a');
 }else{
   for(let i=0;i<5;i++){
     const sx=x+w*.55+i*23;
     g.beginPath();g.moveTo(sx,y+h*.48);g.lineTo(sx,y+h-10);
     g.moveTo(sx-8,y+h*.58);g.lineTo(sx+8,y+h*.58);
     g.strokeStyle='#89704d';g.lineWidth=2;g.stroke();
   }
   for(let i=0;i<4;i++)fleck(g,x+61+i*30,y+h-36,21,10,'#b4a38b');
 }
 // Open courtyard and paper windows remain on the existing slott shape.
 paper(g,[[x+61,y+55],[x+w-66,y+53],[x+w-70,y+h-57],[x+64,y+h-55]],'#d2c2a4');
 for(let i=0;i<6;i++)fleck(g,x+64+i*29,y+23,9,5,'#e8d8b9');
}
function village(g,b){
 const{x,y,w,h}=b;
 // Ragged grass cutout, not a square map module; houses are independent.
 paper(g,[[x-5,y+20],[x+24,y+2],[x+77,y-5],[x+123,y+8],[x+w-7,y-3],[x+w+9,y+39],[x+w-2,y+91],[x+w+6,y+h-18],[x+w-29,y+h+8],[x+89,y+h-7],[x+8,y+h+5],[x-12,y+84]],'#a5a68c');
 cottage(g,x+17,y+36,71,48,'#916b52');
 cottage(g,x+117,y+26,69,51,'#80634e');
 cottage(g,x+31,y+108,56,35,'#a07754');
 cottage(g,x+128,y+95,47,38,'#8f7157');
}
function manor(g,b){
 const{x,y,w,h}=b;
 paper(g,[[x-8,y+26],[x+40,y+5],[x+w*.56,y-9],[x+w+12,y+27],[x+w+8,y+h-21],[x+w-40,y+h+12],[x+35,y+h+8],[x-14,y+h-19]],'#adae8c');
 cottage(g,x+47,y+27,w-93,83,'#777169');
 cottage(g,x+13,y+116,49,34,'#8a6951');
 cottage(g,x+w-67,y+113,50,33,'#926b51');
}
function fortress(g,b){
 const{x,y,w,h}=b;
 paper(g,[[x+3,y+26],[x+35,y+2],[x+w-28,y+5],[x+w+2,y+26],[x+w-7,y+h-17],[x+w-28,y+h+2],[x+15,y+h-4]],'#8f897c');
 paper(g,[[x+24,y+29],[x+w-33,y+18],[x+w-26,y+h-30],[x+32,y+h-20]],'#bdb19d');
 // Carlsten's characteristic 17th-century tower is already complete.
 const cx=x+w*.48,cy=y+h*.53;
 g.save();g.shadowColor='#322c2455';g.shadowOffsetY=4;g.beginPath();g.arc(cx,cy,49,0,Math.PI*2);
 g.fillStyle=window.UPPDRAG_PAPER_FIBRES?.material?.(g,'#d3c4aa','piece')||'#d3c4aa';g.fill();g.restore();
 g.beginPath();g.arc(cx,cy,36,0,Math.PI*2);g.fillStyle='#737166';g.fill();
 g.beginPath();g.arc(cx,cy,13,0,Math.PI*2);g.fillStyle='#b7a991';g.fill();
 for(let i=0;i<4;i++)fleck(g,x+43+i*18,y+h-37,14,10,'#c1b5a0');
}
function paintFields(g,r){
 if(r?.id!=='main')return;
 // Irregular cut-paper strips: shared 1700s arable land, already chapter one.
 const xx=2985,yy=1090;
 paper(g,[[xx-18,yy+30],[xx+109,yy+2],[xx+262,yy-15],[xx+461,yy-20],[xx+479,yy+68],[xx+317,yy+111],[xx+138,yy+107],[xx-8,yy+121]],'#ac9977');
 for(let i=0;i<10;i++){
   const x=xx+i*45;
   paper(g,[[x,yy+25-i*3],[x+35,yy+17-i*3],[x+48,yy+92-i*2],[x+7,yy+104-i*2]],
     ['#a99576','#b6a17d','#968b6c','#c0b18c'][i%4]);
 }
}
function paintBuildings(g,r){
 if(!r)return;
 for(const b of r.buildings){
 if(r.id==='main'&&b.name==='Slottet')palace(g,b);
 if(r.id==='main'&&b.name==='Byn')village(g,b);
 if(r.id==='main'&&b.name==='Herrgården')manor(g,b);
 if(r.id==='marstrand'&&b.name==='Fästningen')fortress(g,b);
 }
}
window.UPPDRAG_WORLD_GROWTH={chapter,paintFields,paintBuildings};
})();