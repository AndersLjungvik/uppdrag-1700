# Scener och sidoäventyr – 2.1.1

Amira, Elin och Jo talar i första person. Maja får svaret ”Självklart!”. ”Se brevet”, ”Se protokollet” och ”Se handelslistan” öppnar de befintliga arbetsnärbilderna. Samma närbild används genom svar, återkoppling och nytt försök; Arkivet använder Ruts befintliga skrivbord. Minnesboken är fortfarande en separat översikt. Kajens gemensamma kameraprojektion fyller hela bildytan utan sidofält och används även av figurer och klickytor.

Kusken, smeden, barnet och ficktjuven använder `UPPDRAG_MEETINGS.drawMapPerson`. Vagnen visas uppifrån med en separat kusk. Berättartext och information om spelregler läses inte som repliker. Kusken berättar i första person vad hen behöver hjälp med. Barnet berättar vad det såg och kan lämna tillbaka en tappad daler.

## Samtal och vagnen

Vagnens reparationsuppdrag gäller inte kapitel 2. Där står kusken med hel vagn vid Barnhuset. Tvåans eget frivilliga uppdrag är det trasiga täcket: Barnhuset → Karin i Bostadskvarteren → barnet väljer lapp och sängen förändras. Äldre vagnsstatus bevaras utan att aktivera smeden. Se CHAPTER2_MASTERY.md.

En avlägsen klickning startar vanlig gång längs vägarna. Samtalet öppnas först inom 95 världspunkter, med fri väg till personen/vagnen. Kusken ber om smedens råd; smeden ger rådet i en replik; spelaren måste sedan gå tillbaka till vagnen och erbjuda sin hjälp. Avstånd och uppdragsstatus kontrolleras även när lösningen utförs. Inga undersöknings- eller tankepausmenyer behövs.

Barnet, kusken och smeden fortsätter samtalet med klick på pratbubblan, Enter eller mellanslag. Knappar visas när spelaren gör ett verkligt val. En tidig tangentkoppling hindrar världens rörelsekontroller från att fånga Enter före dialogen. Tangentbordsfokus följer pratbubblans SVG-kontur; webbläsarens rektangulära fokusram visas inte runt pratbubblan. Högkontrastläget behåller en synlig fokusmarkering. Tjuvens utrop släcks både i textlagret och i SVG-lagret, inklusive vid rumsbyte och avslutad jakt.

Svarsalternativ som ”Jag frågar smeden”, ”Självklart!” och barnets svarsalternativ visas utanför den talandes bubbla, i en separat yta märkt ”Du svarar”. Bubblan innehåller enbart den personens replik. Svaret väljs fortfarande med ett klick eller Enter/mellanslag. Plats reserveras för svaren så att ytorna inte överlappar i mobilbredd, och svaren stängs när nästa replik visas eller samtalet avslutas.

## Tjuvmötet

Tjuven väntar bakom ett befintligt, målat träd nära spelarens väg. Först när spelaren har passerat lämnar den gömstället och följer efter. Trädkronan ritas framför figurerna så att gömstället också syns i bilden. Ansmygningen börjar i 135 världspunkter per sekund och ökar till 165; spelaren går i 180. Inom 34 punkter efter minst 1,6 sekunders synlig rörelse tas en daler. Spelaren ropar ”Mina pengar!” utan att spelet pausas.

Spelaren kan före stölden bryta förföljandet genom att börja ett samtal med en person på plats eller faktiskt gå in genom en dörr. Ett avlägset klick på en person eller ett hus ger inget omedelbart skydd. I klassiska kapitel, där de vandrande personerna tidigare saknade gatans samtalskontroll, får de en kort naturlig hälsning med samma pratbubbla och tangentstyrning som sidoäventyren. Befintliga gatdialoger i övriga kapitel fungerar också som skydd. Ett klick på den synliga förföljaren får spelaren att ropa ”Varför följer du efter mig?”.

Ett träd ger skydd när kronan faktiskt bryter sikten mellan tjuven och spelaren. Tjuven går till platsen där den senast såg spelaren, ser sig omkring och återvänder sedan längs sin verkliga gångväg till gömstället. Återfår den sikten fortsätter den att följa efter. Samtal och husbesök ger samma synliga reträtt efter en kort tvekan. Ingen figur tonas bort ute på öppen mark. Efter en undvikning krävs minst 12 sekunder och ytterligare 280 gångpunkter innan ett nytt försök kan börja.

Efter stölden springer tjuven i 125 punkter per sekund längs framkomlig mark och vägar till ett annat träd. Vägberäkningen ansluter även punkter långt från vägen; att stanna ute på marken får inte längre tjuven att försvinna. Spelaren kan styra själv, klicka på tjuven eller välja ”Spring efter tjuven”. Inom 36 punkter efter att jakten startat öppnas en minnesfråga. Rätt svar ger tillbaka samma daler en gång; fel svar eller stängning låter tjuven komma undan. Frågan visas på ett separat frågekort och läses inte som tjuvens replik. I kapitel 1 och 2 väljs bara redan mötta lärlingsämnen; tvåan kan även använda kända ämnen från ettan. Tjuven väntar tills det finns en sådan fråga.

Tjuven kan återkomma i samma kapitelomgång när spelaren har tjänat minst en ny daler efter den senaste stölden. En återkomst kräver dessutom 30–50 sekunders synlig speltid efter den avslutade jakten och 450–749 gångpunkter efter den nya inkomsten. Tiden och sträckan varierar mellan möten och sparas, så att omladdning inte hoppar över vilan. Vilan räknas även medan spelaren arbetar i ett rum eller samtalar; tjuven kan bara visa sig ute i staden när arbetsytan och samtalet är stängda. En dold flik räknar inte ned vilan. Flera nya daler laddar ett nytt tillfälle; de köar inte ett angrepp per daler. Före stölden gäller fortfarande den kortare pausen efter att spelaren lyckats undkomma.

Återbetalning från jakten eller barnet räknas inte som ny inkomst. Varje möte tar högst en daler. Förlorade daler bokförs var för sig och kan återfås en gång hos barnet, även om tjuven hunnit återkomma under tiden. Barnets tidigare bemötande finns kvar. Äldre sparningar får den nya regeln utan att huvuduppdraget, vagnen, minnesboken eller valutan återställs. Ett avbrutet, omladdat tjuvmöte lämnar högst en förlorad daler och startar samma paus som ett avslutat möte.

Den som låter tjuven komma undan kan fortfarande tala med barnet vid torget. Minnesboken, andra översikter och en dold flik pausar rörelsen. Att söka skydd efter stölden avslutar jakten utan återbetalning: tjuven fortsätter fysiskt till sitt gömställe, och barnet finns kvar. Att lämna området eller ladda om avslutar jakten utan ytterligare avdrag. Elevsvar och provstämplar påverkas inte. Lärarvyns demonstration ändrar ingen valuta. Kapitel 6 behåller sin äldre, separata tjuvhändelse för att undvika dubbla möten.

## Kontroller

- `npm run test:scenes`: riktiga samtalsknappar, målade närbilder, frågeåterkoppling, mobil, kajutsnitt och återgång till rummet.
- `npm run test:events`: befintliga träd, sikt och sökande, skydd genom verkliga samtal och dörrar, skydd efter stöld utan extra valuta, två verkliga uppdragsbelöningar och återkommande stölder i samma kapitel, återbetalningar utan nytt angrepp, vilans sparning och äldre sparning, ansmygning utanför vägen, väghörn, paus, verklig jakt, minnesfråga, flykt, återbetalning, bubblornas avslut, vagn/smed/vittne, verklig gång mellan vagn och smed, tangentstyrning och omladdning.
- `npm run test:mastery`: kapitel 1:s frågor, nivåer och sparning.

Webbläsartester använder Playwright och kan få sökvägen till Chromium via `CHROMIUM_PATH`. `event-engine.cjs` använder avkodade originalkällor; kör `python docs/spel/decode_sources.py` först.
