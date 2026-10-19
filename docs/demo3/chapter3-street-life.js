/* Kapitel 3: vardagsvimlet tystnar, historiska konflikter blir synliga.
 * Replikerna är dramatiserade, inte historiska citat. Ingen egen animationsloop.
 */
(function(){
'use strict';
const stage=document.getElementById('stage');if(!stage)return;
const CAST={
 cap:{id:'cap',name:'En mössa',region:'main',x:601,y:708,r:39,role:'cap',color:'#7b866b',heading:0},
 hat:{id:'hat',name:'En hatt',region:'main',x:1688,y:705,r:39,role:'hat',color:'#75604b',heading:0},
 farmers:{id:'farmers',name:'Bönder från Dalarna',region:'main',x:2385,y:705,r:65,role:'farmer',color:'#8d7656',heading:Math.PI},
 soldiers:{id:'soldiers',name:'Två soldater',region:'main',x:1872,y:705,r:52,role:'soldier',color:'#687b82',heading:0},
 david:{id:'david',name:'David Hedenquist',region:'marstrand',x:1096,y:469,r:44,role:'david',color:'#736957',heading:-1.57},
 rusBeach:{id:'rusBeach',name:'Rysk lägervakt vid stranden',region:'main',x:284,y:1061,r:39,role:'russian',color:'#53684d',heading:-1.15},
 rusNorth:{id:'rusNorth',name:'Rysk lägervakt vid Barnhuset',region:'main',x:2438,y:301,r:39,role:'russian',color:'#4c6248',heading:.30},
 noble:{id:'noble',name:'En herre från herrgården',region:'main',x:3393,y:356,r:40,role:'noble',color:'#71645d',heading:-1.8}
};
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
// Visual camp sites are dramatized placements on this game's map, not claims
// about documented barracks at these precise addresses.
const RUSSIAN_CAMPS=[
 {id:'north',name:'Ryskt läger · norr om Barnhuset',x:2416,y:232,label:'RYSKT LÄGER'},
 {id:'west',name:'Ryskt läger · väster om Tryckeriet',x:272,y:1108,label:'RYSKT LÄGER'}
];

const root=document.createElement('div');
root.id='ch3StreetRoot';root.hidden=true;
root.innerHTML='<svg id="ch3StreetTail" aria-hidden="true" focusable="false"></svg>'
  +'<div id="ch3StreetDialogue" role="button" class="speech" tabindex="0" aria-keyshortcuts="Enter Space Escape">'
  +'<span class="ch3Speaker"></span><p class="ch3Words"></p></div>';
stage.append(root);
const tail=root.querySelector('#ch3StreetTail'),box=root.querySelector('#ch3StreetDialogue'),
 speaker=box.querySelector('.ch3Speaker'),speech=box.querySelector('.ch3Words');
const css=document.createElement('style');
css.textContent=[
 '#ch3StreetRoot{position:absolute;inset:0;z-index:24;pointer-events:none;color:#362f27}',
 '#ch3StreetRoot[hidden]{display:none!important}',
 '#ch3StreetTail{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}',
 '#ch3StreetDialogue{position:absolute;box-sizing:border-box;width:260px;max-width:calc(100% - 22px);'
 +'min-height:54px;overflow:visible;background:transparent;border:0;box-shadow:none;'
 +'padding:17px 21px 19px;border-radius:0;pointer-events:auto;cursor:pointer;color:#352d25;text-align:center}',
 '#ch3StreetDialogue .ch3Speaker{position:absolute;width:1px;height:1px;padding:0;margin:-1px;'
 +'overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}',
 '#ch3StreetDialogue .ch3Words{font:17px/1.36 Georgia,serif;overflow-wrap:break-word;margin:0}',
 '#ch3StreetDialogue:focus-visible{outline:2px dashed #86745d;outline-offset:2px}',
 '@media(max-width:600px){#ch3StreetDialogue{padding:15px 19px 17px}#ch3StreetDialogue .ch3Words{font-size:16px}}'
].join('\n');
document.head.append(css);
let active=null,teaser=null,pendingHold=null,lineIndex=0,viewport=null,enteredAt=performance.now(),lastPhase=1,openedAt=0;
let teaserHiddenUntil=0,arrivalCandidate=null,arrivalAt=0,lastPlayer=null,lastMovedAt=0,lastCall=0;
let phase3FarmerX=2038;
const encounterCounts=new Map(),spokenRecently=new Map();
const NEAR=62,LEAVE=108,SPONTANEOUS_PAUSE=850,SPONTANEOUS_GAP=9000;
const talkPaused=Object.fromEntries(Object.keys(CAST).map(id=>[id,0]));
function step(){const state=window.UPPDRAG_CH3_PILOT?.state;return state?.complete?99:Math.max(0,state?.step||0);}
function phase(){const n=step();return n<3?1:n<7?2:3;}
function visible(region,id){
 const c=CAST[id];if(!region||!c||region.id!==c.region)return false;
 if(['rusBeach','rusNorth','noble'].includes(id))return step()>=9;
 return id==='farmers'||id==='soldiers'?phase()>=2:id==='david'?step()>=4:true;
}
function patrol(x0,x1,y,elapsed,duration,seed=0){
  // Walk with the body's actual direction, ease to a stop, turn, walk back.
  const cycle=(Math.max(0,elapsed)+seed)%(2*duration);
  const forward=cycle<duration;
  const f=(cycle%duration)/duration;
  const eased=(1-Math.cos(Math.PI*f))*.5;
  const x=forward?x0+(x1-x0)*eased:x1+(x0-x1)*eased;
  return {x,y,heading:forward?(x1>=x0?0:Math.PI):(x0>=x1?0:Math.PI),
    moving:!reduced?.matches&&Math.sin(Math.PI*f)>.12};
}
function marchProgress(elapsed){
 const cycle=6200,walk=4400,maxTravel=32600;
 const travelled=Math.floor(elapsed/cycle)*walk+Math.min(elapsed%cycle,walk);
 return {fraction:Math.min(1,travelled/maxTravel),
   moving:!reduced?.matches&&elapsed%cycle<walk&&travelled<maxTravel};
}
function position(actor,now=performance.now()){
 const cur=phase();
 if(cur!==lastPhase){
   if(lastPhase===2&&cur===3){
     const prior=Math.max(0,now-enteredAt-(talkPaused.farmers||0));
     phase3FarmerX=2448-410*marchProgress(prior).fraction;
   }else if(cur===2)phase3FarmerX=2038;
   enteredAt=now;lastPhase=cur;
   for(const id of Object.keys(talkPaused))talkPaused[id]=0;
 }
 if(active?.id===actor.id)return {...actor,x:active.x,y:active.y,moving:false};
 if(teaser?.id===actor.id)return {...actor,x:teaser.x,y:teaser.y,moving:false};
 if(pendingHold?.id===actor.id)return {...actor,x:pendingHold.x,y:pendingHold.y,moving:false};
 const t=Math.max(0,now-enteredAt-(talkPaused[actor.id]||0));
 if(actor.id==='cap')return {...actor,...patrol(555,666,709,t,6400,1100)};
 if(actor.id==='hat')return {...actor,...patrol(1594,1775,705,t,7800,3200)};
 if(actor.id==='soldiers')return {...actor,...patrol(1842,1957,706,t,6800,2100)};
 if(actor.id==='farmers'){
   // When the crowd shouts it stops moving. Marching and foot animation agree.
   const progress=marchProgress(t);
   const x=cur===2?2448-410*progress.fraction:Math.max(2038,phase3FarmerX-t*.009);
   const shouting=!reduced?.matches&&Math.sin(t/750)>.05;
   const moving=cur===2?progress.moving:!reduced?.matches&&x>2038;
   return {...actor,x,y:705+(shouting?Math.sin(t/620)*1.1:0),
     heading:Math.PI,moving,crowdShouting:shouting};
 }
 if(actor.id==='noble')return {...actor,...patrol(3368,3440,354,t,11000,2900)};
 if(actor.id==='rusBeach')return {...actor,...patrol(274,307,1062,t,7300,600)};
 if(actor.id==='rusNorth')return {...actor,...patrol(2415,2456,314,t,7800,2000)};
 if(actor.id==='david')return {...actor,x:actor.x,y:actor.y,moving:false};
 return {...actor,y:actor.y,moving:false};
}
function people(region){
 return Object.values(CAST).filter(a=>visible(region,a.id)).map(a=>position(a));
}
function ambientTargets(region){
 const walker=window.UPPDRAG_WORLD_LIFE?.quietPeople?.(region)||[];
 const ordinary=walker.map(p=>({...p,id:'civil:'+p.id,sourceId:p.id,role:'civil',
   region:region.id,name:p.name||'En stadsbo',r:29}));
 const dogs=region?.id==='main'?(window.UPPDRAG_WORLD_LIFE?.quietDogs?.(region)||[]):[];
 const animals=dogs.map((p,i)=>({...p,id:'dog:'+i,role:'dog',sourceId:i,
   region:region.id,name:'En hund',r:25,heading:p.facing<0?Math.PI:0,color:'#998268'}));
 return ordinary.concat(animals);
}
function talkingTargets(region){
 return people(region).concat(ambientTargets(region));
}
function find(region,id){
 if(CAST[id])return visible(region,id)?position(CAST[id]):null;
 return ambientTargets(region).find(a=>a.id===id)||null;
}
function hit(region,point){
 let nearest=null,distance=Infinity;
 if(!point||!region)return null;
 for(const a of talkingTargets(region)){
  const d=Math.hypot(a.x-point.x,a.y-point.y),radius=a.r||32;
  if(d<=radius&&d/radius<distance){nearest=a;distance=d/radius;}
 }
 return nearest;
}
function nearest(region,player,range=120){
 if(!region||!player)return null;
 return talkingTargets(region).map(a=>({...a,distance:Math.hypot(a.x-player.x,a.y-player.y)}))
  .filter(a=>a.distance<=range).sort((a,b)=>a.distance-b.distance)[0]||null;
}
const ponderings=new Map((window.UPPDRAG_LIVING_CONTENT?.ponderings||[]).map(entry=>[entry.id,entry.text]));
function humanThought(a){
 const options=(a.ponderings||[]).map(id=>{
   // Two old-demo thoughts belong to Gustav III's later era, not the 1740s.
   if(id==='tanke-kungen')return 'På torget bråkar folk om vem som ska bli nästa kung.';
   if(id==='tanke-maskerad')return 'Det sägs att kriget med Ryssland slutade illa. Vad händer nu?';
   return ponderings.get(id);
 }).filter(Boolean);
 const index=encounterCounts.get(a.sourceId)||0;
 return options.length?options[index%options.length]:a.introduction||'Det är oroligt i staden i dag.';
}
function story(actor){
 if(actor.role==='civil')return [['Du','Hej!'],[actor.name,humanThought(actor)]];
 if(actor.role==='dog')return [['Hunden','Voff!']];
 const n=step();
 if(actor.id==='cap')return n<4
   ?[['Mössan','Varför ska vi ha ännu ett krig? Det är ju bönderna som får betala.'],['Du','Vad vill ni mössor?'],['Mössan','Hellre fred än ännu ett misslyckat krig.']]
   :[['Mössan','David Hedenquist vägrade skjuta mot bönderna. Det var modigt.'],['Du','En del kallar honom feg.'],['Mössan','Inte jag. De har skickat honom till Marstrands fästning.']];
 if(actor.id==='hat')return n<4
   ?[['Hatten','Vi kan inte låta Ryssland tro att Sverige är svagt!'],['Du','Vill du ha krig?'],['Hatten','Vi vill ta tillbaka det som Sverige har förlorat.']]
   :[['Hatten','David Hedenquist? En soldat som vägrar lyda är en fegis.'],['Du','Han ville inte skjuta mot bönderna.'],['Hatten','Han vågade inte skjuta mot en bonde!'],
     ['Hatten','Hur ska han då kunna skjuta mot en ryss?']];
 if(actor.id==='farmers')return n>=7
   ?[['En bonde','På Norrmalm sköt soldaterna mot bönderna. Många kom inte hem.'],['Du','Ni ville att de skulle lyssna på er.'],['Bonden','Ja. Vi ville inte ha mer krig.']]
   :[['En bonde','Nog med krig! Nog med höga skatter!'],['Du','Varför har ni kommit till Stockholm?'],['Bonden','De som startade kriget måste ta ansvar!'],
     ['Bonden','Vi vill ha den danske kronprinsen Fredrik som tronföljare!']];
 if(actor.id==='soldiers')return n>=7
   ?[['En soldat','På Norrmalm sköts många bönder. Vi fick fruktansvärda order.'],['Du','Ville du möta dem?'],['Soldaten','Nej. Jag ville inte rikta mitt vapen mot svenska bönder.']]
   :[['En soldat','De säger att vi ska stoppa bönderna.'],['Du','Vill du det?'],['Soldaten','Jag vill hellre hem till gården, eller möta fienden. Inte våra egna.']];
 if(actor.id==='rusBeach')return [
   ['Rysk vakt','Halt! Är du dansk?'],
   ['Du','Nej, jag bor här i Sverige.'],
   ['Rysk vakt','Vi är här för att avskräcka danskarna.'],
   ['Rysk vakt','Inga danska soldater i det här lägret!']
 ];
 if(actor.id==='rusNorth')return [
   ['Rysk vakt','Stopp. Här ska vara lugnt och ordning!'],
   ['Du','Varför är era soldater här?'],
   ['Rysk vakt','Svenskarna bad om hjälp mot danskarna.'],
   ['Rysk vakt','Inget bråk här. Håll dig lugn, bonnläpp!']
 ];
 if(actor.id==='noble')return [
   ['En herre','Se så, nu börjar det åtminstone bli ordning i riket.'],
   ['Du','Tycker du om att de ryska soldaterna är här?'],
   ['Herren','Jag är lättad. Böndernas uppror skrämde mig.'],
   ['Herren','Det är skönt att ryssarna är här och håller ordning.']
 ];
 if(actor.id==='david')return [
   ['Du','Är du David Hedenquist?'],['David','Ja. Jag vägrade skjuta på bönderna i Stockholm.'],
   ['Du','En del kallar dig modig. Andra kallar dig feg.'],
   ['David','Jag kunde inte skjuta. Jag dömdes först till döden.'],
   ['David','Men straffet ändrades. Nu arbetar jag här på fästningen.']
 ];
 return [];
}
// Same speaker-anchored, cut-white-paper speech approach as living-dialogues.js.
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(Math.max(lo,hi),n));
const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))
 *Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
function screenPoint(pos){
 if(!viewport||!pos)return{x:0,y:0};
 const {camera,layout}=viewport;
 return{x:layout.w/2+(pos.x-camera.x)*layout.scale,
        y:layout.h/2+(pos.y-camera.y)*layout.scale};
}
function putSpeech(a,who){
 if(!viewport||!a)return;
 const {layout,player}=viewport;
 const target=who==='Du'&&player?player:find(viewport.region,a.id)||a;
 const anchor=screenPoint(target),playerHead=screenPoint(player||target);
 const npcHead=screenPoint(find(viewport.region,a.id)||a);
 const greeting=active?.mode==='greeting';
 const text=speech.textContent||'';
 const width=greeting?94:Math.min(layout.w-24,Math.max(123,Math.min(276,148+text.length*1.1)));
 box.style.width=width+'px';box.style.minHeight=greeting?'58px':'';
 root.hidden=false;
 const bounds=box.getBoundingClientRect(),height=Math.max(50,bounds.height);
 const minX=12,maxX=Math.max(minX,layout.w-width-12);
 const minY=9,maxY=Math.max(minY,layout.h-height-10);
 const bodies=[playerHead,npcHead].map(p=>({x:p.x-25,y:p.y-25,w:50,h:50}));
 const points=[
  {x:anchor.x-width*.5,y:Math.min(playerHead.y,npcHead.y)-height-28},
  {x:anchor.x+32,y:anchor.y-height*.5},
  {x:anchor.x-width-32,y:anchor.y-height*.5},
  {x:anchor.x-width*.5,y:Math.max(playerHead.y,npcHead.y)+27}
 ].concat([{x:minX,y:minY},{x:maxX,y:minY},{x:minX,y:maxY},{x:maxX,y:maxY}])
  .map(q=>({x:clamp(q.x,minX,maxX),y:clamp(q.y,minY,maxY),w:width,h:height}));
 for(const q of points)q.score=bodies.reduce((n,v)=>n+overlap(q,v)*26,0)
  +Math.hypot(q.x+width*.5-anchor.x,q.y+height*.7-anchor.y)*.23;
 points.sort((x,y)=>x.score-y.score);
 const best=points[0];
 box.style.left=best.x+'px';box.style.top=best.y+'px';
 const toward=who==='Du'?npcHead:playerHead,ang=Math.atan2(toward.y-anchor.y,toward.x-anchor.x);
 const tip={x:anchor.x+Math.cos(ang)*12*layout.scale,y:anchor.y+Math.sin(ang)*12*layout.scale};
 window.UPPDRAG_PAPER_DIALOGUES?.drawSpeech(tail,{box:best,tip,round:.69});
}
function hideBubble(){
 root.hidden=true;tail.replaceChildren();
}
function stopTeaser(now=performance.now()){
 if(!teaser)return;
 if(teaser.role==='civil')window.UPPDRAG_WORLD_LIFE?.release?.(teaser.sourceId);
 if(CAST[teaser.id])talkPaused[teaser.id]=(talkPaused[teaser.id]||0)+Math.max(0,now-teaser.shownAt);
 teaser=null;
 if(!active)hideBubble();
}
function releaseHold(){
 if(!pendingHold)return;
 if(pendingHold.role==='civil')window.UPPDRAG_WORLD_LIFE?.release?.(pendingHold.sourceId);
 pendingHold=null;
}
function hold(actor){
 if(!actor||!viewport?.region)return false;
 releaseHold();
 const candidate=find(viewport.region,actor.id);
 if(!candidate)return false;
 if(candidate.role==='civil')window.UPPDRAG_WORLD_LIFE?.freeze?.(candidate.sourceId);
 pendingHold={...candidate};
 return true;
}
function shortThought(actor){
 if(actor.role==='dog')return 'Voff!';
 if(actor.role==='farmer')return 'Ner med skatterna! Nog med krig!';
 if(actor.role==='soldier')return 'Jag vill inte skjuta mot bönderna!';
 const raw=actor.role==='civil'?humanThought(actor):
   (story(actor).find(line=>line[0]!=='Du')||[])[1]||'';
 const first=raw.match(/^.{1,85}?(?:[.!?](?=\s|$)|$)/)?.[0]||raw.slice(0,85);
 return first.length>85?first.slice(0,81)+'…':first;
}
function showLine(){
 if(!active)return false;
 const lines=active.lines;
 if(active.mode==='greeting'){
   speaker.textContent='Du';speech.textContent='Hej!';
 }else{
   if(lineIndex>=lines.length)return close();
   const [who,text]=lines[lineIndex];
   speaker.textContent=who;speech.textContent=text;
 }
 box.setAttribute('aria-label',speaker.textContent+': '+speech.textContent+'. Klicka för nästa replik.');
 root.hidden=false;putSpeech(active,speaker.textContent);
 box.focus({preventScroll:true});return true;
}
function open(actor){
 if(!actor||active||!viewport)return false;
 const real=find(viewport.region,actor.id);
 if(!real)return false;
 const now=performance.now();
 if(teaser)stopTeaser(now);
 let source=real;
 if(pendingHold?.id===real.id)source={...real,x:pendingHold.x,y:pendingHold.y};
 if(real.role==='civil'){
   const stopped=window.UPPDRAG_WORLD_LIFE?.freeze?.(real.sourceId);
   if(stopped)source={...real,x:stopped.x,y:stopped.y};
 }
 const sequence=story(source);
 if(!sequence.length)return false;
 const startWithPlayer=sequence[0][0]==='Du';
 active={...source,lines:sequence,mode:startWithPlayer?'lines':'greeting'};
 pendingHold=null;
 lineIndex=0;openedAt=now;arrivalCandidate=null;
 window.UPPDRAG_WORLD_KEYBOARD?.clear?.();
 if(!startWithPlayer&&source.role==='dog')active.mode='lines';
 return showLine();
}
function close(){
 const now=performance.now();
 if(!active)return false;
 const speakerActor=active;
 if(speakerActor.role==='civil'){
   window.UPPDRAG_WORLD_LIFE?.release?.(speakerActor.sourceId);
   encounterCounts.set(speakerActor.sourceId,(encounterCounts.get(speakerActor.sourceId)||0)+1);
 }else if(CAST[speakerActor.id]){
   talkPaused[speakerActor.id]=(talkPaused[speakerActor.id]||0)+Math.max(0,now-openedAt);
 }
 active=null;lineIndex=0;arrivalCandidate=null;teaserHiddenUntil=now+1700;
 lastCall=now;spokenRecently.set(speakerActor.id,now);
 hideBubble();return true;
}
function next(){
 if(!active)return false;
 if(active.mode==='greeting'){active.mode='lines';return showLine();}
 lineIndex++;return showLine();
}
function suspend(){
 if(active)close();
 stopTeaser();releaseHold();arrivalCandidate=null;hideBubble();
}
box.addEventListener('click',event=>{
 event.preventDefault();event.stopPropagation();
 if(active)next();
 else if(teaser&&viewport?.region)open(teaser);
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
 if(a.role==='hat'||a.role==='soldier'||a.role==='russian'||a.role==='noble'){
  paper(ctx,[[-7,-11],[9,-13],[22,-10],[25,-1],[21,10],[8,13],[-6,9]],a.role==='hat'?'#494237':a.role==='russian'?'#363c35':'#445d71');
  paper(ctx,[[1,-6],[17,-8],[21,0],[16,8],[1,7]],'#847258');
 }else{
  ctx.fillStyle=a.role==='cap'?'#556c59':'#715d4c';
  ctx.beginPath();ctx.ellipse(8,0,10,9,0,0,Math.PI*2);ctx.fill();
  if(a.role!=='david')paper(ctx,[[3,-8],[15,-8],[19,-3],[0,-3]],'#a28d6d');
 }
 if(a.role==='noble'){
   // Pudergrå, krullig peruk, tydligt olik hattarnas trekantiga hattar.
   ctx.fillStyle='#d6ceba';
   for(const [xx,yy] of [[-8,-10],[0,-14],[10,-14],[19,-8],[-10,1],[19,5],[-8,12],[15,12]]){
     ctx.beginPath();ctx.ellipse(xx+9,yy,6,5,0,0,Math.PI*2);ctx.fill();
   }
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
  // Ragged marching order: shouting gestures and paper staffs, not a solid block.
  const elapsed=Math.max(0,now-enteredAt);
  const figures=[[-52,-19,'#78694d',.91],[-89,16,'#92785b',.86],
    [32,24,'#766e57',.88],[-15,39,'#8a7054',.87]];
  for(let j=0;j<figures.length;j++){
    const [dx,dy,color,size]=figures[j];
    const excited=!reduced?.matches&&Math.sin(elapsed/540+j*1.8)>-.25;
    const shake=excited?Math.sin(elapsed/170+j)*3:0;
    const follower={...a,x:a.x+dx+shake,y:a.y+dy+(excited?Math.sin(elapsed/230+j)*2:0),
      heading:Math.PI+(excited?Math.sin(elapsed/530+j)*.24:0),
      color,moving:!!a.moving&&j%3!==1};
    drawFigure(ctx,follower,now,size);
    if(excited){
      const sx=follower.x+Math.cos(j*2)*8,sy=follower.y-10;
      paper(ctx,[[sx-1,sy-17],[sx+2,sy-17],[sx+5,sy+7],[sx+1,sy+8]],'#72563d');
    }
  }
  drawFigure(ctx,a,now);
  if(a.crowdShouting)paper(ctx,[[a.x-3,a.y-17],[a.x+1,a.y-17],[a.x+15,a.y+2],[a.x+11,a.y+5]],'#5e4c3b');
  return;
 }
 if(a.id==='soldiers'){
  drawFigure(ctx,{...a,x:a.x-26,y:a.y+20,color:'#687783',moving:a.moving},now,.94);
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
   const person=soldiers[i],patrol=!reduced?.matches&&(i===1||i===5);
   const swing=now/(1900+i*270)+i*2;
   const travel=patrol?Math.sin(swing)*23:0;
   const moving=patrol&&Math.abs(Math.cos(swing))>.13;
   const actor={
     id:camp.id+'-'+i,role:'russian',x:x+person.dx+travel,
     y:y+person.dy+(patrol?Math.cos(now/2300+i)*2:0),
     color:i%2?'#4c6248':'#53684d',heading:patrol?(Math.cos(swing)>=0?0:Math.PI):.18,
     moving
   };
   drawFigure(ctx,actor,now,person.size);
   // Red collar marks the uniform even at small map scale.
   paper(ctx,[[actor.x-8,actor.y-11],[actor.x+2,actor.y-11],
     [actor.x+6,actor.y-8],[actor.x-6,actor.y-6]],'#9a4e45');
 }
 paperTag(ctx,camp.label,x+2,y-69);
}
function updateNearby(region,player,now){
 if(!region||!player||active)return;
 if(lastPlayer){
   if(Math.hypot(player.x-lastPlayer.x,player.y-lastPlayer.y)>1.8)lastMovedAt=now;
 }else lastMovedAt=now;
 lastPlayer={x:player.x,y:player.y};
 if(teaser){
   const here=find(region,teaser.id);
   if(!here||now>=teaser.until||Math.hypot(player.x-here.x,player.y-here.y)>LEAVE)
     stopTeaser(now);
   else{root.hidden=false;putSpeech(teaser,teaser.who);return;}
 }
 if(now<teaserHiddenUntil||now-lastCall<SPONTANEOUS_GAP){hideBubble();return;}
 const wanted=nearest(region,player,NEAR);
 if(!wanted){arrivalCandidate=null;hideBubble();return;}
 if(now-(spokenRecently.get(wanted.id)||-Infinity)<27000){hideBubble();return;}
 if(arrivalCandidate?.id!==wanted.id){arrivalCandidate={id:wanted.id,at:now};return;}
 const d=Math.hypot(wanted.x-player.x,wanted.y-player.y);
 const waiting=now-arrivalCandidate.at>SPONTANEOUS_PAUSE&&now-lastMovedAt>360;
 const passing=d<37&&now-arrivalCandidate.at>480;
 const bark=wanted.role==='dog'&&d<57&&now-arrivalCandidate.at>220;
 if(!waiting&&!passing&&!bark)return;
 const text=shortThought(wanted);
 if(!text)return;
 let inPlace=wanted;
 if(wanted.role==='civil'){
   const stopped=window.UPPDRAG_WORLD_LIFE?.freeze?.(wanted.sourceId);
   if(stopped)inPlace={...wanted,x:stopped.x,y:stopped.y};
 }
 const who=wanted.role==='dog'?'Hund':wanted.role==='civil'?wanted.name
   :(story(wanted).find(line=>line[0]!=='Du')?.[0]||wanted.name);
 teaser={...inPlace,who,shownAt:now,until:now+(wanted.role==='dog'?1600:2400)};
 speaker.textContent=who;speech.textContent=text;
 box.setAttribute('aria-label',who+': '+text+'. Klicka för att prata vidare.');
 lastCall=now;spokenRecently.set(wanted.id,now);
 arrivalCandidate=null;root.hidden=false;putSpeech(teaser,who);
}
function obstacles(region){
 if(!region)return[];
 const scene=people(region).flatMap(a=>{
   if(a.id==='farmers')return [{id:a.id,x:a.x-30,y:a.y,radius:77},{id:a.id+'-line',x:a.x-58,y:a.y+14,radius:40}];
   if(a.id==='soldiers')return [{id:a.id,x:a.x+13,y:a.y+5,radius:62}];
   return[{id:a.id,x:a.x,y:a.y,radius:36}];
 });
 if(region.id==='main'){
   for(const camp of stationedCamps(region)){
     scene.push({id:'tent-'+camp.id,x:camp.x,y:camp.y,radius:67});
   }
 }
 return scene;
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
 if(active){
   // As in the earliest demo, the player's little "Hej!" is only a brief beat,
   // not a separate click or a reading task.
   if(active.mode==='greeting'&&now-openedAt>=850){
     active.mode='lines';showLine();
   }else{root.hidden=false;putSpeech(active,speaker.textContent);}
 }else updateNearby(region,player,now);
 // Protests are expressed by group behaviour and spontaneous paper speech.
}
window.UPPDRAG_CH3_CITY_LIFE={people,find,hit,nearest,open,close,suspend,next,draw,phase,stationedCamps,hold,releaseHold,
 obstacles,get active(){return !!active},get teaser(){return teaser?.id||null},get actor(){return active?.id||null},
 get lines(){return active?.lines||[]},get talkers(){return viewport?.region?talkingTargets(viewport.region):[]}};
})();