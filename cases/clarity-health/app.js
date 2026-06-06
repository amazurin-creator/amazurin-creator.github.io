// Clarity Health — symptom selector demo.
// Selecting chips updates a result card with thoughtful, non-alarming content
// keyed primarily on the body location. Quality and duration nudge severity.

const RESULTS = {
  head: {
    title: 'Headaches are common — and almost always benign.',
    summary: "Most headaches resolve on their own. Reading them as a pattern, rather than a single event, is usually the most useful thing you can do.",
    explanations: [
      'Tension headache — the most common type, usually tied to posture, screens, or jaw clenching.',
      'Dehydration or skipped meals — surprisingly often the only cause, especially mid-afternoon.',
      'Migraine — particularly if there is a one-sided throb, light sensitivity, or visual aura.'
    ],
    doctor: "Call your doctor within a day if your headache is the worst you've ever felt, came on like a thunderclap, follows a head injury, or comes with weakness, confusion, fever, or vision changes.",
    doctorFoot: 'Otherwise: a same-week appointment is reasonable if headaches have become more frequent.',
    now: [
      'Drink a full glass of water and sit somewhere with low light.',
      'Note when it started, what you ate, and how you slept — patterns are the most useful evidence.',
      'A short walk or a warm compress on the neck helps many tension headaches.'
    ]
  },
  chest: {
    title: 'Chest sensations deserve attention — without assumption.',
    summary: "Chest discomfort has many causes, most of them not cardiac. Severity, character, and what makes it better are the things a clinician will ask about first.",
    explanations: [
      'Muscular or rib strain — common after lifting, coughing, or sleeping awkwardly. Often reproducible by pressing.',
      'Acid reflux — burning behind the breastbone, often worse lying down or after large meals.',
      'Anxiety-related tightness — a real physical sensation, frequently mistaken for something more serious.'
    ],
    doctor: "Call 911 — not your doctor — if chest pain is crushing, radiates to the arm, jaw, or back, or comes with shortness of breath, sweating, or nausea. This is the single symptom we ask you to treat as urgent.",
    doctorFoot: 'For milder, recurring chest discomfort: book a same-week appointment.',
    elevated: true,
    now: [
      'Sit upright in a quiet place and breathe slowly for two minutes — note whether the sensation changes.',
      'Try to describe the feeling in one word: tight, sharp, burning, heavy. Each points somewhere different.',
      'If you take aspirin and have been told it is safe for you, keep it within reach while you decide what to do.'
    ]
  },
  stomach: {
    title: 'Stomach discomfort: usually transient, usually digestive.',
    summary: "Most abdominal symptoms resolve in a day or two without anything specific. The location and the timing relative to food are the most informative signals.",
    explanations: [
      'Indigestion or gastritis — often after rich, spicy, or unfamiliar food, or with stress.',
      'Mild viral gastroenteritis — particularly if there is nausea, loose stool, or someone close to you has had similar.',
      'Constipation — surprisingly often the source of dull abdominal aches, especially on the lower left.'
    ],
    doctor: "See a doctor promptly if pain is severe and localised to the lower right, if you notice blood, if you have a high fever, or if symptoms persist beyond 48 hours without improvement.",
    doctorFoot: "Pregnant? Always call your provider for new abdominal pain — don't wait it out.",
    now: [
      'Sip water in small amounts and avoid solid food for an hour or two.',
      'A bland next meal — toast, rice, banana — is gentler than fighting through your usual diet.',
      'Note where the pain is, where it travels, and what makes it better. Bring that to any appointment.'
    ]
  },
  back: {
    title: 'Back pain is almost universal — and usually self-limiting.',
    summary: "Roughly eight in ten adults will have meaningful back pain at some point. The reassuring truth is that most episodes resolve on their own within a few weeks, regardless of what's done.",
    explanations: [
      'Muscle strain — the most common cause, usually from a single movement or sustained posture.',
      'Disc-related pain — especially if there is a sharp component that travels down a leg.',
      'Postural / ergonomic — a pattern that builds across the workday and eases overnight.'
    ],
    doctor: "Book an appointment within a week if pain is severe, follows a fall, comes with leg weakness, numbness in the saddle area, or any loss of bladder or bowel control. Those last ones are urgent.",
    doctorFoot: 'For ordinary back pain, watchful waiting for 1–2 weeks is reasonable.',
    now: [
      'Keep moving gently — bed rest beyond a day tends to slow recovery, not speed it.',
      'Alternate brief walks with short rests. Avoid sitting in the same posture for more than 30 minutes.',
      'A warm shower or heating pad is often more useful than ice for muscular back pain.'
    ]
  },
  joints: {
    title: 'Joint discomfort: what it does is more useful than what it is.',
    summary: "Whether a joint is swollen, warm, red, or simply stiff tells a clinician far more than the pain itself. Pay attention to mornings versus evenings, and to one joint versus many.",
    explanations: [
      'Overuse or strain — particularly likely if a single joint is sore after new or unaccustomed activity.',
      'Osteoarthritis — stiffness that warms up with movement, usually in knees, hips, hands, or lower back.',
      'Inflammatory pattern — if multiple joints are involved, mornings are markedly worse, or there is swelling, this is worth a clinician’s eye.'
    ],
    doctor: "See a doctor within a week if a joint is hot, red, and swollen; if the pain followed an injury and you can't bear weight; or if more than one joint is affected with morning stiffness lasting more than an hour.",
    doctorFoot: 'Sudden fever with a swollen joint is urgent — call the same day.',
    now: [
      'Rest the joint from the activity that triggered it for a day or two.',
      'Note which joints are involved and when they hurt most — a simple morning/evening pattern is very informative.',
      'Gentle range-of-motion movement, within comfort, helps almost every cause.'
    ]
  }
};

const SUMMARY_NUDGES = {
  durationLong: " You've described it as lasting a while — that's a good reason to bring it up at your next appointment, even if it isn't urgent.",
  qualitySharp: " A sharp quality is worth noting precisely; clinicians find that word more informative than 'bad'.",
  qualityBurning: " A burning quality often points toward nerve or inflammatory causes — useful information for whoever you speak to next.",
  qualityTight: " A feeling of tightness frequently has a stress or muscular component, even when something else is also true."
};

const state = {
  location: null,
  quality: null,
  duration: null
};

const chipButtons = document.querySelectorAll('.ch-chip');
const resultEl = document.getElementById('ch-result');
const emptyEl = document.getElementById('ch-result-empty');
const bodyEl = document.getElementById('ch-result-body');
const titleEl = document.getElementById('ch-result-title');
const summaryEl = document.getElementById('ch-result-summary');
const explainEl = document.getElementById('ch-card-explain');
const doctorWrap = document.getElementById('ch-card-doctor-wrap');
const doctorEl = document.getElementById('ch-card-doctor');
const doctorFootEl = document.getElementById('ch-card-doctor-foot');
const nowEl = document.getElementById('ch-card-now');

chipButtons.forEach((btn) => {
  btn.setAttribute('aria-pressed', 'false');
  btn.addEventListener('click', () => {
    const axis = btn.dataset.axis;
    const value = btn.dataset.value;

    // Toggle behaviour: clicking the same chip clears it.
    if (state[axis] === value) {
      state[axis] = null;
      btn.setAttribute('aria-pressed', 'false');
    } else {
      state[axis] = value;
      document.querySelectorAll(`.ch-chip[data-axis="${axis}"]`).forEach((other) => {
        other.setAttribute('aria-pressed', other === btn ? 'true' : 'false');
      });
    }
    render();
  });
});

function render() {
  const { location, quality, duration } = state;
  const hasAny = location || quality || duration;

  if (!hasAny || !location) {
    // Need at least a location to give a meaningful read.
    if (hasAny && !location) {
      // User picked quality or duration but no location — show a softer prompt.
      showEmpty('Add a location to see a gentle reading.');
    } else {
      showEmpty('Pick a few signals to begin.');
    }
    return;
  }

  const data = RESULTS[location];
  if (!data) {
    showEmpty('Pick a few signals to begin.');
    return;
  }

  emptyEl.hidden = true;
  bodyEl.hidden = false;
  // Force reflow before adding visible class to retrigger the transition.
  void bodyEl.offsetWidth;
  bodyEl.classList.remove('visible');
  void bodyEl.offsetWidth;
  requestAnimationFrame(() => bodyEl.classList.add('visible'));

  titleEl.textContent = data.title;

  let summary = data.summary;
  if (duration === 'week' || duration === 'days') summary += SUMMARY_NUDGES.durationLong;
  if (quality === 'sharp') summary += SUMMARY_NUDGES.qualitySharp;
  else if (quality === 'burning') summary += SUMMARY_NUDGES.qualityBurning;
  else if (quality === 'tight') summary += SUMMARY_NUDGES.qualityTight;
  summaryEl.textContent = summary;

  renderList(explainEl, data.explanations);
  doctorEl.textContent = data.doctor;
  doctorFootEl.textContent = data.doctorFoot;
  renderList(nowEl, data.now);

  // Coral elevation for the "see a doctor" card.
  // Chest is always elevated. A long-duration ache anywhere also elevates.
  const elevated = data.elevated === true || duration === 'week';
  doctorWrap.classList.toggle('elevated', elevated);
}

function showEmpty(message) {
  emptyEl.hidden = false;
  emptyEl.querySelector('p').textContent = message;
  bodyEl.hidden = true;
  bodyEl.classList.remove('visible');
}

function renderList(el, items) {
  el.innerHTML = '';
  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item;
    el.appendChild(li);
  }
}

// Initial paint.
render();
