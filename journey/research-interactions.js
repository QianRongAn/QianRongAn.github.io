import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createProjectWorld} from './project-worlds.js';

const motion=matchMedia('(prefers-reduced-motion:reduce)');
function makeRenderer(){const r=new THREE.WebGLRenderer({alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio||1,1.7));r.setClearColor(0,0);r.outputColorSpace=THREE.SRGBColorSpace;return r;}
function studio(renderer){const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(39,1,.1,80);camera.position.set(0,.15,10.8);scene.add(new THREE.HemisphereLight('#fff9ed','#61485f',2));const key=new THREE.DirectionalLight('#fff7df',3);key.position.set(-4,6,8);scene.add(key);const fill=new THREE.DirectionalLight('#d9d5ed',1.4);fill.position.set(5,1,3);scene.add(fill);const room=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(room,.04).texture;scene.environmentIntensity=.55;room.dispose();pmrem.dispose();return {scene,camera};}
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
function travel(p){if(p<.2)return ease(p/.2)*.3;if(p<.35)return .3;if(p<.58)return .3+ease((p-.35)/.23)*.4;if(p<.76)return .7;if(p<.9)return .7+ease((p-.76)/.14)*.3;return 1;}

function projectJourneys(){
 const projects=[...document.querySelectorAll('.project')];if(!projects.length)return;
 let renderer,view,active=null,frame=0,time=0,previous=0,progress=0,target=0,hovered=false,pageVisible=true;
 const worlds=new Map();
 function ensure(){if(renderer)return;renderer=makeRenderer();view=studio(renderer);renderer.domElement.setAttribute('aria-hidden','true');}
 const stages=projects.map((project,i)=>{const visual=project.querySelector('.visual-column');if(!visual)return null;
  const stage=document.createElement('div');stage.className='project-journey';stage.tabIndex=0;stage.setAttribute('role','region');stage.setAttribute('aria-label','Interactive 3D research illustration. Scroll or use arrow keys to explore.');stage.dataset.world=String(i);
  const context=project.querySelector('.project-context')?.textContent||'',subtitle=project.querySelector('.project-subtitle')?.textContent||'';
  const metrics=[...project.querySelectorAll('.metric')].map(m=>m.textContent.trim()).join(' · ');
  stage.innerHTML='<div class="project-journey-canvas"></div><div class="project-journey-copy"><span class="project-journey-step">01 / 03</span><p></p></div><div class="project-journey-rail"><i></i></div><small class="project-journey-hint">SCROLL TO EXPLORE · 3D CONCEPT</small>';
  const findings=[...project.querySelectorAll('.full-copy p')].find(p=>/key findings|key results/i.test(p.querySelector('strong')?.textContent||''))?.textContent.trim();const result=findings&&findings.length>205?findings.slice(0,findings.lastIndexOf(' ',202))+'…':findings;stage._copy=[context,subtitle,metrics||result||context];visual.prepend(stage);
  function enter(){try{ensure();if(active!==stage){if(active){renderer.render(view.scene,view.camera);const still=document.createElement('canvas');still.width=renderer.domElement.width;still.height=renderer.domElement.height;still.getContext('2d').drawImage(renderer.domElement,0,0);still.className='project-journey-still';active.querySelector('.project-journey-canvas').append(still);progress=0;target=0;}active=stage;view.scene.children.filter(o=>o.userData.projectWorld).forEach(o=>view.scene.remove(o));if(!worlds.has(i))worlds.set(i,createProjectWorld(i));const world=worlds.get(i);world.group.userData.projectWorld=true;view.scene.add(world.group);stage.querySelector('.project-journey-still')?.remove();stage.querySelector('.project-journey-canvas').append(renderer.domElement);stage.classList.add('is-ready');resize();}hovered=true;schedule();}catch(error){stage.classList.add('is-fallback');stage.querySelector('p').textContent=context;console.error('Project 3D scene unavailable',error);}}
  stage.addEventListener('pointerenter',enter);stage.addEventListener('focus',enter);stage.addEventListener('pointerleave',()=>hovered=false);stage.addEventListener('blur',()=>hovered=false);
  stage.addEventListener('wheel',e=>{if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;enter();const d=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);if((target===1&&d>0)||(target===0&&d<0))return;e.preventDefault();e.stopPropagation();target=clamp(target+d*.0015);schedule();},{passive:false});
  stage.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key))return;enter();e.preventDefault();target=e.key==='Home'?0:e.key==='End'?1:clamp(target+(['ArrowDown','PageDown'].includes(e.key)?.22:-.22));schedule();});
  return stage;
 });
 function resize(){if(!active||!renderer)return;const b=active.getBoundingClientRect();if(!b.width||!b.height)return;renderer.setSize(b.width,b.height);view.camera.aspect=b.width/b.height;view.camera.updateProjectionMatrix();}
 function render(now){frame=0;if(!active||!pageVisible||document.hidden)return;const dt=Math.min(.05,(now-previous)/1000||.016);previous=now;time+=dt;progress=motion.matches?target:THREE.MathUtils.damp(progress,target,6,dt);if(Math.abs(target-progress)<.0005)progress=target;const p=travel(progress),world=worlds.get(Number(active.dataset.world));view.camera.position.set(Math.sin(p*Math.PI)*.7,.15+p*.25,10.8-p*3.7);view.camera.lookAt(0,0,0);world.update(p,motion.matches?0:time);renderer.render(view.scene,view.camera);
  const step=progress<.35?0:progress<.76?1:2,copy=active.querySelector('.project-journey-copy');copy.querySelector('p').textContent=active._copy[step];copy.querySelector('span').textContent='0'+(step+1)+' / 03';const alpha=step===0?ease((progress-.10)/.09)*(1-ease((progress-.31)/.04)):step===1?ease((progress-.48)/.10)*(1-ease((progress-.72)/.04)):ease((progress-.83)/.07);copy.style.opacity=String(alpha);active.querySelector('.project-journey-rail i').style.transform='scaleX('+progress+')';active.dataset.progress=progress.toFixed(3);
  if((hovered&&!motion.matches)||Math.abs(target-progress)>.0005)frame=requestAnimationFrame(render);
 }
 function schedule(){if(!frame&&pageVisible){previous=performance.now();frame=requestAnimationFrame(render);}}
 new ResizeObserver(()=>{resize();schedule();}).observe(document.querySelector('main'));
 addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='projects-visibility')return;pageVisible=!!e.data.active;if(pageVisible)schedule();else{cancelAnimationFrame(frame);frame=0;}});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
}

/* React Bits patterns: Split Text, Scroll Reveal, Tilted Card, Spotlight Card, Magnet.
   Recent references: Nothing to Watch, Augen, X Advertising, Shopify Editions, Shopify Design. */
function experienceInteractions(){
 const page=document.getElementById('experience');if(!page)return;let currentAtlas,dispose=()=>{};
 function bind(){const atlas=page.querySelector('.xp-atlas');if(!atlas||atlas===currentAtlas)return;dispose();currentAtlas=atlas;atlas.dataset.interactions='reactbits5-recent5';
  const cleanups=[],items=[...atlas.querySelectorAll('.xp-index-item')],arts=[...atlas.querySelectorAll('.xp-cover-art,.xp-specimen-art')],chapters=[...atlas.querySelectorAll('.xp-chapter')];let renderer,view,activeArt,world,frame=0,time=0,last=0,pointer={x:0,y:0},visible=false;
  const heading=atlas.querySelector('.xp-cover h2');heading.setAttribute('aria-label',heading.textContent);heading.querySelectorAll(':scope>span,:scope>em').forEach(part=>{const text=part.textContent;part.replaceChildren(...text.split(/(\s+)/).filter(Boolean).map(word=>{if(/^\s+$/.test(word))return document.createTextNode(word);const el=document.createElement('span');el.className='xp-split-word';el.textContent=word;el.setAttribute('aria-hidden','true');return el;}));});
  const orbit=document.createElement('div');orbit.className='xp-orbit-labels';['IMMUNOLOGY','MULTI-OMICS','BIOMEDICAL AI'].forEach((t,i)=>{const label=document.createElement('span');label.textContent=t;label.style.setProperty('--orbit-index',i);orbit.append(label);});atlas.querySelector('.xp-cover').append(orbit);
  const preview=document.createElement('div');preview.className='xp-hover-preview';preview.setAttribute('aria-hidden','true');atlas.append(preview);
  items.forEach((item,i)=>{item.setAttribute('role','button');const xTo=window.gsap?.quickTo(item,'x',{duration:.5,ease:'power3.out'}),yTo=window.gsap?.quickTo(item,'y',{duration:.5,ease:'power3.out'});
   function move(e){const r=item.getBoundingClientRect();if(!motion.matches){xTo?.((e.clientX-r.left-r.width/2)*.12);yTo?.((e.clientY-r.top-r.height/2)*.2);}preview.style.left=Math.min(innerWidth-190,e.clientX+22)+'px';preview.style.top=Math.min(innerHeight-170,e.clientY+18)+'px';}
   item.addEventListener('pointermove',move);item.addEventListener('pointerenter',()=>{preview.replaceChildren();const svg=chapters[i]?.querySelector('svg')?.cloneNode(true);if(svg)preview.append(svg);preview.classList.add('is-visible');});item.addEventListener('pointerleave',()=>{xTo?.(0);yTo?.(0);preview.classList.remove('is-visible');});
   item.addEventListener('click',()=>chapters[i]?.scrollIntoView({block:'start',behavior:motion.matches?'instant':'smooth'}));item.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();chapters[i]?.scrollIntoView({block:'start',behavior:motion.matches?'instant':'smooth'});}});cleanups.push(()=>window.gsap?.killTweensOf(item));
  });
  atlas.querySelectorAll('.xp-specimen,.xp-record').forEach(card=>{card.classList.add('xp-spotlight-card');const move=e=>{const r=card.getBoundingClientRect();card.style.setProperty('--spot-x',(e.clientX-r.left)+'px');card.style.setProperty('--spot-y',(e.clientY-r.top)+'px');};card.addEventListener('pointermove',move);});
  arts.forEach(art=>{art.classList.add('xp-3d-art');art.addEventListener('pointermove',e=>{const r=art.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;if(!motion.matches){art.style.setProperty('--tilt-x',(-pointer.y*7)+'deg');art.style.setProperty('--tilt-y',(pointer.x*9)+'deg');}schedule();});art.addEventListener('pointerleave',()=>{pointer.x=pointer.y=0;art.style.setProperty('--tilt-x','0deg');art.style.setProperty('--tilt-y','0deg');});});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.target===heading){if(e.isIntersecting)heading.classList.add('xp-heading-visible');}else e.target.classList.toggle('xp-motion-visible',e.isIntersecting);}),{threshold:.1});observer.observe(heading);atlas.querySelectorAll('.xp-record-head,.xp-work li').forEach(el=>observer.observe(el));
  function chooseArt(){if(!page.classList.contains('active')){visible=false;cancelAnimationFrame(frame);frame=0;return;}let best=null,score=Infinity;for(const art of arts){const r=art.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;const d=Math.abs(r.top+r.height/2-innerHeight*.5);if(d<score){score=d;best=art;}}visible=!!best;if(!best)return;
   if(best!==activeArt){try{if(!renderer){renderer=makeRenderer();view=studio(renderer);}if(world){view.scene.remove(world.group);world.dispose();}activeArt?.classList.remove('has-3d');activeArt=best;const index=arts.indexOf(best);world=createProjectWorld(index===0?3:index===1?2:index===2?6:0);view.scene.add(world.group);best.append(renderer.domElement);best.classList.add('has-3d');const r=best.getBoundingClientRect();renderer.setSize(r.width,r.height);view.camera.aspect=r.width/r.height;view.camera.updateProjectionMatrix();}catch(error){console.error('Experience illustration unavailable',error);visible=false;}}
   if(renderer&&activeArt){const r=activeArt.getBoundingClientRect();if(r.width&&r.height){renderer.setSize(r.width,r.height);view.camera.aspect=r.width/r.height;view.camera.updateProjectionMatrix();}}
   schedule();
  }
  function render(now){frame=0;if(!visible||!world||document.hidden)return;time+=Math.min(.05,(now-last)/1000||.016);last=now;const r=activeArt.getBoundingClientRect(),p=clamp((innerHeight*.75-r.top)/(innerHeight+r.height));world.update(p,motion.matches?0:time);view.camera.position.set(pointer.x*.8,-pointer.y*.45,10.5-p*1.2);view.camera.lookAt(0,0,0);renderer.render(view.scene,view.camera);if(!motion.matches)frame=requestAnimationFrame(render);}
  function schedule(){if(!frame&&visible){last=performance.now();frame=requestAnimationFrame(render);}}
  const active=new MutationObserver(chooseArt);active.observe(page,{attributes:true,attributeFilter:['class']});addEventListener('scroll',chooseArt,{passive:true});addEventListener('resize',chooseArt,{passive:true});document.addEventListener('visibilitychange',chooseArt);chooseArt();
  dispose=()=>{cancelAnimationFrame(frame);observer.disconnect();active.disconnect();removeEventListener('scroll',chooseArt);removeEventListener('resize',chooseArt);document.removeEventListener('visibilitychange',chooseArt);cleanups.forEach(f=>f());world?.dispose();view?.scene.environment?.dispose();renderer?.dispose();};
 }
 new MutationObserver(bind).observe(page,{childList:true,subtree:true});bind();
}
function init(){projectJourneys();experienceInteractions();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
