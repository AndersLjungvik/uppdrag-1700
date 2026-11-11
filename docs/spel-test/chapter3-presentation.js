/* Retain the existing rooms, puppets and one world loop. New scenes use them. */
(function(){
'use strict';
function source(name,text){
 const edit=(before,after)=>{if(text.split(before).length!==2)throw Error('Kapitel 3: presentationsankaret matchar inte '+name+': '+before.slice(0,60));text=text.replace(before,after);};
 if(name==='meeting-ch3-pilot.js'){
  edit("    print:{name:'Brita'", "    square:{name:'Bonden',color:'#8d7656',role:'farmer-pike'},\n    courtyard:{name:'Karin',color:'#876d5d',woman:true,apron:true,role:'karin'},\n    fort:{name:'David',color:'#736957',role:'david'},\n    print:{name:'Brita'");
  edit("if(!woman){oval(-1,-301,47,9,color);", "if(!woman&&role!=='david'&&role!=='cap-party'&&role!=='farmer-pike'&&role!=='farmer-scythe'&&role!=='farmer-staff'&&role!=='farmer-rest'){oval(-1,-301,47,9,color);");
  edit("  }else if(role==='olof'){", "  }else if(role==='soldier-guard'){\n    // Blue coat, light crossbelt and dark tricorn distinguish the soldier.\n    oval(-1,-301,47,9,'#3e453f');\n    poly([[-43,-304],[-22,-331],[20,-330],[43,-304],[19,-298],[-20,-299]],'#3e453f');\n    poly([[-35,-215],[-25,-221],[32,-122],[21,-115]],'#d8d1b5');\n    cut(-41,-143,22,15,'#b9a06b');cut(27,-143,22,15,'#b9a06b');\n    cut(-38,-115,73,9,'#d8d1b5');\n    // Lowered brow and an upright, resting musket; no combat animation.\n    poly([[20,-280],[32,-277],[32,-274],[20,-277]],'#3e453f');\n    poly([[47,-12],[57,-11],[62,-95],[55,-115],[49,-107]],'#6c503a');\n    poly([[50,-111],[56,-111],[61,-342],[56,-344]],'#677267');\n    cut(50,-173,10,7,'#b5aa87');oval(54,-133,10,11,'#c9a57c');\n  }else if(role==='farmer-pike'||role==='farmer-scythe'||role==='farmer-staff'||role==='farmer-rest'){\n    poly([[-33,-285],[-35,-301],[-24,-318],[1,-321],[26,-312],[35,-285]],'#8b8064');\n    cut(-33,-292,68,11,'#756b52');\n    // Patched, uneven wool clothes and a bread bag distinguish the marchers.\n    poly([[-45,-123],[-27,-125],[-24,-113],[-10,-120],[1,-111],[14,-117],[28,-110],[43,-121],[45,-105],[27,-94],[-5,-103],[-39,-97]],'#736148');\n    poly([[-39,-212],[-22,-214],[-19,-188],[-37,-184]],'#a89572');\n    if(role!=='farmer-rest'){poly([[12,-78],[29,-76],[27,-52],[10,-56]],'#8e7a59');cut(-37,-37,19,8,'#89775b');}\n    poly([[-45,-219],[-37,-224],[23,-132],[16,-125]],'#a28c67');\n    poly([[6,-154],[34,-158],[43,-119],[13,-112]],'#a18b65');\n    if(role==='farmer-rest'){oval(-16,-280,15,14,'#a3997f');cut(-20,-303,43,7,'#847e68');}\n    else if(role==='farmer-staff'){\n      poly([[46,-9],[52,-9],[69,-267],[62,-268]],'#6d573e');oval(57,-135,10,11,'#c9a57c');\n    }else if(!window.UPPDRAG_CH3_SCENES?.story.afterUprising)uprisingWeapon(role==='farmer-scythe');\n  }else if(role==='cap-party'){\n    poly([[-33,-286],[-36,-302],[-27,-316],[-5,-322],[23,-316],[35,-302],[36,-287]],'#7b866b');\n    cut(-34,-295,70,12,'#65745e');\n  }else if(role==='hat-party'){\n    oval(-1,-301,47,9,'#4f4b40');\n    poly([[-43,-304],[-22,-331],[20,-330],[43,-304],[19,-298],[-20,-299]],'#4f4b40');\n    poly([[-39,-304],[-18,-311],[18,-310],[39,-303],[18,-298],[-17,-299]],'#81765b');\n  }else if(role==='david'){\n    // Plain working clothes and rolled sleeves; no clerk's hat or quill.\n    poly([[-32,-219],[24,-219],[33,-118],[-31,-115]],'#a99d81');\n    poly([[-31,-289],[-17,-305],[13,-307],[32,-292],[12,-286],[-12,-283]],'#6a5540');\n    poly([[16,-244],[30,-245],[28,-232],[16,-234]],'#8d795c');\n    cut(-34,-216,15,21,'#d3c5a5');cut(27,-215,15,20,'#d3c5a5');\n    cut(-31,-119,61,8,'#786a51');cut(-14,-204,5,44,'#756a53');\n  }else if(role==='olof'){");
  edit("function puppet(x,foot,color,","function uprisingWeapon(scythe){\n // Resting polearms, based on Dalupproret objects in Livrustkammaren.\n // https://samlingar.shm.se/object/54C3F72B-F176-4B2D-804A-E5C008A67559\n poly([[47,-18],[54,-18],[65,-353],[58,-353]],'#786247');\n poly([[57,-356],[66,-356],[66,-343],[57,-343]],'#69716a');\n if(scythe)poly([[59,-350],[62,-431],[68,-459],[81,-470],[77,-440],[71,-391],[67,-350]],'#a4ada3');\n else poly([[56,-353],[56,-373],[61,-415],[69,-373],[67,-353]],'#a5afa6');\n poly([[59,-351],[63,-351],[64,-329],[59,-329]],'#d1c2a0');\n // Visible fingers close around the shaft instead of a floating weapon.\n oval(52,-131,10,10,'#c9a57c');\n}\nfunction puppet(x,foot,color,");
  edit(" limb(-19,-105,20,92,stride,'#bca87b');limb(20,-105,20,92,-stride,'#bca87b');cut(-36,-19+Math.sin(stride)*10,40,17,'#413b31');cut(6,-19-Math.sin(stride)*10,43,17,'#413b31');", " if(role==='farmer-rest'){poly([[-29,-111],[25,-111],[81,-88],[77,-69],[-24,-87]],'#8f7d5c');poly([[55,-86],[77,-86],[76,-14],[59,-13]],'#ac9871');poly([[27,-94],[48,-91],[46,-15],[29,-14]],'#a18b66');cut(28,-16,36,15,'#413b31');cut(58,-17,36,15,'#413b31');}else{limb(-19,-105,20,92,stride,'#bca87b');limb(20,-105,20,92,-stride,'#bca87b');cut(-36,-19+Math.sin(stride)*10,40,17,'#413b31');cut(6,-19-Math.sin(stride)*10,43,17,'#413b31');}");
  edit("const PLACEMENT={", "const PLACEMENT={\n    square:{wide:[[325,688,.63],[710,642,.59]],tall:[[157,990,.57],[435,962,.57]]},\n    courtyard:{wide:[[110,690,.75],[285,685,.8]],tall:[[100,990,.7],[285,975,.7]]},\n    fort:{wide:[[270,690,.8],[1040,675,.86]],tall:[[125,990,.7],[575,965,.64]]},");
  edit("key=quay?dockKey:window.UPPDRAG_STORY_WORLD?.roomKey?.(storyPlace)||interior.kind", "key=quay?dockKey:interior.kind");
  edit("const c=current();if(!c?.cast||dialogue||voyage)return false;", "const c=current();if(!c?.cast||dialogue||voyage||window.UPPDRAG_EVENT_ENGINE?.busy||window.UPPDRAG_CH3_SCENES?.busy)return false;");
  edit('    const pilot=window.UPPDRAG_CH3_PILOT;', '    if(window.UPPDRAG_CH3_SCENES)return window.UPPDRAG_CH3_SCENES.openRoom(c.key);\n    const pilot=window.UPPDRAG_CH3_PILOT;');
  edit("const a=puppets(g),speaker=talk?.active?talk.speaker:(dialogue?dialogue.cast.lines[dialogue.index][0]:'');", "const voice=window.UPPDRAG_EVENT_ENGINE?.roomVoice;if(voice){speechAt=voice.at;speechEnd=voice.end;}\n    const a=puppets(g),speaker=window.UPPDRAG_EVENT_ENGINE?.roomSpeaker||(talk?.active?talk.speaker:(dialogue?dialogue.cast.lines[dialogue.index][0]:''));");
  edit('    g.restore();\n    const chapterOneOnly=', '    window.UPPDRAG_CH3_SCENES?.drawProps(g,c.key,geometry.w/geometry.h<1.02,now,a);\n    g.restore();\n    const chapterOneOnly=');
  edit('    drawings.sort((a,b)=>a.pos[1]-b.pos[1]);', '    for(const actor of window.UPPDRAG_CH3_SCENES?.roomActors?.(geometry)||[])drawings.push({pos:actor.pos,who:actor,right:false});\n    drawings.sort((a,b)=>a.pos[1]-b.pos[1]);');
  edit("person.hidden=!c.cast||!!dialogue||!!controller(c.key)?.busy;", "person.hidden=!c.cast||!!dialogue||!!controller(c.key)?.busy||!!window.UPPDRAG_EVENT_ENGINE?.busy||!!window.UPPDRAG_CH3_SCENES?.busy;");
  edit('const animating=(dialogue||', 'const animating=(dialogue||window.UPPDRAG_EVENT_ENGINE?.roomSpeaker||');
  edit('geometryForRoom:measure,drawMapPerson', 'geometryForRoom:measure,redraw(){lastPaint=-Infinity;drawPeople(performance.now());},drawRoomPerson(g,pos,who,now,speaking=false){puppets(g).side(...pos,who,false,now,speaking,false,false,0,0,null);},drawMapPerson');
  edit("quay:'Jos krigsbrev',print:'Brita tryckblad',archive:'Ruts bokhyllor'", "quay:'Resa till Marstrand',print:'Britas tryckblad',archive:'Ruts bokhyllor',palace:'Amiras kartblad',square:'Bönder och soldater',courtyard:'Den stängda gården',fort:'David och fästningsvakten'");
 }
 if(name==='world-keyboard-ch3.js'){
  edit('  function interact(){','  function interact(){\n    if(window.UPPDRAG_CH3_PROVISIONS?.interact?.())return true;');
  edit('window.UPPDRAG_CH3_CITY_LIFE?.active);','window.UPPDRAG_CH3_CITY_LIFE?.active||window.UPPDRAG_CH3_PROVISIONS?.busy);');
 }
 if(name==='chapter3-street-life.js'){
  edit("function drawFigure(ctx,a,now,scale=1){","function drawUprisingWeapon(ctx,a){\n if(a.role!=='farmer'||phase()!==2)return;\n ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.heading||0);\n paper(ctx,[[-24,-17],[39,-17],[39,-14],[-24,-14]],'#786247');\n // Weapon type belongs to the marcher, never to the current map pixel.\n const scythe=a.polearm==='scythe';\n if(scythe)paper(ctx,[[35,-18],[49,-23],[60,-24],[55,-19],[41,-13],[35,-13]],'#a4ada3');\n else paper(ctx,[[37,-20],[56,-15.5],[37,-12]],'#a5afa6');\n paper(ctx,[[31,-18],[35,-18],[35,-13],[31,-13]],'#5f6862');ctx.restore();\n}\nfunction drawFigure(ctx,a,now,scale=1){");
  edit(" cap(ctx,a);ctx.restore();", " cap(ctx,a);drawUprisingWeapon(ctx,a);ctx.restore();");
  edit("function step(){const state=window.UPPDRAG_CH3_PILOT?.state;", "function step(){if(window.UPPDRAG_CH3_SCENES)return window.UPPDRAG_CH3_SCENES.streetStep;const state=window.UPPDRAG_CH3_PILOT?.state;");
  edit("const x=cur===2?2448-410*progress.fraction:Math.max(2038,phase3FarmerX-t*.009);", "const x=cur===2?2448-410*progress.fraction:2038;");
  edit("const moving=cur===2?progress.moving:!reduced?.matches&&x>2038;", "const moving=cur===2?progress.moving:false;");
  edit(" if(a.id==='farmers'){\n  // Ragged", " if(a.id==='farmers'&&phase()===3){drawFigure(ctx,a,now);return;}\n if(a.id==='farmers'){\n  // Ragged");
  // Keep each polearm rigidly attached to the same hand and heading. Only
  // the existing walking feet/hands animate; no extra sticks appear/disappear.
  edit('  const elapsed=Math.max(0,now-enteredAt);\n  const figures=', '  const figures=');
  edit("    const excited=!reduced?.matches&&Math.sin(elapsed/540+j*1.8)>-.25;\n    const shake=excited?Math.sin(elapsed/170+j)*3:0;\n    const follower={...a,x:a.x+dx+shake,y:a.y+dy+(excited?Math.sin(elapsed/230+j)*2:0),\n      heading:Math.PI+(excited?Math.sin(elapsed/530+j)*.24:0),", "    const follower={...a,x:a.x+dx,y:a.y+dy,\n      heading:a.heading,polearm:j%2?'scythe':'pike',");
  edit("    if(excited){\n      const sx=follower.x+Math.cos(j*2)*8,sy=follower.y-10;\n      paper(ctx,[[sx-1,sy-17],[sx+2,sy-17],[sx+5,sy+7],[sx+1,sy+8]],'#72563d');\n    }\n", '');
  edit("  if(a.crowdShouting)paper(ctx,[[a.x-3,a.y-17],[a.x+1,a.y-17],[a.x+15,a.y+2],[a.x+11,a.y+5]],'#5e4c3b');\n", '');
  edit('const minY=9,maxY=Math.max(minY,layout.h-height-10);', 'const minY=9,maxY=Math.max(minY,layout.h-height-10-(window.UPPDRAG_CH3_SCENES?.patrolReplyHeight||0));');
  edit('function next(){', 'function next(){\n if(window.UPPDRAG_CH3_SCENES?.patrolQuestionActive)return true;');
  edit('function open(actor){', 'function open(actor,providedLines=null){');
  edit('const sequence=story(source);', 'const sequence=providedLines||story(source);');
  edit("mode:startWithPlayer?'lines':'greeting'", "mode:(providedLines||startWithPlayer)?'lines':'greeting'");
  edit(" root.hidden=false;putSpeech(active,speaker.textContent);\n box.focus", " root.hidden=false;putSpeech(active,speaker.textContent);\n window.UPPDRAG_CH3_SCENES?.patrolReplies(active,lineIndex===lines.length-1);\n box.focus");
  edit(' box.focus({preventScroll:true});return true;', ' if(!window.UPPDRAG_CH3_SCENES?.patrolQuestionActive)box.focus({preventScroll:true});return true;');
  edit(' active=null;lineIndex=0;arrivalCandidate=null;teaserHiddenUntil=now+1700;', ' active=null;lineIndex=0;arrivalCandidate=null;teaserHiddenUntil=now+1700;\n window.UPPDRAG_CH3_SCENES?.closePatrol();');
 }
 if(name==='more-room-ch3-pilot.js')edit('bed(g,bx,feet,188);bed(g,bx+222,feet,188);','bed(g,bx,feet,188);window.UPPDRAG_CH3_SCENES?.drawInheritedBed(g,bx,feet,188);bed(g,bx+222,feet,188);');
 return text;
}
// One uniform paper stage for furniture, people and the barrel hit targets.
function yardFrame(tall){return tall?{x:35,y:330,sx:1,sy:1}:{x:440,y:205,sx:1.05,sy:1.05};}
function install(){
 const approved=window.UPPDRAG_ROOM_ART;
 const project=(canvas)=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),tall=r.width/r.height<1.02,D=tall?{w:720,h:1040}:{w:1280,h:720},scale=Math.min(r.width/D.w,r.height/D.h);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);const g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,r.width,r.height);g.translate((r.width-D.w*scale)/2,(r.height-D.h*scale)/2);g.scale(scale,scale);return {g,tall,D,scale,left:(r.width-D.w*scale)/2,top:(r.height-D.h*scale)/2};};
 // The quay's actual paper, rather than an even tint over the whole city.
 // Samples and outlines stay fixed between paints: no random edge flicker.
 const tiles=new Map(),patterns=new WeakMap();let grain=null,grainMean=0;
 const textureReady=typeof Image==='function'?new Promise(resolve=>{
  const img=new Image();img.onload=()=>{try{
   const original=document.createElement('canvas');original.width=1280;original.height=720;original.getContext('2d').drawImage(img,0,0,1280,720);
   const source=document.createElement('canvas');source.width=360;source.height=220;const g=source.getContext('2d');
   for(let x=0;x<2;x++)for(let y=0;y<2;y++){g.save();g.translate(x?360:0,y?220:0);g.scale(x?-1:1,y?-1:1);g.drawImage(original,400,595,180,110,0,0,180,110);g.restore();}
   const pixels=g.getImageData(0,0,360,220).data;grain=new Float32Array(360*220);let sum=0;
   for(let i=0;i<grain.length;i++){const j=i*4;grain[i]=pixels[j]*.2126+pixels[j+1]*.7152+pixels[j+2]*.0722;sum+=grain[i];}grainMean=sum/grain.length;
   tiles.clear();resolve(true);if(typeof renderInterior==='function'&&typeof interior!=='undefined'&&interior&&['square','courtyard'].includes(interior.kind)){renderInterior();window.UPPDRAG_MEETINGS?.redraw?.();}
  }catch{resolve(false);}};img.onerror=()=>resolve(false);img.src=new URL('../world/assets/quay.webp',document.baseURI).href;setTimeout(()=>resolve(false),8000);
 }):Promise.resolve(false);
 function material(g,color){
  if(!grain)return window.UPPDRAG_PAPER_FIBRES?.material?.(g,color,'piece')||color;
  let cache=patterns.get(g);if(!cache){cache=new Map();patterns.set(g,cache);}if(cache.has(color))return cache.get(color);
  if(!tiles.has(color)){
   const tile=document.createElement('canvas');tile.width=360;tile.height=220;const t=tile.getContext('2d'),image=t.createImageData(360,220),rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
   for(let i=0;i<grain.length;i++){const fibre=(grain[i]-grainMean)*.85;for(let k=0;k<3;k++)image.data[i*4+k]=Math.max(0,Math.min(255,rgb[k]+fibre));image.data[i*4+3]=255;}t.putImageData(image,0,0);tiles.set(color,tile);
  }const pattern=g.createPattern(tiles.get(color),'repeat');cache.set(color,pattern);return pattern;
 }
 function edge(points){
  const out=[];for(let i=0;i<points.length;i++){
   const a=points[i],b=points[(i+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),n=Math.max(1,Math.ceil(length/11));
   for(let j=0;j<n;j++){const t=j/n,jitter=j?Math.sin(a[0]*.31+a[1]*.19+j*2.71)*.85+Math.sin(j*7.3+i)*.35:0;out.push([a[0]+dx*t-dy/(length||1)*jitter,a[1]+dy*t+dx/(length||1)*jitter]);}
  }return out;
 }
 function poly(g,points,color,shadow=false,rim=true){
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys);
  const pts=rim?edge(points):points;g.save();g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
  if(shadow){g.shadowColor='#352b2455';g.shadowOffsetX=2;g.shadowOffsetY=4;g.shadowBlur=2;}
  const pigment=material(g,color);pigment?.setTransform?.({a:1,b:0,c:0,d:1,e:Math.floor(Math.min(...xs)*.71)%180,f:Math.floor(Math.min(...ys)*.37)%110});
  g.fillStyle=pigment;g.fill();g.shadowColor='transparent';
  if(rim){g.strokeStyle='#eadcc0';g.lineWidth=Math.min(1.8,Math.min(w,h)*.06);g.lineJoin='bevel';g.stroke();}
  g.restore();
 }
 function cut(g,x,y,w,h,color,shadow=true){poly(g,[[x+1,y+2],[x+w*.31,y],[x+w*.68,y+1],[x+w-1,y],[x+w,y+h*.43],[x+w-2,y+h],[x+w*.6,y+h-1],[x,y+h-2]],color,shadow);}
 function line(g,points,color,width=1){g.save();g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();g.restore();}
 function field(g,x,y,w,h,color){const pigment=material(g,color);pigment?.setTransform?.({a:1,b:0,c:0,d:1,e:0,f:0});g.fillStyle=pigment;g.fillRect(x,y,w,h);}
 function limits(D,view){return {left:-view.left/view.scale-8,right:D.w+view.left/view.scale+8,top:-view.top/view.scale-8,bottom:D.h+view.top/view.scale+8};}
 function groundShadow(g,x,y,rx,ry=7){g.save();g.fillStyle='#4f40292d';g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();g.restore();}
 // Barrel centres and footprint (70 x 85) match the saved puzzle slots.
 function barrel(g,x,y){g.save();g.translate(x,y);groundShadow(g,0,43,36,6);
  poly(g,[[-24,-40],[23,-42],[33,-28],[35,15],[24,40],[-23,42],[-35,19],[-34,-23]],'#886b4a',true);
  for(const [xx,shift]of [[-17,0],[-1,-1],[17,1]])line(g,[[xx,-34],[xx+shift,33]],'#544737',1.6);
  poly(g,[[-33,-23],[33,-25],[34,-15],[-34,-13]],'#5a5c51');poly(g,[[-33,18],[33,16],[29,26],[-29,28]],'#5a5c51');
  poly(g,[[-24,-40],[-16,-45],[18,-45],[24,-41],[16,-35],[-17,-34]],'#66533e');g.restore();
 }
 function windowPiece(g,x,y,w,h){
  cut(g,x-4,y-4,w+8,h+8,'#ded0b0');cut(g,x,y,w,h,'#596b69',false);
  cut(g,x+w*.46,y+1,Math.max(3,w*.07),h-2,'#bbaa86',false);cut(g,x+1,y+h*.52,w-2,Math.max(3,h*.05),'#bbaa86',false);
  poly(g,[[x+4,y+5],[x+w*.39,y+4],[x+w*.4,y+h*.48],[x+3,y+h*.48]],'#87988a',false,false);
 }
 function courtyard(g,tall,D,view){
  const B=limits(D,view);field(g,B.left,B.top,B.right-B.left,B.bottom-B.top,'#82959e');
  const Y=yardFrame(tall),backFloor=Y.y+40*Y.sy;
  field(g,B.left,backFloor,B.right-B.left,B.bottom,'#b7a58a');
  // Neighbouring gables and side wings frame the yard as a little paper stage.
  poly(g,[[B.left,84],[tall?-12:137,30],[tall?65:343,173],[tall?62:346,tall?760:538],[B.left,tall?768:551]],'#955a45',true);
  poly(g,[[B.left,83],[tall?-14:138,20],[tall?75:357,167],[tall?61:341,179],[tall?-14:136,42],[B.left,104]],'#645e51',true);
  if(!tall){windowPiece(g,51,206,70,111);windowPiece(g,200,233,61,95);cut(g,45,445,99,103,'#514a3b');}
  else windowPiece(g,-32,290,55,118);
  const s=window.UPPDRAG_CH3_SCENES?.courtyard||{phase:'available',layout:{a:'bench',b:'path'}};
  g.save();g.translate(Y.x,Y.y);g.scale(Y.sx,Y.sy);
  poly(g,[[-73,40],[650,40],[684,428],[-77,431]],'#ad9b7c',false,false);
  poly(g,[[-72,-101],[241,-176],[647,-91],[650,40],[-72,40]],'#c4ac82',true);
  poly(g,[[-93,-103],[241,-180],[670,-91],[655,-74],[245,-157],[-80,-84]],'#6d7568',true);
  cut(g,242,-184,30,52,'#925b43');cut(g,235,-188,43,11,'#67574a');
  // One large window and a planked door, each assembled from separate pieces.
  windowPiece(g,35,-100,105,110);cut(g,24,13,127,12,'#ded0af');
  cut(g,390,-137,113,177,'#e0ccaa');cut(g,399,-130,95,170,'#4e493d');cut(g,406,-124,81,164,'#846647');
  for(const xx of [425,446,467])line(g,[[xx,-118],[xx+1,31]],'#544838',2);
  cut(g,404,25,85,10,'#67533e');cut(g,470,-48,8,17,'#d1b276');
  poly(g,[[385,39],[508,39],[520,53],[374,55]],'#a2957c',true);
  // The path still denotes exactly the same free passage as the puzzle model.
  poly(g,[[397,48],[495,48],[506,427],[387,427]],'#ccbea0',false);
  for(const [x,y,w,h]of [[401,85,39,19],[450,145,40,21],[399,220,43,22],[448,300,42,25],[400,380,46,25]])poly(g,[[x,y],[x+w,y+1],[x+w-2,y+h],[x+1,y+h]],'#b3a58b',false,false);
  // A substantial seat and backrest make the blocked bench easy to recognise.
  groundShadow(g,273,242,99,8);cut(g,183,126,14,111,'#5e503d');cut(g,345,124,15,112,'#5e503d');
  poly(g,[[171,128],[368,124],[369,144],[173,149]],'#8d6b48',true);
  poly(g,[[174,170],[362,167],[378,181],[166,186]],'#92744e',true);cut(g,172,183,198,13,'#745a3e');
  cut(g,181,195,16,45,'#5c4c38');cut(g,345,194,16,44,'#5c4c38');
  // Washing and a pot are quiet, broad shapes, not repeated facade ornaments.
  line(g,[[164,-105],[239,-90],[341,-106]],'#645644',2);
  poly(g,[[191,-99],[232,-95],[234,-45],[193,-49]],'#e4d7b8',true);poly(g,[[255,-96],[294,-100],[300,-60],[258,-54]],'#7d8a7b',true);
  cut(g,199,-103,5,11,'#735c40');cut(g,277,-104,5,11,'#735c40');
  groundShadow(g,569,269,23,5);poly(g,[[548,227],[587,227],[579,268],[554,267]],'#975b46',true);
  for(const pts of [[[564,233],[544,207],[548,186],[566,212]],[[566,231],[572,199],[588,187],[582,216]],[[563,231],[529,217],[517,201],[547,207]]])poly(g,pts,'#718369');
  const slots=window.UPPDRAG_CH3_COURTYARD_PUZZLE.slots;
  ['a','b'].map(id=>slots[s.layout?.[id]]||slots[id==='a'?'bench':'path']).sort((a,b)=>a.y-b.y).forEach(p=>barrel(g,p.x,p.y));
  // The fence is in front of the yard. The open gate turns out of the path.
  for(const [x,w]of [[-52,445],[504,181]]){cut(g,x,357,w,14,'#806446');cut(g,x,397,w,13,'#806446');}
  for(const x of [-48,21,93,165,238,311,383,507,580,670])poly(g,[[x,338],[x+9,329],[x+18,338],[x+17,428],[x+1,430]],'#766044',true);
  if(s.phase!=='open'){
   for(const x of [403,423,443,463,483])cut(g,x,346,13,77,'#96764e');
   poly(g,[[400,410],[493,354],[497,363],[403,421]],'#725b3e',true);cut(g,399,366,100,11,'#816344');
  }else{
   poly(g,[[506,349],[580,370],[580,433],[506,419]],'#8f704c',true);
   for(const x of [525,547,568])line(g,[[x,359+(x-506)*.28],[x,423+(x-506)*.16]],'#5b4c38',2);
   poly(g,[[508,408],[578,378],[578,386],[509,419]],'#66533b');
  }g.restore();
  // Near ground and a cropped crate tie the yard to the same tactile quay art.
  poly(g,[[B.left,D.h-46],[D.w*.35,D.h-37],[D.w*.47,B.bottom],[B.left,B.bottom]],'#a5967b',false,false);
  if(!tall){cut(g,1183,620,116,106,'#8d6d49');cut(g,1188,635,111,12,'#d7c8a5');cut(g,1188,690,111,11,'#d7c8a5');}
 }
 // A layered stage for 1743, not a measured reconstruction of Stockholm.
 // Bollhuset precedes the Gustavian opera house (which opened in 1782).
 // https://arkivet.operan.se/repertoar/spelplatser
 function churchExterior(g,x,feet,k){g.save();g.translate(x,feet);g.scale(k,k);
  poly(g,[[-8,-130],[34,-156],[190,-150],[217,-119],[219,1],[-7,2]],'#b5a078',true);
  poly(g,[[-18,-129],[36,-170],[190,-164],[229,-122],[212,-113],[31,-149]],'#626f66',true);
  poly(g,[[119,-239],[181,-242],[190,0],[118,1]],'#c7b28c',true);cut(g,177,-237,14,237,'#a58d68');
  cut(g,111,-244,80,13,'#d9c59d');cut(g,129,-276,46,36,'#baa98b');
  poly(g,[[121,-275],[135,-292],[173,-291],[185,-274]],'#6e7b70',true);
  poly(g,[[136,-291],[144,-308],[148,-334],[160,-351],[170,-333],[174,-310],[181,-290]],'#5a726e',true);
  line(g,[[159,-350],[159,-365]],'#4c5d55',2);line(g,[[153,-360],[165,-360]],'#4c5d55',2);
  for(const xx of [18,65])poly(g,[[xx,-41],[xx,-101],[xx+11,-117],[xx+23,-102],[xx+24,-40]],'#536359');
  poly(g,[[138,0],[138,-83],[151,-99],[167,-82],[168,0]],'#61543e');
  poly(g,[[140,-217],[153,-228],[168,-217],[167,-201],[152,-192],[139,-202]],'#ded0ab');line(g,[[153,-219],[153,-210],[161,-207]],'#617062',2);
  poly(g,[[-22,1],[229,0],[241,15],[-30,17]],'#948d75',true);g.restore();
 }
 function palaceExterior(g,x,feet,k){g.save();g.translate(x,feet);g.scale(k,k);
  poly(g,[[0,-103],[82,-106],[83,-125],[221,-123],[223,-106],[303,-105],[304,0],[0,2]],'#c0b093',true);
  cut(g,80,-129,147,10,'#7f877c');cut(g,-7,-109,91,9,'#7f877c');cut(g,222,-109,88,9,'#7f877c');
  for(const [xx,yy]of [[19,-86],[52,-86],[97,-103],[124,-102],[151,-103],[178,-102],[205,-103],[245,-87],[279,-87],[98,-62],[151,-62],[205,-62]])cut(g,xx,yy,10,17,'#737f75',false);
  cut(g,140,-35,27,36,'#7f8070');g.restore();
 }
 function theatreExterior(g,x,feet,k){g.save();g.translate(x,feet);g.scale(k,k);
  cut(g,0,-70,132,70,'#ae9b80');poly(g,[[-10,-72],[19,-94],[115,-91],[144,-65]],'#7f756a',true);
  for(const xx of [15,47,80,111])cut(g,xx,-55,11,22,'#637368',false);cut(g,55,-28,23,28,'#756650');g.restore();
 }
 function townhouse(g,x,feet,w,h,color,side){
  poly(g,[[x,feet-h],[x+w*.47,feet-h-68],[x+w,feet-h+12],[x+w-3,feet+3],[x+2,feet]],color,true);
  poly(g,[[x-13,feet-h+1],[x+w*.47,feet-h-75],[x+w+15,feet-h+9],[x+w,feet-h+23],[x+w*.47,feet-h-57],[x-9,feet-h+18]],'#645f53',true);
  for(const [xx,yy]of [[x+w*.18,feet-h+48],[x+w*.56,feet-h+46],[x+w*.17,feet-h+134],[x+w*.57,feet-h+137]])windowPiece(g,xx,yy,w*.16,Math.min(58,h*.15));
  cut(g,x+w*.37,feet-102,w*.29,102,'#514a3b');cut(g,x+w*.33,feet-110,w*.37,12,'#d3bd95');
 }
 function stall(g,x,feet,k){g.save();g.translate(x,feet);g.scale(k,k);
  for(const xx of [0,176])cut(g,xx,-168,8,168,'#745b40');
  poly(g,[[-16,-168],[158,-180],[201,-125],[174,-114],[144,-119],[112,-111],[78,-116],[42,-108],[8,-113]],'#617d70',true);
  for(const i of [0,2,4])poly(g,[[i*36-8,-167-i*2.5],[i*36+10,-168-i*2.5],[i*39+28,-113-i*2.3],[i*39+9,-112-i*2.3]],'#dfd1af');
  poly(g,[[11,-57],[181,-61],[190,-45],[7,-42]],'#99764e',true);cut(g,19,-41,12,41,'#67503b');cut(g,165,-43,12,43,'#67503b');
  cut(g,30,-84,48,25,'#ac8a5f');cut(g,96,-89,58,30,'#866a48');
  for(const [a,b]of [[45,-86],[61,-88],[118,-92],[135,-92]])poly(g,[[a-8,b],[a-5,b-8],[a+3,b-10],[a+9,b-2],[a+6,b+5],[a-5,b+6]],'#bd9c5b');g.restore();
 }
 function square(g,tall,D,view){
  const W=D.w,H=D.h,horizon=tall?465:318,B=limits(D,view);
  field(g,B.left,B.top,B.right-B.left,B.bottom-B.top,'#8499a1');
  poly(g,[[W*.11,tall?140:94],[W*.17,tall?126:80],[W*.22,tall?132:85],[W*.27,tall?118:73],[W*.34,tall?139:91],[W*.4,tall?147:100],[W*.21,tall?151:107]],'#c7ccc0');
  // Three distinct layers of roofs; flat pieces overlap instead of becoming a grid.
  poly(g,[[B.left,horizon-11],[W*.12,horizon-43],[W*.22,horizon-34],[W*.4,horizon-63],[W*.57,horizon-42],[W*.73,horizon-57],[B.right,horizon-28],[B.right,horizon+45],[B.left,horizon+45]],'#899587',false);
  palaceExterior(g,tall?375:790,horizon+6,tall?.85:1.08);theatreExterior(g,tall?561:1058,horizon+24,tall?.75:.92);
  for(const [xx,ww,hh,color]of [[-.03,.15,70,'#a8aa94'],[.13,.18,57,'#b2a68c'],[.4,.17,62,'#9b9b83'],[.61,.13,48,'#b3ac91']]){
   const x=W*xx,w=W*ww;poly(g,[[x,horizon-hh],[x+w*.45,horizon-hh-28],[x+w,horizon-hh+3],[x+w,horizon+20],[x,horizon+20]],color,true);
   poly(g,[[x-4,horizon-hh],[x+w*.45,horizon-hh-32],[x+w+6,horizon-hh+1]],'#707f72');
  }
  field(g,B.left,horizon+26,B.right-B.left,B.bottom-horizon,'#b2a286');
  poly(g,[[W*.39,horizon+26],[W*.61,horizon+25],[W*.89,B.bottom],[W*.16,B.bottom]],'#c0b194',false,false);
  // A few separate stone chips suggest the ground, without ruled perspective lines.
  for(const [xx,yy,ww,hh]of [[.40,.60,.046,.017],[.48,.65,.048,.019],[.35,.73,.063,.025],[.55,.78,.059,.021],[.65,.86,.069,.028],[.46,.94,.075,.025],[.77,.97,.055,.031],[.23,.90,.064,.022]]){
   const x=W*xx,y=H*yy,w=W*ww,h=H*hh;poly(g,[[x,y+2],[x+w*.67,y],[x+w,y+h*.5],[x+w*.8,y+h],[x+3,y+h-1]],'#aa9a7e',false,false);
  }
  churchExterior(g,tall?80:255,horizon+96,tall?.96:1.08);
  poly(g,[[tall?55:218,horizon+104],[tall?312:529,horizon+100],[tall?332:551,horizon+123],[tall?44:201,horizon+129]],'#938e76',true);
  stall(g,tall?513:875,horizon+(tall?185:180),tall?.56:.55);
  townhouse(g,tall?-131:-106,tall?770:560,tall?226:290,tall?405:387,'#965c47',.78);
  townhouse(g,tall?660:1150,tall?755:575,tall?219:271,tall?379:374,'#b7a27d',.05);
  stall(g,tall?-66:-45,H-6,tall?.96:1.35);
  if(!tall){g.save();g.translate(1248,H+3);g.scale(1.13,1.13);barrel(g,0,-37);barrel(g,69,-24);g.restore();}
  poly(g,[[B.left,H-12],[W*.15,H-20],[W*.25,B.bottom],[B.left,B.bottom]],'#9a896d',false,false);
 }
 function render(canvas,kind){if(!['square','courtyard'].includes(kind))return approved.render(canvas,kind);const p=project(canvas);if(kind==='square')square(p.g,p.tall,p.D,p);else courtyard(p.g,p.tall,p.D,p);return {x:p.left+15*p.scale,y:p.top+(p.D.h-85)*p.scale,w:90*p.scale,h:75*p.scale};}
 function renderMemoryCloseup(canvas,kind){
  if(!['square','fort'].includes(kind))return approved.renderMemoryCloseup(canvas,kind);
  render(canvas,kind);const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);
  const w=r.width,h=r.height;cut(g,0,h*.63,w,h*.37,'#816a4c');cut(g,w*.18,h*.66,w*.52,h*.3,'#e7dcc3');
  g.strokeStyle='#887b65';g.lineWidth=2;for(let i=0;i<6;i++){g.beginPath();g.moveTo(w*.23,h*(.71+i*.035));g.lineTo(w*.6,h*(.71+i*.035));g.stroke();}return true;
 }
 window.UPPDRAG_ROOM_ART={...approved,names:{...approved.names,square:'Torget',courtyard:'Gården i Bostadskvarteren'},ready:Promise.all([approved.ready,textureReady]).then(v=>v.every(x=>x!==false)),descriptions:{...approved.descriptions,square:'Torget 1743: en grupp bönder och ett soldatled på var sin sida, kyrkan bakom torget och slottet och Bollhuset på avstånd.',courtyard:'Karin och tre trötta bönder vid en gård med grind, bänk och två flyttbara tunnor.'},render,renderMemoryCloseup};
 UPPDRAG_ROOM_STAGING.PLANS.square={tilt:.025,wide:[[710,642,.59]],tall:[[435,962,.57]],player:{wide:[325,688,.63],tall:[157,990,.57]}};
 UPPDRAG_ROOM_STAGING.PLANS.fort={tilt:.025,wide:[[1040,675,.72]],tall:[[575,965,.64]],player:{wide:[270,690,.8],tall:[125,990,.7]}};
 UPPDRAG_ROOM_STAGING.PLANS.courtyard={tilt:.04,wide:[[285,685,.8]],tall:[[285,975,.7]],player:{wide:[110,690,.75],tall:[100,990,.7]}};
 ROOM_BY_REGION.main.Torget='square';ROOM_BY_REGION.main.Bostadskvarteren='courtyard';
 return {yardFrame};
}
window.UPPDRAG_CH3_PRESENTATION={source,install,yardFrame};
})();
