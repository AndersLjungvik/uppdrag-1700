/* Integrated game 1.2: small, fail-loud tuning patches.
 * Keeps the question bank and room sources versioned while adjusting presentation
 * and allowing uncertain chapter-six language to continue without awarding mastery. */
(function(){
'use strict';
function once(name,source,before,after){
 const i=source.indexOf(before);
 if(i<0||source.indexOf(before,i+1)>=0)throw Error('Speljusteringen matchar inte '+name+'. Ingen halvändrad version används.');
 return source.slice(0,i)+after+source.slice(i+before.length);
}
function patchRoom(name,source){
 if(!['interior-ch1-pilot.js','interior-fibre-art.js'].includes(name))return source;
 source=once(name,source,
`        const pressScale=.94,feet=floor+90;
        groundShadow(g,492,feet+3,151);
        place(g,335,feet-510*pressScale,pressScale,press);`,
`        // Pressen står längre bak mot väggen och är mindre än arbetsbordet i förgrunden.
        const pressScale=.45,feet=floor+5;
        groundShadow(g,515,feet+3,72);
        place(g,440,feet-510*pressScale,pressScale,press);`);
 source=once(name,source,
`        const pressScale=1.04,feet=floor+143;
        groundShadow(g,935,feet+3,171);
        place(g,775,feet-510*pressScale,pressScale,press);`,
`        // Samma perspektiv i bred vy: mindre skala och fötterna nära bakväggens golvlinje.
        const pressScale=.46,feet=floor+5;
        groundShadow(g,944,feet+3,75);
        place(g,869,feet-510*pressScale,pressScale,press);`);
 return source;
}
function patchChapterSix(name,source){
 if(name!=='chapter6-content.js')return source;
 source=once(name,source,
` consolidation:s=>/sma|spridda|smala|tegar/.test(s)&&/slogs ihop|slog ihop|saml|storre|sammanhang/.test(s)&&!not(s)&&!/stora.{0,20}(delades|blev).{0,20}(sma|smala)/.test(s),`,
` consolidation:s=>/(sma|spridda|smala|tegar|akerplatt|akrar|falt)/.test(s)&&/(slogs ihop|slog ihop|blev ihop|saml|storre|sammanhang|f[aä]rre)/.test(s)&&!not(s)&&!/stora.{0,20}(delades|blev).{0,20}(sma|smala)/.test(s),`);
 source=once(name,source,
` relocation:s=>/gard|hus|de |hon /.test(s)&&/flytt/.test(s)&&/jord|aker|akrar|fal[tv]/.test(s)&&!not(s),`,
` relocation:s=>/gard|hus|de |hon /.test(s)&&/flytt/.test(s)&&/(jord|aker|akrar|fal[tv]|fran byn|ur byn|utanfor byn|is[äa]r)/.test(s)&&!not(s),`);
 return source;
}
function patchRecall(name,source){
 if(name!=='recall-flow.js')return source;
 source=once(name,source,
`function shuffled(xs,seed){
 let n=2166136261;for(const c of String(seed)){n^=c.charCodeAt(0);n=Math.imul(n,16777619)>>>0;}
 const out=xs.slice();for(let i=out.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[out[i],out[j]]=[out[j],out[i]];}
 return out;
}`,
`function shuffled(xs){
 const out=xs.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;
}
function optionOrder(options,u,key){
 const orders=u.optionOrders??={},saved=orders[key];
 if(!Array.isArray(saved)||JSON.stringify(saved.slice().sort())!==JSON.stringify(options.slice().sort()))orders[key]=shuffled(options);
 return orders[key];
}`);
 source=once(name,source,"shuffled(f.options,u.key+'|'+ix)","optionOrder(f.options,u,ix)");
 source=once(name,source,
" function variant(t){return t.variants?.[(state().recallAttempt||0)%t.variants.length];}",
` function variant(t){
  if(!t.variants?.length)return undefined;const u=ui();
  if(!Number.isInteger(u.variantIndex)||!t.variants[u.variantIndex])u.variantIndex=u.tf!==null?(state().recallAttempt||0)%t.variants.length:Math.floor(Math.random()*t.variants.length);
  return t.variants[u.variantIndex];
 }`);
 source=once(name,source,"btn('tf-true','Sant')+btn('tf-false','Falskt')","optionOrder(['tf-true','tf-false'],u,'truth-buttons').map(action=>btn(action,action==='tf-true'?'Sant':'Falskt')).join('')");
 source=once(name,source,
"   const text=t.prompt+' '+(variant(t)?.text||'')+' '+t.fields.map(f=>f.label).join('. ');",
"   const text=t.prompt+' '+(t.kind==='tf'&&!isDrill()?(variant(t)?.text||''):'')+' '+t.fields.map((f,i)=>f.label+(t.rank===0&&f.options&&!isDrill()?'. '+optionOrder(f.options,u,i).map((value,j)=>'Alternativ '+(j+1)+': '+value).join('. '):'')).join('. ');");
 source=once(name,source,
`return h+'<div class="rc-actions">'+btn('revise','Bearbeta mitt svar',true)+btn('save-review','Spara för lärargranskning')+btn('go-rut','Öva hos Rut')+'</div>';`,
`return h+'<div class="rc-actions">'+btn('revise','Bearbeta mitt svar',true)+btn('save-review',t.chapter===6?'Spara svaret och gå vidare':'Spara för lärargranskning')+btn('go-rut','Öva hos Rut')+'</div>';`);
 source=once(name,source,
`  return s.record.some(x=>x.version===VERSION&&x.step===s.step&&x.id===id&&x.ok&&x.assessment!=='self-review'&&(t?.rank!==2||x.independent));`,
`  return s.record.some(x=>x.version===VERSION&&x.step===s.step&&x.id===id&&x.ok&&(x.assessment==='pending-review'||(x.assessment!=='self-review'&&(t?.rank!==2||x.independent||t.chapter===6))));`);
 source=once(name,source,
`   const title=result.status==='right'?(isDrill()?'Du mindes det här':t.fields.some(f=>!f.answers)?'Innehållskraven känns igen':'Kortsvar kontrollerat'):'Det här behöver övas';`,
`   const title=result.status==='pending-review'?'Svaret sparat för granskning':result.status==='right'?(isDrill()?'Du mindes det här':t.fields.some(f=>!f.answers)?'Innehållskraven känns igen':'Kortsvar kontrollerat'):'Det här behöver övas';`);
 source=once(name,source,
`  }else if(name==='save-review'&&u.phase==='review'){
   u.error='Svaret är sparat för lärargranskning. Det har inte gett mästarstatus.';
   (s.recallPendingReview??=[]).push({id:t.id,answer:u.drafts.slice(),at:new Date().toISOString()});
   save();render();`,
`  }else if(name==='save-review'&&u.phase==='review'){
   const at=new Date().toISOString();
   (s.recallPendingReview??=[]).push({id:t.id,answer:u.drafts.slice(),at});
   if(t.chapter===6){
    s.record.push({version:VERSION,chapter,step:s.step,trial:s.trial,id:t.id,level:['Lärling','Gesäll','Mästare'][t.rank],ok:true,support:true,assessment:'pending-review',independent:false,answer:u.drafts.slice(),ab:t.source,at});
    if(!s.recallNeeds.includes(t.id))s.recallNeeds.push(t.id);
    u.result={status:'pending-review',support:true,checks:u.result?.details||[]};u.phase='feedback';u.error='';
    if(!s.archiveActive)s.mode='feedback';save();render();
   }else{
    u.error='Svaret är sparat för lärargranskning. Det har inte gett mästarstatus.';save();render();
   }`);
 return source;
}
function source(name,text){return patchRecall(name,patchChapterSix(name,patchRoom(name,text)));}
window.UPPDRAG_GAMEPLAY_TUNING={source,version:'1.3.0'};
})();
