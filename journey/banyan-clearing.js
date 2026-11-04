import * as THREE from 'three';

// Image-based 3D preserves the generated landscape on a shallow depth surface.
// Project illustrations use full procedural 3D in project-worlds.js.
export function createBanyanClearing(camera,manager){
 const group=new THREE.Group();group.name='Daylight banyan depth projection';
 let ready=false;const texture=new THREE.TextureLoader(manager).load('assets/worlds/banyan-daylight.webp',()=>ready=true);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
 const uniforms={map:{value:texture},opacity:{value:0},clock:{value:0},drift:{value:new THREE.Vector2()},crop:{value:new THREE.Vector2(1,1)}};
 const geometry=new THREE.PlaneGeometry(2,2,96,54),pos=geometry.attributes.position;
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),trunk=Math.exp(-x*x*13)*Math.exp(-(y+.05)*(y+.05)*2.4);pos.setZ(i,trunk*2.2+Math.max(0,-y)*.65);}
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,depthTest:false,uniforms,vertexShader:'varying vec2 tex;void main(){tex=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D map;uniform float opacity;uniform float clock;uniform vec2 drift;uniform vec2 crop;varying vec2 tex;
 void main(){vec2 uv=(tex-.5)*crop+.5+drift;float foliage=smoothstep(.40,.73,uv.y)*(1.-smoothstep(.87,1.,uv.y));uv.x+=sin(uv.y*46.+clock*.65)*.00022*foliage;uv.y+=sin(uv.x*55.+clock*.48)*.00018*foliage;vec3 rgb=texture2D(map,uv).rgb;float wash=(1.-smoothstep(.08,.58,tex.x))*.66;rgb=mix(rgb,vec3(.92,.94,.87),wash);gl_FragColor=vec4(rgb,opacity);
 #include <colorspace_fragment>
 }`});
 const surface=new THREE.Mesh(geometry,material);surface.position.z=-120;surface.renderOrder=900;surface.frustumCulled=false;group.add(surface);group.visible=false;
 return {group,update(t,time){const fade=(ready?1:0)*THREE.MathUtils.smoothstep(t,.805,.855)*(1-THREE.MathUtils.smoothstep(t,.95,.998));group.visible=fade>.001;uniforms.opacity.value=fade;uniforms.clock.value=time;const p=THREE.MathUtils.smoothstep(t,.805,.95),h=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*120;surface.scale.set(h*camera.aspect*.51,h*.51,1);const aspect=camera.aspect,photoAspect=16/9;uniforms.crop.value.set(aspect<photoAspect?aspect/photoAspect:1,aspect>photoAspect?photoAspect/aspect:1).multiplyScalar(.94-p*.035);uniforms.drift.value.set(Math.sin(p*Math.PI)*.009,(p-.5)*.014);},stats:{mode:'image-based depth projection'}};
}
