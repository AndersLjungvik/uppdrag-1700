/* Story state tests without an interactive browser. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');
class Node{
 constructor(tag){this.tag=tag;this.innerHTML='';this.listeners={};this.nodes={};this.open=false;this.choices=[];}
 addEventListener(type,fn){this.listeners[type]=fn;}
 append(){}
 setAttribute(){}
 close(){this.open=false;}
 showModal(){this.open=true;}
 querySelector(q){if(!this.nodes[q])this.nodes[q]={onclick:null,focus(){}};return this.nodes[q];}
 querySelectorAll(q){if(q==='[data-choice]')return this.choices=(this.innerHTML.match(/data-choice="[^"]+"/g)||[]).map(a=>({dataset:{choice:a.slice(13,-1)},onclick:null}));return [];}
}
const head=new Node('head'),body=new Node('body'),dialog=new Node('dialog');
const document={head,body,createElement(t){if(t==='dialog')return dialog;return new Node(t);}};
let saves=0,progress=0;
const state={step:0,complete:false,deliveryReady:false,ch8Conversation:[]};
const places={1:'print',2:'opera',3:'quay',4:'print',7:'cafe',8:'print'};
const pilot={state,get current(){return()=>({p:state.deliveryReady?'cafe':(places[state.step]||'opera')})},persist(){saves++;},enterMemory(){progress++;}};
const window={UPPDRAG_CH8_PILOT:pilot,UPPDRAG_WORLD_KEYBOARD:{clear(){}}};
const context=vm.createContext({window,document});
vm.runInContext(fs.readFileSync(path.join(root,'chapter8-world.js'),'utf8'),context);
const story=window.UPPDRAG_CH8_STORY;assert(story);
for(const step of [1,2,3,4,7,8]){
 state.step=step;assert(story.needsScene(),step+' expected scene');story.openScene();assert(dialog.open);
 const choices=dialog.choices;assert.equal(choices.length,2);
 choices[0].onclick();
 assert.equal(state.ch8Conversation.at(-1).step,step);
 assert.equal(story.needsScene(),false);
 assert.equal(typeof dialog.querySelector('#ch8Continue').onclick==='function',true);
 dialog.querySelector('#ch8Continue').onclick();
 assert.equal(dialog.open,false);
}
assert.equal(progress,6);
assert.equal(state.ch8Conversation.length,6);
state.step=4;state.ch8DeathNoticeReceived=true;
const lines=story.dialogue('print','before');assert(lines.some(x=>x[1].includes('29 mars')));
state.step=7;state.ch8Conversation=[{step:2,choice:'rumour'}];
assert(story.dialogue('cafe','before').some(x=>x[1].includes('ryktet')));
state.step=8;delete state.ch8Scene8;state.ch8Conversation=[{step:1,choice:'quick'},{step:4,choice:'caution'}];
assert(story.ambient('print').includes('rubriker')||story.ambient('print').includes('datumen'));
story.openScene();assert(dialog.innerHTML.includes('delade nyheten i två daterade besked'));
const btn=dialog.choices[1];btn.onclick();dialog.querySelector('#ch8Continue').onclick();
state.deliveryReady=true;state.step=9;
assert(story.dialogue('cafe','after').some(x=>x[1].includes('inte låtsas')));
assert(story.dialogue('cafe','after').some(x=>x[1].includes('nyheten')));
state.deliveryReady=false;state.step=1;assert(story.ambient('print').includes('daterat'));
state.step=8;assert(story.ambient('print').includes('datumen')); 
console.log('PASS: six independent progressive story triggers, chronological reactions, no free knowledge rewards');
