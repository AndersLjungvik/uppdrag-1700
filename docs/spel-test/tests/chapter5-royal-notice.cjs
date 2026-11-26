'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=n=>fs.readFileSync(path.join(root,n),'utf8');
const KEY='uppdrag1700.ch5-royal-notice.v1';
function fixture(memory=new Map(),chapter=5){
 const nodes=new Map(),classes=new Set(),listeners={},calls={studies:[],writing:0,sail:0};let c,current=null,eventBusy=false,quiz=false;
 function node(tag){return {tag,id:'',innerHTML:'',style:{},hidden:false,isConnected:true,scrollTop:0,
  setAttribute(k,v){this[k]=v;},after(){},append(n){nodes.set(n.id,n);},remove(){this.isConnected=false;nodes.delete(this.id);},addEventListener(){},focus(){c.document.activeElement=this;},
  querySelector(s){if(s==='canvas')return node('canvas');if(s==='.room-top')return node('header');if(s==='.rn-sheet'||s==='.cp-sheet')return this.sheet??=node('article');if(s.startsWith('[data-'))return this.button??=node('button');return null;},querySelectorAll(){return [this.querySelector('[data-rn="close"]')];}};}
 const levels=()=>({learner:{status:'available'},journeyman:{status:'locked'},master:{status:'locked'}}),areas={power:levels(),reforms:levels(),press:levels(),rights:levels()};
 c={__INTEGRATED_CHAPTER:chapter,interior:{kind:'print'},voyage:null,region:{id:'main'},path:[],performance:{now:()=>100},stage:node('stage'),roomView:node('room'),roomFooter:{hidden:false},
  localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},
  document:{activeElement:node('button'),createElement:node,head:node('head'),getElementById:id=>nodes.get(id)||null,body:{classList:{contains:k=>classes.has(k),add:k=>classes.add(k),remove:k=>classes.delete(k)}}},addEventListener:(k,fn)=>listeners[k]=fn,
  UPPDRAG_MASTERY:{snapshot:()=>({state:{areas}})},UPPDRAG_CH5_BOOKWORK:{busy:false,open(){calls.writing++;}},UPPDRAG_CH5_LETTER:{phase:'waiting'},
  UPPDRAG_CH3_NPC_MOTION:{approach(){},returnToWork(){}},UPPDRAG_ROOM_ART:{renderMemoryCloseup(){}},UPPDRAG_MEETINGS:{state:{talking:false},close(){},redraw(){}},UPPDRAG_CH5_CITY_LIFE:{active:false,suspend(){},close(){}},
  UPPDRAG_CH5_PILOT:{get studyBusy(){return quiz||!!c.UPPDRAG_CH5_ROYAL_NOTICE?.busy||!!c.UPPDRAG_CH5_PROTOCOL?.busy;},enterMemory(a){calls.studies.push(a);quiz=true;},close(){quiz=false;}},
  UPPDRAG_EVENT_ENGINE:{get busy(){return eventBusy;},speakRoom(config){assert.equal(eventBusy,false);eventBusy=true;current=config;return true;}},departHarbour(){calls.sail++;}
 };
 c.roomView.style.visibility='visible';c.window=c;vm.createContext(c);
 for(const f of ['chapter5-protocol.js','chapter5-royal-notice.js'])vm.runInContext(source(f),c);
 if(chapter===5)vm.runInContext(source('chapter5-scenes.js'),c);
 const end=()=>{if(!current)return;const previous=current;current=null;eventBusy=false;previous.closed?.();};
 const choose=id=>{assert(current?.choices.some(x=>x[0]===id),'offered choice '+id);const previous=current;end();previous.action?.(id);};
 const visit=p=>{end();assert.equal(c.UPPDRAG_CH5_ROYAL_NOTICE.busy,false);c.UPPDRAG_CH5_PILOT.close();c.interior={kind:p};c.region.id='main';return c.UPPDRAG_CH5_SCENES.openRoom(p);};
 return {c,api:c.UPPDRAG_CH5_ROYAL_NOTICE,nodes,areas,memory,calls,listeners,visit,choose,end,get conversation(){return current;}};
}
const preserved=new Map([['uppdrag1700.ch5-real-world.20261020.v1','original answers and resources'],['uppdrag1700.mastery.v1.ch5','original mastery'],['uppdrag1700.ch4-cajsa-cookbook.20261020.v1','{"phase":"feast"}']]);
const h=fixture(new Map(preserved)),{c,api}=h;
assert.equal(api.status().stage,'start');assert.equal(api.collectOld(),false);assert.equal(api.open('compare'),false);assert.equal(api.deliver(),false);
assert.equal(h.visit('print'),true);assert.match(h.conversation.lines.flat().join(' '),/gamla anslag/);h.choose('royalAccept');assert.equal(api.status().stage,'old');h.end();
assert.equal(h.visit('cafe'),true);assert.equal(api.collectOld(),false,'dialogue cannot be bypassed while busy');h.choose('royalOld');assert.equal(api.state.oldCollected,true);h.end();
assert.equal(h.visit('print'),true);h.choose('royalCompare');assert.equal(api.busy,true);assert.equal(c.UPPDRAG_CH5_PILOT.studyBusy,true);assert.equal(c.UPPDRAG_CH5_SCENES.travel('cafe'),false);
assert.equal(api.open('church'),false);assert.equal(c.UPPDRAG_CH5_PROTOCOL.open(),false,'separate paper panels cannot overlap');
assert.equal(api.compare(),true);assert.equal(api.compare(),false);assert.equal(api.status().stage,'message');api.close();
assert.equal(h.visit('quay'),true);h.choose('royalMessage');assert.equal(api.state.reformCollected,true);h.end();
// Hosts can be visited in any order, and existing question/writing choices remain.
assert.equal(h.visit('church'),true);h.choose('royalNote');assert.equal(api.annotate(),true);api.close();
assert.equal(h.visit('palace'),true);h.choose('writing');assert.equal(h.calls.writing,1);
assert.equal(h.visit('palace'),true);h.choose('study');assert.deepEqual(h.calls.studies,['reforms']);c.UPPDRAG_CH5_PILOT.close();
assert.equal(h.visit('palace'),true);h.choose('royalNote');assert.equal(api.annotate(),true);api.close();
assert.equal(api.open('revise'),false,'editing stays at the press');
assert.equal(h.visit('print'),true);h.choose('royalNote');assert.equal(api.annotate(),true);api.close();
assert.equal(api.status().stage,'revise');assert.equal(h.visit('print'),true);h.choose('royalRevise');
assert.equal(api.revise('equal'),false);assert.equal(api.state.revised,false);assert.equal(api.revise('unchanged'),false);assert.equal(api.revise('qualified'),true);
assert.equal(api.status().stage,'recall','supported correction grants no knowledge credit');assert.equal(api.deliver(),false);api.close();
assert.equal(h.visit('cafe'),true);assert(!h.conversation.choices.some(x=>x[0]==='royalDeliver'));h.end();
assert.match(api.journalHTML(),/aria-current="step"/);assert.match(api.journalHTML(),/Elin/);
// Fixture outcomes represent existing question results; the story never sets them.
for(const area of Object.values(h.areas))for(const value of Object.values(area))value.status='clear';
assert.equal(api.status().ready,true);c.interior={kind:'print'};assert.equal(api.deliver(),false,'no remote delivery');
assert.equal(h.visit('cafe'),true);h.choose('later');assert.equal(api.state.delivered,false,'delivery may be postponed');
assert.equal(h.visit('cafe'),true);h.choose('royalDeliver');assert.equal(api.state.delivered,true);h.end();assert.equal(api.deliver(),false);
api.tick();assert.equal(h.nodes.get('ch5RoyalPosted').hidden,false,'the delivered notice remains in the cafe');
assert.equal(h.visit('cafe'),true);h.choose('royalDiscuss');h.choose('concern');h.end();assert.equal(api.state.reflection,'concern');
assert.equal(h.visit('cafe'),true);h.choose('royalPosted');assert.match(h.nodes.get('ch5RoyalNotice').innerHTML,/Det tidigare anslaget/);
let prevented=0,stopped=0;api.handleKeydown({key:'Escape',preventDefault(){prevented++;},stopImmediatePropagation(){stopped++;}});assert.equal(api.busy,false);assert.equal(prevented,1);assert.equal(stopped,1);assert.equal(c.roomView.style.visibility,'visible');
for(const[k,v]of preserved)assert.equal(h.memory.get(k),v,'answers/resources/mastery/earlier story byte-preserved: '+k);
const reloaded=fixture(h.memory);assert.equal(reloaded.api.status().delivered,true);assert.equal(reloaded.api.state.reflection,'concern');
assert.equal(reloaded.visit('quay'),true);reloaded.choose('sail');assert.equal(reloaded.calls.sail,1,'Marstrand side story remains available');
const malformed=fixture(new Map([[KEY,JSON.stringify({v:1,accepted:false,oldCollected:true,compared:true,reformCollected:true,palace:true,church:true,print:true,revised:true,delivered:true,reflection:'hope'})]]));assert.equal(malformed.api.status().stage,'start');assert.equal(malformed.api.state.delivered,false);assert.equal(malformed.api.state.reflection,'');
const other=fixture(new Map(),4);assert.equal(other.api,undefined);
const integrated=source('integration.js');assert(integrated.indexOf("get('chapter5-royal-notice.js?v=")<integrated.indexOf("get('chapter5-scenes.js?v="));
assert.match(source('chapter5-mastery.js'),/UPPDRAG_CH5_ROYAL_NOTICE\.journalHTML\(\)/);assert.match(source('chapter5-mastery.js'),/name==='royalNext'/);
console.log('PASS chapter 5 royal notice: complete accepted manuscript chain, real room conversations, free host order, old/new documents, supported correction without knowledge credit, all existing mastery required for delivery, postponed/once-only delivery, reflections/revisits, posted notice, busy ownership, Escape, reload, malformed saves, unchanged answers/resources/old stories and active journal/load links');
