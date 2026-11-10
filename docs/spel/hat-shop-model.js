/* Cosmetic ownership is shared by chapters inside the current save scope. */
(function(root){
'use strict';
const catalog=Object.freeze([
 {id:'plain',name:'Min gamla hatt',kind:'plain',color:'#466b70',price:0},
 {id:'green-cap',name:'Grön mössa',kind:'cap',color:'#62764b',price:10},
 {id:'red-cap',name:'Röd mössa',kind:'cap',color:'#9a5145',price:10},
 {id:'tricorn',name:'Svart trekantshatt',kind:'tricorn',color:'#393b38',price:20}
].map(Object.freeze));
const find=id=>catalog.find(item=>item.id===id);
function create(raw={},hooks={}){
 const owned=new Set(['plain',...(Array.isArray(raw?.owned)?raw.owned:[]).filter(id=>find(id))]);
 let equipped=owned.has(raw?.equipped)?raw.equipped:'plain',locked=false;
 const snapshot=()=>({v:1,owned:catalog.filter(h=>owned.has(h.id)).map(h=>h.id),equipped});
 const save=()=>hooks.save?.(snapshot());
 function equip(id){if(!owned.has(id))return {ok:false,reason:'unowned'};equipped=id;save();return {ok:true,item:find(id),paid:0};}
 function buy(id){
  const item=find(id);if(!item)return {ok:false,reason:'unknown'};
  if(locked)return {ok:false,reason:'busy'};
  if(!hooks.canBuy?.())return {ok:false,reason:'away'};
  if(owned.has(id))return equip(id);
  const balance=hooks.wallet?.();
  if(!Number.isSafeInteger(balance)||balance<item.price)return {ok:false,reason:'funds'};
  locked=true;
  try{
   if(hooks.debit?.(item.price,balance)!==true)return {ok:false,reason:'wallet'};
   owned.add(id);equipped=id;save();return {ok:true,item,paid:item.price};
  }finally{locked=false;}
 }
 return {buy,equip,snapshot,owns:id=>owned.has(id),get wear(){return find(equipped);}};
}
root.UPPDRAG_HAT_SHOP_MODEL={catalog,create};
})(window);
