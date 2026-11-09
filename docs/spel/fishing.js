/* Fishing at the existing painted quay. The town loop owns all animation. */
(function(){
'use strict';
function source(name,text){
 if(!/^world-keyboard(?:-ch\d+)?\.js$/.test(name))return text;
 const edit=(a,b)=>{if(text.split(a).length!==2)throw Error('Fisket: tangentbordets ankare saknas i '+name);text=text.replace(a,b);};
 edit('  function activeDialogue(){\n    return !!(','  function activeDialogue(){\n    return !!(window.UPPDRAG_FISHING?.blocking||');
 edit('  function interact(){','  function interact(){\n    if(window.UPPDRAG_FISHING?.blocking)return false;\n    if(window.UPPDRAG_FISHING?.interact())return true;');return text;
}
const api={source};window.UPPDRAG_FISHING=api;
const chapter=Number(window.__INTEGRATED_CHAPTER);
if(typeof document==='undefined'||![4,5].includes(chapter)||!document.getElementById('stage'))return;
const KEY='uppdrag1700.fishing.v1',pilot=()=>window['UPPDRAG_CH'+chapter+'_PILOT'],M=window.UPPDRAG_FISHING_MODEL;
const atQuay=()=>typeof interior!=='undefined'&&interior?.outdoor&&interior.regionId==='main'&&!voyage;
const atKitchen=()=>typeof interior!=='undefined'&&interior?.kind==='barnhus'&&region.id==='main'&&!voyage;
const receiver=chapter===4?'Cajsa':'Siri',bank=()=>window.UPPDRAG_RECALL_BANK||[];
const occupied=()=>!!(window.UPPDRAG_MENU_OPEN?.()||pilot()?.studyBusy||window.UPPDRAG_MEETINGS?.state?.talking||window.UPPDRAG_LIVING_DIALOGUES?.active||window['UPPDRAG_CH'+chapter+'_CITY_LIFE']?.active||window.UPPDRAG_EVENT_ENGINE?.busy||window.UPPDRAG_HAT_SHOP?.busy||window.UPPDRAG_ORCHARD?.busy||window.UPPDRAG_STORY_WORK?.busy||document.querySelector('dialog[open]:not(#fishingDialog),#ch1Modal:not([hidden])'));
function pool(){const ids=new Set(pilot()?.repetitionTaskIds||[]),demoIds=window.__UPPDRAG_FISHING_TEST?new Set(demoTasks().map(t=>t.id)):null;return bank().filter(t=>ids.has(t.id)&&(!demoIds||demoIds.has(t.id))&&t.chapter<=chapter&&t.rank===0&&t.kind==='fields'&&t.fields?.length===1&&t.fields[0].answers?.length);}
let raw;try{raw=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}
let now=0,task=null,view='',lastHint='',lastPaint=-Infinity,demoOffered=false,lastPlace='';
const model=M.create(raw,{
 save:s=>{try{localStorage.setItem(KEY,JSON.stringify(s));}catch{}},
 wallet:()=>pilot()?.state?.daler,hasRodReceipt:()=>pilot()?.state?.fishingRodReceipt===true,
 atShop:()=>atQuay()&&dialog.open&&view==='shop'&&!occupied(),atWater:()=>atQuay()&&!occupied(),atKitchen:()=>atKitchen()&&!occupied(),
 debit(amount,expected){const p=pilot();if(!p||p.state.daler!==expected)return false;p.state.daler-=amount;p.state.fishingRodReceipt=true;p.persist();p.refresh?.();return true;},
 credit(amount,id){const p=pilot();if(!p||!Number.isSafeInteger(p.state.daler)||!atKitchen())return false;p.state.fishingPayments??={};if(p.state.fishingPayments[id])return true;p.state.daler+=amount;p.state.fishingPayments[id]=amount;p.persist();p.refresh?.();return true;},
 practice(id){const p=pilot(),t=bank().find(t=>t.id===id);if(!p||!t)return;const ids=(p.state.recallRutFocus||[]).filter(id=>bank().some(t=>t.id===id));if(!ids.some(id=>{const other=bank().find(t=>t.id===id);return other.chapter===t.chapter&&other.topic===t.topic;}))p.state.recallRutFocus=[id,...ids];p.persist();}
});
const style=document.createElement('style');style.textContent=`
#fishingHint{position:absolute;left:12px;bottom:12px;z-index:8;max-width:min(355px,calc(100% - 24px));padding:9px 12px;background:#fff5dfe8;border:1px solid #a18a65;border-radius:6px;color:#3c3428;font:14px/1.4 system-ui;pointer-events:none}
#fishingLayer{position:absolute;pointer-events:none;z-index:4}
#fishingAction,#fishingDelivery{min-height:44px;padding:9px 13px;border:1px solid #8f7858;border-radius:6px;background:#e3eadb;color:#352f25;font:15px system-ui;cursor:pointer}
#fishingDialog{width:min(570px,calc(100% - 24px));max-height:88dvh;overflow:auto;padding:24px;border:1px solid #937c59;border-radius:12px;background:#fff7e9;color:#382f25;font:16px/1.5 system-ui}
#fishingDialog::backdrop{background:#28251e80}#fishingDialog h2{font:600 27px Georgia;margin:0 0 12px}#fishingDialog label{display:block;margin:14px 0 6px;font-weight:600}#fishingDialog input{box-sizing:border-box;width:100%;padding:12px;border:1px solid #9b835c;border-radius:6px;font:18px system-ui}#fishingDialog button{min-height:44px;margin:12px 7px 0 0;padding:10px 15px;background:#436b5c;color:white;border:1px solid #436b5c;border-radius:6px;font:16px system-ui;cursor:pointer}#fishingDialog button.secondary{background:#fffaf0;color:#382f25}#fishingDialog button:disabled{opacity:.6;cursor:default}#fishingDialog small{display:block;color:#665b49}#fishingDialog :focus-visible,#fishingAction:focus-visible,#fishingDelivery:focus-visible{outline:3px solid #286472;outline-offset:2px}
`;document.head.append(style);
const dialog=document.createElement('dialog');dialog.id='fishingDialog';dialog.setAttribute('aria-labelledby','fishingTitle');document.body.append(dialog);
const action=document.createElement('button'),delivery=document.createElement('button');action.id='fishingAction';delivery.id='fishingDelivery';action.type=delivery.type='button';action.hidden=delivery.hidden=true;roomFooter.append(action,delivery);
const hint=document.createElement('div');hint.id='fishingHint';hint.hidden=true;hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');roomView.append(hint);
const layer=document.createElement('canvas');layer.id='fishingLayer';layer.setAttribute('aria-hidden','true');layer.hidden=true;roomView.append(layer);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const say=text=>{lastHint=text;};
function stop(){window.UPPDRAG_WORLD_KEYBOARD?.clear();if(typeof path!=='undefined')path=[];}
function focusScene(){document.getElementById('interiorCanvas')?.focus?.({preventScroll:true});}
function close(){if(['waiting','question'].includes(model.snapshot().phase))say('Du släppte tillbaka fisken. Mellanslag: kasta ut igen.');if(dialog.open)dialog.close();view='';model.close();focusScene();}
function show(html,mode){stop();view=mode;dialog.innerHTML=html;dialog.showModal();dialog.querySelector('input,button:not([disabled])')?.focus({preventScroll:true});}
function shop(){
 if(!atQuay()||occupied()||dialog.open)return false;
 const owned=model.snapshot().state.rod,balance=pilot()?.state?.daler||0;
 show('<h2 id="fishingTitle">Jos fiskespö</h2><p>”Här har du spö, lina, krok och flöte. Det kostar <strong>10 daler</strong>. Det är ditt sedan. Ta med det när du reser vidare.”</p><p>Du har '+balance+' daler.</p>'+(owned?'<p>Du har redan ett spö.</p>':'<button type="button" data-fishing="buy" '+(balance<10?'disabled':'')+'>Köp spö · 10 daler</button>')+'<button class="secondary" type="button" data-fishing="close">Till kajen</button><small>Fisket är frivilligt. Spöet och fångsten sparas.</small>','shop');return true;
}
function cast(){
 if(!atQuay()||occupied()||dialog.open)return false;
 if(!model.snapshot().state.rod)return shop();
 if(model.snapshot().phase==='waiting'){model.cancel();say('Du vevar in linan. Mellanslag: kasta ut igen.');return true;}
 const state=model.snapshot().state,known=pool(),fresh=known.filter(t=>t.id!==state.chapters[chapter].lastTaskId),choices=fresh.length?fresh:known;
 if(!choices.length){say('Börja med frågorna i minnesboken. Vid nästa napp får du repetera sådant du redan mött.');return true;}
 task=choices[Math.floor(Math.random()*choices.length)];const result=model.cast(chapter,task.id);
 if(!result.ok){say(result.reason==='full'?'Korgen rymmer tre fiskar. Lämna fisken i Barnhusets kök innan du fångar fler.':'Det går inte att fiska just nu.');return true;}
 stop();say('Flötet guppar … Vänta på napp. Mellanslag: veva in.');focusScene();return true;
}
function question(){
 if(!task||dialog.open||occupied()||document.hidden)return;
 show('<h2 id="fishingTitle">Napp!</h2><p>Vad minns du? Svara för att få upp fisken.</p><form><label for="fishingAnswer">'+esc(task.prompt)+'</label><input id="fishingAnswer" name="answer" maxlength="240" autocomplete="off" required><small>Du har mött frågan tidigare. Ett kort eget svar räcker.</small><button type="submit">Svara</button><button type="button" class="secondary" data-fishing="close">Släpp tillbaka fisken</button></form>','question');
}
function deliver(){
 if(!atKitchen()||occupied()||dialog.open)return false;const result=model.deliver(chapter);
 if(!result.ok){say(result.reason==='limit'?'Kökets tre fiskar är redan levererade i det här kapitlet.':'Fånga en fisk vid Kajen först.');return false;}
 const n=result.amount,speech='Tack! '+(n===1?'Fisken kommer':'Fiskarna kommer')+' till användning i köket. Här får du '+(n===1?'en daler':n+' daler')+'.';
 const engine=window.UPPDRAG_EVENT_ENGINE;
 engine.speakRoom?.({room:'barnhus',title:'Fisk till köket',lines:[[chapter===4?'Cajsa Warg':'Siri',speech]],choices:[],pose(who,geo){return chapter===4&&geo.visitorPose?geo.visitorPose:geo.poses[1];}});
 say('Du lämnade '+n+' fisk'+(n===1?'':'ar')+' och fick '+n+' daler.');return true;
}
function travel(kitchen=false){
 if(occupied()||dialog.open||typeof region==='undefined'||region.id!=='main'||voyage)return false;
 if(kitchen&&atKitchen())return deliver();if(!kitchen&&atQuay())return cast();
 model.cancel();if(interior)leaveInterior();
 if(kitchen){const house=region.buildings.find(b=>b.name==='Barnhuset');return !!house&&requestInterior(house);}
 return requestHarbour();
}
dialog.addEventListener('click',event=>{
 const code=event.target.closest?.('[data-fishing]')?.dataset.fishing;if(code==='close')return close();
 if(code==='buy'&&view==='shop'){
  const result=model.buy();if(result.ok){close();say('Spöet är ditt! Mellanslag: kasta ut. Fisken lämnar du i Barnhusets kök.');}
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
 view='feedback';dialog.innerHTML='<h2 id="fishingTitle">'+(result.reason==='caught'?'En fisk!':result.reason==='released'?'Bra minne!':'Fisken slapp undan')+'</h2><p>'+text+'</p><small>Högst tre betalda fiskar per kapitel. Spöet behåller du.</small><button type="button" data-fishing="close">Till kajen</button>';dialog.querySelector('button')?.focus({preventScroll:true});
});
action.addEventListener('click',cast);delivery.addEventListener('click',deliver);
function fishShape(g,x,y,scale=1){g.save();g.translate(x,y);g.scale(scale,scale);g.fillStyle='#a4b1a4';g.beginPath();g.ellipse(0,0,13,5,0,0,Math.PI*2);g.fill();g.beginPath();g.moveTo(9,0);g.lineTo(20,-7);g.lineTo(20,7);g.closePath();g.fill();g.fillStyle='#3e4c49';g.fillRect(-8,-2,2,2);g.restore();}
function draw(){
 const geo=window.UPPDRAG_MEETINGS?.geometryForRoom?.(),s=model.snapshot();layer.hidden=!atQuay()||!geo||dialog.open;
 if(layer.hidden)return;
 const d=Math.min(window.devicePixelRatio||1,2);Object.assign(layer.style,{left:geo.left+'px',top:geo.top+'px',width:geo.w+'px',height:geo.h+'px'});
 const W=Math.round(geo.w*d),H=Math.round(geo.h*d);if(layer.width!==W)layer.width=W;if(layer.height!==H)layer.height=H;
 const g=layer.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,geo.w,geo.h);if(!s.state.rod)return;
 g.save();g.translate(geo.p.x,geo.p.y);g.scale(geo.p.scale,geo.p.scale);
 const [x,y]=geo.poses[0],waiting=s.phase==='waiting',tip={x:x+81,y:y-194},bobber={x:Math.min(1253,geo.p.right-25),y:481+(waiting?Math.sin(now/420)*3:0)};
 g.lineCap='round';g.strokeStyle='#795c38';g.lineWidth=3;g.beginPath();g.moveTo(x+10,y-53);g.quadraticCurveTo(x+53,y-121,tip.x,tip.y);g.stroke();
 if(waiting){g.strokeStyle='#e5d9bccc';g.lineWidth=1;g.beginPath();g.moveTo(tip.x,tip.y);g.quadraticCurveTo((tip.x+bobber.x)/2,bobber.y+22,bobber.x,bobber.y);g.stroke();g.strokeStyle='#d8e4d56b';g.beginPath();g.ellipse(bobber.x,bobber.y+4,10,3,0,0,Math.PI*2);g.stroke();g.fillStyle='#a7503f';g.fillRect(bobber.x-2,bobber.y-5,4,9);g.fillStyle='#eee4cb';g.fillRect(bobber.x-2,bobber.y,4,4);}
 if(s.state.fish.length){g.fillStyle='#9b8059';g.fillRect(x+28,y-15,46,18);s.state.fish.forEach((f,i)=>fishShape(g,x+40+i*10,y-9-i*3,.55));}
 g.restore();
}
const demoTasks=()=>bank().filter(t=>t.chapter<4&&t.rank===0&&t.kind==='fields'&&t.fields?.length===1&&t.fields[0].answers?.length&&!t.reviewOnly).slice(0,3);
function demo(){
 if(!window.__UPPDRAG_FISHING_TEST||demoOffered||document.hidden||occupied()||dialog.open)return;
 demoOffered=true;if(localStorage.getItem(KEY+'.demo')==='1')return;
 const p=pilot();if(!p||p.state.record.length||p.state.fishingDemoGranted)return;
 show('<h2 id="fishingTitle">Fisketest · separat omgång</h2><p>Du får <strong>12 testdaler</strong>. Spöet kostar 10. Dina vanliga framsteg finns i din andra spelomgång.</p><p>Läs först de här tre minnena. De används vid nappen i testet:</p><ul>'+demoTasks().map(t=>'<li>'+esc(t.prompt)+' <strong>'+esc(t.fields[0].sample||t.fields[0].answers[0])+'</strong></li>').join('')+'</ul><p>Köp spöet vid Kajen, fiska med mellanslag och lämna fångsten i Barnhusets kök. Du kan få betalt för tre fiskar i kapitlet.</p><button type="button" data-fishing="demo">Starta fisketestet</button>','demo');
}
function startDemo(){
 if(!window.__UPPDRAG_FISHING_TEST||localStorage.getItem(KEY+'.demo')==='1'||view!=='demo')return false;
 const p=pilot();if(!p||p.state.record.length||p.state.fishingDemoGranted)return false;
 p.state.daler=12;p.state.fishingDemoGranted=true;p.state.encountered??=[];for(const t of demoTasks())if(!p.state.encountered.includes(t.id))p.state.encountered.push(t.id);
 p.persist();p.refresh?.();localStorage.setItem(KEY+'.demo','1');close();return travel();
}
function tick(t){
 now=t;const place=atQuay()?'quay':atKitchen()?'kitchen':'';if(place!==lastPlace){lastHint='';lastPlace=place;}const paused=document.hidden||occupied()||dialog.open;
 const s=model.tick(now,{present:!!atQuay(),paused});if(s.phase==='question'&&!dialog.open)question();
 action.hidden=!atQuay()||dialog.open||occupied();delivery.hidden=!atKitchen()||!s.state.fish.length||dialog.open||occupied();
 action.textContent=s.state.rod?(s.phase==='waiting'?'Veva in · mellanslag':'Fiska · mellanslag'):'Fiskespö · 10 daler';
 delivery.textContent='Lämna fisk till '+receiver;
 hint.hidden=dialog.open||occupied()||!atQuay()&&!atKitchen();
 if(!hint.hidden)hint.textContent=lastHint||(atQuay()?(s.state.rod?'Mellanslag: kasta ut. Vid napp får du en minnesfråga.':'Jo säljer ett fiskespö för 10 daler.'):'Köket köper högst tre fiskar per kapitel för en daler styck.');
 if(t-lastPaint>80){lastPaint=t;draw();}demo();
}
const life=window.UPPDRAG_WORLD_LIFE,oldTick=life.tick;life.tick=function(t,cfg){const ret=oldTick.apply(this,arguments);tick(t);return ret;};
window.UPPDRAG_EVENT_ENGINE?.register({id:'quay-fishing',type:'sidequest',region:'main',chapters:[4,5],usesRetrieval:true});
Object.defineProperties(api,{busy:{get:()=>dialog.open||model.snapshot().phase==='waiting'},blocking:{get:()=>dialog.open},testProtection:{get:()=>!!window.__UPPDRAG_FISHING_TEST&&!model.snapshot().state.rod},snapshot:{get:()=>model.snapshot()},fishCount:{get:()=>model.snapshot().state.fish.length}});
Object.assign(api,{shop,cast,deliver,travel:()=>travel(),travelKitchen:()=>travel(true),interact:()=>atQuay()&&!occupied()&&!dialog.open?cast():false,
 journalHTML:()=>{const s=model.snapshot().state;return '<p><b>Fisket vid Kajen:</b> '+(s.rod?'Spöet är ditt. '+s.fish.length+' fisk'+(s.fish.length===1?'':'ar')+' i korgen. Köket har köpt '+s.chapters[chapter].delivered+' av 3 fiskar i kapitlet.':'Jo säljer ett spö för 10 daler. Rätt minnessvar vid napp ger fisk. Köket betalar en daler per fisk, högst tre per kapitel.')+'</p>';}});
})();
