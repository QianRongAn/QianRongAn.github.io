import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { MeshoptSimplifier } from 'three/addons/libs/meshopt_simplifier.module.js';

const folder = process.argv[2];
const read = (file, Type) => { const b = fs.readFileSync(path.join(folder, file)); return new Type(b.buffer.slice(b.byteOffset, b.byteOffset + b.length)); };
const positions = read('positions.bin', Float32Array);
const indices = read('indices.bin', Uint32Array);
await MeshoptSimplifier.ready;
// A small error limit protects the fork and fine rays while reducing transfer size.
const [simplified, error] = MeshoptSimplifier.simplify(indices, positions, 3, 120000, .0005, ['LockBorder']);
const [remap, count] = MeshoptSimplifier.compactMesh(simplified);
const compact = new Float32Array(count * 3);
for (let i = 0; i < remap.length; i++) if (remap[i] < count) compact.set(positions.subarray(i * 3, i * 3 + 3), remap[i] * 3);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(compact, 3));
geometry.setIndex(new THREE.BufferAttribute(simplified, 1));
geometry.computeVertexNormals(); geometry.computeBoundingBox();
const buffers = [compact, geometry.attributes.normal.array, simplified].map(a => Buffer.from(a.buffer, a.byteOffset, a.byteLength));
let offset = 0;
const views = buffers.map((b, i) => { const view = { buffer: 0, byteOffset: offset, byteLength: b.length, target: i === 2 ? 34963 : 34962 }; offset += b.length; return view; });
const box = geometry.boundingBox;
const doc = {
  asset: { version: '2.0', generator: 'P 443 caudal scan extraction + meshoptimizer', copyright: 'Patrizia17 / Natural History Museum, University of Pisa; CC BY-SA 4.0' },
  scene: 0, scenes: [{ nodes: [0] }], nodes: [{ name: 'Balistes_capriscus_P443_caudal_region', mesh: 0 }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 }] }],
  materials: [{ name: 'Metal_display', pbrMetallicRoughness: { baseColorFactor: [.77, .77, .82, 1], metallicFactor: 1, roughnessFactor: .18 } }],
  buffers: [{ byteLength: offset }], bufferViews: views,
  accessors: [
    { bufferView: 0, componentType: 5126, count, type: 'VEC3', min: box.min.toArray(), max: box.max.toArray() },
    { bufferView: 1, componentType: 5126, count, type: 'VEC3' },
    { bufferView: 2, componentType: 5125, count: simplified.length, type: 'SCALAR' },
  ],
  extras: { source: 'https://commons.wikimedia.org/wiki/File:Balistes_capriscus_3d_scan_Natural_History_Museum_University_of_Pisa_P_443.stl', license: 'CC-BY-SA-4.0', specimen: 'P 443', ...JSON.parse(fs.readFileSync(path.join(folder, 'extraction.json'))), simplificationRelativeError: error, triangles: simplified.length / 3 },
};
let json = Buffer.from(JSON.stringify(doc));
json = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 32)]);
const bin = Buffer.concat(buffers), header = Buffer.alloc(12), jh = Buffer.alloc(8), bh = Buffer.alloc(8);
header.writeUInt32LE(0x46546c67); header.writeUInt32LE(2, 4); header.writeUInt32LE(28 + json.length + bin.length, 8);
jh.writeUInt32LE(json.length); jh.writeUInt32LE(0x4e4f534a, 4); bh.writeUInt32LE(bin.length); bh.writeUInt32LE(0x004e4942, 4);
fs.writeFileSync('models/balistes-caudal-fin.glb', Buffer.concat([header, jh, json, bh, bin]));
console.log('Tail GLB:', count, 'vertices,', simplified.length / 3, 'triangles, error', error, 'bytes', 28 + json.length + bin.length);
