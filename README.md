# Uppdrag 1700 · Pappersstaden

## Aktuell arbetsversion: Demo 3.13

[Öppna Demo 3.13 – En levande pappersvärld](https://andersljungvik.github.io/uppdrag-1700/demo3/living-world.html?v=3.13.0).

De tolv öppna reflektionsfrågorna från spelets tidigare SOS-bank finns nu i frivilliga samtal, placerade hos personer där ämnet passar. Spelaren väljer en tanke, ställer frågan och kan gå vidare med motfrågor och följdfrågor. Nio nya människor har också kort småprat. Två hundar rör sig längs vägarna; höns, får och kor ger liv åt landsbygden. Gemensamt pappersmaterial förenar personer, djur och inredning med samma mått, silhuetter och placeringar som tidigare.

3.12.1:s presentationer, bekantskaper och en hälsning per besök är kvar. Ruts dokumentövning, vägar, dörrar och båtfärder använder sin befintliga grund. Reflektionerna har inga poäng eller automatisk rättning.

Se [aktuell utvecklingsstatus](docs/demo3/STATUS.md) för aktiva filer, källor och verifiering. [Demo 3.12.1](https://andersljungvik.github.io/uppdrag-1700/demo3/conversations.html?v=3.12.1) och [Demo 3.11](https://andersljungvik.github.io/uppdrag-1700/demo3/known-people.html) är bevarade. Den allmänna adressen `/demo3/` öppnar fortfarande den äldre världsdemon.

## Den tidigare huvudversionen

[Spela den uppdaterade versionen](https://andersljungvik.github.io/uppdrag-1700/?v=0.6.0)

Ett pappersäventyr för historia i åk 6. Eleven går i staden, tar emot beställningar och hjälper invånarna genom bokens tio avsnitt. Varje avsnitt har tre uppdragsnivåer: **lärling, gesäll och mästare**. Stämplar visar avklarade uppdrag; de är inte betyg eller validerade mått på varaktigt kunnande.

## Innehåll och uppdrag

Den aktiva banken innehåller 139 rättningsbara frågor och 12 separata, öppna samtalsfrågor. Underlaget är enbart det uppladdade klassrumsmaterialet. Varje fråga har egna hänvisningar. [Bankens dokumentation](curriculum/README.md) och [täckningslistan](preparation/classroom-bank-coverage.md) visar även luckor och preciseringar. Inga frågor från den tidigare AI-banken läggs till i den aktiva banken.

Uppdragsboken visar beställningen, nästa ärende och stämplarna i alla avsnitt. Beställningen kommer före hämtningen och varje överlämning har en mottagare. Första tryckuppdraget går från Maja till Brita och Jo, vidare till provtryck, Majas godkännande, färdig upplaga och leverans till kaffehuset. Trycksvärta, papper och typer flyttas direkt från arbetsbordet till pressen; transporterade underlag finns i ryggsäcken.

De tio avsnitten kan slutföras i bokordning. Framtida platser öppnas med avsnitten. Eleven får återvända, prata och göra om tidigare arbetspass för ett nytt arvode. Uppdragsbokens avsnittsväljare låter läraren öppna det avsnitt klassen arbetar med, lokalt på enheten. Tidslinjen visas bara i staden. Tematiska avsnitt visar ett tidsintervall i stället för ett påhittat exakt händelseår.

## Läromästaren och hjälp

Läromästaren Rut finns i arkivet. Hon repeterar upp till sex faktafrågor som eleven faktiskt har mött, med prioritet för tidigare fel och frågor som behöver återkomma. Minst 70 procent rätt på första försöket utan nya svarsalternativ eller ledtråd ger **ett äpple och 1 daler per avslutat pass**. Eleven kan tjäna ett nytt äpple samma dag. Upprepning samma dag räknas däremot inte som en ny tidsmässigt utspridd återkallning i repetitionshistoriken.

Ett äpple kan ges för en extra ledtråd vid ett arbetsbord. Det dras bara en gång för den aktuella frågan. Ledtråden och att den använts följer med vid omladdning. Ett sådant svar markeras som stöd. Bokhänvisningar, återkoppling, svarsalternativ och nya försök är gratis. Färdiga sambandsdelar räknas som stöd. Eleven kan pausa ett uppdrag, tjäna ett äpple och återvända till samma fråga. Arbete kräver inte mat eller pengar.

## Sparning och ljud

Spelet sparar automatiskt i webbläsaren. Inställningarna kan hämta och läsa in en JSON-sparfil. Vid byte från den äldre banken bevaras pengar och föremål och den äldre kunskapsregistreringen arkiveras. Gamla yrkesnivåer räknas inte som besvarade nya frågor. Kunskapsrapporten skiljer mellan uppdragsstämplar och självständiga svar och kan hämtas som CSV.

Google-synkning är förberedd men inte aktiverad (`enabled: false`). Inloggning eller synkning utlovas inte; det lokala spelet fungerar utan dem.

Effekter startas genom ljudknappen. De omfattar papper, typer, trycksvärta, trä och tryckpress samt ett återhållsamt vattenljud vid kajen. Ingen musikfil ingår. Tal är frivilligt och använder en svensk systemröst när en sådan finns. Texten ligger kvar tills eleven går vidare. På små eller låga skärmar ligger dialogtexten i ett fält under scenen. Den talande karaktären har diskret rörelse; de andra står stilla. Inställningen för minskad rörelse respekteras.

## Bygga och kontrollera

```sh
npm run build
npm test
```

Ingen frontend-installation behövs för webbsidan. Testerna använder `@napi-rs/canvas` (lokal devDependency eller den tillgängliga runtime-versionen). Bygget skriver GitHub Pages-filer till `docs/` och en självständig elevfil till `dist/uppdrag-1700.html`. Den fristående filen innehåller samma bank, bilder, ljud och inbäddade moduler; Google-synkning är avstängd där.

Testerna kontrollerar hela uppdragskedjan, alla 139 frågor, sparningar, ledtrådskostnad, repetitionsbelöningar, källhänvisningar och de faktiska UI-handlarna. Rendering av scener kan granskas via canvas. Det ersätter inte manuell provning i elevens egen webbläsare, på mobil eller av högtalaruppspelningen.

`dist/classic.html` bevarar den äldre versionen separat. Gamla `/demo/`-länkar går vidare till den nya huvudversionen. Den äldre bankens filer behövs enbart för arkiverade sparningar och regressionstester.

