const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const sourceContext={window:{}};vm.createContext(sourceContext);
vm.runInContext(read('gameplay-tuning.js'),sourceContext);vm.runInContext(read('chapter4-presentation.js'),sourceContext);
for(const name of ['meeting-ch4-pilot.js','more-room-ch4-pilot.js','chapter4-street-life.js','world-keyboard-ch4.js']){
 let source=sourceContext.window.UPPDRAG_GAMEPLAY_TUNING.source(name,read('_decoded/'+name));
 if(name.startsWith('meeting-'))source=source.replaceAll("'Jag hjälper till'","'Självklart!'");
 new Function(sourceContext.window.UPPDRAG_CH4_PRESENTATION.source(name,source));
}
function scenario(saved){
 const values=new Map(saved?[['uppdrag1700.ch4-cajsa-cookbook.20261020.v1',JSON.stringify(saved)]]:[]);
 const c={window:{UPPDRAG_CH4_PILOT:{studyBusy:false},UPPDRAG_EVENT_ENGINE:{busy:false}},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},interior:null,voyage:null,player:{x:0,y:705},region:{id:'main'},renderInterior(){}};
 vm.createContext(c);vm.runInContext(read('chapter4-cookbook.js'),c);const api=c.window.UPPDRAG_CH4_SIDEQUEST;
 const enter=kind=>{c.interior=kind?{kind}:null;api.tick();};
 return {c,api,enter,values};
}
let s=scenario();assert.equal(s.api.accept('take'),false);s.enter('print');
s.c.window.UPPDRAG_CH4_PILOT.studyBusy=true;assert.equal(s.api.accept('take'),false);s.c.window.UPPDRAG_CH4_PILOT.studyBusy=false;
assert.equal(s.api.accept('take'),true);assert.equal(s.api.accept('take'),false);assert.equal(s.api.hasBook,true);
s.enter('science');assert.equal(s.api.accept('deliver'),false);s.enter('homes');assert.equal(s.api.accept('deliver'),true);assert.equal(s.api.accept('deliver'),false);assert.equal(s.api.hasBook,false);
s.api.tick();assert.equal(s.api.party,false);s.enter(null);s.enter('homes');assert.equal(s.api.party,false,'a click or immediate doorstep return cannot prepare a feast');
s.enter(null);for(let i=0;i<60;i++){s.c.player.x+=5;s.api.tick();}assert(s.api.snapshot().walked>=300);s.enter('homes');assert.equal(s.api.party,true);
assert.equal(scenario(s.api.snapshot()).api.party,true);
const legacy=scenario({version:1,phase:'delivered',leftHome:true});legacy.enter('homes');assert.equal(legacy.api.party,true,'preserve the already completed older return condition');
assert.equal(scenario({version:1,phase:'carrying',leftHome:false}).api.hasBook,true);
for(const file of ['chapter4-mastery.js','chapter4-scenes.js','chapter4-cookbook.js','integration.js'])new Function(read(file));
console.log('PASS chapter 4 source anchors and cookbook: physical location, study protection, exact once-only transfer, real preparation walk, legacy phase/reload compatibility');
