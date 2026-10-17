/* Projects 海报：鼠标跟隨時立体倾斜，点击滚到对应介绍 */
(function () {
    'use strict';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function bindTilt(poster) {
        var frame = poster.querySelector('.project-poster-frame');
        if (!frame || reduce) return;

        poster.addEventListener('pointerenter', function () {
            poster.classList.add('is-tilting');
        });

        poster.addEventListener('pointermove', function (event) {
            var rect = frame.getBoundingClientRect();
            var px = (event.clientX - rect.left) / Math.max(rect.width, 1);
            var py = (event.clientY - rect.top) / Math.max(rect.height, 1);
            var rotY = (px - 0.5) * 18;
            var rotX = (0.5 - py) * 12;
            frame.style.transform =
                'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateY(-8px) translateZ(18px)';
        });

        poster.addEventListener('pointerleave', function () {
            poster.classList.remove('is-tilting');
            frame.style.transform = '';
        });
    }

    function spotlight(id) {
        var target = document.getElementById(id);
        if (!target) return;
        document.querySelectorAll('#projects .content-item.is-spotlight').forEach(function (el) {
            el.classList.remove('is-spotlight');
        });
        target.classList.add('is-spotlight');
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        window.setTimeout(function () {
            target.classList.remove('is-spotlight');
        }, 1600);
    }

    function bindClicks(root) {
        root.querySelectorAll('.project-poster[data-project-target]').forEach(function (poster) {
            bindTilt(poster);
            poster.addEventListener('click', function (event) {
                var id = poster.getAttribute('data-project-target');
                if (!id) return;
                event.preventDefault();
                spotlight(id);
            });
        });
    }

    function init() {
        var section = document.querySelector('#projects section');
        if (!section) return;
        bindClicks(section);

        // 中文槽位替换后重新绑定
        var observer = new MutationObserver(function () {
            bindClicks(section);
        });
        observer.observe(section, { childList: true, subtree: false });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
