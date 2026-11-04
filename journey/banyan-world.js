import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Persistent world-space canopy, branches and prop roots. No camera-bound photo.
export function createBanyanClearing(camera,manager){
 const group=new THREE.Group();group.name='World-space banyan';group.position.set(0,-6,-137);
 let seed=77143;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296),V=(x,y,z)=>new THREE.Vector3(x,y,z);
 const texture=new THREE.TextureLoader(manager).load('assets/worlds/banyan-bark144.webp');texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(1.2,3);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
 const bark=new THREE.MeshStandardMaterial({map:texture,bumpMap:texture,bumpScale:.16,color:'#b9b3a5',roughness:.9}),parts=[],tips=[];
 function limb(points,radius,end=.1,steps=36){const curve=new THREE.CatmullRomCurve3(points),g=new THREE.TubeGeometry(curve,steps,1,10,false),p=g.attributes.position;
  for(let i=0;i<=steps;i++){const c=curve.getPointAt(i/steps),r=THREE.MathUtils.lerp(radius,end,Math.pow(i/steps,.8));for(let j=0;j<=10;j++){const k=i*11+j;p.setXYZ(k,c.x+(p.getX(k)-c.x)*r,c.y+(p.getY(k)-c.y)*r,c.z+(p.getZ(k)-c.z)*r);}}g.computeVertexNormals();parts.push(g);}
 for(let i=0;i<11;i++){const a=i*2.39996,r=.7+random()*.8;limb([V(Math.cos(a)*r,0,Math.sin(a)*r),V(Math.cos(a)*r*.8,3,Math.sin(a)*r*.8),V(Math.cos(a+.1)*.9,6.5+random()*1.7,Math.sin(a)*.9)],.62,.32);limb([V(Math.cos(a)*r,1,Math.sin(a)*r),V(Math.cos(a)*3.6,.26,Math.sin(a)*3.6),V(Math.cos(a+.1)*(5+random()*2),.04,Math.sin(a+.1)*6)],.40,.025);}
 for(let i=0;i<15;i++){const a=i*2.39996+.3,r=10+random()*9,h=10+random()*6,start=V(Math.cos(a)*.8,5+random()*3,Math.sin(a)*.8),tip=V(Math.cos(a)*r,h,Math.sin(a)*r*.8);
  limb([start,V(tip.x*.28,8+random()*2,tip.z*.3),V(tip.x*.65,h-1.5,tip.z*.7),tip],.70,.10);
  for(let j=0;j<5;j++){const b=a+(random()-.5)*1.2,at=tip.clone().multiplyScalar(.55+j*.075);at.y=h-1+random()*2;const end=V(Math.cos(b)*(r+random()*5),h+random()*3,Math.sin(b)*(r+random()*4)*.8);limb([at,at.clone().lerp(end,.5).add(V(0,1,0)),end],.13,.014,20);tips.push(end);}
  for(let j=0;j<5;j++){const f=.36+random()*.56,x=tip.x*f,z=tip.z*f,y=7+(h-7)*f,grounded=j%3===0,endY=grounded?.12:1+random()*4;limb([V(x,y,z),V(x+.16,5,z+.05),V(x+.10,endY,z+.12)],grounded?.095:.025,grounded?.13:.012,18);}
 }
 const merged=mergeGeometries(parts);parts.forEach(g=>g.dispose());group.add(new THREE.Mesh(merged,bark));
 const leaves=new THREE.TextureLoader(manager).load('assets/worlds/banyan-foliage144.webp');leaves.colorSpace=THREE.SRGBColorSpace;leaves.anisotropy=8;
 const leafMaterial=new THREE.MeshBasicMaterial({map:leaves,alphaTest:.43,side:THREE.DoubleSide,color:'#dce8c9',toneMapped:false}),count=2100,batch=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),leafMaterial,count),dummy=new THREE.Object3D();
 for(let i=0;i<count;i++){const tip=tips[i%tips.length];dummy.position.copy(tip).add(V((random()-.5)*5,(random()-.5)*3.3,(random()-.5)*5));if(i>1399){const a=random()*Math.PI*2,r=Math.sqrt(random())*14;dummy.position.set(Math.cos(a)*r,12+random()*6,Math.sin(a)*r*.85);}if(dummy.position.z> -1&&dummy.position.z<19&&dummy.position.x>3&&dummy.position.x<9&&dummy.position.y<16)dummy.position.x+=5;dummy.rotation.set((random()-.5)*2.5,random()*Math.PI,(random()-.5)*1.4);const s=2.2+random()*2.5;dummy.scale.set(s,s*.67,1);dummy.updateMatrix();batch.setMatrixAt(i,dummy.matrix);}batch.computeBoundingSphere();group.add(batch);
 const grassCanvas=document.createElement('canvas');grassCanvas.width=grassCanvas.height=256;const gc=grassCanvas.getContext('2d'),pixels=gc.createImageData(256,256);for(let y=0;y<256;y++)for(let x=0;x<256;x++){const n=Math.sin(x*17.13+y*31.57)*43758.5,f=n-Math.floor(n),g=.75+.25*f,k=(y*256+x)*4;pixels.data[k]=125*g;pixels.data[k+1]=156*g;pixels.data[k+2]=92*g;pixels.data[k+3]=255;}gc.putImageData(pixels,0,0);const grassMap=new THREE.CanvasTexture(grassCanvas);grassMap.colorSpace=THREE.SRGBColorSpace;grassMap.wrapS=grassMap.wrapT=THREE.RepeatWrapping;grassMap.repeat.set(45,45);
 const lawn=new THREE.Mesh(new THREE.CircleGeometry(55,80),new THREE.MeshBasicMaterial({map:grassMap,color:'#ffffff',toneMapped:false}));lawn.rotation.x=-Math.PI/2;lawn.position.y=-.04;group.add(lawn);
 const light=new THREE.HemisphereLight('#fffdf4','#7c8b65',1.8);group.add(light);
 const route=new THREE.CatmullRomCurve3([V(0,3.5,-87),V(3,2,-103),V(6,3.6,-119),V(6.5,7.3,-131),V(4.5,10,-141),V(-5,10,-146),V(7,3,-127)],false,'catmullrom',.35);
 const gaze=new THREE.CatmullRomCurve3([V(2.7,.7,-104),V(1,5,-130),V(1,8,-139),V(-1,11,-144),V(-4,13,-152),V(0,11,-140),V(9,4,-143)],false,'catmullrom',.35);
 return {group,update(t,time){group.visible=true;const day=THREE.MathUtils.smoothstep(t,.52,.83);leafMaterial.color.lerpColors(new THREE.Color('#13132b'),new THREE.Color('#dce8c9'),day);bark.color.lerpColors(new THREE.Color('#2d2343'),new THREE.Color('#b9b3a5'),day);light.intensity=.15+day*1.65;lawn.material.color.lerpColors(new THREE.Color('#15243b'),new THREE.Color('#ffffff'),day);batch.rotation.y=Math.sin(time*.16)*.002;},cameraAt(t,position,lookAt){if(t<=.79)return;const p=THREE.MathUtils.clamp((t-.79)/.21,0,1),blend=THREE.MathUtils.smoothstep(t,.79,.835);position.lerp(route.getPoint(p),blend);lookAt.lerp(gaze.getPoint(p),blend);},stats:{mode:'world-space 3D branches with imagegen foliage',travel:route.getLength()}};
}
