'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const BASE=window.CURRICULUM;
  const SAVE_KEY='uppdrag1700.adventure.v2';
  let cloudAccount=null;
  const saveKey=()=>cloudAccount?`${SAVE_KEY}.account.${cloudAccount}`:SAVE_KEY;
  const BANK_KEY='uppdrag1700.questions.v1';
  const TIME_NAMES=['Morgon','Förmiddag','Eftermiddag','Skymning','Natt'];
  const PAY={nature:4,farm:5,press:6,ideas:6,power:7,trade:8,king:9};
  const ITEM_INFO={
    apple:{name:'Äpple',icon:'🍎',detail:'Ge till en arbetsgivare eller använd som extra ledtråd i ett jobb.'},
    ink:{name:'Trycksvärta',icon:'◕',detail:'Använd på tryckpressen.'},
    paper:{name:'Papper',icon:'▱',detail:'Använd på tryckpressen.'},
    type:{name:'Blytyper',icon:'Aa',detail:'Använd på tryckpressen.'},
    proof:{name:'Provtryck',icon:'▤',detail:'Visa för Noor i kaffehuset.'},
    bread:{name:'Bröd',icon:'▰',detail:'Klicka igen för att äta. Ger +3 mättnad.'},
    nature:{name:'Pressad linnea',icon:'❧',detail:'Arbetsintyg från trädgården.'},
    farm:{name:'Kornax',icon:'♧',detail:'Arbetsintyg från gården.'},
    press:{name:'Tryckark',icon:'▤',detail:'Arbetsintyg från tryckeriet.'},
    ideas:{name:'Kaffehuspamflett',icon:'✧',detail:'Arbetsintyg från kaffehuset.'},
    power:{name:'Riksdagsprotokoll',icon:'♜',detail:'Arbetsintyg från riksdagen.'},
    trade:{name:'Lastmanifest',icon:'⚓',detail:'Arbetsintyg från hamnen.'},
    king:{name:'Kungligt brev',icon:'♛',detail:'Arbetsintyg från slottet.'}
  };
  const DAY_MS=86400000;
  const BOOK_GUIDES={
    nature:'Leta efter avsnittet om Linné, namngivning och vetenskap.',
    farm:'Leta efter avsnittet om livet på landsbygden, jordbruk och missväxt.',
    press:'Leta efter avsnittet om tryckfrihet, censur och offentlighetsprincipen.',
    ideas:'Leta efter avsnittet om upplysningen och franska revolutionen.',
    power:'Leta efter avsnittet om frihetstiden, riksdagen och de fyra stånden.',
    trade:'Leta efter avsnittet om Ostindiska kompaniet, handel och slaveri.',
    king:'Leta efter avsnittet om Gustav III och hur kungens makt förändrades.'
  };
  function bookGuide(id){return mission(id)?.bookReference||BOOK_GUIDES[id]||'Leta upp det aktuella avsnittet i SO-boken.'}
  const SCENE_FOR={nature:'garden',farm:'farm',press:'print',ideas:'coffee',power:'riksdag',trade:'harbor',king:'palace'};
  const MISSION_FOR=Object.fromEntries(Object.entries(SCENE_FOR).map(([m,s])=>[s,m]));
  const REACTIONS={
    nature:'Sam stirrar på etiketten. Sedan på dig. Sedan på etiketten igen. ”Jag tror att växten vissnade av svaret.”',
    farm:'Karin suckar så djupt att kvarnvingarna nästan börjar snurra. ”Det där vågar jag inte bygga skörden på.”',
    press:'Brita gäspar, lägger kinden mot korrekturet och somnar med ett litet moln av trycksvärta runt näsan.',
    ideas:'Noor lyfter kaffekoppen. ”Det svaret var starkare än kaffet, men betydligt mindre användbart.”',
    power:'Elias doppar pennan i bläck och skriver: ”Sökanden bör återkomma efter nästa undervisning.”',
    trade:'Jo lägger undan manifestet. ”Om jag skriver så där hamnar sidenet i Säffle och skeppet i en roddbåt.”',
    king:'Amira höjer ett ögonbryn. Vakten höjer två. Porten förblir mycket bestämt stängd.'
  };
  const JOB_LINES={
    nature:['Sam räcker fram en etikett som vinden försöker stjäla.','En kruka har tappat både namn och självförtroende.','Sam pekar på ett skåp med ordnade växtprover.','En professor muttrar om förnuft bakom en häck.','Tre anteckningar måste bindas ihop innan växten kan katalogiseras.'],
    farm:['Karin pekar ut över gårdarna.','Hon lägger handen på plogen.','Hon visar en nästan tom säck.','Ett brev från godsägaren nämner särskilda rättigheter.','Karin behöver skriva följderna i rätt ordning.'],
    press:['Brita håller upp en nytryckt förordning.','En rad har fastnat i pressen.','Ett myndighetsdokument ligger bakom lås.','Sättaren väntar på rätt rubrik.','Brita vill förklara varför insyn kan tygla makt.'],
    ideas:['Noor rullar ut ett brev från kontinenten.','Ett styrelsesätt saknar namn i marginalen.','Ett omvälvande ord har spillts ut med kaffet.','Brevets datum är avgörande.','Noor vill bygga ett samband utan att låtsas att en enda orsak förklarar allt.'],
    power:['Elias visar ett dokument där periodens namn saknas.','Han pekar mot den stora salen.','Två politiska grupper har blandats ihop i protokollet.','En köpman frågar vilket stånd han tillhör.','Elias behöver sammanfatta maktförskjutningen utan att kalla den modern demokrati.'],
    trade:['Jo pekar på ett sigill från ett handelskompani.','En låda te ska bokföras på rätt sida.','En svensk vara ska föras ut ur landet.','Ett kolonialt dokument använder människor som poster i en bok.','Manifestet måste visa vem som tjänade och vem som berövades frihet.'],
    king:['Amira håller upp ett porträtt av kungen.','Hon visar en rapport om ett maktövertagande.','Ett brev måste dateras till året då frihetstiden tog slut.','Ett andra brev kommer från operan.','Amira kräver ett korrekt samband innan porten öppnas.']
  };

  function clone(value){return JSON.parse(JSON.stringify(value))}
  let data=clone(BASE);
  function validBank(value){
    const ids=new Set;
    return !!value&&Array.isArray(value.missions)&&value.missions.length===BASE.missions.length&&BASE.missions.every(base=>{
      const mission=value.missions.find(m=>m&&m.id===base.id);
      return mission&&Array.isArray(mission.cards)&&mission.cards.length>0&&mission.cards.length<=20&&mission.cards.every(q=>{
        if(!q||typeof q.id!=='string'||ids.has(q.id)||typeof q.question!=='string'||typeof q.explanation!=='string')return false;
        ids.add(q.id);
        if(q.type==='short')return typeof q.answer==='string'&&Array.isArray(q.accept)&&q.accept.length>0&&Array.isArray(q.distractors)&&q.distractors.length===3;
        if(q.type==='chain')return Array.isArray(q.steps)&&q.steps.length===3&&q.steps.every(s=>s&&typeof s.answer==='string'&&Array.isArray(s.options)&&s.options.includes(s.answer));
        return false;
      });
    });
  }
  function applyBank(value){
    if(!validBank(value))return false;
    data=clone(BASE);
    for(const mission of data.missions){
      const incoming=value.missions.find(m=>m.id===mission.id);
      mission.cards=clone(incoming.cards);
      if(typeof incoming.bookReference==='string')mission.bookReference=incoming.bookReference;
      for(const q of mission.cards){if(q.learningHint!=null&&typeof q.learningHint!=='string')delete q.learningHint}
      if(Array.isArray(incoming.notes)&&incoming.notes.every(n=>typeof n==='string'))mission.notes=clone(incoming.notes);
    }
    return true;
  }
  const readStorage=key=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
  if(!window.__ADVENTURE_TEST__)applyBank(window.CUSTOM_BANK||readStorage(BANK_KEY));
  const mission=id=>data.missions.find(m=>m.id===id);
  const allCards=()=>data.missions.flatMap(m=>m.cards.map(q=>({...q,missionId:m.id,topic:m.title})));
  const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  function editDistance(a,b){const row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let prior=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const temp=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,prior+(a[i-1]!==b[j-1]));prior=temp}}return row[b.length]}
  function gradeShort(q,value){
    const raw=normalize(value);if(!raw||/\b(inte|ej|aldrig|not)\b/.test(raw))return false;
    const candidates=q.accept.map(normalize);if(candidates.includes(raw))return true;
    const clean=raw.replace(/^(det (ar|heter|kallas)|svaret ar|jag tror (att )?(det ar )?|ar|namnet ar|de hette) /,'');
    if(candidates.includes(clean))return true;
    if(/^\d+$/.test(clean))return false;
    const allowance=clean.length>=11?2:clean.length>=6?1:0;
    return !!allowance&&candidates.some(a=>a.length>=6&&!/\d/.test(a)&&editDistance(a,clean)<=allowance);
  }
  function gradeQuestion(q,value){return q.type==='chain'?Array.isArray(value)&&q.steps.every((s,i)=>s.answer===value[i]):gradeShort(q,value)}
  function blankState(){return{version:2,name:'',scene:'square',heroX:44,coins:0,food:2,maxFood:5,day:1,time:0,breadBought:false,breadEaten:false,completed:[],failedToday:[],inventory:{},working:null,answers:{},gaps:[],history:[],won:false,started:false,collapseCount:0,visits:{},practice:{},rehearsal:null,reviewHistory:[],lastAppleAt:null,hintCredits:{},workshop:{collected:[],placed:[],printed:false,delivered:false}}}
  let state=blankState();
  function loadState(value){
    const fresh=blankState();if(!value||value.version!==2)return fresh;
    const merged={...fresh,...value};
    merged.visits=value.visits&&typeof value.visits==='object'?value.visits:{};
    merged.practice=value.practice&&typeof value.practice==='object'?value.practice:{};
    merged.completed=Array.isArray(value.completed)?value.completed.filter(id=>!!mission(id)):[];
    merged.failedToday=Array.isArray(value.failedToday)?value.failedToday.filter(id=>!!mission(id)):[];
    merged.inventory=value.inventory&&typeof value.inventory==='object'?value.inventory:{};
    merged.hintCredits=value.hintCredits&&typeof value.hintCredits==='object'?value.hintCredits:{};
    merged.reviewHistory=Array.isArray(value.reviewHistory)?value.reviewHistory.slice(-50):[];
    merged.lastAppleAt=Number.isFinite(value.lastAppleAt)?value.lastAppleAt:null;
    const w=value.workshop||{};
    merged.workshop={collected:Array.isArray(w.collected)?[...new Set(w.collected.filter(id=>['ink','paper','type'].includes(id)))]:[],placed:Array.isArray(w.placed)?[...new Set(w.placed.filter(id=>['ink','paper','type'].includes(id)))]:[],printed:w.printed===true,delivered:w.delivered===true};
    const allowed=allCards().filter(q=>q.type==='short'&&merged.completed.includes(q.missionId)).map(q=>q.id);
    const r=value.rehearsal;
    merged.rehearsal=r&&Array.isArray(r.ids)&&r.ids.length>0&&r.ids.length<=6&&new Set(r.ids).size===r.ids.length&&r.ids.every(id=>allowed.includes(id))&&Number.isInteger(r.index)&&r.index>=0&&r.index<r.ids.length&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=r.index?{ids:r.ids,index:r.index,correct:r.correct,startedAt:Number(r.startedAt)||Date.now()}:null;
    merged.answers=value.answers&&typeof value.answers==='object'?value.answers:{};
    merged.gaps=Array.isArray(value.gaps)?value.gaps:[];merged.history=Array.isArray(value.history)?value.history:[];
    if(!['square','garden','farm','print','coffee','riksdag','harbor','palace'].includes(merged.scene))merged.scene='square';
    if(!merged.working||!mission(merged.working.missionId)||!Number.isInteger(merged.working.index)||merged.working.index<0||merged.working.index>=mission(merged.working.missionId).cards.length)merged.working=null;
    merged.food=Math.max(0,Math.min(merged.maxFood,Number(merged.food)||0));merged.coins=Math.max(0,Number(merged.coins)||0);merged.time=Math.max(0,Math.min(4,Number(merged.time)||0));
    return merged;
  }
  if(!window.__ADVENTURE_TEST__){state=loadState(readStorage(SAVE_KEY));if(window.UPPDRAG_PRACTICE)state.visits=window.UPPDRAG_PRACTICE.visit(state.visits)}
  function save(){if(window.__ADVENTURE_TEST__)return;try{localStorage.setItem(saveKey(),JSON.stringify(state));if(cloudAccount&&window.dispatchEvent)window.dispatchEvent(new CustomEvent('uppdrag-save'))}catch{showHint('Webbläsaren kunde inte spara. Hämta rapporten innan du stänger.')}}
  function addItem(id,quantity=1){state.inventory[id]=(state.inventory[id]||0)+quantity}
  function removeItem(id,quantity=1){state.inventory[id]=Math.max(0,(state.inventory[id]||0)-quantity);if(!state.inventory[id])delete state.inventory[id]}
  function objective(){
    if(state.won)return'Äventyret är löst. Minnesluckor kan fortfarande tränas.';
    if(!state.breadBought){if(state.coins<3)return'Skaffa arbete. Tjäna minst 3 daler.';return'Gå till bagaren på Stortorget och köp bröd.'}
    if(!state.breadEaten)return'Ät brödet i ränseln.';
    if(state.completed.length<data.missions.length)return`Samla arbetsintyg med kunskap: ${state.completed.length} / ${data.missions.length}.`;
    return'Använd de sju arbetsintygen på arkivbudet på Stortorget.';
  }
  function logicBeginJob(missionId){
    if(state.working||state.rehearsal)return{ok:false,reason:'busy'};
    if(!mission(missionId))return{ok:false,reason:'unknown'};
    if(state.completed.includes(missionId))return{ok:false,reason:'completed'};
    if(state.failedToday.includes(missionId))return{ok:false,reason:'locked'};
    if(state.time>=4)return{ok:false,reason:'night'};
    if(state.food<=0)return{ok:false,reason:'hungry'};
    state.food--;state.time++;state.working={missionId,index:0};save();return{ok:true};
  }
  function recordAnswer(q,correct,response,supported=false,source='job',now=Date.now()){
    if(window.UPPDRAG_PRACTICE)state.practice[q.id]=window.UPPDRAG_PRACTICE.review(state.practice[q.id],correct,supported,now);
    const s=state.answers[q.id]||{attempts:0,correct:0,missed:0,supported:0};
    if(!s.attempts){s.firstCorrect=correct;s.firstSupported=supported}
    s.attempts++;s.lastCorrect=correct;s.lastSupported=supported;s.lastResponse=Array.isArray(response)?response.join(' → '):String(response??'');s.lastDay=state.day;s.lastSource=source;
    if(correct)s.correct++;else s.missed++;if(supported)s.supported++;state.answers[q.id]=s;
    state.history.push({id:q.id,missionId:q.missionId||state.working?.missionId,day:state.day,correct,supported,source,at:now,response:s.lastResponse});state.history=state.history.slice(-700);
    if(!correct&&!state.gaps.includes(q.id))state.gaps.push(q.id);if(correct)state.gaps=state.gaps.filter(id=>id!==q.id);save();return s;
  }
  function logicAnswer(q,value,supported=q.type==='chain'){
    if(!state.working)return{ok:false,reason:'no-job'};
    const expected=mission(state.working.missionId).cards[state.working.index];
    if(!expected||q.id!==expected.id)return{ok:false,reason:'wrong-step'};
    supported=supported||state.working.hintUsed===true;
    const correct=gradeQuestion(q,value);recordAnswer({...q,missionId:state.working.missionId},correct,value,supported);
    if(!correct){const id=state.working.missionId;if(!state.failedToday.includes(id))state.failedToday.push(id);state.working=null;save();return{ok:true,correct:false,missionId:id,collapsed:state.food<=0&&state.coins<3&&!state.inventory.bread}}
    state.working.index++;state.working.hintUsed=false;
    const current=mission(state.working.missionId);
    if(state.working.index>=current.cards.length){const id=state.working.missionId;state.working=null;logicCompleteJob(id);return{ok:true,correct:true,completed:true,missionId:id}}
    save();return{ok:true,correct:true,completed:false,missionId:state.working.missionId,index:state.working.index};
  }
  function logicCompleteJob(id){
    if(state.completed.includes(id))return false;state.scene=SCENE_FOR[id]||state.scene;state.completed.push(id);state.coins+=PAY[id]||5;addItem(id);save();return true;
  }
  function logicBuyBread(){if(state.coins<3)return{ok:false,reason:'coins'};state.coins-=3;addItem('bread');state.breadBought=true;save();return{ok:true}}
  function logicEatBread(){if(!state.inventory.bread)return{ok:false,reason:'none'};if(state.food>=state.maxFood)return{ok:false,reason:'full'};removeItem('bread');state.food=Math.min(state.maxFood,state.food+3);state.breadEaten=true;save();return{ok:true}}
  function eligibleReviewCards(){return allCards().filter(q=>q.type==='short'&&state.completed.includes(q.missionId))}
  function reviewSelection(now=Date.now()){
    const candidates=shuffle(eligibleReviewCards()).sort((a,b)=>{
      const score=q=>{const p=state.practice[q.id]||{},a=state.answers[q.id]||{};return (p.nextDueAt<=now?100:0)+(p.lastCorrect===false||a.lastCorrect===false?40:0)+(p.lastReviewedAt==null?20:0)};
      return score(b)-score(a)||(state.practice[a.id]?.lastReviewedAt||0)-(state.practice[b.id]?.lastReviewedAt||0);
    });
    const selected=candidates.slice(0,6);
    const known=candidates.find(q=>state.practice[q.id]?.lastCorrect===true&&state.practice[q.id]?.nextDueAt>now);
    if(known&&selected.length>=3&&!selected.some(q=>q.id===known.id))selected[selected.length-1]=known;
    return selected.map(q=>q.id);
  }
  function logicBeginReview(now=Date.now()){
    if(state.working)return{ok:false,reason:'busy'};
    if(state.rehearsal)return{ok:true,resumed:true};
    const ids=reviewSelection(now);if(!ids.length)return{ok:false,reason:'no-topics'};
    state.rehearsal={ids,index:0,correct:0,startedAt:now};save();return{ok:true,total:ids.length};
  }
  function reviewQuestion(){const r=state.rehearsal;return r?allCards().find(q=>q.id===r.ids[r.index]):null}
  function logicReviewAnswer(value,now=Date.now()){
    const r=state.rehearsal,q=reviewQuestion();if(!r||!q)return{ok:false,reason:'no-review'};
    const correct=gradeShort(q,value);recordAnswer(q,correct,value,false,'review',now);
    if(correct)r.correct++;r.index++;
    if(r.index<r.ids.length){save();return{ok:true,correct,q,finished:false}}
    const total=r.ids.length,score=r.correct,passed=score>=Math.ceil(total*.7);
    const rewarded=passed&&(state.lastAppleAt===null||now-state.lastAppleAt>=DAY_MS);
    if(rewarded){addItem('apple');state.lastAppleAt=now}
    state.reviewHistory.push({at:now,correct:score,total,rewarded});state.reviewHistory=state.reviewHistory.slice(-50);
    state.rehearsal=null;save();return{ok:true,correct,q,finished:true,total,score,passed,rewarded};
  }
  function logicCancelReview(){state.rehearsal=null;save()}
  function logicOfferApple(id){
    if(!mission(id)||state.completed.includes(id))return{ok:false,reason:'no-job'};
    if(!state.inventory.apple)return{ok:false,reason:'no-apple'};
    removeItem('apple');state.hintCredits[id]=(state.hintCredits[id]||0)+1;save();return{ok:true};
  }
  function jobHint(q){
    if(q.learningHint)return q.learningHint;
    const answer=q.answer||'',first=answer.match(/[\p{L}\p{N}]/u)?.[0]||'?';
    return bookGuide(state.working?.missionId||q.missionId)+' Svaret börjar med ”'+first+'”.';
  }
  function logicJobHint(){
    const w=state.working;if(!w||w.hintUsed)return{ok:false,reason:'unavailable'};
    const q=mission(w.missionId).cards[w.index];if(q.type!=='short')return{ok:false,reason:'supported-already'};
    if(state.hintCredits[w.missionId]>0)state.hintCredits[w.missionId]--;
    else if(state.inventory.apple)removeItem('apple');
    else return{ok:false,reason:'no-apple'};
    w.hintUsed=true;save();return{ok:true,hint:jobHint(q)};
  }
  function logicCollect(id){
    const w=state.workshop;if(!['ink','paper','type'].includes(id))return{ok:false,reason:'unknown'};
    if(w.collected.includes(id)||w.printed)return{ok:false,reason:'collected'};
    w.collected.push(id);addItem(id);save();return{ok:true};
  }
  function logicPlace(id){
    if(!['ink','paper','type'].includes(id)||!state.inventory[id])return{ok:false,reason:'missing'};
    if(state.workshop.printed||state.workshop.placed.includes(id))return{ok:false,reason:'placed'};
    removeItem(id);state.workshop.placed.push(id);save();return{ok:true};
  }
  function logicPrint(){
    const w=state.workshop;if(w.printed)return{ok:false,reason:'printed'};
    if(!['ink','paper','type'].every(id=>w.placed.includes(id)))return{ok:false,reason:'missing'};
    w.printed=true;addItem('proof');save();return{ok:true};
  }
  function logicDeliverProof(){
    if(!state.inventory.proof||state.workshop.delivered)return{ok:false};
    removeItem('proof');state.workshop.delivered=true;state.hintCredits.ideas=(state.hintCredits.ideas||0)+1;save();return{ok:true};
  }
  function logicNewDay({collapsed=false}={}){state.day++;state.time=0;state.failedToday=[];state.working=null;state.food=Math.max(state.food,2);if(collapsed){state.coins=Math.max(0,state.coins-2);state.collapseCount++}save();return state}
  function reportRows(){return allCards().map(q=>({q,s:state.answers[q.id]||{attempts:0,correct:0,missed:0,supported:0}}))}
  function csvCell(value){let s=String(value??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return `"${s.replace(/"/g,'""')}"`}
  function reportCSV(){
    const rows=[['Alias','Dag','Uppdrag','Fråga','Försök','Rätt','Fel','Första försöket rätt','Stöd','Senaste svar','Senaste aktivitet']];
    for(const {q,s} of reportRows())rows.push([state.name,state.day,q.topic,q.question,s.attempts||0,s.correct||0,s.missed||0,s.attempts?s.firstCorrect?'Ja':'Nej':'',s.supported||0,s.lastResponse||'',s.lastSource==='review'?'Repetition':'Arbete']);
    return '\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n');
  }

  const LOCATIONS={
    square:{title:'Stortorget',subtitle:'Hungriga magar och stora planer',start:49,hotspots:[
      {id:'baker',label:'bagaren Marta',kind:'npc',defaultVerb:'talk',x:13,y:35,w:18,h:48,walk:25},
      {id:'notice',label:'anslagstavlan',kind:'object',defaultVerb:'look',x:35,y:38,w:10,h:33,walk:39},
      {id:'archive',label:'arkivbudet',kind:'npc',defaultVerb:'talk',x:48,y:48,w:9,h:32,walk:52},
      {id:'inn',label:'värdshuset Den Trötta Tuppen',kind:'door',defaultVerb:'use',x:64,y:22,w:17,h:57,walk:68},
      {id:'master',label:'läromästaren Rut',kind:'npc',defaultVerb:'talk',x:29,y:44,w:8,h:36,walk:33},
      {id:'oracle',label:'bokoraklets skrivbord',kind:'object',defaultVerb:'talk',x:4,y:60,w:8,h:24,walk:9},
      {id:'cart',label:'stadskärran',kind:'exit',defaultVerb:'use',x:82,y:49,w:17,h:34,walk:86}
    ]},
    garden:{title:'Botaniska trädgården',subtitle:'Ordning bland blad och latinska ord',start:12,mission:'nature',hotspots:[
      {id:'natureNpc',label:'trädgårdslärlingen Sam',kind:'npc',mission:'nature',defaultVerb:'talk',x:61,y:40,w:11,h:43,walk:64},
      {id:'flower',label:'den mycket självsäkra växten',kind:'object',defaultVerb:'look',x:35,y:55,w:13,h:25,walk:41},
      {id:'greenhouse',label:'orangeriet',kind:'object',defaultVerb:'look',x:14,y:20,w:30,h:54,walk:32},
      {id:'gardenExit',label:'grinden till Stortorget',kind:'exit',to:'square',defaultVerb:'use',x:89,y:31,w:10,h:55,walk:90}
    ]},
    farm:{title:'Byn och kvarnen',subtitle:'Skörden väntar inte på någon',start:89,mission:'farm',hotspots:[
      {id:'farmNpc',label:'bonden Karin',kind:'npc',mission:'farm',defaultVerb:'talk',x:57,y:43,w:10,h:39,walk:60},
      {id:'sack',label:'den nästan tomma säcken',kind:'object',defaultVerb:'look',x:44,y:63,w:9,h:19,walk:49},
      {id:'mill',label:'väderkvarnen',kind:'object',defaultVerb:'look',x:11,y:13,w:31,h:65,walk:33},
      {id:'farmExit',label:'vägen till Stortorget',kind:'exit',to:'square',defaultVerb:'use',x:91,y:47,w:9,h:38,walk:92}
    ]},
    print:{title:'Britas tryckeri',subtitle:'Blytyper, bläck och förbjudet gäspande',start:10,mission:'press',hotspots:[
      {id:'pressNpc',label:'boktryckaren Brita',kind:'npc',mission:'press',defaultVerb:'talk',x:67,y:39,w:11,h:43,walk:70},
      {id:'pressMachine',label:'tryckpressen',kind:'object',defaultVerb:'look',x:26,y:28,w:25,h:52,walk:47},
      {id:'inkPot',label:'burken med trycksvärta',kind:'object',defaultVerb:'take',collect:'ink',x:43,y:73,w:6,h:10,walk:47},
      {id:'paperStack',label:'pappershögen',kind:'object',defaultVerb:'take',collect:'paper',x:52,y:81,w:9,h:9,walk:56},
      {id:'typeCase',label:'kasten med blytyper',kind:'object',defaultVerb:'take',collect:'type',x:50,y:57,w:11,h:23,walk:55},
      {id:'printExit',label:'dörren till Stortorget',kind:'exit',to:'square',defaultVerb:'use',x:1,y:28,w:10,h:57,walk:8}
    ]},
    coffee:{title:'Kaffehuset Sista Ordet',subtitle:'Nya idéer och gammalt kaffe',start:11,mission:'ideas',hotspots:[
      {id:'ideasNpc',label:'brevskrivaren Noor',kind:'npc',mission:'ideas',defaultVerb:'talk',x:64,y:42,w:10,h:40,walk:67},
      {id:'pamphlets',label:'högen med pamfletter',kind:'object',defaultVerb:'look',x:43,y:58,w:13,h:21,walk:49},
      {id:'coffeePot',label:'kaffepannan',kind:'object',defaultVerb:'look',x:79,y:56,w:8,h:20,walk:80},
      {id:'coffeeExit',label:'dörren till Stortorget',kind:'exit',to:'square',defaultVerb:'use',x:1,y:26,w:10,h:59,walk:8}
    ]},
    riksdag:{title:'Riksdagshuset',subtitle:'Fyra stånd och fler papper än stolar',start:10,mission:'power',hotspots:[
      {id:'powerNpc',label:'riksdagsskrivaren Elias',kind:'npc',mission:'power',defaultVerb:'talk',x:63,y:42,w:10,h:41,walk:66},
      {id:'benches',label:'de fyra ståndens bänkar',kind:'object',defaultVerb:'look',x:26,y:48,w:28,h:29,walk:50},
      {id:'protocol',label:'det sönderrivna protokollet',kind:'object',defaultVerb:'look',x:49,y:63,w:10,h:15,walk:53},
      {id:'riksdagExit',label:'porten till Stortorget',kind:'exit',to:'square',defaultVerb:'use',x:1,y:28,w:10,h:57,walk:8}
    ]},
    harbor:{title:'Hamnen',subtitle:'Te, porslin och obekväma sanningar',start:9,mission:'trade',hotspots:[
      {id:'tradeNpc',label:'hamnskrivaren Jo',kind:'npc',mission:'trade',defaultVerb:'talk',x:58,y:43,w:10,h:40,walk:61},
      {id:'crates',label:'lådorna från Kina',kind:'object',defaultVerb:'look',x:39,y:58,w:16,h:22,walk:49},
      {id:'ship',label:'ostindiefararen',kind:'object',defaultVerb:'look',x:68,y:17,w:29,h:55,walk:80},
      {id:'harborExit',label:'gränden till Stortorget',kind:'exit',to:'square',defaultVerb:'use',x:1,y:33,w:9,h:50,walk:8}
    ]},
    palace:{title:'Slottets försal',subtitle:'Här väger ett årtal tyngre än en krona',start:10,mission:'king',hotspots:[
      {id:'kingNpc',label:'slottsbudet Amira',kind:'npc',mission:'king',defaultVerb:'talk',x:63,y:39,w:10,h:44,walk:66},
      {id:'portrait',label:'porträttet av Gustav III',kind:'object',defaultVerb:'look',x:37,y:16,w:18,h:35,walk:48},
      {id:'palaceDoor',label:'den kungliga porten',kind:'door',defaultVerb:'look',x:74,y:21,w:17,h:59,walk:78},
      {id:'palaceExit',label:'trappan till Stortorget',kind:'exit',to:'square',defaultVerb:'use',x:1,y:31,w:9,h:53,walk:8}
    ]}
  };

  function rect(ctx,x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
  function line(ctx,x1,y1,x2,y2,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
  function ellipse(ctx,x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
  function polygon(ctx,points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()}
  function text(ctx,value,x,y,size=20,color='#eee1bd',align='left',font='Georgia'){ctx.fillStyle=color;ctx.font=`${size}px ${font}`;ctx.textAlign=align;ctx.fillText(value,x,y);ctx.textAlign='left'}
  function sky(ctx,top,bottom){const g=ctx.createLinearGradient(0,0,0,470);g.addColorStop(0,top);g.addColorStop(1,bottom);ctx.fillStyle=g;ctx.fillRect(0,0,1280,720);ellipse(ctx,1040,110,49,49,'#dfbd6b99')}
  function cobbles(ctx,y=470,color='#a99978'){rect(ctx,0,y,1280,720-y,color);for(let yy=y;yy<720;yy+=28)for(let x=(yy/28%2)*22-20;x<1280;x+=44){ctx.strokeStyle='#756d5b55';ctx.strokeRect(x,yy,42,26)}}
  function building(ctx,x,y,w,h,wall='#b99668',roof='#803f32',timber=false){rect(ctx,x+8,y+12,w,h,'#1b1c1650');rect(ctx,x,y,w,h,wall);polygon(ctx,[[x-15,y],[x+w/2,y-95],[x+w+15,y]],roof);if(timber){for(let yy=y+18;yy<y+h;yy+=58)line(ctx,x,yy,x+w,yy,'#4c3b2d',9);for(let xx=x+20;xx<x+w;xx+=65)line(ctx,xx,y,xx,y+h,'#4c3b2d',8);line(ctx,x,y,x+w,y+h,'#4c3b2d',7);line(ctx,x+w,y,x,y+h,'#4c3b2d',7)}for(let xx=x+25;xx<x+w-18;xx+=66){rect(ctx,xx,y+30,30,42,'#51696b');rect(ctx,xx+4,y+34,10,15,'#d4b86899');line(ctx,xx+15,y+31,xx+15,y+71,'#ddcda3',2)}rect(ctx,x+w/2-27,y+h-76,54,76,'#40362b');ellipse(ctx,x+w/2+14,y+h-39,3,3,'#c6a156')}
  function person(ctx,x,y,color='#6e4d38',sleep=false,initial=''){ellipse(ctx,x+8,y+21,27,11,'#14181142');if(sleep){ctx.save();ctx.translate(x,y);ctx.rotate(.25);x=0;y=0}rect(ctx,x-14,y-67,28,62,color);polygon(ctx,[[x-20,y-10],[x+20,y-10],[x+14,y+22],[x-15,y+22]],'#2f3129');ellipse(ctx,x,y-82,16,20,'#c79f72');ellipse(ctx,x,y-99,19,8,'#393a2e');rect(ctx,x-24,y-100,48,5,'#393a2e');if(initial)text(ctx,initial,x,y-76,10,'#5d3727','center','system-ui');if(sleep){ctx.restore();text(ctx,'z',x+30,y-95,18,'#f0dca9');text(ctx,'Z',x+49,y-119,24,'#f0dca9')}}
  function tree(ctx,x,y,s=1){rect(ctx,x-8*s,y,16*s,95*s,'#66513a');ellipse(ctx,x,y-22*s,55*s,57*s,'#3f6443');ellipse(ctx,x-32*s,y-42*s,35*s,35*s,'#527851');ellipse(ctx,x+35*s,y-48*s,38*s,40*s,'#668456')}
  function sign(ctx,x,y,label){rect(ctx,x,y,7,110,'#594832');rect(ctx,x-55,y-7,118,38,'#a77b45');polygon(ctx,[[x+63,y-7],[x+82,y+12],[x+63,y+31]],'#a77b45');text(ctx,label,x+4,y+18,14,'#f2dfb4','center')}
  function crate(ctx,x,y,s=1){rect(ctx,x,y,65*s,47*s,'#916c42');line(ctx,x,y,x+65*s,y+47*s,'#c29b64',4);line(ctx,x+65*s,y,x,y+47*s,'#c29b64',4);ctx.strokeStyle='#5e482f';ctx.lineWidth=3;ctx.strokeRect(x,y,65*s,47*s)}
  function ship(ctx,x,y,s=1){polygon(ctx,[[x,y],[x+220*s,y],[x+180*s,y+65*s],[x+40*s,y+65*s]],'#65402e');line(ctx,x+110*s,y,x+110*s,y-210*s,'#4b3d2b',8);polygon(ctx,[[x+115*s,y-198*s],[x+115*s,y-30*s],[x+220*s,y-55*s]],'#ead7ad');polygon(ctx,[[x+105*s,y-183*s],[x+105*s,y-36*s],[x+24*s,y-62*s]],'#d4bd8d');line(ctx,x+5*s,y-2*s,x+221*s,y-2*s,'#d2a25a',6)}
  function pressMachine(ctx,x,y){rect(ctx,x,y,220,250,'#49392d');rect(ctx,x+18,y+18,184,27,'#8d6b45');rect(ctx,x+36,y+56,148,148,'#2a2922');rect(ctx,x+51,y+70,118,109,'#d5c399');for(let yy=y+80;yy<y+170;yy+=13)line(ctx,x+60,yy,x+158,yy,'#786e59',2);rect(ctx,x+26,y+204,168,23,'#9a7448');line(ctx,x+110,y+42,x+110,y-48,'#5a4430',9);line(ctx,x+110,y-45,x+198,y-45,'#6d5237',8);ellipse(ctx,x+200,y-45,15,15,'#b38a55')}
  function room(ctx,wall='#91785e',floor='#7d684f'){rect(ctx,0,0,1280,720,wall);for(let x=0;x<1280;x+=110)line(ctx,x,0,x,470,'#69584344',3);rect(ctx,0,465,1280,255,floor);for(let y=478;y<720;y+=35)line(ctx,0,y,1280,y,'#493d3255',2);for(let x=20;x<1280;x+=85)line(ctx,x,465,x-45,720,'#493d3244',2);rect(ctx,0,445,1280,25,'#4a3d2f')}
  function drawSquare(ctx,t,s){sky(ctx,'#6e858a','#c6b38b');ellipse(ctx,190,180,130,38,'#e2d3ad55');cobbles(ctx,455);building(ctx,-45,220,330,255,'#c49765','#6e362e',true);building(ctx,760,205,285,270,'#b78d5e','#593b30',true);building(ctx,1030,245,270,230,'#c5a577','#794335',true);rect(ctx,65,376,220,27,'#925431');polygon(ctx,[[65,376],[100,325],[250,325],[285,376]],'#e4c17b');for(let x=75;x<280;x+=35)rect(ctx,x,327,18,49,x%70?'#9d4938':'#e5c37c');text(ctx,'BRÖD',175,365,21,'#3f3427','center');person(ctx,260,520,'#80543e',false,'M');rect(ctx,413,360,126,180,'#87633e');for(let y=382;y<515;y+=34){line(ctx,423,y,528,y,'#d0b882',3);for(let x=430;x<520;x+=28)ellipse(ctx,x,y-8,4,4,'#ead8a9')}text(ctx,'ARBETE',476,350,17,'#f1dbac','center');person(ctx,635,548,'#4c6651',false,'A');rect(ctx,818,330,148,145,'#302c27');text(ctx,'DEN TRÖTTA',892,292,16,'#eed59c','center');text(ctx,'TUPPEN',892,314,21,'#d18b50','center');ellipse(ctx,895,288,18,13,'#9a4939');line(ctx,895,276,895,251,'#4f432f',4);rect(ctx,1045,555,170,35,'#725539');ellipse(ctx,1090,597,31,31,'#2e3028');ellipse(ctx,1172,597,31,31,'#2e3028');rect(ctx,1081,489,89,70,'#a27846');person(ctx,1122,515,'#72533b');sign(ctx,1040,390,'KARTA');ellipse(ctx,650,480,80,22,'#5a594955');ellipse(ctx,650,468,67,19,'#77795f');ellipse(ctx,650,461,49,15,'#5c8182');ellipse(ctx,650,451+Math.sin(t/700)*2,8,7,'#d9d0a9')}
  function drawGarden(ctx,t,s){sky(ctx,'#748f8b','#c7c696');rect(ctx,0,455,1280,265,'#778b5b');for(let x=0;x<1280;x+=36)line(ctx,x,455,x+150,720,'#57734944',2);building(ctx,90,255,370,205,'#99aaa0','#536e65');rect(ctx,110,275,330,155,'#75989a');for(let x=120;x<440;x+=50)line(ctx,x,276,x,430,'#e3dfbe99',3);for(let y=300;y<430;y+=45)line(ctx,111,y,439,y,'#e3dfbe99',3);for(let row=0;row<3;row++)for(let col=0;col<6;col++){rect(ctx,490+col*68,500+row*58,54,39,'#655b3c');for(let k=0;k<5;k++)ellipse(ctx,500+col*68+k*9,492+row*58-(k%2)*5,5,8,['#d9af5b','#9e5c4d','#e2d296'][k%3])}tree(ctx,1060,455,1.25);const failed=s.failedToday.includes('nature');person(ctx,795,550,'#526d4d',failed,'S');text(ctx,'ORANGERIUM',275,242,18,'#f1e7c5','center');rect(ctx,1180,300,20,265,'#5b4a34');for(let y=310;y<560;y+=35)line(ctx,1170,y,1230,y,'#bca879',5);line(ctx,1220,300,1220,565,'#5b4a34',20)}
  function drawFarm(ctx,t,s){sky(ctx,'#759093','#d2bb81');rect(ctx,0,430,1280,290,'#9b955d');for(let y=470;y<720;y+=55)for(let x=0;x<1100;x+=30)line(ctx,x,y,x+18,y-30,'#d5b568',3);rect(ctx,120,225,34,255,'#b49b70');polygon(ctx,[[65,235],[137,115],[210,235]],'#80644b');for(let a=0;a<4;a++){const angle=t/3000+a*Math.PI/2;line(ctx,137,185,137+Math.cos(angle)*112,185+Math.sin(angle)*112,'#dfd1aa',13)}building(ctx,830,300,330,190,'#9c654b','#6c352e');rect(ctx,873,375,110,115,'#46352d');for(let x=300;x<760;x+=70){rect(ctx,x,498,5,87,'#6b5134');line(ctx,x,505,x+55,530,'#c5a76c',6)}const failed=s.failedToday.includes('farm');person(ctx,735,562,'#76513c',failed,'K');ellipse(ctx,575,583,42,31,'#aa8b5e');line(ctx,553,560,590,604,'#d1b47a',3);text(ctx,'KVARNTORP',137,400,17,'#f1dfb9','center');sign(ctx,1190,440,'STADEN')}
  function drawPrint(ctx,t,s){room(ctx,'#8a7158','#6a5541');pressMachine(ctx,330,250);for(let i=0;i<5;i++){rect(ctx,730+i*82,230,68,270,'#5a4636');for(let y=250;y<485;y+=32){line(ctx,736+i*82,y,791+i*82,y,'#c2aa78',3);for(let x=741+i*82;x<790+i*82;x+=11)rect(ctx,x,y-18,7,14,['#b1935f','#6e6752','#d0b276'][i%3])}}rect(ctx,610,520,230,44,'#9f7a4d');for(let i=0;i<8;i++)rect(ctx,625+i*25,525,18,33,'#d3c4a4');const failed=s.failedToday.includes('press');person(ctx,880,563,'#784c3b',failed,'B');rect(ctx,0,205,95,360,'#39342e');ellipse(ctx,78,385,5,5,'#c6a05a');text(ctx,'BRITAS TRYCKERI',600,100,28,'#ead7ad','center');for(let i=0;i<10;i++)ellipse(ctx,270+i*83,160+Math.sin(i+t/900)*8,2,2,'#27262055')}
  function drawCoffee(ctx,t,s){room(ctx,'#735a49','#654d39');rect(ctx,0,0,1280,170,'#3f3c32');for(let i=0;i<4;i++){ellipse(ctx,255+i*220,520,88,29,'#3e3228');rect(ctx,248+i*220,520,14,130,'#513e2e');ellipse(ctx,255+i*220,501,75,20,'#a4794c')}for(let i=0;i<5;i++)ellipse(ctx,205+i*220,488,10,12,'#d9bf8d');rect(ctx,1015,250,180,300,'#49392e');for(let y=280;y<530;y+=43){line(ctx,1025,y,1185,y,'#ba9b63',4);for(let x=1035;x<1180;x+=34)rect(ctx,x,y-25,24,20,'#d6c395')}const failed=s.failedToday.includes('ideas');person(ctx,820,565,'#6b4e3f',failed,'N');rect(ctx,545,535,150,25,'#9a7448');for(let i=0;i<4;i++){rect(ctx,560+i*27,515-i*3,72,6,['#e0c99c','#b78d61'][i%2])}text(ctx,'SISTA ORDET',640,123,28,'#e4c98e','center');for(let i=0;i<4;i++){const y=200+i*30;text(ctx,'~',900+i*8,y+Math.sin(t/600+i)*7,25,'#bba47b55')};rect(ctx,0,200,98,365,'#332d29')}
  function drawRiksdag(ctx,t,s){room(ctx,'#8b806a','#786a52');rect(ctx,130,80,1020,305,'#77745f');for(let x=170;x<1120;x+=105){rect(ctx,x,105,76,180,'#c2af82');line(ctx,x+38,105,x+38,285,'#867851',3)}text(ctx,'RIKETS FYRA STÅND',640,60,25,'#eadab4','center');const benchColors=['#7e4c3b','#536d58','#6e5d76','#98733f'];for(let row=0;row<4;row++){rect(ctx,200+row*45,455+row*47,620-row*90,28,benchColors[row]);for(let x=220+row*45;x<790-row*45;x+=60)rect(ctx,x,483+row*47,9,35,'#4b3c2c')}const failed=s.failedToday.includes('power');person(ctx,840,575,'#52634e',failed,'E');rect(ctx,755,562,160,26,'#9b784a');rect(ctx,795,510,65,52,'#d7c69e');rect(ctx,0,210,100,355,'#3b342d')}
  function drawHarbor(ctx,t,s){sky(ctx,'#72898d','#d1b88b');rect(ctx,0,500,1280,220,'#88745a');for(let x=0;x<1280;x+=55)line(ctx,x,500,x,720,'#594b3b55',3);rect(ctx,760,325,520,175,'#4f777b');for(let y=350;y<500;y+=24)line(ctx,760,y+Math.sin(t/550+y)*4,1280,y,'#b0c4b055',3);ship(ctx,860,420,.95);for(let i=0;i<5;i++)crate(ctx,350+(i%3)*74,510+Math.floor(i/3)*52,.95);building(ctx,-30,270,300,230,'#a2815e','#6c4135');text(ctx,'MAGASIN',118,326,21,'#f1ddb1','center');const failed=s.failedToday.includes('trade');person(ctx,705,575,'#566c67',failed,'J');rect(ctx,650,557,120,28,'#987143');rect(ctx,670,530,73,27,'#d8c59c');rect(ctx,0,260,74,340,'#342f2a')}
  function drawPalace(ctx,t,s){room(ctx,'#a0896b','#837058');for(let x=120;x<1200;x+=180){rect(ctx,x,80,66,390,'#d9c79d');ellipse(ctx,x+33,80,36,19,'#e7d9b7');ellipse(ctx,x+33,470,40,16,'#64523d')}rect(ctx,415,70,250,270,'#5b4737');rect(ctx,430,85,220,240,'#9b7551');ellipse(ctx,540,185,65,83,'#c99c6e');polygon(ctx,[[480,300],[600,300],[570,220],[510,220]],'#5a765d');ellipse(ctx,540,98,55,20,'#372f27');text(ctx,'GUSTAV III',540,365,18,'#e9d5aa','center');rect(ctx,920,135,250,335,'#43372f');for(let x=950;x<1140;x+=47)rect(ctx,x,160,18,260,'#d2b574');text(ctx,'KUNGLIG PORT',1045,120,18,'#eed8a9','center');const failed=s.failedToday.includes('king');person(ctx,800,567,'#725148',failed,'A');rect(ctx,0,225,95,345,'#3c342d');ellipse(ctx,805,450,70,15,'#e3c98733')}
  function drawExtras(ctx,id,s,t){
    if(id==='square'){
      person(ctx,407,563,'#514b72',false,'R');text(ctx,'LÄROMÄSTARE',402,462,14,'#f0d8a2','center');
      rect(ctx,47,550,93,20,'#715539');rect(ctx,71,531,43,19,'#e8d8b3');text(ctx,'SO-BOKEN',94,510,13,'#eed7a0','center');
    }
    if(id==='print'){
      if(!s.workshop.collected.includes('ink')){ellipse(ctx,587,576,24,11,'#221f24');rect(ctx,565,553,44,22,'#383438');text(ctx,'BLÄCK',586,543,11,'#e8d3a5','center')}
      if(!s.workshop.collected.includes('paper')){for(let i=0;i<4;i++)rect(ctx,692+i*2,578-i*5,96,6,'#f0dfb7');text(ctx,'PAPPER',739,546,11,'#e8d3a5','center')}
      const n=s.workshop.placed.length;text(ctx,s.workshop.printed?'PROVTRYCKET ÄR KLART':n+' / 3 DELAR I PRESSEN',470,650,17,'#f0d8a2','center');
      if(n)rect(ctx,394,330,97,55,'#d9c59c');
      if(s.workshop.printed)text(ctx,'TRYCKFRIHET',443,363,13,'#342b24','center');
    }
  }
  function renderScene(ctx,id,s=state,t=0){ctx.clearRect(0,0,1280,720);({square:drawSquare,garden:drawGarden,farm:drawFarm,print:drawPrint,coffee:drawCoffee,riksdag:drawRiksdag,harbor:drawHarbor,palace:drawPalace}[id]||drawSquare)(ctx,t,s);drawExtras(ctx,id,s,t);const g=ctx.createLinearGradient(0,0,0,720);g.addColorStop(0,'#16191413');g.addColorStop(.72,'#11130c00');g.addColorStop(1,'#11130c55');ctx.fillStyle=g;ctx.fillRect(0,0,1280,720)}

  const coreApi={
    get state(){return state},get data(){return data},blankState,loadState,validBank,applyBank,allCards,mission,
    bookGuide,eligibleReviewCards,reviewSelection,logicBeginReview,reviewQuestion,logicReviewAnswer,logicCancelReview,logicOfferApple,logicJobHint,logicCollect,logicPlace,logicPrint,logicDeliverProof,
    normalize,gradeShort,gradeQuestion,logicBeginJob,logicAnswer,logicCompleteJob,logicBuyBread,logicEatBread,logicNewDay,
    reportCSV,reportRows,csvCell,renderScene,
    setState(value){state=loadState(value)},resetData(){data=clone(BASE)}
  };
  window.__adventure=coreApi;
  if(window.__ADVENTURE_TEST__)return;

  const canvas=$('scene'),ctx=canvas.getContext('2d'),hero=$('hero');
  let activeVerb=null,selectedItem=null,moveTimer=null,moveFinish=null,hintTimer=null,narrationTimer=null;
  let activeQuestion=null,activeReviewId=null,currentTarget=null,playing=state.started;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const VERBS={look:'Titta på',talk:'Prata med',take:'Ta',use:'Använd'};
  const OBJECT_TEXT={
    flower:'Den ser ut att veta exakt vilken art den tillhör. Den tänker inte berätta det gratis.',
    greenhouse:'Glasrutorna fångar solen. Där inne ordnas naturen i raka rader, trots naturens tydliga protester.',
    sack:'Säcken innehåller tre korn, två strån och en oroande mängd luft.',
    mill:'Vingarna går runt. Det gör inte skörden.',
    pressMachine:'En träpress. Den kan sprida idéer snabbare än någon människa kan springa efter dem.',
    typeCase:'Varje bokstav ligger i sitt fack. Ett enda misstag och ”tryckfrihet” blir ”tryckfiskhet”.',
    pamphlets:'Pamfletter fulla av argument, invändningar och kaffefläckar. Mest kaffefläckar.',
    coffeePot:'Kaffet är så starkt att det verkar ha egna upplysningsidéer.',
    benches:'Fyra grupper, fyra bänkar och en enorm mängd oenighet.',
    protocol:'Protokollet har fler överstrykningar än hela ditt skrivhäfte.',
    crates:'Te, siden och porslin. Lådorna säger ingenting om vilka människor som betalade det verkliga priset.',
    ship:'Ett stort skepp byggt för långväga handel. Vinsterna och riskerna hamnade inte hos samma människor.',
    portrait:'Kungen tittar ner på dig som om han redan känner till ditt svar.',
    palaceDoor:'Porten är byggd av ek, järn och mycket höga tankar om sig själv.'
  };

  function updateHUD(){
    const loc=LOCATIONS[state.scene];$('placeName').textContent=loc.title;$('objectiveText').textContent=objective();
    $('foodValue').textContent=`${state.food} / ${state.maxFood}`;$('coinValue').textContent=state.coins;$('timeValue').textContent=TIME_NAMES[state.time]||'Natt';
    $('sceneTitle').innerHTML=`<span>${esc(loc.title.toUpperCase())}</span><small>${esc(loc.subtitle)}</small>`;
    renderInventory();renderHotspots();hero.style.setProperty('--x',`${state.heroX}%`);save();
  }
  function renderInventory(){
    const entries=Object.entries(state.inventory).filter(([,q])=>q>0);
    $('inventory').innerHTML=entries.length?entries.map(([id,q])=>{const info=ITEM_INFO[id]||{name:id,icon:'◇',detail:''};return `<button class="inventory-item ${selectedItem===id?'selected':''}" data-item="${esc(id)}" title="${esc(info.detail)}"><span class="item-icon">${info.icon}</span><b>${esc(info.name)}${q>1?` ×${q}`:''}</b><small>${esc(info.detail)}</small></button>`}).join(''):'<span class="empty-inventory">Tom. Obehagligt tom.</span>';
    for(const button of document.querySelectorAll('[data-item]'))button.onclick=()=>selectItem(button.dataset.item);
    $('inventoryHint').textContent=selectedItem?`${ITEM_INFO[selectedItem]?.name||selectedItem} valt. Klicka på något i scenen.`:'Välj ett föremål och klicka på något i scenen.';
  }
  function renderHotspots(){
    const loc=LOCATIONS[state.scene];$('hotspotLayer').innerHTML=loc.hotspots.filter(h=>!h.collect||!state.workshop.collected.includes(h.collect)).map(h=>`<button class="hotspot ${h.kind==='exit'?'exit':''}" data-hotspot="${h.id}" data-label="${esc(h.label)}" aria-label="${esc((h.defaultVerb==='talk'?'Prata med ':h.defaultVerb==='take'?'Ta ':h.defaultVerb==='look'?'Titta på ':'Gå till ')+h.label)}" style="left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%"></button>`).join('');
    for(const button of document.querySelectorAll('[data-hotspot]')){
      const h=loc.hotspots.find(x=>x.id===button.dataset.hotspot);button.onclick=e=>{e.stopPropagation();handleHotspot(h)};button.onmouseenter=()=>previewAction(h);button.onfocus=()=>previewAction(h);button.onmouseleave=clearPreview;button.onblur=clearPreview;
    }
  }
  function previewAction(h){const verb=selectedItem?'use':activeVerb||h.defaultVerb||'look';$('sentenceVerb').textContent=selectedItem?`Använd ${ITEM_INFO[selectedItem]?.name||selectedItem} på`:VERBS[verb]||'Gå till';$('sentenceTarget').textContent=h.label}
  function clearPreview(){if(!currentTarget){$('sentenceVerb').textContent=activeVerb?VERBS[activeVerb]:'Gå till';$('sentenceTarget').textContent='…'}}
  function selectItem(id){
    if(selectedItem===id){if(id==='bread'){eatBreadUI();return}narrate(ITEM_INFO[id]?.detail||'Ett föremål.');selectedItem=null;activeVerb=null;updateVerbButtons();renderInventory();return}
    selectedItem=id;activeVerb='use';updateVerbButtons();renderInventory();showHint(id==='bread'?'Brödet är valt. Klicka på det igen för att äta.':'Föremålet är valt. Klicka på något i scenen för att använda det.')
  }
  function updateVerbButtons(){for(const button of document.querySelectorAll('[data-verb]'))button.classList.toggle('active',button.dataset.verb===activeVerb);clearPreview()}
  for(const button of document.querySelectorAll('[data-verb]'))button.onclick=()=>{selectedItem=null;activeVerb=activeVerb===button.dataset.verb?null:button.dataset.verb;updateVerbButtons();renderInventory()};

  function walkTo(x,then){
    if(moveTimer)finishWalk();currentTarget=true;const distance=Math.abs(state.heroX-x);state.heroX=x;hero.style.setProperty('--x',`${x}%`);hero.classList.add('walking');$('skipWalk').hidden=distance<25||reduced;moveFinish=then;
    moveTimer=setTimeout(finishWalk,reduced?20:Math.min(1050,300+distance*11));
  }
  function finishWalk(){if(moveTimer){clearTimeout(moveTimer);moveTimer=null}hero.classList.remove('walking');$('skipWalk').hidden=true;const fn=moveFinish;moveFinish=null;currentTarget=null;state.heroX=parseFloat(hero.style.getPropertyValue('--x'))||state.heroX;save();fn?.()}
  $('skipWalk').onclick=finishWalk;
  canvas.onclick=e=>{if(!playing||!$('dialogue').hidden||$('modal').open)return;const r=canvas.getBoundingClientRect(),x=Math.max(4,Math.min(96,(e.clientX-r.left)/r.width*100));activeVerb=null;selectedItem=null;updateVerbButtons();renderInventory();walkTo(x)};

  function handleHotspot(h){
    if(state.working){resumeWork();return}
    if(state.rehearsal){showReviewQuestion();return}
    if(!playing||!$('dialogue').hidden||$('modal').open)return;const verb=selectedItem?'use':activeVerb||h.defaultVerb||'look';currentTarget=h;previewAction(h);
    walkTo(h.walk??(h.x+h.w/2),()=>performAction(h,verb));
  }
  function performAction(h,verb){
    const item=selectedItem;activeVerb=null;selectedItem=null;updateVerbButtons();renderInventory();
    if(h.kind==='exit'&&(verb==='use'||verb==='look')){if(h.to)travel(h.to);else showMap();return}
    if(h.id==='master'){talkMaster();return}
    if(h.id==='oracle'){showOracle();return}
    if(h.id==='pressMachine'){if(verb==='use'&&item){const r=logicPlace(item);updateHUD();narrate(r.ok?ITEM_INFO[item].name+' är på plats. Pressen gnisslar uppskattande.':'Pressen behöver blytyper, papper och trycksvärta.');return}showPressPuzzle();return}
    if(h.collect){if(verb==='take'){const r=logicCollect(h.collect);updateHUD();narrate(r.ok?'Du lägger '+ITEM_INFO[h.collect].name.toLowerCase()+' i ränseln. Använd det på pressen.':'Det föremålet är redan hämtat.');return}narrate('Det här kan du faktiskt ta. Välj Ta och stoppa det i ränseln.');return}
    if(h.mission&&item==='apple'){const r=logicOfferApple(h.mission);updateHUD();showDialogue(mission(h.mission).npc,r.ok?'”Ett äpple! Jag erbjuder en extra ledtråd i ditt nästa arbetsmoment. Du måste fortfarande svara själv.”':'”Spara äpplet till ett arbete som återstår.”',[{label:'Då pratar vi om jobbet.',fn:()=>talkJob(h.mission),reply:true}]);return}
    if(h.mission==='ideas'&&item==='proof'){const r=logicDeliverProof();updateHUD();showDialogue(mission('ideas').npc,r.ok?'”Ditt provtryck kan sätta fart på ett samtal. Du får en extra ledtråd här i kaffehuset.”':'”Jag har redan fått ditt provtryck.”',[{label:'Vad är ditt uppdrag?',fn:()=>talkJob('ideas'),reply:true}]);return}
    if(h.id==='cart'){showMap();return}
    if(h.id==='baker'){if(verb==='take')narrate('Marta flyttar brödet exakt en handlängd längre bort. ”Tre daler.”');else talkBaker();return}
    if(h.id==='archive'){if(verb==='use'&&item&&mission(item))tryFinish();else talkArchive();return}
    if(h.id==='inn'){talkInn();return}
    if(h.id==='notice'){showJobs();return}
    if(h.mission){if(verb==='talk'||verb==='use')talkJob(h.mission);else if(verb==='take')narrate('Det här är en människa, inte lösöre.');else narrate(`${mission(h.mission).npc} ser ut att ha ett riktigt problem — och möjligen ett avlönat arbete.`);return}
    if(verb==='take'){narrate('Det sitter fast i både golvet och samhällsstrukturen.');return}
    if(verb==='use'&&item){narrate(`${ITEM_INFO[item]?.name||'Föremålet'} och ${h.label} verkar inte ha något att säga varandra.`);return}
    narrate(OBJECT_TEXT[h.id]||`Du betraktar ${h.label}. Det betraktar inte dig tillbaka.`);
  }
  function travel(id){if(state.rehearsal){showReviewQuestion();return}if(state.working){resumeWork();return}if(!LOCATIONS[id])return;closeDialogue();closeModal();state.scene=id;state.heroX=LOCATIONS[id].start;activeVerb=null;selectedItem=null;save();updateVerbButtons();updateHUD();showSceneName();}
  function showSceneName(){$('sceneTitle').animate?.([{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}],{duration:350});}
  function showHint(message){$('hint').textContent=message;$('hint').hidden=false;clearTimeout(hintTimer);hintTimer=setTimeout(()=>$('hint').hidden=true,3800)}
  function narrate(message,duration=3000){$('narrationText').textContent=message;$('narration').hidden=false;clearTimeout(narrationTimer);narrationTimer=setTimeout(()=>$('narration').hidden=true,duration)}

  function showDialogue(speaker,text,actions=[],tone=''){
    const panel=$('dialogue');panel.hidden=false;panel.className=`dialogue ${tone}`;$('speaker').textContent=speaker.toUpperCase();$('portraitInitial').textContent=speaker.trim()[0]||'?';$('dialogueText').innerHTML=text;
    $('dialogueActions').innerHTML=actions.map((a,i)=>`<button id="dialogueAction${i}" class="${a.reply?'reply':''}">${a.label}</button>`).join('');actions.forEach((a,i)=>$('dialogueAction'+i).onclick=a.fn);keysOff();
  }
  function closeDialogue(){const panel=$('dialogue');panel.hidden=true;panel.className='dialogue';$('dialogueActions').innerHTML='';activeQuestion=null}
  $('dialogueClose').onclick=closeDialogue;
  function keysOff(){activeVerb=null;selectedItem=null;updateVerbButtons();renderInventory()}

  function showOracle(){
    openModal('BOKORAKLET','Den stora kunskapsboken finns hos dig', '<p class="lead">”Sök i din SO-bok. Jag visar vart du ska leta — svaret måste du finna själv.”</p><div class="quest-list">'+data.missions.map(m=>'<div class="quest-row"><span class="seal">'+m.symbol+'</span><span><b>'+esc(m.title)+'</b><small>'+esc(bookGuide(m.id))+'</small></span></div>').join('')+'</div><p class="small">Avsnitt anges tills läraren lagt in den riktiga bokens sidnummer. Hänvisningarna är gratis.</p>','oracle');
  }
  function talkMaster(){
    if(state.rehearsal){showReviewQuestion();return}
    const cards=eligibleReviewCards(),due=window.UPPDRAG_PRACTICE?.due(state.practice,cards.map(q=>q.id))||[];
    const remaining=state.lastAppleAt===null?0:Math.max(0,DAY_MS-(Date.now()-state.lastAppleAt));
    const prior=state.visits.previousVisitAt,days=prior?Math.max(0,Math.floor((Date.now()-prior)/DAY_MS)):null;
    const text='”Kunskap ska hämtas fram igen — inte bara förvaras som gammalt bröd.”<br><br>'+ (days!==null&&days>0?'Du var här för '+days+' dagar sedan.<br>':'')+cards.length+' fria frågor från '+state.completed.length+' avslutade uppdrag. '+due.length+' frågor är dags att repetera.<br><br>'+ (cards.length?'Förhöret innehåller högst sex frågor. Du får återkoppling efter varje svar. Ingen mat eller speltid förbrukas.':'Klara ett uppdrag först. Sedan repeterar vi just det området.')+'<br><br>'+ (remaining?'Du kan träna nu. Nästa äpple kan tjänas om ungefär '+Math.ceil(remaining/3600000)+' timmar.':'Minst 70 procent rätt ger ett äpple. Högst ett belönat förhör per verkligt dygn.');
    showDialogue('Läromästaren Rut',text,[
      ...(cards.length?[{label:'Förhör mig utan bok.',fn:()=>{const r=logicBeginReview();if(r.ok)showReviewQuestion()},reply:true}]:[]),
      {label:'Visa var jag kan läsa i SO-boken.',fn:showOracle,reply:true},
      {label:'Jag återkommer.',fn:closeDialogue,reply:true}
    ]);
  }
  function showReviewQuestion(){
    const q=reviewQuestion(),r=state.rehearsal;if(!q||!r){talkMaster();return}activeReviewId=q.id;
    state.scene='square';updateHUD();
    showDialogue('Läromästaren Rut','<span class="eyebrow">REPETITION '+(r.index+1)+' AV '+r.ids.length+'</span><b>'+esc(q.question)+'</b><p class="small">Försök ur minnet innan du öppnar boken. Fel låser inte förhöret.</p>',[]);
    $('dialogueActions').innerHTML='<input id="reviewAnswer" aria-label="Ditt repetitionssvar" autocomplete="off" spellcheck="false" maxlength="180" placeholder="Svara ur minnet …"><button type="button" id="submitReviewAnswer">Lämna svar →</button><button type="button" id="skipReviewAnswer" class="reply">Jag minns inte. Visa återkoppling.</button><button type="button" id="cancelReview" class="reply">Avsluta förhöret utan belöning.</button>';
    $('submitReviewAnswer').onclick=()=>submitReviewUI($('reviewAnswer').value);
    $('skipReviewAnswer').onclick=()=>submitReviewUI('');
    $('cancelReview').onclick=()=>{logicCancelReview();closeDialogue();updateHUD()};
    $('reviewAnswer').onkeydown=e=>{if(e.key==='Enter')submitReviewUI($('reviewAnswer').value)};setTimeout(()=>$('reviewAnswer')?.focus(),0);
  }
  function submitReviewUI(value){
    if(!activeReviewId||reviewQuestion()?.id!==activeReviewId)return;activeReviewId=null;
    const r=logicReviewAnswer(value);if(!r.ok)return;updateHUD();
    const feedback=(r.correct?'Rätt. ':'Inte ännu. Rätt svar är <b>'+esc(r.q.answer)+'</b>. ')+esc(r.q.explanation)+'<p class="small">'+esc(bookGuide(r.q.missionId))+'</p>';
    const finish=()=>showDialogue('Läromästaren Rut','Du mindes <b>'+r.score+' av '+r.total+'</b> svar.<br><br>'+ (r.rewarded?'Ett äpple ligger nu i ränseln. Ge det till en arbetsgivare eller använd det för en extra ledtråd i ett jobb.':r.passed?'Bra repetition. Ditt nästa belönade förhör öppnar efter ett verkligt dygn.':'Läs om avsnittet och prova igen. Du förlorade ingen mat.')+'<br><br><em>Att klara samma frågor igen i kväll räknas inte som spridd repetition.</em>',[{label:'Fortsätt äventyret.',fn:closeDialogue,reply:true},{label:'Besök bokoraklet.',fn:showOracle,reply:true}]);
    showDialogue('Läromästaren Rut',feedback,[{label:r.finished?'Se mitt resultat.':'Nästa minnesfråga →',fn:r.finished?finish:showReviewQuestion,reply:true}],r.correct?'feedback-good':'');
  }
  function showPressPuzzle(){
    const w=state.workshop,missing=['type','ink','paper'].filter(id=>!w.placed.includes(id));
    showDialogue('Den mycket högljudda pressen',w.printed?'Ditt första provtryck är klart. Visa det för Noor i kaffehuset för en extra ledtråd.':'Pressen behöver tre saker: blytyper, papper och trycksvärta. Ta dem i rummet, välj dem i ränseln och använd dem på pressen.<br><br>Återstår: <b>'+missing.map(id=>esc(ITEM_INFO[id].name)).join(', ')+'</b>.<p class="small">Det här är ett frivilligt miljöpussel. Du kan prata med Brita och arbeta direkt.</p>',[
      ...(!w.printed?[{label:'Dra i pressens handtag.',fn:()=>{const r=logicPrint();updateHUD();if(r.ok){narrate('DUNK! Pressen spottar ut ett provtryck.');showDialogue('Boktryckaren Brita','”Det blev ett blad! Ta det till Noor i kaffehuset. Och undvik att använda mer bläck än papper.”',[{label:'Provtrycket ligger i ränseln.',fn:closeDialogue,reply:true}])}else{showHint('Lägg blytyper, papper och trycksvärta i pressen först.');showPressPuzzle()}},reply:true}]:[]),
      {label:'Jag fortsätter utforska.',fn:closeDialogue,reply:true},
      {label:'Ge mig en tydlig ledtråd.',fn:()=>showDialogue('Boktryckaren Brita','”Ta blytyperna ur kasten, bläckburken och pappershögen. Klicka på ett föremål i ränseln och sedan på pressen. När alla tre är på plats drar du i handtaget.”',[{label:'Nu provar jag.',fn:closeDialogue,reply:true}]),reply:true}
    ]);
  }
  function showHintForJob(){
    const r=logicJobHint();if(!r.ok){showHint('Du behöver ett äpple eller en redan erbjuden ledtråd.');return}updateHUD();const w=state.working;showJobQuestion(w.missionId,w.index);
  }
  function talkJob(id){
    if(state.working){resumeWork();return}
    const m=mission(id);
    if(state.completed.includes(id)){showDialogue(m.npc,`”Arbetet är redan gjort. Ditt ${esc(ITEM_INFO[id].name.toLowerCase())} är bevis nog.”`,[{label:'Tack. Det känns ovanligt vuxet.',fn:closeDialogue,reply:true}]);return}
    if(state.failedToday.includes(id)){showDialogue(m.npc,`<em>${esc(REACTIONS[id])}</em><br><br>Arbetet är stängt för resten av speldagen. Svaret visas inte. Läs på och återvänd nästa dag.`,[{label:'Skriv upp kunskapsluckan.',fn:()=>{closeDialogue();showNotebook()},reply:true},{label:'Backa långsamt därifrån.',fn:closeDialogue,reply:true}],'feedback-asleep');return}
    if(state.time>=4){showDialogue(m.npc,'”Det är natt. Inte ens historien arbetar dygnet runt. Kom tillbaka i morgon.”',[{label:'Hitta värdshuset.',fn:()=>travel('square'),reply:true}]);return}
    if(state.food<=0){showDialogue(m.npc,'”Du ser ut som ett frågetecken med hatt. Ät något innan du arbetar.”',[{label:'Till Stortorget och bagaren.',fn:()=>travel('square'),reply:true}]);return}
    showDialogue(m.npc,`${esc(m.story)}<br><br><em>Jobbet kräver ${m.cards.length} kunskapssteg. Ett fel avslutar försöket för dagen. Facit visas inte.</em>`,[
      {label:`Jag tar jobbet. (−1 mättnad, tiden går)`,fn:()=>beginJobUI(id),reply:true},
      {label:'Vad får jag betalt?',fn:()=>showDialogue(m.npc,`”${PAY[id]} daler och ett förseglat arbetsintyg — om allt blir rätt.”`,[{label:'Då börjar vi.',fn:()=>beginJobUI(id),reply:true},{label:'Jag återkommer.',fn:closeDialogue,reply:true}]),reply:true},
      {label:'Var ska jag läsa i SO-boken?',fn:()=>showDialogue(m.npc,esc(bookGuide(id)),[{label:'Jag läser på och återkommer.',fn:closeDialogue,reply:true}]),reply:true},
      {label:'Jag behöver kunna mer först.',fn:closeDialogue,reply:true}
    ]);
  }
  function beginJobUI(id){const result=logicBeginJob(id);if(!result.ok){closeDialogue();talkJob(id);return}updateHUD();showJobQuestion(id,0)}
  function resumeWork(){const work=state.working;if(!work)return false;state.scene=SCENE_FOR[work.missionId]||state.scene;state.heroX=LOCATIONS[state.scene].start;updateHUD();showJobQuestion(work.missionId,work.index);showHint('Slutför momentet eller välj ”Jag kan inte detta än”.');return true}
  function showJobQuestion(id,index){
    const m=mission(id),q=m.cards[index];activeQuestion={id,index,q};const lead=JOB_LINES[id]?.[index]||'Arbetet fortsätter.';
    showDialogue(m.npc,`<span class="eyebrow">ARBETSMOMENT ${index+1} AV ${m.cards.length}</span>${esc(lead)}<br><br><b>${esc(q.question)}</b>`,[]);
    if(q.type==='short'){
      $('dialogueActions').innerHTML=`<input id="jobAnswer" autocomplete="off" spellcheck="false" maxlength="180" aria-label="Ditt svar" placeholder="Svara ur minnet …"><button id="submitJobAnswer">Utför momentet →</button><button id="giveUpJob" class="reply">Jag kan inte detta än. Avsluta jobbet.</button>`;
      if(state.working.hintUsed)$('dialogueText').innerHTML+='<p class="hint-note">'+esc(jobHint({...q,missionId:id}))+'</p>';
      else if(state.inventory.apple||state.hintCredits[id]>0){$('dialogueActions').innerHTML+='<button type="button" id="appleHint" class="reply">'+(state.hintCredits[id]>0?'Använd erbjuden ledtråd.':'Använd ett äpple för extra ledtråd.')+'</button>';$('appleHint').onclick=showHintForJob;}
      $('submitJobAnswer').onclick=()=>submitJobAnswer($('jobAnswer').value,false);$('giveUpJob').onclick=()=>submitJobAnswer('',false);$('jobAnswer').onkeydown=e=>{if(e.key==='Enter')submitJobAnswer($('jobAnswer').value,false)};setTimeout(()=>$('jobAnswer')?.focus(),0);
    }else{
      $('dialogueActions').innerHTML=`<div id="chainJob" style="width:100%"><div style="display:grid;gap:7px">${q.steps.map((s,i)=>`<select id="chain${i}" aria-label="Sambandets del ${i+1}"><option value="">${i+1}. Välj ${i===0?'start':i===1?'nästa led':'följd'} …</option>${shuffle(s.options).map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select>`).join('')}</div><button id="submitChainAnswer" style="margin-top:8px" type="button">Lås sambandet →</button></div><button id="giveUpJob" type="button" class="reply">Jag kan inte detta än. Avsluta jobbet.</button>`;
      $('submitChainAnswer').onclick=()=>{const values=q.steps.map((_,i)=>$('chain'+i).value);if(values.every(Boolean))submitJobAnswer(values,true);else showHint('Välj alla tre delarna innan du låser sambandet.')} ;$('giveUpJob').onclick=()=>submitJobAnswer([],true);
    }
  }
  function shuffle(values){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function submitJobAnswer(value,supported){
    if(!activeQuestion)return;const {id,index,q}=activeQuestion;activeQuestion=null;const result=logicAnswer(q,value,supported);updateHUD();
    if(!result.correct){
      showDialogue(mission(id).npc,`${esc(REACTIONS[id])}<br><br><b>Arbetet är förlorat för i dag.</b> Du får inte facit — frågan har lagts i din anteckningsbok.`,[
        {label:'Öppna anteckningsboken.',fn:showNotebook,reply:true},
        {label:'Fortsätt utforska.',fn:()=>{closeDialogue();if(result.collapsed)setTimeout(showCollapse,250)},reply:true}
      ],'feedback-asleep');return;
    }
    if(result.completed){jobCompleted(id);return}
    showDialogue(mission(id).npc,`Rätt. <em>${esc(q.explanation)}</em>`,[{label:'Fortsätt arbetet →',fn:()=>showJobQuestion(id,index+1),reply:true}],'feedback-good');
  }
  function jobCompleted(id){
    const m=mission(id),item=ITEM_INFO[id];save();updateHUD();showDialogue(m.npc,`”Det höll! Hela arbetet är klart.”<br><br>Du får <b>${PAY[id]} daler</b> och <b>${esc(item.name.toLowerCase())}</b>. Det senare är ett förseglat arbetsintyg till arkivet.`,[
      {label:'Stoppa intyget i ränseln.',fn:()=>{closeDialogue();updateHUD();if(!state.breadBought&&state.coins>=3)showHint('Nu har du råd med bröd hos Marta på Stortorget.');if(state.completed.length===data.missions.length)showHint('Alla sju intyg är klara. Ta dem till arkivbudet.')} ,reply:true}
    ],'feedback-good');
  }

  function talkBaker(){
    if(state.coins<3){showDialogue('Bagaren Marta','”Ett bröd kostar tre daler. Sympati är gratis men beklagligt kalorifattig.”',[{label:'Jag hittar ett arbete.',fn:closeDialogue,reply:true},{label:'Vad finns det för arbeten?',fn:showJobs,reply:true}]);return}
    showDialogue('Bagaren Marta',`”Tre daler för ett bröd. Du har ${state.coins}. Det är betydligt bättre än noll.”`,[{label:'Köp ett bröd för 3 daler.',fn:buyBreadUI,reply:true},{label:'Jag sparar mina pengar till en mycket dålig idé.',fn:closeDialogue,reply:true}]);
  }
  function buyBreadUI(){const result=logicBuyBread();updateHUD();if(!result.ok){closeDialogue();showHint('Du behöver tre daler.');return}showDialogue('Bagaren Marta','”Varsågod. Försök att äta brödet, inte använda det som argument i riksdagen.”<br><br>Brödet ligger i ränseln. Klicka på det två gånger för att äta.',[{label:'Tack. Jag ska göra mitt bästa.',fn:closeDialogue,reply:true}],'feedback-good')}
  function eatBreadUI(){const result=logicEatBread();selectedItem=null;updateHUD();if(!result.ok){showHint(result.reason==='full'?'Du är redan mätt. Spara brödet.':'Du har inget bröd.');return}narrate('Du äter brödet. För första gången i dag låter magen mindre än stadsklockan.');if(state.completed.length<data.missions.length)showHint('Mättnaden räcker till fler arbeten. Varje nytt arbete kostar 1.')}
  function talkArchive(){
    const count=state.completed.length;if(count===data.missions.length){showDialogue('Arkivbudet',`”Sju intyg. Tryckeri, riksdag, jordbruk, vetenskap, slott, handel och nya idéer. Använd ett av intygen på mig så ordnar vi resten.”`,[{label:'Jag väljer ett intyg ur ränseln.',fn:closeDialogue,reply:true},{label:'Ordna allt nu.',fn:tryFinish,reply:true}]);return}
    showDialogue('Arkivbudet',`”Stadens kunskapsarkiv saknar sju arbetsintyg. Du har ${count}. Jag behöver bevis på att du kan använda kunskapen — inte bara känna igen rätt alternativ.”`,[{label:'Visa vilka intyg som saknas.',fn:showJobs,reply:true},{label:'Jag återkommer.',fn:closeDialogue,reply:true}]);
  }
  function tryFinish(){if(state.completed.length<data.missions.length){showDialogue('Arkivbudet','”Det här är ett utmärkt intyg. Det är också ensamt. Samla resten.”',[{label:'Tillbaka till arbetet.',fn:closeDialogue,reply:true}]);return}state.won=true;save();closeDialogue();showVictory()}
  function talkInn(){
    if(state.time<2&&!state.failedToday.length){showDialogue('Värdshusvärden','”Sova redan? Du har knappt hunnit bli historiskt utmattad.”',[{label:'Jag försöker arbeta först.',fn:closeDialogue,reply:true}]);return}
    const canPay=state.coins>=2;showDialogue('Värdshusvärden',`”En säng, ett täcke och bara måttligt många loppor: två daler. Misslyckade arbeten öppnar igen i morgon.”`,[
      ...(canPay?[{label:'Betala 2 daler och sov till morgonen.',fn:()=>{state.coins-=2;logicNewDay();closeDialogue();updateHUD();narrate(`Speldag ${state.day}. Nya försök väntar.`)},reply:true}]:[]),
      {label:'Sov i stallet gratis. (Du vaknar med 1 mättnad.)',fn:()=>{logicNewDay();state.food=1;save();closeDialogue();updateHUD();narrate(`Speldag ${state.day}. Hästen snarkade. Höet gjorde det nästan.`)},reply:true},
      {label:'Inte än.',fn:closeDialogue,reply:true}
    ]);
  }

  function showCollapse(){
    openModal('DAGEN TOG SLUT','Du svimmade av hunger.',`<div class="fail-stamp">MYCKET<br>HISTORISK<br>HUNGER</div><p class="lead">Du vaknar i värdshusets vedbod. Två daler har försvunnit till soppa, filt och administrativt besvär.</p><p>Dina färdiga arbetsintyg finns kvar. Dagens misslyckade jobb öppnas igen, men facit visas fortfarande inte.</p>${gapMarkup()}<div class="button-row"><button id="nextDay" class="primary">Börja speldag ${state.day+1} →</button></div>`,'collapse');
    $('nextDay').onclick=()=>{logicNewDay({collapsed:true});closeModal();travel('square');updateHUD()};
  }
  function showVictory(){
    openModal('ARKIVET ÄR HELT','Du fick platsen.',`<div class="victory-stamp">✓</div><p class="lead">Arkivbudet fogar samman de sju intygen. Staden har fått en ny arkivlärling — en mättare sådan dessutom.</p><p>Du klarade äventyret på <b>${state.day} speldag${state.day===1?'':'ar'}</b>, med <b>${state.coins} daler</b> kvar och <b>${state.collapseCount}</b> kollaps${state.collapseCount===1?'':'er'}.</p><div class="warning">Det här var en prototyp med tillfällig frågebank. Nästa steg är att bygga pusslen direkt ur det material eleverna faktiskt har undervisats om.</div><div class="button-row"><button id="victoryReport" class="primary">Visa kunskapsrapport</button><button id="victoryContinue" class="secondary">Fortsätt utforska</button></div>`,'victory');$('victoryReport').onclick=showReport;$('victoryContinue').onclick=closeModal;
  }

  function showJobs(){
    const rows=data.missions.map(m=>{const done=state.completed.includes(m.id),failed=state.failedToday.includes(m.id);return `<div class="quest-row ${done?'done':''}"><span class="seal">${done?'✓':m.symbol}</span><span><b>${esc(m.title)}</b><small>${esc(m.location)} · ${m.cards.length} kunskapssteg · ${PAY[m.id]} daler</small></span>${failed?'<em>stängt i dag</em>':done?'<em>klart</em>':''}</div>`}).join('');
    openModal('ANSLAGSTAVLAN','Arbeten i staden',`<p>Alla arbeten kräver kunskap. Ett fel avslutar jobbet för speldagen och visar inte facit.</p><div class="quest-list">${rows}</div><div class="button-row"><button id="jobsMap" class="primary">Öppna stadskartan</button></div>`,'jobs');$('jobsMap').onclick=showMap;
  }
  function mapMarkup(){const pins=[['garden','Trädgård','❧',18,18],['print','Tryckeri','▤',47,17],['riksdag','Riksdag','♜',69,18],['farm','Byn','♧',19,78],['square','Stortorget','⌂',50,49],['coffee','Kaffehus','✧',69,74],['palace','Slott','♛',47,82],['harbor','Hamnen','⚓',88,49]];return `<div class="city-map"><div class="map-road h"></div><div class="map-road v"></div><div class="map-water"></div>${pins.map(([id,label,mark,x,y])=>{const mid=MISSION_FOR[id],failed=mid&&state.failedToday.includes(mid);return `<button class="map-location ${state.scene===id?'current':''} ${failed?'locked':''}" style="left:${x}%;top:${y}%" data-travel="${id}" data-mark="${mark}">${label}${failed?' · stängt':''}</button>`}).join('')}</div>`}
  function showMap(){if(state.rehearsal){showReviewQuestion();return}if(state.working){resumeWork();return}closeDialogue();openModal('STADSKARTA','Vart vill du gå?',`${mapMarkup()}<p class="small">Resor kostar ingen mättnad i prototypen. Själva arbetena gör det.</p>`,'map');for(const b of document.querySelectorAll('[data-travel]'))b.onclick=()=>travel(b.dataset.travel)}
  function gapMarkup(){const gaps=state.gaps.map(id=>allCards().find(q=>q.id===id)).filter(Boolean);return gaps.length?`<h3>Kunskapsluckor att ta med till lektionen</h3><div class="gap-list">${gaps.map(q=>`<div class="gap"><b>${esc(q.topic)}</b><p>${esc(q.question)}</p></div>`).join('')}</div>`:'<p class="small">Inga obesvarade kunskapsluckor är noterade just nu.</p>'}
  function showNotebook(){closeDialogue();openModal('ANTECKNINGSBOKEN','Det här behöver du kunna',`<p>Här finns frågorna du missat — men inga facit. Bokoraklet på Stortorget hänvisar till rätt avsnitt. Läromästaren repeterar avslutade uppdrag och visar återkoppling efter ditt eget försök.</p>${gapMarkup()}<h3>Repetition</h3><p>Besök läromästaren Rut på Stortorget. Ett kort förhör utan bok kan ge ett äpple. När en fråga ska återkomma räknas i verkliga dagar, inte speldagar.</p><h3>Arbetsintyg</h3><div class="quest-list">${data.missions.map(m=>`<div class="quest-row ${state.completed.includes(m.id)?'done':''}"><span class="seal">${state.completed.includes(m.id)?'✓':m.symbol}</span><span><b>${esc(m.title)}</b><small>${state.completed.includes(m.id)?esc(ITEM_INFO[m.id].name):'Inte utfört'}</small></span></div>`).join('')}</div>`,'notebook')}

  function stats(){const rows=reportRows(),attempted=rows.filter(r=>r.s.attempts),firstRight=attempted.filter(r=>r.s.firstCorrect&&!r.s.firstSupported),missed=rows.filter(r=>r.s.missed),independent=rows.filter(r=>r.s.correct-r.s.supported>0);return{rows,attempted,firstRight,missed,independent}}
  function showReport(){const s=stats();openModal('KUNSKAPSRAPPORT',state.name?`${esc(state.name)} · speldag ${state.day}`:`Speldag ${state.day}`,`<div class="report-grid"><div class="report-stat"><b>${state.completed.length}/7</b><span>arbetsintyg</span></div><div class="report-stat"><b>${s.attempted.length}/${s.rows.length}</b><span>frågor prövade</span></div><div class="report-stat"><b>${s.firstRight.length}</b><span>rätt direkt</span></div><div class="report-stat"><b>${s.missed.length}</b><span>kunskapsluckor</span></div></div><table class="report-table"><thead><tr><th>Uppdrag</th><th>Prövade</th><th>Rätt direkt</th><th>Fel</th></tr></thead><tbody>${data.missions.map(m=>{const rows=m.cards.map(q=>({q,s:state.answers[q.id]||{}})),seen=rows.filter(r=>r.s.attempts),right=seen.filter(r=>r.s.firstCorrect&&!r.s.firstSupported),wrong=seen.filter(r=>r.s.missed);return `<tr><td>${esc(m.title)}</td><td>${seen.length}/${rows.length}</td><td>${right.length}</td><td>${wrong.length}</td></tr>`}).join('')}</tbody></table><p class="small">Ett arbetsintyg kräver alla moment rätt i samma försök. Sambandsuppgifter innehåller färdiga delar och räknas därför som stöd. Rapporten är ett övningsunderlag, inte ett betyg.</p><div class="button-row"><button id="downloadReport" class="primary">Hämta rapport (.csv)</button><button id="printReport" class="secondary">Skriv ut</button></div>`,'report');$('downloadReport').onclick=()=>download('uppdrag-1700-aventyrsrapport.csv',reportCSV(),'text/csv;charset=utf-8');$('printReport').onclick=()=>window.print()}
  function download(filename,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500)}

  function showMenu(){if(state.rehearsal){showReviewQuestion();return}if(state.working){resumeWork();return}openModal('SPELMENY','Pausa äventyret',`<div class="rules"><button id="menuNotebook" class="rule"><b>Anteckningar</b><span>Kunskapsluckor utan facit</span></button><button id="menuReport" class="rule"><b>Rapport</b><span>Försök och arbetsintyg</span></button><button id="menuHelp" class="rule"><b>Så spelar du</b><span>Handlingar, hunger och dagar</span></button><button id="menuTeacher" class="rule"><b>För läraren</b><span>Frågebank och elevfil</span></button></div><div class="button-row"><button id="menuContinue" class="primary">Fortsätt spela</button><button id="menuReset" class="text-button">Börja om hela äventyret</button></div>`,'menu');$('menuNotebook').onclick=showNotebook;$('menuReport').onclick=showReport;$('menuHelp').onclick=showHelp;$('menuTeacher').onclick=showTeacher;$('menuContinue').onclick=closeModal;$('menuReset').onclick=confirmReset}
  function showHelp(){openModal('SÅ SPELAR DU','Kunskap är spelmekaniken',`<div class="rules"><div class="rule"><b>1. Utforska</b><span>Välj Titta, Prata, Ta eller Använd. Tryckeriet har lösa föremål och ett frivilligt pussel.</span></div><div class="rule"><b>2. Arbeta</b><span>Varje jobb kostar 1 mättnad och för tiden framåt.</span></div><div class="rule"><b>3. Minns</b><span>Svara utan alternativ. Ett fel stänger jobbet för dagen.</span></div><div class="rule"><b>4. Överlev</b><span>Tjäna daler, köp bröd och ät ur ränseln.</span></div></div><p>Det finns ingen snabb gissningsloop: ett fel visar inte facit och kräver en ny speldag. Sambandspusslen har däremot färdiga delar och ger därför visst stöd.</p><p>Besök läromästaren Rut på Stortorget för att repetera avslutade uppdrag. Minst 70 procent rätt kan ge ett äpple en gång per verkligt dygn. Äpplet ger extra stöd i ett nytt jobb och stödet markeras i rapporten. Bokoraklets hänvisningar är alltid gratis.</p><div class="warning">Spelet är gjort för att spelas efter undervisning. Det är inte tänkt att lära ut hela området på egen hand.</div>`,'help')}
  function showTeacher(){openModal('FÖR LÄRAREN','En prototyp att pröva kritiskt',`<div class="segmented"><button id="teacherGuide" class="active">Upplägg</button><button id="teacherBank">Frågebank</button><button id="teacherSources">Källor</button></div><div id="teacherContent"></div>`,'teacher');$('teacherGuide').onclick=()=>teacherTab('guide');$('teacherBank').onclick=()=>teacherTab('bank');$('teacherSources').onclick=()=>teacherTab('sources');teacherTab('guide')}
  function teacherTab(tab){
    for(const [id,key]of[['teacherGuide','guide'],['teacherBank','bank'],['teacherSources','sources']])$(id).classList.toggle('active',tab===key);const el=$('teacherContent');
    if(tab==='guide'){el.innerHTML=`<p><b>Prototypens hypotes:</b> kunskap från undervisningen blir en resurs i ett äventyr. Eleven måste få arbete för att köpa mat. Ett fel svar avslutar jobbet för speldagen och visar inte facit.</p><h3>Spela tillsammans i klassen</h3><p>Visa spelet på projektorn. Låt alla elever tänka och svara för sig innan ni väljer klassens svar. Besök bokoraklet för att knyta uppdragen till undervisningen.</p><h3>Det som är starkt</h3><ul><li>Fria svar gör enkel gissning svår.</li><li>Kunskapen har en tydlig funktion i berättelsen.</li><li>Rapporten skiljer rätt direkt från senare försök.</li></ul><h3>Det som måste prövas</h3><ul><li>Hunger och låsning kan motivera, men också frustrera.</li><li>Fem rätt i följd mäter även uthållighet och läsning.</li><li>Den tillfälliga frågebanken täcker inte nödvändigtvis ert kommande kapitel.</li><li>Repetitionens intervaller är ett startförslag; elevernas lärande behöver följas upp.</li></ul><div class="button-row"><button id="downloadGame" class="primary">Hämta elevversion (.html)</button><button id="teacherReport" class="secondary">Visa rapport</button></div><p class="small">Elevversionen fungerar utan nät. Framsteg sparas i samma webbläsare på samma enhet och skickas inte automatiskt till läraren.</p>`;$('downloadGame').onclick=downloadGame;$('teacherReport').onclick=showReport;return}
    if(tab==='sources'){el.innerHTML=`<p>Historiska faktauppgifter bygger främst på Sveriges riksdag, Uppsala universitet, Göteborgs universitet och Stockholmskällan. Staden, personerna och händelseförloppet är påhittade.</p><ul class="source-list">${data.sources.map(s=>`<li><a target="_blank" rel="noopener noreferrer" href="${esc(s.url)}">${esc(s.label)} ↗</a></li>`).join('')}</ul><div class="warning">Stödet gäller återkallning som lärstrategi, inte att just denna spelvärld förbättrar lärandet. Därför behöver vi observera elevernas beteende och justera.</div>`;return}
    el.innerHTML=`<p>Fältet bookReference kan ange en riktig bokhänvisning per uppdrag, och learningHint en extra ledtråd per kortsvarsfråga. Import av en ny bank börjar ett nytt äventyr.<br><br>Den nuvarande banken är tillfällig: ${allCards().length} frågor i sju uppdrag. Exportera den som mall eller importera en ny bank med samma sju uppdrags-id.</p><div class="quest-list">${data.missions.map(m=>`<div class="quest-row"><span class="seal">${m.symbol}</span><span><b>${esc(m.title)}</b><small>${m.cards.length} frågor</small></span></div>`).join('')}</div><div class="button-row"><button id="exportBank" class="secondary">Exportera frågebank (.json)</button><button id="importBank" class="secondary">Importera frågebank</button></div><input id="bankUpload" type="file" accept="application/json,.json" hidden><p id="bankError" class="warning" hidden></p>`;$('exportBank').onclick=()=>download('uppdrag-1700-fragor.json',JSON.stringify(data,null,2),'application/json');$('importBank').onclick=()=>$('bankUpload').click();$('bankUpload').onchange=importBank;
  }
  async function importBank(){const file=$('bankUpload').files?.[0];if(!file)return;try{const value=JSON.parse(await file.text());if(!validBank(value))throw new Error('Banken behöver samma sju uppdrag, unika fråge-id och giltiga svarsfält. Utgå från en exporterad fil.');openModal('BYT FRÅGEBANK','Börja ett nytt äventyr?',`<p>En ny frågebank gör gamla resultat svårtolkade. Importen nollställer därför spelets framsteg på den här enheten.</p><div class="button-row"><button id="confirmImport" class="primary">Importera och börja om</button><button id="cancelImport" class="secondary">Avbryt</button></div>`,'confirm');$('confirmImport').onclick=()=>{applyBank(value);try{localStorage.setItem(BANK_KEY,JSON.stringify(data))}catch{}const name=state.name;state=blankState();state.name=name;state.started=true;save();closeModal();travel('square');updateHUD();showHint('Den nya frågebanken är inläst.')} ;$('cancelImport').onclick=showTeacher}catch(error){const box=$('bankError');box.textContent=error.message;box.hidden=false}}
  async function downloadGame(){const button=$('downloadGame');if(button){button.disabled=true;button.textContent='Förbereder …'}try{let html;if(document.getElementById('custom-bank')){const clone=document.documentElement.cloneNode(true);clone.querySelector('#modal')?.removeAttribute('open');clone.querySelector('#custom-bank').textContent='window.CUSTOM_BANK='+JSON.stringify(data).replace(/</g,'\\u003c')+';';html='<!doctype html>\n'+clone.outerHTML}else{const response=await fetch('uppdrag-1700.html');if(!response.ok)throw new Error('Elevfilen kunde inte hämtas.');html=await response.text();html=html.replace(/window\.CUSTOM_BANK=null;/,()=>`window.CUSTOM_BANK=${JSON.stringify(data).replace(/</g,'\\u003c')};`)}download('uppdrag-1700-monkey-island.html',html,'text/html;charset=utf-8');showHint('Elevversionen är hämtad.')}catch(error){showHint('Kunde inte hämta elevversionen: '+error.message)}finally{if(button){button.disabled=false;button.textContent='Hämta elevversion (.html)'}}}
  function confirmReset(){openModal('BÖRJA OM','Radera spelets framsteg?',`<p>Pengar, mat, arbetsintyg och svarshistorik på den här enheten försvinner. Frågebanken behålls.</p><div class="button-row"><button id="confirmReset" class="primary">Ja, börja om</button><button id="cancelReset" class="secondary">Avbryt</button></div>`,'confirm');$('confirmReset').onclick=()=>{state=blankState();save();playing=false;closeModal();showIntro()};$('cancelReset').onclick=showMenu}

  function openModal(overline,title,body,mode=''){closeDialogue();$('modalBody').innerHTML=`<div class="modal"><div class="modal-top"><span class="eyebrow">${esc(overline)}</span><button id="modalClose" class="modal-close" aria-label="Stäng">×</button></div><h2 id="modalTitle">${title}</h2>${body}</div>`;$('modal').dataset.mode=mode;if(!$('modal').open)$('modal').showModal();$('modal').scrollTop=0;$('modalClose').onclick=closeModal}
  function closeModal(){if($('modal').open)$('modal').close();canvas.focus()}
  $('modal').addEventListener('cancel',e=>{e.preventDefault();closeModal()});
  function showIntro(){
    openModal('ETT POINT-AND-CLICK-ÄVENTYR','Den hungrige <em>lärlingen</em>',`<p class="lead">Du kommer till staden med tom ränsel, två mått mättnad och inte en enda daler. Arkivet söker en lärling — men först måste du överleva dagen.</p><div class="chapter-card"><span class="eyebrow">KAPITEL 1 · PROTOTYP</span><p><b>Skaffa arbete. Använd kunskaper om 1700-talet. Få betalt. Köp bröd.</b></p></div><div class="rules"><div class="rule"><b>Kunskap krävs</b><span>Korta svar skrivs fritt. Inga svarsalternativ.</span></div><div class="rule"><b>Fel får följder</b><span>Jobbet stängs för dagen. Facit avslöjas inte.</span></div><div class="rule"><b>Mat är tid</b><span>Varje arbete kostar 1 mättnad.</span></div><div class="rule"><b>Världen minns</b><span>Framsteg sparas på denna enhet.</span></div></div><label class="field-label" for="playerName">VAD SKA STADEN KALLA DIG? (FRIVILLIGT)</label><input id="playerName" maxlength="35" value="${esc(state.name)}" placeholder="Till exempel Arkivlärlingen"><div class="button-row"><button id="startAdventure" class="primary">${state.started?'Fortsätt äventyret':'Kliv in i staden'} →</button><button id="introTeacher" class="secondary">För läraren</button></div><p class="small">Staden och personerna är fiktiva. Frågebanken är tillfällig medan vi provar spelarkitekturen.</p>`,'intro');$('startAdventure').onclick=()=>{state.name=$('playerName').value.trim();state.started=true;playing=true;save();closeModal();travel(state.scene||'square');if(!state.completed.length)showDialogue('Berättaren','Din mage morrar. Marta säljer bröd för tre daler. Anslagstavlan listar arbeten — men ingen betalar för vackra gissningar.',[{label:'Jag tittar på anslagstavlan.',fn:()=>{closeDialogue();activeVerb='look';updateVerbButtons();showHint('Välj anslagstavlan i scenen.')},reply:true},{label:'Jag utforskar själv.',fn:closeDialogue,reply:true}])};$('introTeacher').onclick=showTeacher;
  }
  function foodInfo(){openModal('MÄTTNAD','Kunskap kräver lunch',`<p>Du har <b>${state.food} av ${state.maxFood}</b> mättnad. Ett nytt arbete kostar 1. Ett bröd kostar 3 daler och ger tillbaka 3.</p><p>Om du misslyckas utan mat, pengar eller bröd tar dagen slut. Färdiga arbetsintyg finns kvar.</p>`,'food')}

  $('mapBtn').onclick=showMap;$('menuBtn').onclick=showMenu;$('titleBtn').onclick=showIntro;$('foodBtn').onclick=foodInfo;
  window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('dialogue').hidden)closeDialogue();else if($('modal').open)closeModal()}if(e.key.toLowerCase()==='m'&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))showMap()});
  window.addEventListener('pagehide',save);
  function animate(t){renderScene(ctx,state.scene,state,t);requestAnimationFrame(animate)}
  window.UPPDRAG_GAME_CLOUD={
    snapshot:()=>clone(state),
    pause:()=>{if(state.rehearsal){showHint('Avsluta repetitionsförhöret före kontobyte.');return false}if(state.working){showHint('Avsluta arbetet före kontobyte.');return false}playing=false;return true},
    resume:()=>{playing=state.started;if(!state.started)showIntro();else if(state.rehearsal)showReviewQuestion();else if(state.working)resumeWork()},
    enter:(uid,value)=>{closeDialogue();activeQuestion=null;cloudAccount=uid;const cached=readStorage(saveKey());if(value&&cached&&JSON.stringify(value)!==JSON.stringify(cached)){try{localStorage.setItem(`${saveKey()}.backup`,JSON.stringify(cached))}catch{}}state=loadState(value||cached);state.name='';if(window.UPPDRAG_PRACTICE)state.visits=window.UPPDRAG_PRACTICE.visit(state.visits);activeVerb=null;selectedItem=null;updateHUD();closeModal();playing=false},
    leave:()=>{closeDialogue();activeQuestion=null;cloudAccount=null;state=loadState(readStorage(SAVE_KEY));activeVerb=null;selectedItem=null;updateHUD();closeModal();playing=false}
  };
  updateHUD();requestAnimationFrame(animate);if(state.started){playing=true;if(state.rehearsal)showReviewQuestion();else if(state.working)resumeWork();else travel(state.scene)}else showIntro();
})();

