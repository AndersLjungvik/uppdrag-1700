/* Independent classroom practice. Applied only inside the separate practice
 * save. A pupil's comparison is logged as practice, never teacher approval. */
(function(){
'use strict';
const flowHelpers=`
 function soloReview(t,u){
  let h='<h2 class="rc-prompt">Jämför och fortsätt träna</h2><p>'+escape(t.prompt)+'</p>';
  t.fields.forEach((f,i)=>{h+='<div class="rc-field"><b>'+escape(f.label)+'</b><blockquote class="rc-own">'+escape(u.drafts[i])+'</blockquote></div>';});
  for(const d of u.result?.details||[])h+='<p class="rc-criterion">'+(d.status==='met'||d.status==='correct'?'✓ ':'• ')+escape(String(d.label))+'</p>';
  h+=revealModel(t)+'<p class="rc-note">Jämför innehållet med exemplet. Du kan ändra ditt svar gratis eller fortsätta själv. Din jämförelse sparas som träning.</p>';
  if(u.error)h+='<p class="rc-error" role="status">'+escape(u.error)+'</p>';
  return h+'<div class="rc-actions">'+btn('practice-revise','Ändra mitt svar')+btn('practice-next','Jag har jämfört – fortsätt',true)+btn('go-rut','Öva hos Rut')+'</div>';
 }
 function soloNext(){
  const s=state(),t=effectiveTask(),u=ui();
  if(!t||u?.phase!=='review'||!u.drafts.some(v=>/[\\p{L}\\p{N}]/u.test(String(v))))return false;
  const entry={version:VERSION,chapter,step:s.step,trial:s.trial,id:t.id,level:['Lärling','Gesäll','Mästare'][t.rank],ok:false,practised:true,support:true,independent:false,assessment:'self-checked-practice',answer:u.drafts.slice(),at:new Date().toISOString()};
  if(isDrill()){
   (s.recallRutLog??=[]).push(entry);if(s.archiveActive)s.recallRutPassed[t.id]=true;
  }else s.record.push(entry);
  u.result={status:'self',support:true};u.phase='feedback';s.mode='feedback';save();render();return true;
 }
`;
const pendingHelpers=`
function soloPending(){
 const entry=s.reviewQueue.find(x=>x.step===s.step&&x.trial===s.trial&&mainReview(x));
 if(!entry){mastery.resumePending(area().id,level());persist();return false;}
 const t=bank.find(t=>t.id===entry.id);if(!t)return false;
 const h=top('Jämför och fortsätt träna')+'<p>'+esc(t.prompt)+'</p><blockquote>'+esc(entry.answer.join('\\n'))+'</blockquote>'+window.UPPDRAG_RECALL_ASSESS.modelHTML(t)+'<p>Du kan gå vidare själv efter att ha jämfört. Ditt svar sparas som träning.</p><div class="mb-actions"><button data-mb="self-edit">Ändra mitt svar</button><button class="primary" data-mb="self-continue">Jag har jämfört – fortsätt</button><button data-mb="book">Till minnesboken</button></div>';
 display(h,'review');return true;
}
function soloContinue(revise=false){
 const entry=s.reviewQueue.find(x=>x.step===s.step&&x.trial===s.trial&&mainReview(x));
 if(!entry||!current().f.includes(entry.id)||!revise&&!entry.answer?.some(v=>/[\\p{L}\\p{N}]/u.test(String(v))))return false;
 if(!mastery.resumePending(area().id,level()).ok)return false;
 s.index=current().f.indexOf(entry.id);s.recallUI=null;s.mode='question';
 const u=recall.ui;u.drafts=copy(entry.answer);u.phase=revise?'question':'review';u.result=revise?null:{status:'review'};
 entry.resolved=revise?'self-practice-revised':'self-practice';entry.practisedAt=new Date().toISOString();persist();display('','quiz');
 return revise?recall.render():recall.action('rc-practice-next');
}
`;
function source(name,text){
 const edit=(a,b)=>{if(text.split(a).length!==2)throw Error('Självträning: ankaret matchar inte '+name+': '+a.slice(0,65));text=text.replace(a,b);};
 if(name==='recall-flow.js'){
  edit(' const save=()=>{b.persist();};',' const save=()=>{b.persist();};'+flowHelpers);
  edit(' function review(t,u){',' function review(t,u){\n  return soloReview(t,u);');
  edit("  e?.preventDefault();const name=act.slice(3),s=state();ensure();", "  e?.preventDefault();const name=act.slice(3),s=state();ensure();\n  if(name==='practice-next')return soloNext();\n  if(name==='practice-revise'){const u=ui();if(u?.phase==='review'){u.phase='question';u.error='';u.hint=true;save();render();}return true;}");
  edit("   const title=", "   const title=result.status==='self'?'Jämförelsen är sparad som träning':");
  edit("   if(u.result.status!=='right'){", "   if(!['right','self'].includes(u.result.status)){");
 }
 const match=name.match(/^chapter([1-5])-mastery\.js$/);
 if(match){
  const chapter=Number(match[1]),old=text.match(/function hasPassed\(id\)\{[^\n]+\}/)?.[0];if(!old)throw Error('Självträning: saknar svarskontroll i '+name);
  edit(old,`function hasPassed(id){return s.record.some(x=>x.version==='recall-2-rubric'&&!x.beforeChapter${chapter}Mastery&&x.step===s.step&&x.trial===s.trial&&x.id===id&&(x.ok&&!['pending-review','self-review'].includes(x.assessment)||x.assessment==='self-checked-practice'));}`);
  edit('function renderStatus(){','function renderStatus(){\n if(status()===\'pending\')return soloPending();');
  edit('function review(){','function review(){\n return soloPending();');
  edit('function recorded(entry){','function recorded(entry){\n if(entry.ok){persist();drawHud();return;}');
  edit('function pending(t,u){',pendingHelpers+'\nfunction pending(t,u){');
  edit(" else if(name==='retry')retry();", " else if(name==='self-continue')soloContinue();else if(name==='self-edit')soloContinue(true);else if(name==='retry')retry();");
  text=text.replaceAll('Det här har du visat att du kan.','Du har tränat igenom det här området.').replaceAll('Du är minnesmästare i kapitel','Du har tränat klart alla nivåer i kapitel').replaceAll('○ Öva igen eller visa läraren','○ Jämför och fortsätt').replaceAll('◷ Öva igen eller visa läraren','◷ Jämför och fortsätt').replaceAll('◷ Väntar på granskning','◷ Jämför och fortsätt');
 }
 return text;
}
function copy(text){
 for(const before of ['Du har återgett minnen utan en lista med svar. Rut ger dig ett äpple.','Du svarade rätt på övningsfrågorna. Du får ett äpple.'])text=text.replaceAll(before,'Du har övat och jämfört dina svar. Rut ger dig ett äpple.');
 for(const before of ['Förklaringen är inte automatiskt validerad. Ditt svar finns kvar i träningsloggen.','Spelet har inte godkänt svaret. Ditt svar är sparat så att du kan öva vidare.'])text=text.replaceAll(before,'Ditt svar och din jämförelse är sparade som träning.');
 for(const before of ['Detta svar är tränat med stöd. Det är sparat, men räknas inte som en självständig mästarförklaring.','Du har fått hjälp med svaret. För en mästarstämpel behöver du sedan svara utan hjälp.'])text=text.replaceAll(before,'Du tränade med stöd. Fortsätt till nästa fråga när du är redo.');
 return text;
}
window.UPPDRAG_SELF_PRACTICE={source,copy,version:'1.0.0'};
})();
