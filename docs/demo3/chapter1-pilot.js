(function(){
'use strict';
// Kapitel 1 i den befintliga stadens gångmotor. Separat sparfil.
const storage='uppdrag1700.ch1-real-world.20261019.v11';
const facts={
queen:{ab:'2a',a:'Ulrika Eleonora',answers:['ulrika eleonora'],hint:'Hennes namn börjar med U.',q:['Vilken drottning efterträdde Karl XII?','Vad hette Karl XII:s syster som övertog tronen?','En skrivare påstår att drottningen hette Fredrik. Vad hette hon egentligen?']},
absolute:{ab:'2b',a:'Drottningen var inte enväldig: hon kunde inte bestämma ensam utan delade makten med riksrådet och riksdagen.',hint:'Vem mer än drottningen hade makt?',q:['Vad menas med att drottningen inte var enväldig?','Vilken begränsning hade Ulrika Eleonora jämfört med enväldiga kungar?','En anteckning säger att Ulrika Eleonora bestämde allt ensam. Rätta felet.']},
freedom:{ab:'1',a:'Det tidigare enväldet upphörde och riksdagen och riksrådet fick mer makt. Men olika grupper hade fortfarande olika mycket inflytande.',hint:'Tänk på vem som fick bestämma före och efter 1719.',q:['Varför kallas tiden 1719–1772 för frihetstiden?','Vad förändrades i styret när frihetstiden började?','Varför var makten friare för vissa, men inte lika för alla?']},
trade:{ab:'3',a:'Ostindiska kompaniet skulle handla med Asien, särskilt Kina, och importera te, siden och porslin till Sverige.',hint:'Vad tog handelsfartygen hem från Kina?',q:['Vilken uppgift hade Ostindiska kompaniet?','Varför seglade Ostindiska kompaniets fartyg från Göteborg till Kina?','Ett brev säger att kompaniets uppdrag var att kriga mot Kina. Vad stämmer i stället?']},
law:{ab:'4a',a:'Grundlagen reglerade hur makten skulle delas och hur Sverige skulle styras.',hint:'Vad handlade den nya maktfördelningen om?',q:['Vad skulle den nya grundlagen innehålla tydliga regler för?','Varför skrevs en ny grundlag efter enväldet?','En skrivare säger att grundlagen gav kungen oinskränkt makt. Rätta påståendet.']},
change:{ab:'4b',a:'Enligt grundbokens text kunde den bara ändras om hela riksdagen var överens.',hint:'Det krävdes särskild enighet.',q:['När kunde grundlagen ändras enligt grundboken?','Varför kunde inte en ensam riksdagsman ändra grundlagen?','En adelsman säger att han själv får ändra grundlagen. Vilket krav har han glömt?']},
nobles:{ab:'4c',a:'Adeln hade störst makt. Viktiga beslut togs på särskilda möten där bönderna inte fick vara med.',answers:['adeln','adel'],hint:'Ett av de fyra stånden.',q:['Vilket stånd hade mest makt i riksdagen?','Vilket stånd dominerade de viktiga besluten?','Hur kunde adeln ha störst inflytande trots att fyra stånd fanns?']}
};
const paths={cafe:'Kaffehuset',palace:'Slottet',quay:'Kajen',riksdag:'Riksdagshuset'};
const runs=[
 {p:'cafe',r:0,f:[],who:'Maja',hello:'Du kom! Jag har en sak att berätta.',bye:'Börja hos Amira på slottet. Hon såg alldeles vilsen ut nyss.'},
 {p:'palace',r:0,f:['queen','absolute','freedom'],who:'Amira',hello:'Jag satt med brevet och så blev det bara tomt i huvudet. Vem var det som tog över efter Karl XII?',bye:'Åh, där satt det! Minns du Jo vid kajen? Han behöver nog också hjälp.'},
 {p:'quay',r:0,f:['trade'],who:'Jo',hello:'Ett skepp, en handelslista och ett helt hav … men vad var det nu vi skulle göra? Det är borta!',bye:'Tack! Elin inne i riksdagshuset stod och kliade sig i huvudet över sina papper. Hon kanske behöver dig.'},
 {p:'riksdag',r:0,f:['law','change','nobles'],who:'Elin',hello:'Titta på mitt protokoll! Tre rader är tomma. Jag brukar kunna det här. Kan du hjälpa mig?',bye:'Så skönt! Men Amira på slottet ville visst fråga dig en sak till. Gå dit när du hinner.'},
 {p:'palace',r:1,f:['freedom','queen','absolute'],who:'Amira',hello:'Där är du! Jag hade just svaret på tungan, men så försvann det. Kan vi pröva igen?',bye:'Nu satt det bättre! Jo vinkade åt dig från kajen när jag gick förbi.'},
 {p:'quay',r:1,f:['trade'],who:'Jo',hello:'Hör du, jag tänkte berätta för en sjöman … men orden fastnade. Hjälper du mig en gång till?',bye:'Det var det jag menade! Elin har visst ett nytt protokoll att visa dig.'},
 {p:'riksdag',r:1,f:['nobles','law','change'],who:'Elin',hello:'Jag tänker, tänker … det är alldeles på tungan! Ska vi försöka utan att kika i pappren?',bye:'Nu vet jag! Amira fick en märklig anteckning förut. Gå tillbaka till slottet.'},
 {p:'palace',r:2,f:['queen','absolute','freedom'],who:'Amira',hello:'Någon har skrivit tokigheter i brevet. Jag vill vara säker på vad som stämmer. Hjälper du mig?',bye:'Det där blev rätt! Jo har hittat en lika underlig lapp nere vid kajen.'},
 {p:'quay',r:2,f:['trade'],who:'Jo',hello:'Se här! På den här lappen påstår någon något helt annat. Jag får inte ihop det. Vad säger du?',bye:'Tack för hjälpen! Elin väntar på dig med de sista anteckningarna.'},
 {p:'riksdag',r:2,f:['law','change','nobles'],who:'Elin',hello:'Nu gäller det sista protokollet. Här är flera saker som inte låter riktigt kloka. Kan vi reda ut dem?',bye:'Sådär! Nu känner jag igen anteckningarna igen. Du har verkligen hjälpt oss att minnas.'}
];
const fresh=()=>({v:2,step:0,index:0,mode:'intro',hint:false,draft:'',record:[],complete:false,
 daler:3,apples:0,trial:0,earned:{},archiveRounds:0,archiveList:[],archiveIndex:0,archiveMode:'question',archiveHint:false});
let s;try{s=JSON.parse(localStorage.getItem(storage)||'null')}catch{}
if(!s||s.v!==2||!Number.isInteger(s.step)||s.step<0||s.step>=runs.length)s=fresh();
// Upgrades from pre-gating test saves must not credit unverified knowledge.
s.archiveActive=false;
if(s.mode==='end'&&s.step>0&&!runs[s.step].f.every(f=>s.record.some(r=>r.id===f&&r.step===s.step&&r.trial===s.trial&&r.ok)))s.mode='question';
const persist=()=>{try{localStorage.setItem(storage,JSON.stringify(s))}catch{}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');

function nearlySameName(a,b){
 if(Math.abs(a.length-b.length)>2||a.length<11)return false;
 const prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
   let last=prev[0];prev[0]=i;
   for(let j=1;j<=b.length;j++){
     const old=prev[j];
     prev[j]=Math.min(prev[j]+1,prev[j-1]+1,last+(a[i-1]===b[j-1]?0:1));
     last=old;
   }
 }
 return prev[b.length]<=2;
}
function correctShort(input,answers){
 const given=norm(input);
 return !!given&&answers.some(a=>given===norm(a)||nearlySameName(given,norm(a)));
}
const current=()=>runs[s.step],item=()=>facts[current().f[s.index]];
const location=()=>!interior?'':interior.outdoor&&interior.regionId==='main'?'quay':interior.name==='Riksdagshuset'?'riksdag':interior.name==='Slottet'?'palace':interior.name==='Kaffehuset'?'cafe':interior.name==='Arkivet'?'archive':'';
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

style.textContent+=`
#ch1Hud .ch1Wallet{font:600 13px Georgia,serif;margin-top:3px;color:#644a31}
#ch1Modal.ch1MemoryFull .ch1Sheet{background:#fffcf6;border:1px solid #c9bba1}
#ch1Modal.ch1MemoryFull .ch1Result{border:0;margin:5px 0 15px;padding:18px 15px;background:#f0f4e9}
#ch1Modal.ch1MemoryFull .ch1ResultWrong{background:#f8e9e4}
#ch1Modal.ch1MemoryFull .ch1ResultRight{background:#e8f1e7;border:2px solid #719778}
#ch1Modal.ch1MemoryFull .ch1Result strong{display:block;font:700 20px/1.25 Georgia,serif}
#ch1Modal.ch1MemoryFull .ch1FlashAnswer{font:600 clamp(22px,3vw,28px)/1.45 Georgia,serif;margin:13px 0 4px;color:#27362e}
#ch1Modal.ch1MemoryFull .ch1ResultWrong .ch1FlashAnswer{color:#422e2a}
#ch1Modal.ch1MemoryFull .ch1Count{margin-bottom:8px}
#ch1Modal.ch1MemoryFull .ch1RetryNote{font:15px/1.4 Georgia,serif;text-align:center;color:#594a38}
`;
style.textContent+=`
#ch1Modal .ch1Diploma{text-align:center;background:#fffaf0;border:7px double #b6a17e;
 max-width:625px;margin:0 auto;padding:clamp(18px,5vw,42px);box-shadow:5px 6px 0 #4b3b302b}
#ch1Modal .ch1DiplomaOver{font:italic 17px Georgia,serif;color:#6a5846}
#ch1Modal .ch1Diploma h2{margin:14px 0;font:600 clamp(27px,5vw,40px)/1.23 Georgia,serif}
#ch1Modal .ch1DiplomaTitle{letter-spacing:.13em;font:600 13px Georgia,serif}
#ch1Modal .ch1DiplomaSeal{width:clamp(120px,26vw,170px);margin:14px auto;display:block;
 filter:drop-shadow(3px 4px 1px #64533b4d)}
#ch1Modal .ch1DiplomaSmall{font:13px/1.45 system-ui,sans-serif;color:#776b5b}
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
   if(window.UPPDRAG_ROOM_ART?.renderMemoryCloseup?.(canvas,s.archiveActive?'archive':current().p)){
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
function retryButtons(){
 let h='<div class="ch1Actions">';
 if(s.daler>0)h+='<button class="primary" data-action="retry-daler">Nytt prov · 1 daler</button>';
 if(s.apples>0)h+='<button class="primary" data-action="retry-apple">Nytt prov · 1 äpple</button>';
 return h+'<button data-action="archive-go">Träna hos Rut i Arkivet</button></div>';
}
function retryWith(kind){
 if(s.mode!=='failed'||!present())return false;
 const wallet=kind==='apple'?'apples':'daler';
 if(s[wallet]<1)return false;
 s[wallet]--;s.trial++;s.index=0;s.mode='question';s.hint=false;s.draft='';
 persist();drawHud();drawMemory();return true;
}
function drawMemory(){
 const f=item(),id=current().f[s.index],short=!!f.answers&&!(current().r===2&&id==='nobles');
 const fallback=window.UPPDRAG_CH1_CLOSEUPS?.images?.[s.archiveActive?'cafe':current().p];
 if(!fallback||!fallback.includes('<svg'))throw new Error('Reservbilden saknas för '+current().p);
 const choices=short?null:window.UPPDRAG_CH1_CHOICES?.optionsFor(id,current().r);
 if(!short&&!choices)throw new Error('Granskade alternativ saknas för '+id+' på '+current().r);
 let sheet='<p class="ch1Count">'+(s.index+1)+' / '+current().f.length+'</p>';
 if(s.mode==='question'||s.mode==='choices')sheet+='<h2 class="ch1Prompt">'+esc(f.q[current().r])+'</h2>';
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
 }else if(s.mode==='failed'){
   sheet+='<div class="ch1Result ch1ResultWrong" role="status"><strong>Inte rätt än</strong>'
       +'<p class="ch1FlashAnswer">'+esc(f.a)+'</p></div>';
   sheet+='<p class="ch1RetryNote">Vill du försöka igen börjar hela uppdraget om.</p>'+retryButtons();
 }else if(s.mode==='feedback'){
   sheet+='<div class="ch1Result ch1ResultRight" role="status"><strong>RÄTT</strong>'
       +'<p class="ch1FlashAnswer">'+esc(f.a)+'</p></div>';
   sheet+='<div class="ch1Actions"><button class="primary" data-action="next">'
     +(s.index===current().f.length-1?'Lämna minnesprovet':'Nästa fråga')+'</button></div>';
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
function majaProblem(){return 'Det är något märkligt i stan. Amira var här nyss och mindes knappt sitt eget arbete. Kan du titta till henne på slottet?';}
function acceptMajaMission(){if(wantsMajaMeeting('cafe'))advance();}
function wantsMemoryMeeting(place){return referenceMemory()&&present()&&place===current().p&&s.mode!=='end';}
function memoryProblem(){
 if(s.mode!=='intro')return 'Jag har fortfarande en lucka i mina anteckningar. Vill du hjälpa mig att fortsätta?';
 if(s.step===1)return current().hello;
 return current().hello;
}
function stageSolved(){
 return current().f.every(f=>s.record.some(r=>r.step===s.step&&r.id===f&&r.trial===s.trial&&r.ok));
}
function wantsMemoryThanks(place){return referenceMemory()&&present()&&place===current().p&&s.mode==='end'&&stageSolved();}
function memoryThanks(){return current().bye;}
function finishMemory(){if(wantsMemoryThanks(current().p)&&stageSolved())advance();}


// Rut tränar fakta som eleven redan klarat. Om inga fakta klarats ännu,
// kan eleven göra en första lästräning så att ingen låses ute utan valuta.
function wantsArchiveMeeting(place){return location()==='archive'&&place==='archive';}
function archiveHello(){
 const known=Object.keys(s.earned).length;
 return known
  ?'Du ser fundersam ut. Kom, så provar vi vad du minns från dina tidigare uppdrag. Det finns ett äpple att tjäna.'
  :'Har du fastnat? Vi kan öva ett minne tillsammans. När du minns det själv får du ett äpple.';
}
function archiveFact(){return s.archiveList[s.archiveIndex]||'queen';}
function archiveShort(id){return !!facts[id].answers;}
function enterArchive(){
 if(location()!=='archive')return false;
 const known=Object.keys(s.earned).filter(f=>facts[f]);
 const total=known.length,offset=total?s.archiveRounds%total:0;
 const rotated=total?known.slice(offset).concat(known.slice(0,offset)):['queen'];
 s.archiveList=rotated.slice(0,Math.min(3,rotated.length));
 s.archiveIndex=0;s.archiveMode='question';s.archiveHint=false;s.archiveDraft='';
 s.archiveActive=true;s.archiveRounds++;persist();
 open=true;modal.hidden=false;document.body.classList.add('ch1-open');
 hideRoomForMemory();drawArchive();return true;
}
function drawArchive(){
 const id=archiveFact(),f=facts[id],short=archiveShort(id),
  spec=!short?window.UPPDRAG_CH1_CHOICES?.optionsFor(id,0):null;
 if(!f)throw new Error('Rut saknar fråga');
 const fallback=window.UPPDRAG_CH1_CLOSEUPS?.images?.cafe||'';
 let sheet='<p class="ch1Count">Ruts arkiv · '+(s.archiveIndex+1)+' / '+s.archiveList.length+'</p>';
 if(s.archiveMode==='reward'){
   sheet='<h2 class="ch1Prompt">Du mindes!</h2>'
    +'<div class="ch1Result ch1ResultRight"><strong>ETT ÄPPLE</strong>'
    +'<p class="ch1FlashAnswer">Rut ler och räcker dig ett äpple.</p></div>'
    +'<div class="ch1Actions"><button class="primary" data-action="archive-again">Repetera mer</button>'
    +'<button data-action="archive-exit">Tillbaka till rummet</button></div>';
 }else if(s.archiveMode==='failed'){
   sheet+='<div class="ch1Result ch1ResultWrong"><strong>Inte riktigt än</strong>'
    +'<p class="ch1FlashAnswer">'+esc(f.a)+'</p></div>'
    +'<p class="ch1RetryNote">Rut hjälper dig gärna att öva igen. Inget äpple denna gång.</p>'
    +'<div class="ch1Actions"><button class="primary" data-action="archive-again">Öva igen</button></div>';
 }else if(s.archiveMode==='feedback'){
   sheet+='<div class="ch1Result ch1ResultRight"><strong>RÄTT</strong>'
    +'<p class="ch1FlashAnswer">'+esc(f.a)+'</p></div>'
    +'<div class="ch1Actions"><button class="primary" data-action="archive-next">Nästa minne</button></div>';
 }else{
   sheet+='<h2 class="ch1Prompt">'+esc(f.q[0])+'</h2>';
   if(s.archiveMode==='question'){
     if(short)sheet+='<input id="ch1ArchiveInput" type="text" aria-label="Ditt svar"'
      +' autocomplete="off" value="'+esc(s.archiveDraft)+'">';
     sheet+='<div class="ch1Actions">';
     sheet+=short?'<button class="primary" data-action="archive-short">Svara</button>'
      :'<button class="primary" data-action="archive-choices">Jag har tänkt</button>';
     if(!s.archiveHint)sheet+='<button data-action="archive-hint">Ledtråd</button>';
     sheet+='</div>';
   }else if(s.archiveMode==='choices'){
     sheet+='<div class="ch1Options" role="group">';
     spec.options.forEach((v,i)=>sheet+='<button class="ch1Option" data-action="archive-choice" data-index="'+i+'">'+esc(v)+'</button>');
     sheet+='</div>';
   }
   if(s.archiveHint)sheet+='<p class="ch1Hint">'+esc(f.hint)+'</p>';
 }
 modal.innerHTML='<div class="ch1MemorySetting" aria-hidden="true">'
  +'<div class="ch1LegacyFallback">'+fallback+'</div>'
  +'<canvas id="ch1CutPaperScene" class="ch1CutPaperScene"></canvas></div>'
  +'<button class="ch1Return" data-action="archive-exit">← Till Rut</button>'
  +'<article class="ch1Sheet">'+sheet+'</article>';
 paintCutPaperScene();
 modal.querySelector('#ch1ArchiveInput')?.focus({preventScroll:true});
}
function archiveMark(ok){
 if(!s.archiveActive||!['question','choices'].includes(s.archiveMode))return false;
 s.archiveMode=ok?'feedback':'failed';persist();drawArchive();return true;
}
function archiveNext(){
 if(!s.archiveActive||s.archiveMode!=='feedback')return;
 if(s.archiveIndex+1<s.archiveList.length){
   s.archiveIndex++;s.archiveMode='question';s.archiveHint=false;s.archiveDraft='';
 }else{
   s.archiveMode='reward';s.apples+=1;
 }
 persist();drawHud();drawArchive();
}

const rank=()=>['Lärling','Gesäll','Mästare'][current().r];
function numbers(){return {ind:s.record.filter(x=>x.ok&&!x.support).length,aided:s.record.filter(x=>x.ok&&x.support).length,need:s.record.filter(x=>!x.ok).length}}
function drawHud(){
 const label=present()?'Prata med '+current().who:'Visa vägen';
 hud.innerHTML='<strong>Frihetstiden · '+(s.step?rank():'Start')+'</strong>'
  +'<span>Nästa: <b>'+paths[current().p]+'</b></span>'
  +'<div class="ch1Wallet">'+s.daler+' daler · '+s.apples+' äpplen</div>'
  +'<div><button class="primary" data-nav="1">'+esc(label)+'</button>'
  +'<button data-archive="1">Arkivet · repetera</button>'
  +'<button type="button" data-reset="1" title="Börja om hela kapitel 1">Börja om</button></div>';
}
function closePanel(){open=false;modal.hidden=true;document.body.classList.remove('ch1-open');restoreRoomFromMemory();if(s.archiveActive){s.archiveActive=false;persist();}dismiss=s.step}
function showPanel(){if(!present())return;
 if(referenceMemory()||referenceMaja())return window.UPPDRAG_MEETINGS?.start?.();
 open=true;modal.hidden=false;document.body.classList.add('ch1-open');drawModal();
}
function goArchive(){
 closePanel();
 if(region.id!=='main'){setMessage('Arkivet','Återvänd till staden först.');return false;}
 if(location()==='archive')return window.UPPDRAG_MEETINGS?.start?.();
 if(interior)leaveInterior();
 const building=region.buildings.find(b=>b.name==='Arkivet');
 if(building)requestInterior(building);
 return !!building;
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
 if(s.step>0){for(const id of current().f)s.earned[id]=true;s.daler+=1;}
 if(s.step===9){s.complete=true;s.mode='finished';persist();open=true;modal.hidden=false;document.body.classList.add('ch1-open');drawModal();return}
 s.step++;s.index=0;s.trial=0;s.mode='intro';s.hint=false;s.draft='';persist();closePanel();drawHud();go();dismiss=-1
}
function next(){
 if(s.mode!=='feedback')return false;
 const last=s.record[s.record.length-1];
 if(!last||last.step!==s.step||last.id!==current().f[s.index])return false;
 if(!last.ok)return false;
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
 s.record.push({step:s.step,trial:s.trial,id:f,level:rank(),ok,support:s.hint||supported,
  ab:item().ab,answer:response??s.draft});
 s.mode=ok?'feedback':'failed';persist();
 if(memoryVisible)drawMemory();else drawModal();
}
function drawModal(){
 if(s.complete){
   const right=s.record.filter(r=>r.ok).length,tries=s.record.length;
   modal.innerHTML='<article class="ch1Diploma">'
    +'<div class="ch1DiplomaOver">Stadens minnesarkiv</div>'
    +'<h2>Du har återställt minnena!</h2>'
    +'<p class="ch1DiplomaTitle">FRIHETSTIDEN · KAPITEL 1</p>'
    +'<svg class="ch1DiplomaSeal" viewBox="0 0 180 180" aria-label="Stämplat sigill: Minnesmästare">'
    +'<circle cx="90" cy="90" r="73" fill="#ae533e" stroke="#723b30" stroke-width="4"/>'
    +'<circle cx="90" cy="90" r="60" fill="none" stroke="#eed0a5" stroke-width="2.5"/>'
    +'<path d="M57 105 L73 87 L88 99 L116 68" stroke="#f5e1c1" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    +'<text x="90" y="39" text-anchor="middle" fill="#f7dfbf" font-size="11" font-family="Georgia">MINNES</text>'
    +'<text x="90" y="151" text-anchor="middle" fill="#f7dfbf" font-size="11" font-family="Georgia">MÄSTARE</text>'
    +'</svg>'
    +'<p>Du har hjälpt Maja, Amira, Jo och Elin att minnas.</p>'
    +'<p class="ch1DiplomaSmall">'+right+' rätta återkallningar på '+tries+' försök. '
      +'Detta är träning, inte ett betyg.</p>'
    +'<button class="primary" data-action="restart">Börja om äventyret</button>'
    +'<button data-action="close">Tillbaka till staden</button></article>';
   return;
 }
 let h='<div style="font:600 12px system-ui;color:#685b45;letter-spacing:.1em">'+(s.step?rank():'Kapitel 1')+' · '+paths[current().p]+'</div>';
 if(s.complete){const n=numbers();h+='<h2>Kapitel 1 avklarat!</h2><p>'+esc(current().bye)+'</p><p>21 kunskapsdelar avklarade på '+s.record.length+' försök. '+n.ind+' rätt utan stöd, '+n.aided+' rätt med stöd och '+n.need+' felaktiga försök.</p><p>Det här är träning, inte betyg.</p><button class="primary" data-action="restart">Spela om</button>'}
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
 s=fresh();
 persist();closePanel();dismiss=-1;was='';drawHud();go();
}
hud.addEventListener('click',e=>{
 if(e.target.closest('[data-reset]'))resetChapter();
 else if(e.target.closest('[data-archive]'))goArchive();
 else if(e.target.closest('[data-nav]'))go();
 else if(e.target.closest('[data-open]'))showPanel();
});
modal.addEventListener('input',e=>{if(e.target.id==='ch1Answer')s.draft=e.target.value;
 else if(e.target.id==='ch1ArchiveInput')s.archiveDraft=e.target.value;
 persist();});
modal.addEventListener('click',e=>{
 const act=e.target.closest('[data-action]')?.dataset.action;if(!act)return;
 if(act==='close'){closePanel();return}
 if(act==='retry-daler'){retryWith('daler');return}
 if(act==='retry-apple'){retryWith('apple');return}
 if(act==='archive-go'){goArchive();return}
 if(act==='archive-exit'){closePanel();return}
 if(act==='archive-again'){closePanel();enterArchive();return}
 if(act==='archive-hint'){if(s.archiveActive){s.archiveHint=true;persist();drawArchive();}return}
 if(act==='archive-short'){
   if(!s.archiveActive||s.archiveMode!=='question'||!s.archiveDraft.trim())return;
   archiveMark(correctShort(s.archiveDraft,facts[archiveFact()].answers||[]));return;
 }
 if(act==='archive-choices'){
   if(s.archiveActive&&s.archiveMode==='question'){s.archiveMode='choices';persist();drawArchive();}return;
 }
 if(act==='archive-choice'){
   if(!s.archiveActive||s.archiveMode!=='choices')return;
   const o=window.UPPDRAG_CH1_CHOICES.optionsFor(archiveFact(),0);
   const ix=Number(e.target.closest('[data-index]')?.dataset.index);
   if(Number.isInteger(ix)&&ix>=0&&ix<o.options.length)archiveMark(ix===o.correctIndex);
   return;
 }
 if(act==='archive-next'){archiveNext();return}
 if(act==='restart'){resetChapter();return}
 if(act==='start'){if(s.step===0)advance();else{s.mode='question';persist();drawModal()}return}
 if(act==='hint'){s.hint=true;persist();if(memoryVisible)drawMemory();else drawModal();return}
 if(act==='short'){if(!s.draft.trim())return;mark(correctShort(s.draft,item().answers));return}
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
modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();closePanel()}else if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();modal.querySelector(e.target.id==='ch1ArchiveInput'?'[data-action="archive-short"]':'[data-action="short"]')?.click()}});
function tick(){const p=location();if(p!==was){was=p;if(p===current().p&&!open&&dismiss!==s.step&&!referenceMemory()&&!referenceMaja())showPanel()}if(!open){const key=s.step+'/'+p;if(hud.dataset.key!==key){hud.dataset.key=key;drawHud()}}}
window.UPPDRAG_CH1_PILOT={tick,go,scenes:runs,saveKey:storage,
 wantsMajaMeeting,majaProblem,acceptMajaMission,
 wantsMemoryMeeting,memoryProblem,enterMemory,wantsMemoryThanks,memoryThanks,finishMemory,resetChapter,
 wantsArchiveMeeting,archiveHello,enterArchive,goArchive,
 get state(){return s},get memoryVisible(){return memoryVisible}};
drawHud();setMessage('Frihetstiden · kapitel 1','Börja i Kaffehuset. Använd pilar eller klicka på byggnaderna. Visa vägen ger hjälp.');
})();