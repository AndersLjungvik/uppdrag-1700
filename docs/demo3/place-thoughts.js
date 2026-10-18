/* 3.10: extend the approved thought -> spoken line interaction to Maja, Brita
 * and Jo. Rut's archive pilot is unchanged. No tasks, progress or world writes.
 * The existing meeting renderer supplies geometry and the single animation loop.
 */
'use strict';
window.UPPDRAG_PLACE_THOUGHTS=(()=>{
  const TOPICS={
    cafe:{name:'Maja',choices:[
      {id:'who',thought:'Undrar vem hon är?',lines:[['Du','Hej! Är det du som är Maja?'],['Maja','Ja, välkommen till kaffehuset! Här träffas vi för att läsa och prata.']]},
      {id:'board',thought:'Vad sitter på anslagstavlan?',lines:[['Du','Vad är det för papper på väggen?'],['Maja','Det är vår anslagstavla. Där samlar vi texter som vi vill läsa och prata om.']]}
    ]},
    print:{name:'Brita',choices:[
      {id:'who',thought:'Undrar vem som arbetar här?',lines:[['Du','Hej! Är det du som sköter tryckpressen?'],['Brita','Ja, jag heter Brita. Här sätter jag ihop bokstäver och trycker texter på papper.']]},
      {id:'types',thought:'Vad är det för bokstäver på bordet?',lines:[['Du','Vad använder du de små bokstäverna till?'],['Brita','De kallas typer. Jag sätter ihop dem till ord, lägger på trycksvärta och trycker texten på papper.']]}
    ]},
    quay:{name:'Jo',choices:[
      {id:'who',thought:'Undrar vad han gör vid kajen?',lines:[['Du','Hej! Vad arbetar du med här?'],['Jo','Jag heter Jo och är hamnskrivare. Jag håller ordning på fartygens last och handlingar.']]},
      {id:'travel',thought:'Hur kommer jag med fartyget?',lines:[['Du','Hej! Är det här jag går ombord?'],['Jo','Ja. Välj resmål vid fartyget när du vill segla. Du kommer fram till hamnen på den plats du valt.']]}
    ]}
  };
  const css=document.createElement('style');
  css.textContent=`
  #placeThoughts{position:absolute;inset:0;pointer-events:none;z-index:6;color:#352d24;font-family:system-ui,sans-serif}
  #placeTail{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
  #placeBubble{position:absolute;pointer-events:auto;box-sizing:border-box;background:#fbf1dc;border:2px solid #9c815c;border-radius:20px;padding:12px 15px;box-shadow:2px 4px 0 #41342220;width:348px;max-width:calc(100% - 20px);overflow:auto;overscroll-behavior:contain}
  #placeBubble.thought{border-style:dashed;border-radius:28px}
  #placeBubble h3{font:600 14px/1.3 system-ui;margin:0 0 7px;color:#61513b}
  #placeBubble h3:focus{outline:none}
  #placeBubble p{font:18px/1.4 system-ui;margin:0 0 10px}
  #placeBubble button{min-height:42px;padding:8px 12px;border:1px solid #a18b66;border-radius:8px;background:#ead7b1;color:#352d24;font:15px/1.35 system-ui;cursor:pointer;touch-action:manipulation}
  #placeBubble .thoughtChoice{display:block;width:100%;text-align:left;margin:7px 0;background:#fff8e9}
  #placeBubble .actions{display:flex;justify-content:space-between;align-items:center;gap:9px}
  #placeBubble .quiet{background:transparent;border-color:transparent}
  #placeBubble button:focus-visible{outline:3px solid #355e68;outline-offset:2px}
  @media(max-width:640px){#placeBubble{padding:10px 12px}#placeBubble p{font-size:16px}#placeBubble button{font-size:14px;min-height:40px}}
  @media(max-height:480px) and (min-width:641px){#placeBubble{padding:8px 10px}#placeBubble p{font-size:15px;line-height:1.35}#placeBubble button{font-size:13px;min-height:36px;padding:6px 9px}#placeBubble h3{font-size:13px}}
  `;
  document.head.append(css);
  const root=document.createElement('div');root.id='placeThoughts';root.hidden=true;
  root.innerHTML='<svg id="placeTail" aria-hidden="true"></svg><section id="placeBubble" hidden role="dialog" aria-modal="true" aria-labelledby="placeHeading"></section>';
  roomView.append(root);
  const bubble=root.querySelector('#placeBubble'),tail=root.querySelector('#placeTail');
  let active=false,room=null,geo=null,key=null,mode=null,topic=null,line=0,revision=0;
  let speechAt=0,speechEnd=0,oldInert=false,lastSignature='';
  function update(){revision++;lastSignature='';}
  function setMode(next){
    if(!mode&&next){oldInert=roomFooter.inert;roomFooter.inert=true;}
    if(mode&&!next)roomFooter.inert=oldInert;
    mode=next;bubble.hidden=!mode;root.hidden=!active;
    if(mode)document.body.dataset.thoughtMode=mode;else delete document.body.dataset.thoughtMode;
    speechEnd=0;update();
  }
  function close(restore=true){
    if(!mode)return false;
    setMode(null);tail.replaceChildren();
    if(restore){const b=document.querySelector('#meetingPerson');if(b){b.hidden=false;b.focus({preventScroll:true});}}
    return true;
  }
  function open(){
    if(!active||!geo)return false;
    setMode('thoughts');topic=null;line=0;bubble.className='thought';
    bubble.replaceChildren();
    const heading=document.createElement('h3');heading.id='placeHeading';heading.tabIndex=-1;heading.textContent='Du tänker …';bubble.append(heading);
    for(const choice of TOPICS[key].choices){const b=document.createElement('button');b.type='button';b.className='thoughtChoice';b.dataset.thought=choice.id;b.textContent=choice.thought;bubble.append(b);}
    const actions=document.createElement('div');actions.className='actions';
    const skip=document.createElement('button');skip.type='button';skip.className='quiet';skip.dataset.action='close';skip.textContent='Inte nu';actions.append(skip);bubble.append(actions);
    position();heading.focus({preventScroll:true});return true;
  }
  function speak(id){
    const chosen=TOPICS[key]?.choices.find(c=>c.id===id);if(!chosen)return;
    topic=chosen;line=0;setMode('speech');showLine();
  }
  function showLine(){
    const [who,text]=topic.lines[line],last=line===topic.lines.length-1;
    bubble.className='speech';
    bubble.innerHTML='<h3 id="placeHeading"></h3><p id="placeLine" aria-live="polite" aria-atomic="true"></p><div class="actions"><button type="button" class="quiet" data-action="close">Avsluta</button><button type="button" data-action="next"></button></div>';
    bubble.querySelector('h3').textContent=who;bubble.querySelector('p').textContent=text;
    const next=bubble.querySelector('[data-action="next"]');next.textContent=last?'Klart ↵':'Fortsätt ↵';
    speechAt=performance.now();speechEnd=speechAt+Math.min(3600,700+text.length*24);
    update();position();next.focus({preventScroll:true});
  }
  function advance(){if(mode!=='speech')return;if(++line<topic.lines.length)showLine();else close();}
  root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.thought)speak(b.dataset.thought);else if(b.dataset.action==='close')close();else if(b.dataset.action==='next')advance();
  });
  // No preselected thought. Enter confirms only an intentionally focused choice.
  window.addEventListener('keydown',e=>{
    if(!active||!mode)return;
    if(!['Enter','Escape','Tab','ArrowDown','ArrowUp','ArrowLeft','ArrowRight',' '].includes(e.key))return;
    if(e.isComposing){e.stopImmediatePropagation();return;}
    const buttons=[...bubble.querySelectorAll('button')].filter(b=>!b.hidden&&!b.disabled);
    if(e.key==='Tab'||e.key.startsWith('Arrow')){
      e.preventDefault();e.stopImmediatePropagation();
      const old=buttons.indexOf(document.activeElement),back=e.key==='ArrowUp'||e.key==='ArrowLeft'||e.key==='Tab'&&e.shiftKey;
      const i=old<0?(back?buttons.length-1:0):(old+(back?-1:1)+buttons.length)%buttons.length;
      buttons[i]?.focus({preventScroll:true});return;
    }
    e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
    if(e.key==='Escape')close();else if(buttons.includes(document.activeElement))document.activeElement.click();
  },true);
  for(const event of ['pointerdown','pointerup','click'])roomCanvas.addEventListener(event,e=>{if(active&&mode){e.preventDefault();e.stopImmediatePropagation();}},true);
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  function position(){
    if(!active||!geo||!mode)return;
    const {p}=geo;
    const heads=geo.poses.slice(0,2).map(a=>({x:geo.left+p.x+a[0]*p.scale,y:geo.top+p.y+(a[1]-305*a[2])*p.scale,s:a[2]*p.scale}));
    if(heads.length<2)return;
    const index=mode==='speech'&&topic.lines[line][0]!=='Du'?1:0,anchor=heads[index];
    const bodies=heads.map(a=>({x:a.x-65*a.s-8,y:a.y-24*a.s-8,w:130*a.s+16,h:338*a.s+16}));
    const gapLeft=bodies[0].x+bodies[0].w+12,gapRight=bodies[1].x-12;
    let width=Math.min(348,geo.w-24);
    if(geo.h<350){
      const leftFree=bodies[0].x-geo.left-24,rightFree=geo.left+geo.w-bodies[1].x-bodies[1].w-24;
      const preferred=index?rightFree:leftFree;
      const free=preferred>=190?preferred:Math.max(leftFree,gapRight-gapLeft,rightFree);
      if(free>=190)width=Math.min(width,free);
    }
    bubble.style.width=width+'px';bubble.style.maxHeight=Math.max(80,geo.h-24)+'px';
    const height=bubble.getBoundingClientRect().height;
    const minX=geo.left+12,maxX=geo.left+geo.w-width-12,minY=geo.top+12,maxY=geo.top+geo.h-height-12;
    const candidates=[
      {x:anchor.x-width/2,y:Math.min(...heads.map(a=>a.y))-height-30},
      {x:geo.left+(geo.w-width)/2,y:minY},
      {x:gapLeft+(gapRight-gapLeft-width)/2,y:minY},
      {x:Math.min(...bodies.map(b=>b.x))-width-12,y:minY},
      {x:Math.max(...bodies.map(b=>b.x+b.w))+12,y:minY},
      {x:minX,y:minY},{x:maxX,y:minY}
    ].map(c=>({x:clamp(c.x,minX,maxX),y:clamp(c.y,minY,maxY),w:width,h:height}));
    const faces=heads.map(a=>({x:a.x-43*a.s-5,y:a.y-22*a.s-5,w:86*a.s+10,h:78*a.s+10}));
    for(const c of candidates)c.score=faces.reduce((s,h)=>s+overlap(c,h)*100,0)+bodies.reduce((s,b)=>s+overlap(c,b),0)+Math.abs(c.x+width/2-anchor.x)*.1+Math.abs(c.y+height-anchor.y)*.15;
    candidates.sort((a,b)=>a.score-b.score);const best=candidates[0];
    Object.assign(bubble.style,{left:best.x+'px',top:best.y+'px'});
    const tipX=anchor.x+(index?38:-38)*anchor.s,tipY=anchor.y+34*anchor.s;
    let baseX=clamp(tipX,best.x+24,best.x+width-24),baseY=best.y+height-1,side=false;
    if(tipY>best.y+18&&tipY<best.y+height-18&&(tipX<best.x||tipX>best.x+width)){
      baseX=tipX<best.x?best.x+1:best.x+width-1;baseY=clamp(tipY,best.y+22,best.y+height-22);side=true;
    }
    const svg='http://www.w3.org/2000/svg';tail.replaceChildren();
    if(mode==='thoughts'){
      for(const u of [.17,.50,.78]){const c=document.createElementNS(svg,'circle');c.setAttribute('cx',baseX+(tipX-baseX)*u);c.setAttribute('cy',baseY+(tipY-baseY)*u);c.setAttribute('r',9-6*u);c.setAttribute('fill','#fbf1dc');c.setAttribute('stroke','#9c815c');tail.append(c);}
    }else{
      const t=document.createElementNS(svg,'path');t.setAttribute('d',side?`M${baseX},${baseY-10} L${tipX},${tipY} L${baseX},${baseY+10}`:`M${baseX-10},${baseY} L${tipX},${tipY} L${baseX+10},${baseY}`);t.setAttribute('fill','#fbf1dc');t.setAttribute('stroke','#9c815c');t.setAttribute('stroke-width','1.5');tail.append(t);
    }
  }
  function tick(now,geometry){
    const k=geometry?.c?.key,enabled=!!interior&&!voyage&&Object.hasOwn(TOPICS,k);
    if(!enabled){if(active){close(false);active=false;room=null;geo=null;key=null;root.hidden=true;update();}return;}
    if(!active||interior!==room){close(false);active=true;room=interior;key=k;update();}
    geo=geometry;root.hidden=!active;
    const sig=[geo.w,geo.h,geo.top,geo.left,revision].join(':');if(sig!==lastSignature){position();lastSignature=sig;}
  }
  return {tick,open,close,get active(){return active;},get busy(){return active&&!!mode;},get revision(){return revision;},
    get speaker(){return mode==='speech'?topic.lines[line][0]:'';},get speech(){return {at:speechAt,end:speechEnd};},
    get state(){return {active,key,mode,topic:topic?.id||null,line};}};
})();
