/* Local chapter-pilot prerequisite. This is NOT authenticated teacher access.
 * The ?preview=1 flag is for manual development preview, not a secure school unlock.
 * To distribute to pupils across devices, use authenticated shared progress.
 */
(function(){
'use strict';
const current=document.currentScript;
const chapter=Number(current?.dataset?.chapter||0);
const priorKeys={
 2:'uppdrag1700.ch1-real-world.20261019.v11',
 3:'uppdrag1700.ch2-real-world.20261019.v1',
 4:'uppdrag1700.ch3-real-world.20261019.v1'
};
const key=priorKeys[chapter];if(!key)return;
let previousComplete=false;
try{const data=JSON.parse(localStorage.getItem(key)||'null');
 previousComplete=!!data?.complete&&data?.v===2;
}catch{}
const preview=new URLSearchParams(location.search).get('preview')==='1';
if(preview&&!previousComplete){
 document.body.dataset.chapterPreview='true';
 const label=document.createElement('span');
 label.textContent='Förhandsvisning · inte elevversion';
 label.style.cssText='font:600 12px/1.3 system-ui;background:#fff2d7;color:#55432d;border:1px solid #a38962;border-radius:5px;padding:4px 7px';
 document.querySelector('header')?.append(label);
}
if(previousComplete||preview)return;
document.body.dataset.chapterLocked='true';
for(const id of ['stage','worldFooter','roomFooter']){
 const element=document.getElementById(id);if(element)element.inert=true;
}
const pane=document.createElement('section');
pane.id='chapterLockedScreen';
pane.setAttribute('role','dialog');
pane.setAttribute('aria-modal','true');
pane.setAttribute('aria-labelledby','chapterLockedTitle');
pane.style.cssText='position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:#d9cebaf2';
pane.innerHTML='<article style="max-width:530px;border:2px solid #917b58;border-radius:11px;background:#fff7e7;padding:24px 27px;color:#3a3025;font:16px/1.5 Georgia,serif;box-shadow:0 6px 24px #55452940">'
  +'<h2 id="chapterLockedTitle" style="font:600 27px/1.3 Georgia,serif">Nästa kapitel väntar</h2>'
  +'<p>Du behöver först avsluta föregående kapitel. Det gör inget om du vill återvända och repetera gamla kunskaper.</p>'
  +'<a style="color:#315a50" href="chapter'+(chapter-1)+'-pilot.html">← Tillbaka till kapitel '+(chapter-1)+'</a></article>';
document.body.append(pane);
})();