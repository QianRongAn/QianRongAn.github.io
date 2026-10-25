import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Exercise actual planting logic without starting the browser's WebGL scene.
const source = readFileSync(new URL('../journey/main.js', import.meta.url), 'utf8');
const planting = source.slice(source.indexOf('function meadowSite('), source.indexOf('function petalGeometry('));
let seed = 17;
const sandbox = {
 random: () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296),
 meadowPatches: [{ x: 4, z: -20, rx: 1, rz: 1 }],
 meadowViewClear: () => true,
 meadowTreeClear: () => true
};
runInNewContext('const botanicalOccupied = new Map();' + planting, sandbox);

// Dense filler beds must not reserve all the spaces needed by botanical varieties.
for (let i = 0; i < 500; i++) assert.ok(sandbox.meadowSite(i, false, .12));
const plants = Array.from({ length: 12 }, (_, i) => sandbox.meadowSite(i, true, .18));
assert.ok(plants.every(Boolean), 'Filler flowers crowded out the botanical clump');
for (const [i, plant] of plants.entries()) {
 assert.ok(Math.hypot(plant.x - 4, plant.z + 20) <= 1.000001, 'Plant escaped its clump');
 for (const other of plants.slice(i + 1)) assert.ok(Math.hypot(plant.x - other.x, plant.z - other.z) >= .36);
}
console.log('Dense beds preserve botanical space and keep each clump together');
