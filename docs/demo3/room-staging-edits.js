/* Preview-only source edits. Every anchor is checked before a room is loaded.
 * The published chapter sources and pupil save slots are not overwritten. */
(function(){'use strict';
const meetings=['meeting-ch1-pilot.js','meeting-ch2-pilot.js','meeting-ch3-pilot.js','meeting-ch4-pilot.js','meeting-ch5-pilot.js'];
const rooms=['more-room-ch2-pilot.js','more-room-ch3-pilot.js','more-room-ch4-pilot.js'];
const moves=['npc-motion-ch1.js','npc-motion-ch2.js','npc-motion-ch3.js'];
const edits=[];
function add(files,old,next){edits.push({files,old,next});}
add(['interior-ch1-pilot.js'],'const sx=tall?480:1028,sy=tall?222:211,sw=tall?211:206;','const sx=tall?480:1028,sy=tall?480:211,sw=tall?211:206;');
const cafeGroup=`    // Keep the scale of chairs/cups/table together across orientations.
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
`;
add(['interior-ch1-pilot.js'],cafeGroup,'    cafeTable(g,tall);\n  }\n  function cafeTable(g,tall){\n'+cafeGroup);
add(['interior-ch1-pilot.js'],"        table(g,236,789,427,190);flatBook(g,286,757,227);\n        material(g,'ink',592,771,.70);quill(g,592,727);",'        archiveTable(g,true);');
add(['interior-ch1-pilot.js'],"        table(g,539,490,332,161);flatBook(g,575,456,184);\n        material(g,'ink',810,472,.70);quill(g,810,428);",'        archiveTable(g,false);');
add(['interior-ch1-pilot.js'],'  function render(canvas,id){',`  function archiveTable(g,tall){
    if(tall){table(g,236,789,427,190);flatBook(g,286,757,227);material(g,'ink',592,771,.70);quill(g,592,727);}
    else{table(g,539,490,332,161);flatBook(g,575,456,184);material(g,'ink',810,472,.70);quill(g,810,428);}
  }
  function drawForeground(g,id,tall){
    if(id==='cafe'){cafeTable(g,tall);return true;}
    if(id==='archive'){archiveTable(g,tall);return true;}
    return false;
  }
  function render(canvas,id){`);
add(['interior-ch1-pilot.js'],'return {names,render,ready:fibres.ready,','return {names,render,drawForeground,ready:fibres.ready,');
add(rooms,'highChair(g,bx+180,feet+41,.95);','highChair(g,tall?405:507,tall?853:538,tall?.82:.78);');
add(rooms,`      tabletop(g,T,(x,y,w)=>{
        flatBook(g,x+26,y-34,Math.min(164,w*.49));
        scroll(g,x+w*.57,y-29,.67);
        material(g,'ink',x+w-48,y-17,.62);
        quill(g,x+w-51,y-54);
      });`,'      palaceTable(g,tall);');
add(rooms,'  function render(canvas,id){',`  function palaceTable(g,tall){
    const T=tall?{x:240,top:808,w:414,h:168}:{x:365,top:476,w:347,h:174};
    tabletop(g,T,(x,y,w)=>{
      flatBook(g,x+26,y-34,Math.min(164,w*.49));
      scroll(g,x+w*.57,y-29,.67);material(g,'ink',x+w-48,y-17,.62);quill(g,x+w-51,y-54);
    });
  }
  function drawForeground(g,id,tall){
    if(id==='palace'){palaceTable(g,tall);return true;}
    return approved.drawForeground?.(g,id,tall)||false;
  }
  function render(canvas,id){`);
add(rooms,'descriptions,render,renderMemoryCloseup,','descriptions,render,renderMemoryCloseup,drawForeground,');
add(moves,' const spec=ACTORS[key];if(!spec)return null;\n attach(key,now);',' const staged=window.UPPDRAG_ROOM_STAGING?.pose(key,tall,now,reduced);if(staged)return staged;\n const spec=ACTORS[key];if(!spec)return null;\n attach(key,now);');
add(moves,' return !reduced&&!!actor&&Math.abs(target-from)>.001&&now-at<ACTORS[actor].duration;',' return !!window.UPPDRAG_ROOM_STAGING?.animating(now,reduced)||(!reduced&&!!actor&&Math.abs(target-from)>.001&&now-at<ACTORS[actor].duration);');
add(moves,'ACTORS,attach,approach:now=>set(1,now),returnToWork:now=>set(0,now),pose,animating,','ACTORS,attach,approach:now=>window.UPPDRAG_ROOM_STAGING?.approach(now)||set(1,now),returnToWork:now=>window.UPPDRAG_ROOM_STAGING?.returnToWork(now)||set(0,now),pose,animating,');
add(moves,'get actor(){return actor}','get actor(){return window.UPPDRAG_ROOM_STAGING?.actor||actor}');
add(meetings,"role=''){ctx.save();ctx.translate(x,foot)","role='',headTilt=0){ctx.save();ctx.translate(x,foot)");
add(meetings," cut(-8,-251,22,27,'#c8a377');"," ctx.save();ctx.translate(0,-235);ctx.rotate(headTilt);ctx.translate(0,235);\n cut(-8,-251,22,27,'#c8a377');");
add(meetings,'if(woman)poly([[-36,-116]','ctx.restore();if(woman)poly([[-36,-116]');
add(meetings,"    oval(-24,-286,21,23,'#817660');","    ctx.save();ctx.translate(0,-235);ctx.rotate(headTilt);ctx.translate(0,235);\n    oval(-24,-286,21,23,'#817660');");
add(meetings,'ctx.lineTo(28,-271);ctx.stroke();ctx.restore();','ctx.lineTo(28,-271);ctx.stroke();ctx.restore();ctx.restore();');
add(meetings,'speaking,walking=false,working=false,turn=0){','speaking,walking=false,working=false,turn=0,headTilt=0){');
add(meetings,"!!who.apron,who.role||'');ctx.restore();","!!who.apron,who.role||'',headTilt);ctx.restore();");
add(meetings,'    if(npc&&poses.length>1)poses[1]=[npc.x,npc.y,npc.size];','    if(npc&&poses.length>1)poses[1]=[npc.x,npc.y,npc.size];\n    const standing=window.UPPDRAG_ROOM_STAGING?.playerPose(c.key,r.width/r.height<1.02);\n    if(standing)poses[0]=[...standing];');
add(meetings,"for(const item of drawings){const [x,y,s]=item.pos;a.side(x,y,s,item.who,item.right,now,speaker===item.who.name,!!item.isNpc&&!!geometry.npc?.moving,!!item.isNpc&&!!geometry.npc?.working,item.isNpc?(geometry.npc?.turn||0):0);if(c.key==='archive'&&pilot&&item.who!==CAST.player)pilot.restoreDesk(g,geometry,roomCanvas);}",`for(const item of drawings){
      const [x,y,s]=item.pos,npc=item.isNpc?geometry.npc:null;
      a.side(x,y,s,item.who,npc?.faceRight??item.right,now,speaker===item.who.name,!!npc?.moving,!!npc?.working,npc?.turn||0,npc?.headTilt||0);
      if(item.isNpc&&npc?.staged)window.UPPDRAG_ROOM_ART?.drawForeground?.(g,c.key,h>w/1.02);
      else if(c.key==='archive'&&pilot&&item.who!==CAST.player)pilot.restoreDesk(g,geometry,roomCanvas);
    }`);
add(meetings,"if(c.key==='archive'&&pilot){const b=pilot.personRect();","if(c.key==='archive'&&pilot&&!geometry.npc?.staged){const b=pilot.personRect();");
add(meetings,'    const c=current();if(!c?.cast||dialogue||voyage)return false;','    const c=current();if(!c?.cast||dialogue||voyage)return false;\n    if(window.UPPDRAG_ROOM_STAGING?.deferTalk(performance.now(),motion.matches))return true;');
add(meetings,'closeTalk(false);activeRoom=interior;wasTravelling=travelling;lastPaint=-Infinity;','closeTalk(false);activeRoom=interior;wasTravelling=travelling;lastPaint=-Infinity;\n      window.UPPDRAG_ROOM_STAGING?.enter(interior&&!travelling?current()?.key:null,now);');
add(meetings,'    if(!interior||travelling)return;\n    const animating=',"    if(!interior||travelling)return;\n    const task=document.getElementById('ch1Modal');\n    if(!dialogue&&(!task||task.hidden)&&window.UPPDRAG_ROOM_STAGING?.greetingDue(now,motion.matches))startTalk();\n    const animating=");
add(meetings,'outline:2px dashed #826f51','outline:2px solid #826f51');
// The indoor HUD changes the canvas's CSS size after the first scene paint.
// Synchronise the base painting before projecting people/foreground furniture.
// This also covers orientation changes and HUD wrapping, without a second loop.
add(meetings,'    geometry=measure();if(!geometry)return;',`    const bounds=roomCanvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);
    if(bounds.width>0&&bounds.height>0&&
       (roomCanvas.width!==Math.round(bounds.width*ratio)||roomCanvas.height!==Math.round(bounds.height*ratio))){
      renderInterior();
    }
    geometry=measure();if(!geometry)return;`);
window.patchRoomStagingSource=function(name,source){
 for(const e of edits){if(!e.files.includes(name))continue;
  const i=source.indexOf(e.old);if(i<0||source.indexOf(e.old,i+1)>=0)throw new Error('Rumsändringen matchar inte grundfilen '+name+'. Ingen halvändrad scen visas.');
  source=source.slice(0,i)+e.next+source.slice(i+e.old.length);
 }
 return source;
};
})();