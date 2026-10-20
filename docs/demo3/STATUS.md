# Aktuell utvecklingsstatus – Uppdrag 1700

## Kapitel 4 – levande, fredlig stad och kokbokshändelse, 20 oktober 2026

De tidigare ryska lägerplatserna har bytts till potatisodling (norr om Barnhuset) och botanisk äng (väster i staden). De behåller exakt samma vägnät och kollisionsregler. Linné, Celsius, Eva Ekeblad och bönderna från Dalarna har miljöanknutna samtal. Elisabet Nilsdotter berättar nära Kyrkan om gråkoltarnas konflikt med kyrkan. Samtalen är dramatiserade; Nilsdotters uppgift som soldathustru är inte bekräftad av skolans tillgängliga källor och framställs därför inte som fakta. Efterkrigstidens vanliga stadsbor återgår till vardagliga repliker.

Cajsa Warg gästar Barnhusets kök i en uttryckligt påhittad situation och talar om sin verkliga kokbok från 1755. I Tryckeriet finns en valfri bok att hämta. Karin i Bostadskvarteren tar emot den och lagar middag; när spelaren har gått ut och återvänder har rummet fått pappersdekorationer, mat och gäster. Händelsen ligger i egen lokal sparnyckel och påverkar inte kunskapsuppdrag, pengar, stämplar eller upplåsning. Bok i packningen visas medan den bärs, och bekräftad kapitelnystart återställer även den frivilliga historien.

Verifierad genom statiska syntaxtest av nya moduler och sidan, logiskt test av bokhämtning/leverans/återbesök/sparning, mockad canvastest av festscenen och mockad rendering av gatans nya personer. Visuell granskning i riktig webbläsare, elevtest och produktionspublicering har inte kunnat bekräftas i detta sammanhang.

## Kapitel 4 – fristående pilot, 20 oktober 2026

[Kapitel 4: Nya tider, nya tankar](https://andersljungvik.github.io/uppdrag-1700/demo3/chapter4-pilot.html?v=2) vidareutvecklar [kapitel 3](https://andersljungvik.github.io/uppdrag-1700/demo3/chapter3-pilot.html?v=4), utan att ändra den ordinarie Demo 3.21. Källanknutna fakta hämtas från `curriculum/classroom.mjs`, kapitel 4. 17 fakta återkommer i 47 frågor över 12 arbetsbesök (lärling/gesäll/mästare) och ett första introduktionsmöte hos Maja. Aktiva uppdragsplatser: Tryckeriet, Kyrkan, Vetenskapens hus och Byn. Repetitioner hos Rut kan blanda lärdomar från tidigare kapitel.

Pratbubblorna har fått sin synliga streckade dekorkant borttagen. Hundarna har sänkt fart, minimal gånganimation och vänder med kort paus vid hinder eller figurer. Koden i nya script och sidans inline-skript syntaxkontrollerades 20/10. Frågebankens samtliga nivåer, svarsalternativ samt programmatisk öppning av 12 arbetsbesök passerade. Inte visuellt provad i riktig webbläsare; länken kräver normal GitHub Pages-publicering.


Uppdaterad 19 oktober 2026. Aktuell arbetsversion är **Demo 3.21 – En tydlig väg genom kapitlets uppdrag**.

## Börja här

[Starta Demo 3.21](https://andersljungvik.github.io/uppdrag-1700/demo3/living-world.html?v=3.21.0). Startfilen är `docs/demo3/living-world.html`.

## Vägvisning, konkreta föremål och kapitlets innehåll – 3.21

Uppdragsboken visar nästa handling, person, plats och syfte överst. En numrerad väg följer arbetets riktiga faser: beställning, eventuella hämtningar, återkallning, material eller kartor, överlämningar och slutlig leverans. Klara, aktuella och kommande steg skiljs åt. Den samlade resan visar alla tio kapitel och de tre arbetenas stämplar. Detaljer och färdiga arbetsblad finns kvar i en öppningsbar del av boken.

Beställningslappar och föremål syns i packningen. Första kapitlet går från Majas lapp till Britas manus. Gesällsuppdraget hos Jo ger nu en porslinslåda som lämnas till Maja; detta är den enda ändrade fysiska mottagaren. Provtrycket, Majas godkännande och de färdiga anslagen visas som skilda föremål i mästararbetet. Inga nya föremålsbilder ger poäng eller stämplar. Samma fysiska leveranskontroller gäller som tidigare.

Personerna ger påminnelser även när nästa handling finns någon annanstans. En accepterad beställning följs av en konkret riktning, och ett återbesök kan besvara ”Vart ska jag nu?”. Ett nytt arbete öppnar först en beskrivning av beställningen, kapitlets kunskapstema, bokhänvisningen och resultatet. Frågorna börjar först när eleven väljer ”Jag prövar vad jag minns”.

Mellanslag och Enter fortsätter dialogen. Gemensamt tangentägarskap från nedtryckning till uppsläpp förhindrar att en hållen tangent hoppar över flera repliker eller läcker in i nästa meny. Pilar väljer bland alternativ, Escape lägger undan och B öppnar uppdragsboken. Fritext, modifierade genvägar och IME behandlas separat.

Den ritade världen har ingen stadsport. Avsnittets avslutning sker nu hos Rut i arkivet, med uttrycklig start där. Äldre pausade avslutningar fortsätter hos Rut. De interna sparvärdena för provtypen behålls för kompatibilitet; nästa avsnitt öppnas med samma bedömningsregel som tidigare.

Alla arbetens titel, beställning, introduktion och kunskapstema har jämförts med frågorna och det undervisade kapitlet. Samma arbetsplats återkommer i flera kapitel, medan frågorna följer det valda avsnittet. Två avgränsningar har rättats i första kapitlet: en rysk härskartitel saknas på s. 64–65 och utgår från bedömningen; mästarfrågans steg om kvinnors villkor från nästa kapitel ersätts av de belagda särskilda mötena utan bönderna. Den ändrade mästarfrågan får ett nytt ID. Tidigare svar får inte räknas som svar på den nya frågan. Spelets bankidentitet och sparade resa behålls.

3.20.1:s val mellan fortsatt och ny omgång finns kvar. Att öppna den nya versionslänken nollställer inte spelet. En ny omgång startas uttryckligen i uppdragsboken, efter att den pågående omgången har säkerhetskopierats.

Den slutliga kontrollen av första kapitlet passerar med samtliga 15 aktuella frågor, 224 hela tangentcykler, 18 faktiska resor, 15 boklägen, tre uttryckliga arbetsstarter och fyra omladdningar mitt i arbetet. Den omfattar pressen, godkännandena, de fysiska leveranserna och äldre sparningar hos Jo. Ruts avslutning kräver fysisk ankomst till arkivet; sparad fel-feedback och bedömningen fyra av fem bevaras.

Den portabla migreringsregressionen i `scripts/chapter-scope.test.mjs` passerar 12 fall. Resetgränssnittets fem fall och fem ytterligare migrationsfall i det faktiska gränssnittet passerar också, inklusive återställning efter nekade skrivningar, gamla originalrapporter och en uttrycklig ny start på den ändrade mästarfrågan. Originalmotorn och rättningsreglerna är hashidentiska; de 137 övriga aktiva frågeobjekten är oförändrade. Slutkörningarna har inga körfel och produktfilerna var stabila under kontrollerna.

Den här arbetsmiljön saknar den tillgängliga webbläsarstyrning som Sites kräver. Kontrollerna ovan verifierar funktion och progression; ingen ny visuell webbläsargranskning eller elevprovning ingår i denna version.

## Kapitelarbeten efter undervisningen – 3.20

Användarens senaste avgränsning: spelet används för återkallning i slutet av arbetet med varje bokkapitel. Elever kan inte medverka i utvecklingstest. Uppgifterna ska därför återkalla undervisat innehåll; de korta vardagssamtalen ska inte bli förhör eller nya öppna bedömningsuppgifter.

`chapter-jobs.mjs` namnger alla 30 befintliga nivåarbeten och gör beställningar, arbetsbeskrivningar, överlämningar och resultat sammanhängande med den aktiva frågebanken. Modulen ändrar enbart berättelsetexter och lägger till `level.job`. Frågor, facit, källor, ID, mottagare, rutter, stoppantal, material, kartmoment och progression bevaras. Alla stoppantal valideras före någon ändring. Personernas repliker talar om arbetet i världen; återkallningsinstruktionen hör hemma på arbetsarket.

`story-work.mjs` visar uppdragets namn på arbetsarket och i uppdragsboken. Ett påbörjat arbete återupptas med en specifik spelar-replik och en kort bekräftelse innan den sparade frågan öppnas. Tankevalet finns redan i rummets tankebubbla. `place-living.js` och `archive-living.js` använder därför adapterns aktuella `task.thought` även vid återbesök.

Byggsvar visar först frågan. Eleven väljer själv ”Jag har tänkt – visa delarna”; inget svarsalternativ visas automatiskt och ingen timer krävs. Delarna och redan gjorda val följer med vid paus och omladdning.

Efter sista besvarade frågan visas det färdiga arbetsbladet. De genomgångna svaren går att läsa först då. Nästa fysiska ärende visas, men sammanställningen slutför inte leveransen och ger inte en stämpel i förväg. Uppdragsboken kan öppna färdiga blad igen, även efter leverans och kapitelbyte. Gesäll och mästare behåller sin frivilliga roll; befintligt kapitelprov öppnar nästa avsnitt.

`work-evidence.mjs` räknar första försöket i just det aktuella passet. Den rättar inga frågor och ändrar inga belöningar. `chapter-state.mjs` sparar en validerad `livingWorkLedger` i samma separata living-story-sparning som tidigare. Poster lagrar fråge-ID och utfall, inga ytterligare fria elevtexter. Ett korrekt omförsök eller svar med valdelar, alternativ eller ledtråd räknas aldrig som självständigt. För gamla redan besvarade frågor utan passpost visas okänt underlag. Rapporter bevaras mellan nivåer, återbesök och omladdningar; avslutad leverans markeras separat.

API: `story.workReport(chapter, level)` och `story.lastWorkReport` returnerar kopior. `act('nextQuestion')` returnerar `workReport` när frågedelen avslutas; `act('deliver')` markerar samma blad som levererat. Alla tidigare plats- och faskontroller gäller fortfarande. Originalmotorn och frågebanken ändras inte av 3.20.

### Verifiering av 3.20

Automatisk kontroll av samtliga 30 motornivåer: 205 svar och 288 omladdningar. Sammansatt DOM-kontroll: 66 svar, 26 faktiska resor, sju arbetsrapporter och första kapitlets tre fullständiga arbets-/leveranskedjor. Paus och omladdning är provade med oskickat kortsvar, felfeedback, visade alternativ, ännu dolda sambandsdelar och delvis sammansatt svar. Levererade blad går att läsa från uppdragsboken både inne och ute på vägen. Kapitelprov, repetition, öresor och fortsatta platskontroller passerar.

Rapportkontrollen skiljer ett nytt blandat pass från äldre perfekta livstidstotaler: 12 frågor gav nio självständiga och tre med hjälp eller omförsök. Äldre påbörjade pass visar två respektive tre okända tidigare utfall i de prövade fallen. Rapporter överlever omladdning, leverans och nivåbyte, och API-kopior kan inte ändra den sparade rapporten. Gamla spel-, konto-, bank- och bekantskapssparningar lämnas byte-identiska. Inga körfel i slutkörningen; produktkällorna var stabila under testet. Detta är motor- och DOM-kontroller, inte en webbläsargranskning eller ett elevtest.

Utgå från denna startfil vid nästa ändring. `/demo3/` och `game.html` visar fortfarande den äldre 3.2.1-demon. Huvudversionen 0.6.0 finns kvar. 3.19 återanvänder dess innehåll, frågebank och uppdragsmotor i den levande världens befintliga scener.

## Formbeslut som fortfarande gäller – egen rytm och rena seriebubblor (3.18)

Användaren vill bryta den gemensamma ”myrstigen”. Varje person har därför en egen gångprofil: tempo och tempovariation, korta uppehåll under promenaden, olika vila och vändtid samt diskreta blickar. Sidolinjen varierar mjukt inom en förkontrollerad, säker korridor på den befintliga vägbanan. Rörelseprofilen är deterministisk så att freeze, möten och återgång från följe behåller exakt position och promenadfas. Figuren ritas fortfarande ovanifrån med små steg.

**Detta senaste beslut ändrar uttryckligen rumsbubblornas tidigare form.** Tankevalen ska ligga vid bildens nederkant i en pappersvit tankebubbla. Ett valt alternativ övergår i tal: valen försvinner och endast repliken visas i en rundare seriebubbla med en kort flik mot talaren. Inga synliga namn, rubriker, ”Du tänker”, ”Inte nu”, ”Avsluta”, ”Fortsätt” eller ”Klart” hör hemma i dessa bubblor. Spelaren klickar på repliken eller använder mellanslag/Enter för nästa replik; Escape eller ett tryck på miljön utanför bubblan stänger. Det gör att samtalet även går att lämna med pekskärm utan en extra knapp. Pilarna väljer bland tankarna. De faktiska dokumenten och Ruts svarsalternativ är fortfarande en separat arbetsyta med sina vanliga kontroller.

Pappret är nu vitt och läsbart, med försiktig fiberstruktur och tunn klippt kant. Det ska skilja sig tydligt från markens och rummens varmare papperstoner. Pappersfärgen används även för de korta utomhusreplikerna. Deras enkla mötesförlopp är bevarat. `paper-dialogues.js` äger gemensam rumsplacering och SVG-form; samtalsmodulerna äger repliker, val och inmatning. Namnen finns i tillgängliga etiketter, men visas inte som extra text i bubblorna.

## Tangentstyrning och gemensam promenad – tillagt i 3.17

3.17 lägger till **piltangenter för gång och mellanslag för interaktion**. Utomhusförflyttningen sker med samma hastighet som klickgång, normaliserad diagonal och stopp vid hus, vatten och världens gränser. Pilarna fungerar som val i befintliga rumssamtal, och mellanslag väljer eller fortsätter. Utomhusbubblan stängs med mellanslag innan man går. Ingen ny meny eller ny visuell form införs. Hållna tangenter nollställs vid dialog, tappat fokus och dolt fönster.

När spelaren väljer **Kajen efter ett samtal med Jo följer Jo med**. Att först stänga repliken med mellanslag förlorar inte det nyss gjorda mötet, så länge personen är nära. Maja, Brita och Rut använder samma regel för sina hemplatser. Personen följer spelarens verkliga gångspår, stannar när spelaren stannar och väntar kvar på platsen under besöket. Rummet öppnas när båda kommit fram. Ett annat uttryckligt mål eller en annan person avbryter följet; värden går tillbaka längs sitt eget färdspår utan teleportering. Om spelaren tar över en påbörjad gemensam promenad med pilarna fortsätter följet.

Kartans ritade geometri är bevarad. Två navigeringspunkter på kajvägen går nu runt arkivets nedre hörn: `quayJ2=(1100,1062)` och `quayJ3=(1390,1062)`. De ursprungliga kartnoderna är oförändrade; `navigationPoint` används av gångrutten och följarens vägmetadata. Detta ger de båda figurerna fysisk plats och undviker den äldre ruttens överlapp med huset.

## Samma personer ute och inne – tillagt i 3.16

**Användaren har uttryckligen accepterat känslan i 3.15:** ”nu har vi verkligen hittat rätt i feelingen”. Behåll perspektivet ovanifrån och de korta mötena. De senare besluten i 3.18 styr personernas gångrytm och rumsbubblornas nya vita, rundare form.

3.15 hade nio gående förbipasserande. Maja, Brita, Rut och Jo fanns då fortfarande bara i sina rums-/kajscener. **3.16 lägger till även de fyra huvudpersonerna som vandrare.** Alla tretton namngivna samtalspersoner i den nuvarande världsdemon går nu ute. Jo går på den fria stadsvägen mellan torget och kajvägens första korsning.

De fyra huvudpersonerna har samma namn, färger och kläder ute som inne. Vid första mötet ute presenterar personen sig i en enda kort replik. När den repliken visas sparas bekantskapen på samma platsnyckel som rummet redan använder. Avbrott under spelarens ”Hej!” räknas inte som en presentation. Vid återkomst används en kort vardagsreplik. Ingen ytterligare meny har lagts till.

En direkt färd från detta samtal till personens egen plats bär med sig hälsningen till just den rumsankomsten. Maja, Brita, Rut eller Jo föreslår då inte omedelbart att hälsa igen. Avbruten färd, ett annat mål eller ett senare separat besök tar inte med sig denna engångsmarkör. Personen kan fortfarande mötas och samtala på sin vanliga plats.

## Kapitelarbetet är inkopplat – 3.19

Personerna promenerar och småpratar mellan sina uppgifter. När ett faktiskt ärende väntar hos Maja, Brita, Rut eller Jo blir deras korta svar en inbjudan till platsen. Att läsa eller stänga inbjudan ändrar inte bekantskap utöver den vanliga namngivna presentationen, och ändrar aldrig kapitlets arbete. Följet till personens plats använder samma gångspår som i 3.18.

`chapter-state.mjs` återanvänder `docs/world/engine.mjs`, `content.mjs`, `learning.mjs`, `classroom-curriculum.js` och `practice.js`. Dessa originalfiler ändras inte. Aktuellt kapitel, nivå, fas och mottagare hämtas från motorn. När samtliga tre nivåer är klara ges ingen extra beställning trots att originalmotorns `target()` då pekar på kaffehuset.

`story-work.mjs` visar ärendet bland rummets tankar och tal. Quiz, kartjämförelser och tryckmaterial har ett separat arbetsark. Rättningen, de kontrollerade svarsalternativen, ledtrådskostnaden, repetitionsreglerna och källhänvisningarna kommer från originalspelet. Det befintliga kapitelprovet öppnar nästa kapitel efter minst ett avslutat lärlingsarbete; gesäll och mästare är fortfarande möjliga men krävs inte för att gå vidare. Byte till ett låst kapitel tillåts inte.

Alla handlingar går via `UPPDRAG_STORY_STATE.act`. Den kontrollerar faktisk rumsankomst och aktuell fas före beställning, hämtning, arbetsstart, material, kartjämförelse, överlämning eller leverans. Att bara välja en destination räcker inte. Repetitions- och kapitelprov kräver en uttrycklig start eller återupptagning. Escape pausar, bevarar frågans tillstånd och stänger arbetsarket; avbrytande av ett prov görs separat i uppdragsboken.

Kapitlens tillstånd ligger kvar i `state.paperWorld.chapter`, `paperWorld.unlocked` och `paperWorld.jobs`. Den nya sparnyckeln är `uppdrag1700.living-story.v1`. Vid första start får `uppdrag1700.adventure.v2` läsas och kopieras, men varken den nyckeln, kontosuffigerade sparningar eller `uppdrag1700.questions.v1` skrivs över. Det äldre toppfältet `state.chapter` avser två tidsdelar. `paperWorld.known` avser faktakort; `uppdrag1700-known-people-v1` avser bekantskap. Blanda aldrig ihop dessa.

De gamla kartkoordinaterna i `paperWorld.player` används inte till den större levande världen. Spelet återupptar det sparade ärendet; uppdragsboken visar vart spelaren ska gå för att fortsätta. Fritextutkast lagras i samma validerade `quiz.draft` som sambandsval, högst 300 tecken. Feedback, ledtråd och stödmarkeringar behålls efter omladdning.

### Platser och fysisk navigation

| Kapitelplats | Befintlig scen |
| --- | --- |
| Kaffehuset, Tryckeriet, Arkivet | Samma etablerade rum med Maja, Brita och Rut. |
| Kajen | Stadens utomhuskaj, med Jo. |
| Barnhuset, Byn, Operan | Befintligt rum med den kanoniska uppdragsvärden. |
| Trädgården / forskarbladen | Sam i Vetenskapens hus. Rumstiteln säger ”Forskarbladen i Vetenskapens hus”; ingen ny trädgårdsbild påstås finnas. |
| Marstrand, Saint Barthélemy | Respektive hamnscen, efter faktisk båtresa. |

`story-world.js` mappar platser och säkra gångrutter. Den ritade kartan är oförändrad. Utöver de tidigare kajhörnen finns säkra hamnankomster på öarna, fri entré till byn och en kort gångböj runt kaffehuset. Vägsträckor som skulle gå genom ett hus används inte för navigation. De tretton patrullerna och deras gångprofiler ändras inte. `harbour-chapters.js` är en separat kopia av besökskontrollern med dessa hookar; den äldre `harbour-merchant-visits.js` lämnas intakt för tidigare versioner.

## Fastställd form och enkla samtal – 3.15, accepterad

Användaren avvisade 3.14:s stela, frontvända kartfigurer och deras överdrivna gång. **Tillbaka till ovanifrån.** Det tidigare problemet var att personerna stod stilla och var bortvända, inte att perspektivet ovanifrån behövde ersättas. Behåll papperskänslan, diskreta rörelser, promenader längs vägarna och riktning som följer färden. Vid samtal vänder personen och spelaren sig mot varandra. Återinför inte upprätta frontporträtt på kartan.

Användaren förtydligade också: **Liv pratar med spelaren när spelaren väljer att interagera.** Det ska inte stå ”Liv funderar …”, varken som synlig rubrik eller berättande instruktion. Ingen Gå vidare-knapp, meny eller extra val behövs. En pratbubbla visar redan vem som talar. Bubblan ska kännas som utklippt papper och höra till scenen.

### Mötet

1. Spelaren klickar på en person längs vägen. Personen stannar där hon eller han är; spelaren går fram längs den befintliga vägen.
2. Spelaren säger ”Hej!” i en liten pratbubbla. Efter 850 ms tar personen över med en kort, talad replik.
3. Repliken ligger kvar tills spelaren går vidare på vägen, väljer ett nytt mål, klickar på bubblan eller personen igen, eller använder Enter, mellanslag eller Escape. Världen och dess vanliga kontroller är användbara under mötet. Personen fortsätter sedan promenera.

Utomhusmötet har ingen synlig rubrik, knapp, fokusfälla, modal eller automatisk lästimer. Om en person har två repliker visas bara en åt gången, i skilda möten. Detta korta förlopp gäller förbipasserande. Rut, Maja, Brita och Jo behåller sina accepterade samtal med tankebubbla → spelarens replik → karaktärens svar.

## Replikernas ton och underlag

3.13:s långa reflektionsfrågor och menyträd är borttagna. Avsikten är korta, spontana repliker från en människa som lever i berättelsens 1700-tal. Användarens exempel är:

> Tänk att de dödade kungen! Varför just på maskeraden?

Ett frågetecken är tillåtet: det är personen som undrar högt. Repliken får inte ställa en kunskapsuppgift till eleven eller förutsätta ett svar. Skriv konkret, muntligt och läsbart. Undvik klassrumsformuleringar, ”jämför”, ”motivera”, långa förklaringar och ämnesval. De nio tidigare förbipasserande har tolv källanknutna repliker. De fyra huvudpersonerna har dessutom var sin vardagsreplik och korta presentation. Alla dessa texter är kortare än 110 tecken. Källbankens långa frågor finns enbart som underlagsmetadata.

| Person | Vägområde | Replikernas tema |
| --- | --- | --- |
| Maja | Vägen strax väster om kaffehuset | Ett nytt blad och människors olika läsningar |
| Brita | Vägen fram mot tryckeriet | Trycksvärta och vem som läser bladen |
| Rut | Vägen från arkivet mot operakorsningen | Ett brev och ett saknat svar |
| Jo | Torget–kajvägens första korsning | Ett nyanlänt fartyg och dess nyheter |
| Klara | Torget–arkivet | Frihet, makt och vem som får bli hörd |
| Otto | Tryckeriet–torget | En kvinnas arbete och vem omgivningen lyssnar på |
| Linnea | Slottet–vetenskapens hus | Föreställningar om människor man inte känner |
| Lovisa | Vägen till slottet | Kungens teater; en ogift mor |
| Noor | Barnhuskvarteren–verkstäderna | Barns arbete; oro för straff och ett litet barn |
| Karin | Bostadskvarteren–byn | Livet i staden och skörden på landet |
| Liv | Vägen vid operan | Mordet på kungen och maskeraden |
| Amira | Torget–vägen nedanför fästningen på Marstrand | Kriget, seger och missnöje |
| Ester | Torgets östra väg i kolonin | Två brev som beskriver samma dag olika |

Exempel: Karin säger ”Undrar om de har det lättare inne i staden. Här räcker skörden knappt till.” Ester säger ”Två brev om samma dag, och de berättar helt olika saker. Vad var det egentligen som hände?” Det är skrivna spelrepliker, inte ordagranna bokcitat eller autentiska historiska vittnesmål.

## Kartfigurer, rörelse och pappersmaterial

Kartans människor och spelaren ritas ovanifrån med huvudbonad, axlar, kläder och diskreta steg. Framåtriktningen följer vägens riktning; vid ett möte vänder de sig mot varandra. Inga frontvända ansikten, stora armgester eller studs behövs. Rummens större porträtt är bevarade.

Förbipasserande följer säkra delar av befintliga vägkanter och gör korta pauser. Den valda personen stannar på sin faktiska position; klickytan och renderingen läser samma pose. Spelaren kommer fram ungefär en figurbredd från personen. Byte av mål släpper den tidigare personen. Navigation från en punkt mitt på vägen använder tillfälliga anslutningar till det befintliga vägnätet. Regionernas noder, vägar, broar och byggnader är oförändrade.

Två hundar följer befintliga vägar och speglas bara vågrätt när de vänder. Sex höns går och pickar; tre får och två kor går korta sträckor och rör huvud eller svans inom den befintliga hagen. Alla rörelser använder världens befintliga animationsloop och tar hänsyn till `prefers-reduced-motion`.

Utomhusrepliken ligger i en enda sluten SVG-form med ojämnt klippt kontur och sammanhängande pratspets. Inga separata tankecirklar eller rektangulära bakgrundskort ligger bakom. Pappersfiber, tunn ljus fiberkant och en liten skugga ger material. Texten har enkel seriftypografi utan namnrubrik. Styrenheten placerar bubblan så att den håller sig inom scenen och undviker de två figurerna.

Rummens tanke- och pratbubblor följer 3.18:s vita, rundare serietidningsform. Materialet hämtas från ett rent pappersfält i befintliga `docs/world/assets/town.webp`. Pappersvärldens proportioner och miljöbilder är bevarade.

## Bekantskaper i rummen

Sparnyckeln `uppdrag1700-known-people-v1` och platsnycklarna `archive`, `cafe`, `print`, `quay` är oförändrade. En fullständig presentation registrerar bekantskapen. I det korta utomhusmötet registreras den när personens enda presentationsreplik visas. Återhälsningen förbrukas när personens svar visas, även om man sedan avbryter. Att stänga och öppna samtalet igen återställer inte hälsningen; ett nytt separat rumsbesök gör det. Om man går direkt in från ett samtal med samma person följer `greetedHost` med just den färden och förbrukas av rummets `consumeGreeting`-anrop. Ruts handlingar och dokumentövning finns kvar.

Gamla `street:<person-id>`-värden i en sparning behöver inte raderas; de används inte för att lägga presentationer eller menyer framför utomhusmötena.

## Aktiva filer

Alla nedanstående filer ligger i `docs/demo3/`.

| Fil | Roll |
| --- | --- |
| `living-world.html` | Direkt HTML-start, vägnavigation, tangentstyrningens bildrutekoppling och säker ankomst. |
| `living-conversation-data.js` | Tolv källanknutna repliker, fyra vardagsrepliker, tretton människor och bevarade källmetadata. |
| `living-dialogues.js` | Korta samtal, gemensam bekantskap, följe till värdens plats och högst en hälsning per sammanhängande möte. |
| `world-life.js` | Promenader, följe längs verkligt gångspår, mjuk återgång, freeze/release och djur. |
| `world-keyboard.js` | Piltangenter, mellanslag, kollisioner och befintliga tangentval i rummen. |
| `archive-living.js` | Ruts samtal i rena tanke-/talbubblor och bevarad dokumentövning. |
| `place-living.js` | Maja, Brita och Jo med rena tanke-/talbubblor och en hälsning per besök. |
| `meeting-living.js` | Kartfigurer ovanifrån; bevarade rumsfigurer. |
| `paper-fibres.js` | Gemensamt pappersmaterial och fiberkanter. |
| `paper-dialogues.js` | Vit pappersyta, runda seriebubblor och gemensam rumsplacering. |
| `interior-fibre-art.js`, `more-room-fibre-art.js` | Befintlig rumsgeometri med gemensamt material. |
| `harbour-fibre-art.js` | Befintlig hamngrafik med fiberkanter. |
| `paper-look.js` | Bevarad kartbild. |
| `harbour-chapters.js` | Befintliga besök och båtfärder med fysisk platskontroll och säkra entréer. |
| `story-world.js` | Kapitelplatser, resor och säkra gångrutter. |
| `chapter-state.mjs` | Originalmotorn, separat sparning, fasstyrda inbjudningar och platsvaliderade handlingar. |
| `story-work.mjs` | Uppdragsboken, arbetsark och kapitlens tanke-/talflöde. |

Den accepterade [3.12.1](https://andersljungvik.github.io/uppdrag-1700/demo3/conversations.html?v=3.12.1), [3.11](https://andersljungvik.github.io/uppdrag-1700/demo3/known-people.html) och 3.10 (`thoughts.html`) bevaras i sina egna filer. 3.19 uppdaterar de aktiva living-filerna och lägger till kapitelkopplingen. Återinför inte 3.13:s frågeträd eller 3.14:s rubriksatta utomhustankar och frontfigurer.

## Underlag

Originalfrågorna återfanns i `curriculum/classroom.mjs` vid commit `f277b2a3fb9cc138f2b4d5ac30ca5765767a5eb7`. Den äldre samtalsformen finns i `docs/game.js`. Originalposter, hänvisningar och provenance bevaras i datafilen som underlag. De tolv replikerna är redaktionella bearbetningar av dessa teman enligt användarens exempel. Inget nytt AI-frågebibliotek kopplas in.

## Verifiering av 3.19.0

Den ursprungliga motorn går igenom alla 30 arbetsnivåer i de tio kapitlen, med 288 återladdningar över arbetsfaserna. Samtliga 139 kanoniska kort finns i den aktiva banken. De riktiga kapitelproven prövas även vid gränsen: tre självständiga rätt av fem räcker inte, fyra räcker. Nästa kapitel kan öppnas efter lärlingsnivån; gesäll och mästare behålls som möjliga arbeten. Repetitionsarbete ger exakt 2 daler och behåller tidigare stämplar.

`story-check.cjs` kör riktiga ES-moduler tillsammans med de aktiva DOM-kontrollerna, originalmotorn och spelvärldens bildloop. Det fulla första kapitlet omfattar mötet med Maja, gemensam gång utan dubbelhälsning, samtliga tre arbeten, tryckmaterial, godkännande, överlämningar och betalning. Valen försvinner när spelarrepliken börjar. Avbrutet accepttal tar inte emot beställningen. Fel plats och för tidig leverans avvisas utan ändrad progression eller betalning.

Den utökade UI-kontrollen omfattar 66 faktiskt inskickade svar och 23 fysiska resor. Fritextutkast, redan visade svarsalternativ och halvfärdig sambandskedja återkommer efter tre fulla omladdningar. Fel svar, nytt försök, ledtråd, källhänvisning och återkoppling använder de verkliga kontrollerna. Den testar dessutom återanvänd beställning, avbruten repetition, uppdragsbokens kapitelprov och uttryckligt kapitelbyte, Rut-repetition, hämtningar, båda kartmomenten samt arbete på och resor mellan Marstrand och Saint Barthélemy. En bok som öppnas under gång håller spelaren stilla och fortsätter samma färd först när boken stängs.

Den gamla lokala sparningen, kontosparningar och den sparade frågebanken jämförs byte för byte efter UI-handlingarna. Kapiteladaptern skriver enbart sin egen sparning; de vanliga bekantskapsflaggorna är separata. De körda produktfilernas SHA256 kontrolleras före och efter provet.

Den separata 3.18-regressionen passerar också med de aktiva rums-, hamn- och styrningsfilerna: fyra vanliga rumsflöden, presentationsminnen, Ruts dokumentövning, tretton gångprofiler, piltangenter och Jos följe med återgång. Den nya kapitelkopplingen täcks av story-provet ovan. Ett separat fysiskt ruttprov täcker 162 resor mellan rummens entréer och alla tio kapitelplatser, med fri kontur och oförändrad ritad kartgeometri.

Kontrollerna använder jsdom och native canvas, med ersatta bakgrundsbilder. De verifierar kontroller och rörelse, inte en mobil webbläsares faktiska CSS-layout. Pappersbubblorna och arbetsarket granskas därför dessutom i den publicerade webbläsarversionen.

## Verifiering av 3.18.0

Den samlade integrationskontrollen använder de aktiva källfilerna och kontrollerar deras SHA256 före och efter körningen. Alla fyra rumsflöden provas med rena tankeval, enbart talad text, fokus, klick, pilar och mellanslag. Presentation, högst en återhälsning, gamla sparflaggor och hela Ruts dokumentövning ingår. Samtal kan stängas med Escape eller tryck på miljön; dokumentövningen behåller sina vanliga kontroller.

Alla tretton gångprofiler har provats med fri figurkontur, varierande fart, sidoläge, pauser och blickar. Freeze/release bevarar position och animationsfas. Ett separat rörelseprov täcker 120 virtuella sekunder per region. Samma kartgeometri och djurrendering används.

Tangentstyrningens diagonalfart, hinder, vatten, bro, fokusbyte och engångsinteraktion ingår. Jo följer spelarens verkliga väg, väntar vid ankomst, blir kvar på kajen och återvänder utan hopp. När spelaren först passerar Jo kan en ännu ogången anslutning från hans sidoläge ersättas medan han står stilla. Efter den första faktiska förflyttningen är färdspåret låst och kontrolleras exakt genom svängar och retur. Den publicerade rumsformen granskas även som verklig webbläsarbild, eftersom integrationsmiljön inte återger mobil CSS-layout som en riktig webbläsare.

## Verifiering av 3.17.1

Den samlade 3.17.1-versionen passerade `living-world-check.cjs` med `errors: []` och `changedFilesSinceSnapshot: []`. Hela 3.16-kontrollen med 13 personer, 16 vardagsrepliker, fyra presentationer, gamla sparningar, återbesök och Ruts dokumentövning passerar fortfarande.

Hållna pilar ger tidsstyrd hastighet och normaliserad diagonal. Hus, vatten, världens gränser och den befintliga bron har kontrollerats. Dialog, textfält och tappat fokus nollställer gång; mellanslag interagerar en gång och bevarar native-knapparnas egen klickhändelse. Den befintliga figurrenderern får riktning och gång från den faktiska tangentförflyttningen.

Jo-provet börjar med stängd utomhusreplik och Kajen-knappen, följer hela spelarens verkliga spår och bekräftar att ingången väntar medan Jo är fryst längre bort. När han släpps följer han samtliga hörn utan hopp. Inne finns ingen utomhusdubblett eller upprepad presentation/hälsning. Efter utgång går han tillbaka till exakt tidigare promenadposition och fas och kan mötas längs den faktiska återvägen. Manuell gång bevarar ett påbörjat följe; ett annat uttryckligt mål ger mjuk retur. Två navigeringspunkter har säker marginal runt arkivet medan ursprungliga kartdata är oförändrade.

Ett separat, riktat följeprov kontrollerade att Jo väntar när spelaren först passerar honom, återstart under retur, stillhet under rumsbesök och nödvändig förflyttning utan gånggest vid minskad rörelse. Den publicerade versionens mellanslag och gemensamma färd provas också i webbläsaren; exakt URL och bild redovisas i leveransen. Hållna piltangenter provas med verkliga bildrutor i integrationstestet, eftersom webbläsarverktyget endast erbjuder enskilda tangenttryck.

Webbläsarprovet av 3.17.0 bekräftade mellanslag för att öppna och stänga utomhussamtal, Kajen-knappens native mellanslag, ankomst med Jo samt pilval och mellanslag i hans rumssamtal. Det fångade också ett äldre inledande ”Hej!” i själva resefrågan. 3.17.1 tar bort just det ordet, så frågan börjar ”Är det här jag går ombord?” efter det gemensamma mötet. Den exakta resefrågan är också verifierad i den fulla 3.17.1-integrationskontrollen. Beteendet och den visuella formen är i övrigt samma.

## Tidigare verifiering av 3.16

Den samlade 3.16-versionen passerade det lokala integrationstestet `living-world-check.cjs` med `errors: []` och oförändrade filhashar under körningen. Alla 13 gående personer, 16 korta vardagsrepliker och fyra första presentationer ingår. Ursprungliga vägar, träffytor, gångankomst, freeze/release och geometri passerar, liksom de fyra vanliga rumsdialogerna, gamla sparflaggor, återhälsningar och Ruts dokumentövning.

De fyra värdarnas bekantskap sparas först när deras namngivande svar visas vid 850 ms; avbrott vid 849 ms lämnar personen okänd. Både första och återkommande utesamtal kan följas av ett direkt besök hos samma person utan ny presentation eller hälsning. Ett senare självständigt besök återställer återhälsningen. Besök hos en annan person, avbruten gång och omedelbar ankomst när spelaren redan står vid dörren passerar. Jo öppnar den befintliga kajscenen utan att påbörja en båtresa. Inga kapitel- eller uppdragstillstånd skapas av dessa möten.

Det accepterade 3.15-flödet passerar också: automatiskt Hej → personens tal, kvarliggande läsreplik, inga utomhusrubriker eller extraknappar, ingen modal eller inert värld, och avslut via bubblan, tangenter eller vanlig förflyttning. Testet använder jsdom och riktig native canvas med ersatta bakgrundsbilder. Harnessen tömmer uppskjuten canvasmålning efter virtuella bildrutor för att begränsa testmiljöns minne; ingen rendering eller controller undertrycks. Den publicerade versionen kontrolleras dessutom i webbläsaren och dess exakta URL och bild redovisas i leveransen.

## Tidigare verifiering av 3.15

Den samlade 3.15-versionen passerade det lokala integrationstestet `living-world-check.cjs` med `errors: []` och oförändrade filhashar under testet. Det omfattar de fyra vanliga rummen, gamla sparflaggor, återhälsningar, arkivövningen, nio gående personer och alla tolv repliker. Hälsningen är kvar vid 849 ms och övergår automatiskt till personens replik vid 850 ms. Texten ligger kvar efter talintervallet. Inga utomhusrubriker, knappar, modal-attribut, inert-lås eller Tab-fällor finns. Avslut via bubblan, tangenter, en vanlig destinationsknapp och en annan person passerar, liksom gångankomst, freeze/release, träffytor och oförändrad geometri. Testet använder jsdom och riktig canvas med ersatta bakgrundsbilder.

Den faktiska kartrenderern granskades i åtta riktningar, vid två små gångfaser och i stillhet, samt med karta i 1,08× och 0,62×. Liv och spelaren vänder sig mot varandra. Kroppens centrum är stilla under stegen. Riktning, freeze/release och minskad rörelse passerade. Den lokala kartbilden använde bakgrundens fallback; den publicerade miljön med det laddade bildmaterialet kontrolleras separat i webbläsaren. Rummens porträtt och djurens ritfunktioner ändrades inte i denna version.

Den faktiska SVG-pappersbubblan rastergranskades med liten hälsning, större replik och spets på flera sidor. Den använder en sammanhängande klippt papperskontur och gemensamt fibermaterial. Slutlig publicerad URL och webbläsarbild redovisas i leveransen; användarens egen enhet ingår inte i provningen.

## Fortsätt utan att tappa beslut

Utgå från de senaste besluten högst upp. Följ särskilt 3.18:s formbeslut om gångrytm och vita seriebubblor. Behåll perspektivet ovanifrån och korta talade utomhusmöten. Bevara papperskänslan, rumsbekantskaperna, högst en hälsning per rumsbesök och den manuella fortsättningen i vanliga samtal. Bevara kartans mått, bildmiljöer, dörrar, navigation och båtfärder.

Den tidigare rapporten om en tanke som fastnade kom efter ett verkligt klick. Det finns inte belägg för grundorsaken; beskriv inte problemet som att användaren tryckte Enter före ett val. Återuppta inte äldre kartproblem enbart för att historiska dokument nämner dem. Se också `SCENE-COMPOSITION.md` för bildprinciper.
