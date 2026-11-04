import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createProjectWorld,createExperienceWorld,workflowStories} from './project-worlds.js';

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
  stage.innerHTML='<nav class="project-workflow-nav" aria-label="Research workflow steps"></nav><div class="project-journey-canvas"></div><div class="project-journey-copy"><span class="project-journey-step">01 / 03</span><p></p><small class="project-workflow-detail"></small></div><div class="project-journey-rail"><i></i></div><small class="project-journey-hint">SCROLL TO FOLLOW THE WORKFLOW</small>';
  workflowStories[i].steps.forEach((step,j)=>{const button=document.createElement('button');button.type='button';button.textContent='0'+(j+1)+' '+step[0];button.addEventListener('click',e=>{e.stopPropagation();enter();target=[.24,.65,.96][j];schedule();});stage.querySelector('nav').append(button);});
  const findings=[...project.querySelectorAll('.full-copy p')].find(p=>/key findings|key results/i.test(p.querySelector('strong')?.textContent||''))?.textContent.trim();const result=findings&&findings.length>205?findings.slice(0,findings.lastIndexOf(' ',202))+'…':findings;stage._copy=[context,subtitle,metrics||result||context];visual.prepend(stage);
  function enter(){try{ensure();if(active!==stage){if(active){renderer.render(view.scene,view.camera);const still=document.createElement('canvas');still.width=renderer.domElement.width;still.height=renderer.domElement.height;still.getContext('2d').drawImage(renderer.domElement,0,0);still.className='project-journey-still';active.querySelector('.project-journey-canvas').append(still);progress=0;target=0;}active=stage;view.scene.children.filter(o=>o.userData.projectWorld).forEach(o=>view.scene.remove(o));if(!worlds.has(i))worlds.set(i,createProjectWorld(i));const world=worlds.get(i);world.group.userData.projectWorld=true;view.scene.add(world.group);stage.querySelector('.project-journey-still')?.remove();stage.querySelector('.project-journey-canvas').append(renderer.domElement);stage.classList.add('is-ready');resize();}hovered=true;schedule();}catch(error){stage.classList.add('is-fallback');stage.querySelector('p').textContent=context;console.error('Project 3D scene unavailable',error);}}
  stage.addEventListener('pointerenter',enter);stage.addEventListener('focus',enter);stage.addEventListener('pointerleave',()=>hovered=false);stage.addEventListener('blur',()=>hovered=false);
  stage.addEventListener('wheel',e=>{if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;enter();const d=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);if((target===1&&d>0)||(target===0&&d<0))return;e.preventDefault();e.stopPropagation();target=clamp(target+d*.0015);schedule();},{passive:false});
  stage.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key))return;enter();e.preventDefault();target=e.key==='Home'?0:e.key==='End'?1:clamp(target+(['ArrowDown','PageDown'].includes(e.key)?.22:-.22));schedule();});
  return stage;
 });
 function resize(){if(!active||!renderer)return;const b=active.querySelector('.project-journey-canvas').getBoundingClientRect();if(!b.width||!b.height)return;renderer.setSize(b.width,b.height);view.camera.aspect=b.width/b.height;view.camera.updateProjectionMatrix();}
 function render(now){frame=0;if(!active||!pageVisible||document.hidden)return;const dt=Math.min(.05,(now-previous)/1000||.016);previous=now;time+=dt;progress=motion.matches?target:THREE.MathUtils.damp(progress,target,6,dt);if(Math.abs(target-progress)<.0005)progress=target;const p=progress,world=worlds.get(Number(active.dataset.world)),pose=world.cameraAt(p,view.camera.aspect);view.camera.position.copy(pose.position);view.camera.lookAt(pose.target);world.update(p,motion.matches?0:time);renderer.render(view.scene,view.camera);
  const step=progress<.4?0:progress<.78?1:2,copy=active.querySelector('.project-journey-copy'),story=world.story.steps[step];copy.querySelector('p').textContent=story[1];copy.querySelector('.project-journey-step').textContent='0'+(step+1)+' / 03 · '+story[0];copy.querySelector('.project-workflow-detail').textContent=story[2];copy.style.opacity=String(progress<.07?1:.80+.20*ease((progress% .4)/.12));active.querySelectorAll('nav button').forEach((button,j)=>{button.classList.toggle('is-current',j===step);button.setAttribute('aria-current',j===step?'step':'false');});active.querySelector('.project-journey-rail i').style.transform='scaleX('+progress+')';active.dataset.progress=progress.toFixed(3);
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
 const page=document.getElementById('experience');if(!page)return;let bound;
 const bind=()=>{const atlas=page.querySelector('.xp-atlas');if(!atlas||atlas===bound)return;bound=atlas;atlas.dataset.interactions='editorial144';
  const heading=atlas.querySelector('.xp-cover h2');heading.classList.add('xp-heading-visible');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('xp-motion-visible');observer.unobserve(e.target);}}),{threshold:.10});
  atlas.querySelectorAll('.xp-record-head,.xp-work li,.xp-research-figure').forEach(el=>observer.observe(el));
  atlas.querySelectorAll('.xp-index-item').forEach((item,i)=>{item.setAttribute('role','button');const move=()=>atlas.querySelectorAll('.xp-chapter')[i]?.scrollIntoView({block:'start',behavior:motion.matches?'instant':'smooth'});item.addEventListener('click',move);item.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();move();}});});
 };new MutationObserver(bind).observe(page,{childList:true,subtree:true});bind();
}
function init(){projectJourneys();experienceInteractions();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
