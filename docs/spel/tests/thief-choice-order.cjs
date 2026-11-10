'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),zlib=require('zlib'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'event-engine.js'),'utf8');
const bank=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz')))).scripts['recall-bank.js'];
let seed=98321;const math=Object.create(Math);math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const c={Math:math,teacher:false,chapter:1,getPilot:()=>({})};c.window=c;vm.createContext(c);vm.runInContext(bank,c);
vm.runInContext(source.slice(source.indexOf('function candidates(){'),source.indexOf('const style=document.createElement')),c);
const before=JSON.stringify(c.UPPDRAG_RECALL_BANK);
for(const chapter of [1,2,3,4,5]){
 c.chapter=chapter;
 for(let encounter=0;encounter<12;encounter++){
  const positions=new Set();let first;
  for(let repeat=0;repeat<60;repeat++){
   const q=c.question(encounter);assert(q);first??=q;assert.equal(q.prompt,first.prompt,'shuffle does not change the selected question');assert.equal(q.answer,first.answer);
   assert.equal(q.choices.filter(x=>x===q.answer).length,1);assert.deepEqual(Array.from(q.choices).sort(),Array.from(first.choices).sort(),'all original choices retained');
   positions.add(q.choices.indexOf(q.answer));
  }
  assert(positions.size>=3,'the same question can have its correct answer in any of the three or more slots');
 }
 console.log('PASS thief chapter '+chapter+': correct position varies independently of encounter, all choices and answer key preserved');
}
assert.equal(JSON.stringify(c.UPPDRAG_RECALL_BANK),before,'the shared question bank is unchanged');
