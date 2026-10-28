/* Chapter 6 street tension. Two brief, saved encounters during real movement.
 * They never block chapter progress and never count as knowledge mastery. */
(function(){
'use strict';
const P=window.UPPDRAG_CH6_PILOT;if(!P)return;
const preview=new URLSearchParams(window.__UPPDRAG_QUERY||location.search).get('preview')==='1';
const thresholds=[3,10];
const style=document.createElement('style');style.textContent=`
#ch6StreetEvent{max-width:600px;width:calc(100% - 24px);border:1px solid #8f7955;border-radius:12px;background:#fff8e9;color:#342d22;padding:20px;font:16px/1.45 system-ui}
#ch6StreetEvent::backdrop{background:#241d14aa}#ch6StreetEvent h2{font:600 27px Georgia,serif;margin:0 0 8px}
#ch6StreetEvent .ch6scene{height:92px;position:relative;overflow:hidden;border-block:1px solid #c8b99e;margin:12px 0;background:linear-gradient(#eee4d0 0 58%,#aa9878 58%)}
#ch6StreetEvent .ch6thief{position:absolute;left:8%;bottom:14px;width:40px;height:55px;animation:ch6run 1.3s ease-in-out infinite alternate}
#ch6StreetEvent .ch6thief:before{content:'';position:absolute;left:11px;top:0;width:21px;height:21px;border-radius:50%;background:#b9966e;border:2px solid #544332}
#ch6StreetEvent .ch6thief:after{content:'';position:absolute;left:5px;top:22px;width:32px;height:31px;background:#6e5a43;clip-path:polygon(15% 0,85% 0,100% 100%,0 100%)}
#ch6StreetEvent .ch6bag{position:absolute;right:-5px;bottom:5px;width:17px;height:20px;border-radius:4px 4px 8px 8px;background:#8a6841;border:2px solid #4d3b29}
#ch6StreetEvent .ch6actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}#ch6StreetEvent button{min-height:44px;flex:1 1 150px;padding:9px 12px;border:1px solid #8f7955;border-radius:6px;background:#e7ead9;color:inherit;font:16px system-ui;cursor:pointer}
#ch6StreetEvent button.secondary{background:#fffaf0}#ch6StreetEvent button:focus-visible{outline:3px solid #286472;outline-offset:2px}
#ch6StreetEvent .ch6duel{display:grid;gap:8px;margin-top:12px}#ch6StreetEvent .ch6duel button{text-align:left}
#ch6StreetEvent .ch6result{padding:10px 12px;border-left:3px solid #687956;background:#f2efdf}
@keyframes ch6run{from{transform:translateX(0) rotate(-2deg)}to{transform:translateX(360px) rotate(3deg)}}
@media(max-width:480px){#ch6StreetEvent{padding:15px}#ch6StreetEvent .ch6scene{height:78px}@keyframes ch6run{from{transform:translateX(0)}to{transform:translateX(220px)}}}
@media(prefers-reduced-motion:reduce){#ch6StreetEvent .ch6thief{animation:none;left:56%}}
`;document.head.append(style);
const dialog=document.createElement('dialog');dialog.id='ch6StreetEvent';dialog.setAttribute('aria-label','Gatuhändelse');document.body.append(dialog);
let active=null,walkSince=0;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function candidates(){return (window.UPPDRAG_RECALL_BANK||[]).filter(t=>t.chapter<6&&t.rank===0&&t.fields?.length===1&&t.fields[0].options?.length>=3&&t.fields[0].answers?.length);}
function question(seed){const list=candidates();if(!list.length)return null;const t=list[seed%list.length],f=t.fields[0],right=f.answers[0],opts=f.options.slice(0,3);const shift=seed%opts.length;return{prompt:t.prompt,label:f.label,right,options:opts.map((_,i)=>opts[(i+shift)%opts.length])};}
function resourceFor(index,practice){const s=P.state;if(practice)return{kind:'daler',label:'en daler',practice:true};if(index===1&&s.apples>1)return{kind:'apple',label:'ett äpple'};if(s.daler>0)return{kind:'daler',label:'en daler'};if(s.apples>1)return{kind:'apple',label:'ett äpple'};return null;}
function lose(resource){if(resource.practice)return;const s=P.state;if(resource.kind==='apple')s.apples=Math.max(0,s.apples-1);else s.daler=Math.max(0,s.daler-1);P.persist();P.refresh();}
function log(result){const s=P.state;(s.ch6StreetEventLog??=[]).push({event:active?.index,result,at:new Date().toISOString()});P.persist();}
function finish(result,message,resourceLost){if(resourceLost)lose(active.resource);log(result);dialog.innerHTML='<h2>'+esc(result==='won'?'Du hann ikapp!':'Tjuven försvann')+'</h2><p class="ch6result">'+esc(message)+'</p><div class="ch6actions"><button type="button" data-close>Fortsätt genom staden</button></div>';dialog.querySelector('[data-close]').onclick=()=>{dialog.close();active=null;};dialog.querySelector('[data-close]').focus();}
function showDuel(){const q=active.question;if(!q){finish('escaped','Du hinner nästan ikapp, men tjuven försvinner i gränden.',true);return;}dialog.innerHTML='<h2>Minnesduell</h2><p>Du kommer nära. Ett snabbt minne kan hjälpa dig läsa situationen och hinna före honom.</p><p><b>'+esc(q.prompt)+'</b></p><div class="ch6duel"></div><p class="ch6note">Det här är en bonusrepetition. Svaret påverkar inte din kunskapsnivå.</p>';const box=dialog.querySelector('.ch6duel');q.options.forEach(option=>{const b=document.createElement('button');b.type='button';b.textContent=option;b.onclick=()=>{if(option===q.right)finish('won','Rätt. Du tar en genväg och får tillbaka '+active.resource.label+'.',false);else finish('escaped','Inte den här gången. Tjuven kommer undan med '+active.resource.label+'.',true);};box.append(b);});box.querySelector('button')?.focus();}
function start(index,practice=false){if(dialog.open||active)return false;const resource=resourceFor(index,practice);if(!resource)return false;const s=P.state;if(!practice){const done=s.ch6StreetEvents??=[];if(done.includes(index))return false;done.push(index);s.ch6StreetEvents=done;P.persist();}
 active={index,resource,practice,question:question((s.ch6StreetEventLog?.length||0)+index+1)};const noun=resource.kind==='apple'?'En äppeltjuv':'En ficktjuv';dialog.innerHTML='<h2>'+noun+'!</h2><div class="ch6scene" aria-hidden="true"><span class="ch6thief"><span class="ch6bag"></span></span></div><p>En figur stöter till dig i folkvimlet och försöker komma undan med <b>'+esc(resource.label)+'</b>.'+(practice?' <i>Lärartest: inget dras från din sparning.</i>':'')+'</p><div class="ch6actions"><button type="button" data-chase>Jaga!</button><button type="button" class="secondary" data-let>Låt honom springa</button></div>';dialog.showModal();dialog.querySelector('[data-chase]').onclick=showDuel;dialog.querySelector('[data-let]').onclick=()=>finish('escaped','Du låter honom gå. '+(practice?'Lärartestet ändrar inga resurser.':'Han kommer undan med '+resource.label+'.'),!practice);dialog.querySelector('[data-chase]').focus();return true;}
dialog.addEventListener('cancel',e=>{e.preventDefault();});dialog.addEventListener('keydown',e=>e.stopPropagation());
function walking(){try{return !preview&&!window.UPPDRAG_EVENT_ENGINE?.busy&&!active&&!dialog.open&&!P.state.complete&&!P.state.deliveryReady&&!interior&&!document.body.classList.contains('ch1-open')&&!document.body.dataset.conversation&&Array.isArray(path)&&path.length>0;}catch{return false;}}
function tick(now){const s=P.state,done=s.ch6StreetEvents??[],index=thresholds.findIndex((step,i)=>s.step>=step&&!done.includes(i));if(index>=0&&walking()){if(!walkSince)walkSince=now;if(now-walkSince>850){start(index,false);walkSince=0;}}else walkSince=0;requestAnimationFrame(tick);}requestAnimationFrame(tick);
const story=window.UPPDRAG_CH6_STORY;if(story&&preview){const old=story.openBook;story.openBook=()=>{old();setTimeout(()=>{const journal=document.getElementById('ch6Journal');if(!journal||journal.querySelector('[data-test-street]'))return;const wrap=document.createElement('div');wrap.className='ch6choices';wrap.innerHTML='<button type="button" data-test-street>Testa gatuhändelse</button>';journal.append(wrap);wrap.querySelector('button').onclick=()=>{journal.close();setTimeout(()=>start(0,true),0);};},0);};}
window.UPPDRAG_CH6_STREET_EVENTS={start,version:'1.2.0'};
})();