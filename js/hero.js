/* Original foot3 background, quiet light dust, and click ripples inspired by the supplied video. */
(function () {
    'use strict';
    var hero = document.getElementById('heroScreen');
    var canvas = document.getElementById('heroEffects');
    if (!hero) return;
    var ctx = canvas && canvas.getContext('2d');
    var enter = document.getElementById('heroEnter');
    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var dismissed = false, frame = 0, last = 0;
    var width = 0, height = 0, dust = [], ripples = [], sparks = [];
    var touchY = null;
    document.documentElement.classList.add('hero-locked');

            var IMG_W = 1392, IMG_H = 768;              // foot3 原始尺寸
            // ---- 留白填充：按图片 contain 后的实际显示矩形摆放四条填充块 ----
            // 左右条占图片矩形外的整条侧边（全高），上下条只占图片矩形外的中部，
            // 四块互不重叠；颜色取自图片真实边缘像素（CSS 里的渐变/纯色），故无接缝。
            var fills = {
                l: document.querySelector('.hero-fill-l'),
                r: document.querySelector('.hero-fill-r'),
                t: document.querySelector('.hero-fill-t'),
                b: document.querySelector('.hero-fill-b')
            };
            function layoutFills() {
                var vw = window.innerWidth, vh = window.innerHeight;
                var R = IMG_W / IMG_H;
                var dispW, dispH;
                if (vw / vh > R) { dispH = vh; dispW = vh * R; }      // 视口更宽 → 左右留白
                else { dispW = vw; dispH = vw / R; }                  // 视口更窄 → 上下留白
                var sideW = Math.max(0, (vw - dispW) / 2);
                var sideH = Math.max(0, (vh - dispH) / 2);

                if (fills.l) { fills.l.style.display = sideW > 0.5 ? 'block' : 'none'; fills.l.style.width = Math.ceil(sideW + 1) + 'px'; }
                if (fills.r) { fills.r.style.display = sideW > 0.5 ? 'block' : 'none'; fills.r.style.width = Math.ceil(sideW + 1) + 'px'; }
                if (fills.t) {
                    fills.t.style.display = sideH > 0.5 ? 'block' : 'none';
                    fills.t.style.left = Math.floor(sideW - 1) + 'px';
                    fills.t.style.right = Math.floor(sideW - 1) + 'px';
                    fills.t.style.height = Math.ceil(sideH + 1) + 'px';
                }
                if (fills.b) {
                    fills.b.style.display = sideH > 0.5 ? 'block' : 'none';
                    fills.b.style.left = Math.floor(sideW - 1) + 'px';
                    fills.b.style.right = Math.floor(sideW - 1) + 'px';
                    fills.b.style.height = Math.ceil(sideH + 1) + 'px';
                }
            }
            layoutFills();

    function resize() {
        layoutFills();
        if (!ctx || dismissed) return;
        width = hero.clientWidth; height = hero.clientHeight;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        dust = [];
        for (var i = 0, n = Math.min(90, Math.round(width * height / 18000)); i < n; i++) {
            dust.push({x: Math.random() * width, y: Math.random() * height,
                r: .6 + Math.random() * 1.5, speed: 5 + Math.random() * 12,
                phase: Math.random() * Math.PI * 2});
        }
        draw(performance.now());
    }

    function draw(now) {
        if (!ctx || dismissed) return;
        var dt = Math.min((now - last) / 1000 || 0, .05);
        last = now;
        ctx.clearRect(0, 0, width, height);
        dust.forEach(function (p) {
            if (!motion.matches) {
                p.y -= p.speed * dt;
                p.x += Math.sin(now / 5000 + p.phase) * dt * 4;
                if (p.y < -5) p.y = height + 5;
            }
            ctx.globalAlpha = .12 + .13 * (1 + Math.sin(now / 2000 + p.phase)) / 2;
            ctx.fillStyle = '#e1e6ff';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        });
        ripples = ripples.filter(function (p) { return now - p.born < 1800; });
        ripples.forEach(function (p) {
            var t = (now - p.born) / 1800;
            for (var i = 0; i < 3; i++) {
                var progress = t - i * .09;
                if (progress <= 0) continue;
                var radius = 8 + (1 - Math.pow(1 - progress, 2)) * Math.min(width * .28, 330);
                ctx.globalAlpha = Math.pow(1 - t, 2) * (.32 - i * .06);
                ctx.lineWidth = 1.5 + (1 - t) * 2;
                ctx.strokeStyle = '#d8ddff';
                ctx.shadowColor = '#a1b6ff'; ctx.shadowBlur = 12;
                ctx.beginPath(); ctx.ellipse(p.x, p.y, radius, radius * .82, -.2, 0, Math.PI * 2); ctx.stroke();
            }
        });
        ctx.shadowBlur = 0;
        sparks = sparks.filter(function (p) { return now - p.born < 1200; });
        sparks.forEach(function (p) {
            var t = (now - p.born) / 1200, distance = 100 * (1 - Math.pow(1 - t, 3));
            ctx.globalAlpha = .7 * (1 - t);
            ctx.fillStyle = '#e1e6ff';
            ctx.beginPath();
            ctx.arc(p.x + Math.cos(p.angle) * distance * p.speed,
                p.y + Math.sin(p.angle) * distance * p.speed - t * 18, 1.4 * (1 - t) + .3, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    function animate(now) {
        frame = 0;
        if (dismissed || document.hidden || motion.matches) return;
        draw(now);
        frame = requestAnimationFrame(animate);
    }
    function resume() {
        cancelAnimationFrame(frame); frame = 0; last = 0;
        if (!dismissed && !document.hidden && !motion.matches && ctx) frame = requestAnimationFrame(animate);
    }
    function ripple(x, y) {
        if (!ctx || dismissed || motion.matches) return;
        var now = performance.now();
        if (ripples.length >= 6) ripples.shift();
        ripples.push({x: x, y: y, born: now});
        for (var i = 0; i < 14; i++) sparks.push({x: x, y: y, born: now,
            angle: Math.random() * Math.PI * 2, speed: .35 + Math.random() * .8});
        sparks = sparks.slice(-84);
    }
    function onClick(e) {
        // Preserve social link destinations; background clicks only create ripples.
        if (e.target.closest('a, button')) return;
        var rect = hero.getBoundingClientRect();
        ripple(e.clientX - rect.left, e.clientY - rect.top);
    }
    function dismiss() {
        if (dismissed) return;
        dismissed = true;
        cancelAnimationFrame(frame);
        document.documentElement.classList.remove('hero-locked');
        hero.classList.add('hero-leaving');
        hero.setAttribute('aria-hidden', 'true');
        hero.inert = true;
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', resume);
        motion.removeEventListener('change', onMotionChange);
        hero.removeEventListener('click', onClick);
        var target = document.getElementById('intro');
        if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus({preventScroll: true});
            target.scrollIntoView({behavior: motion.matches ? 'auto' : 'smooth', block: 'start'});
        }
        window.setTimeout(function () { hero.hidden = true; hero.style.display = 'none'; }, motion.matches ? 0 : 1200);
    }
    function onWheel(e) { if (e.deltaY > 0) dismiss(); }
    function onKey(e) {
        if (e.target.closest('a, button, input, textarea, select')) return;
        if (['ArrowDown', 'PageDown', ' ', 'Escape'].indexOf(e.key) !== -1) { e.preventDefault(); dismiss(); }
    }
    function onTouchStart(e) { touchY = e.touches[0].clientY; }
    function onTouchMove(e) { if (touchY !== null && touchY - e.touches[0].clientY > 25) dismiss(); }
    function onMotionChange() { ripples = []; sparks = []; resize(); resume(); }
    if (enter) enter.addEventListener('click', function (e) { e.preventDefault(); dismiss(); });
    hero.addEventListener('click', onClick);
    window.addEventListener('wheel', onWheel, {passive: true});
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, {passive: true});
    window.addEventListener('touchmove', onTouchMove, {passive: true});
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', resume);
    motion.addEventListener('change', onMotionChange);
    resize(); resume();
})();
