// Smooth scroll for in-page anchors.
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Language toggle — RU / EN, persisted in localStorage, drives html[lang].
const LANG_KEY = 'portfolio-lang';
const HINT_KEY = 'portfolio-lang-hint-seen';

function detectInitialLang() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === 'ru' || stored === 'en') return stored;
  const browser = (navigator.language || 'en').toLowerCase();
  return browser.startsWith('ru') ? 'ru' : 'en';
}

function setLang(lang) {
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem(LANG_KEY, lang);
  document.querySelectorAll('.lang-toggle button').forEach((b) => {
    b.classList.toggle('is-on', b.dataset.setLang === lang);
  });
}

setLang(detectInitialLang());

document.querySelectorAll('.lang-toggle button').forEach((btn) => {
  btn.addEventListener('click', () => {
    setLang(btn.dataset.setLang);
    localStorage.setItem(HINT_KEY, '1');
    document.querySelectorAll('.lang-toggle').forEach((t) => t.classList.remove('lang-hint'));
  });
});

// Pulse hint on first visit so the toggle gets noticed.
if (!localStorage.getItem(HINT_KEY)) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('.lang-toggle').forEach((t) => t.classList.add('lang-hint'));
      setTimeout(() => {
        document.querySelectorAll('.lang-toggle').forEach((t) => t.classList.remove('lang-hint'));
        localStorage.setItem(HINT_KEY, '1');
      }, 4000);
    }, 700);
  });
}
