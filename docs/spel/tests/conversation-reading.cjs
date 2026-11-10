'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const c={};c.window=c;vm.createContext(c);for(const f of ['scene-presence.js','chapter3-presentation.js','chapter4-presentation.js','chapter5-presentation.js'])vm.runInContext(read(f),c);
const presence=c.UPPDRAG_SCENE_PRESENCE;c.__INTEGRATED_CHAPTER=3;c.interior=null;
for(const [owner,name,property]of [['city','UPPDRAG_CH3_CITY_LIFE','active'],['living','UPPDRAG_LIVING_DIALOGUES','active'],['meeting','UPPDRAG_MEETINGS','state'],['event','UPPDRAG_EVENT_ENGINE','busy']]){
 c[name]={[property]:property==='state'?{talking:true}:true};
 for(const candidate of ['city','living','meeting','event'])assert.equal(presence.conversationBusy(candidate),candidate!==owner,'only the existing speaker may continue: '+owner+' / '+candidate);
 delete c[name];
}
c.UPPDRAG_EVENT_ENGINE={busy:true,blocking:false,state:{thief:'chasing'}};assert.equal(presence.conversationBusy('city'),false,'talking to seek shelter during a chase remains possible');c.UPPDRAG_EVENT_ENGINE.blocking=true;assert(presence.conversationBusy('city'),'the actual thief dialogue still blocks greetings');delete c.UPPDRAG_EVENT_ENGINE;
for(const [name,property]of [['UPPDRAG_CH3_PROVISIONS','busy'],['UPPDRAG_CH3_SCENES','busy'],['UPPDRAG_STORY_WORK','busy'],['UPPDRAG_HAT_SHOP','busy'],['UPPDRAG_ORCHARD','busy'],['UPPDRAG_APPLE_THREATS','busy'],['UPPDRAG_FISHING','busy'],['UPPDRAG_CH3_PILOT','studyBusy']]){
 c[name]={[property]:true};assert(presence.conversationBusy('living'),name+' blocks an unsolicited greeting');delete c[name];
}
const between=(s,a,b)=>s.slice(s.indexOf(a),s.indexOf(b,s.indexOf(a)));
// Execute the real transformed open functions: a second controller must
// return before looking up actors, freezing people or painting a new greeting.
const living=presence.source('living-dialogues.js',read('_decoded/living-dialogues.js'));
c.UPPDRAG_CH3_CITY_LIFE={active:true};c.context=null;
vm.runInContext(between(living,'  function openWorld(person){',"  bubble.addEventListener('click'")+';window.tryLiving=openWorld;',c);
assert.equal(c.tryLiving({id:'interrupting-person'}),false);
delete c.UPPDRAG_CH3_CITY_LIFE;
for(const chapter of [3,4,5]){
 const name='chapter'+chapter+'-street-life.js';let s=read('_decoded/'+name);s=c['UPPDRAG_CH'+chapter+'_PRESENTATION'].source(name,s);s=presence.source(name,s);
 assert(!s.includes('now-openedAt>=850'),'no timed greeting advance in chapter '+chapter);
 c.active=null;c.viewport={};c.UPPDRAG_LIVING_DIALOGUES={active:true};
 vm.runInContext(between(s,'function open(actor','function close(){')+';window.tryCity=open;',c);
 assert.equal(c.tryCity({id:'interrupting-person'}),false);
 let hidden=0,stopped=0;c.stopTeaser=()=>stopped++;c.hideBubble=()=>hidden++;c.arrivalCandidate={id:'waiting-person'};
 vm.runInContext(between(s,'function updateNearby(region,player,now){','function obstacles(region){')+';window.tryNearby=updateNearby;',c);
 c.tryNearby({id:'main'},{x:0,y:0},100000);assert.equal(hidden,1);assert.equal(stopped,1);assert.equal(c.arrivalCandidate,null);
 delete c.UPPDRAG_LIVING_DIALOGUES;
}
// An elapsed minute must not move the living greeting to another phase.
assert(!living.includes("clock-context.phaseAt>=850"));c.context={regionId:'main',person:{x:0,y:0},mode:'greeting',phaseAt:0};c.region={id:'main'};c.player={x:0,y:0};c.interior=null;c.sailing=null;c.voyage=null;c.companion=null;c.recentHost=null;c.outdoorButtons=()=>{};c.layout={};c.revision=0;c.camera={};c.lastSignature='';c.position=()=>{};c.showPhase=()=>assert.fail('a timer advanced the greeting');
vm.runInContext(between(living,'  function tick(now){','  // A host accompanies')+';window.tryLivingTick=tick;',c);
c.tryLivingTick(60000);assert.equal(c.context.mode,'greeting');
// Test the actual patrol card and next/answer functions with a small DOM.
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.nodes={};this.attributes={};}
 setAttribute(k,v){this.attributes[k]=v;}querySelector(s){return this.nodes[s]??=new Element('p');}append(...n){this.children.push(...n);}focus(){c.document.activeElement=this;}remove(){this.removed=true;}
}
c.document={body:{dataset:{}},createElement:tag=>new Element(tag)};c.stage=new Element('stage');let spoken=null,cancelled=0;
c.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};c.speechSynthesis={speak:u=>spoken=u,cancel:()=>cancelled++};
const scene=read('chapter3-scenes.js');vm.runInContext(between(scene,'function patrolReplies(actor,last){','function handleKeydown(e){')+';window.card=patrolReplies;window.closeCard=closePatrol;window.readCard=readPatrol;',c);
const citySource=c.UPPDRAG_CH3_PRESENTATION.source('chapter3-street-life.js',read('_decoded/chapter3-street-life.js'));
vm.runInContext(between(citySource,'function next(){','function suspend(){')+';window.advanceCity=next;',c);
vm.runInContext("window.UPPDRAG_CH3_SCENES={get patrolQuestionActive(){return !!challenge&&!!patrolBar;}}",c);
for(const answer of [0,1,3]){
 c.patrolBar=null;c.challenge={actor:{id:'soldiers'},t:{prompt:'Varför hade riksdagen mer makt?'},options:['Kungen var enväldig.','Ständerna fattade besluten.','Ingen bestämde.'],answer:'Ständerna fattade besluten.'};
 c.active={mode:'lines'};c.lineIndex=1;c.showLine=()=>assert.fail('the question was advanced without an answer');
 let feedback=null;c.UPPDRAG_CH3_CITY_LIFE={close:()=>c.closeCard(),open:(actor,lines)=>{feedback=lines;return true;}};
 c.card(c.challenge.actor,false);assert.equal(c.patrolBar,null);c.card(c.challenge.actor,true);const card=c.patrolBar;
 assert.equal(card.querySelector('#ch3PatrolQuestion').textContent,c.challenge.t.prompt);assert.equal(c.document.activeElement,card);assert.equal(c.document.body.dataset.patrolQuestion,'true');
 for(let i=0;i<1000;i++)assert(c.advanceCity());assert.equal(c.lineIndex,1);assert.equal(c.patrolBar,card);
 card.children.find(b=>b.dataset.patrolListen).onclick();assert(spoken.text.includes(c.challenge.t.prompt));for(const text of c.challenge.options)assert(spoken.text.includes(text));assert.equal(spoken.lang,'sv-SE');assert.equal(spoken.rate,.85);
 card.children.find(b=>b.dataset.patrolAnswer===String(answer)).onclick();assert(card.removed);assert.equal(c.patrolBar,null);assert.equal(c.challenge,null);assert.equal(c.document.body.dataset.patrolQuestion,undefined);assert(feedback[0][1].includes(answer===3?'Gå vidare':'Du kan gå vidare'));
}
assert(cancelled>=6);console.log('PASS conversation ownership, competing greeting suppression in chapters 3–5, explicit greeting advance, persistent patrol question, Swedish question/options speech and answer/skip cleanup');
