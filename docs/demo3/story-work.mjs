/* The living world's paper interface for the existing ten-chapter engine.
 * Question, chain, press and map interactions are ported from world/app.mjs.
 * This controller never owns a save or writes engine state. Every change goes
 * through STORY_STATE.act; the existing room loop supplies all geometry.
 */
const roomView=document.getElementById('interiorView');
const stage=document.getElementById('stage');
const root=document.createElement('div');root.id='storyInterface';root.hidden=true;
root.innerHTML='<svg id="storyTail" aria-hidden="true"></svg><section id="storyBubble" hidden tabindex="0"></section><section id="storyWorkPanel" hidden tabindex="-1" role="region"></section>';
stage.append(root);
const bubble=root.querySelector('#storyBubble'),tail=root.querySelector('#storyTail'),paper=root.querySelector('#storyWorkPanel');
const style=document.createElement('style');style.id='story-work-style';
style.textContent=`
 #storyInterface{position:absolute;inset:0;z-index:12;pointer-events:none;color:#382e23;font-family:Georgia,'Times New Roman',serif}
 #storyTail{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
 #storyBubble{position:absolute;pointer-events:auto;box-sizing:border-box;width:348px;max-width:calc(100% - 24px);max-height:calc(100% - 24px);overflow:auto;padding:28px 40px;background:transparent;border:0;color:#302c29;text-align:center;touch-action:manipulation}
 #storyBubble p{font:18px/1.43 Georgia,'Times New Roman',serif;margin:0}
 #storyBubble.speech{cursor:pointer}
 #storyBubble .thoughtChoice{display:block;width:100%;min-height:44px;margin:4px 0;padding:8px 9px;background:transparent;border:0;color:inherit;font:italic 17px/1.35 Georgia,'Times New Roman',serif;cursor:pointer}
 #storyBubble .thoughtChoice:hover{text-decoration:underline;text-underline-offset:4px}
 #storyBubble:focus-visible,#storyBubble .thoughtChoice:focus-visible{outline:1.5px dashed #625545;outline-offset:1px}
 #storyWorkPanel{box-sizing:border-box;pointer-events:auto;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(740px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;padding:22px 26px;background:#fbf1dc var(--dialogue-paper) repeat;border:1px solid #bbaa875e;box-shadow:2px 3px 0 #5b49382b;text-align:left}
 #storyWorkPanel :is(button,input,select){font:inherit;color:inherit}
 #storyWorkPanel h2{font:normal 25px/1.32 Georgia,'Times New Roman',serif;margin:8px 0 16px}
 #storyWorkPanel h3{font:normal 19px/1.35 Georgia,'Times New Roman',serif;margin:14px 0 8px}
 #storyWorkPanel p{font:17px/1.45 Georgia,'Times New Roman',serif;margin:10px 0}
 #storyWorkPanel button{position:relative;min-height:44px;padding:9px 13px;background:#ead7b1 var(--dialogue-label) repeat;border:1px solid #a58d6350;border-radius:1px;cursor:pointer;touch-action:manipulation}
 #storyWorkPanel button:hover{background-color:#f1dfbc}
 #storyWorkPanel button:disabled{opacity:.55;cursor:default}
 #storyWorkPanel .storyQuiet{background:transparent;border-color:transparent;text-decoration:underline;text-underline-offset:4px}
 #storyWorkPanel :is(button,input,summary):focus-visible{outline:3px solid #3e666d;outline-offset:2px}
 #storyWorkPanel:focus{outline:none}
 #storyWorkPanel .storyTop{display:flex;justify-content:space-between;align-items:start;gap:12px}
 #storyWorkPanel .storyTop small,#storyProgress{font:14px/1.4 Georgia,'Times New Roman',serif;color:#6f604b}
 #storyWorkPanel .storyTop button{flex-shrink:0;margin-top:-7px}
 #storyAnswerForm{display:flex;gap:9px;margin:12px 0;flex-wrap:wrap}
 #storyAnswer{flex:1;min-width:120px;min-height:44px;box-sizing:border-box;padding:10px 12px;background:#fff9ea var(--dialogue-light) repeat;border:1px solid #96815c;font-size:19px!important}
 #storyChoiceArea,#storyChainParts{display:grid;gap:8px;margin:12px 0}
 #storyChoiceArea button,#storyChainParts button,#storyPuzzleChoices button{text-align:left;line-height:1.4;background:#fff8e9 var(--dialogue-light) repeat}
 #storyWorkPanel .storyControls{display:flex;gap:9px;flex-wrap:wrap;margin:14px 0 4px}
 #storyFeedback,#storyHelpText,#storyWorkNotice{padding:10px 12px;border-left:3px solid #8d7956;background:#efe3cbd9;font-size:17px;line-height:1.45}
 #storyFeedback.good{border-color:#52675d}#storyFeedback.bad{border-color:#8b5a43}
 #storyChainPreview{padding:10px 0;color:#52675d}
 #storyQuestionSource{font-size:14px;line-height:1.45;margin-top:16px;border-top:1px solid #bbaa874d;padding-top:10px}
 #storyQuestionSource summary{cursor:pointer;min-height:32px}
 #storyMaterials{display:flex;flex-wrap:wrap;gap:12px;margin:16px 0}
 #storyMaterials button{min-width:110px;min-height:66px;background:#fff8e9 var(--dialogue-light) repeat}
 #storyMaterials button[aria-pressed=true]{outline:2px solid #456154;background-color:#e1e7d0}
 #storyPressTarget{display:block;width:100%;min-height:88px!important;border:2px dashed #8c775e!important;background:#ded0b2 var(--dialogue-paper) repeat!important;font-size:20px!important}
 #storyPressLabel{font-size:15px;color:#65533d}
 #storyPuzzleChoices{display:flex;gap:10px;flex-wrap:wrap}
 #storyPuzzleDrawing{display:flex;gap:18px;margin:18px 0}
 #storyPuzzleDrawing .paper-map{position:relative;flex:1;height:150px;background:#d3ccb2 var(--dialogue-paper) repeat;border:2px solid #82795d;overflow:hidden}
 #storyPuzzleDrawing strong{position:absolute;top:7px;left:7px;z-index:2;background:#eee5cf var(--dialogue-paper) repeat;padding:4px;font-size:13px}
 #storyPuzzleDrawing .map-patch{position:absolute;width:22%;height:85%;top:25%;transform:rotate(-13deg);background:#919275;border:2px solid #d8d0b6}
 #storyPuzzleDrawing .patch-0{left:0}#storyPuzzleDrawing .patch-1{left:20%;background:#b29e70}#storyPuzzleDrawing .patch-2{left:40%}#storyPuzzleDrawing .patch-3{left:60%;background:#b29e70}#storyPuzzleDrawing .patch-4{left:80%}#storyPuzzleDrawing .patch-5{left:46%;width:6%;height:120%;background:#ccc3aa}
 #storyPuzzleDrawing .paper-map:nth-child(2) .map-patch{width:42%}#storyPuzzleDrawing .paper-map:nth-child(2) .patch-1{left:45%}#storyPuzzleDrawing .paper-map:nth-child(2) :is(.patch-2,.patch-3,.patch-4){display:none}
 #storyPuzzleDrawing.finland .paper-map{background:#a5b4ad}#storyPuzzleDrawing.finland .map-patch{background:#9c9b78;transform:rotate(10deg);width:35%;height:110%;left:10%;top:20%}#storyPuzzleDrawing.finland .paper-map:nth-child(2) .map-patch{background:#a4957c}
 #storyCurrentOrder{padding:10px 14px;border-left:3px solid #72806a;background:#ece0c2b8;margin:12px 0}
 #storyChapterList{display:grid;gap:0;margin-top:18px}
 #storyChapterList .storyChapter{padding:14px 0;border-top:1px solid #bbaa875e}
 #storyChapterList .storyChapter>button{background:transparent;border:0;text-align:left;padding:4px 0}
 #storyChapterList .storyChapter[aria-current=true]{border-left:3px solid #55736b;padding-left:12px}
 #storyWorkPanel .storyStamps{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}
 #storyWorkPanel .storyStamp{font-size:13px;padding:4px 8px;border:1px dashed #aa9875;color:#73664f}
 #storyWorkPanel .storyStamp.complete{border:2px solid #607765;color:#3d5e4b;background:#e0e3cd;transform:rotate(-1deg)}
 @media(max-width:640px),(max-height:430px){#storyWorkPanel{padding:14px 17px}#storyWorkPanel h2{font-size:22px;margin:7px 0 12px}#storyWorkPanel p{font-size:16px}#storyPuzzleDrawing{gap:9px}#storyPuzzleDrawing .paper-map{height:125px}#storyBubble{padding:23px 30px}#storyBubble p{font-size:16px;line-height:1.4}}
 @media(forced-colors:active){#storyWorkPanel{background:Canvas;border:1px solid CanvasText}#storyWorkPanel button,#storyAnswer{background:ButtonFace;border:1px solid ButtonText}}
`;
document.head.append(style);

let mode=null,place=null,physicalRoom=null,roomKey=null,geometry=null,revision=0,signature='';
let speechAt=0,speechEnd=0,afterSpeech=null,taskKey=null,selectedMaterial=null,acting=0;
let oldFocus=null,footerStates=[],bookResult='',latestResult=null;
const state=()=>window.UPPDRAG_STORY_STATE;
const engine=()=>state()?.engine;
const physicalPlace=()=>window.UPPDRAG_STORY_WORLD?.currentPlace?.()||null;
const actualRoom=()=>typeof interior==='undefined'?null:interior;
const inside=()=>!!actualRoom()&&!roomView.hidden;
const travelling=()=>!!((typeof voyage!=='undefined'&&voyage)||(typeof sailing!=='undefined'&&sailing));
const success=value=>value===true||value?.ok===true;
const nameOf=id=>({cafe:'Maja',print:'Brita',archive:'Rut',quay:'Jo'}[id]||state()?.PLACES?.[id]?.npc||'Berättaren');
const placeName=id=>id==='garden'?'Vetenskapens hus':state()?.PLACES?.[id]?.name||id||'staden';
const levels=()=>state()?.LEVEL_NAMES||['Lärling','Gesäll','Mästare'];
const mark=()=>{revision++;signature='';};
const el=(tag,text,props={})=>Object.assign(document.createElement(tag),props,text==null?{}:{textContent:text});
const actionButton=(label,action,handler)=>{const b=el('button',label,{type:'button'});b.dataset.storyAction=action;b.addEventListener('click',handler);return b;};
function mutate(method,...args){
  if(!state()?.act)return {ok:false,reason:'loading'};
  acting++;
  try{return state().act(method,...args);}finally{acting--;mark();}
}
function dismissOtherTalk(){
  window.UPPDRAG_PLACE_THOUGHTS?.close(false);
  window.UPPDRAG_ARCHIVE_PILOT?.close(false);
  window.UPPDRAG_MEETINGS?.close(false);
  window.UPPDRAG_LIVING_DIALOGUES?.close();
}
function mount(nextPlace){
  if(!mode){
    oldFocus=document.activeElement;dismissOtherTalk();
    footerStates=['worldFooter','roomFooter'].map(id=>{const node=document.getElementById(id);return {node,inert:node?.inert};});
    for(const {node}of footerStates)if(node)node.inert=true;
  }
  place=nextPlace||physicalPlace()||'town';physicalRoom=actualRoom();
  roomKey=inside()?(window.UPPDRAG_STORY_WORLD?.roomKey?.(place)||geometry?.c?.key||physicalRoom?.kind):null;
  const host=inside()?roomView:stage;if(root.parentElement!==host)host.append(root);
  root.hidden=false;window.UPPDRAG_WORLD_KEYBOARD?.clear();
}
function setMode(next){
  mode=next;root.hidden=!next;bubble.hidden=!['speech','thoughts'].includes(next);paper.hidden=!next||['speech','thoughts'].includes(next);
  root.dataset.mode=next||'';bubble.dataset.mode=next||'';paper.dataset.mode=next||'';
  document.body.dataset.storyMode=next||'';speechEnd=0;tail.replaceChildren();mark();
}
function focusPaper(node=paper){node.focus({preventScroll:true});}
function close(restore=true){
  if(!mode)return false;
  const hadQuiz=!!engine()?.currentQuiz()&&engine().world().screen==='work';
  setMode(null);afterSpeech=null;selectedMaterial=null;latestResult=null;
  if(hadQuiz)mutate('pauseWork');
  for(const {node,inert}of footerStates)if(node)node.inert=inert;
  footerStates=[];delete document.body.dataset.storyMode;
  if(restore){
    const person=document.getElementById('meetingPerson');
    if(inside()&&window.UPPDRAG_MEETINGS?.state.npc&&person){person.hidden=false;person.focus({preventScroll:true});}
    else if(oldFocus?.isConnected&&!oldFocus.closest('[hidden],[inert]'))oldFocus.focus({preventScroll:true});
    else (inside()?document.getElementById('interiorCanvas'):document.getElementById('world'))?.focus({preventScroll:true});
  }
  return true;
}
function speak(text,next=null,who=nameOf(place)){
  afterSpeech=next;setMode('speech');bubble.className='speech';bubble.replaceChildren(el('p',text,{id:'storyLine'}));
  bubble.firstElementChild.setAttribute('aria-live','polite');bubble.firstElementChild.setAttribute('aria-atomic','true');
  bubble.setAttribute('role','button');bubble.setAttribute('aria-label',who+': '+text);bubble.setAttribute('aria-keyshortcuts','Enter Space Escape');
  bubble.dataset.speaker=who;speechAt=performance.now();speechEnd=speechAt+Math.min(3600,700+text.length*24);
  position();focusPaper(bubble);
}
function thoughts(choices){
  afterSpeech=null;setMode('thoughts');bubble.className='thought';bubble.replaceChildren();bubble.dataset.speaker='';
  bubble.setAttribute('role','group');bubble.setAttribute('aria-label','Dina tankar');bubble.setAttribute('aria-keyshortcuts','ArrowUp ArrowDown ArrowLeft ArrowRight Enter Space Escape');
  for(const choice of choices){const b=actionButton(choice.label,choice.action,choice.run);b.className='thoughtChoice';bubble.append(b);}
  position();focusPaper(bubble);
}
function advance(){
  if(mode!=='speech')return false;
  const next=afterSpeech;afterSpeech=null;if(next)next();else close();return true;
}
function taskLine(task){
  if(task.phase==='offer')return task.request||task.text;
  if(task.phase==='pickup'||task.phase==='handoff')return task.text;
  if(task.phase==='materials')return 'Manuset är kontrollerat. Lägg svärta, papper och typer direkt i pressen. Provtrycket ska sedan till Maja.';
  if(task.phase==='puzzle')return 'Nu behöver kartorna jämföras innan leveransen kan fortsätta.';
  if(task.phase==='deliver')return `Du har med dig ${task.artifact.toLowerCase()}. Vi tittar på resultatet tillsammans.`;
  const l=engine().level(),a=engine().active();
  const start=a?.quiz?'Dina anteckningar ligger kvar. Vi fortsätter där vi slutade.':a?.repeat?'Vi kan gå igenom underlaget en gång till.':'Ta fram underlaget, så går vi igenom det tillsammans.';
  return start+(l.recipient===place?'':` Sedan tar du det till ${placeName(l.recipient).toLowerCase()}.`);
}
function actionLabel(task){
  const a=engine().active();
  if(task.phase==='offer')return `Jag tar beställningen.`;
  if(task.phase==='work')return a?.quiz?'Jag fortsätter med arbetet.':'Jag börjar med arbetet.';
  if(task.phase==='materials')return 'Jag lägger materialet i pressen.';
  if(task.phase==='puzzle')return 'Jag jämför kartorna.';
  if(task.phase==='deliver')return `Jag lämnar ${task.artifact.toLowerCase()}.`;
  const label=(task.label||'Ta med underlaget').replace(/[.!]$/,'');
  const verbs={Ta:'tar',Lägg:'lägger',Hämta:'hämtar',Återgå:'återgår'};
  const first=label.split(' ')[0];return 'Jag '+(verbs[first]||first.toLowerCase())+label.slice(first.length)+'.';
}
function showTask(task=state()?.taskAt(place),read=true){
  if(!task){showDirection();return;}
  taskKey=task.key;
  const choices=()=>{
    const now=state().taskAt(place);if(!now||now.key!==task.key){showTask(now);return;}
    const action={offer:'accept',work:'beginWork',materials:'materials',puzzle:'puzzle'}[task.phase]||task.phase;
    thoughts([{label:actionLabel(task),action,run:()=>speak(actionLabel(task),()=>runTask(task,action),'Du')}]);
  };
  if(read)speak(taskLine(task),choices);else choices();
}
function showDirection(){
  const e=engine(),next=e.target(),done=e.progress().done;
  if(!e.active()&&done===3){speak(e.current().id===10?'Nu finns vår samling i boken. Tack för hjälpen!':'Tack för hjälpen. Det finns fler ärenden i uppdragsboken när du vill fortsätta.',()=>thoughts([{label:'Jag öppnar uppdragsboken.',action:'book',run:openBook}]));return;}
  const line=e.active()?`Du har ett pågående ${e.active().repeat?'repetitionspass':'uppdrag'}. Nästa steg är hos ${state().PLACES[next]?.npc||placeName(next)} på ${placeName(next).toLowerCase()}.`:`Ditt nästa uppdrag börjar på ${placeName(next).toLowerCase()}. Du får en beställning innan något ska hämtas.`;
  speak(line,()=>thoughts([{label:`Jag går till ${placeName(next).toLowerCase()}.`,action:'navigate',run:()=>navigate(next)}]));
}
function open(atPlace,{thoughtsFirst=false}={}){
  if(!engine()||physicalPlace()!==atPlace)return false;
  state().syncPlace();const task=state().taskAt(atPlace);
  if(!task&&!thoughtsFirst)return false;
  if(mode)close(false);mount(atPlace);
  if(thoughtsFirst){
    const choices=task?[{label:'Jag frågar om uppdraget.',action:'inspect',run:()=>speak('Vad behöver du hjälp med?',()=>showTask(task),'Du')}]:[{label:'Jag tittar i uppdragsboken.',action:'book',run:openBook}];
    thoughts(choices);
  }else speak('Vad behöver du hjälp med?',()=>showTask(task),'Du');
  return true;
}
function runTask(task,action){
  if(state().taskAt(place)?.key!==task.key){showTask();return;}
  if(action==='materials'){openMaterials();return;}
  if(action==='puzzle'){openPuzzle();return;}
  const result=mutate(action,place);
  if(!success(result)){speak(problemText(result),()=>showTask());return;}
  if(action==='beginWork'){renderQuiz();return;}
  if(action==='deliver'){
    bookResult=`${levels()[task.level-1]} klar · ${result.pay} daler. ${result.text}`;
    speak(result.text,()=>showTask());return;
  }
  showTask();
}
function problemText(result){
  const reason=result?.reason;
  if(reason==='no-apple')return 'Inga äpplen kvar. Pausa uppdraget och repetera hos Rut i arkivet. Bokhänvisningen är gratis.';
  if(reason==='incomplete')return 'Välj en del på varje rad.';
  if(reason==='empty')return 'Skriv ett svar först.';
  if(reason==='no-topics')return 'Gör ett första uppdrag och läs en fråga. Sedan kan vi repetera den tillsammans.';
  if(reason==='apprentice')return 'Slutför lärlingsuppdraget i det här avsnittet först.';
  if(reason==='busy')return 'Det finns ett pausat kunskapsprov eller repetitionspass. Fortsätt med det, eller lägg undan det i uppdragsboken.';
  return 'Det steget är inte tillgängligt här just nu. Läs nästa ärende i uppdragsboken.';
}
function notice(text){
  let note=paper.querySelector('#storyWorkNotice');if(!note){note=el('p',null,{id:'storyWorkNotice'});note.setAttribute('role','status');paper.append(note);}
  note.textContent=text;note.hidden=false;
}
function saveNotice(){
  const old=paper.querySelector('#storySaveError');
  if(!state()?.saveError){old?.remove();return;}
  const note=old||el('p',null,{id:'storySaveError'});note.setAttribute('role','status');note.textContent='Det gick inte att spara just nu. Låt spelet vara öppet.';if(!old)paper.append(note);
}
function paperShell(title,nextMode,{subtitle=''}={}){
  setMode(nextMode);paper.replaceChildren();paper.setAttribute('aria-label',title);
  const top=el('div',null,{className:'storyTop'});top.append(el('small',subtitle),actionButton('Lägg undan','pause',()=>close()));
  const heading=el('h2',title,{id:'storyWorkHeading'});paper.append(top,heading);saveNotice();paper.scrollTop=0;return heading;
}
function shuffled(values){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function renderQuiz({focus=true}={}){
  const e=engine(),session=e?.currentQuiz(),q=e?.question();
  if(!session||!q){showTask();return;}
  if(q.type==='chain'&&!session.optionsShown){const r=mutate('showOptions');if(!success(r)){notice(problemText(r));return;}}
  const workTitle=session.kind==='story'?`${levels()[e.active().level-1]} · steg ${e.active().level} av 3`:session.kind==='promotion'?'Yrkesprov':session.kind==='legacy'?'Ditt pågående arbete':session.kind==='gate'?'Stadsportens kunskapsprov':'Repetition hos Rut';
  const question=e.state.simpleText&&q.simpleQuestion?q.simpleQuestion:q.question;
  paperShell(question,'quiz',{subtitle:workTitle});paper.dataset.question=q.id;paper.dataset.quizKind=session.kind;
  paper.querySelector('h2').id='storyQuestion';
  const progress=el('p',`Fråga ${session.index+1} av ${session.ids.length}`,{id:'storyProgress'});paper.querySelector('.storyTop').after(progress);
  if(session.kind==='review'||session.kind==='gate'){
    const rule=`Minst ${Math.ceil(session.ids.length*.7)} av ${session.ids.length} rätt på första försöket utan stöd ${session.kind==='gate'?'öppnar nästa avsnitt.':'ger ett äpple och 1 daler.'}`;
    progress.after(el('p',rule,{id:'storyQuizRule'}));
  }
  const feedback=session.feedback,chain=q.type==='chain';
  if(!feedback&&!chain){
    const form=el('form',null,{id:'storyAnswerForm'}),input=el('input',null,{id:'storyAnswer',type:'text',maxLength:300,autocomplete:'off',value:session.draft?.[0]||''});
    input.setAttribute('aria-labelledby','storyQuestion');input.addEventListener('input',()=>mutate('setDraft',0,input.value));
    const submit=el('button','Svara',{id:'storySubmit',type:'submit'});form.append(input,submit);form.addEventListener('submit',event=>{event.preventDefault();submitAnswer(input.value,false);});paper.append(form);
    if(!session.optionsShown){const b=actionButton(`Visa svarsalternativ${e.optionsCost()?` · 1 äpple (${e.state.inventory.apple||0} kvar)`:' · gratis'}`,'showOptions',()=>{const r=mutate('showOptions');if(success(r))renderQuiz();else notice(problemText(r));});b.id='storyShowOptions';paper.append(b);}
    if(session.optionsShown){
      const area=el('div',null,{id:'storyChoiceArea'}),choices=state().choicesFor(q,[...e.content.cards.values()]);
      if(!choices.length)area.append(el('p','Här finns inga tillförlitliga svarsalternativ ännu. Använd bokhänvisningen eller skriv ett eget svar.'));
      for(const choice of choices){const b=el('button',choice,{type:'button'});b.dataset.storyAnswer=choice;b.addEventListener('click',()=>submitAnswer(choice,true));area.append(b);}paper.append(area);
    }
  }
  if(chain&&!feedback)renderChain(q,session);
  if(session.clue){const help=el('p',session.clue,{id:'storyHelpText'});paper.append(help);}
  if(feedback){
    if(chain){const preview=el('div',null,{id:'storyChainPreview'});preview.append(el('strong',feedback.correct?'Du byggde den här förklaringen!':'Din förklaring – försök igen'),el('p',q.steps.map((part,i)=>[part.connector,session.draft[i]].filter(Boolean).join(' ')).join('. ').replace(/\s+/g,' ').trim()+'.'));paper.append(preview);}
    const note=el('p',(feedback.correct?'Rätt. ':'Vi tittar på det igen. ')+feedback.explanation,{id:'storyFeedback',className:feedback.correct?'good':'bad'});note.setAttribute('role','status');paper.append(note);
    const controls=el('div',null,{className:'storyControls'});
    const button=feedback.correct?actionButton(session.index===session.ids.length-1?'Avsluta arbetet':'Nästa fråga','nextQuestion',nextQuestion):actionButton('Försök igen','retry',()=>{mutate('retry');renderQuiz();});
    button.id=feedback.correct?'storyNext':'storyRetry';controls.append(button);paper.append(controls);
  }else if(session.kind==='story'){
    const controls=el('div',null,{className:'storyControls'}),hint=actionButton(session.clue?'Läs ledtråden igen':`Ge ett äpple för en ledtråd (${e.state.inventory.apple||0})`,'hint',()=>{const r=mutate('hint');if(success(r))renderQuiz();else notice(problemText(r));});hint.id='storyHint';controls.append(hint);paper.append(controls);
  }
  const source=el('details',null,{id:'storyQuestionSource'});source.append(el('summary','Bokhänvisning'),el('p',q.bookReference||e.current().pages,{id:'storySourceText'}));paper.append(source);
  position();if(focus){const preferred=feedback?paper.querySelector('#storyNext,#storyRetry'):(!chain&&!session.optionsShown?paper.querySelector('#storyAnswer'):paper.querySelector('#storyChoiceArea button,#storyChainParts button'));focusPaper(preferred||paper);}
}
function renderChain(q,session){
  const form=el('form',null,{id:'storyChainForm'}),parts=el('div',null,{id:'storyChainParts'}),preview=el('p',null,{id:'storyChainPreview'});
  const firstEmpty=q.steps.findIndex((_,i)=>!session.draft[i]),step=firstEmpty<0?q.steps.length:firstEmpty;
  preview.textContent='Din förklaring hittills: '+q.steps.map((p,i)=>session.draft[i]?((p.connector||'')+' '+session.draft[i]):'').filter(Boolean).join(' · ');
  if(step===q.steps.length){
    parts.append(el('strong','Din förklaring är färdig!'),actionButton('Ändra sista delen','changeLast',()=>{mutate('setDraft',q.steps.length-1,'');renderQuiz();}));
    form.append(parts,preview,el('button','Pröva förklaringen',{type:'submit',id:'storySubmitChain'}));
  }else{
    const part=q.steps[step];parts.append(el('h3',(step+1)+' / '+q.steps.length),el('p',part.connector||'Fortsätt förklaringen'));
    for(const choice of shuffled(part.options)){const b=el('button',choice,{type:'button'});b.dataset.storyStep=step;b.dataset.storyValue=choice;b.addEventListener('click',()=>{mutate('setDraft',step,choice);renderQuiz();});parts.append(b);}
    if(step>0)parts.append(actionButton('← Ändra föregående del','changePrevious',()=>{mutate('setDraft',step-1,'');renderQuiz();}));
    form.append(parts,preview);
  }
  form.addEventListener('submit',event=>{event.preventDefault();submitAnswer(engine().currentQuiz().draft,true);});paper.append(form);
}
function submitAnswer(value,supported){const r=mutate('answer',value,{supported});if(success(r))renderQuiz();else notice(problemText(r));}
function nextQuestion(){
  const r=mutate('nextQuestion');if(!success(r))return;
  if(!r.finished){renderQuiz();return;}
  if(r.review){showQuizResult(r);return;}
  showTask();
}
function openMaterials(){
  paperShell('Gör ett provtryck','materials',{subtitle:engine().level().title});
  paper.append(el('p','Välj ett material på bordet. Klicka sedan på pressen.'));
  const list=el('div',null,{id:'storyMaterials'}),placed=engine().world().placed;
  for(const [id,label]of [['ink','Svärta'],['paper','Papper'],['type','Typer']]){
    const b=el('button',label,{type:'button'});b.dataset.material=id;b.hidden=placed.includes(id);b.setAttribute('aria-pressed',String(selectedMaterial===id));
    b.addEventListener('click',()=>{selectedMaterial=selectedMaterial===id?null:id;for(const c of list.querySelectorAll('button'))c.setAttribute('aria-pressed',String(c.dataset.material===selectedMaterial));paper.querySelector('#storyPressLabel').textContent=selectedMaterial?`${label} är valt. Klicka på pressen.`:`${placed.length} av 3 på plats`;});list.append(b);
  }
  const press=el('button',placed.length===3?'Gör ett provtryck':'Lägg materialet i pressen',{id:'storyPressTarget',type:'button'});
  press.dataset.storyAction=placed.length===3?'print':'placeMaterial';
  press.addEventListener('click',()=>{
    if(engine().world().placed.length===3){if(mutate('print')===true){selectedMaterial=null;speak('Provtrycket ligger i ryggsäcken. Maja väntar på kaffehuset.',()=>showTask());}return;}
    if(!selectedMaterial){notice('Välj först ett material på bordet.');return;}
    if(mutate('placeMaterial',selectedMaterial)===true){selectedMaterial=null;openMaterials();}
  });
  paper.append(list,press,el('p',placed.length===3?'Pressen är redo':`${placed.length} av 3 på plats`,{id:'storyPressLabel'}));position();focusPaper(list.querySelector('button:not([hidden])')||press);
}
function openPuzzle(){
  const finland=engine().level().puzzle==='finland';
  paperShell(finland?'Två kartor över riket':'Hitta gården efter skiftet','puzzle',{subtitle:engine().level().title});
  const drawing=el('div',null,{id:'storyPuzzleDrawing',className:finland?'finland':''});drawing.setAttribute('aria-hidden','true');
  for(const title of finland?['Före kriget','Efter freden 1809']:['Före skiftet','Efter skiftet']){
    const map=el('div',null,{className:'paper-map'});map.append(el('strong',title));for(let i=0;i<6;i++)map.append(el('i',null,{className:'map-patch patch-'+i}));drawing.append(map);
  }
  const question=el('p',finland?'Efter freden 1809 visar kartan ett nytt styre. Vilket land styr nu Finland och Åland?':'Före skiftet låg familjens tegar på flera platser. Efter skiftet har jorden samlats. Vilken gård ska brevet till?',{id:'storyPuzzleText'}),choices=el('div',null,{id:'storyPuzzleChoices'}),feedback=el('p','',{id:'storyPuzzleFeedback'});feedback.setAttribute('role','status');
  for(const [value,label]of finland?[['russia','Ryssland'],['sweden','Sverige']]:[['joined','Gården vid den samlade åkern'],['strips','Gården vid de gamla utspridda tegarna']]){
    const b=el('button',label,{type:'button'});b.dataset.storyPuzzle=value;b.addEventListener('click',()=>{const r=mutate('puzzle',value);if(r?.correct)speak('Nu stämmer platsen och kartans tid med uppgifterna. Ta med underlaget till mottagaren.',()=>showTask());else feedback.textContent=finland?'Jämför fredsbeskedet igen. Sverige förlorade Finland och Åland.':'Leta efter jord som har samlats till ett större område.';});choices.append(b);
  }
  paper.append(drawing,question,choices,feedback);position();focusPaper(choices.firstElementChild);
}
function openReview(){
  if(!engine()||physicalPlace()!=='archive')return false;
  if(mode)close(false);mount('archive');state().syncPlace();
  const n=engine().reviewIds().length;
  const invite=()=>speak(n?'Vi kan titta på sådant du har läst tidigare. Pröva vad du minns, så hjälper jag dig vidare.':'Gör ett första uppdrag och läs en fråga. Sedan kan vi repetera den tillsammans.',n?()=>thoughts([{label:engine().world().review?'Jag fortsätter att repetera.':'Jag prövar vad jag minns.',action:'beginReview',run:()=>speak('Jag vill försöka.',()=>{const r=mutate('beginReview');if(success(r))renderQuiz();else speak(problemText(r));},'Du')} ]):null,'Rut');
  speak('Kan vi öva en stund?',invite,'Du');
  return true;
}
function startGate(){
  const r=mutate('beginGateExam');
  if(r?.already){renderBook();return;}
  if(success(r))renderQuiz();else notice(problemText(r));
}
function showQuizResult(result){
  latestResult=result;
  const title=result.gate?'Kunskapsprovet':result.promoted?'Yrkesprovet':'Repetition hos Rut';
  paperShell(title,'result');
  const text=result.gate?(result.passed?`Godkänt! ${result.correct} av ${result.total} rätt utan stöd. Nästa avsnitt är öppet. Mästarbrevet kan du fortsätta samla stämplar till.`:`Du fick ${result.correct} av ${result.total} rätt utan stöd. Du kan träna hos läromästaren Rut och försöka igen.`):result.promoted?`Yrkesprovet är klart. Du är nu ${result.promoted===2?'gesäll':'mästare'} i det området.`:`Du svarade rätt utan ny hjälp på ${result.correct} av ${result.total}. ${result.pay?'Du får ett äpple och 1 daler. Äpplet kan du ge för en extra ledtråd.':'För ett äpple behöver du minst 70 procent rätt på första försöket utan stöd. Vi övar igen när du vill.'}`;
  const feedback=el('p',text,{id:'storyReviewResult'});feedback.setAttribute('role','status');paper.append(feedback);
  const actions=el('div',null,{className:'storyControls'});
  if(result.gate&&result.passed)actions.append(actionButton('Till nästa avsnitt','nextChapter',()=>selectChapter(engine().current().id+1)));
  actions.append(actionButton('Läs uppdragsboken','book',openBook));paper.append(actions);position();focusPaper(actions.firstElementChild);
}
function navigate(destination){close(false);const r=window.UPPDRAG_STORY_WORLD?.navigate?.(destination);if(r===false){openBook();notice('Det går inte att gå till den platsen just nu.');}}
function selectChapter(id){
  const r=mutate('setChapter',id);if(!success(r)){notice(problemText(r));return;}
  bookResult=engine().current().date+'. '+engine().current().title+'.';renderBook();
}
function openBook(){
  if(!engine()||travelling())return false;
  if(mode)close(false);mount(physicalPlace());state().syncPlace();renderBook();return true;
}
function renderBook({focus=true}={}){
  const e=engine();if(!e)return;
  paperShell('Uppdragsboken','book',{subtitle:'Uppdrag 1700'});
  const c=e.current(),a=e.active(),world=e.world(),done=e.progress().done,canExamineHere=e.availablePlaces().includes(physicalPlace());
  if(bookResult){const result=el('p',bookResult,{id:'storyBookResult'});result.setAttribute('role','status');paper.append(result);}
  const order=el('section',null,{id:'storyCurrentOrder'});order.append(el('h3',`${c.id}. ${c.title}`),el('p',e.objective(),{id:'storyObjective'}));
  const item=e.item();if(item)order.append(el('p','I ryggsäcken: '+item,{id:'storyCarriedItem'}));
  order.append(el('p',`${e.state.coins} daler · ${e.state.inventory.apple||0} äpplen`,{id:'storyWallet'}));paper.append(order);
  const controls=el('div',null,{className:'storyControls'}),target=e.target();
  if(a||done<3){const here=state().taskAt(physicalPlace());controls.append(actionButton(here?'Ta fram uppdraget här':`Gå till ${placeName(target)}`,'navigate',()=>{if(here){close(false);open(physicalPlace());}else navigate(target);}));}
  if(world.review){
    controls.append(actionButton(world.review.kind==='gate'?(canExamineHere?'Fortsätt kunskapsprovet':'Gå till kaffehuset för kunskapsprovet'):'Fortsätt hos Rut',world.review.kind==='gate'?'beginGateExam':'beginReview',()=>{if(world.review.kind==='gate'){if(canExamineHere)startGate();else navigate('cafe');}else if(physicalPlace()==='archive'){const r=mutate('beginReview');if(success(r))renderQuiz();else notice(problemText(r));}else navigate('archive');}));
    controls.append(actionButton(world.review.kind==='gate'?'Avbryt kunskapsprovet':'Avbryt repetitionspasset','cancelReview',()=>{mutate('cancelReview');renderBook();}));
  }else{
    if(c.id<10&&world.unlocked>c.id)controls.append(actionButton('Till nästa avsnitt','nextChapter',()=>selectChapter(c.id+1)));
    else if(c.id<10&&done>=1)controls.append(actionButton(canExamineHere?'Pröva vägen till nästa avsnitt':'Gå till kaffehuset för kunskapsprovet','beginGateExam',()=>canExamineHere?startGate():navigate('cafe')));
    if(physicalPlace()==='archive'&&e.reviewIds().length)controls.append(actionButton('Repetera hos Rut','beginReview',openReview));
  }
  if(a?.repeat)controls.append(actionButton('Avsluta repetitionen','cancelRepeat',()=>{mutate('cancelRepeat');renderBook();}));
  if(!a&&!world.review)for(const level of c.levels.filter(level=>level.level<=done)){
    const here=level.giver===physicalPlace();
    const repeat=actionButton(here?'Repetera '+levels()[level.level-1].toLowerCase()+'suppdraget':`Gå till ${placeName(level.giver)} för ett nytt ${levels()[level.level-1].toLowerCase()}spass`,here?'repeat':'repeatTravel',()=>{
      if(!here){navigate(level.giver);return;}
      thoughts([{label:'Jag vill arbeta med ”'+level.title.toLowerCase()+'” en gång till.',action:'repeat',run:()=>speak('Jag vill arbeta med det här en gång till.',()=>{const result=mutate('accept',physicalPlace(),{repeatLevel:level.level});if(success(result))showTask();else speak(problemText(result));},'Du')}]);
    });repeat.dataset.repeatLevel=level.level;repeat.dataset.giver=level.giver;controls.append(repeat);
  }
  paper.append(controls);
  if(done>=1&&c.id<10&&world.unlocked<=c.id)paper.append(el('p','Lärlingsuppdraget är klart. Kunskapsprovet öppnar nästa avsnitt. Du kan också fortsätta samla gesäll- och mästarstämplar här.'));
  const chapters=el('div',null,{id:'storyChapterList'});
  for(const chapter of e.content.chapters){
    const row=el('section',null,{className:'storyChapter'});row.setAttribute('aria-current',String(chapter.id===c.id));
    const button=actionButton(`${chapter.id}. ${chapter.title}`,'chapter',()=>selectChapter(chapter.id));button.dataset.chapter=chapter.id;button.disabled=chapter.id>world.unlocked||!!world.review;row.append(button);
    const stamps=el('div',null,{className:'storyStamps'}),completed=world.jobs[chapter.id]?.done||0;
    for(let i=1;i<=3;i++){const stamp=el('span',levels()[i-1]+(completed>=i?' ✓':''),{className:'storyStamp'+(completed>=i?' complete':'')});stamp.setAttribute('aria-label',levels()[i-1]+(completed>=i?' klar':' ännu inte klar'));stamps.append(stamp);}row.append(stamps);chapters.append(row);
  }
  paper.append(chapters);position();if(focus)focusPaper(paper);
}
function position(){
  if(!mode)return;
  if(root.parentElement===roomView&&geometry){
    const geo=geometry,p=geo.p;
    if(mode==='speech'||mode==='thoughts'){
      const heads=geo.poses.map(a=>({x:geo.left+p.x+a[0]*p.scale,y:geo.top+p.y+(a[1]-305*a[2])*p.scale,s:a[2]*p.scale}));
      const speakerIndex=mode==='speech'&&bubble.dataset.speaker!=='Du'&&heads.length>1?1:0;
      if(window.UPPDRAG_PAPER_DIALOGUES?.placeRoomBubble?.({bubble,tail,mode,geometry:geo,heads,speakerIndex}))return;
      Object.assign(bubble.style,{left:geo.left+(geo.w-Math.min(348,geo.w-24))/2+'px',top:geo.top+12+'px',width:Math.min(348,geo.w-24)+'px',maxHeight:geo.h-24+'px'});
    }else Object.assign(paper.style,{left:geo.left+geo.w/2+'px',top:geo.top+geo.h/2+'px',width:Math.min(740,geo.w-24)+'px',maxHeight:geo.h-24+'px'});
  }else{
    Object.assign(paper.style,{left:'50%',top:'50%',width:'min(740px,calc(100% - 24px))',maxHeight:'calc(100% - 24px)'});
  }
}
function tick(now,nextGeometry){
  geometry=nextGeometry;
  if(!mode)return;
  if(travelling()||!physicalPlace()&&mode!=='book'||actualRoom()!==physicalRoom){close(false);return;}
  const next=[geometry?.w,geometry?.h,geometry?.left,geometry?.top,revision].join(':');
  if(next!==signature){position();signature=next;}
}
root.addEventListener('click',event=>{if(mode==='speech'&&bubble.contains(event.target)){event.preventDefault();event.stopPropagation();advance();}});
const editable=target=>!!target?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])');
const visibleControls=box=>[...box.querySelectorAll('button,input,select,textarea,summary,a[href]')].filter(node=>!node.disabled&&!node.closest('[hidden],[inert]'));
window.addEventListener('keydown',event=>{
  if(!mode||event.altKey||event.ctrlKey||event.metaKey||event.isComposing)return;
  if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)close();return;}
  if(editable(event.target)){
    if(event.key==='Enter'&&mode==='quiz'&&event.target.id==='storyAnswer'){
      event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)submitAnswer(event.target.value,false);
    }
    if(event.key!=='Tab')return;
  }
  if(!['Enter',' ','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;
  const box=['speech','thoughts'].includes(mode)?bubble:paper;
  if(event.key==='Tab'||event.key.startsWith('Arrow')){
    event.preventDefault();event.stopImmediatePropagation();
    if(mode==='speech'){focusPaper(bubble);return;}
    const controls=visibleControls(box),old=controls.indexOf(document.activeElement),back=event.key==='ArrowUp'||event.key==='ArrowLeft'||event.key==='Tab'&&event.shiftKey;
    const index=old<0?(back?controls.length-1:0):(old+(back?-1:1)+controls.length)%controls.length;focusPaper(controls[index]||box);return;
  }
  if(event.shiftKey)return;
  if(mode==='speech'){event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)advance();return;}
  // Native buttons keep their native Enter/Space click; only repeats are stopped.
  if(event.target.closest?.('button,summary,a[href]')){
    if(mode==='thoughts'){event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)event.target.closest('button,summary,a[href]').click();}
    else if(event.repeat){event.preventDefault();event.stopImmediatePropagation();}return;
  }
  event.preventDefault();event.stopImmediatePropagation();if(event.repeat)return;
  if(mode==='quiz'&&engine().currentQuiz()?.feedback){const button=box.querySelector('#storyNext,#storyRetry');button?.click();}
},true);
for(const canvas of [document.getElementById('world'),document.getElementById('interiorCanvas')])for(const type of ['pointerdown','pointerup','click'])canvas?.addEventListener(type,event=>{
  if(!mode)return;event.preventDefault();event.stopImmediatePropagation();if(type==='click'&&['speech','thoughts'].includes(mode))close();
},true);
window.addEventListener('uppdrag-story-change',()=>{
  mark();saveNotice();if(acting||!mode)return;
  if(mode==='book')renderBook({focus:false});
  else if(mode==='quiz'&&engine()?.question()?.id!==paper.dataset.question)renderQuiz();
});
window.addEventListener('uppdrag-story-ready',mark);
window.UPPDRAG_STORY_WORK={tick,open,openBook,openReview,close,advance,
  get active(){return !!mode;},get busy(){return !!mode;},get roomKey(){return roomKey;},
  get speaker(){return mode==='speech'?bubble.dataset.speaker:'';},get speech(){return {at:speechAt,end:speechEnd};},get revision(){return revision;},
  get state(){return {mode,place,roomKey,taskKey,question:mode==='quiz'?engine()?.question()?.id:null,quizKind:mode==='quiz'?engine()?.currentQuiz()?.kind:null};}
};
for(const [footerId,buttonId]of [['worldFooter','storyBookButton'],['roomFooter','storyRoomBookButton']]){
  const footer=document.getElementById(footerId);if(!footer)continue;
  const button=actionButton('Uppdragsboken','book',openBook);button.id=buttonId;button.setAttribute('aria-label','Öppna uppdragsboken');button.disabled=!engine();footer.append(button);
  window.addEventListener('uppdrag-story-ready',()=>{button.disabled=false;});
}
state()?.ready?.then(mark);
