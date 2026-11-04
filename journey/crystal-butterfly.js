import * as THREE from 'three';

// Frozen geometry from the approved crystal butterfly (9fb06a1).
// Independent from opening wing thickness, root clearance and animation edits.
export function createApprovedCrystalWings(crystal){
 const wings=new THREE.Group(),wingPivots=[];
 const palette={blue:'#516DB0',dusk:'#b892b8',white:'#ffffff'};
 const violet=crystal,blue=crystal,rose=crystal,pearl=crystal,gold=crystal;
 const atomGeometry=new THREE.IcosahedronGeometry(1,2);
 function orb(parent,x,y,z,radius,material){const mesh=new THREE.Mesh(atomGeometry,material);mesh.position.set(x,y,z);mesh.scale.setScalar(radius);parent.add(mesh);return mesh;}
 function tube(parent,points,radius,material,segments=100){const curve=new THREE.CatmullRomCurve3(points),mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,segments,radius,12,false),material);parent.add(mesh);return mesh;}
const foreOutline=new THREE.CatmullRomCurve3([new THREE.Vector3(.12,.28,0),new THREE.Vector3(.9,2.0,0),new THREE.Vector3(2.8,2.75,0),new THREE.Vector3(3.05,1.85,0),new THREE.Vector3(2.15,.65,0),new THREE.Vector3(.12,.12,0)],true,'catmullrom',.25);
const hindOutline=new THREE.CatmullRomCurve3([new THREE.Vector3(.12,.12,0),new THREE.Vector3(1.1,.35,0),new THREE.Vector3(2.15,-.55,0),new THREE.Vector3(1.65,-1.7,0),new THREE.Vector3(.8,-1.65,0),new THREE.Vector3(.12,-.2,0)],true,'catmullrom',.25);
function wingPoint(u,v,side,hind){
 const edge=(hind?hindOutline:foreOutline).getPoint(v),rootY=hind?-.05:.25;
 return new THREE.Vector3(side*(.12+(edge.x-.12)*u),rootY+(edge.y-rootY)*u,Math.sin(u*Math.PI)*.32+Math.pow(u,3)*(.18+Math.sin(v*7)*.10)+Math.pow(u,9)*Math.sin(v*48)*.025+(hind?-.12:0));
}

for(const side of [-1,1])for(const hind of [false,true]){
 const pivot=new THREE.Group();pivot.userData={side,hind};wings.add(pivot);wingPivots.push(pivot);
 const verts=[],uvs=[],indices=[],colors=[],U=32,V=44,layerSize=(U+1)*(V+1),c1=new THREE.Color(palette.blue),c2=new THREE.Color(palette.dusk);
 for(let layer=0;layer<2;layer++)for(let j=0;j<=V;j++)for(let i=0;i<=U;i++){
  const u=i/U,v=j/V,p=wingPoint(u,v,side,hind);p.z+=(layer?-.012:.012);verts.push(p.x,p.y,p.z);uvs.push(u,v);
  const c=c1.clone().lerp(c2,.18+u*.58+Math.sin(v*8)*.08);colors.push(c.r,c.g,c.b);
  if(i<U&&j<V){const n=layer*layerSize+j*(U+1)+i;layer?indices.push(n,n+U+2,n+1,n,n+U+1,n+U+2):indices.push(n,n+1,n+U+2,n,n+U+2,n+U+1);}
 }
 const edge=[];for(let i=0;i<=U;i++)edge.push(i);for(let j=1;j<=V;j++)edge.push(j*(U+1)+U);for(let i=U-1;i>=0;i--)edge.push(V*(U+1)+i);for(let j=V-1;j>0;j--)edge.push(j*(U+1));
 for(let i=0;i<edge.length;i++){const a=edge[i],b=edge[(i+1)%edge.length];indices.push(a,a+layerSize,b+layerSize,a,b+layerSize,b);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(new Float32Array(verts.length),3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const material=crystal;const surface=new THREE.Mesh(geometry,material);surface.userData.wingSurface=true;pivot.add(surface);
 for(let j=1;j<11;j++){
  const v=j/11,points=Array.from({length:33},(_,k)=>{const u=k/32,p=wingPoint(u,v+Math.sin(u*Math.PI)*.022,side,hind);p.z+=.019;return p;});tube(pivot,points,.007,pearl,42);
  for(const branch of [-1,1]){const pts=Array.from({length:18},(_,k)=>{const u=.5+k/17*.48,p=wingPoint(u,v+branch*(u-.5)*.12,side,hind);p.z+=.02;return p;});tube(pivot,pts,.0035,rose,24);}
 }
 tube(pivot,Array.from({length:81},(_,i)=>wingPoint(1,i/80,side,hind)),.012,rose,96);
}
const thorax=orb(wings,0,.15,.12,.23,violet);thorax.scale.multiply(new THREE.Vector3(.7,1.8,.8));
for(let i=0;i<10;i++){const segment=orb(wings,0,-.1-i*.115,.08,.108-i*.006,pearl);segment.scale.y=1.2*(.108-i*.006);}
orb(wings,0,.6,.12,.14,pearl);
for(const side of [-1,1]){tube(wings,[new THREE.Vector3(side*.06,.69,.12),new THREE.Vector3(side*.16,.98,.16),new THREE.Vector3(side*.36,1.18,.2)],.012,gold,30);orb(wings,side*.36,1.18,.2,.025,gold);for(let j=0;j<3;j++)tube(wings,[new THREE.Vector3(0,.2-j*.1,.15),new THREE.Vector3(side*.3,-.05-j*.16,.26),new THREE.Vector3(side*.45,-.25-j*.2,.08)],.009,violet,24);}
 return wings;
}
