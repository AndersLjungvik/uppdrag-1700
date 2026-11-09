# Hatthandeln · 2.16.1

Hatthandlaren har ett litet bord vid torget i kapitel 1–5. Klicka på handlaren eller bordet, välj Hatthandeln eller tryck mellanslag nära handlaren. Från en annan plats går spelaren dit längs en gångbar väg innan butiken öppnas. Köp kräver fysisk närvaro; från ett rum går det inte att handla på distans.

| Hatt | Pris |
| --- | --- |
| Min gamla hatt | Finns från början |
| Grön mössa | 2 daler |
| Röd mössa | 2 daler |
| Svart trekantshatt | 4 daler |

Ett köp tar på den valda hatten direkt. Ägda hattar kostar inget att byta mellan, varken hos handlaren eller via Mina hattar. Otillräcklig kassa ger ingen skuld och inga varor; upprepade klick debiterar inte en redan ägd hatt. Huvudbonaden syns på spelaren både på kartan och i rummens närbilder. Stadsbornas utseenden påverkas inte.

Garderoben sparas i `uppdrag1700.wardrobe.v1` genom integrationens vanliga sparadapter. Den följer med mellan kapitel inom samma spelomgång och ingår i vanliga sparfiler. Elevläge, lärarvy och separata omspelningar har egna namnrymder. Hattarna ändrar inga äpplen, frågor, svar, stämplar eller rörelseegenskaper. Inget påstående görs om att den kosmetiska belöningen i sig förbättrar lärandet.

Butiken använder en vanlig dialog för varuval. Den befintliga världsmotorn styr förflyttning och ritordning. Köp pausas under annan interaktion. Ett faktiskt samtal med handlaren ger samma sociala skydd mot tjuven som andra stadssamtal; garderoben på distans är inget sådant skydd.

`node docs/spel/tests/hat-shop.cjs` kontrollerar köp, dubbelklick, återinträde, ägarvalidering, kostnadsfria byten, sparning, källankare för alla fem kapitel, verkligt gångbara butikslägen och vägar, fysisk närvaro, socialt skydd och bevarade kunskapsresultat. Båda tidigare delade klasslänkarna använder samma butik och behåller tillgång enbart till kapitel 1–2.
