import * as THREE from 'three';

// Independent branch skeletons and branch-tip foliage; existing terrain anchors stay fixed.
export function createRealisticWoodland(sites,manager){
 const group=new THREE.Group();group.name='Varied conical spruce woodland';
 const atlas=new THREE.TextureLoader(manager).load('assets/worlds/roadside-foliage147.webp');atlas.colorSpace=THREE.SRGBColorSpace;atlas.anisotropy=16;
 const barkMap=new THREE.TextureLoader(manager).load('assets/worlds/banyan-bark144.webp');barkMap.colorSpace=THREE.SRGBColorSpace;barkMap.wrapS=barkMap.wrapT=THREE.RepeatWrapping;barkMap.repeat.set(1,3);
 let seed=93171;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const positions=[],normals=[],uvs=[],colors=[],indices=[],leaves=[[],[],[],[]],treeInfo=[];
 const keyLight=new THREE.Vector3(-.4,.8,.5).normalize();let limbCount=0;
 function limb(points,r0,r1,segments=7){
  const curve=new THREE.CatmullRomCurve3(points),offset=positions.length/3,radial=r0<.025?3:r0<.07?5:8,length=curve.getLength();
  for(let j=0;j<=segments;j++){
   const t=j/segments,p=curve.getPoint(t),tangent=curve.getTangent(t).normalize(),axis=Math.abs(tangent.y)>.94?new THREE.Vector3(1,0,0):new THREE.Vector3(0,1,0),u=new THREE.Vector3().crossVectors(tangent,axis).normalize(),v=new THREE.Vector3().crossVectors(tangent,u).normalize();
   const radius=THREE.MathUtils.lerp(r0,r1,t)*(1+.025*Math.sin(j*2.1+limbCount));
   for(let k=0;k<=radial;k++){
    const a=k/radial*Math.PI*2,n=u.clone().multiplyScalar(Math.cos(a)).addScaledVector(v,Math.sin(a)),q=p.clone().addScaledVector(n,radius),light=.72+.27*Math.max(0,n.dot(keyLight));
    positions.push(q.x,q.y,q.z);normals.push(n.x,n.y,n.z);uvs.push(k/radial,t*length*.8);colors.push(light,light,light);
    if(j<segments&&k<radial){const i=offset+j*(radial+1)+k;indices.push(i,i+radial+1,i+1,i+1,i+radial+1,i+radial+2);}
   }
  }limbCount++;
 }
 sites.forEach((p,index)=>{
  const h=p.height,tiers=9+Math.floor(random()*6),spread=Math.min(1.65,h*(.22+random()*.055)),base=.09+random()*.065,heading=random()*6.283,bend=(random()-.5)*.22,radius=h*(.018+random()*.006);
  const point=f=>new THREE.Vector3(p.x+bend*f*f,p.floor+h*f,p.z+bend*.4*f*f);
  limb([new THREE.Vector3(p.x,p.floor-.08,p.z),point(.35),point(.7),point(.99)],radius,radius*.008,16);
  for(let tier=0;tier<tiers;tier++){
   const f=base+(tier+(random()-.5)*.24)/tiers*(.95-base),width=spread*Math.pow((1-f)/(1-base),.83)*( .86+random()*.22),arms=4+Math.floor(random()*2);
   for(let arm=0;arm<arms;arm++){
    const a=heading+arm/arms*Math.PI*2+tier*1.39+(random()-.5)*.5,reach=width*(.78+random()*.22),root=point(f),tip=root.clone().add(new THREE.Vector3(Math.cos(a)*reach,-h*(.015+random()*.018),Math.sin(a)*reach));
    limb([root,root.clone().lerp(tip,.55).add(new THREE.Vector3(0,-h*.025,0)),tip],radius*(1-f)*.30,radius*.009,5);
    for(let k=0;k<4;k++){
     const q=.20+k*.235,center=root.clone().lerp(tip,q);center.y+=h*.008;
     const size=Math.min(.85,reach*.82+.18)*( .88+random()*.24),r=Math.hypot(center.x-p.x,center.z-p.z),limit=1.90-size*.6;
     if(r>limit){center.x=p.x+(center.x-p.x)*limit/r;center.z=p.z+(center.z-p.z)*limit/r;}
     leaves[Math.floor(random()*2)].push({x:center.x,y:center.y,z:center.z,size,a,tilt:-.45+(random()-.5)*.65,roll:(random()-.5)*.2,shade:.66+random()*.34});
    }
   }
  }
  for(let k=0;k<2;k++)leaves[k%2].push({x:p.x+bend,y:p.floor+h*(.94+k*.008),z:p.z+bend*.4,size:h*.055*(1-k*.30),a:heading+k*2.4,tilt:0,roll:.8,shade:.95});
  treeInfo.push({x:p.x,z:p.z,floor:p.floor,height:h,type:'conical-spruce',crownBase:base*h,tiers,spread,heading});
 });
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeBoundingSphere();
 const wood=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:barkMap,color:'#b2a0b8',vertexColors:true,toneMapped:false}));wood.name='Continuous tapered branch skeletons';group.add(wood);
 const dummy=new THREE.Object3D();
 for(let variant=0;variant<2;variant++){
  const geometry=new THREE.PlaneGeometry(1,.62,2,2),uv=geometry.attributes.uv,pos=geometry.attributes.position;
  for(let i=0;i<uv.count;i++){
   uv.setXY(i,(uv.getX(i)*.96+.02+variant%2)/2,(uv.getY(i)*.96+.02+1-Math.floor(variant/2))/2);
   const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,.16*x*x+.035*Math.sin((y+.5)*Math.PI));
  }geometry.computeVertexNormals();
  const material=new THREE.MeshBasicMaterial({map:atlas,alphaTest:.25,alphaToCoverage:true,side:THREE.DoubleSide,color:'#ffffff',toneMapped:false});
  const batch=new THREE.InstancedMesh(geometry,material,leaves[variant].length);batch.name='Individual broadleaf blades '+variant;
  leaves[variant].forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(p.tilt,p.a,p.roll);dummy.scale.setScalar(p.size);dummy.updateMatrix();batch.setMatrixAt(i,dummy.matrix);batch.setColorAt(i,new THREE.Color().setScalar(p.shade));});batch.computeBoundingSphere();group.add(batch);
 }
 group.userData={treeCount:sites.length,crownClusters:leaves.reduce((n,a)=>n+a.length,0),limbCount,trees:treeInfo,style:'irregular-conical-spruce159'};
 return group;
}
