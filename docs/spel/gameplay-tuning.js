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
 if(name!=='interior-fibre-art.js')return source;
 source=once(name,source,
`        const pressScale=.94,feet=floor+90;
        groundShadow(g,492,feet+3,151);
        place(g,335,feet-510*pressScale,pressScale,press);`,
`        // Pressen står längre bak mot väggen och är mindre än arbetsbordet i förgrunden.
        const pressScale=.70,feet=floor+24;
        groundShadow(g,524,feet+3,112);
        place(g,410,feet-510*pressScale,pressScale,press);`);
 source=once(name,source,
`        const pressScale=1.04,feet=floor+143;
        groundShadow(g,935,feet+3,171);
        place(g,775,feet-510*pressScale,pressScale,press);`,
`        // Samma perspektiv i bred vy: mindre skala och fötterna nära bakväggens golvlinje.
        const pressScale=.78,feet=floor+35;
        groundShadow(g,986,feet+3,130);
        place(g,860,feet-510*pressScale,pressScale,press);`);
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
`return h+'<div class="rc-actions">'+btn('revise','Bearbeta mitt svar',true)+btn('save-review','Spara för lärargranskning')+btn('go-rut','Öva hos Rut')+'</div>';`,
`return h+'<div class="rc-actions">'+btn('revise','Bearbeta mitt svar',true)+btn('save-review',t.chapter===6?'Spara svaret och gå vidare':'Spara för lärargranskning')+btn('go-rut','Öva hos Rut')+'</div>';`);
 source=once(name,source,
`  return s.record.some(x=>x.version===VERSION&&x.step===s.step&&x.id===id&&x.ok&&x.assessment!=='self-review'&&(t?.rank!==2||x.independent));`,
`  return s.record.some(x=>x.version===VERSION&&x.step===s.step&&x.id===id&&x.ok&&(x.assessment==='pending-review'||(x.assessment!=='self-review'&&(t?.rank!==2||x.independent))));`);
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
window.UPPDRAG_GAMEPLAY_TUNING={source,version:'1.2.0'};
})();