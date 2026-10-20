/* The village is a destination, not a patch on top of the city map.
 * Reuses the existing farm doorway, meeting NPC and return button.
 * The scene is hand-layered paper; no new routes or task/score mechanics.
 */
(function(){
'use strict';
const existing=window.UPPDRAG_ROOM_ART;
if(!existing)return;
const chapter=Number((document.title.match(/Kapitel\s+(\d+)/i)||[])[1]||1);
const later=chapter>=5;
const f=()=>window.UPPDRAG_PAPER_FIBRES;
function shape(g,pts,c){
 g.save();g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
 g.shadowColor='#3d2e2244';g.shadowOffsetY=3;g.shadowOffsetX=1;g.shadowBlur=2;
 g.fillStyle=f()?.material?.(g,c,'piece')||c;g.fill();g.shadowColor='transparent';
 g.strokeStyle='#e9d9bb';g.lineWidth=1.25;g.stroke();g.restore();
}
function hut(g,x,y,s,c){
 g.save();g.translate(x,y);g.scale(s,s);
 shape(g,[[-61,-12],[-22,-41],[36,-39],[69,-6],[61,15],[9,30],[-50,23]],c);
 shape(g,[[-57,5],[6,16],[7,65],[-57,52]],'#cdbb9b');
 shape(g,[[7,16],[60,0],[60,48],[7,65]],'#b4a181');
 shape(g,[[-14,43],[8,45],[8,64],[-13,59]],'#66513f');
 shape(g,[[35,30],[48,25],[49,41],[34,45]],'#eedcbd');
 shape(g,[[27,-35],[38,-35],[38,-55],[26,-55]],'#9b8c7a');
 g.restore();
}
function field(g,x,y,w,h,index){
 const c=['#a89b77','#b6a481','#9d9874','#bfb08c'][index%4];
 shape(g,[[x+3,y+9],[x+w-11,y-4],[x+w+2,y+h-12],[x+w-6,y+h+4],[x-8,y+h-2]],c);
 g.save();g.strokeStyle='#7f765a';g.lineWidth=1.5;
 for(let i=1;i<=5;i++){const px=x+i*w/6;g.beginPath();g.moveTo(px,y+12);g.lineTo(px+6,y+h-9);g.stroke();}
 g.restore();
}
function render(canvas){
 const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return null;
 const d=Math.min(window.devicePixelRatio||1,2),W=Math.round(rect.width*d),H=Math.round(rect.height*d);
 if(canvas.width!==W)canvas.width=W;if(canvas.height!==H)canvas.height=H;
 const g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);
 const w=rect.width,h=rect.height;g.clearRect(0,0,w,h);
 const scale=Math.min(w/1280,h/720),ox=(w-1280*scale)/2,oy=(h-720*scale)/2;
 g.save();g.fillStyle=f()?.material?.(g,'#e1d3b7','paper')||'#e1d3b7';g.fillRect(0,0,w,h);
 g.translate(ox,oy);g.scale(scale,scale);
 // Everything belongs to one irregular layered village ground.
 shape(g,[[20,160],[105,89],[325,57],[547,103],[780,50],[1118,95],[1248,214],[1200,502],[1125,650],[846,682],[567,646],[321,679],[70,600]],'#a7aa86');
 shape(g,[[62,345],[252,304],[459,359],[660,346],[890,329],[1118,348],[1207,390],[1153,439],[852,407],[584,422],[325,413],[91,447]],'#c9bd98');
 if(!later){
 // En sammanhållen by före skiftets förändringar: gårdar runt byvägen.
 for(let i=0;i<7;i++)field(g,70+i*157,525+(i%2)*13,135,85,i);
 hut(g,270,225,1.18,'#8c624b');hut(g,545,205,1.22,'#82644f');
 hut(g,840,218,1.09,'#8c6b4f');hut(g,660,477,.78,'#997557');
 shape(g,[[438,262],[507,235],[592,265],[568,295],[468,302]],'#8a886d');
 }else{
 // The early process of reallocation has begun. Consolidated plots grow;
 // do not imply the nineteenth-century Laga skifte already happened.
 field(g,80,495,290,121,0);field(g,398,504,302,106,1);
 field(g,729,494,401,126,2);
 hut(g,217,241,1.11,'#8c624b');hut(g,611,195,1.2,'#82644f');
 hut(g,978,252,1.06,'#8c6b4f');
 // A former clustered farmstead, now a small garden and open courtyard.
 shape(g,[[411,258],[476,234],[530,258],[512,299],[439,305]],'#b9ad88');
 }
 // Village life: haystacks, shared well and unfenced kitchen gardens.
 shape(g,[[482,400],[509,380],[542,405],[533,443],[494,439]],'#8a7454');
 shape(g,[[497,396],[509,388],[523,399],[521,422],[500,422]],'#e4d7b6');
 shape(g,[[1045,414],[1090,398],[1124,420],[1112,447],[1065,453]],'#b6a17c');
 for(let i=0;i<6;i++)shape(g,[[1059+i*9,420],[1064+i*9,408],[1070+i*9,421]],'#7e926e');
 // A distinct paper arrow/trodden track to the established exit hit.
 shape(g,[[38,467],[141,475],[198,496],[174,530],[68,521]],'#d7c8a7');
 g.restore();
 // The doorway hit matches the normal interior scene; leaveRoom also works.
 return {x:ox+60*scale,y:oy+170*scale,w:145*scale,h:345*scale};
}
window.UPPDRAG_ROOM_ART={...existing,
 names:{...existing.names,farm:'Byn · bygemenskap'},
 descriptions:{...existing.descriptions,farm:later?'Åkrar börjar läggas samman; gårdar och bygemenskap förändras.':'Gårdarna ligger tätt tillsammans, omgivna av oskiftade åkertegar.'},
 render(canvas,id){return id==='farm'?render(canvas):existing.render(canvas,id);}
};
})();