/* Archive pilot 3.9. Thought -> spoken line -> optional document comparison.
 * Fictional practice notes, not historical sources. No quiz-bank/progress writes.
 * Backgrounds and the existing walking/door/voyage engine are not changed.
 */
'use strict';
window.UPPDRAG_ARCHIVE_PILOT=(()=>{

  // Remember completed introductions on this device; never require them again.
  const knownKey='uppdrag1700-known-people-v1';
  function isKnown(id){try{return JSON.parse(localStorage.getItem(knownKey)||'{}')[id]===true}catch{return false}}
  function remember(id){try{const data=JSON.parse(localStorage.getItem(knownKey)||'{}');data[id]=true;localStorage.setItem(knownKey,JSON.stringify(data))}catch{}}
  const css=document.createElement('style');
  css.textContent=`
  #rutPilot{position:absolute;inset:0;pointer-events:none;z-index:6;color:#352d24;font-family:system-ui,sans-serif}
  #rutTail{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
  #rutPanel{position:absolute;pointer-events:auto;background:#fbf1dc;border:2px solid #9c815c;border-radius:20px;padding:12px 15px;box-shadow:2px 4px 0 #41342220;width:340px;max-width:calc(100% - 20px)}
  #rutPanel.thought{border-style:dashed;border-radius:28px}
  #rutPanel h3{font:600 14px/1.3 system-ui;margin:0 0 7px;color:#61513b}
  #rutPanel p{font:18px/1.4 system-ui;margin:0 0 10px}
  #rutPanel button,#rutDocuments button{min-height:42px;padding:8px 12px;border:1px solid #a18b66;border-radius:8px;background:#ead7b1;color:#352d24;font:15px/1.35 system-ui;cursor:pointer}
  #rutPanel .thoughtChoice{display:block;width:100%;text-align:left;margin:7px 0;background:#fff8e9}
  #rutPanel .rutActions{display:flex;justify-content:space-between;align-items:center;gap:9px}
  #rutPanel .quiet,#rutDocuments .quiet{background:transparent;border-color:transparent}
  #rutPilot button:focus-visible,#rutPapers:focus-visible{outline:3px solid #355e68;outline-offset:2px}
  #rutPilot h3:focus,#rutDocuments h3:focus{outline:none}
  #rutPapers{position:absolute;pointer-events:auto;z-index:5;background:transparent;border:0;border-radius:6px;cursor:pointer;min-width:44px;min-height:44px;padding:0}
  #rutPapers span{position:absolute;right:2px;top:100%;white-space:nowrap;background:#f4e7c9;border:1px solid #a58d63;border-radius:4px;padding:3px 7px;font:13px/1.2 Georgia,serif;color:#453729}
  #rutPapers:hover{outline:2px solid #a58d63}
  #rutDocuments{pointer-events:auto;position:absolute;left:50%;top:10px;transform:translateX(-50%);width:min(670px,calc(100% - 20px));max-height:calc(100% - 20px);overflow:auto;overscroll-behavior:contain;padding:16px;background:#eadabd;border:2px solid #9f8862;border-radius:12px;box-shadow:3px 4px 0 #41342228}
  #rutDocuments h3{font:600 23px/1.2 Georgia,serif;margin:0 0 4px}
  #rutDocuments .practiceNote{font:12px/1.3 system-ui;margin:0 0 12px;color:#675943}
  #rutDocuments .sources{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  #rutDocuments article{padding:12px;background:#fff5de;box-shadow:2px 2px 0 #57452c24;border:1px solid #c6b291}
  #rutDocuments article h4{font:600 15px/1.3 system-ui;margin:0 0 7px}
  #rutDocuments article p{font:17px/1.45 Georgia,serif;margin:0}
  #rutDocuments .question{font:600 17px/1.4 system-ui;margin:14px 0 8px}
  #rutAnswers{display:grid;gap:7px}#rutAnswers button{text-align:left;background:#fff6e4}
  #rutFeedback{font:16px/1.4 system-ui;margin:12px 0;color:#3d483d}
  #rutDocuments[data-solved] .sequence{background:#e1e7cf;text-decoration:underline;text-decoration-color:#607553;text-underline-offset:3px}
  #rutDocuments .docActions{display:flex;justify-content:space-between;gap:8px;margin-top:10px}
  @media(max-height:480px) and (min-width:641px){#rutPanel{padding:8px 10px}#rutPanel p{font-size:15px;line-height:1.35}#rutPanel button{font-size:13px;min-height:36px;padding:6px 9px}#rutPanel h3{font-size:13px}}
  body[data-room="archive"] #meetingPerson span{bottom:auto;top:-23px}
  @media(max-width:640px){#rutPanel{padding:10px 12px}#rutPanel p{font-size:16px}#rutPanel button{font-size:14px;min-height:40px}#rutDocuments{padding:12px}#rutDocuments .sources{grid-template-columns:1fr;gap:8px}#rutDocuments article{padding:9px 11px}#rutDocuments article p{font-size:16px;line-height:1.35}#rutDocuments article h4{margin-bottom:4px}#rutDocuments .question{font-size:16px;margin-top:10px}}
  `;
  document.head.append(css);
  const root=document.createElement('div');root.id='rutPilot';root.hidden=true;
  root.innerHTML='<svg id="rutTail" aria-hidden="true"></svg><section id="rutPanel" hidden role="dialog" aria-modal="true" aria-labelledby="rutHeading"></section><section id="rutDocuments" hidden role="dialog" aria-modal="true" aria-labelledby="rutDocHeading"></section>';
  const paperButton=document.createElement('button');paperButton.id='rutPapers';paperButton.type='button';paperButton.hidden=true;paperButton.setAttribute('aria-label','Undersök handlingarna på läsbordet');paperButton.innerHTML='<span>Handlingarna</span>';
  roomView.append(root,paperButton);
  const panel=root.querySelector('#rutPanel'),tail=root.querySelector('#rutTail'),docs=root.querySelector('#rutDocuments');
  let active=false,room=null,geo=null,mode=null,topic=null,line=0,revision=0,speechAt=0,speechEnd=0;
  let oldInert=false,lastGeometry='',solved=false;
  const conversations={
    who:[['Du','Hej! Är det du som är Rut?'],['Rut','Ja. Jag är läromästaren Rut. Här undersöker vi vad handlingarna berättar.']],
    papers:[['Du','Varför har du två berättelser om samma leverans?'],['Rut','De beskriver samma leverans, men i olika ordning. Lägg dem bredvid varandra och se vad som skiljer.']],
    conclusion:[['Du','De säger olika om vad som hände först.'],['Rut','Ja. Vi vet vad vi behöver kontrollera, men ännu inte vilken berättelse som stämmer.']]
  };
  function update(){revision++;lastGeometry='';}
  function setMode(next){
    if(!mode&&next){oldInert=roomFooter.inert;roomFooter.inert=true;}
    if(mode&&!next)roomFooter.inert=oldInert;
    mode=next;panel.hidden=!['thoughts','speech'].includes(mode);docs.hidden=mode!=='papers';
    paperButton.hidden=!active||!!mode;root.hidden=!active;
    if(mode)document.body.dataset.archiveMode=mode;else delete document.body.dataset.archiveMode;
    speechEnd=0;update();
  }
  function focusHeading(el){el.setAttribute('tabindex','-1');el.focus({preventScroll:true});}
  function close(restore=true){setMode(null);tail.replaceChildren();if(restore){const b=document.querySelector('#meetingPerson');b.hidden=false;b.focus({preventScroll:true});}return true;}
  function thoughts(){
    if(!active)return false;setMode('thoughts');panel.className='thought';
    panel.innerHTML=`<h3 id="rutHeading">Du tänker …</h3>${isKnown("archive")?"":'<button class="thoughtChoice" data-thought="who">Undrar vem hon är?</button>'}<button class="thoughtChoice" data-thought="papers">Varför har hon två berättelser?</button><div class="rutActions"><button class="quiet" data-action="close">Inte nu</button></div>`;
    position();focusHeading(panel.querySelector('h3'));return true;
  }
  function speak(key){topic=key;line=0;setMode('speech');showLine();}
  function showLine(){
    const [name,text]=conversations[topic][line],last=line===conversations[topic].length-1;
    panel.className='speech';panel.innerHTML='<h3 id="rutHeading"></h3><p id="rutText" aria-live="polite" aria-atomic="true"></p><div class="rutActions"><button class="quiet" data-action="close">Avsluta</button><button data-action="next"></button></div>';
    panel.querySelector('h3').textContent=name;panel.querySelector('p').textContent=text;
    panel.querySelector('[data-action="next"]').textContent=last?(topic==='papers'?'Till handlingarna →':topic==='who'?'Till tankarna':'Klart'):'Fortsätt ↵';
    speechAt=performance.now();speechEnd=speechAt+Math.min(3600,700+text.length*24);update();position();panel.querySelector('[data-action="next"]').focus({preventScroll:true});
  }
  function advance(){if(mode!=='speech')return;if(++line<conversations[topic].length)showLine();else if(topic==='who'){remember('archive');thoughts();}else if(topic==='papers')openPapers();else close();}
  function openPapers(){
    if(!active)return;setMode('papers');tail.replaceChildren();delete docs.dataset.solved;
    docs.innerHTML='<h3 id="rutDocHeading">Samma leverans?</h3><p class="practiceNote">Två påhittade övningstexter — inte historiska källor.</p><div class="sources"><article><h4>Berättelse A</h4><p><span class="sequence">Två tunnor kom till magasinet</span> på morgonen. <span class="sequence">Sedan skrevs leveransen in i listan.</span></p></article><article><h4>Berättelse B</h4><p>På morgonen <span class="sequence">skrevs två tunnor in i listan.</span> <span class="sequence">Sedan kom tunnorna till magasinet.</span></p></article></div><p class="question">Vad skiljer berättelserna åt?</p><div id="rutAnswers"></div><p id="rutFeedback" role="status" aria-live="polite"></p><div class="docActions"><button class="quiet" data-action="close">Lägg tillbaka</button><button data-action="conclusion" hidden>Fråga Rut →</button></div>';
    const choices=[['number','Antalet tunnor'],['time','Tiden på dagen'],['order','Ordningen mellan leverans och anteckning']];
    for(let i=choices.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
    for(const [id,label] of choices){const b=document.createElement('button');b.dataset.answer=id;b.textContent=label;docs.querySelector('#rutAnswers').append(b);}
    if(solved)showResult();docs.scrollTop=0;focusHeading(docs.querySelector('h3'));
  }
  function answer(id){
    if(mode!=='papers'||solved)return;
    if(id==='order'){solved=true;showResult();return;}
    docs.querySelector('#rutFeedback').textContent=id==='number'?'Båda berättelserna säger två tunnor. Jämför vad som hände först.':'Båda berättelserna säger på morgonen. Jämför vad som hände först.';
  }
  function showResult(){
    docs.dataset.solved='true';docs.querySelector('#rutAnswers').hidden=true;
    docs.querySelector('.question').textContent='Skillnaden är händelsernas ordning.';
    docs.querySelector('#rutFeedback').textContent='I A kommer tunnorna först. I B skrivs listan först. Vi behöver kontrollera vad som hände först.';
    const b=docs.querySelector('[data-action="conclusion"]');b.hidden=false;focusHeading(docs.querySelector('.question'));
  }
  root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.thought)speak(b.dataset.thought);else if(b.dataset.answer)answer(b.dataset.answer);
    else if(b.dataset.action==='close')close();else if(b.dataset.action==='next')advance();
    else if(b.dataset.action==='conclusion'){setMode('speech');speak('conclusion');}
  });paperButton.addEventListener('click',openPapers);
  // No default thought/answer. Enter on a heading does nothing; Tab/arrows or
  // a pointer first choose a real button. Holding Enter never drains the dialogue.
  window.addEventListener('keydown',e=>{
    if(!active||!mode)return;
    if(!['Enter','Escape','Tab','ArrowDown','ArrowUp','ArrowLeft','ArrowRight',' '].includes(e.key))return;
    if(e.isComposing){e.stopImmediatePropagation();return;}
    const box=mode==='papers'?docs:panel;
    const buttons=[...box.querySelectorAll('button')].filter(b=>!b.hidden&&!b.closest('[hidden]')&&!b.disabled);
    if(e.key==='Tab'||e.key.startsWith('Arrow')){
      e.preventDefault();e.stopImmediatePropagation();const old=buttons.indexOf(document.activeElement);
      const backwards=e.key==='ArrowUp'||e.key==='ArrowLeft'||e.key==='Tab'&&e.shiftKey;
      const i=old<0?(backwards?buttons.length-1:0):(old+(backwards?-1:1)+buttons.length)%buttons.length;
      buttons[i]?.focus({preventScroll:true});return;
    }
    if(e.key==='Escape'||e.key==='Enter'){
      e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
      if(e.key==='Escape')close();else if(buttons.includes(document.activeElement))document.activeElement.click();
    }
  },true);
  for(const event of ['pointerdown','pointerup','click'])roomCanvas.addEventListener(event,e=>{if(active&&mode){e.preventDefault();e.stopImmediatePropagation();}},true);
  function poses(tall){return tall?[[122,996,.82],[460,894,.90]]:[[420,690,.83],[708,594,.94]];}
  function tableGeometry(){const tall=geo.w/geo.h<1.02;return tall?{x:236,y:789,w:427,h:190,bx:286,by:757,bw:227}:{x:539,y:490,w:332,h:161,bx:575,by:456,bw:184};}
  function worldRect(b){const {left,top,p}=geo;return{x:left+p.x+b.x*p.scale,y:top+p.y+b.y*p.scale,w:b.w*p.scale,h:b.h*p.scale};}
  function personRect(){
    if(!geo)return null;const [x,y,s]=geo.poses[1],t=tableGeometry();
    return worldRect({x:x-61*s,y:y-322*s,w:122*s,h:Math.max(95,t.y-44-(y-322*s))});
  }
  function position(){
    if(!active||!geo)return;
    const t=tableGeometry(),b=worldRect({x:t.bx-4,y:t.by-13,w:t.bw+12,h:48});
    Object.assign(paperButton.style,{left:b.x+'px',top:b.y+'px',width:Math.max(70,b.w)+'px',height:Math.max(44,b.h)+'px'});
    if(!['thoughts','speech'].includes(mode)){tail.replaceChildren();return;}
    const [pp,np]=geo.poses,p=geo.p;
    const heads=[pp,np].map(a=>({x:geo.left+p.x+a[0]*p.scale,y:geo.top+p.y+(a[1]-305*a[2])*p.scale,s:a[2]*p.scale}));
    const who=mode==='speech'?conversations[topic][line][0]:'Du',anchor=heads[who==='Rut'?1:0];
    let width=Math.min(348,geo.w-24),side=null;
    let x,y,baseX,baseY,tipX,tipY;
    const leftEdge=Math.min(...heads.map(a=>a.x-65*a.s));
    const rightEdge=Math.max(...heads.map(a=>a.x+65*a.s));
    if(geo.h<380&&geo.w>geo.h*1.4){
      const spaceLeft=leftEdge-geo.left-36,spaceRight=geo.left+geo.w-rightEdge-36;
      side=who==='Rut'?'right':'left';
      if((side==='right'?spaceRight:spaceLeft)<215)side=side==='right'?'left':'right';
      width=Math.min(348,side==='right'?spaceRight:spaceLeft);
      if(width<215){side=null;width=Math.min(348,geo.w-24);}
    }
    panel.style.width=width+'px';panel.style.maxHeight=(geo.h-20)+'px';panel.style.overflowY='auto';
    const height=panel.getBoundingClientRect().height;
    if(side){
      x=side==='right'?rightEdge+24:leftEdge-24-width;y=geo.top+10;
      baseX=side==='right'?x+1:x+width-1;
      tipX=anchor.x+(side==='right'?38:-38)*anchor.s;tipY=anchor.y+34*anchor.s;
      baseY=Math.max(y+25,Math.min(tipY,y+height-25));
    }else{
      x=Math.max(geo.left+12,Math.min(anchor.x-width*.48,geo.left+geo.w-width-12));
      y=Math.max(geo.top+12,Math.min(...heads.map(a=>a.y))-height-30);
      baseY=y+height-1;tipX=anchor.x+(who==='Rut'?38:-38)*anchor.s;tipY=anchor.y+34*anchor.s;
      baseX=Math.max(x+30,Math.min(tipX,x+width-30));
    }
    Object.assign(panel.style,{left:x+'px',top:y+'px'});
    const svg='http://www.w3.org/2000/svg';tail.replaceChildren();
    if(mode==='thoughts'){
      for(const u of [.17,.50,.78]){const c=document.createElementNS(svg,'circle');c.setAttribute('cx',baseX+(tipX-baseX)*u);c.setAttribute('cy',baseY+(tipY-baseY)*u);c.setAttribute('r',9-6*u);c.setAttribute('fill','#fbf1dc');c.setAttribute('stroke','#9c815c');tail.append(c);}
    }else{
      const path=document.createElementNS(svg,'path');path.setAttribute('d',(side?`M${baseX},${baseY-11} L${tipX},${tipY} L${baseX},${baseY+11}`:`M${baseX-11},${baseY} L${tipX},${tipY} L${baseX+11},${baseY}`));path.setAttribute('fill','#fbf1dc');path.setAttribute('stroke','#9c815c');path.setAttribute('stroke-width','1.5');tail.append(path);
    }
  }
  function restoreDesk(g,geometry,background){
    if(!active)return;geo=geometry;const t=tableGeometry();g.save();g.beginPath();
    g.moveTo(t.x-9,t.y);g.lineTo(t.x+18,t.y-30);g.lineTo(t.x+t.w-15,t.y-30);g.lineTo(t.x+t.w+8,t.y);g.closePath();
    g.rect(t.x,t.y,t.w,32);g.rect(t.x+18,t.y+27,23,t.h-25);g.rect(t.x+t.w-44,t.y+27,23,t.h-25);
    const x=t.bx,y=t.by,w=t.bw;g.moveTo(x,y+1);g.lineTo(x+w*.47,y+3.6);g.lineTo(x+w*.5,y+33);g.lineTo(x-6,y+30);g.closePath();
    g.moveTo(x+w*.47,y+3.6);g.lineTo(x+w,y);g.lineTo(x+w+7,y+30);g.lineTo(x+w*.5,y+33);g.closePath();g.clip();
    const p=geo.p;g.drawImage(background,0,0,background.width,background.height,-p.x/p.scale,-p.y/p.scale,geo.w/p.scale,geo.h/p.scale);g.restore();
  }
  function tick(now,geometry){
    const enabled=!!interior&&!interior.outdoor&&interior.kind==='archive'&&!voyage;
    if(!enabled){if(active){close(false);active=false;room=null;geo=null;root.hidden=true;paperButton.hidden=true;update();}return;}
    if(!active||interior!==room){if(mode)close(false);active=true;room=interior;root.hidden=false;paperButton.hidden=false;update();}
    geo=geometry;if(!geo)return;
    const signature=[geo.w,geo.h,geo.top,geo.left,revision].join(':');
    if(signature!==lastGeometry){position();lastGeometry=signature;}
  }
  return {tick,poses,restoreDesk,personRect,open:thoughts,
    get busy(){return active&&!!mode;},get active(){return active;},get revision(){return revision;},
    get speech(){return {at:speechAt,end:speechEnd};},get speaker(){return mode==='speech'?conversations[topic][line][0]:'';},
    get state(){return {active,mode,topic,line,solved};}};
})();
