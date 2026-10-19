/* Demo 3.13: shared real-paper material on the unchanged additional rooms.
 * Approved cafe/print/archive geometry delegates to interior-fibre-art.js.
 * No map, progress or voyage state. Stylised environments, not reconstructions.
 */
'use strict';
(() => {
  const approved=window.UPPDRAG_ROOM_ART;
  if(!approved)throw new Error('Grundrummen måste laddas först.');
  const extraNames={barnhus:'Barnhuset',workshop:'Verkstäderna',science:'Vetenskapens hus',
    opera:'Operan',palace:'Slottet',riksdag:'Riksdagshuset',church:'Kyrkan',homes:'Bostadskvarteren',farm:'Byn',manor:'Herrgården',
    fort:'Fästningen',marstrandHarbor:'Hamnen på Marstrand',townShop:'Stadens hus',
    gustavia:'Gustavia',colonyHarbor:'Hamnen i Gustavia',trading:'Handelsplatsen'};
  const descriptions={
    barnhus:'Sovplatser, hopvikt linne och ett gemensamt bord med skålar.',
    workshop:'Vävstol, verktyg och en arbetsbänk med hyvel och virke.',
    science:'Växtprover, skåp med glas och ett undersökningsbord.',
    opera:'En liten scen med ridåer, notställ och sittplatser.',
    palace:'En sal med porträtt, hög stol och Amiras skrivbord.',
    riksdag:'En stor sammanträdessal med bänkar, talarstol och protokollbord.',
    church:'En kyrksal med träbänkar, predikstol och höga fönster.',
    homes:'Ett enkelt bostadsrum med eldstad, bänk och köksbord.',
    farm:'En bondstuga med redskap, säckar och ett bord med en korg.',
    manor:'Ett arbetsrum med skåp, fönster och skrivbord.',
    fort:'Ett rum i fästningen med muröppning, kanon och kartbord.',
    marstrandHarbor:'Ett hamnmagasin med tunnor, våg och frakthandlingar.',
    townShop:'En handelsbod med hyllor, tyg och en disk.',
    gustavia:'Ett kontorsrum i Gustavia med handlingar och skrivbord.',
    colonyHarbor:'Ett hamnmagasin med lådor, tunnor och rep.',
    trading:'En handelslokal med hyllor, våg och bokföring.'
  };
  const fibres=window.UPPDRAG_PAPER_FIBRES;
  if(!fibres)throw new Error('Pappersmaterialet måste laddas före rummen.');
  const colors={wall:'#d9cbb1',floor:'#a89574',wood:'#816347',dark:'#604c38',paper:'#eee0c2',green:'#7e8b72',slate:'#595d55',ink:'#393431',glass:'#b6c3b0',red:'#975d49'};
  function mat(g,name){return fibres.material(g,colors[name]||colors.paper,name);}
  function poly(g,pts,name,shadow=true){g.save();g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();if(shadow){g.shadowColor='#40311e40';g.shadowOffsetX=2;g.shadowOffsetY=4;g.shadowBlur=1;}g.fillStyle=mat(g,name);g.fill();g.shadowColor='transparent';const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);fibres.finish(g,{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)},{kind:name,edge:1});g.restore();}
  // Retains the uneven cut-paper silhouette used by the original rooms.
  function cut(g,x,y,w,h,name,shadow=true){poly(g,[[x+1,y+2],[x+w*.3,y],[x+w*.65,y+1],[x+w-1,y],[x+w,y+h*.43],[x+w-2,y+h],[x+w*.6,y+h-1],[x+w*.3,y+h],[x,y+h-2],[x+1,y+h*.55]],name,shadow);}
  function oval(g,x,y,rx,ry,name){g.save();g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=mat(g,name);g.fill();fibres.finish(g,{x:x-rx,y:y-ry,w:rx*2,h:ry*2},{kind:name,edge:.65});g.restore();}
  function place(g,x,y,s,fn){g.save();g.translate(x,y);g.scale(s,s);fn(g);g.restore();}
  function lines(g,x,y,w,n,spacing=15){g.save();g.strokeStyle='#806d5099';g.lineWidth=2;for(let i=0;i<n;i++){g.beginPath();g.moveTo(x,y+i*spacing);g.lineTo(x+w-(i%3)*w*.16,y+i*spacing);g.stroke();}g.restore();}
  function cup(g,x,y,s=1){place(g,x,y,s,g=>{oval(g,0,21,37,10,'paper');g.strokeStyle='#e8dabd';g.lineWidth=8;g.beginPath();g.arc(24,-3,12,-1.6,1.6);g.stroke();cut(g,-22,-23,44,42,'paper');oval(g,0,-22,22,8,'paper');oval(g,0,-22,16,5,'dark');});}
  function material(g,id,x,y,s=1){place(g,x,y,s,g=>{if(id==='ink'){oval(g,0,0,24,8,'ink');cut(g,-21,-41,42,42,'ink');cut(g,-12,-53,24,13,'dark');}else if(id==='paper'){for(let i=0;i<4;i++)cut(g,-40+i*2,-25-i*4,80,6,'paper');}else{cut(g,-40,-35,80,36,'wood');for(let a=0;a<5;a++)for(let b=0;b<2;b++)cut(g,-34+a*14,-30+b*13,9,9,'slate',false);}});}
  function table(g,x,y,w,h){cut(g,x+18,y+27,23,h-25,'dark');cut(g,x+w-44,y+27,23,h-25,'dark');cut(g,x,y,w,32,'wood');poly(g,[[x-9,y],[x+18,y-30],[x+w-15,y-30],[x+w+8,y]],'wood');}
  function chair(g,x,y,s=1){place(g,x,y,s,g=>{cut(g,0,-83,68,76,'dark');cut(g,8,-75,52,18,'wood');cut(g,0,-5,72,17,'wood');cut(g,5,12,12,72,'dark');cut(g,55,12,12,72,'dark');});}
  function windowPane(g,x,y,w,h){cut(g,x,y,w,h,'slate');cut(g,x+12,y+12,w-24,h-24,'glass',false);cut(g,x+w*.47,y+12,12,h-24,'slate');cut(g,x+12,y+h*.48,w-24,12,'slate');cut(g,x-9,y+h,w+18,14,'paper');}
  function noticeBoard(g,x,y,w,h){cut(g,x,y,w,h,'dark');cut(g,x+9,y+9,w-18,h-18,'wood');[[.1,.12,.34,.63],[.52,.13,.34,.32],[.53,.57,.34,.26]].forEach(([a,b,c,d],i)=>{cut(g,x+w*a,y+h*b,w*c,h*d,'paper');lines(g,x+w*a+10,y+h*b+22,w*c-20,i?2:4,14);oval(g,x+w*(a+c/2),y+h*b+5,3,3,'slate');});}
  function press(g){
    // Unchanged silhouette of the original hand press, at local origin.
    cut(g,16,15,36,495,'dark');cut(g,272,15,36,495,'dark');cut(g,0,0,325,55,'wood');
    cut(g,140,20,35,240,'dark');g.save();g.strokeStyle='#ba9d6f';g.lineWidth=4;for(let y=35;y<250;y+=18){g.beginPath();g.moveTo(138,y);g.lineTo(178,y+12);g.stroke();}g.restore();
    cut(g,66,256,220,28,'wood');cut(g,0,350,330,35,'wood');cut(g,36,385,24,118,'dark');cut(g,274,385,24,118,'dark');cut(g,118,124,238,17,'dark');
    cut(g,83,327,154,17,'paper');lines(g,111,335,96,1);cut(g,121,335,18,7,'ink',false);
  }
  function bookcase(g,x,y,w,h){
    cut(g,x,y,w,h,'dark');cut(g,x+10,y+10,w-20,h-20,'wood',false);
    const rowH=(h-25)/3;
    for(let j=0;j<3;j++){
      const top=y+16+j*rowH;for(let k=0;k<Math.floor((w-26)/31);k++){const bh=rowH-28-((k*17+j*9)%22);const xx=x+18+k*31;cut(g,xx,top+rowH-17-bh,22+(k%2)*4,bh,['red','green','paper','slate'][((j*2)+k)%4]);if(k%3===0)cut(g,xx+4,top+rowH-39,14,9,'paper',false);}
      cut(g,x+5,top+rowH-14,w-10,12,'dark');
    }
  }
  function openBook(g,x,y,w){poly(g,[[x,y+3],[x+w*.47,y+12],[x+w*.5,y+110],[x-6,y+100]],'paper');poly(g,[[x+w*.47,y+12],[x+w,y],[x+w+7,y+100],[x+w*.5,y+110]],'paper');lines(g,x+13,y+30,w*.31,4,17);lines(g,x+w*.59,y+27,w*.31,4,17);}
  function scroll(g,x,y,s=1){place(g,x,y,s,g=>{cut(g,-3,0,119,65,'paper');oval(g,0,32,11,32,'paper');oval(g,116,32,11,32,'paper');lines(g,23,17,60,3,13);cut(g,52,-4,8,73,'red');});}
  function quill(g,x,y){poly(g,[[x,y],[x+35,y-90],[x+55,y-103],[x+49,y-67]],'paper');g.save();g.strokeStyle='#817053';g.lineWidth=2;g.beginPath();g.moveTo(x,y+14);g.lineTo(x+43,y-87);g.stroke();g.restore();}
  function door(g,x,y,w,h){cut(g,x,y,w,h,'dark');cut(g,x+8,y+7,w-16,h-7,'wood');for(let i=1;i<5;i++)cut(g,x+8+i*(w-16)/5,y+9,2,h-12,'dark',false);cut(g,x-10,y+h,w+20,15,'paper');oval(g,x+w-25,y+h*.55,5,5,'paper');}
  function groundShadow(g,x,y,rx){
    g.save();g.fillStyle='#4f402926';g.beginPath();g.ellipse(x,y,rx,8,0,0,Math.PI*2);g.fill();g.restore();
  }
  function flatBook(g,x,y,w){g.save();g.translate(x,y);g.scale(1,.30);openBook(g,0,0,w);g.restore();}

  // Feet/top anchors keep furniture proportions coherent in both orientations.
  function vessel(g,x,top,w,h,name='glass'){
    cut(g,x-w*.25,top,w*.5,14,'paper');
    poly(g,[[x-w*.22,top+10],[x-w*.22,top+h*.23],[x-w*.48,top+h*.48],[x-w*.45,top+h],
      [x+w*.45,top+h],[x+w*.48,top+h*.48],[x+w*.22,top+h*.23],[x+w*.22,top+10]],name);
    oval(g,x,top+h*.81,w*.37,6,'paper');
  }
  function bowl(g,x,top,s=1){place(g,x,top,s,()=>{
    poly(g,[[-30,0],[30,0],[22,22],[-18,22]],'wood');oval(g,0,0,30,8,'dark');oval(g,0,0,25,5,'paper');
  });}
  function bench(g,x,feet,w){groundShadow(g,x+w/2,feet+3,w/2);
    cut(g,x+12,feet-80,15,80,'dark');cut(g,x+w-27,feet-80,15,80,'dark');
    poly(g,[[x,feet-94],[x+w-4,feet-94],[x+w+10,feet-79],[x-4,feet-79]],'wood');
    cut(g,x,feet-80,w,12,'wood');}
  function crate(g,x,feet,w,h){groundShadow(g,x+w/2,feet+3,w*.50);cut(g,x,feet-h,w,h,'wood');
    for(let i=1;i<5;i++)cut(g,x+i*w/5,feet-h+3,2,h-6,'dark',false);
    cut(g,x+5,feet-h+10,w-10,9,'dark');cut(g,x+5,feet-21,w-10,9,'dark');
  }
  function barrel(g,x,feet,w=90,h=130){groundShadow(g,x,feet+3,w/2);
    poly(g,[[x-w*.34,feet-h],[x+w*.34,feet-h],[x+w*.49,feet-h*.72],
      [x+w*.47,feet-25],[x+w*.32,feet],[x-w*.32,feet],[x-w*.47,feet-25],[x-w*.49,feet-h*.72]],'wood');
    for(const f of [.78,.25])cut(g,x-w*.46,feet-h*f,w*.92,11,'slate');
    oval(g,x,feet-h,w*.34,9,'dark');
  }
  function sack(g,x,feet,s=1){place(g,x,feet,s,()=>{groundShadow(g,0,3,46);
    poly(g,[[-17,-145],[20,-145],[13,-122],[42,-82],[48,-10],[31,0],[-32,0],[-47,-13],[-41,-84],[-13,-122]],'paper');
    cut(g,-19,-127,38,7,'dark');lines(g,-25,-76,49,2,17);});}
  function basket(g,x,top,s=1){place(g,x,top,s,()=>{
    poly(g,[[-53,0],[53,0],[38,43],[-40,43]],'wood');oval(g,0,0,53,12,'dark');
    for(let k=0;k<5;k++)oval(g,-34+k*17,-6+(k%2)*3,12,9,'paper');
    for(let y=13;y<36;y+=10)cut(g,-41,y,82,3,'paper',false);
  });}
  function bed(g,x,feet,w){groundShadow(g,x+w/2,feet+4,w*.5);
    cut(g,x+9,feet-140,13,140,'dark');cut(g,x+w-23,feet-110,13,110,'dark');
    cut(g,x,feet-150,w*.16,80,'wood');cut(g,x+8,feet-74,w-16,22,'wood');
    poly(g,[[x+18,feet-90],[x+w-18,feet-90],[x+w-8,feet-75],[x+8,feet-75]],'paper');
    poly(g,[[x+65,feet-87],[x+w-18,feet-87],[x+w-11,feet-39],[x+63,feet-39]],'green');
    oval(g,x+42,feet-86,27,8,'paper');
  }
  function loom(g,x,feet,s=1){place(g,x,feet,s,()=>{
    groundShadow(g,140,3,148);cut(g,5,-472,22,472,'dark');cut(g,257,-472,22,472,'dark');
    cut(g,-8,-480,300,27,'wood');cut(g,0,-75,286,23,'wood');
    for(let i=0;i<18;i++)cut(g,38+i*11,-442,2,316,'paper',false);
    cut(g,28,-180,229,113,'paper');for(let i=0;i<6;i++)cut(g,30,-169+i*16,225,5,i%2?'red':'green',false);
    cut(g,26,-260,233,14,'wood');cut(g,102,-57,72,11,'wood');
  });}
  function tools(g,x,y,w){cut(g,x,y,w,12,'wood');
    cut(g,x+25,y-15,10,91,'dark');cut(g,x+5,y-18,52,19,'slate');
    poly(g,[[x+w-38,y+15],[x+w-10,y+15],[x+w-5,y+75],[x+w-50,y+91]],'slate');
    cut(g,x+w-42,y-5,37,22,'wood');}
  function plane(g,x,top,s=1){place(g,x,top,s,()=>{
    poly(g,[[-42,-21],[34,-21],[51,0],[-45,0]],'wood');cut(g,-3,-43,12,24,'slate');
    cut(g,22,-31,15,19,'dark');});}
  function plant(g,x,base,s=1){place(g,x,base,s,()=>{
    poly(g,[[-26,-39],[27,-39],[18,0],[-17,0]],'red');oval(g,0,-39,26,7,'dark');
    cut(g,-3,-155,6,116,'green',false);
    poly(g,[[0,-78],[-43,-123],[-15,-126],[0,-98]],'green');
    poly(g,[[0,-103],[40,-148],[23,-153],[0,-128]],'green');
  });}
  function specimenCabinet(g,x,feet,w){bookcase(g,x,feet-375,w,375);
    // Glass-front specimen slots replace the book rows in this new cabinet only.
    for(let j=0;j<3;j++){cut(g,x+14,feet-358+j*117,w-28,99,'glass',false);
      vessel(g,x+w*.32,feet-342+j*117,34,70);vessel(g,x+w*.68,feet-332+j*117,30,60);}}
  function rug(g,x,y,w,h){poly(g,[[x+27,y],[x+w-27,y],[x+w,y+h],[x,y+h]],'red');
    poly(g,[[x+42,y+16],[x+w-42,y+16],[x+w-23,y+h-16],[x+23,y+h-16]],'paper');
    poly(g,[[x+57,y+24],[x+w-57,y+24],[x+w-40,y+h-24],[x+40,y+h-24]],'green');}
  function portrait(g,x,y,w,h){cut(g,x,y,w,h,'wood');cut(g,x+10,y+10,w-20,h-20,'paper');
    cut(g,x+20,y+20,w-40,h-40,'green',false);
    oval(g,x+w*.50,y+h*.36,w*.14,h*.16,'paper');
    poly(g,[[x+w*.24,y+h*.83],[x+w*.33,y+h*.54],[x+w*.64,y+h*.52],[x+w*.80,y+h*.83]],'red');}
  function highChair(g,x,feet,s=1){place(g,x,feet,s,()=>{groundShadow(g,55,4,66);
    cut(g,0,-300,115,208,'wood');cut(g,13,-282,89,175,'red');
    cut(g,9,-98,16,98,'dark');cut(g,89,-98,16,98,'dark');
    cut(g,-12,-150,24,90,'wood');cut(g,102,-150,24,90,'wood');
    cut(g,-15,-155,43,13,'wood');cut(g,86,-155,43,13,'wood');cut(g,-2,-111,121,29,'red');});}
  function stove(g,x,feet,s=1){place(g,x,feet,s,()=>{groundShadow(g,62,3,70);
    cut(g,36,-438,54,221,'paper');cut(g,0,-246,144,246,'paper');cut(g,20,-133,94,96,'dark');
    poly(g,[[35,-44],[39,-80],[57,-62],[73,-99],[86,-61],[104,-43]],'red');
    cut(g,-9,-245,161,19,'slate');cut(g,-6,-18,154,18,'slate');});}
  function closedCabinet(g,x,feet,w,h){groundShadow(g,x+w/2,feet+4,w*.51);
    cut(g,x+8,feet-24,16,24,'dark');cut(g,x+w-24,feet-24,16,24,'dark');cut(g,x,feet-h,w,h-19,'wood');
    for(let j=0;j<2;j++){cut(g,x+11+j*w/2,feet-h+13,w/2-19,h-50,'paper');
      cut(g,x+18+j*w/2,feet-h+22,w/2-33,h-68,'wood');}
    oval(g,x+w/2-13,feet-h*.48,4,4,'paper');oval(g,x+w/2+13,feet-h*.48,4,4,'paper');}
  function balance(g,x,base,s=1){place(g,x,base,s,()=>{
    cut(g,-23,-10,46,10,'dark');cut(g,-4,-110,8,105,'wood');cut(g,-64,-109,128,8,'slate');
    for(const px of [-50,50]){g.save();g.strokeStyle='#604c38';g.lineWidth=2;g.beginPath();g.moveTo(px,-105);g.lineTo(px-22,-47);g.moveTo(px,-105);g.lineTo(px+22,-47);g.stroke();g.restore();
      poly(g,[[px-24,-48],[px+24,-48],[px+14,-35],[px-14,-35]],'slate');}
  });}
  function shelf(g,x,y,w,mode='cloth'){cut(g,x,y,w,15,'wood');
    for(let i=0;i<4;i++){if(mode==='jars')vessel(g,x+35+i*(w-60)/3,y-81,38,79);
      else{cut(g,x+9+i*(w-20)/4,y-31,(w-34)/4,31,i%2?'paper':'green');cut(g,x+13+i*(w-20)/4,y-16,(w-44)/4,3,'red',false);}}
  }
  function musicStand(g,x,feet){groundShadow(g,x,feet+3,62);cut(g,x-5,feet-208,10,196,'dark');
    poly(g,[[x-51,feet],[x-6,feet-23],[x+5,feet-23],[x+52,feet]],'dark');
    poly(g,[[x-66,feet-287],[x+62,feet-287],[x+69,feet-205],[x-72,feet-205]],'wood');
    cut(g,x-51,feet-276,98,60,'paper');lines(g,x-39,feet-260,76,3,11);
  }
  function cannon(g,x,feet,s=1){place(g,x,feet,s,()=>{groundShadow(g,147,4,163);
    cut(g,64,-82,179,41,'wood');poly(g,[[25,-94],[287,-118],[291,-82],[27,-62]],'slate');
    for(const px of [82,226]){oval(g,px,-34,33,34,'dark');oval(g,px,-34,21,22,'wood');oval(g,px,-34,6,6,'slate');}
  });}
  function rope(g,x,y,r){g.save();g.strokeStyle='#bca276';g.lineWidth=5;
    for(let i=0;i<4;i++){g.beginPath();g.ellipse(x,y,r-i*7,(r-i*7)*.38,0,0,Math.PI*2);g.stroke();}g.restore();}
  function tabletop(g,t,items){groundShadow(g,t.x+t.w/2,t.top+t.h+3,t.w*.49);
    table(g,t.x,t.top,t.w,t.h);items(t.x,t.top,t.w);}
  function roomFurniture(g,id,tall,floor){
    // Main rear object rests just in front of the wall/floor junction.
    const bx=tall?244:770, feet=floor+37;
    const T=tall?{x:240,top:808,w:414,h:168}:{x:365,top:476,w:347,h:174};
    if(id==='barnhus'){
      bed(g,bx,feet,188);bed(g,bx+222,feet,188);
      windowPane(g,bx+20,floor-352,177,182);
      cut(g,bx+264,floor-310,83,9,'wood');cut(g,bx+289,floor-301,34,79,'paper');
      tabletop(g,T,(x,y,w)=>{bowl(g,x+65,y-23,.82);bowl(g,x+w*.49,y-23,.82);bowl(g,x+w-70,y-23,.82);
        cut(g,x+w*.44,y-3,86,10,'paper');});
    }else if(id==='church'){
      // 1700-talskyrkans pappersträ, höga spröjsade fönster och predikstol.
      const xx=tall?308:813;
      cut(g,xx,floor-386,tall?149:176,269,'slate');
      cut(g,xx+11,floor-374,tall?127:154,245,'glass',false);
      cut(g,xx+(tall?65:80),floor-373,11,243,'wood',false);
      cut(g,xx+13,floor-264,tall?123:149,12,'wood');
      cut(g,xx+208,floor-230,121,203,'wood');
      cut(g,xx+215,floor-245,107,49,'green');
      flatBook(g,xx+228,floor-271,100);
      bench(g,tall?76:236,tall?932:659,tall?205:207);
      bench(g,tall?390:1006,tall?932:659,tall?193:197);
    }else if(id==='workshop'){
      loom(g,bx+125,feet,.97);tools(g,bx-13,floor-296,117);
      tabletop(g,T,(x,y,w)=>{cut(g,x+27,y-13,w-53,9,'paper');plane(g,x+w*.46,y-17,1.1);
        cut(g,x+w-65,y-60,10,49,'dark');cut(g,x+w-85,y-66,52,17,'slate');
        cut(g,x+31,y+8,40,68,'dark');cut(g,x+18,y+4,70,18,'wood');});
    }else if(id==='science'){
      windowPane(g,bx,floor-371,181,210);specimenCabinet(g,bx+224,feet,192);
      tabletop(g,T,(x,y,w)=>{plant(g,x+61,y-18,.87);vessel(g,x+w-51,y-124,59,108);flatBook(g,x+w*.39,y-32,117);});
    }else if(id==='opera'){
      const sx=bx,sw=418,sy=floor-371,base=feet;
      cut(g,sx,sy,sw,base-sy,'dark');cut(g,sx+75,sy+35,sw-150,base-sy-53,'paper');
      poly(g,[[sx,sy],[sx+106,sy],[sx+70,sy+107],[sx+80,base-10],[sx,base-10]],'red');
      poly(g,[[sx+sw-106,sy],[sx+sw,sy],[sx+sw,base-10],[sx+sw-80,base-10],[sx+sw-70,sy+107]],'red');
      cut(g,sx-8,sy-4,sw+16,24,'wood');cut(g,sx-12,base-7,sw+24,21,'wood');
      const fx=tall?444:526,ff=tall?968:677;musicStand(g,fx,ff);bench(g,fx+97,ff-12,105);
    }else if(id==='palace'){
      // Royal chamber: tall red drapes, portrait, writing table and an empty high chair.
      const px=bx+46,py=floor-405;
      poly(g,[[px-28,py-11],[px+282,py-10],[px+269,py+19],[px-14,py+19]],'wood');
      poly(g,[[px-24,py+12],[px+17,py+11],[px+12,py+253],[px-27,py+242]],'red');
      poly(g,[[px+247,py+12],[px+290,py+11],[px+293,py+244],[px+249,py+252]],'red');
      cut(g,px+72,py-24,103,19,'paper');
      oval(g,px+122,py-14,17,12,'red');
      portrait(g,bx+46,floor-405,251,236);
      highChair(g,bx+180,feet+41,.95);
      rug(g,tall?228:360,tall?818:534,tall?422:358,tall?160:150);
      // Kapitel 1-pilot: Amiras arbetsbord syns i samma rum som närbilden.
      tabletop(g,T,(x,y,w)=>{
        flatBook(g,x+26,y-34,Math.min(164,w*.49));
        scroll(g,x+w*.57,y-29,.67);
        material(g,'ink',x+w-48,y-17,.62);
        quill(g,x+w-51,y-54);
      });
    }else if(id==='riksdag'){
      // Parliament: four distinct suspended estate banners, benches, tall
      // windows and the raised protocol lectern (no throne or royal portrait).
      // Hanging paper banners belong on the clear wall, never behind or
      // across window openings. The wide room has free wall at x=238–672;
      // the portrait room has free wall at x=486–716.
      const banners=tall?[489,543,597,651]:[240,348,456,564];
      banners.forEach((x,i)=>{
        const y=tall?55:63,w=tall?47:89,h=tall?108:140;
        poly(g,[[x,y],[x+w,y],[x+w,y+h-20],[x+w*.5,y+h],[x,y+h-20]],i%2?'slate':'green');
        cut(g,x+9,y+12,w-18,6,'paper',false);
        oval(g,x+w*.5,y+h*.48,tall?10:15,tall?13:18,'paper');
        oval(g,x+w*.5,y+h*.48,tall?6:9,tall?8:11,'red');
      });
      // No reused throne room: benches, raised speakers' desk and the assembly record.
      const ox=tall?119:690;
      for(let i=0;i<3;i++){
        cut(g,ox+i*124,floor-367,105,218,'wood');
        cut(g,ox+10+i*124,floor-353,85,192,'green');
        cut(g,ox+42+i*124,floor-352,8,192,'wood',false);
      }
      cut(g,ox-16,floor-151,418,19,'slate');
      cut(g,bx+215,floor-187,139,181,'dark');
      cut(g,bx+227,floor-200,114,40,'wood');
      cut(g,bx+240,floor-217,89,16,'paper');
      lines(g,bx+256,floor-206,58,2,8);
      bench(g,tall?94:243,tall?899:675,tall?240:215);
      bench(g,tall?408:913,tall?899:675,tall?220:204);
      tabletop(g,T,(x,y,w)=>{
        flatBook(g,x+16,y-29,Math.min(158,w*.48));
        scroll(g,x+w*.53,y-28,.72);
        material(g,'ink',x+w-50,y-18,.65);
        quill(g,x+w-54,y-50);
      });
    }else if(id==='homes'){
      windowPane(g,bx,floor-339,170,194);stove(g,bx+265,feet,.93);
      bench(g,bx,feet+30,174);
      tabletop(g,T,(x,y,w)=>{bowl(g,x+66,y-23);basket(g,x+w-95,y-24,.80);});
    }else if(id==='farm'){
      windowPane(g,bx+12,floor-369,180,180);tools(g,bx+256,floor-271,133);
      sack(g,bx+40,feet,1);sack(g,bx+135,feet,.85);crate(g,bx+255,feet,159,131);
      tabletop(g,T,(x,y,w)=>{basket(g,x+w*.63,y-27,.95);cut(g,x+35,y-22,73,15,'paper');});
    }else if(id==='manor'){
      windowPane(g,bx,floor-386,168,226);closedCabinet(g,bx+234,feet,181,375);
      tabletop(g,T,(x,y,w)=>{flatBook(g,x+35,y-34,163);material(g,'ink',x+w-60,y-13,.75);quill(g,x+w-60,y-49);});
    }else if(id==='fort'){
      // Architecture/objects are scenography only; no weapons interaction.
      cut(g,bx+26,floor-371,261,193,'slate');cut(g,bx+65,floor-356,181,160,'glass');
      cut(g,bx+59,floor-196,194,18,'paper');cannon(g,bx+10,feet,1.13);
      tabletop(g,T,(x,y,w)=>{flatBook(g,x+42,y-34,187);scroll(g,x+w-137,y-27,.64);});
    }else if(id==='marstrandHarbor'){
      windowPane(g,bx+13,floor-347,191,196);barrel(g,bx+294,feet,97,147);crate(g,bx+29,feet,148,104);
      tabletop(g,T,(x,y,w)=>{balance(g,x+97,y-12,.92);flatBook(g,x+w-165,y-34,133);});
    }else if(id==='townShop'){
      shelf(g,bx+13,floor-237,374);shelf(g,bx+13,floor-362,374,'jars');
      crate(g,bx+243,feet,163,129);
      tabletop(g,T,(x,y,w)=>{cut(g,x+30,y-35,131,29,'green');cut(g,x+44,y-9,104,13,'red');balance(g,x+w-86,y-13,.83);});
    }else if(id==='gustavia'){
      windowPane(g,bx+5,floor-368,174,223);
      // Shutters, not a modern glazed office front.
      for(const xx of [bx-25,bx+183]){cut(g,xx,floor-374,25,229,'green');}
      closedCabinet(g,bx+237,feet,170,343);
      tabletop(g,T,(x,y,w)=>{scroll(g,x+45,y-37,.92);flatBook(g,x+w-181,y-34,137);material(g,'ink',x+w-36,y-18,.57);});
    }else if(id==='colonyHarbor'){
      shelf(g,bx+26,floor-259,342);crate(g,bx+20,feet,190,132);crate(g,bx+32,feet-134,166,118);
      barrel(g,bx+325,feet,102,166);
      const fx=tall?283:413,ff=tall?963:668;crate(g,fx,ff,tall?270:240,149);rope(g,fx+116,ff-153,49);
    }else if(id==='trading'){
      shelf(g,bx+13,floor-354,371);shelf(g,bx+13,floor-216,371,'jars');barrel(g,bx+327,feet,95,123);
      tabletop(g,T,(x,y,w)=>{balance(g,x+w*.31,y-16,1.03);flatBook(g,x+w-163,y-34,139);});
    }
  }
  function newScene(g,id,w,h){
    const tall=w/h<1.02,D=tall?{w:720,h:1040}:{w:1280,h:720};
    const scale=Math.min(w/D.w,h/D.h),ox=(w-D.w*scale)/2,oy=(h-D.h*scale)/2;
    const floor=tall?650:500,screenFloor=oy+floor*scale;
    g.fillStyle=mat(g,'wall');g.fillRect(0,0,w,h);g.fillStyle=mat(g,'floor');g.fillRect(0,screenFloor,w,h-screenFloor);
    g.save();g.translate(ox,oy);g.scale(scale,scale);
    const left=-ox/scale,right=(w-ox)/scale,bottom=(h-oy)/scale;
    cut(g,left,floor-8,right-left,10,'wood',false);
    let gap=30;for(let y=floor+gap;y<bottom;y+=gap){g.save();g.strokeStyle='#78644544';g.lineWidth=1.5;
      g.beginPath();g.moveTo(left,y);g.lineTo(right,y);g.stroke();g.restore();gap+=12;}
    cut(g,left,33,right-left,14,'wood',false);
    const exit=tall?{x:48,y:320,w:132,h:330}:{x:60,y:170,w:145,h:330};door(g,exit.x,exit.y,exit.w,exit.h);
    roomFurniture(g,id,tall,floor);g.restore();
    return {x:ox+exit.x*scale,y:oy+exit.y*scale,w:exit.w*scale,h:(exit.h+15)*scale};
  }

  // Nearviews are painted with the *same* cut-paper primitives and source-image
  // pigment/fibres as the rooms. A memory scene is not a flat SVG or brown cover.
  function renderMemoryCloseup(canvas,placeId){
    if(!['cafe','palace','quay','riksdag','archive','church','barnhus'].includes(placeId))return false;
    const bounds=canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);
    if(!bounds.width||!bounds.height)return false;
    const W=Math.round(bounds.width*d),H=Math.round(bounds.height*d);
    if(canvas.width!==W)canvas.width=W;if(canvas.height!==H)canvas.height=H;
    const g=canvas.getContext('2d');
    if(!g)return false;
    g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,bounds.width,bounds.height);
    g.save();g.scale(bounds.width/1280,bounds.height/720);
    const rect=(x,y,w,h,t)=>cut(g,x,y,w,h,t,false);
    const plank=(y,n=5)=>{for(let i=0;i<n;i++){
      rect(0,y+i*88+(i%2?2:0),1280,5,'dark');
      for(let k=0;k<5;k++)rect(k*275+(i%3)*41,y+15+i*88,3,63,'dark');
    }};
    const documentSheet=(x,y,w,h)=>{
      g.save();g.translate(x,y);
      poly(g,[[4,6],[w*.4,0],[w-3,7],[w,h*.48],[w-5,h],[w*.43,h+2],[-4,h-2],[-2,h*.36]],'paper');
      cut(g,22,21,w*.55,5,'ink',false);
      lines(g,22,58,w-59,6,22);
      oval(g,w-57,h-53,30,29,'red');oval(g,w-57,h-53,15,14,'wood');
      g.restore();
    };
    const rope=(x,y,r)=>{
      g.save();g.lineWidth=13;g.strokeStyle=mat(g,'paper');
      for(let i=0;i<4;i++){g.beginPath();g.ellipse(x,y-i*6,r-i*4,r*.43-i*1.5,-.2,0,Math.PI*2);g.stroke()}
      g.restore();
    };
    if(placeId==='palace'){
      rect(0,0,1280,720,'wall');
      // Part of Amira's royal room: tapestry, framed portrait, deep wooden desk.
      cut(g,100,3,354,259,'dark');
      cut(g,119,17,318,222,'paper');
      cut(g,128,27,298,199,'green');
      oval(g,279,116,47,53,'paper');
      poly(g,[[190,220],[224,157],[326,155],[373,222]],'red');
      cut(g,0,270,1280,19,'wood');
      cut(g,0,303,1280,417,'wood');
      plank(339,5);
      // Desk is a close look at the actual papers visible beside Amira.
      cut(g,38,414,384,255,'dark');
      cut(g,55,423,352,222,'red');
      documentSheet(484,343,372,292);
      material(g,'ink',1115,435,2.1);
      quill(g,1127,437);
      oval(g,175,558,64,61,'red');oval(g,175,558,32,31,'wood');
      place(g,854,145,1.4,()=>{
        cut(g,0,0,172,155,'wood');
        cut(g,24,22,124,110,'red');
        oval(g,85,42,25,18,'paper');
      });
    }else if(placeId==='riksdag'){
      rect(0,0,1280,720,'wall');
      // Three ranks of benches and the record-keeper's desk distinguish this
      // from the royal room (no portraits, throne, wax seal or tapestry).
      for(let i=0;i<4;i++){
        const x=35+i*314;
        cut(g,x,68,270,210,'wood');
        cut(g,x+14,78,240,179,'green');
        cut(g,x+117,83,10,165,'wood',false);
      }
      cut(g,0,282,1280,19,'slate');
      for(let i=0;i<3;i++){
        const y=320+i*73;
        cut(g,0,y,1280,21,i%2?'dark':'wood');
        cut(g,20,y+24,1240,37,'wood');
      }
      rect(0,525,1280,195,'wood');plank(547,2);
      documentSheet(456,343,405,296);
      cut(g,955,256,241,270,'dark');
      cut(g,971,268,210,58,'wood');
      cut(g,999,289,155,16,'paper');
      material(g,'ink',1070,431,2.0);
      quill(g,1083,429);
      // Assembly benches and raised table are deliberately distinct.
    }else if(placeId==='church'){
      rect(0,0,1280,720,'wall');
      cut(g,102,17,263,329,'slate');cut(g,120,32,229,294,'glass');
      cut(g,216,39,22,277,'wood',false);cut(g,119,164,233,17,'wood');
      cut(g,695,19,172,351,'dark');
      poly(g,[[681,32],[875,32],[886,108],[673,108]],'green');
      for(let y=398;y<619;y+=87){cut(g,40,y,1192,25,'wood');cut(g,74,y+26,1105,36,'dark');}
      rect(0,551,1280,169,'wood');plank(570,2);
      documentSheet(420,332,393,295);
      flatBook(g,991,426,171);material(g,'ink',1136,484,1.4);
    }else if(placeId==='barnhus'){
      rect(0,0,1280,720,'wall');windowPane(g,70,25,284,271);
      cut(g,792,60,342,366,'dark');cut(g,805,76,317,337,'paper');
      for(let y=106;y<370;y+=52)cut(g,821,y,283,8,'wood');
      cut(g,0,381,1280,339,'wood');plank(414,3);
      cut(g,45,443,426,244,'dark');cut(g,62,451,392,222,'wood');
      for(let i=0;i<4;i++)poly(g,[[119+i*65,506],[168+i*65,495],[197+i*65,566],[130+i*65,581]],i%2?'green':'paper');
      cut(g,536,435,406,226,'wood');documentSheet(557,436,347,202);
      bowl(g,1080,471,1.28);material(g,'paper',1012,605,1.0);
    }else if(placeId==='archive'){
      rect(0,0,1280,720,'wall');
      windowPane(g,49,45,252,285);
      // Archive shelves, bound volumes and Rut's reading desk.
      bookcase(g,840,57,344,340);
      rect(0,382,1280,338,'wood');plank(425,3);
      cut(g,125,360,300,260,'dark');
      cut(g,149,379,255,205,'wood');
      documentSheet(468,349,358,293);
      material(g,'ink',1034,440,2.2);
      quill(g,1070,449);
      flatBook(g,125,413,206);
    }else if(placeId==='quay'){
      rect(0,0,1280,720,'glass');
      // Real harbour sky, open water, ship's sail and rough cut planks.
      cut(g,0,177,1280,251,'green');
      for(const y of [221,265,311,371])rect(0,y,1280,3,'paper');
      cut(g,888,12,20,358,'wood');
      poly(g,[[902,28],[1038,291],[911,291]],'paper');
      cut(g,0,397,1280,323,'wood');plank(418,4);
      crate(g,929,653,245,233);
      barrel(g,279,656,304,382);
      material(g,'ink',1114,506,1.3);
      rope(445,561,95);
      documentSheet(497,426,274,209);
      // Actual loading ropes, not an office desk or palace document.
    }else{
      rect(0,0,1280,720,'wall');
      windowPane(g,55,52,304,263);
      cut(g,404,0,20,340,'wood');
      cut(g,435,53,316,261,'paper');
      noticeBoard(g,494,67,213,197);
      rect(0,348,1280,372,'wood');plank(384,4);
      documentSheet(445,368,375,265);
      cup(g,208,485,2.5);
      bowl(g,997,496,2.0);
      cut(g,924,540,201,128,'paper');
      lines(g,948,574,153,4,20);
    }
    g.restore();
    return true;
  }

  function render(canvas,id){
    if(Object.prototype.hasOwnProperty.call(approved.names,id))return approved.render(canvas,id);
    if(!extraNames[id])throw new Error('Okänd interiör: '+id);
    const r=canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);if(!r.width||!r.height)return null;
    const w=Math.round(r.width*d),h=Math.round(r.height*d);if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;
    const g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,r.width,r.height);return newScene(g,id,r.width,r.height);
  }
  window.UPPDRAG_ROOM_ART={names:{...approved.names,...extraNames},descriptions,render,renderMemoryCloseup,
    ready:Promise.all([approved.ready,fibres.ready]).then(v=>v.every(Boolean)),
    get originalLoaded(){return fibres.loaded&&approved.originalLoaded;}};
})();
