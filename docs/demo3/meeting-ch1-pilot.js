/* Demo 3.18: clean spoken paper; the accepted top-down people keep their art.
 * Large room portraits retain their existing silhouette and paper material.
 * A separate transparent layer preserves every approved background pixel.
 * Uses the existing animation loop; no iframe, parallel loop or network service.
 */
'use strict';
(() => {
  const pilot=window.UPPDRAG_ARCHIVE_PILOT;
  const places=window.UPPDRAG_PLACE_THOUGHTS;
  const controller=key=>{const story=window.UPPDRAG_STORY_WORK,living=window.UPPDRAG_LIVING_DIALOGUES;return story?.busy&&story.roomKey===key?story:living?.busy&&living.roomKey===key?living:key==='archive'?pilot:places;};
  let pilotRevision=-1,placeRevision=-1,livingRevision=-1,storyRevision=-1,storyStateRevision=-1;
  const CAST={
    player:{name:'Du',color:'#466b70'},
    cafe:{name:'Maja',color:'#69785e',woman:true,lines:[
      ['Du','Hej! Är det här kaffehuset?'],
      ['Maja','Välkommen! Jag heter Maja. Här träffas vi för att läsa och prata om det som händer i staden.'],
      ['Du','Vad sitter på anslagstavlan?'],
      ['Maja','Där samlar vi sådant som är värt att läsa och prata om.']
    ]},
    print:{name:'Brita',color:'#6e6b5b',woman:true,apron:true,lines:[
      ['Du','Hej! Är det du som sköter tryckpressen?'],
      ['Brita','Ja, jag heter Brita. Här sätter jag ihop bokstäver och trycker texter på papper.'],
      ['Du','Är det bokstäverna som ligger på bordet?'],
      ['Brita','Precis. Bokstäverna kallas typer. Med dem bygger vi texten som ska tryckas.']
    ]},
    palace:{name:'Amira',color:'#846956',woman:true,lines:[['Du','Hej!'],['Amira','Välkommen till slottet.']]},
    riksdag:{name:'Elin',color:'#6b7461',woman:true,lines:[['Du','Hej!'],['Elin','Välkommen till riksdagssalen.']]},
    archive:{name:'Rut',color:'#67695a',woman:true,lines:[
      ['Du','Hej! Jag letar efter Rut.'],
      ['Rut','Då har du kommit rätt. Jag är läromästaren Rut. Här undersöker vi vad handlingarna faktiskt berättar.'],
      ['Du','Kan jag få hjälp att förstå dem?'],
      ['Rut','Ja. Vi läser noga och skiljer på vad vi vet och vad vi behöver undersöka.']
    ]},
    quay:{name:'Jo',color:'#a17f49',lines:[
      ['Du','Hej! Är det här man går ombord?'],
      ['Jo','Ja. Jag är Jo, hamnskrivaren. Jag håller ordning på fartygens last och handlingar.'],
      ['Du','Kan jag resa härifrån?'],
      ['Jo','Ja. Välj resmål vid fartyget när du är redo att segla.']
    ]}
  };
  const styles=document.createElement('style');
  styles.textContent=`
    #meetingLayer{position:absolute;pointer-events:none;z-index:3;width:0;height:0}
    #meetingPerson{position:absolute;z-index:4;padding:0;border:0;border-radius:6px;background:transparent;color:#352d24;cursor:pointer;touch-action:manipulation;min-width:44px;min-height:44px}
    #meetingPerson span{position:absolute;bottom:0;left:50%;transform:translateX(-50%);padding:3px 8px;border:1px solid #9e8965;background:#f1e4c9;font:600 14px/1.15 Georgia,serif;border-radius:4px;white-space:nowrap}
    #meetingPerson:hover span{background:#fff4dc}
    #meetingPerson:focus-visible{outline:3px solid #355e68;outline-offset:3px}
    #meetingPerson:focus:not(:focus-visible){outline:none}
    #meetingDialogue{position:absolute;z-index:8;left:50%;bottom:12px;transform:translateX(-50%);width:min(660px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;background:#f7ecd5;border:2px solid #a58d63;box-shadow:3px 5px 0 #41342230;border-radius:7px;padding:16px 20px;color:#352d24}
    #meetingTail{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:7}
    #meetingSpeaker{font:700 19px/1.25 Georgia,serif;margin:0 0 8px}
    #meetingLine{font:18px/1.48 system-ui,sans-serif;margin:0 0 14px;white-space:normal}
    #meetingDialogue .meetingActions{display:flex;justify-content:space-between;gap:12px;align-items:center}
    #meetingDialogue button{min-height:44px;padding:9px 15px;font:16px/1.25 system-ui,sans-serif;border:1px solid #9e865e;border-radius:5px;color:#352d24;cursor:pointer}
    #meetingNext{background:#d6be91;order:2}
    #meetingClose{background:transparent;order:1}
    #meetingDialogue button:focus-visible{outline:3px solid #355e68;outline-offset:2px}
    @media(max-width:640px){#meetingDialogue{padding:12px 14px;bottom:8px;width:calc(100% - 16px)}#meetingLine{font-size:16px;line-height:1.42;margin-bottom:10px}#meetingSpeaker{font-size:17px}#meetingDialogue button{font-size:14px;padding:8px 10px}#meetingPerson span{font-size:13px}}
    @media(max-height:460px) and (min-width:641px){#meetingDialogue{left:auto;right:10px;bottom:8px;transform:none;width:420px;padding:10px 14px}#meetingLine{font-size:15px;line-height:1.35;margin-bottom:7px}#meetingSpeaker{font-size:16px;margin-bottom:5px}#meetingDialogue button{font-size:13px;min-height:40px;padding:7px 10px}}
  `;
  styles.textContent+=`
  #meetingDialogue .ch1MeetingChoices{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
  #meetingDialogue .ch1MeetingChoices button:first-child{background:#e4d1aa}
  #meetingDialogue .ch1MeetingChoices button:last-child{background:transparent}
  `;
  document.head.append(styles);
  const layer=document.createElement('canvas');layer.id='meetingLayer';layer.setAttribute('aria-hidden','true');
  const person=document.createElement('button');person.id='meetingPerson';person.type='button';person.hidden=true;
  const panel=document.createElement('section');panel.id='meetingDialogue';panel.hidden=true;
  panel.setAttribute('role','button');panel.tabIndex=0;panel.className='speech';panel.dataset.mode='speech';
  panel.setAttribute('aria-keyshortcuts','Enter Space Escape');
  panel.innerHTML='<p id="meetingLine" aria-live="polite" aria-atomic="true"></p>';
  const dialogueTail=document.createElementNS('http://www.w3.org/2000/svg','svg');dialogueTail.id='meetingTail';dialogueTail.setAttribute('aria-hidden','true');
  roomView.append(layer,person,dialogueTail,panel);
  let activeRoom=null,dialogue=null,geometry=null,lastPaint=-Infinity,wasTravelling=false;
  let speechAt=0,speechEnd=0,footerInert=false;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const renderers=new WeakMap();
  function puppets(ctx){
    if(renderers.has(ctx))return renderers.get(ctx);
    let reduced=false,speechStarted=0,speechUntil=0,busy=false;
    const grain=document.createElement('canvas');grain.width=grain.height=80;
    const gx=grain.getContext('2d');let seed=19;
    for(let n=0;n<850;n++){seed=(seed*1664525+1013904223)>>>0;const x=seed%80;seed=(seed*1664525+1013904223)>>>0;const y=seed%80;gx.fillStyle=n%2?'#fff7e9':'#372c21';gx.globalAlpha=.16;gx.fillRect(x,y,1+(n%3),1)}
    const texture=ctx.createPattern(grain,'repeat');
function poly(points,color,shadow=true){ctx.save();if(shadow){ctx.shadowColor='#30281c28';ctx.shadowOffsetX=1;ctx.shadowOffsetY=2;ctx.shadowBlur=1}ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();const fibres=window.UPPDRAG_PAPER_FIBRES,kind=fibres?.kindFor(color)||'piece';ctx.fillStyle=fibres?.material(ctx,color,kind)||color;ctx.fill();ctx.shadowColor='transparent';if(fibres?.loaded){const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);fibres.finish(ctx,{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)},{kind});}else{ctx.clip();ctx.globalAlpha=.35;ctx.fillStyle=texture;ctx.fillRect(-1500,-1500,3000,3000);}ctx.restore()}
function cut(x,y,w,h,c){poly([[x+1,y+2],[x+w*.3,y],[x+w*.65,y+1],[x+w-1,y],[x+w,y+h*.43],[x+w-2,y+h],[x+w*.6,y+h-1],[x+w*.3,y+h],[x,y+h-2],[x+1,y+h*.55]],c)}
function oval(x,y,rx,ry,c){ctx.save();ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);const fibres=window.UPPDRAG_PAPER_FIBRES,kind=fibres?.kindFor(c)||'piece';ctx.fillStyle=fibres?.material(ctx,c,kind)||c;ctx.fill();if(fibres?.loaded){fibres.finish(ctx,{x:x-rx,y:y-ry,w:rx*2,h:ry*2},{kind});}else{ctx.clip();ctx.globalAlpha=.3;ctx.fillStyle=texture;ctx.fillRect(x-rx,y-ry,rx*2,ry*2);}ctx.restore()}
function mapPuppet(x,y,who,heading=0,walk=false,t=0){
  // Local +X is forward. Head, shoulders and small foot tips are seen from above.
  // The body centre stays fixed; only the separate paper feet and hands step.
  ctx.save();ctx.translate(x,y);ctx.rotate(heading);
  const color=who.color||CAST.player.color,woman=!!who.woman;
  const gait=walk&&!reduced?Math.sin(t/190)*1.2:0;
  for(const [side,phase] of [[-1,1],[1,-1]]){
    const step=gait*phase,cy=side*5.7;
    poly([[-18+step,cy-2.1],[-9,cy-2.4],[-9,cy+2.4],[-18+step,cy+2.1]],'#bca87b',false);
    poly([[-22+step,cy-2.1],[-16+step,cy-2.5],[-13+step,cy-1.4],[-12.5+step,cy+1.4],[-16+step,cy+2.5],[-22+step,cy+2]],'#413b31',false);
    const hand=-gait*phase*.35,sy=side*13.1;
    poly([[-10+hand,sy-2.5],[1+hand,sy-2.6],[3+hand,sy+2.3],[-10+hand,sy+2.6]],color,false);
    oval(3.1+hand,sy,2.5,2.6,'#c9a57c');
  }
  poly([[-15,-9],[-6,-11.7],[3,-11.2],[7,-7],[8,1],[4,10.8],[-6,11.7],[-15,9]],color,false);
  if(woman)poly([[-5,-9.4],[-5,9.4],[-17.7,12.2],[-19,-11.5]],color,false);
  if(who.apron)poly([[-3,-7],[3,-6],[3,6],[-3,7],[-14,8],[-14,-7]],'#d9caa9',false);
  // A small collar and the forward rim of skin show orientation without a face.
  poly([[3,-8.8],[8,-7.1],[11,0],[8,7.3],[3,8.8],[5,0]],'#e8ddc0',false);
  oval(8.2,0,8.7,7.7,'#cda77b');
  poly([[15,-2.7],[18.6,-1.1],[19.2,1],[15,2.7]],'#cda77b',false);
  oval(5.5,0,8.5,8.4,'#604a35');
  if(woman){
    poly([[-2,-6.8],[2,-9],[8,-8.5],[12.8,-5.4],[14,0],[12.8,5.7],[7,8.7],[1,8.2],[-2.8,4],[-3,0]],'#ded1b4',false);
    poly([[0,-5.7],[5,-7.2],[10,-5.1],[11.5,0],[10,5],[4.5,6.9],[-.5,4.8],[-1.5,0]],'#e5d9bd',false);
  }else{
    poly([[-3,-7],[5,-10.2],[14,-7.5],[16.5,-1],[15,6.8],[5.8,10.2],[-3,7.3],[0,0]],'#5d4d3a',false);
    poly([[1,-5.5],[8,-6.7],[12,-3.6],[12.8,2.6],[7.1,6.8],[.7,5.2],[-.4,0]],'#756044',false);
  }
  ctx.restore();
}
function limb(x,y,w,h,rotation,color){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);cut(-w/2,0,w,h,color);ctx.restore()}
function puppet(x,foot,color,faceRight,t,talking=false,walk=false,woman=false,apron=false){ctx.save();ctx.translate(x,foot);if(!faceRight)ctx.scale(-1,1);const speaking=!reduced&&talking&&t>=speechStarted&&t<speechUntil&&!busy&&!document.hidden,elapsed=t-speechStarted;const sway=speaking?Math.sin(elapsed/260)*.006:0;ctx.rotate(sway);const stride=walk&&!reduced?Math.sin(t/100)*.15:0;
 limb(-19,-105,20,92,stride,'#bca87b');limb(20,-105,20,92,-stride,'#bca87b');cut(-36,-19+Math.sin(stride)*10,40,17,'#413b31');cut(6,-19-Math.sin(stride)*10,43,17,'#413b31');poly([[-47,-226],[34,-225],[48,-113],[28,-94],[-43,-102]],color);poly([[-18,-228],[17,-228],[5,-189],[-7,-187]],'#e8ddc0');limb(-45,-218,23,97,.07+stride*.25,color);oval(-49,-116,12,14,'#c9a57c');
 const gesture=speaking?-.18+Math.sin(elapsed/300)*.045:.05;ctx.save();ctx.translate(36,-212);ctx.rotate(gesture);cut(-11,0,22,78,color);oval(0,84,12,14,'#c9a57c');ctx.restore();
 cut(-8,-251,22,27,'#c8a377');poly([[-29,-291],[12,-300],[36,-285],[38,-267],[47,-260],[36,-255],[29,-230],[-14,-235],[-28,-253]],'#cda77b');poly([[-32,-288],[-17,-307],[15,-309],[35,-292],[12,-287],[-13,-271],[-27,-253]],woman?'#d7c9ac':'#604a35');oval(28,-272,2,2,'#342c24');const opening=speaking?Math.max(0,Math.sin(elapsed/70))*(1+Math.sin(elapsed/340)**2*1.8):0;oval(35,-249,3.5,.65+opening,'#594132');if(!woman){oval(-1,-301,47,9,color);poly([[-30,-303],[-15,-328],[15,-327],[28,-301]],color)}if(woman)poly([[-36,-116],[44,-113],[58,-18],[-57,-18]],color);if(apron){poly([[-23,-210],[24,-209],[31,-34],[-30,-34]],'#d9caa9');for(const [a,b]of [[8,-110],[-12,-75],[17,-155]])oval(a,b,3,4,'#615445')}ctx.restore()}
    const renderer={
      side(x,y,s,who,right,t,speaking){
        reduced=motion.matches;speechStarted=speechAt;speechUntil=speechEnd;
        ctx.save();ctx.translate(x,y);ctx.scale(s,s);
        ctx.save();ctx.fillStyle='#42351f26';ctx.beginPath();ctx.ellipse(0,2,57,8,0,0,Math.PI*2);ctx.fill();ctx.restore();
        puppet(0,0,who.color,right,t,speaking,false,!!who.woman,!!who.apron);ctx.restore();
      },
      map(x,y,heading,moving,t,who=CAST.player){reduced=motion.matches;mapPuppet(x,y,who,heading,moving,t);}
    };
    renderers.set(ctx,renderer);return renderer;
  }
  // Coordinates use each frozen room's existing projection. Furniture is not moved.
  const PLACEMENT={
    cafe:{wide:[[295,674,.84],[1060,633,.94]],tall:[[114,971,.80],[378,710,.90]]},
    print:{wide:[[283,685,.82],[1190,668,.94]],tall:[[122,995,.82],[251,710,.91]]},
    archive:{wide:[[420,690,.83],[1042,682,.94]],tall:[[122,996,.82],[239,710,.90]]},
    palace:{wide:[[285,686,.81],[1047,688,.88]],tall:[[113,972,.80],[379,714,.88]]},
    riksdag:{wide:[[298,682,.82],[1040,669,.89]],tall:[[120,978,.80],[387,710,.87]]}
  };
  function current(){
    if(!interior)return null;
    const quay=interior.outdoor&&interior.regionId==='main';
    const storyPlace=window.UPPDRAG_STORY_WORLD?.currentPlace?.(),key=quay?'quay':window.UPPDRAG_STORY_WORLD?.roomKey?.(storyPlace)||interior.kind,definition=window.UPPDRAG_STORY_STATE?.PLACES?.[storyPlace];
    const established=quay?CAST.quay:(!interior.outdoor?CAST[interior.kind]:null);
    return {key,storyPlace,cast:established||(definition&&storyPlace!=='town'?{...definition,name:definition.npc}:null)};
  }
  function measure(){
    const r=roomCanvas.getBoundingClientRect(),parent=roomView.getBoundingClientRect();
    if(!r.width||!r.height)return null;
    let p,poses;
    const c=current();
    if(interior.outdoor){
      p=UPPDRAG_HARBOUR_ART.project(r.width,r.height);
      poses=[[1025,706,.41],[1174,680,.45]];
    }else{
      const tall=r.width/r.height<1.02,D=tall?{w:720,h:1040}:{w:1280,h:720};
      const scale=Math.min(r.width/D.w,r.height/D.h);
      p={scale,x:(r.width-D.w*scale)/2,y:(r.height-D.h*scale)/2};
      poses=(c.key==='archive'&&pilot?pilot.poses(tall):PLACEMENT[c.key]?.[tall?'tall':'wide'])||(tall?[[122,996,.82],...(c.cast?[[378,710,.90]]:[])]:[[283,680,.82],...(c.cast?[[1060,633,.94]]:[])]);
    }
    return {w:r.width,h:r.height,left:r.left-parent.left,top:r.top-parent.top,p,poses,c};
  }
  function drawPeople(now){
    if(!interior||voyage){layer.hidden=true;person.hidden=true;return;}
    geometry=measure();if(!geometry)return;
    const {w,h,left,top,p,poses,c}=geometry,d=Math.min(devicePixelRatio||1,2);
    layer.hidden=false;Object.assign(layer.style,{left:left+'px',top:top+'px',width:w+'px',height:h+'px'});
    const W=Math.round(w*d),H=Math.round(h*d);
    if(layer.width!==W)layer.width=W;if(layer.height!==H)layer.height=H;
    const g=layer.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);
    g.save();g.translate(p.x,p.y);g.scale(p.scale,p.scale);
    const talk=controller(c.key);
    if(talk?.active){speechAt=talk.speech.at;speechEnd=talk.speech.end>now?talk.speech.end:0;}
    const a=puppets(g),speaker=talk?.active?talk.speaker:(dialogue?dialogue.cast.lines[dialogue.index][0]:'');
    // Render farther people first, keeping feet anchored in the same floor plane.
    const drawings=[{pos:poses[0],who:CAST.player,right:true}];
    if(c.cast&&poses[1])drawings.push({pos:poses[1],who:c.cast,right:false});
    drawings.sort((a,b)=>a.pos[1]-b.pos[1]);
    for(const item of drawings){const [x,y,s]=item.pos;a.side(x,y,s,item.who,item.right,now,speaker===item.who.name);if(c.key==='archive'&&pilot&&item.who!==CAST.player)pilot.restoreDesk(g,geometry,roomCanvas);}
    g.restore();
    person.hidden=!c.cast||!!dialogue||!!controller(c.key)?.busy;
    if(c.cast){
      const [x,y,s]=poses[1],unit=p.scale*s;
      const width=Math.max(44,122*unit),height=Math.max(44,333*unit+26);
      Object.assign(person.style,{left:(left+p.x+x*p.scale-width/2)+'px',top:(top+p.y+y*p.scale-331*unit)+'px',width:width+'px',height:height+'px'});
      if(c.key==='archive'&&pilot){const b=pilot.personRect();if(b)Object.assign(person.style,{left:b.x+'px',top:b.y+'px',width:Math.max(44,b.w)+'px',height:Math.max(44,b.h)+'px'});}
      person.setAttribute('aria-label','Prata med '+c.cast.name);
    }
    positionDialogue();
    lastPaint=now;
  }
  function positionDialogue(){
    if(!dialogue||!geometry)return;
    const geo=geometry,p=geo.p;
    const heads=geo.poses.slice(0,2).map(a=>({x:geo.left+p.x+a[0]*p.scale,y:geo.top+p.y+(a[1]-305*a[2])*p.scale,s:a[2]*p.scale}));
    const speakerIndex=dialogue.cast.lines[dialogue.index][0]==='Du'?0:1;
    window.UPPDRAG_PAPER_DIALOGUES?.placeRoomBubble?.({bubble:panel,tail:dialogueTail,mode:'speech',geometry:geo,heads,speakerIndex});
  }
  function closeTalk(restore=true){
    if(!dialogue)return false;
    dialogue=null;speechEnd=0;panel.hidden=true;dialogueTail.replaceChildren();roomFooter.inert=footerInert;
    delete document.body.dataset.conversation;
    drawPeople(performance.now());
    if(restore&&!person.hidden)person.focus({preventScroll:true});
    return true;
  }
  function showLine(){
    if(!dialogue)return;
    const [speaker,text]=dialogue.cast.lines[dialogue.index];
    panel.querySelector('#meetingLine').textContent=text;
    panel.querySelector('.ch1MeetingChoices')?.remove();
    if(dialogue.special&&dialogue.index===dialogue.cast.lines.length-1){
      const container=document.createElement('div');container.className='ch1MeetingChoices';
      for(const [action,label] of [['accept',dialogue.special==='thanks'?'Fortsätt äventyret':dialogue.special==='giver'?'Jag hjälper till':'Jag hjälper dig att minnas'],['decline','Inte nu']]){
        const b=document.createElement('button');b.type='button';b.dataset.ch1Choice=action;b.textContent=label;container.append(b);
      }
      panel.append(container);panel.setAttribute('role','group');
    }else panel.setAttribute('role','button');
    panel.setAttribute('aria-label',speaker+': '+text);
    speechAt=performance.now();speechEnd=speechAt+Math.min(3600,700+text.length*24);
    document.body.dataset.conversation=dialogue.cast.name;
    drawPeople(speechAt);panel.focus({preventScroll:true});
  }
  function startTalk(){
    const c=current();if(!c?.cast||dialogue||voyage)return false;
    const pilot=window.UPPDRAG_CH1_PILOT;
    if(pilot?.wantsMajaMeeting?.(c.key)){
      dialogue={room:interior,cast:{...CAST.cafe,lines:[
        ['Du','Hej!'],['Maja',pilot.majaProblem()]
      ]},index:0,special:'giver'};
      footerInert=roomFooter.inert;roomFooter.inert=true;panel.hidden=false;showLine();return true;
    }
    if(pilot?.wantsMemoryThanks?.(c.key))return memoryThanks();
    if(pilot?.wantsMemoryMeeting?.(c.key)){
      dialogue={room:interior,cast:{...c.cast,lines:[
        ['Du','Hej!'],[c.cast.name,pilot.memoryProblem()]
      ]},index:0,special:'memory'};
      footerInert=roomFooter.inert;roomFooter.inert=true;panel.hidden=false;showLine();return true;
    }
    if(!CAST[c.key]&&c.storyPlace){
      const story=window.UPPDRAG_STORY_STATE,guidance=!story?.taskAt?.(c.storyPlace)&&!!story?.guidanceAt?.(c.storyPlace);
      return window.UPPDRAG_STORY_WORK?.open(c.storyPlace,{thoughtsFirst:true,guidance})||false;
    }
    const talk=controller(c.key);if(talk?.active)return talk.open();
    dialogue={room:interior,cast:c.cast,index:0};footerInert=roomFooter.inert;roomFooter.inert=true;
    panel.hidden=false;showLine();return true;
  }
  function advance(){
    if(!dialogue)return false;
    if(dialogue.special&&dialogue.index===dialogue.cast.lines.length-1){
      panel.querySelector('[data-ch1-choice="accept"]')?.focus({preventScroll:true});return true;
    }
    if(++dialogue.index>=dialogue.cast.lines.length)closeTalk();else showLine();
    return true;
  }
  function memoryThanks(){
    const pilot=window.UPPDRAG_CH1_PILOT,c=current();
    if(!interior||!c?.cast||!pilot?.wantsMemoryThanks?.(c.key))return false;
    closeTalk(false);
    dialogue={room:interior,cast:{...c.cast,lines:[[c.cast.name,pilot.memoryThanks()]]},index:0,special:'thanks'};
    footerInert=roomFooter.inert;roomFooter.inert=true;panel.hidden=false;showLine();return true;
  }
  person.addEventListener('click',startTalk);
  panel.addEventListener('click',e=>{
    if(!dialogue)return;
    const button=e.target.closest('[data-ch1-choice]');
    if(button&&dialogue.special){
      e.preventDefault();e.stopPropagation();
      const type=dialogue.special,answer=button.dataset.ch1Choice;
      closeTalk(false);
      if(answer==='accept'){
        if(type==='thanks')window.UPPDRAG_CH1_PILOT?.finishMemory();
        else if(type==='giver')window.UPPDRAG_CH1_PILOT?.acceptMajaMission();
        else window.UPPDRAG_CH1_PILOT?.enterMemory();
      }
      return;
    }
    e.preventDefault();e.stopPropagation();advance();
  });
  // Capture before the original room exit shortcuts. One press = one line, not
  // an accidental second click or an exit. IME composition and key repeat ignored.
  window.addEventListener('keydown',e=>{
    if(!dialogue)return;
    const keyboard=window.UPPDRAG_WORLD_KEYBOARD,key=keyboard?.keyOf?.(e)||e.key;
    if(['Enter','Escape','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(key)){
      if(e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey&&key!=='Tab'||e.target.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"]'))return;
      if(key==='Tab'||key.startsWith('Arrow')){
        if(dialogue.special){
          const buttons=[...panel.querySelectorAll('[data-ch1-choice]')];
          if(buttons.length){
            e.preventDefault();e.stopImmediatePropagation();
            const at=buttons.indexOf(document.activeElement),reverse=key==='ArrowUp'||key==='ArrowLeft'||key==='Tab'&&e.shiftKey;
            const next=at<0?(reverse?buttons.length-1:0):(at+(reverse?-1:1)+buttons.length)%buttons.length;
            buttons[next].focus({preventScroll:true});return;
          }
        }
        e.preventDefault();e.stopImmediatePropagation();
        panel.focus({preventScroll:true});return;
      }
      if(dialogue.special&&e.target.closest?.('[data-ch1-choice]')&&(key==='Enter'||key===' '))return;
      if(key==='Enter'||key==='Escape'||key===' '){
        if(keyboard?.claimAction){if(!keyboard.claimAction(e))return;}
        else{e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;}
        if(key==='Escape')closeTalk();else advance();
      }
    }
  },true);
  for(const name of ['pointerdown','pointerup','click'])roomCanvas.addEventListener(name,e=>{
    if(dialogue){e.preventDefault();e.stopImmediatePropagation();if(name==='click')closeTalk();}
  },true);
  function tick(now){
    if(pilot){pilot.tick(now,interior&&!voyage?measure():null);if(pilotRevision!==pilot.revision){pilotRevision=pilot.revision;lastPaint=-Infinity;}}
    if(places){places.tick(now,interior&&!voyage?measure():null);if(placeRevision!==places.revision){placeRevision=places.revision;lastPaint=-Infinity;}}
    const living=window.UPPDRAG_LIVING_DIALOGUES;if(livingRevision!==living?.revision){livingRevision=living?.revision;lastPaint=-Infinity;}
    const story=window.UPPDRAG_STORY_WORK;if(story){story.tick(now,interior&&!voyage?measure():null);if(storyRevision!==story.revision){storyRevision=story.revision;lastPaint=-Infinity;}}
    const sr=window.UPPDRAG_STORY_STATE?.revision;if(storyStateRevision!==sr){storyStateRevision=sr;lastPaint=-Infinity;}
    const travelling=!!voyage;
    if(interior!==activeRoom||travelling!==wasTravelling){
      closeTalk(false);activeRoom=interior;wasTravelling=travelling;lastPaint=-Infinity;
      if(!interior||travelling){layer.hidden=true;person.hidden=true;geometry=null;return;}
      drawPeople(now);
      if(!person.hidden)person.focus({preventScroll:true});
    }
    if(!interior||travelling)return;
    const animating=(dialogue||pilot?.speaker||places?.speaker||living?.speaker||story?.speaker)&&!motion.matches&&!document.hidden&&now<speechEnd;
    if(lastPaint===-Infinity||animating&&now-lastPaint>45||!animating&&speechEnd&&now>=speechEnd){
      if(!animating)speechEnd=0;drawPeople(now);
    }
  }
  new ResizeObserver(()=>{lastPaint=-Infinity;if(interior&&!voyage)drawPeople(performance.now());}).observe(roomCanvas);
  motion.addEventListener('change',()=>{lastPaint=-Infinity;});
  window.addEventListener('uppdrag-paper-fibres-ready',()=>{lastPaint=-Infinity;if(interior&&!voyage)drawPeople(performance.now());});
  let mapHeading=-Math.PI/2,lastMapPlayer=null;
  function drawMapPlayer(g,pos,route,now){
    const goal=route.find(n=>Math.hypot(n.x-pos.x,n.y-pos.y)>.5);
    const living=window.UPPDRAG_LIVING_DIALOGUES;
    const partner=!goal&&living?.active&&!living.roomKey&&typeof region!=='undefined'
      ?window.UPPDRAG_WORLD_LIFE?.people(region).find(p=>p.id===living.personId):null;
    const target=goal||partner;
    if(target&&Math.hypot(target.x-pos.x,target.y-pos.y)>.5){
      mapHeading=Math.atan2(target.y-pos.y,target.x-pos.x);
    }else if(lastMapPlayer){
      const dx=pos.x-lastMapPlayer.x,dy=pos.y-lastMapPlayer.y,d=Math.hypot(dx,dy);
      if(d>.01&&d<80)mapHeading=Math.atan2(dy,dx);
    }
    lastMapPlayer={x:pos.x,y:pos.y};
    puppets(g).map(pos.x,pos.y,mapHeading,!!goal,now,CAST.player);
  }
  window.UPPDRAG_MEETINGS={tick,drawMapPlayer,advance,start:startTalk,memoryThanks,close:closeTalk,geometryForRoom:measure,drawMapPerson(g,pos,who,now){puppets(g).map(pos.x,pos.y,Number.isFinite(pos.heading)?pos.heading:0,!!pos.moving,pos.animationTime??now,who);},get state(){return {room:current()?.key||null,npc:current()?.cast?.name||null,talking:!!dialogue,line:dialogue?.index??null};}};
  document.documentElement.dataset.meetings='ready';tick(performance.now());
})();

