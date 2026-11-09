# Elevlänkar · kapitel 1–2 · 2.17.2

## Klassernas delade länkar · bekräftade 2026-11-09

Anders har delat två olika elevlänkar, en till varje klass. Det är avsiktligt accepterat att länkarna skiljer sig; håll reda på båda vid framtida ändringar.

| Klass | Delad länk | Kapitelåtkomst |
| --- | --- | --- |
| 6A | https://andersljungvik.github.io/uppdrag-1700/spel-test/?only=1&chapter=1&v=2.7.1 | Kapitel 1–2; tvåan efter klar etta |
| 6B | https://andersljungvik.github.io/uppdrag-1700/spel-test/?only=1&chapter=1&v=2.9.0 | Kapitel 1–2; tvåan efter klar etta |

Länkarna skiljer sig i `v`-parametern och använder samma publicerade `spel-test/`-ingång. På Anders uttryckliga begäran 2026-11-09 öppnar de två registrerade klasslänkarna nu kapitel 1–2, trots att deras ursprungliga adresser innehåller `only=1`. Kapitel 2 kräver fortfarande ettans nio stämplar; kapitel 3–10 är spärrade. Andra länkar för enbart kapitel 1 behåller sin gräns. `v` väljer inte ett historiskt kodpaket och ingår inte i sparningens prefix. Framsteg är lokala per webbläsare och finns kvar när klasslänkarna får tillgång till tvåan.

Vid framtida uppdateringar: kontrollera båda klasslänkarna, deras kapitelgränser och sparningar. Dokumentets övriga länkar för kapitel 1–2 är tillgängliga alternativ, inte belägg för att de har delats med någon av klasserna. Behåll de delade adresserna. Fler kapitel än de godkända 1–2 öppnas först på uttrycklig begäran.

Länken `?only=1&chapter=1&v=2.8.0` öppnar Frihetstiden i en elevvy med enbart kapitel 1. Menyn visar bara ettan. Senare kapitel förblir otillgängliga även när alla ettans nio stämplar är klara. Avslutningen och minnesboken erbjuder då ingen fortsättning till tvåan. Lärarvyn finns inte i denna elevvy.

Elevvyn begränsar äppelförrådet till högst ett äpple. Ett äpple används till ett nytt försök på hela områdesprovet. Därefter behöver eleven avsluta en ny repetition hos Rut för att få ett nytt. Repetition med ett äpple kvar är fortfarande gratis men ger inget extra äpple och lovar ingen ny belöning. Sparade och importerade förråd över ett begränsas vid öppning; svar, stämplar, daler och historik behålls. Det vanliga spelets äppelförråd påverkas inte.

Instruktioner, knappar och återkoppling i ettan är anpassade för elever som arbetar själva i årskurs 6. Frågornas formuleringar, ämnesbegrepp och bedömningskrav är bevarade. Manuell granskning kräver en sexsiffrig lärarkod, vars klartext aldrig publiceras eller sparas i spelet. Det är en lokal klassrumsspärr, ingen serverbaserad behörighet. Vid osäkert svar kan eleven i stället avsluta en ny repetitionsomgång hos Rut och göra om hela områdesprovet utan hjälp. Det nya provförsöket kostar ett äpple och ger ingen stämpel förrän provet är klart. Se YEAR6_LANGUAGE_AND_REVIEW.md.

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

## Stegvis fler hot · 2.13.0

Alternativ direktlänk för elevläget: `?only=2&chapter=2&v=2.15.0`. Samma sparning, äppelgräns och kapitelspärrar används. Kapitel 1–2 behåller den befintliga ficktjuven. Hunden introduceras i kapitel 3 och den vaktande tjuven i kapitel 4, när dessa kapitel senare blir aktuella för eleverna. De nya hoten tar ett äpple vid kontakt; ett nytt tjänas genom en hel vanlig repetitionsomgång hos Rut. Inga klarade frågor eller stämplar försvinner. Se `EVENT_SYSTEM.md`.

## Nya försök och Rut · 2.13.0

”Ändra mitt svar” och omprov efter granskning kostar också exakt ett äpple och startar från första frågan. Utan äpple går eleven till Rut och gör en hel gratis repetitionsomgång. Rut går alltid att besöka; att läsa återkoppling och få lärarens godkännande är gratis. Elevlänkens kapitel 1–2, sparning och gräns på ett äpple behålls.

## Rut börjar med frågan eleven behöver öva · 2.14.0

Både felaktiga och osäkra huvudprovsvar följer med till Rut. Den aktuella frågan prioriteras före blandad repetition; förklaringar övas med sina ursprungliga delfrågor. Klarade stämplar och sparade svar påverkas inte. Samma elevlänk och sparning används. Se YEAR6_LANGUAGE_AND_REVIEW.md.

## Båda klasslänkarna omfattar kapitel 2 · 2.15.0

De redan delade adresserna för 6A (`v=2.7.1`) och 6B (`v=2.9.0`) känns igen vid öppning. I ett giltigt elevläge höjs kapitelgränsen till två; efter första öppningen kan adressfältet visa `only=2`. Eleverna behöver ladda om sin befintliga länk och behöver inte börja om eller få en ny länk. Båda använder den aktuella gemensamma spelkoden med samma Rut-repetition, äppelregler, frågor, ljud och animationer. Ingen klass får ett separat kodpaket.

Samma `lesson.1.`-sparning och eventuella befintliga omspelningar används. Äppelförrådet begränsas fortfarande till ett och lärarvy/kapitelprov är avstängda. Tvåan visas i menyn, öppnas efter klar etta och ger ingen fortsättning till trean. Vanliga `only=1`-länkar med andra versionsmarkörer ändras inte. `class-links.cjs` provar båda exakta klasslänkarna, nio-stämpelskravet, resurs- och svarssparning, bryggan till kapitlet, omspelning, spärrar och oförändrad etta för andra länkar.

## Hatthandeln från kapitel 3 · 2.16.3

Hatthandeln introduceras först i kapitel 3, när Hattarna och Mössorna ingår i innehållet. Båda klassernas befintliga länkar behåller kapitelgränsen 1–2 och visar ingen butik eller garderobsknapp. Tidigare inköp bevaras och kan användas när senare kapitel blir aktuella. Mössor kostar där 2 daler och en trekantshatt 4. Frågebank, Rut, ett äpple åt gången och lärargranskning behålls. Se HAT_SHOP.md.

Barnets samtal återbetalar inte längre stulna daler (2.16.3). Pengarna återfås efter lyckad jakt och rätt svar på tjuvens minnesfråga. En tjuv som kommer undan behåller summan. Äldre sparningar och tidigare faktiska återbetalningar bevaras.

## Bonusäpplet vid Herrgården · 2.17.2

Båda klassernas befintliga länkar får ett frivilligt äppeläventyr. Tom ficka, fysisk plockning, flykt från herrgårdens ägare och rätt svar på en redan mött minnesfråga krävs. Ett bonusäpple per kapitel och omgång; högst ett i fickan. Ett felaktigt svar går vidare till övning hos Rut. Rut kan fortfarande ge fler genom hela repetitionsomgångar. Kapitlen 3–10 och hatthandeln är fortsatt stängda i klasslänkarna. Se ORCHARD.md.


### Direkt plockning och patrullerande ägare · 2.17.2

Äppelträdet är flyttat helt utanför djurhagen till gräset norr om herrgårdsvägen. Ägaren går en patrullrunda före plockningen. Mellanslag nära trädet tar äpplet direkt, även under pågående gång, utan valmenyer. Jakten börjar efter ett kort rop från ägarens faktiska plats. Spelaren springer själv med piltangenterna eller klickar en plats i världen. Gömställe, minnesfråga, tom ficka och sparat tak på ett bonusäpple per kapitel behålls. Båda klasslänkarna använder samma ändring.
