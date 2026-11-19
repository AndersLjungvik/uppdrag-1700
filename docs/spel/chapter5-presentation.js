/* Chapter 5 uses the existing painted rooms, common speech and scene presence. */
(function(){
'use strict';
function source(name,text){
 const edit=(a,b)=>{if(text.split(a).length!==2)throw Error('Kapitel 5: presentationsankaret matchar inte '+name+': '+a.slice(0,60));text=text.replace(a,b);};
 if(name==='chapter5-pilot.html'){
  // The outer integration gate has already checked chapter-four mastery or an
  // explicitly isolated chapter-five round. Never fabricate earlier results.
  edit('if(!complete&&!preview){','if(false){');
  edit('}else if(preview&&!complete){','}else if(false){');
  const side=/<script src="chapter4-sidequest\.js[^\"]*"><\/script>/;
  if(!side.test(text))throw Error('Kapitel 5: den tidigare kokbokens laddare saknas.');
  text=text.replace(side,'<!-- Chapter-four cookbook remains in its own chapter. -->');
 }
 if(name==='meeting-ch5-pilot.js'){
  edit("key=quay?dockKey:window.UPPDRAG_STORY_WORLD?.roomKey?.(storyPlace)||interior.kind","key=quay?dockKey:interior.kind");
  edit('const c=current();if(!c?.cast||dialogue||voyage)return false;', 'const c=current();if(!c?.cast||dialogue||voyage||window.UPPDRAG_EVENT_ENGINE?.busy||window.UPPDRAG_CH5_PILOT?.studyBusy)return false;\n    if(window.UPPDRAG_CH5_SCENES){const handled=window.UPPDRAG_CH5_SCENES.openRoom(c.key);if(handled!==null)return handled;}');
  edit("const a=puppets(g),speaker=talk?.active?talk.speaker:(dialogue?dialogue.cast.lines[dialogue.index][0]:'');", "const voice=window.UPPDRAG_EVENT_ENGINE?.roomVoice;if(voice){speechAt=voice.at;speechEnd=voice.end;}\n    const a=puppets(g),speaker=window.UPPDRAG_EVENT_ENGINE?.roomSpeaker||(talk?.active?talk.speaker:(dialogue?dialogue.cast.lines[dialogue.index][0]:''));");
  edit('person.hidden=!c.cast||!!dialogue||!!controller(c.key)?.busy;','person.hidden=!c.cast||!!dialogue||!!controller(c.key)?.busy||!!window.UPPDRAG_EVENT_ENGINE?.busy||!!window.UPPDRAG_CH5_PILOT?.studyBusy;');
  edit('const animating=(dialogue||','const animating=(dialogue||window.UPPDRAG_EVENT_ENGINE?.roomSpeaker||');
  edit('if(!dialogue&&(!task||task.hidden)&&window.UPPDRAG_ROOM_STAGING?.greetingDue(now,motion.matches))startTalk();','if(!window.UPPDRAG_CH5_SCENES&&!dialogue&&(!task||task.hidden)&&window.UPPDRAG_ROOM_STAGING?.greetingDue(now,motion.matches))startTalk();');
  edit('geometryForRoom:measure,drawMapPerson','geometryForRoom:measure,redraw(){lastPaint=-Infinity;drawPeople(performance.now());},drawMapPerson');
 }
 if(name==='more-room-ch4-pilot.js'){
  edit('bed(g,bx,feet,188);bed(g,bx+222,feet,188);','bed(g,bx,feet,188);window.UPPDRAG_CH5_SCENES?.drawInheritedBed(g,bx,feet,188);bed(g,bx+222,feet,188);');
  const marker='window.UPPDRAG_CH4_SIDEQUEST?.party';if(text.split(marker).length!==3)throw Error('Kapitel 5: grannmåltidens två ankare saknas.');text=text.replaceAll(marker,'window.UPPDRAG_CH5_SCENES?.inheritedFeast');
 }
 if(name==='chapter5-street-life.js'){
  edit('if(!real)return false;','if(!real||Math.hypot(player.x-real.x,player.y-real.y)>118)return false;');
  edit('if(!actor||active||!viewport)return false;',"if(!actor||active||!viewport||interior||(window.UPPDRAG_EVENT_ENGINE?.busy&&window.UPPDRAG_EVENT_ENGINE.state.thief!=='chasing')||window.UPPDRAG_CH5_PILOT?.studyBusy)return false;");
  edit('completedConversation(speakerActor.id);','completedConversation(speakerActor.id,true);');
  edit("root.hidden=false;putSpeech(active,speaker.textContent);\n box.focus", "root.hidden=false;putSpeech(active,speaker.textContent);\n window.UPPDRAG_CH5_SCENES?.streetDate(active.id);\n box.focus");
  edit('hideBubble();return true;', 'hideBubble();window.UPPDRAG_CH5_SCENES?.streetDate(null);return true;');
  // Dates, chronology and fiction labels belong outside anyone's speech.
  edit("['Du','Här finns en minnesbild från 1743. Vem var mannen vid stenarna?']", "['Du','Varför kom du hit?']");
  edit("['David · dramatiserad återblick','David Hedenquist vägrade skjuta mot bönderna under upproret.']", "['David','Jag vägrade skjuta mot bönderna under upproret.']");
  edit("['David · dramatiserad återblick','Han dömdes först till döden, men straffet ändrades och han fördes till Carlsten.']", "['David','Jag dömdes först till döden. Sedan ändrades straffet och jag fördes hit.']");
  edit("['David · dramatiserad återblick','Stenhuggeriet du ser här är en gestaltning av fästningens fångarbete.']", "['David','Här fick jag arbeta med stenen.']");
  edit("['Fången','I vår påhittade berättelse dömdes jag för förfalskning. Jag är ingen känd historisk fånge.']", "['Fången','Jag dömdes för förfalskning. Nu längtar jag efter min familj.']");
  edit("name:'Moses Salomon'", "name:'En judisk köpman · fiktiv'");
  edit("name:'Bela Salomon'", "name:'En judisk handelsidkare · fiktiv'");
  text=text.replaceAll("['Moses Salomon',","['Köpmannen',").replaceAll("['Bela Salomon',","['Handelsidkaren',");
  edit('Vår familj kom från Hamburg år 1779.','Vi har flyttat hit för att handla och bygga ett nytt hem.');
  edit('Vårt samtal är påhittat, men vår familj finns i Marstrands historia.','Jag hoppas att barnen ska känna sig hemma här.');
  edit("['Du','Har ön alltid varit frihamn?']", "['Du','Kan brev också följa med fartygen?']");
  edit("['Hamnarbetaren','Nej, de särskilda reglerna infördes år 1775.']", "['Hamnarbetaren','Ja. Har du något som ska skickas kan du lämna det till mig.']");
 }
 return text;
}
window.UPPDRAG_CH5_PRESENTATION={source,install(){}};
})();
