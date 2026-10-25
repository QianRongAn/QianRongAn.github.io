/* The 3D "crystal" takeover adds html.experience-crystal, and journey/style.css hides
   the whole Experience list under it (#experience .content-item{display:none!important}),
   so any redesign of that list was invisible. Strip the class instead of patching the
   1.2 MB journey bundle. About page keeps its crystal effect. */
(function () {
  'use strict';
  var root = document.documentElement;
  function strip() {
    if (root.classList.contains('experience-crystal')) root.classList.remove('experience-crystal');
  }
  strip();
  new MutationObserver(strip).observe(root, { attributes: true, attributeFilter: ['class'] });
})();
