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
function core(id,rank=0){return CORE[id]?.[rank]||CORE[id]?.[0]||''}
function word(id,rank=0){return WORDS[id]?.[rank]||null}
function say(text){
 if(!text||typeof window.speechSynthesis==='undefined'||typeof window.SpeechSynthesisUtterance==='undefined')return false;
 const u=new window.SpeechSynthesisUtterance(text);u.lang='sv-SE';u.rate=.87;
 window.speechSynthesis.cancel();window.speechSynthesis.speak(u);
 return true;
}
window.UPPDRAG_CH1_READING={core,word,say,canSpeak:!!(window.speechSynthesis&&window.SpeechSynthesisUtterance)};
})();