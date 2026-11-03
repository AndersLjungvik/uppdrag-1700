# Kapitel 1: elevspråk och granskning · 2.8.0

Instruktioner, knappar och återkoppling ska fungera för en elev i årskurs 6 som repeterar på egen hand. Frågornas innehåll och typer, ämnesbegrepp, exempelsvar, källor och kunskapskrav behålls. En kort text ska säga vad eleven kan göra härnäst.

| Tidigare text | Ny text |
| --- | --- |
| Innehållskraven känns igen | Bra! Du fick med det som frågan ber om. |
| Bearbeta mitt svar | Ändra mitt svar |
| Spara för lärargranskning | Spara och visa läraren |
| Ge ett konkret exempel på ojämlikt inflytande. | Ge ett exempel på att stånden inte fick bestämma lika mycket. |
| Detta är en försiktig regelkontroll. | Spelet är osäkert på ditt svar. Det kan ändå vara rätt. |

`pupil-language.js` ändrar fasta gränssnittstexter efter frågeanpassningen i ettan. Återkopplingens kriterier får enklare formuleringar först när de visas. Bedömningen använder sina ursprungliga etiketter och regler. Därmed ändras varken vilka innehållskrav som kontrolleras eller vad som godkänns. Texten vid exempelsvar i `questions/alignment.js` är också kortare; den delas av kapitlen.

SPSM rekommenderar tydliga instruktioner i få steg och texter där centrala ämnesord finns kvar. Det är stöd för riktningen i arbetet, inte evidens för att just dessa gränssnittstexter är optimala. Faktisk begriplighet behöver följas upp i elevgruppen.

- https://www.spsm.se/stod-och-rad/undervisning/tydliggorande-pedagogik/
- https://www.spsm.se/for-laromedelsproducenter/producera-tillgangliga-laromedel/egenskaper-och-funktioner-som-okar-tillgangligheten/lattlast/

## Lärargranskning

Kryssrutan ”Jag är lärare” är borttagen i ettan. Läraren läser elevens sparade svar och exemplet på elevens enhet, skriver en sexsiffrig kod och väljer ”Godkänn svaret”. Koden visas inte i spelet, ingår inte i sparfiler eller tester och lagras inte när den skrivs. Endast en saltad kontrollsumma finns i den publicerade modulen. Tom eller felaktig kod kan inte ge godkännande genom gränssnittet. Ett godkännande loggas fortfarande som `teacher-approved`, aldrig som självständig automatisk prestation.

Detta är en praktisk klassrumsspärr i den befintliga statiska appen. Det är inte säker lärarautentisering: både program och sparningar finns i elevens webbläsare. Läraridentitet och betrodda framsteg kräver en serverkontrollerad lösning. Den lärarvy som öppnas med URL-parametern är fortfarande en separat testomgång, inte en väg till elevens granskning.

## Nytt försök efter övning

Efter ett osäkert svar kan eleven välja ”Öva och prova igen”. Svaret bevaras i granskningskön och ett önskemål om nytt prov sparas för just områdets pågående försök. Eleven går till Rut och slutför en ny repetitionsomgång. Att öppna Arkivet, ladda om eller byta område räcker inte.

En avslutad Rut-omgång registreras även när eleven redan har sitt enda äpple. Dessutom måste minst två registrerade svar skilja senaste visningen av områdets exempelsvar från det nya provet. Visning av lärargranskning räknas också som att läsa exemplet. Ingen exponeringshistorik raderas för att få svaret att räknas som självständigt.

Tillbaka på plats kan eleven välja ”Prova igen utan hjälp”. `reopenPending()` öppnar endast status `pending`; därefter skapar den vanliga provstarten ett nytt försöksnummer. Hela områdesprovet börjar från första frågan med tomma svarsfält. Tidigare granskning märks `practice-retry` och bevaras, men räknas inte som ett godkännande. Andra stämplar och världshändelser behålls. Detta förbrukar inget äpple eftersom ett osäkert svar inte är ett fastställt fel. Ett faktiskt misslyckat prov kräver fortfarande ett äpple för omstart.

## Kontroller

- Språkprov: unika textankare, giltig genererad kod, identiska data för alla 78 frågor och 234 oförändrade bedömningar; kriterier förenklas bara vid visning.
- Progressionsprov: väntande prov kan öppnas en gång efter kapitelkodens kontroll; inget äpple eller stämpel tillkommer och andra områden bevaras.
- Kodprov: tom/felaktig kod, korrekt testkod, samtidiga verifieringar och avsaknad av kryptostöd.
- Webbläsarprov: riktig granskningsväg, fel/rätt kod, ny Rut-omgång, omladdning/områdesbyte, nytt försöksnummer, två frågor från början utan stöd samt bevarade historikposter. Hela ettans tidigare prov, elevlänkens kapitelspärr och äppelgräns körs också.

Lokala tester använder en särskild testkod genom att ersätta kontrollsumman i testets nätverkssvar. Med `GAME_TEACHER_CODE` verifieras den publicerade modulen direkt, utan ersättning. Produktionskoden får aldrig skrivas in i testfiler eller publicerade dokument.

Publicering: endast `docs/spel-test/` på main. Ordinarie `docs/spel/` på main behålls, PR 4 förblir draft och befintliga sparnycklar används.
