# Kapitel 1: minnesboken i den befintliga världen

Byggversion 2.0.4, 28 oktober 2026. Arbetsgren: `rebuild/mastery-progression`.
Detta är det första migrerade kapitlet. Kapitel 2–10 har fortfarande sin tidigare uppdragslogik.

## Spelgång

Maja introducerar minnesboken på Kaffehuset. Eleven kan också gå direkt till ett område. Alla femton sammansatta uppgifter i den befintliga återkallningsbanken ingår, inklusive deras delkrav:

| Område | Plats/person | Uppgifter per nivå |
| --- | --- | --- |
| Frihetstidens början | Slottet, Amira | Regentens namn och maktförändringen (2) |
| Lagar och inflytande | Riksdagshuset, Elin | Grundlagens innehåll/ändring och ståndens inflytande (2) |
| Handel med Asien | Kajen, Jo | Kompaniets uppgift, handelsområde och varor (1) |

Eleven väljer områdesordning inom en nivå. Alla tre lärlingsstämplar krävs före gesäll, alla tre gesällstämplar före mästare och alla tre mästarstämplar före kapitel 2. Inget återbesök hos Maja krävs för avslut.

Ett faktiskt misslyckat prov låser det försöket. Ett äpple öppnar ett nytt försök på hela det valda områdesprovet, från första uppgiften. Andra områden behålls. Ledtrådar kostar en daler och finns enbart på lärlingsnivån. Rut är gratis och kan ge äpplen även när plånboken är tom. Gatuhändelser i ettan och Rut använder samma kända ämnen; framtida och ännu inte visade uppgifter tas inte med i gatuhändelser. Rut har en introduktionsreserv om ingen uppgift alls har mötts.

Osäkra formuleringar sparas för granskning utan kostnad eller stämpel. Läraren kan på samma enhet läsa svaret och uppgiftens exempelsvar, be eleven bearbeta eller bekräfta att innehållet uppfyller kraven. Ett granskat svar loggas som `teacher-approved`, aldrig som en självständig automatisk prestation. Lärarbekräftelsen är en lokal klassrumsfunktion, ingen säker behörighetskontroll.

`questions/power-language.js` utvidgar de två öppna maktfrågorna. Den känner igen fler uttryck för begränsad kungamakt och ökat inflytande för riksdag/riksråd, inklusive ”kungens envälde upphörde och riksdagen och riksrådet fick ökat inflytande”. Kontroll sker av båda leden och maktförändringens riktning. Detta är fortfarande en lokal regelkontroll; okända formuleringar går till granskning. Övriga uppgifters bedömning lämnas till den befintliga motorn. Enhetstestet omfattar 44 giltiga formuleringar, 36 felaktiga/ofullständiga svar och 76 oförändrade uppgifter.

## Sparningar och kontinuitet

Den gamla kapitelsparningen har kvar svar, daler, äpplen och historik. Före första migrationen sparas en engångskopia med suffix `.before-mastery-2`. Endast kompletta, styrkta områdesförsök överförs, i nivåordning. En gammal `complete:true` skapar inga nya stämplar. Minnesboken förklarar detta.

- Kunskapsstatus: `uppdrag1700.mastery.v1.ch1`.
- Berättelse/besök: `uppdrag1700.story.v2.ch1`.
- Personernas minne: `uppdrag1700.people.v2.ch1`.
- Befintliga sidoäventyr: `uppdrag1700.side-adventures.v1`, oförändrad struktur.

Alla nycklar går genom den befintliga integrationens separata elev- och lärarsparning samt export/import. Vagnen, smeden, tjuven och vittnet använder den befintliga händelsemotorn. Ingen karta, byggnad eller interiör är nybyggd eller flyttad.

## Filer och kontroller

`chapter1-mastery.js` ersätter ettans gamla pilot först när integrationen laddar kapitel 1. `mastery-recall-adapter.js` lägger uttryckliga krokar i den frysta rättningsmotorn; ankaravvikelser stoppar laddningen. Frågebank och bedömningskriterier återanvänds. Övriga kapitel får inte adaptern.

Kör `npm run test:mastery` med Playwright installerat. `CHROMIUM_PATH` kan ange en lokal Chromium. I Codex-miljön hämtas Playwright från `CODEX_PRIMARY_RUNTIME_NODE_MODULES`.

Verifierat med enhets- och lokala Chromium-test: alla femton uppgifter genom tre nivåer, valfri områdesordning, miss/äpple/helomförsök, Rut-belöning, ledtrådsregler, väntande granskning och bekräftelse, omladdning, kontinuitet i sidoäventyr, sparfilens fyra namnrymder, äldre avslutat kapitel utan styrkande svar och normal kapitel-2-spärr. Minnesboken har kontrollerats visuellt vid 1200 och 390 pixlars bredd. Testet använder lärarvyns befintliga rumsgenvägar för provbesöken; det är inte en fullständig manuell promenad genom varje väg.

Befintliga regressionstester för 255 kapitel-6-svar, världslayout, tryckpress och händelsemotor går igenom. `npm test` har sex äldre fel i `scripts/world.test.mjs` och `scripts/chapter-pilot-safety.test.mjs`; samma sex fel reproduceras på den orörda utgångscommiten `cb9adb3`. De gäller äldre världskod och dess testantaganden, inte den nya kapitel-1-adaptern. Testerna har inte tagits bort eller gjorts gröna genom att sänka kraven.

En separat testversion finns på https://andersljungvik.github.io/uppdrag-1700/spel-test/ med egen sparning. Närbilderna i de befintliga miljöerna används för uppgifterna. Fysisk iPhone/Safari återstår; mobilbredd kontrolleras i Chromium.
