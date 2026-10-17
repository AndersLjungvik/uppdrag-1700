/* Demo 3.6: outdoor waterfronts, not interiors. Material and sailing vessel
 * are sampled from the original docs/world/assets/quay.webp. No game state.
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
  function render(canvas,id){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return null;
    const d=Math.min(window.devicePixelRatio||1,2),W=Math.round(r.width*d),H=Math.round(r.height*d);
    if(canvas.width!==W)canvas.width=W;if(canvas.height!==H)canvas.height=H;
    const g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);
    const tall=r.width/r.height<1.02,D=tall?{w:720,h:1040}:{w:1280,h:720};
    const s=Math.min(r.width/D.w,r.height/D.h),ox=(r.width-D.w*s)/2,oy=(r.height-D.h*s)/2;
    const horizon=tall?456:299,edge=tall?718:526,front=edge+52;
    // Extend sky/ground beyond the composition without cropping the vessel.
    g.fillStyle=material(g,'sky');g.fillRect(0,0,r.width,r.height);
    g.fillStyle=material(g,'ground');g.fillRect(0,oy+front*s,r.width,r.height-oy-front*s);
    g.save();g.translate(ox,oy);g.scale(s,s);const left=-ox/s,right=(r.width-ox)/s,bottom=(r.height-oy)/s;
    if(id==='marstrand'){
      poly(g,[[left,horizon],[D.w*.24,horizon-24],[D.w*.56,horizon-85],[D.w*.91,horizon-19],[right,horizon]],'green');
      const x=D.w*.47,y=horizon-140;box(g,x,y+29,131,54,'stone');box(g,x+30,y,67,40,'stone');
      for(let n=0;n<4;n++)box(g,x+11+n*29,y+42,9,17,'dark');
    }else if(id==='colony'){
      poly(g,[[left,horizon],[D.w*.22,horizon-21],[D.w*.54,horizon-41],[right,horizon-13],[right,horizon+3]],'green');
      const x=tall?225:427;box(g,x,horizon-65,180,61,'paper');poly(g,[[x-7,horizon-65],[x+87,horizon-91],[x+189,horizon-63]],'red');
      for(let n=0;n<5;n++)box(g,x+14+n*33,horizon-44,13,26,'green');palm(g,tall?171:322,horizon, .75);palm(g,tall?673:1200,horizon,.9);
    }else{
      poly(g,[[left,horizon],[D.w*.52,horizon-9],[D.w*.81,horizon-34],[right,horizon-8],[right,horizon]],'green');
    }
    box(g,left,horizon,right-left,edge-horizon+7,'water');
    for(let i=0;i<9;i++){const x=230+(i*137)%(D.w-240),y=horizon+50+(i*47)%Math.max(50,edge-horizon-62);
      poly(g,[[x,y],[x+18,y-4],[x+36,y+1],[x+63,y-3],[x+45,y+5],[x+14,y+5]],'paper');}
    // Reuse the original red warehouse silhouette, separated from the harbour.
    const wh={x:tall?-11:0,y:edge-(tall?300:389),w:tall?209:279,h:tall?300:389};
    poly(g,[[wh.x,edge],[wh.x,wh.y+59],[wh.x+wh.w*.48,wh.y],[wh.x+wh.w,wh.y+58],[wh.x+wh.w-6,edge]],id==='colony'?'paper':'red',true);
    box(g,wh.x+wh.w*.23,wh.y+wh.h*.41,wh.w*.49,wh.h*.59,'dark');
    if(id==='colony'){box(g,wh.x+8,wh.y+85,24,65,'green');}
    const vessel={x:tall?337:791,w:tall?348:411,foot:edge-22};
    ship(g,vessel.x,vessel.foot,vessel.w);
    // One continuous stone quay in the foreground; the boarding plank reaches
    // the boat's deck, rather than putting the vessel or its mast on dry land.
    box(g,left,edge,right-left,front-edge,'stone',true);box(g,left,edge-4,right-left,14,'ground');
    for(let x=left+72;x<right;x+=105)stroke(g,[[x,edge+13],[x-5,front-1]],'#51473470',2);
    const plankX=tall?436:889;
    poly(g,[[plankX,front+18],[plankX+51,front+18],[vessel.x+vessel.w*.57,vessel.foot-30],[vessel.x+vessel.w*.43,vessel.foot-28]],'wood',true);
    for(const x of [tall?42:83,tall?664:1210]){box(g,x,edge-37,31,front-edge+34,'wood',true);
      box(g,x-5,edge-4,41,11,'paper');}
    stroke(g,[[vessel.x+vessel.w*.89,vessel.foot-36],[tall?680:1225,edge-4]],'#bdab87',3);
    barrel(g,tall?210:339,tall?885:646,tall?1.02:1);crate(g,tall?292:465,tall?946:658,tall?146:161,112);
    box(g,tall?312:486,tall?814:526,87,19,'paper',true);
    stroke(g,[[tall?324:496,tall?822:534],[tall?379:552,tall?822:534]],'#857251',2);
    // Back to the town is a path arrow on the quay, never an indoor door.
    const exit={x:31,y:tall?934:647,w:123,h:58};
    poly(g,[[exit.x+85,exit.y+19],[exit.x+30,exit.y+19],[exit.x+30,exit.y+7],[exit.x+4,exit.y+31],[exit.x+30,exit.y+51],[exit.x+30,exit.y+38],[exit.x+85,exit.y+38]],'paper');
    g.restore();const rect=p=>({x:ox+p.x*s,y:oy+p.y*s,w:p.w*s,h:p.h*s});
    return {exit:rect(exit),ship:rect({x:vessel.x,y:vessel.foot-vessel.w*249/292,w:vessel.w,h:vessel.w*249/292+18})};
  }
  let settled=false,resolve;const ready=new Promise(r=>resolve=r);
  function done(ok){if(settled)return;settled=true;resolve(ok);}
  const img=new Image();img.onload=()=>{try{source.getContext('2d').drawImage(img,0,0,1280,720);loaded=true;samples.clear();makeBoat();done(true);window.dispatchEvent(new Event('uppdrag-harbour-ready'));}catch(e){done(false);}};
  img.onerror=()=>done(false);img.src=new URL('../world/assets/quay.webp',document.baseURI).href;setTimeout(()=>done(loaded),8000);
  return {render,ready,get loaded(){return loaded;},sourcePath:'../world/assets/quay.webp'};
})();
