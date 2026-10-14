'use strict';
(() => {
  // Original procedural foley sketches, not recordings of a historical press.
  const KEY='uppdrag1700.sound.v1';
  const LENGTH={type:.65,paper:.72,ink:.38,wood:.48,press:1.65};
  function samples(id,rate=44100,seed=1){
    if(!LENGTH[id])return null;
    const out=new Float32Array(Math.ceil(LENGTH[id]*rate));
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
    function knock(start,length,frequencies,level){
      const phases=frequencies.map(()=>random()*6.283);
      for(let j=0;j<length*rate;j++){
        const i=Math.floor(start*rate)+j;if(i>=out.length)break;
        const t=j/rate,env=Math.min(1,t/.002)*Math.exp(-t*7/length);
        out[i]+=level*env*(frequencies.reduce((s,f,k)=>s+Math.sin(6.283*f*t+phases[k]),0)/frequencies.length+(random()-.5)*.25);
      }
    }
    function rustle(start,length,level,roughness){
      let smooth=0;
      for(let j=0;j<length*rate;j++){
        const i=Math.floor(start*rate)+j;if(i>=out.length)break;
        const t=j/rate,noise=random()*2-1;smooth+=roughness*(noise-smooth);
        const env=Math.sin(Math.PI*t/length)**2*(.45+.55*Math.sin(t*31)**2);
        out[i]+=smooth*level*env;
      }
    }
    if(id==='type'){for(let k=0;k<12;k++)knock(k*.043+random()*.016,.12,[1250+random()*900,2350+random()*1400,4400+random()*1500],.15)}
    if(id==='paper'){rustle(0,.32,.3,.38);rustle(.25,.45,.25,.3)}
    if(id==='ink'){rustle(0,.25,.22,.09);knock(.1,.2,[135,255,420],.14)}
    if(id==='wood'||id==='press'){
      const duration=id==='press'?.9:.35;
      for(let k=0;k<9;k++)knock(k*duration/9,.12,[190+k*7,380+k*11,660+k*9],.075);
      rustle(0,duration,.14,.06);
      if(id==='press'){knock(.96,.42,[66,113,181,305],.55);knock(1.19,.25,[125,245,425],.18);rustle(1.27,.35,.15,.32)}
    }
    // Headroom and a short fade at both ends prevent clicks and clipping.
    for(let i=0;i<out.length;i++)out[i]=Math.tanh(out[i])*.7*Math.min(1,i/(rate*.004),(out.length-1-i)/(rate*.018));
    return out;
  }
  let enabled=false,context=null,master=null;
  const voices=new Set,cache=new Map;
  try{enabled=localStorage.getItem(KEY)==='on'}catch{}
  function remember(){try{localStorage.setItem(KEY,enabled?'on':'off')}catch{}}
  async function unlock(){
    if(!enabled)return false;
    try{
      if(!context){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;
        context=new Audio();master=context.createGain();master.gain.value=.45;master.connect(context.destination);
      }
      if(context.state==='suspended')await context.resume();
      return context.state==='running';
    }catch{return false}
  }
  function stop(){for(const source of voices){try{source.stop()}catch{}}voices.clear()}
  async function setEnabled(value){
    enabled=!!value;
    if(!enabled)stop();else if(!await unlock())enabled=false;
    remember();return enabled;
  }
  function play(id){
    if(!enabled||!context||context.state!=='running'||voices.size>=6||!LENGTH[id])return false;
    try{
      let buffer=cache.get(id);
      if(!buffer){const data=samples(id,context.sampleRate,42);buffer=context.createBuffer(1,data.length,context.sampleRate);buffer.getChannelData(0).set(data);cache.set(id,buffer)}
      const source=context.createBufferSource();source.buffer=buffer;source.connect(master);voices.add(source);
      source.onended=()=>{voices.delete(source);source.disconnect()};source.start();return true;
    }catch{return false}
  }
  window.UPPDRAG_SOUND={samples,play,unlock,setEnabled,stop,get enabled(){return enabled}};
  // Only a deliberate gesture can unlock audio, including on Safari/iOS.
  document.addEventListener?.('pointerdown',()=>{void unlock()},{passive:true});
  document.addEventListener?.('keydown',()=>{void unlock()});
  document.addEventListener?.('visibilitychange',()=>{if(document.hidden)stop()});
})();
