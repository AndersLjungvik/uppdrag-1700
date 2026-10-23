# Frågeanpassning 3.1.0 · 23 oktober 2026

Korrigering i det separata lärartestet. Ordinarie spel och miljöer ändras inte.

## Återskapat fel

I `rc1-trade-1` godkände 3.0 ett ensamt `te`, men markerade både `te, siden och porslin` och `the, siden och porslin` som `review` trots korrekt ifylld landruta. Orsaken var jämförelse av hela strängen med ett alternativ i taget, inte ett verkligt krav på en orsak i just varurutan. Därefter visade rättningen ett ämnesgemensamt exempelsvar om hela handeln och rubriken ”Utveckla din förklaring”. Kombinationen gav missvisande instruktioner.

## Ändringar

- Kända kortsvar får innehålla flera korrekta exempel. Alla uppräknade delar måste kännas igen. Ett korrekt ord gömmer inte felaktiga eller okända tillägg. `the` hanteras som `te` endast i fält vars svar innehåller `te`.
- Exempelsvaret gäller de aktuella rutorna, inte ett helt ämne eller en högre nivå. Återkopplingen begär inte längre generellt en utvecklad förklaring.
- Tolv uppgiftsformuleringar har förtydligats där flera sakuppgifter tidigare krävdes utan tillräcklig ledning i frågan.
- Davidfrågan har två uttryckliga svarsrutor. Platsen för straffarbetet krävs inte när frågan bara gäller vad dödsstraffet ändrades till.
- Ett exempel från familjen räcker i frågan som efterfrågar ett sådant; både hustru och barn behöver inte ingå.
- Stödord tillåts i de två uppgifter som uttryckligen säger att stödord räcker. Innehållskontrollerna är kvar.

`alignment.js` läggs efter den oförändrade `fixes.js`. Snapshot-filen är oförändrad. Sparprefix och motorns tidigare versionsnyckel är kvar för att bevara testloggar. Vid första öppningen av den nya versionen nollställs endast den aktiva rutans gränssnitt; tidigare loggade svar raderas inte. Detta är inte migration eller ändring av elevspelets sparningar.

## Kontroller

197 automatiska rättningsfall godkända: bland annat samtliga 78 uppgifters aktuella exempelsvar, 78 tomma/icke-svar, flera varulistor, blandade riktiga/okända uppgifter, båda religiösa grupperna jämfört med endast en, David utan plats, stödordsformat och tidigare grundlags-/maktsvar. Tre ytterligare kontroller av återkopplingen.

Lokal Chromium-kontroll vid 375 px: det rapporterade varusvaret går igenom formuläret; en blandad lista med telefoner går inte igenom; en saknad landruta godkänns inte av en korrekt varulista; David kan besvaras utan plats. Samtliga 78 uppgifter renderade utan horisontellt överflöde och utan JavaScript-fel.

Webbläsarkontrollen använde in-memory-filhämtning och simulerad lokal lagring. Originalskripten och uppdragsmetadata kom från de tidigare arbetsfilerna. Den komprimerade testfixturen rekonstruerades lokalt; produktionens snapshot och kontrollsumma ändrades inte. Ingen kontroll på fysisk iPhone och ingen fullständig validering av möjliga elevformuleringar har gjorts.

Rättningen är fortfarande regelbaserad. Ett godkänt testpaket är inte belägg för att alla möjliga svar bedöms korrekt. Okända formuleringar kan fortfarande kräva lärargranskning. Äldre rättningskontroller i `tests/regression.cjs` avser 3.0, utan denna nya anpassning.

Reproducera den nya rättningskontrollen från denna katalog:

```sh
python extract_sources.py
node tests/alignment.cjs
```
