/* Demo 3.6.1: desktop-first harbour, one scene and a portrait camera crop.
 * Original docs/world/assets/quay.webp; no navigation or voyage changes.
 * Island skylines are stylised scenery, not historical reconstructions.
 */
'use strict';
window.UPPDRAG_HARBOUR_ART = (() => {
  const source=document.createElement('canvas');source.width=1280;source.height=720;
  const samples=new Map(),patterns=new WeakMap();let loaded=false,boat=null;
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
    g.fillStyle=material(g,name);g.fill();g.shadowColor='transparent';g.strokeStyle='#eee0c28a';g.lineWidth=1.5;g.stroke();g.restore();}
  function box(g,x,y,w,h,name,shadow=false){poly(g,[[x,y+1],[x+w*.46,y-1],[x+w,y+2],[x+w-1,y+h],[x+w*.43,y+h-1],[x,y+h]],name,shadow);}
  function stroke(g,pts,color,width){g.save();g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();g.restore();}
  function crate(g,x,feet,w,h){box(g,x+5,feet-h+6,w,h,'dark');box(g,x,feet-h,w,h,'wood',true);
    for(let i=1;i<5;i++)stroke(g,[[x+i*w/5,feet-h+3],[x+i*w/5,feet-3]],'#4f40376b',2);
    box(g,x+3,feet-h+10,w-6,8,'paper');box(g,x+3,feet-18,w-6,8,'paper');}
  function barrel(g,x,feet,s=1){g.save();g.translate(x,feet);g.scale(s,s);poly(g,[[-30,-125],[30,-125],[42,-95],[42,-25],[30,0],[-30,0],[-42,-25],[-42,-95]],'wood',true);
    box(g,-40,-95,80,11,'dark');box(g,-40,-30,80,11,'dark');poly(g,[[-30,-125],[-20,-132],[23,-131],[30,-125],[22,-119],[-23,-119]],'dark');g.restore();}
  function palm(g,x,foot,s){g.save();g.translate(x,foot);g.scale(s,s);poly(g,[[-5,0],[2,-140],[13,-146],[5,0]],'wood');
    for(const pts of [[[-1,-140],[-44,-170],[-79,-157],[-22,-153]],[[2,-141],[-27,-197],[-56,-197],[-15,-158]],[[6,-140],[50,-179],[83,-161],[24,-153]],[[8,-140],[46,-136],[63,-103],[19,-128]]])poly(g,pts,'green');g.restore();}
  function makeBoat(){boat=document.createElement('canvas');boat.width=292;boat.height=249;const g=boat.getContext('2d');
    g.translate(-939,-190);g.beginPath();const pieces=[
      [[945,366],[975,375],[1012,389],[1058,398],[1110,398],[1140,391],[1224,387],[1213,411],[1202,431],[1164,435],[1128,431],[1090,433],[1055,430],[1020,433],[991,431],[982,413],[975,395]],
      [[1091,211],[1087,248],[1080,292],[1088,373],[1052,372],[1019,373],[982,370],[962,366],[989,336],[1025,291],[1062,245]],
      [[1107,247],[1130,286],[1172,340],[1200,381],[1161,378],[1127,383],[1106,384]],
      [[1095,193],[1103,194],[1104,242],[1102,291],[1104,343],[1103,400],[1096,400]],
      [[1104,205],[1128,211],[1158,216],[1153,226],[1161,238],[1132,234],[1104,228]]
    ];for(const pts of pieces){pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();}g.clip();g.drawImage(source,0,0);}
  function ship(g,x,foot,w){const h=w*249/292;if(boat)g.drawImage(boat,x,foot-h,w,h);
    else{poly(g,[[x,foot-49],[x+w,foot-49],[x+w*.88,foot],[x+w*.14,foot]],'wood',true);
      box(g,x+w*.55,foot-h,7,h-31,'wood');poly(g,[[x+w*.55,foot-h+18],[x+w*.1,foot-68],[x+w*.52,foot-61]],'paper');
      poly(g,[[x+w*.58,foot-h+54],[x+w*.9,foot-64],[x+w*.58,foot-61]],'paper');}}
  // One composition in world coordinates. A narrow screen changes only the
  // camera, never the size/position of an individual building, ship or prop.
  const SCENE=Object.freeze({w:1280,h:720,coreWidth:520,focusX:1000});
  const VESSEL=Object.freeze({x:939,y:190,w:292,h:249});
  const EXIT=Object.freeze({x:774,y:658,w:97,h:55});
  const sceneLayers=new Map();
  function project(width,height){
    const scale=Math.min(Math.max(width/SCENE.w,height/SCENE.h),
      width/SCENE.coreWidth,height/560);
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
    if(loaded)g.drawImage(source,0,0,SCENE.w,SCENE.h);
    else{
      poly(g,[[0,503],[0,130],[114,69],[247,139],[292,299],[292,503]],'red',true);
      box(g,32,258,166,245,'dark');ship(g,VESSEL.x,VESSEL.y+VESSEL.h,VESSEL.w);
    }
    skyline(g,id,300,1280);
    if(id==='colony'){
      poly(g,[[0,503],[0,130],[114,69],[247,139],[292,299],[292,503]],'paper',true);
      box(g,32,258,166,245,'dark');box(g,221,319,30,71,'green');
    }
    // Fixed world-space boarding point. The same gangway and click target
    // remain visible in portrait, landscape and desktop compositions.
    poly(g,[[979,588],[1020,588],[1090,399],[1064,398]],'wood',true);
    stroke(g,[[990,575],[1071,414]],'#cbb895',2);
    stroke(g,[[1009,575],[1081,414]],'#4f4037',2);
    stroke(g,[[982,582],[1016,582]],'#504532',2);
    crate(g,870,661,89,73);box(g,882,576,68,14,'paper',true);
    stroke(g,[[892,582],[936,582]],'#857251',2);
    const x=EXIT.x,y=EXIT.y;
    poly(g,[[x+88,y+19],[x+31,y+19],[x+31,y+8],[x+7,y+29],
      [x+31,y+49],[x+31,y+37],[x+88,y+37]],'paper');
    sceneLayers.set(key,c);return c;
  }
  function render(canvas,id){
    const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return null;
    const d=Math.min(window.devicePixelRatio||1,2);
    const W=Math.round(r.width*d),H=Math.round(r.height*d);
    if(canvas.width!==W)canvas.width=W;if(canvas.height!==H)canvas.height=H;
    const g=canvas.getContext('2d'),p=project(r.width,r.height);
    g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,r.width,r.height);
    g.save();g.translate(p.x,p.y);g.scale(p.scale,p.scale);
    // Extremely short landscape viewports get quiet paper side margins,
    // not mirrored houses/ships or fabricated extensions of the coastline.
    g.fillStyle=material(g,'ground');
    g.fillRect(p.left,-720,p.right-p.left,2160);
    g.save();g.beginPath();g.rect(0,-720,SCENE.w,2160);g.clip();
    paintSurroundings(g,0,SCENE.w);g.drawImage(scene(id),0,0);
    g.restore();g.restore();
    const rect=b=>({x:p.x+b.x*p.scale,y:p.y+b.y*p.scale,w:b.w*p.scale,h:b.h*p.scale});
    // Small portraits may not show decorative warehouses; required controls
    // and boarding remain in the core and all travel buttons stay in the DOM.
    return {exit:rect(EXIT),ship:rect(VESSEL)};
  }
  let settled=false,resolve;const ready=new Promise(r=>resolve=r);
  function done(ok){if(settled)return;settled=true;resolve(ok);}
  const img=new Image();img.onload=()=>{try{source.getContext('2d').drawImage(img,0,0,1280,720);loaded=true;samples.clear();makeBoat();done(true);window.dispatchEvent(new Event('uppdrag-harbour-ready'));}catch(e){done(false);}};
  img.onerror=()=>done(false);img.src=new URL('../world/assets/quay.webp',document.baseURI).href;setTimeout(()=>done(loaded),8000);
  return {render,ready,project,get loaded(){return loaded;},sourcePath:'../world/assets/quay.webp'};
})();
