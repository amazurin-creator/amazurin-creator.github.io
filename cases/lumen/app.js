// Lumen — case 06.
// Studio: chip / prompt → curated set of 6 Picsum images slides in
// from the right with a brief shimmer, replacing the previous wall.
// Reading caption updates with the "AI's" interpretation.

// ─── Preset library ─────────────────────────────────────────────
// Each preset = 6 Picsum seeds (deterministic, varied moods),
// per-tile captions, and a single "reading" line written in
// art-director voice. Seeds are named so they're easy to swap.

const PRESETS = {
  brutalist: {
    label: 'Brutalist still life',
    placeholder: 'concrete plinth, soft fluorescence, one chosen object',
    reading: 'Lumen read your intent as: <em>weight, shadow, and the geometry of restraint</em>. 6 of 247 results, sorted by editorial fit.',
    images: [
      { seed: 'lumen-brut-01', alt: 'Concrete still life', cap: 'PLATE I · CONCRETE' },
      { seed: 'lumen-brut-02', alt: 'Steel and glass',     cap: 'PLATE II · STEEL' },
      { seed: 'lumen-brut-03', alt: 'Cast shadow study',   cap: 'PLATE III · SHADOW' },
      { seed: 'lumen-brut-04', alt: 'Block geometry',      cap: 'PLATE IV · GEOMETRY' },
      { seed: 'lumen-brut-05', alt: 'Single object',       cap: 'PLATE V · MASS' },
      { seed: 'lumen-brut-06', alt: 'Rough surface',       cap: 'PLATE VI · GRAIN' },
    ],
  },
  editorial: {
    label: 'Editorial portrait',
    placeholder: 'window light, soft jaw, a long unbroken gaze',
    reading: 'Lumen read your intent as: <em>portraiture in the magazine register — long light, considered distance, a refusal of grin</em>. 6 of 312 results, sorted by editorial fit.',
    images: [
      { seed: 'lumen-edit-01', alt: 'Portrait in profile', cap: 'PLATE I · PROFILE' },
      { seed: 'lumen-edit-02', alt: 'Studio gaze',         cap: 'PLATE II · GAZE' },
      { seed: 'lumen-edit-03', alt: 'Three-quarter',       cap: 'PLATE III · TURN' },
      { seed: 'lumen-edit-04', alt: 'Window light',        cap: 'PLATE IV · LIGHT' },
      { seed: 'lumen-edit-05', alt: 'Close detail',        cap: 'PLATE V · DETAIL' },
      { seed: 'lumen-edit-06', alt: 'Full figure',         cap: 'PLATE VI · FIGURE' },
    ],
  },
  cinematic: {
    label: 'Cinematic landscape',
    placeholder: 'wide horizon, late hour, the colour of a thought',
    reading: 'Lumen read your intent as: <em>landscape in the Malick register — wide horizon, low sun, the slow turn of a held breath</em>. 6 of 188 results, sorted by editorial fit.',
    images: [
      { seed: 'lumen-cine-01', alt: 'Wide horizon',        cap: 'PLATE I · HORIZON' },
      { seed: 'lumen-cine-02', alt: 'Low sun field',       cap: 'PLATE II · FIELD' },
      { seed: 'lumen-cine-03', alt: 'Coastal long shot',   cap: 'PLATE III · COAST' },
      { seed: 'lumen-cine-04', alt: 'Mountain mass',       cap: 'PLATE IV · MASS' },
      { seed: 'lumen-cine-05', alt: 'Storm light',         cap: 'PLATE V · STORM' },
      { seed: 'lumen-cine-06', alt: 'Road and sky',        cap: 'PLATE VI · ROAD' },
    ],
  },
  surreal: {
    label: 'Surreal minimal',
    placeholder: 'an impossible object, photographed plainly',
    reading: 'Lumen read your intent as: <em>impossibility presented as fact — flat light, neutral ground, no apology for the trick</em>. 6 of 142 results, sorted by editorial fit.',
    images: [
      { seed: 'lumen-surr-01', alt: 'Impossible object',   cap: 'PLATE I · OBJECT' },
      { seed: 'lumen-surr-02', alt: 'Flat plane',          cap: 'PLATE II · PLANE' },
      { seed: 'lumen-surr-03', alt: 'Neutral ground',      cap: 'PLATE III · GROUND' },
      { seed: 'lumen-surr-04', alt: 'Single trick',        cap: 'PLATE IV · TRICK' },
      { seed: 'lumen-surr-05', alt: 'Quiet absurd',        cap: 'PLATE V · ABSURD' },
      { seed: 'lumen-surr-06', alt: 'Plain anomaly',       cap: 'PLATE VI · ANOMALY' },
    ],
  },
  fashion: {
    label: 'Studio fashion',
    placeholder: 'one wall, two lights, the fabric doing the talking',
    reading: 'Lumen read your intent as: <em>studio fashion in the Vogue Italia register — single wall, two strobes, fabric as protagonist</em>. 6 of 401 results, sorted by editorial fit.',
    images: [
      { seed: 'lumen-fash-01', alt: 'Studio figure',       cap: 'PLATE I · FIGURE' },
      { seed: 'lumen-fash-02', alt: 'Fabric study',        cap: 'PLATE II · FABRIC' },
      { seed: 'lumen-fash-03', alt: 'Strobe wall',         cap: 'PLATE III · STROBE' },
      { seed: 'lumen-fash-04', alt: 'Long line',           cap: 'PLATE IV · LINE' },
      { seed: 'lumen-fash-05', alt: 'Colour block',        cap: 'PLATE V · BLOCK' },
      { seed: 'lumen-fash-06', alt: 'Posture',             cap: 'PLATE VI · POSTURE' },
    ],
  },
  botanical: {
    label: 'Botanical study',
    placeholder: 'a leaf, against paper, in the manner of a print',
    reading: 'Lumen read your intent as: <em>botanical in the Karl Blossfeldt register — single specimen, even ground, exacting attention</em>. 6 of 209 results, sorted by editorial fit.',
    images: [
      { seed: 'lumen-bot-01',  alt: 'Single leaf',         cap: 'PLATE I · LEAF' },
      { seed: 'lumen-bot-02',  alt: 'Stem study',          cap: 'PLATE II · STEM' },
      { seed: 'lumen-bot-03',  alt: 'Bloom detail',        cap: 'PLATE III · BLOOM' },
      { seed: 'lumen-bot-04',  alt: 'Seed pod',            cap: 'PLATE IV · POD' },
      { seed: 'lumen-bot-05',  alt: 'Frond and shadow',    cap: 'PLATE V · FROND' },
      { seed: 'lumen-bot-06',  alt: 'Pressed botanical',   cap: 'PLATE VI · PRESS' },
    ],
  },
};

// Free-typed prompt → a "custom" preset with novel reading line.
// We pick a fresh set of seeds derived from the prompt text so the
// gallery feels responsive rather than parroting a fixed set.

function buildCustomPreset(prompt) {
  // Hash the prompt into a short alphanumeric token used as seed root.
  const token = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24) || 'lumen-custom';

  const reading = composeReading(prompt);
  const images = Array.from({ length: 6 }, (_, i) => ({
    seed: `lumen-prompt-${token}-${i + 1}`,
    alt:  `Custom plate ${i + 1}`,
    cap:  `PLATE ${toRoman(i + 1)} · ${capWordFromPrompt(prompt, i)}`,
  }));

  return { label: 'Custom prompt', images, reading };
}

// "Reading" composition — turn the user prompt into editorial paraphrase.
function composeReading(prompt) {
  const trimmed = prompt.trim().toLowerCase();
  const words = trimmed.split(/[\s,]+/).filter(Boolean);

  // Pick three salient words to echo back.
  const echoes = [];
  for (const w of words) {
    if (w.length < 4) continue;
    if (echoes.includes(w)) continue;
    echoes.push(w);
    if (echoes.length === 3) break;
  }
  while (echoes.length < 3) echoes.push(['considered', 'restrained', 'particular'][echoes.length] || 'considered');

  const total = 120 + Math.floor((trimmed.length * 11) % 300);
  return `Lumen read your intent as: <em>${echoes[0]}, ${echoes[1]}, and the discipline of ${echoes[2]}</em>. 6 of ${total} results, sorted by editorial fit.`;
}

function capWordFromPrompt(prompt, i) {
  const words = prompt.trim().toLowerCase().split(/[\s,]+/).filter(w => w.length > 2);
  const pool = ['LIGHT', 'FORM', 'WEIGHT', 'COLOUR', 'EDGE', 'MOOD', 'GRAIN', 'POSE'];
  if (words.length === 0) return pool[i % pool.length];
  return (words[i % words.length] || pool[i % pool.length]).toUpperCase().slice(0, 12);
}

function toRoman(n) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI'][n - 1] || String(n);
}

// ─── Render ─────────────────────────────────────────────────────

const galleryEl  = document.getElementById('lm-gallery');
const shimmerEl  = document.getElementById('lm-shimmer');
const readingEl  = document.getElementById('lm-reading');
const promptEl   = document.getElementById('lm-prompt');
const inputEl    = document.getElementById('lm-prompt-input');
const chipsEls   = document.querySelectorAll('.lm-chip');

function renderGallery(preset) {
  // Trigger shimmer + slide-in. We re-create children so each load
  // restarts the entrance animations.
  shimmerEl.classList.remove('run');
  // Reflow to allow the animation to replay cleanly.
  void shimmerEl.offsetWidth;
  shimmerEl.classList.add('run');

  galleryEl.innerHTML = '';
  preset.images.forEach((img, i) => {
    const fig = document.createElement('figure');
    fig.className = `lm-tile t-${i + 1}`;
    fig.innerHTML = `
      <img src="https://picsum.photos/seed/${img.seed}/900/1100" alt="${escapeAttr(img.alt)}" loading="lazy">
      <span class="lm-tile-caption">${img.cap}</span>
    `;
    galleryEl.appendChild(fig);
  });

  readingEl.innerHTML = preset.reading;
}

function escapeAttr(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

// ─── Chip wiring ────────────────────────────────────────────────

chipsEls.forEach(chip => {
  chip.addEventListener('click', () => {
    chipsEls.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const key = chip.dataset.preset;
    const preset = PRESETS[key];
    if (preset) {
      inputEl.value = '';
      inputEl.placeholder = preset.placeholder;
      renderGallery(preset);
    }
  });
});

// ─── Prompt submission ──────────────────────────────────────────

promptEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = inputEl.value.trim();
  if (!value) {
    // Pulse the input subtly if empty.
    inputEl.classList.add('cycling');
    setTimeout(() => inputEl.classList.remove('cycling'), 320);
    return;
  }
  // Treat free text as a custom preset.
  chipsEls.forEach(c => c.classList.remove('active'));
  const preset = buildCustomPreset(value);
  renderGallery(preset);
});

// ─── Rotating placeholder (editorial cycle) ─────────────────────

const PLACEHOLDERS = [
  'soft window light, late afternoon, melancholic',
  'concrete plinth, single ceramic, fluorescence',
  'long hallway, no occupant, blue hour',
  'fabric pulled taut, single strobe, neutral wall',
  'leaf on cream paper, in the manner of a print',
  'wide horizon, low sun, the colour of a thought',
];
let phIdx = 0;
function cyclePlaceholder() {
  if (document.activeElement === inputEl) return;       // do not interrupt typing
  if (inputEl.value)                       return;
  inputEl.classList.add('cycling');
  setTimeout(() => {
    phIdx = (phIdx + 1) % PLACEHOLDERS.length;
    inputEl.placeholder = PLACEHOLDERS[phIdx];
    inputEl.classList.remove('cycling');
  }, 340);
}
const phTimer = setInterval(cyclePlaceholder, 3600);
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  clearInterval(phTimer);
}

// ─── First paint ────────────────────────────────────────────────

renderGallery(PRESETS.brutalist);
