# Sidoäventyr – gemensamma figurer och synlig tjuv, 2.0.2

Kusken, smeden, barnet och ficktjuven använder `UPPDRAG_MEETINGS.drawMapPerson`, samma pappersfigurer och gångcykel som övriga invånare. Vagnen visas uppifrån med en separat kusk. Händelsernas knappar använder den gemensamma pappersstilen; talbubblan pekar på den faktiska figuren. Tjuvhändelsens berättartext märks som Berättaren.

Tjuven börjar cirka 145–240 världspunkter bort på en tidigare del av spelarens gångväg och följer den i 105 punkter per sekund. Alla hörn och framkomlighet kontrolleras. Mötet börjar först inom 34 punkter efter minst 1,6 sekunders synlig rörelse. Andra samtal pausar ansmygningen; rumsbyten och förflyttningar till helt andra platser tömmer gångspåret. Tjuven kan släpa efter om spelaren fortsätter gå snabbt. Efter mötet springer figuren tillbaka längs sin väg och tonas ut. Minnesduellen är fortfarande en repetitionsfråga, inte ett tidsbegränsat jaktspel.

Högst en daler riskeras. Vittnets fortsättning och sparade sidoäventyr använder samma format som tidigare. Kapitel 6 behåller sin befintliga tjuvhändelse för att undvika dubbla händelser. Minskad rörelse följer den gemensamma figurmotorns inställning; nödvändig förflyttning visas fortfarande.

## Kontroller

- `node docs/spel/tests/event-approach.cjs`: hörn, avstånd, paus, ankomst, flykt och blockerad väg.
- `node docs/spel/tests/event-engine.cjs`: integration, händelser och sparformat (kör `python docs/spel/decode_sources.py` först).
- `node docs/spel/tests/event-browser.cjs`: naturlig ansmygning i spelvärlden, daler, vagn, smed, vittne, omladdning och mobil.
- `npm run test:mastery`: kapitel 1:s frågor, nivåer och sparning.

Webbläsartester använder Playwright och kan få sökvägen till Chromium via `CHROMIUM_PATH`.
