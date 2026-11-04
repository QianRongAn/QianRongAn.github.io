/* Resource progress plus visible-layout acknowledgement for the parent curtain. */
(function(){
 'use strict';
 var root=document.documentElement,embedded=root.classList.contains('embedded'),dna=document.querySelector('.dna-background');
 var active=!embedded,ready=false,loaded=0,total=0,paintVersion=0;
 function report(type){if(embedded)parent.postMessage({type:type,progress:total?Math.round(loaded/total*100):0,loaded:loaded,total:total},location.origin);}
 function painted(){if(!ready||!active)return;var version=++paintVersion;requestAnimationFrame(function(){requestAnimationFrame(function(){if(version===paintVersion&&active){root.dataset.projectsPainted='true';report('projects-painted');}});});}
 if(embedded){dna.classList.remove('is-on');addEventListener('message',function(e){if(e.source!==parent||e.origin!==location.origin||!e.data)return;
  if(e.data.type==='projects-visibility'){active=!!e.data.active;dna.classList.toggle('is-on',active);if(!active){paintVersion++;root.dataset.projectsPainted='false';}else painted();}
  else if(e.data.type==='projects-request-status'){report('projects-progress');if(ready){report('projects-ready');painted();}}
 });}
 var tasks=Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(function(link){return link.sheet?Promise.resolve():new Promise(function(resolve){link.addEventListener('load',resolve,{once:true});link.addEventListener('error',resolve,{once:true});});});
 tasks.push(document.readyState==='loading'?new Promise(function(resolve){document.addEventListener('DOMContentLoaded',resolve,{once:true});}):Promise.resolve());
 if(document.fonts){tasks.push(document.fonts.load('200 48px "Solare Intense"'));tasks.push(document.fonts.load('italic 200 48px "Solare Italic"'));tasks.push(document.fonts.load('400 16px Inter'));}
 total=tasks.length;report('projects-progress');
 Promise.all(tasks.map(function(task){return Promise.resolve(task).catch(function(){}).then(function(){loaded++;report('projects-progress');});})).then(function(){ready=true;root.dataset.projectsReady='true';report('projects-ready');painted();});
})();
