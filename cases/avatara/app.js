// Reach calculator.
const creatorsSlider = document.getElementById('creators-slider');
const postsSlider = document.getElementById('posts-slider');
const qualitySlider = document.getElementById('quality-slider');
const creatorsVal = document.getElementById('creators-val');
const postsVal = document.getElementById('posts-val');
const qualityVal = document.getElementById('quality-val');
const reachNum = document.getElementById('reach-num');
const postsNum = document.getElementById('posts-num');
const costNum = document.getElementById('cost-num');

const QUALITY = {
  1: { name: 'Lite', reachMult: 0.6, costPerPost: 180 },
  2: { name: 'Standard', reachMult: 1.0, costPerPost: 420 },
  3: { name: 'Premium', reachMult: 1.7, costPerPost: 980 },
};

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return Math.round(n).toLocaleString();
}

function fmtMoney(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return '$' + Math.round(n).toLocaleString();
}

let lastReach = 0, lastPosts = 0, lastCost = 0;

function animateTo(el, target, lastVal, formatter) {
  const dur = 600;
  const t0 = performance.now();
  function frame(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = lastVal + (target - lastVal) * eased;
    el.textContent = formatter(v);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function recalc() {
  const c = +creatorsSlider.value;
  const p = +postsSlider.value;
  const q = QUALITY[qualitySlider.value];

  creatorsVal.textContent = c;
  postsVal.textContent = p;
  qualityVal.textContent = q.name;

  // Reach: ~85K base impressions per post at standard, multiplied
  const monthlyPosts = c * p * 4.33;
  const reach = Math.round(monthlyPosts * 85_000 * q.reachMult);
  const cost = Math.round(monthlyPosts * q.costPerPost);

  animateTo(reachNum, reach, lastReach, fmt);
  animateTo(postsNum, Math.round(monthlyPosts), lastPosts, (v) => Math.round(v).toString());
  animateTo(costNum, cost, lastCost, fmtMoney);

  lastReach = reach;
  lastPosts = Math.round(monthlyPosts);
  lastCost = cost;
}

[creatorsSlider, postsSlider, qualitySlider].forEach((s) => s.addEventListener('input', recalc));
recalc();

// Animate hero stats.
function animateStat(el, target) {
  const dur = 1400;
  const t0 = performance.now();
  function frame(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = target * eased;
    if (target >= 1_000_000_000) el.textContent = (v / 1_000_000_000).toFixed(1).replace('.0', '') + 'B';
    else if (target >= 1_000_000) el.textContent = (v / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    else el.textContent = Math.round(v).toString();
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const heroStats = document.querySelectorAll('.av-hero-stats .av-stat-num');
const heroValues = [214, 38, 4_200_000_000, 0];
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      heroStats.forEach((el, i) => animateStat(el, heroValues[i]));
      io.disconnect();
    }
  });
});
if (heroStats[0]) io.observe(heroStats[0]);
