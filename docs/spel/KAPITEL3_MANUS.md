# Kapitel 3 – Krig eller fred?
## Manus och byggunderlag: Den stängda gården

**28 oktober 2026 · manusversion 1**

**Status:** Utarbetning av det upplägg som Anders har godkänt. Detta är ett manus- och byggunderlag, inte en ny spelversion. Filen ändrar inte frågor, nivåspärrar, grafik eller sparningar i det publicerade spelet. Samtliga nya repliker är dramatiserade, även när talaren föreställer en historisk person. Gården, Karin och bonden i sidoäventyret är fiktion.

## 1. Vad eleven ska förstå från början

**Huvudmål:** Bli minnesmästare i fyra områden. Klara alla lärlingsprov, därefter alla gesällprov och sist alla mästarprov. Först då öppnas kapitel 4.

**Frivilligt sidomål:** Hjälp Karin och en trött bonde att komma överens om en viloplats. Resultatet förändrar gården och senare samtal, men ger ingen provstämpel.

Berättelsen utvecklas huvudsakligen under lärlingsrundan. Vid senare provbesök behövs inte fler leveransärenden eller repliker om att någon glömt samma sak igen. Personerna är olika och vill olika saker; minnesboken ansvarar för att visa provprogressionen.

## 2. Fyra områden, med innehåll som inte får försvinna

| Område i minnesboken | Plats och personer | Obligatoriskt innehåll |
| --- | --- | --- |
| Hattar och mössor | Riksdagshuset: en hatt och en mössa. Elin kan vara neutral provvärd. | Krigspolitiken, hattarnas samarbete med Frankrike, mössornas med England och att båda grupperna tog emot mutor. |
| Krigets följder | Slottet: en hovskrivare. | Kriget 1741–1743, Sveriges nederlag, förlust av områden i Finland och tsarinnan Elisabets stöd för Adolf Fredrik som tronföljare. |
| Böndernas protest | Torget: bönder och soldater. | Skatter och soldatuttag, marschen från Dalarna till Stockholm, 1743, protesterna mot kriget och tronföljdsplanerna samt nedslagningen på Norrmalm. |
| Lydnad och samvete | Carlsten på Marstrand: David och fästningsvakten. | Davids vägran att skjuta mot bönderna och att dödsstraffet ändrades till straffarbete. |

**Spårbarhet till det äldre innehållet:** `hatsWar`, `hatsFrance`, `capsEngland`, `bribes` hör till första området; `warLost`, `landLost`, `tsarina` till det andra; `farmersAnger`, `summer`, `march`, `protest`, `norrmalm` till det tredje; `david` till det fjärde. Detta är innehållsnycklar ur `base/chapter3-content.js`, inte en påstådd komplett lista över den nuvarande frågemotorns uppgifts-id:n. [K1]

Vid implementation ska varje aktuell uppgift och varje svarsfält kartläggas till område och nivå. Sammansatta frågor som berör flera områden måste delas eller placeras uttryckligen. Inga kunskapskrav får tappas, bli frivilliga eller dubbleras av misstag. Ett kort område behöver inte fyllas med nya frågor bara för att få samma antal som ett annat.

**Bedömningsgräns:** Fakta om Davids handling och straff är obligatoriska. Att kalla honom modig, feg eller något annat är en tolkning, inte ett lösenord för godkänt.

## 3. Minnesboken och nivåspärrarna

Varje områdesrad visar områdesnamn, plats och tre stämplar: lärling, gesäll och mästare. Status anges med ord och symbol, inte bara färg: **klar**, **återstår**, **låst** eller **väntar på granskning**.

Exempel på översta raden:

> Gesäll: 3 av 4 områden klara. Lydnad och samvete återstår på Carlsten. Mästarnivån öppnas när alla gesällprov är klara.

Alla lärlingsstämplar krävs före någon gesällstämpel. Alla gesällstämplar krävs före något mästarprov. Alla fyra mästarstämplar krävs före kapitel 4. Att nå slutet på berättelsen, öppna gården, göra ett samtalsval eller spara ett osäkert svar får inte ensamt öppna nästa kapitel.

Eleven kan välja provordning inom den upplåsta nivån. Minnesboken föreslår en begriplig färdväg men hittar inte på att nästa person akut behöver ett föremål. Om en nivå är låst visas exakt vilka föregående stämplar som saknas.

## 4. Berättelsetid är inte provnivå

Föreslagen kronologisk berättelseriktning: **Riksdagshuset före kriget → Torget sommaren 1743 → Slottets efterhandsbesked om freden → David på Marstrand.** Det är en rekommenderad riktning, inte ytterligare ett obligatoriskt provlås.

Tid och plats står på ett kort tidskort när en ny berättelsescen börjar. Om eleven väljer en senare plats först märks scenen som en framåtblick. Ett tidigare skeende som besöks därefter märks som en återblick. Stadens pågående tillstånd ska inte hoppa bakåt för att eleven väljer ett tidigare provområde.

Viktiga gränser:

- Dalaupproret inträffar sommaren 1743. Den senare fredens fullständiga följder ska inte vara något bönderna redan känner till före upproret. [K3–K4]
- Adolf Fredrik utses till tronföljare 1743; han blir regerande kung först 1751. Hovskrivaren ska inte kalla honom den nye regerande kungen i 1743 års scen. [K3]
- År 1743 förloras områden i Finland, inte hela Finland. Det senare utfallet hör till kapitel 9. [K1]
- David på Marstrand är ett senare möte. Ange inte en exakt ankomstdag som underlaget inte styrker. Hans berättelse följer läromedlets uppgifter. [K1]

I den befintliga gatukoden styrs bland annat böndernas rörelse och lägrens synlighet av huvuduppdragets steg. Det ska vid ombyggnaden ersättas av separata berättelseflaggor. En gesällstämpel får inte automatiskt återstarta marschen. [K2]

## 5. Lärlingsscen: Riksdagshuset

**Synligt:** Två personer står vid var sin sida av ett bord. På bordet finns kort om krig och samarbete. Inga nya bokstavliga historiska original skapas; det är spelets arbetsmaterial.

> **Hatten:** Vi måste ta tillbaka det vi har förlorat!
>
> **Mössan:** Och vem ska betala för ännu ett krig?
>
> **Du:** Ni verkar vilja helt olika saker.
>
> **Mössan:** Lyssna på oss båda innan du bestämmer vad du tror.

Eleven kan fråga **”Varför vill du kriga?”** eller **”Varför vill du undvika krig?”**. Frågorna öppnar korta perspektiv, inte rätt och fel samtalsval.

> **Hatten:** Jag hoppas att Sverige kan vinna tillbaka mark. Frankrike är det land vi vill samarbeta med.

> **Mössan:** Jag vill inte kasta in Sverige i ännu ett dyrt krig. Vi vill hellre närma oss England.

Elin kan därefter säga:

> **Elin:** Båda grupperna tog också emot pengar från andra länder för att påverkas. Det behöver du känna till när du lyssnar.

**Till provet:** ”Pröva lärlingsfrågorna om hattar och mössor.” Det förklarande samtalet är introduktion, inte ett bevis på självständigt kunnande. Eleven får ta del av bakgrunden, men lärlingsfrågorna måste ändå besvaras.

Efter godkänt räcker: **”Lärling i Hattar och mössor – klart.”** Minnesboken visar återstående områden. Elin skickar inte eleven efter ännu ett protokoll.

## 6. Lärlingsscen: Torget

**Tidskort:** Sommaren 1743 – bönder har kommit till Stockholm.

**Synligt:** En mindre grupp bönder stannar till. Soldater står en bit bort. Det finns fri passage och en tydlig plats att inleda samtalet; eleven behöver inte jaga en rörlig figur för att få göra provet.

> **Bonden:** De ber om mer pengar och fler soldater. Vi har redan lämnat ifrån oss så mycket.
>
> **Du:** Är det därför ni har kommit hit?
>
> **Bonden:** De som bestämde om kriget måste svara för det. Vi vill också få säga något om vem som ska bli nästa kung.

Val: **”Vad har kriget kostat er?”** eller **”Vad vill ni att de som bestämmer ska göra?”** Båda får korta, olika svar. Ingen känslomässig åsikt ersätter kunskapsfrågorna.

> **Soldaten:** Jag har fått order att stoppa dem.
>
> **Du:** Vill du det?
>
> **Soldaten:** Jag vill inte rikta ett vapen mot människor som kunde vara mina grannar.

**Det historiska våldet:** En kort, stillsam övergång berättar att soldater öppnade eld på Norrmalm och att många bönder dödades. Ingen skjutmekanik, poängjakt, realistiska skrik eller flyktuppgift kopplas till själva nedslagningen. Eleven kan gå direkt till den sakliga sammanfattningen utan att något kunskapsinnehåll försvinner. [K1, K4]

> **En stadsbo:** Det blev inte det samtal de hade hoppats på.

Därefter kan områdets lärlingsfrågor genomföras. Senare återbesök visar en lugnare men förändrad plats; samma upprorelse spelas inte upp igen.

## 7. Lärlingsscen: Slottet

**Tidskort:** Efter kriget 1741–1743 – besked om följderna.

Hovskrivaren har två schematiska kartblad och ett besked om tronföljden. Eleven kan jämföra dem utan att behöva tolka en geografiskt exakt historisk karta.

> **Hovskrivaren:** De ville vinna tillbaka mark. På mitt nya kartblad måste jag i stället markera det Sverige förlorade.
>
> **Du:** Då gick kriget tvärtom mot vad de hade tänkt?
>
> **Hovskrivaren:** Ja. Ryssland segrade. Tsarinnan Elisabet fick också inflytande över vem som skulle bli svensk tronföljare.

Val: **”Vem ville hon ha?”** eller **”Blev den personen kung genast?”**

> **Hovskrivaren:** Hon stödde Adolf Fredrik. Han valdes till tronföljare 1743. Det betyder inte att han redan regerade som kung.

Samtalet avslutas kort. Områdets obligatoriska lärlingsfrågor följer. Valet att titta på kartbladet är inte en automatisk provstämpel.

## 8. Lärlingsscen: David på Carlsten

Resan använder befintliga Marstrand och Carlsten. Båtanimationen får hoppas över, även första gången, men inget prov hoppas över. Efter det första besöket ska en tydlig resegenväg finnas för gesäll- och mästarbesöken.

**Tidskort:** Senare – Carlstens fästning på Marstrand.

> **Du:** Jag har hört att du vägrade skjuta.
>
> **David:** Mot bönderna, ja.
>
> **Du:** Vad hände sedan?
>
> **David:** Jag dömdes till döden. Straffet ändrades. Nu är jag här och arbetar.

Val: **”Det måste ha varit svårt att vägra.”** eller **”De andra säger att en soldat måste lyda.”**

> **David, första vägen:** Det gjorde inte följderna lättare. Men jag ville inte skjuta mot dem.

> **David, andra vägen:** Det var också vad jag fick höra. Ändå vägrade jag.

Replikerna är spelets dramatisering, inte bevarade citat. Låt inte ett moraliskt samtalsval bli rättningskriterium. Den neutrala provytan prövar vad han vägrade göra och följden för straffet.

På senare återbesök har David kvar sin situation. Spelarens korrekta svar gör honom inte fri. Fästningsvakten eller minnesboken kan erbjuda provet så att David inte måste återberätta sitt straff inför varje enskild fråga.

## 9. Sidoäventyr: Den stängda gården

### 9.1 Upptäckten

**Plats:** Bostadskvarteren, på en befintlig gård. Grinden är stängd. Karin tittar mot gatan. En trött, fiktiv bonde sitter utanför.

> **Karin:** De blir fler och fler. Jag tänker inte släppa in någon.
>
> **Bonden:** Vi vill inte ha hennes hus. Bara någonstans att sitta en stund.

Eleven kan **prata med båda** eller **fortsätta sitt huvuduppdrag**. Att avstå ger ingen skuldreplik och inget avdrag.

Om eleven faktiskt hjälpte till med täcket i kapitel 2 kan Karin lägga till:

> **Karin:** Du kom tillbaka. Det var du som hjälpte mig med barnets täcke.

Saknas sparat bevis på hjälpen använder hon i stället: **”Vad vill du?”** Ingen tidigare relation hittas på. Täcket är ännu ett manusförslag; kontinuiteten måste kopplas till verkligt genomförd sidostatus när båda kapitlen implementeras.

### 9.2 Ett samtal, inte en leveranskedja

> **Du:** Vad är du rädd ska hända?
>
> **Karin:** Att alla tränger sig in. Jag måste kunna komma åt min egen dörr.
>
> **Du, till bonden:** Kan några vila här om dörren lämnas fri?
>
> **Bonden:** Vi kan turas om. Alla behöver inte gå in samtidigt.
>
> **Karin:** Några åt gången, då. Men tunnorna står framför bänken.

Spelaren kan föreslå överenskommelsen eller vänta. Karin fattar själv beslutet att öppna. Spelaren får inte tvinga bort henne eller bryta upp grinden.

### 9.3 Ett litet placeringspussel

På gården syns bänken, två tunnor, dörren och gångstråket mellan grind och dörr. Flytta föremålen så att bänken kan användas och dörrvägen är fri.

Tryck på ett föremål och sedan en plats; tangentbord ska fungera. Dragning kan finnas, men får inte vara nödvändig. Minst två placeringar ska godkännas. Ingen tidspress, inget krav på exakt musprecision och ingen ny resa efter verktyg.

Vid blockerad dörr:

> **Karin:** Där kommer jag inte förbi. Pröva att ställa tunnan intill väggen.

Vid fungerande lösning:

> **Karin:** Nu går det. Jag öppnar grinden.
>
> **Bonden:** Tack. Mina ben tänker inte gå en meter till just nu.

Pusslet har fria omförsök och ett tillgängligt alternativ **”Visa en placering”**. Det kostar inga äpplen, ger ingen provstämpel och får inte gömma någon obligatorisk historisk fråga.

### 9.4 En bestående förändring

Grinden står öppen, bänken och tunnorna står enligt den valda lösningen och en vattenhink är framställd. Några sitter eller samtalar på gården. Förändringen återställs inte när eleven lämnar rummet, stiger i nivå eller laddar om.

Vid första återbesöket:

> **Karin:** Han där berättade om gården han lämnat. Förut såg jag bara en hel folkmassa.

Vid senare återbesök räcker en kort vardagsreplik. Ingen lång tackscen upprepas.

**Efter upprorets slut:** Den stora protestgruppen är inte kvar i samma marschanimation. Gården förblir öppen, men besökarantal och repliker följer det senare tidsläget. Om hjälpen görs först då gäller den en förbipasserande resande i den fiktiva berättelsen; ingen replik beskriver en marsch som om den fortfarande pågår.

Den öppnade gården förhindrar inte det historiska våldet. Sidoäventyret är inte en uppgift att rädda namngivna historiska personer, och spelaren får aldrig skulden för dödsfall om hjälpen avböjs.

## 10. Återbesök: korta provsamtal

När alla fyra lärlingsprov är klara:

> **Minnesboken:** Fyra lärlingsstämplar! Gesällproven är öppna. Välj ett område att börja med.

Vid Riksdagshuset:

> **Elin:** Nu prövar vi vad du minns om hattarna och mössorna.

Vid Slottet:

> **Hovskrivaren:** Kartbladen är undanlagda. Vad minns du om krigets följder?

Vid Torget:

> **Bonden:** Du har hört varför vi protesterade. Nu får du berätta vad du minns.

Vid Carlsten:

> **Fästningsvakten:** Här finns gesällprovet om Davids vägran och straff.

På mästarnivån byts erbjudandet till mästarprov. Inga nya felaktiga lappar behövs för att motivera varje omgång. Den som vill läsa bakgrunden först får gå till övning; det räknas inte som ett självständigt mästarsvar.

Efter sista mästarstämpeln:

> **Minnesboken:** Minnesmästare i kapitel 3 – fyra av fyra områden klara. Kapitel 4 är öppet.

Staden och den frivilliga gården får fortfarande återbesökas. Gården behöver inte vara öppnad för att kapitel 4 ska bli tillgängligt.

## 11. Hjälp, äpplen och spänning under förflyttning

- **Äpple:** Ett äpple betalar ett nytt försök på det aktuella områdets nivåprov efter ett faktiskt misslyckat försök. Andra stämplar och områden behålls. Ett tekniskt rättningsfel, ett avbrutet nätverk eller väntande lärargranskning får inte automatiskt dra ett äpple.
- **Rut:** Gratis repetition med möjlighet att tjäna äpplen. Banken omfattar hela tidigare kapitel och sådant eleven redan mött i trean. Alla områden ska kunna återkomma; missar och sådant som inte repeterats nyligen kan prioriteras. Framtida kapitel tas inte med.
- **Ledtråd:** En daler på lärlingsnivån. Ord- och begreppsstöd finns likvärdigt för alla svarsalternativ och ska inte peka ut facit. En definition som direkt besvarar frågan räknas som ledtråd, inte neutralt ordstöd.
- **Rättning:** Ett granskningsmarkerat svar är inte automatiskt en mästarstämpel. Bevara svaret och provläget. Lärarens godkännandeväg måste vara genomförbar innan den nya hårda kapitelspärren publiceras; eleven ska inte fastna på formuleringar som programmet missar.
- **Gatan:** Patruller, folksamlingar och korta tilltal ger trean dess stämning. Någon kan stanna eleven för en kort repetitionsutmaning, men läsningen sker utan jakt eller tidspress. Huvudvägen har alltid en fortsättning.
- **Avgränsning:** Ingen generisk vagn behöver återkomma i trean och ingen komisk ficktjuv läggs på själva nedslagningen. Ett missat svar ger aldrig avrättning, skada på en historisk person eller ett omskrivet krigsutfall. Inga uppdragsföremål stjäls.

## 12. Byggkrav och sparning

Föreslagna separata tillstånd, inte redan existerande API:er:

- `ch3-study`: stämplar per område och nivå, provförsök, svar, använd hjälp och väntande granskning.
- `ch3-story`: vilka daterade berättelsescener som genomförts, aktuell tidsfas och vilka korta återbesöksrepliker som redan visats.
- `ch3-courtyard`: `available`, `talked`, `agreed`, `arranging`, `open`; vald möbelplacering och genomförda återbesök.

Håll berättelse, sidoäventyr och kunskapsresultat åtskilda. Låt inte ett enda stegnummer styra alla tre. Karin får läsa en genomförd täckesleverans från tvåans framtida sidostatus, men inte skriva om den eller tolka ett öppnat kapitel som bevis för hjälpen.

Kunskapssvar, tidigare kapitel, daler, äpplen och lärar-/elevseparering ska bevaras. Äldre avklarat kapitel får inte tyst omvandlas till fyra nya mästarstämplar utan belägg. Ta en engångskopia och visa vad som kan styrkas respektive behöver kompletteras; radera inte spelarens historik.

Använd befintliga personanknutna papperspratbubblor, en replik i taget. Högst ett aktivt samtal eller prov. Materialpusslet och minnesboken får ha en arbetsyta. Sidomålet får inte täcka huvudmålet eller provstatusen.

Torget behöver en stabil provyta för böndernas område. Grinden och gården ska lokaliseras i den faktiska bostadsmiljön före ritning. Kontrollera befintliga rörelsevägar, möbler och klickytor; ersätt inte hela stadskartan. David och resegenvägen måste vara nåbara även efter att berättelsen slutat.

## 13. Acceptanskriterier före spelpublicering

1. Samtliga befintliga kapitel-3-frågor och delkrav finns kartlagda, utan att något endast hamnar i sidoäventyret.
2. Inget gesällprov kan ge stämpel före fyra lärlingsstämplar; inget mästarprov före fyra gesällstämplar; kapitel 4 öppnas först efter fyra mästarstämplar.
3. Den som helt avstår från gården kan ändå klara alla obligatoriska frågor och kapitlet.
4. Fri provordning inom upplåst nivå fungerar. Rekommenderad berättelseriktning är tydlig; avvikande besök får begripliga tidsmarkeringar, inte felaktig kronologi.
5. Gesäll- och mästarbesök startar inte om kriget, marschen, nedslagningen eller en slutförd gårdsscen.
6. Ett moraliskt samtalsval om David ger inte automatiskt godkänt eller underkänt kunskapssvar.
7. Karin hänvisar till tvåans täcke endast vid verifierad leverans i samma elevs sparning. Avsaknad av sådan flagga blockerar inte hjälpen.
8. Avstå, återkomma, stänga, ladda om och exportera/importera fungerar i varje gårdssteg. Minst två pussellösningar fungerar.
9. Grinden, möbelplaceringen och rätt besökare/repliker består efter omladdning och följer berättelsetiden.
10. Patruller och andra sidohändelser avbryter inte prov, pratbubblor, materialpussel eller den stillsamma återgivningen av nedslagningen.
11. Rut erbjuder gratis repetition, även med tom plånbok och utan äpplen. Ett äpple startar bara om valt områdes nivåprov och inga andra stämplar försvinner.
12. Samtliga scener provas med mobiltryck, mus, tangentbord och reducerad rörelse. Frågor kräver inga snabba svar; båtanimationen går att hoppa över.

**Kontrollstatus:** Punkterna ovan är kommande bygg- och testkrav, inte genomförda tester. Manuset är inte elevtestat. Det gör inget påstående om uppmätt effekt på engagemang eller lärande.

## 14. Källor och historiska gränser

**K1. Projektets befintliga innehåll:** `docs/spel/base/chapter3-content.js`, underlag SOS Historia 4–6 s. 70–74 och arbetsbokens uppgifter 8–10 enligt filhuvudet. Innehållsnycklar och Davids handling/straff följer detta läromedelsunderlag. Den aktiva, omarbetade frågebanken och dess senare rättningsfixar måste dessutom inventeras före kodändring; manusets ämneslista är inte ett nytt facit som ersätter dem.

**K2. Befintliga aktörer och tidsberoenden:** `docs/spel/base/chapter3-street-life.js`. Hatt, mössa, bönder, soldater, David, ryska vakter och adelsman finns redan i projektet. Lägrens exakta placering på spelkartan är gestaltning, inte ett påstående om historiskt belagda adresser.

**K3. Riksarkivet, Svenskt biografiskt lexikon: Adolf Fredrik.** Kontrollerat för skillnaden mellan tronföljdsvalet 1743 och trontillträdet 1751 samt kopplingen till Ryssland och fredsförhandlingarna: https://sok.riksarkivet.se/sbl/Artikel/5574

**K4. Stockholms läns museum, Länskällan: De arga böndernas brev till kungen.** Underlag om protesternas krav och nedslagningen. Museets lärarmaterial problematiserar även namnet Stora daldansen. Elevtexten kan skriva ”Dalaupproret 1743 – i boken kallat Stora daldansen”; det ska inte gestaltas som en dans: https://stockholmslansmuseum.se/skola/lanskallan/lararmaterial/de-arga-bondernas-brev-till-kungen/

**Kontinuitet:** `KAPITEL2_MANUS.md`, Sängen vid fönstret, manusunderlag 28 oktober 2026. Den avslutade täckesleveransen är villkoret för Karins särskilda igenkänningsreplik, inte en obligatorisk förutsättning för trean.

Den stängda gården, dess överenskommelse, möbelpusslet och alla exakta repliker är nyskriven fiktion. De används aldrig som bevis för vad en verklig person sa. Ingen uppgift om Davids exakta transportdatum, besöksvillkor eller frigivning läggs till utan källstöd.
