# Aktuell utvecklingsstatus – Uppdrag 1700

Uppdaterad 18 oktober 2026. Aktuell arbetsversion är **Demo 3.16 – En levande pappersvärld**.

## Börja här

[Starta Demo 3.16](https://andersljungvik.github.io/uppdrag-1700/demo3/living-world.html?v=3.16.0). Startfilen är `docs/demo3/living-world.html`.

Utgå från denna startfil vid nästa ändring. `/demo3/` och `game.html` visar fortfarande den äldre 3.2.1-demon. Huvudversionen 0.6.0 är ett bevarat förlopp med hela uppdragssystemet; hela det systemet har inte överförts till denna demo.

## Senaste användarbeslut – samma personer ute och inne

**Användaren har uttryckligen accepterat känslan i 3.15:** ”nu har vi verkligen hittat rätt i feelingen”. Behåll perspektivet ovanifrån, de diskreta rörelserna, pappersbubblorna och de korta mötena. Gör ingen ny stilomläggning.

3.15 hade nio gående förbipasserande. Maja, Brita, Rut och Jo fanns då fortfarande bara i sina rums-/kajscener. **3.16 lägger till även de fyra huvudpersonerna som vandrare.** Alla tretton namngivna samtalspersoner i den nuvarande världsdemon går nu ute. Jo går på den fria stadsvägen mellan torget och kajvägens första korsning.

De fyra huvudpersonerna har samma namn, färger och kläder ute som inne. Vid första mötet ute presenterar personen sig i en enda kort replik. När den repliken visas sparas bekantskapen på samma platsnyckel som rummet redan använder. Avbrott under spelarens ”Hej!” räknas inte som en presentation. Vid återkomst används en kort vardagsreplik. Ingen ytterligare meny har lagts till.

En direkt färd från detta samtal till personens egen plats bär med sig hälsningen till just den rumsankomsten. Maja, Brita, Rut eller Jo föreslår då inte omedelbart att hälsa igen. Avbruten färd, ett annat mål eller ett senare separat besök tar inte med sig denna engångsmarkör. Personen kan fortfarande mötas och samtala på sin vanliga plats.

## Nästa förloppsdel – inbjudningar när arbetet är aktuellt

Användarens avsikt: personerna promenerar och har korta vardagliga samtal tills det är dags för deras del av berättelsen; då bjuder de in spelaren till respektive plats. Den grundidén ska styra nästa överföring av kapitelarbetet.

**Kapitelstyrda arbetsinbjudningar är ännu inte aktiva i 3.16.** Världsdemon saknar huvudversionens uppdragsmotor, frågearbete, beställningar och leveranser. En inbjudan som redan lovar ett sådant arbete skulle i dag leda till ett rum där det inte går att genomföra. Skapa inte en låtsad progression baserad på hur många personer man har hälsat på eller hur många repliker man har läst.

Den befintliga tiokapitelberättelsen finns i `docs/world/content.mjs` och motorn i `docs/world/engine.mjs`. Maja, Brita, Jo och Rut återkommer i flera kapitel och olika arbetsfaser. En senare inbjudan behöver därför följa aktuell fas och mottagare, inte en godtycklig ensam kapitelägare. `engine.current()`, `progress()`, `active()`, `level()`, `target()` och `objective()` ger underlaget. Enbart match mot `target()` räcker inte: motorn pekar även på kaffehuset efter att ett kapitels alla nivåer är klara.

Det verkliga tiokapitelstillståndet ligger i `state.paperWorld.chapter`, `paperWorld.unlocked` och `paperWorld.jobs`. Sparnyckeln är `uppdrag1700.adventure.v2` med eventuellt kontosuffix. Det äldre toppfältet `state.chapter` avser två historiska delar och får inte tolkas som tiokapitelnumret. Den separata `known-people`-sparningen betyder bara bekantskap.

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

Rummens befintliga tanke- och pratbubblor har kvar sin pappersyta. Materialet hämtas från ett rent pappersfält i befintliga `docs/world/assets/town.webp`. Pappersvärldens proportioner och miljöbilder är bevarade.

## Bekantskaper i rummen

Sparnyckeln `uppdrag1700-known-people-v1` och platsnycklarna `archive`, `cafe`, `print`, `quay` är oförändrade. En fullständig presentation registrerar bekantskapen. I det korta utomhusmötet registreras den när personens enda presentationsreplik visas. Återhälsningen förbrukas när personens svar visas, även om man sedan avbryter. Att stänga och öppna samtalet igen återställer inte hälsningen; ett nytt separat rumsbesök gör det. Om man går direkt in från ett samtal med samma person följer `greetedHost` med just den färden och förbrukas av rummets `consumeGreeting`-anrop. Ruts handlingar och dokumentövning finns kvar.

Gamla `street:<person-id>`-värden i en sparning behöver inte raderas; de används inte för att lägga presentationer eller menyer framför utomhusmötena.

## Aktiva filer

Alla nedanstående filer ligger i `docs/demo3/`.

| Fil | Roll |
| --- | --- |
| `living-world.html` | Direkt HTML-start, vägnavigation och ankomst till gående människor. |
| `living-conversation-data.js` | Tolv källanknutna repliker, fyra vardagsrepliker, tretton människor och bevarade källmetadata. |
| `living-dialogues.js` | Kort samtal, gemensam bekantskap, hälsning vid direkt rumsankomst och oförändrad pappersbubbla. |
| `world-life.js` | Gående människor, freeze/release, hundar, höns, får och kor. |
| `archive-living.js` | Ruts accepterade 3.12.1-samtal utan extra reflektionsmeny. |
| `place-living.js` | Maja, Brita och Jo med 3.12.1:s hälsningslogik. |
| `meeting-living.js` | Kartfigurer ovanifrån; bevarade rumsfigurer. |
| `paper-fibres.js` | Gemensamt pappersmaterial och fiberkanter. |
| `paper-dialogues.js` | Sammanhängande papperspratbubbla utomhus och bevarad pappersstil för rummen. |
| `interior-fibre-art.js`, `more-room-fibre-art.js` | Befintlig rumsgeometri med gemensamt material. |
| `harbour-fibre-art.js` | Befintlig hamngrafik med fiberkanter. |
| `paper-look.js`, `harbour-merchant-visits.js` | Bevarad karta, rum, dörrar, hamnbesök och båtfärder. |

Den accepterade [3.12.1](https://andersljungvik.github.io/uppdrag-1700/demo3/conversations.html?v=3.12.1), [3.11](https://andersljungvik.github.io/uppdrag-1700/demo3/known-people.html) och 3.10 (`thoughts.html`) bevaras i sina egna filer. 3.16 uppdaterar de aktiva living-filerna. Återinför inte 3.13:s frågeträd eller 3.14:s rubriksatta utomhustankar och frontfigurer.

## Underlag

Originalfrågorna återfanns i `curriculum/classroom.mjs` vid commit `f277b2a3fb9cc138f2b4d5ac30ca5765767a5eb7`. Den äldre samtalsformen finns i `docs/game.js`. Originalposter, hänvisningar och provenance bevaras i datafilen som underlag. De tolv replikerna är redaktionella bearbetningar av dessa teman enligt användarens exempel. Inget nytt AI-frågebibliotek kopplas in.

## Verifiering av 3.16

Den samlade 3.16-versionen passerade det lokala integrationstestet `living-world-check.cjs` med `errors: []` och oförändrade filhashar under körningen. Alla 13 gående personer, 16 korta vardagsrepliker och fyra första presentationer ingår. Ursprungliga vägar, träffytor, gångankomst, freeze/release och geometri passerar, liksom de fyra vanliga rumsdialogerna, gamla sparflaggor, återhälsningar och Ruts dokumentövning.

De fyra värdarnas bekantskap sparas först när deras namngivande svar visas vid 850 ms; avbrott vid 849 ms lämnar personen okänd. Både första och återkommande utesamtal kan följas av ett direkt besök hos samma person utan ny presentation eller hälsning. Ett senare självständigt besök återställer återhälsningen. Besök hos en annan person, avbruten gång och omedelbar ankomst när spelaren redan står vid dörren passerar. Jo öppnar den befintliga kajscenen utan att påbörja en båtresa. Inga kapitel- eller uppdragstillstånd skapas av dessa möten.

Det accepterade 3.15-flödet passerar också: automatiskt Hej → personens tal, kvarliggande läsreplik, inga utomhusrubriker eller extraknappar, ingen modal eller inert värld, och avslut via bubblan, tangenter eller vanlig förflyttning. Testet använder jsdom och riktig native canvas med ersatta bakgrundsbilder. Harnessen tömmer uppskjuten canvasmålning efter virtuella bildrutor för att begränsa testmiljöns minne; ingen rendering eller controller undertrycks. Den publicerade versionen kontrolleras dessutom i webbläsaren och dess exakta URL och bild redovisas i leveransen.

## Tidigare verifiering av 3.15

Den samlade 3.15-versionen passerade det lokala integrationstestet `living-world-check.cjs` med `errors: []` och oförändrade filhashar under testet. Det omfattar de fyra vanliga rummen, gamla sparflaggor, återhälsningar, arkivövningen, nio gående personer och alla tolv repliker. Hälsningen är kvar vid 849 ms och övergår automatiskt till personens replik vid 850 ms. Texten ligger kvar efter talintervallet. Inga utomhusrubriker, knappar, modal-attribut, inert-lås eller Tab-fällor finns. Avslut via bubblan, tangenter, en vanlig destinationsknapp och en annan person passerar, liksom gångankomst, freeze/release, träffytor och oförändrad geometri. Testet använder jsdom och riktig canvas med ersatta bakgrundsbilder.

Den faktiska kartrenderern granskades i åtta riktningar, vid två små gångfaser och i stillhet, samt med karta i 1,08× och 0,62×. Liv och spelaren vänder sig mot varandra. Kroppens centrum är stilla under stegen. Riktning, freeze/release och minskad rörelse passerade. Den lokala kartbilden använde bakgrundens fallback; den publicerade miljön med det laddade bildmaterialet kontrolleras separat i webbläsaren. Rummens porträtt och djurens ritfunktioner ändrades inte i denna version.

Den faktiska SVG-pappersbubblan rastergranskades med liten hälsning, större replik och spets på flera sidor. Den använder en sammanhängande klippt papperskontur och gemensamt fibermaterial. Slutlig publicerad URL och webbläsarbild redovisas i leveransen; användarens egen enhet ingår inte i provningen.

## Fortsätt utan att tappa beslut

Utgå från de senaste besluten högst upp. Den visuella känslan är nu accepterad. Behåll perspektivet ovanifrån och korta talade utomhusmöten. Bevara papperskänslan, rumsbekantskaperna, högst en hälsning per rumsbesök och den manuella fortsättningen i vanliga samtal. Bevara kartans mått, bildmiljöer, dörrar, navigation och båtfärder.

Den tidigare rapporten om en tanke som fastnade kom efter ett verkligt klick. Det finns inte belägg för grundorsaken; beskriv inte problemet som att användaren tryckte Enter före ett val. Återuppta inte äldre kartproblem enbart för att historiska dokument nämner dem. Se också `SCENE-COMPOSITION.md` för bildprinciper.
