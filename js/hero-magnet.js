/* Magnetic language buttons: follow the pointer, spring back on leave. */
(function () {
    'use strict';
    if (typeof gsap === 'undefined') return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.mag').forEach(function (root) {
        var btn = root.querySelector('.mag-btn');
        var label = root.querySelector('.mag-label');
        if (!btn || !label) return;

        root.addEventListener('mousemove', function (event) {
            if (reduce) return;
            var rect = root.getBoundingClientRect();
            var dx = event.clientX - (rect.left + rect.width / 2);
            var dy = event.clientY - (rect.top + rect.height / 2);
            var buttonRect = btn.getBoundingClientRect();
            btn.style.setProperty('--pointer-x', (event.clientX - buttonRect.left) + 'px');
            btn.style.setProperty('--pointer-y', (event.clientY - buttonRect.top) + 'px');
            gsap.to(btn, { x: dx * 0.3, y: dy * 0.3, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
            gsap.to(label, { x: dx * 0.12, y: dy * 0.12, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
        });

        root.addEventListener('mouseleave', function () {
            gsap.to([btn, label], {
                x: 0,
                y: 0,
                duration: reduce ? 0 : 0.9,
                ease: 'elastic.out(1, 0.38)',
                overwrite: 'auto'
            });
        });
    });
})();
