/* Geometry for a free, untimed cloth puzzle. Colour never affects coverage. */
(function(root){
'use strict';
const required={x:233,y:83,w:134,h:114};
const pieces={wide:{label:'Bred tygbit',w:180,h:150},left:{label:'Smal tygbit A',w:94,h:150},right:{label:'Smal tygbit B',w:94,h:150},small:{label:'Liten tygbit',w:70,h:50}};
function covers(layout){
 const rects=Object.entries(layout||{}).filter(([id,p])=>pieces[id]&&Number.isFinite(p?.x)&&Number.isFinite(p?.y)).map(([id,p])=>({x:p.x-pieces[id].w/2,y:p.y-pieces[id].h/2,w:pieces[id].w,h:pieces[id].h}));
 const xs=[required.x,required.x+required.w,...rects.flatMap(r=>[r.x,r.x+r.w]).filter(x=>x>required.x&&x<required.x+required.w)].sort((a,b)=>a-b);
 for(let i=1;i<xs.length;i++){
  if(xs[i]===xs[i-1])continue;const mid=(xs[i]+xs[i-1])/2,ys=rects.filter(r=>r.x<=mid&&r.x+r.w>=mid).map(r=>[r.y,r.y+r.h]).sort((a,b)=>a[0]-b[0]);
  let y=required.y;for(const [a,b]of ys){if(a>y)break;y=Math.max(y,b);}
  if(y<required.y+required.h)return false;
 }
 return true;
}
root.UPPDRAG_CH2_QUILT={required,pieces,covers};if(typeof module!=='undefined')module.exports=root.UPPDRAG_CH2_QUILT;
})(typeof window!=='undefined'?window:globalThis);
