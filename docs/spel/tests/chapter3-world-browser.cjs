const {launch,assert,fs,path}=require('./chapter3-test-utils.cjs');
(async()=>{
 const h=await launch('world');let f;
 const storyKey='uppdrag1700.ch3-timeline.v1';
 async function leaveSpeech(){await h.speechClose();}
 async function approachPatrol(){
  await f.evaluate(()=>{if(interior)leaveInterior();UPPDRAG_CH3_CITY_LIFE.close();const a=UPPDRAG_CH3_CITY_LIFE.find(region,'soldiers');player={x:a.x-145,y:705};camera={...player};path=[{x:a.x+20,y:705}];follow=true;draw();});
  await f.waitForFunction(()=>UPPDRAG_CH3_CITY_LIFE.active&&UPPDRAG_CH3_CITY_LIFE.lines.some(l=>l[1].includes('Ett ögonblick')),undefined,{timeout:30000});
  for(let i=0;i<5&&!await f.locator('#ch3PatrolReplies').count();i++)await f.locator('#ch3StreetDialogue').click();
  await f.locator('#ch3PatrolReplies').waitFor({state:'visible'});
 }
 try{
  await h.page.addInitScript(({scope})=>{if(window===top&&!localStorage.getItem(scope+'uppdrag1700.side-adventures.v1'))localStorage.setItem(scope+'uppdrag1700.side-adventures.v1',JSON.stringify({v:1,chapters:{3:{wagon:'need-smith',wagonSeen:true,thief:'unseen',distance:3000,thiefDistance:600,history:[]}}}));},{scope:h.scope});
  await h.boot();f=h.frame;
  assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openWagon()),false);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.openSmith()),false);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.wagon),'need-smith');
  const before=await f.evaluate(()=>({m:localStorage.getItem('uppdrag1700.mastery.v1.ch3'),daler:UPPDRAG_CH3_PILOT.state.daler,apples:UPPDRAG_CH3_PILOT.state.apples}));
  await h.room('riksdag');await h.greet();await h.choose('cap');await h.choose('later');assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.story.phase),0);
  await h.room('square');await h.greet();await h.choose('summary');assert.equal(await f.locator('#ch3Summary').isVisible(),true);assert.match(await f.locator('#ch3Summary').innerText(),/öppnade eld.*Många dödades/s);assert.equal(await f.locator('#adventureDialog').isVisible(),false);
  await f.locator('[data-summary="close"]').click();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.story.afterUprising),true);assert.equal(await f.evaluate(()=>UPPDRAG_CH3_CITY_LIFE.phase()),3);
  await h.room('palace');await h.greet();await leaveSpeech();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.story.phase),2);assert.equal(await f.evaluate(()=>UPPDRAG_CH3_CITY_LIFE.stationedCamps(MAIN).length),2);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.travel('fort')),true);
  await f.waitForFunction(()=>voyage?.to==='marstrand',undefined,{timeout:30000});await f.locator('#skipVoyage').click();
  await f.waitForFunction(()=>region.id==='marstrand'&&interior?.kind==='fort',undefined,{timeout:30000});
  await h.greet();await h.choose('obey');await h.choose('later');assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.story.seen.fort),true);
  assert.deepEqual(await f.evaluate(()=>({m:localStorage.getItem('uppdrag1700.mastery.v1.ch3'),daler:UPPDRAG_CH3_PILOT.state.daler,apples:UPPDRAG_CH3_PILOT.state.apples})),before,'story and moral choices give no knowledge stamps or resources');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.travel('quay')),true);await f.waitForFunction(()=>voyage?.to==='main',undefined,{timeout:30000});await f.locator('#skipVoyage').click();await f.waitForFunction(()=>region.id==='main'&&interior?.outdoor,undefined,{timeout:30000});
  assert.equal(await f.evaluate(()=>Math.hypot(player.x-navigationPoint(MAIN,'quay').x,player.y-navigationPoint(MAIN,'quay').y)<1),true,'return lands at the actual quay');
  await f.evaluate(()=>leaveInterior());assert.equal(await f.locator('#ch3VisitFort').isVisible(),true);
  await h.room('riksdag');await h.greet();assert.match(await f.locator('#ch3TimeCard').innerText(),/Återblick/);await leaveSpeech();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_CITY_LIFE.phase()),3,'earlier area and later levels never restart marching');
  // A later location first is clearly dated and leaves the city in the later state.
  await f.evaluate(k=>localStorage.setItem(k,JSON.stringify({v:1,phase:0,seen:{},afterUprising:false,distance:0,nextPatrol:650,lastPatrol:0})),storyKey);await h.boot();f=h.frame;await h.room('palace');await h.greet();assert.match(await f.locator('#ch3TimeCard').innerText(),/Framåtblick/);await leaveSpeech();await h.room('square');await h.greet();assert.match(await f.locator('#ch3TimeCard').innerText(),/Återblick/);await leaveSpeech();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_CITY_LIFE.phase()),3);
  await f.evaluate(k=>{const s=UPPDRAG_CH3_SCENES.story;s.distance=1000;s.nextPatrol=650;s.lastPatrol=0;localStorage.setItem(k,JSON.stringify(s));},storyKey);await h.boot();f=h.frame;await approachPatrol();
  assert.equal(await f.locator('#ch3StreetDialogue button').count(),0,'replies stay outside the soldier speech');
  await f.locator('[data-patrol-answer="1"]').click();assert.match(await f.locator('.ch3Words').innerText(),/Du kan gå vidare/);await f.locator('#ch3StreetDialogue').press('Escape');assert.equal(await f.locator('#ch3PatrolReplies').count(),0);assert.equal(await f.locator('#ch3StreetRoot').isHidden(),true);
  const count=await f.evaluate(()=>UPPDRAG_CH3_SCENES.story.patrolCount);assert.equal(count,1);assert.equal(await f.evaluate(()=>UPPDRAG_EVENT_ENGINE.state.thief),'unseen');
  assert.deepEqual(await f.evaluate(()=>({m:localStorage.getItem('uppdrag1700.mastery.v1.ch3'),daler:UPPDRAG_CH3_PILOT.state.daler,apples:UPPDRAG_CH3_PILOT.state.apples})),before);
  await f.evaluate(k=>{const s=UPPDRAG_CH3_SCENES.story;s.distance=s.nextPatrol+1;s.lastPatrol=Date.now()-50000;localStorage.setItem(k,JSON.stringify(s));},storyKey);await h.boot();f=h.frame;await approachPatrol();assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.story.patrolCount),2);
  assert.equal(await f.evaluate(()=>UPPDRAG_CH3_PILOT.selectArea('parties','learner')),false,'a knowledge test cannot overlap a patrol');await f.evaluate(()=>UPPDRAG_CH3_PILOT.openBook());assert.equal(await f.locator('#ch1Modal').isVisible(),true);assert.equal(await f.locator('#ch3StreetRoot').isHidden(),true);assert.equal(await f.locator('#ch3PatrolReplies').count(),0);await f.locator('#ch1Modal').press('Escape');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.openRoom('courtyard')),false,'cannot solve the courtyard remotely');
  assert.equal(await f.evaluate(()=>UPPDRAG_CH3_SCENES.travel('courtyard')),true);await f.waitForFunction(()=>interior?.kind==='courtyard',undefined,{timeout:30000});await h.greet();for(let i=0;i<3;i++)await f.locator('.ad-utterance').click();assert.doesNotMatch(await f.locator('.ad-utterance').innerText(),/De blir fler/);await leaveSpeech();
  assert.deepEqual(h.errors,[]);console.log('PASS chapter 3 world: no repeated wagon, separate chronology and flashbacks, calm historical summary, physical/skip-able Carlsten trip and quay return, persistent later city, recurring on-site patrol, no penalties/stamps and clean bubbles');
 }catch(e){console.error('FAIL',e);console.error('URL',h.page.url());console.error('Body',(await h.page.locator('body').innerText().catch(()=>''))?.slice(0,700));console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));if(f)console.error(await f.evaluate(()=>({room:interior,story:UPPDRAG_CH3_SCENES?.story,city:UPPDRAG_CH3_CITY_LIFE?.lines})).catch(e=>e.message));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
