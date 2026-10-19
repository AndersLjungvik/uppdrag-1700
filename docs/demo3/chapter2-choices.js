/* Källgranskade kapitel-2-val, med rättalternativ på skiftande plats.
   Samma kunskap testas på alla tre återbesök. */
(function(){
'use strict';
function optionsFor(key,rank=0,attempt=0){
 const data=window.UPPDRAG_CH2_CONTENT?.facts?.[key];
 if(!data){
   // Rut can also review chapter 1. It uses the genuine chapter-1 option bank.
   return window.UPPDRAG_CH1_CHOICES?.optionsFor?.(key,rank,attempt)||null;
 }
 const candidates=data.variants?.[rank]||data.variants?.[0];
 if(!candidates||candidates.length!==3)throw new Error('Historiska alternativ saknas: '+key+'/'+rank);
 const seed=(key+':'+rank+':'+attempt).split('').reduce((h,ch)=>(h*33+ch.charCodeAt(0))>>>0,5381);
 const shift=seed%3,order=[0,1,2].map((_,i)=>(i+shift)%3);
 if(seed%2)order.reverse();
 return {options:order.map(i=>candidates[i]),correctIndex:order.indexOf(0)};
}
window.UPPDRAG_CH2_CHOICES={optionsFor};
})();