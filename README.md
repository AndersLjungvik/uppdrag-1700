# Uppdrag 1700: Den hungrige lärlingen

Ett buildless point-and-click-äventyr för historieundervisning i åk 6. Spelaren utforskar åtta handritade scener, väljer handlingar, pratar med personer, samlar föremål och använder kunskap om 1700-talet för att få arbete, pengar och mat. Varje standardjobb har fyra fria kortsvar och ett samband med färdiga delar.

## Innehåll och träning

Frihetstiden, tryckfrihet, vardagsliv, Linné, Gustav III, handel och upplysning. Ett jobb kostar ett mått mättnad och alla fem moment måste bli rätt i följd. Ett fel visar inte facit: arbetsgivaren stänger för speldagen, frågan hamnar i anteckningsboken och kan prövas igen nästa dag. En lyckad anställning ger daler och ett förseglat arbetsintyg. Bröd kostar tre daler och ger tre mått mättnad.

Framsteg sparas i localStorage i samma webbläsare på samma enhet. CSV-rapporten visar första försök, rätt, fel och stöd. Sambandsuppgifterna räknas alltid som stöd. Ingen central resultatinsamling eller identitetsverifiering finns; rapporten är ett övningsunderlag, inte betygsunderlag i sig.

## Styrning

Välj `Titta på`, `Prata med`, `Ta` eller `Använd` och klicka på ett hotspot i scenen. Klick på marken flyttar figuren. Föremål väljs i ränseln och används sedan på något i scenen. Klicka på bröd en andra gång för att äta. `M` öppnar kartan och `Escape` stänger samtal eller menyer.

## Filer

`dist/index.html`, `dist/style.css`, `dist/curriculum.js`, `dist/game.js` är webbversionen. `dist/uppdrag-1700.html` är en fristående elevfil, genererad med `node scripts/build-offline.mjs`. Den kör utan nätanslutning. Skolans regler för att öppna lokala HTML-filer måste provas på elevdatorn.

Canvasbilder skapas i kod; inga externa typsnitt, bilder, bibliotek, API:er eller telemetri används. Historiska källor finns i lärarmenyn. Den grafiska miljön, personerna och berättelsen är fiktiva. Frågebanken är avsiktligt tillfällig medan spelarkitekturen provas.


## GitHub Pages

Webbversionen ligger i `docs/`. I repots **Settings → Pages**, välj **Deploy from a branch**, grenen **main** och mappen **/docs**, och spara. GitHub visar den spelbara länken när publiceringen är färdig.

Alla resurslänkar är relativa och fungerar därför under GitHub Pages projektadress. Vid flytt från en annan webbplats börjar framstegen om: webbläsaren sparar separat för varje webbplats.

## Utveckla och kontrollera

Kräver Node.js 20 eller senare. Själva spelet behöver inga installerade paket.

```sh
npm install
npm run build
npm test
```

`npm run build` uppdaterar både den fristående elevfilen och `docs/`. Checka in uppdaterade `dist/` och `docs/` tillsammans. Testerna kontrollerar spellogik, svar, alla scener, hamnuppdragets sparning och en simulerad gränssnittsrutt. De ersätter inte provspelning i en riktig webbläsare.

För att spela lokalt öppnar du `dist/index.html` eller `dist/uppdrag-1700.html` i webbläsaren.


## Repetition och föremål (v0.2)

Tryckeriets handlingar har en första ljudskiss: metallrassel för blytyper, pappersprassel, ett dämpat ljud för bläck samt träknarr och ett tungt presslag när handtaget dras. Effekterna är egna syntetiska ljud, inte dokumentära inspelningar. Slå på dem med högtalarknappen i överkanten; valet sparas på enheten. Ljud är av från början, stoppas vid platsbyte och kunskapsfrågor och kan stängas av när som helst. Effekterna ingår även i elevfilen och behöver inga ljudnedladdningar. Musik och löpande miljöbakgrunder återstår.

Historisk grund för ljudvalet: [Penn Libraries om tryckning 1776](https://www.library.upenn.edu/events/printing-1776-ink-balls) beskriver färgbollar före färgvalsarnas införande på 1800-talet. Skissen använder därför ingen motor- eller färgvalsslinga.

På Stortorget finns läromästaren Rut och bokoraklets skrivbord. Rut ger högst sex fria frågor från avslutade uppdrag, prioriterar förfallna frågor och tidigare fel och blandar in sådant spelaren lyckats med. Fel ger återkoppling utan att låsa förhöret. Ett förhör kostar varken mat eller speldagstid.

Minst 70 procent rätt ger ett äpple och 1 daler, högst en belöning per 24 verkliga timmar. Repetition kan alltid göras utan belöning. Äpplen erbjuds till arbetsgivare eller används i en kortsvarsfråga för en extra ledtråd; svar med sådan hjälp markeras som stöd. Grundläggande bokhänvisningar är alltid gratis. Datumen och belöningarna bygger på enhetens klocka och är inga säkra bedömningsdata.

Tryckeriet har blytyper, papper och trycksvärta att ta och lägga i pressen. Dra i handtaget när allt är på plats. Provtrycket kan lämnas till Noor i kaffehuset för en extra ledtråd. Pusslet är frivilligt, kostar ingen mat och räknas inte som kunskapsresultat. Föremål och pussel sparas tillsammans med äventyret.

Trädgårdens etikettbord har fyra vetenskapliga artnamn att sortera i släktena Rosa och Viola. Första ordet anger släktet; båda orden tillsammans är artnamnet. Valen sparas även innan pusslet är klart. Fel går att ändra utan kostnad eller låst jobb. En fröpåse belönar sorteringen en gång och kan erbjudas Karin i byn för en extra ledtråd i jordbruksjobbet. Om jobbet redan är klart behålls fröpåsen. Pusslet är frivilligt och räknas inte i kunskapsrapporten.

Artetiketterna är kontrollerade mot Kews Plants of the World Online: [Rosa canina](https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:731955-1), [Rosa gallica](https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:732569-1), [Viola tricolor](https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:869428-1) och [Viola odorata](https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:868828-1). Pusslet illustrerar namngivning, inte en rekonstruktion av en historisk trädgård.

Frågebanken stöder bookReference per uppdrag och learningHint per kortsvarsfråga. Utan riktigt SO-material används avsnittsnamn, inte påhittade sidnummer. De sju uppdragen är fortfarande fria att besöka; deras ordning knyts till boken när materialet finns.

Google-synkning är förberedd men avstängd. Den här spelversionen fungerar med lokal sparning på samma webbplats, webbläsare och enhet. Kontokonfiguration finns i arbetsversionen och behöver ett skolägt Firebase-projekt innan den kan aktiveras.

## Återkommande stöd och ekonomi

Första provtrycket är gratis när pressens tre delar är på plats. Därefter kostar varje nytt ark 1 daler. Spelaren kan bara ha ett provtryck åt gången. Noor tar emot högst ett per speldag medan idéuppdraget återstår. När dagens ark har lämnats kan nästa köpas följande speldag. Varje inlämnat ark ger en ledtråd som förbrukas vid användning; svaret markeras som hjälpt. Pressens inställning och dagsgräns sparas. Gamla sparningar med redan lämnat provtryck räknas som levererade på den aktuella speldagen.

Britas pappersärende finns vid pressen: ta ärendet, hämta paketet vid bokoraklets skrivbord på Stortorget och använd det på Brita. Leveransen betalar 1 daler högst en gång per speldag, kostar ingen mat och kräver inga kunskapsfrågor. Paketet är ett separat föremål från pusslets papper. Ärendet kan göras även efter tryckeriets kunskapsjobb och när repetitionsbelöningen är låst.

Repetition betalar 1 daler tillsammans med äpplet, högst en gång per 24 verkliga timmar. Speldagar öppnar inte belöningen. Befintliga belöningstider gäller även efter uppdateringen. Priser och gränser är val för spelbalansen, inte forskningsbaserade mått på lärande.
