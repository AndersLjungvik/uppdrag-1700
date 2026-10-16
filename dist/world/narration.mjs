// Optional device speech. No generated audio, account or microphone is required.
export function createNarrator({synth, Utterance, onState=()=>{}, onIssue=()=>{}}={}) {
  const available=!!(synth&&typeof synth.speak==='function'&&typeof synth.cancel==='function'&&typeof Utterance==='function');
  let enabled=false, speaking=false, generation=0, current=null;
  function stop() {
    generation++;
    current=null;
    speaking=false;
    onState({speaking:false, character:null});
    if(available)try{synth.cancel()}catch{}
  }
  function read(text, character=null) {
    stop();
    const value=String(text||'').trim();
    if(!available||!enabled||!value)return false;
    const id=generation;
    try {
      const voices=typeof synth.getVoices==='function'?synth.getVoices():[];
      const swedish=voices.filter(v=>/^sv(?:[-_]|$)/i.test(v.lang));
      if(voices.length&&!swedish.length){onIssue('no-swedish-voice');return false}
      const utterance=new Utterance(value);
      current=utterance;
      utterance.lang='sv-SE';
      utterance.rate=.94;
      utterance.pitch=1;
      if(swedish.length)utterance.voice=swedish.find(v=>v.localService)||swedish.find(v=>v.default)||swedish[0];
      const active=()=>id===generation&&current===utterance;
      utterance.onstart=()=>{if(active()){speaking=true;onState({speaking:true,character})}};
      utterance.onpause=()=>{if(active()){speaking=false;onState({speaking:false,character})}};
      utterance.onresume=utterance.onstart;
      const finish=()=>{if(!active())return false;current=null;speaking=false;onState({speaking:false,character:null});return true};
      utterance.onend=finish;
      utterance.onerror=event=>{if(finish()&&!['canceled','interrupted'].includes(event?.error))onIssue(event?.error||'speech-error')};
      synth.speak(utterance);
      return true;
    } catch {
      if(id===generation){current=null;speaking=false;onState({speaking:false,character:null});onIssue('speech-error')}
      return false;
    }
  }
  // Browsers may populate voices after page load; refresh their list for every request.
  if(available)try{synth.getVoices?.()}catch{}
  return {
    available,
    get enabled(){return enabled},
    get speaking(){return speaking},
    setEnabled(value){enabled=available&&!!value;if(!enabled)stop();return enabled},
    read,
    stop
  };
}
