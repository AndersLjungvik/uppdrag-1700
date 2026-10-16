# Klassrummets frågebank

Den nya banken utgår enbart från användarens uppladdade SOS-material om 1700-talets Sverige. `classroom.mjs` innehåller frågorna, facit och hänvisningarna. `coverage.mjs` redovisar täckning, öppna uppgifter och luckor mot arbetsbok och prov. Inga webbkällor används för frågornas innehåll.

Banken omfattar 139 rättningsbara uppgifter (97 kortsvar, 42 byggsvar) och 12 samtalsfrågor utan automatisk rättning. Den innehåller samtliga 18 begrepp från begreppsbladet och samtliga 17 begrepp från provens begreppsuppgifter; fyra överlappar. Bokens tio avsnitt har varsin fördelning över tre uppgiftsnivåer.

Frågorna är bearbetningar, inte ordagranna provkopior. Byggsvar ger träning i att välja och koppla led. De ersätter inte självständiga resonemang eller faktisk bild- och källtolkning.

## Bygg och kontrollera

```sh
node curriculum/build.mjs
node curriculum/review.mjs
node --test scripts/classroom-bank.test.mjs
```

Exporten finns i `dist/classroom-bank.json` och `dist/classroom-curriculum.js`. Läraröversikten genereras i `output/fragebank-1700.html` och kan även ladda ner den fullständiga JSON-banken utan nätanslutning.

`legacy-v3.js` bevarar det tidigare formatets arbetsplatsmetadata för exporten. Dess frågor och svar är **inte underlag** för någon ny fråga och blandas inte in i den nya banken. Den äldre banken har inte gjorts till en extern eller oberoende källa.

## Integration

Pappersvärldens motor läser bankens avsnitts- och nivåplaceringar. Testerna spelar igenom alla 30 nivåer och återläser sparningar efter uppdragens överlämningar. Den nya banken får inga extrafrågor från den gamla demon. Gamla yrkesnivåer och avklarade frågepass arkiveras vid bankbyte; pengar och föremål behålls. Gamla resultat räknas inte som att eleven har besvarat nya frågor.

Banken är integrerad i pappersstaden version 0.6.0. Den tidigare demoadressen leder vidare till huvudversionen. Den gamla klassiska versionens importgräns på 20 frågor per arbetsområde kan inte användas för att importera den nya banken; pappersvärldens motor har uppdaterad validering.

## Luckor och preciseringar

Luckor markeras i täckningslistan och fylls inte med allmänna historiekunskaper. Bland annat återstår svarskälla till arbetsbokens drottningfråga 2a, vissa detaljer i 8–10 samt visning av de faktiska bilderna i 32. Bildtolkningens metodfråga är endast förberedelse.

Skillnader mellan underlagen dokumenteras: dödsstraffet beskrivs inte som helt avskaffat, grundlag definieras inte generellt som enhällighetskrav och Gustav IV Adolf ges sitt fullständiga namn utan en felaktig datering av hans reaktion på revolutionen. Provets tvetydiga kategorisering av historiska källor hanteras som ett öppet samtal.
