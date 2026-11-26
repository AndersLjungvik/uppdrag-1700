'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../chapter3-scenes.js'),'utf8'),c={};c.window=c;vm.createContext(c);
const section=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)));
vm.runInContext(section('function shuffledPatrolOptions(','function patrolReplies(')+';window.shuffle=shuffledPatrolOptions;window.encounter=maybePatrol;',c);
// Enumerate every equally probable Fisher–Yates draw, rather than relying
// on a flaky random sample: the correct answer occupies each position equally.
for(const size of [3,4]){
 const original=Array.from({length:size},(_,i)=>i?'Wrong '+i:'Correct'),counts=Array(size).fill(0),permutations=new Set();
 function enumerate(draws,i){
  if(!i){let cursor=0;const order=Array.from(c.shuffle(original,()=>draws[cursor++]));assert.deepEqual([...order].sort(),[...original].sort());counts[order.indexOf('Correct')]++;permutations.add(order.join('|'));return;}
  for(let j=0;j<=i;j++)enumerate([...draws,(j+.25)/(i+1)],i-1);
 }enumerate([],size-1);
 assert.equal(permutations.size,size===3?6:24);assert(counts.every(n=>n===counts[0]));assert.deepEqual(original,Array.from({length:size},(_,i)=>i?'Wrong '+i:'Correct'),'the question bank stays in its original order');
}
const task={id:'known',rank:0,prompt:'Vilket alternativ är rätt?',fields:[{options:['Rätt svar','Fel ett','Fel två'],answers:['Rätt svar']}]},original=JSON.stringify(task),actor={id:'soldiers',x:10,y:10};let seed=73,opened=0,saves=0;
c.Math=Object.create(Math);c.Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};c.pilot={repetitionTaskIds:['known']};c.UPPDRAG_RECALL_BANK=[{...task,id:'not-known'},task];c.region={id:'main'};c.player={x:0,y:0};c.timeline={distance:1000};c.path=[];c.saveStory=()=>saves++;c.UPPDRAG_WORLD_KEYBOARD={clear(){}};c.UPPDRAG_CH3_CITY_LIFE={find:()=>actor,open(a,lines){opened++;assert.equal(lines[1][1],task.prompt);return true;}};
const positions=new Set();for(let i=0;i<60;i++){
 assert(c.encounter());assert.equal(c.challenge.t.id,'known');positions.add(c.challenge.options.indexOf(c.challenge.answer));const current=JSON.stringify(c.challenge.options);assert.equal(JSON.stringify(c.challenge.t),original);assert.equal(JSON.stringify(c.challenge.options),current);
}
assert.equal(positions.size,3);assert.equal(opened,60);assert.equal(saves,60);
// Reuse the real answer handler against shuffled positions; grading follows
// the answer text, including when the correct option is last.
vm.runInContext(section('function answerPatrol(index){','function readPatrol(){')+';window.answer=answerPatrol;',c);
for(const order of [['Rätt svar','Fel ett','Fel två'],['Fel ett','Rätt svar','Fel två'],['Fel ett','Fel två','Rätt svar']])for(const chosen of [0,1,2,3]){
 c.pilot={state:{daler:5},persist(){},refresh(){}};c.challenge={actor,t:task,options:order,answer:'Rätt svar'};let feedback;
 c.UPPDRAG_CH3_CITY_LIFE={close(){c.challenge=null;},open(a,lines){feedback=lines[0][1];}};c.answer(chosen);
 assert.equal(c.pilot.state.daler,chosen===3||order[chosen]==='Rätt svar'?5:3);
 assert.match(feedback,chosen===3?/Gå vidare, då/:order[chosen]==='Rätt svar'?/Det stämmer/:/Jag har fått den här uppgiften: Rätt svar/);
}
console.log('PASS patrol answer order: all 6/24 permutations, every answer position equally likely, real repeated known-question encounters, untouched bank and text-based correct/wrong/skip grading');
