/* Intentional character-level mixing, keeping a single readable text label. */
(function(){
 document.querySelectorAll('#heroScreen .hero-focus-line').forEach(function(line){
  var text=line.textContent;line.setAttribute('aria-label',text);line.textContent='';
  var rise=document.createElement('span');rise.className='hero-line-rise';line.appendChild(rise);
  Array.from(text).forEach(function(letter){var span=document.createElement('span');span.textContent=letter;span.setAttribute('aria-hidden','true');span.className='hero-letter '+('CTAMO'.includes(letter)?'hero-letter--producer':'en'.includes(letter)?'hero-letter--italic':'hero-letter--base');rise.appendChild(span);});
 });
 var letters=document.querySelectorAll('#heroScreen .hero-letter');
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
  letters.forEach(function(letter){letter.style.transform='translateY(110%)';});
  document.addEventListener('journey:reveal',function(){Promise.all([document.fonts.ready,window.heroTitleFontReady||Promise.resolve()]).then(function(){
   letters.forEach(function(letter,index){letter.animate([{transform:'translateY(110%)'},{transform:'translateY(0)'}],{duration:1150,delay:210+index*30,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});});
  });},{once:true});
 }
})();
