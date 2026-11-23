'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const script=fs.readFileSync(path.join(__dirname,'../chapter5-protocol.js'),'utf8');
const KEY='uppdrag1700.ch5-protocol.1772.v1';
function fixture(memory=new Map(),chapter=5){
 const listeners={},nodes=new Map(),bodyClasses=new Set(),calls={close:0,paint:0};
 let c;
 function node(tag){return {tag,id:'',innerHTML:'',textContent:'',style:{},dataset:{},isConnected:true,disabled:false,scrollTop:0,
  setAttribute(k,v){this[k]=v;},addEventListener(k,fn){this[k]=fn;},append(n){nodes.set(n.id,n);},remove(){this.isConnected=false;nodes.delete(this.id);},
  focus(){c.document.activeElement=this;},querySelector(selector){if(selector==='canvas')return node('canvas');if(selector==='.cp-sheet')return this.sheet??=node('article');if(selector.startsWith('[data-ch5-protocol'))return this.button??=node('button');return null;},querySelectorAll(){return [this.querySelector('[data-ch5-protocol]')];}};}
 c={__INTEGRATED_CHAPTER:chapter,interior:{kind:'cafe'},voyage:null,stage:node('stage'),roomView:{style:{visibility:'visible'}},roomFooter:{hidden:false},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},
  document:{activeElement:node('button'),createElement:node,head:node('head'),body:{classList:{contains:k=>bodyClasses.has(k),add:k=>bodyClasses.add(k),remove:k=>bodyClasses.delete(k)}},getElementById:id=>nodes.get(id)||null},
  addEventListener:(k,fn)=>listeners[k]=fn,UPPDRAG_CH5_PILOT:{studyBusy:false},UPPDRAG_EVENT_ENGINE:{busy:false},UPPDRAG_CH5_BOOKWORK:{busy:false},UPPDRAG_CH5_CITY_LIFE:{suspend(){}},UPPDRAG_MEETINGS:{close(){calls.close++;},redraw(){}},UPPDRAG_ROOM_ART:{renderMemoryCloseup(){calls.paint++;}},
  UPPDRAG_MASTERY:{snapshot:()=>({state:{areas:{power:mastery}}})}};
 const mastery={learner:{status:'available'},journeyman:{status:'locked'},master:{status:'locked'}};
 c.window=c;vm.createContext(c);vm.runInContext(script,c);return {c,api:c.UPPDRAG_CH5_PROTOCOL,memory,mastery,listeners,calls,nodes};
}
const original=new Map([['uppdrag1700.ch5-real-world.20261020.v1','{"daler":18,"apples":4,"record":["retained"]}'],['uppdrag1700.mastery.v1.ch5','untouched mastery'],['other-chapter','retained']]);
const h=fixture(new Map(original)),{c,api,mastery,memory}=h;
assert.equal(api.status().stage,'unstarted');assert.equal(api.busy,false);assert.equal(api.open(),false,'papers cannot be opened at cafe before delivery');
c.interior={kind:'church'};assert.equal(api.accept(),false);assert.equal(api.read('1771'),false);assert.equal(api.compare(),false);assert.equal(api.deliver(),false);
c.interior={kind:'cafe'};assert.equal(api.accept(),true);assert.equal(api.accept(),false);assert.equal(api.status().stage,'compare');
c.interior={kind:'riksdag'};c.UPPDRAG_EVENT_ENGINE.busy=true;assert.equal(api.open(),false);c.UPPDRAG_EVENT_ENGINE.busy=false;
c.UPPDRAG_CH5_PILOT.studyBusy=true;assert.equal(api.open(),false);c.UPPDRAG_CH5_PILOT.studyBusy=false;
assert.equal(api.open(),true);assert.equal(api.busy,true);assert.equal(c.roomView.style.visibility,'hidden');assert.equal(h.nodes.get('ch5Protocol').role,'dialog');assert.equal(api.compare(),false);
assert.equal(api.read('1771'),true);assert.equal(api.read('1771'),false);assert.equal(api.compare(),false);assert.equal(api.read('1772'),true);assert.equal(api.read('1792'),false);assert.equal(api.compare(),true);assert.equal(api.compare(),false);assert.equal(api.status().stage,'recall');
assert.equal(api.close(),true);assert.equal(c.roomView.style.visibility,'visible');assert.equal(c.roomFooter.hidden,false);assert.equal(api.busy,false);assert.equal(api.read('1771'),false);
c.interior={kind:'cafe'};assert.equal(api.deliver(),false,'document work alone cannot award delivery or mastery');
mastery.learner.status='clear';mastery.journeyman.status='clear';assert.equal(api.deliver(),false,'all three existing knowledge levels required');mastery.master.status='clear';assert.equal(api.status().ready,true);
c.interior={kind:'riksdag'};assert.equal(api.deliver(),false,'delivery requires Maja in person');c.interior={kind:'cafe'};assert.equal(api.deliver(),true);assert.equal(api.deliver(),false);assert.equal(api.status().stage,'delivered');
assert.equal(api.open(),true,'delivered page remains readable at cafe');assert.equal(api.read('1771'),false);assert.equal(api.compare(),false);
let prevented=0,stopped=0;api.handleKeydown({key:'Escape',preventDefault(){prevented++;},stopImmediatePropagation(){stopped++;}});assert.equal(api.busy,false);assert.equal(prevented,1);assert.equal(stopped,1);
for(const[k,v]of original)assert.equal(memory.get(k),v,'other saved data unchanged: '+k);
assert.deepEqual([...memory.keys()].filter(k=>!original.has(k)),[KEY]);
const reloaded=fixture(memory);assert.equal(reloaded.api.state.accepted,true);assert.equal(reloaded.api.state.seen1771,true);assert.equal(reloaded.api.state.seen1772,true);assert.equal(reloaded.api.state.compared,true);assert.equal(reloaded.api.state.delivered,true);assert.equal(reloaded.api.deliver(),false);
const malformed=fixture(new Map([[KEY,JSON.stringify({v:1,accepted:false,seen1771:false,seen1772:false,compared:true,delivered:true})]]));assert.equal(malformed.api.status().stage,'unstarted');assert.equal(malformed.api.state.delivered,false);
const fresh=fixture();fresh.c.interior={kind:'riksdag'};assert.equal(fresh.api.open(),true);assert.equal(fresh.api.status().accepted,true,'opening at Elin accepts the document work');assert.equal(fresh.api.open(),false,'one panel at a time');fresh.api.close();
const other=fixture(new Map(),4);assert.equal(other.api,undefined,'chapter scoped');
console.log('PASS chapter 5 protocol: physical locations, document comparison, real mastery gate, once-only delivery, accessible panel and Escape, reload, malformed save, untouched resources and earlier save keys');
