/* Demo 3.13: paper people and quiet animal life on the existing world map.
 * Coordinates, roads, buildings and the game loop remain owned by the world.
 * This layer draws only; it registers no DOM events, timers or animation loop.
 */
'use strict';
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const routeCache = new WeakMap();
  let elapsed = 0;
  let lastNow = null;

  function people(region) {
    if (!region?.map) return [];
    return (window.UPPDRAG_LIVING_CONTENT?.people || [])
      .filter(person => person.region === region.id && region.map.has(person.node))
      .map(person => {
        const node = region.map.get(person.node);
        return {...person, x: node.x + (person.dx || 0), y: node.y + (person.dy || 0)};
      });
  }

  function hit(region, point) {
    if (!point) return null;
    let nearest = null;
    let distance = 29;
    for (const person of people(region)) {
      const d = Math.hypot(point.x - person.x, point.y - (person.y - 3));
      if (d <= distance) { nearest = person; distance = d; }
    }
    return nearest;
  }

  function piece(ctx, points, color, kind = 'piece', edge = .6) {
    ctx.save();
    ctx.beginPath();
    points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath();
    const fibres = window.UPPDRAG_PAPER_FIBRES;
    ctx.fillStyle = fibres?.material(ctx, color, kind) || color;
    ctx.fill();
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    const bounds = {x: Math.min(...xs), y: Math.min(...ys)};
    bounds.w = Math.max(...xs) - bounds.x;
    bounds.h = Math.max(...ys) - bounds.y;
    if (fibres) {
      fibres.finish(ctx, bounds, {kind, edge});
    } else if (kind !== 'detail') {
      // Stable fibres while the original paper material is still loading.
      ctx.clip();
      ctx.globalAlpha *= .16;
      ctx.fillStyle = '#fff7e2';
      const n = Math.min(24, Math.max(3, Math.round(bounds.w * bounds.h / 110)));
      for (let i = 0; i < n; i++) {
        const x = bounds.x + ((i * 47 + 11) % 101) / 101 * bounds.w;
        const y = bounds.y + ((i * 31 + 19) % 97) / 97 * bounds.h;
        ctx.fillRect(x, y, 1 + i % 3, .55);
      }
    }
    ctx.restore();
  }

  function cut(ctx, x, y, w, h, color, kind = 'piece') {
    piece(ctx, [[x+.5,y+.7],[x+w*.52,y],[x+w,y+.4],
      [x+w-.3,y+h],[x+w*.44,y+h-.4],[x,y+h-.2]], color, kind);
  }

  function fleck(ctx, x, y, color = '#443b30', size = 1.2) {
    piece(ctx, [[x-size,y],[x,y-size],[x+size,y+.2],[x+.3,y+size]], color, 'detail', 0);
  }

  function fallbackPerson(ctx, person) {
    ctx.save();
    ctx.translate(person.x, person.y);
    cut(ctx, -8, 9, 6, 14, '#4d473a');
    cut(ctx, 3, 10, 6, 13, '#4d473a');
    cut(ctx, -17, -4, 5, 16, '#c6a778', 'skin');
    cut(ctx, 13, -4, 5, 16, '#c6a778', 'skin');
    piece(ctx, [[-13,-9],[11,-9],[14,11],[7,17],[-11,15]], person.color || '#787761', 'cloth');
    if (person.woman) piece(ctx, [[-12,2],[13,2],[17,20],[-15,20]], person.color || '#787761', 'cloth');
    piece(ctx, [[-8,-20],[4,-23],[10,-16],[9,-7],[-1,-3],[-10,-10]], '#c6a778', 'skin');
    piece(ctx, [[-10,-17],[-5,-23],[6,-23],[11,-16],[5,-14],[-7,-14]],
      person.woman ? '#d6cbb0' : '#66513c', 'cloth');
    ctx.restore();
  }

  function talkMark(ctx, person, named) {
    ctx.save();
    ctx.translate(person.x, person.y);
    piece(ctx, [[10,-32],[27,-32],[29,-22],[20,-21],[15,-16],[15,-22],[10,-23]], '#f0e5cc');
    fleck(ctx, 15,-27,'#766a55',.7);
    fleck(ctx, 19,-27,'#766a55',.7);
    fleck(ctx, 23,-27,'#766a55',.7);
    if (named) {
      ctx.font = 'bold 15px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const name = person.name || person.label || '';
      const width = ctx.measureText(name).width + 16;
      cut(ctx, -width/2, 28, width, 23, '#f1e5ca');
      ctx.fillStyle = '#453c2d';
      ctx.fillText(name, 0, 39);
    }
    ctx.restore();
  }

  function roadRoute(region, nodeIds) {
    const nodes = nodeIds.map(id => region.map.get(id));
    if (nodes.some(node => !node)) return null;
    const segments = [];
    let length = 0;
    for (let i = 1; i < nodes.length; i++) {
      const a = nodes[i-1], b = nodes[i];
      const edge = region.edges.find(e => e.a === a.id && e.b === b.id || e.a === b.id && e.b === a.id);
      if (!edge) return null;
      const size = Math.hypot(b.x-a.x, b.y-a.y);
      segments.push({a, b, from: length, size});
      length += size;
    }
    return {segments, length};
  }

  function dogRoutes(region) {
    if (!routeCache.has(region)) routeCache.set(region, [
      {route: roadRoute(region, ['cafe','print','square','archive']), speed: 91, phase: 1700, color: '#998268', patch: '#e0d2b3'},
      {route: roadRoute(region, ['barn','work','homes']), speed: 82, phase: 9800, color: '#625a4c', patch: '#b4a18a'}
    ]);
    return routeCache.get(region);
  }

  function dogPose(dog, time) {
    const run = dog.route.length / dog.speed * 1000;
    const wait = 1800;
    const cycle = (time + dog.phase) % (2 * (run + wait));
    const back = cycle >= run + wait;
    const leg = back ? cycle - run - wait : cycle;
    const moving = leg < run;
    const travelled = Math.min(leg / run, 1) * dog.route.length;
    const distance = back ? dog.route.length - travelled : travelled;
    const segment = dog.route.segments.find(s => distance <= s.from + s.size) || dog.route.segments.at(-1);
    const t = Math.max(0, Math.min(1, (distance - segment.from) / segment.size));
    const dx = segment.b.x - segment.a.x, dy = segment.b.y - segment.a.y;
    return {
      x: segment.a.x + dx*t,
      y: segment.a.y + dy*t,
      angle: Math.atan2(dy, dx) + (back ? Math.PI : 0),
      moving
    };
  }

  function drawDog(ctx, dog, time, still) {
    if (!dog.route) return;
    const pose = dogPose(dog, time);
    const stride = !still && pose.moving ? Math.sin(time/78) * 3.4 : 0;
    const wag = !still ? Math.sin(time / (pose.moving ? 130 : 115)) * .22 : 0;
    ctx.save();
    ctx.translate(pose.x, pose.y);
    ctx.rotate(pose.angle);
    cut(ctx, -10 + stride, 3, 4, 11, '#665c4b');
    cut(ctx, 6 - stride, 3, 4, 11, '#665c4b');
    ctx.save();
    ctx.translate(-13,-2);
    ctx.rotate(wag);
    piece(ctx, [[1,-2],[-8,-7],[-12,-6],[-7,-2],[0,3]], dog.color);
    ctx.restore();
    piece(ctx, [[-15,-5],[-8,-10],[7,-8],[13,-3],[10,7],[-11,7]], dog.color);
    piece(ctx, [[-2,-9],[6,-8],[8,-1],[1,2],[-3,-2]], dog.patch);
    cut(ctx, -10 - stride, 5, 4, 10, dog.color);
    cut(ctx, 6 + stride, 4, 4, 11, dog.color);
    piece(ctx, [[8,-10],[15,-12],[20,-7],[26,-5],[25,1],[17,4],[10,0]], dog.color);
    piece(ctx, [[11,-11],[17,-12],[15,-2],[10,-5]], '#74604b');
    fleck(ctx, 20,-6);
    piece(ctx, [[24,-5],[27,-4],[26,-1],[24,-1]], '#473e32', 'detail', 0);
    ctx.restore();
  }

  const HENS = [
    {x:3190,y:1056,phase:0,light:true}, {x:3231,y:1073,phase:1900},
    {x:3270,y:1058,phase:3700,light:true}, {x:3235,y:340,phase:1100},
    {x:3253,y:377,phase:2800,light:true}, {x:3297,y:370,phase:4700}
  ];

  function drawHen(ctx, hen, time, still) {
    const cycle = (time + hen.phase) % 7600;
    const walking = !still && cycle > 5000;
    const peck = !still && cycle < 2100 ? Math.max(0,Math.sin(cycle/200)) : 0;
    const x = hen.x + (!still ? Math.sin((time+hen.phase)/6300) * 4 : 0);
    const y = hen.y + (!still ? Math.cos((time+hen.phase)/7200) * 2 : 0);
    const step = walking ? Math.sin(time/105) * 1.4 : 0;
    const body = hen.light ? '#ded1ad' : '#aa8658';
    ctx.save();
    ctx.translate(x,y);
    if (hen.phase % 3) ctx.scale(-1,1);
    cut(ctx, -3 + step, 1, 1.4, 6, '#9e7743');
    cut(ctx, 2 - step, 1, 1.4, 6, '#9e7743');
    piece(ctx, [[-5,-5],[-10,-12],[-10,-5],[-13,-8],[-10,0],[-6,2]], hen.light ? '#c7b995' : '#765a43');
    piece(ctx, [[-7,-5],[-2,-9],[5,-7],[7,-2],[4,4],[-4,3]], body);
    piece(ctx, [[-4,-4],[1,-6],[5,-2],[1,1],[-4,0]], hen.light ? '#cbbd98' : '#957149');
    ctx.save();
    ctx.translate(5,-5);
    ctx.rotate(peck * .9);
    piece(ctx, [[-1,2],[0,-4],[2,-8],[6,-7],[7,-3],[4,2]], body);
    piece(ctx, [[1,-8],[1,-11],[3,-10],[5,-12],[6,-8]], '#a55f49');
    piece(ctx, [[6,-6],[10,-4],[6,-3]], '#ae8a49');
    fleck(ctx, 5,-6, '#554330', .65);
    ctx.restore();
    ctx.restore();
  }

  // South of the village and workshops, north of the coastline. No road crosses it.
  const PADDOCK = [[2945,1107],[3170,1104],[3180,1225],[2950,1228]];
  const GRAZERS = [
    {kind:'sheep',x:2994,y:1140,phase:500},
    {kind:'sheep',x:3060,y:1136,phase:1700,flip:true},
    {kind:'sheep',x:3130,y:1141,phase:3400},
    {kind:'cow',x:3008,y:1191,phase:2100},
    {kind:'cow',x:3115,y:1189,phase:4300,flip:true}
  ];

  function fence(ctx, a, b) {
    const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
    const nx=-dy/length*1.4,ny=dx/length*1.4;
    for (const height of [5,11]) piece(ctx,
      [[a[0]+nx,a[1]-height+ny],[b[0]+nx,b[1]-height+ny],
       [b[0]-nx,b[1]-height-ny],[a[0]-nx,a[1]-height-ny]], '#af9e79');
    const count=Math.ceil(length/34);
    for(let i=0;i<=count;i++) {
      const x=a[0]+dx*i/count,y=a[1]+dy*i/count;
      piece(ctx, [[x-2,y-16],[x+1,y-17],[x+2,y+1],[x-2,y]], '#958262');
    }
  }

  function drawSheep(ctx, grazer, time, still) {
    const nibble = !still ? Math.max(0,Math.sin((time+grazer.phase)/870)) : 0;
    cut(ctx, -10, 3, 3.5, 12, '#7d7360');
    cut(ctx, 7, 3, 3.5, 12, '#7d7360');
    piece(ctx, [[-15,-6],[-11,-12],[-4,-11],[1,-14],[8,-12],[13,-10],
      [15,-3],[12,5],[5,7],[-1,6],[-7,8],[-13,3]], '#ded5b9');
    piece(ctx, [[-9,-7],[-5,-10],[1,-8],[5,-10],[10,-6],[8,0],[1,2],[-7,1]], '#e8dec4', 'piece', .35);
    ctx.save();
    ctx.translate(11,-4);
    ctx.rotate(nibble*.25);
    piece(ctx, [[-1,-5],[5,-7],[10,-3],[12,5],[8,9],[2,6]], '#9a8b70');
    piece(ctx, [[2,-5],[0,-9],[6,-7],[7,-3]], '#bcae8e');
    fleck(ctx, 7,-1, '#4c4537', .9);
    ctx.restore();
  }

  function drawCow(ctx, grazer, time, still) {
    const nibble = !still ? Math.max(0,Math.sin((time+grazer.phase)/1100)) : 0;
    const tail = !still ? Math.sin((time+grazer.phase)/1300)*2.5 : 0;
    piece(ctx, [[-18,-3],[-22,-2],[-23,12+tail],[-20,16+tail],[-20,10+tail],[-19,1]], '#867357');
    cut(ctx, -13, 4, 4, 16, '#998160');
    cut(ctx, 10, 4, 4, 16, '#998160');
    piece(ctx, [[-20,-7],[-13,-13],[7,-13],[19,-7],[18,5],[9,10],[-12,8],[-18,2]], '#cbb38b');
    piece(ctx, [[-12,-12],[-2,-12],[2,-6],[-3,1],[-13,-1],[-15,-6]], '#876e50');
    piece(ctx, [[11,-10],[18,-6],[17,2],[12,5],[7,1],[8,-4]], '#a38a65');
    cut(ctx, -12, 6, 4, 14, '#b19975');
    cut(ctx, 10, 7, 4, 13, '#b19975');
    cut(ctx, -12, 18, 4.5, 3, '#645847');
    cut(ctx, 10, 18, 4.5, 3, '#645847');
    ctx.save();
    ctx.translate(18,-4);
    ctx.rotate(nibble*.17);
    piece(ctx, [[-2,-7],[5,-9],[11,-4],[13,6],[9,12],[3,11],[-1,4]], '#b79c73');
    piece(ctx, [[0,-7],[-5,-11],[-7,-8],[-1,-3]], '#a58b65');
    piece(ctx, [[7,-7],[13,-10],[16,-8],[11,-3]], '#a58b65');
    piece(ctx, [[0,-8],[0,-13],[3,-10],[3,-7]], '#dfcfaa');
    piece(ctx, [[8,-8],[10,-13],[11,-9],[10,-6]], '#dfcfaa');
    piece(ctx, [[4,5],[12,5],[12,10],[7,12],[3,9]], '#c4aa87');
    fleck(ctx, 8,-2, '#4b4336', 1);
    ctx.restore();
  }

  function drawPaddock(ctx, time, still) {
    piece(ctx, PADDOCK, '#b9b899', 'land', .35);
    for (let i=0;i<20;i++) {
      const x=2965+(i*47%185),y=1120+(i*29%90);
      piece(ctx, [[x-3,y+2],[x-2,y-3],[x,y],[x+3,y-2],[x+2,y+3]], '#a5a886', 'piece', .15);
    }
    fence(ctx,PADDOCK[0],PADDOCK[1]);
    fence(ctx,PADDOCK[0],PADDOCK[3]);
    fence(ctx,PADDOCK[1],PADDOCK[2]);
    for (const grazer of GRAZERS) {
      ctx.save();
      ctx.translate(grazer.x,grazer.y);
      if (grazer.flip) ctx.scale(-1,1);
      if (grazer.kind === 'cow') drawCow(ctx,grazer,time,still);
      else drawSheep(ctx,grazer,time,still);
      ctx.restore();
    }
    fence(ctx,PADDOCK[3],PADDOCK[2]);
  }

  function draw(ctx, {region, now = performance.now(), activePersonId = null, hoverId = null} = {}) {
    if (!region?.map) return;
    const still = motion.matches;
    if (lastNow !== null && !still) elapsed += Math.max(0,Math.min(now-lastNow,80));
    lastNow = now;
    ctx.save();
    if (region.id === 'main') {
      drawPaddock(ctx,elapsed,still);
      for (const hen of HENS) drawHen(ctx,hen,elapsed,still);
      for (const dog of dogRoutes(region)) drawDog(ctx,dog,elapsed,still);
    }
    for (const person of people(region).sort((a,b) => a.y-b.y)) {
      if (window.UPPDRAG_MEETINGS?.drawMapPerson) {
        window.UPPDRAG_MEETINGS.drawMapPerson(ctx,person,person,elapsed);
      } else fallbackPerson(ctx,person);
      talkMark(ctx,person,person.id === activePersonId || person.id === hoverId);
    }
    ctx.restore();
  }

  window.UPPDRAG_WORLD_LIFE = {draw, people, hit};
})();
