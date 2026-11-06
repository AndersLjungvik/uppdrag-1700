const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');global.window=global;
const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz'))));
for(const name of ['recall-bank.js','recall-assessment.js'])vm.runInThisContext(snapshot.scripts[name],{filename:name});
for(const name of ['questions/fixes.js','questions/alignment.js'])vm.runInThisContext(fs.readFileSync(path.join(root,name),'utf8'));
vm.runInThisContext(snapshot.scripts['recall-flow.js']);
const A=UPPDRAG_RECALL_ASSESS,E=UPPDRAG_RECALL_ENGINE;
const before=A.assess,unchanged=UPPDRAG_RECALL_BANK.filter(t=>!(t.chapter===1&&t.topic==='power'&&t.rank>0)).map(t=>[t,before(t,t.fields.map(f=>f.sample),E.checkField)]);
const exact='kungens envälde upphörde och riksdagen och riksrådet fick ökat inflytande.';
assert.notEqual(before(E.byId.get('rc1-power-1'),[exact],E.checkField).status,'sufficient','reproduce the reported false negative');
vm.runInThisContext(fs.readFileSync(path.join(root,'questions/power-language.js'),'utf8'));
const accepted=[exact,
 'Enväldet tog slut och riksdagen fick mer makt.',
 'Kungen fick mindre makt och riksdagen bestämde mer.',
 'Kungen bestämde inte själv längre. Riksdagen fick mer makt.',
 'Kungen kunde inte längre bestämma själv och riksrådet fick större inflytande.',
 'Drottningen styrde inte längre ensam. Riksdagen fick mer att säga till om.',
 'Regentens makt minskade och riksdagens makt ökade.',
 'Kungens makt blev mindre. Riksrådet fick ökad makt.',
 'Kungen delade makten med riksdagen.',
 'Riksrådet delade makten med drottningen.',
 'Makten delades mellan kungen och riksdagen.',
 'Makten flyttades från kungen till riksdagen.',
 'Riksdagen begränsade kungens makt.',
 'Kungen fick mindre makt och riksdagen mer.',
 'Mindre makt till kungen och mer till riksdagen.',
 'Man avskaffade enväldet. Riksrådet fick mer inflytande.',
 'Det blev slut på kungens envälde. Riksdagen kunde bestämma mer.',
 'Enväldet hade upphört. Riksdagen och riksrådet begränsade regentens makt.',
 'KUNGEN BESTÄMDE INTE ENSAM. RIKSDAGEN FICK ÖKAT INFLYTANDE!',
 'kungens   envälde upphörde; riksdagen fick större makt.',
 'Kungen förlorade en del av sin makt. Riksdagen fick mer makt.',
 'Kungens makt var begränsad. Riksrådet fick utökat inflytande.'
];
const notAccepted=[
 'Kungen fick mer makt och riksdagen mindre.',
 'Enväldet tog inte slut och riksdagen fick mer makt.',
 'Kungen kunde fortfarande bestämma ensam och riksdagen fick mer makt.',
 'Kungen kunde inte bestämma ensam. Riksdagen fick inte mer makt.',
 'Kungen fick mindre makt. Riksdagen fick mindre makt.',
 'Kungen kunde inte bestämma ensam. Riksdagen fick mer makt. Riksrådet fick mindre makt.',
 'Enväldet upphörde, riksdagen fick mer makt och kungen behöll all makten.',
 'Enväldet upphörde. Alla människor fick lika mycket makt.',
 'Kungen fick mindre makt och alla människor fick lika makt. Riksdagen fick mer makt.',
 'Riksdagen fick större makt.', 'Kungens envälde upphörde.',
 'Kungen och riksdagen.', 'makt frihet riksdag envälde',
 'De fick mer.', 'Kungen fanns och riksdagen bestämde.',
 'Kungen hade ingen makt och riksdagen fick mer makt.',
 '.', 'Jag vet inte'
];
for(const id of ['rc1-power-1','rc1-power-2']){
 const t=E.byId.get(id);
 for(const value of accepted)assert.equal(A.assess(t,[value],E.checkField).status,'sufficient',id+': '+value);
 for(const value of notAccepted)assert.notEqual(A.assess(t,[value],E.checkField).status,'sufficient',id+': '+value);
}
for(const[t,result]of unchanged)assert.deepEqual(A.assess(t,t.fields.map(f=>f.sample),E.checkField),result,t.id+' changed outside scope');
console.log('PASS power language:',accepted.length*2,'valid formulations,',notAccepted.length*2,'false/incomplete answers and',unchanged.length,'unchanged tasks');
