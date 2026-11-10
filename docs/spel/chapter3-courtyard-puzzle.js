/* The courtyard uses the same snapped positions for drawing and access checks. */
(function(){
'use strict';
const slots={
 wall:{x:80,y:110,label:'Vid vänstra väggen'},
 east:{x:560,y:110,label:'Vid högra väggen'},
 corner:{x:85,y:325,label:'I främre hörnet'},
 bench:{x:280,y:225,label:'Framför bänken'},
 door:{x:440,y:90,label:'Vid dörren'},
 path:{x:440,y:310,label:'På gången från grinden'}
};
const free=[{x:398,y:0,w:94,h:165},{x:395,y:150,w:105,h:270},{x:175,y:180,w:195,h:110}];
const rect=id=>slots[id]?{x:slots[id].x-35,y:slots[id].y-42.5,w:70,h:85}:null;
const overlaps=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
function check(layout){
 const a=rect(layout?.a),b=rect(layout?.b);
 if(!a||!b||overlaps(a,b))return {ok:false,reason:'Tunnorna behöver var sin plats.'};
 if([a,b].some(r=>free.some(f=>overlaps(r,f))))return {ok:false,reason:'Där kommer jag inte förbi. Lämna dörren, gången och platsen framför bänken fria.'};
 return {ok:true};
}
window.UPPDRAG_CH3_COURTYARD_PUZZLE={slots,free,check,initial:{a:'bench',b:'path'},example:{a:'wall',b:'east'}};
})();
