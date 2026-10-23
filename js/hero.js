/* The introduction opens directly with the source particle film. */
(function(){
 'use strict';
 var root=document.documentElement,hero=document.getElementById('heroScreen'),revealing=false;
 if(!hero||root.classList.contains('skip-hero'))return;
 root.classList.add('hero-locked');hero.hidden=true;hero.style.display='none';
 function reveal(){
  if(!window.SiteJourney){setTimeout(reveal,80);return;}
  if(revealing)return;revealing=true;Promise.resolve(window.SiteJourney.ready).then(function(){
  hero.hidden=false;hero.style.display='block';hero.inert=true;
  root.classList.remove('hero-locked','intro-boot');root.classList.add('intro-text-active');
  window.SiteJourney.start();hero.dispatchEvent(new Event('hero:dismiss'));document.dispatchEvent(new Event('journey:reveal'));
  });
 }
 function begin(){if(window.ParticlePrelude)window.ParticlePrelude.play(reveal);else reveal();}
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',begin,{once:true});else begin();
})();
