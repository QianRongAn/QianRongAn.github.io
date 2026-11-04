import * as THREE from 'three';
import {createVideoScrubber} from './scroll-video.js';

// Actual generated camera footage; the confirmed image is the loading poster.
export function createBanyanClearing(camera,manager){
 const group=new THREE.Group();group.name='Scroll-scrubbed banyan camera film';
 let ready=false;const texture=new THREE.TextureLoader(manager).load('assets/worlds/banyan-daylight.webp',()=>ready=true);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
 const source='assets/worlds/banyan-flight148.mp4',video=document.createElement('video');video.muted=true;video.playsInline=true;video.preload='auto';video.setAttribute('playsinline','');
 const scrubber=createVideoScrubber(video),stats={mode:'poster-loading',duration:0,currentTime:0,targetTime:0,width:0,height:0};let videoReady=false,objectUrl;
 const uniforms={videoSource:{value:0},map:{value:texture},opacity:{value:0},clock:{value:0},drift:{value:new THREE.Vector2()},crop:{value:new THREE.Vector2(1,1)}};
 const geometry=new THREE.PlaneGeometry(2,2);
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,depthTest:false,uniforms,vertexShader:'varying vec2 tex;void main(){tex=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D map;uniform float videoSource;uniform float opacity;uniform float clock;uniform vec2 drift;uniform vec2 crop;varying vec2 tex;
 void main(){vec2 uv=(tex-.5)*crop+.5;vec4 sampled=texture2D(map,uv);if(videoSource>.5)sampled=sRGBTransferEOTF(sampled);gl_FragColor=vec4(sampled.rgb,opacity);
 #include <colorspace_fragment>
 }`});
 const surface=new THREE.Mesh(geometry,material);surface.position.z=-120;surface.renderOrder=900;surface.frustumCulled=false;group.add(surface);group.visible=false;
 video.addEventListener('seeked',()=>{if(videoReady)uniforms.map.value.needsUpdate=true;});
 manager?.itemStart(source);
 const videoPrepared=(async()=>{
  try{
   const response=await fetch(source);if(!response.ok)throw new Error('Banyan video '+response.status);objectUrl=URL.createObjectURL(await response.blob());
   await new Promise((resolve,reject)=>{video.addEventListener('loadeddata',resolve,{once:true});video.addEventListener('error',()=>reject(new Error('Banyan video decoding failed')),{once:true});video.src=objectUrl;video.load();});
   try{await video.play();video.pause();}catch{video.pause();}
   if(video.currentTime>1/1000)await new Promise(resolve=>{video.addEventListener('seeked',resolve,{once:true});video.currentTime=0;});
   const film=new THREE.VideoTexture(video);film.colorSpace=THREE.SRGBColorSpace;film.minFilter=film.magFilter=THREE.LinearFilter;film.needsUpdate=true;uniforms.map.value=film;uniforms.videoSource.value=1;videoReady=true;ready=true;stats.mode='scroll-video';stats.duration=video.duration;stats.width=video.videoWidth;stats.height=video.videoHeight;
  }catch(error){stats.mode='poster-fallback';stats.error=String(error);console.warn('Banyan video unavailable',error);}
  finally{manager?.itemEnd(source);}
 })();
 return {group,ready:videoPrepared,update(t,time){const fade=(ready?1:0)*THREE.MathUtils.smoothstep(t,.79,.86);group.visible=fade>.001;uniforms.opacity.value=fade;uniforms.clock.value=time;const h=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*120;surface.scale.set(h*camera.aspect*.5005,h*.5005,1);const aspect=camera.aspect,photoAspect=16/9;uniforms.crop.value.set(aspect<photoAspect?aspect/photoAspect:1,aspect>photoAspect?photoAspect/aspect:1);if(videoReady){scrubber.setProgress(THREE.MathUtils.clamp((t-.84)/(.9925-.84),0,1));stats.currentTime=video.currentTime;stats.targetTime=scrubber.targetTime;}},stats};
}
