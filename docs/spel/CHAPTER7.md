# Kapitel 7 – Ska Sverige bli en stormakt igen?

**Version 1.3.0 · 26 oktober 2026**. Fortsättning på det sammanfogade spelet. Kapitel 1–6, deras 22 miljöer, godkända koordinater, tryckpress, sparningar och befintliga rättningsregler behålls.

## Berättelsen och vad som händer på vägen

En handelsnotis räknar upp inkomster och nya möjligheter men saknar viktiga perspektiv. Maja på Kaffehuset skickar spelaren till Jo vid kajen, vidare till **Marstrand** och **Saint-Barthélemy**, och därefter tillbaka till staden för att rätta både handelsnotisen och ett **för tidigt segeranslag** om Gustav III:s krig mot Ryssland.

**Fyra engångshändelser i spelmiljöerna** skiljer sig från vanliga kunskapsfrågor:

1. **Marstrands hamn:** Sortera ett hantverkarärende med hänsyn till friare handel, låga skatter och undantag från skråregler.
2. **Gustavias hamn:** Upptäck vad en ensidig handelsnotis utelämnar om människor som förslavades och om motstånd.
3. **Gustavias källrum:** Källuppgiften om Marie Anne och Cecile skiljer människors egna handlingar från deras förtryck. I bokens episod krävde de utlovad lön och anmälde misshandel, inte en historiskt obelagd frigivning vid samma tillfälle.
4. **Huvudstadens kaj:** Rätta ett för tidigt segeranslag. Kungens mål 1788 blandas inte ihop med följderna 1790.

Källboken visar riktningarna i triangelhandeln som ett **schematiskt diagram** (inte en geografiskt skalenlig karta). Den förklarar att människor som fördes bort från Afrika förslavades; de blir aldrig spelbara lastvaror, belöningar eller valuta. Den separata fliken **”Längre fram i tiden: 1847”** handlar om avskaffandet efter riksdagsbeslut och om växande motstånd och kritik. Spelet anger uttryckligen att detta är en framåtblick, följd av återgång till 1788–1790. År 1878 markerar slutet för Sveriges koloniala innehav på ön, inte året slaveriet avskaffades.

**Tolv arbetsbesök** med tre uppgifter per besök (=36) repeterar tolv teman genom lärling, gesäll och mästare. Lärlingens resa använder de existerande rummen i Marstrands hamn, Gustavias hamn och Gustavia. Senare svar hämtas från minnet i Tryckeriet, Kaffehuset, Riksdagshuset och Kajen. Varje besök kräver högst tre frågor och varje förflyttning använder befintliga navigations- och resefunktioner, inklusive möjligheten att hoppa över själva båtanimationen. Händelserna ger inte automatiska kunskapsstämplar – svar på kunskapsfrågor bedöms separat.

Efter mästaromgången lämnas den rättade sidan till **Maja på Kaffehuset**. Den sista besvarade frågan avslutar alltså inte kapitlet ensam. Nästa tidskort pekar mot Operan 1792 (kapitel 8, ännu inte byggt).

## Faktaunderlag

Genomgånget mot användarens uppladdade fotografier av **SOS Historia 4–6, s. 90–96**, och **arbetsboken s. 34–35, uppgift 23–27**. Materialet fanns dessutom källkopplat i `uppdrag_1700_arbetsbok_grundbok_kallkoppling.json` och planerat i `Uppdrag_1700_hela_uppdragskedjan.docx`. Inga bokscanningar har lagts ut i det publika spelet; handelsruttens schema är egen kodgrafik.

- **23:** Tre olika fakta om Marstrand och tre om Saint-Barthélemy fördelas över korta frågor. Dubblerade ord är inte tre fakta.
- **24:** Europa–Afrika–Amerika återges med ett synligt schema; människor omnämns aldrig som vanliga handelsvaror.
- **25:** Ofrihet, tvång och misshandel behandlas sakligt med respekt för personerna. Marie Anne/Cecile handlar i texten genom att kräva lön och anmäla misshandel.
- **26:** Slaveriet på den svenska ön avskaffades **1847 efter riksdagsbeslut**, efter växande ifrågasättande och motstånd.
- **27:** Gustav III ville återta områden och vinna popularitet. Läroboken återger misstankar om att 1788 års gränshändelse iscensattes; frågan anger **”enligt boken”** för att inte göra en misstanke till ett obestridligt faktum. Kriget gav inga landvinster men ledde till att kungen fick större makt och riksrådet avskaffades.

## Rättning och pedagogisk avgränsning

Fråga, svarsfält och krav är samordnade. **Ett namn kräver bara ett namn**. När ett antal exempel, en orsak eller två skilda delar efterfrågas står det i uppgiften. Regelbaserad rättning ger även här möjlighet att spara rimliga men okända formuleringar för lärargranskning, och fortsätta utan falsk självständig mästarstämpel. Uppgifterna är träning och får **inte** användas som automatiskt betygsunderlag. Inga nya daler tjänas genom kolonialtemat; eleven behåller sina resurser från tidigare spel och kan repetera hos Rut.

## Sparning och teknisk anslutning

Samma integrerade prefix som i version 1.2.3: `uppdrag1700.integrated.20261023.v1.`. Ny kapitelnyckel `uppdrag1700.ch7-real-world.20261026.v1`. En vanlig spelare måste ha avklarat kapitel 6, medan lärarvyn är öppen. Tidigare kapitel kan återbesökas. Den nya källboken lagrar enbart egna steg i kapitel 7 och inga elevsvar skickas till en server. Ingen skolklassinloggning har lagts till.

De nya filerna är `chapter7-build.js`, `chapter7-content.js`, `chapter7-world.js`, `chapter7-tuning.js` och `tests/chapter7.cjs`. `chapter7-build.js` bygger vidare från den frysta kapitel-6-koden utan att ändra dess frågor eller originalfiler. Källkodsankare stoppas vid avvikelse. `chapter7-tuning.js` utökar endast regelkontrollen för öppna svar i kapitlen 6 och 7 och lämnar 1–5 orörda.

## Kontroller och kvarstående risker

- **163 automatiska kontroller** för kapitel 7 och tidigare kapitel-6-svar, där varje exempel i 36 frågor godtogs, tomma svar inte godtogs och ett urval motsägande svar inte godkändes. Kör `python decode_sources.py` och `node tests/chapter7.cjs` från `docs/spel/`.
- Lokal Chromium-körning med simulerade filhämtningar genomförde **36 formulärsvar och alla 12 arbetsbesök**, fyra berättelsehändelser samt slutleverans till Maja. Den hade inga JavaScript-fel. Ett separat test för ett okänt mästarsvar sparade det som väntande granskning och avslutade ändå uppdraget utan att tilldela självständig status.
- Mobilvy **390 × 844** hade ingen horisontell överrullning i dialogen för Marstrand. Vanligt spelläge startade med bevarade 51 daler och 2 äpplen från en simulerad avklarad kapitel-6-sparning.

Webbläsarkörningarna använde lokala, simulerade filhämtningar och inmatning; de är **inte** fullständig verifiering av det publicerade spelet på en fysisk iPhone. Inte heller samtliga gångvägar, sidouppdrag eller möjliga elevformuleringar är uttömmande testade. Kända brister ska kunna korrigeras utan att hela spelet görs om.