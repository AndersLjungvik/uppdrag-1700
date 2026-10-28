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
const letterBytes=Buffer.concat([1,2,3].map(i=>fs.readFileSync(path.join(root,`chapter9-letter-pack-${i}.bin`))));
assert.equal(sha(letterBytes),'2f95dd26b2de95b1f10208b3293ca00fa7eefd10858257db9d6b59f134a0464e');
const letterPack=JSON.parse(zlib.gunzipSync(letterBytes));
async function get(n){n=n.split('?')[0];return letterPack.scripts[n]?? eight.scripts[n]??seven.scripts[n]??read(n);}

load(letterPack.scripts['chapter9-letter-build.js'],'chapter9-letter-build.js');
(async()=>{
 const base=await UPPDRAG_FINAL_BUILD.build(9,source,get);
 const old10=await UPPDRAG_FINAL_BUILD.build(10,source,get);
 const changed=await UPPDRAG_CH9_LETTER_BUILD.apply(base,get);
 let count=0;
 for(const [n,s] of Object.entries(changed)){if(n.endsWith('.js')){new Function(s);count++;}}
 const ctrl=changed['chapter9-pilot.js'],meet=changed['meeting-ch9-pilot.js'],world=changed['chapter9-world.js'];
 assert(ctrl.includes("storage='uppdrag1700.ch9-real-world.20261027.v1'"));
 assert(ctrl.includes('UPPDRAG_CH9_LETTER.finishPractice()'));
 assert(meet.includes('UPPDRAG_CH9_LETTER.talk(c.key)'));
 assert(meet.includes('[data-ch1-choice], [data-final-choice]'));
 assert(world.includes("F.delivered=true"));assert(world.includes("F.replySent=true"));
 assert(world.includes("s.complete=true"));assert(world.includes('Alla 24 uppgifter finns kvar.'));
 assert(!world.includes('s.record.push'));assert(!world.includes('s.earned['));
 assert(!world.includes('requestAnimationFrame'));assert(!world.includes('setInterval'));
 assert(world.includes('before-letter-1.7.0'));assert(world.includes('legacyComplete'));
 const old10Again=await UPPDRAG_FINAL_BUILD.build(10,source,get);
 assert.deepEqual(old10Again,old10,'chapter 10 sources must be byte-identical');
 for(const n of Object.keys(base))if(!['chapter9-pilot.js','meeting-ch9-pilot.js','chapter9-world.js','chapter9-content.js'].includes(n))assert.equal(changed[n],base[n],n);
 assert.equal(changed['chapter9-content.js'].slice(0,base['chapter9-content.js'].length),base['chapter9-content.js']);
 for(const n of ['chapter9-pilot.js','meeting-ch9-pilot.js','chapter9-world.js'])fs.writeFileSync(path.join(root,'_letter-'+n),changed[n]);
 console.log('PASS: '+count+' generated script parses; isolated chapter 9 story; original 24 tasks retained; chapter 10 byte-identical; no automatic recall credit.');
})().catch(e=>{console.error(e.stack);process.exit(1)});
