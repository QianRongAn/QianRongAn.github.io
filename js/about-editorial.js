(function(){
'use strict';
function init(){const root=document.documentElement,about=document.getElementById('about'),intro=document.getElementById('intro');if(!about)return;
const section=about.querySelector('section'),card=document.createElement('div');card.className='about-crystal-card';
section.querySelectorAll('.about-paragraph').forEach(p=>card.append(p));
const label=document.createElement('div');label.className='about-crystal-label';label.textContent='About Me';
const contacts=document.createElement('div');contacts.className='about-crystal-contacts';contacts.innerHTML='<a href="mailto:wannaisla1999@gmail.com"><i class="fas fa-envelope" aria-hidden="true"></i> wannaisla1999@gmail.com</a><a href="mailto:wangnan1999@stu.xmu.edu.cn"><i class="fas fa-envelope" aria-hidden="true"></i> wangnan1999@stu.xmu.edu.cn</a><div><a href="tel:+8613706686915"><i class="fas fa-phone" aria-hidden="true"></i> +86 13706686915</a><a href="https://www.linkedin.com/in/nan-wang-30a438394/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a></div>';
[label,contacts,...contacts.querySelectorAll('a')].forEach(el=>el.style.setProperty('font-family',"'Recoleta',Georgia,serif",'important'));section.replaceChildren(card,label,contacts);if(intro){intro.hidden=true;intro.style.setProperty('display','none','important');about.append(intro);}
let wasActive=false;function state(){const active=about.classList.contains('active')&&root.classList.contains('journey-skipped');if(active&&!wasActive){card.getAnimations().forEach(a=>a.cancel());card.animate([{opacity:0,translate:'0 18px'},{opacity:1,translate:'0 0'}],{duration:900,delay:4000,fill:'both',easing:'cubic-bezier(.2,.75,.2,1)'});}wasActive=active;root.classList.toggle('about-crystal',active);}
new MutationObserver(state).observe(about,{attributes:true,attributeFilter:['class']});new MutationObserver(state).observe(root,{attributes:true,attributeFilter:['class']});state();
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
