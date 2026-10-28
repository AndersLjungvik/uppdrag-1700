/* Krig eller fred? Dated scenes, a persistent courtyard and quiet street checks.
 * Story and furniture never award stamps or change money, apples or history. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==3)return;
const pilot=window.UPPDRAG_CH3_PILOT,engine=window.UPPDRAG_EVENT_ENGINE,Q=window.UPPDRAG_CH3_COURTYARD_PUZZLE;
const storyKey='uppdrag1700.ch3-timeline.v1',courtKey='uppdrag1700.ch3-courtyard.v1';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||d;}catch{return d;}};
const timeline=read(storyKey,{v:1,phase:0,seen:{},afterUprising:false,distance:0,nextPatrol:650,lastPatrol:0});
timeline.seen??={};timeline.phase=Math.max(0,Math.min(3,Number(timeline.phase)||0));
timeline.distance=Math.max(0,Number(timeline.distance)||0);timeline.nextPatrol=Math.max(0,Number(timeline.nextPatrol)||650);
const court=read(courtKey,{v:1,phase:'available',layout:{...Q.initial},revisited:false});
if(!['available','talked','agreed','arranging','open'].includes(court.phase))court.phase='available';
court.layout={a:Q.slots[court.layout?.a]?court.layout.a:Q.initial.a,b:Q.slots[court.layout?.b]?court.layout.b:Q.initial.b};
const art=UPPDRAG_CH3_PRESENTATION.install();
const copy=x=>JSON.parse(JSON.stringify(x));
const saveStory=()=>{try{localStorage.setItem(storyKey,JSON.stringify(timeline));}catch{}};
const saveCourt=()=>{try{localStorage.setItem(courtKey,JSON.stringify(court));}catch{}};
let controls=null,targets=null,summary=null,selected='a',travelTarget=null,lastPlayer=null,lastRoom=null,challenge=null,patrolBar=null;
let footerInert=false,selectedSlot='wall';
const order={riksdag:0,square:1,palace:2,fort:3};
const dates={riksdag:'Före kriget 1741–1743',square:'Sommaren 1743 · Stockholm',palace:'Efter kriget 1741–1743',fort:'Senare · Carlsten på Marstrand'};
const aid={riksdag:'parties',palace:'war',square:'uprising',fort:'david'};
const names={riksdag:'Riksdagshuset',palace:'Slottet',square:'Torget',courtyard:'Bostadskvarteren',archive:'Arkivet',cafe:'Kaffehuset',print:'Tryckeriet',fort:'Fästningen'};
const time=document.createElement('div');time.id='ch3TimeCard';time.hidden=true;roomView.querySelector('.room-top').after(time);
const revisit=document.createElement('button');revisit.id='ch3VisitFort';revisit.type='button';revisit.textContent='Återbesök Carlsten';revisit.hidden=true;worldFooter.append(revisit);revisit.onclick=()=>travel('fort');
const squareButton=document.createElement('button');squareButton.id='ch3Square';squareButton.type='button';squareButton.textContent='Möt bönderna på Torget';worldFooter.append(squareButton);squareButton.onclick=()=>travel('square');
const style=document.createElement('style');style.textContent=`
#ch3TimeCard{position:relative;flex:0 0 auto;padding:4px 12px;border-bottom:1px solid #ac9a7b;background:#fff6e5ed;color:#5b4c36;font:13px Georgia;max-width:100%;pointer-events:none}
#ch3CourtyardControls{position:relative;flex:0 0 auto;z-index:25;width:100%;max-height:38%;overflow:auto;padding:12px;background:#fff9e9;border:1px solid #998564;color:#352b20;font:15px/1.4 Georgia;box-sizing:border-box}
#ch3CourtyardControls p{margin:4px 0 9px}#ch3CourtyardControls .courtActions{display:flex;gap:7px;flex-wrap:wrap}#ch3CourtyardControls button{min-height:44px;padding:8px 12px;font:14px Georgia;border:1px solid #9e8969;background:#f2e8d4;color:#352b20;cursor:pointer}#ch3CourtyardControls [aria-pressed=true]{outline:2px solid #436b5c}#ch3CourtyardTargets{position:absolute;inset:0;pointer-events:none;z-index:24}.courtTarget{position:absolute;transform:translate(-50%,-50%);min-width:44px;min-height:44px;border:2px dashed #625942;border-radius:50%;background:#fff8e83f;color:#352b20;text-shadow:0 1px #fff8e8;font:bold 16px Georgia;pointer-events:auto;cursor:pointer}.courtTarget[data-selected=true]{outline:3px solid #436b5c;outline-offset:1px}.courtTarget:focus-visible,#ch3CourtyardControls button:focus-visible{outline:3px solid #286472;outline-offset:3px}
#ch3Summary{position:absolute;inset:0;z-index:42;display:grid;align-items:center;justify-items:center;background:#e6dcc699;padding:16px;box-sizing:border-box}#ch3Summary article{width:min(600px,100%);max-height:90%;overflow:auto;padding:24px;background:#fff8e9;border:1px solid #a48e69;color:#352b20;font:18px/1.5 Georgia}#ch3Summary h2{font:600 26px Georgia}#ch3Summary button{min-height:44px;padding:10px 15px;font:16px Georgia;background:#e6eadb;border:1px solid #8a795d;color:#352b20;margin:5px 7px 5px 0}
#ch3PatrolReplies{position:absolute;z-index:31;left:50%;bottom:12px;transform:translateX(-50%);width:min(570px,calc(100% - 24px));max-height:40%;overflow:auto;padding:10px;background:#fff8e9;border:1px solid #9e8967;box-sizing:border-box}#ch3PatrolReplies p{margin:0 0 7px;font:600 13px system-ui}#ch3PatrolReplies button{width:100%;min-height:44px;margin:3px 0;padding:9px 12px;text-align:left;font:15px Georgia;background:#e9ebdf;border:1px solid #9d8967;color:#352b20;cursor:pointer}
body[data-room-side-speech] #ch1Hud,body[data-ch3-arranging] #ch1Hud,body[data-ch3-summary] #ch1Hud{display:none!important}body[data-ch3-summary] #meetingPerson{display:none}
@media(max-width:620px){#ch3TimeCard{font-size:11px}#ch3CourtyardControls{padding:9px;font-size:13px}#ch3CourtyardControls button{padding:6px 9px;font-size:13px}#ch3Summary article{padding:18px;font-size:16px}}
`;document.head.append(style);
function room(){return interior?.kind||null;}
function placeKey(){return interior?.outdoor?(region.id==='main'?'quay':region.id==='marstrand'?'marstrandQuay':'colonyQuay'):room();}
function busy(){return !!controls||!!summary;}
function idle(){return !busy()&&!engine.busy&&!pilot.studyBusy&&!UPPDRAG_MEETINGS.state.talking&&!UPPDRAG_CH3_CITY_LIFE.active&&!voyage;}
function redraw(){if(interior){renderInterior();UPPDRAG_MEETINGS.redraw();}positionTargets();}
function personPose(who,geo){
 const tall=geo.w/geo.h<1.02;
 const special={
  Hatten:tall?[210,960,.7]:[410,680,.75],Mössan:tall?[395,950,.7]:[590,675,.75],
  Soldaten:tall?[380,952,.67]:[780,670,.82],Fästningsvakten:tall?[365,965,.64]:[815,675,.85],
  Bonden:room()==='courtyard'?(court.phase==='open'?(tall?[440,825,.57]:[850,535,.61]):(tall?[510,975,.67]:[395,690,.75])):geo.poses[1]
 };
 return who==='Du'?geo.poses[0]:special[who]||geo.poses[1]||geo.poses[0];
}
function speak(lines,choices=[],action=()=>{}){
 if(!interior)return false;
 UPPDRAG_CH3_NPC_MOTION.approach(performance.now());
 return engine.speakRoom({room:room(),title:'Samtal',lines,choices,action,pose:personPose,closed:()=>UPPDRAG_CH3_NPC_MOTION.returnToWork(performance.now())});
}
function stampTime(p,first){
 const n=order[p],prior=timeline.phase;
 if(n===undefined){time.hidden=true;return;}
 const relation=n<prior?'Återblick · ':first&&n>prior+1?'Framåtblick · ':'';
 time.textContent=relation+dates[p];time.hidden=false;
 if(first){timeline.seen[p]=true;timeline.phase=Math.max(prior,n);if(n>=2)timeline.afterUprising=true;saveStory();}
}
function study(p){if(room()!==p)return false;pilot.enterMemory(aid[p]);return true;}
function offerStudy(p,lines){
 const a=aid[p],q=UPPDRAG_MASTERY.summary(),l=q.label.toLocaleLowerCase('sv');
 const complete=UPPDRAG_MASTERY.snapshot().state.areas[a]&&Object.values(UPPDRAG_MASTERY.snapshot().state.areas[a]).every(x=>x.status==='clear');
 if(complete)return speak([[p==='fort'?'Fästningsvakten':p==='palace'?'Amira':p==='square'?'Bonden':'Elin',p==='fort'?'David arbetar fortfarande här. Vill du repetera kan Rut hjälpa dig.':'Välkommen tillbaka. Vi kan fortsätta prata en annan gång.']]);
 return speak(lines,[['study','Pröva '+l+'frågorna.'],['later','Vi ses senare.']],id=>{if(id==='study')study(p);});
}
function openRoom(p){
 if(placeKey()!==p||!idle())return false;
 const first=Object.hasOwn(order,p)&&!timeline.seen[p];stampTime(p,first);
 if(p==='courtyard')return openCourtyard();
 if(p==='archive')return speak([['Rut','Vi övar på tidigare kapitel och sådant du redan mött i trean. Det kostar inget. En avslutad omgång ger ett äpple.']],[['practice','Repetera med Rut.'],['later','Inte just nu.']],id=>{if(id==='practice')pilot.enterArchive();});
 if(p==='cafe')return speak([['Maja','Här går meningarna isär om kriget. Lyssna på människorna och se efter vad handlingarna berättar.']],[['book','Visa minnesboken.'],['later','Jag går vidare.']],id=>{if(id==='book')pilot.acceptMajaMission();});
 if(['quay','marstrandQuay','colonyQuay'].includes(p))return speak([['Jo','Båten kan ta dig till Marstrand. Där finns Carlstens fästning.']]);
 if(p==='print')return speak([['Brita','Folk säger så mycket om det som har hänt. Jag vill veta vad som faktiskt går att belägga.']]);
 if(!aid[p])return speak([[UPPDRAG_MEETINGS.state.npc||'En stadsbo',p==='barnhus'?'Välkommen tillbaka. Här försöker vi få vardagen att fungera för barnen.':'God dag. Det är mycket att prata om i staden just nu.']]);
 if(p==='riksdag'){
  if(!first)return offerStudy(p,[['Elin','Vad minns du om hattarna, mössorna och deras samarbeten?']]);
  return speak([['Hatten','Vi måste ta tillbaka det vi har förlorat!'],['Mössan','Och vem ska betala för ännu ett krig?'],['Du','Ni verkar vilja helt olika saker.'],['Mössan','Lyssna på oss båda innan du bestämmer vad du tror.']],
   [['hat','Varför vill du kriga?'],['cap','Varför vill du undvika krig?']],id=>{
    const lines=id==='hat'?[['Hatten','Jag hoppas att Sverige kan vinna tillbaka mark. Frankrike är det land vi vill samarbeta med.'],['Mössan','Vi vill hellre närma oss England och vara försiktigare med krig.']]:[['Mössan','Jag vill inte kasta in Sverige i ännu ett dyrt krig. Vi vill hellre närma oss England.'],['Hatten','Vi vill ta tillbaka mark och samarbeta med Frankrike.']];
    offerStudy(p,[...lines,['Elin','Båda grupperna tog också emot pengar från andra länder för att påverkas. Det behöver du känna till när du lyssnar.']]);
   });
 }
 if(p==='palace'){
  if(!first)return offerStudy(p,[['Amira','Kartbladen är undanlagda. Vad minns du om krigets följder?']]);
  return speak([['Amira','De ville vinna tillbaka mark. På mitt nya kartblad måste jag i stället markera det Sverige förlorade.'],['Du','Då gick kriget tvärtom mot vad de hade tänkt?'],['Amira','Ja. Ryssland segrade. Tsarinnan Elisabet fick också inflytande över vem som skulle bli svensk tronföljare.']],
   [['who','Vem ville hon ha?'],['when','Blev den personen kung genast?']],()=>offerStudy(p,[['Amira','Hon stödde Adolf Fredrik. Han valdes till tronföljare 1743. Han blev kung först 1751. Sverige fick lämna områden i Finland, men behöll resten av Finland.']]));
 }
 if(p==='square'){
  if(!first)return offerStudy(p,[['Bonden','Du har hört varför vi protesterade. Nu får du berätta vad du minns.']]);
  return speak([['Bonden','De ber om mer pengar och fler soldater. Vi har redan lämnat ifrån oss så mycket.'],['Du','Är det därför ni har kommit hit?'],['Bonden','De som bestämde om kriget måste svara för det. Vi vill också få säga något om vem som ska bli nästa kung.']],
   [['cost','Vad har kriget kostat er?'],['change','Vad vill ni att de som bestämmer ska göra?'],['summary','Visa vad som hände sedan.']],id=>{
    if(id==='summary')return showSummary();
    const line=id==='cost'?'Mer skatt och fler män som skickas ut som soldater. Det går inte att fortsätta så här.':'De ansvariga måste stå till svars. Vi vill inte att Adolf Fredrik ska bli kung.';
    speak([['Bonden',line],['Soldaten','Jag har fått order att stoppa dem.'],['Du','Vill du det?'],['Soldaten','Jag vill inte rikta ett vapen mot människor som kunde vara mina grannar.']],[['summary','Följ berättelsen.']],showSummary);
   });
 }
 if(p==='fort'){
  if(!first)return offerStudy(p,[['Fästningsvakten','Här finns minnesprovet om Davids vägran och straff.']]);
  return speak([['Du','Jag har hört att du vägrade skjuta.'],['David','Mot bönderna, ja.'],['Du','Vad hände sedan?'],['David','Jag dömdes till döden. Straffet ändrades. Nu är jag här och arbetar.']],
   [['hard','Det måste ha varit svårt att vägra.'],['obey','De andra säger att en soldat måste lyda.']],id=>offerStudy(p,[['David',id==='hard'?'Det gjorde inte följderna lättare. Men jag ville inte skjuta mot dem.':'Det var också vad jag fick höra. Ändå vägrade jag.'],['Fästningsvakten','Dödsstraffet ändrades till straffarbete här på Marstrand. Minnesprovet gäller handlingen och straffet.']]));
 }
 return false;
}
function showSummary(){
 if(room()!=='square'||busy()||engine.busy||pilot.studyBusy)return false;
 timeline.afterUprising=true;saveStory();summary=document.createElement('section');summary.id='ch3Summary';summary.setAttribute('role','dialog');summary.setAttribute('aria-modal','true');summary.setAttribute('aria-label','Vad som hände på Norrmalm');
 summary.innerHTML='<article><p>Sommaren 1743 · Norrmalm</p><h2>Upproret slogs ned</h2><p>Soldater öppnade eld mot bönderna. Många dödades. Protesterna fick ett våldsamt slut.</p><p>I boken kallas händelsen Stora daldansen. Ett annat namn är Dalaupproret 1743.</p><button data-summary="study">Till minnesprovet</button><button data-summary="close">Tillbaka till Torget</button></article>';
 stage.append(summary);footerInert=roomFooter.inert;roomFooter.inert=true;document.body.dataset.ch3Summary='true';
 summary.addEventListener('click',e=>{const action=e.target.closest('[data-summary]')?.dataset.summary;if(!action)return;closeSummary();if(action==='study')study('square');});summary.querySelector('button').focus();return true;
}
function closeSummary(){if(!summary)return;summary.remove();summary=null;roomFooter.inert=footerInert;delete document.body.dataset.ch3Summary;UPPDRAG_MEETINGS.redraw();}
function openCourtyard(){
 if(room()!=='courtyard'||!idle())return false;
 if(court.phase==='arranging')return startArrangement();
 if(court.phase==='open'){
  const line=court.revisited?(timeline.afterUprising?'Det är lugnare på gatan nu. Här går det fortfarande bra att vila.':'Några åt gången fungerar bra. Nu kommer vi fram till dörren.'):'Han berättade om gården han lämnat. Förut såg jag bara en hel folkmassa.';
  court.revisited=true;saveCourt();return speak([['Karin',line]]);
 }
 if(court.phase==='agreed')return speak([['Karin','Några åt gången, då. Men tunnorna står framför bänken.']],[['arrange','Jag hjälper dig att flytta dem.'],['later','Jag fortsätter senare.']],id=>{if(id==='arrange')startArrangement();});
 if(court.phase==='talked')return negotiate();
 const helped=read('uppdrag1700.ch2-window-bed.v1',{}).phase==='delivered';
 const line=timeline.afterUprising?'Det har lugnat sig på gatan, men jag måste kunna komma åt min egen dörr.':'De blir fler och fler. Jag tänker inte släppa in någon.';
 return speak([['Karin',helped?'Du kom tillbaka. Det var du som hjälpte mig med barnets täcke.':'Vad vill du?'],['Karin',line],['Bonden','Jag vill inte ha hennes hus. Bara någonstans att sitta en stund.']],
  [['talk','Jag lyssnar på er båda.'],['later','Jag kommer förbi senare.']],id=>{if(id==='talk'){court.phase='talked';saveCourt();negotiate();}});
}
function negotiate(){return speak([['Du','Vad är du rädd ska hända?'],['Karin','Att alla tränger sig in. Jag måste kunna komma åt min egen dörr.'],['Du','Kan några vila här om dörren lämnas fri?'],['Bonden','Vi kan turas om. Alla behöver inte gå in samtidigt.']],
 [['agree','Föreslå några åt gången.'],['later','Vi kan prata vidare senare.']],id=>{if(id==='agree'){court.phase='agreed';saveCourt();openCourtyard();}});}
function startArrangement(){
 if(room()!=='courtyard'||!idle()||!['agreed','arranging'].includes(court.phase))return false;
 court.phase='arranging';saveCourt();controls=document.createElement('section');controls.id='ch3CourtyardControls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Ordna gården tillsammans med Karin');
 controls.innerHTML='<p><b>Gör plats vid bänken.</b> Välj en tunna och tryck sedan på en plats i gården. Lämna gången och dörren fria.</p><div class="courtActions"><button data-court="a" aria-pressed="true">Tunna 1</button><button data-court="b" aria-pressed="false">Tunna 2</button><button data-court="check">Visa Karin</button><button data-court="guide">Visa en placering</button><button data-court="close">Fortsätt senare</button></div><p id="ch3CourtMessage" aria-live="polite">Alla försök är fria. Du kan använda Tab och Enter.</p>';
 targets=document.createElement('div');targets.id='ch3CourtyardTargets';
 for(const [i,[id,slot]]of Object.entries(Q.slots).entries()){const b=document.createElement('button');b.className='courtTarget';b.type='button';b.textContent=String(i+1);b.dataset.slot=id;b.setAttribute('aria-label',slot.label);b.onclick=()=>{
  const occupant=['a','b'].find(barrel=>court.layout[barrel]===id);
  if(occupant){selected=occupant;updateSelection();controls.querySelector('#ch3CourtMessage').textContent='Välj nu var tunna '+(selected==='a'?1:2)+' ska stå.';return;}
  place(id);
 };targets.append(b);}
 roomView.append(targets,controls);selected='a';footerInert=roomFooter.inert;document.body.dataset.ch3Arranging='true';
 controls.addEventListener('click',e=>{const a=e.target.closest('[data-court]')?.dataset.court;if(!a)return;
  if(a==='a'||a==='b'){selected=a;updateSelection();}
  if(a==='close')closeArrangement();
  if(a==='guide'){court.layout={...Q.example};saveCourt();redraw();controls.querySelector('#ch3CourtMessage').textContent='Här är en placering. Det finns fler sätt. Visa Karin när du är klar.';}
  if(a==='check'){const result=Q.check(court.layout);if(!result.ok){controls.querySelector('#ch3CourtMessage').textContent='Karin: '+result.reason;return;}court.phase='open';saveCourt();closeArrangement();redraw();speak([['Karin','Nu går det. Jag öppnar grinden.'],['Bonden','Tack. Mina ben tänker inte gå en meter till just nu.']]);}
 });redraw();controls.querySelector('button').focus();return true;
}
function place(id){if(!controls||!Q.slots[id])return false;court.layout[selected]=id;selectedSlot=id;saveCourt();redraw();controls.querySelector('#ch3CourtMessage').textContent='Prova en annan plats om du vill. När det finns rum kan du visa Karin.';return true;}
function updateSelection(){controls?.querySelectorAll('[data-court="a"],[data-court="b"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.court===selected)));positionTargets();}
function positionTargets(){
 if(!targets)return;const geo=UPPDRAG_MEETINGS.geometryForRoom();if(!geo)return;const Y=art.yardFrame(geo.w/geo.h<1.02);
 for(const [i,b]of [...targets.querySelectorAll('[data-slot]')].entries()){const slot=Q.slots[b.dataset.slot],occupant=['a','b'].find(id=>court.layout[id]===b.dataset.slot);b.style.left=(geo.left+geo.p.x+(Y.x+slot.x*Y.sx)*geo.p.scale)+'px';b.style.top=(geo.top+geo.p.y+(Y.y+slot.y*Y.sy)*geo.p.scale)+'px';b.textContent=occupant?'T'+(occupant==='a'?1:2):String(i+1);b.dataset.selected=String(!!occupant&&occupant===selected);b.setAttribute('aria-label',occupant?'Välj tunna '+(occupant==='a'?1:2):'Lägg tunna '+(selected==='a'?1:2)+' '+slot.label.toLocaleLowerCase('sv'));}
}
function closeArrangement(){if(!controls)return;controls.remove();targets.remove();controls=null;targets=null;roomFooter.inert=footerInert;delete document.body.dataset.ch3Arranging;redraw();document.getElementById('meetingPerson')?.focus({preventScroll:true});}
function requestPlace(p){
 if(p==='quay')return requestHarbour();
 const b=p==='square'?{name:'Torget',entry:'square'}:region.buildings.find(b=>b.name===names[p]);return !!b&&requestInterior(b);
}
function travel(p){
 UPPDRAG_CH3_CITY_LIFE.suspend();
 if(!idle())return false;
 if(room()===(p==='homes'?'courtyard':p))return openRoom(room());
 if(interior)leaveInterior();
 if(p==='fort'&&region.id==='main'){travelTarget='fort';return requestHarbour('marstrand');}
 if(p!=='fort'&&region.id==='marstrand'){travelTarget=p;return requestHarbour('main');}
 if(region.id==='colony'){travelTarget=p;return requestHarbour('main');}
 travelTarget=null;return requestPlace(p);
}
function continueTravel(){
 if(!travelTarget||voyage||pilot.studyBusy||engine.busy)return;
 const wantsIsland=travelTarget==='fort';
 if(interior?.outdoor){
  if(wantsIsland&&region.id==='main'){departHarbour('marstrand');return;}
  if(!wantsIsland&&region.id!=='main'){departHarbour('main');return;}
  const target=travelTarget;travelTarget=null;leaveInterior();requestPlace(target);
 }
}
function drawProps(g,p,tall,now,puppets){
 const speaking=engine.roomSpeaker;
 const person=(name,pos,color,extra={})=>puppets.side(...pos,{name,color,...extra},false,now,speaking===name,false,false,0,0,null);
 if(p==='riksdag'){person('Hatten',tall?[210,960,.7]:[410,680,.75],'#75604b');person('Mössan',tall?[395,950,.7]:[590,675,.75],'#7b866b');}
 if(p==='square'){person('Soldaten',tall?[380,952,.67]:[780,670,.82],'#687b82');if(!timeline.afterUprising)person('En bonde',tall?[260,880,.57]:[550,630,.65],'#8e795c');}
 if(p==='fort')person('Fästningsvakten',tall?[365,965,.64]:[815,675,.85],'#687b82');
 if(p==='courtyard'){
  person('Bonden',court.phase==='open'?(tall?[440,825,.57]:[850,535,.61]):(tall?[510,975,.67]:[395,690,.75]),'#8d7656');
  if(court.phase==='open'&&!timeline.afterUprising)person('En resande',tall?[570,910,.57]:[1085,650,.62],'#7b806b');
 }
}
function drawInheritedBed(g,x,feet,w){
 const bed=read('uppdrag1700.ch2-window-bed.v1',{});if(bed.phase!=='delivered'||!['sail','stripe'].includes(bed.pattern))return;
 g.save();const bx=x+63,by=feet-87,bw=w-76;g.fillStyle=UPPDRAG_PAPER_FIBRES.material(g,'#7d8971','piece');g.fillRect(bx,by,bw,48);
 const px=bx+bw*.42,py=by+9,pw=bw*.43,ph=29;g.fillStyle='#d7c5a4';g.fillRect(px,py,pw,ph);g.strokeStyle='#534e40';g.setLineDash([3,2]);g.strokeRect(px,py,pw,ph);g.setLineDash([]);
 if(bed.pattern==='sail'){g.fillStyle='#6a7b83';g.beginPath();g.moveTo(px+pw*.5,py+3);g.lineTo(px+pw*.5,py+ph-4);g.lineTo(px+4,py+ph-5);g.closePath();g.fill();g.beginPath();g.moveTo(px+pw*.59,py+6);g.lineTo(px+pw-4,py+ph-5);g.lineTo(px+pw*.59,py+ph-5);g.closePath();g.fill();}
 else{g.strokeStyle='#8b6b4e';g.lineWidth=3;for(let i=0;i<3;i++){g.beginPath();g.moveTo(px+9+i*13,py+4);g.lineTo(px+9+i*13,py+ph-4);g.stroke();}}
 g.restore();
}
function tick(){
 if(pilot.studyBusy||busy()||engine.busy)UPPDRAG_CH3_CITY_LIFE.suspend();
 else if(UPPDRAG_CH3_CITY_LIFE.active&&!interior&&path.length)UPPDRAG_CH3_CITY_LIFE.close();
 continueTravel();positionTargets();
 if(lastRoom!==interior){if(controls)closeArrangement();if(summary)closeSummary();lastRoom=interior;time.hidden=true;if(interior&&order[room()]!==undefined)stampTime(room(),false);}
 revisit.hidden=!timeline.seen.fort||!!interior||region.id!=='main';squareButton.hidden=!!interior||region.id!=='main';
 if(!interior&&!voyage&&region.id==='main'){
  const moved=lastPlayer&&lastPlayer.region===region.id?Math.hypot(player.x-lastPlayer.x,player.y-lastPlayer.y):0;
  if(moved>.1&&moved<50&&!engine.busy&&!pilot.studyBusy&&!UPPDRAG_CH3_CITY_LIFE.active){timeline.distance+=moved;if(Math.floor(timeline.distance/160)!==Math.floor((timeline.distance-moved)/160))saveStory();}
  if(moved>.1&&timeline.distance>=timeline.nextPatrol&&Date.now()-(timeline.lastPatrol||0)>45000&&!pendingRoom&&!travelTarget&&idle())maybePatrol();
 }
 lastPlayer={x:player.x,y:player.y,region:region.id};
}
function maybePatrol(){
 const city=UPPDRAG_CH3_CITY_LIFE,actor=city.find(region,'soldiers');
 if(!actor||Math.hypot(actor.x-player.x,actor.y-player.y)>100)return false;
 const known=new Set(pilot.repetitionTaskIds),bank=UPPDRAG_RECALL_BANK.filter(t=>known.has(t.id)&&t.rank===0&&t.fields.length===1&&t.fields[0].options?.length>=3&&t.fields[0].answers?.length);
 if(!bank.length)return false;
 const t=bank[(timeline.patrolCount||0)%bank.length],field=t.fields[0];challenge={actor,t,options:field.options.slice(),answer:field.answers[0]};
 timeline.patrolCount=(timeline.patrolCount||0)+1;timeline.lastPatrol=Date.now();timeline.nextPatrol=timeline.distance+750+(timeline.patrolCount%3)*130;saveStory();path=[];UPPDRAG_WORLD_KEYBOARD.clear();
 if(!city.open(actor,[['Soldaten','Ett ögonblick. Jag vill höra vad du har fått veta.'],['Soldaten',t.prompt]])){challenge=null;return false;}return true;
}
function patrolReplies(actor,last){
 if(!challenge||actor.id!==challenge.actor.id||!last){patrolBar?.remove();patrolBar=null;return;}
 if(patrolBar)return;patrolBar=document.createElement('section');patrolBar.id='ch3PatrolReplies';patrolBar.setAttribute('role','group');patrolBar.setAttribute('aria-label','Du svarar patrullen');patrolBar.innerHTML='<p>Du svarar</p>';
 for(const [i,text]of [...challenge.options,'Jag behöver gå vidare.'].entries()){
  const b=document.createElement('button');b.type='button';b.textContent=text;b.dataset.patrolAnswer=String(i);b.onclick=()=>answerPatrol(i);patrolBar.append(b);
 }stage.append(patrolBar);
}
function answerPatrol(index){
 if(!challenge)return;const q=challenge,skip=index===q.options.length,right=q.options[index]===q.answer;
 UPPDRAG_CH3_CITY_LIFE.close();
 const text=skip?'Gå vidare, då. Ta det lugnt på gatan.':right?'Det stämmer med vad jag har hört. Du kan gå vidare.':'Jag har fått den här uppgiften: '+q.answer.replace(/[.!?]+$/,'')+'. Du kan gå vidare.';
 UPPDRAG_CH3_CITY_LIFE.open(q.actor,[['Soldaten',text]]);
}
function closePatrol(){patrolBar?.remove();patrolBar=null;challenge=null;}
function handleKeydown(e){
 if(e.defaultPrevented||e.isComposing||e.altKey||e.ctrlKey||e.metaKey)return;
 const surface=controls||summary||patrolBar;if(!surface)return;
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;if(controls)closeArrangement();else if(summary)closeSummary();else UPPDRAG_CH3_CITY_LIFE.close();return;}
 const buttons=controls?[...controls.querySelectorAll('button'),...targets.querySelectorAll('button')]:[...surface.querySelectorAll('button')];
 if(e.key==='Tab'){e.preventDefault();e.stopImmediatePropagation();const at=buttons.indexOf(document.activeElement);buttons[(at+(e.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus();return;}
 if((e.key==='Enter'||e.key===' ')&&buttons.includes(document.activeElement)){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)document.activeElement.click();}
}
const goal=()=>({available:'Besök Karin vid den stängda gården i Bostadskvarteren.',talked:'Hjälp Karin och bonden att hitta en överenskommelse.',agreed:'Flytta tunnorna så att bänken och dörrvägen blir fria.',arranging:'Fortsätt ordna plats vid bänken. Alla försök är fria.',open:'Gården är öppen. Tunnorna står där du placerade dem.'})[court.phase];
window.addEventListener('resize',positionTargets);
window.UPPDRAG_CH3_SCENES={openRoom,travel,tick,drawProps,drawInheritedBed,handleKeydown,goal,patrolReplies,closePatrol,
 get busy(){return busy();},get story(){return copy(timeline);},get courtyard(){return copy(court);},
 get streetStep(){return timeline.seen.palace||timeline.seen.fort?9:timeline.afterUprising?7:timeline.phase>=1?3:1;},
 get patrolReplyHeight(){return patrolBar?.getBoundingClientRect().height||0;},
 journalHTML:()=>'<p><b>Den stängda gården:</b> '+goal()+'</p><p>Patruller och människor på gatan pratar med dig på plats. Deras minnesfrågor ger inga stämplar och kostar inget.</p>'};
engine.register({id:'ch3-closed-courtyard',type:'sidequest',chapters:[3],optional:true,usesKnowledgeStamps:false});
engine.register({id:'ch3-street-patrol',type:'surprise',chapters:[3],optional:true,usesRetrieval:true,usesKnowledgeStamps:false});
saveStory();saveCourt();
})();
