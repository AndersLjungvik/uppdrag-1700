// The original bank stays intact. This file gives its cards places in the book's story.
export const LEVEL_NAMES=['Lärling','Gesäll','Mästare'];
export const LEVEL_TASKS=['Återkalla fakta och begrepp','Förklara och jämför','Granska och knyt ihop'];
export const TIMELINES={
 1:{start:1719,end:1772,label:'Frihetstiden · 1719–1772'},
 2:{start:1719,end:1772,label:'Frihetstiden · olika människors liv'},
 3:{start:1741,end:1743,label:'Kriget och stora daldansen · 1741–1743'},
 4:{start:1719,end:1772,label:'Senare under frihetstiden · läsning och nya tankar'},
 5:{start:1772,end:1772,label:'1772 · Gustav III tar mer makt'},
 6:{start:1772,end:1809,label:'Gustavianska tiden · landet och staden'},
 7:{start:1772,end:1790,label:'Gustav III:s tid · handel, koloni och krig'},
 8:{start:1792,end:1792,label:'1792 · skottet på maskeraden'},
 9:{start:1808,end:1809,label:'1808–1809 · kriget om Finland'},
 10:{start:1719,end:1809,label:'Återblick · källor från 1719–1809'}
};
export const PLACES={
 town:{name:'Staden',npc:'Berättaren',view:'town'},
 cafe:{name:'Kaffehuset',npc:'Maja',view:'cafe',color:'#69785e',woman:true},
 print:{name:'Tryckeriet',npc:'Brita',view:'press',color:'#6e6b5b',woman:true},
 quay:{name:'Kajen',npc:'Hamnskrivaren Jo',view:'quay',color:'#a17f49'},
 archive:{name:'Arkivet',npc:'Läromästaren Rut',view:'archive',color:'#67695a'},
 barnhus:{name:'Barnhuset',npc:'Barnhuskökets medhjälpare',view:'barnhus',color:'#90735b',woman:true},
 garden:{name:'Trädgården',npc:'Sam',view:'garden',color:'#657866'},
 farm:{name:'Byn',npc:'Bonden Karin',view:'farm',color:'#94744e',woman:true},
 palace:{name:'Slottet',npc:'Skrivaren Amira',view:'palace',color:'#846956',woman:true},
 opera:{name:'Operan',npc:'Operans bud',view:'opera',color:'#76604f'},
 marstrand:{name:'Marstrand',npc:'Hamnskrivaren på Marstrand',view:'quay',color:'#6f7762'},
 colony:{name:'Saint Barthélemy',npc:'Källbordets berättare',view:'colony',color:'#826d5e'},
 gate:{name:'Vägen vidare',npc:'Berättaren',view:'town'}
};
const extra=(id,question,answer,accept,explanation)=>({id,type:'short',question,simpleQuestion:question,answer,accept:[answer,...accept],explanation,missionId:'ideas',topic:'Bokens uppdrag'});
export const EXTRA_CARDS=[
 {...extra('story-company-purpose','Vilken uppgift hade Ostindiska kompaniet?','Handla med Kina',['handel med kina','köpa varor från Kina','köpa te siden och porslin'],'Ostindiska kompaniet bedrev handel med Kina och köpte bland annat te, siden och porslin.'),kind:'company-purpose',missionId:'trade'},
 extra('story-aga','Vad kallas det att slå någon för att straffa eller uppfostra?','Aga',[],'Aga var tillåten i många sammanhang. Det visar hur olika människors makt och skydd var.'),
 extra('story-kolt','Vad kallades det klänningsliknande plagg som små barn kunde bära?','Kolt',[],'Små barn kunde bära kolt, oavsett kön.'),
 extra('story-shame','Vilket straff innebar att en person fick stå och skämmas inför andra i kyrkan?','Skamstraff',['skampallen','skampålen'],'En ogift kvinna som fick barn kunde drabbas av böter och skamstraff.'),
 extra('story-oakta','Vilket nedsättande ord användes om barn som föddes utanför äktenskapet?','Oäkta',['oäkta barn'],'Ordet ”oäkta” användes för att skilja ut barn. Det säger något om dåtidens orättvisor, inte om ett barns värde.'),
 extra('story-adolf','Vem ville Rysslands tsarinna skulle bli Sveriges nästa kung efter Fredrik I?','Adolf Fredrik',['adolf'],'Ryssland krävde att Adolf Fredrik skulle bli svensk tronföljare.'),
 extra('story-david','Vilken soldat i boken vägrade skjuta på bönderna 1743?','David Hedenquist',['david','hedenquist'],'David Hedenquist vägrade skjuta på bönderna och straffades för sin vägran.'),
 {...extra('story-skra','Vad kallades en sammanslutning som styrde ett hantverksyrke?','Skrå',['skråväsen'],'Skråna reglerade hantverk. På Marstrand gällde särskilda friare regler.'),missionId:'trade'},
 {...extra('story-marstrand','Vilken svensk ö blev Gustav III:s experiment med friare handel?','Marstrand',[],'Marstrand fick särskilda regler för handel, arbete och inflyttning.'),missionId:'trade'},
 {...extra('story-assassin','Vem sköt Gustav III på maskeraden?','Jacob Johan Anckarström',['anckarström','jakob johan anckarström'],'Jacob Johan Anckarström sköt Gustav III. Kungen dog senare av skadan.'),missionId:'king'},
 {...extra('story-opera','På vilken plats hölls maskeraden där Gustav III sköts?','Kungliga Operan',['operan','kungliga operan i stockholm'],'Maskeraden hölls på Kungliga Operan i Stockholm.'),missionId:'king'},
 {...extra('story-alliance','Vad kallas ett samarbete mellan länder, till exempel i krig?','Allians',['allierade'],'Sverige var allierat med Storbritannien och Ryssland. Ryssland bytte sedan sida.'),missionId:'king'},
 {...extra('story-army','Vilket äldre ord betyder armé?','Här',['en här'],'En här är en armé. I kriget deltog även unga pojkar.'),missionId:'king'},
 {...extra('story-finland-year','Vilket år förlorade Sverige Finland och Åland efter finska kriget?','1809',[],'Efter finska kriget 1808–1809 blev Finland och Åland en del av Ryssland.'),missionId:'king'},
 {id:'story-opera-order',missionId:'king',topic:'Skottet på maskeraden',type:'chain',stage:'journey',question:'Sätt ihop en korrekt nyhetsnotis om maskeraden.',steps:[
  {connector:'Före balen',answer:'fick Gustav III ett varningsbrev',options:['fick Gustav III ett varningsbrev','hade Gustav III redan dött','blev Finland ryskt']},
  {connector:'På maskeraden',answer:'sköts kungen av Anckarström',options:['sköts kungen av Anckarström','avskaffades slaveriet','störtades Gustav IV Adolf']},
  {connector:'Senare',answer:'dog Gustav III av sin skada',options:['dog Gustav III av sin skada','vann Sverige Finland','började frihetstiden']}
 ],explanation:'Varningen kom före balen. Gustav III sköts på maskeraden 1792 och dog senare. Allt hände inte samma kväll.'}
];
const factIds=(bank,mission)=>bank.missions.find(m=>m.id===mission).cards.filter(q=>q.type==='short').map(q=>q.id);
const stage=(title,giver,work,recipient,ids,request,result,options={})=>({title,giver,work,recipient,ids,request,result,artifact:options.artifact||title,pickups:[],handoffs:[],...options});
const stop=(place,text,label='Ta med underlaget')=>({place,text,label});
export function buildContent(bank){
 const cards=new Map(bank.missions.flatMap(m=>m.cards.map(q=>[q.id,{...q,missionId:m.id,topic:m.title}])));
 // The sourced classroom bank is complete in itself. Legacy demo additions are
 // only used when opening the archived bank, never mixed into the new bank.
 if(!bank.sourcePolicy)for(const q of EXTRA_CARDS)cards.set(q.id,q);
 const chapters=[
 {id:1,title:'Frihetstiden 1719–1772',pages:'64–65',workbook:'1–4',date:'Frihetstiden · 1719–1772',next:'Kvinnan vid kaffehusets dörr läser anslaget: ”En fri tid, säger ni. Men vem får bestämma över mig?”',levels:[
  stage('Beställningen på ett anslag','cafe','print','print',['power-era','power-parliament','power-council','power-law',...factIds(bank,'trade').filter(id=>['trade-company','trade-port','trade-import','trade-export'].includes(id))],
   'Vi ska tala om vem som bestämmer i Sverige. Kan du ordna ett läsligt anslag? Börja hos Brita i tryckeriet.','Manuset är kontrollerat. Jag behöver också en handelsnotis från Jo vid kajen.',{artifact:'Kontrollerat manus'}),
  stage('Handelsnotisen','print','quay','print',['story-company-purpose','power-reason-1'],
   'Jo har uppgifter om handeln och om vilka som får del av friheten. Hämta en handelsnotis vid kajen och ta den till mig.','Tack! Nu kan vi sätta anslaget och göra ett provtryck.',{artifact:'Handelsnotis från Jo'}),
  stage('Ett godkänt provtryck','print','print','cafe',['power-reason-3'],
   'Kontrollera slutsatsen innan vi trycker. Lägg sedan materialet i pressen. Maja ska godkänna provtrycket på kaffehuset.','Anslaget är uppsatt! Nu finns något att läsa och tala om.',{artifact:'Färdigt anslag',materials:true,handoffs:[stop('cafe','Det går att läsa! Ta mitt godkännande tillbaka till Brita så att hon kan göra upplagan.','Ta godkännandet till Brita'),stop('print','Majas godkännande är här. Jag gör upplagan. Ta anslaget till kaffehuset.','Ta den färdiga upplagan')]})
 ]},
 {id:2,title:'Fria och ofria',pages:'66–69',workbook:'5–7',date:'Frihetstiden · olika människors villkor',next:'Ett bud från Dalarna väntar på kaffehuset. Bönderna är missnöjda med kriget.',levels:[
  stage('Sömmerskans klagomål','cafe','cafe','cafe',['ideas-shelter','ideas-inequality','ideas-workchildren','story-aga','story-kolt','story-shame','story-oakta'],
   'Sömmerskan vid dörren vill få sitt klagomål rätt återgivet. Hon berättar också om ett barn på barnhuset. Hjälp oss reda ut villkoren.','Klagomålet är tydligare. Nu behöver vi undersöka matlistorna i barnhusets kök.',{artifact:'Sömmerskans klagomål'}),
  stage('Två listor från barnhuset','cafe','barnhus','cafe',['ideas-reason-1'],
   'Gå till barnhuset via vägen ut ur torget. Köket har leveranslistan och uppgifter om vad barnen fått. Ta redogörelsen hit.','Nu har vi barnets berättelse och kökets uppgifter. Jämför dem innan vi sparar texten.',{artifact:'Barnhusets redogörelse'}),
  stage('Vad saknas i berättelsen','cafe','barnhus','cafe',['ideas-reason-3'],
   'Barnhuset beskrivs på olika sätt. Jämför uppgifterna vid kökets bord och återvänd med en rättvisare redogörelse.','Sömmerskan känner igen sin berättelse. Jag skickar beskedet om den saknade leveransen till köket.',{artifact:'Jämförda matlistor'})
 ]},
 {id:3,title:'Krig eller fred?',pages:'70–74',workbook:'8–10',date:'1741–1743 · krig och uppror',next:'En läsare undrar hur man kan kontrollera makthavarnas påståenden. Nästa blad handlar om läsning och insyn.',levels:[
  stage('Budet från Dalarna','cafe','archive','print',['power-parties','power-rebellion','power-four-estates','story-adolf','story-david'],
   'Någon säger att bönderna bara vill bråka. Ta budet till Rut i arkivet, red ut bakgrunden och lämna underlaget hos Brita.','Budets bakgrund är utredd. Nu behöver vi få händelserna i rätt sammanhang.',{artifact:'Underlag från Dalarna',pickups:[stop('archive','Här finns budet och protokollet. Undersök vilka som protesterar och varför.','Lägg fram budet på bordet')]}),
  stage('Kriget och protesten','print','print','print',['power-reason-2'],
   'Hjälp mig förklara varför bönderna marscherade mot Stockholm. Vi väntar sedan på nästa besked.','Förklaringen är klar. Jo har fått ett senare besked vid kajen.',{artifact:'Utkast om protesten'}),
  stage('Det senare beskedet','print','quay','cafe',['power-reason-3'],
   'Hämta Jos besked om hur upproret slogs ned. Ta det genom tryckeriet och lämna den färdiga notisen till Maja.','Notisen är uppsatt. Den visar både böndernas skäl och vad som hände sedan.',{artifact:'Nyhetsnotis om upproret',pickups:[stop('quay','Upproret slogs ned. David Hedenquist vägrade skjuta. Vi behöver beskriva makten utan att kalla den jämlik.','Ta emot beskedet')],handoffs:[stop('print','Nu kan vi slutföra notisen. Ta den till Maja.','Ta med notisen')]})
 ]},
 {id:4,title:'Nya tider, nya tankar',pages:'75–80',workbook:'11–15',date:'1766 · läsning, forskning och insyn',next:'Den första delen av boken är klar. Nästa avsnitt öppnar den gustavianska tiden med ett besked från 1772.',levels:[
  stage('Vad står i beslutet','cafe','archive','cafe',[...factIds(bank,'press').filter(id=>id!=='press-sources'),...factIds(bank,'nature')],
   'Vi har hört olika saker om ett beslut. Rut har handlingen i arkivet. Hjälp oss återkalla orden och forskarna som hör till avsnittet.','Handlingen kan granskas. Ta nu vägen till tryckeriet; forskarbladen behöver ordnas.',{artifact:'Uppgifter ur handlingen'}),
  stage('Forskarbladen','print','garden','print',['press-reason-1','press-reason-2','nature-reason-1','nature-reason-2'],
   'Sam i trädgården hjälper oss få forskarbladen rätt. Gå via vägen vidare och kom tillbaka med de ordnade förklaringarna.','Forskarbladen är klara. Maja har även beställt en kokbok till läsbordet.',{artifact:'Ordnade forskarblad'}),
  stage('Böcker till läsbordet','print','print','cafe',['nature-reason-3'],
   'Cajsa Wargs kokbok och forskarbladen ska till Maja. Granska en slutsats innan vi skickar dem; även en berömd forskare kan ha fel.','Nu finns forskningssidan och kokboken på läsbordet. Vi kan läsa, jämföra och fråga vidare.',{artifact:'Forskningssida och kokbok'})
 ]},
 {id:5,title:'Gustavianska tiden 1772–1809',pages:'81–85',workbook:'16–17',date:'1772 · kungens makt förändras',next:'Ett brev ska till landet, men den gamla adressen stämmer inte. Gården har flyttat.',levels:[
  stage('Anslaget som blivit gammalt','print','print','print',['king-name','king-year','king-coup','ideas-faith','ideas-enlighten'],
   'Hämta vårt äldre anslag hos Maja. Beskedet från 1772 har förändrat makten, så underlaget måste rättas.', 'Nu är maktförändringen rätt beskriven. Jo har ett senare besked om reformerna.',{artifact:'Rättat underlag',pickups:[stop('cafe','Här är det gamla anslaget. Ta det till tryckeriet och jämför med beskedet från 1772.','Ta det gamla anslaget')]}),
  stage('Ett nytt reformbesked','print','print','print',['king-reason-1'],
   'Hämta Jos senare besked om lagar och religion vid kajen. Sedan ska vi rätta påståendet att alla nu har samma frihet.','Reformbladet visar både förändringar och begränsningar. Ta det nya anslaget till kaffehuset.',{artifact:'Reformblad',pickups:[stop('quay','Tiden har gått vidare under Gustav III. Några friheter har ökat, men lika rättigheter för alla finns inte.','Ta med reformbeskedet')]}),
  stage('Olika bilder av kungen','print','cafe','cafe',['king-reason-3'],
   'Lämna underlaget till Maja och granska hur kungen beskrivs. Invånarna får sedan själva berätta vad de tycker.','Det nya anslaget är uppsatt. Människorna reagerar olika på kungens makt.',{artifact:'Det nya kungliga anslaget'})
 ]},
 {id:6,title:'Livet på landet och i staden',pages:'86–89',workbook:'18–22',date:'Gustavianska tiden · byn och staden',next:'En hantverkare har hört om andra regler på Marstrand. Jo vill veta vad de betyder för handeln.',levels:[
  stage('Brevet till gården','cafe','farm','farm',[...factIds(bank,'farm'),'ideas-bellman','ideas-lenngren','ideas-patron','ideas-culture'],
   'En bonde vill få ett brev till sin syster. Här är brevet. Förr låg gården vid brunnen. Ta vägen till byn och undersök kartorna där.','Brevet har kommit rätt. Systern behöver en förklaring till vad skiftet och livet i staden förändrade.',{artifact:'Brevet till systern',puzzle:'map',carriedFromStart:true}),
  stage('Två sidor av förändringen','farm','farm','print',['farm-reason-1','farm-reason-2','ideas-reason-2'],
   'Skriv både vad som blev lättare och vad som kunde bli svårt när byn förändrades. Ta vårt underlag till tryckeriet.','Tack för underlaget. Stadens berättelser ska också få plats på sidan.',{artifact:'Underlag från gården'}),
  stage('En sida om vardagslivet','print','print','cafe',['farm-reason-3'],
   'Maja har berättelser från stadens arbetare. Hämta dem på kaffehuset och jämför med gårdens erfarenheter. Lämna sedan den färdiga sidan där.','Sidan om vardagslivet är klar. Båda kartorna finns kvar, så att vi kan jämföra.',{artifact:'En sida om vardagslivet',pickups:[stop('cafe','Här finns berättelser från en fabrik, en latrintömmerska och en hantverkare, tillsammans med texter av Bellman och Lenngren.','Ta med berättelserna')]})
 ]},
 {id:7,title:'Ska Sverige bli en stormakt igen?',pages:'90–96',workbook:'23–27',date:'1780-talet · handel och stormaktsplaner',next:'Kungens ökade makt väcker ilska inom delar av adeln. Ett nytt tryckuppdrag kommer från Operan år 1792.',levels:[
  stage('Budet till Marstrand','quay','marstrand','quay',[...factIds(bank,'trade').filter(id=>!['trade-company','trade-port','trade-import','trade-export'].includes(id)),'story-skra','story-marstrand'],
   'Ett hantverkarbud har sorterats bland vanliga skråärenden. Res till Marstrand och ta reda på vad som skiljer reglerna där.','Budet är rätt sorterat. Nu behöver handelsnotisen kompletteras med fler människors erfarenheter.',{artifact:'Förklaring från Marstrand'}),
  stage('Vad handelsnotisen utelämnar','quay','colony','quay',['trade-reason-1','trade-reason-2'],
   'Läs underlaget från Saint Barthélemy vid källbordet. Undersök vilka som tjänade på handeln och vilka som berövades sin frihet.','Underlaget visar också exploatering och motstånd. Vi återvänder till 1788 för krigsbeskedet.',{artifact:'Kompletterad handelsnotis',handoffs:[stop('colony','Längre fram: slaveriet på ön avskaffades 1847 efter motstånd och förändringar. Den här fliken är en utblick. Nu återgår berättelsen till 1788.','Återgå till 1788')]}),
  stage('Segerrubriken som inte stämmer','quay','print','cafe',['trade-reason-3','king-reason-1'],
   'Ta handelsunderlaget till tryckeriet. Ett segeranslag ligger där, men vi måste kontrollera det mot nästa besked från kriget.','Handelsnotisen och det rättade krigsbeskedet sitter nu på kaffehuset.',{artifact:'Handelsnotis och krigsbesked',pickups:[stop('print','År 1788 beställdes rubriken i förväg. Vi behöver Jos senare besked innan vi kan använda den.','Hämta krigsbeskedet hos Jo'),stop('quay','Nu är året 1790. Ingen sida har vunnit nya områden. Gustav III har ändå fått större makt. Ta beskedet till tryckeriet.','Ta beskedet från 1790')]})
 ]},
 {id:8,title:'Skottet på maskeraden',pages:'97–99',workbook:'28',date:'1792 · Operan och nyheten',next:'Gustav IV Adolf tar över. På ett senare blad väntar ett brev från Finland och en fråga om krigets bakgrund.',levels:[
  stage('Programmen och nyhetsunderlaget','print','opera','print',['king-death','king-name','king-coup','story-assassin','story-opera'],
   'Operan har beställt program. Lämna dem vid entrén. Efter ett daterat scenbyte hämtar du underlaget om skottet och Jos senare besked.','Nu har vi uppgifterna. De behöver sättas i tidsföljd innan notisen trycks.',{artifact:'Underlag från Operan',pickups:[stop('opera','Programmen är lämnade. Ny scen: ett attentat har skett på maskeraden. Här finns varningen och en skildring av skottet.','Ta underlaget om skottet'),stop('quay','Senare i mars 1792 kommer beskedet att Gustav III dött av sin skada. Allt skedde inte på en kväll.','Ta det senare beskedet')]}),
  stage('Nyheten i rätt ordning','print','print','print',['story-opera-order'],
   'Sätt uppgifterna i rätt följd. En notis påstår att kungen dog omedelbart; det behöver rättas.','Tidsföljden är rättad. Nu behöver vi granska hur händelsen och kungen framställs.',{artifact:'Daterat nyhetsutkast'}),
  stage('En nyhet att lita på','print','print','cafe',['king-reason-3'],
   'Granska källornas olika bilder av kungen. Ta sedan den färdiga notisen till Maja.','Nyheten är uppsatt. Invånarna reagerar olika, och de äldre bladen finns kvar.',{artifact:'Nyhetsnotis från Operan'})
 ]},
 {id:9,title:'Striden om Finland',pages:'100–102',workbook:'29–30',date:'1808–1809 · finska kriget',next:'Tryckeriets samling är full. En besökare undrar hur vi kan veta vad som hände. Arkivet vill granska boken.',levels:[
  stage('Bakgrunden vid kartbordet','cafe','print','quay',['king-allies','king-revolution','king-successor','king-finland','story-alliance','story-army','story-finland-year'],
   'En anhörig väntar på ett brev från Finland hos Jo. Börja vid tryckeriets kartbord och red ut krigets bakgrund.','Bakgrunden är utredd. Familjens brev väntar här hos mig.',{artifact:'Förklaring av allianserna'}),
  stage('Brevet från Finland','quay','quay','print',['king-reason-2'],
   'Här finns familjens brev och ett separat utdrag om trumslagarpojken Karl Hayden. Hjälp mig förklara krigets förlopp innan du går till kartbordet.','Brevet är på väg. Jämför nu kartorna efter fredsbeskedet 1809.',{artifact:'Brev från Finland'}),
  stage('Den förändrade kartan','print','print','cafe',['press-reason-3'],
   'Året är 1809. Jämför kartan före och efter freden och granska vad källorna kan säga. Lämna sedan brevet och förklaringen till den anhöriga på kaffehuset.','Brevet har nått familjen. Den nya kartan visar Finland och Åland under ryskt styre.',{artifact:'Brev och karta efter freden',puzzle:'finland'})
 ]},
 {id:10,title:'Hur kan vi veta något om 1700-talets Sverige?',pages:'103–105',workbook:'31–35',date:'Källorna · tillbaka på hela berättelsen',next:'Boken står på kaffehusets bord. Du kan fortsätta arbeta och repetera i de delar du har besökt.',levels:[
  stage('Hämta källorna','cafe','archive','archive',['press-sources','power-era','press-reading','king-finland'],
   'Arkivet vill visa boken. Hämta bykartan hos Karin, en handling i tryckeriet och bilden från kaffehuset. Ta dem till Rut.', 'Samlingen är här. Nu måste vi pröva vilka påståenden källorna kan stödja.',{artifact:'Källsamlingen',pickups:[stop('farm','Här är den sparade bykartan. Den visar var gårdar och åkrar låg.','Ta kartan'),stop('print','Här är handlingen ur vår samling. Den har en avsändare och ett datum.','Ta handlingen'),stop('cafe','Här är efterhandsbilden av maskeraden. Den gjordes efter händelsen.','Ta bilden')]}),
  stage('Vad räcker källan till','archive','archive','archive',['press-reason-2','press-reason-3'],
   'Koppla uppgifterna till vad källorna faktiskt kan berätta. En bevarad text är inte automatiskt hela sanningen.','Källornas möjligheter och begränsningar är tydligare. Nu kan bokens avslutning granskas.',{artifact:'Granskade källkopplingar'}),
  stage('Boken till kaffehuset','archive','archive','cafe',['power-reason-1','press-reason-1','king-reason-2'],
   'Knyt ihop frihetstiden, läsningen och förlusten av Finland. Ta den granskade boken till Maja för utställningen.','Boken står nu på kaffehusets bord. Tack för att du hjälpte oss förstå och bevara berättelserna.',{artifact:'Tryckeriets färdiga bok'})
 ]}
 ];
 // Classroom cards are assigned by the book section and level recorded in the
 // canonical bank. Old topic-based placement must not move them to a wrong era.
 if(bank.sourcePolicy&&Array.isArray(bank.chapters))for(const c of chapters){
  const specified=bank.chapters.find(x=>x.id===c.id);
  if(!specified)throw new Error(`Avsnitt saknas i frågebanken: ${c.id}`);
  for(const l of specified.levels){if(!c.levels[l.level-1])throw new Error('Ogiltig nivå');c.levels[l.level-1].ids=[...l.ids]}
 }
 // Imported teacher cards remain reachable in the matching subject, without changing old IDs.
 const assigned=new Set(chapters.flatMap(c=>c.levels.flatMap(l=>l.ids)));
 const defaults={press:4,power:3,nature:4,farm:6,ideas:2,trade:7,king:5};
 for(const q of cards.values())if(!assigned.has(q.id)){
  const c=chapters[(defaults[q.missionId]||10)-1];
  const level=q.type==='short'?0:q.stage==='master'?2:1;c.levels[level].ids.push(q.id);assigned.add(q.id);
 }
 for(const c of chapters)for(const [i,l] of c.levels.entries()){
  l.id=`chapter-${c.id}-level-${i+1}`;l.level=i+1;
  l.ids=[...new Set(l.ids.filter(id=>cards.has(id)))];
  if(!l.ids.length)throw new Error(`Nivå utan frågor: ${l.id}`);
 }
 return {bank,chapters,cards};
}
