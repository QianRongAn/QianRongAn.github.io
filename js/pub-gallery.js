/* A vertical glass helix: each scroll gesture brings one complete citation forward. */
(function(){
'use strict';
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||(innerWidth<=768&&innerHeight<=1024))return;
let index=0,spineOffset=0,locked=0,lastWheel=0,downX=0;const reduce=matchMedia('(prefers-reduced-motion:reduce)');
function setup(){
 const page=document.getElementById('publications'),grid=page?.querySelector('.publications-grid'),stage=page?.querySelector('.pub-stage');if(!grid||grid.dataset.glassHelix)return;grid.dataset.glassHelix='ready';
 const cards=[...grid.querySelectorAll('.publication-card')];
 const controls=document.createElement('aside');controls.className='pub-directory';controls.innerHTML='<span class="pub-directory-label">Publications</span><div class="pub-paper-index"></div><div class="pub-controls"><button type="button" aria-label="Previous paper">←</button><span class="pub-counter"></span><button type="button" aria-label="Next paper">→</button></div><small>SCROLL TO EXPLORE<br>SCROLL UP AT 01 TO VIEW SPINE TOP</small>';stage.append(controls);
 const directory=controls.querySelector('.pub-paper-index');cards.forEach((card,i)=>{
  card.setAttribute('role','article');const title=card.querySelector('.pub-title');card.setAttribute('aria-label',title?.textContent||'Paper '+(i+1));
  const face=document.createElement('div');face.className='pub-glass-face';while(card.firstChild)face.append(card.firstChild);card.append(face);
  const button=document.createElement('button');button.type='button';button.title=title?.textContent||'';button.innerHTML='<span>0'+(i+1)+'</span><span>'+(['J Hematol Oncol','Advanced Science','J Transl Med','Immunol Cell Biol','Front Cell Dev Biol','Clin Transl Med'][i])+'</span>';button.addEventListener('click',()=>select(i));directory.append(button);
 });
 function draw(){
  const width=Math.min(innerWidth*.43,650),height=Math.min(innerHeight*.48,410);stage.style.setProperty('--paper-width',width+'px');stage.style.setProperty('--paper-height',height+'px');
  cards.forEach((card,i)=>{let d=i-index;if(d>3)d-=cards.length;if(d< -2)d+=cards.length;
   const distance=Math.abs(d),x=d===0?0:Math.sign(d)*(width*.68+Math.max(0,distance-1)*width*.10),y=d===0?0:-d*(height*.54),z=d===0?170:-distance*230,angle=d===0?-7:-Math.sign(d)*(48+distance*8);
   card.style.transform='translate(-50%,-50%) translate3d('+x+'px,'+y+'px,'+z+'px) rotateY('+angle+'deg) rotateX('+(d===0?2:-4)+'deg)';card.style.opacity=d===0?'1':String(Math.max(.16,.75-distance*.13));card.style.zIndex=String(10-distance);card.classList.toggle('is-current',d===0);card.inert=d!==0;card.setAttribute('aria-hidden',d===0?'false':'true');
  });
  [...directory.children].forEach((button,i)=>{button.classList.toggle('is-current',i===index);button.setAttribute('aria-current',i===index?'true':'false');});controls.querySelector('.pub-counter').textContent='0'+(index+1)+' / 0'+cards.length;window.PublicationStage={index,count:cards.length,spineOffset};
 }
 function select(next){spineOffset=0;index=(next+cards.length)%cards.length;draw();}
 controls.querySelectorAll('.pub-controls button')[0].addEventListener('click',()=>select(index-1));controls.querySelectorAll('.pub-controls button')[1].addEventListener('click',()=>select(index+1));
 stage.addEventListener('wheel',event=>{if(event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;const sign=Math.sign(event.deltaY);if(!sign)return;if(index===cards.length-1&&sign>0)return;event.preventDefault();const now=performance.now(),quiet=now-lastWheel;lastWheel=now;if(now<locked||quiet<180)return;locked=now+650;if(index===0&&sign<0){spineOffset=Math.min(3.8,spineOffset+1.9);draw();return;}if(spineOffset>0&&sign>0){spineOffset=Math.max(0,spineOffset-1.9);draw();return;}select(index+sign);},{passive:false});
 stage.addEventListener('pointerdown',event=>{if(event.target.closest('button,a'))return;downX=event.clientX;});stage.addEventListener('pointerup',event=>{if(downX&&Math.abs(event.clientX-downX)>45)select(index+(event.clientX<downX?1:-1));downX=0;});
 stage.tabIndex=0;stage.setAttribute('aria-label','Publication gallery. Scroll or use arrow keys to change paper.');stage.addEventListener('keydown',event=>{if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(event.key)){event.preventDefault();select(index+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1));}});
 function state(){document.documentElement.classList.toggle('publication-view',page.classList.contains('active'));}new MutationObserver(state).observe(page,{attributes:true,attributeFilter:['class']});state();draw();addEventListener('resize',draw,{passive:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
