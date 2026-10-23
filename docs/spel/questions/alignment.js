/* 3.1.0: align each response field, feedback and requirement with its prompt.
 * This patch is only loaded by the separate teacher question test.
 * Recognition remains rule-based. Unknown content is review, not mastery.
 */
(function(){
'use strict';
const A=window.UPPDRAG_RECALL_ASSESS, previousAssess=A.assess, previousDecorate=A.decorate;
const norm=v=>A.norm(v).replace(/[^a-z0-9 ]/g,' ').trim().replace(/\s+/g,' ');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const split=v=>String(v).trim().replace(/[.!?]+$/,'').split(/\s*[,;\n&]+\s*|\s+(?:och|samt)\s+/i).map(norm).filter(Boolean);
function shortCheck(f,value,original){
 const initial=original(f,value);
 if(initial!=='review'||!f.answers||f.options)return initial;
 let text=String(value).trim();
 // Only explicit, harmless answer frames; never search for a right word
 // anywhere inside an otherwise contradictory sentence.
 text=text.replace(/^(?:det var|det är|hon hette|han hette|de hette|svaret är|landet var|en vara var|en produkt var|exempelvis|till exempel|bland annat)\s+/i,'');
 const alias=v=>f.answers.some(a=>norm(a)==='te')?String(v).replace(/\bthe\b/gi,'te'):String(v);
 text=alias(text);
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
A.decorate=function(bank){
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
  t.alignmentVersion='3.1.0';
 }
};
function status(details){
 if(details.some(d=>d.status==='empty'))return 'empty';
 if(details.some(d=>d.status==='wrong'||d.status==='contradiction'))return 'contradiction';
 if(details.some(d=>d.status==='missing'))return 'needs-work';
 if(details.some(d=>d.status==='review'))return 'review';
 return 'sufficient';
}
A.assess=function(t,drafts,original){
 const check=(f,v)=>shortCheck(f,v,original);
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
 let html='<div class="rc-model"><h3>Exempel på svar till just den här uppgiften</h3>';
 t.fields.forEach(f=>{html+='<p><b>'+esc(f.label)+'</b><br>'+esc(f.sample)+'</p>';});
 const note=t.fields.every(f=>f.answers)
  ?'Här räcker de namn eller sakuppgifter som rutorna ber om. Du behöver inte lägga till orsaker eller en längre förklaring.'
  :'Exemplet är inte en mall att kopiera. Svara på det frågan och rutorna ber om. Inga ytterligare orsaker eller detaljer krävs för att de råkar finnas i ett längre exempelsvar.';
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
A.version+='-scope-3.1';window.UPPDRAG_PROMPT_ALIGNMENT={flow,shortCheck,version:'3.1.0'};
window.UPPDRAG_FRAGTEST_VERSION='3.1.0';
})();
