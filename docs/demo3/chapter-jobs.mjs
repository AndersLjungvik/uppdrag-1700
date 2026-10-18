// Work descriptions for the existing sourced classroom bank. These are the
// player's products and commissions, never additional historical evidence.
// Question IDs, answer rules, routes and saved progression stay in the engine.
export const JOBS = {
  '1:1': {
    title: 'Manuset till anslaget',
    artifact: 'Manuset till anslaget',
    resultTitle: 'Det kontrollerade manuset',
    request: 'Jag vill sätta upp ett anslag om makten och handeln. Kan du skriva manuset hos Brita?',
    result: 'Tack, manuset är här. Jag behöver också en handelsnotis från Jo vid kajen.',
    desk: 'Återkalla kapitlets namn, begrepp och fakta om hur landet styrdes och hur handeln gick till.',
    pickupTexts: [], handoffTexts: []
  },
  '1:2': {
    title: 'Förklaringarna till anslaget',
    artifact: 'Handelsnotisen från Jo',
    request: 'Anslaget behöver också förklaringar om makten och handeln. Gör dem hos Jo vid kajen och ta handelsnotisen tillbaka till mig.',
    result: 'Tack, nu har anslaget sina förklaringar. En sista kontroll återstår före provtrycket.',
    desk: 'Sätt ihop tre kända samband: periodens namn, kompaniets verksamhet och böndernas inflytande.',
    pickupTexts: [], handoffTexts: []
  },
  '1:3': {
    title: 'Ett godkänt provtryck',
    artifact: 'Anslaget till kaffehuset',
    resultTitle: 'Det färdiga anslaget',
    request: 'Anslaget behöver ett sista stycke om olika människors frihet. Skriv det, gör ett provtryck och låt Maja se det.',
    result: 'Anslaget är uppsatt. Tack för hjälpen!',
    desk: 'Återkalla kapitlets jämförelse av olika gruppers frihet. Gör sedan klart anslaget i pressen.',
    pickupTexts: [],
    handoffTexts: [
      'Provtrycket går att läsa. Ta mitt godkännande till Brita, så kan hon göra upplagan.',
      'Majas godkännande är här. Upplagan är klar att ta till kaffehuset.'
    ]
  },
  '2:1': {
    title: 'Bladet om kvinnors och barns villkor',
    artifact: 'Faktabladet om vardagsvillkor',
    request: 'Jag vill lägga ett blad om kvinnors och barns villkor på läsbordet. Kan du skriva det här?',
    result: 'Faktabladet är klart. Nästa del blir förklaringar om reglerna och vardagen.',
    desk: 'Återkalla ord och fakta om barnens vardag och de regler som människor levde under.',
    pickupTexts: [], handoffTexts: []
  },
  '2:2': {
    title: 'Två förklaringar om vardagen',
    artifact: 'Vardagsbladets förklaringar',
    request: 'Bladet behöver ett stycke om kvinnornas villkor och ett om barnens vardag. Skriv dem vid barnhuset och ta bladet hit sedan.',
    result: 'Nu finns båda förklaringarna på bladet. En sista del om barnens villkor återstår.',
    desk: 'Sätt ihop de kända sambanden om reglernas följder och vardagen på barnhus.',
    pickupTexts: [], handoffTexts: []
  },
  '2:3': {
    title: 'Hela bilden av barnens villkor',
    artifact: 'Bladet om barnens villkor',
    request: 'Beskriv både varför barnen bor på barnhuset och hur de har det. Gör klart bladet där och ta det hit.',
    result: 'Bladet om barnens villkor är färdigt och får en plats på läsbordet.',
    desk: 'Återkalla kapitlets jämförelse mellan barnhusets uppgift och barnens levnadsvillkor.',
    pickupTexts: [], handoffTexts: []
  },
  '3:1': {
    title: 'Faktabladet om kriget och protesten',
    artifact: 'Faktabladet om kriget och protesten',
    request: 'Vi behöver ett blad om kriget och protesten. Rut har plats för dig i arkivet. Lämna sedan bladet hos Brita.',
    result: 'Faktabladet är här. Nu kan vi ordna förklaringen av händelserna.',
    desk: 'Återkalla kapitlets grupper, personer, länder och begrepp.',
    pickupTexts: ['Lägg arbetet här. Vi behöver få namn och händelser rätt innan bladet går till tryck.'],
    handoffTexts: []
  },
  '3:2': {
    title: 'Från krig till protest',
    artifact: 'Förklaringen av kriget och protesten',
    request: 'Faktabladet behöver en förklaring. Skriv hur kriget, protesten och Rysslands inflytande hängde ihop.',
    result: 'Händelserna har fått en sammanhängande förklaring. Nästa del handlar om hur budskapet spreds.',
    desk: 'Återkalla två samband ur kapitlet: händelseförloppet och det förändrade inflytandet.',
    pickupTexts: [], handoffTexts: []
  },
  '3:3': {
    title: 'Förklaringen till budkavlen',
    artifact: 'Notisen om budkavlen',
    request: 'Jo vill ha en kort förklaring av budkavlen till notisen. Gör den vid kajen och ta den genom tryckeriet till Maja.',
    result: 'Notisen är klar. Nu finns även förklaringen av budkavlen med på läsbordet.',
    desk: 'Återkalla hur budkavlen användes och varför den kan ge kunskap om händelserna.',
    pickupTexts: ['Här är beställningen till notisens sista del. Det behövs en kort text om budkavlen.'],
    handoffTexts: ['Förklaringen är klar att sätta in i notisen. Ta den färdiga sidan till Maja.']
  },
  '4:1': {
    title: 'Faktabladet om nya tankar',
    artifact: 'Faktabladet om läsning och forskning',
    request: 'Jag vill ha ett blad om läsning, texter och forskning till läsbordet. Fyll faktarutorna hos Rut och ta bladet tillbaka hit.',
    result: 'Faktabladet är färdigt. Det kan nu få sällskap av förklaringar om hur nya tankar spreds.',
    desk: 'Återkalla kapitlets ord, forskare, upptäckter och sätt att sprida kunskap.',
    pickupTexts: [], handoffTexts: []
  },
  '4:2': {
    title: 'Tre förklaringar om nya tankar',
    artifact: 'Forskarbladets förklaringar',
    request: 'Till forskarbladet saknas tre stycken om läsning, forskning och nyttan av kunskap. Skriv dem i Vetenskapens hus och ta dem hit.',
    result: 'De tre förklaringarna är klara. Nu återstår en kort jämförelse på forskarbladet.',
    desk: 'Sätt ihop de kända sambanden om läskunnighet, forskningens villkor och ett forskningsbidrag.',
    pickupTexts: [], handoffTexts: []
  },
  '4:3': {
    title: 'Forskarbladets jämförelse',
    artifact: 'Forskarbladet',
    request: 'Lägg till en kort jämförelse av forskarnas bidrag. Lämna sedan det färdiga bladet till Maja.',
    result: 'Tack! Forskarbladet får en plats på läsbordet.',
    desk: 'Återkalla vilken kunskap forskarna bidrog med och hur bidragen hör ihop.',
    pickupTexts: [], handoffTexts: []
  },
  '5:1': {
    title: 'Det nya anslagets faktarutor',
    artifact: 'Det nya underlaget',
    request: 'Det behövs ett nytt anslag om kungen och makten. Hämta det gamla hos Maja och skriv det nya underlaget här.',
    result: 'Det nya faktabladet är klart. Därefter kan vi lägga till förklaringarna av förändringarna.',
    desk: 'Återkalla kapitlets kung, årtal och ord om makt och friheter.',
    pickupTexts: ['Här är vårt gamla anslag. Brita väntar på dig i tryckeriet.'],
    handoffTexts: []
  },
  '5:2': {
    title: 'Reformbladets förklaringar',
    artifact: 'Reformbladet',
    request: 'Hämta reformbladets beställning hos Jo. Här behöver vi beskriva vad som förändrats och vilka begränsningar som finns.',
    result: 'Reformbladets förklaringar är klara. Hos Maja kan anslaget få sin avslutande jämförelse.',
    desk: 'Återkalla sambanden om maktövertagandet, reglerna för ogifta kvinnor och reformerna.',
    pickupTexts: ['Här är beställningen. Brita behöver förklaringar till reformbladet.'],
    handoffTexts: []
  },
  '5:3': {
    title: 'Friheterna i det nya anslaget',
    artifact: 'Det nya kungliga anslaget',
    request: 'Maja vill kunna läsa hur reformerna och kungens makt hänger ihop. Skriv anslagets sista stycke hos henne.',
    result: 'Det nya anslaget är uppsatt. Tack för att du gjorde det klart.',
    desk: 'Sätt ihop den kända jämförelsen mellan kungens reformer och olika människors möjligheter.',
    pickupTexts: [], handoffTexts: []
  },
  '6:1': {
    title: 'Brevet om landet och staden',
    artifact: 'Brevet till systern',
    request: 'Ta brevet till byn. Lägg till ett blad om livet på landet och i staden, och se efter vid kartorna så att brevet kommer rätt.',
    result: 'Brevet med faktabladet har kommit fram. Nu kan vi arbeta vidare med förklaringarna om vardagslivet.',
    desk: 'Återkalla kapitlets ord, arbeten och kulturpersoner. Avsluta med spelets bykartor.',
    pickupTexts: [], handoffTexts: []
  },
  '6:2': {
    title: 'Fyra förklaringar om vardagslivet',
    artifact: 'Vardagsbladets förklaringar',
    request: 'Vi behöver förklara både byns förändring och livet i staden. Skriv de fyra styckena här och ta dem till Brita.',
    result: 'Vardagsbladets fyra förklaringar är klara. En sista jämförelse om byns förändring återstår.',
    desk: 'Återkalla kända samband om skiftet, barnarbetet, kulturstödet och sånger som källor.',
    pickupTexts: [], handoffTexts: []
  },
  '6:3': {
    title: 'Skiftets olika följder',
    artifact: 'Sidan om skiftet',
    request: 'Hämta beställningen till sista sidan hos Maja. Gör sedan klart jämförelsen av skiftets följder här i tryckeriet och lämna sidan på kaffehuset.',
    result: 'Sidan om skiftet är klar. Den avslutar vårt arbete om landet och staden.',
    desk: 'Återkalla kapitlets jämförelse av hur skiftet kunde påverka olika människor.',
    pickupTexts: ['Här är beställningen till sista sidan om byn. Brita behöver en text om hur skiftet påverkar människorna.'],
    handoffTexts: []
  },
  '7:1': {
    title: 'Handelsbokens faktasida',
    artifact: 'Handelsbokens faktablad',
    request: 'Jag behöver en faktasida till handelsboken. Skriv den i hamnen på Marstrand och ta den tillbaka till mig.',
    result: 'Faktasidan är här. Nu kan vi arbeta vidare med handelsbokens förklaringar.',
    desk: 'Återkalla kapitlets platser, personer, ord och årtal. En fråga blickar fram mot 1800-talet.',
    pickupTexts: [], handoffTexts: []
  },
  '7:2': {
    title: 'Handel, villkor och motstånd',
    artifact: 'Handelsbokens förklaringar',
    request: 'Handelsboken behöver också texter om regler, människors villkor och motstånd. Skriv dem i hamnen på Saint Barthélemy och ta dem tillbaka hit.',
    result: 'Förklaringarna är här. Sista delen ska handla om friheter och makt.',
    desk: 'Återkalla fem samband om handelsvägar, regler, slaveri och motstånd. Sista sambandet blickar fram mot 1800-talet.',
    pickupTexts: [],
    handoffTexts: ['Nu är förklaringarna klara. Ta dem med dig tillbaka till Jo.']
  },
  '7:3': {
    title: 'Makt och frihet i handelsboken',
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
    title: 'Nyhetens faktaruta',
    artifact: 'Notisens faktaunderlag',
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
    artifact: 'Nyhetsutkastet',
    request: 'Notisen måste ha händelserna i rätt ordning. Skriv också om bakgrunden till attentatet.',
    result: 'Utkastet har fått både tidsföljd och bakgrund. Notisens avslutning återstår.',
    desk: 'Återkalla händelseförloppet kring maskeraden och förklaringen av adelns missnöje.',
    pickupTexts: [], handoffTexts: []
  },
  '8:3': {
    title: 'Notisens efterspel',
    artifact: 'Nyhetsnotisen',
    request: 'Avsluta notisen med vad som hände efter attentatet. Skilj på kungen och gärningsmännen. Ta sedan den färdiga notisen till Maja.',
    result: 'Notisen är uppsatt med fakta, tidsföljd, bakgrund och efterspel.',
    desk: 'Återkalla vad som hände med kungen och vilka följder attentatet fick för gärningsmännen.',
    pickupTexts: [], handoffTexts: []
  },
  '9:1': {
    title: 'Brevets faktablad',
    artifact: 'Faktabladet om krigets bakgrund',
    request: 'En anhörig väntar på ett brev hos Jo. Skriv först ett faktablad om krigets bakgrund i tryckeriet och ta det till kajen.',
    result: 'Faktabladet är här. Nästa del blir brevets förklaring av bakgrunden och händelserna.',
    desk: 'Återkalla personer, länder, årtal och begrepp från kapitlet om kriget.',
    pickupTexts: [], handoffTexts: []
  },
  '9:2': {
    title: 'Brevets förklaring av kriget',
    artifact: 'Brevet från Finland',
    request: 'Gör två förklaringar till brevet här vid kajen: kungens oro och vägen fram till krigets slut. Ta brevet till Brita när de är klara.',
    result: 'Brevets förklaringar är klara. Vid kartbordet gör vi den sista sidan.',
    desk: 'Återkalla sambanden om revolutionen, kungens oro och krigets förlopp.',
    pickupTexts: [], handoffTexts: []
  },
  '9:3': {
    title: 'Brevets sista sida',
    artifact: 'Brevet och kartan efter freden',
    request: 'Brevet ska också berätta om människorna i kriget och om hur riket förändrats. Jämför kartorna och lämna sedan brevet till den anhöriga på kaffehuset.',
    result: 'Brevet har kommit fram. Tack för att du tog det hela vägen hit.',
    desk: 'Återkalla människors erfarenheter och rikets förändring. Avsluta med spelets kartjämförelse.',
    pickupTexts: [], handoffTexts: []
  },
  '10:1': {
    title: 'Källsamlingens faktaruta',
    artifact: 'Källsamlingen',
    request: 'Vi ska samla våra arbeten till en bok. Hämta kartbladet i byn, ett blad i tryckeriet och omslagsbilden här. Rut behöver sedan en kort text om våra källor.',
    result: 'Samlingen och faktarutan är klara. Nu behöver vi sidan om källor och bilder.',
    desk: 'Återkalla kapitlets ord och namn för källor, texter och kunskapsspridning.',
    pickupTexts: [
      'Här är kartbladet till vår samling. Ta med det till de andra arbetena.',
      'Här är bladet till samlingen. Ta med det och hämta sedan omslagsbilden hos Maja.',
      'Här är bilden till samlingens omslag. Ta allt till Rut; hon väntar på din text om källorna.'
    ],
    handoffTexts: []
  },
  '10:2': {
    title: 'Minnesstöd om källor och bilder',
    artifact: 'Minnesbladet om källor',
    request: 'Till boken vill jag ha en sida om gamla texter och bilder. Skriv vad man kan få veta av dem och hur man kan undersöka dem.',
    result: 'Sidan är klar. Nu återstår bokens avslutning.',
    desk: 'Återkalla vad olika källtyper kan berätta. Sista uppgiften är metodträning inför bildtolkning.',
    pickupTexts: [], handoffTexts: []
  },
  '10:3': {
    title: 'Bokens avslutning',
    artifact: 'Tryckeriets bok',
    resultTitle: 'Tryckeriets färdiga bok',
    request: 'Sätt ihop fyra avslutande förklaringar om makt, läsning, krig och källor. Ta sedan den färdiga boken till Maja.',
    result: 'Boken är framme. Tack för alla arbeten du har lämnat här!',
    desk: 'Återkalla de kända sambanden om makt, läsning, krig och hur historisk kunskap kan förändras.',
    pickupTexts: [], handoffTexts: []
  }
};

export function applyChapterJobs(content) {
  if (!content || !Array.isArray(content.chapters)) throw new TypeError('Kapitlens arbeten saknas.');
  const assignments = content.chapters.flatMap(chapter => chapter.levels.map(level => {
    const key = `${chapter.id}:${level.level}`;
    const job = JOBS[key];
    if (!job || level.pickups.length !== job.pickupTexts.length || level.handoffs.length !== job.handoffTexts.length) {
      throw new Error(`Arbetsbeskrivningen stämmer inte med rutten: ${key}`);
    }
    return {level, job, key};
  }));
  // Validate every route before applying anything, so a changed route cannot
  // leave half of the story using incompatible work descriptions.
  for (const {level, job, key} of assignments) {
    for (const field of ['title', 'artifact', 'request', 'result']) level[field] = job[field];
    level.pickups.forEach((stop, i) => { stop.text = job.pickupTexts[i]; });
    level.handoffs.forEach((stop, i) => { stop.text = job.handoffTexts[i]; });
    level.job = {...job, key, resultTitle: job.resultTitle || job.artifact,
      pickupTexts: [...job.pickupTexts], handoffTexts: [...job.handoffTexts]};
  }
  return content;
}
