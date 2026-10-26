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
assert(size.x>3.9&&size.x<4.4);
assert(bounds.max.y>.3&&bounds.max.y<.45,'Rounded join must overlap the sacrum without a floating gap');
tail.traverse(part=>{if(part.isMesh){assert.equal(part.material.metalness,1);assert([...part.geometry.attributes.position.array].every(Number.isFinite));}});

const gallery=readFileSync(new URL('../js/pub-gallery.js',import.meta.url),'utf8');
const start=gallery.indexOf(' function select('),end=gallery.indexOf(' controls.querySelectorAll',start);
const sandbox={};
runInNewContext('let index=0,spineOffset=0,tailRevealed=false;const cards=Array(6);function draw(){}'+gallery.slice(start,end)+';function snapshot(){return{index,spineOffset,tailRevealed};}',sandbox);
for(let i=0;i<5;i++){sandbox.step(1);assert.equal(sandbox.snapshot().tailRevealed,false,'Tail appeared before the six papers were complete');}
assert.equal(sandbox.snapshot().index,5);
sandbox.step(1);assert.equal(sandbox.snapshot().tailRevealed,true);assert(sandbox.snapshot().spineOffset< -10);
sandbox.step(-1);assert.equal(sandbox.snapshot().index,5);assert.equal(sandbox.snapshot().tailRevealed,false);assert.equal(sandbox.snapshot().spineOffset,0);
sandbox.step(-1);assert.equal(sandbox.snapshot().index,4);
console.log('Mermaid proportions, metallic material, connected tail and reversible post-publication reveal passed', {spineHeight,tailHeight:size.y});
