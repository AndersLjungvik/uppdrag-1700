/* Local classroom barrier. This is not server-side teacher authentication.
 * Only a salted digest is shipped; entered codes are never saved. */
(function(){
'use strict';
const salt="fc9985b571e2be74879a3fcd4a7f907a",digest="5af85779fbd171e269105da0a08c967a3ce70d336fffde5bc54c335554f2479c";
async function verify(value){
 const code=String(value??'').trim();
 if(!/^\d{6}$/.test(code))return false;
 try{
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+':'+code));
  return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('')===digest;
 }catch{return false;}
}
window.UPPDRAG_TEACHER_REVIEW={verify};
})();

