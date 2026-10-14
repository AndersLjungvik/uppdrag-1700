# Förberedelse: Google-inloggning och sparsynkning

Status: fristående, testad adapter i utvecklingsgren. Inte inkopplad i det publicerade spelet. Ingen databas eller Google-app har skapats, och inga elevuppgifter skickas. GitHub Pages fortsätter vara spelvärd; Firebase Authentication och Firestore är en möjlig extern backend. Valet behöver bekräftas före aktivering.

## Det som är förberett

`google-sync.mjs` använder Googles modulära Firebase-SDK för explicit kontoval, inloggning, hämtning och transaktionsskyddad sparning. `firestore.rules` är ett förslag som begränsar åtkomst till det egna kontots sparläge och rätt skolkontodomän. Klientens domänkontroll ersätter inte databasregler. Namnfältet utelämnas ur spelkopian; svarshistorik och övriga speldata kan fortfarande vara personuppgifter när de kopplas till ett konto.

`practice` kan bära senaste övningstid per kunskapsområde och kommande repetitionsdatum. Modulen väljer ännu inga repetitionsfrågor och mäter ännu inte aktiv speltid. Den sparar första och senaste molnsparning, inte första historiska spelbesöket. Dessa tidpunkter ska införas i spelets lokala tillstånd när integrationsarbetet görs.

## Aktivering och integration

1. Skolan bekräftar lämplig tjänst, ansvarig projektägare och hantering av elevdata. Kontrollera den faktiska domänen för elevkonton; här finns bara exempel, inga antagna elevdomäner.
2. Skapa skolägt Firebase-projekt, registrera webbapp, aktivera Google-inloggning och skapa Firestore-databas med vald region. Aktivera inte Analytics för detta ändamål. Kontrollera aktuella kostnadsgränser och kvoter före lansering.
3. Lägg till `andersljungvik.github.io` som auktoriserad domän. Kontrollera skolans Workspace-inställningar för elevernas åtkomst till appen.
4. Ersätt domänplatshållaren i reglerna med den verifierade och regex-escapade elevdomänen. Prova reglerna med Firebase Emulator: fel användare, fel domän, ej verifierad e-post, listning och otillåtna fält ska nekas. Publicera först efter dessa tester.
5. Koppla adaptern till spelets startskärm och save-funktion. Börja med `enabled: false`. Ladda SDK först när molnfunktionen konfigurerats och eleven väljer inloggning. Web-appens Firebase-konfiguration är publik; lägg aldrig servicekontonycklar eller andra serverhemligheter i repot.
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

Sex adaptertester passerar med simulerad Firebase: avstängd konfiguration, krav på inloggning, skolkontodomän, sparning utan namn, konflikt mellan enheter och utloggning. Riktig OAuth, SDK-nätladdning, databasregler och integration i spelets UI är ännu inte verifierade.

## Primärkällor

- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/web/alt-setup
- https://firebase.google.com/docs/rules/rules-and-auth
- https://firebase.google.com/docs/firestore/security/rules-conditions
