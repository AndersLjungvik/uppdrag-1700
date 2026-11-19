const {launch,assert,fs,path}=require('./chapter5-test-utils.cjs');
(async()=>{
 const h=await launch('travel');let f;
 try{
  await h.boot();f=h.frame;await f.evaluate(()=>{UPPDRAG_CH5_PILOT.state.daler=0;UPPDRAG_CH5_PILOT.persist();});
  await h.room('print');assert.equal(await f.evaluate(()=>UPPDRAG_CH5_SCENES.travel('riksdag')),true);await f.waitForFunction(()=>interior?.kind==='riksdag',undefined,{timeout:45000});
  await h.greet();await h.choose('study');assert.equal(await f.locator('#ch1CutPaperScene').getAttribute('data-place'),'riksdag');await f.evaluate(()=>UPPDRAG_CH5_PILOT.close());
  assert.equal(await f.evaluate(()=>UPPDRAG_CH5_SCENES.travel('quay')),true);await f.waitForFunction(()=>interior?.outdoor&&region.id==='main',undefined,{timeout:45000});
  await h.greet();await h.choose('sail');await f.waitForFunction(()=>!!voyage);await f.locator('#skipVoyage').click();await f.waitForFunction(()=>region.id==='marstrand'&&!voyage);
  assert.equal(await f.evaluate(()=>interior?.outdoor),true);
  await h.greet();assert.match(await f.locator('.ad-utterance').innerText(),/Carlsten/);await h.speechClose();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH5_SCENES.travel('palace')),true);await f.waitForFunction(()=>!!voyage,undefined,{timeout:45000});await f.locator('#skipVoyage').click();await f.waitForFunction(()=>region.id==='main'&&interior?.kind==='palace',undefined,{timeout:45000});
  await h.page.setViewportSize({width:390,height:844});await h.greet();await h.choose('later');await h.greet();
  assert.equal(await f.evaluate(()=>{const s=stage.getBoundingClientRect(),faces=UPPDRAG_SCENE_PRESENCE.sceneGeometry().faces;return ['adventureDialog','adventureReplies'].every(id=>{const e=document.getElementById(id);if(e.hidden)return true;const r=e.getBoundingClientRect(),b={x:r.left-s.left,y:r.top-s.top,w:r.width,h:r.height};return faces.every(f=>Math.max(0,Math.min(b.x+b.w,f.x+f.w)-Math.max(b.x,f.x))*Math.max(0,Math.min(b.y+b.h,f.y+f.h)-Math.max(b.y,f.y))<.1);});}),true,'speech and choice panel leave both faces visible');
  fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ch5-palace-mobile.png')});
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 5 real travel: connected routes to Riksdagshuset, Jo’s sailing choice, Marstrand quay, boat home and onward to Slottet, mobile choices and bubbles clear of both faces');
 }catch(e){console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await f.evaluate(()=>({region:region.id,room:interior?.kind,path:path.length,pending:pendingRoom,voyage:!!voyage,message:document.getElementById('message')?.textContent})).catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
