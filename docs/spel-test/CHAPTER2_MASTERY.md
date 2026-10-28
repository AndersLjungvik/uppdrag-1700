# Kapitel 2 – Fria och ofria

Version 2.1.1. Samma stad, interiörer, personer och femton sammansatta återkallningsuppgifter som i det befintliga kapitlet. Varje uppgifts delkrav, sant/falskt-rättelse, källhänvisning och bedömningsunderlag behålls.

| Område | Plats och person | Ämnen per nivå |
| --- | --- | --- |
| Kvinnors villkor | Kyrkan, Olof | Gift/ogift och utsatthet vid ogift graviditet |
| Makt och lydnad | Kyrkan, Olof | Religionens motivering och familjens/adelns makt |
| Barnens vardag | Barnhuset, Siri | Orsaker, arbete och levnadsvillkor på barnhus |

Eleven väljer områdesordning inom lärling, gesäll och mästare. Alla tre stämplar på en nivå krävs före nästa nivå; alla tre mästarstämplar öppnar kapitel 3. I Kyrkan väljs en av två handlingar med spelarens svar utanför Olofs pratbubbla. Samtalen använder första person och samma pappersfigurer som tidigare. Uppgifterna, återkopplingen och granskningen ligger i kyrkans respektive barnhusets målade arbetsnärbild.

Ett äpple ger ett helt nytt försök på det misslyckade områdesprovet. Övriga områden och världshändelser behålls. Endast lärlingsledtrådar kostar en daler. Osäkra formuleringar går till lokal granskning utan automatisk stämpel; lärarbekräftelse loggas uttryckligen. Rut är gratis, kan ge äpplen och repeterar både kända ämnen från ettan och sådant eleven hunnit möta i tvåan. Varken Rut eller tjuven hämtar uppgifter från framtida kapitel. Saknas tidigare ämnen finns en kort introduktionsreserv hos Rut.

## Sidouppdrag och spänning

Den generiska vagnsblockaden är avstängd i tvåan. Kusken har en fungerande vagn parkerad vid sidan av gatan vid Barnhuset och lämnar varor. Han säger inget om hjulaxel eller smed och startar inget reparationsärende. Äldre sparad vagnsstatus raderas inte; den används inte för att återaktivera blockaden.

Det frivilliga uppdraget **Sängen vid fönstret** följer Barnhuset → Karin i Bostadskvarteren → tillbaka till barnet. Barnet eller den verkliga sängen kan väljas. Siri har försökt laga tyget; Karin hjälper till med en tillräckligt stor lagning. På Karins tygbord väljs tygbit och placering med klick eller tangentbord. En bred bit eller två överlappande smala fungerar. För små eller felplacerade bitar ger gratis återkoppling. Färg bedöms inte, och en frivillig visningshjälp kostar inget. Karins korta sömnad kräver ingen väntetid; reducerad rörelse visar resultatet direkt.

Det lagade täcket kan lämnas direkt, även om kunskapsområden återstår. Barnet väljer segel eller ränder när spelaren visar en dekorlapp. Sängen får samma lagning och mönster vid återladdning. Korta återbesök ersätter nya beställningar. Barnets, Karins och Siris repliker visas en åt gången i deras personanknutna pratbubblor; spelarens val finns utanför bubblan. Sidoäventyret ger inga kunskapsstämplar, daler eller äpplen och påverkar inte kapitlets spärrar. Det är en fiktiv lokal händelse och ändrar inte uppgifternas historiska beskrivning av barnhusens villkor.

Den gemensamma tjuven använder samma gömställen, sikt, samtalsskydd, husbesök, fysiska jakt och återkomst efter nya intäkter som i ettan. Minnesfrågan hämtas endast från redan mötta ämnen, även kända ämnen från ettan. En stöld kostar högst en daler. Återbetalningar ger inte en ny återkomst. Sidohändelser ger inga kunskapsstämplar. Omprov rör inte täcket, äldre vagnsstatus, tjuvhistoriken eller personernas bemötande.

## Sparning och migration

- Ursprunglig kapitelsparning: `uppdrag1700.ch2-real-world.20261019.v1`.
- Kunskap: `uppdrag1700.mastery.v1.ch2`.
- Berättelse och personer: `uppdrag1700.story.v2.ch2` respektive `uppdrag1700.people.v2.ch2`.
- Gatuhändelser: befintlig `uppdrag1700.side-adventures.v1`, kapitel 2.
- Täcket: `uppdrag1700.ch2-window-bed.v1` med faserna available, accepted, repairing, ready och delivered; pusselläggning, mönster och återbesöksminne sparas separat.

Vid första övergången till den nya modellen sparas hela äldre kapitelsparningen med suffix `.before-mastery-2`. Svar, resurser och äldre försöksnummer finns kvar. Ett äldre `complete:true` ger inga stämplar. Bara fullständiga, styrkta deluppgifter från sammanhängande äldre platsförsök kan överföras. Svar från olika försök på samma gamla plats slås inte ihop. Äldre poster markeras så att de inte automatiskt godkänner ett nytt försök med ett återanvänt försöksnummer. Befintlig valuta ökas inte vid migration.

Normal spelgång kräver ettans verkliga mästarstämplar för tvåan och tvåans för trean. Lärarvyn har fortsatt separat sparning och fria kapitelval. En länk med både `testChapter=2` och ett giltigt `replay`-id öppnar en isolerad elevomgång från kapitel 2, med vanlig ekonomi och tjuv. Den gör inga stämplar i ettan. Vid färdigt kapitel 2 kan just den provomgången fortsätta till trean. Utan separat omgång ger `testChapter=2` ingen genväg. Meny → Spela om kapitel 2 skapar en ny isolerad omgång; Till ordinarie omgång går tillbaka till tidigare framsteg.

## Verifiering

`npm run test:chapter2` täcker alla femton uppgifter, valfri ordning, nivåspärrar, sant/falskt-rättelse, ledtråd, helt äppelomprov, Rut över kapitelgränsen, granskning och återladdning. Det kontrollerar verkliga NPC-val, befintliga närbilder, dator/mobilbredd, gamla styrkta och ostyrkta sparningar, blandade försöksnummer, resursbevarande, isolerat kapitelprov och ordinarie spärrar. Världstestet kontrollerar kuskens nya placering och att ett gammalt smedärende inte återkommer, jagar tjuven med täcket i behåll, tjänar en riktig uppdragsbelöning och får ett andra tjuvmöte i samma kapitel. Täcket provas med avböjande, Karin före/efter uppdraget, verkliga promenader mellan husen, båda pussellösningarna och mönstren, fri hjälp, stängning, omladdning, export/import, tangentbord och reducerad rörelse. Kunskap och valuta jämförs före och efter. Inga kartor eller vägar byggs om.
