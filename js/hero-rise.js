/* Name and focus line rise out of per-line masks, one character at a time. */
(function () {
    'use strict';
    var nodes = document.querySelectorAll('.hero-split');
    if (!nodes.length || typeof gsap === 'undefined' || typeof SplitText === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(SplitText);
    var nameChars = 0;
    nodes.forEach(function (el, index) {
        SplitText.create(el, {
            type: 'lines,chars',
            linesClass: 'hero-mask',
            charsClass: 'hero-char',
            mask: 'lines',
            autoSplit: true,
            onSplit: function (self) {
                if (index === 0) nameChars = self.chars.length;
                return gsap.from(self.chars, {
                    yPercent: 110,
                    duration: 1.15,
                    stagger: 0.03,
                    delay: index === 0 ? 0 : nameChars * 0.03,
                    ease: 'expo.out',
                    onComplete: function () {
                        el.classList.add('is-settled');
                    }
                });
            }
        });
    });
})();
