const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
(async()=>{
 const root=path.resolve(__dirname,'../../..'),server=http.createServer((req,res)=>{const p=path.join(root,decodeURIComponent(req.url.split('?')[0]));let file=p;if(fs.existsSync(p)&&fs.statSync(p).isDirectory())file=path.join(p,'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}const type={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.json':'application/json'}[path.extname(file)]||'application/octet-stream';res.setHeader('Content-Type',type);res.end(fs.readFileSync(file));});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const p=await b.newPage({viewport:{width:1200,height:850},reducedMotion:'reduce'});p.setDefaultTimeout(12000);p.on('pageerror',e=>console.log('ERROR',e.message));
 const errors=[];p.on('pageerror',e=>errors.push(e.message));

 const remote=process.env.PREVIEW_URL,base=remote||'http://127.0.0.1:'+server.address().port+'/docs/spel/';
 let f;
 async function greet(room){
  assert.equal(await f.evaluate(room=>visitStagingRoom(room,'main'),room),true);
  await f.waitForFunction(()=>['meetingPerson','meetingDialogue'].some(id=>{const e=document.getElementById(id);return e&&!e.hidden&&e.getBoundingClientRect().width>0;}));
  if(await f.locator('#meetingDialogue').isHidden())await f.locator('#meetingPerson').click();
  await f.locator('#meetingDialogue').waitFor({state:'visible',timeout:12000});
  for(let i=0;i<5&&!(await f.locator('[data-ch1-choice="accept"]').count());i++)await f.locator('#meetingDialogue').click();
 }
 async function workspace(place){
  await f.locator('#ch1CutPaperScene').waitFor({state:'visible'});
  assert.equal(await f.locator('#ch1CutPaperScene').getAttribute('data-place'),place);
  const geometry=await f.evaluate(()=>{
   const modal=document.getElementById('ch1Modal'),stage=document.getElementById('stage'),sheet=modal.querySelector('.ch1Sheet'),canvas=modal.querySelector('canvas');
   const m=modal.getBoundingClientRect(),s=stage.getBoundingClientRect(),a=sheet.getBoundingClientRect();
   const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
   let colors=new Set();for(let i=0;i<pixels.length;i+=400)if(pixels[i+3])colors.add([pixels[i],pixels[i+1],pixels[i+2]].join(','));
   return {full:Math.abs(m.width-s.width)<1&&Math.abs(m.height-s.height)<1,inside:a.left>=m.left&&a.right<=m.right+1&&a.top>=m.top&&a.bottom<=m.bottom+1,colors:colors.size,room:getComputedStyle(document.getElementById('interiorView')).visibility,footer:document.getElementById('roomFooter').hidden};
  });
  assert(geometry.full,'work surface fills the scene');assert(geometry.inside,'sheet stays inside scene');assert(geometry.colors>20,'existing room artwork actually painted');assert.equal(geometry.room,'hidden');assert(geometry.footer);
 }
 async function leave(){
  await f.locator('#ch1Modal').press('Escape');assert.equal(await f.locator('#ch1Modal').isHidden(),true);
  assert.equal(await f.locator('#interiorView').evaluate(el=>getComputedStyle(el).visibility),'visible');
  assert.equal(await f.locator('#roomFooter').isVisible(),true);
 }
 try{
  await p.goto(base+'?teacher=1&chapter=1',{waitUntil:'domcontentloaded',timeout:60000});
  f=await(await p.waitForSelector('#game',{timeout:45000})).contentFrame();await f.waitForSelector('#ch1Hud');
  await greet('cafe');assert.equal(await f.locator('[data-ch1-choice="accept"]').innerText(),'Självklart!');
  await f.locator('[data-ch1-choice="accept"]').click();await f.locator('[data-mb="close"]').click();
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});
  for(const [room,place,button]of [['palace','palace','Se brevet'],['riksdag','riksdag','Se protokollet'],['waterfront','quay','Se handelslistan']]){
   await greet(room);
   if(place==='quay')assert.equal(await f.evaluate(()=>[[1200,600],[1920,700],[390,650],[844,260]].every(([w,h])=>{const p=UPPDRAG_HARBOUR_ART.project(w,h);return p.x<=.01&&p.x+1280*p.scale>=w-.01&&p.y<=.01&&p.y+720*p.scale>=h-.01;})),true,'harbour fills every viewport without side panels');
   const line=await f.locator('#meetingLine').innerText();assert.match(line,/Kan du hjälpa mig/);assert.doesNotMatch(line,/Amira visar|Elin lägger|Jo granskar/);
   assert.equal(await f.locator('[data-ch1-choice="accept"]').innerText(),button);
   await p.screenshot({path:path.join(root,'qa/scene-'+place+'-speech.png'),timeout:12000});
   await f.locator('[data-ch1-choice="accept"]').click();await workspace(place);
   await p.screenshot({path:path.join(root,'qa/scene-'+place+'-workspace.png'),timeout:12000});
   if(place==='palace'){
    const original=await f.locator('#ch1CutPaperScene').evaluate(el=>el.toDataURL());
    const t=await f.evaluate(()=>UPPDRAG_CH1_PILOT.recall.current);
    for(let i=0;i<t.fields.length;i++)await f.locator('[data-field-index="'+i+'"]').filter({hasText:t.fields[i].answers[0]}).click();
    await f.locator('[data-action="rc-submit"]').click();await workspace(place);
    assert.equal(await f.locator('#ch1CutPaperScene').evaluate(el=>el.toDataURL()),original,'feedback retains the same desktop');
    await f.locator('[data-action="rc-next"]').click();await workspace(place);
   }
   if(place==='riksdag'){
    await p.setViewportSize({width:390,height:844});await workspace(place);
    await p.screenshot({path:path.join(root,'qa/scene-riksdag-mobile.png'),timeout:12000});
    await f.locator('[data-action="rc-skip"]').click();await workspace(place);
    assert.match(await f.locator('.ch1Sheet').innerText(),/nytt försök/);
    await p.setViewportSize({width:1200,height:850});
   }
   await leave();
  }
  await greet('archive');await f.locator('[data-ch1-choice="accept"]').click();await workspace('archive');await leave();
  await f.evaluate(()=>UPPDRAG_CH1_PILOT.openBook());assert.equal(await f.locator('#ch1CutPaperScene').count(),0);assert.equal(await f.locator('#ch1Modal').evaluate(el=>el.classList.contains('ch1MemoryFull')),false);
  assert.equal(await p.locator('#error').innerText(),'');assert.deepEqual(errors,[]);
  console.log('PASS scene workspaces: actual Maja/Amira/Elin/Jo/Rut dialogue buttons, spoken lines, existing painted desktops, feedback, failure, mobile and room return');
 }catch(e){console.error('Parent error:',await p.locator('#error').textContent().catch(()=>''));console.error(await f?.evaluate(()=>({room:interior?.kind,classes:document.body.className,meeting:UPPDRAG_MEETINGS.state,modal:document.getElementById('ch1Modal').hidden,staging:UPPDRAG_ROOM_STAGING.state})));throw e;}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
