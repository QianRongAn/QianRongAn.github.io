/* Original hero background with drifting luminous particles and a soft pointer trail. */
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
    var sparks = [], pointer = null, lastSpark = 0;
    var glowSprites = ['194,215,255', '255,235,201'].map(function (color) {
        var sprite = document.createElement('canvas');
        sprite.width = sprite.height = 64;
        var light = sprite.getContext('2d');
        if (!light) return sprite;
        var gradient = light.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(.045, 'rgba(255,255,255,.95)');
        gradient.addColorStop(.16, 'rgba(' + color + ',.42)');
        gradient.addColorStop(.48, 'rgba(' + color + ',.10)');
        gradient.addColorStop(1, 'rgba(' + color + ',0)');
        light.fillStyle = gradient;
        light.fillRect(0, 0, 64, 64);
        return sprite;
    });
    if (canvas) canvas.dataset.effect = 'glowing-particles';
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
        for (var i = 0, n = Math.min(85, Math.round(width * height / 15500)); i < n; i++) {
            dust.push({x: Math.random() * width, y: Math.random() * height,
                r: .8 + Math.random() * 1.5, speed: 6 + Math.random() * 12,
                phase: Math.random() * Math.PI * 2, color: i % 4 === 0 ? 1 : 0});
        }
        draw(performance.now());
    }

    function draw(now) {
        if (!ctx || dismissed) return;
        var dt = Math.min((now - last) / 1000 || 0, .05);
        last = now;
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';
        dust.forEach(function (p) {
            if (!motion.matches) {
                p.y -= p.speed * dt;
                p.x += Math.sin(now / 5000 + p.phase) * dt * 4;
                if (p.y < -5) p.y = height + 5;
            }
            var pulse = motion.matches ? .6 : .4 + .6 * (1 + Math.sin(now / 1800 + p.phase)) / 2;
            ctx.globalAlpha = pulse * .85;
            var size = p.r * 18;
            ctx.drawImage(glowSprites[p.color], p.x - size / 2, p.y - size / 2, size, size);
        });
        sparks = sparks.filter(function (spark) {
            spark.life -= dt;
            if (spark.life <= 0) return false;
            spark.x += spark.vx * dt;
            spark.y += spark.vy * dt;
            ctx.globalAlpha = Math.pow(spark.life / spark.maxLife, 1.5) * .9;
            var size = spark.r * 20;
            ctx.drawImage(glowSprites[spark.color], spark.x - size / 2, spark.y - size / 2, size, size);
            return true;
        });
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }

    function onParticleMove(event) {
        if (!ctx || dismissed || motion.matches || event.pointerType === 'touch') return;
        if (event.target.closest('a, button')) return;
        var now = performance.now();
        var rect = hero.getBoundingClientRect();
        var x = event.clientX - rect.left, y = event.clientY - rect.top;
        if (now - lastSpark < 35 || (pointer && Math.hypot(x - pointer.x, y - pointer.y) < 5)) return;
        pointer = {x: x, y: y};
        lastSpark = now;
        for (var i = 0; i < 3; i++) {
            var life = .65 + Math.random() * .8;
            sparks.push({x: x + (Math.random() - .5) * 12, y: y + (Math.random() - .5) * 12,
                vx: (Math.random() - .5) * 22, vy: -12 - Math.random() * 20,
                r: .7 + Math.random(), color: i % 2, life: life, maxLife: life});
        }
        if (sparks.length > 48) sparks.splice(0, sparks.length - 48);
    }
    function onParticleLeave() { pointer = null; }

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
    function unbindHero() {
        hero.removeEventListener('pointermove', onParticleMove);
        hero.removeEventListener('pointerleave', onParticleLeave);
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', resume);
        motion.removeEventListener('change', onMotionChange);
    }
    function showHobbies() {
        var hobbies = document.getElementById('scroll-target-about');
        var header = document.getElementById('top-header');
        if (!hobbies) return;
        var headerBottom = header ? header.getBoundingClientRect().height + 8 : 84;
        var photo = document.querySelector('#intro .profile-photo');
        var photoTop = photo ? photo.getBoundingClientRect().top : headerBottom;
        var overflow = hobbies.getBoundingClientRect().bottom - window.innerHeight + 20;
        if (overflow <= 0) return;
        var roomAbovePhoto = photoTop - headerBottom;
        var delta = roomAbovePhoto > 8 ? Math.min(overflow, roomAbovePhoto) : overflow;
        var root = document.scrollingElement || document.documentElement;
        root.scrollTop += delta;
    }
    function revealHome() {
        cancelAnimationFrame(frame);
        document.documentElement.classList.remove('hero-locked');
        hero.classList.remove('hero-leaving');
        hero.setAttribute('aria-hidden', 'true');
        hero.inert = true;
        hero.hidden = true;
        hero.style.display = 'none';
        hero.dispatchEvent(new Event('hero:dismiss'));
        var target = document.getElementById('intro');
        if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus({preventScroll: true});
        }
        showHobbies();
        window.setTimeout(showHobbies, 50);
    }
    function playCurtain(lang) {
        if (dismissed) return;
        var curtain = document.getElementById('pageCurtain');
        var countEl = document.getElementById('pageCurtainCount');
        var title = document.querySelector('#intro h1');
        if (!curtain || typeof gsap === 'undefined' || motion.matches) {
            dismissed = true;
            unbindHero();
            if (window.SiteI18n && lang) window.SiteI18n.apply(lang);
            revealHome();
            return;
        }
        dismissed = true;
        unbindHero();
        curtain.classList.add('is-on');
        var counter = { n: 0 };
        if (countEl) countEl.textContent = '00';
        gsap.set(curtain, { yPercent: 100 });
        if (title) {
            title.classList.add('is-curtain-title');
            gsap.set(title, { clipPath: 'inset(0% 0% 0% 0%)' });
        }
        gsap.timeline({
            defaults: { ease: 'power4.inOut' },
            onComplete: function () {
                curtain.classList.remove('is-on');
                gsap.set(curtain, { yPercent: 100 });
            }
        })
            .to(curtain, { yPercent: 0, duration: 1 })
            .to(counter, {
                n: 100,
                duration: 1,
                ease: 'none',
                onUpdate: function () {
                    if (!countEl) return;
                    var value = Math.round(counter.n);
                    countEl.textContent = value < 10 ? '0' + value : String(value);
                }
            }, '<')
            .add(function () {
                if (window.SiteI18n && lang) window.SiteI18n.apply(lang);
                revealHome();
            })
            .to(curtain, { yPercent: -100, duration: 1 })
            .from(title, {
                clipPath: 'inset(0% 0% 100% 0%)',
                duration: 1,
                ease: 'power4.out'
            }, '<');
    }
    function onWheel(e) { if (e.deltaY > 0) playCurtain(); }
    function onKey(e) {
        if (e.target.closest('a, button, input, textarea, select')) return;
        if (['ArrowDown', 'PageDown', ' ', 'Escape'].indexOf(e.key) !== -1) { e.preventDefault(); playCurtain(); }
    }
    function onTouchStart(e) { touchY = e.touches[0].clientY; }
    function onTouchMove(e) { if (touchY !== null && touchY - e.touches[0].clientY > 25) playCurtain(); }
    function onMotionChange() { resize(); resume(); }
    enters.forEach(function (enter) {
        enter.addEventListener('click', function (e) {
            e.preventDefault();
            playCurtain(enter.getAttribute('data-enter-lang') || 'en');
        });
    });
    window.addEventListener('wheel', onWheel, {passive: true});
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, {passive: true});
    window.addEventListener('touchmove', onTouchMove, {passive: true});
    window.addEventListener('resize', resize);
    hero.addEventListener('pointermove', onParticleMove, {passive: true});
    hero.addEventListener('pointerleave', onParticleLeave);
    document.addEventListener('visibilitychange', resume);
    motion.addEventListener('change', onMotionChange);
    resize(); resume();
})();
