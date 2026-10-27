/* Load the isolated, readable chapter-nine rewrite. See decode_chapter9_letter.py. */
(function(){'use strict';let loading=null,pack=null;
async function load(){if(loading)return loading;loading=(async()=>{
 const parts=await Promise.all([1,2,3].map(async i=>{
  const r=await fetch('chapter9-letter-pack-'+i+'.bin?v=1.7.0',{cache:'no-cache'});
  if(!r.ok)throw Error('Brevberättelsen kunde inte hämtas ('+r.status+').');
  return new Uint8Array(await r.arrayBuffer());
 }));
 const bytes=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;
 for(const part of parts){bytes.set(part,offset);offset+=part.length;}
 if(bytes.length!==11198)throw Error('Brevberättelsens källpaket är ofullständigt.');
 const sha=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
 if(sha!=='2f95dd26b2de95b1f10208b3293ca00fa7eefd10858257db9d6b59f134a0464e')throw Error('Brevberättelsens kontrollsumma stämmer inte.');
 pack=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
 if(pack.version!=='1.7.0'||!pack.scripts?.['chapter9-letter-build.js']||!pack.scripts?.['chapter9-letter-world.js'])throw Error('Ofullständig brevberättelse.');
 const node=document.createElement('script');node.textContent=pack.scripts['chapter9-letter-build.js'];document.head.append(node);node.remove();
 if(!window.UPPDRAG_CH9_LETTER_BUILD?.apply)throw Error('Brevberättelsen kunde inte starta.');
})();try{return await loading;}catch(e){loading=null;throw e;}}
window.UPPDRAG_CH9_LETTER_LOADER={async apply(files,get){await load();return window.UPPDRAG_CH9_LETTER_BUILD.apply(files,name=>pack.scripts[name.split('?')[0]]??get(name));},version:'1.7.0'};
})();
