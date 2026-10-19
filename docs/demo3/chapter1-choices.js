/* Kapitel 1: granskade svarsalternativ utifrån grundbok s. 64–65 och arbetsbok 1–4.
   Varje uppsättning: korrekt svar först, därefter två ämnesnära men felaktiga påståenden.
   Dessa är bedömningsalternativ, inte kompletterande faktainlärning. */
(function(){
'use strict';
const BANK={
 absolute:[
  ['Hon kunde inte bestämma ensam. Riksdagen och riksrådet hade också makt.','Hon kunde bestämma ensam, men måste berätta om besluten för riksdagen efteråt.','Hon bestämde ensam om allt utom handeln med Kina.'],
  ['Kungens makt var begränsad och riksdagen och riksrådet kunde påverka besluten.','Kungen hade fortfarande sista ordet i alla frågor, även när riksdagen samlades.','Riksdagen fick ge förslag, men kungens envälde var kvar.'],
  ['Hon var inte enväldig; riksdagen och riksrådet hade också makt.','Hon var enväldig men måste låta adeln sköta handeln.','Hon var enväldig så länge grundlagen inte ändrades.']
 ],
 freedom:[
  ['Kungens envälde upphörde och riksdagen fick större makt.','De fyra stånden fick lika stor makt och behövde inte längre någon kung.','Den gamla kungamakten var kvar, men krigen tog slut.'],
  ['Kungen kunde inte längre styra ensam; riksdagen och riksrådet fick inflytande.','Sverige slutade vara ett kungarike och styrdes bara av folket.','Det blev en ny kung som styrde lika enväldigt som tidigare.'],
  ['Kungen fick mindre makt, men adeln hade fortfarande mest inflytande i riksdagen.','Alla stånd och människor fick lika mycket att säga till om.','Bönderna fick bestämma över riksrådet medan kungen var enväldig.']
 ],
 trade:[
  ['Handla med Asien och föra hem varor från Kina.','Främst sälja järn till England och styra handeln där.','Sköta tullar och lagar åt Sveriges riksdag.'],
  ['För att köpa och föra hem varor, till exempel te, siden och porslin.','För att frakta järn till England, som var kompaniets huvuduppgift.','För att riksdagen skulle kunna hålla sina möten till sjöss.'],
  ['Kompaniet bedrev handel med Kina och tog hem asiatiska varor.','Kompaniet förde krig för att göra Kina till en svensk koloni.','Kompaniet handlade bara inom Sverige men använde kinesiska fartyg.']
 ],
 law:[
  ['Hur makten skulle delas i landet.','Hur kungen ensam skulle utse alla riksdagens ledamöter.','Hur Ostindiska kompaniet skulle sköta handeln.'],
  ['För att slå fast hur makten skulle delas när enväldet upphörde.','För att kungen skulle kunna bestämma ensam även efter frihetstiden.','För att ersätta riksdagen med Ostindiska kompaniet.'],
  ['Den nya grundlagen reglerade hur makten delades; kungen styrde inte ensam.','Grundlagen gav kungen enväldig makt så länge adeln höll med.','Grundlagen handlade bara om handeln och ändrade inte styret.']
 ],
 change:[
  ['När hela riksdagen var överens.','När kungen och riksrådet var överens, utan riksdagen.','När adeln ensam ville ändra den.'],
  ['Ändringen krävde att hela riksdagen var överens.','Det räckte om kungen godkände ändringen.','Det räckte att adelns stånd röstade för den.'],
  ['Hela riksdagen måste vara överens om ändringen.','Adeln kunde själv ändra lagen eftersom den hade mest makt.','Riksrådet kunde ändra lagen utan att rådfråga riksdagen.']
 ],
 nobles:[
  ['Adeln fick mest inflytande, bland annat i viktiga möten där bönderna inte deltog.','Alla fyra stånden bestämde alltid lika mycket vid alla viktiga möten.','Bönderna utsåg riksrådets medlemmar, som adeln sedan måste följa.'],
  ['Adeln dominerade besluten; bönderna var utestängda från vissa viktiga möten.','De fyra stånden fick lika stor makt när enväldet avskaffades.','Riksrådet utsågs helt av bönderna, men adeln fick yttra sig.'],
  ['Adeln dominerade viktiga beslut; bönderna deltog inte i vissa avgörande möten.','Alla fyra stånden var alltid med och hade lika stor makt vid besluten.','Bönderna valde riksrådet, men adeln fick bestämma vad det skulle handla om.']
 ]
};
function optionsFor(key,rank){
 const list=BANK[key]?.[rank];
 if(!list)return null;
 // Stable order for a given question; correct answer is not always first.
 const seed=(key+':'+rank).split('').reduce((n,c)=>(n*33+c.charCodeAt(0))>>>0,5381);
 const shift=seed%3;
 const order=[0,1,2].map((_,i)=>(i+shift)%3);
 if(seed%2)order.reverse();
 return {options:order.map(i=>list[i]),correctIndex:order.indexOf(0)};
}
window.UPPDRAG_CH1_CHOICES={optionsFor,keys:Object.keys(BANK)};
})();