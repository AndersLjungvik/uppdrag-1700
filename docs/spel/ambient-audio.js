/* Original procedural ambience and foley for the paper world. No recordings,
 * network requests, microphone, music or pupil-progress writes. */
(function(){
'use strict';
const lengths={air:12,water:12,fire:10,crowd:11,step:.18,paper:.72,wood:.8,press:1.7,hammer:.45,bird:.85,gull:1.5,cart:2.5};
const profiles={
 city:{name:'Staden',beds:{air:.28,crowd:.15},cues:[['cart',16,32,.16],['bird',14,30,.09]],steps:.16},
 harbour:{name:'Kajen',beds:{air:.3,water:.47,crowd:.055},cues:[['gull',11,22,.1],['wood',9,19,.12]],steps:.12},
 sailing:{name:'Till sjöss',beds:{air:.42,water:.62},cues:[['wood',7,15,.15],['gull',22,40,.07]],steps:0},
 print:{name:'Tryckeriet',beds:{air:.035},cues:[['press',5,9,.34],['paper',4,8,.2]],steps:0},
 workshop:{name:'Verkstäderna',beds:{air:.07},cues:[['hammer',4,8,.17],['wood',9,18,.12]],steps:0},
 country:{name:'Byn och naturen',beds:{air:.3},cues:[['bird',5,12,.14]],steps:.13},
 home:{name:'Inomhus',beds:{air:.02,fire:.11,crowd:.035},cues:[['wood',16,30,.035]],steps:0},
 quiet:{name:'Lugnt rum',beds:{air:.022},cues:[['paper',18,34,.035]],steps:0}
};
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
function samples(kind,rate=24000,seed=1732){
 if(!lengths[kind])return null;
 rate=Number.isFinite(rate)?clamp(rate,8000,96000):24000;
 const out=new Float32Array(Math.ceil(lengths[kind]*rate));
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 function knock(start,duration,frequencies,level){
  const phases=frequencies.map(()=>random()*Math.PI*2);
  for(let j=0;j<duration*rate;j++){
   const i=Math.floor(start*rate)+j;if(i>=out.length)break;
   const t=j/rate,envelope=Math.min(1,t/.004)*Math.exp(-t*7/duration);
   out[i]+=level*envelope*(frequencies.reduce((sum,f,k)=>sum+Math.sin(2*Math.PI*f*t+phases[k]),0)/frequencies.length+(random()-.5)*.2);
  }
 }
 function rustle(start,duration,level,roughness){
  let smooth=0;
  for(let j=0;j<duration*rate;j++){
   const i=Math.floor(start*rate)+j;if(i>=out.length)break;
   const t=j/rate;smooth+=roughness*(random()*2-1-smooth);
   out[i]+=smooth*level*Math.sin(Math.PI*t/duration)**2*(.5+.5*Math.sin(t*29)**2);
  }
 }
 if(['air','water','fire','crowd'].includes(kind)){
  let low=0,mid=0,slow=0;
  for(let i=0;i<out.length;i++){
   const t=i/rate,n=random()*2-1;low+=.015*(n-low);mid+=.12*(n-mid);slow+=.001*(n-slow);
   if(kind==='air')out[i]=(low-slow)*(.6+.2*Math.sin(t*1.1)+.15*Math.sin(t*.37));
   if(kind==='water')out[i]=(mid*.42+low*.65)*(.24+.76*(.5+.5*Math.sin(t*1.18+Math.sin(t*.31)))**2);
   if(kind==='fire')out[i]=(low*.4+mid*.16)*(.3+.7*Math.sin(t*12+Math.sin(t*3))**4);
   // A distant, indistinct crowd texture, without spoken words or a melody.
   if(kind==='crowd')out[i]=(mid-low)*(.45+.25*Math.sin(t*2.3)+.2*Math.sin(t*3.71))*Math.sin(t*6.3+Math.sin(t*.8));
  }
 }
 if(kind==='step'){knock(0,.12,[95,170,310],.5);rustle(.02,.15,.2,.3);}
 if(kind==='paper'){rustle(0,.31,.4,.35);rustle(.25,.45,.32,.25);}
 if(kind==='wood'){for(let j=0;j<7;j++)knock(j*.07,.14,[140+j*6,270+j*7,480+j*8],.1);rustle(0,.6,.16,.035);}
 if(kind==='press'){
  for(let j=0;j<9;j++)knock(j*.09,.13,[170+j*5,350+j*9,610+j*7],.1);
  rustle(0,.85,.15,.06);knock(.94,.42,[66,113,181,305],.55);knock(1.17,.26,[125,245,425],.17);rustle(1.27,.38,.2,.3);
 }
 if(kind==='hammer'){knock(.015,.28,[900,1710,2630],.4);knock(.19,.18,[220,410,760],.09);}
 if(kind==='cart')for(let j=0;j<6;j++){const t=j*.38;knock(t,.2,[105,215,375],.25);knock(t+.14,.16,[145,285,510],.17);rustle(t,.3,.13,.05);}
 if(kind==='bird'||kind==='gull'){
  const duration=lengths[kind],f0=kind==='bird'?1450:620;
  let phase=0;
  for(let i=0;i<out.length;i++){
   const t=i/rate,part=kind==='bird'?t% .26:t% .65,span=kind==='bird'?0.2:0.52;
   const sweep=kind==='bird'?400*Math.sin(t*32):720*(1-part/.65);phase+=2*Math.PI*(f0+sweep)/rate;
   const envelope=part<span?Math.sin(Math.PI*part/span)**2:0;
   out[i]=(.75*Math.sin(phase)+.15*Math.sin(phase*2))*envelope*Math.sin(Math.PI*t/duration);
  }
 }
 let peak=0;for(const v of out)peak=Math.max(peak,Math.abs(v));
 const gain=.65/Math.max(.001,peak),fade=rate*(lengths[kind]>5?.2:.012);
 for(let i=0;i<out.length;i++)out[i]=Math.tanh(out[i]*gain)*.85*Math.min(1,i/fade,(out.length-1-i)/fade);
 return out;
}
function create({storageKey='uppdrag1700.ambient.preferences.v1',onChange=()=>{}}={}){
 const Audio=window.AudioContext||window.webkitAudioContext;
 let enabled=false,volume=.4;
 try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved?.v===1){enabled=saved.enabled===true;if(Number.isFinite(saved.volume))volume=clamp(saved.volume,0,1);}}catch{}
 let context=null,master=null,compressor=null,unlocking=null,timer=null,disposed=false,generation=0;
 let state={scene:'city',place:'town',visible:false,walking:false,study:false,dialogue:false,narration:false};
 let activeScene=null,layers=[],schedule=[],stepAt=0,played=0,transitions=0,blocked=false;
 const voices=new Set(),cache=new Map();
 const visible=()=>!document.hidden&&state.visible!==false;
 const canRun=()=>enabled&&visible()&&!disposed;
 function remember(){try{localStorage.setItem(storageKey,JSON.stringify({v:1,enabled,volume}));}catch{}}
 const emit=()=>onChange(status());
 function target(param,value,seconds=.18){const now=context.currentTime;param.cancelScheduledValues(now);param.setTargetAtTime(value,now,seconds);}
 function output(){
  if(!master)return;
  const duck=state.narration?0.015:state.study?0.12:state.dialogue?0.32:1;
  target(master.gain,canRun()?volume*.6*duck:0,state.narration?0.035:0.15);
 }
 function buffer(kind){
  if(cache.has(kind))return cache.get(kind);
  const rate=Math.min(context.sampleRate,24000),data=samples(kind,rate),b=context.createBuffer(1,data.length,rate);b.getChannelData(0).set(data);cache.set(kind,b);return b;
 }
 function voice(kind,gain,{loop=false,pan=0}={}){
  if(!context||context.state!=='running'||voices.size>=24)return null;
  const source=context.createBufferSource(),level=context.createGain(),panner=context.createStereoPanner?.();
  source.buffer=buffer(kind);source.loop=loop;level.gain.value=loop?0:gain;
  source.connect(level);if(panner){panner.pan.value=pan;level.connect(panner);panner.connect(master);}else level.connect(master);
  const item={source,level,kind,loop,retiring:false};voices.add(item);
  source.onended=()=>{voices.delete(item);source.disconnect();level.disconnect();panner?.disconnect();};
  source.start();if(loop)target(level.gain,gain,.22);else played++;
  return item;
 }
 function release(item,seconds=.8){
  if(!item||item.retiring)return;item.retiring=true;
  target(item.level.gain,0,Math.max(.015,seconds/4));try{item.source.stop(context.currentTime+seconds);}catch{}
 }
 function stopVoices(){
  for(const item of voices){try{item.source.stop();}catch{}item.source.disconnect();item.level.disconnect();}
  voices.clear();layers=[];schedule=[];activeScene=null;
 }
 function stopTimer(){if(timer!==null){clearInterval(timer);timer=null;}}
 function pause(immediate=false){
  stopTimer();generation++;const token=generation;
  if(!context)return;
  if(immediate){if(master)master.gain.value=0;stopVoices();void context.suspend?.().catch(()=>{});return;}
  if(master)target(master.gain,0,.02);
  for(const item of voices)release(item,.09);layers=[];schedule=[];activeScene=null;
  setTimeout(()=>{if(token===generation&&!canRun()){stopVoices();void context.suspend?.().catch(()=>{});emit();}},110);
 }
 function transition(){
  const kind=profiles[state.scene]?state.scene:'quiet';if(kind===activeScene&&layers.length)return;
  for(const item of layers)release(item);layers=[];
  // Rapidly changing a doorway must not accumulate a growing stack of loops.
  if(voices.size>12)for(const item of voices)if(item.retiring){try{item.source.stop();}catch{}}
  activeScene=kind;transitions++;
  for(const [id,gain] of Object.entries(profiles[kind].beds)){const item=voice(id,gain,{loop:true,pan:id==='crowd'?-.12:0});if(item)layers.push(item);}
  const now=context.currentTime;schedule=profiles[kind].cues.map(([id,min,max,gain],i)=>({id,min,max,gain,next:now+1.2+i*1.7+Math.random()*2.2}));stepAt=now+.2;
 }
 function tick(){
  if(!canRun()||context?.state!=='running')return;
  transition();output();const now=context.currentTime;
  for(const cue of schedule)if(now>=cue.next){voice(cue.id,cue.gain,{pan:(Math.random()-.5)*.65});cue.next=now+cue.min+Math.random()*(cue.max-cue.min);}
  if(state.walking&&profiles[activeScene].steps&&now>=stepAt){voice('step',profiles[activeScene].steps,{pan:(played%2?1:-1)*.07});stepAt=now+.37+Math.random()*.09;}
 }
 async function unlock(){
  if(!enabled||disposed||!Audio||document.hidden)return false;
  if(unlocking)return unlocking;
  const pending=(async()=>{
   try{
    if(!context||context.state==='closed'){
     context=new Audio();cache.clear();master=context.createGain();master.gain.value=0;
     compressor=context.createDynamicsCompressor?.();
     if(compressor){compressor.threshold.value=-10;compressor.ratio.value=4;compressor.attack.value=.015;compressor.release.value=.3;master.connect(compressor);compressor.connect(context.destination);}else master.connect(context.destination);
    }
    generation++;if(context.state!=='running')await context.resume();
    blocked=context.state!=='running';
    if(canRun()&&!blocked){transition();output();if(timer===null)timer=setInterval(tick,120);}
    else if(!canRun())pause(true);
    emit();return !blocked;
   }catch{blocked=true;pause(true);emit();return false;}
  })();
  unlocking=pending;
  try{return await pending;}finally{if(unlocking===pending)unlocking=null;}
 }
 async function setEnabled(value){
  enabled=!!value&&!!Audio&&!disposed;remember();
  if(!enabled){blocked=false;pause();emit();return false;}
  const result=await unlock();emit();return result;
 }
 function setVolume(value){if(Number.isFinite(Number(value)))volume=clamp(Number(value),0,1);remember();output();emit();return volume;}
 function setScene(next){
  if(!next||disposed)return;
  state={...state,...next,scene:profiles[next.scene]?next.scene:'quiet'};
  if(!canRun()){if(context&&(timer!==null||voices.size))pause(true);emit();return;}
  if(context){if(context.state==='running'){transition();output();if(timer===null)timer=setInterval(tick,120);}else void unlock();}
  emit();
 }
 function status(){return {enabled,volume,supported:!!Audio,context:context?.state||'idle',active:!!(canRun()&&context?.state==='running'),blocked,scene:state.scene,place:state.place,duck:state.narration?0.015:state.study?0.12:state.dialogue?0.32:1,voices:voices.size,layers:layers.length,played,transitions};}
 function visibility(){if(document.hidden)pause(true);else if(enabled&&context)void unlock();emit();}
 function gesture(){if(enabled)return unlock();return Promise.resolve(false);}
 function trustedGesture(event){if(event?.isTrusted&&!event.repeat&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.target?.closest?.('[data-ambient-control]'))void gesture();}
 function pagehide(){pause(true);}
 document.addEventListener('visibilitychange',visibility);
 document.addEventListener('pointerdown',trustedGesture,{capture:true,passive:true});document.addEventListener('keydown',trustedGesture,true);
 window.addEventListener('pagehide',pagehide);
 return {setEnabled,setVolume,setScene,gesture,status,dispose(){disposed=true;enabled=false;pause(true);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('pointerdown',trustedGesture,true);document.removeEventListener('keydown',trustedGesture,true);window.removeEventListener('pagehide',pagehide);void context?.close?.().catch(()=>{});},get enabled(){return enabled;}};
}
window.UPPDRAG_AMBIENT_AUDIO={create,samples,profiles};
})();
