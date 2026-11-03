/* Local classroom barrier. This is not server-side teacher authentication.
 * Only a salted digest is shipped; entered codes are never saved. */
(function(){
'use strict';
const salt="fb1f0a0ba3066c665d68eee5448ec5b3",digest="ee27ccd97a363dcdcb298c92693497970dfb63af5f93f508dd80188bc6dcb24d";
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

