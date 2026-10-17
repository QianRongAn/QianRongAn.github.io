(() => {
  const cards = document.querySelectorAll('.nav-links .nav-link');
  if (!cards.length) {
    return;
  }

  let angle = 0;
  let activeCard = null;
  let rafId = 0;

  /**
   * Write pointer position into --x / --y in the hovered word card.
   * @param {HTMLElement} card
   * @param {PointerEvent} event
   */
  const setPos = (card, event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--y', `${event.clientY - rect.top}px`);
  };

  const tick = () => {
    if (!activeCard) {
      return;
    }
    angle = (angle + 1.8) % 360;
    activeCard.style.setProperty('--nav-angle', `${angle}deg`);
    rafId = requestAnimationFrame(tick);
  };

  const startSpin = (card) => {
    if (activeCard && activeCard !== card) {
      activeCard.classList.remove('is-spotlight');
    }
    activeCard = card;
    card.classList.add('is-spotlight');
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const stopSpin = (card) => {
    card.classList.remove('is-spotlight');
    if (activeCard === card) {
      activeCard = null;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }
  };

  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      setPos(card, event);
    });
    card.addEventListener('pointerenter', (event) => {
      setPos(card, event);
      startSpin(card);
    });
    card.addEventListener('pointerleave', () => {
      stopSpin(card);
    });
  });
})();
