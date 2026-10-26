import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createMermaidTail } from '../journey/mermaid-tail.js';

const material=new THREE.MeshPhysicalMaterial({metalness:1,roughness:.18});
const tail=createMermaidTail(material),bounds=new THREE.Box3().setFromObject(tail),size=bounds.getSize(new THREE.Vector3());
const bytes=readFileSync(new URL('../models/bodyparts3d-spine.glb',import.meta.url));
const spine=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const spineHeight=new THREE.Box3().setFromObject(spine.scene).getSize(new THREE.Vector3()).y;
assert(size.y/spineHeight>.6&&size.y/spineHeight<1,'Tail should have a mermaid proportion, not a small appended fin');
assert(size.x>6.2&&size.x<6.7,'Tail width must be 50% larger than the earlier version');
assert(bounds.max.y>.3&&bounds.max.y<.45,'Proximal bone must overlap the sacrum without a floating gap');
const kinds={};
tail.traverse(part=>{if(part.isMesh){assert.equal(part.material,material,'All bones share the spine metal');assert([...part.geometry.attributes.position.array].every(Number.isFinite));assert(part.userData.kind,'No skin, tail shell or fin membrane may be added');kinds[part.userData.kind]=(kinds[part.userData.kind]||0)+1;}});
assert.equal(kinds['caudal-vertebra'],23);
assert.equal(kinds['segmented-fin-ray'],19*15);
assert.equal(kinds['fin-ray-branch'],38);

const gallery=readFileSync(new URL('../js/pub-gallery.js',import.meta.url),'utf8');
const start=gallery.indexOf(' function select('),end=gallery.indexOf(' controls.querySelectorAll',start);
const sandbox={};
runInNewContext('let index=0,spineOffset=0,tailRevealed=false,tailStep=0;const tailSteps=5,cards=Array(6);function draw(){}'+gallery.slice(start,end)+';function snapshot(){return{index,spineOffset,tailRevealed,tailStep};}',sandbox);
for(let i=0;i<5;i++){sandbox.step(1);assert.equal(sandbox.snapshot().tailRevealed,false,'Tail appeared before the six papers were complete');}
assert.equal(sandbox.snapshot().index,5);
const camera=new THREE.PerspectiveCamera(40,16/9,.1,80);
const tip=new THREE.Vector3(0,(-4.76+bounds.min.y)*1.4,-.562*1.4);
for(let i=1;i<=5;i++){
 sandbox.step(1);const state=sandbox.snapshot();assert.equal(state.tailStep,i);assert.equal(state.tailRevealed,true);
 camera.position.set(0,state.spineOffset,16+6*i/5);camera.lookAt(0,state.spineOffset,0);camera.updateMatrixWorld();
 const projected=tip.clone().project(camera);
 assert(i<5?projected.y< -1:projected.y> -1,'The full fin must stay below the view until the fifth scroll');
}
sandbox.step(1);assert.equal(sandbox.snapshot().tailStep,5,'Scroll progress must stop at five');
for(let i=4;i>=0;i--){sandbox.step(-1);assert.equal(sandbox.snapshot().tailStep,i);assert.equal(sandbox.snapshot().index,5);}
assert.equal(sandbox.snapshot().tailRevealed,false);assert.equal(sandbox.snapshot().spineOffset,0);
sandbox.step(-1);assert.equal(sandbox.snapshot().index,4);
console.log('Mermaid proportions, metallic material, connected tail and reversible post-publication reveal passed', {spineHeight,tailHeight:size.y});
