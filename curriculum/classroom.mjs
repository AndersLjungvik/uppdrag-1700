// Authoring source. Only the uploaded SOS classroom materials are admissible.
// References are per card, not inherited from an entire topic.
export const sources={
 LL:{title:'Bra att veta – 1700-talets Sverige',file:'libfile_5ad7036c2c6081919d0f37105e351caf',locator:'PDF-sida'},
 BE:{title:'Ord och begrepp – 1700-talets Sverige (pdf (1).pdf)',file:'libfile_1841e11ad7f481918328f344651df81e',locator:'PDF-sida'},
 P1:{title:'Prov – 1700-talets Sverige del 1',file:'libfile_91c6d81be7d88191af0e4cd36fd99d71',locator:'uppgift'},
 P2:{title:'Prov – 1700-talets Sverige del 2',file:'libfile_ccb8a87e6ee4819185e7e846f2fd0e05',locator:'uppgift'},
 F1:{title:'Bedömningsstöd del 1',file:'libfile_db0350f0d84c8191aeac4798b940f50a',locator:'PDF-sida'},
 F2:{title:'Bedömningsstöd del 2',file:'libfile_7a8f04e8e3e0819194db0d650b42af57',locator:'PDF-sida'},
 L1:{title:'Lärarguide – Frihetstiden',file:'libfile_5ec134902b30819199ef1fccc6cd7ebe',locator:'facit till grundboken'},
 L2:{title:'Lärarguide – Fria och ofria',file:'libfile_06dcd547d518819184b193649b4dada9',locator:'facit till grundboken'},
 L3:{title:'Lärarguide – Krig eller fred?',file:'libfile_3421d5f5ca408191b3f1b228765d2c47',locator:'avsnitt / facit till grundboken'},
 L4:{title:'Lärarguide – Nya tider, nya tankar',file:'libfile_9b44c626d5b081918bccfec691f4d5c9',locator:'avsnitt / facit till grundboken'},
 L5:{title:'Lärarguide – Gustavianska tiden',file:'libfile_becff12faaf08191b4faf87d891a8b3d',locator:'avsnitt / facit till grundboken'},
 L6:{title:'Lärarguide – Livet på landet och i staden',file:'libfile_badc9bfbd05081918282645736fc5b8a',locator:'avsnitt / facit till grundboken'},
 L7:{title:'Lärarguide – Ska Sverige bli en stormakt igen?',file:'libfile_6358e6cdd2d88191bae466f8e44961dd',locator:'avsnitt / facit till grundboken'},
 G80:{title:'Grundboken s. 80–81',file:'libfile_a8f06208e65c8191994e7861b17b2416',locator:'boksida'},
 G82:{title:'Grundboken s. 82–83',file:'libfile_d4db954d54248191b168f4bad0cffc23',locator:'boksida'},
 G84:{title:'Grundboken s. 84–85',file:'libfile_8503ddc43e048191ba46632b51003383',locator:'boksida'},
 G86:{title:'Grundboken s. 86–87',file:'libfile_5d636c69fc1c81919c588fcdeabb7c29',locator:'boksida'},
 G88:{title:'Grundboken s. 88–89',file:'libfile_946e06baea0c8191a6682e21356df182',locator:'boksida'},
 G90:{title:'Grundboken s. 90–91',file:'libfile_3a3e7479570881918bb805e599b55862',locator:'boksida'},
 G92:{title:'Grundboken s. 92–93',file:'libfile_37540e1a9d748191922ea6e535f0ea07',locator:'boksida'},
 G94:{title:'Grundboken s. 94–95',file:'libfile_d366fa41ee308191b36d1f58107d00a4',locator:'boksida'},
 G96:{title:'Grundboken s. 96–97',file:'libfile_fc651dd59bf48191b0ac26b975a8e09d',locator:'boksida'},
 G98:{title:'Grundboken s. 98–99',file:'libfile_46c775b5ac388191b7492deccb84fa7f',locator:'boksida'},
 G100:{title:'Grundboken s. 100–101',file:'libfile_8f20b2f46a9c81918dc0acb50464436b',locator:'boksida'},
 G102:{title:'Grundboken s. 102–103',file:'libfile_ab7747a6769481918012540b7253beff',locator:'boksida'},
 G104:{title:'Grundboken s. 104–105',file:'libfile_2dba3bf2d24881918afac4d05d8aeb99',locator:'boksida'},
 AB:{title:'Elevernas arbetsbok s. 24–39',file:null,locator:'uppgift; läsbara fotografier i samtalet',note:'Uppgiftshänvisningar är kontrollerade mot bilderna i samtalet. Svar beläggs dessutom i en identifierad textkälla.'}
};
export const chapterTitles=['Frihetstiden 1719–1772','Fria och ofria','Krig eller fred?','Nya tider, nya tankar','Gustavianska tiden 1772–1809','Livet på landet och i staden','Ska Sverige bli en stormakt igen?','Skottet på maskeraden','Striden om Finland','Hur kan vi veta något om 1700-talets Sverige?'];
const refs=s=>s.split(';').map(x=>{const [source,...loc]=x.trim().split(':');if(!sources[source])throw Error('Unknown source '+source);return{source,location:loc.join(':')}});
const cards=[];
const permutations=values=>values.length===1?[values]:values.flatMap((v,i)=>permutations(values.filter((_,j)=>j!==i)).map(t=>[v,...t]));
function Q(c,slug,question,answer,where,accept=[],concept=null,extra={}){
 cards.push({id:`sos-${slug}`,storyChapter:c,level:1,chapter:c<=4?1:2,type:'short',question,simpleQuestion:question,answer,accept:[...new Set([answer,...accept])],explanation:extra.explanation||answer+'.',references:refs(where),concept,origin:'bearbetning av klassrumsmaterial',...extra});
}
function C(c,slug,level,question,where,rows,requires=[],extra={}){
 cards.push({id:`sos-${slug}`,storyChapter:c,level,chapter:c<=4?1:2,type:'chain',stage:level===3?'master':'journey',question,simpleQuestion:question,steps:rows.map(([connector,answer,...wrong])=>({connector,answer,options:[answer,...wrong]})),requires:requires.map(x=>'sos-'+x),explanation:rows.map(([a,b])=>a+' '+b).join('. ')+'.',references:refs(where),origin:'byggsvar utifrån klassrumsmaterial',...extra});
}

// 1. Frihetstiden. No imported trade terminology without a direct classroom anchor.
Q(1,'frihetstid','Vad kallas perioden 1719–1772 i Sverige?','Frihetstiden','LL:1;BE:1;AB:1',[],'frihetstiden');
Q(1,'riksdag','Vilken församling fick mer makt när kungens makt minskade?','Riksdagen','LL:1;F1:1;AB:1',['riksdagen och riksrådet']);
Q(1,'riksrad','Vad kallades den grupp som fungerade ungefär som en regering?','Riksrådet','LL:1;BE:1',[],'riksrådet');
Q(1,'grundlag','Vad heter en extra viktig lag som är svår att ändra och kan ange hur landet styrs?','Grundlag','LL:1;BE:1;P1:3c;AB:4a',[],'grundlag');
Q(1,'stand','Vilka fyra stånd var representerade i riksdagen?','Adel, präster, borgare och bönder','LL:1;P1:3a',['adel präster borgare bönder','adeln prästerna borgarna och bönderna',...permutations(['adel','präster','borgare','bönder']).map(a=>a.slice(0,3).join(', ')+' och '+a[3]),...permutations(['adeln','prästerna','borgarna','bönderna']).map(a=>a.slice(0,3).join(', ')+' och '+a[3])]);
Q(1,'bonder-inflytande','Vilket stånd fick inte vara med och välja riksrådets medlemmar?','Bönderna','F1:2;L1:facit s.65 fråga 3;AB:4c',['bönder']);
Q(1,'kompani','Vilket svenskt handelsbolag skickade skepp till Kina?','Ostindiska kompaniet','LL:2;BE:1;P1:2;AB:3',['svenska ostindiska kompaniet'],'Ostindiska kompaniet');
Q(1,'kina','Till vilket land seglade Ostindiska kompaniets skepp för att handla?','Kina','LL:2');
Q(1,'goteborg','Från vilken svensk stad seglade kompaniets skepp?','Göteborg','LL:2');
Q(1,'kompanivaror','Vilka tre varor köpte kompaniet i Kina enligt texten?','Te, siden och porslin','LL:2;P1:1a',['te siden porslin','porslin siden och te','siden te och porslin','te porslin och siden','porslin te och siden','siden porslin och te']);
// The assessment-only Russian title has no verified definition in this chapter.
Q(1,'grundlag-svarandrad','Vad skiljer en grundlag från en vanlig lag när man vill ändra den?','Den är svårare att ändra','LL:1;F1:2;P1:3c;AB:4b',['svårare att ändra','svår att ändra','mycket svår att ändra']);
C(1,'frihet-forklaring',2,'Bygg en förklaring till namnet frihetstiden.','LL:1;BE:1;F1:1;AB:1',[
 ['Kungens','envälde avskaffades','envälde förstärktes','riksdag avskaffades'],
 ['Därför fick','riksdagen och riksrådet mer makt','kungen all makt','alla barn makten'],
 ['Perioden kallas','frihetstiden','gustavianska tiden','stormaktstiden']
],['frihetstid','riksdag','riksrad']);
C(1,'kompaniets-uppgift',2,'Bygg en förklaring av vad Ostindiska kompaniet gjorde.','LL:2;F1:2;P1:2;AB:3',[
 ['Kompaniet var','ett handelsföretag','ett riksdagsparti','ett barnhus'],
 ['Dess skepp seglade','från Göteborg till Kina','från Kina till Dalarna','från Dalarna till Stockholm'],
 ['De köpte','te, siden och porslin för att sälja i Sverige','åkrar för att genomföra skiften','röster för att välja riksrådet']
],['kompani','kina','goteborg','kompanivaror']);
C(1,'frihet-maktfordelning',3,'Pröva påståendet: Under frihetstiden blev alla lika fria.','F1:1–2;LL:1;L1:facit s.65 fråga 3;AB:4c',[
 ['Kungen fick','mindre makt','ensam makt','mer makt än tidigare'],
 ['Viktiga beslut kunde dessutom tas','på särskilda möten utan bönderna','på möten där bondeståndet ensamt bestämde','efter omröstning där samtliga stånd deltog'],
 ['Och bönderna fick','inte välja riksrådets medlemmar','ensamma välja riksrådet','ensamma styra landet']
],['bonder-inflytande','riksdag']);
C(1,'bonder-begransning',2,'Förklara böndernas begränsade inflytande i riksdagen.','P1:3b;F1:2;L1:facit s.65 fråga 3;AB:4',[
 ['Bönderna var','ett av riksdagens fyra stånd','inte representerade alls i riksdagen','de enda som fick välja riksrådet'],
 ['Men de fick inte','vara med och välja riksrådets medlemmar','odla sina åkrar','vara med på något riksdagsmöte alls'],
 ['Viktiga beslut kunde dessutom tas','på särskilda möten utan bönderna','enbart av bönderna','av alla barn i landet']
],['stand','bonder-inflytande']);

// 2. Fria och ofria: period wording matters. These are historical descriptions.
Q(2,'barnhus','Vad kallades hus där barn utan någon som kunde ta hand om dem fick bo?','Barnhus','LL:3;BE:1;AB:7',[],'barnhus');
Q(2,'barnhus-arbete','Vad tvingades barnen på barnhus göra under långa dagar?','Arbeta','LL:3;F1:4;AB:7b',['arbeta hårt','hårt arbete']);
Q(2,'aga','Vilket ord betyder att slå någon för att straffa eller uppfostra?','Aga','P1:6;AB:5',[],'aga');
Q(2,'kolt','Vad kallades ett plagg som liknade en lång skjorta?','Kolt','P1:6',[],'kolt');
Q(2,'oakta','Vilket nedsättande ord användes om barn som föddes utanför äktenskapet?','Oäkta','P1:6;G82:83',[],'oäkta',{explanation:'Oäkta var dåtidens nedsättande benämning. Den beskriver inte ett barns värde.'});
Q(2,'skampale','Vad kallades platsen där en person kunde ställas för att skämmas inför andra?','Skampåle','P1:6',[],'skampåle');
Q(2,'ogift-straff','Vilken sorts straff kunde en ogift kvinna som fick barn få, utöver böter?','Skamstraff','F1:2–3;P1:4a;AB:6',['stå och skämmas i kyrkan','skämmas i kyrkan']);
C(2,'ogift-press',2,'Bygg sambandet mellan reglerna och kvinnornas utsatthet.','F1:2–3;P1:4a–c;L2:facit s.69 fråga 1;AB:6',[
 ['En ogift kvinna som blev gravid','kunde utsättas för straff och skam','fick bestämma över hela samhället','hade samma ställning som kungen'],
 ['Kyrkan ansåg','att sex hörde till äktenskapet','att äktenskap var förbjudet','att skamstraff hade avskaffats'],
 ['Det kunde göra kvinnan','rädd för att graviditeten skulle upptäckas','säker på att slippa alla svårigheter','fri att välja riksrådet']
],['ogift-straff']);
C(2,'barnhus-vardag',2,'Sätt ihop en beskrivning av vardagen på barnhus.','LL:3;F1:4;L2:facit s.69 fråga 3;P1:5;AB:7',[
 ['Många barn','arbetade långa dagar','bestämde över personalen','fick högre lön än vuxna'],
 ['De kunde få','lite mat och bli slagna','lika mycket frihet som riksdagen','välja om de ville arbeta'],
 ['En del barn','fick också lära sig läsa, skriva eller räkna','var ledamöter i riksrådet','ägde alla stadens fabriker']
],['barnhus','barnhus-arbete','aga']);
C(2,'barnhus-perspektiv',3,'Pröva påståendet: Barnhus innebar att barnen hade det bra.','LL:3;F1:4;L2:facit s.69 fråga 2–3;AB:7',[
 ['Barnhus tog emot','barn som ingen kunde ta hand om','bara barn till kungar','bara barn som ägde mark'],
 ['Men barnen kunde samtidigt','utsättas för hårt arbete, hunger och våld','slippa arbete och få hög lön','bestämma över de vuxna'],
 ['Därför måste beskrivningen ta upp','både att barnen fick bo där och hur de behandlades','bara att huset fanns','bara de vuxnas önskemål']
],['barnhus','barnhus-arbete']);

// 3. Krig eller fred?
Q(3,'hattar-mossor','Vad hette de två politiska grupperna i riksdagen?','Hattar och mössor','LL:1;BE:1;P1:6;AB:8',['hattarna och mössorna'],'hattar och mössor');
Q(3,'hattar-krig','Vilken grupp ville starta krig mot Ryssland?','Hattarna','L3:Hattar och mössor;AB:8',['hattar']);
Q(3,'hattar-frankrike','Vilket land ville hattarna samarbeta med?','Frankrike','L3:Hattar och mössor;AB:8');
Q(3,'mossor-england','Vilket land ville mössorna samarbeta med?','England','L3:Hattar och mössor;AB:8',['Storbritannien']);
Q(3,'ryssland-1741','Mot vilket land började Sverige kriga 1741?','Ryssland','LL:2;L3:Krig eller fred;AB:9');
Q(3,'daldans','Vad kallas böndernas uppror och marsch från Dalarna till Stockholm?','Stora daldansen','LL:2;BE:1;AB:10',['den stora daldansen'],'stora daldansen');
Q(3,'budkavle','Vad hette föremålet som skickades mellan människor för att sprida ett meddelande?','Budkavle','P1:7;F1:5');
Q(3,'adolf-fredrik','Vilken svensk kung fick Ryssland vara med och bestämma att Sverige skulle få?','Adolf Fredrik','LL:2;AB:9');
Q(3,'david','Vilken soldat i materialet vägrade att skjuta på bönderna?','David Hedenquist','LL:2',['David','Hedenquist']);
C(3,'daldans-forlopp',2,'Bygg händelsekedjan från kriget till upprorets slut.','LL:2;F1:5;BE:1;AB:10',[
 ['Kriget mot Ryssland','gick dåligt och många dog','gav Sverige en seger','gjorde slut på alla skatter'],
 ['Missnöjda bönder','marscherade från Dalarna till Stockholm','seglade till Kina','flyttade till Marstrand'],
 ['I Stockholm','slog militären ned upproret','fick bönderna all makt','avskaffades barnhusen']
],['ryssland-1741','daldans']);
C(3,'rysslands-inflytande',2,'Bygg en förklaring till Rysslands ökade inflytande.','LL:2;L3:facit s.74 fråga 2;AB:9',[
 ['Ryska soldater skulle','skydda riksrådet mot svenska bönder','skydda bönderna mot riksrådet','segla med Ostindiska kompaniet'],
 ['Därmed fick Ryssland','mer att säga till om i Sverige','mindre möjlighet att påverka Sverige','ingen kontakt med Sverige'],
 ['Ryssland fick också påverka','vem som skulle bli svensk kung','vilken potatis som odlades','vem som skrev Bellmans sånger']
],['adolf-fredrik']);
C(3,'budkavle-kalla',3,'Förklara hur budkavlen både användes och kan vara en historisk källa.','P1:7;F1:5',[
 ['Då skickades budkavlen runt','för att sprida information','för att mäta temperaturen','för att trycka böcker'],
 ['Den aktuella budkavlen användes','för att samla bönder till uppror','för att välja Celsius till kung','för att ordna en maskerad'],
 ['I dag är den en källa eftersom','den är bevarad och berättar om det som hände då','den ger svar på alla historiska frågor','alla gamla saker berättar hela sanningen']
],['budkavle','daldans']);

// 4. Nya tider, nya tankar
Q(4,'tryckfrihet','Vad kallas friheten att skriva och sprida tryckta texter?','Tryckfrihet','P1:6;BE:1;AB:12',[],'tryckfrihet');
Q(4,'censur','Vilket ord betyder att de styrande kan granska och stoppa en text innan den trycks?','Censur','P1:6',[],'censur');
Q(4,'offentlighet','Vilken princip ger människor rätt att läsa myndigheters handlingar och beslut?','Offentlighetsprincipen','P1:6;BE:1;AB:12',[],'offentlighetsprincipen');
Q(4,'katekesen','Vad hette läroboken om det viktigaste i kristendomen?','Katekesen','P1:6',[],'katekesen');
Q(4,'kyrkan-lasning','Vilken institution hade fått uppgiften att lära alla barn läsa?','Kyrkan','L4:facit s.80 fråga 1',['svenska kyrkan']);
Q(4,'vetenskap','Vad kallas kunskap som kommer fram genom forskning?','Vetenskap','BE:1;LL:3',[],'vetenskap');
Q(4,'linne','Vilken forskare delade in växter och djur och gav dem latinska namn?','Carl von Linné','LL:3;F1:6;AB:14',['Linné','Carl Linné','von Linné']);
Q(4,'latin','På vilket språk gav Linné växter och djur namn?','Latin','LL:3;F1:6;AB:14b');
Q(4,'celsius','Vilken forskare ligger bakom systemet för temperaturskalan som nämns i texten?','Anders Celsius','LL:3;F1:6;AB:13',['Celsius']);
Q(4,'scheele','Vilken apotekare forskade i kemi och upptäckte syre i luften?','Carl Wilhelm Scheele','F1:6;AB:13',['Scheele','Carl Vilhelm Scheele']);
Q(4,'syre','Vilken gas i luften förknippas med Scheeles upptäckt?','Syre','F1:6;AB:13');
Q(4,'ekeblad','Vem blev den första kvinnan i Vetenskapsakademien?','Eva Ekeblad','LL:3;AB:15',['Ekeblad']);
Q(4,'potatis','Vilken växt undersökte Eva Ekeblad?','Potatis','LL:3;F1:6;AB:15',['potatisen']);
Q(4,'potatismjol','Vad kunde man göra av potatis, utöver brännvin, enligt Ekeblads forskning?','Mjöl','F1:6;AB:15c',['potatismjöl']);
Q(4,'potatis-ursprung','Från vilken världsdel kom potatisen ursprungligen?','Sydamerika','P1:1a;L4:Jonas Alströmer');
Q(4,'vetenskapsakademi','Vilken akademi bildades 1739 för att sprida forskning?','Kungliga Vetenskapsakademien','P1:9a;L4:Jonas Alströmer',['Vetenskapsakademien']);
Q(4,'tryckfrihet-forst','Vilket land var först i världen med tryckfrihet enligt provets påstående?','Sverige','P1:1a');
C(4,'lasning-samhalle',2,'Bygg sambandet mellan läskunnighet och förändring.','LL:3;F1:5;P1:8;L4:facit s.80 fråga 2;AB:11',[
 ['När fler kunde läsa','kunde de själva studera texter','måste de tro på alla texter','försvann alla böcker'],
 ['De kunde då upptäcka','att prästers ord inte alltid stämde med Bibeln','att alla människor hade rösträtt','att alla fick lika mycket makt'],
 ['Det blev lättare att','ifrågasätta makthavarna','bevisa att kungen alltid hade rätt','avskaffa alla samhällsregler']
],['kyrkan-lasning','tryckfrihet']);
C(4,'fred-forskning',2,'Bygg en förklaring till att forskningen kunde växa.','LL:3;L4:facit s.80 fråga 3;P1:9',[
 ['När det var','fred oftare','krig varje dag','förbjudet att läsa'],
 ['fanns det mer','tid och pengar till forskning','pengar enbart till armén','anledning att förbjuda böcker'],
 ['Forskare kunde undersöka','hur naturen och världen fungerar','bara vilka kläder kungen bar','enbart hur man väljer riksrådet']
],['vetenskap']);
C(4,'ekeblad-bidrag',2,'Koppla Ekeblads arbete till hur kunskap kunde användas.','F1:6;LL:3;P1:9b;AB:15',[
 ['Eva Ekeblad undersökte','potatis','syre','termometrar'],
 ['Hon visade att den kunde användas','till mjöl och brännvin','till porslin och siden','till att mäta temperatur'],
 ['Forskningen bidrog till att','potatisen blev mer populär','alla behövde sluta odla potatis','Celsius började skriva sånger']
],['ekeblad','potatis','potatismjol']);
C(4,'vetenskap-jamforelse',3,'Välj en korrekt jämförelse mellan forskarnas bidrag.','LL:3;F1:6;P1:9b;AB:13–15',[
 ['Linnés system handlar om','att ordna och namnge växter och djur','att skriva visor om Stockholm','att avskaffa riksrådet'],
 ['Celsius arbete handlar om','temperatur och en termometerskala','hur en armé styrs','hur skiften genomförs'],
 ['Båda ger exempel på','kunskap från 1700-talet som fortfarande används','att all forskning från förr är fel','att all forskning gällde kungens makt']
],['linne','celsius']);

// 5. Gustavianska tiden
Q(5,'gustav-iii','Vilken kung tog mer makt år 1772?','Gustav III','LL:4;G80:81;AB:16',['Gustav den tredje','Gustav 3']);
Q(5,'1772','Vilket år upphörde frihetstiden när Gustav III tog mer makt?','1772','LL:4;G80:81;AB:16b');
Q(5,'1771','Vilket år blev Gustav III kung?','1771','LL:4;G80:81');
Q(5,'upplysning','Vad kallas tankarna om förnuft, vetenskap, frihet och människors rättigheter?','Upplysningen','BE:1;F2:5;P2:7;AB:17',[],'upplysningen');
Q(5,'religionsfrihet','Vad kallas friheten att själv bestämma vilken religion man ska ha?','Religionsfrihet','BE:1;AB:17',[],'religionsfrihet');
Q(5,'tortyr','Vilken metod för att plåga människor förbjöds under Gustav III?','Tortyr','LL:4;G82:82;P2:5a;AB:17');
Q(5,'judar-katoliker','Vilka två religiösa grupper fick flytta till Sverige under Gustav III enligt texten?','Judar och katoliker','LL:4;G84:84;P2:5a',['katoliker och judar']);
C(5,'ogifta-forandring',2,'Beskriv hur reglerna för ogifta kvinnor förändrades.','G82:83;L5:facit s.85 fråga 4;AB:17',[
 ['En gravid ogift kvinna fick enligt de nya reglerna','hållas skyddad från att bli avslöjad av familjen','inte längre lämna sin bostad','ensam välja riksrådet'],
 ['Präster fick inte längre','kalla barnet mindre äkta i sina papper','lära barn att läsa','tala om kristendom alls'],
 ['Men kvinnorna kunde fortfarande','behandlas illa trots de nya reglerna','bestämma över alla män','slippa alla svårigheter automatiskt']
],['oakta','ogift-straff'],{explanation:'Enligt s. 83 fick familjen inte kasta ut eller avslöja den gravida kvinnan. Barn skulle behandlas lika i prästernas papper. Reglerna innebar inte att alla fördomar eller svårigheter försvann.'});
C(5,'kupp-forlopp',2,'Bygg en förklaring av maktförändringen 1772.','G80:81;LL:4;L5:facit s.85 fråga 1;AB:16',[
 ['Gustav III använde','armén för att ta makten','en budkavle för att bli bonde','forskning för att avskaffa armén'],
 ['Han lät fängsla','ledande politiker i riksrådet','alla barnhusbarn','alla forskare'],
 ['Efteråt kunde','kungen bestämma mycket mer själv','riksrådet ensamt styra','alla invånare rösta om varje beslut']
],['gustav-iii','1772']);
C(5,'reformer-begransningar',2,'Jämför friheter och begränsningar under Gustav III.','LL:4;G82:82;G84:84;AB:17',[
 ['En förbättring var att','tortyr förbjöds','alla straff avskaffades','alla fick lika rösträtt'],
 ['En annan förändring var att','judar och katoliker fick flytta till Sverige','alla fick bo och arbeta precis var de ville','alla protestanter måste lämna sin religion'],
 ['Men tryckfriheten','försämrades','blev obegränsad','ersatte riksdagen']
],['tortyr','judar-katoliker','tryckfrihet']);
C(5,'kung-motsagelse',3,'Pröva påståendet: Eftersom kungen gjorde reformer blev alla lika fria.','LL:4;G82:82–83;G84:84;AB:17,34–35',[
 ['Kungen genomförde','förbättringar i vissa lagar','bara lagar om potatis','ett avskaffande av alla straff'],
 ['Samtidigt samlade han','mer makt hos sig själv','all makt hos bönderna','all makt hos barnen'],
 ['Judar fick till exempel','bara bo i vissa städer och hade begränsade yrkesmöjligheter','ensamma välja riksrådet','samma frihet på alla platser']
],['religionsfrihet','gustav-iii']);

// 6. Livet på landet och i staden
Q(6,'skifte','Vad kallas förändringen då små åkrar slogs ihop till större?','Skifte','BE:2;F2:2;P2:2a;AB:18',[],'skifte');
Q(6,'fabrik','Vad kallas en byggnad där varor tillverkas i stor skala?','Fabrik','BE:2;LL:5;AB:19',['fabriker'],'fabriker');
Q(6,'barn-lon','Varför var barn billigare att anställa än vuxna?','De fick lägre lön','LL:5;L6:facit s.89 fråga 1;AB:20',['lägre lön','de fick mindre lön','barn fick mindre betalt','mindre betalt']);
Q(6,'tobak','Vilken växt användes för att göra snus och tuggtobak?','Tobak','LL:5;P2:1',[],'tobak');
Q(6,'dass','Vad kallades en enkel toalett utan vatten?','Dass','P2:1',[],'dass');
Q(6,'prostituerad','Vilket ord i begreppsuppgiften betyder en person som säljer sex för pengar?','Prostituerad','P2:1',[],'prostituerad');
Q(6,'bellman','Vilken visdiktare skrev om livet i Stockholm på 1700-talet?','Carl Michael Bellman','F2:3;L6:facit s.89 fråga 2;AB:21',['Bellman','Carl Mikael Bellman']);
Q(6,'lenngren','Vilken poet skrev om bland annat kvinnors rättigheter?','Anna Maria Lenngren','G88:89;G104:103–105;AB:22',['Lenngren']);
Q(6,'kultur','Vilket samlingsord används här om konst, litteratur, musik och teater?','Kultur','BE:2',[],'kultur');
Q(6,'svenska-akademien','Vilken akademi grundade Gustav III för att stödja det svenska språket?','Svenska Akademien','G88:89;P2:5a;AB:22',['svenska akademin']);
Q(6,'teatrar','Vilka två kungliga scener grundade Gustav III enligt boken?','Kungliga Operan och Dramatiska Teatern','G88:89;AB:22',['Operan och Dramaten','Dramaten och Operan','Kungliga Operan och Dramaten']);
C(6,'kultur-stod',2,'Förklara hur kulturstödet kunde gynna både författare och kung.','G88:89;L6:facit s.89 fråga 3;AB:22',[
 ['Gustav III gav','pengar till konstnärer och författare','inga pengar till kulturen','alla författare makten över riksrådet'],
 ['Då kunde de','fortsätta med sitt skapande','slippa skriva eller skapa något','välja alla lagar själva'],
 ['De skrev också','dikter och sånger som hyllade kungen','bara kritik mot all forskning','bara listor över skiftade åkrar']
],['gustav-iii','kultur']);
Q(6,'tobak-uppfattning','Hur trodde man enligt provet att tobak påverkade människor på 1700-talet?','Man trodde att den var nyttig','P2:5a',['nyttig','att tobak var nyttigt','den ansågs nyttig'],null,{explanation:'Frågan gäller en uppfattning på 1700-talet. Den säger inte att uppfattningen var riktig.'});
Q(6,'latrintommerskor','Vilket arbete hade kvinnorna som hämtade och tömde stadens dasstunnor?','Latrintömmerskor','G86:87;AB:19',['renhållningshjon','skitbärarkärringar','latrintömmare']);
C(6,'skifte-foljder',2,'Bygg en jämförelse av livet före och efter skiftet.','F2:2;P2:2;AB:18',[
 ['Före skiftet låg en familjs åkrar','på flera små jordbitar','alltid på en enda stor åker','bara inne i staden'],
 ['Efter skiftet blev de','mer samlade','helt avskaffade','alltid lika stora för alla'],
 ['Det kunde göra','odlingen effektivare men splittra bygemenskapen','allt arbete onödigt','alla bönder lika rika']
],['skifte']);
C(6,'barn-fabrik',2,'Förklara barnarbetet ur två perspektiv.','LL:5;L6:facit s.89 fråga 1;G86:87;AB:20',[
 ['För fabriksägaren var barn','billigare att anställa','dyrare än vuxna','de enda som ägde fabriker'],
 ['För många barn innebar arbetet','långa arbetsdagar','högre lön än de vuxnas','frihet från alla krav'],
 ['Samma arbete kunde alltså','spara pengar åt ägaren och vara tungt för barnet','vara lika bra för alla','ge barnet makt över ägaren']
],['barn-lon','fabrik']);
C(6,'bellman-kalla',2,'Förklara hur Bellmans sånger kan användas som källor.','P2:4;F2:3;AB:21',[
 ['Bellman skrev','under den tid vi undersöker','efter att ha sett dagens filmer','bara om framtiden'],
 ['Sångerna beskriver bland annat','människor och livet i staden','bara hur man odlar potatis','bara riksrådets möten'],
 ['Därför kan texterna','ge kunskap om livet på 1700-talet','ersätta alla andra källor','visa varje människas exakta vardag']
],['bellman']);
C(6,'skifte-olika',3,'Pröva påståendet: Skiftet fick samma följder för alla.','F2:2;P2:2b;AB:18',[
 ['Samlade åkrar kunde','göra odlingen lättare och mer lönsam','göra all odling omöjlig','göra alla jordbitar lika'],
 ['Men när gårdar flyttades kunde','gemenskap och hjälp mellan grannar minska','alla få mer gemenskap automatiskt','städerna försvinna'],
 ['Dessutom kunde','några bli rikare och andra fattigare','alla få samma resultat','ingen påverkas av förändringen']
],['skifte']);

// 7. Ska Sverige bli en stormakt igen?
Q(7,'marstrand','Vilken ö blev Gustav III:s experiment med friare handel och arbete?','Marstrand','G90:90;AB:23');
Q(7,'skra','Vad kallades en förening för ett hantverksyrke?','Skrå','P2:1;G90:90',[],'skrå');
Q(7,'koloni','Vad kallas ett område som styrs från ett annat land?','Koloni','BE:2;P2:1;LL:5',[],'koloni');
Q(7,'saint-barthelemy','Vilken ö blev svensk koloni i Karibien?','Saint Barthélemy','LL:5;BE:2;AB:23',['Sankt Barthelemy','St Barthelemy','Saint Barthelemy'],'Saint Barthélemy');
Q(7,'gustavia','Vad fick kolonins huvudort för namn efter Gustav III?','Gustavia','G90:90');
Q(7,'slavhandel','Vad kallas det när människor köps och säljs som slavar?','Slavhandel','BE:2;LL:5;AB:24',[],'slavhandel');
Q(7,'rasism','Vilket ord betyder att människor värderas olika på grund av till exempel hudfärg eller ursprung?','Rasism','P2:1;G92:92',[],'rasism');
Q(7,'1847','Blick framåt från 1700-talet: vilket år avskaffades slaveriet på Saint Barthélemy?','1847','G94:94;AB:26');
Q(7,'1788','Vilket år började Gustav III:s krig mot Ryssland?','1788','G94:95;AB:27');
Q(7,'kolonialvaror','Nämn en vara som skickades från Västindien till Europa i triangelhandeln.','Socker','G90:91;F2:4;AB:24',['kaffe','kakao','tobak','bomull']);
Q(7,'marie-cecile','Vilka två kvinnor krävde sin lön av Joseph Chausse inför domstolen?','Marie Anne och Cecile','G92:93',['Marie Anne och Cécile','Cecile och Marie Anne','Cécile och Marie Anne']);
C(7,'domstol-ojamlikhet',2,'Koppla kvinnornas motstånd till domstolens beslut och ojämlikheten.','G92:93',[
 ['Marie Anne och Cecile','anmälde mannen som vägrade betala och slog dem','bestämde lagarna på ön','fick välja Sveriges kung'],
 ['Mannen dömdes att','betala deras löner och böter','bli svensk kung','slippa betala något alls'],
 ['Men böterna blev lägre eftersom','kvinnorna var förslavade','de hade fått samma rättigheter som alla fria','domstolen saknade lagar']
],['marie-cecile','rasism']);
C(7,'marstrand-regler',2,'Bygg en förklaring av experimentet på Marstrand.','G90:90;AB:23',[
 ['På Marstrand var det','nästan inga skatter','förbjudet att bedriva handel','bara bönder som fick arbeta'],
 ['Man behövde inte','tillhöra ett skrå för att arbeta','ha något arbete alls','följa några lagar överhuvudtaget'],
 ['Dessutom fick','vem som helst flytta dit','bara adel flytta dit','ingen invandra dit']
],['marstrand','skra']);
C(7,'triangelhandel',2,'Bygg handelsvägarna som visas i materialet.','P2:6a;F2:4;G90:91;AB:24',[
 ['Från Europa till Afrika skickades','förädlade varor, till exempel vapen och alkohol','bara bönder från Dalarna','bara te från Kina'],
 ['Från Afrika till Amerika fördes','människor som förslavats','enbart svenska kungar','enbart potatisfrön'],
 ['Från Amerika till Europa skickades','kolonialvaror, till exempel socker och kaffe','riksrådets medlemmar','alla människor tillbaka till sina hem']
],['slavhandel','kolonialvaror']);
C(7,'slaveri-foljder',2,'Bygg en beskrivning av följderna för förslavade människor.','P2:6b;F2:5;LL:5;AB:25',[
 ['Människor fördes','långt från sina hem och familjer','alltid frivilligt till ett nytt arbete','till riksdagen för att bestämma'],
 ['De tvingades','arbeta utan frihet och utsattes för våld','välja sina löner själva','bestämma över handelsmännen'],
 ['Många gjorde','motstånd genom flykt och uppror','inga försök att förändra sin situation','gemensamma regler som alla ägare lydde']
],['slavhandel']);
C(7,'motstand-avskaffande',2,'Koppla motståndet till förändringen av slaveriet.','G94:94;L7:facit s.96 fråga 3;AB:26',[
 ['Förslavade människor','krävde rättigheter, rymde och gjorde uppror','accepterade alltid slavägarnas makt','hade samma makt som ägarna'],
 ['Samtidigt började fler','ifrågasätta handel med människor','förbjuda all kritik mot handeln','kräva att alla blev slavar'],
 ['På svenska Saint Barthélemy avskaffades slaveriet','1847, alltså på 1800-talet','1772, när frihetstiden slutade','1792, samma kväll som maskeraden']
],['1847']);
C(7,'rattigheter-ojamnt',3,'Pröva påståendet: Gustav III:s reformer gällde lika för alla i Sverige och kolonin.','G82:82;G92:92–93;F2:5',[
 ['I Sverige förbjöds','tortyr','allt jordbruk','alla tidningar'],
 ['Men i kolonin kunde förslavade människor','fortfarande utsättas för grymma straff','välja alla lagar själva','åtnjuta samma frihet som fria handelsmän'],
 ['Det visar att','reformerna inte gällde lika för alla','alla hade lika rättigheter','kolonins lagar saknade betydelse']
],['tortyr','rasism']);
C(7,'krig-popularitet',3,'Bygg förklaringen i texten till att Gustav III ville kriga.','G94:95;L7:facit s.96 fråga 2;AB:27',[
 ['Gustav III ville ta tillbaka','områden Sverige tidigare förlorat','makten från Ostindiska kompaniet','barnhusens matransoner'],
 ['Han hoppades att en seger skulle','göra honom mer populär','göra honom till rysk tsar','avskaffa alla skatter'],
 ['Men han behövde riksdagens godkännande','för att starta ett anfallskrig','för att försvara Sverige om landet anfölls','för varje kulturevenemang']
],['1788']);
Q(7,'krig-ingen-seger','Vad vann Sverige i nya landområden när Gustav III:s krig mot Ryssland tog slut?','Inga','G96:96;AB:27b',['inga nya områden','inga nya landområden','ingenting']);
Q(7,'krig-riksrad','Vilken grupp bestämde Gustav III att den skulle ha noll medlemmar efter lagändringen under kriget?','Riksrådet','G96:96;AB:27b');

// 8. Skottet på maskeraden
Q(8,'1792','Vilket år sköts Gustav III på maskeraden?','1792','LL:4;G98:98–99;AB:28');
Q(8,'operan','På vilken plats hölls maskeraden där Gustav III sköts?','Kungliga Operan','G98:98;AB:28',['Operan','Kungliga Operan i Stockholm']);
Q(8,'anckarstrom','Vem sköt Gustav III?','Jacob Johan Anckarström','G98:99;AB:28',['Anckarström','Jakob Johan Anckarström']);
Q(8,'landsforvisad','Vad kallas en person som dömts att lämna sitt eget land?','Landsförvisad','P2:1;G98:99',[],'landsförvisad');
C(8,'maskerad-forlopp',2,'Bygg händelseförloppet kring maskeraden.','G98:98–99;AB:28',[
 ['Före balen fick kungen','ett varningsbrev','besked att han redan hade dött','besked att Finland blivit självständigt'],
 ['På maskeraden','sköts han av Anckarström','avsattes Gustav IV Adolf','avskaffades slaveriet'],
 ['Efter tretton dagar','dog Gustav III av sin skada','tog Gustav III tillbaka Finland','utsågs Bellman till kung']
],['operan','anckarstrom','1792']);
C(8,'adel-missnoje',2,'Bygg en förklaring till adelns missnöje med Gustav III.','LL:4;G96:97;G98:98–99;AB:28a',[
 ['Många adelsmän ogillade','att kungen hade tagit mer makt','att kungen vägrade stödja kulturen','att riksdagen bestämde allt'],
 ['Kungen hade','trängt undan dem från makten','gett adeln ensam makt','avskaffat all militär'],
 ['Några av motståndarna','planerade att döda honom','skrev bara en kokbok','seglade till Kina för att välja riksrådet']
],['gustav-iii']);
C(8,'mord-foljder',3,'Skilj mellan vad som hände kungen och vad som hände med gärningsmännen.','G98:99;AB:28c',[
 ['Gustav III','dog inte direkt på balen utan senare av sin skada','dog innan balen började','överlevde och regerade till 1809'],
 ['Anckarström','dömdes till döden','blev svensk kung','landsförvisades utan dom'],
 ['Två andra inblandade','fick sina dödsstraff ändrade till landsförvisning','blev medlemmar i riksrådet som belöning','återinsatte Gustav III']
],['landsforvisad','anckarstrom']);

// 9. Striden om Finland
Q(9,'gustav-iv','Vilken kung regerade efter Gustav III och när kriget om Finland började?','Gustav IV Adolf','G100:100;LL:6;AB:29',['Gustav 4 Adolf','Gustav den fjärde Adolf']);
Q(9,'revolution-land','I vilket land inträffade revolutionen 1789?','Frankrike','G100:100;LL:6;P2:8');
Q(9,'napoleon','Vem tog makten i Frankrike och blev kejsare efter revolutionen?','Napoleon','G100:100;LL:6',['Napoleon Bonaparte']);
Q(9,'allierade','Vilka två länder samarbetade Sverige först med mot Frankrike?','Storbritannien och Ryssland','LL:6;G100:100;AB:30',['Ryssland och Storbritannien','England och Ryssland','Ryssland och England']);
Q(9,'ryskt-sidbyte','Vilket land bytte sida och slöt fred med Frankrike?','Ryssland','LL:6;G100:100;AB:30');
Q(9,'har','Vilket äldre ord betyder armé?','Här','P2:1',[],'här');
Q(9,'finska-kriget','Vilka två år pågick finska kriget enligt materialet?','1808–1809','LL:6',['1808 1809','1808-09','1808 och 1809']);
Q(9,'1809','Vilket år förlorade Sverige Finland?','1809','LL:6;G102:102;AB:30');
Q(9,'finland-ryssland','Vilket land tog över Finland och Åland efter kriget?','Ryssland','LL:6;G102:102;AB:30');
Q(9,'karl-hayden','Vilken uppgift hade pojken Karl Hayden i kriget?','Trumslagare','G100:101',['trumslagarpojke','han spelade trumma']);
C(9,'franska-revolutionen',2,'Förklara kungens motvilja mot franska revolutionen med hjälp av bedömningsstödet.','P2:8;F2:6;G100:100;AB:29b',[
 ['I Frankrike gjorde','bönder och fattiga stadsbor uppror','svenska barnhusbarn en statskupp','bara svenska adelsmän uppror'],
 ['Kungen och adeln','störtades från makten','fick ensam makt','utsågs till svenska riksråd'],
 ['Den svenske kungen kunde därför frukta','att själv förlora makten','att tvingas bli potatisforskare','att Bellman skulle erövra Frankrike']
],['revolution-land','gustav-iv'],{teacherNote:'Prov 2 fråga 8 skriver Gustav IV; i övriga klassrumstexter är namnet Gustav IV Adolf. Frågan ber eleven förklara oro för att störtas, inte att datera kungens reaktion till just 1789.'});
C(9,'finland-forlopp',2,'Bygg händelsekedjan som ledde till förlusten av Finland.','LL:6;G100:100;G102:102;AB:30',[
 ['Sverige samarbetade först med','Storbritannien och Ryssland mot Frankrike','Frankrike mot Storbritannien och Ryssland','Ryssland mot Finland som eget land'],
 ['Sedan','bytte Ryssland sida och anföll Finland','anföll Frankrike Stockholm från Dalarna','blev Ryssland svenskt'],
 ['Efter kriget','blev Finland och Åland ryska','blev Ryssland en del av Sverige','fick Sverige tillbaka alla förlorade områden']
],['allierade','ryskt-sidbyte','1809','finland-ryssland']);
C(9,'krig-manniskor',3,'Koppla kriget till människors erfarenheter och rikets förändring.','G100:101;G102:102;AB:30',[
 ['Karl Haydens berättelse visar','att även unga pojkar deltog i kriget','att bara vuxna deltog','att krig bara gällde kungar'],
 ['Bönder i Finland och på Åland','gjorde motstånd mot ockupationen','var alla överens med de ryska soldaterna','flyttade alla till Frankrike'],
 ['När Sverige förlorade kriget','förlorade landet omkring en tredjedel av riket','förlorade Ryssland hela Finland','blev alla soldater kungar']
],['karl-hayden','1809']);

// 10. Källor. No fabricated archival letters are used as factual evidence.
Q(10,'historisk-kalla','Vad kallas bevarat material som kan ge kunskap om det förflutna?','Historisk källa','G102:103;P1:7;AB:31',['historiska källor','källa']);
Q(10,'kyrkbocker','Vilka register i materialet kan berätta om Sveriges befolkning sedan 1600-talet?','Kyrkans register','G102:103;P2:3',['kyrkböcker','kyrkböckerna','kyrkans folkbokföring']);
Q(10,'daglig-allehanda','Vilken dagstidning som nämns i boken grundades 1767?','Dagligt Allehanda','G102:103');
Q(10,'latinska-forskning','På vilket språk var de flesta forskningstexter skrivna då?','Latin','G102:103');
Q(10,'forskningsspridning','Vilken akademi tryckte berättelser om forskning på svenska så att fler kunde läsa?','Kungliga Vetenskapsakademien','G102:103',['Vetenskapsakademien']);
C(10,'huvudmal-frihet',3,'Knyt ihop frihetstidens maktfördelning med dess begränsningar.','LL:1;F1:1–2;L1:Lärandemål;AB:33–34',[
 ['Tiden kallas frihetstiden eftersom','kungens envälde upphörde','alla människor fick lika makt','alla samhällsregler försvann'],
 ['Mer makt gick till','riksdagen och riksrådet','alla barn på barnhus','bara kungen'],
 ['Men friheten var','olika för olika grupper','lika stor för alla','större för barnen än för alla andra']
],['frihetstid','riksrad','riksdag']);
C(10,'huvudmal-lasning',3,'Knyt ihop läskunnighet och nya tankar om samhället.','LL:3;F1:5;P1:8;L1:Lärandemål;AB:11',[
 ['Fler människor lärde sig','läsa','välja kungen genom lika rösträtt','slippa alla lagar'],
 ['Då kunde de själva','studera och jämföra texter','anta att varje bok var sann','sluta ställa frågor'],
 ['Det gav större möjlighet att','ifrågasätta makthavare','låta kungen ensam tolka alla texter','göra alla böcker överflödiga']
],['tryckfrihet','kyrkan-lasning']);
C(10,'huvudmal-finland',3,'Knyt ihop stormakternas sidbyte med förlusten av Finland.','LL:6;G100:100;G102:102;L1:Lärandemål;AB:30',[
 ['Ryssland bytte sida','från Sveriges sida till Frankrikes','från Frankrikes sida till Sveriges','från Finland till Marstrand'],
 ['Därefter anföll ryska styrkor','Finland som då hörde till Sverige','Kina som då hörde till Sverige','Marstrand som då hörde till Frankrike'],
 ['Kriget slutade med att','Finland och Åland blev ryska 1809','Ryssland blev svenskt 1772','Sverige fick tillbaka alla områden 1792']
],['ryskt-sidbyte','1809','finland-ryssland']);
C(10,'samtida-kallor',2,'Koppla tre av materialets exempel till vad de kan berätta.','P2:3–4;F2:3;G102:103;AB:31',[
 ['En dagbok från 1700-talet kan','berätta om den personens erfarenheter','visa alla människors tankar','bevisa att alla levde likadant'],
 ['Kyrkans register kan','ge uppgifter om befolkningen','återge varje samtal på gatan','ersätta alla dagböcker'],
 ['Bellmans texter kan','ge exempel på hur livet i staden skildrades','visa varje invånares exakta liv','fungera som fullständiga befolkningsregister']
],['historisk-kalla','kyrkbocker','bellman']);
C(10,'bildtolkning',2,'Använd kläder och miljö för att tolka bilder av olika samhällsgrupper.','AB:32;G102:103',[
 ['När vi jämför porträtten kan vi undersöka','kläder, föremål och miljö','bara om bilden har en ram','bara hur många bokstäver namnet har'],
 ['Skillnaderna kan ge ledtrådar om','människornas samhällsställning','vilket år varje person dog','exakt vad varje person tänkte'],
 ['Därför använder vi bilderna för att','undersöka likheter och skillnader i levnadsvillkor','anta att alla hade samma vardag','slippa läsa andra källor']
],[],{teacherNote:'Övningen tränar arbetsbokens fråga 32. Den ersätter inte tolkning av de tre verkliga bilderna; i spelet ska bilderna visas eller uppgiften märkas som förberedande metodträning.'});
C(10,'kallor-forandring',3,'Jämför hur vår kunskap om svensk slavhandel kan förändras.','G102:103;L7:Den svenska slavhandeln;AB:31',[
 ['Boken berättar att svensk slavhandel','tidigare fick liten plats i historieskrivningen','alltid hade störst plats i alla historieböcker','saknade bevarade uppgifter'],
 ['I arkiven finns','register och protokoll om kolonin','bara sagor utan koppling till ön','bara dokument från Kina'],
 ['När forskare undersöker dem kan','fler människors erfarenheter och Sveriges roll synliggöras','alla gamla dokument försvinna','historien bevisas aldrig ha hänt']
],['historisk-kalla','slavhandel']);

// Unscored questions. Opinion is not a short-answer fact or an automatic pass/fail.
export const reflections=[
 {id:'sos-samtal-frihet',storyChapter:1,question:'På vilka sätt var frihetstiden friare, och på vilka sätt var friheten mindre än i dag?',references:refs('AB:1;L1:Lite friare;F1:1'),focus:['kungens makt','olika gruppers möjligheter'],scored:false},
 {id:'sos-samtal-ogift',storyChapter:2,question:'Hur skiljer sig synen på att få barn utan att vara gift då och i dag?',references:refs('P1:4d;F1:3'),focus:['historiska normer','jämförelse med i dag'],scored:false},
 {id:'sos-samtal-utsatthet',storyChapter:2,question:'Vilka allvarliga följder kunde rädsla för straff och skam få för en ogift kvinna och hennes barn?',references:refs('P1:4b;F1:3;AB:6'),focus:['förklara utsattheten med dåtidens regler','bedömningsstödet tar upp att barn lämnades bort eller dödades och att kvinnor försökte avbryta graviditeten','samtal med historisk inramning; inga val där eleven ska utföra handlingarna'],scored:false},
 {id:'sos-samtal-barn',storyChapter:2,question:'Hur kunde vardagen se ut för ett barn på barnhus? Vad skiljer sig från din vardag?',references:refs('P1:5;F1:4;AB:7'),focus:['arbete','mat och omsorg','jämförelse utan antaganden om elevens hem'],scored:false},
 {id:'sos-samtal-kvinnor',storyChapter:4,question:'Varför tror du att så många kända personer i historieböcker är män?',references:refs('P1:9c'),focus:['öppen reflektion','ingen automatisk rättning'],scored:false},
 {id:'sos-samtal-linne',storyChapter:4,question:'Vilka följder kan det få att dela in människor i grupper?',references:refs('AB:14c;L4:Carl von Linné'),focus:['tolkning och konsekvenser','samtal'],scored:false},
 {id:'sos-samtal-kungen',storyChapter:5,question:'Varför kunde Gustav III vara omtyckt av vissa och avskydd av andra?',references:refs('LL:4;AB:16c,34–35'),focus:['reformer','maktfördelning','olika grupper'],scored:false},
 {id:'sos-samtal-bostad',storyChapter:6,question:'Hade du velat bo i staden eller på landet då? Vad bygger du ditt val på?',references:refs('L6:Lektionsförslag'),focus:['levnadsvillkor','motivering'],scored:false},
 {id:'sos-samtal-seger',storyChapter:7,question:'Tror du att Gustav III hade blivit mer populär om han vunnit kriget? Varför?',references:refs('L7:facit s.96 fråga 2;AB:27'),focus:['tänkbar följd','skilj hypotes från faktiskt händelseförlopp'],scored:false},
 {id:'sos-samtal-maskerad',storyChapter:8,question:'Varför tror du att attentatsmännen valde en maskerad?',references:refs('AB:28b'),focus:['rimlig hypotes','ingen fast facitmening'],scored:false},
 {id:'sos-samtal-makt',storyChapter:10,question:'Vilka fördelar och nackdelar kan det ha att riksdagen har makten, jämfört med att kungen har makten?',references:refs('AB:34–35'),focus:['jämför system','använd innehållet i kapitlet'],scored:false}
 ,{id:'sos-samtal-kallval',storyChapter:10,question:'Hur skulle du använda ett gammalt föremål, en samtida dagbok, en målning, en modern film och en lärobok när du undersöker 1700-talet?',references:refs('P2:3;G102:103;AB:31'),focus:['vad varje material kan berätta','skilj material från tiden från senare skildringar','provfrågans ord historiska källor är inte ett tillräckligt precist automatiskt sant/falskt-kriterium för alla exempel'],scored:false}
];
export default cards;
