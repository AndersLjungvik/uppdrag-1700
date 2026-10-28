/* Persisted pacing and coin accounting for returning pickpockets. */
(function(root){
'use strict';
const bounded=(n,max,fallback=0)=>Number.isFinite(n)?Math.max(0,Math.min(max,n)):fallback;
function create(state,balance,random=Math.random){
 const completed=()=>['won','lost','ignored'].includes(state.thief);
 const previous=state.recurrence?.v===1?state.recurrence:null;
 const rest=()=>30000+Math.floor(random()*20000);
 const travel=()=>450+Math.floor(random()*300);
 const r=state.recurrence={v:1,
  wallet:bounded(previous?.wallet,1e9,balance),
  earned:previous?.earned===true,
  rest:bounded(previous?.rest,50000,completed()?rest():0),
  nextDistance:bounded(previous?.nextDistance,1e9,completed()?state.distance+travel():0),
  encounters:Math.floor(bounded(previous?.encounters,1e6,state.thiefSeen||completed()?1:0)),
  unclaimed:Math.floor(bounded(previous?.unclaimed,1e6))
 };
 // Old lost rounds and interrupted saved chases each leave one real coin.
 if(state.thief==='lost'&&state.stolenDaler){r.unclaimed++;state.stolenDaler=false;}
 function observe(amount){
  if(amount===r.wallet)return false;
  if(amount>r.wallet&&state.thief!=='unseen'&&!r.earned){r.earned=true;r.nextDistance=Math.max(r.nextDistance,state.distance+travel());}
  r.wallet=amount;return true;
 }
 function ownWallet(amount){r.wallet=amount;}
 function start(){r.earned=false;r.encounters++;}
 function finish(lost,distance){if(lost)r.unclaimed++;r.rest=rest();r.nextDistance=distance+travel();}
 function advance(ms){const old=r.rest;r.rest=Math.max(0,r.rest-ms);return Math.ceil(old/1000)!==Math.ceil(r.rest/1000);}
 function ready(distance,amount){return completed()&&r.earned&&r.rest===0&&distance>=r.nextDistance&&amount>0;}
 function claim(){if(!r.unclaimed)return false;r.unclaimed--;return true;}
 function reset(amount){r.wallet=amount;r.earned=false;r.rest=0;r.nextDistance=0;r.encounters=0;r.unclaimed=0;}
 return {observe,ownWallet,start,finish,advance,ready,claim,reset,get unclaimed(){return r.unclaimed;},get encounters(){return r.encounters;}};
}
root.UPPDRAG_EVENT_RECURRENCE={create};
if(typeof module!=='undefined')module.exports={create};
})(typeof window!=='undefined'?window:globalThis);
