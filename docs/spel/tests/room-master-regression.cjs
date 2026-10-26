/* Regression for 1.2.2: patch the actual room renderer and avoid master loops.
 * Run after: python decode_sources.py
 */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'gameplay-tuning.js'),'utf8'),context);
const source=context.window.UPPDRAG_GAMEPLAY_TUNING.source;
const render=source('interior-ch1-pilot.js',fs.readFileSync(path.join(root,'base/interior-ch1-pilot.js'),'utf8'));
assert(render.includes('const pressScale=.45,feet=floor+5;'));
assert(render.includes('const pressScale=.46,feet=floor+5;'));
assert(!render.includes('const pressScale=1.04,feet=floor+143;'));
assert(!render.includes('const pressScale=.94,feet=floor+90;'));
const old=fs.readFileSync(path.join(root,'_decoded/recall-flow.js'),'utf8');
const flow=source('recall-flow.js',old);
assert(flow.includes('t?.rank!==2||x.independent||t.chapter===6'));
assert(flow.includes("assessment==='pending-review'"));
assert(flow.includes('Spara svaret och gå vidare'));
assert(flow.includes('Svaret sparat för granskning'));
const supported={version:'recall-2-rubric',step:9,id:'rc6-fields-2',ok:true,independent:false,support:true,assessment:'rubric-checked'};
function passed(t){return [supported].some(x=>x.version==='recall-2-rubric'&&x.step===9&&x.id===t.id&&x.ok&&(x.assessment==='pending-review'||(x.assessment!=='self-review'&&(t.rank!==2||x.independent||t.chapter===6))));}
assert(passed({id:'rc6-fields-2',rank:2,chapter:6}));
assert(!passed({id:'rc6-fields-2',rank:2,chapter:5}));
assert.equal(supported.independent,false);
console.log('PASS room renderer, chapter 6 supported-master progression and preserved independent status');
