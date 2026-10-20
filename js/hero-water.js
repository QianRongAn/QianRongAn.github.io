/* Damped surface-wave simulation: interacting ripples refract the original artwork. */
(function(){
 'use strict';
 var hero=document.getElementById('heroScreen'),canvas=document.getElementById('heroWater');
 if(!hero||!canvas||document.documentElement.classList.contains('skip-hero'))return;
 var gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,premultipliedAlpha:false});if(!gl)return;
 var motion=matchMedia('(prefers-reduced-motion:reduce)'),image=new Image(),ready=false,stopped=false,frame=0,last=0,energy=0;
 var width=0,height=0,ratio=1,gw=0,gh=0,current,previous,pixels,rect={x:0,y:0,w:1,h:1},pointer=null,emitted=0;
 function compile(type,source){var sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);return gl.getShaderParameter(sh,gl.COMPILE_STATUS)?sh:null;}
 var vs=compile(gl.VERTEX_SHADER,'attribute vec2 position;varying vec2 screen;void main(){screen=position*.5+.5;gl_Position=vec4(position,0.,1.);}');
 var fs=compile(gl.FRAGMENT_SHADER,`precision highp float;
 uniform sampler2D artwork;uniform sampler2D surface;uniform vec2 size;uniform vec2 texel;uniform vec4 rect;varying vec2 screen;
 float heightAt(vec2 uv){vec2 h=texture2D(surface,clamp(uv,texel,1.-texel)).rg;return (h.r*65280.+h.g*255.-32768.)/4096.;}
 void main(){
 vec2 p=vec2(screen.x,1.-screen.y)*size;vec2 uv=(p-rect.xy)/rect.zw;
 if(any(lessThan(uv,vec2(0.)))||any(greaterThan(uv,vec2(1.)))){gl_FragColor=vec4(0.);return;}
 vec2 q=vec2(screen.x,1.-screen.y);
 vec2 slope=vec2(heightAt(q-vec2(texel.x,0.))-heightAt(q+vec2(texel.x,0.)),heightAt(q-vec2(0.,texel.y))-heightAt(q+vec2(0.,texel.y)))*.62;
 vec3 normal=normalize(vec3(slope,1.));vec2 offset=slope*32./rect.zw;
 vec3 color=texture2D(artwork,clamp(uv+offset,vec2(.001),vec2(.999))).rgb;
 vec3 light=normalize(vec3(-.45,-.65,1.));float shade=(dot(normal,light)-light.z)*.15;
 float reflection=pow(max(dot(reflect(vec3(0.,0.,-1.),normal),light),0.),70.)*.18;
 gl_FragColor=vec4(clamp(color+shade+reflection*min(length(slope)*4.,1.),0.,1.),1.);
 }`);
 if(!vs||!fs)return;
 var program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
 var buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 var loc=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 var u={};['artwork','surface','size','texel','rect'].forEach(function(k){u[k]=gl.getUniformLocation(program,k);});
 function texture(unit){var t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);return t;}
 var artTexture=texture(0),heightTexture=texture(1);gl.uniform1i(u.artwork,0);gl.uniform1i(u.surface,1);gl.clearColor(0,0,0,0);
 function clear(){gl.clear(gl.COLOR_BUFFER_BIT);canvas.style.visibility='hidden';}
 function resize(){
 if(stopped)return;width=hero.clientWidth;height=hero.clientHeight;ratio=Math.min(devicePixelRatio||1,1.25);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);gl.viewport(0,0,canvas.width,canvas.height);
 gw=256;gh=Math.max(64,Math.round(gw*height/width));current=new Float32Array(gw*gh);previous=new Float32Array(gw*gh);pixels=new Uint8Array(gw*gh*4);energy=0;
 gl.uniform2f(u.size,width,height);gl.uniform2f(u.texel,1/gw,1/gh);
 if(ready){var scale=Math.min(width/image.naturalWidth,height/image.naturalHeight);rect.w=image.naturalWidth*scale;rect.h=image.naturalHeight*scale;rect.x=(width-rect.w)/2;rect.y=(height-rect.h)/2;gl.uniform4f(u.rect,rect.x,rect.y,rect.w,rect.h);}clear();
 }
 function step(){
 var power=0;
 for(var y=1;y<gh-1;y++)for(var x=1;x<gw-1;x++){
 var i=y*gw+x,h=((current[i-1]+current[i+1]+current[i-gw]+current[i+gw])*.5-previous[i])*.986;
 var edge=Math.min(x,y,gw-1-x,gh-1-y);h*=Math.min(1,.90+edge*.0125);previous[i]=h;power+=h*h;
 }
 var swap=current;current=previous;previous=swap;energy=power;
 }
 function draw(now){
 frame=0;if(stopped||motion.matches||document.hidden){clear();return;}
 var steps=Math.min(3,Math.max(1,Math.round((now-last)/16.67)));last=now;for(var k=0;k<steps;k++)step();
 if(energy<.00003){clear();return;}
 for(var i=0;i<current.length;i++){var value=Math.max(0,Math.min(65535,Math.round(32768+current[i]*4096)));pixels[i*4]=value>>8;pixels[i*4+1]=value&255;pixels[i*4+3]=255;}
 gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,heightTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gw,gh,0,gl.RGBA,gl.UNSIGNED_BYTE,pixels);gl.drawArrays(gl.TRIANGLES,0,6);canvas.style.visibility='visible';frame=requestAnimationFrame(draw);
 }
 function impulse(e,amplitude){
 if(!ready||stopped||motion.matches||e.target.closest('a,button'))return;
 var bounds=hero.getBoundingClientRect(),cx=(e.clientX-bounds.left)/width*gw,cy=(e.clientY-bounds.top)/height*gh;
 for(var y=Math.max(1,Math.floor(cy-5));y<Math.min(gh-1,cy+5);y++)for(var x=Math.max(1,Math.floor(cx-5));x<Math.min(gw-1,cx+5);x++){var d=(x-cx)*(x-cx)+(y-cy)*(y-cy);current[y*gw+x]+=Math.exp(-d/3.5)*amplitude;}
 canvas.dataset.lastTrigger=e.type;if(!frame){last=performance.now();frame=requestAnimationFrame(draw);}
 }
 function move(e){if(e.pointerType==='touch')return;var now=performance.now(),distance=pointer?Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y):12;if(distance<5||now-emitted<55)return;pointer={x:e.clientX,y:e.clientY};emitted=now;impulse(e,Math.min(1,.4+distance/140));}
 function click(e){impulse(e,1.65);}
 function cancel(){cancelAnimationFrame(frame);frame=0;energy=0;if(current)current.fill(0);if(previous)previous.fill(0);clear();}
 function stop(){stopped=true;cancel();hero.removeEventListener('pointermove',move);hero.removeEventListener('click',click);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',cancel);motion.removeEventListener('change',cancel);}
 image.onload=function(){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,artTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);ready=true;canvas.dataset.ready='true';canvas.dataset.effect='damped-surface-waves';resize();};image.src='image/hero-background.jpg';
 hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('click',click);hero.addEventListener('pointerleave',function(){pointer=null;});hero.addEventListener('hero:dismiss',stop,{once:true});window.addEventListener('resize',resize);document.addEventListener('visibilitychange',cancel);motion.addEventListener('change',cancel);canvas.addEventListener('webglcontextlost',stop,{once:true});resize();
})();
