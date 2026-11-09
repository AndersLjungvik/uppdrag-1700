/* Hat merchant, wardrobe and player-only paper headwear. The existing world
 * loop owns movement and drawing; purchases never alter learning progress. */
(function(){
'use strict';
function stallGeometry(square,merchant){
 const dx=merchant.x-square.x,dy=merchant.y-square.y,length=Math.hypot(dx,dy)||1;
 return {x:merchant.x-dx/length*36,y:merchant.y-dy/length*36,angle:Math.atan2(dy,dx)+Math.PI/2};
}
function stallHit(stall,point){
 const dx=point.x-stall.x,dy=point.y-stall.y,c=Math.cos(stall.angle),s=Math.sin(stall.angle);
 const x=c*dx+s*dy,y=-s*dx+c*dy;
 return Math.abs(x)<=43&&Math.abs(y)<=22;
}
function source(name,text){
 const edit=(a,b)=>{if(text.split(a).length!==2)throw Error('Hatthandeln: ankaret matchar inte '+name+': '+a.slice(0,50));text=text.replace(a,b);};
 if(/^meeting-ch[1-5]-pilot\.js$/.test(name)){
  edit("role='',headTilt=0,activity=null){","role='',headTilt=0,activity=null,headwear=null){");
  edit("who.role||'',headTilt,activity);ctx.restore();","who.role||'',headTilt,activity,who===CAST.player?window.UPPDRAG_HAT_SHOP?.wear:null);ctx.restore();");
  edit("if(!woman){oval(-1,-301,47,9,color);poly([[-30,-303],[-15,-328],[15,-327],[28,-301]],color)}","if(!woman){if(headwear&&headwear.id!=='plain')window.UPPDRAG_HAT_SHOP.drawSideHat(ctx,headwear);else{oval(-1,-301,47,9,color);poly([[-30,-303],[-15,-328],[15,-327],[28,-301]],color)}}");
  edit('  ctx.restore();\n}\nfunction limb(',"  if(who===CAST.player)window.UPPDRAG_HAT_SHOP?.drawMapHat(ctx);\n  ctx.restore();\n}\nfunction limb(");
 }
 if(/^world-keyboard(?:-ch\d+)?\.js$/.test(name)){
  edit('return !!(window.UPPDRAG_STORY_WORK?.busy||','return !!(window.UPPDRAG_HAT_SHOP?.busy||window.UPPDRAG_STORY_WORK?.busy||');
  edit('  function interact(){','  function interact(){\n    if(window.UPPDRAG_HAT_SHOP?.busy)return false;\n    if(window.UPPDRAG_HAT_SHOP?.interact())return true;');
 }
 if(['world-street-pilot.js','world-classic-pilot.js'].includes(name)){
  // The integration adds the event blocker before this adapter runs.
  edit('&&!window.UPPDRAG_EVENT_ENGINE?.blocking)', '&&!window.UPPDRAG_EVENT_ENGINE?.blocking&&!window.UPPDRAG_HAT_SHOP?.busy)');
 }
 return text;
}
const api={source,stallGeometry,stallHit};window.UPPDRAG_HAT_SHOP=api;
if(typeof document==='undefined'||!document.getElementById('stage')||![3,4,5].includes(window.__INTEGRATED_CHAPTER))return;
const modelAPI=window.UPPDRAG_HAT_SHOP_MODEL;if(!modelAPI)throw Error('Hatthandelns varor kunde inte laddas.');
const KEY='uppdrag1700.wardrobe.v1',chapter=window.__INTEGRATED_CHAPTER;
const pilot=()=>window['UPPDRAG_CH'+chapter+'_PILOT'];
const world=()=>typeof region==='undefined'?null:region,point=()=>typeof player==='undefined'?null:player;
const outside=()=>world()?.id==='main'&&!(typeof interior!=='undefined'&&interior)&&!(typeof sailing!=='undefined'&&sailing)&&!(typeof voyage!=='undefined'&&voyage);
const distance=(a,b)=>a&&b?Math.hypot(a.x-b.x,a.y-b.y):Infinity;
const clear=(r,a,b,radius=24)=>!!window.UPPDRAG_WORLD_KEYBOARD?.clearSegment?.(r,a,b,radius);
const positions=new WeakMap();
function position(r=world()){
 if(r?.id!=='main')return null;
 if(!positions.has(r)){
  const square=navigationPoint(r,'square');let found=null;
  for(const [dx,dy] of [[-96,-165],[-142,-130],[-155,105],[150,117],[172,-80]]){
   const p={id:'hat-merchant',name:'Hatthandlaren',x:square.x+dx,y:square.y+dy,radius:12,solid:true};
   const length=Math.hypot(dx,dy),arrival={x:p.x-dx/length*72,y:p.y-dy/length*72},stall=stallGeometry(square,p);
   const corners=[[-38,-16],[38,-16],[38,16],[-38,16]].map(([x,y])=>({x:stall.x+Math.cos(stall.angle)*x-Math.sin(stall.angle)*y,y:stall.y+Math.sin(stall.angle)*x+Math.cos(stall.angle)*y}));
   if(clear(r,p,p,40)&&clear(r,arrival,arrival)&&clear(r,square,arrival)&&corners.every(c=>clear(r,c,c,10))){found={...p,arrival,stall};break;}
  }
  positions.set(r,found);
 }
 return positions.get(r);
}
const near=()=>outside()&&distance(point(),position())<=82&&clear(world(),point(),position(),0);
const occupied=()=>!!(window.UPPDRAG_MENU_OPEN?.()||pilot()?.studyBusy||window.UPPDRAG_MEETINGS?.state?.talking||window.UPPDRAG_LIVING_DIALOGUES?.active||window['UPPDRAG_CH'+chapter+'_CITY_LIFE']?.active||window.UPPDRAG_STORY_WORK?.busy||window.UPPDRAG_EVENT_ENGINE?.blocking||window.UPPDRAG_APPLE_THREATS?.busy||document.querySelector('dialog[open]:not(#hatShopDialog),#ch1Modal:not([hidden])'));
let view='closed',pendingRoute=null,matrix=null,returnFocus=null;
let raw={};try{raw=JSON.parse(localStorage.getItem(KEY)||'{}');}catch{}
const model=modelAPI.create(raw,{
 canBuy:()=>view==='shop'&&dialog.open&&near()&&!occupied(),
 wallet:()=>pilot()?.state?.daler,
 debit(amount,expected){const p=pilot();if(!p||p.state.daler!==expected)return false;p.state.daler-=amount;p.persist();p.refresh();return true;},
 save:value=>localStorage.setItem(KEY,JSON.stringify(value))
});
const style=document.createElement('style');style.textContent=`
#hatTools{position:absolute;top:60px;left:10px;z-index:27;display:grid;gap:5px;width:113px}
#hatTools[data-room=true]{top:124px}
#hatTools button{min-height:44px;padding:7px 8px;font:13px system-ui;color:#3c2e25;background:#fff7e7ed;border:1px solid #967f5b;border-radius:7px;cursor:pointer}
body.ch1-open #hatTools,body[data-conversation] #hatTools,body[data-room-side-speech] #hatTools{display:none}
#hatShopDialog{width:min(640px,calc(100% - 20px));max-height:88dvh;padding:22px;border:1px solid #8e7859;border-radius:12px;color:#382f25;background:#fbf2e2;font:15px/1.45 system-ui;box-shadow:0 12px 55px #241c1540;overscroll-behavior:contain}
#hatShopDialog::backdrop{background:#29251c80}
#hatShopDialog h2{margin:0;font:600 29px Georgia,serif}#hatShopDialog p{margin:8px 0 13px}
#hatShopDialog .hat-top{display:flex;justify-content:space-between;gap:14px;align-items:start}
#hatShopDialog button{min-height:44px;padding:9px 12px;border:1px solid #947e5f;border-radius:6px;background:#fffaf0;color:#382f25;font:14px system-ui;cursor:pointer}
#hatShopDialog button:focus-visible,#hatTools button:focus-visible{outline:3px solid #286472;outline-offset:2px}
#hatShopDialog .hat-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
#hatShopDialog .hat-card{border:1px solid #c4b18e;background:#fffaf080;border-radius:8px;padding:12px;display:flex;flex-direction:column;align-items:center;text-align:center}
#hatShopDialog .hat-card[data-worn=true]{border:2px solid #59765d;padding:11px;background:#e5eadb}
#hatShopDialog .hat-card canvas{width:112px;height:69px;max-width:100%}
#hatShopDialog .hat-card strong{font:600 17px Georgia,serif;margin:5px 0 4px;min-height:22px}
#hatShopDialog .hat-price{font-size:13px;color:#675b48;min-height:22px}#hatShopDialog .hat-card button{width:100%;margin-top:8px;background:#426755;color:#fff;border-color:#426755}
#hatShopDialog button:disabled{opacity:.6;cursor:default}#hatShopStatus{min-height:24px;color:#3c654d;font-weight:600}
#hatShopDialog .hat-balance{font-weight:600;padding:7px 0;border-bottom:1px solid #cbb997}
#hatShopDialog .hat-walk{margin-top:15px}
@media(max-width:480px){#hatTools{left:6px;top:56px;width:109px}#hatShopDialog{padding:16px}#hatShopDialog h2{font-size:24px}#hatShopDialog .hat-card{padding:8px}#hatShopDialog .hat-card[data-worn=true]{padding:7px}#hatShopDialog .hat-card strong{font-size:16px;min-height:38px}#hatShopDialog .hat-card button{padding:8px 5px}}
`;document.head.append(style);
const tools=document.createElement('div');tools.id='hatTools';
const travelButton=document.createElement('button'),wardrobeButton=document.createElement('button');
travelButton.type=wardrobeButton.type='button';travelButton.textContent='Hatthandeln';wardrobeButton.textContent='Mina hattar';tools.append(travelButton,wardrobeButton);
document.getElementById('stage').append(tools);
const dialog=document.createElement('dialog');dialog.id='hatShopDialog';dialog.setAttribute('aria-labelledby','hatShopTitle');document.body.append(dialog);
function stop(){window.UPPDRAG_WORLD_KEYBOARD?.clear();if(typeof path!=='undefined')path=[];pendingRoute=null;}
function close(){view='closed';if(dialog.open)dialog.close();(returnFocus?.isConnected?returnFocus:document.getElementById('world'))?.focus?.({preventScroll:true});}
function render(message=''){
 const buying=view==='shop',items=modelAPI.catalog.filter(h=>buying||model.owns(h.id)),balance=pilot()?.state?.daler??0;
 dialog.innerHTML='<div class="hat-top"><h2 id="hatShopTitle">'+(buying?'Hatthandlaren':'Mina hattar')+'</h2><button type="button" data-hat-close>Till spelet</button></div>'+
  '<p>'+(buying?'En ny hatt? Här finns mössor och trekantshattar.':'Välj vilken hatt du vill ha på dig.')+'</p>'+
  '<p class="hat-balance">Du har '+balance+' daler.</p><div class="hat-grid">'+items.map(h=>{
   const owned=model.owns(h.id),worn=model.wear.id===h.id;
   return '<article class="hat-card" data-worn="'+worn+'"><canvas width="224" height="138" data-hat-picture="'+h.id+'" aria-hidden="true"></canvas><strong>'+h.name+'</strong><span class="hat-price">'+(owned?'Din hatt':h.price+' daler')+'</span><button type="button" data-hat="'+h.id+'" '+(worn?'disabled':'')+'>'+ (worn?'På dig':owned?'Ta på':balance<h.price?'Saknar daler':'Köp · '+h.price+' daler')+'</button></article>';
  }).join('')+'</div><p id="hatShopStatus" role="status" aria-live="polite"></p>'+
  (buying?'<small>Köp en gång. Byt mellan dina hattar gratis.</small>':'<button class="hat-walk" type="button" data-hat-travel>Gå till hatthandeln på torget</button>');
 dialog.querySelector('#hatShopStatus').textContent=message;
 for(const canvas of dialog.querySelectorAll('[data-hat-picture]')){
  const ctx=canvas.getContext('2d'),hat=modelAPI.catalog.find(h=>h.id===canvas.dataset.hatPicture);
  ctx.scale(2,2);ctx.translate(56,350);drawSideHat(ctx,hat);
 }
}
function open(mode){
 if(occupied()||(mode==='shop'&&!near()))return false;
 returnFocus=document.activeElement;stop();view=mode;render();dialog.showModal();dialog.querySelector('[data-hat-close]')?.focus({preventScroll:true});return true;
}
function travel(){
 if(!outside()||occupied()||view!=='closed')return false;
 const merchant=position();if(!merchant)return false;if(near())return open('shop');
 const next=window.UPPDRAG_EVENT_APPROACH.routeBetween(world(),point(),merchant.arrival,id=>navigationPoint(world(),id),(a,b)=>clear(world(),a,b),true);
 if(!next?.length){setMessage('Hatthandeln','Gå till torget för att hitta hatthandlaren.');return false;}
 window.UPPDRAG_WORLD_KEYBOARD?.clear();if(typeof cancelPersonArrival==='function')cancelPersonArrival();
 if(typeof pending!=='undefined')pending=null;if(typeof returnPending!=='undefined')returnPending=false;if(typeof pendingRoom!=='undefined')pendingRoom=null;
 if(typeof pendingStreetChat!=='undefined')pendingStreetChat=null;window['UPPDRAG_CH'+chapter+'_CITY_LIFE']?.releaseHold?.();
 path=next;pendingRoute=next;follow=true;setMessage('Hatthandeln','Du går till hatthandlaren på torget.');return true;
}
travelButton.addEventListener('click',travel);wardrobeButton.addEventListener('click',()=>open('wardrobe'));
dialog.addEventListener('close',()=>{view='closed';});
dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
dialog.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.hasAttribute('data-hat-close'))return close();
 if(button.hasAttribute('data-hat-travel')){close();return travel();}
 const id=button.dataset.hat;if(!id)return;
 const result=view==='shop'?model.buy(id):model.equip(id);
 const message=result.ok?(result.paid?'Tack! Nu har du den på dig.':'Nu har du bytt hatt.'):
  result.reason==='funds'?'Du behöver fler daler till den hatten.':result.reason==='away'?'Gå till hatthandlaren på torget för att köpa.':'Det gick inte att köpa nu. Försök igen.';
 render(message);dialog.querySelector('[data-hat-close]')?.focus({preventScroll:true});
});
function ellipse(ctx,x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function polygon(ctx,points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();}
function drawSideHat(ctx,hat=model.wear){
 if(hat.kind==='cap'){
  ellipse(ctx,-1,-311,37,25,hat.color);ctx.fillStyle=hat.color;ctx.fillRect(-37,-311,74,19);
  ctx.fillStyle='#fff4d426';ctx.fillRect(-35,-302,70,9);ctx.strokeStyle='#42382b66';ctx.lineWidth=1.2;ctx.strokeRect(-35,-303,70,12);
  ctx.beginPath();for(let x=-27;x<34;x+=9){ctx.moveTo(x,-301);ctx.lineTo(x,-293);}ctx.stroke();
 }else if(hat.kind==='tricorn'){
  ellipse(ctx,-1,-301,54,9,hat.color);polygon(ctx,[[-45,-301],[-34,-338],[0,-326],[31,-339],[45,-301]],hat.color);
  ctx.strokeStyle='#b99d63';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-43,-304);ctx.lineTo(-32,-333);ctx.lineTo(0,-322);ctx.lineTo(30,-334);ctx.lineTo(43,-304);ctx.stroke();
 }else{ellipse(ctx,-1,-301,47,9,hat.color);polygon(ctx,[[-30,-303],[-15,-328],[15,-327],[28,-301]],hat.color);}
}
function drawMapHat(ctx){
 const hat=model.wear;if(hat.id==='plain')return;
 ctx.save();
 if(hat.kind==='cap'){ellipse(ctx,5,0,10,9,hat.color);ctx.fillStyle='#fff4d433';ctx.fillRect(9,-8,3,16);}
 else{ellipse(ctx,5,0,13,10,hat.color);polygon(ctx,[[-5,-11],[18,0],[-5,11]],hat.color);ctx.strokeStyle='#b99d63';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-4,-10);ctx.lineTo(16,0);ctx.lineTo(-4,10);ctx.stroke();}
 ctx.restore();
}
function drawStall(ctx,p){
 const stall=p.stall;
 if(window.UPPDRAG_SCENE_PRESENCE?.enqueue(ctx,stall.y,()=>drawStall(ctx,p),'hat-stall'))return;
 ctx.save();ctx.translate(stall.x,stall.y);ctx.rotate(stall.angle);
 // Orthographic paper tabletop: a small footprint, planks and hats seen above.
 polygon(ctx,[[-37,-13],[39,-12],[40,18],[-36,19]],'#49392320');
 polygon(ctx,[[-38,-16],[36,-15],[38,15],[-37,16]],'#a88760');
 ctx.strokeStyle='#6b523c';ctx.lineWidth=1;ctx.stroke();
 ctx.strokeStyle='#72583d66';ctx.lineWidth=.7;ctx.beginPath();
 for(const y of [-5,5]){ctx.moveTo(-36,y);ctx.lineTo(36,y+.5);}ctx.stroke();
 ctx.strokeStyle='#f5e2bb55';ctx.beginPath();
 for(let i=0;i<11;i++){const x=-33+(i*19)%59,y=-12+(i*7)%25;ctx.moveTo(x,y);ctx.lineTo(x+5+i%5,y+.3);}ctx.stroke();
 for(const [x,color] of [[-24,'#62764b'],[0,'#9a5145']]){
  ellipse(ctx,x+.7,1.2,9,8.5,'#49392322');ellipse(ctx,x,0,8.5,8,color);
  ctx.strokeStyle='#f6edd344';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(x,-6);ctx.quadraticCurveTo(x+2,0,x,6);ctx.stroke();
 }
 ellipse(ctx,24.7,1.2,10,9,'#49392322');
 polygon(ctx,[[15,-9],[34,0],[15,9]],'#393b38');ellipse(ctx,22,0,5,5,'#494b43');
 ctx.strokeStyle='#b99d63';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(16,-7);ctx.lineTo(31,0);ctx.lineTo(16,7);ctx.stroke();
 ctx.restore();
 // A compact caption beside one end leaves both sides free for people.
 ctx.save();ctx.translate(stall.x-Math.cos(stall.angle)*62,stall.y-Math.sin(stall.angle)*62);
 polygon(ctx,[[-25,-9],[24,-8],[25,9],[-24,9]],'#f7ebd1');
 ctx.font='600 12px Georgia';ctx.textAlign='center';ctx.fillStyle='#4a3a28';ctx.fillText('Hattar',0,4);ctx.restore();
}
const life=window.UPPDRAG_WORLD_LIFE,oldTick=life.tick,oldDraw=life.draw;
life.tick=function(now,config){
 const ret=oldTick.apply(this,arguments);travelButton.hidden=!outside();tools.dataset.room=String(!!(typeof interior!=='undefined'&&interior));
 if(view==='shop'&&!near())close();
 if(pendingRoute){
  if(!outside()||occupied()||path!==pendingRoute)pendingRoute=null;
  else if(!path.length){pendingRoute=null;if(near())open('shop');}
 }
 return ret;
};
life.draw=function(ctx,config){
 const ret=oldDraw.apply(this,arguments),p=position(config?.region);if(!p)return ret;
 matrix=ctx.getTransform();drawStall(ctx,p);
 const facing=api.talking?Math.atan2(point().y-p.y,point().x-p.x):Math.atan2(p.arrival.y-p.y,p.arrival.x-p.x);
 window.UPPDRAG_MEETINGS.drawMapPerson(ctx,{...p,heading:facing,moving:false},{id:p.id,name:p.name,color:'#86654e',woman:false},config.now);
 return ret;
};
const engine=window.UPPDRAG_EVENT_ENGINE,people=engine.people,conversation=Object.getOwnPropertyDescriptor(engine,'conversation');
engine.people=function(r){return [...people.call(this,r),...(position(r)?[position(r)]:[])];};
Object.defineProperty(engine,'conversation',{configurable:true,get:()=>api.talking?position():conversation?.get?.call(engine)});
engine.register({id:'hat-merchant',type:'shop',region:'main',chapters:[3,4,5],cosmetic:true});
const canvas=document.getElementById('world');let hitDown=null;
function pointer(event){
 if(!matrix)return null;const rect=canvas.getBoundingClientRect(),m=matrix,x=(event.clientX-rect.left)*canvas.width/rect.width,y=(event.clientY-rect.top)*canvas.height/rect.height,den=m.a*m.d-m.b*m.c;
 return {x:(m.d*(x-m.e)-m.c*(y-m.f))/den,y:(-m.b*(x-m.e)+m.a*(y-m.f))/den};
}
function hit(event){const p=pointer(event),s=position();return outside()&&p&&s&&(distance(p,s)<28||stallHit(s.stall,p));}
canvas.addEventListener('pointerdown',event=>{if(view!=='closed'||occupied()||!hit(event))return;hitDown={x:event.clientX,y:event.clientY};event.preventDefault();event.stopImmediatePropagation();},true);
canvas.addEventListener('pointerup',event=>{if(!hitDown)return;const from=hitDown;hitDown=null;event.preventDefault();event.stopImmediatePropagation();if(Math.hypot(event.clientX-from.x,event.clientY-from.y)<10&&hit(event))travel();},true);
canvas.addEventListener('pointercancel',()=>hitDown=null,true);
Object.defineProperties(api,{
 wear:{get:()=>model.wear},busy:{get:()=>dialog.open},talking:{get:()=>view==='shop'&&dialog.open&&near()},
 snapshot:{get:()=>model.snapshot()}
});
Object.assign(api,{drawSideHat,drawMapHat,travel,position,openWardrobe:()=>open('wardrobe'),interact:()=>view==='closed'&&!occupied()&&near()?open('shop'):false});
})();
