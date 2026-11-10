/* One outer audio controller survives room and iframe changes. Preferences are
 * device settings, separate from every pupil round and chapter save. */
(function(){
'use strict';
function install({storageKey,getFrame,isReady}){
 const button=document.getElementById('ambientToggle'),slider=document.getElementById('ambientVolume'),value=document.getElementById('ambientVolumeValue'),note=document.getElementById('ambientStatus');
 const text=(element,value)=>{if(element.textContent!==value)element.textContent=value;};
 const render=s=>{
  text(button,s.enabled?(s.active?'Ljud på':'Starta ljud'):'Ljud av');
  button.disabled=!s.supported;button.setAttribute('aria-pressed',String(s.enabled));
  button.title=!s.supported?'Den här webbläsaren saknar stöd för miljöljud.':s.active?'Stäng av miljöljud':'Slå på miljöljud';
  button.setAttribute('aria-label',button.title);
  const percentage=Math.round(s.volume*100);if(Number(slider.value)!==percentage)slider.value=percentage;
  slider.disabled=!s.supported;slider.setAttribute('aria-valuetext',percentage+' procent');text(value,percentage+' %');
  text(note,!s.supported?'Miljöljud stöds inte i den här webbläsaren.':!s.enabled?'Miljöljud är av.':!s.active?'Tryck på Starta ljud för att lyssna.':'Ljuden följer platsen och dämpas när du läser eller samtalar.');
 };
 const engine=window.UPPDRAG_AMBIENT_AUDIO.create({storageKey,onChange:render});
 window.UPPDRAG_AMBIENT=engine;
 button.addEventListener('click',async()=>{const s=engine.status();if(s.active)await engine.setEnabled(false);else await engine.setEnabled(true);render(engine.status());});
 slider.addEventListener('input',()=>{engine.setVolume(Number(slider.value)/100);void engine.gesture();});
 function poll(){
  try{
   const reader=isReady()&&getFrame()?.contentWindow?.UPPDRAG_AMBIENCE_STATE;
   engine.setScene(typeof reader==='function'?reader():{scene:'quiet',visible:false,walking:false,study:false,dialogue:false,narration:false});
  }catch{engine.setScene({scene:'quiet',visible:false,walking:false});}
 }
 let timer=null;
 function stop(){if(timer!==null){clearInterval(timer);timer=null;}}
 function start(){if(!document.hidden&&timer===null)timer=setInterval(poll,180);poll();}
 function visibility(){if(document.hidden)stop();else start();}
 window.addEventListener('pagehide',stop);window.addEventListener('pageshow',start);document.addEventListener('visibilitychange',visibility);
 const dispose=engine.dispose;
 engine.dispose=()=>{stop();window.removeEventListener('pagehide',stop);window.removeEventListener('pageshow',start);document.removeEventListener('visibilitychange',visibility);dispose();};
 render(engine.status());start();return engine;
}
window.UPPDRAG_AMBIENT_UI={install};
})();
