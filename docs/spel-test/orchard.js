/* A physical garden detour in the existing paper city and animation loop. */
(function(){
'use strict';
function source(name,text){
 if(!/^world-keyboard(?:-ch\d+)?\.js$/.test(name))return text;
 const edit=(a,b)=>{if(text.split(a).length!==2)throw Error('Äppelträdet: ankaret matchar inte '+name);text=text.replace(a,b);};
 edit('  function activeDialogue(){\n    return !!(', '  function activeDialogue(){\n    return !!(window.UPPDRAG_ORCHARD?.blocking||');
 edit('  function interact(){','  function interact(){\n    if(window.UPPDRAG_ORCHARD?.blocking)return false;\n    if(window.UPPDRAG_ORCHARD?.interact())return true;');return text;
}
// Reuse the question bank's reviewed alternatives. The seven short chapter-5
// review facts have no alternatives in the writing exercise, so supply them here.
const EXTRA_CHOICES={
 'material5-sos-gustav-iii':['Gustav III','Karl XII','Gustav II Adolf'],
 'material5-sos-1772':['1772','1771','1809'],
 'material5-sos-1771':['1771','1772','1792'],
 'material5-sos-upplysning':['Upplysningen','Frihetstiden','Industrialismen'],
 'material5-sos-religionsfrihet':['Religionsfrihet','Tryckfrihet','Censur'],
 'material5-sos-tortyr':['Tortyr','Folkbokföring','Tryckfrihet'],
 'material5-sos-judar-katoliker':['Judar och katoliker','Protestanter och ortodoxa','Judar och muslimer']
};
const norm=v=>String(v??'').normalize('NFC').trim().toLocaleLowerCase('sv');
function choicesFor(t){
 const f=t?.fields?.[0],options=[...new Set((f?.options||EXTRA_CHOICES[t?.id]||[]).filter(v=>typeof v==='string'&&v.trim()).map(v=>v.trim()))];
 const answers=new Set((f?.answers||[]).map(norm));
 return options.length===3&&options.filter(v=>answers.has(norm(v))).length===1?options:null;
}
const api={source,choicesFor};window.UPPDRAG_ORCHARD=api;
const chapter=Number(window.__INTEGRATED_CHAPTER),stage=typeof document==='undefined'?null:document.getElementById('stage');
if(!stage||![1,2,3,4,5].includes(chapter))return;
const teacher=new URLSearchParams(window.__UPPDRAG_QUERY||location.search).get('preview')==='1',KEY='uppdrag1700.orchard.v1';
let store;try{store=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}
if(!store||store.v!==1||!store.chapters||typeof store.chapters!=='object'||Array.isArray(store.chapters))store={v:1,chapters:{}};
const pilot=()=>window['UPPDRAG_CH'+chapter+'_PILOT'],world=()=>typeof region==='undefined'?null:region,playerPoint=()=>typeof player==='undefined'?null:player;
const gap=(a,b)=>a&&b?Math.hypot(a.x-b.x,a.y-b.y):Infinity;
const clear=(r,a,b,radius=12)=>!!window.UPPDRAG_WORLD_KEYBOARD?.clearSegment?.(r,a,b,radius);
const route=(r,a,b,radius=12)=>window.UPPDRAG_EVENT_APPROACH.routeBetween(r,a,b,id=>navigationPoint(r,id),(p,q)=>clear(r,p,q,radius));
const cache=new WeakMap();let matrix=null,pendingRoute=null,task=null,answerChoices=[],noticeUntil=0,lastNow=0,previousNotice='',feedback='';
function geometry(r=world()){
 if(r?.id!=='main')return null;if(cache.has(r))return cache.get(r);
 const entry=navigationPoint(r,'manor'),trees=window.UPPDRAG_PAPER?.getTrees(r)||[];let found=null;
 // The existing pasture is x=3157..3426, y=439..608. Keep the whole
 // apple tree north of its fence, on the estate side of the manor road.
 for(const [dx,dy] of [[-200,-90],[-250,-90],[-230,-115]]){
  const tree={x:entry.x+dx,y:entry.y+dy},pick={x:tree.x-33,y:tree.y+22},home={x:entry.x+8,y:entry.y+50};
  const patrol=[{x:entry.x-80,y:entry.y+50},{x:entry.x-290,y:entry.y+50},{x:entry.x-290,y:entry.y+10},{x:entry.x-100,y:entry.y+10},home];
  if(tree.y+64>=entry.y-24||!clear(r,pick,pick,24)||!clear(r,home,home,18)||!clear(r,tree,tree,40)||!route(r,home,pick)?.length||patrol.some((p,i)=>!clear(r,patrol[(i+patrol.length-1)%patrol.length],p,18)))continue;
  const covers=trees.filter(t=>gap(t,tree)>=120&&gap(t,tree)<=430).sort((a,b)=>gap(a,tree)-gap(b,tree));
  for(const cover of covers){
   const d=gap(cover,home),safe={x:cover.x+(cover.x-home.x)/d*58,y:cover.y+(cover.y-home.y)/d*58,radius:38};
   if(safe.y<90||safe.y>r.h-90||gap(safe,pick)<170||gap(safe,pick)>450||!clear(r,safe,safe,24)||!route(r,pick,safe,24)?.length||!window.UPPDRAG_EVENT_APPROACH.blockedByCover(home,safe,[cover]))continue;
   found={tree,pick,home,patrol,safe,cover,trees};break;
  }if(found)break;
 }
 cache.set(r,found);return found;
}
const outside=()=>world()?.id==='main'&&!interior&&!sailing&&!voyage;
const otherBusy=()=>!!(window.UPPDRAG_MENU_OPEN?.()||pilot()?.studyBusy||window.UPPDRAG_MEETINGS?.state?.talking||window.UPPDRAG_LIVING_DIALOGUES?.active||window['UPPDRAG_CH'+chapter+'_CITY_LIFE']?.active||window.UPPDRAG_STORY_WORK?.busy||window.UPPDRAG_EVENT_ENGINE?.busy||window.UPPDRAG_EVENT_ENGINE?.approach?.point||window.UPPDRAG_APPLE_THREATS?.point||window.UPPDRAG_HAT_SHOP?.busy||document.querySelector('dialog[open]:not(#orchardQuestion),#ch1Modal:not([hidden])'));
function pool(){const ids=new Set(pilot()?.repetitionTaskIds||[]);return (window.UPPDRAG_RECALL_BANK||[]).filter(t=>ids.has(t.id)&&t.chapter<=chapter&&t.rank===0&&t.kind==='fields'&&t.fields?.length===1&&choicesFor(t));}
function notify(text){previousNotice=text;noticeUntil=lastNow+6500;}
const model=window.UPPDRAG_ORCHARD_MODEL.create(store.chapters[chapter],{
 save(s){store.chapters[chapter]=s;try{localStorage.setItem(KEY,JSON.stringify(store));}catch{}},
 awardApple(){const p=pilot();if(teacher||!p?.state||p.state.apples!==0)return false;p.state.apples=1;p.persist();p.refresh?.();return p.state.apples===1;},
 practice(id){const p=pilot(),bank=window.UPPDRAG_RECALL_BANK,t=bank.find(t=>t.id===id);if(!p||!t)return;
  const ids=(p.state.recallRutFocus||[]).filter(x=>bank.some(t=>t.id===x));
  if(!ids.some(id=>{const other=bank.find(t=>t.id===id);return other.chapter===t.chapter&&other.topic===t.topic;}))p.state.recallRutFocus=[id,...ids];p.persist();
 },
 event(outcome){const text={warning:'”Hallå där! Låt mina äpplen vara!” Spring och göm dig bakom träden.',chasing:'Adelsmannen följer efter dig. Bryt sikten bakom trädet eller gå in i ett hus.',caught:'Du blev upphunnen och fick lämna tillbaka äpplet. Du kan försöka igen.', 'returned-apple':'Äpplet är tillbaka vid herrgården.',left:'Du lämnade äpplet vid herrgården.',escaped:'Du kom undan! Nu väntar en kort minnesfråga.',earned:'Du har ett äpple i fickan! När du har använt det kan du komma tillbaka och busa igen.',practice:'Öva på frågan hos Rut. Du kan försöka igen senare.',full:'Du har redan ett äpple. Kom tillbaka när fickan är tom.',cancelled:'Du lämnade äpplet vid herrgården.'}[outcome];if(text)notify(text);}
});
const style=document.createElement('style');style.textContent=`
#orchardNotice{position:absolute;left:10px;bottom:12px;z-index:28;max-width:min(370px,calc(100% - 20px));padding:12px 15px;background:#fff6e4ed;color:#382f25;border:1px solid #9b835c;border-radius:9px;font:14px/1.45 system-ui}#orchardNotice strong{display:block;font:600 18px Georgia;margin-bottom:5px}
#orchardQuestion{width:min(570px,calc(100% - 24px));max-height:88dvh;overflow:auto;padding:24px;border:1px solid #967f5b;border-radius:12px;background:#fff7e9;color:#382f25;font:16px/1.5 system-ui}#orchardQuestion::backdrop{background:#28251b80}#orchardQuestion h2{font:600 27px Georgia;margin:0 0 12px}#orchardQuestion button{min-height:44px;padding:10px 15px;margin:13px 7px 0 0;background:#436b5c;color:white;border:1px solid #436b5c;border-radius:6px;font:16px system-ui;cursor:pointer}#orchardQuestion button.secondary{background:#fffaf0;color:#382f25}#orchardQuestion :focus-visible{outline:3px solid #286472;outline-offset:2px}#orchardQuestion .orchard-note{font-size:14px;color:#665b49}#orchardQuestion .orchard-choices{display:grid;gap:10px;margin:16px 0}#orchardQuestion .orchard-choices button{width:100%;margin:0;text-align:left;white-space:normal;overflow-wrap:anywhere;background:#fffaf0;color:#382f25;border-color:#9b835c}
`;document.head.append(style);
const notice=document.createElement('section');notice.id='orchardNotice';notice.hidden=true;notice.setAttribute('aria-label','Äppelträdet vid herrgården');
const title=document.createElement('strong'),copy=document.createElement('div');title.textContent='Äppelträdet';notice.append(title,copy);stage.append(notice);
const dialog=document.createElement('dialog');dialog.id='orchardQuestion';dialog.setAttribute('aria-labelledby','orchardTitle');document.body.append(dialog);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function stop(cancelKeys=true){if(cancelKeys)window.UPPDRAG_WORLD_KEYBOARD?.clear();path=[];pendingRoute=null;if(typeof cancelPersonArrival==='function')cancelPersonArrival();if(typeof pendingRoom!=='undefined')pendingRoom=null;}
function pick(){
 const g=geometry();if(!outside()||teacher||otherBusy()||!g||gap(playerPoint(),g.tree)>76||!clear(world(),playerPoint(),g.pick))return false;
 const s=model.snapshot();
 if(pilot().state.apples>0){notify('Du har redan ett äpple. Använd det innan du plockar ett nytt.');return true;}
 const tasks=pool().filter(t=>t.id!==s.state.lastTaskId),choices=tasks.length?tasks:pool();
 if(!choices.length){notify('Börja med en fråga i kapitlet. Här får du sedan repetera något du redan har mött.');return true;}
 // The owner's patrol changes the viewing angle. Keep the hiding place on
 // the far side of the real cover from his current, visible position.
 const owner=s.actor||g.home,d=gap(g.cover,owner),safe={x:g.cover.x+(g.cover.x-owner.x)/d*58,y:g.cover.y+(g.cover.y-owner.y)/d*58,radius:38};
 if(clear(world(),safe,safe,24)&&route(world(),playerPoint(),safe,24)?.length)g.safe=safe;
 task=choices[Math.floor(Math.random()*choices.length)];
 if(!model.begin(playerPoint(),g.home,task.id)){notify(s.retreat?'Vänta tills adelsmannen har gått tillbaka.':'Vänta '+Math.max(1,Math.ceil(s.state.cooldownMs/1000))+' sekunder innan du försöker igen.');return true;}
 answerChoices=choicesFor(task);
 for(let i=answerChoices.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[answerChoices[i],answerChoices[j]]=[answerChoices[j],answerChoices[i]];}
 stop(false);document.getElementById('world')?.focus?.({preventScroll:true});return true;
}
function travel(){
 if(!outside()||teacher||model.busy||otherBusy())return false;const g=geometry();if(!g)return false;
 if(pilot().state.apples>0){notify('Du har redan ett äpple. Använd det innan du plockar ett nytt.');return false;}
 if(!pool().length){notify('Börja med en fråga i minnesboken. Här får du sedan repetera sådant du redan har mött.');return false;}
 const next=route(world(),playerPoint(),g.pick,24);if(!next?.length)return false;
 stop();if(typeof pending!=='undefined')pending=null;if(typeof returnPending!=='undefined')returnPending=false;if(typeof pendingStreetChat!=='undefined')pendingStreetChat=null;
 window['UPPDRAG_CH'+chapter+'_CITY_LIFE']?.releaseHold?.();path=next;pendingRoute=next;follow=true;document.getElementById('world')?.focus?.({preventScroll:true});setMessage('Äppelträdet vid herrgården','Gå fram till trädet och tryck mellanslag för att plocka. Akta dig för herrgårdens ägare!');return true;
}
function hide(){
 if(!outside()||otherBusy()||!['warning','chasing'].includes(model.snapshot().phase))return false;
 const g=geometry(),next=g&&route(world(),playerPoint(),g.safe,24);if(!next?.length)return false;
 stop();path=next;follow=true;setMessage('Skydd bakom trädet','Du springer till gömstället.');return true;
}
function close(){if(dialog.open)dialog.close();model.close();feedback='';document.getElementById('world')?.focus?.({preventScroll:true});}
function openQuestion(){
 if(dialog.open||!task||otherBusy()||document.hidden)return;stop();feedback='';
 dialog.innerHTML='<h2 id="orchardTitle">Du kom undan!</h2><p>Välj rätt svar för att få behålla äpplet.</p><p><strong>'+esc(task.prompt)+'</strong></p><div class="orchard-choices">'+answerChoices.map((value,index)=>'<button type="button" data-orchard-answer="'+index+'">'+esc(value)+'</button>').join('')+'</div><p class="orchard-note">Du har mött frågan tidigare. Klicka på ett av de tre alternativen.</p><button type="button" class="secondary" data-orchard-close>Lämna äpplet</button>';
 dialog.showModal();dialog.querySelector('button')?.focus({preventScroll:true});
}
function answer(index){
 if(model.snapshot().phase!=='question'||!task||!Number.isInteger(index)||index<0||index>=answerChoices.length)return;
 const field=task.fields[0],value=answerChoices[index],known=field.answers.some(v=>norm(v)===norm(value));
 const result=model.submit(known,value),success=result.ok;feedback=result.reason;
 dialog.innerHTML='<h2 id="orchardTitle">'+(success?'Ett äpple!':known?'Du har redan ett äpple':'Öva lite till')+'</h2><p>'+(success?'Rätt! Du får behålla äpplet. Det finns nu i din ficka.':known?'Du får ha ett äpple åt gången här. Kom tillbaka när fickan är tom.':'Inte riktigt. Rätt svar är <strong>'+esc(answerChoices.find(v=>field.answers.some(a=>norm(a)===norm(v))))+'</strong>. Öva på frågan hos Rut och försök igen senare.')+'</p><p class="orchard-note">'+(success?'Du kan busa igen när fickan är tom. Vänta minst 20 sekunder och låt adelsmannen gå tillbaka. Varje nytt äpple kräver en ny jakt och en minnesfråga.':'Inget äpple har lagts till. Du kan försöka igen senare.')+'</p><button type="button" data-orchard-close>Till spelet</button>';
 dialog.querySelector('button')?.focus({preventScroll:true});
}
dialog.addEventListener('click',event=>{if(event.target.closest('[data-orchard-close]')){close();return;}const selected=event.target.closest('[data-orchard-answer]');if(selected)answer(Number(selected.dataset.orchardAnswer));});dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
function tick(now,cfg){
 lastNow=now;const g=geometry(cfg.region);if(!g){if(model.busy)model.cancel();notice.hidden=true;return;}
 const inRoom=!!cfg.activeRoom,city=window['UPPDRAG_CH'+chapter+'_CITY_LIFE'];
 const social=!!(window.UPPDRAG_LIVING_DIALOGUES?.active||city?.active||window.UPPDRAG_EVENT_ENGINE?.conversation);
 const ownerListening=city?.teaser==='orchard-noble';
 const paused=teacher||inRoom||social||ownerListening||!!window.UPPDRAG_MENU_OPEN?.()||document.hidden||dialog.open||!!pilot()?.studyBusy||!!document.querySelector('dialog[open]:not(#orchardQuestion),#ch1Modal:not([hidden])');
 model.tick(now,cfg.player,{region:cfg.region.id,home:g.home,patrol:g.patrol,hidden:document.hidden,paused,shelter:inRoom||social,
  route:(a,b)=>route(cfg.region,a,b),clear:(a,b)=>clear(cfg.region,a,b),inSafe:gap(cfg.player,g.safe)<=g.safe.radius,
  canSee:(a,b)=>clear(cfg.region,a,b)&&!window.UPPDRAG_EVENT_APPROACH.blockedByCover(a,b,g.trees)
 });
 const s=model.snapshot();if(s.phase==='question'&&!dialog.open)openQuestion();
 if(pendingRoute&&path!==pendingRoute)pendingRoute=null;
 if(pendingRoute&&!path.length){pendingRoute=null;notify('Tryck mellanslag för att plocka. Spring sedan undan och göm dig!');}
 const near=outside()&&gap(cfg.player,g.tree)<76;
 notice.hidden=teacher||inRoom||dialog.open||otherBusy()||!(s.carrying||near||now<noticeUntil);
 if(!notice.hidden)copy.textContent=s.carrying?previousNotice:now<noticeUntil?previousNotice:pilot().state.apples?'Du har redan ett äpple.':s.retreat?'Vänta tills adelsmannen har gått tillbaka.':s.state.cooldownMs>0?'Vänta '+Math.ceil(s.state.cooldownMs/1000)+' sekunder innan du plockar igen.':'Mellanslag: plocka ett äpple. Spring sedan undan och göm dig! Du får en minnesfråga när du kommit undan.';
}
function ellipse(ctx,x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function draw(ctx,{region,now=0}){
 const g=geometry(region);if(!g||teacher)return;matrix=ctx.getTransform();const s=model.snapshot();
 const tree=()=>{window.UPPDRAG_PAPER?.drawTree?.(ctx,region,{treeX:g.tree.x,treeY:g.tree.y+12});for(const [dx,dy] of [[-15,-15],[13,-20],[2,0]]){ellipse(ctx,g.tree.x+dx,g.tree.y+dy,4.5,4,'#a94d36');ctx.fillStyle='#655333';ctx.fillRect(g.tree.x+dx,g.tree.y+dy-6,1,3);}};
 if(!window.UPPDRAG_SCENE_PRESENCE?.enqueue(ctx,g.tree.y,tree,'orchard-tree'))tree();
 ctx.save();ctx.font='600 12px Georgia';ctx.textAlign='center';ctx.fillStyle='#fbf0d8';ctx.fillRect(g.tree.x-37,g.tree.y+42,74,20);ctx.fillStyle='#4b3b29';ctx.fillText('Äppelträd',g.tree.x,g.tree.y+56);ctx.restore();
 if(['warning','chasing'].includes(s.phase)){
  ctx.save();ctx.strokeStyle='#476f51';ctx.fillStyle='#e3ead94a';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();ctx.ellipse(g.safe.x,g.safe.y,g.safe.radius,g.safe.radius*.65,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);ctx.font='600 13px Georgia';ctx.textAlign='center';ctx.fillStyle='#37533c';ctx.fillText('Skydd bakom trädet',g.safe.x,g.safe.y+g.safe.radius+16);ctx.restore();
 }
 const a=s.actor||{...g.home,heading:Math.atan2(g.tree.y-g.home.y,g.tree.x-g.home.x)};
 window.UPPDRAG_MEETINGS.drawMapPerson(ctx,a,{id:'orchard-noble',name:'Herrgårdens ägare',color:'#7d4e55',woman:false},now);
 const crop=()=>{ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.heading||0);ctx.strokeStyle='#6b4b32';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-5,-11);ctx.lineTo(s.phase==='chasing'?20:10,-19);ctx.stroke();ctx.restore();};
 if(!window.UPPDRAG_SCENE_PRESENCE?.enqueue(ctx,a.y,crop,'orchard-crop'))crop();
 if(s.carrying){const p=playerPoint(),fruit=()=>{ellipse(ctx,p.x+16,p.y+9,4,4,'#ab4f36');};if(!window.UPPDRAG_SCENE_PRESENCE?.enqueue(ctx,p.y+1,fruit,'orchard-carried-apple'))fruit();}
}
const life=window.UPPDRAG_WORLD_LIFE,oldTick=life.tick,oldDraw=life.draw;
life.tick=function(now,cfg){const ret=oldTick.apply(this,arguments);tick(now,cfg);return ret;};
life.draw=function(ctx,cfg){const ret=oldDraw.apply(this,arguments);draw(ctx,cfg);return ret;};
const engine=window.UPPDRAG_EVENT_ENGINE,people=engine.people;
engine.people=function(r){const g=geometry(r),a=model.snapshot().actor;return [...people.call(this,r),...(g?[{...(a||g.home),id:'orchard-noble',radius:12,solid:!model.busy}]:[])];};
engine.register({id:'orchard-apple',type:'sidequest',region:'main',chapters:[1,2,3,4,5],usesRetrieval:true,repeatable:true});
const canvas=document.getElementById('world');let hitDown=null;
function hit(event){if(!matrix||!outside())return null;const rect=canvas.getBoundingClientRect(),m=matrix,x=(event.clientX-rect.left)*canvas.width/rect.width,y=(event.clientY-rect.top)*canvas.height/rect.height,d=m.a*m.d-m.b*m.c;
 const p={x:(m.d*(x-m.e)-m.c*(y-m.f))/d,y:(-m.b*(x-m.e)+m.a*(y-m.f))/d},g=geometry();
 if(['warning','chasing'].includes(model.snapshot().phase))return gap(p,g?.safe)<55||gap(p,g?.cover)<42?'hide':null;
 return !model.busy&&gap(p,g?.tree)<45?'pick':null;
}
canvas.addEventListener('pointerdown',event=>{const kind=hit(event);if(otherBusy()||!kind)return;hitDown={kind,x:event.clientX,y:event.clientY};event.preventDefault();event.stopImmediatePropagation();},true);
canvas.addEventListener('pointerup',event=>{if(!hitDown)return;const from=hitDown;hitDown=null;event.preventDefault();event.stopImmediatePropagation();if(gap(from,{x:event.clientX,y:event.clientY})<10&&hit(event)===from.kind){if(from.kind==='hide')hide();else if(gap(playerPoint(),geometry().tree)<76)pick();else travel();}},true);
Object.defineProperties(api,{busy:{get:()=>model.busy},blocking:{get:()=>dialog.open},claimed:{get:()=>model.snapshot().state.claimed},harvests:{get:()=>model.snapshot().state.harvests},snapshot:{get:()=>model.snapshot()}});
Object.assign(api,{geometry,travel,pick,hide,interact:()=>outside()&&!model.busy&&gap(playerPoint(),geometry()?.tree)<76?pick():false,
 journalHTML:()=>'<p><b>Äppelträdet vid herrgården:</b> '+(!pool().length?'Börja med frågorna i minnesboken. Sedan kan du få äpplen genom jakt och minnesfrågor om sådant du redan har mött.':'Du kan busa flera gånger när fickan är tom! Kom undan herrgårdens ägare och svara på en känd minnesfråga för varje äpple. Vänta minst 20 sekunder mellan lyckade försök och låt honom gå tillbaka.')+'</p>'});
})();
