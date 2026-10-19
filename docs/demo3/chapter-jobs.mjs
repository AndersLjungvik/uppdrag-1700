// Work descriptions for the existing sourced classroom bank. These are the
// player's products and commissions, never additional historical evidence.
// Question IDs, answer rules and saved progression stay in the engine. The one
// approved route adjustment sends chapter 1's second delivery from Jo to Maja.
export const JOBS = {
  '1:1': {
    title: 'Manuset till anslaget',
    theme: 'Maktfördelning, lagar och handel',
    referenceBrief: 'Grundboken s. 64–65 och arbetsbokens uppgifter 1–4: periodens namn, maktfördelning, lagar och handel.',
    artifact: 'Manuset till anslaget',
    resultTitle: 'Det kontrollerade manuset',
    request: 'Jag vill sätta upp ett anslag om makten och handeln. Kan du skriva manuset hos Brita?',
    result: 'Tack, manuset är klart för tryckeriet. Maja bad mig också ordna porslin från Jo. Fråga mig om den beställningen när du vill fortsätta.',
    desk: 'Återkalla kapitlets namn, begrepp och fakta om hur landet styrdes och hur handeln gick till.',
    workLabel: 'Hjälp Brita med fakta om makt och handel',
    parcel: {icon:'paper',name:'Manuset till anslaget',description:'Ett skrivet pappersark till Brita. Lägg det på hennes bord i tryckeriet.'},
    order: {icon:'letter',name:'Majas lapp till Brita',description:'En vikt lapp med beställningen på anslaget. Ta den till Brita i tryckeriet.'},
    dialogue: {
      accepted: 'Spring iväg till Brita i tryckeriet med den här lappen. Hon hjälper dig att komma igång.',
      workIntro: 'Maja vill ha ett anslag om vem som bestämmer och hur handeln går till. Hjälp mig få namnen och uppgifterna rätt, så har vi ett manus att trycka.',
      startLabel: 'Jag hjälper dig med fakta om makt och handel.',
      resumeLabel: 'Jag fortsätter med manuset till anslaget.',
      workDone: 'Nu är manuset klart. Lägg det på mitt bord, så tar jag hand om det.',
      delivered: 'Tack, manuset är klart för tryckeriet. Maja bad mig också ordna porslin från Jo. Fråga mig om den beställningen när du vill fortsätta.',
      reminders: {
        work: {
          cafe: 'Brita väntar på dig i tryckeriet. Ta med min lapp och hjälp henne med manuset.',
          print: 'Manuset väntar här på bordet. Vill du börja eller fortsätta med det?',
          quay: 'Det är Brita som väntar på manuset. Du hittar henne i tryckeriet.',
          archive: 'Gå till Brita i tryckeriet. Hon hjälper dig med Majas anslag.'
        },
        deliver: {
          cafe: 'Lämna först manuset till Brita i tryckeriet. Hon behöver det till pressen.',
          print: 'Lägg manuset här på mitt bord, så är den beställningen klar.',
          quay: 'Ta manuset till Brita i tryckeriet.',
          archive: 'Brita väntar på manuset i tryckeriet.'
        }
      }
    },
    pickupTexts: [], handoffTexts: []
  },
  '1:2': {
    title: 'Porslin till Maja',
    theme: 'Samband mellan makt, inflytande och handel',
    referenceBrief: 'Grundboken s. 64–65 och arbetsbokens uppgifter 1–4: förklaringar av periodens namn, handelsbolagets verksamhet och böndernas begränsade inflytande.',
    artifact: 'Lådan med porslin',
    request: 'Maja väntar på porslin till kaffehuset. Gå till Jo på kajen och fråga efter lådan. Han behöver hjälp med sina förklaringar om makten och handeln.',
    result: 'Där är porslinet! Tack, ställ lådan här. Brita väntar i tryckeriet om du vill göra provtrycket till anslaget.',
    desk: 'Sätt ihop tre kända samband: periodens namn, kompaniets verksamhet och böndernas inflytande.',
    workLabel: 'Hjälp Jo med förklaringarna om makt och handel',
    parcel: {icon:'crate',name:'Lådan med porslin',description:'En liten låda med porslin, varsamt packat för färden till Maja i kaffehuset.'},
    order: {icon:'letter',name:'Beställningen till Jo',description:'Lappen gäller Majas porslin. Ta den till Jo på kajen.'},
    dialogue: {
      accepted: 'Ta med den här lappen ner till Jo på kajen. Maja väntar på porslinet i kaffehuset.',
      workIntro: 'Javisst, Majas porslin finns här. Hjälp mig först med tre förklaringar om makten och handeln, så packar jag lådan åt dig.',
      startLabel: 'Jag hjälper dig med makten och handeln.',
      resumeLabel: 'Jag fortsätter med förklaringarna om makt och handel.',
      workDone: 'Tack för hjälpen! Här är lådan med porslin. Bär den försiktigt till Maja i kaffehuset.',
      delivered: 'Där är porslinet! Tack, ställ lådan här. Brita väntar i tryckeriet om du vill göra provtrycket till anslaget.',
      reminders: {
        offer: {
          cafe: 'Jag behöver porslin från kajen. Brita har beställningslappen i tryckeriet. Hämta den hos henne först.',
          quay: 'Gäller det Majas porslin? Brita har beställningslappen i tryckeriet.'
        },
        work: {
          cafe: 'Jag väntar på porslinet. Gå till Jo på kajen och hjälp honom med förklaringarna, så får du med dig lådan.',
          print: 'Jo har porslinet på kajen. Hjälp honom med förklaringarna om makten och handeln, och ta sedan lådan till Maja.',
          quay: 'Majas låda står här. Ska vi göra klart förklaringarna innan du tar den?',
          archive: 'Det är Jo du ska träffa nu. Han väntar nere på kajen.'
        },
        deliver: {
          cafe: 'Där är du med porslinet. Ställ lådan här, så tar jag emot den.',
          print: 'Den lådan ska till Maja i kaffehuset. Bär den försiktigt dit.',
          quay: 'Lådan är packad. Nu väntar Maja på den i kaffehuset.',
          archive: 'Porslinet ska till Maja i kaffehuset.'
        }
      }
    },
    pickupTexts: [], handoffTexts: []
  },
  '1:3': {
    title: 'Ett godkänt provtryck',
    theme: 'Olika gruppers makt och frihet',
    referenceBrief: 'Grundboken s. 64–65 och arbetsbokens uppgifter 1–4: jämförelsen av kungens minskade makt och olika stånds inflytande över besluten.',
    artifact: 'Anslagen till kaffehuset',
    resultTitle: 'De färdiga anslagen',
    request: 'Anslaget behöver ett sista stycke om olika människors frihet. Skriv det, gör ett provtryck och låt Maja se det.',
    result: 'Anslaget är uppsatt. Tack för hjälpen!',
    desk: 'Återkalla kapitlets jämförelse av olika gruppers frihet. Gör sedan klart anslaget i pressen.',
    workLabel: 'Skriv anslagets sista stycke hos Brita',
    parcel: {icon:'paper',name:'Anslagen till kaffehuset',description:'En bunt tryckta anslag, hopbundna för leveransen till Maja.'},
    order: {icon:'letter',name:'Lappen om provtrycket',description:'Britas lapp om sista stycket, provtrycket och Majas godkännande.'},
    dialogue: {
      accepted: 'Stanna här en stund. Först behöver vi anslagets sista stycke, sedan gör vi ett provtryck.',
      workIntro: 'Hjälp mig beskriva olika människors frihet i sista stycket. Sedan kan vi sätta igång pressen.',
      startLabel: 'Jag skriver anslagets sista stycke.',
      resumeLabel: 'Jag fortsätter med anslagets sista stycke.',
      workDone: 'Nu är texten klar. Gör provtrycket här vid pressen, så kan Maja titta på det.',
      delivered: 'Anslagen är här! Jag sätter upp ett i kaffehuset. Tack för hjälpen.',
      reminders: {
        work: {
          cafe: 'Brita behöver det sista stycket till anslaget. Gå till henne i tryckeriet.',
          print: 'Det sista stycket väntar här. Vill du fortsätta med det?'
        },
        materials: {
          cafe: 'Du kan göra provtrycket hos Brita i tryckeriet. Ta det till mig när det är tryckt.',
          print: 'Texten är klar. Lägg materialet i pressen, så gör vi provtrycket.'
        },
        'handoff:0': {
          cafe: 'Visa mig provtrycket, så ser jag efter att det går att läsa.',
          print: 'Ta provtrycket till Maja i kaffehuset. Hon behöver se det först.'
        },
        'handoff:1': {
          cafe: 'Ta min lapp med godkännandet tillbaka till Brita i tryckeriet.',
          print: 'Har du Majas godkännande med dig? Ge mig lappen, så gör jag upplagan.'
        },
        deliver: {
          cafe: 'Lämna anslagen här, så sätter jag upp ett av dem.',
          print: 'Bunten med anslag ska till Maja i kaffehuset.'
        }
      }
    },
    pickupTexts: [],
    handoffTexts: [
      'Provtrycket går att läsa. Ta mitt godkännande till Brita, så kan hon göra upplagan.',
      'Majas godkännande är här. Upplagan är klar att ta till kaffehuset.'
    ]
  },
  '2:1': {
    title: 'Bladet om kvinnors och barns villkor',
    theme: 'Kvinnors och barns levnadsvillkor',
    referenceBrief: 'Grundboken s. 66–69 och arbetsbokens uppgifter 5–7: ord och fakta om barnens vardag, bestraffningar och kvinnors utsatthet.',
    artifact: 'Faktabladet om vardagsvillkor',
    request: 'Jag vill lägga ett blad om kvinnors och barns villkor på läsbordet. Kan du skriva det här?',
    result: 'Faktabladet är klart. Nästa del blir förklaringar om reglerna och vardagen.',
    desk: 'Återkalla ord och fakta om barnens vardag och de regler som människor levde under.',
    pickupTexts: [], handoffTexts: []
  },
  '2:2': {
    title: 'Två förklaringar om vardagen',
    theme: 'Reglernas följder och barnens vardag',
    referenceBrief: 'Grundboken s. 66–69 och arbetsbokens uppgifter 5–7: reglernas följder för ogifta kvinnor och barnens vardag på barnhus.',
    artifact: 'Vardagsbladets förklaringar',
    request: 'Bladet behöver ett stycke om kvinnornas villkor och ett om barnens vardag. Skriv dem vid barnhuset och ta bladet hit sedan.',
    result: 'Nu finns båda förklaringarna på bladet. En sista del om barnens villkor återstår.',
    desk: 'Sätt ihop de kända sambanden om reglernas följder och vardagen på barnhus.',
    pickupTexts: [], handoffTexts: []
  },
  '2:3': {
    title: 'Hela bilden av barnens villkor',
    theme: 'Barnhusens uppgift och barnens villkor',
    referenceBrief: 'Grundboken s. 66–69 och arbetsbokens uppgift 7: jämförelsen mellan barnhusens uppgift och hur barnen behandlades.',
    artifact: 'Bladet om barnens villkor',
    request: 'Beskriv både varför barnen bor på barnhuset och hur de har det. Gör klart bladet där och ta det hit.',
    result: 'Bladet om barnens villkor är färdigt och får en plats på läsbordet.',
    desk: 'Återkalla kapitlets jämförelse mellan barnhusets uppgift och barnens levnadsvillkor.',
    pickupTexts: [], handoffTexts: []
  },
  '3:1': {
    title: 'Faktabladet om kriget och protesten',
    theme: 'Politiska grupper, krig och protest',
    referenceBrief: 'Grundboken s. 70–74 och arbetsbokens uppgifter 8–10: politiska grupper, samarbeten, kriget, protesten och personerna i berättelsen.',
    artifact: 'Faktabladet om kriget och protesten',
    request: 'Vi behöver ett blad om kriget och protesten. Rut har plats för dig i arkivet. Lämna sedan bladet hos Brita.',
    result: 'Faktabladet är här. Nu kan vi ordna förklaringen av händelserna.',
    desk: 'Återkalla kapitlets grupper, personer, länder och begrepp.',
    pickupTexts: ['Lägg arbetet här. Vi behöver få namn och händelser rätt innan bladet går till tryck.'],
    handoffTexts: []
  },
  '3:2': {
    title: 'Från krig till protest',
    theme: 'Krigets följder, protest och utländskt inflytande',
    referenceBrief: 'Grundboken s. 70–74 och arbetsbokens uppgifter 9–10: händelsekedjan från krig till protest och hur utländskt inflytande förändrades.',
    artifact: 'Förklaringen av kriget och protesten',
    request: 'Faktabladet behöver en förklaring. Skriv hur kriget, protesten och Rysslands inflytande hängde ihop.',
    result: 'Händelserna har fått en sammanhängande förklaring. Nästa del handlar om hur budskapet spreds.',
    desk: 'Återkalla två samband ur kapitlet: händelseförloppet och det förändrade inflytandet.',
    pickupTexts: [], handoffTexts: []
  },
  '3:3': {
    title: 'Förklaringen till budkavlen',
    theme: 'Budskap som historiska källor',
    referenceBrief: 'Avsnittet Krig eller fred?, grundboken s. 70–74. Förklaringen av budkavlens användning och källvärde stöds av prov del 1, uppgift 7, och bedömningsstödet F1, s. 5.',
    artifact: 'Notisen om budkavlen',
    request: 'Jo vill ha en kort förklaring av budkavlen till notisen. Gör den vid kajen och ta den genom tryckeriet till Maja.',
    result: 'Notisen är klar. Nu finns även förklaringen av budkavlen med på läsbordet.',
    desk: 'Återkalla hur budkavlen användes och varför den kan ge kunskap om händelserna.',
    pickupTexts: ['Här är beställningen till notisens sista del. Det behövs en kort text om budkavlen.'],
    handoffTexts: ['Förklaringen är klar att sätta in i notisen. Ta den färdiga sidan till Maja.']
  },
  '4:1': {
    title: 'Bladet om läsning, texter och forskning',
    theme: 'Läsning, tryckta texter och forskning',
    referenceBrief: 'Grundboken s. 75–80 och arbetsbokens uppgifter 11–15: läskunnighet, tryckta texter, insyn i beslut samt forskare och deras bidrag.',
    artifact: 'Faktabladet om läsning och forskning',
    request: 'Jag vill ha ett blad om läsning, texter och forskning till läsbordet. Fyll faktarutorna hos Rut och ta bladet tillbaka hit.',
    result: 'Faktabladet är färdigt. Det kan nu få sällskap av förklaringar om hur nya tankar spreds.',
    desk: 'Återkalla kapitlets ord, forskare, upptäckter och sätt att sprida kunskap.',
    pickupTexts: [], handoffTexts: []
  },
  '4:2': {
    title: 'Förklaringar om läsning och forskning',
    theme: 'Läsningens följder och forskningens villkor',
    referenceBrief: 'Grundboken s. 75–80 och arbetsbokens uppgifter 11 och 15: läsningens följder, forskningens villkor och nyttan av ett forskningsbidrag.',
    artifact: 'Bladet om läsning och forskning',
    request: 'Till forskarbladet saknas tre stycken om läsning, forskning och nyttan av kunskap. Skriv dem i Vetenskapens hus och ta dem hit.',
    result: 'De tre förklaringarna är klara. Nu återstår en kort jämförelse på forskarbladet.',
    desk: 'Sätt ihop de kända sambanden om läskunnighet, forskningens villkor och ett forskningsbidrag.',
    pickupTexts: [], handoffTexts: []
  },
  '4:3': {
    title: 'Forskarbladets jämförelse',
    theme: 'Forskarnas olika bidrag',
    referenceBrief: 'Grundboken s. 75–80 och arbetsbokens uppgifter 13–15: jämförelsen av två forskares bidrag och hur deras kunskap används.',
    artifact: 'Forskarbladet',
    request: 'Lägg till en kort jämförelse av forskarnas bidrag. Lämna sedan det färdiga bladet till Maja.',
    result: 'Tack! Forskarbladet får en plats på läsbordet.',
    desk: 'Återkalla vilken kunskap forskarna bidrog med och hur bidragen hör ihop.',
    pickupTexts: [], handoffTexts: []
  },
  '5:1': {
    title: 'Anslaget om kungamakt och nya idéer',
    theme: 'Kungamakt, nya idéer och ändrade lagar',
    referenceBrief: 'Grundboken s. 81–85 och arbetsbokens uppgifter 16–17: kungen, årtalen för maktförändringen samt nya idéer, friheter och ändrade lagar.',
    artifact: 'Faktabladet till det nya anslaget',
    request: 'Det behövs ett nytt anslag om kungen, nya idéer och ändrade lagar. Hämta det gamla hos Maja och skriv det nya faktabladet här.',
    result: 'Det nya faktabladet är klart. Därefter kan vi lägga till förklaringarna av förändringarna.',
    desk: 'Återkalla kapitlets kung, årtal och begrepp om makt, nya idéer och ändrade lagar.',
    pickupTexts: ['Här är vårt gamla anslag. Brita väntar på dig i tryckeriet.'],
    handoffTexts: []
  },
  '5:2': {
    title: 'Reformbladets förklaringar',
    theme: 'Maktövertagande, reformer och begränsningar',
    referenceBrief: 'Grundboken s. 81–85 och arbetsbokens uppgifter 16–17: maktövertagandet, reglerna för ogifta kvinnor samt reformer och begränsningar.',
    artifact: 'Reformbladet',
    request: 'Hämta reformbladets beställning hos Jo. Här behöver vi beskriva vad som förändrats och vilka begränsningar som finns.',
    result: 'Reformbladets förklaringar är klara. Hos Maja kan anslaget få sin avslutande jämförelse.',
    desk: 'Återkalla sambanden om maktövertagandet, reglerna för ogifta kvinnor och reformerna.',
    pickupTexts: ['Här är beställningen. Brita behöver förklaringar till reformbladet.'],
    handoffTexts: []
  },
  '5:3': {
    title: 'Friheterna i det nya anslaget',
    theme: 'Reformer, kungamakt och olika människors frihet',
    referenceBrief: 'Grundboken s. 81–85 och arbetsbokens uppgift 17: jämförelsen mellan reformer, kungens makt och begränsningar för olika människor. Du knyter också an till sammanfattningen i arbetsbokens uppgifter 34–35.',
    artifact: 'Det nya kungliga anslaget',
    request: 'Maja vill kunna läsa hur reformerna och kungens makt hänger ihop. Skriv anslagets sista stycke hos henne.',
    result: 'Det nya anslaget är uppsatt. Tack för att du gjorde det klart.',
    desk: 'Sätt ihop den kända jämförelsen mellan kungens reformer och olika människors möjligheter.',
    pickupTexts: [], handoffTexts: []
  },
  '6:1': {
    title: 'Brevet om landet och staden',
    theme: 'Arbete, vardagsliv och skapande',
    referenceBrief: 'Grundboken s. 86–89 och arbetsbokens uppgifter 18–22: jordbruk, arbete, stadens vardag, författare och kungens stöd till skapande.',
    artifact: 'Brevet till systern',
    request: 'Ta brevet till byn. Lägg till ett blad om livet på landet och i staden, och se efter vid kartorna så att brevet kommer rätt.',
    result: 'Brevet med faktabladet har kommit fram. Nu kan vi arbeta vidare med förklaringarna om vardagslivet.',
    desk: 'Återkalla kapitlets ord, arbeten och kulturpersoner. Avsluta med spelets bykartor.',
    pickupTexts: [], handoffTexts: []
  },
  '6:2': {
    title: 'Byliv, barnarbete och kultur',
    theme: 'Förändringar i jordbruk, arbete och kultur',
    referenceBrief: 'Grundboken s. 86–89 och arbetsbokens uppgifter 18 och 20–22: jordbrukets förändring, barnarbete, kulturstöd och sånger som källor.',
    artifact: 'Vardagsbladets förklaringar',
    request: 'Vi behöver fyra förklaringar om odlingen, barnarbetet, stödet till kulturen och vad sånger kan berätta. Skriv dem här och ta bladet till Brita.',
    result: 'Vardagsbladets fyra förklaringar är klara. En sista jämförelse om byns förändring återstår.',
    desk: 'Återkalla kända samband om skiftet, barnarbetet, kulturstödet och sånger som källor.',
    pickupTexts: [], handoffTexts: []
  },
  '6:3': {
    title: 'Skiftets olika följder',
    theme: 'Jordbrukets förändring och dess olika följder',
    referenceBrief: 'Grundboken s. 86–89 och arbetsbokens uppgift 18: den kända jämförelsen av hur jordbrukets förändring kunde påverka olika människor.',
    artifact: 'Sidan om skiftet',
    request: 'Hämta beställningen till sista sidan hos Maja. Gör sedan klart jämförelsen av skiftets följder här i tryckeriet och lämna sidan på kaffehuset.',
    result: 'Sidan om skiftet är klar. Den avslutar vårt arbete om landet och staden.',
    desk: 'Återkalla kapitlets jämförelse av hur skiftet kunde påverka olika människor.',
    pickupTexts: ['Här är beställningen till sista sidan om byn. Brita behöver en text om hur skiftet påverkar människorna.'],
    handoffTexts: []
  },
  '7:1': {
    title: 'Faktabladet om handel och krig',
    theme: 'Handel, människors villkor och krig',
    referenceBrief: 'Grundboken s. 90–96 och arbetsbokens uppgifter 23–27: handel, kolonin, människors villkor och kungens krig. Avsnittet blickar också fram mot slaveriets avskaffande på 1800-talet.',
    artifact: 'Handelsbokens faktablad',
    request: 'Jag behöver en faktasida om handeln, människors villkor och kriget till handelsboken. Skriv den i hamnen på Marstrand och ta den tillbaka till mig.',
    result: 'Faktasidan är här. Nu kan vi arbeta vidare med handelsbokens förklaringar.',
    desk: 'Återkalla kapitlets platser, personer, ord och årtal om handel, människors villkor och krig. En fråga blickar fram mot 1800-talet.',
    pickupTexts: [], handoffTexts: []
  },
  '7:2': {
    title: 'Handel, villkor och motstånd',
    theme: 'Handelsregler, slaveri och motstånd',
    referenceBrief: 'Grundboken s. 90–96 och arbetsbokens uppgifter 23–26: handelsregler och handelsvägar, förslavade människors villkor och motstånd samt den senare förändringen på 1800-talet.',
    artifact: 'Handelsbokens förklaringar',
    request: 'Handelsboken behöver också texter om regler, människors villkor och motstånd. Skriv dem i hamnen på Saint Barthélemy och ta dem tillbaka hit.',
    result: 'Förklaringarna är här. Sista delen ska handla om friheter och makt.',
    desk: 'Återkalla fem samband om handelsvägar, regler, slaveri och motstånd. Sista sambandet blickar fram mot 1800-talet.',
    pickupTexts: [],
    handoffTexts: ['Nu är förklaringarna klara. Ta dem med dig tillbaka till Jo.']
  },
  '7:3': {
    title: 'Makt och frihet i handelsboken',
    theme: 'Reformer, ojämlikhet och kungens krigsplaner',
    referenceBrief: 'Grundboken s. 90–96 och arbetsbokens uppgift 27: olika rättigheter och kungens krigsplaner. Jämförelsen återanvänder också reformen på s. 82 från avsnitt 5.',
    artifact: 'Handelsnotisen och krigsbeskedet',
    request: 'Hämta nästa del i tryckeriet och kom sedan tillbaka till kajen. Därefter gör du handelsbokens sista jämförelser hos Brita och lämnar dem till Maja.',
    result: 'Handelsboken har fått sin avslutning om makt, friheter och kungens krigsplaner.',
    desk: 'Återkalla jämförelsen av vilka reformerna gällde och förklaringen av kungens krigsplaner.',
    pickupTexts: [
      'Här är beställningen till handelsbokens avslutning. Jo har nästa del vid kajen.',
      'Kriget är slut. Ta beskedet till Brita, så kan hon göra handelsbokens avslutning.'
    ],
    handoffTexts: []
  },
  '8:1': {
    title: 'Faktarutan om attentatet',
    theme: 'Attentatets personer, plats och tid',
    referenceBrief: 'Grundboken s. 97–99 och arbetsbokens uppgift 28: attentatets årtal, plats och gärningsman samt ett ord för ett straff.',
    artifact: 'Faktarutan till nyheten',
    request: 'Hämta beställningen vid Operan och det senare beskedet hos Jo. Gå sedan tillbaka till Operan och gör notisens faktaruta. Lämna den här när den är klar.',
    result: 'Faktarutan är klar. Nu behöver notisen en tidsföljd och en bakgrund.',
    desk: 'Återkalla kapitlets namn, plats, årtal och begrepp.',
    pickupTexts: [
      'Här är beställningen till notisen om maskeraden. Innan du arbetar med faktarutan ska du hämta det senare beskedet hos Jo.',
      'Här är det senare beskedet. Gå tillbaka till Operan och skriv notisens faktaruta.'
    ],
    handoffTexts: []
  },
  '8:2': {
    title: 'Nyhetens tidsföljd och bakgrund',
    theme: 'Attentatets bakgrund och händelseförlopp',
    referenceBrief: 'Grundboken s. 97–99 och arbetsbokens uppgift 28: händelsernas ordning och bakgrunden till adelns missnöje.',
    artifact: 'Nyhetsutkastet',
    request: 'Notisen måste ha händelserna i rätt ordning. Skriv också om bakgrunden till attentatet.',
    result: 'Utkastet har fått både tidsföljd och bakgrund. Notisens avslutning återstår.',
    desk: 'Återkalla händelseförloppet kring maskeraden och förklaringen av adelns missnöje.',
    pickupTexts: [], handoffTexts: []
  },
  '8:3': {
    title: 'Notisens efterspel',
    theme: 'Attentatets följder för kungen och gärningsmännen',
    referenceBrief: 'Grundboken s. 97–99 och arbetsbokens uppgift 28: jämförelsen mellan det som hände kungen och följderna för gärningsmännen.',
    artifact: 'Nyhetsnotisen',
    request: 'Avsluta notisen med vad som hände efter attentatet. Skilj på kungen och gärningsmännen. Ta sedan den färdiga notisen till Maja.',
    result: 'Notisen är uppsatt med fakta, tidsföljd, bakgrund och efterspel.',
    desk: 'Återkalla vad som hände med kungen och vilka följder attentatet fick för gärningsmännen.',
    pickupTexts: [], handoffTexts: []
  },
  '9:1': {
    title: 'Faktabladet om kriget',
    theme: 'Krigets bakgrund, allianser och deltagare',
    referenceBrief: 'Grundboken s. 100–102 och arbetsbokens uppgifter 29–30: krigets bakgrund, samarbeten, årtal, deltagare och förändringen efter kriget.',
    artifact: 'Faktabladet om kriget',
    request: 'En anhörig väntar på ett brev hos Jo. Skriv först ett faktablad om krigets bakgrund, människorna och hur det slutade. Arbeta här i tryckeriet och ta bladet till kajen.',
    result: 'Faktabladet är här. Nästa del blir brevets förklaring av bakgrunden och händelserna.',
    desk: 'Återkalla personer, länder, årtal och begrepp från kapitlet om kriget.',
    pickupTexts: [], handoffTexts: []
  },
  '9:2': {
    title: 'Brevets förklaring av kriget',
    theme: 'Revolution, allianser och krigets förlopp',
    referenceBrief: 'Grundboken s. 100–102 och arbetsbokens uppgifter 29–30: revolutionen och kungens oro samt sambandet mellan ländernas samarbeten och krigets förlopp.',
    artifact: 'Brevet från Finland',
    request: 'Gör två förklaringar till brevet här vid kajen: kungens oro och vägen fram till krigets slut. Ta brevet till Brita när de är klara.',
    result: 'Brevets förklaringar är klara. Vid kartbordet gör vi den sista sidan.',
    desk: 'Återkalla sambanden om revolutionen, kungens oro och krigets förlopp.',
    pickupTexts: [], handoffTexts: []
  },
  '9:3': {
    title: 'Brevets sista sida',
    theme: 'Människorna i kriget och rikets förändring',
    referenceBrief: 'Grundboken s. 100–102 och arbetsbokens uppgift 30: deltagarnas erfarenheter, motståndet och rikets förändring efter kriget.',
    artifact: 'Brevet och kartan efter freden',
    request: 'Brevet ska också berätta om människorna i kriget och om hur riket förändrats. Jämför kartorna och lämna sedan brevet till den anhöriga på kaffehuset.',
    result: 'Brevet har kommit fram. Tack för att du tog det hela vägen hit.',
    desk: 'Återkalla människors erfarenheter och rikets förändring. Avsluta med spelets kartjämförelse.',
    pickupTexts: [], handoffTexts: []
  },
  '10:1': {
    title: 'Bokens sida om gamla texter',
    theme: 'Gamla texter och spridning av kunskap',
    referenceBrief: 'Grundboken s. 103–105 och arbetsbokens uppgift 31: bevarade texter, register, en tidning och hur forskning kunde nå fler läsare.',
    artifact: 'Sidan om gamla texter',
    request: 'Vi ska samla våra arbeten till en bok. Hämta kartbladet i byn, ett blad i tryckeriet och omslagsbilden här. Rut vill sedan ha en kort text om gamla texter och hur kunskap har spridits.',
    result: 'Sidan om gamla texter är klar. Nu behöver vi sidan om vad texter och bilder kan berätta.',
    desk: 'Återkalla kapitlets ord och namn för källor, texter och kunskapsspridning.',
    pickupTexts: [
      'Här är kartbladet till vår samling. Ta med det till de andra arbetena.',
      'Här är bladet till samlingen. Ta med det och hämta sedan omslagsbilden hos Maja.',
      'Här är bilden till samlingens omslag. Ta allt till Rut; hon väntar på din text om källorna.'
    ],
    handoffTexts: []
  },
  '10:2': {
    title: 'Bokens sida om texter och bilder',
    theme: 'Vad texter och bilder kan berätta',
    referenceBrief: 'Grundboken s. 103–105 och arbetsbokens uppgifter 31–32: vad olika texter kan berätta och hur man kan undersöka bilder. Bildfrågan återkallar metoden; den visar inga porträtt för egen bildtolkning.',
    artifact: 'Sidan om texter och bilder',
    request: 'Till boken vill jag ha en sida om vad gamla texter kan berätta och vad man kan leta efter i bilder. Skriv de två förklaringarna här.',
    result: 'Sidan är klar. Nu återstår bokens avslutning.',
    desk: 'Återkalla vad olika källtyper kan berätta. Sista uppgiften är metodträning inför bildtolkning.',
    pickupTexts: [], handoffTexts: []
  },
  '10:3': {
    title: 'Bokens avslutning',
    theme: 'Makt, läsning, krig och historisk kunskap',
    referenceBrief: 'Avslutningen återanvänder makt, läsning och krig från avsnitten 1, 4 och 9 samt källor från s. 103–105. Underlaget är bland annat arbetsbokens uppgifter 11 och 30–34 samt bokens lärandemål.',
    artifact: 'Boken om 1700-talet',
    resultTitle: 'Den färdiga boken om 1700-talet',
    request: 'Sätt ihop fyra avslutande förklaringar om makt, läsning, krig och källor. Ta sedan den färdiga boken till Maja.',
    result: 'Boken är framme. Tack för alla arbeten du har lämnat här!',
    desk: 'Återkalla de kända sambanden om makt, läsning, krig och hur historisk kunskap kan förändras.',
    pickupTexts: [], handoffTexts: []
  }
};

// Noun phrases describe the actual existing work without supplying its answers.
// They keep the chosen task distinct from the object earned or carried by it.
const WORK_TOPICS = {
  '1:1':'fakta om makt och handel', '1:2':'makten och handeln', '1:3':'olika gruppers frihet',
  '2:1':'kvinnors och barns villkor', '2:2':'reglerna och vardagen', '2:3':'barnens levnadsvillkor',
  '3:1':'krigets namn och händelser', '3:2':'krigets följder och protesten', '3:3':'budkavlens användning',
  '4:1':'läsning, tryckta texter och forskning', '4:2':'läsningens följder och forskningens villkor', '4:3':'forskarnas olika bidrag',
  '5:1':'kungens makt, nya idéer och ändrade lagar', '5:2':'maktförändringen och reformerna', '5:3':'reformerna och människors frihet',
  '6:1':'vardagslivets namn och ord', '6:2':'odling, barnarbete och kultur', '6:3':'skiftets följder',
  '7:1':'handel, människors villkor och krig', '7:2':'handelsreglerna och människors villkor', '7:3':'friheterna och krigsplanerna',
  '8:1':'attentatets namn, plats och årtal', '8:2':'händelsernas ordning och bakgrund', '8:3':'attentatets efterspel',
  '9:1':'krigets bakgrund, människor och följder', '9:2':'krigets bakgrund och förlopp', '9:3':'människorna och rikets förändring',
  '10:1':'gamla texter och kunskapsspridning', '10:2':'vad gamla texter och bilder kan berätta', '10:3':'makt, läsning, krig och källor'
};
const DESTINATIONS = {
  cafe:{person:'Maja',visit:'Maja i kaffehuset',order:'Majas beställning'},
  print:{person:'Brita',visit:'Brita i tryckeriet',order:'Britas beställning'},
  archive:{person:'Rut',visit:'Rut i arkivet',order:'Ruts beställning'},
  quay:{person:'Jo',visit:'Jo på kajen',order:'Jos beställning'},
  barnhus:{person:'medhjälparen',visit:'medhjälparen på barnhuset'},
  garden:{person:'Sam',visit:'Sam i Vetenskapens hus'},
  farm:{person:'Karin',visit:'Karin i byn',order:'Karins beställning'},
  opera:{person:'budet',visit:'budet vid Operan'},
  marstrand:{person:'hamnskrivaren',visit:'hamnskrivaren i hamnen på Marstrand'},
  colony:{person:'berättaren',visit:'berättaren i hamnen på Saint Barthélemy'}
};
const inSentence = text => text ? text[0].toLocaleLowerCase('sv') + text.slice(1) : '';
const destination = place => DESTINATIONS[place]?.visit || place;
const goTo = place => `${['marstrand','colony'].includes(place) ? 'Res' : 'Gå'} till ${destination(place)}`;

function parcelFor(job, level, key) {
  if (job.parcel) return {...job.parcel};
  const icon = key === '10:3' ? 'book' : level.puzzle === 'finland' ? 'map'
    : /^Brevet/.test(job.artifact) ? 'letter' : 'paper';
  const objects = {
    paper:'Ett skrivet blad, vikt för att kunna bäras med.',
    letter:'Ett hopvikt brev med ditt färdiga arbete.',
    map:'Brevet och kartan ihopbundna med ett band.',
    book:'De samlade arbetena mellan två bokpärmar.'
  };
  return {
    icon, name:job.artifact,
    description:`${objects[icon]} Lämnas till ${destination(level.recipient)}.`
  };
}

function describeJob(chapter, level, job, key) {
  const topic = WORK_TOPICS[key];
  const parcel = parcelFor(job, level, key);
  const firstPlace = level.pickups[0]?.place || level.work;
  const sender = DESTINATIONS[level.giver];
  const order = job.order ? {...job.order} : {
    icon:'letter', name:sender?.order || 'Lappen med beställningen',
    description:`En vikt beställningslapp för ${inSentence(job.title)}. ${goTo(firstPlace)} för nästa steg.`
  };
  const workIntro = job.dialogue?.workIntro || `Jag behöver hjälp med ${topic}. Vi tar en del i taget.`;
  const maps = {};
  const reminderMap = (target, here, away) => Object.fromEntries(
    Object.keys(DESTINATIONS).map(place => [place,place === target ? here : away])
  );
  maps.offer = reminderMap(level.giver,job.request,`${goTo(level.giver)}. Där finns beställningen till nästa arbete.`);
  maps.work = reminderMap(level.work,workIntro,`${goTo(level.work)}. Där väntar arbetet med ${topic}.`);
  maps.deliver = reminderMap(level.recipient,
    `Lämna ${inSentence(parcel.name)} här, tack.`,
    `Ta ${inSentence(parcel.name)} till ${destination(level.recipient)}.`);
  if (level.materials) maps.materials = reminderMap('print',
    'Texten är klar. Nu kan du göra provtrycket här vid pressen.',
    'Gå till Brita i tryckeriet och gör provtrycket där.');
  if (level.puzzle) maps.puzzle = reminderMap(level.work,
    'Kartorna ligger här. Titta på dem innan du lämnar arbetet.',
    `${goTo(level.work)} och jämför kartorna innan du lämnar arbetet.`);
  for (const phase of ['pickup','handoff']) {
    const stops = phase === 'pickup' ? level.pickups : level.handoffs;
    stops.forEach((stop, index) => {
      const map = reminderMap(stop.place,stop.text,`${goTo(stop.place)}. Det är nästa steg i beställningen.`);
      maps[`${phase}:${index}`] = map;
      if (stops.length === 1) maps[phase] = {...map};
    });
  }
  for (const [phase,lines] of Object.entries(job.dialogue?.reminders || {})) {
    maps[phase] = {...maps[phase],...lines};
  }
  const next = chapter.levels.find(candidate => candidate.level === level.level + 1);
  const nextLine = next ? next.giver === level.recipient
    ? ' Jag har nästa beställning här när du vill fortsätta.'
    : ` Vill du fortsätta finns nästa beställning hos ${destination(next.giver)}.` : '';
  const afterWork = level.handoffs[0]?.place || level.recipient;
  const workDone = level.materials ? 'Texten är klar. Nu kan du göra provtrycket här vid pressen.'
    : level.puzzle ? 'Arbetet är klart. Jämför kartorna här innan du lämnar det.'
    : afterWork === level.work ? `Arbetet är klart. Lägg ${inSentence(parcel.name)} här på bordet.`
    : `Arbetet är klart. Ta ${inSentence(parcel.name)} till ${destination(afterWork)}.`;
  const dialogue = {
    accepted:firstPlace === level.giver ? `Du kan börja här. ${workIntro}` : `Ta med den här lappen. ${goTo(firstPlace)} för nästa steg.`,
    workIntro,
    startLabel:`Jag hjälper dig med ${topic}.`,
    resumeLabel:`Jag fortsätter med ${topic}.`,
    workDone,
    delivered:job.result + nextLine,
    ...job.dialogue,
    reminders:maps
  };
  return {...job,key,resultTitle:job.resultTitle || job.artifact,
    parcel,order,dialogue,workLabel:job.workLabel || `Arbeta med ${topic}`,
    pickupTexts:[...job.pickupTexts],handoffTexts:[...job.handoffTexts]};
}

export function applyChapterJobs(content) {
  if (!content || !Array.isArray(content.chapters)) throw new TypeError('Kapitlens arbeten saknas.');
  const assignments = content.chapters.flatMap(chapter => chapter.levels.map(level => {
    const key = `${chapter.id}:${level.level}`;
    const job = JOBS[key];
    if (!job || level.pickups.length !== job.pickupTexts.length || level.handoffs.length !== job.handoffTexts.length) {
      throw new Error(`Arbetsbeskrivningen stämmer inte med rutten: ${key}`);
    }
    if (key === '1:2' && !['print','cafe'].includes(level.recipient)) {
      throw new Error('Mottagaren för porslinsleveransen måste kontrolleras.');
    }
    return {chapter, level, job, key};
  }));
  // Validate every route before applying anything, so a changed route cannot
  // leave half of the story using incompatible work descriptions.
  for (const {chapter, level, job, key} of assignments) {
    // The existing saved phases and quiz drafts remain valid: the commission
    // and work stay with Brita and Jo; only the completed delivery changes.
    if (key === '1:2') level.recipient = 'cafe';
    for (const field of ['title', 'artifact', 'request', 'result']) level[field] = job[field];
    level.pickups.forEach((stop, i) => { stop.text = job.pickupTexts[i]; });
    level.handoffs.forEach((stop, i) => { stop.text = job.handoffTexts[i]; });
    level.job = describeJob(chapter,level,job,key);
  }
  return content;
}
