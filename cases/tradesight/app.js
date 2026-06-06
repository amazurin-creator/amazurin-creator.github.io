// Tickers — synthetic price stream.
const SYMBOLS = ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'BTC', 'ETH', 'GOOG', 'META', 'AMD', 'COIN', 'JPM', 'PLTR'];
const tickerEl = document.getElementById('ticker');
const positions = document.getElementById('positions');
const clockEl = document.getElementById('term-clock');

const state = SYMBOLS.map((s) => ({
  sym: s,
  price: 50 + Math.random() * 1500,
  change: (Math.random() - 0.4) * 4,
}));

function fmt(n) { return n.toFixed(2); }

function renderTicker() {
  if (!tickerEl) return;
  tickerEl.innerHTML = state.map((s) => {
    const cls = s.change >= 0 ? 't-up' : 't-down';
    const arrow = s.change >= 0 ? '+' : '';
    return `<span><span class="t-sym">${s.sym}</span><span class="${cls}">${arrow}${fmt(s.change)}%</span></span>`;
  }).join('');
}

function renderPositions() {
  if (!positions) return;
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
    s.change += (Math.random() - 0.5) * 0.25;
    s.change = Math.max(-9, Math.min(9, s.change));
  });
  renderTicker();
  renderPositions();
}

function tickClock() {
  if (!clockEl) return;
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} NYC`;
}

renderTicker();
renderPositions();
tickClock();
setInterval(tick, 1800);
setInterval(tickClock, 1000);

// Sparkline.
const spark = document.getElementById('sparkline');
if (spark) {
  const pts = [];
  let v = 50;
  for (let i = 0; i < 36; i++) {
    v += (Math.random() - 0.42) * 10;
    v = Math.max(15, Math.min(105, v));
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
    <path d="${path}" fill="none" stroke="#39FF14" stroke-width="1.4"/>
  `;
}

// Animate hero stat counting up.
function animateNum(el, target, suffix = '', dec = 0) {
  const start = 0;
  const dur = 1400;
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
