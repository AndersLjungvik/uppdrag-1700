/* Chapter 2: three knowledge areas, original questions and existing rooms.
 * Progress, story, side adventures and conversations have separate save keys.
 */
(function(){
'use strict';
const storage='uppdrag1700.ch2-real-world.20261019.v1';
const pupilRound=window.__UPPDRAG_LESSON_ONLY>0,lessonEnd=window.__UPPDRAG_LESSON_ONLY===2;
const storyKey='uppdrag1700.story.v2.ch2',peopleKey='uppdrag1700.people.v2.ch2';
const parse=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback;}catch{return fallback;}};
const copy=v=>JSON.parse(JSON.stringify(v));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const areas=[
 {id:'women',name:'Kvinnors villkor',place:'Kyrkan',p:'church',who:'Olof',slot:1,topics:['relations','mother'],document:'anteckningen om kvinnors villkor'},
 {id:'power',name:'Makt och lydnad',place:'Kyrkan',p:'church',who:'Olof',slot:2,topics:['belief','power'],document:'kyrkoboken'},
 {id:'children',name:'Barnens vardag',place:'Barnhuset',p:'barnhus',who:'Siri',slot:3,topics:['barnhus'],document:'barnhusets anteckningar'}
];
const levels=['learner','journeyman','master'],labels=['Lärling','Gesäll','Mästare'];
const allBank=window.UPPDRAG_RECALL_BANK.filter(t=>t.chapter<=2),bank=allBank.filter(t=>t.chapter===2);
const previousKey='uppdrag1700.ch1-real-world.20261019.v11',previous=parse(previousKey,{});
const facts={},runs=[{p:'cafe',who:'Maja',f:[],r:0}];
for(let r=0;r<3;r++)for(const a of areas)runs.push({p:a.p,who:a.who,r,area:a.id,f:bank.filter(t=>t.rank===r&&a.topics.includes(t.topic)).map(t=>t.id)});
const desired=runs.map(r=>r.f.slice());
window.UPPDRAG_RECALL_ENGINE.prepare(2,facts,runs);
runs.forEach((r,i)=>r.f=desired[i]);
const old=parse(storage,null);
try{if(old&&!localStorage.getItem(storage+'.before-mastery-2'))localStorage.setItem(storage+'.before-mastery-2',JSON.stringify(old));}catch{}
let s=old&&old.v===2?old:{v:2,record:[],daler:Number.isInteger(previous.daler)?Math.max(0,previous.daler):3,apples:Number.isInteger(previous.apples)?Math.max(0,previous.apples):0,earned:{},step:0,index:0,trial:0,mode:'intro'};
s.record=Array.isArray(s.record)?s.record:[];s.earned??={};s.sessions??={};s.reviewQueue??=[];s.encountered??=[];s.reviewPractice??={};
s.daler=Math.max(0,Number(s.daler)||0);s.apples=Math.max(0,Number(s.apples)||0);
// The classroom round has room for one apple. Keep the limit at the resource
// boundary so restored saves and the frozen Rut reward cannot build a reserve.
if(pupilRound){
 let apples=Number.isFinite(s.apples)?Math.min(1,Math.floor(s.apples)):0;
 Object.defineProperty(s,'apples',{enumerable:true,get:()=>apples,set(v){const n=Number(v);apples=Number.isFinite(n)?Math.min(1,Math.max(0,Math.floor(n))):0;}});
}
if(!s.chapter2AreasPrepared){for(const entry of s.record)entry.beforeChapter2Mastery=true;s.sessions={};s.step=0;s.index=0;s.mode='intro';s.recallUI=null;s.chapter2AreasPrepared=true;}
s.archiveActive=false;s.step=Number.isInteger(s.step)&&runs[s.step]?s.step:0;
let story=parse(storyKey,{v:1,introduced:false,visits:{}}),people=parse(peopleKey,{v:1,met:{}});
story.visits??={};people.met??={};
let recall=null,view='closed',selected=null,returnFocus=null,roomRestore=null;
const current=()=>runs[s.step],area=()=>areas.find(a=>a.id===current().area),level=()=>levels[current().r];
const persist=()=>{s.complete=mastery.chapterComplete();try{localStorage.setItem(storage,JSON.stringify(s));}catch{}};
const saveWorld=()=>{try{localStorage.setItem(storyKey,JSON.stringify(story));localStorage.setItem(peopleKey,JSON.stringify(people));}catch{}};
const mastery=window.UPPDRAG_MASTERY.configure({chapter:2,areas,resources:{getApples:()=>s.apples,setApples:v=>{s.apples=v;persist();},getDaler:()=>s.daler,setDaler:v=>{s.daler=v;persist();}}});
const reviewContext={chapter:2,state:s,bank,runs,areas,mastery};
window.UPPDRAG_MASTERY_REVIEW.recover(reviewContext);
const mainReview=x=>!x.resolved&&!!window.UPPDRAG_MASTERY_REVIEW.mainTask(x,reviewContext);
const status=(a=area(),l=level())=>a?mastery.snapshot().state.areas[a.id][l].status:'available';
const locationKey=()=>!interior?'':interior.outdoor&&interior.regionId==='main'?'quay':({Kyrkan:'church',Barnhuset:'barnhus',Kaffehuset:'cafe',Arkivet:'archive'})[interior.name]||'';
const present=()=>locationKey()===current().p;
const hud=document.createElement('div'),modal=document.createElement('div');hud.id='ch1Hud';modal.id='ch1Modal';modal.hidden=true;modal.tabIndex=-1;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Minnesboken och minnesproven');stage.append(hud,modal);
const style=document.createElement('style');style.textContent=`
#ch1Hud{position:absolute;top:8px;right:8px;z-index:29;width:min(320px,calc(100% - 130px));padding:9px 12px;background:#fbf2e4f2;border:1px solid #967f5b;border-radius:9px;font:13px/1.4 system-ui;color:#372d22}
#ch1Hud strong{display:block;font:600 17px Georgia}#ch1Hud .ch1Wallet{margin:4px 0}
#ch1Hud button,#ch1Modal button{font:14px/1.4 system-ui;min-height:44px;padding:8px 12px;border:1px solid #9b835c;border-radius:6px;background:#fffaf0;color:#342b21;cursor:pointer}#ch1Hud button{margin:3px 4px 0 0}
#ch1Hud button.primary,#ch1Modal .primary{background:#436b5c;color:white}#ch1Modal button:disabled{opacity:.55;cursor:default}
#ch1Modal{position:absolute;inset:8px;z-index:45;width:min(760px,calc(100% - 16px));margin:auto;overflow:auto;overscroll-behavior:contain;touch-action:pan-y;padding:24px;border:2px solid #907b57;border-radius:12px;background:#fbf4e6;color:#352b20;font:17px/1.5 Georgia}
#ch1Modal h2{font:600 27px/1.2 Georgia;margin:10px 0 16px}#ch1Modal h3{font:600 20px Georgia}#ch1Modal p{margin:10px 0}
#ch1Modal .mb-top{display:flex;justify-content:space-between;align-items:center;gap:12px}#ch1Modal .mb-top p{font:13px system-ui;margin:0}
#ch1Modal .mb-area{margin:16px 0;padding:15px;border:1px solid #b5a184;border-radius:8px;background:#fffaf0}#ch1Modal .mb-area h3{margin:0 0 5px}
#ch1Modal .mb-stamps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:13px 0 4px}#ch1Modal .mb-stamps button{text-align:left;font-size:13px;overflow-wrap:anywhere}#ch1Modal .mb-stamps span{display:block;font-weight:600}
#ch1Modal .mb-clear{background:#e8efdf}#ch1Modal .mb-pending{background:#f9e8b7}#ch1Modal .mb-note{font:14px/1.5 system-ui;color:#615645}
#ch1Modal .mb-actions{display:flex;gap:8px;flex-wrap:wrap;margin:15px 0}#ch1Modal blockquote{white-space:pre-wrap;margin:10px 0;padding:12px;background:#efe4ce}
/* Restore the original room close-up around the shared recall sheet. */
#ch1Modal.ch1MemoryFull{position:absolute;inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:0;border:0;border-radius:0;box-shadow:none;background:#b4a38a;overflow:hidden}
#ch1Modal.ch1MemoryFull .ch1MemorySetting,#ch1Modal.ch1MemoryFull .ch1CutPaperScene{position:absolute;inset:0;width:100%;height:100%;display:block}
#ch1Modal.ch1MemoryFull .ch1Sheet{position:absolute;left:64%;top:55%;transform:translate(-50%,-50%);width:min(570px,calc(100% - 24px));max-width:570px;max-height:calc(100% - 90px);padding:24px;overflow:auto;overscroll-behavior:contain;touch-action:pan-y;background:#fffcf6;border:1px solid #c9bba1;box-shadow:9px 13px 1px #322c2340;box-sizing:border-box}
#ch1Modal.ch1MemoryFull .ch1Sheet:before{content:'';position:absolute;top:0;left:0;right:0;height:12px;background:repeating-linear-gradient(96deg,#a9937620 0 2px,transparent 2px 17px);pointer-events:none}
#ch1Modal.ch1MemoryFull article.ch1Sheet{max-height:calc(90% - 54px)}
#ch1Modal.ch1MemoryFull .ch1Return{position:absolute;top:10px;left:12px;z-index:2;background:#fbf2dfef;min-height:44px;font:14px Georgia}
#ch1Modal .rc-field input,#ch1Modal .rc-field textarea{padding:12px;border:1px solid #988465;border-radius:2px}
#mbTeacherCode{display:block;width:min(100%,240px);min-height:44px;padding:8px 12px;margin-top:6px;border:1px solid #988465;border-radius:3px;font:18px system-ui}
@media(max-width:800px){#ch1Modal.ch1MemoryFull .ch1Sheet{left:50%;width:calc(100% - 28px);max-width:570px;padding:18px}}
@media(max-height:500px){#ch1Modal.ch1MemoryFull .ch1Sheet{top:55%;max-height:calc(100% - 74px);padding:14px}#ch1Modal.ch1MemoryFull .ch1Return{top:4px;left:6px}}
#ch1Modal button:focus-visible,#ch1Hud button:focus-visible{outline:3px solid #286472;outline-offset:2px}
body.ch1-open #world,body.ch1-open #interiorCanvas{pointer-events:none}body.ch1-open #ch1Hud,body[data-conversation] #ch1Hud{display:none}
@media(max-width:520px){#ch1Hud{font-size:12px;padding:7px;width:calc(100% - 130px)}#ch1Hud strong{font-size:15px}#ch1Hud button{font-size:12px;padding:6px}#ch1Modal{padding:15px;inset:5px;width:calc(100% - 10px)}#ch1Modal .mb-stamps{grid-template-columns:1fr}#ch1Modal .mb-stamps span{display:inline;margin-right:8px}}
`;document.head.append(style);
function restoreRoom(){
 if(!roomRestore)return;
 roomView.style.visibility=roomRestore.visibility;roomFooter.hidden=roomRestore.footerHidden;
 roomRestore=null;document.body.classList.remove('ch1-memory');modal.classList.remove('ch1MemoryFull');
}
function paintCloseup(){
 const canvas=modal.querySelector('#ch1CutPaperScene');if(!canvas||!roomRestore)return;
 const place=s.archiveActive?'archive':current().p;
 if(!window.UPPDRAG_ROOM_ART?.renderMemoryCloseup?.(canvas,place))throw Error('Närbilden för '+place+' kunde inte visas.');
 canvas.dataset.place=place;
}
function display(html,kind){
 const inRoom=present()||(s.archiveActive&&locationKey()==='archive');
 const workspace=inRoom&&['quiz','status','review','result'].includes(kind);
 window.UPPDRAG_MEETINGS?.close?.(false);
 if(workspace){
  if(!roomRestore)roomRestore={visibility:roomView.style.visibility,footerHidden:roomFooter.hidden};
  roomView.style.visibility='hidden';roomFooter.hidden=true;document.body.classList.add('ch1-memory');
 }else restoreRoom();
 view=kind;modal.classList.toggle('ch1MemoryFull',workspace);modal.hidden=false;document.body.classList.add('ch1-open');
 modal.innerHTML=workspace&&html?'<div class="ch1MemorySetting" aria-hidden="true"><canvas id="ch1CutPaperScene" class="ch1CutPaperScene"></canvas></div><button type="button" class="ch1Return" data-mb="close">← Till rummet</button><article class="ch1Sheet">'+html+'</article>':html;
 if(workspace&&html){modal.dataset.recallScene=s.archiveActive?'archive':current().p;paintCloseup();}
 modal.setAttribute('aria-label',workspace?'Arbeta med '+(s.archiveActive?'minnen hos Rut':(area()?.document)||'dokumentet'):'Minnesboken');
 modal.focus({preventScroll:true});
}
function close(){recall?.leavingPanel();view='closed';modal.hidden=true;restoreRoom();document.body.classList.remove('ch1-open');s.archiveActive=false;persist();drawHud();(returnFocus?.isConnected?returnFocus:hud.querySelector('[data-mb="book"]'))?.focus?.({preventScroll:true});}
window.addEventListener('resize',paintCloseup);
window.addEventListener('uppdrag-paper-fibres-ready',paintCloseup);
const top=title=>'<div class="mb-top"><p>Fria och ofria · kapitel 2</p><button data-mb="close">'+(locationKey()?'Till rummet':'Till staden')+'</button></div><h2>'+esc(title)+'</h2>';
function drawHud(){
 const q=mastery.summary();hud.innerHTML='<strong>'+(q.chapterComplete?'Minnesmästare · kapitel 2 klart':q.label+' · '+q.done+' av 3 områden klara')+'</strong><div class="ch1Wallet">'+s.daler+' daler · '+s.apples+(s.apples===1?' äpple':' äpplen')+'</div><button class="primary" data-mb="book">Minnesbok</button><button data-mb="rut">Rut · repetera</button>'+(q.chapterComplete&&!lessonEnd?'<a href="chapter3-pilot.html">Till kapitel 3 →</a>':'');
}
const statusLabel={available:'○ Återstår','in-progress':'◐ Påbörjat',failed:'○ Återstår · nytt försök',pending:'◷ Väntar på granskning',clear:'✓ Klar',locked:'– Låst'};
function book(){
 returnFocus=document.activeElement;const q=mastery.summary();
 let h=top('Din minnesbok')+'<p>'+(q.chapterComplete?(lessonEnd?'Alla tre mästarstämplar är klara. Kapitel 2 är avklarat.':'Alla tre mästarstämplar är klara. Kapitel 3 är öppet.'):q.label+': '+q.done+' av 3 områden klara. Välj var du vill börja.')+'</p>';
 if(!story.introduced&&!q.chapterComplete)h+='<p class="mb-note">Maja på Kaffehuset visar hur minnesboken fungerar. Du kan också gå direkt till ett område.</p><button data-mb="maja">Besök Maja</button>';
 if(s.masteryMigrationNotice)h+='<p class="mb-note">Dina svar, pengar och äpplen finns kvar. Stämplar som spelet kunde kontrollera finns också kvar. Gör de prov som återstår i minnesboken.</p>';
 h+='<p class="mb-note">Klara de tre lärlingsproven för att öppna gesällproven. Klara sedan gesällproven för att öppna mästarproven. Sidoäventyren ger inga stämplar.</p>';
 for(const a of areas){
  h+='<section class="mb-area"><h3>'+esc(a.name)+'</h3><p class="mb-note">'+esc(a.place+' · '+a.who)+'</p><div class="mb-stamps">';
  for(let r=0;r<3;r++){
   const st=status(a,levels[r]);
   h+='<button data-mb="select" data-area="'+a.id+'" data-level="'+levels[r]+'" class="mb-'+st+'"'+(st==='locked'?' disabled':'')+'><span>'+labels[r]+'</span>'+statusLabel[st]+'</button>';
  }
  h+='</div></section>';
 }
 if(!q.chapterComplete){const needed=q.remaining.map(a=>a.name).join(', ');h+='<p class="mb-note">Återstår på '+q.label.toLowerCase()+'nivån: '+esc(needed)+'.</p>';}
 else if(!lessonEnd)h+='<p><a href="chapter3-pilot.html">Fortsätt till kapitel 3 →</a></p>';
 h+='<p class="mb-note"><b>Frivilligt sidouppdrag · Sängen vid fönstret:</b> '+esc(window.UPPDRAG_CH2_BED?.goal?.()||'Undersök sängen på Barnhuset.')+'</p>';
 h+='<p class="mb-note">1 äpple ger ett nytt försök på hela områdesprovet efter en miss. 1 daler ger en ledtråd på lärlingsnivån. Rut hjälper dig gratis.</p>';
 if(pupilRound)h+='<p class="mb-note">Du kan ha högst ett äpple i fickan. När du har använt det behöver du repetera hos Rut för att få ett nytt.</p>';
 display(h,'book');
}
const sessionFields=['index','trial','mode','recallUI','recallAttempt','recallInterlude','hint','draft'];
function stash(){if(!s.step)return;s.sessions[s.step]=Object.fromEntries(sessionFields.map(k=>[k,copy(s[k]??null)]));}
function select(aid,l,travel=false){
 const a=areas.find(a=>a.id===aid),r=levels.indexOf(l);if(!a||r<0||!mastery.levelUnlocked(l))return false;
 recall?.leavingPanel();stash();s.step=a.slot+r*3;selected={aid,l};
 const saved=s.sessions[s.step];
 Object.assign(s,saved||{index:0,trial:0,mode:'intro',recallUI:null,recallAttempt:0,recallInterlude:null,hint:false,draft:''});
 persist();drawHud();if(travel)goPlace(a.p);else showArea();return true;
}
function showArea(){
 if(!area())return book();
 const a=area(),st=status(),r=current().r;
 if(st==='failed'||st==='pending')return renderStatus();
 let h=top(a.name)+'<p>'+labels[r]+' · '+a.place+' · '+current().f.length+' uppgifter</p>';
 if(st==='clear')h+='<p>✓ Den här stämpeln är klar. Du kan repetera gratis hos Rut.</p>';
 else h+='<p>'+esc(story.visits[a.id]?r===0?'Vi fortsätter där vi var.':labels[r]+'provet är ett nytt minnesprov. Berättelsen är kvar.':areaSummary[a.id])+'</p><div class="mb-actions"><button class="primary" data-mb="'+(present()?'begin':'travel')+'">'+(present()?'Börja eller fortsätt provet':'Gå till '+a.place)+'</button></div>';
 h+='<button data-mb="book">Till minnesboken</button>';display(h,'area');
}
const areaSummary={
 women:'Undersök anteckningen tillsammans med Olof. Hur begränsades kvinnors rätt att bestämma över sina liv?',
 power:'Granska kyrkoboken med Olof. Hur motiverades männens makt, och vilka kunde använda aga?',
 children:'Läs barnhusets anteckningar med Siri. Varför behövde barn bo här, och hur såg vardagen ut?'
};
const intro={
 women:'Jag försöker förstå anteckningen om kvinnors liv. Vem fick bestämma över dem, och vad kunde hända en ogift kvinna som väntade barn?',
 power:'Kan du hjälpa mig med kyrkoboken? Jag behöver reda ut hur männens och adelns makt försvarades och användes.',
 children:'Kan du hjälpa mig att läsa anteckningarna om barnen? Jag vill kunna berätta varför de kom hit och hur deras vardag såg ut.'
};
function begin(){
 if(!area()||!present())return false;
 if(status()==='failed'||status()==='pending'){renderStatus();return false;}
 const res=mastery.begin(area().id,level());if(!res.ok)return false;
 if(!res.resumed){s.trial=res.attempt;s.index=0;s.recallUI=null;s.recallAttempt=(s.recallAttempt||0)+1;s.mode='question';}
 story.visits[area().id]=true;people.met[current().who]=true;saveWorld();
 encountered(current().f[s.index]);persist();
 display('','quiz');recall.render();drawHud();return true;
}
function hasPassed(id){return s.record.some(x=>x.version==='recall-2-rubric'&&!x.beforeChapter2Mastery&&x.step===s.step&&x.trial===s.trial&&x.id===id&&x.ok&&x.assessment!=='pending-review'&&x.assessment!=='self-review'&&(current().r!==2||x.independent||x.assessment==='teacher-approved'));}
function finished(){
 if(!recall.stageSolved())return false;
 mastery.pass(area().id,level());
 for(const id of current().f)s.earned[id]=true;
 s.masteryRewards??={};const reward=s.step;if(!s.masteryRewards[reward]){s.daler++;s.masteryRewards[reward]=true;}
 s.mode='end';stash();persist();drawHud();
 const q=mastery.summary();display(top(labels[current().r]+' i '+area().name+' – klart')+'<p>'+esc(current().who)+': ”Tack. Det här har du visat att du kan.”</p><p>'+(q.chapterComplete?(lessonEnd?'Du är minnesmästare i kapitel 2. Bra arbetat!':'Du är minnesmästare i kapitel 2. Kapitel 3 är öppet.'):q.label+': '+q.done+' av 3 områden klara.')+'</p><button class="primary" data-mb="book">Öppna minnesboken</button>'+(q.chapterComplete&&!lessonEnd?'<p><a href="chapter3-pilot.html">Fortsätt till kapitel 3 →</a></p>':''),'result');return true;
}
function pending(t,u){
 if(s.archiveActive||s.recallInterlude||!t||!current().f.includes(t.id)||t.rank!==current().r)return false;
 const prior=s.reviewQueue.find(x=>x.step===s.step&&x.trial===s.trial&&x.id===t.id&&!x.resolved);
 if(!prior)s.reviewQueue.push({id:t.id,step:s.step,trial:s.trial,index:s.index,answer:copy(u.drafts),at:new Date().toISOString()});
 mastery.pending(area().id,level());practiceTicket();persist();drawHud();
}
function practiceTicket(){
 if(status()!=='pending')return null;
 let ticket=s.reviewPractice[s.step];
 if(!ticket||ticket.trial!==s.trial)ticket=s.reviewPractice[s.step]={trial:s.trial,roundBefore:s.archiveRounds||0,logBefore:s.recallRutLog?.length||0,completedRound:null};
 return ticket;
}
function practiceReady(){
 const ticket=practiceTicket();if(!ticket||!(ticket.completedRound>ticket.roundBefore))return false;
 // Keep the recall engine's exposure rule: two recorded retrieval responses
 // must separate the last model view and the new answer. Never erase exposure.
 const shown=current().f.map(id=>s.recallShown?.[id]).filter(Number.isInteger);
 return !shown.length||s.recallClock-Math.max(...shown)>=2;
}
function practice(){
 if(status()!=='pending'){
  const t=recall.current,u=recall.ui;if(!t||u?.phase!=='review')return false;
  pending(t,u);
 }
 practiceTicket();persist();goArchive();return true;
}
function retryAfterPractice(){
 if(!practiceReady()||s.apples<1)return false;
 if(!present()){goPlace(area().p);return true;}
 return retry();
}
function encountered(id){if(id&&!s.encountered.includes(id)){s.encountered.push(id);persist();}}
function recorded(entry){
 if(!entry.ok)mastery.fail(area().id,level());
 else if(current().r===2&&!entry.independent)pending(bank.find(t=>t.id===entry.id),{drafts:entry.answer});
 persist();drawHud();
}
function renderStatus(){
 const st=status();if(!['failed','pending'].includes(st))return false;
 let h=top(area().name)+'<p>'+labels[current().r]+' · '+esc(area().place)+'</p>';
 if(st==='failed'){const entry=s.record.at(-1),t=bank.find(t=>t.id===entry?.id);if(t){h+='<p>'+esc(t.prompt)+'</p>'+window.UPPDRAG_RECALL_ASSESS.modelHTML(t);s.recallShown[t.id]=s.recallClock;persist();}}
 if(st==='failed')h+='<p>Prova igen från första frågan. Det kostar ett äpple. Dina andra stämplar finns kvar. Saknar du ett äpple? Öva gratis hos Rut i Arkivet.</p><div class="mb-actions"><button class="primary" data-mb="retry"'+(s.apples<1?' disabled':'')+'>Nytt försök · 1 äpple</button><button data-mb="rut">Öva gratis hos Rut</button></div>';
 else{
  const ready=practiceReady()&&s.apples>0;persist();
  h+='<p>Ditt svar är sparat. Du har inte fått en stämpel än. Du kan visa din lärare eller öva och göra ett nytt försök.</p><p>'+(ready?'Du har övat hos Rut. Nu kan du göra om provet från första frågan utan hjälp. Det kostar ett äpple.':'Öva en omgång hos Rut i Arkivet. Där kan du få ett äpple till ett nytt försök. Kom sedan tillbaka hit.')+'</p><div class="mb-actions"><button class="'+(ready?'primary':'')+'" data-mb="practice-retry"'+(ready?'':' disabled')+'>'+(present()?'Prova igen utan hjälp · 1 äpple':'Gå till '+area().place)+'</button><button class="'+(ready?'':'primary')+'" data-mb="practice">Öva hos Rut</button><button data-mb="review">Visa för läraren</button><button data-mb="revise"'+(s.apples<1?' disabled':'')+'>Ändra mitt svar · 1 äpple</button></div>';
 }
 h+='<button data-mb="book">Till minnesboken</button>';display(h,'status');return true;
}
function review(){
 const entry=s.reviewQueue.find(x=>x.step===s.step&&x.trial===s.trial&&mainReview(x));if(!entry)return;
 const t=bank.find(t=>t.id===entry.id);if(!t)return false;
 s.recallShown??={};s.recallShown[t.id]=s.recallClock;persist();
 let h=top('Visa svaret för din lärare')+'<p>Be din lärare läsa ditt svar. Läraren skriver sin kod om svaret är rätt.</p><p>'+esc(t.prompt)+'</p><blockquote>'+esc(entry.answer.join('\n'))+'</blockquote>';
 h+=window.UPPDRAG_RECALL_ASSESS.modelHTML(t)+'<label for="mbTeacherCode">Lärarkod</label><input type="password" id="mbTeacherCode" inputmode="numeric" maxlength="6" autocomplete="off" aria-describedby="mbTeacherError"><p id="mbTeacherError" role="alert"></p><div class="mb-actions"><button class="primary" data-mb="approve">Godkänn svaret</button><button data-mb="practice">Öva och prova igen</button><button data-mb="revise"'+(s.apples<1?' disabled':'')+'>Ändra mitt svar · 1 äpple</button></div><button data-mb="book">Till minnesboken</button>';display(h,'review');
}
async function approve(){
 const input=modal.querySelector('#mbTeacherCode'),button=modal.querySelector('[data-mb="approve"]');if(!input||button?.disabled)return false;
 const entry=s.reviewQueue.find(x=>x.step===s.step&&x.trial===s.trial&&mainReview(x));if(!entry)return false;
 if(button)button.disabled=true;
 const code=input.value;input.value='';const accepted=await window.UPPDRAG_TEACHER_REVIEW.verify(code);
 if(!input.isConnected||view!=='review'||s.step!==entry.step||s.trial!==entry.trial||entry.resolved)return false;
 if(button)button.disabled=false;
 if(!accepted){modal.querySelector('#mbTeacherError').textContent='Koden stämmer inte. Be din lärare skriva koden.';input.focus({preventScroll:true});return false;}
 entry.resolved='approved';entry.reviewedAt=new Date().toISOString();
 delete s.reviewPractice[s.step];
 s.record.push({version:'recall-2-rubric',chapter:2,step:s.step,trial:s.trial,id:entry.id,level:labels[current().r],ok:true,support:true,independent:false,assessment:'teacher-approved',answer:copy(entry.answer),at:entry.reviewedAt});
 mastery.resumePending(area().id,level());s.index=entry.index;s.mode='feedback';
 const u=recall.ui;u.phase='feedback';u.drafts=copy(entry.answer);u.result={status:'right',support:true};
 persist();display('','quiz');recall.render();return true;
}
function revise(t=recall.current,u=recall.ui){
 if(!area()||s.archiveActive||s.recallInterlude||s.apples<1)return false;
 if(status()==='in-progress'){
  if(!present()||u?.phase!=='review'||!current().f.includes(t?.id))return false;
  pending(t,u);
 }
 if(status()!=='pending')return false;
 return retry();
}
function retry(){
 const oldTrial=s.trial;
 if(!mastery.retryWithApple(area().id,level()).ok)return false;
 for(const x of s.reviewQueue)if(x.step===s.step&&x.trial===oldTrial&&mainReview(x)){x.resolved='apple-retry';x.retriedAt=new Date().toISOString();}
 if(s.reviewPractice)delete s.reviewPractice[s.step];
 // Restart the whole selected area; keep other stamps and previous answers.
 s.sessions[s.step]=null;s.index=0;s.mode='intro';s.recallUI=null;s.recallInterlude=null;s.hint=false;persist();
 if(present())begin();else goPlace(area().p);return true;
}
function available(includeStarter=true){
 const known=new Set([...s.encountered,...s.record.map(r=>r.id),...Object.keys(s.earned)]);
 const prior=parse(previousKey,{});
 for(const id of [...(prior.encountered||[]),...(prior.record||[]).map(r=>r.id),...Object.keys(prior.earned||{})])known.add(id);
 if(includeStarter&&!known.size)for(const t of bank.filter(t=>t.rank===0&&t.topic==='relations'))known.add(t.id);
 const topics=new Set();return allBank.filter(t=>known.has(t.id)).filter(t=>{const key=t.chapter+'/'+t.topic;if(topics.has(key))return false;topics.add(key);return true;}).map(t=>t.id);
}
function goPlace(p){
 close();if(region.id!=='main'){setMessage('Minnesboken','Återvänd till staden först.');return;}
 if(locationKey()===p){window.UPPDRAG_MEETINGS?.start?.();return;}
 if(interior)leaveInterior();
 if(p==='quay')requestHarbour();else{const name=p==='archive'?'Arkivet':p==='cafe'?'Kaffehuset':areas.find(a=>a.p===p)?.place;const b=region.buildings.find(b=>b.name===name);if(b)requestInterior(b);}
}
function goArchive(){goPlace('archive');}
function enterArchive(){if(locationKey()!=='archive')return false;return recall.enterArchive();}
function hereArea(){
 const p=locationKey(),l=mastery.summary().level;
 const chosen=selected&&areas.find(a=>a.id===selected.aid&&a.p===p&&status(a,selected.l)!=='clear');
 return chosen||areas.find(a=>a.p===p&&status(a,l)!=='clear')||areas.find(a=>a.p===p);
}
function chooseHere(p,aid){
 const a=areas.find(a=>a.id===aid&&a.p===p)||hereArea();if(!a)return false;
 if(selected?.aid===a.id&&status(a,selected.l)!=='clear')return select(a.id,selected.l);
 const l=levels.find(l=>mastery.levelUnlocked(l)&&status(a,l)!=='clear');
 return l?select(a.id,l):false;
}
let hudKey='';
function tick(){const key=JSON.stringify([mastery.summary(),s.daler,s.apples]);if(view==='closed'&&hudKey!==key){hudKey=key;drawHud();}}
const reviewRewards={
 awardRutApple(){
  for(const ticket of Object.values(s.reviewPractice))if(s.archiveRounds>ticket.roundBefore&&(s.recallRutLog?.length||0)>ticket.logBefore)ticket.completedRound=s.archiveRounds;
  if(pupilRound){s.lessonRutAppleAdded=s.apples<1;if(s.lessonRutAppleAdded)s.apples++;}else s.apples++;
 },
 ...(pupilRound?{
 rutRewardHTML(){return s.lessonRutAppleAdded?'<h2 class="rc-prompt">Ett äpple för repetitionen</h2><p>Du svarade rätt på övningsfrågorna. Du får ett äpple.</p><p class="rc-note">Du kan ha ett äpple i fickan. Använd det till ett nytt försök innan du tjänar ett nytt.</p>':'<h2 class="rc-prompt">Repetitionen är klar</h2><p>Du har redan ett äpple i fickan. Använd det till ett nytt försök innan du kan få ett nytt hos Rut. Du kan fortsätta öva gratis.</p>';}
 }:{})
};
recall=window.UPPDRAG_RECALL_ENGINE.attach({chapter:2,state:()=>s,runs,facts,modal,storage,current,location:locationKey,present,previousKeys:{1:previousKey},persist,drawHud,paint:paintCloseup,
 openArchive(){display('','quiz');},finished,close,goRut:goArchive,
 mastery:{hasPassed,available,renderStatus,recorded,pending,encountered,...reviewRewards,revise,practiceRetry:true,hint:()=>mastery.buyHint(area().id,level()).ok,action(name){if(name==='retry')return retry();if(name==='practice-review'){practice();return true;}return false;}}
});
// Import only complete, evidenced area attempts, in prerequisite order. Never infer
// stamps from old chapter completion or from reading a model answer.
if(!s.chapter2MasteryMigrated){
 for(let r=0;r<3;r++)for(const a of areas){
  if(!mastery.levelUnlocked(levels[r])||status(a,levels[r])!=='available')continue;
  const groups=new Map();for(const id of runs[a.slot+r*3].f){const t=bank.find(t=>t.id===id);const step=(t.place==='church'?1:2)+r*2;if(!groups.has(step))groups.set(step,[]);groups.get(step).push(id);}
  const proved=[...groups].every(([step,ids])=>{
   const eligible=s.record.filter(x=>x.beforeChapter2Mastery&&x.version==='recall-2-rubric'&&x.step===step&&x.ok&&x.assessment!=='pending-review'&&x.assessment!=='self-review'&&(r<2||x.independent));
   return [...new Set(eligible.map(x=>x.trial))].some(tr=>ids.every(id=>eligible.some(x=>x.id===id&&x.trial===tr)));
  });
  if(proved){mastery.begin(a.id,levels[r]);mastery.pass(a.id,levels[r]);s.masteryRewards??={};s.masteryRewards[a.slot+r*3]=true;}
 }
 s.masteryMigrationNotice=!!old;s.chapter2MasteryMigrated=true;
}
s.complete=mastery.chapterComplete();persist();
window.UPPDRAG_CH2_PILOT={tick,go:book,close,scenes:runs,saveKey:storage,persist,refresh:drawHud,
 get state(){return s;},get recall(){return recall;},get memoryVisible(){return !!roomRestore;},
 wantsMajaMeeting:p=>p==='cafe'&&!story.introduced,
 majaProblem:()=> 'Frihetstiden betydde inte att alla fick bestämma över sina liv. Olof i Kyrkan och Siri på Barnhuset behöver hjälp att reda ut människors olika villkor. Vem vill du börja hos?',
 acceptMajaMission(){story.introduced=true;people.met.Maja=true;saveWorld();book();},
 wantsMemoryMeeting:p=>areas.some(a=>a.p===p)&&areas.filter(a=>a.p===p).some(a=>levels.some(l=>mastery.levelUnlocked(l)&&status(a,l)!=='clear')),
 memoryProblem(){const a=hereArea();if(!a)return '';const choices=areas.filter(a=>a.p===locationKey()&&levels.some(l=>mastery.levelUnlocked(l)&&status(a,l)!=='clear'));
  const thanks=locationKey()==='barnhus'?(window.UPPDRAG_CH2_BED?.siriLine?.()||''):'';
  return (thanks?thanks+' ':'')+(choices.length>1?'Jag har två handlingar som jag vill reda ut. Vilken ska vi börja med?':story.visits[a.id]?'Välkommen tillbaka! Vill du fortsätta undersöka '+a.document+' med mig?':intro[a.id]);},
 memoryChoices(){const l=mastery.summary().level;return areas.filter(a=>a.p===locationKey()&&status(a,l)!=='clear').map(a=>({id:a.id,label:a.id==='women'?'Läs anteckningen om kvinnor':a.id==='power'?'Granska kyrkoboken':'Läs barnhusets anteckningar'}));},
 memoryChoice:()=> 'Läs '+(hereArea()?.document||'anteckningen'),
 enterMemory(aid){if(chooseHere(locationKey(),aid))begin();},wantsMemoryThanks:()=>false,memoryThanks:()=>'',finishMemory:finished,
 wantsArchiveMeeting:p=>p==='archive',archiveHello:()=> pupilRound?(s.apples?'Vi kan öva på sådant du redan mött. Du har redan ett äpple. Använd det till ett nytt försök, så kan du få ett nytt när du repeterar hos mig.':'Vi övar på sådant du redan mött. Det kostar inget. En avslutad repetitionsomgång ger ett äpple. Du kan ha ett i fickan åt gången.'):'Vi övar på sådant du redan mött. Det kostar inget. En avslutad repetitionsomgång ger ett äpple.',enterArchive,goArchive,
 idleLine:p=>p==='barnhus'?(window.UPPDRAG_CH2_BED?.siriLine?.()||'Välkommen tillbaka!'):'Välkommen tillbaka!',
 openBook:book,selectArea:select,
 get encounteredTaskIds(){return s.encountered.slice();},
 get repetitionTaskIds(){const ids=new Set(available(false));const topics=new Set(allBank.filter(t=>ids.has(t.id)).map(t=>t.chapter+'/'+t.topic));return allBank.filter(t=>t.rank===0&&topics.has(t.chapter+'/'+t.topic)).map(t=>t.id);}
};
function action(e){
 const button=e.target.closest('[data-mb]');if(!button)return;const name=button.dataset.mb;
 if(name==='close')close();else if(name==='book')book();else if(name==='select')select(button.dataset.area,button.dataset.level);
 else if(name==='travel')goPlace(area().p);else if(name==='begin')begin();else if(name==='rut')goArchive();else if(name==='maja')goPlace('cafe');
 else if(name==='retry')retry();else if(name==='review')review();else if(name==='approve')approve();else if(name==='revise')revise();else if(name==='practice')practice();else if(name==='practice-retry')retryAfterPractice();
}
hud.addEventListener('click',action);modal.addEventListener('click',e=>{action(e);const act=e.target.closest('[data-action]')?.dataset.action;if(act==='close'||act==='archive-exit')close();else recall.action(act,e);});
modal.addEventListener('input',e=>recall.input(e));
modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}else if(e.key==='Tab'){
 const els=[...modal.querySelectorAll('button:not([disabled]),a[href],input,textarea')],first=els[0],last=els.at(-1);
 if(e.shiftKey&&(document.activeElement===first||document.activeElement===modal)){e.preventDefault();last?.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===modal)){e.preventDefault();first?.focus();}
 }else recall.key(e);});
drawHud();setMessage('Fria och ofria','Besök Olof i Kyrkan eller Siri på Barnhuset. I minnesboken väljer du ordning.');
})();
