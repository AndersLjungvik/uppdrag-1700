'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=name=>fs.readFileSync(path.join(root,name),'utf8');
function fixture(){
 const memory=new Map([['uppdrag1700.ch5-real-world.20261020.v1','{"daler":11,"apples":3,"record":[]}'],['uppdrag1700.mastery.v1.ch5','original mastery save']]);
 const original=new Map(memory),nodes=new Map(),classes=new Set(),history=[],calls={study:[],book:0};
 let c,conversation=null,eventBusy=false,quiz=false;
 function element(tag){return {tag,id:'',style:{},dataset:{},innerHTML:'',hidden:false,textContent:'',isConnected:true,scrollTop:0,
  after(){},setAttribute(k,v){this[k]=v;},append(n){nodes.set(n.id,n);},remove(){this.isConnected=false;nodes.delete(this.id);},addEventListener(){},focus(){c.document.activeElement=this;},
  querySelector(s){if(s==='canvas')return element('canvas');if(s==='.cp-sheet')return this.sheet??=element('article');if(s==='.room-top')return element('header');if(s.startsWith('[data-ch5-protocol'))return this.button??=element('button');return null;},querySelectorAll(){return [this.querySelector('[data-ch5-protocol]')];}};}
 const levels=()=>({learner:{status:'available'},journeyman:{status:'locked'},master:{status:'locked'}}),areas={power:levels(),reforms:levels(),press:levels(),rights:levels()};
 c={__INTEGRATED_CHAPTER:5,interior:{kind:'cafe'},voyage:null,region:{id:'main'},path:[],performance:{now:()=>100},stage:element('stage'),roomView:element('room'),roomFooter:{hidden:false},
  localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},
  document:{activeElement:element('button'),createElement:element,head:element('head'),getElementById:id=>nodes.get(id)||null,body:{classList:{contains:k=>classes.has(k),add:k=>classes.add(k),remove:k=>classes.delete(k)}}},addEventListener(){},
  UPPDRAG_MASTERY:{snapshot:()=>({state:{areas}})},UPPDRAG_CH5_BOOKWORK:{busy:false},UPPDRAG_CH5_LETTER:{phase:'waiting'},UPPDRAG_CH3_NPC_MOTION:{approach(){},returnToWork(){}},UPPDRAG_ROOM_ART:{renderMemoryCloseup(){}},
  UPPDRAG_MEETINGS:{state:{talking:false},close(){this.state.talking=false;},redraw(){}},UPPDRAG_CH5_CITY_LIFE:{active:false,suspend(){},close(){}},
  UPPDRAG_CH5_PILOT:{get studyBusy(){return quiz||!!c.UPPDRAG_CH5_PROTOCOL?.busy||c.UPPDRAG_CH5_BOOKWORK.busy;},enterMemory(a){calls.study.push(a);quiz=true;},acceptMajaMission(){calls.book++;},close(){quiz=false;}},
  UPPDRAG_EVENT_ENGINE:{get busy(){return eventBusy;},speakRoom(config){assert.equal(eventBusy,false);eventBusy=true;conversation=config;history.push(config);return true;}}
 };
 c.roomView.style.visibility='visible';c.window=c;vm.createContext(c);vm.runInContext(source('chapter5-protocol.js'),c);vm.runInContext(source('chapter5-scenes.js'),c);
 function choose(id){const current=conversation;assert(current,'room conversation');assert(current.choices.some(x=>x[0]===id),'choice '+id);conversation=null;eventBusy=false;current.closed?.();current.action?.(id);}
 function end(){if(!conversation)return;const current=conversation;conversation=null;eventBusy=false;current.closed?.();}
 function visit(kind){end();assert.equal(c.UPPDRAG_CH5_PROTOCOL.busy,false);c.UPPDRAG_CH5_PILOT.close();c.interior={kind};return c.UPPDRAG_CH5_SCENES.openRoom(kind);}
 return {c,memory,original,areas,calls,history,choose,end,visit,get conversation(){return conversation;}};
}
const h=fixture(),{c}=h,protocol=c.UPPDRAG_CH5_PROTOCOL,scenes=c.UPPDRAG_CH5_SCENES;
assert.equal(scenes.openRoom('riksdag'),false,'an invitation is physical, not remote');
assert.equal(h.visit('cafe'),true);assert(h.conversation.lines.flat().join(' ').includes('Elin'));assert(!h.conversation.choices.some(x=>x[0]==='deliverProtocol'));
assert.equal(h.visit('riksdag'),true);h.choose('protocol');assert.equal(protocol.busy,true);assert.equal(protocol.status().accepted,true);assert.equal(c.UPPDRAG_CH5_PILOT.studyBusy,true);assert.equal(scenes.busy,true);
assert.equal(scenes.openRoom('riksdag'),false,'paper work owns the scene');assert.equal(scenes.travel('cafe'),false,'cannot travel beneath an open paper');
assert.equal(protocol.read('1771'),true);assert.equal(protocol.read('1772'),true);assert.equal(protocol.compare(),true);assert.equal(protocol.status().stage,'recall');protocol.close();
assert.equal(h.visit('cafe'),true);assert(!h.conversation.choices.some(x=>x[0]==='deliverProtocol'),'reading does not permit delivery');
assert.equal(h.visit('riksdag'),true);assert(h.conversation.lines.flat().join(' ').includes('Nu ligger de två daterade bladen rätt'));h.choose('study');assert.deepEqual(h.calls.study,['power']);assert.equal(c.UPPDRAG_CH5_PILOT.studyBusy,true);
assert.equal(h.areas.power.learner.status,'available','opening existing questions creates no stamp');assert.equal(h.areas.power.master.status,'locked');assert.equal(protocol.status().ready,false);
c.UPPDRAG_CH5_PILOT.close();
// These are only fixture outcomes of existing tests, never assignments by the story.
for(const v of Object.values(h.areas.power))v.status='clear';
assert.equal(protocol.status().ready,true);assert.equal(h.visit('riksdag'),true);assert(h.conversation.lines.flat().join(' ').includes('Maja väntar'));assert(!h.conversation.choices.some(x=>x[0]==='study'));
assert.equal(h.visit('cafe'),true);assert(h.conversation.choices.some(x=>x[0]==='deliverProtocol'));h.choose('later');assert.equal(protocol.status().delivered,false,'taking the later choice keeps the physical protocol');
assert.equal(h.visit('cafe'),true);h.choose('deliverProtocol');assert.equal(protocol.status().delivered,true);assert(h.conversation.lines.flat().join(' ').includes('Tack! Protokollet ligger nu här'));h.choose('protocol');assert.equal(protocol.busy,true,'post-delivery callback opens readable finished paper');protocol.close();
assert.equal(h.visit('cafe'),true);assert(!h.conversation.choices.some(x=>x[0]==='deliverProtocol'));h.choose('protocol');assert.equal(protocol.busy,true,'later Maja revisit keeps the paper available');protocol.close();
assert.equal(h.visit('riksdag'),true);assert(h.conversation.lines.flat().join(' ').includes('Maja har protokollet nu'));h.choose('protocol');assert.equal(protocol.busy,true,'Elin also retains the completed reference');protocol.close();
for(const[k,v]of h.original)assert.equal(h.memory.get(k),v,'story and dialogue never overwrite saved knowledge/resources: '+k);
const integration=source('integration.js');assert(integration.indexOf("get('chapter5-protocol.js?v=")<integration.indexOf("get('chapter5-scenes.js?v="),'protocol loads before scene callbacks');
const pilot=source('chapter5-mastery.js');assert.match(pilot,/get studyBusy\(\)\{[^\n]*UPPDRAG_CH5_PROTOCOL\?\.busy/);assert.match(pilot,/UPPDRAG_CH5_PROTOCOL\.journalHTML\(\)/);
console.log('PASS chapter 5 scene integration: Elin document→existing power questions→physical Maja delivery, busy ownership, revisits, unchanged knowledge/resources and active load/book links');
