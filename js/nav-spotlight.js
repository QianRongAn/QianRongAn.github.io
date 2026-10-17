(() => {
  const bar = document.querySelector('.nav-glass-container');
  const cards = document.querySelectorAll('.nav-links .nav-link');
  if (!bar && !cards.length) {
    return;
  }

  let angle = 0;
  let activeCard = null;
  let barSpinning = false;
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
    if (!activeCard && !barSpinning) {
      return;
    }
    angle = (angle + 1.8) % 360;
    const value = `${angle}deg`;
    if (activeCard) {
      activeCard.style.setProperty('--nav-angle', value);
    }
    if (bar && barSpinning) {
      bar.style.setProperty('--nav-angle', value);
    }
    rafId = requestAnimationFrame(tick);
  };

  const startSpin = (card) => {
    if (activeCard && activeCard !== card) {
      activeCard.classList.remove('is-spotlight');
    }
    activeCard = card;
    card.classList.add('is-spotlight');
    ensureTick();
  };

  const stopSpin = (card) => {
    card.classList.remove('is-spotlight');
    if (activeCard === card) {
      activeCard = null;
      if (!barSpinning && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }
  };

  const ensureTick = () => {
    if (!rafId && (activeCard || barSpinning)) {
      rafId = requestAnimationFrame(tick);
    }
  };

  if (bar) {
    const setBarPos = (event) => {
      const rect = bar.getBoundingClientRect();
      bar.style.setProperty('--x', `${event.clientX - rect.left}px`);
      bar.style.setProperty('--y', `${event.clientY - rect.top}px`);
    };
    bar.addEventListener('pointermove', setBarPos);
    bar.addEventListener('pointerenter', (event) => {
      setBarPos(event);
      barSpinning = true;
      bar.classList.add('is-spotlight');
      ensureTick();
    });
    bar.addEventListener('pointerleave', () => {
      barSpinning = false;
      bar.classList.remove('is-spotlight');
      if (!activeCard && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    });
  }

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
