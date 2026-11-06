const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz')))).scripts;
function context(chapter){const c={__INTEGRATED_CHAPTER:chapter};c.window=c;vm.createContext(c);for(const n of ['recall-bank.js','recall-assessment.js'])vm.runInContext(snapshot[n],c);for(const n of ['fixes','alignment','power-language'])vm.runInContext(read('questions/'+n+'.js'),c);c.UPPDRAG_RECALL_ASSESS.decorate(c.UPPDRAG_RECALL_BANK);return c;}
const c=context(5),A=c.UPPDRAG_RECALL_ASSESS,unchanged=JSON.stringify(c.UPPDRAG_RECALL_BANK.filter(t=>t.chapter!==5));
for(const n of ['questions/chapter5-material.js','questions/chapter5-review.js'])vm.runInContext(read(n),c);
vm.runInContext(snapshot['recall-flow.js'],c);
const core=c.UPPDRAG_RECALL_BANK.filter(t=>t.chapter===5&&!t.reviewOnly),review=c.UPPDRAG_RECALL_BANK.filter(t=>t.reviewOnly),E=c.UPPDRAG_RECALL_ENGINE;
const by=id=>E.byId.get(id),status=(id,d)=>A.assess(by(id),d,E.checkField).status;
assert.equal(core.length,15);assert.equal(review.length,51);assert.equal(new Set(c.UPPDRAG_RECALL_BANK.map(t=>t.id)).size,c.UPPDRAG_RECALL_BANK.length);
assert.equal(JSON.stringify(c.UPPDRAG_RECALL_BANK.filter(t=>t.chapter!==5&&!t.reviewOnly)),unchanged);
for(const t of core){assert.equal(A.assess(t,t.fields.map(f=>f.sample),E.checkField).status,'sufficient',t.id);assert.notEqual(A.assess(t,[],E.checkField).status,'sufficient',t.id);assert.notEqual(A.assess(t,t.fields.map(()=> 'Jag vet inte'),E.checkField).status,'sufficient',t.id);}
const ok=[
 ['rc5-coup-1',['Gustav den tredje','1772','Han tog hjälp av soldaterna och arresterade riksrådet.']],
 ['rc5-coup-2',['Militären hjälpte honom att gripa medlemmarna i riksrådet.','En ny grundlag gav kungen mer makt och riksdagen och riksrådet mindre inflytande.']],
 ['rc5-support-2',['Folk var less på bråken mellan partierna och hoppades på lugn.']],
 ['rc5-reforms-1',['upplysningen','Frankrike','Tortyren förbjöds. Dödsstraff fick bara användas för några brott.']],
 ['rc5-reforms-2',['I Frankrike ville tänkare ha frihet, mänskliga rättigheter och förnuft.','Idéerna påverkade svenska lagar. Tortyr förbjöds och dödsstraffet användes för färre brott.']],
 ['rc5-press-1',['mer begränsad','Censuren återinfördes inte.']],
 ['rc5-press-2',['Judar och katoliker fick flytta till Sverige.','Judar fick bara arbeta med vissa yrken.']],
 ['rc5-rights-1',['katoliker och judar','Judar fick bara gifta sig med andra judar.','Barnen skulle behandlas lika i kyrkboken.']],
 ['rc5-rights-2',['Judar och katoliker fick invandra. Svenska protestanter fick inte lämna kyrkan.','Familjen fick inte kasta ut den gravida kvinnan.','De kunde fortfarande behandlas illa trots reglerna.']]
];
for(const [id,d] of ok)assert.equal(status(id,d),'sufficient',id+' '+JSON.stringify(d));
const bad=[
 ['rc5-coup-2',['Han använde armén.','Alla fick rösträtt.']],
 ['rc5-support-2',['Kungen var snäll.']],
 ['rc5-support-2',['Folk var inte trötta på politikernas gräl.']],
 ['rc5-coup-1',['Gustav III','1772','Han använde armén men fängslade inte riksrådet.']],
 ['rc5-reforms-1',['upplysningen','Frankrike','Tortyr förbjöds och dödsstraffet avskaffades helt.']],
 ['rc5-reforms-2',['Förnuft och vetenskap.','Det blev förändring.']],
 ['rc5-press-1',['Det blev friare.','Censuren kom tillbaka.']],
 ['rc5-press-2',['Det blev bättre.','Alla blev helt fria.']],
 ['rc5-rights-1',['Judar och katoliker','Det fanns begränsningar.','De kallades mindre äkta.']],
 ['rc5-rights-2',['Alla hade samma rättigheter.','De fick skydd.','Alla svårigheter försvann.']]
];
for(const [id,d] of bad)assert.notEqual(status(id,d),'sufficient',id+' '+JSON.stringify(d));
const fields=JSON.stringify(core);A.decorate(c.UPPDRAG_RECALL_BANK);assert.equal(JSON.stringify(core),fields,'decorating restores all chapter-five fields without duplication');
for(const ch of [1,2,3,4,6]){const x=context(ch),before=JSON.stringify(x.UPPDRAG_RECALL_BANK);for(const n of ['questions/chapter5-material.js','questions/chapter5-review.js'])vm.runInContext(read(n),x);assert.equal(JSON.stringify(x.UPPDRAG_RECALL_BANK),before);}
import(require('url').pathToFileURL(path.join(root,'../../curriculum/classroom.mjs')).href).then(({default:cards,sources})=>{const canonical=cards.filter(q=>q.type==='short'&&q.storyChapter<=5);assert.equal(canonical.length,51);for(const q of canonical){const t=by('material5-'+q.id);assert(t,q.id);assert.equal(t.prompt,q.question);assert.equal(t.chapter,q.storyChapter);assert.equal(JSON.stringify(t.drill.answers),JSON.stringify(q.accept));for(const r of q.references)assert(t.source.includes(sources[r.source].title+' · '+r.location));}console.log('PASS chapter 5 material: 15 book-aligned tasks, 51 canonical review cards, all model answers, paraphrases, incomplete/false answers, idempotence, unaffected chapters');}).catch(e=>{console.error(e);process.exitCode=1;});
