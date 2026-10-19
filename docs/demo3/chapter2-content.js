/* Uppdrag 1700: chapter 2 grounded in scanned SOS Historia pp. 66–69
 and pupils' workbook exercises 5–7. Do not add content beyond the scans. */
(function(){
'use strict';
const facts={
 married:{
  ab:'5a1',page:'66',
  a:'Enligt boken bestämde mannen över sin hustru.',
  hint:'Tänk på vilka rättigheter gifta kvinnor hade på 1700-talet.',
  q:['Vem bestämde över en gift kvinna enligt boken?','Hade en gift kvinna samma rätt att bestämma som sin man?','En anteckning säger att en gift kvinna alltid fick bestämma själv. Vad stämmer?'],
  variants:[
   ['Enligt boken bestämde mannen över sin hustru.','Mannen och hustrun hade alltid lika stor rätt att bestämma.','Den gifta kvinnans far bestämde alltid i stället för maken.'],
   ['Nej, enligt boken hade mannen mer rätt att bestämma.','Ja, gifta kvinnor hade samma bestämmanderätt som sina män.','Ja, gifta kvinnor hade större bestämmanderätt än män.'],
   ['Mannen hade rätt att bestämma över sin hustru enligt tidens regler.','En gift kvinna bestämde alltid själv, utan mannens inblandning.','En gift kvinna måste lyda prästen men inte sin man.']
  ]
 },
 unmarried:{
  ab:'5a2, 5b',page:'66',
  a:'En ogift kvinna förväntades lyda sin far, bror eller annan manlig släkting.',
  hint:'Tänk på vad boken säger om kvinnor som inte var gifta.',
  q:['Fick ogifta kvinnor bestämma helt fritt över sig själva?','Vem förväntades en ogift kvinna lyda?','En skrivare påstår att ogifta kvinnor alltid var fria att bestämma. Rätta felet.'],
  variants:[
   ['Nej, de förväntades lyda en manlig släkting.','Ja, de fick alltid bestämma helt själva.','Ja, men bara om en präst hade gett sitt tillstånd.'],
   ['Sin far, bror eller annan manlig släkting.','Enbart sin make, fast hon inte var gift.','Bara en lärare på barnhuset.'],
   ['Ogifta kvinnor förväntades ofta lyda en manlig släkting.','Ogifta kvinnor var helt fria och behövde aldrig lyda någon.','Ogifta kvinnor lydde enbart en man om de själva ville.']
  ]
 },
 priests:{
  ab:'5a3',page:'66',
  a:'Prästerna lärde att männens rätt att bestämma var Guds vilja.',
  hint:'Hur förklarade prästerna männens makt enligt texten?',
  q:['Vad sa prästerna om männens rätt att bestämma?','Hur motiverade prästerna mäns makt på den tiden?','En lapp säger att prästerna motsatte sig männens makt. Vad står i boken?'],
  variants:[
   ['De lärde att männens makt var Guds vilja.','De lärde att kvinnor och män alltid hade samma rätt att bestämma.','De sa att enbart riksdagen fick bestämma i familjerna.'],
   ['De menade att det var Guds vilja att män bestämde.','De sa att makten bara berodde på handeln med Kina.','De menade att barn alltid skulle bestämma över sina föräldrar.'],
   ['Prästerna beskrev männens bestämmanderätt som Guds vilja.','Prästerna sa att alla kvinnor fick bestämma utan begränsningar.','Prästerna menade att gifta kvinnor skulle styra riksdagen.']
  ]
 },
 punishment:{
  ab:'5a4',page:'66',
  a:'Enligt boken tillät tidens regler män att aga sina fruar och barn.',
  hint:'Vad innebar aga i texten?',
  q:['Vad fick män göra mot hustru och barn enligt den tidens regler?','Vad berättar boken om aga i familjen?','En skribent hävdar att bestraffning inom familjen alltid var förbjuden. Vad stämmer om 1700-talet?'],
  variants:[
   ['Reglerna tillät män att aga hustru och barn.','Alla former av aga var förbjudna redan då.','Enbart barnen fick bestraffa de vuxna.'],
   ['Män fick enligt tidens regler slå hustru och barn som straff.','Män fick inte alls använda aga under den här tiden.','Aga betydde bara att ge barnen fler läxor.'],
   ['Boken beskriver att män fick aga hustru och barn.','Boken säger att sådana bestraffningar var förbjudna överallt.','Boken säger att bara präster fick använda aga.']
  ]
 },
 noble:{
  ab:'5a5, 5b',page:'66',
  a:'Adeln fick enligt boken rätt att aga bönder på sin mark.',
  hint:'Vilken makt hade adeln över bönder som bodde på adelns jord?',
  q:['Fick en adelsman aga bönder som bodde på hans mark?','Vad säger boken om adelns makt över bönderna?','En anteckning säger att adeln inte fick aga sina bönder. Vad är fel?'],
  variants:[
   ['Ja, adeln fick rätt att aga bönder på sin mark.','Nej, det var helt förbjudet för adeln att aga bönder.','Ja, men bara när bönderna var med i riksdagen.'],
   ['Adeln fick rätt att aga bönder som bodde på deras mark.','Adeln var tvungen att fråga varje bonde om lov att aga honom.','Bönderna bestämde alltid över adelsmännen på godsen.'],
   ['Adeln fick enligt boken rätt att aga bönder på sin mark.','Det var förbjudet för adeln att använda aga mot bönder.','Boken säger att enbart riksdagen hade rätt att aga bönder.']
  ]
 },
 mother:{
  ab:'6',page:'66–67',
  a:'En ogift kvinna som blev gravid kunde få böter och utsättas för offentlig skam.',
  hint:'Tänk på vad som kunde hända med en ogift kvinna som väntade barn.',
  q:['Varför kunde det vara svårt att vänta barn utan att vara gift?','Vilka följder kunde en ogift graviditet få på 1700-talet?','En lapp säger att ogifta mödrar aldrig straffades. Vad berättar boken?'],
  variants:[
   ['Kvinnan kunde få böter och bli offentligt förnedrad.','Kvinnan fick automatiskt högre lön och mer makt.','Kvinnan fick alltid kostnadsfri hjälp utan att dömas.'],
   ['Böter och offentlig skam, till exempel skampålen.','Ett erbjudande om arbete som lärare på barnhuset.','Rätt att automatiskt rösta i riksdagen.'],
   ['Kvinnor kunde få böter och utsättas för offentlig skam.','Boken säger att ingen ogift gravid kvinna riskerade straff.','Alla ogifta kvinnor fick samma stöd och rättigheter som män.']
  ]
 },
 barnhusNeed:{
  ab:'7a',page:'68',
  a:'Barn kunde hamna på barnhus när ingen ville eller kunde ta hand om dem.',
  hint:'Vad kunde saknas i ett barns liv så att det behövde bo på barnhus?',
  q:['Varför hamnade en del barn på barnhus?','Varför behövdes barnhus i städerna?','En lapp säger att bara rika barn kom till barnhus. Vad stämmer?'],
  variants:[
   ['Ingen ville eller kunde ta hand om barnen.','Barnen var alltid rika och valde barnhus som semester.','Alla barn måste bo på barnhus tills de fyllde arton år.'],
   ['En del barn hade ingen som kunde ta hand om dem.','Barnhusen byggdes bara för barn vars föräldrar var rika.','Barnen flyttade dit för att slippa gå upp på morgonen.'],
   ['Barnhusen tog hand om barn som saknade omsorg.','Barnhusen var särskilda skolor för bara rika barn.','Alla barn hade en förälder på barnhuset som arbetade där.']
  ]
 },
 barnhusWork:{
  ab:'7b1',page:'68',
  a:'Många barn arbetade långa dagar på barnhuset, till exempel med sömnad, tvätt eller spinning.',
  hint:'Vad behövde de flesta barn göra från morgon till kväll?',
  q:['Vad gjorde många barn på barnhuset under dagarna?','Hur såg många barns arbetsdagar på barnhuset ut?','En anteckning säger att barnen bara lekte hela dagarna. Rätta felet.'],
  variants:[
   ['De arbetade långa dagar med olika sysslor.','De fick för det mesta leka och vila hela dagen.','De arbetade bara en kort stund varje månad.'],
   ['Många arbetade från morgon till kväll, sex dagar i veckan.','De var alltid lediga och bestämde själva sina tider.','Alla fick bara läsa böcker och behövde aldrig arbeta.'],
   ['Många barn arbetade långa dagar.','Barnen gjorde inget annat än att leka på barnhuset.','Arbetet var helt frivilligt och pågick bara på söndagar.']
  ]
 },
 barnhusLife:{
  ab:'7b2',page:'68–69',
  a:'Barnen kunde få dålig mat och hårda bestraffningar. Många hade ett svårt liv.',
  hint:'Tänk på maten, omsorgen och hur barnen behandlades.',
  q:['Ge ett exempel på att livet på barnhus kunde vara svårt.','Vad berättar boken om mat och behandling på barnhus?','En text säger att barn på barnhus alltid åt bra och behandlades väl. Vad stämmer?'],
  variants:[
   ['Det kunde vara dålig mat och hårda bestraffningar.','Alla barn fick mycket god mat och kunde välja att vila hela dagen.','Barnen var alltid lediga och fick aldrig några straff.'],
   ['Maten kunde vara dålig och barnen behandlades hårt.','Alla barn fick alltid bra mat och slapp arbeta.','Arbete och bestraffningar förekom inte på barnhus.'],
   ['Barn kunde få dålig mat och bli hårt behandlade.','Alla barn fick alltid bra omsorg och mycket god mat.','Barnhusen lät alla barn gå hem när de själva ville.']
  ]
 }
};
const runs=[
 {p:'cafe',r:0,f:[],who:'Maja',hello:'Du har gjort mycket gott här i staden.',bye:'Gå till Kyrkan och lyssna på Märta.'},
 {p:'church',r:0,f:['married','unmarried','priests','punishment','noble'],who:'Märta',
  hello:'Jag försöker skriva ned vad prästen sade om kvinnors och mäns rättigheter. Men orden blandar ihop sig. Kan du hjälpa mig minnas vad som gällde?',
  bye:'Tack! Siri på Barnhuset frågade varför barn hamnade där. Hon väntar nog på dig.'},
 {p:'barnhus',r:0,f:['mother','barnhusNeed','barnhusWork','barnhusLife'],who:'Siri',
  hello:'Jag tittar på de gamla anteckningarna om barnen här. Varför kom de hit? Hur hade de det? Det är svårt att hålla reda på allt.',
  bye:'Märta vid Kyrkan försökte berätta för mig vad hon mindes. Kan du gå tillbaka till henne?'},
 {p:'church',r:1,f:['unmarried','noble','married','priests','punishment'],who:'Märta',
  hello:'Jag trodde att jag hade förstått allt. Men utan pappret har jag orden på tungan igen! Ska vi pröva?',
  bye:'Där satt det bättre! Kanske Siri också kan minnas utan sina anteckningar nu.'},
 {p:'barnhus',r:1,f:['barnhusNeed','barnhusLife','mother','barnhusWork'],who:'Siri',
  hello:'Nu har jag lagt undan pappret. Men vad berättade jag egentligen nyss? Jag vill försöka minnas själv.',
  bye:'Tack! Märta har fått en annan anteckning. Hon undrar om den verkligen stämmer.'},
 {p:'church',r:2,f:['priests','married','noble','punishment','unmarried'],who:'Märta',
  hello:'Lyssna på de här påståendena! Någon har visst blandat ihop det vi lärde oss. Hjälp mig rätta dem.',
  bye:'Nu vet jag vad som stämmer. Hos Siri finns också några märkliga uppgifter att undersöka.'},
 {p:'barnhus',r:2,f:['barnhusWork','mother','barnhusLife','barnhusNeed'],who:'Siri',
  hello:'Jag har hittat en lapp som inte verkar rätt. Låt oss undersöka den innan någon tror på det som står.',
  bye:'Nu sitter minnena bättre! Tack för att du hjälpte oss att förstå hur olika människor hade det.'}
];
const chapters1={
 queen:{a:'Ulrika Eleonora.',q:['Vilken drottning efterträdde Karl XII?'],answers:['ulrika eleonora'],hint:'Hennes namn börjar med U.'},
 absolute:{a:'Ulrika Eleonora bestämde inte ensam. Riksdagen och riksrådet hade också makt.',q:['Vad menas med att drottningen inte var enväldig?'],hint:'Vem mer än drottningen hade makt?'},
 freedom:{a:'Enväldet upphörde. Riksdagen och riksrådet fick mer makt.',q:['Varför kallades tiden frihetstiden?'],hint:'Vem fick mer makt?'},
 trade:{a:'Ostindiska kompaniet handlade med Kina och förde hem varor.',q:['Vad gjorde Ostindiska kompaniet?'],hint:'Vad tog fartygen hem?'},
 law:{a:'Grundlagen reglerade hur makten skulle delas.',q:['Vad bestämde grundlagen om?'],hint:'Tänk på makten.'},
 change:{a:'Hela riksdagen måste vara överens för att ändra grundlagen.',q:['När kunde grundlagen ändras?'],hint:'Krävdes enighet?'},
 nobles:{a:'Adeln hade störst makt i riksdagen.',q:['Vilket stånd hade mest makt i riksdagen?'],answers:['adeln','adel'],hint:'Ett av de fyra stånden.'}
};
const reading={
 married:['Mannen bestämde enligt tidens regler.','Mannen hade mer rätt att bestämma.','Mannen bestämde, inte hustrun.'],
 unmarried:['En ogift kvinna förväntades lyda en manlig släkting.','Hon förväntades lyda far, bror eller annan manlig släkting.','Hon var inte alltid fri att bestämma själv.'],
 priests:['Prästerna sa att männens makt var Guds vilja.','Prästerna hänvisade till Guds vilja.','Prästerna lärde att män skulle bestämma.'],
 punishment:['Tiden tillät aga av hustru och barn.','Aga var tillåtet enligt tidens regler.','Aga inom familjen var inte förbjuden då.'],
 noble:['Adeln fick aga bönder på sin jord.','Adeln hade rätt att aga sina bönder.','Adeln fick använda aga mot bönder på sin mark.'],
 mother:['En ogift gravid kvinna kunde få böter och offentlig skam.','Böter och offentlig skam.','Ogifta kvinnor kunde straffas om de väntade barn.'],
 barnhusNeed:['Barnen saknade någon som kunde ta hand om dem.','Barnhus fanns för barn som saknade omsorg.','Barn som saknade omsorg kunde hamna på barnhus.'],
 barnhusWork:['Många barn arbetade långa dagar.','Många arbetade från morgon till kväll.','Barnen arbetade långa dagar.'],
 barnhusLife:['Barn kunde få dålig mat och behandlas hårt.','Dålig mat och hård behandling förekom.','Alla barnhusbarn hade inte god mat och trygg omsorg.']
};
const vocabulary={
 married:[['gift','en person som är gift med någon'],['bestämmanderätt','rätt att fatta beslut'],['anteckning','något som någon skrivit ned']],
 unmarried:[['ogift','inte gift'],['förväntades','andra tyckte att hon skulle'],['rätta','skriv vad som stämmer']],
 priests:[['prästerna','personer som arbetade inom kyrkan'],['motiverade','förklarade varför'],['motsatte sig','var emot']],
 punishment:[['aga','att slå någon som bestraffning'],['aga','att slå någon som bestraffning'],['förbjudet','något som inte är tillåtet']],
 noble:[['adelsman','en man som tillhörde adeln'],['adeln','ett av stånden i samhället'],['anteckning','något som någon skrivit ned']],
 mother:[['vänta barn','vara gravid'],['följder','vad något kan leda till'],['straffades','fick ett straff']],
 barnhusNeed:[['barnhus','ett hus där barn som saknade omsorg kunde bo'],['behövdes','var nödvändiga'],['stämmer','är riktigt']],
 barnhusWork:[['sysslor','arbetsuppgifter'],['arbetsdagar','tid man tillbringade på jobbet'],['rätta felet','berätta vad som stämmer']],
 barnhusLife:[['exempel','berätta om en sak'],['behandling','hur någon blev bemött'],['behandlades','hur någon blev bemött']]
};
window.UPPDRAG_CH2_CONTENT={facts,runs,chapters1,reading,vocabulary,chapName:'Fria och ofria',sources:'Grundboken s. 66–69 · Arbetsboken 5–7'};
})();