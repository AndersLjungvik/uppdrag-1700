'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const {createCanvas}=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'@napi-rs/canvas'));
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const events={},c={devicePixelRatio:1,addEventListener:(name,fn)=>events[name]=fn,document:{createElement:()=>createCanvas(1,1)}};c.window=c;
let painted=0,width=240,height=130;
const canvas=()=>{const out=createCanvas(1,1);out.getBoundingClientRect=()=>({width,height});return out;};
c.UPPDRAG_ROOM_ART={originalLoaded:true,renderMemoryCloseup(out,kind){painted++;if(kind==='unsupported')return false;out.width=width*c.devicePixelRatio;out.height=height*c.devicePixelRatio;const g=out.getContext('2d');g.fillStyle=kind==='print'?'#765432':'#8fa161';g.fillRect(0,0,out.width,out.height);g.clearRect(3,4,5,6);return true;}};
vm.createContext(c);vm.runInContext(read('scene-presence.js'),c);c.UPPDRAG_SCENE_PRESENCE.install();
const render=kind=>{const out=canvas();assert(c.UPPDRAG_ROOM_ART.renderMemoryCloseup(out,kind));return out;};
const expected=render('print').getContext('2d').getImageData(0,0,width,height).data;
for(let i=0;i<60;i++)assert.deepEqual(render('print').getContext('2d').getImageData(0,0,width,height).data,expected);
assert.equal(painted,1,'successive question canvases copy the original pixels');
width++;render('print');assert.equal(painted,2,'resize invalidates');c.devicePixelRatio=2;render('print');assert.equal(painted,3,'density invalidates');
c.UPPDRAG_PAPER_FIBRES={revision:1,loaded:true};render('print');assert.equal(painted,4,'new paper material invalidates');
events['uppdrag-room-material-ready']();render('print');assert.equal(painted,5,'room material arrival invalidates');
render('cafe');render('archive');render('print');assert.equal(painted,8,'at most two scenes are retained');
for(let i=0;i<2;i++)assert.equal(c.UPPDRAG_ROOM_ART.renderMemoryCloseup(canvas(),'unsupported'),false);assert.equal(painted,10,'failures remain failures');
width=height=2000;c.devicePixelRatio=1;render('print');render('cafe');render('print');assert.equal(painted,13,'two large paintings cannot exceed the 24 MiB budget');
// Execute the actual transformed draw guard, including its pending repaint.
for(let chapter=1;chapter<=5;chapter++){
 const source=c.UPPDRAG_SCENE_PRESENCE.source('meeting-ch'+chapter+'-pilot.js',read('_decoded/meeting-ch'+chapter+'-pilot.js'));
 const guard=source.slice(source.indexOf('  function drawPeople(now){'),source.indexOf('    if(!interior||voyage)',source.indexOf('  function drawPeople(now){')));
 c.roomView={style:{visibility:'hidden'}};c.lastPaint=0;c.document.hidden=false;c.UPPDRAG_MENU_OPEN=()=>false;
 vm.runInContext(guard+'throw Error("paint visible room");};window.paintRoom=drawPeople;',c);
 c.paintRoom(100);assert.equal(c.lastPaint,-Infinity);
 c.roomView.style.visibility='';c.document.hidden=true;c.paintRoom(200);c.document.hidden=false;c.UPPDRAG_MENU_OPEN=()=>true;c.paintRoom(300);
 c.UPPDRAG_MENU_OPEN=()=>false;assert.throws(()=>c.paintRoom(400),/paint visible room/,'room repaints after returning from a question');
}
// Execute the real event bubble placement with changing DOM content/geometry.
const source=read('event-engine.js'),start=source.indexOf(' function positionSpeech(){'),end=source.indexOf(' new ResizeObserver',start);
let measured=0,papers=0,top=470;
c.stage={getBoundingClientRect:()=>({width:800,height:600,left:0,top:0})};c.canvas=null;c.worldAnchor=()=>({x:0,y:0});
c.roomSpeech={room:'cafe'};c.interior={kind:'cafe'};c.lineSpeaker='Maja';
const geo={left:0,top:0,p:{x:0,y:0,scale:1},poses:[[200,500,1],[500,500,1]]};c.UPPDRAG_MEETINGS={geometryForRoom:()=>geo};
c.replies={hidden:true,getBoundingClientRect:()=>({top})};c.dialog={open:true,classList:{contains:name=>name==='ad-event-speech'},className:'speech',textContent:'Maja: Hej!',firstElementChild:{},style:{},getBoundingClientRect:()=>{measured++;return {height:100};}};
c.tail={id:'adventureTail',removeAttribute(){},setAttribute(){}};c.UPPDRAG_SCENE_PRESENCE={speech:()=>null};c.UPPDRAG_PAPER_DIALOGUES={drawSpeech(){papers++;return true;}};
c.lastSpeechSignature='';c.lastSpeechInputs='';c.lastSpeechContent=null;
vm.runInContext(source.slice(start,end)+'window.positionRoomSpeech=positionSpeech;',c);
c.positionRoomSpeech();const reads=measured;for(let i=0;i<1000;i++)c.positionRoomSpeech();assert.equal(measured,reads,'a stationary line does not force repeated bubble layouts');assert.equal(papers,1);
for(const change of [()=>c.dialog.textContent='Maja: En ny replik.',()=>geo.poses[1][0]++,()=>geo.poses[0][0]++,()=>c.UPPDRAG_CH3_SCENES={roomActors:()=>[{pos:[100,400,1]}]},()=>c.dialog.firstElementChild={},()=>c.replies.hidden=false,()=>top-=20,()=>c.lastSpeechSignature='']){const before=measured;change();c.positionRoomSpeech();assert(measured>before,'text, actors, replies and explicit invalidation must place again');}
console.log('PASS room performance: exact cached question pixels, resize/density/material invalidation, two-scene bound, hidden-room pause and resume across chapters 1–5, 1000 stationary speech ticks without repeated layout, changed text/actors/replies reflow');
