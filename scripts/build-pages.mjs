import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const docs=path.join(root,'docs');
fs.mkdirSync(docs,{recursive:true});
for(const file of ['index.html','style.css','curriculum.js','game.js','uppdrag-1700.html','cloud-config.js','practice.js','sound.js','google-sync.mjs','cloud-ui.mjs']){
  fs.copyFileSync(path.join(root,'dist',file),path.join(docs,file));
}
fs.cpSync(path.join(root,'dist/assets'),path.join(docs,'assets'),{recursive:true});
fs.writeFileSync(path.join(docs,'.nojekyll'),'');
process.stdout.write('GitHub Pages files generated in docs/.\n');

