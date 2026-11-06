/* Chapter 4: real room meetings and the optional cookbook delivery.
 * Knowledge, story visits and the existing sidequest keep separate saves. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==4)return;
const pilot=UPPDRAG_CH4_PILOT,engine=UPPDRAG_EVENT_ENGINE,side=UPPDRAG_CH4_SIDEQUEST;
const key='uppdrag1700.ch4-meetings.v1';
const readPrior=(k,d={})=>{try{return JSON.parse(localStorage.getItem(k)||'null')||d;}catch{return d;}};
let story;try{story=JSON.parse(localStorage.getItem(key)||'null');}catch{}
if(!story||story.v!==1)story={v:1,seen:{}};story.seen??={};
const save=()=>{try{localStorage.setItem(key,JSON.stringify(story));}catch{}};
const ids={church:'reading',print:'freedoms',science:'research',farm:'ekeblad'};
const names={cafe:'Kaffehuset',church:'Kyrkan',print:'Tryckeriet',science:'Vetenskapens hus',farm:'Byn',archive:'Arkivet',homes:'Bostadskvarteren',barnhus:'Barnhuset'};
const dates={church:'Läsning och makt · 1700-talet',print:'1766 · tryckfrihet och insyn',science:'Forskning under 1700-talet',farm:'Eva Ekeblads undersökningar · 1700-talet',homes:'Ett fiktivt hushåll · kokboken utkom 1755',barnhus:'Dramatiserat besök av Cajsa Warg'};
const time=document.createElement('div');time.id='ch4TimeCard';time.hidden=true;roomView.querySelector('.room-top').after(time);
const streetTime=document.createElement('div');streetTime.id='ch4StreetTime';streetTime.hidden=true;stage.append(streetTime);
const css=document.createElement('style');css.textContent=`
#ch4TimeCard{flex:0 0 auto;padding:4px 12px;background:#fff6e5;border-bottom:1px solid #ac9a7b;color:#5b4c36;font:12px Georgia}
#ch4StreetTime{position:absolute;left:50%;top:8px;transform:translateX(-50%);z-index:25;max-width:calc(100% - 24px);padding:6px 10px;background:#fff6e5ed;border:1px solid #ac9a7b;color:#5b4c36;font:12px Georgia;pointer-events:none}
#ch4BookAction{position:absolute;transform:translate(-50%,-50%);z-index:6;min-width:70px;min-height:44px;padding:5px 9px;border:1px solid #8d7553;border-radius:4px;background:#f7ebd8e6;color:#392f23;font:14px Georgia;cursor:pointer}
#ch4BookAction:focus-visible{outline:3px solid #286472;outline-offset:3px}
body[data-room-side-speech] #ch1Hud{display:none!important}
@media(max-width:620px){#ch4TimeCard,#ch4StreetTime{font-size:11px}}
`;document.head.append(css);
UPPDRAG_CH4_PRESENTATION.install();
let lastRoom=null,travelTarget=null,lastSidePhase=side.phase;
const room=()=>interior&&!voyage?(interior.outdoor?'quay':interior.kind):null;
const idle=()=>!engine.busy&&!pilot.studyBusy&&!UPPDRAG_MEETINGS.state.talking&&!UPPDRAG_CH4_CITY_LIFE.active&&!voyage;
function stamp(p,caption){time.textContent=caption||dates[p]||'Samtal i staden · dramatiserade repliker';time.hidden=!p;}
function pose(who,geo){
 if(who==='Cajsa Warg'&&geo.visitorPose)return geo.visitorPose;
 return geo.poses[who==='Du'?0:1]||geo.poses[0];
}
function speak(lines,choices=[],action=()=>{}){
 if(!interior||!idle())return false;
 UPPDRAG_CH3_NPC_MOTION?.approach(performance.now());
 return engine.speakRoom({room:interior.kind,title:'Samtal',lines,choices,action,pose,closed:()=>UPPDRAG_CH3_NPC_MOTION?.returnToWork(performance.now())});
}
function offer(p,lines){
 const area=UPPDRAG_MASTERY.snapshot().state.areas[ids[p]],host={church:'Olof',print:'Brita',science:'Sam',farm:'Sigrid'}[p];
 const clear=Object.values(area).every(x=>x.status==='clear'),choices=[];
 if(!clear)choices.push(['study','Se '+({church:'läsboken',print:'tryckbladet',science:'forskarbladen',farm:'försöksanteckningen'}[p])+'.']);
 if(p==='science')choices.push(['writing','Jag vill förklara vad arbetena betydde.']);
 choices.push(['later','Vi ses senare.']);
 return speak(clear?[[host,'Välkommen tillbaka! Vill du arbeta vidare med det vi har pratat om?']]:lines,choices,a=>{if(room()!==p)return;if(a==='study')pilot.enterMemory(ids[p]);if(a==='writing')window.UPPDRAG_CH4_BOOKWORK?.open();});
}
function openRoom(p){
 if(room()!==p||!idle())return false;
 stamp(p);const first=!story.seen[p];story.seen[p]=true;save();
 if(p==='homes'){
  if(side.phase==='carrying')return speak([['Karin','Har du hittat kokboken?'],['Du','Ja, Brita hade ett exemplar.'],['Karin','Vad bra! Då kan jag prova recepten till grannarnas måltid.']],[['deliver','Varsågod, här är boken.'],['later','Jag kommer tillbaka.']],a=>{
   if(a==='deliver'&&side.accept('deliver')){renderInterior();UPPDRAG_MEETINGS.redraw();speak([['Karin','Tack! Jag sätter igång med maten. Titta förbi när du varit ute på stan en stund.']]);}
  });
  if(side.phase==='unfound')return speak([['Karin',first&&(readPrior('uppdrag1700.ch3-courtyard.v1').phase==='open'||readPrior('uppdrag1700.ch2-window-bed.v1').phase==='delivered')?'Du igen! Jag tänkte bjuda grannarna på mat. Nu behöver jag några nya recept.':'Jag vill bjuda grannarna på mat, men jag skulle behöva några nya recept.'],['Du','Vet du var det finns en kokbok?'],['Karin','Brita har fått ett exemplar av Cajsa Wargs bok. Fråga henne i Tryckeriet.']]);
  if(side.phase==='delivered')return speak([['Karin','Jag håller på med maten. Gå och gör dina ärenden så länge.']]);
  return speak([['Karin','Där är du! Kom och sitt med oss.'],['Du','Det doftar ända ut på gatan.'],['Karin','Boken gav mig idéer till hela måltiden. Nu får grannarna smaka.']]);
 }
 if(p==='cafe')return speak([['Maja',first?'Fler människor läser och pratar om sådant som de förut bara fick höra talas om.':'Välkommen tillbaka! Har du hört något nytt ute i staden?'],['Du','Var kan jag börja?'],['Maja','Olof har läsböckerna. Brita vill reda ut två friheter. Sam och Sigrid arbetar med forskning. Välj själv vem du vill besöka.']],[['book','Visa minnesboken.'],['later','Jag går och ser mig om.']],a=>{if(a==='book')pilot.acceptMajaMission();});
 if(p==='archive')return speak([['Rut','Vad minns du från böckerna? Vi kan pröva begreppen, blanda frågor eller skriva längre förklaringar.']],[['terms','Jag prövar begreppen.'],['practice','Vi blandar frågorna.'],['writing','Jag vill förklara och jämföra.']],a=>{if(room()!=='archive')return;if(a==='practice')pilot.enterArchive();if(a==='terms')pilot.enterMaterialReview();if(a==='writing')window.UPPDRAG_CH4_BOOKWORK?.open();});
 if(p==='barnhus')return speak([['Siri','Välkommen tillbaka. Cajsa är här på besök i köket.'],['Du','Kan jag prata med henne?'],['Siri','Ja, hon står här bredvid.']]);
 if(p==='quay')return speak([['Jo','Böcker och brev följer också med fartygen. Det är inte bara varor som färdas långt.']]);
 if(p==='church')return offer(p,first?[['Olof','Den här boken har många barn stavat sig igenom. Katekesen handlar om kristendomens viktigaste delar.'],['Du','Vad händer när man sedan kan läsa själv?'],['Olof','Då kan man jämföra det någon säger med det som står i boken. Det kan väcka besvärliga frågor.']]:[['Olof','Vad minns du om läsundervisningen och möjligheten att läsa själv?']]);
 if(p==='print')return offer(p,first?[['Brita','Jag vill ge ut en egen text. Och jag vill läsa vad myndigheten faktiskt har beslutat.'],['Du','Är det samma frihet?'],['Brita','Nej. Tryckfriheten gäller att publicera. Offentlighetsprincipen handlar om insyn i handlingar. Vi behöver hålla isär dem.']]:[['Brita','Ska vi reda ut skillnaden mellan att publicera och att få insyn?']]);
 if(p==='science')return offer(p,first?[['Sam','Någon har lagt forskarnas anteckningar i fel högar.'],['Du','Vad finns i dem?'],['Sam','Växter och djur hos Linné, temperatur hos Celsius och undersökningar av syre hos Scheele.'],['Sam','Här finns också anteckningen om Vetenskapsakademien. Vi behöver kunna förklara vad som skiljer en undersökning från en gissning.']]:[['Sam','Vad minns du om forskarnas arbeten och vetenskapliga undersökningar?']]);
 if(p==='farm')return offer(p,first?[['Sigrid','Här står både potatis och en skål med mjöl.'],['Du','Hör de ihop?'],['Sigrid','Ja. Jag läser om Eva Ekeblads försök. Hon undersökte hur potatis kunde användas till bland annat mjöl och brännvin.']]:[['Sigrid','Minns du vad Eva Ekeblad undersökte och vad potatisen kunde användas till?']]);
 return false;
}
function openCookbook(){
 if(room()!=='print'||!idle())return false;
 stamp('print','1755 · Cajsa Wargs kokbok · fiktiv leverans');
 if(side.phase!=='unfound')return speak([['Brita',side.phase==='carrying'?'Du har kokboken. Karin väntar i Bostadskvarteren.':'Tack för att boken kom fram.']]);
 return speak([['Brita','Det där är Cajsa Wargs kokbok. Karin vill låna den till en måltid för grannarna.'],['Du','Kan jag lämna den?'],['Brita','Gärna. Ta med den till Bostadskvarteren.']],[['take','Jag tar med boken.'],['later','Jag återkommer.']],a=>{
  if(a==='take'&&side.accept('take')){renderInterior();UPPDRAG_MEETINGS.redraw();speak([['Brita','Tack. Hälsa Karin från mig!']]);}
 });
}
function openCajsa(){
 if(room()!=='barnhus'||!idle())return false;
 stamp('barnhus','Efter 1755 · dramatiserat gästbesök');
 return speak([['Cajsa Warg','Vi försöker få arbetet i köket att flyta. Mat, ved och redskap måste finnas till hands.'],['Du','Har du samlat dina råd i en bok?'],['Cajsa Warg','Ja, min hushållsbok kom ut 1755. Brita har ett exemplar hos sig.']]);
}
function travel(p){
 UPPDRAG_CH4_CITY_LIFE.suspend();
 if(!idle()||!names[p])return false;
 if(room()===p)return openRoom(p);
 if(interior)leaveInterior();
 if(region.id!=='main'){travelTarget=p;return requestHarbour('main');}
 travelTarget=null;
 const b=region.buildings.find(b=>b.name===names[p]);return !!b&&requestInterior(b);
}
function continueTravel(){
 if(!travelTarget||voyage||pilot.studyBusy||engine.busy)return;
 if(interior?.outdoor){
  if(region.id!=='main'){departHarbour('main');return;}
  const p=travelTarget;travelTarget=null;leaveInterior();travel(p);
 }
}
const bookAt=tall=>tall?{x:365,y:800,w:86,h:46}:{x:442,y:480,w:80,h:42};
function drawBook(g,x,y,w=80,h=42){
 g.save();g.translate(x,y);g.rotate(-.06);g.fillStyle=UPPDRAG_PAPER_FIBRES.material(g,'#866d50','piece');g.fillRect(-w/2,-h/2,w,h);g.fillStyle=UPPDRAG_PAPER_FIBRES.material(g,'#e8dabf','piece');g.fillRect(-w/2+5,-h/2+5,w-10,h-10);g.strokeStyle='#6b604d';g.lineWidth=1;for(let i=0;i<3;i++){g.beginPath();g.moveTo(-w*.25,-8+i*7);g.lineTo(w*.25,-8+i*7);g.stroke();}g.restore();
}
function drawProps(g,p,tall){
 if(p==='print'&&side.phase==='unfound'){const b=bookAt(tall);drawBook(g,b.x,b.y,b.w,b.h);}
 if(p==='homes'&&['delivered','feast'].includes(side.phase))drawBook(g,tall?345:840,tall?580:430,65,35);
}
function positionBook(){
 const b=document.getElementById('ch4BookAction');if(!b||b.hidden)return;
 const geo=UPPDRAG_MEETINGS.geometryForRoom();if(!geo)return;
 const p=bookAt(geo.w/geo.h<1.02);b.style.left=(geo.left+geo.p.x+p.x*geo.p.scale)+'px';b.style.top=(geo.top+geo.p.y+(p.y+45)*geo.p.scale)+'px';
}
function streetDate(id){
 const labels={celsius:'Återblick · Celsius under 1740-talet',elisabet:'Återblick · 1730-talets gråkoltar · en fiktiv gestalt',linne:'Carl von Linné · ett dramatiserat möte',ekeblad:'Eva Ekeblad · ett dramatiserat möte',dalarna:'En fiktiv bonde efter upproret 1743'};
 streetTime.textContent=labels[id]||'';streetTime.hidden=!labels[id];
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
 if(pilot.studyBusy||engine.busy)UPPDRAG_CH4_CITY_LIFE.suspend();
 else if(UPPDRAG_CH4_CITY_LIFE.active&&(!interior&&path.length||!!interior))UPPDRAG_CH4_CITY_LIFE.close();
 continueTravel();positionBook();
 if(lastRoom!==interior){lastRoom=interior;stamp(room());streetDate(null);}
 if(side.phase!==lastSidePhase){lastSidePhase=side.phase;if(interior){renderInterior();UPPDRAG_MEETINGS.redraw();}}
}
function goal(){return {unfound:'Fråga Karin i Bostadskvarteren eller se kokboken hos Brita.',carrying:'Lämna kokboken till Karin i Bostadskvarteren.',delivered:'Karin förbereder maten. Gå ett ärende i staden och återvänd.',feast:'Grannarnas måltid är framdukad. Besök Karin igen när du vill.'}[side.phase];}
window.UPPDRAG_CH4_SCENES={openRoom,openCookbook,openCajsa,travel,tick,drawProps,drawInheritedBed,streetDate,goal,get busy(){return !!window.UPPDRAG_CH4_BOOKWORK?.busy;},journalHTML:()=>'<p><b>Kokboken och grannarna:</b> '+goal()+'</p>'};
})();
