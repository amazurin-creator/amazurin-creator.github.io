// Hero ghost-completion typing animation.
const typed = document.getElementById('hero-typed');
const ghost = document.getElementById('hero-ghost');

const HERO_SEQUENCE = [
  { delay: 600 },
  { text: 'queue.', el: typed, color: 'fg', delay: 80 },
  { text: 'push', el: typed, color: 'fn', delay: 80 },
  { text: '(', el: typed, color: 'fg', delay: 200 },
  { ghost: '...nextStates(state))', delay: 800 },
];

async function typeHero() {
  if (!typed) return;
  for (const step of HERO_SEQUENCE) {
    await new Promise((r) => setTimeout(r, step.delay));
    if (step.ghost) {
      ghost.textContent = step.ghost;
    } else if (step.text) {
      typed.insertAdjacentHTML('beforeend', step.color === 'fn'
        ? `<span class="fn">${step.text}</span>`
        : step.text);
    }
  }
}
typeHero();

// Demo: prompt switcher with simulated reasoning + code generation.
const PROMPTS = {
  parse: {
    filename: 'parseCsv.ts',
    reasoning: [
      'Read user prompt: "Parse a CSV"',
      'Looked at existing utilities in /lib — no parser present',
      'Considered Papa Parse — overkill for the scope',
      'Decided on a 6-line implementation with simple split',
      'Verified header row handling against fixture',
    ],
    code: [
      ['kw', 'export function '], ['fn', 'parseCsv'], ['fg', '(text: '], ['ty', 'string'], ['fg', '): '], ['ty', 'Record'], ['fg', '<'], ['ty', 'string'], ['fg', ', '], ['ty', 'string'], ['fg', '>[] {\n'],
      ['fg', '  '], ['kw', 'const'], ['fg', ' [head, ...rows] = text.'], ['fn', 'split'], ['fg', '('], ['str', "'\\n'"], ['fg', ').'], ['fn', 'filter'], ['fg', '(Boolean);\n'],
      ['fg', '  '], ['kw', 'const'], ['fg', ' cols = head.'], ['fn', 'split'], ['fg', '('], ['str', "','"], ['fg', ');\n'],
      ['fg', '  '], ['kw', 'return'], ['fg', ' rows.'], ['fn', 'map'], ['fg', '((r) => {\n'],
      ['fg', '    '], ['kw', 'const'], ['fg', ' vals = r.'], ['fn', 'split'], ['fg', '('], ['str', "','"], ['fg', ');\n'],
      ['fg', '    '], ['kw', 'return'], ['fg', ' '], ['ty', 'Object'], ['fg', '.'], ['fn', 'fromEntries'], ['fg', '(cols.'], ['fn', 'map'], ['fg', '((c, i) => [c, vals[i]]));\n'],
      ['fg', '  });\n'],
      ['fg', '}'],
    ],
  },
  debounce: {
    filename: 'debounce.ts',
    reasoning: [
      'Read user prompt: "Debounce a callback"',
      'Pattern is canonical — produce a typed implementation',
      'Used generics to preserve argument types',
      'Verified leading-edge variant not requested — skipping',
    ],
    code: [
      ['kw', 'export function '], ['fn', 'debounce'], ['fg', '<'], ['ty', 'T'], ['fg', ' '], ['kw', 'extends'], ['fg', ' (...args: '], ['ty', 'any'], ['fg', '[]) => '], ['ty', 'void'], ['fg', '>(\n'],
      ['fg', '  fn: '], ['ty', 'T'], ['fg', ',\n'],
      ['fg', '  ms: '], ['ty', 'number'], ['fg', '\n'],
      ['fg', '): '], ['ty', 'T'], ['fg', ' {\n'],
      ['fg', '  '], ['kw', 'let'], ['fg', ' h: '], ['ty', 'number'], ['fg', ' | '], ['ty', 'undefined'], ['fg', ';\n'],
      ['fg', '  '], ['kw', 'return'], ['fg', ' (((...args) => {\n'],
      ['fg', '    '], ['fn', 'clearTimeout'], ['fg', '(h);\n'],
      ['fg', '    h = '], ['fn', 'setTimeout'], ['fg', '(() => fn(...args), ms);\n'],
      ['fg', '  }) '], ['kw', 'as'], ['fg', ' '], ['ty', 'T'], ['fg', ');\n'],
      ['fg', '}'],
    ],
  },
  cache: {
    filename: 'memoize.ts',
    reasoning: [
      'Read user prompt: "Memoize a result"',
      'Saw three uses of identical pattern in /server/handlers',
      'Decided to extract a generic memoizer rather than inline',
      'Used Map for O(1) lookup, key derived from JSON.stringify',
    ],
    code: [
      ['kw', 'export function '], ['fn', 'memoize'], ['fg', '<'], ['ty', 'Args'], ['fg', ' '], ['kw', 'extends'], ['fg', ' '], ['ty', 'unknown'], ['fg', '[], '], ['ty', 'R'], ['fg', '>(\n'],
      ['fg', '  fn: (...args: '], ['ty', 'Args'], ['fg', ') => '], ['ty', 'R'], ['fg', '\n'],
      ['fg', '): (...args: '], ['ty', 'Args'], ['fg', ') => '], ['ty', 'R'], ['fg', ' {\n'],
      ['fg', '  '], ['kw', 'const'], ['fg', ' cache = '], ['kw', 'new'], ['fg', ' '], ['ty', 'Map'], ['fg', '<'], ['ty', 'string'], ['fg', ', '], ['ty', 'R'], ['fg', '>();\n'],
      ['fg', '  '], ['kw', 'return'], ['fg', ' (...args) => {\n'],
      ['fg', '    '], ['kw', 'const'], ['fg', ' k = '], ['ty', 'JSON'], ['fg', '.'], ['fn', 'stringify'], ['fg', '(args);\n'],
      ['fg', '    '], ['kw', 'if'], ['fg', ' (!cache.'], ['fn', 'has'], ['fg', '(k)) cache.'], ['fn', 'set'], ['fg', '(k, fn(...args));\n'],
      ['fg', '    '], ['kw', 'return'], ['fg', ' cache.'], ['fn', 'get'], ['fg', '(k)!;\n'],
      ['fg', '  };\n'],
      ['fg', '}'],
    ],
  },
};

const reasoningList = document.getElementById('reasoning-list');
const demoCode = document.getElementById('demo-code');
const demoFilename = document.getElementById('demo-filename');

function classFor(t) {
  return { kw: 'kw', fn: 'fn', ty: 'ty', str: 'str', num: 'num', com: 'com', ghost: 'ghost', fg: null }[t];
}

let renderToken = 0;
async function renderPrompt(key) {
  const myToken = ++renderToken;
  const p = PROMPTS[key];
  if (!p) return;
  demoFilename.textContent = p.filename;
  reasoningList.innerHTML = '';
  demoCode.innerHTML = '';

  for (let i = 0; i < p.reasoning.length; i++) {
    await new Promise((r) => setTimeout(r, 320));
    if (myToken !== renderToken) return;
    const li = document.createElement('li');
    li.textContent = p.reasoning[i];
    reasoningList.appendChild(li);
  }

  await new Promise((r) => setTimeout(r, 200));
  if (myToken !== renderToken) return;
  for (const [type, text] of p.code) {
    const cls = classFor(type);
    if (cls) {
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = text;
      demoCode.appendChild(span);
    } else {
      demoCode.appendChild(document.createTextNode(text));
    }
  }
}

document.querySelectorAll('.prompt-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.prompt-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderPrompt(btn.dataset.prompt);
  });
});

renderPrompt('parse');
