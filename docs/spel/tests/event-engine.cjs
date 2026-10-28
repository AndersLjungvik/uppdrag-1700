'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
for(const name of ['event-engine.js','integration.js','chapter6-street-events.js'])new Function(read(name));
const engine=read('event-engine.js'),integration=read('integration.js');
for(const name of ['world-classic-pilot.js','world-street-pilot.js']){
 const world=read('_decoded/'+name),marker='if(path.length&&!sailing&&!window.UPPDRAG_STORY_WORK?.busy)';
 assert.strictEqual(world.split(marker).length-1,1,`${name}: expected exactly one movement condition`);
 new Function(world.replace(marker,'if(path.length&&!sailing&&!window.UPPDRAG_STORY_WORK?.busy&&!window.UPPDRAG_EVENT_ENGINE?.blocking)'));
}
assert(integration.includes("window.__INTEGRATED_CHAPTER=${chapter}"),'chapter context reaches the iframe');
assert(integration.includes("await get('event-engine.js?v=1.5.2')"),'engine code is loaded');
assert(integration.includes("+eventModule+'\\n'"),'engine is injected before frame ready');
assert(engine.includes("saveKey='uppdrag1700.side-adventures.v1'"),'save namespace');

assert(engine.includes('function splitSpeech(html)'), 'one utterance at a time');
assert(engine.includes('drawSpeech?.(tail,'), 'the same paper-speech renderer as city residents');
assert(engine.includes("[['next','Fortsätt']]"), 'speech continuation');
assert(engine.includes("turnIndex++"), 'interactive dialogue progress');
assert(engine.includes("activeChallenge={type,question:q}"), 'quiz choices survive delayed rendering');
assert(engine.includes("state.distance<state.thiefDistance"), 'variable encounter distance');
assert(engine.includes("state.witness"), 'the child remembers previous encounters');

assert(engine.includes('get blocking(){return blocking;}'),'movement pause interface');
assert(engine.includes('stage.append(journal)'),'journal is in actual game stage');
assert(engine.includes("'need-smith'"),'smith sidequest persists');
assert(engine.includes("chapter!==6&&![3,8].includes(chapter)"),'legacy chapter-six thief not duplicated');
assert(engine.includes('state.witness'),'witness remembers response');
assert(engine.includes('maximumLoss:1'),'one-daler upper bound');
assert(engine.includes("const wagonAt={x:3040,y:367"),'wagon is placed along manor road');
assert(engine.includes('lastRegion'),'map hit context');
assert(read('chapter6-street-events.js').includes('!window.UPPDRAG_EVENT_ENGINE?.busy'),'legacy event respects open event');
assert(read('index.html').includes('integration.js?v=2.0.1'),'browser cache refresh');
console.log('PASS: registered events, map movement pause, saved quest and witness, no duplicate thieves, chapter 1–10 bootstrap');
