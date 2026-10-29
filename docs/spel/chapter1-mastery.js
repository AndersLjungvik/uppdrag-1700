/* Chapter 1 reference implementation: same rooms and fifteen original tasks.
 * Progress, story, side adventures and conversations have separate save keys.
 */
(function(){
'use strict';
const storage='uppdrag1700.ch1-real-world.20261019.v11';
const storyKey='uppdrag1700.story.v2.ch1',peopleKey='uppdrag1700.people.v2.ch1';
const parse=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback;}catch{return fallback;}};
const copy=v=>JSON.parse(JSON.stringify(v));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const areas=[
 {id:'start',name:'Frihetstidens början',place:'Slottet',p:'palace',who:'Amira',slot:1},
 {id:'law',name:'Lagar och inflytande',place:'Riksdagshuset',p:'riksdag',who:'Elin',slot:3},
 {id:'trade',name:'Handel med Asien',place:'Kajen',p:'quay',who:'Jo',slot:2}
];
const levels=['learner','journeyman','master'],labels=['Lärling','Gesäll','Mästare'];
const bank=window.UPPDRAG_RECALL_BANK.filter(t=>t.chapter===1);
const facts={},runs=[{p:'cafe',who:'Maja',f:[],r:0}];
for(let r=0;r<3;r++)for(const a of [...areas].sort((a,b)=>a.slot-b.slot))runs.push({p:a.p,who:a.who,r,f:bank.filter(t=>t.rank===r&&t.place===a.p).map(t=>t.id)});
window.UPPDRAG_RECALL_ENGINE.prepare(1,facts,runs);
const old=parse(storage,null);
try{if(old&&!localStorage.getItem(storage+'.before-mastery-2'))localStorage.setItem(storage+'.before-mastery-2',JSON.stringify(old));}catch{}
let s=old&&old.v===2?old:{v:2,record:[],daler:3,apples:0,earned:{},step:0,index:0,trial:0,mode:'intro'};
s.record=Array.isArray(s.record)?s.record:[];s.earned??={};s.sessions??={};s.reviewQueue??=[];s.encountered??=[];
s.daler=Math.max(0,Number(s.daler)||0);s.apples=Math.max(0,Number(s.apples)||0);
s.archiveActive=false;s.step=Number.isInteger(s.step)&&runs[s.step]?s.step:0;
let story=parse(storyKey,{v:1,introduced:false,visits:{}}),people=parse(peopleKey,{v:1,met:{}});
story.visits??={};people.met??={};
let recall=null,view='closed',selected=null,returnFocus=null,roomRestore=null;
const current=()=>runs[s.step],area=()=>areas.find(a=>a.p===current().p),level=()=>levels[current().r];
const persist=()=>{s.complete=mastery.chapterComplete();try{localStorage.setItem(storage,JSON.stringify(s));}catch{}};
const saveWorld=()=>{try{localStorage.setItem(storyKey,JSON.stringify(story));localStorage.setItem(peopleKey,JSON.stringify(people));}catch{}};
const mastery=window.UPPDRAG_MASTERY.configure({chapter:1,areas,resources:{getApples:()=>s.apples,setApples:v=>{s.apples=v;persist();},getDaler:()=>s.daler,setDaler:v=>{s.daler=v;persist();}}});
const status=(a=area(),l=level())=>a?mastery.snapshot().state.areas[a.id][l].status:'available';
const locationKey=()=>!interior?'':interior.outdoor&&interior.regionId==='main'?'quay':({Slottet:'palace',Riksdagshuset:'riksdag',Kaffehuset:'cafe',Arkivet:'archive'})[interior.name]||'';
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
 modal.setAttribute('aria-label',workspace?'Arbeta med '+(s.archiveActive?'minnen hos Rut':documents[current().p]||'dokumentet'):'Minnesboken');
 modal.focus({preventScroll:true});
}
function close(){recall?.leavingPanel();view='closed';modal.hidden=true;restoreRoom();document.body.classList.remove('ch1-open');s.archiveActive=false;persist();drawHud();(returnFocus?.isConnected?returnFocus:hud.querySelector('[data-mb="book"]'))?.focus?.({preventScroll:true});}
window.addEventListener('resize',paintCloseup);
window.addEventListener('uppdrag-paper-fibres-ready',paintCloseup);
const top=title=>'<div class="mb-top"><p>Frihetstiden · kapitel 1</p><button data-mb="close">'+(locationKey()?'Till rummet':'Till staden')+'</button></div><h2>'+esc(title)+'</h2>';
function drawHud(){
 const q=mastery.summary();hud.innerHTML='<strong>'+(q.chapterComplete?'Minnesmästare · kapitel 1 klart':q.label+' · '+q.done+' av 3 områden klara')+'</strong><div class="ch1Wallet">'+s.daler+' daler · '+s.apples+' äpplen</div><button class="primary" data-mb="book">Minnesbok</button><button data-mb="rut">Rut · repetera</button>'+(q.chapterComplete?'<a href="chapter2-pilot.html">Till kapitel 2 →</a>':'');
}
const statusLabel={available:'○ Återstår','in-progress':'◐ Påbörjat',failed:'○ Återstår · nytt försök',pending:'◷ Väntar på granskning',clear:'✓ Klar',locked:'– Låst'};
function book(){
 returnFocus=document.activeElement;const q=mastery.summary();
 let h=top('Din minnesbok')+'<p>'+(q.chapterComplete?'Alla tre mästarstämplar är klara. Kapitel 2 är öppet.':q.label+': '+q.done+' av 3 områden klara. Välj ordning mellan områdena.')+'</p>';
 if(!story.introduced&&!q.chapterComplete)h+='<p class="mb-note">Maja på Kaffehuset visar hur minnesboken fungerar. Du kan också gå direkt till ett område.</p><button data-mb="maja">Besök Maja</button>';
 if(s.masteryMigrationNotice)h+='<p class="mb-note">Dina tidigare svar och resurser är bevarade. Stämplar har bara förts över där hela områdets prov kan styrkas. Övriga områden behöver kompletteras.</p>';
 h+='<p class="mb-note">Alla tre lärlingsstämplar öppnar gesällproven. Alla tre gesällstämplar öppnar mästarproven. Sidoäventyr ger inga provstämplar.</p>';
 for(const a of areas){
  h+='<section class="mb-area"><h3>'+esc(a.name)+'</h3><p class="mb-note">'+esc(a.place+' · '+a.who)+'</p><div class="mb-stamps">';
  for(let r=0;r<3;r++){
   const st=status(a,levels[r]);
   h+='<button data-mb="select" data-area="'+a.id+'" data-level="'+levels[r]+'" class="mb-'+st+'"'+(st==='locked'?' disabled':'')+'><span>'+labels[r]+'</span>'+statusLabel[st]+'</button>';
  }
  h+='</div></section>';
 }
 if(!q.chapterComplete){const needed=q.remaining.map(a=>a.name).join(', ');h+='<p class="mb-note">Återstår på '+q.label.toLowerCase()+'nivån: '+esc(needed)+'.</p>';}
 else h+='<p><a href="chapter2-pilot.html">Fortsätt till kapitel 2 →</a></p>';
 h+='<p class="mb-note">1 äpple ger ett nytt försök på hela områdesprovet efter en miss. 1 daler ger en ledtråd på lärlingsnivån. Rut hjälper dig gratis.</p>';
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
const documents={palace:'brevet',riksdag:'protokollet',quay:'handelslistan'};
const areaSummary={start:'Undersök brevet vid Amiras skrivbord och ta reda på hur kungamakten förändrades efter Karl XII.',law:'Undersök protokollet hos Elin och ta reda på hur lagarna och ståndsriksdagen fungerade.',trade:'Granska handelslistan på Kajen tillsammans med Jo.'};
const intro={
 start:'Kan du hjälpa mig med brevet? Jag behöver reda ut vem som tog över efter Karl XII och hur kungamakten förändrades.',
 law:'Kan du hjälpa mig med protokollet? Jag behöver reda ut hur lagarna fungerar och vilka som får vara med och bestämma.',
 trade:'Kan du hjälpa mig att granska handelslistan? Jag behöver reda ut vart skeppen seglar och vilka varor de tar hem.'
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
function hasPassed(id){return s.record.some(x=>x.version==='recall-2-rubric'&&x.step===s.step&&x.trial===s.trial&&x.id===id&&x.ok&&x.assessment!=='pending-review'&&x.assessment!=='self-review'&&(current().r!==2||x.independent||x.assessment==='teacher-approved'));}
function finished(){
 if(!recall.stageSolved())return false;
 mastery.pass(area().id,level());
 for(const id of current().f)s.earned[id]=true;
 s.masteryRewards??={};const reward=s.step;if(!s.masteryRewards[reward]){s.daler++;s.masteryRewards[reward]=true;}
 s.mode='end';stash();persist();drawHud();
 const q=mastery.summary();display(top(labels[current().r]+' i '+area().name+' – klart')+'<p>'+esc(current().who)+': ”Tack. Det här har du visat att du kan.”</p><p>'+(q.chapterComplete?'Du är minnesmästare i kapitel 1. Kapitel 2 är öppet.':q.label+': '+q.done+' av 3 områden klara.')+'</p><button class="primary" data-mb="book">Öppna minnesboken</button>'+(q.chapterComplete?'<p><a href="chapter2-pilot.html">Fortsätt till kapitel 2 →</a></p>':''),'result');return true;
}
function pending(t,u){
 const prior=s.reviewQueue.find(x=>x.step===s.step&&x.trial===s.trial&&x.id===t.id&&!x.resolved);
 if(!prior)s.reviewQueue.push({id:t.id,step:s.step,trial:s.trial,index:s.index,answer:copy(u.drafts),at:new Date().toISOString()});
 mastery.pending(area().id,level());persist();drawHud();
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
 if(st==='failed')h+='<p>Provet behöver ett nytt försök. Ett äpple startar om hela det här områdesprovet. Dina andra stämplar och händelser i staden finns kvar.</p><div class="mb-actions"><button class="primary" data-mb="retry"'+(s.apples<1?' disabled':'')+'>Nytt försök · 1 äpple</button><button data-mb="rut">Öva gratis hos Rut</button></div>';
 else h+='<p>◷ Svaret är sparat och väntar på granskning. Det har inte gett en stämpel. Du kan visa det för din lärare eller bearbeta det gratis.</p><div class="mb-actions"><button data-mb="review">Visa svaret för läraren</button><button data-mb="revise">Bearbeta svaret</button></div>';
 h+='<button data-mb="book">Till minnesboken</button>';display(h,'status');return true;
}
function review(){
 const entry=s.reviewQueue.find(x=>x.step===s.step&&x.trial===s.trial&&!x.resolved);if(!entry)return;
 const t=bank.find(t=>t.id===entry.id);
 let h=top('Granska tillsammans med läraren')+'<p class="mb-note">Granskningen görs på den här enheten. Detta är ingen säker lärarinloggning.</p><p>'+esc(t.prompt)+'</p><blockquote>'+esc(entry.answer.join('\n'))+'</blockquote>';
 h+=window.UPPDRAG_RECALL_ASSESS.modelHTML(t)+'<label><input type="checkbox" id="mbTeacher"> Jag är lärare och har granskat elevens svar mot uppgiftens krav.</label><div class="mb-actions"><button class="primary" data-mb="approve">Godkänn innehållet</button><button data-mb="revise">Låt eleven bearbeta</button></div><button data-mb="book">Till minnesboken</button>';display(h,'review');
}
function approve(){
 if(!modal.querySelector('#mbTeacher')?.checked)return false;
 const entry=s.reviewQueue.find(x=>x.step===s.step&&x.trial===s.trial&&!x.resolved);if(!entry)return false;
 entry.resolved='approved';entry.reviewedAt=new Date().toISOString();
 s.record.push({version:'recall-2-rubric',chapter:1,step:s.step,trial:s.trial,id:entry.id,level:labels[current().r],ok:true,support:true,independent:false,assessment:'teacher-approved',answer:copy(entry.answer),at:entry.reviewedAt});
 mastery.resumePending(area().id,level());s.index=entry.index;s.mode='feedback';
 const u=recall.ui;u.phase='feedback';u.drafts=copy(entry.answer);u.result={status:'right',support:true};
 persist();display('','quiz');recall.render();return true;
}
function revise(){
 mastery.resumePending(area().id,level());
 for(const x of s.reviewQueue)if(x.step===s.step&&x.trial===s.trial&&!x.resolved)x.resolved='revising';
 const u=recall.ui;if(u){u.phase='question';u.error='';u.result=null;u.hint=true;}s.mode='question';persist();display('','quiz');recall.render();
}
function retry(){
 if(!mastery.retryWithApple(area().id,level()).ok)return false;
 // The whole selected area is retried; other runs, world flags and history survive.
 s.sessions[s.step]=null;s.index=0;s.mode='intro';s.recallUI=null;s.recallInterlude=null;persist();
 if(present())begin();else goPlace(area().p);return true;
}
function available(includeStarter=true){
 const known=new Set([...s.encountered,...s.record.map(r=>r.id),...Object.keys(s.earned)]);
 if(includeStarter&&!known.size)for(const t of bank.filter(t=>t.rank===0&&t.place==='palace'))known.add(t.id);
 const topics=new Set();return bank.filter(t=>known.has(t.id)).filter(t=>{if(topics.has(t.topic))return false;topics.add(t.topic);return true;}).map(t=>t.id);
}
function goPlace(p){
 close();if(region.id!=='main'){setMessage('Minnesboken','Återvänd till staden först.');return;}
 if(locationKey()===p){window.UPPDRAG_MEETINGS?.start?.();return;}
 if(interior)leaveInterior();
 if(p==='quay')requestHarbour();else{const name=p==='archive'?'Arkivet':p==='cafe'?'Kaffehuset':areas.find(a=>a.p===p)?.place;const b=region.buildings.find(b=>b.name===name);if(b)requestInterior(b);}
}
function goArchive(){goPlace('archive');}
function enterArchive(){if(locationKey()!=='archive')return false;return recall.enterArchive();}
function chooseHere(p){
 const a=areas.find(a=>a.p===p);if(!a)return false;
 // Respect an explicit selection, otherwise choose the first unfinished level here.
 if(selected?.aid===a.id&&status(a,selected.l)!=='clear')return select(a.id,selected.l);
 const l=levels.find(l=>mastery.levelUnlocked(l)&&status(a,l)!=='clear');
 return l?select(a.id,l):false;
}
let hudKey='';
function tick(){const key=JSON.stringify([mastery.summary(),s.daler,s.apples]);if(view==='closed'&&hudKey!==key){hudKey=key;drawHud();}}
recall=window.UPPDRAG_RECALL_ENGINE.attach({chapter:1,state:()=>s,runs,facts,modal,storage,current,location:locationKey,present,previousKeys:{},persist,drawHud,paint:paintCloseup,
 openArchive(){display('','quiz');},finished,close,goRut:goArchive,
 mastery:{hasPassed,available,renderStatus,recorded,pending,encountered,hint:()=>mastery.buyHint(area().id,level()).ok,action(name){if(name==='retry')return retry();return false;}}
});
// Import only complete, evidenced area attempts, in prerequisite order. Never infer
// stamps from old chapter completion or from reading a model answer.
if(!s.masteryMigrated){
 for(let r=0;r<3;r++)for(const a of areas){
  if(!mastery.levelUnlocked(levels[r])||status(a,levels[r])!=='available')continue;
  const step=a.slot+r*3,ids=runs[step].f;
  const eligible=s.record.filter(x=>x.version==='recall-2-rubric'&&x.step===step&&x.ok&&x.assessment!=='pending-review'&&x.assessment!=='self-review'&&(r<2||x.independent));
  const trials=[...new Set(eligible.map(x=>x.trial))];
  if(trials.some(tr=>ids.every(id=>eligible.some(x=>x.id===id&&x.trial===tr)))){mastery.begin(a.id,levels[r]);mastery.pass(a.id,levels[r]);s.masteryRewards??={};s.masteryRewards[step]=true;}
 }
 s.masteryMigrationNotice=!!old;s.masteryMigrated=true;
}
s.complete=mastery.chapterComplete();persist();
window.UPPDRAG_CH1_PILOT={tick,go:book,close,scenes:runs,saveKey:storage,persist,refresh:drawHud,
 get state(){return s;},get recall(){return recall;},get memoryVisible(){return !!roomRestore;},
 wantsMajaMeeting:p=>p==='cafe'&&!story.introduced,
 majaProblem:()=> 'Något märkligt händer i staden. Amira på Slottet, Elin i Riksdagshuset och Jo på Kajen behöver hjälp med sina minnen. Vill du hjälpa dem? I minnesboken väljer du var du börjar.',
 acceptMajaMission(){story.introduced=true;people.met.Maja=true;saveWorld();book();},
 wantsMemoryMeeting:p=>areas.some(a=>a.p===p)&&levels.some(l=>mastery.levelUnlocked(l)&&status(areas.find(a=>a.p===p),l)!=='clear'),
 memoryProblem(){const a=areas.find(a=>a.p===locationKey());return a?(story.visits[a.id]?'Välkommen tillbaka! Vill du fortsätta undersöka '+documents[a.p]+' med mig?':intro[a.id]):'';},
 memoryChoice:()=> 'Se '+(documents[locationKey()]||'dokumentet'),
 enterMemory(){if(chooseHere(locationKey()))begin();},wantsMemoryThanks:()=>false,memoryThanks:()=>'',finishMemory:finished,
 wantsArchiveMeeting:p=>p==='archive',archiveHello:()=> 'Vi övar på sådant du redan mött. Det kostar inget. En avslutad repetitionsomgång ger ett äpple.',enterArchive,goArchive,
 openBook:book,selectArea:select,
 get encounteredTaskIds(){return s.encountered.slice();},
 get repetitionTaskIds(){const topics=new Set(available(false).map(id=>bank.find(t=>t.id===id)?.topic));return bank.filter(t=>t.rank===0&&topics.has(t.topic)).map(t=>t.id);}
};
function action(e){
 const button=e.target.closest('[data-mb]');if(!button)return;const name=button.dataset.mb;
 if(name==='close')close();else if(name==='book')book();else if(name==='select')select(button.dataset.area,button.dataset.level);
 else if(name==='travel')goPlace(area().p);else if(name==='begin')begin();else if(name==='rut')goArchive();else if(name==='maja')goPlace('cafe');
 else if(name==='retry')retry();else if(name==='review')review();else if(name==='approve')approve();else if(name==='revise')revise();
}
hud.addEventListener('click',action);modal.addEventListener('click',e=>{action(e);const act=e.target.closest('[data-action]')?.dataset.action;if(act==='close'||act==='archive-exit')close();else recall.action(act,e);});
modal.addEventListener('input',e=>recall.input(e));
modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}else if(e.key==='Tab'){
 const els=[...modal.querySelectorAll('button:not([disabled]),a[href],input,textarea')],first=els[0],last=els.at(-1);
 if(e.shiftKey&&(document.activeElement===first||document.activeElement===modal)){e.preventDefault();last?.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===modal)){e.preventDefault();first?.focus();}
 }else recall.key(e);});
drawHud();setMessage('Frihetstiden','Öppna minnesboken eller besök Maja på Kaffehuset.');
})();
