/* Chapter 8 content regression; includes old published question bank. */
const fs=require('fs'),path=require('path'),vm=require('vm'),zlib=require('zlib'),assert=require('assert');
const root=path.resolve(__dirname,'..');global.window=global;
function run(n,c){vm.runInThisContext(c,{filename:n});}
const q=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz'))));
for(const n of ['recall-bank.js','recall-assessment.js'])run(n,q.scripts[n]);
for(const n of ['questions/fixes.js','questions/alignment.js','chapter6-content.js'])run(n,fs.readFileSync(path.join(root,n),'utf8'));
const seven=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'chapter7-sourcepack.json.gz'))));
run('chapter7-content.js',seven.scripts['chapter7-content.js']);
run('chapter7-war-rule-fix.js',fs.readFileSync(path.join(root,'chapter7-war-rule-fix.js'),'utf8'));
const A=UPPDRAG_RECALL_ASSESS,old=A.assess,short=(f,v)=>f?.answers?.some(x=>A.norm(x)===A.norm(v))?'correct':f?.options?.some(x=>A.norm(x)===A.norm(v))?'wrong':'review';
const oldBank=UPPDRAG_RECALL_BANK.filter(t=>t.chapter>=6),samples=oldBank.map(t=>({t,ans:t.fields.map(f=>f.sample),status:old(t,t.fields.map(f=>f.sample),short).status}));
run('chapter8-content.js',fs.readFileSync(path.join(root,'chapter8-content.js'),'utf8'));
const bank=UPPDRAG_RECALL_BANK.filter(t=>t.chapter===8),content=UPPDRAG_CH8_CONTENT;
assert.equal(bank.length,18);assert.equal(content.runs.length,10);
for(let rank=0;rank<3;rank++)assert.equal(bank.filter(x=>x.rank===rank).length,6);
for(const r of content.runs.slice(1)){
 assert.equal(r.f.length,2,'Each visit must have 2 questions');
 assert(r.f.every(id=>bank.some(t=>t.id===id&&t.place===r.p&&t.rank===r.r)));
}
let checks=0;
for(const t of bank){
 const example=t.fields.map(f=>f.sample);
 const accepted=A.assess(t,example,short);
 assert.equal(accepted.status,'sufficient',t.id+': '+JSON.stringify(accepted));checks++;
 assert.equal(A.assess(t,example.map(()=>''),short).status,'empty',t.id);checks++;
 assert.notEqual(A.assess(t,example.map(()=>'jag vet inte'),short).status,'sufficient',t.id);checks++;
}
for(const {t,ans,status} of samples){assert.equal(A.assess(t,ans,short).status,status,'Regression in '+t.id);checks++;}
for(const [id,answer] of [
 ['rc8-death-2',['16 mars 1792','29 mars 1792']],
 ['rc8-mask-1',['Kanske gömde de sig bakom masker för att inte kännas igen']],
 ['rc8-motive-1',['Adeln hade förlorat inflytande till kungen']],
 ['rc8-warning-2',['Kungen fick ett varningsbrev före balen']],
 ['rc8-justice-2',['Anckarström avrättades','Två andra fick landsförvisning']]
 ]){
 const t=bank.find(x=>x.id===id);assert(t);assert.equal(A.assess(t,answer,short).status,'sufficient',id);checks++;
}
for(const [id,answer] of [
 ['rc8-shot-2',['Kungen sköts och dog samma kväll vid Operan']],
 ['rc8-mask-2',['Vi vet exakt att alla bar masker och därför kunde ingen se dem']],
 ['rc8-motive-1',['Adeln var inte missnöjd med kungen']],
 ['rc8-justice-2',['Anckarström friades','Två andra fick stanna kvar']]
 ]){
 const t=bank.find(x=>x.id===id);assert.notEqual(A.assess(t,answer,short).status,'sufficient',id);checks++;
}
assert(content.runs[0].p==='cafe');assert(content.delivery.p==='cafe');
assert.equal(content.chapterSevenKey,'uppdrag1700.ch7-real-world.20261026.v1');
const tune={window:{}};
for(const name of ['gameplay-tuning.js','world-restoration.js'])run(name,fs.readFileSync(path.join(root,name),'utf8'));
console.log('PASS',checks,'cases',bank.length,'chapter 8 tasks',content.runs.length-1,'visits, all older sample assessments preserved');
