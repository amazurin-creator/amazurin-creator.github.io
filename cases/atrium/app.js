const RESULTS = {
  alignment: {
    body: [
      `<span class="at-dropcap">T</span>he literature on AI alignment circa 2025 splits along a familiar axis: <em>technical</em> versus <em>governance</em> approaches. Russell's <em>Human Compatible</em> (2019) inaugurated the modern technical project; by 2022, RLHF had emerged as the de facto industrial method, with Christiano et al. providing the canonical formulation.<sup class="at-cite">1</sup>`,
      `By mid-decade, however, the governance literature had grown louder. Bengio and others called for a moratorium; Hendrycks proposed a more aggressive technical framework; while a long-running thread out of MIRI maintained that the orthogonal thesis renders most practical alignment work cosmetic.<sup class="at-cite">2</sup>`,
      `What unites these camps is less their disagreement than what they share: a presumption that alignment is best framed as a property of the model, rather than of the social and economic systems within which models are deployed. This is the assumption Crawford's <em>Atlas of AI</em> contests most forcefully.<sup class="at-cite">3</sup>`,
    ],
    citations: [
      { n: 1, text: 'Christiano et al., <em>Deep Reinforcement Learning from Human Preferences</em>, NeurIPS 2017.' },
      { n: 2, text: 'Hendrycks et al., <em>An Overview of Catastrophic AI Risks</em>, 2023.' },
      { n: 3, text: 'Crawford, K., <em>Atlas of AI</em> (Yale UP, 2021), esp. ch. 6.' },
      { n: 4, text: 'Russell, S., <em>Human Compatible</em> (Viking, 2019).' },
      { n: 5, text: 'Bengio, Y., et al., <em>Managing AI Risks in an Era of Rapid Progress</em>, Science, 2024.' },
    ],
    dissent: 'The technical/governance frame may itself be a category error. Suchman has argued that "alignment" presumes a stable referent — human values — which is precisely what is unsettled by these systems.',
  },
  reading: {
    body: [
      `<span class="at-dropcap">C</span>lose reading as a self-conscious method belongs to the early 20th century, but its lineage runs deeper. I.A. Richards, working at Cambridge in the 1920s, was the first to formalise the practice as <em>practical criticism</em> — students given poems without authorial attribution, asked to attend to the words on the page alone.<sup class="at-cite">1</sup>`,
      `The New Critics in America — Brooks, Ransom, Warren — institutionalised the method through textbook anthologies and a generation of MFA programmes. By mid-century, "close reading" had become synonymous with what literary studies <em>was</em>, much to the irritation of historicists and Marxists who saw the method as a depoliticisation of the text.<sup class="at-cite">2</sup>`,
      `The recent revival under the banner of <em>surface reading</em> (Best and Marcus, 2009) explicitly positions itself against the hermeneutics of suspicion that displaced the New Criticism in the 1970s. The wheel turns. The question of whether AI-assisted reading represents a further step or a retreat from this tradition remains open.<sup class="at-cite">3</sup>`,
    ],
    citations: [
      { n: 1, text: 'Richards, I.A., <em>Practical Criticism</em> (Kegan Paul, 1929).' },
      { n: 2, text: 'Brooks, C., <em>The Well Wrought Urn</em> (Reynal & Hitchcock, 1947).' },
      { n: 3, text: 'Best, S. & Marcus, S., "Surface Reading: An Introduction", <em>Representations</em> 108 (2009).' },
      { n: 4, text: 'Eve, M., <em>Close Reading with Computers</em> (Stanford UP, 2019), on quantitative reprises.' },
    ],
    dissent: 'Felski has argued that the close-reading tradition has lost its sense of why reading matters at all. The method survives; the rationale has thinned.',
  },
  markets: {
    body: [
      `<span class="at-dropcap">D</span>issent from the Efficient Markets Hypothesis is older than the hypothesis itself. Keynes's <em>General Theory</em> (1936) describes markets as a beauty contest of anticipations, a view incompatible with Fama's stronger formulations.<sup class="at-cite">1</sup>`,
      `The behavioural turn — Kahneman and Tversky in the 1970s, Shiller in the 1980s, Thaler thereafter — accumulated empirical findings that even Fama himself eventually granted as anomalies. The 2013 Nobel committee, in awarding the prize jointly to Fama and Shiller, made the unresolved tension official.<sup class="at-cite">2</sup>`,
      `The post-2008 literature is harder to summarise. Lo's <em>Adaptive Markets Hypothesis</em> represents one ecumenical resolution; Mandelbrot's earlier <em>fractal</em> work retains a small but loyal following; and the quantitative side increasingly proceeds without taking any explicit position on efficiency at all — what matters is whether one's edge is durable enough to fund payroll.<sup class="at-cite">3</sup>`,
    ],
    citations: [
      { n: 1, text: 'Keynes, J.M., <em>The General Theory of Employment, Interest and Money</em> (1936), ch. 12.' },
      { n: 2, text: 'Shiller, R., <em>Irrational Exuberance</em>, 3rd ed. (Princeton, 2015).' },
      { n: 3, text: 'Lo, A., <em>Adaptive Markets</em> (Princeton, 2017).' },
      { n: 4, text: 'Mandelbrot, B. & Hudson, R., <em>The (Mis)Behavior of Markets</em> (Basic, 2004).' },
    ],
    dissent: 'A growing minority within finance maintains the entire question is poorly posed: efficiency is not a property of markets but of strategies relative to the cost of information.',
  },
};

const results = document.getElementById('at-results');

async function ask(key) {
  results.innerHTML = '<div class="at-results-pending">Atrium is reading</div>';
  await new Promise((r) => setTimeout(r, 900));
  const data = RESULTS[key];
  if (!data) return;
  results.innerHTML = `
    <div class="at-result-spread">
      <div class="at-result-body">
        ${data.body.map((p, i) => `<p>${p}</p>`).join('')}
      </div>
      <aside class="at-result-margin">
        <h4>Selected reading</h4>
        ${data.citations.map((c) => `
          <p class="at-citation">
            <span class="at-citation-num">${c.n}</span>
            ${c.text}
          </p>
        `).join('')}
        <div class="at-dissent">
          <strong>Dissenting view</strong>
          ${data.dissent}
        </div>
      </aside>
    </div>
  `;
}

document.querySelectorAll('.at-query').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.at-query').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    ask(btn.dataset.q);
  });
});

ask('alignment');
