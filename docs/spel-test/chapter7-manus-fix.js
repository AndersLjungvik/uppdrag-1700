/* Chapter 7 manuscript alignment, 17 November 2026.
 * Ask about the man's expectation, which is what the existing model and
 * injustice rule cover. No new claim about a court decision is introduced.
 */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==undefined&&window.__INTEGRATED_CHAPTER!==7)return;
const task=window.UPPDRAG_RECALL_BANK?.find(t=>t.id==='rc7-resistance-2'&&t.chapter===7);
if(!task||task.rank!==2||task.fields.length!==2||task.fields[1].rule!=='injustice')throw Error('Kapitel 7: frågan om Marie Anne och Cecile kunde inte kopplas till sitt manus.');
const before='Vad visar berättelsen om Marie Anne och Cecile? Skriv både vad de försökte göra och hur systemet bemötte dem.';
const after='Vad försökte Marie Anne och Cecile göra, och varför räknade mannen med att de inte skulle våga klaga?';
if(task.prompt!==before&&task.prompt!==after)throw Error('Kapitel 7: frågans manus har ändrats och behöver jämföras innan rättelsen kan användas.');
task.prompt=after;
task.fields[1].label='Mannens förväntan';
task.fields[1].criterion='Mannens förväntan';
window.UPPDRAG_CH7_MANUS_FIX={version:'1.0.0'};
})();
