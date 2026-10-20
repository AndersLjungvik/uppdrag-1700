/* Demo 3.3 visual layer. Reads, but never changes, the Demo 3.2.1 region data.
 * Source of material samples: ../world/assets/town.webp (the original demo).
 * No replacement map, no iframe, no new navigation or voyage logic.
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
  function drawBuilding(g,b,r){
    const type=roofType(b),e=r.map.get(b.entry),door={x:b.x+b.w/2,y:b.y+b.h};
    // The existing entrance and building dimensions are NOT moved.
    road(g,door,e,25);
    box(g,b.x+4,b.y+7,b.w,b.h+5,'ochre',{shadow:true});
    const p=rough([[b.x,b.y],[b.x+b.w,b.y],[b.x+b.w,b.y+b.h],[b.x,b.y+b.h]],Math.round(b.x+b.y),2.4);
    g.save();path(g,p);g.clip();
    if(loaded){const crop=roofCrops[type];g.drawImage(source,...crop,b.x,b.y,b.w,b.h);}
    else{g.fillStyle=material(g,type);g.fillRect(b.x,b.y,b.w,b.h);g.fillStyle=material(g,'ochre');g.fillRect(b.x+b.w*.76,b.y,b.w*.24,b.h);}
    g.restore();g.save();path(g,p);g.strokeStyle='#f0e3c8';g.lineWidth=2;g.stroke();g.restore();
    box(g,door.x-12,door.y-2,24,9,'slate');
    // Small roof-mounted paper plaques identify the place without inventing tasks.
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
    // A top-down hull and paper deck, not a new isometric ship illustration.
    piece(g,[[0,-62],[18,-36],[23,18],[13,48],[0,62],[-13,48],[-23,18],[-18,-36]],'slate',{shadow:true,edge:true});
    piece(g,[[0,-49],[13,-27],[16,19],[8,42],[0,50],[-8,42],[-16,19],[-13,-27]],'olive');
    for(let y=-22;y<30;y+=23)box(g,-15,y,30,6,'ochre');g.restore();
  }
  function harbor(g,r){
    const q=r.map.get(r.harbor);
    if(r.id==='main'){
      // Retain the existing endpoint. The planks make its link to the old pier visible.
      box(g,q.x-29,q.y-8,58,104,'olive',{shadow:true});
      box(g,1375,1190,235,42,'olive',{shadow:true});
      for(let x=1382;x<1605;x+=18)box(g,x,1193,12,35,'ochre');
      for(let x=1400;x<1590;x+=55)box(g,x,1230,14,45,'slate');
      boat(g,1646,1338,1.14);
    }else{
      box(g,q.x-24,q.y+8,48,100,'olive',{shadow:true});
      for(let y=q.y+15;y<q.y+95;y+=16)box(g,q.x-20,y,40,8,'ochre');
      // A berth marker; no island terrain or travel node is changed.
      box(g,q.x-40,q.y+100,80,16,'olive',{shadow:true});
    }
  }
  function drawRegion(r){
    const c=make(r.w,r.h),g=c.getContext('2d');
    g.fillStyle=material(g,r.island?'water':'ground');g.fillRect(0,0,r.w,r.h);
    if(r.island)piece(g,r.island,r.id==='colony'?'sand':'ground',{edge:true});
    else for(const p of r.water)piece(g,p,'water',{edge:true});
    window.UPPDRAG_WORLD_GROWTH?.paintFields?.(g,r);
    for(const e of r.edges)road(g,r.map.get(e.a),r.map.get(e.b),e.w);
    for(const p of r.plazas){g.beginPath();g.arc(p.x,p.y,p.r,0,Math.PI*2);g.fillStyle=material(g,'paper');g.fill();}
    for(const b of r.bridges){box(g,b.x,b.y,b.w,b.h,'olive',{shadow:true});
      for(let x=b.x+6;x<b.x+b.w-7;x+=19)box(g,x,b.y+6,12,b.h-12,'ochre');
      box(g,b.x,b.y,b.w,5,'slate');box(g,b.x,b.y+b.h-5,b.w,5,'slate');}
    for(const b of r.buildings)drawBuilding(g,b,r);
    window.UPPDRAG_WORLD_GROWTH?.paintBuildings?.(g,r);
    // No prop is put over a graph edge or a building entrance.
    for(let i=0;i<(r.id==='main'?65:26);i++){
      const x=70+(i*173)%(r.w-140),y=70+(i*229)%(r.h-140);
      if(clearDecoration(r,x,y,46))tree(g,x,y,r.id==='colony');
    }
    harbor(g,r);
    const buildingNodes=new Set(r.buildings.map(b=>b.entry));
    for(const l of r.labels)if(!buildingNodes.has(l.node)){const n=r.map.get(l.node);label(g,l.t,n.x,n.y-45);}
    for(const b of r.buildings){const n=r.map.get(b.entry);label(g,b.name,n.x,n.y-22);}
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
  return {drawRegion,ready,get originalLoaded(){return loaded;},sourcePath:'../world/assets/town.webp'};
})();
