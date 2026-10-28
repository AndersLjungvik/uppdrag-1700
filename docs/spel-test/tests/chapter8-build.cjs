/* End-to-end source generator, version/asset manifest and JavaScript syntax. */
const fs=require('fs'),path=require('path'),zlib=require('zlib'),crypto=require('crypto'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');global.window=global;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const packed=Buffer.concat([1,2,3,4].map(i=>fs.readFileSync(path.join(root,`delta-${i}.bin`))));
const delta=JSON.parse(zlib.gunzipSync(packed));
const questions=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'questions/snapshot.json.gz'))));
const seven=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'chapter7-sourcepack.json.gz'))));
const eight=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'chapter8-sourcepack.json.gz'))));
function load(s,n){vm.runInThisContext(s,{filename:n});}
for(const n of ['gameplay-tuning.js','world-restoration.js'])load(read(n),n);
load(seven.scripts['chapter7-tuning.js'],'chapter7-tuning.js');
load(read('chapter6-build.js'),'chapter6-build.js');
load(seven.scripts['chapter7-build.js'],'chapter7-build.js');
load(eight.scripts['chapter8-build.js'],'chapter8-build.js');
async function raw(name){
 let code;
 if(delta.extra[name]!==undefined)code=delta.extra[name];
 else if(questions.scripts[name]!==undefined)code=questions.scripts[name];
 else if(seven.scripts[name]!==undefined)code=seven.scripts[name];
 else if(eight.scripts[name]!==undefined)code=eight.scripts[name];
 else {code=read('base/'+name);const patch=delta.patches[name];
  if(patch){assert.equal(sha(code),patch.before,name+' before');const cps=Array.from(code);for(const [a,b,v]of [...patch.edits].reverse())cps.splice(a,b-a,...Array.from(v));code=cps.join('');assert.equal(sha(code),patch.after,name+' after');}
 }
 return UPPDRAG_GAMEPLAY_TUNING.source(name,code);
}
async function get(name){const n=name.split('?')[0];if(eight.scripts[n]!==undefined)return eight.scripts[n];if(seven.scripts[n]!==undefined)return seven.scripts[n];return read(n);}
(async()=>{
 const files=await UPPDRAG_CH8_BUILD.build(raw,get);
 const html=files['chapter8-pilot.html'];assert(html.includes('chapter8-world.js'));assert(html.includes('chapter8-content.js'));
 assert(!html.includes('chapter7-world.js'));assert(html.includes('chapter8-pilot.js'));
 assert(!html.includes('chapter6-street-events.js'));
 const scriptNames=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1].split('?')[0]);
 for(const n of scriptNames){const code=files[n]??await raw(n);new Function(code);}
 for(const n of ['chapter8-pilot.js','meeting-ch8-pilot.js','chapter8-street-life.js','chapter8-world.js','chapter8-content.js']){assert(files[n],n);new Function(files[n]);}
 for(const n of ['chapter8-pilot.js','meeting-ch8-pilot.js','chapter8-street-life.js','chapter8-pilot.html'])fs.writeFileSync(path.join(root,'_debug_'+n),files[n]);
 const pilot=files['chapter8-pilot.js'],meeting=files['meeting-ch8-pilot.js'];
 assert(pilot.includes('UPPDRAG_CH8_PILOT'));assert(pilot.includes('UPPDRAG_CH8_CONTENT'));
 assert(pilot.includes('chapterSevenKey'));assert(pilot.includes('chapter:8'));
 assert(pilot.includes("opera:'Operan'"));
 assert(meeting.includes('CAST.opera='));assert(meeting.includes("window.UPPDRAG_CH8_STORY?.dialogue"));
 assert(!meeting.includes('UPPDRAG_CH7_PILOT'));
 const intr=read('integration.js');assert(intr.includes('ch<=8'));assert(intr.includes('chapter8-pilot.html'));
 const direct=intr.indexOf("if(ch===8&&!payload.extra['chapter8-pilot.html'])");
 assert(direct>0 && intr.indexOf('await window.UPPDRAG_CH7_LOADER.load();',direct)>direct && intr.indexOf('await window.UPPDRAG_CH8_LOADER.load();',direct)>intr.indexOf('await window.UPPDRAG_CH7_LOADER.load();',direct),'Direct chapter-eight link must load chapter seven first');
 console.log('PASS chapter8 assembled: '+scriptNames.length+' scripts, all compile, opera cast/route, chapter save, journal and dynamic dialogues');
})().catch(e=>{console.error(e.stack);process.exit(1)});
