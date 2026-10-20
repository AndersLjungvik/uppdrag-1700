/* Pappersstaden: samma kartplatser får historiska byggnadsstadier.
 * Enbart visuell komposition: ändrar inte objektlistor, kollisioner, vägar
 * kapitelspärrar, uppdrag, belöningar eller interaktionszoner.
 * Stockholms slott brukbart 1754. Carlstens runda torn före 1700.
 */
(function(){
'use strict';
const chapter=Number((document.title.match(/Kapitel\s+(\d+)/i)||[])[1]||1);
const fibre=()=>window.UPPDRAG_PAPER_FIBRES;
function fill(g,x,y,w,h,c){g.fillStyle=fibre()?.material?.(g,c,'piece')||c;g.fillRect(x,y,w,h);}
function poly(g,ps,c){g.beginPath();ps.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=fibre()?.material?.(g,c,'piece')||c;g.fill();}
function stroke(g,ps,c='#695b49',w=3){g.beginPath();ps.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokeStyle=c;g.lineWidth=w;g.stroke();}
function hut(g,x,y,w,h,roof='#9b664e'){
  fill(g,x+3,y+4,w,h,'#c7b492');
  poly(g,[[x,y+5],[x+w*.16,y-5],[x+w+3,y+4],[x+w-3,y+h*.36],[x+3,y+h*.36]],roof);
  fill(g,x+w*.40,y+h*.52,w*.2,h*.48,'#715642');
  fill(g,x+w*.12,y+h*.51,w*.15,h*.12,'#ded0aa');
}
function farmland(g){
  // Oskiftade smala tegar finns från första kapitlet; senare kapitel
  // har samma gränser, inte en anakronistisk omedelbar skiftesreform.
  g.save();
  const colors=['#a4906c','#c0a47b','#9f956e','#b9ac85','#95896e','#b3a27f'];
  const strips=[
    [[2980,1110],[3110,1093],[3135,1187],[3000,1205]],
    [[3114,1093],[3210,1079],[3232,1172],[3138,1187]],
    [[3215,1080],[3320,1072],[3331,1159],[3235,1172]],
    [[3324,1071],[3450,1065],[3460,1150],[3336,1158]]
  ];
  strips.forEach((p,j)=>{
    poly(g,p,'#756d59');
    for(let i=0;i<6;i++){
      const a=i/6,b=(i+1)/6,lerp=(u,v,t)=>[u[0]+(v[0]-u[0])*t,u[1]+(v[1]-u[1])*t];
      poly(g,[lerp(p[0],p[3],a),lerp(p[1],p[2],a),lerp(p[1],p[2],b),lerp(p[0],p[3],b)],colors[(j+i)%colors.length]);
      if(i%2===0)stroke(g,[lerp(p[0],p[3],b),lerp(p[1],p[2],b)],'#776e55',1.4);
    }
  });
  // Herrgårdens små brukade fält ligger under godset, inte i byns tegar.
  poly(g,[[3222,445],[3327,437],[3355,525],[3250,533]],'#a99976');
  for(let i=0;i<5;i++)stroke(g,[[3230+i*18,454],[3258+i*18,520]],'#827753',2);
  g.restore();
}
function palace(g,b){
  const {x,y,w,h}=b;
  g.save();
  // Återanvänd samma byggnadsyta. Det centrala gårdsrummet är synligt uppifrån.
  fill(g,x,y,w,h,'#a79a83');
  fill(g,x+15,y+14,w-30,h-28,'#d6c6aa');
  fill(g,x+47,y+40,w-94,h-78,'#baa88d');
  const complete=chapter>=4, middle=chapter===3;
  const roof='#686760',stone='#c4b8a4';
  // Västra och norra flygeln har kommit längre redan i de tidiga kapitlen.
  fill(g,x+8,y+8,38,h-16,roof);
  fill(g,x+8,y+8,w-16,32,roof);
  // De övriga flyglarna kan successivt tas i bruk efter återuppbyggnaden.
  if(complete||middle){
    fill(g,x+w-46,y+8,38,h-16,roof);
    fill(g,x+8,y+h-40,w-16,32,roof);
  }else{
    fill(g,x+w-46,y+8,38,h*.40,stone);
    fill(g,x+8,y+h-40,w*.58,32,stone);
    // Resning, ställningar och synligt byggarbete, men inte en stenhög i vägen.
    for(const t of [.61,.72,.83,.94]){
      const sx=x+w*t;
      stroke(g,[[sx,y+h*.57],[sx,y+h-9]],'#806c4b',2.1);
      stroke(g,[[sx-7,y+h*.61],[sx+7,y+h*.61]],'#90734e',1.6);
    }
    for(let i=0;i<4;i++)fill(g,x+50+i*35,y+h-37,27,10,'#857969');
  }
  // Fönster och stenskift på väggarna; dörr och väg in ligger oförändrat.
  for(let i=0;i<7;i++){
    fill(g,x+62+i*30,y+19,10,5,'#e8dac0');
    if(complete||middle)fill(g,x+62+i*30,y+h-30,10,5,'#dfd2b9');
  }
  for(let i=0;i<3;i++){
    fill(g,x+17,y+53+i*32,5,10,'#dfd2b9');
    if(complete||middle)fill(g,x+w-28,y+53+i*32,5,10,'#dfd2b9');
  }
  if(!complete){
    // Trä och sten lagras inne på byggarbetsplatsen, inte på den vanliga vägen.
    for(let i=0;i<4;i++)fill(g,x+67+i*14,y+74,9,20,'#8d7453');
    poly(g,[[x+174,y+66],[x+190,y+83],[x+176,y+92]],'#aaa18c');
  }else{
    fill(g,x+w*.48,y+h*.62,10,16,'#8c9583');
  }
  g.restore();
}
function village(g,b){
  const{x,y,w,h}=b;
  g.save();
  fill(g,x,y,w,h,'#a9aa87');
  poly(g,[[x+8,y+10],[x+w-9,y+9],[x+w-9,y+h-10],[x+8,y+h-10]],'#bcb397');
  // En bytomt består av flera gårdar och ekonomibyggnader.
  hut(g,x+18,y+22,72,48,'#8e5f4d');
  hut(g,x+118,y+16,75,49,'#80634d');
  hut(g,x+19,y+87,62,41,'#947355');
  hut(g,x+123,y+86,57,39,'#806a53');
  // Små uthus och gårdsplan utan att dölja den ordinarie dörrens ingång.
  fill(g,x+94,y+70,22,20,'#9a8061');
  fill(g,x+91,y+67,27,8,'#776854');
  g.restore();
}
function manor(g,b){
  const{x,y,w,h}=b;
  g.save();fill(g,x,y,w,h,'#a9aa85');
  poly(g,[[x+7,y+10],[x+w-8,y+8],[x+w-8,y+h-11],[x+7,y+h-12]],'#c7bb9b');
  fill(g,x+39,y+22,w-77,75,'#cfbda3');
  poly(g,[[x+31,y+24],[x+45,y+11],[x+w-32,y+10],[x+w-25,y+24],[x+w-40,y+56],[x+42,y+57]],'#736f62');
  for(let i=0;i<6;i++)fill(g,x+54+i*23,y+66,11,14,'#e6d9be');
  // Torp på marken: litet hus och gård, inte ännu en exklusiv herrgård.
  hut(g,x+16,y+103,47,30,'#846b50');
  hut(g,x+w-66,y+103,48,30,'#997454');
  g.restore();
}
function fortress(g,b){
  const{x,y,w,h}=b;
  g.save();
  fill(g,x,y,w,h,'#a29885');
  fill(g,x+19,y+13,w-38,h-25,'#6a675d');
  fill(g,x+34,y+29,w-68,h-58,'#b3aa96');
  // Runda centraltornet stod färdigt långt före 1700-talet.
  const cx=x+w*.48,cy=y+h*.52;
  g.beginPath();g.arc(cx+5,cy+5,48,0,Math.PI*2);g.fillStyle='#55544a55';g.fill();
  g.beginPath();g.arc(cx,cy,48,0,Math.PI*2);g.fillStyle='#d1c4aa';g.fill();
  g.beginPath();g.arc(cx,cy,37,0,Math.PI*2);g.fillStyle='#717369';g.fill();
  g.beginPath();g.arc(cx,cy,13,0,Math.PI*2);g.fillStyle='#b9b19a';g.fill();
  for(let i=0;i<12;i++){const a=i*Math.PI/6;stroke(g,[[cx+39*Math.cos(a),cy+39*Math.sin(a)],[cx+45*Math.cos(a),cy+45*Math.sin(a)]],'#e4d8bf',2.3);}
  // Nybyggda yttre försvarsverk, stenhuggeri och byggställning åt öster.
  for(let i=0;i<5;i++){const sx=x+w-67+i*12;stroke(g,[[sx,y+43],[sx,y+h-20]],'#947d56',2);}
  for(let i=0;i<4;i++)fill(g,x+40+i*17,y+h-38,12,9,'#d0c2a5');
  // Den stora porten ligger fortfarande vid samma navigeringspunkt.
  g.restore();
}
function paintFields(g,r){if(r?.id==='main')farmland(g);}
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