# Frågetest v3.0.0 · 23 oktober 2026

Separat, mobilanpassad lärartest för Uppdrag 1700. Öppna `index.html` via en webbserver eller GitHub Pages, inte som en lokal bilaga. `?question=rc1-law-2` öppnar direkt på grundlagsfrågan.

## Underlag och avgränsning

Samtliga 78 uppgifter i den omarbetade frågebanken för kapitel 1–5 kommer från `uppdrag1700_spelbar_testversion.html` och arbetskoden daterad 21 oktober 2026. De tre ursprungliga skripten är byteidentiska i dessa underlag. Uppdragens ordning och personmetadata kommer från `uppdrag1700_fragprototyp_v2.html`.

`snapshot.json.gz` innehåller originalskripten och uppdragsmetadata i ett komprimerat JSON-paket. Inga miljöbilder eller elevuppgifter finns med. `fixes.js` är den läsbara, separata rättningsändringen. Sidan anpassar originalmotorns versionsnyckel och höjer textgränserna till 240 respektive 4 000 tecken vid inläsning.

Detta är INTE en sammanfogning med de 22 miljöerna. Ordinarie spel, kapitellåsningar och elevsparningar ändras inte. Alla ändringar ligger i denna nya katalog. Lokal testlagring har prefix `uppdrag1700.fragtest-v3.2026-10-23.`. Inga svar skickas till servern. Testloggen exporteras endast efter ett aktivt knapptryck.

## Rättning

Korrigerar bland annat ”enig riksdag”, vissa andra omformuleringar och beskrivningar av maktförändringen. Vissa uttryckliga motsägelser stoppas. Okända rimliga svar kan fortfarande missas och andra felaktiga svar kan fortfarande passera: motorn är regelbaserad, inte generell språkförståelse. Ingen validerad bedömningsmodell eller elevversion. Fri testnavigering räknas inte som avklarad kunskap.

## Reproducera rättningstesterna

Från denna katalog, med Python 3 och Node:

```sh
python extract_sources.py
node tests/regression.cjs
```

182 kontroller godkända: exempel­svaren för alla 78 uppgifter, 78 icke-svar samt riktade positiva, ofullständiga och motsägande grundlags-/maktsvar och ytterligare regressionsfall. Resultaten är inte ett belägg för att alla möjliga elevsvar bedöms korrekt.

Lokal Chromium-kontroll: alla 78 uppgifter renderade utan horisontellt överflöde vid 375 px; även 320 px och datorvy kontrollerade. Det exakta rapporterade grundlagssvaret godkändes genom formuläret. Utkast, blockerad lagring, långa svar, ledtråd, Rut och fri testnavigering kontrollerades. Testet använde lokala, simulerade filhämtningar och lagring; inte fysisk iPhone/Safari eller ett komplett test över internet.

Sidan kräver JavaScript och webbläsarstöd för `DecompressionStream('gzip')`. Den visar ett felmeddelande om filer saknas eller kontrollsumman inte stämmer.

Snapshot SHA-256: `fb3b210dc0a9f6c82160eb85dd27ecb5496bf5f13e7af8d0a9b330a2c1c6ae11`.
