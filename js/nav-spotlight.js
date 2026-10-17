(() => {
  const card = document.querySelector('.nav-glass-container');
  if (!card) {
    return;
  }

  let angle = 0;
  let spinning = false;
  let rafId = 0;

  /**
   * Write pointer position into --x / --y in card-local pixels.
   * @param {PointerEvent} event
   */
  const setPos = (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--y', `${event.clientY - rect.top}px`);
  };

  const tick = () => {
    if (!spinning) {
      return;
    }
    angle = (angle + 1.8) % 360;
    card.style.setProperty('--nav-angle', `${angle}deg`);
    rafId = requestAnimationFrame(tick);
  };

  const startSpin = () => {
    if (spinning) {
      return;
    }
    spinning = true;
    card.classList.add('is-spotlight');
    rafId = requestAnimationFrame(tick);
  };

  const stopSpin = () => {
    spinning = false;
    card.classList.remove('is-spotlight');
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  };

  card.addEventListener('pointermove', setPos);
  card.addEventListener('pointerenter', (event) => {
    setPos(event);
    startSpin();
  });
  card.addEventListener('pointerleave', stopSpin);
})();
