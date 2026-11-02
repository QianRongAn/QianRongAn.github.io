import * as THREE from 'three';

const vertex=`varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;void main(){vUv=uv;vec3 world=(modelMatrix*vec4(position,1.)).xyz;vNormal=normalize(mat3(modelMatrix)*normal);vView=normalize(cameraPosition-world);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

export function createSupermoon(texture){
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:true,uniforms:{surface:{value:texture},opacity:{value:0}},vertexShader:vertex,fragmentShader:`
 uniform sampler2D surface;uniform float opacity;varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;
 void main(){
  vec3 stone=texture2D(surface,vUv).rgb;
  float face=max(dot(normalize(vNormal),normalize(vView)),0.);
  vec3 color=(stone*1.5+vec3(.055,.052,.045))*(.86+.14*sqrt(face));
  gl_FragColor=vec4(color,opacity);
  #include <colorspace_fragment>
 }`});
 const moon=new THREE.Mesh(new THREE.SphereGeometry(35,96,64),material);
 moon.name='Supermoon';moon.position.set(-14,14,-185);moon.rotation.y=-Math.PI/2;
 return moon;
}

export function createSaturn(){
 const saturn=new THREE.Group();saturn.name='Saturn';saturn.position.set(-5,11.5,-130);saturn.rotation.set(.48,0,-.38);
 const opacity={value:1};
 const planetMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:true,uniforms:{opacity},vertexShader:vertex,fragmentShader:`
 uniform float opacity;varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;
 void main(){
  float latitude=vUv.y;float bands=.5+.5*sin(latitude*115.+.65*sin(latitude*37.));
  vec3 color=mix(vec3(.61,.47,.29),vec3(.92,.82,.60),.38+.48*bands);
  float sun=max(dot(normalize(vNormal),normalize(vec3(-.65,.45,.8))),0.);
  gl_FragColor=vec4(color*(.34+.66*sqrt(sun)),opacity);
  #include <colorspace_fragment>
 }`});
 const globe=new THREE.Mesh(new THREE.SphereGeometry(3.1,64,40),planetMaterial);globe.scale.y=.90;globe.name='Saturn globe';saturn.add(globe);
 const ringMaterial=new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,depthWrite:false,uniforms:{opacity},vertexShader:`varying vec2 ring;void main(){ring=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 uniform float opacity;varying vec2 ring;
 void main(){
  float radius=length(ring);float t=(radius-3.85)/(7.1-3.85);
  float bands=.63+.15*sin(radius*72.)+.12*sin(radius*181.);
  float division=1.-.92*(smoothstep(5.66,5.72,radius)-smoothstep(5.88,5.94,radius));
  float edge=smoothstep(0.,.025,t)*(1.-smoothstep(.975,1.,t));
  vec3 p=vec3(ring.x,0.,-ring.y),light=normalize(vec3(-.65,.45,.8));float along=dot(p,light);
  float shadow=along<0.?smoothstep(8.5,10.5,dot(p,p)-along*along):1.;
  vec3 color=mix(vec3(.52,.44,.34),vec3(.91,.85,.70),t)*mix(.35,1.,shadow);
  gl_FragColor=vec4(color,opacity*bands*division*edge);
  #include <colorspace_fragment>
 }`});
 const rings=new THREE.Mesh(new THREE.RingGeometry(3.85,7.1,384,6),ringMaterial);rings.rotation.x=-Math.PI/2;rings.name='Saturn rings';rings.renderOrder=1;saturn.add(rings);
 saturn.userData.opacity=opacity;
 return saturn;
}
