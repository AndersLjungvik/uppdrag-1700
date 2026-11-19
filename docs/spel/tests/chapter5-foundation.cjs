const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const context={window:{}};vm.createContext(context);
for(const file of ['gameplay-tuning.js','chapter5-presentation.js','scene-presence.js'])vm.runInContext(read(file),context);
for(const name of ['chapter5-pilot.html','more-room-ch4-pilot.js','meeting-ch5-pilot.js','chapter5-street-life.js','world-keyboard-ch5.js','world-life-ch5.js']){
 let s=context.window.UPPDRAG_GAMEPLAY_TUNING.source(name,read('_decoded/'+name));
 s=context.window.UPPDRAG_CH5_PRESENTATION.source(name,s);s=context.window.UPPDRAG_SCENE_PRESENCE.source(name,s);
 if(name.endsWith('.js'))new Function(s);
 if(name.endsWith('.html')){assert(s.includes('if(false){'));assert(!s.includes('<script src="chapter4-sidequest.js'));}
}
function scenario(saved){
 const values=new Map(saved?[['uppdrag1700.ch5-marstrand-letter.20261020.v1',JSON.stringify(saved)]]:[]);
 const c={window:{UPPDRAG_CH5_PILOT:{studyBusy:false},UPPDRAG_CH5_CITY_LIFE:{actor:'prisoner',find:()=>({x:100,y:100})}},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},region:{id:'main'},interior:null,voyage:null,player:{x:100,y:160}};
 vm.createContext(c);vm.runInContext(read('chapter5-letter.js'),c);return {c,api:c.window.UPPDRAG_CH5_LETTER,values};
}
let {c,api}=scenario();assert.equal(api.completedConversation('prisoner',true),false,'cannot take a letter from another island');
c.region.id='marstrand';assert.equal(api.completedConversation('prisoner'),false,'unfinished conversation');
c.player.x=400;assert.equal(api.completedConversation('prisoner',true),false,'proximity');c.player.x=100;
c.interior={kind:'fort'};assert.equal(api.completedConversation('prisoner',true),false,'street actor cannot be used from indoors');c.interior=null;
c.window.UPPDRAG_CH5_PILOT.studyBusy=true;assert.equal(api.completedConversation('prisoner',true),false);c.window.UPPDRAG_CH5_PILOT.studyBusy=false;
assert.equal(api.completedConversation('prisoner',true),true);assert.equal(api.hasLetter,true);assert.equal(api.completedConversation('prisoner',true),false);
assert.equal(api.completedConversation('wharf',true),false,'another actor cannot hand in the letter');c.window.UPPDRAG_CH5_CITY_LIFE.actor='wharf';
assert.equal(api.completedConversation('wharf',true),true);assert.equal(api.hasLetter,false);assert.equal(api.completedConversation('wharf',true),false);
assert.equal(scenario({version:1,phase:'carrying'}).api.hasLetter,true);assert.equal(scenario({version:1,phase:'delivered'}).api.delivered,true);
for(const file of ['chapter5-mastery.js','chapter5-scenes.js','chapter5-letter.js','chapter5-bookwork.js','questions/chapter5-material.js','questions/chapter5-review.js','integration.js'])new Function(read(file));
console.log('PASS chapter 5 source anchors and letter: island, proximity, indoor/study protection, completed conversation, once-only transfer, legacy phases');
