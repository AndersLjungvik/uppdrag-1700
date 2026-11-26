# Kapitel 5 · det nya kungliga anslaget · 2.34.0

Utvecklingsversion, förberedd 26 november 2026. Den publicerade elevversionen är
fortfarande 2.33.0 tills denna ändring har publicerats.

Kedjan följer avsnitt 5 i det godkända `Uppdrag_1700_hela_uppdragskedjan.docx`
och det antagna frågemanuset för kapitel 5–10. De 15 huvuduppgifterna,
svarsfälten och rättningskraven ändras inte.

Brita behöver rätta ett inaktuellt anslag. På hennes begäran hämtar spelaren
bladet hos Maja, tar det till Tryckeriet och jämför frihetstiden med maktbytet
1772. Det äldre bladet behåller sin tidsangivelse. Nästa ärende markeras som
ett senare nedslag under Gustav III:s regeringstid: Jo lämnar ett besked om
lagar och religion vid stadens Kaj.

Spelaren tar med beskedet till Amira, Olof och Brita och sparar deras
anteckningar i valfri besöksordning. Underlagen skiljer reformer från
kvarvarande begränsningar. Vid pressen rättas påståendet att alla nu har samma
frihet. En felaktig formulering ger återkoppling utan kostnad eller förlorade
framsteg. Dokumenten är rekonstruerade spelhandlingar utifrån kapitlets
innehåll, inte historiska original.

Kapitlets befintliga kunskapsfrågor ligger kvar hos Elin, Amira, Brita och Olof.
Redan avklarade nivåer räknas; den nya berättelsen kräver inget omtag av dem.
Det färdiga anslaget kan lämnas till Maja när dokumentarbetet och de tolv
befintliga områdesstämplarna är klara. Leveransen kan skjutas upp och sker en
gång. Ett läsbart anslag finns därefter kvar på Kaffehuset. Både det tidigare
bladet och det rättade anslaget går att läsa. Ett frivilligt samtal låter
spelaren följa förhoppningar eller oro; valet ger inget rätt/fel-resultat.

Minnesboken visar en synlig följd av åtta steg, markerar nästa ofullbordade
steg och erbjuder en väg till rätt plats. Personernas återbesök hänvisar till
det aktuella ärendet. Elins separata protokoll, skrivbladen, Rut och resan till
Marstrand finns kvar.

## Sparning och kontroller

Berättelsen använder en ny nyckel, `uppdrag1700.ch5-royal-notice.v1`, genom
den befintliga sparbryggan. Elevomgång, självträning, lärarvy och omspelning
behåller sina skilda prefix. Ingen berättelsehandling ändrar svar,
kunskapsstämplar, resurser eller kapitelåtkomst. De befintliga klasslänkarna
öppnar fortsatt kapitel 1–5.

`node docs/spel-test/tests/chapter5-royal-notice.cjs` provar hela kedjan genom
de riktiga rumsdialogerna, fysisk närvaro, valfri ordning på underlagen,
rättelse utan kunskapskredit, uppskjuten och engångsleverans, återbesök,
reflektionsval, omladdning, felaktiga sparningar och bevarade äldre nycklar.
De befintliga kontrollerna för femmans material, protokoll, brevhändelse,
språkvariation, självträning, nivåprogression, klasslänkar och händelsemotor
passerar.

I webbläsaren har beställningen, omladdning, hämtningen hos Maja,
dokumentjämförelsen vid pressen och uppdragsbokens uppdatering kontrollerats.
Den hanterade lokala förhandsvisningen lägger till HTML i grundfilerna och
utlöser därför spelets befintliga kontrollsummefel. Den tillfälliga QA-sidan
serverar grundfilernas exakta originaltext; kontrollsummeskyddet är kvar och
godkänner den. QA-sidan ingår inte i ändringen. Full visuell genomspelning av
slutleveransen och fysisk iPhone/Safari återstår.
