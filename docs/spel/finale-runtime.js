/* Final chapters 9–10. Readable source is stored in the checksummed pack.
 * Decode with: python decode_finale_sources.py. Never writes old save keys. */
(function(){'use strict';let loading=null;
async function load(){if(loading)return loading;loading=(async()=>{
 await window.UPPDRAG_CH7_LOADER.load();await window.UPPDRAG_CH8_LOADER.load();
 const parts=await Promise.all([1,2,3,4,5].map(async i=>{const r=await fetch('finale-pack-'+i+'.bin?v=1.6.0',{cache:'no-cache'});if(!r.ok)throw Error('Slutkapitlen kunde inte laddas ('+r.status+').');return new Uint8Array(await r.arrayBuffer());}));
 const joined=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;for(const p of parts){joined.set(p,offset);offset+=p.length;}
 const bytes=joined.buffer;const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
 if(hash!=='07db0cfd1cb2d4c4a50051a7dc48418d83f24c3b3fd89f89386b331f9d2083ad')throw Error('Fel kontrollsumma i slutkapitlen.');
 const pack=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
 if(pack.version!=='1.6.0')throw Error('Fel version av slutkapitlen.');
 window.UPPDRAG_FINAL_DATA=pack.data;window.UPPDRAG_FINAL_SOURCES=pack.scripts;
 const node=document.createElement('script');node.textContent=pack.scripts['finale-build.js'];document.head.append(node);node.remove();
 if(!window.UPPDRAG_FINAL_BUILD?.build)throw Error('Slutkapitlens byggare kunde inte starta.');
 })();try{return await loading;}catch(e){loading=null;throw e;}}
 window.UPPDRAG_FINAL_LOADER={load,version:'1.6.0'};
})();
