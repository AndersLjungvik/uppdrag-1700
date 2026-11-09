# Fiske vid vattnet · 2.19.0

Frivillig ny aktivitet från kapitel 4, spelbar i de färdiga kapitelpiloterna 4–5. Jo säljer ett spö i Kajens befintliga målade närbild för **10 daler**. Spöet är ett engångsköp som behålls över kapitel i samma spelomgång och ingår i sparfiler. Det stjäls inte av riskhändelserna. Ägda hattar, äpplen och kunskapsresultat berörs inte.

Själva fisket sker på världskartan vid nåbara stränder och kanalbankar, även på öarna. Spelaren kan gå fram själv eller klicka på vatten för att gå en riktig, gångbar väg till närmaste kant. Mellanslag vid vattnet eller den lokala Fiska-knappen kastar ut. Spelaren vänder sig mot vattnet och spö, lina och flöte ritas i samma karta och djupordning. Kartkameran flyttas inte av kastet. Jos närbild används till köpet; efteråt går man ut för att fiska. Efter 2,2–4 aktiva sekunder blir det napp och en kort skrivfråga. Ingen snabb reaktionskontroll krävs. Nytt mellanslag under väntan vevar in linan. Samtal och menyer pausar väntan; förflyttning från kastplatsen, resa, avbruten fråga eller omladdning ger ingen fångst.

Frågan väljs ur kapitelpilotens redan tillgängliga repetitionsunderlag, utan senare kapitels innehåll. Precis som andra minneshändelser används kortsvar på lärlingsnivå ur den befintliga bokfrågebanken. Svaret skrivs utan svarsalternativ. Rätt svar ger en fisk. Fel eller osäker formulering ger ett svarsexempel och övningsbehov hos Rut. Ett befintligt mer utvecklat övningsbehov i samma ämne behåller sin plats. Ingen huvudstämpel, lärargranskning eller tidigare provsvar ändras.

Korgen rymmer tre fiskar. I Barnhusets riktiga kök kan fångsten lämnas till Cajsa i fyran och Siri i femman, en daler per fisk och högst **tre betalda fiskar per kapitel**. Överlämningen kräver närvaro och sker genom en enkel knapp följd av en vanlig replik. Köket i fyran är en fiktiv dramatisering av samma slag som det befintliga besöket, ingen historisk uppgift om Cajsas kunder eller måltider. Kokboken, Karins grannmåltid och deras egna sparflaggor bevaras. En fiskleverans är ingen förutsättning för dem.

När beställningen är fylld kan spelaren fortsätta fiska för repetition och släppa tillbaka fisken efter rätt svar. Inga fler daler eller äpplen ges. Fiske skapar därmed ingen obegränsad resurskälla. Spöets pris och beställningsgräns är första spelbalanseringen och behöver följas i elevtest; inga effekter på motivation antas vara belagda.

`uppdrag1700.fishing.v1` sparar spö, fiskkorg, begränsade leveranser, senaste fråga och historik inom integrationens befintliga namnrymd. Debitering och leveranser skyddas mot upprepade klick; betalningskvitton hindrar dubbel kredit. Pågående väntan och napp återställs vid omladdning och kan inte ge en oförtjänt fisk. Elevomgång, vanlig omgång, lärarvy och replay har separata sparningar.

Strandkanterna beräknas från samma vatten, broar och byggnadskollisioner som spelarens gång. Figuren måste stå på torr, gångbar mark, linan får inte gå genom ett hus och flötet behöver hamna en bit ut i faktiskt vatten. Nya sjöar med riktig vattengeometri får automatiskt strandplatser. Dragning över vatten behåller kartans panorering. En närmare person behåller sin vanliga mellanslagsinteraktion; Fiska-knappen är ett uttryckligt val att fiska vid en sådan plats.

## Separat fisketest

`?chapter=4&testChapter=4&replay=fisketest-2190&fiske=test&v=2.19.0` öppnar ett separat kapitelprov. En tydlig introduktion erbjuder **12 testdaler en gång** efter Starta fisketestet. Tre tidigare bokminnen visas först och begränsar testets nappfrågor. Spelaren går den riktiga vägen till Kajen. I just detta separata test väntar ficktjuven tills spöet är köpt, så att testbudgeten räcker till det avsedda köpet. Inga gamla stämplar, huvudprovsvar eller klarflaggor skapas. Vanliga omgångar och klasslänkar kan inte få testpengar genom fiske-parametern: en särskild fyrans-replay utan elevbegränsning krävs.

De befintliga 6A- och 6B-länkarna behåller kapitel 1–2 och visar inget fiske eller spö. Hatthandeln börjar fortsatt i trean. Fisketestet delar inte deras sparning.

## Kontroller

`npm run test:fishing` kör ekonomimodellen samt de riktiga kapitelpiloterna, frågebanken, rättningen och tangentbordet för fyran och femman: exakt spöpris, fysisk närvaro, intryckt mellanslag, pauser, avbrott/omladdning, rätt/fel svar, Rut-prioritet, leveranstak, sparat spö och bevarade kunskapsresultat. Många verkliga stränder i alla tre kartor, godtycklig ny sjö, hus som skymmer vattnet, faktisk gångväg till strand, vattenklick utan teleport, bibehållen panorering, mellanslagsprioritet för människor och avbrutet kast vid gång kontrolleras också. Sammanfogade källankare och separat teststart kontrolleras. Visuell kontroll sker i den publicerade HTTPS-versionen eftersom den lokala HTTP-förhandsvisningen saknar spelets nödvändiga Web Crypto-stöd.
