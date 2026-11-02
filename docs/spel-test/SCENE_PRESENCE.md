# Gemensam mark och fria ansikten · 2.5.0

Kapitel 1–4 använder `scene-presence.js` för gatans kroppar, ritordning och pratbubblor. Frågor, belöningar, provstämplar och sparnycklar ändras inte.

Spelarens klickgång och piltangentsgång kontrollerar små sammanhängande steg mot både marken och människors kroppar. De väljer en kort passage runt en person och stannar om en smal passage saknar plats. Samma fartgräns behålls. Rörliga stadsbor väjer mjukt och återgår till sina ärenden. En person som hålls för ett samtal ligger kvar på sin verkliga plats. Ett avslutande vägsegment kan sluta intill en upptagen mötespunkt så att dörrar och samtal fortfarande nås.

Personer, spelare och händelsefigurer målas i samma ordning efter deras läge på marken. Gatugrupper behåller sina kläder, föremål och hattar tillsammans i det lagret. Spelaren ritas därför omväxlande bakom och framför andra. Trädens tidigare skymning och tjuvens gömställen bevaras. Tjuven tillåts komma i fysisk kontakt för att stjäla och bli infångad; stölder och återbetalningar följer samma regler som tidigare.

Pratbubblornas placering tar hänsyn till alla synliga ansikten i scenen, inklusive spelaren och extra gäster som Cajsa. Papper och text flyttas tillsammans. Smala eller låga vyer kan använda en smalare bubbla eller begränsad höjd med rullning. Korta flikar pekar mot den som talar. Befintliga tangenter, svarsknappar och pappersmaterial används.

Alla källändringar har kontrollerade textankare i den frysta spelkoden. Modulen körs endast i de omarbetade kapitlen 1–4 och använder den befintliga spelloopen. Den skriver inga sparningar och tillför ingen egen animationsloop.

## Kontroll

`npm run test:presence` provar källankare, ansiktsfri placering i tre format, rörelse utan genomgång, sidosteg, trånga passager, ingen teleportering eller fartökning, en rörlig person mot en stillastående spelare samt gemensam ritordning. Webbläsarprovet använder en verklig stadsbo, faktiskt klick- och piltangentsstyrd gång, ett nåbart samtal samt båda talarna i dator-, mobil- och liggande vy. Synlig text kontrolleras också mot papprets form.

De befintliga händelseproven täcker vagnen/smeden/barnet, jakt och återbetalning. Treans världstest kontrollerar fysisk resa till Carlsten och återkomst via kajen. Dessa kontroller kompletterar den riktade geometrikontrollen.
