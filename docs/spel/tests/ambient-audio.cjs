'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path');
const source=fs.readFileSync(path.join(__dirname,'../ambient-audio.js'),'utf8');
const copy=v=>JSON.parse(JSON.stringify(v));
function fixture({initial='suspended',supported=true,saved=null,deferredResume=false,panner=true,compressor=true}={}){
 let now=0,nextTimer=1,created=0;const timers=new Map(),contexts=[],changes=[],listeners=new Map(),windowListeners=new Map();
 const pupil='uppdrag1700.preview.mastery.20261028.v1.replay.pupil.play.uppdrag1700.ch4-real-world.20261020.v1',key='test.ambient.preferences';
 const store=new Map([[pupil,'{"v":2,"daler":9,"apples":2,"record":[{"id":"own-answer","ok":true}]}']]);if(saved)store.set(key,JSON.stringify(saved));
 const add=(map,name,fn)=>{if(!map.has(name))map.set(name,new Set());map.get(name).add(fn);};
 const remove=(map,name,fn)=>map.get(name)?.delete(fn);
 const document={hidden:false,addEventListener:(name,fn)=>add(listeners,name,fn),removeEventListener:(name,fn)=>remove(listeners,name,fn)};
 class Param{constructor(value=0){this.value=value;this.targets=[];}cancelScheduledValues(){}setTargetAtTime(value,time,constant){assert(Number.isFinite(value));this.value=value;this.targets.push({value,time,constant});}}
 class Node{constructor(){this.connections=[];this.disconnected=false;}connect(node){this.connections.push(node);return node;}disconnect(){this.disconnected=true;this.connections=[];}}
 class Audio{
  constructor(){created++;this.state=initial;this.currentTime=now/1000;this.sampleRate=8000;this.destination={};this.gains=[];this.sources=[];this.panners=[];this.compressors=[];this.resumeCalls=0;this.suspendCalls=0;this.closeCalls=0;this.pendingResumes=[];contexts.push(this);if(!panner)this.createStereoPanner=undefined;if(!compressor)this.createDynamicsCompressor=undefined;}
  createGain(){const n=new Node();n.gain=new Param();this.gains.push(n);return n;}
  createStereoPanner(){const n=new Node();n.pan=new Param();this.panners.push(n);return n;}
  createDynamicsCompressor(){const n=new Node();for(const p of ['threshold','ratio','attack','release'])n[p]=new Param();this.compressors.push(n);return n;}
  createBuffer(channels,length,rate){assert.equal(channels,1);const data=new Float32Array(length);return {sampleRate:rate,length,duration:length/rate,getChannelData:()=>data};}
  createBufferSource(){const n=new Node();n.started=false;n.ended=false;n.loop=false;n.start=()=>{n.started=true;};n.finish=()=>{if(n.ended)return;n.ended=true;n.onended?.();};n.stop=time=>{if(time===undefined||time<=this.currentTime)n.finish();else n.stopAt=time;};this.sources.push(n);return n;}
  resume(){this.resumeCalls++;if(!deferredResume){this.state='running';return Promise.resolve();}return new Promise(resolve=>this.pendingResumes.push(()=>{this.state='running';resolve();}));}
  suspend(){this.suspendCalls++;if(this.state!=='closed')this.state='suspended';return Promise.resolve();}
  close(){this.closeCalls++;this.state='closed';return Promise.resolve();}
 }
 const sandbox={window:{...(supported?{AudioContext:Audio}:{}),addEventListener:(name,fn)=>add(windowListeners,name,fn),removeEventListener:(name,fn)=>remove(windowListeners,name,fn)},document,localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v))},setInterval:(fn,delay)=>{const id=nextTimer++;timers.set(id,{fn,delay,at:now+delay,interval:true});return id;},clearInterval:id=>timers.delete(id),setTimeout:(fn,delay=0)=>{const id=nextTimer++;timers.set(id,{fn,delay,at:now+delay,interval:false});return id;},clearTimeout:id=>timers.delete(id)};
 vm.createContext(sandbox);vm.runInContext(source,sandbox);const library=sandbox.window.UPPDRAG_AMBIENT_AUDIO,api=library.create({storageKey:key,onChange:value=>changes.push(copy(value))});
 function clock(time){now=time;for(const context of contexts){context.currentTime=now/1000;for(const s of context.sources)if(!s.ended&&s.stopAt!==undefined&&s.stopAt<=context.currentTime)s.finish();}}
 async function advance(ms){const end=now+ms;let guard=0;while(true){assert(++guard<10000);const due=[...timers].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;const [id,timer]=due;clock(timer.at);if(timer.interval)timer.at+=timer.delay;else timers.delete(id);timer.fn();await Promise.resolve();}clock(end);await Promise.resolve();await Promise.resolve();}
 const fire=(name)=>{for(const fn of listeners.get(name)||[])fn({isTrusted:true});};
 const fireWindow=name=>{for(const fn of windowListeners.get(name)||[])fn({});};
 const visible=(scene='city')=>api.setScene({scene,place:scene,visible:true,study:false,dialogue:false,narration:false,walking:false});
 return {api,library,document,store,key,pupil,changes,contexts,timers,listeners,windowListeners,visible,advance,fire,fireWindow,get created(){return created;},get context(){return contexts.at(-1);},get intervals(){return [...timers.values()].filter(t=>t.interval).length;},get activeSources(){return contexts.flatMap(c=>c.sources).filter(s=>s.started&&!s.ended);},resolveResume(){for(const context of contexts)for(const done of context.pendingResumes.splice(0))done();}};
}

test('samples are deterministic, finite, distinct, faded and leave headroom',()=>{
 const h=fixture(),kinds=['air','water','fire','crowd','step','paper','wood','press','hammer','bird','gull','cart'],signatures=new Set();
 for(const kind of kinds){const data=h.library.samples(kind,8000),again=h.library.samples(kind,8000);assert(data.length>=1000&&data.length<=96000,kind);assert.deepEqual(data,again,kind+' is deterministic');let peak=0,sum=0;for(let i=0;i<data.length;i++){assert(Number.isFinite(data[i]),kind);peak=Math.max(peak,Math.abs(data[i]));sum+=data[i]*data[i];}assert(peak>.01&&peak<.55,kind+' has unclipped headroom');assert(sum>0,kind);assert.equal(Math.abs(data[0]),0);assert.equal(Math.abs(data.at(-1)),0);signatures.add(data.length+':'+Array.from(data.filter((_,i)=>i%997===0)).map(v=>v.toFixed(5)).join(','));}
 assert.equal(signatures.size,kinds.length);assert.equal(h.library.samples('unknown'),null);assert.equal(Object.keys(h.library.profiles).sort().join(','),'city,country,harbour,home,print,quiet,sailing,workshop');
 assert.equal(new Set(Object.values(h.library.profiles).map(p=>JSON.stringify([p.beds,p.cues,p.steps]))).size,8,'all location profiles differ');h.api.dispose();
});

test('default stays silent without a context until explicit opt-in',async()=>{
 const h=fixture();h.visible();assert.equal(h.api.enabled,false);assert.equal(h.created,0);assert.equal(await h.api.gesture(),false);h.fire('pointerdown');h.fire('keydown');await h.advance(1000);assert.equal(h.created,0);assert.equal(h.intervals,0);assert.equal(h.api.status().voices,0);
 assert.equal(await h.api.setEnabled(true),true);assert.equal(h.created,1);assert.equal(h.api.status().active,true);assert.equal(h.intervals,1);assert.equal(h.api.status().scene,'city');assert.equal(h.api.status().layers,2);h.api.dispose();
});

test('remembered enabled preference still waits for a fresh gesture',async()=>{
 const h=fixture({saved:{v:1,enabled:true,volume:.27}});h.visible('harbour');assert.equal(h.api.status().enabled,true);assert.equal(h.api.status().volume,.27);assert.equal(h.created,0);await h.advance(1000);assert.equal(h.created,0);assert.equal(await h.api.gesture(),true);assert.equal(h.created,1);assert.equal(h.api.status().scene,'harbour');assert.equal(h.api.status().layers,3);h.api.dispose();
});

test('unsupported audio fails quietly without writing pupil progress',async()=>{
 const h=fixture({supported:false}),pupil=h.store.get(h.pupil);h.visible();assert.equal(h.api.status().supported,false);assert.equal(await h.api.setEnabled(true),false);assert.equal(await h.api.gesture(),false);assert.equal(h.created,0);assert.equal(h.intervals,0);assert.equal(h.api.status().active,false);assert.equal(h.store.get(h.pupil),pupil);h.api.dispose();
});

for(const initial of ['running','suspended'])test(initial+' constructor: toggles unlock and scheduling remain reusable',async()=>{
 const h=fixture({initial});h.visible();assert.equal(await h.api.setEnabled(true),true);assert.equal(h.intervals,1);assert.equal(h.context.state,'running');
 for(let i=0;i<4;i++){await h.api.gesture();await h.api.setEnabled(true);h.visible(i%2?'city':'harbour');assert.equal(h.intervals,1,'there is one scheduling interval');}
 await h.api.setEnabled(false);await h.advance(200);assert.equal(h.context.state,'suspended');assert.equal(h.intervals,0);assert.equal(h.api.status().voices,0);
 assert.equal(await h.api.setEnabled(true),true);assert.equal(h.context.state,'running','a later enable resumes rather than reusing a completed unlock promise');assert.equal(h.api.status().active,true);assert.equal(h.intervals,1);assert.equal(h.created,1);h.api.dispose();
});

test('scene transitions crossfade beds and keep rapid switches and voices bounded',async()=>{
 const h=fixture();h.visible();await h.api.setEnabled(true);const first=h.context.sources.slice();h.visible('harbour');assert.equal(h.api.status().layers,3);assert.equal(h.api.status().scene,'harbour');assert(first.every(s=>s.stopAt>h.context.currentTime),'old bed sources retire with a fade');
 await h.advance(1000);assert(first.every(s=>s.ended));assert.equal(h.api.status().voices,3);
 for(let i=0;i<50;i++){h.visible(i%2?'home':'harbour');assert(h.api.status().voices<=24);assert(h.activeSources.length<=24);assert.equal(h.intervals,1);}
 h.visible('not-a-room');assert.equal(h.api.status().scene,'quiet');assert.equal(h.api.status().layers,1);await h.advance(1000);assert(h.api.status().voices<=3);h.api.dispose();
});

test('volume clamps and ducking protect dialogue, study and narration',async()=>{
 const h=fixture();h.visible('quiet');await h.api.setEnabled(true);const master=h.context.gains[0].gain;
 assert.equal(h.api.setVolume(-2),0);assert.equal(h.api.setVolume(2),1);assert.equal(h.api.setVolume('0.5'),.5);assert.equal(h.api.setVolume(NaN),.5);
 for(const [flags,duck] of [[{},1],[{dialogue:true},.32],[{study:true,dialogue:true},.12],[{narration:true,study:true,dialogue:true},.015]]){h.api.setScene({scene:'quiet',visible:true,walking:false,study:false,dialogue:false,narration:false,...flags});assert.equal(h.api.status().duck,duck);assert(Math.abs(master.value-.5*.6*duck)<1e-12);}
 h.api.setScene({scene:'quiet',visible:true,narration:false,study:false,dialogue:false});assert.equal(master.value,.3);h.api.dispose();
});

test('walking emits bounded steps and quiet rooms have no footstep loop',async()=>{
 const h=fixture();h.visible('city');await h.api.setEnabled(true);h.api.setScene({scene:'city',visible:true,walking:true});await h.advance(1200);assert(h.api.status().played>=2);assert(h.api.status().voices<=24);const played=h.api.status().played;
 h.api.setScene({scene:'quiet',visible:true,walking:true});await h.advance(1000);assert.equal(h.api.status().played,played,'quiet indoor profile has no footstep loop');h.api.dispose();
});

test('hidden/pagehide stop scheduling and suspension is reversible after allowed audio',async()=>{
 const h=fixture();h.visible();await h.api.setEnabled(true);assert(h.api.status().voices>0);h.document.hidden=true;h.fire('visibilitychange');await h.advance(1);assert.equal(h.context.state,'suspended');assert.equal(h.api.status().voices,0);assert.equal(h.intervals,0);assert.equal(h.api.status().active,false);
 h.document.hidden=false;h.fire('visibilitychange');await h.advance(1);assert.equal(h.context.state,'running');assert.equal(h.intervals,1);assert.equal(h.api.status().active,true);
 h.api.setScene({scene:'city',visible:false});await h.advance(1);assert.equal(h.context.state,'suspended');assert.equal(h.intervals,0);h.api.setScene({scene:'city',visible:true});await h.advance(1);assert.equal(h.api.status().active,true);
 h.fireWindow('pagehide');await h.advance(1);assert.equal(h.context.state,'suspended');assert.equal(h.api.status().voices,0);assert.equal(h.intervals,0);h.api.dispose();
});

test('quick off/on cannot run a stale suspension callback',async()=>{
 const h=fixture();h.visible();await h.api.setEnabled(true);await h.api.setEnabled(false);assert.equal(await h.api.setEnabled(true),true);await h.advance(200);assert.equal(h.context.state,'running');assert.equal(h.api.status().active,true);assert.equal(h.intervals,1);assert(h.api.status().voices<=24);h.api.dispose();
});

test('muting while resume is pending remains silent and unscheduled',async()=>{
 const h=fixture({deferredResume:true});h.visible();const enabling=h.api.setEnabled(true);await Promise.resolve();assert.equal(h.created,1);await h.api.setEnabled(false);await h.advance(200);h.resolveResume();await enabling;await h.advance(1);
 assert.equal(h.api.status().enabled,false);assert.equal(h.api.status().active,false);assert.equal(h.intervals,0);assert.equal(h.api.status().voices,0);assert.equal(h.context.gains[0].gain.value,0);assert.equal(h.context.state,'suspended','a late resume must not leave a muted context running');h.api.dispose();
});

test('preferences are separate and disposal releases audio and event listeners',async()=>{
 const h=fixture(),pupil=h.store.get(h.pupil);h.visible('home');await h.api.setEnabled(true);h.api.setVolume(.71);assert.deepEqual(JSON.parse(h.store.get(h.key)),{v:1,enabled:true,volume:.71});assert.equal(h.store.get(h.pupil),pupil);assert.equal(h.store.size,2);assert.equal(h.context.compressors.length,1);assert.equal(h.context.gains[0].connections[0],h.context.compressors[0],'master headroom compressor is connected');
 h.api.dispose();await h.advance(200);assert.equal(h.context.state,'closed');assert.equal(h.context.closeCalls,1);assert.equal(h.intervals,0);assert.equal(h.api.status().voices,0);assert.equal(h.api.status().active,false);assert(h.context.sources.every(s=>s.disconnected));assert(h.context.panners.every(s=>s.disconnected));assert.equal(h.listeners.get('pointerdown').size,0);assert.equal(h.listeners.get('keydown').size,0);assert.equal(h.listeners.get('visibilitychange').size,0);assert.equal(h.windowListeners.get('pagehide').size,0);assert.equal(await h.api.setEnabled(true),false);assert.equal(h.created,1);assert.equal(h.store.get(h.pupil),pupil);
});

test('optional panner and compressor APIs are not required',async()=>{
 const h=fixture({panner:false,compressor:false});h.visible('print');assert.equal(await h.api.setEnabled(true),true);await h.advance(5000);assert(h.api.status().played>=1);assert.equal(h.intervals,1);h.api.dispose();
});
