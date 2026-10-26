import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const bytes = fs.readFileSync('models/balistes-caudal-fin.glb');
const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
assert.equal(json.extras.sourceSHA1, '6f78d2d7bd7ffcfc53e97e8b6c8a4b6f119b0eba');
assert.equal(json.extras.license, 'CC-BY-SA-4.0');
assert(json.extras.simplificationRelativeError <= .0005);
assert(bytes.length < 1100000);
const model = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length), '');
const bounds = new THREE.Box3().setFromObject(model.scene), size = bounds.getSize(new THREE.Vector3());
assert(size.x > 1.9 && size.x < 2.2 && size.y > 2.7 && size.y < 2.9);
assert(bounds.max.y < .04 && bounds.max.y > -.04, 'Proximal attachment stays at the origin');
model.scene.traverse(part => {
  if (!part.isMesh) return;
  const positions = part.geometry.attributes.position.array;
  const normals = part.geometry.attributes.normal.array;
  assert([...positions, ...normals].every(Number.isFinite));
  assert(part.geometry.index.array.every(i => i < positions.length / 3));
});
// The top of the extracted scan overlaps the sacrum tip, rather than floating below it.
assert(Math.abs(bounds.max.y - 4.76 - (-4.773757945)) < .06);
console.log('Museum tail provenance, geometry, transfer size and sacrum attachment verified');
