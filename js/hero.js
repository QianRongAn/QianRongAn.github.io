/* Original foot3 background, quiet light dust, with a separate background refraction layer. */
(function () {
    'use strict';
    var hero = document.getElementById('heroScreen');
    var canvas = document.getElementById('heroEffects');
    if (!hero) return;
    if (document.documentElement.classList.contains('skip-hero')) {
        hero.hidden = true;
        hero.style.display = 'none';
        hero.setAttribute('aria-hidden', 'true');
        var params = new URLSearchParams(location.search);
        if (window.SiteI18n && params.get('lang') === 'zh') window.SiteI18n.apply('zh');
        var home = document.getElementById('intro');
        if (home) {
            home.setAttribute('tabindex', '-1');
            home.focus({preventScroll: true});
            home.scrollIntoView({behavior: 'auto', block: 'start'});
        }
        return;
    }
    var ctx = canvas && canvas.getContext('2d');
    var enters = document.querySelectorAll('[data-enter-lang]');
    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var dismissed = false, frame = 0, last = 0;
    var width = 0, height = 0, dust = [];
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
        hero.dispatchEvent(new Event('hero:dismiss'));
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
    function onMotionChange() { resize(); resume(); }
    enters.forEach(function (enter) {
        enter.addEventListener('click', function (e) {
            e.preventDefault();
            var lang = enter.getAttribute('data-enter-lang') || 'en';
            if (window.SiteI18n) window.SiteI18n.apply(lang);
            dismiss();
        });
    });
    window.addEventListener('wheel', onWheel, {passive: true});
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, {passive: true});
    window.addEventListener('touchmove', onTouchMove, {passive: true});
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', resume);
    motion.addEventListener('change', onMotionChange);
    resize(); resume();
})();
