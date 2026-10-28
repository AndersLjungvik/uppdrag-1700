/* Source pack loader for the standalone GitHub Pages game.
 * The readable unminified chapter-8 sources are inside chapter8-sourcepack.json.gz.
 * To inspect/edit in a checkout: python decode_chapter8_sources.py */
(function(){'use strict';
const file='chapter8-sourcepack.json.gz?v=1.4.2';
const checksum='196241975ca5c96a422dffffee8bdd8968e6c4c3f3cfb7071aa37cf498f07ecf';
let loading=null;
async function load(){
 if(loading)return loading;
 loading=(async()=>{
  if(!window.DecompressionStream)throw Error('Kapitel 8 kräver en webbläsare med gzip-stöd.');
  const response=await fetch(file,{cache:'no-cache'});
  if(!response.ok)throw Error('Kapitel 8 kunde inte hämta källpaketet ('+response.status+').');
  const bytes=await response.arrayBuffer();
  if(window.crypto?.subtle){
   const digest=await crypto.subtle.digest('SHA-256',bytes);
   const actual=Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
   if(actual!==checksum)throw Error('Kapitel 8-källpaketets kontrollsumma är fel.');
  }
  const json=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
  if(json.version!=='1.4.2')throw Error('Fel version av kapitel 8.');
  const scripts=json.scripts;
  for(const filename of ['chapter8-build.js','chapter8-content.js','chapter8-world.js','tests/chapter8.cjs','tests/chapter8-build.cjs','tests/chapter8-dialogue.cjs']){
   if(typeof scripts[filename]!=='string')throw Error('Saknad källkod: '+filename);
  }
  window.UPPDRAG_CH8_SOURCES=scripts;
  for(const filename of ['chapter8-build.js']){
   const node=document.createElement('script');node.textContent=scripts[filename];document.head.append(node);node.remove();
  }
  if(!window.UPPDRAG_CH8_BUILD?.build)throw Error('Kapitel 8:s moduler kunde inte starta.');
  return true;
 })();
 try{return await loading;}catch(e){loading=null;throw e;}
}
window.UPPDRAG_CH8_LOADER={load,version:'1.4.2'};
})();
