/* Name and focus line rise out of per-line masks, one character at a time. */
(function () {
    'use strict';
    var nodes = document.querySelectorAll('.hero-split');
    if (!nodes.length || typeof gsap === 'undefined' || typeof SplitText === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(SplitText);
    var nameChars = 0;

    nodes.forEach(function (el, index) {
        var isFocus = el.classList.contains('hero-focus');
        var focusFont = "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";

        if (isFocus) {
            el.style.setProperty('font-family', focusFont, 'important');
            el.style.setProperty('font-style', 'italic', 'important');
            el.style.setProperty('font-weight', '300', 'important');
            el.style.setProperty('font-size', 'clamp(1.55rem, 2.8vw, 2.15rem)', 'important');
        }

        SplitText.create(el, {
            type: isFocus ? 'chars' : 'lines,chars',
            linesClass: 'hero-mask',
            charsClass: 'hero-char',
            mask: isFocus ? false : 'lines',
            autoSplit: !isFocus,
            onSplit: function (self) {
                if (index === 0) nameChars = self.chars.length;
                if (el.classList.contains('hero-title')) {
                    el.querySelectorAll('.hero-mask').forEach(function (mask) {
                        mask.style.paddingBottom = '0.72em';
                        var clip = mask.parentElement;
                        if (clip && clip !== el) {
                            clip.style.paddingBottom = '0.72em';
                            clip.style.height = 'auto';
                        }
                    });
                }
                if (isFocus) {
                    el.querySelectorAll('.hero-focus-line').forEach(function (line) {
                        line.classList.add('hero-mask');
                    });
                    self.chars.forEach(function (char) {
                        char.style.setProperty('font-family', focusFont, 'important');
                        char.style.setProperty('font-style', 'italic', 'important');
                        char.style.setProperty('font-weight', '300', 'important');
                        char.style.setProperty('font-size', 'inherit', 'important');
                    });
                }
                return gsap.from(self.chars, {
                    yPercent: 110,
                    duration: 1.15,
                    stagger: 0.03,
                    delay: index === 0 ? 0 : nameChars * 0.03,
                    ease: 'expo.out',
                    onComplete: function () {
                        el.classList.add('is-settled');
                        if (!el.classList.contains('hero-title')) return;
                        el.querySelectorAll('.hero-mask').forEach(function (mask) {
                            mask.style.overflow = 'visible';
                            var clip = mask.parentElement;
                            if (clip && clip !== el) {
                                clip.style.overflow = 'visible';
                                clip.style.height = 'auto';
                            }
                        });
                    }
                });
            }
        });
    });
})();
