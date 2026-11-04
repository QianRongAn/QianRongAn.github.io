/* Cover Projects until its fonts, layout and first visible frame are ready. */
(function(){
 'use strict';
 function init(){
  var page=document.getElementById('projects'),frame=document.getElementById('projectsFrame');
  var curtain=document.getElementById('pageCurtain'),count=document.getElementById('pageCurtainCount');
  var switchPage=window.switchPage,motion=matchMedia('(prefers-reduced-motion: reduce)');
  if(!page||!frame||!curtain||!count||typeof switchPage!=='function')return;
  var entering=false,sequence=0,coverTween=null,counterTween=null,progress=0,counter={n:0},revealing=false;
  function send(data){if(frame.contentWindow)frame.contentWindow.postMessage(data,location.origin);}
  function sync(){var on=page.classList.contains('active');document.documentElement.classList.toggle('projects-view',on);send({type:'projects-visibility',active:on});}
  function showProgress(value){progress=Math.max(progress,value);curtain.dataset.loadingProgress=String(progress);if(!entering||revealing)return;
   if(counterTween)counterTween.kill();
   function paint(){count.textContent=String(Math.floor(counter.n)).padStart(2,'0');}
   if(window.gsap&&!motion.matches)counterTween=gsap.to(counter,{n:progress,duration:.18,ease:'none',overwrite:true,onUpdate:paint});
   else{counter.n=progress;paint();}
  }
  function clearCurtain(){sequence++;entering=revealing=false;progress=Math.min(progress,95);if(coverTween)coverTween.kill();if(counterTween)counterTween.kill();coverTween=counterTween=null;curtain.classList.remove('is-on');curtain.style.removeProperty('transform');}
  function reveal(){if(!entering||revealing)return;showProgress(100);revealing=true;var token=sequence;
   if(!window.gsap||motion.matches){count.textContent='100';clearCurtain();return;}
   if(counterTween)counterTween.kill();
   counterTween=gsap.to(counter,{n:100,duration:.18,ease:'none',onUpdate:function(){count.textContent=String(Math.floor(counter.n)).padStart(2,'0');},onComplete:function(){if(token!==sequence)return;count.textContent='100';coverTween=gsap.to(curtain,{yPercent:-100,duration:1,ease:'power4.inOut',onComplete:clearCurtain});}});
  }
  addEventListener('message',function(e){if(e.source!==frame.contentWindow||e.origin!==location.origin||!e.data)return;
   if(e.data.type==='projects-progress')showProgress(Math.min(95,Math.floor(e.data.progress*.95)));
   else if(e.data.type==='projects-ready'){showProgress(95);sync();}
   else if(e.data.type==='projects-painted'&&entering&&page.classList.contains('active'))reveal();
  });
  new MutationObserver(sync).observe(page,{attributes:true,attributeFilter:['class']});
  frame.addEventListener('load',function(){sync();send({type:'projects-request-status'});});sync();
  window.switchPage=function(index){var target=document.querySelector('.cube-page[data-index="'+index+'"]');
   if(target!==page){clearCurtain();return switchPage(index);}
   if(entering||page.classList.contains('active'))return;
   entering=true;revealing=false;var token=++sequence;counter.n=0;count.textContent='00';curtain.classList.add('is-on');
   // A hidden lazy iframe otherwise starts loading only after the cover has left.
   frame.loading='eager';send({type:'projects-request-status'});showProgress(Math.min(progress,95));
   function covered(){if(token!==sequence)return;switchPage(index);window.scrollTo({top:0,behavior:'instant'});sync();send({type:'projects-request-status'});}
   if(window.gsap&&!motion.matches){gsap.set(curtain,{yPercent:100});coverTween=gsap.to(curtain,{yPercent:0,duration:1,ease:'power4.inOut',onComplete:covered});}
   else{curtain.style.transform='translateY(0)';covered();}
  };
  curtain.addEventListener('wheel',function(e){e.preventDefault();},{passive:false});
  curtain.addEventListener('touchmove',function(e){e.preventDefault();},{passive:false});
  document.addEventListener('keydown',function(e){if(entering&&['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))e.preventDefault();});
 }
 if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',init);else init();
})();
