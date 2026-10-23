# Uppdrag 1700 – sammanfogning 1.0.0

23 oktober 2026. Gemensam ingång: `/uppdrag-1700/spel/`. Lärarvy: `?teacher=1`.

## Det som är sammanfogat

Kapitel 1–5 använder uppdragskedjorna i spelvärlden, samtliga 78 uppgifter i frågeversion 3.1 och miljöarbetet från `uppdrag1700_rumsprov_v5.html`. Rumsgenvägarna visar 22 miljöer: 13 stadsinteriörer, 6 ö-interiörer och 3 kajer. Animationerna, personerna, befintliga sidoäventyren och pappersgrafiken är kvar. Detta är inte en sammanfogning av enbart menyer eller separata frågesidor: kapitelkontrollerna anropar den nya frågemotorn på sina arbetsplatser, och godkända uppdrag driver den befintliga berättelsen vidare.

Vanlig spelgång låser kapitel 2–5 tills föregående kapitel är klart och tillåter återbesök. I lärarvyn är de fem kapitlen öppna och miljöer kan väljas direkt. Detta är INTE en säker lärarinloggning. Kapitel 6–10 visas som återstående, inte som färdiga kapitel.

## Sparning

Eget prefix `uppdrag1700.integrated.20261023.v1.` med skilda `play.` och `teacher.`. Äldre spel och det separata frågetestet ändras inte och deras resultat importeras inte automatiskt. En ny spelomgång börjar därför från början. Kapitelbyten bevarar samma sammanfogade sparning. Menyn kan exportera/importera en kopia för den aktuella vyn. Blockerad lagring ger en varning och använder minne tills sidan stängs. Inga elevsvar skickas till en server.

## Källkod och reproducerbarhet

`base/` är en fryst kopia av Git-trädet `f81cf7fd17174b293f54f68598c07d78c1b61ea4` (tidigare docs/demo3). Originalgrafiken hämtas från projektets befintliga `docs/world/assets/` via samma relativa basadress som tidigare. De inbäddade bildversionerna i rumsprovet motsvarar dessa originalfiler; de dupliceras inte här.

`delta-1.bin` till `delta-4.bin` fogas i nummerordning till ett gzip-paket (13 197 byte). SHA-256 för det sammanfogade paketet: `ad272c757bf30bd6b8abc9b6f4270deb162d99ddf22bf55c5a0c611b5f0761c9`. Det innehåller 24 textändringslistor och den nya `room-life.js`. Varje ändrad fil kontrolleras mot SHA-256 både före och efter ändring. Positionerna i ändringslistan räknar Unicode-kodpunkter.

Frågesnapshoten, `fixes.js` och `alignment.js` återanvänder EXAKT samma Git-blobbar som det fungerande separata frågetestet 3.1. Flödesanpassningen och större svarsrutor kopplas på vid laddning. `decode_sources.py` kan användas för att skriva ut granskningsbara källfiler lokalt; de genererade filerna ersätter inte denna startmekanism.

## Genomförda kontroller

En lokal Chromium-genomspelning fyllde i uppgifternas exempelsvar genom formulären och fortsatte genom avslutningsdialogerna: 78 frågor, 48 arbetsbesök och 5 avslutade kapitel. Daler följde med genom kapitlen: 3 → 12 → 18 → 27 → 39 → 51. Omladdning återupptog avslutat kapitel 5 med bevarade svar. Inga JavaScript-fel registrerades i den körningen.

Separata kontroller verifierade öppning av alla 22 miljöer, framåtlåsning, skilda lärar-/spelsparningar, orörd äldre sparning, byte med blockerad lagring samt tidigare grundlags- och varusvar. Dessa logikkontroller ersatte canvas, bilder och animering med testdubblar. Mobilkontroll med riktig canvas vid 390 × 844 px godkände `Kina` och `the, siden och porslin` inne i kajmiljön utan horisontellt överflöde.

Webbläsartesterna använde lokal, simulerad filhämtning, lagring och navigering. De är inte nätverkstest på den publicerade adressen eller test på fysisk iPhone/Safari. Samtliga gångvägar, sidouppdrag och möjliga elevformuleringar är inte uttömmande kontrollerade. Exempelsvarens godkännande innebär inte att alla andra rimliga formuleringar fungerar. Den regelbaserade rättningen är fortfarande en begränsning och ska inte användas för betyg.

## Fortsättningen

Kapitel 6–10 byggs vidare här, inte som ett separat spel. Se `ROADMAP.md`. Ingen ny historisk frågebank för dessa kapitel har hittats på eller publicerats i denna sammanfogning.
