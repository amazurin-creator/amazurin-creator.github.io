# AI Portfolio — Design Spec

**Date:** 2026-06-06
**Owner:** Artemey Mazurin
**Domain:** `https://amazurin-creator.github.io`
**Repo:** `amazurin-creator/amazurin-creator.github.io` (public, GitHub Pages auto-deploys from `main`)

## Goal

A personal portfolio / business card website showcasing **10 distinctive web designs for AI products across different verticals**. Each case is an interactive, standalone mini-site demonstrating range of aesthetics and UX patterns suited to its industry. The portfolio positions Artemey as a designer of AI products.

## Audience

- Potential clients commissioning AI product design
- Prospective employers / partners in the AI industry
- Other designers / engineers in the AI space (peer signal)

## Non-Goals

- Not a blog
- Not a CMS-driven site
- Not a real production product (each "case" is a designed concept, not a working SaaS)
- Not multilingual (English only)

## Tech Stack

- **Pure static:** HTML + CSS + vanilla JavaScript. No build step, no framework.
- **Tailwind via CDN** allowed when it accelerates a particular case's style — but each case may also have its own bespoke CSS file for designs that don't fit Tailwind defaults.
- **Fonts:** Google Fonts CDN, varied per case.
- **Assets:** SVG icons inline; royalty-free images via Unsplash CDN URLs or generated SVG illustrations; emoji where appropriate.
- **Deployment:** Push to `main` branch of `amazurin-creator/amazurin-creator.github.io` — GitHub Pages serves at root domain automatically.
- **Browser support:** Modern evergreen browsers only (last 2 versions of Chrome, Safari, Firefox).

## Information Architecture

```
/                            Hub — landing/visiting card with showcase grid
/cases/lexcounsel/           Case 1
/cases/tradesight/           Case 2
/cases/clarity-health/       Case 3
/cases/codex-ide/            Case 4
/cases/wavelet/              Case 5
/cases/lumen/                Case 6
/cases/quill-tutor/          Case 7
/cases/atrium-research/      Case 8
/cases/hivemind/             Case 9
/cases/avatara/              Case 10 (ai-content.agency-inspired)
```

Each case directory is self-contained:
```
cases/<slug>/
  ├── index.html
  ├── styles.css        # bespoke to the case
  └── app.js            # only if interactive demo requires it
```

Shared assets (the hub's CSS, OG images) live at root and in `/assets/`.

## Hub Design (root index.html)

The hub has a **neutral but distinctive** aesthetic that frames 10 different worlds without competing with them. It is intentionally restrained.

### Sections

1. **Hero**
   - Headline: "Artemey Mazurin — designer of AI products."
   - Sub: 1-2 sentences positioning. "Ten interfaces for ten futures. Each one a study in how AI products should feel for the people who use them."
   - Visual: minimal — possibly a subtle animated grid or single bold typographic treatment.

2. **Showcase grid**
   - 10 cards in a responsive grid (2×5 on desktop, 1-column on mobile).
   - Each card visually previews its case: case's own color, typographic snippet, mini-mockup or pattern. So even before clicking, the viewer sees 10 different visual worlds.
   - Card hover: subtle lift + reveal of "Open case →" CTA.

3. **About**
   - 2-3 paragraphs: who Artemey is, what he designs, what makes his approach distinctive. Personal but professional.

4. **Contact**
   - Email link, GitHub link, optional LinkedIn / X. Minimal.

### Hub aesthetic

- Background: off-white (`#FAFAF7`) or warm near-black (`#0E0E0C`) — decide during design.
- Typography: one editorial serif for headlines (e.g., **Fraunces** or **Newsreader**), one geometric sans for body (e.g., **Inter** or **General Sans**).
- Accent: a single bold color (e.g., chartreuse `#D4F26C` or deep coral `#FF5C39`).
- Whitespace-driven. Editorial. Confident.

## The 10 Cases

Each case follows a similar **structural pattern** but a radically **different visual treatment**. Every case has:

1. Hero (product name, tagline, primary CTA — fake)
2. Feature/value section (3-6 cards or grid)
3. **Interactive demo block** — the centerpiece. A specific small interaction that shows the product "working".
4. Social proof / use cases
5. Footer
6. **Designer notes panel** — slide-out side panel ("About this design") accessible via a corner button. Contains: product summary, target user, design decisions, what was being communicated visually.

### Case 1 — LexCounsel (AI Legal Assistant)

- **Domain:** Immigration / legal advice
- **Aesthetic:** Editorial law-firm classic. Deep navy `#0A1F3D`, ivory, gold rule lines. Serif (Cormorant Garamond) for headlines, sans for body.
- **Hero:** Wide condensed serif headline. Photo of a marble column or library detail (Unsplash). Restrained.
- **Interactive demo:** Chat simulation. User picks a pre-defined question ("Can my H-1B be transferred while my I-140 is pending?"); the response types out character-by-character as if from a measured, thoughtful counselor. Citations appear inline as superscript links.
- **Tone:** Authority, gravitas, trust.

### Case 2 — Tradesight (AI Trading Co-pilot)

- **Domain:** Finance / quant trading
- **Aesthetic:** Bloomberg terminal but elevated. Pure black background, JetBrains Mono throughout, glowing amber `#FFB627` and electric green `#39FF14` accents. Dense data, monospaced rhythm.
- **Hero:** A live-feeling ticker tape across the top, headline beneath in mono caps. Stats counter ("avg edge: +2.3σ"). Real-time-feeling shimmer effects.
- **Interactive demo:** A simulated dashboard with a sparkline chart that animates, ticker prices that update via JS interval, a "Tradesight signal" panel that updates with a buy/sell suggestion every few seconds.
- **Tone:** Precision, speed, edge.

### Case 3 — Clarity Health (AI Medical Diagnostic Aid)

- **Domain:** Healthcare / patient-facing diagnostics
- **Aesthetic:** Clinical calm. Pure white, soft mint `#E8F5E9` cards, generous rounded corners, plenty of whitespace. Inter Display + airy spacing. Soft drop shadows.
- **Hero:** "Understand your symptoms. Without panic." Image of a calm, well-lit anatomy illustration (or abstract organic shape).
- **Interactive demo:** A symptom selector. Pick 2-3 symptoms from chips → a result card slides in with possible explanations and "When to see a doctor" guidance. Reassuring tone, not diagnostic.
- **Tone:** Calm, trustworthy, patient-centric. The opposite of WebMD.

### Case 4 — Codex IDE (AI Coding Assistant)

- **Domain:** Developer tools
- **Aesthetic:** Pure developer-tool craft. Near-black background `#0D1117` (GitHub dark), IDE chrome aesthetic, JetBrains Mono everywhere, syntax-highlighted code blocks, subtle teal `#7DD3FC` glow accents. Dense.
- **Hero:** A full IDE mockup with a "ghost completion" animating in real-time — text appears, AI suggests gray code, user accepts. Loop.
- **Interactive demo:** A simulated editor where typing triggers AI suggestions; you can tab-complete or escape; a side panel shows "Codex is reasoning…" with bulleted reasoning steps.
- **Tone:** For pros. Confident, fast, no-nonsense.

### Case 5 — Wavelet (AI Voice / Audio Studio)

- **Domain:** Audio production / voice synthesis
- **Aesthetic:** Brutalist gradient. Bold oversized type (Druk or similar), spectrum gradient backgrounds (cyan → magenta → orange), aggressive contrast. Audio-waveform motifs everywhere.
- **Hero:** A massive animated waveform that responds to a "Play" button. Headline "Sound, rewritten." in display type.
- **Interactive demo:** Three audio sample chips ("Whisper", "Anthem", "Cinematic"). Clicking plays a short loop and the waveform visualizes in real time using Web Audio API (or pre-rendered animation if API too complex).
- **Tone:** Loud, creative, expressive.

### Case 6 — Lumen (AI Image Generator)

- **Domain:** Generative imagery / creative
- **Aesthetic:** Magazine / gallery. Full-bleed editorial photography, oversized serifs (Playfair Display), generous white margins, sophisticated.
- **Hero:** A grid of 6-9 stunning images (Unsplash with AI-themed search), with a single oversized italic serif headline overlay.
- **Interactive demo:** A prompt input + "Generate" button. On submit, a placeholder image swaps in from a pre-loaded gallery with a brief shimmer transition (no real AI — just curated swaps based on prompt keywords).
- **Tone:** Curatorial, aesthetic, gallerist.

### Case 7 — Quill Tutor (AI Education)

- **Domain:** K-12 / language learning
- **Aesthetic:** Warm pastels, friendly geometric illustrations (custom SVG), rounded buttons, playful but not childish. Nunito or DM Sans. Coral, lavender, soft yellow.
- **Hero:** Friendly illustration of a creature/character + headline "Learn at your own rhythm." Bouncy micro-interactions.
- **Interactive demo:** A 3-step mini quiz ("What is the past tense of 'go'?"). Multiple choice. Correct answer = celebration (confetti or character animation). Wrong = gentle hint.
- **Tone:** Warm, supportive, joyful.

### Case 8 — Atrium Research (AI Academic Research Tool)

- **Domain:** Academic / research / knowledge work
- **Aesthetic:** Paper-feeling cream `#F5F1E8`, classic book typography (Crimson Pro or Lora serif), letterpress-feel small caps section labels, marginalia annotations, footnotes as design element.
- **Hero:** A "page" layout with two columns — left an excerpt, right marginal AI-generated notes appearing.
- **Interactive demo:** Search input. Type a research topic → results panel populates with 4-5 paper citations (faked), each with a "Synthesize" button that produces a 2-sentence summary in marginalia style.
- **Tone:** Erudite, considered, slow, deep.

### Case 9 — Hivemind (AI Agents Orchestration Platform)

- **Domain:** Multi-agent AI infrastructure
- **Aesthetic:** Futuristic but not cliché. Deep indigo `#0F0F23` background, neon cyan/violet accents, abstract 3D-feel SVG node graph, monospace UI labels, glassmorphism panels.
- **Hero:** An animated node graph (SVG with JS) where nodes pulse and connect, showing "agents communicating".
- **Interactive demo:** A "compose a workflow" panel where you drag (or just click to add) agent blocks (Research → Summarize → Email). Workflow visualizes as a connected graph. "Run" button triggers a simulated execution with status updates per node.
- **Tone:** Sophisticated infrastructure for the AI-native era.

### Case 10 — Avatara (AI Virtual Influencer Agency) — **inspired by ai-content.agency**

- **Domain:** AI-generated content creators / influencer marketing
- **Aesthetic:** Minimalist. Pure white background, sharp black typography (Inter / Söhne), single neon green accent `#C5F02E` (or electric cyan), emoji as functional UI elements, oversized hero text.
- **Hero:** Massive headline "We create AI creators for your brand." Bold sans, tight tracking. Subhead: "Virtual content. Real reach. Zero filming."
- **Industries strip:** Horizontal row of cards with emoji icons (🤖 Tech, ₿ Crypto, 💄 Beauty, 🏋️ Fitness, etc.) — direct nod to ai-content.agency pattern.
- **Interactive demo:** **Reach Calculator.** Two sliders (number of avatars, posts/week) → an animated number updates ("Projected monthly reach: 4.2M"). Plus a small carousel of "case studies" (faked virtual influencer cards with stats).
- **Tone:** Tech-forward, optimistic, daring.

## Showcase Card Design (Hub)

Each card on the hub showcase grid should:
- Use the case's own primary color as a tint or block
- Show case name, niche label, and a 1-sentence positioning
- Include a tiny "preview thumbnail" — a stylized 4-5 element representation of the case's hero (NOT a full screenshot — a minimal stylized signature)
- Hover state: reveals "Open →" link

The cards together should look like a printed grid of 10 different magazine covers — each is unmistakably from a different world, but the grid composition is consistent.

## Designer Notes Panel (each case)

A floating "i" button in the bottom-right of every case page opens a side panel from the right (≈ 380px wide on desktop, full-screen modal on mobile). Contents:

- Product blurb (2-3 sentences)
- **Target user** — who is this for?
- **Design decisions** — bulleted list of why I chose this palette, typography, layout
- **What I was trying to communicate** — the emotional/positioning goal
- Link back to portfolio

This is what makes it a portfolio rather than a demo collection.

## Performance & Quality Bar

- Each page loads in under 1.5s on a fast connection.
- No layout shift after initial load.
- Mobile-first responsive (320px minimum width).
- Lighthouse ≥ 90 on Performance & Accessibility for hub + at least the 3 Stage-1 cases.
- Semantic HTML (proper headings, landmarks, alt text).
- Respect `prefers-reduced-motion` for all animations.

## Implementation Stages

The work is broken into **3 stages**, each deployable.

### Stage 1 — Hub + 3 Flagship Cases
- Hub (full design, 10 placeholder cards with case data filled in)
- Case 2: Tradesight
- Case 4: Codex IDE
- Case 9: Hivemind

These 3 cases represent the most visually striking aesthetic poles: terminal/data, dev-tool, futuristic. Demonstrates range.

**Deliverable:** Live at `amazurin-creator.github.io` with 3 cases linked + 7 "Coming soon" placeholders.

### Stage 2 — 4 More Cases
- Case 1: LexCounsel
- Case 5: Wavelet
- Case 8: Atrium Research
- Case 10: Avatara (ai-content.agency reference)

### Stage 3 — Final 3 + Polish
- Case 3: Clarity Health
- Case 6: Lumen
- Case 7: Quill Tutor
- Cross-browser QA, Lighthouse pass, OG tags & meta, favicon, sitemap.

## Risks & Open Questions

- **Risk:** 10 deeply different designs is a lot of bespoke CSS — risk of inconsistent quality. **Mitigation:** Strict adherence to the per-case structural pattern (hero / features / demo / footer / notes) ensures predictable scope per case.
- **Risk:** Some interactive demos require non-trivial JS (Wavelet audio, Hivemind graph). **Mitigation:** All demos must degrade gracefully to static if JS fails.
- **Open:** Should each case show in repo file listing or use a different deployment trick? **Decision:** All in same repo. Single tree is simplest and visible at `github.com/amazurin-creator/amazurin-creator.github.io`.
- **Open:** OG image strategy — single hub OG, or per-case OG? **Decision:** Per-case OG, generated as part of Stage 3 polish.

## Definition of Done

- All 10 cases live and navigable from hub
- Each case has working interactive demo
- Each case has Designer Notes panel
- All pages Lighthouse ≥ 90 on Perf + A11y
- Repo is public, README explains the project, site loads at `amazurin-creator.github.io`
