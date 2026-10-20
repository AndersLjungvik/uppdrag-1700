# Uppdrag 1700 · Pappersstaden

## Kapitel 5 – Gustavianska tiden (lärarförhandsvisning, 20 oktober 2026)

[Provspela kapitel 5](https://andersljungvik.github.io/uppdrag-1700/demo3/chapter5-pilot.html?v=2&preview=1). Den vanliga länken [kapitel 5](https://andersljungvik.github.io/uppdrag-1700/demo3/chapter5-pilot.html?v=2) kräver att eleven har avslutat kapitel 4 i **samma webbläsare**. Kapitel 2–4 har nu också lokala spärrar som kräver föregående kapitel; repetitioner bakåt är tillåtna. `preview=1` är en utvecklingsgenväg och **inte säker lärarinloggning**. Använd inte fristående förhandsvisningslänkar som elevdistribution innan en autentiserad klassvis upplåsning finns.

Kapitel 5 bygger på **SOS Historia 4–6 grundboken s. 81–85, arbetsboken uppgift 16–17**. 16 källanknutna fakta återkommer i 49 frågor i tre nivåer (lärling, gesäll, mästare) genom 12 arbetsbesök. Maja introducerar ett nytt kungligt besked. Elin granskar statsvälvningen och maktfördelningen i Riksdagshuset, Amira diskuterar kungliga reformer på Slottet, Brita rättar tryckblad, och Olof förklarar de begränsade förändringarna för människors rättigheter. Daler används endast till ledtrådar och Rut ger äpplen för en ny chans. Eleverna ser inga provhänvisningar eller ordförklaringar som kan avslöja svaret.

**Marstrand:** Carlstens straffarbete visas med en fiktiv fånge, en fångvaktare och en stenhuggare. David Hedenquist finns som explicit dramatiserad *återblick till 1743*, inte som obelagd levande person under Gustav III:s regering. Under frihamnsperioden möter spelaren de dokumenterade invandrarna Moses och Bela Salomon, vars familj kom från Hamburg år 1779, och hamnarbetare och hantverkare. Källor: [Bohusläns museum om Marstrands judiska historia](https://www.bohuslansmuseum.se/kunskapsbanken_bohuslans_historia/hit-seglade-judarna/) och [Statens fastighetsverk om Carlsten](https://www.sfv.se/vara-fastigheter/sverige/vastra-gotalands-lan/carlstens-fastning-marstrand). Inget påhittat personnamn knyts till en obelagd benådning av Gustav III; Lasse-Maja hör till en senare tid.

**Frivilligt sidoäventyr:** En uppdiktad dömd förfalskare lämnar ett brev som spelaren bär från Carlsten till hamnen. Leveransen sparas och syns därefter i miljön, men påverkar inte den egentliga kunskapsträningen, pengar eller låsning av kapitel. Den tidigare kokboksfesten bevaras vid fortsatt spel om den redan har genomförts.

Teknisk kontroll: alla 12 kunskapsstationer har öppnats programmatiskt och de 16 faktasvarens distraktorer har kontrollerats. En simulerad 3-minuterspromenad på båda kartorna (451 mättillfällen per karta) fann inga överlappande personer under 37 världskoordinatenheters centrumavstånd. Det är ingen ersättning för visuell webbläsar- eller elevtestning. Nya kontroller finns i `scripts/chapter-pilot-safety.test.mjs`.

**Status för elevåtkomst (20/10):** Kapitel 4 är fortfarande en fristående utvecklingspilot. Den kan öppnas via webbadressen även utan avklarade tidigare kapitel. Den ska alltså ännu inte delas som elevversion innan både kapitelframsteg och lärarstyrd upplåsning fungerar. Detta är en medvetet dokumenterad kvarstående spärr, inte en genomförd funktion. Bakåtåtkomst och repetition ska finnas kvar. Stadens gångtrafik har nu fått en korrigerad väjningskoppling och separata promenadstråk; den gemensamma kontrollen med 31 figurer och 451 simuleringstillfällen fann inga närpassager under testgränsen, men behöver fortfarande speltestas visuellt.

## Kapitel 4 – Nya tider, nya tankar (fristående pilot)

**Uppdatering 20 oktober: kontinuitet, integritet och vardagsliv.**
Samma fasta rollista i hela kedjan: Maja (kaffehuset), Brita (tryckeriet), Elin (riksdagen), Jo (kajen), Olof (kyrkan), Siri (Barnhuset), Rut (arkivet), Amira (slottet). Kapitel 3:s tillfälliga namn Lars och Erik har korrigerats i repliker, uppdragskedja, rörelsekod och figurer. I kapitel 4 är Cajsa Warg en separat gäst hos Siri och har en egen figur.

**Eleverna ska aldrig se provunderlagets ursprung.** Inga referenser till provfrågor, uppgiftsnummer, bedömningsstöd eller facit visas på arbetsbladen eller i ”Läs mer”. Metadata behålls enbart i koden för lärarens källgranskning. ”Förklara ord” i pågående återkallning är borttaget eftersom det i vissa fall visade det rätta svaret; högläsning finns kvar. Två formuleringar som nämnde det sökta begreppet och frågor som nämnde klassens prov har rättats.

**Valutor har nu skilda funktioner i kapitel 1–4.** Daler används enbart till ledtrådar. Äpplen används enbart för en ny chans efter misslyckad arbetsomgång och tjänas bara genom repetition hos Rut. Ingen gammal knapp kan längre växla valutan på fel sätt. Sparnycklar och äldre framsteg är oförändrade.

**Mer liv ute:** Kapitel 4 har hela det ursprungliga djurlivet (båda hundarna, alla höns och betesdjuren), tretton återkommande stadsbor och tjugo ytterligare interaktiva personer med skilda promenadrytmer och samtal. Talbubblorna får ingen understrykning vid mellanslag; tangentbordsfokus på ett tankealternativ syns som en diskret pappersmarkering.

**Kvalitetskontroll:** Simulerade kunskapspass har verifierat dalerledtråd, misslyckat svar, stoppad daleromgång och nytt försök mot ett äpple. Tre genomförda återkallningar hos Rut gav ett äpple. Samtliga sjutton kapitel 4-fakta gav återkoppling utan läckande källhänvisningar. De tjugo tillagda personerna klarade rit- och dialogkontroller. Nytt regressionstest `scripts/chapter-pilot-safety.test.mjs` ingår i `npm test`. Dessa kontroller är programbaserade; full visuell kontroll i elevens webbläsare återstår.


[Spela kapitel 4 i den befintliga pappersstaden](https://andersljungvik.github.io/uppdrag-1700/demo3/chapter4-pilot.html?v=5). Fortsättningen från [kapitel 3](https://andersljungvik.github.io/uppdrag-1700/demo3/chapter3-pilot.html?v=5) har egna sparningar, men tar med daler och äpplen från avklarade tidigare kapitel. Spelet börjar hos Maja och går vidare via Brita i Tryckeriet, Olof i Kyrkan, Sam i Vetenskapens hus och Sigrid i Byn. Samma nivåer – lärling, gesäll, mästare – och återbesök hos Rut ger återkallning med stöd i kapitlets befintliga faktabank.

Kapitel 4 har 17 kontrollerade kunskapsfakta i 47 återkallningar under 12 arbetsbesök. Teman: tryckfrihet, censur, offentlighetsprincip, läsundervisning, Linné, Celsius, Scheele, Eva Ekeblad och vetenskap. Godkända stadens geometri och interiörer är återanvända. Streckad dekorkant på pratbubblorna är borttagen och hundarna rör sig långsammare och vänder vid hinder. Fristående pilot: kodsyntax, svarsalternativ och programmatiskt öppnande av alla 12 arbetsbesök har kontrollerats; visuell bläddring i riktig webbläsare återstår.


**Kapitel 4, lugna staden och kokboksfesten (20/10).** Efter kriget är de två ryska lägerplatserna nu en liten botanisk äng i väster och potatisodling norr om Barnhuset. Carl von Linné beskriver växter, Celsius undersöker temperatur, Eva Ekeblad talar med odlande bönder och Elisabet Nilsdotter berättar vid kyrkan om gråkoltarnas tro och förföljelse. Inget av samtalen är extra provfrågor. Nutida repliker är dramatiseringar, inte citat från historiska personer. Elisabets eventuella titel som soldathustru har inte belagts och finns inte i spelets faktatext.

**Frivillig sidohändelse:** Cajsa Warg besöker Barnhuset och nämner sin kokbok från 1755 (ett fiktivt besök, inte dokumenterad anställning). Brita har ett exemplar i Tryckeriet. Spelaren kan hämta det, lämna det till den unga hushållerskan Karin i Bostadskvarteren, gå ut och återvända. Då har Karin och grannarna ordnat fest med mat efter boken. Den fysiska boken syns som ett ärende i packningen. Sparningen är separat och uppdraget ger inga daler, inga stämplar och påverkar inte kapitelproven. Att uttryckligen börja om hela kapitel 4 nollställer även denna sidoberättelse.

**Kontroll:** Nya skript passerar syntaxkontroll; kapitelarbetena och frågornas rätta alternativ kontrollerades tidigare. För kokboken har hämtning, omöjlig förtida leverans, överlämning, återbesök och sparning mellan omladdningar testats. Normalt hushåll och festversion kan renderas i canvastest. Fullt visuellt speltest i en riktig webbläsare och elevprovning återstår.

## Tidigare huvudprojekt: Demo 3.21

[Öppna Demo 3.21 – Sammanhängande kapiteluppdrag](https://andersljungvik.github.io/uppdrag-1700/demo3/living-world.html?v=3.21.0).

**Nytt i 3.20: trettio namngivna kapitelarbeten.** Varje befintlig nivå har en beställning, ett arbetsblad och ett resultat som hör till just dess frågor. Uppdragsboken visar lärlings-, gesäll- och mästararbetet i det valda avsnittet. De 139 frågorna, deras svar, källhänvisningar och kapitelordning är bevarade; beskrivningarna av arbetena är spelberättelse.

Arbetsarket används efter undervisningen om kapitlet. Kortsvar börjar utan svarsalternativ. Vid byggsvar får eleven först tänka på frågan och väljer själv när delarna ska visas, utan nedräkning. Ett pausat arbete återupptas efter en specifik fortsättningsreplik och en kort bekräftelse från personen.

Efter frågorna visas det färdiga bladet med nästa ärende och möjlighet att läsa de genomgångna svaren. Bladet finns kvar i uppdragsboken efter leveransen. Sammanställningen skiljer rätt första försök utan stöd från svar efter hjälp eller omförsök. Byggsvar med synliga delar räknas som stöd. För tidigare besvarade frågor i en äldre, påbörjad sparning visas att underlaget saknas; gamla totalsiffror används inte som om de gällde det nya passet. Stämplar och daler följer fortfarande den fysiska leveransen.

**Nytt i 3.19: inbjudningar som leder till bokens verkliga arbete.** Maja, Brita, Rut och Jo läser nu av aktuell beställning, hämtning, arbetsplats och leverans. När ett ärende väntar hos dem säger de det i sitt korta utomhussamtal. I rummet finns ärendet bland spelarens tankar; ett valt ärende blir tal innan arbetsarket öppnas.

**Nytt i 3.18: egna promenadrytmer och pappersvita seriebubblor.** Personerna går olika fort, tar olika långa pauser och vänder eller tittar sig omkring i egen takt. Små, mjuka sidoförskjutningar håller dem från en gemensam mittlinje inom den befintliga vägbanan.

I rummen ligger valen i en vit tankebubbla vid bildens nederkant. När spelaren väljer en tanke försvinner valen och den talade repliken visas i en rund pappersbubbla med en kort flik mot talaren. Inga namn, rubriker eller fortsätt-/avslutsknappar står i bubblorna. Klick på repliken, mellanslag eller Enter fortsätter; Escape eller ett tryck på miljön utanför bubblan stänger. Texten står mörk mot ljust papper, tydligt skilt från den varma spelmiljön.

**Piltangenterna styr gång; mellanslag pratar, väljer och fortsätter.** Ute kan spelaren gå fritt på land, med stopp vid hus, vatten och världens kant. Nära en person, ingång eller kaj används mellanslag för att interagera. I samtal väljer pilarna bland befintliga tankar och mellanslag bekräftar; under den korta utomhusrepliken stänger mellanslag bubblan. Mus och pekskärm fungerar fortfarande.

Efter ett samtal med Jo kan spelaren välja Kajen, även om pappersbubblan först stängts med mellanslag. Då går Jo med längs spelarens verkliga gångspår och stannar på kajen under besöket. Samma regel gäller när Maja, Brita och Rut följer till sina platser. Ett annat mål avslutar följet och personen går tillbaka längs sin färdväg. En redan påbörjad gemensam promenad kan styras vidare med piltangenterna.

Alla tretton namngivna samtalspersoner finns nu ute i världen. Maja promenerar vid kaffehuset, Brita vid tryckeriet, Rut vid arkivet och Jo på stadens väg ner mot kajen, tillsammans med de nio tidigare förbipasserande. De fyra huvudpersonerna är samma personer ute och inne; en kort presentation ute sparar bekantskapen för nästa möte.

Människorna och spelaren ses ovanifrån. De går längs vägarna med små, lugna steg och vänder sig i färdriktningen. Vid ett möte vänder de sig mot varandra. Kartfigurerna har pappersmaterial och lågmäld rörelse; rummens större porträtt är bevarade.

Klicka på en person för att gå fram. Spelaren säger **Hej!**, och personen svarar med en kort replik i en sammanhängande, utklippt pratbubbla av papper. Liv säger: ”Tänk att de dödade kungen! Varför just på maskeraden?” Ingen namnrubrik, ”funderar”-etikett eller meny visas. Du kan gå vidare genom att trycka på vägen eller välja nästa plats; ett klick på bubblan stänger också. Repliken försvinner inte av sig själv medan du läser. De tolv temana från den tidigare SOS-banken finns kvar. Fyra vardagsrepliker har lagts till för huvudpersonerna. En direkt rumsankomst efter ett samtal ute räknas som samma möte, utan en ny hälsning direkt i dörren.

Hundar går och viftar på svansen, höns går och pickar, och får och kor rör sig i hagen. Alla rörelser använder världens befintliga bildloop och respekterar minskad rörelse. Kartans mått, vägar, inredning, dörrar och båtfärder behåller sin befintliga grund.

Maja, Brita, Rut och Jo behåller sina vanliga samtalsämnen, sparade bekantskaper och högst en hälsning per besök. Ruts dokumentövning finns kvar. Se [aktuell utvecklingsstatus](docs/demo3/STATUS.md) för aktiva filer, senaste beslut och verifiering. [Demo 3.12.1](https://andersljungvik.github.io/uppdrag-1700/demo3/conversations.html?v=3.12.1) och [Demo 3.11](https://andersljungvik.github.io/uppdrag-1700/demo3/known-people.html) är bevarade. Den allmänna adressen `/demo3/` öppnar fortfarande den äldre världsdemon.

### Kapitlens arbete i den levande världen

Bokens befintliga tio kapitel och tre arbetsnivåer per kapitel används utan en ny frågebank. Beställning, underlag, arbetsfrågor, kartjämförelse, provtryck, godkännande och slutleverans sker på sina riktiga platser. Det går också att resa till Marstrand och Saint Barthélemy för de uppdrag som kräver det. Forskarbladen läses med Sam i den befintliga scenen Vetenskapens hus; någon ny trädgårdsmiljö har inte ritats.

**Uppdragsboken** visar det aktuella ärendet och vägen till nästa plats. Efter lärlingsarbetet kan spelaren göra det befintliga kapitelprovet för att öppna nästa kapitel. Gesäll- och mästararbetena går att göra före eller efter detta. Upplåsta kapitel och tidigare slutförda arbeten går att återvända till. En hälsning, en läst inbjudan eller en vald gångväg ändrar aldrig arbetsprogressionen.

På arbetsarket finns samma rättning, bokhänvisningar, ledtrådar och kontrollerade svarsalternativ som i huvudversionen. Rut erbjuder repetition av fakta som spelaren faktiskt har mött. Escape pausar arbetet; svar, visade alternativ, ledtråd och återkoppling finns kvar när arbetet återupptas. Även ett oskickat kortsvar sparas medan man skriver. Arbetskontrollerna ligger på arket, medan pratbubblorna fortfarande innehåller enbart tal och tankar.

Pappersvärldens kapitelarbete sparas automatiskt för sig i samma webbläsare. Vid första starten kopieras en befintlig lokal sparning från den tidigare huvudversionen, om en sådan finns. Den äldre versionens sparning och kontosparningar ändras inte. Bekantskapen mellan spelaren och de fyra huvudpersonerna använder fortfarande sina befintliga gemensamma minnen.

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

