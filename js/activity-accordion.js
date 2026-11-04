/* Expanding photographic strips, following the supplied motion reference. */
(function(){
 function init(){
  const gallery=document.querySelector('#extracurricular .activities-gallery');
  if(!gallery||gallery.dataset.accordionReady)return;
  const images=[...gallery.querySelectorAll('.activity-image')];if(!images.length)return;
  gallery.dataset.accordionReady='true';gallery.classList.remove('activity-wave');gallery.classList.add('activity-accordion');
  const rail=document.createElement('div');rail.className='activity-accordion-rail';rail.setAttribute('aria-label','Academic activity photographs');
  const originals=document.createElement('div');originals.hidden=true;
  const labels=['Academic activities'];
  let active=0;
  const panels=images.map((original,i)=>{
   const panel=document.createElement('button');panel.type='button';panel.className='activity-accordion-panel';panel.setAttribute('aria-label','Show photograph '+(i+1));panel.setAttribute('aria-expanded',String(i===0));
   const image=original.cloneNode(false);image.className='activity-accordion-photo';image.loading='lazy';image.decoding='async';image.removeAttribute('style');image.removeAttribute('onclick');image.alt=original.alt||labels[i%labels.length];
   const caption=document.createElement('span');caption.className='activity-accordion-caption';const number=document.createElement('span');number.className='activity-accordion-number';number.textContent=String(i+1).padStart(2,'0');const label=document.createElement('span');label.textContent=labels[i%labels.length];caption.append(number,label);panel.append(image,caption);
   panel.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')select(i)});panel.addEventListener('focus',()=>select(i));panel.addEventListener('click',()=>{if(active===i)original.click();else select(i)});
   panel.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?panels.length-1:(active+(e.key==='ArrowRight'?1:-1)+panels.length)%panels.length;select(next);panels[next].focus();}});
   originals.append(original);rail.append(panel);return panel;
  });
  function resizeCards(){const h=rail.clientHeight-24;panels.forEach((p,j)=>{const img=p.querySelector("img"),ratio=(img.naturalWidth||4)/(img.naturalHeight||3);const space=Math.max(120,rail.clientWidth-(panels.length-1)*48-(panels.length-1)*14);p.style.setProperty("--expanded-width",Math.min(space,h*ratio)+"px");});}new ResizeObserver(resizeCards).observe(rail);rail.querySelectorAll("img").forEach(img=>img.addEventListener("load",resizeCards));resizeCards();function select(i){active=i;panels.forEach((panel,j)=>{panel.classList.toggle('is-active',i===j);panel.setAttribute('aria-expanded',String(i===j));});}
  const controls=document.createElement('div');controls.className='activity-accordion-controls';for(const [label,direction]of [['Previous photograph',-1],['Next photograph',1]]){const b=document.createElement('button');b.type='button';b.textContent=direction<0?'←':'→';b.setAttribute('aria-label',label);b.addEventListener('click',()=>select((active+direction+panels.length)%panels.length));controls.append(b);}
  gallery.replaceChildren(rail,controls,originals);select(0);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

