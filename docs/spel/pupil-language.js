/* Short instructions for pupils working on their own in chapter 1.
 * Applied after prompt alignment. This changes display text only: no question
 * prompts, answer fields, criteria, scoring rules or progress are rewritten.
 */
(function(){
'use strict';
const edits=[
 ['Kontrollera svaren i rutorna','Titta på ditt svar igen'],
 ['Jämför varje ruta med det som efterfrågas där. Ett kortsvar ska inte behöva byggas ut till en förklaring.','Läs frågan igen. Jämför ditt svar med exemplet. Du får använda egna ord.'],
 ['Detta är en försiktig regelkontroll. Ett riktigt svar kan vara formulerat på ett annat sätt. Osäkra formuleringar ger inget avdrag och kan visas för läraren.','Spelet är osäkert på ditt svar. Det kan ändå vara rätt. Jämför med exemplet eller visa din lärare.'],
 ['Att läsa exemplet är träning. Ett självständigt svar ska senare ges utan exemplet. En fråga om ett namn eller en vara kräver fortfarande bara den uppgiften.','Du får läsa exemplet när du övar. På mästarnivån behöver du sedan svara utan hjälp. Om frågan ber om ett namn eller en vara räcker det.'],
 ['Innehållskraven känns igen','Bra! Du fick med det som frågan ber om.'],
 ['Kortsvar kontrollerat','Ditt svar stämmer.'],
 ['Det här behöver övas','Det här behöver du öva på'],
 ['Förklaringen är inte automatiskt validerad. Ditt svar finns kvar i träningsloggen.','Spelet har inte godkänt svaret. Ditt svar är sparat så att du kan öva vidare.'],
 ['Detta svar är tränat med stöd. Det är sparat, men räknas inte som en självständig mästarförklaring.','Du har fått hjälp med svaret. För en mästarstämpel behöver du sedan svara utan hjälp.'],
 ['Skriv ett innehållsligt svar. En punkt eller andra tecken räcker inte. Välj ”Jag minns inte” för hjälp.','Skriv ett svar på frågan. Om du inte minns, välj ”Jag minns inte”.'],
 ['Bearbeta mitt svar','Ändra mitt svar'],
 ['Spara för lärargranskning','Spara och visa läraren'],
 ['Korta svar räcker. Uppläsning finns på alla nivåer. Enter skickar ett kortsvar; Ctrl + Enter skickar en längre text.','Korta svar räcker. Du kan lyssna på frågan. Enter skickar ett kort svar. Ctrl + Enter skickar en längre text.'],
 ['Du har återgett minnen utan en lista med svar. Rut ger dig ett äpple.','Du svarade rätt på övningsfrågorna. Du får ett äpple.'],
 ['Ett annat minne emellan','Öva på en annan fråga'],
 ['Uppläsning är inte tillgänglig i den här webbläsaren.','Det går inte att lyssna på frågan i den här webbläsaren.']
];
// These are display labels only. The assessment keeps its original labels,
// which are also used to select several content checks.
const criteria={
 'Förklara att regentens envälde upphörde.':'Förklara vad som hände med regentens envälde.',
 'Ange vilka som fick mer makt.':'Skriv vilka som fick mer makt.',
 'Visa varför regenten inte kunde bestämma ensam.':'Förklara varför regenten inte kunde bestämma ensam.',
 'Ange riksdagens eller riksrådets roll.':'Förklara vad riksdagen eller riksrådet fick bestämma.',
 'Ge ett riktigt varuexempel.':'Ge ett exempel på en vara.',
 'Beskriv styrning eller maktfördelning.':'Beskriv hur landet styrdes eller hur makten delades.',
 'Beskriv vad grundlagen reglerade.':'Beskriv vilka regler som fanns i grundlagen.',
 'Ange kravet på enighet i riksdagen enligt texten.':'Skriv vilka som behövde vara överens för att ändra grundlagen.',
 'Ge ett konkret exempel på ojämlikt inflytande.':'Ge ett exempel på att stånden inte fick bestämma lika mycket.',
 'Skriv ett innehållsligt svar, inte bara tecken.':'Skriv ett svar på frågan.',
 'En uppgift i svaret strider mot innehållet. Jämför sakuppgifterna, inte bara orden.':'Något i svaret verkar inte stämma. Läs frågan och jämför med exemplet.',
 'Förklaringen behöver granskas.':'Visa din förklaring för läraren.',
 'Knyt ihop uppgifterna till en kort förklaring. Bara en lista med nyckelord räcker inte här.':'Skriv en kort förklaring där uppgifterna hänger ihop. Här behöver du skriva mer än enstaka ord.',
 'Här finns en uppgift som motsäger innehållet. Kontrollera vem som fick bestämma och vilka villkor som gällde.':'Något i svaret verkar inte stämma. Kontrollera vem som fick bestämma och vilka regler som gällde.'
};
const criterion=label=>Object.hasOwn(criteria,label)?criteria[label]:label;
function flow(source){
 if(typeof source!=='string')throw Error('Elevspråket behöver frågemotorns text.');
 let text=source;
 for(const [before,after]of edits){
  if(text.split(before).length!==2)throw Error('Elevspråket: texten matchar inte '+before.slice(0,75));
  text=text.replace(before,after);
 }
 const marker='escape(d.label)';
 if(text.split(marker).length!==2)throw Error('Elevspråket: återkopplingens text matchar inte.');
 return text.replace(marker,'escape(window.UPPDRAG_PUPIL_LANGUAGE.criterion(d.label))');
}
window.UPPDRAG_PUPIL_LANGUAGE={flow,criterion,version:'1.0.0'};
})();
