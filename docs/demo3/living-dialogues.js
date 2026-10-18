/* Demo 3.13: optional book reflections and short, remembered outdoor meetings.
 * Content is in living-conversation-data.js. Reflection has no score or facit.
 * Uses the existing world loop, road arrivals and thought → spoken-line rhythm.
 */
'use strict';
window.UPPDRAG_LIVING_DIALOGUES=(()=>{
  const content=window.UPPDRAG_LIVING_CONTENT;
  const topics=new Map((content?.topics||[]).map(topic=>[topic.id,topic]));
  const names={archive:'Rut',cafe:'Maja',print:'Brita',quay:'Jo'};
  const knownKey='uppdrag1700-known-people-v1',greeted=new Set();
  const style=document.createElement('style');
  style.textContent=`
    #livingDialogue{position:absolute;inset:0;pointer-events:none;z-index:9;color:#352d24;font-family:system-ui,sans-serif}
    #livingTail{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
    #livingBubble{position:absolute;pointer-events:auto;box-sizing:border-box;background:#fbf1dc;border:2px solid #9c815c;border-radius:20px;padding:12px 15px;box-shadow:2px 4px 0 #41342220;max-width:calc(100% - 20px);overflow:auto;overscroll-behavior:contain;touch-action:pan-y}
    #livingBubble.thought{border-style:dashed;border-radius:28px}
    #livingBubble h3{font:600 14px/1.3 system-ui;margin:0 0 7px;color:#61513b}
    #livingBubble h3:focus{outline:none}
    #livingBubble p{font:18px/1.4 system-ui;margin:0 0 10px}
    #livingBubble button{min-height:42px;padding:8px 12px;border:1px solid #a18b66;border-radius:8px;background:#ead7b1;color:#352d24;font:15px/1.35 system-ui;cursor:pointer;touch-action:manipulation}
    #livingBubble .thoughtChoice{display:block;width:100%;text-align:left;margin:7px 0;background:#fff8e9}
    #livingBubble .actions{display:flex;justify-content:space-between;align-items:center;gap:9px;margin-top:5px}
    #livingBubble .quiet{background:transparent;border-color:transparent}
    #livingBubble button:focus-visible{outline:3px solid #355e68;outline-offset:2px}
    #worldPeople{position:absolute;inset:0;pointer-events:none;z-index:3}
    #worldPeople button{position:absolute;pointer-events:auto;width:52px;height:60px;border:0;background:transparent;cursor:pointer;touch-action:manipulation;border-radius:20px;padding:0}
    #worldPeople button span{display:none;position:absolute;left:50%;bottom:-12px;transform:translateX(-50%);white-space:nowrap;padding:3px 7px;background:#f1e4c9;border:1px solid #9e8965;border-radius:4px;font:600 13px Georgia,serif;color:#352d24}
    #worldPeople button:focus-visible{outline:3px solid #355e68;outline-offset:2px}
    body[data-living-mode] #message{visibility:hidden}
    body[data-living-mode] #meetingPerson,body[data-living-mode] #rutPapers{visibility:hidden}
    @media(max-width:640px){#livingBubble{padding:10px 12px}#livingBubble p{font-size:16px}#livingBubble button{font-size:14px;min-height:40px}}
    @media(max-height:480px) and (min-width:641px){#livingBubble{padding:8px 10px}#livingBubble p{font-size:15px;line-height:1.35}#livingBubble button{font-size:13px;min-height:36px;padding:6px 9px}#livingBubble h3{font-size:13px}}
  `;
  document.head.append(style);
  const root=document.createElement('div');root.id='livingDialogue';root.hidden=true;
  root.innerHTML='<svg id="livingTail" aria-hidden="true"></svg><section id="livingBubble" role="dialog" aria-modal="true" aria-labelledby="livingHeading"></section>';
  const bubble=root.querySelector('#livingBubble'),tail=root.querySelector('#livingTail');
  const peopleLayer=document.createElement('div');peopleLayer.id='worldPeople';peopleLayer.setAttribute('role','group');peopleLayer.setAttribute('aria-label','Människor i världen');stage.append(peopleLayer,root);
  const personButtons=new Map();
  let context=null,mode=null,revision=0,speechAt=0,speechEnd=0,lines=[],line=0,onEnd=null,currentTopic=null,currentBranch=null;
  let oldFooterInert=false,oldCanvasInert=false,oldPeopleInert=false,footer=null,focusBack=null,lastSignature='';
  function isKnown(id){try{return JSON.parse(localStorage.getItem(knownKey)||'{}')['street:'+id]===true;}catch{return false;}}
  function remember(id){try{const value=JSON.parse(localStorage.getItem(knownKey)||'{}');value['street:'+id]=true;localStorage.setItem(knownKey,JSON.stringify(value));}catch{}}
  function update(){revision++;lastSignature='';document.body.dataset.livingMode=mode||'';}
  function heading(text){const h=document.createElement('h3');h.id='livingHeading';h.tabIndex=-1;h.textContent=text;return h;}
  function button(text,action,className=''){const b=document.createElement('button');b.type='button';b.textContent=text;b.dataset.action=action;b.className=className;return b;}
  function close(restore=true){
    if(!context)return false;
    const previous=context;context=null;mode=null;lines=[];onEnd=null;speechEnd=0;root.hidden=true;tail.replaceChildren();
    footer.inert=oldFooterInert;canvas.inert=oldCanvasInert;peopleLayer.inert=oldPeopleInert;
    delete document.body.dataset.livingMode;revision++;lastSignature='';
    if(restore){
      const target=previous.roomKey?document.querySelector('#meetingPerson'):personButtons.get(previous.person.id);
      if(target){target.hidden=false;target.focus({preventScroll:true});}else if(focusBack?.isConnected)focusBack.focus({preventScroll:true});
    }
    return true;
  }
  function begin(next){
    if(context)close(false);
    context=next;focusBack=document.activeElement;footer=next.roomKey?roomFooter:document.querySelector('#worldFooter');
    oldFooterInert=footer.inert;oldCanvasInert=canvas.inert;oldPeopleInert=peopleLayer.inert;
    footer.inert=true;canvas.inert=true;peopleLayer.inert=true;
    (next.roomKey?roomView:stage).append(root);root.hidden=false;currentTopic=null;currentBranch=null;
    if(!next.roomKey){path=[];pendingPerson=null;drag=null;follow=true;camera.x=player.x;camera.y=player.y;clamp();}
  }
  function openRoom(key){
    if(!interior||voyage||!(content.roomTopics[key]?.length))return false;
    const actual=interior.outdoor?'quay':interior.kind;if(actual!==key)return false;
    const parent=key==='archive'?window.UPPDRAG_ARCHIVE_PILOT:window.UPPDRAG_PLACE_THOUGHTS;
    parent?.close(false);
    begin({roomKey:key,room:interior,name:names[key],ids:content.roomTopics[key],parent});
    if(context.ids.length===1)startTopic(context.ids[0]);else menu();
    return true;
  }
  function openWorld(person){
    if(interior||sailing||voyage||!person||person.region!==region.id)return false;
    const node=region.map.get(person.node);
    if(!node||Math.hypot(player.x-node.x,player.y-node.y)>3)return false;
    begin({roomKey:null,regionId:region.id,person,name:person.name,ids:person.topics||[]});
    setMessage(person.name,'Du kan stanna och prata en stund eller fortsätta längs vägen.');menu();return true;
  }
  function menu(){
    if(!context)return;
    mode='thoughts';lines=[];speechEnd=0;currentTopic=null;currentBranch=null;bubble.className='thought';bubble.replaceChildren(heading('Du tänker …'));
    if(context.person){
      const person=context.person;
      if(!isKnown(person.id))bubble.append(button('Undrar vem det är?','introduce','thoughtChoice'));
      else if(!greeted.has(person.id))bubble.append(button('Där är '+person.name+'. Jag hälsar.','greet','thoughtChoice'));
      if(person.smalltalk)bubble.append(button(person.smalltalk.thought,'smalltalk','thoughtChoice'));
    }
    for(const id of context.ids){const topic=topics.get(id);if(!topic)continue;const b=button(topic.thought||topic.title,'topic','thoughtChoice');b.dataset.topic=id;bubble.append(b);}
    const actions=document.createElement('div');actions.className='actions';
    actions.append(button('Inte nu','close','quiet'));
    if(context.roomKey)actions.append(button('Till tankarna','parent','quiet'));
    bubble.append(actions);update();position();bubble.querySelector('h3').focus({preventScroll:true});
  }
  function say(nextLines,done){
    lines=nextLines;line=0;onEnd=done;mode='speech';showLine();
  }
  function showLine(){
    if(!context||!lines[line])return;
    if(context.person&&line===1&&lines[0]?.[1]==='Hej igen, '+context.person.name+'.')greeted.add(context.person.id);
    const [who,text]=lines[line];bubble.className='speech';bubble.replaceChildren(heading(who));
    const p=document.createElement('p');p.id='livingLine';p.setAttribute('aria-live','polite');p.setAttribute('aria-atomic','true');p.textContent=text;bubble.append(p);
    const actions=document.createElement('div');actions.className='actions';actions.append(button('Avsluta','close','quiet'));
    const next=button(line===lines.length-1?'Till tankarna':'Fortsätt ↵','next');actions.append(next);bubble.append(actions);
    speechAt=performance.now();speechEnd=speechAt+Math.min(3600,700+text.length*24);update();position();next.focus({preventScroll:true});
  }
  function advance(){
    if(mode!=='speech')return;
    if(++line<lines.length){showLine();return;}
    const done=onEnd;onEnd=null;lines=[];speechEnd=0;if(done)done();else menu();
  }
  function startTopic(id){
    currentTopic=topics.get(id);currentBranch=null;if(!currentTopic)return;
    // The clicked thought becomes an actual question from the player first.
    say([['Du','Vad funderar du på?'],[context.name,currentTopic.question]],()=>choices('branches'));
  }
  function choices(kind){
    if(!context||!currentTopic)return;
    mode=kind;lines=[];speechEnd=0;bubble.className='thought';bubble.replaceChildren(heading('Du tänker …'));
    const options=kind==='followUps'?currentBranch.followUps:currentTopic.branches;
    for(let i=0;i<(options||[]).length;i++){const b=button(options[i].text,'ask','thoughtChoice');b.dataset.choice=String(i);bubble.append(b);}
    if(kind==='followUps')bubble.append(button('Jag undrar också …','branches','thoughtChoice'));
    const actions=document.createElement('div');actions.className='actions';
    actions.append(button('Jag vill fundera vidare','close','quiet'),button('Något annat','menu','quiet'));bubble.append(actions);
    update();position();bubble.querySelector('h3').focus({preventScroll:true});
  }
  function ask(index){
    if(!context||!currentTopic)return;
    const follow=mode==='followUps',choice=(follow?currentBranch.followUps:currentTopic.branches)?.[index];if(!choice)return;
    if(!follow)currentBranch=choice;
    const reply=Array.isArray(choice.reply)?choice.reply.join(' '):choice.reply;
    say([['Du',choice.text],[context.name,reply]],()=>choices(follow?'branches':choice.followUps?.length?'followUps':'branches'));
  }
  bubble.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b||!context)return;
    switch(b.dataset.action){
      case 'close':close();break;
      case 'parent':{const parent=context.parent;close(false);parent?.open();break;}
      case 'menu':menu();break;
      case 'topic':startTopic(b.dataset.topic);break;
      case 'next':advance();break;
      case 'branches':choices('branches');break;
      case 'ask':ask(Number(b.dataset.choice));break;
      case 'smalltalk':say(context.person.smalltalk.lines,menu);break;
      case 'introduce':{const person=context.person;say(person.introduction||[['Du','Hej! Jag är ny lärling här. Vem är du?'],[person.name,'Jag heter '+person.name+'. Trevligt att träffas.']],()=>{remember(person.id);greeted.add(person.id);menu();});break;}
      case 'greet':{const person=context.person;say([['Du','Hej igen, '+person.name+'.'],[person.name,'Hej, lärlingen! Vad tänker du på i dag?']],()=>menu());break;}
    }
  });
  window.addEventListener('keydown',event=>{
    if(!context||!['Enter','Escape','Tab','ArrowDown','ArrowUp','ArrowLeft','ArrowRight',' '].includes(event.key))return;
    event.preventDefault();event.stopImmediatePropagation();if(event.isComposing)return;
    const buttons=[...bubble.querySelectorAll('button')].filter(b=>!b.hidden&&!b.disabled);
    if(event.key==='Tab'||event.key.startsWith('Arrow')){
      const old=buttons.indexOf(document.activeElement),back=event.key==='ArrowUp'||event.key==='ArrowLeft'||event.key==='Tab'&&event.shiftKey;
      const i=old<0?(back?buttons.length-1:0):(old+(back?-1:1)+buttons.length)%buttons.length;buttons[i]?.focus({preventScroll:true});return;
    }
    if(event.repeat)return;
    if(event.key==='Escape')close();else if(buttons.includes(document.activeElement))document.activeElement.click();
  },true);
  for(const target of [canvas,roomCanvas])for(const name of ['pointerdown','pointerup','click'])target.addEventListener(name,event=>{if(context){event.preventDefault();event.stopImmediatePropagation();}},true);
  const bound=(n,a,b)=>Math.max(a,Math.min(Math.max(a,b),n));
  const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  function geometry(){
    if(!context)return null;
    if(context.roomKey)return window.UPPDRAG_MEETINGS?.geometryForRoom();
    const heads=[player,context.person].map(p=>({x:layout.w/2+(p.x-camera.x)*layout.scale,y:layout.h/2+(p.y-camera.y)*layout.scale-16*layout.scale,s:layout.scale*.15}));
    return {w:layout.w,h:layout.h,left:0,top:0,heads};
  }
  function position(){
    const geo=geometry();if(!geo||!context)return;
    const heads=geo.heads||geo.poses.slice(0,2).map(a=>({x:geo.left+geo.p.x+a[0]*geo.p.scale,y:geo.top+geo.p.y+(a[1]-305*a[2])*geo.p.scale,s:a[2]*geo.p.scale}));
    if(heads.length<2)return;
    const index=mode==='speech'&&lines[line]?.[0]!=='Du'?1:0,anchor=heads[index];
    const bodies=heads.map(a=>({x:a.x-65*a.s-8,y:a.y-24*a.s-8,w:130*a.s+16,h:338*a.s+16}));
    let width=Math.min(392,geo.w-24);
    if(geo.h<380&&context.roomKey){
      const left=Math.min(...bodies.map(b=>b.x))-geo.left-24,right=geo.left+geo.w-Math.max(...bodies.map(b=>b.x+b.w))-24;
      const free=Math.max(left,right);if(free>=210)width=Math.min(width,free);
    }
    bubble.style.width=width+'px';bubble.style.maxHeight=Math.max(80,geo.h-24)+'px';
    const height=bubble.getBoundingClientRect().height,minX=geo.left+12,maxX=geo.left+geo.w-width-12,minY=geo.top+12,maxY=geo.top+geo.h-height-12;
    const faces=heads.map(a=>({x:a.x-43*a.s-5,y:a.y-22*a.s-5,w:86*a.s+10,h:78*a.s+10}));
    const candidates=[
      {x:anchor.x-width/2,y:Math.min(...heads.map(a=>a.y))-height-32},
      {x:geo.left+(geo.w-width)/2,y:minY},
      {x:Math.min(...bodies.map(b=>b.x))-width-12,y:minY},
      {x:Math.max(...bodies.map(b=>b.x+b.w))+12,y:minY},
      {x:minX,y:minY},{x:maxX,y:minY},
      {x:minX,y:maxY},{x:maxX,y:maxY}
    ].map(c=>({x:bound(c.x,minX,maxX),y:bound(c.y,minY,maxY),w:width,h:height}));
    for(const c of candidates)c.score=faces.reduce((s,h)=>s+overlap(c,h)*100,0)+bodies.reduce((s,b)=>s+overlap(c,b),0)+Math.abs(c.x+width/2-anchor.x)*.1+Math.abs(c.y+height-anchor.y)*.15;
    candidates.sort((a,b)=>a.score-b.score);const best=candidates[0];Object.assign(bubble.style,{left:best.x+'px',top:best.y+'px'});
    const tipX=anchor.x+(index?38:-38)*anchor.s,tipY=anchor.y+34*anchor.s;
    let baseX=bound(tipX,best.x+24,best.x+width-24),baseY=best.y+height-1,side=false;
    if(tipY>best.y+18&&tipY<best.y+height-18&&(tipX<best.x||tipX>best.x+width)){
      baseX=tipX<best.x?best.x+1:best.x+width-1;baseY=bound(tipY,best.y+22,best.y+height-22);side=true;
    }else if(tipY<best.y){baseY=best.y+1;}
    const svg='http://www.w3.org/2000/svg';tail.replaceChildren();
    if(mode!=='speech'){
      for(const u of [.17,.50,.78]){const c=document.createElementNS(svg,'circle');c.setAttribute('cx',baseX+(tipX-baseX)*u);c.setAttribute('cy',baseY+(tipY-baseY)*u);c.setAttribute('r',9-6*u);c.setAttribute('fill','#fbf1dc');c.setAttribute('stroke','#9c815c');tail.append(c);}
    }else{
      const path=document.createElementNS(svg,'path');path.setAttribute('d',side?`M${baseX},${baseY-10} L${tipX},${tipY} L${baseX},${baseY+10}`:`M${baseX-10},${baseY} L${tipX},${tipY} L${baseX+10},${baseY}`);path.setAttribute('fill','#fbf1dc');path.setAttribute('stroke','#9c815c');path.setAttribute('stroke-width','1.5');tail.append(path);
    }
  }
  function outdoorButtons(){
    const hidden=!!interior||!!voyage||!!sailing;peopleLayer.hidden=hidden;
    if(hidden){greeted.clear();return;}
    const people=window.UPPDRAG_WORLD_LIFE?.people(region)||[],ids=new Set(people.map(p=>p.id));
    for(const [id,b] of personButtons)if(!ids.has(id))b.hidden=true;
    for(const person of people){
      if(Math.hypot(person.x-player.x,person.y-player.y)>360)greeted.delete(person.id);
      let b=personButtons.get(person.id);
      if(!b){b=document.createElement('button');b.type='button';b.dataset.person=person.id;b.setAttribute('aria-label','Prata med '+person.name);b.title=person.name;const label=document.createElement('span');label.textContent=person.name;b.append(label);peopleLayer.append(b);personButtons.set(person.id,b);b.addEventListener('click',()=>requestPerson(window.UPPDRAG_WORLD_LIFE.people(region).find(p=>p.id===person.id)));b.addEventListener('pointerenter',()=>{hoverPersonId=person.id;});b.addEventListener('pointerleave',()=>{hoverPersonId=null;});}
      const x=layout.w/2+(person.x-camera.x)*layout.scale,y=layout.h/2+(person.y-camera.y)*layout.scale;
      b.hidden=x<20||x>layout.w-20||y<30||y>layout.h-30;
      if(document.activeElement===b)hoverPersonId=person.id;
      b.style.left=(x-26)+'px';b.style.top=(y-34)+'px';
    }
  }
  function tick(){
    outdoorButtons();if(!context)return;
    if(context.roomKey?(interior!==context.room||!!voyage):(!!interior||!!sailing||!!voyage||region.id!==context.regionId)){close(false);return;}
    const r=(context.roomKey?roomView:stage).getBoundingClientRect();
    const signature=[r.width,r.height,revision,context.roomKey?'':camera.x,context.roomKey?'':camera.y].join(':');
    if(signature!==lastSignature){position();lastSignature=signature;}
  }
  new ResizeObserver(()=>{lastSignature='';if(context)position();}).observe(stage);
  return {openRoom,openWorld,close,tick,get busy(){return !!context;},get active(){return !!context;},get roomKey(){return context?.roomKey||null;},get personId(){return context?.person?.id||null;},get revision(){return revision;},get speaker(){return mode==='speech'?lines[line]?.[0]||'':'';},get speech(){return {at:speechAt,end:speechEnd};},get state(){return {room:context?.roomKey||null,person:context?.person?.id||null,mode,topic:currentTopic?.id||null,line};}};
})();
