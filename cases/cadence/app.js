// Cadence — interactive demo logic.
// The centerpiece is the subject-line scorer + A/B variant generator.
// All scoring is deterministic from the input string — no network, no AI.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. Hero composer "ghost rewrite" typing ------------------- */
function initHeroComposer() {
  const target = document.getElementById('composer-rewrite');
  const cursor = document.getElementById('composer-cursor');
  if (!target) return;

  const rewrite = "Sara, three small things ship this week";
  if (reduceMotion) {
    target.textContent = rewrite;
    return;
  }

  let i = 0;
  const stepDelay = 38;
  const startDelay = 800;

  function tick() {
    if (i > rewrite.length) {
      // pause, then reset to feel alive
      setTimeout(() => {
        target.textContent = '';
        i = 0;
        setTimeout(tick, 400);
      }, 4200);
      return;
    }
    target.textContent = rewrite.slice(0, i);
    i++;
    setTimeout(tick, stepDelay + Math.random() * 35);
  }
  setTimeout(tick, startDelay);
}

/* ---------- 2. Subject-line scorer --------------------------------- */
// Each scorer returns a number in [0, 1].
// We weight them into a single predicted-open percentage.

const FILLER_WORDS = new Set([
  'a', 'an', 'the', 'of', 'to', 'in', 'for', 'on', 'with', 'is', 'are',
  'and', 'or', 'but', 'we', 'our', 'us', 'i', 'me', 'my'
]);

const CURIOSITY_HOOKS = [
  'how', 'why', 'what', 'who', 'when', 'where', 'secret', 'reveal',
  'finally', 'turns out', 'inside', 'behind', 'really', 'actually',
  'never', 'always', 'one thing', 'no one', '?'
];

const URGENCY_TOKENS = [
  'today', 'now', 'tonight', 'tomorrow', 'last', 'final', 'ends',
  'closing', 'closes', 'expires', 'expiring', '24 hours', '48 hours',
  'limited', 'hurry', "don't miss", 'almost gone'
];

const SPAM_TOKENS = [
  'free', '!!!', '$$$', '100% free', 'click here', 'buy now',
  'cheap', 'urgent', 'congratulations', 'winner', 'cash', 'guarantee',
  'no cost', 'risk-free', 'act now', 'unlimited'
];

function curiosityScore(raw) {
  const s = raw.toLowerCase();
  let hits = 0;
  for (const hook of CURIOSITY_HOOKS) {
    if (s.includes(hook)) hits++;
  }
  // implicit number-based curiosity: "3 reasons", "7 ways"
  if (/\b\d+\s+(reason|way|thing|step|lesson)/i.test(raw)) hits += 2;
  // ellipsis or em-dash is a tease
  if (/[.…]{2,}|—/.test(raw)) hits += 1;
  return Math.min(1, hits / 4);
}

function urgencyScore(raw) {
  const s = raw.toLowerCase();
  let hits = 0;
  for (const tok of URGENCY_TOKENS) {
    if (s.includes(tok)) hits++;
  }
  // time-bound phrases: "by Friday", "this week"
  if (/\b(by|this|next)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month)\b/i.test(raw)) {
    hits += 1;
  }
  return Math.min(1, hits / 3);
}

function clarityScore(raw) {
  const t = raw.trim();
  if (!t) return 0;
  const wordCount = t.split(/\s+/).length;
  const charCount = t.length;
  // Penalize ALL CAPS sections
  const upperRatio = (t.replace(/[^A-Z]/g, '').length) / Math.max(charCount, 1);
  // Average word length — words longer than 8 chars hurt clarity
  const avgWord = charCount / wordCount;
  let score = 1;
  if (upperRatio > 0.35) score -= 0.4;
  if (avgWord > 7.5) score -= 0.25;
  if (wordCount > 14) score -= 0.2;
  if (wordCount < 3) score -= 0.15;
  // Multiple punctuation marks lower clarity
  if (/[!?]{2,}/.test(t)) score -= 0.2;
  return Math.max(0, Math.min(1, score));
}

function lengthScore(raw) {
  const len = raw.trim().length;
  if (len === 0) return 0;
  // Ideal window: 32–58 characters. Outside → falls off.
  if (len >= 32 && len <= 58) return 1;
  if (len < 32) return Math.max(0, len / 32);
  // longer than 58 — falls off, harshly past ~85
  return Math.max(0, 1 - (len - 58) / 32);
}

function spamScore(raw) {
  const s = raw.toLowerCase();
  let hits = 0;
  for (const tok of SPAM_TOKENS) {
    if (s.includes(tok)) hits++;
  }
  // Excessive punctuation
  if (/!{2,}/.test(raw)) hits += 1;
  if (/\$/.test(raw) && /\d/.test(raw)) hits += 0.5;
  // ALL CAPS dominance
  const letters = raw.replace(/[^A-Za-z]/g, '');
  if (letters.length > 0) {
    const upperRatio = (raw.replace(/[^A-Z]/g, '').length) / letters.length;
    if (upperRatio > 0.5) hits += 1;
  }
  return Math.min(1, hits / 3);
}

function predictedOpen(scores) {
  // Baseline 18%, lifted by good dimensions, dropped by spam.
  const baseline = 18;
  const lift =
    scores.curiosity * 12 +
    scores.urgency * 6 +
    scores.clarity * 9 +
    scores.length * 8 -
    scores.spam * 14;
  const rate = baseline + lift;
  return Math.max(2.4, Math.min(62, rate));
}

/* ---------- 3. A/B variant generator -------------------------------- */
// Deterministic templates triggered by keyword detection in the input.
// We pick TWO different "strategies" and apply them.

function detectStrategies(raw) {
  const s = raw.toLowerCase();
  const strategies = [];

  if (/\b(discount|sale|off|deal|promo|coupon)\b/.test(s) || /\d+%/.test(s)) {
    strategies.push('discount');
  }
  if (/\b(you|your|youre|you're)\b/.test(s)) {
    strategies.push('personal');
  }
  if (/\b(cart|order|checkout|purchase|item)\b/.test(s)) {
    strategies.push('abandon');
  }
  if (/\b(feature|launch|release|new|update|announcing)\b/.test(s)) {
    strategies.push('launch');
  }
  if (/\b(today|tonight|hours|final|last|ends|closing)\b/.test(s)) {
    strategies.push('urgency');
  }
  if (/\b(how|why|what|guide|tips|tutorial)\b/.test(s)) {
    strategies.push('explainer');
  }
  if (/\?$/.test(raw.trim())) {
    strategies.push('question');
  }

  // Fallback: always have at least two strategies.
  while (strategies.length < 2) {
    for (const fb of ['curiosity', 'concise']) {
      if (!strategies.includes(fb)) strategies.push(fb);
      if (strategies.length >= 2) break;
    }
  }
  return strategies.slice(0, 2);
}

function shortenSubject(raw) {
  return raw.replace(/\b(a|an|the|of|that|which|just|really|very|so)\b/gi, '')
    .replace(/\s+/g, ' ').trim();
}

function applyStrategy(strategy, raw) {
  const stripped = raw.trim().replace(/\.$/, '');
  switch (strategy) {
    case 'discount': {
      const match = stripped.match(/(\d{1,3}\s*%|\$\d+)/);
      const amount = match ? match[0] : 'the offer';
      return `Quietly: ${amount}. Then it's gone.`;
    }
    case 'personal': {
      return `Wrote this one for you →`;
    }
    case 'abandon': {
      return `Still thinking about it?`;
    }
    case 'launch': {
      const concise = shortenSubject(stripped);
      return `What changed today: ${concise.toLowerCase()}`;
    }
    case 'urgency': {
      return `Closing the door in a few hours`;
    }
    case 'explainer': {
      return `The shortest version of ${stripped.toLowerCase()}`;
    }
    case 'question': {
      return stripped.replace(/\?$/, '') + ' (you might be surprised)';
    }
    case 'curiosity': {
      return `One small thing about your ${pickNoun(stripped)}`;
    }
    case 'concise': {
      const c = shortenSubject(stripped);
      const trimmed = c.length > 48 ? c.slice(0, 45) + '…' : c;
      return trimmed || 'Open me.';
    }
    default:
      return stripped;
  }
}

function pickNoun(raw) {
  const tokens = raw.toLowerCase().split(/\s+/).filter(Boolean);
  for (const t of tokens) {
    if (!FILLER_WORDS.has(t) && t.length >= 4) return t.replace(/[.,!?…]/g, '');
  }
  return 'list';
}

function strategyLabel(strategies) {
  const labels = {
    discount: 'Subtle scarcity, no shouting.',
    personal: 'Personalised — drops "you" in the cold open.',
    abandon: 'Gentle re-engagement for cart abandoners.',
    launch: 'Reframed as "what changed", not "we launched".',
    urgency: 'Time pressure without exclamation marks.',
    explainer: 'Position as the short answer to a real question.',
    question: 'Hook with a question, withhold the answer.',
    curiosity: 'Curiosity gap — concrete, low-key.',
    concise: 'Same idea, fewer words.'
  };
  return strategies.map(s => labels[s]).filter(Boolean).join(' · ');
}

/* ---------- 4. Wire it all up --------------------------------------- */
function initDemo() {
  const input = document.getElementById('subject-input');
  if (!input) return;

  const scoreNodes = {};
  document.querySelectorAll('.cd-score').forEach(li => {
    scoreNodes[li.dataset.key] = {
      bar: li.querySelector('.cd-score-fill'),
      val: li.querySelector('.cd-score-val'),
      inverse: li.querySelector('.cd-score-bar-inverse') !== null
    };
  });

  const predictionPill = document.getElementById('prediction-pill');
  const predictionVal = document.getElementById('prediction-val');
  const variantsList = document.getElementById('variants-list');
  const variantStrategy = document.getElementById('variants-strategy');

  function setBarsEmpty() {
    Object.values(scoreNodes).forEach(({ bar, val, inverse }) => {
      bar.style.width = inverse ? '0%' : '0%';
      val.textContent = '0';
    });
    predictionVal.textContent = '—';
    variantStrategy.textContent = 'Type to see suggestions.';
    variantsList.innerHTML = `
      <li class="cd-variant" data-empty>
        <span class="cd-variant-tag">A</span>
        <span class="cd-variant-text cd-variant-placeholder">Variant A will appear here…</span>
      </li>
      <li class="cd-variant" data-empty>
        <span class="cd-variant-tag">B</span>
        <span class="cd-variant-text cd-variant-placeholder">Variant B will appear here…</span>
      </li>
    `;
  }

  function renderScores(scores) {
    Object.entries(scores).forEach(([key, value]) => {
      const node = scoreNodes[key];
      if (!node) return;
      const pct = Math.round(value * 100);
      node.bar.style.width = pct + '%';
      node.val.textContent = pct;
    });
  }

  function renderPrediction(rate) {
    predictionVal.textContent = rate.toFixed(1) + '%';
    if (!reduceMotion) {
      predictionPill.classList.remove('cd-pulse');
      // re-trigger animation
      void predictionPill.offsetWidth;
      predictionPill.classList.add('cd-pulse');
    }
  }

  function renderVariants(raw) {
    const strategies = detectStrategies(raw);
    const variantA = applyStrategy(strategies[0], raw);
    const variantB = applyStrategy(strategies[1], raw);
    variantStrategy.textContent = strategyLabel(strategies);
    variantsList.innerHTML = `
      <li class="cd-variant">
        <span class="cd-variant-tag">A</span>
        <span class="cd-variant-text">${escapeHtml(variantA)}</span>
      </li>
      <li class="cd-variant">
        <span class="cd-variant-tag">B</span>
        <span class="cd-variant-text">${escapeHtml(variantB)}</span>
      </li>
    `;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function update() {
    const raw = input.value;
    if (!raw.trim()) {
      setBarsEmpty();
      return;
    }
    const scores = {
      curiosity: curiosityScore(raw),
      urgency: urgencyScore(raw),
      clarity: clarityScore(raw),
      length: lengthScore(raw),
      spam: spamScore(raw)
    };
    renderScores(scores);
    renderPrediction(predictedOpen(scores));
    renderVariants(raw);
  }

  // Debounce — but small, so it feels fast.
  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(update, 140);
  });

  // Try-chip buttons
  document.querySelectorAll('.cd-try-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.fill;
      input.focus();
      update();
    });
  });

  setBarsEmpty();
}

/* ---------- 5. CTA form ---------- */
function initCta() {
  const form = document.getElementById('cta-form');
  const mini = document.getElementById('cta-mini');
  const email = document.getElementById('cta-email');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = email.value.trim();
    if (!v || !v.includes('@') || !v.includes('.')) {
      mini.textContent = "That doesn't look like a work email — try again.";
      email.focus();
      return;
    }
    mini.textContent = `Thanks. We'd send a confirmation to ${v} — but this is a concept design.`;
    email.value = '';
  });
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeroComposer();
  initDemo();
  initCta();
});
