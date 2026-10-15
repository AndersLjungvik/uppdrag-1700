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
let checks=0;
const test=(name,fn)=>{fn();checks++;process.stdout.write(`PASS ${name}\n`)};
const context=vm.createContext({window:{__ADVENTURE_TEST__:true},console,Date,Math,JSON,Object,Array,Set,Map,Number,String});
vm.runInContext(fs.readFileSync(path.join(root,'dist/practice.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'dist/curriculum.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'dist/game.js'),'utf8'),context);
const e=context.window.__adventure;

test('Seven jobs contain 81 unique knowledge steps in a valid bank',()=>{
  assert.equal(e.data.missions.length,7);assert.equal(e.allCards().length,81);
  assert.equal(new Set(e.allCards().map(q=>q.id)).size,81);assert.equal(e.validBank(e.data),true);
});
test('Every model answer passes and every distractor fails',()=>{
  for(const q of e.allCards().filter(q=>q.type==='short')){assert(e.gradeShort(q,q.answer),q.id);for(const d of (q.distractors||["Vet inte","Inget av detta"]))assert(!e.gradeShort(q,d),`${q.id}: ${d}`)}
});
test('Spelling tolerance accepts case, accents and one small typo',()=>{
  const era=e.allCards().find(q=>q.id==='power-era');assert(e.gradeShort(era,'FRIHETSTIDEN'));assert(e.gradeShort(era,'frihetstiden.'));assert(e.gradeShort(era,'frihetstden'));
  assert(e.gradeShort(e.allCards().find(q=>q.id==='nature-language'),'latin'));
});
test('Wrong dates, negations and unrelated phrases are rejected',()=>{
  const year=e.allCards().find(q=>q.id==='press-year');assert(!e.gradeShort(year,'1767'));assert(!e.gradeShort(year,'inte 1766'));
  assert(!e.gradeShort(e.allCards().find(q=>q.id==='power-parliament'),'kungen och riksdagen och allt annat'));
});
test('Starting a job costs food and moves the day forward',()=>{
  e.setState(e.blankState());const r=e.logicBeginJob('nature');assert(r.ok);assert.equal(e.state.food,1);assert.equal(e.state.time,1);assert.equal(e.state.working.missionId,'nature');assert.equal(e.state.working.ids.length,4);
});
test('A complete knowledge job pays once and grants its story item',()=>{
  const m=e.mission('nature');while(e.state.working){const q=e.workQuestion();const answer=q.type==='short'?q.answer:q.steps.map(s=>s.answer);const r=e.logicAnswer(q,answer,q.type==='chain');assert(r.correct)}
  assert(e.state.completed.includes('nature'));assert.equal(e.state.coins,4);assert.equal(e.state.inventory.nature,1);assert.equal(e.state.working,null);
  assert.equal(e.logicCompleteJob('nature'),false);assert.equal(e.state.coins,4);
});
test('The first successful job funds bread and eating restores three food',()=>{
  assert(e.logicBuyBread().ok);assert.equal(e.state.coins,1);assert.equal(e.state.inventory.bread,1);assert(e.state.breadBought);
  assert(e.logicEatBread().ok);assert.equal(e.state.food,4);assert(!e.state.inventory.bread);assert(e.state.breadEaten);
});
test('One wrong answer locks that employer without exposing a correct answer',()=>{
  e.setState(e.blankState());e.logicBeginJob('press');const q=e.workQuestion(),r=e.logicAnswer(q,'något helt fel');
  assert.equal(r.correct,false);assert(e.state.failedToday.includes('press'));assert(e.state.gaps.includes(q.id));assert.equal(e.state.working,null);assert.equal(e.state.coins,0);
});
test('Two failed jobs with no money trigger the collapse condition',()=>{
  e.logicBeginJob('power');const q=e.workQuestion(),r=e.logicAnswer(q,'fel');assert.equal(e.state.food,0);assert.equal(r.collapsed,true);
});
test('A new day clears locks but preserves completed work and gaps',()=>{
  const gaps=[...e.state.gaps];e.logicNewDay({collapsed:true});assert.equal(e.state.day,2);assert.equal(e.state.food,2);assert.equal(e.state.failedToday.length,0);assert.equal(JSON.stringify(e.state.gaps),JSON.stringify(gaps));
});
test('All seven jobs can be solved; total pay is 45 daler and seven seals',()=>{
  const s=e.blankState();s.maxFood=20;s.food=20;e.setState(s);e.logicChapter(2,{unlock:true});e.state.maxFood=20;e.state.food=20;
  for(const m of e.data.missions){e.state.time=0;e.state.food=20;assert(e.logicBeginJob(m.id).ok);while(e.state.working){const q=e.workQuestion();const answer=q.type==='short'?q.answer:q.steps.map(step=>step.answer);const r=e.logicAnswer(q,answer,q.type==='chain');assert(r.correct)}}
  assert.equal(e.state.completed.length,7);assert.equal(e.state.coins,45);assert.equal(Object.keys(e.state.inventory).length,7);
});
test('State reload preserves the adventure without accepting invalid locations',()=>{
  const saved=JSON.parse(JSON.stringify(e.state));saved.scene='the-moon';const loaded=e.loadState(saved);assert.equal(loaded.scene,'square');assert.equal(loaded.completed.length,7);assert.equal(loaded.coins,45);
});
test('Harbor completion survives reload and never uses native form submission',()=>{
  const s=e.blankState();s.started=true;s.scene='harbor';s.food=5;e.setState(s);assert(e.logicBeginJob('trade').ok);
  while(e.state.working){const q=e.workQuestion();const answer=q.type==='short'?q.answer:q.steps.map(step=>step.answer);assert(e.logicAnswer(q,answer,q.type==='chain').correct)}
  const loaded=e.loadState(JSON.parse(JSON.stringify(e.state)));assert(loaded.started);assert.equal(loaded.scene,'harbor');assert(loaded.completed.includes('trade'));assert.equal(loaded.coins,8);
  const source=fs.readFileSync(path.join(root,'dist/game.js'),'utf8');assert(!source.includes('<form id="chainJob"'));assert(source.includes('id="submitChainAnswer"'));assert(source.includes('type="button"'));
});
test('CSV contains Swedish text and blocks spreadsheet formula injection',()=>{
  const csv=e.reportCSV();assert(csv.startsWith('\uFEFF'));assert(csv.includes('Fråga'));assert(e.csvCell('=HYPERLINK("url")').startsWith('"\''));assert(e.csvCell('@SUM(1)').startsWith('"\''));
});

const sceneIds=['square','garden','farm','print','coffee','riksdag','harbor','palace','opera','colony'];
const montage=createCanvas(1280*2,720*5),mctx=montage.getContext('2d');
for(const [i,id] of sceneIds.entries()){const c=createCanvas(1280,720),ctx=c.getContext('2d');e.renderScene(ctx,id,e.blankState(),2400);mctx.drawImage(c,(i%2)*1280,Math.floor(i/2)*720)}
fs.mkdirSync(path.join(root,'qa'),{recursive:true});fs.writeFileSync(path.join(root,'qa/adventure-scenes.png'),montage.toBuffer('image/png'));
test('All ten scene renderers produce a substantial montage',()=>assert(fs.statSync(path.join(root,'qa/adventure-scenes.png')).size>50000));

const index=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
test('The interface exposes verbs, inventory, dialogue, resources and map access',()=>{
  for(const id of['scene','hotspotLayer','hero','verbs','inventory','dialogue','foodValue','coinValue','timeValue','mapBtn'])assert(index.includes(`id="${id}"`),id);
  for(const verb of['look','talk','take','use'])assert(index.includes(`data-verb="${verb}"`),verb);
});
const offline=fs.readFileSync(path.join(root,'dist/uppdrag-1700.html'),'utf8');
test('Standalone pupil file embeds CSS and scripts',()=>{
  assert(!/<script\s+src=/.test(offline));assert(!/href="style.css"/.test(offline));
  const scripts=[...offline.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,5);for(const script of scripts)new vm.Script(script[1]);assert(offline.includes('window.CUSTOM_BANK=null;'));assert(offline.includes('window.UPPDRAG_SOUND='));
});

test('Question attempts record real review times and due dates',()=>{
  e.setState(e.blankState());e.logicBeginJob('trade');const q=e.workQuestion();e.logicAnswer(q,q.answer,false);const review=e.state.practice[q.id];assert(review.lastReviewedAt>0);assert(review.nextDueAt>review.lastReviewedAt);
});

process.stdout.write(`\n${checks} checks passed. Montage: qa/adventure-scenes.png\n`);

