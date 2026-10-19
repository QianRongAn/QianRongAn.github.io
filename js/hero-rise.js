/* A centerline mask writes the original Bidaq outlines, stroke by stroke. */
(function () {
    'use strict';
    var title = document.querySelector('.hero-title');
    var focus = document.querySelector('.hero-focus');
    var ns = 'http://www.w3.org/2000/svg';
    function node(tag, attrs) {
        var el = document.createElementNS(ns, tag);
        Object.keys(attrs || {}).forEach(function (key) { el.setAttribute(key, attrs[key]); });
        return el;
    }
    function reveal() { document.documentElement.classList.remove('hero-font-pending'); }
    function start(results) {
        if (!title || results[0] === false) { reveal(); return; }
        var data = results[1];
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var svg = node('svg', { viewBox: '0 0 ' + data.width + ' ' + data.height, class: 'signature', 'aria-hidden': 'true' });
        var defs = node('defs'); svg.appendChild(defs);
        var total = data.letters.reduce(function (sum, letter) { return sum + letter.strokes.reduce(function (n, s) { return n + s.length; }, 0); }, 0);
        var elapsed = .15;
        data.letters.forEach(function (letter, index) {
            var mask = node('mask', { id: 'signature-mask-' + index, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: data.width, height: data.height });
            var shape = node('path', { d: letter.outline, fill: 'currentColor', mask: 'url(#signature-mask-' + index + ')' });
            letter.strokes.forEach(function (stroke) {
                var duration = Math.max(.055, stroke.length / total * 3.5);
                var line = node('path', { d: stroke.d, fill: 'none', stroke: 'white', 'stroke-width': stroke.width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 });
                if (!reduced) {
                    line.style.strokeDasharray = '1'; line.style.strokeDashoffset = '1';
                    line.style.animation = 'signature-ink ' + duration + 's linear ' + elapsed + 's forwards';
                }
                mask.appendChild(line); elapsed += duration;
            });
            defs.appendChild(mask); svg.appendChild(shape); elapsed += .055;
        });
        title.setAttribute('aria-label', 'Nan Wang');
        title.replaceChildren(svg); title.classList.add('signature-ready');
        if (focus && !reduced) focus.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 900, fill: 'backwards', easing: 'ease-out' });
        title.dataset.animation = 'stroke-writing';
        reveal();
    }
    Promise.all([window.heroTitleFontReady || Promise.resolve(true), fetch('js/signature-paths.json').then(function (r) { if (!r.ok) throw Error('Signature unavailable'); return r.json(); })]).then(start).catch(reveal);
})();