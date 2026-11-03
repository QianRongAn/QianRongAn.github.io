(function(){
'use strict';
const root=document.documentElement;
if(root.classList.contains('skip-hero')||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))return;
const overlay=document.createElement('section');overlay.className='particle-prelude';overlay.hidden=true;overlay.setAttribute('aria-label','Particle butterfly introduction');
overlay.innerHTML='<div class="particle-prelude-label">NAN WANG <span>COMPUTATIONAL BIOLOGY · BIOMEDICAL AI</span></div><video muted playsinline preload="none" poster="media/particle-butterfly-poster.jpg?v=final34"></video><div class="particle-prelude-caption">Life, in <i>patterns.</i></div><div class="particle-prelude-track"><span></span></div><div class="particle-prelude-status" role="status" aria-live="polite"></div><button type="button">Skip intro ↗</button>';
document.body.append(overlay);
const video=overlay.querySelector('video'),track=overlay.querySelector('.particle-prelude-track span'),status=overlay.querySelector('[role=status]');
let active=false,frame=0,preparation,continuation,transition,transitionAt=0,fadeAt=0,failedAt=0,lastTime=0,lastAdvance=0,prefetched=false;
function prepare(){if(preparation)return preparation;preparation=(window.preludeVideoDownload||fetch('media/particle-butterfly-final-4k.mp4?v=4k35',{cache:'force-cache',priority:'high'}).then(r=>{if(!r.ok)throw Error('Video download failed');return r.blob();})).then(blob=>new Promise((resolve,reject)=>{video.addEventListener('loadeddata',resolve,{once:true});video.addEventListener('error',reject,{once:true});video.src=URL.createObjectURL(blob);video.load();})).catch(e=>{preparation=null;throw e;});return preparation;}
function cleanup(){active=false;cancelAnimationFrame(frame);video.pause();overlay.hidden=true;overlay.classList.remove('is-loading');root.classList.remove('particle-prelude-active');removeEventListener('wheel',guard,true);removeEventListener('keydown',keys,true);}
function abort(){window.cancelJourneyIntro?.();cleanup();}
function handoff(){if(transition||!active)return transition;video.pause();transitionAt=performance.now();overlay.classList.add('is-loading');status.textContent='正在准备开场场景…';
 transition=Promise.resolve().then(()=>continuation?.()).catch(()=>window.cancelJourneyIntro?.()).finally(()=>{if(active){overlay.classList.remove('is-loading');status.textContent='';fadeAt=performance.now();}});return transition;
}
function skip(){if(transition){abort();return;}handoff().finally(cleanup);}
function guard(e){if(active){e.preventDefault();e.stopImmediatePropagation();}}
function keys(e){if(e.key==='Escape'){e.preventDefault();skip();}else if(['PageDown','PageUp','ArrowDown','ArrowUp',' '].includes(e.key))guard(e);}
function prefetchScenery(){if(prefetched)return;prefetched=true;for(const path of ['models/watercolour-fir.glb','models/meadow-flowers.glb?v=no-lavender65','assets/space/lroc-color-2k.jpg'])fetch(path,{cache:'force-cache',priority:'low'}).then(r=>r.ok?r.arrayBuffer():null).catch(()=>{});}
function render(now){if(!active)return;const duration=video.duration,time=video.currentTime||0;track.style.transform='scaleX('+Math.min(1,time/(Number.isFinite(duration)&&duration>0?duration:5.06))+')';
 if(!transition){if(video.ended||(Number.isFinite(duration)&&duration>0&&time>=duration-.07))handoff();else if(failedAt&&now-failedAt>1500)handoff();else if(!video.paused&&video.readyState>=2){if(time!==lastTime){lastTime=time;lastAdvance=now;}else if(lastAdvance&&now-lastAdvance>10000)handoff();}}
 if(transitionAt&&!fadeAt&&now-transitionAt>10000){abort();return;}
 if(fadeAt){const p=Math.min(1,(now-fadeAt)/650);overlay.style.setProperty('--prelude-fade',String(1-p*p*(3-2*p)));if(p===1){cleanup();return;}}
 frame=requestAnimationFrame(render);
}
overlay.querySelector('button').addEventListener('click',skip);video.addEventListener('ended',handoff);video.addEventListener('error',()=>{failedAt=performance.now();});
window.ParticlePrelude={play(done){if(active)return;if(matchMedia('(prefers-reduced-motion:reduce)').matches){done();return;}continuation=done;transition=null;transitionAt=fadeAt=failedAt=lastTime=lastAdvance=0;active=true;overlay.hidden=false;overlay.style.setProperty('--prelude-fade','1');root.classList.add('particle-prelude-active');overlay.classList.add('is-loading');status.textContent='正在完整加载 4K 动画…';
 prepare().then(()=>{if(!active)return;overlay.classList.remove('is-loading');status.textContent='';video.currentTime=0;return video.play();}).then(()=>{if(active)prefetchScenery();}).catch(()=>{failedAt=performance.now();status.textContent='动画播放异常，正在进入主页…';});addEventListener('wheel',guard,{capture:true,passive:false});addEventListener('keydown',keys,true);frame=requestAnimationFrame(render);
}};
})();
