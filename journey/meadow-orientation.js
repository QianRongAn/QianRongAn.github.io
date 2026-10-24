import * as THREE from 'three';

// Position-based variation stays fixed while scrolling and preserves the planting layout.
function variation(x,y,z,salt){const n=Math.sin(x*127.1+y*311.7+z*74.7+salt*19.19)*43758.5453;return n-Math.floor(n);}
export function meadowBloomFacing(x,y,z){
 const azimuth=variation(x,y,z,1)*Math.PI*2;
 const tilt=THREE.MathUtils.degToRad(12+variation(x,y,z,2)*72);
 const normal=new THREE.Vector3(Math.sin(tilt)*Math.cos(azimuth),Math.cos(tilt),Math.sin(tilt)*Math.sin(azimuth));
 return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),normal)
  .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),variation(x,y,z,3)*Math.PI*2));
}
export function meadowPlantRotation(x,z){
 return new THREE.Euler((variation(x,0,z,4)-.5)*.20,variation(x,0,z,5)*Math.PI*2,(variation(x,0,z,6)-.5)*.20);
}
