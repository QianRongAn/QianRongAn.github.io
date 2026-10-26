import * as THREE from 'three';

// Place persistent ground clumps where the actual shots can see them, without turning plants.
export function planBotanicalClumps({species,views,floor,viewClear,treeClear,random}){
 const centers=[],bySpecies=species.map(()=>[]),camera=new THREE.PerspectiveCamera(47,1.85,.1,160);
 const candidates=[];
 for(let z=10;z> -107;z-=2.8)for(let x=-10.5;x<=10.5;x+=2.8)candidates.push({x:x+(random()-.5)*2.4,z:z+(random()-.5)*2.4});
 function projection(point,view){
  const head=new THREE.Vector3(point.x,floor(point.x,point.z)+.9,point.z),distance=head.distanceTo(view.position);
  if(distance<8||distance>34)return null;
  const p=head.clone().project(camera);
  if(p.z< -1||p.z>1||Math.abs(p.x)>.9||p.y<-.9||p.y>.12)return null;
  // Reject flowers hidden behind an intervening rise in the terrain.
  for(let i=1;i<12;i++){const q=view.position.clone().lerp(head,i/12);if(floor(q.x,q.z)>q.y-.12)return null;}
  return p;
 }
 views.forEach((view,shot)=>{
  camera.position.copy(view.position);camera.lookAt(view.gaze);camera.updateMatrixWorld();
  const targets=[[.57,-.40],[-.08,-.66],[-.62,-.53]];
  targets.forEach(([sx,sy],slot)=>{
   if(centers.some(c=>{const p=projection(c,view);return p&&Math.hypot(p.x-sx,p.y-sy)<.38;}))return;
   const kind=(shot*3+slot)%species.length,broad=['cymbidium','phalaenopsis','gladiolus'].includes(species[kind]);
   const rx=broad?2.65:2.15,rz=rx*(.85+random()*.3);
   let best=null,score=Infinity;
   for(const candidate of candidates){
    const {x,z}=candidate;
    if(Math.hypot(x-3.4,z+66)<4.2||!viewClear(x,z)||!treeClear(x,z,rx)||centers.some(c=>Math.hypot(x-c.x,z-c.z)<Math.max(rx,rz)+Math.max(c.rx,c.rz)+.25))continue;
    const p=projection(candidate,view);if(!p)continue;
    const value=Math.hypot(p.x-sx,p.y-sy);
    if(value<score){score=value;best=candidate;}
   }
   if(!best)return;
   const clump={...best,rx,rz,count:broad?7:9,species:species[kind]};
   centers.push(clump);bySpecies[kind].push(clump);
  });
 });
 return{centers,bySpecies};
}
