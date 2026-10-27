# Kapitel 9–10 · version 1.6.0 · 27 oktober 2026

Två nya spelbara lärarprototyper i samma stad. Ingen ny karta eller ersättning av befintliga sparningar. Kapitel 1–8:s frågekällor, miljögrafik, tryckpress, bostadskvarter, djur och sidoäventyrskod är oförändrade.

## Öppna kapitlen

- Kapitel 9: `?teacher=1&chapter=9&v=1.6.0`. Börja hos **Ester i Kaffehuset**.
- Kapitel 10: `?teacher=1&chapter=10&v=1.6.0`. Börja hos **Ada i Kaffehuset**, som skickar dig till **Rut i Arkivet**.

Lärarvyn ger direkt åtkomst och separat sparning, inte skyddad inloggning. Vanlig spelgång kräver föregående avslutat kapitel. Menyn visar nu alla tio kapitel. Slutscenerna i 8 och 9 länkar vidare. Kapitel 10 har ett avslut men stänger inte staden eller möjligheten att repetera.

## 9. Striden om Finland

En sjömans anhörig, Ester, väntar på ett brev. Kartografen Alva har ett äldre allianskort. Elin visar hur Rysslands sidbyte förändrade Sveriges läge. Hamnskrivaren Nils skiljer familjens fiktiva brev från lärobokens återgivning av Karl Haydens minnen. Efter ett tydligt scenbyte till freden 1809 jämför spelaren rikstillhörigheten före och efter kriget.

Tre materialövningar: ordna allianser före/efter Rysslands sidbyte; skilja familjebrevet från ett historiskt minne; jämföra två kartliknande scheman och skilja förändrat styre från människors identitet. Schemat är egen kodgrafik, inte en geografiskt skalenlig karta eller ett historiskt original.

Ester ber inte om ett påhittat lyckligt slut. Hon vill veta vad brevet faktiskt visar och vad som fortfarande är osäkert. Ett senare samtal återkopplar till hur spelaren tidigare bemötte henne. Efter sista arbetsbesöket måste brevet och förklaringen lämnas till Ester innan kapitlet avslutas.

## 10. Hur kan vi veta något?

Ada vill öppna en utställning men ifrågasätter vad som kan beläggas. Rut hjälper till att välja källor, Sigrid granskar kartor och bildspår, Olof visar register, Elin invänder mot en alltför demokratisk bild av frihetstiden och Amira försvarar kulturens plats utan att all kritik mot kungamakten stryks.

Fyra materialövningar: välja en källa för en bestämd fråga; tolka bilddetaljer försiktigt; sortera sex händelser mellan frihetstid och gustaviansk tid; komplettera utställningen med perspektiv som saknas. Utställningen öppnas först när boken lämnas till Ada. Den är sedan läsbar i spelarens bok, med källtyper, begränsningar och tidigare samtalsval.

**Bildövningen är anpassad:** spelet visar textbearbetningar av detaljer i arbetsbokens tre bilder, inte de tre originalbilderna. Den fullständiga bildanalysen görs med arbetsboken s. 38. Inga inskannade lärobokssidor har publicerats i detta tillägg.

## Dialoger, kunskap och sidoäventyr

Varje kapitel har **12 arbetsbesök med två frågor**, sammanlagt **24 frågor** och tre nivåer. Varje besök har ett kapitelspecifikt samtal med två olika svarsvägar. Val och svar från personerna sparas; senare möten återkopplar till tidigare val. Samma inbyggda papperspratbubblor och personer används, inte ett separat dialoggränssnitt. Materialborden och boken använder däremot ett läsbart dokumentfönster.

Kapitlen har egna huvudpersoner och perspektiv. Val förändrar dialogen men inte historiska fakta. Kapitel 10 är uttryckligen minnesmästarens återblick över flera tider, inte ett påstående om att samma vuxna personer levt oförändrade genom ett århundrade.

Händelsemotorn från 1.5.2 är också inkopplad i 9–10, med befintlig vagn, smed, ficktjuv och vittne. Det är återanvända sidoäventyr med kapitelsammanhang, inte två helt nya uppsättningar sidoäventyr. Automatiska överraskningar är fortfarande avstängda i lärarvyn.

Korta faktasvar kontrolleras med befintlig kortsvarsmotor. **Öppna resonemang jämförs med exempel och sparas för granskning**, utan krav på en viss formulering och utan automatisk självständig mästarstämpel. Granskningen är lokal data i sparfilen, inte en ny lärarportal eller automatisk leverans till läraren. Tre källtyper ska vara tre skilda typer. Att slutföra ett äventyr är inte ett betyg; slutrutan skiljer igenkända svar från väntande granskning.

## Underlag

Användarens uppladdade SOS Historia 4–6, grundbok s. 100–105 och arbetsbok s. 37–39, uppgift 29–35; källkopplingen `uppdrag_1700_kallkoppling_interaktiv.html`; planen `Uppdrag_1700_hela_uppdragskedjan.docx`. Originalfotografierna av s. 100–103 och arbetsbokens bildjämförelse har lästs. Karl Haydens minnen återges i en tydligt märkt sammanfattning av lärobokens innehåll, inte som ett påhittat citat eller Esters brors brev. Replikerna, Ester, Alva, Nils och Ada är fiktion.

## Sparning och källkod

Oförändrat integrerat prefix: `uppdrag1700.integrated.20261023.v1.` med separata `play.`/`teacher.`. Nya kapitelnycklar:

- `uppdrag1700.ch9-real-world.20261027.v1`
- `uppdrag1700.ch10-real-world.20261027.v1`

Daler och äpplen förs vidare från föregående avslutat kapitel. Tidigare svar och samtalsval skrivs inte om. `finale-runtime.js` kontrollerar SHA-256 för de fem delarna `finale-pack-1.bin` till `finale-pack-5.bin` som fogas till ett gzip-paket. Paketet innehåller läsbar, okomprimerad JavaScript och JSON efter avpackning. Kör `python decode_finale_sources.py` för att skapa granskningsbara källor i `_finale/`.

## Genomförda kontroller och begränsningar

`node tests/finale.cjs`: **93 genererade skript syntaxkontrollerade och 328 svar/regressionskontroller**, 48 nya uppgifter, 24 tvåfrågebesök och 24 samtal med två svarsvägar. Tidigare exempelsvars bedömningar jämförs före och efter de nya reglerna. De tidigare kapitel-6-, kapitel-7-, kapitel-8-, krigsfråge-, världs- och händelsetesterna har också körts. Händelsetestets versionskontroll är uppdaterad, inte händelsernas beteende.

Lokal Chromium-genomgång genomförde båda kapitlens 24 formulärsvar, 12 samtal, materialövningar och slutleverans utan JavaScript-fel. Genomgångarna använde lärarens rumsgenvägar, inte alla gångvägar. Båda samtalsvalen har använts i genomgångar. Sparade 24 svar, 12 samtalsval och materialsteg återlästes; väntande granskning behöll `independent:false`. Överföring av resurser 8→9 och 9→10 kontrollerades med testsparningar. Samma spel- och lärarsparning hölls åtskilda.

Webbläsartesterna kördes med **simulerad filhämtning och lokal lagring**, riktig canvas samt mobil- och datorbredd. Det är inte en slutkontroll på publicerad GitHub Pages, fysisk iPhone/Safari eller i en klass. Alla möjliga elevformuleringar, gångvägar och kombinationer med sidoäventyr är inte uttömmande testade. Kapitel 1–7:s äldre huvuddialoger är inte omskrivna i denna version.
