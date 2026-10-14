import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+fs.readFileSync(path.join(dist,'style.css'),'utf8')+'</style>');
html=html.replace('<script src="curriculum.js"></script>',()=>'<script id="custom-bank">window.CUSTOM_BANK=null;</script>\n<script>'+fs.readFileSync(path.join(dist,'curriculum.js'),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
html=html.replace('<script src="cloud-config.js"></script>', '');
html=html.replace('<script type="module" src="cloud-ui.mjs"></script>', '');
html=html.replace('<script src="practice.js"></script>',()=>'<script>'+fs.readFileSync(path.join(dist,'practice.js'),'utf8')+'</script>');
html=html.replace('<script src="game.js"></script>',()=>'<script>'+fs.readFileSync(path.join(dist,'game.js'),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
html=html.replace('<button class="round-btn" id="accountBtn"', '<button hidden class="round-btn" id="accountBtn"');
fs.writeFileSync(path.join(dist,'uppdrag-1700.html'),html);
process.stdout.write('Standalone pupil file generated.\n');

