'use strict';
(() => {
 const short = (id, question, answer, accept, distractors, explanation, hint='Skriv ett ord eller en kort fras.') => ({id,type:'short',question,answer,accept,distractors,explanation,hint});
 const chain = (id,question,steps,explanation) => ({id,type:'chain',question,steps,explanation,hint:'Bygg ett historiskt samband. Välj en del i varje ruta.'});
 window.CURRICULUM = {
  version:1,
  title:'Uppdrag 1700',
  scope:'Sveriges frihetstid och gustavianska tid, med utblickar mot upplysningen och handeln.',
  missions:[
   {id:'press',title:'Tryckeriets hemlighet',location:'Tryckeriet',symbol:'▤',period:'1766',npc:'Boktryckaren Brita',x:650,y:850,color:'#ba9254',reward:120,
    story:'Det doftar trycksvärta i gränden. Brita drar ner persiennen och visar ett förseglat paket. ”Det här dokumentet förändrade vad som fick tryckas. Arkivet måste få rätt berättelse. Kan du kontrollera mina fyra uppgifter och sätta ihop sambandet innan du tar paketet?”',
    notes:['År 1766 fick Sverige en tryckfrihetsförordning. Den gav större frihet att trycka texter och införde rätt till insyn i många myndighetshandlingar. Friheten hade fortfarande begränsningar, bland annat för religiösa texter.','Censur innebär att makthavare granskar eller hindrar innehåll. Offentlighetsprincipen gör det möjligt att granska hur makten används. Tryckfriheten begränsades på nytt under Gustav III.'],
    cards:[
     short('press-year','Vilket år fick Sverige sin första tryckfrihetsförordning?','1766',['1766'],['1772','1719','1792'],'1766 antog riksdagen tryckfrihetsförordningen.','Skriv ett årtal.'),
     short('press-censor','Vad kallas det när makthavare granskar eller stoppar texter och åsikter?','Censur',['censur','censurering','censurerar'],['Jordbruk','Revolution','Export'],'Censur kan hindra människor från att sprida texter och åsikter.'),
     short('press-open','Vilken princip ger människor rätt till insyn i många myndighetshandlingar?','Offentlighetsprincipen',['offentlighetsprincipen','offentlighetsprincip'],['Envälde','Ståndsprivilegier','Merkantilism'],'Offentlighetsprincipen ger insyn i myndigheternas arbete. Vissa uppgifter kan ändå vara hemliga.'),
     short('press-freedom','Vad kallas friheten att uttrycka sig i tryckta texter?','Tryckfrihet',['tryckfrihet','tryckfriheten'],['Censur','Missväxt','Monopol'],'Tryckfrihet gör det möjligt att sprida information och åsikter i tryck, inom lagens gränser.'),
     chain('press-chain','Bygg sambandet: varför kan insyn begränsa maktmissbruk?',[
      {answer:'Människor får läsa myndighetshandlingar',options:['Människor får läsa myndighetshandlingar','Myndighetshandlingar förstörs','Bara kungen får läsa dokument']},
      {answer:'Missförhållanden kan upptäckas och diskuteras',options:['Missförhållanden kan upptäckas och diskuteras','All kritik blir förbjuden','Makthavare blir automatiskt felfria']},
      {answer:'Makthavare kan ställas till svars',options:['Makthavare kan ställas till svars','Alla får rösträtt år 1766','Riksdagen försvinner']}
     ],'Insyn kan göra det lättare att upptäcka och kritisera maktmissbruk. Den gör inte samhället demokratiskt automatiskt.')
    ]},
   {id:'power',title:'Vem har makten?',location:'Riksdagshuset',symbol:'♜',period:'1719–1772',npc:'Skrivaren Elias',x:1130,y:395,color:'#80916b',reward:120,
    story:'Från riksdagshuset hörs upprörda röster. Elias sitter på trappan med en sönderriven förteckning. ”Alla säger att deras grupp borde bestämma. Men vem hade egentligen makten under frihetstiden? Hjälp mig att återställa dokumentet innan det lämnas till arkivet.”',
    notes:['Frihetstiden brukar dateras till 1719–1772. Kungens makt minskade och riksdagen fick större inflytande. Hattar och mössor var två politiska grupper.','Riksdagen bestod av fyra stånd: adel, präster, borgare och bönder. De flesta människor hade ändå inget politiskt inflytande. Det var alltså inte demokrati som i dagens Sverige.'],
    cards:[
     short('power-era','Vad kallas perioden i Sverige mellan 1719 och 1772?','Frihetstiden',['frihetstiden','frihetstid'],['Stormaktstiden','Vikingatiden','Medeltiden'],'Perioden kallas frihetstiden eftersom kungens makt begränsades.'),
     short('power-parliament','Vilken politisk församling fick större makt under frihetstiden?','Riksdagen',['riksdagen','riksdag','ståndsriksdagen'],['Kungen','Kyrkorådet','Ostindiska kompaniet'],'Riksdagen fick större makt. Kungamakten var svagare än under enväldet.'),
     short('power-parties','Vilka två politiska grupper konkurrerade under frihetstiden?','Hattar och mössor',['hattar och mössor','hattarna och mössorna','mössor och hattar','mössorna och hattarna','hattar mössor'],['Adel och torpare','Kungar och kejsare','Vikingar och munkar'],'Hattar och mössor var två konkurrerande politiska grupper.','Skriv båda grupperna.'),
     short('power-estates','Vilket stånd bestod bland annat av städernas köpmän och hantverkare?','Borgare',['borgare','borgarna','borgarståndet'],['Adel','Präster','Bönder'],'Borgarståndet representerade bland annat köpmän och hantverkare i städerna.'),
     chain('power-chain','Bygg sambandet: hur ändrades fördelningen av makt?',[
      {answer:'Kungens makt begränsas',options:['Kungens makt begränsas','Kungen får all makt','Alla stånd avskaffas 1719']},
      {answer:'Riksdagen får större inflytande',options:['Riksdagen får större inflytande','Riksdagen blir maktlös','Alla invånare får lika inflytande']},
      {answer:'De flesta människor saknar ändå politiskt inflytande',options:['De flesta människor saknar ändå politiskt inflytande','Sverige blir en modern demokrati','Varje barn får en röst i riksdagen']}
     ],'Frihetstid betydde mer frihet från kungligt envälde, men inte lika politiska rättigheter för alla.')
    ]},
   {id:'farm',title:'Fält utan skörd',location:'Byn utanför staden',symbol:'♧',period:'1700-talets vardag',npc:'Bonden Karin',x:470,y:1280,color:'#b59453',reward:120,
    story:'En tom säck ligger bredvid kvarnen. Karin visar de glesa axen på åkern. ”Vi måste förklara varför livet på landet kunde vara så sårbart. Mitt brev till arkivet är nästan klart, men några viktiga ord saknas. Hjälp mig att göra det begripligt.”',
    notes:['De flesta människor i Sverige levde på landsbygden under 1700-talet. Många var beroende av jordbruket och av att skörden räckte. Missväxt betyder att skörden blir ovanligt dålig.','Bönderna var ett av riksdagens stånd, men alla som arbetade på landet hade inte samma rättigheter. Privilegier var särskilda förmåner eller rättigheter som vissa grupper hade.'],
    cards:[
     short('farm-land','Var bodde de flesta människor i Sverige under 1700-talet?','På landsbygden',['landsbygden','på landsbygden','landet','på landet'],['I storstäder','På slott','I industristäder'],'De flesta bodde på landsbygden och många var beroende av jordbruket.'),
     short('farm-work','Vad kallas arbetet med att odla mark och hålla djur för att producera mat?','Jordbruk',['jordbruk','jordbruket','lantbruk','lantbruket'],['Export','Censur','Boktryckeri'],'Jordbruk producerar mat genom bland annat odling och djurhållning.'),
     short('farm-crop','Vad kallas det när skörden blir ovanligt dålig?','Missväxt',['missväxt','missväxten'],['Tryckfrihet','Monopol','Upplysning'],'Missväxt kunde leda till brist på mat och göra livet svårare.'),
     short('farm-privilege','Vad kallas särskilda rättigheter eller förmåner som vissa grupper har?','Privilegier',['privilegier','privilegium','ståndsprivilegier','förmåner'],['Revolutioner','Skördar','Protester'],'Privilegier kan skapa skillnader mellan grupper. Adeln hade särskilda privilegier.'),
     chain('farm-chain','Bygg en möjlig följd av missväxt.',[
      {answer:'Skörden blir ovanligt dålig',options:['Skörden blir ovanligt dålig','Alla skatter försvinner','Skörden blir större än någonsin']},
      {answer:'Det blir mindre mat att äta och sälja',options:['Det blir mindre mat att äta och sälja','Alla bönder blir rikare','Matbehovet försvinner']},
      {answer:'Risken för hunger och fattigdom ökar',options:['Risken för hunger och fattigdom ökar','Ingen behöver längre arbeta','Alla får automatiskt nya privilegier']}
     ],'En dålig skörd kunde ge både matbrist och sämre inkomster. Följderna berodde också på tillgång till hjälp och annan mat.')
    ]},
   {id:'nature',title:'Naturens ordning',location:'Botaniska trädgården',symbol:'❧',period:'Vetenskap på 1700-talet',npc:'Trädgårdslärlingen Sam',x:460,y:400,color:'#82965d',reward:120,
    story:'Sam har täckt bordet med växter, etiketter och pressade blad. ”Etiketterna har hamnat i fel ordning. En del av arbetet handlar om att ordna naturen så att andra kan förstå och jämföra. Vi skickar en sammanfattning till arkivet. Kan du hjälpa mig att reda ut begreppen?”',
    notes:['Carl von Linné ordnade och namngav växter och djur. Arternas vetenskapliga namn består av ett släktnamn och ett artepitet. Systemet används internationellt.','Systematik handlar om att ordna och gruppera organismer. Upplysningen betonade bland annat förnuft, undersökningar och nyttig kunskap. Linnés grupperingar är inte identiska med dagens biologiska system.'],
    cards:[
     short('nature-linne','Vilken svensk vetenskapsman är känd för att ordna och namnge växter och djur?','Carl von Linné',['carl von linné','carl linné','linné','linnaeus','carl linnaeus'],['Gustav III','Karl XII','Anders Chydenius'],'Carl von Linné utvecklade ett system för att ordna och namnge organismer.','Skriv namn eller efternamn.'),
     short('nature-names','Hur många delar har ett vetenskapligt artnamn i Linnés namnsystem?','Två',['två','2','två delar','2 delar'],['En','Fyra','Tio'],'Det har två delar: ett släktnamn och ett artepitet.'),
     short('nature-system','Vad kallas arbetet med att ordna och gruppera växter och djur?','Systematik',['systematik','systematiken','klassificering'],['Censur','Envälde','Merkantilism'],'Systematik handlar om att ordna och gruppera organismer.'),
     short('nature-reason','Vilket ord betyder förmågan att tänka logiskt och pröva argument, något som betonades under upplysningen?','Förnuft',['förnuft','förnuftet'],['Privilegier','Censur','Missväxt'],'Förnuft innebär att använda tänkande och argument. Upplysningen betonade också undersökningar och kunskap.'),
     chain('nature-chain','Bygg sambandet: varför är gemensamma namn användbara?',[
      {answer:'En art får ett gemensamt vetenskapligt namn',options:['En art får ett gemensamt vetenskapligt namn','Varje forskare hittar på ett hemligt namn','Alla växter får samma namn']},
      {answer:'Forskare kan lättare veta vilken art de menar',options:['Forskare kan lättare veta vilken art de menar','Forskare behöver inte längre undersöka naturen','Alla arter blir likadana']},
      {answer:'Kunskap kan jämföras och delas mellan länder',options:['Kunskap kan jämföras och delas mellan länder','All forskning blir förbjuden','Inga frågor behöver ställas']}
     ],'Gemensamma namn hjälper människor att dela och jämföra kunskap. Forskning behövs fortfarande.')
    ]},
   {id:'king',title:'Kungens kupp',location:'Slottet',symbol:'♛',period:'1772–1792',npc:'Slottsbudet Amira',x:1750,y:400,color:'#ae7555',reward:140,
    story:'Amira står vid slottsporten. Hon håller två brev med olika datum. ”Det ena beskriver en stor förändring av makten, det andra en händelse på operan. De får inte blandas ihop. Kontrollera vad vi faktiskt vet innan jag skickar breven till arkivet.”',
    notes:['Gustav III genomförde en statskupp år 1772. Kungen fick större makt och frihetstiden tog slut. Statskupp betyder att makten tas över med tvång, utanför vanliga politiska regler.','Gustavianska tiden förknippas bland annat med Gustav III och hovets kulturliv. År 1792 sköts Gustav III på en maskerad på operan och dog senare av skadorna.'],
    cards:[
     short('king-name','Vilken kung genomförde en statskupp år 1772?','Gustav III',['gustav iii','gustav 3','gustav den tredje','gustaf iii','gustaf 3'],['Karl XII','Gustav Vasa','Karl XIV Johan'],'Gustav III genomförde statskuppen 1772.','Skriv namn och nummer.'),
     short('king-coup','Vad kallas ett maktövertagande med tvång utanför vanliga politiska regler?','Statskupp',['statskupp','statskuppen','kupp'],['Skörd','Import','Tryckfrihet'],'En statskupp är ett maktövertagande utanför de vanliga politiska reglerna.'),
     short('king-year','Vilket år genomfördes Gustav III:s statskupp?','1772',['1772'],['1766','1719','1789'],'Statskuppen 1772 avslutade frihetstiden och stärkte kungamakten.','Skriv ett årtal.'),
     short('king-death','Vilket år sköts Gustav III på operan och dog av sina skador?','1792',['1792'],['1772','1766','1784'],'Gustav III sköts vid en maskerad 1792 och dog senare av skadorna.','Skriv ett årtal.'),
     chain('king-chain','Bygg sambandet: vad förändrade kuppen 1772?',[
      {answer:'Gustav III genomför en statskupp',options:['Gustav III genomför en statskupp','Gustav III lämnar all makt till folket','Linné blir kung']},
      {answer:'Kungens makt ökar',options:['Kungens makt ökar','Kungens makt försvinner','Alla får rösträtt']},
      {answer:'Frihetstiden tar slut',options:['Frihetstiden tar slut','Frihetstiden börjar','Medeltiden börjar']}
     ],'Statskuppen stärkte kungamakten. År 1772 brukar därför räknas som frihetstidens slut.')
    ]},
   {id:'trade',title:'Den stora handeln',location:'Hamnen',symbol:'⚓',period:'1731–1790-tal',npc:'Hamnskrivaren Jo',x:1920,y:1280,color:'#758e8f',reward:140,
    story:'Trossarna gnisslar vid kajen. Jo håller upp en lastförteckning. ”Här finns varor som har rest långt. Men en berättelse om handel måste också handla om dem som utnyttjades. Hjälp mig att skriva en rättvisande sammanfattning, inte bara räkna köpmännens vinster.”',
    notes:['Svenska Ostindiska kompaniet bildades 1731. Det förde bland annat te, siden och porslin från Kina till Göteborg. Import är att köpa in varor från andra länder; export är att sälja till dem.','Sverige fick Saint-Barthélemy som koloni 1784; det officiella övertagandet skedde 1785. Förslavade människor såldes och utnyttjades där under svenskt styre. Handelns vinster och följder fördelades ojämlikt.'],
    cards:[
     short('trade-company','Vad hette det svenska handelskompani som bildades 1731 och handlade med Kina?','Ostindiska kompaniet',['ostindiska kompaniet','svenska ostindiska kompaniet','ostindiska'],['Västindiska riksdagen','Hattpartiet','Kungliga vetenskapsrådet'],'Svenska Ostindiska kompaniet importerade bland annat te, siden och porslin.'),
     short('trade-import','Vad kallas det när ett land köper in varor från ett annat land?','Import',['import','importera','importering'],['Export','Censur','Statskupp'],'Import är att köpa in varor från andra länder.'),
     short('trade-export','Vad kallas det när ett land säljer varor till ett annat land?','Export',['export','exportera','exportering'],['Import','Missväxt','Privilegium'],'Export är att sälja varor till andra länder.'),
     short('trade-slavery','Vad kallas ett system där människor berövas frihet och behandlas som egendom?','Slaveri',['slaveri','slaveriet'],['Tryckfrihet','Jordbruk','Systematik'],'Slaveri berövar människor deras frihet. Sverige deltog också i kolonial handel och slaveri.'),
     chain('trade-chain','Bygg sambandet: varför måste kolonial handel granskas kritiskt?',[
      {answer:'Varor produceras med förslavade människors arbete',options:['Varor produceras med förslavade människors arbete','Alla som arbetar får samma rättigheter','Ingen arbetar med produktionen']},
      {answer:'Köpmän och ägare kan tjäna pengar',options:['Köpmän och ägare kan tjäna pengar','Vinsten delas alltid lika','Handeln saknar ekonomiska följder']},
      {answer:'Vinster kan bygga på andra människors ofrihet',options:['Vinster kan bygga på andra människors ofrihet','Handelsvinster bevisar att allt var rättvist','Slaveri ger alla större frihet']}
     ],'Ekonomisk vinst visar inte att handeln var rättvis. Fråga vilka som tjänade på den och vilka som drabbades.')
    ]},
   {id:'ideas',title:'Idéer som brinner',location:'Kaffehuset',symbol:'✧',period:'Upplysningen · 1789',npc:'Brevskrivaren Noor',x:1690,y:850,color:'#ad8a57',reward:140,
    story:'I kaffehuset ligger ett brev från Frankrike på bordet. Noor ber dig läsa adressen. ”Nya idéer sprids mellan länder. Vissa vill undersöka, andra vill förändra samhället. Mitt brev måste skilja mellan en idéströmning, ett sätt att styra och en omvälvande händelse.”',
    notes:['Upplysningen betonade förnuft, kunskap och kritisk prövning. Många ifrågasatte gamla auktoriteter och orättvisa privilegier, men upplysningsidéerna innebar inte lika rättigheter för alla i praktiken.','Envälde betyder att en härskare har mycket stor makt. En revolution är en genomgripande förändring av samhälle eller politisk ordning. Franska revolutionen började 1789 och hade flera samverkande orsaker.'],
    cards:[
     short('ideas-enlightenment','Vilken idéströmning på 1700-talet betonade förnuft, kunskap och kritisk prövning?','Upplysningen',['upplysningen','upplysning','upplysningstiden'],['Medeltiden','Merkantilismen','Feodalismen'],'Upplysningen betonade förnuft och kunskap och ifrågasatte etablerade auktoriteter.'),
     short('ideas-autocracy','Vad kallas ett styrelsesätt där en härskare har mycket stor makt?','Envälde',['envälde','enväldet','absolutism'],['Tryckfrihet','Export','Systematik'],'Envälde innebär att en härskare har mycket stor makt.'),
     short('ideas-revolution','Vad kallas en genomgripande omvälvning av samhället eller den politiska ordningen?','Revolution',['revolution','revolutionen'],['Import','Censur','Skörd'],'En revolution innebär en genomgripande förändring, ofta av den politiska ordningen.'),
     short('ideas-year','Vilket år började franska revolutionen?','1789',['1789'],['1772','1792','1766'],'Franska revolutionen började 1789. Den hade politiska, sociala och ekonomiska orsaker.','Skriv ett årtal.'),
     chain('ideas-chain','Bygg ett möjligt samband mellan idéer och förändring.',[
      {answer:'Människor ifrågasätter orättvisa privilegier',options:['Människor ifrågasätter orättvisa privilegier','Alla förbjuds att tänka','Alla accepterar varje gammal regel']},
      {answer:'Krav på förändring kan växa',options:['Krav på förändring kan växa','Alla samhällsproblem försvinner direkt','Kungens makt ökar alltid']},
      {answer:'Idéer kan bidra till politiska omvälvningar',options:['Idéer kan bidra till politiska omvälvningar','Idéer är den enda orsaken till varje revolution','Bara årtal avgör vad som händer']}
     ],'Idéer kan bidra till förändring. Franska revolutionen hade också ekonomiska och sociala orsaker; ett enda samband förklarar inte allt.')
    ]}
  ],
  sources:[
   {label:'Sveriges riksdag · Riksdagens historia',url:'https://www.riksdagen.se/sv/sa-fungerar-riksdagen/riksdagens-historia/fran-ting-och-stammor-till-dagens-riksdag/'},
   {label:'Sveriges riksdag · Besluten som förändrade Sverige',url:'https://www.riksdagen.se/sv/aktuellt/fran-kungamakt-till-folkstyre/besluten-som-forandrade-sverige/'},
   {label:'Kungliga slotten · Gustav III 1771–1792',url:'https://www.kungligaslotten.se/ur-arkivet/svenska-regenter/2018-02-20-gustav-iii-1771-1792.html'},
   {label:'Uppsala universitet · Linné, idéerna och frihetstiden',url:'https://www.uu.se/om-uu/historia/carl-von-linne/linne-online/linne-ideerna-och-historien/linnes-sverige-och-frihetstiden'},
   {label:'Uppsala universitet · Artens namn',url:'https://www.uu.se/om-uu/historia/carl-von-linne/linne-online/vaxterna-och-djuren/ordning-i-naturen/arten-naturens-grundenhet'},
   {label:'Göteborgs universitet · Ostindiska kompaniets arkiv',url:'https://ostindiska.ub.gu.se/start'},
   {label:'Stockholmskällan · Kolonin Saint-Barthélemy',url:'https://stockholmskallan.stockholm.se/teman/Stockholmsplatser/kolonin-saint-barthelemy/'},
   {label:'Roediger & Karpicke (2006) · Test-Enhanced Learning',url:'https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2006.01693.x/'}
  ]
 };
})();
