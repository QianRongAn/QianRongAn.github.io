import * as THREE from 'three';

// Position-based variation stays fixed while scrolling and preserves the planting layout.
function variation(x,y,z,salt){const n=Math.sin(x*127.1+y*311.7+z*74.7+salt*19.19)*43758.5453;return n-Math.floor(n);}
export function meadowBloomFacing(x,y,z){
 // Restore the original modest x/z lean and independent azimuth; never aim at the camera.
 return new THREE.Quaternion().setFromEuler(new THREE.Euler((variation(x,y,z,1)-.5)*.85,variation(x,y,z,2)*Math.PI*2,(variation(x,y,z,3)-.5)*.75));
}
export function meadowPlantRotation(x,z){
 return new THREE.Euler((variation(x,0,z,4)-.5)*.20,variation(x,0,z,5)*Math.PI*2,(variation(x,0,z,6)-.5)*.20);
}
