/* Uppdrag 1700 kapitel 3: Krig eller fred?
 * Source: SOS Historia 4–6 pp.70–74; workbook 8–10.
 * Historical facts are grounded; names of today's game NPCs are fictional.
 * Deterministic distractors test one fact at a time, with rephrasing at all levels. */
(function(){
'use strict';
function fact(ab,a,hint,q,choices,page){
 if(q.length!==3||choices.length!==3)throw Error('Invalid learning unit');
 return {ab,a,hint,q,variants:q.map((_,i)=>choices.map((c,j)=>(i===0?c:i===1?j===0?'Det stämmer att '+c.charAt(0).toLowerCase()+c.slice(1):c:j===0?'Rätt uppgift: '+c.charAt(0).toLowerCase()+c.slice(1):c))),page};
}
const facts={
 hatsWar:fact('8a','Hattarna ville att Sverige skulle kriga mot Ryssland.','Det var en grupp yngre riksdagsmän som ville ta tillbaka förlorad mark.',
 ['Vilken grupp ville börja krig mot Ryssland?','Var det hattarna eller mössorna som drev på för krig?','En notis säger att mössorna ville starta krig. Vilken grupp var det?'],
 ['Hattarna ville kriga mot Ryssland.','Mössorna ville kriga mot Ryssland.','Båda grupperna ville undvika krig till varje pris.'],'70'),
 hatsFrance:fact('8c','Hattarna ville samarbeta med Frankrike.','Tänk på vilket av de två länderna hattarna närmade sig.',
 ['Vilket land ville hattarna samarbeta med?','Vilket land förknippades hattarnas utrikespolitik med?','En anteckning kopplar hattarna till England. Vilket land var rätt?'],
 ['Frankrike.','England.','Ryssland.'],'70'),
 capsEngland:fact('8d','Mössorna ville i stället närma sig England.','Det var inte samma land som hattarna föredrog.',
 ['Vilket land ville mössorna samarbeta med?','Vem ville mössorna närma sig: England eller Frankrike?','En skrivare påstår att mössorna samarbetade med Frankrike. Vad stämmer?'],
 ['England.','Frankrike.','Ryssland.'],'70'),
 bribes:fact('8b','Både hattarna och mössorna tog emot mutor från andra länder.','Kunde det ha gällt mer än en av grupperna?',
 ['Vilka tog emot mutor från andra länder?','Var det en eller båda grupperna som tog emot mutor?','En notis säger att bara hattarna tog mutor. Vad berättar boken?'],
 ['Både hattarna och mössorna.','Bara hattarna.','Bara mössorna.'],'70'),
 warLost:fact('9a','Sverige förlorade kriget mot Ryssland 1741–1743.','Fundera på vilket land som segrade.',
 ['Vem vann kriget 1741–1743?','Hur slutade Sveriges krig mot Ryssland?','En krigsrapport påstår att Sverige vann. Vilket land vann?'],
 ['Ryssland vann och Sverige förlorade.','Sverige vann tillbaka sina förlorade områden.','Kriget slutade utan att någon vann eller förlorade.'],'71'),
 landLost:fact('9e','Sverige förlorade landområden i Finland till Ryssland.','Tänk på vad Ryssland fick behålla efter fredsavtalet.',
 ['Vad hände med Sveriges landområden efter kriget?','Fick Sverige mer eller mindre mark efter kriget?','En karta visar att Sverige fick ny mark från Ryssland. Rätta felet.'],
 ['Sverige förlorade landområden till Ryssland.','Sverige tog stora områden från Ryssland.','Sverige och Ryssland blev ett gemensamt land.'],'71'),
 farmersAnger:fact('9b','Bönder protesterade mot högre skatter och mot kriget.','Vad hade kriget kostat människor?',
 ['Varför växte missnöjet bland bönderna under kriget?','Vad behövde bönderna bidra med när kriget drog ut på tiden?','En rapport säger att bönderna var nöjda med kriget. Vad var det många protesterade mot?'],
 ['Ökade skatter och att fler soldater skickades ut.','Skatterna sänktes och färre soldater behövdes.','Att Ostindiska kompaniet tog hem för mycket porslin.'],'71'),
 tsarina:fact('9c','Rysslands tsarinna Elisabet ville att Adolf Fredrik skulle bli Sveriges nästa kung.','Vad hände med valet av nästa regent efter kriget?',
 ['Vem ville tsarinnan Elisabet se som Sveriges nästa kung?','Vilken person ville Rysslands härskare ha på den svenska tronen?','En anteckning säger att Rysslands tsarinna valde Karl XII. Vem stödde hon?'],
 ['Adolf Fredrik.','Karl XII.','Ulrika Eleonora.'],'71'),
 summer:fact('10a','Stora daldansen ägde rum sommaren 1743.','Årtalet finns i arbetsbokens gröna ordruta.',
 ['Vilket år skedde Stora daldansen?','När marscherade bönderna från Dalarna mot Stockholm?','En anteckning daterar Stora daldansen till 1772. Vilket år stämmer?'],
 ['Sommaren 1743.','Sommaren 1719.','Sommaren 1772.'],'72'),
 march:fact('10b','Omkring fem tusen bönder marscherade från Dalarna till Stockholm.','Vilka deltog och vart gick de?',
 ['Vilka deltog i Stora daldansen och vart gick de?','Vart marscherade bönderna från Dalarna?','En lapp påstår att adelsmän red från Stockholm till Dalarna. Vad hände?'],
 ['Bönder från Dalarna gick mot Stockholm.','Adelsmän från Stockholm marscherade till Dalarna.','Svenska soldater marscherade till Kina.'],'72'),
 protest:fact('10c','Bönderna protesterade mot det misslyckade kriget och mot att Adolf Fredrik skulle bli kung.','De tyckte att de ansvariga borde straffas.',
 ['Vad protesterade bönderna mot under Stora daldansen?','Varför ville bönderna ställa ansvariga till svars?','En lapp säger att bönderna stödde kriget och kungavalet. Vad stämmer?'],
 ['De var arga över kriget och ville inte ha Adolf Fredrik som kung.','De krävde nya krig och ville ha Adolf Fredrik som kung.','De protesterade bara mot handeln med Kina.'],'72'),
 norrmalm:fact('10d','På Norrmalm i Stockholm öppnade soldater eld mot bönderna. Många dödades.','Var möttes upproret av soldater?',
 ['Vad hände på Norrmalm under Stora daldansen?','Hur slog soldaterna ned böndernas uppror i Stockholm?','En notis säger att upproret slutade utan våld. Vad hände på Norrmalm?'],
 ['Soldater sköt mot bönderna och många dödades.','Soldaterna gick med i upproret och ingen skadades.','Bönderna tog sig vidare till Ryssland utan strid.'],'73'),
 david:fact('10e','Soldaten David Hedenquist vägrade skjuta mot bönderna. Hans dödsstraff ändrades till straffarbete på Marstrands fästning.','Han vägrade lyda en order. Vad blev följden?',
 ['Vad vägrade soldaten David Hedenquist att göra?','Vad blev följden för David som inte lydde ordern?','En text påstår att David fick en belöning för att han sköt. Vad stämmer?'],
 ['David vägrade skjuta på bönderna och fick ett hårt straff.','David sköt mot bönderna och belönades av befälet.','David blev genast frikänd och fick lämna armén.'],'73')
};
const runs=[
 {p:'cafe',r:0,f:[],who:'Maja',
 hello:'Det är något oroligt i staden. Folk grälar om krig och fred.',
 bye:'Gå till Erik i Riksdagshuset. Han försöker reda ut vad hattarna och mössorna ville.'},
 {p:'riksdag',r:0,f:['hatsWar','hatsFrance','capsEngland','bribes'],who:'Erik',
 hello:'Jag sorterar två högar med protokoll. Men nu blandar jag ihop hattarna och mössorna! Kan du hjälpa mig?',
 bye:'Tack! Jo vid kajen har fått ett brev om kriget. Spring dit och fråga vad han minns.'},
 {p:'quay',r:0,f:['warLost','landLost','farmersAnger','tsarina'],who:'Jo',
 hello:'Ett fartyg har kommit med nyheter om kriget. Det står något om Ryssland och Sveriges nästa kung, men jag tappar bort orden.',
 bye:'Nu blev det begripligt! Gå till Lars vid Tryckeriet. Han har hört om bönderna från Dalarna.'},
 {p:'print',r:0,f:['summer','march','protest','norrmalm','david'],who:'Lars',
 hello:'Jag försöker läsa ett gammalt blad om Stora daldansen. Bönderna marscherade, men vad hände sedan? Vill du hjälpa?',
 bye:'Erik ville höra det du fick veta. Gå tillbaka till Riksdagshuset.'},
 {p:'riksdag',r:1,f:['bribes','capsEngland','hatsFrance','hatsWar'],who:'Erik',
 hello:'Jag trodde att jag mindes allt! Men när protokollen är undanlagda blandar jag ihop partierna igen.',
 bye:'Det där kan jag berätta utan pappret. Jo behöver visst göra samma sak nere vid kajen.'},
 {p:'quay',r:1,f:['tsarina','farmersAnger','landLost','warLost'],who:'Jo',
 hello:'Du är tillbaka! Jag tänkte berätta om kriget för en skeppare, men allt blev suddigt igen.',
 bye:'Nu vet jag! Lars väntar med historien om böndernas marsch. Gå till Tryckeriet.'},
 {p:'print',r:1,f:['protest','summer','norrmalm','david','march'],who:'Lars',
 hello:'Berättelsen om Stora daldansen är fortfarande på tungan. Hjälp mig pröva utan papper.',
 bye:'Tack! Erik har hittat några påståenden om hattarna och mössorna som verkar fel.'},
 {p:'riksdag',r:2,f:['hatsFrance','hatsWar','bribes','capsEngland'],who:'Erik',
 hello:'Någon har blandat ihop de två grupperna här. Nu måste vi granska vad som verkligen stämmer.',
 bye:'Jag ska rätta protokollen. Jo har också fått ett brev där någon skrivit fel om kriget.'},
 {p:'quay',r:2,f:['landLost','warLost','tsarina','farmersAnger'],who:'Jo',
 hello:'Det här krigsbrevet stämmer inte med det vi lärde oss. Kan du hitta vad som är fel?',
 bye:'Bra gjort. Lars behöver din hjälp med att granska berättelsen om Stora daldansen en sista gång.'},
 {p:'print',r:2,f:['march','david','norrmalm','summer','protest'],who:'Lars',
 hello:'Här står både rätt och fel. Hjälp mig reda ut vad som hände, så att jag inte för vidare osanning.',
 bye:'Nu har vi ordning på berättelsen. Du hjälpte oss förstå hur kriget påverkade hela landet!'}
];
const explanations={
 hatsWar:['Hattarna var en grupp yngre riksdagsmän. De ville att Sverige skulle starta krig mot Ryssland. De ville ta tillbaka mark som Sverige hade förlorat.','Deras motståndare kallades mössorna. De ville vara försiktigare med krig. Namnen hattar och mössor handlade om två grupper inom riksdagen.'],
 hatsFrance:['Hattarna ville samarbeta mer med Frankrike. De trodde att Sverige kunde bli starkare med Frankrikes hjälp.','Mössorna föredrog England. Därför skilde sig grupperna åt när de diskuterade Sveriges relationer med andra länder.'],
 capsEngland:['Mössorna var en grupp inom riksdagen. De ville samarbeta mer med England än med Frankrike.','Hattarna ville i stället ha närmare samarbete med Frankrike. Grupperna ville alltså olika saker i utrikespolitiken.'],
 bribes:['Både hattarna och mössorna tog emot mutor från andra länder. Mutor är pengar eller gåvor som ska påverka ett beslut.','Andra länder försökte få Sverige att fatta beslut som gynnade dem. Det var inte tillåtet att köpa politiska beslut.'],
 warLost:['Hattarna fick igenom ett krig mot Ryssland år 1741. Kriget gick dåligt för Sverige.','Ryssland vann kriget 1743. Det ledde till förlorad mark och ett allt större missnöje i Sverige.'],
 landLost:['Sverige hade en gång kontrollerat stora områden öster om Östersjön. Efter det misslyckade kriget förlorade landet mer mark till Ryssland.','Det handlade om områden i Finland. Sverige fick alltså inte tillbaka den mark som hattarna ville återta.'],
 farmersAnger:['Kriget kostade pengar. Skatterna ökade och fler soldater skickades ut. Det gjorde många bönder missnöjda.','Bönderna tyckte att de som fattade besluten om kriget borde ta ansvar. Missnöjet bidrog till ett stort uppror.'],
 tsarina:['Rysslands ledare kallades tsarinna. Tsarinnan Elisabet ville ha inflytande över vem som skulle bli Sveriges nästa kung.','Hon ville att Adolf Fredrik skulle utses. Därför påverkade kriget inte bara gränserna utan också valet av svensk kung.'],
 summer:['Sommaren 1743 marscherade bönder från Dalarna mot Stockholm. Deras stora protest kallas Stora daldansen.','Upproret kom efter ett misslyckat krig. Bönderna var arga över hur landet hade styrts och vem som skulle bli kung.'],
 march:['Omkring fem tusen bönder lämnade Dalarna och gick mot Stockholm. De hade bland annat gevär, yxor och klubbor med sig.','Fler människor anslöt sig på vägen. Bönderna ville att de styrande i huvudstaden skulle lyssna på deras krav.'],
 protest:['Bönderna var arga över kriget mot Ryssland och ville att de ansvariga skulle straffas. De ville inte heller ha Adolf Fredrik som Sveriges kung.','De samlades och marscherade mot Stockholm för att försöka påverka besluten. Detta var ett bondeuppror.'],
 norrmalm:['När bönderna kom till Stockholm samlades de på Norrmalm. Där fanns många soldater. Soldaterna öppnade eld mot bönderna.','Många dödades. Andra försökte fly och några drunknade. Upproret slogs ned med våld.'],
 david:['David Hedenquist var soldat. Han vägrade att skjuta mot bönderna eftersom han inte tyckte det var rätt.','Han dömdes först till döden. Straffet ändrades senare till livstids straffarbete på Marstrands fästning.']
};
const vocabulary={
 hatsWar:[['riksdagsmän','personer i riksdagen'],['drev på','försökte få något att hända'],['notis','kort text med nyheter']],
 hatsFrance:[['samarbeta','göra något tillsammans'],['förknippades','hörde ihop med'],['anteckning','något någon skrivit ner']],
 capsEngland:[['samarbeta','göra något tillsammans'],['närma sig','börja samarbeta mer med'],['i stället','något annat än det som först nämndes']],
 bribes:[['mutor','pengar eller gåvor för att påverka ett beslut'],['muta','pengar eller gåvor för att påverka ett beslut'],['notis','kort text med nyheter']],
 warLost:[['segrade','vann'],['slutade','hur det gick'],['rapport','en skriven berättelse om något']],
 landLost:[['landområden','stora delar av ett land'],['mark','områden med jord och land'],['rätta felet','säga vad som var rätt']],
 farmersAnger:[['missnöjet','många var arga eller besvikna'],['bidra med','hjälpa till med något'],['protesterade','visade att de inte var nöjda']],
 tsarina:[['tsarinna','Rysslands kvinnliga härskare'],['tron','att vara kung eller drottning'],['stödde','ville hjälpa']],
 summer:[['ägde rum','hände'],['marscherade','gick tillsammans i grupp'],['daterar','säger när något hände']],
 march:[['deltog','var med'],['marscherade','gick tillsammans i grupp'],['lapp','en kort text på papper']],
 protest:[['protesterade','visade att de inte var nöjda'],['ansvariga','de som bestämde'],['stämmer','är sant']],
 norrmalm:[['upproret','människor protesterade mot de styrande'],['slog ned','stoppade med våld'],['utan våld','ingen behövde bli skadad']],
 david:[['vägrade','sa nej till'],['följden','vad som hände efteråt'],['belöning','något man får för att man gjort något bra']]
};
window.UPPDRAG_CH3_CONTENT={
 facts,runs,explanations,vocabulary,
 chapterTitle:'Krig eller fred?',sources:'Grundboken s. 70–74 · Arbetsboken 8–10',
 chapterTwoKey:'uppdrag1700.ch2-real-world.20261019.v1',
 chapterOneKey:'uppdrag1700.ch1-real-world.20261019.v11'
};
})();