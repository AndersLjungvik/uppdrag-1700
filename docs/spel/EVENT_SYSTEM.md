# Händelsesystem för Uppdrag 1700 · 1.5.2

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
