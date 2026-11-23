const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const snap=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz'))));
const pack=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'chapter7-sourcepack.json.gz'))));
const patch=read('chapter7-manus-fix.js'),targetId='rc7-resistance-2';
function context(chapter=7){
 const c={__INTEGRATED_CHAPTER:chapter};c.window=c;vm.createContext(c);
 const run=(name,source=read(name))=>vm.runInContext(source,c,{filename:name});
 for(const name of ['recall-bank.js','recall-assessment.js'])run(name,snap.scripts[name]);
 for(const name of ['questions/fixes.js','questions/alignment.js','questions/power-language.js','chapter6-content.js'])run(name);
 run('chapter7-content.js',pack.scripts['chapter7-content.js']);
 run('chapter7-war-rule-fix.js');
 return {c,run};
}
const {c,run}=context(),bank=c.UPPDRAG_RECALL_BANK,chapter=bank.filter(t=>t.chapter===7),A=c.UPPDRAG_RECALL_ASSESS;
assert.equal(chapter.length,36);
const before=JSON.parse(JSON.stringify(bank));
const check=(f,v)=>f.answers?.some(a=>A.norm(a)===A.norm(v))?'correct':'review';
const outcomes=chapter.map(t=>A.assess(t,t.fields.map(f=>f.sample),check).status);
assert(outcomes.every(s=>s==='sufficient'),'all original chapter-seven model answers must be accepted');
run('chapter7-manus-fix.js',patch);
const target=bank.find(t=>t.id===targetId),old=before.find(t=>t.id===targetId);
assert.equal(target.prompt,'Vad försökte Marie Anne och Cecile göra, och varför räknade mannen med att de inte skulle våga klaga?');
assert.equal(target.fields[1].label,'Mannens förväntan');
assert.equal(target.fields[1].criterion,'Mannens förväntan');
// Only the question and the second field's two presentation labels may change.
const expected=JSON.parse(JSON.stringify(before));
const expectedTarget=expected.find(t=>t.id===targetId);
expectedTarget.prompt=target.prompt;expectedTarget.fields[1].label=target.fields[1].label;expectedTarget.fields[1].criterion=target.fields[1].criterion;
assert.equal(JSON.stringify(bank),JSON.stringify(expected),'all other bank data must remain unchanged');
assert.equal(target.model,old.model);assert.equal(target.fields[1].sample,old.fields[1].sample);assert.equal(target.fields[1].rule,old.fields[1].rule);
assert.deepEqual(chapter.map(t=>A.assess(t,t.fields.map(f=>f.sample),check).status),outcomes,'all36 example judgements are unchanged');
assert.notEqual(A.assess(target,['Jag vet inte','Jag vet inte'],check).status,'sufficient');
const once=JSON.stringify(bank);run('chapter7-manus-fix.js',patch);assert.equal(JSON.stringify(bank),once,'idempotent');
run('recall-flow.js',snap.scripts['recall-flow.js']);
assert.equal(c.UPPDRAG_RECALL_ENGINE.byId.get(targetId).prompt,target.prompt,'active recall engine retains the corrected question after decoration');
assert.equal(c.UPPDRAG_RECALL_ENGINE.byId.get(targetId).fields[1].criterion,'Mannens förväntan');
for(const task of chapter)assert.equal(A.assess(task,task.fields.map(f=>f.sample),check).status,'sufficient',task.id+' after flow decoration');
for(const other of [1,5,6,8,9,10]){
 const h=context(other),prior=JSON.stringify(h.c.UPPDRAG_RECALL_BANK);
 h.run('chapter7-manus-fix.js',patch);assert.equal(JSON.stringify(h.c.UPPDRAG_RECALL_BANK),prior,'chapter scope '+other);
 assert.equal(h.c.UPPDRAG_CH7_MANUS_FIX,undefined);
}
assert.match(read('integration.js'),/if\(name==='chapter7-content\.js'\)code\+='\\n'\+await get\('chapter7-war-rule-fix\.js\?v=1\.3\.1'\)\+'\\n'\+await get\('chapter7-manus-fix\.js\?v=1\.0\.0'\)/,'active integration must load the manuscript patch after the question data and war fix');
console.log('PASS chapter 7 manuscript: aligned question and field, unchanged bank except three display strings, all 36 model answers, non-answer, idempotence, flow decoration and six other chapter scopes');
