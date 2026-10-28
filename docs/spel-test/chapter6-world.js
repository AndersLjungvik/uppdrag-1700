/* Chapter-six story layer. The illustrated comparison is the user's workbook
 * image. Letter, farm owner and route marks are fictional game events. */
(function(){
'use strict';
const P=window.UPPDRAG_CH6_PILOT;if(!P)throw Error('Kapitel 6 saknar uppdragskontroll.');
const imageURL=new URL('chapter6-maps.webp',parent.document.baseURI).href;
const style=document.createElement('style');style.textContent=`
#ch6Book{position:fixed;right:12px;bottom:60px;z-index:39;min-height:44px;padding:9px 13px;border:1px solid #927d58;border-radius:7px;background:#fff9ee;color:#342d22;font:15px system-ui;cursor:pointer}
body.ch1-memory #ch6Book,body[data-conversation] #ch6Book{display:none}
#ch6Journal{max-width:720px;width:calc(100% - 24px);max-height:90dvh;overflow:auto;border:1px solid #927d58;border-radius:10px;background:#fff8ec;color:#342d22;padding:20px;font:16px/1.5 system-ui}
#ch6Journal::backdrop{background:#282014b0}#ch6Journal h2{font:600 26px/1.2 Georgia,serif;margin:3px 0 14px}
#ch6Journal button{min-height:44px;padding:9px 12px;border:1px solid #927d58;background:#e5e9d7;color:inherit;border-radius:5px;font:16px system-ui;cursor:pointer}
#ch6Journal .ch6choices{display:flex;gap:8px;flex-wrap:wrap;margin:15px 0}#ch6Journal .ch6choices button{flex:1 1 150px}
#ch6Journal img,.ch6-map-reference img{display:block;width:100%;height:auto}#ch6Journal figure{margin:12px 0}
#ch6Journal figcaption,.ch6-map-reference figcaption{font:13px/1.4 system-ui;color:#61594a;margin-top:7px}
#ch6Journal .ch6route{padding:10px;border-left:3px solid #60734d;background:#eef0df}
#ch6Journal .ch6close{float:right;background:transparent;margin:0 0 8px 12px}#ch6Journal .ch6note{font-size:13px;color:#675c4a}
.ch6-map-reference{margin:12px 0;padding:7px;background:#fffdf5;border:1px solid #bcac8f}
#ch6Journal button:focus-visible,#ch6Book:focus-visible{outline:3px solid #286472;outline-offset:2px}
@media(max-width:480px){#ch6Book{bottom:57px;right:7px;font-size:13px}#ch6Journal{padding:15px}}
`;
document.head.append(style);
const button=document.createElement('button');button.id='ch6Book';button.textContent='Brevet & stadens bok';button.type='button';button.onclick=()=>openJournal(false);document.body.append(button);
const dialog=document.createElement('dialog');dialog.id='ch6Journal';dialog.setAttribute('aria-label','Brevet och bykartorna');document.body.append(dialog);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function maps(){return '<figure><img src="'+imageURL+'" alt="Karta A har små spridda åkertegar och hus i byn. Karta B visar samlade åkrar och mer utspridda gårdar."><figcaption>Jämför kartorna A och B. Färgerna visar hur jorden är fördelad.</figcaption></figure>';}
function direction(){const s=P.state;if(s.complete)return 'Sidan finns i Majas bok. Kapitel 7 är nästa del.';if(!s.step)return 'Maja har brevet i Kaffehuset. Börja hos henne.';return s.deliveryReady?'Ta den tryckta sidan till Maja i Kaffehuset.':currentDirection();}
function currentDirection(){const r=P.current(),names={farm:'Byn',workshop:'Verkstäderna',cafe:'Kaffehuset',print:'Tryckeriet'};return 'Ditt pågående arbete finns hos '+r.who+' i '+names[r.p]+'.';}
function close(){dialog.close();}
function openJournal(puzzle){
 const s=P.state,canSolve=puzzle&&s.step>0&&!s.complete&&interior?.kind==='farm'&&P.current().p==='farm'&&!s.ch6MapSolved;
 let html='<button class="ch6close" type="button" data-close>Stäng</button><h2>'+(canSolve?'Ett brev som hamnat fel':'Brevet och stadens bok')+'</h2>';
 if(!s.step){html+='<p>Hämta först brevet hos Maja i Kaffehuset. Avsändarens syster Sigrid bor inte längre vid byns brunn.</p>';}
 else if(canSolve){html+='<p>På adresslappen står: <b>Gården vid byns brunn.</b> Men Sigrids familj har flyttat till sin samlade jord.</p><p>I vårt äventyr tillhör <b>de gröna åkrarna</b> Sigrids familj. Följ samma färg från A till B. Var ska du lämna brevet nu?</p>'+maps()+'<div class="ch6choices"><button data-map="old">Vid den gamla samlingen av hus i A</button><button data-map="green">Vid gården på det gröna fältet i B</button><button data-map="orange">Vid gården på det orange fältet i B</button></div><p id="ch6MapFeedback" role="status"></p><p class="ch6note">Sigrid, brevet och färgledtråden är spelets berättelse. Kartorna används för att jämföra jordbrukets förändring.</p>';}
 else{
  html+='<p>'+(s.complete?'Sidan är levererad. Maja har lagt den i stadens bok.':esc(currentDirection()))+'</p>';
  html+='<p><b>Brevet:</b> '+(s.ch6MapSolved?'Lämnat till Sigrid vid den nya gården.':'I packningen. Den gamla adressen behöver undersökas.')+'</p>';
  html+=maps();
  if(s.ch6MapSolved)html+='<p class="ch6route"><b>Budets rättade väg i äventyret:</b> Kaffehuset → Byn → gården på det gröna fältet. Den gamla adressen vid brunnen är överstruken i din adressbok.</p>';
  html+='<p><b>Stadens bok:</b> '+(s.complete?'Färdig sida om landet, stadens arbetare och kulturen.':s.deliveryReady?'Färdigtryckt sida i packningen. Maja väntar.':'Anteckningar samlas vid dina arbetsbesök.')+'</p><details><summary>Röster från staden</summary><p>En hantverkare tillverkar varor. En latrintömmerska sköter ett tungt arbete som staden behöver. Ett barn från en fabrik berättar om sin trötthet. Det är tre påhittade personer med olika levnadsvillkor – inte ordagranna historiska vittnesmål.</p><p>Bellmans visor och Lenngrens texter berättar också något om sin tid, men en visa beskriver inte automatiskt hur alla människor levde.</p></details>';
 }
 dialog.innerHTML=html;if(!dialog.open)dialog.showModal();window.UPPDRAG_WORLD_KEYBOARD?.clear?.();
 // Keep the existing question UI out of keyboard reach while this dialog is open.
 dialog.querySelector('[data-close]').onclick=close;
 dialog.querySelectorAll('[data-map]').forEach(el=>el.onclick=()=>{
  if(el.dataset.map!=='green'){dialog.querySelector('#ch6MapFeedback').textContent='Följ familjens gröna åkrar även i den nya kartan. Försök igen.';return;}
  s.ch6MapSolved=true;s.ch6LetterDelivered=true;P.persist();
  dialog.innerHTML='<h2>Brevet kom fram</h2><p><b>Sigrid:</b> Tack! Nu kom brevet till min nya gård. Adresslappen följde den gamla byn.</p><p>Hjälp mig också få med förändringens fördelar och nackdelar på sidan till stadens bok.</p><button type="button" id="ch6Begin">Ta fram anteckningarna</button>';
  dialog.querySelector('#ch6Begin').onclick=()=>{close();P.enterMemory();};dialog.querySelector('#ch6Begin').focus();
 });
}
function addReference(){
 const modal=document.getElementById('ch1Modal');if(!modal||modal.hidden||P.state.archiveActive||P.state.recallInterlude)return;
 const task=P.recall?.current;if(task?.chapter!==6||task.place!=='farm')return;
 const sheet=modal.querySelector('.ch1Sheet');if(!sheet||sheet.querySelector('.ch6-map-reference'))return;
 const figure=document.createElement('figure');figure.className='ch6-map-reference';figure.innerHTML='<img src="'+imageURL+'" alt="Bykartorna A och B, före och efter skiftet."><figcaption>Kartorna ligger kvar medan du jämför. Stödord räcker där frågan säger det.</figcaption>';
 const prompt=sheet.querySelector('.rc-prompt');if(prompt)prompt.after(figure);else sheet.prepend(figure);
}
const observed=document.getElementById('ch1Modal');if(observed)new MutationObserver(addReference).observe(observed,{childList:true,subtree:true});
dialog.addEventListener('keydown',e=>e.stopPropagation());
window.UPPDRAG_CH6_STORY={openMap:()=>openJournal(true),openBook:()=>openJournal(false),direction,version:'1.1.0'};
})();
