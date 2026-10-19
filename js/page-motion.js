/* Content enters while glass shells and their backdrop filters stay stable. */
(function () {
    'use strict';
    var running = [];
    function enter(page) {
        if (!page || !page.classList.contains('active')) return;
        running.forEach(function (animation) { animation.cancel(); }); running = [];
        if (matchMedia('(prefers-reduced-motion: reduce)').matches || page.id === 'skills') return;
        function animate(elements) {
            Array.from(elements).forEach(function (el, index) {
                running.push(el.animate([{ opacity: 0, translate: '0 20px' }, { opacity: 1, translate: '0 0' }], {
                    duration: 640, delay: Math.min(index * 45, 200), easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'backwards'
                }));
            });
            page.dataset.transition = 'soft-rise';
        }
        if (page.id === 'projects') {
            var frame = page.querySelector('iframe');
            function showProjects() {
                if (!page.classList.contains('active')) return;
                var doc = frame.contentDocument;
                if (doc) animate(doc.querySelectorAll('main > .intro-line, .project-trigger, main > footer'));
            }
            if (frame.contentDocument && frame.contentDocument.querySelector('main')) showProjects();
            else frame.addEventListener('load', showProjects, { once: true });
        } else if (page.id === 'publications') animate(page.querySelectorAll('.pub-stage'));
        else if (page.id === 'about') animate(page.querySelectorAll('section > *'));
        else animate(page.querySelectorAll('.dream-kicker, .section-title, .glass-card-head, .glass-well, .education-item > *, .activity-image, .footnotes > *'));
    }
    window.SitePageMotion = { enter: enter };
})();
