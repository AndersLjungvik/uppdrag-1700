/* Chapter 5 retrieval from the supplied SOS book pp. 81–85, workbook 16–17,
 * teacher guide and test 2 (5, 7). Definitions are reapplied after decoration.
 * The book's limited death penalty takes precedence over the guide's shorthand. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==5)return;
const A=UPPDRAG_RECALL_ASSESS,priorDecorate=A.decorate,priorAssess=A.assess;
const version='book-5-20261102-v1';
const fact=(label,answers,rank,choices)=>({label,answers,sample:answers[0],...(rank===0?{options:choices}:{} )});
const explain=(label,sample,rule,criterion)=>({label,sample,rule,criterion});
const king=['Gustav III','Gustav 3','Gustav den tredje'];
const models={
 coup:'År 1772 använde Gustav III armén och lät fängsla medlemmarna i riksrådet. Riksdagen godkände en ny grundlag. Kungen fick mycket mer makt, medan riksdagens och riksrådets inflytande minskade.',
 support:'Gustav III blev kung 1771. Många hade tröttnat på de politiska grälen och hoppades att en starkare kung skulle skapa ordning. Därför välkomnade många maktförändringen 1772.',
 reforms:'Upplysningens författare och tänkare, bland annat i Frankrike, betonade förnuft, vetenskap, frihet och människors rättigheter. Idéerna påverkade förändringar i Sverige. Tortyr förbjöds. Dödsstraffet begränsades till ett fåtal brott, men avskaffades inte helt.',
 press:'Tryckfriheten försämrades under Gustav III, men censuren kom inte tillbaka. Man kunde fortfarande skriva och säga mycket. Tortyrförbudet var en förbättring på ett annat område; reformer betydde inte att alla blev helt fria.',
 rights:'Judar och katoliker fick flytta till Sverige och behålla sin religion. Judar fick i regel bara bo i vissa städer, hade begränsade yrkesmöjligheter och fick bara gifta sig med andra judar. Svenska protestanter fick inte lämna sin kyrka. Familjen fick inte avslöja eller kasta ut en ogift gravid kvinna. Präster fick inte kalla barn födda utanför äktenskapet ”mindre äkta” i sina papper. Lagarna gjorde inte att skam och dålig behandling automatiskt försvann.'
};
function supplement(bank){
 for(const t of bank.filter(t=>t.chapter===5&&!t.reviewOnly)){
  const r=t.rank;t.materialVersion=version;t.kind='fields';delete t.variants;
  t.source={coup:'Arbetsbok 16; Grundboken s. 81; Lärarguide Gustavianska tiden, fråga 1',support:'Arbetsbok 16c; Grundboken s. 81',reforms:'Arbetsbok 17; Grundboken s. 82; Prov del 2, 5 och 7; Bedömningsstöd del 2 s. 5',press:'Arbetsbok 17; Grundboken s. 81–82',rights:'Arbetsbok 17; Grundboken s. 83–85; Prov del 2, 5; Lärarguide fråga 4–5'}[t.topic];
  t.model=models[t.topic];t.studentModel=t.model;
  if(t.topic==='coup'){
   t.place='riksdag';t.prompt=r===0?'Koppla uppgifterna om maktbytet 1772.':r===1?'Återkalla vad som hände vid statskuppen.':'Förklara hur maktbytet gick till och vad det betydde för styret.';
   t.fields=r===0?[
    fact('Vem tog mer makt?',king,r,['Gustav III','Adolf Fredrik','Gustav IV Adolf']),
    fact('Vilket år genomfördes statskuppen?',['1772'],r,['1772','1771','1719']),
    fact('Vilka lät kungen fängsla?',['Riksrådets medlemmar'],r,['Riksrådets medlemmar','Alla forskare','Alla bönder']),
    fact('Vad använde han för att ta makten?',['Armén'],r,['Armén','Vetenskapsakademien','Kyrkans läsböcker'])
   ]:r===1?[
    fact('Kungen hette …',king,r),fact('Året var …',['1772'],r),
    explain('Hur använde han armén och vad gjorde han med riksrådet?','Han använde armén och lät fängsla riksrådets medlemmar.','coupAction','Ta med armén och gripandet av riksrådet.')
   ]:[
    explain('Vad gjorde Gustav III?','Han använde armén och lät fängsla riksrådets medlemmar.','coupAction','Ta med armén och gripandet av riksrådet.'),
    explain('Hur ändrades makten och vilken lagändring hörde ihop med det?','En ny grundlag gav kungen mer makt. Riksdagen och riksrådet fick mindre inflytande.','power','Koppla en ny grundlag till starkare kungamakt och svagare riksdag/riksråd.')
   ];
  }
  if(t.topic==='support'){
   t.place='riksdag';t.prompt=r===0?'Skilj året då Gustav III blev kung från året då han tog mer makt. Varför fick förändringen stöd?':r===1?'Återkalla ett skäl till att många stödde maktbytet.':'Varför kunde många välkomna en starkare kung, trots att riksdagens makt minskade?';
   t.fields=r===0?[
    fact('Gustav III blev kung …',['1771'],r,['1771','1772','1719']),
    fact('Många stödde förändringen eftersom …',['de var trötta på de politiska grälen.'],r,['de var trötta på de politiska grälen.','alla fick samma rösträtt.','riksdagen fick mer makt än tidigare.'])
   ]:[explain('Din förklaring','Många var trötta på grälen mellan politikerna och hoppades att en starkare kung skulle skapa ordning.','support','Koppla missnöjet med de politiska grälen till stödet för kungen.')];
  }
  if(t.topic==='reforms'){
   t.prompt=r===0?'Koppla upplysningens idéer till de nya straffreglerna.':r===1?'Återkalla idéerna och skilj ett förbud från ett straff som begränsades.':'Förklara upplysningen och visa hur idéerna märktes i Sverige. Använd egna ord.';
   t.fields=r===0?[
    fact('Vad kallades idéerna om förnuft, vetenskap, frihet och rättigheter?',['Upplysningen'],r,['Upplysningen','Enväldet','Censuren']),
    fact('I vilket land fanns författare och tänkare som påverkade Gustav III?',['Frankrike'],r,['Frankrike','Sverige','Ryssland']),
    fact('Vad hände med tortyr och dödsstraff?',['Tortyr förbjöds; dödsstraffet begränsades men fanns kvar.'],r,['Tortyr förbjöds; dödsstraffet begränsades men fanns kvar.','Både tortyr och alla straff avskaffades.','Tortyr skulle användas så mycket som möjligt.'])
   ]:r===1?[
    fact('Idériktningen kallas …',['Upplysningen'],r),fact('Landet vars tänkare nämns i boken är …',['Frankrike'],r),
    explain('Hur ändrades tortyr och dödsstraff?','Tortyr förbjöds. Dödsstraffet begränsades till färre brott men fanns kvar.','penalties','Ta med tortyrförbud och att dödsstraffet begränsades, inte försvann helt.')
   ]:[
    explain('Vad innebar upplysningen och varifrån kom idéerna som nämns i boken?','Franska författare och tänkare lyfte förnuft, vetenskap, frihet och människors rättigheter.','enlightenment','Ta med franska tänkare samt frihet/rättigheter och förnuft/vetenskap.'),
    explain('Hur påverkade idéerna Sverige? Ge exempel och förklara skillnaden mellan straffreformerna.','Idéerna påverkade Sveriges lagar: tortyr förbjöds och dödsstraffet begränsades till färre brott men fanns kvar.','reformLink','Koppla idéerna till svenska lagändringar, med både tortyrförbud och begränsat dödsstraff.')
   ];
  }
  if(t.topic==='press'){
   t.prompt=r===0?'Vad kunde fortfarande tryckas efter maktbytet?':r===1?'Beskriv vad som hände med tryckfriheten och censuren.':'Bemöt påståendet: ”Reformerna gjorde alla helt fria.” Ge en förbättring och en begränsning.';
   t.fields=r===0?[
    fact('Tryckfriheten …',['försämrades.'],r,['försämrades.','blev obegränsad.','ersatte riksdagen.']),
    fact('Kom censuren tillbaka enligt boken?',['Nej, censuren kom inte tillbaka.'],r,['Nej, censuren kom inte tillbaka.','Ja, varje text måste åter förhandsgranskas.','Ingen fick längre skriva något.'])
   ]:r===1?[
    explain('Tryckfriheten …','begränsades, så det blev svårare att publicera kritik.','press','Beskriv minskad tryckfrihet eller svårare publicering.'),
    explain('Vad hände med censuren?','Censuren kom inte tillbaka.','noCensorship','Skilj begränsad tryckfrihet från återinförd förhandsgranskning.')
   ]:[
    explain('En konkret förbättring','Tortyr förbjöds.','improvement','Ge en belagd lagförbättring eller rättighet.'),
    explain('En konkret begränsning','Tryckfriheten begränsades, så det blev svårare att publicera kritik.','limit','Ge en belagd begränsning av tryckfrihet, politiskt inflytande eller religiösa rättigheter.')
   ];
  }
  if(t.topic==='rights'){
   t.prompt=r===0?'Koppla grupperna till förändringarna.':r===1?'Återkalla vilka som fick nya möjligheter och ett konkret villkor som fanns kvar.':'Förklara vad som ändrades för religiösa grupper och ogifta kvinnor eller deras barn. Visa skillnaden mellan lag och vardag.';
   t.fields=r===0?[
    fact('Vilka två religiösa grupper fick flytta till Sverige?',['Judar och katoliker','Katoliker och judar'],r,['Judar och katoliker','Enbart lutheraner','Enbart svenska protestanter']),
    fact('Friheten att välja religion kallas …',['Religionsfrihet'],r,['Religionsfrihet','Tryckfrihet','Envälde']),
    fact('Vilka fick visst skydd mot att avslöjas eller kastas ut av familjen?',['Ogifta gravida kvinnor'],r,['Ogifta gravida kvinnor','Enbart adliga hustrur','Enbart gifta män'])
   ]:r===1?[
    fact('De två religiösa grupperna var …',['Judar och katoliker','Katoliker och judar'],r),
    explain('Ge en konkret begränsning för judar eller svenska protestanter.','Judar fick bara bo i vissa städer.','religiousLimit','Ange ett villkor om bostad, yrke, äktenskap eller svenska protestanters kyrkotillhörighet.'),
    explain('Vad fick präster inte längre kalla barn födda utanför äktenskapet i sina papper?','De fick inte kalla barnen mindre äkta. Barn skulle behandlas lika i pappren.','children','Förklara den ändrade benämningen eller lika behandling i kyrkans papper.')
   ]:[
    explain('Förändring och begränsning för religiösa grupper','Judar och katoliker fick flytta till Sverige och behålla sin tro. Judar fick bara bo i vissa städer.','religiousChange','Ta med judar/katolikers invandring och minst en konkret begränsning.'),
    explain('En konkret förändring för ogifta gravida kvinnor eller deras barn','Familjen fick inte avslöja eller kasta ut en ogift gravid kvinna.','women','Ge ett konkret lagligt skydd för kvinnan eller en ändring i prästernas anteckningar.'),
    explain('Försvann svårigheterna när lagen ändrades? Förklara.','Nej. Kvinnor kunde fortfarande behandlas illa och möta skam trots de nya reglerna.','practice','Skilj de nya reglerna från att skam och dålig behandling kunde finnas kvar.')
   ];
  }
  t.hint={coup:'Tänk på armén, riksrådet och den nya grundlagen.',support:'Tänk på grälen mellan de politiska grupperna.',reforms:'Skilj tortyrförbudet från dödsstraff som fanns kvar för få brott.',press:'En begränsad tryckfrihet betyder inte att all förhandsgranskning kom tillbaka.',rights:'Skilj nya möjligheter från regler om bostad, arbete, äktenskap och kyrka.'}[t.topic];
 }
}
supplement(UPPDRAG_RECALL_BANK);
A.decorate=function(bank){priorDecorate(bank);supplement(bank);};
const norm=s=>A.norm(s).replace(/[–—-]/g,' ').replace(/\s+/g,' ').trim();
const tests={
 coupAction:s=>/arme|soldat|militar/.test(s)&&/riksrad/.test(s)&&/fangsl|grip|arrester|bur[a-z]* in|las[a-z]* in/.test(s),
 power:s=>/grundlag/.test(s)&&/kung/.test(s)&&/(?:mer|okad|storre|starkare).{0,25}(?:makt|inflytande)|bestamma.{0,12}(?:mer|sjalv)|nastan envald/.test(s)&&/(?:riksdag|riksrad)/.test(s)&&/(?:mindre|minska|svagare|forlor|maktlos)/.test(s),
 support:s=>/gral|brak|strid|konflikt|kiv|tjafs/.test(s)&&/polit|parti|hatt|moss|riksdag/.test(s)&&/trott|missnoj|less|ordning|hopp|lugn|slut/.test(s),
 penalties:s=>tortureBan(s)&&deathLimit(s),
 enlightenment:s=>/frankrike|fransk/.test(s)&&/frihet|rattighet/.test(s)&&/fornuft|vetenskap|forsk|tanka sjalv/.test(s),
 reformLink:s=>tests.penalties(s)&&/ide|tanke|upplys/.test(s)&&/paverk|andrad|forandr|ledde|gjorde|darfor|inspir|lag|reform/.test(s),
 press:s=>/begrans|forsamr|minska|mindre|svarare|inskrank|inte lika fri/.test(s)&&!/(?:inte|aldrig).{0,8}(?:begrans|forsamr|minska|inskrank)|inte mindre/.test(s),
 noCensorship:s=>/censur/.test(s)&&/kom inte tillbaka|aterkom inte|aterinf[oö]rdes inte|inte aterinf|ingen|inte tillbaka|forblev borta/.test(s)||/ingen forhandsgranskning|inte.{0,18}forhandsgransk/.test(s),
 improvement:s=>tortureBan(s)||deathLimit(s)||religiousReform(s)||womenProtection(s)||tests.children(s),
 limit:s=>tests.press(s)&&/tryck|public|kritik|skriv/.test(s)||religiousLimit(s)||/kung/.test(s)&&/mer makt|okad makt|starkare|envald/.test(s)||/(?:riksdag|riksrad).{0,30}(?:mindre|minska|forlor)/.test(s),
 religiousLimit,
 children:s=>/(?:inte|sluta|forbj[oö]d|undvika).{0,45}(?:mindre akta|oakta|nedsatt|nedvard)|(?:lika|samma).{0,35}(?:papper|anteck|kyrkbok)|(?:papper|anteck|kyrkbok).{0,35}(?:lika|samma)/.test(s),
 religiousChange:s=>religiousReform(s)&&religiousLimit(s),
 women:s=>womenProtection(s)||tests.children(s),
 practice:s=>/fortfarande|kvar|trots|and[aå]|inte automatiskt|inte.*forsvann/.test(s)&&/skam|illa|fordom|utsatt|sv[aå]rig|dalig.*behand/.test(s)
};
function tortureBan(s){return /tortyr/.test(s)&&/forbj|forbud|inte.{0,22}(?:anvand|tillat)|slutade|skaffade bort/.test(s)&&!/(?:inte|aldrig).{0,8}(?:forbj|forbud)/.test(s);}
function deathLimit(s){return /dodsstraff/.test(s)&&/begrans|farre|fa (?:brott|fall)|nagra (?:brott|fall)|minska/.test(s)&&!deathFalse(s);}
function deathFalse(s){return /dodsstraff.{0,24}(?:avskaffades helt|forsvann helt|avskaffades for alla|forbjods helt)|alla dodsstraff.{0,20}(?:avskaff|forsvann|forbj)|dodsstraffet avskaffades[.!]?$/.test(s)&&!/inte.{0,10}(?:avskaff|forsvann|forbj)/.test(s);}
function religiousReform(s){return /jud/.test(s)&&/katolik/.test(s)&&/flytta|invandr|bosatta|bo i|komma hit|komma till sverige|behalla.{0,15}(?:tro|religion)/.test(s)&&!/(?:inte|aldrig).{0,15}(?:flytta|invandr|bosatta|komma)/.test(s);}
function religiousLimit(s){return /jud/.test(s)&&(/(?:bara|endast|vissa|inte alla|nagra|begrans).{0,25}(?:stad|stader|yrke|arbet|gifta)|(?:yrke|arbet).{0,25}(?:begrans|vissa|inte alla)|gifta.{0,25}(?:andra jud|inom|jud)|bo.{0,25}(?:Stockholm|Goteborg|Norrkoping)/i.test(s))||/protestant|svensk/.test(s)&&/inte|forbj|maste/.test(s)&&/lamna.{0,20}kyrk|byta.{0,20}relig|stanna.{0,20}kyrk/.test(s);}
function womenProtection(s){return /inte|forbj|skydd/.test(s)&&/avsloj|kasta ut|vraka|hemlig|anonym/.test(s)&&/kvinna|kvinnor|gravid|familj|ogift/.test(s);}
function falseClaim(rule,s){
 if(['penalties','reformLink','improvement'].includes(rule)&&deathFalse(s))return true;
 if(['penalties','reformLink'].includes(rule)&&/tortyr.{0,20}(?:forbjods inte|var tillaten|skulle anvandas)|tortyr.{0,12}inte.{0,12}forbj/.test(s))return true;
 if(['coupAction','power'].includes(rule)&&/kung.{0,15}(?:mindre|minskad|forlorad).{0,15}makt|riksrad.{0,20}(?:slapptes fri|mer makt)/.test(s))return true;
 if(rule==='coupAction'&&/(?:inte|aldrig).{0,12}(?:fangsl|grip|arrest)|(?:fangsl[a-z]*|grip[a-z]*|greps?|arrest[a-z]*) inte/.test(s))return true;
 if(rule==='support'&&/inte.{0,8}(?:trott|missnoj|less)/.test(s))return true;
 if(['press','limit'].includes(rule)&&/(?:tryckfrihet|publicer|kritik).{0,25}(?:obegrans|friare|oforandrad)|tryckfrihet.{0,20}(?:begransades inte|minskade inte)/.test(s))return true;
 if(rule==='noCensorship'&&/censur.{0,15}(?:kom tillbaka|aterinf[oö]rdes)|all.{0,15}text.{0,15}(?:forhandsgransk|godkannas)/.test(s)&&!/inte/.test(s))return true;
 if(['religiousLimit','religiousChange','practice'].includes(rule)&&/alla.{0,22}(?:helt fria|samma rattigheter)|alla svarigheter forsvann/.test(s)&&!/inte|nej/.test(s))return true;
 return false;
}
function summary(d){return d.some(x=>x.status==='empty')?'empty':d.some(x=>['wrong','contradiction'].includes(x.status))?'contradiction':d.some(x=>x.status==='review')?'review':'sufficient';}
A.assess=function(t,drafts,check){
 if(t.chapter!==5||t.reviewOnly)return priorAssess(t,drafts,check);
 const details=t.fields.map((f,i)=>{
  const value=drafts[i]||'',s=norm(value);let status;
  if(!A.isMeaningful(value))status='empty';
  else if(f.answers){const result=check(f,value);status=['correct','right'].includes(result)?'met':result==='wrong'?'wrong':'review';}
  else status=falseClaim(f.rule,s)?'contradiction':tests[f.rule](s)?'met':'review';
  return {field:i,status,label:f.criterion||f.label};
 });
 return {status:summary(details),details};
};
window.UPPDRAG_CH5_MATERIAL={version};
})();
