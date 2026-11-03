(function () {
  'use strict';
  const page = document.getElementById('experience');
  if (!page) return;
  const root = document.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let dispose = () => {};
  let boundAtlas = null;
  const circle = (x,y,r,extra='') => `<circle cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
  function specimen(kind) {
    let art = '';
    if (kind === 0) {
      for (let i=0;i<72;i++) {
        const a=i*Math.PI*2/72, r=137+8*Math.sin(i*1.7);
        art+=circle(240+Math.cos(a)*r,240+Math.sin(a)*r,4.3,'class="xp-bead"');
      }
      art+='<path class="xp-membrane" d="M240 100C320 100 394 154 383 244S320 385 239 379 98 326 101 239 154 95 240 100Z"/>';
      for(let i=0;i<13;i++){const a=i*2.4,r=28+Math.sqrt(i)*22;art+=circle(240+Math.cos(a)*r,240+Math.sin(a)*r,9+i%3*3,'class="xp-organelle"');}
      art+='<path class="xp-probe" d="M407 52L300 205L317 157Z"/><path class="xp-fine" d="M339 146L425 146M151 343H58"/>';
    } else if (kind === 1) {
      for(let y=0;y<13;y++)for(let x=0;x<13;x++){
        const px=81+x*26+(y%2)*13,py=82+y*26;
        if(Math.hypot(px-240,py-240)>169)continue;
        const z=(x*7+y*11)%9;
        art+=circle(px,py,7+z*.65,`class="xp-spot xp-spot-${z%3}"`);
      }
      art+='<ellipse class="xp-fine" cx="240" cy="240" rx="174" ry="174"/><path class="xp-fine" d="M240 39V441M39 240H441"/>';
    } else {
      for(let i=0;i<32;i++){
        const y=71+i*11, a=i*.31, x=240+Math.sin(a)*93, b=240-Math.sin(a)*93;
        art+=`<path class="xp-rung" d="M${x} ${y}H${b}"/>`+circle(x,y,5.6,'class="xp-bead"')+circle(b,y,5.6,'class="xp-organelle"');
      }
      art+='<path class="xp-fine" d="M87 113H160M320 367H414"/>';
    }
    return `<svg viewBox="0 0 480 480" fill="none" aria-hidden="true"><g class="xp-orbit"><ellipse cx="240" cy="240" rx="214" ry="214"/><ellipse cx="240" cy="240" rx="226" ry="226" stroke-dasharray="1 12"/></g><g class="xp-organism">${art}</g><path class="xp-fine" d="M28 60V28H60M420 28H452V60M452 420V452H420M60 452H28V420"/></svg>`;
  }

  function emphasize(element){
    const pattern=/(single-cell RNA-seq|spatial transcriptomics|bulk RNA-seq|non-viral|CAR-T|CRISPR(?:\/Cas9)?|Nanoinjection|nanoneedles|nanotubes|PRRX2\+?|SPP1\+?|AURKA|TGF-β|MMP2\+?|Dasatinib|gemcitabine resistance|neoantigen prediction|15% ahead of schedule|three papers|单细胞|空间转录组|非病毒|纳米注射|脱靶|肿瘤新抗原|生物标志物|吉西他滨耐药|细胞间通讯)/gi;
    const nodes=[];function walk(node){for(const child of [...node.childNodes]){if(child.nodeType===3)nodes.push(child);else if(child.nodeType===1&&child.tagName!=='MARK')walk(child);}}walk(element);
    for(const node of nodes){const parts=node.textContent.split(pattern);if(parts.length<2)continue;const fragment=document.createDocumentFragment();parts.forEach((text,i)=>{if(i%2){const mark=document.createElement('mark');mark.className='xp-keyword';mark.textContent=text;fragment.append(mark);}else fragment.append(document.createTextNode(text));});node.replaceWith(fragment);}
  }

  function build() {
    const section=page.querySelector('section');
    if(!section)return;
    const existing=section.querySelector('.xp-atlas');
    if(existing===boundAtlas && existing)return;
    // The site's language switch can restore a saved HTML snapshot. Rebind its nodes.
    if(existing){
      const restored=[...existing.querySelectorAll('.xp-record')].map(record=>{
        const card=document.createElement('div');card.className='content-item';
        const details=document.createElement('div');details.className='details';
        ['h3','.date-location','ul'].forEach(selector=>{const node=record.querySelector(selector);if(node)details.append(node);});
        card.append(details);return card;
      });
      section.replaceChildren(...restored);
    }
    const cards=[...section.querySelectorAll('.content-item')];
    if(cards.length!==3)return;
    dispose();
    const zh=root.lang.startsWith('zh');
    const words=zh?{
      title:'研究',italic:'实践',eyebrow:'研究经历 / NAN WANG',intro:'从临床问题出发，穿越细胞与数据，走向新的发现。',scroll:'向下滚动，探索研究经历',index:'研究档案',roles:['免疫工程','多组学整合','临床研究'],places:['瓯江实验室','北京亦兴博瑞','国家癌症中心'],themes:[['纳米递送','CAR-T','CRISPR'],['单细胞','空间组学','肿瘤异质性'],['肺癌','抗原预测','病理学']],note:'概念科学图形 · 非实验数据',end:'让问题引领下一次发现。'
    }:{title:'Research',italic:'in practice.',eyebrow:'EXPERIENCE / NAN WANG',intro:'From clinical questions to cells, data, and new discoveries.',scroll:'SCROLL TO EXPLORE THE WORK',index:'FIELD NOTES',roles:['Engineering immunity','Decoding complexity','Closer to the clinic'],places:['Oujiang Laboratory','Yixing Borui','National Cancer Center'],themes:[['Nanoinjection','CAR-T','CRISPR'],['Single-cell','Spatial omics','Heterogeneity'],['Lung cancer','Antigen prediction','Pathology']],note:'Conceptual illustration · not experimental data',end:'Following the next question.'};
    cards.sort((a,b)=>{
      const date=c=>{const m=c.querySelector('.date-location')?.textContent.match(/(\d{2})\/(20\d{2})/);return m?Number(m[2])*12+Number(m[1]):0;};
      return date(b)-date(a);
    });
    const atlas=document.createElement('div');atlas.className='xp-atlas';boundAtlas=atlas;
    atlas.innerHTML=`<header class="xp-cover"><div class="xp-cover-top"><span>${words.eyebrow}</span><span>2024 — PRESENT</span></div><h2><span>${words.title}</span><em>${words.italic}</em></h2><div class="xp-cover-art">${specimen(0)}</div><div class="xp-cover-bottom"><p>${words.intro}</p><span class="xp-scroll">↓ &nbsp; ${words.scroll}</span></div><span class="xp-cover-number" aria-hidden="true">03</span></header><div class="xp-index"><span>${words.index}</span><div class="xp-index-items"></div><span class="xp-index-count">01 / 03</span><i class="xp-index-progress" aria-hidden="true"></i></div><div class="xp-chapters"></div><footer class="xp-colophon"><span>2024 — PRESENT / NAN WANG</span><p>${words.end}</p><span>COMPUTATIONAL BIOLOGY · BIOMEDICAL AI</span></footer>`;
    const chapters=atlas.querySelector('.xp-chapters');
    cards.forEach((card,i)=>{
      const title=card.querySelector('h3'),meta=card.querySelector('.date-location'),ul=card.querySelector('ul');
      const article=document.createElement('article');article.className='xp-chapter';article.id='xp-chapter-'+i;
      article.dataset.chapter=i;
      const year=meta?.textContent.match(/20\d{2}/)?.[0]||'';
      article.innerHTML=`<aside class="xp-specimen"><div class="xp-specimen-top"><span>0${i+1} / ${words.index}</span><span>${year}</span></div><h3 class="xp-concept">${words.roles[i]}</h3><div class="xp-specimen-art">${specimen(i)}</div><div class="xp-specimen-bottom"><span>${words.themes[i][0]}</span><span>↗</span></div><small class="xp-art-note">${words.note}</small></aside><div class="xp-record"><div class="xp-record-head"><span class="xp-record-kicker">0${i+1} — ${words.places[i]}</span></div><div class="xp-tags">${words.themes[i].map(t=>'<span>'+t+'</span>').join('')}</div></div>`;
      const head=article.querySelector('.xp-record-head');if(title)head.append(title);if(meta)head.append(meta);
      if(ul){ul.className='xp-work';article.querySelector('.xp-record').append(ul);const caption=document.createElement('div');caption.className='xp-specimen-caption';caption.innerHTML='<span class="xp-caption-index">01</span><span class="xp-caption-copy"></span>';article.querySelector('.xp-specimen').append(caption);const label=caption.querySelector('.xp-caption-copy');label.textContent=words.themes[i].join(' / ');[...ul.children].forEach((li,k)=>{li.dataset.note=String(k+1).padStart(2,'0');emphasize(li);const show=()=>{article.dataset.activeNote=li.dataset.note;caption.querySelector('.xp-caption-index').textContent=li.dataset.note;label.textContent=li.querySelector('mark,strong')?.textContent||words.themes[i][k%3];};li.addEventListener('pointerenter',show);li.addEventListener('focusin',show);});
article.querySelectorAll('.xp-spot,.xp-organelle,.xp-bead').forEach((dot,k)=>{dot.addEventListener('pointerenter',()=>{label.textContent=words.themes[i][k%3];article.dataset.activeNote=String(k%ul.children.length+1).padStart(2,'0');});});}
      chapters.append(article);
      const item=document.createElement('span');item.className='xp-index-item';item.tabIndex=0;item.textContent=`0${i+1} / ${words.places[i]}`;
      // Hover previews the associated scientific specimen without moving the page.
      item.addEventListener('pointerenter',()=>{article.classList.add('xp-preview');});
      item.addEventListener('pointerleave',()=>article.classList.remove('xp-preview'));
      item.addEventListener('focus',()=>article.scrollIntoView({block:'start',behavior:motion.matches?'instant':'smooth'}));
      atlas.querySelector('.xp-index-items').append(item);
    });
    // Reuse all original role headings, dates and list nodes, including translated copy.
    section.replaceChildren(atlas);section.classList.add('xp-section');
    const updateActive=()=>root.classList.toggle('experience-atlas',page.classList.contains('active'));
    updateActive();
    let frame=0;
    const articles=[...chapters.children],items=[...atlas.querySelectorAll('.xp-index-item')];
    function paint(){
      frame=0;if(!page.classList.contains('active'))return;
      const vh=innerHeight;let active=0;const cover=atlas.querySelector('.xp-cover').getBoundingClientRect();atlas.style.setProperty('--cover-progress',Math.max(0,Math.min(1,-cover.top/Math.max(1,cover.height))).toFixed(3));
      articles.forEach((a,i)=>{
        const rect=a.getBoundingClientRect(),p=Math.max(0,Math.min(1,(vh*.7-rect.top)/(rect.height+vh*.25)));
        if(rect.top<vh*.5)active=i;
        if(rect.bottom>0&&rect.top<vh){a.style.setProperty('--chapter-progress',motion.matches?'.5':p.toFixed(3));}
      });
      items.forEach((e,i)=>e.classList.toggle('is-current',i===active));
      atlas.querySelector('.xp-index-count').textContent='0'+(active+1)+' / 03';
      const r=chapters.getBoundingClientRect();atlas.style.setProperty('--read-progress',Math.max(0,Math.min(1,(vh*.4-r.top)/r.height)).toFixed(3));
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
    const activeObserver=new MutationObserver(()=>{updateActive();schedule();});activeObserver.observe(page,{attributes:true,attributeFilter:['class']});
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('xp-in-view',e.isIntersecting)),{rootMargin:'0px 0px -5% 0px',threshold:0});
    atlas.querySelectorAll('.xp-work li').forEach(el=>reveal.observe(el));
    const pointer=e=>{
      if(motion.matches||e.pointerType==='touch')return;
      const area=e.currentTarget,r=area.getBoundingClientRect();
      area.style.setProperty('--pointer-pixel-x',(e.clientX-r.left)+'px');area.style.setProperty('--pointer-pixel-y',(e.clientY-r.top)+'px');
      area.style.setProperty('--pointer-x',((e.clientX-r.left)/r.width-.5).toFixed(3));
      area.style.setProperty('--pointer-y',((e.clientY-r.top)/r.height-.5).toFixed(3));
    };
    atlas.querySelectorAll('.xp-cover,.xp-specimen').forEach(el=>{el.addEventListener('pointermove',pointer);el.addEventListener('pointerleave',()=>{el.style.setProperty('--pointer-x','0');el.style.setProperty('--pointer-y','0');});});
    dispose=()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);activeObserver.disconnect();reveal.disconnect();cancelAnimationFrame(frame);};
    schedule();
  }
  new MutationObserver(build).observe(page,{childList:true,subtree:true});
  build();
})();
