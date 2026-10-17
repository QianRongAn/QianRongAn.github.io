/* Publications sit on a ring and turn with the pointer.
   The ring is measured analytically (3D projection of every card corner) so it can
   grow to the largest size that still keeps all six cards inside the viewport. */
(function () {
    'use strict';

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var PERSPECTIVE = 3600; /* keep in sync with css/pub-gallery.css */
    var TILT_MIN = 20;
    var TILT_MAX = 34;
    var SPREAD = 1.35; /* how far cards may overlap before the tilt is increased */

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
        var stepRad = step * Math.PI / 180;
        var tiltDeg = 26;
        var tiltRad = tiltDeg * Math.PI / 180;
        var cosT = Math.cos(tiltRad);
        var sinT = Math.sin(tiltRad);
        var current = 0;

        /* Bounding box of the whole ring on screen. Cards are evenly spaced, so one
           sixth of a turn covers every rotation the pointer can reach. */
        function ringBox(width, height, radius, scale) {
            var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (var k = 0; k < 8; k++) {
                var phi = (step * k / 8) * Math.PI / 180;
                for (var i = 0; i < cards.length; i++) {
                    var th = i * stepRad + phi;
                    var ct = Math.cos(th), st = Math.sin(th);
                    for (var c = 0; c < 4; c++) {
                        var lx = (c & 1 ? 0.5 : -0.5) * width;
                        var ly = (c & 2 ? 0.5 : -0.5) * height;
                        var bx = lx * ct + radius * st;
                        var bz = -lx * st + radius * ct;
                        var y2 = ly * cosT + bz * sinT;
                        var z2 = -ly * sinT + bz * cosT;
                        var persp = PERSPECTIVE / (PERSPECTIVE - z2 * scale);
                        var sx = bx * scale * persp;
                        var sy = y2 * scale * persp;
                        if (sx < minX) minX = sx;
                        if (sx > maxX) maxX = sx;
                        if (sy < minY) minY = sy;
                        if (sy > maxY) maxY = sy;
                    }
                }
            }
            return { minX: minX, maxX: maxX, minY: minY, maxY: maxY, w: maxX - minX, h: maxY - minY };
        }

        /* perspective is not linear in scale, so solve for the scale by bisection */
        function fitScale(width, height, radius, target, axis) {
            function measure(s) {
                var b = ringBox(width, height, radius, s);
                return axis === 'h' ? b.h : b.w;
            }
            var lo = 0.05, hi = 2;
            if (measure(hi) <= target) return hi;
            for (var k = 0; k < 26; k++) {
                var mid = (lo + hi) / 2;
                if (measure(mid) <= target) lo = mid; else hi = mid;
            }
            return lo;
        }

        function transform() {
            return 'translate(-50%, -50%) translateY(var(--pub-shift, 0px))' +
                ' scale3d(var(--pub-scale, 1), var(--pub-scale, 1), var(--pub-scale, 1))' +
                ' rotateX(-' + tiltDeg.toFixed(2) + 'deg) rotateY(' + current.toFixed(2) + 'deg)';
        }

        function layout() {
            var stageWidth = stage.clientWidth || window.innerWidth;
            var width = Math.min(520, Math.max(320, stageWidth * 0.30));
            grid.style.width = width + 'px';
            grid.style.setProperty('--pub-height', 'auto');
            var height = Math.max.apply(null, cards.map(function (card) {
                return card.querySelector('.pub-front').scrollHeight;
            }));
            grid.style.setProperty('--pub-height', height + 'px');

            /* ring wide enough to keep neighbours apart, tight enough to stay on screen */
            var radius = Math.max(width * 1.4, Math.min(880, (stageWidth - 60 - width * 0.52) / 1.888));
            tiltDeg = Math.max(TILT_MIN, Math.min(TILT_MAX, Math.atan(height / radius / SPREAD) * 180 / Math.PI));
            tiltRad = tiltDeg * Math.PI / 180;
            cosT = Math.cos(tiltRad);
            sinT = Math.sin(tiltRad);

            var availH = Math.max(520, Math.min(900, window.innerHeight - 170));
            var availW = Math.max(360, stageWidth - 40);
            var scale = Math.min(1.15,
                fitScale(width, height, radius, availH, 'h'),
                fitScale(width, height, radius, availW, 'w'));

            var box = ringBox(width, height, radius, scale);
            grid.style.setProperty('--pub-scale', scale);
            grid.style.setProperty('--pub-shift', (-(box.minY + box.maxY) / 2).toFixed(1) + 'px');
            stage.style.height = Math.ceil(box.h + 24) + 'px';
            cards.forEach(function (card, i) {
                card.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)';
            });
            grid.style.transform = transform();
        }

        layout();
        new ResizeObserver(layout).observe(stage);
        window.addEventListener('resize', layout);
        if (document.fonts) document.fonts.ready.then(layout);

        if (reduce) return;

        var target = 0;
        var raf = 0;

        function paint() {
            current += (target - current) * 0.08;
            if (Math.abs(target - current) < 0.04) current = target;
            grid.style.transform = transform();
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
