const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {webcrypto,createHash}=require('node:crypto');
(async()=>{
 const source=fs.readFileSync(path.join(__dirname,'..','teacher-review.js'),'utf8');new Function(source);
 const code='547239',salt=JSON.parse(source.match(/const salt=("[^"]+")/)[1]);
 const digest=createHash('sha256').update(salt+':'+code).digest('hex');
 const context={window:{},crypto:webcrypto,TextEncoder};
 vm.runInNewContext(source.replace(/digest="[a-f0-9]{64}"/,'digest="'+digest+'"'),context);
 const gate=context.window.UPPDRAG_TEACHER_REVIEW;
 for(const invalid of ['',null,undefined,'12345','1234567','000000','Jag är lärare',code+'x'])assert.equal(await gate.verify(invalid),false);
 assert.equal(await gate.verify(code),true);assert.equal(await gate.verify(' '+code+' '),true);
 assert.deepEqual(await Promise.all([gate.verify(code),gate.verify('000000'),gate.verify(code)]),[true,false,true]);
 const unsupported={window:{},crypto:{subtle:{digest:async()=>{throw Error('unsupported');}}},TextEncoder};vm.runInNewContext(source,unsupported);assert.equal(await unsupported.window.UPPDRAG_TEACHER_REVIEW.verify(code),false);
 assert.equal(source.includes('localStorage'),false,'codes are not stored in browser saves');
 console.log('PASS teacher review: salted verification, empty/wrong/malformed code denied, correct fixture accepted, concurrent checks and unavailable crypto fail closed, no code storage');
})().catch(error=>{console.error(error);process.exitCode=1;});
