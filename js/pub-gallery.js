/* Publications sit on a ring and turn with the pointer. */
(function () {
    'use strict';

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setup(grid) {
        if (!grid || grid._gallery) return;
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.publication-card'));
        if (!cards.length) return;
        grid._gallery = true;

        cards.forEach(function (card) {
            var front = document.createElement('div');
            front.className = 'pub-face pub-front';
            while (card.firstChild) front.appendChild(card.firstChild);
            card.appendChild(front);
            card.querySelectorAll('.pub-image').forEach(function (img, idx) {
                img.classList.add('stack-' + (idx + 1));
            });
        });

        var stage = grid.closest('.pub-stage') || grid.parentElement;
        var step = 360 / cards.length;
        function layout() {
            var width = Math.min(260, Math.max(180, stage.clientWidth * 0.21));
            grid.style.width = width + 'px';
            grid.style.setProperty('--pub-height', 'auto');
            var height = Math.max.apply(null, cards.map(function (card) {
                return card.querySelector('.pub-front').scrollHeight;
            }));
            grid.style.setProperty('--pub-height', height + 'px');
            var radius = Math.max(width, Math.min(540, (stage.clientWidth - width * 1.4) / 2));
            var fullHeight = height + radius * 0.94 + 100;
            var available = Math.max(440, Math.min(760, window.innerHeight - 280));
            var scale = Math.min(1, available / fullHeight);
            grid.style.setProperty('--pub-scale', scale);
            stage.style.height = (fullHeight * scale) + 'px';
            cards.forEach(function (card, i) {
                card.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)';
            });
        }
        layout();
        new ResizeObserver(layout).observe(stage);
        window.addEventListener('resize', layout);
        if (document.fonts) document.fonts.ready.then(layout);

        if (reduce) return;

        var current = 0;
        var target = 0;
        var raf = 0;

        function paint() {
            current += (target - current) * 0.08;
            if (Math.abs(target - current) < 0.04) current = target;
            grid.style.transform = 'translate(-50%, -50%) scale3d(var(--pub-scale), var(--pub-scale), var(--pub-scale)) rotateX(-28deg) rotateY(' + current.toFixed(2) + 'deg)';
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
