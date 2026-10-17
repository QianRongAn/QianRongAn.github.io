/* Projects 右侧海报：鼠标跟随立体倾斜 */
(function () {
    'use strict';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function bindTilt(visual) {
        var frame = visual.querySelector('.project-poster-frame');
        if (!frame || reduce) return;

        visual.addEventListener('pointerenter', function () {
            visual.classList.add('is-tilting');
        });

        visual.addEventListener('pointermove', function (event) {
            var rect = frame.getBoundingClientRect();
            var px = (event.clientX - rect.left) / Math.max(rect.width, 1);
            var py = (event.clientY - rect.top) / Math.max(rect.height, 1);
            var rotY = (px - 0.5) * 16;
            var rotX = (0.5 - py) * 10;
            frame.style.transform =
                'rotateY(' + rotY.toFixed(2) + 'deg) rotateX(' + rotX.toFixed(2) + 'deg) translateZ(16px)';
        });

        visual.addEventListener('pointerleave', function () {
            visual.classList.remove('is-tilting');
            frame.style.transform = '';
        });
    }

    function bindAll(root) {
        root.querySelectorAll('[data-poster-tilt]').forEach(bindTilt);
    }

    function init() {
        var section = document.querySelector('#projects section');
        if (!section) return;
        bindAll(section);
        new MutationObserver(function () {
            bindAll(section);
        }).observe(section, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
