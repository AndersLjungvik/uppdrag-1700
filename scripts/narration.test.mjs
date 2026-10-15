import test from 'node:test';
import assert from 'node:assert/strict';
import {createNarrator} from '../dist/demo/narration.mjs';

function setup(voices=[{name:'Svenska',lang:'sv-SE',localService:true}]) {
  const utterances=[],events=[],issues=[];
  const synth={voices,cancellations:0,getVoices(){return this.voices},cancel(){this.cancellations++},speak(u){utterances.push(u)}};
  const narrator=createNarrator({synth,Utterance:class{constructor(text){this.text=text}},onState:e=>events.push(e),onIssue:e=>issues.push(e)});
  return {narrator,synth,utterances,events,issues};
}

test('speech is opt-in and requests Swedish without changing the displayed text',()=>{
  const h=setup();
  assert.equal(h.narrator.enabled,false);
  assert.equal(h.narrator.read('Skeppet har kommit hem.','Jo'),false);
  assert.equal(h.utterances.length,0);
  h.narrator.setEnabled(true);
  assert(h.narrator.read('Skeppet har kommit hem.','Jo'));
  const u=h.utterances[0];
  assert.equal(u.text,'Skeppet har kommit hem.');
  assert.equal(u.lang,'sv-SE');
  assert.equal(u.voice.lang,'sv-SE');
  assert.equal(h.narrator.speaking,false,'queued audio does not move mouths');
  u.onstart();
  assert.equal(h.narrator.speaking,true);
  assert.deepEqual(h.events.at(-1),{speaking:true,character:'Jo'});
  u.onend();
  assert.equal(h.narrator.speaking,false);
});

test('a new line cancels the old line and ignores its late start/end/error events',()=>{
  const h=setup();h.narrator.setEnabled(true);
  h.narrator.read('Första repliken.','Jo');const first=h.utterances[0];first.onstart();
  h.narrator.read('Andra repliken.','Maja');const second=h.utterances[1];second.onstart();
  first.onstart();first.onend();first.onerror({error:'network'});
  assert(h.narrator.speaking);
  assert.deepEqual(h.events.at(-1),{speaking:true,character:'Maja'});
  assert.equal(h.issues.length,0);
  second.onend();assert(!h.narrator.speaking);
});

test('turning speech off cancels immediately and cannot be undone by a stale callback',()=>{
  const h=setup();h.narrator.setEnabled(true);h.narrator.read('Lyssna.','Jo');
  const u=h.utterances[0];u.onstart();h.narrator.setEnabled(false);u.onstart();
  assert(!h.narrator.speaking);assert(!h.narrator.enabled);
  assert(!h.narrator.read('Nästa replik.','Jo'));
  assert.equal(h.utterances.length,1);
});

test('stop for navigation or hidden pages cancels audio but retains the listening preference',()=>{
  const h=setup();h.narrator.setEnabled(true);h.narrator.read('Lyssna.','Jo');
  h.utterances[0].onstart();h.narrator.stop();h.utterances[0].onstart();
  assert(!h.narrator.speaking);assert(h.narrator.enabled);
  assert(h.narrator.read('Vad betyder import?'));
  h.utterances[1].onstart();assert.deepEqual(h.events.at(-1),{speaking:true,character:null});
});

test('missing Swedish voices do not silently select an English voice',()=>{
  const h=setup([{name:'English',lang:'en-US'}]);h.narrator.setEnabled(true);
  assert(!h.narrator.read('En svensk fråga.'));
  assert.equal(h.utterances.length,0);assert.deepEqual(h.issues,['no-swedish-voice']);
});

test('voice availability is refreshed after asynchronous browser voice loading',()=>{
  const h=setup([]);h.narrator.setEnabled(true);h.narrator.read('Första försöket.');
  assert.equal(h.utterances[0].lang,'sv-SE');
  h.synth.voices=[{name:'Svenska',lang:'sv_SE',localService:true}];
  h.narrator.read('Försök igen.');assert.equal(h.utterances[1].voice.name,'Svenska');
});

test('unsupported speech and engine failures leave a safe text-only path',()=>{
  const absent=createNarrator();assert(!absent.available);assert(!absent.setEnabled(true));assert(!absent.read('Text.'));
  const h=setup();h.narrator.setEnabled(true);h.synth.speak=()=>{throw Error('unavailable')};
  assert(!h.narrator.read('Text.'));assert(!h.narrator.speaking);assert.deepEqual(h.issues,['speech-error']);
});

test('pause and resume control mouth timing and playback errors are reported',()=>{
  const h=setup();h.narrator.setEnabled(true);h.narrator.read('Text.','Jo');const u=h.utterances[0];
  u.onstart();assert(h.narrator.speaking);u.onpause();assert(!h.narrator.speaking);
  u.onresume();assert(h.narrator.speaking);u.onerror({error:'language-unavailable'});
  assert(!h.narrator.speaking);assert.deepEqual(h.issues,['language-unavailable']);
});
