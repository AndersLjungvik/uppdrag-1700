/* Uppdrag 1700 – side-adventure engine v1.5.0.
 * Single world-loop integration. Optional scenes, not knowledge assessment.
 * The per-chapter save is separate from the original pilot and recall saves.
 * The definitions below also reserve hooks for future chapters 9 and 10.
 */
(function(){
'use strict';
const chapter=Number(window.__INTEGRATED_CHAPTER||((document.title.match(/Kapitel\s+(\d+)/i)||[])[1]))||0;
if(!chapter||chapter>10||!document.getElementById('stage'))return;
const teacher=new URLSearchParams(window.__UPPDRAG_QUERY||location.search).get('preview')==='1';
const saveKey='uppdrag1700.side-adventures.v1';
const scenery={
  1:{wagon:'Kusken kör papper till tryckeriet, men ett vagnshjul har fastnat.',thief:'På väg från torget har någon ögonen på din penningpung.'},
  2:{wagon:'En vagn med bröd och ved till barnhuset har fastnat på vägen.',thief:'I folkvimlet kring barnhuset syns en snabb hand.'},
  3:{wagon:'En vagn står tvärs över landsvägen. Kusken vill inte hamna mellan de upprörda grupperna.',thief:'En person utnyttjar oron på gatan.'},
  4:{wagon:'En vagn lastad med forskarnas instrument har kört fast. Kusken är orolig för glaset.',thief:'Någon försöker försvinna med din penningpung.'},
  5:{wagon:'En vagn med nytryckta blad står stilla. Axelns belastning är för stor.',thief:'En skugga närmar sig medan du passerar torget.'},
  6:{wagon:'En vagn med säckar från byn har blivit stående på herrgårdsvägen.',thief:'Staden har många snabba händer.'},
  7:{wagon:'En vagn med handelsbrev blockerar vägen mot herrgården.',thief:'I hamnstadens folkvimmel försvinner någon bakom dig.'},
  8:{wagon:'En vagn med operamaterial har kört fast långt från teatern.',thief:'I stadens trängsel försöker någon stjäla en daler.'},
  9:{wagon:'En vagn med post från öster står stilla på landsvägen.',thief:'En ficktjuv försöker ta dina daler.'},
  10:{wagon:'En vagn med föremål till utställningen står på tvären.',thief:'En ficktjuv försöker ta dina daler.'}
};
const catalog=new Map();
const wagonAt={x:3040,y:367,region:'main'}; // On the ruralJ1–ruralJ2 road, before the manor.
const smithAt={x:2710,y:705,region:'main'}; // Workshops, already on an accessible road.
const witnessAt={x:1075,y:713,region:'main'}; // A passerby on the market square.
const stage=document.getElementById('stage'),canvas=document.getElementById('world');
const raw=(()=>{try{return JSON.parse(localStorage.getItem(saveKey)||'null');}catch{return null;}})();
const store=raw&&raw.v===1&&typeof raw.chapters==='object'&&!Array.isArray(raw.chapters)?raw:{v:1,chapters:{}};
const state=store.chapters[chapter]&&typeof store.chapters[chapter]==='object'?store.chapters[chapter]:{};
if(!['unseen','inspected','need-smith','advice','cleared','deferred'].includes(state.wagon))state.wagon='unseen';
if(!['unseen','won','lost','ignored'].includes(state.thief))state.thief='unseen';
if(!Array.isArray(state.history))state.history=[];
state.distance=Math.max(0,Math.min(100000,Number(state.distance)||0));
state.wagonSeen=!!state.wagonSeen;
state.thiefSeen=!!state.thiefSeen;
state.wagonShoulder=!!state.wagonShoulder;
if(!['unseen','cold','recovered','heard'].includes(state.witness))state.witness='unseen';
store.chapters[chapter]=state;
let scene=null,blocking=false,last=null,spawnedAt=0,thiefPoint=null,matrix=null,lastRegion=null,atRoom=false;
const allowed=(kind)=>{
  if(kind==='wagon')return chapter>=1&&chapter<=10;
  if(kind==='thief')return chapter!==6&&![3,8].includes(chapter); // ch6 has a pre-existing thief; no double penalties.
  return false;
};
const save=()=>{state.history=state.history.slice(-35);try{localStorage.setItem(saveKey,JSON.stringify(store));}catch{}updateJournalLabel();};
const record=(kind,value)=>{state.history.push({kind,value,at:new Date().toISOString()});save();};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getPilot=()=>window['UPPDRAG_CH'+chapter+'_PILOT'];
function wallet(){const p=getPilot();return Number.isFinite(Number(p?.state?.daler))?Math.max(0,Number(p.state.daler)):0;}
function loseDaler(){if(teacher)return false;const p=getPilot();if(!p?.state||wallet()<1)return false;
 p.state.daler=wallet()-1;
 try{if(typeof p.persist==='function')p.persist();else if(p.saveKey)localStorage.setItem(p.saveKey,JSON.stringify(p.state));p.refresh?.();}catch{}
 const label=document.querySelector('#ch1Hud .ch1Wallet');if(label&&label.textContent.includes('daler'))label.textContent=label.textContent.replace(/\d+(?=\s*daler)/,String(p.state.daler));
 return true;
}
function returnDaler(){if(teacher)return false;const p=getPilot();if(!p?.state)return false;
 p.state.daler=wallet()+1;
 try{if(typeof p.persist==='function')p.persist();else if(p.saveKey)localStorage.setItem(p.saveKey,JSON.stringify(p.state));p.refresh?.();}catch{}
 const label=document.querySelector('#ch1Hud .ch1Wallet');if(label&&label.textContent.includes('daler'))label.textContent=label.textContent.replace(/\d+(?=\s*daler)/,String(p.state.daler));
 return true;
}
function candidates(){return (window.UPPDRAG_RECALL_BANK||[]).filter(t=>t.chapter<=chapter&&t.chapter>=1&&t.rank===0&&t.fields?.length===1&&t.fields[0].options?.length>=3&&t.fields[0].answers?.length);
}
function question(seed){const all=candidates();if(!all.length)return null;
 const t=all[(seed*31+chapter*7)%all.length],f=t.fields[0];
 const norm=s=>String(s).toLocaleLowerCase('sv').replace(/[.!,\s]+/g,' ').trim();
 const answer=f.options.find(o=>f.answers.some(a=>norm(a)===norm(o)))||null;
 if(!answer)return null;
 const offset=seed%f.options.length;
 return{prompt:t.prompt,answer,choices:f.options.map((_,i)=>f.options[(i+offset)%f.options.length])};
}
const style=document.createElement('style');style.textContent=`
#adventureJournal{position:absolute;left:10px;top:10px;z-index:27;min-height:42px;border:1px solid #826e52;border-radius:7px;background:#fff7e7ed;color:#3c2e25;font:600 13px system-ui;padding:8px 11px;cursor:pointer}
#adventureDialog{box-sizing:border-box;width:min(620px,calc(100% - 24px));max-height:85dvh;overflow:auto;padding:21px;border:2px solid #8f7752;border-radius:12px;background:#fbf3e4;color:#352a20;font:17px/1.5 Georgia,serif}
#adventureDialog::backdrop{background:#211b14a8}
#adventureDialog h2{font:600 28px/1.15 Georgia,serif;margin:0 0 13px}
#adventureDialog p{margin:10px 0}
#adventureDialog .ad-actions{display:flex;flex-wrap:wrap;gap:9px;margin:18px 0 5px}
#adventureDialog button{min-height:44px;font:16px/1.3 system-ui;border:1px solid #8f795b;border-radius:6px;background:#e5e8d8;color:#312b24;padding:9px 12px;cursor:pointer;flex:1 1 160px;text-align:left}
#adventureDialog button.secondary{background:#fff9ed}
#adventureDialog button:focus-visible,#adventureJournal:focus-visible{outline:3px solid #266879;outline-offset:2px}
#adventureDialog .ad-note{font:14px/1.45 system-ui;color:#615444;padding:7px 0}
#adventureDialog .ad-history{padding:9px 12px;border-left:3px solid #887253;background:#f0e5d0}
#adventureDialog .ad-choices{display:grid;gap:8px;margin-top:15px}
#adventureDialog .ad-choices button{width:100%}
#adventureDialog .ad-illustration{height:92px;border-block:1px solid #b9a889;margin:12px 0;background:linear-gradient(#e6dcc8 0 63%,#baa88c 63%);position:relative;overflow:hidden}
#adventureDialog .ad-illustration .ad-cart{position:absolute;left:43%;bottom:10px;width:96px;height:37px;background:#866546;border:4px solid #4a382c;transform:skew(-7deg)}
#adventureDialog .ad-illustration .ad-cart:before,.ad-illustration .ad-cart:after{content:'';position:absolute;bottom:-18px;width:25px;height:25px;border-radius:50%;border:5px solid #4b392b;background:#c4a87e}
#adventureDialog .ad-illustration .ad-cart:before{left:8px}#adventureDialog .ad-illustration .ad-cart:after{right:8px}
body.ch1-open #adventureJournal,body[data-conversation] #adventureJournal{display:none}
@media(max-width:480px){#adventureJournal{top:6px;left:6px;padding:7px 9px;font-size:12px}#adventureDialog{padding:15px;font-size:16px}#adventureDialog h2{font-size:23px}}
`;document.head.append(style);
const journal=document.createElement('button');journal.type='button';journal.id='adventureJournal';journal.setAttribute('aria-label','Öppna sidoäventyr och händelser');stage.append(journal);
const dialog=document.createElement('dialog');dialog.id='adventureDialog';dialog.setAttribute('aria-label','Sidoäventyr');document.body.append(dialog);
const actions=(items)=>'<div class="ad-actions">'+items.map(([code,label,second])=>`<button type="button" data-adventure="${code}"${second?' class="secondary"':''}>${esc(label)}</button>`).join('')+'</div>';
function display(title,html,items=[]){
 scene=title;blocking=true;dialog.innerHTML='<h2>'+esc(title)+'</h2>'+html+actions(items);
 if(!dialog.open)dialog.showModal();
 window.UPPDRAG_WORLD_KEYBOARD?.clear?.();
 dialog.querySelector('button')?.focus();
}
function close(){if(dialog.open)dialog.close();if(state.wagonSeen&&state.wagon!=='cleared'){state.wagonShoulder=true;save();}scene=null;blocking=false;window.UPPDRAG_WORLD_KEYBOARD?.clear?.();}
function finishWagon(method){state.wagon='cleared';state.wagonSeen=true;record('wagon',method);display('Vägen är fri','<p><b>Kusken:</b> ”Nu lossnade hjulet! Jag minns att du hjälpte mig. Nästa gång ska jag lasta lättare.”</p><p class="ad-note">Du får ingen gratis mästarstämpel av sidoäventyret. Vägen är fri och huvuduppdraget fortsätter.</p>',[['close','Fortsätt genom staden']]);}
function showWagon(){if(!allowed('wagon'))return;
 if(!state.wagonSeen){state.wagonSeen=true;record('wagon','discovered');}
 if(state.wagon==='cleared'){display('Kusken minns dig','<p><b>Kusken:</b> ”Här var det stopp förut! Tack vare dig kom jag fram med lasten. Hästarna är utvilade och vagnen står åt sidan.”</p>',[['close','Fortsätt']]);return;}
 if(state.wagon==='need-smith'){
  display('Vagnen står kvar','<p><b>Kusken:</b> ”Kan du tala med smeden vid Verkstäderna? Hen känner till hur man stöttar en skadad vagnsaxel. Jag väntar här.”</p><p class="ad-note">Sidoäventyr: besök smeden vid Verkstäderna, väster om Byn, och återvänd hit.</p>',[['later','Jag kommer tillbaka']]);return;
 }
 if(state.wagon==='advice'){
  display('Rådet från smeden','<p><b>Kusken:</b> ”Har du varit hos smeden?”</p><p><b>Du:</b> ”Vi ska lossa lite last och stötta axeln innan hästarna drar.”</p><p><b>Kusken:</b> ”Då prövar vi. Håll undan, så blir ingen klämd.”</p>',[['fix','Hjälp till att flytta lasten'],['later','Kom tillbaka senare',true]]);return;
 }
 const intro='<div class="ad-illustration" aria-hidden="true"><span class="ad-cart"></span></div><p><b>Kusken:</b> ”'+esc(scenery[chapter]?.wagon||scenery[5].wagon)+' Jag vågar inte piska hästarna. Då går axeln av.”</p>'+(state.wagonShoulder?'<p>Jag fick rulla vagnen åt vägkanten så andra kan komma förbi, men jag behöver fortfarande hjälp med axeln.</p>':'');
 const next=state.wagon==='inspected'||state.wagon==='deferred';
 if(next)display('Vagnen på herrgårdsvägen',intro+'<p>Du ser att bakhjulet sjunkit ned och att lasten ligger tungt över axeln. Kusken behöver ett beslut.</p>',[['think','Minns ett råd och prova en lösning'],['smith','Gå till smeden i Verkstäderna'],['later','Låt den stå så länge',true]]);
 else display('Vagnsblockad!',intro+'<p>Vägen är trång, men du kan hjälpa kusken eller välja att gå vidare. Du kan komma tillbaka senare.</p>',[['inspect','Undersök vagnen'],['later','Ta dig förbi och återkom',true]]);
}
function showSmith(){if(state.wagon!=='need-smith')return;
 display('Smeden i Verkstäderna','<p><b>Smeden:</b> ”Ska kusken försöka dra loss hela lasten på en gång? Det förstör hjulet. Lägg ned några säckar, kila under axeln och låt hästarna dra försiktigt.”</p><p><b>Du:</b> ”Då får jag gå tillbaka. Han väntar fortfarande på vägen.”</p>',[['advice','Tack! Jag går tillbaka']]);}
function challenge(type){const q=question((state.history.length||0)+2);
 if(!q){if(type==='wagon')return display('Tänk igenom lösningen','<p>Kusken pekar på det tunga flaket och den sneda axeln. Du kan lossa delar av lasten eller be smeden om hjälp.</p>',[['fix','Lossa lasten och stötta axeln'],['smith','Be smeden om råd',true]]);
  return finishThief(false,'Tjuven försvann innan du hann fram. Ingen daler drogs när ingen repetitionsfråga kunde visas.',false);}
 const label=type==='wagon'?'Minneskrok vid vagnen':'Minnesduell!';
 display(label,'<p>'+(type==='wagon'?'Kusken vill höra hur du tänker. En fråga från något du tidigare arbetat med blir en minneskrok.':'Tjuven springer mot gränden. Du kan använda en minneskrok för att hinna ikapp!')+'</p><p><b>'+esc(q.prompt)+'</b></p><div class="ad-choices">'+q.choices.map((o,i)=>`<button type="button" data-option="${i}">${esc(o)}</button>`).join('')+'</div><p class="ad-note">Det här är en bonusrepetition, inte ett mästarprov.</p>',[]);
 dialog.querySelectorAll('[data-option]').forEach(b=>b.addEventListener('click',()=>{
  const success=q.choices[Number(b.dataset.option)]===q.answer;
  if(type==='wagon'){
   if(success)finishWagon('solved-with-knowledge');
   else display('Vagnen står kvar','<p>Inte den här gången. Kusken vill inte skada hästen eller hjulet. Du får gärna prova ett annat sätt.</p>',[['smith','Be smeden om hjälp'],['fix','Flytta den tyngsta lasten'],['later','Gå vidare så länge',true]]);
  }else finishThief(success,success?'Du hann före tjuven och fick behålla din daler.':'Tjuven hann undan med en daler. Du kan ändå fortsätta äventyret.');
 }));
}
function showThief(){if(!allowed('thief')||state.thief!=='unseen'||(!teacher&&wallet()<1))return;
 state.thiefSeen=true;save();thiefPoint=null;
 display('En ficktjuv!','<p>'+esc(scenery[chapter]?.thief||scenery[5].thief)+'</p><p>En figur rycker åt sig en daler och börjar springa. Du får själv välja om du vill försöka hinna ifatt.</p><p class="ad-note">Du riskerar högst en daler. Ingen viktig kunskap eller något kapitel låses av detta möte.</p>',[['chase','Jaga efter!'],['ignore','Låt tjuven springa',true]]);
}
function showWitness(){if(!allowed('thief')||state.thief==='unseen')return;
 if(state.witness==='recovered'||state.witness==='heard'){
  display('Barnet vid torget','<p><b>Barnet:</b> ”Vi har ju pratat förut. Jag minns att du lyssnade. Det är lugnare på torget i dag.”</p>',[['close','Fortsätt']]);return;
 }
 const intro='<p><b>Barnet:</b> ”Jag såg ficktjuven springa genom gränden. Du såg orolig ut. Vill du veta vad jag lade märke till?”</p>';
 if(state.witness==='cold'){
  display('Barnet minns','<p><b>Barnet:</b> ”Förra gången höjde du rösten åt mig. Jag blev rädd.”</p><p>Du kan be om ursäkt och fråga igen, eller låta saken bero.</p>',[['kind','Be om ursäkt och fråga lugnt'],['cold','Låt barnet vara',true]]);return;
 }
 display('En iakttagelse på torget',intro+'<p class="ad-note">Det här är en frivillig fortsättning på tjuvhändelsen, inte en kunskapsfråga.</p>',[['kind','Fråga lugnt vad barnet såg'],['harsh','Kräv att få veta',true]]);
}
function witnessAnswer(kind){
 if(kind==='harsh'){state.witness='cold';record('witness','unfriendly');display('Barnet drar sig undan','<p><b>Barnet:</b> ”Jag gjorde ingenting! Jag vill inte prata när du skriker.”</p><p>Ni kan mötas igen vid torget. Ett samtal behöver inte sluta så här.</p>',[['close','Fortsätt']]);return;}
 const found=state.thief==='lost'&&returnDaler();state.witness=found?'recovered':'heard';record('witness',found?'recovered-coin':'heard-witness');
 display('Vad barnet såg','<p><b>Du:</b> ”Förlåt om jag gjorde dig rädd. Jag vill förstå vad som hände.”</p><p><b>Barnet:</b> ”Tjuven sprang mot en låda bakom torget.”</p>'+(found?'<p>Barnet visar en daler som tappats vid lådan. Du får tillbaka det du förlorade.</p>':'<p>Ni hjälps åt att reda ut vad som hände, utan att någon får mer straff eller några kunskapsstämplar.</p>'),[['close','Tacka barnet och fortsätt']]);
}
function finishThief(won,message,charge=true){const loss=!won&&charge&&loseDaler();state.thief=won?'won':loss?'lost':'ignored';record('thief',state.thief);
 display(won?'Du hann ikapp!':'Tjuven försvann','<p>'+esc(message)+'</p><p class="ad-note">Sidohändelsen är avslutad. Ditt huvuduppdrag fortsätter som tidigare.</p>',[['close','Fortsätt']]);
}
function journalStatus(){return '<p><b>Vagnen vid herrgårdsvägen:</b> '+({unseen:'Inte upptäckt',inspected:'Undersökt – återvänd om du vill',deferred:'Du kan återvända', 'need-smith':'Sök smeden vid Verkstäderna',advice:'Återvänd till kusken',cleared:'Hjälpt, vägen är fri'}[state.wagon])+'</p>'+
 (allowed('thief')?'<p><b>Ficktjuven:</b> '+({unseen:'Har inte visat sig',won:'Du hann ikapp',lost:'Försvann med en daler',ignored:'Avslutat'}[state.thief])+'</p>'+(state.thief!=='unseen'?'<p><b>Vittnet vid torget:</b> '+({unseen:'Går att prata med',cold:'Vill bli bemött lugnare',recovered:'Du fick tillbaka dalern',heard:'Ni har pratat'}[state.witness])+'</p>':''):'');}
function showJournal(){const buttons=[['close','Tillbaka till spelet']];if(teacher){buttons.unshift(['demo-wagon','Testa vagnsblockad'],...(allowed('thief')?[['demo-thief','Testa ficktjuven']]:[]));}
 display('Sidoäventyr · kapitel '+chapter,'<p>De här händelserna är frivilliga. De kan lösas över flera möten och sparas separat från huvuduppdraget.</p><div class="ad-history">'+journalStatus()+'</div><p class="ad-note">Vagnen finns på landsvägen mellan Verkstäderna och Herrgården. Om smeden behövs ligger Verkstäderna längre västerut. Resor och huvuduppdrag fortsätter som vanligt.</p>',buttons);
}
function updateJournalLabel(){journal.textContent='Händelser'+(state.wagon!=='unseen'||state.thief!=='unseen'?' · ':'')+(state.wagon==='cleared'?'✓':state.wagon==='need-smith'?'!':'');}
journal.addEventListener('click',showJournal);
dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
dialog.addEventListener('keydown',e=>e.stopPropagation());
dialog.addEventListener('click',e=>{
 const b=e.target.closest('[data-adventure]');if(!b)return;
 const code=b.dataset.adventure;
 if(code==='close'||code==='later'){if(code==='later'&&state.wagon==='unseen'){state.wagon='deferred';record('wagon','deferred');}close();}
 else if(code==='demo-wagon'){close();showWagon();}
 else if(code==='demo-thief'){close();if(state.thief==='unseen')showThief();else display('Händelsen har redan hänt','<p>Ficktjuvens händelse är redan avslutad i den här spelvyn. Sparade framsteg behålls.</p>',[['close','Fortsätt']]);}
 else if(code==='inspect'){state.wagon='inspected';record('wagon','inspected');showWagon();}
 else if(code==='think'){state.wagon='inspected';record('wagon','tried-memory');challenge('wagon');}
 else if(code==='smith'){state.wagon='need-smith';record('wagon','asked-smith');showWagon();}
 else if(code==='advice'){state.wagon='advice';record('wagon','smith-advice');close();}
 else if(code==='fix'){finishWagon('helped-manually');}
 else if(code==='chase'){challenge('thief');}
 else if(code==='ignore'){finishThief(false,'Du låter honom gå. Han försvinner med en daler, men vägen är fri.');}
 else if(code==='kind'||code==='harsh'){witnessAnswer(code);}
 else if(code==='cold'){close();}
});
const hasOtherDialogue=()=>!!document.querySelector('dialog[open]:not(#adventureDialog),#ch1Modal:not([hidden]),#meetingDialogue:not([hidden])')||document.body.classList.contains('ch1-open')||!!document.body.dataset.conversation||!!window.UPPDRAG_STORY_WORK?.busy||!!window.UPPDRAG_LIVING_DIALOGUES?.busy;
function tick(now,{region,player,activeRoom=null}={}){
 if(!region?.id||!player||!Number.isFinite(player.x)||!Number.isFinite(player.y))return;
 lastRegion=region.id;atRoom=activeRoom!==null;journal.hidden=atRoom;
 const was=last;last={x:player.x,y:player.y,region:region.id};
 if(activeRoom!==null||region.id!=='main'||scene||dialog.open||hasOtherDialogue())return;
 const moved=was?.region===region.id?Math.hypot(was.x-player.x,was.y-player.y):0;
 if(moved>1&&moved<45){state.distance=Math.min(100000,state.distance+moved);if(Math.floor(state.distance/200)!==Math.floor((state.distance-moved)/200))save();}
 if(teacher||now<2400)return;
 if(state.wagon==='unseen'&&allowed('wagon')&&moved>1&&Math.hypot(player.x-wagonAt.x,player.y-wagonAt.y)<87){showWagon();return;}
 if(state.wagon==='need-smith'&&moved>1&&Math.hypot(player.x-smithAt.x,player.y-smithAt.y)<95){showSmith();return;}
 if(allowed('thief')&&state.thief!=='unseen'&&state.witness==='unseen'&&moved>1&&Math.hypot(player.x-witnessAt.x,player.y-witnessAt.y)<95){showWitness();return;}
 if(!allowed('thief')||state.thief!=='unseen'||wallet()<1||state.distance<780)return;
 if(!spawnedAt){spawnedAt=now;thiefPoint={x:player.x+36,y:player.y+10};}
 if(now-spawnedAt>1100&&moved>1)showThief();
}
function drawWagon(ctx){const x=wagonAt.x,y=wagonAt.y,cleared=state.wagon==='cleared';
 ctx.save();ctx.translate(x,y);if(cleared||state.wagonShoulder)ctx.translate(0,-90);
 ctx.fillStyle='#54433144';ctx.beginPath();ctx.ellipse(0,15,70,16,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#684d38';ctx.fillRect(-50,-18,102,27);
 ctx.fillStyle='#b99b6d';ctx.fillRect(-55,-24,100,16);
 for(const xx of [-32,32]){ctx.fillStyle='#4b3a2b';ctx.beginPath();ctx.arc(xx,10,19,0,7);ctx.fill();ctx.fillStyle='#c2aa80';ctx.beginPath();ctx.arc(xx,10,10,0,7);ctx.fill();}
 ctx.fillStyle='#755d46';ctx.fillRect(-35,-50,70,26);ctx.fillStyle='#dfcca7';ctx.fillRect(-32,-57,64,12);
 ctx.strokeStyle='#4d4030';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(48,-7);ctx.lineTo(86,-14);ctx.stroke();
 ctx.font='bold 18px Georgia';ctx.textAlign='center';ctx.fillStyle='#2f261d';ctx.fillText(cleared?'Kusken':'Vagn!',0,-69);
 ctx.restore();}
function drawSmith(ctx){ctx.save();ctx.translate(smithAt.x,smithAt.y-40);ctx.fillStyle='#514b41';ctx.fillRect(-17,-28,34,38);ctx.beginPath();ctx.arc(0,-38,13,0,7);ctx.fill();ctx.fillStyle='#e9d7b7';ctx.font='bold 17px Georgia';ctx.textAlign='center';ctx.fillText('Smeden',0,-62);ctx.restore();}
function drawWitness(ctx){ctx.save();ctx.translate(witnessAt.x,witnessAt.y);ctx.fillStyle='#8a7355';ctx.beginPath();ctx.arc(0,-43,12,0,7);ctx.fill();ctx.fillStyle='#6c7458';ctx.fillRect(-13,-30,26,34);ctx.fillStyle='#382c22';ctx.font='bold 17px Georgia';ctx.textAlign='center';ctx.fillText('Vittne',0,-64);ctx.restore();}
function drawThief(ctx,now){if(!thiefPoint)return;const p=thiefPoint;
 ctx.save();ctx.translate(p.x+Math.sin(now/170)*10,p.y);
 ctx.fillStyle='#403b35';ctx.beginPath();ctx.arc(0,-28,11,0,7);ctx.fill();ctx.fillRect(-11,-17,22,28);ctx.fillStyle='#866a44';ctx.fillRect(9,1,13,14);ctx.restore();}
function draw(ctx,{region,now=0}={}){if(!ctx||region?.id!=='main')return;
 matrix=ctx.getTransform();
 if(allowed('wagon'))drawWagon(ctx);
 if(state.wagon==='need-smith')drawSmith(ctx);
 if(allowed('thief')&&state.thief!=='unseen')drawWitness(ctx);
 if(thiefPoint&&state.thief==='unseen')drawThief(ctx,now);
}
function inWorld(e){if(!canvas||!matrix)return null;
 const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return null;
 const x=(e.clientX-rect.left)*canvas.width/rect.width,y=(e.clientY-rect.top)*canvas.height/rect.height;
 const m=matrix,den=m.a*m.d-m.b*m.c;if(Math.abs(den)<1e-10)return null;
 return{x:(m.d*(x-m.e)-m.c*(y-m.f))/den,y:(-m.b*(x-m.e)+m.a*(y-m.f))/den};
}
function mapClick(e){if(lastRegion!=='main'||atRoom||scene||dialog.open||hasOtherDialogue())return false;
 const p=inWorld(e);if(!p)return false;
 if(allowed('wagon')&&Math.hypot(p.x-wagonAt.x,p.y-((state.wagon==='cleared'||state.wagonShoulder)?wagonAt.y-90:wagonAt.y))<75){showWagon();return true;}
 if(state.wagon==='need-smith'&&Math.hypot(p.x-smithAt.x,p.y-smithAt.y)<75){showSmith();return true;}
 if(allowed('thief')&&state.thief!=='unseen'&&Math.hypot(p.x-witnessAt.x,p.y-witnessAt.y)<75){showWitness();return true;}
 if(thiefPoint&&Math.hypot(p.x-thiefPoint.x,p.y-thiefPoint.y)<55){showThief();return true;}
 return false;}
if(canvas){canvas.addEventListener('pointerdown',e=>{if(mapClick(e)){e.preventDefault();e.stopImmediatePropagation();}},true);}
function install(){const life=window.UPPDRAG_WORLD_LIFE;
 if(!life||typeof life.tick!=='function'||typeof life.draw!=='function')throw Error('Händelserna behöver spelvärldens gemensamma rörelsemotor.');
 const oldTick=life.tick,oldDraw=life.draw;
 life.tick=function(now,config){const ret=oldTick.apply(this,arguments);tick(now,config);return ret;};
 life.draw=function(ctx,config){const ret=oldDraw.apply(this,arguments);draw(ctx,config);return ret;};
 const keyboard=window.UPPDRAG_WORLD_KEYBOARD;
 if(keyboard&&typeof keyboard.tick==='function'){const old=keyboard.tick;keyboard.tick=function(){if(blocking)return;return old.apply(this,arguments);};}
}
const api={get blocking(){return blocking;},get busy(){return !!scene;},get chapter(){return chapter;},get state(){return JSON.parse(JSON.stringify(state));},get registry(){return Array.from(catalog.values()).map(x=>({...x}));},register(def){if(!def||typeof def.id!=='string'||!/^[a-z][a-z0-9-]{2,48}$/.test(def.id)||catalog.has(def.id))return false;catalog.set(def.id,Object.freeze({...def}));return true;},openJournal:showJournal,openWagon:showWagon,openSmith:showSmith,openThief:showThief,openWitness:showWitness,resetChapterEvents(){state.wagon='unseen';state.wagonSeen=false;state.wagonShoulder=false;state.thief='unseen';state.thiefSeen=false;state.witness='unseen';state.distance=0;state.history=[];spawnedAt=0;thiefPoint=null;save();},version:'1.5.0'};
window.UPPDRAG_EVENT_ENGINE=api;
api.register({id:'wagon-blockade',type:'sidequest',region:'main',chapters:[1,2,3,4,5,6,7,8,9,10],multiStop:true,nonBlocking:true});
api.register({id:'pickpocket',type:'surprise',region:'main',chapters:[1,2,4,5,7,9,10],usesRetrieval:true,maximumLoss:1});
api.register({id:'street-witness',type:'follow-up',region:'main',chapters:[1,2,4,5,7,9,10],dependsOn:'pickpocket',remembersChoice:true});
install();updateJournalLabel();
})();
