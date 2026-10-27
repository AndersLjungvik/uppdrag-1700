const fs=require('fs'),path=require('path'),zlib=require('zlib'),crypto=require('crypto'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');global.window=global;
const read=n=>fs.readFileSync(path.join(root,n),'utf8'),unzip=n=>JSON.parse(zlib.gunzipSync(n==='finale-pack.json.gz'?Buffer.concat([1,2,3,4,5].map(i=>fs.readFileSync(path.join(root,`finale-pack-${i}.bin`)))):fs.readFileSync(path.join(root,n))));
const delta=JSON.parse(zlib.gunzipSync(Buffer.concat([1,2,3,4].map(i=>fs.readFileSync(path.join(root,`delta-${i}.bin`)))))),q=unzip('questions/snapshot.json.gz'),seven=unzip('chapter7-sourcepack.json.gz'),eight=unzip('chapter8-sourcepack.json.gz'),final=unzip('finale-pack.json.gz');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function load(s,n){vm.runInThisContext(s,{filename:n});}
for(const n of ['gameplay-tuning.js','world-restoration.js','chapter6-build.js'])load(read(n),n);
for(const n of ['chapter7-tuning.js','chapter7-build.js'])load(seven.scripts[n],n);
load(eight.scripts['chapter8-build.js'],'chapter8-build.js');
global.UPPDRAG_FINAL_DATA=final.data;global.UPPDRAG_FINAL_SOURCES=final.scripts;load(final.scripts['finale-build.js'],'finale-build.js');
async function source(n){let s=delta.extra[n]??q.scripts[n]??seven.scripts[n]??eight.scripts[n];if(s===undefined){s=read('base/'+n);const p=delta.patches[n];if(p){assert.equal(sha(s),p.before);const chars=Array.from(s);for(const[a,b,v]of [...p.edits].reverse())chars.splice(a,b-a,...Array.from(v));s=chars.join('');assert.equal(sha(s),p.after);}}return UPPDRAG_GAMEPLAY_TUNING.source(n,s);}
async function get(n){n=n.split('?')[0];return eight.scripts[n]??seven.scripts[n]??read(n);}
(async()=>{
 let count=0;
 for(const ch of [9,10]){
  const files=await UPPDRAG_FINAL_BUILD.build(ch,source,get),html=files[`chapter${ch}-pilot.html`];
  const scripts=[...html.matchAll(/<script[^>]+src="([^\"]+)"/g)].map(m=>m[1].split('?')[0]);
  assert(html.includes(`chapter${ch}-world.js`));assert(!html.includes('chapter8-world.js'));
  for(const n of scripts){new Function(files[n]??await source(n));count++;}
  const ctrl=files[`chapter${ch}-pilot.js`],meet=files[`meeting-ch${ch}-pilot.js`];
  assert(ctrl.includes(`storage='uppdrag1700.ch${ch}-real-world.20261027.v1'`));
  assert(ctrl.includes('preceding.complete?preceding'));assert(ctrl.includes(`chapter:${ch}`));
  assert(meet.includes('playStory,tick'));assert(meet.includes('data-final-choice'));assert(!meet.includes('UPPDRAG_CH8_PILOT'));
  fs.writeFileSync(path.join(root,`_debug${ch}-pilot.js`),ctrl);fs.writeFileSync(path.join(root,`_debug${ch}-meeting.js`),meet);fs.writeFileSync(path.join(root,`_debug${ch}.html`),html);
 }
 for(const n of ['recall-bank.js','recall-assessment.js'])load(q.scripts[n],n);
 for(const n of ['questions/fixes.js','questions/alignment.js','chapter6-content.js'])load(read(n),n);
 load(seven.scripts['chapter7-content.js'],'ch7');load(read('chapter7-war-rule-fix.js'),'war-fix');load(eight.scripts['chapter8-content.js'],'ch8');
 const A=UPPDRAG_RECALL_ASSESS,short=(f,v)=>f?.answers?.some(a=>A.norm(a)===A.norm(v))?'correct':f?.options?.some(a=>A.norm(a)===A.norm(v))?'wrong':'review';
 A.decorate(UPPDRAG_RECALL_BANK);
 const older=UPPDRAG_RECALL_BANK.map(t=>[t,A.assess(t,t.fields.map(f=>f.sample),short)]);
 let answerCount=0;
 for(const ch of [9,10]){
  global.UPPDRAG_FINALE_DEF={...final.data[ch],chapter:ch};load(final.scripts['finale-content.js'],'content'+ch);
  const tasks=UPPDRAG_RECALL_BANK.filter(t=>t.chapter===ch),D=global['UPPDRAG_CH'+ch+'_CONTENT'];assert.equal(tasks.length,24);assert.equal(D.runs.length,13);
  assert(D.runs.slice(1).every(r=>r.f.length===2));assert.equal(D.delivery.p,'cafe');
  for(const t of tasks){const sample=t.fields.map(f=>f.sample),ret=A.assess(t,sample,short);assert.equal(ret.status,t.fields.some(f=>f.reflect)&&!(ch===10&&t.topic==='sources'&&t.rank===1)?'review':'sufficient',t.id);answerCount++;
   assert.equal(A.assess(t,sample.map(()=>''),short).status,'empty',t.id);answerCount++;
   assert.notEqual(A.assess(t,sample.map(()=>'jag vet inte'),short).status,'sufficient',t.id);answerCount++;
   if(t.rank===0){assert.equal(A.assess(t,[t.fields[0].options[1]],short).status,'contradiction');answerCount++;}
  }
  for(const scene of Object.values(final.data[ch].scenes)){assert.equal(scene.choices.length,2);assert(scene.choices.every(x=>x.reply&&x.label));}
 }
 for(const[t,r]of older){assert.deepEqual(A.assess(t,t.fields.map(f=>f.sample),short),r,'old '+t.id);answerCount++;}
 const types=UPPDRAG_RECALL_BANK.find(t=>t.id==='rc10-sources-1');assert.notEqual(A.assess(types,['brev','brev','brev'],short).status,'sufficient');
 const int=read('integration.js');assert(int.includes('ch<=10'));assert(int.includes('UPPDRAG_FINAL_LOADER.load()'));assert(int.includes('chapter9-pilot.html'));assert(int.includes('uppdrag1700.ch10-real-world.20261027.v1'));
 console.log('PASS:',count,'generated script parses;',answerCount,'answer/regression checks; 48 tasks; 24 visits; 24 two-branch conversations; no old scoring changes.');
})().catch(e=>{console.error(e.stack);process.exit(1)});
