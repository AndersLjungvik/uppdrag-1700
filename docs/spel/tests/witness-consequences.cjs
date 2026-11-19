'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const source=read('event-engine.js');
function fixture(chapter,state,balance=5){
 const memory=new Map(),pilot={state:{daler:balance,apples:1,record:[{answer:'sparat svar'}],earned:{kept:true}},persist(){memory.set('pilot',JSON.stringify(this.state));},refresh(){}};
 state={history:[],witness:'unseen',distance:2000,...copy(state)};
 let nearby=true;const lines=[],travel=[];
 const c={chapter,state,teacher:false,interruptedChase:false,getPilot:()=>pilot,save(){memory.set('events',JSON.stringify(state));},
  record(kind,value){state.history.push({kind,value});memory.set('events',JSON.stringify(state));},display:(title,html,items=[])=>lines.push({title,html,items}),
  allowed:()=>true,nearActor:()=>nearby,walkToEvent:kind=>{travel.push(kind);return true;},shout(){},
  callout:{hidden:false},calloutTail:{setAttribute(){}},chaseButton:{hidden:false},chaseFollowing:false,
  approach:{snapshot:()=>({phase:'fleeing'}),depart(){}},document:{body:{dataset:{}},querySelector:()=>null}};
 c.window=c;vm.createContext(c);vm.runInContext(read('event-recurrence.js'),c);
 // Execute the actual accounting, chase result and witness functions together.
 vm.runInContext(source.slice(source.indexOf('function wallet(){'),source.indexOf('function candidates(){')),c);
 vm.runInContext(source.slice(source.indexOf('function showWitness(){'),source.indexOf('function journalStatus(){'))+'\nwindow.testRecurrence=recurrence;',c);
 return {c,state,pilot,memory,lines,travel,far:()=>nearby=false};
}
for(const chapter of [1,2,3,4,5,7,9,10]){
 const h=fixture(chapter,{thief:'chasing',stolenAmount:6,stolenDaler:true});
 const kept=copy({apples:h.pilot.state.apples,record:h.pilot.state.record,earned:h.pilot.state.earned});
 assert.equal(h.c.finishThief(false),0);assert.equal(h.state.thief,'lost');assert.equal(h.pilot.state.daler,5);assert.equal(h.c.testRecurrence.unclaimed,6);
 h.c.showWitness();assert(h.lines.at(-1).items.some(([id,label])=>id==='kind'&&label==='En tjuv tog mina pengar.'));
 h.c.witnessAnswer('harsh');assert.equal(h.state.witness,'cold');h.c.showWitness();h.c.witnessAnswer('kind');
 assert.equal(h.state.witness,'heard');assert.equal(h.pilot.state.daler,5,'a friendly answer cannot reverse the loss');
 for(let i=0;i<5;i++){h.c.showWitness();h.c.witnessAnswer('kind');}
 assert.equal(h.pilot.state.daler,5);assert.equal(h.c.testRecurrence.unclaimed,6,'loss records are retained without being paid out');
 assert.equal(h.state.recurrence.earned,false,'the conversation is not new income');
 assert(!h.lines.some(l=>/hittade|Varsågod|mina \d+ daler/.test(l.html)),'no invented purse recovery');
 assert.deepEqual(copy({apples:h.pilot.state.apples,record:h.pilot.state.record,earned:h.pilot.state.earned}),kept);
 const reload=fixture(chapter,h.state,5);reload.c.showWitness();reload.c.witnessAnswer('kind');assert.equal(reload.pilot.state.daler,5);assert.equal(reload.c.testRecurrence.unclaimed,6);
 const won=fixture(chapter,{thief:'chasing',stolenAmount:6,stolenDaler:true});
 assert.equal(won.c.finishThief(true),6);assert.equal(won.pilot.state.daler,11);assert.equal(won.state.thief,'won');
 assert.equal(won.c.finishThief(true),0);assert.equal(won.pilot.state.daler,11,'successful pursuit refunds exactly once');
 won.c.showWitness();won.c.witnessAnswer('kind');assert.equal(won.pilot.state.daler,11);assert.equal(won.c.testRecurrence.unclaimed,0);
 const far=fixture(chapter,{thief:'lost'});far.far();far.c.showWitness();far.c.witnessAnswer('kind');
 assert.deepEqual(far.travel,['witness']);assert.equal(far.lines.length,0,'no remote witness conversation');assert.equal(far.pilot.state.daler,5);
 console.log('PASS witness chapter '+chapter+': failed chase keeps loss, cold/friendly/repeated/reloaded conversations never refund, successful chase refunds once, physical presence and saved learning preserved');
}
{
 const old=fixture(3,{thief:'lost',stolenDaler:true,stolenAmount:1,recurrence:{v:1,unclaimed:2,wallet:12,rest:12000,earned:false,encounters:2}},12);
 assert.equal(old.c.testRecurrence.unclaimed,3);old.c.showWitness();old.c.witnessAnswer('kind');assert.equal(old.pilot.state.daler,12,'old queued coins are not paid by the child');
 const reloaded=fixture(3,old.state,12);reloaded.c.showWitness();reloaded.c.witnessAnswer('kind');assert.equal(reloaded.pilot.state.daler,12);assert.equal(reloaded.c.testRecurrence.unclaimed,3);
 const alreadyPaid=fixture(3,{thief:'lost',witness:'recovered'},13);alreadyPaid.c.showWitness();assert.equal(alreadyPaid.pilot.state.daler,13,'previous real refunds are not revoked');assert.match(alreadyPaid.lines.at(-1).html,/Hej igen/);
 console.log('PASS legacy pending losses and previously refunded saves: no new payout, no rollback or duplicate migration');
}
