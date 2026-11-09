/* The same map, movement loop, paper dog and people as the rest of the city.
 * Caught: lose one apple. Recovery: the existing, complete Rut drill only. */
(function(){
'use strict';
const chapter=Number(window.__INTEGRATED_CHAPTER),stage=document.getElementById('stage');
if(![3,4,5].includes(chapter)||!stage||window.UPPDRAG_APPLE_THREATS)return;
const teacher=new URLSearchParams(window.__UPPDRAG_QUERY||location.search).get('preview')==='1';
const key='uppdrag1700.apple-threats.v1',pilot=()=>window['UPPDRAG_CH'+chapter+'_PILOT'];
let store;try{store=JSON.parse(localStorage.getItem(key));}catch{}
if(!store||store.v!==1||!store.chapters||typeof store.chapters!=='object'||Array.isArray(store.chapters))store={v:1,chapters:{}};
// A fresh fourth chapter introduces its new guard before the familiar dog.
if(chapter===4&&store.chapters[4]&&!store.chapters[4].encounters&&!store.chapters[4].history?.length)store.chapters[4].nextKind='guard';
let currentWorld=null,noticeUntil=0,noticeOutcome='',lastNow=0,inRoom=true,anchorCheckAt=0;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),treeCache=new WeakMap(),entranceCache=new WeakMap();
const clear=(a,b)=>!!currentWorld&&!!window.UPPDRAG_WORLD_KEYBOARD?.clearSegment?.(currentWorld,a,b,12);
const route=(a,b)=>window.UPPDRAG_EVENT_APPROACH.routeBetween(currentWorld,a,b,id=>navigationPoint(currentWorld,id),clear);
const trees=()=>{
 if(!currentWorld)return [];
 if(!treeCache.has(currentWorld))treeCache.set(currentWorld,(window.UPPDRAG_PAPER?.getTrees?.(currentWorld)||[]).filter(t=>clear({x:t.x+12,y:t.y},{x:t.x+12,y:t.y})));
 return treeCache.get(currentWorld);
};
function dogHomes(){
 if(!entranceCache.has(currentWorld)){
  const homes=[];
  for(const building of currentWorld.buildings){
   if(building.name==='Arkivet')continue;
   const entry=navigationPoint(currentWorld,window.UPPDRAG_STORY_WORLD?.entryFor?.(currentWorld,building)||building.entry);
   const door=entry&&window.UPPDRAG_TOWN_LAYOUT?.door?.(building,entry);if(!door)continue;
   const center=building.paperPose?{x:building.paperPose.cx,y:building.paperPose.cy}:{x:building.x+building.w/2,y:building.y+building.h/2};
   const dx=door.x-center.x,dy=door.y-center.y,length=Math.hypot(dx,dy)||1;
   for(const offset of [30,48,70]){
    const home={x:door.x+dx/length*offset,y:door.y+dy/length*offset,id:'door-'+building.entry};
    if(clear(home,home)){homes.push(home);break;}
   }
  }
  entranceCache.set(currentWorld,homes);
 }
 return [...trees().map(t=>({x:t.x+12,y:t.y,id:t.id})),...entranceCache.get(currentWorld)];
}
const notice=document.createElement('section');notice.id='appleThreatNotice';notice.hidden=true;notice.setAttribute('aria-label','På gatan');
const live=document.createElement('div');live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');notice.append(live);
const rut=document.createElement('button');rut.type='button';rut.textContent='Till Rut i Arkivet';rut.hidden=true;rut.onclick=()=>pilot()?.goArchive?.();notice.append(rut);stage.append(notice);
const style=document.createElement('style');style.textContent=`
#appleThreatNotice{position:absolute;right:10px;bottom:12px;z-index:28;box-sizing:border-box;width:min(310px,calc(100% - 24px));padding:11px 14px;border:1px solid #9b835c;border-radius:8px;background:#fff8e9ed;color:#352b20;font:14px/1.4 system-ui;pointer-events:none}
#appleThreatNotice strong{display:block;font:600 17px Georgia;margin-bottom:4px}#appleThreatNotice button{pointer-events:auto;min-height:44px;margin-top:8px;padding:8px 12px;background:#e1eadb;color:#352b20;border:1px solid #708468;border-radius:6px;font:14px system-ui;cursor:pointer}#appleThreatNotice button:focus-visible{outline:3px solid #286472;outline-offset:2px}
#appleThreatNotice[hidden]{display:none!important}@media(max-width:480px){#appleThreatNotice{font-size:13px;right:8px;bottom:8px;width:min(280px,calc(100% - 16px))}}
`;document.head.append(style);
function message(kind,outcome){
 noticeOutcome=outcome;noticeUntil=lastNow+(outcome==='lost-apple'?12000:outcome==='recovered'?5500:6000);
 const text=outcome==='lost-apple'?['Mitt äpple!','Öva en hel omgång hos Rut i Arkivet för att få ett nytt.']:outcome==='recovered'?['Ett nytt äpple',(kind==='orchard'?'Du klarade minnesfrågan vid Herrgården.':'Du har repeterat hos Rut.')+' Nu får du en lugn sträcka genom staden.']:outcome==='warning'||outcome==='active'?
  kind==='dog'?['Hunden nosar efter äpplet','Håll avstånd. Ett hus, ett samtal eller ett träd kan ge skydd.']:['En tjuv vaktar passagen','”Lämna hit påsen!” Håll avstånd, välj en annan väg eller sök skydd hos någon.']:
  ['Du kom undan',kind==='dog'?'Hunden gav upp. Du har äpplet kvar.':'Tjuven lämnade dig i fred. Du har äpplet kvar.'];
 live.replaceChildren();const title=document.createElement('strong');title.textContent=text[0];live.append(title,document.createTextNode(text[1]));rut.hidden=outcome!=='lost-apple';
}
const model=window.UPPDRAG_APPLE_THREAT_MODEL.create(store.chapters[chapter],{
 kinds:chapter===3?['dog']:chapter===4?['guard','dog']:['dog','guard'],
 save(value){store.chapters[chapter]=value;try{localStorage.setItem(key,JSON.stringify(store));}catch{}},
 loseApple(){const p=pilot();if(teacher||!p?.state||p.state.apples<1)return false;p.state.apples--;p.persist();p.refresh?.();return true;},
 event(kind,outcome){if(outcome!=='no-apple'&&outcome!=='left')message(kind,outcome);}
});
function anchor(kind,p,previous){
 if(lastNow<anchorCheckAt)return null;anchorCheckAt=lastNow+600;
 const dx=p.x-previous.x,dy=p.y-previous.y,travel=Math.hypot(dx,dy)||1;
 const archive=currentWorld.buildings.find(b=>b.name==='Arkivet');
 const door=archive&&navigationPoint(currentWorld,window.UPPDRAG_STORY_WORLD?.entryFor?.(currentWorld,archive)||archive.entry);
 const forward=q=>((q.x-p.x)*dx+(q.y-p.y)*dy)/travel;
 const chosen=typeof path!=='undefined'&&Array.isArray(path)&&path.length;
 const planned=chosen?[p,...path]:[p,{x:p.x+dx/travel*700,y:p.y+dy/travel*700}];
 const plannedLength=planned.slice(1).reduce((sum,q,i)=>sum+distance(planned[i],q),0);
 const maxAhead=chosen?Math.min(560,Math.max(0,plannedLength-50)):560,minAhead=maxAhead<440?Math.max(180,maxAhead*.65):440;
 const plannedPosts=[];let covered=0;
 for(let i=1;i<planned.length&&covered<maxAhead;i++){
  const a=planned[i-1],b=planned[i],len=distance(a,b);if(len<.01)continue;
  for(const at of [minAhead,(minAhead+maxAhead)/2,maxAhead])if(at>=covered&&at<=covered+len&&maxAhead>=minAhead){const t=(at-covered)/len;plannedPosts.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});}
  covered+=len;
 }
 function aheadOnRoute(q){
  let travelled=0,best=null;
  for(let i=1;i<planned.length&&travelled<900;i++){
   const a=planned[i-1],b=planned[i],vx=b.x-a.x,vy=b.y-a.y,len=Math.hypot(vx,vy);if(len<.01)continue;
   const t=Math.max(0,Math.min(1,((q.x-a.x)*vx+(q.y-a.y)*vy)/(len*len))),off=Math.hypot(q.x-a.x-vx*t,q.y-a.y-vy*t),along=travelled+t*len;
   if(off<=35&&along>=minAhead-.01&&along<=maxAhead+.01&&(!best||off<best.off))best={off,along};travelled+=len;
  }
  return best;
 }
 const candidates=[];
 for(const home of dogHomes()){
  const gap=distance(home,p);
  if(kind==='dog'?(gap<125||gap>330||forward(home)<70):(gap<200||gap>700))continue;
  if(kind==='dog'){
   if(door&&distance(home,door)<140)continue;
   const out={x:home.x+(p.x-home.x)/gap*22,y:home.y+(p.y-home.y)/gap*22},post=clear(home,out)?out:{x:home.x,y:home.y};
   if(route(home,p)?.length)candidates.push({home,post,score:distance(home,p)});
  }else{
   const posts=[...plannedPosts];
   for(const edge of currentWorld.edges){
    const a=navigationPoint(currentWorld,edge.a),b=navigationPoint(currentWorld,edge.b),vx=b.x-a.x,vy=b.y-a.y,len=vx*vx+vy*vy||1;
    const t=Math.max(.08,Math.min(.92,((home.x-a.x)*vx+(home.y-a.y)*vy)/len));posts.push({x:a.x+t*vx,y:a.y+t*vy});
   }
   for(const post of posts){
   const ahead=aheadOnRoute(post);
   // Stay on the actual selected route, inside the visible part of the street.
   // A normal walker still has the full two-second warning before contact.
   if(!ahead||distance(home,post)>220||distance(p,post)<160||distance(p,post)>600||door&&distance(post,door)<190)continue;
   const onRoad=currentWorld.edges.some(edge=>{const a=navigationPoint(currentWorld,edge.a),b=navigationPoint(currentWorld,edge.b),vx=b.x-a.x,vy=b.y-a.y,len=vx*vx+vy*vy||1,t=Math.max(0,Math.min(1,((post.x-a.x)*vx+(post.y-a.y)*vy)/len));return Math.hypot(post.x-a.x-vx*t,post.y-a.y-vy*t)<=20;});
   if(!onRoad)continue;
   const arrival=clear(post,post)&&route(home,post);if(!arrival?.length)continue;
   let length=0,previous=home;for(const next of arrival){length+=distance(previous,next);previous=next;}
   if(length<=220&&route(post,p)?.length)candidates.push({home,post,score:ahead.along+length});
   }
  }
 }
 candidates.sort((a,b)=>a.score-b.score);return candidates[0]||null;
}
function socialShelter(){
 const city=window['UPPDRAG_CH'+chapter+'_CITY_LIFE'];
 if(city?.active)return true;
 if(window.UPPDRAG_LIVING_DIALOGUES?.active)return true;
 return !!window.UPPDRAG_EVENT_ENGINE?.conversation;
}
function tick(now,{region,player,activeRoom=null}={}){
 if(!region||!player)return;lastNow=now;currentWorld=region;inRoom=activeRoom!==null;
 const p=pilot(),other=window.UPPDRAG_EVENT_ENGINE;
 const talking=socialShelter();
 const paused=!!window.UPPDRAG_MENU_OPEN?.()||!!document.querySelector('dialog[open],#ch1Modal:not([hidden]),#meetingDialogue:not([hidden])')||document.body.classList.contains('ch1-open')||!!p?.studyBusy||!!window.UPPDRAG_STORY_WORK?.busy;
 const travelling=(typeof sailing!=='undefined'&&!!sailing)||(typeof voyage!=='undefined'&&!!voyage);
 const ordinaryThief=other?.approach?.point;
 model.tick(now,player,{region:region.id,hidden:document.hidden,paused:teacher||paused,
  shelter:inRoom||travelling?'house':talking?'conversation':'',otherThreat:!!other?.busy||!!ordinaryThief||!!window.UPPDRAG_ORCHARD?.busy,
  apples:p?.state.apples||0,known:!!p?.repetitionTaskIds?.length,
  completedRound:p?.state.recallRutRewarded?p.state.archiveRounds||0:0,anchor,route,clear,
  bonusClaimed:window.UPPDRAG_ORCHARD?.claimed===true,
  canSee(a,b,home){return clear(a,b)&&!window.UPPDRAG_EVENT_APPROACH.blockedByCover(a,b,trees().filter(t=>!(t.id===home.id&&distance(a,home)<40)));}
 });
 const a=model.snapshot().active,show=!teacher&&!inRoom&&!talking&&!paused&&!document.hidden&&(!!a||now<noticeUntil);
 notice.hidden=!show;
 if(!a&&now>=noticeUntil)noticeOutcome='';
}
function draw(ctx,{region,now=0}={}){
 const a=model.snapshot().active;if(!a||region?.id!=='main')return;
 const paint=()=>{
  if(a.kind==='dog')window.UPPDRAG_WORLD_LIFE.drawAppleDog?.(ctx,{...a.point,facing:Math.cos(a.point.heading)<0?-1:1},now,region);
  else window.UPPDRAG_MEETINGS.drawMapPerson(ctx,{...a.point,animationTime:now},{name:'En tjuv',role:'passerby',color:'#784e43'},now);
  if(a.kind==='dog'){
   ctx.save();ctx.translate(a.point.x,a.point.y);ctx.scale(Math.cos(a.point.heading)<0?-1:1,1);ctx.fillStyle='#a44836';ctx.beginPath();ctx.moveTo(7,-7);ctx.lineTo(14,-5);ctx.lineTo(10,4);ctx.closePath();ctx.fill();ctx.restore();
  }
  if(['warning','guarding','following'].includes(a.phase)){
   ctx.save();ctx.translate(a.point.x,a.point.y-(a.kind==='dog'?29:35));ctx.fillStyle='#fff0c4';ctx.strokeStyle='#874b32';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,8,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#7a3224';ctx.font='bold 13px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('!',0,1);ctx.restore();
  }
  if(a.phase==='retreat'&&noticeOutcome==='lost-apple'){
   ctx.save();const facing=Math.cos(a.point.heading)<0?-1:1;ctx.translate(a.point.x+(a.kind==='dog'?24*facing:13),a.point.y+(a.kind==='dog'?-3:3));ctx.fillStyle='#a44d36';ctx.strokeStyle='#5a3c28';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
  }
 };
 if(!window.UPPDRAG_SCENE_PRESENCE?.enqueue(ctx,a.point.y,paint,'apple-'+a.kind))paint();
}
const life=window.UPPDRAG_WORLD_LIFE,oldTick=life.tick,oldDraw=life.draw;
life.tick=function(now,config){const result=oldTick.apply(this,arguments);tick(now,config);return result;};
life.draw=function(ctx,config){const result=oldDraw.apply(this,arguments);draw(ctx,config);return result;};
window.UPPDRAG_APPLE_THREATS={get busy(){return model.busy;},get suppressesPickpocket(){const s=model.snapshot().state;return model.suppressesPickpocket||!teacher&&pilot()?.state.apples>0&&!!pilot()?.repetitionTaskIds?.length&&!s.seenKinds.includes(s.nextKind);},get point(){return model.snapshot().active?.point||null;},get snapshot(){return model.snapshot();},
 people(r){const a=model.snapshot().active;return r?.id==='main'&&a?[{...a.point,id:'apple-'+a.kind,role:a.kind==='dog'?'dog':'passerby',radius:12,solid:false}]:[];},
 journalHTML(){return '<p><b>Äpplet på gatan:</b> '+(chapter===3?'Hunden kan':'Hunden och tjuven vid passagen kan')+' ta ett äpple. '+(pilot()?.state.apples>0?'Första mötet kan komma efter en kort promenad i huvudstaden. Håll avstånd eller sök skydd.':'Du behöver ha ett äpple i fickan. Öva en hel omgång hos Rut i Arkivet för att få ett.')+' Rut kan alltid ge ett nytt äpple efter en hel repetitionsomgång. Vid Herrgården finns också en bonuschans per kapitel.</p>';}
};
})();
