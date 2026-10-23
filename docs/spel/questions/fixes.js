/* Frågetest v3, 2026-10-23. Isolated patch; not loaded by the ordinary game.
 * The original 78 questions and source references are preserved.
 * These rules recognise some paraphrases, not unrestricted Swedish semantics.
 */
(function(){
'use strict';
const A=window.UPPDRAG_RECALL_ASSESS, oldAssess=A.assess;
const n=v=>A.norm(v).replace(/\s+/g,' ').trim();
const clauses=s=>s.split(/[.!?;\n]+|\bmen\b|\bdaremot\b/).map(x=>x.trim()).filter(Boolean);
function constitution(s){
 return /maktfordelning|hur.{0,35}(makten|makt).{0,30}(delas|delades|fordelas|fordelades)|hur.{0,35}(landet|sverige|riket).{0,25}(styrs|styrdes|styras)|vem.{0,30}(bestamma|bestamde|makt)|vilka.{0,30}(bestamma|makten)|regler.{0,40}(makt|styra)/.test(s)
 || /(?:makten|makt|sverige|landet|riket).{0,55}(delas|fordela|styras|styrde|delades)/.test(s);
}
function consensus(s){
 const agreement=/(?:\b(?:en |endast |bara )?enig riksdag\b|\briksdagen\b.{0,60}(?:\benig\b|\boverens\b)|\b(?:hela riksdagen|alla i riksdagen|samtliga i riksdagen|alla riksdagsledamoter|samtliga ledamoter)\b.{0,70}(?:overens|eniga|enas)|\benighet i riksdagen\b)/.test(s)
 || /\b(?:alla|samtliga)\b.{0,40}(?:overens|eniga|enas)/.test(s)&&/riksdag/.test(s);
 return agreement && /andr|maste|behovde|krav|tvung|endast|bara/.test(s);
}
function lawContradiction(s){
 return clauses(s).some(c=>
 /(?:grundlag\w*|den)\b.{0,30}(?:reglerade|bestamde|handlade|angav)\s+(?:inte|aldrig|ej).{0,35}(?:makt|styr)/.test(c)
 || /(?:riksdag\w*|alla|samtliga)\b.{0,40}(?:behovde|maste|kravde|var)\s+(?:inte|aldrig|ej).{0,25}(?:enig|overens|enas)/.test(c)
 || /(?:ingen|inte nagon) enighet|(?:inte|aldrig) kravdes.{0,15}enighet|enighet.{0,15}kravdes inte/.test(c)
 || /(?:kungen|en ensam riksdagsman|en enda riksdagsman|en riksdagsman ensam|en ensam ledamot|en enda ledamot)\b.{0,20}(?:kunde|fick|hade ratt att)\s+(?:ensam )?andra/.test(c)
 || /riksdagen.{0,30}(?:oenig|oense).{0,40}(?:kunde|fick)\s+(?:anda )?andra/.test(c)
 );
}
function powerLimited(s){
 return /(envalde(t)?|ensamvald(et)?) (hade |var |blev |har )?(avskaffat|slut|upphort|avskaffades|upphorde)/.test(s)
 || /(kunde|fick|bestamde|styrde|var) (hon |kungen |drottningen )?(inte|ej) (langre )?(helt )?(bestamma |styra )?(ensam|allt|envaldig)/.test(s)
 || /(kungens|regentens|drottningens) makt (var |hade |blev )?(begransad|minskad|begransades|minskade)/.test(s)
 || /(kungen|drottningen|regenten|hon)\b.{0,25}(fick|hade) (mindre|begransad) makt/.test(s)
 || /(kungen|drottningen|regenten)\b.{0,25}(forlorade|misste).{0,15}(makt|envalde)/.test(s)
 || /riksdag\w*.{0,60}begransade.{0,30}(regentens|kungens|drottningens) makt/.test(s);
}
function parliamentGain(s){
 return /riksdag\w*|riksrad\w*/.test(s)&&(
 /(?:riksdag\w*|riksrad\w*)[^.!?;]{0,65}(?:mer makt|storre makt|mer inflytande|storre inflytande|bestamma mer|delade.{0,15}makten|delar.{0,15}makten|begransade.{0,30}(?:regentens|kungens|drottningens) makt)/.test(s)
 || /(?:mer makt|storre makt|mer inflytande)[^.!?;]{0,35}(?:riksdag\w*|riksrad\w*)/.test(s));
}
function powerContradiction(s){
 return clauses(s).some(c=>
 /(?:riksdag\w*|riksrad\w*)\b.{0,35}(?:fick|hade)\s+(?:mindre makt|mindre inflytande)/.test(c)
 || /(?:riksdag\w*|riksrad\w*)\b.{0,35}(?:fick|hade) (?:inte|aldrig) (?:mer|storre) (?:makt|inflytande)/.test(c)
 || /(?:kungen|drottningen|regenten)\b.{0,20}(?:kunde|fick)\s+(?:fortfarande )?(?:bestamma|styra)\s+(?:helt )?ensam/.test(c)
 || /envaldet\b.{0,15}(?:upphorde|avskaffades) inte|envaldet\b.{0,15}(?:fanns|var) kvar/.test(c)
 );
}
function status(details){
 if(details.some(x=>x.status==='empty'))return 'empty';
 if(details.some(x=>['wrong','contradiction'].includes(x.status)))return 'contradiction';
 if(details.some(x=>x.status==='missing'))return 'needs-work';
 if(details.some(x=>x.status==='review'))return 'review';
 return 'sufficient';
}
// The sentence-completion field and Rut's short-answer version also accept these.
for(const t of window.UPPDRAG_RECALL_BANK){
 if(t.chapter===1&&t.topic==='law'){
  const extra=['en enig riksdag','enig riksdag','alla riksdagsledamoter','alla riksdagsledamöter','samtliga riksdagsledamöter','riksdagens alla ledamöter'];
  if(t.rank===1)t.fields[1].answers=[...new Set([...t.fields[1].answers,...extra])];
  t.drill.answers=[...new Set([...t.drill.answers,...extra])];
 }
}
A.assess=function(t,drafts,shortCheck){
 const r=oldAssess(t,drafts,shortCheck);
 if(t.chapter!==1||t.rank===0||!['law','power'].includes(t.topic)||t.fields[0].answers)return r;
 const s=n(drafts[0]);if(!A.isMeaningful(drafts[0]))return r;
 const details=r.details.map(d=>({...d}));
 for(const d of details){
  if(d.field!==0||!['met','missing'].includes(d.status))continue;
  if(t.topic==='law'){
   if(/styrning|grundlagen reglerade/.test(d.label))d.status=constitution(s)?'met':'missing';
   if(/enighet/.test(d.label))d.status=consensus(s)?'met':'missing';
  }else{
   if(/envalde|envälde|regenten inte/.test(d.label))d.status=powerLimited(s)?'met':'missing';
   if(/vilka|riksdagens/.test(d.label.toLowerCase()))d.status=parliamentGain(s)?'met':'missing';
  }
 }
 if((t.topic==='law'?lawContradiction:powerContradiction)(s))details.push({field:0,status:'contradiction',label:'Här finns en uppgift som motsäger innehållet. Kontrollera vem som fick bestämma och vilka villkor som gällde.'});
 return {status:status(details),details};
};
A.version='rubric-local-2-fragtest-v3';
window.UPPDRAG_FRAGTEST_VERSION='3.0.0';
})();
