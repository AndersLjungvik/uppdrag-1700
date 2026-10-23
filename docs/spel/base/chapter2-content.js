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
   ['Enligt boken bestämde mannen över sin hustru.','Den gifta kvinnans far fortsatte bestämma över henne.','Gifta kvinnor hade större rätt än ogifta att bestämma helt själva.'],
   ['Nej, enligt boken hade mannen mer rätt att bestämma.','Ja, men bara om hustrun ägde mark.','Nej, det var kvinnans far som bestämde även efter giftermålet.'],
   ['Mannen hade rätt att bestämma över sin hustru enligt tidens regler.','Mannen fick bara bestämma över barnen, inte över hustrun.','Kvinnan behövde bara lyda sin far, även som gift.']
  ]
 },
 unmarried:{
  ab:'5a2, 5b',page:'66',
  a:'En ogift kvinna förväntades lyda sin far, bror eller annan manlig släkting.',
  hint:'Tänk på vad boken säger om kvinnor som inte var gifta.',
  q:['Fick ogifta kvinnor bestämma helt fritt över sig själva?','Vem förväntades en ogift kvinna lyda?','En skrivare påstår att ogifta kvinnor alltid var fria att bestämma. Rätta felet.'],
  variants:[
   ['Nej, de förväntades lyda en manlig släkting.','Ja, en ogift kvinna hade alltid mer makt än en gift kvinna.','De behövde lyda sin man även om de aldrig hade gift sig.'],
   ['Sin far, bror eller annan manlig släkting.','Enbart en präst, aldrig sin egen familj.','Enbart sina barn, som kunde bestämma över henne.'],
   ['Ogifta kvinnor förväntades ofta lyda en manlig släkting.','En ogift kvinna fick bestämma själv så länge hennes far levde.','Ogifta kvinnor förväntades bara lyda prästerna, aldrig familjen.']
  ]
 },
 priests:{
  ab:'5a3',page:'66',
  a:'Prästerna lärde att männens rätt att bestämma var Guds vilja.',
  hint:'Hur förklarade prästerna männens makt enligt texten?',
  q:['Vad sa prästerna om männens rätt att bestämma?','Hur motiverade prästerna mäns makt på den tiden?','En lapp säger att prästerna motsatte sig männens makt. Vad står i boken?'],
  variants:[
   ['De lärde att männens makt var Guds vilja.','De lärde att det var männen som skulle lyda sina hustrur.','De sa att riksdagen ensam skulle bestämma över familjerna.'],
   ['De menade att det var Guds vilja att män bestämde.','De menade att männen fått sin makt genom riksdagens val.','De sa att det var kvinnor som hade fått makten av Gud.'],
   ['Prästerna beskrev männens bestämmanderätt som Guds vilja.','Prästerna menade att det bara var adeln som fick bestämma i familjer.','Prästerna sade att makten över familjen skulle delas helt lika.']
  ]
 },
 punishment:{
  ab:'5a4',page:'66',
  a:'Enligt boken tillät tidens regler män att aga sina fruar och barn.',
  hint:'Vad innebar aga i texten?',
  q:['Vad fick män göra mot hustru och barn enligt den tidens regler?','Vad berättar boken om aga i familjen?','En skribent hävdar att bestraffning inom familjen alltid var förbjuden. Vad stämmer om 1700-talet?'],
  variants:[
   ['Reglerna tillät män att aga hustru och barn.','Män fick aga sina barn men inte sina hustrur.','Bara adelsmän hade rätt att använda aga hemma.'],
   ['Män fick enligt tidens regler slå hustru och barn som straff.','Män fick aga barnen men inte hustrun.','Aga var bara tillåtet när en präst såg på.'],
   ['Boken beskriver att män fick aga hustru och barn.','Aga var bara tillåtet mot barn, inte mot hustrur.','Endast adeln, inte andra män, fick använda aga hemma.']
  ]
 },
 noble:{
  ab:'5a5, 5b',page:'66',
  a:'Adeln fick enligt boken rätt att aga bönder på sin mark.',
  hint:'Vilken makt hade adeln över bönder som bodde på adelns jord?',
  q:['Fick en adelsman aga bönder som bodde på hans mark?','Vad säger boken om adelns makt över bönderna?','En anteckning säger att adeln inte fick aga sina bönder. Vad är fel?'],
  variants:[
   ['Ja, adeln fick rätt att aga bönder på sin mark.','Nej, adeln kunde bara ge bönderna böter.','Nej, rätten att aga gällde bara adelsmännens egna barn.'],
   ['Adeln fick rätt att aga bönder som bodde på deras mark.','Adeln hade bara rätt att ge bönder böter.','Bönderna hade rätt att aga adelsmän som ägde marken.'],
   ['Adeln fick enligt boken rätt att aga bönder på sin mark.','Adeln fick bara använda aga mot sin egen familj.','Boken säger att adeln fick ta ut böter men inte använda aga.']
  ]
 },
 mother:{
  ab:'6',page:'66–67',
  a:'En ogift kvinna som blev gravid kunde få böter och utsättas för offentlig skam.',
  hint:'Tänk på vad som kunde hända med en ogift kvinna som väntade barn.',
  q:['Varför kunde det vara svårt att vänta barn utan att vara gift?','Vilka följder kunde en ogift graviditet få på 1700-talet?','En lapp säger att ogifta mödrar aldrig straffades. Vad berättar boken?'],
  variants:[
   ['Kvinnan kunde få böter och bli offentligt förnedrad.','Kvinnan kunde få kritik men aldrig något lagligt straff.','Kvinnan kunde förlora sitt arbete, men fick aldrig böter.'],
   ['Böter och offentlig skam, till exempel skampålen.','Bara en tillsägelse från prästen, aldrig böter.','Enbart mannen som var far till barnet fick böter.'],
   ['Kvinnor kunde få böter och utsättas för offentlig skam.','Ogift graviditet kunde skapa skam men gav aldrig böter.','Det fanns inga regler mot ogift graviditet under den här tiden.']
  ]
 },
 barnhusNeed:{
  ab:'7a',page:'68',
  a:'Barn kunde hamna på barnhus när ingen ville eller kunde ta hand om dem.',
  hint:'Vad kunde saknas i ett barns liv så att det behövde bo på barnhus?',
  q:['Varför hamnade en del barn på barnhus?','Varför behövdes barnhus i städerna?','En lapp säger att bara rika barn kom till barnhus. Vad stämmer?'],
  variants:[
   ['Ingen ville eller kunde ta hand om barnen.','Bara barn som förlorat båda sina föräldrar fick komma in.','Barn flyttade dit enbart för att gå i en bättre skola.'],
   ['En del barn hade ingen som kunde ta hand om dem.','Barnhusen var bara för barn som helt saknade båda föräldrarna.','Barn kunde bara komma in om föräldrarna betalade mycket pengar.'],
   ['Barnhusen tog hand om barn som saknade omsorg.','Barnhusen var framför allt skolor för barn med fungerande hem.','Alla barn på barnhuset var föräldralösa, utan undantag.']
  ]
 },
 barnhusWork:{
  ab:'7b1',page:'68',
  a:'Många barn arbetade långa dagar på barnhuset, till exempel med sömnad, tvätt eller spinning.',
  hint:'Vad behövde de flesta barn göra från morgon till kväll?',
  q:['Vad gjorde många barn på barnhuset under dagarna?','Hur såg många barns arbetsdagar på barnhuset ut?','En anteckning säger att barnen bara lekte hela dagarna. Rätta felet.'],
  variants:[
   ['De arbetade långa dagar med olika sysslor.','De flesta barn gick i skolan hela dagen och behövde inte arbeta.','Arbete förekom bara någon timme per vecka.'],
   ['Många arbetade från morgon till kväll, sex dagar i veckan.','De gick oftast i skola hela dagen och arbetade bara någon kväll.','Barnen kunde välja om de ville arbeta eller studera.'],
   ['Många barn arbetade långa dagar.','Alla barn på barnhuset gick i skolan utan att arbeta.','Barnen fick själva bestämma vilka dagar de ville arbeta.']
  ]
 },
 barnhusLife:{
  ab:'7b2',page:'68–69',
  a:'Barnen kunde få dålig mat och hårda bestraffningar. Många hade ett svårt liv.',
  hint:'Tänk på maten, omsorgen och hur barnen behandlades.',
  q:['Ge ett exempel på att livet på barnhus kunde vara svårt.','Vad berättar boken om mat och behandling på barnhus?','En text säger att barn på barnhus alltid åt bra och behandlades väl. Vad stämmer?'],
  variants:[
   ['Det kunde vara dålig mat och hårda bestraffningar.','Barnen arbetade hårt men fick alltid god mat och trygg omsorg.','Barnen kunde få dålig mat men slapp helt bestraffningar.'],
   ['Maten kunde vara dålig och barnen behandlades hårt.','Barnen fick alltid tillräckligt med mat men bestraffades ibland.','Barnen fick arbeta men blev aldrig straffade.'],
   ['Barn kunde få dålig mat och bli hårt behandlade.','Barnen arbetade hårt men maten och hygienen var alltid god.','Barnen fick alltid bra mat men var tvungna att arbeta.']
  ]
 }
};
const runs=[
 {p:'cafe',r:0,f:[],who:'Maja',hello:'Du har gjort mycket gott här i staden.',bye:'Gå till Kyrkan och lyssna på Olof.'},
 {p:'church',r:0,f:['married','unmarried','priests','punishment','noble'],who:'Olof',
  hello:'Jag hjälper prästen med böckerna och anteckningarna. Men nu har jag tappat tråden om hur människor skulle lyda på den tiden. Kan du hjälpa mig minnas?',
  bye:'Tack! Siri på Barnhuset frågade varför barn hamnade där. Hon väntar nog på dig.'},
 {p:'barnhus',r:0,f:['mother','barnhusNeed','barnhusWork','barnhusLife'],who:'Siri',
  hello:'Jag hjälper till med linne och annat arbete här på Barnhuset. Jag läste några gamla anteckningar om barnen, men nu minns jag inte vad där stod.',
  bye:'Klockaren Olof vid Kyrkan försökte berätta vad han mindes. Kan du gå tillbaka till henne?'},
 {p:'church',r:1,f:['unmarried','noble','married','priests','punishment'],who:'Olof',
  hello:'Jag trodde att jag hade förstått allt. Men utan pappret har jag orden på tungan igen! Ska vi pröva?',
  bye:'Där satt det bättre! Kanske Siri också kan minnas utan sina anteckningar nu.'},
 {p:'barnhus',r:1,f:['barnhusNeed','barnhusLife','mother','barnhusWork'],who:'Siri',
  hello:'Jag har hängt undan tvätten och lagt undan anteckningarna. Men kan jag berätta om barnen utan att titta i pappret?',
  bye:'Tack! Klockaren Olof har fått en annan anteckning. Hon undrar om den verkligen stämmer.'},
 {p:'church',r:2,f:['priests','married','noble','punishment','unmarried'],who:'Olof',
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