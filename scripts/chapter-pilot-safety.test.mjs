// Pupil-facing safety and continuity guard for the chapter-pilot branches.
// Run with: node --test scripts/chapter-pilot-safety.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';

const base=resolve(dirname(fileURLToPath(import.meta.url)),'../docs/demo3');
const read=name=>readFileSync(resolve(base,name),'utf8');
function content(name,id){
  const window={};
  vm.runInNewContext(read(name),{window},{filename:name,timeout:3000});
  return window[id];
}
const names={cafe:'Maja',print:'Brita',riksdag:'Elin',barnhus:'Siri',church:'Olof',quay:'Jo',archive:'Rut',science:'Sam',farm:'Sigrid',homes:'Karin'};

test('only daler buy memory hooks; only Rut apples buy another attempt',()=>{
  for(let i=1;i<=4;i++){
    const source=read('chapter'+i+'-pilot.js');
    assert.match(source,/if\(currency!=='daler'\|\|s\.daler<1\)/,'Chapter '+i+' missing daler gate');
    assert.match(source,/if\(kind!=='apple'\|\|s\.apples<1\)/,'Chapter '+i+' missing apple gate');
    assert.doesNotMatch(source,/data-action="retry-daler"|data-action="'\+prefix\+'hint-apple"/,'Chapter '+i+' has old currency buttons');
    assert.equal((source.match(/s\.apples\+=1;/g)||[]).length,1,'Chapter '+i+' must award apples only in Rut repetition');
    assert.match(source,/s\.archiveMode='reward';s\.apples\+=1;/,'Chapter '+i+' gives no Rut apple');
  }
});

test('exam provenance and answer-giving word buttons never reach pupil UI',()=>{
  for(let i=1;i<=4;i++){
    const source=read('chapter'+i+'-pilot.js');
    assert.doesNotMatch(source,/Förklara ord|Nytt prov|Lämna minnesprovet|Frågor med alternativ registreras|h\+='<small>(Grundboken|Källa:)/,'Chapter '+i+' leaks assessment material');
  }
  const data=content('chapter4-content.js','UPPDRAG_CH4_CONTENT');
  assert.equal(Object.keys(data.facts).length,17);
  for(const [id,fact] of Object.entries(data.facts)){
    assert.equal(fact.q.length,3,id);
    for(const question of fact.q){
      assert.doesNotMatch(question,/\b(provfrågor?|provunderlag|provets|facit|bedömningsstöd)\b/i,id);
      assert.equal(question.toLocaleLowerCase('sv-SE').includes(fact.a.toLocaleLowerCase('sv-SE')),false,id+' reveals its answer');
    }
    assert.doesNotMatch(data.explanations[id].join(' '),/\b(Prov del|Bedömningsstöd|facit|Källa i klassens underlag)\b/i,id+' feedback shows source');
  }
});

test('the original, gender-consistent people stay in their rooms',()=>{
  for(let i=1;i<=4;i++){
    const source=read('meeting-ch'+i+'-pilot.js');
    for(const key of ['cafe','print','riksdag']){
      assert.ok(source.includes(key+":{name:'"+names[key]+"'"),'Chapter '+i+': '+key+' host has changed');
    }
    if(i>=2)assert.ok(source.includes("barnhus:{name:'Siri'"),'Chapter '+i+' replaced Siri');
    assert.doesNotMatch(source,/\b(?:Erik|Lars)\b/,'Chapter '+i+' introduced a conflicting room host');
  }
  for(const n of [3,4]){
    const bank=content('chapter'+n+'-content.js','UPPDRAG_CH'+n+'_CONTENT');
    for(const run of bank.runs){
      assert.equal(run.who,names[run.p],'Chapter '+n+' host mismatch at '+run.p);
    }
  }
  assert.ok(read('meeting-ch4-pilot.js').includes("cajsa:{name:'Cajsa Warg'"));
  assert.ok(read('meeting-ch4-pilot.js').includes('ch4CajsaVisitor'));
});

test('spoken speech remains legible and never underlines on Space focus',()=>{
  for(const n of [3,4]){
    const s=read('chapter'+n+'-street-life.js');
    assert.match(s,/#ch3StreetDialogue:focus-visible \.ch3Words\{text-decoration:none\}/);
    assert.doesNotMatch(s,/#ch3StreetDialogue:focus-visible \.ch3Words\{text-decoration:underline/);
  }
  const paper=read('paper-dialogues.js');
  assert.doesNotMatch(paper,/\.thoughtChoice:focus-visible\{outline:none;text-decoration:underline/);
});

test('the peaceful city restores full animals and independently moving neighbours',()=>{
  const life=read('world-life-ch4.js');
  assert.match(life,/for \(const hen of HENS\)drawHen/);
  assert.match(life,/for \(const dog of dogRoutes\(region\)\)/);
  const street=read('chapter4-street-life.js');
  for(const id of ['linne','celsius','ekeblad','dalarna','elisabet','cook','baker','flyer','child','carrier','sailor','washer','smith','basket']){
    assert.ok(street.includes(id+":{id:'"+id+"'"),'Missing resident '+id);
  }
  assert.ok(read('chapter4-pilot.html').includes('world-life-ch4.js?v=1'));
});

test('the festival remains optional and chapter four imports only existing scripts',()=>{
  const side=read('chapter4-sidequest.js');
  assert.match(side,/phase='delivered'/);
  assert.match(side,/phase='feast'/);
  assert.doesNotMatch(side,/s\.apples\+\+|s\.daler\+\+|UPPDRAG_CH4_PILOT\.state\.[a-z]+\s*=/);
  for(const chapter of [1,2,3,4]){
    const html=read('chapter'+chapter+'-pilot.html');
    for(const [,name] of html.matchAll(/<script[^>]+src="([^"]+)"/g)){
      assert.ok(existsSync(resolve(base,name.split('?')[0])),'Missing '+name+' in chapter '+chapter);
    }
  }
});
