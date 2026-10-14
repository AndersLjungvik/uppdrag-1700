import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../dist/sound.js',import.meta.url),'utf8');
function engine(Audio){
  const store=new Map,events=new Map;
  const context=vm.createContext({window:{AudioContext:Audio},document:{addEventListener:(name,fn)=>events.set(name,fn)},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)}});
  vm.runInContext(source,context);return{audio:context.window.UPPDRAG_SOUND,store,events,context};
}
test('foley cues are finite, short, distinct and have headroom and faded ends',()=>{
  const {audio}=engine();const signatures=new Set;
  for(const id of ['type','paper','ink','wood','press']){
    const s=audio.samples(id);assert(s.length>1000&&s.length<=44100*2);assert(s.every(Number.isFinite));
    const peak=s.reduce((max,v)=>Math.max(max,v),0);assert(peak>.01&&peak<.7);assert.equal(s[0],0);assert.equal(s[s.length-1],0);
    signatures.add(s.length);assert.deepEqual(audio.samples(id),s);
  }
  assert.equal(signatures.size,5);assert.equal(audio.samples('unknown'),null);
});
test('missing audio support fails quietly and keeps effects disabled',async()=>{
  const {audio,store}=engine();assert.equal(audio.enabled,false);assert.equal(audio.play('press'),false);
  assert.equal(await audio.setEnabled(true),false);assert.equal([...store.values()][0],'off');
});
test('audio starts only by opting in, is bounded, stops on mute and saves the preference',async()=>{
  let created=0;const sources=[];
  class Audio {
    constructor(){created++;this.state='suspended';this.sampleRate=44100;this.destination={}}
    async resume(){this.state='running'}
    createGain(){return{gain:{value:0},connect(){}}}
    createBuffer(channels,length){return{getChannelData:()=>new Float32Array(length)}}
    createBufferSource(){const s={connect(){},disconnect(){},start(){this.started=true},stop(){this.stopped=true;this.onended?.()}};sources.push(s);return s}
  }
  const {audio,store}=engine(Audio);assert.equal(created,0);assert.equal(audio.play('type'),false);
  assert(await audio.setEnabled(true));assert.equal(created,1);assert.equal([...store.values()][0],'on');
  for(let i=0;i<6;i++)assert(audio.play('type'));assert.equal(audio.play('press'),false);
  sources[0].onended();assert(audio.play('press'));await audio.setEnabled(false);
  assert(sources.slice(1).every(s=>s.stopped));assert.equal(audio.play('paper'),false);assert.equal([...store.values()][0],'off');
});
