// Same short-answer rules as the first game, including spelling tolerance.
export const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
function distance(a,b){const row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let prior=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const temp=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,prior+(a[i-1]!==b[j-1]));prior=temp}}return row[b.length]}
export function gradeShort(q,value){
 const raw=normalize(value);if(!raw||/\b(inte|ej|aldrig|not)\b/.test(raw))return false;
 if(q.kind==='company-purpose')return !/\b(krig|erovra)\b/.test(raw)&&/\b(handel|handla|handlade|kopa|kopte|importera|importerade|hamta|hamtade|frakta|fraktade)\b/.test(raw)&&(/\bkina\b/.test(raw)||['te','siden','porslin'].filter(w=>new RegExp('\\b'+w+'\\b').test(raw)).length>=2);
 const candidates=q.accept.map(normalize);if(candidates.includes(raw))return true;
 const clean=raw.replace(/^(det (ar|heter|kallas)|svaret ar|jag tror (att )?(det ar )?|ar|namnet ar|de hette) /,'');
 if(candidates.includes(clean))return true;if(/^\d+$/.test(clean))return false;
 const allowance=clean.length>=11?2:clean.length>=6?1:0;
 return !!allowance&&candidates.some(a=>a.length>=6&&!/\d/.test(a)&&distance(a,clean)<=allowance);
}
export function grade(q,value){return q.type==='chain'?Array.isArray(value)&&value.length===q.steps.length&&q.steps.every((s,i)=>s.answer===value[i]):gradeShort(q,value)}
export function shuffle(values,rng=Math.random){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export function choicesFor(q,cards,rng=Math.random){
 if(q.type!=='short')return[];
 const dates=/^\d+$/.test(q.answer),pool=[...(q.distractors||[]),...cards.filter(c=>c.type==='short'&&c.missionId===q.missionId&&/^\d+$/.test(c.answer)===dates).map(c=>c.answer),...cards.filter(c=>c.type==='short'&&/^\d+$/.test(c.answer)===dates).map(c=>c.answer)];
 const unique=[...new Set(pool)].filter(x=>!gradeShort(q,x)&&x!=='Vet inte');
 return shuffle([q.answer,...shuffle(unique,rng).slice(0,2)],rng);
}
export function csvCell(value){let s=String(value??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
