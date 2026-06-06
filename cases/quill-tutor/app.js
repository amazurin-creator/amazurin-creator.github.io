// Quill Tutor — interactive mini-quiz.
// Three questions across three subjects. Wrong answers earn a hint and
// allow re-attempt; correct answers celebrate, then auto-advance.

const questions = [
  {
    tag: 'Math · Question 1 of 3',
    text: "What's 7 × 8?",
    options: ['52', '56', '63', '48'],
    correct: 1,
    hint: 'Almost. Hint: think about doubling — 7 × 4 is 28. So 7 × 8 is twice that.',
  },
  {
    tag: 'Science · Question 2 of 3',
    text: 'Which planet is closest to the sun?',
    options: ['Earth', 'Mars', 'Mercury', 'Venus'],
    correct: 2,
    hint: 'Almost. Hint: think about the planet named after a Roman messenger god — the fastest one.',
  },
  {
    tag: 'Language · Question 3 of 3',
    text: "What's the past tense of \"go\"?",
    options: ['goed', 'went', 'gone', 'going'],
    correct: 1,
    hint: 'Almost. Hint: this verb is irregular — the past tense looks nothing like the present.',
  },
];

const optionColors = ['coral', 'lavender', 'yellow', 'mint'];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const elCard = document.getElementById('quiz-card');
const elCharacter = document.getElementById('quiz-character');
const elConfetti = document.getElementById('confetti');
const elPrompt = document.getElementById('prompt-line');

const CARD_HTML = `
  <div class="qt-progress">
    <span class="qt-dot" data-step="1"></span>
    <span class="qt-dot" data-step="2"></span>
    <span class="qt-dot" data-step="3"></span>
  </div>
  <p class="qt-question-tag" id="question-tag"></p>
  <h3 class="qt-question" id="question-text"></h3>
  <div class="qt-options" id="options"></div>
  <p class="qt-hint" id="hint" hidden></p>
`;

let currentIndex = 0;
let attemptedWrong = new Set();
let advanceTimer = null;

function rebuildCard() {
  elCard.innerHTML = CARD_HTML;
}

function renderQuestion(i) {
  const q = questions[i];

  // Ensure card has its standard internals (after a restart, etc.).
  if (!elCard.querySelector('#question-tag')) {
    rebuildCard();
  }

  const tag = elCard.querySelector('#question-tag');
  const text = elCard.querySelector('#question-text');
  const options = elCard.querySelector('#options');
  const hint = elCard.querySelector('#hint');
  const dots = Array.from(elCard.querySelectorAll('.qt-dot'));

  // Reset card state.
  elCard.classList.remove('correct', 'done');
  hint.hidden = true;
  hint.textContent = '';
  attemptedWrong = new Set();

  // Progress dots.
  dots.forEach((dot, idx) => {
    dot.classList.remove('active', 'done');
    if (idx < i) dot.classList.add('done');
    else if (idx === i) dot.classList.add('active');
  });

  tag.textContent = q.tag;
  text.textContent = q.text;
  text.classList.remove('celebration');

  // Build options.
  options.innerHTML = '';
  q.options.forEach((label, idx) => {
    const btn = document.createElement('button');
    btn.className = `qt-option qt-option-${optionColors[idx]}`;
    btn.type = 'button';
    btn.innerHTML = `<span class="qt-option-bullet">${String.fromCharCode(65 + idx)}</span><span>${label}</span>`;
    btn.addEventListener('click', () => handleAnswer(idx, btn));
    options.appendChild(btn);
  });
}

function handleAnswer(idx, btn) {
  const q = questions[currentIndex];
  if (btn.disabled) return;

  if (idx === q.correct) {
    onCorrect(btn);
  } else {
    onWrong(btn, idx, q);
  }
}

function onCorrect(btn) {
  const options = elCard.querySelector('#options');
  const tag = elCard.querySelector('#question-tag');
  const text = elCard.querySelector('#question-text');
  const hint = elCard.querySelector('#hint');
  const dots = Array.from(elCard.querySelectorAll('.qt-dot'));

  // Disable all options.
  options.querySelectorAll('.qt-option').forEach(o => { o.disabled = true; });
  btn.classList.add('correct');

  // Celebrate character + confetti.
  triggerCelebration();

  // Update prompt line.
  elPrompt.textContent = 'Nice. Keep going.';

  // After a beat, morph card into success state.
  setTimeout(() => {
    elCard.classList.add('correct');
    text.textContent = 'Nice.';
    text.classList.add('celebration');
    tag.textContent = 'Correct answer';
    options.innerHTML = '';
    hint.hidden = true;
  }, 320);

  // Mark current dot as done.
  if (dots[currentIndex]) {
    dots[currentIndex].classList.remove('active');
    dots[currentIndex].classList.add('done');
  }

  clearTimeout(advanceTimer);
  advanceTimer = setTimeout(() => {
    currentIndex += 1;
    if (currentIndex >= questions.length) {
      renderDone();
    } else {
      renderQuestion(currentIndex);
      elPrompt.textContent = 'Pick the answer that feels right. Wrong picks just earn you a hint.';
    }
  }, prefersReducedMotion ? 600 : 1300);
}

function onWrong(btn, idx, q) {
  if (attemptedWrong.has(idx)) return;
  attemptedWrong.add(idx);

  const hint = elCard.querySelector('#hint');

  btn.classList.add('wrong');
  triggerShake();

  hint.textContent = q.hint;
  hint.hidden = false;

  elPrompt.textContent = 'No rush. Take another look.';

  // After the highlight fades, dim the wrong choice but keep it visible.
  setTimeout(() => {
    btn.classList.remove('wrong');
    btn.disabled = true;
  }, 700);
}

function triggerCelebration() {
  if (prefersReducedMotion) return;
  elCharacter.classList.remove('celebrate');
  void elCharacter.offsetWidth; // force reflow to restart animation
  elCharacter.classList.add('celebrate');
  spawnConfetti();
}

function triggerShake() {
  if (prefersReducedMotion) return;
  elCharacter.classList.remove('shake');
  void elCharacter.offsetWidth;
  elCharacter.classList.add('shake');
  setTimeout(() => elCharacter.classList.remove('shake'), 400);
}

function spawnConfetti() {
  const colors = ['#FF8E72', '#C2A0E8', '#FFD571', '#9DDEC1', '#FFB6A0'];
  const count = 16;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'qt-confetti-piece';
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const distance = 90 + Math.random() * 70;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 30; // bias upward
    const size = 8 + Math.random() * 10;
    const color = colors[i % colors.length];
    const shape = Math.random();

    piece.style.setProperty('--dx', `${dx}px`);
    piece.style.setProperty('--dy', `${dy}px`);
    piece.style.setProperty('--rot', `${Math.round((Math.random() - 0.5) * 720)}deg`);
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;
    piece.style.background = color;
    if (shape > 0.66) {
      piece.style.borderRadius = '4px';
    } else if (shape > 0.33) {
      piece.style.borderRadius = '50%';
    } else {
      piece.style.borderRadius = '2px';
      piece.style.height = `${size * 0.4}px`;
    }
    piece.style.animationDelay = `${Math.random() * 80}ms`;

    elConfetti.appendChild(piece);
    setTimeout(() => piece.remove(), 1300);
  }
}

function renderDone() {
  elCard.classList.remove('correct');
  elCard.classList.add('done');
  elCard.innerHTML = `
    <div class="qt-progress">
      <span class="qt-dot done"></span>
      <span class="qt-dot done"></span>
      <span class="qt-dot done"></span>
    </div>
    <span class="qt-done-star" aria-hidden="true">★</span>
    <h3 class="qt-done-title">Done.</h3>
    <p class="qt-done-sub">Three questions, three subjects. That's the rhythm.</p>
    <div class="qt-done-cta">
      <a class="qt-btn qt-btn-primary qt-btn-lg" href="#cta">Want more like this? Try Quill free →</a>
      <button class="qt-btn qt-btn-ghost" type="button" id="restart-quiz">Try again</button>
    </div>
  `;
  elPrompt.textContent = 'Curiosity wins. Always.';

  // One more celebration on completion.
  triggerCelebration();
  setTimeout(spawnConfetti, 300);

  const restartBtn = document.getElementById('restart-quiz');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentIndex = 0;
      rebuildCard();
      renderQuestion(0);
      elPrompt.textContent = 'Pick the answer that feels right. Wrong picks just earn you a hint.';
    });
  }
}

// Initial render.
renderQuestion(0);
