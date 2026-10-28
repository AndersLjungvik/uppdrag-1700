/* Chapter 6, source checked against the user's book photographs pp. 86–89
 * and workbook pp. 32–33, tasks 18–22. New dialogue is fictional.
 * Source metadata is not displayed in pupil questions. */
(function(){
'use strict';
const bank=window.UPPDRAG_RECALL_BANK,A=window.UPPDRAG_RECALL_ASSESS;
const field=(label,sample,answers,rule)=>({label,sample,...(answers?{answers}:{}),...(rule?{rule,criterion:label}:{})});
const choice=(label,right,wrong)=>({...field(label,right,[right]),options:[right,...wrong]});
const tasks=[];
function topic(key,place,source,hint,drill,versions){
 versions.forEach((v,rank)=>tasks.push({id:'rc6-'+key+'-'+rank,chapter:6,topic:key,place,rank,kind:'fields',prompt:v[0],fields:v[1],model:v[1].map(f=>f.sample).join(' '),hint,source,drill}));
}
const drill=(prompt,sample,answers=[sample])=>({prompt,sample,answers});
const jobs=['hantverkare','snickare','skomakare','smed','bagare','handelsman','handlare','köpman','latrintömmerska','latrintömmare','renhållningshjon','fabriksarbetare','tobaksarbetare','handelsmän','köpmän','latrintömmerskor','smeder','bagare'];
topic('fields','farm','Grundbok 86; arbetsbok 18','Jämför hur samma färg är utspridd i A och samlad i B.',drill('Vad kallas förändringen när spridda små åkrar samlades?','skifte',['skifte','skiftet','skiften']),[
 ['Jämför kartorna A och B. Vad hände med åkrarna?', [choice('Förändringen','Små spridda åkrar samlades till större sammanhängande åkrar.',['Stora sammanhängande åkrar delades i många smala tegar.','Åkrarna försvann och ersattes av stadsbebyggelse.'])]],
 ['Beskriv skillnaden mellan åkrarna i A och B. Stödord räcker.',[field('I A låg familjens åkrar …','utspridda i små tegar.',null,'scattered'),field('I B låg familjens åkrar …','samlade i större sammanhängande fält.',null,'joined')]],
 ['Vad innebar skifte för åkrarna? Beskriv förändringen från A till B i ett kort svar.',[field('Åkrarnas förändring','Små spridda tegar slogs ihop till större sammanhängande åkrar.',null,'consolidation')]]
]);
topic('homes','farm','Grundbok 86; arbetsbok 18','Titta på var husen ligger i förhållande till åkrarna.',drill('Var bodde de flesta bönder före skiftet?','i byar',['i byar','byar','byn','i en by']),[
 ['Vad visar kartorna om gårdarnas placering?', [choice('Gårdarna','Flera gårdar flyttades från byn närmare den samlade jorden.',['Alla gårdar låg kvar tätt ihop mitt i byn.','Gårdarna flyttades in till stadens torg.'])]],
 ['Skriv vad som förändrades för familjer som flyttade från byn.',[field('Efter flytten bodde familjerna …','längre från sina grannar.',null,'separated')]],
 ['Varför stämmer den gamla adressen vid byns brunn inte längre i vårt äventyr? Förklara med gårdarnas flytt.',[field('Din förklaring','Gården flyttades från byn till familjens samlade åkrar.',null,'relocation')]]
]);
topic('consequences','farm','Grundbok 86; arbetsbok 18','Tänk både på arbetet med jorden och på kontakten med grannarna.',drill('Vilket arbete blev lättare när åkrarna samlades?','jordbruket',['jordbruket','odlingen','odla','att odla','jordbruk']),[
 ['Välj en möjlig fördel och en möjlig nackdel med skiftet.',[choice('Fördel','Det blev lättare att odla när åkrarna låg samlade.',['Varje familj fick fler små åkrar långt från varandra.','Alla bönder slapp arbeta med jorden.']),choice('Nackdel','Bygemenskapen kunde försvagas när gårdarna flyttades isär.',['Alla familjer fick säkert samma inkomst.','Alla måste flytta till Stockholm.'])]],
 ['Ge en möjlig fördel för jordbruket och en nackdel för bygemenskapen. Korta svar räcker.',[field('En fördel var …','lättare att odla samlad jord.',null,'benefit'),field('En nackdel var …','sämre gemenskap när grannarna bodde längre bort.',null,'community')]],
 ['Förklara en fördel för jordbruket och en nackdel för bygemenskapen efter skiftet. Skriv en sak i varje ruta.',[field('Fördel för jordbruket','Det blev effektivare att odla när åkrarna låg samlade.',null,'benefit'),field('Nackdel för bygemenskapen','Gårdarna flyttades isär så grannar fick svårare att hjälpas åt.',null,'community')]]
]);
topic('jobs','workshop','Grundbok 87; arbetsbok 19','Tänk på att tillverka, sälja och sköta stadens vardag.',drill('Nämn ett yrke som fanns i staden under 1700-talet.','hantverkare',jobs),[
 ['Vilket par innehåller två arbeten som fanns i städerna?', [choice('Två yrken','Hantverkare och latrintömmerska',['Lokförare och bilmekaniker','Telefonist och elektriker'])]],
 ['Nämn två olika yrken som fanns i städerna. Bara yrkesnamnen behövs.',[field('Ett yrke','hantverkare',jobs),field('Ett annat yrke','latrintömmerska',jobs)]],
 ['Ge två olika exempel på arbeten i 1700-talets städer. Du behöver inte förklara orsaker.',[field('Första yrket','handelsman',jobs),field('Andra yrket','fabriksarbetare',jobs)]]
]);
topic('children','workshop','Grundbok 87; arbetsbok 20','Jämför hur mycket fabriksägaren betalade barn och vuxna.',drill('Fick barnen högre eller lägre lön än vuxna?','lägre lön',['lägre','lägre lön','mindre lön','mindre']),[
 ['Varför tyckte många fabriksägare att det lönade sig att anställa barn?', [choice('Ägarens ekonomiska skäl','Barn fick lägre lön än vuxna.',['Barn fick högre lön men arbetade färre timmar.','Ägarna måste ge alla barn en egen fabrik.'])]],
 ['Avsluta meningen med det ekonomiska skälet. Ett kort svar räcker.',[field('Barn var billigare att anställa eftersom …','de fick lägre lön än vuxna.',null,'lowwage')]],
 ['Varför tjänade fabriksägare på att anställa barn i stället för vuxna? Förklara med lönen.',[field('Det ekonomiska skälet','De betalade barn mindre i lön än vuxna.',null,'lowwage')]]
]);
topic('city','workshop','Grundbok 87–88; arbetsbok 21c','Tänk på bostäder, arbete och skillnader mellan rika och fattiga.',drill('Vilken stad beskrivs i avsnittet om Bellman och krogarna?','Stockholm',['Stockholm']),[
 ['Vilken beskrivning stämmer med avsnittet om livet i städerna?', [choice('Levnadsvillkor','Rika och fattiga levde olika; många fattiga bodde trångt.',['Alla hade lika mycket pengar och stora bostäder.','Stadsborna arbetade bara med jordbruk.'])]],
 ['Ge två olika exempel på livet i staden. Skriv ett exempel i varje ruta; stödord räcker.',[field('Exempel 1','trångboddhet',null,'city'),field('Ett annat exempel','fattigdom',null,'city')]],
 ['Hur kunde vardagen vara i Stockholm? Ge två olika konkreta exempel ur avsnittet. Korta svar räcker.',[field('Första exemplet','Många bodde fattigt.',null,'city'),field('Andra exemplet','Det var trångt i bostäderna.',null,'city')]]
]);
topic('bellman','cafe','Grundbok 88; arbetsbok 21a (namnåterkallning, inte porträttidentifiering)','Hans efternamn börjar med Bell-.',drill('Vilken svensk sångare och visdiktare skildrade Stockholms krogliv?','Bellman',['Bellman','Carl Michael Bellman','Carl Mikael Bellman']),[
 ['Vilken svensk sångare och visdiktare skildrade bland annat Stockholms krogar?', [choice('Namn','Carl Michael Bellman',['Carl von Linné','Anders Celsius'])]],
 ['Skriv namnet på visdiktaren som skildrade livet på Stockholms krogar. Efternamn räcker.',[field('Visdiktaren','Bellman',['Bellman','Carl Michael Bellman','Carl Mikael Bellman'])]],
 ['Vem skrev visor om bland annat människor och krogar i Stockholm? Ett namn räcker.',[field('Namn','Carl Michael Bellman',['Bellman','Carl Michael Bellman','Carl Mikael Bellman'])]]
]);
topic('songs','cafe','Grundbok 88; arbetsbok 21b','Tänk på de miljöer och människor som visorna skildrar.',drill('Nämn en miljö i Bellmans visor.','krogar',['krogar','krogen','Stockholm','Stockholms krogar']),[
 ['Vilket är ett exempel på innehåll i Bellmans visor?', [choice('Innehåll','Människor och krogliv i Stockholm.',['Bilar och tunnelbanor i Stockholm.','Fotboll på stora moderna arenor.'])]],
 ['Nämn ett ämne eller en miljö som Bellman sjöng om. Ett exempel räcker.',[field('Ett exempel','kroglivet i Stockholm',null,'songs')]],
 ['Vad kunde Bellmans sånger handla om? Ge ett relevant exempel, inte en fullständig lista.',[field('Ett exempel','människor på Stockholms krogar',null,'songs')]]
]);
topic('patronage','cafe','Grundbok 89; arbetsbok 22, luckor 1–5','Tänk på vilka som skapade kultur och vem som gav dem pengar.',drill('Vilken kung stödde konstnärer, poeter och författare?','Gustav III',['Gustav III','Gustav 3','Gustav den tredje']),[
 ['Vem gav pengar till kulturen, och vilka tre grupper nämns i avsnittet?', [choice('Kung','Gustav III',['Karl XII','Gustav IV Adolf']),choice('Grupper','Konstnärer, poeter och författare',['Soldater, bönder och präster','Fabriksägare, fiskare och sjömän'])]],
 ['Skriv kungen och de tre grupper som fick kulturstöd. Korta namn och gruppnamn räcker.',[field('Kungen','Gustav III',['Gustav III','Gustav 3','Gustav den tredje']),field('De tre grupperna','konstnärer, poeter och författare',null,'artists')]],
 ['Vilka tre grupper fick kulturstöd, och hur kunde stödet gynna kungen? Skriv grupperna och en politisk följd.',[field('Tre grupper','konstnärer, poeter och författare',null,'artists'),field('En följd för kungen','De stödde kungen och gjorde honom mer populär.',null,'royalSupport')]]
]);
topic('institutions','print','Grundbok 89; arbetsbok 22, luckor 6–8','Tänk på en opera, en teater och en akademi för språket.',drill('Vilken akademi grundade Gustav III för att värna svenska språket?','Svenska Akademien',['Svenska Akademien','svenska akademin']),[
 ['Vilken grupp innehåller de tre kulturinstitutioner som Gustav III grundade enligt avsnittet?', [choice('Institutioner','Kungliga Operan, Dramaten och Svenska Akademien',['Kungliga Operan, riksdagen och riksrådet','Vetenskapsakademien, barnhuset och kyrkan'])]],
 ['Fyll i en kulturinstitution i varje ruta.',[field('Operan heter …','Kungliga Operan',['Kungliga Operan','Operan']),field('Teatern heter …','Dramaten',['Dramaten','Kungliga Dramatiska Teatern','Dramatiska teatern']),field('Akademien för svenska språket heter …','Svenska Akademien',['Svenska Akademien','svenska akademin'])]],
 ['Nämn de tre kulturinstitutionerna från avsnittet som Gustav III grundade. Namnen räcker.',[field('En opera','Kungliga Operan',['Kungliga Operan','Operan']),field('En teater','Dramaten',['Dramaten','Kungliga Dramatiska Teatern','Dramatiska teatern']),field('En akademi','Svenska Akademien',['Svenska Akademien','svenska akademin'])]]
]);
topic('reading','print','Grundbok 89; arbetsbok 22, lucka 9','Tänk på böcker och möjligheten att skaffa sig kunskap.',drill('Vad hette poeten Lenngren i förnamn?','Anna Maria',['Anna Maria','Anna-Maria']),[
 ['Vilken rättighet för kvinnor tas upp i avsnittet om Anna Maria Lenngren?', [choice('Rättighet','Att läsa böcker och bilda sig.',['Att bara få arbeta i köket.','Att inte få läsa tidningar.'])]],
 ['Avsluta meningen. Beskriv den rättighet som tas upp i texten.',[field('Kvinnor skulle ha rätt att …','läsa och bilda sig.',null,'education')]],
 ['Vilken rättighet försvaras i texterna om kvinnors utbildning? Beskriv rätten kort.',[field('Rättigheten','Kvinnor skulle få läsa böcker och utbilda sig.',null,'education')]]
]);
topic('writer','print','Grundbok 89; arbetsbok 22, sista luckan','Efternamnet börjar med Ahl-.',drill('Vilken annan kvinnlig författare nämns tillsammans med Lenngren?','Catharina Ahlgren',['Catharina Ahlgren','Katarina Ahlgren','Ahlgren']),[
 ['Vilken annan kvinna i avsnittet skrev om jämställdhet och kvinnors rättigheter?', [choice('Namn','Catharina Ahlgren',['Eva Ekeblad','Cajsa Warg'])]],
 ['Nämn kvinnan från Östergötland som också skrev om kvinnors rättigheter. Efternamnet räcker.',[field('Namn','Catharina Ahlgren',['Catharina Ahlgren','Katarina Ahlgren','Ahlgren'])]],
 ['Vilken annan kvinnlig skribent än Lenngren nämns i avsnittet om kvinnors rättigheter? Ett namn räcker.',[field('Namn','Ahlgren',['Catharina Ahlgren','Katarina Ahlgren','Ahlgren'])]]
]);
bank.push(...tasks);
const places=[['farm','Sigrid'],['workshop','Hantverkaren'],['cafe','Maja'],['print','Brita']];
const hellos={
 farm:['Din adresslapp är gammal. Titta på de två bykartorna så kan vi få brevet till rätt gård.','Brevet kom fram. Nu vill jag få med både arbetet och gemenskapen i berättelsen om byn.','Kan du förklara förändringen utan färdiga svar? Kartorna ligger kvar som stöd för jämförelsen.'],
 workshop:['Till sidan behövs också röster från staden. Här finns anteckningar från en hantverkare, en latrintömmerska och ett arbetande barn.','Vi skriver arbetsplatsernas anteckningar ur minnet. Bara det som står i varje fråga behövs.','Låt arbetarnas vardag synas i stadens bok. Ge de korta exempel och förklaringar som efterfrågas.'],
 cafe:['Jag har hört visor här i kaffehuset. Vi behöver reda ut vem som skrev dem och vad de berättar om.','Nu ska vi återge visorna och kulturstödet utan en lista med svar.','Korta namnfrågor kräver fortfarande bara namn. När en följd efterfrågas står det i frågan.'],
 print:['Stadens bok behöver en kultursida. Vilka institutioner och skribenter hör till berättelsen?','Jag har lagt undan namnlistan. Hjälp mig fylla i de saknade uppgifterna.','Vi gör sista kontrollen före tryckningen. Sedan lämnar du sidan till Maja.']};
const runs=[{p:'cafe',r:0,f:[],who:'Maja',hello:'Ett brev har kommit tillbaka. Gården vid byns brunn finns inte längre på samma plats.',bye:'Gå till Sigrid i Byn.'}];
for(let rank=0;rank<3;rank++)for(let i=0;i<places.length;i++){
 const [p,who]=places[i],next=i<3?places[i+1][0]:rank<2?'farm':'cafe';
 const label={farm:'Sigrid i Byn',workshop:'hantverkaren i Verkstäderna',cafe:'Maja i Kaffehuset',print:'Brita i Tryckeriet'}[next];
 runs.push({p,r:rank,f:tasks.filter(t=>t.place===p&&t.rank===rank).map(t=>t.id),who,hello:hellos[p][rank],storyHello:hellos[p][rank],bye:(p==='farm'&&rank===0?'Brevet är framme! ':p==='print'&&rank===2?'Sidan är tryckt. Ta den till Maja. ':'' )+(p==='print'&&rank===2?'':('Gå nu till '+label+'.'))});
}
window.UPPDRAG_CH6_CONTENT={facts:{},runs,chapterTitle:'Livet på landet och i staden',chapterOneKey:'uppdrag1700.ch1-real-world.20261019.v11',chapterTwoKey:'uppdrag1700.ch2-real-world.20261019.v1',chapterThreeKey:'uppdrag1700.ch3-real-world.20261019.v1',chapterFourKey:'uppdrag1700.ch4-real-world.20261020.v1',chapterFiveKey:'uppdrag1700.ch5-real-world.20261020.v1',
 intro:'En bonde lämnade ett brev till sin syster Sigrid. Förr låg hennes gård vid byns brunn. Nu bor hon vid sin jord. Gå till Byn och jämför kartorna. Brita vill sedan ha en sida om livet på landet och i staden.',
 delivery:{p:'cafe',r:2,f:[],who:'Maja',hello:'Har du sidan från tryckeriet?',bye:'Tack! Brevet kom fram, och nu får både byn och stadens arbetare plats i vår bok. Nästa gång behöver Jo i hamnen hjälp med nyheter från Marstrand.'},explanations:{},vocabulary:{}};
// Field-scoped requirements. No mandatory conjunction, essay length or hidden place.
const norm=v=>A.norm(v).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const not=s=>/\b(inte|ej|aldrig)\b/.test(s);
const rules={
 scattered:s=>/utsprid|spridda|smala|sm[åa] tegar|sma akrar|olika stallen/.test(s)&&!not(s),
 joined:s=>/samlade|samlats|sammanhang|storre|ihop|ett (enda )?stalle/.test(s)&&!not(s),
 consolidation:s=>/sma|spridda|smala|tegar/.test(s)&&/slogs ihop|slog ihop|saml|storre|sammanhang/.test(s)&&!not(s)&&!/stora.{0,20}(delades|blev).{0,20}(sma|smala)/.test(s),
 separated:s=>/is[äa]r|langre (bort|fran)|glesare|ensamma|vid (sina|deras|den|familjens) (akrar|jord)|narmare (akrar|jorden)/.test(s)&&!not(s),
 relocation:s=>/gard|hus|de |hon /.test(s)&&/flytt/.test(s)&&/jord|aker|akrar|fal[tv]/.test(s)&&!not(s),
 benefit:s=>/lattare|effektiv|lonsam|battre|snabbare|slapp|mindre tid/.test(s)&&/odl|jord|arbete|aker|akrar|flytta|tegar/.test(s)&&!/(inte|aldrig).{0,12}(lattare|effektiv|battre)/.test(s),
 community:s=>/gemenskap|grannar|hjalpas at|varandra|ensam|byarna/.test(s)&&/samre|svagare|forsv|mindre|langre|is[äa]r|splittr|svarare|ensam|inte lika/.test(s),
 lowwage:s=>/lon|betala|arbetskraft/.test(s)&&/lagre|mindre|billig|inte.{0,35}lika (mycket|hog)/.test(s)&&!/(hogre|mer) (i )?lon|betala.{0,12}mer|inte billig/.test(s),
 songs:s=>/krog|stockholm|sprit|alkohol|fyll|prostit|kungen|fjaril|sex|karlek|fest/.test(s)&&!not(s)&&!/bilmek|telefon|tunnelban|flygplan/.test(s),
 artists:s=>/konstnar/.test(s)&&/poet/.test(s)&&/forfatt/.test(s)&&!not(s),
 royalSupport:s=>/kung|honom|gustav/.test(s)&&/stod|popular|hylla|hans sida|stalla sig|berom/.test(s)&&!not(s),
 education:s=>/lasa|lasning|bocker|utbild|bilda sig|bildning|kunskap/.test(s)&&!/(inte|aldrig|ej).{0,20}(lasa|bilda|utbild)|forbjud/.test(s)
};
function cityGroups(v){const s=norm(v);if(not(s))return[];return Object.entries({housing:/trangt|trangbodd|trangsel/,poverty:/fattig|rik|klass|skillnad|pengar/,hygiene:/smuts|hygien|dass|latrin/,work:/barnarbete|barn.{0,20}(arbete|arbet|jobb)|tunga arbet|hard[a]? arbet|lag lon/,tavern:/krog|alkohol|sprit/}).filter(([,r])=>r.test(s)).map(([k])=>k);}
function jobGroup(v){const s=norm(v);return /latrin|renhall/.test(s)?'latrin':/handelsman|handlare|kopman/.test(s)?'trade':/fabrik|tobaks/.test(s)?'factory':s;}
const prior=A.assess;
A.assess=function(t,drafts,shortCheck){
 if(t.chapter!==6)return prior(t,drafts,shortCheck);
 const details=t.fields.map((f,i)=>{const v=String(drafts[i]??''),s=norm(v);let status;
  if(!s||/^(vet inte|jag vet inte|minns inte|asdf|test|hej)$/.test(s))status='empty';
  else if(f.answers)status=window.UPPDRAG_PROMPT_ALIGNMENT.shortCheck(f,v,shortCheck);
  else status=(f.rule==='city'?cityGroups(v).length>0:rules[f.rule]?.(s))?'met':'review';
  return{field:i,status,label:f.label};});
 if(t.topic==='jobs'&&t.fields.length===2&&details.every(d=>d.status==='correct')){
  const a=jobGroup(drafts[0]),b=jobGroup(drafts[1]);
  if(a===b||(a==='hantverkare'&&['snickare','smed','skomakare','bagare'].includes(b))||(b==='hantverkare'&&['snickare','smed','skomakare','bagare'].includes(a)))details[1]={field:1,status:'review',label:'Ge ett annat yrke; samma yrke med ett annat ord räknas inte två gånger.'};
 }
 if(t.topic==='city'&&t.fields.length===2&&t.fields[0].rule==='city'){
  const a=cityGroups(drafts[0]),b=cityGroups(drafts[1]);
  if(!a.some(x=>b.some(y=>x!==y)))details.push({field:1,status:'review',label:'Ge två olika exempel, inte samma sak med andra ord.'});
 }
 const status=details.some(d=>d.status==='empty')?'empty':details.some(d=>['wrong','contradiction'].includes(d.status))?'contradiction':details.some(d=>!['correct','met'].includes(d.status))?'review':'sufficient';
 return {status,details};
};
window.UPPDRAG_CH6_TASKS=tasks;
})();
