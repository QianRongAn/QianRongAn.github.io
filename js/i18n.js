/* Applies js/zh-copy.js without changing layout. */
(function () {
    'use strict';
    var root = document.documentElement;
    var englishTitle = document.title;

    function copy() {
        return window.ZH_COPY || { text: {}, html: {}, slots: {} };
    }

    function remember(el, key, value) {
        if (el[key] == null) el[key] = value;
        return el[key];
    }

    function apply(lang) {
        var zh = lang === 'zh';
        var pack = copy();
        root.lang = zh ? 'zh-CN' : 'en';
        root.classList.toggle('lang-zh', zh);
        try { sessionStorage.setItem('siteLang', zh ? 'zh' : 'en'); } catch (err) {}

        document.querySelectorAll('[data-zh-slot]').forEach(function (el) {
            if (['publications', 'projects', 'skills'].indexOf(el.getAttribute('data-zh-slot')) !== -1) return;
            var original = remember(el, '_enHtml', el.innerHTML);
            var next = zh && pack.slots && pack.slots[el.getAttribute('data-zh-slot')];
            if (next) el.innerHTML = next;
            else if (el.innerHTML !== original) el.innerHTML = original;
        });

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var original = remember(el, '_enText', el.textContent);
            var next = zh && pack.text && pack.text[el.getAttribute('data-i18n')];
            el.textContent = next || original;
        });

        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var original = remember(el, '_enHtml', el.innerHTML);
            var key = el.getAttribute('data-i18n-html');
            if (zh && pack.html && Object.prototype.hasOwnProperty.call(pack.html, key)) {
                var next = pack.html[key];
                if (!next) {
                    el.style.display = 'none';
                    return;
                }
                el.style.display = '';
                el.innerHTML = next;
                return;
            }
            el.style.display = '';
            if (el.innerHTML !== original) el.innerHTML = original;
        });

        document.querySelectorAll('[data-statement-link]').forEach(function (el) {
            var href = el.getAttribute('href') || 'personal_statement.html';
            var base = href.split('?')[0];
            el.setAttribute('href', zh ? base + '?lang=zh' : base);
        });

        document.title = (zh && pack.text && pack.text['page.title']) || englishTitle;
    }

    window.SiteI18n = { apply: apply };
})();
