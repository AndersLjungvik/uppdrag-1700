# Miljöljud · version 2.7.0

Miljöljuden hör till den befintliga pappersvärlden. De följer platsen och växlar mjukt när spelaren går in, går ut eller reser. De är egna procedurala ljudskisser, inte historiska inspelningar. Inga ljudfiler hämtas från externa tjänster.

| Miljö | Ljud |
| --- | --- |
| Staden | Svag vind och avlägset sorl; sparsamma trä-/vagnsljud och fåglar |
| Kajen och öarnas utomhusmiljöer | Vatten, vind, enstaka måsar och träknarr |
| Båtresan | Mer vatten och vind, sparsamt knarr från trä |
| Tryckeriet | Oregelbundna träpresslag, knarr och pappersprassel |
| Verkstäderna | Dämpade hammarslag och trä |
| Byn | Vind och fåglar |
| Kaffehus, hushåll och Barnhus | Lågmäld inomhusmiljö och eld |
| Arkiv, vetenskap, slott, kyrka och fästning | Mycket svag rumston och enstaka prassel |

Fotsteg hörs vid faktisk rörelse utomhus. En planerad men stillastående väg, ett miljöbyte eller en teleport ger inga steg. Mellan miljöerna tonas ljudlagren över ungefär en sekund. En rumsövergång startar inga extra parallella ljudmotorer.

Ljud är av vid första öppningen. Knappen **Ljud av / Ljud på** ovanför spelet styr på/av; menyn har ljudstyrka 0–100 procent. Webbläsaren startar ljud efter ett avsiktligt klick eller tangenttryck. Ett tidigare påslaget ljud väntar också på en ny gest vid en ny sidöppning; en gest inne i spelets iframe fungerar. Inställningen sparas för enheten, separat från elevomgångar, provsvar, stämplar, resurser och export/import.

Vid samtal dämpas ljudet till 32 procent av grundnivån, vid läsning/arbete till 12 procent och vid taluppläsning till 1,5 procent. Inställd volym tillämpas dessutom. Miljöljuden pausas när fliken döljs eller sidan lämnas. Återkomst och snabb av/på får inte skapa dubbla ljudlager eller en gammal fördröjd avstängning. Ljudstödet faller bort lugnt i webbläsare som saknar AudioContext; spelet fortsätter fungera.

Toppljudknappen har fast bredd. Dess tillståndsbyte ska inte ändra spelrutans storlek eller flytta kameran. Ingen ändring görs i världens rörelseloop, personplacering, dialogmanus eller frågebank.

## Kod och verifiering

- `ambient-audio.js`: ljudskisser, ljudlager, nivåer, mjuka övergångar, schemaläggning och livscykel.
- `ambient-scene.js`: läser världens lexikala tillstånd inne i iframe utan att skriva speldata. Förmedlar en betrodd användargest till den yttre ljudmotorn.
- `ambient-controls.js`: knapp, ljudstyrka och koppling mellan miljöläsare och ljudmotor.
- Integrationen laddar ljudmiljöläsaren i alla kapitel. Elevsparningens namnrymd behålls. Publiceringen gäller endast `docs/spel-test/` på main; PR 4 förblir draft.

`npm run test:ambient` kontrollerar deterministiska, ändliga och avtonade ljuddata med marginal till klippning; inget automatiskt ljud före opt-in; sparad inställning; en enda ljudmotor; övergångar och begränsade röster; läs-/samtals-/uppläsningsdämpning; volym; dold flik och återkomst; snabb av/på; sent återupptaget ljud efter avstängning; faktisk ljudsignal i Chromium; platser och båtresa; mobil/tangentbord; oförändrad spelruta och elevdata; navigation mellan kapitel; samt webbläsare utan ljudstöd. Fysisk iPhone/Safari ingår inte i Chromium-kontrollerna.
