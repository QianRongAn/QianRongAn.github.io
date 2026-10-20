/* A short source-video study becomes a particle handoff into the live 3D scene. */
(function () {
 'use strict';
 if(document.documentElement.classList.contains('skip-hero')||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))return;
 var overlay=document.createElement('section');overlay.className='particle-prelude';overlay.hidden=true;
 overlay.setAttribute('aria-label','Particle butterfly introduction');
 overlay.innerHTML='<div class="particle-prelude-label">NAN WANG <span>COMPUTATIONAL BIOLOGY · BIOMEDICAL AI</span></div><video muted playsinline preload="auto" poster="media/particle-butterfly-poster.jpg"><source src="media/particle-butterfly-prelude.mp4" type="video/mp4"></video><canvas aria-hidden="true"></canvas><div class="particle-prelude-caption">Life, in <i>patterns.</i></div><div class="particle-prelude-track"><span></span></div><button type="button">Skip intro ↗</button>';
 document.body.appendChild(overlay);
 var video=overlay.querySelector('video'),canvas=overlay.querySelector('canvas'),ctx=canvas.getContext('2d'),track=overlay.querySelector('.particle-prelude-track span');
 var poster=new Image();poster.src='media/particle-butterfly-poster.jpg';
 var playbackStarted=0,failedAt=0;
 var particles=[],active=false,burstAt=0,frame=0,started=0,continuation=null,didContinue=false,timer;
 function continueOnce(){if(didContinue)return;didContinue=true;continuation?.();}
 function cleanup(){cancelAnimationFrame(frame);clearTimeout(timer);video.pause();overlay.hidden=true;overlay.classList.remove('is-bursting');active=false;document.documentElement.classList.remove('particle-prelude-active');removeEventListener('wheel',guard,true);removeEventListener('keydown',keys,true);}
 function skip(){continueOnce();cleanup();}
 function guard(event){if(active){event.preventDefault();event.stopImmediatePropagation();}}
 function keys(event){if(event.key==='Escape'){event.preventDefault();skip();}else if(['PageDown','PageUp','ArrowDown','ArrowUp',' '].includes(event.key))guard(event);}
 function sample(){
  particles=[];if(!poster.complete||!poster.naturalWidth)return;
  var source=document.createElement('canvas');source.width=480;source.height=270;var sc=source.getContext('2d',{willReadFrequently:true});sc.drawImage(poster,0,0,480,270);var pixels=sc.getImageData(0,0,480,270).data;
  for(var y=16;y<256;y+=3)for(var x=12;x<468;x+=3){var k=(y*480+x)*4,r=pixels[k],g=pixels[k+1],b=pixels[k+2];if(b<55||b-r<8||Math.random()>.55)continue;var angle=Math.atan2(y-135,x-240),speed=80+Math.random()*300;particles.push({x:x/480,y:y/270,dx:Math.cos(angle)*speed,dy:Math.sin(angle)*speed,size:.5+Math.random()*1.3,color:'rgb('+r+','+g+','+b+')',phase:Math.random()*6.28});}
 }
 function burst(){if(burstAt||!active)return;burstAt=performance.now();sample();overlay.classList.add('is-bursting');continueOnce();}
 function render(now){
  if(!active)return;var t=(now-started)/1000;
  track.style.transform='scaleX('+Math.min(1,(video.currentTime||0)/(video.duration||3.9))+')';
  if(burstAt){var q=Math.min(1,(now-burstAt)/1150),ease=1-Math.pow(1-q,3),w=innerWidth,h=innerHeight;
   ctx.clearRect(0,0,w,h);var displayWidth=Math.min(w*1.05,1440),displayHeight=displayWidth*9/16,left=(w-displayWidth)/2,top=(h-displayHeight)/2;
   particles.forEach(function(p){ctx.globalAlpha=(1-q)*.85;ctx.fillStyle=p.color;var drift=Math.sin(p.phase+q*5)*q*30;ctx.fillRect(left+p.x*displayWidth+p.dx*ease+w*.14*ease,top+p.y*displayHeight+p.dy*ease+drift,p.size*(1+q),p.size*(1+q));});ctx.globalAlpha=1;
   overlay.style.setProperty('--prelude-fade',String(1-ease));if(q===1){cleanup();return;}
  }else if(failedAt&&now-failedAt>3300)burst();
  frame=requestAnimationFrame(render);
 }
 overlay.querySelector('button').addEventListener('click',skip);video.addEventListener('ended',burst);video.addEventListener('playing',function(){playbackStarted=performance.now();});video.addEventListener('error',function(){failedAt=performance.now();});
 window.ParticlePrelude={play:function(done){
  if(active)return;if(matchMedia('(prefers-reduced-motion:reduce)').matches){done();return;}
  continuation=done;didContinue=false;active=true;burstAt=0;failedAt=0;playbackStarted=0;started=performance.now();overlay.hidden=false;overlay.style.setProperty('--prelude-fade','1');document.documentElement.classList.add('particle-prelude-active');
  var ratio=Math.min(devicePixelRatio||1,1.25);canvas.width=Math.round(innerWidth*ratio);canvas.height=Math.round(innerHeight*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);video.currentTime=0;video.play().catch(function(){failedAt=performance.now();});addEventListener('wheel',guard,{capture:true,passive:false});addEventListener('keydown',keys,true);frame=requestAnimationFrame(render);timer=setTimeout(function(){if(!burstAt)burst();},20000);
 }};
})();
