/* Three rooms and one reversible doorway flow. All outdoor map data and sea
 * destinations stay in rooms.html, copied from the confirmed Demo 3.3 build.
 */
'use strict';
const ROOM_KINDS={Kaffehuset:'cafe',Tryckeriet:'print',Arkivet:'archive'};
const roomView=document.querySelector('#interiorView'),roomCanvas=document.querySelector('#interiorCanvas');
const roomFooter=document.querySelector('#roomFooter'),worldFooter=document.querySelector('#worldFooter');
const leaveButton=document.querySelector('#leaveRoom');
let interior=null,pendingRoom=null,exitHit=null;
function requestInterior(building){
  if(interior||sailing||region.id!=='main'||!ROOM_KINDS[building.name])return false;
  // A new intentional destination replaces any old voyage or door request.
  pending=null;returnPending=false;pendingRoom=null;
  if(!go(building.entry,building.name))return false;
  pendingRoom={name:building.name,kind:ROOM_KINDS[building.name],entry:building.entry,regionId:region.id};
  setMessage(building.name,'Du går till ingången.');
  finishDoorArrival();return true;
}
function finishDoorArrival(){
  if(!pendingRoom||interior||path.length||sailing)return;
  const request=pendingRoom;
  if(request.regionId!==region.id){pendingRoom=null;return;}
  const entry=region.map.get(request.entry);
  if(!entry||Math.hypot(player.x-entry.x,player.y-entry.y)>1){pendingRoom=null;setMessage('Ingången','Du behöver komma fram till dörren först.');return;}
  pendingRoom=null;interior={...request,outside:{...player,id:request.entry},camera:{...camera}};
  pending=null;returnPending=false;drag=null;
  document.querySelector('#interiorTitle').textContent=request.name;
  document.querySelector('#roomReturnText').textContent='Utanför '+request.name.toLowerCase();
  roomCanvas.setAttribute('aria-label',{
    cafe:'Kaffehuset: bord med kaffekoppar, stolar och anslagstavla. Dörren finns längst ned till vänster.',
    print:'Tryckeriet: handpress, papper, trycksvärta och bokstavstyper. Dörren finns längst ned till vänster.',
    archive:'Arkivet: bokhyllor, buntade handlingar och läsbord. Dörren finns längst ned till vänster.'
  }[request.kind]);
  document.body.dataset.room=request.kind;
  document.querySelector('#world').hidden=true;document.querySelector('#message').hidden=true;
  worldFooter.hidden=true;roomView.hidden=false;roomFooter.hidden=false;
  renderInterior();leaveButton.focus({preventScroll:true});
}
function renderInterior(){if(interior)exitHit=window.UPPDRAG_ROOM_ART.render(roomCanvas,interior.kind);}
function leaveInterior(){
  if(!interior)return false;
  const saved=interior;interior=null;pendingRoom=null;exitHit=null;
  // The saved exterior is the reached entrance, not the region's starting point.
  player={...saved.outside};camera={...saved.outside};path=[];pending=null;returnPending=false;follow=true;drag=null;
  roomView.hidden=true;roomFooter.hidden=true;worldFooter.hidden=false;
  document.querySelector('#world').hidden=false;document.querySelector('#message').hidden=false;
  delete document.body.dataset.room;resize();draw();
  setMessage(saved.name,'Du står utanför samma ingång.');
  document.querySelector('#world').focus({preventScroll:true});return true;
}
leaveButton.addEventListener('click',leaveInterior);
let doorPress=null;
roomCanvas.addEventListener('pointerdown',e=>{doorPress={x:e.clientX,y:e.clientY,id:e.pointerId};});
roomCanvas.addEventListener('pointercancel',()=>{doorPress=null;});
roomCanvas.addEventListener('pointerup',e=>{
  if(!interior||!exitHit||!doorPress||doorPress.id!==e.pointerId)return;
  const start=doorPress;doorPress=null;if(Math.hypot(start.x-e.clientX,start.y-e.clientY)>10)return;
  const r=roomCanvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  if(x>=exitHit.x-7&&x<=exitHit.x+exitHit.w+7&&y>=exitHit.y-7&&y<=exitHit.y+exitHit.h+7)leaveInterior();
});
window.addEventListener('keydown',e=>{
  if(!interior||e.isComposing||e.repeat)return;
  if(e.key==='Escape'||(e.key==='Enter'&&!e.target.matches('button,input,select,textarea,a'))){e.preventDefault();leaveInterior();}
});
window.addEventListener('resize',renderInterior);
window.addEventListener('uppdrag-room-material-ready',renderInterior);
