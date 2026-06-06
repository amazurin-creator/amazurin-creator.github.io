/* Kira Ito — visiting card.
   Three small behaviours:
     1. "Now" items expand on click to reveal a longer note.
     2. The brand "updated" indicator softly pulses on first visit.
     3. A contrast toggle in the colophon softens the ink. */

(() => {
  const STORAGE_VISIT = 'kira.visited';
  const STORAGE_CONTRAST = 'kira.contrast';

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Now items: expand/collapse ---------- */

  const nowItems = document.querySelectorAll('.now-item');
  nowItems.forEach((item) => {
    const toggle = item.querySelector('.now-toggle');
    const detail = item.querySelector('.now-detail');
    if (!toggle || !detail) return;

    toggle.addEventListener('click', () => {
      const isOpen = item.dataset.open === 'true';
      item.dataset.open = String(!isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));

      if (isOpen) {
        detail.classList.remove('is-open');
        // Keep it accessible during the close animation, then hide
        if (prefersReducedMotion) {
          detail.hidden = true;
        } else {
          setTimeout(() => {
            if (item.dataset.open !== 'true') detail.hidden = true;
          }, 380);
        }
      } else {
        detail.hidden = false;
        // Force reflow so the height transition runs from 0.
        // eslint-disable-next-line no-unused-expressions
        detail.offsetHeight;
        detail.classList.add('is-open');
      }
    });
  });

  /* ---------- 2. Brand "recently updated" pulse ---------- */

  const pulse = document.getElementById('brand-pulse');
  if (pulse && !prefersReducedMotion) {
    const hasVisited = (() => {
      try { return localStorage.getItem(STORAGE_VISIT) === '1'; }
      catch (_) { return false; }
    })();

    if (!hasVisited) {
      // Defer slightly so the indicator catches the eye after the page settles.
      setTimeout(() => pulse.classList.add('is-active'), 600);
      try { localStorage.setItem(STORAGE_VISIT, '1'); } catch (_) { /* no-op */ }
    } else {
      // Returning visitor: still show the dot once, but without the pulse.
      pulse.style.opacity = '0.55';
    }
  } else if (pulse) {
    pulse.style.opacity = '0.55';
  }

  /* ---------- 3. Contrast toggle ---------- */

  const contrastToggle = document.getElementById('contrast-toggle');
  if (contrastToggle) {
    const apply = (mode) => {
      if (mode === 'soft') {
        document.documentElement.setAttribute('data-contrast', 'soft');
        contrastToggle.setAttribute('aria-pressed', 'true');
        contrastToggle.textContent = 'restore the contrast';
      } else {
        document.documentElement.removeAttribute('data-contrast');
        contrastToggle.setAttribute('aria-pressed', 'false');
        contrastToggle.textContent = 'soften the contrast';
      }
    };

    let stored = null;
    try { stored = localStorage.getItem(STORAGE_CONTRAST); } catch (_) { /* no-op */ }
    if (stored === 'soft') apply('soft');

    contrastToggle.addEventListener('click', () => {
      const isSoft = document.documentElement.getAttribute('data-contrast') === 'soft';
      const next = isSoft ? 'default' : 'soft';
      apply(next);
      try { localStorage.setItem(STORAGE_CONTRAST, next); } catch (_) { /* no-op */ }
    });
  }
})();
