import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist');
const escape=s=>s.replace(/<\/script/gi,'<\\/script');
const images=Object.fromEntries(['town','quay','work'].map(n=>[n,'data:image/webp;base64,'+fs.readFileSync(path.join(dist,'world/assets',n+'.webp')).toString('base64')]));
const cache=new Map();
function pack(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file);
 let source=fs.readFileSync(file,'utf8');
 source=source.replace(/(from\s*|import\s*)(['"])(\.[^'"]+)\2/g,(_,prefix,quote,spec)=>prefix+quote+pack(path.resolve(path.dirname(file),spec.split('?')[0]))+quote);
 const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');cache.set(file,url);return url;
}
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
html=html.replace(/<link rel="stylesheet" href="world\/world.css[^\"]*">/,'<style>'+fs.readFileSync(path.join(dist,'world/world.css'),'utf8')+'</style>');
html=html.replace('<script src="cloud-config.js"></script>',()=>'<script>window.UPPDRAG_OFFLINE=true;window.UPPDRAG_WORLD_ASSETS='+JSON.stringify(images)+';</script>');
for(const name of ['practice.js','sound.js','classroom-curriculum.js'])html=html.replace(new RegExp('<script src="'+name.replace('.','\\.')+'[^\"]*"></script>'),()=>'<script>'+escape(fs.readFileSync(path.join(dist,name),'utf8'))+'</script>');
const app=pack(path.join(dist,'world/app.mjs'));
html=html.replace(/<script type="module" src="world\/app.mjs[^\"]*"><\/script>/,()=>'<script type="module">import "'+app+'";</script>');
html=html.replace('<button id="accountBtn">','<button id="accountBtn" hidden>');
if(/<script[^>]+src=|<link[^>]+stylesheet/.test(html))throw Error('Offline build has external code or CSS');
fs.writeFileSync(path.join(dist,'uppdrag-1700.html'),html);
console.log('Self-contained paper-world game generated with '+cache.size+' embedded modules.');
