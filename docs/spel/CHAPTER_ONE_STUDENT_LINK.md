# Elevlänk – enbart kapitel 1 · 2.8.0

Länken `?only=1&chapter=1&v=2.8.0` öppnar Frihetstiden i en elevvy med enbart kapitel 1. Menyn visar bara ettan. Senare kapitel förblir otillgängliga även när alla ettans nio stämplar är klara. Avslutningen och minnesboken erbjuder då ingen fortsättning till tvåan. Lärarvyn finns inte i denna elevvy.

Elevvyn begränsar äppelförrådet till högst ett äpple. Ett äpple används till ett nytt försök på hela områdesprovet. Därefter behöver eleven avsluta en ny repetition hos Rut för att få ett nytt. Repetition med ett äpple kvar är fortfarande gratis men ger inget extra äpple och lovar ingen ny belöning. Sparade och importerade förråd över ett begränsas vid öppning; svar, stämplar, daler och historik behålls. Det vanliga spelets äppelförråd påverkas inte.

Instruktioner, knappar och återkoppling i ettan är anpassade för elever som arbetar själva i årskurs 6. Frågornas formuleringar, ämnesbegrepp och bedömningskrav är bevarade. Manuell granskning kräver en sexsiffrig lärarkod, vars klartext aldrig publiceras eller sparas i spelet. Det är en lokal klassrumsspärr, ingen serverbaserad behörighet. Vid osäkert svar kan eleven i stället avsluta en ny repetitionsomgång hos Rut och göra om hela områdesprovet utan hjälp. Det kräver inget äpple och ger ingen stämpel förrän det nya provet är klart. Se YEAR6_LANGUAGE_AND_REVIEW.md.

Elevvyn använder en egen sparning under `lesson.1.` i appens befintliga namnrymd. Den blandas inte med lärarens testomgång eller det obegränsade spelet. Samma länk kan skickas till alla elever; varje webbläsare sparar sin egen omgång lokalt. Ljudinställningen hör fortfarande till enheten och går att använda även här.

Länkläget prioriteras före URL-val av kapitel/lärarvy/kapitelprov. Återbesök och inläst sparfil stannar i ettan. Omspelning bevarar `only=1`, skapar en separat elevomgång och kan återgå till elevens sparade ettan. Det vanliga spelets progression till senare kapitel finns kvar utanför elevvyn.

Detta är en avgränsning av elevvyn och kapitelnavigeringen i den statiska appen, inte kontobaserad behörighetskontroll. Inga elevkonton, serverlagrade elevsvar eller klassinloggningar införs.

`npm run test:chapter-one-only` kontrollerar första öppning, eget sparutrymme, dold lärarvy, förtvingad etta, verkligt sista mästarprov, avslutning/minnesbok utan tvåanslänk, spärr mot kapitel 2–10 även efter full progression, import av senare lastChapter, omspelning/återgång och mobil. `node docs/spel/tests/chapter-one-apple-browser.cjs` provar två verkliga repetitionsomgångar utan extra äpple, helomförsök efter miss, spärr efter förbrukat äpple, ny repetition, omladdning/import samt ordinarie spel. Det vanliga ettans mastery-prov verifierar fortsatt korrekt tillgång till tvåan utanför elevvyn.

Publicering sker endast under `docs/spel-test/` på main. PR 4 hålls draft och ordinarie `docs/spel/` på main ändras inte.


## Kapitel 1 och 2 · 2.10.0

Den nya elevlänken `?only=2&chapter=2&v=2.10.0` ger tillgång till kapitel 1 och 2. Tvåan öppnas när ettans nio stämplar är klara. Menyn visar endast ettan och tvåan, och efter tvåan erbjuds ingen fortsättning till trean. Lärarvyn och kapitelprovsgenvägar är avstängda även om sådana parametrar finns i länken. Den tidigare `only=1`-länken gäller fortfarande enbart ettan.

Båda länkarna använder samma befintliga `lesson.1.`-sparning. Elevernas framsteg från den tidigare länken, omspelningar och sparfiler följer därför med utan kopiering eller återställning. Tvåans befintliga resursöverföring från ettan behålls.

Elevomgångens gräns på ett äpple, lärarkoden och vägen via en ny Rut-omgång till ett självständigt omprov gäller även i tvåan. Frågebank, områden, berättelse och sidoäventyr är tvåans egna. Det vanliga spelet har kvar sin fortsättning till trean.

`chapter-two-student-browser.cjs` provar övergången från gammal elevlänk och verkligt sista prov i ettan till tvåan, bevarad sparning, spärr före klar etta, äppelgräns och granskning i tvåan, ett riktigt sista områdesprov i tvåan, spärr till kapitel 3–10, import, omspelning/återgång och mobil.

## Stegvis fler hot · 2.11.3

Aktuell elevlänk: `?only=2&chapter=2&v=2.11.3`. Samma sparning, äppelgräns och kapitelspärrar används. Kapitel 1–2 behåller den befintliga ficktjuven. Hunden introduceras i kapitel 3 och den vaktande tjuven i kapitel 4, när dessa kapitel senare blir aktuella för eleverna. De nya hoten tar ett äpple vid kontakt; ett nytt tjänas genom en hel vanlig repetitionsomgång hos Rut. Inga klarade frågor eller stämplar försvinner. Se `EVENT_SYSTEM.md`.
