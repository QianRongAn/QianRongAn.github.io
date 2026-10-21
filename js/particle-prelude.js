/* A short source-video study becomes a particle handoff into the live 3D scene. */
(function () {
 'use strict';
 if(document.documentElement.classList.contains('skip-hero')||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))return;
 var overlay=document.createElement('section');overlay.className='particle-prelude';overlay.hidden=true;
 overlay.setAttribute('aria-label','Particle butterfly introduction');
 overlay.innerHTML='<div class="particle-prelude-label">NAN WANG <span>COMPUTATIONAL BIOLOGY · BIOMEDICAL AI</span></div><video muted playsinline preload="auto" poster="media/particle-butterfly-poster.jpg?v=final34"><source src="media/particle-butterfly-final-4k.mp4?v=4k35" type="video/mp4"></video><div class="particle-prelude-caption">Life, in <i>patterns.</i></div><div class="particle-prelude-track"><span></span></div><button type="button">Skip intro ↗</button>';
 document.body.appendChild(overlay);
 var video=overlay.querySelector('video'),track=overlay.querySelector('.particle-prelude-track span');
 var failedAt=0,preparation=null;
 function prepare(){if(preparation)return preparation;preparation=fetch(video.querySelector('source').src,{cache:'force-cache'}).then(function(response){if(!response.ok)throw new Error('Video preload failed');return response.blob();}).then(function(blob){return new Promise(function(resolve,reject){video.addEventListener('loadeddata',resolve,{once:true});video.addEventListener('error',reject,{once:true});video.src=URL.createObjectURL(blob);video.load();});}).catch(function(error){preparation=null;throw error;});return preparation;}
 var active=false,burstAt=0,frame=0,continuation=null,didContinue=false,timer;
 function continueOnce(){if(didContinue)return;didContinue=true;continuation?.();}
 function cleanup(){cancelAnimationFrame(frame);clearTimeout(timer);video.pause();overlay.hidden=true;overlay.classList.remove('is-bursting');active=false;document.documentElement.classList.remove('particle-prelude-active');removeEventListener('wheel',guard,true);removeEventListener('keydown',keys,true);}
 function skip(){continueOnce();cleanup();}
 function guard(event){if(active){event.preventDefault();event.stopImmediatePropagation();}}
 function keys(event){if(event.key==='Escape'){event.preventDefault();skip();}else if(['PageDown','PageUp','ArrowDown','ArrowUp',' '].includes(event.key))guard(event);}
 function burst(){if(burstAt||!active)return;burstAt=performance.now();continueOnce();}
 function render(now){
  if(!active)return;
  track.style.transform='scaleX('+Math.min(1,(video.currentTime||0)/(video.duration||5.06))+')';
  if(burstAt){var q=Math.min(1,(now-burstAt)/750),ease=q*q*(3-2*q);
   overlay.style.setProperty('--prelude-fade',String(1-ease));overlay.style.opacity=String(1-ease);if(q===1){cleanup();return;}
  }else if(failedAt&&now-failedAt>3300)burst();
  frame=requestAnimationFrame(render);
 }
 overlay.querySelector('button').addEventListener('click',skip);video.addEventListener('ended',burst);video.addEventListener('error',function(){failedAt=performance.now();});
 window.ParticlePrelude={play:function(done){
  if(active)return;if(matchMedia('(prefers-reduced-motion:reduce)').matches){done();return;}
  continuation=done;didContinue=false;active=true;burstAt=0;failedAt=0;overlay.hidden=false;overlay.style.opacity='1';overlay.style.setProperty('--prelude-fade','1');document.documentElement.classList.add('particle-prelude-active');
  overlay.classList.add('is-loading');overlay.setAttribute('aria-busy','true');prepare().then(function(){if(!active)return;overlay.classList.remove('is-loading');overlay.setAttribute('aria-busy','false');video.currentTime=0;return video.play();}).catch(function(){overlay.classList.remove('is-loading');failedAt=performance.now();});addEventListener('wheel',guard,{capture:true,passive:false});addEventListener('keydown',keys,true);frame=requestAnimationFrame(render);
 }};
})();
