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
 #storyBubble .storyDialogueHint{display:block;margin-top:11px;font:12px/1.35 system-ui,sans-serif;color:#6f6252}
 #storyBubble.speech{cursor:pointer}
 #storyBubble .thoughtChoice{display:block;width:100%;min-height:44px;margin:4px 0;padding:8px 9px;background:transparent;border:0;color:inherit;font:italic 17px/1.35 Georgia,'Times New Roman',serif;cursor:pointer}
 #storyBubble .thoughtChoice:hover{text-decoration:underline;text-underline-offset:4px}
 #storyBubble:focus-visible,#storyBubble .thoughtChoice:focus-visible{outline:1.5px dashed #625545;outline-offset:1px}
 #storyWorkPanel{box-sizing:border-box;pointer-events:auto;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(740px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;padding:22px 26px;background:linear-gradient(#fffefbe6,#fffefbe6),#fffefa var(--dialogue-light) repeat;border:1px solid #bbaa875e;box-shadow:2px 3px 0 #5b49382b;text-align:left}
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
 #storyWorkArtifact,#storyWorkPrompt,#storyWorkPanel .storyJobMeta{font-size:15px!important;color:#655b4f}
 #storyWorkPanel[data-mode=quiz] #storyQuestion{margin-top:14px;padding-top:14px;border-top:1px solid #bbaa875e;font-size:22px;line-height:1.4}
 #storyChapterJobs{display:grid;gap:10px;margin:16px 0}
 #storyChapterJobs .storyJob{padding:13px 15px;background:#fffefa80;border:1px solid #bbaa875e}
 #storyChapterJobs .storyJob[aria-current=true]{border-left:3px solid #55736b;padding-left:13px}
 #storyChapterJobs .storyJob h3{margin:5px 0 7px}
 #storyChapterJobs .storyJob small{font-size:14px;color:#655b4f}
 #storyChapterJobs .storyJob p{margin:6px 0}
 #storyWorkReport{margin:14px 0;padding:12px 15px;border-left:3px solid #708072;background:#edf0e466}
 #storyWorkReport h3{margin:0 0 9px}
 #storyWorkReport dl{margin:0}
 #storyWorkReport .storyReportRow{display:flex;justify-content:space-between;gap:18px;padding:5px 0;font-size:16px;line-height:1.4}
 #storyWorkReport dd{margin:0;font-variant-numeric:tabular-nums}
 #storyFinishedAnswers{border-top:1px solid #bbaa875e;border-bottom:1px solid #bbaa875e;padding:8px 0;margin:16px 0}
 #storyFinishedAnswers summary{cursor:pointer;min-height:44px;box-sizing:border-box;padding:10px 0;font-size:17px;line-height:1.4}
 #storyFinishedAnswers ol{padding-left:23px;margin:5px 0 10px}
 #storyFinishedAnswers>ol>li{padding:8px 0;border-top:1px solid #bbaa8738}
 #storyFinishedAnswers .storyAnswerQuestion{font-weight:bold;margin:5px 0}
 #storyFinishedAnswers .storyCanonicalAnswer{margin:5px 0}
 #storyFinishedAnswers .storyCanonicalChain{font-size:16px;line-height:1.5;margin:5px 0 9px}
 #storyFinishedAnswers small{font-size:14px;color:#655b4f}
 #storyWorkNext{padding:11px 14px;border-left:3px solid #8d7956;background:#f2e9d35e}
 #storyWorkPanel .storyBookColumns{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:24px;align-items:start}
 #storyCurrentOrder{border:1px solid #6d81785c;border-left:4px solid #526f64;background:#edf0e5;padding:16px 18px;margin:10px 0 22px}
 #storyCurrentOrder h3{font-size:23px;margin:4px 0 7px}
 #storyCurrentOrder .storyEyebrow,.storyItemCopy>small{font:12px/1.4 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:#536a60}
 #storyCurrentOrder #storyNextPlace{font-size:15px;margin:3px 0 8px;color:#655b4f}
 #storyCurrentOrder .storyControls{margin-top:12px}
 #storyFollowGuide{background-color:#dce5d6!important;border:1px solid #687e68!important}
 #storyQuestRoute{list-style:none;padding:0;margin:15px 0 20px;counter-reset:route}
 #storyQuestRoute>li{position:relative;display:grid;grid-template-columns:30px minmax(0,1fr);column-gap:12px;padding:0 0 20px;min-height:62px}
 #storyQuestRoute>li:not(:last-child):before{content:'';position:absolute;left:14px;top:29px;bottom:-1px;border-left:2px dashed #beb39f}
 #storyQuestRoute>li[data-status=complete]:before{border-left-style:solid;border-color:#78917c}
 #storyQuestRoute .storyRouteDot{position:relative;z-index:1;display:grid;place-items:center;width:30px;height:30px;border:1px solid #ac9d82;border-radius:50%;background:#fffefa;font:14px system-ui,sans-serif;color:#75664f}
 #storyQuestRoute [data-status=complete] .storyRouteDot{background:#e0e7d9;border-color:#6d866e;color:#355841}
 #storyQuestRoute [data-status=current] .storyRouteDot{background:#47685b;border-color:#47685b;color:#fffefa;box-shadow:0 0 0 4px #e5eadf}
 #storyQuestRoute .storyRouteText{padding:3px 0 0;min-width:0}
 #storyQuestRoute strong{font:normal 17px/1.35 Georgia,serif;display:block}
 #storyQuestRoute [data-status=current] strong{font-weight:bold;color:#345648}
 #storyQuestRoute small{font:12px/1.4 system-ui,sans-serif;display:block;color:#71664f;margin-top:5px}
 #storyQuestRoute p{font-size:14px;margin:5px 0 0}
 #storyQuestRoute .storyStepStatus{display:inline-block;margin-right:6px;text-transform:uppercase;font-size:10px;letter-spacing:.05em;font-weight:600}
 #storyRouteProgress{font:13px/1.4 system-ui,sans-serif!important;color:#6f624d}
 #storyWorkPanel .storyItemCard{display:flex;gap:12px;align-items:center;padding:12px;background:#f2e9d78c;border:1px solid #b4a18470;margin:10px 0}
 #storyWorkPanel .storyItemCard[data-future=true]{background:transparent;border-style:dashed}
 .storyItemPicture{display:block;flex:0 0 76px;width:76px;height:68px}
 #storyWorkPanel .storyItemCopy{min-width:0}
 #storyWorkPanel .storyItemName{font:normal 18px/1.3 Georgia,serif;margin:3px 0 5px;overflow-wrap:anywhere}
 #storyWorkPanel .storyItemCopy p{font-size:14px;margin:4px 0}
 #storyWorkPanel .storyBookDetails{border-top:1px solid #bbaa875e;padding:13px 0;margin-top:14px}
 #storyWorkPanel .storyBookDetails>summary{font-size:18px;line-height:1.4;cursor:pointer;min-height:40px;padding:5px 0}
 #storyChapterList{list-style:none;padding:0;margin:12px 0 0;border-left:1px solid #b6a887}
 #storyChapterList .storyChapter{position:relative;border:0;padding:3px 0 12px 16px;margin-left:0}
 #storyChapterList .storyChapter:before{content:'';position:absolute;left:-5px;top:15px;width:9px;height:9px;border:1px solid #a09274;border-radius:50%;background:#fffefa}
 #storyChapterList .storyChapter[data-chapter-status=complete]:before{background:#597761;border-color:#597761}
 #storyChapterList .storyChapter[aria-current=true]{border:0;padding-left:16px;background:#e8eddc66}
 #storyChapterList .storyChapter[aria-current=true]:before{background:#47685b;border-color:#47685b;box-shadow:0 0 0 3px #e8eddf}
 #storyChapterList .storyChapter>button{font-size:14px;line-height:1.3;min-height:30px;margin:0;padding:3px 0}
 #storyChapterList .storyChapter small{display:block;font:11px/1.3 system-ui,sans-serif;color:#71664f}
 #storyChapterList .storyStamps{margin:4px 0 0;gap:4px}
 #storyChapterList .storyStamp{font-size:10px;padding:2px 4px}
 #storyBriefPurpose{font-size:18px!important}
 #storyRecallContract{border-left:3px solid #71816f;padding:8px 12px;background:#edf0e466}
 #storyRecallContract p{font-size:15px;margin:4px 0}
 footer .storyBookControl{display:flex;align-items:center;gap:7px;background:#f7efdc;border-color:#5c725f;border-radius:3px;font:14px Georgia,serif}
 footer .storyBookControl .storyItemPicture{width:27px;height:27px;flex-basis:27px}
 footer .storyCarryControl{display:flex;align-items:center;gap:6px;max-width:210px;background:transparent;border-color:#baa987;border-radius:3px;text-align:left;font-size:12px}
 footer .storyCarryControl .storyItemPicture{width:34px;height:30px;flex-basis:34px}
 footer .storyCarryControl span{max-width:145px;white-space:normal}
 @media(max-width:620px){#storyWorkPanel .storyBookColumns{grid-template-columns:minmax(0,1fr);gap:5px}#storyCurrentOrder{padding:12px 13px}#storyCurrentOrder h3{font-size:21px}#storyChapterList{margin-bottom:16px}.storyItemPicture{width:66px;flex-basis:66px;height:60px}}
 @media(max-width:640px),(max-height:430px){#storyWorkPanel{padding:14px 17px}#storyWorkPanel h2{font-size:22px;margin:7px 0 12px}#storyWorkPanel p{font-size:16px}#storyPuzzleDrawing{gap:9px}#storyPuzzleDrawing .paper-map{height:125px}#storyBubble{padding:23px 30px}#storyBubble p{font-size:16px;line-height:1.4}}
 @media(forced-colors:active){#storyWorkPanel{background:Canvas;border:1px solid CanvasText}#storyWorkPanel button,#storyAnswer{background:ButtonFace;border:1px solid ButtonText}}
`;
document.head.append(style);

let mode=null,place=null,physicalRoom=null,roomKey=null,geometry=null,revision=0,signature='';
let speechAt=0,speechEnd=0,afterSpeech=null,taskKey=null,selectedMaterial=null,acting=0;
let oldFocus=null,footerStates=[],bookResult='',latestResult=null;
let startChoiceHandled=false,startActionRunning=false;
const carryControls=[];
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
const jobOf=level=>level?.job||{};
const artifactOf=level=>jobOf(level).artifact||jobOf(level).artefact||level?.artifact||'Arbetsbladet';
const jobTitle=level=>jobOf(level).title||level?.title||artifactOf(level);
const inSentence=text=>text?text[0].toLocaleLowerCase('sv')+text.slice(1):'';
const questionCount=n=>`${n} ${n===1?'fråga':'frågor'}`;
const guide=()=>state()?.guide?.();
function itemPicture(kind='paper'){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 96 80');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.classList.add('storyItemPicture');
  const shapes={
    paper:'<path d="M22 7h39l15 15v50H22z" fill="#fffaf0"/><path d="M61 7v16h15M32 34h32M32 43h32M32 52h23" fill="none"/><path d="M28 63h35" stroke="#719084"/>',
    letter:'<path d="M10 23h76v48H10z" fill="#f8edcf"/><path d="m10 23 38 30 38-30M10 71l27-25m49 25L59 46" fill="none"/><circle cx="48" cy="49" r="9" fill="#99624e" stroke="#794935"/><path d="m44 49 3 3 6-7" fill="none" stroke="#edceb0"/>',
    crate:'<path d="m9 32 16-13h48l15 13v38H9z" fill="#c7a47c"/><path d="M9 43h79M9 58h79M23 32v38M75 32v38" fill="none"/><path d="M30 12h26v13c0 11-26 11-26 0z" fill="#fffaf1" stroke="#496f87"/><path d="M56 16h8c9 0 9 12 0 12h-8M30 18h26m-23 9h19" fill="none" stroke="#496f87"/><path d="m60 33 4-18 8-1 7 19" fill="#fffaf1" stroke="#496f87"/><path d="M49 44v23m-9-17 18 11m0-11-18 11" stroke="#8a6a46"/>',
    map:'<path d="m8 17 26-9 28 9 26-9v56l-26 9-28-9-26 9z" fill="#e7e4c9"/><path d="M34 8v56m28-47v56" fill="none"/><path d="m15 41 16-9 16 13 13-11 19 11" fill="none" stroke="#76939b" stroke-width="5"/><path d="m16 56 9-7 18 11 15-13 21 10" fill="none" stroke="#9b8863" stroke-dasharray="3 3"/>',
    book:'<path d="M17 8h56l7 7v56H25c-10 0-13-9-8-15z" fill="#6b8270"/><path d="M25 8v50M25 58h55v13H25c-10 0-13-13 0-13z" fill="#f3e8cc"/><path d="M39 23h24M39 31h24M31 64h43" fill="none" stroke="#d7c792"/>'
  };
  svg.innerHTML='<g stroke="#806c51" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'+(shapes[kind]||shapes.paper)+'</g>';
  return svg;
}
function itemCard(product,{id='',caption='I ryggsäcken',future=false}={}){
  const card=el('section',null,{className:'storyItemCard'});if(id)card.id=id;
  card.dataset.itemKind=product.kind||'parcel';card.dataset.future=String(future);
  const copy=el('div',null,{className:'storyItemCopy'});
  copy.append(el('small',caption),el('h4',product.name,{className:'storyItemName'}));
  if(product.description)copy.append(el('p',product.description));
  card.append(itemPicture(product.icon),copy);return card;
}
function reportFor(chapter,level){
  const saved=state()?.workReport?.(chapter,level);
  if(saved?.finishedAt!=null)return saved;
  const latest=state()?.lastWorkReport;
  return latest?.finishedAt!=null&&latest.chapter===chapter&&latest.level===level?latest:null;
}
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
function focusPaper(node=paper){
  node.focus({preventScroll:true});
  if(node===paper||paper.hidden||!paper.contains(node))return;
  const box=paper.getBoundingClientRect?.(),target=node.getBoundingClientRect?.();
  if(!box||!target||!box.height)return;
  // Keep keyboard focus visible inside a long sheet without moving the world.
  if(target.top<box.top+10)paper.scrollTop-=box.top+10-target.top;
  else if(target.bottom>box.bottom-10)paper.scrollTop+=target.bottom-box.bottom+10;
}
function close(restore=true){
  if(!mode)return false;
  if(mode==='start'&&!removeStartQuery()){notice('Det gick inte att stänga startvalet. Försök igen.');return false;}
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
  bubble.append(el('small','Mellanslag eller Enter · fortsätt',{className:'storyDialogueHint'}));
  position();focusPaper(bubble);
}
function thoughts(choices){
  afterSpeech=null;setMode('thoughts');bubble.className='thought';bubble.replaceChildren();bubble.dataset.speaker='';
  bubble.setAttribute('role','group');bubble.setAttribute('aria-label','Dina tankar');bubble.setAttribute('aria-keyshortcuts','ArrowUp ArrowDown ArrowLeft ArrowRight Enter Space Escape');
  for(const choice of choices){const b=actionButton(choice.label,choice.action,choice.run);b.className='thoughtChoice';bubble.append(b);}
  bubble.append(el('small',choices.length===1?'Mellanslag eller Enter · välj':'Pilar · välj tanke   Mellanslag · svara',{className:'storyDialogueHint'}));
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
  if(task.phase==='deliver')return `Du har med dig ${inSentence(task.artifact)}. Vi tittar på resultatet tillsammans.`;
  const l=engine().level(),a=engine().active();
  if(jobOf(l).dialogue?.workIntro)return jobOf(l).dialogue.workIntro;
  const start=a?.quiz?'Det du har hunnit skriva ligger kvar.':a?.repeat?'Vi kan gå igenom arbetet en gång till.':'Sätt dig här och hjälp mig en stund. Vi använder det du minns från avsnittet.';
  return start+(l.recipient===place?'':` Sedan tar du det till ${placeName(l.recipient).toLowerCase()}.`);
}
function actionLabel(task){
  const a=engine().active();
  if(task.phase==='offer')return `Jag tar beställningen.`;
  if(task.phase==='work')return jobOf(engine().level()).dialogue?.[a?.quiz?'resumeLabel':'startLabel']||`Jag ${a?.quiz?'fortsätter':'prövar vad jag minns och hjälper dig'} med ${inSentence(artifactOf(engine().level()))}.`;
  if(task.phase==='materials')return 'Jag lägger materialet i pressen.';
  if(task.phase==='puzzle')return 'Jag jämför kartorna.';
  if(task.phase==='deliver')return `Jag lämnar ${inSentence(task.artifact)}.`;
  const label=(task.label||'Ta med underlaget').replace(/[.!]$/,'');
  const verbs={Ta:'tar',Lägg:'lägger',Hämta:'hämtar',Återgå:'återgår'};
  const first=label.split(' ')[0];return 'Jag '+(verbs[first]||first.toLowerCase())+label.slice(first.length)+'.';
}
function resumeTask(task,choose=true){
  taskKey=task.key;
  const resume=()=>speak(actionLabel(task),()=>speak('Javisst. Det du har hunnit göra ligger kvar. Vi fortsätter där du slutade.',()=>runTask(task,'beginWork')),'Du');
  if(choose)thoughts([{label:actionLabel(task),action:'beginWork',run:resume}]);else resume();
}
function showTask(task=state()?.taskAt(place),read=true){
  if(!task){showDirection();return;}
  taskKey=task.key;
  if(task.phase==='work'&&engine().active()?.quiz){
    // A resumed sheet keeps its existing question, draft and feedback. The
    // thought becomes speech once, followed by one short acknowledgement.
    resumeTask(task);
    return;
  }
  if(task.phase==='work'){
    if(read)speak(taskLine(task),()=>openWorkBrief(task));else openWorkBrief(task);
    return;
  }
  const choices=()=>{
    const now=state().taskAt(place);if(!now||now.key!==task.key){showTask(now);return;}
    const action={offer:'accept',work:'beginWork',materials:'materials',puzzle:'puzzle'}[task.phase]||task.phase;
    thoughts([{label:actionLabel(task),action,run:()=>speak(actionLabel(task),()=>runTask(task,action),'Du')}]);
  };
  if(read)speak(taskLine(task),choices);else choices();
}
function nextStepChoices(){
  const next=guide()?.next,choices=[];
  if(next){
    const here=physicalPlace()===next.place;
    choices.push({label:here?'Jag frågar om nästa steg.':`Jag går till ${placeName(next.place).toLowerCase()}.`,action:here?'inspect':'navigate',run:()=>here?showTask():navigate(next.place)});
  }
  choices.push({label:'Jag tittar i uppdragsboken.',action:'book',run:openBook});
  thoughts(choices);
}
function showDirection(){
  const line=state().guidanceAt(place)?.text||'Ta fram uppdragsboken, så ser du nästa steg på vägen.';
  speak(line,nextStepChoices);
}
function open(atPlace,{thoughtsFirst=false,guidance=false}={}){
  if(!engine()||physicalPlace()!==atPlace)return false;
  state().syncPlace();const task=state().taskAt(atPlace);
  if(!task&&!thoughtsFirst&&!guidance)return false;
  if(mode)close(false);mount(atPlace);
  if(task?.phase==='work'&&engine().active()?.quiz){resumeTask(task,thoughtsFirst);return true;}
  if(!task){
    if(thoughtsFirst)thoughts([{label:'Vart ska jag nu?',action:'guidance',run:()=>speak('Vart skulle jag nu igen?',showDirection,'Du')}]);
    else speak('Vart skulle jag nu igen?',showDirection,'Du');
    return true;
  }
  const arrival=task.phase==='offer'?`Kan jag hjälpa dig med ${inSentence(task.title)}?`:task.phase==='work'?'Jag har med mig beställningen.':task.phase==='deliver'?`Här kommer ${inSentence(guide()?.carried?.name||task.artifact)}.`:'Jag kommer för att fortsätta med ärendet.';
  if(thoughtsFirst){
    const choices=[{label:task.thought||'Jag frågar om uppdraget.',action:'inspect',run:()=>speak(arrival,()=>showTask(task),'Du')}];
    thoughts(choices);
  }else speak(arrival,()=>showTask(task),'Du');
  return true;
}
function runTask(task,action){
  if(state().taskAt(place)?.key!==task.key){showTask();return;}
  if(action==='materials'){openMaterials();return;}
  if(action==='puzzle'){openPuzzle();return;}
  const currentGuide=guide(),dialogue=jobOf(engine().level()).dialogue||{};
  const result=mutate(action,place);
  if(!success(result)){speak(problemText(result),()=>showTask());return;}
  if(action==='beginWork'){renderQuiz();return;}
  if(action==='deliver'){
    const earned=currentGuide.repeat?`Du får ${result.pay} daler för det nya arbetspasset.`:`Nu får du ${levels()[task.level-1].toLowerCase()}stämpeln och ${result.pay} daler.`;
    bookResult=`${currentGuide.outcome.name} är levererad. ${earned}`;
    speak(`${dialogue.delivered||result.text} ${earned}`,nextStepChoices);return;
  }
  if(action==='accept'){speak(dialogue.accepted||state().guidanceAt(place)?.text||'Tack! Ta med beställningen, så kan du ge dig iväg.',nextStepChoices);return;}
  speak(state().guidanceAt(place)?.text||'Tack. Nu kan du fortsätta till nästa steg.',nextStepChoices);
}
function openWorkBrief(task){
  if(state().taskAt(place)?.key!==task.key||task.phase!=='work'){showTask();return;}
  const g=guide(),level=engine().level(),job=jobOf(level);
  paperShell(jobTitle(level),'workBrief',{subtitle:`Avsnitt ${engine().current().id}: ${engine().current().title} · hos ${nameOf(level.work)}`});
  paper.append(el('p',job.dialogue?.workIntro||taskLine(task),{id:'storyBriefPurpose'}));
  appendCurriculumNotice(paper);
  if(job.theme)paper.append(el('p','Det här tränar du: '+job.theme,{id:'storyWorkTheme'}));
  appendWorkReferences(engine().current(),job,paper);
  if(g.carried)paper.append(itemCard(g.carried,{id:'storyCarriedItem',caption:g.carried.kind==='order'?'Din beställning':'Du har med dig'}));
  const recall=el('section',null,{id:'storyRecallContract'});
  recall.append(el('h3','Hjälp till med det du minns'),el('p',job.desk||'Pröva vad du minns från avsnittet.'),el('p',`${questionCount(g.questionCount)}. Försök själv först. Du kan ta hjälp och pausa när du behöver.`,{id:'storyRecallIntro'}));
  paper.append(recall,itemCard(g.outcome,{caption:'När arbetet är klart',future:true}),el('p',g.reward,{id:'storyWorkReward'}));
  const controls=el('div',null,{className:'storyControls'}),begin=actionButton('Jag prövar vad jag minns','beginWork',()=>runTask(task,'beginWork'));
  begin.id='storyBeginRecall';controls.append(begin,actionButton('Jag kommer tillbaka senare','pause',()=>close()));paper.append(controls);
  position();focusPaper(paper);
}
function appendWorkReferences(chapter,job,host){
  const references=[];
  if(chapter.pages)references.push('Grundboken s. '+chapter.pages);
  if(chapter.workbook)references.push('Arbetsbokens uppgifter '+chapter.workbook);
  if(references.length)host.append(el('p',references.join(' · '),{id:'storyChapterReference',className:'storyJobMeta'}));
  if(job.referenceBrief){
    const details=el('details',null,{id:'storyWorkReferences',className:'storyBookDetails'});
    details.append(el('summary','Läs mer i boken'),el('p',job.referenceBrief));host.append(details);
  }
}
function appendCurriculumNotice(host){
  const text=state()?.curriculumNotice;if(!text)return;
  const note=el('p',text,{id:'storyCurriculumNotice'});note.setAttribute('role','status');host.append(note);
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
  const story=session.kind==='story',level=story?e.level():null;
  const workTitle=story?`${levels()[level.level-1]} · avsnitt ${e.current().id}: ${e.current().title}`:session.kind==='promotion'?'Yrkesprov':session.kind==='legacy'?'Ditt pågående arbete':session.kind==='gate'?'Avsnittets avslutning hos Rut':'Repetition hos Rut';
  const question=e.state.simpleText&&q.simpleQuestion?q.simpleQuestion:q.question;
  const heading=paperShell(story?jobTitle(level):question,'quiz',{subtitle:workTitle});paper.dataset.question=q.id;paper.dataset.quizKind=session.kind;
  const progress=el('p',`Fråga ${session.index+1} av ${session.ids.length}`,{id:'storyProgress'});
  if(story){
    if(artifactOf(level)!==jobTitle(level))paper.append(el('p','Uppdragets mål: '+artifactOf(level),{id:'storyWorkArtifact'}));
    if(jobOf(level).theme)paper.append(el('p','Ur avsnittet: '+jobOf(level).theme,{id:'storyWorkTheme'}));
    paper.append(el('p',jobOf(level).desk||'Återkalla det du minns från kapitlet. Försök själv först och ta hjälp när du behöver.',{id:'storyWorkPrompt'}),progress,el('h3',question,{id:'storyQuestion'}));
  }else{heading.id='storyQuestion';paper.querySelector('.storyTop').after(progress);}
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
  if(chain&&!feedback){
    if(session.optionsShown)renderChain(q,session);
    else{
      paper.append(el('p','Tänk igenom sambandet för dig själv innan du tar fram delarna.',{id:'storyRecallFirst'}));
      const reveal=actionButton('Jag har tänkt – visa delarna','showOptions',()=>{const r=mutate('showOptions');if(success(r))renderQuiz();else notice(problemText(r));});
      reveal.id='storyShowChainParts';paper.append(reveal);
    }
  }
  if(session.clue){const help=el('p',session.clue,{id:'storyHelpText'});paper.append(help);}
  if(feedback){
    if(chain){const preview=el('div',null,{id:'storyChainPreview'});preview.append(el('strong',feedback.correct?'Du byggde den här förklaringen!':'Din förklaring – försök igen'),el('p',q.steps.map((part,i)=>[part.connector,session.draft[i]].filter(Boolean).join(' ')).join('. ').replace(/\s+/g,' ').trim()+'.'));paper.append(preview);}
    const note=el('p',(feedback.correct?'Rätt. ':'Vi tittar på det igen. ')+feedback.explanation,{id:'storyFeedback',className:feedback.correct?'good':'bad'});note.setAttribute('role','status');paper.append(note);
    const controls=el('div',null,{className:'storyControls'});
    const button=feedback.correct?actionButton(session.index===session.ids.length-1?'Avsluta arbetet':'Nästa fråga','nextQuestion',nextQuestion):actionButton('Försök igen','retry',()=>{mutate('retry');renderQuiz();});
    button.id=feedback.correct?'storyNext':'storyRetry';controls.append(button);paper.append(controls);
  }else if(story&&(!chain||session.optionsShown)){
    const controls=el('div',null,{className:'storyControls'}),hint=actionButton(session.clue?'Läs ledtråden igen':`Ge ett äpple för en ledtråd (${e.state.inventory.apple||0})`,'hint',()=>{const r=mutate('hint');if(success(r))renderQuiz();else notice(problemText(r));});hint.id='storyHint';controls.append(hint);paper.append(controls);
  }
  const source=el('details',null,{id:'storyQuestionSource'});source.append(el('summary','Bokhänvisning'),el('p',q.bookReference||e.current().pages,{id:'storySourceText'}));paper.append(source);
  position();if(focus){const preferred=feedback?paper.querySelector('#storyNext,#storyRetry'):(!chain&&!session.optionsShown?paper.querySelector('#storyAnswer'):paper.querySelector('#storyShowChainParts,#storyChoiceArea button,#storyChainParts button'));focusPaper(preferred||paper);}
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
  const e=engine(),session=e.currentQuiz();
  const completed=session?.kind==='story'?{chapter:e.current().id,level:e.active().level,ids:[...session.ids],total:session.ids.length,startedAt:session.startedAt}:null;
  const r=mutate('nextQuestion');if(!success(r))return;
  if(!r.finished){renderQuiz();return;}
  if(r.review){showQuizResult(r);return;}
  if(completed){
    const report=r.workReport||reportFor(completed.chapter,completed.level);
    showWorkResult(report||{...completed,finishedAt:Date.now(),delivered:false},{justFinished:true});return;
  }
  showTask();
}
function workContinuation(report,level){
  const e=engine(),a=e.active();
  if(report.delivered)return {text:'Arbetet är levererat och belöningen är utdelad. Nästa ärende finns i uppdragsboken.',label:'Till uppdragsboken',run:openBook};
  if(report.chapter!==e.current().id||a?.level!==report.level||!['materials','puzzle','handoff','deliver'].includes(a.phase)){
    return {text:'Dina frågor och svar finns kvar. I uppdragsboken ser du ditt aktuella ärende.',label:'Till uppdragsboken',run:openBook};
  }
  const g=guide(),target=g.next?.place||e.target(),here=physicalPlace()===target,carried=g.carried?.name||artifactOf(level);
  const next={
    materials:{text:'Nästa steg: lägg svärta, papper och typer i pressen i tryckeriet.',label:here?'Till pressen':`Gå till ${placeName(target)}`},
    puzzle:{text:`Nästa steg: jämför kartorna vid arbetsbordet på ${placeName(target)}.`,label:here?'Till kartbordet':`Gå till ${placeName(target)}`},
    handoff:{text:`Nästa steg: ta ${inSentence(carried)} till ${nameOf(target)} på ${placeName(target)}.`,label:here?'Fortsätt överlämningen':`Gå till ${placeName(target)}`},
    deliver:{text:`Nästa steg: lämna ${inSentence(carried)} till ${nameOf(target)} på ${placeName(target)}.`,label:here?'Lämna arbetet':`Gå till ${placeName(target)}`}
  }[a.phase];
  return {...next,run:()=>{
    const active=engine().active();
    if(engine().current().id!==report.chapter||active?.level!==report.level||!['materials','puzzle','handoff','deliver'].includes(active.phase)){renderBook();return;}
    const destination=engine().target();
    if(physicalPlace()===destination){const task=state().taskAt(destination);if(task)showTask(task);else renderBook();}
    else navigate(destination);
  }};
}
function showWorkResult(report,{justFinished=false}={}){
  if(!report||report.finishedAt==null){renderBook();return;}
  const e=engine(),chapter=e.content.chapters.find(c=>c.id===report.chapter),level=chapter?.levels.find(l=>l.level===report.level);
  if(!level){renderBook();return;}
  latestResult=report;
  const job=jobOf(level),isCurrent=chapter.id===e.current().id&&e.active()?.level===level.level;
  const product=report.delivered?job.parcel:isCurrent?guide()?.carried:job.parcel;
  paperShell(product?.name||artifactOf(level),'workResult',{subtitle:`${levels()[level.level-1]} · avsnitt ${chapter.id}`});
  paper.dataset.reportChapter=String(chapter.id);paper.dataset.reportLevel=String(level.level);
  const finished=report.delivered?'Arbetet är färdigt och levererat.':justFinished&&job.dialogue?.workDone?job.dialogue.workDone:'Minnesarbetet är klart. Frågorna och svaren finns kvar här.';
  paper.append(el('p',finished,{id:'storyWorkFinished'}));
  if(product)paper.append(itemCard({...product,kind:report.delivered?'delivered':product.kind||'parcel'},{id:'storyCarriedItem',caption:report.delivered?'Levererat':isCurrent?'Du har med dig':'Uppdragets mål',future:!report.delivered&&!isCurrent}));
  if(isCurrent&&!report.delivered)paper.append(el('p',guide().reward,{id:'storyWorkReward'}));
  const ids=[...new Set(report.ids||[])],total=Number.isInteger(report.total)?report.total:ids.length;
  const summary=el('section',null,{id:'storyWorkReport'});summary.setAttribute('aria-label','Ditt arbetspass');
  summary.append(el('h3','Ditt minnesarbete · '+questionCount(total)));
  const known=['independent','supported','unknown'].every(key=>Number.isInteger(report[key])&&report[key]>=0)&&report.independent+report.supported+report.unknown===total;
  if(known){
    const counts=el('dl');
    const rows=[['På egen hand vid första försöket',report.independent],['Med stöd eller omförsök',report.supported]];
    if(report.unknown)rows.push(['Uppgift om första försöket saknas',report.unknown]);
    for(const [label,count]of rows){const row=el('div',null,{className:'storyReportRow'});row.append(el('dt',label),el('dd',String(count)));counts.append(row);}
    summary.append(counts);
  }else summary.append(el('p','För det här arbetsbladet saknas uppgifter om vilka svar som kom på första försöket.'));
  paper.append(summary);
  // Canonical answers only appear on a completed sheet. The summary never
  // uses lifetime answer totals to infer independence for this work session.
  const answers=el('details',null,{id:'storyFinishedAnswers'}),list=el('ol');
  answers.append(el('summary','Läs arbetets frågor och svar'));
  for(const id of ids){
    const q=state()?.questionForReport?.(id,report)||e.content.cards.get(id);if(!q)continue;
    const item=el('li'),question=e.state.simpleText&&q.simpleQuestion?q.simpleQuestion:q.question;
    item.append(el('p',question,{className:'storyAnswerQuestion'}));
    if(q.type==='chain'){
      const chain=el('ol',null,{className:'storyCanonicalChain'});
      for(const step of q.steps)chain.append(el('li',[step.connector,step.answer].filter(Boolean).join(' ')));
      item.append(chain);
    }else item.append(el('p',q.answer,{className:'storyCanonicalAnswer'}));
    if(q.bookReference||chapter.pages)item.append(el('small',q.bookReference||'Boken s. '+chapter.pages));
    list.append(item);
  }
  answers.append(list);paper.append(answers);
  const next=workContinuation(report,level),controls=el('div',null,{className:'storyControls'}),continueButton=actionButton(next.label,'continueWork',next.run);
  continueButton.id='storyContinueWork';controls.append(continueButton);
  if(next.run!==openBook)controls.append(actionButton('Läs uppdragsboken','book',openBook));
  paper.append(el('p',next.text,{id:'storyWorkNext'}),controls);position();focusPaper(paper);
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
    if(engine().world().placed.length===3){if(mutate('print')===true){selectedMaterial=null;speak('Här är provtrycket. Ta det till Maja i kaffehuset, så får hon se hur anslaget blir.',nextStepChoices);}return;}
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
  const title=result.gate?'Avsnittets avslutning hos Rut':result.promoted?'Yrkesprovet':'Repetition hos Rut';
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
function removeStartQuery(){
  try{
    const url=new URL(window.location.href);
    if(url.searchParams.has('start')){
      url.searchParams.delete('start');
      window.history.replaceState(window.history.state,'',url.href);
    }
    return true;
  }catch{return false;}
}
function replaceGame(method){
  if(startActionRunning)return;
  if(!removeStartQuery()){notice('Det gick inte att förbereda omgången. Försök igen.');return;}
  startActionRunning=true;
  const buttons=[...paper.querySelectorAll('button')].map(node=>({node,disabled:node.disabled}));
  for(const {node}of buttons)node.disabled=true;
  let result;
  try{result=mutate(method);}catch{result={ok:false};}
  if(success(result)){
    // Do not close/pause the old engine after the new save has been committed.
    // Reload also resets the living world's positions and held-key state.
    try{window.location.reload();}catch{notice('Omgången är sparad. Ladda om sidan för att öppna den.');}
    return;
  }
  startActionRunning=false;
  for(const {node,disabled}of buttons)node.disabled=disabled;
  notice(['previous','no-previous'].includes(result?.reason)?'Det finns ingen sparad föregående omgång att återställa.':result?.reason==='reload'?'Ladda om sidan för att öppna den sparade omgången.':method==='restorePreviousGame'?'Det gick inte att återställa den föregående omgången. Försök igen.':'Det gick inte att starta en ny omgång. Försök igen eller fortsätt den sparade omgången.');
}
function renderStart({focus=true}={}){
  const e=engine();if(!e)return;
  paperShell('Välj spelomgång','start',{subtitle:'Uppdrag 1700'});
  paper.append(el('p','Det finns en sparad omgång i den här webbläsaren. Välj om du vill fortsätta den eller börja från början.'));
  const chapter=e.current(),completed=e.content.chapters.reduce((sum,c)=>sum+(e.world().jobs[c.id]?.done||0),0);
  const saved=el('section',null,{id:'storyStartSummary'});
  saved.append(el('p',`Avsnitt ${chapter.id}: ${chapter.title}`,{id:'storySavedChapter'}),el('p',`${completed} ${completed===1?'avslutat arbete':'avslutade arbeten'}.`,{id:'storySavedWorkCount'}));
  paper.append(saved,el('p','Den nuvarande omgången sparas som föregående omgång om du börjar från början.'));
  const controls=el('div',null,{className:'storyControls'}),resume=actionButton('Fortsätt sparad omgång','continueSavedGame',()=>close()),fresh=actionButton('Börja från början','newGame',()=>replaceGame('newGame'));
  resume.id='storyContinueSavedGame';fresh.id='storyNewGame';controls.append(resume,fresh);paper.append(controls);
  if(state().hasPreviousGame===true){
    const previous=actionButton('Återställ föregående omgång','restorePreviousGame',()=>replaceGame('restorePreviousGame'));
    previous.id='storyRestorePreviousGame';previous.className='storyQuiet';paper.append(previous);
  }
  position();if(focus)focusPaper(paper);
}
function openStart(){
  if(!engine()||travelling()||startActionRunning)return false;
  if(mode&&!close(false))return false;
  mount(physicalPlace());renderStart();return true;
}
function storyReady(){
  mark();refreshCarry();if(startChoiceHandled||!engine())return;
  startChoiceHandled=true;
  try{if(new URL(window.location.href).searchParams.get('start')==='choose')openStart();}catch{}
}
function renderChapterJobs(chapter,active,done,host=paper){
  const jobs=el('section',null,{id:'storyChapterJobs'});jobs.setAttribute('aria-label','Arbeten i det här avsnittet');
  jobs.append(el('h3','Arbeten i avsnittet'));
  for(const level of chapter.levels){
    const current=active?.level===level.level,row=el('article',null,{className:'storyJob'});row.dataset.level=String(level.level);row.setAttribute('aria-current',String(current));
    const status=current?active.quiz?`Pågår · fråga ${active.quiz.index+1} av ${active.quiz.ids.length}`:{
      pickup:'Underlaget hämtas',work:'Redo vid arbetsbordet',materials:'Arbetsbladet klart · provtrycket återstår',puzzle:'Arbetsbladet klart · kartorna återstår',handoff:'Arbetsbladet klart · överlämningen pågår',deliver:'Arbetsbladet klart · dags att lämna det'
    }[active.phase]||'Pågår':done>=level.level?'Levererat':done+1===level.level?'Nästa arbete':'Kommer senare';
    row.append(el('small',levels()[level.level-1]+(level.level>1?' · frivilligt':'')),el('h3',jobTitle(level)),el('p',questionCount(level.ids.length)+' · '+status,{className:'storyJobMeta'}));
    const report=reportFor(chapter.id,level.level);
    if(report){
      const read=actionButton(current&&active.quiz?'Läs det senaste färdiga arbetsbladet':'Läs arbetsbladet','workReport',()=>{
        const saved=reportFor(chapter.id,level.level);if(saved)showWorkResult(saved);else renderBook();
      });
      read.dataset.reportChapter=String(chapter.id);read.dataset.reportLevel=String(level.level);row.append(read);
    }
    jobs.append(row);
  }
  host.append(jobs);
}
function renderRoute(g,host){
  host.append(el('h3','Uppdragets väg'),el('p',g.title,{id:'storyObjective'}));
  const theme=jobOf(engine().level()).theme;
  if(theme)host.append(el('p','Du tränar: '+theme,{id:'storyQuestTheme'}));
  appendWorkReferences(engine().current(),jobOf(engine().level()),host);
  host.append(el('p',`${g.completedSteps} av ${g.totalSteps} steg klara`,{id:'storyRouteProgress'}));
  const route=el('ol',null,{id:'storyQuestRoute'});route.setAttribute('aria-label','Stegen i det aktuella uppdraget');
  for(const [index,step]of g.steps.entries()){
    const row=el('li');row.dataset.routeStep=step.id;row.dataset.status=step.status;row.dataset.place=step.place;
    if(step.status==='current')row.setAttribute('aria-current','step');
    const dot=el('span',step.status==='complete'?'✓':String(index+1),{className:'storyRouteDot'});dot.setAttribute('aria-hidden','true');
    const text=el('div',null,{className:'storyRouteText'}),meta=el('small');
    meta.append(el('span',{complete:'Klart',current:'Nu',upcoming:'Sedan'}[step.status],{className:'storyStepStatus'}),document.createTextNode(step.person+' · '+step.location));
    text.append(el('strong',step.label),meta);
    if(step.status==='current')text.append(el('p',step.detail));
    row.append(dot,text);route.append(row);
  }
  host.append(route);
}
function renderJourney(e,host){
  const world=e.world(),current=e.current(),completedTotal=e.content.chapters.reduce((sum,c)=>sum+(world.jobs[c.id]?.done||0),0);
  host.append(el('h3','Resan genom 1700-talet'),el('p',`Avsnitt ${current.id} av ${e.content.chapters.length} · ${completedTotal} av 30 arbeten levererade`,{id:'storyJourneyProgress'}));
  const chapters=el('ol',null,{id:'storyChapterList'});chapters.setAttribute('aria-label','Alla avsnitt i äventyret');
  for(const chapter of e.content.chapters){
    const completed=world.jobs[chapter.id]?.done||0,here=chapter.id===current.id,locked=chapter.id>world.unlocked;
    const row=el('li',null,{className:'storyChapter'});row.setAttribute('aria-current',String(here));row.dataset.chapterStatus=completed===3?'complete':locked?'locked':here?'current':'open';
    const button=actionButton(`${chapter.id}. ${chapter.title}`,'chapter',()=>selectChapter(chapter.id));button.dataset.chapter=chapter.id;button.disabled=locked||!!world.review;
    row.append(button,el('small',(here?'Här är du · ':locked?'Kommer senare · ':'')+`${completed} av 3 arbeten klara`));
    const stamps=el('div',null,{className:'storyStamps'});
    for(let i=1;i<=3;i++){const stamp=el('span',levels()[i-1]+(completed>=i?' ✓':''),{className:'storyStamp'+(completed>=i?' complete':'')});stamp.setAttribute('aria-label',levels()[i-1]+(completed>=i?' klar':' ännu inte klar'));stamps.append(stamp);}
    row.append(stamps);chapters.append(row);
  }
  host.append(chapters);
}
function renderBook({focus=true}={}){
  const e=engine();if(!e)return;
  paperShell('Uppdragsboken','book',{subtitle:'Din väg genom äventyret'});
  const c=e.current(),a=e.active(),world=e.world(),done=e.progress().done,g=guide(),canExamineHere=physicalPlace()==='archive';
  if(bookResult){const result=el('p',bookResult,{id:'storyBookResult'});result.setAttribute('role','status');paper.append(result);}
  const order=el('section',null,{id:'storyCurrentOrder'});order.append(el('small','Nästa steg',{className:'storyEyebrow'}));
  let destination=g.target,title=g.next?.label,purpose=g.next?.detail,buttonLabel,buttonAction='navigate',run;
  if(world.review){
    destination='archive';title=world.review.kind==='gate'?'Fortsätt avsnittets avslutning hos Rut':'Fortsätt att öva hos Rut';
    purpose='Dina svar ligger kvar. Rut hjälper dig att fortsätta där du slutade.';
    buttonAction=world.review.kind==='gate'?'beginGateExam':'beginReview';
    if(canExamineHere)buttonLabel='Fortsätt med Rut';
    run=()=>{if(!canExamineHere){navigate('archive');return;}if(world.review.kind==='gate')startGate();else {const r=mutate('beginReview');if(success(r))renderQuiz();else notice(problemText(r));}};
  }else if(g.next){
    run=()=>{if(physicalPlace()===destination){close(false);open(destination);}else navigate(destination);};
  }else if(c.id<10&&world.unlocked>c.id){
    title='Fortsätt till nästa avsnitt';purpose='Nästa del av berättelsen är öppen. Du kan också återvända till ett tidigare arbete.';
    buttonLabel='Till nästa avsnitt';buttonAction='nextChapter';run=()=>selectChapter(c.id+1);
  }else if(c.id<10){
    destination='archive';title='Samla ihop avsnittet med Rut';purpose='Alla tre arbeten är levererade. Besök Rut i arkivet och pröva vad du minns innan nästa avsnitt.';
    buttonAction='beginGateExam';run=()=>canExamineHere?startGate():navigate('archive');
    if(canExamineHere)buttonLabel='Pröva vad jag minns med Rut';
  }else{title='Du har nått resans slut';purpose='Dina arbeten och stämplar finns kvar i boken. Du kan återvända till ett avsnitt och arbeta igen.';}
  order.append(el('h3',title,{id:'storyNextStep'}));
  const location=el('p');
  if(destination)location.append(el('span',nameOf(destination),{id:'storyNextPerson'}),document.createTextNode(' · '),el('span',placeName(destination),{id:'storyNextPlace'}));
  else location.append(el('span',`Avsnitt ${c.id}: ${c.title}`,{id:'storyNextPlace'}));
  order.append(location,el('p',purpose,{id:'storyNextPurpose'}));
  appendCurriculumNotice(order);
  if(run){
    const here=physicalPlace()===destination;
    const next=actionButton(buttonLabel||(here?'Prata med '+nameOf(destination):'Visa vägen till '+placeName(destination).toLowerCase()),buttonAction,run);next.id='storyFollowGuide';
    const actions=el('div',null,{className:'storyControls'});actions.append(next);order.append(actions);
  }
  paper.append(order);
  const columns=el('div',null,{className:'storyBookColumns'}),mission=el('section'),journey=el('section');
  renderRoute(g,mission);
  if(g.carried)mission.append(itemCard(g.carried,{id:'storyCarriedItem'}));
  else if(g.phase!=='complete')mission.append(itemCard(g.outcome,{caption:'Det här är målet',future:true}));
  if(g.phase!=='complete')mission.append(el('p',g.reward,{id:'storyWorkReward'}));
  renderJourney(e,journey);columns.append(mission,journey);paper.append(columns);
  const controls=el('div',null,{className:'storyControls'});
  if(world.review){
    controls.append(actionButton(world.review.kind==='gate'?'Lägg undan avslutningen hos Rut':'Avbryt repetitionspasset','cancelReview',()=>{mutate('cancelReview');renderBook();}));
  }else{
    if(c.id<10&&world.unlocked>c.id&&g.next)controls.append(actionButton('Till nästa avsnitt','nextChapter',()=>selectChapter(c.id+1)));
    else if(c.id<10&&done>=1&&g.next)controls.append(actionButton(canExamineHere?'Avsluta avsnittet med Rut':'Gå till Rut för avsnittets avslutning','beginGateExam',()=>canExamineHere?startGate():navigate('archive')));
    if(physicalPlace()==='archive'&&e.reviewIds().length)controls.append(actionButton('Repetera hos Rut','beginReview',openReview));
  }
  if(done>=1&&c.id<10&&world.unlocked<=c.id)paper.append(el('p','Lärlingsarbetet är levererat. Du kan fortsätta med de frivilliga gesälls- och mästararbetena eller besöka Rut i arkivet för att avsluta avsnittet.'));
  paper.append(controls);
  const extras=el('details',null,{className:'storyBookDetails'});extras.id='storyBookWorks';extras.append(el('summary',`Arbeten och stämplar i avsnittet · ${done} av 3 klara`));
  renderChapterJobs(c,a,done,extras);
  const repeats=el('div',null,{className:'storyControls'});
  if(a?.repeat)repeats.append(actionButton('Avsluta repetitionen','cancelRepeat',()=>{mutate('cancelRepeat');renderBook();}));
  if(!a&&!world.review)for(const level of c.levels.filter(level=>level.level<=done)){
    const here=level.giver===physicalPlace();
    const repeat=actionButton(here?'Repetera '+levels()[level.level-1].toLowerCase()+'suppdraget':`Gå till ${placeName(level.giver)} för ett nytt ${levels()[level.level-1].toLowerCase()}spass`,here?'repeat':'repeatTravel',()=>{
      if(!here){navigate(level.giver);return;}
      thoughts([{label:'Jag vill arbeta med ”'+level.title.toLowerCase()+'” en gång till.',action:'repeat',run:()=>speak('Jag vill arbeta med det här en gång till.',()=>{const result=mutate('accept',physicalPlace(),{repeatLevel:level.level});if(success(result))showTask();else speak(problemText(result));},'Du')}]);
    });repeat.dataset.repeatLevel=level.level;repeat.dataset.giver=level.giver;repeats.append(repeat);
  }
  extras.append(repeats);paper.append(extras,el('p',`${e.state.coins} daler · ${e.state.inventory.apple||0} äpplen`,{id:'storyWallet'}));
  const start=actionButton('Ny spelomgång','start',openStart);start.id='storyNewGameChoice';start.className='storyQuiet';paper.append(start);
  position();if(focus)focusPaper(paper);
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
  if(travelling()||!physicalPlace()&&!['book','workResult','start'].includes(mode)||actualRoom()!==physicalRoom){close(false);return;}
  const next=[geometry?.w,geometry?.h,geometry?.left,geometry?.top,revision].join(':');
  if(next!==signature){position();signature=next;}
}
root.addEventListener('click',event=>{if(mode==='speech'&&bubble.contains(event.target)){event.preventDefault();event.stopPropagation();advance();}});
const editable=target=>!!target?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])');
const visibleControls=box=>[...box.querySelectorAll('button,input,select,textarea,summary,a[href]')].filter(node=>{
  if(node.disabled||node.closest('[hidden],[inert]'))return false;
  for(let parent=node.parentElement;parent&&parent!==box;parent=parent.parentElement)if(parent.tagName==='DETAILS'&&!parent.open&&!parent.querySelector('summary')?.contains(node))return false;
  return true;
});
function claimKey(event){
  const claim=window.UPPDRAG_WORLD_KEYBOARD?.claimAction;
  if(claim)return claim(event);
  event.preventDefault();event.stopImmediatePropagation();return !event.repeat;
}
window.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey||event.isComposing)return;
  const key=window.UPPDRAG_WORLD_KEYBOARD?.keyOf(event)||event.key;
  if(!mode){
    if(key.toLowerCase()==='b'&&!event.shiftKey&&!event.repeat&&!editable(event.target)){event.preventDefault();event.stopImmediatePropagation();openBook();}
    return;
  }
  if(key==='Escape'){if(claimKey(event))close();return;}
  if(editable(event.target)){
    if(key==='Enter'&&!event.shiftKey&&mode==='quiz'&&event.target.id==='storyAnswer'){
      if(claimKey(event))submitAnswer(event.target.value,false);
    }
    if(key!=='Tab')return;
  }
  if(!['Enter',' ','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key))return;
  const box=['speech','thoughts'].includes(mode)?bubble:paper;
  if(key==='Tab'||key.startsWith('Arrow')){
    event.preventDefault();event.stopImmediatePropagation();
    if(mode==='speech'){focusPaper(bubble);return;}
    const controls=visibleControls(box),old=controls.indexOf(document.activeElement),back=key==='ArrowUp'||key==='ArrowLeft'||key==='Tab'&&event.shiftKey;
    const index=old<0?(back?controls.length-1:0):(old+(back?-1:1)+controls.length)%controls.length;focusPaper(controls[index]||box);return;
  }
  if(event.shiftKey)return;
  if(!claimKey(event))return;
  if(mode==='speech'){advance();return;}
  const controls=visibleControls(box),focused=event.target.closest?.('button,summary,a[href]');
  if(focused&&controls.includes(focused)){focused.click();return;}
  if(mode==='thoughts'){
    if(controls.length===1)controls[0].click();else focusPaper(controls[0]||bubble);
    return;
  }
  if(mode==='quiz'&&engine().currentQuiz()?.feedback){const button=box.querySelector('#storyNext,#storyRetry');button?.click();return;}
  focusPaper(box.querySelector('#storyBeginRecall,#storyFollowGuide,#storyContinueWork')||controls[0]||box);
},true);
for(const canvas of [document.getElementById('world'),document.getElementById('interiorCanvas')])for(const type of ['pointerdown','pointerup','click'])canvas?.addEventListener(type,event=>{
  if(!mode)return;event.preventDefault();event.stopImmediatePropagation();if(type==='click'&&['speech','thoughts'].includes(mode))close();
},true);
window.addEventListener('uppdrag-story-change',()=>{
  mark();refreshCarry();saveNotice();if(acting||!mode)return;
  if(mode==='book')renderBook({focus:false});
  else if(mode==='start'&&!startActionRunning)renderStart({focus:false});
  else if(mode==='quiz'&&engine()?.question()?.id!==paper.dataset.question)renderQuiz();
});
window.addEventListener('uppdrag-story-ready',storyReady);
window.UPPDRAG_STORY_WORK={tick,open,openBook,openStart,openReview,close,advance,
  get active(){return !!mode;},get busy(){return !!mode;},get roomKey(){return roomKey;},
  get speaker(){return mode==='speech'?bubble.dataset.speaker:'';},get speech(){return {at:speechAt,end:speechEnd};},get revision(){return revision;},
  get state(){return {mode,place,roomKey,taskKey,question:mode==='quiz'?engine()?.question()?.id:null,quizKind:mode==='quiz'?engine()?.currentQuiz()?.kind:null};}
};
for(const [footerId,buttonId]of [['worldFooter','storyBookButton'],['roomFooter','storyRoomBookButton']]){
  const footer=document.getElementById(footerId);if(!footer)continue;
  const button=actionButton('Uppdragsboken','book',openBook);button.id=buttonId;button.className='storyBookControl';button.prepend(itemPicture('book'));button.setAttribute('aria-label','Öppna uppdragsboken. Kortkommando B.');button.setAttribute('aria-keyshortcuts','B');button.disabled=!engine();
  footer.insertBefore(button,footerId==='worldFooter'?footer.firstChild:footer.children[1]||null);
  const carry=actionButton('','inventory',openBook);carry.id=buttonId+'Carry';carry.className='storyCarryControl';carry.hidden=true;button.after(carry);carryControls.push(carry);
  window.addEventListener('uppdrag-story-ready',()=>{button.disabled=false;});
}
function refreshCarry(){
  const carried=guide()?.carried;
  for(const button of carryControls){
    button.hidden=!carried;
    if(!carried)continue;
    const key=carried.kind+':'+carried.name;
    if(button.dataset.itemKey===key)continue;
    button.dataset.itemKey=key;button.dataset.itemKind=carried.kind;
    button.replaceChildren(itemPicture(carried.icon),el('span',carried.name));
    button.setAttribute('aria-label','I ryggsäcken: '+carried.name+'. Öppna uppdragsboken.');
  }
}
state()?.ready?.then(storyReady);
