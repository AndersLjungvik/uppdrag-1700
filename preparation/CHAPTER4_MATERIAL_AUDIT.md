# Kapitel 4 – kontroll mot klassrumsmaterialet, 2026-10-29

Status: arbetsutkast. Inte publicerat till `docs/spel-test/`. PR 4 ska förbli draft och får inte mergas. Den ordinarie `docs/spel/` på main ska inte ändras.

## Huvudkravet

Spelet ska träna återkallning av bokens frågor och de kunskaper och resonemang som bedömningsmaterialet prövar. Berättelse, uppdrag och tjuv stödjer den träningen. Att återanvända den komprimerade frågebankens 15 uppgifter bevisar inte att bok- och provkraven täcks.

## Kontrollerat underlag

- Källkoppling: `uppdrag_1700_kallkoppling_interaktiv.html`, Library libfile_40ad84f3904081918f6ad9faf9a6f5cf, kapitel 4, arbetsbok 11–15, textbok s. 75–80.
- Original: `Prov - 1700-talets Sverige del 1.pdf`, Library libfile_91c6d81be7d88191af0e4cd36fd99d71. Originalets sidor 1, 2, 5, 6 har inspekterats visuellt.
- `Bedömningsstöd del 1.pdf`, Library libfile_db0350f0d84c8191aeac4798b940f50a, hela texten läst.
- Befintlig källförankrad bank: `curriculum/classroom.mjs` (138 kort totalt; 44 kortsvarsfrågor i kapitel 1–4) och `curriculum/vetted-distractors.mjs`.

Originalprov och bilder ska inte läggas i det publika spelet.

## Identifierade luckor som måste slutas före publicering

| Underlag | Vad träningen behöver omfatta |
| --- | --- |
| Arbetsbok 11; textbok s. 75; prov 8 | Två konkreta exempel om egen bibelläsning: inget krav på att alltid lyda kungen; fred; människors lika värde. Godta egna ord och stödord. |
| Arbetsbok 12; prov 1a, 6 | Tryckfrihet, offentlighetsprincipen och censur ska hållas isär. Censur behöver ett eget återkallningskrav. Uppgiften om Sverige som första land ingår i klassrumsmaterialet. |
| Arbetsbok 13 | Samtliga sex kopplingar: Scheele apotekare/kemi och syre; Celsius vatten/is/ånga och temperatur; Linné växter/djur och medverkan i Vetenskapsakademiens bildande enligt boken. |
| Arbetsbok 14a–b | Linnés namn/porträtt, indelning och vetenskapliga namn. |
| Arbetsbok 14c | Öppen konsekvensfråga om indelning och rangordning av människor. Ingen viss åsikt ska rättas som ett enda faktasvar. |
| Arbetsbok 15 | Eva Ekeblad, potatis till mjöl och brännvin, första kvinnan i Vetenskapsakademien enligt texten. |
| Textbok s. 78; lärarguide fråga 3 s. 80 | Mer fred gav mer tid och pengar till forskning. Kräv ett samband, inte en lista med nyckelord. |
| Prov 6 | Nio begrepp: hattar/mössor, katekesen, kolt, tryckfrihet, aga, offentlighetsprincipen, oäkta, censur, skampåle. |
| Prov 7 | Budkavlens funktion och en bevarad budkavle som historisk källa. |
| Prov 8 | Förklara hur egen läsning kunde förändra samhället. |
| Prov 9a | Återkalla tre vetenskapspersoner och deras arbeten i fri text. |
| Prov 9b | Välj två personer och förklara hur deras arbeten bidragit till samhällsutvecklingen. Namn och upptäckt ensamma räcker inte. |
| Prov 9c | Öppet resonemang om varför så många uppmärksammade historiska personer är män. |
| Prov 4–5 | Jämförelser då/nu om kvinnors villkor respektive barnhus. |
| Prov 1a | Tsar = rysk kejsare behöver finnas i repetitionen. |

## Komplettering som påbörjats men ännu inte är verifierad

Lokalt hade tre tillägg påbörjats efter den tidigare fungerande kapitelversionen:
- `questions/chapter4-material.js`: kompletterade fält i de ursprungliga 15 uppgifterna och innehållsbaserad rättning av Bibelns exempel och fred/forskning.
- `questions/chapter4-review.js`: 44 befintliga källförankrade kort från kapitel 1–4 plus tsar. Enbart tillgängliga när kapitel 4 laddas; märks `reviewOnly` och får inte blandas in i de tolv huvudstämplarna.
- `chapter4-bookwork.js`: åtta skrivblad med sparade egna svar och jämförelsestöd på plats hos Sam/Rut: tre forskare, samhällsbidrag, män i historieskrivningen, människors rangordning, budkavle/källa, kvinnors villkor då/nu, barnhus då/nu och egen läsning.

Arbetsmiljön blev otillgänglig innan dessa nya lokala filer kunde läsas in till versionshanteringen och verifieras. De finns alltså inte som färdiga moduler i denna checkpoint. Återskapa dem från kraven ovan, koppla dem i rätt laddordning och testa före publicering.

Föreslagen genomföring:
1. Lägg materialtilläggen efter fixes/alignment/power-language men före recall-flow, vars byId fryses vid start.
2. Behåll originalfrågornas id. Filtrera `reviewOnly` bort från huvudprov och dess räknare. Lägg repetitionen i Rut-loggen, aldrig huvudprovsloggen.
3. Erbjud en tydlig repetitionsomgång för de nio begreppen plus budkavle och tsar. Prioritera ännu inte rätt återkallade kort.
4. Låt Sam och Rut öppna de skrivna resonemangen i målade arbetsnärbilder. Spara utkast och jämförelse separat. Inget visst öppet resonemang ska automatiskt ge rätt/fel eller stämpel.
5. Osäkra men meningsfulla formuleringar ska kunna granskas. Skydda mot motsägelser och enbart nyckelordslistor utan att kräva en exakt facitmening.
6. Vid äldre bevis migrering: bedöm svarens innehåll mot de uppdaterade kraven. En gammal ok-flagga får inte ge kredit för nytillkomna fält.
7. Lägg funktionella prov för alla kompletteringar, parapraser, ofullständiga/motsägande svar, inga nya kostnader/stämplar i Rut/skrivblad, spara/ladda/export/import, mobil/tangentbord och tidigare kapitel.
8. Först efter QA: publicera endast `docs/spel-test/` på main med befintlig preview-nyckel. Behåll `replay=kapitel2-test-210` så användarens omgång kan fortsätta.

## Vad denna checkpoint faktiskt innehåller

Den tidigare verifierade kapitel-4-koden med ursprungliga 15 uppgifter, tolv områdesstämplar, naturliga samtal, målade arbetsytor, fysisk kokboksleverans och grannmåltid, kvarvarande tjuv, separata sparningar och migrationsprov. Källankare, smoke, mastery, migration, world, thief samt gemensamma eventprov passerade före materialkompletteringen. Det är funktionella spelprov; täckningsluckorna ovan återstår.

Ingen liveuppdatering av main gjordes i denna arbetsomgång.
