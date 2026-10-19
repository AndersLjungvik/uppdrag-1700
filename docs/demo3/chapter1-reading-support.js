/* Kapitel 1 – lättläst svarssida och språkstöd, samma historiska innehåll.
   Hjälporden förklarar bara uppgiftsspråket, aldrig den kunskap som testas.
   Uppläsning är ett läshjälpmedel och inte en minnesledtråd. */
(function(){
'use strict';
const CORE={
 queen:['Ulrika Eleonora.','Ulrika Eleonora.','Ulrika Eleonora.'],
 absolute:[
  'Ulrika Eleonora bestämde inte ensam. Riksdagen och riksrådet hade också makt.',
  'Ulrika Eleonora bestämde inte ensam. Riksdagen och riksrådet hade också makt.',
  'Ulrika Eleonora var inte enväldig. Riksdagen och riksrådet hade också makt.'
 ],
 freedom:[
  'Enväldet tog slut. Riksdagen och riksrådet fick mer makt.',
  'Regenten kunde inte längre bestämma ensam. Riksdagen fick mer makt.',
  'Regenten fick mindre makt, men adeln hade fortfarande störst inflytande.'
 ],
 trade:[
  'Ostindiska kompaniet handlade med Kina. Fartygen tog hem te, siden och porslin.',
  'Fartygen reste till Kina för att handla med varor.',
  'Kompaniet handlade med Kina. Det reste inte dit för att kriga.'
 ],
 law:[
  'Grundlagen bestämde hur makten skulle delas.',
  'Grundlagen bestämde hur makten skulle delas efter enväldet.',
  'Grundlagen delade makten. Regenten fick inte bestämma allt ensam.'
 ],
 change:[
  'Hela riksdagen måste vara överens för att ändra grundlagen.',
  'Hela riksdagen måste vara överens. En person kunde inte ändra grundlagen.',
  'Hela riksdagen måste vara överens om en ändring.'
 ],
 nobles:[
  'Adeln.',
  'Adeln.',
  'Adeln hade störst makt. Bönderna fick inte vara med på vissa viktiga möten.'
 ]
};
const WORDS={
 queen:[
  ['efterträdde','kom efter någon'],
  ['övertog tronen','blev den nya regenten'],
  ['egentligen','på riktigt']
 ],
 absolute:[
  null, // 'enväldig' is the concept being tested; defining it here would reveal the answer.
  ['begränsades','fick inte bestämma lika mycket'],
  ['rätta felet','tala om vad som stämmer i stället']
 ],
 freedom:[
  ['kallas','får namnet'],
  ['styret','hur landet styrdes'],
  ['lika för alla','alla hade inte samma möjligheter']
 ],
 trade:[
  ['kompani','ett handelsföretag'],
  ['uppgift','vad någon skulle göra'],
  ['i stället','vad som faktiskt stämmer']
 ],
 law:[
  ['innehålla','ha med'],
  ['skrevs','gjordes till'],
  ['rätta påståendet','tala om vad som är rätt']
 ],
 change:[
  ['enligt','som det står i'],
  ['ensam riksdagsman','en enda person i riksdagen'],
  ['ändra','göra om']
 ],
 nobles:[
  ['stånd','en grupp människor i dåtidens samhälle'],
  ['dominerade','bestämde mest'],
  ['trots','fastän']
 ]
};
const EXPLAIN={
 "queen": [
  "Karl XII hade varit kung i Sverige. När han dog tog hans syster Ulrika Eleonora över tronen. Hon blev drottning.",
  "Hon fick inte styra ensam som de tidigare enväldiga kungarna. Riksdagen och riksrådet fick också makt."
 ],
 "absolute": [
  "Tidigare hade kungen mycket stor makt. En enväldig kung kunde bestämma nästan allt själv.",
  "Under frihetstiden förändrades det. Ulrika Eleonora behövde dela makten med riksdagen och riksrådet."
 ],
 "freedom": [
  "Tiden mellan 1719 och 1772 kallas frihetstiden. Kungens envälde tog slut. Riksdagen och riksrådet fick mer makt.",
  "Men det betydde inte att alla människor blev lika fria. Adeln hade fortfarande mer makt än många andra."
 ],
 "trade": [
  "Ostindiska kompaniet skickade fartyg till Asien för att handla. Fartygen reste särskilt till Kina.",
  "De köpte varor som te, siden och porslin och tog med dem hem till Sverige. Det var handel, inte ett krigsuppdrag."
 ],
 "law": [
  "En grundlag är en extra viktig lag. Den handlar om hur ett land ska styras och vem som får bestämma.",
  "När enväldet tog slut behövdes regler som delade makten mellan regenten, riksdagen och riksrådet."
 ],
 "change": [
  "En grundlag handlar om hur landet styrs. Därför kunde inte en enda person ändra den när han ville.",
  "Enligt boken behövde hela riksdagen vara överens om ändringen. Det räckte alltså inte att en adelsman eller regenten sa ja."
 ],
 "nobles": [
  "I riksdagen fanns fyra stånd: adel, präster, borgare och bönder. Ett stånd var en grupp i samhället.",
  "De fyra stånden hade inte lika mycket makt. Adeln bestämde mest. Bönderna fick inte vara med på vissa viktiga möten."
 ]
};
function explain(id){return EXPLAIN[id]||null;}
function core(id,rank=0){return CORE[id]?.[rank]||CORE[id]?.[0]||''}
function word(id,rank=0){return WORDS[id]?.[rank]||null}
function say(text){
 if(!text||typeof window.speechSynthesis==='undefined'||typeof window.SpeechSynthesisUtterance==='undefined')return false;
 const u=new window.SpeechSynthesisUtterance(text);u.lang='sv-SE';u.rate=.87;
 window.speechSynthesis.cancel();window.speechSynthesis.speak(u);
 return true;
}
window.UPPDRAG_CH1_READING={core,word,explain,say,canSpeak:!!(window.speechSynthesis&&window.SpeechSynthesisUtterance)};
})();