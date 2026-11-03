(function(){
'use strict';
const root=document.documentElement,hero=document.getElementById('heroScreen');let revealing,cancelled=false;
if(!hero||root.classList.contains('skip-hero'))return;
root.classList.add('hero-locked');hero.hidden=true;hero.style.display='none';
function fallback(){cancelled=true;root.classList.remove('hero-locked','intro-boot','intro-text-active');root.classList.add('skip-hero','journey-skipped');hero.hidden=true;hero.style.display='none';window.SiteJourney?.skip();const section=document.getElementById('researchJourney');if(section)section.hidden=true;const canvas=document.getElementById('journeyCanvas');if(canvas)canvas.style.display='none';document.body.style.overflowY='auto';document.getElementById('intro')?.style.setProperty('opacity','1','important');}
window.cancelJourneyIntro=fallback;
function reveal(){if(revealing)return revealing;let timer;const ready=Promise.resolve(window.ensureJourney?.()).then(()=>{if(cancelled){window.SiteJourney?.skip();return;}if(!window.SiteJourney)throw Error('Journey unavailable');return window.SiteJourney.ready;});
 revealing=Promise.race([ready,new Promise((_,reject)=>timer=setTimeout(()=>reject(Error('Opening preparation timed out')),8000))]).then(()=>{if(cancelled)return;hero.hidden=false;hero.style.display='block';hero.inert=true;root.classList.remove('hero-locked','intro-boot');root.classList.add('intro-text-active');window.SiteJourney.start();hero.dispatchEvent(new Event('hero:dismiss'));document.dispatchEvent(new Event('journey:reveal'));}).catch(fallback).finally(()=>clearTimeout(timer));return revealing;
}
function begin(){window.ensureJourney?.().catch(()=>{});if(window.ParticlePrelude)window.ParticlePrelude.play(reveal);else reveal();}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',begin,{once:true});else begin();
})();
