import * as THREE from 'three';

// Independent branch skeletons and branch-tip foliage; existing terrain anchors stay fixed.
export function createRealisticWoodland(sites,manager){
 const group=new THREE.Group();group.name='Individual-leaf lavender woodland';
 const atlas=new THREE.TextureLoader(manager).load('assets/worlds/roadside-leaves157.webp');atlas.colorSpace=THREE.SRGBColorSpace;atlas.anisotropy=16;
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
  const h=p.height,heading=random()*Math.PI*2,radius=h*(.022+random()*.007),spread=Math.min(1.55,h*.27),bend=.13+random()*.16;
  const point=t=>new THREE.Vector3(p.x+Math.sin(heading+t*1.2)*bend*t,p.floor+h*t,p.z+Math.cos(heading+t)*bend*t);
  const crownBase=.24+random()*.08;
  limb([new THREE.Vector3(p.x,p.floor-.08,p.z),point(.07),point(.25)],radius*1.4,radius*.8,6);
  limb([point(.22),point(.48),point(.64),point(.78)],radius*.83,radius*.035,14);
  function leaf(center,angle,length,shade){
   const r=Math.hypot(center.x-p.x,center.z-p.z),limit=1.90-length*.73;
   if(r>limit){center.x=p.x+(center.x-p.x)*limit/r;center.z=p.z+(center.z-p.z)*limit/r;}
   center.y=Math.min(p.floor+h-length*.2,center.y);
   leaves[Math.floor(random()*4)].push({x:center.x,y:center.y,z:center.z,size:length,a:angle,tilt:-Math.PI*.5+(random()-.5)*1.35,roll:(random()-.5)*1.0,shade});
  }
  const arms=14+index%4;
  for(let j=0;j<arms;j++){
   const f=crownBase+j/arms*.31,a=heading+j*2.39996+(random()-.5)*.75,ty=j>=arms-3?.81+(j-arms+3)*.045:.48+random()*.36;
   const reach=(j>=arms-3?.30+random()*.20:spread*(.72+random()*.28))*Math.sqrt(Math.max(.16,1-Math.pow((ty-.65)/.36,2))),base=point(f);
   const tip=point(ty).add(new THREE.Vector3(Math.cos(a)*reach,0,Math.sin(a)*reach));
   const middle=base.clone().lerp(tip,.52).add(new THREE.Vector3(0,-h*.025,0));
   limb([base,middle,tip],radius*(.40-.20*j/arms),radius*.025,8);
   for(let k=0;k<7;k++){
    const b=base.clone().lerp(tip,.28+k*.11),side=k%2?1:-1,ta=a+side*(.65+random()*.6);
    const end=b.clone().add(new THREE.Vector3(Math.cos(ta)*(.30+random()*.32),h*(.055+random()*.045),Math.sin(ta)*(.30+random()*.32)));
    limb([b,b.clone().lerp(end,.5),end],radius*.07,radius*.006,4);
    for(let t=0;t<3;t++){
     const shootBase=b.clone().lerp(end,.15+random()*.8),angle=ta+(t%2?1:-1)*(.65+random()*1.5);
     const shootEnd=shootBase.clone().add(new THREE.Vector3(Math.cos(angle)*(.23+random()*.16),.12+random()*.15,Math.sin(angle)*(.23+random()*.16)));
     limb([shootBase,shootEnd],radius*.014,radius*.002,2);
     for(let n=0;n<9;n++){
      const u=.08+random()*.98,leafSide=n%2?1:-1,la=angle+leafSide*(.9+random()*.8),len=.25+random()*.14;
      const center=shootBase.clone().lerp(shootEnd,u).add(new THREE.Vector3(Math.cos(la)*(.1+random()*.23),(random()-.3)*.35,Math.sin(la)*(.1+random()*.23)));
      const radial=Math.min(1,Math.hypot(center.x-p.x,center.z-p.z)/spread);leaf(center,la,len,(.72+random()*.28)*(.68+radial*.32));
     }
    }
   }
  }
  treeInfo.push({x:p.x,z:p.z,floor:p.floor,height:h,type:'individual-leaf-canopy',crownBase:crownBase*h});
 });
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeBoundingSphere();
 const wood=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:barkMap,color:'#b2a0b8',vertexColors:true,toneMapped:false}));wood.name='Continuous tapered branch skeletons';group.add(wood);
 const dummy=new THREE.Object3D();
 for(let variant=0;variant<4;variant++){
  const geometry=new THREE.PlaneGeometry(1,1,2,1),uv=geometry.attributes.uv,pos=geometry.attributes.position;
  for(let i=0;i<uv.count;i++){
   uv.setXY(i,(uv.getX(i)*.96+.02+variant%2)/2,(uv.getY(i)*.96+.02+1-Math.floor(variant/2))/2);
   const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,.16*x*x+.035*Math.sin((y+.5)*Math.PI));
  }geometry.computeVertexNormals();
  const material=new THREE.MeshBasicMaterial({map:atlas,alphaTest:.25,alphaToCoverage:true,side:THREE.DoubleSide,color:'#ffffff',toneMapped:false});
  const batch=new THREE.InstancedMesh(geometry,material,leaves[variant].length);batch.name='Individual broadleaf blades '+variant;
  leaves[variant].forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(p.tilt,p.a,p.roll);dummy.scale.setScalar(p.size);dummy.updateMatrix();batch.setMatrixAt(i,dummy.matrix);batch.setColorAt(i,new THREE.Color().setScalar(p.shade));});batch.computeBoundingSphere();group.add(batch);
 }
 group.userData={treeCount:sites.length,crownClusters:leaves.reduce((n,a)=>n+a.length,0),limbCount,trees:treeInfo,style:'individual-leaf-branch-grown157'};
 return group;
}
