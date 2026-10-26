# Kapitel 8: Skottet på maskeraden – spelversion 1.4.0

Denna version bygger vidare på samma stad, uppdragsmotor och sparning som kapitel 1–7. **Ingen ny stadsvärld** skapas. Tryckpressen, bostadskvarterens placering, betesdjuren och tidigare rättningsfixar lämnas oförändrade.

## Berättelsen utvecklas i samtal

Spelaren blir tillfrågad av Maja om ett operaprogram i Tryckeriet. En historiskt förankrad händelse utspelar sig sedan vid Operan: varningsbrev, maskerad och skottet den 16 mars 1792. En fiktiv person, Liv, hjälper spelaren att skilja iakttagelser från rykten. **Jo återkommer med ett nytt daterat besked den 29 mars**, när kungen avlidit av sina skador. Brita upptäcker därefter att hennes rubrik påstod att han dött samma kväll som skottet, och vill rätta den. Elin hjälper eleven sätta oppositionens missnöje med kungens makt i ett politiskt sammanhang. Maja låter också olika stadsbor reagera olika utan att spelet påstår att alla hade samma inställning.

Spelaren får göra samtalsval vid sex viktiga skeenden (steg 1, 2, 3, 4, 7 och 8). **Båda valen leder till meningsfulla, olika svar från personen** och sparas i kapitlets samtalshistorik. Ett senare samtal kan hänvisa tillbaka till det tidigare valet. Valen ger inte automatiska kunskapsstämplar, och spelet förväxlar inte att diskutera ett rykte med att veta en historisk uppgift.

Före och efter kunskapsbesöken har Brita, Jo, Liv, Elin och Maja stegberoende repliker. Även utvalda figurer på gatan har reviderade repliker som ändras efter dödsbeskedet.

## Progression

Det finns **9 arbetsbesök med 2 kunskapsuppgifter vardera**, totalt 18 frågor i tre nivåer:

| Steg | Nivå | Miljö | Kärnfrågor |
| --- | --- | --- | --- |
| 1 | Lärling | Tryckeriet | adelns missnöje, varningsbrevet |
| 2 | Lärling | Operan | skottet, möjliga skäl till maskeraden |
| 3 | Lärling | Kajen | dödsbeskedet, straffen |
| 4 | Gesäll | Tryckeriet | varningsbrev och dödsdatum |
| 5 | Gesäll | Riksdagshuset | politiska motiv och straff |
| 6 | Gesäll | Operan | skottet och möjliga förklaringar |
| 7 | Mästare | Kaffehuset | politisk opposition och belagd varning |
| 8 | Mästare | Tryckeriet | nyhetsmening och historisk hypotes |
| 9 | Mästare | Operan | datumen och straffen |

Först efter att nyhetsbladet lämnats till Maja avslutas kapitlet. En ofullständig eller okänd men rimlig formulering kan sparas för lärargranskning och tillåta fortsatt spel utan falsk självständig mästarstämpel. Fråga och bedömningskrav matchar: namnfrågor kräver namn, datumfrågor datum och hypotesfrågor uttryckligen en möjlig förklaring, **inte ett ”enda rätt” motiv**.

## Historia och källor

Bygger på SOS Historia 4–6, grundboken s. 97–99 och arbetsboken s. 36, uppgift 28, samt användarens plan `Uppdrag_1700_hela_uppdragskedjan.docx`. De exakta datumen 16 och 29 mars har kontrollerats mot Sveriges Historia/Livrustkammaren och Svenskt biografiskt lexikon/Riksarkivet. Gustav III sköts på maskeradbalen den 16 mars 1792 men dog den 29 mars. Delar av adeln motsatte sig kungens ökade makt. Anckarström dömdes till döden, medan två andra inblandade fick landsförvisning. **Varför just maskeraden valdes tränas som hypotes, inte ett belagt entydigt orsakssvar.**

- https://sverigeshistoria.se/lektioner/skottet-pa-operan/
- https://sok.riksarkivet.se/sbl/Presentation.aspx?forceOrdinarySite=true&id=13317

Liv, nyhetsbladet och replikerna är fiktiva berättelseelement. Händelserna, inte de exakta dialogerna, är historiska.

## Teknik och kontroller

Samma integrerade lagringsprefix `uppdrag1700.integrated.20261023.v1.` används; kapitel 8 får en ny egen nyckel `uppdrag1700.ch8-real-world.20261026.v1`. Kapitel 1–7 lämnas orörda och den tidigare rättningen av gesällens krigsfråga följer med. Kapitel 8 är låst i elevläge tills kapitel 7 avslutats, men direkt åtkomligt via lärarvyn.

Källkoden finns okomprimerad i det lokalt genererade testpaketet och komprimerad som `chapter8-sourcepack.json.gz` i GitHub. `decode_chapter8_sources.py` återskapar redigerbara skript. Källorna laddas med SHA-256-kontroll.

Utförda automatiska kontroller: 135 positiva, tomma, negativa och regressionsfall i frågemotorn (inklusive 78+36 tidigare uppgifter); 45 skript i det sammanfogade kapitlet bygger och syntaxkontrolleras; sex samtalshändelser och deras olika svar, sparning och senare återkoppling kontrolleras i isolerad JavaScript-testning. **Ingen fullständig spelgenomgång på fysisk mobil eller slutkontroll av det publicerade spelet har genomförts.** Kapitlet är fortsatt en lärarprototyp och rättningsmotorn är inte validerad för betyg.
