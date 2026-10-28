/* Source pack loader for the standalone GitHub Pages game.
 * The readable unminified chapter-7 sources are inside chapter7-sourcepack.json.gz.
 * To inspect/edit in a checkout: python decode_chapter7_sources.py */
(function(){'use strict';
const file='chapter7-sourcepack.json.gz?v=1.3.0';
const checksum='678be96d10e0f13292466bb544785757ceb1dbef4e3b3ec308a397e69bbe13c6';
let loading=null;
async function load(){
 if(loading)return loading;
 loading=(async()=>{
  if(!window.DecompressionStream)throw Error('Kapitel 7 kräver en webbläsare med gzip-stöd.');
  const response=await fetch(file,{cache:'no-cache'});
  if(!response.ok)throw Error('Kapitel 7 kunde inte hämta källpaketet ('+response.status+').');
  const bytes=await response.arrayBuffer();
  if(window.crypto?.subtle){
   const digest=await crypto.subtle.digest('SHA-256',bytes);
   const actual=Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
   if(actual!==checksum)throw Error('Kapitel 7-källpaketets kontrollsumma är fel.');
  }
  const json=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
  if(json.version!=='1.3.0')throw Error('Fel version av kapitel 7.');
  const scripts=json.scripts;
  for(const filename of ['chapter7-tuning.js','chapter7-build.js','chapter7-content.js','chapter7-world.js','tests/chapter7.cjs']){
   if(typeof scripts[filename]!=='string')throw Error('Saknad källkod: '+filename);
  }
  window.UPPDRAG_CH7_SOURCES=scripts;
  for(const filename of ['chapter7-tuning.js','chapter7-build.js']){
   const node=document.createElement('script');node.textContent=scripts[filename];document.head.append(node);node.remove();
  }
  if(!window.UPPDRAG_CH7_BUILD?.build||!window.UPPDRAG_CH7_TUNING)throw Error('Kapitel 7:s moduler kunde inte starta.');
  return true;
 })();
 try{return await loading;}catch(e){loading=null;throw e;}
}
window.UPPDRAG_CH7_LOADER={load,version:'1.3.0'};
})();