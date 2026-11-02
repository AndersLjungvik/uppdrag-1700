# Gemensam mark och fria ansikten · 2.5.3

Kapitel 1–4 använder `scene-presence.js` för gatans kroppar, ritordning och pratbubblor. Frågor, belöningar, provstämplar och sparnycklar ändras inte.

Spelarens klickgång och piltangentsgång använder små stödytor vid fötterna. Bildrutor, kläder och armar får överlappa under en passage; stödytorna hålls isär. Vanliga stödytor har radie 6, medan en person som lämnar en särskilt smal passage kan använda en smalare profil. Gruppfigurer har separata stödytor för de målade personerna. Husens befintliga gånggränser behålls.

En stadsbo tar högst 14 världskoordinater åt sidan och väntar. Om gränden är smal blir steget mindre och spelaren kan göra en liten justering åt andra hållet. Stadsbon backar inte längs gatan för att frigöra hela bildrutan. Samma fartgräns och den befintliga spelloopen används. En vald person stannar direkt på den synliga platsen medan spelaren går fram. Under samtalet behåller båda sina platser och vänder sig mot varandra genom båda talarnas repliker. Mellanslag använder samma fysiska närmande som klickning. Manuell gång avbryter väntande kontakt och släpper personen. Ett avslutande vägsegment får sluta intill en upptagen punkt, med en liten numerisk marginal som hindrar cirklande runt personen.

Samtal centrerar inte om kameran. Vald panorerad vy behålls även under närmandet; vanlig kameraföljning pausar under replikerna. Både de ursprungliga gatupersonerna och de extra stadsfigurerna använder detta. Bubblan anpassas till den befintliga vyn. En hälsning släpps när spelaren fortsätter gå.

Personer, spelare och händelsefigurer målas i samma ordning efter deras läge på marken. Gatugrupper behåller sina kläder, föremål och hattar tillsammans i det lagret. Spelaren ritas därför omväxlande bakom och framför andra. Trädens tidigare skymning och tjuvens gömställen bevaras. Tjuven tillåts komma i fysisk kontakt för att stjäla och bli infångad; stölder och återbetalningar följer samma regler som tidigare.

Pratbubblornas placering tar hänsyn till alla synliga ansikten i scenen, inklusive spelaren och extra gäster som Cajsa. Papper och text flyttas tillsammans. Smala eller låga vyer kan använda en smalare bubbla eller begränsad höjd med rullning. Korta flikar pekar mot den som talar. Befintliga tangenter, svarsknappar och pappersmaterial används.

Alla källändringar har kontrollerade textankare i den frysta spelkoden. Modulen körs endast i de omarbetade kapitlen 1–4 och använder den befintliga spelloopen. Den skriver inga sparningar och tillför ingen egen animationsloop.

## Kontroll

`npm run test:presence` provar källankare, ansiktsfri placering i tre format, små sidosteg, korsande bildrutor med åtskilda stödytor, ingen undanbackning i någon riktning, ingen teleportering eller fartökning samt gemensam ritordning. Webbläsarprovet använder en verklig stadsbo, faktisk klick- och piltangentsgång, nåbart samtal och båda talarna i dator-, mobil- och liggande vy. Synlig text kontrolleras mot papprets form.

Socialprovet använder vanlig klickning från fyra håll, väntan medan spelaren går fram, båda talarnas riktning och avbruten kontakt. Kamerans läge och valt följningsläge måste vara oförändrade när samtalet öppnas och replikerna växlar. I gränden mellan Vetenskapens hus och Kyrkan krävs ett litet sidosteg, kort väntan och fri passage utan att personen backar till en öppning. Bildrutorna ska få överlappa under passagen. Samma passage och frivilliga hälsningar kontrolleras med minskad rörelse. Händelseprovet kontrollerar även kamerans läge vid ett första möte med en ursprunglig gatuperson.

De befintliga händelseproven täcker vagnen/smeden/barnet, jakt och återbetalning. Treans världstest kontrollerar fysisk resa till Carlsten och återkomst via kajen. Dessa kontroller kompletterar den riktade geometrikontrollen.
