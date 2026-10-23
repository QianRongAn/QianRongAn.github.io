(function(){
'use strict';
function init(){const root=document.documentElement,about=document.getElementById('about'),intro=document.getElementById('intro');if(!about)return;
const section=about.querySelector('section'),card=document.createElement('div');card.className='about-crystal-card';
section.querySelectorAll('.about-paragraph').forEach(p=>card.append(p));
const label=document.createElement('div');label.className='about-crystal-label';label.textContent='About Me';
const contacts=document.createElement('div');contacts.className='about-crystal-contacts';contacts.innerHTML='<a href="mailto:wannaisla1999@gmail.com"><i class="fas fa-envelope" aria-hidden="true"></i> wannaisla1999@gmail.com</a><a href="mailto:wangnan1999@stu.xmu.edu.cn"><i class="fas fa-envelope" aria-hidden="true"></i> wangnan1999@stu.xmu.edu.cn</a><div><a href="tel:+8613706686915"><i class="fas fa-phone" aria-hidden="true"></i> +86 13706686915</a><a href="https://www.linkedin.com/in/nan-wang-30a438394/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a></div>';
label.style.setProperty('font-family',"'Recoleta',Georgia,serif",'important');section.replaceChildren(card,label,contacts);if(intro){intro.hidden=true;intro.style.setProperty('display','none','important');about.append(intro);}
let wasActive=false,cardHidden=false;
const motion=matchMedia('(prefers-reduced-motion: reduce)');
function revealCard(show,initial=false){
 const style=getComputedStyle(card),from={opacity:initial?0:style.opacity,translate:initial?'0 18px':style.translate};
 card.getAnimations().forEach(a=>a.cancel());
 cardHidden=!show;card.inert=!show;card.setAttribute('aria-hidden',String(!show));
 card.style.pointerEvents=show?'':'none';
 card.animate([from,{opacity:show?1:0,translate:show?'0 0':'0 18px'}],{duration:motion.matches?0:(initial?900:550),delay:initial?4000:0,fill:'both',easing:'cubic-bezier(.2,.75,.2,1)'});
}
function state(){const active=about.classList.contains('active')&&root.classList.contains('journey-skipped');if(active&&!wasActive)revealCard(true,true);wasActive=active;root.classList.toggle('about-crystal',active);}
document.addEventListener('click',function(e){
 if(!wasActive||!matchMedia('(min-width:769px)').matches)return;
 if(cardHidden){revealCard(true);return;}
 if(e.target.closest('.about-crystal-card,a,button,input,textarea,select,[role="button"]'))return;
 revealCard(false);
});
new MutationObserver(state).observe(about,{attributes:true,attributeFilter:['class']});new MutationObserver(state).observe(root,{attributes:true,attributeFilter:['class']});state();
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
