/* Demo 3.16: paper walkers, spoken meetings and animal life on the existing map.
 * Coordinates, roads, buildings and the game loop remain owned by the world.
 * tick updates poses once; drawing, buttons and hit testing read those same poses.
 * No DOM events, timers or additional animation loop are registered here.
 */
'use strict';
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const routeCache = new WeakMap();
  const populations = new WeakMap();
  const activeRooms = new WeakMap();
  const walkers = new Map();
  let elapsed = 0;
  let lastNow = null;

  // Each walk stays on a documented, existing road edge. Both graph endpoints
  // are safe meeting approaches; villageSouth/workSouth/fort/town are avoided.
  const WALKS = {
    maja:   {a:'west',    b:'cafe',     from:.64,to:.92,speed:16,phase:1300,pause:2600},
    brita:  {a:'cafe',    b:'print',    from:.64,to:.94,speed:18,phase:2400,pause:2200},
    rut:    {a:'archive', b:'operaJ',   from:.08,to:.44,speed:15,phase:1100,pause:2600},
    jo:     {a:'square',  b:'quayJ1',   from:.40,to:.83,speed:17,phase:1800,pause:2400},
    klara:  {a:'square',  b:'archive',  from:.12,to:.80,speed:22,phase:1300,pause:1700},
    otto:   {a:'print',   b:'square',   from:.15,to:.82,speed:25,phase:13000,pause:1300},
    linnea: {a:'castle',  b:'science',  from:.10,to:.82,speed:21,phase:5500,pause:1900},
    lovisa: {a:'scienceJ',b:'castle',   from:.35,to:.88,speed:23,phase:9900,pause:1500},
    noor:   {a:'barn',    b:'work',     from:.10,to:.83,speed:24,phase:15000,pause:1600},
    karin:  {a:'homes',   b:'village',  from:.16,to:.85,speed:19,phase:2600,pause:1800},
    liv:    {a:'operaJ',  b:'operaDoor',from:.18,to:.85,speed:21,phase:7900,pause:1600},
    amira:  {a:'square',  b:'up',       from:.20,to:.86,speed:22,phase:9500,pause:1400},
    ester:  {a:'square',  b:'b',        from:.16,to:.83,speed:20,phase:6500,pause:2000}
  };

  // Personal rhythms stay deterministic: no frame-by-frame randomness or sway
  // of the body. Small side paths, quiet looks and differing breaks do the work.
  const WALK_PROFILES = {
    maja:   {pace:.86,variation:.18,lane:-10,sway:2.3,curve:.3,every:1,stopAt:.62,stop:1800,rest:2900,look:.30,turn:850,side:1,cadence:.90},
    brita:  {pace:1.16,variation:.26,lane:10,sway:2.5,curve:2.1,every:3,stopAt:.48,stop:800,rest:1250,look:.15,turn:420,side:-1,cadence:1.16},
    rut:    {pace:.82,variation:.14,lane:8,sway:3,curve:1.2,every:1,stopAt:.44,stop:2700,rest:3350,look:.32,turn:1000,side:-1,cadence:.82},
    jo:     {pace:.92,variation:.18,lane:2.6,sway:.8,curve:.9,every:2,stopAt:.70,stop:1900,rest:2400,look:.26,turn:720,side:1,cadence:.91},
    klara:  {pace:.96,variation:.22,lane:-10,sway:3.5,curve:1.4,every:2,stopAt:.36,stop:1500,rest:2150,look:.28,turn:630,side:1,cadence:.98},
    otto:   {pace:1.18,variation:.31,lane:4,sway:3.2,curve:2.8,every:3,stopAt:.58,stop:850,rest:1050,look:.16,turn:400,side:-1,cadence:1.20},
    linnea: {pace:.86,variation:.20,lane:3,sway:.8,curve:.4,every:1,stopAt:.66,stop:2400,rest:2700,look:.38,turn:950,side:1,cadence:.90},
    lovisa: {pace:1.04,variation:.15,lane:-3,sway:1,curve:2.4,every:3,stopAt:.43,stop:1100,rest:1550,look:.20,turn:580,side:-1,cadence:1.05},
    noor:   {pace:1.02,variation:.30,lane:-9,sway:4,curve:.2,every:2,stopAt:.52,stop:1600,rest:2100,look:.26,turn:650,side:1,cadence:1.08},
    karin:  {pace:.88,variation:.23,lane:9,sway:3.6,curve:1.9,every:1,stopAt:.60,stop:2200,rest:3100,look:.31,turn:880,side:-1,cadence:.84},
    liv:    {pace:.96,variation:.18,lane:-1,sway:.75,curve:1.1,every:2,stopAt:.40,stop:1700,rest:2500,look:.26,turn:800,side:1,cadence:.94},
    amira:  {pace:1.10,variation:.27,lane:1.2,sway:.6,curve:2.6,every:3,stopAt:.68,stop:1050,rest:1700,look:.22,turn:500,side:-1,cadence:1.10},
    ester:  {pace:.84,variation:.20,lane:-7,sway:2.4,curve:.8,every:1,stopAt:.54,stop:2350,rest:3200,look:.34,turn:900,side:1,cadence:.86}
  };

  function insidePolygon(x,y,points) {
    let inside=false;
    for(let i=0,j=points.length-1;i<points.length;j=i++){
      const a=points[i],b=points[j];
      if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
    }
    return inside;
  }

  function water(region,x,y) {
    if(region.island)return !insidePolygon(x,y,region.island);
    const bridged=region.bridges?.some(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h);
    return !bridged&&region.water?.some(p=>insidePolygon(x,y,p));
  }

  function clearPoint(region,x,y,radius=26) {
    if(x<radius||x>region.w-radius||y<radius||y>region.h-radius)return false;
    if(region.buildings.some(b=>x>=b.x-radius&&x<=b.x+b.w+radius&&y>=b.y-radius&&y<=b.y+b.h+radius))return false;
    if(water(region,x,y))return false;
    for(let i=0;i<12;i++){
      const angle=i*Math.PI/6;
      if(water(region,x+Math.cos(angle)*radius,y+Math.sin(angle)*radius))return false;
    }
    return true;
  }

  function walkingEdge(region,walk) {
    if(!walk)return null;
    const a=region.map.get(walk.a),b=region.map.get(walk.b);
    if(!a||!b||!region.edges.some(edge=>edge.a===a.id&&edge.b===b.id||edge.a===b.id&&edge.b===a.id))return null;
    const length=Math.hypot(b.x-a.x,b.y-a.y);
    // Check the whole approach edge, not just where the NPC happens to start.
    const steps=Math.ceil(length/8);
    for(let i=0;i<=steps;i++){
      const t=i/steps;
      if(!clearPoint(region,a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t))return null;
    }
    return {...walk,a,b,length};
  }

  function outAndBack(time,duration,pause) {
    const cycle=((time%(2*(duration+pause)))+2*(duration+pause))%(2*(duration+pause));
    const back=cycle>=duration+pause;
    const leg=back?cycle-duration-pause:cycle;
    const fraction=Math.min(leg/duration,1);
    return {fraction:back?1-fraction:fraction,direction:back?-1:1,moving:leg<duration};
  }

  function safeLaneScale(region,edge,profile) {
    const road=region.edges.find(e=>e.a===edge.a.id&&e.b===edge.b.id||e.a===edge.b.id&&e.b===edge.a.id);
    const extent=Math.abs(profile.lane)+profile.sway;
    let scale=Math.min(1,Math.max(0,(road.w||66)/2-27)/(extent||1));
    const nx=-(edge.b.y-edge.a.y)/edge.length,ny=(edge.b.x-edge.a.x)/edge.length;
    const steps=Math.ceil(edge.length*(edge.to-edge.from)/4);
    // A single scale is chosen for the entire corridor. No per-frame clipping
    // can change a person's side abruptly near a wall or during a frozen talk.
    for(let attempt=0;attempt<7&&scale;attempt++){
      let safe=true;
      const low=Math.min(0,(profile.lane-profile.sway)*scale),high=Math.max(0,(profile.lane+profile.sway)*scale);
      const across=Math.max(1,Math.ceil((high-low)/2));
      for(let i=0;i<=steps&&safe;i++)for(let j=0;j<=across;j++){
        const t=edge.from+(edge.to-edge.from)*i/steps,offset=low+(high-low)*j/across;
        if(!clearPoint(region,edge.a.x+(edge.b.x-edge.a.x)*t+nx*offset,edge.a.y+(edge.b.y-edge.a.y)*t+ny*offset,26)){safe=false;break;}
      }
      if(safe)return scale;
      scale*=.5;
    }
    return 0;
  }

  function personalStep(state) {
    const edge=state.edge,p=state.profile;
    const duration=edge.length*(edge.to-edge.from)/(edge.speed*p.pace)*1000;
    const legs=p.every*2,cycle=legs*(duration+p.rest)+2*p.stop;
    let time=((state.time%cycle)+cycle)%cycle,index=0;
    for(;index<legs-1;index++){
      const length=duration+p.rest+(index%p.every===0?p.stop:0);
      if(time<length)break;time-=length;
    }
    const hold=index%p.every===0?p.stop:0,first=duration*p.stopAt;
    let raw,look=0,turn=0,phase='walking';
    if(hold&&time>=first&&time<first+hold){
      raw=p.stopAt;phase='looking';
      const f=(time-first)/hold;look=Math.sin(Math.PI*f)**2*Math.sin(2*Math.PI*f)*p.look;
    }else if(time>=duration+hold){
      raw=1;
      const waited=time-duration-hold,f=waited/p.rest;
      phase=waited>=p.rest-p.turn?'turning':'waiting';
      look=Math.sin(Math.PI*f)**2*Math.sin(2*Math.PI*f)*p.look*.65;
      const t=Math.max(0,Math.min(1,(waited-(p.rest-p.turn))/p.turn));
      turn=t*t*(3-2*t);
    }else raw=(time-(hold&&time>=first+hold?hold:0))/duration;
    const warped=raw-p.variation*Math.sin(2*Math.PI*raw)/(2*Math.PI),direction=index%2?-1:1;
    return {fraction:direction>0?warped:1-warped,direction,moving:phase==='walking',phase,look,turn};
  }

  // Escorting is purposeful movement, separate from each person's quiet patrol.
  // A cumulative trail preserves every turn the player actually took. The same
  // trail, read backwards, brings a cancelled companion to the unchanged patrol.
  function escortSegment(region,a,b) {
    const keyboard=window.UPPDRAG_WORLD_KEYBOARD;
    if(keyboard?.clearSegment)return keyboard.clearSegment(region,a,b,24);
    const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/3));
    for(let i=0;i<=steps;i++){
      const t=i/steps;
      if(!clearPoint(region,a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,24))return false;
    }
    return true;
  }

  function roadPosition(region,x,y) {
    const node=id=>typeof navigationPoint==='function'?navigationPoint(region,id):region.map.get(id);
    let nearest=null,best=Infinity;
    for(const edge of region.edges){
      const a=node(edge.a),b=node(edge.b);if(!a||!b)continue;
      const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;
      const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(length||1)));
      const d=Math.hypot(x-a.x-dx*t,y-a.y-dy*t);
      if(d<best){best=d;nearest={routeEdge:{a:edge.a,b:edge.b},routeT:t,
        meetingNode:t<=.5?edge.a:edge.b,roadDistance:d};}
    }
    return nearest;
  }

  function trailPoint(escort,distance) {
    const points=escort.trail;
    if(points.length===1||distance<=0)return {x:points[0].x,y:points[0].y};
    let lo=1,hi=points.length-1;
    while(lo<hi){const mid=(lo+hi)>>1;if(points[mid].s<distance)lo=mid+1;else hi=mid;}
    const a=points[lo-1],b=points[lo],t=Math.max(0,Math.min(1,(distance-a.s)/(b.s-a.s||1)));
    return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
  }

  function appendTrail(escort,point) {
    const points=escort.trail;
    // The player can start behind Jo and then pass him on the way to the quay.
    // Retrace an unwalked approach instead of making Jo walk back to that old
    // player position. Never remove anything the companion has already walked.
    while(points.length>1&&points[points.length-1].s>escort.cursor+.01){
      const last=points[points.length-1],before=points[points.length-2];
      const ax=last.x-before.x,ay=last.y-before.y,length=Math.hypot(ax,ay);
      const dx=point.x-last.x,dy=point.y-last.y;
      if(!length||ax*dx+ay*dy>=0||Math.abs(ax*dy-ay*dx)>1e-7*Math.max(1,length*Math.hypot(dx,dy)))break;
      const nextS=before.s+((point.x-before.x)*ax+(point.y-before.y)*ay)/length;
      if(nextS>=Math.max(before.s,escort.cursor)-.001){
        if(nextS<=before.s+.001)points.pop();
        else points[points.length-1]={x:point.x,y:point.y,s:Math.max(escort.cursor,nextS)};
        return;
      }
      if(before.s>=escort.cursor-.001){points.pop();continue;}
      const here=trailPoint(escort,escort.cursor);
      points[points.length-1]={...here,s:escort.cursor};break;
    }
    const last=points[points.length-1];
    const dx=point.x-last.x,dy=point.y-last.y,d=Math.hypot(dx,dy);
    if(d<.01)return;
    const next={x:point.x,y:point.y,s:last.s+d},before=points[points.length-2];
    // Merge only straight continuation, never a corner or a reversal.
    if(before&&last.s>escort.cursor+.01){
      const ax=last.x-before.x,ay=last.y-before.y;
      if(ax*dx+ay*dy>0&&Math.abs(ax*dy-ay*dx)<1e-7*Math.max(1,Math.hypot(ax,ay)*d)){
        points[points.length-1]=next;return;
      }
    }
    points.push(next);
  }

  function trimTrail(escort) {
    const here=trailPoint(escort,escort.cursor);
    while(escort.trail.length>1&&escort.trail[escort.trail.length-1].s>escort.cursor+.001)escort.trail.pop();
    if(Math.abs(escort.trail[escort.trail.length-1].s-escort.cursor)>.001){
      escort.trail.push({...here,s:escort.cursor});
    }
  }

  function updateEscortPose(state,moving=false) {
    const escort=state.escort,point=trailPoint(escort,escort.cursor);
    let heading=escort.heading;
    if((state.frozen||!moving&&escort.mode==='following')&&Number.isFinite(state.playerX)&&Number.isFinite(state.playerY)){
      const dx=state.playerX-point.x,dy=state.playerY-point.y;
      if(Math.hypot(dx,dy)>3)heading=Math.atan2(dy,dx);
    }
    state.pose={...state.person,...point,
      heading,facing:Math.cos(heading)<-.01?-1:1,
      moving:moving&&!state.frozen&&!motion.matches,
      animationTime:escort.animationTime,frozen:state.frozen,
      ...roadPosition(state.region,point.x,point.y),escortMode:escort.mode
    };
  }

  function beginEscort(id,{region,player,distance=54}={}) {
    if(!region?.map||!Number.isFinite(player?.x)||!Number.isFinite(player?.y))return null;
    population(region);
    const state=walkers.get(id);
    if(!state||state.region!==region||state.person.role!=='host')return null;
    if(state.escort?.mode==='following')return copyPose(state);
    const here=state.pose;
    if(Math.hypot(player.x-here.x,player.y-here.y)>160||!escortSegment(region,here,player))return null;
    let escort=state.escort;
    if(escort){
      // Rejoining during return keeps the original origin and traversed prefix.
      trimTrail(escort);escort.mode='following';escort.blocked=false;escort.reason='';
    }else{
      escort={mode:'following',trail:[{x:here.x,y:here.y,s:0}],cursor:0,
        animationTime:here.animationTime,heading:here.heading,blocked:false,reason:''};
      state.escort=escort;
    }
    escort.distance=Number.isFinite(distance)?Math.max(32,Math.min(88,distance)):54;
    appendTrail(escort,player);
    state.playerX=player.x;state.playerY=player.y;state.frozen=false;
    updateEscortPose(state);return copyPose(state);
  }

  function cancelEscort(id) {
    const state=walkers.get(id),escort=state?.escort;
    if(!escort)return false;
    escort.mode='returning';escort.blocked=false;escort.reason='';
    if(escort.cursor<=.001){state.escort=null;updateWalker(state);}
    else updateEscortPose(state);
    return true;
  }

  function escortState(id) {
    const state=walkers.get(id),escort=state?.escort;
    if(!escort)return null;
    return {personId:id,regionId:state.region.id,home:state.person.home,
      mode:escort.mode,x:state.pose.x,y:state.pose.y,distance:escort.distance,
      trailDistance:escort.trail[escort.trail.length-1].s-escort.cursor,
      returnRemaining:escort.cursor,blocked:escort.blocked,reason:escort.reason,
      frozen:state.frozen};
  }

  function moveEscort(state,target,budget) {
    const escort=state.escort,direction=Math.sign(target-escort.cursor);
    let moved=false;
    while(budget>.0001&&Math.abs(target-escort.cursor)>.0001){
      // Visit every stored corner even when several fall within one frame.
      const point=trailPoint(escort,escort.cursor),points=escort.trail;
      let corner=target;
      if(direction>0){
        const next=points.find(p=>p.s>escort.cursor+.0001);if(next)corner=Math.min(target,next.s);
      }else{
        for(let i=points.length-1;i>=0;i--)if(points[i].s<escort.cursor-.0001){corner=Math.max(target,points[i].s);break;}
      }
      const step=Math.min(budget,Math.abs(corner-escort.cursor)),nextDistance=escort.cursor+direction*step;
      const nextPoint=trailPoint(escort,nextDistance);
      if(!escortSegment(state.region,point,nextPoint)){
        escort.blocked=true;escort.reason='unsafe-trail';break;
      }
      escort.cursor=nextDistance;budget-=step;moved=true;
      escort.heading=Math.atan2(nextPoint.y-point.y,nextPoint.x-point.x);
    }
    return moved;
  }

  function tickEscort(state,delta,player,activeRoom) {
    const escort=state.escort;
    if(escort.mode==='following'&&activeRoom===state.person.home)escort.mode='arrived';
    if(escort.mode==='arrived'){updateEscortPose(state);return;}
    if(escort.mode==='following'&&!activeRoom&&Number.isFinite(player?.x)&&Number.isFinite(player?.y)){
      const last=escort.trail[escort.trail.length-1],gap=Math.hypot(player.x-last.x,player.y-last.y);
      if(gap>120){escort.blocked=true;escort.reason='discontinuous-player';}
      else if(!escortSegment(state.region,last,player)){escort.blocked=true;escort.reason='unsafe-player-trail';}
      else{
        const origin=escort.trail[0];
        // A small personal lane need not make the first meeting link exactly
        // collinear with the road. Wait while the nearby player passes, keeping
        // only this still-unwalked connection; real travelled history stays put.
        if(escort.cursor<.001&&Math.hypot(player.x-origin.x,player.y-origin.y)<=escort.distance
          &&escortSegment(state.region,origin,player))escort.trail.length=1;
        appendTrail(escort,player);escort.blocked=false;escort.reason='';
      }
    }
    const target=escort.mode==='returning'?0:Math.max(escort.cursor,escort.trail[escort.trail.length-1].s-escort.distance);
    // Essential travel remains available with reduced motion; the drawing below
    // suppresses the gait while ambient wandering and animals remain motionless.
    const speed=escort.mode==='returning'?Math.max(48,state.edge.speed*3):180;
    const moving=!state.frozen&&!(escort.mode==='following'&&activeRoom)
      &&moveEscort(state,target,speed*delta/1000);
    if(moving&&!motion.matches)escort.animationTime+=delta;
    if(escort.mode==='returning'&&escort.cursor<=.001){state.escort=null;updateWalker(state);return;}
    updateEscortPose(state,moving);
  }

  function updateWalker(state) {
    if(state.escort){updateEscortPose(state);return;}
    const edge=state.edge,p=state.profile,step=personalStep(state);
    const t=edge.from+(edge.to-edge.from)*step.fraction;
    const dx=edge.b.x-edge.a.x,dy=edge.b.y-edge.a.y;
    const nx=-dy/edge.length,ny=dx/edge.length,f=step.fraction,curve=2*Math.PI*f+p.curve+step.direction*.4;
    const offset=state.laneScale*(p.lane+p.sway*Math.sin(Math.PI*f)*Math.sin(curve));
    const derivative=state.laneScale*p.sway*(Math.PI*Math.cos(Math.PI*f)*Math.sin(curve)+2*Math.PI*Math.sin(Math.PI*f)*Math.cos(curve));
    const x=edge.a.x+dx*t+nx*offset,y=edge.a.y+dy*t+ny*offset;
    let facing=(Math.abs(dx)>1?Math.sign(dx):1)*step.direction;
    const baseHeading=Math.atan2((dy*(edge.to-edge.from)+ny*derivative)*step.direction,(dx*(edge.to-edge.from)+nx*derivative)*step.direction);
    const nextCurve=2*Math.PI*f+p.curve-step.direction*.4;
    const nextDerivative=state.laneScale*p.sway*(Math.PI*Math.cos(Math.PI*f)*Math.sin(nextCurve)+2*Math.PI*Math.sin(Math.PI*f)*Math.cos(nextCurve));
    const nextHeading=Math.atan2(-(dy*(edge.to-edge.from)+ny*nextDerivative)*step.direction,-(dx*(edge.to-edge.from)+nx*nextDerivative)*step.direction);
    const rotation=p.side>0?((nextHeading-baseHeading)%(2*Math.PI)+2*Math.PI)%(2*Math.PI):-((baseHeading-nextHeading)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
    let heading=baseHeading+step.look*(1-step.turn)+rotation*step.turn;
    if(state.frozen&&Number.isFinite(state.playerX)&&Number.isFinite(state.playerY)){
      const towardX=state.playerX-x,towardY=state.playerY-y;
      if(Math.hypot(towardX,towardY)>3)heading=Math.atan2(towardY,towardX);
      if(Math.abs(towardX)>3)facing=Math.sign(towardX);
    }
    state.pose={...state.person,
      x,y,
      moving:step.moving&&!state.frozen&&!motion.matches,
      facing,
      heading,
      animationTime:state.time*p.cadence,
      frozen:state.frozen,
      routeEdge:{a:edge.a.id,b:edge.b.id},routeT:t,
      meetingNode:t<=.5?edge.a.id:edge.b.id,
      walkPhase:step.phase,lateralOffset:offset,roadDistance:Math.abs(offset)
    };
  }

  // Gentle, deterministic yielding. Never rewrite the graph route: civilians
  // step aside a little, ease back to their own lane, and remain on dry land.
  // Only chapter 3 uses this fork; older chapters retain their normal walkers.
  function yieldFor(region,states,delta){
    const world=window.UPPDRAG_CH3_CITY_LIFE;
    const historical=world?.obstacles?.(region)||[];
    const bodies=states.map(state=>state.pose).filter(Boolean);
    const blend=motion.matches?1:Math.min(.32,Math.max(.08,delta/260));
    for(const state of states){
      if(!state.pose||state.frozen||state.escort)continue;
      const pose=state.pose;let pushX=0,pushY=0,close=0;
      for(const a of historical){
        const dx=pose.x-a.x,dy=pose.y-a.y;
        const distance=Math.hypot(dx,dy),radius=(a.radius||34)+30;
        if(distance>=radius)continue;
        const length=Math.max(1,distance),m=Math.min(25,(radius-distance)*.63);
        pushX+=dx/length*m;pushY+=dy/length*m;close++;
      }
      for(const other of bodies){
        if(other===pose||other.id===pose.id)continue;
        const dx=pose.x-other.x,dy=pose.y-other.y,d=Math.hypot(dx,dy);
        if(d>=45)continue;
        // Stable priority ensures two citizens do not choose the same sidestep.
        const sign=String(pose.id).localeCompare(String(other.id))<0?-1:1;
        const nx=-Math.sin(pose.heading||0),ny=Math.cos(pose.heading||0);
        const lateral=dx*nx+dy*ny;
        const way=Math.abs(lateral)>1?Math.sign(lateral):sign;
        const m=Math.min(15,(45-d)*.67);
        pushX+=nx*way*m;pushY+=ny*way*m;close++;
      }
      // Cap avoidance radius and ease to avoid twitching from near misses.
      const length=Math.hypot(pushX,pushY),max=24;
      if(length>max){pushX=pushX/length*max;pushY=pushY/length*max;}
      let vx=(state.yieldX||0)*(1-blend)+pushX*blend;
      let vy=(state.yieldY||0)*(1-blend)+pushY*blend;
      let factor=1;
      while(factor>0.0625&&!clearPoint(region,pose.x+vx*factor,pose.y+vy*factor,14))factor*=.5;
      if(factor<=.0625){vx=0;vy=0;factor=1;}
      state.yieldX=vx*factor;state.yieldY=vy*factor;
      pose.x+=state.yieldX;pose.y+=state.yieldY;
      if(close&&Math.hypot(state.yieldX,state.yieldY)>2)pose.yielding=true;
    }
  }
  function population(region) {
    if(!region?.map)return [];
    if(!populations.has(region))populations.set(region,new Map());
    const states=populations.get(region);
    const present=[];
    for(const person of window.UPPDRAG_LIVING_CONTENT?.people||[]){
      if(person.region!==region.id)continue;
      let state=states.get(person.id);
      if(!state){
        const edge=walkingEdge(region,WALKS[person.id]);
        if(!edge)continue;
        const profile=WALK_PROFILES[person.id];
        state={person,region,edge,profile,laneScale:safeLaneScale(region,edge,profile),time:edge.phase,frozen:false,pose:null,escort:null};
        updateWalker(state);states.set(person.id,state);walkers.set(person.id,state);
      }
      present.push(state);
    }
    return present;
  }

  function copyPose(state) {
    return {...state.pose,routeEdge:{...state.pose.routeEdge}};
  }

  function people(region) {
    return population(region).filter(state=>state.escort?.mode!=='arrived'
      &&(!activeRooms.get(region)||state.person.home!==activeRooms.get(region))).map(copyPose);
  }

  function hit(region, point) {
    if (!point) return null;
    let nearest = null;
    let distance = 29;
    for (const person of people(region)) {
      const d = Math.hypot(point.x - person.x, point.y - (person.y - 3));
      if (d <= distance) { nearest = person; distance = d; }
    }
    return nearest;
  }

  function tick(now,{region,player,activeRoom=null}={}) {
    if(!Number.isFinite(now))return;
    const delta=lastNow===null?0:Math.max(0,Math.min(now-lastNow,80));
    lastNow=now;
    const advance=motion.matches?0:delta*.53;
    elapsed+=advance;
    if(region?.map)activeRooms.set(region,activeRoom);
    for(const state of walkers.values()){
      if(state.escort?.mode==='following'&&state.region!==region)cancelEscort(state.person.id);
    }
    const activePopulation=population(region);
    for(const state of activePopulation){
      if(Number.isFinite(player?.x)&&Number.isFinite(player?.y)){
        state.playerX=player.x;state.playerY=player.y;
      }
      if(state.escort)tickEscort(state,delta,player,activeRoom);
      else{if(!state.frozen)state.time+=advance;updateWalker(state);}
    }
    yieldFor(region,activePopulation,delta);
  }

  function freeze(id) {
    const state=walkers.get(id);
    if(!state)return null;
    state.frozen=true;updateWalker(state);
    return copyPose(state);
  }

  function release(id) {
    const state=walkers.get(id);
    if(!state)return false;
    state.frozen=false;updateWalker(state);return true;
  }

  function piece(ctx, points, color, kind = 'piece', edge = .6) {
    ctx.save();
    ctx.beginPath();
    points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath();
    const fibres = window.UPPDRAG_PAPER_FIBRES;
    ctx.fillStyle = fibres?.material(ctx, color, kind) || color;
    ctx.fill();
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    const bounds = {x: Math.min(...xs), y: Math.min(...ys)};
    bounds.w = Math.max(...xs) - bounds.x;
    bounds.h = Math.max(...ys) - bounds.y;
    if (fibres) {
      fibres.finish(ctx, bounds, {kind, edge});
    } else if (kind !== 'detail') {
      // Stable fibres while the original paper material is still loading.
      ctx.clip();
      ctx.globalAlpha *= .16;
      ctx.fillStyle = '#fff7e2';
      const n = Math.min(24, Math.max(3, Math.round(bounds.w * bounds.h / 110)));
      for (let i = 0; i < n; i++) {
        const x = bounds.x + ((i * 47 + 11) % 101) / 101 * bounds.w;
        const y = bounds.y + ((i * 31 + 19) % 97) / 97 * bounds.h;
        ctx.fillRect(x, y, 1 + i % 3, .55);
      }
    }
    ctx.restore();
  }

  function cut(ctx, x, y, w, h, color, kind = 'piece') {
    piece(ctx, [[x+.5,y+.7],[x+w*.52,y],[x+w,y+.4],
      [x+w-.3,y+h],[x+w*.44,y+h-.4],[x,y+h-.2]], color, kind);
  }

  function fleck(ctx, x, y, color = '#443b30', size = 1.2) {
    piece(ctx, [[x-size,y],[x,y-size],[x+size,y+.2],[x+.3,y+size]], color, 'detail', 0);
  }

  function fallbackPerson(ctx, person) {
    ctx.save();
    ctx.translate(person.x, person.y);
    ctx.rotate(Number.isFinite(person.heading)?person.heading:0);
    const color=person.color||'#787761';
    const gait=person.moving&&!motion.matches?Math.sin(person.animationTime/190)*1.2:0;
    cut(ctx,-21+gait,-8,10,5,'#4d473a');
    cut(ctx,-21-gait,3,10,5,'#4d473a');
    cut(ctx,-8-gait*.35,-16,12,5,color,'cloth');
    cut(ctx,-8+gait*.35,11,12,5,color,'cloth');
    piece(ctx,[[-15,-9],[-5,-12],[6,-10],[8,0],[5,11],[-6,12],[-15,9]],color,'cloth');
    if(person.woman)piece(ctx,[[-5,-10],[-5,10],[-18,12],[-19,-11]],color,'cloth');
    piece(ctx,[[8,-7],[15,-5],[19,0],[15,5],[7,7],[1,1]],'#c6a778','skin');
    piece(ctx,[[-1,-8],[7,-9],[14,-6],[14,5],[7,9],[-2,7],[-3,0]],
      person.woman?'#d6cbb0':'#66513c','cloth');
    ctx.restore();
  }

  function talkMark(ctx, person, named) {
    ctx.save();
    ctx.translate(person.x, person.y);
    piece(ctx, [[10,-32],[27,-32],[29,-22],[20,-21],[15,-16],[15,-22],[10,-23]], '#f0e5cc');
    fleck(ctx, 15,-27,'#766a55',.7);
    fleck(ctx, 19,-27,'#766a55',.7);
    fleck(ctx, 23,-27,'#766a55',.7);
    if (named) {
      ctx.font = 'bold 15px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const name = person.name || person.label || '';
      const width = ctx.measureText(name).width + 16;
      cut(ctx, -width/2, 28, width, 23, '#f1e5ca');
      ctx.fillStyle = '#453c2d';
      ctx.fillText(name, 0, 39);
    }
    ctx.restore();
  }

  function roadRoute(region, nodeIds) {
    const nodes = nodeIds.map(id => region.map.get(id));
    if (nodes.some(node => !node)) return null;
    const segments = [];
    let length = 0;
    for (let i = 1; i < nodes.length; i++) {
      const a = nodes[i-1], b = nodes[i];
      const edge = region.edges.find(e => e.a === a.id && e.b === b.id || e.a === b.id && e.b === a.id);
      if (!edge) return null;
      const size = Math.hypot(b.x-a.x, b.y-a.y);
      segments.push({a, b, from: length, size});
      length += size;
    }
    return {segments, length};
  }

  function dogRoutes(region) {
    if (!routeCache.has(region)) routeCache.set(region, [
      {route: roadRoute(region, ['cafe','print','square','archive']), speed: 25, phase: 1700, color: '#998268', patch: '#e0d2b3'},
      {route: roadRoute(region, ['barn','work','homes']), speed: 22, phase: 9800, color: '#625a4c', patch: '#b4a18a'}
    ]);
    return routeCache.get(region);
  }

  // Short, quiet walks. Dogs meet another figure by stopping and turning;
  // no sideways evasive bursts or frame-dependent jumping.
  function dogPoint(dog, distance) {
    const d=Math.max(0,Math.min(dog.route.length,distance));
    const seg=dog.route.segments.find(s=>d<=s.from+s.size)||dog.route.segments.at(-1);
    const t=Math.max(0,Math.min(1,(d-seg.from)/seg.size));
    return {x:seg.a.x+(seg.b.x-seg.a.x)*t,
      y:seg.a.y+(seg.b.y-seg.a.y)*t,
      heading:Math.atan2(seg.b.y-seg.a.y,seg.b.x-seg.a.x)};
  }
  function dogPose(dog,time) {
    if(!Number.isFinite(dog.distance)){
      dog.distance=Math.min(dog.route.length*.18,80+(dog.phase%800)/20);
      dog.direction=1;dog.lastTime=time;dog.pauseUntil=time+600;dog.lastTurn=-Infinity;
    }
    const dt=Math.max(0,Math.min(.06,(time-dog.lastTime)/1000));
    dog.lastTime=time;
    const moving=!motion.matches&&time>=dog.pauseUntil;
    if(moving){
      dog.distance+=dog.direction*dog.speed*dt;
      if(dog.distance>=dog.route.length||dog.distance<=0){
        dog.distance=Math.max(0,Math.min(dog.route.length,dog.distance));
        dog.direction*=-1;dog.pauseUntil=time+1500;dog.lastTurn=time;
      }
    }
    const p=dogPoint(dog,dog.distance);
    return {x:p.x,y:p.y,heading:p.heading,
      facing:(Math.cos(p.heading)>=0?1:-1)*dog.direction,
      moving:moving&&time>=dog.pauseUntil};
  }
  function drawDog(ctx,dog,time,still,region,actors) {
    if(!dog.route) return;
    const pose=dogPose(dog,time);
    const neighbors=[...people(region).map(p=>({...p,radius:25})),...(actors||[])];
    // The dog looks ahead on its road, pauses, then turns back on meeting
    // a passerby, player or another obstacle. The change has a cooldown.
    if(!still&&time-dog.lastTurn>2500){
      const next=dogPoint(dog,dog.distance+dog.direction*40);
      const blocked=neighbors.some(other=>{
        const distance=Math.hypot(next.x-other.x,next.y-other.y);
        const close=Math.hypot(pose.x-other.x,pose.y-other.y);
        return distance<(other.radius||26)+16&&close<(other.radius||26)+58;
      });
      if(blocked){
        dog.direction*=-1;dog.pauseUntil=time+900;dog.lastTurn=time;
        const behind=dogPoint(dog,dog.distance+dog.direction*4);
        pose.facing=(Math.cos(behind.heading)>=0?1:-1)*dog.direction;
        pose.moving=false;
      }
    }
    dog.lastDrawnPose={x:pose.x,y:pose.y,facing:pose.facing,moving:pose.moving};
    const stride = !still && pose.moving ? Math.sin(time/210) * 1.05 : 0;
    const wag = !still ? Math.sin(time / (pose.moving ? 360 : 600)) * .12 : 0;
    const sniff = !still&&!pose.moving ? Math.max(0,Math.sin(time/700))*.22 : 0;
    ctx.save();
    ctx.translate(pose.x, pose.y);
    // Keep feet below the body in both directions; only local joints rotate.
    ctx.scale(pose.facing,1);
    cut(ctx, -10 + stride, 3, 4, 11, '#665c4b');
    cut(ctx, 6 - stride, 3, 4, 11, '#665c4b');
    ctx.save();
    ctx.translate(-13,-2);
    ctx.rotate(wag);
    piece(ctx, [[1,-2],[-8,-7],[-12,-6],[-7,-2],[0,3]], dog.color);
    ctx.restore();
    piece(ctx, [[-15,-5],[-8,-10],[7,-8],[13,-3],[10,7],[-11,7]], dog.color);
    piece(ctx, [[-2,-9],[6,-8],[8,-1],[1,2],[-3,-2]], dog.patch);
    cut(ctx, -10 - stride, 5, 4, 10, dog.color);
    cut(ctx, 6 + stride, 4, 4, 11, dog.color);
    ctx.save();ctx.translate(9,-3);ctx.rotate(sniff);ctx.translate(-9,3);
    piece(ctx, [[8,-10],[15,-12],[20,-7],[26,-5],[25,1],[17,4],[10,0]], dog.color);
    piece(ctx, [[11,-11],[17,-12],[15,-2],[10,-5]], '#74604b');
    fleck(ctx, 20,-6);
    piece(ctx, [[24,-5],[27,-4],[26,-1],[24,-1]], '#473e32', 'detail', 0);
    ctx.restore();
    ctx.restore();
  }

  const HENS = [
    {x:3190,y:1056,phase:0,light:true}, {x:3231,y:1073,phase:1900},
    {x:3270,y:1058,phase:3700,light:true}, {x:3235,y:340,phase:1100},
    {x:3253,y:377,phase:2800,light:true}, {x:3297,y:370,phase:4700}
  ];

  function drawHen(ctx, hen, time, still) {
    const stroll=outAndBack(time+hen.phase,3600,2200);
    const walking=!still&&stroll.moving;
    const peck=!still&&!stroll.moving?Math.max(0,Math.sin((time+hen.phase)/240)):0;
    const x=hen.x+(stroll.fraction-.5)*20;
    const y=hen.y+Math.sin(stroll.fraction*Math.PI)*2;
    const step=walking?Math.sin((time+hen.phase)/125)*2.1:0;
    const body = hen.light ? '#ded1ad' : '#aa8658';
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(stroll.direction,1);
    cut(ctx, -3 + step, 1, 1.4, 6, '#9e7743');
    cut(ctx, 2 - step, 1, 1.4, 6, '#9e7743');
    piece(ctx, [[-5,-5],[-10,-12],[-10,-5],[-13,-8],[-10,0],[-6,2]], hen.light ? '#c7b995' : '#765a43');
    piece(ctx, [[-7,-5],[-2,-9],[5,-7],[7,-2],[4,4],[-4,3]], body);
    piece(ctx, [[-4,-4],[1,-6],[5,-2],[1,1],[-4,0]], hen.light ? '#cbbd98' : '#957149');
    ctx.save();
    ctx.translate(5,-5);
    ctx.rotate(peck * .95);
    piece(ctx, [[-1,2],[0,-4],[2,-8],[6,-7],[7,-3],[4,2]], body);
    piece(ctx, [[1,-8],[1,-11],[3,-10],[5,-12],[6,-8]], '#a55f49');
    piece(ctx, [[6,-6],[10,-4],[6,-3]], '#ae8a49');
    fleck(ctx, 5,-6, '#554330', .65);
    ctx.restore();
    ctx.restore();
  }

  // South of the village and workshops, north of the coastline. No road crosses it.
  const PADDOCK = [[2945,1107],[3170,1104],[3180,1225],[2950,1228]];
  const GRAZERS = [
    {kind:'sheep',x:2994,y:1140,phase:500,span:22,duration:6200,pause:3500},
    {kind:'sheep',x:3060,y:1136,phase:8900,span:20,duration:5700,pause:3100},
    {kind:'sheep',x:3130,y:1141,phase:3400,span:18,duration:5300,pause:3700},
    {kind:'cow',x:3008,y:1191,phase:12100,span:25,duration:7600,pause:4400},
    {kind:'cow',x:3115,y:1189,phase:4300,span:28,duration:8100,pause:4000}
  ];

  function grazerPose(grazer,time) {
    const stroll=outAndBack(time+grazer.phase,grazer.duration,grazer.pause);
    return {
      x:grazer.x+(stroll.fraction-.5)*grazer.span,
      y:grazer.y+Math.sin(stroll.fraction*Math.PI)*1.5,
      facing:stroll.direction,moving:stroll.moving
    };
  }

  function fence(ctx, a, b) {
    const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
    const nx=-dy/length*1.4,ny=dx/length*1.4;
    for (const height of [5,11]) piece(ctx,
      [[a[0]+nx,a[1]-height+ny],[b[0]+nx,b[1]-height+ny],
       [b[0]-nx,b[1]-height-ny],[a[0]-nx,a[1]-height-ny]], '#af9e79');
    const count=Math.ceil(length/34);
    for(let i=0;i<=count;i++) {
      const x=a[0]+dx*i/count,y=a[1]+dy*i/count;
      piece(ctx, [[x-2,y-16],[x+1,y-17],[x+2,y+1],[x-2,y]], '#958262');
    }
  }

  function drawSheep(ctx, grazer, time, still, walking) {
    const t=time+grazer.phase;
    const stride=!still&&walking?Math.sin(t/180)*2.2:0;
    const nibble=!still&&!walking?Math.max(0,Math.sin(t/730)):0;
    const wag=!still?Math.sin(t/260)*2:0;
    piece(ctx,[[-12,-4],[-18,-2],[-20,3+wag],[-16,4+wag],[-13,1]],'#c3b99e');
    cut(ctx, -10+stride, 3, 3.5, 12, '#7d7360');
    cut(ctx, 7-stride, 3, 3.5, 12, '#7d7360');
    piece(ctx, [[-15,-6],[-11,-12],[-4,-11],[1,-14],[8,-12],[13,-10],
      [15,-3],[12,5],[5,7],[-1,6],[-7,8],[-13,3]], '#ded5b9');
    piece(ctx, [[-9,-7],[-5,-10],[1,-8],[5,-10],[10,-6],[8,0],[1,2],[-7,1]], '#e8dec4', 'piece', .35);
    cut(ctx,-9-stride,6,3.5,10,'#9a8a6e');
    cut(ctx,8+stride,5,3.5,11,'#9a8a6e');
    ctx.save();
    ctx.translate(11,-4);
    ctx.rotate(nibble*.60);
    piece(ctx, [[-1,-5],[5,-7],[10,-3],[12,5],[8,9],[2,6]], '#9a8b70');
    piece(ctx, [[2,-5],[0,-9],[6,-7],[7,-3]], '#bcae8e');
    fleck(ctx, 7,-1, '#4c4537', .9);
    ctx.restore();
  }

  function drawCow(ctx, grazer, time, still, walking) {
    const t=time+grazer.phase;
    const stride=!still&&walking?Math.sin(t/225)*2.4:0;
    const nibble=!still&&!walking?Math.max(0,Math.sin(t/1050)):0;
    const tail=!still?Math.sin(t/540)*3.6:0;
    piece(ctx, [[-18,-3],[-22,-2],[-23,12+tail],[-20,16+tail],[-20,10+tail],[-19,1]], '#867357');
    cut(ctx, -13+stride, 4, 4, 16, '#998160');
    cut(ctx, 10-stride, 4, 4, 16, '#998160');
    piece(ctx, [[-20,-7],[-13,-13],[7,-13],[19,-7],[18,5],[9,10],[-12,8],[-18,2]], '#cbb38b');
    piece(ctx, [[-12,-12],[-2,-12],[2,-6],[-3,1],[-13,-1],[-15,-6]], '#876e50');
    piece(ctx, [[11,-10],[18,-6],[17,2],[12,5],[7,1],[8,-4]], '#a38a65');
    cut(ctx, -12-stride, 6, 4, 14, '#b19975');
    cut(ctx, 10+stride, 7, 4, 13, '#b19975');
    cut(ctx, -12-stride, 18, 4.5, 3, '#645847');
    cut(ctx, 10+stride, 18, 4.5, 3, '#645847');
    ctx.save();
    ctx.translate(18,-4);
    ctx.rotate(nibble*.43);
    piece(ctx, [[-2,-7],[5,-9],[11,-4],[13,6],[9,12],[3,11],[-1,4]], '#b79c73');
    piece(ctx, [[0,-7],[-5,-11],[-7,-8],[-1,-3]], '#a58b65');
    piece(ctx, [[7,-7],[13,-10],[16,-8],[11,-3]], '#a58b65');
    piece(ctx, [[0,-8],[0,-13],[3,-10],[3,-7]], '#dfcfaa');
    piece(ctx, [[8,-8],[10,-13],[11,-9],[10,-6]], '#dfcfaa');
    piece(ctx, [[4,5],[12,5],[12,10],[7,12],[3,9]], '#c4aa87');
    fleck(ctx, 8,-2, '#4b4336', 1);
    ctx.restore();
  }

  function drawPaddock(ctx, time, still) {
    piece(ctx, PADDOCK, '#b9b899', 'land', .35);
    for (let i=0;i<20;i++) {
      const x=2965+(i*47%185),y=1120+(i*29%90);
      piece(ctx, [[x-3,y+2],[x-2,y-3],[x,y],[x+3,y-2],[x+2,y+3]], '#a5a886', 'piece', .15);
    }
    fence(ctx,PADDOCK[0],PADDOCK[1]);
    fence(ctx,PADDOCK[0],PADDOCK[3]);
    fence(ctx,PADDOCK[1],PADDOCK[2]);
    for (const grazer of GRAZERS) {
      const pose=grazerPose(grazer,time);
      ctx.save();
      ctx.translate(pose.x,pose.y);
      ctx.scale(pose.facing,1);
      if (grazer.kind === 'cow') drawCow(ctx,grazer,time,still,pose.moving);
      else drawSheep(ctx,grazer,time,still,pose.moving);
      ctx.restore();
    }
    fence(ctx,PADDOCK[3],PADDOCK[2]);
  }

  function draw(ctx, {region, now = performance.now(), activePersonId = null, hoverId = null, speakingPersonId = null} = {}) {
    if (!region?.map) return;
    const still = motion.matches;
    const dialogue=window.UPPDRAG_LIVING_DIALOGUES;
    const bubblePersonId=speakingPersonId||(dialogue?.active?dialogue.personId:null);
    ctx.save();
    if (region.id === 'main') {
      drawPaddock(ctx,elapsed,still);
      for (const [i,hen] of HENS.entries()) if(i%3===0)drawHen(ctx,hen,elapsed,still);
      const bodies=window.UPPDRAG_CH3_CITY_LIFE?.obstacles?.(region)||[];
      for (const [i,dog] of dogRoutes(region).entries())if(i%2===0)
        drawDog(ctx,dog,elapsed,still,region,bodies);
    }
    for (const person of people(region).sort((a,b) => a.y-b.y)) {
      if (window.UPPDRAG_MEETINGS?.drawMapPerson) {
        window.UPPDRAG_MEETINGS.drawMapPerson(ctx,person,person,now);
      } else fallbackPerson(ctx,person);
      // Chapter 3 civilians pass by quietly; the conflict NPCs show the available conversations.
    }
    ctx.restore();
  }

  window.UPPDRAG_WORLD_LIFE = {tick,draw,people,hit,freeze,release,
    quietPeople:people,quietDogs:region=>dogRoutes(region).filter((d,i)=>i%2===0).map(d=>d.lastDrawnPose||dogPose(d,elapsed)),
    beginEscort,cancelEscort,endEscort:cancelEscort,escortState};
})();
