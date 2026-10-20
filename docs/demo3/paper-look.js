/* Shared town plan. Applied exactly once, before the first scene is cached and
 * before the chapter's navigation/life controllers are constructed.
 * Coordinates, hit footprints and painted geometry move together. No save data. */
'use strict';
window.UPPDRAG_TOWN_LAYOUT=(()=>{
 const done=new WeakSet();
 const RAD=Math.PI/180;
 function rebuild(r){
  r.map=new Map(r.nodes.map(n=>[n.id,n]));
  r.graph=new Map(r.nodes.map(n=>[n.id,[]]));
  for(const e of r.edges){
   if(!r.map.has(e.a)||!r.map.has(e.b))throw Error('Unknown road endpoint '+e.a+' / '+e.b);
   r.graph.get(e.a).push(e.b);r.graph.get(e.b).push(e.a);
  }
 }
 function node(r,id,x,y){const n=r.nodes.find(n=>n.id===id);if(n)Object.assign(n,{x,y});else r.nodes.push({id,x,y});}
 function edge(r,a,b,w=58){r.edges.push({a,b,w});}
 function rotated(b,degrees){
  const p={x:b.x,y:b.y,w:b.w,h:b.h,a:degrees*RAD};
  p.cx=p.x+p.w/2;p.cy=p.y+p.h/2;
  b.paperPose=p;
  const ww=Math.abs(Math.cos(p.a))*p.w+Math.abs(Math.sin(p.a))*p.h;
  const hh=Math.abs(Math.sin(p.a))*p.w+Math.abs(Math.cos(p.a))*p.h;
  Object.assign(b,{x:p.cx-ww/2,y:p.cy-hh/2,w:ww,h:hh});
 }
 function door(b,entry){
  const p=b.paperPose||{x:b.x,y:b.y,w:b.w,h:b.h,a:0,cx:b.x+b.w/2,cy:b.y+b.h/2};
  const c=Math.cos(p.a),s=Math.sin(p.a),dx=(entry?.x??p.cx)-p.cx,dy=(entry?.y??(p.cy+p.h))-p.cy;
  const ex=dx*c+dy*s,ey=-dx*s+dy*c;
  let x=0,y=0,nx=0;
  if(Math.abs(ex)/(p.w/2)>Math.abs(ey)/(p.h/2)){x=(ex<0?-1:1)*p.w/2;nx=ex<0?-1:1;}
  else y=(ey<0?-1:1)*p.h/2;
  return{x:p.cx+x*c-y*s,y:p.cy+x*s+y*c,angle:p.a+(nx?Math.PI/2:0)};
 }
 function contains(x,y,b,pad=0){
  const p=b.paperPose;if(!p)return x>=b.x-pad&&x<=b.x+b.w+pad&&y>=b.y-pad&&y<=b.y+b.h+pad;
  const dx=x-p.cx,dy=y-p.cy,c=Math.cos(p.a),s=Math.sin(p.a);
  return Math.abs(dx*c+dy*s)<=p.w/2+pad&&Math.abs(-dx*s+dy*c)<=p.h/2+pad;
 }
 // The named doors stay stable. Street junctions are separate from doors:
 // moving a destination must never pull a through-road through the building.
 const WALK_EDGES={
  maja:['west','cafeStreet'],brita:['northGate','printStreet'],
  rut:['archiveStreet','operaJ'],jo:['quayJ1','quayBend'],
  klara:['square','churchStreet'],otto:['printStreet','square'],
  linnea:['castle','science'],lovisa:['scienceJ','northWest'],
  noor:['courtNorth','workStreet'],karin:['homesDoor','urbanCourt'],
  liv:['operaTop','operaJ']
 };
 const STREET_ANCHORS={
  book:['cafeStreet','northGate',.60,0],teacher:['church','churchyard',.28,0],
  botanist:['science','academyEast',.50,0],journal:['operaJ','riverJ',.70,-7],
  chemist:['courtNorth','workStreet',.60,0],grower:['ruralJ1','countrySouth',.75,0],
  linne:['westLane','campWest',.84,0],celsius:['castle','science',.88,0],
  ekeblad:['campNorth','campNorthVia',.34,0],dalarna:['campNorth','campNorthVia',.06,0],
  elisabet:['church','churchyard',.94,0],cook:['homesDoor','urbanCourt',.74,0],
  baker:['west','cafeStreet',.30,0],flyer:['archiveStreet','operaJ',.55,-11],
  child:['square','churchStreet',.30,-18],carrier:['operaJ','riverJ',.20,10],
  sailor:['quayJ2','quayJ3',.30,0],washer:['bridgeE','barnStreet',.36,10],
  smith:['workStreet','ruralJ1',.54,0],basket:['urbanCross','homesDoor',.51,0],
  royalNotice:['square','churchStreet',.63,18],
  estateCritic:['quayJ3','riksdag',.82,-4],courtSupport:['castle','science',.07,0]
 };
 function walkFor(r,id,original){
  const pair=r.roadPlanVersion&&WALK_EDGES[id];
  return pair?{...original,a:pair[0],b:pair[1]}:original;
 }
 function dogWalk(r,index,original){
  if(!r.roadPlanVersion)return original;
  return index===0?['cafeStreet','northGate','printStreet','square','churchStreet','archiveStreet']
   :['urbanCross','homesDoor','urbanCourt','homes','courtNorth','workStreet'];
 }
 // Authored street conversations retain their own text and triggers. Their
 // physical patrol reads the same edge as the renderer and click navigator.
 function streetPose(r,actor,elapsed,still=false){
  if(!r?.roadPlanVersion||actor.region!=='main')return null;
  const anchor=STREET_ANCHORS[actor.id];if(!anchor)return null;
  const [ai,bi,at,lane]=anchor,a=r.map.get(ai),b=r.map.get(bi);
  if(!a||!b)return null;
  const length=Math.hypot(b.x-a.x,b.y-a.y),ux=(b.x-a.x)/length,uy=(b.y-a.y)/length;
  const center=at*length,span=Math.min(actor.range||12,Math.max(0,center-6),Math.max(0,length-center-6));
  const duration=actor.period||16000,rest=1450,cycle=2*(duration+rest);
  const time=((still?0:elapsed)+actor.x*7)%cycle,back=time>=duration+rest;
  const leg=back?time-duration-rest:time,f=Math.min(1,leg/duration);
  const eased=(1-Math.cos(Math.PI*f))/2;
  const distance=center-span+2*span*(back?1-eased:eased),t=distance/length;
  return {x:a.x+ux*distance-uy*lane,y:a.y+uy*distance+ux*lane,
   heading:Math.atan2(uy,ux)+(back?Math.PI:0),moving:!still&&leg<duration&&Math.sin(Math.PI*f)>.08,
   routeEdge:{a:ai,b:bi},routeT:t};
 }
 function apply(r){
  if(done.has(r))return;
  done.add(r);
  if(r.id!=='main'||!document.title.match(/Kapitel\s+[1-5]\b/i))return;
  const homes=r.buildings.find(b=>b.name==='Bostadskvarteren');
  const opera=r.buildings.find(b=>b.name==='Operan');
  if(!homes||!opera)return;
  const hasCamps=r.nodes.some(n=>n.id==='campWest');
  // Keep the accepted urban building move and original paper artwork.
  Object.assign(homes,{x:2260,y:850,w:220,h:150,entry:'homesDoor'});
  Object.assign(opera,{x:1400,y:70,w:255,h:165});
  r.buildings.push(
   {x:2240,y:1110,w:135,h:82,name:'Bostadshus',entry:'homesDoor',scenery:true,roof:'#91654f',wall:'#c8b99d'},
   {x:2395,y:1110,w:118,h:77,name:'Bostadshus',entry:'homesDoor',scenery:true,roof:'#91654f',wall:'#c8b99d'}
  );
  r.buildings.find(b=>b.name==='Verkstäderna').entry='work';
  r.buildings.find(b=>b.name==='Byn').entry='village';
  // REPLACE the former graph, rather than appending more connectors to it.
  r.nodes=[];r.edges=[];
  const points={
   west:[100,705],cafeStreet:[360,705],northGate:[540,705],printStreet:[623,705],
   square:[1010,705],churchStreet:[1110,705],archiveStreet:[1240,705],
   operaJ:[1710,705],riverJ:[1900,705],bridgeW:[1960,705],bridgeE:[2190,705],
   barnStreet:[2400,705],courtNorth:[2540,705],workStreet:[2745,705],ruralJ1:[2900,705],
   cafe:[360,628],print:[623,808],archive:[1240,808],barn:[2400,633],work:[2745,828],
   scienceJ:[540,510],northWest:[540,333],castle:[825,333],science:[1120,333],
   academyEast:[1530,333],operaDoor:[1530,290],operaTop:[1710,333],
   church:[1110,606],churchyard:[1240,606],
   quayJ1:[1010,835],quayBend:[1010,1092],quayJ2:[1240,1092],quayJ3:[1480,1092],
   quay:[1480,1120],riksdag:[1725,1092],riverCorner:[1900,1092],
   urbanNorth:[2200,810],urbanCross:[2200,1048],homesDoor:[2370,1048],
   urbanCourt:[2540,1048],homes:[2540,820],
   countrySouth:[3270,745],village:[3270,810],ruralJ2:[2745,355],farmLane:[3100,355],manor:[3400,355]
  };
  for(const [id,[x,y]] of Object.entries(points))node(r,id,x,y);
  const chain=(ids,w,kind)=>{for(let i=1;i<ids.length;i++){edge(r,ids[i-1],ids[i],w);r.edges.at(-1).kind=kind;}};
  // One legible main street from the old town, across the bridge, to the country.
  chain(['west','cafeStreet','northGate','printStreet','square','churchStreet','archiveStreet',
   'operaJ','riverJ','bridgeW','bridgeE','barnStreet','courtNorth','workStreet','ruralJ1'],82,'main');
  chain(['ruralJ1','countrySouth'],52,'country');
  // Two purposeful old-town loops, around buildings rather than through them.
  chain(['northGate','scienceJ','northWest','castle','science','academyEast','operaTop','operaJ'],54,'street');
  chain(['square','quayJ1','quayBend','quayJ2','quayJ3','riksdag','riverCorner','riverJ'],58,'street');
  // One shared residential court. No outer ring or diagonal to the countryside.
  chain(['bridgeE','urbanNorth','urbanCross','homesDoor','urbanCourt','homes','courtNorth'],44,'lane');
  // One country road serves the estate. The village has a short approach.
  chain(['workStreet','ruralJ2','farmLane','manor'],48,'country');
  for(const [a,b] of [['cafeStreet','cafe'],['printStreet','print'],['archiveStreet','archive'],
   ['barnStreet','barn'],['workStreet','work'],['academyEast','operaDoor'],
   ['churchStreet','church'],['church','churchyard'],['countrySouth','village'],['quayJ3','quay']]){
   chain([a,b],a==='quayJ3'?40:32,'path');
  }
  if(hasCamps){
   node(r,'westLane',100,1050);node(r,'campWest',287,1050);
   node(r,'campNorthVia',2745,288);node(r,'campNorth',2435,288);
   chain(['west','westLane','campWest'],36,'path');
   chain(['ruralJ2','campNorthVia','campNorth'],40,'lane');
  }
  // Remove the disconnected ornamental bridge, not the bridge used for travel.
  r.bridges=r.bridges.filter(b=>b.y>600);
  r.plazas=[{x:1010,y:705,r:99},
   {x:1175,y:606,r:55,polygon:[[1067,578],[1235,574],[1282,585],[1284,633],[1080,641],[1060,622]]},
   {x:2390,y:1048,r:44,polygon:[[2255,1026],[2475,1022],[2515,1035],[2518,1076],[2290,1078],[2250,1064]]},
   {x:3270,y:810,r:35,polygon:[[3202,789],[3336,785],[3350,813],[3338,841],[3200,840],[3188,813]]}
  ];
  r.labels=r.labels.map(l=>l.t==='Landsbygden'?{...l,node:'countrySouth'}:l);
  rebuild(r);
  const angles={'Kaffehuset':-3,'Tryckeriet':0,'Arkivet':-3,'Operan':-5,
   'Vetenskapens hus':-4,'Bostadskvarteren':-8,'Bostadshus':-8,'Byn':-4,'Herrgården':-5};
  for(const b of r.buildings)rotated(b,angles[b.name]||0);
  if(typeof inRect==='function')inRect=contains;
  r.roadPlanVersion='roads-1';
  // Old navigation overrides must not move points away from the painted roads.
  document.documentElement.dataset.townLayout='roads-1';
 }
 return {apply,door,contains,walkFor,dogWalk,streetPose,version:'roads-1'};
})();

/* Original paper materials with a shared, one-time chapter layout preparation.
 * No new image overlays, iframe, learning state or voyage logic.
 */
'use strict';
window.UPPDRAG_PAPER = (() => {
  const make = (w,h) => {const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
  const source=make(1280,720), tiles=new Map(), patterns=new WeakMap();
  let loaded=false;
  const crops={
    ground:[25,20,300,125], paper:[438,20,58,152], water:[1152,18,122,300],
    red:[65,196,169,131], slate:[175,464,174,111], olive:[568,73,174,100],
    ochre:[762,74,62,96], stone:[1065,32,31,165]
  };
  const roofCrops={red:[34,176,308,162],slate:[155,442,278,149],olive:[552,53,288,137]};
  const fallbacks={ground:'#c9bfaa',paper:'#efdfc2',water:'#356e87',red:'#a14e3b',
    slate:'#50524d',olive:'#746a50',ochre:'#b39a6a',stone:'#8c806a',green:'#87906d',sand:'#cbbc94'};
  function random(seed){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
  function tile(name){
    if(tiles.has(name))return tiles.get(name);
    const tint=name==='green'?'#84936d':name==='sand'?'#d0bd92':null;
    const crop=crops[name]||crops.ground;
    const [x,y,w,h]=crop, c=make(w*2,h*2),g=c.getContext('2d');
    if(loaded){
      for(let iy=0;iy<2;iy++)for(let ix=0;ix<2;ix++){
        g.save();g.translate(ix?w*2:0,iy?h*2:0);g.scale(ix?-1:1,iy?-1:1);
        g.drawImage(source,x,y,w,h,0,0,w,h);g.restore();
      }
      if(tint){g.globalCompositeOperation='color';g.fillStyle=tint;g.globalAlpha=.63;g.fillRect(0,0,c.width,c.height);g.globalCompositeOperation='source-over';g.globalAlpha=1;}
    }else{
      g.fillStyle=fallbacks[name]||fallbacks.ground;g.fillRect(0,0,c.width,c.height);
      const rng=random(1700);for(let i=0;i<3000;i++){
        g.fillStyle=i%2?'#fff4dc':'#493b2c';g.globalAlpha=.06;
        g.fillRect(rng()*c.width,rng()*c.height,1+rng()*2,1+rng()*2);
      }g.globalAlpha=1;
    }
    tiles.set(name,c);return c;
  }
  function material(g,name){let p=patterns.get(g);if(!p){p=new Map();patterns.set(g,p);}if(!p.has(name))p.set(name,g.createPattern(tile(name),'repeat')||fallbacks[name]);return p.get(name);}
  function path(g,p){g.beginPath();p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();}
  function rough(p,seed=19,amount=1.5){
    const out=[],rng=random(seed);
    p.forEach((a,i)=>{const b=p[(i+1)%p.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),n=Math.max(1,Math.ceil(len/9));
      for(let j=0;j<n;j++){const t=j/n,k=j?(rng()-.5)*amount:0;out.push([a[0]+dx*t-dy/(len||1)*k,a[1]+dy*t+dx/(len||1)*k]);}});
    return out;
  }
  function piece(g,p,name,{edge=false,shadow=false,seed=23}={}){
    g.save();const pts=rough(p,seed);path(g,pts);
    if(shadow){g.shadowColor='#382e2145';g.shadowBlur=4;g.shadowOffsetX=2;g.shadowOffsetY=5;}
    g.fillStyle=material(g,name);g.fill();g.shadowColor='transparent';
    if(edge){g.strokeStyle='#eee2c8';g.lineWidth=1.7;g.stroke();}g.restore();
  }
  function box(g,x,y,w,h,name,opts={}){piece(g,[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],name,{seed:Math.round(x*3+y),...opts});}
  function segmentDistance(x,y,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-a.x-dx*t,y-a.y-dy*t);}
  function inPoly(x,y,p){let hit=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
  function wet(r,x,y){return r.island?!inPoly(x,y,r.island):r.water.some(p=>inPoly(x,y,p));}
  function nearRoad(r,x,y,pad=30){return r.edges.some(e=>segmentDistance(x,y,r.map.get(e.a),r.map.get(e.b))<e.w/2+pad)||r.plazas.some(p=>Math.hypot(x-p.x,y-p.y)<p.r+pad);}
  function clearDecoration(r,x,y,pad=40){return !wet(r,x,y)&&!nearRoad(r,x,y,pad)&&!r.buildings.some(b=>x>b.x-pad&&x<b.x+b.w+pad&&y>b.y-pad&&y<b.y+b.h+pad);}
  function road(g,a,b,w){
    g.save();g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);
    g.strokeStyle=material(g,'paper');g.lineWidth=w;g.stroke();g.restore();
  }
  function roofType(b){return /Tryck|Verk|Slott|Fäst|Oper|Vetenskap/.test(b.name)?(/Vetenskap/.test(b.name)?'olive':'slate'):/Herrgård/.test(b.name)?'olive':'red';}
  function drawBuildingOriginal(g,b,r){
    const type=roofType(b),e=r.map.get(b.entry),door={x:b.x+b.w/2,y:b.y+b.h};
    if(!b.scenery&&!b.layoutCore)road(g,door,e,25);
    box(g,b.x+4,b.y+7,b.w,b.h+5,'ochre',{shadow:true});
    const p=rough([[b.x,b.y],[b.x+b.w,b.y],[b.x+b.w,b.y+b.h],[b.x,b.y+b.h]],Math.round(b.x+b.y),2.4);
    g.save();path(g,p);g.clip();
    if(loaded){const crop=roofCrops[type];g.drawImage(source,...crop,b.x,b.y,b.w,b.h);}
    else{g.fillStyle=material(g,type);g.fillRect(b.x,b.y,b.w,b.h);g.fillStyle=material(g,'ochre');g.fillRect(b.x+b.w*.76,b.y,b.w*.24,b.h);}
    g.restore();g.save();path(g,p);g.strokeStyle='#f0e3c8';g.lineWidth=2;g.stroke();g.restore();
    if(!b.layoutCore&&!b.scenery)box(g,door.x-12,door.y-2,24,9,'slate');
    if(b.scenery)return;
    const onRoof=e.x>=b.x&&e.x<=b.x+b.w&&e.y>=b.y&&e.y<=b.y+b.h;
    const cx=onRoof?b.x+37:b.x+b.w*.38,cy=onRoof?b.y+36:b.y+b.h*.48;
    box(g,cx-27,cy-23,54,46,'paper',{shadow:true});
    g.save();g.translate(cx,cy);g.strokeStyle='#514939';g.fillStyle='#514939';g.lineWidth=2.4;g.lineCap='round';g.lineJoin='round';
    if(/Kaffe/.test(b.name)){
      g.beginPath();g.ellipse(0,-7,13,4,0,0,Math.PI*2);g.stroke();g.beginPath();g.moveTo(-13,-6);g.lineTo(-10,7);g.quadraticCurveTo(0,14,10,7);g.lineTo(13,-6);g.stroke();g.beginPath();g.arc(15,0,6,-1.4,1.4);g.stroke();g.beginPath();g.ellipse(0,14,19,3,0,0,Math.PI*2);g.stroke();
    }else if(/Vetenskap/.test(b.name)){
      g.beginPath();g.moveTo(-2,16);g.lineTo(1,-16);g.moveTo(0,2);g.quadraticCurveTo(-21,-4,-15,-15);g.quadraticCurveTo(-1,-14,0,2);g.moveTo(0,9);g.quadraticCurveTo(21,3,14,-8);g.quadraticCurveTo(2,-7,0,9);g.stroke();
    }else if(/Slott|Herrgård|Fäst/.test(b.name)){
      g.beginPath();g.moveTo(-17,11);g.lineTo(-19,-12);g.lineTo(-7,-3);g.lineTo(0,-16);g.lineTo(7,-3);g.lineTo(19,-12);g.lineTo(17,11);g.closePath();g.stroke();g.beginPath();g.moveTo(-16,16);g.lineTo(16,16);g.stroke();
    }else if(/Verk/.test(b.name)){
      g.beginPath();g.moveTo(-14,15);g.lineTo(10,-10);g.moveTo(3,-16);g.lineTo(18,-1);g.moveTo(-15,-14);g.lineTo(14,15);g.stroke();
    }else if(/Oper/.test(b.name)){
      g.beginPath();g.moveTo(-17,16);g.lineTo(-17,-15);g.lineTo(17,-15);g.lineTo(17,16);g.moveTo(-17,-15);g.quadraticCurveTo(-6,3,-17,6);g.moveTo(17,-15);g.quadraticCurveTo(6,3,17,6);g.stroke();
    }else if(/Barn|Byn|Bostad|Stadens|Gustavia/.test(b.name)){
      g.beginPath();g.moveTo(-19,-2);g.lineTo(0,-17);g.lineTo(19,-2);g.moveTo(-14,-5);g.lineTo(-14,15);g.lineTo(14,15);g.lineTo(14,-5);g.moveTo(-4,15);g.lineTo(-4,3);g.lineTo(4,3);g.lineTo(4,15);g.stroke();
    }else{
      g.strokeRect(-13,-17,26,34);for(let y=-9;y<=9;y+=6){g.beginPath();g.moveTo(-7,y);g.lineTo(8,y);g.stroke();}
    }g.restore();
  }
  function drawBuilding(g,b,r){
    const p=b.paperPose;
    if(!p)return drawBuildingOriginal(g,b,r);
    const door=window.UPPDRAG_TOWN_LAYOUT.door(b,r.map.get(b.entry));
    if(!b.scenery)road(g,door,r.map.get(b.entry),25);
    g.save();g.translate(p.cx,p.cy);g.rotate(p.a);g.translate(-p.cx,-p.cy);
    drawBuildingOriginal(g,{...b,x:p.x,y:p.y,w:p.w,h:p.h,layoutCore:true},r);
    g.restore();
    if(!b.scenery){g.save();g.translate(door.x,door.y);g.rotate(door.angle);box(g,-12,-4,24,9,'slate');g.restore();}
  }
  function buildingSprite(b){
    const p=b.paperPose||b,c=make(Math.round(p.w),Math.round(p.h)),g=c.getContext('2d');
    const fake={...b,x:0,y:0,w:p.w,h:p.h,layoutCore:true,paperPose:null};
    drawBuildingOriginal(g,fake,{map:new Map([[b.entry,{x:p.w/2,y:p.h+30}]])});
    return c;
  }
  function label(g,text,x,y){
    g.save();g.font='500 21px Georgia';const w=g.measureText(text).width+24;
    box(g,x-w/2,y-33,w,36,'paper',{shadow:true});g.fillStyle='#433a2d';g.textAlign='center';g.fillText(text,x,y-9);g.restore();
  }
  function tree(g,x,y,palm){
    box(g,x-4,y-1,8,26,'olive');
    if(palm){for(let a=0;a<6;a++){const t=a*Math.PI/3,c=Math.cos(t),s=Math.sin(t);piece(g,[[x,y-12],[x+c*24-s*11,y-12+s*24+c*11],[x+c*44,y-6+s*44],[x+c*21+s*10,y-12+s*21-c*10]],'green',{shadow:true,seed:a+Math.round(x)});}}
    else{piece(g,[[x-21,y+6],[x-30,y-11],[x-18,y-34],[x+2,y-42],[x+27,y-28],[x+31,y-4],[x+11,y+13]],'green',{shadow:true,seed:Math.round(x)});}
  }
  function boat(g,x,y,s=1){
    g.save();g.translate(x,y);g.scale(s,s);
    piece(g,[[0,-62],[18,-36],[23,18],[13,48],[0,62],[-13,48],[-23,18],[-18,-36]],'slate',{shadow:true,edge:true});
    piece(g,[[0,-49],[13,-27],[16,19],[8,42],[0,50],[-8,42],[-16,19],[-13,-27]],'olive');
    for(let y=-22;y<30;y+=23)box(g,-15,y,30,6,'ochre');g.restore();
  }
  function harbor(g,r){
    const q=r.map.get(r.harbor);
    if(r.id==='main'){
      box(g,q.x-29,q.y-8,58,104,'olive',{shadow:true});
      box(g,1375,1190,235,42,'olive',{shadow:true});
      for(let x=1382;x<1605;x+=18)box(g,x,1193,12,35,'ochre');
      for(let x=1400;x<1590;x+=55)box(g,x,1230,14,45,'slate');
      boat(g,1646,1338,1.14);
    }else{
      box(g,q.x-24,q.y+8,48,100,'olive',{shadow:true});
      for(let y=q.y+15;y<q.y+95;y+=16)box(g,q.x-20,y,40,8,'ochre');
      box(g,q.x-40,q.y+100,80,16,'olive',{shadow:true});
    }
  }
  function drawRegion(r){
    window.UPPDRAG_TOWN_LAYOUT?.apply(r);
    const c=make(r.w,r.h),g=c.getContext('2d');
    g.fillStyle=material(g,r.island?'water':'ground');g.fillRect(0,0,r.w,r.h);
    if(r.island)piece(g,r.island,r.id==='colony'?'sand':'ground',{edge:true});
    else for(const p of r.water)piece(g,p,'water',{edge:true});
    window.UPPDRAG_WORLD_GROWTH?.paintFields?.(g,r);
    for(const e of r.edges)road(g,r.map.get(e.a),r.map.get(e.b),e.w);
    for(const p of r.plazas){if(p.polygon){piece(g,p.polygon,'paper');continue;}g.beginPath();g.arc(p.x,p.y,p.r,0,Math.PI*2);g.fillStyle=material(g,'paper');g.fill();}
    for(const b of r.bridges){box(g,b.x,b.y,b.w,b.h,'olive',{shadow:true});
      for(let x=b.x+6;x<b.x+b.w-7;x+=19)box(g,x,b.y+6,12,b.h-12,'ochre');
      box(g,b.x,b.y,b.w,5,'slate');box(g,b.x,b.y+b.h-5,b.w,5,'slate');}
    for(const b of r.buildings)drawBuilding(g,b,r);
    window.UPPDRAG_WORLD_GROWTH?.paintBuildings?.(g,r);
    for(let i=0;i<(r.id==='main'?65:26);i++){
      const x=70+(i*173)%(r.w-140),y=70+(i*229)%(r.h-140);
      if(clearDecoration(r,x,y,46))tree(g,x,y,r.id==='colony');
    }
    harbor(g,r);
    const buildingNodes=new Set(r.buildings.map(b=>b.entry));
    for(const l of r.labels)if(!buildingNodes.has(l.node)){const n=r.map.get(l.node);label(g,l.t,n.x,n.y-45);}
    for(const b of r.buildings){if(b.scenery)continue;const n=r.map.get(b.entry);label(g,b.name,n.x,n.y-22);}
    return c;
  }
  let finish;
  const ready=new Promise(resolve=>{finish=resolve;});
  const image=new Image();let settled=false;
  function complete(ok){if(settled)return;settled=true;finish(ok);}
  image.onload=()=>{try{source.getContext('2d').drawImage(image,0,0,1280,720);loaded=true;tiles.clear();complete(true);}catch(e){console.warn('Originalets pappersmaterial kunde inte läsas.',e);complete(false);}};
  image.onerror=()=>complete(false);
  image.src=new URL('../world/assets/town.webp',document.baseURI).href;
  setTimeout(()=>complete(loaded),8000);
  return {drawRegion,buildingSprite,ready,get originalLoaded(){return loaded;},sourcePath:'../world/assets/town.webp'};
})();
