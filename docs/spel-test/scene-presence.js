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
  if(d>r){const tangent=Math.asin(clamp(r/d,0,1)),base=Math.atan2(b.y-from.y,b.x-from.x),preferred=base+remembered.side*tangent,other=base-remembered.side*tangent;if(Math.cos(preferred-angle)<-.05&&Math.cos(other-angle)>.05)angles.push(other,preferred);else angles.push(preferred,other);}
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
let walkingIntent=null;
function advance(r,from,goal,length,mode='route'){
 if(r!==lastRegion){movementMemory.clear();lastRegion=r;}
 if(length>0&&dist(from,goal)>.1)walkingIntent={region:r.id,x:from.x,y:from.y,dx:(goal.x-from.x)/dist(from,goal),dy:(goal.y-from.y)/dist(from,goal),at:performance.now()};
 const bodies=colliders(r);let point={x:from.x,y:from.y},remaining=length;
 while(remaining>.001){const step=Math.min(3,remaining,dist(point,goal));if(step<.001)break;const next=walkStep(point,goal,step,bodies,(a,b)=>staticStep(r,a,b),movementMemory);if(dist(next,point)<.001)break;point=next;remaining-=step;}
 const goalBlocked=mode==='route'&&bodies.some(b=>dist(goal,b)<18+b.radius&&dist(point,goal)<=18+b.radius+3);
 return {...point,arrived:dist(point,goal)<.1||goalBlocked};
}
function yieldCitizens(r,states,delta,p,inRoom,advanceTime=0,now=performance.now()){
 if(inRoom||!p){for(const state of states)cityStates.delete(r.id+'/world:'+state.person.id);return;}
 for(const state of states){
  if(!state.pose)continue;
  if(state.escort){cityStates.delete(r.id+'/world:'+state.person.id);continue;}
  Object.assign(state.pose,cityPose(state.pose,r,now,state.frozen,'world:'));
 }
}
const cityStates=new Map();
const turn=(from,to,maximum)=>from+clamp(Math.atan2(Math.sin(to-from),Math.cos(to-from)),-maximum,maximum);
function clearGround(r,a,b){const steps=Math.max(1,Math.ceil(dist(a,b)/6));let last=a;for(let i=1;i<=steps;i++){const next={x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps};if(!staticStep(r,last,next))return false;last=next;}return true;}
// Pedestrians yield to an actual walking request. A single-file alley needs
// a retreat to its opening before a sidestep, rather than two blocked bodies.
function yieldGoal(r,person,player,state,intent){
 const radius=['farmers','soldiers','dalarna'].includes(person.id)?48:18,clearance=18+radius+9;
 let plan=state.yield;
 if(plan){
  const along=(person.x-player.x)*plan.dx+(person.y-player.y)*plan.dy;
  if(along<-clearance||dist(person,player)>190){state.yield=null;plan=null;}
 }
 if(!plan&&intent){
  const dx=person.x-player.x,dy=person.y-player.y,along=dx*intent.dx+dy*intent.dy,cross=dx*-intent.dy+dy*intent.dx;
  if(along>0&&along<112&&Math.abs(cross)<clearance){plan=state.yield={...intent,side:Math.abs(cross)>3?Math.sign(cross):(person.id.length%2?1:-1)};}
 }
 if(!plan)return null;
 if(plan.park)return {...plan.park,waiting:true};
 const nx=-plan.dy,ny=plan.dx,along=(person.x-plan.x)*plan.dx+(person.y-plan.y)*plan.dy;
 for(const forward of [0,22,44])for(const side of [plan.side,-plan.side]){
  const goal={x:plan.x+plan.dx*(along+forward)+nx*side*clearance,y:plan.y+plan.dy*(along+forward)+ny*side*clearance};
  if(clearGround(r,person,goal)&&bodyStep(person,goal,[{...player,radius}])){plan.park=goal;return {...goal,waiting:true};}
 }
 if(!intent)return {...person,waiting:true};
 return {x:person.x+plan.dx*80,y:person.y+plan.dy*80,waiting:true};
}
function cityPose(p,r,now,locked=false,namespace=''){
 const player=currentPlayer();if(!player||!r)return p;
 const key=r.id+'/'+namespace+p.id,old=cityStates.get(key),reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const dt=old?Math.max(0,Math.min(.08,(now-old.at)/1000)):.016;
 if(locked||(typeof interior!=='undefined'&&interior)){
  const priorHeading=Number.isFinite(old?.pose.heading)?old.pose.heading:Number.isFinite(p.heading)?p.heading:0;
  const heading=locked?turn(priorHeading,Math.atan2(player.y-p.y,player.x-p.x),reduced?Math.PI*2:dt*6):p.heading;
  const pose={...p,heading,facing:Math.cos(heading)<0?-1:1,moving:false,yielding:false};
  cityStates.set(key,{pose,raw:{...p},at:now,memory:new Map()});return pose;
 }
 if(old&&now-old.at<12)return {...p,...old.pose};
 const state=old||{pose:{...p},raw:{...p},at:now,memory:new Map()};
 const nx=-Math.sin(p.heading||0),ny=Math.cos(p.heading||0),dx=p.x-player.x,dy=p.y-player.y,d=Math.hypot(dx,dy);
 if(d>110)state.side=null;
 if(!state.side&&d<85)state.side=Math.abs(dx*nx+dy*ny)>2?Math.sign(dx*nx+dy*ny):(p.id.length%2?1:-1);
 const amount=state.side&&!reduced?clamp((85-d)/60,0,1)*42:0;
 let goal={x:p.x+nx*(state.side||0)*amount,y:p.y+ny*(state.side||0)*amount};
 if(!staticStep(r,p,goal))goal={x:p.x,y:p.y};
 const intent=walkingIntent?.region===r.id&&performance.now()-walkingIntent.at<300?walkingIntent:null;
 const polite=yieldGoal(r,{...p,...state.pose},player,state,intent);if(polite)goal=polite;
 const natural=dist(p,state.raw)/dt,speed=polite?110:Math.max(32,Math.min(115,natural+40)),distance=Math.min(dist(state.pose,goal),speed*dt);
 const next=walkStep(state.pose,goal,distance,[{...player,id:'player',radius:['farmers','soldiers','dalarna'].includes(p.id)?48:18}],(a,b)=>staticStep(r,a,b),state.memory);
 const travelled=dist(state.pose,next),heading=polite?turn(state.pose.heading??p.heading??0,Math.atan2(player.y-next.y,player.x-next.x),reduced?Math.PI*2:dt*6):travelled>.1?Math.atan2(next.y-state.pose.y,next.x-state.pose.x):p.heading;
 state.pose={x:next.x,y:next.y,heading,moving:travelled>.05,yielding:!!polite};state.raw={x:p.x,y:p.y};state.at=now;cityStates.set(key,state);return {...p,...state.pose};
}
function partner(r=currentWorld()){
 if(!r||(typeof interior!=='undefined'&&interior)||(typeof sailing!=='undefined'&&sailing)||(typeof voyage!=='undefined'&&voyage))return null;
 const city=window['UPPDRAG_CH'+window.__INTEGRATED_CHAPTER+'_CITY_LIFE'];
 const cityId=city?.actor||city?.teaser,cityPerson=cityId?city.find(r,cityId):null;
 if(cityPerson&&dist(currentPlayer(),cityPerson)<130)return {...cityPerson,engaged:!!city.actor};
 const event=window.UPPDRAG_EVENT_ENGINE?.conversation;if(event)return {...event,engaged:true};
 const living=window.UPPDRAG_LIVING_DIALOGUES;
 if(living?.active&&!living.roomKey){const p=window.UPPDRAG_WORLD_LIFE?.people(r).find(p=>p.id===living.personId);if(p)return {...p,engaged:true};}
 return null;
}
let playerView=null;
function playerPose(pos,route,heading,now){
 const attention=partner(),goal=route?.some(p=>dist(pos,p)>.5),previous=playerView;
 const moved=previous&&dist(pos,previous)>.01&&dist(pos,previous)<40;
 const dt=previous?Math.max(0,Math.min(.08,(now-previous.at)/1000)):.016;
 if(attention&&(attention.engaged||!goal))heading=turn(previous?.heading??heading,Math.atan2(attention.y-pos.y,attention.x-pos.x),window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?Math.PI*2:dt*7);
 else if(moved)heading=Math.atan2(pos.y-previous.y,pos.x-previous.x);
 playerView={x:pos.x,y:pos.y,heading,at:now,moving:!!goal&&!attention?.engaged};return playerView;
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
  if(text.includes('run:()=>city.open(conflict)'))edit('run:()=>city.open(conflict)','run:()=>requestStreetChat(conflict)');
  edit('    cancelPersonArrival();drag=null;follow=true;canvas.focus({preventScroll:true});',"    cancelPersonArrival();window['UPPDRAG_CH'+window.__INTEGRATED_CHAPTER+'_CITY_LIFE']?.releaseHold?.();if(typeof pendingStreetChat!=='undefined')pendingStreetChat=null;drag=null;follow=true;canvas.focus({preventScroll:true});");
 }
 if(/^world-life(?:-ch[345])?\.js$/.test(name)){
  const population=text.includes('const activePopulation=population(region);')?'activePopulation':'population(region)';
  const hook='    window.UPPDRAG_SCENE_PRESENCE?.yieldCitizens(region,'+population+',delta,player,!!activeRoom,advance,now);';
  if(text.includes('    yieldFor(region,activePopulation,delta);'))edit('    yieldFor(region,activePopulation,delta);','    yieldFor(region,activePopulation,delta);\n'+hook);
  else edit('    }\n  }\n\n  function freeze(id) {','    }\n'+hook+'\n  }\n\n  function freeze(id) {');
  edit('    state.frozen=true;updateWalker(state);','    state.presenceStopped=state.pose?{x:state.pose.x,y:state.pose.y}:null;state.frozen=true;updateWalker(state);');
  edit('    state.frozen=false;updateWalker(state);return true;','    state.frozen=false;state.presenceStopped=null;updateWalker(state);return true;');
  const poseEnd='      walkPhase:step.phase,lateralOffset:offset,roadDistance:Math.abs(offset)\n    };';
  edit(poseEnd,poseEnd+'\n    if(state.frozen&&state.presenceStopped){state.pose.x=state.presenceStopped.x;state.pose.y=state.presenceStopped.y;if(Number.isFinite(state.playerX)&&Number.isFinite(state.playerY))state.pose.heading=Math.atan2(state.playerY-state.pose.y,state.playerX-state.pose.x);state.pose.facing=Math.cos(state.pose.heading)<0?-1:1;}');
 }
 if(/chapter[34]-street-life\.js$/.test(name)){
  edit('function position(actor,now=performance.now()){','function nativePosition(actor,now=performance.now()){');
  edit('function people(region){',"function position(actor,now=performance.now()){const p=nativePosition(actor,now);return window.UPPDRAG_SCENE_PRESENCE?.cityPose(p,REGIONS[actor.region],now,active?.id===actor.id||teaser?.id===actor.id||pendingHold?.id===actor.id)||p;}\nfunction people(region){");
  edit('function drawGroup(ctx,a,now){','function drawGroup(ctx,a,now){\n if(window.UPPDRAG_SCENE_PRESENCE?.enqueue(ctx,a.y,()=>drawGroup(ctx,a,now),a.id))return;');
  edit('function updateNearby(region,player,now){\n if(!region||!player||active)return;','function updateNearby(region,player,now){\n if(!region||!player||active)return;\n if(window.UPPDRAG_SCENE_PRESENCE?.walking){stopTeaser(now);arrivalCandidate=null;hideBubble();return;}');
 }
 if(/^meeting-ch[1-5]-pilot\.js$/.test(name)){
  edit('  function drawMapPlayer(g,pos,route,now){','  function drawMapPlayer(g,pos,route,now){\n    if(window.UPPDRAG_SCENE_PRESENCE?.enqueue(g,pos.y,()=>drawMapPlayer(g,pos,route,now),"player"))return;');
  edit('    puppets(g).map(pos.x,pos.y,mapHeading,!!goal,now,CAST.player);','    const view=window.UPPDRAG_SCENE_PRESENCE?.playerPose(pos,route,mapHeading,now);if(view)mapHeading=view.heading;\n    puppets(g).map(pos.x,pos.y,mapHeading,view?view.moving:!!goal,now,CAST.player);');
 }
 if(['world-street-pilot.js','world-classic-pilot.js'].includes(name)){
  edit('cancelPersonArrival();pendingRoom=null;const next=routeAlongRoads(region.map.get(id));',"cancelPersonArrival();window['UPPDRAG_CH'+window.__INTEGRATED_CHAPTER+'_CITY_LIFE']?.releaseHold?.();if(typeof pendingStreetChat!=='undefined')pendingStreetChat=null;pendingRoom=null;const next=routeAlongRoads(region.map.get(id));");
  edit('ctx.drawImage(layer(region),0,0);','ctx.drawImage(layer(region),0,0);window.UPPDRAG_SCENE_PRESENCE?.begin(ctx);');
  if(name==='world-street-pilot.js')edit('ctx.globalAlpha=.77;','ctx.globalAlpha=1;');
  edit('window.UPPDRAG_EVENT_ENGINE?.drawCover(ctx,region);','');
  edit('if(sailing){','window.UPPDRAG_SCENE_PRESENCE?.flush();window.UPPDRAG_EVENT_ENGINE?.drawCover(ctx,region);if(sailing){');
  const old='if(d<=step){player.x=n.x;player.y=n.y;path.shift()}else{player.x+=dx/d*step;player.y+=dy/d*step}';
  edit(old,'if(window.UPPDRAG_SCENE_PRESENCE){const next=UPPDRAG_SCENE_PRESENCE.advance(region,player,n,Math.min(step,d));player.x=next.x;player.y=next.y;if(next.arrived)path.shift()}else{'+old+'}');
 }
 return text;
}
window.UPPDRAG_SCENE_PRESENCE={source,install,bubbleLayout,walkStep,bodyStep,advance,yieldCitizens,cityPose,yieldGoal,turn,partner,playerPose,enqueue,begin,flush,speech,actors,sceneGeometry,get walking(){return !!walkingIntent&&performance.now()-walkingIntent.at<300;},get lastOrder(){return lastOrder.slice();},get playerView(){return playerView?{...playerView}:null;},version:'1.1.0'};
})();
