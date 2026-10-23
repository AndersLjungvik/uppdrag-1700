/* Demo 3.6: use the same reversible visit for houses and outdoor waterfronts.
 * Existing furniture, world geometry, walking and voyage functions are retained.
 */
'use strict';
const ROOM_BY_REGION={
  main:{Kaffehuset:'cafe',Tryckeriet:'print',Arkivet:'archive',Barnhuset:'barnhus',
    Verkstäderna:'workshop','Vetenskapens hus':'science',Operan:'opera',Slottet:'palace',
    Bostadskvarteren:'homes',Byn:'farm',Herrgården:'manor'},
  marstrand:{Fästningen:'fort',Hamnen:'marstrandHarbor','Stadens hus':'townShop'},
  colony:{Gustavia:'gustavia',Hamnen:'colonyHarbor',Handelsplatsen:'trading'}
};
const HARBOURS={main:{name:'Kajen',back:'Till staden'},marstrand:{name:'Hamnen på Marstrand',back:'Till Marstrand'},colony:{name:'Hamnen i Gustavia',back:'Till Gustavia'}};
function roomKind(building){return ROOM_BY_REGION[region.id]?.[building.name]||null;}
const roomView=document.querySelector('#interiorView'),roomCanvas=document.querySelector('#interiorCanvas');
const roomFooter=document.querySelector('#roomFooter'),worldFooter=document.querySelector('#worldFooter');
const leaveButton=document.querySelector('#leaveRoom'),harbourActions=document.querySelector('#harbourActions');
let interior=null,pendingRoom=null,exitHit=null,shipHit=null;
function requestInterior(building){
  if(interior||sailing||!roomKind(building))return false;
  pending=null;returnPending=false;pendingRoom=null;
  if(!go(building.entry,building.name))return false;
  pendingRoom={name:building.name,kind:roomKind(building),entry:building.entry,regionId:region.id};
  setMessage(building.name,'Du går till ingången.');finishDoorArrival();return true;
}
function requestHarbour(destination=null){
  if(interior||sailing)return false;
  const port=HARBOURS[region.id];if(!port)return false;
  pending=null;returnPending=false;pendingRoom=null;
  if(!go(region.harbor,port.name))return false;
  pendingRoom={name:port.name,kind:'waterfront',outdoor:true,entry:region.harbor,regionId:region.id,destination};
  setMessage(port.name,'Du går fram till kajen.');finishDoorArrival();return true;
}
function finishDoorArrival(){
  if(!pendingRoom||interior||path.length||sailing)return;
  const request=pendingRoom;
  if(request.regionId!==region.id){pendingRoom=null;return;}
  const entry=region.map.get(request.entry);
  if(!entry||Math.hypot(player.x-entry.x,player.y-entry.y)>1){pendingRoom=null;setMessage(request.name,'Du behöver komma fram först.');return;}
  pendingRoom=null;interior={...request,outside:{...player,id:request.entry},camera:{...camera}};
  pending=null;returnPending=false;drag=null;
  document.querySelector('#interiorTitle').textContent=request.name;
  document.querySelector('#roomReturnText').textContent=request.outdoor?'Du är vid kajen':'Du är i '+request.name.toLowerCase();
  roomCanvas.setAttribute('aria-label',request.outdoor?request.name+': en utomhusmiljö med kaj, vatten, fartyg, lastgods och landgång. Tryck på båten för att resa.':{
    cafe:'Kaffehuset: bord med kaffekoppar, stolar och anslagstavla. Dörren finns till vänster i bakväggen.',
    print:'Tryckeriet: handpress, papper, trycksvärta och bokstavstyper. Dörren finns till vänster i bakväggen.',
    archive:'Arkivet: bokhyllor, buntade handlingar och läsbord. Dörren finns till vänster i bakväggen.'
  }[request.kind]||request.name+': '+window.UPPDRAG_ROOM_ART.descriptions[request.kind]+' Dörren finns till vänster i bakväggen.');
  document.body.dataset.room=request.outdoor?'waterfront-'+region.id:request.kind;
  leaveButton.textContent=request.outdoor?'← '+HARBOURS[region.id].back:'← Gå ut';
  harbourActions.hidden=!request.outdoor;harbourActions.replaceChildren();
  if(request.outdoor){
    const choices=region.id==='main'?[['marstrand','Segla till Marstrand'],['colony','Segla till Saint Barthélemy']]:[['main','Segla tillbaka till staden']];
    for(const [id,label] of choices){const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.destination=id;button.onclick=()=>departHarbour(id);harbourActions.append(button);}
  }
  document.querySelector('#world').hidden=true;document.querySelector('#message').hidden=true;
  worldFooter.hidden=true;roomView.hidden=false;roomFooter.hidden=false;
  renderInterior();leaveButton.focus({preventScroll:true});
}
function renderInterior(){
  if(!interior)return;
  if(interior.outdoor){const hits=window.UPPDRAG_HARBOUR_ART.render(roomCanvas,interior.regionId);exitHit=hits?.exit||null;shipHit=hits?.ship||null;}
  else{exitHit=window.UPPDRAG_ROOM_ART.render(roomCanvas,interior.kind);shipHit=null;}
}
function leaveInterior(){
  if(!interior)return false;
  const saved=interior;interior=null;pendingRoom=null;exitHit=null;shipHit=null;
  player={...saved.outside};camera={...saved.outside};path=[];pending=null;returnPending=false;follow=true;drag=null;
  roomView.hidden=true;roomFooter.hidden=true;worldFooter.hidden=false;harbourActions.hidden=true;
  document.querySelector('#world').hidden=false;document.querySelector('#message').hidden=false;
  delete document.body.dataset.room;resize();draw();
  setMessage(saved.name,saved.outdoor?'Du står kvar vid kajen på kartan.':'Du står utanför samma ingång.');
  document.querySelector('#world').focus({preventScroll:true});return true;
}
function departHarbour(destination){
  if(!interior?.outdoor||sailing)return;
  if(region.id==='main'&&!['marstrand','colony'].includes(destination))return;
  if(region.id!=='main'&&destination!=='main')return;
  leaveInterior();
  // Start the already tested voyage from the reached harbour node.
  if(destination==='main')returnByBoat();else sail(destination);
}
function syncHarbourUI(){
  document.querySelector('#visitHarbour').textContent=region.id==='main'?'Kajen':'Hamnen';
  document.querySelector('#return').textContent='Till hamnen / hemresa';
}
function harbourMapHit(p){
  const q=region.map.get(region.harbor);if(!q)return false;
  if(region.id==='main')return Math.hypot(p.x-q.x,p.y-q.y)<73||inRect(p.x,p.y,{x:1365,y:1180,w:255,h:98})||inRect(p.x,p.y,{x:1600,y:1260,w:94,h:158});
  // Keep the warehouse itself clickable as a room. Its outside dock has a
  // separate hit region; the Hamnen button always opens the waterfront.
  return inRect(p.x,p.y,{x:q.x-48,y:q.y+20,w:96,h:115});
}
leaveButton.addEventListener('click',leaveInterior);
let doorPress=null;
roomCanvas.addEventListener('pointerdown',e=>{doorPress={x:e.clientX,y:e.clientY,id:e.pointerId};});
roomCanvas.addEventListener('pointercancel',()=>{doorPress=null;});
roomCanvas.addEventListener('pointerup',e=>{
  if(!interior||!doorPress||doorPress.id!==e.pointerId)return;
  const start=doorPress;doorPress=null;if(Math.hypot(start.x-e.clientX,start.y-e.clientY)>10)return;
  const r=roomCanvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  if(exitHit&&inRect(x,y,exitHit,7)){leaveInterior();return;}
  if(shipHit&&inRect(x,y,shipHit,7)){
    if(region.id!=='main')departHarbour('main');
    else{const chosen=harbourActions.querySelector('[data-destination="'+(interior.destination||'marstrand')+'"]');chosen?.focus({preventScroll:true});}
  }
});
roomCanvas.addEventListener('pointermove',e=>{
  if(!interior)return;const r=roomCanvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  roomCanvas.style.cursor=(shipHit&&inRect(x,y,shipHit,7))||(exitHit&&inRect(x,y,exitHit,7))?'pointer':'default';
});
window.addEventListener('keydown',e=>{
  if(!interior||e.isComposing||e.repeat)return;
  if(e.key==='Escape'||(e.key==='Enter'&&!e.target.matches('button,input,select,textarea,a'))){e.preventDefault();leaveInterior();}
});
window.addEventListener('resize',renderInterior);
window.addEventListener('uppdrag-room-material-ready',renderInterior);
window.addEventListener('uppdrag-harbour-ready',renderInterior);
