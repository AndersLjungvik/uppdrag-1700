const {launch,assert,fs,path}=require('./chapter3-test-utils.cjs');
(async()=>{
 const h=await launch('courtyard');let f;
 const key='uppdrag1700.ch3-courtyard.v1',bed='uppdrag1700.ch2-window-bed.v1';
 const resources=()=>f.evaluate(()=>({daler:UPPDRAG_CH3_PILOT.state.daler,apples:UPPDRAG_CH3_PILOT.state.apples,m:localStorage.getItem('uppdrag1700.mastery.v1.ch3'),wagon:UPPDRAG_EVENT_ENGINE.state.wagon}));
 async function setBarrel(id,slot){await f.locator('[data-court="'+id+'"]').click();await f.locator('[data-slot="'+slot+'"]').click();}
 try{
  await h.boot();f=h.frame;
  await f.evaluate(()=>{UPPDRAG_CH3_PILOT.state.daler=7;UPPDRAG_CH3_PILOT.state.apples=2;UPPDRAG_CH3_PILOT.persist();});
  for(const [iteration,layout]of [{a:'wall',b:'east'},{a:'east',b:'corner'}].entries()){
   if(iteration){await f.evaluate(({key,bed})=>{localStorage.removeItem(key);localStorage.setItem(bed,JSON.stringify({v:1,phase:'delivered',pattern:'sail',layout:{wide:{x:300,y:140}}}));},{key,bed});await h.boot();f=h.frame;await h.page.emulateMedia({reducedMotion:'reduce'});}
   const before=await resources();await h.room('courtyard');await h.greet();
   assert.match(await f.locator('.ad-utterance').innerText(),iteration?/barnets täcke/:/Vad vill du/);
   assert.equal(await f.locator('#adventureDialog [data-adventure]').count(),0);
   if(!iteration){await h.choose('later');assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.phase),'available');await h.greet();}
   await h.choose('talk');assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.phase),'talked');
   if(!iteration){await h.choose('later');await h.boot();f=h.frame;await h.room('courtyard');await h.greet();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.phase),'talked');}
   await h.choose('agree');assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.phase),'agreed');
   await h.choose('arrange');await f.locator('#ch3CourtyardControls').waitFor({state:'visible'});assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.phase),'arranging');
   await f.locator('[data-slot="path"]').click();assert.equal(await f.locator('[data-court="b"]').getAttribute('aria-pressed'),'true','the actual painted barrel can be selected');
   assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.selectArea('war','learner')),false,'puzzle and study cannot overlap');
   await f.locator('[data-court="check"]').click();assert.match(await f.locator('#ch3CourtMessage').innerText(),/dörren|gången|bänken/);
   await setBarrel('a',layout.a);
   if(!iteration){
    await f.locator('[data-court="a"]').press('Escape');assert.equal(await f.evaluate(()=>interior?.kind),'courtyard');assert.equal(await f.locator('#ch3CourtyardControls').count(),0);
    await h.greet();await f.locator('#leaveRoom').click();await f.waitForFunction(()=>!interior&&!document.querySelector('#ch3CourtyardControls'));
    await h.boot();f=h.frame;await h.room('courtyard');await h.greet();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.layout.a),layout.a);
   }else{
    await h.page.setViewportSize({width:390,height:844});await f.evaluate(()=>draw());
    assert.equal(await f.locator('#ch3CourtyardControls').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
    await h.page.screenshot({path:path.join(h.root,'qa/ch3-courtyard-mobile.png')});
   }
   await setBarrel('b',layout.b);
   if(iteration)await f.locator('[data-court="check"]').press('Enter');else await f.locator('[data-court="check"]').click();
   assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.phase),'open');assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.layout),layout);await h.speechClose();
   assert.deepEqual(await resources(),before,'courtyard changes neither resources nor knowledge');
   await h.page.setViewportSize({width:1200,height:850});await h.page.screenshot({path:path.join(h.root,'qa/ch3-courtyard-open-'+iteration+'.png')});
   await h.boot();f=h.frame;await h.room('courtyard');assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.phase),'open');await h.greet();assert.match(await f.locator('.ad-utterance').innerText(),/gården han lämnat/);await h.speechClose();await h.greet();assert.doesNotMatch(await f.locator('.ad-utterance').innerText(),/gården han lämnat/);await h.speechClose();
   if(!iteration){
    await h.page.locator('#menuButton').click();await h.page.locator('summary').filter({hasText:'Sparning och version'}).click();const [download]=await Promise.all([h.page.waitForEvent('download'),h.page.locator('#exportSave').click()]);const file=await download.path(),data=JSON.parse(fs.readFileSync(file));assert.equal(JSON.parse(data.entries[key]).phase,'open');await h.page.locator('#closeMenu').click();
    await f.evaluate(k=>localStorage.removeItem(k),key);await h.boot();f=h.frame;assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.phase),'available');await h.page.locator('#menuButton').click();h.page.once('dialog',d=>d.accept());await Promise.all([h.page.waitForEvent('domcontentloaded'),h.page.locator('#saveFile').setInputFiles(file)]);f=await(await h.page.waitForSelector('#game')).contentFrame();await f.waitForFunction(()=>window.UPPDRAG_CH3_SCENES?.courtyard.phase==='open');h.frame=f;assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH3_SCENES.courtyard.layout),layout);
   }
   console.log('PASS courtyard solution',iteration+1);
  }
  assert.deepEqual(h.errors,[]);console.log('PASS courtyard: optional decline, real quilt continuity, saved negotiation and arrangement, free retries, two persistent layouts, short revisits, no resource/stamp changes, export/import, keyboard, mobile and reduced motion');
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await f.evaluate(()=>({court:UPPDRAG_CH3_SCENES?.courtyard,room:interior?.kind})).catch(e=>e.message));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
