/* Chapter 4 retains the original painted rooms and the shared paper speakers. */
(function(){
'use strict';
function source(name,text){
 const edit=(a,b)=>{if(text.split(a).length!==2)throw Error('Kapitel 4: presentationsankaret matchar inte '+name+': '+a.slice(0,60));text=text.replace(a,b);};
 if(name==='meeting-ch4-pilot.js'){
  edit("key=quay?dockKey:window.UPPDRAG_STORY_WORLD?.roomKey?.(storyPlace)||interior.kind","key=quay?dockKey:interior.kind");
  edit('const c=current();if(!c?.cast||dialogue||voyage)return false;', 'const c=current();if(!c?.cast||dialogue||voyage||window.UPPDRAG_EVENT_ENGINE?.busy||window.UPPDRAG_CH4_PILOT?.studyBusy)return false;\n    if(window.UPPDRAG_CH4_SCENES)return window.UPPDRAG_CH4_SCENES.openRoom(c.key);');
  edit("const a=puppets(g),speaker=talk?.active?talk.speaker:(dialogue?dialogue.cast.lines[dialogue.index][0]:'');","const voice=window.UPPDRAG_EVENT_ENGINE?.roomVoice;if(voice){speechAt=voice.at;speechEnd=voice.end;}\n    const a=puppets(g),speaker=window.UPPDRAG_EVENT_ENGINE?.roomSpeaker||(talk?.active?talk.speaker:(dialogue?dialogue.cast.lines[dialogue.index][0]:''));");
  edit('    g.restore();\n    const chapterOneOnly=', '    window.UPPDRAG_CH4_SCENES?.drawProps(g,c.key,geometry.w/geometry.h<1.02,now,a);\n    g.restore();\n    const chapterOneOnly=');
  edit('person.hidden=!c.cast||!!dialogue||!!controller(c.key)?.busy;','person.hidden=!c.cast||!!dialogue||!!controller(c.key)?.busy||!!window.UPPDRAG_EVENT_ENGINE?.busy||!!window.UPPDRAG_CH4_PILOT?.studyBusy;');
  edit('const animating=(dialogue||','const animating=(dialogue||window.UPPDRAG_EVENT_ENGINE?.roomSpeaker||');
  edit('if(!dialogue&&(!task||task.hidden)&&window.UPPDRAG_ROOM_STAGING?.greetingDue(now,motion.matches))startTalk();','if(!window.UPPDRAG_CH4_SCENES&&!dialogue&&(!task||task.hidden)&&window.UPPDRAG_ROOM_STAGING?.greetingDue(now,motion.matches))startTalk();');
  edit('geometryForRoom:measure,drawMapPerson', 'geometryForRoom:measure,redraw(){lastPaint=-Infinity;drawPeople(performance.now());},drawRoomPerson(g,pos,who,now,speaking=false){puppets(g).side(...pos,who,false,now,speaking,false,false,0,0,null);},drawMapPerson');
  edit('roomFooter.append(bookButton);','roomView.append(bookButton);');
  edit("bookButton.textContent='Cajsa Wargs kokbok';","bookButton.textContent='Kokboken';bookButton.setAttribute('aria-label','Se Cajsa Wargs kokbok på bordet');");
  edit("bookButton.addEventListener('click',()=>{","bookButton.addEventListener('click',()=>{\n    if(window.UPPDRAG_CH4_SCENES){window.UPPDRAG_CH4_SCENES.openCookbook();return;}");
  edit("visitor.addEventListener('click',()=>{","visitor.addEventListener('click',()=>{\n    if(window.UPPDRAG_CH4_SCENES){window.UPPDRAG_CH4_SCENES.openCajsa();return;}");
  edit("bookButton.hidden=place!=='print'||window.UPPDRAG_CH4_SIDEQUEST?.phase!=='unfound'\n      ||!!window.UPPDRAG_CH4_PILOT?.memoryVisible;", "bookButton.hidden=place!=='print'||window.UPPDRAG_CH4_SIDEQUEST?.phase!=='unfound'\n      ||!!window.UPPDRAG_CH4_PILOT?.memoryVisible||!!window.UPPDRAG_EVENT_ENGINE?.busy;");
  edit("visitor.hidden=place!=='barnhus'||!!window.UPPDRAG_CH4_PILOT?.memoryVisible;", "visitor.hidden=place!=='barnhus'||!!window.UPPDRAG_CH4_PILOT?.memoryVisible||!!window.UPPDRAG_EVENT_ENGINE?.busy;");
  edit("visitor.hidden=c.key!=='barnhus'||!!dialogue||!!window.UPPDRAG_CH4_PILOT?.memoryVisible;", "visitor.hidden=c.key!=='barnhus'||!!dialogue||!!window.UPPDRAG_CH4_PILOT?.memoryVisible||!!window.UPPDRAG_EVENT_ENGINE?.busy;");
 }
 if(name==='world-keyboard-ch4.js'){
  edit("return [document.getElementById('meetingPerson'),document.getElementById('rutPapers'),...document.querySelectorAll('#roomFooter button')].filter(visible);","return [document.getElementById('meetingPerson'),document.getElementById('ch4BookAction'),document.getElementById('ch4CajsaVisitor'),document.getElementById('rutPapers'),...document.querySelectorAll('#roomFooter button')].filter(visible);");
  edit('function interactRoom(){','function interactRoom(){\n    const chapterControl=document.activeElement?.closest?.("#ch4BookAction,#ch4CajsaVisitor");if(visible(chapterControl)){chapterControl.click();return true;}');
 }
 if(name==='more-room-ch4-pilot.js')edit('bed(g,bx,feet,188);bed(g,bx+222,feet,188);','bed(g,bx,feet,188);window.UPPDRAG_CH4_SCENES?.drawInheritedBed(g,bx,feet,188);bed(g,bx+222,feet,188);');
 if(name==='chapter4-street-life.js'){
  edit("['Bonden','I vårt äventyr har några återvänt till jordbruket, men minnet av upproret finns kvar.']", "['Bonden','Ja. Nu är jag tillbaka vid jorden igen. Men jag har inte glömt det som hände.']");
  edit('if(!real)return false;','if(!real||Math.hypot(player.x-real.x,player.y-real.y)>118)return false;');
  edit('if(!actor||active||!viewport)return false;', "if(!actor||active||!viewport||interior||(window.UPPDRAG_EVENT_ENGINE?.busy&&window.UPPDRAG_EVENT_ENGINE.state.thief!=='chasing')||window.UPPDRAG_CH4_PILOT?.studyBusy)return false;");
  edit("root.hidden=false;putSpeech(active,speaker.textContent);\n box.focus", "root.hidden=false;putSpeech(active,speaker.textContent);\n window.UPPDRAG_CH4_SCENES?.streetDate(active.id);\n box.focus");
  edit('hideBubble();return true;', "hideBubble();window.UPPDRAG_CH4_SCENES?.streetDate(null);return true;");
 }
 return text;
}
function install(){
 const approved=window.UPPDRAG_ROOM_ART;
 // Science and the farm already have painted rooms. Crop their real furniture
 // into the work view, using the same renderer, pigments and paper materials.
 window.UPPDRAG_ROOM_ART={...approved,renderMemoryCloseup(canvas,kind){
  if(!['science','farm'].includes(kind))return approved.renderMemoryCloseup(canvas,kind);
  const bounds=canvas.getBoundingClientRect();if(!bounds.width||!bounds.height)return false;
  const original=document.createElement('canvas');original.style.cssText='position:fixed;left:-10000px;top:0;width:1280px;height:720px;pointer-events:none';document.body.append(original);
  approved.render(original,kind);
  // The native room paints work tables in a separate foreground layer.
  // Include that layer so the close-up contains the actual desk and objects.
  approved.drawForeground?.(original.getContext('2d'),kind,false);
  const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(bounds.width*d);canvas.height=Math.round(bounds.height*d);
  const g=canvas.getContext('2d');g.drawImage(original,170*d,260*d,1110*d,460*d,0,0,canvas.width,canvas.height);original.remove();return true;
 }};
}
window.UPPDRAG_CH4_PRESENTATION={source,install};
})();
