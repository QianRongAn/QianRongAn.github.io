import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as THREE from 'three';
import {planBotanicalClumps} from '../journey/meadow-clumps.js';

const main=readFileSync(new URL('../journey/main.js',import.meta.url),'utf8'),box={THREE};
const captionStart=main.indexOf('const captions ='),captionEnd=main.indexOf('\n];',captionStart)+3;
runInNewContext(main.slice(captionStart,captionEnd)+main.slice(main.indexOf('const cameraCurve ='),main.indexOf('// A close, black organic silhouette'))+main.slice(main.indexOf('function naturalMeadowFloor('),main.indexOf('const meadowViewpoints='))+';globalThis.floor=meadowFloor;globalThis.views=[.065,...captions.slice(1,17).map(c=>(c[0]+c[1])*.5)].map(t=>({position:cameraCurve.getPoint(t),gaze:gazeCurve.getPoint(t)}));',box);
const clumpSource=readFileSync(new URL('../journey/meadow-clumps.js',import.meta.url),'utf8');
runInNewContext(clumpSource.replace(/^import .*$/m,'').replace('export function','function').replace(/^ views.slice\(4,11\).*$/m,'')+';globalThis.baseline=planBotanicalClumps;',box);
function plan(fn){let seed=90283;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);return fn({species:['bellflower','cymbidium','daisy','chrysanthemum','evening_primrose','phalaenopsis','water_lily','gladiolus','camellia'],views:box.views,floor:box.floor,viewClear:()=>true,treeClear:()=>true,random});}
const before=plan(box.baseline),after=plan(planBotanicalClumps);
assert.deepEqual(JSON.parse(JSON.stringify(after.centers.slice(0,before.centers.length))),JSON.parse(JSON.stringify(before.centers)),'Infill must preserve the main flower clumps');
assert.ok(after.centers.length>before.centers.length,'Sparse pavilion approach needs additional clumps');
assert.ok(after.bySpecies.every(clumps=>clumps.length),'Every variety must retain a clump');
console.log('Pavilion infill adds clumps and preserves the main planting:',before.centers.length,'→',after.centers.length);
