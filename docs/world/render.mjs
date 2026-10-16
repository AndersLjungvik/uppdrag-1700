import {fittedScene} from '../demo/core.mjs?v=0.6.0';
import {PLACES} from './content.mjs?v=0.6.0';
export function createRenderer(canvas,{reduced=false,onReady=()=>{},artImages=null,canvasFactory=()=>document.createElement('canvas')}={}){
const ctx=canvas.getContext('2d');
let state={player:{x:610,y:405},placed:[]},view='town',speaker='',speechStarted=0,speechUntil=0,busy=false,petUntil=0,heading=0,moving=false,pressFlight=null;
const art=artImages||{};
if(!artImages)for(const name of ['town','quay','work']){const im=new Image();im.onload=()=>{art[name]=im;onReady()};im.src=window.UPPDRAG_WORLD_ASSETS?.[name]||new URL(`./assets/${name}.webp`,import.meta.url).href;}
let projection={scale:1,x:0,y:0,w:1280,h:720,d:1};
// One deterministic paper texture, shared by the moving paper pieces.
const grain=canvasFactory();grain.width=grain.height=80;const gx=grain.getContext('2d');let seed=19;for(let n=0;n<850;n++){seed=(seed*1664525+1013904223)>>>0;const x=seed%80;seed=(seed*1664525+1013904223)>>>0;const y=seed%80;gx.fillStyle=n%2?'#fff7e9':'#372c21';gx.globalAlpha=.16;gx.fillRect(x,y,1+(n%3),1)}const texture=ctx.createPattern(grain,'repeat');
function poly(points,color,shadow=true){ctx.save();if(shadow){ctx.shadowColor='#30281c28';ctx.shadowOffsetX=1;ctx.shadowOffsetY=2;ctx.shadowBlur=1}ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.shadowColor='transparent';ctx.clip();ctx.globalAlpha=.35;ctx.fillStyle=texture;ctx.fillRect(-1500,-1500,3000,3000);ctx.restore()}
function cut(x,y,w,h,c){poly([[x+1,y+2],[x+w*.3,y],[x+w*.65,y+1],[x+w-1,y],[x+w,y+h*.43],[x+w-2,y+h],[x+w*.6,y+h-1],[x+w*.3,y+h],[x,y+h-2],[x+1,y+h*.55]],c)}
function oval(x,y,rx,ry,c){ctx.save();ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();ctx.clip();ctx.globalAlpha=.3;ctx.fillStyle=texture;ctx.fillRect(x-rx,y-ry,rx*2,ry*2);ctx.restore()}
function overhead(x,y,color,angle=0,walk=false,t=0,woman=false){ctx.save();ctx.translate(x,y);ctx.rotate(angle);const gait=walk&&!reduced?Math.sin(t/95)*4:0;cut(-9,10+gait,7,15,'#403b34');cut(3,10-gait,7,15,'#403b34');poly([[-13,-8],[12,-8],[15,12],[8,18],[-11,15]],color);if(woman)poly([[-12,2],[14,2],[18,21],[-16,21]],color);cut(-17,-3,5,15+(walk?gait*.5:0),'#c19a70');cut(14,-3,5,15-(walk?gait*.5:0),'#c19a70');oval(0,-12,10,11,woman?'#d8c8a7':'#574334');if(woman)oval(0,-13,8,7,'#dcd1b6');ctx.restore()}
function dog(t){ctx.save();ctx.translate(455,390);const wag=t<petUntil&&!reduced?Math.sin(t/80)*.4:0;ctx.save();ctx.translate(12,0);ctx.rotate(wag);cut(0,-2,14,4,'#9c8052');ctx.restore();cut(-9,-7,20,16,'#b19462');cut(-5,-11,4,5,'#705b3b');cut(5,-11,4,5,'#705b3b');cut(-5,8,4,5,'#705b3b');cut(5,8,4,5,'#705b3b');oval(-14,0,8,8,'#b19462');cut(-17,-8,5,8,'#6f593b');ctx.restore()}
function limb(x,y,w,h,rotation,color){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);cut(-w/2,0,w,h,color);ctx.restore()}
function puppet(x,foot,color,faceRight,t,talking=false,walk=false,woman=false,apron=false){ctx.save();ctx.translate(x,foot);if(!faceRight)ctx.scale(-1,1);const speaking=!reduced&&talking&&t>=speechStarted&&t<speechUntil&&!busy&&!document.hidden,elapsed=t-speechStarted;const sway=speaking?Math.sin(elapsed/260)*.006:0;ctx.rotate(sway);const stride=walk&&!reduced?Math.sin(t/100)*.15:0;
 limb(-19,-105,20,92,stride,'#bca87b');limb(20,-105,20,92,-stride,'#bca87b');cut(-36,-19+Math.sin(stride)*10,40,17,'#413b31');cut(6,-19-Math.sin(stride)*10,43,17,'#413b31');poly([[-47,-226],[34,-225],[48,-113],[28,-94],[-43,-102]],color);poly([[-18,-228],[17,-228],[5,-189],[-7,-187]],'#e8ddc0');limb(-45,-218,23,97,.07+stride*.25,color);oval(-49,-116,12,14,'#c9a57c');
 const gesture=speaking?-.18+Math.sin(elapsed/300)*.045:.05;ctx.save();ctx.translate(36,-212);ctx.rotate(gesture);cut(-11,0,22,78,color);oval(0,84,12,14,'#c9a57c');ctx.restore();
 cut(-8,-251,22,27,'#c8a377');poly([[-29,-291],[12,-300],[36,-285],[38,-267],[47,-260],[36,-255],[29,-230],[-14,-235],[-28,-253]],'#cda77b');poly([[-32,-288],[-17,-307],[15,-309],[35,-292],[12,-287],[-13,-271],[-27,-253]],woman?'#d7c9ac':'#604a35');oval(28,-272,2,2,'#342c24');const opening=speaking?Math.max(0,Math.sin(elapsed/70))*(1+Math.sin(elapsed/340)**2*1.8):0;oval(35,-249,3.5,.65+opening,'#594132');if(!woman){oval(-1,-301,47,9,color);poly([[-30,-303],[-15,-328],[15,-327],[28,-301]],color)}if(woman)poly([[-36,-116],[44,-113],[58,-18],[-57,-18]],color);if(apron){poly([[-23,-210],[24,-209],[31,-34],[-30,-34]],'#d9caa9');for(const [a,b]of [[8,-110],[-12,-75],[17,-155]])oval(a,b,3,4,'#615445')}ctx.restore()}
function base(name){if(art[name])ctx.drawImage(art[name],0,0,1280,720);else{cut(0,0,1280,720,'#d5cebc');if(name==='town'){cut(20,180,320,160,'#a54f3e');cut(550,50,290,160,'#968160');cut(150,440,280,160,'#55534e');cut(1100,0,180,720,'#537588')}}}
function material(id,x,y,size=1){ctx.save();ctx.translate(x,y);ctx.scale(size,size);if(id==='ink'){oval(0,0,24,8,'#352e2a');cut(-21,-41,42,42,'#363131');cut(-12,-53,24,13,'#292626')}else if(id==='paper'){for(let i=0;i<4;i++)cut(-40+i*2,-25-i*4,80,6,'#f0e3c4')}else if(id==='type'){cut(-40,-35,80,36,'#887052');for(let a=0;a<5;a++)for(let b=0;b<2;b++)cut(-34+a*14,-30+b*13,9,9,'#5c5d56')}ctx.restore()}
function drawPress(){cut(0,0,1280,720,'#d8ceb7');cut(0,600,1280,120,'#a39378');cut(70,50,1140,21,'#786449');cut(110,50,24,550,'#786449');cut(1120,50,24,550,'#786449');cut(120,510,370,30,'#8e714b');cut(145,540,24,120,'#796043');cut(440,540,24,120,'#796043');
 cut(700,155,36,495,'#745337');cut(956,155,36,495,'#745337');cut(683,140,325,55,'#87633f');cut(824,160,35,240,'#5c4530');for(let y=175;y<390;y+=18){ctx.beginPath();ctx.moveTo(822,y);ctx.lineTo(862,y+12);ctx.strokeStyle='#bc9a69';ctx.lineWidth=4;ctx.stroke()}cut(750,396,220,28,'#785a39');cut(684,490,330,35,'#927047');cut(720,525,24,118,'#795d3c');cut(958,525,24,118,'#795d3c');cut(802,264,238,17,'#654d34');
 for(const [i,id]of ['ink','paper','type'].entries()){const x=185+i*130;if(!state.placed.includes(id))material(id,x,505);else material(id,775+i*62,488,.55)}
 ctx.save();ctx.translate(1130,690);ctx.scale(1.05,1.05);puppet(0,0,'#6e6b5b',false,performance.now(),speaker==='Brita',false,true,true);ctx.restore();
 if(pressFlight){const p=Math.min(1,(performance.now()-pressFlight.at)/500),x=pressFlight.x+(835-pressFlight.x)*p,y=505+(470-505)*p;material(pressFlight.id,x,y,1-p*.45);if(p>=1)pressFlight=null}
}

function room(kind,t,who){
 cut(0,0,1280,720,'#c7bba0');cut(0,560,1280,160,'#9c8a6b');
 if(kind==='cafe'){
  cut(80,100,250,270,'#6e7771');cut(96,116,218,235,'#bbc2b1');cut(180,116,14,235,'#6e7771');cut(96,220,218,14,'#6e7771');
  cut(800,475,360,28,'#816347');cut(830,500,20,140,'#70533d');cut(1090,500,20,140,'#70533d');oval(920,470,25,9,'#e7d6b3');cut(902,441,36,25,'#e3d3b3');
  if(state.effects?.includes('chapter-1-level-3')){cut(105,160,165,135,'#e8dabc');for(let y=185;y<260;y+=18)cut(123,y,120,3,'#7f7055')}
  if(state.effects?.includes('chapter-4-level-3')){cut(990,448,100,18,'#5e6c66');cut(995,438,90,10,'#eee1bf')}
  if(state.effects?.includes('chapter-10-level-3')){cut(1010,430,115,35,'#735d42');cut(1020,425,95,8,'#e9dbbb')}
 }else if(kind==='opera'){
  cut(100,115,260,470,'#655c4d');cut(95,95,95,500,'#864b43');cut(280,95,95,500,'#864b43');cut(85,90,300,32,'#a28251');
  ctx.strokeStyle='#9c845f';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(530,50);ctx.lineTo(530,135);ctx.stroke();oval(530,140,43,9,'#a58d61');
 }else if(kind==='garden'){
  cut(100,430,260,25,'#897050');cut(115,455,18,170,'#786043');cut(325,455,18,170,'#786043');
  for(let i=0;i<2;i++){cut(150+i*130,380,70,50,'#9a785c');cut(182+i*130,292,5,100,'#64735c');poly([[185+i*130,350],[143+i*130,320],[182+i*130,320]],'#7b866a');poly([[185+i*130,325],[220+i*130,286],[190+i*130,296]],'#6e7b60')}
 }else if(kind==='farm'){
  for(let i=0;i<3;i++){cut(45,400+i*53,310,43,i%2?'#a9966e':'#a9a17a');for(let j=0;j<7;j++)cut(62+j*40,405+i*53,2,27,'#8a7c5f')}
  cut(100,230,170,140,'#99856a');poly([[80,230],[190,160],[290,230]],'#655d50');cut(165,290,42,80,'#625a4b');
 }else if(kind==='barnhus'){
  cut(90,430,300,28,'#806b50');cut(110,458,20,175,'#756248');cut(350,458,20,175,'#756248');oval(220,416,65,20,'#5b5d53');cut(159,378,120,38,'#6a6b5a');oval(220,378,60,16,'#3f4940');
  const enough=state.effects?.includes('chapter-2-level-3');for(let i=0;i<(enough?3:1);i++)oval(135+i*90,420,30,9,'#d9c9a5');
 }else if(kind==='palace'){
  cut(110,100,220,240,'#8e7a56');cut(130,120,180,200,'#675e50');oval(220,190,36,42,'#b89e76');poly([[170,290],[185,235],[250,235],[280,290]],'#636d63');
 }else if(kind==='colony'){
  cut(70,140,280,230,'#d4c5a3');for(let y=170;y<330;y+=25)cut(98,y,215,3,'#8c7e61');
 }else{
  cut(100,145,250,245,'#746b58');for(let i=0;i<5;i++)cut(120+i*42,170,24,195,['#7c5946','#7f8063','#a08c67'][i%3]);
  cut(80,405,300,26,'#7c6548');cut(100,432,20,200,'#705a40');cut(340,432,20,200,'#705a40');cut(150,380,150,22,'#ded0b0');
 }
 puppet(525,690,'#466b70',true,t,speaker==='Du');
 puppet(790,690,who.color||'#736d57',false,t,speaker===who.npc,false,who.woman||false);
}
function draw(t,{world,place='town',speaker:sp='',speechAt=0,speechEnd=0,blocked=false,direction=0,walking=false,dogUntil=0,flight=null,rut=null}={}){
 if(!world)return;state=world;view=place;const who=PLACES[place]||PLACES.archive;speaker=place!=='town'&&sp&&sp!=='Du'&&sp!=='Berättaren'?(place==='print'?'Brita':who.npc):sp;speechStarted=speechAt;speechUntil=speechEnd;busy=blocked;heading=direction;moving=walking;petUntil=dogUntil;pressFlight=flight;
 const {scale,x,y,d}=projection;if(!canvas.width||!canvas.height)return;
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#d8d0bc';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.setTransform(d*scale,0,0,d*scale,d*x,d*y);
 if(view==='town'){
  base('town');overhead(state.player.x,state.player.y,'#486c72',heading,moving,t);overhead(1040,420,'#a4804c',-.3,false,t);overhead(860,465,'#8e614b',.1,false,t,true);const rutPos=rut||{x:570,y:445};overhead(rutPos.x,rutPos.y,'#77548a',.2,true,t,true);ctx.font='bold 17px Georgia';ctx.textAlign='center';ctx.fillStyle='#fff1cf';ctx.fillText('RUT · ÄPPLEN',rutPos.x,rutPos.y-35);dog(t);
  poly([[1020,0],[1280,0],[1280,140],[1220,119],[1170,107],[1110,71]],'#ece0c7');
 }else if(view==='work')base('work');
 else if(view==='quay'||view==='marstrand'){base('quay');puppet(525,690,'#466b70',true,t,speaker==='Du');puppet(790,690,who.color,false,t,speaker===who.npc);}
 else if(view==='print')drawPress();else room(view,t,who);
}
function resize(width,height,dpr=1){const d=Math.min(dpr||1,2);canvas.width=Math.round(width*d);canvas.height=Math.round(height*d);projection={...fittedScene(width,height),w:width,h:height,d};return projection}
return{resize,draw,get projection(){return projection},project(x,y){return{x:x*projection.scale+projection.x,y:y*projection.scale+projection.y}},unproject(x,y){return{x:(x-projection.x)/projection.scale,y:(y-projection.y)/projection.scale}}};
}
