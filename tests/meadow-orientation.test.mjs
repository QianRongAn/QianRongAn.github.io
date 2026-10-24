import assert from 'node:assert/strict';
import * as THREE from 'three';
import { meadowBloomFacing, meadowPlantRotation } from '../journey/meadow-orientation.js';
const quadrants=[0,0,0,0],tilts=[0,0,0],up=new THREE.Vector3(0,1,0);
for(let i=0;i<1200;i++){
 const x=Math.sin(i*1.37)*15,y=.55+(i%17)/10,z=12-i*.1;
 const rotation=meadowBloomFacing(x,y,z),normal=up.clone().applyQuaternion(rotation);
 assert(rotation.equals(meadowBloomFacing(x,y,z)),'A flower must retain its orientation on repeat visits');
 const tilt=THREE.MathUtils.radToDeg(normal.angleTo(up));
 assert(tilt>=12-1e-8&&tilt<=84+1e-8,'Blooms lean naturally without being inverted');
 quadrants[Math.floor((Math.atan2(normal.z,normal.x)+Math.PI)/(Math.PI/2))%4]++;
 tilts[tilt<36?0:tilt<60?1:2]++;
 const plant=meadowPlantRotation(x,z);
 assert(Math.abs(plant.x)<=.1&&Math.abs(plant.z)<=.1,'Whole plants remain upright');
 assert(plant.y>=0&&plant.y<Math.PI*2);
}
assert(quadrants.every(n=>n>230&&n<370),'Flowers must face all directions instead of one camera stop');
assert(tilts.every(n=>n>300),'Upright, inclined and side-facing blooms should all occur');
console.log('Natural flower orientations passed:',{quadrants,tilts});
