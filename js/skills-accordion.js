(function () {
    'use strict';
    function init() {
        var page = document.getElementById('skills');
        if (!page) return;
        var section = page.querySelector('section');
        function decorate() {
            if (!section.querySelector('.skills-intro')) {
                var intro = document.createElement('div');
                intro.className = 'skills-intro';
                intro.appendChild(section.querySelector('h2'));
                var description = document.createElement('p');
                description.className = 'skills-description';
                intro.appendChild(description);
                section.prepend(intro);
                var list = document.createElement('div');
                list.className = 'skills-list';
                section.querySelectorAll('.skill-category').forEach(function (row) { list.appendChild(row); });
                section.appendChild(list);
            }
            var zh = document.documentElement.lang.indexOf('zh') === 0;
            var blurb = zh ? '从计算生物学到实验研究，连接数据、方法与发现。' : 'Tools and methods connecting computational biology and experimental research.';
            var description = section.querySelector('.skills-description');
            if (description.textContent !== blurb) description.textContent = blurb;
            section.querySelectorAll('.skill-category').forEach(function (row, index) {
                if (row.querySelector('.skill-toggle')) return;
                var heading = row.querySelector('h3');
                var content = row.querySelector('.skills-grid');
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'skill-toggle';
                button.id = 'skill-toggle-' + index;
                button.setAttribute('aria-expanded', 'false');
                button.setAttribute('aria-controls', 'skill-content-' + index);
                var label = document.createElement('span');
                label.textContent = heading.textContent.trim();
                var plus = document.createElement('span');
                plus.className = 'skill-plus';
                plus.setAttribute('aria-hidden', 'true');
                button.append(label, plus);
                heading.replaceChildren(button);
                var panel = document.createElement('div');
                panel.className = 'skill-panel';
                panel.id = 'skill-content-' + index;
                panel.setAttribute('role', 'region');
                panel.setAttribute('aria-labelledby', button.id);
                panel.inert = true;
                content.before(panel);
                panel.appendChild(content);
            });
            var titles = ['NGS 数据处理', '免疫组库分析', 'RNA-seq 分析', '全基因组测序（WGS）', '下游分析', '肿瘤新抗原', '分子生物学实验', '计算机与编程技能'];
            section.querySelectorAll('.skill-toggle').forEach(function (button, index) {
                var label = button.firstElementChild;
                if (!label.dataset.english) label.dataset.english = label.textContent;
                var title = zh ? titles[index] : label.dataset.english;
                if (label.textContent !== title) label.textContent = title;
            });
        }
        function visibility() {
            document.documentElement.classList.toggle('skills-view', page.classList.contains('active'));
        }
        section.addEventListener('click', function (event) {
            var button = event.target.closest('.skill-toggle');
            if (!button) return;
            var open = button.getAttribute('aria-expanded') !== 'true';
            section.querySelectorAll('.skill-toggle').forEach(function (other) {
                var expanded = other === button && open;
                other.setAttribute('aria-expanded', String(expanded));
                var row = other.closest('.skill-category');
                row.classList.toggle('is-open', expanded);
                row.querySelector('.skill-panel').inert = !expanded;
            });
        });
        decorate();
        visibility();
        new MutationObserver(decorate).observe(section, { childList: true, subtree: true });
        new MutationObserver(visibility).observe(page, { attributes: true, attributeFilter: ['class'] });
        new MutationObserver(decorate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
