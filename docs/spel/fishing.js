/* Cast from real shorelines on the map. The town loop owns all animation. */
(function(){
'use strict';
function source(name,text){
 if(!/^world-keyboard(?:-ch\d+)?\.js$/.test(name))return text;
 const edit=(a,b)=>{if(text.split(a).length!==2)throw Error('Fisket: tangentbordets ankare saknas i '+name);text=text.replace(a,b);};
 edit('  function activeDialogue(){\n    return !!(','  function activeDialogue(){\n    return !!(window.UPPDRAG_FISHING?.blocking||');
 edit('  function interact(){','  function interact(){\n    if(window.UPPDRAG_FISHING?.blocking)return false;\n    if(window.UPPDRAG_FISHING?.interact())return true;');
 edit('    tick,clear,interact,walkablePoint,clearSegment,keyOf,claimAction,','    tick,clear,interact,walkablePoint,clearSegment,keyOf,claimAction,nearbyTarget:()=>interior?null:nearby(),');return text;
}
const api={source};window.UPPDRAG_FISHING=api;
const chapter=Number(window.__INTEGRATED_CHAPTER);
if(typeof document==='undefined'||![4,5].includes(chapter)||!document.getElementById('stage'))return;
const KEY='uppdrag1700.fishing.v1',pilot=()=>window['UPPDRAG_CH'+chapter+'_PILOT'],M=window.UPPDRAG_FISHING_MODEL;
const atQuay=()=>typeof interior!=='undefined'&&interior?.outdoor&&interior.regionId==='main'&&!voyage;
const atKitchen=()=>typeof interior!=='undefined'&&interior?.kind==='barnhus'&&region.id==='main'&&!voyage;
const receiver=chapter===4?'Cajsa':'Siri',bank=()=>window.UPPDRAG_RECALL_BANK||[];
const outside=()=>typeof region!=='undefined'&&typeof player!=='undefined'&&!interior&&!sailing&&!voyage;
const distance=(a,b)=>a&&b?Math.hypot(a.x-b.x,a.y-b.y):Infinity;
const geometry={water:(r,x,y)=>waterAt(r,x,y),walkable:(r,x,y,n)=>window.UPPDRAG_WORLD_KEYBOARD.walkablePoint(r,x,y,n),clear:(r,a,b,n)=>window.UPPDRAG_WORLD_KEYBOARD.clearSegment(r,a,b,n)};
let spotCache=null,currentCast=null,pendingBankRoute=null;
const shoreCache=new WeakMap();
function spot(force=false){
 if(!outside())return null;
 if(!force&&spotCache?.region===region&&distance(spotCache.point,player)<3)return spotCache.spot;
 const found=M.shoreSpot(region,player,geometry);spotCache={region,point:{x:player.x,y:player.y},spot:found};return found;
}
function nearbyTarget(){return outside()?window.UPPDRAG_WORLD_KEYBOARD.nearbyTarget?.():null;}
function keyMayFish(s=spot()){if(!s)return false;const target=nearbyTarget();return !target||target.distance>s.distance+12;}
function bankRoute(target=player){
 if(!shoreCache.has(region))shoreCache.set(region,M.shores(region,geometry));
 const points=shoreCache.get(region).slice().sort((a,b)=>distance(a.origin,target)-distance(b.origin,target));
 for(const s of points.slice(0,32)){
  const route=window.UPPDRAG_EVENT_APPROACH.routeBetween(region,player,s.origin,id=>navigationPoint(region,id),(a,b)=>geometry.clear(region,a,b,24));
  if(route?.length)return {spot:s,route};
 }
 return null;
}
const occupied=()=>!!(window.UPPDRAG_MENU_OPEN?.()||pilot()?.studyBusy||window.UPPDRAG_MEETINGS?.state?.talking||window.UPPDRAG_LIVING_DIALOGUES?.active||window['UPPDRAG_CH'+chapter+'_CITY_LIFE']?.active||window.UPPDRAG_EVENT_ENGINE?.busy||window.UPPDRAG_HAT_SHOP?.busy||window.UPPDRAG_ORCHARD?.busy||window.UPPDRAG_STORY_WORK?.busy||document.querySelector('dialog[open]:not(#fishingDialog),#ch1Modal:not([hidden])'));
function pool(){const ids=new Set(pilot()?.repetitionTaskIds||[]),demoIds=window.__UPPDRAG_FISHING_TEST?new Set(demoTasks().map(t=>t.id)):null;return bank().filter(t=>ids.has(t.id)&&(!demoIds||demoIds.has(t.id))&&t.chapter<=chapter&&t.rank===0&&t.kind==='fields'&&t.fields?.length===1&&t.fields[0].answers?.length);}
let raw;try{raw=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}
let now=0,task=null,view='',lastHint='',demoOffered=false,lastPlace='';
const model=M.create(raw,{
 save:s=>{try{localStorage.setItem(KEY,JSON.stringify(s));}catch{}},
 wallet:()=>pilot()?.state?.daler,hasRodReceipt:()=>pilot()?.state?.fishingRodReceipt===true,
 atShop:()=>atQuay()&&dialog.open&&view==='shop'&&!occupied(),atWater:()=>!!spot()&&!occupied(),atKitchen:()=>atKitchen()&&!occupied(),
 debit(amount,expected){const p=pilot();if(!p||p.state.daler!==expected)return false;p.state.daler-=amount;p.state.fishingRodReceipt=true;p.persist();p.refresh?.();return true;},
 credit(amount,id){const p=pilot();if(!p||!Number.isSafeInteger(p.state.daler)||!atKitchen())return false;p.state.fishingPayments??={};if(p.state.fishingPayments[id])return true;p.state.daler+=amount;p.state.fishingPayments[id]=amount;p.persist();p.refresh?.();return true;},
 practice(id){const p=pilot(),t=bank().find(t=>t.id===id);if(!p||!t)return;const ids=(p.state.recallRutFocus||[]).filter(id=>bank().some(t=>t.id===id));if(!ids.some(id=>{const other=bank().find(t=>t.id===id);return other.chapter===t.chapter&&other.topic===t.topic;}))p.state.recallRutFocus=[id,...ids];p.persist();}
});
const style=document.createElement('style');style.textContent=`
#fishingHint{position:absolute;left:12px;bottom:12px;z-index:8;max-width:min(355px,calc(100% - 24px));padding:9px 12px;background:#fff5dfe8;border:1px solid #a18a65;border-radius:6px;color:#3c3428;font:14px/1.4 system-ui;pointer-events:none}
body[data-fishing-bank] #message{visibility:hidden}
#fishingAction,#fishingDelivery{min-height:44px;padding:9px 13px;border:1px solid #8f7858;border-radius:6px;background:#e3eadb;color:#352f25;font:15px system-ui;cursor:pointer}
#fishingDialog{width:min(570px,calc(100% - 24px));max-height:88dvh;overflow:auto;padding:24px;border:1px solid #937c59;border-radius:12px;background:#fff7e9;color:#382f25;font:16px/1.5 system-ui}
#fishingDialog::backdrop{background:#28251e80}#fishingDialog h2{font:600 27px Georgia;margin:0 0 12px}#fishingDialog label{display:block;margin:14px 0 6px;font-weight:600}#fishingDialog input{box-sizing:border-box;width:100%;padding:12px;border:1px solid #9b835c;border-radius:6px;font:18px system-ui}#fishingDialog button{min-height:44px;margin:12px 7px 0 0;padding:10px 15px;background:#436b5c;color:white;border:1px solid #436b5c;border-radius:6px;font:16px system-ui;cursor:pointer}#fishingDialog button.secondary{background:#fffaf0;color:#382f25}#fishingDialog button:disabled{opacity:.6;cursor:default}#fishingDialog small{display:block;color:#665b49}#fishingDialog :focus-visible,#fishingAction:focus-visible,#fishingDelivery:focus-visible{outline:3px solid #286472;outline-offset:2px}
`;document.head.append(style);
const dialog=document.createElement('dialog');dialog.id='fishingDialog';dialog.setAttribute('aria-labelledby','fishingTitle');document.body.append(dialog);
const action=document.createElement('button'),delivery=document.createElement('button');action.id='fishingAction';delivery.id='fishingDelivery';action.type=delivery.type='button';action.hidden=delivery.hidden=true;roomFooter.append(action,delivery);
const hint=document.createElement('div');hint.id='fishingHint';hint.hidden=true;hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');roomView.append(hint);
const stage=document.getElementById('stage'),worldControls=document.getElementById('worldFooter')||stage;let hintHost=roomView,actionHost=roomFooter;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const say=text=>{lastHint=text;};
function stop(){window.UPPDRAG_WORLD_KEYBOARD?.clear();if(typeof path!=='undefined')path=[];pendingBankRoute=null;if(typeof cancelPersonArrival==='function')cancelPersonArrival();if(typeof pendingRoom!=='undefined')pendingRoom=null;if(typeof pendingStreetChat!=='undefined')pendingStreetChat=null;if(typeof pending!=='undefined')pending=null;if(typeof returnPending!=='undefined')returnPending=false;}
function focusScene(){document.getElementById(outside()?'world':'interiorCanvas')?.focus?.({preventScroll:true});}
function close(){if(['waiting','question'].includes(model.snapshot().phase))say('Du släppte tillbaka fisken. Mellanslag: kasta ut igen.');if(dialog.open)dialog.close();view='';model.close();currentCast=null;focusScene();}
function show(html,mode){stop();view=mode;dialog.innerHTML=html;dialog.showModal();dialog.querySelector('input,button:not([disabled])')?.focus({preventScroll:true});}
function shop(){
 if(!atQuay()||occupied()||dialog.open)return false;
 const owned=model.snapshot().state.rod,balance=pilot()?.state?.daler||0;
 show('<h2 id="fishingTitle">Jos fiskespö</h2><p>”Här har du spö, lina, krok och flöte. Det kostar <strong>10 daler</strong>. Det är ditt sedan. Ta med det när du reser vidare.”</p><p>Du har '+balance+' daler.</p>'+(owned?'<p>Du har redan ett spö.</p>':'<button type="button" data-fishing="buy" '+(balance<10?'disabled':'')+'>Köp spö · 10 daler</button>')+'<button class="secondary" type="button" data-fishing="close">Till spelet</button><small>Fisket är frivilligt. Spöet och fångsten sparas.</small>','shop');return true;
}
function cast(){
 if(!outside()||occupied()||dialog.open)return false;
 if(!model.snapshot().state.rod){say('Du behöver ett fiskespö. Jo säljer ett vid Kajen för 10 daler.');return false;}
 if(model.snapshot().phase==='waiting'){model.cancel();currentCast=null;say('Du vevar in linan. Mellanslag: kasta ut igen.');return true;}
 const here=spot(true);if(!here)return false;
 const state=model.snapshot().state,known=pool(),fresh=known.filter(t=>t.id!==state.chapters[chapter].lastTaskId),choices=fresh.length?fresh:known;
 if(!choices.length){say('Börja med frågorna i minnesboken. Vid nästa napp får du repetera sådant du redan mött.');return true;}
 task=choices[Math.floor(Math.random()*choices.length)];const result=model.cast(chapter,task.id);
 if(!result.ok){say(result.reason==='full'?'Korgen rymmer tre fiskar. Lämna fisken i Barnhusets kök innan du fångar fler.':'Det går inte att fiska just nu.');return true;}
 currentCast=here;stop();say('Flötet guppar … Vänta på napp. Mellanslag: veva in.');focusScene();return true;
}
function question(){
 if(!task||dialog.open||occupied()||document.hidden)return;
 show('<h2 id="fishingTitle">Napp!</h2><p>Vad minns du? Svara för att få upp fisken.</p><form><label for="fishingAnswer">'+esc(task.prompt)+'</label><input id="fishingAnswer" name="answer" maxlength="240" autocomplete="off" required><small>Du har mött frågan tidigare. Ett kort eget svar räcker.</small><button type="submit">Svara</button><button type="button" class="secondary" data-fishing="close">Släpp tillbaka fisken</button></form>','question');
}
function deliver(){
 if(!atKitchen()||occupied()||dialog.open)return false;const result=model.deliver(chapter);
 if(!result.ok){say(result.reason==='limit'?'Kökets tre fiskar är redan levererade i det här kapitlet.':'Fånga en fisk vid en strand eller kanalbank först.');return false;}
 const n=result.amount,speech='Tack! '+(n===1?'Fisken kommer':'Fiskarna kommer')+' till användning i köket. Här får du '+(n===1?'en daler':n+' daler')+'.';
 const engine=window.UPPDRAG_EVENT_ENGINE;
 engine.speakRoom?.({room:'barnhus',title:'Fisk till köket',lines:[[chapter===4?'Cajsa Warg':'Siri',speech]],choices:[],pose(who,geo){return chapter===4&&geo.visitorPose?geo.visitorPose:geo.poses[1];}});
 say('Du lämnade '+n+' fisk'+(n===1?'':'ar')+' och fick '+n+' daler.');return true;
}
function approachBank(target){
 if(!outside()||occupied()||dialog.open||!model.snapshot().state.rod)return false;
 const next=bankRoute(target||player);if(!next){say('Välj en strand du kan nå till fots.');return false;}
 model.cancel();currentCast=null;stop();if(typeof pending!=='undefined')pending=null;if(typeof returnPending!=='undefined')returnPending=false;
 window['UPPDRAG_CH'+chapter+'_CITY_LIFE']?.releaseHold?.();window.UPPDRAG_LIVING_DIALOGUES?.onManualMove?.();path=next.route;pendingBankRoute=path;follow=true;focusScene();setMessage('Till vattnet','Du går till strandkanten. Tryck mellanslag när du vill fiska.');return true;
}
function travel(kitchen=false){
 if(occupied()||dialog.open||typeof region==='undefined'||voyage)return false;
 if(kitchen&&region.id!=='main')return false;
 if(kitchen&&atKitchen())return deliver();
 model.cancel();currentCast=null;
 if(interior)leaveInterior();
 if(kitchen){const house=region.buildings.find(b=>b.name==='Barnhuset');return !!house&&requestInterior(house);}
 if(model.snapshot().state.rod)return approachBank();
 return region.id==='main'?requestHarbour():false;
}
dialog.addEventListener('click',event=>{
 const code=event.target.closest?.('[data-fishing]')?.dataset.fishing;if(code==='close')return close();
 if(code==='buy'&&view==='shop'){
  const result=model.buy();if(result.ok){close();say('Spöet är ditt! Gå ut på kartan och stanna vid en strand eller kanalbank. Mellanslag: kasta ut.');}
  else if(result.reason==='funds'){close();say('Spöet kostar 10 daler. Du kan komma tillbaka när du har sparat mer.');}
  else{close();say('Prata klart med Jo och försök köpa spöet igen.');}
 }
 if(code==='demo'&&view==='demo')startDemo();
});
dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
dialog.addEventListener('submit',event=>{
 event.preventDefault();if(view!=='question'||model.snapshot().phase!=='question'||!task)return;
 const answer=dialog.querySelector('input').value.trim();if(!answer)return;const field={...task.fields[0]};delete field.options;
 const verdict=window.UPPDRAG_PROMPT_ALIGNMENT.shortCheck(field,answer,window.UPPDRAG_RECALL_ENGINE.checkField),result=model.submit(verdict==='correct',answer),s=model.snapshot().state;
 say(result.reason==='caught'?'Du har '+s.fish.length+' fisk'+(s.fish.length===1?'':'ar')+' i korgen. Lämna fångsten i Barnhusets kök, eller fiska igen med mellanslag.':result.reason==='released'?'Kökets beställning är klar. Du kan fortsätta fiska för att öva.':'Fisken slapp undan. Öva frågan hos Rut eller pröva ett nytt napp.');
 const text=result.reason==='caught'?'Rätt! Du fick upp fisken. Du har '+s.fish.length+' fisk'+(s.fish.length===1?'':'ar')+' i korgen. Lämna fångsten till '+receiver+' i Barnhusets kök.':result.reason==='released'?'Rätt! Kökets beställning är redan klar i det här kapitlet, så du släpper tillbaka fisken. Du har ändå tränat ditt minne.':(verdict==='review'?'Svaret kändes inte igen.':'Inte riktigt.')+' Fisken slapp undan. Ett exempel på rätt svar är <strong>'+esc(field.sample||field.answers[0])+'</strong>. Frågan finns att öva på hos Rut.';
 view='feedback';dialog.innerHTML='<h2 id="fishingTitle">'+(result.reason==='caught'?'En fisk!':result.reason==='released'?'Bra minne!':'Fisken slapp undan')+'</h2><p>'+text+'</p><small>Högst tre betalda fiskar per kapitel. Spöet behåller du.</small><button type="button" data-fishing="close">Till spelet</button>';dialog.querySelector('button')?.focus({preventScroll:true});
});
action.addEventListener('click',()=>atQuay()?(model.snapshot().state.rod?travel():shop()):cast());delivery.addEventListener('click',deliver);
function drawMap(g,{region:r}){
 if(!outside()||r!==region||!currentCast||!['waiting','question'].includes(model.snapshot().phase))return;
 const p=player,s=currentCast,dx=Math.cos(s.heading),dy=Math.sin(s.heading),tip={x:p.x+dx*43-dy*5,y:p.y+dy*43+dx*5};
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,bob={x:s.water.x,y:s.water.y+(reduced?0:Math.sin(now/420)*1.2)};
 g.save();g.strokeStyle='#f2e9cfcc';g.lineWidth=1;g.beginPath();g.moveTo(tip.x,tip.y);g.quadraticCurveTo((tip.x+bob.x)/2,(tip.y+bob.y)/2+6,bob.x,bob.y);g.stroke();
 g.strokeStyle='#dbe8d67a';g.beginPath();g.ellipse(bob.x,bob.y+3,9,3,0,0,Math.PI*2);g.stroke();g.fillStyle='#ac5141';g.fillRect(bob.x-2,bob.y-5,4,8);g.fillStyle='#f6ebcf';g.fillRect(bob.x-2,bob.y,4,3);g.restore();
 const rod=()=>{g.save();g.strokeStyle='#735231';g.lineWidth=2.5;g.lineCap='round';g.beginPath();g.moveTo(p.x+dx*7-dy*5,p.y+dy*7+dx*5);g.quadraticCurveTo(p.x+dx*24-dy*7,p.y+dy*24+dx*7,tip.x,tip.y);g.stroke();g.restore();};
 if(!window.UPPDRAG_SCENE_PRESENCE?.enqueue(g,p.y+.5,rod,'fishing-rod'))rod();
}
const demoTasks=()=>bank().filter(t=>t.chapter<4&&t.rank===0&&t.kind==='fields'&&t.fields?.length===1&&t.fields[0].answers?.length&&!t.reviewOnly).slice(0,3);
function demo(){
 if(!window.__UPPDRAG_FISHING_TEST||demoOffered||document.hidden||occupied()||dialog.open)return;
 demoOffered=true;if(localStorage.getItem(KEY+'.demo')==='1')return;
 const p=pilot();if(!p||p.state.record.length||p.state.fishingDemoGranted)return;
 show('<h2 id="fishingTitle">Fisketest · separat omgång</h2><p>Du får <strong>12 testdaler</strong>. Spöet kostar 10. Dina vanliga framsteg finns i din andra spelomgång.</p><p>Läs först de här tre minnena. De används vid nappen i testet:</p><ul>'+demoTasks().map(t=>'<li>'+esc(t.prompt)+' <strong>'+esc(t.fields[0].sample||t.fields[0].answers[0])+'</strong></li>').join('')+'</ul><p>Köp spöet vid Kajen. Gå sedan ut på kartan och stanna vid en strand eller kanalbank. Fiska med mellanslag och lämna fångsten i Barnhusets kök. Du kan få betalt för tre fiskar i kapitlet.</p><button type="button" data-fishing="demo">Starta fisketestet</button>','demo');
}
function startDemo(){
 if(!window.__UPPDRAG_FISHING_TEST||localStorage.getItem(KEY+'.demo')==='1'||view!=='demo')return false;
 const p=pilot();if(!p||p.state.record.length||p.state.fishingDemoGranted)return false;
 p.state.daler=12;p.state.fishingDemoGranted=true;p.state.encountered??=[];for(const t of demoTasks())if(!p.state.encountered.includes(t.id))p.state.encountered.push(t.id);
 p.persist();p.refresh?.();localStorage.setItem(KEY+'.demo','1');close();return travel();
}
function tick(t){
 now=t;const here=spot(),place=outside()&&here?'bank-'+region.id:atQuay()?'quay':atKitchen()?'kitchen':'';
 if(place!==lastPlace){lastHint='';lastPlace=place;}
 const present=outside()&&currentCast?.region===region.id&&distance(player,currentCast.origin)<=8;
 const before=model.snapshot().phase,s=model.tick(now,{present,paused:document.hidden||occupied()||dialog.open});
 if(before==='waiting'&&s.phase==='idle'){currentCast=null;say('Du vevar in när du går vidare.');}
 if(s.phase==='question'&&!dialog.open)question();
 if(pendingBankRoute&&(path!==pendingBankRoute||!outside()))pendingBankRoute=null;
 if(pendingBankRoute&&!path.length){pendingBankRoute=null;say('Du är vid vattnet. Mellanslag: kasta ut.');}
 const desiredHint=outside()?stage:roomView,desiredAction=outside()?worldControls:roomFooter;
 if(desiredHint!==hintHost){desiredHint.append(hint);hintHost=desiredHint;}
 if(desiredAction!==actionHost){desiredAction.append(action);actionHost=desiredAction;}
 const unavailable=dialog.open||occupied(),owned=s.state.rod;
 action.hidden=unavailable||!(atQuay()||outside()&&owned&&here);
 action.textContent=atQuay()?(owned?'Gå till fiskevattnet':'Fiskespö · 10 daler'):(s.phase==='waiting'?'Veva in · mellanslag':'Fiska · mellanslag');
 delivery.hidden=!atKitchen()||!s.state.fish.length||unavailable;delivery.textContent='Lämna fisk till '+receiver;
 hint.hidden=unavailable||!place;
 if(!hint.hidden)hint.textContent=lastHint||(outside()?(owned?(keyMayFish(here)?'Mellanslag: fiska här. Du kan också klicka på vatten för att gå till en strandkant.':'Fiska-knappen kastar ut. Mellanslag pratar med personen närmast dig.'):'Här kan du fiska med ett spö. Jo säljer ett vid Kajen för 10 daler.'):atQuay()?(owned?'Gå ut på kartan och välj en strand eller kanalbank.':'Jo säljer ett fiskespö för 10 daler.'):'Köket köper högst tre fiskar per kapitel för en daler styck.');
 if(outside()&&!hint.hidden)document.body.dataset.fishingBank='true';else delete document.body.dataset.fishingBank;
 demo();
}
const life=window.UPPDRAG_WORLD_LIFE,oldTick=life.tick,oldDraw=life.draw;
life.tick=function(t,cfg){const ret=oldTick.apply(this,arguments);tick(t);return ret;};
life.draw=function(g,cfg){const ret=oldDraw.apply(this,arguments);drawMap(g,cfg);return ret;};
const presence=window.UPPDRAG_SCENE_PRESENCE;if(presence){const original=presence.playerPose;presence.playerPose=function(p,route,heading,t){const v=original.apply(this,arguments);return currentCast&&outside()&&['waiting','question'].includes(model.snapshot().phase)?{...v,heading:currentCast.heading,baseHeading:currentCast.heading,moving:false}:v;};}
const canvas=document.getElementById('world');let down=null,matrix=null;
const nativeDraw=life.draw;life.draw=function(g,cfg){matrix=g.getTransform();return nativeDraw.apply(this,arguments);};
function mapPoint(e){if(!matrix)return null;const r=canvas.getBoundingClientRect(),m=matrix,x=(e.clientX-r.left)*canvas.width/r.width,y=(e.clientY-r.top)*canvas.height/r.height,d=m.a*m.d-m.b*m.c;return {x:(m.d*(x-m.e)-m.c*(y-m.f))/d,y:(-m.b*(x-m.e)+m.a*(y-m.f))/d};}
canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};},true);
canvas.addEventListener('pointercancel',()=>down=null,true);
canvas.addEventListener('pointerup',e=>{const start=down;down=null;if(!start||Math.hypot(e.clientX-start.x,e.clientY-start.y)>8||(typeof drag!=='undefined'&&drag?.moved)||!outside()||occupied()||dialog.open||!model.snapshot().state.rod)return;const p=mapPoint(e);if(!p||!geometry.water(region,p.x,p.y))return;e.preventDefault();e.stopImmediatePropagation();if(typeof drag!=='undefined')drag=null;approachBank(p);},true);
window.UPPDRAG_EVENT_ENGINE?.register({id:'shore-fishing',type:'sidequest',region:'any',regions:['main','marstrand','colony'],chapters:[4,5],usesRetrieval:true});
Object.defineProperties(api,{busy:{get:()=>dialog.open||model.snapshot().phase==='waiting'},blocking:{get:()=>dialog.open},testProtection:{get:()=>!!window.__UPPDRAG_FISHING_TEST&&!model.snapshot().state.rod},snapshot:{get:()=>model.snapshot()},fishCount:{get:()=>model.snapshot().state.fish.length}});
Object.assign(api,{shop,cast,deliver,travel:()=>travel(),travelKitchen:()=>travel(true),spot,approachBank,interact:()=>{if(occupied()||dialog.open)return false;if(atQuay()&&!model.snapshot().state.rod)return shop();if(!outside()||!model.snapshot().state.rod)return false;return model.snapshot().phase==='waiting'||keyMayFish()?cast():false;},
 journalHTML:()=>{const s=model.snapshot().state;return '<p><b>Fiske vid vattnet:</b> '+(s.rod?'Spöet är ditt. '+s.fish.length+' fisk'+(s.fish.length===1?'':'ar')+' i korgen. Köket har köpt '+s.chapters[chapter].delivered+' av 3 fiskar i kapitlet.':'Jo säljer ett spö för 10 daler. Fiska vid tillgängliga stränder och kanalbankar på kartan. Rätt minnessvar vid napp ger fisk. Köket betalar en daler per fisk, högst tre per kapitel.')+'</p>';}});
})();
