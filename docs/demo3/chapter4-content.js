/* Kapitel 4: Nya tider, nya tankar. All assessed knowledge follows the project's
 * existing chapter-four classroom question bank. Dramatic dialogue is fictional. */
(function(){
'use strict';
const DATA=[
 {
  "id": "pressFreedom",
  "ab": "12",
  "a": "Tryckfrihet",
  "hint": "Det handlar om friheten att publicera texter.",
  "q": [
   "Vad heter friheten att skriva och sprida tryckta texter?",
   "Vilket ord använder vi för rätten att sprida tryckta texter?",
   "En tryckare vill publicera en ny text utan förhandsgranskning. Vilken frihet handlar det om?"
  ],
  "distractors": [
   "Censur",
   "Offentlighetsprincipen"
  ],
  "page": "Arbetsboken s. 12; Prov del 1 uppgift 6",
  "term": "tryckfrihet",
  "meaning": "rätten att skriva och sprida tryckta texter",
  "extra": "Detta betyder inte att alla texter saknade regler."
 },
 {
  "id": "censorship",
  "ab": "12",
  "a": "Censur",
  "hint": "Det är när någon vill kontrollera en text innan läsarna får den.",
  "q": [
   "Vad kallas det när de styrande granskar och stoppar texter före tryckning?",
   "Vilket begrepp handlar om kontroll av texter innan de sprids?",
   "En myndighet granskar och stoppar texter innan de får tryckas. Vad kallas den kontrollen?"
  ],
  "distractors": [
   "Tryckfrihet",
   "Offentlighet"
  ],
  "page": "Prov del 1 uppgift 6",
  "term": "censur",
  "meaning": "att granska eller stoppa en text innan den publiceras",
  "extra": "Det är motsatsen till friheten att trycka texter utan sådan förhandsgranskning."
 },
 {
  "id": "publicDocs",
  "ab": "12",
  "a": "Offentlighetsprincipen",
  "hint": "Här gäller det möjligheten att läsa myndigheters handlingar.",
  "q": [
   "Vilken princip handlar om rätten att ta del av myndigheters handlingar?",
   "Vad kallas principen att människor ska kunna läsa offentliga myndighetsbeslut?",
   "En skrivare säger att myndigheternas handlingar alltid måste hållas hemliga. Vilken princip hör hit?"
  ],
  "distractors": [
   "Censuren",
   "Trosfriheten"
  ],
  "page": "Arbetsboken s. 12; Prov del 1 uppgift 6",
  "term": "offentlighetsprincip",
  "meaning": "rätten att ta del av många offentliga handlingar",
  "extra": "Principen gör att medborgare kan granska beslut."
 },
 {
  "id": "catechism",
  "ab": "11",
  "a": "Katekesen",
  "hint": "Det är en liten lärobok om kristendomens grunder.",
  "q": [
   "Vad hette läroboken om kristendomens viktigaste delar?",
   "Vilken bok användes för att lära sig grunderna i kristendomen?",
   "En notis säger att barnen läste termometerboken för att förstå kristendomen. Vilken bok avsågs?"
  ],
  "distractors": [
   "Almanackan",
   "Linnés systema"
  ],
  "page": "Prov del 1 uppgift 6",
  "term": "katekesen",
  "meaning": "lärobok om den kristna tron",
  "extra": "Katekesen användes i undervisningen och har samband med tidens lästräning."
 },
 {
  "id": "churchReading",
  "ab": "11",
  "a": "Kyrkan",
  "hint": "Det är samma institution där präster arbetade.",
  "q": [
   "Vilken institution hade uppdraget att lära barn läsa?",
   "Vem ansvarade enligt kapitlet för att barn skulle lära sig läsa?",
   "En äldre text säger att Vetenskapsakademien undervisade alla barn i läsning. Vilken institution hade uppgiften?"
  ],
  "distractors": [
   "Riksdagen",
   "Vetenskapsakademien"
  ],
  "page": "Lärarguide kapitel 4, facit s. 80",
  "term": "kyrkan",
  "meaning": "den institution som ansvarade för barns läsundervisning",
  "extra": "Läskunnighet gav efter hand fler möjlighet att själva ta del av texter."
 },
 {
  "id": "science",
  "ab": "13",
  "a": "Vetenskap",
  "hint": "Kunskap byggs genom att undersöka och pröva.",
  "q": [
   "Vad kallas kunskap som tas fram genom forskning?",
   "Vilket ord använder vi om systematiska undersökningar och forskning?",
   "En notis säger att forskare bara behövde gissa. Vad heter det arbete där man undersöker för att få kunskap?"
  ],
  "distractors": [
   "Gissningar",
   "Censur"
  ],
  "page": "Grundmaterialet s. 3; begreppsblad",
  "term": "vetenskap",
  "meaning": "kunskap som utvecklas genom undersökningar",
  "extra": "1700-talet förknippas bland annat med fler naturvetenskapliga undersökningar."
 },
 {
  "id": "linnaeus",
  "ab": "14",
  "a": "Carl von Linné",
  "hint": "Tänk på forskaren som ordnade naturens växter och djur.",
  "q": [
   "Vem delade in växter och djur och gav dem latinska namn?",
   "Vad hette den svenska forskaren som systematiserade växter och djur?",
   "En lärotext tillskriver Celsius de latinska växtnamnen. Vilken forskare hör uppgiften till?"
  ],
  "distractors": [
   "Anders Celsius",
   "Carl Wilhelm Scheele"
  ],
  "page": "Arbetsboken s. 14; Grundmaterialet s. 3",
  "term": "Linné",
  "meaning": "forskare som ordnade och namngav växter och djur",
  "extra": "Han arbetade med system för växter och djur och använde latin i namnen."
 },
 {
  "id": "latin",
  "ab": "14",
  "a": "Latin",
  "hint": "Det var inte svenska eller franska.",
  "q": [
   "På vilket språk gav Linné växter och djur namn?",
   "Vilket språk använde Linné i de vetenskapliga namnen?",
   "Ett protokoll påstår att Linné gav alla arter namn på franska. Vilket språk användes?"
  ],
  "distractors": [
   "Svenska",
   "Franska"
  ],
  "page": "Arbetsboken s. 14 b",
  "term": "latin",
  "meaning": "språk som användes i vetenskapliga artnamn",
  "extra": "Namnen kunde då användas av forskare i olika länder."
 },
 {
  "id": "celsius",
  "ab": "13",
  "a": "Anders Celsius",
  "hint": "Namnet har att göra med hur varmt och kallt det är.",
  "q": [
   "Vilken forskare förknippas med temperaturskalan i kapitlet?",
   "Vem heter forskaren bakom temperaturskalan som nämns i boken?",
   "En anteckning säger att Linné arbetade fram temperaturskalan. Vilken forskare avsågs?"
  ],
  "distractors": [
   "Carl von Linné",
   "Carl Wilhelm Scheele"
  ],
  "page": "Arbetsboken s. 13; Grundmaterialet s. 3",
  "term": "Celsius",
  "meaning": "forskare förknippad med temperaturskalan",
  "extra": "Temperaturskalan används för att ange värme och kyla."
 },
 {
  "id": "scheele",
  "ab": "13",
  "a": "Carl Wilhelm Scheele",
  "hint": "Han var apotekare och undersökte kemiska ämnen.",
  "q": [
   "Vilken apotekare undersökte kemi och förknippas med syrets upptäckt?",
   "Vilken forskare arbetade som apotekare och undersökte luften?",
   "Någon skriver att Celsius upptäckte syre när han arbetade med en termometer. Vem förknippas med syret?"
  ],
  "distractors": [
   "Anders Celsius",
   "Eva Ekeblad"
  ],
  "page": "Arbetsboken s. 13; Bedömningsstöd del 1 fråga 6",
  "term": "Scheele",
  "meaning": "apotekare som forskade om kemi och syre",
  "extra": "Scheele undersökte bland annat ämnen i luften."
 },
 {
  "id": "oxygen",
  "ab": "13",
  "a": "Syre",
  "hint": "Det är en gas i luften.",
  "q": [
   "Vilken gas i luften förknippas med Scheeles arbete?",
   "Vad hette gasen som Scheele undersökte?",
   "Ett papper säger att Scheeles upptäckt var koldioxid. Vilken gas nämns i läromedlet?"
  ],
  "distractors": [
   "Kväve",
   "Vattenånga"
  ],
  "page": "Arbetsboken s. 13; Bedömningsstöd del 1 fråga 6",
  "term": "syre",
  "meaning": "en gas som finns i luften",
  "extra": "Syre är ett exempel på vad kemiska undersökningar kunde handla om."
 },
 {
  "id": "ekeblad",
  "ab": "15",
  "a": "Eva Ekeblad",
  "hint": "Hon blev den första kvinnan i en stor vetenskaplig akademi.",
  "q": [
   "Vem blev den första kvinnan i Vetenskapsakademien?",
   "Vad hette kvinnan som forskade om potatis och blev ledamot i Vetenskapsakademien?",
   "En notis påstår att det var Celsius som blev den första kvinnan i akademien. Vem var det?"
  ],
  "distractors": [
   "Ulrika Eleonora",
   "Lovisa Ulrika"
  ],
  "page": "Arbetsboken s. 15; Grundmaterialet s. 3",
  "term": "Eva Ekeblad",
  "meaning": "forskare som undersökte användning av potatis",
  "extra": "Hennes arbete är ett exempel på forskning med praktisk användning."
 },
 {
  "id": "potato",
  "ab": "15",
  "a": "Potatis",
  "hint": "Det handlar om en rotfrukt som kan användas i mat.",
  "q": [
   "Vilken växt undersökte Eva Ekeblad?",
   "Vad arbetade Eva Ekeblad med när hon utforskade nya användningar?",
   "Ett gammalt recept säger att Ekeblad främst undersökte kaffeplantor. Vilken växt var det?"
  ],
  "distractors": [
   "Vete",
   "Kaffe"
  ],
  "page": "Arbetsboken s. 15",
  "term": "potatis",
  "meaning": "växt som Eva Ekeblad forskade om",
  "extra": "Potatis kunde användas på fler sätt än många tidigare hade känt till."
 },
 {
  "id": "flour",
  "ab": "15",
  "a": "Mjöl",
  "hint": "Ett sätt att använda potatis i matlagning.",
  "q": [
   "Vad kunde man framställa av potatis, förutom brännvin, enligt Ekeblads arbete?",
   "Vad visade Eva Ekeblad att man kunde göra av potatis till livsmedel?",
   "En lapp påstår att Ekeblad bara visade hur potatis blev porslin. Vad kunde den också ge?"
  ],
  "distractors": [
   "Porslin",
   "Siden"
  ],
  "page": "Arbetsboken s. 15 c; Bedömningsstöd del 1",
  "term": "potatismjöl",
  "meaning": "mjöl som kan utvinnas ur potatis",
  "extra": "Ekeblad visade användning till bland annat mjöl och brännvin."
 },
 {
  "id": "origin",
  "ab": "15",
  "a": "Sydamerika",
  "hint": "Tänk på en världsdel på andra sidan Atlanten.",
  "q": [
   "Från vilken världsdel kom potatisen ursprungligen?",
   "Varifrån i världen hade potatisen sitt ursprung?",
   "En notis hävdar att potatisen kom från Europa från början. Vilken världsdel var ursprunget?"
  ],
  "distractors": [
   "Europa",
   "Asien"
  ],
  "page": "Prov del 1 uppgift 1 a; Lärarguide kapitel 4",
  "term": "Sydamerika",
  "meaning": "världsdelen där potatisen har sitt ursprung",
  "extra": "Potatisen kom till Europa från Sydamerika."
 },
 {
  "id": "academy",
  "ab": "14",
  "a": "Kungliga Vetenskapsakademien",
  "hint": "En organisation som samlade och spred vetenskap.",
  "q": [
   "Vilken akademi bildades år 1739 för att sprida forskning?",
   "Vad hette organisationen som grundades 1739 för att främja vetenskap?",
   "En anteckning säger att Svenska Akademien bildades 1739 för just detta. Vilken akademi handlar kapitlet om?"
  ],
  "distractors": [
   "Svenska Akademien",
   "Krigsakademien"
  ],
  "page": "Prov del 1 uppgift 9 a; Lärarguide kapitel 4",
  "term": "Vetenskapsakademien",
  "meaning": "organisation grundad 1739 för vetenskap och forskning",
  "extra": "Akademien hör till 1700-talets utveckling av vetenskap."
 },
 {
  "id": "swedenFirst",
  "ab": "12",
  "a": "Sverige",
  "hint": "Tänk på en viktig lag från år 1766 och var den infördes.",
  "q": [
   "Vilket land införde en banbrytande tryckfrihetsförordning år 1766?",
   "I vilket land antogs tryckfrihetsförordningen år 1766?",
   "En tryckare påstår att lagen från 1766 infördes i Frankrike. Vilket land ska det stå?"
  ],
  "distractors": [
   "Frankrike",
   "England"
  ],
  "page": "Prov del 1 uppgift 1 a",
  "term": "Sverige",
  "meaning": "landet där en tidig tryckfrihetsförordning antogs år 1766",
  "extra": "Tryckfriheten infördes med historiska begränsningar och utökades senare."
 }
];
const facts={},explanations={},vocabulary={};
for(const row of DATA){
  facts[row.id]={ab:row.ab,a:row.a,hint:row.hint,q:row.q,
    variants:row.q.map(()=>[row.a,...row.distractors]),page:row.page};
  // Evidence is teacher-only metadata; feedback never reveals assessment sources.
  explanations[row.id]=[row.a+'. '+row.extra];
  vocabulary[row.id]=row.q.map(()=>[row.term,row.meaning]);
}
const runs=[
 {
  "p": "cafe",
  "r": 0,
  "f": [],
  "who": "Maja",
  "hello": "Det är nya tider. Någon har börjat tala om böcker, frihet och märkliga nya upptäckter.",
  "bye": "Gå till Brita i Tryckeriet. Hon har texter om hur man fick sprida det skrivna ordet."
 },
 {
  "p": "print",
  "r": 0,
  "f": [
   "pressFreedom",
   "censorship",
   "publicDocs",
   "swedenFirst"
  ],
  "who": "Brita",
  "hello": "Jag ska trycka ett blad om nya friheter. Men jag måste minnas skillnaden mellan tryckfrihet, censur och offentlighet.",
  "bye": "Olof vid Kyrkan kan berätta hur barnen lärde sig läsa."
 },
 {
  "p": "church",
  "r": 0,
  "f": [
   "catechism",
   "churchReading"
  ],
  "who": "Olof",
  "hello": "Jag hittar inte rätt ord bland läsböckerna. Hur gick undervisningen egentligen till?",
  "bye": "Sam i Vetenskapens hus sorterar forskarnas anteckningar."
 },
 {
  "p": "science",
  "r": 0,
  "f": [
   "science",
   "linnaeus",
   "latin",
   "celsius",
   "scheele",
   "oxygen",
   "academy"
  ],
  "who": "Sam",
  "hello": "Här ligger anteckningar om Linné, Celsius, Scheele och akademien. Jag vill lägga allt i rätt ordning.",
  "bye": "I Byn finns Sigrid. Hon behöver hjälp med vad Eva Ekeblad kom fram till."
 },
 {
  "p": "farm",
  "r": 0,
  "f": [
   "ekeblad",
   "potato",
   "flour",
   "origin"
  ],
  "who": "Sigrid",
  "hello": "Här på gården undrar vi vad som egentligen upptäcktes om potatisen. Kan du hjälpa mig?",
  "bye": "Brita på Tryckeriet vill se om du minns friheterna utan att läsa om dem."
 },
 {
  "p": "print",
  "r": 1,
  "f": [
   "censorship",
   "publicDocs",
   "pressFreedom",
   "swedenFirst"
  ],
  "who": "Brita",
  "hello": "Nu är underlaget undanlagt. Kan jag skilja de nya rättigheterna åt utan att läsa på?",
  "bye": "Gå till Olof i Kyrkan och pröva minnet om läsningen."
 },
 {
  "p": "church",
  "r": 1,
  "f": [
   "churchReading",
   "catechism"
  ],
  "who": "Olof",
  "hello": "Vi har lagt bort läroboken. Nu vill jag höra vad du minns på egen hand.",
  "bye": "Sam väntar i Vetenskapens hus."
 },
 {
  "p": "science",
  "r": 1,
  "f": [
   "linnaeus",
   "celsius",
   "scheele",
   "ekeblad",
   "academy"
  ],
  "who": "Sam",
  "hello": "Jag känner igen forskarnas namn, men vad hörde till vem? Vi får minnas utan papper.",
  "bye": "Sigrid i Byn vill repetera Ekeblads fynd."
 },
 {
  "p": "farm",
  "r": 1,
  "f": [
   "origin",
   "flour",
   "potato"
  ],
  "who": "Sigrid",
  "hello": "Det mesta är klart, men jag vill kunna berätta om potatisen utan lappen.",
  "bye": "Nu väntar de sista granskningarna hos Brita."
 },
 {
  "p": "print",
  "r": 2,
  "f": [
   "swedenFirst",
   "pressFreedom",
   "publicDocs"
  ],
  "who": "Brita",
  "hello": "Någon har skrivit flera felaktiga påståenden. Hjälp mig granska dem innan vi trycker bladet.",
  "bye": "Olof har fått en misstänkt uppgift om läsningen."
 },
 {
  "p": "church",
  "r": 2,
  "f": [
   "catechism",
   "churchReading"
  ],
  "who": "Olof",
  "hello": "Två anteckningar verkar blanda ihop kyrkan med helt andra institutioner.",
  "bye": "Sam ska granska anteckningar från forskarna i Vetenskapens hus."
 },
 {
  "p": "science",
  "r": 2,
  "f": [
   "science",
   "latin",
   "celsius",
   "oxygen",
   "academy",
   "linnaeus",
   "scheele"
  ],
  "who": "Sam",
  "hello": "Alla fynden har blandats ihop. Vi måste granska vem som undersökte vad.",
  "bye": "Sigrid i Byn har den sista lappen om Ekeblads arbete."
 },
 {
  "p": "farm",
  "r": 2,
  "f": [
   "ekeblad",
   "flour",
   "origin",
   "potato"
  ],
  "who": "Sigrid",
  "hello": "Här finns både rätt och fel om Eva Ekeblad och potatisen. Nu ska vi reda ut vad vi vet.",
  "bye": "Bra arbetat. Ta gärna en promenad genom staden och minns allt du undersökt."
 }
];
if(runs.some((r,i)=>i>0&&(!r.f.length||r.f.some(id=>!facts[id]))))throw Error('Kapitel 4: ogiltiga kunskapsuppdrag');
window.UPPDRAG_CH4_CONTENT={facts,runs,explanations,vocabulary,
 chapterTitle:'Nya tider, nya tankar',
 sources:'Lärarguide Nya tider, nya tankar · Arbetsboken s. 11–15',
 chapterThreeKey:'uppdrag1700.ch3-real-world.20261019.v1',
 chapterTwoKey:'uppdrag1700.ch2-real-world.20261019.v1',
 chapterOneKey:'uppdrag1700.ch1-real-world.20261019.v11'};
})();