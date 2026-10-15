export const VERSION=1;
export const places={print:{label:'Tryckeri',x:365,y:365},cafe:{label:'Kaffehus',x:700,y:245},archive:{label:'Arkiv',x:470,y:555},quay:{label:'Kajen',x:1040,y:420}};
export const obstacles=[[22,165,325,190],[545,45,300,170],[145,435,295,170]];
export const questions=[
 {text:'Vilket svenskt handelskompani seglade till Kina?',answer:'Ostindiska kompaniet',accept:['ostindiska kompaniet','svenska ostindiska kompaniet'],explain:'Ostindiska kompaniets skepp köpte bland annat te, siden och porslin i Kina.'},
 {text:'Från vilken svensk stad seglade kompaniets skepp?',answer:'Göteborg',accept:['goteborg','goteborgs hamn'],explain:'Göteborg var utgångspunkt för kompaniets resor till Kina.'},
 {text:'Vad kallas det att köpa in varor från andra länder?',answer:'Import',accept:['import','importera'],explain:'Import är att köpa in varor från andra länder.'},
 {text:'Vad kallas det att sälja varor till andra länder?',answer:'Export',accept:['export','exportera'],explain:'Export är att sälja varor till andra länder.'}
];
export function blank(){return{version:VERSION,player:{x:610,y:405},apple:true,letter:false,proof:false,delivered:false,proofDelivered:false,harborDone:false,placed:[],question:0}}
export function restore(raw){const b=blank();if(!raw||raw.version!==VERSION)return b;for(const k of ['apple','letter','proof','delivered','proofDelivered','harborDone'])if(typeof raw[k]==='boolean')b[k]=raw[k];b.placed=[...new Set((raw.placed||[]).filter(x=>['ink','paper','type'].includes(x)))];b.question=Number.isInteger(raw.question)?Math.max(0,Math.min(3,raw.question)):0;if(walkable(raw.player?.x,raw.player?.y))b.player={x:raw.player.x,y:raw.player.y};return b}
export function normalize(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
export function grade(i,text){const n=normalize(text);return questions[i]?.accept.some(a=>normalize(a)===n)||false}
export function walkable(x,y){return Number.isFinite(x)&&Number.isFinite(y)&&x>=25&&x<=1080&&y>=25&&y<=690&&!obstacles.some(([a,b,w,h])=>x>=a-12&&x<=a+w+12&&y>=b-12&&y<=b+h+12)}
export function route(from,to){
 const size=20,W=64,H=36,grid=(x,y)=>({x:Math.max(1,Math.min(W-2,Math.round(x/size))),y:Math.max(1,Math.min(H-2,Math.round(y/size)))}),start=grid(from.x,from.y),goal=grid(to.x,to.y),key=p=>p.y*W+p.x;
 if(!walkable(to.x,to.y))return[];
 const queue=[start],seen=new Set([key(start)]),parents=new Map();let found;
 for(let n=0;n<queue.length;n++){const p=queue[n];if(key(p)===key(goal)){found=p;break}for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const q={x:p.x+dx,y:p.y+dy};if(q.x<1||q.y<1||q.x>=W-1||q.y>=H-1||seen.has(key(q))||!walkable(q.x*size,q.y*size))continue;seen.add(key(q));parents.set(key(q),p);queue.push(q)}}
 if(!found)return[];const points=[];while(key(found)!==key(start)){points.push({x:found.x*size,y:found.y*size});found=parents.get(key(found))}points.reverse();points.push({x:to.x,y:to.y});return points;
}
export function place(s,id){if(!['ink','paper','type'].includes(id)||s.placed.includes(id))return false;s.placed.push(id);return true}
export function print(s){if(s.placed.length!==3||s.proof)return false;s.proof=true;return true}
export function deliver(s,id){if(id==='letter'&&s.letter){s.letter=false;s.delivered=true;return true}if(id==='proof'&&s.proof){s.proof=false;s.proofDelivered=true;return true}return false}
