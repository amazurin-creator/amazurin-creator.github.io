// Date in letterhead.
const dateEl = document.getElementById('lx-date');
if (dateEl) {
  const d = new Date();
  const month = d.toLocaleString('en-US', { month: 'long' });
  const day = d.getDate();
  const ord = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  dateEl.textContent = `${month} ${ord(day)}, ${d.getFullYear()}`;
}

// Q&A — measured legal responses, typed character-by-character.
const QA = {
  transfer: {
    q: "Can my H-1B be transferred while my I-140 is pending?",
    response: [
      "Yes. An H-1B transfer is permitted at any stage of the I-140 process, including while the petition is pending adjudication. The transfer does not affect the underlying I-140 with the original employer¹.",
      "However, two considerations bear emphasis. First, the priority date established by the original I-140 is preserved provided the petition is approved and remains unrevoked for a continuous period of 180 days²; if revoked within that window, the priority date is lost. Second, the new employer must file a fresh H-1B petition — premium processing is recommended to minimise the gap.",
      "If the I-140 has been approved for less than 180 days at the time of transfer, the original employer's withdrawal of the petition will result in the loss of priority date portability. Counsel is required to assess timing.",
    ],
    citations: [
      ["1", "8 CFR § 214.2(h)(2)(i)(D) — H-1B portability provisions", "https://www.ecfr.gov/"],
      ["2", "INA § 204(j) — Job flexibility provisions, AC21", "https://uscode.house.gov/"],
    ],
  },
  travel: {
    q: "I'm on H-1B with approved I-140. Can I travel internationally?",
    response: [
      "Yes, with caveats. An approved I-140 alone does not impair international travel. You may depart and re-enter on a valid H-1B visa stamp and unexpired I-797 approval notice for your current H-1B employment¹.",
      "Three matters require attention. First, ensure your H-1B visa stamp in your passport is unexpired; if not, you will require a consular interview before re-entering, which carries administrative processing risk. Second, if an I-485 application is concurrently pending, advance parole is the recommended travel document — re-entry on H-1B with a pending I-485 may be construed as abandonment of the adjustment application by overcautious officers, though current USCIS policy permits H-1B re-entry².",
      "Third, country of origin and recent travel history materially affect risk. We recommend a 30-day pre-travel review before any international departure.",
    ],
    citations: [
      ["1", "9 FAM 402.10 — H Classifications, Department of State", "https://fam.state.gov/"],
      ["2", "USCIS Policy Manual, Volume 7, Part A, Chapter 3", "https://www.uscis.gov/policy-manual"],
    ],
  },
  cap: {
    q: "What is the H-1B cap-exempt employer rule for universities?",
    response: [
      "Institutions of higher education, as defined by Section 101(a) of the Higher Education Act of 1965, are exempt from the annual H-1B numerical cap¹. The exemption extends to non-profit entities affiliated with such institutions and to non-profit research organisations.",
      "Affiliation is established by formal written agreement and one of three relationships: shared ownership or control by the same board; operation by the institution; or attachment to the institution as a member, branch, cooperative, or subsidiary. Mere collaboration on grants is insufficient².",
      "Concurrent employment is permissible: an individual sponsored by a cap-exempt employer may simultaneously hold a cap-subject H-1B with a separate employer, provided each petition stands on its own merits. Loss of cap-exempt employment, however, terminates the exemption shield for the cap-subject role.",
    ],
    citations: [
      ["1", "INA § 214(g)(5) — Numerical limitations exceptions", "https://uscode.house.gov/"],
      ["2", "8 CFR § 214.2(h)(8)(ii)(F)(2-4) — Definitions of affiliated entities", "https://www.ecfr.gov/"],
    ],
  },
};

const responseEl = document.getElementById('lx-response');
const questionEl = document.getElementById('lx-question');
const citationsEl = document.getElementById('lx-citations');

let runToken = 0;

function injectCitations(text) {
  return text.replace(/(\d+)¹|¹/g, '<sup>1</sup>')
    .replace(/²/g, '<sup>2</sup>')
    .replace(/³/g, '<sup>3</sup>');
}

function appendFading(text) {
  const para = document.createElement('p');
  para.style.marginBottom = '16px';
  para.style.opacity = '0';
  para.style.transform = 'translateY(6px)';
  para.style.transition = 'opacity 600ms ease, transform 600ms ease';
  para.innerHTML = injectCitations(text);
  responseEl.appendChild(para);
  requestAnimationFrame(() => {
    para.style.opacity = '1';
    para.style.transform = 'none';
  });
  return para;
}

async function ask(key) {
  const myToken = ++runToken;
  const qa = QA[key];
  if (!qa) return;
  questionEl.textContent = qa.q;
  responseEl.innerHTML = '';
  responseEl.classList.add('lx-typing');
  citationsEl.classList.remove('visible');
  citationsEl.innerHTML = '';

  // Paragraph 1: character-by-character (the "measured counsel" effect)
  const p1 = document.createElement('p');
  p1.style.marginBottom = '16px';
  responseEl.appendChild(p1);
  const t1 = qa.response[0];
  for (let i = 0; i < t1.length; i++) {
    if (myToken !== runToken) return;
    p1.innerHTML = injectCitations(t1.slice(0, i + 1));
    const ch = t1[i];
    const delay = ch === '.' || ch === ',' ? 18 + Math.random() * 30 : 3 + Math.random() * 7;
    await new Promise((r) => setTimeout(r, delay));
  }

  // Remaining paragraphs: fade in as blocks (counsel has finished composing)
  for (let p = 1; p < qa.response.length; p++) {
    if (myToken !== runToken) return;
    await new Promise((r) => setTimeout(r, 320));
    appendFading(qa.response[p]);
  }

  if (myToken !== runToken) return;
  responseEl.classList.remove('lx-typing');

  await new Promise((r) => setTimeout(r, 500));
  if (myToken !== runToken) return;
  citationsEl.innerHTML = `
    <h4>Citations</h4>
    <ol>
      ${qa.citations.map(([n, label, url]) =>
        `<li><span class="cite-num">${n}.</span> <span>${label}</span></li>`
      ).join('')}
    </ol>
  `;
  citationsEl.classList.add('visible');
}

document.querySelectorAll('.lx-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lx-q').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    ask(btn.dataset.q);
  });
});

ask('transfer');
