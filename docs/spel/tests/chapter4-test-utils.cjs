const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
async function launch(name){
 const root=path.resolve(__dirname,'../../..');
 const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,proxy:process.env.GAME_URL&&process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const page=await browser.newPage({ignoreHTTPSErrors:!!process.env.GAME_URL,viewport:{width:1200,height:850}});page.setDefaultTimeout(45000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const replay='qa-ch4-'+name;
 const url=process.env.GAME_URL||'http://127.0.0.1:'+server.address().port+'/docs/spel/?chapter=4&testChapter=4&replay='+replay;
 const scope=process.env.GAME_SAVE_ROOT||'uppdrag1700.integrated.20261023.v1.replay.'+replay+'.play.';
 let frame,currentURL=url;
 async function boot(next=currentURL){currentURL=next;await page.goto(next,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForFunction(()=>document.querySelector('#error')?.textContent||(document.querySelector('#game')?.contentWindow?.UPPDRAG_CH4_SCENES&&document.querySelector('#status')?.textContent.startsWith('Kapitel 4 av 10')),{},{timeout:45000});assert.equal(await page.locator('#error').innerText(),'');frame=await(await page.waitForSelector('#game')).contentFrame();await frame.waitForSelector('#ch1Hud');return frame;}
 async function room(kind){
  assert.equal(await frame.evaluate(kind=>{
   UPPDRAG_CH4_PILOT.close();UPPDRAG_MEETINGS.close(false);if(interior)leaveInterior();path=[];
   const wanted=kind==='fort'?'marstrand':'main';if(region.id!==wanted){switchRegion(wanted,REGIONS[wanted].harbor);if(interior)leaveInterior();}
   const b=kind==='square'?{name:'Torget',entry:'square'}:region.buildings.find(b=>ROOM_BY_REGION[region.id]?.[b.name]===kind);
   if(!b)return false;const entry=UPPDRAG_STORY_WORLD.entryFor(region,b)||b.entry;
   player={...navigationPoint(region,entry)};camera={...player};const opened=requestInterior(b);draw();return opened&&interior?.kind===kind;
  },kind),true,'room '+kind);await page.waitForTimeout(90);
 }
 async function greet(){if(await frame.locator('#adventureDialog').isHidden())await frame.locator('#meetingPerson').click({force:true});await frame.waitForFunction(()=>document.querySelector('#adventureDialog')?.open);}
 async function speechClose(){if(await frame.locator('#adventureDialog').isVisible())await frame.locator('#adventureDialog').press('Escape');}
 async function choose(id){for(let i=0;i<12&&!(await frame.locator('[data-adventure="room:'+id+'"]').count());i++)await frame.locator('.ad-utterance').click();await frame.locator('[data-adventure="room:'+id+'"]').click();}
 return {browser,page,root,url,scope,errors,boot,room,greet,choose,speechClose,get frame(){return frame;},set frame(v){frame=v;},async close(){await browser.close();server.close();}};
}
module.exports={launch,assert,fs,path};
