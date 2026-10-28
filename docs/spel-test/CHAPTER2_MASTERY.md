# Kapitel 2 – Fria och ofria

Version 2.1.0. Samma stad, interiörer, personer och femton sammansatta återkallningsuppgifter som i det befintliga kapitlet. Varje uppgifts delkrav, sant/falskt-rättelse, källhänvisning och bedömningsunderlag behålls.

| Område | Plats och person | Ämnen per nivå |
| --- | --- | --- |
| Kvinnors villkor | Kyrkan, Olof | Gift/ogift och utsatthet vid ogift graviditet |
| Makt och lydnad | Kyrkan, Olof | Religionens motivering och familjens/adelns makt |
| Barnens vardag | Barnhuset, Siri | Orsaker, arbete och levnadsvillkor på barnhus |

Eleven väljer områdesordning inom lärling, gesäll och mästare. Alla tre stämplar på en nivå krävs före nästa nivå; alla tre mästarstämplar öppnar kapitel 3. I Kyrkan väljs en av två handlingar med spelarens svar utanför Olofs pratbubbla. Samtalen använder första person och samma pappersfigurer som tidigare. Uppgifterna, återkopplingen och granskningen ligger i kyrkans respektive barnhusets målade arbetsnärbild.

Ett äpple ger ett helt nytt försök på det misslyckade områdesprovet. Övriga områden och världshändelser behålls. Endast lärlingsledtrådar kostar en daler. Osäkra formuleringar går till lokal granskning utan automatisk stämpel; lärarbekräftelse loggas uttryckligen. Rut är gratis, kan ge äpplen och repeterar både kända ämnen från ettan och sådant eleven hunnit möta i tvåan. Varken Rut eller tjuven hämtar uppgifter från framtida kapitel. Saknas tidigare ämnen finns en kort introduktionsreserv hos Rut.

## Sidouppdrag och spänning

Kusken kör bröd och ved till Barnhuset. Hjälp kräver fysisk närhet till vagnen, ett besök hos smeden och återkomst till vagnen. När vagnen har hjälpts syns en brödkorg och ved i barnhusets befintliga rum och arbetsnärbild. Siri tackar för leveransen. Detta är en lokal berättelseföljd; det ändrar inte frågornas historiska beskrivning av barnhusens svåra villkor.

Den gemensamma tjuven använder samma gömställen, sikt, samtalsskydd, husbesök, fysiska jakt och återkomst efter nya intäkter som i ettan. Minnesfrågan hämtas endast från redan mötta ämnen, även kända ämnen från ettan. En stöld kostar högst en daler. Återbetalningar ger inte en ny återkomst. Sidohändelser ger inga kunskapsstämplar. Omprov rör inte vagnens tillstånd, varorna, tjuvhistoriken eller personernas bemötande.

## Sparning och migration

- Ursprunglig kapitelsparning: `uppdrag1700.ch2-real-world.20261019.v1`.
- Kunskap: `uppdrag1700.mastery.v1.ch2`.
- Berättelse och personer: `uppdrag1700.story.v2.ch2` respektive `uppdrag1700.people.v2.ch2`.
- Sidohändelser: befintlig `uppdrag1700.side-adventures.v1`, kapitel 2.

Vid första övergången till den nya modellen sparas hela äldre kapitelsparningen med suffix `.before-mastery-2`. Svar, resurser och äldre försöksnummer finns kvar. Ett äldre `complete:true` ger inga stämplar. Bara fullständiga, styrkta deluppgifter från sammanhängande äldre platsförsök kan överföras. Svar från olika försök på samma gamla plats slås inte ihop. Äldre poster markeras så att de inte automatiskt godkänner ett nytt försök med ett återanvänt försöksnummer. Befintlig valuta ökas inte vid migration.

Normal spelgång kräver ettans verkliga mästarstämplar för tvåan och tvåans för trean. Lärarvyn har fortsatt separat sparning och fria kapitelval. En länk med både `testChapter=2` och ett giltigt `replay`-id öppnar en isolerad elevomgång från kapitel 2, med vanlig ekonomi och tjuv. Den gör inga stämplar i ettan. Vid färdigt kapitel 2 kan just den provomgången fortsätta till trean. Utan separat omgång ger `testChapter=2` ingen genväg. Meny → Spela om kapitel 2 skapar en ny isolerad omgång; Till ordinarie omgång går tillbaka till tidigare framsteg.

## Verifiering

`npm run test:chapter2` täcker alla femton uppgifter, valfri ordning, nivåspärrar, sant/falskt-rättelse, ledtråd, helt äppelomprov, Rut över kapitelgränsen, granskning och återladdning. Det kontrollerar verkliga NPC-val, befintliga närbilder, dator/mobilbredd, gamla styrkta och ostyrkta sparningar, blandade försöksnummer, resursbevarande, isolerat kapitelprov och ordinarie spärrar. Världstestet löser vagn/smed, visar varorna hos Siri, jagar tjuven, tjänar en riktig ny uppdragsbelöning och får ett andra tjuvmöte i samma kapitel. Inga kartor eller vägar byggs om.
