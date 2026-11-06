# Händelsesystem för Uppdrag 1700 · 1.5.2

## Äppelrisker · 2.12.0

Hunden tillkommer i kapitel 3. Den vaktande tjuven tillkommer i kapitel 4, och därefter kan båda förekomma i fyran och femman. Kapitel 1–2 behåller den befintliga ficktjuven utan nya äppelhot. En hund får vittring på det burna äpplet och följer efter. En annan tjuv går fram från ett verkligt träd till en passage och bevakar den; han följer bara en kort sträcka runt sin plats. I fyrans första nya möte introduceras vakten före den redan bekanta hunden. Från kapitel 4 växlar de mellan möten. Hundens varning varar tre sekunder, vaktens två. Båda har en liten pappersmarkering med utropstecken, och hunden har en röd halsduk. Skydd i hus eller samtal, bruten sikt bakom ett träd och att hålla avstånd kan avvärja dem. De använder samma vägkontroll, målade hund/personer och markdjup som staden, utan att flytta kameran eller öppna en frågedialog på gatan.

Båda tar **ett faktiskt äpple** vid kontakt. Det finns ingen återbetalning från jakten, barnet eller en självrapport. Ett nytt tjänas genom den befintliga, fullständiga repetitionsomgången hos Rut i Arkivet. Att öppna Rut, avbryta eller svara fel ger inget nytt äpple. Frågor och bedömning hos Rut är oförändrade och använder det redan tillgängliga repetitionsunderlaget. Daler, klarade frågor, stämplar och berättelseföremål ändras inte av dessa två risker. Den tidigare ficktjuvens penningjakt är kvar separat.

Efter förlust väntar nya äppelhot tills en ny Rut-omgång verkligen har gett ett äpple. Ett ännu inte ordentligt visat hot kan därefter introduceras efter 240 kartenheters gång, utan extra väntetid. Ett redan visat hot får en lugn period på 15 aktiva sekunder och 450 kartenheter. Att kort kika fram innan spelaren går in räknas inte som en färdig introduktion. Äldre väntetider kortas när en sparning öppnas; verkliga förluster, behovet av repetition, turordning och historik behålls.

Den första introduktionen prioriteras framför nya ficktjuvsförsök. En pågående äldre händelse avslutas först, följd av ett enda kort mellanrum på tre sekunder och 120 kartenheter. Den tidigare motorn kunde kontinuerligt lägga till 20 nya sekunder medan en ficktjuv kikade fram, vilket sköt upp äppelmötet. Den förlängningen är borttagen. Hoten pausar under läsning, menyer och dolda flikar, och startar inte i lärarvyn, hus eller på öarna. Rut är fortsatt en trygg plats.

Hunden kan komma fram vid ett faktiskt träd eller en framkomlig husentré. Vakten väljer en plats på den gångväg spelaren har valt, med hänsyn till hur långt det är kvar till målet, och placeras inom den närmare delen av kartbilden. Manuellt gående använder motsvarande sträcka framför spelaren. Varje ursprung och steg kontrolleras mot samma byggnads-/vattenkollision som tidigare. Inga figurer läggs inne i ett hus eller mitt ute på ett tomt fält.


Takt, turordning, förluster och behov av repetition sparas kapitelvis under `uppdrag1700.apple-threats.v1`, innanför befintlig spel-/elev-/omspelningsnamnrymd. Ett avbrott avslutar det pågående mötet utan ny debitering; en redan förlorad resurs dras inte igen vid omladdning. Vanliga sparfilsexporter inkluderar nyckeln automatiskt. Elevlänkens gräns på ett äpple och kapitel 1–2 behålls.

`npm run test:apple-threats` provar fysisk kontakt för båda, varningstid, vaktens begränsade förföljelse, flykt, skydd, väggar, paus, omladdning och ny återkomst efter faktisk repetitionssignal. Integrationsprovet använder den riktiga stadens vägnät, träd och kollisionskontroll samt den oförändrade återkallningsmotorn och kapitel 3–5:s befintliga belöningsväg. Avbruten, felaktig och avslutad Rut-omgång provas efter båda typernas resursförlust. Alla fem kapitels befintliga hundmålare anropas med den nya posen. Det ersätter inte elevtest av tempo eller svårighetsgrad.

## Varför

Det här systemet kompletterar den **befintliga** berättelsen och de tre återkallningsnivåerna med frivilliga händelser i den gemensamma stadsvärlden. Det bygger inte om kartorna, frågorna eller karaktärernas huvuduppdrag. Kapitel 8:s utvecklande dialoger är fortsatt en förebild för huvudberättelsernas utveckling, men varje sidoäventyr ska också kunna ha en egen liten båge.

## Två spelbara händelser och en fortsättning

**Vagnsblockaden:** En vagn står på vägen från Verkstäderna mot Herrgården (på den befintliga `ruralJ1–ruralJ2`-förbindelsen). Den syns i själva kartan. Vid närkontakt möter spelaren kusken, får undersöka hjulet och kan antingen använda en kort minnesfråga, försöka avlasta vagnen eller gå till **smeden vid Verkstäderna** och sedan återvända. Vid besök två säger kusken något annat; när vägen har öppnats står vagnen vid sidan av vägen och kusken minns hjälpen. Händelsen går alltid att skjuta upp. Vagnen flyttas åt vägrenen om spelaren vill fortsätta utan att lösa sidoäventyret, så att den inte visuellt blockerar en väg som spelaren kan gå på.

**Ficktjuven:** Efter en längre sträcka av verklig förflyttning kan en tjuv synas nära spelaren på gatan. Spelaren väljer att jaga eller avstå. En enda kort repetitionsfråga från det befintliga materialet kan rädda en daler. Fel svar eller att avstå kan kosta **högst en daler**, aldrig ett helt kapitel eller en kunskapsstämpel. Händelsen inträffar högst en gång per relevant kapitel och sker inte automatiskt i lärarvyn. I kapitel 6 används den *tidigare* ficktjuvshändelsen, inte en andra tjuv.

**Barnets vittnesmål:** Om ficktjuven har synts dyker ett vittne upp vid torget. Spelaren kan fråga lugnt eller kräva ett svar. Barnet minns bemötandet; en otrevlig första replik kan repareras vid återbesök. Vid vänligt samtal kan en tidigare förlorad daler hittas vid gränden och återlämnas. Dialogen är dramatik, inte en historisk källa och inte automatisk kunskapsbedömning.

## Spelregler och tillgänglighet

- Händelser registreras i `UPPDRAG_EVENT_ENGINE.register(...)`, med unik identitet, region, eventtyp och kapitelkoppling. Registrerade typer är `sidequest`, `surprise` och `follow-up`.
- Händelser är **frivilliga**. Huvuduppdraget kan alltid fortsätta. Tävling eller misstag får inte låsa kapitelprogression.
- Extra val och status lagras under `uppdrag1700.side-adventures.v1`, med kapitelvisa underobjekt, inom den befintliga integrerade spel-/lärarsparningen. Export/import via menyn inkluderar dem automatiskt; gamla sparningar och frågesvar förblir orörda.
- Händelsemotorn återanvänder den **redan existerande** rörelse- och ritloopen (`UPPDRAG_WORLD_LIFE.tick/draw`). Ingen ny animationsloop eller parallell spelvärld skapas. Så länge händelsedialogen är öppen pausas resan; när den stängs fortsätter den tidigare valda vägen. Kartans vägar, djur och byggnader ändras inte.
- Klickbara objekt syns på kartan. På mobil kan händelserna även utlösas genom närhet. Knappen **Händelser** visar ett sammanhang och nästa steg. I lärarvyn kan vagnsblockaden och ficktjuven startas manuellt utan att en daler förloras.
- Endast de befintliga **kapitlen 1–8** integreras i version 1.5.0. Manuset och händelsekatalogen innehåller grundläggande platsbeskrivningar för kapitel 9–10, men de kapitlen är inte byggda eller upplåsta.
- Kopplingen är till figurer och specifika platser, inte till en fast trio. Kusken, smeden, vittnet och ficktjuven har egna lokala händelsebågar. Framtida händelser kan registreras för andra person-id:n och tidsperioder.

## Avgränsningar för första speltestet

Vagnen är en synlig händelse på en väg och pausar spelarens färd vid mötet. **Det är ännu ingen fysisk fordons-AI eller omräkning av hela vägnätet.** Alternativet att gå vidare motsvaras av att kusken drar vagnen till vägrenen. Ficktjuven är också en kort illustrerad händelse, inte en oberoende figur som lever ett helt liv i staden. De här avgränsningarna är avsiktliga för att undvika att förstöra vägar, NPC-rörelser eller tidigare sparningar.

Regler för minnesfrågor är oförändrade: sidohändelser ger inga provpoäng, självständiga mästarstämplar eller betyg. Ljud, skärmläsare och möjligheter att stänga eller återkomma ska vidareutvecklas vid elevtest.

## Testning

Kör `node --check event-engine.js`, `node tests/event-engine.cjs` och de vanliga fråge-/miljötesterna. Ett lokalt Chromium-test med simulerad dokumentmiljö spelade igenom vagn → smed → återbesök, en misslyckad ficktjuvsjakt med en daler i avdrag samt laddning av kapitel 6 utan dubbel ficktjuv. Fullständig kapitelgenomspelning av integrerade GitHub Pages i Safari eller riktig klassmiljö återstår och är inte verifierad här.


## Dialoger och överraskningar · 1.5.2

Kusken, smeden, tjuven och barnet talar nu i **samma papperspratbubblor** som de andra invånarna, förankrade till figuren i stadsvärlden. En replik visas åt gången med **Fortsätt**, och först därefter kommer aktuella samtalsval eller repetitionsfrågor. Även elevens egen replik får en bubbla. Knappen **Händelser** behåller en separat översiktsmeny för att kontrollera vad som är gjort och för lärartest.

Ficktjuvens förflyttningsgräns slumpas fram individuellt och sparas direkt; en omladdning kan därför inte slumpa om händelsen. Tjuven dyker fortfarande högst en gång per tillåtet kapitel; den kostar högst en daler och är aldrig obligatorisk. Kapitel 6 har fortfarande en enda äldre tjuvhändelse, och kapitel 3 och 8 får ingen extra ficktjuv. Vagnens samma grundsidoäventyr finns i kapitel 1–8 med kapitelspecifik inledning. **Det är alltså ännu inte en katalog av unika sidoäventyr per kapitel.** Kapitel 9–10 förbereds i katalogen men är inte spelbara.

Mobilvy 390 px och bred vy 900 px har testats i Chromium: en replik i taget, vagnens två val, smedens uppdrag, tjuvens repetitionsalternativ och barnets följddialog. Den sammanfogade sidans öppning och sparning ska dessutom kontrolleras inför publicering. Riktigt iOS/Safari och variationen av elevsvar återstår att elevtesta.


## Vaktens förvarning vid vanlig gång · 2.11.2

Passagen väljs 590–800 kartenheter framför spelaren. Vid normal gång på 180 enheter per sekund finns då hela tresekundersvarningen kvar innan passagen korsas. Tidigare valdes den 125–300 enheter framför spelaren, så en fortsatt vanlig promenad hann passera medan vakten fortfarande var ofarlig. Vaktens observationsavstånd följer den längre placeringen; hundens avstånd och hastighet är oförändrade. Integrationsprovet går nu genom en verklig passage med normal gånghastighet, bekräftar varningen, exakt en äppelförlust och att vända tillbaka bevarar äpplet.

Vilans tid pausas även när spelaren läser Ruts återkoppling inne i Arkivet. Skydd i hus och samtal avslutar först förföljelsen; därefter fryses klockan under läsning och dialog. Både modellprovet och provet med riktig Rut-belöning kontrollerar detta.


## Första mötet på vanliga vägar · 2.12.0

Första Rut-belöningen återställde tidigare 45 sekunders väntan och 700 kartenheters gång. Eftersom klockan pausade vid frågor och samtal kunde många normala arbetsbesök passera utan ett enda möte. De tidigare integrationstesterna nollställde väntan och sökte igenom alla vägar, vilket missade denna användarväg. Det nya synlighetsprovet använder standardvärden, signalen från den första Rut-belöningen och stadens riktiga ruttplanerare på vanliga resor mellan arbetsplatser. Det provar också att vakten ligger före målet på den valda vägen, att ett annat tjuvförsök inte kan skjuta upp mötet för alltid och att gamla sparningar blir spelbara utan radering.
