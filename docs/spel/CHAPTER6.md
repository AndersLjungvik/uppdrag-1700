# Kapitel 6: Livet på landet och i staden

Version 1.2.0, 26 oktober 2026. Byggt vidare i det sammanfogade äventyret, inte en fristående frågesida.

## Spelgång

Maja lämnar ett brev med en gammal adress. I Byn jämför spelaren kartorna A och B och följer familjens gröna åkrar till Sigrids gård. Fel kartval ger återkoppling men ingen kunskapsstämpel. Rätt kartval sparar brevleveransen och öppnar återkallningen.

Tre omgångar – lärling, gesäll, mästare – innehåller fyra arbetsbesök vardera: Byn, Verkstäderna, Kaffehuset och Tryckeriet. Varje besök har tre uppgifter. Slutligen behöver den tryckta sidan lämnas till Maja; sista rätta svaret ensamt avslutar inte kapitlet. Knappen ”Brevet & stadens bok” visar leveransen, den rättade vägbeskrivningen och sidans status.

De 36 uppgifterna återkommer till 12 teman: åkrarnas förändring, gårdarnas flytt, följder av skiftet, stadens yrken, barnarbete och lön, stadsliv, Bellman, visornas innehåll, kulturstöd, kulturinstitutioner, kvinnors utbildning och Catharina Ahlgren. Ett namnfrågesvar behöver inte en orsak. Begärda förklaringar och antal exempel står i frågan. Yrkes- och stadsexempel ska vara olika, inte synonymer för samma exempel.

## Källunderlag

Faktainnehållet granskades i användarens originalfotografier av SOS Historia 4–6 grundbok s. 86–89 och arbetsbok s. 32–33, uppgift 18–22. Grundboksfoton: `IMG_723D0D8C-BC6B-49AB-BA18-2AE21E186F12.jpeg` och `IMG_8D838795-891E-4089-AEF7-C5904484ACC9.jpeg`, bevarade i användarens källkopplingsfil. Arbetsboksfoton: `IMG_87C99DE1-C08A-4BAC-BEE3-21A4CB2435C9.jpeg` och `IMG_3801D3A4-259C-40E3-A297-3F784379AB47.jpeg`.

Kartbilden är ett beskuret diagrampar från det tillhandahållna arbetsboksfotot, inte hela sidan eller något prov. Namnåterkallningen om Bellman är uttryckligen en textfråga, inte en ovisad porträttfråga. Bokens sista författarnamn är Catharina Ahlgren. Inga nya historiska årtal om skiftet har lagts till.

Berättelsen följer användarens `Uppdrag_1700_hela_uppdragskedjan.docx`. Brevet, Sigrid som mottagare, den gröna färgledtråden och stadsbornas repliker är påhittade spelhändelser. Visor behandlas inte som uttömmande dokumentation av allas liv.

## Teknik och sparning

`chapter6-build.js` återanvänder de frysta, redan sammanfogade kapitelkontrollerna. Varje nödvändig källkodsförändring har en kontrollpunkt och stoppar med felmeddelande om grundversionen inte matchar. `chapter6-content.js` lägger till frågor och fältvisa rättningsregler; `chapter6-world.js` hanterar brevet och kartorna. De befintliga 78 frågorna delegeras till den oförändrade 3.1-rättningen. Ingen ny klassinloggning har lagts till.

Samma sparprefix som 1.0: `uppdrag1700.integrated.20261023.v1.` med `play.` och `teacher.`. Ny intern kapitelnyckel: `uppdrag1700.ch6-real-world.20261023.v1`. Kapitel 6 öppnas efter avslutat kapitel 5; lärarvyn har separat framsteg. Kapitel 7–10 är fortsatt markerade som återstående.

## Utförda kontroller och begränsningar

255 automatiska rättningsfall passerade: exempelsvar och icke-svar för alla 114 uppgifter samt bland annat tidigare grundlags-/varusvar, korta namn, alternativa lönesvar, negationer, felaktiga institutionsnamn och dubblerade exempel. Kör efter `python decode_sources.py`: `node tests/chapter6.cjs`.

Lokal Chromium-kontroll gick igenom alla 36 nya frågor via formulären, alla 12 arbetsbesöks avslutningsdialoger och slutleveransen till Maja. En del av körningen återupptogs från sparat steg 11. Slutresultat: 36 loggade godkända svar, 15 daler från startvärdet 3, avslutat kapitel och bibehållet resultat efter omladdning. Testet använde uppgifternas exempelsvar och lärarvyns rumsgenvägar, inte en fullständig gångtur genom varje gata.

Dessutom kontrollerades alla 22 rumsgenvägar med riktig canvas i tre separata körningar, kartval utan förtida stämpel, mobilvyer 390 och 320 px, bevarad kapitel-5-sparning, överföring av 51 daler och 2 äpplen, spärr utan avklarat kapitel 5 och fortsatt start av kapitel 5 med länk till kapitel 6. Inga JavaScript-fel registrerades i genomspelningens respektive rumskontrollernas loggar.

Webbläsartesterna simulerade nätverk, lagring och adressbyte med verkliga projektfiler och bilder. Detta är inte en kontroll av publicerad webbtrafik eller en fysisk iPhone. Alla tänkbara formuleringar, gångvägar och sidouppdrag är inte validerade. Rättningen är fortfarande regelbaserad: okända rimliga svar kan behöva lärargranskning. Spelet är träning, inte betygsunderlag.


## Justering 1.2 – rörelse och mästarloop

Tryckpressens skala och djupplacering är korrigerade i den gemensamma rumsrenderingen. Under kapitel 6 kan två gatuhändelser triggas när spelaren faktiskt går mellan platser. De använder högst en daler eller, om spelaren har fler än ett äpple, ett äpple som insats. En kort repetitionsfråga från tidigare kapitel kan rädda resursen. Händelserna är bonusrepetition, inte bedömning, och kan alltid lämnas utan att kapitlet blockeras.

Rättningen för skiftesförklaringarna har fått bredare språkigenkänning. Om ett rimligt svar fortfarande hamnar i osäker granskning kan eleven spara svaret och fortsätta. Det sparas som `pending-review`: progressionen fortsätter, men svaret räknas inte som självständig mästarprestation. Därmed ska en okänd formulering inte skapa den tidigare oändliga mästarloopen.
