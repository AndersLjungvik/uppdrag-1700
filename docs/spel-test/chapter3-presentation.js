/* Retain the existing rooms, puppets and one world loop. New scenes use them. */
(function(){
'use strict';
function source(name,text){
 const edit=(before,after)=>{if(text.split(before).length!==2)throw Error('Kapitel 3: presentationsankaret matchar inte '+name+': '+before.slice(0,60));text=text.replace(before,after);};
 if(name==='meeting-ch3-pilot.js'){
  edit("    print:{name:'Brita'", "    square:{name:'Bonden',color:'#8d7656',role:'farmer'},\n    courtyard:{name:'Karin',color:'#876d5d',woman:true,apron:true,role:'karin'},\n    fort:{name:'David',color:'#736957',role:'david'},\n    print:{name:'Brita'");
  edit("const PLACEMENT={", "const PLACEMENT={\n    square:{wide:[[250,690,.8],[1050,675,.86]],tall:[[130,990,.7],[570,963,.67]]},\n    courtyard:{wide:[[110,690,.75],[285,685,.8]],tall:[[100,990,.7],[285,975,.7]]},\n    fort:{wide:[[270,690,.8],[1040,675,.86]],tall:[[125,990,.7],[575,965,.64]]},");
  edit("key=quay?dockKey:window.UPPDRAG_STORY_WORLD?.roomKey?.(storyPlace)||interior.kind", "key=quay?dockKey:interior.kind");
  edit("const c=current();if(!c?.cast||dialogue||voyage)return false;", "const c=current();if(!c?.cast||dialogue||voyage||window.UPPDRAG_EVENT_ENGINE?.busy||window.UPPDRAG_CH3_SCENES?.busy)return false;");
  edit('    const pilot=window.UPPDRAG_CH3_PILOT;', '    if(window.UPPDRAG_CH3_SCENES)return window.UPPDRAG_CH3_SCENES.openRoom(c.key);\n    const pilot=window.UPPDRAG_CH3_PILOT;');
  edit("const a=puppets(g),speaker=talk?.active?talk.speaker:(dialogue?dialogue.cast.lines[dialogue.index][0]:'');", "const voice=window.UPPDRAG_EVENT_ENGINE?.roomVoice;if(voice){speechAt=voice.at;speechEnd=voice.end;}\n    const a=puppets(g),speaker=window.UPPDRAG_EVENT_ENGINE?.roomSpeaker||(talk?.active?talk.speaker:(dialogue?dialogue.cast.lines[dialogue.index][0]:''));");
  edit('    g.restore();\n    const chapterOneOnly=', '    window.UPPDRAG_CH3_SCENES?.drawProps(g,c.key,geometry.w/geometry.h<1.02,now,a);\n    g.restore();\n    const chapterOneOnly=');
  edit("person.hidden=!c.cast||!!dialogue||!!controller(c.key)?.busy;", "person.hidden=!c.cast||!!dialogue||!!controller(c.key)?.busy||!!window.UPPDRAG_EVENT_ENGINE?.busy||!!window.UPPDRAG_CH3_SCENES?.busy;");
  edit('const animating=(dialogue||', 'const animating=(dialogue||window.UPPDRAG_EVENT_ENGINE?.roomSpeaker||');
  edit('geometryForRoom:measure,drawMapPerson', 'geometryForRoom:measure,redraw(){lastPaint=-Infinity;drawPeople(performance.now());},drawRoomPerson(g,pos,who,now,speaking=false){puppets(g).side(...pos,who,false,now,speaking,false,false,0,0,null);},drawMapPerson');
  edit("quay:'Jos krigsbrev',print:'Brita tryckblad',archive:'Ruts bokhyllor'", "quay:'Resa till Marstrand',print:'Britas tryckblad',archive:'Ruts bokhyllor',palace:'Amiras kartblad',square:'Bönder och soldater',courtyard:'Den stängda gården',fort:'David och fästningsvakten'");
 }
 if(name==='chapter3-street-life.js'){
  edit("function step(){const state=window.UPPDRAG_CH3_PILOT?.state;", "function step(){if(window.UPPDRAG_CH3_SCENES)return window.UPPDRAG_CH3_SCENES.streetStep;const state=window.UPPDRAG_CH3_PILOT?.state;");
  edit("const x=cur===2?2448-410*progress.fraction:Math.max(2038,phase3FarmerX-t*.009);", "const x=cur===2?2448-410*progress.fraction:2038;");
  edit("const moving=cur===2?progress.moving:!reduced?.matches&&x>2038;", "const moving=cur===2?progress.moving:false;");
  edit(" if(a.id==='farmers'){\n  // Ragged", " if(a.id==='farmers'&&phase()===3){drawFigure(ctx,a,now);return;}\n if(a.id==='farmers'){\n  // Ragged");
  edit('const minY=9,maxY=Math.max(minY,layout.h-height-10);', 'const minY=9,maxY=Math.max(minY,layout.h-height-10-(window.UPPDRAG_CH3_SCENES?.patrolReplyHeight||0));');
  edit('function open(actor){', 'function open(actor,providedLines=null){');
  edit('const sequence=story(source);', 'const sequence=providedLines||story(source);');
  edit("mode:startWithPlayer?'lines':'greeting'", "mode:(providedLines||startWithPlayer)?'lines':'greeting'");
  edit(" root.hidden=false;putSpeech(active,speaker.textContent);\n box.focus", " root.hidden=false;putSpeech(active,speaker.textContent);\n window.UPPDRAG_CH3_SCENES?.patrolReplies(active,lineIndex===lines.length-1);\n box.focus");
  edit(' active=null;lineIndex=0;arrivalCandidate=null;teaserHiddenUntil=now+1700;', ' active=null;lineIndex=0;arrivalCandidate=null;teaserHiddenUntil=now+1700;\n window.UPPDRAG_CH3_SCENES?.closePatrol();');
 }
 if(name==='more-room-ch3-pilot.js')edit('bed(g,bx,feet,188);bed(g,bx+222,feet,188);','bed(g,bx,feet,188);window.UPPDRAG_CH3_SCENES?.drawInheritedBed(g,bx,feet,188);bed(g,bx+222,feet,188);');
 return text;
}
function install(){
 const approved=window.UPPDRAG_ROOM_ART;
 const project=(canvas)=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),tall=r.width/r.height<1.02,D=tall?{w:720,h:1040}:{w:1280,h:720},scale=Math.min(r.width/D.w,r.height/D.h);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);const g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,r.width,r.height);g.translate((r.width-D.w*scale)/2,(r.height-D.h*scale)/2);g.scale(scale,scale);return {g,tall,D,scale,left:(r.width-D.w*scale)/2,top:(r.height-D.h*scale)/2};};
 function material(g,color){return window.UPPDRAG_PAPER_FIBRES?.material?.(g,color,'piece')||color;}
 function cut(g,x,y,w,h,color){g.fillStyle=material(g,color);g.beginPath();g.moveTo(x+2,y+2);g.lineTo(x+w-2,y);g.lineTo(x+w,y+h-2);g.lineTo(x,y+h);g.closePath();g.fill();}
 function yardFrame(tall){return tall?{x:65,y:165,sx:1,sy:1.38}:{x:440,y:120,sx:1.25,sy:1.15};}
 function barrel(g,x,y){g.save();g.translate(x,y);g.fillStyle=material(g,'#8b7253');g.strokeStyle='#514735';g.lineWidth=2;g.beginPath();g.ellipse(0,0,35,42.5,0,0,Math.PI*2);g.fill();g.stroke();for(const yy of [-22,22]){g.beginPath();g.ellipse(0,yy,31,8,0,0,Math.PI*2);g.stroke();}g.beginPath();g.moveTo(-11,-38);g.lineTo(-11,38);g.moveTo(12,-38);g.lineTo(12,38);g.stroke();g.restore();}
 function courtyard(g,tall,D){
  cut(g,0,0,D.w,D.h,'#c7b89b');cut(g,0,tall?430:270,D.w,D.h,'#a69b80');
  const Y=yardFrame(tall),s=window.UPPDRAG_CH3_SCENES?.courtyard||{phase:'available',layout:{a:'bench',b:'path'}};
  g.save();g.translate(Y.x,Y.y);g.scale(Y.sx,Y.sy);
  cut(g,-30,-50,650,175,'#baab8e');cut(g,399,-20,95,170,'#645b48');cut(g,409,-11,74,148,'#78664b');
  cut(g,175,150,195,22,'#715c42');for(const x of [190,338])cut(g,x,167,15,34,'#514635');
  cut(g,395,155,105,265,'#c3b595');
  for(let y=175;y<415;y+=40){g.strokeStyle='#8b8068';g.lineWidth=1;g.beginPath();g.moveTo(402,y);g.lineTo(490,y+2);g.stroke();}
  cut(g,-25,395,420,17,'#6b5c44');cut(g,500,395,122,17,'#6b5c44');
  if(s.phase!=='open'){for(let x=397;x<500;x+=18)cut(g,x,333,12,90,'#6e5e43');cut(g,397,350,102,11,'#514635');}
  else{cut(g,493,333,12,90,'#6e5e43');cut(g,505,334,75,12,'#6e5e43');cut(g,508,360,70,11,'#6e5e43');cut(g,508,385,70,11,'#6e5e43');cut(g,572,335,10,62,'#6e5e43');}
  const slots=window.UPPDRAG_CH3_COURTYARD_PUZZLE.slots;
  for(const id of ['a','b']){const p=slots[s.layout?.[id]]||slots[id==='a'?'bench':'path'];barrel(g,p.x,p.y);}
  if(s.phase==='open'){cut(g,339,114,35,38,'#7b8274');g.strokeStyle='#555647';g.lineWidth=3;g.beginPath();g.arc(357,114,17,Math.PI,0);g.stroke();g.fillStyle='#a8b5b2';g.fillRect(343,116,27,5);}
  g.restore();
 }
 function square(g,tall,D){
  cut(g,0,0,D.w,D.h,'#c8bca3');cut(g,0,tall?400:255,D.w,D.h,'#aaa38c');
  for(const [x,w,h,color]of [[-55,230,270,'#9d806b'],[D.w-190,250,250,'#8b8570']]){cut(g,x,30,w,h,color);cut(g,x+50,115,70,120,'#5b635c');cut(g,x+8,23,w-10,24,'#716652');}
  for(let y=tall?490:330;y<D.h;y+=65)for(let x=15;x<D.w;x+=115){g.strokeStyle='#918b77';g.lineWidth=1;g.beginPath();g.moveTo(x+(y%2)*7,y);g.lineTo(x+88,y+2);g.stroke();}
  cut(g,tall?255:510,tall?570:435,tall?280:320,18,'#7f6b50');
  cut(g,tall?280:535,tall?589:453,18,70,'#695b43');cut(g,tall?500:785,tall?589:453,18,70,'#695b43');
 }
 function render(canvas,kind){if(!['square','courtyard'].includes(kind))return approved.render(canvas,kind);const p=project(canvas);if(kind==='square')square(p.g,p.tall,p.D);else courtyard(p.g,p.tall,p.D);return {x:p.left+15*p.scale,y:p.top+(p.D.h-85)*p.scale,w:90*p.scale,h:75*p.scale};}
 function renderMemoryCloseup(canvas,kind){
  if(!['square','fort'].includes(kind))return approved.renderMemoryCloseup(canvas,kind);
  render(canvas,kind);const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);
  const w=r.width,h=r.height;cut(g,0,h*.63,w,h*.37,'#816a4c');cut(g,w*.18,h*.66,w*.52,h*.3,'#e7dcc3');
  g.strokeStyle='#887b65';g.lineWidth=2;for(let i=0;i<6;i++){g.beginPath();g.moveTo(w*.23,h*(.71+i*.035));g.lineTo(w*.6,h*(.71+i*.035));g.stroke();}return true;
 }
 window.UPPDRAG_ROOM_ART={...approved,names:{...approved.names,square:'Torget',courtyard:'Gården i Bostadskvarteren'},descriptions:{...approved.descriptions,square:'Ett torg med bönder och soldater.',courtyard:'Karin, en stängd grind, en bänk och två tunnor.'},render,renderMemoryCloseup};
 UPPDRAG_ROOM_STAGING.PLANS.courtyard={tilt:.04,wide:[[285,685,.8]],tall:[[285,975,.7]],player:{wide:[110,690,.75],tall:[100,990,.7]}};
 ROOM_BY_REGION.main.Torget='square';ROOM_BY_REGION.main.Bostadskvarteren='courtyard';
 return {yardFrame};
}
window.UPPDRAG_CH3_PRESENTATION={source,install};
})();
