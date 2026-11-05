import * as THREE from 'three';

// Independent branch skeletons and branch-tip foliage; existing terrain anchors stay fixed.
export function createRealisticWoodland(sites,manager){
 const group=new THREE.Group();group.name='Branch-grown lavender woodland';
 const atlas=new THREE.TextureLoader(manager).load('assets/worlds/roadside-foliage147.webp');atlas.colorSpace=THREE.SRGBColorSpace;atlas.anisotropy=16;
 const barkMap=new THREE.TextureLoader(manager).load('assets/worlds/banyan-bark144.webp');barkMap.colorSpace=THREE.SRGBColorSpace;barkMap.wrapS=barkMap.wrapT=THREE.RepeatWrapping;barkMap.repeat.set(1,3);
 let seed=93171;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const positions=[],normals=[],uvs=[],colors=[],indices=[],leaves=[[],[],[],[]],treeInfo=[];
 const keyLight=new THREE.Vector3(-.4,.8,.5).normalize();let limbCount=0;
 function limb(points,r0,r1,segments=7){
  const curve=new THREE.CatmullRomCurve3(points),offset=positions.length/3,radial=8,length=curve.getLength();
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
  const h=p.height,broad=index%7!==1,maxRadius=Math.min(1.48,h*(broad?.25:.245)),heading=random()*Math.PI*2,lean=.07+random()*.16,radius=h*(.027+random()*.009),crownBase=broad?.17+random()*.08:.10+random()*.055;
  const point=y=>new THREE.Vector3(p.x+Math.sin(heading+y*1.8)*lean*y,p.floor+h*y,p.z+Math.cos(heading+y*1.3)*lean*y);
  limb([new THREE.Vector3(p.x,p.floor-.10,p.z),point(.045),point(.18)],radius*1.35,radius*.84,5);
  limb([point(.16),point(.40),point(.69),point(.96)],radius*.87,radius*.065,13);
  function spray(center,size,a,shade){
   const limit=Math.max(.1,1.92-size*.52),dx=center.x-p.x,dz=center.z-p.z,r=Math.hypot(dx,dz);if(r>limit){center.x=p.x+dx*limit/r;center.z=p.z+dz*limit/r;}
   leaves[(broad?2:0)+Math.floor(random()*2)].push({x:center.x,y:Math.min(p.floor+h,center.y),z:center.z,size,a,tilt:(random()-.5)*1.8,roll:(random()-.5)*1.1,shade});
  }
  if(broad){
   const arms=7+index%4;
   for(let j=0;j<arms;j++){
    const a=heading+j*2.39996+(random()-.5)*.5,f=crownBase+j/arms*.45,reach=maxRadius*(.75+random()*.25),start=point(f),end=point(.56+j/arms*.35+(random()-.5)*.07).add(new THREE.Vector3(Math.cos(a)*reach,0,Math.sin(a)*reach)),middle=start.clone().lerp(end,.48).add(new THREE.Vector3(0,-h*.025,0));
    limb([start,middle,end],radius*(.45-.16*j/arms),radius*.055,8);
    for(let n=0;n<22;n++){
     const f=.24+random()*.83,center=start.clone().lerp(end,f).add(new THREE.Vector3((random()-.5)*.65,h*(.02+random()*.09),(random()-.5)*.65));
     spray(center,h*(.095+random()*.035),a+(random()-.5)*1.8,.84+random()*.16);
    }
    for(let k=0;k<4;k++){
     const angle=a+(k-1.5)*.55+(random()-.5)*.4,base=middle.clone().lerp(end,.15+k*.19),tip=base.clone().add(new THREE.Vector3(Math.cos(angle)*maxRadius*.30,h*(.08+random()*.07),Math.sin(angle)*maxRadius*.30));
     limb([base,base.clone().lerp(tip,.5).add(new THREE.Vector3(0,-h*.02,0)),tip],radius*.10,radius*.014,4);
     for(let n=0;n<6;n++)spray(base.clone().lerp(tip,.3+random()*.75).add(new THREE.Vector3((random()-.5)*.36,h*(random()-.5)*.07,(random()-.5)*.36)),h*(.075+random()*.035),angle+(random()-.5)*1.1,.84+random()*.16);
    }
   }
   for(let j=0;j<26;j++){const a=j*2.39996,r=maxRadius*.45*Math.sqrt(random());spray(point(.84+random()*.09).add(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r)),h*(.075+random()*.035),a,.86+random()*.14);}
  }else{
   const tiers=8+index%3;
   for(let j=0;j<tiers;j++){
    const f=crownBase+j/tiers*(.88-crownBase),reach=maxRadius*Math.pow(1-f,.72),arms=3+(j+index)%3;
    for(let k=0;k<arms;k++){
     const a=heading+k/arms*Math.PI*2+j*1.7,start=point(f),end=start.clone().add(new THREE.Vector3(Math.cos(a)*reach,-h*.035,Math.sin(a)*reach));
     limb([start,start.clone().lerp(end,.55).add(new THREE.Vector3(0,-h*.045,0)),end],radius*(.23*(1-f)),radius*.015,5);
     for(let n=0;n<15;n++)spray(start.clone().lerp(end,.24+random()*.85).add(new THREE.Vector3((random()-.5)*.30,h*(.015+random()*.065),(random()-.5)*.30)),h*(.09+random()*.04),a+(random()-.5)*1.0,.84+random()*.16);
    }
   }
   for(let j=0;j<10;j++)spray(point(.91+random()*.06),h*.075,heading+j*2.4,.9);
  }
  treeInfo.push({x:p.x,z:p.z,floor:p.floor,height:h,type:broad?'branching-canopy':'low-branch-fir',crownBase:crownBase*h});
 });
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeBoundingSphere();
 const wood=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:barkMap,color:'#b2a0b8',vertexColors:true,toneMapped:false}));wood.name='Continuous tapered branch skeletons';group.add(wood);
 const dummy=new THREE.Object3D();
 for(let variant=0;variant<4;variant++){
  const geometry=new THREE.PlaneGeometry(1,.76,2,2),uv=geometry.attributes.uv,pos=geometry.attributes.position;
  for(let i=0;i<uv.count;i++){uv.setXY(i,(uv.getX(i)*.96+.02+variant%2)/2,(uv.getY(i)*.96+.02+1-Math.floor(variant/2))/2);pos.setZ(i,.065*Math.sin((pos.getY(i)/.76+.5)*Math.PI)*(1-4*pos.getX(i)**2));}geometry.computeVertexNormals();
  const material=new THREE.MeshBasicMaterial({map:atlas,alphaTest:.32,alphaToCoverage:true,side:THREE.DoubleSide,color:'#ded6ef',toneMapped:false});
  const batch=new THREE.InstancedMesh(geometry,material,leaves[variant].length);batch.name='Branch-tip foliage '+variant;
  leaves[variant].forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(p.tilt,p.a,p.roll);dummy.scale.setScalar(p.size);dummy.updateMatrix();batch.setMatrixAt(i,dummy.matrix);batch.setColorAt(i,new THREE.Color().setScalar(p.shade));});batch.computeBoundingSphere();group.add(batch);
 }
 group.userData={treeCount:sites.length,crownClusters:leaves.reduce((n,a)=>n+a.length,0),limbCount,trees:treeInfo,style:'organic-branch-grown-crowns156'};
 return group;
}
