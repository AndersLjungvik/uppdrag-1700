/* Optional language support, not answer hints, for source-bound chapter 2. */
(function(){
'use strict';
const source=window.UPPDRAG_CH2_CONTENT;
const core=(id,rank=0)=>source.reading[id]?.[rank]||source.reading[id]?.[0]||source.chapters1[id]?.a||'';
const word=(id,rank=0)=>source.vocabulary[id]?.[rank]||null;
function say(value){
 if(!value||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return false;
 const voice=new window.SpeechSynthesisUtterance(value);voice.lang='sv-SE';voice.rate=.88;
 window.speechSynthesis.cancel();window.speechSynthesis.speak(voice);return true;
}
window.UPPDRAG_CH2_READING={core,word,say,canSpeak:!!(window.speechSynthesis&&window.SpeechSynthesisUtterance)};
})();