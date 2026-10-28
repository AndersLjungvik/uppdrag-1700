/* Explicit hooks into the frozen recall engine. Chapters 1 and 2 opt in.
 * Keep the question bank, assessment rubrics, reading support and Rut renderer.
 */
(function(){
'use strict';
function source(text){
 const edit=(before,after)=>{
  if(text.split(before).length!==2)throw Error('Minnesproven: ankaret matchar inte '+before.slice(0,65));
  text=text.replace(before,after);
 };
 edit("  const s=state(),t=byId.get(id);", "  if(b.mastery)return b.mastery.hasPassed(id);\n  const s=state(),t=byId.get(id);");
 edit(" function available(){\n  const s=state(),known=new Set();", " function available(){\n  if(b.mastery)return b.mastery.available();\n  const s=state(),known=new Set();");
 edit("  const t=effectiveTask(),u=ui();if(!t||!u)return false;", "  if(!isDrill()&&b.mastery?.renderStatus())return true;\n  const t=effectiveTask(),u=ui();if(!t||!u)return false;\n  if(!isDrill())b.mastery?.encountered(t.id);");
 edit("   s.record.push(entry);", "   s.record.push(entry);\n   b.mastery?.recorded(entry);");
 edit("  e?.preventDefault();const name=act.slice(3),s=state();ensure();", "  e?.preventDefault();const name=act.slice(3),s=state();ensure();\n  if(!isDrill()&&b.mastery?.action(name))return true;");
 edit("  }else if(name==='save-review'&&u.phase==='review'){", "  }else if(name==='save-review'&&u.phase==='review'){\n   if(b.mastery){b.mastery.pending(t,u);render();return true;}");
 edit("  if(!isDrill()&&t.rank<2&&!u.hint)", "  if(!isDrill()&&t.rank===0&&!u.hint)");
 edit("!u.hint&&!isDrill()&&t.rank<2)", "!u.hint&&!isDrill()&&t.rank===0)");
 edit("   if(s.daler>=1){s.daler--;u.hint=true;s.hint=true;save();b.drawHud();render();}", "   if(b.mastery?b.mastery.hint():s.daler>=1){if(!b.mastery)s.daler--;u.hint=true;s.hint=true;save();b.drawHud();render();}");
 return text;
}
window.UPPDRAG_MASTERY_RECALL={source};
})();
