# Aktuell utvecklingsstatus – Uppdrag 1700

Uppdaterad 18 oktober 2026. Aktuell arbetsversion är **Demo 3.13 – En levande pappersvärld**, byggd vidare från användarens accepterade 3.12.1.

## Börja här

[Starta Demo 3.13](https://andersljungvik.github.io/uppdrag-1700/demo3/living-world.html?v=3.13.0). Startfilen är `docs/demo3/living-world.html`.

Utgå från denna startfil vid nästa ändring. Den generella `/demo3/`-adressen och `game.html` visar fortfarande den äldre 3.2.1-demon. Den tidigare huvudversionen 0.6.0 är ett annat, bevarat förlopp med hela uppdragssystemet; den har inte ersatts eller påståtts helt överförd till denna demo.

Användaren ville återfå reflektionssamtalen, möta fler människor och djur och förena dagens fungerande design med den tydligare tidigare papperskänslan. Proportioner, mått, silhuetter, placeringar, vägar och båtfärder ska bevaras. Dator är huvudformatet. Den äldre uppskattade papperskänslan är flat, dämpad och tydligt klippt, med små figurförflyttningar och gester.

## Vad som finns i 3.13

### Reflektion som frivilliga samtal

Tolv frågor med bevarade ID:n, frågetexter och hänvisningar från `curriculum/classroom.mjs`. Varje fråga har två motfrågor och en ytterligare följdfråga per gren. En vald tanke följs först av spelarens synliga replik, sedan av personens svar. En bubbla är synlig i taget och texten ligger kvar tills spelaren fortsätter. Reflektionerna ger inga poäng, stämplar eller automatisk rättning.

| Person och plats | Reflektionsämnen |
| --- | --- |
| Klara på torget | Frihetstidens frihet |
| Maja i kaffehuset | Synen på ogifta mödrar; utsatthet och följder av straff och skam |
| Noor vid barnhuset | Barnens vardag |
| Brita i tryckeriet | Vilka personer historieböcker berättar om |
| Linnea vid vetenskapens hus | Indelningar av människor |
| Lovisa vid slottet | Olika syn på Gustav III |
| Karin vid byn | Staden eller landet |
| Jo vid kajen | Tänkbara följder av en seger i kriget |
| Liv vid operan | Maskeradens betydelse |
| Rut i arkivet | Maktfördelning; att använda olika källor |

Utomhus finns också Otto vid tryckeriet, Amira på Marstrand och Ester på Saint Barthélemy. Alla nio nya människor har kort småprat och en ömsesidig presentation. Världsklick och tillgängliga personknappar leder spelaren längs den befintliga vägen till mötet.

### Liv i världen och gemensamt material

Två hundar springer och stannar längs redan befintliga vägsegment. Sex höns pickar nära byn och herrgården. Tre får och två kor finns i en hage söder om landsbygdens byggnader. Hagen ligger utanför vägar, hus och vatten. Knappen Landsbygden går till den befintliga bynoden.

Materialet för människor, djur och rum hämtas från ett rent pappersfält i befintliga `docs/world/assets/town.webp`. Färger och hud hålls dämpade. En bruten innerkant ger synliga fiberkanter innanför den befintliga formen; inga punkter flyttas. Hamnen behåller sina originalutsnitt och sin geometri. Rörelser respekterar `prefers-reduced-motion`.

### Bekantskaper och hälsningar

Samma sparnyckel som 3.11 används: `uppdrag1700-known-people-v1`. De befintliga platsnycklarna är `archive`, `cafe`, `print`, `quay`. Nya människor använder `street:<person-id>`. Befintliga bekantskaper följer därför med.

En fullständig första presentation registrerar bekantskapen. En återhälsning förbrukas när personens svar visas, även om samtalet därefter avslutas direkt med Escape. Att stänga och öppna samma samtal eller växla till reflektion återställer inte hälsningen. Ett nytt rumsbesök tillåter återhälsning. Utomhus räknas ett nytt besök när spelaren lämnar närområdet eller besöker ett rum. Ruts vanliga handlingar och övning finns kvar.

## Aktiva filer

Alla nedanstående filer ligger i `docs/demo3/`.

| Fil | Roll |
| --- | --- |
| `living-world.html` | Komplett direkt HTML-start; befintlig värld med människor och deras ankomst längs vägarna. |
| `living-conversation-data.js` | Frågor, ursprungliga referenser, 12 samtalsträd och nio personer. |
| `living-dialogues.js` | Tankar, repliker, motfrågor, följdfrågor, fokus och världens bekantskaper. |
| `world-life.js` | Människor, hundar, höns, får och kor; renderar genom den befintliga animationsloopen. |
| `archive-living.js` | Ruts fungerande 3.12.1-logik och en ingång till reflektion. |
| `place-living.js` | Maja, Brita och Jo, med samma hälsningslogik och reflektionsingång. |
| `meeting-living.js` | Samma figurer och projektioner, gemensamt material och talanimation. |
| `paper-fibres.js` | Delat pappersmaterial och fiberkanter. |
| `interior-fibre-art.js` | Material för kaffehuset, tryckeriet och arkivet. |
| `more-room-fibre-art.js` | Samma material för ytterligare 14 rum. |
| `harbour-fibre-art.js` | Fiberkanter i befintlig hamngrafik. |
| `paper-look.js` | Oförändrad världskarta. |
| `harbour-merchant-visits.js` | Oförändrade rum, dörrar, hamnbesök och båtfärder. |

3.13 har egna filer. Den accepterade [3.12.1](https://andersljungvik.github.io/uppdrag-1700/demo3/conversations.html?v=3.12.1), [3.11](https://andersljungvik.github.io/uppdrag-1700/demo3/known-people.html) och 3.10 (`thoughts.html`) bevaras.

## Underlag och redaktionell avgränsning

Frågorna återfanns i `curriculum/classroom.mjs` vid commit `f277b2a3fb9cc138f2b4d5ac30ca5765767a5eb7`. Den tidigare samtalsformen och några småpratsrepliker finns i `docs/game.js`. Källkatalog, originalposter och exakt provenance följer med i `living-conversation-data.js`.

Frågorna är spelets tidigare bearbetningar av det uppladdade SOS-materialet, inte ett påstående om ordagranna bokcitat. De nya korta svaren och följdfrågorna är skrivna spelrepliker. Alla tolv kompletta samtalsträd återfanns inte som sådana i den äldre koden; de återfunna frågorna har här förenats med den tidigare frivilliga samtalsformen. Inget nytt AI-frågebibliotek har kopplats in.

## Verifiering

Lokalt modultest `living-world-check.cjs`: **PASS utan registrerade körfel**. Det bevarar samtliga tidigare 3.12.1-assertioner och kontrollerar dessutom alla tolv frågors båda grenar och följdfrågor, alla nio människors presentationer/småprat/återhälsningar, rörelse till rätt mötesnod före samtalsstart, exakt bankinnehåll, fria personplaceringar och oförändrad världsgeometri. Enter-repeat, fokus, Escape, inert och återgång till vanliga tankar ingår. Testet använder jsdom och riktig canvas men ersätter bakgrundsbilder; det är inte visuell webbläsarverifiering.

Separat materialkontroll `paper-material-check.cjs`: **PASS** för 34 interiörvyer (17 rum i två format) och 24 hamnvyer (tre miljöer, fyra resefaser, två format), med verkliga originalbilder och canvas. Geometri-/möbelfunktioner är identiska med grundversionen. Dörr- och fartygsklickytor är identiska. Fiberbehandling ritar inte utanför den befintliga silhuetten. Faktiska figur-, arkiv- och hamnbilder har granskats.

Djurkontrollen bekräftar rörelse mellan bildrutor, identiska bilder vid minskad rörelse och återställd canvastransform. Testfilerna är tillfälliga arbetsfiler, inte nya beroenden för spelet.

Publicering och granskning av den sammansatta sidan i Chrome dokumenteras efter slutförd kontroll. Elevens egen webbläsare har inte provats.

## Fortsätt utan att tappa beslut

Utgå från 3.13:s aktiva filer ovan och användarens senaste återkoppling. Behåll tankebubbla → spelarens replik → personens svar, manuell fortsättning, bekantskaper och högst en hälsning per besök. Lägg inte tillbaka en hälsning enbart för att samtalet öppnas igen. Nya reflektioner ska förbli frivilliga och källbundna.

Användarens tidigare rapport om en tanke som fastnade kom efter ett verkligt klick. Det finns fortfarande inte belägg för grundorsaken. Beskriv inte problemet som att användaren tryckte Enter före ett val. Den direkta HTML-starten har provats som fungerande; det bevisar inte att en äldre laddningsmetod orsakade felet.

Bevara godkända bildmiljöer, sparnycklar, navigation, dörrar och båtfärder. Återuppta inte äldre kartproblem enbart för att historiska dokument nämner dem. Se också `SCENE-COMPOSITION.md` för bildprinciper.
