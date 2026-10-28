# Scener och sidoäventyr – 2.0.4

Amira, Elin och Jo talar i första person. Maja får svaret ”Självklart!”. ”Se brevet”, ”Se protokollet” och ”Se handelslistan” öppnar de befintliga arbetsnärbilderna. Samma närbild används genom svar, återkoppling och nytt försök; Arkivet använder Ruts befintliga skrivbord. Minnesboken är fortfarande en separat översikt. Kajens gemensamma kameraprojektion fyller hela bildytan utan sidofält och används även av figurer och klickytor.

Kusken, smeden, barnet och ficktjuven använder `UPPDRAG_MEETINGS.drawMapPerson`. Vagnen visas uppifrån med en separat kusk. Berättartext och information om spelregler läses inte som repliker. Kusken berättar i första person vad hen behöver hjälp med. Barnet berättar vad det såg och kan lämna tillbaka en tappad daler.

## Samtal och vagnen

En avlägsen klickning startar vanlig gång längs vägarna. Samtalet öppnas först inom 95 världspunkter, med fri väg till personen/vagnen. Kusken ber om smedens råd; smeden ger rådet i en replik; spelaren måste sedan gå tillbaka till vagnen och erbjuda sin hjälp. Avstånd och uppdragsstatus kontrolleras även när lösningen utförs. Inga undersöknings- eller tankepausmenyer behövs.

Barnet, kusken och smeden fortsätter samtalet med klick på pratbubblan, Enter eller mellanslag. Knappar visas när spelaren gör ett verkligt val. En tidig tangentkoppling hindrar världens rörelsekontroller från att fånga Enter före dialogen. Tjuvens utrop släcks både i textlagret och i SVG-lagret, inklusive vid rumsbyte och avslutad jakt.

## Tjuvmötet

Tjuven börjar 145–240 världspunkter bort på spelarens gångväg och följer den i 105 punkter per sekund. Alla hörn och framkomlighet kontrolleras. Inom 34 punkter efter minst 1,6 sekunders synlig rörelse tas en daler. Spelaren ropar ”Mina pengar!” utan att spelet pausas. Tjuven springer längs befintliga vägar i 125 punkter per sekund; spelaren rör sig i 180. Spelaren kan styra själv, klicka på tjuven eller välja ”Spring efter tjuven” för att följa med spelets vanliga vägberäkning. Inom 36 punkter efter att jakten startat öppnas en minnesfråga. Rätt svar ger tillbaka samma daler en gång; fel svar eller stängning låter tjuven komma undan. Frågan visas på ett separat frågekort och läses inte som tjuvens replik. I kapitel 1 väljs bara redan mötta lärlingsfrågor; tjuven väntar tills det finns en sådan fråga.

Den som låter tjuven komma undan kan fortfarande tala med vittnet. Andra samtal och en dold flik pausar rörelsen. Att lämna området eller ladda om avslutar jakten utan ytterligare avdrag; vittnets fortsättning finns kvar. Elevsvar och provstämplar påverkas inte. Lärarvyns demonstration ändrar ingen valuta. Kapitel 6 behåller sin äldre, separata tjuvhändelse för att undvika dubbla möten.

## Kontroller

- `npm run test:scenes`: riktiga samtalsknappar, målade närbilder, frågeåterkoppling, mobil, kajutsnitt och återgång till rummet.
- `npm run test:events`: ansmygning, väghörn, paus, verklig jakt, minnesfråga, flykt, återbetalning, bubblornas avslut, vagn/smed/vittne, verklig gång mellan vagn och smed, tangentstyrning och omladdning.
- `npm run test:mastery`: kapitel 1:s frågor, nivåer och sparning.

Webbläsartester använder Playwright och kan få sökvägen till Chromium via `CHROMIUM_PATH`. `event-engine.cjs` använder avkodade originalkällor; kör `python docs/spel/decode_sources.py` först.
