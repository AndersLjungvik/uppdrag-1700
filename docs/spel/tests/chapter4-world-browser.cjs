const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('world');let f;
 const bookKey='uppdrag1700.ch4-cajsa-cookbook.20261020.v1';
 const resources=()=>f.evaluate(()=>({daler:UPPDRAG_CH4_PILOT.state.daler,apples:UPPDRAG_CH4_PILOT.state.apples,m:localStorage.getItem('uppdrag1700.mastery.v1.ch4')}));
 try{
  await h.page.addInitScript(scope=>{
   if(window===top&&!localStorage.getItem(scope+'uppdrag1700.side-adventures.v1')){
    localStorage.setItem(scope+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{4:{wagon:'need-smith',thief:'won',thiefSeen:true,witness:'heard',history:[]}}}));
    localStorage.setItem(scope+'uppdrag1700.ch2-window-bed.v1',JSON.stringify({v:1,phase:'delivered',pattern:'sail'}));
    localStorage.setItem(scope+'uppdrag1700.ch3-courtyard.v1',JSON.stringify({v:1,phase:'open',layout:{a:'wall',b:'corner'}}));
   }
  },h.scope);
  await h.boot();f=h.frame;const before=await resources();
  const earlier=await f.evaluate(()=>[localStorage.getItem('uppdrag1700.ch2-window-bed.v1'),localStorage.getItem('uppdrag1700.ch3-courtyard.v1')]);
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openWagon()),false);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openSmith()),false);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SCENES.openRoom('homes')),false);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.accept('take')),false);
  await h.room('homes');await h.greet();assert.match(await f.locator('.ad-utterance').innerText(),/Du igen/);await h.speechClose();
  await h.room('print');await f.locator('#ch4BookAction').waitFor({state:'visible'});await h.page.waitForTimeout(1000);assert.equal(await f.locator('#adventureDialog').isHidden(),true,'a room greeting cannot hijack the book interaction');
  const onTable=await f.locator('#ch4BookAction').boundingBox(),room=await f.locator('#interiorCanvas').boundingBox();assert(onTable.x>room.x&&onTable.y>room.y&&onTable.y+onTable.height<room.y+room.height);
  await f.locator('#ch4BookAction').click();assert.match(await f.locator('#ch4TimeCard').innerText(),/1755/);await h.choose('take');await h.speechClose();
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.phase),'carrying');assert.equal(await f.locator('#ch4BookAction').isHidden(),true);
  assert.deepEqual(await resources(),before);await h.boot();f=h.frame;assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.hasBook),true);
  await h.room('science');assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.accept('deliver')),false);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SCENES.openCookbook()),false);
  await f.evaluate(()=>UPPDRAG_CH4_PILOT.enterMemory('research'));assert.equal(await f.locator('#ch1CutPaperScene').getAttribute('data-place'),'science');assert.equal(await f.locator('#ch1Modal').evaluate(e=>e.classList.contains('ch1MemoryFull')),true);
  fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ch4-science-work.png')});
  await f.evaluate(()=>UPPDRAG_CH4_PILOT.close());
  // Merely opening a test has no knowledge stamp or reward.
  const begun=await resources();assert.equal(begun.daler,before.daler);assert.equal(begun.apples,before.apples);assert.equal(await f.evaluate(()=>UPPDRAG_MASTERY.summary().done),0);
  await h.room('homes');await h.greet();await h.choose('deliver');await h.speechClose();assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.phase),'delivered');assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.accept('deliver')),false);
  await h.page.screenshot({path:path.join(h.root,'qa/ch4-home-before-meal.png')});
  assert.deepEqual(await resources(),begun);
  // Preparation needs a real street errand; clicking twice in the home is insufficient.
  await h.greet();await h.speechClose();assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.party),false);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SCENES.travel('print')),true);await f.waitForFunction(()=>interior?.kind==='print',undefined,{timeout:45000});
  assert(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.snapshot().walked>=300));assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.party),false);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SCENES.travel('homes')),true);await f.waitForFunction(()=>interior?.kind==='homes'&&UPPDRAG_CH4_SIDEQUEST.party,undefined,{timeout:45000});
  await h.greet();assert.match(await f.locator('.ad-utterance').innerText(),/Kom och sitt/);await h.speechClose();
  await h.page.screenshot({path:path.join(h.root,'qa/ch4-neighbour-meal.png')});assert.deepEqual(await resources(),begun);
  await h.boot();f=h.frame;assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.phase),'feast');
  // Export/import keeps the delivery and earlier chapters in the same pupil round.
  await h.page.locator('#menuButton').click();await h.page.getByText('Sparning och version',{exact:true}).click();
  const download=h.page.waitForEvent('download');await h.page.locator('#exportSave').click();const file=path.join(h.root,'qa/ch4-round.json');await(await download).saveAs(file);
  const saved=JSON.parse(fs.readFileSync(file,'utf8'));assert.equal(JSON.parse(saved.entries[bookKey]).phase,'feast');
  await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.reset());h.page.once('dialog',d=>d.accept());await h.page.locator('#saveFile').setInputFiles(file);await h.page.locator('#menu').waitFor({state:'hidden'});await h.boot();f=h.frame;
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SIDEQUEST.phase),'feast');assert.deepEqual(await resources(),begun);
  assert.deepEqual(await f.evaluate(()=>[localStorage.getItem('uppdrag1700.ch2-window-bed.v1'),localStorage.getItem('uppdrag1700.ch3-courtyard.v1')]),earlier);
  await h.page.setViewportSize({width:390,height:844});await h.page.emulateMedia({reducedMotion:'reduce'});await h.room('barnhus');
  await f.locator('#ch4CajsaVisitor').focus();await f.locator('#ch4CajsaVisitor').press('Enter');assert.match(await f.locator('#ch4TimeCard').innerText(),/1755/);assert.equal(await f.locator('#adventureDialog button').count(),0);
  assert.equal(await f.evaluate(()=>{const geo=UPPDRAG_MEETINGS.geometryForRoom(),p=geo.visitorPose,s=stage.getBoundingClientRect(),b=document.getElementById('adventureDialog').getBoundingClientRect(),x=s.left+geo.left+geo.p.x+p[0]*geo.p.scale,y=s.top+geo.top+geo.p.y+(p[1]-305*p[2])*geo.p.scale;return x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom;}),false,'the paper bubble leaves Cajsa’s head visible on mobile');
  assert.equal(await f.locator('#adventureDialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true);await h.page.screenshot({path:path.join(h.root,'qa/ch4-cajsa-mobile.png')});await h.speechClose();
  // Portraits require proximity, and their dates are outside the spoken bubble.
  await f.evaluate(()=>{leaveInterior();UPPDRAG_CH4_PILOT.close();UPPDRAG_CH4_CITY_LIFE.suspend();path=[];draw();});
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_CITY_LIFE.open(UPPDRAG_CH4_CITY_LIFE.find(region,'celsius'))),false);
  assert.equal(await f.evaluate(()=>{const a=UPPDRAG_CH4_CITY_LIFE.find(region,'celsius');player={x:a.x-50,y:a.y};camera={...player};draw();return UPPDRAG_CH4_CITY_LIFE.open(a);}),true);
  assert.match(await f.locator('#ch4StreetTime').innerText(),/Återblick.*1740/);assert.doesNotMatch(await f.locator('.ch3Words').innerText(),/1740|dramatiserat/);await f.locator('#ch3StreetDialogue').press('Escape');assert.equal(await f.locator('#ch4StreetTime').isHidden(),true);
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 4 world: on-site book object and delivery, real errand and visible feast, natural shared bubbles, painted science workspace, separate stamps/resources, reload/export/import, earlier quilt/courtyard, mobile Cajsa and dated nearby portraits');
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await f.evaluate(()=>({room:interior?.kind,book:UPPDRAG_CH4_SIDEQUEST?.snapshot(),events:UPPDRAG_EVENT_ENGINE?.state})).catch(e=>e.message));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
