/* Restore book/assessment requirements lost in the condensed chapter-4 bank.
 * Sources: workbook 11–15, textbook 75–80, test part 1 and its assessment guide.
 * Other chapters and their existing progress are unchanged. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==4)return;
const A=UPPDRAG_RECALL_ASSESS,priorDecorate=A.decorate,priorAssess=A.assess;
const V='book-4-20261029-v1';
const names={linne:['Carl von Linné','Linné','Carl Linné','von Linné'],celsius:['Anders Celsius','Celsius'],scheele:['Carl Wilhelm Scheele','Scheele','Carl Vilhelm Scheele']};
const options=['Carl von Linné','Anders Celsius','Carl Wilhelm Scheele'];
function fact(label,answers,rank,choices){return {label,answers,sample:answers[0],...(rank===0&&choices?{options:choices}:{})};}
function supplement(bank){
 for(const t of bank.filter(t=>t.chapter===4&&!t.reviewOnly)){
  if(t.materialVersion===V)continue;
  t.materialVersion=V;
  if(t.topic==='freedoms'){
   t.fields.push(fact('Vad kallas förhandsgranskning som kan stoppa en text före tryckning?',['Censur'],t.rank,['Censur','Tryckfrihet','Offentlighetsprincipen']));
   t.fields.push(fact('Vilket land var först i världen med tryckfrihet enligt avsnittet?',['Sverige'],t.rank,['Sverige','Frankrike','England']));
   if(t.rank===0)t.prompt='Koppla rätt begrepp till ärendena och återkalla uppgiften om landet.';
   t.source+='; prov del 1, 1a och 6';
   t.model+=' Censur är förhandsgranskning som kan stoppa texter. Sverige var först med tryckfrihet enligt avsnittet.';
  }
  if(t.topic==='researchers'){
   t.fields.push(fact('Vem var apotekare och forskade i kemi?',names.scheele,t.rank,options));
   t.fields.push(fact('Vem studerade hur vatten blir is och ånga?',names.celsius,t.rank,options));
   t.fields.push(fact('Vem var med och bildade Kungliga Vetenskapsakademien enligt textboken?',names.linne,t.rank,options));
   if(t.rank===0){t.fields.push(fact('Vem utvecklade systemet för att mäta temperatur?',names.celsius,t.rank,options));t.prompt='Koppla arbetsbokens sex påståenden till rätt forskare.';}
   t.source+='; arbetsbok 13, samtliga sex påståenden; prov del 1, 9a';
   t.model+=' Scheele var apotekare och arbetade med kemi. Celsius studerade vatten, is och ånga. Linné var med och bildade Vetenskapsakademien.';
  }
  if(t.topic==='academy'){
   if(t.rank===0)t.fields.push(fact('Varför kunde forskningen växa när det oftare var fred?',['Mer tid och pengar kunde användas till forskning.'],0,['Mer tid och pengar kunde användas till forskning.','Alla människor fick samma utbildning och makt.','Forskarna behövde inte längre undersöka något.']));
   if(t.rank===1){
    t.fields.push(fact('Vad blev det oftare: krig eller fred?',['fred'],1));
    t.fields.push(fact('Vilka två resurser kunde då användas mer till forskning?',['tid och pengar','pengar och tid','mer tid och pengar','mer pengar och tid','tid, pengar','pengar, tid','tid samt pengar','pengar samt tid'],1));
   }
   if(t.rank===2)t.fields.push({label:'Förklara också sambandet mellan fred och mer forskning.',sample:'När det var fred oftare kunde mer tid och pengar användas till forskning.',criterion:'Koppla fred till att mer tid och pengar kunde användas till forskning.'});
   t.source+='; textbok s. 78 och lärarguidens fråga 3 på s. 80';
   t.model+=' När det oftare var fred fanns mer tid och pengar till forskning.';
  }
  if(t.topic==='ekeblad'){
   if(t.rank===0)t.fields.push(fact('Vem blev den första kvinnan i Vetenskapsakademien?',['Eva Ekeblad','Ekeblad'],0,['Eva Ekeblad','Ulrika Eleonora','Cajsa Warg']));
   if(t.rank===1)t.fields[0].label='Den första kvinnan i Vetenskapsakademien, som forskade om potatis, hette …';
  }
  if(t.id==='rc4-reading-2'){
   t.prompt='Hur kunde egen bibelläsning utmana makthavarnas ord? Ge två konkreta exempel ur textboken. Stödord går bra.';
   t.fields[0].sample='Det stod inte att man alltid måste lyda kungen. Man kunde läsa om fred och om att alla människor var lika mycket värda.';
   t.fields[0].criterion='Ge två olika exempel från texten: kungens lydnadskrav, fred eller människors lika värde.';
   t.model=t.fields[0].sample;t.source='Arbetsbok 11; textbok s. 75; prov del 1, 8';
  }
  t.studentModel=t.model;
 }
}
supplement(UPPDRAG_RECALL_BANK);
A.decorate=function(bank){priorDecorate(bank);supplement(bank);for(const t of bank)if(t.materialVersion===V)t.studentModel=t.model;};
const norm=s=>A.norm(s).replace(/[–—-]/g,' ').replace(/\s+/g,' ').trim();
function status(d){if(d.some(x=>x.status==='empty'))return 'empty';if(d.some(x=>['wrong','contradiction'].includes(x.status)))return 'contradiction';if(d.some(x=>x.status==='missing'))return 'needs-work';if(d.some(x=>x.status==='review'))return 'review';return 'sufficient';}
function kingException(s){
 return /(?:stod|star|sager|sade|sa).{0,20}(?:inte|inget).{0,65}(?:lyda|lydde|lydas).{0,25}kung|(?:behovde|maste|skulle|ska).{0,10}inte alltid.{0,20}lyda.{0,20}kung|inte.{0,18}(?:alltid|maste).{0,25}lyda.{0,20}kung|kung.{0,15}(?:maste|behovde).{0,10}inte alltid.{0,15}lydas|inget.{0,20}(?:om|krav).{0,40}lyda.{0,20}kung/.test(s);
}
function bibleEvidence(value){
 const s=norm(value),parts=s.split(/[.,;!?\n]+/);
 const contradiction=parts.some(p=>/kung/.test(p)&&/alltid/.test(p)&&/lyd/.test(p)&&!kingException(p))||/(?:inte|aldrig).{0,12}\bfred\b|inte alla.{0,24}lika.{0,15}vard|inte lika.{0,18}vard|olika (?:mycket )?varda/.test(s);
 const king=kingException(s);
 const peace=/\bfred\b/.test(s)&&!/(?:inte|aldrig).{0,12}\bfred\b/.test(s);
 const equal=/alla.{0,30}(?:lika.{0,15}vard|samma.{0,15}varde)|manniskor.{0,25}(?:lika.{0,15}vard|samma.{0,15}varde)|(?:allas|manniskors) lika varde/.test(s);
 return {count:[king,peace,equal].filter(Boolean).length,contradiction};
}
function bibleExamples(value){return bibleEvidence(value).count;}
A.assess=function(t,drafts,check){
 if(t.id==='rc4-reading-2'&&t.rank===2){
  if(!A.isMeaningful(drafts[0]))return {status:'empty',details:[{field:0,status:'empty',label:'Skriv två konkreta exempel från texten.'}]};
  const {count,contradiction}=bibleEvidence(drafts[0]);const d=[{field:0,status:contradiction?'contradiction':count>=2?'met':count===1?'missing':'review',label:'Ge två olika exempel: att man inte alltid måste lyda kungen, fred eller människors lika värde.'}];return {status:status(d),details:d};
 }
 const r=priorAssess(t,drafts,check);
 if(t.id!=='rc4-academy-2'||t.rank!==2)return r;
 const s=norm(drafts[1]),d=r.details.filter(x=>x.field!==1);
 const peaceful=/\bfred(?:en)?\b|farre krig|inte.{0,10}krig/.test(s);
 const resources=/\btid\b/.test(s)&&/pengar|resurs/.test(s);
 const link=/kunde|gav|gett|gjorde|frigjord|fanns|fick|anvand|lagga|satsa/.test(s)&&/forsk|undersok|vetenskap/.test(s);
 const falseLink=/(?:mindre|ingen|inga|inte mer).{0,18}(?:tid|pengar|resurs)|(?:ingen|inte).{0,10}(?:forskning|forska)/.test(s);
 const met=peaceful&&resources&&link&&!falseLink;

 d.push({field:1,status:!A.isMeaningful(drafts[1])?'empty':met?'met':'review',label:'Förklara hur fred gav mer tid och pengar till forskning.'});
 return {...r,details:d,status:status(d)};
};
window.UPPDRAG_CH4_MATERIAL={version:V,bibleExamples};
})();
