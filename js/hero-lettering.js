/* Intentional character-level mixing, keeping a single readable text label. */
(function(){
 document.querySelectorAll('#heroScreen .hero-focus-line').forEach(function(line){
  var text=line.textContent;line.setAttribute('aria-label',text);line.textContent='';
  var rise=document.createElement('span');rise.className='hero-line-rise';line.appendChild(rise);
  Array.from(text).forEach(function(letter){var span=document.createElement('span');span.textContent=letter;span.setAttribute('aria-hidden','true');span.className='hero-letter '+('CTAMO'.includes(letter)?'hero-letter--producer':'en'.includes(letter)?'hero-letter--italic':'hero-letter--base');rise.appendChild(span);});
 });
})();
