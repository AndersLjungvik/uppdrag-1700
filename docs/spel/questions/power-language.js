/* Recognise the two relationships in chapter 1, not one model sentence.
 * This is still a local language check. Unrecognised wording stays reviewable.
 */
(function(){
'use strict';
const A=window.UPPDRAG_RECALL_ASSESS,previous=A.assess;
const royal='(?:kungen|drottningen|regenten|monarken)',poss='(?:kungens|drottningens|regentens|monarkens)';
const assembly='(?:riksdag(?:en|ens)?|riksrad(?:et|ets)?|parlamentet)';
const institution=assembly+'(?: och '+assembly+')?';
const power='(?:makt(?:en)?|inflytande(?:t)?)';
const test=(s,p)=>new RegExp('\\b'+p+'\\b').test(s);
const clean=v=>A.norm(v).replace(/[–—-]/g,' ').replace(/\s+/g,' ').trim();
const parts=s=>s.split(/[.!?;,\n]+|\b(?:men|daremot)\b|\boch\s+(?=(?:kungen|drottningen|regenten|monarken|riksdagen|riksradet)\b)/).map(s=>s.trim()).filter(Boolean);
const negated=s=>/\b(?:inte|ej|aldrig)\b/.test(s);
function shared(s){
 if(negated(s))return false;
 return test(s,royal+' (?:fick |maste |behovde |var tvungen att )?(?:dela|delade|delar) (?:pa )?makten med '+institution)
  ||test(s,'makten (?:delades|fordelades) mellan '+royal+' och '+institution)
  ||test(s,institution+' (?:fick |maste |behovde )?(?:dela|delade|delar) (?:pa )?makten med '+royal)
  ||test(s,'makt(?:en)? (?:flyttades|overfordes|flyttade|gick) fran '+royal+' till '+institution)
  ||test(s,institution+' (?:begransade|begransar) '+poss+' makt');
}
function limited(c){
 if(test(c,'(?:'+poss+' )?envalde(?:t)? (?:hade |har |var |blev |redan |nu )*(?:upphorde|upphort|avskaffades|avskaffats|avskaffat|slutade|forsvann|tog slut|tagit slut)')&&!negated(c))return true;
 if(!negated(c)&&(test(c,'(?:det )?(?:var|blev|ar) slut pa (?:'+poss+' )?envalde(?:t)?')||test(c,'(?:avskaffade|tog bort|gjorde slut pa) (?:'+poss+' )?envalde(?:t)?')))return true;
 if(test(c,royal+' (?:kunde|fick|far|kan) (?:inte|ej) (?:langre )?(?:bestamma|styra) (?:helt )?(?:ensam|sjalv|allt|allting)'))return true;
 if(test(c,royal+' (?:bestamde|styrde|bestammer|styr|var|ar) (?:inte|ej) (?:langre )?(?:helt )?(?:ensam|sjalv|allt|allting|envaldig)'))return true;
 if(negated(c))return false;
 return test(c,royal+' (?:fick|hade|har) (?:nu |da )?(?:mindre|begransad) '+power)
  ||test(c,royal+' (?:forlorade|misste|miste|tappade) (?:en del av |lite av |sin |sitt )*'+power)
  ||test(c,poss+' makt (?:hade |har )?(?:minskade|minskat|begransades|begransats)')
  ||test(c,poss+' makt (?:blev|var|ar) (?:mindre|begransad)')
  ||test(c,'mindre makt (?:at|till) '+royal)
  ||shared(c);
}
function gained(c){
 if(negated(c))return false;
 return test(c,institution+' (?:fick|hade|har) (?:nu |da |ett )?(?:mer|mera|storre|okat|okad|utokat|utokad) '+power)
  ||test(c,institution+' (?:fick|kunde|far|kan) (?:vara med och )?(?:bestamma|paverka|styra) (?:mer|mera)')
  ||test(c,institution+' (?:bestamde|bestammer|paverkade|styrde) (?:mer|mera)')
  ||test(c,institution+' fick (?:mer|mera) att saga till om')
  ||test(c,institution+'(?:s)? '+power+' (?:okade|vaxte|starktes|blev storre)')
  ||test(c,'(?:mer|mera|storre|okat|okad) '+power+' (?:gavs |gick |overfordes )?(?:at|till) '+institution)
  ||shared(c);
}
function contradiction(c){
 return !negated(c)&&(test(c,royal+' (?:hade|fick|beholl) (?:fortfarande )?(?:all|hela) makten')
  ||test(c,royal+' (?:kunde|fick) (?:fortfarande )?(?:bestamma|styra) (?:helt )?(?:ensam|sjalv)')
  ||test(c,institution+' (?:fick|hade) (?:mindre|minskat) '+power)
  ||test(c,'envaldet (?:fortsatte|fanns kvar|var kvar)')
  ||test(c,'alla (?:manniskor )?fick (?:lika mycket|samma|lika) (?:makt|inflytande)'));
}
A.assess=function(t,drafts,shortCheck){
 if(t.chapter!==1||t.topic!=='power'||t.rank===0||t.fields[0].answers)return previous(t,drafts,shortCheck);
 const value=String(drafts[0]??'');
 if(!A.isMeaningful(value))return previous(t,drafts,shortCheck);
 const s=clean(value),clauses=parts(s);
 const coupled=clauses.some(shared)||shared(s);
 const ellipse=!negated(s)&&(test(s,royal+' fick mindre makt och '+institution+' (?:fick )?mer')||test(s,'mindre makt (?:at|till) '+royal+' och mer (?:at|till) '+institution));
 const hasLimit=coupled||ellipse||clauses.some(limited),hasGain=coupled||ellipse||clauses.some(gained);
 const details=[
  {field:0,status:hasLimit?'met':'missing',label:'Beskriv att regenten inte längre bestämde ensam eller fick mindre makt.'},
  {field:0,status:hasGain?'met':'missing',label:'Beskriv att riksdagen eller riksrådet fick mer att bestämma om.'}
 ];
 if(clauses.some(contradiction))details.push({field:0,status:'contradiction',label:'Kontrollera riktningen: regentens makt begränsades och riksdagens eller riksrådets inflytande ökade.'});
 return {status:details.some(d=>d.status==='contradiction')?'contradiction':hasLimit&&hasGain?'sufficient':'review',details};
};
A.version+='-power-language-1';
})();
