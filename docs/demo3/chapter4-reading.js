/* Kapitel 3: short memory hooks and easy language explanation;
 * read-aloud is free language support, not a graded history hint. */
(function(){
'use strict';
const data=window.UPPDRAG_CH4_CONTENT;
const core=(id,rank=0)=>data.facts[id]?.a||
  window.UPPDRAG_CH3_READING?.core(id,rank)||
  window.UPPDRAG_CH2_READING?.core(id,rank)||window.UPPDRAG_CH1_READING?.core(id,rank)||'';
const explain=id=>data.explanations[id]||
  window.UPPDRAG_CH3_READING?.explain(id)||
  window.UPPDRAG_CH2_READING?.explain(id)||window.UPPDRAG_CH1_READING?.explain(id)||null;
const word=(id,rank=0)=>data.vocabulary[id]?.[rank]||
  window.UPPDRAG_CH3_READING?.word(id,rank)||
  window.UPPDRAG_CH2_READING?.word(id,rank)||window.UPPDRAG_CH1_READING?.word(id,rank)||null;
function say(text){
 if(!text||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return false;
 const utterance=new window.SpeechSynthesisUtterance(text);
 utterance.lang='sv-SE';utterance.rate=.88;
 window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
 return true;
}
window.UPPDRAG_CH4_READING={core,explain,word,say,canSpeak:!!(window.speechSynthesis&&window.SpeechSynthesisUtterance)};
})();