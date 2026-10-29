/* Integration 1.2 (street tension + progression safety): exact room v5 deltas + question scope 3.1.
 * Original game storage and assets are not modified. Source deltas are checked
 * against SHA-256 before application; offsets count Unicode code points.
 */
'use strict';
const $=id=>document.getElementById(id),VERSION='2.4.0',ROOT='uppdrag1700.integrated.20261023.v1.';
const TITLES=['Frihetstiden','Fria och ofria','Krig eller fred?','Nya tider, nya tankar','Gustavianska tiden','Livet på landet och i staden','Ska Sverige bli en stormakt igen?','Skottet på maskeraden','Striden om Finland','Hur kan vi veta något om 1700-talets Sverige?'];
const KEYS=['','uppdrag1700.ch1-real-world.20261019.v11','uppdrag1700.ch2-real-world.20261019.v1','uppdrag1700.ch3-real-world.20261019.v1','uppdrag1700.ch4-real-world.20261020.v1','uppdrag1700.ch5-real-world.20261020.v1','uppdrag1700.ch6-real-world.20261023.v1','uppdrag1700.ch7-real-world.20261026.v1','uppdrag1700.ch8-real-world.20261026.v1','uppdrag1700.ch9-real-world.20261027.v1','uppdrag1700.ch10-real-world.20261027.v1'];
const params=new URLSearchParams(window.__INTEGRATION_TEST_QUERY||location.search),cache=new Map(),memory=new Map();
const replayId=/^[a-z0-9-]{1,48}$/i.test(params.get('replay')||'')?params.get('replay'):'';
const chapterTest=replayId&&[2,3,4].includes(Number(params.get('testChapter')))?Number(params.get('testChapter')):0;
let frame=$('game');
let teacher=params.get('teacher')==='1',chapter=1,serial=0,ready=false,durable=true,payload;
const prefix=()=>ROOT+(replayId?'replay.'+replayId+'.':'')+(teacher?'teacher.':'play.');
try{localStorage.setItem(ROOT+'probe','1');localStorage.removeItem(ROOT+'probe');}catch{durable=false;}
function warning(){ $('storageWarning').hidden=durable; }
function read(k,scope=prefix()){const full=scope+k;try{return durable?(localStorage.getItem(full)??memory.get(full)??null):(memory.get(full)??null);}catch{durable=false;warning();return memory.get(full)??null;}}
function write(k,v,scope=prefix()){const full=scope+k;memory.set(full,String(v));try{if(durable)localStorage.setItem(full,String(v));}catch{durable=false;warning();}updateMenu();}
function bindStore(){const frameScope=prefix();window.integratedStore={getItem:k=>read(k,frameScope),setItem:(k,v)=>write(k,v,frameScope),removeItem(k){memory.delete(frameScope+k);try{if(durable)localStorage.removeItem(frameScope+k);}catch{durable=false;warning();}updateMenu();}};}bindStore();
function saved(ch){try{return JSON.parse(read(KEYS[ch])||'null');}catch{return null;}}
function masteryComplete(ch){
 const areas=ch===1?['start','law','trade']:ch===2?['women','power','children']:ch===3?['parties','war','uprising','david']:['reading','freedoms','research','ekeblad'];
 try{const m=JSON.parse(read('uppdrag1700.mastery.v1.ch'+ch)||'null');return m?.v===1&&areas.every(a=>['learner','journeyman','master'].every(l=>m.areas?.[a]?.[l]?.status==='clear'));}catch{return false;}
}
const masteryOneComplete=()=>masteryComplete(1);
function available(ch){
 if(ch<1||ch>10)return false;
 if(teacher||ch===1)return true;
 const start=chapterTest||1;
 if(chapterTest&&ch===start)return true;
 if(chapterTest&&ch<start)return !!saved(ch);
 for(let prior=start;prior<ch&&prior<=4;prior++)if(!masteryComplete(prior))return false;
 return saved(ch-1)?.complete===true;
}
function showError(message){$('error').hidden=false;$('error').textContent=message;$('status').textContent='Äventyret behöver uppmärksamhet';}
window.integratedError=message=>showError('Spelet rapporterade: '+message);
async function get(name){
 const packed=name.split('?')[0];
 if(window.UPPDRAG_CH8_SOURCES?.[packed]!==undefined)return window.UPPDRAG_CH8_SOURCES[packed];
 if(window.UPPDRAG_CH7_SOURCES?.[packed]!==undefined)return window.UPPDRAG_CH7_SOURCES[packed];
 if(!cache.has(name))cache.set(name,(async()=>{const r=await fetch(name,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Kunde inte hämta '+name+' ('+r.status+').');return r.text();})());try{return await cache.get(name);}catch(e){cache.delete(name);throw e;}}
async function unzip(name){
 if(name==='deltas.json.gz'){
  const chunks=await Promise.all([1,2,3,4].map(async i=>{const r=await fetch('delta-'+i+'.bin',{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Miljöpaket '+i+' kunde inte hämtas.');return new Uint8Array(await r.arrayBuffer());}));
  const bytes=new Uint8Array(chunks.reduce((n,c)=>n+c.length,0));let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}if(bytes.length!==13197)throw Error('Miljöpaketet är ofullständigt.');
  return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
 }
 const r=await fetch(name,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Kunde inte hämta '+name+' ('+r.status+').');return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).json();
}
async function hash(text){const bytes=new TextEncoder().encode(text),digest=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');}
async function source(name){
 if(chapterTest&&chapter<=4&&available(chapter)&&name==='chapter-access-pilot.js')return '/* The isolated chapter round is authorized by the integration gate. */';
 if(chapter===4&&name==='chapter4-pilot.js')return get('chapter4-mastery.js?v=2.4.0');
 if(chapter===4&&name==='chapter4-sidequest.js')return get('chapter4-cookbook.js?v=2.4.0');
 if(chapter===3&&name==='chapter3-pilot.js')return get('chapter3-mastery.js?v=2.2.0');
 if(chapter===2&&name==='chapter2-pilot.js')return get('chapter2-mastery.js?v=2.1.1');
 if(chapter===1&&name==='chapter1-pilot.js')return get('chapter1-mastery.js?v=2.0.3');
 let text;
 if(payload.extra[name]!==undefined)text=payload.extra[name];
 else if(payload.questions[name]!==undefined)text=payload.questions[name];
 else if(window.UPPDRAG_CH8_SOURCES?.[name]!==undefined)text=window.UPPDRAG_CH8_SOURCES[name];
 else if(window.UPPDRAG_CH7_SOURCES?.[name]!==undefined)text=window.UPPDRAG_CH7_SOURCES[name];
 else{
  text=await get('base/'+name);const patch=payload.patches[name];
  if(patch){
   if(await hash(text)!==patch.before)throw Error('Fel grundversion för '+name+'. Inget har skrivits över.');
   const chars=Array.from(text);for(const [start,end,insert] of [...patch.edits].reverse())chars.splice(start,end-start,insert);text=chars.join('');
   if(await hash(text)!==patch.after)throw Error('Kontrollsumman stämmer inte efter sammanfogning av '+name+'.');
  }
 }
 text=window.UPPDRAG_GAMEPLAY_TUNING?.source(name,text)??text;
 if(name==='paper-look.js'){
  const marker='return {drawRegion,buildingSprite,ready,';
  if(text.split(marker).length!==2)throw Error('Trädens gömställen kunde inte kopplas till den befintliga kartan.');
  text=text.replace(marker,"return {getTrees(r){const result=[];for(let i=0;i<(r.id==='main'?65:26);i++){const x=70+(i*173)%(r.w-140),y=70+(i*229)%(r.h-140);if(clearDecoration(r,x,y,46))result.push({id:'tree-'+i,x,y:y-12,treeX:x,treeY:y,radius:27});}return result;},drawTree(g,r,t){tree(g,t.treeX,t.treeY,r.id==='colony');},drawRegion,buildingSprite,ready,");
 }
 if(name==='harbour-fibre-art.js'){
  const before="const scale=Math.min(Math.max(width/SCENE.w,height/SCENE.h),\n      width/SCENE.coreWidth,height/680);";
  if(text.split(before).length!==2)throw Error('Kajens bildutsnitt kunde inte återställas.');
  text=text.replace(before,'const scale=Math.max(width/SCENE.w,height/SCENE.h);');
  text=text.replace("Math.min(446,SCENE.h-visibleHeight/2)","SCENE.h-visibleHeight/2");
 }
 if(name==='paper-dialogues.js'){
  const marker='#rutDocuments,#message)';
  if(text.split(marker).length!==2)throw Error('Sidoäventyrens gemensamma pappersstil kunde inte kopplas in.');
  text=text.replace(marker,'#rutDocuments,#message,#adventureDialog)');
 }
 if(/^meeting-ch[1-5]-pilot\.js$/.test(name))text=text.replaceAll("'Jag hjälper till'","'Självklart!'");
 if(chapter===1&&name==='meeting-ch1-pilot.js'){
  const marker="'Jag hjälper dig att minnas'";
  if(text.split(marker).length!==2)throw Error('Samtalets svarsknapp kunde inte kopplas till arbetsytan.');
  text=text.replace(marker,"(window.UPPDRAG_CH1_PILOT?.memoryChoice?.()||'Självklart!')");
 }
 if(chapter===2)text=window.UPPDRAG_CH2_PRESENTATION.source(name,text);
 if(chapter===3)text=window.UPPDRAG_CH3_PRESENTATION.source(name,text);
 if(chapter===4)text=window.UPPDRAG_CH4_PRESENTATION.source(name,text);
 if([1,2,3,4].includes(chapter)&&name==='recall-flow.js')text=window.UPPDRAG_MASTERY_RECALL.source(text);
 // Optional encounters pause the actual map movement; never rewrite the map.
 if(name==='world-street-pilot.js'||name==='world-classic-pilot.js'){
  const marker='if(path.length&&!sailing&&!window.UPPDRAG_STORY_WORK?.busy)';
  if(text.split(marker).length!==2)throw Error('Händelsemotor: spelvärldens rörelseankare matchar inte '+name);
  text=text.replace(marker,'if(path.length&&!sailing&&!window.UPPDRAG_STORY_WORK?.busy&&!window.UPPDRAG_EVENT_ENGINE?.blocking)');
  const actor='UPPDRAG_MEETINGS.drawMapPlayer(ctx,player,window.UPPDRAG_WORLD_KEYBOARD?.motionPath||path,performance.now());';
  if(text.split(actor).length!==2)throw Error('Trädens skymning kunde inte kopplas till spelaren.');
  text=text.replace(actor,actor+'window.UPPDRAG_EVENT_ENGINE?.drawCover(ctx,region);');
 }
 return text;
}
const safe=s=>s.replace(/<\/script/gi,'<\\/script');
const query=s=>s.replace(/new URLSearchParams\(location\.search\)/g,'new URLSearchParams(window.__UPPDRAG_QUERY||location.search)');
function script(code,attrs=''){return '<script'+attrs+'>'+safe(code)+'\n</scr'+'ipt>';}
function bridge(id){return `window.__ROOM_BOOTING=true;window.__UPPDRAG_QUERY=${JSON.stringify(teacher?'?preview=1':'?')};
Object.defineProperty(window,'localStorage',{value:parent.integratedStore,configurable:true});
window.addEventListener('keydown',e=>window.UPPDRAG_EVENT_ENGINE?.handleKeydown?.(e),true);
window.addEventListener('keydown',e=>window.UPPDRAG_CH2_BED?.handleKeydown?.(e),true);
window.addEventListener('keydown',e=>window.UPPDRAG_CH3_SCENES?.handleKeydown?.(e),true);
window.addEventListener('error',e=>parent.integratedError(String(e.message||'Okänt fel')));
window.addEventListener('unhandledrejection',e=>parent.integratedError(String(e.reason?.message||e.reason)));
document.addEventListener('click',e=>{const a=e.target.closest?.('a[href]'),m=a?.getAttribute('href')?.match(/chapter(\\d+)-pilot\\.html/);if(m){e.preventDefault();e.stopPropagation();parent.openIntegratedChapter(Number(m[1]));}},true);
window.__INTEGRATED_CHAPTER=${chapter};window.__INTEGRATED_VERSION=${JSON.stringify(VERSION)};window.__INTEGRATED_SERIAL=${id};`;}
async function makePage(ch,id){
 if(ch===6&&!payload.extra['chapter6-pilot.html']){
  if(!window.UPPDRAG_CH6_BUILD?.build)throw Error('Kapitel 6-byggaren kunde inte laddas. Ladda om sidan för version 1.2.1.');
  Object.assign(payload.extra,await window.UPPDRAG_CH6_BUILD.build(source,get));
}
 if(ch===7&&!payload.extra['chapter7-pilot.html']){
   if(!window.UPPDRAG_CH7_LOADER?.load)throw Error('Kapitel 7-laddaren saknas. Ladda om version 1.3.0.');
   await window.UPPDRAG_CH7_LOADER.load();
   Object.assign(payload.extra,await window.UPPDRAG_CH7_BUILD.build(source,get));
 }
 if(ch===8&&!payload.extra['chapter8-pilot.html']){
   // Chapter 8 extends the chapter 7 builder: a direct teacher link must
   // initialize both source packs, not only the newest one.
   if(!window.UPPDRAG_CH7_LOADER?.load||!window.UPPDRAG_CH8_LOADER?.load)
     throw Error('Kapitel 7 eller 8-laddaren saknas. Ladda om version 1.4.2.');
   await window.UPPDRAG_CH7_LOADER.load();
   await window.UPPDRAG_CH8_LOADER.load();
   Object.assign(payload.extra,await window.UPPDRAG_CH8_BUILD.build(source,get));
 }
 if(ch>=9&&!payload.extra['chapter'+ch+'-pilot.html']){
  await window.UPPDRAG_FINAL_LOADER.load();
  Object.assign(payload.extra,await window.UPPDRAG_FINAL_BUILD.build(ch,source,get));
  if(ch===9)Object.assign(payload.extra,await window.UPPDRAG_CH9_LETTER_LOADER.apply(payload.extra,get));
 }
 let page=await source('chapter'+ch+'-pilot.html');page=page.replace(/(<h1[^>]*>)([\s\S]*?)(<\/h1>)/i,(_,a,b,c)=>a+b.replace(/\s*[·–-]\s*PILOT/gi,'')+c);
 const pattern=/<script\b([^>]*?)\bsrc="([^"]+)"([^>]*)>\s*<\/script>/gi,found=[...page.matchAll(pattern)];
 const scripts=await Promise.all(found.map(async m=>{
  const name=m[2].split('?')[0];let code=query(await source(name));
  if(name==='chapter5-pilot.js'){code=code.replace("<h2>Kapitel 5 avklarat!</h2>","<h2>Kapitel 5 avklarat!</h2><p><a href=\"chapter6-pilot.html\">Fortsätt till kapitel 6 →</a></p>");}
  if(name==='chapter8-pilot.js')code=code.replace('<h2>Kapitel 8 avklarat!</h2>','<h2>Kapitel 8 avklarat!</h2><p><a href="chapter9-pilot.html">Fortsätt till kapitel 9 →</a></p>');
  if(name==='chapter8-pilot.js')code=code.replace("+'<button class=\"primary\" data-action=\"restart\">Börja om äventyret</button>'","+'<p><a href=\"chapter9-pilot.html\">Fortsätt till kapitel 9 →</a></p><button class=\"primary\" data-action=\"restart\">Börja om äventyret</button>'");
  if(name==='recall-assessment.js')code+='\n'+payload.fixes+'\n'+payload.alignment+'\n'+payload.powerLanguage;
  if(name==='chapter7-content.js')code+='\n'+await get('chapter7-war-rule-fix.js?v=1.3.1');
  if(name==='recall-flow.js')code=`{const s=document.createElement('script');s.textContent=UPPDRAG_PROMPT_ALIGNMENT.flow(${JSON.stringify(code)}).replaceAll('maxlength="120"','maxlength="240"').replaceAll('maxlength="600"','maxlength="4000"');document.head.append(s);}`;
  if(ch>=9&&name==='recall-flow.js')code=code.replace('document.head.append(s);','s.textContent=s.textContent.replace("Kontrollera svaren i rutorna","Jämför och spara ditt svar").replace("Att läsa exemplet är träning. Ett självständigt svar ska senare ges utan exemplet. En fråga om ett namn eller en vara kräver fortfarande bara den uppgiften.","Jämför med exemplet, men behåll dina egna ord. Öppna resonemang sparas för granskning utan automatisk mästarstämpel.");document.head.append(s);');
  return script(code,m[1]+m[3]);
 }));
 let index=0;page=page.replace(pattern,()=>scripts[index++]);page=query(page);
 const masteryModule=await get('mastery-progression.js?v=2.0.1');
 const staging=(await source('room-staging.js'))+'\n'+(await source('room-life.js'));
 const styles=`<style>header small,header .chapterBack{display:none}header h1{font-size:clamp(13px,2.6vw,20px)}#ch1Modal textarea{min-height:100px}#ch1Modal .rc-tools button{min-height:44px}#ch1Modal .rc-own{overflow-wrap:anywhere}#ch1Modal .ch1Sheet{overscroll-behavior:contain}</style>`;
 page=page.replace('<head>','<head><base href="'+new URL('../demo3/',document.baseURI).href+'">'+script(bridge(id)+'\n'+staging+([1,2,3,4].includes(ch)?'\n'+masteryModule:''))+styles);
 // Shared mastery engine is loaded for every chapter during the rebuild. Chapters opt in by configuring areas.
 // Chapters 1 and 2 configure mastery before their pilots; later chapters opt in later.
 // Optional, save-compatible side adventures are installed after existing scripts.
 const eventModule=ch<=10?(await get('event-approach.js?v=1.7.0'))+'\n'+(await get('event-recurrence.js?v=1.1.0'))+'\n'+(await get('event-engine.js?v=1.11.0')):'';
 const chapterPresentation=ch===4?(await get('chapter4-presentation.js?v=2.4.0'))+'\n'+(await get('chapter4-scenes.js?v=2.4.0')):ch===3?(await get('chapter3-presentation.js?v=2.2.0'))+'\n'+(await get('chapter3-courtyard-puzzle.js?v=1.0.0'))+'\n'+(await get('chapter3-scenes.js?v=2.2.0')):ch===2?(await get('chapter2-presentation.js?v=2.1.1'))+'\n'+(await get('chapter2-quilt-puzzle.js?v=1.0.0'))+'\n'+(await get('chapter2-sidequest.js?v=1.0.0')):'';
 const end=`window.__ROOM_BOOTING=false;window.UPPDRAG_ROOM_LIFE?.cacheFurniture();requestAnimationFrame(()=>parent.integratedReady(${id},${ch}));`;
 page=page.replace('</body>',script(([1,2,3,4].includes(ch)?'':masteryModule+'\n')+eventModule+'\n'+chapterPresentation+'\n'+(teacher?payload.inspector+'\n':'')+end)+'</body>');return page;
}
window.openIntegratedChapter=async function(ch){
 if(!Number.isInteger(ch)||ch<1||ch>10){showError('Välj ett kapitel mellan 1 och 10.');return false;}
 if(!available(ch)){showError('Avsluta först kapitel '+(ch-1)+'. Tidigare kapitel går att besöka igen.');return false;}
 if(ready&&durable){const url=new URL(document.baseURI);url.searchParams.set('chapter',ch);teacher?url.searchParams.set('teacher','1'):url.searchParams.delete('teacher');if(window.__INTEGRATION_TEST_NAVIGATE)window.__INTEGRATION_TEST_NAVIGATE(url.href);else location.assign(url.href);return true;}
 bindStore();const id=++serial;ready=false;chapter=ch;$('error').hidden=true;$('status').textContent='Laddar kapitel '+ch+' …';if(!frame.srcdoc)$('intro').hidden=false;
 try{
  const page=await makePage(ch,id);if(id!==serial)return false;const next=document.createElement('iframe');next.id='game';next.title='Uppdrag 1700 – staden och uppdragen';next.allow='autoplay';frame.replaceWith(next);frame=next;frame.srcdoc=page;return true;
 }catch(e){if(id===serial)showError(e.message);return false;}
};
window.integratedReady=(id,ch)=>{
 if(id!==serial)return;const w=frame.contentWindow,p=w['UPPDRAG_CH'+ch+'_PILOT'];
 if(!p?.recall||w.UPPDRAG_FRAGTEST_VERSION!=='3.1.0'){showError('Den nya frågedelen kunde inte kopplas till kapitlet.');return;}
 ready=true;frame.hidden=false;$('intro').hidden=true;write('lastChapter',ch);
 const url=new URL(document.baseURI);url.searchParams.set('chapter',ch);teacher?url.searchParams.set('teacher','1'):url.searchParams.delete('teacher');try{history.replaceState(null,'',url);}catch{}
 $('status').textContent='Kapitel '+ch+' av 10'+(replayId?' · Omspelning':'')+(teacher?' · Lärarvy':chapterTest?' · Separat kapitelprov':'');
 if(teacher){const rooms=w.listStagingRooms();$('roomChoice').replaceChildren();for(const item of [{key:'town',region:'main',label:'Staden · översikt'},...rooms]){const opt=document.createElement('option');opt.value=item.region+':'+item.key;opt.textContent=(item.group?item.group+' · ':'')+item.label;$('roomChoice').append(opt);}}
 updateMenu();frame.focus();
};
function updateMenu(){
 $('replayChapter').textContent='Spela om kapitel '+(chapterTest||1);$('replayChapter').disabled=!ready||!durable;$('returnOriginal').hidden=!replayId;
 $('replayNote').textContent=replayId?'Du spelar en separat omgång. Dina framsteg från den ordinarie omgången finns kvar.':'Spela från början i en ny omgång. Dina nuvarande framsteg finns kvar.';
 $('teacherTools').hidden=!teacher;$('toggleTeacher').textContent=teacher?'Till vanlig spelgång':'Öppna lärarvy';
 const list=$('chapterList');list.replaceChildren();TITLES.forEach((title,i)=>{const ch=i+1,button=document.createElement('button'),label=document.createElement('span'),state=document.createElement('small');label.textContent=ch+'. '+title;button.append(label,state);button.disabled=ch>10||!available(ch);state.textContent=ch>10?'Återstår':([1,2,3,4].includes(ch)?masteryComplete(ch):saved(ch)?.complete)?'Avklarat':ch===chapter?'Här är du':available(ch)?'Öppna':'Låst';button.onclick=()=>{$('menu').close();openIntegratedChapter(ch);};list.append(button);});
}
$('menuButton').onclick=()=>{updateMenu();$('menu').showModal();};$('closeMenu').onclick=()=>$('menu').close();
$('replayChapter').onclick=()=>{
 if(!ready||!durable)return;
 const url=new URL(document.baseURI);url.searchParams.set('chapter',String(chapterTest||1));url.searchParams.set('replay',crypto.randomUUID());url.searchParams.delete('teacher');location.assign(url.href);
};
$('returnOriginal').onclick=()=>{const url=new URL(document.baseURI);url.searchParams.delete('replay');url.searchParams.delete('testChapter');url.searchParams.delete('chapter');url.searchParams.delete('teacher');location.assign(url.href);};
$('toggleTeacher').onclick=()=>{teacher=!teacher;updateMenu();$('menu').close();const last=Number(read('lastChapter'))||1;openIntegratedChapter(available(last)?last:1);};
$('visitRoom').onclick=()=>{if(!teacher||!ready)return;const [region,key]=$('roomChoice').value.split(':');$('menu').close();if(!frame.contentWindow.visitStagingRoom(key,region))showError('Miljön kunde inte öppnas.');};
function entries(){const result={};for(const [k,v] of memory)if(k.startsWith(prefix()))result[k.slice(prefix().length)]=v;try{if(durable)for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith(prefix()))result[k.slice(prefix().length)]=localStorage.getItem(k);}}catch{durable=false;warning();}return result;}
$('exportSave').onclick=()=>{const data={format:'uppdrag1700-integrated-save',version:1,teacher,created:new Date().toISOString(),entries:entries()},url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='uppdrag1700-'+(teacher?'lararvy':'aventyr')+'-sparning.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('importSave').onclick=()=>$('saveFile').click();$('saveFile').onchange=async()=>{
 try{const f=$('saveFile').files[0];if(!f)return;if(f.size>5000000)throw Error('Sparfilen är för stor.');const data=JSON.parse(await f.text());if(data.format!=='uppdrag1700-integrated-save'||data.version!==1||data.teacher!==teacher||!data.entries||Array.isArray(data.entries))throw Error('Sparfilen hör inte till denna spelvy.');for(const [k,v]of Object.entries(data.entries)){if((k!=='lastChapter'&&!k.startsWith('uppdrag1700.'))||typeof v!=='string')throw Error('Ogiltig sparfil.');}if(!confirm('Läsa in kopian i denna spelvy? Nuvarande svar i kopian ersätts. Äldre spel påverkas inte.'))return;for(const[k,v]of Object.entries(data.entries))write(k,v);$('menu').close();openIntegratedChapter(Number(read('lastChapter'))||1);
 }catch(e){showError(e.message);}finally{$('saveFile').value='';}
};
async function boot(){
 warning();updateMenu();if(!window.DecompressionStream||!crypto.subtle)throw Error('Öppna äventyret i en uppdaterad webbläsare via HTTPS.');
 const [delta,q,fixes,alignment,powerLanguage,inspector]=await Promise.all([unzip('deltas.json.gz'),unzip('questions/snapshot.json.gz'),get('questions/fixes.js'),get('questions/alignment.js'),get('questions/power-language.js?v=2.1.1'),get('inspector.js')]);
 payload={...delta,questions:q.scripts,fixes,alignment,powerLanguage,inspector};
 let requested=Number(params.get('chapter')||read('lastChapter'))||1;if(!available(requested))requested=1;await openIntegratedChapter(requested);
}
window.addEventListener('unhandledrejection',e=>showError(e.reason?.message||String(e.reason)));boot().catch(e=>showError(e.message));
