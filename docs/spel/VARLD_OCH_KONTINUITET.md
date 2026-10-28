# Kapitelvärldar och kontinuitet

**28 oktober 2026 · bevarandekrav och planeringsunderlag**

**Status:** Detta dokument kompletterar kapitelmanusen. Det ändrar inte spelkoden. Kraven för att bevara världsförändringar kommer från Anders; fyrans utvecklingsidéer nedan är arbetsförslag, inte publicerade funktioner. Befintlig kod är inventerad, inte fullständigt genomspelad i denna granskning.

## Grundregel: förenkla uppdragen, inte världen

Minnesbokens stämplar ska göra det lätt att förstå vad eleven ska repetera. Detta får inte ta bort de kapitelbundna miljöförändringarna, människornas olika rörelser, nya besökare, tidigare sidoäventyr eller följderna av elevens hjälp.

Varje kapitelmanus ska därför beskriva både kunskapsområdena och vad eleven faktiskt upptäcker mellan och inne i husen: vilka personer som finns, vad de gör, stämning, rörelsemönster, miljöernas tillstånd och vilka frivilliga möten som kan inträffa. Samma vagn eller samma trio av uppdragsgivare ska inte vara standardlösningen i alla kapitel.

## Fyra separata saker att spara

1. **Kunskapsprogression:** område, nivå, svar, stöd/granskning och stämplar. Alla lärlingsprov krävs före gesällproven; alla gesällprov före mästarproven; alla kapitlets mästarprov före nästa kapitel. Dessa är beslutade ombyggnadskrav, inte ett påstående om att den publicerade versionen redan följer dem överallt.
2. **Berättelsens tidsläge:** vilka skeenden som inträffat, läger, folksamlingar, rörelse och stämning. Ett omförsök på ett prov återställer inte historien.
3. **Sidoäventyrens resultat:** exempelvis lagat täcke, öppnad gård, levererad kokbok och fest. Ingen kunskapsstämpel ges av ett sådant resultat.
4. **Personernas minne:** vad eleven faktiskt gjort och vilka samtal som ägt rum. Ingen tackreplik eller igenkänning utan sparad grund.

Historiskt motiverade förändringar kan ersätta äldre miljötillstånd, men övergången ska vara avsiktlig och begriplig. Bestående betyder inte att allt måste stå oförändrat genom ett århundrade. Återblickar och spelets fiktiva kontinuitet ska skiljas från historiska samtidighetspåståenden.

## Kapitel 3: detta får inte försvinna i ombyggnaden

- De två befintliga ryska lägren och deras vakter: norr om Barnhuset och väster om Tryckeriet/vid stranden. Kartplaceringarna är spelgestaltning, inte belagda historiska adresser.
- Hattar och mössor med olika uppfattningar, böndernas ankomst/marsch, soldaternas reaktioner och David på Marstrand.
- Den långsammare, oroligare stad som Anders beskriver jämfört med ettan och tvåan. Bevara upplevelsen hos invånarna; använd den inte som skäl att göra elevens egen förflyttning onödigt långsam.
- Nya och ändrade repliker när krisens tidsläge förändras.
- Sidoäventyret Den stängda gården enligt KAPITEL3_MANUS.md. Detta är fortfarande manus, inte implementerad spelkod. Kopplingen till tvåans lagade täcke förutsätter verklig sparad sidostatus när båda byggs.

**Teknisk risk som måste hanteras:** I base/chapter3-street-life.js beror lägervakternas synlighet nu på `step()>=9`; andra aktörer styrs också av uppdragssteg. När frågor flyttas till andra hus och får nya provrundor får dessa villkor inte ligga kvar oförändrade. Världsfaserna behöver egna namngivna flaggor. Behåll det berättelsemässiga skeendet men byt kopplingen, annars kan lägren utebli, dyka upp för tidigt eller återkomma fel.

Besöksordning och berättelsetid måste gå att förstå utan ett nytt komplicerat nät av leveranser. En tidigare händelse kan visas som daterad återblick; staden ska inte automatiskt vridas tillbaka av ett gesäll- eller mästarprov.

## Kapitel 4: befintligt innehåll att bygga vidare på

**Nya tider, nya tankar** har redan följande innehåll i projektets grundkod:

| Kunskapsområde | Befintlig huvudmiljö | Innehåll att bevara och kartlägga till de aktuella fråge-id:na |
| --- | --- | --- |
| Att läsa | Kyrkan, Olof | Läskunnighet, kyrkans roll och katekesen. |
| Att skriva och granska | Tryckeriet, Brita | Tryckfrihet, censur och offentlighetsprincipen. |
| Att undersöka världen | Vetenskapens hus, Sam | Linné, Celsius, Scheele, undersökningar och Vetenskapsakademien. |
| Potatis och nya användningar | Byn, Sigrid | Eva Ekeblad, potatisens ursprung och användningar. |

Tabellen är ett planeringsunderlag från base/chapter4-content.js. Den ersätter inte inventeringen av den omarbetade recall-bankens sammansatta uppgifter. Samtliga befintliga kunskapskrav ska fortsätta vara obligatoriska.

I base/chapter4-street-life.js finns bokhandlare, lärare, naturforskare, tidningsläsare, apotekarlärling, odlare, historiska forskargestalter och flera vardagsroller. Bönder från Dalarna förekommer i en uttryckligen dramatiserad fortsättning med potatisodling. Gråkoltarna bidrar med ett annat perspektiv på tro och makt. Där är RUSSIAN_CAMPS tom: fyran använder redan en annan stadsstämning än trean. Denna kontrast ska utvecklas, inte ersättas med en identisk standardstad.

Fyran behandlar händelser från olika år. Forskarporträtt och politiska förändringar måste få begriplig tidsmärkning. Ett nytt kapitel är inte automatiskt en exakt dag direkt efter det föregående.

## Fyrans befintliga sidoäventyr: Cajsa Wargs kokbok

**Behåll hela kedjan, inte bara föremålet:** Cajsa som gäst i berättelsen → kokboken hos Brita → leverans till Karin i Bostadskvarteren → Karin förbereder → eleven lämnar platsen → fest vid återbesöket.

Detta finns redan som separata sparade tillstånd i base/chapter4-sidequest.js: `unfound`, `carrying`, `delivered`, `feast`. Leveransen ska inte ensam eller genom två klick i samma rum omedelbart starta festen. I den kontrollerade koden äger festen rum i Bostadskvarteren, inte i Byn. Flytta inte platsen av misstag när manuset skrivs om.

Festen, gästerna och de ändrade replikerna är en följd av hjälpen. De är inte provpoäng, betalning eller bevis för att barnet har lärt sig historien. Uppdraget ska förbli frivilligt; alla kunskapsfrågor ska gå att klara utan kokboksleverans.

## Arbetsförslag för fyrans upplevelse

Låt eleven märka kontrasten: vardagsärenden, läsning och undersökningar ersätter treans militära prägel. Människor tittar på tryckta blad, bär korgar, undersöker växter och arbetar på odlingen. Mycket finns redan i rollernas grundkod; nya animationer ska inte utlovas som färdiga utan kontroll.

Karin kan få en sammanhängande fiktiv utveckling: skicklig sömmerska i tvåan, försiktigt gästfri efter gårdsuppdraget i trean och värd för måltiden i fyran. Återkoppling till täcket eller gården används bara om respektive sidouppdrag faktiskt genomförts. Kokboksuppdraget fungerar även för den elev som hoppat över de tidigare sidoäventyren.

Små arbetsytor vid huvudmiljöerna kan göra lärlingsbesöken konkreta, exempelvis undersöka växtdetaljer eller jämföra ett mätvärde. De ska inte bli en andra uppsättning obligatoriska långa sidouppdrag. Gesäll- och mästarbesök har korta, uttalade provintroduktioner. Ingen generisk vagn behöver läggas ovanpå fyrans kokboksäventyr enbart för att händelsemotorn kan visa den.

## Kontroller före framtida spelpublicering

- Treans läger, vakter och folksamlingar visas vid avsedda berättelsefaser även när provordningen ändras.
- Skillnaden i invånarnas tempo och stadens stämning jämförs visuellt mellan kapitlen. Att bara behålla en konstant i koden räcker inte som verifiering.
- Ett provomförsök, kapitelåterbesök, omladdning och export/import återställer inte genomförda sidoäventyr.
- Kokboken kan levereras, förberedelsen spelas och festen uppstår vid rätt återbesök, även om tidigare nya sidoäventyr inte gjorts.
- Personer tillskriver aldrig eleven hjälp som inte finns i sparningen.
- Händelser avbryter inte prov, aktiva samtal eller känsliga berättelsescener. Frågor i dem hämtas ur tidigare kapitel och redan mött aktuellt innehåll.
- Spel-/lärarsparning, vägar, byggnadsplacering, djur, tryckpress och tidigare frågor kontrolleras mot föregående version.
- Reducerad rörelse och tangentbord fungerar; inget viktigt innehåll kräver jakt på en rörlig person.

**Ovanstående är framtida acceptanskrav, inte genomförda testresultat.**

## Kontrollerade projektkällor

- base/chapter3-street-life.js: aktörer, läger och stegkopplad synlighet.
- base/world-life-ch3.js: rörelse- och personsystemet.
- KAPITEL3_MANUS.md: föreslagen ombyggnad av trean, berättelseflaggor och gårdsäventyr.
- base/chapter4-content.js: fyrans innehåll och befintliga platsfördelning.
- base/chapter4-street-life.js: forskare, vardagsfolk, odlande bönder och frånvaro av läger i fyran.
- base/chapter4-sidequest.js: kokbok, förberedelse, fest och befintlig separat sparning.
