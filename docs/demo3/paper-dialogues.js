/* Demo 3.14: the existing thoughts, speech and choices share the world's paper.
 * Paint only. Each controller still owns its text, position, size and input.
 * Only decorative pseudo-elements are cut; content, focus and tails are not.
 */
'use strict';
(() => {
  if(window.UPPDRAG_PAPER_DIALOGUES)return;
  const panels=':is(#livingBubble,#placeBubble,#rutPanel,#meetingBubble,#meetingDialogue,#rutDocuments,#message)';
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
    :is(#livingBubble,#placeBubble,#rutPanel,#meetingBubble).thought{
      --dialogue-cut:polygon(0 23px,3px 12px,10px 5px,23px 1px,33% 0,49% 2px,69% 0,calc(100% - 26px) 1px,calc(100% - 12px) 4px,calc(100% - 4px) 12px,100% 24px,calc(100% - 1px) 48%,100% calc(100% - 24px),calc(100% - 4px) calc(100% - 12px),calc(100% - 12px) calc(100% - 5px),calc(100% - 26px) calc(100% - 1px),70% 100%,48% calc(100% - 2px),28% 100%,23px calc(100% - 1px),10px calc(100% - 5px),3px calc(100% - 12px),0 calc(100% - 24px),1px 49%);
    }
    ${panels} :is(h3,h4,p,button,.practiceNote,.question){font-family:Georgia,'Times New Roman',serif!important;}
    ${panels} :is(h3,h4){color:#64513c;letter-spacing:.01em;}
    :is(#livingBubble,#placeBubble,#rutPanel,#meetingBubble).thought h3{font-style:italic;font-weight:400;}
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
    :is(#livingTail,#placeTail,#rutTail,#meetingTail) :is(path,circle){
      fill:url('#uppdrag-dialogue-fibres') #fbf1dc!important;
      stroke:#a18b656b!important;stroke-width:1px!important;stroke-linejoin:round;
    }
    @media(forced-colors:active){
      ${panels}{background:Canvas!important;border-color:CanvasText!important;}
      ${panels} button{background:ButtonFace!important;border-color:ButtonText!important;}
      ${panels}::before,${panels}::after,${panels} button::before,${panels} button::after{display:none;}
      ${panels} :is(h3,h4,p,button){color:CanvasText;}
    }
  `;
  document.head.append(style);
  // Keep the paint server outside the tails: controllers replace their children.
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.id='uppdrag-dialogue-paper-defs';svg.setAttribute('width','0');svg.setAttribute('height','0');
  svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
  svg.style.cssText='position:absolute;overflow:hidden;pointer-events:none';
  const defs=document.createElementNS(ns,'defs'),pattern=document.createElementNS(ns,'pattern'),image=document.createElementNS(ns,'image');
  pattern.id='uppdrag-dialogue-fibres';pattern.setAttribute('patternUnits','userSpaceOnUse');
  pattern.setAttribute('width','720');pattern.setAttribute('height','270');
  image.setAttribute('width','720');image.setAttribute('height','270');
  pattern.append(image);defs.append(pattern);svg.append(defs);document.body.append(svg);
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
      const css=document.documentElement.style;
      css.setProperty('--dialogue-paper','url("'+sheet+'")');
      css.setProperty('--dialogue-label','url("'+label+'")');
      css.setProperty('--dialogue-light','url("'+light+'")');
      image.setAttribute('href',sheet);revision=key;loaded=!!fibres?.loaded;
    }catch(error){loaded=false;}
  }
  refresh();
  window.addEventListener('uppdrag-paper-fibres-ready',refresh);
  const ready=Promise.resolve(window.UPPDRAG_PAPER_FIBRES?.ready).then(()=>{refresh();return loaded;});
  window.UPPDRAG_PAPER_DIALOGUES={ready,get loaded(){return loaded;}};
})();
