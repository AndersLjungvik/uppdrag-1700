/* Persisted pacing and purse accounting for returning pickpockets. */
(function(root){
'use strict';
const bounded=(n,max,fallback=0)=>Number.isFinite(n)?Math.max(0,Math.min(max,n)):fallback;
const coins=n=>Math.floor(bounded(Number(n),1e9));
function theftAmount(balance){const amount=coins(balance);return amount>=3?Math.ceil(amount/2):0;}
function create(state,balance,random=Math.random){
 const completed=()=>['won','lost','ignored'].includes(state.thief);
 const previous=[1,2].includes(state.recurrence?.v)?state.recurrence:null;
 const purses=previous?.v===2&&Array.isArray(previous.purses)?previous.purses
  .filter(p=>coins(p?.amount)>0&&Number.isInteger(p?.count)&&p.count>0)
  .map(p=>({amount:coins(p.amount),count:Math.floor(bounded(p.count,1e6))})):
  coins(previous?.unclaimed)?[{amount:1,count:coins(previous.unclaimed)}]:[];
 const rest=()=>30000+Math.floor(random()*20000);
 const travel=()=>450+Math.floor(random()*300);
 const r=state.recurrence={v:2,
  wallet:bounded(previous?.wallet,1e9,balance),
  earned:previous?.earned===true,
  rest:bounded(previous?.rest,50000,completed()?rest():0),
  nextDistance:bounded(previous?.nextDistance,1e9,completed()?state.distance+travel():0),
  encounters:Math.floor(bounded(previous?.encounters,1e6,state.thiefSeen||completed()?1:0)),
  purses,unclaimed:purses.reduce((sum,p)=>sum+p.amount*p.count,0)
 };
 function lostPurse(amount){
  amount=coins(amount);if(!amount)return;
  const tail=r.purses.at(-1);
  if(tail?.amount===amount)tail.count++;else r.purses.push({amount,count:1});
  r.unclaimed+=amount;
 }
 // Old saves prove one coin; a new interrupted chase proves its exact purse.
 const interrupted=Math.max(coins(state.stolenAmount),state.stolenDaler?1:0);
 if(state.thief==='lost'&&interrupted){lostPurse(interrupted);state.stolenAmount=0;state.stolenDaler=false;}
 function observe(amount){
  if(amount===r.wallet)return false;
  if(amount>r.wallet&&state.thief!=='unseen'&&!r.earned){r.earned=true;r.nextDistance=Math.max(r.nextDistance,state.distance+travel());}
  r.wallet=amount;return true;
 }
 function ownWallet(amount){r.wallet=amount;}
 function start(){r.earned=false;r.encounters++;}
 function finish(lost,distance,amount=1){if(lost)lostPurse(amount);r.rest=rest();r.nextDistance=distance+travel();}
 function advance(ms){const old=r.rest;r.rest=Math.max(0,r.rest-ms);return Math.ceil(old/1000)!==Math.ceil(r.rest/1000);}
 function ready(distance,amount){return completed()&&r.earned&&r.rest===0&&distance>=r.nextDistance&&theftAmount(amount)>0;}
 function claim(amount=r.purses[0]?.amount){
  const purse=r.purses[0];if(!purse||amount!==purse.amount)return false;
  r.unclaimed-=amount;if(--purse.count===0)r.purses.shift();return true;
 }
 function reset(amount){r.wallet=amount;r.earned=false;r.rest=0;r.nextDistance=0;r.encounters=0;r.unclaimed=0;r.purses=[];}
 return {observe,ownWallet,start,finish,advance,ready,claim,reset,get nextClaim(){return r.purses[0]?.amount||0;},get unclaimed(){return r.unclaimed;},get encounters(){return r.encounters;}};
}
root.UPPDRAG_EVENT_RECURRENCE={create,theftAmount};
if(typeof module!=='undefined')module.exports={create,theftAmount};
})(typeof window!=='undefined'?window:globalThis);
