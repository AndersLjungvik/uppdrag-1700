/* Demo 3.17: short meetings, shared recognition and walking to a host's place.
 * No outdoor thought heading, choices, modal state or reading timer.
 * Uses the world's existing animation loop and current walking-person poses.
 */
'use strict';
window.UPPDRAG_LIVING_DIALOGUES=(()=>{
  const content=window.UPPDRAG_LIVING_CONTENT;
  const ponderings=new Map((content?.ponderings||[]).map(thought=>[thought.id,thought]));
  const encounters=new Map(),personButtons=new Map();
  const knownKey='uppdrag1700-known-people-v1';
  function isKnown(home){try{return JSON.parse(localStorage.getItem(knownKey)||'{}')?.[home]===true;}catch{return false;}}
  function remember(home){
    try{const old=JSON.parse(localStorage.getItem(knownKey)||'{}'),known=old&&typeof old==='object'&&!Array.isArray(old)?old:{};known[home]=true;localStorage.setItem(knownKey,JSON.stringify(known));}catch{}
  }
  const style=document.createElement('style');
  style.textContent=`
    #livingDialogue{position:absolute;inset:0;pointer-events:none;z-index:9;color:#382e23;font-family:Georgia,'Times New Roman',serif}
    #livingTail{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
    #livingBubble{position:absolute;pointer-events:auto;box-sizing:border-box;background:transparent;border:0;border-radius:0;padding:18px 22px 20px;box-shadow:none;max-width:calc(100% - 24px);overflow:visible;touch-action:manipulation;cursor:pointer}
    #livingBubble p{font:18px/1.38 Georgia,'Times New Roman',serif;margin:0;overflow-wrap:break-word}
    #livingBubble .speechSpeaker{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
    #worldPeople{position:absolute;inset:0;pointer-events:none;z-index:3}
    #worldPeople button{position:absolute;pointer-events:auto;width:48px;height:48px;border:0;background:transparent;cursor:pointer;touch-action:manipulation;border-radius:50%;padding:0}
    #worldPeople button:focus-visible{outline:3px solid #355e68;outline-offset:2px}
    body[data-living-mode] #message,body[data-living-approach] #message{visibility:hidden}
    @media(max-width:640px){#livingBubble{padding:16px 20px 18px}#livingBubble p{font-size:17px}}
    @media(max-height:400px){#livingBubble{padding:13px 18px 15px}#livingBubble p{font-size:16px;line-height:1.35}}
  `;
  document.head.append(style);
  const root=document.createElement('div');root.id='livingDialogue';root.hidden=true;
  root.innerHTML='<svg id="livingTail" aria-hidden="true" focusable="false"></svg><div id="livingBubble" class="speech" role="status" aria-live="polite" aria-atomic="true"><span class="speechSpeaker"></span><p id="livingLine"></p></div>';
  const bubble=root.querySelector('#livingBubble'),tail=root.querySelector('#livingTail');
  const speakerLabel=bubble.querySelector('.speechSpeaker'),line=bubble.querySelector('p');
  const peopleLayer=document.createElement('div');peopleLayer.id='worldPeople';peopleLayer.setAttribute('role','group');peopleLayer.setAttribute('aria-label','Människor längs vägen');stage.append(peopleLayer,root);
  let context=null,revision=0,lastSignature='',focusBack=null,clock=performance.now();
  let recentHost=null,companion=null,requestingHome=0;
  function close(restore=true){
    if(!context)return false;
    const previous=context;context=null;root.hidden=true;tail.replaceChildren();
    window.UPPDRAG_WORLD_LIFE?.release(previous.person.id);
    delete document.body.dataset.livingMode;revision++;lastSignature='';
    if(restore){
      const target=personButtons.get(previous.person.id);
      if(target&&!target.hidden)target.focus({preventScroll:true});
      else if(focusBack?.isConnected)focusBack.focus({preventScroll:true});
      else canvas.focus({preventScroll:true});
    }
    return true;
  }
  function showPhase(mode,at){
    context.mode=mode;context.phaseAt=at;
    context.speaker=mode==='greeting'?'Du':context.person.name;
    line.textContent=mode==='greeting'?'Hej!':context.invitation
      ?(context.introducing?'Jag heter '+context.person.name+'. ':'')+context.invitation.text
      :context.introducing?context.person.introduction:context.thought.text;
    if(mode==='speech'&&context.introducing)remember(context.person.home);
    if(mode==='speech'&&context.person.home)recentHost={id:context.person.id,home:context.person.home,regionId:context.regionId};
    speakerLabel.textContent=context.speaker+': ';
    context.speech={at,end:at+(mode==='greeting'?850:Math.min(3600,700+line.textContent.length*24))};
    document.body.dataset.livingMode=mode;revision++;lastSignature='';position();
  }
  function openWorld(person){
    if(context||interior||sailing||voyage||!person||person.region!==region.id)return false;
    const current=window.UPPDRAG_WORLD_LIFE?.people(region).find(p=>p.id===person.id);
    if(!current||Math.hypot(player.x-current.x,player.y-current.y)>80)return false;
    const proposed=current.role==='host'?window.UPPDRAG_STORY_STATE?.invitationFor(current):null;
    const invitation=proposed&&typeof proposed.key==='string'&&typeof proposed.place==='string'&&typeof proposed.text==='string'
      ?{key:proposed.key,place:proposed.place,text:proposed.text}:null;
    const thoughts=(current.ponderings||[]).map(id=>ponderings.get(id)).filter(Boolean);
    if(!thoughts.length&&!invitation)return false;
    const index=encounters.get(current.id)||0,thought=thoughts[index%thoughts.length]||{id:invitation.key,text:invitation.text};
    const introducing=!!current.home&&!!current.introduction&&!isKnown(current.home);
    if(!introducing&&!invitation)encounters.set(current.id,index+1);
    const stopped=window.UPPDRAG_WORLD_LIFE.freeze(current.id)||current;
    context={regionId:region.id,person:stopped,thought,introducing,invitation};focusBack=document.activeElement;
    path=[];pendingPerson=null;drag=null;follow=true;
    delete document.body.dataset.livingApproach;
    camera.x=(player.x+stopped.x)/2;camera.y=(player.y+stopped.y)/2;clamp();
    root.hidden=false;showPhase('greeting',clock);return true;
  }
  bubble.addEventListener('click',event=>{event.stopPropagation();close();});
  window.addEventListener('keydown',event=>{
    if(!context||event.repeat||event.isComposing||!['Enter','Escape',' '].includes(event.key))return;
    const target=event.target;
    // Tab and normal world controls remain available throughout the encounter.
    if(event.key!=='Escape'&&target!==document.body&&target!==canvas&&!bubble.contains(target)&&target!==personButtons.get(context.person.id))return;
    event.preventDefault();event.stopImmediatePropagation();close();
  },true);
  const bound=(n,a,b)=>Math.max(a,Math.min(Math.max(a,b),n));
  const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  function screenPoint(person){return {x:layout.w/2+(person.x-camera.x)*layout.scale,y:layout.h/2+(person.y-camera.y)*layout.scale};}
  function position(){
    if(!context)return;
    const current=window.UPPDRAG_WORLD_LIFE?.people(region).find(p=>p.id===context.person.id)||context.person;
    const from=context.mode==='greeting'?player:current,to=context.mode==='greeting'?current:player;
    const anchor=screenPoint(from),heads=[screenPoint(player),screenPoint(current)];
    const angle=Math.atan2(to.y-from.y,to.x-from.x);
    const tip={x:anchor.x+Math.cos(angle)*12*layout.scale,y:anchor.y+Math.sin(angle)*12*layout.scale};
    const width=context.mode==='greeting'?88:Math.min(310,layout.w-24);
    bubble.style.width=width+'px';bubble.style.minHeight=context.mode==='greeting'?'58px':'';
    const height=bubble.getBoundingClientRect().height,minX=12,maxX=layout.w-width-12,minY=12,maxY=layout.h-height-12;
    const bodies=heads.map(h=>({x:h.x-25*layout.scale-4,y:h.y-25*layout.scale-4,w:50*layout.scale+8,h:50*layout.scale+8}));
    const candidates=[
      {x:anchor.x-width/2,y:Math.min(...heads.map(h=>h.y))-height-32*layout.scale},
      {x:anchor.x+36*layout.scale,y:anchor.y-height/2},
      {x:anchor.x-width-36*layout.scale,y:anchor.y-height/2},
      {x:anchor.x-width/2,y:Math.max(...heads.map(h=>h.y))+32*layout.scale},
      {x:minX,y:minY},{x:maxX,y:minY},{x:minX,y:maxY},{x:maxX,y:maxY}
    ].map(c=>({x:bound(c.x,minX,maxX),y:bound(c.y,minY,maxY),w:width,h:height}));
    for(const c of candidates)c.score=bodies.reduce((sum,b)=>sum+overlap(c,b)*30,0)+Math.abs(c.x+width/2-anchor.x)*.1+Math.abs(c.y+height-anchor.y)*.15;
    candidates.sort((a,b)=>a.score-b.score);const best=candidates[0];
    Object.assign(bubble.style,{left:best.x+'px',top:best.y+'px'});
    window.UPPDRAG_PAPER_DIALOGUES?.drawSpeech(tail,{box:best,tip});
  }
  function outdoorButtons(){
    const hidden=!!interior||!!voyage||!!sailing;peopleLayer.hidden=hidden;if(hidden)return;
    const people=window.UPPDRAG_WORLD_LIFE?.people(region)||[],ids=new Set(people.map(p=>p.id));
    for(const [id,button] of personButtons)if(!ids.has(id))button.hidden=true;
    for(const person of people){
      let button=personButtons.get(person.id);
      if(!button){
        button=document.createElement('button');button.type='button';button.dataset.person=person.id;
        button.setAttribute('aria-label','Prata med '+person.name);button.title=person.name;
        peopleLayer.append(button);personButtons.set(person.id,button);
        button.addEventListener('click',()=>requestPerson(window.UPPDRAG_WORLD_LIFE.people(region).find(p=>p.id===person.id)));
        button.addEventListener('pointerenter',()=>{hoverPersonId=person.id;});
        button.addEventListener('pointerleave',()=>{hoverPersonId=null;});
      }
      const point=screenPoint(person);
      button.hidden=point.x<20||point.x>layout.w-20||point.y<20||point.y>layout.h-20;
      if(document.activeElement===button)hoverPersonId=person.id;
      button.style.left=(point.x-24)+'px';button.style.top=(point.y-24)+'px';
    }
  }
  function tick(now){
    if(Number.isFinite(now))clock=now;
    if(companion){
      const state=window.UPPDRAG_WORLD_LIFE?.escortState(companion.id);
      if(state?.mode==='arrived')companion.arrived=true;
      if(region.id!==companion.regionId||companion.arrived&&!interior)cancelCompanion();
      else if(!state||state.mode==='returning')companion=null;
    }
    if(recentHost&&!companion){
      const host=window.UPPDRAG_WORLD_LIFE?.people(region).find(p=>p.id===recentHost.id);
      if(region.id!==recentHost.regionId||!host||Math.hypot(player.x-host.x,player.y-host.y)>140)recentHost=null;
    }
    outdoorButtons();if(!context)return;
    if(interior||sailing||voyage||region.id!==context.regionId||Math.hypot(player.x-context.person.x,player.y-context.person.y)>100){close(false);return;}
    if(context.mode==='greeting'&&clock-context.phaseAt>=850)showPhase('speech',clock);
    const signature=[layout.w,layout.h,layout.scale,revision,camera.x,camera.y].join(':');
    if(signature!==lastSignature){position();lastSignature=signature;}
  }
  // A host accompanies the player when their home is chosen after a meeting.
  // Space may close the paper first; the nearby, just-spoken host still counts.
  function visitHome(visit){return visit?.outdoor?(visit.regionId==='main'?'quay':null):visit?.kind||null;}
  function cancelCompanion(){
    if(companion)window.UPPDRAG_WORLD_LIFE?.cancelEscort(companion.id);
    companion=null;
  }
  function recentFor(home){
    if(!home)return null;
    if(companion?.home===home&&companion.regionId===region.id&&!companion.arrived)return companion;
    if(context?.person.home===home&&context.mode==='speech')return {id:context.person.id,home,regionId:region.id};
    if(recentHost?.home!==home||recentHost.regionId!==region.id)return null;
    const person=window.UPPDRAG_WORLD_LIFE?.people(region).find(p=>p.id===recentHost.id);
    return person&&Math.hypot(player.x-person.x,player.y-person.y)<=140?recentHost:null;
  }
  function accompany(host){
    if(!host)return;
    if(companion?.id===host.id)return;
    cancelCompanion();
    if(window.UPPDRAG_WORLD_LIFE?.beginEscort(host.id,{region,player,distance:54}))companion={...host,arrived:false};
  }
  function markArrival(home,greeted,ok){
    if(!ok||!greeted)return;
    const visit=interior||pendingRoom;
    if(visitHome(visit)===home){
      visit.greetedHost=home;
      if(companion?.home===home)visit.escortedHost=companion.id;
    }
  }
  const visitInterior=requestInterior,visitHarbour=requestHarbour,walkTo=go,visitPerson=requestPerson,arrive=finishDoorArrival,changeRegion=switchRegion;
  function withHost(home,visit){
    const host=recentFor(home);
    if(!host){recentHost=null;cancelCompanion();}
    else accompany(host);
    requestingHome++;
    let ok=false;
    try{ok=visit();}finally{requestingHome--;}
    if(!ok){cancelCompanion();return false;}
    markArrival(home,!!host,ok);return ok;
  }
  requestInterior=function(building){
    if(interior||sailing||voyage||!building||!roomKind(building))return false;
    return withHost(roomKind(building),()=>visitInterior(building));
  };
  requestHarbour=function(destination=null){
    if(interior||sailing||voyage)return false;
    return withHost(region.id==='main'?'quay':null,()=>visitHarbour(destination));
  };
  go=function(id,title=''){
    if(interior||sailing)return false;
    if(!requestingHome){recentHost=null;cancelCompanion();}
    const ok=walkTo(id,title);
    if(ok)window.UPPDRAG_WORLD_KEYBOARD?.clear();
    return ok;
  };
  requestPerson=function(person){
    if(person&&person.region===region.id&&!interior&&!sailing&&!voyage){
      if(recentHost?.id!==person.id)recentHost=null;
      if(companion?.id!==person.id)cancelCompanion();
    }
    return visitPerson(person);
  };
  finishDoorArrival=function(){
    if(pendingRoom&&companion?.home===visitHome(pendingRoom)&&!path.length){
      const escort=window.UPPDRAG_WORLD_LIFE?.escortState(companion.id),entry=navigationPoint(region,pendingRoom.entry);
      if(escort&&entry&&Math.hypot(escort.x-entry.x,escort.y-entry.y)>72)return;
    }
    const before=interior;
    arrive();
    // Before the next meeting-controller tick, Space should speak, not exit.
    if(interior&&interior!==before){
      if(companion?.home===visitHome(interior))companion.arrived=true;
      if(recentHost?.home===visitHome(interior))recentHost=null;
      roomCanvas.focus({preventScroll:true});
    }
  };
  switchRegion=function(...args){
    recentHost=null;cancelCompanion();window.UPPDRAG_WORLD_KEYBOARD?.clear();
    return changeRegion(...args);
  };
  function onManualMove(){
    // Taking over the walking direction keeps an existing companion alongside.
    // An unrelated destination or another person ends that company explicitly.
    if(companion?.arrived)cancelCompanion();
  }
  function consumeGreeting(home){
    if(interior?.greetedHost!==home)return false;
    delete interior.greetedHost;return true;
  }
  new ResizeObserver(()=>{lastSignature='';if(context)position();}).observe(stage);
  return {openWorld,close,tick,consumeGreeting,onManualMove,get companion(){return companion?{...companion}:null;},get busy(){return false;},get active(){return !!context;},get roomKey(){return null;},get personId(){return context?.person.id||null;},get revision(){return revision;},get speaker(){return context?.speaker||'';},get speech(){return context?.speech||{at:0,end:0};},get state(){return {room:null,person:context?.person.id||null,mode:context?.mode||null,thought:context?.thought.id||null,introducing:!!context?.introducing,invitation:context?.invitation?{...context.invitation}:null};}};
})();
