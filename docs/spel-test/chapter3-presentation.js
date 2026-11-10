/* Retain the existing rooms, puppets and one world loop. New scenes use them. */
(function(){
'use strict';
function source(name,text){
 const edit=(before,after)=>{if(text.split(before).length!==2)throw Error('Kapitel 3: presentationsankaret matchar inte '+name+': '+before.slice(0,60));text=text.replace(before,after);};
 if(name==='meeting-ch3-pilot.js'){
  edit("    print:{name:'Brita'", "    square:{name:'Bonden',color:'#8d7656',role:'farmer'},\n    courtyard:{name:'Karin',color:'#876d5d',woman:true,apron:true,role:'karin'},\n    fort:{name:'David',color:'#736957',role:'david'},\n    print:{name:'Brita'");
  edit("if(!woman){oval(-1,-301,47,9,color);", "if(!woman&&role!=='david'&&role!=='cap-party'){oval(-1,-301,47,9,role==='hat-party'?'#4f4b40':color);");
  edit("  }else if(role==='olof'){", "  }else if(role==='cap-party'){\n    poly([[-33,-286],[-36,-302],[-27,-316],[-5,-322],[23,-316],[35,-302],[36,-287]],'#7b866b');\n    cut(-34,-295,70,12,'#65745e');\n  }else if(role==='hat-party'){\n    poly([[-43,-304],[-22,-331],[20,-330],[43,-304],[19,-298],[-20,-299]],'#4f4b40');\n    poly([[-39,-304],[-18,-311],[18,-310],[39,-303],[18,-298],[-17,-299]],'#81765b');\n  }else if(role==='david'){\n    // Plain working clothes and rolled sleeves; no clerk's hat or quill.\n    poly([[-32,-219],[24,-219],[33,-118],[-31,-115]],'#a99d81');\n    poly([[-31,-289],[-17,-305],[13,-307],[32,-292],[12,-286],[-12,-283]],'#6a5540');\n    poly([[16,-244],[30,-245],[28,-232],[16,-234]],'#8d795c');\n    cut(-34,-216,15,21,'#d3c5a5');cut(27,-215,15,20,'#d3c5a5');\n    cut(-31,-119,61,8,'#786a51');cut(-14,-204,5,44,'#756a53');\n  }else if(role==='olof'){");
  edit("const PLACEMENT={", "const PLACEMENT={\n    square:{wide:[[325,694,.63],[710,642,.59]],tall:[[157,1010,.57],[435,962,.57]]},\n    courtyard:{wide:[[110,690,.75],[285,685,.8]],tall:[[100,990,.7],[285,975,.7]]},\n    fort:{wide:[[270,690,.8],[1040,675,.86]],tall:[[125,990,.7],[575,965,.64]]},");
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
 // A layered stage for 1743, rather than a measured reconstruction of Stockholm.
 // The distant theatre is Bollhuset: the Gustavian opera house opened in 1782.
 // Source: https://arkivet.operan.se/repertoar/spelplatser
 function poly(g,points,color,shadow=false){
  g.save();g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
  if(shadow){g.shadowColor='#3b332524';g.shadowBlur=5;g.shadowOffsetY=4;}
  g.fillStyle=material(g,color);g.fill();g.shadowColor='transparent';
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  window.UPPDRAG_PAPER_FIBRES?.finish?.(g,{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)},{edge:.6});g.restore();
 }
 function line(g,points,color,width=1){g.save();g.strokeStyle=color;g.lineWidth=width;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();g.restore();}
 function windows(g,x,y,cols,rows,dx,dy,w,h,color){for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const xx=x+col*dx,yy=y+row*dy;poly(g,[[xx,yy+.5],[xx+w,yy],[xx+w,yy+h],[xx,yy+h]],color);line(g,[[x+col*dx+w*.5,y+row*dy],[x+col*dx+w*.5,y+row*dy+h]],'#c7bca1',.8);}}
 function churchExterior(g,x,feet,k){g.save();g.translate(x,feet);g.scale(k,k);
  poly(g,[[0,0],[6,-119],[36,-151],[184,-151],[215,-118],[218,0]],'#b09b7c',true);
  poly(g,[[-7,-119],[34,-158],[184,-158],[225,-119]],'#7b8174');
  cut(g,122,-221,66,222,'#c6b18d');cut(g,169,-216,20,216,'#a49174');
  cut(g,116,-229,77,12,'#d5c3a2');cut(g,131,-264,49,39,'#b4a487');
  poly(g,[[125,-263],[136,-278],[174,-278],[186,-263]],'#788075');
  poly(g,[[137,-278],[144,-289],[147,-312],[160,-328],[171,-310],[175,-289],[180,-278]],'#687c77');
  line(g,[[159,-327],[159,-345]],'#697268',2);line(g,[[153,-338],[165,-338]],'#697268',2);
  for(const xx of [18,56,94]){cut(g,xx,-96,22,57,'#706f61');poly(g,[[xx,-94],[xx+3,-106],[xx+11,-113],[xx+20,-105],[xx+22,-94]],'#706f61');line(g,[[xx+11,-103],[xx+11,-40]],'#c0ac88',2);}
  cut(g,138,-88,29,88,'#716552');poly(g,[[138,-87],[140,-104],[152,-114],[165,-105],[168,-87]],'#716552');
  g.fillStyle=material(g,'#ded1ad');g.beginPath();g.arc(154,-194,14,0,Math.PI*2);g.fill();line(g,[[154,-203],[154,-194],[162,-190]],'#6f7367',2);
  for(let yy=-130;yy<0;yy+=20)line(g,[[125,yy],[185,yy]],'#a28d703b');
  poly(g,[[-11,0],[226,0],[242,14],[-26,14]],'#9c9985');g.restore();
 }
 function palaceExterior(g,x,feet,k){g.save();g.translate(x,feet);g.scale(k,k);
  cut(g,0,-92,307,92,'#c5b79a');cut(g,15,-119,71,119,'#d0c2a4');cut(g,222,-119,71,119,'#c5b89c');
  cut(g,84,-116,139,116,'#d2c3a4');cut(g,10,-126,288,10,'#9c9f90');
  cut(g,6,-97,298,6,'#e0d2b2');cut(g,81,-121,146,6,'#e0d2b2');
  windows(g,25,-109,4,4,14,23,7,12,'#9b9f91');windows(g,98,-104,7,4,17,24,7,12,'#9c9d8b');windows(g,235,-109,4,4,14,23,7,12,'#a0a18f');
  cut(g,142,-40,25,40,'#939786');line(g,[[7,-2],[300,-2]],'#b5ab90',3);g.restore();
 }
 function theatreExterior(g,x,feet,k){g.save();g.translate(x,feet);g.scale(k,k);
  cut(g,0,-62,130,62,'#c1b198');poly(g,[[-7,-62],[18,-86],[114,-86],[137,-62]],'#9d8e7e');
  windows(g,13,-51,5,2,23,23,10,13,'#9c9f91');cut(g,56,-25,19,25,'#9b917e');g.restore();
 }
 function townhouse(g,x,feet,w,h,color,side){
  poly(g,[[x,feet-h],[x+w,feet-h+14],[x+w,feet],[x,feet]],color,true);
  poly(g,[[x-9,feet-h],[x+w*.5,feet-h-55],[x+w+12,feet-h+14]],'#6e7168');
  cut(g,x+w*.78,feet-h+15,w*.22,h-15,'#887b62');
  windows(g,x+24,feet-h+45,Math.max(1,Math.floor((w-40)/48)),Math.max(1,Math.floor((h-80)/68)),48,68,22,35,'#677167');
  for(let yy=feet-h+91;yy<feet-45;yy+=68)line(g,[[x+15,yy],[x+w*.77,yy]],'#d2bd96',3);
  cut(g,x+30,feet-88,39,88,'#605b48');cut(g,x+22,feet-96,56,11,'#d4bf96');
  line(g,[[x+w*side,feet-h+17],[x+w*side,feet]],'#6b614d',3);
 }
 function stall(g,x,feet,k){g.save();g.translate(x,feet);g.scale(k,k);
  for(const xx of [0,176])cut(g,xx,-169,7,169,'#786146');
  poly(g,[[-16,-166],[160,-179],[203,-123],[9,-111]],'#6e7e70',true);
  for(let i=0;i<5;i++)poly(g,[[i*36-8,-166-i*2.5],[i*36+10,-167-i*2.5],[i*39+28,-113-i*2.3],[i*39+9,-112-i*2.3]],'#d8cdb0');
  line(g,[[9,-111],[203,-123]],'#5e6b5f',3);cut(g,11,-57,174,15,'#9c7e52');
  cut(g,20,-42,12,42,'#756047');cut(g,166,-42,12,42,'#756047');cut(g,30,-82,48,24,'#b6a078');cut(g,95,-89,60,31,'#8e7754');
  for(const [a,b]of [[45,-83],[58,-85],[117,-90],[132,-91]]){g.fillStyle=material(g,'#a89456');g.beginPath();g.ellipse(a,b,9,6,0,0,7);g.fill();}g.restore();
 }
 function square(g,tall,D,view){
  const W=D.w,H=D.h,horizon=tall?470:298,vx=W*.55;
  // Extend sky and paving through the margins so the scene fills every aspect.
  const left=-view.left/view.scale-8,right=W+view.left/view.scale+8;
  const top=-view.top/view.scale-8,bottom=H+view.top/view.scale+8;
  const sky=g.createLinearGradient(0,top,0,horizon);sky.addColorStop(0,'#a9b8b5');sky.addColorStop(1,'#e4d8bc');g.fillStyle=sky;g.fillRect(left,top,right-left,horizon-top+4);
  for(const [xx,yy,ww]of [[W*.1,80,W*.26],[W*.57,tall?170:92,W*.31]])poly(g,[[xx,yy+18],[xx+ww*.18,yy],[xx+ww*.4,yy+3],[xx+ww*.55,yy-9],[xx+ww*.8,yy+8],[xx+ww,yy+21]],'#d6d8c4');
  poly(g,[[left,horizon-17],[W*.16,horizon-34],[W*.31,horizon-22],[W*.48,horizon-43],[W*.68,horizon-30],[W*.87,horizon-44],[right,horizon-23],[right,horizon+40],[left,horizon+40]],'#b9b8a1');
  palaceExterior(g,tall?377:806,horizon-8,tall?.78:1.06);
  theatreExterior(g,tall?573:1107,horizon+7,tall?.68:.88);
  // Pale small houses, roof ridges and chimneys recede behind the church.
  for(let i=0;i<9;i++){const x=W*.07+i*W*.103,ww=W*.089,hh=40+(i*17%38);cut(g,x,horizon-hh,ww,hh+25,['#b5ae97','#c3b297','#beb39b'][i%3]);poly(g,[[x-4,horizon-hh],[x+ww*.45,horizon-hh-22],[x+ww+5,horizon-hh]],'#969a8a');cut(g,x+ww*.7,horizon-hh-25,7,18,'#a79d88');}
  const paving=g.createLinearGradient(0,horizon,0,H);paving.addColorStop(0,'#bab29a');paving.addColorStop(1,'#978e76');g.fillStyle=paving;g.fillRect(left,horizon,right-left,bottom-horizon);
  poly(g,[[vx-22,horizon],[vx+26,horizon],[W*.94,bottom],[W*.24,bottom]],'#c9bea1');
  // Rows and joints grow towards the camera and converge on one vanishing point.
  let row=0,previous=horizon;
  for(let depth=13;horizon+depth<bottom+100;depth*=1.3){const y=horizon+depth,spacing=11+depth*.19;
   line(g,[[left,y],[right,y]],'#817c694d',.5+depth/H*1.2);
   for(let x=left-spacing+(row%2)*spacing*.5;x<right;x+=spacing){const k=(previous-horizon)/(y-horizon),px=vx+(x-vx)*k;line(g,[[px,previous],[x,y]],'#80796345',.45+depth/H);}
   row++;previous=y;
  }
  line(g,[[vx-31,horizon+25],[W*.19,bottom]],'#d8ceb0',3);line(g,[[vx+40,horizon+25],[W*.98,bottom]],'#8d876e',3);
  churchExterior(g,tall?111:279,horizon+84,tall?.9:1.0);
  // Low walls and market furniture put the church behind the open square.
  poly(g,[[tall?70:215,horizon+93],[tall?332:577,horizon+93],[tall?342:590,horizon+110],[tall?60:203,horizon+110]],'#aaa38a');
  stall(g,tall?507:939,horizon+(tall?178:162),tall?.52:.59);
  townhouse(g,tall?-110:-80,tall?757:495,tall?207:260,tall?362:318,'#b99c76',.78);
  townhouse(g,tall?660:1189,tall?723:495,tall?200:241,tall?342:312,'#aa9d7e',.05);
  // Warm, close cut-outs frame the larger, cooler city beyond.
  stall(g,tall?-62:-50,H-9,tall?.9:1.38);
  g.save();g.translate(tall?676:1240,H+13);g.scale(tall?.72:1.0,tall?.72:1.0);barrel(g,0,-44);barrel(g,70,-32);g.restore();
  poly(g,[[left,H-8],[W*.16,H-14],[W*.26,bottom],[left,bottom]],'#847b65');
 }
 function render(canvas,kind){if(!['square','courtyard'].includes(kind))return approved.render(canvas,kind);const p=project(canvas);if(kind==='square')square(p.g,p.tall,p.D,p);else courtyard(p.g,p.tall,p.D);return {x:p.left+15*p.scale,y:p.top+(p.D.h-85)*p.scale,w:90*p.scale,h:75*p.scale};}
 function renderMemoryCloseup(canvas,kind){
  if(!['square','fort'].includes(kind))return approved.renderMemoryCloseup(canvas,kind);
  render(canvas,kind);const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);
  const w=r.width,h=r.height;cut(g,0,h*.63,w,h*.37,'#816a4c');cut(g,w*.18,h*.66,w*.52,h*.3,'#e7dcc3');
  g.strokeStyle='#887b65';g.lineWidth=2;for(let i=0;i<6;i++){g.beginPath();g.moveTo(w*.23,h*(.71+i*.035));g.lineTo(w*.6,h*(.71+i*.035));g.stroke();}return true;
 }
 window.UPPDRAG_ROOM_ART={...approved,names:{...approved.names,square:'Torget',courtyard:'Gården i Bostadskvarteren'},descriptions:{...approved.descriptions,square:'Torget 1743: gatsten och marknadsstånd, kyrkan bakom torget och slottet och Bollhuset på avstånd.',courtyard:'Karin, en stängd grind, en bänk och två tunnor.'},render,renderMemoryCloseup};
 UPPDRAG_ROOM_STAGING.PLANS.square={tilt:.025,wide:[[710,642,.59]],tall:[[435,962,.57]],player:{wide:[325,694,.63],tall:[157,1010,.57]}};
 UPPDRAG_ROOM_STAGING.PLANS.fort={tilt:.025,wide:[[1040,675,.72]],tall:[[575,965,.64]],player:{wide:[270,690,.8],tall:[125,990,.7]}};
 UPPDRAG_ROOM_STAGING.PLANS.courtyard={tilt:.04,wide:[[285,685,.8]],tall:[[285,975,.7]],player:{wide:[110,690,.75],tall:[100,990,.7]}};
 ROOM_BY_REGION.main.Torget='square';ROOM_BY_REGION.main.Bostadskvarteren='courtyard';
 return {yardFrame};
}
window.UPPDRAG_CH3_PRESENTATION={source,install};
})();
