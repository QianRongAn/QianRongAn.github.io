import * as THREE from 'three';

// An original sea-bass-inspired sculpture, not a specimen scan or anatomical reconstruction.
// Open caudal bones and segmented fin rays preserve the mermaid proportions without skin or webbing.
export function createMermaidTail(material) {
 const tail=new THREE.Group();
 tail.name='Sea_bass_inspired_mermaid_tail';
 tail.userData.reference='https://sketchfab.com/3d-models/blackfin-seabass-lateolabrax-latus-1d90d18f5d2044d8ae1eeaf8819a8c85';
 const center=t=>new THREE.Vector3(.18*Math.sin(t*Math.PI),-4.4*t,.12*Math.sin(t*Math.PI*1.4));
 const boneMaterial=material;
 function bone(a,b,radius,kind){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius*.72,radius,a.distanceTo(b),8),boneMaterial);
  mesh.position.copy(a).lerp(b,.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());mesh.userData.kind=kind;tail.add(mesh);
 }
 function curvedSpine(start,oldTip,radius){
  const delta=oldTip.clone().sub(start),baseline=delta.length(),tip=start.clone().addScaledVector(delta,2);
  const control=start.clone().lerp(tip,.52).add(new THREE.Vector3(0,baseline*.38,baseline*.08));
  const curve=new THREE.QuadraticBezierCurve3(start.clone(),control,tip),factor=baseline*2/curve.getLength();
  curve.v1.sub(start).multiplyScalar(factor).add(start);curve.v2.sub(start).multiplyScalar(factor).add(start);curve.updateArcLengths();
  const segments=18,sides=8,geometry=new THREE.TubeGeometry(curve,segments,radius,sides,false),positions=geometry.attributes.position;
  for(let ring=0;ring<=segments;ring++){
   const t=ring/segments,center=curve.getPointAt(t),taper=Math.pow(1-t,.8);
   for(let j=0;j<=sides;j++){const i=ring*(sides+1)+j,p=new THREE.Vector3().fromBufferAttribute(positions,i).sub(center).multiplyScalar(taper).add(center);positions.setXYZ(i,p.x,p.y,p.z);}
  }
  geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,boneMaterial);mesh.userData={kind:'caudal-spine',baselineLength:baseline,length:curve.getLength()};tail.add(mesh);
 }
 const profile=[new THREE.Vector2(.17,-.09),new THREE.Vector2(.15,-.065),new THREE.Vector2(.105,0),new THREE.Vector2(.15,.065),new THREE.Vector2(.17,.09)];
 const centrumGeometry=new THREE.LatheGeometry(profile,16);
 for(let i=0;i<23;i++){
  const t=i/22,c=center(t),scale=1-t*.45;
  const centrum=new THREE.Mesh(centrumGeometry,boneMaterial);centrum.position.copy(c);centrum.scale.setScalar(scale);centrum.userData.kind='caudal-vertebra';tail.add(centrum);
  if(i<22)bone(c,center((i+1)/22),.045*scale,'intervertebral-joint');
  const spread=.82*Math.pow(1-t,1.2)+.16*t;
  for(const side of [-1,1]){
   const arch=c.clone().add(new THREE.Vector3(side*.18*scale,-.07,.10*scale));
   const tip=c.clone().add(new THREE.Vector3(side*spread,-.30*scale,.045));
   bone(c,arch,.045*scale,'caudal-arch');curvedSpine(arch,tip,.028*scale);
  }
 }
 // A narrow proximal bone overlaps the sacrum instead of a solid rounded socket.
 bone(new THREE.Vector3(0,.34,0),center(0),.16,'sacrum-join');
 for(let i=-2;i<=2;i++)bone(center(1),new THREE.Vector3(i*.14,-4.87,.03),.045,'hypural-support');
 for(let i=0;i<19;i++){
  const t=i/18*2-1,u=Math.abs(t),start=center(1).add(new THREE.Vector3(t*.12,-.05,0)),tip=new THREE.Vector3(t*2.1,-6.75+.55*(1-u)-.5*Math.sin(Math.PI*u)+.45*u**10,.12*Math.sin(t*Math.PI));
  const curve=new THREE.CatmullRomCurve3([start,new THREE.Vector3(t*.46,-5.05,.10+u*.04),new THREE.Vector3(t*1.28,tip.y+.55,.10*Math.sin(t*2)),tip]);
  for(let j=0;j<15;j++)bone(curve.getPoint(j/15),curve.getPoint((j+.94)/15),.030-j*.0012,'segmented-fin-ray');
  for(const side of [-1,1]){
   const branch=new THREE.CatmullRomCurve3([curve.getPoint(.68),curve.getPoint(.84).add(new THREE.Vector3(side*.045,0,.012)),tip.clone().add(new THREE.Vector3(side*.075,0,0))]);
   const mesh=new THREE.Mesh(new THREE.TubeGeometry(branch,10,.009,6,false),boneMaterial);mesh.userData.kind='fin-ray-branch';tail.add(mesh);
  }
 }
 tail.userData.design='Original open fish-bone mermaid-tail study, inspired by Lateolabrax latus';
 tail.scale.set(1.5,1.3,1.5);
 return tail;
}
