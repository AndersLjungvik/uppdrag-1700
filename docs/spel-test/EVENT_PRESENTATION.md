# Scener och sidoäventyr – 2.0.8

Amira, Elin och Jo talar i första person. Maja får svaret ”Självklart!”. ”Se brevet”, ”Se protokollet” och ”Se handelslistan” öppnar de befintliga arbetsnärbilderna. Samma närbild används genom svar, återkoppling och nytt försök; Arkivet använder Ruts befintliga skrivbord. Minnesboken är fortfarande en separat översikt. Kajens gemensamma kameraprojektion fyller hela bildytan utan sidofält och används även av figurer och klickytor.

Kusken, smeden, barnet och ficktjuven använder `UPPDRAG_MEETINGS.drawMapPerson`. Vagnen visas uppifrån med en separat kusk. Berättartext och information om spelregler läses inte som repliker. Kusken berättar i första person vad hen behöver hjälp med. Barnet berättar vad det såg och kan lämna tillbaka en tappad daler.

## Samtal och vagnen

En avlägsen klickning startar vanlig gång längs vägarna. Samtalet öppnas först inom 95 världspunkter, med fri väg till personen/vagnen. Kusken ber om smedens råd; smeden ger rådet i en replik; spelaren måste sedan gå tillbaka till vagnen och erbjuda sin hjälp. Avstånd och uppdragsstatus kontrolleras även när lösningen utförs. Inga undersöknings- eller tankepausmenyer behövs.

Barnet, kusken och smeden fortsätter samtalet med klick på pratbubblan, Enter eller mellanslag. Knappar visas när spelaren gör ett verkligt val. En tidig tangentkoppling hindrar världens rörelsekontroller från att fånga Enter före dialogen. Tangentbordsfokus följer pratbubblans SVG-kontur; webbläsarens rektangulära fokusram visas inte runt pratbubblan. Högkontrastläget behåller en synlig fokusmarkering. Tjuvens utrop släcks både i textlagret och i SVG-lagret, inklusive vid rumsbyte och avslutad jakt.

Svarsalternativ som ”Jag frågar smeden”, ”Självklart!” och barnets svarsalternativ visas utanför den talandes bubbla, i en separat yta märkt ”Du svarar”. Bubblan innehåller enbart den personens replik. Svaret väljs fortfarande med ett klick eller Enter/mellanslag. Plats reserveras för svaren så att ytorna inte överlappar i mobilbredd, och svaren stängs när nästa replik visas eller samtalet avslutas.

## Tjuvmötet

Tjuven väntar bakom ett befintligt, målat träd nära spelarens väg. Först när spelaren har passerat lämnar den gömstället och följer efter. Trädkronan ritas framför figurerna så att gömstället också syns i bilden. Ansmygningen börjar i 135 världspunkter per sekund och ökar till 165; spelaren går i 180. Inom 34 punkter efter minst 1,6 sekunders synlig rörelse tas en daler. Spelaren ropar ”Mina pengar!” utan att spelet pausas.

Spelaren kan före stölden bryta förföljandet genom att börja ett samtal med en person på plats eller faktiskt gå in genom en dörr. Ett avlägset klick på en person eller ett hus ger inget omedelbart skydd. I klassiska kapitel, där de vandrande personerna tidigare saknade gatans samtalskontroll, får de en kort naturlig hälsning med samma pratbubbla och tangentstyrning som sidoäventyren. Befintliga gatdialoger i övriga kapitel fungerar också som skydd. Ett klick på den synliga förföljaren får spelaren att ropa ”Varför följer du efter mig?”.

Ett träd ger skydd när kronan faktiskt bryter sikten mellan tjuven och spelaren. Tjuven går till platsen där den senast såg spelaren, ser sig omkring och återvänder sedan längs sin verkliga gångväg till gömstället. Återfår den sikten fortsätter den att följa efter. Samtal och husbesök ger samma synliga reträtt efter en kort tvekan. Ingen figur tonas bort ute på öppen mark. Efter en undvikning krävs minst 12 sekunder och ytterligare 280 gångpunkter innan ett nytt försök kan börja.

Efter stölden springer tjuven i 125 punkter per sekund längs framkomlig mark och vägar till ett annat träd. Vägberäkningen ansluter även punkter långt från vägen; att stanna ute på marken får inte längre tjuven att försvinna. Spelaren kan styra själv, klicka på tjuven eller välja ”Spring efter tjuven”. Inom 36 punkter efter att jakten startat öppnas en minnesfråga. Rätt svar ger tillbaka samma daler en gång; fel svar eller stängning låter tjuven komma undan. Frågan visas på ett separat frågekort och läses inte som tjuvens replik. I kapitel 1 väljs bara redan mötta lärlingsfrågor; tjuven väntar tills det finns en sådan fråga.

Den som låter tjuven komma undan kan fortfarande tala med barnet vid torget. Minnesboken, andra översikter och en dold flik pausar rörelsen. Att söka skydd efter stölden avslutar jakten utan återbetalning: tjuven fortsätter fysiskt till sitt gömställe, och barnet finns kvar. Att lämna området eller ladda om avslutar jakten utan ytterligare avdrag. Elevsvar och provstämplar påverkas inte. Lärarvyns demonstration ändrar ingen valuta. Kapitel 6 behåller sin äldre, separata tjuvhändelse för att undvika dubbla möten.

## Kontroller

- `npm run test:scenes`: riktiga samtalsknappar, målade närbilder, frågeåterkoppling, mobil, kajutsnitt och återgång till rummet.
- `npm run test:events`: befintliga träd, sikt och sökande, skydd genom verkliga samtal och dörrar, skydd efter stöld utan extra valuta, ansmygning utanför vägen, väghörn, paus, verklig jakt, minnesfråga, flykt, återbetalning, bubblornas avslut, vagn/smed/vittne, verklig gång mellan vagn och smed, tangentstyrning och omladdning.
- `npm run test:mastery`: kapitel 1:s frågor, nivåer och sparning.

Webbläsartester använder Playwright och kan få sökvägen till Chromium via `CHROMIUM_PATH`. `event-engine.cjs` använder avkodade originalkällor; kör `python docs/spel/decode_sources.py` först.
