# Hatthandeln · 2.16.3

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

`node docs/spel/tests/hat-shop.cjs` kontrollerar köp, dubbelklick, återinträde, ägarvalidering, kostnadsfria byten, sparning, källankare för kapitel 3–5, verkligt gångbara butikslägen och vägar, fysisk närvaro, socialt skydd och bevarade kunskapsresultat. Butiken introduceras först i kapitel 3, där Hattarna och Mössorna behandlas i innehållet. Varorna är kosmetiska huvudbonader och ges inga politiska partiegenskaper. Båda tidigare delade klasslänkarna behåller tillgång enbart till kapitel 1–2 och visar ingen butik. Äldre inköp finns kvar i sparningen och blir tillgängliga i senare kapitel.
