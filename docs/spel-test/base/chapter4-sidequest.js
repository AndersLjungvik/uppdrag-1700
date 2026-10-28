/* Chapter four: optional blue-portrait vignettes and the book-delivery feast.
 * These stories are not assessment, do not use currency, do not unlock chapters,
 * and never mutate the chapter 4 recall state.
 * Historical dialogue is a clearly dramatized reconstruction, not a quotation.
 */
(function(){
'use strict';
const KEY='uppdrag1700.ch4-cajsa-cookbook.20261020.v1';
const VALID=['unfound','carrying','delivered','feast'];
let save={version:1,phase:'unfound',leftHome:false};
try{
  const raw=JSON.parse(localStorage.getItem(KEY)||'null');
  if(raw?.version===1&&VALID.includes(raw.phase)){
    save={version:1,phase:raw.phase,leftHome:!!raw.leftHome};
  }
}catch{}
let lastRoom=null;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(save));}catch{}}
const book='Hjelpreda i hushållningen för unga fruentimber';
function lines(room){
  if(room==='barnhus')return {who:'Cajsa Warg',lines:[
    ['Du','Vad gör du vid Barnhuset?'],
    ['Cajsa Warg','Jag är på besök och visar hur man kan planera ett kök. Det finns så mycket att hålla reda på.'],
    ['Du','Har du skrivit en bok om matlagning?'],
    ['Cajsa Warg','Ja, år 1755 kom min hushållsbok ut. Där finns många recept och råd för den som sköter maten.'],
    ['Cajsa Warg','Jag har arbetat i stora hushåll. Här är jag bara en gäst i vår berättelse.'],
    ['Du','Vad ska man göra om man vill pröva ett recept?'],
    ['Cajsa Warg','Brita vid tryckeriet har fått ett exemplar. Någon i bostadskvarteren skulle säkert bli glad över det.']
  ],action:null};
  if(room==='print'){
    if(save.phase==='unfound')return {who:'Brita',lines:[
      ['Du','Brita, har du någon bok om matlagning?'],
      ['Brita','Javisst. Här ligger Cajsa Wargs '+book+'.'],
      ['Du','En hel bok med recept!'],
      ['Brita','Den är tryckt, inbunden och klar. Kan du lämna den till den unga hushållerskan i Bostadskvarteren?'],
      ['Du','Det låter som en rolig liten omväg.']
    ],action:'take',label:'Lägg kokboken i packningen'};
    if(save.phase==='carrying')return {who:'Brita',lines:[
      ['Brita','Du har kokboken i packningen. Den ska till hushållerskan i Bostadskvarteren.']
    ],action:null};
    return {who:'Brita',lines:[
      ['Brita','Vad bra att boken kom fram. Nu kan den användas i stället för att bara ligga på mitt bord.']
    ],action:null};
  }
  if(room==='homes'){
    if(save.phase==='unfound')return {who:'Karin',lines:[
      ['Karin','Välkommen! Jag försöker ordna en liten måltid för grannarna.'],
      ['Du','Vad ska du laga?'],
      ['Karin','Jag har hört talas om Cajsa Wargs nya bok. Kan du fråga efter den hos Brita i Tryckeriet?'],
      ['Du','Jag går dit och ser om den finns.']
    ],action:null};
    if(save.phase==='carrying')return {who:'Karin',lines:[
      ['Karin','Är det en bok du bär på?'],
      ['Du','Ja, Cajsa Wargs '+book+'.'],
      ['Karin','Äntligen! Nu kan jag följa råden och laga maten ordentligt.'],
      ['Du','Här får du kokboken.']
    ],action:'deliver',label:'Lämna kokboken till Karin'};
    if(save.phase==='delivered')return {who:'Karin',lines:[
      ['Karin','Tack för boken. Jag behöver tid att ordna mat, bord och alla gäster.'],
      ['Karin','Kom tillbaka när du har varit ute på stan en stund. Då får du se vad det blev.']
    ],action:null};
    return {who:'Karin',lines:[
      ['Karin','Å, där är du! Välkommen till vår lilla fest!'],
      ['Du','Så många människor och så mycket mat!'],
      ['Karin','Jag följde recepten i Cajsa Wargs kokbok. Nu smakar vi tillsammans!'],
      ['En gäst','Här finns soppa, bröd och en fin stek!'],
      ['En annan gäst','Och kakan! Glöm inte kakan!'],
      ['Karin','Tack för att du hämtade boken. Du gjorde den här kvällen möjlig.']
    ],action:null};
  }
  return null;
}
function accept(action){
  if(action==='take'&&save.phase==='unfound'){
    save.phase='carrying';persist();return true;
  }
  if(action==='deliver'&&save.phase==='carrying'){
    save.phase='delivered';save.leftHome=false;persist();return true;
  }
  return false;
}
function tick(){
  const room=document.body?.dataset?.room||null;
  if(save.phase==='delivered'&&room!=='homes'&&!save.leftHome){
    // Leaving the household is essential; clicking inside twice cannot start
    // the party and the party does not appear on the delivery visit.
    if(lastRoom==='homes'){
      save.leftHome=true;persist();
    }else if(lastRoom===null&&room===null){
      // After reload, the initial location is the street. A previously
      // delivered book can be followed by a fresh visit.
      save.leftHome=true;persist();
    }
  }
  if(save.phase==='delivered'&&save.leftHome&&room==='homes'&&lastRoom!=='homes'){
    save.phase='feast';persist();
    if(typeof renderInterior==='function')renderInterior();
  }
  lastRoom=room;
}
function reset(){
  save={version:1,phase:'unfound',leftHome:false};
  lastRoom=null;persist();return true;
}
window.UPPDRAG_CH4_SIDEQUEST={
  get phase(){return save.phase;},
  get hasBook(){return save.phase==='carrying';},
  get party(){return save.phase==='feast';},
  get leftHome(){return save.leftHome;},
  get bookTitle(){return book;},
  dialogueFor:lines,accept,tick,reset,saveKey:KEY,
  // Testing hook reads a snapshot, never a mutable reference.
  snapshot(){return {...save};}
};
})();