import * as THREE from 'three';
import bounds from '../assets/worlds/flora150/atlas-bounds.json';

// Photographic plant poses occupy the existing, cleared planting envelopes.
// The original geometry still determines spacing, scale caps and ground anchors.
export function createPhotographicFlora(manager,materials){
 const group=new THREE.Group();group.name='ImageGen botanical poses';
 const atlases={},batches=[],dummy=new THREE.Object3D();
 for(const name of Object.keys(bounds)){
  const texture=new THREE.TextureLoader(manager).load('assets/worlds/flora150/'+name+'.webp');
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=16;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;
  atlases[name]=new THREE.MeshBasicMaterial({map:texture,alphaTest:.015,alphaToCoverage:false,side:THREE.DoubleSide,transparent:true,depthWrite:false,toneMapped:false});
  atlases[name].userData.baseOpacity=1;materials.push(atlases[name]);
 }
 function add(name,records){
  const boxes=bounds[name];if(!boxes)throw new Error('Unknown botanical atlas '+name);
  for(let variant=0;variant<4;variant++){
   const [l,t,r,b,aspect]=boxes[variant],items=records.filter((_,i)=>(i*7+Math.floor(i/4))%4===variant);
   const geometry=new THREE.PlaneGeometry(1,1,2,4);geometry.translate(0,.5,0);
   const uv=geometry.attributes.uv;
   for(let i=0;i<uv.count;i++)uv.setXY(i,l+uv.getX(i)*(r-l),1-b+uv.getY(i)*(b-t));
   const batch=new THREE.InstancedMesh(geometry,atlases[name],items.length);
   batch.name=name+' pose '+(variant+1);batch.frustumCulled=false;
   const plants=items.map(p=>{const height=Math.min(p.height,p.width/aspect);return {...p,height,width:height*aspect};});
   batches.push({batch,plants});group.add(batch);
  }
 }
 function addHeads(matrices){
  for(let variant=0;variant<4;variant++){
   const [l,t,r,b]=bounds.small_heads[variant],geometry=new THREE.PlaneGeometry(1.64,1.64,12,12),uv=geometry.attributes.uv,p=geometry.attributes.position;
   for(let i=0;i<uv.count;i++){uv.setXY(i,l+uv.getX(i)*(r-l),1-b+uv.getY(i)*(b-t));const x=p.getX(i),z=-p.getY(i);p.setXYZ(i,x,.08*Math.max(0,1-(x*x+z*z)/(.82*.82)),z);}
   geometry.computeVertexNormals();const items=matrices.filter((_,i)=>i%4===variant),batch=new THREE.InstancedMesh(geometry,atlases.small_heads,items.length);
   items.forEach((matrix,i)=>batch.setMatrixAt(i,matrix));batch.computeBoundingSphere();batch.name='Photographic meadow blossom '+variant;group.add(batch);
  }
 }
 function update(camera){
  for(const {batch,plants} of batches){
   plants.forEach((p,i)=>{
    dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(0,Math.atan2(camera.position.x-p.x,camera.position.z-p.z),0);
    dummy.scale.set(p.width,p.height,1);dummy.updateMatrix();batch.setMatrixAt(i,dummy.matrix);
   });batch.instanceMatrix.needsUpdate=true;
  }
 }
 return {group,add,addHeads,update,get count(){return batches.reduce((n,p)=>n+p.plants.length,0);}};
}
