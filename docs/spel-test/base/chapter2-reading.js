/* Optional language support, not answer hints, for source-bound chapter 2. */
(function(){
'use strict';
const source=window.UPPDRAG_CH2_CONTENT;
const EXPLAIN={
 "married": [
  "På 1700-talet hade gifta kvinnor inte samma rättigheter som sina män. Enligt tidens regler var det mannen som bestämde över sin hustru.",
  "Det betyder inte att alla kvinnor levde på exakt samma sätt. Men lagarna gav män mer makt. I Sverige i dag ska kvinnor och män ha samma rättigheter."
 ],
 "unmarried": [
  "En kvinna som inte var gift kunde ändå behöva lyda en man i familjen. Det kunde vara hennes far, bror eller en annan manlig släkting.",
  "Därför var en ogift kvinna inte automatiskt fri att bestämma över sitt eget liv. Hennes möjligheter påverkades av tidens regler."
 ],
 "priests": [
  "På 1700-talet hade kyrkan stort inflytande över människors liv. Prästerna lärde ut hur de ansåg att familjer skulle leva.",
  "I boken står att prästerna beskrev männens rätt att bestämma som Guds vilja. Det är en beskrivning av vad de lärde då, inte en regel vi ska följa i dag."
 ],
 "punishment": [
  "Aga betydde att någon blev slagen som straff. På 1700-talet tillät reglerna att män agade sina fruar och barn.",
  "Det var ett sätt att använda makt över andra. I Sverige i dag är det förbjudet att slå barn och att använda våld mot sin partner."
 ],
 "noble": [
  "Adeln var en grupp som hade stor makt i samhället. En del adelsmän ägde jord där bönder bodde och arbetade.",
  "Enligt boken fick adeln rätt att aga bönder på sin mark. Det visar hur olika rättigheter människor hade på den tiden."
 ],
 "mother": [
  "En ogift kvinna som väntade barn kunde bli straffad på 1700-talet. Hon kunde få böter, alltså behöva betala pengar.",
  "Hon kunde också bli utsatt för offentlig skam. Det innebar att andra människor fick se hur hon behandlades illa. Kvinnors och mäns villkor var inte lika."
 ],
 "barnhusNeed": [
  "Ett barnhus var ett ställe där barn kunde bo om de inte hade någon som tog hand om dem. Det kunde bero på att de vuxna inte kunde eller ville ge barnet omsorg.",
  "Barnhuset gav barnen någonstans att vara. Men det betydde inte alltid att barnen fick ett tryggt och lätt liv."
 ],
 "barnhusWork": [
  "Barn på barnhus behövde ofta arbeta. En del sydde, tvättade eller spann tråd av ull eller lin.",
  "Arbetsdagarna kunde vara långa. Barnens vardag såg därför mycket annorlunda ut än många barns vardag i Sverige i dag."
 ],
 "barnhusLife": [
  "Livet på ett barnhus kunde vara svårt. Maten kunde vara dålig och barnen kunde bli hårt behandlade eller bestraffade.",
  "Barnen behövde både mat och omsorg, men fick inte alltid det de behövde. Boken visar att barn hade mycket olika villkor under 1700-talet."
 ]
};
function explain(id){return EXPLAIN[id]||window.UPPDRAG_CH1_READING?.explain?.(id)||null;}
const core=(id,rank=0)=>source.reading[id]?.[rank]||source.reading[id]?.[0]||source.chapters1[id]?.a||'';
const word=(id,rank=0)=>source.vocabulary[id]?.[rank]||null;
function say(value){
 if(!value||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return false;
 const voice=new window.SpeechSynthesisUtterance(value);voice.lang='sv-SE';voice.rate=.88;
 window.speechSynthesis.cancel();window.speechSynthesis.speak(voice);return true;
}
window.UPPDRAG_CH2_READING={core,word,explain,say,canSpeak:!!(window.speechSynthesis&&window.SpeechSynthesisUtterance)};
})();