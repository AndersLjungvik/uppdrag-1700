import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES
  ? createRequire(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'package.json'))
  : createRequire(import.meta.url);
const {createCanvas}=require('@napi-rs/canvas');
const index=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
const elements=new Map(),listeners=new Map(),storage=new Map();let serial=0;
function attr(raw,name){return raw.match(new RegExp(`${name}="([^"]*)"`))?.[1]||''}
class Classes{constructor(value=''){this.values=new Set(value.split(/\s+/).filter(Boolean))}add(...v){v.forEach(x=>this.values.add(x))}remove(...v){v.forEach(x=>this.values.delete(x))}toggle(v,on){if(on===undefined)on=!this.values.has(v);on?this.values.add(v):this.values.delete(v);return on}}
class Element{
  constructor(tag='div',raw=''){this.tagName=tag.toUpperCase();this.id=attr(raw,'id');this.hidden=/\shidden(?:\s|>|$)/.test(' '+raw);this.open=false;this.value=attr(raw,'value');this.dataset={};this.style={setProperty:(k,v)=>{this.style[k]=v},getPropertyValue:k=>this.style[k]||''};this.classList=new Classes(attr(raw,'class'));this.className=attr(raw,'class');this.childKeys=[];for(const m of raw.matchAll(/data-([\w-]+)="([^"]*)"/g))this.dataset[m[1]]=m[2]}
  set innerHTML(value){this._html=value;for(const key of this.childKeys)if(!key.startsWith('id:'))elements.delete(key);this.childKeys=[];parse(value,this)}get innerHTML(){return this._html||''}
  addEventListener(type,fn){this.events??={};this.events[type]=fn}focus(){}animate(){}showModal(){this.open=true}close(){this.open=false}appendChild(){}remove(){}cloneNode(){return this}click(){this.onclick?.({preventDefault(){},stopPropagation(){}})}
}
function canvasElement(raw){const c=createCanvas(Number(attr(raw,'width'))||1280,Number(attr(raw,'height'))||720);c.id=attr(raw,'id');c.tagName='CANVAS';c.hidden=false;c.dataset={};c.style={setProperty:(k,v)=>{c.style[k]=v}};c.classList=new Classes();c.addEventListener=()=>{};c.focus=()=>{};c.animate=()=>{};c.getBoundingClientRect=()=>({left:0,top:0,width:1280,height:720});return c}
function parse(value,owner){for(const match of value.matchAll(/<([a-zA-Z][\w-]*)\b([^>]*)>/g)){const [,tag,raw]=match;if(!/\bid=|\bdata-/.test(raw))continue;const el=tag==='canvas'?canvasElement(raw):new Element(tag,raw);const key=el.id?`id:${el.id}`:`anon:${++serial}`;if(el.id)elements.set(el.id,el);elements.set(key,el);owner?.childKeys.push(key)}}
parse(index,null);
const body=new Element('body'),document={
  getElementById:id=>elements.get(id)||null,
  querySelectorAll:selector=>{const key=selector.match(/^\[data-([\w-]+)\]$/)?.[1];return key?[...new Set(elements.values())].filter(el=>el.dataset&&key in el.dataset):[]},
  querySelector:selector=>selector==='.brand'?null:null,
  createElement:tag=>new Element(tag),body,documentElement:new Element('html')
};
const soundEvents=[];
const window={UPPDRAG_SOUND:{enabled:true,play:id=>soundEvents.push(id),stop:()=>soundEvents.push('stop')},matchMedia:()=>({matches:true}),addEventListener:(type,fn)=>listeners.set(type,fn),devicePixelRatio:1,print(){}};
const context=vm.createContext({window,document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},requestAnimationFrame:()=>1,setTimeout:fn=>{fn();return ++serial},clearTimeout(){},Blob,URL,console,Date,Math,JSON,Object,Array,Set,Map,Number,String});
vm.runInContext(fs.readFileSync(path.join(root,'dist/practice.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'dist/curriculum.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'dist/game.js'),'utf8'),context);
const game=window.__adventure;
assert(elements.get('modal').open,'intro is open');
elements.get('playerName').value='Testlärlingen';elements.get('startAdventure').click();
assert(game.state.started);assert.equal(game.state.name,'Testlärlingen');
elements.get('dialogueAction1').click();assert(elements.get('dialogue').hidden);
elements.get('mapBtn').click();const harbor=[...new Set(elements.values())].find(el=>el.dataset?.travel==='harbor');assert(harbor);harbor.click();assert.equal(game.state.scene,'harbor');
const npc=[...new Set(elements.values())].find(el=>el.dataset?.hotspot==='tradeNpc');assert(npc);npc.click();elements.get('dialogueAction0').click();assert.equal(game.state.working.missionId,'trade');
const mission=game.mission('trade');
for(const [index,q] of mission.cards.entries()){
  if(q.type==='short'){elements.get('jobAnswer').value=q.answer;elements.get('submitJobAnswer').click()}
  else{q.steps.forEach((step,i)=>{elements.get('chain'+i).value=step.answer});elements.get('submitChainAnswer').click()}
  if(index<mission.cards.length-1)elements.get('dialogueAction0').click();
}
assert(game.state.completed.includes('trade'));assert.equal(game.state.coins,8);assert.equal(game.state.scene,'harbor');elements.get('dialogueAction0').click();
const saved=JSON.parse(storage.get('uppdrag1700.adventure.v2'));const reloaded=game.loadState(saved);
assert(reloaded.started);assert.equal(reloaded.scene,'harbor');assert(reloaded.completed.includes('trade'));assert.equal(reloaded.coins,8);
elements.get('mapBtn').click();const square=[...new Set(elements.values())].find(el=>el.dataset?.travel==='square');square.click();
const baker=[...new Set(elements.values())].find(el=>el.dataset?.hotspot==='baker');baker.click();elements.get('dialogueAction0').click();
assert.equal(game.state.inventory.bread,1);const bread=[...new Set(elements.values())].find(el=>el.dataset?.item==='bread');bread.click();bread.click();
assert.equal(game.state.food,4);assert(game.state.breadEaten);
process.stdout.write('PASS complete UI route: intro → harbor → five-step job → reload-safe pay → buy bread → eat\n');


const guestCoins=game.state.coins;
const bridge=window.UPPDRAG_GAME_CLOUD;
assert(bridge.pause());
bridge.enter('student-A', {...saved, coins:15});
assert.equal(game.state.coins,15);
assert.equal(game.state.name,'');
assert.equal(JSON.parse(storage.get('uppdrag1700.adventure.v2')).coins,guestCoins);
bridge.enter('student-B',null);
assert.equal(game.state.coins,0);
bridge.leave();
assert.equal(game.state.coins,guestCoins);
assert.equal(game.state.name,'Testlärlingen');
process.stdout.write('PASS account switch isolates pupil and guest save states\n');

bridge.resume();
function hotspot(id){return [...new Set(elements.values())].find(el=>el.dataset?.hotspot===id)}
function item(id){return [...new Set(elements.values())].find(el=>el.dataset?.item===id)}
hotspot('master').click();elements.get('dialogueAction0').click();
assert(game.state.rehearsal);
while(game.state.rehearsal){
 const q=game.reviewQuestion();elements.get('reviewAnswer').value=q.answer;elements.get('submitReviewAnswer').click();
 elements.get('dialogueAction0').click();
}
elements.get('dialogueAction0').click();
assert.equal(game.state.inventory.apple,1);
elements.get('mapBtn').click();
[...new Set(elements.values())].find(el=>el.dataset?.travel==='print').click();
for(const [target,object] of [['inkPot','ink'],['paperStack','paper'],['typeCase','type']]){
 hotspot(target).click();assert.equal(game.state.inventory[object],1);
 item(object).click();hotspot('pressMachine').click();assert(!game.state.inventory[object]);
}
hotspot('pressMachine').click();elements.get('dialogueAction0').click();
assert.equal(game.state.inventory.proof,1);elements.get('dialogueAction0').click();
for(const cue of ['ink','paper','type','press'])assert(soundEvents.includes(cue),'successful printing action triggers '+cue);
const beforeErrand=game.state.coins;
hotspot('pressMachine').click();elements.get('dialogueAction0').click();assert(game.state.paperErrand.active);
elements.get('dialogueAction0').click();elements.get('mapBtn').click();
[...new Set(elements.values())].find(el=>el.dataset?.travel==='square').click();
hotspot('oracle').click();elements.get('takePaperParcel').click();assert.equal(game.state.inventory.paperParcel,1);
elements.get('mapBtn').click();[...new Set(elements.values())].find(el=>el.dataset?.travel==='print').click();
item('paperParcel').click();hotspot('pressNpc').click();assert.equal(game.state.coins,beforeErrand+1);
assert(!game.state.inventory.paperParcel);elements.get('dialogueAction0').click();
process.stdout.write('PASS earning UI: accept paper errand → collect at oracle → deliver to Brita → earn 1 daler\n');
elements.get('mapBtn').click();
[...new Set(elements.values())].find(el=>el.dataset?.travel==='garden').click();
hotspot('flower').click();elements.get('sortPlants').click();
assert(elements.get('plantFeedback').textContent.includes('alla fyra'));
elements.get('plant-canina').value='Viola';elements.get('plant-canina').onchange();
elements.get('leavePlants').click();hotspot('flower').click();
assert.equal(JSON.parse(storage.get('uppdrag1700.adventure.v2')).botany.placements.canina,'Viola');
assert(elements.get('modalBody').innerHTML.includes('value="Viola" selected'));
for(const [id,g] of [['canina','Viola'],['tricolor','Viola'],['gallica','Rosa'],['odorata','Viola']])elements.get('plant-'+id).value=g;
elements.get('sortPlants').click();assert(elements.get('plantFeedback').textContent.includes('hamnade fel'));
elements.get('plantHint').click();assert(elements.get('plantFeedback').textContent.includes('börjar med Rosa'));
elements.get('plant-canina').value='Rosa';elements.get('sortPlants').click();assert.equal(game.state.inventory.seeds,1);
elements.get('leavePlants').click();elements.get('mapBtn').click();
[...new Set(elements.values())].find(el=>el.dataset?.travel==='farm').click();
item('seeds').click();hotspot('farmNpc').click();assert(!game.state.inventory.seeds);assert.equal(game.state.hintCredits.farm,1);
elements.get('dialogueClose').click();
process.stdout.write('PASS garden UI: draft → reopen → retry → sort → seeds → farmer hint\n');
elements.get('mapBtn').click();
[...new Set(elements.values())].find(el=>el.dataset?.travel==='palace').click();
item('apple').click();hotspot('kingNpc').click();elements.get('dialogueAction0').click();elements.get('dialogueAction0').click();
elements.get('appleHint').click();assert(game.state.working.hintUsed);
assert.equal(soundEvents.at(-1),'stop','knowledge question silences effects');
elements.get('jobAnswer').value=game.mission('king').cards[0].answer;elements.get('submitJobAnswer').click();
assert(game.state.answers['king-name'].lastSupported);
process.stdout.write('PASS gameplay UI: rehearse → earn apple → collect and print → offer apple → supported answer\\n');
