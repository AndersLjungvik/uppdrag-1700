/* Kapitel fem: frivilligt brev från en påhittad fästningsfånge.
 * Dokumentet är spelberättelse. Inga riktiga fångdokument återges.
 * Inga lärlingspoäng, daler, äpplen eller kapitelupplåsningar påverkas.
 */
(function(){
'use strict';
const KEY='uppdrag1700.ch5-marstrand-letter.20261020.v1';
const phases=new Set(['waiting','carrying','delivered']);
let phase='waiting';
try{
 const saved=JSON.parse(localStorage.getItem(KEY)||'null');
 if(saved?.version===1&&phases.has(saved.phase))phase=saved.phase;
}catch{}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({version:1,phase}))}catch{}}
function linesFor(id){
 if(id==='prisoner'){
   if(phase==='waiting')return [
     ['Fången','Jag är en påhittad fånge på Carlsten, dömd för förfalskning.'],
     ['Du','Hur är det att arbeta här?'],
     ['Fången','Tungt, kallt och ofta ensamt. Jag har skrivit ett brev till min familj.'],
     ['Du','Ska jag ta brevet till hamnen?'],
     ['Fången','Om du vill. Hamnarbetaren vid kajen vet hur posten ska vidare.'],
     ['Du','Jag tar det med mig.']
   ];
   if(phase==='carrying')return [
     ['Fången','Har du kvar mitt brev?'],
     ['Du','Ja, jag ska lämna det till hamnarbetaren.'],
     ['Fången','Tack. Här på fästningen fortsätter arbetet.']
   ];
   return [
     ['Fången','Jag hörde att brevet kom fram till hamnen. Tack.'],
     ['Du','Får du lämna fästningen nu?'],
     ['Fången','Nej. En vänlig handling ändrar inte min dom.']
   ];
 }
 if(id==='wharf'){
   if(phase==='carrying')return [
     ['Hamnarbetaren','Välkommen tillbaka till kajen. Vad har du i handen?'],
     ['Du','Ett brev från en fånge på Carlsten.'],
     ['Hamnarbetaren','Jag kan ta det till posten. Vi får hoppas att familjen får läsa det.'],
     ['Du','Här är brevet.']
   ];
   if(phase==='delivered')return [
     ['Hamnarbetaren','Brevpåsen är lämnad till fartyget. Nu väntar vi på tidvattnet.']
   ];
 }
 return null;
}
function completedConversation(id){
 if(id==='prisoner'&&phase==='waiting'){phase='carrying';persist();return true}
 if(id==='wharf'&&phase==='carrying'){phase='delivered';persist();return true}
 return false;
}
window.UPPDRAG_CH5_LETTER={
 get phase(){return phase},
 get hasLetter(){return phase==='carrying'},
 get delivered(){return phase==='delivered'},
 linesFor,completedConversation,
 reset(){phase='waiting';persist()},
 saveKey:KEY
};
})();