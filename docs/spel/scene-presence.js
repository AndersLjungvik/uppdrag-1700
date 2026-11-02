/* Shared scene geometry: people occupy ground; paper speech leaves faces clear.
 * Presentation and live poses only. No question, resource or save writes. */
(function(){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(Math.max(a,b),v)),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
function bubbleLayout({box,anchor,bounds,faces=[],bodies=[],heightForWidth}){
 const originalWidth=Math.min(box.w,bounds.w),candidates=[];let w=originalWidth,natural=Math.min(box.h,bounds.h);
 function add(x,y,h){candidates.push({x:clamp(x,bounds.x,bounds.x+bounds.w-w),y:clamp(y,bounds.y,bounds.y+bounds.h-h),w,h,naturalHeight:natural});}
 function options(h){
  add(box.x,box.y,h);add(anchor.x-w/2,anchor.y-h-24,h);add(anchor.x+26,anchor.y-h/2,h);add(anchor.x-w-26,anchor.y-h/2,h);add(anchor.x-w/2,anchor.y+26,h);
  for(const x of [bounds.x,bounds.x+bounds.w-w])for(const y of [bounds.y,bounds.y+bounds.h-h])add(x,y,h);
  for(const f of faces){add(anchor.x-w/2,f.y-h-10,h);add(anchor.x-w/2,f.y+f.h+10,h);add(f.x-w-10,anchor.y-h/2,h);add(f.x+f.w+10,anchor.y-h/2,h);}
 }
 for(const width of [originalWidth,Math.min(originalWidth,Math.max(210,originalWidth*.85)),Math.min(originalWidth,Math.max(190,originalWidth*.7))]){w=width;natural=Math.min(heightForWidth?.(w)??box.h,bounds.h);options(natural);}
 const score=c=>{c.faceOverlap=faces.reduce((s,f)=>s+overlap(c,f),0);c.score=bodies.reduce((s,b)=>s+overlap(c,b),0)*.12+Math.hypot(clamp(anchor.x,c.x,c.x+c.w)-anchor.x,clamp(anchor.y,c.y,c.y+c.h)-anchor.y)*3+(c.naturalHeight-c.h)*7+(originalWidth-c.w)*.7;};
 candidates.forEach(score);
 if(!candidates.some(c=>c.faceOverlap<.1)){
  for(let h=natural-24;h>=Math.min(64,natural);h-=24){const at=candidates.length;options(h);candidates.slice(at).forEach(score);if(candidates.slice(at).some(c=>c.faceOverlap<.1))break;}
  if(natural>64){const at=candidates.length;options(64);candidates.slice(at).forEach(score);}
 }
 candidates.sort((a,b)=>a.faceOverlap-b.faceOverlap||a.score-b.score);return candidates[0];
}
function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(a.x+dx*t-p.x,a.y+dy*t-p.y);}
function bodyStep(from,to,bodies,radius=18){return bodies.every(b=>{
 const r=radius+b.radius,before=dist(from,b),after=dist(to,b);
 return before<r-.05?after>=before-.001:segmentDistance(b,from,to)>=r-.05;
});}
function walkStep(from,goal,length,bodies,staticStep=()=>true,memory=new Map()){
 const remaining=dist(from,goal);if(remaining<.01)return {...from};
 const step=Math.min(length,remaining),direction={x:(goal.x-from.x)/remaining,y:(goal.y-from.y)/remaining},angle=Math.atan2(direction.y,direction.x);
 const ahead=bodies.map(b=>{const x=b.x-from.x,y=b.y-from.y;return {b,along:x*direction.x+y*direction.y,cross:direction.x*y-direction.y*x};})
  .filter(o=>o.along>-.5&&o.along<Math.min(95,remaining+2)&&Math.abs(o.cross)<18+o.b.radius+4).sort((a,b)=>a.along-b.along)[0];
 const angles=[];
 if(ahead){
  const {b,cross}=ahead,d=dist(from,b),r=18+b.radius+3,id=b.id||b.x+':'+b.y;
  let remembered=memory.get(id);if(!remembered||remembered.dx*direction.x+remembered.dy*direction.y<-.3){remembered={side:Math.abs(cross)>2?-Math.sign(cross):-1,dx:direction.x,dy:direction.y};memory.set(id,remembered);}
  if(d>r){const tangent=Math.asin(clamp(r/d,0,1)),base=Math.atan2(b.y-from.y,b.x-from.x);angles.push(base+remembered.side*tangent,base-remembered.side*tangent);}
  else angles.push(Math.atan2(from.y-b.y,from.x-b.x));
 }
 angles.push(angle);for(const a of [.25,.55,.9,1.3,Math.PI/2])angles.push(angle-a,angle+a);
 for(const a of angles){const next={x:from.x+Math.cos(a)*step,y:from.y+Math.sin(a)*step};if(staticStep(from,next)&&bodyStep(from,next,bodies))return next;}
 return {...from};
}
let collecting=false,flushing=false,queue=[],baseMatrix=null,lastOrder=[],installed=false;
function enqueue(ctx,y,paint,id='person'){
 if(!collecting||flushing)return false;const m=ctx.getTransform(),alpha=ctx.globalAlpha;
 queue.push({y,id,paint(){ctx.save();try{ctx.setTransform(m);ctx.globalAlpha=alpha;paint();}finally{ctx.restore();}}});return true;
}
function begin(ctx){queue=[];collecting=true;baseMatrix=ctx.getTransform();}
function flush(){
 if(!collecting)return;queue.sort((a,b)=>a.y-b.y);lastOrder=queue.map(x=>({id:x.id,y:x.y}));flushing=true;
 try{for(const item of queue)item.paint();}finally{queue=[];flushing=false;collecting=false;}
}
function mapDepth(ctx,pos){const m=ctx.getTransform(),b=baseMatrix;if(!b)return pos.y;const x=m.a*pos.x+m.c*pos.y+m.e-b.e,y=m.b*pos.x+m.d*pos.y+m.f-b.f;return (-b.b*x+b.a*y)/(b.a*b.d-b.b*b.c||1);}
function currentWorld(){return typeof region!=='undefined'?region:null;}
function currentPlayer(){return typeof player!=='undefined'?player:null;}
function actors(r=currentWorld()){
 if(!r)return [];
 const civilians=window.UPPDRAG_WORLD_LIFE?.people?.(r)||[],city=window['UPPDRAG_CH'+window.__INTEGRATED_CHAPTER+'_CITY_LIFE'];
 const historical=city?.people?.(r)||[],events=window.UPPDRAG_EVENT_ENGINE?.people?.(r)||[];
 return [...civilians.map(p=>({...p,radius:18})),...historical.map(p=>({...p,radius:['farmers','soldiers','dalarna'].includes(p.id)?48:18})),...events].filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));
}
function colliders(r){return actors(r).filter(p=>p.solid!==false&&p.role!=='dog');}
function staticStep(r,a,b){const fn=window.UPPDRAG_WORLD_KEYBOARD?.buildingStep;return fn?fn(r,a,b):!!window.UPPDRAG_WORLD_KEYBOARD?.clearSegment?.(r,a,b,24);}
const movementMemory=new Map();let lastRegion=null;
function advance(r,from,goal,length,mode='route'){
 if(r!==lastRegion){movementMemory.clear();lastRegion=r;}
 const bodies=colliders(r);let point={x:from.x,y:from.y},remaining=length;
 while(remaining>.001){const step=Math.min(3,remaining,dist(point,goal));if(step<.001)break;const next=walkStep(point,goal,step,bodies,(a,b)=>staticStep(r,a,b),movementMemory);if(dist(next,point)<.001)break;point=next;remaining-=step;}
 const goalBlocked=mode==='route'&&bodies.some(b=>dist(goal,b)<18+b.radius&&dist(point,goal)<=18+b.radius+3);
 return {...point,arrived:dist(point,goal)<.1||goalBlocked};
}
function yieldCitizens(r,states,delta,p,inRoom,advanceTime=0){
 if(inRoom||!p||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){for(const state of states){state.presenceSafe=null;state.presenceYield=null;}return;}
 const speed=Math.max(0,Math.min(delta,80))/1000*52;
 for(const state of states){
  const pose=state.pose;if(!pose||state.frozen||state.escort)continue;
  const dx=pose.x-p.x,dy=pose.y-p.y,d=Math.hypot(dx,dy),nx=-Math.sin(pose.heading||0),ny=Math.cos(pose.heading||0);
  let side=state.presenceSide;if(d>110)side=null;if(!side&&d<82)side=Math.abs(dx*nx+dy*ny)>2?Math.sign(dx*nx+dy*ny):(String(pose.id).length%2?1:-1);state.presenceSide=side;
  const amount=side?clamp((82-d)/48,0,1)*24:0,targetX=nx*(side||0)*amount,targetY=ny*(side||0)*amount;
  const old=state.presenceYield||{x:0,y:0},change=Math.hypot(targetX-old.x,targetY-old.y),ratio=change?Math.min(1,speed/change):1;
  const offset={x:old.x+(targetX-old.x)*ratio,y:old.y+(targetY-old.y)*ratio};
  const candidate={x:pose.x+offset.x,y:pose.y+offset.y},prior=state.presenceSafe;
  if(staticStep(r,pose,candidate)){pose.x=candidate.x;pose.y=candidate.y;state.presenceYield=offset;}
  if(prior&&dist(prior,p)>=36&&segmentDistance(p,prior,pose)<36){pose.x=prior.x;pose.y=prior.y;pose.moving=false;state.time-=advanceTime;}
  state.presenceSafe={x:pose.x,y:pose.y};
 }
}
const cityStates=new Map();
function cityPose(p,r,now,locked=false){
 const player=currentPlayer();if(!player||!r)return p;
 const key=r.id+'/'+p.id,old=cityStates.get(key),reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 if(locked||reduced||(typeof interior!=='undefined'&&interior)){cityStates.set(key,{pose:{...p},raw:{...p},at:now,memory:new Map()});return p;}
 if(old&&now-old.at<12)return {...p,...old.pose};
 const dt=old?Math.max(.001,Math.min(.08,(now-old.at)/1000)):.016,state=old||{pose:{...p},raw:{...p},at:now,memory:new Map()};
 const nx=-Math.sin(p.heading||0),ny=Math.cos(p.heading||0),dx=p.x-player.x,dy=p.y-player.y,d=Math.hypot(dx,dy);
 if(d>110)state.side=null;
 if(!state.side&&d<85)state.side=Math.abs(dx*nx+dy*ny)>2?Math.sign(dx*nx+dy*ny):(p.id.length%2?1:-1);
 const amount=state.side?clamp((85-d)/60,0,1)*42:0;
 let goal={x:p.x+nx*(state.side||0)*amount,y:p.y+ny*(state.side||0)*amount};
 if(!staticStep(r,p,goal))goal={x:p.x,y:p.y};
 const natural=dist(p,state.raw)/dt,speed=Math.max(32,Math.min(115,natural+40)),distance=Math.min(dist(state.pose,goal),speed*dt);
 const next=walkStep(state.pose,goal,distance,[{...player,id:'player',radius:['farmers','soldiers','dalarna'].includes(p.id)?48:18}],(a,b)=>staticStep(r,a,b),state.memory);
 const travelled=dist(state.pose,next),heading=travelled>.1?Math.atan2(next.y-state.pose.y,next.x-state.pose.x):p.heading;
 state.pose={x:next.x,y:next.y,heading,moving:travelled>.05};state.raw={x:p.x,y:p.y};state.at=now;cityStates.set(key,state);return {...p,...state.pose};
}
function sceneGeometry(){
 const sr=stage.getBoundingClientRect();
 if(typeof interior!=='undefined'&&interior){
  const g=window.UPPDRAG_MEETINGS?.geometryForRoom?.();if(!g)return null;
  const poses=[...(g.poses||[]),...(g.visitorPose?[g.visitorPose]:[])];
  const heads=poses.map(p=>({x:g.left+g.p.x+p[0]*g.p.scale,y:g.top+g.p.y+(p[1]-305*p[2])*g.p.scale,s:p[2]*g.p.scale}));
  return {bounds:{x:g.left+8,y:g.top+8,w:g.w-16,h:g.h-16},heads,faces:heads.map(a=>({x:a.x-48*a.s-7,y:a.y-26*a.s-7,w:96*a.s+14,h:87*a.s+14})),bodies:heads.map(a=>({x:a.x-65*a.s-7,y:a.y-26*a.s-7,w:130*a.s+14,h:330*a.s+14}))};
 }
 if(typeof layout==='undefined'||typeof camera==='undefined')return null;
 const all=[{...currentPlayer(),id:'player',radius:20},...actors()],s=layout.scale;
 const heads=all.filter(p=>Number.isFinite(p.x)).map(p=>({x:layout.w/2+(p.x-camera.x)*s,y:layout.h/2+(p.y-camera.y)*s,s:1,r:(p.radius+7)*s+5})).filter(p=>p.x+p.r>=0&&p.y+p.r>=0&&p.x-p.r<=layout.w&&p.y-p.r<=layout.h);
 const faces=heads.map(a=>({x:a.x-a.r,y:a.y-a.r,w:a.r*2,h:a.r*2}));
 return {bounds:{x:8,y:8,w:sr.width-16,h:sr.height-16},heads,faces,bodies:faces};
}
const bubbleIDs={adventureTail:'adventureDialog',adventureCalloutTail:'adventureCallout',meetingTail:'meetingDialogue',livingTail:'livingBubble',ch3StreetTail:'ch3StreetDialogue'};
function speech(target,{box,tip,round}){
 if(box.presenceSafe)return null;
 const bubble=target.__presenceBubble||document.getElementById(bubbleIDs[target.id]);if(!bubble||bubble.hidden||!bubble.getClientRects().length)return null;
 const geo=sceneGeometry();if(!geo||!geo.heads.length)return null;
 const anchor=geo.heads.slice().sort((a,b)=>dist(a,tip)-dist(b,tip))[0];
 const replies=document.getElementById('adventureReplies');if(replies&&!replies.hidden&&replies.getClientRects().length){const y=replies.getBoundingClientRect().top-stage.getBoundingClientRect().top-10;geo.bounds.h=Math.max(50,Math.min(geo.bounds.h,y-geo.bounds.y));}
 // Measure each utterance with its own paper inset. A compact previous line
 // must not leave the next speaker's name against the curved paper edge.
 let copy=bubble.querySelector(':scope > .presence-speech-copy');
 if(!copy){copy=document.createElement('div');copy.className='presence-speech-copy';copy.append(...bubble.childNodes);bubble.append(copy);}
 const scrollTop=copy.scrollTop;
 Object.assign(copy.style,{maxHeight:'none',overflowY:'auto',scrollbarWidth:'thin'});
 Object.assign(bubble.style,{width:box.w+'px',maxHeight:'none',minHeight:'0px',boxSizing:'border-box',overflow:'hidden'});
 bubble.style.setProperty('padding','14px 26px','important');
 const measured={...box,h:bubble.getBoundingClientRect().height};
 const placed=bubbleLayout({box:measured,anchor,bounds:geo.bounds,faces:geo.faces,bodies:geo.bodies,heightForWidth(w){bubble.style.width=w+'px';return bubble.getBoundingClientRect().height;}});
 Object.assign(bubble.style,{left:placed.x+'px',top:placed.y+'px',width:placed.w+'px',maxHeight:placed.h+'px'});
 // Keep the scroll viewport inside the paper, including its curved corners.
 const css=getComputedStyle(bubble),inset=['paddingTop','paddingBottom','borderTopWidth','borderBottomWidth'].reduce((n,k)=>n+(parseFloat(css[k])||0),0);
 copy.style.maxHeight=Math.max(1,placed.h-inset)+'px';copy.scrollTop=scrollTop;
 placed.h=bubble.getBoundingClientRect().height;placed.presenceSafe=true;
 const edge={x:clamp(anchor.x,placed.x+8,placed.x+placed.w-8),y:clamp(anchor.y,placed.y+8,placed.y+placed.h-8)},d=dist(edge,anchor),reach=Math.min(25,Math.max(0,d-12));
 const flap={x:edge.x+(anchor.x-edge.x)/(d||1)*reach,y:edge.y+(anchor.y-edge.y)/(d||1)*reach};
 const paperRound=Math.min(round??.62,.38);
 target.dataset.presenceFaces=String(Math.round(placed.faceOverlap));return {box:placed,tip:flap,round:paperRound};
}
function install(){
 if(installed)return;installed=true;const meetings=window.UPPDRAG_MEETINGS;if(!meetings)return;
 const original=meetings.drawMapPerson;
 meetings.drawMapPerson=function(ctx,pos,who,now){if(enqueue(ctx,mapDepth(ctx,pos),()=>original.call(this,ctx,pos,who,now),who.id||who.name||who.role||'person'))return;return original.apply(this,arguments);};
}
function source(name,text){
 const edit=(a,b)=>{if(text.split(a).length!==2)throw Error('Scennärvaro: ankaret matchar inte '+name+': '+a.slice(0,55));text=text.replace(a,b);};
 if(name==='paper-dialogues.js'){
  edit('  function drawSpeech(target,{box,tip,round=.62}={}){','  function drawSpeech(target,{box,tip,round=.62}={}){\n    const placed=window.UPPDRAG_SCENE_PRESENCE?.speech(target,{box,tip,round});if(placed){box=placed.box;tip=placed.tip;round=placed.round;}');
  edit("    const thoughts=mode==='thoughts',anchor=", "    tail.__presenceBubble=bubble;\n    const thoughts=mode==='thoughts',anchor=");
 }
 if(/^world-keyboard(?:-ch\d+)?\.js$/.test(name)){
  edit('    tick,clear,interact,walkablePoint,clearSegment,keyOf,claimAction,','    tick,clear,interact,walkablePoint,clearSegment,keyOf,claimAction,buildingStep:escapeStep,');
  edit('      const full={x:player.x+sx,y:player.y+sy};','      if(window.UPPDRAG_SCENE_PRESENCE){const next=UPPDRAG_SCENE_PRESENCE.advance(region,player,{x:player.x+sx*40,y:player.y+sy*40},Math.hypot(sx,sy),"manual");player.x=next.x;player.y=next.y;continue;}\n      const full={x:player.x+sx,y:player.y+sy};');
 }
 if(/^world-life(?:-ch[345])?\.js$/.test(name)){
  const population=text.includes('const activePopulation=population(region);')?'activePopulation':'population(region)';
  const hook='    window.UPPDRAG_SCENE_PRESENCE?.yieldCitizens(region,'+population+',delta,player,!!activeRoom,advance);';
  if(text.includes('    yieldFor(region,activePopulation,delta);'))edit('    yieldFor(region,activePopulation,delta);','    yieldFor(region,activePopulation,delta);\n'+hook);
  else edit('    }\n  }\n\n  function freeze(id) {','    }\n'+hook+'\n  }\n\n  function freeze(id) {');
 }
 if(/chapter[34]-street-life\.js$/.test(name)){
  edit('function position(actor,now=performance.now()){','function nativePosition(actor,now=performance.now()){');
  edit('function people(region){',"function position(actor,now=performance.now()){const p=nativePosition(actor,now);return window.UPPDRAG_SCENE_PRESENCE?.cityPose(p,REGIONS[actor.region],now,active?.id===actor.id||teaser?.id===actor.id||pendingHold?.id===actor.id)||p;}\nfunction people(region){");
  edit('function drawGroup(ctx,a,now){','function drawGroup(ctx,a,now){\n if(window.UPPDRAG_SCENE_PRESENCE?.enqueue(ctx,a.y,()=>drawGroup(ctx,a,now),a.id))return;');
 }
 if(/^meeting-ch[1-5]-pilot\.js$/.test(name))edit('  function drawMapPlayer(g,pos,route,now){','  function drawMapPlayer(g,pos,route,now){\n    if(window.UPPDRAG_SCENE_PRESENCE?.enqueue(g,pos.y,()=>drawMapPlayer(g,pos,route,now),"player"))return;');
 if(['world-street-pilot.js','world-classic-pilot.js'].includes(name)){
  edit('ctx.drawImage(layer(region),0,0);','ctx.drawImage(layer(region),0,0);window.UPPDRAG_SCENE_PRESENCE?.begin(ctx);');
  if(name==='world-street-pilot.js')edit('ctx.globalAlpha=.77;','ctx.globalAlpha=1;');
  edit('window.UPPDRAG_EVENT_ENGINE?.drawCover(ctx,region);','');
  edit('if(sailing){','window.UPPDRAG_SCENE_PRESENCE?.flush();window.UPPDRAG_EVENT_ENGINE?.drawCover(ctx,region);if(sailing){');
  const old='if(d<=step){player.x=n.x;player.y=n.y;path.shift()}else{player.x+=dx/d*step;player.y+=dy/d*step}';
  edit(old,'if(window.UPPDRAG_SCENE_PRESENCE){const next=UPPDRAG_SCENE_PRESENCE.advance(region,player,n,Math.min(step,d));player.x=next.x;player.y=next.y;if(next.arrived)path.shift()}else{'+old+'}');
 }
 return text;
}
window.UPPDRAG_SCENE_PRESENCE={source,install,bubbleLayout,walkStep,bodyStep,advance,yieldCitizens,cityPose,enqueue,begin,flush,speech,actors,sceneGeometry,get lastOrder(){return lastOrder.slice();},version:'1.0.0'};
})();
