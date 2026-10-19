/* Kapitel 3: vardagsvimlet tystnar, historiska konflikter blir synliga.
 * Replikerna är dramatiserade, inte historiska citat. Ingen egen animationsloop.
 */
(function(){
'use strict';
const stage=document.getElementById('stage');if(!stage)return;
const CAST={
 cap:{id:'cap',name:'En mössa',region:'main',x:934,y:767,r:40,role:'cap',color:'#7b866b',heading:-1.2},
 hat:{id:'hat',name:'En hatt',region:'main',x:1095,y:770,r:40,role:'hat',color:'#75604b',heading:-2.1},
 farmers:{id:'farmers',name:'Bönder från Dalarna',region:'main',x:749,y:709,r:55,role:'farmer',color:'#8d7656',heading:0},
 soldiers:{id:'soldiers',name:'Två soldater',region:'main',x:1432,y:708,r:51,role:'soldier',color:'#687b82',heading:-.7},
 david:{id:'david',name:'David Hedenquist',region:'marstrand',x:1281,y:378,r:44,role:'david',color:'#736957',heading:-1.57}
};
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
// Visual camp sites are dramatized placements on this game's map, not claims
// about documented barracks at these precise addresses.
const RUSSIAN_CAMPS=[
 {id:'north',name:'Ryskt läger · norr om Barnhuset',x:2416,y:232,label:'RYSKT LÄGER'},
 {id:'west',name:'Ryskt läger · väster om Tryckeriet',x:272,y:1108,label:'RYSKT LÄGER'}
];

const box=document.createElement('div');box.id='ch3StreetDialogue';box.hidden=true;
box.setAttribute('role','button');box.tabIndex=0;
box.setAttribute('aria-label','Pratbubbla. Klicka för nästa replik.');
box.innerHTML='<span class="ch3Speaker"></span><span class="ch3Words"></span><span class="ch3Arrow" aria-hidden="true">›</span>';
stage.append(box);
const css=document.createElement('style');
css.textContent=[
 '#ch3StreetDialogue{position:absolute;z-index:22;box-sizing:border-box;width:min(274px,calc(100% - 24px));max-height:calc(100% - 18px);overflow:auto;background:#fff8e9;border:1.5px solid #ac9774;border-radius:35% 31% 34% 30% / 23% 27% 26% 24%;box-shadow:2px 3px 0 #46372520;padding:14px 21px 16px;color:#3b3227;pointer-events:auto;text-align:center;cursor:pointer}',
 '#ch3StreetDialogue[hidden]{display:none!important}',
 '#ch3StreetDialogue:after{content:"";position:absolute;left:var(--tail-x,50%);bottom:1px;width:14px;height:11px;transform:translate(-50%,79%) rotate(-20deg);border:1px solid #ac9774;border-radius:55% 40%;background:#fff8e9;pointer-events:none}',
 '#ch3StreetDialogue .ch3Speaker{display:block;font:600 12px/1.25 Georgia,serif;color:#78624b;margin:0 0 5px}',
 '#ch3StreetDialogue .ch3Words{display:block;font:16px/1.38 Georgia,serif;overflow-wrap:break-word}',
 '#ch3StreetDialogue .ch3Arrow{display:block;font:19px/1 Georgia,serif;color:#8c765c;text-align:right;margin:-1px 0 -6px}',
 '#ch3StreetDialogue:focus-visible{outline:2px dashed #8f7b5e;outline-offset:3px}',
 '@media(max-width:550px){#ch3StreetDialogue{width:min(244px,calc(100% - 18px));padding:12px 17px 14px}#ch3StreetDialogue .ch3Words{font-size:15px}}'
].join('\n');document.head.append(css);
const speaker=box.querySelector('.ch3Speaker'),speech=box.querySelector('.ch3Words');
let active=null,lineIndex=0,viewport=null,enteredAt=performance.now(),lastPhase=1,openedAt=0;
const talkPaused={farmers:0,soldiers:0};
function step(){const state=window.UPPDRAG_CH3_PILOT?.state;return state?.complete?99:Math.max(0,state?.step||0);}
function phase(){const n=step();return n<3?1:n<7?2:3;}
function visible(region,id){
 const c=CAST[id];if(!region||!c||region.id!==c.region)return false;
 return id==='farmers'||id==='soldiers'?phase()>=2:id==='david'?step()>=4:true;
}
function position(actor,now=performance.now()){
 const cur=phase();
 if(cur!==lastPhase){enteredAt=now;lastPhase=cur;talkPaused.farmers=0;talkPaused.soldiers=0;}
 if(active?.id===actor.id)return {...actor,x:active.x,y:active.y,moving:false};
 const moving=!reduced?.matches;
 const elapsed=Math.max(0,now-enteredAt-(talkPaused[actor.id]||0));
 if(actor.role==='farmer'){
   // March from the printshop road into the square; then remain for discussion.
   const fraction=cur===2?(moving?Math.min(1,elapsed/37000):0):1;
   return {...actor,x:749+238*fraction,y:709+Math.sin(now/1300)*.7,moving:cur===2&&fraction<1&&moving,heading:0};
 }
 if(actor.role==='soldier'){
   // Two soldiers pace along the archive–opera road, with visible travel.
   const advance=moving?(1-Math.cos(elapsed/2600))*.5:0;
   return {...actor,x:1432-146*advance,y:708+advance*2,moving,heading:advance>.5?-2.9:0};
 }
 return {...actor,y:actor.y+(moving?Math.sin(now/(2600+actor.x%700))*.5:0),moving:false};
}
function people(region){return Object.values(CAST).filter(a=>visible(region,a.id)).map(a=>position(a));}
function find(region,id){return visible(region,id)?position(CAST[id]):null;}
function hit(region,point){
 let selected=null,minimum=Infinity;
 if(!point)return null;
 for(const a of people(region)){
   const d=Math.hypot(a.x-point.x,a.y-point.y);
   if(d<=a.r&&d<minimum){selected=a;minimum=d;}
 }
 return selected;
}
function nearest(region,player,range=92){
 if(!player)return null;
 return people(region).map(p=>({...p,distance:Math.hypot(player.x-p.x,player.y-p.y)}))
  .filter(p=>p.distance<=range).sort((a,b)=>a.distance-b.distance)[0]||null;
}
function story(actor){
 const n=step();
 if(actor.id==='cap')return n<4
   ?[['Mössan','Varför ska vi ha ännu ett krig? Det är ju bönderna som får betala.'],['Du','Vad vill ni mössor?'],['Mössan','Hellre fred än ännu ett misslyckat krig.']]
   :[['Mössan','David Hedenquist vägrade skjuta mot bönderna. Det var modigt.'],['Du','En del kallar honom feg.'],['Mössan','Inte jag. De har skickat honom till Marstrands fästning.']];
 if(actor.id==='hat')return n<4
   ?[['Hatten','Vi kan inte låta Ryssland tro att Sverige är svagt!'],['Du','Vill du ha krig?'],['Hatten','Vi vill ta tillbaka det som Sverige har förlorat.']]
   :[['Hatten','David Hedenquist? En soldat som vägrar lyda är en fegis.'],['Du','Han ville inte skjuta mot bönderna.'],['Hatten','Kan han inte skjuta mot en bonde, hur ska han då skjuta mot en ryss?']];
 if(actor.id==='farmers')return n>=7
   ?[['En bonde','På Norrmalm sköt soldaterna mot bönderna. Många kom inte hem.'],['Du','Ni ville att de skulle lyssna på er.'],['Bonden','Ja. Vi ville inte ha mer krig.']]
   :[['En bonde','Nog med krig! Nog med höga skatter!'],['Du','Varför har ni kommit till Stockholm?'],['Bonden','De som startade kriget måste ta ansvar!']];
 if(actor.id==='soldiers')return n>=7
   ?[['En soldat','På Norrmalm sköts många bönder. Vi fick fruktansvärda order.'],['Du','Ville du möta dem?'],['Soldaten','Nej. Jag ville inte rikta mitt vapen mot svenska bönder.']]
   :[['En soldat','De säger att vi ska stoppa bönderna.'],['Du','Vill du det?'],['Soldaten','Jag vill hellre hem till gården, eller möta fienden. Inte våra egna.']];
 if(actor.id==='david')return [
   ['Du','Är du David Hedenquist?'],['David','Ja. Jag vägrade skjuta på bönderna i Stockholm.'],
   ['Du','En del kallar dig modig. Andra kallar dig feg.'],
   ['David','Jag kunde inte skjuta. Jag dömdes först till döden. Nu avtjänar jag straffarbete här på fästningen.']
 ];
 return [];
}
function positionPanel(actor,who){
 if(!viewport)return;
 const {camera,layout,player}=viewport,target=who==='Du'&&player?player:position(actor);
 const sx=layout.w/2+(target.x-camera.x)*layout.scale;
 const sy=layout.h/2+(target.y-camera.y)*layout.scale;
 box.hidden=false;
 const bounds=box.getBoundingClientRect();
 const width=Math.min(bounds.width,layout.w-20),height=Math.min(bounds.height,layout.h-18);
 const left=Math.max(9,Math.min(layout.w-width-9,sx-width*.52));
 const top=Math.max(8,Math.min(layout.h-height-8,sy-height-24));
 box.style.left=left+'px';box.style.top=top+'px';
 box.style.setProperty('--tail-x',Math.max(24,Math.min(width-24,sx-left))+'px');
}
function show(){
 if(!active)return false;
 const lines=story(active);
 if(lineIndex>=lines.length)return close();
 const [who,text]=lines[lineIndex];speaker.textContent=who;speech.textContent=text;
 box.setAttribute('aria-label',who+': '+text+' Klicka för nästa replik.');
 box.hidden=false;positionPanel(active,who);
 box.focus({preventScroll:true});return true;
}
function open(actor){
 if(!actor||active||!viewport)return false;
 const real=find(viewport.region,actor.id);if(!real)return false;
 active=real;lineIndex=0;openedAt=performance.now();
 window.UPPDRAG_WORLD_KEYBOARD?.clear?.();
 return show();
}
function close(){
 if(!active)return false;
 if(active.id==='farmers'||active.id==='soldiers')
   talkPaused[active.id]+=Math.max(0,performance.now()-openedAt);
 active=null;lineIndex=0;box.hidden=true;return true;
}
function next(){if(!active)return false;lineIndex++;return show();}
box.addEventListener('click',()=>{next();});
window.addEventListener('keydown',e=>{
 if(!active||e.defaultPrevented||e.key!=='Escape')return;
 e.preventDefault();e.stopImmediatePropagation();close();
},true);
function paper(ctx,points,color){
 ctx.save();ctx.beginPath();
 points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
 const fibre=window.UPPDRAG_PAPER_FIBRES;
 ctx.fillStyle=fibre?.material?.(ctx,color,'piece')||color;ctx.fill();
 if(fibre?.loaded&&fibre?.finish){
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  fibre.finish(ctx,{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)},{kind:'piece'});
 }
 ctx.restore();
}
function cap(ctx,a){
 ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.heading);
 if(a.role==='hat'||a.role==='soldier'||a.role==='russian'){
  paper(ctx,[[-7,-11],[9,-13],[22,-10],[25,-1],[21,10],[8,13],[-6,9]],a.role==='hat'?'#494237':a.role==='russian'?'#363c35':'#445d71');
  paper(ctx,[[1,-6],[17,-8],[21,0],[16,8],[1,7]],'#847258');
 }else{
  ctx.fillStyle=a.role==='cap'?'#556c59':'#715d4c';
  ctx.beginPath();ctx.ellipse(8,0,10,9,0,0,Math.PI*2);ctx.fill();
  if(a.role!=='david')paper(ctx,[[3,-8],[15,-8],[19,-3],[0,-3]],'#a28d6d');
 }
 ctx.restore();
}
function drawFigure(ctx,a,now,scale=1){
 ctx.save();ctx.translate(a.x,a.y);ctx.scale(scale,scale);ctx.translate(-a.x,-a.y);
 const who={color:a.color,woman:false};
 if(window.UPPDRAG_MEETINGS?.drawMapPerson){
  window.UPPDRAG_MEETINGS.drawMapPerson(ctx,{x:a.x,y:a.y,heading:a.heading,animationTime:now,moving:!!a.moving},who,now);
 }else{
  ctx.beginPath();ctx.ellipse(a.x,a.y,13,14,0,0,Math.PI*2);ctx.fillStyle=a.color;ctx.fill();
  ctx.beginPath();ctx.ellipse(a.x+8,a.y,8,7,0,0,Math.PI*2);ctx.fillStyle='#cfa981';ctx.fill();
 }
 cap(ctx,a);ctx.restore();
}
function drawGroup(ctx,a,now){
 if(a.id==='farmers'){
  for(const [j,dx,dy,color] of [[0,-36,-10,'#78694d'],[1,-68,14,'#92785b'],[2,32,18,'#766e57']])
   drawFigure(ctx,{...a,x:a.x+dx,y:a.y+dy,color,heading:.04+j*.11},now,.84);
  paper(ctx,[[a.x-83,a.y-23],[a.x-79,a.y-23],[a.x-56,a.y+17],[a.x-60,a.y+17]],'#705541');
 }else if(a.id==='soldiers'){
  drawFigure(ctx,{...a,x:a.x+35,y:a.y+17,color:'#687783',heading:-.6},now,.92);
 }
 drawFigure(ctx,a,now);
}
function paperTag(ctx,label,x,y){
 const width=Math.min(170,16+label.length*7);
 ctx.save();ctx.fillStyle='#f2e6d0';ctx.strokeStyle='#ab926d';ctx.lineWidth=1;
 ctx.beginPath();ctx.roundRect(x-width/2,y,width,24,7);ctx.fill();ctx.stroke();
 ctx.fillStyle='#534334';ctx.font='600 12px Georgia';ctx.textAlign='center';
 ctx.fillText(label,x,y+16);ctx.restore();
}

function stationedCamps(region){
 return region?.id==='main'&&step()>=9?RUSSIAN_CAMPS:[];
}
function campCanvas(ctx,camp,now){
 const {x,y}=camp;
 // Tents and cooking fire use the world's rough, overlapping paper cuttings.
 // No combat or simulated siege is shown: these are postwar auxiliary troops.
 paper(ctx,[[x-119,y+40],[x-97,y-29],[x-42,y-11],[x-22,y+38]],'#746b56');
 paper(ctx,[[x-97,y-29],[x-55,y-29],[x-22,y+38],[x-42,y-11]],'#ada08a');
 paper(ctx,[[x-26,y+42],[x+4,y-42],[x+62,y-17],[x+84,y+42]],'#80785f');
 paper(ctx,[[x+4,y-42],[x+48,y-42],[x+84,y+42],[x+62,y-17]],'#b8ab92');
 paper(ctx,[[x+63,y+31],[x+86,y-17],[x+129,y-6],[x+144,y+36]],'#797660');
 paper(ctx,[[x+86,y-17],[x+117,y-17],[x+144,y+36],[x+129,y-6]],'#a7987f');
 for(const shift of [-86,23,111]){
   paper(ctx,[[x+shift,y+39],[x+shift+21,y+39],[x+shift+14,y+49],[x+shift+7,y+49]],'#67553f');
 }
 // Fur cap, green coat and red cuffs of 1740s Russian troops.
 const soldiers=[
  {dx:-116,dy:54,size:.92},
  {dx:-62,dy:73,size:.94},
  {dx:10,dy:65,size:1},
  {dx:62,dy:66,size:.90},
  {dx:120,dy:73,size:.92},
  {dx:23,dy:101,size:.94}
 ];
 for(let i=0;i<soldiers.length;i++){
   const person=soldiers[i],walking=!reduced?.matches&&(i===1||i===5);
   const travel=walking?Math.sin(now/(1900+i*270)+i*2)*23:0;
   const actor={
     id:camp.id+'-'+i,role:'russian',x:x+person.dx+travel,
     y:y+person.dy+(walking?Math.cos(now/2300+i)*2:0),
     color:i%2?'#4c6248':'#53684d',heading:walking?0:.18,
     moving:walking
   };
   drawFigure(ctx,actor,now,person.size);
   // Red collar marks the uniform even at small map scale.
   paper(ctx,[[actor.x-8,actor.y-11],[actor.x+2,actor.y-11],
     [actor.x+6,actor.y-8],[actor.x-6,actor.y-6]],'#9a4e45');
 }
 paperTag(ctx,camp.label,x+2,y-69);
}
function draw(ctx,{region,now=performance.now(),camera,layout,player}={}){
 if(!region||!camera||!layout)return;
 viewport={region,camera:{x:camera.x,y:camera.y},layout:{w:layout.w,h:layout.h,scale:layout.scale},player};
 if(active&&active.region!==region.id)close();
 for(const camp of stationedCamps(region))campCanvas(ctx,camp,now);
 for(const a of people(region)){
  drawGroup(ctx,a,now);
  if(a.id==='david'&&player&&Math.hypot(player.x-a.x,player.y-a.y)<165)
   paperTag(ctx,'DAVID HEDENQUIST',a.x,a.y+31);
 }
 if(active){const lines=story(active);positionPanel(active,lines[lineIndex]?.[0]||'');}
 if(region.id==='main'&&phase()===2&&!active&&!reduced?.matches&&now%16000<2600){
  const leader=find(region,'farmers');if(leader)paperTag(ctx,'NOG MED KRIG!',leader.x,leader.y-64);
 }
}
window.UPPDRAG_CH3_CITY_LIFE={people,find,hit,nearest,open,close,next,draw,phase,stationedCamps,
 get active(){return !!active},get actor(){return active?.id||null},
 get lines(){return active?story(active):[]}};
})();