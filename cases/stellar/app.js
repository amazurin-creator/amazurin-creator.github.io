// Stellar — interactive bits, deliberately restrained.

// ─────────── Pitch textarea: live character count + "perfect length" note ───────────
const PERFECT_AT = 300;        // ~3 tight sentences
const PERFECT_WINDOW = 80;     // 300..380 reads as "perfect length"

const pitchEl = document.getElementById('sv-pitch');
const countEl = document.getElementById('sv-charcount');
const perfectEl = document.getElementById('sv-charperfect');

if (pitchEl && countEl && perfectEl) {
  const update = () => {
    const n = pitchEl.value.length;
    countEl.textContent = String(n).padStart(3, '0');
    countEl.classList.toggle('over', n > 500);

    if (n >= PERFECT_AT && n <= PERFECT_AT + PERFECT_WINDOW) {
      perfectEl.textContent = '— perfect length';
      perfectEl.classList.add('shown');
    } else if (n > PERFECT_AT + PERFECT_WINDOW) {
      perfectEl.textContent = '— a touch long';
      perfectEl.classList.add('shown');
    } else {
      perfectEl.classList.remove('shown');
    }
  };
  pitchEl.addEventListener('input', update);
  update();
}

// ─────────── Form: do not submit, give a quiet confirmation ───────────
const formEl = document.getElementById('sv-form');
const sendEl = document.getElementById('sv-send');

if (formEl && sendEl) {
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const original = sendEl.textContent;
    sendEl.classList.add('sent');
    sendEl.textContent = 'Received — we will write';
    sendEl.disabled = true;
    setTimeout(() => {
      sendEl.classList.remove('sent');
      sendEl.textContent = original;
      sendEl.disabled = false;
    }, 2400);
  });
}

// ─────────── Smooth-scroll for in-page anchors (progressive enhancement) ───────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', id);
  });
});

// ─────────── Section-in-view marker (gold square beside the active eyebrow) ───────────
const markerSections = [
  { id: 'portfolio', sel: '.sv-portfolio' },
  { id: 'letters', sel: '.sv-letters' },
  { id: 'decide', sel: '.sv-decide' },
  { id: 'pitch', sel: '.sv-pitch' },
  { id: 'about', sel: '.sv-about' },
];

const markers = new Map();
document.querySelectorAll('.sv-marker').forEach((el) => {
  const key = el.dataset.section;
  if (key) markers.set(key, el);
});

if ('IntersectionObserver' in window && markers.size) {
  const setActive = (key) => {
    markers.forEach((el, k) => el.classList.toggle('active', k === key));
  };

  const visibility = new Map();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const key = e.target.dataset.markerKey;
        if (key) visibility.set(key, e.intersectionRatio);
      }
      // Choose the most-visible section.
      let best = null;
      let bestRatio = 0;
      visibility.forEach((ratio, key) => {
        if (ratio > bestRatio) { bestRatio = ratio; best = key; }
      });
      setActive(bestRatio > 0.04 ? best : null);
    },
    { threshold: [0, 0.04, 0.2, 0.5, 0.85] }
  );

  for (const { id, sel } of markerSections) {
    const node = document.querySelector(sel);
    if (node) {
      node.dataset.markerKey = id;
      io.observe(node);
    }
  }
}
