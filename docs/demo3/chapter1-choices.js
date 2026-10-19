/* Kapitel 1: granskade svarsalternativ utifrån grundbok s. 64–65 och arbetsbok 1–4.
   Varje uppsättning: korrekt svar först, därefter två ämnesnära men felaktiga påståenden.
   Dessa är bedömningsalternativ, inte kompletterande faktainlärning. */
(function(){
'use strict';
const BANK={
 absolute:[
  ['Hon kunde inte bestämma ensam. Riksdagen och riksrådet hade också makt.','Hon kunde bestämma ensam, men måste berätta om besluten för riksdagen efteråt.','Hon bestämde ensam om lagarna, medan riksdagen bara skötte handeln.'],
  ['Ulrika Eleonoras makt var begränsad. Riksdagen och riksrådet kunde också påverka besluten.','Drottningen hade fortfarande sista ordet i alla frågor, även när riksdagen samlades.','Riksdagen fick ge förslag, men drottningen bestämde ensam ändå.'],
  ['Hon var inte enväldig; riksdagen och riksrådet hade också makt.','Hon var enväldig men måste låta adeln sköta handeln.','Hon var enväldig så länge grundlagen inte ändrades.']
 ],
 freedom:[
  ['Enväldet upphörde och riksdagen fick större makt.','De fyra stånden fick lika mycket makt, även om kungen fanns kvar.','Regentens makt var kvar som förut; förändringen gällde främst handeln.'],
  ['Den som regerade kunde inte längre bestämma ensam; riksdagen och riksrådet fick inflytande.','Regenten behöll all makt, men riksdagen fick ge fler råd.','Regentens makt växte när riksrådet började hjälpa till.'],
  ['Den som satt på tronen fick mindre makt, men adeln hade fortfarande mest inflytande i riksdagen.','Alla stånd och människor fick lika mycket att säga till om.','Bönderna bestämde över riksrådet, medan regenten fortfarande var enväldig.']
 ],
 trade:[
  ['Handla med Asien och föra hem varor från Kina.','Främst sälja järn till England och styra handeln där.','Köpa svenskt järn i England och sälja det vidare till Kina.'],
  ['För att köpa och föra hem varor, till exempel te, siden och porslin.','För att frakta järn till England, som var kompaniets huvuduppgift.','För att föra varor från Kina till England utan att handla med Sverige.'],
  ['Kompaniet bedrev handel med Kina och tog hem asiatiska varor.','Kompaniet skeppade främst svenskt järn till England, inte varor från Kina.','Kompaniets uppgift var att övervaka handeln, medan andra skötte resorna till Kina.']
 ],
 law:[
  ['Hur makten skulle delas i landet.','Vilket stånd som skulle få utse kungen på egen hand.','Hur riksdagen skulle besluta om handel utan att ändra maktfördelningen.'],
  ['För att slå fast hur makten skulle delas när enväldet upphörde.','För att kungen skulle kunna ändra grundlagen utan riksdagens samtycke.','För att adeln skulle kunna fatta de viktigaste besluten utan någon grundlag.'],
  ['Den nya grundlagen reglerade hur makten delades; kungen styrde inte ensam.','Grundlagen gav kungen enväldig makt så länge adeln höll med.','Grundlagen ändrade vilka som satt i riksdagen men inte kungens makt.']
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