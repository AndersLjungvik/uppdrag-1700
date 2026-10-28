# Kapitel 3 – Krig eller fred? · testversion 2.3.0

Bygger `KAPITEL3_MANUS.md` i den befintliga pappersstaden. Huvudmålet är fyra områden med lärling, gesäll och mästare. Sidouppdraget **Den stängda gården** är frivilligt och påverkar miljön. Provresultat, berättelsetid, möbler och äldre sidohändelser har separata sparningar.

## Frågeinventering

De 18 aktiva, sammansatta uppgifterna från `questions/snapshot.json.gz`, inklusive `fixes.js`, `alignment.js` och `power-language.js`, återanvänds. Inga fält, källor, modeller eller bedömningskrav ersätts av samtalsval. Äldre `base/chapter3-content.js` innehåller 13 faktanycklar; detta är inte antalet aktiva uppgifter.

| Område och faktisk plats | Ursprungliga faktanycklar | Aktiva uppgifter, vardera rang 0–2 |
| --- | --- | --- |
| Hattar och mössor · Riksdagshuset | hatsWar, hatsFrance, capsEngland | rc3-parties-0, rc3-parties-1, rc3-parties-2 |
| Hattar och mössor · Riksdagshuset | bribes | rc3-bribes-0, rc3-bribes-1, rc3-bribes-2 |
| Krigets följder · Slottet | warLost, landLost | rc3-war-0, rc3-war-1, rc3-war-2 |
| Krigets följder · Slottet | tsarina | rc3-successor-0, rc3-successor-1, rc3-successor-2 |
| Böndernas protest · Torget | farmersAnger, summer, march, protest, norrmalm | rc3-uprising-0, rc3-uprising-1, rc3-uprising-2 |
| Lydnad och samvete · Carlsten, Marstrand | david | rc3-david-0, rc3-david-1, rc3-david-2 |

Alla fyra lärlingsstämplar krävs före gesäll; alla fyra gesällstämplar före mästare. Kapitel 4 kräver alla tolv stämplar. Ordningen inom en nivå är fri. Ett fullständigt provförsök gäller ett område och en nivå. Efter en miss kostar ett helt nytt områdesförsök ett äpple; andra stämplar och världshändelser behålls. Rut är gratis och kan ge äpplen genom repetition av kapitel 1–2 och redan mötta ämnen i trean. Lärlingsledtrådar kostar en daler. Osäkra svar kan sparas för granskning eller bearbetning utan automatisk stämpel. Den befintliga lokala lärargranskningen kräver en uttrycklig lärarbekräftelse och loggas som `teacher-approved`.

## Rum, samtal och berättelsetid

Riksdagshuset har Elin och två dramatiserade företrädare för hattar och mössor. Amira är hovskrivare vid Slottet. Torgets arbetsyta nås via den befintliga torgnoden; den flyttar inte vägar eller byggnader. David och fästningsvakten finns i den befintliga fästningen på Marstrand. Den ursprungliga resan och ankomsten vid kajen används, med den befintliga knappen för att hoppa över båtanimationen. Efter ett besök visas en genväg som sköter färdvägen till Carlsten; resans platser och gångvägar finns kvar.

Provytorna använder de befintliga målade närbilderna på Slottet och i Riksdagshuset. Torget och fästningen har arbetsytor för sina miljöer. Personerna använder samma pappersfigurer, munrörelse och personanknutna pratbubblor som resten av spelet. Spelarens val ligger utanför den talandes bubbla. Ett prov, en pratbubbla, ett pussel och ett gatuförhör kan inte vara aktiva samtidigt.

`uppdrag1700.ch3-timeline.v1` lagrar besök, en framåtriktad tidsfas, upprorets slut och gatupatrullernas avstånd/vila. Tid visas utanför pratbubblan. En senare plats först märks som framåtblick; en tidigare plats därefter som återblick. Staden går inte tillbaka i tid när ett tidigare prov väljs. Nedslagningen återges med en stillsam saklig sammanfattning. Den innehåller ingen skjutmekanik. Böndernas stora marsch ersätts av en lugnare plats efteråt. Ryska läger blir synliga i det senare tidsläget.

Årtalet 1743 gäller tronföljdsvalet av Adolf Fredrik. Trontillträdet 1751 hålls isär från detta. Förlusten 1743 gäller områden i Finland. Davids handling och straff följer läromedelsunderlaget; hans exakta ankomstdag eller en frigivning hittas inte på. Att kalla honom modig eller feg är ett dramatiserat perspektiv, inget rättningskriterium.

## Den stängda gården

Bostadskvarterens befintliga ingång leder i trean till gården. Karin och en fiktiv trött bonde kommer överens om några besökare åt gången. Två tunnor flyttas genom att välja tunna och sedan en synlig plats. Dörren, gångstråket och utrymmet vid bänken behöver vara fria. Flera placeringar godtas. Försöken är fria; knappen **Visa en placering** ger ett tillgängligt exempel. Tab och Enter fungerar utan dragning eller precision.

`uppdrag1700.ch3-courtyard.v1` lagrar `available`, `talked`, `agreed`, `arranging` eller `open`, vald placering och korta återbesök. Avbrott i samtalet eller pusslet, omladdning och export/import bevarar detta. Den öppna grinden, tunnornas placering och en vattenhink syns efteråt. Besökarantal och repliker följer det senare tidsläget. Den som avstår kan ändå klara alla prov och gå vidare.

Karin känner igen hjälpen med täcket endast när `uppdrag1700.ch2-window-bed.v1` i samma elevomgång har `phase: delivered`. Den nyckeln läses utan att ändras. Den valda lagningen finns också kvar på Barnhusets säng vid återbesök i trean. Uppdraget ger inga daler, äpplen eller provstämplar och ändrar inte det historiska upprorets utgång.

## Gatan

Trean använder befintliga bönder, soldater, hattar, mössor, David och senare ryska vakter. En närbelägen patrull kan efter fortsatt gång och sparad vila stanna spelaren för en kort fråga från kända ämnen. Frågan använder den befintliga frågebanken. Det går att svara eller gå vidare; fel svar medför ingen förlust och ger ingen stämpel. Patrullen återkommer först efter mer gång och vila. Prov, pussel, samtal och sammanfattningen av nedslagningen avbryts inte. Hjulaxelhändelsen är avstängd. Den gemensamma ficktjuven kan däremot återkomma under vanliga stadspromenader, utanför samtal, prov, materialpussel och nedslagningens sammanfattning. När spelaren har minst 3 daler kan halva plånboken stjälas, avrundat uppåt. Både jakten och senare hjälp hos barnet återbetalar den exakta stulna summan, högst en gång per penningpung. Omladdning och äldre en-dalersförluster bevaras. Äldre vagnsflaggor sparas ändå oförändrade.

## Sparningar, övergång och testomgång

Kunskap använder `uppdrag1700.mastery.v1.ch3` och pilotens ursprungliga nyckel `uppdrag1700.ch3-real-world.20261019.v1`. En engångskopia av äldre pilotdata sparas med `.before-mastery-3`. Gamla svar och resurser behålls. En gammal `complete`-flagga räcker inte till nya stämplar. Endast hela, styrkta områdesförsök överförs i nivåordning. Den gamla besöksordningen var 1–3 per nivå; sammansatta uppgifter delas mellan de fyra nya områdena med sina oförändrade id:n. Rätt svar från olika gamla försök kombineras inte. Överföring ger ingen ny belöning.

Normal spelgång kräver styrkta föregående kapitel. Ett giltigt replay-id tillsammans med `testChapter=3` öppnar en separat elevomgång i trean utan påhittade stämplar i ettan eller tvåan. Befintliga sparningar i samma omgång kan fortsatt återbesökas. En riktig fullständig trea öppnar fyran. Lärarvyn har fortsatt separat sparning.

## Verifiering

`npm run test:chapter3` omfattar frågeinventering, alla 18 uppgifter, tolv stämplar, fri ordning, spärrar, äpple, Rut, lokal granskning, migrering med blandade försök, återbesök, två gårdslösningar, kontinuitet från täcket, export/import, verklig båtresa och kajankomst, tidsföljd/återblickar samt återkommande patruller. Mobilbredd, tangentbord och reducerad rörelse ingår i browserproven. Slutlig provstatus redovisas vid publiceringen; denna fil ersätter inte testutdata. Fysisk Safari/iPhone ingår inte i Chromium-proven.

Historiska kontrollkällor utöver läromedlets frysta frågebank: [Riksarkivet/SBL: Adolf Fredrik](https://sok.riksarkivet.se/sbl/Artikel/5574) och [Stockholms läns museum: De arga böndernas brev till kungen](https://stockholmslansmuseum.se/skola/lanskallan/lararmaterial/de-arga-bondernas-brev-till-kungen/). Gården och alla exakta repliker är fiktion. Inget påstående om uppmätt lärandeeffekt görs.
