// Hero decorative waveform — drawn once, animated by raf.
const heroCanvas = document.getElementById('hero-waveform');
const heroPlay = document.getElementById('hero-play');

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w: rect.width, h: rect.height };
}

let heroT = 0;
function drawHero() {
  if (!heroCanvas) return;
  const { ctx, w, h } = setupCanvas(heroCanvas);
  ctx.clearRect(0, 0, w, h);
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, '#00E5FF');
  grad.addColorStop(0.5, '#FF2D8B');
  grad.addColorStop(1, '#FF7A1A');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let x = 0; x < w; x += 2) {
    const t = x / w;
    const y = h / 2 + Math.sin(t * 32 + heroT) * (h / 3) * (0.4 + 0.6 * Math.sin(t * 6 + heroT * 0.6));
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  heroT += 0.03;
  requestAnimationFrame(drawHero);
}
drawHero();

// Web Audio synth patches.
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function ensureCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Build a patch — returns { start, stop, analyser, duration }
function buildPatch(name) {
  const ctx = ensureCtx();
  const out = ctx.createGain();
  out.gain.value = 0;
  out.connect(ctx.destination);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  out.connect(analyser);

  const nodes = [];
  const t0 = ctx.currentTime;
  const startAt = t0 + 0.05;
  let duration = 8;

  if (name === 'whisper') {
    duration = 8;
    out.gain.setValueAtTime(0, startAt);
    out.gain.linearRampToValueAtTime(0.32, startAt + 0.4);
    out.gain.linearRampToValueAtTime(0.28, startAt + duration - 0.6);
    out.gain.linearRampToValueAtTime(0, startAt + duration);

    [110, 165, 220].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.3 + i * 0.1;
      lfoGain.gain.value = 4 + i * 2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      const g = ctx.createGain();
      g.gain.value = (1 - i * 0.25) * 0.4;
      osc.connect(g);
      g.connect(out);
      osc.start(startAt);
      lfo.start(startAt);
      osc.stop(startAt + duration);
      lfo.stop(startAt + duration);
      nodes.push(osc, lfo);
    });

    // Air noise
    const bufLen = ctx.sampleRate * 0.5;
    const noiseBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() - 0.5) * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 2400;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.06;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(out);
    noise.start(startAt);
    noise.stop(startAt + duration);
    nodes.push(noise);
  }

  if (name === 'anthem') {
    duration = 10;
    out.gain.setValueAtTime(0, startAt);
    out.gain.linearRampToValueAtTime(0.34, startAt + 0.3);
    out.gain.linearRampToValueAtTime(0.34, startAt + duration - 0.4);
    out.gain.linearRampToValueAtTime(0, startAt + duration);

    // D major chord swells: D2 D3 F#3 A3 D4
    [73.42, 146.83, 185.00, 220.00, 293.66].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i < 2 ? 'sawtooth' : 'triangle';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      const peak = (1 - i * 0.12) * 0.22;
      g.gain.setValueAtTime(0, startAt);
      g.gain.linearRampToValueAtTime(peak, startAt + 0.8 + i * 0.15);
      // Swell pattern
      for (let s = 1; s < 4; s++) {
        g.gain.linearRampToValueAtTime(peak * 0.6, startAt + 0.8 + s * 2.2);
        g.gain.linearRampToValueAtTime(peak, startAt + 0.8 + s * 2.2 + 0.4);
      }
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = 1800;
      filt.Q.value = 1;
      osc.connect(filt);
      filt.connect(g);
      g.connect(out);
      osc.start(startAt);
      osc.stop(startAt + duration);
      nodes.push(osc);
    });

    // Drum hits on quarter beats
    for (let beat = 0; beat < 16; beat++) {
      const beatT = startAt + 0.6 + beat * 0.55;
      if (beatT > startAt + duration - 0.2) break;
      const drum = ctx.createOscillator();
      drum.type = 'sine';
      drum.frequency.setValueAtTime(180, beatT);
      drum.frequency.exponentialRampToValueAtTime(40, beatT + 0.15);
      const drumG = ctx.createGain();
      drumG.gain.setValueAtTime(0.7, beatT);
      drumG.gain.exponentialRampToValueAtTime(0.001, beatT + 0.25);
      drum.connect(drumG);
      drumG.connect(out);
      drum.start(beatT);
      drum.stop(beatT + 0.3);
      nodes.push(drum);
    }
  }

  if (name === 'cinema') {
    duration = 12;
    out.gain.setValueAtTime(0, startAt);
    out.gain.linearRampToValueAtTime(0.4, startAt + 1.5);
    out.gain.linearRampToValueAtTime(0.4, startAt + duration - 1.5);
    out.gain.linearRampToValueAtTime(0, startAt + duration);

    // E♭ deep drone: E♭1, E♭2, G2, B♭2
    [38.89, 77.78, 98.00, 116.54].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'sawtooth';
      osc.frequency.value = freq;
      const detune = ctx.createOscillator();
      const detuneGain = ctx.createGain();
      detune.frequency.value = 0.12 + i * 0.04;
      detuneGain.gain.value = 1.8;
      detune.connect(detuneGain);
      detuneGain.connect(osc.detune);
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = 600;
      filt.Q.value = 4;
      const g = ctx.createGain();
      g.gain.value = (1 - i * 0.15) * 0.3;
      osc.connect(filt);
      filt.connect(g);
      g.connect(out);
      osc.start(startAt);
      detune.start(startAt);
      osc.stop(startAt + duration);
      detune.stop(startAt + duration);
      nodes.push(osc, detune);
    });

    // Tense high shimmer
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = 1244.51; // E♭6
    const shimG = ctx.createGain();
    shimG.gain.value = 0;
    shimG.gain.setValueAtTime(0, startAt + 3);
    shimG.gain.linearRampToValueAtTime(0.025, startAt + 5);
    shimG.gain.linearRampToValueAtTime(0.025, startAt + duration - 1);
    shimG.gain.linearRampToValueAtTime(0, startAt + duration);
    shimmer.connect(shimG);
    shimG.connect(out);
    shimmer.start(startAt);
    shimmer.stop(startAt + duration);
    nodes.push(shimmer);
  }

  return {
    analyser,
    duration,
    startAt,
    stopAll: () => {
      nodes.forEach((n) => { try { n.stop(0); } catch {} });
      try { out.disconnect(); } catch {}
    },
  };
}

// Stage controls.
const pads = document.querySelectorAll('.wv-pad');
const playBtn = document.getElementById('wv-play');
const playIcon = document.getElementById('wv-play-icon');
const nowPlaying = document.getElementById('now-playing');
const timerEl = document.getElementById('wv-timer');
const waveCanvas = document.getElementById('wv-wave');
const spectrum = document.getElementById('wv-spectrum');

// Build spectrum bars.
const BARS = 32;
const spectrumBars = [];
for (let i = 0; i < BARS; i++) {
  const bar = document.createElement('span');
  spectrum.appendChild(bar);
  spectrumBars.push(bar);
}

let selectedPatch = 'whisper';
let activePatch = null;
let rafId = null;
let startedAt = 0;

const PATCH_META = {
  whisper: { label: 'Whisper · A♭ minor', dur: 8 },
  anthem: { label: 'Anthem · D major', dur: 10 },
  cinema: { label: 'Cinema · E♭ drone', dur: 12 },
};

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

function updateTimer(elapsed, dur) {
  timerEl.textContent = `${fmtTime(elapsed)} / ${fmtTime(dur)}`;
}

function setSelected(name) {
  selectedPatch = name;
  pads.forEach((p) => p.classList.toggle('active', p.dataset.patch === name));
  if (!activePatch) {
    nowPlaying.textContent = `${PATCH_META[name].label} · ready`;
    updateTimer(0, PATCH_META[name].dur);
  }
}

function stopActive() {
  if (activePatch) {
    activePatch.stopAll();
    activePatch = null;
  }
  if (rafId) cancelAnimationFrame(rafId);
  playBtn.classList.remove('playing');
  playIcon.textContent = '▶';
  // Reset spectrum
  spectrumBars.forEach((b) => { b.style.height = '4px'; });
}

function draw() {
  if (!activePatch) return;
  const ctx = audioCtx;
  const elapsed = ctx.currentTime - startedAt;
  if (elapsed >= activePatch.duration) {
    stopActive();
    nowPlaying.textContent = `${PATCH_META[selectedPatch].label} · finished`;
    updateTimer(0, PATCH_META[selectedPatch].dur);
    return;
  }
  updateTimer(elapsed, activePatch.duration);

  // Waveform
  const arr = new Uint8Array(activePatch.analyser.fftSize);
  activePatch.analyser.getByteTimeDomainData(arr);
  const dpr = window.devicePixelRatio || 1;
  const rect = waveCanvas.getBoundingClientRect();
  if (waveCanvas.width !== rect.width * dpr || waveCanvas.height !== rect.height * dpr) {
    waveCanvas.width = rect.width * dpr;
    waveCanvas.height = rect.height * dpr;
  }
  const c = waveCanvas.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, rect.width, rect.height);
  const grad = c.createLinearGradient(0, 0, rect.width, 0);
  grad.addColorStop(0, '#00E5FF');
  grad.addColorStop(0.5, '#FF2D8B');
  grad.addColorStop(1, '#FF7A1A');
  c.strokeStyle = grad;
  c.lineWidth = 2;
  c.beginPath();
  for (let i = 0; i < arr.length; i++) {
    const x = (i / arr.length) * rect.width;
    const y = ((arr[i] - 128) / 128) * (rect.height / 2) + rect.height / 2;
    if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  c.stroke();

  // Spectrum
  const spec = new Uint8Array(activePatch.analyser.frequencyBinCount);
  activePatch.analyser.getByteFrequencyData(spec);
  const step = Math.floor(spec.length / BARS);
  for (let i = 0; i < BARS; i++) {
    let sum = 0;
    for (let j = 0; j < step; j++) sum += spec[i * step + j];
    const v = sum / step / 255;
    spectrumBars[i].style.height = `${Math.max(4, v * 56)}px`;
  }

  rafId = requestAnimationFrame(draw);
}

function startPatch(name) {
  stopActive();
  activePatch = buildPatch(name);
  startedAt = audioCtx.currentTime + 0.05;
  playBtn.classList.add('playing');
  playIcon.textContent = '◼';
  nowPlaying.textContent = `${PATCH_META[name].label} · playing`;
  draw();
}

pads.forEach((p) => {
  p.addEventListener('click', () => {
    setSelected(p.dataset.patch);
    if (activePatch) {
      startPatch(p.dataset.patch);
    }
  });
});

playBtn.addEventListener('click', () => {
  if (activePatch) {
    stopActive();
    nowPlaying.textContent = `${PATCH_META[selectedPatch].label} · ready`;
    updateTimer(0, PATCH_META[selectedPatch].dur);
  } else {
    startPatch(selectedPatch);
  }
});

if (heroPlay) {
  heroPlay.addEventListener('click', () => {
    setSelected('anthem');
    document.getElementById('studio').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => startPatch('anthem'), 700);
  });
}

setSelected('whisper');
updateTimer(0, PATCH_META.whisper.dur);
