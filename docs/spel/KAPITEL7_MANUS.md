# Kapitel 7 – Ska Sverige bli en stormakt igen?
## Manus och byggunderlag: Hamnarna och Den första beställningen

**28 oktober 2026 · manusversion 1**

**Status:** Utarbetning av det kapitelupplägg Anders har godkänt. Detta dokument är ett manus- och byggunderlag, inte en ny spelversion. Det ändrar inte frågor, nivåspärrar, miljöer eller sparningar i det publicerade spelet. Nya repliker, hantverkaren, kunden, sjökistan och beställningen är fiktion. Historiska personer får inga påhittade originalcitat.

**Sammanhållande fråga:** Sverige vill bli rikare och mäktigare – men vad betyder det för människorna?

## 1. Två tydliga spår

**Obligatoriskt huvudspår:** Bli minnesmästare i fyra kunskapsområden. Alla områdens lärlingsprov ska vara klarade före gesällproven. Alla gesällprov ska vara klarade före mästarproven. Alla fyra mästarprov krävs före kapitel 8. Varje obligatorisk uppgift och varje svarsfält ska finnas kvar; ett avslutat samtal eller sidoäventyr kan aldrig ersätta dem.

**Frivilligt sidospår:** Hjälp en hantverkare på Marstrand att färdigställa hans första beställning. Arbetsplatsen förändras och han känner igen spelaren vid senare besök. Sidospåret ger ingen kunskapsstämpel och behövs inte för att avsluta kapitlet.

Berättelsen utvecklas främst under lärlingsrundan. Gesäll- och mästarbesök är uttryckliga minnesprov, inte nya leveransärenden. Rut och oväntade gatuhändelser ger ytterligare repetition, men ersätter inte huvudproven.

## 2. Fyra områden och en kontrollerbar frågefördelning

| Område i minnesboken | Huvudmiljö och personer | Innehåll som ska bevaras | Befintliga ämnesnycklar |
| --- | --- | --- | --- |
| Frihamnen Marstrand | Marstrands hamn; hamnskrivaren och den befintliga hantverkarrollen | Friare handel, skatter, inflyttning och undantag från skråkrav. | `trade`, `taxes`, `crafts` |
| Sveriges koloni och handeln | Gustavias hamn; hamnskrivaren och olika hamnroller | Saint-Barthélemy, Frankrike, Västindiska kompaniet och triangelhandelns riktningar. | `colony`, `company`, `triangle` |
| Slaveri och motstånd | Gustavias befintliga källrum; Anna som fiktiv samtalsvärd och källunderlag om människors egna handlingar | Ofrihet och förtryck, Marie Anne och Cecile, motstånd och avskaffandet. | `oppression`, `resistance`, `abolition` |
| Kungens krig | Riksdagshuset; Elin. Kajens daterade besked ger sammanhang. | Kungens mål, begränsningen för anfallskrig, lärobokens uppgift om gränshändelsen och krigets politiska och territoriella följder. | `warMotive`, `warStart`, `warOutcome` |

**Inventering:** Kapitelpaketet innehåller 36 uppgifter: de tolv ämnesnycklarna ovan har var sitt id enligt `rc7-{ämne}-{0,1,2}`. Nivå 0 är lärling, 1 gesäll och 2 mästare. Varje område omfattar tre uppgifter per nivå, nio totalt. Flera uppgifter har flera svarsfält; 36 uppgifter betyder därför inte 36 enskilda faktasvar. [K1–K2]

Den nya fördelningen behåller ämnen och uppgifts-id:n men ger samma kunskapsområde en stabil hemvist genom alla nivåerna. I nuvarande kod flyttar flera ämnen mellan öarna, Tryckeriet, Kaffehuset och Kajen mellan nivåerna. Den vandringen ska inte kopieras som om den vore nödvändig för repetition. [K2]

Alla aktuella uppgifter ska mappas till område och nivå före implementation. Bevara varje befintligt kunskapskrav, även delkrav i sammansatta uppgifter. Extra frågor ska inte skapas enbart för att fylla nya hus. Alla 36 uppgifter förblir obligatoriska, oavsett vilka sidomöten eleven väljer.

**Två särskilda bevarandekrav:** Frågan om landet som överlät ön ska kräva ett land, inte en dold förklaring. Rättningsfixen för `rc7-warStart-1`, inklusive korrekt negation i ”kunde inte starta krig utan riksdagens godkännande”, får inte gå förlorad. [K1, K3]

## 3. Minnesboken visar riktningen

Varje områdesrad visar namn, plats och stämplarna lärling, gesäll och mästare. Använd ord och symbol, inte enbart färg: **klar**, **återstår**, **låst**, **påbörjat** och vid behov **väntar på granskning**.

Exempel:

> Gesäll: 2 av 4 områden klara. Slaveri och motstånd återstår i Gustavias källrum. Kungens krig återstår i Riksdagshuset. Mästarnivån är låst tills alla gesällprov är klara.

Eleven får välja provordning inom upplåst nivå. Boken föreslår en färdväg men hittar inte på brådskande meddelanden från andra personer. Frågor, resmål och sidouppdrag visas separat. Boken ska inte kräva att eleven minns en muntlig kedja av ”gå till henne, hon behöver detta”.

Efter fyra lärlingsstämplar:

> Lärlingsrundan är klar. Nu är gesällproven öppna i alla fyra områden.

Efter fyra gesällstämplar:

> Nu är mästarproven öppna. Visa vad du minns i varje område.

Efter fyra godkända mästarprov öppnas kapitel 8 utan en obligatorisk extra leverans till Maja. En kort avslutningsreplik och nästa kapitels ingång får visas, men inget nytt hämta-och-lämna-krav läggs efter sista stämpeln.

Ett svar sparat för granskning är inte ett godkänt prov. Den nuvarande möjligheten att fortsätta ett berättelsebesök med ett osäkert svar får inte automatiskt bli en mästarstämpel i den nya modellen. En konkret granskningsväg måste finnas före publicering av spärrarna. Tekniskt osäker rättning ska inte kosta eleven ett extra äpple eller kräva gissningar om exakt formulering.

## 4. Världen ska vara ny, inte nollställd

### Hemstadens kaj

I handelsfasen märks avresorna: befintliga skepp och hamnroller används, med lastning, förberedelser och samtal om destinationer. Jo kan hjälpa eleven att välja resa men ska inte undervisa om allt som finns på öarna. Ingen obligatorisk start på Kaffehuset.

I krigsfasen får kajen andra inslag: militära förberedelser, en orolig sjöman och daterade kungliga besked. Detta är föreslagen spelgestaltning, inte en exakt rekonstruktion av en belagd hamn vid ett visst datum. Efter fredsbeskedet förändras anslaget och samtalen igen.

### Marstrand

Marstrand ska upplevas som en plats med handel, hantverk och människor som försöker etablera sig. Återanvänd de befintliga hamn- och hantverksmiljöerna. Det nya sidoäventyret utvecklar en befintlig hantverkarroll, inte en ny parallell huvudperson med samma funktion.

Moses och Bela Salomon får bara förekomma i tidslägen där deras närvaro är rimlig. Ingen ny replik får förutsätta att spelaren träffat dem i femman om sparningen inte visar det. Deras biografier får inte göras om till en allmänt lycklig framgångsberättelse. [H1]

### Gustavia

Gustavia får ett eget hamnliv, inte en kopia av Marstrand med annan fond. Människors olika möjligheter ska framgå i korta möten och i arbetsmiljön. Ingen människas status bestäms enbart genom hudfärg, kläder eller en stereotyp animation. Visa bara konkreta roller och levnadsvillkor som underlaget kan stödja.

Människor som förslavades får inte bli flyttbara lastobjekt, handelsvaluta eller föremål i packningen. Handelsdiagrammet ska visa tvångsförflyttning och utnyttjande, inte erbjuda en aktivitet där eleven tjänar på slavhandel. [K1–K2, H2–H3]

### Det som finns kvar från tidigare kapitel

De 22 miljöernas byggnader, vägar och godkända placeringar ska bevaras. Odlingarna på de tidigare lägerplatserna ska inte ersättas av tält igen. Fyrans kokboksstatus och andra verkligt sparade sidoresultat ska inte nollställas.

Tvåans täcke, treans gård och sexans planerade arbetsmiljöer är fortfarande helt eller delvis byggkrav, inte bevisat införda funktioner. När de finns ska kontinuiteten kopplas till verklig sparad status. Inget av dessa resultat får markeras som genomfört enbart för att eleven öppnar sjuan.

Att en miljö består betyder inte att varje historisk person står kvar med samma ålder. Använd berättelsens minnesrese-ram, daterade återblickar eller andra människor när tidsavståndet kräver det. Vuxna forskare från fyran ska inte oavsiktligt leva vidare oförändrade i alla senare årtal. [K4]

## 5. Resa och berättelsetid

Rekommenderad första färd: **Kajen → Marstrand → Gustavias hamn → Gustavias källrum → tillbaka till hemstadens krigsbesked och Riksdagshuset.** Detta är hjälp med orientering, inte ännu en kedja av leveranslås.

Båtanimationen kan hoppas över redan första gången. Efter ett besök finns tydliga resegenvägar. Överfarten får aldrig kosta ett äpple eller en daler som behövs till provhjälp. Att hoppa över resan hoppar inte över frågor.

Om eleven väljer ett senare historiskt avsnitt först ska tidskortet förklara det. Världens sparade tidsläge återställs inte när eleven återvänder till ett äldre provområde. Läsning om 1847 är en lokal framåtblick, inte en global flytt av alla figurer och miljöer till 1800-talet.

**Historiska hållpunkter för författare och utvecklare:**

- Marstrands frihamnstid är 1775–1794. Scenen kan märkas ”Marstrand under frihamnstiden”. Privilegierna var lokala och innebar inte lika rättigheter överallt i Sverige. [H1]
- Avtalet om Saint-Barthélemy hör till 1784; den svenska expeditionens ankomst till ön hör till 1785. Hamnscenerna ska inte felaktigt visa en fullt etablerad svensk verksamhet före övertagandet. [H2]
- Krigsstarten hör till 1788. Kungens utökade makt och riksrådets försvinnande hör till förändringarna 1789. Freden 1790 gav inga gränsförändringar. Ange inte att riksrådet först avskaffades efter freden. [H4]
- Slaveriet på ön upphörde 1847. Detta skiljs från att det svenska koloniala innehavet upphörde 1878. Skriv inte ett ospecificerat riksdagsbeslut som om hela beslutsprocessen skedde på avskaffandedagen; kontrollera läromedlets förenklade formulering före frågepublicering. [K1–K2, H3]
- Nästa kapitel tar upp Operan 1792. Övergången från framåtblicken 1847 tillbaka till huvudberättelsens 1700-tal måste därför vara synlig.

## 6. Lärlingsscen: Marstrands möjligheter

**Plats:** Marstrands befintliga hamn och närliggande hantverksmiljö.

En hantverkare ställer i ordning sitt bord. Hamnskrivaren har ett kort ärende om vilka regler som gäller. Inga fem följdärenden behöver uppstå.

> **Hantverkaren:** Där hemma fick jag inte bara sätta igång. Här har jag fått en chans.
>
> **Du:** Är reglerna annorlunda här?
>
> **Hamnskrivaren:** Ja. Marstrand är en frihamn. Men olika sorters frihet är inte samma sak.

Spelaren kan välja **”Vad är friare med handeln?”** eller **”Vad betyder det för hantverkaren?”** Värden ger högst ett par repliker om den valda delen. Uppgifterna bygger på kapitlets kunskapsunderlag, inte på fiktiva repliker som källa.

Därefter: **”Pröva lärlingsfrågorna om Frihamnen Marstrand.”** Samtal och eventuell sortering av hantverkarärendet är introduktion; de ger inte automatiskt någon stämpel. Den som redan kan innehållet får gå direkt till provet.

Efter godkänt visas den första stämpeln och återstående områden. Inget besked om att Maja nu måste godkänna ärendet behövs.

## 7. Lärlingsscen: den ensidiga handelsnotisen

**Plats:** Gustavias hamn. Tidsmärkt svensk kolonialtid på 1780-talet.

En fiktiv hamnnotis beskriver bara ekonomiska möjligheter. Den är en berättelserekvisita, inte ett historiskt originaldokument.

> **Hamnskrivaren:** Här har jag skrivit om handeln och kompaniet.
>
> **Du:** Men inget om människorna som tvingas arbeta?
>
> **Hamnskrivaren:** Nej. Det bladet berättar inte hela historien.

Eleven kan titta på handelsdiagrammet och fråga om kompaniet. Ostindiska och Västindiska kompaniet ska hållas isär. Schemat beskriver ett större atlantiskt handelssystem; det får inte se ut som en belagd exakt resa som varje svenskt fartyg eller ön själv gjorde i tre perfekta led.

En kort materialhandling kan visa hur notisen kompletteras med uppgifter som saknas. Behåll den befintliga scenens sakliga funktion, men gör den inte till ännu ett obligatoriskt långt frågebatteri utöver områdesprovet. De tre lärlingsuppgifterna om kolonin, kompaniet och handelsriktningarna är alltid obligatoriska. [K2]

På provnivåer där rutterna ska återkallas får ett redan ifyllt facitdiagram inte stå bredvid frågan. Visa i så fall ett neutralt tomt schema; en öppnad genomgång registreras som stöd enligt nivåns regler.

## 8. Lärlingsscen: människor, motstånd och en framåtblick

**Plats:** Gustavias befintliga källrum. Anna är en fiktiv samtalsvärd, inte en historisk uppgiftslämnare.

> **Anna:** Här finns berättelsen om Marie Anne och Cecile.
>
> **Du:** Vad försökte de göra?
>
> **Anna:** De krävde den lön som hade lovats och anmälde misshandel. Läs vad texten berättar om deras handlingar.

Använd en tydligt märkt sammanfattning av det befintliga läromedelsunderlaget. Hitta inte på nya repliker som framställs som kvinnornas egna bevarade ord, ett nytt domslut eller en framgångsrik frigivning vid detta tillfälle. Detaljerna ska kontrolleras mot lärobokssidan inför bygget. [K1–K2]

Spelaren kan välja att läsa om **deras handlingar** eller **rättigheter och begränsningar**. Ingen måste välja ett visst känslouttryck eller en viss moralisk formulering för att få rätt på en sakfråga.

När avskaffandet behandlas visas:

> **Längre fram i tiden – 1847.** Slaveriet upphör på den svenska ön. Detta händer långt efter Gustav III:s tid.

Efter genomgången:

> Nu återgår vi till 1780-talet och berättelsen om kungens krig.

Områdets frågor om förtryck, motstånd och avskaffande är obligatoriska. Informationen om 1847 får därför inte döljas enbart i en frivillig detaljflik. Eleven kan läsa en kort saklig version utan att behöva se våldsamma bilder eller höra dramatiserade skrik.

Inga daler tjänas på kolonialtemat. Ingen jakt, ficktjuv, vagnsblockad eller uppmuntrande belöningsanimation får avbryta denna scen. Öppna resonemang bedöms efter det som uttryckligen efterfrågas, inte efter hur upprörd eleven låter.

## 9. Lärlingsscen: ett löfte är inte ett resultat

**Plats:** Riksdagshuset, med ett daterat besked från kajen. Elin är provvärd; Jo kan synas i hamnens korta berättelseinslag.

I berättelsens 1788-läge har ett fiktivt anslag börjat tala om återvunna områden innan utfallet är känt.

> **Elin:** Här står vad kungen vill vinna. Det är inte samma sak som vad han redan har vunnit.
>
> **Du:** Men på kajen talar några som om allt är klart.
>
> **Elin:** Då behöver vi skilja på ett löfte och ett besked.

Val: **”Varför vill kungen börja krig?”** eller **”Får han bestämma det själv?”** Begränsningen gäller anfallskrig enligt den då gällande ordningen. Lärobokens uppgift om en iscensatt gränshändelse presenteras med dess osäkerhetsmarkering, inte som en ny obestridlig animerad händelse som eleven själv bevittnar. [K1–K3, H4]

Ett tydligt tidsskifte visar sedan beskedet efter freden 1790:

> **Du:** Så Sverige fick inte tillbaka områdena?
>
> **Elin:** Nej. Gränserna ändrades inte. Kungen hade däremot stärkt sin makt under kriget.

Det förhastade segeranslaget ersätts med ett kort korrekt besked som skiljer landvinster från politisk makt. Det rättade anslaget ska vara synligt efteråt. Det ersätter ingen fråga och ska inte först visas efter en extra slutleverans till Maja.

Den berättelsemässiga förändringen sker en gång. Vid gesäll- och mästarbesök är anslaget redan rättat, och provet prövar vad eleven minns utan att spela kriget igen.

## 10. Sidoäventyr: Den första beställningen

### 10.1 Upptäckten

**Plats:** En befintlig hantverksplats på Marstrand, i anslutning till den befintliga hantverkarrollen. Exakt yta och klickpunkt väljs efter kontroll av rumskoden; ingen ny byggnad placeras på en gångväg.

**Synligt före hjälp:** Ett glest arbetsbord, några delar, en nästan färdig sjökista och ett lock som tar emot. Hantverkaren provar att stänga, stannar och tittar på kanten. Vid reducerad rörelse räcker en tydlig stillbild och en kort replik.

> **Hantverkaren:** Första beställningen. Och locket fastnar.
>
> **Du:** Har du byggt kistan för liten?
>
> **Hantverkaren:** Eller locket för stort. Kunden lär inte bry sig om skillnaden.

Val: **”Ska vi jämföra delarna?”** eller **”Jag kommer tillbaka senare.”** Att avstå ger ingen skuldreplik, förlust eller spärr.

Om eleven faktiskt träffade denna roll i femman får en extra rad vara:

> **Hantverkaren:** Sist talade vi om att kunna börja arbeta här. Nu har jag fått min första beställning.

Saknas belägg för det tidigare mötet används grunddialogen. Hantverkaren ska inte alltid hälsa som en gammal vän.

**Sidomål:** ”Hjälp hantverkaren att passa in locket.” Huvudmålet om provstämplar är fortfarande synligt.

### 10.2 Ett arbetsbord, inte en materialjakt

Alla delar, mallar och redskap finns vid bordet. Ingen extra resa efter hammare, spik, pengar eller tillstånd behövs. Spelaren ska inte betala för att få hjälpa till.

> **Hantverkaren:** Lägg mallen över delarna. Då ser vi vad som sticker ut.

Det korta pusslet ska gå att lösa med val följt av placering, både med tryck, mus och tangentbord. Dragning får vara ett alternativ men inte ett krav.

**Konkret spelhandling:** Eleven jämför en mall med några färdiga lockdelar och väljer de delar vars längd och bredd passar. Markera passningen med synliga kanter, inte genom färg eller en grön markering som avslöjar facit före valet. Delarna får vridas med en knapp. Hantverkaren gör eventuell bearbetning och fastsättning; eleven behöver inte simulera precisionssågning.

En för bred del ger:

> **Hantverkaren:** Där tar kanten emot. Jämför med mallen en gång till.

En för kort del ger:

> **Hantverkaren:** Nu blev det en springa. Vi behöver täcka hela öppningen.

När passningen stämmer:

> **Hantverkaren:** Där sitter det! Jag fäster locket, så provar vi.

Locket stängs i en kort animation. Det går också att visa den färdiga passningen direkt. Ingen tidspress eller straff för fel placering. Hjälpknappen **”Visa hur delarna kan ligga”** är gratis och påverkar inga kunskapsstämplar.

### 10.3 Beställningen lämnar arbetsbordet

> **Kunden:** Går den att stänga nu?
>
> **Hantverkaren:** Prova själv.
>
> **Kunden:** Bra. Då kan den följa med ombord.

Kunden tar kistan från arbetsplatsen mot den befintliga lastplatsen. Händelsen får avslutas utan att eleven följer med eller väntar på hela gånganimationen. Kistan är vanlig fiktiv reserekvisita, inte kopplad till slavhandel eller till en verklig namngiven persons privata tillhörigheter.

**Sidostatus:** ”Den första beställningen – färdig.” Ingen dalerbelöning, kunskapsstämpel eller automatisk kapitelupplåsning behövs. Om spelaren stänger mitt i scenen ska sparningen säkerställa att kistan inte lämnas ut två gånger.

### 10.4 Återbesöket visar en förändring

När eleven lämnat platsen och återvänder sitter skylten uppe, verktygen hänger ordnade och hantverkaren arbetar med en ny beställning. Det är en liten utveckling av samma plats, inte en plötsligt färdig stor fabrik.

> **Hantverkaren:** Kistan kom ombord. Nu har jag fått en beställning till.
>
> **Du:** Passar det här locket bättre?
>
> **Hantverkaren:** Jag började med mallen den här gången.

Den första återbesöksdialogen spelas högst en gång. Senare räcker exempelvis **”Arbetet går vidare.”** Hantverkaren får samtidigt finnas kvar som människa, inte bara stå och tacka spelaren.

I närheten kan hamnskrivaren erbjuda elevens aktuella nivåprov med en kort replik. Sidouppdraget behöver inte genomföras eller stängas permanent för att provet ska kunna tas.

### 10.5 När sidouppdraget inte görs

Marstrands obligatoriska frågor fungerar ändå. Eleven kan återvända till arbetsbordet senare, även efter kapitlets huvudavslut. Den förberedande arbetsplatsen står kvar, men hantverkaren skäller inte eller påstår att spelaren förstört hans framtid.

## 11. Återbesök och minnesprov

Personerna inleder provbesök kort, utan påhittade nya papper att hämta:

- **Marstrands hamnskrivare:** ”Nu är det gesällprovet om Marstrands regler. Vad minns du?”
- **Gustavias hamnskrivare:** ”Dags att pröva vad du minns om kolonin och handeln.”
- **Anna:** ”Nu prövar vi vad du minns om människornas villkor och motstånd.”
- **Elin:** ”Mästarprovet: skilj på kungens mål, reglerna och resultatet.”

När nivån är låst hänvisar minnesboken till saknade stämplar. Ingen person hittar på ett nytt akut sidouppdrag som förklaring. Ett avslutat områdesprov får repeteras senare utan att radera en redan intjänad stämpel.

Stämpeln visar att områdets nivåkrav är uppfyllda. Den är inte ett betyg eller en belöning för ett sympatiskt samtalsval. Ett korrekt kortsvar får vara kort. Samtliga efterfrågade delar i en flerdelad uppgift måste hanteras, men dolda extra krav får inte tillkomma.

## 12. Rut, äpplen, ordstöd och spänning

Rut och gatuhändelserna ska använda samma repetitionsunderlag: hela frågeunderlaget från kapitel 1–6 och sådant eleven redan mött i sjuan. Inga framtida frågor från åttan, nian eller tian. Urvalet ska fördelas över tidigare områden, inte fastna i det senast besökta huset. Spara när en fråga visats så att identiska omedelbara upprepningar kan undvikas.

Rut erbjuder gratis övning och möjlighet att tjäna äpplen. Ett äpple ger ett nytt försök på just det aktuella områdets nivåprov, inte en återställning av andra områden. På lärlingsnivån kostar en ledtråd en daler. Gratis, neutralt ordstöd ska finnas likvärdigt för relevanta begrepp i alla svarsalternativ. En definition som i sig besvarar frågan räknas som ledtråd, inte som neutralt ordstöd.

Ficktjuven får ge en kort överraskning på vanliga ressträckor med lugna perioder emellan. Händelsen använder repetitionsbanken och får inte ta kistan eller andra uppdragsföremål. Läsningen av frågan ska vara utan reaktionstidspress. Resultatet påverkar inte huvudprovets stämplar. Maximal förlust från den befintliga tjuvhändelsen ska inte höjas.

**Särskild avgränsning i sjuan:** Inga automatiska tjuv- eller skämtmöten i Gustavias källrum eller under berättelser om förtryck, motstånd och avskaffande. De får inte överlappa något pågående prov, samtal, pussel eller båtövergång. Behåll lärarvyns möjlighet att testa händelser separat utan att trigga dem oväntat.

Den generiska vagnsblockaden ska inte vara sjuans standarduppdrag. Den första beställningen är kapitlets egna frivilliga utvecklingsäventyr. Äldre vagnsdata får ändå inte raderas av en ombyggnad.

## 13. Separata tillstånd och sparningar

**Förslag till datakontrakt, inte redan implementerade nycklar:**

1. **Kunskapsprogression:** område, nivå, försök, svar, stöd, granskning och stämpel. Kapitelupplåsning avgörs av de fyra mästarproven.
2. **Berättelse/värld:** besökta scener, handels- eller krigsfas, rättat anslag och den lokala framåtblicken. En provomstart får inte spola tillbaka världen.
3. **Sidoäventyr:** `ch7-first-order` med `available`, `accepted`, `fitting`, `ready`, `collected`, `established`. Spara pusseldelar, läge, hämtning och första återbesök.
4. **Personminne:** faktiska tidigare möten och repliker som redan spelats. Detta är inte samma sak som kunskapsresultat.

Färdig kista, kundens hämtning, skylt och nya verktyg ska alltid härledas ur sparad sidostatus. Ett rent sidbyte skapar inget slutfört uppdrag. `established` kräver slutförd hämtning och ett senare besök, inte två klick i samma samtal.

Använd befintlig separation mellan elev- och lärarsparning. Export/import ska omfatta de nya tillstånden. Bevara tidigare svar, stämplar, daler, äpplen, gamla berättelsekontroller och rättningsfixar. Ta en säkerhetskopia före migrering. Ofullständiga äldre resultat får inte automatiskt bli nya mästarstämplar. En tidigare upplåst fortsättning och grunden till en ny kunskapsstämpel måste hållas isär; migreringsregeln ska redovisas innan den tas i bruk.

**Befintliga tekniska kopplingar att bygga om med försiktighet:** I `chapter7-world.js` väljs fyra berättelsescener genom fasta uppdragssteg, och flera riktningar hänvisar till Maja och en slutleverans. De får inte följa med oförändrade när provplatserna blir stabila. Bevara själva innehållet men koppla det till namngivna scenflaggor. I frågebanken varierar `place` med nivån; det behöver ändras konsekvent i provkontroll, rumskoppling och minnesbok. [K2]

Återanvänd befintliga personanknutna papperspratbubblor, en replik i taget. Arbetsbordet, handelsdiagrammet och minnesboken kan använda dokumentvy. Lägg inte till ett tredje parallellt dialogsystem.

## 14. Acceptanskriterier inför spelbygget

1. Alla 36 befintliga uppgifter och deras svarsfält är kartlagda utan bortfall till fyra områden och tre nivåer.
2. Inget gesällprov öppnas före alla lärlingsprov; inget mästarprov före alla gesällprov; kapitel 8 kräver fyra godkända mästarprov.
3. Samtal, pussel, sidouppdrag, färdigt anslag och väntande granskning kan inte ensamma ge en provstämpel.
4. En elev kan hoppa över hantverkaruppdraget och ändå genomföra samtliga obligatoriska frågor. Uppdraget kan återupptas senare.
5. Båda första samtalsvalen, avböjande, återbesök och stängning mitt i pusslet fungerar utan nya påhittade tidigare möten.
6. Kistan hämtas bara en gång. Skylt, verktyg och nästa beställning visas först efter rätt händelser och finns kvar efter omladdning och export/import.
7. Pågående sidoäventyr hindrar inte provbesök; ett avslutat prov återställer inte sidoäventyret.
8. Resor kan kortas utan att frågor hoppas över. Alla provplatser är tydliga i minnesboken och nåbara även med tangentbord.
9. Den historiska ordningen hålls isär: överlåtelse 1784, etablering därefter, krigsstart 1788, maktförändringar 1789, fred 1790, lokal framåtblick 1847 och återgång före kapitel 8.
10. Rättningen behåller begränsade krav för namn/varor och regressionsfallet med ”kunde inte starta krig utan riksdagens godkännande”. Osäkra rimliga formuleringar får en fungerande granskningsväg utan felaktigt avdrag.
11. Rut och gatuhändelserna väljer inte framtida innehåll. Ett tomt äppelförråd leder till tillgänglig gratis repetition, inte ett ekonomiskt stopp.
12. Ingen människa behandlas som spelarens last, valuta eller belöning. Inga automatiska gatuhändelser avbryter de skyddade scenerna.
13. De 22 miljöerna, tidigare odlingar, betesdjur, tryckpress, gångvägar, kokboksstatus och befintliga sparningar jämförs före/efter.
14. Mobil- och datorvy, tryck, mus, tangentbord och reducerad rörelse provas. Ingen obligatorisk handling kräver precision, snabbhet eller jakt på en rörlig figur.
15. Slutrutan skiljer berättelse, sidouppdrag och faktiska kunskapsstämplar. Ingen lång slutleveranskedja uppstår efter sista mästarprovet.

**Kontrollstatus:** Punkterna ovan är krav för kommande implementation, inte genomförda speltester. Denna manusleverans innebär inte att nya animationer, provspärrar eller granskningsfunktioner har publicerats. Elevers upplevelse och lärandeeffekt är inte utvärderade.

## 15. Källor, inventering och avgränsningar

**Projektkällor, kontrollerade mot commit `f45c14595d8b5fe205c57704766373da5100b179`:**

- **K1:** `docs/spel/CHAPTER7.md` beskriver den befintliga spelversionen och kopplingen till SOS Historia 4–6, grundbok s. 90–96 och arbetsbok uppgift 23–27. Originalfotografierna har inte lästs om i denna manusomgång; detaljuppgifter om Marie Anne och Cecile utgår här från det tidigare granskade spelunderlaget.
- **K2:** `chapter7-content.js` och `chapter7-world.js` i `docs/spel/chapter7-sourcepack.json.gz`. En tillgänglig källkodskopia av packen avkodades och dess SHA-256 jämfördes med den aktuella GitHub-laddarens värde: `678be96d10e0f13292466bb544785757ceb1dbef4e3b3ec308a397e69bbe13c6`. Inventeringen visar 12 teman, 36 uppgifts-id:n och fyra stegberoende berättelsescener; den är inte ett nytt genomspelningstest.
- **K3:** `docs/spel/chapter7-war-rule-fix.js`, med rättning av den tidigare felaktiga negationskontrollen.
- **K4:** `docs/spel/VARLD_OCH_KONTINUITET.md`, med bevarandekrav för värld, personminne, sidoäventyr och kunskapsprogression.

**Historiska kontrollkällor, lästa 28 oktober 2026:**

- **H1:** Bohusläns museum, ”Hit seglade judarna!”, särskilt avsnitten om frihamnen och Moses och Bela Salomon. Stöd för tidsramen, lokala privilegier och familjens historia. https://www.bohuslansmuseum.se/kunskapsbanken_bohuslans_historia/hit-seglade-judarna/
- **H2:** Etnografiska museet via Sveriges historia, ”Den fridfulla gatan på slavön”. Stöd för avtalet 1784 och expeditionens ankomst 1785. https://sverigeshistoria.se/lektioner/den-fridfulla-gatan-pa-slavon/
- **H3:** Etnografiska museet via Sveriges historia, ”Den svarta lagen”, särskilt avslutningen om 1847 och 1878. Inga grafiska övergreppsskildringar från källan återges i detta manus. https://sverigeshistoria.se/lektioner/den-svarta-lagen/
- **H4:** Riksarkivet, Svenskt biografiskt lexikon, Beth Hennings: ”Gustav III”. Stöd för begränsningen av anfallskrig, 1789 års maktförändring och freden 1790 utan gränsförändring. https://sok.riksarkivet.se/sbl/Presentation.aspx?id=13317

Den första beställningen, arbetsbordspusslet, kunden och den växande verkstaden är spelets fiktiva berättelse. Historisk kunskap ska vila på underlaget, inte på att dessa scener skulle vara verkliga händelser. Detta manus ersätter inte källkontroll av nya faktauppgifter vid senare kodning.
