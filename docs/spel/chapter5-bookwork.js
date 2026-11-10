/* Written retrieval and open discussion from the supplied workbook and test.
 * Drafts are saved independently. Comparing a model never awards a stamp. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==5)return;
const key='uppdrag1700.ch5-book-writing.v1';
const sheets=[
 {
  "id": "enlightenment",
  "title": "Vad var upplysningen?",
  "source": "Prov del 2 · 7; bedömningsstöd s. 5; grundboken s. 82",
  "places": [
   "palace",
   "archive"
  ],
  "prompt": "Förklara upplysningen med egna ord. Ta med varifrån idéerna i texten kom, vad tänkarna ville och hur idéerna påverkade Sverige. Ge konkreta exempel.",
  "labels": [
   "Idéer och ursprung",
   "Påverkan på Sverige och exempel"
  ],
  "support": "Franska författare och tänkare lyfte frihet och människors rättigheter samt förnuft och vetenskap. Idéerna påverkade Sverige och Gustav III:s reformer. Tortyr förbjöds. Dödsstraffet begränsades till få brott men försvann inte helt. En förklaring kopplar idéerna till förändringarna, med egna ord."
 },
 {
  "id": "penalties",
  "title": "Rätta påståendet om straffen",
  "source": "Prov del 2 · 5a–b; grundboken s. 82",
  "places": [
   "palace",
   "archive"
  ],
  "prompt": "En besökare påstår: ”Kungen ville att tortyr och dödsstraff skulle användas så mycket som möjligt.” Rätta påståendet och förklara hur de två förändringarna skilde sig åt.",
  "labels": [
   "Din rättelse och förklaring"
  ],
  "support": "Tortyr förbjöds. Dödsstraffet begränsades kraftigt, till några få brott. Det avskaffades inte helt. Kungen benådade också ofta dödsdömda till fängelse enligt textboken."
 },
 {
  "id": "comparison",
  "title": "Varför både omtyckt och kritiserad?",
  "source": "Arbetsbok 17; grundboken s. 81–85; lärarguidens samtalsfråga",
  "places": [
   "palace",
   "archive"
  ],
  "prompt": "Varför kunde människor både uppskatta och kritisera Gustav III? Ge konkreta exempel på förbättringar och på begränsningar. Förklara hur de kunde finnas samtidigt.",
  "labels": [
   "Förbättringar och vad de betydde",
   "Begränsningar och vad de betydde"
  ],
  "support": "Du kan jämföra tortyrförbud och nya möjligheter för judar och katoliker med begränsad tryckfrihet och att kungen samlade mer makt hos sig själv. Judar hade också kvar villkor om bostadsort, yrken och äktenskap. En förbättring på ett område gav inte alla samma frihet."
 },
 {
  "id": "women",
  "title": "Ny lag – men samma vardag?",
  "source": "Arbetsbok 17; grundboken s. 83; lärarguide fråga 4",
  "places": [
   "palace",
   "archive"
  ],
  "prompt": "Beskriv konkreta förändringar för ogifta gravida kvinnor och barn födda utanför äktenskapet. Varför innebar de nya reglerna inte att alla svårigheter försvann?",
  "labels": [
   "Vad reglerna ändrade",
   "Vad som kunde vara svårt ändå"
  ],
  "support": "Familjen fick inte avslöja eller kasta ut kvinnan. Barn skulle behandlas lika i prästernas papper och inte kallas ”mindre äkta”. Det gick också att föda anonymt. Kvinnor kunde ändå möta skam, fördomar och dålig behandling. Skilj det lagen säger från hur människor behandlas."
 },
 {
  "id": "religion",
  "title": "Religionsfrihet med villkor",
  "source": "Arbetsbok 17; prov del 2 · 5; grundboken s. 84",
  "places": [
   "palace",
   "archive"
  ],
  "prompt": "Rätta påståendet: ”Alla som flyttade till Sverige måste vara kristna.” Förklara sedan vilka begränsningar som fanns kvar. Vad skiljer detta från begreppet religionsfrihet?",
  "labels": [
   "Rättelse och nya möjligheter",
   "Kvarvarande begränsningar"
  ],
  "support": "Judar och katoliker fick flytta till Sverige och behålla sin religion. Judar fick i regel bo i vissa städer, var utestängda från vissa yrken och fick bara gifta sig med andra judar. Svenska protestanter fick inte lämna sin kyrka. Religionsfrihet betyder frihet att själv bestämma vilken religion man ska ha; villkoren då gav inte alla den friheten."
 }
];
let data;try{data=JSON.parse(localStorage.getItem(key)||'null');}catch{}
if(!data||data.v!==1)data={v:1,drafts:{},compared:{}};data.drafts??={};data.compared??={};
const save=()=>{try{localStorage.setItem(key,JSON.stringify(data));}catch{}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let root=null,place=null,pool=[],index=0,restore=null;
const style=document.createElement('style');style.textContent=`
#ch5Bookwork{position:absolute;inset:0;z-index:46;background:#c5b59a;overflow:hidden;color:#352b20;font:17px/1.45 Georgia}#ch5Bookwork canvas{position:absolute;inset:0;width:100%;height:100%}#ch5Bookwork .bw-sheet{position:absolute;left:64%;top:53%;transform:translate(-50%,-50%);width:min(600px,calc(100% - 24px));max-height:calc(100% - 100px);overflow:auto;overscroll-behavior:contain;touch-action:pan-y;padding:23px;background:#fffcf6;border:1px solid #b3a080;box-shadow:8px 11px 1px #322c2340;box-sizing:border-box}#ch5Bookwork h2{font:600 25px/1.2 Georgia;margin:10px 0 15px}#ch5Bookwork p{margin:9px 0}#ch5Bookwork small{font:12px system-ui;color:#635744}#ch5Bookwork label{display:block;margin:15px 0 6px}#ch5Bookwork textarea{width:100%;min-height:88px;padding:10px;border:1px solid #988465;border-radius:2px;box-sizing:border-box;font:16px/1.4 system-ui;background:#fffaf0;resize:vertical}#ch5Bookwork button{min-height:44px;padding:9px 12px;border:1px solid #9b835c;border-radius:5px;background:#f4ead7;color:#352b20;font:15px Georgia;cursor:pointer}#ch5Bookwork .bw-close{position:absolute;top:10px;left:12px;z-index:2}#ch5Bookwork .bw-actions{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 0}#ch5Bookwork .bw-support{padding:12px;border-left:3px solid #69816b;background:#eef0e3;font-size:16px}#ch5Bookwork :focus-visible{outline:3px solid #286472;outline-offset:2px}@media(max-width:800px){#ch5Bookwork .bw-sheet{left:50%;padding:17px}}@media(max-height:500px){#ch5Bookwork .bw-sheet{top:56%;max-height:calc(100% - 75px)}}
`;document.head.append(style);
function paint(){const c=root?.querySelector('canvas');if(c)UPPDRAG_ROOM_ART.renderMemoryCloseup(c,place);}
function render(){
 const q=pool[index];root.innerHTML='<canvas aria-hidden="true"></canvas><button class="bw-close" data-bw="close">← Till rummet</button><article class="bw-sheet"><small>Bokens resonemang · blad '+(index+1)+' av '+pool.length+'</small><h2>'+esc(q.title)+'</h2><p>'+esc(q.prompt)+'</p>'+q.labels.map((label,i)=>'<label for="bw-'+i+'">'+esc(label)+'</label><textarea id="bw-'+i+'" data-bw-field="'+i+'" maxlength="4000">'+esc(data.drafts[q.id]?.[i]||'')+'</textarea>').join('')+'<p><small>Ditt svar sparas. Skriv ur minnet först och jämför sedan innehållet med stödet.</small></p>'+(data.compared[q.id]?'<div class="bw-support"><b>Stöd att jämföra med</b><p>'+esc(q.support)+'</p></div>':'')+'<div class="bw-actions"><button data-bw="support">Jämför med stöd</button><button data-bw="prev"'+(index===0?' disabled':'')+'>Föregående blad</button><button data-bw="next"'+(index===pool.length-1?' disabled':'')+'>Nästa blad</button></div></article>';
 paint();root.querySelector('.bw-sheet').scrollTop=0;root.querySelector('textarea').focus({preventScroll:true});
}
function open(){
 const p=interior?.kind;
 if(root||!['palace','archive'].includes(p)||UPPDRAG_CH5_PILOT.studyBusy||UPPDRAG_EVENT_ENGINE.busy||UPPDRAG_MEETINGS.state.talking)return false;
 UPPDRAG_CH5_CITY_LIFE.suspend();place=p;pool=sheets.filter(q=>q.places.includes(p));index=0;restore={visibility:roomView.style.visibility,footer:roomFooter.hidden};
 roomView.style.visibility='hidden';roomFooter.hidden=true;document.body.classList.add('ch1-open');
 root=document.createElement('section');root.id='ch5Bookwork';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Återkalla och skriv bokens resonemang');stage.append(root);
 root.addEventListener('input',e=>{if(!e.target.matches('[data-bw-field]'))return;const q=pool[index];data.drafts[q.id]??=q.labels.map(()=>'');data.drafts[q.id][Number(e.target.dataset.bwField)]=e.target.value;save();});
 root.addEventListener('click',e=>{const a=e.target.closest('[data-bw]')?.dataset.bw;if(a==='close')return close();if(a==='support'){data.compared[pool[index].id]=true;save();render();}if(a==='next'&&index<pool.length-1){index++;render();}if(a==='prev'&&index>0){index--;render();}});
 render();return true;
}
function close(){if(!root)return false;root.remove();root=null;roomView.style.visibility=restore.visibility;roomFooter.hidden=restore.footer;document.body.classList.remove('ch1-open');UPPDRAG_MEETINGS.redraw();document.getElementById('meetingPerson')?.focus({preventScroll:true});return true;}
function handleKeydown(e){
 if(!root)return false;
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return true;}
 if(e.key==='Tab'){const a=[...root.querySelectorAll('button:not(:disabled),textarea')],i=a.indexOf(document.activeElement);if(e.shiftKey&&i<=0||!e.shiftKey&&i===a.length-1){e.preventDefault();e.stopImmediatePropagation();a[e.shiftKey?a.length-1:0]?.focus();}return true;}
 if(['Enter',' '].includes(e.key)&&e.target.closest('button')){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)e.target.closest('button').click();return true;}return false;
}
window.addEventListener('resize',paint);window.addEventListener('uppdrag-paper-fibres-ready',paint);
window.UPPDRAG_CH5_BOOKWORK={open,close,handleKeydown,get busy(){return !!root;},get sheets(){return sheets.map(q=>({id:q.id,source:q.source,places:q.places}));},get state(){return JSON.parse(JSON.stringify(data));},saveKey:key};
})();
