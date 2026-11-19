'use strict';
const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const scripts=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz')))).scripts;
const c={};c.window=c;vm.createContext(c);
for(const n of ['recall-bank.js','recall-assessment.js'])vm.runInContext(scripts[n],c);
for(const n of ['questions/fixes.js','questions/alignment.js','questions/power-language.js','mastery-recall-adapter.js'])vm.runInContext(read(n),c);
vm.runInContext(c.UPPDRAG_PROMPT_ALIGNMENT.flow(c.UPPDRAG_MASTERY_RECALL.source(scripts['recall-flow.js'])),c);
const A=c.UPPDRAG_RECALL_ASSESS,E=c.UPPDRAG_RECALL_ENGINE,L=c.UPPDRAG_PROMPT_ALIGNMENT;
const check=(id,answer)=>A.assess(E.byId.get(id),answer,E.checkField);
for(const id of ['rc1-power-1','rc1-power-2']){
 for(const answer of [
  'Kugnen bestämmde mindre och rikstagen mer.',
  'Drotningen fick mindre mackt och riksdgaen fick mer innflytande.',
  'Enväldett tog slut och rikstagen fick mer makt.',
  'Kungens rätt att styra ensam försvann. I stället var det riksdagen som bestämde det mesta.'
 ]){
  const drafts=[answer],before=copy(drafts);assert.equal(check(id,drafts).status,'sufficient',id+': '+answer);assert.deepEqual(drafts,before,'assessment leaves the written answer untouched');
 }
 for(const answer of [
  'Kungen fick mer mackt och rikstagen mindre.',
  'Kungen fick inte mindre makt och rikstagen fick mer makt.',
  'Enväldett tog inte slut. Riksdagen fick mer makt.',
  'Kugnen och rikstagen.',
  'Kugnen fick mindre makt.',
  'Rikstagen fick mer makt.'
 ])assert.notEqual(check(id,[answer]).status,'sufficient',id+': '+answer);
}
for(const answer of [
 ['De handlade med Kina.','De tog med sig te.'],
 ['Ostindiska kompaniet handlade med Kina.','Kompaniet importerade porselin.'],
 ['Skeppen seglade till Kina.','De förde hem sidenn.'],
 ['De åkte till Kina.','De tog hem te och porslinn.'],
 ['Kina','poslin']
])assert.equal(check('rc1-trade-1',answer).status,'sufficient',JSON.stringify(answer));
for(const answer of [
 ['De handlade inte med Kina.','De tog hem te.'],
 ['De handlade med Kina och Ryssland.','De tog hem te.'],
 ['De handlade med Kina.','De tog hem te och vapen.'],
 ['Kinna','te'],['Kina','De tog inte hem porselin.'],['Kina','De tog hem te men inte siden.']
])assert.notEqual(check('rc1-trade-1',answer).status,'sufficient',JSON.stringify(answer));
for(const text of ['mer mindre inte ingen 1743 1734','Karl Carl Adolf Fredrik Fredrika','riksdagen riksrådet','Kina Kinna te det'])assert.equal(L.spelling(text),text,'meaning, dates, short names and ambiguous town names are never corrected');
console.log('PASS affirmative fact sentences, familiar spelling errors in explanations and facts, negation, reversed power, missing requirements and retained original text');

const {fixture}=require('./mastery-apple-retry.cjs');
for(const ch of [1,2,3,4,5]){
 let h=fixture(ch);const areas=h.m.snapshot().config.areas;
 for(const level of ['learner','journeyman','master'])for(const a of areas){assert(h.m.begin(a.id,level).ok);h.m.pass(a.id,level);}
 h.p.state.record.push({id:'existing-answer',answer:['Elevens tidigare svar'],ok:true});h.p.persist();
 const before=copy({areas:h.m.snapshot().state.areas,record:h.p.state.record,daler:h.p.state.daler,apples:h.p.state.apples});
 const task=h.c.UPPDRAG_RECALL_BANK.find(t=>t.chapter===ch&&t.rank===1);
 h.c.UPPDRAG_RECALL_ASSESS.assess(task,task.fields.map(f=>f.sample),h.p.recall.checkField||E.checkField);
 h=fixture(ch,h.memory);
 assert.deepEqual(copy({areas:h.m.snapshot().state.areas,record:h.p.state.record,daler:h.p.state.daler,apples:h.p.state.apples}),before,'chapter '+ch+' retains all saved stamps, answers and resources after a fresh boot');
}
console.log('PASS chapters 1–5: existing stamp cells, original written answers, money and apples survive a fresh boot');
