/* Kapitel 3: vardagsvimlet tystnar, historiska konflikter blir synliga.
 * Replikerna är dramatiserade, inte historiska citat. Ingen egen animationsloop.
 */
(function(){
'use strict';
const stage=document.getElementById('stage');if(!stage)return;
const CAST={
 cap:{id:'cap',name:'En mössa',region:'main',x:934,y:767,r:40,role:'cap',color:'#7b866b',heading:-1.2},
 hat:{id:'hat',name:'En hatt',region:'main',x:1095,y:770,r:40,role:'hat',color:'#75604b',heading:-2.1},
 farmers:{id:'farmers',name:'Bönder från Dalarna',region:'main',x:810,y:720,r:55,role:'farmer',color:'#8d7656',heading:0},
 soldiers:{id:'soldiers',name:'Två soldater',region:'main',x:1487,y:765,r:51,role:'soldier',color:'#687b82',heading:-.7},
 david:{id:'david',name:'David Hedenquist',region:'marstrand',x:1281,y:378,r:44,role:'david',color:'#736957',heading:-1.57}
};
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
const box=document.createElement('section');box.id='ch3StreetDialogue';box.hidden=true;
box.setAttribute('role','dialog');box.setAttribute('aria-label','Samtal ute i staden');
box.innerHTML='<p class="ch3Speaker"></p><p class="ch3Words"></p><div class="ch3Buttons">'
 +'<button data-city="close" type="button">Stäng</button><button data-city="next" type="button">Fortsätt ›</button></div>';
stage.append(box);
const css=document.createElement('style');
css.textContent=[
 '#ch3StreetDialogue{position:absolute;z-index:22;box-sizing:border-box;width:min(356px,calc(100% - 20px));max-height:calc(100% - 18px);overflow-y:auto;overscroll-behavior:contain;background:#fcf2da var(--dialogue-paper,none) repeat;border:1.5px solid #a58d66;border-radius:30% 29% 28% 31% / 23% 24% 24% 25%;box-shadow:2px 4px 1px #392b252b;padding:21px 27px;color:#332c24;text-align:center;pointer-events:auto}',
 '#ch3StreetDialogue[hidden]{display:none!important}',
 '#ch3StreetDialogue:after{content:"";position:absolute;left:var(--tail-x,50%);bottom:0;width:17px;height:11px;transform:translate(-50%,60%);border:1px solid #a58d66;border-radius:50%;background:#fcf2da var(--dialogue-paper,none) repeat;pointer-events:none}',
 '#ch3StreetDialogue .ch3Speaker{font:600 17px/1.3 Georgia,serif;color:#64513c;margin:0 0 8px}',
 '#ch3StreetDialogue .ch3Words{font:17px/1.44 Georgia,serif;margin:0 0 13px;overflow-wrap:break-word}',
 '#ch3StreetDialogue .ch3Buttons{display:flex;justify-content:center;gap:13px;flex-wrap:wrap}',
 '#ch3StreetDialogue button{border:1px solid #a9916b;background:#e8d4ad;color:#3b3227;border-radius:6px;min-height:39px;padding:7px 12px;font:14px/1.3 Georgia,serif;cursor:pointer}',
 '#ch3StreetDialogue button[data-city="close"]{background:#f9efda}',
 '#ch3StreetDialogue button:focus-visible{outline:2px dashed #6e624c;outline-offset:2px}',
 '@media(max-width:550px){#ch3StreetDialogue{width:min(320px,calc(100% - 16px));padding:16px 20px;border-radius:22% 25% 24% 26% / 16% 18% 16% 17%}#ch3StreetDialogue .ch3Words{font-size:16px}#ch3StreetDialogue .ch3Speaker{font-size:15px}}'
].join('\n');document.head.append(css);
const speaker=box.querySelector('.ch3Speaker'),speech=box.querySelector('.ch3Words');
const nextBtn=box.querySelector('[data-city="next"]');
let active=null,lineIndex=0,viewport=null;
function step(){const state=window.UPPDRAG_CH3_PILOT?.state;return state?.complete?99:Math.max(0,state?.step||0);}
function phase(){const n=step();return n<3?1:n<7?2:3;}
function visible(region,id){
 const c=CAST[id];if(!region||!c||region.id!==c.region)return false;
 return id==='farmers'||id==='soldiers'?phase()>=2:id==='david'?step()>=4:true;
}
function position(actor,now=performance.now()){
 const walking=actor.role==='farmer'&&phase()===2&&!reduced?.matches?Math.sin(now/4400)*22:0;
 const breathing=reduced?.matches?0:Math.sin(now/(2600+actor.x%700))*.5;
 return {...actor,x:actor.x+walking,y:actor.y+breathing};
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
 box.hidden=false;box.style.left='10px';box.style.top='10px';
 const bounds=box.getBoundingClientRect();
 const w=Math.min(bounds.width,layout.w-20),h=Math.min(bounds.height,layout.h-18);
 const left=Math.max(10,Math.min(layout.w-w-10,sx-w*.55));
 const top=Math.max(9,Math.min(layout.h-h-9,sy-h-39));
 box.style.left=left+'px';box.style.top=top+'px';
 box.style.setProperty('--tail-x',Math.max(26,Math.min(w-26,sx-left))+'px');
}
function show(){
 if(!active)return false;
 const lines=story(active);
 if(lineIndex>=lines.length)return close();
 const [who,text]=lines[lineIndex];speaker.textContent=who;speech.textContent=text;
 nextBtn.textContent=lineIndex===lines.length-1?'Klart':'Fortsätt ›';
 box.hidden=false;positionPanel(active,who);
 nextBtn.focus({preventScroll:true});return true;
}
function open(actor){
 if(!actor||active||!viewport)return false;
 const real=find(viewport.region,actor.id);if(!real)return false;
 active=real;lineIndex=0;
 window.UPPDRAG_WORLD_KEYBOARD?.clear?.();
 return show();
}
function close(){if(!active)return false;active=null;lineIndex=0;box.hidden=true;return true;}
function next(){if(!active)return false;lineIndex++;return show();}
box.addEventListener('click',e=>{
 const action=e.target.closest('[data-city]')?.dataset.city;
 if(action==='next')next();else if(action==='close')close();
});
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
 if(a.role==='hat'||a.role==='soldier'){
  paper(ctx,[[-7,-11],[9,-13],[22,-10],[25,-1],[21,10],[8,13],[-6,9]],a.role==='hat'?'#494237':'#445d71');
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
  window.UPPDRAG_MEETINGS.drawMapPerson(ctx,{x:a.x,y:a.y,heading:a.heading,animationTime:now,moving:false},who,now);
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
function draw(ctx,{region,now=performance.now(),camera,layout,player}={}){
 if(!region||!camera||!layout)return;
 viewport={region,camera:{x:camera.x,y:camera.y},layout:{w:layout.w,h:layout.h,scale:layout.scale},player};
 for(const a of people(region)){
  drawGroup(ctx,a,now);
  if(a.id==='david'&&player&&Math.hypot(player.x-a.x,player.y-a.y)<165)
   paperTag(ctx,'DAVID HEDENQUIST',a.x,a.y+31);
 }
 if(region.id==='main'&&phase()===2&&!active&&!reduced?.matches&&now%16000<2600){
  const leader=find(region,'farmers');if(leader)paperTag(ctx,'NOG MED KRIG!',leader.x,leader.y-64);
 }
}
window.UPPDRAG_CH3_CITY_LIFE={people,find,hit,nearest,open,close,next,draw,phase,
 get active(){return !!active},get actor(){return active?.id||null},
 get lines(){return active?story(active):[]}};
})();