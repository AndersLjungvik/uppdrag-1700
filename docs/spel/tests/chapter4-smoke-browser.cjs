const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('smoke');try{
  await h.boot();let f=h.frame;
  assert.equal(await f.evaluate(()=>__INTEGRATED_CHAPTER),4);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.scenes.length),13);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.scenes.flatMap(s=>s.f).length),15);
  assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().total),4);
  for(const kind of ['church','print','science','farm','homes','barnhus']){
   await h.room(kind);await h.greet();
   fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ch4-'+kind+'.png')});await h.speechClose();
   console.log('PASS room',kind);
  }
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 4 boot, 15 tasks, four areas, six real meeting places');
 }catch(e){console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
