/* Kapitel 1: granskade svarsalternativ utifrån grundbok s. 64–65 och arbetsbok 1–4.
   Varje uppsättning: korrekt svar först, därefter två ämnesnära men felaktiga påståenden.
   Dessa är bedömningsalternativ, inte kompletterande faktainlärning. */
(function(){
'use strict';
const BANK={
 absolute:[
  ['Hon kunde inte bestämma ensam. Riksdagen och riksrådet hade också makt.','Hon kunde bestämma ensam, men måste berätta om besluten för riksdagen efteråt.','Hon bestämde ensam om lagarna, medan riksdagen bara skötte handeln.'],
  ['Ulrika Eleonora bestämde inte ensam. Riksdagen och riksrådet hade också makt.','Drottningen hade fortfarande sista ordet i alla frågor, även när riksdagen samlades.','Riksdagen fick ge förslag, men drottningen bestämde ensam ändå.'],
  ['Hon var inte enväldig; riksdagen och riksrådet hade också makt.','Hon var enväldig men måste låta adeln sköta handeln.','Hon var enväldig så länge grundlagen inte ändrades.']
 ],
 freedom:[
  ['Enväldet upphörde och riksdagen fick större makt.','De fyra stånden fick lika mycket makt, även om en regent fanns kvar.','Regentens makt var kvar som förut; förändringen gällde främst handeln.'],
  ['Regenten bestämde inte längre ensam. Riksdagen och riksrådet fick mer makt.','Regenten behöll all makt, men riksdagen fick ge fler råd.','Regentens makt växte när riksrådet började hjälpa till.'],
  ['Regenten fick mindre makt. Adeln hade ändå störst makt i riksdagen.','Alla stånd och människor fick lika mycket att säga till om.','Bönderna bestämde över riksrådet, medan regenten fortfarande var enväldig.']
 ],
 trade:[
  ['Handla med Asien och föra hem varor från Kina.','Främst sälja järn till England och styra handeln där.','Köpa svenskt järn i England och sälja det vidare till Kina.'],
  ['För att köpa och föra hem varor, till exempel te, siden och porslin.','För att frakta järn till England, som var kompaniets huvuduppgift.','För att föra varor från Kina till England utan att handla med Sverige.'],
  ['Kompaniet bedrev handel med Kina och tog hem asiatiska varor.','Kompaniet skeppade främst svenskt järn till England, inte varor från Kina.','Kompaniets uppgift var att övervaka handeln, medan andra skötte resorna till Kina.']
 ],
 law:[
  ['Hur makten skulle delas i landet.','Vilket stånd som ensamt skulle få utse regenten.','Hur riksdagen skulle besluta om handel utan att ändra maktfördelningen.'],
  ['För att bestämma hur makten skulle delas efter enväldet.','För att regenten skulle kunna ändra grundlagen utan riksdagens samtycke.','För att adeln skulle kunna fatta de viktigaste besluten utan någon grundlag.'],
  ['Den nya grundlagen reglerade hur makten delades; regenten styrde inte ensam.','Grundlagen gav regenten enväldig makt så länge adeln höll med.','Grundlagen ändrade vilka som satt i riksdagen men inte regentens makt.']
 ],
 change:[
  ['När hela riksdagen var överens.','När regenten och riksrådet var överens, utan riksdagen.','När adeln ensam ville ändra den.'],
  ['Ändringen krävde att hela riksdagen var överens.','Det räckte om regenten godkände ändringen.','Det räckte att adeln röstade ja.'],
  ['Hela riksdagen måste vara överens om ändringen.','Adeln kunde själv ändra lagen eftersom den hade mest makt.','Riksrådet kunde ändra lagen utan att rådfråga riksdagen.']
 ],
 nobles:[
  ['Adeln hade mest makt. Bönderna fick inte delta i vissa möten.','Alla fyra stånden bestämde alltid lika mycket vid alla viktiga möten.','Bönderna utsåg riksrådets medlemmar, som adeln sedan måste följa.'],
  ['Adeln bestämde mest. Bönderna fick inte delta i vissa möten.','De fyra stånden fick lika stor makt när enväldet avskaffades.','Riksrådet utsågs helt av bönderna, men adeln fick yttra sig.'],
  ['Adeln bestämde mest. Bönderna fick inte delta i vissa viktiga möten.','Alla fyra stånden var alltid med och hade lika stor makt vid besluten.','Bönderna valde riksrådet, men adeln fick bestämma vad det skulle handla om.']
 ]
};
function optionsFor(key,rank,attempt=0){
 const list=BANK[key]?.[rank];
 if(!list)return null;
 // Change option positions on paid retries so a click position cannot be memorised.
 const seed=(key+':'+rank+':'+attempt).split('').reduce((n,c)=>(n*33+c.charCodeAt(0))>>>0,5381);
 const shift=seed%3;
 const order=[0,1,2].map((_,i)=>(i+shift)%3);
 if(seed%2)order.reverse();
 return {options:order.map(i=>list[i]),correctIndex:order.indexOf(0)};
}
window.UPPDRAG_CH1_CHOICES={optionsFor,keys:Object.keys(BANK)};
})();