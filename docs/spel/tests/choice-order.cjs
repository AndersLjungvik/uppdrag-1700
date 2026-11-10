'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict'),{fixture}=require('./mastery-apple-retry.cjs');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const h=fixture(5),flow=h.c.UPPDRAG_GAMEPLAY_TUNING.source('recall-flow.js',read('_decoded/recall-flow.js')),c={};c.window=c;vm.createContext(c);
vm.runInContext(flow.slice(flow.indexOf('function shuffled(xs)'),flow.indexOf('function prepare('))+';window.order=optionOrder;',c);
let seed=9811;c.Math=Object.create(Math);c.Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const bank=h.c.UPPDRAG_RECALL_BANK,original=JSON.stringify(bank),chapters=new Set();let fields=0;
for(const t of bank)for(const f of t.fields||[]){
 if(!f.options?.length)continue;fields++;chapters.add(t.chapter);const seen=new Set();
 for(let repeat=0;repeat<50;repeat++){
  const ui={key:'the-same-question-and-attempt-key',drafts:['']},order=Array.from(c.order(f.options,ui,0)),saved=copy(ui);
  assert.deepEqual([...order].sort(),Array.from(f.options).sort());seen.add(order.join('|'));
  for(let paint=0;paint<5;paint++)assert.deepEqual(Array.from(c.order(f.options,ui,0)),order,'a repaint cannot reshuffle the question');
  assert.deepEqual(Array.from(c.order(f.options,saved,0)),order,'the saved order survives a reload');
 }assert(seen.size>1,'a fresh question UI is not bound to its stable key: '+t.id);
}
assert.equal(JSON.stringify(bank),original);
const decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const choices=html=>[...html.matchAll(/data-field-index="(\d+)" data-value="([^"]*)"/g)].map(m=>[Number(m[1]),decode(m[2])]);
for(const ch of [1,2,3,4,5]){
 let f=fixture(ch),p=f.p,area,index;
 for(const a of f.m.snapshot().config.areas){const run=p.scenes[a.slot];index=run.f.findIndex(id=>{const t=f.c.UPPDRAG_RECALL_ENGINE.byId.get(id);return t.kind!=='tf'&&t.fields.some(field=>field.options?.length);});if(index>=0){area=a;break;}}
 assert(area,'a real choice task exists in chapter '+ch);f.room(area.p);p.selectArea(area.id,'learner');p.enterMemory();p.state.index=index;p.state.recallUI=null;p.recall.render();
 const task=p.recall.current,key=p.recall.ui.key,initial=choices(f.modal.innerHTML),orders=copy(p.recall.ui.optionOrders),selected=initial[0];
 p.recall.action('rc-option',{preventDefault(){},target:{closest:()=>({dataset:{fieldIndex:String(selected[0]),value:selected[1]}})}});
 assert.equal(p.recall.ui.drafts[selected[0]],selected[1]);for(let i=0;i<5;i++){p.recall.render();assert.deepEqual(choices(f.modal.innerHTML),initial);}
 let spoken;f.c['UPPDRAG_CH'+ch+'_READING']={canSpeak:true,say:text=>spoken=text};p.recall.action('rc-listen');
 for(const [field,values]of Object.entries(orders))if(Array.isArray(values)){let last=-1;for(const text of values){const at=spoken.indexOf(text,last+1);assert(at>last,'speech follows visible option order');last=at;}}
 const before=copy({record:p.state.record,earned:p.state.earned,review:p.state.reviewQueue,apples:p.state.apples,daler:p.state.daler}),drafts=copy(p.recall.ui.drafts);p.persist();f=fixture(ch,f.memory);p=f.p;f.room(area.p);p.enterMemory();p.recall.render();
 assert.equal(p.recall.current.id,task.id);assert.equal(p.recall.ui.key,key);assert.deepEqual(copy(p.recall.ui.optionOrders),orders);assert.deepEqual(copy(p.recall.ui.drafts),drafts);assert.deepEqual(choices(f.modal.innerHTML),initial);assert.deepEqual(copy({record:p.state.record,earned:p.state.earned,review:p.state.reviewQueue,apples:p.state.apples,daler:p.state.daler}),before);
 let trialSeed=ch*3271;f.c.Math=Object.create(Math);f.c.Math.random=()=>{trialSeed=(Math.imul(trialSeed,1664525)+1013904223)>>>0;return trialSeed/4294967296;};
 const permutations=new Set();for(let round=0;round<20;round++){p.state.recallUI=null;p.recall.render();assert.equal(p.recall.ui.key,key);permutations.add(JSON.stringify(p.recall.ui.optionOrders));}assert(permutations.size>1,'even the same attempt key no longer dictates the answer position');
 const correct=[];p.recall.current.fields.forEach((field,i)=>{const value=field.options?.find(text=>field.answers.some(answer=>f.c.UPPDRAG_RECALL_ENGINE.equivalent(text,answer)))||field.sample;correct.push(value);if(field.options)p.recall.action('rc-option',{preventDefault(){},target:{closest:()=>({dataset:{fieldIndex:String(i),value}})}});else p.recall.input({target:{dataset:{rcField:String(i)},value}});});p.recall.action('rc-submit');assert.equal(p.recall.ui.result.status,'right');assert.deepEqual(copy(p.state.record.at(-1).answer),correct,'grading and saved answers follow the content after randomization');
 console.log('PASS chapter '+ch+': fresh option orders, stable selection/repaint/speech/reload, saved text and unchanged answers, stamps and currency');
}
// The real true/false renderer also keeps its statement and button order in
// the saved question UI; grading uses action names and the selected statement.
const tfSource=flow.slice(flow.indexOf(' function variant(t){'),flow.indexOf(' const btn=',flow.indexOf(' function variant(t){')));let currentUI={},attempt=1;c.ui=()=>currentUI;c.state=()=>({recallAttempt:attempt});vm.runInContext(tfSource+';window.variantFor=variant;',c);
const t={variants:[{text:'Sant påstående',truth:true},{text:'Falskt påstående',truth:false}]},variants=new Set();
for(let i=0;i<40;i++){currentUI={tf:null};const first=c.variantFor(t),buttons=Array.from(c.order(['tf-true','tf-false'],currentUI,'truth-buttons'));variants.add(first.text);for(let j=0;j<5;j++){assert.equal(c.variantFor(t),first);assert.deepEqual(Array.from(c.order(['tf-true','tf-false'],currentUI,'truth-buttons')),buttons);}currentUI=copy(currentUI);assert.equal(c.variantFor(t).text,first.text);}
assert.equal(variants.size,2);currentUI={tf:true};attempt=1;assert.equal(c.variantFor(t),t.variants[1],'an already answered legacy statement retains the original variant');
assert(read('index.html').includes('gameplay-tuning.js?v=1.3.0'));
console.log('PASS shared choice bank: '+fields+' fields across chapters '+[...chapters].sort((a,b)=>a-b).join(', ')+', no deterministic key reuse, true/false persistence and legacy answers preserved');
