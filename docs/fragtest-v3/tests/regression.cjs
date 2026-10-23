const fs=require('fs'),vm=require('vm'),assert=require('assert');
const path=require('path'),root=path.resolve(__dirname,'..');global.window=global;
for(const f of ['src/recall-bank.js','src/recall-assessment.js','fixes.js','src/recall-flow.js'])vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const A=UPPDRAG_RECALL_ASSESS,E=UPPDRAG_RECALL_ENGINE,results=[];
function check(id,answer,expected=true){const t=E.byId.get(id),drafts=Array.isArray(answer)?answer:[answer];const r=A.assess(t,drafts,E.checkField);results.push({id,answer,expected,status:r.status});assert.equal(r.status==='sufficient',expected,JSON.stringify(results.at(-1)));}
for(const t of UPPDRAG_RECALL_BANK){check(t.id,t.fields.map(f=>f.sample));check(t.id,t.fields.map(()=>'.'),false);}
const positives=[
'Grundlagen reglerade maktfördelningen. Endast enig riksdag kunde ändra grundlagarna.',
'Grundlagen reglerade maktfördelningen. Bara en enig riksdag kunde ändra den.',
'Den reglerade hur makten delades. Hela riksdagen behövde vara överens om ändringar.',
'Grundlagen beskrev hur landet skulle styras. Det krävdes en enig riksdag för att ändra den.',
'Den bestämde vem som fick bestämma. Alla i riksdagen måste vara överens för att ändra den.',
'Grundlagen reglerade maktfördelningen. En ensam riksdagsman kunde inte ändra den eftersom hela riksdagen måste vara överens.'
];
for(const a of positives)check('rc1-law-2',a);
for(const a of [
'Grundlagen reglerade maktfördelningen.',
'Endast enig riksdag kunde ändra grundlagarna.',
'Grundlagen reglerade inte maktfördelningen. Endast enig riksdag kunde ändra grundlagarna.',
'Grundlagen reglerade maktfördelningen. Riksdagen behövde inte vara enig för att ändra den.',
'Grundlagen reglerade maktfördelningen. Ingen enighet i riksdagen krävdes för att ändra den.',
'Grundlagen reglerade maktfördelningen. Hela riksdagen måste vara överens men en ensam riksdagsman kunde ändra den.',
'Grundlagen reglerade maktfördelningen. Endast kungen kunde ändra den.',
'maktfördelning enig riksdag ändring',
'Grundlagen reglerade maktfördelningen. Enig riksdag.'
])check('rc1-law-2',a,false);
for(const a of ['Kungen fick mindre makt. Riksdagen fick mer makt.','Drottningen kunde inte bestämma ensam. Riksdagen och riksrådet fick mer makt.','Enväldet upphörde. Riksdagen fick större inflytande.'])check('rc1-power-2',a);
for(const a of ['Kungen fick mindre makt. Riksdagen fick inte mer makt.','Kungen kunde fortfarande bestämma ensam. Riksdagen fick mer makt.','Enväldet upphörde. Riksdagen fick mindre makt.','Enväldet upphörde inte. Riksdagen fick mer makt.','Kungen fick mindre makt. Riksdagen hade makt.'])check('rc1-power-2',a,false);
check('rc1-law-1',['hur Sverige styrs och hur makten fördelas','en enig riksdag']);
check('rc5-press-2','Tortyr förbjöds.',false);
check('rc5-press-2','Tortyr förbjöds. Men tryckfriheten begränsades så kritik blev svårare att publicera.');
fs.writeFileSync(path.join(root,'test-results.json'),JSON.stringify({version:UPPDRAG_FRAGTEST_VERSION,count:results.length,results},null,2));
console.log('PASS',results.length,'cases;',UPPDRAG_RECALL_BANK.length,'original questions');
