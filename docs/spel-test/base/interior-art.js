/* Demo 3.4.2: cafe fixtures and seating share the doorway scale and floor.
 * Furniture geometry: docs/world/render.mjs (drawPress, material, room).
 * Paper samples: docs/world/assets/town.webp. No navigation or progression here.
 */
'use strict';
window.UPPDRAG_ROOM_ART = (() => {
  const names = {cafe:'Kaffehuset',print:'Tryckeriet',archive:'Arkivet'};
  const samples = new Map(), patterns = new WeakMap();
  const source=document.createElement('canvas');source.width=1280;source.height=720;
  let originalLoaded=false;
  const colors={wall:'#d9cbb1',floor:'#a89574',wood:'#816347',dark:'#604c38',paper:'#eee0c2',green:'#7e8b72',slate:'#595d55',ink:'#393431',glass:'#b6c3b0',red:'#975d49'};
  function tile(name){
    if(samples.has(name))return samples.get(name);
    const c=document.createElement('canvas');c.width=116;c.height=152;const g=c.getContext('2d');
    g.fillStyle=colors[name]||colors.paper;g.fillRect(0,0,c.width,c.height);
    if(originalLoaded){
      g.save();g.globalCompositeOperation='multiply';g.globalAlpha=.58;
      g.drawImage(source,438,20,58,152,0,0,58,152);g.translate(116,0);g.scale(-1,1);g.drawImage(source,438,20,58,152,0,0,58,152);g.restore();
    } else {
      let v=19;g.globalAlpha=.09;
      for(let i=0;i<850;i++){v=(Math.imul(v,1664525)+1013904223)>>>0;const x=v%116;v=(Math.imul(v,1664525)+1013904223)>>>0;g.fillStyle=i%2?'#fff9e5':'#493b2b';g.fillRect(x,v%152,1+i%2,1);}
    }
    samples.set(name,c);return c;
  }
  function mat(g,name){let cache=patterns.get(g);if(!cache){cache=new Map();patterns.set(g,cache);}const key=name+(originalLoaded?'-original':'-fallback');if(!cache.has(key))cache.set(key,g.createPattern(tile(name),'repeat'));return cache.get(key);}
  function poly(g,pts,name,shadow=true){g.save();g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();if(shadow){g.shadowColor='#40311e40';g.shadowOffsetX=2;g.shadowOffsetY=4;g.shadowBlur=1;}g.fillStyle=mat(g,name);g.fill();g.shadowColor='transparent';g.strokeStyle='#f4e7ca65';g.lineWidth=1.2;g.stroke();g.restore();}
  // Retains the uneven cut-paper silhouette used by the original rooms.
  function cut(g,x,y,w,h,name,shadow=true){poly(g,[[x+1,y+2],[x+w*.3,y],[x+w*.65,y+1],[x+w-1,y],[x+w,y+h*.43],[x+w-2,y+h],[x+w*.6,y+h-1],[x+w*.3,y+h],[x,y+h-2],[x+1,y+h*.55]],name,shadow);}
  function oval(g,x,y,rx,ry,name){g.save();g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=mat(g,name);g.fill();g.restore();}
  function place(g,x,y,s,fn){g.save();g.translate(x,y);g.scale(s,s);fn(g);g.restore();}
  function lines(g,x,y,w,n,spacing=15){g.save();g.strokeStyle='#806d5099';g.lineWidth=2;for(let i=0;i<n;i++){g.beginPath();g.moveTo(x,y+i*spacing);g.lineTo(x+w-(i%3)*w*.16,y+i*spacing);g.stroke();}g.restore();}
  function cup(g,x,y,s=1){place(g,x,y,s,g=>{oval(g,0,21,37,10,'paper');g.strokeStyle='#e8dabd';g.lineWidth=8;g.beginPath();g.arc(24,-3,12,-1.6,1.6);g.stroke();cut(g,-22,-23,44,42,'paper');oval(g,0,-22,22,8,'paper');oval(g,0,-22,16,5,'dark');});}
  function material(g,id,x,y,s=1){place(g,x,y,s,g=>{if(id==='ink'){oval(g,0,0,24,8,'ink');cut(g,-21,-41,42,42,'ink');cut(g,-12,-53,24,13,'dark');}else if(id==='paper'){for(let i=0;i<4;i++)cut(g,-40+i*2,-25-i*4,80,6,'paper');}else{cut(g,-40,-35,80,36,'wood');for(let a=0;a<5;a++)for(let b=0;b<2;b++)cut(g,-34+a*14,-30+b*13,9,9,'slate',false);}});}
  function table(g,x,y,w,h){cut(g,x+18,y+27,23,h-25,'dark');cut(g,x+w-44,y+27,23,h-25,'dark');cut(g,x,y,w,32,'wood');poly(g,[[x-9,y],[x+18,y-30],[x+w-15,y-30],[x+w+8,y]],'wood');}
  function chair(g,x,y,s=1){place(g,x,y,s,g=>{cut(g,0,-83,68,76,'dark');cut(g,8,-75,52,18,'wood');cut(g,0,-5,72,17,'wood');cut(g,5,12,12,72,'dark');cut(g,55,12,12,72,'dark');});}
  function windowPane(g,x,y,w,h){cut(g,x,y,w,h,'slate');cut(g,x+12,y+12,w-24,h-24,'glass',false);cut(g,x+w*.47,y+12,12,h-24,'slate');cut(g,x+12,y+h*.48,w-24,12,'slate');cut(g,x-9,y+h,w+18,14,'paper');}
  function noticeBoard(g,x,y,w,h){cut(g,x,y,w,h,'dark');cut(g,x+9,y+9,w-18,h-18,'wood');[[.1,.12,.34,.63],[.52,.13,.34,.32],[.53,.57,.34,.26]].forEach(([a,b,c,d],i)=>{cut(g,x+w*a,y+h*b,w*c,h*d,'paper');lines(g,x+w*a+10,y+h*b+22,w*c-20,i?2:4,14);oval(g,x+w*(a+c/2),y+h*b+5,3,3,'slate');});}
  function press(g){
    // Unchanged silhouette of the original hand press, at local origin.
    cut(g,16,15,36,495,'dark');cut(g,272,15,36,495,'dark');cut(g,0,0,325,55,'wood');
    cut(g,140,20,35,240,'dark');g.save();g.strokeStyle='#ba9d6f';g.lineWidth=4;for(let y=35;y<250;y+=18){g.beginPath();g.moveTo(138,y);g.lineTo(178,y+12);g.stroke();}g.restore();
    cut(g,66,256,220,28,'wood');cut(g,0,350,330,35,'wood');cut(g,36,385,24,118,'dark');cut(g,274,385,24,118,'dark');cut(g,118,124,238,17,'dark');
    cut(g,83,327,154,17,'paper');lines(g,111,335,96,1);cut(g,121,335,18,7,'ink',false);
  }
  function bookcase(g,x,y,w,h){
    cut(g,x,y,w,h,'dark');cut(g,x+10,y+10,w-20,h-20,'wood',false);
    const rowH=(h-25)/3;
    for(let j=0;j<3;j++){
      const top=y+16+j*rowH;for(let k=0;k<Math.floor((w-26)/31);k++){const bh=rowH-28-((k*17+j*9)%22);const xx=x+18+k*31;cut(g,xx,top+rowH-17-bh,22+(k%2)*4,bh,['red','green','paper','slate'][((j*2)+k)%4]);if(k%3===0)cut(g,xx+4,top+rowH-39,14,9,'paper',false);}
      cut(g,x+5,top+rowH-14,w-10,12,'dark');
    }
  }
  function openBook(g,x,y,w){poly(g,[[x,y+3],[x+w*.47,y+12],[x+w*.5,y+110],[x-6,y+100]],'paper');poly(g,[[x+w*.47,y+12],[x+w,y],[x+w+7,y+100],[x+w*.5,y+110]],'paper');lines(g,x+13,y+30,w*.31,4,17);lines(g,x+w*.59,y+27,w*.31,4,17);}
  function scroll(g,x,y,s=1){place(g,x,y,s,g=>{cut(g,-3,0,119,65,'paper');oval(g,0,32,11,32,'paper');oval(g,116,32,11,32,'paper');lines(g,23,17,60,3,13);cut(g,52,-4,8,73,'red');});}
  function quill(g,x,y){poly(g,[[x,y],[x+35,y-90],[x+55,y-103],[x+49,y-67]],'paper');g.save();g.strokeStyle='#817053';g.lineWidth=2;g.beginPath();g.moveTo(x,y+14);g.lineTo(x+43,y-87);g.stroke();g.restore();}
  function door(g,x,y,w,h){cut(g,x,y,w,h,'dark');cut(g,x+8,y+7,w-16,h-7,'wood');for(let i=1;i<5;i++)cut(g,x+8+i*(w-16)/5,y+9,2,h-12,'dark',false);cut(g,x-10,y+h,w+20,15,'paper');oval(g,x+w-25,y+h*.55,5,5,'paper');}
  function groundShadow(g,x,y,rx){
    g.save();g.fillStyle='#4f402926';g.beginPath();g.ellipse(x,y,rx,8,0,0,Math.PI*2);g.fill();g.restore();
  }
  function flatBook(g,x,y,w){g.save();g.translate(x,y);g.scale(1,.30);openBook(g,0,0,w);g.restore();}
  // Side chairs face into the table. All dimensions belong to one furniture
  // group: seat below the tabletop, backs above it, feet on the same floor.
  function diningChair(g,x,feet,towardsRight){
    g.save();g.translate(x,feet);if(!towardsRight)g.scale(-1,1);
    groundShadow(g,43,3,54);
    cut(g,8,-98,14,98,'dark');cut(g,74,-101,14,101,'dark');
    cut(g,12,-36,70,8,'wood');
    poly(g,[[2,-214],[40,-221],[44,-104],[5,-96]],'dark');
    cut(g,8,-207,28,14,'wood');cut(g,10,-143,26,12,'wood');
    cut(g,11,-188,7,41,'wood');cut(g,28,-190,7,43,'wood');
    poly(g,[[4,-109],[77,-120],[94,-101],[21,-91]],'wood');
    cut(g,20,-100,74,13,'wood');
    g.restore();
  }
  function cafeFurnishings(g,tall,floor){
    // The window is beside the door, not above it. The noticeboard is below
    // the window lintel and within the same standing person's viewing height.
    if(tall){
      windowPane(g,276,floor-349,178,204);
      noticeBoard(g,491,floor-302,179,172);
    }else{
      windowPane(g,337,floor-348,230,210);
      noticeBoard(g,705,floor-300,264,172);
    }
    // Keep the scale of chairs/cups/table together across orientations.
    const anchor=tall?{x:0,y:0,s:1}:{x:140,y:-515,s:1.25};
    place(g,anchor.x,anchor.y,anchor.s,()=>{
      diningChair(g,197,940,true);
      diningChair(g,680,940,false);
      groundShadow(g,441,974,163);
      table(g,294,817,292,154);
      cup(g,360,773,.62);cup(g,520,775,.56);
      cut(g,415,792,78,8,'paper');cut(g,416,785,75,8,'paper');
    });
  }
  function scene(g,id,w,h){
    const tall=w/h<1.02,D=tall?{w:720,h:1040}:{w:1280,h:720};
    const scale=Math.min(w/D.w,h/D.h),ox=(w-D.w*scale)/2,oy=(h-D.h*scale)/2;
    // A single shared wall/floor junction, also used for the door threshold.
    // Extend the same materials into letterboxing instead of drawing a second floor.
    const floor=id==='cafe'?(tall?620:440):(tall?650:500),screenFloor=oy+floor*scale;
    g.fillStyle=mat(g,'wall');g.fillRect(0,0,w,h);
    g.fillStyle=mat(g,'floor');g.fillRect(0,screenFloor,w,h-screenFloor);
    g.save();g.translate(ox,oy);g.scale(scale,scale);
    const left=-ox/scale,right=(w-ox)/scale,bottom=(h-oy)/scale;
    cut(g,left,floor-8,right-left,10,'wood',false);
    let gap=30;for(let y=floor+gap;y<bottom;y+=gap){
      g.save();g.strokeStyle='#78644544';g.lineWidth=1.5;
      g.beginPath();g.moveTo(left,y);g.lineTo(right,y);g.stroke();g.restore();gap+=12;
    }
    cut(g,left,33,right-left,14,'wood',false);
    // The door is in the back wall: its bottom meets the floor, not the foreground.
    const exit=id==='cafe'?(tall?{x:56,y:floor-350,w:156,h:350}:{x:92,y:floor-350,w:156,h:350}):(tall?{x:48,y:320,w:132,h:330}:{x:60,y:170,w:145,h:330});
    door(g,exit.x,exit.y,exit.w,exit.h);
    if(id==='print'){
      // Retain the original press shape and materials. Its feet are below the
      // wall/floor junction; a single workbench sits in front, not in a second room.
      if(tall){
        const pressScale=.94,feet=floor+90;
        groundShadow(g,492,feet+3,151);
        place(g,335,feet-510*pressScale,pressScale,press);
        groundShadow(g,450,975,203);
        table(g,243,808,411,164);
        material(g,'paper',323,807,1.0);
        material(g,'type',448,796,1.0);
        material(g,'ink',571,789,.92);
      }else{
        const pressScale=1.04,feet=floor+143;
        groundShadow(g,935,feet+3,171);
        place(g,775,feet-510*pressScale,pressScale,press);
        groundShadow(g,531,654,180);
        table(g,354,482,361,169);
        material(g,'paper',421,483,.95);
        material(g,'type',535,470,1.0);
        material(g,'ink',649,465,.95);
      }
    }else if(id==='cafe'){
      cafeFurnishings(g,tall,floor);
    }else{
      if(tall){
        // Bookcases stand on the same floor as the press and the cafe furniture.
        bookcase(g,238,177,196,482);bookcase(g,464,177,199,482);
        groundShadow(g,446,983,208);
        table(g,236,789,427,190);flatBook(g,286,757,227);
        material(g,'ink',592,771,.70);quill(g,592,727);

      }else{
        bookcase(g,264,175,251,331);bookcase(g,918,175,280,331);
        groundShadow(g,704,654,165);
        table(g,539,490,332,161);flatBook(g,575,456,184);
        material(g,'ink',810,472,.70);quill(g,810,428);

      }
    }
    // These are visitable environments, not new tasks or NPC interactions.
    g.restore();
    return {x:ox+exit.x*scale,y:oy+exit.y*scale,w:exit.w*scale,h:(exit.h+15)*scale};
  }
  function render(canvas,id){
    if(!names[id])throw new Error('Okänd interiör');
    const r=canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);
    if(!r.width||!r.height)return null;
    const width=Math.round(r.width*d),height=Math.round(r.height*d);if(canvas.width!==width)canvas.width=width;if(canvas.height!==height)canvas.height=height;
    const g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,r.width,r.height);return scene(g,id,r.width,r.height);
  }
  let resolve;const ready=new Promise(r=>resolve=r),img=new Image();
  img.onload=()=>{source.getContext('2d').drawImage(img,0,0,1280,720);originalLoaded=true;samples.clear();resolve(true);window.dispatchEvent(new Event('uppdrag-room-material-ready'));};
  img.onerror=()=>resolve(false);img.src=new URL('../world/assets/town.webp',document.baseURI).href;
  return {names,render,ready,get originalLoaded(){return originalLoaded;}};
})();
