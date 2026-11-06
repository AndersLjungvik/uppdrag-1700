const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('ambient');let f;
 const status=()=>h.page.evaluate(()=>UPPDRAG_AMBIENT.status());
 async function scene(name){await h.page.waitForFunction(name=>UPPDRAG_AMBIENT.status().scene===name,name);}
 async function active(){await h.page.waitForFunction(()=>UPPDRAG_AMBIENT.status().active);}
 try{
  await h.page.addInitScript(()=>{
   window.__qaAudio=[];const Real=window.AudioContext;if(!Real)return;
   window.AudioContext=function(...args){
    const ctx=new Real(...args),original=ctx.createDynamicsCompressor.bind(ctx);
    ctx.createDynamicsCompressor=()=>{const compressor=original(),meter=ctx.createAnalyser(),connect=compressor.connect.bind(compressor);meter.fftSize=2048;ctx.__qaMeter=meter;
     compressor.connect=(target,...args)=>{if(target===ctx.destination){connect(meter);meter.connect(target);return target;}return connect(target,...args);};return compressor;};
    window.__qaAudio.push(ctx);return ctx;
   };window.AudioContext.prototype=Real.prototype;
  });
  await h.boot();f=h.frame;
  assert.equal((await status()).enabled,false);assert.equal((await status()).context,'idle');assert.equal(await h.page.evaluate(()=>__qaAudio.length),0,'no context or sound before opt-in');
  const saves=await f.evaluate(()=>[localStorage.getItem(UPPDRAG_CH4_PILOT.saveKey),localStorage.getItem('uppdrag1700.mastery.v1.ch4')]);
  const stageBefore=await f.locator('#stage').boundingBox();
  await h.page.locator('#ambientToggle').click();await active();assert.equal(await h.page.evaluate(()=>__qaAudio.length),1);
  await h.page.waitForFunction(()=>{const c=__qaAudio[0],a=c?.__qaMeter;if(!a)return false;const d=new Float32Array(a.fftSize);a.getFloatTimeDomainData(d);const peak=Math.max(...d.map(Math.abs));if(peak<=.00001)return false;window.__qaSignal={peak,rms:Math.sqrt(d.reduce((s,v)=>s+v*v,0)/d.length)};return true;});
  const audio=await h.page.evaluate(()=>__qaSignal);
  assert(audio.peak>0&&audio.peak<.9&&audio.rms>0,'actual Web Audio output is nonzero and has headroom: '+JSON.stringify(audio));
  assert.deepEqual(await f.locator('#stage').boundingBox(),stageBefore,'sound toggle does not move the game world');
  assert.deepEqual(await f.evaluate(()=>[localStorage.getItem(UPPDRAG_CH4_PILOT.saveKey),localStorage.getItem('uppdrag1700.mastery.v1.ch4')]),saves,'audio settings do not change pupil progress');
  await h.room('print');await scene('print');const played=(await status()).played;await h.page.waitForFunction(n=>UPPDRAG_AMBIENT.status().played>n,played,{timeout:10000});
  await h.greet();await h.page.waitForFunction(()=>UPPDRAG_AMBIENT.status().duck===.32);await h.speechClose();
  await f.evaluate(()=>UPPDRAG_CH4_PILOT.enterMemory('freedoms'));await h.page.waitForFunction(()=>UPPDRAG_AMBIENT.status().duck===.12);await f.evaluate(()=>UPPDRAG_CH4_PILOT.close());
  await f.evaluate(()=>{window.__qaSpeech=Object.getOwnPropertyDescriptor(window,'speechSynthesis');Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{speaking:true,pending:false}});});
  await h.page.waitForFunction(()=>UPPDRAG_AMBIENT.status().duck===.015);
  await f.evaluate(()=>{if(__qaSpeech)Object.defineProperty(window,'speechSynthesis',__qaSpeech);else delete window.speechSynthesis;});
  await h.room('archive');await scene('quiet');await h.room('farm');await scene('country');await h.room('homes');await scene('home');
  // Actual map positions change coastal volume gradually. Holding the same
  // wave source avoids resetting the sea loop on every sampled footstep.
  await f.evaluate(()=>{UPPDRAG_CH4_CITY_LIFE.suspend();if(interior)leaveInterior();path=[];window.__qaPort={...navigationPoint(region,region.harbor)};player={x:__qaPort.x+100,y:__qaPort.y};draw();});
  await h.page.waitForFunction(()=>UPPDRAG_AMBIENT.status().coast===1);
  for(const [distance,expected]of [[230,.84375],[320,.5],[410,.15625]]){
   await f.evaluate(distance=>{path=[];player={x:__qaPort.x+distance,y:__qaPort.y};draw();},distance);
   await h.page.waitForFunction(expected=>Math.abs(UPPDRAG_AMBIENT.status().coast-expected)<.00001,expected);
  }
  await f.evaluate(()=>{path=[];player={x:__qaPort.x+650,y:__qaPort.y};draw();});
  await h.page.waitForFunction(()=>UPPDRAG_AMBIENT.status().coast===0&&UPPDRAG_AMBIENT.status().scene==='city');
  assert.equal(await h.page.evaluate(()=>__qaAudio.length),1,'walking inland keeps a single audio context');
  await f.evaluate(()=>{if(interior)leaveInterior();UPPDRAG_CH4_CITY_LIFE.suspend();path=[];player={...navigationPoint(region,region.harbor)};camera={...player};requestHarbour();draw();});await scene('harbour');
  await f.evaluate(()=>departHarbour('marstrand'));await scene('sailing');await f.locator('#skipVoyage').click();await f.waitForFunction(()=>region.id==='marstrand'&&!voyage);await scene('harbour');
  await f.evaluate(()=>{if(interior)leaveInterior();path=[];const port=navigationPoint(region,region.harbor);player={x:port.x+650,y:port.y};draw();});
  await h.page.waitForFunction(()=>UPPDRAG_AMBIENT.status().coast===0&&UPPDRAG_AMBIENT.status().scene==='city');
  await h.room('fort');await scene('quiet');
  // Settings remain usable on a phone, with no viewport jump on toggling.
  await h.page.setViewportSize({width:390,height:844});await h.page.locator('#menuButton').click();await h.page.locator('#ambientSettings summary').click();
  await h.page.locator('#ambientVolume').evaluate(e=>{e.value='27';e.dispatchEvent(new Event('input',{bubbles:true}));});assert.equal((await status()).volume,.27);
  assert.equal(await h.page.locator('#menu').evaluate(e=>e.scrollWidth<=e.clientWidth),true);await h.page.locator('#closeMenu').click();
  const mobileBefore=await f.locator('#stage').boundingBox();await h.page.locator('#ambientToggle').click();await h.page.waitForFunction(()=>!UPPDRAG_AMBIENT.status().enabled&&UPPDRAG_AMBIENT.status().voices===0&&UPPDRAG_AMBIENT.status().context==='suspended');
  assert.deepEqual(await f.locator('#stage').boundingBox(),mobileBefore);
  await h.page.locator('#ambientToggle').press('Enter');await active();assert.equal(await h.page.evaluate(()=>__qaAudio.length),1,'repeat gestures reuse one context');
  await h.page.evaluate(()=>{window.__qaHidden=Object.getOwnPropertyDescriptor(document,'hidden');Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  await h.page.waitForFunction(()=>!UPPDRAG_AMBIENT.status().active&&UPPDRAG_AMBIENT.status().voices===0&&UPPDRAG_AMBIENT.status().context==='suspended');
  await h.page.evaluate(()=>{if(__qaHidden)Object.defineProperty(document,'hidden',__qaHidden);else delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await active();
  fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ambient-mobile.png')});
  // The opt-in and volume survive a chapter navigation; the new page still
  // waits for an ordinary gesture, including one from inside its iframe.
  const next=new URL(h.url);next.searchParams.set('chapter','5');next.searchParams.set('testChapter','5');await h.page.goto(next.href,{waitUntil:'domcontentloaded'});
  await h.page.waitForFunction(()=>document.getElementById('error')?.textContent||(document.getElementById('status')?.textContent.startsWith('Kapitel 5 av 10')&&document.getElementById('game')?.contentWindow?.UPPDRAG_AMBIENCE_STATE));assert.equal(await h.page.locator('#error').innerText(),'');
  f=await(await h.page.locator('#game').elementHandle()).contentFrame();assert.equal((await status()).enabled,true);assert.equal((await status()).volume,.27);assert.equal(await h.page.evaluate(()=>__qaAudio.length),0);assert.equal((await status()).context,'idle');
  await f.locator('#world').press('ArrowRight');await active();assert.equal(await h.page.evaluate(()=>__qaAudio.length),1,'trusted child gesture unlocks the outer context');
  await h.page.locator('#ambientToggle').click();await h.page.waitForFunction(()=>UPPDRAG_AMBIENT.status().voices===0);assert.equal((await status()).enabled,false);
  const fallback=await h.browser.newPage({ignoreHTTPSErrors:!!process.env.GAME_URL});
  await fallback.addInitScript(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;});await fallback.goto(h.url,{waitUntil:'domcontentloaded'});
  await fallback.waitForFunction(()=>!!window.UPPDRAG_AMBIENT);assert.equal(await fallback.locator('#ambientToggle').isDisabled(),true);assert.equal(await fallback.locator('#error').innerText(),'');await fallback.close();
  assert.deepEqual(h.errors,[]);console.log('PASS ambience browser: sparse real audio, smooth coastal levels and island inland silence, opt-in/one context, place/boat changes, print foley, dialogue/study/TTS ducking, mobile stable camera/volume/keyboard, hidden pause/resume, saved preferences and child gesture after chapter navigation, unsupported fallback');
 }catch(e){console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));console.error('Audio',await status().catch(()=>null));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
