/* The same map, movement loop, paper dog and people as the rest of the city.
 * Caught: lose one apple. Recovery: the existing, complete Rut drill only. */
(function(){
'use strict';
const chapter=Number(window.__INTEGRATED_CHAPTER),stage=document.getElementById('stage');
if(![1,2,3,4,5].includes(chapter)||!stage||window.UPPDRAG_APPLE_THREATS)return;
const teacher=new URLSearchParams(window.__UPPDRAG_QUERY||location.search).get('preview')==='1';
const key='uppdrag1700.apple-threats.v1',pilot=()=>window['UPPDRAG_CH'+chapter+'_PILOT'];
let store;try{store=JSON.parse(localStorage.getItem(key));}catch{}
if(!store||store.v!==1||!store.chapters||typeof store.chapters!=='object'||Array.isArray(store.chapters))store={v:1,chapters:{}};
let currentWorld=null,noticeUntil=0,noticeOutcome='',lastNow=0,inRoom=true,anchorCheckAt=0;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),treeCache=new WeakMap();
const clear=(a,b)=>!!currentWorld&&!!window.UPPDRAG_WORLD_KEYBOARD?.clearSegment?.(currentWorld,a,b,12);
const route=(a,b)=>window.UPPDRAG_EVENT_APPROACH.routeBetween(currentWorld,a,b,id=>navigationPoint(currentWorld,id),clear);
const trees=()=>{
 if(!currentWorld)return [];
 if(!treeCache.has(currentWorld))treeCache.set(currentWorld,(window.UPPDRAG_PAPER?.getTrees?.(currentWorld)||[]).filter(t=>clear({x:t.x+12,y:t.y},{x:t.x+12,y:t.y})));
 return treeCache.get(currentWorld);
};
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
 const text=outcome==='lost-apple'?['Mitt äpple!','Öva en hel omgång hos Rut i Arkivet för att få ett nytt.']:outcome==='recovered'?['Ett nytt äpple','Du har repeterat hos Rut. Nu får du en lugn sträcka genom staden.']:outcome==='warning'||outcome==='active'?
  kind==='dog'?['Hunden nosar efter äpplet','Håll avstånd. Ett hus, ett samtal eller ett träd kan ge skydd.']:['En tjuv vaktar passagen','”Lämna hit påsen!” Håll avstånd, välj en annan väg eller sök skydd hos någon.']:
  ['Du kom undan',kind==='dog'?'Hunden gav upp. Du har äpplet kvar.':'Tjuven lämnade dig i fred. Du har äpplet kvar.'];
 live.replaceChildren();const title=document.createElement('strong');title.textContent=text[0];live.append(title,document.createTextNode(text[1]));rut.hidden=outcome!=='lost-apple';
}
const model=window.UPPDRAG_APPLE_THREAT_MODEL.create(store.chapters[chapter],{
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
 const candidates=[];
 for(const tree of trees()){
  const home={x:tree.x+12,y:tree.y,id:tree.id};
  if(distance(home,p)<125||distance(home,p)>330||forward(home)<70)continue;
  if(kind==='dog'){
   const post={x:home.x+dx/travel*22,y:home.y+dy/travel*22};
   if(clear(home,post)&&route(home,p)?.length)candidates.push({home,post,score:distance(home,p)});
  }else for(const edge of currentWorld.edges){
   const a=navigationPoint(currentWorld,edge.a),b=navigationPoint(currentWorld,edge.b),vx=b.x-a.x,vy=b.y-a.y,len=vx*vx+vy*vy||1;
   const t=Math.max(.08,Math.min(.92,((home.x-a.x)*vx+(home.y-a.y)*vy)/len)),post={x:a.x+t*vx,y:a.y+t*vy};
   if(distance(home,post)>140||distance(p,post)<125||distance(p,post)>300||forward(post)<85||door&&distance(post,door)<190)continue;
   if(clear(post,post)&&route(home,post)?.length&&route(post,p)?.length)candidates.push({home,post,score:distance(post,p)+distance(home,post)});
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
 model.tick(now,player,{region:region.id,hidden:document.hidden,paused:teacher||(!inRoom&&!talking&&paused),
  shelter:inRoom||travelling?'house':talking?'conversation':'',otherThreat:!!other?.busy||!!ordinaryThief,
  apples:p?.state.apples||0,known:!!p?.repetitionTaskIds?.length,
  completedRound:p?.state.recallRutRewarded?p.state.archiveRounds||0:0,anchor,route,clear,
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
  if(a.phase==='retreat'&&noticeOutcome==='lost-apple'){
   ctx.save();const facing=Math.cos(a.point.heading)<0?-1:1;ctx.translate(a.point.x+(a.kind==='dog'?24*facing:13),a.point.y+(a.kind==='dog'?-3:3));ctx.fillStyle='#a44d36';ctx.strokeStyle='#5a3c28';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
  }
 };
 if(!window.UPPDRAG_SCENE_PRESENCE?.enqueue(ctx,a.point.y,paint,'apple-'+a.kind))paint();
}
const life=window.UPPDRAG_WORLD_LIFE,oldTick=life.tick,oldDraw=life.draw;
life.tick=function(now,config){const result=oldTick.apply(this,arguments);tick(now,config);return result;};
life.draw=function(ctx,config){const result=oldDraw.apply(this,arguments);draw(ctx,config);return result;};
window.UPPDRAG_APPLE_THREATS={get busy(){return model.busy;},get suppressesPickpocket(){return model.suppressesPickpocket;},get point(){return model.snapshot().active?.point||null;},get snapshot(){return model.snapshot();},
 people(r){const a=model.snapshot().active;return r?.id==='main'&&a?[{...a.point,id:'apple-'+a.kind,role:a.kind==='dog'?'dog':'passerby',radius:12,solid:false}]:[];},
 journalHTML(){return '<p><b>Äpplet på gatan:</b> Hunden och tjuven vid passagen kan ta ett äpple. Håll avstånd eller sök skydd. Ett nytt äpple tjänar du genom en hel repetitionsomgång hos Rut i Arkivet.</p>';}
};
})();
