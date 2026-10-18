# Aktuell utvecklingsstatus – Uppdrag 1700

Uppdaterad 18 oktober 2026.

## Arbetsversion och rätt adress

**Demo 3.11 – Bekanta ansikten**

https://andersljungvik.github.io/uppdrag-1700/demo3/known-people.html

Utgångspunkten för detta arbete är commit `916c30a8d540f055c2d24628c0821e20448cfca8`, publicerad 18 oktober 2026. GitHub Pages-körning [39107093257](https://github.com/AndersLjungvik/uppdrag-1700/actions/runs/39107093257) lyckades.

Adressen `/demo3/` och `game.html` leder fortfarande till den äldre världsdemon 3.2.1. `thoughts.html` är den bevarade versionen 3.10 och grundsidan som 3.11 använder. Huvudspelets äldre versionsnummer i övriga README-avsnitt anger inte aktuell arbetsversion.

## Det som är inbyggt

Samtalen gäller Rut i arkivet, Maja i kaffehuset, Brita i tryckeriet och Jo vid huvudstadens kaj. När eleven har gått vidare genom hela presentationen sparas att personen är bekant. Introduktionstanken erbjuds sedan inte vid återbesök.

De två aktiva samtalsmodulerna använder samma befintliga localStorage-nyckel, `uppdrag1700-known-people-v1`, med platsnycklarna `archive`, `cafe`, `print` och `quay`. Att avbryta före avslutningsknappen räknas inte som genomförd presentation. Svaren i kunskapsbanken och uppdragsprogressionen skrivs inte av dessa moduler.

## Aktiva filer

Alla nedanstående filer ligger i `docs/demo3/`.

| Fil | Roll |
| --- | --- |
| `known-people.html` | Ingång för 3.11; hämtar grundsidan och väljer rätt samtalsmoduler. |
| `thoughts.html` | Bevarad grundsida 3.10, med den befintliga världen och animationsloopen. |
| `archive-thoughts-known.js` | Ruts tankar, repliker, dokumentövning och minne av presentationen. |
| `place-thoughts-known.js` | Maja, Brita och Jo samt minne av presentationerna. |
| `meeting-all-thoughts.js` | Aktivt lager för personer, klickytor och talanimationer. |
| `harbour-merchant-visits.js` | Rum, dörrar, hamnbesök och båtfärder. |

`meeting-thoughts.js` laddas inte av 3.11. Ändringar där påverkar alltså inte denna version. Tidigare committexter om återkomsthälsningar är inte i sig belägg för beteendet i de aktiva filerna.

## Bekräftad rättning vid återupptagandet

3.11 försökte ersätta en versionssträng som inte fanns i grundsidan. Därför stod 3.10 kvar både i sidtiteln och i den synliga rubriken. Ingångssidan ersätter nu de två faktiska strängarna och visar 3.11. Världens HTML och de aktiva samtalsmodulerna är i övrigt oförändrade.

README länkar nu till aktuell arbetsversion och denna status, så att utvecklingen kan återupptas från rätt kod.

## Kvarstående kontroll av samtalsstoppet

Ett stopp har rapporterats kring tanken ”Undrar vem hon är?”, där tankevalen uppfattas ligga kvar. Stoppet är **inte återskapat eller förklarat** i denna kontroll. Tystnad ska inte automatiskt tolkas som ett önskemål om uppläst ljud.

En begränsad kontroll med jsdom, faktiska klick- och tangenthanterare, aktiva samtalsfiler, mötesrenderaren och den befintliga rumslogiken gav följande för alla fyra personer:

- Klick på introduktionstanken ersätter tankevalen med spelarens replik.
- Enter visar personens svar; upprepad nedhållen tangent hoppar inte över repliken.
- Avslutningsknappen sparar presentationen och introduktionstanken försvinner vid återöppning.
- Escape stänger samtalet och återställer rummets kontroller.
- Inga körfel registrerades under dessa förlopp.

Testet använder simulerade skärmmått och ersatta bakgrundsbilder. Det är inte en provning av pekskärmens träffytor, CSS-lager, faktisk ljuduppspelning eller beteendet i elevens webbläsare.

Enter när rubriken ”Du tänker …” har fokus aktiverar avsiktligt inget val. Tanken måste först väljas med klick eller fokuseras med Tab/piltangent. För fortsatt felsökning behöver det klargöras om stoppet uppstår vid klick på en tanke eller vid Enter innan ett val har fokus.

## Bevara vid fortsatt arbete

Utgå från 3.11 och de aktiva filerna ovan. Bevara godkända bildmiljöer, befintliga sparnycklar, navigation, dörrar och båtfärder. Återuppta inte äldre kartproblem enbart för att äldre kommentarer eller dokument nämner dem. Dator är huvudformatet; se också `SCENE-COMPOSITION.md` för fastställda bildprinciper.

