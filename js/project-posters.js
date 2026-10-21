/* Synchronize Projects and its DNA animation with the active page. */
(function(){
 'use strict';
 function init(){
  var page=document.getElementById('projects'), frame=document.getElementById('projectsFrame');
  if(!page||!frame)return;
  function sync(){var on=page.classList.contains('active');document.documentElement.classList.toggle('projects-view',on);if(frame.contentWindow)frame.contentWindow.postMessage({type:'projects-visibility',active:on},location.origin);}
  new MutationObserver(sync).observe(page,{attributes:true,attributeFilter:['class']});
  frame.addEventListener('load',sync);
  addEventListener('message',function(e){if(e.source===frame.contentWindow&&e.origin===location.origin&&e.data&&e.data.type==='projects-ready')sync();});
  sync();

  // Reuse the original Hero curtain only when entering Projects.
  var curtain=document.getElementById('pageCurtain'), count=document.getElementById('pageCurtainCount');
  var switchPage=window.switchPage, timeline=null;
  var motion=matchMedia('(prefers-reduced-motion: reduce)');
  if(!curtain||!count||typeof switchPage!=='function')return;
  function clearCurtain(){
   if(timeline)timeline.kill();
   timeline=null;
   curtain.classList.remove('is-on');
   curtain.style.removeProperty('transform');
  }
  window.switchPage=function(index){
   var target=document.querySelector('.cube-page[data-index="'+index+'"]');
   if(target!==page){clearCurtain();return switchPage(index);}
   if(timeline||page.classList.contains('active'))return;
   if(motion.matches||!window.gsap)return switchPage(index);
   var counter={n:0};
   count.textContent='00';
   gsap.set(curtain,{yPercent:100});
   curtain.classList.add('is-on');
   timeline=gsap.timeline({defaults:{ease:'power4.inOut'},onComplete:clearCurtain})
    .to(curtain,{yPercent:0,duration:1})
    .to(counter,{n:100,duration:1,ease:'none',onUpdate:function(){count.textContent=String(Math.round(counter.n)).padStart(2,'0');}},'<')
    .add(function(){switchPage(index);window.scrollTo({top:0,behavior:'instant'});})
    .to(curtain,{yPercent:-100,duration:1});
  };
  curtain.addEventListener('wheel',function(e){e.preventDefault();},{passive:false});
  curtain.addEventListener('touchmove',function(e){e.preventDefault();},{passive:false});
  document.addEventListener('keydown',function(e){
   if(timeline&&['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))e.preventDefault();
  });
  motion.addEventListener('change',function(){
   if(motion.matches&&timeline){clearCurtain();switchPage(Number(page.dataset.index));}
  });
 }
 if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',init);else init();
})();
