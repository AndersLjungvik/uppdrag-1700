# Miljöljud · version 2.9.0

Miljöljuden hör till den befintliga pappersvärlden. De följer platsen och växlar mjukt när spelaren går in, går ut eller reser. De är egna procedurala ljudskisser, inte historiska inspelningar. Inga ljudfiler hämtas från externa tjänster.

| Miljö | Ljud |
| --- | --- |
| Staden | Pauser mellan sparsamma vagnsljud, fåglar och fotsteg; ingen jämn vind- eller brusmatta |
| Nära kajen och öarnas hamnar | Vågor, enstaka måsar och träknarr; avtar när spelaren går inåt land |
| Båtresan | Vågor och sparsamt knarr från trä och måsar; inget separat vindbrus |
| Tryckeriet | Oregelbundna träpresslag, knarr och pappersprassel |
| Verkstäderna | Dämpade hammarslag och trä |
| Byn | Fåglar och fotsteg med pauser mellan ljuden |
| Kaffehus, hushåll och Barnhus | Lågmäld eld och enstaka träknarr |
| Arkiv, vetenskap, slott, kyrka och fästning | Enstaka prassel med tysta pauser |

Det jämna syntetiska vind- och sorlbruset används inte i den nya mixen. De korta ljuden och spelets befintliga djurrepliker behålls. Inga extra djurläten läggs ovanpå.

Havsmiljön har full styrka inom 140 kartenheter från hamnens riktiga navigationspunkt, tonas mjukt mellan 140 och 500 och är tyst längre inåt land. Detta gäller även Marstrand och kolonin. Kajens närbild och båtresan ger full havsmiljö; inomhus blir den tyst. Vågornas ljudfas och måsarnas schema startas inte om vid varje positionsuppdatering. Pågående måsljud tonas också bort.

Fotsteg hörs vid faktisk rörelse utomhus. En planerad men stillastående väg, ett miljöbyte eller en teleport ger inga steg. Mellan miljöerna tonas ljudlagren över ungefär en sekund. En rumsövergång startar inga extra parallella ljudmotorer.

Ljud är av vid första öppningen. Knappen **Ljud av / Ljud på** ovanför spelet styr på/av; menyn har ljudstyrka 0–100 procent. Webbläsaren startar ljud efter ett avsiktligt klick eller tangenttryck. Ett tidigare påslaget ljud väntar också på en ny gest vid en ny sidöppning; en gest inne i spelets iframe fungerar. Inställningen sparas för enheten, separat från elevomgångar, provsvar, stämplar, resurser och export/import.

Vid samtal dämpas ljudet till 32 procent av grundnivån, vid läsning/arbete till 12 procent och vid taluppläsning till 1,5 procent. Inställd volym tillämpas dessutom. Miljöljuden pausas när fliken döljs eller sidan lämnas. Återkomst och snabb av/på får inte skapa dubbla ljudlager eller en gammal fördröjd avstängning. Ljudstödet faller bort lugnt i webbläsare som saknar AudioContext; spelet fortsätter fungera.

Toppljudknappen har fast bredd. Dess tillståndsbyte ska inte ändra spelrutans storlek eller flytta kameran. Ingen ändring görs i världens rörelseloop, personplacering, dialogmanus eller frågebank.

## Kod och verifiering

- `ambient-audio.js`: ljudskisser, ljudlager, nivåer, mjuka övergångar, schemaläggning och livscykel.
- `ambient-scene.js`: läser världens lexikala tillstånd inne i iframe utan att skriva speldata. Förmedlar en betrodd användargest till den yttre ljudmotorn.
- `ambient-controls.js`: knapp, ljudstyrka och koppling mellan miljöläsare och ljudmotor.
- Integrationen laddar ljudmiljöläsaren i alla kapitel. Elevsparningens namnrymd behålls. Publiceringen gäller endast `docs/spel-test/` på main; PR 4 förblir draft.

`npm run test:ambient` kontrollerar deterministiska, ändliga och avtonade ljuddata med marginal till klippning; inget automatiskt ljud före opt-in; sparad inställning; en enda ljudmotor; övergångar och begränsade röster; läs-/samtals-/uppläsningsdämpning; volym; dold flik och återkomst; snabb av/på; sent återupptaget ljud efter avstängning; faktisk ljudsignal i Chromium; platser, båtresa, gradvis hamnljud och tystare inland på öarna; mobil/tangentbord; oförändrad spelruta och elevdata; navigation mellan kapitel; samt webbläsare utan ljudstöd. Fysisk iPhone/Safari ingår inte i Chromium-kontrollerna.
