/* Explicit hooks into the frozen recall engine. Chapters 1, 2 and 3 opt in.
 * Keep the question bank, assessment rubrics, reading support and Rut renderer.
 */
(function(){
'use strict';
const rutHelpers=`
 function rememberForRut(id){
  if(!b.mastery||!byId.has(id)||byId.get(id).chapter>chapter)return;
  const s=state();s.recallRutFocus=[id,...(Array.isArray(s.recallRutFocus)?s.recallRutFocus:[]).filter(x=>x!==id)];save();
 }
 function forgetRutFocus(id){const s=state();if(Array.isArray(s.recallRutFocus))s.recallRutFocus=s.recallRutFocus.filter(x=>x!==id);}
 function practisedAfter(id,at){
  const since=Date.parse(at);return (state().recallRutLog||[]).some(x=>x.id===id&&x.ok&&(!Number.isFinite(since)||Date.parse(x.at)>=since));
 }
 function rutPriorities(){
  const s=state();if(!b.mastery||s.materialReviewMode)return [];
  const reviews=(s.reviewQueue||[]).filter(x=>!x.resolved&&!practisedAfter(x.id,x.at)).map(x=>x.id);
  const ids=[...(Array.isArray(s.recallRutFocus)?s.recallRutFocus:[]),...(s.recallNeeds||[]),...reviews],seen=new Set();
  return ids.filter(id=>{const t=byId.get(id);if(!t||t.chapter>chapter)return false;const topic=t.chapter+'/'+t.topic;if(seen.has(topic))return false;seen.add(topic);return true;});
 }
 function rutPool(pool){
  const focused=rutPriorities(),topics=new Set(focused.map(id=>{const t=byId.get(id);return t.chapter+'/'+t.topic;}));
  return [...focused,...pool.filter(id=>{const t=byId.get(id);return t&&t.chapter<=chapter&&!topics.has(t.chapter+'/'+t.topic);})];
 }
 function rutChallengePlan(pool){
  const ordered=[...rutPriorities().filter(id=>pool.includes(id)),...pool],groups=new Map();
  for(const id of ordered){const t=byId.get(id);if(!t||t.reviewOnly||t.chapter>chapter)continue;const key=t.chapter+'/'+t.topic;if(!groups.has(key))groups.set(key,[id]);}
  if(groups.size<3)return null;
  for(const t of bank){const group=groups.get(t.chapter+'/'+t.topic);if(group&&!t.reviewOnly&&t.drill?.answers?.length&&!group.includes(t.id))group.push(t.id);}
  const queues=[...groups.values()].map(ids=>ids.slice()),chosen=[];
  for(let cycle=0;chosen.length<6&&cycle<6;cycle++)for(const queue of queues){if(queue.length&&chosen.length<6)chosen.push(queue.shift());}
  return chosen.length===6?chosen:null;
 }
 function rutChallengeChoice(){
  if(state().materialReviewMode)return '';
  const ready=!!rutChallengePlan(available());
  return '<div class="rc-actions"><button type="button" data-action="rc-rut-challenge"'+(ready?'':' disabled')+'>Stora utmaningen · 6 uppgifter</button></div><p class="rc-note">'+(ready?'Fyll på till tre äpplen genom en längre omgång. Vi blandar sådant du redan har mött. Ingen tidspress.':'Möt minst tre olika ämnen i spelet för att öppna den stora utmaningen. Den vanliga repetitionen är alltid tillgänglig.')+'</p>';
 }
 function rutRewardCopy(){
  const s=state();if(!s.archiveChallenge)return b.mastery?.rutRewardHTML?.()||'<h2 class="rc-prompt">Ett äpple för repetitionen</h2>'+'<p>Du har återgett minnen utan en lista med svar. Rut ger dig ett äpple.</p>';
  const added=s.rutChallengeApplesAdded||0;
  return '<h2 class="rc-prompt">Stora utmaningen är klar!</h2><p>'+ (added?'Du tjänade '+added+(added===1?' äpple.':' äpplen.'):'Du har redan minst tre äpplen, så inga fler läggs till den här gången.')+'</p><p>Du har '+s.apples+(s.apples===1?' äpple':' äpplen')+' i fickan. Dina stämplar är kvar.</p>';
 }
 function rutAward(){
  const s=state();if(b.mastery?.awardRutApple)b.mastery.awardRutApple();
  else if(s.archiveChallenge){s.rutChallengeApplesAdded=Math.max(0,3-s.apples);s.apples+=s.rutChallengeApplesAdded;}
  else s.apples++;
 }
`;
function source(text){
 const edit=(before,after)=>{
  if(text.split(before).length!==2)throw Error('Minnesproven: ankaret matchar inte '+before.slice(0,65));
  text=text.replace(before,after);
 };
 edit(" const save=()=>{b.persist();};", " const save=()=>{b.persist();};"+rutHelpers);
 edit("  const s=state(),t=byId.get(id);", "  if(b.mastery)return b.mastery.hasPassed(id);\n  const s=state(),t=byId.get(id);");
 edit(" function available(){\n  const s=state(),known=new Set();", " function available(){\n  if(b.mastery)return rutPool(b.mastery.available());\n  const s=state(),known=new Set();");
 edit("  const t=effectiveTask(),u=ui();if(!t||!u)return false;", "  if(!isDrill()&&b.mastery?.renderStatus())return true;\n  const t=effectiveTask(),u=ui();if(!t||!u)return false;\n  if(!isDrill())b.mastery?.encountered(t.id);");
 edit("   s.record.push(entry);", "   s.record.push(entry);\n   if(b.mastery){if(!entry.ok||t.rank===2&&!entry.independent)rememberForRut(t.id);else forgetRutFocus(t.id); }\n   b.mastery?.recorded(entry);");
 edit("  e?.preventDefault();const name=act.slice(3),s=state();ensure();", "  e?.preventDefault();const name=act.slice(3),s=state();ensure();\n  if(name==='rut-challenge'){enterArchive('challenge');return true;}\n  if(!isDrill()&&b.mastery?.action(name))return true;");
 edit("  }else if(name==='save-review'&&u.phase==='review'){", "  }else if(name==='save-review'&&u.phase==='review'){\n   if(b.mastery&&!isDrill()){b.mastery.pending(t,u);render();return true;}");
 edit("return h+'<div class=\"rc-actions\">'+btn('revise'", "return h+'<div class=\"rc-actions\">'+(b.mastery?.practiceRetry&&!isDrill()?btn('practice-review','Öva och prova igen',true):'')+btn('revise'");
 edit("btn('revise','Bearbeta mitt svar',true)","(b.mastery&&!isDrill()?'<button type=\"button\" data-action=\"rc-revise\"'+(state().apples<1?' disabled':'')+'>Ändra mitt svar · 1 äpple</button>':btn('revise','Bearbeta mitt svar',true))");
 edit("  else if(name==='revise'&&u.phase==='review'){", "  else if(name==='revise'&&u.phase==='review'){\n    if(b.mastery&&!isDrill()){b.mastery.revise(t,u);return true;}");
 edit("  return h+'<div class=\"rc-actions\">'", "  if(b.mastery&&!isDrill())h+='<p class=\"rc-note\">Ett nytt försök börjar från första frågan och kostar ett äpple. Du kan alltid öva gratis hos Rut.</p>';\n  return h+'<div class=\"rc-actions\">'");
 edit("  u.result=result;u.phase='review';save();render();", "   if(!isDrill())rememberForRut(t.id);\n   u.result=result;u.phase='review';save();render();");
 edit("  if(!isDrill())return t;", "  if(!isDrill())return t;\n  if(state().archiveActive&&state().archiveFocused?.includes(t.id)&&t.kind!=='tf')return {...t,kind:'fields'};");
 edit("    if(s.archiveActive)s.recallRutPassed[t.id]=true;", "    if(s.archiveActive){s.recallRutPassed[t.id]=true;forgetRutFocus(t.id);}");
 edit(' function enterArchive(){'," function enterArchive(mode='normal'){");
 edit("  ensure();const s=state(),pool=available();", "   ensure();const s=state();if(!s.archiveActive&&!s.materialReviewMode&&s.recallUI?.phase==='review')rememberForRut(mainTask()?.id);const pool=available(),challenge=mode==='challenge'?rutChallengePlan(pool):null;\n   if(mode==='challenge'&&!challenge){const u=ui();if(u)u.error='Möt minst tre olika ämnen först. Du kan alltid göra den vanliga repetitionen.';render();return false;}");
 edit("  const ordered=shuffled(pool,s.archiveRounds||0).sort((a,c)=>Number(s.recallNeeds.includes(c))-Number(s.recallNeeds.includes(a)));", "  const priority=rutPriorities().filter(id=>pool.includes(id)),ordered=[...priority,...shuffled(pool,s.archiveRounds||0).filter(id=>!priority.includes(id))];s.archiveFocused=priority.slice(0,3);");
 edit('  s.archiveList=ordered.slice(0,3);',"  s.archiveChallenge=mode==='challenge';s.rutChallengeApplesAdded=0;\n  s.archiveList=challenge||ordered.slice(0,3);");
 edit("  if(name==='go-rut'){b.goRut();return true;}", "  if(name==='go-rut'){if(!isDrill())rememberForRut(mainTask()?.id);b.goRut();return true;}");
 edit("  if(u.phase==='review')h+=review(t,u);", "   if(s.archiveActive&&s.archiveIndex===0&&s.archiveFocused?.includes(t.id))h+='<p class=\"rc-note\">Vi börjar med det du vill öva mer på.</p>';\n   if(u.phase==='review')h+=review(t,u);");
 edit("  if(!isDrill()&&t.rank<2&&!u.hint)", "  if(!isDrill()&&t.rank===0&&!u.hint)");
 edit("!u.hint&&!isDrill()&&t.rank<2)", "!u.hint&&!isDrill()&&t.rank===0)");
 edit("   if(s.daler>=1){s.daler--;u.hint=true;s.hint=true;save();b.drawHud();render();}", "   if(b.mastery?b.mastery.hint():s.daler>=1){if(!b.mastery)s.daler--;u.hint=true;s.hint=true;save();b.drawHud();render();}");
 edit("if(!s.recallRutRewarded){s.apples++;s.recallRutRewarded=true;}", "if(!s.recallRutRewarded){rutAward();s.recallRutRewarded=true;}");
 edit("<h2 class=\"rc-prompt\">Ett äpple för repetitionen</h2><p>Du har återgett minnen utan en lista med svar. Rut ger dig ett äpple.</p>", "'+rutRewardCopy()+'");
 edit("btn('rut-again','Öva en ny omgång')", "btn('rut-again','Öva en ny omgång')+rutChallengeChoice()");
 edit("  if(!isDrill())h+='<p class=\"rc-progress\">", "  if(s.archiveActive&&s.archiveChallenge)h+='<p class=\"rc-progress\">Stora utmaningen · '+Math.min(6,Object.keys(s.recallRutPassed||{}).length)+' av 6 uppgifter klara. Du kan öva tills du minns dem.</p>';\n  if(s.archiveActive&&!s.archiveChallenge&&!s.materialReviewMode&&s.archiveIndex===0&&u.phase==='question')h+=rutChallengeChoice();\n  if(!isDrill())h+='<p class=\"rc-progress\">");
 return text;
}
window.UPPDRAG_MASTERY_RECALL={source};
})();
