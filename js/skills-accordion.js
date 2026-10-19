(function () {
    'use strict';
    function init() {
        var page = document.getElementById('skills');
        if (!page) return;
        var section = page.querySelector('section');
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        var entered = false, scrollFrame = 0;
        var progress = 1, curtainFrame = 0, curtainStart = 0;
        var curtain = document.createElement('div');
        curtain.id = 'skillsCurtain';
        curtain.setAttribute('aria-hidden', 'true');
        curtain.innerHTML = '<canvas aria-hidden="true"></canvas><span>Skills &amp; methods</span><small>SEQUENCES · SYSTEMS · DISCOVERY</small>';
        document.body.appendChild(curtain);
        var field = curtain.querySelector('canvas'), ink = field.getContext('2d');
        function drawField(now) {
            var w = innerWidth, h = innerHeight, dpr = Math.min(devicePixelRatio || 1, 1.5);
            if (field.width !== Math.round(w * dpr) || field.height !== Math.round(h * dpr)) { field.width = Math.round(w * dpr); field.height = Math.round(h * dpr); }
            ink.setTransform(dpr, 0, 0, dpr, 0, 0); ink.clearRect(0, 0, w, h);
            var points = [];
            for (var i = 0; i < 36; i++) points.push({x: w * (.1 + (i % 9) / 10) + Math.sin(now * .00035 + i) * 16, y: h * (.13 + Math.floor(i / 9) * .24) + Math.cos(now * .0004 + i * .6) * 24});
            ink.strokeStyle = '#72796a'; ink.lineWidth = .65;
            points.forEach(function (p, i) {
                points.slice(i + 1).forEach(function (q) { var d = Math.hypot(p.x-q.x,p.y-q.y); if(d < w * .16){ink.globalAlpha = .16 * (1-d/(w*.16)); ink.beginPath();ink.moveTo(p.x,p.y);ink.lineTo(q.x,q.y);ink.stroke();} });
                ink.globalAlpha = .24; ink.fillStyle = '#72796a'; ink.beginPath();ink.arc(p.x,p.y,2.5,0,Math.PI*2);ink.fill();
            });
            ink.globalAlpha = .22; ink.font = '11px Inter, sans-serif';
            ['BLAST','R / Python','RNA-seq','Bioconductor','Seurat'].forEach(function (label,i) { var p=points[2+i*7];ink.fillText(label,p.x+12,p.y-12); });
            ink.globalAlpha = 1;
        }
        function paintCurtain() {
            curtain.dataset.progress = progress.toFixed(3);
            curtain.style.transform = 'translateY(' + (-102 * progress) + '%)';
            section.style.setProperty('--skills-entry-shift', ((1 - progress) * 60) + 'px');
            var revealing = entered && progress < .999;
            document.documentElement.classList.toggle('skills-unveiling', revealing);
            curtain.style.visibility = revealing ? 'visible' : 'hidden';
        }
        function renderCurtain(now) {
            curtainFrame = 0;
            if (!entered) return;
            var t = Math.max(0, Math.min(1, (now - curtainStart - 1200) / 1800));
            progress = t * t * t * (t * (t * 6 - 15) + 10);
            drawField(now);
            paintCurtain();
            if (progress < 1) curtainFrame = requestAnimationFrame(renderCurtain);
        }
        function parallax() {
            scrollFrame = 0;
            var amount = reduce.matches ? 0 : Math.min(window.scrollY, 600);
            page.style.setProperty('--skills-title-drift', (-amount * .055) + 'px');
            page.style.setProperty('--skills-copy-drift', (-amount * .09) + 'px');
        }
        window.addEventListener('scroll', function () {
            if (entered && !scrollFrame) scrollFrame = requestAnimationFrame(parallax);
        }, { passive: true });
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
            var active = page.classList.contains('active');
            document.documentElement.classList.toggle('skills-view', active);
            if (active && !entered && !reduce.matches) {
                progress = 0; curtainStart = performance.now();
                cancelAnimationFrame(curtainFrame); curtainFrame = requestAnimationFrame(renderCurtain);
                var zh = document.documentElement.lang.indexOf('zh') === 0;
                curtain.querySelector('span').textContent = zh ? '技能与方法' : 'Skills & methods';
                curtain.querySelector('small').textContent = zh ? '序列 · 系统 · 发现' : 'SEQUENCES · SYSTEMS · DISCOVERY';
            }
            if (!active || reduce.matches) { cancelAnimationFrame(curtainFrame); curtainFrame = 0; progress = 1; }
            entered = active;
            paintCurtain();
            parallax();
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
