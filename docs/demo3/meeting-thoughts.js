/* Demo 3.9 pilot adapter: retain three meetings, delegate the archive to thoughts.
 * Character silhouettes reused from docs/world/render.mjs (puppet/overhead).
 * A separate transparent layer preserves every approved background pixel.
 * Uses the existing animation loop; no iframe, parallel loop or network service.
 */
'use strict';
(() => {
  const pilot=window.UPPDRAG_ARCHIVE_PILOT;
  let pilotRevision=-1;
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
  document.head.append(styles);
  const layer=document.createElement('canvas');layer.id='meetingLayer';layer.setAttribute('aria-hidden','true');
  const person=document.createElement('button');person.id='meetingPerson';person.type='button';person.hidden=true;
  const nameLabel=document.createElement('span');person.append(nameLabel);
  const panel=document.createElement('section');panel.id='meetingDialogue';panel.hidden=true;
  panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
  panel.setAttribute('aria-labelledby','meetingSpeaker');panel.setAttribute('aria-describedby','meetingLine');
  panel.innerHTML='<h3 id="meetingSpeaker"></h3><p id="meetingLine" aria-live="polite" aria-atomic="true"></p><div class="meetingActions"><button id="meetingClose" type="button">Avsluta samtalet</button><button id="meetingNext" type="button">Fortsätt ↵</button></div>';
  roomView.append(layer,person,panel);
  const next=panel.querySelector('#meetingNext'),close=panel.querySelector('#meetingClose');
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
function poly(points,color,shadow=true){ctx.save();if(shadow){ctx.shadowColor='#30281c28';ctx.shadowOffsetX=1;ctx.shadowOffsetY=2;ctx.shadowBlur=1}ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.shadowColor='transparent';ctx.clip();ctx.globalAlpha=.35;ctx.fillStyle=texture;ctx.fillRect(-1500,-1500,3000,3000);ctx.restore()}
function cut(x,y,w,h,c){poly([[x+1,y+2],[x+w*.3,y],[x+w*.65,y+1],[x+w-1,y],[x+w,y+h*.43],[x+w-2,y+h],[x+w*.6,y+h-1],[x+w*.3,y+h],[x,y+h-2],[x+1,y+h*.55]],c)}
function oval(x,y,rx,ry,c){ctx.save();ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();ctx.clip();ctx.globalAlpha=.3;ctx.fillStyle=texture;ctx.fillRect(x-rx,y-ry,rx*2,ry*2);ctx.restore()}
function overhead(x,y,color,angle=0,walk=false,t=0,woman=false){ctx.save();ctx.translate(x,y);ctx.rotate(angle);const gait=walk&&!reduced?Math.sin(t/95)*4:0;cut(-9,10+gait,7,15,'#403b34');cut(3,10-gait,7,15,'#403b34');poly([[-13,-8],[12,-8],[15,12],[8,18],[-11,15]],color);if(woman)poly([[-12,2],[14,2],[18,21],[-16,21]],color);cut(-17,-3,5,15+(walk?gait*.5:0),'#c19a70');cut(14,-3,5,15-(walk?gait*.5:0),'#c19a70');oval(0,-12,10,11,woman?'#d8c8a7':'#574334');if(woman)oval(0,-13,8,7,'#dcd1b6');ctx.restore()}
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
      map(x,y,heading,moving,t){reduced=motion.matches;overhead(x,y,CAST.player.color,heading,moving,t,false);}
    };
    renderers.set(ctx,renderer);return renderer;
  }
  // Coordinates use each frozen room's existing projection. Furniture is not moved.
  const PLACEMENT={
    cafe:{wide:[[295,674,.84],[1060,633,.94]],tall:[[114,971,.80],[378,710,.90]]},
    print:{wide:[[283,685,.82],[1190,668,.94]],tall:[[122,995,.82],[251,710,.91]]},
    archive:{wide:[[420,690,.83],[1042,682,.94]],tall:[[122,996,.82],[239,710,.90]]}
  };
  function current(){
    if(!interior)return null;
    const quay=interior.outdoor&&interior.regionId==='main';
    return {key:quay?'quay':interior.kind,cast:quay?CAST.quay:(!interior.outdoor?CAST[interior.kind]:null)};
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
      poses=(c.key==='archive'&&pilot?pilot.poses(tall):PLACEMENT[c.key]?.[tall?'tall':'wide'])||(tall?[[122,996,.82]]:[[283,680,.82]]);
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
    if(c.key==='archive'&&pilot){speechAt=pilot.speech.at;speechEnd=pilot.speech.end>now?pilot.speech.end:0;}
    const a=puppets(g),speaker=c.key==='archive'&&pilot?pilot.speaker:(dialogue?dialogue.cast.lines[dialogue.index][0]:'');
    // Render farther people first, keeping feet anchored in the same floor plane.
    const drawings=[{pos:poses[0],who:CAST.player,right:true}];
    if(c.cast&&poses[1])drawings.push({pos:poses[1],who:c.cast,right:false});
    drawings.sort((a,b)=>a.pos[1]-b.pos[1]);
    for(const item of drawings){const [x,y,s]=item.pos;a.side(x,y,s,item.who,item.right,now,speaker===item.who.name);if(c.key==='archive'&&pilot&&item.who!==CAST.player)pilot.restoreDesk(g,geometry,roomCanvas);}
    g.restore();
    person.hidden=!c.cast||!!dialogue||(c.key==='archive'&&!!pilot?.busy);
    if(c.cast){
      const [x,y,s]=poses[1],unit=p.scale*s;
      const width=Math.max(44,122*unit),height=Math.max(44,333*unit+26);
      Object.assign(person.style,{left:(left+p.x+x*p.scale-width/2)+'px',top:(top+p.y+y*p.scale-331*unit)+'px',width:width+'px',height:height+'px'});
      if(c.key==='archive'&&pilot){const b=pilot.personRect();if(b)Object.assign(person.style,{left:b.x+'px',top:b.y+'px',width:Math.max(44,b.w)+'px',height:Math.max(44,b.h)+'px'});}
      person.setAttribute('aria-label','Prata med '+c.cast.name);person.title='Prata med '+c.cast.name;
      nameLabel.textContent=c.cast.name;
    }
    lastPaint=now;
  }
  function closeTalk(restore=true){
    if(!dialogue)return false;
    dialogue=null;speechEnd=0;panel.hidden=true;roomFooter.inert=footerInert;
    delete document.body.dataset.conversation;
    drawPeople(performance.now());
    if(restore&&!person.hidden)person.focus({preventScroll:true});
    return true;
  }
  function showLine(){
    if(!dialogue)return;
    const [speaker,text]=dialogue.cast.lines[dialogue.index];
    panel.querySelector('#meetingSpeaker').textContent=speaker;
    panel.querySelector('#meetingLine').textContent=text;
    next.textContent=dialogue.index===dialogue.cast.lines.length-1?'Klart ↵':'Fortsätt ↵';
    speechAt=performance.now();speechEnd=speechAt+Math.min(3600,700+text.length*24);
    document.body.dataset.conversation=dialogue.cast.name;
    drawPeople(speechAt);next.focus({preventScroll:true});
  }
  function startTalk(){
    const c=current();if(!c?.cast||dialogue||voyage)return false;
    if(c.key==='archive'&&pilot)return pilot.open();
    dialogue={room:interior,cast:c.cast,index:0};footerInert=roomFooter.inert;roomFooter.inert=true;
    panel.hidden=false;showLine();return true;
  }
  function advance(){
    if(!dialogue)return;
    if(++dialogue.index>=dialogue.cast.lines.length)closeTalk();else showLine();
  }
  person.addEventListener('click',startTalk);next.addEventListener('click',advance);close.addEventListener('click',()=>closeTalk());
  // Capture before the original room exit shortcuts. One press = one line, not
  // an accidental second click or an exit. IME composition and key repeat ignored.
  window.addEventListener('keydown',e=>{
    if(!dialogue)return;
    if(['Enter','Escape','Tab',' '].includes(e.key)){
      if(e.isComposing){e.stopImmediatePropagation();return;}
      if(e.key==='Tab'){
        e.preventDefault();e.stopImmediatePropagation();
        (document.activeElement===next?close:next).focus();return;
      }
      if(e.key==='Enter'||e.key==='Escape'){
        e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
        if(e.key==='Escape'||document.activeElement===close)closeTalk();else advance();
      }
    }
  },true);
  for(const name of ['pointerdown','pointerup','click'])roomCanvas.addEventListener(name,e=>{
    if(dialogue){e.preventDefault();e.stopImmediatePropagation();}
  },true);
  function tick(now){
    if(pilot){pilot.tick(now,interior&&!voyage?measure():null);if(pilotRevision!==pilot.revision){pilotRevision=pilot.revision;lastPaint=-Infinity;}}
    const travelling=!!voyage;
    if(interior!==activeRoom||travelling!==wasTravelling){
      closeTalk(false);activeRoom=interior;wasTravelling=travelling;lastPaint=-Infinity;
      if(!interior||travelling){layer.hidden=true;person.hidden=true;geometry=null;return;}
      drawPeople(now);
      if(!person.hidden)person.focus({preventScroll:true});
    }
    if(!interior||travelling)return;
    const animating=(dialogue||pilot?.speaker)&&!motion.matches&&!document.hidden&&now<speechEnd;
    if(lastPaint===-Infinity||animating&&now-lastPaint>45||!animating&&speechEnd&&now>=speechEnd){
      if(!animating)speechEnd=0;drawPeople(now);
    }
  }
  new ResizeObserver(()=>{lastPaint=-Infinity;if(interior&&!voyage)drawPeople(performance.now());}).observe(roomCanvas);
  motion.addEventListener('change',()=>{lastPaint=-Infinity;});
  let direction=0;
  function drawMapPlayer(g,pos,route,now){
    if(route.length){const goal=route[0],dx=goal.x-pos.x,dy=goal.y-pos.y;if(Math.hypot(dx,dy)>1)direction=Math.atan2(dy,dx)+Math.PI/2;}
    puppets(g).map(pos.x,pos.y,direction,route.length>0,now);
  }
  window.UPPDRAG_MEETINGS={tick,drawMapPlayer,get state(){return {room:current()?.key||null,npc:current()?.cast?.name||null,talking:!!dialogue,line:dialogue?.index??null};}};
  document.documentElement.dataset.meetings='ready';tick(performance.now());
})();
