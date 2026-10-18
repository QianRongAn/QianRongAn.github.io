(function(){
  'use strict';
  var projects=Array.from(document.querySelectorAll('.project'));
  var pinned=null;
  var active=null;
  var hoverAfter=0;
  function open(project){
    if(active===project)return;
    active=project;
    hoverAfter=performance.now()+750;
    if(project)project.querySelector('.full-copy').scrollTop=0;
    projects.forEach(function(item){
      var active=item===project;
      item.classList.toggle('is-open',active);
      item.querySelector('.project-trigger').setAttribute('aria-expanded',String(active));
      item.querySelector('.project-reveal').inert=!active;
    });
  }
  projects.forEach(function(project){
    var trigger=project.querySelector('.project-trigger');
    project.querySelector('.project-reveal').inert=true;
    project.addEventListener('pointerenter',function(event){if(event.pointerType==='mouse'&&!pinned&&performance.now()>hoverAfter)open(project);});
    trigger.addEventListener('click',function(){pinned=pinned===project?null:project;open(pinned);});
    project.addEventListener('focusin',function(){if(!pinned)open(project);});
    project.addEventListener('focusout',function(){requestAnimationFrame(function(){if(!pinned&&!project.contains(document.activeElement)&&!project.matches(':hover'))open(null);});});
    var visual=project.querySelector('.image-button');
    visual.addEventListener('pointermove',function(event){var r=visual.getBoundingClientRect();visual.style.setProperty('--mx',((event.clientX-r.left)/r.width-.5)*8+'px');visual.style.setProperty('--my',((event.clientY-r.top)/r.height-.5)*8+'px');});
    visual.addEventListener('pointerleave',function(){visual.style.setProperty('--mx','0px');visual.style.setProperty('--my','0px');});
    visual.addEventListener('click',function(){var image=visual.querySelector('img');document.querySelector('#large-image').src=image.src;document.querySelector('#large-image').alt=image.alt;document.querySelector('.lightbox').showModal();});
  });
  // Layout changes must not switch the project underneath a stationary pointer.
  document.addEventListener('pointermove',function(event){
    if(event.pointerType!=='mouse'||pinned||performance.now()<hoverAfter)return;
    var hovered=event.target.closest('.project');
    if(hovered!==active&&!document.querySelector('.lightbox').open)open(hovered);
  });
  var dialog=document.querySelector('.lightbox');
  document.querySelector('.lightbox-close').addEventListener('click',function(){dialog.close();});
  dialog.addEventListener('click',function(event){if(event.target===dialog)dialog.close();});
  document.addEventListener('keydown',function(event){if(event.key==='Escape'&&!dialog.open){pinned=null;open(null);if(document.activeElement instanceof HTMLElement)document.activeElement.blur();}});
})();
