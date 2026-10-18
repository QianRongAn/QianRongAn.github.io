/* Publications stand on a full 360-degree ring, like a rotating carousel wall.
   Cards are landscape with content-sized height and the front-facing cards never overlap: every card
   corner is projected analytically and a minimum gap is enforced between the
   neighbours you actually see (the back of the ring is allowed to tuck behind). */
(function () {
    'use strict';

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var PERSPECTIVE = 3600; /* keep in sync with css/pub-gallery.css */
    var TILT = 12;          /* keep in sync with css/pub-gallery.css */
    var ROLL = -12;         /* diagonal ring axis, like the reference */
    var LEAN = -8;          /* tops lean outward in the radial direction */
    var SLICES = 24;        /* tangent panels approximate a continuous cylinder */
    var SWAY = 8;           /* pointer sway, in degrees */
    var RATIO = 0.5;        /* minimum height; full text can make a card taller */
    var GAP = 22;           /* minimum horizontal gap between neighbours, px */

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
            angles.push(count > 1 ? i * 360 / count : 0);
        }
        var tiltRad = TILT * Math.PI / 180;
        var cosT = Math.cos(tiltRad);
        var sinT = Math.sin(tiltRad);
        var leanRad = LEAN * Math.PI / 180;
        var cosL = Math.cos(leanRad), sinL = Math.sin(leanRad);
        var rollRad = ROLL * Math.PI / 180;
        var cosR = Math.cos(rollRad), sinR = Math.sin(rollRad);
        var current = 0;

        function cardBox(width, height, radius, scale, angleDeg) {
            var th = angleDeg * Math.PI / 180;
            var ct = Math.cos(th), st = Math.sin(th);
            var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (var c = 0; c <= SLICES * 2 + 1; c++) {
                var lx = (Math.floor(c / 2) / SLICES - 0.5) * width;
                var ly = (c % 2 ? 0.5 : -0.5) * height;
                var arc = lx / radius;
                var cx = radius * Math.sin(arc);
                var cz = radius * (Math.cos(arc) - 1);
                var cy = ly * cosL - cz * sinL;
                cz = ly * sinL + cz * cosL;
                var bx = cx * ct + (radius + cz) * st;
                var bz = -cx * st + (radius + cz) * ct;
                var y2 = cy * cosT + bz * sinT;
                var z2 = -cy * sinT + bz * cosT;
                var persp = PERSPECTIVE / (PERSPECTIVE - z2 * scale);
                var sx = (bx * cosR - y2 * sinR) * scale * persp;
                var sy = (bx * sinR + y2 * cosR) * scale * persp;
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

        function frontArc(sway) {
            var list = [];
            for (var i = 0; i < count; i++) {
                var a = (angles[i] + sway) % 360;
                if (a < 0) a += 360;
                if (Math.cos(a * Math.PI / 180) > 0.15) {
                    list.push(a > 180 ? a - 360 : a);
                }
            }
            list.sort(function (x, y) { return x - y; });
            return list;
        }

        function minGap(width, height, radius, scale) {
            var g = Infinity;
            for (var p = -SWAY; p <= SWAY; p += SWAY) {
                var front = frontArc(p);
                for (var i = 0; i + 1 < front.length; i++) {
                    var a = cardBox(width, height, radius, scale, front[i]);
                    var b = cardBox(width, height, radius, scale, front[i + 1]);
                    var gap = b.minX - a.maxX;
                    if (gap < g) g = gap;
                }
            }
            return g;
        }

        function fitScale(width, height, radius, target, axis) {
            function measure(s) {
                var b = ringBox(width, height, radius, s);
                return axis === 'h' ? b.h : b.w;
            }
            var lo = 0.05, hi = 2;
            if (measure(hi) <= target) return hi;
            for (var k = 0; k < 24; k++) {
                var mid = (lo + hi) / 2;
                if (measure(mid) <= target) lo = mid; else hi = mid;
            }
            return lo;
        }

        function transform() {
            return 'translate(-50%, -50%) translateY(var(--pub-shift, 0px))' +
                ' scale3d(var(--pub-scale, 1), var(--pub-scale, 1), var(--pub-scale, 1))' +
                ' rotateZ(' + ROLL + 'deg) rotateX(-' + TILT + 'deg) rotateY(' + current.toFixed(2) + 'deg)';
        }

        var radius = 900;
        var surfaceKey = '';

        function bendCards(width, height) {
            var key = [width, height, radius].join(':');
            if (surfaceKey === key) return;
            surfaceKey = key;
            cards.forEach(function (card) {
                var source = card.querySelector('.pub-front');
                source.classList.add('pub-source');
                var previous = card.querySelector('.pub-curved-surface');
                if (previous) previous.remove();
                var surface = document.createElement('div');
                surface.className = 'pub-curved-surface';
                surface.setAttribute('aria-hidden', 'true');
                for (var j = 0; j < SLICES; j++) {
                    var sliceWidth = width / SLICES;
                    var center = (j + 0.5) * sliceWidth - width / 2;
                    var angle = center / radius;
                    var panel = document.createElement('div');
                    panel.className = 'pub-curve-panel';
                    panel.style.width = (sliceWidth + 1.4) + 'px';
                    panel.style.height = height + 'px';
                    panel.style.marginLeft = (-sliceWidth / 2 - 0.7) + 'px';
                    panel.style.transform = 'translate3d(' + (radius * Math.sin(angle)) + 'px,0,' +
                        (radius * (Math.cos(angle) - 1)) + 'px) rotateY(' + (angle * 180 / Math.PI) + 'deg)';
                    var content = source.cloneNode(true);
                    content.classList.remove('pub-source');
                    content.classList.add('pub-panel-content');
                    content.style.width = width + 'px';
                    content.style.height = height + 'px';
                    content.style.left = (-j * sliceWidth + 0.7) + 'px';
                    panel.appendChild(content);
                    surface.appendChild(panel);
                }
                card.appendChild(surface);
            });
        }

        function layout() {
            var stageWidth = stage.clientWidth || window.innerWidth;
            var width = Math.min(720, Math.max(560, stageWidth * 0.45));
            grid.style.width = width + 'px';
            grid.style.setProperty('--pub-height', 'auto');
            var fronts = cards.map(function (card) { return card.querySelector('.pub-front'); });
            fronts.forEach(function (front) { front.style.minHeight = '0'; });
            var height = Math.max(width * RATIO, Math.ceil(Math.max.apply(null, fronts.map(function (front) {
                return front.scrollHeight;
            }))) + 24);
            grid.style.setProperty('--pub-height', height + 'px');
            fronts.forEach(function (front) { front.style.removeProperty('min-height'); });

            var availH = Math.max(520, Math.min(900, window.innerHeight - 170));
            var availW = Math.max(360, stageWidth - 40);

            /* find the radius that renders the front cards largest while keeping
               a clear gap between neighbours and everything inside the viewport */
            var bestR = width * 1.5;
            var bestS = 1;
            var bestScore = -1;
            for (var R = width * 1.5; R <= 5000; R *= 1.06) {
                var s = Math.min(1.15,
                    fitScale(width, height, R, availH, 'h'),
                    fitScale(width, height, R, availW, 'w'));
                if (minGap(width, height, R, s) >= GAP) {
                    var f = cardBox(width, height, R, s, 0);
                    var score = (f.maxX - f.minX) * (f.maxY - f.minY);
                    if (score > bestScore) {
                        bestScore = score;
                        bestR = R;
                        bestS = s;
                    }
                }
            }
            radius = bestR;
            bendCards(width, height);

            var box = ringBox(width, height, radius, bestS);
            grid.style.setProperty('--pub-scale', bestS);
            grid.style.setProperty('--pub-shift', (-(box.minY + box.maxY) / 2).toFixed(1) + 'px');
            stage.style.height = Math.ceil(box.h + 24) + 'px';
            cards.forEach(function (card, i) {
                card.style.transform = 'rotateY(' + angles[i].toFixed(2) + 'deg) translateZ(' + radius + 'px) rotateX(' + LEAN + 'deg)';
            });
            grid.style.transform = transform();
        }

        layout();
        new ResizeObserver(layout).observe(stage);
        var contentObserver = new ResizeObserver(layout);
        cards.forEach(function (card) { contentObserver.observe(card.querySelector('.pub-content')); });
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
