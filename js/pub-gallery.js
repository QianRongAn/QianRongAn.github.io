/* Publications stand on the front arc of a cylinder, like a curved gallery wall:
   the middle cards face the viewer, the outer ones turn away and rise a little.
   Every card corner is projected analytically so the arc can grow to the largest
   size that still keeps all cards inside the viewport. */
(function () {
    'use strict';

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var PERSPECTIVE = 3600; /* keep in sync with css/pub-gallery.css */
    var TILT = 12;          /* keep in sync with css/pub-gallery.css */
    var SPAN = 120;         /* degrees of the arc the cards are spread over */
    var SWAY = 18;          /* pointer sway, in degrees */

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
        var count = cards.length;
        var angles = [];
        for (var i = 0; i < count; i++) {
            angles.push(count > 1 ? -SPAN / 2 + SPAN * i / (count - 1) : 0);
        }
        var tiltRad = TILT * Math.PI / 180;
        var cosT = Math.cos(tiltRad);
        var sinT = Math.sin(tiltRad);
        var current = 0;

        function cardBox(width, height, radius, scale, angleDeg) {
            var th = angleDeg * Math.PI / 180;
            var ct = Math.cos(th), st = Math.sin(th);
            var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
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
            return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
        }

        function ringBox(width, height, radius, scale) {
            var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (var p = -SWAY; p <= SWAY; p += SWAY) {
                for (var i = 0; i < count; i++) {
                    var b = cardBox(width, height, radius, scale, angles[i] + p);
                    if (b.minX < minX) minX = b.minX;
                    if (b.maxX > maxX) maxX = b.maxX;
                    if (b.minY < minY) minY = b.minY;
                    if (b.maxY > maxY) maxY = b.maxY;
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
                ' rotateX(-' + TILT + 'deg) rotateY(' + current.toFixed(2) + 'deg)';
        }

        var radius = 600;

        function layout() {
            var stageWidth = stage.clientWidth || window.innerWidth;
            var width = Math.min(420, Math.max(300, stageWidth * 0.24));
            grid.style.width = width + 'px';
            grid.style.setProperty('--pub-height', 'auto');
            var height = Math.max.apply(null, cards.map(function (card) {
                return card.querySelector('.pub-front').scrollHeight;
            }));
            grid.style.setProperty('--pub-height', height + 'px');

            var availH = Math.max(520, Math.min(900, window.innerHeight - 170));
            var availW = Math.max(360, stageWidth - 40);

            /* pick the radius that renders the front cards largest */
            var bestR = Math.max(1.9 * width, 300);
            var bestS = 1;
            var bestScore = -1;
            for (var R = bestR; R <= 1600; R *= 1.08) {
                var s = Math.min(1.15,
                    fitScale(width, height, R, availH, 'h'),
                    fitScale(width, height, R, availW, 'w'));
                var front = cardBox(width, height, R, s, 0);
                var score = (front.maxX - front.minX) * (front.maxY - front.minY);
                if (score > bestScore) {
                    bestScore = score;
                    bestR = R;
                    bestS = s;
                }
            }
            radius = bestR;

            var box = ringBox(width, height, radius, bestS);
            grid.style.setProperty('--pub-scale', bestS);
            grid.style.setProperty('--pub-shift', (-(box.minY + box.maxY) / 2).toFixed(1) + 'px');
            stage.style.height = Math.ceil(box.h + 24) + 'px';
            cards.forEach(function (card, i) {
                card.style.transform = 'rotateY(' + angles[i].toFixed(2) + 'deg) translateZ(' + radius + 'px)';
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
            target = (0.5 - x) * SWAY * 2;
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
