# Gemensam mark och fria ansikten · 2.5.1

Kapitel 1–4 använder `scene-presence.js` för gatans kroppar, ritordning och pratbubblor. Frågor, belöningar, provstämplar och sparnycklar ändras inte.

Spelarens klickgång och piltangentsgång kontrollerar små sammanhängande steg mot både marken och människors kroppar. Stadsbor lämnar företräde åt en pågående gång: de kliver åt sidan och väntar. I en gränd som bara rymmer en person i bredd backar stadsbon först till en öppning och lämnar själva gånglinjen fri. Väggar och kroppar behåller sina avstånd; personer flyttas med begränsade steg. Om ingen fri passage finns stannar figuren. Samma fartgräns behålls. Rörliga stadsbor väjer mjukt och återgår till sina ärenden. En person som hålls för ett samtal ligger kvar på sin verkliga plats. Valda stadsbor vänder sig mot spelaren medan spelaren går fram; i samtalet vänder båda sig mot varandra och behåller avståndet genom båda talarnas repliker. Även en stilla hälsning får ömsesidig riktning. En hälsning släpps när spelaren fortsätter gå, så den inte låser gränden. Mellanslag använder samma fysiska närmande som klickning. Manuell gång avbryter väntande samtal och släpper stadsbon. Ett avslutande vägsegment kan sluta intill en upptagen mötespunkt så att dörrar och samtal fortfarande nås.

Personer, spelare och händelsefigurer målas i samma ordning efter deras läge på marken. Gatugrupper behåller sina kläder, föremål och hattar tillsammans i det lagret. Spelaren ritas därför omväxlande bakom och framför andra. Trädens tidigare skymning och tjuvens gömställen bevaras. Tjuven tillåts komma i fysisk kontakt för att stjäla och bli infångad; stölder och återbetalningar följer samma regler som tidigare.

Pratbubblornas placering tar hänsyn till alla synliga ansikten i scenen, inklusive spelaren och extra gäster som Cajsa. Papper och text flyttas tillsammans. Smala eller låga vyer kan använda en smalare bubbla eller begränsad höjd med rullning. Korta flikar pekar mot den som talar. Befintliga tangenter, svarsknappar och pappersmaterial används.

Alla källändringar har kontrollerade textankare i den frysta spelkoden. Modulen körs endast i de omarbetade kapitlen 1–4 och använder den befintliga spelloopen. Den skriver inga sparningar och tillför ingen egen animationsloop.

## Kontroll

`npm run test:presence` provar källankare, ansiktsfri placering i tre format, rörelse utan genomgång, sidosteg, trånga passager, ingen teleportering eller fartökning, en rörlig person mot en stillastående spelare samt gemensam ritordning. Webbläsarprovet använder en verklig stadsbo, faktiskt klick- och piltangentsstyrd gång, ett nåbart samtal samt båda talarna i dator-, mobil- och liggande vy. Synlig text kontrolleras också mot papprets form. Socialprovet använder vanlig klickning från fyra håll, verkligt närmande med mellanslag, båda talarnas riktning och en avbruten kontakt. I gränden mellan Vetenskapens hus och Kyrkan måste en verklig stadsbo backa till öppningen och lämna plats så att piltangenterna tar spelaren förbi. Samma passage och frivilliga hälsningar kontrolleras med minskad rörelse.

De befintliga händelseproven täcker vagnen/smeden/barnet, jakt och återbetalning. Treans världstest kontrollerar fysisk resa till Carlsten och återkomst via kajen. Dessa kontroller kompletterar den riktade geometrikontrollen.
