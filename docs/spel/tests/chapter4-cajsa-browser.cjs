const {launch,assert,fs,path}=require('./chapter4-test-utils.cjs');
(async()=>{
 const h=await launch('cajsa');let f;
 try{
  await h.boot();f=h.frame;const before=await f.evaluate(()=>JSON.stringify({s:UPPDRAG_CH4_PILOT.state.record,daler:UPPDRAG_CH4_PILOT.state.daler,apples:UPPDRAG_CH4_PILOT.state.apples,book:UPPDRAG_CH4_SIDEQUEST.phase}));
  for(const [name,size,reduced] of [['desktop',{width:1200,height:850},false],['mobile',{width:390,height:844},true]]){
   await h.page.setViewportSize(size);await h.page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});await h.room('barnhus');
   const drawing=await f.evaluate(()=>{
    const art=UPPDRAG_ROOM_ART,life=UPPDRAG_ROOM_LIFE,foreground=art.drawForeground,hand=life.hand,log={tables:0,hands:[]};
    art.drawForeground=function(...args){log.tables++;return foreground.apply(this,args);};life.hand=function(g,npc,who){log.hands.push(who.name);return hand.call(this,g,npc,who);};
    try{UPPDRAG_MEETINGS.redraw();}finally{art.drawForeground=foreground;life.hand=hand;}
    const geo=UPPDRAG_MEETINGS.geometryForRoom();return {...log,guest:geo.visitorPose,host:geo.poses[1],tall:geo.w/geo.h<1.02};
   });
   assert.equal(drawing.tables,1,'the host paints the foreground once, before the visitor');assert(drawing.hands.includes('Siri'));assert(!drawing.hands.includes('Cajsa Warg'),'Cajsa never inherits Siri’s serving hands');
   assert(drawing.guest[1]>(drawing.tall?976:650),'guest feet stand in front of the table');assert(Math.abs(drawing.guest[0]-drawing.host[0])>150,'the guest has room beside the host');
   const hit=await f.locator('#ch4CajsaVisitor').boundingBox(),view=await f.evaluate(()=>{const r=roomView.getBoundingClientRect();return {left:r.left,right:r.right};});
   assert(hit.width>=44);assert(hit.x>=view.left-1&&hit.x+hit.width<=view.right+1,'the whole click target remains inside the room');
   fs.mkdirSync(path.join(h.root,'qa'),{recursive:true});await h.page.screenshot({path:path.join(h.root,'qa/ch4-cajsa-fixed-'+name+'.png')});
   if(reduced){await f.locator('#ch4CajsaVisitor').focus();await f.locator('#ch4CajsaVisitor').press('Enter');}else await f.locator('#ch4CajsaVisitor').click();
   await f.locator('#adventureDialog').waitFor({state:'visible'});assert.match(await f.locator('.ad-utterance').innerText(),/arbetet i köket/);
   assert.equal(await f.evaluate(()=>{const geo=UPPDRAG_MEETINGS.geometryForRoom(),p=geo.visitorPose,s=stage.getBoundingClientRect(),b=document.getElementById('adventureDialog').getBoundingClientRect(),x=s.left+geo.left+geo.p.x+p[0]*geo.p.scale,y=s.top+geo.top+geo.p.y+(p[1]-305*p[2])*geo.p.scale;return x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom;}),false,'her speech bubble leaves her face visible');
   await h.page.screenshot({path:path.join(h.root,'qa/ch4-cajsa-talking-'+name+'.png')});await h.speechClose();console.log('PASS Cajsa beside the table, separate work animation and accessible speech:',name);
  }
  assert.equal(await f.evaluate(()=>JSON.stringify({s:UPPDRAG_CH4_PILOT.state.record,daler:UPPDRAG_CH4_PILOT.state.daler,apples:UPPDRAG_CH4_PILOT.state.apples,book:UPPDRAG_CH4_SIDEQUEST.phase})),before);assert.deepEqual(h.errors,[]);
 }catch(e){console.error('FAIL',e);console.error('Parent',await h.page.locator('#error').textContent().catch(()=>''));throw e;}finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
