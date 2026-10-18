/* Demo 3.13: original harbour material with shared, broken inner paper edges.
 * Original paper materials and quay retained. No map or room data are changed.
 * Island skylines are stylised scenery, not historical reconstructions.
 */
'use strict';
window.UPPDRAG_HARBOUR_ART = (() => {
  const fibres=window.UPPDRAG_PAPER_FIBRES;
  if(!fibres)throw new Error('Pappersmaterialet måste laddas före hamnen.');
  const source=document.createElement('canvas');source.width=1280;source.height=720;
  const samples=new Map(),patterns=new WeakMap();let loaded=false;
  const crops={sky:[350,24,190,240],water:[345,383,130,30],ground:[400,595,180,110],
    stone:[319,532,80,24],paper:[1050,318,22,39],wood:[23,438,26,31],red:[55,170,80,55]};
  const colors={sky:'#829ba4',water:'#376f8b',ground:'#c9bba0',stone:'#96836b',
    paper:'#ece0c2',wood:'#806344',red:'#955443',green:'#657666',dark:'#514a3b'};
  function texture(name){if(samples.has(name))return samples.get(name);
    const c=document.createElement('canvas'),crop=crops[name];c.width=crop?crop[2]*2:96;c.height=crop?crop[3]*2:96;
    const g=c.getContext('2d');g.fillStyle=colors[name]||colors.wood;g.fillRect(0,0,c.width,c.height);
    if(loaded&&crop){for(let ix=0;ix<2;ix++)for(let iy=0;iy<2;iy++){
      g.save();g.translate(ix?c.width:0,iy?c.height:0);g.scale(ix?-1:1,iy?-1:1);
      g.drawImage(source,...crop,0,0,crop[2],crop[3]);g.restore();
    }}else if(loaded){g.save();g.globalCompositeOperation='multiply';g.globalAlpha=.35;g.drawImage(source,400,595,180,110,0,0,c.width,c.height);g.restore();}else{let n=1760;g.globalAlpha=.12;for(let i=0;i<1250;i++){n=(Math.imul(n,1664525)+1013904223)>>>0;
      const x=n%c.width;n=(Math.imul(n,1664525)+1013904223)>>>0;g.fillStyle=i%2?'#efe3c8':'#493f32';g.fillRect(x,n%c.height,1,2);}}
    samples.set(name,c);return c;}
  function material(g,name){let cache=patterns.get(g);if(!cache){cache=new Map();patterns.set(g,cache);}
    const key=name+(loaded?'1':'0');if(!cache.has(key))cache.set(key,g.createPattern(texture(name),'repeat'));return cache.get(key);}
  function poly(g,pts,name,shadow=false){g.save();g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
    if(shadow){g.shadowColor='#352b2438';g.shadowOffsetY=3;g.shadowOffsetX=2;}
    g.fillStyle=material(g,name);g.fill();g.shadowColor='transparent';const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);fibres.finish(g,{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)},{kind:name,edge:1});g.restore();}
  function box(g,x,y,w,h,name,shadow=false){poly(g,[[x,y+1],[x+w*.46,y-1],[x+w,y+2],[x+w-1,y+h],[x+w*.43,y+h-1],[x,y+h]],name,shadow);}
  function stroke(g,pts,color,width){g.save();g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();g.restore();}
  function crate(g,x,feet,w,h){box(g,x+5,feet-h+6,w,h,'dark');box(g,x,feet-h,w,h,'wood',true);
    for(let i=1;i<5;i++)stroke(g,[[x+i*w/5,feet-h+3],[x+i*w/5,feet-3]],'#4f40376b',2);
    box(g,x+3,feet-h+10,w-6,8,'paper');box(g,x+3,feet-18,w-6,8,'paper');}
  function barrel(g,x,feet,s=1){g.save();g.translate(x,feet);g.scale(s,s);poly(g,[[-30,-125],[30,-125],[42,-95],[42,-25],[30,0],[-30,0],[-42,-25],[-42,-95]],'wood',true);
    box(g,-40,-95,80,11,'dark');box(g,-40,-30,80,11,'dark');poly(g,[[-30,-125],[-20,-132],[23,-131],[30,-125],[22,-119],[-23,-119]],'dark');g.restore();}
  function palm(g,x,foot,s){g.save();g.translate(x,foot);g.scale(s,s);poly(g,[[-5,0],[2,-140],[13,-146],[5,0]],'wood');
    for(const pts of [[[-1,-140],[-44,-170],[-79,-157],[-22,-153]],[[2,-141],[-27,-197],[-56,-197],[-15,-158]],[[6,-140],[50,-179],[83,-161],[24,-153]],[[8,-140],[46,-136],[63,-103],[19,-128]]])poly(g,pts,'green');g.restore();}
  // A stylised cargo vessel, not an exact reconstruction of a named ship.
  // All pieces share world coordinates; portrait mode never rearranges them.
  const eased=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  function drawMerchant(g,pose={}){
    const x=pose.x??565,y=pose.y??67,k=pose.scale??1;
    const cloth=pose.cloth??.16;
    g.save();g.translate(x,y);g.scale(k,k);
    // Rigging behind the three masts and sails.
    for(const [mx,top,base] of [[178,70,323],[338,13,331],[500,77,322]]){
      stroke(g,[[mx,top],[mx-58,base]],'#625545',2);
      stroke(g,[[mx,top],[mx+53,base]],'#625545',2);
      for(let n=0;n<8;n++){const yy=top+80+n*21,t=(yy-top)/(base-top);
        stroke(g,[[mx-58*t,yy],[mx+53*t,yy]],'#6d5d49',1);}
      box(g,mx-5,top,10,base-top+3,'wood',true);
    }
    stroke(g,[[25,279],[178,70],[338,13],[500,77],[673,249]],'#6e5d47',2);
    const sails=[[178,101,117,43],[178,162,151,59],[178,238,182,58],
      [338,50,114,40],[338,109,164,65],[338,196,210,86],
      [500,113,105,39],[500,172,134,49],[500,235,163,54]];
    for(const [mx,yy,ww,hh] of sails){
      const drop=9+(hh-9)*cloth;
      poly(g,[[mx-ww/2,yy+5],[mx+ww/2,yy+5],[mx+ww/2-6,yy+drop],
        [mx+12,yy+drop+5*cloth],[mx-ww/2+7,yy+drop-1]],'paper',true);
      stroke(g,[[mx-ww/2-6,yy],[mx+ww/2+6,yy]],'#6f553e',5);
      for(let i=1;i<4;i++)stroke(g,[[mx-ww/2+ww*i/4,yy+7],
        [mx-ww/2+ww*i/4+2,yy+drop-2]],'#ab916855',.9);
    }
    // Raised stern, deckhouse and cargo hatch establish the ship's scale.
    box(g,28,273,113,61,'dark',true);box(g,36,276,99,11,'wood');
    for(let i=0;i<4;i++){box(g,44+i*21,293,13,20,'paper');
      stroke(g,[[50+i*21,294],[50+i*21,311]],'#7c6847',2);}
    poly(g,[[12,311],[108,323],[223,332],[416,331],[553,315],[639,294],
      [620,357],[580,400],[530,417],[153,417],[88,398],[45,365]],'wood',true);
    poly(g,[[45,365],[93,386],[170,403],[532,401],[595,377],[580,400],
      [530,417],[153,417],[88,398]],'dark');
    stroke(g,[[16,314],[107,328],[224,338],[416,337],[554,321],[636,301]],'#c0a070',6);
    for(const yy of [350,367,385])stroke(g,[[68,yy-10],[170,yy],[533,yy],[600,yy-16]],'#4b392858',2);
    stroke(g,[[619,302],[674,248]],'#816448',8);
    box(g,270,313,81,18,'dark',true);
    for(let i=0;i<5;i++)stroke(g,[[278+i*14,315],[278+i*14,329]],'#b4986f',2);
    for(const xx of [196,400,422])barrel(g,xx,326,.20);
    box(g,107,298,6,26,'wood');box(g,564,290,6,28,'wood');
    stroke(g,[[111,298],[563,290]],'#ac8f65',3);
    // Small plain pennants keep the silhouette readable without inventing a flag.
    poly(g,[[344,18],[384,28],[344,35]],'red');
    poly(g,[[505,82],[535,91],[505,98]],'paper');
    stroke(g,[[80,424],[177,429],[533,429],[592,414]],'#ded8bd99',2);
    g.restore();
  }
  const vesselSprites=new Map();
  function merchant(g,pose={}){
    const level=Math.round((pose.cloth??.16)*16),key=(loaded?'paper-':'fallback-')+level;
    if(!vesselSprites.has(key)){
      const c=document.createElement('canvas');c.width=700;c.height=444;
      drawMerchant(c.getContext('2d'),{x:0,y:0,scale:1,cloth:level/16});vesselSprites.set(key,c);
    }
    const k=pose.scale??1;g.drawImage(vesselSprites.get(key),pose.x??565,pose.y??67,700*k,444*k);
  }
  function cleanBoat(g){
    if(!loaded)return;
    // Replace only the old little vessel with matching original sky/water.
    // A feathered mask avoids a rectangular pasted patch in the paper texture.
    const patch=document.createElement('canvas');patch.width=360;patch.height=300;
    const p=patch.getContext('2d');p.drawImage(source,510,160,360,300,0,0,360,300);
    const mask=document.createElement('canvas');mask.width=360;mask.height=300;
    const m=mask.getContext('2d');m.fillStyle='#fff';m.filter='blur(5px)';
    m.fillRect(4,18,326,267);
    p.globalCompositeOperation='destination-in';p.drawImage(mask,0,0);
    g.drawImage(patch,929,160);
  }
  // One composition in world coordinates. A narrow screen changes only the
  // camera, never the size/position of an individual building, ship or prop.
  const SCENE=Object.freeze({w:1280,h:720,coreWidth:520,focusX:1000});
  const VESSEL=Object.freeze({x:565,y:80,w:684,h:418});
  const EXIT=Object.freeze({x:774,y:658,w:97,h:55});
  const sceneLayers=new Map();
  function project(width,height){
    const scale=Math.min(Math.max(width/SCENE.w,height/SCENE.h),
      width/SCENE.coreWidth,height/680);
    const visibleWidth=width/scale;
    const center=visibleWidth>=SCENE.w?SCENE.w/2:
      Math.max(visibleWidth/2,Math.min(SCENE.focusX,SCENE.w-visibleWidth/2));
    const visibleHeight=height/scale;
    const centerY=visibleHeight>=SCENE.h?SCENE.h/2:
      Math.min(446,SCENE.h-visibleHeight/2);
    return {scale,x:width/2-center*scale,y:height/2-centerY*scale,
      left:center-visibleWidth/2,right:center+visibleWidth/2};
  }
  function skyline(g,id,left,right){
    if(id==='marstrand'){
      poly(g,[[left,377],[430,373],[610,333],[820,346],[1050,371],[right,377]],'green');
      box(g,556,303,172,52,'stone');box(g,613,270,64,43,'stone');
      for(let i=0;i<5;i++)box(g,573+i*29,319,9,17,'dark');
    }else if(id==='colony'){
      poly(g,[[left,377],[360,372],[650,354],[940,361],[right,377]],'green');
      for(const x of [436,632,823]){
        box(g,x,324,155,48,'paper');
        poly(g,[[x-6,325],[x+72,301],[x+161,326]],'red');
        for(let n=0;n<4;n++)box(g,x+13+n*34,340,14,26,'green');
      }
      palm(g,393,377,.57);palm(g,1017,377,.56);
    }
  }
  function paintSurroundings(g,left,right){
    // Additional scenery is allowed outside the portrait crop. None of it
    // carries an exit, a clue, a travel action or any other required interaction.
    g.fillStyle=material(g,'sky');g.fillRect(left,-720,right-left,1440);
    g.fillStyle=material(g,'water');g.fillRect(left,377,right-left,166);
    g.fillStyle=material(g,'stone');g.fillRect(left,503,right-left,62);
    g.fillStyle=material(g,'ground');g.fillRect(left,565,right-left,1440);
  }

  function scene(id){
    const key=id+(loaded?'-original':'-fallback');
    if(sceneLayers.has(key))return sceneLayers.get(key);
    const c=document.createElement('canvas');c.width=SCENE.w;c.height=SCENE.h;
    const g=c.getContext('2d');paintSurroundings(g,0,SCENE.w);
    // The original wide artwork is the actual playable scene, not a thumbnail
    // squeezed into a portrait arrangement. Preserve its torn-paper edges.
    if(loaded){g.drawImage(source,0,0,SCENE.w,SCENE.h);cleanBoat(g);}
    else{
      poly(g,[[0,503],[0,130],[114,69],[247,139],[292,299],[292,503]],'red',true);
      box(g,32,258,166,245,'dark');
    }
    skyline(g,id,300,1280);
    if(id==='colony'){
      poly(g,[[0,503],[0,130],[114,69],[247,139],[292,299],[292,503]],'paper',true);
      box(g,32,258,166,245,'dark');box(g,221,319,30,71,'green');
    }
    crate(g,870,661,89,73);box(g,882,576,68,14,'paper',true);
    stroke(g,[[892,582],[936,582]],'#857251',2);
    const x=EXIT.x,y=EXIT.y;
    poly(g,[[x+88,y+19],[x+31,y+19],[x+31,y+8],[x+7,y+29],
      [x+31,y+49],[x+31,y+37],[x+88,y+37]],'paper');
    sceneLayers.set(key,c);return c;
  }
  function gangway(g,amount){
    if(amount<=0)return;g.save();g.globalAlpha=amount;
    poly(g,[[954,550],[988,560],[1060,401],[1033,397]],'wood',true);
    stroke(g,[[957,548],[1036,399]],'#d2bd93',3);
    stroke(g,[[985,555],[1056,402]],'#665039',3);
    for(let n=0;n<7;n++){const u=n/7;
      stroke(g,[[959+77*u,545-143*u],[984+70*u,550-146*u]],'#59442c',2);}
    stroke(g,[[617,388],[828,507]],'#bda57a',3);
    stroke(g,[[1184,382],[1218,503]],'#bda57a',3);g.restore();
  }
  function poseFor(frame){
    const p=Math.max(0,Math.min(1,frame.progress||0));
    if(frame.phase==='depart'){
      const u=eased((p-.18)/.82);
      return {x:565+1040*u,y:67-18*u,scale:1-.10*u,cloth:.16+.84*eased(p*2),dock:Math.max(0,1-p*6)};
    }
    if(frame.phase==='arrive'){
      const u=eased(p/.82);
      return {x:565-1280*(1-u),y:67-18*(1-u),scale:.90+.10*u,cloth:1-.84*eased((p-.55)/.35),dock:eased((p-.84)/.16)};
    }
    return {x:565,y:67,scale:1,cloth:.16,dock:1};
  }
  function render(canvas,id,frame={}){
    const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return null;
    const d=Math.min(window.devicePixelRatio||1,2),W=Math.round(r.width*d),H=Math.round(r.height*d);
    if(canvas.width!==W)canvas.width=W;if(canvas.height!==H)canvas.height=H;
    const g=canvas.getContext('2d'),p=project(r.width,r.height);
    g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,r.width,r.height);
    g.save();g.translate(p.x,p.y);g.scale(p.scale,p.scale);
    g.fillStyle=material(g,'ground');g.fillRect(p.left,-720,p.right-p.left,2160);
    g.save();g.beginPath();g.rect(0,-720,SCENE.w,2160);g.clip();
    if(frame.phase==='sea'){
      g.fillStyle=material(g,'sky');g.fillRect(0,-720,SCENE.w,1097);
      g.fillStyle=material(g,'water');g.fillRect(0,377,SCENE.w,1063);
      for(let i=0;i<15;i++){const x=(i*149-(frame.progress||0)*90+SCENE.w)%SCENE.w,y=431+(i*71)%269;
        stroke(g,[[x,y],[x+32,y-3],[x+58,y]],'#d9decb80',2);}
      merchant(g,{x:565+(frame.progress||0)*30,y:67,cloth:1});
    }else{
      const background=scene(id),pose=poseFor(frame);
      paintSurroundings(g,0,SCENE.w);g.drawImage(background,0,0);merchant(g,pose);
      // Warehouse and quay are closer to the camera than an arriving vessel.
      g.drawImage(background,0,0,300,503,0,0,300,503);
      g.drawImage(background,0,503,1280,217,0,503,1280,217);
      gangway(g,pose.dock);
    }
    g.restore();g.restore();
    const rect=b=>({x:p.x+b.x*p.scale,y:p.y+b.y*p.scale,w:b.w*p.scale,h:b.h*p.scale});
    return {exit:rect(EXIT),ship:rect(VESSEL)};
  }
  let settled=false,resolve;const ready=new Promise(r=>resolve=r);
  function done(ok){if(settled)return;settled=true;resolve(ok);}
  const img=new Image();img.onload=()=>{try{source.getContext('2d').drawImage(img,0,0,1280,720);loaded=true;samples.clear();sceneLayers.clear();done(true);window.dispatchEvent(new Event('uppdrag-harbour-ready'));}catch(e){done(false);}};
  img.onerror=()=>done(false);img.src=new URL('../world/assets/quay.webp',document.baseURI).href;setTimeout(()=>done(loaded),8000);
  window.addEventListener('uppdrag-paper-fibres-ready',()=>{sceneLayers.clear();vesselSprites.clear();window.dispatchEvent(new Event('uppdrag-harbour-ready'));});
  return {render,ready:Promise.all([ready,fibres.ready]).then(v=>v.every(Boolean)),project,poseFor,get loaded(){return loaded;},sourcePath:'../world/assets/quay.webp'};
})();

