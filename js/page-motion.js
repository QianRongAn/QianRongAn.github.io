/* GSAP entrances animate the reading layers, leaving glass backdrops stationary. */
(function(){
'use strict';
var context=null,legacy=[];
function enter(page){
 if(!page||!page.classList.contains('active'))return;
 if(context){context.revert();context=null;}legacy.forEach(function(a){a.cancel();});legacy=[];
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||page.id==='skills'||page.id==='projects')return;
 var selector=page.id==='about'?'.about-masthead > *, .about-identity, .contact-info, .intro-meta, .about-research-copy, .about-evidence > div':page.id==='publications'?'.pub-directory-label, .pub-paper-index, .pub-controls, .pub-directory > small':'.dream-kicker, .section-title, .glass-card-head, .glass-well, .education-item';
 if(page.id==='education')selector='.dream-kicker, .section-title, .glass-well, .education-item';
 var elements=Array.from(page.querySelectorAll(selector)).filter(function(el){var r=el.getBoundingClientRect();return r.height>0&&r.top<innerHeight+40&&r.bottom>0;});
 if(!elements.length)return;
 if(window.gsap){context=window.gsap.context(function(){window.gsap.fromTo(elements,{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:.72,stagger:.065,ease:'power3.out',overwrite:'auto',clearProps:'opacity,visibility,transform'});},page);}
 else elements.forEach(function(el,i){legacy.push(el.animate([{opacity:0,translate:'0 22px'},{opacity:1,translate:'0 0'}],{duration:700,delay:i*60,easing:'cubic-bezier(.2,.75,.2,1)',fill:'backwards'}));});
 page.dataset.transition='reading-rise';
}
window.SitePageMotion={enter:enter};
})();
