# Förberedelse: Google-inloggning och sparsynkning

Status: adapter och spelkoppling implementerade i utvecklingsgren. Inte publicerat eller aktiverat för elever. Ingen databas eller Google-app har skapats, och inga elevuppgifter skickas. GitHub Pages fortsätter vara spelvärd; Firebase Authentication och Firestore är en möjlig extern backend. Valet behöver bekräftas före aktivering.

## Det som är förberett

`google-sync.mjs` använder Googles modulära Firebase-SDK för explicit kontoval, inloggning, hämtning och transaktionsskyddad sparning. `firestore.rules` är ett förslag som begränsar åtkomst till det egna kontots sparläge och rätt skolkontodomän. Klientens domänkontroll ersätter inte databasregler. Namnfältet utelämnas ur spelkopian; svarshistorik och övriga speldata kan fortfarande vara personuppgifter när de kopplas till ett konto.

`practice` kan bära senaste övningstid per kunskapsområde och kommande repetitionsdatum. Spelets läromästare väljer nu repetitionsfrågor från avslutade uppdrag och prioriterar förfallna frågor. Aktiv speltid mäts ännu inte. Den sparar första och senaste molnsparning, inte första historiska spelbesöket. Spelets lokala tillstånd registrerar nu besök och frågevisa övningstider.

## Aktivering och integration

1. Skolan bekräftar lämplig tjänst, ansvarig projektägare och hantering av elevdata. Elevkontodomänen är bekräftad av projektägaren: `edu.lerum.se`. Domänen är införd i klientkonfigurationen och databasreglerna; Firebase-projekt och skolans appåtkomst återstår.
2. Skapa skolägt Firebase-projekt, registrera webbapp, aktivera Google-inloggning och skapa Firestore-databas med vald region. Aktivera inte Analytics för detta ändamål. Kontrollera aktuella kostnadsgränser och kvoter före lansering.
3. Lägg till `andersljungvik.github.io` som auktoriserad domän. Kontrollera skolans Workspace-inställningar för elevernas åtkomst till appen.
4. Reglerna använder den bekräftade elevdomänen `edu.lerum.se`, med escapade punkter och fullständig domänmatchning. Prova reglerna med Firebase Emulator: fel användare, fel domän, ej verifierad e-post, listning och otillåtna fält ska nekas. Publicera först efter dessa tester.
5. Adaptern är kopplad via kontodialogen och spelets save-funktion. Konfigurationen är `enabled: false`. Ladda SDK först när molnfunktionen konfigurerats och eleven väljer inloggning. Web-appens Firebase-konfiguration är publik; lägg aldrig servicekontonycklar eller andra serverhemligheter i repot.
6. Efter explicit inloggning: hämta molnsparläget innan spelstart. Validiera det med spelets `loadState`. Finns en lokal gästhistorik, fråga innan den importeras till kontot. Håll gästsparning och varje UID:s lokala cache åtskilda. Vid utloggning ska elevens tillstånd lämna gränssnittet; nästa elev får inte ärva det.
7. Serialisera sparningar, fördröj täta HUD-uppdateringar och behåll lokal kö vid nätfel. Adaptern avvisar revisionskonflikter i stället för att skriva över en annan enhets nyare sparläge. Visa ett val att hämta nyare sparläge eller behålla en separat lokal kopia; skriv aldrig automatiskt över.
8. Provspela verklig Google-inloggning på skolans dator och mobil, återkomst efter flera dagar, nätavbrott, delad dator, kontobyte och parallella enheter. Molnfunktionen ska inte läggas in i fristående offlinefilen.

Exempel på anrop efter godkänd konfiguration:

```js
import {createGoogleSync, loadFirebaseSdk} from './google-sync.mjs';
const sync = createGoogleSync({
  config: {enabled: true, firebase: FIREBASE_WEB_CONFIG, allowedDomain: VERIFIED_STUDENT_DOMAIN},
  sdk: await loadFirebaseSdk()
});
await sync.init();
await sync.signIn();
const remote = await sync.load(); // render/validate remote or explicitly import local state
await sync.save(gameState, practiceHistory);
```

## Kontroll

`node --test preparation/google-sync/google-sync.test.mjs`

Sex adaptertester passerar med simulerad Firebase: avstängd konfiguration, krav på inloggning, skolkontodomän, sparning utan namn, konflikt mellan enheter och utloggning. Riktig OAuth, SDK-nätladdning och databasregler är ännu inte verifierade. Spelbryggan provas i simulerad UI-miljö; fullständig webbläsarkontroll återstår.

## Primärkällor

- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/web/alt-setup
- https://firebase.google.com/docs/rules/rules-and-auth
- https://firebase.google.com/docs/firestore/security/rules-conditions


## Projektkoppling och gemensam plan

Arbetsgrenen har nu `dist/cloud-ui.mjs`, en kontodialog och `cloud-config.js` med `enabled: false`. `game.js` erbjuder en brygga för kontoavskilda lokala sparlägen, inloggning, återställning och utloggning. GitHub Pages-bygget kopierar modulerna till `docs/`. Den fristående offlinefilen inkluderar tidslogiken men inte nätkopplingen.

`practice.js` registrerar första och senaste besök samt frågevisa övningstider och föreslagna repetitionsdatum. Endast ett rätt svar utan stöd efter minst ett verkligt dygn höjer repetitionsnivån. Detta är ett enkelt startförslag, ingen validerad optimal algoritm. Datum på enheten är ännu källan till övningstiderna; det är inget säkert bedömningsunderlag.

Spelversion 0.2 innehåller nu läromästaren, äpplen, gratis bokorakel och ett frivilligt miljöpussel i tryckeriet. Följande lista anger vad som finns och vad som återstår:

- Implementerat: läromästare med högst sex fria frågor från avslutade uppdrag, prioritering av förfallna frågor och tidigare fel samt återkoppling och bokhänvisning.
- Implementerat: äpplen som belöning vid minst 70 procent rätt, högst en gång per 24 verkliga timmar, och som extra ledtrådar i ett jobb. Gratis bokhänvisningar finns för alla.
- Planerat efter att SO-materialet finns: bokens ordning styr uppdragen, och föremål från ett uppdrag introducerar nästa. Bokhänvisningar stöds redan i frågebanken; inga faktiska sidnummer införs innan materialet är tillgängligt.
- Implementerat i tryckeriet: blytyper, papper och bläck kan tas och användas på pressen. Provtrycket kan lämnas i kaffehuset. Pusslet har gratis hjälp och behöver inte lösas för att arbeta. Fler miljöpussel återstår.
- Gemensamt klassäventyr på projektorn som introduktion. Varje elev får tänka innan klassen svarar.
- Textbundna frågor om uttrycklig information, sammanhang och slutsatser; läsning i uppdragen och försök utan bok hos läromästaren.
- Lekfull körning med hästdroska är en separat framtida idé.

Molnkonfigurationen behöver fortfarande kompletteras och integrationen behöver testas med riktiga skolkonton innan den aktiveras. Spelutvidgningarna fungerar lokalt och ingår i publiceringsversionen; Google-synkning är fortfarande avstängd.
