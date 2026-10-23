/* Extend the frozen chapter-five engine, not any existing save or question.
 * All replacements fail loudly if the versioned base no longer matches. */
(function(){'use strict';
const replace=(s,a,b)=>{if(!s.includes(a))throw Error('Kapitel 6: grundkoden matchar inte '+a.slice(0,60));return s.replace(a,b);};
async function build(source,get){
 const extra={},base=await source('chapter5-pilot.html');
 let html=base.replaceAll('Kapitel 5','Kapitel 6').replaceAll('KAPITEL 5','KAPITEL 6').replaceAll('Gustavianska tiden','Livet på landet och i staden').replaceAll('GUSTAVIANSKA TIDEN','LIVET PÅ LANDET OCH I STADEN').replaceAll('chapter5Gate','chapter6Gate').replaceAll('chapter5Locked','chapter6Locked').replaceAll('chapter5Preview','chapter6Preview');
 html=html.replaceAll('kapitel 4','kapitel 5').replaceAll('Kapitel 4</a>','Kapitel 5</a>').replaceAll('chapter4-pilot.html','chapter5-pilot.html').replace("const prior='uppdrag1700.ch4-real-world.20261020.v1'","const prior='uppdrag1700.ch5-real-world.20261020.v1'");
 for(const name of ['meeting-ch5-pilot','world-life-ch5','world-keyboard-ch5','chapter5-pilot','chapter5-street-life']){
  const target=name.replace('ch5','ch6').replace('chapter5','chapter6');
  html=html.replaceAll(name+'.js',target+'.js');
  if(name!=='chapter5-pilot')extra[target+'.js']=(await source(name+'.js')).replaceAll('UPPDRAG_CH5_PILOT','UPPDRAG_CH6_PILOT').replaceAll('UPPDRAG_CH5_CITY_LIFE','UPPDRAG_CH6_CITY_LIFE');
 }
 html=replace(html,'<script src="recall-flow.js', '<script src="chapter6-content.js?v=1.1.0"></script>\n<script src="recall-flow.js');
 html=replace(html,'</body>','<script src="chapter6-world.js?v=1.1.0"></script>\n</body>');
 extra['chapter6-pilot.html']=html;
 let pilot=await source('chapter5-pilot.js');
 pilot=pilot.replaceAll('UPPDRAG_CH5_PILOT','UPPDRAG_CH6_PILOT').replace('const CONTENT=window.UPPDRAG_CH5_CONTENT','const CONTENT=window.UPPDRAG_CH6_CONTENT').replace("const storage='uppdrag1700.ch5-real-world.20261020.v1'","const storage='uppdrag1700.ch6-real-world.20261023.v1'");
 pilot=replace(pilot,'const previous=previous4.complete?',"let previous5={};try{previous5=JSON.parse(localStorage.getItem(CONTENT.chapterFiveKey)||'{}')||{}}catch{}\nconst previous=previous5.complete?previous5:previous4.complete?");
 pilot=replace(pilot,'...window.UPPDRAG_CH4_CONTENT.facts};','...window.UPPDRAG_CH4_CONTENT.facts,...window.UPPDRAG_CH5_CONTENT.facts};');
 pilot=replace(pilot,"const paths={cafe:","const paths={farm:'Byn',workshop:'Verkstäderna',cafe:");
 pilot=replace(pilot,'window.UPPDRAG_RECALL_ENGINE.prepare(5,facts,runs);','window.UPPDRAG_RECALL_ENGINE.prepare(6,facts,runs);\nfor(const r of runs)if(r.storyHello)r.hello=r.storyHello;');
 pilot=replace(pilot,'const current=()=>runs[s.step]','const current=()=>s.deliveryReady?CONTENT.delivery:runs[s.step]');
 pilot=replace(pilot,"const location=()=>!interior?'':","const location=()=>!interior?'':interior.kind==='farm'?'farm':interior.kind==='workshop'?'workshop':");
 pilot=replace(pilot,"function majaProblem(){return 'Ett nytt kungligt besked har kommit. Elin i Riksdagshuset jämför det gamla protokollet med det nya. Kan du hjälpa henne?';}",'function majaProblem(){return CONTENT.intro;}');
 pilot=replace(pilot,'function stageSolved(){if(recallEngine)', 'function stageSolved(){if(s.deliveryReady)return true;if(recallEngine)');
 pilot=replace(pilot,'function enterMemory(){','function enterMemory(){\n if(current().p===\'farm\'&&!s.ch6MapSolved&&window.UPPDRAG_CH6_STORY){window.UPPDRAG_CH6_STORY.openMap();return true;}');
 pilot=replace(pilot,'function advance(){',"function advance(){\n if(s.deliveryReady){if(location()!=='cafe')return false;s.deliveryReady=false;s.complete=true;s.mode='finished';persist();drawHud();open=true;modal.hidden=false;document.body.classList.add('ch1-open');drawModal();return true;}");
 pilot=replace(pilot,"if(s.step===runs.length-1){s.complete=true;s.mode='finished';persist();drawHud();open=true;modal.hidden=false;document.body.classList.add('ch1-open');drawModal();return}","if(s.step===runs.length-1){s.deliveryReady=true;s.mode='end';persist();closePanel();drawHud();go();return true;}");
 pilot=replace(pilot,'chapter:5,state:', 'chapter:6,state:');
 pilot=replace(pilot,'"4": "uppdrag1700.ch4-real-world.20261020.v1"}', '"4": "uppdrag1700.ch4-real-world.20261020.v1", "5":"uppdrag1700.ch5-real-world.20261020.v1"}');
 pilot=pilot.replaceAll('Gustavianska tiden','Livet på landet och i staden').replaceAll('GUSTAVIANSKA TIDEN · KAPITEL 5','LIVET PÅ LANDET OCH I STADEN · KAPITEL 6').replaceAll('kapitel 5','kapitel 6').replaceAll('Kapitel 5','Kapitel 6');
 pilot=replace(pilot,'Du har hjälpt Maja, Elin, Amira, Brita och Olof att minnas.','Brevet kom fram till Sigrid. Sidan med röster från landet och staden finns nu i Majas bok. Kapitel 7 är nästa del och återstår att bygga.');
 // Replaying this chapter must not reset the independent chapter-five side story.
 pilot=replace(pilot,'window.UPPDRAG_CH5_LETTER?.reset?.();','');
 pilot=replace(pilot,'get recall(){return recallEngine}',"persist,close:closePanel,refresh:drawHud,current,advance,get recall(){return recallEngine}");
 extra['chapter6-pilot.js']=pilot;
 let meeting=extra['meeting-ch6-pilot.js'];
 meeting=replace(meeting,'Maja, vad är det för nya besked på anslagstavlan?','Maja, varför ligger det ett brev här?');
 meeting=replace(meeting,'Kungen har förändrat vem som får bestämma. Elin i Riksdagshuset har två olika protokoll.','Ett bud kom tillbaka. Adressen till gården stämmer inte längre.');
 meeting=meeting.replaceAll('Sigrids potatisprover','Sigrids bykartor').replaceAll('Här på gården undersöker vi allt man kan göra med potatisen.','Min gård har flyttats. På kartorna kan vi följa vad som hände med åkrarna.');
 // Per-visit speech should belong to this chapter and retain each actual host.
 const a=meeting.indexOf('  function memoryPrelude('),b=meeting.indexOf('  function startTalk()',a);
 if(a<0||b<0)throw Error('Kapitel 6 saknar samtalsankare.');
 meeting=meeting.slice(0,a)+`  function memoryPrelude(place){const who=current()?.cast?.name||'En vän';return [['Du','Hej! Jag kommer med anteckningarna till stadens bok.'],[who,'Välkommen. Vi tar en sak i taget.']];}
  function memoryAfter(place){const who=current()?.cast?.name||'En vän';return [[who,window.UPPDRAG_CH6_PILOT.memoryThanks()]];}
`+meeting.slice(b);
 meeting=meeting.replace("['cafe','riksdag','palace','print','church'].includes(c.key)","['cafe','riksdag','palace','print','church','farm','workshop'].includes(c.key)");
 meeting=meeting.replace("[c.cast.name,'Åh, hej! Jag har fullt upp just nu. Vi ses snart igen.']","[c.cast.name,window.UPPDRAG_CH6_STORY?.direction()||'Vi ses snart igen.']");
 extra['meeting-ch6-pilot.js']=meeting;
 // Add source-grounded everyday voices; reuse the existing walking/rendering code.
 let street=extra['chapter6-street-life.js'];
 const needle='let active=null,teaser=null';
 street=replace(street,needle,`// Fictional chapter-six voices, not historical quotations.
 delete CAST.linne;delete CAST.ekeblad;
 Object.assign(CAST.grower,{name:'Sigrids bror',lines:[['Bonden','Brevet är till min syster Sigrid. Hon bor vid sin jord nu.'],['Du','Hur hittar jag dit?'],['Bonden','Maja har brevet. Ta det till Byn och jämför kartorna.']]});
 Object.assign(CAST.child,{name:'Ett arbetande barn · fiktiv',lines:[['Barnet','Jag blir trött efter arbetet i fabriken.'],['Du','Varför arbetar barn där?'],['Barnet','Min familj behöver pengar. Alla barn har inte valt arbetet själva.']]});
 Object.assign(CAST.washer,{name:'En latrintömmerska · fiktiv',lines:[['Latrintömmerskan','Jag ska hämta och tömma dasstunnorna.'],['Du','Är det tungt?'],['Latrintömmerskan','Ja. Vår stad behöver arbetet, men de fina herrarna talar sällan om oss.']]});
 Object.assign(CAST.book,{lines:[['Bokhandlaren','På den nya sidan ska även kvinnors röster få plats.'],['Du','Var hittar jag texterna?'],['Bokhandlaren','Brita arbetar med dem i Tryckeriet.']]});
 `+needle);
 street=replace(street,'function story(actor){',`function story(actor){
 if(actor.id==='grower'&&window.UPPDRAG_CH6_PILOT?.state.ch6MapSolved)return [['Bonden','Tack, brevet kom fram till Sigrid.'],['Bonden',window.UPPDRAG_CH6_STORY?.direction()||'Maja samlar berättelserna i stadens bok.']];`);
 extra['chapter6-street-life.js']=street;
 extra['chapter6-content.js']=await get('chapter6-content.js?v=1.1.0');
 extra['chapter6-world.js']=await get('chapter6-world.js?v=1.1.0');
 return extra;
}
window.UPPDRAG_CH6_BUILD={build,version:'1.1.0'};
})();
