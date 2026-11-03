# Elevlänk – enbart kapitel 1 · 2.7.2

Länken `?only=1&chapter=1&v=2.7.2` öppnar Frihetstiden i en elevvy med enbart kapitel 1. Menyn visar bara ettan. Senare kapitel förblir otillgängliga även när alla ettans nio stämplar är klara. Avslutningen och minnesboken erbjuder då ingen fortsättning till tvåan. Lärarvyn finns inte i denna elevvy.

Elevvyn begränsar äppelförrådet till högst ett äpple. Ett äpple används till ett nytt försök på hela områdesprovet. Därefter behöver eleven avsluta en ny repetition hos Rut för att få ett nytt. Repetition med ett äpple kvar är fortfarande gratis men ger inget extra äpple och lovar ingen ny belöning. Sparade och importerade förråd över ett begränsas vid öppning; svar, stämplar, daler och historik behålls. Det vanliga spelets äppelförråd påverkas inte.

Elevvyn använder en egen sparning under `lesson.1.` i appens befintliga namnrymd. Den blandas inte med lärarens testomgång eller det obegränsade spelet. Samma länk kan skickas till alla elever; varje webbläsare sparar sin egen omgång lokalt. Ljudinställningen hör fortfarande till enheten och går att använda även här.

Länkläget prioriteras före URL-val av kapitel/lärarvy/kapitelprov. Återbesök och inläst sparfil stannar i ettan. Omspelning bevarar `only=1`, skapar en separat elevomgång och kan återgå till elevens sparade ettan. Det vanliga spelets progression till senare kapitel finns kvar utanför elevvyn.

Detta är en avgränsning av elevvyn och kapitelnavigeringen i den statiska appen, inte kontobaserad behörighetskontroll. Inga elevkonton, serverlagrade elevsvar eller klassinloggningar införs.

`npm run test:chapter-one-only` kontrollerar första öppning, eget sparutrymme, dold lärarvy, förtvingad etta, verkligt sista mästarprov, avslutning/minnesbok utan tvåanslänk, spärr mot kapitel 2–10 även efter full progression, import av senare lastChapter, omspelning/återgång och mobil. `node docs/spel/tests/chapter-one-apple-browser.cjs` provar två verkliga repetitionsomgångar utan extra äpple, helomförsök efter miss, spärr efter förbrukat äpple, ny repetition, omladdning/import samt ordinarie spel. Det vanliga ettans mastery-prov verifierar fortsatt korrekt tillgång till tvåan utanför elevvyn.

Publicering sker endast under `docs/spel-test/` på main. PR 4 hålls draft och ordinarie `docs/spel/` på main ändras inte.
