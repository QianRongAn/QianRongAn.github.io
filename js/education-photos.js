document.querySelectorAll('.education-photo-toggle').forEach(button => {
 button.addEventListener('click', () => {
  const showPhoto = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(showPhoto));
  button.setAttribute('aria-label', showPhoto ? 'Show watercolor collage' : 'Show photograph');
  button.nextElementSibling.textContent = showPhoto ? 'Click to view watercolor' : 'Click to view photograph';
 });
});
