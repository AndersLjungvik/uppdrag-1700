const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('bookwork');let f;
 const resources=()=>f.evaluate(()=>({daler:UPPDRAG_CH4_PILOT.state.daler,record:UPPDRAG_CH4_PILOT.state.record.length,stamps:UPPDRAG_MASTERY.summary().done}));
 const savedKey='uppdrag1700.ch4-book-writing.v1';
 async function answer(){const t=await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.current);await f.locator('[data-rc-field="0"]').fill(t.fields[0].sample);await f.locator('[data-action="rc-submit"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.ui.phase),'feedback',t.id);await f.locator('[data-action="rc-next"]').click();}
 try{
  await h.boot();f=h.frame;const before=await resources();
  await h.room('church');assert.equal(await f.evaluate(()=>UPPDRAG_CH4_BOOKWORK.open()),false,'writing needs the actual workplace');
  await h.room('science');await h.greet();await h.choose('writing');await f.locator('#ch4Bookwork').waitFor({state:'visible'});
  assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.studyBusy),true);assert.equal(await f.evaluate(()=>UPPDRAG_CH4_SCENES.travel('print')),false);
  assert.equal(await f.locator('#ch4Bookwork textarea').count(),3);assert.equal(await f.locator('.bw-support').count(),0,'retrieve before seeing a model');
  await f.locator('#bw-0').fill('Linné ordnade och namngav växter och djur.');await f.locator('#bw-1').fill('Celsius undersökte temperatur.');await f.locator('#bw-2').fill('Scheele undersökte syre.');
  await f.locator('[data-bw="support"]').click();assert.equal(await f.locator('.bw-support').count(),1);await f.locator('[data-bw="next"]').click();
  assert.match(await f.locator('#ch4Bookwork h2').innerText(),/Bidrag/);assert.equal(await f.locator('#ch4Bookwork textarea').count(),2);
  await f.locator('#bw-0').fill('Linnés namn gör att forskare kan jämföra samma arter.');await f.locator('#bw-1').fill('Celsiusskalan gör temperaturmätningar jämförbara.');
  await f.locator('[data-bw="next"]').click();assert.match(await f.locator('#ch4Bookwork h2').innerText(),/historieböckerna/);await f.locator('#bw-0').fill('Män hade ofta mer tillgång till utbildning och makt.');
  await f.locator('[data-bw="support"]').click();assert.match(await f.locator('.bw-support').innerText(),/flera möjliga/);
  await f.locator('[data-bw="next"]').click();assert.match(await f.locator('#ch4Bookwork h2').innerText(),/Indelning/);assert.equal(await f.locator('[data-bw="next"]').isDisabled(),true);
  assert.deepEqual(await resources(),before,'writing and model comparison never mint money or a stamp');
  await f.locator('#ch4Bookwork').press('Escape');assert.equal(await f.locator('#ch4Bookwork').count(),0);assert.equal(await f.evaluate(()=>roomView.style.visibility!=='hidden'),true);
  await h.boot();f=h.frame;await h.room('science');await h.greet();await h.choose('writing');assert.match(await f.locator('#bw-0').inputValue(),/Linné/);assert.equal(await f.locator('.bw-support').count(),1,'saved comparison survives reload');await f.locator('#ch4Bookwork').press('Escape');
  await h.room('archive');await h.greet();await h.choose('writing');
  for(let i=0;i<4;i++)await f.locator('[data-bw="next"]').click();assert.match(await f.locator('#ch4Bookwork h2').innerText(),/Budkavlen/);await f.locator('#bw-0').fill('Den skickades vidare för att samla bönder. En bevarad budkavle är ett belägg från tiden.');
  for(const title of ['Kvinnors','Barnhus','När fler']){await f.locator('[data-bw="next"]').click();assert.match(await f.locator('#ch4Bookwork h2').innerText(),new RegExp(title));}
  await h.page.setViewportSize({width:390,height:844});await h.page.emulateMedia({reducedMotion:'reduce'});assert.equal(await f.locator('.bw-sheet').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
  await f.locator('#bw-0').fill('Egen läsning gav möjlighet att jämföra vad prästen sade med texten.');await f.locator('#bw-0').press('Enter');assert.equal(await f.locator('#ch4Bookwork').count(),1,'Enter in an answer remains text editing');
  await f.locator('[data-bw="support"]').focus();await f.locator('[data-bw="support"]').press('Enter');assert.equal(await f.locator('.bw-support').count(),1);
  fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ch4-bookwork-mobile.png')});await f.locator('#ch4Bookwork').press('Escape');
  await h.greet();await h.choose('terms');const seen=[];const firstApples=await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.apples);
  for(let round=0;round<4;round++){
   let guard=0;while(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.archiveMode!=='reward')){assert(++guard<5);seen.push(await f.evaluate(()=>UPPDRAG_CH4_PILOT.recall.current.id));await answer();}
   if(round<3)await f.locator('[data-action="rc-rut-again"]').click();
  }
  assert.equal(seen.length,11);assert.equal(new Set(seen).size,11,'the fixed pack covers every test term before repeating');
  assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH4_PILOT.materialReviewProgress()),{done:11,total:11});assert.equal(await f.evaluate(()=>UPPDRAG_CH4_PILOT.state.apples),firstApples+4);
  assert.deepEqual(await resources(),before,'free repetition never alters core stamps or money');await f.locator('[data-action="rc-rut-exit"]').click();
  await h.page.locator('#menuButton').click();await h.page.getByText('Sparning och version',{exact:true}).click();const download=h.page.waitForEvent('download');await h.page.locator('#exportSave').click();const file=path.join(h.root,'qa/ch4-bookwork-round.json');await(await download).saveAs(file);
  const exported=JSON.parse(fs.readFileSync(file,'utf8'));assert.match(JSON.parse(exported.entries[savedKey]).drafts.contributions[0],/arter/);
  await f.evaluate(k=>localStorage.removeItem(k),savedKey);h.page.once('dialog',d=>d.accept());await h.page.locator('#saveFile').setInputFiles(file);await h.page.locator('#menu').waitFor({state:'hidden'});await h.boot();f=h.frame;
  assert.match(await f.evaluate(()=>UPPDRAG_CH4_BOOKWORK.state.drafts.contributions[0]),/arter/);assert.deepEqual(await f.evaluate(()=>UPPDRAG_CH4_PILOT.materialReviewProgress()),{done:11,total:11});assert.deepEqual(await resources(),before);
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 4 source practice: all 8 writing sheets via Sam/Rut, free-form drafts and comparison without stamps, 11 distinct test terms, physical location, mobile keyboard, reload/export/import');
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await f.evaluate(()=>({book:UPPDRAG_CH4_BOOKWORK?.busy,room:interior?.kind,ui:UPPDRAG_CH4_PILOT?.recall?.ui})).catch(e=>e.message));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
