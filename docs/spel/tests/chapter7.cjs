/* Uppdrag 1700 · chapter 7 regression. Run after python docs/spel/decode_sources.py.
 * Content checks are not a guarantee for every possible student phrasing. */
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');global.window=global;
const exec=file=>vm.runInThisContext(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
for(const f of ['_decoded/recall-bank.js','_decoded/recall-assessment.js','questions/fixes.js','questions/alignment.js','chapter6-content.js'])exec(f);
const A=UPPDRAG_RECALL_ASSESS,original=A.assess;
const before=UPPDRAG_RECALL_BANK.filter(t=>t.chapter===6).map(t=>({t,d:t.fields.map(f=>f.sample)}));
const originalResults=before.map(x=>original(x.t,x.d,(f,v)=>f?.answers?.some(a=>A.norm(a)===A.norm(v))?'correct':'review').status);
exec('chapter7-content.js');
const tasks=UPPDRAG_RECALL_BANK.filter(t=>t.chapter===7),C=UPPDRAG_CH7_CONTENT;
assert.equal(tasks.length,36);assert.equal(C.runs.length,13);
assert.deepEqual([0,1,2].map(rank=>tasks.filter(t=>t.rank===rank).length),[12,12,12]);
const check=(f,v)=>f.answers?.some(a=>A.norm(a)===A.norm(v))?'correct':f.options?.some(x=>A.norm(x)===A.norm(v))?'wrong':'review';
let checks=0;
for(const task of tasks){
 const samples=task.fields.map(f=>f.sample);
 const result=A.assess(task,samples,check);
 assert.equal(result.status,'sufficient',task.id+' '+JSON.stringify(result));checks++;
 const blank=A.assess(task,task.fields.map(()=>''),check);
 assert.equal(blank.status,'empty',task.id+' empty');checks++;
 const noise=A.assess(task,task.fields.map(()=>'Jag är faktiskt osäker på det'),check);
 assert.notEqual(noise.status,'sufficient',task.id+' noise');checks++;
}
for(const [i,x] of before.entries()){
 assert.equal(A.assess(x.t,x.d,check).status,originalResults[i],'old chapter changed: '+x.t.id);checks++;
}
const negative=[
 ['rc7-taxes-1',['Skatterna var inte låga.']],
 ['rc7-company-2',['Ostindiska kompaniet tjänade pengar på förslavade människor.']],
 ['rc7-resistance-1',['De kämpade inte för sina rättigheter.']],
 ['rc7-warStart-1',['Kungen kunde starta anfallskrig utan att fråga riksdagen.']],
 ['rc7-warOutcome-2',['Sverige fick tillbaka alla förlorade områden.','Gustav fick mindre makt.']],
 ['rc7-oppression-1',['De arbetade frivilligt och kunde välja själva.','De behandlades bra.']],
 ['rc7-triangle-1',['Fria handelsmän','socker']]
];
for(const [id,drafts] of negative){const t=tasks.find(x=>x.id===id);assert(t);const r=A.assess(t,drafts,check);assert.notEqual(r.status,'sufficient',id+' false pass');checks++;}
for(const run of C.runs.slice(1)){
 assert(run.f.length===3,'Too many questions per visit '+run.p+'/'+run.r);
 assert(run.f.every(id=>tasks.some(t=>t.id===id&&t.place===run.p&&t.rank===run.r)),'Place mismatch '+run.p);
 checks++;
}
assert(C.runs.some(x=>x.p==='marstrandQuay'));
assert(C.runs.some(x=>x.p==='colonyQuay'));
assert(C.runs.some(x=>x.p==='gustavia'));
const store=fs.readFileSync(path.join(root,'integration.js'),'utf8');
assert(store.includes("'uppdrag1700.ch7-real-world.20261026.v1'"));
assert(/ch<=([789]|10)/.test(store),'chapters 7 and later remain available');
const tuningCtx={window:{}};
for(const f of ['gameplay-tuning.js','world-restoration.js','chapter7-tuning.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),tuningCtx,{filename:f});
const flow=tuningCtx.window.UPPDRAG_GAMEPLAY_TUNING.source('recall-flow.js',fs.readFileSync(path.join(root,'_decoded/recall-flow.js'),'utf8'));
assert(flow.includes('t.chapter>=6'));
assert(flow.includes("'Spara svaret och gå vidare'"));
new Function(flow);
assert.equal(UPPDRAG_CH7_CONTENT.chapterSixKey,'uppdrag1700.ch6-real-world.20261023.v1');
console.log('PASS chapter 7:',checks,'question, safety, source, migration and regression checks; 36 questions in 12 visits');
