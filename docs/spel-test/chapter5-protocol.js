/* Elin's document work. This separate story save never awards knowledge credit. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==5)return;
const key='uppdrag1700.ch5-protocol.1772.v1';
const empty=()=>({v:1,accepted:false,seen1771:false,seen1772:false,compared:false,delivered:false});
let stored;try{stored=JSON.parse(localStorage.getItem(key)||'null');}catch{}
const state=empty();
if(stored?.v===1){for(const name of Object.keys(state))if(name!=='v')state[name]=stored[name]===true;}
// A partial or malformed story save must not manufacture earlier document work.
state.compared=state.accepted&&state.seen1771&&state.seen1772&&state.compared;
state.delivered=state.compared&&state.delivered;
let root=null,restore=null,returnFocus=null;
const ownedKeys=new Set();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const room=()=>typeof interior!=='undefined'&&interior&&!interior.outdoor&&!(typeof voyage!=='undefined'&&voyage)?interior.kind:null;
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{}};
const mastered=()=>{const a=window.UPPDRAG_MASTERY?.snapshot?.().state?.areas?.power;return !!a&&['learner','journeyman','master'].every(id=>a[id]?.status==='clear');};
function status(){
 const done=mastered(),ready=state.accepted&&state.compared&&done&&!state.delivered;
 return {accepted:state.accepted,compared:state.compared,mastered:done,ready,delivered:state.delivered,
  stage:state.delivered?'delivered':!state.accepted?'unstarted':!state.compared?'compare':!done?'recall':'ready'};
}
function accept(){
 if(!['riksdag','cafe'].includes(room())||state.accepted||root)return false;
 state.accepted=true;save();return true;
}
function deliver(){
 if(room()!=='cafe'||root||!status().ready)return false;
 state.delivered=true;save();return true;
}
const stageText={
 unstarted:'Elin i Riksdagshuset har två daterade handlingar att jämföra.',
 compare:'Läs båda bladen hos Elin och lägg dem i tidsordning.',
 recall:'Handlingarna är jämförda. Arbeta vidare med maktbytet på lärlings-, gesäll- och mästarnivå hos Elin.',
 ready:'Protokollet är färdigt. Lämna det till Maja på Kaffehuset.',
 delivered:'Maja har fått protokollet. De två olika händelserna finns nu tydligt åtskilda.'
};
function journalHTML(){const s=status();return '<p><b>Elins protokoll:</b> '+esc(stageText[s.stage])+'</p>';}
const sheetText={
 '1771':'Gustav III blir kung.',
 '1772':'Gustav III använder armén och låter fängsla riksrådets medlemmar. Riksdagen godkänner en ny grundlag. Kungen får mer makt, medan riksdagens och riksrådets inflytande minskar.'
};
function paint(){const canvas=root?.querySelector('canvas');if(canvas)window.UPPDRAG_ROOM_ART?.renderMemoryCloseup?.(canvas,room()==='cafe'?'cafe':'riksdag');}
function read(year){
 if(!root||room()!=='riksdag'||!['1771','1772'].includes(String(year))||state.delivered)return false;
 const name='seen'+year;if(state[name])return false;state[name]=true;save();render();return true;
}
function compare(){
 if(!root||room()!=='riksdag'||!state.seen1771||!state.seen1772||state.compared||state.delivered)return false;
 state.compared=true;save();render();return true;
}
function render(){
 if(!root)return;
 const done=state.delivered,opened=state.seen1771&&state.seen1772;
 let h='<canvas aria-hidden="true"></canvas><button class="cp-close" data-ch5-protocol="close">← Till rummet</button><article class="cp-sheet"><small>Elins protokoll · spelhandlingar utifrån kapitlets innehåll</small><h2 id="ch5ProtocolTitle">Två årtal och två händelser</h2>';
 h+='<p>'+(done?'Maja har tagit emot ditt färdiga protokoll.':'Elin behöver hålla isär kungabytet och maktbytet. Läs de två handlingarna innan du lägger dem i tidsordning.')+'</p>';
 h+='<div class="cp-papers">';
 for(const year of ['1771','1772']){
  const seen=state['seen'+year];h+='<section class="cp-paper"><h3>'+year+'</h3>'+(seen||done?'<p>'+esc(sheetText[year])+'</p>':'<p>Handlingen ligger hopvikt.</p>');
  if(!seen&&!done)h+='<button data-ch5-protocol="read" data-year="'+year+'">Läs handlingen från '+year+'</button>';
  h+='</section>';
 }
 h+='</div>';
 if(!state.compared)h+='<div class="cp-actions"><button data-ch5-protocol="compare"'+(!opened?' disabled':'')+'>Lägg handlingarna i tidsordning</button></div>';
 else h+='<section class="cp-result"><h3>Protokollets tidsföljd</h3><p><b>Först 1771:</b> Gustav III blir kung.</p><p><b>Sedan 1772:</b> statskuppen och den nya grundlagen ger kungen mer makt.</p></section>';
 h+='<p class="cp-next" role="status">'+esc(stageText[status().stage])+'</p><p><small>Att läsa och jämföra handlingarna är dokumentarbete. Dina svar och kunskapsstämplar sparas i den vanliga frågedelen.</small></p><div class="cp-actions"><button data-ch5-protocol="close">Lägg undan protokollet</button></div></article>';
 const previous=root.querySelector('.cp-sheet')?.scrollTop||0;root.innerHTML=h;paint();
 const sheet=root.querySelector('.cp-sheet');if(sheet)sheet.scrollTop=previous;
 const focus=root.querySelector('[data-ch5-protocol="read"]')||root.querySelector('[data-ch5-protocol="compare"]:not(:disabled)')||root.querySelector('[data-ch5-protocol="close"]');focus?.focus?.({preventScroll:true});
}
function open(){
 const p=room();
 if(root||!(p==='riksdag'||p==='cafe'&&state.delivered)||window.UPPDRAG_CH5_PILOT?.studyBusy||window.UPPDRAG_EVENT_ENGINE?.busy||window.UPPDRAG_CH5_BOOKWORK?.busy)return false;
 // Close an ordinary room conversation; an active adventure above is never interrupted.
 window.UPPDRAG_MEETINGS?.close?.(false);
 if(!state.accepted)accept();
 window.UPPDRAG_CH5_CITY_LIFE?.suspend?.();
 returnFocus=document.activeElement;
 restore={visibility:roomView.style.visibility,footer:roomFooter.hidden,bodyOpen:document.body.classList.contains('ch1-open')};
 roomView.style.visibility='hidden';roomFooter.hidden=true;document.body.classList.add('ch1-open');
 root=document.createElement('section');root.id='ch5Protocol';root.tabIndex=-1;root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','ch5ProtocolTitle');stage.append(root);
 root.addEventListener('click',e=>{const button=e.target.closest('[data-ch5-protocol]');if(!button||button.disabled)return;const a=button.dataset.ch5Protocol;if(a==='close')close();else if(a==='read')read(button.dataset.year);else if(a==='compare')compare();});
 render();return true;
}
function close(){
 if(!root)return false;
 root.remove();root=null;roomView.style.visibility=restore.visibility;roomFooter.hidden=restore.footer;
 if(!restore.bodyOpen)document.body.classList.remove('ch1-open');
 restore=null;window.UPPDRAG_MEETINGS?.redraw?.();
 (returnFocus?.isConnected?returnFocus:document.getElementById('meetingPerson'))?.focus?.({preventScroll:true});returnFocus=null;return true;
}
function handleKeydown(e){
 if(!root)return false;
 ownedKeys.add(e.key);e.stopImmediatePropagation();
 if(e.key==='Escape'){e.preventDefault();close();return true;}
 if(e.key==='Tab'){
  const buttons=[...root.querySelectorAll('button:not(:disabled)')],index=buttons.indexOf(document.activeElement);
  if(e.shiftKey&&index<=0||!e.shiftKey&&index===buttons.length-1){e.preventDefault();buttons[e.shiftKey?buttons.length-1:0]?.focus();}return true;
 }
 if(['Enter',' '].includes(e.key)){const button=e.target.closest?.('button');if(button){e.preventDefault();if(!e.repeat)button.click();}}
 return true;
}
window.addEventListener('keydown',handleKeydown,true);
window.addEventListener('keyup',e=>{if(root||ownedKeys.has(e.key)){ownedKeys.delete(e.key);e.stopImmediatePropagation();if(['Enter',' ','Escape'].includes(e.key))e.preventDefault();}},true);
window.addEventListener('blur',()=>ownedKeys.clear());
window.addEventListener('resize',paint);window.addEventListener('uppdrag-paper-fibres-ready',paint);
const style=document.createElement('style');style.textContent=`
#ch5Protocol{position:absolute;inset:0;z-index:47;background:#b7a78c;overflow:hidden;color:#352b20;font:17px/1.45 Georgia}
#ch5Protocol canvas{position:absolute;inset:0;width:100%;height:100%}
#ch5Protocol .cp-sheet{position:absolute;left:64%;top:53%;transform:translate(-50%,-50%);width:min(620px,calc(100% - 28px));max-height:calc(100% - 100px);overflow:auto;overscroll-behavior:contain;touch-action:pan-y;padding:25px;background:#fffcf6;border:1px solid #b3a080;box-shadow:8px 11px 1px #322c2340;box-sizing:border-box}
#ch5Protocol h2{font:600 25px/1.2 Georgia;margin:10px 0 16px}#ch5Protocol h3{font:600 19px/1.3 Georgia;margin:4px 0 10px}#ch5Protocol p{margin:9px 0}#ch5Protocol small{font:12px/1.4 system-ui;color:#635744}
#ch5Protocol button{min-height:44px;padding:10px 12px;border:1px solid #9b835c;border-radius:4px;background:#f4ead7;color:#352b20;font:15px/1.3 Georgia;cursor:pointer}#ch5Protocol button:disabled{opacity:.5;cursor:default}
#ch5Protocol .cp-close{position:absolute;top:10px;left:12px;z-index:2}#ch5Protocol .cp-papers{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0}#ch5Protocol .cp-paper{padding:15px;background:#f7f1e3;border:1px solid #c8b99f}#ch5Protocol .cp-paper button{width:100%;white-space:normal}#ch5Protocol .cp-actions{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 0}#ch5Protocol .cp-result{padding:14px 0;border-top:1px solid #bcaa8c;border-bottom:1px solid #bcaa8c}#ch5Protocol .cp-next{font-weight:600}#ch5Protocol :focus-visible{outline:3px solid #286472;outline-offset:2px}
@media(max-width:800px){#ch5Protocol .cp-sheet{left:50%;padding:18px}}@media(max-width:520px){#ch5Protocol .cp-papers{grid-template-columns:1fr}}@media(max-height:500px){#ch5Protocol .cp-sheet{top:56%;max-height:calc(100% - 80px)}}
`;document.head.append(style);
window.UPPDRAG_CH5_PROTOCOL={status,accept,open,close,deliver,read,compare,journalHTML,handleKeydown,get busy(){return !!root;},get state(){return {...state};},saveKey:key};
})();
