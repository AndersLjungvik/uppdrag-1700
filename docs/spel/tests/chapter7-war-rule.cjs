const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');global.window=global;
const run=(name,text)=>vm.runInThisContext(text,{filename:name});
const decode=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz'))));
for(const name of ['recall-bank.js','recall-assessment.js'])run(name,decode.scripts[name]);
for(const name of ['questions/fixes.js','questions/alignment.js','chapter6-content.js'])run(name,fs.readFileSync(path.join(root,name),'utf8'));
const seven=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'chapter7-sourcepack.json.gz'))));
run('chapter7-content.js',seven.scripts['chapter7-content.js']);
const A=UPPDRAG_RECALL_ASSESS,t=UPPDRAG_RECALL_BANK.find(x=>x.id==='rc7-warStart-1');
assert(t&&t.rank===1&&t.chapter===7);
const check=(f,v)=>f.answers?.some(a=>A.norm(a)===A.norm(v))?'correct':'review';
assert.notEqual(A.assess(t,['Han kunde inte starta kring utan riksdagens godkännande'],check).status,'sufficient');
run('chapter7-war-rule-fix.js',fs.readFileSync(path.join(root,'chapter7-war-rule-fix.js'),'utf8'));
const accepted=[
 'Han kunde inte starta kring utan riksdagens godkännande',
 'Han kunde inte starta krig utan riksdagens godkännande.',
 'Riksdagen behövde godkänna ett anfallskrig.',
 'Kungen fick inte starta ett anfallskrig utan riksdagens godkännande.',
 'Kungen behövde riksdagens godkännande för att inleda krig.',
 'Gustav III måste ha riksdagens tillstånd för att starta ett krig.',
 'Bara om riksdagen godkände fick kungen starta ett anfallskrig.'
];
const denied=[
 'Kungen kunde starta anfallskrig utan att fråga riksdagen.',
 'Kungen kunde starta krig utan riksdagens godkännande.',
 'Han behövde inte riksdagens godkännande för att starta krig.',
 'Riksdagen behövde inte godkänna kriget.',
 'Han hade rätt att starta krig utan riksdagens tillstånd.'
];
const review=['Riksdagen fanns i Sverige.','Kungen ville starta krig.','Jag vet inte','Kring utan godkännande.'];
for(const s of accepted)assert.equal(A.assess(t,[s],check).status,'sufficient',s);
for(const s of [...denied,...review])assert.notEqual(A.assess(t,[s],check).status,'sufficient',s);
for(const q of UPPDRAG_RECALL_BANK.filter(x=>x.chapter===7&&x.id!==t.id))
 assert.equal(A.assess(q,q.fields.map(f=>f.sample),check).status,'sufficient',q.id);
console.log('PASS: 7 valid, 5 false, 4 incomplete, 35 unchanged chapter-seven samples');
