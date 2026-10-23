/* Correct option positions are shuffled on new paid attempts.
 * Previously solved chapters retain their own source-checked options. */
(function(){
'use strict';
function optionsFor(id,rank=0,attempt=0){
 const bank=window.UPPDRAG_CH4_CONTENT.facts[id];
 if(!bank)return window.UPPDRAG_CH3_CHOICES?.optionsFor?.(id,rank,attempt)
          ||window.UPPDRAG_CH2_CHOICES?.optionsFor?.(id,rank,attempt)
          ||window.UPPDRAG_CH1_CHOICES?.optionsFor?.(id,rank,attempt)||null;
 const choices=bank.variants[rank]||bank.variants[0];
 const seed=(id+':'+rank+':'+attempt).split('').reduce((n,ch)=>(n*33+ch.charCodeAt(0))>>>0,5381);
 const offset=seed%3,order=[0,1,2].map((_,i)=>(i+offset)%3);
 if(seed%2)order.reverse();
 return {options:order.map(i=>choices[i]),correctIndex:order.indexOf(0)};
}
window.UPPDRAG_CH4_CHOICES={optionsFor};
})();