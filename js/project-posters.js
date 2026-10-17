/* Projects 全屏分栏：点右侧海报，切换左侧圆角卡片内容 */
(function () {
    'use strict';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function bindTilt(poster) {
        var frame = poster.querySelector('.project-poster-frame');
        if (!frame || reduce) return;
        if (poster._tiltBound) return;
        poster._tiltBound = true;

        poster.addEventListener('pointerenter', function () {
            poster.classList.add('is-tilting');
        });

        poster.addEventListener('pointermove', function (event) {
            var rect = frame.getBoundingClientRect();
            var px = (event.clientX - rect.left) / Math.max(rect.width, 1);
            var py = (event.clientY - rect.top) / Math.max(rect.height, 1);
            var rotY = (px - 0.5) * 16;
            var rotX = (0.5 - py) * 10;
            frame.style.transform =
                'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateY(-8px) translateZ(20px)';
        });

        poster.addEventListener('pointerleave', function () {
            poster.classList.remove('is-tilting');
            frame.style.transform = '';
        });
    }

    function showProject(root, id) {
        if (!root || !id) return;
        root.querySelectorAll('.content-item').forEach(function (el) {
            el.classList.toggle('is-active', el.id === id);
        });
        root.querySelectorAll('.project-poster[data-project-target]').forEach(function (poster) {
            var on = poster.getAttribute('data-project-target') === id;
            poster.classList.toggle('is-active', on);
            poster.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    function bind(root) {
        root.querySelectorAll('.project-poster[data-project-target]').forEach(function (poster) {
            bindTilt(poster);
            if (poster._clickBound) return;
            poster._clickBound = true;
            poster.addEventListener('click', function (event) {
                event.preventDefault();
                showProject(root, poster.getAttribute('data-project-target'));
            });
        });
        var active = root.querySelector('.project-poster.is-active') ||
            root.querySelector('.project-poster[data-project-target]');
        if (active) showProject(root, active.getAttribute('data-project-target'));
    }

    function syncProjectsView() {
        var page = document.getElementById('projects');
        var on = !!(page && page.classList.contains('active'));
        document.documentElement.classList.toggle('projects-view', on);
    }

    function init() {
        var section = document.querySelector('#projects section');
        if (!section) return;
        bind(section);
        syncProjectsView();

        var observer = new MutationObserver(function () {
            bind(section);
            syncProjectsView();
        });
        observer.observe(section, { childList: true, subtree: false });

        var page = document.getElementById('projects');
        if (page) {
            new MutationObserver(syncProjectsView).observe(page, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        document.addEventListener('click', function (event) {
            var link = event.target.closest && event.target.closest('.nav-link[data-target]');
            if (!link) return;
            window.setTimeout(syncProjectsView, 30);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
