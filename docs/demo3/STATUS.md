# Aktuell utvecklingsstatus – Uppdrag 1700

Uppdaterad 18 oktober 2026. Aktuell arbetsversion är **Demo 3.14 – En levande pappersvärld**. Den fortsätter på 3.13:s pappersmaterial och den accepterade 3.12.1-logiken för rummen, med användarens korrigeringar av tankar, kartfigurer och rörelse.

## Börja här

[Starta Demo 3.14](https://andersljungvik.github.io/uppdrag-1700/demo3/living-world.html?v=3.14.0). Startfilen är `docs/demo3/living-world.html`.

Utgå från denna startfil vid nästa ändring. `/demo3/` och `game.html` visar fortfarande den äldre 3.2.1-demon. Huvudversionen 0.6.0 är ett bevarat förlopp med hela uppdragssystemet, inte något som har påståtts helt överfört till denna demo.

## Senaste användarbeslut – ersätter 3.13:s långa reflektionsflöden

Användaren avvisade 3.13:s långa reflektionsfrågor och menyträd. De kändes som kunskapsfrågor och tog för mycket plats. Avsikten är **korta spontana funderingar från en människa som lever i 1700-talets värld**. Användarens exempel är:

> Tänk att de dödade kungen! Varför just på maskeraden?

Ett frågetecken är tillåtet: det är personen själv som undrar. Repliken får inte ställa en uppgift till eleven eller förutsätta ett svar. Skriv konkret, muntligt och läsbart. Undvik moderna klassrumsformuleringar, ”jämför”, ”motivera”, långa förklaringar och ämnesval.

### Mötet

1. Spelaren klickar på en människa längs vägen. Personen stannar där hon eller han är; spelaren går fram längs den befintliga vägen.
2. En enda kort tankebubbla visas hos personen. **Gå vidare** avslutar. Personen fortsätter promenera.

Det är två klick inklusive öppningen. Ingen presentation, hälsningsmeny, motfråga eller följdfråga ligger före eller efter tanken. Texten ligger kvar tills spelaren själv avslutar; Escape fungerar också. Om personen har två tankar visas bara en åt gången, i skilda möten.

De extra reflektionsknapparna hos Rut, Maja, Brita och Jo är borttagna. Deras vanliga accepterade samtal har kvar tankebubbla → spelarens replik → karaktärens svar. Den ordningen gäller rummens samtal, inte dessa mycket korta utomhustankar.

## Människor och tankar

Nio förbipasserande har tolv tankar knutna till tidigare källteman. Alla är kortare än 110 tecken. Källbankens långa frågor finns enbart som underlagsmetadata och visas aldrig i dessa möten.

| Person | Vägområde | Tankarnas tema |
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

Exempel: Karin tänker ”Undrar om de har det lättare inne i staden. Här räcker skörden knappt till.” Ester tänker ”Två brev om samma dag, och de berättar helt olika saker. Vad var det egentligen som hände?” Det är skrivna spelrepliker, inte ordagranna bokcitat eller autentiska historiska vittnesmål.

## Upprätta kartfigurer och rörelse

Den tidigare kartfiguren ritades uppifrån, utan ansiktsdrag, och hela kroppen roterades med färdriktningen. Det orsakade både de ansiktslösa huvudena och kroppar som såg ut att ligga på sidan.

3.14 har små upprätta pappersfigurer med synlig hud, ögon, näsa, mun, hår och hatt eller hätta. Vänster/höger använder vågrät spegling; fötterna förblir nedåt. Ben och armar rör sig under gång. Samma gäller spelarfiguren. Rummens större porträtt är bevarade.

Förbipasserande följer säkra delar av befintliga vägkanter och gör korta pauser. Den valda personen fryser på sin faktiska position; klickytan och renderingen läser samma pose. Spelaren kommer fram ungefär en figurbredd från personen. Byte av mål släpper den tidigare personen. Navigation från en punkt mitt på vägen använder tillfälliga anslutningar till det befintliga vägnätet; regionernas noder, vägar, broar och byggnader ändras inte.

Två hundar följer befintliga vägar. Hela hunden speglas bara vågrätt när den vänder. Tassarnas gång, svansen och nosrörelserna syns. Sex höns går och pickar; tre får och två kor går korta sträckor och rör huvud eller svans inom sin befintliga hage. Hagen, vägarna och landsbygdens byggnader har samma placering. Alla rörelser använder världens befintliga animationsloop och tar hänsyn till `prefers-reduced-motion`.

Tanke- och pratbubblor, korta meddelanden och samtalens val får också en synlig pappersyta med lätt ojämn klippt kant och mjuk seriftext. Det är samma materialfamilj som världen. Bubblornas ankare och mått styrs fortfarande av sina respektive samtalsmoduler; scenen ligger kvar bakom dem.

Pappersmaterialet hämtas fortfarande från ett rent pappersfält i befintliga `docs/world/assets/town.webp`. Dämpade färger, klippta delar och bruten innerfiber förenar människor, djur och rum.

## Bekantskaper i de vanliga rummen

Sparnyckeln `uppdrag1700-known-people-v1` och platsnycklarna `archive`, `cafe`, `print`, `quay` är oförändrade. En fullständig presentation registrerar bekantskapen. Återhälsningen förbrukas när personens svar visas, även om man sedan avbryter. Att stänga och öppna samtalet igen återställer inte hälsningen; ett nytt rumsbesök gör det. Ruts handlingar och dokumentövning finns kvar.

Gamla `street:<person-id>`-värden i en sparning behöver inte raderas; de används inte för att lägga hälsningssteg framför de nya korta mötena.

## Aktiva filer

Alla nedanstående filer ligger i `docs/demo3/`.

| Fil | Roll |
| --- | --- |
| `living-world.html` | Direkt HTML-start, vägnavigation och ankomst till gående människor. |
| `living-conversation-data.js` | Tolv korta tankar, nio människor och bevarade källmetadata. |
| `living-dialogues.js` | En tankebubbla och Gå vidare; ankare, fokus och tillgängliga personknappar. |
| `world-life.js` | Gående människor, freeze/release, hundar, höns, får och kor. |
| `archive-living.js` | Ruts accepterade 3.12.1-samtal utan extra reflektionsmeny. |
| `place-living.js` | Maja, Brita och Jo med 3.12.1:s hälsningslogik. |
| `meeting-living.js` | Upprätta kartfigurer med ansikten; bevarade rumsfigurer. |
| `paper-fibres.js` | Gemensamt pappersmaterial och fiberkanter. |
| `paper-dialogues.js` | Gemensamt pappersutseende för bubblor, meddelanden och samtalens val. |
| `interior-fibre-art.js`, `more-room-fibre-art.js` | Befintlig rumsgeometri med gemensamt material. |
| `harbour-fibre-art.js` | Befintlig hamngrafik med fiberkanter. |
| `paper-look.js`, `harbour-merchant-visits.js` | Bevarad karta, rum, dörrar, hamnbesök och båtfärder. |

Den accepterade [3.12.1](https://andersljungvik.github.io/uppdrag-1700/demo3/conversations.html?v=3.12.1), [3.11](https://andersljungvik.github.io/uppdrag-1700/demo3/known-people.html) och 3.10 (`thoughts.html`) bevaras i sina egna filer. 3.14 uppdaterar de aktiva living-filerna; återinför inte 3.13:s långa reflektionssystem.

## Underlag

Originalfrågorna återfanns i `curriculum/classroom.mjs` vid commit `f277b2a3fb9cc138f2b4d5ac30ca5765767a5eb7`. Den äldre samtalsformen finns i `docs/game.js`. Originalposter, hänvisningar och provenance bevaras i datafilen som underlag. De tolv nya tankarna är redaktionella bearbetningar av dessa teman enligt användarens senaste exempel. Inget nytt AI-frågebibliotek kopplas in.

## Verifiering av 3.14

Det lokala integrationstestet `living-world-check.cjs` passerade utan registrerade körfel, även med den nya `paper-dialogues.js` laddad sist. Det kontrollerar samtliga fyra ursprungliga rumsfigurers presentationer, gamla sparflaggor, högst en hälsning per besök, vanliga ämnen och Ruts dokumentövning. Det kontrollerar också alla nio gående personer, alla tolv korta tankar, en enda Gå vidare-knapp, stabil text tills den stängs, gångankomst, frysta och frisläppta personer, byte av mål under gång, träffytor, Escape, tangentupprepning, fokus och återställd inert. Ursprunglig världsgeometri och källmetadata är oförändrade. Testet använder jsdom och riktig canvas med ersatta bakgrundsbilder.

Separat faktisk canvasgranskning av kartfigurerna gjordes i 0,62×, 1,08× och 4×, både vänster och höger samt under gång. Alla 20 riktning-/gångkombinationer passerade. Spelarens riktning behålls vid stopp och vertikal förflyttning. Rummens stora porträtt är pixel-identiska före och efter i båda riktningar.

Separat djur- och rörelsekontroll passerade för alla nio personrutterna, provtagna var fjärde världsenhet med 26 enheters hus- och vattenmarginal. Rörelse, pauser, båda riktningar, frysning, fortsatt gång och blick mot spelaren kontrollerades. Hundar, höns, får och kor renderades med riktig canvas åt båda håll; fötterna förblir nedåt. Får och kor stannar helt inom hagen. Minskad rörelse ger identiska bildrutor.

Webbläsargranskningen görs på den publicerade sidan efter dessa lokala kontroller. Resultatet redovisas i leveransen. Användarens egen enhet ingår inte i den lokala provningen.

## Fortsätt utan att tappa beslut

Utgå från användarens senaste korrigeringar ovan. Håll utomhustankarna korta. Bevara papperskänslan, rumsbekantskaperna, högst en hälsning per besök och den manuella fortsättningen i vanliga samtal. Bevara kartans mått, godkända bildmiljöer, dörrar, navigation och båtfärder.

Den tidigare rapporten om en tanke som fastnade kom efter ett verkligt klick. Det finns inte belägg för grundorsaken; beskriv inte problemet som att användaren tryckte Enter före ett val. Återuppta inte äldre kartproblem enbart för att historiska dokument nämner dem. Se också `SCENE-COMPOSITION.md` för bildprinciper.
