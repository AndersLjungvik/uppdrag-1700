const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz')))).scripts;
function context(chapter){
 const c={__INTEGRATED_CHAPTER:chapter};c.window=c;vm.createContext(c);
 for(const n of ['recall-bank.js','recall-assessment.js'])vm.runInContext(snapshot[n],c);
 for(const n of ['fixes','alignment','power-language'])vm.runInContext(read('questions/'+n+'.js'),c);
 c.UPPDRAG_RECALL_ASSESS.decorate(c.UPPDRAG_RECALL_BANK);return c;
}
const c=context(4),A=c.UPPDRAG_RECALL_ASSESS;
const original=JSON.stringify(c.UPPDRAG_RECALL_BANK.filter(t=>t.chapter!==4));
vm.runInContext(read('questions/chapter4-material.js'),c);vm.runInContext(read('questions/chapter4-review.js'),c);vm.runInContext(snapshot['recall-flow.js'],c);
const core=c.UPPDRAG_RECALL_BANK.filter(t=>t.chapter===4&&!t.reviewOnly),review=c.UPPDRAG_RECALL_BANK.filter(t=>t.reviewOnly),E=c.UPPDRAG_RECALL_ENGINE;
assert.equal(core.length,15);assert.equal(review.length,45);assert.equal(new Set(c.UPPDRAG_RECALL_BANK.map(t=>t.id)).size,c.UPPDRAG_RECALL_BANK.length);
assert.equal(JSON.stringify(c.UPPDRAG_RECALL_BANK.filter(t=>t.chapter!==4&&!t.reviewOnly)),original,'other chapters retain every field and model');
for(const t of core)assert.equal(A.assess(t,t.fields.map(f=>f.sample),E.checkField).status,'sufficient',t.id);
const by=id=>E.byId.get(id),status=(id,d)=>A.assess(by(id),d,E.checkField).status;
assert.equal(by('rc4-researchers-0').fields.length,6,'all six workbook links');
assert(by('rc4-researchers-0').fields.some(f=>/apotekare/.test(f.label)));
assert(by('rc4-researchers-0').fields.some(f=>/is och ånga/.test(f.label)));
assert(by('rc4-researchers-0').fields.some(f=>/bildade/.test(f.label)));
for(const r of [0,1,2])assert(by('rc4-freedoms-'+r).fields.some(f=>f.answers?.includes('Censur')));
for(const id of ['hattar-mossor','katekesen','kolt','tryckfrihet','aga','offentlighet','oakta','censur','skampale','budkavle'])assert(by('material4-sos-'+id),id);
assert(by('material4-tsar'));
for(const t of review){assert(t.chapter<=4&&t.source&&t.drill?.answers?.length);assert.equal(E.checkField({answers:t.drill.answers},t.drill.sample),'correct',t.id);}
const bibleOK=[
 'Det stod inte att man alltid måste lyda kungen. Man kunde läsa om fred och att alla var lika mycket värda.',
 'Fred och alla människors lika värde.',
 'Man behövde inte alltid lyda kungen och alla var lika mycket värda.',
 'Bibeln sa inte att man alltid skulle lyda kungen. Den handlade också om fred.',
 'Kungen måste inte alltid lydas. Människor hade samma värde.',
 'Det fanns inget krav på att lyda kungen. Alla hade samma värde.'
];
for(const s of bibleOK)assert.equal(status('rc4-reading-2',[s]),'sufficient',s);
for(const s of ['fred','Alla var lika mycket värda.','Det stod att man alltid måste lyda kungen. Fred och alla var lika mycket värda.','Alla var inte lika mycket värda. De läste om fred.','Man behövde inte alltid lyda kungen men Bibeln handlade inte om fred.','Jag vet inte'])assert.notEqual(status('rc4-reading-2',[s]),'sufficient',s);
for(const value of ['mer tid och pengar','pengar, tid','pengar samt tid'])assert.equal(status('rc4-academy-1',['Vetenskapsakademien','fred',value]),'sufficient',value);
const science=by('rc4-academy-2').fields[0].sample;
for(const s of ['När det var fred oftare kunde mer tid och pengar användas till forskning.','Freden gav mer tid och pengar till forskning.','Med färre krig kunde man lägga tid och pengar på att forska.','Eftersom det inte var krig kunde forskarna använda mer tid och pengar.'])assert.equal(status('rc4-academy-2',[science,s]),'sufficient',s);
for(const s of ['fred tid pengar forskning','Det blev fred.','Freden gav mindre tid och pengar till forskning.','Freden gav mer tid och pengar.','När det var krig fanns mer tid och pengar till forskning.',''])assert.notEqual(status('rc4-academy-2',[science,s]),'sufficient',s);
for(const id of ['rc4-freedoms-1','rc4-researchers-1','rc4-academy-1'])assert.notEqual(status(id,[by(id).fields[0].sample]),'sufficient','old shorter answer cannot cover newly required fields: '+id);
const fields=JSON.stringify(core.map(t=>t.fields));A.decorate(c.UPPDRAG_RECALL_BANK);assert.equal(JSON.stringify(core.map(t=>t.fields)),fields,'decorating twice never duplicates fields');
for(const ch of [1,2,3]){const x=context(ch),before=JSON.stringify(x.UPPDRAG_RECALL_BANK);vm.runInContext(read('questions/chapter4-material.js'),x);vm.runInContext(read('questions/chapter4-review.js'),x);assert.equal(JSON.stringify(x.UPPDRAG_RECALL_BANK),before);}
import(require('url').pathToFileURL(path.join(root,'../../curriculum/classroom.mjs')).href).then(({default:cards,sources})=>{
 const canonical=cards.filter(q=>q.type==='short'&&q.storyChapter<=4);assert.equal(canonical.length,44);
 for(const q of canonical){const t=by('material4-'+q.id);assert(t,q.id);assert.equal(t.prompt,q.question);assert.equal(t.chapter,q.storyChapter);assert.equal(JSON.stringify(t.drill.answers),JSON.stringify(q.accept));for(const ref of q.references)assert(t.source.includes(sources[ref.source].title+' · '+ref.location),q.id+' '+ref.source);}
 console.log('PASS chapter 4 material: 15 complete tasks, 45 source-linked review cards matching the canonical classroom bank, all workbook links and 11 test terms, paraphrases, contradictions/incomplete answers, idempotence and unchanged earlier chapters');
}).catch(e=>{console.error(e);process.exitCode=1;});
