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
  ['b','d'], ['c','g'],
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
    setTimeout(() => line.classList.add('active'), 300 + i * 80);
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
      c.animate(
        [{ r: n.r }, { r: n.r * 1.4 }, { r: n.r }],
        { duration: 1800, iterations: 1 }
      );
      glow.animate(
        [{ opacity: 0.5 }, { opacity: 0.8 }, { opacity: 0.5 }],
        { duration: 1800, iterations: 1 }
      );
    }, 2200 + i * 400);
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
let running = false;

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
  runBtn.disabled = workflow.length === 0 || running;
  if (running) return;
  if (workflow.length === 0) status.textContent = 'Add agents to begin';
  else status.textContent = `${workflow.length} agent${workflow.length > 1 ? 's' : ''} queued. Ready.`;
}

document.querySelectorAll('.agent-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (running) return;
    if (workflow.length >= 6) {
      status.textContent = 'Max 6 agents per workflow.';
      return;
    }
    workflow.push(btn.dataset.agent);
    render();
  });
});

resetBtn.addEventListener('click', () => {
  if (running) return;
  workflow = [];
  render();
});

runBtn.addEventListener('click', async () => {
  if (!workflow.length || running) return;
  running = true;
  runBtn.disabled = true;
  status.textContent = 'Dispatching…';
  const nodes = canvas.querySelectorAll('.wf-node');
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const stat = n.querySelector('.wf-status');
    n.classList.add('running');
    stat.textContent = 'running';
    status.textContent = `Step ${i + 1}/${nodes.length}: ${AGENT_META[workflow[i]].step}`;
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 400));
    n.classList.remove('running');
    n.classList.add('done');
    stat.textContent = `done · ${(180 + Math.random() * 320).toFixed(0)}ms`;
  }
  status.textContent = `Workflow complete · ${workflow.length} steps · 0 errors`;
  running = false;
  runBtn.disabled = false;
});

render();
