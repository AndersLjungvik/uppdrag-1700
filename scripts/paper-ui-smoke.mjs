import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||process.cwd(),'package.json'));
const {createCanvas}=require('@napi-rs/canvas');
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const bank=JSON.parse(fs.readFileSync(new URL('../dist/classroom-bank.json',import.meta.url),'utf8'));
const cards=new Map(bank.missions.flatMap(m=>m.cards).map(q=>[q.id,q]));
const storage=new Map();let clock=0,raf=[],document,win,viewport={width:1280,height:650};
class Classes{constructor(el){this.el=el}add(...names){this.el.className=[...new Set([...this.el.className.split(' '),...names])].filter(Boolean).join(' ')}remove(...names){this.el.className=this.el.className.split(' ').filter(n=>!names.includes(n)).join(' ')}toggle(n,on){const yes=this.el.className.split(' ').includes(n);on??=!yes;on?this.add(n):this.remove(n);return on}contains(n){return this.el.className.split(' ').includes(n)}}
class Element{
 constructor(tag='div',attrs={}){this.tagName=tag.toUpperCase();this.attrs=attrs;this.id=attrs.id||'';this.children=[];this.parentElement=null;this._text='';this.className=attrs.class||'';this.classList=new Classes(this);this.style={};this.dataset={};this.hidden='hidden'in attrs;this.open=false;this.disabled='disabled'in attrs;this.value=attrs.value||'';this.events={};for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5)]=v;}
 set textContent(t){this._text=String(t);this.children=[]}get textContent(){return this._text+this.children.map(c=>c.textContent).join('')}
 append(...nodes){for(let n of nodes){if(typeof n==='string')n=new Element('#text');if(n.parentElement)n.remove();n.parentElement=this;this.children.push(n)}}appendChild(n){this.append(n);return n}replaceChildren(...nodes){for(const c of this.children)c.parentElement=null;this.children=[];this._text='';this.append(...nodes)}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(c=>c!==this);this.parentElement=null}
 setAttribute(k,v){this.attrs[k]=String(v);if(k==='aria-current')this.ariaCurrent=v}getAttribute(k){return this.attrs[k]??null}
 addEventListener(k,fn){(this.events[k]??=[]).push(fn)}dispatch(k,event={}){const e={target:this,preventDefault(){this.prevented=true},stopPropagation(){},...event};for(const f of this.events[k]||[])f(e);return this['on'+k]?.(e)}click(){if(!this.disabled)this.dispatch('click')}
 focus(){document.activeElement=this}showModal(){this.open=true}close(){this.open=false}get offsetHeight(){return this.hidden?0:110}
 getBoundingClientRect(){return{left:0,top:0,width:viewport.width,height:viewport.height}}
 querySelectorAll(s){return select(this,s)}
}
function select(root,s){return walk(root).filter(el=>{if(s==='dialog[open]')return el.tagName==='DIALOG'&&el.open;if(s.startsWith('#'))return el.id===s.slice(1);if(s.startsWith('.'))return el.className.split(' ').includes(s.slice(1));const d=s.match(/^\[data-([\w-]+)\]$/);if(d)return d[1]in el.dataset;return el.tagName===s.toUpperCase()})}
function walk(root){return root.children.flatMap(c=>[c,...walk(c)])}
function make(tag,attrs){const el=new Element(tag,attrs);if(tag!=='canvas')return el;const c=createCanvas(1280,720);for(const k of Object.keys(el))c[k]=el[k];for(const k of Object.getOwnPropertyNames(Element.prototype))if(k!=='constructor')Object.defineProperty(c,k,Object.getOwnPropertyDescriptor(Element.prototype,k));c.classList=new Classes(c);return c}
function mount(){const root=new Element('document'),stack=[root];for(const token of html.matchAll(/<\/?[a-zA-Z][^>]*>|[^<]+/g)){const t=token[0];if(t.startsWith('</')){if(stack.length>1)stack.pop();continue}if(t.startsWith('<')){const name=t.match(/^<([\w-]+)/)[1].toLowerCase();if(name==='script'||name==='style')continue;const attrs={};for(const a of t.matchAll(/\s([\w-]+)(?:="([^"]*)")?/g))attrs[a[1]]=a[2]??'';const el=make(name,attrs);stack.at(-1).append(el);if(!['meta','link','input','br','img','hr'].includes(name))stack.push(el)}else stack.at(-1)._text+=t}
 document={hidden:false,body:walk(root).find(e=>e.tagName==='BODY')||root,documentElement:root,getElementById:id=>walk(root).find(e=>e.id===id)||null,querySelectorAll:s=>select(root,s),querySelector:s=>select(root,s)[0]||null,createElement:tag=>make(tag,{}),createTextNode:t=>{const e=new Element('#text');e.textContent=t;return e},addEventListener(){}};
 win={UPPDRAG_OFFLINE:true,CLASSROOM_CURRICULUM:bank,addEventListener(){},dispatchEvent(){},matchMedia:()=>({matches:false}),devicePixelRatio:1};const ctx=vm.createContext({window:win,Date});vm.runInContext(fs.readFileSync(new URL('../dist/practice.js',import.meta.url),'utf8'),ctx);
 Object.assign(globalThis,{window:win,document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},matchMedia:win.matchMedia,devicePixelRatio:1,ResizeObserver:class{constructor(fn){this.fn=fn}observe(){this.fn()}},Image:class{},requestAnimationFrame:fn=>{raf.push(fn);return raf.length},setTimeout:()=>1,clearTimeout(){},performance:{now:()=>clock}});raf=[];
 return root;
}
const $=id=>{const e=document.getElementById(id);assert(e,'Missing '+id);return e};
const snapshot=()=>win.UPPDRAG_GAME_CLOUD.snapshot();
function ticks(n=30){for(let i=0;i<n;i++){clock+=200;const f=raf;raf=[];for(const fn of f)fn(clock)}}
function action(prefix){const b=$('actions').children.find(x=>x.textContent.startsWith(prefix));assert(b,'Missing action '+prefix+' in '+$('actions').textContent);b.click();ticks(1)}
function go(place){if(document.body.dataset.view!=='town')$('home').click();const b=document.querySelectorAll('[data-place]').find(x=>x.dataset.place===place);assert(b);b.click();ticks();}
function quiz(){const w=snapshot().paperWorld;return w.workMode==='story'?w.jobs[w.chapter].active?.quiz:w.review}
function solveQuestion(){const session=quiz(),q=cards.get(session.ids[session.index]);assert(q);if(q.type==='short'){$('answer').value=q.answer;$('answerForm').dispatch('submit')}else{$('showOptions').click();const selects=$('chainParts').children.map(r=>r.children.find(c=>c.tagName==='SELECT'));assert.equal(selects.length,3);selects.forEach((el,i)=>{el.value=q.steps[i].answer;el.dispatch('change')});$('chainForm').dispatch('submit')}assert(!$('feedback').hidden);assert($('feedback').textContent.startsWith('Rätt.'));$('next').click();ticks(1)}
function finishQuiz(){let guard=0;while(document.body.dataset.view==='work'){assert(++guard<80);solveQuestion()}}
mount();await import('../dist/world/app.mjs?smoke=1');ticks(1);
assert.equal(snapshot().paperWorld.chapter,1);assert(!$('timeline').hidden);assert($('chapterBadge').textContent.includes('Lärling'));
$('bookBtn').click();assert($('book').open);assert($('currentOrder').textContent.includes('Beställning'));assert.equal($('chapterList').children.length,10);assert($('chapterList').children[0].textContent.includes('Mästare'));$('bookClose').click();
go('cafe');assert($('timeline').hidden);action('Ta uppdraget');go('print');action('Börja');assert.equal(document.body.dataset.view,'work');assert($('timeline').hidden);assert.equal(snapshot().paperWorld.known.length,1);
$('hint').click();assert.equal(snapshot().inventory.apple,undefined);assert(!$('helpText').hidden);const paid=quiz().clue;assert(paid);$('hint').click();assert.equal(snapshot().inventory.apple,undefined);
$('back').click();$('home').click();go('archive');action('Repetera hos');action('Börja repetera');assert.equal(snapshot().paperWorld.review.ids.length,1);finishQuiz();assert.equal(snapshot().inventory.apple,1);
// A second pass can earn an apple on the same real day. No spacing level is fabricated.
action('Tillbaka');action('Repetera hos');action('Börja repetera');finishQuiz();assert.equal(snapshot().inventory.apple,2);
// A fresh page load preserves the paid hint and the unfinished delivery.
mount();await import('../dist/world/app.mjs?smoke=2');ticks(1);go('print');action('Fortsätt arbetspasset');assert.equal(quiz().clue,paid);$('hint').click();assert.equal(snapshot().inventory.apple,2);finishQuiz();action('Lämna');assert.equal(snapshot().paperWorld.jobs[1].done,1);assert($('chapterBadge').textContent.includes('Gesäll'));
action('Ta uppdraget');go('quay');action('Börja');finishQuiz();go('print');action('Lämna');assert.equal(snapshot().paperWorld.jobs[1].done,2);
action('Ta uppdraget');action('Börja');finishQuiz();action('Till pressen');for(const id of ['ink','paper','type']){document.querySelectorAll('[data-material]').find(b=>b.dataset.material===id).click();$('pressTarget').click()}action('Gör ett provtryck');go('cafe');action('Ta godkännandet');go('print');action('Ta den färdiga');go('cafe');action('Lämna');assert.equal(snapshot().paperWorld.jobs[1].done,3);assert.equal(snapshot().paperWorld.unlocked,2);
$('bookBtn').click();assert.equal($('chapterList').children[0].children[1].children.filter(e=>e.className.includes('complete')).length,3);$('bookClose').click();
// The next chapter can be reached normally; teacher chapter selection also opens Opera/Finland.
action('Nästa avsnitt');assert.equal(snapshot().paperWorld.chapter,2);assert(!$('timeline').hidden);
$('bookBtn').click();$('chapterSelect').value='8';$('openChapter').click();assert.equal(snapshot().paperWorld.chapter,8);assert($('timelineLabel').textContent.includes('1792'));
go('print');action('Ta uppdraget');go('gate');action('Operan');action('Ta underlaget');go('quay');action('Ta det senare');go('gate');action('Operan');action('Börja');assert.equal(document.body.dataset.view,'work');assert($('timeline').hidden);assert($('workTitle').textContent.includes('Lärling'));
console.log('PASS paper UI: real button/form handlers, walking, 139-card bank, chapter stamps, city-only timeline, paid persistent clues, repeatable mentor rewards, full proof handover, page reload and Opera access.');

// Load the actual embedded module bundle, not a substitute application.
const standalone=fs.readFileSync(new URL('../dist/uppdrag-1700.html',import.meta.url),'utf8');const embedded=standalone.match(/<script type="module">import "(data:[^"]+)";<\/script>/)?.[1];assert(embedded);viewport={width:390,height:500};mount();win.UPPDRAG_WORLD_ASSETS={town:'data:image/webp;base64,',quay:'data:image/webp;base64,',work:'data:image/webp;base64,'};await import(embedded);ticks(1);assert(document.body.classList.contains('speech-docked'));assert.equal($('bubble').parentElement.id,'speechDock');$('back').click();assert($('timeline').hidden);$('home').click();assert(!$('timeline').hidden);assert.equal(snapshot().paperWorld.chapter,8);
console.log('PASS embedded offline application and narrow-screen speech docking: same saved chapter and city-only timeline.');
