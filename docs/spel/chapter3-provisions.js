/* A physical wagon-to-square errand in chapter 3. Uses existing routes,
 * wagon art, room dialogue and world tick. No new mastery or movement loop. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==3)return;
const pilot=window.UPPDRAG_CH3_PILOT,engine=window.UPPDRAG_EVENT_ENGINE,scenes=window.UPPDRAG_CH3_SCENES;
const stage=document.getElementById('stage');if(!stage||!pilot||!engine||!scenes)return;
const outside=()=>region?.id==='main'&&!interior&&!voyage&&!sailing;
const atSquare=()=>interior?.kind==='square'&&region.id==='main'&&!voyage;
const near=()=>outside()&&Math.hypot(player.x-engine.wagonShopPoint.x,player.y-engine.wagonShopPoint.y)<=115&&UPPDRAG_WORLD_KEYBOARD.clearSegment(region,player,engine.wagonShopPoint,0);
const occupied=()=>!!(document.hidden||window.UPPDRAG_MENU_OPEN?.()||pilot.studyBusy||engine.busy||UPPDRAG_MEETINGS.state.talking||window.UPPDRAG_LIVING_DIALOGUES?.active||window.UPPDRAG_HAT_SHOP?.busy||window.UPPDRAG_APPLE_THREATS?.busy||window.UPPDRAG_ORCHARD?.busy||window.UPPDRAG_CH3_CITY_LIFE?.active||document.querySelector('dialog[open]:not(#provisionsDialog),#ch1Modal:not([hidden])'));
const model=UPPDRAG_CH3_PROVISIONS_MODEL.create(pilot.state,{atWagon:()=>near()&&!occupied(),atSquare:()=>atSquare()&&!occupied(),save(){pilot.persist();pilot.refresh?.();}});
const style=document.createElement('style');style.textContent=`
#provisionsDialog{width:min(490px,calc(100% - 24px));max-height:86dvh;overflow:auto;padding:24px;border:1px solid #947b56;border-radius:10px;background:#fff6e2;color:#3d3323;font:16px/1.5 Georgia}
#provisionsDialog::backdrop{background:#29261f80}#provisionsDialog h2{margin:0 0 12px;font-size:26px}#provisionsDialog button,#provisionsAction{min-height:44px;padding:9px 13px;margin:5px;border:1px solid #8c7656;border-radius:5px;background:#e3e7d2;color:#342e23;font:15px system-ui;cursor:pointer}#provisionsDialog button:disabled{opacity:.6;cursor:default}#provisionsDialog:focus-visible,#provisionsDialog button:focus-visible,#provisionsAction:focus-visible{outline:3px solid #2d6d71;outline-offset:2px}#provisionsStatus{min-height:24px;color:#3d6651}
`;document.head.append(style);
const dialog=document.createElement('dialog');dialog.id='provisionsDialog';dialog.setAttribute('aria-labelledby','provisionsTitle');document.body.append(dialog);
const action=document.createElement('button');action.id='provisionsAction';action.type='button';action.hidden=true;const worldFooter=document.getElementById('worldFooter')||stage;worldFooter.append(action);let host=worldFooter;
function stop(){UPPDRAG_WORLD_KEYBOARD.clear();path=[];if(typeof cancelPersonArrival==='function')cancelPersonArrival();if(typeof pendingRoom!=='undefined')pendingRoom=null;if(typeof pendingStreetChat!=='undefined')pendingStreetChat=null;window.UPPDRAG_CH3_CITY_LIFE?.releaseHold?.();}
function focus(){document.getElementById(interior?'interiorCanvas':'world')?.focus?.({preventScroll:true});}
function close(){if(dialog.open)dialog.close();focus();}
function render(message=''){
 const parcel=model.snapshot().carrying,balance=pilot.state.daler;
 dialog.innerHTML='<h2 id="provisionsTitle">Bonden med proviantvagnen</h2><p>”Bröd och ost till bönderna på torget. En matsäck kostar <b>5 daler</b>. När du lämnar den får du <b>1 äpple</b> som tack.”</p><p>Du har '+balance+' daler.</p>'+(parcel?'<p>Du bär en matsäck. Lämna den innan du köper en ny.</p><button type="button" data-provisions="square">Gå till bönderna på torget</button>':'<button type="button" data-provisions="buy"'+(balance<5?' disabled':'')+'>Köp matsäck · 5 daler</button>')+'<button type="button" data-provisions="close">Till spelet</button><p id="provisionsStatus" role="status"></p>';
 dialog.querySelector('#provisionsStatus').textContent=message;
}
function shop(){
 if(occupied()||dialog.open)return false;
 if(!near())return travelWagon();
 stop();render();dialog.showModal();dialog.querySelector('button:not([disabled])')?.focus({preventScroll:true});return true;
}
function travelWagon(){
 if(occupied()||dialog.open)return false;
 if(!outside()){setMessage('Proviantvagnen','Gå ut i staden för att hitta vagnen på landsvägen vid Herrgården.');return false;}
 if(near())return shop();return engine.travelWagon();
}
function travelSquare(){if(occupied()||dialog.open)return false;return scenes.travel('square');}
function deliver(){
 if(occupied()||dialog.open)return false;
 const result=model.deliver();if(!result.ok)return false;
 engine.speakRoom({room:'square',title:'Proviant till bönderna',lines:[['Bonden','Tack för matsäcken! Här får du ett äpple.']],pose:scenes.personPose});return true;
}
dialog.addEventListener('click',e=>{
 const name=e.target.closest('[data-provisions]')?.dataset.provisions;if(!name)return;
 if(name==='close')return close();
 if(name==='square'){close();return travelSquare();}
 if(name==='buy'){
  const result=model.buy();render(result.ok?'Matsäcken är din. Bär den till bönderna på torget.':result.reason==='funds'?'Du behöver 5 daler.':'Du kan köpa vid vagnen när du inte redan bär en matsäck.');dialog.querySelector('button:not([disabled])')?.focus({preventScroll:true});
 }
});
dialog.addEventListener('cancel',()=>{UPPDRAG_WORLD_KEYBOARD.clear();});dialog.addEventListener('close',()=>{UPPDRAG_WORLD_KEYBOARD.clear();focus();});
action.onclick=()=>atSquare()&&model.snapshot().carrying?deliver():model.snapshot().carrying?travelSquare():shop();
function tick(){
 const carrying=model.snapshot().carrying,desired=interior?roomFooter:worldFooter;if(host!==desired){desired.append(action);host=desired;}
 action.hidden=occupied()||dialog.open||!(outside()||atSquare()&&carrying);
 action.textContent=carrying?(atSquare()?'Lämna matsäcken · få 1 äpple':'Proviant: gå till bönderna'):near()?'Köp proviant · 5 daler':'Proviantvagnen';
 action.setAttribute('aria-label',action.textContent);
}
const life=UPPDRAG_WORLD_LIFE,oldTick=life.tick;life.tick=function(){const result=oldTick.apply(this,arguments);tick();return result;};
function bag(g,x,y,k,side=false){g.save();g.translate(x,y);g.scale(k,k);g.fillStyle=UPPDRAG_PAPER_FIBRES.material(g,'#a88756','piece');g.strokeStyle='#61513a';g.lineWidth=side?2:1;g.beginPath();g.moveTo(-8,-6);g.lineTo(7,-8);g.lineTo(10,7);g.lineTo(-7,9);g.closePath();g.fill();g.stroke();g.beginPath();g.moveTo(0,-6);g.lineTo(2,8);g.stroke();g.restore();}
const meetings=UPPDRAG_MEETINGS,drawPlayer=meetings.drawMapPlayer;meetings.drawMapPlayer=function(g,p){const result=drawPlayer.apply(this,arguments);if(model.snapshot().carrying){const paint=()=>bag(g,p.x-9,p.y+9,1);if(!window.UPPDRAG_SCENE_PRESENCE?.enqueue(g,p.y+.2,paint,'provisions-parcel'))paint();}return result;};
const drawProps=scenes.drawProps;scenes.drawProps=function(g,p){const result=drawProps.apply(this,arguments);if(model.snapshot().carrying){const pos=meetings.geometryForRoom()?.poses[0];if(pos)bag(g,pos[0]+32*pos[2],pos[1]-120*pos[2],pos[2]*2,true);}return result;};
const api={shop,deliver,travelWagon,travelSquare,get busy(){return dialog.open;},get snapshot(){return model.snapshot();},interact(){return !dialog.open&&!occupied()&&near()?shop():false;},journalHTML(){const s=model.snapshot();return '<p><b>Proviant till bönderna:</b> '+(s.carrying?'Du bär en matsäck. Lämna den till bonden på torget och få 1 äpple.':'Bonden med vagnen vid Herrgården säljer en matsäck för 5 daler. Bär den till torget och få 1 äpple.')+' Du har lämnat '+s.delivered+' matsäckar.</p>';}};
window.UPPDRAG_CH3_PROVISIONS=api;engine.register({id:'ch3-provisions',type:'trade',chapters:[3],optional:true,usesKnowledgeStamps:false});tick();
})();
