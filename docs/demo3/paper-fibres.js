/* Demo 3.13: one real paper fibre for people, animals and room cut-outs.
 * Pigment and broken inner edges are sampled from the original town artwork.
 * This helper never builds a path, moves a point, adds a shadow or sets scale.
 */
'use strict';
window.UPPDRAG_PAPER_FIBRES = (() => {
  const sourcePath='../world/assets/town.webp';
  // A broad, unobstructed ground-paper sample avoids a small repeating motif.
  const crop={x:24,y:16,w:360,h:135}, width=crop.w*2,height=crop.h*2;
  const samples=new Map(),patterns=new WeakMap(),edgePatterns=new WeakMap();
  const roomKinds=new Set(['wall','floor','wood','dark','paper','green','slate','ink','glass','red']);
  const strengths={wall:2.2,floor:3.2,wood:4.7,dark:4,paper:3.5,green:4.5,slate:4,ink:2,glass:2.8,red:4.5,
    piece:6.6,cloth:6.6,skin:4.5,hair:4,detail:1.5};
  const skins=new Set(['#cda77b','#c8a377','#c9a57c','#c19a70','#c8a17b','#cea77a','#b99572']);
  const details=new Set(['#342c24','#594132','#352c24','#30271f']);
  let loaded=false,revision=0,luminance=null,mean=0,deviation=1,channels=[208,208,208],edgeTile=null;
  let settled=false,resolve;
  const ready=new Promise(r=>resolve=r);
  function done(ok){if(!settled){settled=true;resolve(ok);}}
  function kindFor(color){const value=String(color).toLowerCase();return skins.has(value)?'skin':details.has(value)?'detail':'piece';}
  function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  const swatch=canvas(1,1),swatchContext=swatch.getContext('2d');
  function rgba(color){
    swatchContext.clearRect(0,0,1,1);swatchContext.fillStyle='#000';
    swatchContext.fillStyle=color;swatchContext.fillRect(0,0,1,1);
    return swatchContext.getImageData(0,0,1,1).data;
  }
  function clamp(value,low,high){return Math.max(low,Math.min(high,value));}
  function tile(color,kind){
    const key=color+'|'+kind;if(samples.has(key))return samples.get(key);
    const c=canvas(width,height),g=c.getContext('2d'),pixels=g.createImageData(width,height),base=rgba(color);
    // Match the mean pigment of the existing multiply-based room material.
    // Figure and animal colours keep their existing, unmultiplied pigment.
    const room=roomKinds.has(kind),pigment=[0,1,2].map(i=>base[i]*(room ? .42+.58*channels[i]/255 : 1));
    const strength=strengths[kind]??strengths.piece;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const sx=x<crop.w?x:width-1-x,sy=y<crop.h?y:height-1-y;
      const fibre=clamp((luminance[sy*crop.w+sx]-mean)/deviation,-2.8,2.8)*strength;
      const i=(y*width+x)*4;
      for(let channel=0;channel<3;channel++)pixels.data[i+channel]=clamp(pigment[channel]+fibre,0,255);
      pixels.data[i+3]=base[3];
    }
    g.putImageData(pixels,0,0);samples.set(key,c);return c;
  }
  function material(ctx,color,kind=kindFor(color)){
    if(!loaded)return color;
    let cache=patterns.get(ctx);if(!cache){cache=new Map();patterns.set(ctx,cache);}
    const key=color+'|'+kind+'|'+revision;
    if(!cache.has(key))cache.set(key,ctx.createPattern(tile(color,kind),'repeat'));
    return cache.get(key)||color;
  }
  function edgeMaterial(ctx){
    let pattern=edgePatterns.get(ctx);
    if(!pattern){pattern=ctx.createPattern(edgeTile,'repeat');edgePatterns.set(ctx,pattern);}
    return pattern;
  }
  // Call immediately after filling the current path. Bounds are in the same
  // local coordinates as that path; edge is an optional intensity from 0 to 1.
  // The clip keeps fibres inside the existing silhouette, even under scaling.
  function finish(ctx,bounds,{kind='piece',edge=1}={}){
    if(!loaded||!bounds||kind==='detail'||edge<=0)return;
    const small=Math.min(Math.abs(bounds.w),Math.abs(bounds.h));
    if(small<6)return;
    const intensity=clamp(edge,0,1)*(kind==='skin' ? .63 : 1)*Math.min(1,small/18);
    ctx.save();ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
    ctx.clip();ctx.globalAlpha*=intensity;ctx.strokeStyle=edgeMaterial(ctx);
    ctx.lineWidth=kind==='skin'?1.6:2.2;ctx.lineJoin='bevel';ctx.setLineDash([]);ctx.stroke();ctx.restore();
  }
  const img=new Image();
  img.onload=()=>{
    try{
      const source=canvas(1280,720),g=source.getContext('2d');g.drawImage(img,0,0,1280,720);
      const data=g.getImageData(crop.x,crop.y,crop.w,crop.h).data;
      luminance=new Float32Array(crop.w*crop.h);let sum=0,sumSquares=0;
      for(let p=0;p<luminance.length;p++){
        const i=p*4,v=.2126*data[i]+.7152*data[i+1]+.0722*data[i+2];
        luminance[p]=v;sum+=v;sumSquares+=v*v;
      }
      mean=sum/luminance.length;deviation=Math.max(1,Math.sqrt(sumSquares/luminance.length-mean*mean));
      const oldPaper=g.getImageData(438,20,58,152).data;channels=[0,0,0];
      for(let i=0;i<oldPaper.length;i+=4)for(let channel=0;channel<3;channel++)channels[channel]+=oldPaper[i+channel];
      channels=channels.map(value=>value/(58*152));
      edgeTile=canvas(width,height);const edgeContext=edgeTile.getContext('2d'),edgePixels=edgeContext.createImageData(width,height);
      for(let y=0;y<height;y++)for(let x=0;x<width;x++){
        const sx=x<crop.w?x:width-1-x,sy=y<crop.h?y:height-1-y;
        const value=luminance[sy*crop.w+sx],next=luminance[sy*crop.w+Math.min(crop.w-1,sx+1)];
        // Interrupted fibres from the original art replace the old even outline.
        const alpha=clamp((value-mean)/deviation*.15+Math.abs(value-next)/deviation*.13+.12,0,.46);
        const i=(y*width+x)*4;edgePixels.data[i]=243;edgePixels.data[i+1]=231;edgePixels.data[i+2]=204;edgePixels.data[i+3]=Math.round(alpha*255);
      }
      edgeContext.putImageData(edgePixels,0,0);loaded=true;revision++;samples.clear();done(true);
      window.dispatchEvent(new Event('uppdrag-paper-fibres-ready'));
      window.dispatchEvent(new Event('uppdrag-room-material-ready'));
    }catch(error){done(false);}
  };
  img.onerror=()=>done(false);img.src=new URL(sourcePath,document.baseURI).href;
  setTimeout(()=>done(loaded),8000);
  return {material,finish,kindFor,ready,sourcePath,get loaded(){return loaded;},get revision(){return revision;}};
})();
