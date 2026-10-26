/* Revision 1.2.3: restore the chapter 1–5 city layout in chapter 6.
 * Put five moving grazing animals between Byn and Herrgården, off the roads.
 * Changes only rendering and map coordinates, never questions or saves. */
(function(){
'use strict';
const prior=window.UPPDRAG_GAMEPLAY_TUNING?.source;
if(typeof prior!=='function')throw Error('Stadsplanen kräver föregående speljustering.');
const lifeFiles=new Set(['world-life.js','world-life-ch3.js','world-life-ch4.js','world-life-ch5.js']);
function once(file,source,oldText,newText){
 const index=source.indexOf(oldText);
 if(index<0||source.indexOf(oldText,index+1)>=0)
   throw Error('Kan inte återställa '+file+': väntad källkod saknas eller är dubbel.');
 return source.slice(0,index)+newText+source.slice(index+oldText.length);
}
function restore(file,source){
 if(file==='paper-look.js'){
   return once(file,source,"!document.title.match(/Kapitel\\s+[1-5]\\b/i)",
     "!document.title.match(/Kapitel\\s+(?:10|[1-9])\\b/i)");
 }
 if(!lifeFiles.has(file))return source;
 // The estate road is y=355, the village road y=705.
 source=once(file,source,
   'const PADDOCK = [[2945,1107],[3170,1104],[3180,1225],[2950,1228]];',
   'const PADDOCK = [[3161,449],[3412,439],[3426,601],[3157,608]];');
 const before=[
"    {kind:'sheep',x:2994,y:1140,phase:500,span:22,duration:6200,pause:3500},",
"    {kind:'sheep',x:3060,y:1136,phase:8900,span:20,duration:5700,pause:3100},",
"    {kind:'sheep',x:3130,y:1141,phase:3400,span:18,duration:5300,pause:3700},",
"    {kind:'cow',x:3008,y:1191,phase:12100,span:25,duration:7600,pause:4400},",
"    {kind:'cow',x:3115,y:1189,phase:4300,span:28,duration:8100,pause:4000}"
 ].join('\n');
 const after=[
"    {kind:'sheep',x:3201,y:481,phase:500,span:22,duration:6200,pause:3500},",
"    {kind:'sheep',x:3282,y:477,phase:8900,span:20,duration:5700,pause:3100},",
"    {kind:'sheep',x:3371,y:480,phase:3400,span:18,duration:5300,pause:3700},",
"    {kind:'cow',x:3230,y:557,phase:12100,span:25,duration:7600,pause:4400},",
"    {kind:'cow',x:3355,y:553,phase:4300,span:28,duration:8100,pause:4000}"
 ].join('\n');
 source=once(file,source,before,after);
 source=once(file,source,
  'const x=2965+(i*47%185),y=1120+(i*29%90);',
  'const x=3180+(i*47%212),y=465+(i*29%118);');
 return source;
}
window.UPPDRAG_GAMEPLAY_TUNING.source=(name,source)=>restore(name,prior(name,source));
window.UPPDRAG_WORLD_RESTORATION={version:'1.2.3',worldLayout:'roads-1',pasture:'byn-herrgarden'};
})();