# Aktuell utvecklingsstatus – Uppdrag 1700

Uppdaterad 18 oktober 2026. Aktuell arbetsversion är Demo 3.12.1. Användaren har bekräftat att samtalsflödet i 3.12 fungerar; denna korrigering tar bort den upprepade hälsningen under samma besök.

## Arbetsversion och rätt adress

**Demo 3.12.1 – Samtal och återseenden**

[Starta Demo 3.12.1](https://andersljungvik.github.io/uppdrag-1700/demo3/conversations.html?v=3.12.1). Startfilen är `docs/demo3/conversations.html`.

Grundversionen 3.12 publicerades i commit [0766878e38d59ec8742f0709552a6224ea84c4bc](https://github.com/AndersLjungvik/uppdrag-1700/commit/0766878e38d59ec8742f0709552a6224ea84c4bc). GitHub Pages-körning [39111711482](https://github.com/AndersLjungvik/uppdrag-1700/actions/runs/39111711482) avslutades med `success` för samma commit. Samtalsförloppen med Rut och Jo samt överföringen av Ruts genomförda presentation från 3.11 provades i samma Chrome-session; se verifieringen av grundversionen nedan.

[Demo 3.11 – Bekanta ansikten](https://andersljungvik.github.io/uppdrag-1700/demo3/known-people.html) bevaras som separat version. 3.12 ändrar inte dess startfil eller samtalsmoduler. `thoughts.html` bevarar 3.10. Adressen `/demo3/` och `game.html` leder fortfarande till den äldre världsdemon 3.2.1. Versionsnummer i README:s avsnitt om den tidigare huvudversionen anger inte aktuell arbetsversion.

## Korrigering i 3.12.1: en hälsning per besök

Användaren påpekade att ”Där är … Jag hälsar.” kom tillbaka direkt efter hälsningen. Modulerna skilde tidigare bara på bekant och obekant person. De minns nu också om spelaren redan har hälsat under det aktuella besöket i rummet.

- En avslutad första presentation räknas som hälsning under besöket.
- En återhälsning räknas som gjord när personens svar har visats. Tanken förblir borta både efter Till tankarna och efter Avsluta.
- Att stänga och öppna samtalet, eller tala om ett annat ämne, återställer inte hälsningen.
- När spelaren lämnar platsen och återvänder kan hen hälsa igen. Ett nytt sidbesök startar också ett nytt rumsbesök.
- Om återhälsningen avbryts innan personens svar visas kan den tas upp igen. En första presentation sparar fortfarande bekantskapen först när hela presentationen avslutats.

Det anpassade befintliga modultestet `dialogue-conversations-check.cjs` gav PASS utan körfel för Rut, Maja, Brita och Jo. Det kontrollerade reglerna ovan, återöppning under samma besök, nya rumsbesök och gamla 3.11-flaggor. Befintliga ämnesdialoger och Ruts dokumentövning ingick också. Detta är modulverifiering, inte ett påstående om provning i elevens egen webbläsare.

## Samtalsflöde i 3.12.1

Samtalen gäller Rut i arkivet, Maja i kaffehuset, Brita i tryckeriet och Jo vid huvudstadens kaj. Eleven klickar på personen och väljer en tanke. **Klick på tanken ersätter tankevalen med spelarens talbubbla; knappen Fortsätt eller Enter visar personens svar.** Replikerna ligger kvar tills eleven går vidare. Samtalet går inte vidare automatiskt.

Vid det första mötet presenterar sig spelaren som ny lärling, och personen presenterar sig och välkomnar eleven. Efter hela presentationen återgår samtalet till de övriga tankevalen. Vid nästa besök på platsen erbjuds exempelvis ”Där är Maja. Jag hälsar.”, följt av ”Hej igen, Maja.” och Majas återhälsning. Hälsningen erbjuds sedan inte igen under samma besök. Övriga ämnen finns kvar: handlingarna, anslagstavlan, bokstavstyperna och båtresan. Ruts dokumentövning och återkoppling bevaras.

De nya modulerna använder samma localStorage-nyckel som 3.11: `uppdrag1700-known-people-v1`, med platsnycklarna `archive`, `cafe`, `print` och `quay`. Befintliga `true`-flaggor ger återhälsningar från början av ett nytt besök; eleven behöver inte göra om presentationen. En avbruten presentation registreras inte som genomförd. Minnet av hälsningen under besöket finns endast i den aktiva samtalsmodulen och skriver ingen ny sparnyckel. Kunskapsbankens svar och uppdragsprogression skrivs inte av samtalsmodulerna.

## Aktiva filer

Alla filer i tabellen ligger i `docs/demo3/`.

| Fil | Roll i 3.12.1 |
| --- | --- |
| `conversations.html` | Komplett HTML-start med direkta skriptreferenser. Bevarar världen, konsten, rutterna och den befintliga animationsloopen. |
| `archive-conversations.js` | Ruts tankar, ömsesidiga presentation, återhälsning, dokumentövning och bekantskapsminne. |
| `place-conversations.js` | Maja, Brita och Jo: tankar, ömsesidiga presentationer, återhälsningar och bekantskapsminne. |
| `meeting-all-thoughts.js` | Oförändrat lager för personer, klickytor och talanimationer. |
| `harbour-merchant-visits.js` | Oförändrad logik för rum, dörrar, hamnbesök och båtfärder. |

Startfilen laddar `archive-conversations.js?v=3.12.1` och `place-conversations.js?v=3.12.1`. Den hämtar inte en annan HTML-sida med `fetch` och ersätter inte dokumentet med `document.open()`/`document.write()`. Bildmaterial och övriga beroenden är desamma som i den bevarade världen.

Återhälsningar återfanns vid genomgången i **`meeting-thoughts.js`, som inte laddades av 3.11**. De nya aktiva samtalsmodulerna innehåller nu återhälsningarna. `meeting-thoughts.js` ska inte kopplas in i 3.12; det är den äldre adaptern och ersätter tankevalen för flera av personerna med ett annat samtalsflöde.

## Det rapporterade samtalsstoppet

Användaren har bekräftat att stoppet uppstod efter ett **faktiskt klick** på tanken ”Undrar vem hon är?”. Tankevalen uppfattades ligga kvar, och det tidigare fungerande flödet med spelarens fråga och personens svar saknades. Den tidigare hypotesen om Enter innan ett val fått fokus förklarar därför inte rapporten och ska inte användas som förklaring.

Det finns ännu **inte belägg för grundorsaken**. Jämförelsen med de bevarade 3.9- och 3.10-filerna visade att själva tankebubblorna och övergången till repliker fanns kvar i 3.11-koden. Kontrollen med simulerade DOM-händelser återskapade inte stoppet. Ett faktiskt klick på Ruts presentationstanke i publicerade 3.11 visade också spelarens fråga och sedan Ruts svar i den använda Chrome-sessionen. Den direkta HTML-starten i 3.12 förenklar laddningen, men visar inte i sig att den tidigare `fetch`/`document.write`-starten orsakade klickfelet. Rapporten gäller det visuella samtalsflödet; ”tyst” ska inte automatiskt tolkas som ett önskemål om uppläst ljud.

## Verifiering och publicering av grundversionen 3.12

Den lokala kontrollen `dialogue-conversations-check.cjs` gav **PASS** för samtliga fyra personer, utan registrerade körfel. Den omfattade:

- Första mötet, avbruten presentation och genomförd ömsesidig presentation.
- Tankeklick → spelarens replik → personens svar, med manuellt Fortsätt/Enter.
- Skydd mot att nedhållen Enter hoppar över repliker.
- Återgång till tankeval, upprepade återhälsningar och övriga samtalsämnen.
- Ruts dokumentjämförelse, återkoppling och avslutning.
- Escape, återbesök och återläsning av befintliga bekantskapsflaggor från 3.11.

Detta är ett lokalt modultest med jsdom, den befintliga rumslogiken och mötesrenderaren. Skärmmåtten är simulerade och bakgrundsbilderna ersatta. Resultatet bekräftar de testade händelseförloppen, men verifierar inte den publicerade sidans laddning, verkliga klickträffytor eller elevens webbläsare. Testfilen är en tillfällig arbetsfil och ingår inte i publiceringen.

Den publicerade sidan provades därefter i Chrome med vanliga klick och Enter. Ruts presentation avslutades först i 3.11. Efter navigation till 3.12 visades direkt tanken ”Där är Rut. Jag hälsar.”. Ett klick gav spelarens ”Hej igen, Rut.” och Enter gav Ruts ”Hej igen! Välkommen tillbaka. Vill du titta på handlingarna?”. Knappen Till tankarna återställde tankevalen.

Jo var fortfarande obekant vid första mötet i 3.12. Klick på ”Undrar vad han gör vid kajen?” visade spelarens presentation och fråga. Fortsätt visade Jos presentation som hamnskrivare. Efter avslutad presentation och ett nytt samtal erbjöds hälsningstanken. Den ledde till ”Hej igen, Jo.” och ”Välkommen tillbaka till kajen! Vill du resa vidare?”. Både den första presentationen och återhälsningen kunde alltså följas i den publicerade sidan. Maja och Brita omfattas av modultestet, men har inte provats med riktiga klick i denna publicerade version. Elevens egen webbläsare har inte provats.

| Kontroll | Resultat 18 oktober 2026 |
| --- | --- |
| Lokala samtalsförlopp och gamla 3.11-flaggor | PASS; inga registrerade körfel. |
| Publicering av de tre nya källfilerna | Klar: commit `0766878e38d59ec8742f0709552a6224ea84c4bc`, Pages-körning `39111711482`, `success`. |
| Publicerad startsida | Öppnad; Demo 3.12 visas i titel och rubrik. |
| Verkliga klick i publicerad Demo 3.12 | Rut: tanke → spelarens replik → svar med Enter → tillbaka till tankar. Jo: första presentationen och ett nytt samtal med återhälsning, via klick på Fortsätt. |
| Faktisk överföring från 3.11 | Ruts avslutade presentation följde med till 3.12 i samma webbläsare; hälsningstanken visades direkt. |

## Fortsätt här i nästa chatt

Utgå från **3.12.1 och de aktiva filerna ovan**. Tankebubblan, spelarens egen replik, personens svar och den ömsesidiga igenkänningen är den nuvarande utgångspunkten. En hälsning ska göras högst en gång per besök, även om samtalet stängs och öppnas igen. Kontrollerna ovan är slutförda med de angivna begränsningarna. Utgå från användarens aktuella återkoppling när nästa ändring bestäms.

Bevara godkända bildmiljöer, sparnycklar, navigation, dörrar och båtfärder. Återuppta inte äldre kartproblem enbart för att äldre kommentarer eller dokument nämner dem. Dator är huvudformatet; se också `SCENE-COMPOSITION.md` för fastställda bildprinciper.
