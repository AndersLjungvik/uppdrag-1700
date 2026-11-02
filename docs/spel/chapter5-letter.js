/* A voluntary fictional delivery, saved separately from all knowledge and money. */
(function(){
'use strict';
const key='uppdrag1700.ch5-marstrand-letter.20261020.v1';
let phase='waiting';
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved?.version===1&&['waiting','carrying','delivered'].includes(saved.phase))phase=saved.phase;}catch{}
const save=()=>{try{localStorage.setItem(key,JSON.stringify({version:1,phase}));}catch{}};
function linesFor(id){
 if(id==='prisoner'){
  if(phase==='waiting')return [
   ['Fången','Jag har inte hört från min familj på länge. Kan du hjälpa mig med en sak?'],
   ['Du','Vad behöver du?'],
   ['Fången','Ta det här brevet till hamnarbetaren vid kajen. Jag får inte gå dit själv.'],
   ['Du','Självklart. Jag tar det med mig.'],
   ['Fången','Tack. Brevet ligger här. Hälsa att det ska till min familj.']
  ];
  if(phase==='carrying')return [['Fången','Har du kvar mitt brev?'],['Du','Ja. Jag ska lämna det vid kajen.'],['Fången','Tack. Jag hoppas att det kommer fram.']];
  return [['Fången','Har du lämnat brevet?'],['Du','Ja. Hamnarbetaren tog hand om det.'],['Fången','Tack. Nu kanske min familj får veta hur jag har det.']];
 }
 if(id==='wharf'){
  if(phase==='carrying')return [['Hamnarbetaren','Vad har du med dig?'],['Du','Ett brev från fången vid Carlsten. Det ska till hans familj.'],['Hamnarbetaren','Jag lägger det i brevpåsen till nästa fartyg.'],['Du','Varsågod. Här är brevet.'],['Hamnarbetaren','Tack. Nu tar jag hand om det.']];
  if(phase==='delivered')return [['Hamnarbetaren','Brevet ligger i brevpåsen. Det får följa med nästa fartyg.']];
 }
 return null;
}
function completedConversation(id,complete=false){
 const city=window.UPPDRAG_CH5_CITY_LIFE;
 if(!complete||typeof region==='undefined'||region.id!=='marstrand'||interior||voyage||city?.actor!==id||window.UPPDRAG_CH5_PILOT?.studyBusy)return false;
 const actor=city.find(region,id);if(!actor||Math.hypot(player.x-actor.x,player.y-actor.y)>118)return false;
 if(id==='prisoner'&&phase==='waiting')phase='carrying';
 else if(id==='wharf'&&phase==='carrying')phase='delivered';
 else return false;
 save();window.UPPDRAG_CH5_SCENES?.letterChanged();return true;
}
window.UPPDRAG_CH5_LETTER={linesFor,completedConversation,saveKey:key,get phase(){return phase;},get hasLetter(){return phase==='carrying';},get delivered(){return phase==='delivered';}};
})();
