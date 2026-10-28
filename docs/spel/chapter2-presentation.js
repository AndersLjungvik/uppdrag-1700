/* Chapter 2: natural speech, player replies and the delivered supplies. */
(function(){
'use strict';
function source(name,text){
 const edit=(a,b)=>{if(text.split(a).length!==2)throw Error('Kapitel 2: presentationsankaret matchar inte '+name+': '+a.slice(0,50));text=text.replace(a,b);};
 if(name==='meeting-ch2-pilot.js'){
  edit('  roomView.append(layer,person,dialogueTail,panel);',`  const replies=document.createElement('section');replies.id='chapter2Replies';replies.hidden=true;replies.setAttribute('role','group');replies.setAttribute('aria-label','Du svarar');
  roomView.append(layer,person,dialogueTail,panel,replies);
  const replyStyle=document.createElement('style');replyStyle.textContent='#chapter2Replies{position:absolute;z-index:20;left:50%;bottom:12px;transform:translateX(-50%);width:min(510px,calc(100% - 24px));box-sizing:border-box;padding:10px 13px;background:#fff9ec;border:1px solid #aa987b;border-radius:8px;max-height:42%;overflow:auto;font:14px system-ui}#chapter2Replies:before{content:"Du svarar";display:block;font-weight:600;margin-bottom:7px}#chapter2Replies .ch1MeetingChoices{display:flex;gap:8px;flex-wrap:wrap}#chapter2Replies button{flex:1 1 180px;min-height:44px;padding:9px 12px;background:#e5e8d8;color:#352b20;border:1px solid #8f795b;border-radius:5px;text-align:left;font:15px Georgia}#chapter2Replies button:focus-visible{outline:3px solid #286472;outline-offset:2px}#meetingDialogue:focus{outline:none}';document.head.append(replyStyle);`);
  edit('const geo=geometry,maxHeight=geo.h-20;', 'const geo=geometry,reserved=replies.hidden?0:replies.getBoundingClientRect().height+22,maxHeight=geo.h-20-reserved;');
  edit('geo.top+geo.h-actualHeight-9','geo.top+geo.h-actualHeight-9-reserved');
  edit('dialogue=null;speechEnd=0;panel.hidden=true;', 'dialogue=null;speechEnd=0;replies.hidden=true;replies.replaceChildren();panel.hidden=true;');
  edit("panel.querySelector('.ch1MeetingChoices')?.remove();", 'replies.replaceChildren();replies.hidden=true;');
  const old="for(const [action,label] of [['accept',dialogue.special==='thanks'?'Fortsätt äventyret':dialogue.special==='archive'?'Repetera hos Rut':dialogue.special==='giver'?'Självklart!':'Jag hjälper dig att minnas'],['decline','Inte nu']]){";
  edit(old,`const choices=dialogue.special==='memory'?window.UPPDRAG_CH2_PILOT?.memoryChoices?.():null;
      for(const [action,label] of choices?.length?[...choices.map(a=>['area:'+a.id,a.label]),['decline','Inte nu']]:[['accept',dialogue.special==='thanks'?'Fortsätt äventyret':dialogue.special==='archive'?'Repetera hos Rut':'Självklart!'],['decline','Inte nu']]){`);
  edit("panel.append(container);panel.setAttribute('role','group');", "replies.append(container);replies.hidden=false;panel.setAttribute('role','button');");
  const a=text.indexOf('  function memoryPrelude(place,step){'),b=text.indexOf('  function memoryAfter(place){',a);
  if(a<0||b<0)throw Error('Kapitel 2: samtalets inledning saknas.');
  text=text.slice(0,a)+"  function memoryPrelude(place,step){return [['Du',place==='church'?'Hej, Olof!':'Hej, Siri!']];}\n"+text.slice(b);
  edit("['Maja','Olof kom förbi. Hon såg så bekymrad ut att jag blev orolig.'],\n        ['Du','Kan jag hjälpa henne, tror du?'],", "['Maja','Olof och Siri försöker reda ut hur olika människor hade det.'],\n        ['Du','Vad behöver de hjälp med?'],");
  edit("[c.cast.name,'Åh, hej! Jag har fullt upp just nu. Vi ses snart igen.']", "[c.cast.name,pilot.idleLine?.(c.key)||'God dag! Vad roligt att du kom förbi.']");
  edit("panel.addEventListener('click',e=>{", "for(const surface of [panel,replies])surface.addEventListener('click',e=>{");
  edit("if(answer==='accept'){", "if(answer.startsWith('area:')){window.UPPDRAG_CH2_PILOT?.enterMemory(answer.slice(5));return;}\n      if(answer==='accept'){");
  text=text.replaceAll("panel.querySelectorAll('[data-ch1-choice]')", "replies.querySelectorAll('[data-ch1-choice]')");
  edit("panel.querySelector('[data-ch1-choice=\"accept\"]')?.focus({preventScroll:true});", "replies.querySelector('[data-ch1-choice]')?.focus({preventScroll:true});");
 }
 if(name==='more-room-ch2-pilot.js'){
  edit('      /* Foreground table: barnhus */', '      /* Foreground table: barnhus */\n      window.UPPDRAG_CH2_SUPPLIES?.draw(g,tall?85:100,T.top+125,.75);');
  edit("      bowl(g,1080,471,1.28);material(g,'paper',1012,605,1.0);", "      bowl(g,1080,471,1.28);material(g,'paper',1012,605,1.0);window.UPPDRAG_CH2_SUPPLIES?.draw(g,195,610,1.15);");
 }
 return text;
}
function draw(g,x,y,scale=1){
 if(window.__INTEGRATED_CHAPTER!==2||window.UPPDRAG_EVENT_ENGINE?.state.wagon!=='cleared')return false;
 g.save();g.translate(x,y);g.scale(scale,scale);g.lineWidth=2;g.strokeStyle='#5b4230';
 for(let i=0;i<3;i++){g.fillStyle=i%2?'#806348':'#947454';g.beginPath();g.moveTo(-60+i*13,22-i*18);g.lineTo(30+i*13,8-i*18);g.lineTo(38+i*13,22-i*18);g.lineTo(-52+i*13,37-i*18);g.closePath();g.fill();g.stroke();}
 g.fillStyle='#94724e';g.beginPath();g.ellipse(0,-24,74,22,-.04,0,Math.PI*2);g.fill();g.stroke();
 for(const [px,py]of [[-31,-31],[17,-40],[44,-23]]){g.save();g.translate(px,py);g.rotate(-.2);g.fillStyle='#c09a5c';g.beginPath();g.ellipse(0,0,27,15,0,0,Math.PI*2);g.fill();g.stroke();g.strokeStyle='#f0d6a0';for(let i=-12;i<15;i+=10){g.beginPath();g.moveTo(i,-8);g.lineTo(i+3,6);g.stroke();}g.restore();}
 g.restore();return true;
}
window.UPPDRAG_CH2_PRESENTATION={source};window.UPPDRAG_CH2_SUPPLIES={draw};
})();
