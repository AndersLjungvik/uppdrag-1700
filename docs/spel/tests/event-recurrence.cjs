const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const sandbox={};vm.runInNewContext(fs.readFileSync(require('path').join(__dirname,'../event-recurrence.js'),'utf8'),sandbox);
const create=(state,balance)=>sandbox.UPPDRAG_EVENT_RECURRENCE.create(state,balance,()=>.5);
let state={thief:'unseen',distance:1600},r=create(state,3);
r.start();r.ownWallet(2);state.thief='lost';r.finish(true,1600);
assert.equal(r.unclaimed,1);r.advance(40000);
assert.equal(r.ready(3000,2),false,'walking and time alone cannot cause a second theft');
// Returning the actual coin is not a new earning opportunity.
assert.equal(r.claim(),true);r.ownWallet(3);r.observe(3);
assert.equal(r.ready(3000,3),false);assert.equal(r.claim(),false,'each lost coin is returned only once');
// Spending, then earning below a previous balance, still permits another visit.
r.observe(1);r.observe(2);assert.equal(r.ready(2100,2),false,'new earnings also require travel');
assert.equal(r.ready(2300,2),true);r.start();r.ownWallet(1);state.thief='chasing';
assert.equal(state.recurrence.earned,false,'one earning does not queue unlimited encounters');
r.observe(2);state.thief='won';r.finish(false,2300);
assert.equal(r.ready(3100,2),false,'a reward earned during the chase still waits for rest');
r.advance(39000);assert.equal(r.ready(3100,2),false);r.advance(1000);assert.equal(r.ready(3100,2),true);
// Reload keeps rest, travel and earnings; one own refund cannot unlock a third visit.
const saved=JSON.parse(JSON.stringify(state));r=create(saved,2);assert.equal(r.ready(3100,2),true);
r.start();state=saved;state.thief='lost';r.finish(true,3100);r.ownWallet(1);r.ownWallet(2);
r.advance(50000);assert.equal(r.ready(5000,2),false);
// Missing older coins survive another round and can be claimed individually.
r.observe(3);assert(r.ready(5000,3));r.start();state.thief='lost';r.finish(true,5000);
assert.equal(r.unclaimed,2);assert(r.claim());assert(r.claim());assert.equal(r.claim(),false);
// Migration preserves the single lost coin in a 2.0.8 save, exactly once.
const legacy={thief:'lost',thiefSeen:true,stolenDaler:true,distance:2000};r=create(legacy,2);
assert.equal(r.unclaimed,1);assert.equal(legacy.stolenDaler,false);r=create(legacy,2);assert.equal(r.unclaimed,1);
assert.equal(r.ready(5000,2),false,'existing money alone does not count as newly earned');
r.reset(2);assert.equal(r.unclaimed,0);assert.equal(r.encounters,0);
console.log('PASS recurring thief: earnings, rest and travel; refunds excluded; pending coins; save migration and reload');
