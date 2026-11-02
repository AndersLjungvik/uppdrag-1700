/* On-site conversations. Actions, chronology and fiction labels stay outside speech. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==5)return;
const pilot=UPPDRAG_CH5_PILOT,engine=UPPDRAG_EVENT_ENGINE;
const key='uppdrag1700.ch5-meetings.v1';
const readPrior=(k,d={})=>{try{return JSON.parse(localStorage.getItem(k)||'null')||d;}catch{return d;}};
let story;try{story=JSON.parse(localStorage.getItem(key)||'null');}catch{}
if(!story||story.v!==1)story={v:1,seen:{}};story.seen??={};
const save=()=>{try{localStorage.setItem(key,JSON.stringify(story));}catch{}};
const ids={riksdag:'power',palace:'reforms',print:'press',church:'rights'};
const names={cafe:'Kaffehuset',riksdag:'Riksdagshuset',palace:'Slottet',print:'Tryckeriet',church:'Kyrkan',archive:'Arkivet',homes:'Bostadskvarteren',barnhus:'Barnhuset',quay:'Kajen'};
const dates={riksdag:'1771–1772 · kung och statskupp',palace:'Gustav III:s reformer · upplysningens idéer',print:'Efter 1772 · tryckfriheten begränsas',church:'Nya lagar och skilda villkor · grundboken s. 83–85',barnhus:'Gustav III:s tid · Siri arbetar vidare på Barnhuset',quay:'Resa till Marstrand · frivilligt brevuppdrag'};
const time=document.createElement('div');time.id='ch5TimeCard';time.hidden=true;roomView.querySelector('.room-top').after(time);
const streetTime=document.createElement('div');streetTime.id='ch5StreetTime';streetTime.hidden=true;stage.append(streetTime);
const notice=document.createElement('div');notice.id='ch5LetterNotice';notice.hidden=true;notice.setAttribute('role','status');stage.append(notice);
const css=document.createElement('style');css.textContent=`
#ch5TimeCard{flex:0 0 auto;padding:4px 12px;background:#fff6e5;border-bottom:1px solid #ac9a7b;color:#5b4c36;font:12px Georgia}
#ch5StreetTime,#ch5LetterNotice{position:absolute;left:50%;transform:translateX(-50%);z-index:25;max-width:calc(100% - 24px);padding:6px 10px;background:#fff6e5ed;border:1px solid #ac9a7b;color:#5b4c36;font:12px Georgia;pointer-events:none}
#ch5StreetTime{top:8px}#ch5LetterNotice{bottom:24px}body[data-room-side-speech] #ch1Hud{display:none!important}
@media(max-width:620px){#ch5TimeCard,#ch5StreetTime{font-size:11px}}
`;document.head.append(css);
let lastRoom=null,travelTarget=null,noticeUntil=0;
const room=()=>interior&&!voyage?(interior.outdoor?'quay':interior.kind):null;
const idle=()=>!engine.busy&&!pilot.studyBusy&&!UPPDRAG_MEETINGS.state.talking&&!UPPDRAG_CH5_CITY_LIFE.active&&!voyage;
function stamp(p){time.textContent=dates[p]||'Samtal i staden · dramatiserade repliker';time.hidden=!p;}
function speak(lines,choices=[],action=()=>{}){
 if(!interior||!idle())return false;
 UPPDRAG_CH3_NPC_MOTION?.approach(performance.now());
 return engine.speakRoom({room:interior.kind,title:'Samtal',lines,choices,action,pose:(who,geo)=>geo.poses[who==='Du'?0:1],closed:()=>UPPDRAG_CH3_NPC_MOTION?.returnToWork(performance.now())});
}
function offer(p,lines){
 const area=UPPDRAG_MASTERY.snapshot().state.areas[ids[p]],host={riksdag:'Elin',palace:'Amira',print:'Brita',church:'Olof'}[p];
 const clear=Object.values(area).every(x=>x.status==='clear'),choices=[];
 if(!clear)choices.push(['study','Se '+({riksdag:'protokollet',palace:'brevet',print:'tryckbladet',church:'anteckningarna'}[p])+'.']);
 if(p==='palace')choices.push(['writing','Jag vill förklara och jämföra.']);
 choices.push(['later','Vi ses senare.']);
 return speak(clear?[[host,'Välkommen tillbaka! Vill du arbeta vidare med det vi har pratat om?']]:lines,choices,a=>{if(room()!==p)return;if(a==='study')pilot.enterMemory(ids[p]);if(a==='writing')UPPDRAG_CH5_BOOKWORK.open();});
}
function openRoom(p){
 if(['marstrandQuay','colonyQuay'].includes(p))p='quay';
 if(room()!==p||!idle())return false;
 stamp(p);const first=!story.seen[p];story.seen[p]=true;save();
 if(p==='cafe')return speak([['Maja',first?'Har du hört? Kungen har tagit mer makt. Här talar folk om både nya möjligheter och nya begränsningar.':'Välkommen tillbaka! Vad har du fått reda på?'],['Du','Vem kan jag fråga?'],['Maja','Elin har protokollet, Amira läser om de nya lagarna och Brita undrar vad hon får trycka. Olof har anteckningar om människors villkor.']],[['book','Visa minnesboken.'],['later','Då går jag och pratar med dem.']],a=>{if(a==='book')pilot.acceptMajaMission();});
 if(p==='riksdag')return offer(p,first?[['Elin','Här står 1771 på ett blad och 1772 på ett annat. De handlar om två olika händelser.'],['Du','Vad hände 1772?'],['Elin','Kungen använde armén och lät fängsla riksrådet. Sedan godkändes en ny grundlag. Nu kan han bestämma mycket mer själv.']]:[['Elin','Ska vi reda ut maktbytet och varför många välkomnade det?']]);
 if(p==='palace')return offer(p,first?[['Amira','Jag har fått ett brev om de nya lagarna. Tortyr har förbjudits.'],['Du','Har dödsstraffet också försvunnit?'],['Amira','Nej, det finns kvar för några få brott. Men tänkarna i Frankrike talar om frihet och rättigheter. Jag vill förstå hur idéerna hänger ihop med förändringarna här.']]:[['Amira','Vill du läsa om upplysningen och lagarna igen?']]);
 if(p==='print')return offer(p,first?[['Brita','Jag kan fortfarande trycka mycket, men friheten har blivit mindre.'],['Du','Måste någon godkänna alla texter i förväg igen?'],['Brita','Nej, censuren har inte kommit tillbaka. Ändå har det blivit svårare att publicera kritik. Vi behöver skilja på de två sakerna.']]:[['Brita','Minns du vad som ändrades och vad som inte kom tillbaka?']]);
 if(p==='church')return offer(p,first?[['Olof','Jag måste ändra hur jag skriver om barn födda utanför äktenskapet. De ska behandlas lika i pappren.'],['Du','Blir livet lättare för deras mödrar också?'],['Olof','De har fått visst skydd i lagen, men folks fördomar försvinner inte så fort. Här finns också reglerna för judar och katoliker som vill flytta hit.']]:[['Olof','Vilka nya möjligheter fick människorna, och vilka villkor fanns kvar?']]);
 if(p==='archive')return speak([['Rut','Vill du pröva ord och årtal, blanda frågor eller skriva en längre förklaring? Vi kan repetera tidigare kapitel och sådant du redan har mött här.']],[['terms','Jag prövar ord och årtal.'],['practice','Vi blandar frågorna.'],['writing','Jag vill förklara och jämföra.']],a=>{if(room()!=='archive')return;if(a==='terms')pilot.enterMaterialReview();if(a==='practice')pilot.enterArchive();if(a==='writing')UPPDRAG_CH5_BOOKWORK.open();});
 if(p==='quay'){
  if(region.id!=='main')return speak([[region.id==='marstrand'?'Kajvakten':'Hamnarbetaren',region.id==='marstrand'?'Du hittar hamnarbetaren vid kajen och fången utanför Carlsten. Säg till när du vill resa tillbaka.':'Fartyget ligger förtöjt. Säg till när du vill resa tillbaka till staden.']],[['return','Tillbaka till staden.'],['later','Jag ser mig om först.']],a=>{if(a==='return'&&room()==='quay')departHarbour('main');});
  return speak([['Jo','Har du tid att resa till Marstrand? Det finns en fånge vid Carlsten som vill få iväg ett brev.'],['Du','Vem tar hand om posten där?'],['Jo','Prata med hamnarbetaren vid öns kaj. Jag kan ordna resan dit.']],[['sail','Till Marstrand!'],['later','Jag kommer tillbaka.']],a=>{if(a==='sail'&&room()==='quay')departHarbour('marstrand');});
 }
 if(p==='homes')return readPrior('uppdrag1700.ch4-cajsa-cookbook.20261020.v1').phase==='feast'?speak([['Karin','Hej igen! Vi pratar om de nya lagarna över maten.'],['Du','Kom kokboken till nytta?'],['Karin','Ja, och grannarna blev glada för maten. Tack igen för hjälpen.']]):speak([['Karin','Grannarna pratar om de nya lagarna. Men veden ska fortfarande hämtas och maten lagas.'],['Du','Det är mycket att ordna.'],['Karin','Ja. Vi får hjälpas åt så gott det går.']]);
 if(p==='science')return speak([['Sam','Jag ordnar forskarnas anteckningar. Vill du slå dig ner en stund?'],['Du','Jag arbetar med de nya idéerna just nu.'],['Sam','Då har du nytta av att fråga efter belägg och undersöka själv.']]);
 if(p==='farm')return speak([['Sigrid','Potatisen växer bra i år. Jag fortsätter att pröva vad den kan användas till.'],['Du','Lycka till med försöken!'],['Sigrid','Tack. Titta gärna förbi igen.']]);
 if(p==='fort')return speak([['Arvid','Jag håller ordning på arbetet här. En del straff har mildrats, men fångarna får inte gå vart de vill.'],['Du','Det är någon här som behöver få iväg ett brev.'],['Arvid','Du hittar honom utanför fästningen. Prata med honom där.']]);
 if(p==='barnhus')return speak([['Siri','Hej igen! Vi håller på att ordna maten.'],['Du','Behöver du hjälp?'],['Siri','Du får gärna stanna och prata en stund. Barnen blir glada när någon lyssnar.']]);
 return null;
}
function travel(p){
 UPPDRAG_CH5_CITY_LIFE.suspend();
 if(!idle()||!names[p])return false;
 if(room()===p)return openRoom(p);
 if(interior)leaveInterior();
 if(region.id!=='main'){travelTarget=p;return requestHarbour('main');}
 travelTarget=null;
 if(p==='quay')return requestHarbour();
 const b=region.buildings.find(b=>b.name===names[p]);return !!b&&requestInterior(b);
}
function continueTravel(){
 if(!travelTarget||voyage||pilot.studyBusy||engine.busy)return;
 if(interior?.outdoor){if(region.id!=='main'){departHarbour('main');return;}const p=travelTarget;travelTarget=null;leaveInterior();travel(p);}
}
function streetDate(id){
 if(id)lastRoom=interior;
 const labels={david:'Återblick · David Hedenquist efter 1743 · dramatiserat möte',prisoner:'Carlsten · fiktiv fånge och brevberättelse',mason:'Carlsten · fiktiv stenhuggare',moses:'Gustavianska tiden · fiktiv judisk köpman',bela:'Gustavianska tiden · fiktiv judisk handelsidkare',linne:'Carl von Linné · dramatiserat möte',ekeblad:'Eva Ekeblad · dramatiserat möte'};
 streetTime.textContent=labels[id]||'';streetTime.hidden=!labels[id];
}
function goal(){return {waiting:'Res från Kajen till Marstrand. Fången utanför Carlsten behöver få iväg ett brev.',carrying:'Du har brevet. Lämna det till hamnarbetaren vid Marstrands kaj.',delivered:'Brevet är lämnat till hamnarbetaren. Du kan återvända och berätta det för fången.'}[UPPDRAG_CH5_LETTER.phase];}
function letterChanged(){notice.textContent=UPPDRAG_CH5_LETTER.hasLetter?'Du har tagit emot brevet. Hamnarbetaren väntar vid kajen.':'Brevet är lämnat till hamnarbetaren.';noticeUntil=performance.now()+5000;notice.hidden=false;}
function positionReplies(replies){
 if(replies.hidden)return;
 replies.style.top='';replies.style.bottom='12px';
 const geo=window.UPPDRAG_SCENE_PRESENCE?.sceneGeometry();if(!geo)return;
 const s=stage.getBoundingClientRect(),r=replies.getBoundingClientRect(),x=r.left-s.left;
 const overlap=y=>geo.faces.reduce((sum,f)=>sum+Math.max(0,Math.min(x+r.width,f.x+f.w)-Math.max(x,f.x))*Math.max(0,Math.min(y+r.height,f.y+f.h)-Math.max(y,f.y)),0);
 const current=r.top-s.top;if(overlap(current)<.1)return;
 const candidates=[current,geo.bounds.y+8,geo.bounds.y+geo.bounds.h-r.height-8].filter(y=>y>=geo.bounds.y&&y+r.height<=geo.bounds.y+geo.bounds.h);
 candidates.sort((a,b)=>overlap(a)-overlap(b)||Math.abs(a-current)-Math.abs(b-current));
 if(candidates.length){replies.style.top=candidates[0]+'px';replies.style.bottom='auto';}
}
function drawInheritedBed(g,x,feet,w){
 const bed=readPrior('uppdrag1700.ch2-window-bed.v1',{});if(bed.phase!=='delivered'||!['sail','stripe'].includes(bed.pattern))return;
 g.save();const bx=x+63,by=feet-87,bw=w-76;g.fillStyle=UPPDRAG_PAPER_FIBRES.material(g,'#7d8971','piece');g.fillRect(bx,by,bw,48);
 const px=bx+bw*.42,py=by+9,pw=bw*.43,ph=29;g.fillStyle='#d7c5a4';g.fillRect(px,py,pw,ph);g.strokeStyle='#534e40';g.setLineDash([3,2]);g.strokeRect(px,py,pw,ph);g.setLineDash([]);
 if(bed.pattern==='sail'){g.fillStyle='#6a7b83';g.beginPath();g.moveTo(px+pw*.5,py+3);g.lineTo(px+pw*.5,py+ph-4);g.lineTo(px+4,py+ph-5);g.closePath();g.fill();g.beginPath();g.moveTo(px+pw*.59,py+6);g.lineTo(px+pw-4,py+ph-5);g.lineTo(px+pw*.59,py+ph-5);g.closePath();g.fill();}
 else{g.strokeStyle='#8b6b4e';g.lineWidth=3;for(let i=0;i<3;i++){g.beginPath();g.moveTo(px+9+i*13,py+4);g.lineTo(px+9+i*13,py+ph-4);g.stroke();}}
 g.restore();
}
function tick(){
 if(pilot.studyBusy||engine.busy)UPPDRAG_CH5_CITY_LIFE.suspend();
 else if(UPPDRAG_CH5_CITY_LIFE.active&&(!interior&&path.length||!!interior))UPPDRAG_CH5_CITY_LIFE.close();
 continueTravel();
 if(lastRoom!==interior){lastRoom=interior;stamp(room());streetDate(null);}
 if(!notice.hidden&&performance.now()>noticeUntil)notice.hidden=true;
}
window.UPPDRAG_CH5_SCENES={openRoom,travel,tick,streetDate,goal,letterChanged,positionReplies,drawInheritedBed,get inheritedFeast(){return readPrior('uppdrag1700.ch4-cajsa-cookbook.20261020.v1').phase==='feast';},get busy(){return !!window.UPPDRAG_CH5_BOOKWORK?.busy;},journalHTML:()=>'<p><b>Brevet från Carlsten:</b> '+goal()+'</p><p>Frivillig, fiktiv berättelse. Brevet påverkar inga provstämplar eller pengar.</p>'};
})();
