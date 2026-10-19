(function(){
'use strict';if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||(innerWidth<=768&&innerHeight<=1024))return;
function init(){
const root=document.documentElement,intro=document.getElementById('intro'),about=document.getElementById('about');if(!intro||!about)return;const section=about.querySelector('section');
const masthead=document.createElement('header');masthead.className='about-masthead';const kicker=document.createElement('p');kicker.className='about-eyebrow';masthead.append(kicker,section.querySelector('h2'));
const deck=document.createElement('p');deck.className='about-deck';masthead.append(deck);
const copy=document.createElement('div');copy.className='about-research-copy';while(section.firstChild)copy.append(section.firstChild);
const identity=document.createElement('div');identity.className='about-identity';identity.append(intro.querySelector('.profile-photo'),intro.querySelector('h1'),intro.querySelector('p[data-i18n="intro.role"]'));intro.prepend(identity);
const evidence=document.createElement('div');evidence.className='about-evidence';section.append(masthead,intro,copy,evidence);
function update(){const zh=root.lang.startsWith('zh');root.classList.toggle('about-editorial',about.classList.contains('active'));kicker.textContent=zh?'01 / 关于我':'01 / ABOUT THE RESEARCHER';const title=zh?'从生命的规律，<br>走向新的<em>可能。</em>':'Understanding life.<br>Opening <em>possibilities.</em>';if(deck.innerHTML!==title)deck.innerHTML=title;
const stats=zh?'<div><strong>06</strong><span>学术论文</span><small>5 篇已发表 · 1 篇审稿中</small></div><div><strong>40.4</strong><span>期刊影响因子</span><small>J Hematol Oncol · 共同第一作者</small></div><div><strong>02</strong><span>独立 AI 项目</span><small>结构建模 · 医学证据分析</small></div>':'<div><strong>06</strong><span>Research papers</span><small>5 published · 1 under review</small></div><div><strong>40.4</strong><span>Journal impact factor</span><small>J Hematol Oncol · co-first author</small></div><div><strong>02</strong><span>Independent AI projects</span><small>Structure modelling · medical evidence</small></div>';if(evidence.innerHTML!==stats)evidence.innerHTML=stats;
}update();new MutationObserver(update).observe(about,{attributes:true,attributeFilter:['class']});new MutationObserver(update).observe(root,{attributes:true,attributeFilter:['lang']});
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
