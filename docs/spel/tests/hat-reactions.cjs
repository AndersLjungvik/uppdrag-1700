'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const core={window:{}};vm.createContext(core);vm.runInContext(read('hat-reactions.js'),core);
const R=core.window.UPPDRAG_HAT_REACTIONS,hat={id:'tricorn',kind:'tricorn'},cap={id:'green-cap',kind:'cap'},old={id:'plain',kind:'plain'};
for(const id of ['rusBeach','rusNorth']){
 const actor={id,role:'russian'};
 assert.match(R.thought(actor,hat),/krig mot Ryssland/);assert.match(R.reaction(actor,hat).at(-1)[1],/arg/);
 assert.match(R.reaction(actor,cap).at(-1)[1],/lugnt/);assert.equal(R.thought(actor,old),null);
 assert.deepEqual(copy(R.reaction(actor,cap)),copy(R.reaction(actor,{id:'red-cap',kind:'cap'})),'cap colours do not invent political sides');
 assert.match(R.reaction(actor,hat)[1][1],/inte veta/,'player can challenge an assumption about clothing');
}
for(const id of ['noble','orchard-noble'])for(const wear of [old,cap,hat]){
 const lines=R.reaction({id,role:'noble'},wear);assert.match(lines[0][1],/Bönder|bönder/);assert.match(lines[0][1],/stjäl|stjäla/);
 assert.deepEqual(copy(lines.slice(1)),[['Du','Har du sett någon stjäla?'],['Adelsmannen','Inte just nu. Men jag håller uppsikt!']],'the accusation remains this character\'s belief');
}
for(const actor of [{id:'hat',role:'hat'},{id:'cap',role:'cap'},{id:'farmers',role:'farmer'},{id:'child',role:'child',name:'Barnet'},{id:'smith',role:'smith',name:'Hantverkaren'},{id:'civil:a',sourceId:'a',role:'civil',name:'Britta'}])assert.notDeepEqual(copy(R.reaction(actor,cap)),copy(R.reaction(actor,hat)));
assert.deepEqual(copy(R.reaction({id:'dog:0',role:'dog'},hat)),[]);assert.deepEqual(copy(R.reaction({id:'david',role:'david'},hat)),[]);
assert.doesNotMatch(R.thought({id:'dalarna',role:'potato-farmers',name:'Bönderna'},hat),/krig/,'later potato farmers do not replay the 1743 revolt');
assert.throws(()=>R.source('chapter3-street-life.js','changed source'),/ankaret/);
assert.equal(R.source('chapter2-street-life.js','unmodified'),'unmodified');
console.log('PASS distinct guards, partisans, farmers, workers, children and neighbours; neutral old hat, equal cap colours and attributed prejudice');

class Element{
 constructor(){this.children=[];this.dataset={};this.hidden=true;this.style={};this.textContent='';this.attrs={};this.selectors=new Map();}
 append(...nodes){this.children.push(...nodes);}querySelector(s){if(!this.selectors.has(s))this.selectors.set(s,new Element());return this.selectors.get(s);}
 setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k];}addEventListener(){}replaceChildren(...nodes){this.children=nodes;}focus(){}
 getBoundingClientRect(){return {x:0,y:0,width:260,height:125};}
}
function fixture(chapter,native=false){
 const elements=[],stage=new Element(),document={head:new Element(),getElementById:id=>id==='stage'?stage:null,createElement(){const e=new Element();elements.push(e);return e;}};
 let now=10000;
 const town={id:'main'},owner={x:3390,y:380,heading:0,moving:false};
 const c={document,performance:{now:()=>now},console,matchMedia:()=>({matches:true}),addEventListener(){},REGIONS:{main:town},
  __INTEGRATED_CHAPTER:chapter,player:{x:900,y:900},interior:null,UPPDRAG_WORLD_KEYBOARD:{clear(){}},
  UPPDRAG_HAT_SHOP:{wear:old,busy:false},UPPDRAG_WORLD_LIFE:{quietPeople:()=>[],quietDogs:()=>[]},UPPDRAG_MEETINGS:{drawMapPerson(){}},
  UPPDRAG_ORCHARD:{geometry:()=>({home:owner}),snapshot:{actor:owner,retreat:false},busy:false},
  UPPDRAG_CH3_SCENES:{streetStep:10,closePatrol(){},patrolReplies(){}}
 };
 c.window=c;c['UPPDRAG_CH'+chapter+'_PILOT']={state:{step:10}};vm.createContext(c);
 for(const name of ['hat-reactions.js','scene-presence.js','chapter'+chapter+'-presentation.js'])vm.runInContext(read(name),c);
 let source=read('_decoded/chapter'+chapter+'-street-life.js');
 source=c['UPPDRAG_CH'+chapter+'_PRESENTATION'].source('chapter'+chapter+'-street-life.js',source);
 if(!native)source=c.UPPDRAG_HAT_REACTIONS.source('chapter'+chapter+'-street-life.js',source);
 source=c.UPPDRAG_SCENE_PRESENCE.source('chapter'+chapter+'-street-life.js',source);new Function(source);
 // Movement/scene geometry has separate regressions. Keep these fixtures on
 // the actual historical city logic, content, dialogue and nearby cooldowns.
 c.UPPDRAG_SCENE_PRESENCE={cityPose:a=>a,enqueue:()=>false,walking:false};
 const reactions=c.UPPDRAG_HAT_REACTIONS;c.UPPDRAG_HAT_REACTIONS=undefined;
 vm.runInContext(source,c);c.UPPDRAG_HAT_REACTIONS=reactions;
 const city=c['UPPDRAG_CH'+chapter+'_CITY_LIFE'],dialog=elements[0].querySelector('#ch3StreetDialogue'),words=dialog.querySelector('.ch3Words');
 const painter=new Proxy({},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 function draw(ms=0){now+=ms;city.draw(painter,{region:town,now,camera:{...c.player},layout:{w:390,h:740,scale:1},player:c.player});}
 function near(id){city.suspend();const a=city.find(town,id);assert(a,'real city actor '+id);c.player={x:a.x,y:a.y+40};draw();return a;}
 return {c,city,town,owner,words,dialog,draw,near};
}
for(const chapter of [3,4,5]){
 const h=fixture(chapter),baseline=fixture(chapter,true);
 for(const id of (chapter===3?['cap','hat','farmers','rusBeach','rusNorth','noble']:['book','child','smith'])){
  for(const wear of [old,cap,hat]){
   baseline.near(id);baseline.city.open(baseline.city.find(baseline.town,id));const original=copy(baseline.city.lines);baseline.city.close();
   h.c.UPPDRAG_HAT_SHOP.wear=wear;h.near(id);assert(h.city.open(h.city.find(h.town,id)));
   const lines=copy(h.city.lines);assert.deepEqual(lines.slice(-original.length),original,'all original story lines survive in chapter '+chapter+' / '+id);
   h.city.next();assert(h.words.textContent);assert(h.dialog.attrs['aria-label'].includes(h.words.textContent));h.city.close();
  }
 }
 h.c.UPPDRAG_HAT_SHOP.wear=old;h.near('orchard-noble');h.draw(1400);h.draw(1000);
 assert.equal(h.city.teaser,'orchard-noble');assert.match(h.words.textContent,/Bönder som stjäl/);assert.equal(h.city.active,false,'passing comments never open a blocking conversation');
 h.c.UPPDRAG_HAT_SHOP.wear=cap;h.draw(10);assert.equal(h.city.teaser,null,'outfit change clears the old visible greeting');h.draw(1300);h.draw(1000);
 assert.equal(h.city.teaser,'orchard-noble');assert.match(h.words.textContent,/Mössa igen/);
 h.c.UPPDRAG_HAT_SHOP.wear=hat;h.c.UPPDRAG_HAT_SHOP.busy=true;h.draw(100);assert.equal(h.city.teaser,null,'wardrobe pauses greetings');
 h.c.UPPDRAG_HAT_SHOP.busy=false;h.draw(1300);h.draw(1000);assert.match(h.words.textContent,/fin hatt/);
 h.c['UPPDRAG_CH'+chapter+'_PILOT'].studyBusy=true;h.draw(80);assert.equal(h.city.teaser,null,'learning work has priority over background comments');h.c['UPPDRAG_CH'+chapter+'_PILOT'].studyBusy=false;
 h.c.UPPDRAG_SCENE_PRESENCE.walking=true;h.draw(80);assert.equal(h.city.teaser,null,'walking away releases the speaker');
 h.c.UPPDRAG_SCENE_PRESENCE.walking=false;h.c.UPPDRAG_ORCHARD.busy=true;assert.equal(h.city.find(h.town,'orchard-noble'),null,'owner cannot greet during apple pursuit');
 h.c.UPPDRAG_ORCHARD.busy=false;h.c.UPPDRAG_ORCHARD.snapshot.retreat=true;assert.equal(h.city.find(h.town,'orchard-noble'),null,'owner returns from pursuit before another greeting');
 assert.equal(h.city.find({id:'marstrand'},'orchard-noble'),null);
 console.log('PASS actual chapter '+chapter+': composed source adapters, preserved story, spoken comments, changed outfits, keyboard speech and pursuit priority');
}
const integration=read('integration.js'),index=read('index.html');
assert(index.includes('hat-reactions.js?v=1.0.1'));assert(integration.includes("(await get('hat-reactions.js?v=1.0.1'))"));
assert(integration.includes('if([3,4,5].includes(chapter))text=window.UPPDRAG_HAT_REACTIONS.source(name,text);'));
assert(read('orchard.js').includes("const ownerListening=city?.teaser==='orchard-noble'"));
console.log('PASS integration installs reactions only where headwear already exists; original save namespaces and learning bank unchanged');
