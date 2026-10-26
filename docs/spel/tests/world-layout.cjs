const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'gameplay-tuning.js'),'utf8'),ctx);
vm.runInNewContext(fs.readFileSync(path.join(root,'world-restoration.js'),'utf8'),ctx);
const patch=ctx.window.UPPDRAG_GAMEPLAY_TUNING.source;
const town=patch('paper-look.js',fs.readFileSync(path.join(root,'base/paper-look.js'),'utf8'));
assert(town.includes('Kapitel\\s+(?:10|[1-9])\\b'));
assert(town.includes("Object.assign(homes,{x:2260,y:850,w:220,h:150,entry:'homesDoor'})"));
new Function(town);
for(const name of ['world-life.js','world-life-ch3.js','world-life-ch4.js','world-life-ch5.js']){
 const s=patch(name,fs.readFileSync(path.join(root,'base',name),'utf8'));
 assert(s.includes('const PADDOCK = [[3161,449],[3412,439],[3426,601],[3157,608]];'),name);
 assert(s.includes('function grazerPose(grazer,time)'),name);
 assert(s.includes('const x=3180+(i*47%212),y=465+(i*29%118);'),name);
 const animals=[...s.matchAll(/\{kind:'(sheep|cow)',x:(\d+),y:(\d+),phase:/g)];
 assert.equal(animals.length,5);
 assert.equal(animals.filter(x=>x[1]==='sheep').length,3);
 assert.equal(animals.filter(x=>x[1]==='cow').length,2);
 for(const x of animals)assert(+x[2]>3170&&+x[2]<3412&&+x[3]>454&&+x[3]<590);
 new Function(s);
}
const clone=patch('world-life-ch5.js',fs.readFileSync(path.join(root,'base/world-life-ch5.js'),'utf8'));
assert(patch('world-life-ch6.js',clone).includes('const PADDOCK = [[3161,449]'));
assert(patch('interior-ch1-pilot.js',fs.readFileSync(path.join(root,'base/interior-ch1-pilot.js'),'utf8')).includes('const pressScale=.45'));
console.log('PASS: shared housing, reachable pasture, five animated grazers and unchanged press tuning');
