'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),{fixture}=require('./mastery-apple-retry.cjs');
const variants={riksdagen:'riksdgaen',kungen:'kugnen',adeln:'adlen',hustru:'husstru',föräldralösa:'föräldralössa',fattiga:'fattiiga',arbeta:'arbetta',barnhus:'barnhuss',vägrade:'vägrde',skjuta:'skjutta',bönderna:'böndrena',förlorade:'fölorade',straffarbete:'straffabete',prästen:'presten',katekesen:'katekessen',tryckfrihet:'tryckfrighet',offentlighetsprincipen:'offentlighetsprinsipen',temperatur:'tempratur',Celsius:'Celcius',Scheele:'Schele',potatis:'pottatis',brännvin:'bränvin'};
for(const ch of [1,2,3,4]){
 const h=fixture(ch,new Map(),4,{selfPractice:true}),A=h.c.UPPDRAG_RECALL_ASSESS,E=h.c.UPPDRAG_RECALL_ENGINE;let checked=0;
 for(const t of h.c.UPPDRAG_RECALL_BANK.filter(t=>t.chapter===ch&&!t.reviewOnly)){
  const samples=t.fields.map(f=>f.sample),baseline=A.assess(t,samples,E.checkField);if(baseline.status!=='sufficient')continue;
  for(const [word,typo]of Object.entries(variants)){
   const changed=samples.map(v=>String(v).replace(new RegExp('(?<![a-zåäö])'+word+'(?![a-zåäö])','g'),typo));if(JSON.stringify(changed)===JSON.stringify(samples))continue;
   const before=JSON.stringify(changed);assert.equal(A.assess(t,changed,E.checkField).status,'sufficient',t.id+' tolerates '+typo);assert.equal(JSON.stringify(changed),before,'the saved wording remains untouched');checked++;
  }
 }
 assert(checked>0,'spelling coverage in chapter '+ch);console.log('PASS chapter '+ch+': '+checked+' real-task spelling variants, including material-specific rules');
}
{
 const h=fixture(1,new Map(),4,{selfPractice:true}),A=h.c.UPPDRAG_RECALL_ASSESS,E=h.c.UPPDRAG_RECALL_ENGINE,t=E.byId.get('rc1-power-1');
 for(const answer of ['Mindre makt fick kungen och mer makt fick riksdagen.','Mer makt fick riksdgaen. Mindre makt fick kugnen.'])assert.equal(A.assess(t,[answer],E.checkField).status,'sufficient',answer);
 for(const answer of ['Mer makt fick kungen. Mindre makt fick riksdagen.','Mer makt fick inte riksdagen. Mindre makt fick kungen.'])assert.notEqual(A.assess(t,[answer],E.checkField).status,'sufficient','reordering cannot reverse or delete the relationship');
}
{
 const h=fixture(4,new Map(),4,{selfPractice:true}),A=h.c.UPPDRAG_RECALL_ASSESS,E=h.c.UPPDRAG_RECALL_ENGINE,t=E.byId.get('rc4-researchers-2'),drafts=t.fields.map(f=>f.sample);
 drafts[0]='Växter och djur klassificerade Linné i grupper och använde latin. En skala för temperatur utvecklade Celcius. Syre upptäckte Schele.';
 const original=JSON.stringify(drafts);assert.equal(A.assess(t,drafts,E.checkField).status,'sufficient');assert.equal(JSON.stringify(drafts),original);
 drafts[0]='Växter och djur klassificerade Scheele. En skala för temperatur utvecklade Linné. Syre upptäckte Celsius.';assert.notEqual(A.assess(t,drafts,E.checkField).status,'sufficient','the same words with the wrong scientist remain incorrect');
 const L=h.c.UPPDRAG_PROMPT_ALIGNMENT;for(const text of ['1743 1734 1719','inte aldrig ingen ej','Karl Carl Adolf Fredrik Fredrika','Kina Kinna te det'])assert.equal(L.language(text),text,'dates, negations and ambiguous short names are never silently corrected');
}
console.log('PASS shared clause order: actor/fact connections and negations retained; reversed power and swapped scientists never pass');
// Execute the real parent readiness callback against the actual assessment
// engine, so a language-version change cannot leave the game at “loading”.
const integration=fs.readFileSync(path.join(__dirname,'../integration.js'),'utf8');
const callback=integration.slice(integration.indexOf('window.integratedReady='),integration.indexOf('function updateMenu(){'));
for(const chapter of [1,2,3,4]){
 const {c}=fixture(chapter,new Map(),4,{selfPractice:true}),nodes=new Map();
 Object.assign(c,{serial:1,ready:false,teacher:false,lessonLimit:4,selfPractice:true,replayId:'',chapterTest:0,URL,history:{replaceState(){}},write(){},updateMenu(){},showError(message){throw Error(message);},$:id=>{if(!nodes.has(id))nodes.set(id,{});return nodes.get(id);}});
 c.document.baseURI='https://example.test/spel-test/?only=4';c.frame={contentWindow:c,hidden:true,focus(){}};
 vm.runInContext(callback,c);c.integratedReady(1,chapter);assert(c.ready);assert.equal(c.frame.hidden,false);assert.equal(nodes.get('intro').hidden,true);assert(nodes.get('status').textContent.includes('Självträning'));
 c.UPPDRAG_FRAGTEST_VERSION='wrong';assert.throws(()=>c.integratedReady(1,chapter),/frågedelen/);
}
console.log('PASS actual parent readiness: assessment version 3.2 is accepted in chapters 1–4, wrong versions still rejected');
