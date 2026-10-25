/* Decorates the existing Experience markup (EN and the zh-copy.js version) so both stay in sync. */
(function () {
  'use strict';
  var page = document.getElementById('experience');
  if (!page) return;
  var SEL = 'section[data-zh-slot="experience"]';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function h(tag, cls, html) { var e = document.createElement(tag); e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function zh() { return document.documentElement.classList.contains('lang-zh'); }

  function one(item, i) {
    var d = item.querySelector('.details');
    if (!d) return;
    var title = d.querySelector('h3'), meta = d.querySelector('.date-location'), ul = d.querySelector('ul');
    if (!title || !meta) return;
    var parts = meta.textContent.split('|').map(function (s) { return s.trim(); });
    var date = parts.filter(function (p) { return /\d{4}/.test(p); })[0] || '';
    var now = /present|至今/i.test(date);
    item.classList.add('xp-card'); if (now) item.classList.add('is-now');
    item.appendChild(h('span', 'xp-no', '0' + (i + 1)));
    meta.className = 'date-location xp-org';
    meta.textContent = parts.filter(function (p) { return p !== date; }).join(' · ');
    // h3 / ul can be nested (the site wraps them in .glass-card-head / .glass-well),
    // so always insert against the node's real parent instead of .details
    title.parentNode.insertBefore(h('span', 'xp-date', date), title);
    if (!ul) return;
    var tags = [];
    ul.querySelectorAll('strong').forEach(function (s) { var t = s.textContent.trim(); if (tags.indexOf(t) < 0) tags.push(t); });
    if (tags.length) ul.parentNode.insertBefore(h('div', 'xp-tags', tags.slice(0, 6).map(function (t) { return '<span>' + t + '</span>'; }).join('')), ul);
    var lis = ul.querySelectorAll('li');
    if (lis.length <= 3) return;
    ul.classList.add('xp-fold');
    for (var k = 3; k < lis.length; k++) lis[k].classList.add('xp-extra');
    var n = lis.length - 3, btn = h('button', 'xp-more', zh() ? '展开其余 ' + n + ' 条' : 'Show ' + n + ' more');
    btn.type = 'button';
    btn.addEventListener('click', function () {
      var open = ul.classList.toggle('is-open');
      btn.textContent = open ? (zh() ? '收起' : 'Show less') : (zh() ? '展开其余 ' + n + ' 条' : 'Show ' + n + ' more');
      if (open && window.gsap && !reduce) gsap.from(ul.querySelectorAll('.xp-extra'), { autoAlpha: 0, y: 8, duration: .4, stagger: .05 });
    });
    ul.parentNode.appendChild(btn);
  }

  function decorate() {
    var sec = page.querySelector(SEL);
    var items = sec && sec.querySelectorAll('.content-item');
    if (!items || !items.length || sec.querySelector('.xp-rail')) return;
    sec.classList.add('xp');
    sec.appendChild(h('div', 'xp-rail'));
    items.forEach(function (item, i) {
      try { one(item, i); } catch (e) { /* one broken card must not kill the rest */ }
    });
    if (page.classList.contains('active')) play();
  }

  function play() {
    if (!window.gsap || reduce) return;
    var sec = page.querySelector(SEL); if (!sec) return;
    gsap.fromTo(sec.querySelector('.xp-rail'), { scaleY: 0 }, { scaleY: 1, duration: 1.3, ease: 'power2.out' });
    gsap.from(sec.querySelectorAll('.xp-card'), { autoAlpha: 0, y: 34, duration: .8, stagger: .18, ease: 'power3.out', clearProps: 'transform' });
  }

  new MutationObserver(decorate).observe(page, { childList: true, subtree: true });
  var was = page.classList.contains('active');
  new MutationObserver(function () {
    var is = page.classList.contains('active');
    if (is && !was) play();
    was = is;
  }).observe(page, { attributes: true, attributeFilter: ['class'] });
  decorate();
})();
