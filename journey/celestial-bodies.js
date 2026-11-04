import * as THREE from 'three';
import jupiterMap from './jupiter-texture.js';

const ringNoise=`
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
 float strata(float r){return .48*noise(vec2(r*11.,4.))+.30*noise(vec2(r*43.,9.))+.22*noise(vec2(r*137.,2.));}
`;
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
 surface.colorSpace=THREE.SRGBColorSpace;surface.wrapS=THREE.RepeatWrapping;surface.anisotropy=8;
 const planetMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:true,uniforms:{opacity,surface:{value:surface}},vertexShader:vertex,fragmentShader:`
 uniform sampler2D surface;uniform float opacity;varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;
 void main(){
  // Full latitude/longitude map, sampled at its native resolution.
  vec2 mapUv=vec2(vUv.x+.11,vUv.y);
  vec3 color=texture2D(surface,mapUv).rgb;
  float sun=max(dot(normalize(vNormal),normalize(vec3(-.65,.45,.8))),0.);
  gl_FragColor=vec4(color*(.42+.58*sqrt(sun)),opacity);
  #include <colorspace_fragment>
 }`});
 const globe=new THREE.Mesh(new THREE.SphereGeometry(3.1,64,40),planetMaterial);globe.scale.y=.90;globe.name='Saturn globe';saturn.add(globe);
 const ringMaterial=new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,depthWrite:false,uniforms:{opacity},vertexShader:`varying vec2 ring;void main(){ring=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 uniform float opacity;varying vec2 ring;
 ${ringNoise}
 void main(){
  float radius=length(ring);float t=(radius-3.85)/(7.1-3.85);
  float density=strata(radius);
  float bands=mix(.28,.86,smoothstep(.10,.82,density));
  float angle=atan(ring.y,ring.x);
  float dust=noise(ring*125.);
  bands*=mix(.72,1.,dust)*(.88+.12*noise(vec2(angle*13.,radius*18.)));
  float division=1.-.92*(smoothstep(5.66,5.72,radius)-smoothstep(5.88,5.94,radius));
  float edge=smoothstep(0.,.065,t)*(1.-smoothstep(.91,1.,t));
  vec3 p=vec3(ring.x,0.,-ring.y),light=normalize(vec3(-.65,.45,.8));float along=dot(p,light);
  float shadow=along<0.?smoothstep(8.5,10.5,dot(p,p)-along*along):1.;
  vec3 color=mix(vec3(.37,.26,.16),vec3(.80,.69,.50),.32+.60*density)*mix(.35,1.,shadow);
  gl_FragColor=vec4(color,opacity*bands*division*edge);
  #include <colorspace_fragment>
 }`});
 const rings=new THREE.Mesh(new THREE.RingGeometry(3.85,7.1,384,6),ringMaterial);rings.rotation.x=-Math.PI/2;rings.name='Saturn rings';rings.renderOrder=1;saturn.add(rings);
 const haloMaterial=new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,depthWrite:false,uniforms:{opacity},vertexShader:`varying vec2 ring;void main(){ring=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 uniform float opacity;varying vec2 ring;
 ${ringNoise}
 void main(){
  float radius=length(ring);
  float angle=atan(ring.y,ring.x);
  float glow=exp(-pow((radius-7.12)/.17,2.));
  glow*=smoothstep(7.1,7.13,radius)*(1.-smoothstep(7.36,7.55,radius));
  glow*=strata(radius)*(.45+.55*noise(vec2(angle*17.,radius*39.)));
  gl_FragColor=vec4(vec3(.93,.76,.48),opacity*.16*glow);
  #include <colorspace_fragment>
 }`});
 const halo=new THREE.Mesh(new THREE.RingGeometry(7.1,7.55,384,1),haloMaterial);halo.rotation.x=-Math.PI/2;halo.name='Saturn warm halo';halo.renderOrder=2;saturn.add(halo);
 saturn.userData.opacity=opacity;
 return saturn;
}
