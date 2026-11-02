(function(){
'use strict';
var root=document.documentElement,hero=document.getElementById('heroScreen'),revealing;
if(!hero||root.classList.contains('skip-hero'))return;
root.classList.add('hero-locked');hero.hidden=true;hero.style.display='none';
function reveal(){
 if(revealing)return revealing;
 revealing=Promise.resolve(window.ensureJourney?window.ensureJourney():null).then(function(){if(!window.SiteJourney)throw new Error('Journey unavailable');return window.SiteJourney.ready;}).then(function(){
 hero.hidden=false;hero.style.display='block';hero.inert=true;root.classList.remove('hero-locked','intro-boot');root.classList.add('intro-text-active');window.SiteJourney.start();hero.dispatchEvent(new Event('hero:dismiss'));document.dispatchEvent(new Event('journey:reveal'));
 }).catch(function(){root.classList.remove('hero-locked','intro-boot');root.classList.add('skip-hero');document.getElementById('researchJourney').hidden=true;document.body.style.overflowY='auto';});
 return revealing;
}
function begin(){if(window.ParticlePrelude)window.ParticlePrelude.play(reveal);else reveal();}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',begin,{once:true});else begin();
})();