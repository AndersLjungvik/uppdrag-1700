/* The accepted chapter-five manuscript: an old notice, a later message,
 * a qualified correction and a physical delivery. Document work is supported
 * practice; it never changes answers, mastery, money or chapter access. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==5)return;
const key='uppdrag1700.ch5-royal-notice.v1';
const empty=()=>({v:1,accepted:false,oldCollected:false,compared:false,reformCollected:false,palace:false,church:false,print:false,revised:false,delivered:false,reflection:''});
let prior;try{prior=JSON.parse(localStorage.getItem(key)||'null');}catch{}
const state=empty();
if(prior?.v===1){for(const k of Object.keys(state))if(typeof state[k]==='boolean')state[k]=prior[k]===true;state.reflection=['hope','concern'].includes(prior.reflection)?prior.reflection:'';}
state.oldCollected=state.accepted&&state.oldCollected;
state.compared=state.oldCollected&&state.compared;
state.reformCollected=state.compared&&state.reformCollected;
for(const p of ['palace','church','print'])state[p]=state.reformCollected&&state[p];
state.revised=state.palace&&state.church&&state.print&&state.revised;
state.delivered=state.revised&&state.delivered;
if(!state.delivered)state.reflection='';
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const room=()=>typeof interior!=='undefined'&&interior&&!voyage?(interior.outdoor&&region.id==='main'?'quay':interior.kind):null;
const areas=[['power','riksdag','Elin'],['reforms','palace','Amira'],['press','print','Brita'],['rights','church','Olof']];
const levels=['learner','journeyman','master'];
let root=null,mode=null,restore=null,returnFocus=null,feedback='';
const ownedKeys=new Set();
function remaining(){
 const known=window.UPPDRAG_MASTERY?.snapshot?.().state?.areas||{};
 for(const level of levels)for(const [id,place,who]of areas)if(known[id]?.[level]?.status!=='clear')return {id,place,who,level};
 return null;
}
function status(){
 let stage,place,text;
 if(state.delivered){stage='delivered';place='cafe';text='Anslaget är uppsatt hos Maja. Läs det eller lyssna på gästernas olika reaktioner.';}
 else if(!state.accepted){stage='start';place='print';text='Besök Brita i Tryckeriet. Det gamla anslaget behöver rättas efter maktbytet.';}
 else if(!state.oldCollected){stage='old';place='cafe';text='Hämta det gamla anslaget hos Maja på Kaffehuset. Brita har bett att få jämföra det.';}
 else if(!state.compared){stage='compare';place='print';text='Ta det gamla anslaget till Brita i Tryckeriet och jämför det med beskedet från 1772.';}
 else if(!state.reformCollected){stage='message';place='quay';text='Senare under Gustav III:s regeringstid: hämta det nya beskedet om lagar och religion hos Jo på stadens Kaj.';}
 else if(!state.palace||!state.church||!state.print){stage='sources';place=!state.palace?'palace':!state.church?'church':'print';text='Granska beskedet hos '+({palace:'Amira på Slottet',church:'Olof i Kyrkan',print:'Brita i Tryckeriet'}[place])+'. De tre besöken kan göras i valfri ordning.';}
 else if(!state.revised){stage='revise';place='print';text='Återvänd till Tryckeriet. Rätta utkastets påstående att alla nu har samma frihet.';}
 else if(remaining()){const next=remaining();stage='recall';place=next.place;text='Anslaget är rättat. Fortsätt med minnesfrågorna hos '+next.who+'. Minnesboken visar vilka stämplar som återstår.';}
 else{stage='deliver';place='cafe';text='Det nya anslaget är färdigt. Lämna det till Maja på Kaffehuset.';}
 return {stage,place,text,ready:stage==='deliver',delivered:state.delivered,remaining:remaining()};
}
const idle=()=>!root&&!window.UPPDRAG_CH5_PILOT?.studyBusy&&!window.UPPDRAG_EVENT_ENGINE?.busy&&!window.UPPDRAG_CH5_BOOKWORK?.busy;
function accept(){if(room()!=='print'||!idle()||state.accepted)return false;state.accepted=true;save();return true;}
function collectOld(){if(room()!=='cafe'||!idle()||status().stage!=='old')return false;state.oldCollected=true;save();return true;}
function collectMessage(){if(room()!=='quay'||region.id!=='main'||!idle()||status().stage!=='message')return false;state.reformCollected=true;save();return true;}
function deliver(){if(room()!=='cafe'||!idle()||!status().ready)return false;state.delivered=true;save();tick();return true;}
const oldText='Under frihetstiden hade kungen begränsad makt. Riksdagen och riksrådet hade stort inflytande. Det innebar inte att alla människor fick bestämma lika mycket.';
const powerText='År 1772 använde Gustav III armén och lät fängsla riksrådets medlemmar. En ny grundlag gav kungen mer makt och minskade riksdagens och riksrådets inflytande.';
const notes={
 palace:{title:'Amiras besked om reformerna',text:'Upplysningens tänkare i Frankrike lyfte förnuft, vetenskap, frihet och rättigheter. Idéerna påverkade Gustav III. Tortyr förbjöds. Dödsstraffet begränsades men avskaffades inte helt.'},
 church:{title:'Olofs anteckningar om människors villkor',text:'Judar och katoliker fick flytta hit och behålla sin religion. För judar fanns villkor om bostadsort, yrken och äktenskap. Svenska protestanter fick inte lämna sin kyrka. Ogifta mödrar fick visst skydd i lagen, men kunde fortfarande möta fördomar och dålig behandling.'},
 print:{title:'Britas anteckning om tryckfriheten',text:'Tryckfriheten begränsades när kungen fick mer makt. Censuren återinfördes inte, men möjligheten att publicera kritik minskade. Nya möjligheter på ett område gav inte alla samma frihet.'}
};
const finalText='Gustav III fick mer makt genom statskuppen 1772. Senare reformer gav vissa nya möjligheter och skydd. Tortyr förbjöds och dödsstraffet begränsades. Judar och katoliker fick flytta hit och behålla sin religion, med kvarvarande villkor. Tryckfriheten begränsades. Alla fick alltså inte samma frihet.';
function journalHTML(){
 const s=status(),checks=[state.accepted,state.oldCollected,state.compared,state.reformCollected,state.palace&&state.church&&state.print,state.revised,!remaining(),state.delivered];
 const labels=['Beställningen hos Brita','Det gamla anslaget hos Maja','Maktbytet 1772 jämfört','Det senare beskedet hos Jo','Amiras, Olofs och Britas underlag','Det missvisande utkastet rättat','Minnesfrågorna på tre nivåer','Det nya anslaget lämnat till Maja'];
 const active=checks.indexOf(false);
 return '<p><b>Nästa steg:</b> '+esc(s.text)+'</p><ol class="rn-path" aria-label="Vägen till det nya anslaget">'+labels.map((t,i)=>'<li'+(i===active?' aria-current="step"':'')+'><span aria-hidden="true">'+(checks[i]?'✓':'○')+'</span> '+esc(t)+(checks[i]?' <small>klart</small>':'')+'</li>').join('')+'</ol>'+(state.oldCollected&&!state.compared?'<p>Du bär det gamla anslaget till Brita.</p>':state.reformCollected&&!state.delivered?'<p>I ärendet: det gamla anslaget och Jos nya besked. Dina insamlade anteckningar finns kvar.</p>':'');
}
function paint(){const canvas=root?.querySelector('canvas');if(canvas)window.UPPDRAG_ROOM_ART?.renderMemoryCloseup?.(canvas,room());}
function render(){
 if(!root)return;
 let title,body;
 if(mode==='compare'){
  title='Ett anslag som blivit inaktuellt';
  body='<div class="rn-documents"><section><h3>Före 1772 · det gamla anslaget</h3><p>'+oldText+'</p></section><section><h3>1772 · det nya beskedet</h3><p>'+powerText+'</p></section></div><p>Riksrådet har mist inflytande. Kungens makt har ökat. Det gamla bladet måste sparas med sin tid angiven.</p>'+(state.compared?'<p>Jämförelsen är sparad. Det gamla anslaget finns kvar.</p>':'<button data-rn="compare">Anteckna maktbytet och behåll det äldre bladet</button>');
 }else if(notes[mode]){
  title=notes[mode].title;body='<p>'+esc(notes[mode].text)+'</p>'+(state[mode]?'<p>Anteckningen är sparad till anslaget.</p>':'<button data-rn="note">Ta med anteckningen till anslaget</button>');
 }else if(mode==='revise'){
  title='Vad kan vi faktiskt skriva?';body='<blockquote>Utkast: ”Nu har alla samma frihet.”</blockquote><p>Jämför med underlagen. Vilken formulering håller?</p>'+Object.values(notes).map(n=>'<details><summary>'+esc(n.title)+'</summary><p>'+esc(n.text)+'</p></details>').join('');
  if(!state.revised)body+='<div class="rn-actions"><button data-rn="revise" data-version="equal">Alla har fått samma rättigheter.</button><button data-rn="revise" data-version="qualified">Vissa möjligheter har ökat, men begränsningar finns kvar.</button><button data-rn="revise" data-version="unchanged">Ingenting har förändrats.</button></div>';
  else body+='<h3>Det rättade anslaget</h3><p>'+finalText+'</p>';
 }else{title='Anslaget på Kaffehuset';body='<p class="rn-date">1772 och senare reformer under Gustav III</p><p>'+finalText+'</p><details><summary>Det tidigare anslaget · frihetstiden</summary><p>'+oldText+'</p></details>';}
 const previous=root.querySelector('.rn-sheet')?.scrollTop||0;
 root.innerHTML='<canvas aria-hidden="true"></canvas><button class="rn-close" data-rn="close">Till rummet</button><article class="rn-sheet"><p class="rn-caption">Spelhandlingar utifrån kapitlets innehåll</p><h2 id="royalNoticeTitle">'+title+'</h2>'+body+'<p role="status" class="rn-feedback">'+esc(feedback)+'</p><p><b>Nästa steg:</b> '+esc(status().text)+'</p><div class="rn-actions"><button data-rn="close">Lägg undan handlingarna</button></div></article>';
 paint();const sheet=root.querySelector('.rn-sheet');if(sheet)sheet.scrollTop=previous;
 (root.querySelector('[data-rn="compare"], [data-rn="note"], [data-rn="revise"]')||root.querySelector('[data-rn="close"]'))?.focus?.({preventScroll:true});
}
function compare(){if(!root||mode!=='compare'||room()!=='print'||!state.oldCollected||state.compared)return false;state.compared=true;save();render();return true;}
function annotate(){if(!root||mode!==room()||!notes[mode]||!state.reformCollected||state[mode])return false;state[mode]=true;save();render();return true;}
function revise(version){
 if(!root||mode!=='revise'||room()!=='print'||!state.palace||!state.church||!state.print||state.revised)return false;
 if(version!=='qualified'){feedback=version==='equal'?'Olofs och Britas anteckningar visar kvarvarande begränsningar. Läs dem och pröva igen.':'Amiras och Olofs anteckningar visar förändringar. Läs dem och pröva igen.';render();return false;}
 state.revised=true;feedback='Rättelsen är sparad. Det äldre anslaget finns kvar för jämförelse.';save();render();return true;
}
function open(request){
 const here=room();let allowed=false;
 if(request==='compare')allowed=here==='print'&&state.oldCollected;
 else if(notes[request])allowed=here===request&&state.reformCollected;
 else if(request==='revise')allowed=here==='print'&&state.palace&&state.church&&state.print;
 else if(request==='posted')allowed=here==='cafe'&&state.delivered;
 if(!allowed||!idle())return false;
 window.UPPDRAG_MEETINGS?.close?.(false);window.UPPDRAG_CH5_CITY_LIFE?.suspend?.();returnFocus=document.activeElement;
 restore={visibility:roomView.style.visibility,footer:roomFooter.hidden,bodyOpen:document.body.classList.contains('ch1-open')};
 roomView.style.visibility='hidden';roomFooter.hidden=true;document.body.classList.add('ch1-open');mode=request;feedback='';
 root=document.createElement('section');root.id='ch5RoyalNotice';root.tabIndex=-1;root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','royalNoticeTitle');stage.append(root);
 root.addEventListener('click',e=>{const b=e.target.closest('[data-rn]');if(!b||b.disabled)return;const action=b.dataset.rn;if(action==='close')close();if(action==='compare')compare();if(action==='note')annotate();if(action==='revise')revise(b.dataset.version);});
 render();return true;
}
function close(){
 if(!root)return false;root.remove();root=null;mode=null;roomView.style.visibility=restore.visibility;roomFooter.hidden=restore.footer;
 if(!restore.bodyOpen)document.body.classList.remove('ch1-open');restore=null;window.UPPDRAG_MEETINGS?.redraw?.();
 (returnFocus?.isConnected?returnFocus:document.getElementById('meetingPerson'))?.focus?.({preventScroll:true});returnFocus=null;tick();return true;
}
function handleKeydown(e){
 if(!root)return false;ownedKeys.add(e.key);e.stopImmediatePropagation();
 if(e.key==='Escape'){e.preventDefault();close();return true;}
 if(e.key==='Tab'){const els=[...root.querySelectorAll('button:not(:disabled),summary')],i=els.indexOf(document.activeElement);if(e.shiftKey&&i<=0||!e.shiftKey&&i===els.length-1){e.preventDefault();els[e.shiftKey?els.length-1:0]?.focus();}return true;}
 if(['Enter',' '].includes(e.key)){const b=e.target.closest?.('button');if(b){e.preventDefault();if(!e.repeat)b.click();}}return true;
}
function reminder(p,s){
 if(s.stage==='old')return p==='print'?'Hämta vårt gamla anslag hos Maja på Kaffehuset. Kom tillbaka med bladet, så jämför vi.':'Ta med det gamla anslaget till Brita i Tryckeriet.';
 if(s.stage==='compare')return 'Brita väntar på det gamla anslaget i Tryckeriet. Hon vill lägga det bredvid beskedet från 1772.';
 if(s.stage==='message')return 'Nu behöver vi ett senare besked om de nya lagarna. Jo har det på stadens Kaj. Ta med det tillbaka till arbetet med anslaget.';
 if(s.stage==='sources')return 'Ta beskedet till Amira på Slottet, Olof i Kyrkan och Brita i Tryckeriet. Jämför vad vi har att berätta.';
 if(s.stage==='revise')return 'Nu har du underlagen. Ta dem till Brita i Tryckeriet och rätta formuleringen om allas frihet.';
 if(s.stage==='recall')return 'Anslaget är rättat. Fortsätt med minnesfrågorna hos oss och Elin. I minnesboken ser du vad du har kvar.';
 if(s.stage==='deliver')return 'Nu kan du lämna det nya anslaget till Maja på Kaffehuset. Hon väntar på beskedet.';
 return 'Maja har satt upp anslaget på Kaffehuset. Där kan du läsa det och höra hur gästerna reagerar.';
}
function conversation(p,speak){
 if(room()!==p||!['cafe','print','palace','church','quay'].includes(p)||p==='quay'&&region.id!=='main')return null;
 if(!state.accepted&&p!=='print')return null;
 const s=status(),who={cafe:'Maja',print:'Brita',palace:'Amira',church:'Olof',quay:'Jo'}[p],choices=[],lines=[];
 const add=(id,label)=>choices.push([id,label]);
 if(!state.accepted){lines.push(['Brita','Det här beskedet säger att makten har förändrats. Vårt gamla anslag gäller inte längre. Hjälp mig rätta det.'],['Du','Var finns det gamla bladet?'],['Brita','Hos Maja på Kaffehuset. Hämta det på min begäran, så lägger vi bladen bredvid varandra.']);add('royalAccept','Jag hämtar det gamla anslaget.');}
 else if(p==='cafe'&&s.stage==='old'){lines.push(['Maja','Brita behöver vårt gamla anslag? Här är det. Det berättar hur landet styrdes under frihetstiden.'],['Du','Jag tar det till Tryckeriet.'],['Maja','Behåll bladets tid angiven. Det var inte fel då, men nu har makten förändrats.']);add('royalOld','Ta med det gamla anslaget till Brita.');}
 else if(p==='print'&&s.stage==='compare'){lines.push(['Brita','Bra, nu kan vi jämföra det gamla anslaget med beskedet från 1772.'],['Du','Vi behöver förklara vad som faktiskt har ändrats.'],['Brita','Lägg bladen bredvid varandra. Elin i Riksdagshuset kan hjälpa dig med maktfrågorna.']);add('royalCompare','Jämför de två bladen.');}
 else if(p==='quay'&&s.stage==='message'){lines.push(['Jo','Det har kommit ett senare besked om nya lagar och religion. Det här är ett annat nedslag under Gustav III:s regeringstid.'],['Du','Brita behöver underlaget till ett nytt anslag.'],['Jo','Ta det med dig. Amira kan förklara reformerna och Olof vill visa vilka villkor som finns kvar.']);add('royalMessage','Ta emot beskedet och återvänd till arbetet med anslaget.');}
 else if(p==='print'&&s.stage==='revise'){lines.push(['Brita','Alla tre underlagen är här. Men i utkastet står att alla nu har samma frihet.'],['Du','Det stämmer inte med vad vi har fått veta.'],['Brita','Då behöver vi en formulering som rymmer både förändringarna och begränsningarna.']);add('royalRevise','Rätta utkastet med hjälp av underlagen.');}
 else if(p==='cafe'&&s.ready){lines.push(['Maja','Är det nya anslaget klart att sättas upp?'],['Du','Ja. Det visar både vad som ändrades och vilka begränsningar som fanns kvar.'],['Maja','Lämna det här när du är redo. Det äldre bladet sparar vi med sin tid angiven.']);add('royalDeliver','Här är det nya anslaget.');}
 else if(p==='cafe'&&s.delivered){lines.push(['Maja','Anslaget sitter uppe nu. Några gäster uppskattar reformerna. Andra oroar sig för kungens ökade makt.']);add('royalPosted','Läs det uppsatta anslaget.');add('royalDiscuss','Hur menar du?');}
 else if(notes[p]&&state.reformCollected){lines.push([who,p==='palace'?'Jag ser förbättringar i de nya lagarna. Men du behöver skilja det som avskaffats från det som bara begränsats.':p==='church'?'Nya regler kan ge skydd utan att fördomar och gamla villkor försvinner. Det måste synas i anslaget.':'Mitt arbete påverkas också. Att vissa reformer ger mer frihet betyder inte att jag får trycka all kritik.']);add('royalNote','Läs och ta med anteckningen till anslaget.');}
 else lines.push([who,reminder(p,s)]);
 if(state.accepted&&!state.delivered&&lines.length===1&&lines[0][1]!==reminder(p,s))lines.push([who,reminder(p,s)]);
 const aid={print:'press',palace:'reforms',church:'rights'}[p];
 if(aid&&levels.some(l=>window.UPPDRAG_MASTERY.snapshot().state.areas[aid][l]?.status!=='clear'))add('study','Jag prövar vad jag minns.');
 if(p==='palace')add('writing','Jag vill förklara och jämföra.');
 if(p==='quay')add('sail','Jag vill resa till Marstrand.');
 if(p==='cafe'){
  const protocol=window.UPPDRAG_CH5_PROTOCOL?.status();if(protocol?.ready)add('deliverProtocol','Jag lämnar också Elins färdiga protokoll.');
  if(protocol?.delivered)add('protocol','Läs Elins protokoll.');
 }
 add('later',s.ready?'Jag behåller anslaget en stund till.':'Vi ses senare.');
 const again=()=>{const next=conversation(p,speak);if(next)speak(next.lines,next.choices,next.action);};
 return {lines,choices,action(a){
  if(room()!==p)return;
  if(a==='royalAccept'&&accept())again();if(a==='royalOld'&&collectOld())again();if(a==='royalMessage'&&collectMessage())again();
  if(a==='royalCompare')open('compare');if(a==='royalNote')open(p);if(a==='royalRevise')open('revise');if(a==='royalPosted')open('posted');
  if(a==='royalDeliver'&&deliver())again();
  if(a==='study')window.UPPDRAG_CH5_PILOT.enterMemory(aid);if(a==='writing')window.UPPDRAG_CH5_BOOKWORK.open();if(a==='sail')departHarbour('marstrand');
  if(a==='deliverProtocol'&&window.UPPDRAG_CH5_PROTOCOL?.deliver())again();if(a==='protocol')window.UPPDRAG_CH5_PROTOCOL?.open();
  if(a==='royalDiscuss')speak([['Maja','En gäst hoppas att de nya lagarna ska göra livet lättare. En annan undrar vad som händer när kungen samlar mer makt.'],['Du','De kan uppskatta en förändring och samtidigt vara oroliga för en annan.']],[['hope','Jag vill höra mer om förhoppningarna.'],['concern','Jag vill höra mer om oron.'],['later','Jag lyssnar vidare en annan gång.']],choice=>{if(room()!=='cafe'||!['hope','concern'].includes(choice))return;state.reflection=choice;save();speak([['Maja',choice==='hope'?'Jag förstår. För någon som hoppas på skydd i lagen kan en reform betyda mycket, även om svårigheter finns kvar.':'Jag förstår. För den som vill publicera kritik kan mindre tryckfrihet väga tungt, även om andra lagar förbättras.']]);});
 }};
}
const posted=document.createElement('button');posted.id='ch5RoyalPosted';posted.type='button';posted.hidden=true;posted.textContent='Det nya anslaget · Läs';posted.addEventListener('click',()=>open('posted'));roomView.append(posted);
function tick(){posted.hidden=!(state.delivered&&room()==='cafe'&&!window.UPPDRAG_EVENT_ENGINE?.busy&&!window.UPPDRAG_CH5_PILOT?.studyBusy);}
window.addEventListener('keydown',handleKeydown,true);
window.addEventListener('keyup',e=>{if(root||ownedKeys.has(e.key)){ownedKeys.delete(e.key);e.stopImmediatePropagation();if(['Enter',' ','Escape'].includes(e.key))e.preventDefault();}},true);
window.addEventListener('blur',()=>ownedKeys.clear());window.addEventListener('resize',paint);window.addEventListener('uppdrag-paper-fibres-ready',paint);
const style=document.createElement('style');style.textContent=`
#ch5RoyalNotice{position:absolute;inset:0;z-index:48;background:#b7a78c;overflow:hidden;color:#352b20;font:17px/1.5 Georgia}
#ch5RoyalNotice canvas{position:absolute;inset:0;width:100%;height:100%}
#ch5RoyalNotice .rn-sheet{position:absolute;left:64%;top:53%;transform:translate(-50%,-50%);width:min(620px,calc(100% - 28px));max-height:calc(100% - 100px);overflow:auto;overscroll-behavior:contain;touch-action:pan-y;padding:24px;background:#fffcf6;border:1px solid #b3a080;box-shadow:8px 11px 1px #322c2340;box-sizing:border-box}
#ch5RoyalNotice h2{font:600 25px/1.25 Georgia;margin:10px 0 16px}#ch5RoyalNotice h3{font:600 19px/1.3 Georgia;margin:4px 0 10px}#ch5RoyalNotice p{margin:10px 0}#ch5RoyalNotice .rn-caption,#ch5RoyalNotice .rn-date{font:14px/1.4 system-ui;color:#635744}
#ch5RoyalNotice button,#ch5RoyalPosted{min-height:44px;padding:10px 12px;border:1px solid #9b835c;border-radius:4px;background:#f4ead7;color:#352b20;font:16px/1.3 Georgia;cursor:pointer}
#ch5RoyalNotice .rn-close{position:absolute;top:10px;left:12px;z-index:2}#ch5RoyalNotice .rn-documents{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0}#ch5RoyalNotice .rn-documents section{padding:15px;background:#f7f1e3;border:1px solid #c8b99f}#ch5RoyalNotice .rn-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}#ch5RoyalNotice blockquote{margin:16px 0;padding:14px;border-left:3px solid #94774e;background:#f4ead7}#ch5RoyalNotice summary{cursor:pointer;padding:10px 0}#ch5RoyalNotice .rn-feedback{font-weight:600}
#ch5RoyalNotice :focus-visible,#ch5RoyalPosted:focus-visible{outline:3px solid #286472;outline-offset:2px}#ch5RoyalPosted{align-self:flex-start;margin:8px 12px;font-size:16px}
#ch1Modal .rn-path{list-style:none;padding-left:0;font:16px/1.5 system-ui}#ch1Modal .rn-path li{padding:6px 10px;border-left:3px solid #d5c7ad}#ch1Modal .rn-path [aria-current]{border-color:#436b5c;background:#e8efdf;font-weight:600}#ch1Modal .rn-path small{font-size:14px}
@media(max-width:800px){#ch5RoyalNotice .rn-sheet{left:50%;padding:18px}}@media(max-width:520px){#ch5RoyalNotice .rn-documents{grid-template-columns:1fr}}@media(max-height:500px){#ch5RoyalNotice .rn-sheet{top:56%;max-height:calc(100% - 80px)}}
`;document.head.append(style);
window.UPPDRAG_CH5_ROYAL_NOTICE={status,accept,collectOld,collectMessage,open,close,compare,annotate,revise,deliver,conversation,journalHTML,tick,handleKeydown,saveKey:key,get busy(){return !!root;},get state(){return {...state};}};
})();
