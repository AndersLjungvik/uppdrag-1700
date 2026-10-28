window.listStagingRooms=function(){
 const list=[];
 for(const r of Object.values(REGIONS)){
  for(const building of r.buildings){const key=ROOM_BY_REGION[r.id]?.[building.name];if(key)list.push({key,region:r.id,group:r.name,label:building.name});}
  if(HARBOURS[r.id])list.push({key:'waterfront',region:r.id,group:r.name,label:HARBOURS[r.id].name+' · utomhus'});
 }
 return list;
};
window.visitStagingRoom=function(key,regionId='main'){
 const target=REGIONS[regionId];if(!target)return false;
 const building=key!=='town'&&key!=='waterfront'?target.buildings.find(b=>ROOM_BY_REGION[target.id]?.[b.name]===key):null;
 if(key!=='town'&&key!=='waterfront'&&!building)return false;
 window.__ROOM_TRANSIT=true;
 try{
 const control=window['UPPDRAG_CH'+Number((document.title.match(/Kapitel\s+(\d+)/i)||[])[1])+'_PILOT'];
 control?.close?.();window.UPPDRAG_MEETINGS?.close(false);window.UPPDRAG_LIVING_DIALOGUES?.close(false);
 // These shortcuts are teacher-preview navigation, never chapter progress.
 voyage=null;sailing=null;delete document.body.dataset.voyage;
 if(interior)leaveInterior();
 if(region.id!==regionId){switchRegion(regionId);if(interior)leaveInterior();}
 path=[];pendingRoom=null;pending=null;returnPending=false;drag=null;cancelPersonArrival();
 window.UPPDRAG_WORLD_KEYBOARD?.clear?.();
 if(key==='town'){follow=true;resize();draw();return true;}
 const entry=key==='waterfront'?region.harbor:(window.UPPDRAG_STORY_WORLD?.entryFor(region,building)||building.entry);
 const point=navigationPoint(region,entry);if(!point)return false;
 player={...point};camera={...player};follow=true;
 const accepted=key==='waterfront'?requestHarbour():requestInterior(building);
 const opened=!!accepted&&interior?.kind===key&&!document.getElementById('interiorView').hidden;
 if(!opened){path=[];pendingRoom=null;}
 return opened;
 }finally{window.__ROOM_TRANSIT=false;window.__ROOM_BOOTING=false;if(!interior){resize();draw();}}
};
