// A read-only route through the actual job phases. The book, carried objects
// and reminder dialogue share this view; none of them advances the game.
import {PLACES, LEVEL_NAMES} from '../world/content.mjs?v=0.6.17-enter';

export const personName = place => ({cafe:'Maja',print:'Brita',archive:'Rut',quay:'Jo',garden:'Sam',farm:'Karin'}[place] || PLACES[place]?.npc || 'Berättaren');
export const placeName = place => place === 'garden' ? 'Vetenskapens hus' : PLACES[place]?.name || 'staden';
const lower = text => text ? text[0].toLocaleLowerCase('sv') + text.slice(1) : '';
const at = place => ['quay','marstrand','colony'].includes(place) ? 'vid ' + placeName(place).toLocaleLowerCase('sv') : 'i ' + placeName(place).toLocaleLowerCase('sv');
const item = (value, fallback) => ({...fallback, ...(value || {})});
const upper = text => text ? text[0].toLocaleUpperCase('sv') + text.slice(1) : '';
function pickedItem(stop) {
  // Prefer the object actually handed over in the speech. A stop's action
  // label can already describe the following errand ("Hämta ... hos Jo").
  const text = stop.text || '';
  let name = text.match(/^Här (?:är|finns) ([^.!?]+)[.!?]/)?.[1]
    || text.match(/(?:^|[.!?]\s+)Ta(?: med)? ([^.!?]+?) till /)?.[1];
  if (name && /^(?:vårt|vår|min|mitt)\b/i.test(name)) {
    name = stop.label?.match(/^Ta(?: med| emot)? (.+)$/)?.[1] || name;
  }
  name = upper(name || 'Underlaget från ' + personName(stop.place));
  const icon = /kart/i.test(name) ? 'map' : /beställning|besked|brev/i.test(name) ? 'letter' : 'paper';
  return {icon, name, description:'Hämtat hos ' + personName(stop.place) + ' ' + at(stop.place) + '.', place:stop.place};
}

export function createQuestGuide(engine) {
  const chapter = engine.current(), active = engine.active(), done = engine.progress().done;
  const level = engine.level(), job = level.job || {};
  const phase = active?.phase || (done === 3 ? 'complete' : 'offer');
  const outcome = item(job.parcel, {icon:'paper', name:level.artifact, description:'Till ' + personName(level.recipient) + ' ' + at(level.recipient) + '.'});
  const order = item(job.order, {icon:'letter', name:'Beställningen från ' + personName(level.giver), description:level.request});
  const steps = [];
  const add = (id, stepPhase, place, label, detail) => steps.push({id, phase:stepPhase, place, person:personName(place), location:placeName(place), label, detail});
  add('offer', 'offer', level.giver, 'Ta beställningen', order.name);
  level.pickups.forEach((stop, index) => add('pickup-' + index, 'pickup', stop.place, stop.label || 'Hämta underlaget', stop.text));
  add('work', 'work', level.work, job.workLabel || 'Gör arbetet hos ' + personName(level.work), job.desk || 'Pröva vad du minns från avsnittet.');
  if (level.materials) add('materials', 'materials', 'print', 'Gör ett provtryck', 'Lägg svärta, papper och typer i pressen.');
  if (level.puzzle) add('puzzle', 'puzzle', level.work, 'Jämför kartorna', 'Hitta rätt plats med hjälp av kartorna och det du minns.');
  level.handoffs.forEach((stop, index) => add('handoff-' + index, 'handoff', stop.place, stop.label || 'Visa arbetet', stop.text));
  add('deliver', 'deliver', level.recipient, 'Lämna ' + lower(outcome.name), 'Ge ' + lower(outcome.name) + ' till ' + personName(level.recipient) + '.');
  const key = phase === 'pickup' ? 'pickup-' + active.pickup : phase === 'handoff' ? 'handoff-' + active.handoff : phase;
  const position = phase === 'complete' ? steps.length : Math.max(0, steps.findIndex(step => step.id === key));
  steps.forEach((step, index) => { step.status = index < position ? 'complete' : index === position ? 'current' : 'upcoming'; });
  const next = position < steps.length ? {...steps[position]} : null;
  if (next && phase === 'work') {
    next.detail = active?.quiz
      ? 'Fortsätt där du slutade: fråga ' + (active.quiz.index + 1) + ' av ' + active.quiz.ids.length + '.'
      : 'Du väljer själv när du börjar. Pröva vad du minns i ' + level.ids.length + ' ' + (level.ids.length === 1 ? 'uppgift' : 'uppgifter') + '.';
    steps[position].detail = next.detail;
  }
  let carried = null;
  if (active) {
    if (['pickup','work'].includes(phase)) {
      const collected = level.pickups.slice(0, Math.max(0, active.pickup || 0)).map(pickedItem);
      if (level.carriedFromStart) carried = {...outcome, name:engine.item() || level.artifact, description:level.request, kind:'intermediate'};
      else if (collected.length === 1) carried = {...collected[0], kind:'intermediate', items:collected};
      else if (collected.length > 1) carried = {icon:'paper', name:collected.length + ' hämtade underlag', description:collected.map(part => part.name).join(' · '), kind:'intermediate', items:collected};
      else carried = {...order, kind:'order'};
    }
    else if (phase === 'materials') carried = {icon:'paper', name:'Det kontrollerade tryckmanuset', description:'Ta fram svärta, papper och typer hos Brita. Nästa steg är provtrycket.', kind:'intermediate'};
    else if (level.materials && phase === 'handoff') carried = active.handoff === 0
      ? {icon:'paper', name:'Provtrycket', description:'Visa det för Maja i kaffehuset.', kind:'intermediate'}
      : {icon:'letter', name:'Majas godkännande', description:'Ta det till Brita i tryckeriet, så gör hon upplagan.', kind:'intermediate'};
    else carried = {...outcome, kind:'parcel'};
  }
  const rank = LEVEL_NAMES[level.level - 1];
  const reward = active?.repeat
    ? 'När arbetet är levererat får du 2 daler. Dina tidigare stämplar finns kvar.'
    : 'När ' + personName(level.recipient) + ' har tagit emot leveransen får du ' + rank.toLocaleLowerCase('sv') + 'stämpeln och ' + (level.level + 1) + ' daler.';
  return {
    key:[chapter.id,level.level,phase,active?.pickup || 0,active?.handoff || 0,active?.quiz?.index || 0].join(':'),
    chapter:chapter.id, level:level.level, title:level.title, phase, target:next?.place || null,
    next, steps, completedSteps:position, totalSteps:steps.length, carried, outcome, order, reward,
    questionCount:level.ids.length, rank, repeat:active?.repeat === true
  };
}

export function guideSpeech(engine, place, guide = createQuestGuide(engine)) {
  const level = engine.level(), dialogue = level.job?.dialogue || {};
  const active = engine.active();
  const stepKey = guide.phase === 'pickup' ? 'pickup:' + active.pickup : guide.phase === 'handoff' ? 'handoff:' + active.handoff : guide.phase;
  const written = dialogue.reminders?.[stepKey]?.[place] || dialogue.reminders?.[guide.phase]?.[place];
  if (written) return written;
  if (!guide.next) return engine.current().id === 10
    ? 'Tack för allt du har hjälpt oss med. I uppdragsboken finns din resa och dina färdiga arbeten.'
    : engine.world().unlocked > engine.current().id
      ? 'Nästa del av resan är öppen. Ta fram uppdragsboken när du vill ge dig vidare.'
      : 'Du har gjort klart alla ärenden här. Gå till Rut i arkivet och samla ihop det du minns innan nästa avsnitt.';
  const destination = personName(guide.target) + ' ' + at(guide.target);
  if (place === guide.target) {
    if (guide.phase === 'offer') return level.request;
    if (guide.phase === 'work') return dialogue.workIntro || 'Sätt dig här en stund och hjälp mig med ' + lower(level.artifact) + '. Vi använder det du minns från avsnittet.';
    if (guide.phase === 'deliver') return 'Där är du! Har du med dig ' + lower(guide.outcome.name) + '?';
    return guide.next.detail;
  }
  if (guide.phase === 'offer') return 'Fråga ' + destination + ' om nästa ärende. Ta beställningen först, så vet du vad som behövs.';
  if (guide.phase === 'work') return 'Ta beställningen till ' + destination + '. Där får du hjälp att komma igång med ' + lower(level.title) + '.';
  if (guide.phase === 'deliver') return 'Ta med ' + lower(guide.outcome.name) + ' till ' + destination + '. Det är dit leveransen ska.';
  if (guide.phase === 'pickup') return destination + ' har det du behöver. Hämta det innan du börjar arbeta.';
  if (guide.phase === 'materials') return 'Gå till Brita i tryckeriet med manuset. Hon visar dig hur du får fram provtrycket.';
  if (guide.phase === 'puzzle') return 'Du behöver titta på kartorna hos ' + destination + ' innan du ger dig iväg med leveransen.';
  return 'Ta med ' + lower(guide.carried?.name || guide.outcome.name) + ' till ' + destination + '. Där får du hjälp med nästa steg.';
}
