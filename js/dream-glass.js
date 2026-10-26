(function () {
    'use strict';
    function init() {
        var names = { education: ['01 / Learning & discovery', '01 / 学习与探索'], experience: ['02 / Research in practice', '02 / 研究与实践'], extracurricular: ['03 / Beyond the laboratory', '03 / 实验室之外'], thesis: ['04 / A closer look', '04 / 深入研究'] };
        function decorate() {
            var zh = document.documentElement.lang.indexOf('zh') === 0;
            Object.keys(names).forEach(function (id) {
                var section = document.querySelector('#' + id + ' > section');
                if (!section) return;
                var label = section.querySelector('.dream-kicker');
                if (!label) { label = document.createElement('p'); label.className = 'dream-kicker'; section.prepend(label); }
                var text = names[id][zh ? 1 : 0];
                if (label.textContent !== text) label.textContent = text;
                section.querySelectorAll(':scope > .content-item').forEach(function (card, index) {
                    var details = card.querySelector('.details');
                    if (!details || details.querySelector('.glass-well')) return;
                    var well = document.createElement('div'); well.className = 'glass-well';
                    var header = document.createElement('div'); header.className = 'glass-card-head';
                    var ornament = document.createElement('span'); ornament.className = 'glass-medallion'; ornament.setAttribute('aria-hidden', 'true');
                    ornament.innerHTML = '<span></span><small>0' + (index + 1) + '</small>';
                    header.appendChild(ornament);
                    var heading = id !== 'thesis' && details.querySelector('h3, h4');
                    if (heading) header.appendChild(heading);
                    var date = id !== 'thesis' && details.querySelector('.date-location');
                    if (date) header.appendChild(date);
                    while (details.firstChild) well.appendChild(details.firstChild);
                    details.append(header, well);
                });
                if (id === 'extracurricular') {
                    var meetings = section.querySelectorAll(':scope > .content-item');
                    if (meetings.length >= 2 && !meetings[0].classList.contains('activity-meetings-card')) {
                        var first = meetings[0], second = meetings[1];
                        var firstHead = first.querySelector('.glass-card-head'), firstWell = first.querySelector('.glass-well');
                        while (firstWell.firstChild) firstHead.appendChild(firstWell.firstChild);
                        second.querySelectorAll('.glass-card-head h3, .glass-card-head h4, .glass-card-head .date-location').forEach(function (node) { firstWell.appendChild(node); });
                        var secondWell = second.querySelector('.glass-well');
                        while (secondWell.firstChild) firstWell.appendChild(secondWell.firstChild);
                        first.classList.add('activity-meetings-card');
                        first.querySelector('.details').style.removeProperty('margin-bottom');
                        second.remove();
                    }
                }
            });
            var active = document.querySelector('.cube-page.active');
            document.documentElement.classList.toggle('dream-view', !!active && Object.prototype.hasOwnProperty.call(names, active.id));
        }
        decorate();
        var wrapper = document.getElementById('content-wrapper');
        if (wrapper) new MutationObserver(decorate).observe(wrapper, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        new MutationObserver(decorate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
