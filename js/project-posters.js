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
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
