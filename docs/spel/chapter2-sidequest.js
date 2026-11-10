/* Sängen vid fönstret. Separate story state: never alters tests or currency. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==2)return;
const key='uppdrag1700.ch2-window-bed.v1',Q=window.UPPDRAG_CH2_QUILT,engine=window.UPPDRAG_EVENT_ENGINE;
let old;try{old=JSON.parse(localStorage.getItem(key)||'null');}catch{}
const phases=['available','accepted','repairing','ready','delivered'];
const s=old?.v===1&&phases.includes(old.phase)?old:{v:1,phase:'available',layout:{},pattern:null,metKarin:false,afterKarin:false,afterChild:false};
s.layout=Object.fromEntries(Object.entries(s.layout||{}).filter(([id,p])=>Q.pieces[id]&&Number.isFinite(p?.x)&&Number.isFinite(p?.y)).map(([id,p])=>[id,{x:Math.max(15,Math.min(585,p.x)),y:Math.max(15,Math.min(265,p.y))}]));
if(!['sail','stripe'].includes(s.pattern))s.pattern=null;
let selected='wide',cursor={x:300,y:140},work=null,setting=null,board=null,message=null,bedButton=null,busy=false;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const save=()=>{try{localStorage.setItem(key,JSON.stringify(s));}catch{}};
const childPose=tall=>tall?[455,838,.43]:[986,550,.43];
const child={name:'Barnet',color:'#8c775d',role:'child'};
const room=()=>interior?.kind||null;
function idle(){return !busy&&!engine.busy&&!UPPDRAG_MEETINGS.state.talking&&document.getElementById('ch1Modal').hidden;}
function canTalk(kind){return room()===kind&&idle();}
function redraw(){if(interior){renderInterior();UPPDRAG_MEETINGS.redraw?.();}updateButton();}
function speech(kind,lines,choices=[],action=()=>{}){
 UPPDRAG_ROOM_STAGING.approach(performance.now());
 return engine.speakRoom({room:kind,title:'Sängen vid fönstret',lines,choices,action,closed:()=>UPPDRAG_ROOM_STAGING.returnToWork(performance.now()),pose(who,geo){return who==='Barnet'?childPose(geo.w/geo.h<1.02):geo.poses[who==='Du'?0:1];}});
}
function go(kind){if(!idle())return false;if(interior)leaveInterior();const b=region.buildings.find(b=>ROOM_BY_REGION[region.id]?.[b.name]===kind);return b?requestInterior(b):false;}
function openBed(){
 if(!canTalk('barnhus'))return false;
 if(s.phase==='available')return speech('barnhus',[
  ['Barnet','Jag har vänt på det tre gånger. Hålet följer med.'],['Du','Har ni försökt laga det?'],['Siri','Ja. Men tyget spricker bredvid sömmen. Karin i Bostadskvarteren har bättre hand med sådant.']
 ],[['accept','Jag kan ta det till Karin.'],['later','Jag kommer tillbaka senare.']],id=>{
  if(id==='accept'&&room()==='barnhus'){s.phase='accepted';save();redraw();speech('barnhus',[['Siri','Tack. Jag lägger fram ett annat täcke så länge.']]);}
  else if(id==='later')speech('barnhus',[['Barnet','Jag är här när du kommer tillbaka.']]);
 });
 if(s.phase==='accepted'||s.phase==='repairing')return speech('barnhus',[['Barnet','Mitt täcke är det med revan. Karin kanske kan laga det.']], [['karin','Gå till Karin i Bostadskvarteren.'],['later','Vi ses senare.']],id=>{if(id==='karin')go('homes');});
 if(s.phase==='ready')return speech('barnhus',[['Du','Karin har lagat täcket. Vilken av de här små lapparna vill du ha?']], [['sail','Visa segellappen.'],['stripe','Visa den randiga lappen.']],id=>{
  if(room()!=='barnhus'||s.phase!=='ready'||!['sail','stripe'].includes(id))return;
  s.pattern=id;s.phase='delivered';save();redraw();
  speech('barnhus',[[ 'Barnet',id==='sail'?'Den där ser ut som ett segel. Den vill jag ha!':'Den randiga! Då känner jag igen mitt täcke direkt.'],['Siri','Då blir det den. Det är ju du som ska sova här.'],['Barnet','Nu kan jag ha vilken sida uppåt jag vill.']]);
 });
 const line=s.afterChild?(s.pattern==='sail'?'Det där är mitt täcke. Det med seglet.':'Det där är mitt täcke. Det randiga.'):'Titta! Jag behöver inte gömma hålet längre.';
 s.afterChild=true;save();return speech('barnhus',[['Barnet',line]]);
}
function openKarin(){
 if(!canTalk('homes'))return false;
 const met=s.metKarin;s.metKarin=true;save();
 if(s.phase==='available')return speech('homes',[['Karin',met?'Hej igen! Jag har just lagt fram tyget.':'Hej! Jag heter Karin. Jag syr och lagar kläder här vid bordet.']]);
 if(s.phase==='accepted'||s.phase==='repairing')return speech('homes',[
  ['Karin',met?'Tillbaka redan? Vad har du med dig?':'Lägg det här. Jag ser var det har spruckit.'],['Du','Går det att laga?'],['Karin','Ja, men inte med den där lilla lappen. Vi behöver täcka hela revan. Hjälp mig välja.']
 ],[['work','Visa tygbitarna.'],['later','Jag fortsätter senare.']],id=>{if(id==='work')openWorkshop();});
 if(s.phase==='ready')return speech('homes',[['Karin','Täcket är lagat. Fråga vilket mönster barnet tycker om. Båda fungerar.']], [['return','Tillbaka till Barnhuset.'],['later','Jag stannar en stund.']],id=>{if(id==='return')go('barnhus');});
 const lines=s.afterKarin?[['Karin','En stor lapp håller bättre när tyget runt revan är tunt.']]:[['Karin','Blev barnet nöjt?'],['Du','Ja, och valde en lapp till täcket.'],['Karin','Bra. Något ska man få välja själv.']];s.afterKarin=true;save();return speech('homes',lines);
}
function fabric(g,x,y,w,h,pattern=null,tear=false){
 g.save();g.fillStyle=window.UPPDRAG_PAPER_FIBRES?.material(g,'#7d8971','piece')||'#7d8971';g.strokeStyle='#4c5748';g.lineWidth=1.4;g.beginPath();g.moveTo(x,y+2);g.lineTo(x+w-3,y);g.lineTo(x+w,y+h-1);g.lineTo(x+2,y+h);g.closePath();g.fill();g.stroke();
 if(tear){g.fillStyle='#cfc1a4';g.beginPath();g.moveTo(x+w*.36,y+h*.23);for(let i=0;i<6;i++)g.lineTo(x+w*(i%2?.61:.42),y+h*(.23+i*.09));g.lineTo(x+w*.66,y+h*.78);g.lineTo(x+w*.58,y+h*.32);g.closePath();g.fill();}
 if(pattern){
  g.fillStyle='#d7c5a4';g.fillRect(x+w*.42,y+h*.18,w*.43,h*.60);g.strokeStyle='#534e40';g.setLineDash([3,2]);g.strokeRect(x+w*.42,y+h*.18,w*.43,h*.60);g.setLineDash([]);
  if(pattern==='sail'){g.fillStyle='#6a7b83';g.beginPath();g.moveTo(x+w*.64,y+h*.25);g.lineTo(x+w*.64,y+h*.65);g.lineTo(x+w*.47,y+h*.63);g.closePath();g.fill();g.beginPath();g.moveTo(x+w*.68,y+h*.33);g.lineTo(x+w*.8,y+h*.62);g.lineTo(x+w*.68,y+h*.62);g.closePath();g.fill();}
  else if(pattern==='stripe'){g.strokeStyle='#8b6b4e';g.lineWidth=3;for(let i=0;i<3;i++){g.beginPath();g.moveTo(x+w*(.48+i*.12),y+h*.25);g.lineTo(x+w*(.48+i*.12),y+h*.7);g.stroke();}}
 }
 g.restore();
}
function drawBed(g,x,feet,w){
 const borrowed=s.phase!=='available'&&s.phase!=='delivered';
 fabric(g,x+63,feet-87,w-76,48,s.phase==='delivered'?s.pattern:null,s.phase==='available');
 if(borrowed){g.save();g.strokeStyle='#a9a183';g.lineWidth=2;for(let i=0;i<4;i++){g.beginPath();g.moveTo(x+68,feet-78+i*9);g.lineTo(x+w-17,feet-78+i*9);g.stroke();}g.restore();}
}
function drawRoomProps(g,kind,tall,now,puppets){
 if(kind==='barnhus'){
  const pose=childPose(tall);puppets.side(...pose,child,false,now,engine.roomSpeaker==='Barnet',false,false,0,0,null);
  if(s.phase==='available'&&!reduced()){
   const x=tall?244:770,feet=tall?687:537;
   g.save();g.fillStyle='#9eaa8b';g.beginPath();g.moveTo(x+136,feet-50);g.lineTo(x+172,feet-47+Math.sin(now/1600)*3);g.lineTo(x+156,feet-67);g.closePath();g.fill();g.restore();
  }
 }
 if(kind==='homes'&&['repairing','ready'].includes(s.phase)){
  const x=tall?280:410,y=tall?807:476;fabric(g,x,y-28,115,39,s.phase==='ready'?'repair':null,s.phase==='repairing');
  if(s.phase==='ready'&&!reduced()&&Date.now()-(s.sewnAt||0)<900){g.save();g.strokeStyle='#4d4638';g.lineWidth=1;const progress=(Date.now()-s.sewnAt)/900;g.beginPath();g.moveTo(x+50,y-22);g.lineTo(x+50+progress*42,y-4);g.stroke();g.restore();}
 }
}
function goal(){return ({available:'Ett trasigt täcke finns på sängen vid fönstret på Barnhuset.',accepted:'Visa täcket för Karin i Bostadskvarteren.',repairing:'Laga täcket tillsammans med Karin i Bostadskvarteren.',ready:'Ta tillbaka det lagade täcket till barnet på Barnhuset.',delivered:'Sängen vid fönstret – klart. Täcket är lagat.'})[s.phase];}
function updateButton(){
 if(!bedButton)return;const geo=UPPDRAG_MEETINGS.geometryForRoom();const show=room()==='barnhus'&&idle()&&geo;
 bedButton.hidden=!show;if(!show)return;
 const tall=geo.w/geo.h<1.02,x=tall?244:770,feet=tall?687:537;
 Object.assign(bedButton.style,{left:(geo.left+geo.p.x+(x-4)*geo.p.scale)+'px',top:(geo.top+geo.p.y+(feet-160)*geo.p.scale)+'px',width:Math.max(100,240*geo.p.scale)+'px',height:Math.max(90,Math.max(185,childPose(tall)[1]+15-(feet-160))*geo.p.scale)+'px'});
 bedButton.setAttribute('aria-label',s.phase==='delivered'?'Prata med barnet vid det lagade täcket':'Undersök sängen och prata med barnet om täcket');
}
function paintBoard(){
 if(!board)return;const g=board.getContext('2d');g.clearRect(0,0,600,280);fabric(g,20,15,560,250,null,false);
 g.fillStyle='#d7cab3';g.beginPath();g.moveTo(245,95);g.lineTo(270,100);g.lineTo(260,120);g.lineTo(290,131);g.lineTo(281,151);g.lineTo(339,167);g.lineTo(355,185);g.lineTo(316,180);g.lineTo(310,160);g.lineTo(277,153);g.lineTo(282,133);g.lineTo(247,121);g.closePath();g.fill();
 if(s.guide){g.save();g.strokeStyle='#f6efdc';g.lineWidth=2;g.setLineDash([6,4]);g.strokeRect(Q.required.x,Q.required.y,Q.required.w,Q.required.h);g.restore();}
 for(const [id,p]of Object.entries(s.layout)){const piece=Q.pieces[id];g.save();g.globalAlpha=1;g.fillStyle=window.UPPDRAG_PAPER_FIBRES?.material(g,'#b0a38a','piece')||'#b0a38a';g.fillRect(p.x-piece.w/2,p.y-piece.h/2,piece.w,piece.h);g.strokeStyle='#514a3f';g.lineWidth=id===selected?3:1;g.strokeRect(p.x-piece.w/2,p.y-piece.h/2,piece.w,piece.h);g.restore();}
 g.save();g.strokeStyle='#fff9ec';g.lineWidth=2;g.beginPath();g.moveTo(cursor.x-10,cursor.y);g.lineTo(cursor.x+10,cursor.y);g.moveTo(cursor.x,cursor.y-10);g.lineTo(cursor.x,cursor.y+10);g.stroke();g.restore();
 work.querySelectorAll('[data-piece]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.piece===selected)));
}
function place(x,y){cursor={x:Math.max(110,Math.min(490,Math.round(x/10)*10)),y:Math.max(80,Math.min(210,Math.round(y/10)*10))};s.layout[selected]={...cursor};save();message.textContent='Flytta biten om du vill, eller välj en till. När revan är täckt kan du visa Karin.';paintBoard();}
function closeWorkshop(){if(!work)return;work.remove();work=null;setting=null;board=null;message=null;busy=false;roomFooter.inert=false;redraw();document.getElementById('meetingPerson')?.focus({preventScroll:true});}
function paintSetting(){
 if(!setting)return;UPPDRAG_ROOM_ART.render(setting,'homes');const r=setting.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),tall=r.width/r.height<1.02,D=tall?{w:720,h:1040}:{w:1280,h:720},scale=Math.min(r.width/D.w,r.height/D.h),g=setting.getContext('2d');
 g.save();g.setTransform(d,0,0,d,0,0);g.translate((r.width-D.w*scale)/2,(r.height-D.h*scale)/2);g.scale(scale,scale);UPPDRAG_MEETINGS.drawRoomPerson(g,tall?[220,965,.7]:[270,680,.8],{name:'Karin',color:'#876d5d',woman:true,apron:true,role:'karin'},performance.now(),false);g.restore();
}
function openWorkshop(){
 if(room()!=='homes'||!idle()||!['accepted','repairing'].includes(s.phase))return false;
 s.phase='repairing';save();busy=true;roomFooter.inert=true;work=document.createElement('section');work.id='quiltWorkshop';work.setAttribute('role','dialog');work.setAttribute('aria-modal','true');work.setAttribute('aria-label','Karins tygbord');
 work.innerHTML='<canvas class="quiltSetting" aria-hidden="true"></canvas><article class="quiltSheet"><button data-quilt="close">← Till Karins rum</button><h2>Laga täcket med Karin</h2><p>Välj en tygbit och sedan var den ska ligga. Täck hela revan och lite av tyget runt kanten. En bred bit eller flera smala kan fungera.</p><div class="quiltPieces" role="group" aria-label="Tygbitar">'+Object.entries(Q.pieces).map(([id,p])=>'<button data-piece="'+id+'" aria-pressed="false">'+p.label+'</button>').join('')+'</div><canvas id="quiltBoard" width="600" height="280" tabindex="0" role="application" aria-label="Täcket: klicka för att lägga tyg. Med tangentbord: flytta krysset med pilarna och lägg vald bit med Enter."></canvas><p class="quiltMessage" aria-live="polite">Du kan flytta bitarna och prova så många gånger du vill.</p><div class="quiltActions"><button data-quilt="check">Visa Karin</button><button data-quilt="guide">Visa hur bitarna kan ligga</button><button data-quilt="clear">Ta bort bitarna</button></div><p class="quiltNote">Pilar flyttar krysset. Enter lägger den valda tygbiten. Alla försök är fria.</p></article>';
 stage.append(work);setting=work.querySelector('.quiltSetting');board=work.querySelector('#quiltBoard');message=work.querySelector('.quiltMessage');paintSetting();paintBoard();
 work.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.piece){selected=b.dataset.piece;paintBoard();board.focus();return;}
  const action=b.dataset.quilt;
  if(action==='close')closeWorkshop();
  if(action==='clear'){s.layout={};save();paintBoard();message.textContent='Nu kan du prova en annan lösning.';}
  if(action==='guide'){s.guide=true;save();paintBoard();message.textContent='Täck också den streckade kanten. Prova en bred bit mitt på revan, eller två smala som överlappar.';}
  if(action==='check'){
   if(!Q.covers(s.layout)){message.textContent='Karin: Nästan. Här sticker hålet fortfarande fram. Pröva en större bit eller lägg till en till.';return;}
   s.phase='ready';s.sewnAt=Date.now();save();closeWorkshop();speech('homes',[['Karin','Där! Nu finns det tyg att fästa sömmen i. Jag syr fast det.'],['Karin','Fråga vilket mönster barnet tycker om. Båda fungerar.']]);
  }
 });
 board.addEventListener('click',e=>{const r=board.getBoundingClientRect();place((e.clientX-r.left)*600/r.width,(e.clientY-r.top)*280/r.height);});
 work.querySelector('[data-piece]')?.focus();return true;
}
function handleKeydown(e){
 if(!work||e.isComposing||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)closeWorkshop();return;}
 if(e.key==='Tab'){const items=[...work.querySelectorAll('button,[tabindex="0"]')],at=items.indexOf(document.activeElement),next=items[(at+(e.shiftKey?-1:1)+items.length)%items.length];e.preventDefault();e.stopImmediatePropagation();next?.focus();return;}
 if(e.target!==board)return;
 if(e.key.startsWith('Arrow')){e.preventDefault();e.stopImmediatePropagation();cursor.x=Math.max(110,Math.min(490,cursor.x+(e.key==='ArrowRight'?10:e.key==='ArrowLeft'?-10:0)));cursor.y=Math.max(80,Math.min(210,cursor.y+(e.key==='ArrowDown'?10:e.key==='ArrowUp'?-10:0)));paintBoard();}
 if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)place(cursor.x,cursor.y);}
}
const style=document.createElement('style');style.textContent='#ch2BedButton{position:absolute;z-index:5;background:transparent;border:0;cursor:pointer;padding:0}#ch2BedButton span{position:absolute;bottom:0;left:0;padding:4px 7px;font:13px Georgia;background:#fff6e3;border:1px solid #a69576;border-radius:4px;color:#352b20}#ch2BedButton:focus-visible{outline:3px solid #286472;outline-offset:2px}#quiltWorkshop{position:absolute;inset:0;z-index:48;background:#bead92;color:#352b20}#quiltWorkshop .quiltSetting{position:absolute;inset:0;width:100%;height:100%}.quiltSheet{position:absolute;left:64%;top:50%;transform:translate(-50%,-50%);width:min(700px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;box-sizing:border-box;padding:20px;background:#fffcf3;border:1px solid #a99778;box-shadow:8px 10px 0 #41362c30;font:16px/1.4 Georgia}.quiltSheet h2{font:600 25px Georgia}.quiltSheet button{min-height:44px;padding:8px 11px;font:14px Georgia;background:#f0e7d5;color:#352b20;border:1px solid #9c896b;border-radius:4px;cursor:pointer}.quiltSheet button:focus-visible,#quiltBoard:focus-visible{outline:3px solid #286472;outline-offset:2px}.quiltSheet [aria-pressed="true"]{outline:2px solid #514b40}.quiltPieces,.quiltActions{display:flex;gap:7px;flex-wrap:wrap}.quiltPieces button{flex:1 1 110px}#quiltBoard{width:100%;height:auto;margin-top:12px;touch-action:manipulation;display:block}.quiltMessage{min-height:44px}.quiltNote{font:13px system-ui}@media(max-width:900px){.quiltSheet{left:50%;padding:15px}.quiltSheet h2{font-size:22px}}';document.head.append(style);
bedButton=document.createElement('button');bedButton.id='ch2BedButton';bedButton.type='button';bedButton.hidden=true;bedButton.innerHTML='<span>Sängen vid fönstret</span>';bedButton.addEventListener('click',openBed);roomView.append(bedButton);
const tick=UPPDRAG_MEETINGS.tick;UPPDRAG_MEETINGS.tick=function(now){const result=tick.apply(this,arguments);if(work&&room()!=='homes')closeWorkshop();updateButton();return result;};
window.addEventListener('resize',()=>{if(work)paintSetting();updateButton();});
window.UPPDRAG_CH2_BED={openBed,openKarin,handleKeydown,drawBed,drawRoomProps,goal,get busy(){return busy;},get state(){return JSON.parse(JSON.stringify(s));},animating(now,motionReduced){return !motionReduced&&(room()==='barnhus'&&s.phase==='available'||room()==='homes'&&s.phase==='ready'&&Date.now()-(s.sewnAt||0)<900);},siriLine(){if(s.phase!=='delivered'||s.afterSiri)return '';s.afterSiri=true;save();return 'Det var bra att ni kunde hjälpas åt.';},journalHTML:()=>'<p><b>Sängen vid fönstret:</b> '+goal()+'</p>'};
engine.register({id:'ch2-window-bed',type:'sidequest',chapters:[2],optional:true,usesKnowledgeStamps:false});save();
})();
