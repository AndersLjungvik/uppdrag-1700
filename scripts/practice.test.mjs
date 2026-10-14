import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const context = vm.createContext({window:{},Date,Set,Object,Math});
vm.runInContext(fs.readFileSync(new URL('../dist/practice.js',import.meta.url),'utf8'),context);
const p=context.window.UPPDRAG_PRACTICE, DAY=86400000;
test('first visit retained and previous visit updated',()=>{
  let v=p.visit({},100);v=p.visit(v,100+3*DAY);
  assert.equal(v.firstVisitAt,100);assert.equal(v.previousVisitAt,100);assert.equal(v.lastVisitAt,100+3*DAY);
});
test('same evening cannot advance spacing level',()=>{
  let v=p.review(null,true,false,100);assert.equal(v.level,1);const due=v.nextDueAt;
  for(let i=1;i<=10;i++)v=p.review(v,true,false,100+i*1000);
  assert.equal(v.level,1);assert.equal(v.nextDueAt,due);
});
test('success after real delay lengthens the interval',()=>{
  let v=p.review(null,true,false,100);v=p.review(v,true,false,100+DAY);
  assert.equal(v.level,2);assert.equal(v.nextDueAt,100+4*DAY);
});
test('error shortens interval and supported answer does not promote it',()=>{
  let v=p.review({level:4,lastReviewedAt:100},false,false,3*DAY);
  assert.equal(v.level,0);assert.equal(v.nextDueAt,4*DAY);
  v=p.review(v,true,true,5*DAY);assert.equal(v.level,0);
});
test('due selection excludes topics not studied',()=>{
  assert.deepEqual(Array.from(p.due({known:{nextDueAt:100},future:{nextDueAt:50}},['known'],200)),['known']);
});
