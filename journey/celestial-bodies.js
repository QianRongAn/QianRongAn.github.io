import * as THREE from 'three';
import jupiterMap from './jupiter-texture.js';

const vertex=`varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;void main(){vUv=uv;vec3 world=(modelMatrix*vec4(position,1.)).xyz;vNormal=normalize(mat3(modelMatrix)*normal);vView=normalize(cameraPosition-world);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

export function createSupermoon(texture){
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{surface:{value:texture},opacity:{value:0}},vertexShader:vertex,fragmentShader:`
 uniform sampler2D surface;uniform float opacity;varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;
 void main(){
  vec3 stone=texture2D(surface,vUv).rgb;
  float face=max(dot(normalize(vNormal),normalize(vView)),0.);
  float rim=pow(1.-face,2.4);
  float relief=clamp(dot(stone,vec3(.2126,.7152,.0722)),0.,1.);
  vec3 color=mix(vec3(.54,.63,.76),vec3(.94,.98,1.),smoothstep(.12,.7,relief));
  color+=vec3(.12,.15,.18)*rim;
  gl_FragColor=vec4(color,opacity*(.55+.26*rim));
  #include <colorspace_fragment>
 }`});
 const moon=new THREE.Mesh(new THREE.SphereGeometry(29,128,80),material);
 moon.name='Supermoon';moon.position.set(-14,14,-185);moon.rotation.y=-Math.PI/2;
 return moon;
}

export function createSaturn(){
 const saturn=new THREE.Group();saturn.name='Saturn';saturn.position.set(-5,11.5,-130);saturn.rotation.set(.48,0,-.38);
 const opacity={value:1};
 const surface=typeof document==='undefined'?new THREE.Texture():new THREE.TextureLoader().load(jupiterMap);
 surface.colorSpace=THREE.SRGBColorSpace;surface.wrapS=THREE.RepeatWrapping;
 const planetMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:true,uniforms:{opacity,surface:{value:surface}},vertexShader:vertex,fragmentShader:`
 uniform sampler2D surface;uniform float opacity;varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;
 void main(){
  // Cassini map covers 60 S to 60 N; retain its latitude scale and soften polar extensions.
  vec2 mapUv=vec2(fract(vUv.x+.65),clamp((vUv.y-.5)*1.5+.5,.012,.988));
  vec3 color=texture2D(surface,mapUv).rgb;
  float polar=smoothstep(.65,.96,abs(vUv.y-.5)*2.);
  color=mix(color,vec3(.22,.21,.18),polar);
  float sun=max(dot(normalize(vNormal),normalize(vec3(-.65,.45,.8))),0.);
  gl_FragColor=vec4(color*(.42+.58*sqrt(sun)),opacity);
  #include <colorspace_fragment>
 }`});
 const globe=new THREE.Mesh(new THREE.SphereGeometry(3.1,64,40),planetMaterial);globe.scale.y=.90;globe.name='Saturn globe';saturn.add(globe);
 const ringMaterial=new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,depthWrite:false,uniforms:{opacity},vertexShader:`varying vec2 ring;void main(){ring=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 uniform float opacity;varying vec2 ring;
 void main(){
  float radius=length(ring);float t=(radius-3.85)/(7.1-3.85);
  float bands=.78+.045*sin(radius*72.)+.025*sin(radius*181.);
  float division=1.-.92*(smoothstep(5.66,5.72,radius)-smoothstep(5.88,5.94,radius));
  float edge=smoothstep(0.,.025,t)*(1.-smoothstep(.975,1.,t));
  vec3 p=vec3(ring.x,0.,-ring.y),light=normalize(vec3(-.65,.45,.8));float along=dot(p,light);
  float shadow=along<0.?smoothstep(8.5,10.5,dot(p,p)-along*along):1.;
  vec3 color=mix(vec3(.47,.30,.16),vec3(.88,.75,.53),t)*mix(.35,1.,shadow);
  gl_FragColor=vec4(color,opacity*bands*division*edge);
  #include <colorspace_fragment>
 }`});
 const rings=new THREE.Mesh(new THREE.RingGeometry(3.85,7.1,384,6),ringMaterial);rings.rotation.x=-Math.PI/2;rings.name='Saturn rings';rings.renderOrder=1;saturn.add(rings);
 const haloMaterial=new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,depthWrite:false,uniforms:{opacity},vertexShader:`varying vec2 ring;void main(){ring=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 uniform float opacity;varying vec2 ring;
 void main(){
  float radius=length(ring);
  float glow=exp(-pow((radius-7.22)/.105,2.));
  gl_FragColor=vec4(vec3(.93,.76,.48),opacity*.38*glow);
  #include <colorspace_fragment>
 }`});
 const halo=new THREE.Mesh(new THREE.RingGeometry(7.1,7.55,384,1),haloMaterial);halo.rotation.x=-Math.PI/2;halo.name='Saturn warm halo';halo.renderOrder=2;saturn.add(halo);
 saturn.userData.opacity=opacity;
 return saturn;
}
