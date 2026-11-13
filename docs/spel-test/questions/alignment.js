/* 3.2.0: shared spelling and clause-order support, plus prompt alignment.
 * Loaded by the integrated game as well as the teacher question test.
 * Recognition remains rule-based. Unknown content is review, not mastery.
 */
(function(){
'use strict';
const A=window.UPPDRAG_RECALL_ASSESS, previousAssess=A.assess, previousDecorate=A.decorate;
const norm=v=>A.norm(v).replace(/[^a-z0-9 ]/g,' ').trim().replace(/\s+/g,' ');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const split=v=>String(v).trim().replace(/[.!?]+$/,'').split(/\s*[,;\n&]+\s*|\s+(?:och|samt)\s+/i).map(norm).filter(Boolean);
// Explicit spelling variants only: never fuzzy-correct meaning, negation,
// dates or similar proper names. Keep the pupil's original text in the save.
const typos=new Map(Object.entries({
 riksdagen:['rikstagen','riksdagn','riksdgaen','rikdagen','risdagen'],
 riksrådet:['riksrådett','riksrådte','rikrådet'],
 kungen:['kungenn','kugnen'],drottningen:['drotningen','drottnigen'],
 enväldet:['enväldett','enväldeet','envädet'],envälde:['envelde','envallde'],
 bestämma:['bestäma','bestämmma','bästämma'],bestämde:['bestämmde','bestämdde'],
 makt:['mackt','makkt'],inflytande:['inflytade','inflytandde','innflytande'],
 minskade:['minskadde','minskde'],ökade:['ökadde'],
 begränsad:['begrensad','begrännsad'],begränsades:['begrensades','begrännsades'],
 handlade:['hanlade','hanndlade'],seglade:['segladde'],
 porslin:['porselin','poslin','porslinn','porsilin'],siden:['sidenn','sidden'],
 bönderna:['böndrena','bönderrna'],bönder:['bönnder'],
 förlorade:['förloradde','fölorade'],straffarbete:['strafarbete','straffarbetee','straffabete','straffarbet'],
 adeln:['addeln','adlen'],hustru:['husstru'],föräldrar:['föräldar','förädrar'],
 föräldralösa:['föreldralösa','föräldralössa'],fattiga:['fattia','fattiiga'],arbeta:['arbetta','arbta'],
 barnhus:['barnhuss'],vägrade:['vägrde','vägrrade'],skjuta:['skjutta'],upproret:['uproret','upprroret'],
 marscherade:['marcherade','marscheraade'],ryssland:['rysland','rysslnad'],england:['engalnd','englannd'],
 prästen:['prässten','presten'],katekesen:['kattekesen','katekessen','katekesenn'],
 tryckfrihet:['tryckfrihett','tryckfrighet','tryckfrhet'],
 offentlighetsprincipen:['offentlighetsprinsipen','offentlighetsprincippen','offenlighetsprincipen'],
 temperatur:['tempratur','temperratur'],termometer:['termommeter','termometter'],
 celsius:['celcius'],scheele:['schele','sceele'],potatis:['pottatis','potattis'],brännvin:['bränvin','brännvinn']
}).flatMap(([word,variants])=>variants.map(variant=>[norm(variant),word])));
function spelling(value){return String(value??'').replace(/[a-zåäö]+/gi,word=>typos.get(norm(word))||word);}
function language(value){
 // Reorder two affirmative Swedish object-first constructions. Every word,
 // actor, negation and number is retained; this is never a bag-of-words match.
 return spelling(value).split(/([.!?;\n]+)/).map(clause=>clause
  .replace(/\b(mer|mindre|större|begränsad) (makt|inflytande) (fick|hade|har) (riksdagen|riksrådet|kungen|drottningen|regenten|adeln|bönderna)\b/gi,(_,amount,power,verb,actor)=>actor+' '+verb+' '+amount+' '+power)
  .replace(/^(\s*)(växter(?:na)?(?: och djur(?:en)?)?|djur(?:en)?(?: och växter(?:na)?)?|syre(?:t)?|(?:en )?(?:temperaturskala|termometer|skala för temperatur)) (upptäckte|fann|hittade|ordnade|delade|sorterade|klassificerade|gjorde|skapade|utvecklade) (Linné|Linne|Celsius|Scheele)\b(.*)$/i,(_,space,object,verb,actor,rest)=>space+actor+' '+verb+rest+' '+object)
 ).join('');
}
function shortCheck(f,value,original){
 value=spelling(value);
 const initial=original(f,value);
 if(initial!=='review'||!f.answers||f.options)return initial;
 let text=String(value).trim();
 // Only explicit, harmless answer frames; never search for a right word
 // anywhere inside an otherwise contradictory sentence.
 text=text.replace(/^(?:det var|det är|hon hette|han hette|de hette|svaret är|landet var|en vara var|en produkt var|exempelvis|till exempel|bland annat)\s+/i,'');
 const alias=v=>f.answers.some(a=>norm(a)==='te')?String(v).replace(/\bthe\b/gi,'te'):String(v);
 text=alias(text);
 // Country/product fields may contain a complete, affirmative sentence.
 // Match the whole frame and then validate its entire object. Never extract
 // a known word from a longer explanation, a negation or a mixed false list.
 const country=f.answers.every(a=>['kina','asien'].includes(norm(a)));
 const goods=f.answers.every(a=>['te','siden','porslin'].includes(norm(a)));
 const framed=norm(text).match(country
  ?/^(?:de|skeppen|fartygen|kompaniet|ostindiska kompaniet) (?:handlade med|seglade till|akte till) (.+)$/
  :goods?/^(?:de|skeppen|fartygen|kompaniet|ostindiska kompaniet) (?:tog med sig|forde hem|tog hem|importerade) (.+)$/:/$a/);
 if(framed)text=framed[1];
 const unframed=original(f,text);if(unframed!=='review')return unframed;
 const pieces=split(text);
 if(pieces.length<2||pieces.length>12)return 'review';
 // A list is accepted only when EVERY listed item is a recognised alternative.
 // One correct item cannot conceal an unknown or false extra item.
 if(pieces.every(p=>original(f,p)==='correct'))return 'correct';
 // Where the question requests both groups, punctuation and order may vary,
 // but a partial pair must not become sufficient.
 for(const expected of f.answers){
  const target=split(expected);
  if(target.length!==pieces.length||target.length<2)continue;
  const remaining=target.slice();let ok=true;
  for(const p of pieces){const i=remaining.findIndex(a=>original({answers:[a]},p)==='correct');if(i<0){ok=false;break;}remaining.splice(i,1);}
  if(ok)return 'correct';
 }
 return 'review';
}
const prompts={
 'rc1-law-0':'Vad innehöll grundlagen regler om, och vilka måste vara överens för att ändra den?',
 'rc1-trade-0':'Vilken del av världen handlade Ostindiska kompaniet med, och till vilket land fördes varorna?',
 'rc2-barnhus-0':'Varför behövde en del barn bo på barnhus?',
 'rc3-parties-0':'Vilket land stödde hattarna, och vilket land stödde mössorna?',
 'rc3-war-0':'Hur gick kriget mot Ryssland för Sverige, och var låg områdena som Sverige fick lämna?',
 'rc3-war-1':'Vilket land krigade Sverige mot, och var låg områdena som Sverige fick lämna efter förlusten?',
 'rc3-uprising-0':'Varifrån och vart marscherade bönderna under Stora daldansen, och vilket år var det?',
 'rc3-david-0':'Vad vägrade David Hedenquist göra mot bönderna?',
 'rc4-reading-0':'Vem ansvarade för läsundervisningen, och vilken bok användes?',
 'rc5-coup-1':'Vem tog makten i statskuppen, vilket år skedde det och vilken grupp förlorade sin politiska makt?',
 'rc5-reforms-0':'Vad hände med tortyren respektive dödsstraffet under Gustav III?',
 'rc1-power-1':'Avsluta förklaringen. Beskriv både hur regentens makt ändrades och vilka som fick mer inflytande.',
 'rc1-trade-1':'Fyll i landet och en vara i varsin ruta. Ett varunamn räcker; du får ange flera. Ingen förklaring av handeln behövs här.',
 'rc1-trade-2':'Beskriv Ostindiska kompaniets uppgift: vilken del av världen handlade det med, och nämn en vara som fördes till Sverige.',
 'rc2-power-1':'Ange båda grupperna i familjen i första rutan och gruppen på adelns jord i den andra.',
 'rc3-bribes-1':'Avsluta meningen med vad båda grupperna tog emot och varifrån det kom.',
 'rc3-bribes-2':'Vad tog både hattarna och mössorna emot från andra länder? Ett kort sakligt svar räcker.',
 'rc3-uprising-1':'Återge marschen: varifrån, vart och vilket år? Ge sedan ett motiv till protesterna och beskriv hur upproret slogs ned.',
 'rc3-uprising-2':'Återberätta Stora daldansen kort: varifrån, vart och vilket år gick bönderna, varför protesterade de och hur slogs upproret ned? Stödord räcker.',
 'rc4-researchers-2':'Vad arbetade Linné, Celsius respektive Scheele med? Koppla ett arbete till varje forskare. Stödord räcker.',
 'rc5-reforms-1':'Fyll i idériktningen, den förbjudna förhörsmetoden och hur dödsstraffet ändrades. Ange om dödsstraffet fanns kvar.',
 'rc5-reforms-2':'Vad hände med tortyren respektive dödsstraffet? Beskriv skillnaden mellan förändringarna.',
 'rc5-rights-2':'Beskriv förändringen för judar och katoliker och en förändring för ogifta kvinnor eller deras barn. Ange också att begränsningar fanns kvar.'
};
let decoratedBank=[];
A.decorate=function(bank){
 decoratedBank=bank;
 previousDecorate(bank);
 for(const t of bank){
  if(prompts[t.id])t.prompt=prompts[t.id];
  if(t.id==='rc2-power-1')t.fields[0].label='De två grupper i familjen som en man kunde aga var …';
  if(t.id==='rc3-bribes-2')t.fields=[{label:'Båda grupperna tog emot …',sample:'mutor',answers:['mutor','mutpengar','mutor från andra länder','mutor från utlandet','tog emot mutor','båda tog emot mutor från andra länder','de tog emot mutor från andra länder']}];
  if(t.id==='rc3-david-2')t.fields=[
   {label:'David vägrade att …',sample:'skjuta mot bönderna.',criterion:'Ange handlingen och vilka den gällde.'},
   {label:'Dödsstraffet ändrades till …',sample:'straffarbete',answers:['straffarbete','straffarbete på Marstrand','straffarbete i Marstrand','straffarbete på Carlstens fästning']}
  ];
  if(t.id==='rc2-power-2')t.fields[0].sample='En man kunde aga sin hustru. Adeln kunde aga bönder på sin mark.';
  if(t.id==='rc2-mother-1'){t.fields[0].sample='kvinnan kunde få böter.';t.fields[1].sample='att kvinnan kunde utsättas för offentlig skam.';}
  // Short-field feedback has ONLY the sample belonging to that field.
  t.responseScope=t.fields.every(f=>f.answers)?'facts':'mixed-or-explanation';
  t.alignmentVersion='3.2.0';
 }
};
function status(details){
 if(details.some(d=>d.status==='empty'))return 'empty';
 if(details.some(d=>d.status==='wrong'||d.status==='contradiction'))return 'contradiction';
 if(details.some(d=>d.status==='missing'))return 'needs-work';
 if(details.some(d=>d.status==='review'))return 'review';
 return 'sufficient';
}
// Multiple-choice answers can combine several facts in one option. For open
// retrieval, name each required fact and reuse only its own existing rubric.
const ref=(id,index)=>({ref:id,index});
const fact=(label,sample,answers)=>({label,sample,answers});
const openFields={
 'rc1-law-0':[ref('rc1-law-1',0),ref('rc1-law-1',1)],
 'rc1-trade-0':[fact('Del av världen','Asien',['Asien','Kina']),fact('Varornas destination','Sverige',['Sverige','till Sverige'])],
 'rc2-barnhus-0':[ref('rc2-barnhus-1',0)],
 'rc3-parties-0':[ref('rc3-parties-1',1),ref('rc3-parties-1',2)],
 'rc3-war-0':[fact('Hur gick kriget för Sverige?','Sverige förlorade',['Sverige förlorade','förlorade','förlust','Sverige förlorade kriget']),fact('Var låg områdena?','Finland',['Finland','i Finland','områden i Finland','delar av Finland'])],
 'rc3-uprising-0':[ref('rc3-uprising-1',0)],
 'rc3-david-0':[ref('rc3-david-1',0)],
 'rc4-reading-0':[fact('Ansvarig för undervisningen','Kyrkan',['Kyrkan','prästerna','prästen']),fact('Bok som användes','Katekesen',['katekesen','Luthers katekes','Luthers lilla katekes'])],
 'rc5-reforms-0':[ref('rc5-reforms-2',0)],
 'rc5-press-0':[ref('rc5-press-1',0)]
};
function canonical(id){return decoratedBank.find(t=>t.id===id);}
function openTask(t){
 // Chapter 5 has its own book-based fields and assessment rules. Preserve
 // every added fact and carry its matching rule into the open view.
 if(t.chapter===5&&t.materialVersion&&t.rank===0){
  const replacements={support:{1:0},reforms:{2:2},press:{0:0,1:1}};
  const mapping=replacements[t.topic]||{},sibling=canonical('rc5-'+t.topic+'-1');
  const fields=t.fields.map((f,i)=>{const field={...(mapping[i]!==undefined?sibling.fields[mapping[i]]:f)};delete field.options;return field;});
  return {...t,kind:'fields',fields};
 }
 const specs=t.rank===0?openFields[t.id]:null;
 const fields=specs?specs.map(f=>f.ref?{...canonical(f.ref).fields[f.index]}:{...f}):t.fields.map(f=>({...f}));
 for(const f of fields)delete f.options;
 return {...t,kind:'fields',fields,openResponse:!!specs};
}
function assessOpen(t,drafts,check){
 const details=[];
 openFields[t.id].forEach((spec,i)=>{
  if(spec.ref){
   const source=canonical(spec.ref),values=source.fields.map((f,j)=>j===spec.index?drafts[i]:f.sample);
   const result=previousAssess(source,values,check);
   const selected=result.details.filter(d=>d.field===spec.index);
   if(selected.length)details.push(...selected.map(d=>({...d,field:i})));
   else details.push({field:i,status:'review',label:t.fields[i].label});
  }else{
   const value=drafts[i],answer=A.isMeaningful(value)?check(t.fields[i],value):'empty';
   details.push({field:i,status:answer,label:t.fields[i].label});
  }
 });
 return {status:status(details),details};
}
A.assess=function(t,drafts,original){
 drafts=drafts.map(language);
 const check=(f,v)=>shortCheck(f,v,original);
 if(t.openResponse&&openFields[t.id])return assessOpen(t,drafts,check);
 if(t.id==='rc3-david-2'&&!t.fields[0].answers){
  const details=[];const value=String(drafts[0]??''),s=norm(value);
  if(!A.isMeaningful(value))details.push({field:0,status:'empty',label:'Ange vad David vägrade göra.'});
  else {
   const contradiction=/\b(?:inte|ej|aldrig)\b/.test(s)&&!/vagrade (?:att )?(?:skjuta|lyda)/.test(s);
   const met=/skjuta/.test(s)&&/bonder/.test(s);
   details.push({field:0,status:contradiction?'review':met?'met':'missing',label:'Ange skjutningen och vilka den riktades mot.'});
  }
  const v=check(t.fields[1],drafts[1]);details.push({field:1,status:v,label:'Ange vilket straff dödsstraffet ändrades till. Någon plats efterfrågas inte.'});
  return {status:status(details),details};
 }
 const result=previousAssess(t,drafts,check);
 let details=result.details;
 // The prompt explicitly permits notes: do not add a sentence-form requirement.
 if(t.id==='rc4-researchers-2'||t.id==='rc3-uprising-2')details=details.filter(d=>!d.label.startsWith('Knyt ihop uppgifterna'));
 // A family EXAMPLE does not require both wife AND children.
 if(t.id==='rc2-power-2'&&!t.fields[0].answers){
  const s=norm(drafts[0]);
  const family=/(?:aga|sla|slog|bestraff)/.test(s)&&/(?:hustru|fru|barn)/.test(s);
  const negated=/(?:inte|aldrig|ej).{0,20}(?:aga|sla|bestraff)|(?:fick|kunde) inte/.test(s);
  details=details.map(d=>d.label==='Ge ett konkret exempel på aga inom familjen.'?{...d,status:negated?'review':family?'met':'missing'}:d);
 }
 return {...result,details,status:status(details)};
};
A.modelHTML=function(t){
 let html='<div class="rc-model"><h3>Exempel på svar</h3>';
 t.fields.forEach(f=>{html+='<p><b>'+esc(f.label)+'</b><br>'+esc(f.sample)+'</p>';});
 const note=t.fields.every(f=>f.answers)
  ?'Skriv det namn eller den uppgift som frågan ber om. Du behöver inte förklara mer.'
  :'Svara på det som frågan ber om. Du får använda egna ord och behöver inte skriva allt som står i exemplet.';
 return html+'<p class="rc-note">'+note+'</p></div>';
};
function flow(source){
 const edits=[
  ["let h='<h2 class=\"rc-prompt\">Utveckla din förklaring</h2>'", "let h='<h2 class=\"rc-prompt\">Kontrollera svaren i rutorna</h2>'"],
  ['Ett möjligt elevsvar hjälper dig att jämföra innehåll och samband. Du behöver inte skriva likadant.','Jämför varje ruta med det som efterfrågas där. Ett kortsvar ska inte behöva byggas ut till en förklaring.'],
  ['Att läsa exemplet är träning. För mästardelen behöver du senare förklara själv utan att exemplet ligger framför dig.','Att läsa exemplet är träning. Ett självständigt svar ska senare ges utan exemplet. En fråga om ett namn eller en vara kräver fortfarande bara den uppgiften.']
 ];
 for(const [a,b] of edits){if(!source.includes(a))throw Error('Frågeanpassningen passar inte denna version av motorn.');source=source.replace(a,b);}
 return source;
}
let installed=false;
function install(){
 if(installed)return;installed=true;const assess=A.assess;
 A.assess=(task,drafts,check)=>assess(task,drafts.map(language),check);
}
A.version+='-scope-3.2';window.UPPDRAG_PROMPT_ALIGNMENT={flow,shortCheck,spelling,language,install,openTask,version:'3.2.0'};
window.UPPDRAG_FRAGTEST_VERSION='3.2.0';
})();
