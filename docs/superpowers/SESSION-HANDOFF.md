# Session Handoff — 2026-06-07

If you're a fresh Claude picking this up: read this first. The portfolio is live and the user (Artemey) may resume work from another device.

## Live

- Production: <https://amazurin-creator.github.io>
- Repo: `amazurin-creator/amazurin-creator.github.io` (public)
- Local clone: `~/personal/amazurin-creator.github.io`
- Deploy: push to `main`. GitHub Pages auto-builds in ~30s.

## What's there now (15 cases)

**Featured (top of hub):**
- `/cases/atelier/` — 4-page bilingual production product (landing / onboarding / dashboard / 12-slide pitch). RU/EN toggle with 🌐 globe + first-visit pulse. The only case in the portfolio with multiple pages.

**Ten Studies** (conceptual AI verticals, each with bespoke aesthetic + interactive demo + Designer Notes panel):
1. `/cases/tradesight/` — Bloomberg terminal, JetBrains Mono, amber/green/red
2. `/cases/codex-ide/` — GitHub-dark IDE chrome, ghost-completion typing
3. `/cases/hivemind/` — Indigo + cyan neon, animated SVG node graph, workflow composer
4. `/cases/lexcounsel/` — Editorial law-firm: navy/ivory/gold, Cormorant Garamond, chat-sim with inline citations
5. `/cases/clarity-health/` — Soft mint, Inter, calm symptom selector
6. `/cases/wavelet/` — Brutalist gradients, Archivo Black, Web Audio API synth (3 patches)
7. `/cases/lumen/` — Cream + bronze + black, Playfair italics, Picsum-seeded gallery
8. `/cases/quill-tutor/` — Warm pastels, Nunito, mini-quiz with confetti
9. `/cases/atrium/` — Letterpress cream paper, Crimson Pro, marginalia + dropcaps
10. `/cases/avatara/` — Minimalist white + neon green, Reach Calculator (ai-content.agency-inspired per user request)

**Visiting cards · solo brands:**
- `/cases/kira/` — IBM Plex Serif, single-column personal site for an ML engineer
- `/cases/stellar/` — Cream + navy + gold, Cormorant Garamond, solo VC fund prospectus

**Marketing · growth:**
- `/cases/cadence/` — Teal SaaS, live subject-line A/B scorer with 9 keyword strategies
- `/cases/spark-studio/` — Hot neon + Anton, Campaign Brief generator with 30 vertical×hook lookups

## Hub structure

1. Hero — `Artemey Mazurin — I build products with AI design / code.`
2. Featured Atelier card (with "ИЗБРАННЫЙ · В ПРОДЕ" tag)
3. Showcase grid — 10 studies
4. "Visiting cards · solo brands" — Kira, Stellar
5. "Marketing · growth pages" — Cadence, Spark Studio
6. **Track record / В проде** — plain typographic list of 10 real production projects (genericized, no internal names)
7. About — "Products at any scale"
8. Contact — email, telegram (@Artemeyone), github

## Key user-stated positioning

The user is **NOT a designer-by-profession**. He's:
- "AI Automation / AI-native" engineer
- Builds AI products and automations end-to-end
- Also designs the sites that go with them
- Based in Cyprus

Do not refer to him as "a designer". The cases are examples of sites he makes; the Track record section is his real production work.

## Critical user feedback received (rules going forward)

| Feedback | Rule |
|---|---|
| "Я не дизайнер" | Position as AI builder, not designer. Avoid "designer of X" phrasing. |
| "Единственный работающий продукт — это не правда, у меня много в проде" | Don't claim Atelier is the only shipping product. Many production projects exist. |
| "Слишком много AI и бесполезной нагрузки" | Lean copy. AI only where it carries meaning (hero method, specific niches). |
| "Убери конфиденциальную инфу" | No internal product names (MedLang, MedGerman, MedEnglish, Doxa, PeakTalk), no vendor stack mentions (Intercom, OpenAI, Slack) in the Track record section. |
| Atelier toggle wasn't visible | Made bigger, globe icon, drop shadow, first-visit pulse |
| LexCounsel practice list broke (1 word per line) | Fixed with grid-template-areas. Always check CSS grid auto-placement. |
| LexCounsel demo too slow | Type only P1, fade P2/P3 + citations |

## Tech stack & conventions

- **Pure static** HTML + CSS + vanilla JS. No build step.
- **Each case** is self-contained in `/cases/<slug>/` with its own `index.html`, `styles.css`, `app.js`
- **Shared:** `/shared/notes-panel.{css,js}` for the Designer Notes side panel
- **CSS pattern:** every case defines `:root` custom properties including `--notes-accent` and `--notes-accent-fg`
- **HTML pattern:** every case has `<template id="designer-notes">` with structured commentary (What is this? / Who is it for? / Design decisions / What I wanted to communicate)
- **i18n pattern:** `<span data-lang="en">EN text</span><span data-lang="ru">RU text</span>`, hidden via CSS based on `html[lang]`. JS in `/app.js` toggles `html[lang]` and persists in `localStorage` (`portfolio-lang` key + `portfolio-lang-hint-seen`)
- **Mobile:** every case has `@media (max-width: 900px)` or similar; LexCounsel + hub have additional 600px breakpoints
- **Reduced motion:** every case has `@media (prefers-reduced-motion: reduce)`

## Important files

- `index.html` — hub (bilingual via data-lang spans, ~530 lines)
- `styles.css` — hub CSS (~770 lines incl. preview blocks for all 15 cards)
- `app.js` — smooth scroll + language toggle + first-visit pulse
- `shared/notes-panel.{css,js}` — Designer Notes panel scaffolding
- `cases/<slug>/` — each case standalone
- `docs/superpowers/specs/2026-06-06-ai-portfolio-design.md` — original spec
- `docs/superpowers/plans/2026-06-06-stage-1-implementation.md` — Stage 1 plan (Stages 2/3 done without separate plan docs)

## What might come next

User has not committed to specific next steps. Possible directions:
- Polish pass on individual cases (Lighthouse, OG tags, favicons)
- More cases (different verticals, different categories)
- Custom domain (currently `amazurin-creator.github.io`)
- Analytics
- More content under About (longer bio, projects timeline)

Ask before doing.

## How to resume

```bash
cd ~/personal/amazurin-creator.github.io
git pull
python3 -m http.server 8000  # local dev
# edits → git push → GitHub Pages auto-builds in ~30s
```

To verify a live deployment built:
```bash
gh api repos/amazurin-creator/amazurin-creator.github.io/pages/builds/latest --jq '{commit, status}'
```

## Auto-memory references

The user's auto-memory has:
- `project_ai_portfolio.md` — this project
- `project_atelier.md` — the Atelier product (featured case)
- `user_profile.md` — user is Russian-speaking, Cyprus-based, AI automation engineer
