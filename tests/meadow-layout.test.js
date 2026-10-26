import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import * as THREE from 'three';

// Exercise actual planting logic without starting the browser's WebGL scene.
const source = readFileSync(new URL('../journey/main.js', import.meta.url), 'utf8');
const planting = source.slice(source.indexOf('function meadowSite('), source.indexOf('function petalGeometry('));
let seed = 17;
const sandbox = {
 plantingRandom: () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296),
 clumpCenters: [],
 meadowPatches: [{ x: 4, z: -20, rx: 1, rz: 1 }],
 meadowViewClear: () => true,
 meadowTreeClear: () => true
};
runInNewContext('const botanicalOccupied = new Map();let largestFlowerRadius=0;' + planting, sandbox);

const clump={x:4,z:-20,rx:2.4,rz:2.1};sandbox.clumpCenters.push(clump);
const filler=Array.from({length:800},(_,i)=>sandbox.meadowSite(i,false,.32));
assert.ok(filler.every(Boolean));
for(const p of filler)assert.ok(Math.hypot((p.x-4)/2.4,(p.z+20)/2.1)>1,'Filler entered a botanical clump');
const plants = Array.from({ length: 8 }, (_, i) => sandbox.meadowSite(i, true, .4,clump));
assert.ok(plants.every(Boolean), 'Filler flowers crowded out the botanical clump');
for (const [i, plant] of plants.entries()) {
 assert.ok(Math.hypot((plant.x - 4)/2.4, (plant.z + 20)/2.1) <= 1.000001, 'Plant escaped its clump');
 for (const other of plants.slice(i + 1)) assert.ok(Math.hypot(plant.x - other.x, plant.z - other.z) >= .86-1e-9);
}
const all=[...filler.map(p=>({...p,radius:.32})),...plants.map(p=>({...p,radius:.4}))];
for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++)assert.ok(Math.hypot(all[i].x-all[j].x,all[i].z-all[j].z)>=all[i].radius+all[j].radius+.06-1e-9,'Flower crowns overlap');
assert.equal(new Set(filler.map(p=>Math.floor((p.x+12)/2))).size,12,'Scatter must fill the meadow rather than six lanes');

const sizing={THREE,meadowFloor:()=>-4,meadowViewpoints:[new THREE.Vector3(1,2,-30),new THREE.Vector3(-2,4,-70)]};
runInNewContext(source.slice(source.indexOf('function smallFlowerDimensions('),source.indexOf('let plantedFlowers=')),sizing);
for(const [x,z] of [[3,-66],[-5,-27],[8,-80]]){
 const rawScale=.72,rawHeight=1.45,bend=.8,near=Math.hypot(x-3.4,z+66)<7;
 const head=new THREE.Vector3(x+Math.cos(bend)*.28,-4+rawHeight*(near?.30:1),z-Math.sin(bend)*.28);
 const approvedScale=Math.min(rawScale*(near?.27:1),Math.min(...sizing.meadowViewpoints.map(v=>v.distanceTo(head)))*.06);
 const actual=sizing.smallFlowerDimensions(x,z,bend,rawScale,rawHeight);
 assert.equal(actual.scale,approvedScale,'Approved blossom size changed');
 assert.ok(actual.height<=actual.scale*1.15,'Stalk still towers over its blossom');
}
const palette={blue:'#516DB0',mist:'#a8a9bd'},stalkSandbox={THREE,palette};
runInNewContext(source.slice(source.indexOf('function shortenFlowerStalks('),source.indexOf("new GLTFLoader(sceneryManager).load('models/meadow-flowers")),stalkSandbox);
const geometry=new THREE.BufferGeometry();
geometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,0,.8,0,-.3,1,0,.3,1.2,0,0,1.3,.3],3));
const tint=new THREE.Color(palette.blue).lerp(new THREE.Color(palette.mist),.22);
geometry.setAttribute('color',new THREE.Float32BufferAttribute([...tint.toArray(),...tint.toArray(),1,.8,1,1,.8,1,1,.8,1],3));
geometry.computeBoundingBox();const before=geometry.attributes.position.array.slice();stalkSandbox.shortenFlowerStalks(geometry);
for(let i=2;i<5;i++){
 assert.equal(geometry.attributes.position.getX(i),before[i*3]);assert.equal(geometry.attributes.position.getZ(i),before[i*3+2]);
 assert.ok(Math.abs(geometry.attributes.position.getY(i)-(before[i*3+1]-.42))<1e-6,'Flower head distorted instead of translated');
}
const grassSandbox={meadowFloor:()=>0,clumpCenters:[clump],grassFlowerHeads:new Map([['0,0',[{head:{x:.5,y:.4,z:.5},scale:.5}]]])};
runInNewContext(source.slice(source.indexOf('function grassHeightAroundFlowers('),source.indexOf('// Restore the earlier tuft heights')),grassSandbox);
assert.equal(grassSandbox.grassHeightAroundFlowers(10,-90,1.1),1.1,'Open-ground grass lost its earlier height variation');
assert.equal(grassSandbox.grassHeightAroundFlowers(.5,.5,1.1),.4*.55,'Grass obscures a low flower crown');
assert.equal(grassSandbox.grassHeightAroundFlowers(4,-20,1.1),.28,'Grass crowds a botanical clump');
console.log('Natural scatter, clear clumps, fixed blossom sizes, shorter stalks and grass clearance passed');
