import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as THREE from 'three';
import {createSupermoon,createSaturn} from '../journey/celestial-bodies.js';

const texture=new THREE.Texture(),moon=createSupermoon(texture),saturn=createSaturn();
assert.equal(moon.material.uniforms.surface.value,texture);
assert.ok(!/horizon|discard|vWorld\.y/.test(moon.material.fragmentShader),'The moon must never use a horizontal height mask');
const source=readFileSync(new URL('../journey/main.js',import.meta.url),'utf8'),sandbox={THREE};
runInNewContext(source.slice(source.indexOf('const camera = new THREE.PerspectiveCamera'),source.indexOf('// A close, black organic silhouette'))+';globalThis.view=camera;globalThis.path=cameraCurve;globalThis.gaze=gazeCurve;',sandbox);
for(const t of [.325,.475,.56875,.60625,.64375,.79375,.83125]){
 const camera=sandbox.view;camera.position.copy(sandbox.path.getPoint(t));camera.lookAt(sandbox.gaze.getPoint(t));camera.updateMatrixWorld();
 const distance=camera.position.distanceTo(moon.position),radius=moon.geometry.parameters.radius;
 assert.ok(distance+radius<camera.far,'The entire moon must stay inside the far plane');
 assert.ok(distance-radius>camera.near,'The moon must stay beyond the near plane');
}
const globe=saturn.getObjectByName('Saturn globe'),rings=saturn.getObjectByName('Saturn rings');
assert.ok(rings.geometry.parameters.innerRadius>globe.geometry.parameters.radius,'Rings must not intersect the planet');
assert.ok(rings.geometry.parameters.outerRadius>globe.geometry.parameters.radius*2);
assert.equal(globe.material.uniforms.opacity,rings.material.uniforms.opacity,'Planet and rings must fade together');
assert.ok(globe.material.depthWrite&&!rings.material.depthWrite,'The globe must occlude the far side of the rings');
assert.ok(Math.abs(saturn.rotation.x)>.2&&Math.abs(saturn.rotation.z)>.2);
for(let t=.065;t<.67;t+=.01)assert.ok(globe.geometry.parameters.radius/sandbox.path.getPoint(t).distanceTo(saturn.position)<.055,'Saturn must stay small throughout its visible shots');
assert.ok(saturn.position.distanceTo(moon.position)>moon.geometry.parameters.radius+rings.geometry.parameters.outerRadius,'The planets and rings must not intersect');
console.log('Full lunar disc, camera clipping clearance and tilted Saturn ring occlusion passed');
