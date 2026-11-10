/* Dramatized assumptions about dress, not party membership or assessment.
 * Reuse the city's physical meetings, paper speech and walking rules. */
(function(){
'use strict';
const appearance=(wear=window.UPPDRAG_HAT_SHOP?.wear)=>wear?.kind==='cap'?'cap':wear?.kind==='tricorn'?'hat':'plain';
const key=actor=>actor.id+'/'+appearance();
function reaction(actor,wear=window.UPPDRAG_HAT_SHOP?.wear){
 const kind=appearance(wear),id=actor.id,role=actor.role;
 if(role==='dog'||role==='david'||id==='david')return [];
 if(role==='russian'){
  if(kind==='hat')return [['Rysk vakt','En trekantshatt! Vill du också ha krig mot Ryssland?'],['Du','Du kan inte veta vad jag tycker av min hatt.'],['Rysk vakt','Nej. Men allt krigsprat gör mig arg. Inget bråk här!']];
  if(kind==='cap')return [['Rysk vakt','En mössa. Då hoppas jag att du hellre vill ha fred.'],['Du','Jag vill gå förbi i lugn och ro.'],['Rysk vakt','Bra. Då tar vi det lugnt. Gå vidare.']];
  return [];
 }
 if(id==='noble'||id==='orchard-noble'||role==='noble'){
  const line=kind==='hat'?'En fin hatt! Bönderna däremot … de smyger väl hit för att stjäla äpplen.':kind==='cap'?'Mössa igen! Bönder som stjäl … jag får väl vakta vartenda äpple själv.':'Bönder som stjäl … jag får väl vakta vartenda äpple själv!';
  return [['Adelsmannen',line],['Du','Har du sett någon stjäla?'],['Adelsmannen','Inte just nu. Men jag håller uppsikt!']];
 }
 if(kind==='plain')return [];
 if(role==='hat'||id==='hat')return kind==='hat'
  ?[['Hatten','En trekantshatt! Kanske tycker vi lika om rikets framtid?'],['Du','Det får du fråga mig om. Hatten säger inte allt.']]
  :[['Hatten','En mössa? Nu väntar jag mig väl ännu mer tal om fred.'],['Du','Du får lyssna på vad jag säger också.']];
 if(role==='cap'||id==='cap')return kind==='cap'
  ?[['Mössan','En mössa till! Hoppas att du också är trött på krigspratet.'],['Du','Jag vill höra vad folk har att säga.']]
  :[['Mössan','Den hatten får mig att tänka på dem som ropar efter krig.'],['Du','Man kan bära hatt och ändå vilja ha fred.']];
 if(role==='farmer'||id==='farmers')return kind==='cap'
  ?[['Bonden','En mössa som min! Kom och lyssna på vad vi har att säga.'],['Du','Jag lyssnar.']]
  :[['Bonden','Fin hatt. Du tänker väl inte be oss betala för ännu ett krig?'],['Du','Jag har kommit för att lyssna.']];
 if(role==='soldier')return [[actor.name||'Soldaten',kind==='hat'?'Låt inte hatten bli en anledning till bråk här.':'Behåll lugnet, du med mössan.']];
 if(role==='child')return [['Barnet',kind==='hat'?'Oj, din hatt har tre hörn! Får du plats med den överallt?':'Vilken fin mössa! Den ser varm ut.'],['Du',kind==='hat'?'Jag får ducka om dörren är låg.':'Ja, den värmer bra.']];
 if(['smith','porter','baker','sailor','laundry','basket','grower','potato-farmers'].includes(role))return [[actor.name,kind==='hat'?'Fin hatt! Här får man ändå hjälpa till med arbetet.':'En stadig mössa. Den sitter kvar när det blåser.']];
 if(role==='civil'){
  const seed=[...String(actor.sourceId||actor.name||id)].reduce((n,c)=>n+c.charCodeAt(0),0)%3;
  return [[actor.name||'Stadsbon',(kind==='hat'
   ?['Vilken ståtlig hatt! På väg till ett fint besök?','Den hatten syns på långt håll. Akta den för vinden!','Hatten får dig att se förnäm ut. Men vem är du?']
   :['Den mössan ser varm ut. Det behövs på de här gatorna.','En mössa som min! God dag på dig.','Mössan sitter bra. Ska du också till torget?'])[seed]]];
 }
 if(['bookseller','reader','printer','teacher'].includes(role))return [[actor.name,kind==='hat'?'En fin hatt! Men det är orden som säger vad du tänker.':'Mössan värmer huvudet. En god bok ger det något att tänka på.']];
 return [];
}
function story(actor,base,wear){return reaction(actor,wear).concat(base||[]);}
function thought(actor,wear){return reaction(actor,wear)[0]?.[1]||null;}
function paused(){
 const chapter=window.__INTEGRATED_CHAPTER,doc=typeof document==='undefined'?null:document;
 return !!(window.UPPDRAG_HAT_SHOP?.busy||window['UPPDRAG_CH'+chapter+'_PILOT']?.studyBusy||window.UPPDRAG_EVENT_ENGINE?.busy||window.UPPDRAG_APPLE_THREATS?.busy||window.UPPDRAG_ORCHARD?.busy||window.UPPDRAG_STORY_WORK?.busy||window.UPPDRAG_LIVING_DIALOGUES?.active||window.UPPDRAG_MENU_OPEN?.()||doc?.hidden||doc?.querySelector?.('dialog[open],#ch1Modal:not([hidden])'));
}
function people(region){
 if(region?.id!=='main'||window.UPPDRAG_ORCHARD?.busy)return [];
 const orchard=window.UPPDRAG_ORCHARD,g=orchard?.geometry?.(region),s=orchard?.snapshot;
 if(!g||!s||s.retreat)return [];
 return [{...(s.actor||g.home),id:'orchard-noble',name:'Adelsmannen',role:'noble',region:'main',r:28}];
}
function source(name,text){
 if(!/^chapter[345]-street-life\.js$/.test(name))return text;
 const edit=(a,b)=>{if(text.split(a).length!==2)throw Error('Huvudbonadernas möten: ankaret matchar inte '+name+': '+a.slice(0,50));text=text.replace(a,b);};
 edit('function story(actor){','function story(actor){return window.UPPDRAG_HAT_REACTIONS.story(actor,originalStory(actor));}\nfunction originalStory(actor){');
 edit('function shortThought(actor){','function shortThought(actor){\n const reaction=window.UPPDRAG_HAT_REACTIONS.thought(actor);if(reaction)return reaction;');
 edit('return people(region).concat(ambientTargets(region));','return people(region).concat(ambientTargets(region),window.UPPDRAG_HAT_REACTIONS.people(region));');
 edit('return ambientTargets(region).find(a=>a.id===id)||null;','return ambientTargets(region).concat(window.UPPDRAG_HAT_REACTIONS.people(region)).find(a=>a.id===id)||null;');
 edit('const encounterCounts=new Map(),spokenRecently=new Map();','const encounterCounts=new Map(),spokenRecently=new Map();\nlet lastAppearance=window.UPPDRAG_HAT_REACTIONS.appearance();');
 edit('function updateNearby(region,player,now){\n if(!region||!player||active)return;',`function updateNearby(region,player,now){
 if(!region||!player||active)return;
 const appearance=window.UPPDRAG_HAT_REACTIONS.appearance();
 if(lastAppearance!==appearance){stopTeaser(now);lastAppearance=appearance;arrivalCandidate=null;teaserHiddenUntil=now+1200;lastCall=Math.min(lastCall,now-SPONTANEOUS_GAP);}
 if(window.UPPDRAG_HAT_REACTIONS.paused()){stopTeaser(now);arrivalCandidate=null;hideBubble();return;}`);
 edit('spokenRecently.get(wanted.id)','spokenRecently.get(window.UPPDRAG_HAT_REACTIONS.key(wanted))');
 edit('spokenRecently.set(wanted.id,now)','spokenRecently.set(window.UPPDRAG_HAT_REACTIONS.key(wanted),now)');
 edit('spokenRecently.set(speakerActor.id,now)','spokenRecently.set(window.UPPDRAG_HAT_REACTIONS.key(speakerActor),now)');
 return text;
}
window.UPPDRAG_HAT_REACTIONS={appearance,key,reaction,story,thought,paused,people,source,version:'1.0.0'};
})();
