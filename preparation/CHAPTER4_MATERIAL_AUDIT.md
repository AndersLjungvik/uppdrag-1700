# Kapitel 4 – kontroll mot klassrumsmaterialet, 2026-10-29

Status: kompletterat och funktionellt verifierat inför testversion 2.4.0. Publicering gäller enbart `docs/spel-test/` på main. PR 4 förblir draft och ska inte mergas. Den ordinarie `docs/spel/` på main ändras inte.

## Huvudkravet

Spelet ska träna återkallning av bokens frågor och de kunskaper och resonemang som bedömningsmaterialet prövar. Berättelse, uppdrag och tjuv stödjer den träningen. Att återanvända den komprimerade frågebankens 15 uppgifter bevisar inte att bok- och provkraven täcks.

## Kontrollerat underlag

- Källkoppling: `uppdrag_1700_kallkoppling_interaktiv.html`, Library libfile_40ad84f3904081918f6ad9faf9a6f5cf, kapitel 4, arbetsbok 11–15, textbok s. 75–80.
- Original: `Prov - 1700-talets Sverige del 1.pdf`, Library libfile_91c6d81be7d88191af0e4cd36fd99d71. Originalets sidor 1, 2, 5, 6 har inspekterats visuellt.
- `Bedömningsstöd del 1.pdf`, Library libfile_db0350f0d84c8191aeac4798b940f50a, hela texten läst.
- Befintlig källförankrad bank: `curriculum/classroom.mjs` (138 kort totalt; 44 kortsvarsfrågor i kapitel 1–4) och `curriculum/vetted-distractors.mjs`.

Originalprov och bilder ska inte läggas i det publika spelet.

## Kontrollerad täckning

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

## Genomförd komplettering

- `docs/spel/questions/chapter4-material.js` kompletterar de 15 huvuduppgifterna med kraven ovan. Ursprungliga id behålls. Två tydliga bibelläsningsexempel kan skrivas med egna ord eller stödord. Fred/forskningssvaret behöver ett samband. Motsägande eller ofullständiga svar får ingen automatisk kredit. Meningsfulla formuleringar som inte känns igen kan granskas.
- `docs/spel/questions/chapter4-review.js` innehåller 44 befintliga källanknutna kortsvarsfrågor för kapitel 1–4 plus tsar. Testet jämför samtliga 44 korts frågor, svarsalternativ, kapitel och källhänvisningar med `curriculum/classroom.mjs`. Kort märkta `reviewOnly` hålls utanför huvudprov och områdesstämplar.
- Rut erbjuder blandad repetition eller en särskild omgång med de nio provbegreppen plus budkavle och tsar. Alla elva kommer före upprepning. Loggen och framstegen sparas; fullföljd gratisomgång ger ett äpple.
- `docs/spel/chapter4-bookwork.js` har åtta skrivblad på plats hos Sam/Rut: tre forskare, samhällsbidrag, män i historieskrivningen, människors rangordning, budkavle/källa, kvinnors villkor då/nu, barnhus då/nu och egen läsning. Egna svar och jämförelsestöd sparas separat och ingår i export/import. Inga automatiska stämplar ges för att läsa stödet eller ange en viss åsikt.
- Materialmodulerna laddas endast i kapitel 4 och före frågemotorns id-register. De ändrar inte tidigare kapitels uppgifter och sparningar.
- Äldre svar bedöms mot de kompletterade kraven före överföring. En gammal ok-flagga ersätter inte tillkomna svarsfält.
- Samtal och arbete sker i befintliga rum. Science/Byn använder den målade rummiljön inklusive det separata förgrundslagret med bord och föremål.

## Verifiering

Följande kontroller har passerat lokalt:

- Källankare och fysisk, sparningskompatibel kokboksleverans.
- Materialprov: samtliga 15 fullständiga huvuduppgifter, 45 källkort, de sex forskarkopplingarna, elva begrepp, parafraser, ofullständiga och motsägande svar, återkommande dekorering utan dubbla fält samt oförändrade kapitel 1–3.
- Huvudprogression: alla 15 uppgifter och tolv stämplar, områdesordning, nivåspärrar, helomförsök, ledtråd, Rut och lokal granskning.
- Äldre sparningar: både styrkta och otillräckliga gamla svar, blandade försök, säkerhetskopia, resurser/sidouppdrag, normal kapitellåsning och verklig övergång till kapitel 5.
- Skrivblad och repetition: alla åtta blad via Sam/Rut, fri text, jämförelsestöd, alla elva begrepp före upprepning, mobil/tangentbord, återkomst, omladdning och export/import utan oavsiktliga huvudstämplar eller kostnader.
- Världen: verklig leverans, vandring före grannmåltid, sparad måltid, tidigare täcke/gård, rena mobila pratbubblor, datum och fysisk närhet.
- Tjuv: faktisk stöld/jakt/återbetalning av 6 daler, ny inkomst och återkomst med 7 dalers stöld, barnets exakta återbetalning efter omladdning, skyddat arbete och bevarade uppdragsföremål/stämplar.
- Gemensam händelsemotor, ansmygning, gömställen och återkomst.

Detta är funktionella kontroller och en innehållskoppling till de givna källorna. Det är ingen effektmätning av elevers lärande eller en automatiserad bedömning av öppna uppsatssvar.
