import * as THREE from 'three';

const colors={gold:'#D0BA98',wine:'#91040C',violet:'#78628c',cream:'#e7d8b8',ink:'#4b3043'};
export function createProjectWorld(kind=0){
 const group=new THREE.Group(),moving=[];
 const mats=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new THREE.MeshPhysicalMaterial({color,roughness:.47,metalness:0,clearcoat:.22,clearcoatRoughness:.3})]));
 const sphere=new THREE.SphereGeometry(1,24,16),dummy=new THREE.Object3D();
 const random=(i,s=0)=>{const n=Math.sin(i*127.1+s*311.7)*43758.5453;return n-Math.floor(n);};
 function ball(parent,p,r,mat=mats.gold){const o=new THREE.Mesh(sphere,mat);o.position.copy(p);o.scale.setScalar(r);parent.add(o);return o;}
 function tube(parent,points,r=.04,mat=mats.gold){const o=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(18,points.length*3),r,8,false),mat);parent.add(o);return o;}
 function link(parent,a,b,mat=mats.gold,r=.018){return tube(parent,[a,a.clone().lerp(b,.5),b],r,mat);}
 function shell(parent,center,r=1,seed=0){const body=ball(parent,center,r,mats.violet);body.scale.y=r*.88;const atoms=new THREE.InstancedMesh(sphere,mats.gold,72);for(let i=0;i<72;i++){const y=1-i/35.5,a=i*2.39996,rad=Math.sqrt(Math.max(0,1-y*y));dummy.position.set(Math.cos(a)*rad*r,y*r*.88,Math.sin(a)*rad*r).add(center);dummy.scale.setScalar(.055+random(i,seed)*.06);dummy.updateMatrix();atoms.setMatrixAt(i,dummy.matrix);}parent.add(atoms);return body;}
 function dna(parent,x=0,height=5,phase=0){const a=[],b=[];for(let i=0;i<45;i++){const y=(i/44-.5)*height,t=i*.28+phase;a.push(new THREE.Vector3(x+Math.cos(t)*.63,y,Math.sin(t)*.63));b.push(new THREE.Vector3(x-Math.cos(t)*.63,y,-Math.sin(t)*.63));if(i%3===0){ball(parent,a[i],.10,mats.gold);ball(parent,b[i],.10,mats.wine);link(parent,a[i],b[i],mats.cream,.025);}}tube(parent,a,.055,mats.gold);tube(parent,b,.055,mats.wine);}
 if(kind===0){
  const points=Array.from({length:54},(_,i)=>{const a=i*2.39996,y=(random(i,4)-.5)*4.8,r=1.2+random(i,5)*.8;return new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);});
  points.forEach((p,i)=>{ball(group,p,.075+random(i,6)*.08);points.slice(i+1).forEach(q=>{if(p.distanceTo(q)<1.05)link(group,p,q,mats.violet,.009);});});
  const ribbon=Array.from({length:42},(_,i)=>new THREE.Vector3(Math.sin(i*.33)*.55,(i/41-.5)*4.6,Math.cos(i*.33)*.55));tube(group,ribbon,.12,mats.gold);ball(group,new THREE.Vector3(.3,.15,0),.28,mats.wine);
 }else if(kind===1){
  const paper=new THREE.PlaneGeometry(1.12,1.55,18,24);const pos=paper.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,.12*x*x+.04*Math.sin(y*2));}paper.computeVertexNormals();
  const paperMat=new THREE.MeshPhysicalMaterial({color:'#ece3ce',roughness:.87,side:THREE.DoubleSide});
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2,o=new THREE.Mesh(paper.clone(),paperMat);o.position.set(Math.cos(a)*2,Math.sin(a)*1.65,Math.sin(a*2)*.4);o.rotation.set(.12,a*.3,Math.sin(a)*.18);o.userData.rest=o.geometry.attributes.position.array.slice();group.add(o);moving.push(o);for(let line=0;line<9;line++){const bar=new THREE.Mesh(new THREE.PlaneGeometry(.78-(line%3)*.07,.018),mats.violet);bar.position.set(0,.4-line*.09,.025);o.add(bar);}link(group,o.position,new THREE.Vector3(0,0,.2),mats.gold,.012);}ball(group,new THREE.Vector3(0,0,.2),.45,mats.gold);
 }else if(kind===2){
  shell(group,new THREE.Vector3(-1.35,.2,0),1.05,2);shell(group,new THREE.Vector3(1.25,-.25,.15),.85,3);
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2,p=new THREE.Vector3(Math.cos(a)*.8,Math.sin(a)*.8,0);p.x-=1.35;ball(group,p,.10,mats.wine);}
  for(let i=0;i<11;i++){const p=new THREE.Vector3(-.55+i*.11,.2+Math.sin(i*.4)*.4,.8);const o=ball(group,p,.075,mats.wine);moving.push(o);}
 }else if(kind===3){dna(group);for(let i=0;i<32;i++){const p=new THREE.Vector3((random(i,1)-.5)*5,(random(i,2)-.5)*4,(random(i,3)-.5)*3);const o=ball(group,p,.025+random(i,4)*.05,i%3?mats.gold:mats.wine);moving.push(o);}}
 else if(kind===4){
  for(let i=0;i<110;i++){const a=i*2.39996,y=1-i/54.5,r=Math.sqrt(Math.max(0,1-y*y))*(1.4+random(i,1)*.2),p=new THREE.Vector3(Math.cos(a)*r,y*2,Math.sin(a)*r);if(p.x>.3&&Math.abs(p.y)<.65&&p.z>0)continue;ball(group,p,.10+random(i,3)*.09,i%5?mats.gold:mats.violet);}const ligand=new THREE.Group();ligand.position.set(.7,.1,1);for(let i=0;i<7;i++){const a=i/7*Math.PI*2,p=new THREE.Vector3(Math.cos(a)*.4,Math.sin(a)*.4,0);ball(ligand,p,.13,mats.wine);if(i)link(ligand,p,new THREE.Vector3(Math.cos((i-1)/7*Math.PI*2)*.4,Math.sin((i-1)/7*Math.PI*2)*.4,0),mats.wine,.04);}group.add(ligand);moving.push(ligand);
 }else if(kind===5){
  for(let row=0;row<5;row++)for(let col=0;col<8;col++)ball(group,new THREE.Vector3((col-3.5)*.49,-.7+(row%2)*.05,(row-2)*.45),.22,mats.gold);
  const barrier=new THREE.Mesh(new THREE.BoxGeometry(4.3,.055,2.5),mats.violet);barrier.position.y=-1.05;group.add(barrier);const invasive=new THREE.Group();invasive.position.set(.2,.9,.1);group.add(invasive);shell(invasive,new THREE.Vector3(0,0,0),.68,5);moving.push(invasive);
 }else if(kind===6){dna(group,-.9,4.4);dna(group,.9,4.4,1.4);for(let i=0;i<9;i++){const y=(i-4)*.45;ball(group,new THREE.Vector3(1.8,y,.4),.075,mats.wine);link(group,new THREE.Vector3(.9,y,.1),new THREE.Vector3(1.8,y,.4),mats.violet,.018);}}
 else{shell(group,new THREE.Vector3(-1.3,0,0),1,7);shell(group,new THREE.Vector3(1.3,0,0),1.15,8);for(let i=0;i<7;i++){const p=new THREE.Vector3(-.2,.12*(i-3),.7);const o=ball(group,p,.085,mats.wine);moving.push(o);link(group,p,new THREE.Vector3(.25,.13*(i-3),.7),mats.gold,.024);}}
 moving.forEach(o=>o.userData.baseY=o.position.y);
 group.rotation.set(.10,-.25,.03);
 return {group,update(progress,time){group.rotation.y=-.25+progress*.85+Math.sin(time*.17)*.035;group.rotation.z=.03+Math.sin(time*.12)*.018;moving.forEach((o,i)=>{if(kind===1){const a=o.geometry.attributes.position,rest=o.userData.rest;for(let k=0;k<a.count;k++){const x=rest[k*3],y=rest[k*3+1];a.setZ(k,rest[k*3+2]+.10*Math.sin(x*3+y*1.5+time+i)*x*x);}a.needsUpdate=true;o.geometry.computeVertexNormals();}else if(kind===2)o.position.x=-.55+i*.11+Math.sin(time*.6+i)*.025;else if(kind===4)o.rotation.y=Math.sin(time*.4)*.15;else if(kind===5)o.position.y=.9-progress*1.55;else o.position.y=o.userData.baseY+Math.sin(time*.7+i)*.035;});},dispose(){const geometries=new Set(),materials=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
