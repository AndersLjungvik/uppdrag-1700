# Aktuell utvecklingsstatus – Uppdrag 1700

Uppdaterad 18 oktober 2026. Aktuell arbetsversion är **Demo 3.15 – En levande pappersvärld**.

## Börja här

[Starta Demo 3.15](https://andersljungvik.github.io/uppdrag-1700/demo3/living-world.html?v=3.15.0). Startfilen är `docs/demo3/living-world.html`.

Utgå från denna startfil vid nästa ändring. `/demo3/` och `game.html` visar fortfarande den äldre 3.2.1-demon. Huvudversionen 0.6.0 är ett bevarat förlopp med hela uppdragssystemet; hela det systemet har inte överförts till denna demo.

## Senaste användarbeslut – perspektiv och enkla samtal

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

Ett frågetecken är tillåtet: det är personen som undrar högt. Repliken får inte ställa en kunskapsuppgift till eleven eller förutsätta ett svar. Skriv konkret, muntligt och läsbart. Undvik klassrumsformuleringar, ”jämför”, ”motivera”, långa förklaringar och ämnesval. Nio förbipasserande har tolv repliker, alla kortare än 110 tecken. Källbankens långa frågor finns enbart som underlagsmetadata.

| Person | Vägområde | Replikernas tema |
| --- | --- | --- |
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

Sparnyckeln `uppdrag1700-known-people-v1` och platsnycklarna `archive`, `cafe`, `print`, `quay` är oförändrade. En fullständig presentation registrerar bekantskapen. Återhälsningen förbrukas när personens svar visas, även om man sedan avbryter. Att stänga och öppna samtalet igen återställer inte hälsningen; ett nytt rumsbesök gör det. Ruts handlingar och dokumentövning finns kvar.

Gamla `street:<person-id>`-värden i en sparning behöver inte raderas; de används inte för att lägga presentationer eller menyer framför utomhusmötena.

## Aktiva filer

Alla nedanstående filer ligger i `docs/demo3/`.

| Fil | Roll |
| --- | --- |
| `living-world.html` | Direkt HTML-start, vägnavigation och ankomst till gående människor. |
| `living-conversation-data.js` | Tolv korta repliker, nio människor och bevarade källmetadata. |
| `living-dialogues.js` | Automatisk hälsning, en talad replik, pappersbubblans ankare och tillgängliga personknappar. |
| `world-life.js` | Gående människor, freeze/release, hundar, höns, får och kor. |
| `archive-living.js` | Ruts accepterade 3.12.1-samtal utan extra reflektionsmeny. |
| `place-living.js` | Maja, Brita och Jo med 3.12.1:s hälsningslogik. |
| `meeting-living.js` | Kartfigurer ovanifrån; bevarade rumsfigurer. |
| `paper-fibres.js` | Gemensamt pappersmaterial och fiberkanter. |
| `paper-dialogues.js` | Sammanhängande papperspratbubbla utomhus och bevarad pappersstil för rummen. |
| `interior-fibre-art.js`, `more-room-fibre-art.js` | Befintlig rumsgeometri med gemensamt material. |
| `harbour-fibre-art.js` | Befintlig hamngrafik med fiberkanter. |
| `paper-look.js`, `harbour-merchant-visits.js` | Bevarad karta, rum, dörrar, hamnbesök och båtfärder. |

Den accepterade [3.12.1](https://andersljungvik.github.io/uppdrag-1700/demo3/conversations.html?v=3.12.1), [3.11](https://andersljungvik.github.io/uppdrag-1700/demo3/known-people.html) och 3.10 (`thoughts.html`) bevaras i sina egna filer. 3.15 uppdaterar de aktiva living-filerna. Återinför inte 3.13:s frågeträd eller 3.14:s rubriksatta utomhustankar och frontfigurer.

## Underlag

Originalfrågorna återfanns i `curriculum/classroom.mjs` vid commit `f277b2a3fb9cc138f2b4d5ac30ca5765767a5eb7`. Den äldre samtalsformen finns i `docs/game.js`. Originalposter, hänvisningar och provenance bevaras i datafilen som underlag. De tolv replikerna är redaktionella bearbetningar av dessa teman enligt användarens exempel. Inget nytt AI-frågebibliotek kopplas in.

## Verifiering av 3.15

Den samlade 3.15-versionen passerade det lokala integrationstestet `living-world-check.cjs` med `errors: []` och oförändrade filhashar under testet. Det omfattar de fyra vanliga rummen, gamla sparflaggor, återhälsningar, arkivövningen, nio gående personer och alla tolv repliker. Hälsningen är kvar vid 849 ms och övergår automatiskt till personens replik vid 850 ms. Texten ligger kvar efter talintervallet. Inga utomhusrubriker, knappar, modal-attribut, inert-lås eller Tab-fällor finns. Avslut via bubblan, tangenter, en vanlig destinationsknapp och en annan person passerar, liksom gångankomst, freeze/release, träffytor och oförändrad geometri. Testet använder jsdom och riktig canvas med ersatta bakgrundsbilder.

Den faktiska kartrenderern granskades i åtta riktningar, vid två små gångfaser och i stillhet, samt med karta i 1,08× och 0,62×. Liv och spelaren vänder sig mot varandra. Kroppens centrum är stilla under stegen. Riktning, freeze/release och minskad rörelse passerade. Den lokala kartbilden använde bakgrundens fallback; den publicerade miljön med det laddade bildmaterialet kontrolleras separat i webbläsaren. Rummens porträtt och djurens ritfunktioner ändrades inte i denna version.

Den faktiska SVG-pappersbubblan rastergranskades med liten hälsning, större replik och spets på flera sidor. Den använder en sammanhängande klippt papperskontur och gemensamt fibermaterial. Slutlig publicerad URL och webbläsarbild redovisas i leveransen; användarens egen enhet ingår inte i provningen.

## Fortsätt utan att tappa beslut

Utgå från de senaste korrigeringarna högst upp. Behåll perspektivet ovanifrån och korta talade utomhusmöten. Bevara papperskänslan, rumsbekantskaperna, högst en hälsning per rumsbesök och den manuella fortsättningen i vanliga samtal. Bevara kartans mått, bildmiljöer, dörrar, navigation och båtfärder.

Den tidigare rapporten om en tanke som fastnade kom efter ett verkligt klick. Det finns inte belägg för grundorsaken; beskriv inte problemet som att användaren tryckte Enter före ett val. Återuppta inte äldre kartproblem enbart för att historiska dokument nämner dem. Se också `SCENE-COMPOSITION.md` för bildprinciper.
