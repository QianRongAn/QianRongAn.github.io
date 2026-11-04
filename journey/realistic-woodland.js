import * as THREE from 'three';

// ImageGen cutouts are rooted in world coordinates, never attached to the camera.
export function createRealisticWoodland(sites,manager){
 const group=new THREE.Group();group.name='ImageGen roadside woodland';
 const atlas=new THREE.TextureLoader(manager).load('assets/worlds/roadside-atlas144.webp');atlas.colorSpace=THREE.SRGBColorSpace;atlas.anisotropy=8;
 const dummy=new THREE.Object3D();
 for(let variant=0;variant<4;variant++){
  const geometry=new THREE.PlaneGeometry(1,1),uv=geometry.attributes.uv;
  for(let i=0;i<uv.count;i++)uv.setX(i,(uv.getX(i)*.985+.0075+variant)/4);
  geometry.translate(0,.5,0);
  const material=new THREE.MeshBasicMaterial({map:atlas,alphaTest:.32,side:THREE.DoubleSide,color:'#ffffff',toneMapped:false});
  const subset=sites.filter((_,i)=>i%4===variant),batch=new THREE.InstancedMesh(geometry,material,subset.length*2);
  subset.forEach((p,i)=>{for(let cross=0;cross<2;cross++){dummy.position.set(p.x,p.floor-.05,p.z);dummy.rotation.set(0,(i*2.39996)%Math.PI+cross*Math.PI/2,0);dummy.scale.set(p.height*.5,p.height,1);dummy.updateMatrix();batch.setMatrixAt(i*2+cross,dummy.matrix);}});
  batch.computeBoundingSphere();group.add(batch);
 }
 return group;
}
