# Hatthandeln och invånarnas reaktioner · 2.20.0

Hatthandlaren har ett litet bord vid torget i kapitel 3–5. Bordet är en liten bordsskiva sedd rakt uppifrån, intill torgets nordvästra kant. Träets ådring, mössornas ovansidor och trekantshattens brätte följer kartans perspektiv. En liten skylt sitter vid bordets kortända. Handlaren står utanför torget och spelaren stannar på insidan, med bordet mellan dem. Klickytan följer bordsskivans storlek och vinkel. Klicka på handlaren eller bordet, välj Hatthandeln eller tryck mellanslag nära handlaren. Från en annan plats går spelaren dit längs en gångbar väg innan butiken öppnas. Köp kräver fysisk närvaro; från ett rum går det inte att handla på distans.

| Hatt | Pris |
| --- | --- |
| Min gamla hatt | Finns från början |
| Grön mössa | 2 daler |
| Röd mössa | 2 daler |
| Svart trekantshatt | 4 daler |

Ett köp tar på den valda hatten direkt. Ägda hattar kostar inget att byta mellan, varken hos handlaren eller via Mina hattar. Otillräcklig kassa ger ingen skuld och inga varor; upprepade klick debiterar inte en redan ägd hatt. Huvudbonaden syns på spelaren både på kartan och i rummens närbilder. Stadsbornas utseenden påverkas inte.

Garderoben sparas i `uppdrag1700.wardrobe.v1` genom integrationens vanliga sparadapter. Den följer med mellan kapitel inom samma spelomgång och ingår i vanliga sparfiler. Elevläge, lärarvy och separata omspelningar har egna namnrymder. Hattarna ändrar inga äpplen, frågor, svar, stämplar eller rörelseegenskaper. Inget påstående görs om att den kosmetiska belöningen i sig förbättrar lärandet.

Butiken använder en vanlig dialog för varuval. Den befintliga världsmotorn styr förflyttning och ritordning. Köp pausas under annan interaktion. Ett faktiskt samtal med handlaren ger samma sociala skydd mot tjuven som andra stadssamtal; garderoben på distans är inget sådant skydd.

`node docs/spel/tests/hat-shop.cjs` kontrollerar köp, dubbelklick, återinträde, ägarvalidering, kostnadsfria byten, sparning, källankare för kapitel 3–5, verkligt gångbara butikslägen och vägar, fysisk närvaro, socialt skydd och bevarade kunskapsresultat. Butiken introduceras först i kapitel 3, där Hattarna och Mössorna behandlas i innehållet. Invånarna kan nu tolka huvudbonaden på olika sätt; ett byte är inte ett politiskt medlemskap. Båda tidigare delade klasslänkarna behåller tillgång enbart till kapitel 1–2 och visar ingen butik. Äldre inköp finns kvar i sparningen och blir tillgängliga i senare kapitel.


## Reaktioner på gatorna · 2.20.0

I kapitel 3–5 reagerar utvalda invånare på den huvudbonad spelaren faktiskt har på sig. Den gamla hatten är neutral. Den röda och gröna mössan bemöts lika; färgerna är inga ytterligare partier.

| Invånare | Trekantshatt | Mössa |
| --- | --- | --- |
| Ryska lägervakter i treans sena scen | Ryter till, misstänker krigsiver | Mjukare röst och lugnare ord |
| Hattarnas anhängare | Välkomnar en förmodad meningsfrände | Skeptisk kommentar |
| Mössornas anhängare | Misstänker krigsprat | Välkomnande hälsning |
| Bönderna under treans uppror | Frågar om ännu ett dyrt krig | Bjuder in spelaren att lyssna |
| Barn, arbetande stadsbor och bokfolk | Egna kommentarer om fin klädsel, vind eller arbete | Egna kommentarer om värme, arbete eller likhet |
| Adelsmannen vid äppelträdet | Inställsam om hatten, misstänksam mot bönder | Misstänksam kommentar om mössa och bönder |

Adelsmannen muttrar om bönder som stjäl även inför den gamla hatten. Spelaren kan fråga om han faktiskt sett någon stjäla. Påståendet är karaktärens fördom, inte berättarens fakta om bönder. Äppelträdets verkliga ägare kan mötas utan att plocka. Han stannar under hälsningen och återupptar sin patrull när spelaren går vidare. Under en äppeljakt eller återtåg har jakten företräde.

Hälsningarna använder stadens befintliga pappersbubblor och gång-/samtalsregler. De vanliga samtalen fortsätter efter huvudbonadskommentaren. Det går att gå förbi utan att klicka sig igenom dialog. Garderoben pausar kommentarerna; en ändrad typ av huvudbonad får en ny reaktion efter en kort paus. Samma utseende kan inte kringgå talpausen genom att bara växla mössans färg. Frågebank, bedömning, poäng och sparnycklar ändras inte.

Bönderna som odlar potatis i fyran och femman behandlas som arbetande stadsbor och är inte en fortsättning på treans uppror. Inga nya ryska soldater läggs till i andra tidsskeden. Inga historiska personer tillskrivs ny dokumenterad dialog.

Historisk grund: [Historiska museet, Frihetstiden och upplysningens påverkan](https://historiska.se/utforska-historien/kunskapsbank/intro-till-nyare-tid/) beskriver partiernas olika utländska allianser. [Uppsala universitet, Linné, idéerna och historien](https://www.uu.se/om-uu/historia/carl-von-linne/linne-online/linne-ideerna-och-historien) beskriver hattarnas offensivare politik mot Ryssland. De konkreta soldaternas reaktion på spelarens kläder är en dramatiserad spelmekanik, inte ett belagt historiskt beteende. Samtalen gör därför misstolkningen möjlig att bemöta.

`node docs/spel/tests/hat-reactions.cjs` provar skillnaderna, att färgerna inte skapar partier, de tre verkliga gatumanusen efter adapterkedjan, bevarade ordinarie repliker, huvudbonadsbyte, spontana hälsningar, samtal och äppeljakternas företräde. Hatthandelns och äppeläventyrets befintliga kontroller gäller fortfarande.
