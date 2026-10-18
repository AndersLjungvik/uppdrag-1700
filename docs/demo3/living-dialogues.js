/* Demo 3.14: one passing person's brief thought, then continue walking.
 * Original curriculum questions are source metadata, never a menu or a test.
 * Uses the world's existing animation loop and current walking-person poses.
 */
'use strict';
window.UPPDRAG_LIVING_DIALOGUES=(()=>{
  const content=window.UPPDRAG_LIVING_CONTENT;
  const ponderings=new Map((content?.ponderings||[]).map(thought=>[thought.id,thought]));
  const encounters=new Map(),personButtons=new Map();
  const style=document.createElement('style');
  style.textContent=`
    #livingDialogue{position:absolute;inset:0;pointer-events:none;z-index:9;color:#352d24;font-family:system-ui,sans-serif}
    #livingTail{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
    #livingBubble{position:absolute;pointer-events:auto;box-sizing:border-box;background:#fbf1dc;border:2px dashed #9c815c;border-radius:25px;padding:11px 14px;box-shadow:2px 4px 0 #41342220;max-width:calc(100% - 20px);overflow:auto;overscroll-behavior:contain;touch-action:pan-y}
    #livingBubble h3{font:600 13px/1.3 system-ui;margin:0 0 7px;color:#61513b}
    #livingBubble p{font:17px/1.4 system-ui;margin:0 0 10px}
    #livingBubble .actions{display:flex;justify-content:flex-end}
    #livingBubble button{min-height:42px;padding:7px 12px;border:1px solid #a18b66;border-radius:8px;background:#ead7b1;color:#352d24;font:14px/1.35 system-ui;cursor:pointer;touch-action:manipulation}
    #livingBubble button:focus-visible{outline:3px solid #355e68;outline-offset:2px}
    #worldPeople{position:absolute;inset:0;pointer-events:none;z-index:3}
    #worldPeople button{position:absolute;pointer-events:auto;width:48px;height:60px;border:0;background:transparent;cursor:pointer;touch-action:manipulation;border-radius:18px;padding:0}
    #worldPeople button:focus-visible{outline:3px solid #355e68;outline-offset:2px}
    body[data-living-mode] #message{visibility:hidden}
    @media(max-width:640px){#livingBubble{padding:10px 12px}#livingBubble p{font-size:16px}}
    @media(max-height:400px){#livingBubble{padding:8px 11px}#livingBubble p{font-size:15px;line-height:1.35}#livingBubble h3{margin-bottom:5px}}
  `;
  document.head.append(style);
  const root=document.createElement('div');root.id='livingDialogue';root.hidden=true;
  root.innerHTML='<svg id="livingTail" aria-hidden="true"></svg><section id="livingBubble" class="thought" role="dialog" aria-modal="true" aria-labelledby="livingHeading" aria-describedby="livingLine"><h3 id="livingHeading"></h3><p id="livingLine"></p><div class="actions"><button type="button" data-action="close">Gå vidare</button></div></section>';
  const bubble=root.querySelector('#livingBubble'),tail=root.querySelector('#livingTail');
  const heading=bubble.querySelector('h3'),line=bubble.querySelector('p'),leave=bubble.querySelector('button');
  const peopleLayer=document.createElement('div');peopleLayer.id='worldPeople';peopleLayer.setAttribute('role','group');peopleLayer.setAttribute('aria-label','Människor längs vägen');stage.append(peopleLayer,root);
  const footer=document.querySelector('#worldFooter');
  let context=null,revision=0,lastSignature='',focusBack=null;
  let oldFooterInert=false,oldCanvasInert=false,oldPeopleInert=false;
  function close(restore=true){
    if(!context)return false;
    const previous=context;context=null;root.hidden=true;tail.replaceChildren();
    window.UPPDRAG_WORLD_LIFE?.release(previous.person.id);
    footer.inert=oldFooterInert;canvas.inert=oldCanvasInert;peopleLayer.inert=oldPeopleInert;
    delete document.body.dataset.livingMode;revision++;lastSignature='';
    setMessage(region.name,'Du fortsätter längs vägen.');
    if(restore){
      const target=personButtons.get(previous.person.id);
      if(target&&!target.hidden)target.focus({preventScroll:true});
      else if(focusBack?.isConnected)focusBack.focus({preventScroll:true});
      else canvas.focus({preventScroll:true});
    }
    return true;
  }
  function openWorld(person){
    if(context||interior||sailing||voyage||!person||person.region!==region.id)return false;
    const current=window.UPPDRAG_WORLD_LIFE?.people(region).find(p=>p.id===person.id);
    if(!current||Math.hypot(player.x-current.x,player.y-current.y)>80)return false;
    const thoughts=(current.ponderings||[]).map(id=>ponderings.get(id)).filter(Boolean);
    if(!thoughts.length)return false;
    const index=encounters.get(current.id)||0,thought=thoughts[index%thoughts.length];
    encounters.set(current.id,index+1);
    const stopped=window.UPPDRAG_WORLD_LIFE.freeze(current.id)||current;
    context={regionId:region.id,person:stopped,thought};focusBack=document.activeElement;
    oldFooterInert=footer.inert;oldCanvasInert=canvas.inert;oldPeopleInert=peopleLayer.inert;
    footer.inert=true;canvas.inert=true;peopleLayer.inert=true;
    path=[];pendingPerson=null;drag=null;follow=true;
    // Keep the meeting in view; the bubble belongs to the person, not the player.
    camera.x=(player.x+stopped.x)/2;camera.y=(player.y+stopped.y)/2;clamp();
    heading.textContent=stopped.name+' funderar …';line.textContent=thought.text;
    root.hidden=false;document.body.dataset.livingMode='thought';revision++;lastSignature='';
    position();leave.focus({preventScroll:true});return true;
  }
  leave.addEventListener('click',()=>close());
  window.addEventListener('keydown',event=>{
    if(!context||!['Enter','Escape','Tab','ArrowDown','ArrowUp','ArrowLeft','ArrowRight',' '].includes(event.key))return;
    event.preventDefault();event.stopImmediatePropagation();if(event.isComposing)return;
    if(event.key==='Tab'||event.key.startsWith('Arrow')){leave.focus({preventScroll:true});return;}
    if(event.repeat)return;
    if(event.key==='Escape'||document.activeElement===leave)close();
  },true);
  for(const name of ['pointerdown','pointerup','click'])canvas.addEventListener(name,event=>{if(context){event.preventDefault();event.stopImmediatePropagation();}},true);
  const bound=(n,a,b)=>Math.max(a,Math.min(Math.max(a,b),n));
  const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  function screenHead(person){return {x:layout.w/2+(person.x-camera.x)*layout.scale,y:layout.h/2+(person.y-camera.y-18)*layout.scale};}
  function position(){
    if(!context)return;
    const current=window.UPPDRAG_WORLD_LIFE?.people(region).find(p=>p.id===context.person.id)||context.person;
    const anchor=screenHead(current),heads=[screenHead(player),anchor];
    const width=Math.min(310,layout.w-24);
    bubble.style.width=width+'px';bubble.style.maxHeight=Math.max(80,layout.h-24)+'px';
    const height=bubble.getBoundingClientRect().height,minX=12,maxX=layout.w-width-12,minY=12,maxY=layout.h-height-12;
    const bodies=heads.map(h=>({x:h.x-22*layout.scale-4,y:h.y-13*layout.scale-4,w:44*layout.scale+8,h:57*layout.scale+8}));
    const candidates=[
      {x:anchor.x-width/2,y:Math.min(...heads.map(h=>h.y))-height-27},
      {x:anchor.x+35*layout.scale,y:anchor.y-height/2},
      {x:anchor.x-width-35*layout.scale,y:anchor.y-height/2},
      {x:minX,y:minY},{x:maxX,y:minY},{x:minX,y:maxY},{x:maxX,y:maxY}
    ].map(c=>({x:bound(c.x,minX,maxX),y:bound(c.y,minY,maxY),w:width,h:height}));
    for(const c of candidates)c.score=bodies.reduce((sum,b)=>sum+overlap(c,b)*30,0)+Math.abs(c.x+width/2-anchor.x)*.1+Math.abs(c.y+height-anchor.y)*.15;
    candidates.sort((a,b)=>a.score-b.score);const best=candidates[0];
    Object.assign(bubble.style,{left:best.x+'px',top:best.y+'px'});
    const tipX=anchor.x+9*layout.scale,tipY=anchor.y-5*layout.scale;
    let baseX=bound(tipX,best.x+22,best.x+width-22),baseY=best.y+height-1;
    if(tipY>best.y+15&&tipY<best.y+height-15&&(tipX<best.x||tipX>best.x+width)){
      baseX=tipX<best.x?best.x+1:best.x+width-1;baseY=bound(tipY,best.y+20,best.y+height-20);
    }else if(tipY<best.y)baseY=best.y+1;
    const svg='http://www.w3.org/2000/svg';tail.replaceChildren();
    for(const u of [.2,.53,.82]){const circle=document.createElementNS(svg,'circle');circle.setAttribute('cx',baseX+(tipX-baseX)*u);circle.setAttribute('cy',baseY+(tipY-baseY)*u);circle.setAttribute('r',7-5*u);circle.setAttribute('fill','#fbf1dc');circle.setAttribute('stroke','#9c815c');tail.append(circle);}
  }
  function outdoorButtons(){
    const hidden=!!interior||!!voyage||!!sailing;peopleLayer.hidden=hidden;if(hidden)return;
    const people=window.UPPDRAG_WORLD_LIFE?.people(region)||[],ids=new Set(people.map(p=>p.id));
    for(const [id,button] of personButtons)if(!ids.has(id))button.hidden=true;
    for(const person of people){
      let button=personButtons.get(person.id);
      if(!button){
        button=document.createElement('button');button.type='button';button.dataset.person=person.id;
        button.setAttribute('aria-label','Stanna hos '+person.name);button.title=person.name;
        peopleLayer.append(button);personButtons.set(person.id,button);
        button.addEventListener('click',()=>requestPerson(window.UPPDRAG_WORLD_LIFE.people(region).find(p=>p.id===person.id)));
        button.addEventListener('pointerenter',()=>{hoverPersonId=person.id;});
        button.addEventListener('pointerleave',()=>{hoverPersonId=null;});
      }
      const x=layout.w/2+(person.x-camera.x)*layout.scale,y=layout.h/2+(person.y-camera.y)*layout.scale;
      button.hidden=x<20||x>layout.w-20||y<30||y>layout.h-30;
      if(document.activeElement===button)hoverPersonId=person.id;
      button.style.left=(x-24)+'px';button.style.top=(y-34)+'px';
    }
  }
  function tick(){
    outdoorButtons();if(!context)return;
    if(interior||sailing||voyage||region.id!==context.regionId){close(false);return;}
    const signature=[layout.w,layout.h,layout.scale,revision,camera.x,camera.y].join(':');
    if(signature!==lastSignature){position();lastSignature=signature;}
  }
  new ResizeObserver(()=>{lastSignature='';if(context)position();}).observe(stage);
  return {openWorld,close,tick,get busy(){return !!context;},get active(){return !!context;},get roomKey(){return null;},get personId(){return context?.person.id||null;},get revision(){return revision;},get speaker(){return '';},get speech(){return {at:0,end:0};},get state(){return {room:null,person:context?.person.id||null,mode:context?'thought':null,thought:context?.thought.id||null};}};
})();
