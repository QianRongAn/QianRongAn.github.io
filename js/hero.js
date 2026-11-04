(function(){
'use strict';
const root=document.documentElement,hero=document.getElementById('heroScreen');let revealing,cancelled=false,loader;
if(!hero||root.classList.contains('skip-hero'))return;
if(window.history&&'scrollRestoration' in window.history)window.history.scrollRestoration='manual';
root.classList.add('hero-locked');hero.hidden=true;hero.style.display='none';
function fallback(){cancelled=true;loader?.remove();root.classList.remove('journey-preloading');root.classList.remove('hero-locked','intro-boot','intro-text-active');root.classList.add('skip-hero','journey-skipped');hero.hidden=true;hero.style.display='none';window.SiteJourney?.skip();const section=document.getElementById('researchJourney');if(section)section.hidden=true;const canvas=document.getElementById('journeyCanvas');if(canvas)canvas.style.display='none';document.body.style.overflowY='auto';document.getElementById('intro')?.style.setProperty('opacity','1','important');}
window.cancelJourneyIntro=fallback;
function reveal(){if(revealing)return revealing;const ready=Promise.resolve(window.ensureJourney?.()).then(()=>{if(cancelled){window.SiteJourney?.skip();return;}if(!window.SiteJourney)throw Error('Journey unavailable');return window.SiteJourney.ready;});
 revealing=ready.then(()=>{if(cancelled)return;hero.hidden=false;hero.style.display='block';hero.inert=true;root.classList.remove('hero-locked','intro-boot');root.classList.add('intro-text-active');window.SiteJourney.start();hero.dispatchEvent(new Event('hero:dismiss'));document.dispatchEvent(new Event('journey:reveal'));}).catch(fallback);return revealing;
}
async function begin(){
 loader=document.createElement('section');loader.className='intro-loader';loader.setAttribute('role','status');loader.setAttribute('aria-label','Preparing the opening scene');loader.innerHTML='<span class="intro-loader-mark" aria-hidden="true"></span><span>NAN WANG</span><button type="button">Skip intro ↗</button>';loader.querySelector('button').addEventListener('click',fallback);document.body.append(loader);root.classList.add('journey-preloading');
 try{await Promise.all([Promise.resolve(window.ensureJourney?.()).then(()=>window.SiteJourney?.ready),window.ParticlePrelude?.prepare?.()]);if(cancelled)return;loader.remove();root.classList.remove('journey-preloading');if(window.ParticlePrelude)window.ParticlePrelude.play(reveal);else reveal();}catch(error){fallback();}
}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',begin,{once:true});else begin();
})();
