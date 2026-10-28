/* Uppdrag 1700 · chapter 7 war law grading hotfix 1.3.1
 * The previous rule rejected "utan riksdagens" even when preceded by
 * "kunde inte starta", and did not tolerate "kring" for "krig".
 * Only rc7-warStart-1 is affected; existing answers/saves are preserved.
 */
(function(){
'use strict';
const A=window.UPPDRAG_RECALL_ASSESS;
if(!A || typeof A.assess!=='function')throw Error('Krigsfrågans rättning kunde inte kopplas in.');
const before=A.assess;
const norm=value=>A.norm(String(value??'')).replace(/\bkring\b/g,'krig').replace(/\s+/g,' ').trim();
function evaluate(value){
 const s=norm(value);
 if(!s || !/(krig|anfall|anfalla|inleda)/.test(s) || !/riksdag/.test(s))return 'review';
 const approval=/(godkann|godkand|tillstand|samtyck|lov|beslut|fraga)/.test(s);
 if(!approval)return 'review';
 // These explicitly claim that parliament was not required or that a king
 // could initiate an offensive war without its approval.
 if(/(?:behovde|maste|kravdes|kravde|skulle)\s+inte.{0,45}(?:riksdag|godkann|tillstand)/.test(s) ||
    /riksdag.{0,25}(?:behovde inte|maste inte|kunde inte|fick inte).{0,22}(?:godkann|beslut)/.test(s))return 'wrong';
 const prohibited=/(?:kunde|fick|far|hade ratt|var tillaten).{0,45}(?:starta|inleda|anfalla|krig|anfall).{0,55}utan.{0,35}riksdag/.test(s);
 const negated=/(?:kunde|fick|far|hade ratt|var tillaten).{0,16}(?:inte|ej|aldrig).{0,40}(?:starta|inleda|anfalla|krig|anfall)/.test(s);
 if(prohibited && !negated)return 'wrong';
 // An explicit parliamentary requirement, or an explicit negation of the
 // king's right to start a war without such approval, is sufficient.
 const requirement=/(riksdag.{0,65}(?:godkann|tillstand|samtyck|beslut|lov)|(?:maste|behovde|kravdes|kravde|skulle).{0,48}(?:riksdag|godkann|tillstand)|(?:riksdagens|riksdag).{0,30}godkann)/.test(s);
 const conditional=/(?:bara|endast|forst|om).{0,42}riksdag.{0,30}(?:godkann|godkand|beslut|tillstand)/.test(s);
 if((requirement || conditional) && (negated || /(?:maste|behovde|kravdes|kravde|skulle|bara|endast|om|forst|fick inte)/.test(s)))return 'met';
 return 'review';
}
A.assess=function(task,drafts,shortCheck){
 const result=before(task,drafts,shortCheck);
 if(task?.id!=='rc7-warStart-1'||task?.chapter!==7)return result;
 const value=String(drafts?.[0]??'').trim();
 if(!value)return result;
 const decision=evaluate(value);
 const details=result.details.map(x=>({...x}));
 const first=details.find(x=>x.field===0);
 if(first){first.status=decision==='met'?'met':decision==='wrong'?'wrong':'review';}
 return {...result,details,status:decision==='met'?'sufficient':decision==='wrong'?'contradiction':'review'};
};
window.UPPDRAG_CH7_WAR_FIX={version:'1.3.1',evaluate};
})();