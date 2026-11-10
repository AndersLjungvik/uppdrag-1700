'use strict';
const assert=require('node:assert/strict'),{fixture}=require('./mastery-apple-retry.cjs');
const copy=x=>JSON.parse(JSON.stringify(x));
for(let ch=1;ch<=5;ch++){
 const h=fixture(ch),E=h.c.UPPDRAG_RECALL_ENGINE,A=h.c.UPPDRAG_RECALL_ASSESS,L=h.c.UPPDRAG_PROMPT_ALIGNMENT;
 for(const t of E.byId.values()){
  if(t.chapter!==ch||t.rank!==0||!t.fields.some(f=>f.options))continue;
  const before=copy(t),o=L.openTask(t);
  assert.equal(o.id,t.id);assert(!o.fields.some(f=>f.options));
  assert(!/vilken kombination|välj vilken|utan (?:svars)?alternativ/i.test(o.prompt),o.id);
  assert.equal(A.assess(o,o.fields.map(f=>f.sample),E.checkField).status,'sufficient',o.id);
  for(let i=0;i<o.fields.length;i++){
   const incomplete=o.fields.map(f=>f.sample);incomplete[i]='';
   assert.notEqual(A.assess(o,incomplete,E.checkField).status,'sufficient',o.id+' missing field '+i);
  }
  assert.deepEqual(copy(t),before,'open presentation cannot alter saved task data or multiple-choice fields');
 }
}
const h=fixture(1),E=h.c.UPPDRAG_RECALL_ENGINE,A=h.c.UPPDRAG_RECALL_ASSESS;
const law=h.c.UPPDRAG_PROMPT_ALIGNMENT.openTask(E.byId.get('rc1-law-0'));
for(const answer of [['hur landet styrs och makten fördelas','alla i riksdagen'],['hur makten skulle delas','en enig riksdag']])assert.equal(A.assess(law,answer,E.checkField).status,'sufficient');
for(const answer of [['hur makten delas','kungen'],['jag vet inte','hela riksdagen']])assert.notEqual(A.assess(law,answer,E.checkField).status,'sufficient');
console.log('PASS open questions: self-contained prompts, complete facts, book additions, matching rubrics, own words and stable originals');
