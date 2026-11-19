'use strict';
const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz'))));
const plain=value=>JSON.parse(JSON.stringify(value));
function setup(){
 const context={};context.window=context;vm.createContext(context);
 for(const name of ['recall-bank.js','recall-assessment.js'])vm.runInContext(snapshot.scripts[name],context,{filename:name});
 for(const name of ['questions/fixes.js','questions/alignment.js','questions/power-language.js','mastery-recall-adapter.js','pupil-language.js'])vm.runInContext(read(name),context,{filename:name});
 return context;
}
const original=setup(),localized=setup();
const aligned=original.UPPDRAG_PROMPT_ALIGNMENT.flow(original.UPPDRAG_MASTERY_RECALL.source(snapshot.scripts['recall-flow.js']));
const bankBefore=JSON.stringify(localized.UPPDRAG_RECALL_BANK),assessmentBefore=localized.UPPDRAG_RECALL_ASSESS.assess;
const flow=localized.UPPDRAG_PUPIL_LANGUAGE.flow;
const result=flow(aligned);
assert.equal(typeof result,'string');assert.notEqual(result,aligned);
assert.equal(JSON.stringify(localized.UPPDRAG_RECALL_BANK),bankBefore,'display adaptation does not mutate the question bank');
assert.equal(localized.UPPDRAG_RECALL_ASSESS.assess,assessmentBefore,'display adaptation does not replace the assessment');
assert.throws(()=>flow(null),/Elevspråket/);
assert.throws(()=>flow(aligned.replace('Innehållskraven känns igen','changed upstream')),/Elevspråket/,'a missing anchor stops adaptation');
assert.throws(()=>flow(aligned+'\n// Innehållskraven känns igen'),/Elevspråket/,'an ambiguous anchor stops adaptation');
new vm.Script(result,{filename:'recall-flow-year6.js'});
vm.runInContext(aligned,original,{filename:'recall-flow-before.js'});
vm.runInContext(result,localized,{filename:'recall-flow-year6.js'});
assert.deepEqual(plain(localized.UPPDRAG_RECALL_BANK),plain(original.UPPDRAG_RECALL_BANK),'all decorated prompts, fields, examples, sources and requirements stay identical');
const before=original.UPPDRAG_RECALL_ENGINE,after=localized.UPPDRAG_RECALL_ENGINE;
let checks=0;
for(const task of original.UPPDRAG_RECALL_BANK){
 const translated=after.byId.get(task.id);assert(translated);
 for(const answer of [task.fields.map(field=>field.sample),task.fields.map(()=>'.'),task.fields.map(()=>'Jag vet inte')]){
  assert.deepEqual(plain(localized.UPPDRAG_RECALL_ASSESS.assess(translated,answer,after.checkField)),plain(original.UPPDRAG_RECALL_ASSESS.assess(task,answer,before.checkField)),task.id+' assessment changed');
  checks++;
 }
}
for(const phrase of ['Titta på ditt svar igen','Spelet är osäkert på ditt svar. Det kan ändå vara rätt.','Ändra mitt svar','Spara och visa läraren','Du har fått hjälp med svaret. För en mästarstämpel behöver du sedan svara utan hjälp.'])assert(result.includes(phrase),phrase);
for(const phrase of ['försiktig regelkontroll','automatiskt validerad','Innehållskraven känns igen','Skriv ett innehållsligt svar'])assert(!result.includes(phrase),phrase+' remains in pupil UI');
assert(result.includes("data-action=\"rc-"),'action identifiers stay unchanged');
assert(result.includes("s.recallEvidence.push"),'unrecognised answers still retain evidence');
assert.equal(localized.UPPDRAG_PUPIL_LANGUAGE.criterion('Ge ett konkret exempel på ojämlikt inflytande.'),'Ge ett exempel på att stånden inte fick bestämma lika mycket.');
assert.equal(localized.UPPDRAG_PUPIL_LANGUAGE.criterion('ett okänt begrepp'),'ett okänt begrepp');
assert(result.includes('criterion(d.label)'),'labels are translated only when rendered');
console.log('PASS pupil language: unique frozen-source anchors, generated syntax, unchanged question data and '+checks+' unchanged assessments, clear feedback without false rejection or mastery');
