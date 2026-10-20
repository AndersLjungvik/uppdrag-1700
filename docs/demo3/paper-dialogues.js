/* Demo 3.18: white paper thoughts at the scene edge, round speech by its speaker.
 * Controllers own conversation and input. This module owns paper and room layout.
 * The SVG silhouette is decorative; text and keyboard focus are never clipped.
 */
'use strict';
(() => {
  if(window.UPPDRAG_PAPER_DIALOGUES)return;
  const panels=':is(#placeBubble,#rutPanel,#meetingBubble,#meetingDialogue,#storyBubble,#rutDocuments,#message)';
  const style=document.createElement('style');style.id='uppdrag-paper-dialogues-style';
  style.textContent=`
    :root{
      --dialogue-paper:none;--dialogue-label:none;--dialogue-light:none;
      --dialogue-cut:polygon(0 18px,2px 10px,7px 4px,19px 1px,34% 0,67% 1px,calc(100% - 22px) 0,calc(100% - 9px) 3px,calc(100% - 3px) 9px,100% 19px,calc(100% - 1px) 38%,100% 66%,calc(100% - 1px) calc(100% - 18px),calc(100% - 4px) calc(100% - 8px),calc(100% - 13px) calc(100% - 3px),calc(100% - 25px) 100%,68% calc(100% - 1px),35% 100%,20px calc(100% - 1px),8px calc(100% - 4px),2px calc(100% - 11px),0 calc(100% - 23px),1px 63%,0 37%);
      --dialogue-tag:polygon(3px 2px,31% 0,65% 1px,calc(100% - 3px) 0,100% 5px,calc(100% - 1px) 51%,100% calc(100% - 3px),72% 100%,39% calc(100% - 1px),2px 100%,0 calc(100% - 6px),1px 43%);
    }
    ${panels}{
      isolation:isolate;background:transparent!important;border-color:transparent!important;
      border-style:solid!important;border-radius:0!important;box-shadow:none!important;
      color:#382e23;font-family:Georgia,'Times New Roman',serif!important;
    }
    ${panels}::before,${panels}::after{
      content:'';position:absolute;inset:0;pointer-events:none;clip-path:var(--dialogue-cut);
      border:0;border-radius:0;
    }
    ${panels}::before{z-index:-1;inset:0 1px 2px 0;background:#fbf1dc var(--dialogue-paper) repeat;}
    ${panels}::after{z-index:-2;inset:0;background:#86715466;}
    :is(#placeBubble,#rutPanel,#meetingBubble,#storyBubble).thought{
      --dialogue-cut:polygon(0 23px,3px 12px,10px 5px,23px 1px,33% 0,49% 2px,69% 0,calc(100% - 26px) 1px,calc(100% - 12px) 4px,calc(100% - 4px) 12px,100% 24px,calc(100% - 1px) 48%,100% calc(100% - 24px),calc(100% - 4px) calc(100% - 12px),calc(100% - 12px) calc(100% - 5px),calc(100% - 26px) calc(100% - 1px),70% 100%,48% calc(100% - 2px),28% 100%,23px calc(100% - 1px),10px calc(100% - 5px),3px calc(100% - 12px),0 calc(100% - 24px),1px 49%);
    }
    ${panels} :is(h3,h4,p,button,.practiceNote,.question){font-family:Georgia,'Times New Roman',serif!important;}
    ${panels} :is(h3,h4){color:#64513c;letter-spacing:.01em;}
    :is(#placeBubble,#rutPanel,#meetingBubble,#storyBubble).thought h3{font-style:italic;font-weight:400;}
    ${panels} p{color:#382e23;}
    ${panels} button{
      position:relative;isolation:isolate;background:transparent!important;
      border-color:transparent!important;border-radius:0!important;box-shadow:none!important;
      color:#3b3023;text-shadow:none;
    }
    ${panels} button::before,${panels} button::after{
      content:'';position:absolute;inset:0;pointer-events:none;clip-path:var(--dialogue-tag);
      border:0;border-radius:0;
    }
    ${panels} button::before{z-index:-1;inset:0 0 1px 0;background:#ead7b1 var(--dialogue-label) repeat;background-position:37px 19px;}
    ${panels} button::after{z-index:-2;inset:0;background:#9b82586b;}
    ${panels} .thoughtChoice::before,#rutAnswers button::before{background:#fff8e9 var(--dialogue-light) repeat;}
    ${panels} .thoughtChoice{font-style:italic;}
    ${panels} .thoughtChoice:nth-of-type(even)::before{background-position:143px 61px;}
    ${panels} .quiet::before{background:#fbf1dc var(--dialogue-paper) repeat;opacity:.48;}
    ${panels} .quiet::after{opacity:.25;}
    ${panels} button:hover::before{filter:brightness(1.035);}
    ${panels} button:active::before{filter:brightness(.97);}
    ${panels} button:focus-visible{outline:3px solid #3e666d;outline-offset:2px;}
    #rutDocuments{--dialogue-cut:var(--dialogue-tag);}
    #rutDocuments article{background:#fff8e9 var(--dialogue-light) repeat;border-color:#baab8766;box-shadow:1px 2px 0 #79634520;}
    :is(#meetingPerson,#rutPapers) span{background:#f4e7c9 var(--dialogue-paper) repeat;border-color:#a58d6380;border-radius:1px;font-family:Georgia,'Times New Roman',serif;}
    #livingBubble{background:transparent!important;border-color:transparent!important;border-radius:0!important;box-shadow:none!important;color:#382e23;font-family:Georgia,'Times New Roman',serif!important;}
    #livingBubble::before,#livingBubble::after{content:none!important;display:none!important;}
    #livingBubble p{font-family:Georgia,'Times New Roman',serif!important;color:#382e23;}
    #livingTail .worldSpeechPaper{fill:url('#uppdrag-dialogue-fibres') #fbf1dc;}
    :is(#placeTail,#rutTail,#meetingTail,#storyTail) :is(path,circle){
      fill:url('#uppdrag-dialogue-fibres') #fbf1dc!important;
      stroke:#a18b656b!important;stroke-width:1px!important;stroke-linejoin:round;
    }
    :is(#placeBubble,#rutPanel,#meetingDialogue,#storyBubble)[data-paper-room]{
      border:0!important;max-width:none!important;min-height:68px;
      padding:28px 40px!important;transform:none!important;bottom:auto!important;right:auto!important;
      overflow-x:hidden;scrollbar-width:thin;text-align:center;touch-action:manipulation;
    }
    :is(#placeBubble,#rutPanel,#meetingDialogue,#storyBubble)[data-paper-room]::before,
    :is(#placeBubble,#rutPanel,#meetingDialogue,#storyBubble)[data-paper-room]::after{content:none!important;display:none!important;}
    :is(#placeBubble,#rutPanel,#meetingDialogue,#storyBubble)[data-paper-room] p{
      font:18px/1.43 Georgia,'Times New Roman',serif!important;margin:0!important;color:#302c29;
    }
    :is(#placeBubble,#rutPanel,#storyBubble)[data-paper-room].thought{padding:24px 42px!important;}
    :is(#placeBubble,#rutPanel,#storyBubble)[data-paper-room] .thoughtChoice{
      display:block;width:100%;min-height:42px;padding:8px 9px;margin:4px 0;
      font:italic 17px/1.35 Georgia,'Times New Roman',serif!important;text-align:center;
      color:#39332c;border:0!important;border-radius:24px!important;
    }
    :is(#placeBubble,#rutPanel,#storyBubble)[data-paper-room] .thoughtChoice::before,
    :is(#placeBubble,#rutPanel,#storyBubble)[data-paper-room] .thoughtChoice::after{content:none!important;display:none!important;}
    :is(#placeBubble,#rutPanel,#storyBubble)[data-paper-room] .thoughtChoice:hover{text-decoration:underline;text-underline-offset:4px;}
    :is(#placeBubble,#rutPanel,#storyBubble)[data-paper-room] .thoughtChoice:focus-visible{outline:none;text-decoration:underline;text-underline-offset:4px;}
    :is(#placeBubble,#rutPanel,#meetingDialogue,#storyBubble)[data-paper-room]:focus{outline:none;}
    :is(#placeBubble,#rutPanel,#meetingDialogue,#storyBubble)[data-paper-room].speech{cursor:pointer;}
    #placeThoughts:has(#placeBubble.speech:focus-visible) #placeTail .worldSpeechPaper,
    #rutPilot:has(#rutPanel.speech:focus-visible) #rutTail .worldSpeechPaper,
    #interiorView:has(#meetingDialogue.speech:focus-visible) #meetingTail .worldSpeechPaper,
    #interiorView:has(#storyBubble.speech:focus-visible) #storyTail .worldSpeechPaper{
      stroke:#4c443a!important;stroke-width:1.6px!important;stroke-opacity:.9;
    }
    :is(#placeTail,#rutTail,#meetingTail,#storyTail)  .paperEdgeFibre{display:none!important;}
    @media(max-width:640px),(max-height:430px){
      :is(#placeBubble,#rutPanel,#meetingDialogue,#storyBubble)[data-paper-room]{padding:23px 30px!important;}
      :is(#placeBubble,#rutPanel,#meetingDialogue,#storyBubble)[data-paper-room] p{font-size:16px!important;line-height:1.4!important;}
      :is(#placeBubble,#rutPanel,#storyBubble)[data-paper-room].thought{padding:18px 29px!important;}
      :is(#placeBubble,#rutPanel,#storyBubble)[data-paper-room] .thoughtChoice{font-size:16px!important;min-height:42px;padding:7px 6px;}
    }
    @media(forced-colors:active){
      ${panels}{background:Canvas!important;border-color:CanvasText!important;}
      ${panels} button{background:ButtonFace!important;border-color:ButtonText!important;}
      ${panels}::before,${panels}::after,${panels} button::before,${panels} button::after{display:none;}
      ${panels} :is(h3,h4,p,button){color:CanvasText;}
      #livingTail .worldSpeechPaper{fill:Canvas;stroke:CanvasText;}
      #livingBubble p{color:CanvasText;}
      :is(#placeTail,#rutTail,#meetingTail,#storyTail) :is(path,circle){fill:Canvas!important;stroke:CanvasText!important;}
      :is(#placeTail,#rutTail,#meetingTail,#storyTail) .paperEdgeFibre{display:none;}
    }
  `;
  document.head.append(style);
  // Keep the paint server outside the tails: controllers replace their children.
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.id='uppdrag-dialogue-paper-defs';svg.setAttribute('width','0');svg.setAttribute('height','0');
  svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
  svg.style.cssText='position:absolute;overflow:hidden;pointer-events:none';
  const defs=document.createElementNS(ns,'defs'),pattern=document.createElementNS(ns,'pattern'),image=document.createElementNS(ns,'image'),paperBase=document.createElementNS(ns,'rect');
  pattern.id='uppdrag-dialogue-fibres';pattern.setAttribute('patternUnits','userSpaceOnUse');
  pattern.setAttribute('width','720');pattern.setAttribute('height','270');
  image.setAttribute('width','720');image.setAttribute('height','270');
  paperBase.setAttribute('width','720');paperBase.setAttribute('height','270');paperBase.setAttribute('fill','#fffefa');
  const shadow=document.createElementNS(ns,'filter'),drop=document.createElementNS(ns,'feDropShadow');
  shadow.id='uppdrag-speech-paper-shadow';shadow.setAttribute('x','-8%');shadow.setAttribute('y','-8%');shadow.setAttribute('width','116%');shadow.setAttribute('height','120%');
  drop.setAttribute('dx','.7');drop.setAttribute('dy','1.7');drop.setAttribute('stdDeviation','.65');drop.setAttribute('flood-color','#51412d');drop.setAttribute('flood-opacity','.24');shadow.append(drop);
  pattern.append(paperBase,image);defs.append(pattern,shadow);svg.append(defs);document.body.append(svg);
  const speechIds=new WeakMap();let nextSpeechId=0;
  const bound=(value,min,max)=>Math.max(min,Math.min(max,value));
  function speechOutline(box,tip,{round=.62,thought=false}={}){
    const {x,y,w,h}=box,cx=x+w/2,cy=y+h/2,rx=w/2-1,ry=h/2-1;
    const rough=[],points=[];
    // Unequal, bowed cut-paper sides, resampled before the tiny edge nicks.
    // This is one outline, including the mouth-point, never a card plus a tail.
    for(let i=0;i<=256;i++){
      const angle=i/256*Math.PI*2,cos=Math.cos(angle),sin=Math.sin(angle);
      const sx=Math.sign(cos)*Math.abs(cos)**round,sy=Math.sign(sin)*Math.abs(sin)**round;
      const cloud=thought?.022*Math.cos(angle*11+.3):0;
      rough.push({x:cx+rx*sx*(.972+.016*Math.sin(angle*3+.6)+cloud)+sin*.7,
        y:cy+ry*sy*(.962+.021*Math.sin(angle*3+1.1)+cloud)});
    }
    let travelled=0,next=0;
    for(let i=1;i<rough.length;i++){
      const a=rough[i-1],b=rough[i],dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);
      while(next<=travelled+length){
        const u=length?(next-travelled)/length:0,n=points.length;
        const nick=.48*Math.sin(n*2.31)+.23*Math.sin(n*.79+1.2);
        points.push({x:bound(a.x+dx*u+dy/Math.max(1,length)*nick,x+.5,x+w-.5),
          y:bound(a.y+dy*u-dx/Math.max(1,length)*nick,y+.5,y+h-.5)});
        next+=3.7;
      }
      travelled+=length;
    }
    let inside=false;
    if(tip)for(let i=0,j=points.length-1;i<points.length;j=i++){
      const a=points[i],b=points[j];
      if((a.y>tip.y)!==(b.y>tip.y)&&tip.x<(b.x-a.x)*(tip.y-a.y)/(b.y-a.y)+a.x)inside=!inside;
    }
    if(!tip||inside)return points;
    let nearest=0,distance=Infinity;
    for(let i=0;i<points.length;i++){
      const d=Math.hypot(points[i].x-tip.x,points[i].y-tip.y);
      if(d<distance){nearest=i;distance=d;}
    }
    const half=Math.min(12,Math.max(7,Math.min(w,h)*.14)),steps=Math.max(2,Math.round(half/3.7)),count=points.length;
    const before=(nearest-steps+count)%count,after=(nearest+steps)%count,outline=[];
    for(let i=after;i!==before;i=(i+1)%count)outline.push(points[i]);
    const a=points[before],b=points[after];outline.push(a);
    // Slightly unequal cuts avoid a mechanically perfect triangle.
    outline.push({x:a.x+(tip.x-a.x)*.53+.35,y:a.y+(tip.y-a.y)*.53});
    outline.push({x:tip.x,y:tip.y});
    outline.push({x:tip.x+(b.x-tip.x)*.51-.3,y:tip.y+(b.y-tip.y)*.51});
    return outline;
  }
  function drawSpeech(target,{box,tip,round=.62}={}){
    if(!target||!box||!tip||![box.x,box.y,box.w,box.h,tip.x,tip.y].every(Number.isFinite)||box.w<30||box.h<30)return false;
    return drawPaper(target,speechOutline(box,tip,{round}));
  }
  function drawPaper(target,points){
    const d=points.map((p,i)=>(i?'L':'M')+p.x.toFixed(2)+' '+p.y.toFixed(2)).join(' ')+' Z';
    let id=speechIds.get(target);if(!id){id='uppdrag-speech-cut-'+(++nextSpeechId);speechIds.set(target,id);}
    const localDefs=document.createElementNS(ns,'defs'),clip=document.createElementNS(ns,'clipPath'),maskShape=document.createElementNS(ns,'path');
    clip.id=id;clip.setAttribute('clipPathUnits','userSpaceOnUse');maskShape.setAttribute('d',d);clip.append(maskShape);localDefs.append(clip);
    const paper=document.createElementNS(ns,'path');paper.setAttribute('d',d);paper.setAttribute('class','worldSpeechPaper');
    paper.setAttribute('fill','url(#uppdrag-dialogue-fibres) #fffefa');paper.setAttribute('stroke','#80776a');paper.setAttribute('stroke-opacity','.5');paper.setAttribute('stroke-width','.8');paper.setAttribute('stroke-linejoin','round');paper.setAttribute('filter','url(#uppdrag-speech-paper-shadow)');
    const fibres=document.createElementNS(ns,'path');fibres.setAttribute('d',d);fibres.setAttribute('fill','none');
    fibres.setAttribute('class','paperEdgeFibre');fibres.setAttribute('stroke','#fff');fibres.setAttribute('stroke-opacity','.64');fibres.setAttribute('stroke-width','2.1');fibres.setAttribute('stroke-dasharray','2.7 1.1 4.1 1.8 .8 1.5');fibres.setAttribute('clip-path','url(#'+id+')');
    target.replaceChildren(localDefs,paper,fibres);target.setAttribute('data-paper-speech','true');
    return true;
  }
  const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  function placeRoomBubble({bubble,tail,mode,geometry:geo,heads,speakerIndex=0}={}){
    if(!bubble||!tail||!geo||!heads?.length||!['thoughts','speech'].includes(mode))return false;
    const thoughts=mode==='thoughts',anchor=heads[thoughts?0:speakerIndex]||heads[0];
    const margin=10,available=geo.w-margin*2;
    if(available<80||geo.h<80)return false;
    bubble.dataset.paperRoom=mode;
    let width=Math.min(thoughts?450:390,available);
    // A short utterance gets a small oval, while a reply has room to wrap.
    if(!thoughts){const count=bubble.textContent.trim().length;width=Math.min(width,Math.max(210,170+count*2.3));}
    bubble.style.width=width+'px';bubble.style.maxHeight=Math.max(64,geo.h-margin*2)+'px';bubble.style.overflowY='auto';
    const height=bubble.getBoundingClientRect().height;
    if(height<1)return false;
    const minX=geo.left+margin,maxX=geo.left+geo.w-width-margin,minY=geo.top+margin,maxY=Math.max(minY,geo.top+geo.h-height-margin);
    let box,tip;
    if(thoughts){
      box={x:bound(geo.left+(geo.w-width)/2,minX,maxX),y:maxY,w:width,h:height};
      Object.assign(bubble.style,{left:box.x+'px',top:box.y+'px'});
      drawPaper(tail,speechOutline(box,null,{round:.84,thought:true}));
      // Two quiet thought dots rise from the lower bubble towards the player.
      // Their short trail belongs to the bubble, never a line across the room.
      const start={x:bound(anchor.x,box.x+width*.24,box.x+width*.76),y:box.y+5};
      const dx=anchor.x-start.x,dy=anchor.y+28*anchor.s-start.y,length=Math.hypot(dx,dy)||1;
      const reach=Math.min(42,Math.max(0,length-14));
      for(const [distance,radius] of [[14,6.5],[31,3.7]]){
        if(distance>reach)continue;
        const dot=document.createElementNS(ns,'circle');
        dot.setAttribute('cx',start.x+dx/length*distance);dot.setAttribute('cy',start.y+dy/length*distance);dot.setAttribute('r',radius);
        dot.setAttribute('fill','url(#uppdrag-dialogue-fibres) #fffefa');dot.setAttribute('stroke','#80776a');dot.setAttribute('stroke-opacity','.5');
        dot.setAttribute('filter','url(#uppdrag-speech-paper-shadow)');tail.append(dot);
      }
    }else{
      const faces=heads.map(a=>({x:a.x-45*a.s-6,y:a.y-24*a.s-6,w:90*a.s+12,h:84*a.s+12}));
      const bodies=heads.map(a=>({x:a.x-64*a.s-7,y:a.y-24*a.s-7,w:128*a.s+14,h:329*a.s+14}));
      const face=faces[speakerIndex]||faces[0],gap=20;
      const candidates=[
        {x:anchor.x-width/2,y:face.y-height-gap},
        {x:face.x-width-gap,y:anchor.y-height*.55},
        {x:face.x+face.w+gap,y:anchor.y-height*.55},
        {x:geo.left+(geo.w-width)/2,y:Math.min(...faces.map(f=>f.y))-height-gap},
        {x:minX,y:minY},{x:maxX,y:minY}
      ].map(c=>({x:bound(c.x,minX,maxX),y:bound(c.y,minY,maxY),w:width,h:height}));
      for(const c of candidates){
        const nearX=bound(anchor.x,c.x,c.x+c.w),nearY=bound(anchor.y,c.y,c.y+c.h);
        c.score=faces.reduce((n,f)=>n+overlap(c,f)*100,0)+bodies.reduce((n,b)=>n+overlap(c,b)*.2,0)+Math.hypot(nearX-anchor.x,nearY-anchor.y)*8;
      }
      candidates.sort((a,b)=>a.score-b.score);box=candidates[0];
      // Only a small comic-book flap, aimed at the mouth without touching it.
      const cx=box.x+width/2,cy=box.y+height/2,dx=anchor.x-cx,dy=anchor.y+25*anchor.s-cy;
      const power=2/.88,k=1/Math.pow(Math.pow(Math.abs(dx)/(width/2),power)+Math.pow(Math.abs(dy)/(height/2),power),1/power);
      const edge={x:cx+dx*k*.98,y:cy+dy*k*.97},length=Math.hypot(dx,dy)||1;
      const reach=Math.min(28,Math.max(10,Math.hypot(anchor.x-edge.x,anchor.y+25*anchor.s-edge.y)-14));
      tip={x:edge.x+dx/length*reach,y:edge.y+dy/length*reach};
      Object.assign(bubble.style,{left:box.x+'px',top:box.y+'px'});
      drawSpeech(tail,{box,tip,round:.88});
    }
    tail.dataset.paperRoom=mode;return true;
  }
  let revision=null,loaded=false;
  function refresh(){
    const fibres=window.UPPDRAG_PAPER_FIBRES,key=fibres?.loaded?fibres.revision:-1;
    if(key===revision)return;
    try{
      const c=document.createElement('canvas');c.width=720;c.height=270;const g=c.getContext('2d');
      function paper(color){
        // The same real fibre as the figures, at full pigment brightness for text.
        g.clearRect(0,0,c.width,c.height);g.fillStyle=fibres?.material(g,color,'piece')||color;g.fillRect(0,0,c.width,c.height);
        return c.toDataURL('image/png');
      }
      const sheet=paper('#fbf1dc'),label=paper('#ead7b1'),light=paper('#fff8e9');
      g.fillStyle='#fffefa';g.globalAlpha=.89;g.fillRect(0,0,c.width,c.height);g.globalAlpha=1;
      const white=c.toDataURL('image/png');
      const css=document.documentElement.style;
      css.setProperty('--dialogue-paper','url("'+sheet+'")');
      css.setProperty('--dialogue-label','url("'+label+'")');
      css.setProperty('--dialogue-light','url("'+light+'")');
      image.setAttribute('href',white);revision=key;loaded=!!fibres?.loaded;
    }catch(error){loaded=false;}
  }
  refresh();
  window.addEventListener('uppdrag-paper-fibres-ready',refresh);
  const ready=Promise.resolve(window.UPPDRAG_PAPER_FIBRES?.ready).then(()=>{refresh();return loaded;});
  window.UPPDRAG_PAPER_DIALOGUES={drawSpeech,placeRoomBubble,ready,get loaded(){return loaded;}};
})();
