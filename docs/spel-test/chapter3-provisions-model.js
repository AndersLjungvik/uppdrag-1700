/* Optional provision trade. Purse, parcel and apple are committed together in
 * the existing pilot save; no knowledge answers or stamps are changed. */
(function(root){
'use strict';
const PRICE=5;
function create(state,hooks={}){
 const raw=state.provisions||{};
 const serial=Number.isSafeInteger(raw.serial)&&raw.serial>=0?raw.serial:0;
 state.provisions={v:1,serial,carrying:typeof raw.carrying==='string'&&/^parcel-\d+$/.test(raw.carrying)?raw.carrying:null,delivered:Number.isSafeInteger(raw.delivered)&&raw.delivered>=0?raw.delivered:0};
 let locked=false;const snapshot=()=>({...state.provisions});
 function buy(){
  if(locked)return {ok:false,reason:'busy'};
  if(!hooks.atWagon?.())return {ok:false,reason:'away'};
  if(state.provisions.carrying)return {ok:false,reason:'carrying'};
  if(!Number.isSafeInteger(state.daler)||state.daler<PRICE)return {ok:false,reason:'funds'};
  locked=true;try{state.daler-=PRICE;state.provisions.serial++;state.provisions.carrying='parcel-'+state.provisions.serial;hooks.save?.();return {ok:true,paid:PRICE};}finally{locked=false;}
 }
 function deliver(){
  if(locked)return {ok:false,reason:'busy'};
  if(!hooks.atSquare?.())return {ok:false,reason:'away'};
  if(!state.provisions.carrying)return {ok:false,reason:'empty'};
  if(!Number.isSafeInteger(state.apples)||state.apples<0)return {ok:false,reason:'wallet'};
  locked=true;try{state.apples++;state.provisions.carrying=null;state.provisions.delivered++;hooks.save?.();return {ok:true,apples:1};}finally{locked=false;}
 }
 return {buy,deliver,snapshot};
}
root.UPPDRAG_CH3_PROVISIONS_MODEL={create,price:PRICE,reward:1};
})(typeof window==='undefined'?globalThis:window);
