# AI Portfolio Stage 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Stage 1 of the AI Portfolio: a working hub at `amazurin-creator.github.io` with 3 flagship case studies (Tradesight, Codex IDE, Hivemind) and 7 "Coming soon" placeholder cards.

**Architecture:** Pure static HTML/CSS/JS, no build step. Each case is a fully self-contained mini-site under `/cases/<slug>/`. A small shared library (`/shared/notes-panel.{css,js}`) provides the "Designer Notes" slide-out panel used by every case. Hub uses an editorial off-white aesthetic to frame ten different design worlds.

**Tech Stack:** HTML5, modern CSS (custom properties, flex/grid, container queries where useful), vanilla JS (ES modules where appropriate). Google Fonts CDN for typography. Tailwind NOT used in Stage 1 — every case gets bespoke CSS so the visual differentiation is genuine.

**Verification approach:** This is a static portfolio site with no business logic to unit-test. Each task ends with **browser-based visual verification**: open the page, scroll through, interact with the demo, confirm the result matches the spec's description. Lighthouse audit at the end of Stage 1.

---

## File Structure

```
amazurin-creator.github.io/
├── README.md
├── .gitignore
├── index.html                       # Hub
├── styles.css                       # Hub styles
├── app.js                           # Hub interactions (small)
├── assets/
│   └── favicon.svg
├── shared/
│   ├── notes-panel.css              # Designer Notes side panel styles
│   └── notes-panel.js               # Designer Notes init helper
└── cases/
    ├── tradesight/
    │   ├── index.html
    │   ├── styles.css
    │   └── app.js
    ├── codex-ide/
    │   ├── index.html
    │   ├── styles.css
    │   └── app.js
    └── hivemind/
        ├── index.html
        ├── styles.css
        └── app.js
```

**Why this structure:**
- Each case is **physically isolated** under its own folder with its own `styles.css` — no risk of CSS leakage between cases with radically different aesthetics.
- `/shared/notes-panel.*` exists because the Designer Notes panel is a structural element common to every case, and duplicating ~80 lines of CSS/JS per case would invite drift.
- Hub assets at root mirror how GitHub Pages serves them — `amazurin-creator.github.io/index.html`, `amazurin-creator.github.io/cases/tradesight/`.
- No `package.json`. No build. Pure static. Push = deploy.

---

## Task 1: Repo Skeleton & README

**Files:**
- Create: `README.md`
- Create: `.gitignore`
- Create: `assets/favicon.svg`

- [ ] **Step 1: Write README.md**

````markdown
# Artemey Mazurin — AI Portfolio

Personal portfolio at https://amazurin-creator.github.io showcasing ten distinctive web designs for AI products across different verticals.

## Structure

- `/` — Hub landing page
- `/cases/<slug>/` — Each case study as a fully self-contained mini-site
- `/shared/` — Cross-case shared components (Designer Notes panel)
- `/docs/superpowers/specs/` — Design spec
- `/docs/superpowers/plans/` — Implementation plans

## Local development

```bash
# Any static server works. Python's built-in is enough:
python3 -m http.server 8000
# Open http://localhost:8000
```

## Deploy

Push to `main`. GitHub Pages serves the repo at `amazurin-creator.github.io` automatically.

## Status

Stage 1: Hub + Tradesight, Codex IDE, Hivemind (in progress).
````

- [ ] **Step 2: Write .gitignore**

```
.DS_Store
node_modules/
.vscode/
.idea/
*.log
```

- [ ] **Step 3: Write assets/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0E0E0C"/>
  <text x="32" y="44" font-family="Georgia, serif" font-size="36" font-style="italic" font-weight="500" fill="#D4F26C" text-anchor="middle">a</text>
</svg>
```

- [ ] **Step 4: Commit**

```bash
git add README.md .gitignore assets/favicon.svg
git commit -m "chore: repo skeleton, readme, favicon"
```

---

## Task 2: Shared Designer Notes Panel

**Files:**
- Create: `shared/notes-panel.css`
- Create: `shared/notes-panel.js`

This component is the floating "i" button in the corner of every case page that opens a side panel with the designer's commentary on that case. Each case page provides its own content via `<template id="designer-notes">`; the shared script wires up the toggle and panel scaffolding.

- [ ] **Step 1: Write shared/notes-panel.css**

```css
/* Designer Notes — shared across all cases.
   Each case page provides content via <template id="designer-notes">.
   The trigger button uses neutral styling; cases can override the
   --notes-accent custom property to tint it to their palette. */

.notes-trigger {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--notes-accent, #111);
  color: var(--notes-accent-fg, #fff);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 22px;
  font-style: italic;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.notes-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.notes-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(420px, 100vw);
  background: #FAFAF7;
  color: #111;
  z-index: 110;
  box-shadow: -16px 0 48px rgba(0, 0, 0, 0.18);
  transform: translateX(100%);
  transition: transform 320ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  padding: 32px 28px 64px;
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.55;
}

.notes-panel.open { transform: translateX(0); }

.notes-panel h2 {
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 500;
  font-size: 28px;
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}

.notes-panel .notes-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 11px;
  color: #888;
  margin-bottom: 24px;
}

.notes-panel h3 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #888;
  margin: 24px 0 8px;
  font-weight: 600;
}

.notes-panel p, .notes-panel li {
  font-size: 15px;
  color: #2A2A28;
}

.notes-panel ul { padding-left: 18px; }
.notes-panel li { margin-bottom: 6px; }

.notes-panel a.notes-back {
  display: inline-block;
  margin-top: 32px;
  padding: 10px 18px;
  border: 1px solid #111;
  border-radius: 999px;
  color: #111;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
}

.notes-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: #111;
}

.notes-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 16, 0.45);
  z-index: 105;
  opacity: 0;
  pointer-events: none;
  transition: opacity 220ms ease;
}
.notes-backdrop.open { opacity: 1; pointer-events: auto; }

@media (prefers-reduced-motion: reduce) {
  .notes-panel, .notes-backdrop, .notes-trigger {
    transition: none;
  }
}
```

- [ ] **Step 2: Write shared/notes-panel.js**

```js
// Designer Notes — shared init.
// Pages embed: <template id="designer-notes">…</template>
// then call initNotesPanel(). The template content is cloned into the panel.

export function initNotesPanel() {
  const template = document.getElementById('designer-notes');
  if (!template) return;

  const trigger = document.createElement('button');
  trigger.className = 'notes-trigger';
  trigger.setAttribute('aria-label', 'Open designer notes');
  trigger.textContent = 'i';

  const backdrop = document.createElement('div');
  backdrop.className = 'notes-backdrop';

  const panel = document.createElement('aside');
  panel.className = 'notes-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Designer notes');

  const close = document.createElement('button');
  close.className = 'notes-close';
  close.setAttribute('aria-label', 'Close designer notes');
  close.innerHTML = '&times;';
  panel.appendChild(close);

  panel.appendChild(template.content.cloneNode(true));

  document.body.append(trigger, backdrop, panel);

  function open() {
    panel.classList.add('open');
    backdrop.classList.add('open');
  }
  function shut() {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
  }
  trigger.addEventListener('click', open);
  close.addEventListener('click', shut);
  backdrop.addEventListener('click', shut);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') shut(); });
}
```

- [ ] **Step 3: Browser verify (smoke test)**

We can't fully verify this until a case page uses it. The component is correct if it loads without console errors. Verification deferred to Task 4.

- [ ] **Step 4: Commit**

```bash
git add shared/
git commit -m "feat: shared designer notes panel"
```

---

## Task 3: Hub (index.html + styles.css + app.js)

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`

The hub uses an editorial aesthetic: off-white background, large serif headline (Newsreader italic for emphasis), Inter for body, chartreuse `#D4F26C` accent. The showcase grid has 10 cards — 3 live, 7 marked "Coming soon".

- [ ] **Step 1: Write index.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Artemey Mazurin — designer of AI products</title>
  <meta name="description" content="Ten interfaces for ten futures. A portfolio of distinctive web designs for AI products by Artemey Mazurin.">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header class="site-header">
    <div class="brand">am.</div>
    <nav class="site-nav">
      <a href="#showcase">Work</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <p class="hero-eyebrow">Portfolio · 2026</p>
      <h1 class="hero-title">
        Artemey Mazurin — <em>designer</em> of AI products.
      </h1>
      <p class="hero-sub">
        Ten interfaces for ten futures. Each one a study in how AI products should feel for the people who use them.
      </p>
      <div class="hero-meta">
        <span>10 case studies</span><span>·</span><span>Built 2026</span>
      </div>
    </section>

    <section class="showcase" id="showcase">
      <header class="section-header">
        <p class="section-eyebrow">Selected work</p>
        <h2 class="section-title">Ten worlds.</h2>
      </header>

      <div class="showcase-grid">
        <!-- Live cases (Stage 1) -->
        <a class="case-card live" href="/cases/tradesight/" data-theme="tradesight">
          <div class="card-preview preview-tradesight">
            <span class="ticker">AAPL</span><span class="ticker green">+2.31</span>
            <span class="ticker">NVDA</span><span class="ticker red">−0.42</span>
            <span class="ticker">BTC</span><span class="ticker green">+5.18</span>
          </div>
          <div class="card-meta">
            <span class="card-num">02</span>
            <span class="card-niche">Trading · Finance</span>
          </div>
          <h3 class="card-title">Tradesight</h3>
          <p class="card-line">A Bloomberg terminal for the AI era.</p>
          <span class="card-cta">Open case →</span>
        </a>

        <a class="case-card live" href="/cases/codex-ide/" data-theme="codex">
          <div class="card-preview preview-codex">
            <code><span class="kw">function</span> <span class="fn">solve</span>() {</code>
            <code class="ghost">  return ai.suggest()</code>
            <code>}</code>
          </div>
          <div class="card-meta">
            <span class="card-num">04</span>
            <span class="card-niche">Developer tools</span>
          </div>
          <h3 class="card-title">Codex IDE</h3>
          <p class="card-line">An IDE that thinks alongside you.</p>
          <span class="card-cta">Open case →</span>
        </a>

        <a class="case-card live" href="/cases/hivemind/" data-theme="hivemind">
          <div class="card-preview preview-hivemind">
            <svg viewBox="0 0 100 60" aria-hidden="true">
              <line x1="20" y1="20" x2="50" y2="30" stroke="currentColor" stroke-width="0.5"/>
              <line x1="50" y1="30" x2="80" y2="20" stroke="currentColor" stroke-width="0.5"/>
              <line x1="50" y1="30" x2="80" y2="45" stroke="currentColor" stroke-width="0.5"/>
              <circle cx="20" cy="20" r="3" fill="currentColor"/>
              <circle cx="50" cy="30" r="4" fill="currentColor"/>
              <circle cx="80" cy="20" r="3" fill="currentColor"/>
              <circle cx="80" cy="45" r="3" fill="currentColor"/>
            </svg>
          </div>
          <div class="card-meta">
            <span class="card-num">09</span>
            <span class="card-niche">Agent infrastructure</span>
          </div>
          <h3 class="card-title">Hivemind</h3>
          <p class="card-line">Orchestrating swarms of AI agents.</p>
          <span class="card-cta">Open case →</span>
        </a>

        <!-- Coming soon placeholders -->
        <div class="case-card placeholder">
          <div class="card-meta">
            <span class="card-num">01</span>
            <span class="card-niche">Legal · Immigration</span>
          </div>
          <h3 class="card-title">LexCounsel</h3>
          <p class="card-line">A measured AI counsel for immigration.</p>
          <span class="card-cta dim">Coming soon</span>
        </div>

        <div class="case-card placeholder">
          <div class="card-meta">
            <span class="card-num">03</span>
            <span class="card-niche">Healthcare</span>
          </div>
          <h3 class="card-title">Clarity Health</h3>
          <p class="card-line">Understand your symptoms. Without panic.</p>
          <span class="card-cta dim">Coming soon</span>
        </div>

        <div class="case-card placeholder">
          <div class="card-meta">
            <span class="card-num">05</span>
            <span class="card-niche">Audio · Voice</span>
          </div>
          <h3 class="card-title">Wavelet</h3>
          <p class="card-line">Sound, rewritten by AI.</p>
          <span class="card-cta dim">Coming soon</span>
        </div>

        <div class="case-card placeholder">
          <div class="card-meta">
            <span class="card-num">06</span>
            <span class="card-niche">Generative imagery</span>
          </div>
          <h3 class="card-title">Lumen</h3>
          <p class="card-line">An AI image studio curated like a gallery.</p>
          <span class="card-cta dim">Coming soon</span>
        </div>

        <div class="case-card placeholder">
          <div class="card-meta">
            <span class="card-num">07</span>
            <span class="card-niche">Education</span>
          </div>
          <h3 class="card-title">Quill Tutor</h3>
          <p class="card-line">Learning at your own rhythm.</p>
          <span class="card-cta dim">Coming soon</span>
        </div>

        <div class="case-card placeholder">
          <div class="card-meta">
            <span class="card-num">08</span>
            <span class="card-niche">Research · Academia</span>
          </div>
          <h3 class="card-title">Atrium Research</h3>
          <p class="card-line">A reading room for AI-augmented research.</p>
          <span class="card-cta dim">Coming soon</span>
        </div>

        <div class="case-card placeholder">
          <div class="card-meta">
            <span class="card-num">10</span>
            <span class="card-niche">Marketing · Content</span>
          </div>
          <h3 class="card-title">Avatara</h3>
          <p class="card-line">Virtual creators for your brand.</p>
          <span class="card-cta dim">Coming soon</span>
        </div>
      </div>
    </section>

    <section class="about" id="about">
      <header class="section-header">
        <p class="section-eyebrow">About</p>
        <h2 class="section-title">Designing AI products that look like they belong in 2026.</h2>
      </header>
      <div class="about-body">
        <p>
          I'm Artemey, a designer and product engineer focused on AI. I build interfaces that take AI seriously as a new material — not as a chatbot wrapped around an old SaaS shell.
        </p>
        <p>
          The work here is a survey: ten verticals, ten visual systems. The point isn't that one is right and the others are wrong. The point is that an AI legal counsel should not look like an AI image generator should not look like an AI trading terminal. The aesthetics carry meaning. The visual system is part of how trust is built.
        </p>
        <p>
          Available for product design, design systems, and selective brand work. Based in Cyprus.
        </p>
      </div>
    </section>

    <section class="contact" id="contact">
      <header class="section-header">
        <p class="section-eyebrow">Contact</p>
        <h2 class="section-title">Let's talk.</h2>
      </header>
      <ul class="contact-list">
        <li><a href="mailto:a.mazurin@awio.app">a.mazurin@awio.app</a></li>
        <li><a href="https://github.com/amazurin-creator" target="_blank" rel="noopener">github.com/amazurin-creator</a></li>
      </ul>
    </section>
  </main>

  <footer class="site-footer">
    <span>© 2026 Artemey Mazurin</span>
    <span>Built without a framework. Deployed on push.</span>
  </footer>

  <script type="module" src="/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write styles.css**

```css
:root {
  --bg: #FAFAF7;
  --fg: #0E0E0C;
  --muted: #6B6B66;
  --rule: #E5E2D8;
  --accent: #D4F26C;
  --serif: 'Newsreader', Georgia, serif;
  --sans: 'Inter', system-ui, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }

/* Layout */
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 48px;
  border-bottom: 1px solid var(--rule);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 50;
}

.brand {
  font-family: var(--serif);
  font-style: italic;
  font-size: 24px;
  font-weight: 500;
}

.site-nav { display: flex; gap: 32px; }
.site-nav a {
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  transition: color 200ms ease;
}
.site-nav a:hover { color: var(--fg); }

main { padding: 0 48px; max-width: 1400px; margin: 0 auto; }

/* Hero */
.hero {
  padding: 120px 0 80px;
  border-bottom: 1px solid var(--rule);
}
.hero-eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
  margin-bottom: 32px;
}
.hero-title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(48px, 7vw, 96px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  max-width: 16ch;
  margin-bottom: 32px;
}
.hero-title em {
  font-style: italic;
  font-weight: 500;
}
.hero-sub {
  font-family: var(--serif);
  font-size: clamp(18px, 2vw, 24px);
  line-height: 1.4;
  color: #2A2A26;
  max-width: 48ch;
  margin-bottom: 48px;
}
.hero-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--muted);
}

/* Section header */
.section-header {
  padding: 96px 0 48px;
}
.section-eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
  margin-bottom: 16px;
}
.section-title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(36px, 5vw, 64px);
  letter-spacing: -0.02em;
  max-width: 18ch;
}

/* Showcase grid */
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1px;
  background: var(--rule);
  border: 1px solid var(--rule);
}
.case-card {
  background: var(--bg);
  padding: 32px 28px 28px;
  display: flex;
  flex-direction: column;
  min-height: 360px;
  transition: background 200ms ease;
  position: relative;
}
.case-card.live { cursor: pointer; }
.case-card.live:hover { background: #F2EFE3; }
.case-card.placeholder { opacity: 0.55; }

.card-preview {
  height: 80px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  border: 1px dashed var(--rule);
  border-radius: 6px;
  overflow: hidden;
  padding: 8px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  gap: 6px;
  flex-wrap: wrap;
}

.preview-tradesight { background: #0B0B0B; color: #FFB627; border-color: #1c1c1c; }
.preview-tradesight .ticker { color: #FFB627; }
.preview-tradesight .ticker.green { color: #39FF14; }
.preview-tradesight .ticker.red { color: #FF4D4D; }

.preview-codex { background: #0D1117; color: #7DD3FC; border-color: #1c2128; flex-direction: column; align-items: stretch; gap: 2px; padding: 10px 14px; }
.preview-codex code { display: block; color: #c9d1d9; }
.preview-codex .kw { color: #ff7b72; }
.preview-codex .fn { color: #d2a8ff; }
.preview-codex .ghost { color: #6e7681; font-style: italic; }

.preview-hivemind { background: #0F0F23; color: #7DF9FF; align-items: center; justify-content: center; border-color: #1c1c3a; }
.preview-hivemind svg { width: 80%; height: 100%; }

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 12px;
}
.card-num { font-family: var(--serif); font-style: italic; font-size: 14px; letter-spacing: 0; }
.card-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 28px;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}
.card-line {
  font-size: 14px;
  color: #38382F;
  line-height: 1.45;
  margin-bottom: auto;
  padding-bottom: 24px;
}
.card-cta {
  font-size: 13px;
  font-weight: 500;
  color: var(--fg);
}
.case-card.live:hover .card-cta { color: #5D6F1F; }
.card-cta.dim { color: var(--muted); font-style: italic; }

/* About */
.about-body { max-width: 60ch; padding-bottom: 32px; }
.about-body p { margin-bottom: 20px; color: #2A2A26; font-size: 17px; }

/* Contact */
.contact-list { list-style: none; padding-bottom: 80px; }
.contact-list li {
  font-family: var(--serif);
  font-size: clamp(24px, 3vw, 36px);
  border-bottom: 1px solid var(--rule);
  padding: 20px 0;
}
.contact-list a { display: block; transition: padding-left 200ms ease; }
.contact-list a:hover { padding-left: 12px; }

/* Footer */
.site-footer {
  display: flex;
  justify-content: space-between;
  padding: 32px 48px;
  border-top: 1px solid var(--rule);
  font-size: 12px;
  color: var(--muted);
}

@media (max-width: 720px) {
  main { padding: 0 24px; }
  .site-header { padding: 20px 24px; }
  .site-footer { padding: 24px; flex-direction: column; gap: 8px; }
  .hero { padding: 64px 0 48px; }
  .section-header { padding: 64px 0 32px; }
}
```

- [ ] **Step 3: Write app.js**

```js
// Smooth scroll for in-page anchors.
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
```

- [ ] **Step 4: Browser verify**

```bash
cd ~/personal/amazurin-creator.github.io && python3 -m http.server 8000
```

Open `http://localhost:8000/`. Confirm:
- Hero displays "Artemey Mazurin — _designer_ of AI products." with italic "designer" rendered in serif italic.
- Showcase grid shows 10 cards: 3 live (Tradesight/Codex/Hivemind) with their preview blocks visible, 7 dimmed placeholders.
- Hovering a live card subtly tints it.
- Cards' "Open case →" CTAs link to `/cases/tradesight/` etc. (404 expected at this point — those pages don't exist yet).
- About and Contact sections render.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css app.js
git commit -m "feat: hub landing page with 10-card showcase grid"
```

---

## Task 4: Case — Tradesight (Bloomberg terminal aesthetic)

**Files:**
- Create: `cases/tradesight/index.html`
- Create: `cases/tradesight/styles.css`
- Create: `cases/tradesight/app.js`

Pure black background, JetBrains Mono throughout, glowing amber `#FFB627` and electric green `#39FF14` for gains, red `#FF4D4D` for losses. A live-feeling ticker that updates via JS interval. A sparkline animates on hero load.

- [ ] **Step 1: Write cases/tradesight/index.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tradesight — AI trading co-pilot</title>
  <meta name="description" content="A Bloomberg terminal for the AI era. Real-time signals, autonomous reasoning, edge you can feel.">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;1,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/shared/notes-panel.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="ts-header">
    <a class="ts-brand" href="/">
      <span class="dot"></span> TRADESIGHT
    </a>
    <div class="ts-ticker" id="ticker"></div>
    <nav class="ts-nav">
      <a href="#features">Features</a>
      <a href="#demo">Demo</a>
      <a href="/">← Portfolio</a>
    </nav>
  </header>

  <main>
    <section class="ts-hero">
      <p class="eyebrow">SIGNAL · CONVICTION · EDGE</p>
      <h1>An edge you can <span class="hl">feel</span>.</h1>
      <p class="sub">Tradesight watches every tape, reads every filing, and surfaces the trades worth your attention. A Bloomberg terminal for the AI era.</p>
      <div class="ts-stats">
        <div><span class="num" id="stat-edge">+2.3σ</span><span class="lbl">avg edge over benchmark</span></div>
        <div><span class="num" id="stat-trades">847</span><span class="lbl">signals this quarter</span></div>
        <div><span class="num" id="stat-uptime">99.97%</span><span class="lbl">uptime since launch</span></div>
      </div>
    </section>

    <section class="ts-features" id="features">
      <div class="ts-feature">
        <span class="f-num">01</span>
        <h3>Tape-aware reasoning</h3>
        <p>Every tick, options flow, dark pool print — Tradesight's models consume the full firehose and weigh it by relevance to your book.</p>
      </div>
      <div class="ts-feature">
        <span class="f-num">02</span>
        <h3>Filing-grade comprehension</h3>
        <p>10-K, 8-K, S-1 parsed within seconds of release. Anomalies surface to your terminal before the wire picks them up.</p>
      </div>
      <div class="ts-feature">
        <span class="f-num">03</span>
        <h3>Conviction-weighted signals</h3>
        <p>Not "buy AAPL". A bracketed thesis with entry, target, stop, half-life, and the chain of reasoning behind it.</p>
      </div>
    </section>

    <section class="ts-demo" id="demo">
      <header class="ts-demo-head">
        <p class="eyebrow">LIVE PREVIEW</p>
        <h2>The terminal, in motion.</h2>
      </header>

      <div class="ts-terminal">
        <div class="term-row term-row-tabs">
          <span class="term-tab active">WATCH</span>
          <span class="term-tab">CHAIN</span>
          <span class="term-tab">FLOW</span>
          <span class="term-tab">SIGNALS</span>
          <span class="term-clock" id="term-clock">--:--:--</span>
        </div>
        <div class="term-grid">
          <div class="term-panel">
            <h4>POSITIONS</h4>
            <table id="positions"></table>
          </div>
          <div class="term-panel term-chart">
            <h4>NVDA · 1M <span class="spark-label" id="spark-label">+12.4%</span></h4>
            <svg id="sparkline" viewBox="0 0 320 120" preserveAspectRatio="none"></svg>
          </div>
          <div class="term-panel term-signal">
            <h4>NEW SIGNAL</h4>
            <p class="signal-ticker">NVDA</p>
            <p class="signal-action">LONG · 2.1% of book</p>
            <p class="signal-reason">Filing anomaly: 8-K language shift on data-center supply guidance vs. prior quarter. Confidence 0.78.</p>
            <div class="signal-meta">
              <span>Entry 1,142.30</span>
              <span>Target 1,228.00</span>
              <span>Stop 1,108.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ts-cta">
      <h2>Built for traders who already won.</h2>
      <p>Tradesight isn't a robo-advisor. It's an instrument for professionals who measure their edge in basis points and milliseconds.</p>
      <a class="ts-button" href="#">Request access →</a>
    </section>
  </main>

  <footer class="ts-footer">
    <span>TRADESIGHT // CONCEPT DESIGN BY A. MAZURIN // © 2026</span>
    <span>NOT INVESTMENT ADVICE</span>
  </footer>

  <template id="designer-notes">
    <p class="notes-eyebrow">Case 02 · Tradesight</p>
    <h2>Trading, by way of Bloomberg.</h2>

    <h3>What is this?</h3>
    <p>A concept for an AI-native trading platform. The fictional product surfaces trade ideas with full reasoning chains, not just buy/sell signals.</p>

    <h3>Who is it for?</h3>
    <p>Professional discretionary traders and small fund managers — people who already have a process and want an additional lens, not a robo-advisor.</p>

    <h3>Design decisions</h3>
    <ul>
      <li>Pure black background with amber/green/red — this is the inherited visual language of finance terminals. Traders feel at home immediately.</li>
      <li>JetBrains Mono everywhere — monospaced rhythm communicates density and seriousness.</li>
      <li>The hero stat numbers animate in (counting up) to suggest the platform is alive.</li>
      <li>The "live preview" terminal panel uses simulated motion rather than real data — enough to feel real, fast to load.</li>
    </ul>

    <h3>What I wanted to communicate</h3>
    <p>Precision and confidence. The user should think "this looks like something I'd actually use" within 2 seconds. Soft gradients, friendly illustrations, or generic SaaS chrome would have killed it.</p>

    <a class="notes-back" href="/">← Back to portfolio</a>
  </template>

  <script type="module">
    import { initNotesPanel } from '/shared/notes-panel.js';
    initNotesPanel();
  </script>
  <script type="module" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write cases/tradesight/styles.css**

```css
:root {
  --bg: #050505;
  --fg: #E8E6DE;
  --amber: #FFB627;
  --green: #39FF14;
  --red: #FF4D4D;
  --muted: #6B6B66;
  --rule: #1C1C1A;
  --mono: 'JetBrains Mono', ui-monospace, monospace;
  --sans: 'Inter', system-ui, sans-serif;
  --serif: 'Newsreader', Georgia, serif;
  --notes-accent: var(--amber);
  --notes-accent-fg: #050505;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--mono);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }

.ts-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--rule);
  padding: 0 24px;
  height: 56px;
  gap: 32px;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 50;
}
.ts-brand {
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--amber);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ts-brand .dot {
  width: 8px; height: 8px;
  background: var(--green);
  border-radius: 50%;
  box-shadow: 0 0 12px var(--green);
  animation: pulse 1.4s infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.ts-ticker {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  font-size: 12px;
  letter-spacing: 0.04em;
  display: flex;
  gap: 20px;
}
.ts-ticker .t-up { color: var(--green); }
.ts-ticker .t-down { color: var(--red); }
.ts-ticker .t-sym { color: var(--fg); margin-right: 4px; }

.ts-nav { display: flex; gap: 24px; font-size: 12px; color: var(--muted); letter-spacing: 0.06em; }
.ts-nav a:hover { color: var(--amber); }

main { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.ts-hero {
  padding: 120px 0 80px;
  border-bottom: 1px solid var(--rule);
}
.eyebrow { font-size: 11px; letter-spacing: 0.2em; color: var(--muted); margin-bottom: 24px; }
.ts-hero h1 {
  font-family: var(--sans);
  font-weight: 200;
  font-size: clamp(48px, 7vw, 88px);
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 24px;
}
.ts-hero h1 .hl {
  color: var(--amber);
  font-style: italic;
  font-family: var(--serif);
  font-weight: 500;
  text-shadow: 0 0 24px rgba(255, 182, 39, 0.4);
}
.ts-hero .sub {
  font-family: var(--sans);
  font-size: 18px;
  color: #BFBDB3;
  max-width: 60ch;
  margin-bottom: 56px;
  line-height: 1.5;
}
.ts-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--rule);
  border: 1px solid var(--rule);
}
.ts-stats > div {
  background: var(--bg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ts-stats .num {
  font-size: 36px;
  font-weight: 500;
  color: var(--amber);
  letter-spacing: -0.02em;
}
.ts-stats .lbl {
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--muted);
  text-transform: uppercase;
}

.ts-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--rule);
  border-bottom: 1px solid var(--rule);
}
.ts-feature {
  background: var(--bg);
  padding: 56px 32px;
}
.f-num {
  font-family: var(--serif);
  font-style: italic;
  color: var(--amber);
  font-size: 24px;
  display: block;
  margin-bottom: 32px;
}
.ts-feature h3 {
  font-family: var(--sans);
  font-weight: 500;
  font-size: 22px;
  margin-bottom: 16px;
  color: var(--fg);
}
.ts-feature p {
  font-family: var(--sans);
  color: #B0AEA4;
  font-size: 15px;
  line-height: 1.55;
}

.ts-demo { padding: 96px 0; }
.ts-demo-head { margin-bottom: 48px; }
.ts-demo-head h2 {
  font-family: var(--sans);
  font-weight: 200;
  font-size: clamp(36px, 5vw, 56px);
  letter-spacing: -0.02em;
}

.ts-terminal {
  background: #0B0B0A;
  border: 1px solid var(--rule);
}
.term-row-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--rule);
}
.term-tab {
  padding: 4px 14px;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--muted);
  cursor: pointer;
  border-radius: 2px;
}
.term-tab.active { color: var(--amber); background: rgba(255, 182, 39, 0.08); }
.term-clock {
  margin-left: auto;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--muted);
}
.term-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  min-height: 280px;
}
.term-panel {
  padding: 18px 20px;
  border-right: 1px solid var(--rule);
}
.term-panel:last-child { border-right: none; }
.term-panel h4 {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin-bottom: 14px;
  font-weight: 500;
}
.term-panel .spark-label { color: var(--green); float: right; }
.term-panel table { width: 100%; border-collapse: collapse; }
.term-panel td {
  padding: 5px 0;
  font-size: 12px;
}
.term-panel td.sym { color: var(--amber); }
.term-panel td.qty { color: var(--muted); text-align: right; }
.term-panel td.pct { text-align: right; }
.term-panel td.pct.up { color: var(--green); }
.term-panel td.pct.dn { color: var(--red); }

#sparkline {
  width: 100%;
  height: 140px;
}

.term-signal .signal-ticker {
  font-size: 32px;
  color: var(--amber);
  font-weight: 500;
  margin-bottom: 6px;
}
.term-signal .signal-action {
  color: var(--green);
  font-size: 13px;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}
.term-signal .signal-reason {
  font-family: var(--sans);
  font-size: 13px;
  color: #B0AEA4;
  line-height: 1.45;
  margin-bottom: 18px;
}
.term-signal .signal-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: var(--muted);
}

.ts-cta {
  padding: 120px 0;
  text-align: center;
  border-top: 1px solid var(--rule);
}
.ts-cta h2 {
  font-family: var(--sans);
  font-weight: 200;
  font-size: clamp(36px, 5vw, 56px);
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  max-width: 20ch;
  margin-inline: auto;
}
.ts-cta p { font-family: var(--sans); color: #B0AEA4; max-width: 50ch; margin: 0 auto 32px; font-size: 16px; }
.ts-button {
  display: inline-block;
  padding: 14px 28px;
  border: 1px solid var(--amber);
  color: var(--amber);
  font-size: 13px;
  letter-spacing: 0.12em;
  transition: all 200ms ease;
}
.ts-button:hover { background: var(--amber); color: var(--bg); box-shadow: 0 0 32px rgba(255, 182, 39, 0.5); }

.ts-footer {
  display: flex;
  justify-content: space-between;
  padding: 24px;
  border-top: 1px solid var(--rule);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--muted);
}

@media (max-width: 880px) {
  .ts-stats, .ts-features, .term-grid { grid-template-columns: 1fr; }
  .term-panel { border-right: none; border-bottom: 1px solid var(--rule); }
}
@media (max-width: 600px) {
  .ts-nav { display: none; }
  .ts-header { gap: 16px; }
}
```

- [ ] **Step 3: Write cases/tradesight/app.js**

```js
// Tickers — synthetic price stream.
const SYMBOLS = ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'BTC', 'ETH', 'GOOG', 'META', 'AMD', 'COIN', 'JPM', 'PLTR'];
const tickerEl = document.getElementById('ticker');
const positions = document.getElementById('positions');
const clockEl = document.getElementById('term-clock');

const state = SYMBOLS.map((s) => ({
  sym: s,
  price: 50 + Math.random() * 1500,
  change: (Math.random() - 0.5) * 4,
}));

function fmt(n) { return n.toFixed(2); }

function renderTicker() {
  tickerEl.innerHTML = state.map((s) => {
    const cls = s.change >= 0 ? 't-up' : 't-down';
    const arrow = s.change >= 0 ? '+' : '';
    return `<span><span class="t-sym">${s.sym}</span><span class="${cls}">${arrow}${fmt(s.change)}%</span></span>`;
  }).join('');
}

function renderPositions() {
  positions.innerHTML = state.slice(0, 6).map((s) => {
    const cls = s.change >= 0 ? 'up' : 'dn';
    const arrow = s.change >= 0 ? '+' : '';
    return `<tr>
      <td class="sym">${s.sym}</td>
      <td class="qty">${Math.floor(Math.random() * 900 + 100)}</td>
      <td class="pct ${cls}">${arrow}${fmt(s.change)}%</td>
    </tr>`;
  }).join('');
}

function tick() {
  state.forEach((s) => {
    s.change += (Math.random() - 0.5) * 0.2;
    s.change = Math.max(-9, Math.min(9, s.change));
  });
  renderTicker();
  renderPositions();
}

function tickClock() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} NYC`;
}

renderTicker();
renderPositions();
tickClock();
setInterval(tick, 1800);
setInterval(tickClock, 1000);

// Sparkline animation.
const spark = document.getElementById('sparkline');
if (spark) {
  const pts = [];
  let v = 60;
  for (let i = 0; i < 32; i++) {
    v += (Math.random() - 0.45) * 12;
    v = Math.max(20, Math.min(100, v));
    pts.push(v);
  }
  const W = 320, H = 120;
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * W} ${H - p}`).join(' ');
  const fill = `${path} L ${W} ${H} L 0 ${H} Z`;
  spark.innerHTML = `
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#39FF14" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#39FF14" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${fill}" fill="url(#sg)"/>
    <path d="${path}" fill="none" stroke="#39FF14" stroke-width="1.2"/>
  `;
}

// Animate hero stats counting up.
function animateNum(el, target, suffix = '', dec = 0) {
  const start = 0;
  const dur = 1200;
  const t0 = performance.now();
  function frame(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = start + (target - start) * eased;
    el.textContent = v.toFixed(dec) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const tradesEl = document.getElementById('stat-trades');
if (tradesEl) animateNum(tradesEl, 847);
```

- [ ] **Step 4: Browser verify**

Open `http://localhost:8000/cases/tradesight/`. Confirm:
- Header shows TRADESIGHT logo with pulsing green dot, ticker scrolling/updating prices, navigation.
- Hero: "An edge you can _feel_." with "feel" in amber italic serif. Three stats below.
- Three feature columns render.
- Demo terminal block shows tabs, clock ticking once per second, positions table, sparkline SVG drawn in green, signal panel.
- The "i" button is fixed bottom-right (amber circle); clicking opens the Designer Notes panel.
- Esc and clicking backdrop both close the panel.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add cases/tradesight/
git commit -m "feat(case): tradesight — bloomberg-terminal aesthetic"
```

---

## Task 5: Case — Codex IDE (developer-tool aesthetic)

**Files:**
- Create: `cases/codex-ide/index.html`
- Create: `cases/codex-ide/styles.css`
- Create: `cases/codex-ide/app.js`

GitHub dark `#0D1117`, JetBrains Mono everywhere, syntax-highlighted code samples, teal `#7DD3FC` glow accents. Hero features a "ghost completion" animation: typed code with a gray AI suggestion appearing inline.

- [ ] **Step 1: Write cases/codex-ide/index.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Codex IDE — the IDE that thinks alongside you</title>
  <meta name="description" content="An AI coding assistant that reasons about your code instead of guessing tokens. Built for engineers.">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/shared/notes-panel.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="cx-header">
    <a class="cx-brand" href="/">
      <span class="cx-logo">⌬</span> codex
    </a>
    <nav>
      <a href="#features">Features</a>
      <a href="#demo">Try it</a>
      <a href="/">← Portfolio</a>
    </nav>
  </header>

  <main>
    <section class="cx-hero">
      <p class="badge">Now in beta · macOS · Linux · Windows</p>
      <h1>
        The IDE that
        <span class="grad">thinks</span>
        alongside you.
      </h1>
      <p class="sub">
        Codex is not autocomplete. It's a junior engineer that read your codebase last night and is sitting beside you, watching the cursor, ready when you are.
      </p>
      <div class="cx-editor" aria-hidden="true">
        <div class="cx-editor-chrome">
          <span class="dot dot-r"></span>
          <span class="dot dot-y"></span>
          <span class="dot dot-g"></span>
          <span class="cx-filename">solve.ts</span>
        </div>
        <pre class="cx-code"><code><span class="ln">1</span><span class="kw">function</span> <span class="fn">solveBoard</span>(board: <span class="ty">Board</span>): <span class="ty">Solution</span> {
<span class="ln">2</span>  <span class="kw">const</span> queue = [<span class="fn">initialState</span>(board)];
<span class="ln">3</span>  <span class="kw">while</span> (queue.length) {
<span class="ln">4</span>    <span class="kw">const</span> state = queue.<span class="fn">shift</span>()!;
<span class="ln">5</span>    <span id="hero-typed"></span><span id="hero-ghost" class="ghost"></span><span id="hero-cursor" class="cursor"></span>
<span class="ln">6</span>  }
<span class="ln">7</span>}</code></pre>
      </div>
    </section>

    <section class="cx-features" id="features">
      <div class="cx-feature">
        <span class="f-tag">REASON</span>
        <h3>It thinks before it types.</h3>
        <p>Codex breaks problems down. You see the plan it formed before any code lands in your file. You can edit the plan. The code follows from it.</p>
      </div>
      <div class="cx-feature">
        <span class="f-tag">CITE</span>
        <h3>Every suggestion comes with sources.</h3>
        <p>When Codex writes a function, it shows you the three places in your codebase it learned the pattern from. No more hallucinated APIs.</p>
      </div>
      <div class="cx-feature">
        <span class="f-tag">REFACTOR</span>
        <h3>Multi-file edits, atomically.</h3>
        <p>Rename a type, change a contract — Codex proposes the whole edit set, you review one diff, accept all or none. No half-finished states.</p>
      </div>
      <div class="cx-feature">
        <span class="f-tag">LEARN</span>
        <h3>It gets better in your repo.</h3>
        <p>Codex builds a per-repo model of your conventions, your linters, your patterns. The 100th suggestion is sharper than the first.</p>
      </div>
    </section>

    <section class="cx-demo" id="demo">
      <p class="eyebrow">Try the editor</p>
      <h2>Tab to accept. Esc to dismiss.</h2>
      <p class="demo-sub">Pick a prompt. Watch Codex think out loud.</p>

      <div class="cx-prompts">
        <button class="prompt-btn active" data-prompt="parse">Parse a CSV</button>
        <button class="prompt-btn" data-prompt="debounce">Debounce a callback</button>
        <button class="prompt-btn" data-prompt="cache">Memoize a result</button>
      </div>

      <div class="cx-workspace">
        <aside class="cx-reasoning">
          <h4>Codex is reasoning</h4>
          <ol id="reasoning-list"></ol>
        </aside>
        <div class="cx-editor cx-editor-demo">
          <div class="cx-editor-chrome">
            <span class="dot dot-r"></span>
            <span class="dot dot-y"></span>
            <span class="dot dot-g"></span>
            <span class="cx-filename" id="demo-filename">demo.ts</span>
          </div>
          <pre class="cx-code"><code id="demo-code"></code></pre>
        </div>
      </div>
    </section>

    <section class="cx-cta">
      <h2>Designed for engineers who ship.</h2>
      <a class="cx-button" href="#">Download beta →</a>
    </section>
  </main>

  <footer class="cx-footer">
    <span>codex · concept design · 2026</span>
    <span>not affiliated with any existing product</span>
  </footer>

  <template id="designer-notes">
    <p class="notes-eyebrow">Case 04 · Codex IDE</p>
    <h2>An IDE that takes AI seriously.</h2>

    <h3>What is this?</h3>
    <p>A concept for an AI coding assistant that emphasises reasoning over completion. It looks like a developer tool because it's <em>for</em> developers.</p>

    <h3>Who is it for?</h3>
    <p>Working software engineers — not learners, not vibe-coders. People who can read code faster than they can read English explanations of code.</p>

    <h3>Design decisions</h3>
    <ul>
      <li>GitHub dark (#0D1117) — the visual home of engineers. No marketing-deck gradient.</li>
      <li>JetBrains Mono everywhere, even for prose. The whole page reads like a terminal.</li>
      <li>The hero IDE mockup uses real-looking TypeScript with the AI suggestion in gray, exactly how ghost-text completions render in real editors. Recognisable instantly.</li>
      <li>Animated typing in the hero — the page feels alive within 500ms.</li>
      <li>Feature blocks use action-verb tags (REASON, CITE, REFACTOR, LEARN) instead of nouns. Engineers respond to verbs.</li>
    </ul>

    <h3>What I wanted to communicate</h3>
    <p>Seriousness and craft. The page should pass the "screenshot in a hacker-news thread" test — an engineer should look and think "this team is competent".</p>

    <a class="notes-back" href="/">← Back to portfolio</a>
  </template>

  <script type="module">
    import { initNotesPanel } from '/shared/notes-panel.js';
    initNotesPanel();
  </script>
  <script type="module" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write cases/codex-ide/styles.css**

```css
:root {
  --bg: #0D1117;
  --surface: #161B22;
  --surface-2: #1C232C;
  --border: #30363D;
  --fg: #C9D1D9;
  --fg-dim: #8B949E;
  --teal: #7DD3FC;
  --teal-glow: rgba(125, 211, 252, 0.4);
  --kw: #FF7B72;
  --fn: #D2A8FF;
  --str: #A5D6FF;
  --ty: #FFA657;
  --num: #79C0FF;
  --com: #8B949E;
  --mono: 'JetBrains Mono', ui-monospace, monospace;
  --sans: 'Inter', system-ui, sans-serif;
  --notes-accent: var(--teal);
  --notes-accent-fg: #0D1117;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--mono);
  font-size: 14px;
  line-height: 1.6;
}
a { color: inherit; text-decoration: none; }

.cx-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: rgba(13, 17, 23, 0.85);
  backdrop-filter: blur(8px);
  z-index: 50;
}
.cx-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.02em;
}
.cx-logo {
  color: var(--teal);
  font-size: 22px;
  text-shadow: 0 0 12px var(--teal-glow);
}
.cx-header nav { display: flex; gap: 28px; font-size: 13px; color: var(--fg-dim); }
.cx-header nav a:hover { color: var(--teal); }

main { max-width: 1100px; margin: 0 auto; padding: 0 32px; }

.cx-hero { padding: 96px 0 64px; }
.badge {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.06em;
  background: rgba(125, 211, 252, 0.1);
  color: var(--teal);
  border: 1px solid rgba(125, 211, 252, 0.3);
  padding: 5px 12px;
  border-radius: 99px;
  margin-bottom: 32px;
}
.cx-hero h1 {
  font-family: var(--sans);
  font-weight: 600;
  font-size: clamp(48px, 7vw, 88px);
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin-bottom: 28px;
  max-width: 16ch;
}
.cx-hero h1 .grad {
  background: linear-gradient(120deg, #7DD3FC 0%, #A78BFA 50%, #F472B6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.cx-hero .sub {
  font-family: var(--sans);
  font-size: 18px;
  color: var(--fg-dim);
  max-width: 60ch;
  margin-bottom: 56px;
  line-height: 1.55;
}

.cx-editor {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
}
.cx-editor-chrome {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}
.cx-editor-chrome .dot { width: 12px; height: 12px; border-radius: 50%; }
.cx-editor-chrome .dot-r { background: #FF5F57; }
.cx-editor-chrome .dot-y { background: #FEBC2E; }
.cx-editor-chrome .dot-g { background: #28C840; }
.cx-filename {
  margin-left: 16px;
  font-size: 12px;
  color: var(--fg-dim);
}
.cx-code {
  padding: 24px 28px;
  font-family: var(--mono);
  font-size: 14px;
  line-height: 1.8;
  white-space: pre;
  overflow-x: auto;
}
.cx-code .ln {
  display: inline-block;
  width: 28px;
  color: var(--com);
  user-select: none;
}
.cx-code .kw { color: var(--kw); }
.cx-code .fn { color: var(--fn); }
.cx-code .ty { color: var(--ty); }
.cx-code .str { color: var(--str); }
.cx-code .num { color: var(--num); }
.cx-code .com { color: var(--com); font-style: italic; }
.cx-code .ghost { color: var(--com); font-style: italic; opacity: 0.7; }
.cx-code .cursor {
  display: inline-block;
  width: 7px;
  height: 1.1em;
  background: var(--teal);
  vertical-align: text-bottom;
  animation: blink 1s steps(2) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.cx-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 96px 0;
}
.cx-feature {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 32px;
  background: linear-gradient(180deg, rgba(125, 211, 252, 0.02), transparent);
  transition: border-color 200ms ease;
}
.cx-feature:hover { border-color: var(--teal); }
.f-tag {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--teal);
  background: rgba(125, 211, 252, 0.08);
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}
.cx-feature h3 {
  font-family: var(--sans);
  font-weight: 600;
  font-size: 22px;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
}
.cx-feature p {
  font-family: var(--sans);
  color: var(--fg-dim);
  font-size: 15px;
}

.cx-demo { padding: 64px 0 96px; }
.eyebrow { font-size: 11px; letter-spacing: 0.16em; color: var(--teal); margin-bottom: 16px; }
.cx-demo h2 {
  font-family: var(--sans);
  font-weight: 600;
  font-size: clamp(32px, 4.5vw, 48px);
  letter-spacing: -0.025em;
  margin-bottom: 12px;
}
.demo-sub { font-family: var(--sans); color: var(--fg-dim); margin-bottom: 32px; }

.cx-prompts {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.prompt-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--fg);
  padding: 10px 18px;
  font-family: var(--mono);
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 180ms ease;
}
.prompt-btn:hover { border-color: var(--teal); color: var(--teal); }
.prompt-btn.active {
  background: rgba(125, 211, 252, 0.12);
  border-color: var(--teal);
  color: var(--teal);
}

.cx-workspace {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
  align-items: stretch;
}
.cx-reasoning {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
}
.cx-reasoning h4 {
  font-family: var(--sans);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--teal);
  margin-bottom: 16px;
  font-weight: 500;
}
.cx-reasoning ol {
  padding-left: 18px;
  color: var(--fg-dim);
  font-size: 13px;
  font-family: var(--mono);
}
.cx-reasoning li {
  margin-bottom: 10px;
  opacity: 0;
  transform: translateY(4px);
  animation: r-in 360ms forwards;
}
@keyframes r-in { to { opacity: 1; transform: none; } }

.cx-cta {
  text-align: center;
  padding: 120px 0;
  border-top: 1px solid var(--border);
}
.cx-cta h2 {
  font-family: var(--sans);
  font-weight: 600;
  font-size: clamp(32px, 5vw, 56px);
  letter-spacing: -0.025em;
  margin-bottom: 32px;
}
.cx-button {
  display: inline-block;
  padding: 16px 32px;
  background: var(--teal);
  color: var(--bg);
  font-family: var(--mono);
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  transition: all 200ms ease;
}
.cx-button:hover {
  box-shadow: 0 0 40px var(--teal-glow);
  transform: translateY(-2px);
}

.cx-footer {
  display: flex;
  justify-content: space-between;
  padding: 24px 32px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--fg-dim);
}

@media (max-width: 800px) {
  .cx-features { grid-template-columns: 1fr; }
  .cx-workspace { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Write cases/codex-ide/app.js**

```js
// Hero ghost-completion typing animation.
const typed = document.getElementById('hero-typed');
const ghost = document.getElementById('hero-ghost');

const HERO_SEQUENCE = [
  { text: 'queue.', el: typed, color: 'fg', delay: 80 },
  { text: 'push', el: typed, color: 'fn', delay: 80 },
  { text: '(', el: typed, color: 'fg', delay: 80 },
  // Ghost completion appears now:
  { ghost: '...nextStates(state))', delay: 600 },
];

async function typeHero() {
  if (!typed) return;
  for (const step of HERO_SEQUENCE) {
    await new Promise((r) => setTimeout(r, step.delay));
    if (step.ghost) {
      ghost.textContent = step.ghost;
    } else {
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

async function renderPrompt(key) {
  const p = PROMPTS[key];
  if (!p) return;
  demoFilename.textContent = p.filename;
  reasoningList.innerHTML = '';
  demoCode.innerHTML = '';

  // Stream reasoning bullets one by one.
  for (let i = 0; i < p.reasoning.length; i++) {
    await new Promise((r) => setTimeout(r, 280));
    const li = document.createElement('li');
    li.style.animationDelay = '0ms';
    li.textContent = p.reasoning[i];
    reasoningList.appendChild(li);
  }

  // Render code (already-typed, no per-char animation — too slow for long blocks).
  await new Promise((r) => setTimeout(r, 200));
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
```

- [ ] **Step 4: Browser verify**

Open `http://localhost:8000/cases/codex-ide/`. Confirm:
- Header with ⌬ codex logo (teal, glowing).
- Hero: "The IDE that _thinks_ alongside you." with "thinks" in a multi-color gradient.
- IDE mockup below hero: typed code animates in with a gray ghost completion appearing after.
- 4 feature cards in 2×2 grid.
- Demo section: 3 prompt buttons. Clicking each:
  - Filename updates.
  - Reasoning bullets stream in one by one (~280ms apart).
  - Code block renders with syntax colors.
- Designer Notes panel opens via "i" button (teal accent).
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add cases/codex-ide/
git commit -m "feat(case): codex-ide — dev-tool IDE aesthetic"
```

---

## Task 6: Case — Hivemind (futuristic agent infrastructure aesthetic)

**Files:**
- Create: `cases/hivemind/index.html`
- Create: `cases/hivemind/styles.css`
- Create: `cases/hivemind/app.js`

Deep indigo `#0F0F23` background, neon cyan/violet accents, glassmorphism panels, monospace UI labels. Hero features an animated SVG node graph (agents pulsing and connecting). The interactive demo lets the visitor click to compose a workflow that runs with simulated execution status.

- [ ] **Step 1: Write cases/hivemind/index.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hivemind — orchestration for AI agent swarms</title>
  <meta name="description" content="Infrastructure for the AI-native era. Compose, run, and observe swarms of specialized agents.">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/shared/notes-panel.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="hm-bg-grid" aria-hidden="true"></div>

  <header class="hm-header">
    <a class="hm-brand" href="/">HIVEMIND<span class="dot">.</span></a>
    <nav>
      <a href="#how">How it works</a>
      <a href="#demo">Compose</a>
      <a href="/">← Portfolio</a>
    </nav>
  </header>

  <main>
    <section class="hm-hero">
      <div class="hm-hero-left">
        <p class="eyebrow">AGENT ORCHESTRATION · BETA</p>
        <h1>
          Infrastructure for the
          <span class="grad">AI-native era</span>.
        </h1>
        <p class="sub">
          Hivemind lets you compose, run, and observe swarms of specialized agents. Like Kubernetes for intelligence — declarative, observable, fault-tolerant.
        </p>
        <div class="hm-actions">
          <a class="btn-primary" href="#demo">Compose a workflow →</a>
          <a class="btn-ghost" href="#how">How it works</a>
        </div>
      </div>
      <div class="hm-hero-right">
        <svg class="hm-graph" viewBox="0 0 360 360" aria-hidden="true">
          <defs>
            <radialGradient id="node-glow" cx="50%" cy="50%">
              <stop offset="0%" stop-color="#7DF9FF" stop-opacity="1"/>
              <stop offset="100%" stop-color="#7DF9FF" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7DF9FF" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#A78BFA" stop-opacity="0.6"/>
            </linearGradient>
          </defs>
          <g id="graph-edges"></g>
          <g id="graph-nodes"></g>
        </svg>
      </div>
    </section>

    <section class="hm-stats">
      <div><span class="num">1.2M</span><span class="lbl">agent invocations / day</span></div>
      <div><span class="num">99.8%</span><span class="lbl">step success rate</span></div>
      <div><span class="num">14ms</span><span class="lbl">median dispatch latency</span></div>
      <div><span class="num">∞</span><span class="lbl">parallel runs per workflow</span></div>
    </section>

    <section class="hm-how" id="how">
      <h2>Declarative agents. Observable everything.</h2>
      <div class="hm-pillars">
        <div class="pillar">
          <span class="p-num">01</span>
          <h3>Declare</h3>
          <p>Write workflows as data — YAML, JSON, or our typed SDK. Agents are first-class entities with inputs, outputs, retries, and rate limits.</p>
        </div>
        <div class="pillar">
          <span class="p-num">02</span>
          <h3>Dispatch</h3>
          <p>Hivemind compiles your workflow into a DAG and schedules agent invocations across providers — OpenAI, Anthropic, your local cluster.</p>
        </div>
        <div class="pillar">
          <span class="p-num">03</span>
          <h3>Observe</h3>
          <p>Every step is traced, every cost accounted for, every prompt versioned. Replay any run. Diff any execution.</p>
        </div>
      </div>
    </section>

    <section class="hm-demo" id="demo">
      <p class="eyebrow">INTERACTIVE</p>
      <h2>Compose a workflow.</h2>
      <p class="demo-sub">Click an agent block to add it. Hit Run to see Hivemind dispatch them.</p>

      <div class="hm-composer">
        <aside class="hm-palette">
          <h4>AGENTS</h4>
          <button class="agent-btn" data-agent="research">🔎 Research</button>
          <button class="agent-btn" data-agent="summarize">📝 Summarize</button>
          <button class="agent-btn" data-agent="critique">🧪 Critique</button>
          <button class="agent-btn" data-agent="translate">🌐 Translate</button>
          <button class="agent-btn" data-agent="email">📧 Email</button>
          <button class="agent-btn" data-agent="store">🗄️ Store</button>
          <button class="reset-btn" id="reset-btn">Reset</button>
        </aside>

        <div class="hm-canvas">
          <div id="workflow-canvas" class="workflow-canvas"></div>
          <div class="hm-controls">
            <button id="run-btn" class="run-btn" disabled>▶ RUN WORKFLOW</button>
            <span id="run-status" class="run-status">Add agents to begin</span>
          </div>
        </div>
      </div>
    </section>

    <section class="hm-cta">
      <h2>For teams building with agents.</h2>
      <p>Request beta access. We're onboarding 20 teams in Q3.</p>
      <a class="btn-primary" href="#">Request access →</a>
    </section>
  </main>

  <footer class="hm-footer">
    <span>HIVEMIND · concept design · 2026</span>
  </footer>

  <template id="designer-notes">
    <p class="notes-eyebrow">Case 09 · Hivemind</p>
    <h2>Infra for the next interface paradigm.</h2>

    <h3>What is this?</h3>
    <p>A concept for an AI agent orchestration platform — the K8s-of-agents thesis. The site has to feel like serious infrastructure, not a toy.</p>

    <h3>Who is it for?</h3>
    <p>Engineering teams that have moved past "let's call OpenAI in a Lambda" and need real orchestration: retries, observability, cost tracking, replay.</p>

    <h3>Design decisions</h3>
    <ul>
      <li>Deep indigo + neon cyan/violet — the "infrastructure" palette of 2026. Distinguishable from generic SaaS purple.</li>
      <li>An animated SVG node graph in the hero immediately communicates "multi-agent" without a single word of explanation.</li>
      <li>Space Grotesk for display — geometric, modern, slightly technical without being cold.</li>
      <li>Glassmorphism panels — feels like a real infra dashboard.</li>
      <li>The interactive composer is the centerpiece: the visitor builds something and watches it execute. That experience IS the pitch.</li>
    </ul>

    <h3>What I wanted to communicate</h3>
    <p>Sophistication, capability, intent. This page should make a senior engineer think "these people understand the problem".</p>

    <a class="notes-back" href="/">← Back to portfolio</a>
  </template>

  <script type="module">
    import { initNotesPanel } from '/shared/notes-panel.js';
    initNotesPanel();
  </script>
  <script type="module" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write cases/hivemind/styles.css**

```css
:root {
  --bg: #0A0A1F;
  --bg-2: #0F0F23;
  --surface: rgba(255, 255, 255, 0.04);
  --border: rgba(125, 249, 255, 0.15);
  --border-strong: rgba(125, 249, 255, 0.35);
  --fg: #E8E8FF;
  --fg-dim: #9C9CB8;
  --cyan: #7DF9FF;
  --violet: #A78BFA;
  --pink: #F472B6;
  --display: 'Space Grotesk', system-ui, sans-serif;
  --mono: 'JetBrains Mono', monospace;
  --notes-accent: var(--cyan);
  --notes-accent-fg: var(--bg);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--display);
  font-size: 16px;
  line-height: 1.55;
  min-height: 100vh;
  overflow-x: hidden;
}
a { color: inherit; text-decoration: none; }

.hm-bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(125, 249, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(125, 249, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}

.hm-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 40px;
  border-bottom: 1px solid var(--border);
  z-index: 5;
  backdrop-filter: blur(12px);
}
.hm-brand {
  font-family: var(--display);
  font-weight: 700;
  letter-spacing: 0.15em;
  font-size: 14px;
}
.hm-brand .dot {
  color: var(--cyan);
  font-size: 24px;
  vertical-align: text-bottom;
  text-shadow: 0 0 18px var(--cyan);
}
.hm-header nav { display: flex; gap: 32px; font-size: 13px; color: var(--fg-dim); }
.hm-header nav a:hover { color: var(--cyan); }

main { position: relative; max-width: 1200px; margin: 0 auto; padding: 0 40px; z-index: 1; }

.hm-hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 64px;
  padding: 96px 0;
  align-items: center;
}
.eyebrow { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; color: var(--cyan); margin-bottom: 24px; }
.hm-hero h1 {
  font-weight: 500;
  font-size: clamp(40px, 5.5vw, 72px);
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin-bottom: 28px;
}
.hm-hero h1 .grad {
  background: linear-gradient(120deg, var(--cyan), var(--violet), var(--pink));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hm-hero .sub {
  font-size: 18px;
  color: var(--fg-dim);
  margin-bottom: 40px;
  max-width: 50ch;
}
.hm-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-primary {
  display: inline-block;
  padding: 14px 24px;
  background: var(--cyan);
  color: var(--bg);
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  letter-spacing: 0.02em;
  border: 1px solid var(--cyan);
  transition: all 200ms ease;
}
.btn-primary:hover { box-shadow: 0 0 40px rgba(125, 249, 255, 0.5); transform: translateY(-2px); }
.btn-ghost {
  display: inline-block;
  padding: 14px 24px;
  border: 1px solid var(--border-strong);
  color: var(--fg);
  font-size: 14px;
  border-radius: 8px;
}
.btn-ghost:hover { background: var(--surface); border-color: var(--cyan); }

.hm-graph { width: 100%; height: auto; }
.graph-node { transition: transform 600ms ease, opacity 600ms ease; }
.graph-node circle.glow { opacity: 0.5; }
.graph-edge { stroke: url(#edge-grad); stroke-width: 0.8; opacity: 0; transition: opacity 800ms ease; }
.graph-edge.active { opacity: 1; }

.hm-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 96px;
}
.hm-stats > div {
  background: var(--bg-2);
  padding: 28px 24px;
}
.hm-stats .num {
  display: block;
  font-size: 36px;
  font-weight: 500;
  color: var(--cyan);
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}
.hm-stats .lbl {
  font-family: var(--mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--fg-dim);
}

.hm-how { padding: 32px 0 96px; }
.hm-how h2 {
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 500;
  letter-spacing: -0.02em;
  margin-bottom: 48px;
  max-width: 18ch;
}
.hm-pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.pillar {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px;
  backdrop-filter: blur(12px);
}
.p-num {
  font-family: var(--mono);
  color: var(--cyan);
  font-size: 12px;
  letter-spacing: 0.16em;
  display: block;
  margin-bottom: 20px;
}
.pillar h3 { font-size: 22px; font-weight: 500; margin-bottom: 12px; letter-spacing: -0.01em; }
.pillar p { color: var(--fg-dim); font-size: 15px; }

.hm-demo { padding: 32px 0 96px; }
.hm-demo h2 { font-size: clamp(32px, 4.5vw, 52px); font-weight: 500; letter-spacing: -0.02em; margin-bottom: 12px; }
.demo-sub { color: var(--fg-dim); margin-bottom: 40px; }

.hm-composer {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
  min-height: 460px;
}
.hm-palette {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  backdrop-filter: blur(12px);
}
.hm-palette h4 {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--fg-dim);
  margin-bottom: 8px;
}
.agent-btn {
  background: rgba(125, 249, 255, 0.06);
  border: 1px solid var(--border);
  color: var(--fg);
  padding: 12px 14px;
  font-family: var(--display);
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 160ms ease;
}
.agent-btn:hover { background: rgba(125, 249, 255, 0.14); border-color: var(--cyan); }
.reset-btn {
  margin-top: auto;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--fg-dim);
  padding: 10px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  border-radius: 8px;
  cursor: pointer;
}
.reset-btn:hover { color: var(--cyan); }

.hm-canvas {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
}
.workflow-canvas {
  flex: 1;
  min-height: 320px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px 0;
}
.workflow-canvas:empty::before {
  content: 'No agents added. Click an agent on the left to start.';
  font-family: var(--mono);
  font-size: 13px;
  color: var(--fg-dim);
  width: 100%;
  text-align: center;
}
.wf-node {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
  position: relative;
  transition: all 200ms ease;
}
.wf-node.running { border-color: var(--cyan); box-shadow: 0 0 28px rgba(125, 249, 255, 0.3); }
.wf-node.done { border-color: rgba(125, 249, 255, 0.6); background: rgba(125, 249, 255, 0.08); }
.wf-node.error { border-color: var(--pink); }
.wf-status {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--fg-dim);
  text-transform: uppercase;
}
.wf-node.running .wf-status { color: var(--cyan); }
.wf-node.done .wf-status { color: var(--cyan); }
.wf-arrow {
  color: var(--cyan);
  font-size: 18px;
  opacity: 0.6;
}

.hm-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  border-top: 1px solid var(--border);
  padding-top: 16px;
  margin-top: 8px;
}
.run-btn {
  background: var(--cyan);
  color: var(--bg);
  border: none;
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: 0.12em;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}
.run-btn:hover:not(:disabled) { box-shadow: 0 0 32px rgba(125, 249, 255, 0.5); }
.run-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.run-status {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--fg-dim);
  letter-spacing: 0.05em;
}

.hm-cta {
  text-align: center;
  padding: 96px 0;
  border-top: 1px solid var(--border);
}
.hm-cta h2 { font-size: clamp(32px, 5vw, 52px); font-weight: 500; letter-spacing: -0.02em; margin-bottom: 16px; }
.hm-cta p { color: var(--fg-dim); margin-bottom: 32px; }

.hm-footer {
  display: flex;
  justify-content: center;
  padding: 24px;
  border-top: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--fg-dim);
}

@media (max-width: 900px) {
  .hm-hero { grid-template-columns: 1fr; }
  .hm-stats { grid-template-columns: repeat(2, 1fr); }
  .hm-pillars { grid-template-columns: 1fr; }
  .hm-composer { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Write cases/hivemind/app.js**

```js
// Hero animated node graph.
const NODES = [
  { id: 'a', x: 80, y: 80, r: 6 },
  { id: 'b', x: 200, y: 60, r: 5 },
  { id: 'c', x: 280, y: 140, r: 7 },
  { id: 'd', x: 180, y: 180, r: 5 },
  { id: 'e', x: 90, y: 220, r: 6 },
  { id: 'f', x: 260, y: 260, r: 5 },
  { id: 'g', x: 160, y: 290, r: 4 },
  { id: 'h', x: 60, y: 310, r: 5 },
];
const EDGES = [
  ['a','b'], ['a','d'], ['b','c'], ['c','d'], ['c','f'],
  ['d','e'], ['d','g'], ['e','h'], ['f','g'], ['g','h'],
];

const nodesG = document.getElementById('graph-nodes');
const edgesG = document.getElementById('graph-edges');

if (nodesG && edgesG) {
  const idx = Object.fromEntries(NODES.map((n) => [n.id, n]));
  EDGES.forEach(([a, b], i) => {
    const A = idx[a], B = idx[b];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', A.x);
    line.setAttribute('y1', A.y);
    line.setAttribute('x2', B.x);
    line.setAttribute('y2', B.y);
    line.setAttribute('class', 'graph-edge');
    edgesG.appendChild(line);
    setTimeout(() => line.classList.add('active'), 200 + i * 90);
  });
  NODES.forEach((n, i) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'graph-node');
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glow.setAttribute('cx', n.x); glow.setAttribute('cy', n.y);
    glow.setAttribute('r', n.r * 3);
    glow.setAttribute('fill', 'url(#node-glow)');
    glow.setAttribute('class', 'glow');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', n.x); c.setAttribute('cy', n.y);
    c.setAttribute('r', n.r);
    c.setAttribute('fill', '#7DF9FF');
    g.appendChild(glow); g.appendChild(c);
    nodesG.appendChild(g);
    g.style.opacity = '0';
    setTimeout(() => { g.style.opacity = '1'; }, i * 120);
    setInterval(() => {
      c.animate([{ r: n.r }, { r: n.r * 1.4 }, { r: n.r }], { duration: 1800, iterations: 1 });
    }, 2000 + i * 400);
  });
}

// Workflow composer.
const AGENT_META = {
  research: { label: '🔎 Research', step: 'Search & retrieve' },
  summarize: { label: '📝 Summarize', step: 'Distill key points' },
  critique: { label: '🧪 Critique', step: 'Assess quality' },
  translate: { label: '🌐 Translate', step: 'Localize output' },
  email: { label: '📧 Email', step: 'Send via SMTP' },
  store: { label: '🗄️ Store', step: 'Persist to vector DB' },
};

const canvas = document.getElementById('workflow-canvas');
const runBtn = document.getElementById('run-btn');
const status = document.getElementById('run-status');
const resetBtn = document.getElementById('reset-btn');

let workflow = [];

function render() {
  canvas.innerHTML = '';
  workflow.forEach((a, i) => {
    const node = document.createElement('div');
    node.className = 'wf-node';
    node.dataset.idx = i;
    node.innerHTML = `
      <span class="wf-label">${AGENT_META[a].label}</span>
      <span class="wf-status">queued</span>
    `;
    canvas.appendChild(node);
    if (i < workflow.length - 1) {
      const arrow = document.createElement('span');
      arrow.className = 'wf-arrow';
      arrow.textContent = '→';
      canvas.appendChild(arrow);
    }
  });
  runBtn.disabled = workflow.length === 0;
  if (workflow.length === 0) status.textContent = 'Add agents to begin';
  else status.textContent = `${workflow.length} agent${workflow.length > 1 ? 's' : ''} queued. Ready.`;
}

document.querySelectorAll('.agent-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (workflow.length >= 6) {
      status.textContent = 'Max 6 agents per workflow.';
      return;
    }
    workflow.push(btn.dataset.agent);
    render();
  });
});

resetBtn.addEventListener('click', () => { workflow = []; render(); });

runBtn.addEventListener('click', async () => {
  if (!workflow.length) return;
  runBtn.disabled = true;
  status.textContent = 'Dispatching…';
  const nodes = canvas.querySelectorAll('.wf-node');
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const stat = n.querySelector('.wf-status');
    n.classList.add('running');
    stat.textContent = 'running';
    status.textContent = `Running step ${i + 1}/${nodes.length}: ${AGENT_META[workflow[i]].step}`;
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 400));
    n.classList.remove('running');
    n.classList.add('done');
    stat.textContent = `done · ${(180 + Math.random() * 320).toFixed(0)}ms`;
  }
  status.textContent = `Workflow complete · ${workflow.length} steps · 0 errors`;
  runBtn.disabled = false;
});

render();
```

- [ ] **Step 4: Browser verify**

Open `http://localhost:8000/cases/hivemind/`. Confirm:
- Background subtle grid visible behind content.
- Hero left side: heading "Infrastructure for the _AI-native era_." with the second phrase in cyan→violet→pink gradient.
- Hero right side: an animated SVG node graph with cyan dots that pulse and connecting lines that fade in over the first ~2 seconds.
- 4 stat tiles render below hero.
- "How it works" section: 3 glassmorphism pillars.
- Demo composer: click agent buttons on left — workflow nodes appear in canvas with arrows between them.
- Click "Run Workflow" — each node lights up (cyan glow), updates status text, then marks done.
- Reset button clears.
- "i" button opens Designer Notes (cyan accent).
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add cases/hivemind/
git commit -m "feat(case): hivemind — futuristic agent orchestration aesthetic"
```

---

## Task 7: Polish Hub Links & Cross-Verification

**Files:**
- (no new files; visual/QA pass)

- [ ] **Step 1: Verify all hub case-card links resolve**

With `python3 -m http.server 8000` running, visit each:
- `http://localhost:8000/` → 200
- `http://localhost:8000/cases/tradesight/` → 200
- `http://localhost:8000/cases/codex-ide/` → 200
- `http://localhost:8000/cases/hivemind/` → 200

- [ ] **Step 2: Verify "Back to portfolio" returns**

From each case, click the "← Portfolio" nav link AND the "Back to portfolio" link in the Designer Notes panel. Both should land at `/`.

- [ ] **Step 3: Visual coherence pass**

Open the hub showcase grid. Confirm the three live preview blocks (Tradesight ticker, Codex code, Hivemind graph) visually preview their cases — i.e., a visitor can guess each card's aesthetic from the preview alone.

- [ ] **Step 4: Mobile pass**

Resize browser to 375px. Confirm:
- Hub stacks to single column, nothing overflows.
- Each case page is readable and demos still work (or degrade gracefully).
- No horizontal scrollbars.

- [ ] **Step 5: Reduced motion pass**

In macOS System Settings → Accessibility → Display, enable "Reduce motion" (or use Chrome DevTools "Emulate CSS prefers-reduced-motion: reduce"). Reload each page. Confirm:
- The Designer Notes panel still opens but without slide animation.
- The Hivemind graph still draws but doesn't pulse aggressively.
- The Tradesight ticker still updates but no shimmer.
(Note: Stage 1 doesn't yet add `prefers-reduced-motion` overrides to every animation; this step is to identify which animations should be wrapped in Stage 3 polish. Add to a TODO if any are problematic.)

- [ ] **Step 6: Commit if any fixes needed**

If any verification step revealed a fix:
```bash
git add -A
git commit -m "fix: <what was fixed>"
```

If nothing changed: no commit. Move on.

---

## Task 8: GitHub Pages Deploy

**Files:**
- (no new files; repo setup + push)

- [ ] **Step 1: Create the public GitHub repo**

```bash
gh repo create amazurin-creator/amazurin-creator.github.io \
  --public \
  --description "Personal portfolio — ten distinctive web designs for AI products" \
  --source ~/personal/amazurin-creator.github.io \
  --remote origin
```

Expected: repo created at https://github.com/amazurin-creator/amazurin-creator.github.io

- [ ] **Step 2: Push main**

```bash
cd ~/personal/amazurin-creator.github.io && git push -u origin main
```

- [ ] **Step 3: Verify GitHub Pages auto-enables**

```bash
gh api repos/amazurin-creator/amazurin-creator.github.io/pages 2>&1 | head -20
```

GitHub auto-enables Pages for `<user>.github.io` repos on first push. If not:
```bash
gh api repos/amazurin-creator/amazurin-creator.github.io/pages \
  -X POST \
  -f source[branch]=main \
  -f source[path]=/
```

- [ ] **Step 4: Wait for Pages build to complete**

```bash
gh api repos/amazurin-creator/amazurin-creator.github.io/pages/builds/latest 2>&1 | head -10
```

Re-check until `status` is `built` (usually 30-90 seconds after push).

- [ ] **Step 5: Verify live deployment**

```bash
curl -sI https://amazurin-creator.github.io 2>&1 | head -5
curl -sI https://amazurin-creator.github.io/cases/tradesight/ 2>&1 | head -5
curl -sI https://amazurin-creator.github.io/cases/codex-ide/ 2>&1 | head -5
curl -sI https://amazurin-creator.github.io/cases/hivemind/ 2>&1 | head -5
```

All should return `HTTP/2 200`.

- [ ] **Step 6: Visual verification of live site**

Open `https://amazurin-creator.github.io` in a real browser. Walk through all three cases live. Confirm the interactive demos work, fonts load, no broken images.

- [ ] **Step 7: Done — no commit needed for this task**

The repo is now publicly live at `amazurin-creator.github.io`.

---

## Stage 1 Definition of Done

- [ ] Hub renders at `amazurin-creator.github.io` with all 10 case cards
- [ ] 3 live case studies (Tradesight, Codex IDE, Hivemind) reachable and interactive
- [ ] Each live case has functioning Designer Notes panel
- [ ] No console errors on any page
- [ ] Site usable on a 375px viewport
- [ ] All commits pushed to `main`

Stage 2 will add LexCounsel, Wavelet, Atrium Research, and Avatara (ai-content.agency-inspired). Stage 3 finishes Clarity Health, Lumen, Quill Tutor, plus Lighthouse / OG / favicon polish.
