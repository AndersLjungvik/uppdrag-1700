# Kapitel 5 – kontroll mot klassrumsmaterialet, 2026-11-02

Mål: träna återkallning av bokens frågor och förklaringar som förbereder för bedömningen. Berättelse och gatuhändelser är separata. En bevarad uppgiftsmängd är inte i sig ett mått på källtäckning.

## Inspekterat underlag

Följande original har materialiserats privat och inspekterats visuellt. Originalens bilder och provfiler publiceras inte.

| Original | Library-id | Inspektion |
| --- | --- | --- |
| Grundboken s. 80–81 | libfile_a8f06208e65c8191994e7861b17b2416 | Båda boksidorna |
| Grundboken s. 82–83 | libfile_d4db954d54248191b168f4bad0cffc23 | Båda boksidorna |
| Grundboken s. 84–85 | libfile_8503ddc43e048191ba46632b51003383 | Båda boksidorna |
| Lärarguide – Gustavianska tiden | libfile_becff12faaf08191b4faf87d891a8b3d | Avsnittets frågor/facit |
| Prov – 1700-talets Sverige del 2 | libfile_ccb8a87e6ee4819185e7e846f2fd0e05 | PDF-sidor 3–5, uppgift 5 och 7 samt avgränsning mot andra avsnitt |
| Bedömningsstöd del 2 | libfile_7a8f04e8e3e0819194db0d650b42af57 | PDF-sidor 4–5, uppgift 5 och 7 |

Arbetsbok 16–17 kopplas via den tidigare kontrollerade källförankrade `curriculum/classroom.mjs` och lärarguiden. Ingen ny separat bildtolkning av arbetsbokens original görs anspråk på här. Den äldre demobankens frågor används inte som oberoende källa för nya krav. De femton stabila rc5-id:n är integrations- och sparningsmetadata.

## Innehåll och träning

| Källa | Innehåll | Genomförd träning |
| --- | --- | --- |
| Grundbok 81; arbetsbok 16; lärarguide 1 | Gustav III kung 1771; statskupp 1772; armén och gripet riksråd; ny grundlag; mer kungamakt | Elins coup/support, tre nivåer; Rut 1771/1772/Gustav III |
| Grundbok 81; arbetsbok 16c | Trötthet på politiska gräl som skäl till stöd | Support kräver ett skäl, inte bara att kungen var omtyckt |
| Grundbok 82; arbetsbok 17; prov 7; bedömningsstöd s. 5 | Franska författare/tänkare, frihet/rättigheter, förnuft/vetenskap och påverkan i Sverige | Reforms på tre nivåer; mästarsvar kopplar idéer till svenska lagändringar; ett helt skrivblad för sammanhängande förklaring |
| Grundbok 82; prov 5a–b | Tortyrförbud och starkt begränsat dödsstraff | Två konkreta straffreformer med skillnaden bevarad; separat skriftlig rättelse |
| Grundbok 81; arbetsbok 17 | Tryckfriheten försämras men censuren återkommer inte | Press kräver båda uppgifterna; mästare jämför förbättring/begränsning |
| Grundbok 84; prov 5a–b; lärarguide 5 | Judar och katoliker får invandra/behålla religion; kvarvarande villkor | Namn/definition, konkret begränsning och förklaring; skrivblad med rättelse av provets felaktiga påstående |
| Grundbok 84 | Bostadsorter, yrken, äktenskap; svenska protestanter får inte lämna kyrkan | Minst ett konkret villkor krävs, inte bara ”vissa begränsningar”; fler finns i jämförelsestödet |
| Grundbok 83; lärarguide 4 | Familjen får inte avslöja/kasta ut gravid ogift kvinna; barn lika i prästernas papper; anonym födsel; kvarvarande skam | Rights på tre nivåer samt skrivblad som skiljer lag från vardag |
| Grundbok 81–85; arbetsbok 17; lärarguidens samtal | Både positiva och negativa konsekvenser | Press/rights mästare och öppet jämförelseblad |

Rut-korten genereras från samtliga 51 kortsvarsfrågor genom kapitel 5 i `curriculum/classroom.mjs`. Testet jämför id, prompt, svar, kapitel och varje källhänvisning mot den källan. Huvudprovens nya faktakrav får inte kredit genom gammalt kortare svar eller enbart tidigare ok-flaggor.

## Källskillnad och avgränsning

Bedömningsstödets exempel uttrycker dödsstraffet som helt avskaffat. Grundboken s. 82 säger att det nästan försvann, men fanns kvar för några få brott. Spelet följer grundbokens precisering. Eleven tränas inte att återge ett fullständigt avskaffande som sakuppgift. Tortyrförbudet hålls åtskilt från begränsningen av dödsstraff.

Prov del 2 omfattar även senare kapitel. Bellman, Svenska Akademien och tobak hör till sexan; slavhandel till sjuan; franska revolutionen och Gustav IV Adolf till senare avsnitt. De påstås inte vara täckta av just femmans huvudprov. Skrivbladen ger möjlighet till sammanhängande återkallning; de är inte en automatiserad bedömning av öppna resonemang. Att läsa modeller ger ingen huvudstämpel.

Brevet, handelsfamiljerna och deras repliker är markerad fiktion. De ger inga bedömningsbelägg och inga nya historiska facit. David är en tydligt daterad återblick från tidigare kapitel. Kapitel 5 utspelar sig i flera nedslag under Gustav III:s tid. Ett brev från en fiktiv fånge är inte ett återgivet historiskt källdokument.

## Kontroller

Materialprovet täcker samtliga femton modelluppgifter, alternativa formuleringar, uteblivna led, uttalade fel och idempotent dekorering utan ändring av andra kapitel. Browserproven spelar alla tolv stämplar, apple-omförsök, lokal granskning, Rut, skrivbladen, export/import och migrering. Världsproven kontrollerar närhet, naturliga repliker, målade närbilder, mobil/landskap, stilla kamera och fysiska brevöverlämningar. Tjuvprovet kontrollerar faktisk ansmygning, större stöld, jakt/fråga/återbetalning, återkomst efter ny intäkt och bevarat brev.

Funktionell verifiering och innehållskoppling visar inte i sig någon uppmätt effekt på elevers resultat. Publiceringen avser enbart testmappen på main; PR 4 hålls draft.
