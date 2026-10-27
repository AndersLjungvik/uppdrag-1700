# Kapitel 9 – Esters brev · version 1.7.0

27 oktober 2026. Ersätter kapitel 9:s obligatoriska rundgång i version 1.6.0. Kapitel 10 och de tidigare kapitlen ändras inte. Alla befintliga historiska frågor i kapitel 9 finns kvar.

## Spela

Öppna `/uppdrag-1700/spel/?teacher=1&chapter=9&v=1.7.0`. Börja hos **Ester i Kaffehuset**. Den aktuella riktningen finns i uppdragsrutan och i **Brevet · uppdrag & minnen**.

En redan avslutad äldre sparning förblir avslutad. För att se det nya manuset, välj **Spela brevberättelsen från början** i uppdragsboken. Detta spelar om berättelsen, inte frågesvaren, dalerna eller upplåsningen av kapitel 10.

## En sammanhängande berättelse

1. **1808:** Ester väntar på sin bror Eriks brev. Spelaren går till Nils på kajen, hjälper honom få fram postkistan och hittar rätt mottagare. Detta är ett kort materialval, inte ett krav på 24 kunskapssvar.
2. **Lämna brevet direkt:** Spelaren återvänder till Ester och räcker över brevet. Hon får läsa det och reagera. Spelaren kan ge henne lugn eller sitta kvar; ett senare möte minns valet. Inga minnesfrågor krävs för leveransen.
3. **Tydligt tidshopp:** Först efter överlämningen kan spelaren välja att fortsätta till hösten 1809, efter freden. Ester vill få iväg ett nytt svar och undrar vad den nya gränsen betyder.
4. **Rätta Alvas kartblad:** Ett äldre allianskort och en etikett för Finland/Åland rättas. Spelaren får undersöka förändringen innan Ester skriver färdigt. Kartbladet är ett schema över allianser och styre, inte en geografiskt riktig karta eller en historiskt belagd postrutt.
5. **Ett riktigt avslut:** Ester förseglar sitt svar. Det lämnas i utgående post hos Nils. Spelet lovar varken leveranstid, broderns framtid eller att krigets följder försvinner.

Dialogerna använder de befintliga personanknutna papperspratbubblorna. Materialbord och uppdragsbok använder dokumentfönster. Ester är anhörig, Nils sköter post och Alva rättar sitt arbetsmaterial; de behöver inte alla undervisa om källkritik. Ester, Erik, Nils, Alva och breven är fiktiva. Historiska bakgrundsuppgifter följer det redan använda underlaget i SOS Historia 4–6 s. 100–102, arbetsbok s. 37. Karl Haydens minnen är skilda från familjebrevet.

## Kunskapsträningen är separat

**24 befintliga frågor** med samma id, formuleringar och bedömningsregler finns i uppdragsbokens **Minnesövningar**, i nivåerna lärling, gesäll och mästare. En uppgift väljs åt gången. Bakgrunden kan läsas först; det markeras då som stöd. Öppna svar kan sparas för granskning utan att blockera huvudberättelsen.

Att avsluta brevberättelsen öppnar nästa kapitel, men ger inga automatiska kunskaps- eller mästarstämplar. Denna version innebär alltså att minnesövningarna inte längre är obligatoriska för att avsluta kapitel 9. De behöver planeras som en separat del av undervisningen. Inga effekter på motivation eller lärande hos elever är mätta.

## Sparningar och avgränsning

Samma kapitelnyckel används: `uppdrag1700.ch9-real-world.20261027.v1`, under befintliga separata spel-/lärarprefix. Berättelsen har ett eget objekt `ch9Letter`. Tidigare svar, granskningsmarkeringar, daler och äpplen behålls. En engångskopia av kapitelnyckeln får suffix `.before-letter-1.7.0`.

En äldre påbörjad sparning där brevet redan hittats går direkt till överlämningen. Ett äldre avklarat kapitel förblir avklarat; nya händelser tillskrivs inte spelaren förrän de faktiskt spelats. Sidoäventyrens sparningar, kartkoordinater, djur, tryckpress och deras kod är oförändrade.

## Källkod och reproducerbara kontroller

`chapter9-letter-runtime.js` läser tre delar `chapter9-letter-pack-1.bin` till `chapter9-letter-pack-3.bin`. Tillsammans är de ett gzip-paket på 11 198 byte, med SHA-256:

`2f95dd26b2de95b1f10208b3293ca00fa7eefd10858257db9d6b59f134a0464e`

Kör `python decode_chapter9_letter.py` för att läsa de två originalskripten i `_chapter9_letter/`. De är inte minifierade. Tillägget appliceras endast när kapitel 9 byggs. Kapitel 10:s genererade källfiler jämförs byte för byte före och efter tillägget.

Kör `node tests/chapter9-letter.cjs` och `node tests/finale.cjs` från `docs/spel`. Den nya kontrollen syntaxgranskar 29 genererade skript, bevarad frågebank, isolering från andra kapitel och att samtalen inte skriver kunskapsresultat. De tidigare 328 svarskontrollerna och 93 skriptkontrollerna för slutkapitlens ursprungliga byggkedja passerar också.

Lokala Chromium-kontroller har genomfört hela brevberättelsen med båda dialogvalen och dess slutleverans, samt samtliga 24 minnesövningar genom formulären. En genomgång använde mobilbredd 390 × 844 och klick; en annan 900 × 700 och reducerad rörelse. Sparmigration, återläsning, omspelning utan förlorade kunskapssvar, lärar-/spelseparering och överföring av resurser från kapitel 8 kontrollerades med testsparningar.

Dessa webbläsartester använde **simulerad filhämtning och lokal lagring**, riktig canvas och lärarens rumsgenvägar. Det är inte en fullständig test av nätverksladdning, samtliga gångvägar, fysisk iPhone/Safari eller samspelet mellan alla huvud- och sidouppdrag. Manuset är inte elevtestat.
