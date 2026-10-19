(function(){
'use strict';
// Kapitel 1 i den befintliga stadens gångmotor. Separat sparfil.
const storage='uppdrag1700.ch1-real-world.20261019.v10';
const facts={
queen:{ab:'2a',a:'Ulrika Eleonora',answers:['ulrika eleonora'],hint:'Hennes namn börjar med U.',q:['Vilken drottning efterträdde Karl XII?','Vad hette Karl XII:s syster som övertog tronen?','En skrivare påstår att drottningen hette Fredrik. Vad hette hon egentligen?']},
absolute:{ab:'2b',a:'Drottningen var inte enväldig: hon kunde inte bestämma ensam utan delade makten med riksrådet och riksdagen.',hint:'Vem mer än drottningen hade makt?',q:['Vad menas med att drottningen inte var enväldig?','Vilken begränsning hade Ulrika Eleonora jämfört med enväldiga kungar?','En anteckning säger att Ulrika Eleonora bestämde allt ensam. Rätta felet.']},
freedom:{ab:'1',a:'Kungens envälde upphörde och riksdagen och riksrådet fick mer makt. Men friheten var fortfarande olika för olika grupper.',hint:'Tänk på kungens makt före och efter 1719.',q:['Varför kallas tiden 1719–1772 för frihetstiden?','Vad förändrades i styret när frihetstiden började?','Varför var makten friare för vissa, men inte lika för alla?']},
trade:{ab:'3',a:'Ostindiska kompaniet skulle handla med Asien, särskilt Kina, och importera te, siden och porslin till Sverige.',hint:'Vad tog handelsfartygen hem från Kina?',q:['Vilken uppgift hade Ostindiska kompaniet?','Varför seglade Ostindiska kompaniets fartyg från Göteborg till Kina?','Ett brev säger att kompaniets uppdrag var att kriga mot Kina. Vad stämmer i stället?']},
law:{ab:'4a',a:'Grundlagen reglerade hur makten skulle delas och hur Sverige skulle styras.',hint:'Vad handlade den nya maktfördelningen om?',q:['Vad skulle den nya grundlagen innehålla tydliga regler för?','Varför skrevs en ny grundlag efter enväldet?','En skrivare säger att grundlagen gav kungen oinskränkt makt. Rätta påståendet.']},
change:{ab:'4b',a:'Enligt grundbokens text kunde den bara ändras om hela riksdagen var överens.',hint:'Det krävdes särskild enighet.',q:['När kunde grundlagen ändras enligt grundboken?','Varför kunde inte en ensam riksdagsman ändra grundlagen?','En adelsman säger att han själv får ändra grundlagen. Vilket krav har han glömt?']},
nobles:{ab:'4c',a:'Adeln hade störst makt. Viktiga beslut togs på särskilda möten där bönderna inte fick vara med.',answers:['adeln','adel'],hint:'Ett av de fyra stånden.',q:['Vilket stånd hade mest makt i riksdagen?','Vilket stånd dominerade de viktiga besluten?','Hur kunde adeln ha störst inflytande trots att fyra stånd fanns?']}
};
const paths={cafe:'Kaffehuset',palace:'Slottet',quay:'Kajen',riksdag:'Riksdagshuset'};
const runs=[
 {p:'cafe',r:0,f:[],who:'Maja',hello:'Vad skönt att se dig! Jag har en sak jag behöver hjälp med …',bye:'Du, kan du börja hos Amira på slottet? Hon såg så vilsen ut när hon gick förbi här.'},
 {p:'palace',r:0,f:['queen','absolute','freedom'],who:'Amira',hello:'Där är du! Jag satt med ett brev om tiden efter Karl XII och plötsligt blev allt blankt. Till och med namnet på drottningen är borta. Kan du hjälpa mig?',bye:'Nu minns jag igen! Minns du Jo vid kajen? Han behöver nog också hjälp … tror jag.'},
 {p:'quay',r:0,f:['trade'],who:'Jo',hello:'Se på det här! Jag har en handelslista, en tunna och ett helt fartyg. Men vad var det nu vi skulle göra med allt? Det är som bortblåst!',bye:'Jaha! Där föll det på plats. Du, Elin i riksdagshuset stod och muttrade över sina papper nyss. Titta in hos henne också, vetja.'},
 {p:'riksdag',r:0,f:['law','change','nobles'],who:'Elin',hello:'Jag har bläck på fingrarna och tre tomma rader i mina anteckningar. Pinsamt, va? Jag brukar ju veta precis vad som ska stå här. Hjälper du mig?',bye:'Åh, vad skönt! Fast … vänta. Nu när jag ska berätta om det för dig blir det suddigt igen. Kan vi pröva en gång till?'},
 {p:'riksdag',r:1,f:['nobles','law','change'],who:'Elin',hello:'Där är du igen! Jag trodde att jag hade det. Sedan vek jag ihop pappret, och vips var allt borta ur huvudet. Ska vi försöka utan att titta?',bye:'Nu sitter det bättre. Minns du Jo? Han behöver nog också hjälp … tror jag.'},
 {p:'quay',r:1,f:['trade'],who:'Jo',hello:'Du, det där du hjälpte mig med … jag vill kunna berätta det utan att kika på listan. Ska vi se om jag minns?',bye:'Ha! Där satt den. Jag såg Amira i slottsfönstret nyss. Hon såg ut att ha fått en ny huvudvärk. Gå förbi henne, du.'},
 {p:'palace',r:1,f:['freedom','queen','absolute'],who:'Amira',hello:'Åh, tack för att du kom tillbaka. Jag tänkte berätta för en kollega, men så stannade orden mitt i munnen. Kan vi prova igen?',bye:'Så ja! Nu börjar det kännas som mitt eget minne. Men titta på den här anteckningen … är den verkligen riktig?'},
 {p:'palace',r:2,f:['queen','absolute','freedom'],who:'Amira',hello:'Någon har skrivit så märkliga saker här. Och vet du vad som är värst? Jag blev osäker själv. Vill du hjälpa mig skilja det riktiga från det tokiga?',bye:'Du hade rätt – någonting var fel på pappret. Jo har också fått en konstig anteckning. Han står nere vid kajen.'},
 {p:'quay',r:2,f:['trade'],who:'Jo',hello:'Här! Läs den här lappen. Den låter inte alls som det vi kom fram till förut. Jag skulle behöva ditt skarpa minne en gång till.',bye:'Tack, nu känns det riktigt. Elin väntar nog med sitt sista papper. Hon ville visst visa dig något.'},
 {p:'riksdag',r:2,f:['law','change','nobles'],who:'Elin',hello:'Äntligen! Jag har hittat tre påståenden som får mig att rynka på näsan. Hjälp mig rätta dem innan någon tror på dem.',bye:'Sådär ja! Nu känner jag igen mina egna anteckningar igen. Vilken tur att du kom hit!'}
];
let s;try{s=JSON.parse(localStorage.getItem(storage)||'null')}catch{}
if(!s||s.v!==1||s.step<0||s.step>=runs.length)s={v:1,step:0,index:0,mode:'intro',hint:false,draft:'',record:[],complete:false};
// Upgrades from pre-gating test saves must not credit unverified knowledge.
if(s.mode==='end'&&s.step>0&&!runs[s.step].f.every(f=>s.record.some(r=>r.id===f&&r.step===s.step&&r.ok)))s.mode='question';
const persist=()=>{try{localStorage.setItem(storage,JSON.stringify(s))}catch{}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const current=()=>runs[s.step],item=()=>facts[current().f[s.index]];
const location=()=>!interior?'':interior.outdoor&&interior.regionId==='main'?'quay':interior.name==='Riksdagshuset'?'riksdag':interior.name==='Slottet'?'palace':interior.name==='Kaffehuset'?'cafe':'';
const present=()=>location()===current().p;
const hud=document.createElement('div'),modal=document.createElement('div');hud.id='ch1Hud';modal.id='ch1Modal';modal.hidden=true;stage.append(hud,modal);
const style=document.createElement('style');style.textContent=[
'#ch1Hud{position:absolute;top:8px;right:8px;z-index:29;max-width:min(350px,calc(100% - 16px));background:#fbf2e4f2;border:1px solid #967f5b;border-radius:9px;padding:9px 12px;color:#372d22;font:13px/1.45 system-ui,sans-serif;pointer-events:auto}',
'#ch1Hud strong{font:600 17px Georgia,serif;display:block}',
'#ch1Modal{position:absolute;inset:8px;z-index:45;max-width:710px;margin:auto;overflow:auto;overscroll-behavior:contain;border:2px solid #907b57;border-radius:14px;padding:clamp(16px,4vw,30px);background:#f8efdc;color:#352b20;font:17px/1.5 Georgia,serif;box-shadow:0 6px 24px #40342685}',
'#ch1Hud button,#ch1Modal button{border:1px solid #9b835c;border-radius:7px;background:#e9d8b6;padding:8px 11px;min-height:42px;color:#342b21;font:14px system-ui,sans-serif;cursor:pointer;margin:3px 4px 3px 0}',
'#ch1Hud button{min-height:33px;padding:5px 9px;font-size:12px}',
'#ch1Modal .primary,#ch1Hud .primary{background:#436b5c;color:white;border-color:#436b5c}',
'#ch1Modal h2{font:600 clamp(24px,4vw,33px)/1.22 Georgia,serif}',
'#ch1Modal .question{font:600 clamp(22px,4vw,29px)/1.3 Georgia,serif}',
'#ch1Modal textarea,#ch1Modal input{width:100%;box-sizing:border-box;font:16px/1.4 system-ui,sans-serif;background:#fffdf7;padding:12px;border:1px solid #988465;border-radius:7px}',
'#ch1Modal textarea{min-height:88px;resize:vertical}',
'#ch1Modal .answer{background:#ede2c9;border-left:4px solid #527361;padding:12px}',
'#ch1Modal .hint{background:#e4e6d2;padding:9px;border-radius:6px}',
'#ch1Modal small{display:block;border-top:1px solid #c5b596;margin-top:20px;padding-top:10px;font:12px/1.4 system-ui;color:#6c5d49}',
'body.ch1-open #world,body.ch1-open #interiorCanvas{pointer-events:none}',
'@media(max-width:640px){#ch1Hud{left:6px;right:6px;max-width:none;top:5px}#ch1Modal{inset:5px;padding:14px}}'
].join('\n');document.head.append(style);

// The Slottet learner task is the reference implementation.
// Room greeting happens first; the close-up takes over the entire stage only
// after the player offers to help. Existing questions and scoring stay intact.
style.textContent+=`
#ch1Modal.ch1MemoryFull{position:absolute;inset:0;width:100%;height:100%;max-width:none;max-height:none;
  border:0;border-radius:0;box-shadow:none;margin:0;padding:0;background:#a28c6a;display:block;overflow:hidden}
#ch1Modal.ch1MemoryFull .ch1MemorySetting{position:absolute;inset:0}
#ch1Modal.ch1MemoryFull .ch1MemorySetting svg{width:100%;height:100%;display:block;filter:saturate(.84)}
#ch1Modal.ch1MemoryFull .ch1MemorySetting:after{content:'';position:absolute;inset:0;background:#44362526;pointer-events:none}
#ch1Modal.ch1MemoryFull .ch1Sheet{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  background:#fbf1dc;color:#382d23;box-shadow:9px 13px 1px #322c2340;border:1px solid #aa9877;
  width:min(580px,calc(100% - 36px));max-height:calc(100% - 42px);overflow:auto;overscroll-behavior:contain;
  padding:clamp(20px,5vw,44px);box-sizing:border-box}
#ch1Modal.ch1MemoryFull .ch1Sheet:before{content:'';position:absolute;top:0;left:0;right:0;height:14px;
  background:repeating-linear-gradient(96deg,#a9937620 0 2px,transparent 2px 17px);pointer-events:none}
#ch1Modal.ch1MemoryFull .ch1Count{font:12px system-ui,sans-serif;text-align:center;color:#746b59;margin:0 0 20px}
#ch1Modal.ch1MemoryFull .ch1Prompt{font:600 clamp(22px,3.6vw,29px)/1.36 Georgia,serif;text-align:center;
 margin:8px 0 24px}
#ch1Modal.ch1MemoryFull .ch1Sheet input{min-height:51px;background:#fffaf0;border-radius:2px;width:100%;
  box-sizing:border-box;font:18px/1.3 system-ui,sans-serif;padding:12px}
#ch1Modal.ch1MemoryFull .ch1Actions{display:flex;justify-content:center;align-items:center;
 gap:8px;flex-wrap:wrap;margin-top:20px}
#ch1Modal.ch1MemoryFull .ch1Actions button{min-height:44px;margin:0}
#ch1Modal.ch1MemoryFull .ch1Actions .quiet{background:transparent;border-color:transparent;text-decoration:underline;
 text-underline-offset:3px}
#ch1Modal.ch1MemoryFull .ch1Answer{margin:13px 0;padding:12px 6px;text-align:center;
 border-top:1px solid #b7a888;border-bottom:1px solid #b7a888;font:18px/1.43 Georgia,serif}
#ch1Modal.ch1MemoryFull .ch1Hint{margin:12px 0 0;font:15px/1.35 system-ui,sans-serif;
 color:#64543c;text-align:center}
#ch1Modal.ch1MemoryFull .ch1Return{position:absolute;top:10px;left:12px;background:#fbf2dfef;
 font:13px system-ui,sans-serif;min-height:38px;z-index:2}
@media(max-width:600px){#ch1Modal.ch1MemoryFull .ch1Sheet{width:calc(100% - 20px);padding:21px 20px;
 max-height:calc(100% - 66px)}#ch1Modal.ch1MemoryFull .ch1Return{top:5px;left:6px;font-size:12px;
 padding:5px 9px;min-height:33px}#ch1Modal.ch1MemoryFull .ch1Count{margin-bottom:11px}
#ch1Modal.ch1MemoryFull .ch1Prompt{margin:5px 0 14px;font-size:21px}
#ch1Modal.ch1MemoryFull .ch1Actions{margin-top:12px}}
@media(max-height:480px){#ch1Modal.ch1MemoryFull .ch1Sheet{max-height:calc(100% - 45px)}
#ch1Modal.ch1MemoryFull .ch1Return{top:3px;left:3px;min-height:32px}}
`;

style.textContent+=`
#ch1Modal .ch1Options{display:grid;gap:9px;margin-top:15px}
#ch1Modal button.ch1Option{display:block;width:100%;text-align:left;white-space:normal;
  line-height:1.32;font:16px/1.38 system-ui,sans-serif;padding:12px 16px;min-height:48px;
  background:#fffbf1;border:1px solid #a18e6f;border-radius:5px;color:#342b20}
#ch1Modal button.ch1Option:hover{background:#f0e4cb;border-color:#665840}
#ch1Modal button.ch1Option:focus-visible{outline:3px solid #346a70;outline-offset:2px}
#ch1Modal .ch1Result{text-align:center;border-top:1px solid #b7a888;border-bottom:1px solid #b7a888;
 padding:12px 4px;margin:10px 0}
#ch1Modal .ch1Result p{margin:7px 0 0;font:16px/1.45 Georgia,serif}
#ch1Modal .ch1Result strong{font:600 18px/1.2 Georgia,serif}
@media(max-width:620px){#ch1Modal button.ch1Option{font-size:14px;padding:10px 11px;min-height:45px}}
`;
let open=false,was='',dismiss=-1;
const referenceMemory=()=>s.step>=1&&!s.complete;
const referenceMaja=()=>s.step===0&&!s.complete;
let memoryVisible=false;
let memoryRestore=null;
function hideRoomForMemory(){
 if(memoryVisible)return;
 memoryVisible=true;
 memoryRestore={roomVisibility:roomView.style.visibility,footerHidden:roomFooter.hidden};
 roomView.style.visibility='hidden';
 roomFooter.hidden=true;
 document.body.classList.add('ch1-memory');
 modal.classList.add('ch1MemoryFull');
}
function restoreRoomFromMemory(){
 if(!memoryVisible)return;
 memoryVisible=false;
 roomView.style.visibility=memoryRestore?.roomVisibility||'';
 roomFooter.hidden=memoryRestore?.footerHidden??false;
 memoryRestore=null;
 document.body.classList.remove('ch1-memory');
 modal.classList.remove('ch1MemoryFull');
}
function paintCutPaperScene(){
 const canvas=modal.querySelector('#ch1CutPaperScene');
 if(!canvas)return;
 try{
   if(window.UPPDRAG_ROOM_ART?.renderMemoryCloseup?.(canvas,current().p)){
     canvas.style.visibility='visible';
     return;
   }
 }catch(error){console.warn('Närbilden kunde inte ritas',error);}
 canvas.style.visibility='hidden';
}
window.addEventListener('resize',()=>{if(memoryVisible)paintCutPaperScene();});
window.addEventListener('uppdrag-paper-fibres-ready',()=>{if(memoryVisible)paintCutPaperScene();});
style.textContent+=`
#ch1Modal.ch1MemoryFull .ch1LegacyFallback,#ch1Modal.ch1MemoryFull .ch1CutPaperScene{
  position:absolute;inset:0;width:100%;height:100%;display:block}
#ch1Modal.ch1MemoryFull .ch1LegacyFallback svg{width:100%;height:100%;display:block}
#ch1Modal.ch1MemoryFull .ch1MemorySetting{background:#b4a38a}
#ch1Modal.ch1MemoryFull .ch1Sheet{left:63%;max-width:500px}
@media(max-width:800px){#ch1Modal.ch1MemoryFull .ch1Sheet{left:50%;max-width:500px}}
`;
function drawMemory(){
 const f=item(),id=current().f[s.index],short=!!f.answers&&!(current().r===2&&id==='nobles');
 const fallback=window.UPPDRAG_CH1_CLOSEUPS?.images?.[current().p];
 if(!fallback||!fallback.includes('<svg'))throw new Error('Reservbilden saknas för '+current().p);
 const choices=short?null:window.UPPDRAG_CH1_CHOICES?.optionsFor(id,current().r);
 if(!short&&!choices)throw new Error('Granskade alternativ saknas för '+id+' på '+current().r);
 let sheet='<p class="ch1Count">'+(s.index+1)+' / '+current().f.length+'</p>';
 sheet+='<h2 class="ch1Prompt">'+esc(f.q[current().r])+'</h2>';
 if(s.mode==='question'){
   if(short)sheet+='<input id="ch1Answer" aria-label="Ditt svar" type="text" maxlength="120" autocomplete="off" value="'+esc(s.draft)+'">';
   if(s.hint)sheet+='<p class="ch1Hint">'+esc(f.hint)+'</p>';
   sheet+='<div class="ch1Actions">';
   sheet+=short?'<button class="primary" data-action="short">Svara</button><button class="quiet" data-action="skip">Minns inte</button>'
      :'<button class="primary" data-action="choices">Jag har tänkt</button>';
   if(!s.hint)sheet+='<button class="quiet" data-action="hint">Ledtråd</button>';
   sheet+='</div>';
 }else if(s.mode==='choices'){
   sheet+='<div class="ch1Options" role="group" aria-label="Välj det historiskt riktiga svaret">';
   choices.options.forEach((text,i)=>{sheet+='<button class="ch1Option" type="button" data-action="choice" data-index="'+i+'">'+esc(text)+'</button>';});
   sheet+='</div>';
   if(s.hint)sheet+='<p class="ch1Hint">'+esc(f.hint)+'</p>';
 }else if(s.mode==='feedback'){
   const last=s.record[s.record.length-1],correct=!!last?.ok;
   sheet+='<div class="ch1Result" role="status"><strong>'+(correct?'Rätt!':'Inte riktigt än')+'</strong><p>'+esc(f.a)+'</p></div>';
   sheet+='<div class="ch1Actions"><button class="primary" data-action="next">'
    +(correct?(s.index===current().f.length-1?'Färdig':'Nästa fråga'):'Försök igen')+'</button></div>';
 }
 modal.innerHTML='<div class="ch1MemorySetting" aria-hidden="true">'
    +'<div class="ch1LegacyFallback">'+fallback+'</div>'
    +'<canvas id="ch1CutPaperScene" class="ch1CutPaperScene" aria-hidden="true"></canvas></div>'
    +'<button class="ch1Return" data-action="close" type="button">← Till rummet</button>'
    +'<article class="ch1Sheet" aria-label="Minnesarbetet">'+sheet+'</article>';
 paintCutPaperScene();
 modal.querySelector('#ch1Answer')?.focus({preventScroll:true});
}
function enterMemory(){
 if(!referenceMemory()||!present())return false;
 if(s.mode==='intro'){s.mode='question';persist();}
 open=true;modal.hidden=false;document.body.classList.add('ch1-open');
 hideRoomForMemory();drawMemory();return true;
}
function wantsMajaMeeting(place){return referenceMaja()&&present()&&place==='cafe';}
function majaProblem(){return 'Hör du, något är konstigt med folk i stan. Amira från slottet kom in här nyss och kunde knappt minnas vad hon arbetade med. Jag försökte hjälpa, men hon såg bara mer förvirrad ut. Vill du gå dit och se hur hon har det?';}
function acceptMajaMission(){if(wantsMajaMeeting('cafe'))advance();}
function wantsMemoryMeeting(place){return referenceMemory()&&present()&&place===current().p&&s.mode!=='end';}
function memoryProblem(){
 if(s.mode!=='intro')return 'Jag har fortfarande en lucka i mina anteckningar. Vill du hjälpa mig att fortsätta?';
 if(s.step===1)return current().hello;
 return current().hello;
}
function stageSolved(){
 return current().f.every(f=>s.record.some(r=>r.step===s.step&&r.id===f&&r.ok));
}
function wantsMemoryThanks(place){return referenceMemory()&&present()&&place===current().p&&s.mode==='end'&&stageSolved();}
function memoryThanks(){return current().bye;}
function finishMemory(){if(wantsMemoryThanks(current().p)&&stageSolved())advance();}

const rank=()=>['Lärling','Gesäll','Mästare'][current().r];
function numbers(){return {ind:s.record.filter(x=>x.ok&&!x.support).length,aided:s.record.filter(x=>x.ok&&x.support).length,need:s.record.filter(x=>!x.ok).length}}
function drawHud(){
 const label=present()?'Prata med '+current().who:'Visa vägen';
 hud.innerHTML='<strong>Frihetstiden · '+(s.step?rank():'Start')+'</strong><span>Nästa: <b>'+paths[current().p]+'</b></span>'
   +'<div><button class="primary" data-nav="1">'+esc(label)+'</button>'
   +'<button type="button" data-reset="1" title="Börja om hela kapitel 1">Börja om kapitel 1</button></div>';
}
function closePanel(){open=false;modal.hidden=true;document.body.classList.remove('ch1-open');restoreRoomFromMemory();dismiss=s.step}
function showPanel(){if(!present())return;
 if(referenceMemory()||referenceMaja())return window.UPPDRAG_MEETINGS?.start?.();
 open=true;modal.hidden=false;document.body.classList.add('ch1-open');drawModal();
}
function go(){
 closePanel();
 if(region.id!=='main'){setMessage('Kapitel 1','Återvänd till huvudstaden.');return}
 if(present()){showPanel();return}
 if(interior)leaveInterior();
 if(current().p==='quay')requestHarbour();
 else{const b=region.buildings.find(b=>b.name===paths[current().p]);if(b)requestInterior(b)}
}
function advance(){
 if(s.step>0&&(s.mode!=='end'||!stageSolved()))return false;
 if(s.step===9){s.complete=true;s.mode='finished';persist();open=true;modal.hidden=false;document.body.classList.add('ch1-open');drawModal();return}
 s.step++;s.index=0;s.mode='intro';s.hint=false;s.draft='';persist();closePanel();drawHud();go();dismiss=-1
}
function next(){
 if(s.mode!=='feedback')return false;
 const last=s.record[s.record.length-1];
 if(!last||last.step!==s.step||last.id!==current().f[s.index])return false;
 if(!last.ok){
   // A wrong or missing answer never unlocks another question or person.
   s.mode='question';s.hint=true;s.draft='';persist();
   if(memoryVisible)drawMemory();else drawModal();
   return false;
 }
 s.index++;
 s.mode=s.index>=current().f.length?'end':'question';
 s.hint=false;s.draft='';persist();
 if(referenceMemory()){
   if(s.mode==='end'&&stageSolved()){
     closePanel();window.UPPDRAG_MEETINGS?.memoryThanks?.();
   }else drawMemory();
 }else drawModal();
 return true;
}
function mark(ok,{supported=false,response=null}={}){
 if(s.mode!=='question'&&s.mode!=='choices')return;
 const f=current().f[s.index];
 s.record.push({step:s.step,id:f,level:rank(),ok,support:s.hint||supported,
  ab:item().ab,answer:response??s.draft});
 s.mode='feedback';persist();
 if(memoryVisible)drawMemory();else drawModal();
}
function drawModal(){
 let h='<div style="font:600 12px system-ui;color:#685b45;letter-spacing:.1em">'+(s.step?rank():'Kapitel 1')+' · '+paths[current().p]+'</div>';
 if(s.complete){const n=numbers();h+='<h2>Kapitel 1 avklarat!</h2><p>'+esc(current().bye)+'</p><p>21 återkallningsförsök: '+n.ind+' självständiga, '+n.aided+' med ledtråd, '+n.need+' behöver övas.</p><p>Det här är träning, inte betyg.</p><button class="primary" data-action="restart">Spela om</button>'}
 else if(s.mode==='intro')h+='<h2>'+esc(s.step?rank()+' · '+paths[current().p]:'Ett nytt uppdrag')+'</h2><p><b>'+current().who+':</b> '+esc(current().hello)+'</p><button class="primary" data-action="start">'+(s.step?'Börja återkalla':'Ta uppdraget')+'</button>';
 else if(s.mode==='end')h+='<h2>Arbetet är klart</h2><p><b>'+current().who+':</b> '+esc(current().bye)+'</p><button class="primary" data-action="advance">'+(s.step===9?'Avsluta kapitel 1':'Fortsätt till nästa plats')+'</button>';
 else {
 const f=item(),short=!!f.answers&&!(current().r===2&&current().f[s.index]==='nobles');
 h+='<h2>'+current().who+'</h2><p class="question">'+esc(f.q[current().r])+'</p>';
 if(s.hint)h+='<p class="hint">Ledtråd: '+esc(f.hint)+'</p>';
 if(s.mode==='question'){
 h+=short?'<input id="ch1Answer" type="text" maxlength="120" autocomplete="off" placeholder="Kort svar" value="'+esc(s.draft)+'">':'<textarea id="ch1Answer" placeholder="Skriv stödord eller tänk igenom ditt svar">'+esc(s.draft)+'</textarea>';
 h+=short?'<button class="primary" data-action="short">Svara</button><button data-action="skip">Jag minns inte</button>':'<button class="primary" data-action="choices">Jag har tänkt</button>';
 if(!s.hint)h+='<button data-action="hint">Visa ledtråd</button>';
 }else if(s.mode==='choices'){
 const list=window.UPPDRAG_CH1_CHOICES?.optionsFor(current().f[s.index],current().r);
 if(!list)throw new Error('Alternativ saknas');
 h+='<div class="ch1Options">';
 list.options.forEach((v,i)=>h+='<button class="ch1Option" data-action="choice" data-index="'+i+'">'+esc(v)+'</button>');
 h+='</div>';
}
 else if(s.mode==='feedback'){const r=s.record[s.record.length-1];h+='<div class="answer"><b>'+(r.ok?'Rätt!':'Inte riktigt än')+'</b><p>'+esc(f.a)+'</p></div><button class="primary" data-action="next">'+(r.ok?(s.index===current().f.length-1?'Färdig':'Nästa fråga'):'Försök igen')+'</button>';}
 h+='<small>Grundboken s. 64–65 · Elevernas arbetsbok '+esc(f.ab)+'. Frågor med alternativ registreras som stödda svar.</small>';
 }
 h+='<p><button data-action="close">Stäng och promenera</button></p>';
 modal.innerHTML=h;
 window.UPPDRAG_CH1_CLOSEUPS?.decorate(modal,current(),s);
 modal.querySelector('#ch1Answer')?.focus({preventScroll:true})
}
function resetChapter(){
 if(!confirm('Börja om kapitel 1 från Maja på Kaffehuset?'))return;
 window.UPPDRAG_MEETINGS?.close?.(false);
 s={v:1,step:0,index:0,mode:'intro',hint:false,draft:'',record:[],complete:false};
 persist();closePanel();dismiss=-1;was='';drawHud();go();
}
hud.addEventListener('click',e=>{
 if(e.target.closest('[data-reset]'))resetChapter();
 else if(e.target.closest('[data-nav]'))go();
 else if(e.target.closest('[data-open]'))showPanel();
});
modal.addEventListener('input',e=>{if(e.target.id==='ch1Answer'){s.draft=e.target.value;persist();}});
modal.addEventListener('click',e=>{
 const act=e.target.closest('[data-action]')?.dataset.action;if(!act)return;
 if(act==='close'){closePanel();return}
 if(act==='restart'){resetChapter();return}
 if(act==='start'){if(s.step===0)advance();else{s.mode='question';persist();drawModal()}return}
 if(act==='hint'){s.hint=true;persist();if(memoryVisible)drawMemory();else drawModal();return}
 if(act==='short'){if(!s.draft.trim())return;mark(item().answers.some(a=>norm(a)===norm(s.draft)));return}
 if(act==='skip'){s.draft='';mark(false);return}
 if(act==='choices'){
   const questionId=current().f[s.index];
   if(!window.UPPDRAG_CH1_CHOICES?.optionsFor(questionId,current().r))return;
   s.mode='choices';persist();if(memoryVisible)drawMemory();else drawModal();return;
 }
 if(act==='choice'){
   if(s.mode!=='choices')return;
   const questionId=current().f[s.index],set=window.UPPDRAG_CH1_CHOICES.optionsFor(questionId,current().r);
   const index=Number(e.target.closest('[data-index]')?.dataset.index);
   if(!Number.isInteger(index)||index<0||index>=set.options.length)return;
   mark(index===set.correctIndex,{supported:true,response:set.options[index]});return;
 }
 
 if(act==='next'){next();return}
 if(act==='advance'){advance();return}
});
modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();closePanel()}else if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();modal.querySelector('[data-action="short"]')?.click()}});
function tick(){const p=location();if(p!==was){was=p;if(p===current().p&&!open&&dismiss!==s.step&&!referenceMemory()&&!referenceMaja())showPanel()}if(!open){const key=s.step+'/'+p;if(hud.dataset.key!==key){hud.dataset.key=key;drawHud()}}}
window.UPPDRAG_CH1_PILOT={tick,go,scenes:runs,saveKey:storage,
 wantsMajaMeeting,majaProblem,acceptMajaMission,
 wantsMemoryMeeting,memoryProblem,enterMemory,wantsMemoryThanks,memoryThanks,finishMemory,resetChapter,
 get state(){return s},get memoryVisible(){return memoryVisible}};
drawHud();setMessage('Frihetstiden · kapitel 1','Börja i Kaffehuset. Använd pilar eller klicka på byggnaderna. Visa vägen ger hjälp.');
})();