/* Demo 3.17: arrows walk through the existing world, Space meets its people.
 * The main animation owns time: call tick(dt), with dt in seconds, before the
 * click-route step. Pass motionPath to the existing map-player painter while
 * moving. No extra animation loop, visual elements or saved-game state.
 */
(function () {
  'use strict';
  const SPEED=180,RADIUS=24,EPS=.0001,STEP=3;
  const arrows=new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
  const held=new Set();
  let moving=false,vector={x:0,y:0},manualNotified=false,spaceHeld=false;

  function finitePoint(p){return !!p&&Number.isFinite(p.x)&&Number.isFinite(p.y);}
  function inWater(r,x,y){return waterAt(r,x,y);}
  function landAndBounds(r,x,y,radius){
    if(!r||!Number.isFinite(x)||!Number.isFinite(y)||x<radius||y<radius||x>r.w-radius||y>r.h-radius)return false;
    if(inWater(r,x,y))return false;
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      if(inWater(r,x+Math.cos(a)*radius,y+Math.sin(a)*radius))return false;
    }
    return true;
  }
  function penetration(b,x,y,radius){
    if(!inRect(x,y,b,radius))return 0;
    return Math.max(0,Math.min(x-(b.x-radius),b.x+b.w+radius-x,y-(b.y-radius),b.y+b.h+radius-y));
  }
  function walkablePoint(r,x,y,radius=RADIUS){
    return landAndBounds(r,x,y,radius)&&!(r.buildings||[]).some(b=>penetration(b,x,y,radius)>EPS);
  }
  function clearSegment(r,a,b,radius=RADIUS){
    if(!finitePoint(a)||!finitePoint(b))return false;
    const count=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/STEP));
    for(let i=0;i<=count;i++){
      const t=i/count;
      if(!walkablePoint(r,a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,radius))return false;
    }
    return true;
  }
  function escapeStep(r,a,b){
    if(!landAndBounds(r,b.x,b.y,RADIUS))return false;
    // Some original room exits are inside a building's footprint (the colony
    // warehouse, for example). They may leave that overlap, never deepen it.
    for(const house of r.buildings||[]){
      const before=penetration(house,a.x,a.y,RADIUS),after=penetration(house,b.x,b.y,RADIUS);
      if(after>EPS&&(before<=EPS||after>before+EPS))return false;
    }
    return true;
  }

  function editable(target){
    return !!target&&(target.isContentEditable||!!target.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"]'));
  }
  function modified(e){return e.altKey||e.ctrlKey||e.metaKey||e.shiftKey;}
  function visible(element){
    if(!element||element.hidden||element.disabled||element.closest('[hidden],[inert]'))return false;
    const style=getComputedStyle(element);
    return style.display!=='none'&&style.visibility!=='hidden';
  }
  function activeDialogue(){
    return !!(window.UPPDRAG_LIVING_DIALOGUES?.active||window.UPPDRAG_ARCHIVE_PILOT?.busy||window.UPPDRAG_PLACE_THOUGHTS?.busy||window.UPPDRAG_MEETINGS?.state?.talking);
  }
  function blocked(){
    return !!(document.hidden||interior||sailing||voyage||activeDialogue()||editable(document.activeElement));
  }
  function stopMotion(){moving=false;vector={x:0,y:0};}
  function clear(){held.clear();manualNotified=false;spaceHeld=false;stopMotion();}
  function cancelRoute(){
    path=[];pending=null;returnPending=false;pendingRoom=null;
    cancelPersonArrival();drag=null;follow=true;canvas.focus({preventScroll:true});
  }
  function tick(dt){
    stopMotion();
    if(blocked()){held.clear();manualNotified=false;return;}
    if(!held.size)return;
    let dx=(held.has('ArrowRight')?1:0)-(held.has('ArrowLeft')?1:0);
    let dy=(held.has('ArrowDown')?1:0)-(held.has('ArrowUp')?1:0);
    const length=Math.hypot(dx,dy);
    if(!length||!Number.isFinite(dt)||dt<=0)return;
    dx/=length;dy/=length;
    const distance=SPEED*Math.min(.05,dt),steps=Math.max(1,Math.ceil(distance/STEP));
    const sx=dx*distance/steps,sy=dy*distance/steps,start={x:player.x,y:player.y};
    for(let i=0;i<steps;i++){
      const full={x:player.x+sx,y:player.y+sy};
      if(escapeStep(region,player,full)){player.x=full.x;player.y=full.y;continue;}
      // Preserve the requested speed components while sliding along an edge.
      const across={x:player.x+sx,y:player.y};
      if(Math.abs(sx)>EPS&&escapeStep(region,player,across))player.x=across.x;
      const down={x:player.x,y:player.y+sy};
      if(Math.abs(sy)>EPS&&escapeStep(region,player,down))player.y=down.y;
    }
    const mx=player.x-start.x,my=player.y-start.y,travelled=Math.hypot(mx,my);
    if(travelled<=EPS)return;
    moving=true;vector={x:mx/travelled,y:my/travelled};follow=true;
    if(!manualNotified){manualNotified=true;window.UPPDRAG_LIVING_DIALOGUES?.onManualMove?.();}
  }

  function dialogBox(){
    for(const id of ['rutPanel','rutDocuments','placeBubble','meetingDialogue']){
      const box=document.getElementById(id);
      if(visible(box))return box;
    }
    return null;
  }
  function buttonsIn(box){return box?[...box.querySelectorAll('button')].filter(visible):[];}
  function roomButtons(){
    const box=dialogBox();
    if(box)return buttonsIn(box);
    return [document.getElementById('meetingPerson'),document.getElementById('rutPapers'),...document.querySelectorAll('#roomFooter button')].filter(visible);
  }
  function moveRoomFocus(key){
    const buttons=roomButtons();if(!buttons.length)return false;
    const backward=key==='ArrowUp'||key==='ArrowLeft',old=buttons.indexOf(document.activeElement);
    const index=old<0?(backward?buttons.length-1:0):(old+(backward?-1:1)+buttons.length)%buttons.length;
    buttons[index].focus({preventScroll:true});return true;
  }
  function interactRoom(){
    const box=dialogBox();
    if(box){
      const archive=window.UPPDRAG_ARCHIVE_PILOT,place=window.UPPDRAG_PLACE_THOUGHTS,meeting=window.UPPDRAG_MEETINGS;
      if(archive?.state.mode==='speech')return archive.advance();
      if(place?.state.mode==='speech')return place.advance();
      if(meeting?.state.talking)return meeting.advance();
      const next=box.querySelector('[data-action="next"],#meetingNext,[data-action="conclusion"]');
      if(visible(next)){next.click();return true;}
      // A thought or answer is never silently preselected. Space from a heading
      // reaches the choices; the player then chooses with arrows and Space.
      const first=buttonsIn(box)[0];first?.focus({preventScroll:true});return !!first;
    }
    const person=document.getElementById('meetingPerson');
    if(visible(person)){person.click();return true;}
    if(window.UPPDRAG_ARCHIVE_PILOT?.active){window.UPPDRAG_ARCHIVE_PILOT.open();return true;}
    if(window.UPPDRAG_PLACE_THOUGHTS?.active){window.UPPDRAG_PLACE_THOUGHTS.open();return true;}
    const first=roomButtons()[0];first?.focus({preventScroll:true});return !!first;
  }
  function nearby(){
    const candidates=[],distance=p=>Math.hypot(player.x-p.x,player.y-p.y);
    for(const person of window.UPPDRAG_WORLD_LIFE?.people(region)||[]){
      const d=distance(person);
      if(d<=80&&clearSegment(region,player,person,0))candidates.push({distance:d,priority:0,run:()=>requestPerson(person)});
    }
    const port=region.map.get(region.harbor);
    if(port&&distance(port)<=80)candidates.push({distance:distance(port),priority:1,run:()=>requestHarbour()});
    for(const building of region.buildings||[]){
      const entry=region.map.get(building.entry);
      if(entry&&roomKind(building)&&distance(entry)<=80)candidates.push({distance:distance(entry),priority:2,run:()=>requestInterior(building)});
    }
    candidates.sort((a,b)=>a.distance-b.distance||a.priority-b.priority);
    return candidates[0]||null;
  }
  function interact(){
    if(document.hidden||sailing||voyage||editable(document.activeElement))return false;
    held.clear();manualNotified=false;stopMotion();
    if(window.UPPDRAG_LIVING_DIALOGUES?.active){window.UPPDRAG_LIVING_DIALOGUES.close();return true;}
    if(interior)return interactRoom();
    const target=nearby();return target?target.run()!==false:false;
  }

  window.addEventListener('keydown',event=>{
    if(event.defaultPrevented)return;
    if(event.isComposing||modified(event)||editable(event.target)){held.clear();manualNotified=false;stopMotion();return;}
    if(arrows.has(event.key)){
      if(interior){
        held.clear();stopMotion();
        if(!voyage&&!sailing&&moveRoomFocus(event.key)){event.preventDefault();event.stopImmediatePropagation();}
        return;
      }
      event.preventDefault();
      if(blocked()){held.clear();manualNotified=false;stopMotion();return;}
      // A held arrow cleared by a dialogue/blur may not resume as key repeat.
      if(event.repeat&&!held.has(event.key))return;
      if(!held.size){cancelRoute();manualNotified=false;}
      held.add(event.key);return;
    }
    if(event.key!==' '&&event.code!=='Space')return;
    // A previous capture listener may just have closed a dialogue and restored
    // focus to a native person button. Repeats must not arm a new keyup click.
    if(event.repeat){event.preventDefault();return;}
    // A focused native control owns its own keyup click. Room controllers which
    // click on keydown have already consumed the event in earlier capture.
    if(event.target.closest?.('button,a[href],input,select,textarea,[role="button"]'))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(spaceHeld)return;
    spaceHeld=true;interact();
  },true);
  window.addEventListener('keyup',event=>{
    if(arrows.has(event.key)){
      held.delete(event.key);
      if(!held.size){manualNotified=false;stopMotion();}
    }
    if(event.key===' '||event.code==='Space')spaceHeld=false;
  },true);
  window.addEventListener('blur',clear);
  document.addEventListener('visibilitychange',clear);
  window.addEventListener('pointerdown',clear,true);
  document.addEventListener('focusin',event=>{if(editable(event.target))clear();});

  window.UPPDRAG_WORLD_KEYBOARD={
    tick,clear,interact,walkablePoint,clearSegment,
    get moving(){return moving;},
    get vector(){return {...vector};},
    get motionPath(){return moving?[{x:player.x+vector.x*20,y:player.y+vector.y*20}]:null;},
    get state(){return {moving,held:[...held],vector:{...vector}};}
  };
  document.documentElement.dataset.keyboard='ready';
})();
