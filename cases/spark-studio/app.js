// Spark Studio — Campaign Brief Generator
// The page is the product: three taps build a real, culturally-fluent brief.
//
// Architecture:
//   STATE         — { vertical, goal, hook }
//   BRIEFS        — hand-authored hook lines indexed by `${vertical}:${hook}`
//                   covering 5-6 strong combinations; the rest fall back to a
//                   sharp generic so the demo never feels broken.
//   OPENINGS      — vertical-keyed 3-second cold-opens
//   COPY          — goal-keyed bundles of 3 angled ad-copy variants
//   CAPTIONS      — hook-keyed bundles of 4 TikTok-grammar captions
//   MUSIC         — vertical-keyed 3 music vibes
//   THUMBS        — hook-keyed 1-line concept descriptions
//   TITLE         — vertical+goal headline for the brief card

const STATE = { vertical: 'dtc', goal: 'awareness', hook: 'confession' };

const BRIEFS = {
  // DTC
  'dtc:confession':  "I didn't believe a $24 candle could change a room. It did.",
  'dtc:stat':        "73% of new DTC buyers never come back. Here's the one that did.",
  'dtc:question':    "What if your favourite brand cost less than your coffee?",
  'dtc:story':       "Three months ago, this was a Shopify draft. Today: 1.2M units.",
  'dtc:demo':        "One bottle. Three drops. Six weeks. That's the whole pitch.",

  // Fitness
  'fitness:confession': "I trained six days a week for two years. This 12-minute fix beat all of it.",
  'fitness:stat':       "90% of you are doing rows wrong. The 1-second fix adds 40lb to your pull.",
  'fitness:question':   "What if your warm-up was already the workout?",
  'fitness:story':      "I quit my gym, kept the habit, and got stronger anyway.",
  'fitness:demo':       "Watch the bar path. That's the difference between a PR and a plateau.",

  // Beauty
  'beauty:confession': "I used to spend $400 a month on skincare. Now I use four products.",
  'beauty:stat':       "The average routine is 11 steps. Yours doesn't need to be three.",
  'beauty:question':   "What if your makeup didn't change when the lighting did?",
  'beauty:story':      "From breakouts to a magazine cover in eight weeks — no retouch.",
  'beauty:demo':       "Watch the second the tint hits. No edit. No filter. Just the product.",

  // SaaS
  'saas:confession': "I run a 30-person team. I still take notes in this app like it's 2021.",
  'saas:stat':       "Engineers waste 38 minutes a day chasing context. That's 158 hours a year.",
  'saas:question':   "What would you ship if your tools didn't fight you?",
  'saas:story':      "We built our entire Series A deck in this thing in a weekend.",
  'saas:demo':       "Type one sentence. Watch it become a project plan in real time.",

  // Fintech
  'fintech:confession': "I overdrafted every payday for six years. This app stopped it in one tap.",
  'fintech:stat':       "$11B in late fees were collected last year. The fix took us a weekend.",
  'fintech:question':   "What's the move if your money worked harder than you did?",
  'fintech:story':      "From maxed-out cards to fully paid in 14 months. No side hustle.",
  'fintech:demo':       "Move money in 0.4 seconds. That's the whole product.",

  // Gaming
  'gaming:confession': "I played 84 hours last weekend. My partner thinks I'm a hero.",
  'gaming:stat':       "Average match queue: 4m 12s. Ours is 11 seconds. That's the post.",
  'gaming:question':   "What if your next main was a game your friends already owned?",
  'gaming:story':      "Started as a mod. Ended as a 2M-player live service.",
  'gaming:demo':       "First minute of gameplay. Sound on. No cuts. No commentary.",
};

const OPENINGS = {
  dtc: [
    "Close-up unboxing on a kitchen counter, golden hour.",
    "Beat drops the second the lid comes off — show the product in hand by 0:02."
  ],
  fitness: [
    "Hard cut from gym mirror to the exact moment of the lift.",
    "Caption appears as the bar leaves the floor — no voiceover until 0:04."
  ],
  beauty: [
    "Bare-faced front camera, natural light, no filter, no caption yet.",
    "Product enters frame at 0:02 — single tap on the skin, hold for two beats."
  ],
  saas: [
    "Laptop screen, cursor blinking on an empty prompt.",
    "One typed sentence becomes a populated dashboard before the music drops."
  ],
  fintech: [
    "Phone in hand at a checkout counter — handheld, real shop, real sound.",
    "Card declined → app opens → balance updates → second tap clears it. 3 seconds flat."
  ],
  gaming: [
    "Raw lobby footage, voice chat audible, no cut.",
    "Match ends with the kill cam — caption lands the instant the screen blacks out."
  ],
};

const COPY = {
  awareness: {
    base: [
      "Direct: state the category clearly. Who you are, what you do, why it matters now.",
      "Emotional: lead with the feeling, not the feature. The product comes in at the relief.",
      "Contrarian: name what everyone else is selling, then say what you sell instead."
    ],
  },
  conversion: {
    base: [
      "Direct: the deal, the deadline, the one-tap link. No fluff above the CTA.",
      "Social proof: stitch a customer quote into the opening, let the product close it.",
      "Risk-reversal: free trial, no card, cancel any time. Say all three out loud."
    ],
  },
  retention: {
    base: [
      "Direct: speak to existing users. New feature, new tier, new reason to log back in.",
      "Story: a power user's week, with the product in the background of every clip.",
      "Community: tag three accounts you already follow. Make it a quiet flex."
    ],
  },
};

const CAPTIONS = {
  confession: [
    "ok i'll say it 👀",
    "this is embarrassing but it worked 💀",
    "calling myself out so you don't have to",
    "the dm i wish someone had sent me ✨"
  ],
  stat: [
    "the math is mathing 📈",
    "i wish i'd seen this number two years ago 🤯",
    "save this before they nerf it",
    "the data, unbothered 🔥"
  ],
  question: [
    "answer in the comments before you scroll 🤔",
    "no wrong answers (mostly)",
    "what would you do though 👇",
    "asking for me ✨"
  ],
  story: [
    "part 1/? probably 🎬",
    "this is the post that got everything started",
    "save this. tell me in 30 days.",
    "the timeline doesn't lie 💫"
  ],
  demo: [
    "no edit. no cut. no filter. 🎯",
    "press hold on the 4-second mark",
    "this is the part the others won't show you",
    "first time? watch twice 👀"
  ],
};

const MUSIC = {
  dtc: ["driving 4-on-the-floor", "warm vinyl pop", "sunset disco"],
  fitness: ["hard-hitting drill 808s", "epic build to drop", "trap minimal"],
  beauty: ["bedroom pop minor", "ethereal R&B", "soft-house slow burn"],
  saas: ["lofi cosmic", "minimal techno", "ambient piano with a kick"],
  fintech: ["confident future-funk", "clean house with a bassline", "boardroom hip-hop"],
  gaming: ["phonk pressure", "synthwave acceleration", "dnb with a vocal chop"],
};

const THUMBS = {
  confession: "Subject mid-blink, soft light, single hand-written caption overlay top-left.",
  stat:       "Giant number filling 70% of the frame, product visible in negative space.",
  question:   "Eye-line tight to camera, one question word in punch-out type behind the head.",
  story:      "Two-frame split: 'before' on the left in low contrast, 'after' on the right in colour.",
  demo:       "Close-up product shot, no humans, hand entering frame from the right at 0:01.",
};

const TITLES = {
  awareness:  { dtc: "First impression, fully loaded.",     fitness: "The post that opens the gym door.",    beauty: "A face the algorithm remembers.",      saas: "Make the tool look obvious.",         fintech: "Trust, in fifteen seconds.",      gaming: "Player one, hooked." },
  conversion: { dtc: "The cart-closer.",                     fitness: "Sign-up by Sunday night.",             beauty: "From scroll to checkout.",             saas: "The 'start free' that lands.",         fintech: "Move money. Move them now.",        gaming: "The install in one tap." },
  retention:  { dtc: "Bring them back for the second order.", fitness: "Week 5 — the post that keeps them.",  beauty: "Refill before they forget.",           saas: "Tell power users you see them.",       fintech: "The notification they don't mute.", gaming: "Reactivation, without the discount." },
};

// ─── DOM ─────────────────────────────────────────────────────────────
const out = {
  tag:      document.getElementById('sp-brief-tag'),
  title:    document.getElementById('sp-brief-title'),
  id:       document.getElementById('sp-brief-id'),
  hook:     document.getElementById('sp-out-hook'),
  opening:  document.getElementById('sp-out-opening'),
  copy:     document.getElementById('sp-out-copy'),
  captions: document.getElementById('sp-out-captions'),
  music:    document.getElementById('sp-out-music'),
  thumb:    document.getElementById('sp-out-thumb'),
};
const briefEl = document.getElementById('sp-brief');
const hintEl  = document.getElementById('sp-hint');
const generateBtn = document.getElementById('sp-generate');

// ─── Pill groups ─────────────────────────────────────────────────────
document.querySelectorAll('.sp-pills').forEach((group) => {
  const key = group.dataset.group; // vertical | goal | hook
  group.addEventListener('click', (e) => {
    const pill = e.target.closest('.sp-pill');
    if (!pill || !group.contains(pill)) return;
    group.querySelectorAll('.sp-pill').forEach((p) => {
      const active = p === pill;
      p.classList.toggle('is-active', active);
      p.setAttribute('aria-checked', active ? 'true' : 'false');
    });
    STATE[key] = pill.dataset.value;
    refreshHint();
  });
});

function refreshHint() {
  hintEl.textContent = `${labelOf('vertical', STATE.vertical)} · ${labelOf('goal', STATE.goal)} · ${labelOf('hook', STATE.hook)} — ready to generate.`;
}

function labelOf(group, value) {
  const el = document.querySelector(`[data-group="${group}"] [data-value="${value}"]`);
  if (!el) return value;
  // strip leading emoji + whitespace, keep the word
  return el.textContent.replace(/^\s*\S+\s+/, (m) => /\p{Emoji}/u.test(m) ? '' : m).trim();
}

// ─── Generate ────────────────────────────────────────────────────────
let briefCounter = 1024;

generateBtn.addEventListener('click', () => {
  briefCounter += 1;
  briefEl.classList.add('is-loading');
  briefEl.setAttribute('aria-busy', 'true');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay = reduceMotion ? 0 : 360;

  setTimeout(() => {
    render();
    briefEl.classList.remove('is-loading');
    briefEl.classList.add('is-ready');
    briefEl.setAttribute('aria-busy', 'false');
    if (!reduceMotion) briefEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, delay);
});

function render() {
  const { vertical, goal, hook } = STATE;

  const hookLine = BRIEFS[`${vertical}:${hook}`] ?? fallbackHook(vertical, hook);
  const opening  = OPENINGS[vertical] ?? OPENINGS.dtc;
  const copy     = (COPY[goal] ?? COPY.awareness).base;
  const captions = CAPTIONS[hook] ?? CAPTIONS.confession;
  const music    = MUSIC[vertical] ?? MUSIC.dtc;
  const thumb    = THUMBS[hook] ?? THUMBS.confession;
  const title    = (TITLES[goal] && TITLES[goal][vertical]) ?? "Ship the brief.";

  out.tag.textContent   = `${labelOf('vertical', vertical)} · ${labelOf('goal', goal)} · ${labelOf('hook', hook)}`;
  out.title.textContent = title;
  out.id.textContent    = `SPK-${String(briefCounter).padStart(4, '0')}`;
  out.hook.textContent  = `"${hookLine}"`;

  out.opening.innerHTML = opening.map((line) => `<span>${escapeHtml(line)}</span>`).join('<br>');

  out.copy.innerHTML = copy.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  out.captions.innerHTML = captions.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  out.music.innerHTML = music.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  out.thumb.textContent = thumb;
}

function fallbackHook(vertical, hook) {
  // Hooks are the load-bearing line; always return something punchy.
  const verticalWord = ({
    dtc: "the product", fitness: "your training", beauty: "your routine",
    saas: "your workflow", fintech: "your money", gaming: "your night",
  })[vertical] ?? "the thing";
  const lookup = {
    confession: `I never said this out loud, but ${verticalWord} changed everything.`,
    stat:       `92% of people scroll past this. The other 8% just keep ${verticalWord}.`,
    question:   `What would you do if ${verticalWord} actually worked the first time?`,
    story:      `It started with one bad day. Then ${verticalWord} got better.`,
    demo:       `Watch ${verticalWord} in real time. No edit. No filter.`,
  };
  return lookup[hook] ?? `Spark just rewrote ${verticalWord}.`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Initial hint reflects defaults; do not auto-fill the brief — the click is the proof.
refreshHint();
