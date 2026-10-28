/* Uppdrag 1700 – side-adventure engine v1.6.0.
 * Single world-loop integration. Optional scenes, not knowledge assessment.
 * The per-chapter save is separate from the original pilot and recall saves.
 * The definitions below also reserve hooks for future chapters 9 and 10.
 */
(function(){
'use strict';
const chapter=Number(window.__INTEGRATED_CHAPTER||((document.title.match(/Kapitel\s+(\d+)/i)||[])[1]))||0;
if(!chapter||chapter>10||!document.getElementById('stage'))return;
const teacher=new URLSearchParams(window.__UPPDRAG_QUERY||location.search).get('preview')==='1';
const saveKey='uppdrag1700.side-adventures.v1';
const scenery={
  1:{wagon:'Hjulet sitter fast! Kan du hjälpa mig loss? Papperet måste till tryckeriet.'},
  2:{wagon:'Hjulet sitter fast! Brödet och veden måste fram till barnhuset. Kan du hjälpa mig loss?'},
  3:{wagon:'Hjulet sitter fast! Jag vill komma härifrån innan bråket når oss. Kan du hjälpa mig loss?'},
  4:{wagon:'Hjulet sitter fast! Jag kör forskarnas instrument, och glaset får inte gå sönder. Kan du hjälpa mig?'},
  5:{wagon:'Hjulet sitter fast! De nytryckta bladen måste fram, men lasten är för tung. Kan du hjälpa mig?'},
  6:{wagon:'Hjulet sitter fast! Jag måste få fram säckarna från byn. Kan du hjälpa mig loss?'},
  7:{wagon:'Hjulet sitter fast! Handelsbreven måste fram till herrgården. Kan du hjälpa mig loss?'},
  8:{wagon:'Hjulet sitter fast! Teatern väntar på materialet till operan. Kan du hjälpa mig loss?'},
  9:{wagon:'Hjulet sitter fast! Posten från öster måste fram. Kan du hjälpa mig loss?'},
  10:{wagon:'Hjulet sitter fast! Föremålen till utställningen måste fram oskadda. Kan du hjälpa mig?'}
};
const catalog=new Map();
const wagonAt={x:3040,y:367,region:'main'}; // On the ruralJ1–ruralJ2 road, before the manor.
const smithAt={x:2710,y:705,region:'main'}; // Workshops, already on an accessible road.
const witnessAt={x:1075,y:713,region:'main'}; // A passerby on the market square.
const stage=document.getElementById('stage'),canvas=document.getElementById('world');
const raw=(()=>{try{return JSON.parse(localStorage.getItem(saveKey)||'null');}catch{return null;}})();
const store=raw&&raw.v===1&&typeof raw.chapters==='object'&&!Array.isArray(raw.chapters)?raw:{v:1,chapters:{}};
const state=store.chapters[chapter]&&typeof store.chapters[chapter]==='object'?store.chapters[chapter]:{};
if(!['unseen','inspected','need-smith','advice','cleared','deferred'].includes(state.wagon))state.wagon='unseen';
if(!['unseen','chasing','won','lost','ignored'].includes(state.thief))state.thief='unseen';
// A reload ends a chase without taking another coin; the witness remains available.
if(state.thief==='chasing')state.thief=state.stolenDaler?'lost':'ignored';
state.stolenDaler=!!state.stolenDaler;
if(!Array.isArray(state.history))state.history=[];
state.distance=Math.max(0,Math.min(100000,Number(state.distance)||0));
 // A per-chapter encounter window, saved so reloading cannot reroll the thief.
 if(!Number.isFinite(Number(state.thiefDistance))||Number(state.thiefDistance)<580||Number(state.thiefDistance)>1800)state.thiefDistance=620+Math.floor(Math.random()*950);
state.wagonSeen=!!state.wagonSeen;
state.thiefSeen=!!state.thiefSeen;
state.wagonShoulder=!!state.wagonShoulder;
if(!['unseen','cold','recovered','heard'].includes(state.witness))state.witness='unseen';
store.chapters[chapter]=state;
let scene=null,blocking=false,last=null,thiefPoint=null,matrix=null,lastRegion=null,atRoom=false,activeWorld=null,chaseFollowing=false,lastRouteAt=0,lastTickAt=null,calloutLeft=0;
 const approach=window.UPPDRAG_EVENT_APPROACH.create();
 let speaker='wagon',lineSpeaker='',lastSpeechSignature='',turns=[],turnIndex=0,turnChoices=[],activeChallenge=null;
const allowed=(kind)=>{
  if(kind==='wagon')return chapter>=1&&chapter<=10;
  if(kind==='thief')return chapter!==6&&![3,8].includes(chapter); // ch6 has a pre-existing thief; no double penalties.
  return false;
};
const save=()=>{state.history=state.history.slice(-35);try{localStorage.setItem(saveKey,JSON.stringify(store));}catch{}updateJournalLabel();};
const record=(kind,value)=>{state.history.push({kind,value,at:new Date().toISOString()});save();};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getPilot=()=>window['UPPDRAG_CH'+chapter+'_PILOT'];
function wallet(){const p=getPilot();return Number.isFinite(Number(p?.state?.daler))?Math.max(0,Number(p.state.daler)):0;}
function loseDaler(){if(teacher)return false;const p=getPilot();if(!p?.state||wallet()<1)return false;
 p.state.daler=wallet()-1;
 try{if(typeof p.persist==='function')p.persist();else if(p.saveKey)localStorage.setItem(p.saveKey,JSON.stringify(p.state));p.refresh?.();}catch{}
 const label=document.querySelector('#ch1Hud .ch1Wallet');if(label&&label.textContent.includes('daler'))label.textContent=label.textContent.replace(/\d+(?=\s*daler)/,String(p.state.daler));
 return true;
}
function returnDaler(){if(teacher)return false;const p=getPilot();if(!p?.state)return false;
 p.state.daler=wallet()+1;
 try{if(typeof p.persist==='function')p.persist();else if(p.saveKey)localStorage.setItem(p.saveKey,JSON.stringify(p.state));p.refresh?.();}catch{}
 const label=document.querySelector('#ch1Hud .ch1Wallet');if(label&&label.textContent.includes('daler'))label.textContent=label.textContent.replace(/\d+(?=\s*daler)/,String(p.state.daler));
 return true;
}
function candidates(){const known=chapter===1?new Set(getPilot()?.repetitionTaskIds||[]):null;return (window.UPPDRAG_RECALL_BANK||[]).filter(t=>(!known||known.has(t.id))&&t.chapter<=chapter&&t.chapter>=1&&t.rank===0&&t.fields?.length===1&&t.fields[0].options?.length>=3&&t.fields[0].answers?.length);
}
function question(seed){const all=candidates();if(!all.length)return null;
 const t=all[(seed*31+chapter*7)%all.length],f=t.fields[0];
 const norm=s=>String(s).toLocaleLowerCase('sv').replace(/[.!,\s]+/g,' ').trim();
 const answer=f.options.find(o=>f.answers.some(a=>norm(a)===norm(o)))||null;
 if(!answer)return null;
 const offset=seed%f.options.length;
 return{prompt:t.prompt,answer,choices:f.options.map((_,i)=>f.options[(i+offset)%f.options.length])};
}
const style=document.createElement('style');style.textContent=`
#adventureCallout{position:absolute;z-index:39;max-width:240px;padding:14px 20px;font:600 18px/1.3 Georgia;color:#352a20;pointer-events:none}#adventureCalloutTail{position:absolute;inset:0;width:100%;height:100%;z-index:38;pointer-events:none}#adventureChase{position:absolute;left:12px;bottom:12px;z-index:30;min-height:44px;padding:10px 15px;background:#fff8e9;color:#352a20;border:1px solid #8f795b;font:16px Georgia;cursor:pointer}body[data-adventure-chase] #message,body:has(#adventureDialog[open]) #message{display:none}
#adventureJournal{position:absolute;left:10px;top:10px;z-index:27;min-height:42px;border:1px solid #826e52;border-radius:7px;background:#fff7e7ed;color:#3c2e25;font:600 13px system-ui;padding:8px 11px;cursor:pointer}
#adventureDialog{box-sizing:border-box;width:min(620px,calc(100% - 24px));max-height:85dvh;overflow:auto;padding:21px;border:2px solid #8f7752;border-radius:12px;background:#fbf3e4;color:#352a20;font:17px/1.5 Georgia,serif}
 #adventureDialog::backdrop{background:#211b14a8}
 #adventureTail{position:absolute;inset:0;width:100%;height:100%;z-index:38;pointer-events:none;overflow:visible}
 #adventureDialog.ad-event-speech{position:absolute;z-index:39;left:8px;top:8px;margin:0;max-width:calc(100% - 16px);max-height:calc(100% - 16px);width:350px;overflow:auto;box-sizing:border-box;padding:19px 23px 21px;border:0;border-radius:0;background:transparent;box-shadow:none;color:#332b23;font:16px/1.38 Georgia,serif}
 #adventureDialog.ad-event-speech h2{font:600 18px/1.2 Georgia,serif;margin:0 0 8px}
 #adventureDialog.ad-event-speech .ad-speaker{font:600 13px/1.3 system-ui;color:#60513b;letter-spacing:.02em;margin-bottom:3px}
 #adventureDialog.ad-event-speech p{margin:8px 0}
 #adventureDialog.ad-event-speech .ad-actions{margin:12px 0 0;gap:6px}
 #adventureDialog.ad-event-speech .ad-actions button{flex:1 1 120px;font-size:14px;padding:8px 9px;min-height:42px}
 #adventureDialog.ad-event-speech .ad-choices button{font-size:14px;padding:7px 9px}
 #adventureDialog.ad-event-speech .ad-illustration{display:none}
 #adventureDialog.ad-event-speech::before,#adventureDialog.ad-event-speech::after{display:none!important;content:none!important}
 #adventureDialog.ad-event-speech .ad-note{font-size:12px;padding:3px 0}
 @media(max-width:480px){#adventureDialog.ad-event-speech{padding:16px 20px 19px;font-size:15px}#adventureDialog.ad-event-speech h2{font-size:17px}}
 @media(forced-colors:active){#adventureDialog.ad-event-speech{background:Canvas;border:1px solid CanvasText}#adventureTail{display:none}}
#adventureDialog h2{font:600 28px/1.15 Georgia,serif;margin:0 0 13px}
#adventureDialog p{margin:10px 0}
#adventureDialog .ad-actions{display:flex;flex-wrap:wrap;gap:9px;margin:18px 0 5px}
#adventureDialog button{min-height:44px;font:16px/1.3 system-ui;border:1px solid #8f795b;border-radius:6px;background:#e5e8d8;color:#312b24;padding:9px 12px;cursor:pointer;flex:1 1 160px;text-align:left}
#adventureDialog button.secondary{background:#fff9ed}
#adventureDialog button:focus-visible,#adventureJournal:focus-visible{outline:3px solid #266879;outline-offset:2px}
#adventureDialog .ad-note{font:14px/1.45 system-ui;color:#615444;padding:7px 0}
#adventureDialog .ad-history{padding:9px 12px;border-left:3px solid #887253;background:#f0e5d0}
#adventureDialog .ad-choices{display:grid;gap:8px;margin-top:15px}
#adventureDialog .ad-choices button{width:100%}
#adventureDialog .ad-illustration{height:92px;border-block:1px solid #b9a889;margin:12px 0;background:linear-gradient(#e6dcc8 0 63%,#baa88c 63%);position:relative;overflow:hidden}
#adventureDialog .ad-illustration .ad-cart{position:absolute;left:43%;bottom:10px;width:96px;height:37px;background:#866546;border:4px solid #4a382c;transform:skew(-7deg)}
#adventureDialog .ad-illustration .ad-cart:before,.ad-illustration .ad-cart:after{content:'';position:absolute;bottom:-18px;width:25px;height:25px;border-radius:50%;border:5px solid #4b392b;background:#c4a87e}
#adventureDialog .ad-illustration .ad-cart:before{left:8px}#adventureDialog .ad-illustration .ad-cart:after{right:8px}
body.ch1-open #adventureJournal,body[data-conversation] #adventureJournal{display:none}
@media(max-width:480px){#adventureJournal{top:6px;left:6px;padding:7px 9px;font-size:12px}#adventureDialog{padding:15px;font-size:16px}#adventureDialog h2{font-size:23px}}
`;document.head.append(style);
const journal=document.createElement('button');journal.type='button';journal.id='adventureJournal';journal.setAttribute('aria-label','Öppna sidoäventyr och händelser');stage.append(journal);
const dialog=document.createElement('dialog');dialog.id='adventureDialog';dialog.setAttribute('aria-label','Sidoäventyr');stage.append(dialog);
 const tail=document.createElementNS('http://www.w3.org/2000/svg','svg');tail.id='adventureTail';tail.setAttribute('aria-hidden','true');tail.hidden=true;stage.append(tail);
 const callout=document.createElement('div');callout.id='adventureCallout';callout.hidden=true;callout.setAttribute('role','status');callout.setAttribute('aria-live','polite');stage.append(callout);
 const calloutTail=document.createElementNS('http://www.w3.org/2000/svg','svg');calloutTail.id='adventureCalloutTail';calloutTail.setAttribute('aria-hidden','true');calloutTail.hidden=true;stage.append(calloutTail);
 const chaseButton=document.createElement('button');chaseButton.id='adventureChase';chaseButton.textContent='Spring efter tjuven';chaseButton.hidden=true;chaseButton.addEventListener('click',()=>{chaseFollowing=true;followThief(performance.now(),true);});stage.append(chaseButton);
 function shout(text){callout.textContent=text;calloutLeft=2400;callout.hidden=false;positionCallout();}
 function positionCallout(){
  if(callout.hidden||!matrix||!last||!canvas)return;
  const sr=stage.getBoundingClientRect(),cr=canvas.getBoundingClientRect();
  const anchor={x:cr.left-sr.left+(matrix.a*last.x+matrix.c*last.y+matrix.e)*cr.width/canvas.width,y:cr.top-sr.top+(matrix.b*last.x+matrix.d*last.y+matrix.f)*cr.height/canvas.height-12};
  const r=callout.getBoundingClientRect(),box={x:Math.max(8,Math.min(sr.width-r.width-8,anchor.x-r.width/2)),y:Math.max(8,Math.min(sr.height-r.height-8,anchor.y-r.height-26)),w:r.width,h:r.height};
  callout.style.left=box.x+'px';callout.style.top=box.y+'px';calloutTail.hidden=false;
  window.UPPDRAG_PAPER_DIALOGUES?.drawSpeech?.(calloutTail,{box,tip:anchor});
 }
 function followThief(now,force=false){
  if(!chaseFollowing||state.thief!=='chasing'||!thiefPoint||!activeWorld||(!force&&now-lastRouteAt<250))return;
  lastRouteAt=now;
  const edge=activeWorld.edges.map(edge=>({edge,p:roadProjection(thiefPoint,edge)})).sort((a,b)=>Math.hypot(a.p.x-thiefPoint.x,a.p.y-thiefPoint.y)-Math.hypot(b.p.x-thiefPoint.x,b.p.y-thiefPoint.y))[0];
  const next=edge&&routeAlongRoads(thiefPoint,edge.edge);
  if(next){cancelPersonArrival();pendingRoom=null;pending=null;returnPending=false;path=next;follow=true;}
 }
 document.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Escape'].includes(e.key))chaseFollowing=false;},true);
 function wagonPosition(){return {x:wagonAt.x,y:wagonAt.y-((state.wagon==='cleared'||state.wagonShoulder)?90:0)};}
 function driverPosition(){const p=wagonPosition();return {x:p.x+70,y:p.y+30};}
 function worldAnchor(){
   const self=/^Du$|^Berättaren$/i.test(lineSpeaker);
   const p=self?(last||wagonAt):speaker==='smith'?smithAt:speaker==='witness'?witnessAt:speaker==='thief'?(thiefPoint||last||witnessAt):driverPosition();
   return {x:p.x,y:p.y-12};
 }
 function positionSpeech(){
   if(!dialog.open||!dialog.classList.contains('ad-event-speech'))return;
   const sr=stage.getBoundingClientRect(),cr=canvas?.getBoundingClientRect();
   if(!sr.width||!sr.height)return;
   const p=worldAnchor();let anchor={x:sr.width*.52,y:sr.height*.52};
   if(cr?.width&&cr?.height&&canvas.width&&canvas.height&&matrix){
     const px=matrix.a*p.x+matrix.c*p.y+matrix.e,py=matrix.b*p.x+matrix.d*p.y+matrix.f;
     anchor={x:cr.left-sr.left+px*cr.width/canvas.width,y:cr.top-sr.top+py*cr.height/canvas.height};
   }
   // In the teacher's manual demo the character may be off screen. Use the
   // visible player as fallback rather than drawing a tail across the whole town.
   if(anchor.x<20||anchor.y<20||anchor.x>sr.width-20||anchor.y>sr.height-20){
     const fallback=last||{x:1200,y:700};
     if(cr?.width&&cr?.height&&canvas.width&&canvas.height&&matrix){
       const x=matrix.a*fallback.x+matrix.c*fallback.y+matrix.e,y=matrix.b*fallback.x+matrix.d*fallback.y+matrix.f;
       anchor={x:cr.left-sr.left+x*cr.width/canvas.width,y:cr.top-sr.top+y*cr.height/canvas.height};
     }
     if(anchor.x<20||anchor.y<20||anchor.x>sr.width-20||anchor.y>sr.height-20)anchor={x:sr.width*.55,y:sr.height*.57};
   }
   const width=Math.min(sr.width-16,Math.max(230,Math.min(365,sr.width*.85)));
   dialog.style.width=width+'px';dialog.style.maxHeight=Math.max(90,sr.height-16)+'px';
   const height=Math.min(sr.height-16,dialog.getBoundingClientRect().height),minX=8,minY=8;
   const clamp=(v,lo,hi)=>Math.max(lo,Math.min(Math.max(lo,hi),v));
   const options=[
     {x:anchor.x-width/2,y:anchor.y-height-30},
     {x:anchor.x+30,y:anchor.y-height/2},
     {x:anchor.x-width-30,y:anchor.y-height/2},
     {x:anchor.x-width/2,y:anchor.y+30}
   ].map(o=>({x:clamp(o.x,minX,sr.width-width-8),y:clamp(o.y,minY,sr.height-height-8),w:width,h:height}));
   options.sort((a,b)=>Math.hypot(a.x+a.w/2-anchor.x,a.y+a.h/2-anchor.y)-Math.hypot(b.x+b.w/2-anchor.x,b.y+b.h/2-anchor.y));
   const box=options[0],signature=[box.x,box.y,box.w,box.h,anchor.x,anchor.y].map(x=>Math.round(x)).join(':');
   if(signature===lastSpeechSignature)return;
   lastSpeechSignature=signature;
   dialog.style.left=box.x+'px';dialog.style.top=box.y+'px';tail.hidden=false;
   if(!window.UPPDRAG_PAPER_DIALOGUES?.drawSpeech?.(tail,{box,tip:anchor})){
     dialog.style.background='#fff9ec';dialog.style.border='1px solid #8f7752';
   }
 }
 new ResizeObserver(()=>{lastSpeechSignature='';positionSpeech();}).observe(stage);
 
const actions=(items)=>'<div class="ad-actions">'+items.map(([code,label,second])=>`<button type="button" data-adventure="${code}"${second?' class="secondary"':''}>${esc(label)}</button>`).join('')+'</div>';
 // A speech bubble shows just one utterance at a time. Supplementary notes and
 // answer alternatives stay attached to their preceding utterance.
 function splitSpeech(html){
   const container=document.createElement('div');container.innerHTML=html;
   const lines=[];
   for(const element of Array.from(container.children)){
     if(element.classList.contains('ad-illustration'))continue; // Wagon is already visible in the world.
     if(element.classList.contains('ad-note'))continue;
     if(element.classList.contains('ad-choices')){
       if(lines.length)lines[lines.length-1]+=element.outerHTML;
       else lines.push(element.outerHTML);
     }else lines.push(element.outerHTML);
   }
   return lines.length?lines:['<p>Vi får tala om saken igen.</p>'];
 }
 function renderTurn(){
   const html=turns[turnIndex]||'';
   const label=({wagon:'Kusken',smith:'Smeden',thief:'Ficktjuven',witness:'Barnet vid torget'}[speaker]||'En invånare');
   const first=html.match(/<p[^>]*>\s*<b>([^<>]+):<\/b>/i);
   const who=first?first[1]:speaker==='thief'?'Berättaren':label;lineSpeaker=who;
   const text=first?html.replace(/(<p[^>]*>)\s*<b>[^<>]+:<\/b>\s*/, '$1'):html;
   const controls=turnIndex<turns.length-1?[['next','Fortsätt']]:turnChoices;
   dialog.innerHTML='<div class="ad-speaker">'+esc(who)+'</div><div class="ad-utterance">'+text+'</div>'+actions(controls);
   lastSpeechSignature='';positionSpeech();
   dialog.querySelector('button')?.focus({preventScroll:true});
 }
 function display(title,html,items=[]){
   const isJournal=title.startsWith('Sidoäventyr ·');scene=title;blocking=true;
   activeChallenge=null;
   if(isJournal){
     dialog.classList.remove('ad-event-speech');tail.hidden=true;tail.replaceChildren();lastSpeechSignature='';
     dialog.innerHTML='<h2>'+esc(title)+'</h2>'+html+actions(items);
     if(!dialog.open)dialog.showModal();
     dialog.querySelector('button')?.focus({preventScroll:true});
   }else{
     turns=splitSpeech(html);turnIndex=0;turnChoices=items;
     dialog.classList.add('ad-event-speech');
     if(!dialog.open)dialog.show();
     dialog.style.background='transparent';dialog.style.border='0';
     renderTurn();
   }
   journal.hidden=!isJournal;
   window.UPPDRAG_WORLD_KEYBOARD?.clear?.();
 }
 function close(){
   const wasJournal=scene?.startsWith('Sidoäventyr ·');
   if(speaker==='thief'&&state.thief==='unseen'){approach.reset();thiefPoint=null;}
   if(dialog.open)dialog.close();tail.hidden=true;tail.replaceChildren();
   dialog.classList.remove('ad-event-speech');lastSpeechSignature='';turns=[];turnIndex=0;turnChoices=[];activeChallenge=null;
   if(!wasJournal&&state.wagonSeen&&state.wagon!=='cleared'){state.wagonShoulder=true;save();}
   scene=null;blocking=false;journal.hidden=atRoom;
   window.UPPDRAG_WORLD_KEYBOARD?.clear?.();
 }
function finishWagon(method){speaker='wagon';state.wagon='cleared';state.wagonSeen=true;record('wagon',method);display('Vägen är fri','<p><b>Kusken:</b> ”Nu lossnade hjulet! Jag minns att du hjälpte mig. Nästa gång ska jag lasta lättare.”</p><p class="ad-note">Du får ingen gratis mästarstämpel av sidoäventyret. Vägen är fri och huvuduppdraget fortsätter.</p>',[['close','Fortsätt genom staden']]);}
function showWagon(){speaker='wagon';if(!allowed('wagon'))return;
 if(!state.wagonSeen){state.wagonSeen=true;record('wagon','discovered');}
 if(state.wagon==='cleared'){display('Kusken minns dig','<p><b>Kusken:</b> ”Här var det stopp förut! Tack vare dig kom jag fram med lasten. Hästarna är utvilade och vagnen står åt sidan.”</p>',[['close','Fortsätt']]);return;}
 if(state.wagon==='need-smith'){
  display('Vagnen står kvar','<p><b>Kusken:</b> ”Kan du tala med smeden vid Verkstäderna? Hen känner till hur man stöttar en skadad vagnsaxel. Jag väntar här.”</p><p class="ad-note">Sidoäventyr: besök smeden vid Verkstäderna, väster om Byn, och återvänd hit.</p>',[['later','Jag kommer tillbaka']]);return;
 }
 if(state.wagon==='advice'){
  display('Rådet från smeden','<p><b>Kusken:</b> ”Har du varit hos smeden?”</p><p><b>Du:</b> ”Vi ska lossa lite last och stötta axeln innan hästarna drar.”</p><p><b>Kusken:</b> ”Då prövar vi. Håll undan, så blir ingen klämd.”</p>',[['fix','Hjälp till att flytta lasten'],['later','Kom tillbaka senare',true]]);return;
 }
 const intro='<div class="ad-illustration" aria-hidden="true"><span class="ad-cart"></span></div><p><b>Kusken:</b> ”'+esc(scenery[chapter]?.wagon||scenery[5].wagon)+' Jag vågar inte piska hästarna. Då går axeln av.”</p>'+(state.wagonShoulder?'<p>Jag fick rulla vagnen åt vägkanten så andra kan komma förbi, men jag behöver fortfarande hjälp med axeln.</p>':'');
 const next=state.wagon==='inspected'||state.wagon==='deferred';
 if(next)display('Vagnen på herrgårdsvägen',intro+'<p>Ser du bakhjulet? Det har sjunkit ned, och lasten trycker på axeln. Vad tycker du att vi ska göra?</p>',[['think','Minns ett råd och prova en lösning'],['smith','Gå till smeden i Verkstäderna'],['later','Låt den stå så länge',true]]);
 else display('Vagnsblockad!',intro+'<p>Kan du hjälpa mig med hjulet? Jag väntar här om du behöver gå vidare först.</p>',[['inspect','Undersök vagnen'],['later','Ta dig förbi och återkom',true]]);
}
function showSmith(){speaker='smith';if(state.wagon!=='need-smith')return;
 display('Smeden i Verkstäderna','<p><b>Smeden:</b> ”Ska kusken försöka dra loss hela lasten på en gång? Det förstör hjulet. Lägg ned några säckar, kila under axeln och låt hästarna dra försiktigt.”</p><p><b>Du:</b> ”Då får jag gå tillbaka. Han väntar fortfarande på vägen.”</p>',[['advice','Tack! Jag går tillbaka']]);}
function challenge(){speaker='wagon';const q=question((state.history.length||0)+2);
 if(!q)return display('Tänk igenom lösningen','<p>Lasten är för tung. Ska vi lossa en del, eller vill du fråga smeden?</p>',[['fix','Lossa lasten och stötta axeln'],['smith','Be smeden om råd',true]]);
 display('Minneskrok vid vagnen','<p>Vi tar en tankepaus. Vad minns du om det här?</p><p><b>'+esc(q.prompt)+'</b></p><div class="ad-choices">'+q.choices.map((o,i)=>`<button type="button" data-option="${i}">${esc(o)}</button>`).join('')+'</div><p class="ad-note">Bonusrepetition.</p>',[]);
 activeChallenge={type:'wagon',question:q};
}
function showThief(){
 if(!allowed('thief')||state.thief!=='unseen'||!activeWorld||(!teacher&&wallet()<1))return false;
 if(!thiefPoint){thiefPoint={x:(last?.x||1200)+38,y:last?.y||710};approach.place(thiefPoint);}
 const clear=(a,b)=>window.UPPDRAG_WORLD_KEYBOARD?.clearSegment?.(activeWorld,a,b,0)??false;
 const escape=window.UPPDRAG_EVENT_APPROACH.escapeRoute(activeWorld,thiefPoint,last,id=>navigationPoint(activeWorld,id),clear);
 if(!escape){approach.reset();thiefPoint=null;return false;}
 if(!approach.flee(escape))return false;
 state.stolenDaler=loseDaler();state.thief='chasing';state.thiefSeen=true;record('thief','chase-started');
 chaseFollowing=false;chaseButton.hidden=false;document.body.dataset.adventureChase='true';
 shout('Mina pengar!');return true;
}
function showWitness(){speaker='witness';if(!allowed('thief')||['unseen','chasing'].includes(state.thief))return;
 if(state.witness==='recovered'||state.witness==='heard'){
  display('Barnet vid torget','<p><b>Barnet:</b> ”Vi har ju pratat förut. Jag minns att du lyssnade. Det är lugnare på torget i dag.”</p>',[['close','Fortsätt']]);return;
 }
 const intro='<p><b>Barnet:</b> ”'+(state.thief==='won'?'Jag såg att du fick tillbaka din daler.':'Jag såg ficktjuven springa genom gränden.')+' Vill du veta vad jag lade märke till?”</p>';
 if(state.witness==='cold'){
  display('Barnet minns','<p><b>Barnet:</b> ”Förra gången höjde du rösten åt mig. Jag blev rädd.”</p>',[['kind','Be om ursäkt och fråga lugnt'],['cold','Låt barnet vara',true]]);return;
 }
 display('En iakttagelse på torget',intro+'<p class="ad-note">Det här är en frivillig fortsättning på tjuvhändelsen, inte en kunskapsfråga.</p>',[['kind','Fråga lugnt vad barnet såg'],['harsh','Kräv att få veta',true]]);
}
function witnessAnswer(kind){speaker='witness';
 if(kind==='harsh'){state.witness='cold';record('witness','unfriendly');display('Barnet drar sig undan','<p><b>Barnet:</b> ”Jag gjorde ingenting! Jag vill inte prata när du skriker.”</p>',[['close','Fortsätt']]);return;}
 const reply=state.witness==='cold'?'Förlåt att jag skrämde dig. Vill du berätta vad du såg?':'Berätta gärna vad du såg.';
 const found=state.thief==='lost'&&returnDaler();if(found)state.stolenDaler=false;state.witness=found?'recovered':'heard';record('witness',found?'recovered-coin':'heard-witness');
 display('Vad barnet såg','<p><b>Du:</b> ”'+esc(reply)+'”</p><p><b>Barnet:</b> ”Tjuven sprang mot en låda bakom torget.”</p>'+(found?'<p><b>Barnet:</b> ”Här! Tjuven tappade en daler vid lådan. Är den din?”</p>':'<p><b>Du:</b> ”Tack för att du berättade.”</p>'),[['close','Tacka barnet och fortsätt']]);
}
function finishThief(caught,announce=true){
 if(state.thief!=='chasing')return;
 if(caught&&state.stolenDaler){returnDaler();state.stolenDaler=false;}
 state.thief=caught?'won':state.stolenDaler?'lost':'ignored';record('thief',state.thief);
 if(chaseFollowing)path=[];chaseFollowing=false;chaseButton.hidden=true;delete document.body.dataset.adventureChase;
 if(caught)approach.depart();else{approach.reset();thiefPoint=null;}
 if(announce)shout(caught?'Min daler! Den behåller jag.':'Vart tog tjuven vägen?');
}
function journalStatus(){return '<p><b>Vagnen vid herrgårdsvägen:</b> '+({unseen:'Inte upptäckt',inspected:'Undersökt – återvänd om du vill',deferred:'Du kan återvända', 'need-smith':'Sök smeden vid Verkstäderna',advice:'Återvänd till kusken',cleared:'Hjälpt, vägen är fri'}[state.wagon])+'</p>'+
 (allowed('thief')?'<p><b>Ficktjuven:</b> '+({unseen:'Har inte visat sig',chasing:'Springer iväg med din daler',won:'Du hann ikapp',lost:'Försvann med en daler',ignored:'Avslutat'}[state.thief])+'</p>'+(!['unseen','chasing'].includes(state.thief)?'<p><b>Vittnet vid torget:</b> '+({unseen:'Går att prata med',cold:'Vill bli bemött lugnare',recovered:'Du fick tillbaka dalern',heard:'Ni har pratat'}[state.witness])+'</p>':''):'');}
function showJournal(){speaker='journal';const buttons=[['close','Tillbaka till spelet']];if(teacher){buttons.unshift(['demo-wagon','Testa vagnsblockad'],...(allowed('thief')?[['demo-thief','Testa ficktjuven']]:[]));}
 display('Sidoäventyr · kapitel '+chapter,'<p>De här händelserna är frivilliga. De kan lösas över flera möten och sparas separat från huvuduppdraget.</p><div class="ad-history">'+journalStatus()+'</div><p class="ad-note">Vagnen finns på landsvägen mellan Verkstäderna och Herrgården. Om smeden behövs ligger Verkstäderna längre västerut. Resor och huvuduppdrag fortsätter som vanligt.</p>',buttons);
}
function updateJournalLabel(){journal.textContent='Händelser'+(state.wagon!=='unseen'||state.thief!=='unseen'?' · ':'')+(state.wagon==='cleared'?'✓':state.wagon==='need-smith'?'!':'');}
journal.addEventListener('click',showJournal);
dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
dialog.addEventListener('keydown',e=>{
   e.stopPropagation();
   if(e.key==='Escape'&&dialog.classList.contains('ad-event-speech')){e.preventDefault();close();}
 });
dialog.addEventListener('click',e=>{
 const option=e.target.closest('[data-option]');
 if(option&&activeChallenge){
   const {question:q}=activeChallenge;
   const selected=Number(option.dataset.option);
   if(!Number.isInteger(selected)||selected<0||selected>=q.choices.length)return;
   const success=q.choices[selected]===q.answer;
   activeChallenge=null;
   {
     if(success)finishWagon('solved-with-knowledge');
     else display('Vagnen står kvar','<p>Det vågar jag inte prova. Hästen och hjulet kan skadas. Har du någon annan idé?</p>',[['smith','Be smeden om hjälp'],['fix','Flytta den tyngsta lasten'],['later','Gå vidare så länge',true]]);
   }
   return;
 }
 const b=e.target.closest('[data-adventure]');if(!b)return;
 const code=b.dataset.adventure;
 if(code==='next'){if(turnIndex<turns.length-1){turnIndex++;renderTurn();}return;}
 if(code==='close'||code==='later'){if(code==='later'&&state.wagon==='unseen'){state.wagon='deferred';record('wagon','deferred');}close();}
 else if(code==='demo-wagon'){close();showWagon();}
 else if(code==='demo-thief'&&teacher){close();approach.reset();thiefPoint=null;state.thief='unseen';state.stolenDaler=false;showThief();}
 else if(code==='inspect'){state.wagon='inspected';record('wagon','inspected');showWagon();}
 else if(code==='think'){state.wagon='inspected';record('wagon','tried-memory');challenge('wagon');}
 else if(code==='smith'){state.wagon='need-smith';record('wagon','asked-smith');showWagon();}
 else if(code==='advice'){state.wagon='advice';record('wagon','smith-advice');close();}
 else if(code==='fix'){finishWagon('helped-manually');}
 else if(code==='kind'||code==='harsh'){witnessAnswer(code);}
 else if(code==='cold'){close();}
});
const hasOtherDialogue=()=>!!document.querySelector('dialog[open]:not(#adventureDialog),#ch1Modal:not([hidden]),#meetingDialogue:not([hidden])')||document.body.classList.contains('ch1-open')||!!document.body.dataset.conversation||!!window.UPPDRAG_STORY_WORK?.busy||!!window.UPPDRAG_LIVING_DIALOGUES?.busy;
function tick(now,{region,player,activeRoom=null}={}){
 if(!region?.id||!player||!Number.isFinite(player.x)||!Number.isFinite(player.y))return;
 if(scene&&!scene.startsWith('Sidoäventyr ·'))positionSpeech();
 activeWorld=region;lastRegion=region.id;atRoom=activeRoom!==null;journal.hidden=atRoom||!!scene;
 const was=last;last={x:player.x,y:player.y,region:region.id};
 if(atRoom||region.id!=='main'){if(state.thief==='chasing')finishThief(false,false);approach.reset();thiefPoint=null;callout.hidden=true;calloutTail.hidden=true;return;}
 const occupied=!!scene||dialog.open||hasOtherDialogue()||document.hidden;
 const elapsed=lastTickAt===null?0:Math.max(0,Math.min(80,now-lastTickAt));lastTickAt=now;
 if(!occupied)calloutLeft=Math.max(0,calloutLeft-elapsed);
 callout.hidden=calloutLeft<=0||occupied;calloutTail.hidden=callout.hidden;
 const moved=was?.region===region.id?Math.hypot(was.x-player.x,was.y-player.y):0;
 if(!occupied&&moved>1&&moved<45){state.distance=Math.min(100000,state.distance+moved);if(Math.floor(state.distance/200)!==Math.floor((state.distance-moved)/200))save();}
 const motion=approach.tick(now,player,{
   enabled:!teacher&&now>=2400&&allowed('thief')&&state.thief==='unseen'&&wallet()>0&&state.distance>=state.thiefDistance,
   paused:occupied,
   clear:(a,b)=>window.UPPDRAG_WORLD_KEYBOARD?.clearSegment?.(region,a,b,0)??true
 });
 thiefPoint=motion.point;
 if(occupied)return;
 if(state.thief==='chasing'){
  if(motion.phase==='caught')finishThief(true);
  else if(['escaped','waiting','done'].includes(motion.phase))finishThief(false);
  else followThief(now);
  return;
 }
 if(teacher||now<2400)return;
 if(state.wagon==='unseen'&&allowed('wagon')&&moved>1&&Math.hypot(player.x-wagonAt.x,player.y-wagonAt.y)<87){showWagon();return;}
 if(state.wagon==='need-smith'&&moved>1&&Math.hypot(player.x-smithAt.x,player.y-smithAt.y)<95){showSmith();return;}
 if(allowed('thief')&&!['unseen','chasing'].includes(state.thief)&&state.witness==='unseen'&&moved>1&&Math.hypot(player.x-witnessAt.x,player.y-witnessAt.y)<95){showWitness();return;}
 if(motion.phase==='contact'&&state.thief==='unseen')showThief();
}
const people={
 wagon:{name:'Kusken',color:'#88744f',role:'driver'},
 smith:{name:'Smeden',color:'#6f756a',apron:true,role:'smith'},
 witness:{name:'Barnet',color:'#8c775d',role:'child'},
 thief:{name:'En förbipasserande',color:'#596458',role:'passerby'}
};
function drawPerson(ctx,key,pos,now,scale=1){
 const target=last||{x:pos.x+1,y:pos.y};
 const heading=Number.isFinite(pos.heading)?pos.heading:Math.atan2(target.y-pos.y,target.x-pos.x);
 ctx.save();ctx.globalAlpha*=pos.alpha??1;ctx.translate(pos.x,pos.y);ctx.scale(scale,scale);
 window.UPPDRAG_MEETINGS.drawMapPerson(ctx,{x:0,y:0,heading,moving:!!pos.moving,animationTime:now},people[key],now);
 ctx.restore();
}
function drawWagon(ctx,now){const p=wagonPosition();
 ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-.08);
 const paper=(points,color)=>{ctx.fillStyle=color;ctx.strokeStyle='#5e503c';ctx.lineWidth=1.2;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.stroke();};
 // Wooden cart seen from above, with cut-paper edges and planked load bed.
 paper([[-57,-34],[-32,-35],[-31,-28],[-57,-27]],'#4d4639');
 paper([[26,-35],[50,-34],[50,-27],[25,-28]],'#4d4639');
 paper([[-57,28],[-32,27],[-31,35],[-57,36]],'#4d4639');
 paper([[26,28],[50,27],[50,35],[25,36]],'#4d4639');
 paper([[-62,-27],[55,-28],[57,27],[-61,29]],'#a48b60');
 for(let y=-20;y<=20;y+=10){ctx.beginPath();ctx.moveTo(-56,y);ctx.lineTo(52,y+1);ctx.strokeStyle='#786345';ctx.lineWidth=.7;ctx.stroke();}
 paper([[-64,-29],[58,-30],[58,-24],[-63,-23]],'#725d3f');
 paper([[-64,24],[57,23],[57,30],[-63,31]],'#725d3f');
 for(const [x,y] of [[-42,-16],[-9,-15],[16,-9],[-29,6]]){
  paper([[x,y],[x+26,y-1],[x+28,y+17],[x+1,y+19]],'#ded0ad');
  ctx.beginPath();ctx.moveTo(x+13,y);ctx.lineTo(x+14,y+18);ctx.strokeStyle='#9b8762';ctx.stroke();
 }
 for(const y of [-19,19])paper([[55,y-2],[95,y-1],[95,y+2],[55,y+2]],'#86714d');
 ctx.restore();drawPerson(ctx,'wagon',driverPosition(),now);
}
function draw(ctx,{region,now=0}={}){if(!ctx||region?.id!=='main')return;
 matrix=ctx.getTransform();
 if(allowed('wagon'))drawWagon(ctx,now);
 if(state.wagon==='need-smith')drawPerson(ctx,'smith',smithAt,now);
 if(allowed('thief')&&!['unseen','chasing'].includes(state.thief))drawPerson(ctx,'witness',witnessAt,now,.78);
 if(thiefPoint){drawPerson(ctx,'thief',thiefPoint,now);if(state.thief==='chasing'){ctx.save();ctx.translate(thiefPoint.x,thiefPoint.y);ctx.rotate(thiefPoint.heading||0);ctx.fillStyle='#b59355';ctx.strokeStyle='#5a4430';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(1,18,6,7,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();}}
 positionCallout();
}
function inWorld(e){if(!canvas||!matrix)return null;
 const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return null;
 const x=(e.clientX-rect.left)*canvas.width/rect.width,y=(e.clientY-rect.top)*canvas.height/rect.height;
 const m=matrix,den=m.a*m.d-m.b*m.c;if(Math.abs(den)<1e-10)return null;
 return{x:(m.d*(x-m.e)-m.c*(y-m.f))/den,y:(-m.b*(x-m.e)+m.a*(y-m.f))/den};
}
function mapClick(e){if(lastRegion!=='main'||atRoom||scene||dialog.open||hasOtherDialogue())return false;
 const p=inWorld(e);if(!p)return false;
 if(allowed('wagon')&&(Math.hypot(p.x-wagonPosition().x,p.y-wagonPosition().y)<75||Math.hypot(p.x-driverPosition().x,p.y-driverPosition().y)<30)){showWagon();return true;}
 if(state.wagon==='need-smith'&&Math.hypot(p.x-smithAt.x,p.y-smithAt.y)<75){showSmith();return true;}
 if(allowed('thief')&&!['unseen','chasing'].includes(state.thief)&&Math.hypot(p.x-witnessAt.x,p.y-witnessAt.y)<75){showWitness();return true;}
 if(thiefPoint&&state.thief==='chasing'&&Math.hypot(p.x-thiefPoint.x,p.y-thiefPoint.y)<60){chaseFollowing=true;followThief(performance.now(),true);return true;}
 chaseFollowing=false;
 return false;}
if(canvas){canvas.addEventListener('pointerdown',e=>{if(scene){e.preventDefault();e.stopImmediatePropagation();return;}if(mapClick(e)){e.preventDefault();e.stopImmediatePropagation();}},true);}
function install(){const life=window.UPPDRAG_WORLD_LIFE;
 if(!life||typeof life.tick!=='function'||typeof life.draw!=='function')throw Error('Händelserna behöver spelvärldens gemensamma rörelsemotor.');
 const oldTick=life.tick,oldDraw=life.draw;
 life.tick=function(now,config){const ret=oldTick.apply(this,arguments);tick(now,config);return ret;};
 life.draw=function(ctx,config){const ret=oldDraw.apply(this,arguments);draw(ctx,config);return ret;};
 const keyboard=window.UPPDRAG_WORLD_KEYBOARD;
 if(keyboard&&typeof keyboard.tick==='function'){const old=keyboard.tick;keyboard.tick=function(){if(blocking)return;return old.apply(this,arguments);};}
}
const api={get blocking(){return blocking;},get busy(){return !!scene||state.thief==='chasing';},get chapter(){return chapter;},get state(){return JSON.parse(JSON.stringify(state));},get approach(){return approach.snapshot();},get registry(){return Array.from(catalog.values()).map(x=>({...x}));},register(def){if(!def||typeof def.id!=='string'||!/^[a-z][a-z0-9-]{2,48}$/.test(def.id)||catalog.has(def.id))return false;catalog.set(def.id,Object.freeze({...def}));return true;},openJournal:showJournal,openWagon:showWagon,openSmith:showSmith,openThief:showThief,openWitness:showWitness,resetChapterEvents(){state.wagon='unseen';state.wagonSeen=false;state.wagonShoulder=false;state.thief='unseen';state.thiefSeen=false;state.stolenDaler=false;chaseFollowing=false;chaseButton.hidden=true;delete document.body.dataset.adventureChase;state.witness='unseen';state.distance=0;state.history=[];approach.reset();thiefPoint=null;save();},version:'1.6.0'};
window.UPPDRAG_EVENT_ENGINE=api;
api.register({id:'wagon-blockade',type:'sidequest',region:'main',chapters:[1,2,3,4,5,6,7,8,9,10],multiStop:true,nonBlocking:true});
api.register({id:'pickpocket',type:'surprise',region:'main',chapters:[1,2,4,5,7,9,10],physicalChase:true,maximumLoss:1});
api.register({id:'street-witness',type:'follow-up',region:'main',chapters:[1,2,4,5,7,9,10],dependsOn:'pickpocket',remembersChoice:true});
install();save(); // Keep the encounter window stable across browser reloads.
})();
