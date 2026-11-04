import * as THREE from 'three';

// Volumetric crowns assembled from detailed leafy sprays, with solid rooted trunks.
export function createRealisticWoodland(sites,manager){
 const group=new THREE.Group();group.name='Lush lavender roadside woodland';
 const atlas=new THREE.TextureLoader(manager).load('assets/worlds/roadside-foliage147.webp');atlas.colorSpace=THREE.SRGBColorSpace;atlas.anisotropy=8;
 const barkMap=new THREE.TextureLoader(manager).load('assets/worlds/banyan-bark144.webp');barkMap.colorSpace=THREE.SRGBColorSpace;barkMap.wrapS=barkMap.wrapT=THREE.RepeatWrapping;barkMap.repeat.set(1,3);
 const dummy=new THREE.Object3D(),records=[[],[],[],[]];let seed=93171;
 const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const trunkMaterial=new THREE.MeshBasicMaterial({map:barkMap,color:'#93839e',toneMapped:false});
 const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.64,1,1,9,5),trunkMaterial,sites.length);
 const branches=new THREE.InstancedMesh(new THREE.CylinderGeometry(.3,1,1,7,3),trunkMaterial,sites.length*5),up=new THREE.Vector3(0,1,0);
 sites.forEach((p,index)=>{
  const broad=index%5===0,lean=(random()-.5)*.06,radius=p.height*(.018+random()*.006),length=p.height*(broad?.63:.86);
  dummy.position.set(p.x,p.floor-.10+length*.5,p.z);dummy.rotation.set(lean,random()*6.28,lean*.6);dummy.scale.set(radius,length,radius);dummy.updateMatrix();trunks.setMatrixAt(index,dummy.matrix);
  for(let j=0;j<5;j++){const f=broad?.48+j*.035:.32+j*.095,a=index*.7+j*2.39996,r=p.height*(broad?.16:.18*(1-f)),start=new THREE.Vector3(p.x,p.floor+p.height*f,p.z),end=new THREE.Vector3(p.x+Math.cos(a)*r,p.floor+p.height*(f+.08),p.z+Math.sin(a)*r);dummy.position.copy(start).lerp(end,.5);dummy.quaternion.setFromUnitVectors(up,end.clone().sub(start).normalize());dummy.scale.set(radius*.44,start.distanceTo(end),radius*.44);dummy.updateMatrix();branches.setMatrixAt(index*5+j,dummy.matrix);}
  for(let j=0;j<140;j++){
   const f=broad?.49+random()*.47:.22+random()*.75,a=j*2.39996+index*.73+(random()-.5)*.55;
   const edge=broad?p.height*.235*Math.sqrt(Math.max(.12,1-((f-.75)/.31)**2)):p.height*.235*Math.pow(1-f,.75);
   const r=edge*Math.sqrt(random())*(.6+random()*.4),x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r,y=p.floor+p.height*f;
   const size=p.height*(broad?.24:.25)*(.55+.5*(1-f)+random()*.20);
   records[(broad?2:0)+(j+index)%2].push({x,y,z,a:a+Math.PI/2,tilt:(random()-.5)*1.1,roll:(random()-.5)*.8,size,shade:.79+random()*.21});
  }
 });
 trunks.computeBoundingSphere();branches.computeBoundingSphere();group.add(trunks,branches);
 for(let variant=0;variant<4;variant++){
  const geometry=new THREE.PlaneGeometry(1,1),uv=geometry.attributes.uv;
  for(let i=0;i<uv.count;i++)uv.setXY(i,(uv.getX(i)*.96+.02+variant%2)/2,(uv.getY(i)*.96+.02+1-Math.floor(variant/2))/2);
  const material=new THREE.MeshBasicMaterial({map:atlas,alphaTest:.43,alphaToCoverage:true,side:THREE.DoubleSide,color:'#e0d9f3',toneMapped:false});
  const batch=new THREE.InstancedMesh(geometry,material,records[variant].length);
  records[variant].forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(p.tilt,p.a,p.roll);dummy.scale.set(p.size,p.size*.68,1);dummy.updateMatrix();batch.setMatrixAt(i,dummy.matrix);batch.setColorAt(i,new THREE.Color().setScalar(p.shade));});
  batch.computeBoundingSphere();group.add(batch);
 }
 group.userData.treeCount=sites.length;group.userData.crownClusters=sites.length*140;group.userData.style='lush-lavender-volumetric-crowns';
 return group;
}
