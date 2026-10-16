import {buildContent,PLACES} from './content.mjs?v=0.6.0';
import {grade,shuffle,csvCell} from './learning.mjs?v=0.6.0';
import {walkable} from '../demo/core.mjs?v=0.6.0';
export const SAVE_KEY='uppdrag1700.adventure.v2';
export const BANK_KEY='uppdrag1700.questions.v1';
const DAY=86400000,PAY={nature:4,farm:5,press:6,ideas:6,power:7,trade:8,king:9};
const copy=x=>JSON.parse(JSON.stringify(x));
const bounded=(n,fallback=0,max=100000)=>Number.isFinite(n)?Math.max(0,Math.min(max,n)):fallback;
const object=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
export function validBank(bank,base){
 const ids=new Set();return !!bank&&Array.isArray(bank.missions)&&bank.missions.length===base.missions.length&&base.missions.every(m=>{
  const v=bank.missions.find(x=>x?.id===m.id);return v&&Array.isArray(v.cards)&&v.cards.length>0&&v.cards.length<=200&&v.cards.every(q=>{
   if(!q||typeof q.id!=='string'||ids.has(q.id)||typeof q.question!=='string'||typeof q.explanation!=='string')return false;ids.add(q.id);
   if(base.sourcePolicy&&(!bank.sourcePolicy||!Array.isArray(q.references)||!q.references.length||q.references.some(r=>!base.sources.some(s=>s.id===r.source)||!r.location)))return false;
   return q.type==='short'?typeof q.answer==='string'&&Array.isArray(q.accept)&&q.accept.length>0&&q.accept.every(a=>typeof a==='string'):q.type==='chain'&&Array.isArray(q.steps)&&q.steps.length===3&&q.steps.every(s=>typeof s.answer==='string'&&Array.isArray(s.options)&&s.options.includes(s.answer));
  });
 });
}
export function createEngine({bank,practice,initial=null,now=()=>Date.now(),rng=Math.random,onSave=()=>{}}){
 const content=buildContent(bank),cards=content.cards,chapters=content.chapters;
 let state;
 function fresh(){return {version:2,name:'',started:true,bankId:bank.bankId,coins:0,food:2,maxFood:5,day:1,time:0,chapter:1,unlockedChapter:1,completed:[],inventory:{apple:1},answers:{},practice:{},gaps:[],history:[],studied:[],careers:{},workSessions:[],visits:{},reviewHistory:[],lastAppleAt:null,hintCredits:{},simpleText:false,workshop:{collected:[],placed:[],printed:false,delivered:false,printCount:0,lastDeliveredDay:0},working:null,rehearsal:null,paperWorld:{version:1,chapter:1,unlocked:1,player:{x:610,y:405},scene:'town',screen:'place',jobs:{},known:[],placed:[],review:null,workMode:'story',effects:[]}}}
 function sanitizeQuiz(q,allowed,kind){
  if(!q||!Array.isArray(q.ids)||!q.ids.length||q.ids.length>100||new Set(q.ids).size!==q.ids.length||q.ids.some(id=>!allowed.has(id))||!Number.isInteger(q.index)||q.index<0||q.index>=q.ids.length)return null;
  const feedback=q.feedback&&q.feedback.question===q.ids[q.index]&&typeof q.feedback.correct==='boolean'?{question:q.feedback.question,correct:q.feedback.correct,explanation:String(q.feedback.explanation||'').slice(0,1500)}:null;
  return {kind,ids:[...q.ids],index:q.index,correct:bounded(q.correct),failed:q.failed===true,hint:q.hint===true,clue:typeof q.clue==='string'?q.clue.slice(0,1500):null,optionsShown:q.optionsShown===true,draft:Array.isArray(q.draft)?q.draft.slice(0,3).map(v=>String(v).slice(0,300)):[],feedback,startedAt:bounded(q.startedAt,now()),missionId:typeof q.missionId==='string'?q.missionId:null,promotion:q.promotion||null};
 }
 function restore(raw){
  const b=fresh();if(!raw||raw.version!==2)return b;
  // Keep first-game fields, then validate fields that the new interface executes.
  const s={...b,...copy(raw)};s.version=2;s.name=String(raw.name||'').slice(0,60);s.coins=bounded(raw.coins);s.food=bounded(raw.food,2,5);s.maxFood=5;s.day=Math.max(1,Math.floor(bounded(raw.day,1)));s.time=bounded(raw.time,0,4);s.simpleText=raw.simpleText===true;
  for(const key of ['answers','practice','careers','hintCredits','inventory'])s[key]=copy(object(raw[key]));
  for(const key of ['gaps','completed','studied'])s[key]=Array.isArray(raw[key])?[...new Set(raw[key].filter(x=>typeof x==='string'))]:[];
  for(const key of ['history','workSessions','reviewHistory'])s[key]=Array.isArray(raw[key])?copy(raw[key].slice(-700)):[];
  s.lastAppleAt=Number.isFinite(raw.lastAppleAt)?raw.lastAppleAt:null;
  const bankChanged=!!bank.sourcePolicy&&raw.bankId!==bank.bankId;
  if(bankChanged){
   // Keep the old record available, but never count old ranks or completed
   // question sets as evidence of knowledge of the newly sourced bank.
   s.learningArchives=[...(Array.isArray(raw.learningArchives)?copy(raw.learningArchives):[]),{bankId:raw.bankId||'legacy',answers:copy(s.answers),practice:copy(s.practice),careers:copy(s.careers),studied:copy(s.studied),paperWorld:copy(object(raw.paperWorld))}];
   s.careers={};s.studied=[];
  }
  const w=bankChanged?{}:object(raw.paperWorld),jobs={};
  for(const c of chapters){
   const saved=object(w.jobs?.[c.id]),done=Math.max(0,Math.min(3,Math.floor(bounded(saved.done))));let active=null;
   if(saved.active&&saved.active.level===done+1&&done<3){
    const l=c.levels[done],a=saved.active;
    if(['pickup','work','materials','puzzle','handoff','deliver'].includes(a.phase)){
     active={level:l.level,phase:a.phase,pickup:Math.min(l.pickups.length,Math.floor(bounded(a.pickup))),handoff:Math.min(l.handoffs.length,Math.floor(bounded(a.handoff))),puzzleSolved:a.puzzleSolved===true,quiz:sanitizeQuiz(a.quiz,new Set(l.ids),'story'),repeat:a.repeat===true};
     if(active.phase==='pickup'&&active.pickup>=l.pickups.length)active.phase='work';
     if(active.phase==='handoff'&&active.handoff>=l.handoffs.length)active.phase='deliver';
     if(active.phase==='materials'&&!l.materials)active.phase='work';
     if(active.phase==='puzzle'&&!l.puzzle)active.phase='work';
    }
   }
   // Repeated jobs preserve the completed story while using a separate active record.
   if(saved.active?.repeat&&saved.active.level>=1&&saved.active.level<=done){
    const l=c.levels[saved.active.level-1],a=saved.active;
    if(['pickup','work','materials','puzzle','handoff','deliver'].includes(a.phase))active={level:l.level,phase:a.phase,pickup:Math.min(l.pickups.length,Math.floor(bounded(a.pickup))),handoff:Math.min(l.handoffs.length,Math.floor(bounded(a.handoff))),puzzleSolved:a.puzzleSolved===true,quiz:sanitizeQuiz(a.quiz,new Set(l.ids),'story'),repeat:true};
   }
   jobs[c.id]={done,active};
  }
  const chapter=Number.isInteger(w.chapter)&&w.chapter>=1&&w.chapter<=10?w.chapter:1;
  const known=Array.isArray(w.known)?w.known.filter(id=>cards.get(id)?.type==='short'):[...cards.values()].filter(q=>q.type==='short'&&(raw.answers?.[q.id]||raw.practice?.[q.id]||(!bankChanged&&raw.studied?.includes(q.missionId)&&(q.chapter||1)<=(raw.chapter||1)))).map(q=>q.id);
  const placed=Array.isArray(w.placed)?w.placed:bankChanged?[]:raw.workshop?.placed||[];
  s.paperWorld={version:1,chapter,unlocked:Math.max(chapter,Math.min(10,Math.floor(bounded(w.unlocked,chapter)))),player:walkable(w.player?.x,w.player?.y)?{x:w.player.x,y:w.player.y}:{x:610,y:405},scene:PLACES[w.scene]&&w.scene!=='gate'?w.scene:'town',screen:w.screen==='work'?'work':'place',jobs,known:[...new Set(known)],placed:[...new Set(placed.filter(x=>['ink','paper','type'].includes(x)))],review:sanitizeQuiz(w.review,new Set(cards.keys()),['promotion','gate'].includes(w.review?.kind)?w.review.kind:'review'),workMode:['review','promotion','legacy','gate'].includes(w.workMode)?w.workMode:'story',effects:Array.isArray(w.effects)?[...new Set(w.effects.filter(x=>typeof x==='string'))]:[]};
  if(!bankChanged&&!raw.paperWorld&&raw.rehearsal){s.paperWorld.review=sanitizeQuiz({...raw.rehearsal,kind:'review'},new Set(cards.keys()),'review');s.paperWorld.workMode='review';s.paperWorld.screen=s.paperWorld.review?'work':'place'}
  if(!bankChanged&&!raw.paperWorld&&raw.working){const q=raw.working;s.paperWorld.review=sanitizeQuiz({...q,correct:q.index},new Set(cards.keys()),'legacy');s.paperWorld.workMode='legacy';s.paperWorld.screen=s.paperWorld.review?'work':'place'}
  s.working=null;s.rehearsal=null;s.chapter=chapter<=4?1:2;s.unlockedChapter=Math.max(s.chapter,raw.unlockedChapter===2?2:1);
  s.visits=practice.visit(object(raw.visits),now());return s;
 }
 state=restore(initial);
 const world=()=>state.paperWorld;
 const current=()=>chapters[world().chapter-1];
 const progress=()=>world().jobs[current().id]||(world().jobs[current().id]={done:0,active:null});
 const active=()=>progress().active;
 const level=()=>current().levels[(active()?.level||Math.min(3,progress().done+1))-1];
 function save(){state.bankId=bank.bankId;onSave(copy(state));return state}
 function availablePlaces(){const known=new Set(['town','cafe','print','quay','archive']);for(const c of chapters.filter(c=>c.id<=world().unlocked))for(const l of c.levels)for(const id of [l.giver,l.work,l.recipient,...l.pickups.map(p=>p.place),...l.handoffs.map(p=>p.place)])known.add(id);return [...known]}
 function arrive(place){if(!availablePlaces().includes(place))return{ok:false,reason:'locked'};world().scene=place;world().screen='place';save();return{ok:true}}
 function target(){const a=active(),l=level();if(!a)return progress().done===3?'cafe':l.giver;if(a.phase==='pickup')return l.pickups[a.pickup]?.place||l.work;if(a.phase==='work'||a.phase==='puzzle')return l.work;if(a.phase==='materials')return'print';if(a.phase==='handoff')return l.handoffs[a.handoff]?.place||l.recipient;return l.recipient}
 function objective(){const c=current(),a=active(),l=level();if(!a)return progress().done===3?(c.id===10?'Boken är klar. Fortsätt arbeta eller repetera.':'Mästarstämpeln är din! Nästa avsnitt öppnas genom stadsportens kunskapsprov.'):`${['Lärling','Gesäll','Mästare'][l.level-1]} · Hämta beställningen på ${PLACES[l.giver].name.toLowerCase()}.`;const t=PLACES[target()]?.name||'';return `${a.repeat?'Nytt arbetspass':['Lärling','Gesäll','Mästare'][a.level-1]} · ${a.phase==='deliver'?'Lämna '+l.artifact:a.phase==='materials'?'Gör provtrycket':a.phase==='handoff'?'Fortsätt leveransen':a.phase==='puzzle'?'Jämför kartorna':a.phase==='pickup'?'Hämta underlaget':'Arbeta med '+l.title.toLowerCase()} · ${t}`}
 function accept(place,{repeatLevel=null}={}){
  if(active())return{ok:false,reason:'active'};
  const done=progress().done,l=repeatLevel?current().levels[repeatLevel-1]:level();
  if(!l||done===3&&!repeatLevel||repeatLevel&&repeatLevel>done||place!==l.giver||world().scene!==place)return{ok:false,reason:'place'};
  progress().active={level:l.level,phase:l.pickups.length?'pickup':'work',pickup:0,handoff:0,puzzleSolved:false,quiz:null,repeat:!!repeatLevel};save();return{ok:true};
 }
 function pickup(place){const a=active(),l=level();if(!a||a.phase!=='pickup'||target()!==place||world().scene!==place)return{ok:false,reason:'place'};a.pickup++;if(a.pickup>=l.pickups.length)a.phase='work';save();return{ok:true}}
 function currentQuiz(){return world().workMode!=='story'?world().review:active()?.quiz||null}
 function question(){const q=currentQuiz();return q?cards.get(q.ids[q.index]):null}
 function introduce(id){const q=cards.get(id);if(q?.type==='short'&&!world().known.includes(id))world().known.push(id);if(q&&!state.studied.includes(q.missionId))state.studied.push(q.missionId)}
 function beginWork(place){const a=active(),l=level();if(!a||a.phase!=='work'||place!==l.work||world().scene!==place)return{ok:false,reason:'place'};
  if(!a.quiz){
   const ids=l.level===1?shuffle(l.ids,rng).sort((x,y)=>score(y)-score(x)):l.ids;
   a.quiz={kind:'story',ids:[...ids],index:0,correct:0,hint:false,optionsShown:false,draft:[],feedback:null,startedAt:now()};
   introduce(ids[0]);
  }
  world().workMode='story';world().screen='work';save();return{ok:true};
 }
 function score(id){const p=state.practice[id];return !p?100:p.lastCorrect===false?80:p.nextDueAt<=now()?60:0}
 function optionsCost(){const quiz=currentQuiz();return quiz?.kind==='story'&&active()?.level>=2&&question()?.type!=='chain'?1:0}
 function showOptions(){const quiz=currentQuiz();if(!quiz||quiz.feedback)return{ok:false,reason:'unavailable'};if(quiz.optionsShown)return{ok:true,cost:0};const cost=optionsCost();if(cost&&!(state.inventory.apple>=cost))return{ok:false,reason:'no-apple'};if(cost){state.inventory.apple-=cost;if(!state.inventory.apple)delete state.inventory.apple;quiz.hint=true}quiz.optionsShown=true;save();return{ok:true,cost}}
 function setDraft(index,value){const quiz=currentQuiz(),q=question();if(!quiz||quiz.feedback||q?.type!=='chain'||!Number.isInteger(index)||!q.steps[index]?.options.includes(value))return false;quiz.draft[index]=value;save();return true}
 function clueText(q){return q.type==='short'?`Svaret börjar med ”${q.answer.slice(0,2)}…”. Tänk på ${content.chapters[(q.storyChapter||current().id)-1].title.toLowerCase()}.`:`Börja med första ledet: ${q.steps[0].connector} ${q.steps[0].answer}. Fundera sedan på vad det leder till.`}
 function hint(){const quiz=currentQuiz(),q=question();if(!quiz||!q||quiz.kind!=='story'||quiz.feedback)return{ok:false,reason:'unavailable'};
  if(quiz.clue)return{ok:true,text:quiz.clue,alreadyPaid:true};
  if(!state.inventory.apple)return{ok:false,reason:'no-apple'};
  state.inventory.apple--;if(!state.inventory.apple)delete state.inventory.apple;
  quiz.hint=true;quiz.clue=clueText(q);save();return{ok:true,text:quiz.clue};
 }
 function record(q,correct,response,supported,source){
  const timestamp=now();state.practice[q.id]=practice.review(state.practice[q.id],correct,supported,timestamp);
  const old=state.answers[q.id]||{},s={...old,attempts:bounded(old.attempts)+1,correct:bounded(old.correct)+(correct?1:0),missed:bounded(old.missed)+(correct?0:1),supported:bounded(old.supported)+(supported?1:0),lastCorrect:correct,lastSupported:supported,lastResponse:(Array.isArray(response)?response.join(' → '):String(response??'')).slice(0,1000),lastDay:state.day,lastSource:source};
  if(!old.attempts){s.firstCorrect=correct;s.firstSupported=supported}state.answers[q.id]=s;
  state.history.push({id:q.id,missionId:q.missionId,day:state.day,correct,supported,source,at:timestamp,response:s.lastResponse});state.history=state.history.slice(-700);
  if(!correct&&!state.gaps.includes(q.id))state.gaps.push(q.id);if(correct)state.gaps=state.gaps.filter(id=>id!==q.id);
 }
 function answer(value,{supported=false}={}){const quiz=currentQuiz(),q=question();if(!quiz||!q||quiz.feedback)return{ok:false,reason:'no-question'};
  if(q.type==='short'&&!String(value??'').trim())return{ok:false,reason:'empty'};
  if(q.type==='chain'&&(!Array.isArray(value)||value.length!==3||!q.steps.every((_,i)=>typeof value[i]==='string'&&value[i])))return{ok:false,reason:'incomplete'};
  const aided=supported||quiz.hint||q.type==='chain'||quiz.optionsShown,correct=grade(q,value);
  record(q,correct,value,aided,quiz.kind==='story'?'job':quiz.kind,now());
  if(correct&&!quiz.failed&&!quiz.hint&&!(q.type==='short'&&quiz.optionsShown))quiz.correct++;if(!correct)quiz.failed=true;quiz.feedback={question:q.id,correct,explanation:q.explanation};
  // Once feedback has shown the answer, a retry is not an independent recall.
  if(!correct)quiz.hint=true;save();return{ok:true,correct};
 }
 function retry(){const quiz=currentQuiz();if(!quiz?.feedback||quiz.feedback.correct)return false;quiz.feedback=null;quiz.draft=[];save();return true}
 function nextQuestion(){const quiz=currentQuiz();if(!quiz?.feedback?.correct)return{ok:false,reason:'answer-first'};
  if(quiz.index<quiz.ids.length-1){quiz.index++;quiz.feedback=null;quiz.hint=false;quiz.failed=false;quiz.optionsShown=false;quiz.draft=[];delete quiz.clue;if(quiz.kind==='story')introduce(quiz.ids[quiz.index]);save();return{ok:true,finished:false}}
  if(quiz.kind!=='story')return finishReview(quiz);
  const a=active(),l=level();a.quiz=null;a.phase=l.materials?'materials':l.puzzle&&!a.puzzleSolved?'puzzle':l.handoffs.length?'handoff':'deliver';world().screen='place';save();return{ok:true,finished:true,phase:a.phase};
 }
 function placeMaterial(id){if(!active()||active().phase!=='materials'||world().scene!=='print'||!['ink','paper','type'].includes(id)||world().placed.includes(id))return false;world().placed.push(id);state.workshop={...object(state.workshop),placed:[...world().placed],collected:[...world().placed]};save();return true}
 function print(){const a=active(),l=level();if(!a||a.phase!=='materials'||world().scene!=='print'||world().placed.length!==3)return false;a.phase=l.handoffs.length?'handoff':'deliver';state.workshop={...object(state.workshop),printed:true,printCount:bounded(state.workshop?.printCount)+1};save();return true}
 function puzzle(value){const a=active(),l=level();if(!a||a.phase!=='puzzle'||world().scene!==l.work)return{ok:false};const correct=value===(l.puzzle==='finland'?'russia':'joined');if(correct){a.puzzleSolved=true;a.phase=l.handoffs.length?'handoff':'deliver';save()}return{ok:true,correct}}
 function handoff(place){const a=active(),l=level();if(!a||a.phase!=='handoff'||target()!==place||world().scene!==place)return false;a.handoff++;if(a.handoff>=l.handoffs.length)a.phase='deliver';save();return true}
 function deliver(place){const a=active(),l=level(),c=current();if(!a||a.phase!=='deliver'||place!==l.recipient||world().scene!==place)return{ok:false,reason:'place'};
  const repeating=a.repeat,pay=repeating?2:l.level+1;state.coins+=pay;state.time++;if(state.time>4){state.time=0;state.day++}
  if(!repeating){progress().done=l.level;if(!world().effects.includes(l.id))world().effects.push(l.id);}
  state.workSessions.push({missionId:cards.get(l.ids[0]).missionId,storyChapter:c.id,stage:['facts','journey','master'][l.level-1],at:now(),pay,repeat:repeating});state.workSessions=state.workSessions.slice(-100);
  if(c.id===1&&l.level===3)state.workshop={...object(state.workshop),delivered:true};
  if(l.materials)world().placed=[];
  progress().active=null;save();return{ok:true,pay,chapterComplete:progress().done===3,allComplete:chapters.every(x=>world().jobs[x.id]?.done===3),text:repeating?'Tack! Det nya arbetspasset är klart.':l.result};
 }
 function setChapter(id,{unlock=false}={}){if(!Number.isInteger(id)||id<1||id>10||id>world().unlocked)return false;if(world().review)return false;world().chapter=id;world().scene='town';world().screen='place';world().workMode='story';state.chapter=id<=4?1:2;state.unlockedChapter=Math.max(state.chapter,state.unlockedChapter);save();return true}
 function beginGateExam(){if(world().review)return{ok:false,reason:'busy'};const c=current();if(progress().done<1)return{ok:false,reason:'apprentice'};if(c.id===10)return{ok:false,reason:'last'};if(world().unlocked>c.id)return{ok:true,already:true};const ids=shuffle(c.levels[0].ids.filter(id=>cards.get(id)?.type==='short'),rng).slice(0,Math.min(5,c.levels[0].ids.length));if(!ids.length)return{ok:false,reason:'no-questions'};world().review={kind:'gate',ids,index:0,correct:0,hint:false,optionsShown:false,draft:[],feedback:null,startedAt:now()};world().workMode='gate';world().screen='work';save();return{ok:true}}
 function reviewIds(){const known=world().known.filter(id=>cards.get(id)?.type==='short');return shuffle(known,rng).sort((a,b)=>score(b)-score(a)||(state.practice[a]?.lastReviewedAt||0)-(state.practice[b]?.lastReviewedAt||0)).slice(0,6)}
 function beginReview(){if(world().review){world().workMode=world().review.kind;world().screen='work';save();return{ok:true,resumed:true}}
  const ids=reviewIds();if(!ids.length)return{ok:false,reason:'no-topics'};
  world().review={kind:'review',ids,index:0,correct:0,hint:false,optionsShown:false,draft:[],feedback:null,startedAt:now()};world().workMode='review';world().screen='work';save();return{ok:true};
 }
 function promotionStage(id){if(bank.sourcePolicy)return null;const m=bank.missions.find(x=>x.id===id),c=state.careers[id]||{rank:1},facts=m?.cards.filter(q=>q.type==='short'&&(q.chapter||1)<=state.chapter)||[];
  if(!facts.length||!facts.every(q=>(state.practice[q.id]?.level||0)>=2&&state.practice[q.id]?.lastCorrect&&!state.practice[q.id]?.supported))return null;
  if(c.rank===1)return'journey';if(c.rank===2&&now()-c.promotedAt>=DAY&&facts.every(q=>state.practice[q.id]?.lastReviewedAt>=c.promotedAt+DAY))return'master';return null;
 }
 function beginPromotion(id){if(world().review)return{ok:false,reason:'busy'};const stage=promotionStage(id),m=bank.missions.find(x=>x.id===id);if(!stage)return{ok:false,reason:'not-ready'};const ids=m.cards.filter(q=>q.stage===stage&&(q.chapter||1)<=state.chapter).map(q=>q.id);if(!ids.length)return{ok:false};world().review={kind:'promotion',promotion:stage,missionId:id,ids,index:0,correct:0,hint:false,optionsShown:false,draft:[],feedback:null,startedAt:now()};world().workMode='promotion';world().screen='work';save();return{ok:true}}
 function finishReview(q){const passed=q.kind==='promotion'?q.correct===q.ids.length:q.correct>=Math.ceil(q.ids.length*.7),canReward=q.kind==='review'&&passed;let promoted=null,pay=0;
  if(canReward){state.inventory.apple=bounded(state.inventory.apple)+1;state.coins++;state.lastAppleAt=now();pay=1}
  if(q.kind==='promotion'&&passed){promoted=q.promotion==='journey'?2:3;state.careers[q.missionId]={rank:promoted,promotedAt:now()}}
  if(q.kind==='gate'&&passed)world().unlocked=Math.max(world().unlocked,Math.min(10,current().id+1));
   if(q.kind==='legacy'){const id=q.missionId;if(id&&!state.completed.includes(id)){state.completed.push(id);state.inventory[id]=1;pay=PAY[id]||5;state.coins+=pay}}
  state.reviewHistory.push({at:now(),correct:q.correct,total:q.ids.length,rewarded:canReward});state.reviewHistory=state.reviewHistory.slice(-50);
  world().review=null;world().workMode='story';world().screen='place';save();return{ok:true,finished:true,review:true,gate:q.kind==='gate',passed,pay,promoted,correct:q.correct,total:q.ids.length};
 }
 function cancelReview(){world().review=null;world().workMode='story';world().screen='place';save()}
 function pauseWork(){world().screen='place';save()}
 function item(){const a=active(),l=level();if(!a)return null;if(a.phase==='materials')return'Kontrollerat tryckmanus';if(l.materials&&a.phase==='handoff')return a.handoff===0?'Provtryck':'Majas godkännande';if(['handoff','deliver'].includes(a.phase))return l.artifact;if(l.carriedFromStart)return l.artifact;if(l.pickups.length&&a.pickup>0)return`Hämtat underlag till ${l.title.toLowerCase()}`;return null}
 function eat(id){if(!['apple','bread'].includes(id)||!state.inventory[id])return false;state.inventory[id]--;if(!state.inventory[id])delete state.inventory[id];state.food=Math.min(5,state.food+(id==='bread'?3:1));save();return true}
 function buyBread(){if(state.coins<3)return false;state.coins-=3;state.inventory.bread=bounded(state.inventory.bread)+1;save();return true}
 function reportCSV(){const rows=[['Alias','Avsnitt','Område','Fråga','Försök','Rätt','Fel','Första försöket rätt','Svar med stöd','Senaste svar','Senaste aktivitet','Repetitionsnivå','Nästa repetition']];for(const q of cards.values()){const s=state.answers[q.id]||{};rows.push([state.name,chapters.filter(c=>c.levels.some(l=>l.ids.includes(q.id))).map(c=>c.id).join(', '),q.topic,q.question,s.attempts||0,s.correct||0,s.missed||0,s.attempts?s.firstCorrect&&!s.firstSupported?'Ja':'Nej':'',s.supported||0,s.lastResponse||'',s.lastSource||'',state.practice[q.id]?.level||0,state.practice[q.id]?.nextDueAt?new Date(state.practice[q.id].nextDueAt).toISOString():''])}return'\uFEFF'+rows.map(r=>r.map(csvCell).join(';')).join('\r\n')}
 return{get state(){return state},content,save,world,current,progress,active,level,target,objective,availablePlaces,arrive,accept,pickup,beginWork,currentQuiz,question,showOptions,optionsCost,setDraft,hint,answer,retry,nextQuestion,placeMaterial,print,puzzle,handoff,deliver,setChapter,beginGateExam,reviewIds,beginReview,promotionStage,beginPromotion,cancelReview,pauseWork,item,eat,buyBread,reportCSV,replace(value){state=restore(value);save()},snapshot:()=>copy(state)};
}
