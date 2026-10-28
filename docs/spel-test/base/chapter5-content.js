/* Kapitel 5 · Gustavianska tiden. Pupil text is an original practice adventure.
 * The teacher has separately reviewed the book and workbook evidence.
 * Historical lines in the town are dramatized, never historical quotations.
 */
(function(){
'use strict';
const ROWS=[
 {
  "id": "king",
  "a": "Gustav III",
  "q": [
   "Vilken kung tog mer politisk makt under statsvälvningen 1772?",
   "Vem stärkte kungamakten och avslutade frihetstidens styrelsesätt?",
   "Ett nytt anslag saknar namnet på kungen som stärkte sin makt under 1770-talet. Vem var det?"
  ],
  "hint": "Tänk på den svenske kungen som också intresserade sig för teater och kultur.",
  "distractors": [
   "Gustav IV Adolf",
   "Adolf Fredrik"
  ],
  "page": "Grundboken 81; arbetsbok 16",
  "extra": "Kungen tog mer makt 1772.",
  "ab": "16"
 },
 {
  "id": "yearKing",
  "a": "1771",
  "q": [
   "Vilket år blev den nya regenten kung, året före statsvälvningen?",
   "Året före kungens maktövertagande tillträdde han tronen. Vilket år?",
   "Ett porträtt av den nye regenten ska dateras till året då han blev kung. Vilket år?"
  ],
  "hint": "Året ligger ett steg före maktövertagandet 1772.",
  "distractors": [
   "1772",
   "1789"
  ],
  "page": "Grundboken 81",
  "extra": "Detta år efterträdde den nye monarken sin far.",
  "ab": "16"
 },
 {
  "id": "yearCoup",
  "a": "1772",
  "q": [
   "Vilket år brukar man säga att frihetstiden tog slut?",
   "När stärktes kungens makt genom en statsvälvning som inledde en ny period?",
   "En skrivare har glömt årtalet för slutet på frihetstidens styrelsesätt. Vilket ska stå?"
  ],
  "hint": "Det hände året efter att den nye monarken hade blivit kung.",
  "distractors": [
   "1719",
   "1792"
  ],
  "page": "Grundboken 81; arbetsbok 16",
  "extra": "Det var året för maktövertagandet.",
  "ab": "16"
 },
 {
  "id": "coup",
  "a": "Statskupp",
  "q": [
   "Vad kallas ett maktövertagande där den tidigare politiska ordningen sätts åt sidan?",
   "Vilket begrepp passar när en kung med militärens stöd förändrar vem som styr?",
   "En notis beskriver ett snabbt maktövertagande utanför den gamla ordningen. Vilket ord passar?"
  ],
  "hint": "Tänk på ett snabbt byte av vem som kontrollerar staten, inte en vanlig omröstning.",
  "distractors": [
   "Riksdagsval",
   "Folkomröstning"
  ],
  "page": "Grundboken 81",
  "extra": "Kungen använde armén och ändrade maktfördelningen.",
  "ab": "16"
 },
 {
  "id": "council",
  "a": "Riksrådets medlemmar",
  "q": [
   "Vilka ledande makthavare lät den nye kungen fängsla för att kunna styra?",
   "Vilka personer i den gamla regeringens ledning greps i samband med maktbytet?",
   "Elin läser om att personer i rikets tidigare regeringsorgan låstes in. Vilka var de?"
  ],
  "hint": "De tillhörde det organ som tidigare hjälpte till att styra landet.",
  "distractors": [
   "Hela bondebefolkningen",
   "Alla lärare"
  ],
  "page": "Grundboken 81; arbetsbok 16",
  "extra": "Fängslandet var en del av maktövertagandet, inte ett vanligt brottmål.",
  "ab": "16"
 },
 {
  "id": "power",
  "a": "Kungen",
  "q": [
   "Vem fick mycket större möjlighet att bestämma efter förändringen av styrelsesättet?",
   "Vems makt ökade när riksrådets och riksdagens inflytande minskade?",
   "Elin har skrivit att riksrådet behöll all makt. Vem fick i själva verket mer inflytande?"
  ],
  "hint": "Jämför med hur begränsad regentens makt var under frihetstiden.",
  "distractors": [
   "Riksrådet",
   "Barnhuset"
  ],
  "page": "Grundboken 81–82; arbetsbok 17",
  "extra": "Statsskicket förändrades så att monarken fick starkare ställning.",
  "ab": "16"
 },
 {
  "id": "support",
  "a": "Trötthet på politiska konflikter",
  "q": [
   "Varför välkomnade många människor förändringen av hur Sverige styrdes?",
   "Vad gjorde att många till en början hoppades på en starkare ledare?",
   "Maja har hört att många var lättade när ordningen förändrades. Vilken viktig orsak låg bakom det?"
  ],
  "hint": "Minns grälen mellan politiska grupper under föregående period.",
  "distractors": [
   "Att Sverige ville starta ett nytt världskrig",
   "Att alla hade fått rösträtt"
  ],
  "page": "Grundboken 81; arbetsbok 16",
  "extra": "Människor hade tröttnat på politiska motsättningar.",
  "ab": "16"
 },
 {
  "id": "enlightenment",
  "a": "Upplysningen",
  "q": [
   "Vilken idériktning betonade förnuft, vetenskap och människors rättigheter?",
   "Vad kallas 1700-talets spridning av idéer om kunskap, förnuft och frihet?",
   "Amira läser om människor som ifrågasätter gamla föreställningar och söker kunskap. Vilken rörelse hör det till?"
  ],
  "hint": "Tänk på att kunskap och argument ska kunna prövas i ljuset.",
  "distractors": [
   "Stormaktstiden",
   "Skråväsendet"
  ],
  "page": "Grundboken 82; ord och begrepp",
  "extra": "Idéerna påverkade tänkare och reformer.",
  "ab": "17"
 },
 {
  "id": "torture",
  "a": "Tortyr",
  "q": [
   "Vilken grym metod för att tvinga fram uppgifter eller bekännelser förbjöds?",
   "Vad hette den plågsamma förhörsmetod som nu inte längre skulle användas?",
   "Amira säger att det inte längre var tillåtet att skada någon för att få ett erkännande. Vilken metod syftar hon på?"
  ],
  "hint": "Det handlar om att orsaka smärta eller lidande i ett förhör.",
  "distractors": [
   "Böter",
   "Förvisning"
  ],
  "page": "Grundboken 82; arbetsbok 17",
  "extra": "Detta var en förändring av hur rättsväsendet fick behandla människor.",
  "ab": "17"
 },
 {
  "id": "death",
  "a": "Dödsstraffet begränsades",
  "q": [
   "Hur förändrades användningen av den strängaste påföljden under den här tiden?",
   "Vad hände med lagarnas möjlighet att döma människor till döden?",
   "En notis säger att alla dödsdomar försvann. Vilken mer korrekt förändring genomfördes?"
  ],
  "hint": "Det är skillnad mellan att minska användningen av ett straff och att helt ta bort det.",
  "distractors": [
   "Alla straff upphörde",
   "Dödsdomar infördes för alla brott"
  ],
  "page": "Grundboken 82; arbetsbok 17",
  "extra": "Straffet togs bort för flera brott men upphörde inte helt.",
  "ab": "17"
 },
 {
  "id": "press",
  "a": "Tryckfriheten begränsades",
  "q": [
   "Hur förändrades möjligheten att skriva kritik mot styret under den nya kungen?",
   "Vad hände med rätten att publicera kritiska texter om makthavarna?",
   "Brita upptäcker att ett gammalt anslag inte längre beskriver vad man fritt fick trycka. Vad hade förändrats?"
  ],
  "hint": "Ett tidigare friare system blev snävare när kungamakten stärktes.",
  "distractors": [
   "Alla skrifter blev fria från regler",
   "Inga nya lagar påverkade tryckerierna"
  ],
  "page": "Grundboken 84; lärarguide",
  "extra": "Det blev svårare att öppet kritisera vissa makthavare i tryck.",
  "ab": "17"
 },
 {
  "id": "religion",
  "a": "Judar och katoliker",
  "q": [
   "Vilka två religiösa grupper fick större möjligheter att bosätta sig i Sverige?",
   "Vilka grupper nämns i bokens exempel på ökad men begränsad religiös tolerans?",
   "Ett kungligt besked gav nya möjligheter för två grupper med annan trosinriktning än statskyrkans. Vilka?"
  ],
  "hint": "Tänk på två grupper som tidigare mött stora hinder för att bosätta sig här.",
  "distractors": [
   "Enbart lutheraner",
   "Endast ortodoxa och muslimer"
  ],
  "page": "Grundboken 84–85; arbetsbok 17",
  "extra": "Rättigheterna hade fortfarande begränsningar.",
  "ab": "17"
 },
 {
  "id": "limits",
  "a": "Rättigheterna var fortfarande begränsade",
  "q": [
   "Blev människor från olika religiösa grupper helt likställda efter de nya besluten?",
   "Vad behöver man lägga till efter påståendet att fler fick bosätta sig i riket?",
   "En kunglig notis säger att nya invånare nu hade exakt samma friheter som alla andra. Hur bör den rättas?"
  ],
  "hint": "Fundera på skillnaden mellan vissa nya möjligheter och att alla har samma rättigheter.",
  "distractors": [
   "Alla fick omedelbart samma rättigheter",
   "Ingen fick längre utöva någon religion"
  ],
  "page": "Grundboken 84–85; arbetsbok 17",
  "extra": "De nya möjligheterna gällde inte utan villkor överallt.",
  "ab": "17"
 },
 {
  "id": "women",
  "a": "Ogifta mödrar",
  "q": [
   "Vilken grupp kvinnor fick visst nytt skydd mot att bli utpekade för sin graviditet?",
   "Vilka kvinnor omfattades av lagändringar kring graviditet och bemötande?",
   "En äldre text beskriver hur vissa kvinnor och barn skulle behandlas bättre. Vilken grupp kvinnor handlade det om?"
  ],
  "hint": "Tänk på kvinnor som väntade barn utan att vara gifta.",
  "distractors": [
   "Endast adelsmäns hustrur",
   "Endast änkedrottningar"
  ],
  "page": "Grundboken 83; arbetsbok 17",
  "extra": "Reformerna innebar inte jämställdhet.",
  "ab": "17"
 },
 {
  "id": "children",
  "a": "Nedvärderande benämningar skulle undvikas",
  "q": [
   "Hur skulle prästerna förändra sitt sätt att skriva om barn födda utanför äktenskapet?",
   "Vad ändrades i kyrkliga handlingar för att vissa barn skulle behandlas med större respekt?",
   "En kyrkobok använder ett kränkande ord om ett barn. Vad innebar den nya inriktningen för skrivsättet?"
  ],
  "hint": "Det gäller orden som användes i anteckningar om barn, inte att släktskapet ändrades.",
  "distractors": [
   "Barnens namn skulle strykas",
   "Barnen skulle skrivas som adliga"
  ],
  "page": "Grundboken 83; arbetsbok 17",
  "extra": "Gamla negativa beteckningar skulle inte användas på samma sätt.",
  "ab": "17"
 },
 {
  "id": "paradox",
  "a": "Reformer och ökad kungamakt samtidigt",
  "q": [
   "Hur kan samma monark både göra vissa lagar mer humana och minska den politiska friheten?",
   "Hur bör man sammanfatta både förändringarna i strafflagar och styrningen av landet?",
   "En affisch hävdar att nya reformer betydde att alla blev helt fria. Vilken invändning passar?"
  ],
  "hint": "Se både förbättringar i vardagens regler och förändringen av vem som styr.",
  "distractors": [
   "Alla fick samma makt",
   "Inga lagar ändrades alls"
  ],
  "page": "Grundboken 81–85; arbetsbok 17",
  "extra": "Vissa begränsningar mildrades medan regenten samtidigt fick mer makt.",
  "ab": "17"
 }
];
const facts={},explanations={},vocabulary={};
for(const row of ROWS){
  facts[row.id]={ab:row.ab,a:row.a,hint:row.hint,q:row.q,
   variants:row.q.map(()=>[row.a,...row.distractors]),page:row.page};
  explanations[row.id]=[row.a+'. '+row.extra];
  vocabulary[row.id]=[];
}
const runs=[
 {
  "p": "cafe",
  "r": 0,
  "f": [],
  "who": "Maja",
  "hello": "Ett nytt kungligt besked har kommit. På torget berättar man olika saker om vem som får bestämma.",
  "bye": "Gå till Elin i Riksdagshuset. Hon har det gamla anslaget och ett nytt besked att jämföra."
 },
 {
  "p": "riksdag",
  "r": 0,
  "f": [
   "king",
   "yearCoup",
   "coup",
   "council",
   "power"
  ],
  "who": "Elin",
  "hello": "Mitt äldre protokoll visar hur landet styrdes förut, men nu har ett nytt besked kommit. Vad förändrades?",
  "bye": "Amira på Slottet har hört vad folk tycker om det nya styret."
 },
 {
  "p": "palace",
  "r": 0,
  "f": [
   "yearKing",
   "support",
   "enlightenment",
   "torture",
   "death"
  ],
  "who": "Amira",
  "hello": "Kungens brev berättar både om nya idéer och om andra straff. Hjälp mig sortera vad som faktiskt ändrades.",
  "bye": "Gå till Brita i Tryckeriet. Hennes gamla anslag stämmer inte längre."
 },
 {
  "p": "print",
  "r": 0,
  "f": [
   "press",
   "paradox"
  ],
  "who": "Brita",
  "hello": "Det jag tryckte tidigare gäller inte oförändrat. Jag vill rätta bladet om friheter och begränsningar.",
  "bye": "Olof i Kyrkan har fått frågor om hur nya regler påverkade människor."
 },
 {
  "p": "church",
  "r": 0,
  "f": [
   "religion",
   "limits",
   "women",
   "children"
  ],
  "who": "Olof",
  "hello": "Jag har anteckningar om nya regler för trosutövning och behandling av kvinnor och barn.",
  "bye": "Elin vill jämföra det nya med det gamla utan att titta i protokollen."
 },
 {
  "p": "riksdag",
  "r": 1,
  "f": [
   "council",
   "yearCoup",
   "power",
   "support",
   "king"
  ],
  "who": "Elin",
  "hello": "Nu lägger vi undan texterna. Kan vi fortfarande förklara varför styret förändrades?",
  "bye": "Amira på Slottet undrar vad reformerna betydde."
 },
 {
  "p": "palace",
  "r": 1,
  "f": [
   "enlightenment",
   "torture",
   "death",
   "paradox"
  ],
  "who": "Amira",
  "hello": "Det är lätt att minnas en förbättring och glömma begränsningarna. Hjälp mig hålla båda tankarna samtidigt.",
  "bye": "Brita väntar med ett nytt tryckblad."
 },
 {
  "p": "print",
  "r": 1,
  "f": [
   "press",
   "paradox",
   "power"
  ],
  "who": "Brita",
  "hello": "Nu har jag gömt det gamla anslaget. Jag måste kunna säga vad som ändrats innan jag trycker.",
  "bye": "Gå till Olof och minns vad reglerna betydde i vardagen."
 },
 {
  "p": "church",
  "r": 1,
  "f": [
   "religion",
   "limits",
   "women",
   "children"
  ],
  "who": "Olof",
  "hello": "Kan vi återge skillnaden mellan fler möjligheter och verklig jämlikhet utan att läsa innantill?",
  "bye": "Elin vill göra en sista granskning av maktbytet."
 },
 {
  "p": "riksdag",
  "r": 2,
  "f": [
   "coup",
   "king",
   "yearCoup",
   "council",
   "power",
   "support"
  ],
  "who": "Elin",
  "hello": "Några gamla och nya dokument säger emot varandra. Vi behöver reda ut vilka påståenden som håller.",
  "bye": "Amira har också hittat felaktigheter i ett kungligt brev."
 },
 {
  "p": "palace",
  "r": 2,
  "f": [
   "enlightenment",
   "torture",
   "death",
   "paradox"
  ],
  "who": "Amira",
  "hello": "Kan en reform vara bra samtidigt som en kung blir mäktigare? Läs påståendena noga.",
  "bye": "Brita måste granska det sista anslaget om tryckfrihet."
 },
 {
  "p": "print",
  "r": 2,
  "f": [
   "press",
   "power",
   "paradox"
  ],
  "who": "Brita",
  "hello": "Jag vill inte sprida en rubrik som säger att alla genast blev helt fria. Hjälp mig rätta den.",
  "bye": "Olof behöver en sista granskning av vilka rättigheter som faktiskt förbättrades."
 },
 {
  "p": "church",
  "r": 2,
  "f": [
   "religion",
   "limits",
   "women",
   "children"
  ],
  "who": "Olof",
  "hello": "Här finns både sanna och felaktiga påståenden om människors rättigheter. Vi ska rätta dem.",
  "bye": "Nu kan ni återvända till staden. Historien går vidare, men arkivet står kvar för repetition."
 }
];
if(runs.some((r,i)=>i>0&&(!r.f.length||r.f.some(id=>!facts[id]))))
  throw new Error('Kapitel 5: något arbetsblad saknar innehåll');
window.UPPDRAG_CH5_CONTENT={facts,runs,explanations,vocabulary,
 chapterTitle:'Gustavianska tiden',
 sourceInfo:'Grundboken s. 81–85 · Arbetsboken uppgift 16–17 (enbart lärarens kontroll)',
 chapterFourKey:'uppdrag1700.ch4-real-world.20261020.v1',
 chapterThreeKey:'uppdrag1700.ch3-real-world.20261019.v1',
 chapterTwoKey:'uppdrag1700.ch2-real-world.20261019.v1',
 chapterOneKey:'uppdrag1700.ch1-real-world.20261019.v11'};
})();