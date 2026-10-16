import {createEngine,validBank,SAVE_KEY,BANK_KEY} from './engine.mjs?v=0.6.16-flow';
import {PLACES,LEVEL_NAMES,LEVEL_TASKS,TIMELINES} from './content.mjs?v=0.6.16-flow';
import {choicesFor,shuffle} from './learning.mjs?v=0.6.16-flow';
import {createRenderer} from './render.mjs?v=0.6.16-flow';
import {createNarrator} from './narration.mjs?v=0.6.16-flow';
import {route,walkable} from '../demo/core.mjs?v=0.6.16-flow';

const $=id=>document.getElementById(id),canvas=$('world');
const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
const base=window.CLASSROOM_CURRICULUM||window.CURRICULUM,imported=read(BANK_KEY);
let bank=imported?.bankId===base.bankId&&validBank(imported,base)?imported:base,account=null,saveIssue=false;
// A saved copy of the official bank may predate the reviewed choices. Keep the
// learner's answers and progress, but refresh the official options by card ID.
if(bank!==base&&bank.sourcePolicy===base.sourcePolicy){const official=new Map(base.missions.flatMap(m=>m.cards.map(q=>[q.id,q])));for(const m of bank.missions)for(const q of m.cards){const source=official.get(q.id);if(!source||q.answer!==source.answer||q.question!==source.question)continue;if(q.type==='short'){if(source.distractors)q.distractors=[...source.distractors];else delete q.distractors;}else if(q.type==='chain'&&q.steps?.length===source.steps?.length&&q.steps.every((st,i)=>st.answer===source.steps[i].answer))q.steps=source.steps.map(st=>({...st,options:[...st.options]}));}}
const saveKey=()=>account?`${SAVE_KEY}.account.${account}`:SAVE_KEY;
function persist(value){try{localStorage.setItem(saveKey(),JSON.stringify(value));if(account)window.dispatchEvent(new CustomEvent('uppdrag-save'))}catch{if(!saveIssue){saveIssue=true;notify('Webbläsaren kunde inte spara. Hämta en sparfil i inställningarna.')}}}
const original=read(SAVE_KEY);
try{if(original&&!original.paperWorld&&!localStorage.getItem(SAVE_KEY+'.before-paper-world'))localStorage.setItem(SAVE_KEY+'.before-paper-world',JSON.stringify(original))}catch{}
let engine=createEngine({bank,practice:window.UPPDRAG_PRACTICE,initial:original,onSave:persist});
if(!original){const demo=read('uppdrag1700.paper-demo.v1');if(walkable(demo?.player?.x,demo?.player?.y))engine.world().player={...demo.player}}
let rutEscort=false;const rutAt=t=>rutEscort?{x:Math.max(470,570-100*Math.min(1,rutEscort.progress)),y:445+110*Math.min(1,rutEscort.progress)}:{x:570+55*Math.sin(t/6500),y:445+22*Math.sin(t/8500)};
let view='town',speaker='',speechAt=0,speechEnd=0,readableText='',readableActor=null;
let queue=[],arrival=null,heading=0,moving=false,lastFrame=0,walkStart=0,dogUntil=0,selected=null,flight=null,noticeTimer,ambientLast=0,ambientAudio=null;
const keys=new Set(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderer=createRenderer(canvas,{reduced,onReady:()=>draw(performance.now())});
const narrator=createNarrator({synth:window.speechSynthesis,Utterance:window.SpeechSynthesisUtterance,onState:({speaking})=>{speechAt=performance.now();speechEnd=speaking?Infinity:0},onIssue:code=>{narrator.setEnabled(false);speechControls();rememberSpeech();notify(code==='no-swedish-voice'?'Ingen svensk röst finns på datorn. Texten finns kvar.':'Uppläsningen kunde inte starta. Texten finns kvar.')}});
try{narrator.setEnabled(localStorage.getItem('uppdrag1700.paper-demo.v1.speech')==='on')}catch{}
function rememberSpeech(){try{localStorage.setItem('uppdrag1700.paper-demo.v1.speech',narrator.enabled?'on':'off')}catch{}}
function speechControls(){$('talk').textContent=narrator.available?(narrator.enabled?'Tal på':'Tal av'):'Tal saknas';$('talk').disabled=!narrator.available;$('talk').setAttribute('aria-pressed',String(narrator.enabled));$('readAgain').hidden=!narrator.enabled||!readableText}
function readCurrent(){if(narrator.enabled&&readableText&&!document.hidden&&!modalOpen())narrator.read(readableText,readableActor)}
function readable(text='',actor=null){readableText=text;readableActor=actor;speechControls();if(narrator.enabled){if(text)readCurrent();else narrator.stop()}}
function hush(){narrator.stop();readable();speaker='';speechEnd=0;$('bubble').hidden=true}
function say(name,text){speaker=name;speechAt=performance.now();speechEnd=narrator.enabled?0:speechAt+Math.min(5500,Math.max(1800,text.length*40));$('speaker').textContent=name;$('line').textContent=text;$('bubble').hidden=false;$('bubble').dataset.narrator=String(name==='Berättaren');layout();readable(name==='Hunden'?'':text,name==='Hunden'?null:name)}
function notify(text){clearTimeout(noticeTimer);$('notice').textContent=text;$('notice').hidden=false;noticeTimer=setTimeout(()=>$('notice').hidden=true,5000)}
function actions(entries=[]){$('actions').replaceChildren();for(const [text,fn,secondary=false]of entries){const b=document.createElement('button');b.type='button';b.textContent=text;if(secondary)b.className='secondary';b.onclick=fn;$('actions').append(b)}}
function cue(id){window.UPPDRAG_SOUND?.play(id)}
function modalOpen(){return !!document.querySelector('dialog[open]')}
function stopWalking(){keys.clear();queue=[];arrival=null;moving=false;$('skipWalk').hidden=true}
const points={print:{x:365,y:365},cafe:{x:700,y:245},archive:{x:470,y:555},quay:{x:1040,y:420},gate:{x:970,y:610}};
const labelPoints={print:[185,370],cafe:[695,230],archive:[290,627],quay:[1045,475],gate:[970,610]};
const extras=()=>engine.availablePlaces().filter(p=>!['town','cafe','print','quay','archive'].includes(p));
function locate(el,x,y){const p=renderer.project(x,y);el.style.left=p.x+'px';el.style.top=p.y+'px'}
function layout(){
 const {w,h,scale}=renderer.projection;
 for(const el of document.querySelectorAll('[data-place]'))locate(el,...labelPoints[el.dataset.place]);
 locate($('meetDog'),455,390);locate($('meetWoman'),860,465);
 const dock=w<720||h<430;document.body.classList.toggle('speech-docked',dock);
 const bubble=$('bubble'),host=dock?$('speechDock'):$('stage');if(bubble.parentElement!==host)host.append(bubble);
 if(!dock){const anchor=view==='town'?speaker==='Hunden'?[455,370]:speaker==='Kvinnan på torget'?[860,430]:[650,190]:view==='print'?[1130,350]:[790,350];const p=renderer.project(...anchor),width=Math.min(360,w*.36);bubble.style.width=width+'px';bubble.style.left=Math.max(width/2+12,Math.min(w-width/2-12,p.x))+'px';bubble.style.top=Math.max(12,p.y-bubble.offsetHeight-22)+'px';bubble.style.maxHeight=Math.max(100,p.y-30)+'px'}else{for(const k of ['width','left','top','maxHeight'])bubble.style[k]=''}
 const items=renderer.project(140,550);$('pressItems').style.left=items.x+'px';$('pressItems').style.top=items.y+'px';
 const press=renderer.project(835,420);Object.assign($('pressTarget').style,{left:press.x+'px',top:press.y+'px',width:260*scale+'px',height:310*scale+'px'});
}
function resize(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;renderer.resize(r.width,r.height,devicePixelRatio||1);layout();updateDiscovery();draw(performance.now())}
new ResizeObserver(resize).observe($('stage'));
function draw(t){renderer.draw(t,{world:engine.world(),place:view,speaker,speechAt,speechEnd,blocked:modalOpen(),direction:heading,walking:moving,dogUntil,flight,rut:rutAt(t)});if(flight&&t-flight.at>500)flight=null}
function updateChrome(){
 const c=engine.current(),a=engine.active(),done=engine.progress().done,currentLevel=a?.level||Math.min(3,done+1);
 document.body.dataset.view=view;$('location').textContent=view==='work'?'ARBETSBORDET':PLACES[view]?.name.toUpperCase()||'STADEN';
 $('chapterBadge').textContent=a?.repeat?`Repetition · ${LEVEL_NAMES[a.level-1]} · ${done}/3 klara`:done===3?`Mästare klar ✓ · 3/3 nivåer`:a?`${LEVEL_NAMES[a.level-1]} · ${done}/3 klara`:`${LEVEL_NAMES[currentLevel-1]} · ${done}/3 klara`;$('bookBtn').textContent=`Uppdragsboken · ${c.id}/10`;
 $('instruction').textContent=engine.objective();$('back').hidden=view==='town';$('back').textContent=view==='work'?'← Pausa och gå tillbaka':'← Till staden';
 $('mapLinks').hidden=view!=='town';$('gateBtn').hidden=false;$('bagBtn').hidden=view==='work';$('work').hidden=view!=='work';$('puzzle').hidden=true;$('pressItems').hidden=true;$('pressTarget').hidden=true;
 $('timeline').hidden=view!=='town';const time=TIMELINES[c.id];$('timelineLabel').textContent=time.label;$('timeRange').style.left=((time.start-1719)/90*100)+'%';$('timeRange').style.width=Math.max(.8,(time.end-time.start)/90*100)+'%';
 speechControls();layout();updateDiscovery();
}
function enter(place,{quiet=false}={}){if(place!=='town')rutEscort=false;if(!engine.arrive(place).ok){notify('Den platsen öppnas i ett senare avsnitt.');return}stopWalking();hush();view=place;selected=null;updateChrome();actions();if(place==='town'){if(!quiet){if(engine.current().id===1&&!engine.active()&&engine.progress().done===0){say('Kvinnan på torget','Det talas om nya maktförhållanden i Sverige. Maja på kaffehuset behöver hjälp att få ett anslag tryckt. Gå dit och fråga vad som ska stå på bladet.');actions([['Visa vägen till kaffehuset',()=>{hush();actions();walkTo(points.cafe,()=>enter('cafe'))}],['Jag utforskar själv',()=>{hush();actions()},true]])}else $('instruction').textContent=engine.objective()}}else{placeMenu();const greet=playerArrival(place),key=engine.current().id+':'+(engine.active()?.level||0)+':'+(engine.active()?.phase||'')+':'+place;if(greet&&key!==greetedAt){greetedAt=key;say('Du',greet);actions([['Fortsätt samtalet',()=>placeMenu()]])}}resize();updateDiscovery()}
function walkTo(point,onArrival){if(view!=='town'||modalOpen())return;hush();queue=route(engine.world().player,point);arrival=onArrival||null;walkStart=performance.now();if(!queue.length){if(Math.hypot(engine.world().player.x-point.x,engine.world().player.y-point.y)<35){const fn=arrival;arrival=null;fn?.()}else notify('Välj den öppna marken eller en plats med namn.')}canvas.focus({preventScroll:true})}
for(const b of document.querySelectorAll('[data-place]'))b.onclick=()=>walkTo(points[b.dataset.place],()=>b.dataset.place==='gate'?gateway():enter(b.dataset.place));
canvas.addEventListener('pointerdown',e=>{if(view!=='town'||modalOpen())return;const rect=canvas.getBoundingClientRect(),tap=renderer.unproject(e.clientX-rect.left,e.clientY-rect.top);if(Math.hypot(tap.x-rutAt(performance.now()).x,tap.y-rutAt(performance.now()).y)<58){meetRut();return}const r=canvas.getBoundingClientRect();walkTo(renderer.unproject(e.clientX-r.left,e.clientY-r.top));actions()});
$('skipWalk').onclick=()=>{if(queue.length){engine.world().player={...queue.at(-1)};const fn=arrival;stopWalking();engine.save();fn?.()}};
function gateway(){const c=engine.current(),done=engine.progress().done,open=engine.world().unlocked>c.id;if(c.id===10){say('Stadsvakten','Du har nått bokens sista avsnitt. Du kan återvända till tidigare uppdrag och samla mästarstämplar.');actions([['Tillbaka till staden',()=>enter('town')]]);return}say('Stadsvakten',done<1?'Du behöver först klara lärlingsuppdraget i detta avsnitt. Gesäll och mästare är frivilliga.':open?'Du har redan klarat stadsportens kunskapsprov. Vägen vidare är öppen.':'Visa vad du minns från lärlingsuppdraget. Fem blandade frågor väntar. Du behöver minst 70 procent rätt på första försöket utan stöd. Gesäll och mästare är frivilliga.');actions([...(done>=1&&!open?[['Gör stadsportens kunskapsprov',()=>{const r=engine.beginGateExam();if(r.ok)openQuiz();else notify('Avsluta först det pågående repetitionspasset.') }]]:[]),...(open?[['Gå till nästa avsnitt',()=>changeChapter(c.id+1)]]:[]),...extras().map(p=>[PLACES[p].name,()=>enter(p)]),['Tillbaka till staden',()=>enter('town'),true]])}
function npcName(place){return place==='print'&&engine.current().id>=5?'Tryckeriets ansvariga':PLACES[place]?.npc||'Berättaren'}
function primaryChoice(label,fn){return[label,()=>{fn();updateChrome();placeMenu()}]}
function travelTo(place){if(view==='work')engine.pauseWork();if(view==='town'){walkTo(points[place]||points.cafe,()=>enter(place));return}enter('town',{quiet:true});if(points[place])walkTo(points[place],()=>enter(place));else enter(place)}
function playerArrival(place){const a=engine.active(),l=engine.level();if(!a||engine.target()!==place)return null;if(a.phase==='pickup')return `Hej! Jag kommer från ${PLACES[l.giver].name.toLowerCase()} och ska hämta ${l.artifact.toLowerCase()}. Kan du hjälpa mig?`;if(a.phase==='work'&&place===l.work)return `Hej! Jag ska arbeta med ${l.title.toLowerCase()}. Kan vi börja?`;if(a.phase==='deliver')return `Hej! Jag har med mig ${l.artifact.toLowerCase()}. Här är det du väntade på.`;return null}
let greetedAt='';
// Optional historical discoveries: use the classroom bank's existing, unscored reflections.
const discoveryButton=document.createElement('button');
discoveryButton.id='discoverNotice';discoveryButton.type='button';
discoveryButton.textContent='Läs anslaget';discoveryButton.setAttribute('aria-label','Läs anslaget på väggen');
$('stage').append(discoveryButton);
const discoveryDialog=document.createElement('dialog');discoveryDialog.id='discoveryDialog';
discoveryDialog.setAttribute('aria-label','Historisk upptäckt');document.body.append(discoveryDialog);
function discoveries(){return (bank.reflections||[]).filter(x=>x.storyChapter===engine.current().id)}
function discoveryPlace(){return engine.current().id===10?'archive':engine.current().id===4?'print':engine.current().id===7?'quay':'cafe'}
function showDiscovery(index=0){
 const entries=discoveries();if(!entries.length)return;
 const entry=entries[Math.max(0,Math.min(index,entries.length-1))];discoveryDialog.replaceChildren();
 const head=document.createElement('div');head.className='discovery-head';
 const tag=document.createElement('small');tag.textContent='UPPDRAG 1700 · '+PLACES[view].name;
 const close=document.createElement('button');close.type='button';close.textContent='Stäng ×';close.onclick=()=>discoveryDialog.close();head.append(tag,close);
 const title=document.createElement('h2');title.textContent=engine.current().id===1?'Vem var egentligen fri?':'Tankar från 1700-talet';
 const intro=document.createElement('p');intro.textContent=engine.current().id===1?'Under frihetstiden minskade kungens makt och riksdagen fick större inflytande. Men alla människor fick inte samma möjligheter.':'Människor kan se samma historiska händelse på olika sätt.';
 const question=document.createElement('blockquote');question.textContent=entry.question;
 const note=document.createElement('p');note.className='discovery-note';note.textContent='Fundera själv eller prata med någon. Inget svar behöver lämnas in.';
 discoveryDialog.append(head,title,intro,question,note);
 if(entries.length>1){const more=document.createElement('button');more.type='button';more.textContent='Läs nästa tanke →';more.onclick=()=>showDiscovery((index+1)%entries.length);discoveryDialog.append(more)}
 if(!discoveryDialog.open)openDialog('discoveryDialog');
}
discoveryButton.onclick=()=>showDiscovery();
function updateDiscovery(){
 const enabled=view===discoveryPlace()&&discoveries().length>0;
 discoveryButton.hidden=!enabled;
 if(enabled){discoveryButton.textContent=view==='cafe'?'Läs anslaget':view==='archive'?'Läs handlingen':view==='print'?'Läs trycket':'Läs nyheten';const p=renderer.project(190,220);discoveryButton.style.left=p.x+'px';discoveryButton.style.top=p.y+'px'}
}
function placeMenu(override=null){
 $('puzzle').hidden=true;$('work').hidden=true;$('pressItems').hidden=true;$('pressTarget').hidden=true;
 const a=engine.active(),l=engine.level(),c=engine.current(),done=engine.progress().done,place=view,name=npcName(place),choices=[];let line=override;
 if(a?.repeat){choices.push(['Avsluta repetitionen',()=>{engine.cancelRepeat();placeMenu('Repetitionen är avslutad. Dina tidigare stämplar finns kvar.')} ,true]);}
  if(a&&engine.target()===place){
  if(a.phase==='pickup'){const p=l.pickups[a.pickup];line||=p.text;choices.push(primaryChoice(p.label,()=>{engine.pickup(place);cue('paper')}));}
  else if(a.phase==='work'){line||=a.repeat?`Du repeterar ”${l.title.toLowerCase()}”. Pröva vad du minns. Du har redan klarat den här nivån.`:`Här arbetar vi med ”${l.title.toLowerCase()}”. ${l.recipient===place?'Du är redan på rätt plats för att lämna resultatet när det är färdigt.':`När underlaget är klart ska det till ${PLACES[l.recipient].name.toLowerCase()}.`}`;choices.push([a.quiz?'Fortsätt repetitionen':a.repeat?'Börja repetitionen':`Börja ${LEVEL_NAMES[a.level-1].toLowerCase()}suppdraget`,()=>{if(engine.beginWork(place).ok)openQuiz()}]);}
  else if(a.phase==='materials'){line||='Manuset är kontrollerat. Lägg svärta, papper och typer direkt i pressen. Provtrycket ska sedan till Maja.';choices.push(['Till pressen',openPress]);}
  else if(a.phase==='puzzle'){line||='Nu behöver kartorna jämföras innan leveransen kan fortsätta.';choices.push(['Jämför kartorna',openPuzzle]);}
  else if(a.phase==='handoff'){const p=l.handoffs[a.handoff];line||=p.text;choices.push(primaryChoice(p.label,()=>{engine.handoff(place);cue('paper')}));}
  else if(a.phase==='deliver'){line||=`Du har med dig ${l.artifact.toLowerCase()}. Vi tittar på resultatet tillsammans.`;choices.push([`Lämna ${l.artifact.toLowerCase()}`,()=>{const result=engine.deliver(place);if(result.ok){cue('paper');notify(`${LEVEL_NAMES[l.level-1]} klar · stämpel i uppdragsboken · ${result.pay} daler`);updateChrome();placeMenu(result.text)}}]);}
 }else if(a){const next=engine.target();line||=`Du har ett pågående ${a.repeat?'repetitionspass':'uppdrag'}. Nästa steg är hos ${PLACES[next].npc||PLACES[next].name} på ${PLACES[next].name.toLowerCase()}.`;choices.unshift([`Gå till ${PLACES[next].name}`,()=>travelTo(next)]);}
 else if(done<3&&l.giver===place){line||=l.request;choices.push(primaryChoice(`Ta uppdraget · ${LEVEL_NAMES[l.level-1]}`,()=>{const result=engine.accept(place);if(result.ok)greetedAt='';}));}
 else if(done===3){line||='Du har redan klarat mästarnivån i det här avsnittet. Gå till stadsporten för att fortsätta, eller repetera frivilligt.';choices.unshift(['Gå till stadsporten',()=>{enter('town',{quiet:true});walkTo(points.gate,gateway)}]);}
 else{line||=place==='print'?'Välkommen till tryckeriet. Börja med beställningen på kaffehuset. Materialet använder vi här när ett tryck ska göras.':`Ditt nästa uppdrag börjar på ${PLACES[l.giver].name.toLowerCase()}. Du får en beställning innan något ska hämtas.`;}
 if(!a&&c.id===1&&done===0&&place==='print'){line='Här på tryckeriet gör vi anslag som människor kan läsa och diskutera. Maja på kaffehuset har beställningen. Fråga henne först, så hjälper jag dig sedan med manuset.';choices.unshift(['Gå till Maja på kaffehuset',()=>{enter('town',{quiet:true});walkTo(points.cafe,()=>enter('cafe'))}]);}
  if(!a&&c.id===1&&done===0&&place==='cafe'){line='Vi behöver ett anslag om vem som styr Sverige under frihetstiden. Ta beställningen här, och gå sedan till Brita i tryckeriet. Hon hjälper dig att granska uppgifterna.';}
  if(!a){const repeat=c.levels.filter(x=>x.level<=done&&x.giver===place);if(repeat.length)choices.push(['Repetera en avklarad nivå',()=>{say(name,'Vilken nivå vill du arbeta med igen? Du får ett nytt arvode.');actions(repeat.map(x=>[`${LEVEL_NAMES[x.level-1]} · steg ${x.level}/3`,()=>{engine.accept(place,{repeatLevel:x.level});placeMenu('Vi använder kunskaperna igen i ett nytt arbetspass.')}]))},true]);
  if(c.id<10&&engine.world().unlocked>c.id)choices.unshift(['Fortsätt till nästa avsnitt',()=>changeChapter(c.id+1)]);}
 if(place==='archive')choices.push(['Repetera hos läromästaren Rut',mentorMenu,choices.length>0]);
  if(place===discoveryPlace()&&discoveries().length)choices.push(['Läs och fundera · frivilligt',()=>showDiscovery(),true]);
 if(place==='cafe'||place==='quay')choices.push(['Prata en stund',()=>social(place),true]);
 say(name,line);actions(choices);$('instruction').textContent=engine.objective();layout();
}
function openPress(){hush();actions();$('pressItems').hidden=false;$('pressTarget').hidden=false;selected=null;for(const b of document.querySelectorAll('[data-material]')){b.hidden=engine.world().placed.includes(b.dataset.material);b.setAttribute('aria-pressed','false')}$('pressLabel').textContent=engine.world().placed.length===3?'Pressen är redo':`${engine.world().placed.length} av 3 på plats`;$('instruction').textContent='Välj ett material på bordet. Klicka sedan på pressen.';if(engine.world().placed.length===3)actions([['Gör ett provtryck',makeProof]]);layout()}
for(const b of document.querySelectorAll('[data-material]'))b.onclick=()=>{selected=selected===b.dataset.material?null:b.dataset.material;for(const c of document.querySelectorAll('[data-material]'))c.setAttribute('aria-pressed',String(c.dataset.material===selected));$('instruction').textContent=selected?`${b.textContent} är valt. Klicka på pressen.`:'Välj ett material på bordet.';cue(b.dataset.material==='type'?'type':b.dataset.material==='ink'?'ink':'paper')};
$('pressTarget').onclick=()=>{if(selected&&engine.placeMaterial(selected)){flight={id:selected,x:185+['ink','paper','type'].indexOf(selected)*130,at:performance.now()};cue('wood');openPress()}else if(engine.world().placed.length===3)makeProof();else notify('Välj först ett material på bordet.')};
function makeProof(){if(engine.print()){cue('press');updateChrome();placeMenu('Provtrycket ligger i ryggsäcken. Maja väntar på kaffehuset.')}else notify('Svärta, papper och typer behöver vara på plats först.')}
function openQuiz(){stopWalking();hush();view='work';updateChrome();actions(engine.currentQuiz()?.kind==='review'?[['Avbryt repetitionspasset',()=>{engine.cancelReview();enter(engine.world().scene)},true]]:[]);renderQuestion();resize()}
function renderQuestion(){
 const session=engine.currentQuiz(),q=engine.question();if(!session||!q){enter(engine.world().scene);return}
 $('workTitle').textContent=session.kind==='story'?`${LEVEL_NAMES[engine.active().level-1]} · steg ${engine.active().level} av 3 · ${LEVEL_TASKS[engine.active().level-1]}`:session.kind==='promotion'?'Yrkesprov':session.kind==='legacy'?'Ditt pågående arbete':session.kind==='gate'?'Stadsportens kunskapsprov':'Repetition hos Rut';
 $('progress').textContent=`Fråga ${session.index+1} av ${session.ids.length}`;
 $('question').textContent=engine.state.simpleText&&q.simpleQuestion?q.simpleQuestion:q.question;
 const feedback=session.feedback,chain=q.type==='chain';if(chain&&!session.optionsShown){engine.showOptions();session.optionsShown=true;}
 $('answerForm').hidden=chain||!!feedback;$('chainForm').hidden=!chain||!session.optionsShown||!!feedback;$('showOptions').hidden=!!feedback||session.optionsShown||chain;
 $('showOptions').textContent=(chain?'Visa byggdelarna · gratis (nödvändiga för uppgiften)':'Visa svarsalternativ')+(engine.optionsCost()?` · 1 äpple (${engine.state.inventory.apple||0} kvar)`:' · gratis');
 $('choiceArea').hidden=chain||!session.optionsShown||!!feedback;$('choiceArea').replaceChildren();
 $('helpText').hidden=!session.clue;$('helpText').textContent=session.clue||'';$('sourceText').textContent=q.bookReference||engine.current().pages;$('questionSource').open=false;$('feedback').hidden=!feedback;$('next').hidden=!feedback?.correct;$('retry').hidden=!feedback||feedback.correct;$('hint').hidden=session.kind!=='story'||!!feedback;$('hint').textContent=session.clue?'Läs ledtråden igen':`Ge ett äpple för en ledtråd (${engine.state.inventory.apple||0})`;
 if(feedback){if(chain){const preview=$('chainPreview');preview.hidden=false;preview.replaceChildren();const heading=document.createElement('strong');heading.textContent=feedback.correct?'Du byggde den här förklaringen!':'Din förklaring – försök igen';const paragraph=document.createElement('p');paragraph.textContent=q.steps.map((part,i)=>[part.connector,session.draft[i]].filter(Boolean).join(' ')).join('. ').replace(/\s+/g,' ').trim()+'.';preview.append(heading,paragraph);$('feedback').hidden=feedback.correct;$('chainForm').hidden=true;}else $('chainPreview').hidden=true;$('feedback').className=feedback.correct?'good':'bad';$('feedback').textContent=(feedback.correct?'Rätt. ':'Vi tittar på det igen. ')+feedback.explanation;$('next').textContent=session.index===session.ids.length-1?'Avsluta arbetet':'Nästa fråga';readable($('feedback').textContent);}
 else{
  $('answer').value='';$('answer').disabled=false;
  if(!chain&&session.optionsShown){const choices=choicesFor(q,[...engine.content.cards.values()]);if(!choices.length){$('choiceArea').hidden=false;const message=document.createElement('p');message.textContent='Här finns inga tillförlitliga svarsalternativ ännu. Använd bokhänvisningen eller skriv ett eget svar.';$('choiceArea').append(message)}for(const choice of choices){const b=document.createElement('button');b.type='button';b.textContent=choice;b.onclick=()=>submitAnswer(choice,true);$('choiceArea').append(b)}}
  if(chain&&session.optionsShown){$('chainPreview').hidden=false;renderChain(q,session);}
  readable($('question').textContent+(chain?' Fundera på sambandet innan du visar delarna.':''));
  if(!chain&&!session.optionsShown)requestAnimationFrame(()=>$('answer').focus({preventScroll:true}));
 }
 $('instruction').textContent=chain?'Bygg en mening: välj hur förklaringen fortsätter, en del i taget.':'Tänk efter först. Enter fungerar för kortsvar.';$('work').scrollTop=0;
}
function renderChain(q,session){
 const host=$('chainParts');host.replaceChildren();
 const firstEmpty=session.draft.findIndex(v=>!v);const step=firstEmpty<0&&session.draft.length===3?3:firstEmpty<0?session.draft.length:firstEmpty;
 $('chainForm').querySelector('button[type="submit"]').hidden=step<3;
 if(step===3){const title=document.createElement('strong');title.textContent='Din förklaring är färdig!';host.append(title);const back=document.createElement('button');back.type='button';back.textContent='Ändra sista delen';back.onclick=()=>{engine.setDraft(2,'');renderChain(q,engine.currentQuiz())};host.append(back);updatePreview();return}
 const part=q.steps[step],heading=document.createElement('h3');heading.textContent=(step+1)+' / 3';host.append(heading);
 const sentence=document.createElement('p');sentence.className='chain-prompt';sentence.textContent=part.connector||'Fortsätt förklaringen';host.append(sentence);
 
 for(const choice of shuffle(part.options)){const b=document.createElement('button');b.type='button';b.className='chain-option';b.textContent=choice;b.onclick=()=>{engine.setDraft(step,choice);renderChain(q,engine.currentQuiz())};host.append(b)}
 if(step>0){const back=document.createElement('button');back.type='button';back.textContent='← Ändra föregående del';back.onclick=()=>{engine.setDraft(step-1,'');renderChain(q,engine.currentQuiz())};host.append(back)}
 updatePreview();
}
function updatePreview(){const q=engine.question(),s=engine.currentQuiz();$('chainPreview').textContent='Din förklaring hittills: '+q.steps.map((p,i)=>s.draft[i]?((p.connector||'')+' '+s.draft[i]):'').filter(Boolean).join(' · ')}
function submitAnswer(value,supported=false){const r=engine.answer(value,{supported});if(!r.ok){notify(r.reason==='incomplete'?'Välj en del på varje rad.':'Skriv ett svar först.');return}cue('paper');renderQuestion()}
$('answerForm').onsubmit=e=>{e.preventDefault();submitAnswer($('answer').value)};
$('chainForm').onsubmit=e=>{e.preventDefault();submitAnswer(engine.currentQuiz().draft,true)};
$('showOptions').onclick=()=>{const r=engine.showOptions();if(!r.ok){notify(r.reason==='no-apple'?'Du behöver ett äpple för svarsstöd på gesäll- och mästarnivå. Repetera hos Rut för att tjäna ett, eller försök svara själv.':'Svarsstödet kan inte visas nu.');return}renderQuestion()};
$('retry').onclick=()=>{engine.retry();renderQuestion()};
$('hint').onclick=()=>{const clue=engine.hint();if(clue.ok){renderQuestion();$('helpText').textContent=clue.text;$('helpText').hidden=false;readable(clue.text)}else if(clue.reason==='no-apple'){notify('Inga äpplen kvar. Pausa uppdraget och repetera hos Rut i arkivet.');$('helpText').textContent='Bokhänvisningen är gratis. På lärlingsnivå är även svarsalternativen gratis. Hos Rut kan du repetera för att tjäna ett äpple.';$('helpText').hidden=false}};
$('next').onclick=()=>{const result=engine.nextQuestion();if(!result.ok)return;if(!result.finished){renderQuestion();return}view=engine.world().scene;updateChrome();if(result.review){say(result.gate?'Stadsvakten':'Rut',result.gate?(result.passed?`Godkänt! ${result.correct} av ${result.total} rätt utan stöd. Nästa avsnitt är öppet. Mästarbrevet kan du fortsätta samla stämplar till.`:`Du fick ${result.correct} av ${result.total} rätt utan stöd. Du kan träna hos läromästaren Rut och försöka igen.`):result.promoted?`Yrkesprovet är klart. Du är nu ${result.promoted===2?'gesäll':'mästare'} i det området.`:`Du svarade rätt utan ny hjälp på ${result.correct} av ${result.total}. ${result.pay?'Du får ett äpple och 1 daler. Äpplet kan du ge för en extra ledtråd.':'För ett äpple behöver du minst 70 procent rätt på första försöket utan stöd. Vi övar igen när du vill.'}`);actions(result.gate?[[result.passed?'Gå till nästa avsnitt':'Tillbaka till staden',()=>result.passed?changeChapter(engine.current().id+1):enter('town')]]:[['Tillbaka till platsen',()=>placeMenu()]]);}else placeMenu();resize()};
function openPuzzle(){hush();actions();$('puzzle').hidden=false;const kind=engine.level().puzzle,finland=kind==='finland';$('puzzleTitle').textContent=finland?'Två kartor över riket':'Hitta gården efter skiftet';$('puzzleText').textContent=finland?'Efter freden 1809 visar kartan ett nytt styre. Vilket land styr nu Finland och Åland?':'Före skiftet låg familjens tegar på flera platser. Efter skiftet har jorden samlats. Vilken gård ska brevet till?';
 $('puzzleDrawing').className=finland?'map-pair finland':'map-pair';$('puzzleDrawing').replaceChildren();for(const title of finland?['Före kriget','Efter freden 1809']:['Före skiftet','Efter skiftet']){const el=document.createElement('div');el.className='paper-map';const name=document.createElement('strong');name.textContent=title;el.append(name);for(let i=0;i<6;i++){const patch=document.createElement('i');patch.className='map-patch patch-'+i;el.append(patch)}$('puzzleDrawing').append(el)}
 $('puzzleChoices').replaceChildren();$('puzzleFeedback').textContent='';for(const [value,label]of finland?[['russia','Ryssland'],['sweden','Sverige']]:[['joined','Gården vid den samlade åkern'],['strips','Gården vid de gamla utspridda tegarna']]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{const result=engine.puzzle(value);if(result.correct){$('puzzle').hidden=true;placeMenu('Nu stämmer platsen och kartans tid med uppgifterna. Ta med underlaget till mottagaren.')}else $('puzzleFeedback').textContent=finland?'Jämför fredsbeskedet igen. Sverige förlorade Finland och Åland.':'Leta efter jord som har samlats till ett större område.'};$('puzzleChoices').append(b)}
}
function meetRut(){walkTo(rutAt(performance.now()),()=>{say('Läromästaren Rut','Vill du följa med mig till arkivet och öva? Där kan du tjäna äpplen.');actions([['Följ med Rut',()=>{hush();actions();rutEscort={progress:0};walkTo(points.archive,()=>{rutEscort=false;enter('archive');mentorMenu()})}],['Inte nu',()=>{hush();actions()},true]])})}
function mentorMenu(){const n=engine.reviewIds().length;say('Läromästaren Rut',n?`Vi repeterar upp till ${n} frågor som du redan har mött. Minst ${Math.ceil(n*.7)} rätt på första försöket utan stöd ger ett äpple och 1 daler. Du kan komma tillbaka när du vill.`:'Gör ett första uppdrag och läs en fråga. Sedan kan vi repetera den tillsammans.');actions(n?[[engine.world().review?'Fortsätt repetitionspasset':'Börja repetera',startReview],...(engine.world().review?[['Avbryt repetitionspasset',()=>{engine.cancelReview();placeMenu()},true]]:[]),['Jag går vidare',()=>placeMenu(),true]]:[['Jag går vidare',()=>placeMenu()]])}
function goMentor(){closeDialogs();if(view==='work')engine.pauseWork();enter('town',{quiet:true});walkTo(points.archive,()=>{enter('archive');mentorMenu()})}
function startReview(){closeDialogs();engine.arrive('archive');const r=engine.beginReview();if(!r.ok){notify('Gör ett första uppdrag så kan Rut repetera det du har arbetat med.');return}openQuiz()}
function changeChapter(id,unlock=false){if(!engine.setChapter(id,{unlock})){notify('Avsluta eller avbryt repetitionspasset innan du byter avsnitt.');return}closeDialogs();enter('town');say('Berättaren',`${engine.current().date}. ${engine.current().title}. Ditt nästa ärende börjar på ${PLACES[engine.level().giver].name.toLowerCase()}.`);actions([['Jag går vidare',()=>{hush();actions()}]]);resize()}
function social(place='town'){
 const c=engine.current().id,name=place==='town'?'Kvinnan på torget':npcName(place);
 const theme=c<=1?{start:'De kallar det en fri tid. Jag undrar vem som får känna den friheten.',explain:'Kungen bestämmer mindre. Men alla får inte vara med i riksdagen eller bestämma över sina liv.',question:'Vems frihet skulle du vilja veta mer om?',answers:[['Barnens','Ja. Deras liv kunde bero mycket på familjen och arbetet.'],['Kvinnornas','Ja. Många kvinnor fick inte själva bestämma över sina liv.']]}:c<=4?{start:'Jag tänker på barnen som ingen kunde ta hand om.',explain:'Ett barnhus kunde ge tak över huvudet, men barnen fick ofta arbeta hårt och kunde bli illa behandlade.',question:'Vad tycker du vi ska fråga om?',answers:[['Hur barnen själva upplevde det','Deras röster behövs också i berättelsen.'],['Vad de fick göra om dagarna','Ja, en arbetsdag kan berätta mycket om deras villkor.']]}:c<=8?{start:'Några försvarar Gustav III. Andra är mycket arga på honom.',explain:'Människor kan uppskatta vissa reformer och ändå vara oroliga för att kungen bestämmer allt mer.',question:'Vad vill du fråga vidare om?',answers:[['Vilka som gillade förändringarna','Ja. Olika grupper kunde ha olika skäl.'],['Om ett vunnet krig hade ändrat bilden','Det kunde ha påverkat några. Men vi kan inte veta säkert hur alla skulle ha tänkt.']]}:{start:'Kartor och brev berättar olika delar av det som hände.',explain:'Kartan visar gränser och platser. Ett brev kan berätta hur en människa upplevde en händelse.',question:'Vilken fråga vill du börja med?',answers:[['Vems berättelse saknas','Det är en bra sak att undersöka i samlingen.'],['När källan gjordes','Ja. Ett minne nedskrivet långt senare behöver granskas på sitt sätt.']]};
 say(name,theme.start);actions([['Hur menar du?',()=>{say(name,theme.explain);actions([['Jag funderar vidare',()=>{say(name,theme.question);actions([...theme.answers.map(([label,reaction])=>[label,()=>{say(name,reaction);actions([['Tack för pratstunden',()=>place==='town'?enter('town'):placeMenu()]])}]),['Jag går vidare',()=>place==='town'?enter('town'):placeMenu(),true]])}],['Jag går vidare',()=>place==='town'?enter('town'):placeMenu(),true]])}],['Jag går vidare',()=>place==='town'?enter('town'):placeMenu(),true]]);
}
$('meetDog').onclick=()=>walkTo({x:485,y:405},()=>{dogUntil=performance.now()+5000;say('Hunden','Voff!');actions([['Gå vidare',()=>{hush();actions()}]])});
$('meetWoman').onclick=()=>walkTo({x:830,y:460},()=>social('town'));
function bagRow(name,action=null,fn=null){const row=document.createElement('div');row.className='bag-row';const label=document.createElement('strong');label.textContent=name;row.append(label);if(action){const b=document.createElement('button');b.textContent=action;b.onclick=fn;row.append(b)}$('bagItems').append(row)}
function showBag(){
 $('bagItems').replaceChildren();const item=engine.item();if(item)bagRow(item);if(engine.state.inventory.apple)bagRow(`Äpplen till ledtrådar · ${engine.state.inventory.apple}`);if(engine.state.inventory.bread)bagRow(`Bröd · ${engine.state.inventory.bread}`,'Ät',()=>{engine.eat('bread');showBag()});
 if(!item&&!engine.state.inventory.apple&&!engine.state.inventory.bread){const p=document.createElement('p');p.textContent='Ryggsäcken är tom.';$('bagItems').append(p)}
 $('taskList').textContent=engine.objective();$('wallet').textContent=`${engine.state.coins} daler · ${engine.state.food} av 5 i mättnad. Mat är frivillig; du kan alltid fortsätta arbeta.`;
}
function closeDialogs(){for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close()}
function openDialog(id){stopWalking();narrator.stop();speechEnd=0;closeDialogs();$(id).showModal()}
$('bagBtn').onclick=()=>{showBag();openDialog('bag')};$('bagClose').onclick=()=>$('bag').close();$('reviewBtn').onclick=goMentor;$('bookMentor').onclick=goMentor;
$('bookBtn').onclick=()=>{
 const c=engine.current(),done=engine.progress().done,l=engine.level(),a=engine.active();
 $('bookIntro').textContent=`${c.title} · ${done} av 3 nivåer. Lärling öppnar stadsportens prov. Gesäll och mästare är frivilliga. ${done===3?'Mästarstämpel intjänad!':LEVEL_NAMES[l.level-1]+' · '+LEVEL_TASKS[l.level-1]}`;
 $('currentOrder').replaceChildren();
 for(const [heading,text] of [['Beställning',l.request],['Just nu',engine.objective()],['Sedan',a?.phase==='work'?`Lämna ${l.artifact.toLowerCase()} på ${PLACES[l.recipient].name.toLowerCase()}.`:a?l.title:done===3?c.next:`Ta emot uppdraget på ${PLACES[l.giver].name.toLowerCase()}.`]]){const p=document.createElement('p'),strong=document.createElement('strong');strong.textContent=heading+': ';p.append(strong,document.createTextNode(text));$('currentOrder').append(p)}
 $('chapterList').replaceChildren();$('chapterSelect').replaceChildren();
 for(const ch of engine.content.chapters){
  const p=engine.world().jobs[ch.id]?.done||0,ac=engine.world().jobs[ch.id]?.active,b=document.createElement('button');b.className='chapter-row';b.disabled=ch.id>engine.world().unlocked;b.setAttribute('aria-current',String(ch.id===c.id));
  const title=document.createElement('strong');title.textContent=`${ch.id}. ${ch.title}`;b.append(title);const stamps=document.createElement('span');stamps.className='stamps';
  LEVEL_NAMES.forEach((name,i)=>{const stamp=document.createElement('span');stamp.className='stamp'+(p>i?' complete':ch.id===c.id&&i===(ac?.level||Math.min(3,p+1))-1?' active':'');stamp.textContent=(p>i?'✓ ':'')+name;stamps.append(stamp)});b.append(stamps);b.onclick=()=>changeChapter(ch.id);$('chapterList').append(b);
  const option=document.createElement('option');option.value=ch.id;option.textContent=`${ch.id}. ${ch.title}`;$('chapterSelect').append(option);
 }$('chapterSelect').value=c.id;openDialog('book');
};$('bookClose').onclick=()=>$('book').close();$('openChapter').onclick=()=>changeChapter(Number($('chapterSelect').value));
$('settingsBtn').onclick=()=>{$('simpleText').checked=engine.state.simpleText;$('volume').value=Math.round((window.UPPDRAG_SOUND?.status.volume||.75)*100);openDialog('settings')};$('settingsClose').onclick=()=>$('settings').close();
$('simpleText').onchange=()=>{engine.state.simpleText=$('simpleText').checked;engine.save();if(view==='work')renderQuestion()};$('volume').oninput=()=>window.UPPDRAG_SOUND?.setVolume(Number($('volume').value)/100);
function download(filename,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$('backupBtn').onclick=()=>download('uppdrag-1700-sparfil.json',JSON.stringify(engine.snapshot(),null,2),'application/json');
$('restoreFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5000000)throw Error();const value=JSON.parse(await file.text());if(value.version!==2)throw Error();try{localStorage.setItem(saveKey()+'.before-import',JSON.stringify(engine.snapshot()))}catch{}engine.replace(value);closeDialogs();resumeScene();notify('Sparfilen är inläst.')}catch{$('settingsStatus').textContent='Sparfilen kunde inte läsas. Ditt nuvarande spel finns kvar.'}e.target.value=''};
$('bankFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error();const value=JSON.parse(await file.text());if(!validBank(value,base))throw Error();const replacement=createEngine({bank:value,practice:window.UPPDRAG_PRACTICE,initial:engine.snapshot(),onSave:persist});localStorage.setItem(BANK_KEY,JSON.stringify(value));bank=value;engine=replacement;engine.save();$('settingsStatus').textContent='Frågebanken är inläst. Sparade svar och framsteg finns kvar.'}catch{$('settingsStatus').textContent='Frågebanken kunde inte läsas. Den tidigare banken och sparningen finns kvar.'}e.target.value=''};
function showReport(){
 const all=[...engine.content.cards.values()],seen=all.filter(q=>engine.state.answers[q.id]?.attempts),first=seen.filter(q=>engine.state.answers[q.id].firstCorrect&&!engine.state.answers[q.id].firstSupported),gaps=all.filter(q=>engine.state.gaps.includes(q.id));$('reportBody').replaceChildren();
 for(const text of [`${seen.length} av ${all.length} frågor prövade. ${first.length} rätt direkt utan stöd.`,`${engine.content.chapters.filter(c=>engine.world().jobs[c.id]?.done===3).length} av 10 avsnitt avslutade. Leveranser och självständiga kunskapssvar redovisas var för sig.`]){const p=document.createElement('p');p.textContent=text;$('reportBody').append(p)}
 const h=document.createElement('h3');h.textContent='Att arbeta vidare med';$('reportBody').append(h);for(const q of gaps){const p=document.createElement('p');p.textContent=q.question;$('reportBody').append(p)}if(!gaps.length){const p=document.createElement('p');p.textContent='Inga noterade felsvar just nu.';$('reportBody').append(p)}
 const hint=document.createElement('p');hint.className='small';hint.textContent='Färdiga svarsalternativ och sambandsdelar räknas som stöd. Rapporten är övningsunderlag, inte ett betyg.';$('reportBody').append(hint);
 const ranks=document.createElement('h3');ranks.textContent='Kapitlens stämplar';$('reportBody').append(ranks);for(const c of engine.content.chapters){const p=document.createElement('p'),done=engine.world().jobs[c.id]?.done||0;p.textContent=`${c.id}. ${c.title}: ${done?LEVEL_NAMES.slice(0,done).join(', '):'Inga stämplar än'}`;$('reportBody').append(p)}openDialog('report');
}
$('reportBtn').onclick=showReport;$('reportClose').onclick=()=>$('report').close();$('downloadReport').onclick=()=>download('uppdrag-1700-kunskapsrapport.csv',engine.reportCSV(),'text/csv;charset=utf-8');
$('talk').onclick=()=>{narrator.setEnabled(!narrator.enabled);rememberSpeech();speechControls();if(narrator.enabled){if(readableText)readCurrent();else narrator.read('Tal är på.')}};$('readAgain').onclick=readCurrent;
function refreshSound(){$('sound').textContent=window.UPPDRAG_SOUND?.enabled?'Effekter på':'Effekter av';$('sound').setAttribute('aria-pressed',String(!!window.UPPDRAG_SOUND?.enabled))}
$('sound').onclick=async()=>{const enabled=await window.UPPDRAG_SOUND?.setEnabled(!window.UPPDRAG_SOUND?.enabled);refreshSound();if(enabled){cue('wood');try{ambientAudio||=new (window.AudioContext||window.webkitAudioContext)();await ambientAudio.resume()}catch{}}};
function water(){if(!ambientAudio||ambientAudio.state!=='running'||!window.UPPDRAG_SOUND?.enabled)return;const rate=ambientAudio.sampleRate,duration=1.8,buffer=ambientAudio.createBuffer(1,rate*duration,rate),samples=buffer.getChannelData(0);let v=0;for(let i=0;i<samples.length;i++){v+=(Math.random()*2-1-v)*.025;samples[i]=v*Math.sin(Math.PI*i/samples.length)}const src=ambientAudio.createBufferSource(),gain=ambientAudio.createGain();gain.gain.value=(window.UPPDRAG_SOUND?.status.volume||.75)*.13;src.buffer=buffer;src.connect(gain).connect(ambientAudio.destination);src.start();src.onended=()=>{src.disconnect();gain.disconnect()}}
$('home').onclick=()=>enter('town');$('back').onclick=()=>{if(view==='work'){engine.pauseWork();enter(engine.world().scene)}else enter('town')};
window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(modalOpen())return;if(view==='work'){engine.pauseWork();enter(engine.world().scene)}else if(view!=='town')enter('town');else{hush();actions()}return}if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||modalOpen()||view!=='town')return;const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(k)){e.preventDefault();hush();actions();queue=[];arrival=null;keys.add(k)}});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
document.addEventListener('visibilitychange',()=>{keys.clear();lastFrame=performance.now();if(document.hidden){narrator.stop();speechEnd=0;engine.save();ambientAudio?.suspend()}else if(window.UPPDRAG_SOUND?.enabled)ambientAudio?.resume().catch(()=>{})});
window.addEventListener('pagehide',()=>{narrator.stop();engine.save()});
function frame(t){const elapsed=Math.min(1,(t-lastFrame)/1000||0);lastFrame=t;moving=false;
 if(!document.hidden)for(let remaining=elapsed;remaining>0;){const dt=Math.min(.04,remaining);remaining-=dt;if(view==='town'&&!modalOpen()){
  let dx=0,dy=0;if(keys.size){dx=(keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0);dy=(keys.has('arrowdown')||keys.has('s')?1:0)-(keys.has('arrowup')||keys.has('w')?1:0)}else if(queue.length){const p=queue[0],dist=Math.hypot(p.x-engine.world().player.x,p.y-engine.world().player.y);if(dist<230*dt+1){engine.world().player={...p};queue.shift();if(!queue.length){const fn=arrival;arrival=null;engine.save();$('skipWalk').hidden=true;fn?.()}}else{dx=(p.x-engine.world().player.x)/dist;dy=(p.y-engine.world().player.y)/dist}}
  if(rutEscort){const player=engine.world().player;rutEscort.progress=Math.max(rutEscort.progress,Math.min(1,1-Math.hypot(player.x-470,player.y-555)/Math.hypot(570-470,445-555)));}if(dx||dy){const len=Math.hypot(dx,dy);dx/=len;dy/=len;const player=engine.world().player,nx=player.x+dx*230*dt,ny=player.y+dy*230*dt;if(walkable(nx,player.y))player.x=nx;if(walkable(player.x,ny))player.y=ny;heading=Math.atan2(dx,-dy);moving=true;}
 }}
 $('skipWalk').hidden=!queue.length||t-walkStart<1400;if(['quay','marstrand'].includes(view)&&t-ambientLast>13000&&!document.hidden){water();ambientLast=t}draw(t);requestAnimationFrame(frame);
}
function resumeScene(){const screen=engine.world().screen,place=engine.world().scene;if(screen==='work'&&engine.currentQuiz()){view='work';updateChrome();openQuiz()}else enter(place)}
window.UPPDRAG_GAME_CLOUD={snapshot:()=>engine.snapshot(),pause:()=>{if(engine.world().review){notify('Avsluta repetitionspasset före kontobyte.');return false}stopWalking();narrator.stop();return true},resume:resumeScene,enter(uid,value){hush();closeDialogs();account=uid;const cached=read(saveKey());if(value&&cached){try{localStorage.setItem(saveKey()+'.backup',JSON.stringify(cached))}catch{}}engine.replace(value||cached);engine.state.name='';engine.save();resumeScene()},leave(){hush();account=null;engine.replace(read(SAVE_KEY));resumeScene()}};
$('accountBtn').addEventListener('click',()=>$('settings').close());
if(!window.UPPDRAG_OFFLINE)import('../cloud-ui.mjs').catch(()=>{$('accountBtn').onclick=()=>{notify('Kontofunktionen kunde inte öppnas. Spelet sparas på den här enheten.')}});
refreshSound();speechControls();engine.save();resumeScene();requestAnimationFrame(frame);
