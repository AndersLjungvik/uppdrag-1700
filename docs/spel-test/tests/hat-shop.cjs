'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const c={window:{}};vm.createContext(c);vm.runInContext(read('hat-shop-model.js'),c);vm.runInContext(read('hat-shop.js'),c);
const M=c.window.UPPDRAG_HAT_SHOP_MODEL,S=c.window.UPPDRAG_HAT_SHOP.source;
for(const [dx,dy] of [[-96,-165],[-142,-130],[-155,105],[150,117],[172,-80]]){
 const square={x:1010,y:705},merchant={x:square.x+dx,y:square.y+dy},stall=c.window.UPPDRAG_HAT_SHOP.stallGeometry(square,merchant);
 assert(Math.abs(dx*Math.cos(stall.angle)+dy*Math.sin(stall.angle))<1e-8,'table follows the tangent of the round plaza');
 const onTable={x:stall.x+Math.cos(stall.angle)*34,y:stall.y+Math.sin(stall.angle)*34};
 const offTable={x:stall.x+Math.cos(stall.angle)*52,y:stall.y+Math.sin(stall.angle)*52};
 assert(c.window.UPPDRAG_HAT_SHOP.stallHit(stall,onTable));assert(!c.window.UPPDRAG_HAT_SHOP.stallHit(stall,offTable),'click target uses the rotated rectangle');
}
console.log('PASS plaza alignment: tangential table and matching rotated click target in every candidate position');
vm.runInContext(read('scene-presence.js'),c);const presence=c.window.UPPDRAG_SCENE_PRESENCE;
let balance=3,near=false,saved=null,debits=0,shop;
shop=M.create({owned:['not-a-hat'],equipped:'not-a-hat'},{wallet:()=>balance,canBuy:()=>near,debit:(amount,expected)=>{assert.equal(expected,balance);debits++;assert.equal(shop.buy('red-cap').reason,'busy','a reentrant click is blocked');balance-=amount;return true;},save:s=>saved=copy(s)});
assert.deepEqual(copy(shop.snapshot()),{v:1,owned:['plain'],equipped:'plain'});
assert.equal(shop.buy('green-cap').reason,'away');assert.equal(balance,3);
near=true;assert.equal(shop.buy('green-cap').paid,2);assert.equal(balance,1);assert.equal(debits,1);
assert.equal(shop.buy('green-cap').paid,0);assert.equal(balance,1);assert.equal(debits,1,'owned hats cannot be charged twice');
assert.equal(shop.buy('tricorn').reason,'funds');assert.equal(shop.equip('tricorn').reason,'unowned');
assert.equal(shop.equip('plain').ok,true);assert.equal(balance,1);assert.equal(shop.equip('green-cap').ok,true);
assert.equal(M.create(saved).wear.id,'green-cap','selected hat survives reload');
assert.equal(M.create(null).wear.id,'plain');assert.equal(M.create({owned:['plain'],equipped:'tricorn'}).wear.id,'plain');
console.log('PASS cosmetic transactions: physical presence, exact prices, insufficient funds, reentrant/repeated clicks, free outfit changes, validated saves');

for(const chapter of [3,4,5]){
 const name='meeting-ch'+chapter+'-pilot.js',s=presence.source(name,S(name,read('_decoded/'+name)));new Function(s);
 assert(s.includes('who===CAST.player?window.UPPDRAG_HAT_SHOP?.wear:null'));
 assert(s.includes('if(who===CAST.player)window.UPPDRAG_HAT_SHOP?.drawMapHat(ctx)'));
}
for(const name of ['world-keyboard.js','world-keyboard-ch3.js','world-keyboard-ch4.js','world-keyboard-ch5.js'])new Function(presence.source(name,S(name,read('_decoded/'+name))));
for(const name of ['world-street-pilot.js','world-classic-pilot.js']){
 const original=read('_decoded/'+name).replace('if(path.length&&!sailing&&!window.UPPDRAG_STORY_WORK?.busy)','if(path.length&&!sailing&&!window.UPPDRAG_STORY_WORK?.busy&&!window.UPPDRAG_EVENT_ENGINE?.blocking)').replace('UPPDRAG_MEETINGS.drawMapPlayer(ctx,player,window.UPPDRAG_WORLD_KEYBOARD?.motionPath||path,performance.now());','UPPDRAG_MEETINGS.drawMapPlayer(ctx,player,window.UPPDRAG_WORLD_KEYBOARD?.motionPath||path,performance.now());window.UPPDRAG_EVENT_ENGINE?.drawCover(ctx,region);');
 new Function(presence.source(name,S(name,original)));
}
assert.throws(()=>S('meeting-ch1-pilot.js','changed source'),'source anchors fail closed');
console.log('PASS player-only room/map headwear and movement blockers in chapters 3–5');

const {fixture}=require('./apple-threats-world.cjs');
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.open=false;this.hidden=false;this.status={textContent:''};this.isConnected=true;}
 append(...nodes){this.children.push(...nodes);}setAttribute(){}addEventListener(name,fn){(this.events[name]??=[]).push(fn);}
 querySelector(selector){return selector==='#hatShopStatus'?this.status:null;}querySelectorAll(){return [];}
 showModal(){this.open=true;}close(){this.open=false;for(const fn of this.events.close||[])fn();}focus(){}
 getBoundingClientRect(){return {left:0,top:0,width:1000,height:800};}
}
for(const chapter of [1,2,3,4,5]){
 const h=fixture('dog',chapter),c=h.c,elements=[],canvas=new Element('canvas');
 canvas.width=1000;canvas.height=800;
 const doc=c.document,oldGet=doc.getElementById;
 doc.getElementById=id=>id==='world'?canvas:oldGet(id);
 doc.createElement=tag=>{const e=new Element(tag);elements.push(e);return e;};
 doc.activeElement=canvas;doc.body.append=()=>{};
 c.region=c.testRegion;c.player={...c.testNavigation(c.testRegion,'quay')};c.path=[];c.follow=true;c.setMessage=()=>{};
 c.UPPDRAG_EVENT_ENGINE.people=()=>[];c.UPPDRAG_EVENT_ENGINE.register=()=>true;
 if(chapter<3){
  const wardrobe=JSON.stringify({v:1,owned:['plain','red-cap'],equipped:'red-cap'});h.memory.set('uppdrag1700.wardrobe.v1',wardrobe);
  vm.runInContext(read('hat-shop-model.js'),c);vm.runInContext(read('hat-shop.js'),c);
  assert.equal(elements.length,0,'no merchant, wardrobe buttons or dialogue before chapter three');
  assert.equal(c.UPPDRAG_HAT_SHOP.position,undefined);assert.equal(c.UPPDRAG_HAT_SHOP.wear,undefined);
  assert.equal(h.memory.get('uppdrag1700.wardrobe.v1'),wardrobe,'already owned hats remain saved for later');
  console.log('PASS chapter '+chapter+': no early shop or hat introduction; existing wardrobe preserved');continue;
 }
 const before=copy({apples:h.state.apples,record:h.state.record,earned:h.state.earned,step:h.state.step,index:h.state.index,trial:h.state.trial});
 vm.runInContext(read('hat-shop-model.js'),c);vm.runInContext(read('hat-shop.js'),c);
 const api=c.UPPDRAG_HAT_SHOP,merchant=api.position(),dialog=elements.find(e=>e.tag==='dialog');
 assert(merchant,'shop fits actual town '+chapter);assert(c.UPPDRAG_WORLD_KEYBOARD.clearSegment(c.region,merchant,merchant,40),'stall fits outside buildings/water');
 const square=c.testNavigation(c.region,'square'),tableDistance=Math.hypot(merchant.stall.x-square.x,merchant.stall.y-square.y);
 assert(tableDistance>=145&&tableDistance<=160,'small tabletop sits beside the round plaza');
 assert(Math.abs(Math.hypot(merchant.x-merchant.arrival.x,merchant.y-merchant.arrival.y)-72)<.01,'player and merchant stand on opposite sides of the table');
 const cityRoute=c.UPPDRAG_EVENT_APPROACH.routeBetween(c.region,c.testNavigation(c.region,'quay'),merchant.arrival,id=>c.testNavigation(c.region,id),(a,b)=>c.UPPDRAG_WORLD_KEYBOARD.clearSegment(c.region,a,b,24),true);
 assert(cityRoute?.length,'shop is reachable from actual quay');
 assert.equal(api.interact(),false,'space cannot open a distant shop');assert.equal(api.travel(),true);assert(c.path.length>0,'travel sets a real walking route');assert.equal(dialog.open,false,'route does not open shop remotely');
 c.player={...merchant.arrival};c.path.length=0;c.UPPDRAG_WORLD_LIFE.tick(12000,{region:c.region,player:c.player,activeRoom:null});
 assert.equal(dialog.open,true,'arrival opens the shop only when physically there');assert.equal(api.talking,true);assert.equal(api.busy,true);
 assert(c.UPPDRAG_EVENT_ENGINE.people(c.region).some(p=>p.id==='hat-merchant'&&p.solid),'merchant joins physical collision actors');
 assert.equal(c.UPPDRAG_EVENT_ENGINE.conversation.id,'hat-merchant','talking is a real social shelter');
 const choose=id=>{const target={dataset:{hat:id},closest(){return this;},hasAttribute(){return false;}};for(const fn of dialog.events.click)fn({target});};
 const oldBalance=h.state.daler;choose('red-cap');assert.equal(h.state.daler,oldBalance-2);assert.equal(api.wear.id,'red-cap');
 choose('red-cap');assert.equal(h.state.daler,oldBalance-2,'double click never buys twice');
 choose('plain');assert.equal(api.wear.id,'plain');assert.equal(h.state.daler,oldBalance-2);
 c.player={x:200,y:700};choose('tricorn');assert.equal(h.state.daler,oldBalance-2,'moving away prevents any further purchase');
 assert.deepEqual(copy({apples:h.state.apples,record:h.state.record,earned:h.state.earned,step:h.state.step,index:h.state.index,trial:h.state.trial}),before,'shop does not change learning progress');
 assert(h.memory.has('uppdrag1700.wardrobe.v1'),'wardrobe uses a chapter-independent key inside integrated scope');
 dialog.close();assert.equal(api.openWardrobe(),true);assert.equal(api.talking,false,'wardrobe is not a remote social shelter');
 choose('red-cap');assert.equal(api.wear.id,'red-cap');choose('tricorn');assert.equal(h.state.daler,oldBalance-2,'wardrobe cannot buy remotely');
 const painter=new Proxy({},{get:(o,k)=>k in o?o[k]:(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 api.drawMapHat(painter);for(const hat of c.UPPDRAG_HAT_SHOP_MODEL.catalog)api.drawSideHat(painter,hat);
 c.interior={kind:'archive'};dialog.close();assert.equal(api.travel(),false,'cannot solve a trip to the shop from a room');
 console.log('PASS real chapter '+chapter+': reachable stall, physical buy, saved wardrobe, social shelter, exact debit, remote purchase blocked, preserved questions/apples/stamps');
}
const integration=read('integration.js'),index=read('index.html');
assert(index.includes('hat-shop.js?v=1.0.3'));assert(integration.includes("await get('hat-shop-model.js?v=1.0.0')"));
assert(integration.includes('const hatShop=[3,4,5].includes(ch)?'),'integration only installs the shop from chapter three');
assert(integration.includes('if([3,4,5].includes(chapter))text=window.UPPDRAG_HAT_SHOP.source(name,text);'),'early chapters retain their original people renderers');
assert(integration.includes("+hatShop+'\\n'"));assert(read('event-engine.js').includes('if(window.UPPDRAG_HAT_SHOP?.talking)return true;'));
console.log('PASS integrated shop loading and pickpocket shelter');
