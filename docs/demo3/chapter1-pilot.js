(function(){
'use strict';
// Kapitel 1 i den befintliga stadens gångmotor. Separat sparfil.
const storage='uppdrag1700.ch1-real-world.20261019.v5';
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
 {p:'cafe',r:0,f:[],who:'Maja',hello:'Du har redan läst kapitlet och arbetat i häftet. Nu behöver vi reda ut vem som bestämmer i Sverige. Hjälp mig att kontrollera det du minns.',bye:'Börja på slottet. Där finns handlingarna om drottningen och hur styret förändrades.'},
 {p:'palace',r:0,f:['queen','absolute','freedom'],who:'Amira',hello:'Jag behöver rätta uppgifterna om drottningen och kungamakten. Försök minnas utan att titta i boken.',bye:'Ta dig till Jo på Kajen, där det finns uppgifter om handeln.'},
 {p:'quay',r:0,f:['trade'],who:'Jo',hello:'Ett handelsskepps uppdrag behöver beskrivas. Vad minns du?',bye:'Nu behöver Elin på Riksdagshuset hjälp med grundlagens regler.'},
 {p:'riksdag',r:0,f:['law','change','nobles'],who:'Elin',hello:'Protokollet är inte komplett. Tre viktiga uppgifter om grundlagen och makten saknas.',bye:'Lärlingsarbetet är klart. Nu får du hämta fram samma kunskap ännu en gång.'},
 {p:'riksdag',r:1,f:['nobles','law','change'],who:'Elin',hello:'Nu är protokollet undanstoppat. Kan du fortfarande återge vad du lärde dig?',bye:'Gå till Jo på Kajen, så återkommer handelsuppdraget.'},
 {p:'quay',r:1,f:['trade'],who:'Jo',hello:'En ny handelsnotis behöver en förklaring. Återkalla vad kompaniet gjorde.',bye:'Återvänd till Slottet för nästa del av gesällprovet.'},
 {p:'palace',r:1,f:['freedom','queen','absolute'],who:'Amira',hello:'Utan handlingarna framför dig, kan du ändå förklara den ändrade kungamakten?',bye:'Nu ska vi granska felaktiga historiska påståenden på mästarnivå.'},
 {p:'palace',r:2,f:['queen','absolute','freedom'],who:'Amira',hello:'En skrivare har blandat ihop namn och makt. Hjälp mig att granska påståendena.',bye:'En felaktig handelsnotis finns vid Kajen.'},
 {p:'quay',r:2,f:['trade'],who:'Jo',hello:'En gammal anteckning säger att kompaniet skulle starta krig. Det behöver rättas.',bye:'Gå till Riksdagshuset för de sista protokollfrågorna.'},
 {p:'riksdag',r:2,f:['law','change','nobles'],who:'Elin',hello:'Nu prövar vi felaktiga påståenden om makten, så att inget trycks fel.',bye:'Kapitel 1 är färdigt! Du har återkallat samma kunskap tre gånger, på nya sätt.'}
];
let s;try{s=JSON.parse(localStorage.getItem(storage)||'null')}catch{}
if(!s||s.v!==1||s.step<0||s.step>=runs.length)s={v:1,step:0,index:0,mode:'intro',hint:false,draft:'',record:[],complete:false};
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
function drawMemory(){
 const f=item(),short=!!f.answers;
 const photo=window.UPPDRAG_CH1_CLOSEUPS?.images?.[current().p]||'';
 let sheet='<p class="ch1Count">'+(s.index+1)+' / '+current().f.length+'</p>';
 sheet+='<h2 class="ch1Prompt">'+esc(f.q[current().r])+'</h2>';
 if(s.mode==='question'){
   if(short)sheet+='<input id="ch1Answer" aria-label="Ditt svar" type="text" maxlength="120" autocomplete="off" value="'+esc(s.draft)+'">';
   if(s.hint)sheet+='<p class="ch1Hint">'+esc(f.hint)+'</p>';
   sheet+='<div class="ch1Actions">';
   sheet+=short?'<button class="primary" data-action="short">Svara</button><button class="quiet" data-action="skip">Minns inte</button>'
      :'<button class="primary" data-action="reveal">Jag har tänkt</button>';
   if(!s.hint)sheet+='<button class="quiet" data-action="hint">Ledtråd</button>';
   sheet+='</div>';
 }else if(s.mode==='rating'){
   sheet+='<p class="ch1Answer">'+esc(f.a)+'</p>';
   sheet+='<p style="text-align:center">Mindes du huvudpoängen?</p>';
   sheet+='<div class="ch1Actions"><button class="primary" data-action="yes">Ja</button><button data-action="no">Nej</button></div>';
 }else if(s.mode==='feedback'){
   const r=s.record[s.record.length-1];
   sheet+='<p class="ch1Answer">'+esc(f.a)+'</p>';
   sheet+='<div class="ch1Actions"><button class="primary" data-action="next">'+(s.index===current().f.length-1?'Färdig':'Nästa')+'</button></div>';
 }
 modal.innerHTML='<div class="ch1MemorySetting" aria-hidden="true">'+photo+'</div>'
   +'<button class="ch1Return" data-action="close" type="button">← Till rummet</button>'
   +'<article class="ch1Sheet" aria-label="Minnesarbetet">'+sheet+'</article>';
 modal.querySelector('#ch1Answer')?.focus({preventScroll:true});
}
function enterMemory(){
 if(!referenceMemory()||!present())return false;
 if(s.mode==='intro'){s.mode='question';persist();}
 open=true;modal.hidden=false;document.body.classList.add('ch1-open');
 hideRoomForMemory();drawMemory();return true;
}
function wantsMajaMeeting(place){return referenceMaja()&&present()&&place==='cafe';}
function majaProblem(){return 'Jag försöker få ordning på ett anslag om frihetstiden. Men nu är det som om flera viktiga minnen försvunnit! Vem bestämmer egentligen efter Karl XII? Vill du hjälpa oss?';}
function acceptMajaMission(){if(wantsMajaMeeting('cafe'))advance();}
function wantsMemoryMeeting(place){return referenceMemory()&&present()&&place===current().p&&s.mode!=='end';}
function memoryProblem(){
 if(s.mode!=='intro')return 'Jag har fortfarande en lucka i mina anteckningar. Vill du hjälpa mig att fortsätta?';
 if(s.step===1)return 'Jag skrev om tiden efter Karl XII, men minns plötsligt inte vem som tog över tronen. Kan du hjälpa mig?';
 return current().hello;
}
function wantsMemoryThanks(place){return referenceMemory()&&present()&&place===current().p&&s.mode==='end';}
function memoryThanks(){return s.step===1
 ?'Tack! Nu minns jag igen. Jo vid kajen verkar också behöva hjälp med sina handelslistor.'
 :current().bye;}
function finishMemory(){if(wantsMemoryThanks(current().p))advance();}

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
 if(s.step===9){s.complete=true;s.mode='finished';persist();drawModal();return}
 s.step++;s.index=0;s.mode='intro';s.hint=false;s.draft='';persist();closePanel();drawHud();go();dismiss=-1
}
function next(){
 s.index++;s.mode=s.index>=current().f.length?'end':'question';s.hint=false;s.draft='';persist();
 if(referenceMemory()){
   if(s.mode==='end'){
     closePanel();
     window.UPPDRAG_MEETINGS?.memoryThanks?.();
   }else drawMemory();
 }else drawModal();
}
function mark(ok){const f=current().f[s.index];s.record.push({id:f,level:rank(),ok,support:s.hint,ab:item().ab,answer:s.draft});s.mode='feedback';persist();if(memoryVisible)drawMemory();else drawModal()}
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
 h+=short?'<button class="primary" data-action="short">Svara</button><button data-action="skip">Jag minns inte</button>':'<button class="primary" data-action="reveal">Jag har tänkt – visa facit</button>';
 if(!s.hint)h+='<button data-action="hint">Visa ledtråd</button>';
 }else if(s.mode==='rating')h+='<div class="answer"><b>Korrekt innehåll</b><p>'+esc(f.a)+'</p></div><p>Hade du själv huvudpoängen före facit?</p><button class="primary" data-action="yes">Ja</button><button data-action="no">Nej</button>';
 else if(s.mode==='feedback'){const r=s.record[s.record.length-1];h+='<div class="answer"><b>'+(r.ok?'Svar registrerat':'Det här får du repetera')+'</b><p>'+esc(f.a)+'</p></div><button class="primary" data-action="next">'+(s.index===current().f.length-1?'Avsluta arbetet här':'Nästa fråga')+'</button>';}
 h+='<small>Grundboken s. 64–65 · Elevernas arbetsbok '+esc(f.ab)+'. Frågor som kräver förklaring självskattas i denna pilot.</small>';
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
 if(act==='reveal'){s.mode='rating';persist();if(memoryVisible)drawMemory();else drawModal();return}
 if(act==='yes'){mark(true);return}if(act==='no'){mark(false);return}
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