/* Chapter places use the accepted living world. Navigation can pass a painted
 * corner safely, but never moves a map node, building, road or learning state.
 * The existing animation loop calls tick; there are no timers or new events.
 */
'use strict';
window.UPPDRAG_STORY_WORLD=(()=>{
  const places={
    cafe:{region:'main',kind:'cafe',building:'Kaffehuset'},
    print:{region:'main',kind:'print',building:'Tryckeriet'},
    archive:{region:'main',kind:'archive',building:'Arkivet'},
    quay:{region:'main',waterfront:true},
    barnhus:{region:'main',kind:'barnhus',building:'Barnhuset'},
    garden:{region:'main',kind:'science',building:'Vetenskapens hus'},
    farm:{region:'main',kind:'farm',building:'Byn'},
    opera:{region:'main',kind:'opera',building:'Operan'},
    marstrand:{region:'marstrand',waterfront:true},
    colony:{region:'colony',waterfront:true}
  };
  const overrides={
    main:{quayJ2:[1100,1062],quayJ3:[1390,1062]},
    marstrand:{port:[780,844]},
    colony:{port:[760,840],up:[1050,510]}
  };
  const graphCache=new WeakMap();
  let journey=null,navigating=0;

  function navigationPoint(r,id){
    if(r?.roadPlanVersion)return r.map.get(id)||null;
    const p=overrides[r?.id]?.[id],original=r?.map?.get(id);
    return p&&original?{...original,x:p[0],y:p[1]}:null;
  }
  const point=(r,id)=>navigationPoint(r,id)||r.map.get(id);
  function entryFor(r,building){
    if(!r||!building)return null;
    if(r.roadPlanVersion)return building.entry;
    if(r.id==='main'&&building.name==='Byn')return 'village';
    if(r.id==='main'&&building.name==='Verkstäderna')return 'work';
    if(r.id==='marstrand'&&building.name==='Fästningen')return 'up';
    if(r.id==='marstrand'&&building.name==='Stadens hus')return 'b';
    if(r.id==='colony'&&building.name==='Handelsplatsen')return 'b';
    return building.entry;
  }
  function clearPoint(r,x,y,radius=24){
    const keyboard=window.UPPDRAG_WORLD_KEYBOARD;
    if(keyboard?.walkablePoint)return keyboard.walkablePoint(r,x,y,radius);
    if(!r||x<radius||y<radius||x>r.w-radius||y>r.h-radius)return false;
    if(r.buildings.some(b=>inRect(x,y,b,radius)))return false;
    if(waterAt(r,x,y))return false;
    for(let i=0;i<12;i++)if(waterAt(r,x+Math.cos(i*Math.PI/6)*radius,y+Math.sin(i*Math.PI/6)*radius))return false;
    return true;
  }
  function clearSegment(r,a,b){
    const keyboard=window.UPPDRAG_WORLD_KEYBOARD;
    if(keyboard?.clearSegment)return keyboard.clearSegment(r,a,b,24);
    const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/3));
    for(let i=0;i<=n;i++)if(!clearPoint(r,a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n))return false;
    return true;
  }
  function edgePoints(r,edge){
    const a=point(r,edge.a),b=point(r,edge.b);
    if(!a||!b)return null;
    let middle=[];
    // The old diagonal grazes the coffeehouse. Two safe straight segments
    // keep the same road endpoints and leave the rendered road untouched.
    if(!r.roadPlanVersion&&r.id==='main'&&[edge.a,edge.b].includes('cafe')&&[edge.a,edge.b].includes('scienceJ'))middle=[{x:500,y:604}];
    const nodes=[a,...middle.map((p,i)=>({...p,id:'@story-road:'+edge.a+':'+edge.b+':'+i})),b];
    return nodes.every((p,i)=>!i||clearSegment(r,nodes[i-1],p))?nodes:null;
  }
  function graphFor(r){
    if(graphCache.has(r))return graphCache.get(r);
    const points=new Map(r.nodes.map(n=>[n.id,point(r,n.id)])),links=new Map(r.nodes.map(n=>[n.id,[]])),segments=[];
    const connect=(a,b)=>{
      const pa=points.get(a),pb=points.get(b),cost=Math.hypot(pa.x-pb.x,pa.y-pb.y);
      links.get(a).push({id:b,cost});links.get(b).push({id:a,cost});
    };
    for(const edge of r.edges){
      const nodes=edgePoints(r,edge);if(!nodes)continue;
      for(const p of nodes)if(!points.has(p.id)){points.set(p.id,p);links.set(p.id,[]);}
      for(let i=1;i<nodes.length;i++){
        const a=nodes[i-1],b=nodes[i];connect(a.id,b.id);
        segments.push({a,b,edge});
      }
    }
    const graph={points,links,segments};graphCache.set(r,graph);return graph;
  }
  function project(p,segment){
    const {a,b}=segment,dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;
    const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(length||1)));
    const x=a.x+dx*t,y=a.y+dy*t;
    return {x,y,t,distance:Math.hypot(p.x-x,p.y-y),segment};
  }
  function route(r,from,target,targetEdge=null){
    if(!r?.map||!from||!target||!clearPoint(r,from.x,from.y))return null;
    const graph=graphFor(r),points=new Map(graph.points),links=new Map([...graph.links].map(([id,list])=>[id,[...list]]));
    const connect=(a,b)=>{
      const pa=points.get(a),pb=points.get(b),cost=Math.hypot(pa.x-pb.x,pa.y-pb.y);
      links.get(a).push({id:b,cost});links.get(b).push({id:a,cost});
    };
    const add=(id,p)=>{points.set(id,{...p,id});links.set(id,[]);};
    const nearest=(p,edges)=>edges.map(edge=>project(p,edge)).filter(hit=>clearSegment(r,p,hit)).sort((a,b)=>a.distance-b.distance)[0];
    const start=nearest(from,graph.segments);if(!start)return null;
    add('@story-from',from);add('@story-start',start);
    connect('@story-from','@story-start');connect('@story-start',start.segment.a.id);connect('@story-start',start.segment.b.id);
    let goal=target.id;
    if(targetEdge){
      const candidates=graph.segments.filter(s=>(s.edge.a===targetEdge.a&&s.edge.b===targetEdge.b)||(s.edge.a===targetEdge.b&&s.edge.b===targetEdge.a));
      const end=nearest(target,candidates);if(!end)return null;
      goal='@story-meeting';add(goal,target);add('@story-end',end);
      connect(goal,'@story-end');connect('@story-end',end.segment.a.id);connect('@story-end',end.segment.b.id);
      if(start.segment===end.segment)connect('@story-start','@story-end');
    }
    if(!points.has(goal)||!clearPoint(r,points.get(goal).x,points.get(goal).y))return null;
    const costs=new Map([['@story-from',0]]),previous=new Map(),unseen=new Set(points.keys());
    while(unseen.size){
      let current=null,best=Infinity;
      for(const id of unseen)if((costs.get(id)??Infinity)<best){current=id;best=costs.get(id);}
      if(current===null)break;unseen.delete(current);if(current===goal)break;
      for(const next of links.get(current)){
        const cost=best+next.cost;
        if(cost<(costs.get(next.id)??Infinity)){costs.set(next.id,cost);previous.set(next.id,current);}
      }
    }
    if(!costs.has(goal))return null;
    const ids=[goal];while(ids[0]!=='@story-from'){const before=previous.get(ids[0]);if(!before)return null;ids.unshift(before);}
    const result=[];let cursor=from;
    for(const id of ids){
      const p=points.get(id);
      if(Math.hypot(p.x-cursor.x,p.y-cursor.y)>.001){
        if(!clearSegment(r,cursor,p))return null;
        result.push({id,x:p.x,y:p.y});cursor=p;
      }
    }
    return result;
  }

  function placeForVisit(visit){
    if(!visit)return null;
    const r=visit.regionId||region.id;
    if(visit.outdoor)return r==='main'?'quay':r==='marstrand'||r==='colony'?r:null;
    if(r!=='main')return null;
    return Object.keys(places).find(id=>places[id].region===r&&places[id].kind===visit.kind)||null;
  }
  function visitContext(visit){
    const place=placeForVisit(visit);
    return place?{storyPlace:place,storyLabel:place==='garden'?'Forskarbladen i Vetenskapens hus':visit.name}:{};
  }
  function currentPlace(){
    if(voyage||sailing)return null;
    return interior?placeForVisit(interior):'town';
  }
  function roomKey(place=currentPlace()){
    const destination=places[place];
    return destination?.kind||(destination?.waterfront?(destination.region==='main'?'quay':'waterfront-'+destination.region):null);
  }
  function withinNavigation(fn){navigating++;try{return fn();}finally{navigating--;}}
  function cancelNavigation(){const had=!!journey;journey=null;return had;}
  function enterDestination(place){
    const destination=places[place];
    if(!destination||destination.region!==region.id)return false;
    if(currentPlace()===place){journey=null;return true;}
    return withinNavigation(()=>{
      if(interior&&!leaveInterior())return false;
      if(destination.waterfront)return requestHarbour();
      const building=region.buildings.find(b=>b.name===destination.building);
      return !!building&&requestInterior(building);
    });
  }
  function planLeg(){
    if(!journey)return false;
    const destination=places[journey.place];
    if(region.id===destination.region){
      journey.nextRegion=null;journey.stage='destination';
      return enterDestination(journey.place);
    }
    journey.nextRegion=region.id==='main'?destination.region:'main';journey.stage='harbour';
    return withinNavigation(()=>{
      if(interior?.outdoor)return true;
      if(interior&&!leaveInterior())return false;
      return requestHarbour(journey.nextRegion);
    });
  }
  function navigate(place){
    if(!places[place]||voyage||sailing)return false;
    journey={place,stage:null,nextRegion:null};
    if(!planLeg()){journey=null;return false;}return true;
  }
  function tick(){
    if(!journey||voyage||sailing)return;
    if(currentPlace()===journey.place){journey=null;return;}
    if(journey.stage==='destination'){
      if(!pendingRoom&&!interior)journey=null;
      return;
    }
    if(journey.stage==='voyage'){
      if(region.id!==journey.nextRegion){journey=null;return;}
      if(!planLeg())journey=null;
      return;
    }
    if(interior?.outdoor&&journey.stage==='harbour'){
      const to=journey.nextRegion;journey.stage='voyage';
      if(!withinNavigation(()=>departHarbour(to)))journey=null;
    }else if(!pendingRoom&&!interior)journey=null;
  }

  // Explicit navigation remains under the player's control. A different click,
  // destination or exit cancels only the itinerary, never an engine phase.
  const oldGo=go,oldLeave=leaveInterior,oldDepart=departHarbour,oldSwitch=switchRegion;
  go=function(...args){if(!navigating)cancelNavigation();return oldGo(...args);};
  leaveInterior=function(...args){if(!navigating)cancelNavigation();return oldLeave(...args);};
  departHarbour=function(...args){if(!navigating)cancelNavigation();return oldDepart(...args);};
  switchRegion=function(id,...args){
    if(journey?.stage!=='voyage'||journey.nextRegion!==id)cancelNavigation();
    return withinNavigation(()=>oldSwitch(id,...args));
  };
  return {currentPlace,navigate,navigationPoint,entryFor,visitContext,roomKey,route,tick,cancelNavigation,
    get navigating(){return journey?{...journey}:null;}};
})();
