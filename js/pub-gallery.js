/* Publications sit on a ring and turn with the pointer. */
(function () {
    'use strict';

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var radius = 540;

    function setup(grid) {
        if (!grid || grid._gallery) return;
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.publication-card'));
        if (!cards.length) return;
        grid._gallery = true;

        cards.forEach(function (card) {
            card.querySelectorAll('.pub-image').forEach(function (img, idx) {
                img.classList.add('stack-' + (idx + 1));
            });
        });

        var step = 360 / cards.length;
        cards.forEach(function (card, i) {
            card.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)';
        });

        if (reduce) return;

        var stage = grid.closest('.pub-stage') || grid.parentElement;
        var current = 0;
        var target = 0;
        var raf = 0;

        function paint() {
            current += (target - current) * 0.08;
            if (Math.abs(target - current) < 0.04) current = target;
            grid.style.transform = 'translate(-50%, -50%) rotateY(' + current.toFixed(2) + 'deg)';
            raf = current === target ? 0 : requestAnimationFrame(paint);
        }

        function spin() {
            if (!raf) raf = requestAnimationFrame(paint);
        }

        stage.addEventListener('pointermove', function (event) {
            var rect = stage.getBoundingClientRect();
            var x = (event.clientX - rect.left) / Math.max(rect.width, 1);
            x = Math.max(0, Math.min(1, x));
            target = (0.5 - x) * 320;
            spin();
        });
    }

    function init() {
        document.querySelectorAll('#publications .publications-grid').forEach(setup);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
