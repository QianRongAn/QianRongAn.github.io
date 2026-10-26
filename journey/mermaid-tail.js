import * as THREE from 'three';

// An original sea-bass-inspired sculpture, not a specimen scan or anatomical reconstruction.
// The long tapered body and shallow fork fit the full spine rather than a detached small fin.
export function createMermaidTail(material) {
 const tail=new THREE.Group();
 tail.name='Sea_bass_inspired_mermaid_tail';
 tail.userData.reference='https://sketchfab.com/3d-models/blackfin-seabass-lateolabrax-latus-1d90d18f5d2044d8ae1eeaf8819a8c85';
 const join=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),material);join.scale.set(.82,.38,.59);tail.add(join);
 const center=t=>new THREE.Vector3(.18*Math.sin(t*Math.PI),-4.4*t,.12*Math.sin(t*Math.PI*1.4));
 const bodyPositions=[],bodyIndices=[],rings=52,sides=24;
 for(let i=0;i<=rings;i++){
  const t=i/rings,c=center(t),r=.82*Math.pow(1-t,1.2)+.16*t;
  for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2;bodyPositions.push(c.x+Math.cos(a)*r,c.y,c.z+Math.sin(a)*r*.72);}
 }
 for(let i=0;i<rings;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;bodyIndices.push(a,b,a+1,b,b+1,a+1);}
 const body=new THREE.BufferGeometry();body.setAttribute('position',new THREE.Float32BufferAttribute(bodyPositions,3));body.setIndex(bodyIndices);body.computeVertexNormals();tail.add(new THREE.Mesh(body,material));
 const rays=[];
 for(let i=0;i<19;i++){
  const t=i/18*2-1,u=Math.abs(t),start=center(1),tip=new THREE.Vector3(t*2.1,-6.75+.55*(1-u)-.5*Math.sin(Math.PI*u)+.45*u**10,.12*Math.sin(t*Math.PI));
  const curve=new THREE.CatmullRomCurve3([start,new THREE.Vector3(t*.46,-5.05,.10+u*.04),new THREE.Vector3(t*1.28,tip.y+.55,.10*Math.sin(t*2)),tip]);
  rays.push(curve);
  tail.add(new THREE.Mesh(new THREE.TubeGeometry(curve,26,.022,7,false),material));
 }
 // The thin web follows the rays; its edges retain the shallow fork of a bass tail.
 const finPositions=[],finIndices=[],steps=26;
 for(let i=0;i<rays.length;i++)for(let j=0;j<=steps;j++){
  const p=rays[i].getPoint(j/steps);p.z+=.045*Math.sin(i*Math.PI)*Math.sin(j/steps*Math.PI);finPositions.push(...p);
 }
 for(let i=0;i<rays.length-1;i++)for(let j=0;j<steps;j++){const a=i*(steps+1)+j,b=a+steps+1;finIndices.push(a,b,a+1,b,b+1,a+1);}
 const fin=new THREE.BufferGeometry();fin.setAttribute('position',new THREE.Float32BufferAttribute(finPositions,3));fin.setIndex(finIndices);fin.computeVertexNormals();
 const membrane=material.clone();membrane.side=THREE.DoubleSide;membrane.roughness=.26;
 tail.add(new THREE.Mesh(fin,membrane));
 tail.userData.design='Original metallic mermaid-tail study, inspired by Lateolabrax latus';
 return tail;
}
