/* ============================================================
   HAPPY BIRTHDAY — a birthday film in four acts
   Vanilla canvas 2D for the tree + GSAP for the orchestration.

   ACT 1  a real recurve bow with a Cupid's arrow nocked — you
          DRAW the string down and RELEASE to fire (pointer drag,
          or keyboard). A softly beating heart waits above as the
          target.
   ACT 2  the arrow flies up and strikes the heart; the heart
          jolts, falls, and bursts into a flood of rose that
          swallows the frame (no cross-fade).
   ACT 3  a kinetic wish hinges up out of that colour, glyph by
          glyph, under cinema bars and a slow camera push.
   ACT 4  a gold light blooms, and the tree grows into one heart
          of lit blossoms with the hand-lettered wish.

   A GSAP master timeline runs the shot + Acts 2–3; at its end it
   starts the canvas tree (Act 4), which owns its own rAF and
   plays once, then holds — living, never looping.
   ============================================================ */

import gsap from 'gsap';
import { phase3Chapters, reservedStoryContent } from './story-content.js';

/* the pen-stroke plugin: a `drawn` 0..1 property for the underline */
gsap.registerPlugin({
  name: 'drawn',
  init(target, value) {
    const len = target.getTotalLength();
    target.style.strokeDasharray = len;
    this.target = target; this.len = len; this.value = value;
  },
  render(ratio, data) {
    data.target.style.strokeDashoffset = data.len * (1 - data.value * ratio);
  },
});

const $ = (id) => document.getElementById(id);
const assetUrl = (path) => `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`;

const passcodeScreen = $('passcodeScreen');
const birthdayExperience = $('birthdayExperience');
const passcodeKeypad = $('passcodeKeypad');
const passcodeDigits = [...document.querySelectorAll('[data-digit]')];
const passcodeError = $('passcodeError');
let passcodeValue = '';
let passcodeUnlocking = false;

function renderPasscode(){
  passcodeDigits.forEach((slot, index) => {
    slot.textContent = index < passcodeValue.length ? '•' : '';
    slot.classList.toggle('is-current', index === passcodeValue.length && passcodeValue.length < 4);
    slot.classList.toggle('is-filled', index < passcodeValue.length);
  });
}

function submitPasscode(){
  if (passcodeUnlocking || passcodeValue.length !== 4) return;
  if (passcodeValue !== '1319'){
    passcodeValue = '';
    renderPasscode();
    passcodeScreen.classList.remove('has-error');
    void passcodeScreen.offsetWidth;
    passcodeScreen.classList.add('has-error');
    passcodeError.textContent = 'That passcode didn’t open the surprise. Try again.';
    return;
  }
  passcodeUnlocking = true;
  passcodeError.textContent = '';
  passcodeKeypad.inert = true;
  passcodeScreen.classList.add('is-unlocking');
  const finishUnlock = () => {
    passcodeScreen.hidden = true;
    birthdayExperience.removeAttribute('aria-hidden');
    birthdayExperience.inert = false;
    startPhaseOne();
  };
  if (reduceMotion) finishUnlock();
  else gsap.to(passcodeScreen, { autoAlpha: 0, duration: 0.62, ease: 'power2.inOut', onComplete: finishUnlock });
}

function startPhaseOne(){
  if (reduceMotion){
    drawFinal();
    gsap.delayedCall(2.5, startPhaseTwo);
    return;
  }
  buildMotes();
  document.fonts && document.fonts.ready.then(() => { refreshRig(); setDraw(0); });
  enter();
}

passcodeKeypad.addEventListener('click', (event) => {
  const button = event.target.closest('[data-key]');
  if (!button || passcodeUnlocking) return;
  const key = button.dataset.key;
  passcodeScreen.classList.remove('has-error');
  passcodeError.textContent = '';
  if (/^\d$/.test(key) && passcodeValue.length < 4) passcodeValue += key;
  else if (key === 'delete') passcodeValue = passcodeValue.slice(0, -1);
  else if (key === 'submit') return submitPasscode();
  renderPasscode();
});

document.addEventListener('keydown', (event) => {
  if (passcodeScreen.hidden || passcodeUnlocking) return;
  if (/^\d$/.test(event.key) && passcodeValue.length < 4){
    event.preventDefault();
    passcodeValue += event.key;
    passcodeScreen.classList.remove('has-error');
    passcodeError.textContent = '';
    renderPasscode();
  } else if (event.key === 'Backspace'){
    event.preventDefault();
    passcodeValue = passcodeValue.slice(0, -1);
    passcodeScreen.classList.remove('has-error');
    passcodeError.textContent = '';
    renderPasscode();
  } else if (event.key === 'Enter'){
    event.preventDefault();
    submitPasscode();
  }
});

const canvas = $('tree');
const ctx    = canvas.getContext('2d');
const wishEl = $('wish');
const wishStages = [...document.querySelectorAll('[data-wish-stage]')];

const hero       = $('hero');
const eyebrow    = $('eyebrow');
const hint       = $('hint');
const motes      = $('motes');
const target     = $('target');
const targetHeart= $('targetHeart');
const heartGlow  = target.querySelector('.heart__glow');
const aim        = $('aim');

const archery = $('archery');
const bow     = $('bow');
const arrow   = $('arrow');
const strL    = $('strL');
const strR    = $('strR');
const serving = $('serving');

const flood   = $('flood');
const field   = $('field');
const camera  = $('camera');
const fgrid   = $('fgrid');
const kEyebrow= $('kEyebrow');
const kSub    = $('kSub');
const kFinal  = $('kFinal');
const kFinalLines = [...kFinal.children];
const barTop  = $('barTop');
const barBot  = $('barBot');
const uline   = $('uline').querySelector('.uline__path');
const bloom   = $('bloom');
const phaseTwo = $('phaseTwo');
const cakeScene = $('cakeScene');
const cakeArt = $('cakeArt');
const candleFlame = $('candleFlame');
const wishPrompt = $('wishPrompt');
const makeWishButton = $('makeWish');
const wishContinue = $('wishContinue');
const continueToBalloons = $('continueToBalloons');
const balloonsScene = $('balloonsScene');
const balloonGrid = $('balloonGrid');
const reasonList = $('reasonList');
const balloonProgress = $('balloonProgress');
const phaseTwoFinale = $('phaseTwoFinale');
const openStoryButton = $('openStory');
const phaseThree = $('phaseThree');
const storyFrame = $('storyFrame');
const storyProgress = $('storyProgress');
const storyTitle = $('storyTitle');
const storyScroll = $('storyScroll');
const storyContinue = $('storyContinue');
const storyStatus = $('storyStatus');
const phaseFour = $('phaseFour');
const photoIndex = $('photoIndex');
const photoCollections = $('photoCollections');
const photoFeature = $('photoFeature');
const photoFeatureImage = $('photoFeatureImage');
const photoGallery = $('photoGallery');
const photoGalleryEyebrow = $('photoGalleryEyebrow');
const photoGalleryTitle = $('photoGalleryTitle');
const photoGalleryIntro = $('photoGalleryIntro');
const photoCount = $('photoCount');
const photoGrid = $('photoGrid');
const photoSequence = $('photoSequence');
const photoBack = $('photoBack');
const photoBackBottom = $('photoBackBottom');
const photoViewer = $('photoViewer');
const photoViewerImage = $('photoViewerImage');
const photoViewerCaption = $('photoViewerCaption');
const photoViewerPosition = $('photoViewerPosition');
const photoViewerClose = $('photoViewerClose');
const photoViewerPrev = $('photoViewerPrev');
const photoViewerNext = $('photoViewerNext');
const phaseFive = $('phaseFive');
const p5Screens = [...document.querySelectorAll('[data-p5-screen]')];
const p5Video = $('p5BirthdayVideo');
const p5VideoStatus = $('p5VideoStatus');
const p5FinalVideo = $('p5FinalVideo');
const p5FinalVideoStatus = $('p5FinalVideoStatus');
const p5FinalVideoRetry = $('p5FinalVideoRetry');
const p5Continue = $('p5Continue');
const p5RetryVideo = $('p5RetryVideo');
const p5DevBypass = $('p5DevBypass');
const p5NoResponse = $('p5NoResponse');
const p5MessageText = $('p5MessageText');
const p5MessageCounter = $('p5MessageCounter');
const p5RevealText = $('p5RevealText');
const p5RevealPhoto = $('p5RevealPhoto');
const p5RevealImage = $('p5RevealImage');
const p5RevealCounter = $('p5RevealCounter');
const p5Photo = $('p5Photo');
const p5PhotoCount = $('p5PhotoCount');
const phase5NoMessages = [
  'Aiyoooo Ammaaa, why nooo? 🥺❤️',
  'No andre aagalla! You HAVE to choose Yes! 🤭',
  'Ammaa, after everything I made for you, still no? 😭😂',
  'Innu est sala no heltia, kandammaa? 😤💗',
  "Sari sari, I'll wait… but we both know you'll click Yes! 😂💕",
  'Last chance, Ammaaa… your Maga is waiting! 🥹❤️',
];
const phase5GiftMessages = [
  'Before I reveal your last gift… ❤️',
  'Ammaaa, no matter how many gifts I give you,\nno matter how expensive they are,\nand no matter who gives you the most beautiful gift…\n\n(Okay, except Ajay! 🤭😂❤️)',
  "There's one thing I want you to remember.",
  'The most precious gifts aren\'t always the ones wrapped in boxes.\nSometimes, they\'re the people who become a part of our lives,\nthe memories we create, and the love that stays even when\neverything else changes.',
  'Over this one beautiful year, we made so many memories together.\nSome were filled with happiness, some with fights, some with tears,\nand some with those little moments that only you and I truly\nunderstand. ❤️',
  "And that's why I made this website.",
  'I wanted you to travel through our one-year journey again.\nTo remember how everything began, smile at the silly things we did,\nand feel every little memory that brought us closer.',
  'That was my first gift to you.',
  'Not just a website, Ammaaa, but a little world holding a part\nof our story.\n\nAnd now… it\'s time for your second gift. 🥹🎁',
];
const phase5RevealMessages = [
  'This Maga…\nThis Kandammaa…\nThis Darling…\nThis Baby…\nThis Chinnima…\nThis Babyma…',
  "He's your gift for this birthday, and for all the years to come. ❤️",
  'Because no matter what life brings, no matter how much things\nchange, and no matter how many birthdays pass…',
  'Your Maga will always be your Maga.',
  'The one who irritates you, fights with you, makes you laugh,\ntroubles you, and loves you in his own little ways.',
  'And honestly, Ammaaa…',
  'What better gift could you ask for than having me? Ryt? 🤭❤️',
];
let phaseFiveStarted = false;
let p5Transitioning = false;
let p5CurrentScreen = 'voice';
let p5MessageIndex = 0;
let p5RevealIndex = 0;
let p5NoIndex = 0;
let p5Photos = [];
let p5PhotoIndex = 0;
let phase5PhotoPromise = fetch(assetUrl('/data/phase-five-photos.json')).then(r => r.ok ? r.json() : []).then(d => Array.isArray(d.photos) ? d.photos.map(photo => ({ ...photo, asset: assetUrl(photo.asset) })) : []).catch(() => []);

/* Phase 2 copy lives here so each balloon's label and message can be edited
   together without changing the scene or animation code. */
const balloonReasons = [
  { id: '1', color: 'gold', label: 'REASON NO.1 💖', message: 'Cheers to your future officer, Amma! ❤️ ✨' },
  { id: '2', color: 'lilac', label: 'REASON NO.2 💖', message: 'Every fight brought us back closer. ✨' },
  { id: '3', color: 'coral', label: 'REASON NO.3 💖', message: 'You made my ordinary days unforgettable. ✨' },
  { id: '4', color: 'mint', label: 'REASON NO.4 💖', message: 'You held my tears; I saw yours too. ✨' },
  { id: '5', color: 'rose', label: 'REASON NO.5 💖', message: 'Thank you for never giving up on us.' },
];
const balloonColors = { gold:'#f2c45d', lilac:'#b99bf0', coral:'#ff9277', mint:'#57d6c7', rose:'#f080aa' };
const completedBalloons = new Set();
let phaseTwoTimeline = null;
let phaseTwoStarted = false;
let phaseTwoState = 'idle';
let phaseThreeTimeline = null;
let storyCurrentIndex = 0;
let storyTransitioning = false;
let phaseThreeStarted = false;
let phaseFourStarted = false;
let photoManifest = null;
let photoCollectionId = 'moments-together';
let photoCollectionItems = [];
let photoViewerIndex = 0;
let photoViewerReturnFocus = null;
const photoManifestPromise = fetch(assetUrl('/data/photo-manifest.json'))
  .then((response) => { if (!response.ok) throw new Error(`Photo manifest returned ${response.status}`); return response.json(); })
  .then((manifest) => ({ ...manifest, photos: manifest.photos.map(photo => ({ ...photo, asset: assetUrl(photo.asset) })) }))
  .catch((error) => { console.error('Photo journey data could not be loaded.', error); return null; });

// The reserved birthday paragraph is deliberately empty and never rendered.
phaseThree.dataset.phaseFourHandoff = reservedStoryContent.phaseFourHandoff;
phaseThree.dataset.reservedBirthdayParagraph = reservedStoryContent.birthdayParagraph;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isRecord     = new URLSearchParams(location.search).has('record');

/* --- cue log for the recorder: the page stays muted, but it timestamps every
   beat the film crosses, and the offline sound synth fires foley at those exact
   times so the audio can never drift from the picture. --- */
if (isRecord) window.bdayCues = [];
let recT0 = 0;
function cue(name){ if (isRecord && recT0) window.bdayCues.push({ cue: name, t: (performance.now() - recT0) / 1000 }); }

/* ============================================================
   MATH HELPERS
   ============================================================ */
const rand  = (a, b) => a + Math.random() * (b - a);
const pick  = (a)    => a[(Math.random() * a.length) | 0];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp  = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack  = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

function shade(hex, amt){
  const n = parseInt(hex.slice(1), 16);
  const r = clamp((n >> 16) + amt, 0, 255), g = clamp(((n >> 8) & 255) + amt, 0, 255), b = clamp((n & 255) + amt, 0, 255);
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

/* ============================================================
   TREE ENGINE (Act 4) — canvas
   ============================================================ */
const BLOSSOM = [
  { c0: '#ffe1ec', c1: '#ff80aa' },
  { c0: '#ffd0e0', c1: '#f4577f' },
  { c0: '#ffc4d2', c1: '#e23b67' },
  { c0: '#ffd9c4', c1: '#ff8a5b' },
  { c0: '#ffeec2', c1: '#f6b13e' },
  { c0: '#ffd2e6', c1: '#e84d9a' },
];

/* timeline (seconds, relative to the tree's own start) */
const T = {
  trunkStart: 0.10,
  branchSpan: 1.80,
  bloomT0:    1.25,
  bloomSpan:  2.00,
  petalT0:    2.45,
  done:       24.00,
};

const SS = 168;

function heartShape(c, x, top, w, h){
  c.beginPath();
  c.moveTo(x, top + h * 0.28);
  c.bezierCurveTo(x, top, x - w * 0.5, top, x - w * 0.5, top + h * 0.28);
  c.bezierCurveTo(x - w * 0.5, top + h * 0.60, x - w * 0.16, top + h * 0.80, x, top + h);
  c.bezierCurveTo(x + w * 0.16, top + h * 0.80, x + w * 0.5, top + h * 0.60, x + w * 0.5, top + h * 0.28);
  c.bezierCurveTo(x + w * 0.5, top, x, top, x, top + h * 0.28);
  c.closePath();
}

function makeBlossom({ c0, c1 }, soft){
  const cv = document.createElement('canvas'); cv.width = cv.height = SS;
  const c = cv.getContext('2d');
  const w = SS * 0.62, h = SS * 0.58, x = SS / 2, top = SS * 0.17;

  c.save();
  c.shadowColor = 'rgba(150,38,72,0.32)';
  c.shadowBlur = SS * 0.085; c.shadowOffsetY = SS * 0.05;
  c.fillStyle = c1; heartShape(c, x, top, w, h); c.fill();
  c.restore();

  const g = c.createRadialGradient(x - w * 0.20, top + h * 0.20, h * 0.04, x, top + h * 0.42, h * 0.92);
  g.addColorStop(0, c0); g.addColorStop(0.55, c1); g.addColorStop(1, shade(c1, -26));
  heartShape(c, x, top, w, h); c.fillStyle = g; c.fill();

  c.save(); heartShape(c, x, top, w, h); c.clip();
  const g2 = c.createLinearGradient(0, top, 0, top + h);
  g2.addColorStop(0, 'rgba(255,255,255,0)');
  g2.addColorStop(0.65, 'rgba(110,16,46,0)');
  g2.addColorStop(1, 'rgba(110,16,46,0.26)');
  c.fillStyle = g2; c.fillRect(0, 0, SS, SS);
  c.globalAlpha = 0.55; c.fillStyle = '#ffffff';
  c.beginPath(); c.ellipse(x - w * 0.15, top + h * 0.24, w * 0.17, h * 0.11, -0.5, 0, Math.PI * 2); c.fill();
  c.restore();

  if (!soft) return cv;

  const cv2 = document.createElement('canvas'); cv2.width = cv2.height = SS;
  const c2 = cv2.getContext('2d');
  c2.filter = 'blur(2.6px)'; c2.drawImage(cv, 0, 0); c2.filter = 'none';
  c2.globalCompositeOperation = 'source-atop';
  c2.globalAlpha = 0.42; c2.fillStyle = '#fff3ea'; c2.fillRect(0, 0, SS, SS);
  return cv2;
}

function makeBokeh(rgb){
  const S = 128, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const c = cv.getContext('2d');
  const g = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, `rgba(${rgb},0.9)`); g.addColorStop(0.45, `rgba(${rgb},0.22)`); g.addColorStop(1, `rgba(${rgb},0)`);
  c.fillStyle = g; c.fillRect(0, 0, S, S);
  return cv;
}

function makeSparkle(){
  const S = 64, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const c = cv.getContext('2d'); const m = S / 2;
  const g = c.createRadialGradient(m, m, 0, m, m, m);
  g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.25, 'rgba(255,236,200,0.5)'); g.addColorStop(1, 'rgba(255,236,200,0)');
  c.fillStyle = g; c.beginPath(); c.arc(m, m, m, 0, 6.2832); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.95)';
  c.translate(m, m);
  for (let k = 0; k < 2; k++){
    c.beginPath();
    c.moveTo(0, -m); c.quadraticCurveTo(0, 0, m, 0); c.quadraticCurveTo(0, 0, 0, m); c.quadraticCurveTo(0, 0, -m, 0); c.quadraticCurveTo(0, 0, 0, -m);
    c.fill(); c.rotate(Math.PI / 4); c.scale(0.5, 0.5);
  }
  return cv;
}

let SPR = { crisp: [], soft: [] }, BOKEH = [], SPARKLE = null;
function buildSprites(){
  SPR = { crisp: BLOSSOM.map((b) => makeBlossom(b, false)), soft: BLOSSOM.map((b) => makeBlossom(b, true)) };
  BOKEH = [makeBokeh('255,224,188'), makeBokeh('255,196,214'), makeBokeh('255,238,210')];
  SPARKLE = makeSparkle();
}

function drawSprite(sprite, x, y, size, rot, alpha){
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.drawImage(sprite, -size * 0.5, -size * 0.47, size, size);
  ctx.restore();
}

let heartPoly = null;
function buildHeartPoly(){
  const raw = []; let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (let i = 0; i <= 160; i++){
    const t = (i / 160) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    raw.push([x, y]);
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const midX = (minX + maxX) / 2, midY = (minY + maxY) / 2, hw = (maxX - minX) / 2, hh = (maxY - minY) / 2;
  heartPoly = raw.map(([x, y]) => [(x - midX) / hw, (y - midY) / hh]);
}
function pointInPoly(x, y){
  let inside = false; const p = heartPoly;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++){
    const xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
    if (((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

let W = 0, H = 0, dpr = 1;
let cx = 0, cy = 0, rx = 0, ry = 0, groundY = 0;
let branches = [], hearts = [], petals = [], rested = [], orbs = [], floaters = [], twinkles = [];
let bgGrad = null, glowGrad = null, groundGrad = null;

const quad = (b, t) => { const m = 1 - t, a = m * m, k = 2 * m * t, d = t * t; return { x: a * b.x1 + k * b.cx + d * b.x2, y: a * b.y1 + k * b.cy + d * b.y2 }; };

function barkGrad(x1, y1, x2, y2, depth){
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  g.addColorStop(0, `hsl(348 26% ${26 + depth * 3}%)`);
  g.addColorStop(1, `hsl(346 24% ${40 + depth * 5}%)`);
  return g;
}

function buildScene(){
  branches = []; hearts = []; petals = []; rested = []; twinkles = []; orbs = []; floaters = [];
  buildHeartPoly();

  const wide = W / H > 1.2;
  cx = W * (wide ? 0.57 : 0.5);
  cy = H * (wide ? 0.37 : 0.38);
  ry = Math.min(H * (wide ? 0.33 : 0.33), W * 0.34);
  rx = ry * 1.16;
  groundY = H * 0.93;

  bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#fff3e9');
  bgGrad.addColorStop(0.46, '#ffe7d6');
  bgGrad.addColorStop(0.78, '#fcd9c4');
  bgGrad.addColorStop(1, '#f3c4b5');
  glowGrad = ctx.createRadialGradient(cx, cy, ry * 0.1, cx, cy, ry * 1.55);
  glowGrad.addColorStop(0, 'rgba(255,219,170,0.6)');
  glowGrad.addColorStop(0.5, 'rgba(255,170,150,0.2)');
  glowGrad.addColorStop(1, 'rgba(255,170,150,0)');
  groundGrad = ctx.createRadialGradient(cx, H * 1.02, ry * 0.2, cx, H * 1.02, ry * 1.6);
  groundGrad.addColorStop(0, 'rgba(255,205,165,0.5)');
  groundGrad.addColorStop(1, 'rgba(255,205,165,0)');

  for (let i = 0; i < 11; i++){
    orbs.push({ x: rand(0, W), y: rand(0, H), r: rand(W * 0.05, W * 0.17), vy: rand(-6, -16), drift: rand(-0.3, 0.3), phase: rand(0, 6.28), alpha: rand(0.05, 0.13), sprite: pick(BOKEH) });
  }

  const FN = wide ? 18 : 15;
  for (let i = 0; i < FN; i++){
    const depth = Math.random();
    floaters.push({
      x: rand(0, W), y: rand(-H * 0.1, H * 1.1), depth,
      idx: (Math.random() * BLOSSOM.length) | 0,
      box: lerp(Math.min(W, H) * 0.025, Math.min(W, H) * 0.075, depth),
      vy: lerp(7, 20, depth), sway: rand(8, 22), phase: rand(0, 6.28),
      rot: rand(-0.4, 0.4), vrot: rand(-0.5, 0.5),
      baseA: lerp(0.16, 0.5, depth), soft: depth < 0.45,
    });
  }

  const baseX = cx, baseY = H * 1.0;
  const trunkTopY = cy + ry * 0.62;
  const trunkW = Math.max(9, W * 0.024);
  const limbLen = ry * 0.6;
  const insidePx = (x, y, m = 0.9) => pointInPoly((x - cx) / (rx * m), (cy - y) / (ry * m));

  function addBranch(x, y, ang, len, w0, depth, t0){
    let ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len, clipped = false;
    if (!insidePx(ex, ey)){
      let lo = 0, hi = 1;
      for (let k = 0; k < 12; k++){ const mid = (lo + hi) / 2; (insidePx(x + Math.cos(ang) * len * mid, y + Math.sin(ang) * len * mid) ? lo = mid : hi = mid); }
      ex = x + Math.cos(ang) * len * lo; ey = y + Math.sin(ang) * len * lo; clipped = true;
    }
    const mx = (x + ex) / 2, my = (y + ey) / 2, perp = ang + Math.PI / 2, bend = rand(-1, 1) * len * 0.12, w1 = w0 * 0.66;
    branches.push({ x1: x, y1: y, cx: mx + Math.cos(perp) * bend, cy: my + Math.sin(perp) * bend, x2: ex, y2: ey, w0, w1, t0, dur: Math.max(0.14, 0.32 - depth * 0.03), depth, grad: barkGrad(x, y, ex, ey, depth) });
    return { ex, ey, w1, clipped };
  }
  function grow(x, y, ang, len, w, depth, t0){
    const r = addBranch(x, y, ang, len, w, depth, t0);
    if (r.clipped || depth >= 6 || len < ry * 0.06) return;
    const childT0 = t0 + (0.32 - depth * 0.03) * 0.6;
    const n = Math.random() < 0.55 ? 2 : 3;
    for (let i = 0; i < n; i++){
      const spread = 0.6 * (i - (n - 1) / 2) + rand(-0.22, 0.22), lift = -0.06 + rand(-0.05, 0.05);
      grow(r.ex, r.ey, ang + spread + lift, len * rand(0.74, 0.84), r.w1, depth + 1, childT0 + i * 0.03);
    }
  }
  addBranch(baseX, baseY, -Math.PI / 2, baseY - trunkTopY, trunkW, 0, T.trunkStart);
  branches[0].dur = 0.55;
  const limbT0 = T.trunkStart + 0.36, L = 3;
  for (let i = 0; i < L; i++){
    const ang = -Math.PI / 2 + 0.62 * (i - (L - 1) / 2) + rand(-0.12, 0.12);
    grow(baseX, trunkTopY, ang, limbLen, trunkW * 0.7, 1, limbT0 + i * 0.05);
  }
  const maxT0 = branches.reduce((m, b) => Math.max(m, b.t0 + b.dur), 0);
  const sc = (T.branchSpan - T.trunkStart) / (maxT0 - T.trunkStart);
  for (const b of branches) b.t0 = T.trunkStart + (b.t0 - T.trunkStart) * sc;

  const COUNT = Math.round(clamp(rx * ry / 56, 250, 440));
  const baseBox = clamp(Math.min(W, H) * 0.115, 30, 74);
  let guard = 0;
  while (hearts.length < COUNT && guard < COUNT * 50){
    guard++;
    const u = rand(-1.06, 1.06), v = rand(-1.06, 1.06);
    if (!pointInPoly(u, v)) continue;
    const x = cx + u * rx, y = cy - v * ry;
    const d = clamp01(Math.hypot(u, v + 1) / 2.4);
    const t0 = T.bloomT0 + d * (T.bloomSpan * 0.82) + rand(0, T.bloomSpan * 0.18);
    const soft = Math.random() < 0.42;
    hearts.push({ x, y, idx: (Math.random() * BLOSSOM.length) | 0, soft, box: baseBox * (soft ? rand(0.6, 0.85) : rand(0.78, 1.12)), rot: rand(-0.55, 0.55), sway: rand(0, 6.28), t0 });
  }
  hearts.sort((a, b) => (a.soft === b.soft ? a.y - b.y : a.soft ? -1 : 1));
}

function drawBackground(){
  ctx.globalAlpha = 1;
  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 1; ctx.fillStyle = groundGrad; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function drawGodRays(t, intensity){
  if (intensity <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const ox = cx, oy = cy - ry * 0.35, R = Math.hypot(W, H) * 1.1;
  const rays = 9, sweep = Math.sin(t * 0.07) * 0.18;
  for (let i = 0; i < rays; i++){
    const a = -Math.PI / 2 + sweep + (i - (rays - 1) / 2) * 0.2;
    const hw = 0.035 + 0.02 * (0.5 + 0.5 * Math.sin(t * 0.5 + i * 1.7));
    const a1 = a - hw, a2 = a + hw;
    const g = ctx.createLinearGradient(ox, oy, ox + Math.cos(a) * R, oy + Math.sin(a) * R);
    g.addColorStop(0, `rgba(255,232,190,${0.10 * intensity})`);
    g.addColorStop(0.5, `rgba(255,214,170,${0.05 * intensity})`);
    g.addColorStop(1, 'rgba(255,214,170,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + Math.cos(a1) * R, oy + Math.sin(a1) * R);
    ctx.lineTo(ox + Math.cos(a2) * R, oy + Math.sin(a2) * R);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawGlow(t){
  const gi = clamp01((t - T.bloomT0) / (T.bloomSpan * 0.9));
  if (gi <= 0) return;
  ctx.save(); ctx.globalAlpha = gi; ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = glowGrad; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function drawBokeh(t, dt){
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const o of orbs){
    o.y += o.vy * dt; o.x += Math.sin(t * 0.3 + o.phase) * o.drift;
    if (o.y < -o.r){ o.y = H + o.r; o.x = rand(0, W); }
    ctx.globalAlpha = o.alpha;
    ctx.drawImage(o.sprite, o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
  }
  ctx.restore();
}

function drawFloaters(t, dt, front){
  const appear = clamp01((t - 0.2) / 1.4);
  if (appear <= 0) return;
  for (const f of floaters){
    if ((f.depth >= 0.6) !== front) continue;
    f.y -= f.vy * dt;
    f.x += Math.sin(t * 0.5 + f.phase) * f.sway * dt;
    f.rot += f.vrot * dt;
    if (f.y < -f.box){ f.y = H + f.box; f.x = rand(0, W); }
    drawSprite((f.soft ? SPR.soft : SPR.crisp)[f.idx], f.x, f.y, f.box, f.rot, f.baseA * appear);
  }
}

function drawBranches(t){
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const b of branches){
    const f = clamp01((t - b.t0) / b.dur);
    if (f <= 0) continue;
    const e = easeOutCubic(f);
    ctx.strokeStyle = b.grad;
    const steps = 12, last = Math.max(1, Math.ceil(steps * e));
    let prev = quad(b, 0);
    for (let i = 1; i <= last; i++){
      const tt = Math.min(e, i / steps), p = quad(b, tt);
      ctx.lineWidth = lerp(b.w0, b.w1, tt);
      ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      prev = p;
    }
  }
}

function drawHearts(t){
  const breathe = 1 + Math.sin(t * 0.8) * 0.012;
  for (const h of hearts){
    const p = clamp01((t - h.t0) / 0.6);
    if (p <= 0) continue;
    const scale = Math.max(0, easeOutBack(p));
    let alpha = clamp01(p * 1.7); if (h.soft) alpha *= 0.8;
    const settled = clamp01((t - h.t0 - 0.6) / 0.7);
    const sway = settled * Math.sin(t * 1.5 + h.sway) * (h.box * 0.05);
    const rise = (1 - easeOutCubic(p)) * h.box * 0.45;
    const hx = cx + (h.x - cx) * breathe + sway;
    const hy = cy + (h.y - cy) * breathe - rise;
    drawSprite((h.soft ? SPR.soft : SPR.crisp)[h.idx], hx, hy, h.box * scale, h.rot + sway * 0.012, alpha);
  }
}

function updateTwinkles(t, dt){
  const active = t > T.bloomT0 + T.bloomSpan * 0.45;
  if (active && twinkles.length < 9 && Math.random() < 0.5){
    const h = hearts[(Math.random() * hearts.length) | 0];
    if (h) twinkles.push({ x: h.x, y: h.y, size: rand(0.6, 1.3) * (Math.min(W, H) * 0.05), age: 0, life: rand(0.7, 1.2), rot: rand(0, 6.28) });
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = twinkles.length - 1; i >= 0; i--){
    const s = twinkles[i]; s.age += dt;
    const k = s.age / s.life;
    if (k >= 1){ twinkles.splice(i, 1); continue; }
    const a = Math.sin(k * Math.PI);
    drawSprite(SPARKLE, s.x, s.y, s.size * (0.6 + 0.4 * a), s.rot + k * 1.2, a);
  }
  ctx.restore();
}

function spawnPetal(){
  const h = hearts[(Math.random() * hearts.length) | 0];
  if (!h) return;
  petals.push({ x: h.x + rand(-8, 8), y: h.y + rand(-8, 8), vy: rand(14, 30), vx: rand(-8, 8), sway: rand(0.6, 1.4), phase: rand(0, 6.28), box: h.box * rand(0.34, 0.6), idx: h.idx, rot: rand(0, 6.28), vrot: rand(-1.4, 1.4), age: 0, land: groundY + rand(-6, H * 0.05) });
}
function drawPetals(t, dt){
  for (let i = petals.length - 1; i >= 0; i--){
    const p = petals[i]; p.age += dt; p.vy += 8 * dt;
    p.x += (p.vx + Math.sin(t * p.sway + p.phase) * 16) * dt;
    p.y += p.vy * dt; p.rot += p.vrot * dt;
    if (p.y >= p.land){
      rested.push({ x: clamp(p.x, 6, W - 6), y: p.land, box: p.box, idx: p.idx, rot: p.rot, a: rand(0.7, 0.95) });
      if (rested.length > 90) rested.shift();
      petals.splice(i, 1); continue;
    }
    const a = p.age < 0.3 ? p.age / 0.3 : 1;
    drawSprite(SPR.crisp[p.idx], p.x, p.y, p.box, p.rot, a);
  }
}
function drawRested(){
  for (const r of rested) drawSprite(SPR.crisp[r.idx], r.x, r.y, r.box, r.rot, r.a);
}

function showWish(on){ wishEl.classList.toggle('is-in', on); }
let wishTL = null;

function revealWishStage(name){
  const stage = wishStages.find((item) => item.dataset.wishStage === name);
  if (!stage) return;
  showWish(true);
  wishStages.forEach((item) => {
    const active = item === stage;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-hidden', String(!active));
  });
  const lines = [...stage.children];
  gsap.fromTo(lines,
    { autoAlpha: 0, y: 18, filter: 'blur(5px)' },
    { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.24, ease: 'power3.out', overwrite: true }
  );
}

function renderBalloonChoices(){
  balloonGrid.replaceChildren();
  reasonList.replaceChildren();
  balloonReasons.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'balloon-button';
    button.dataset.balloonId = item.id;
    button.dataset.color = item.color;
    button.setAttribute('aria-label', `Pop balloon ${index + 1}, ${item.label}`);
    button.setAttribute('aria-pressed', 'false');

    const shape = document.createElement('span');
    shape.className = 'balloon-shape';
    shape.setAttribute('aria-hidden', 'true');
    button.append(shape);
    balloonGrid.append(button);

    const card = document.createElement('article');
    card.className = 'reason-card';
    card.id = `reasonCard-${item.id}`;
    card.dataset.reasonId = item.id;
    card.hidden = true;
    card.style.setProperty('--reason-color', balloonColors[item.color]);
    const label = document.createElement('p');
    label.className = 'reason-card__label';
    label.textContent = item.label;
    const message = document.createElement('p');
    message.className = 'reason-card__message';
    message.textContent = item.message;
    card.append(label, message);
    reasonList.append(card);
  });
}

function startPhaseTwo(){
  if (phaseTwoStarted) return;
  phaseTwoStarted = true;
  phaseTwoState = 'cake';
  phaseTwo.classList.add('is-active');
  phaseTwo.removeAttribute('inert');
  phaseTwo.setAttribute('aria-hidden', 'false');
  cakeScene.hidden = false;
  cakeScene.inert = false;
  cakeScene.setAttribute('aria-hidden', 'false');
  balloonsScene.hidden = true;
  balloonsScene.inert = true;
  balloonsScene.setAttribute('aria-hidden', 'true');
  wishPrompt.hidden = true;
  wishContinue.hidden = true;
  makeWishButton.disabled = false;
  continueToBalloons.disabled = false;
  phaseTwo.scrollTop = 0;
  gsap.set(phaseTwo, { opacity: 0 });
  gsap.set([cakeArt, '.p2-kicker', '.p2-subtitle'], { autoAlpha: 0, y: 22 });
  gsap.set(candleFlame, { autoAlpha: 0, scale: 0, transformOrigin: '50% 100%' });

  phaseTwoTimeline = gsap.timeline({ onComplete: () => {
    wishPrompt.hidden = false;
    gsap.fromTo(wishPrompt,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.48, ease: 'power3.out' }
    );
  } });
  phaseTwoTimeline.to(phaseTwo, { opacity: 1, duration: reduceMotion ? 0 : 0.75, ease: 'power2.out' }, 0)
    .to('.p2-kicker', { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.65, ease: 'power3.out' }, 0.08)
    .to('.p2-subtitle', { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.55, ease: 'power3.out' }, 0.32)
    .to(cakeArt, { autoAlpha: 1, y: 0, scale: 1, duration: reduceMotion ? 0 : 0.82, ease: 'back.out(1.2)' }, 0.34)
    .to(candleFlame, { autoAlpha: 1, scale: 1, duration: reduceMotion ? 0 : 0.32, ease: 'back.out(2)' }, 1.12);
}

function makePopBurst(target, palette, count = 12){
  const bounds = target.getBoundingClientRect();
  const root = phaseTwo.getBoundingClientRect();
  const originX = bounds.left - root.left + bounds.width / 2;
  const originY = bounds.top - root.top + phaseTwo.scrollTop + bounds.height / 2;
  const colors = palette.length ? palette : ['#ffd36f','#ff9f86','#74dfd1','#f79bc0'];
  for (let i = 0; i < count; i++){
    const particle = document.createElement('i');
    particle.className = 'pop-particle';
    particle.setAttribute('aria-hidden', 'true');
    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    particle.style.background = colors[i % colors.length];
    phaseTwo.append(particle);
    const angle = (Math.PI * 2 * i / count) + rand(-0.18, 0.18);
    const distance = rand(30, 78);
    gsap.fromTo(particle,
      { x:0, y:0, scale:rand(.65,1.15), opacity:1, rotation:rand(-30,30) },
      { x:Math.cos(angle) * distance, y:Math.sin(angle) * distance, scale:0.1, opacity:0, rotation:rand(-180,180), duration:reduceMotion ? 0.01 : rand(.42,.72), ease:'power2.out', onComplete:() => particle.remove() }
    );
  }
}

function enterBalloonScene(){
  phaseTwoState = 'balloons';
  cakeScene.hidden = true;
  cakeScene.inert = true;
  cakeScene.setAttribute('aria-hidden', 'true');
  balloonsScene.hidden = false;
  balloonsScene.inert = false;
  balloonsScene.setAttribute('aria-hidden', 'false');
  phaseTwo.scrollTop = 0;
  balloonsScene.scrollTop = 0;
  if (reduceMotion){
    gsap.set(['.balloon-intro', '.balloon-button'], { clearProps:'all' });
    return;
  }
  gsap.fromTo('.balloon-intro', { autoAlpha:0, y:18 }, { autoAlpha:1, y:0, duration:.5, ease:'power3.out' });
  gsap.fromTo('.balloon-button', { autoAlpha:0, y:24, scale:.92 }, { autoAlpha:1, y:0, scale:1, duration:.55, stagger:.08, ease:'back.out(1.25)' });
}

function activateWish(){
  if (phaseTwoState !== 'cake') return;
  phaseTwoState = 'wishing';
  makeWishButton.disabled = true;
  const palette = ['#ffd36f','#ff9f86','#74dfd1','#f79bc0','#fff0ca'];
  makePopBurst(candleFlame, palette, reduceMotion ? 6 : 16);
  if (phaseTwoTimeline){ phaseTwoTimeline.kill(); phaseTwoTimeline = null; }
  phaseTwoTimeline = gsap.timeline({ onComplete: () => {
    phaseTwoState = 'continue';
    wishContinue.hidden = false;
    gsap.fromTo(wishContinue,
      { autoAlpha:0, y:20 },
      { autoAlpha:1, y:0, duration:reduceMotion ? .01 : .55, ease:'power3.out' }
    );
  } });
  phaseTwoTimeline.to(candleFlame, { autoAlpha:0, scale:.25, y:-12, duration:reduceMotion ? .01 : .34, ease:'power2.in' }, 0)
    .to('.cake-art__glow', { scale:1.55, opacity:.75, duration:reduceMotion ? .01 : .55, ease:'power2.out' }, 0)
    .to(wishPrompt, { y:-7, scale:1.025, duration:reduceMotion ? .01 : .24, yoyo:true, repeat:1, ease:'sine.inOut' }, 0.05)
    .to(cakeArt, { y:-5, duration:reduceMotion ? .01 : .35, ease:'power2.out' }, 0.05)
    .to(wishPrompt, { autoAlpha:0, y:-12, duration:reduceMotion ? .01 : .3, ease:'power2.in' }, reduceMotion ? .02 : .72);
}

function continueToBalloonScene(){
  if (phaseTwoState !== 'continue') return;
  phaseTwoState = 'transitioning';
  continueToBalloons.disabled = true;
  if (phaseTwoTimeline) phaseTwoTimeline.kill();
  phaseTwoTimeline = gsap.timeline({ onComplete: enterBalloonScene });
  phaseTwoTimeline.to(cakeScene, { autoAlpha:0, y:-10, duration:reduceMotion ? .01 : .38, ease:'power2.in' });
}

function popBalloon(button){
  if (phaseTwoState !== 'balloons' || !button || button.disabled) return;
  const reason = balloonReasons.find((item) => item.id === button.dataset.balloonId);
  if (!reason || completedBalloons.has(reason.id)) return;
  completedBalloons.add(reason.id);
  button.disabled = true;
  button.setAttribute('aria-pressed', 'true');
  button.classList.add('is-popped');
  makePopBurst(button, [balloonColors[reason.color], '#ffd36f', '#fff3e8', '#ff9eaa'], reduceMotion ? 5 : 12);
  const shape = button.querySelector('.balloon-shape');
  const card = $(`reasonCard-${reason.id}`);
  gsap.to(shape, { scale:1.42, opacity:0, duration:reduceMotion ? .01 : .28, ease:'back.in(1.6)', onComplete:() => {
    button.hidden = true;
    card.hidden = false;
    gsap.fromTo(card,
      { autoAlpha:0, y:20, scale:.985 },
      { autoAlpha:1, y:0, scale:1, duration:reduceMotion ? .01 : .48, ease:'power3.out', onComplete:() => {
        balloonProgress.textContent = `${completedBalloons.size} of 5 reasons revealed`;
        if (completedBalloons.size === balloonReasons.length) finishPhaseTwo();
      } }
    );
  } });
}

function finishPhaseTwo(){
  if (phaseTwoState === 'done') return;
  phaseTwoState = 'done';
  phaseTwoFinale.hidden = false;
  openStoryButton.hidden = false;
  gsap.set(openStoryButton, { autoAlpha:0, y:12 });
  gsap.timeline()
    .fromTo(phaseTwoFinale,
      { autoAlpha:0, y:18 },
      { autoAlpha:1, y:0, duration:reduceMotion ? .01 : .7, ease:'power3.out' }
    )
    .to(openStoryButton,
      { autoAlpha:1, y:0, duration:reduceMotion ? .01 : .42, ease:'power3.out' }
    );
}

function appendStoryParagraphs(parent, paragraphs, className = 'story-prose'){
  const prose = document.createElement('div');
  prose.className = className;
  paragraphs.forEach((text) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    prose.append(paragraph);
  });
  parent.append(prose);
}

function createStoryIllustration(type){
  if (type === 'letter'){
    const art = document.createElement('div');
    art.className = 'story-opening-art';
    art.setAttribute('aria-hidden', 'true');
    const peek = document.createElement('div');
    peek.className = 'story-letter-peek';
    const envelope = document.createElement('div');
    envelope.className = 'story-envelope';
    const body = document.createElement('div');
    body.className = 'story-envelope__body';
    const flap = document.createElement('div');
    flap.className = 'story-envelope__flap';
    flap.id = 'storyEnvelopeFlap';
    envelope.append(body, flap);
    art.append(peek, envelope);
    return art;
  }
  if (type === 'campus'){
    const windows = document.createElement('div');
    windows.className = 'story-campus-windows';
    windows.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 4; i++){
      const windowPane = document.createElement('i');
      windows.append(windowPane);
    }
    return windows;
  }
  if (type === 'notebook'){
    const book = document.createElement('div');
    book.className = 'story-notebook';
    book.setAttribute('aria-hidden', 'true');
    return book;
  }
  if (type === 'city'){
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 460 74');
    svg.setAttribute('class', 'story-route');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', 'M24 48 C95 8 132 66 207 34 S327 8 436 42');
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2'); path.setAttribute('stroke-dasharray', '4 7');
    svg.append(path);
    [[24,48],[207,34],[436,42]].forEach(([cx,cy]) => {
      const dot = document.createElementNS(svg.namespaceURI, 'circle');
      dot.setAttribute('cx', String(cx)); dot.setAttribute('cy', String(cy));
      dot.setAttribute('r', '6'); dot.setAttribute('fill', '#f4d08e');
      dot.setAttribute('stroke', 'currentColor'); dot.setAttribute('stroke-width', '2');
      svg.append(dot);
    });
    return svg;
  }
  if (type === 'sunflower'){
    const wrap = document.createElement('div');
    wrap.className = 'story-sunflower-art';
    wrap.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 180 190');
    const stem = document.createElementNS(svg.namespaceURI, 'path');
    stem.setAttribute('d', 'M90 105 C88 135 92 157 87 184');
    stem.setAttribute('fill', 'none'); stem.setAttribute('stroke', '#77885d'); stem.setAttribute('stroke-width', '5');
    const leaf = document.createElementNS(svg.namespaceURI, 'path');
    leaf.setAttribute('d', 'M89 148 C63 126 46 137 55 151 C64 164 78 159 89 148 M90 164 C111 143 128 148 123 161 C117 173 103 172 90 164');
    leaf.setAttribute('fill', '#8c9b68'); leaf.setAttribute('stroke', '#6f8055'); leaf.setAttribute('stroke-width', '2');
    const head = document.createElementNS(svg.namespaceURI, 'g');
    head.setAttribute('class', 'story-sunflower-head');
    head.setAttribute('transform', 'translate(90 76)');
    for (let i = 0; i < 14; i++){
      const petal = document.createElementNS(svg.namespaceURI, 'ellipse');
      petal.setAttribute('cx', '0'); petal.setAttribute('cy', '-31'); petal.setAttribute('rx', '10'); petal.setAttribute('ry', '23');
      petal.setAttribute('fill', i % 2 ? '#eebd55' : '#f5cc72');
      petal.setAttribute('transform', `rotate(${i * (360 / 14)})`);
      head.append(petal);
    }
    const center = document.createElementNS(svg.namespaceURI, 'circle');
    center.setAttribute('r', '20'); center.setAttribute('fill', '#65452f');
    const centerLight = document.createElementNS(svg.namespaceURI, 'circle');
    centerLight.setAttribute('r', '15'); centerLight.setAttribute('fill', '#89603c');
    head.append(center, centerLight);
    svg.append(stem, leaf, head);
    wrap.append(svg);
    return wrap;
  }
  return null;
}

function renderStoryChapter(index){
  const chapter = phase3Chapters[index];
  if (!chapter) return;
  storyCurrentIndex = index;
  storyFrame.dataset.theme = chapter.theme;
  phaseThree.dataset.theme = chapter.theme;
  storyProgress.textContent = `${String(index + 1).padStart(2, '0')} / ${String(phase3Chapters.length).padStart(2, '0')} · ${chapter.id.replaceAll('-', ' ').toUpperCase()}`;
  storyTitle.textContent = chapter.title;
  storyTitle.hidden = !chapter.title;
  storyScroll.replaceChildren();
  storyScroll.scrollTop = 0;

  const content = document.createElement('div');
  content.className = `story-content story-content--${chapter.theme}`;
  content.id = 'activeStoryContent';
  const illustration = createStoryIllustration(chapter.theme);
  if (illustration) content.append(illustration);

  const paper = document.createElement('article');
  paper.className = `story-paper${chapter.theme === 'finale' ? ' story-finale-paper' : ''}`;
  if (chapter.entries){
    chapter.entries.forEach((entry) => {
      const section = document.createElement('section');
      section.className = 'story-entry';
      const label = document.createElement('h3');
      label.className = 'story-date';
      label.textContent = entry.label;
      section.append(label);
      appendStoryParagraphs(section, entry.paragraphs, 'story-entry-copy');
      paper.append(section);
    });
  } else if (chapter.vows){
    chapter.vows.forEach((text) => {
      const vow = document.createElement('p');
      vow.className = 'story-vow';
      vow.textContent = text;
      paper.append(vow);
    });
  } else {
    appendStoryParagraphs(paper, chapter.paragraphs ?? []);
    if (chapter.stickyNote){
      const note = document.createElement('blockquote');
      note.className = 'story-sticky-note';
      note.textContent = chapter.stickyNote;
      paper.append(note);
    }
  }
  content.append(paper);
  storyScroll.append(content);

  const isFinale = index === phase3Chapters.length - 1;
  storyContinue.textContent = isFinale ? reservedStoryContent.phaseFourHandoff : 'Continue →';
  storyContinue.dataset.handoff = isFinale ? 'phase-four' : '';
  storyContinue.disabled = false;
}

function animateStoryEntry(){
  const content = $('activeStoryContent');
  if (!content) return;
  if (reduceMotion){
    gsap.set(content, { clearProps:'all' });
    const envelopeArt = content.querySelector('.story-opening-art');
    if (envelopeArt) envelopeArt.classList.add('is-open');
    storyTransitioning = false;
    storyTitle.focus({ preventScroll:true });
    return;
  }
  gsap.set(content, { autoAlpha:0, y:12 });
  phaseThreeTimeline = gsap.timeline({ onComplete:() => {
    storyTransitioning = false;
    storyTitle.focus({ preventScroll:true });
  } });
  phaseThreeTimeline.to(content, { autoAlpha:1, y:0, duration:.42, ease:'power3.out' });
  if (storyCurrentIndex === 0){
    const art = content.querySelector('.story-opening-art');
    const peek = content.querySelector('.story-letter-peek');
    const flap = content.querySelector('.story-envelope__flap');
    phaseThreeTimeline.fromTo(peek, { y:48, autoAlpha:0 }, { y:-18, autoAlpha:1, duration:.65, ease:'power2.out' }, .12)
      .to(flap, { rotationX:-175, duration:.62, ease:'power2.inOut' }, .35)
      .call(() => art?.classList.add('is-open'), [], .96);
  } else if (storyCurrentIndex === phase3Chapters.findIndex((chapter) => chapter.id === 'sunflower')){
    phaseThreeTimeline.fromTo(content.querySelector('.story-sunflower-head'),
      { rotation:-12 }, { rotation:0, duration:.9, ease:'power2.out' }, .15
    );
  }
}

function startPhaseThree(){
  if (phaseThreeStarted) return;
  phaseThreeStarted = true;
  storyTransitioning = true;
  phaseThree.hidden = false;
  phaseThree.removeAttribute('inert');
  phaseThree.setAttribute('aria-hidden', 'false');
  renderStoryChapter(0);
  phaseThree.classList.add('is-active');
  gsap.set(phaseThree, { autoAlpha:0 });
  gsap.to(phaseThree, { autoAlpha:1, duration:reduceMotion ? .01 : .55, ease:'power2.out', onComplete:animateStoryEntry });
}

function openPhaseThree(){
  if (phaseTwoState !== 'done' || storyTransitioning || phaseThreeStarted) return;
  storyTransitioning = true;
  phaseTwoState = 'phase3-transition';
  openStoryButton.disabled = true;
  gsap.to(phaseTwo, { autoAlpha:0, duration:reduceMotion ? .01 : .5, ease:'power2.inOut', onComplete:() => {
    phaseTwo.classList.remove('is-active');
    phaseTwo.setAttribute('aria-hidden', 'true');
    phaseTwo.setAttribute('inert', '');
    phaseTwo.hidden = true;
    startPhaseThree();
  } });
}

function continueStory(){
  if (storyTransitioning || !phaseThreeStarted) return;
  if (storyCurrentIndex === phase3Chapters.length - 1){
    if (phaseFourStarted) return;
    storyTransitioning = true;
    storyContinue.disabled = true;
    if (phaseThreeTimeline) phaseThreeTimeline.kill();
    phaseThreeTimeline = gsap.timeline({ onComplete:() => {
      phaseThree.classList.remove('is-active');
      phaseThree.setAttribute('aria-hidden', 'true');
      phaseThree.setAttribute('inert', '');
      phaseThree.hidden = true;
      startPhaseFour();
    } });
    phaseThreeTimeline.to(phaseThree, { autoAlpha:0, duration:reduceMotion ? .01 : .62, ease:'power2.inOut' });
    return;
  }
  storyTransitioning = true;
  storyContinue.disabled = true;
  if (phaseThreeTimeline) phaseThreeTimeline.kill();
  phaseThreeTimeline = gsap.timeline({ onComplete:() => {
    storyTransitioning = false;
    storyContinue.disabled = false;
    storyTitle.focus({ preventScroll:true });
  } });
  phaseThreeTimeline.to('#activeStoryContent', { autoAlpha:0, y:-10, duration:reduceMotion ? .01 : .2, ease:'power2.in' })
    .call(() => renderStoryChapter(storyCurrentIndex + 1))
    .fromTo('#activeStoryContent', { autoAlpha:0, y:14 }, { autoAlpha:1, y:0, duration:reduceMotion ? .01 : .4, ease:'power3.out' })
    .call(() => {
      if (phase3Chapters[storyCurrentIndex]?.id === 'sunflower' && !reduceMotion){
        const head = $('activeStoryContent')?.querySelector('.story-sunflower-head');
        if (head) gsap.fromTo(head, { rotation:-12 }, { rotation:0, duration:.9, ease:'power2.out' });
      }
    });
}

/* ============================================================
   PHASE 4 — the real photographs, held as one connected album
   ============================================================ */
function photoCollection(id){ return photoManifest?.collections.find((collection) => collection.id === id); }

function makePhotoImage(photo, alt = ''){
  const image = document.createElement('img');
  image.src = photo.asset;
  image.alt = alt;
  if (Number.isFinite(photo.width) && Number.isFinite(photo.height)) {
    image.width = photo.width;
    image.height = photo.height;
  }
  image.loading = 'lazy';
  image.decoding = 'async';
  image.draggable = false;
  return image;
}

function renderPhotoIndex(){
  if (!photoManifest) {
    photoIndex.innerHTML = '<div class="photo-load-error"><p class="photo-eyebrow">THE ALBUM IS WAITING</p><h2>Our Memories</h2><p>The photographs could not be loaded. Please check the local project assets and refresh.</p></div>';
    return;
  }
  const together = photoManifest.photos.filter((photo) => photo.collection === 'moments-together');
  if (together[0]) {
    photoFeatureImage.src = together[0].asset;
    photoFeatureImage.alt = '';
    photoFeatureImage.loading = 'eager';
    photoFeatureImage.decoding = 'async';
  }
  photoFeature.disabled = together.length === 0;
  photoFeature.setAttribute('aria-label', `Open Moments Together, ${together.length} photographs`);
  photoCollections.replaceChildren();
  photoManifest.collections.forEach((collection, collectionIndex) => {
    const photos = photoManifest.photos.filter((photo) => photo.collection === collection.id);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `photo-collection-card photo-collection-card--${collection.id}`;
    card.dataset.collection = collection.id;
    card.setAttribute('aria-label', `${collection.title}, ${photos.length} photographs`);
    const cover = document.createElement('span');
    cover.className = 'photo-collection-card__cover';
    if (photos[0]) cover.append(makePhotoImage(photos[0], ''));
    const copy = document.createElement('span');
    copy.className = 'photo-collection-card__copy';
    const marker = document.createElement('small');
    marker.textContent = `CHAPTER 0${collectionIndex + 1} · ${photos.length} PHOTOS`;
    const title = document.createElement('strong');
    title.textContent = collection.title;
    const arrow = document.createElement('span');
    arrow.className = 'photo-collection-card__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    copy.append(marker, title);
    card.append(cover, copy, arrow);
    photoCollections.append(card);
  });
}

function renderPhotoSequence(){
  photoSequence.replaceChildren();
  photoManifest.collections.forEach((collection, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.collection = collection.id;
    button.className = collection.id === photoCollectionId ? 'is-current' : '';
    button.setAttribute('aria-current', collection.id === photoCollectionId ? 'page' : 'false');
    button.textContent = `${String(index + 1).padStart(2, '0')} · ${collection.title.replace(/\s*[❤️🎁📸💌✨]\s*$/u, '')}`;
    photoSequence.append(button);
  });
}

function openPhotoCollection(id, animate = true){
  const collection = photoCollection(id);
  if (!collection) return;
  photoCollectionId = id;
  photoCollectionItems = photoManifest.photos.filter((photo) => photo.collection === id);
  photoGalleryEyebrow.textContent = `A PHOTO CHAPTER · ${collection.count} PHOTOGRAPHS`;
  photoGalleryTitle.textContent = collection.title;
  photoGalleryIntro.textContent = collection.intro;
  photoCount.textContent = `${photoCollectionItems.length} photographs`;
  photoGrid.replaceChildren();
  photoCollectionItems.forEach((photo, index) => {
    const card = document.createElement('figure');
    card.className = 'photo-card';
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'photo-card__open';
    open.dataset.photoIndex = String(index);
    open.setAttribute('aria-label', `Open photograph ${index + 1} of ${photoCollectionItems.length}`);
    open.append(makePhotoImage(photo, `Photograph ${index + 1} from ${collection.title.replace(/\s*[❤️🎁📸💌✨]\s*$/u, '')}`));
    card.append(open);
    photoGrid.append(card);
  });
  renderPhotoSequence();
  photoIndex.hidden = true;
  photoGallery.hidden = false;
  phaseFour.scrollTop = 0;
  if (animate && !reduceMotion) gsap.fromTo('.photo-gallery__head, .photo-card, .photo-sequence',
    { autoAlpha:0, y:14 }, { autoAlpha:1, y:0, duration:.42, stagger:{ each:.018, from:'start' }, ease:'power2.out', clearProps:'all' });
  photoGalleryTitle.focus({ preventScroll:true });
}

function showPhotoIndex(){
  if (photoViewer.open) photoViewer.close();
  photoGallery.hidden = true;
  photoIndex.hidden = false;
  phaseFour.scrollTop = 0;
  $('photoJourneyTitle').focus({ preventScroll:true });
}

function updatePhotoViewer(){
  const photo = photoCollectionItems[photoViewerIndex];
  if (!photo) return;
  const collection = photoCollection(photoCollectionId);
  photoViewerImage.src = photo.asset;
  photoViewerImage.alt = `Photograph ${photoViewerIndex + 1} of ${photoCollectionItems.length} from ${collection.title.replace(/\s*[❤️🎁📸💌✨]\s*$/u, '')}`;
  photoViewerPosition.textContent = `${String(photoViewerIndex + 1).padStart(2, '0')} / ${String(photoCollectionItems.length).padStart(2, '0')}`;
  if (photo.caption) {
    photoViewerCaption.hidden = false;
    photoViewerCaption.textContent = photo.caption;
  } else {
    photoViewerCaption.hidden = true;
    photoViewerCaption.textContent = '';
  }
  [photoCollectionItems[photoViewerIndex - 1], photoCollectionItems[photoViewerIndex + 1]].filter(Boolean).forEach((next) => {
    const preload = new Image(); preload.src = next.asset;
  });
}

function openPhotoViewer(index, returnFocus){
  if (!photoCollectionItems.length) return;
  photoViewerIndex = (index + photoCollectionItems.length) % photoCollectionItems.length;
  photoViewerReturnFocus = returnFocus;
  updatePhotoViewer();
  photoViewer.showModal();
  photoViewerClose.focus({ preventScroll:true });
}

function stepPhotoViewer(direction){
  if (!photoViewer.open || !photoCollectionItems.length) return;
  photoViewerIndex = (photoViewerIndex + direction + photoCollectionItems.length) % photoCollectionItems.length;
  updatePhotoViewer();
}

async function startPhaseFour(){
  if (phaseFourStarted) return;
  phaseFourStarted = true;
  photoManifest = await photoManifestPromise;
  phaseFour.hidden = false;
  phaseFour.removeAttribute('inert');
  phaseFour.setAttribute('aria-hidden', 'false');
  phaseFour.classList.add('is-active');
  gsap.set(phaseFour, { autoAlpha:0 });
  renderPhotoIndex();
  gsap.to(phaseFour, { autoAlpha:1, duration:reduceMotion ? .01 : .62, ease:'power2.out', onComplete:() => {
    storyTransitioning = false;
    storyContinue.disabled = false;
    if (photoManifest) $('photoJourneyTitle').focus({ preventScroll:true });
    else photoIndex.querySelector('h2')?.focus({ preventScroll:true });
  } });
}

function p5ShowScreen(name, focusSelector){
  if (p5Transitioning) return;
  const target = p5Screens.find((screen) => screen.dataset.p5Screen === name);
  if (!target) return;
  p5Transitioning = true;
  const current = p5Screens.find((screen) => screen.dataset.p5Screen === p5CurrentScreen);
  const reveal = () => {
    p5Screens.forEach((screen) => {
      const active = screen === target;
      screen.hidden = !active;
      screen.setAttribute('aria-hidden', String(!active));
      if (active) gsap.set(screen, { autoAlpha:1, y:0 });
    });
    p5CurrentScreen = name;
    phaseFive.scrollTop = 0;
    gsap.fromTo(target, { autoAlpha:0, y:10 }, { autoAlpha:1, y:0, duration:reduceMotion ? .01 : .42, ease:'power3.out' });
    const focus = focusSelector ? target.querySelector(focusSelector) : target.querySelector('h2,button');
    focus?.focus({ preventScroll:true });
    birthdayExperience.scrollTop = 0;
    phaseFive.scrollTop = 0;
    p5Transitioning = false;
  };
  if (current && !current.hidden){
    gsap.to(current, { autoAlpha:0, y:-8, duration:reduceMotion ? .01 : .24, ease:'power2.in', onComplete:reveal });
  } else reveal();
}

async function startPhaseFive(){
  if (phaseFiveStarted) return;
  phaseFiveStarted = true;
  p5Photos = await phase5PhotoPromise;
  birthdayExperience.scrollTop = 0;
  phaseFour.classList.remove('is-active');
  phaseFour.setAttribute('aria-hidden','true'); phaseFour.setAttribute('inert',''); phaseFour.hidden = true;
  phaseFive.hidden = false; phaseFive.removeAttribute('inert'); phaseFive.setAttribute('aria-hidden','false'); phaseFive.classList.add('is-active');
  p5Screens.forEach((screen) => { screen.hidden = screen.dataset.p5Screen !== 'video'; screen.setAttribute('aria-hidden',String(screen.dataset.p5Screen !== 'video')); });
  p5CurrentScreen = 'video'; phaseFive.scrollTop = 0;
  gsap.fromTo(phaseFive, { autoAlpha:0 }, { autoAlpha:1, duration:reduceMotion ? .01 : .58, ease:'power2.out', onComplete:() => { $('p5VideoTitle').focus({preventScroll:true}); birthdayExperience.scrollTop = 0; phaseFive.scrollTop = 0; } });
  if (p5Video.readyState >= 1) p5VideoStatus.textContent = 'Your birthday wish is ready when you are. ❤️';
  else p5VideoStatus.textContent = 'Preparing your birthday wish…';
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('phase5test')) p5DevBypass.hidden = false;
}

function p5GoToQuestion(){
  if (p5CurrentScreen !== 'video' || !p5VideoCompletionHandled || p5Transitioning) return;
  p5Video.pause();
  p5ShowScreen('question','#p5QuestionTitle');
}

function p5BeginGiftMessage(){
  if (p5Transitioning) return;
  p5MessageIndex = 0;
  p5RenderGiftMessage();
  p5ShowScreen('message','#p5MessageText');
}

function p5RenderGiftMessage(){
  p5MessageText.textContent = phase5GiftMessages[p5MessageIndex];
  p5MessageCounter.textContent = `${String(p5MessageIndex + 1).padStart(2,'0')} / ${String(phase5GiftMessages.length).padStart(2,'0')}`;
}

function p5BeginReveal(){
  p5RevealIndex = 0;
  p5RenderReveal();
  p5ShowScreen('reveal','#p5RevealText');
}

function p5RenderReveal(){
  if (p5RevealIndex === 0) p5RevealText.textContent = 'And now, Ammaaa…';
  else if (p5RevealIndex === 1) p5RevealText.textContent = 'Presenting…';
  else if (p5RevealIndex === 2) p5RevealText.textContent = 'YOUR MAGA! 🥹❤️';
  else p5RevealText.textContent = phase5RevealMessages[p5RevealIndex - 3];
  const showingMaga = p5RevealIndex === 2;
  p5RevealPhoto.hidden = !showingMaga;
  p5RevealImage.src = assetUrl('/memories/final-gift/Snapchat-88676842.jpg');
  p5RevealPhoto.classList.toggle('is-revealed', showingMaga);
  if (showingMaga) gsap.fromTo(p5RevealPhoto, { autoAlpha:0, y:18, scale:.985 }, { autoAlpha:1, y:0, scale:1, duration:reduceMotion ? .01 : .8, ease:'power3.out' });
  p5RevealCounter.textContent = `${String(p5RevealIndex + 1).padStart(2,'0')} / ${String(3 + phase5RevealMessages.length).padStart(2,'0')}`;
  $('p5RevealContinue').textContent = p5RevealIndex === 2 ? 'Open your gift →' : 'Continue →';
}

function p5BeginPhotos(){
  p5PhotoIndex = 0;
  p5RenderPhoto();
  p5ShowScreen('photos','#p5PhotosTitle');
}

function p5RenderPhoto(){
  const photo = p5Photos[p5PhotoIndex];
  if (!photo){ p5ShowScreen('ending','#p5EndingTitle'); return; }
  p5Photo.src = photo.asset; p5Photo.alt = photo.alt || 'A photograph of Ashish'; p5Photo.loading = 'lazy';
  p5PhotoCount.textContent = `${String(p5PhotoIndex + 1).padStart(2,'0')} / ${String(p5Photos.length).padStart(2,'0')}`;
  $('p5PhotoContinue').textContent = p5PhotoIndex === p5Photos.length - 1 ? 'To the last page →' : 'Continue →';
}

function p5BeginFinalVideo(){
  if (p5Transitioning || p5CurrentScreen !== 'ending') return;
  p5ShowScreen('final-video','#p5FinalVideoTitle');
  p5FinalVideoStatus.textContent = 'Your final birthday film is ready. ❤️';
  // This call is made directly from the visitor's button gesture; browsers
  // that allow user-initiated playback can begin it, while native controls
  // remain available when playback must be started manually.
  const playback = p5FinalVideo.play();
  if (playback && typeof playback.catch === 'function') playback.catch(() => {
    p5FinalVideoStatus.textContent = 'Tap play when you’re ready to watch your final birthday film. ❤️';
  });
}

function p5VideoWasWatchedThrough(video){
  const duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0) return false;
  const ranges = video.played;
  let watchedThrough = 0;
  for (let index = 0; index < ranges.length; index += 1) {
    const start = ranges.start(index);
    const end = ranges.end(index);
    if (start > watchedThrough + 0.15) return false;
    watchedThrough = Math.max(watchedThrough, end);
  }
  return watchedThrough >= duration - 0.25;
}

function p5AnimateNo(){
  if (p5Transitioning) return;
  p5NoResponse.textContent = phase5NoMessages[p5NoIndex % phase5NoMessages.length];
  p5NoIndex += 1;
  gsap.fromTo(p5NoResponse, { autoAlpha:0, y:8, scale:.98 }, { autoAlpha:1, y:0, scale:1, duration:reduceMotion ? .01 : .32, ease:'back.out(1.7)' });
  const heart = document.createElement('span'); heart.className = 'p5-float-heart'; heart.setAttribute('aria-hidden','true'); heart.textContent = '♥';
  $('p5Yes').append(heart);
  gsap.to(heart,{ y:-38, x:12, autoAlpha:0, scale:1.35, duration:reduceMotion ? .01 : .7, ease:'power1.out', onComplete:() => heart.remove() });
}

/* the tree's own rAF: plays once from treeStart(), then holds, living */
let treeStartT = 0, treeLastT = 0, treeRAF = 0, lastPetal = 0;
window.bdayDone = false;

function treeFrame(now){
  if (!treeStartT){ treeStartT = now; treeLastT = now; }
  const t  = (now - treeStartT) / 1000;
  const dt = Math.min(0.05, (now - treeLastT) / 1000); treeLastT = now;

  const rays = clamp01((t - T.bloomT0) / T.bloomSpan);

  drawBackground();
  drawGodRays(t, rays);
  drawGlow(t);
  drawBokeh(t, dt);
  drawFloaters(t, dt, false);
  drawBranches(t);
  drawHearts(t);
  updateTwinkles(t, dt);
  if (t > T.petalT0 && now - lastPetal > 150){ spawnPetal(); spawnPetal(); lastPetal = now; }
  drawPetals(t, dt);
  drawRested();
  drawFloaters(t, dt, true);

  if (!window.bdayDone && t >= T.done) window.bdayDone = true;
  if (!phaseTwoStarted && t >= T.done + 1.0){
    startPhaseTwo();
    treeRAF = 0;
    return;
  }

  treeRAF = requestAnimationFrame(treeFrame);
}

function treeStart(){
  treeStartT = 0; treeLastT = 0; lastPetal = 0; window.bdayDone = false;
  if (wishTL) wishTL.kill();
  showWish(false);
  wishStages.forEach((item) => {
    item.classList.remove('is-active');
    item.setAttribute('aria-hidden', 'true');
    gsap.set(item.children, { clearProps: 'all' });
  });
  wishTL = gsap.timeline();
  wishTL.call(() => revealWishStage('greeting'), [], 0.85)
    .call(() => revealWishStage('meaning'), [], 5.0)
    .call(() => revealWishStage('always'), [], 9.0)
    .call(() => revealWishStage('personal'), [], 13.0)
    .call(() => revealWishStage('final'), [], 19.0);
  cue('grow');
  buildScene();
  if (!treeRAF) treeRAF = requestAnimationFrame(treeFrame);
}
function treeStop(){
  if (wishTL){ wishTL.kill(); wishTL = null; }
  if (treeRAF){ cancelAnimationFrame(treeRAF); treeRAF = 0; }
  ctx.clearRect(0, 0, W, H);
}

function drawFinal(){
  buildScene();
  drawBackground(); drawGodRays(0, 1); drawGlow(T.done); drawBokeh(0, 0); drawFloaters(99, 0, false);
  drawBranches(99); drawHearts(99);
  for (let i = 0; i < 40; i++){ const h = hearts[(Math.random() * hearts.length) | 0]; if (h) rested.push({ x: clamp(h.x + rand(-W * 0.3, W * 0.3), 6, W - 6), y: groundY + rand(-6, H * 0.05), box: h.box * 0.5, idx: h.idx, rot: rand(0, 6.28), a: 0.85 }); }
  drawRested(); drawFloaters(99, 0, true);
  wishStages.forEach((item) => {
    item.classList.add('is-active');
    item.setAttribute('aria-hidden', 'false');
  });
  showWish(true);
  window.bdayDone = true;
}

/* ============================================================
   ACTS 1–3 (GSAP) — the bow, the shot, the wish
   ============================================================ */

/* the two headline words become per-glyph spans so each hinges up on its own */
function splitWord(el){
  const chars = [...el.textContent];
  el.textContent = '';
  return chars.map((c) => {
    const s = document.createElement('span');
    s.className = 'hl__ch';
    s.textContent = c === ' ' ? ' ' : c;
    el.appendChild(s);
    return s;
  });
}
const line1Chars = splitWord($('wLine1'));
const line2Chars = splitWord($('wLine2'));
const kChars = [...line1Chars, ...line2Chars];

/* drifting light motes behind the scene */
function buildMotes(){
  motes.innerHTML = '';
  for (let i = 0; i < 12; i++){
    const m = document.createElement('span');
    m.className = 'mote';
    const s = rand(4, 12);
    m.style.width = m.style.height = `${s}px`;
    m.style.left = `${rand(4, 96)}%`;
    m.style.top  = `${rand(10, 96)}%`;
    motes.appendChild(m);
    gsap.set(m, { opacity: rand(0.25, 0.7) });
    gsap.to(m, { y: -rand(40, 140), x: rand(-30, 30), duration: rand(7, 14), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: -rand(0, 8) });
    gsap.to(m, { opacity: rand(0.1, 0.5), duration: rand(2.5, 5), repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }
}

/* --- bow geometry (measured; re-measured on resize) -------------------------
   The rig lives lower-left and is rotated so its local "up" axis points at the
   heart; the shot therefore travels on a diagonal. The draw + arrow math all
   live in the rig's LOCAL space (offset geometry is transform-independent, so
   rotation never corrupts it); only the aim ANGLE and the flight DISTANCE come
   from screen measurements. */
const tip = $('tip');
let svgScale = 1, arrowBaseX = 0, arrowBaseY = 0, maxDraw = 120, curDraw = 0;
let pullUX = 0, pullUY = 1;                               // screen unit: string pull-back
const REST_NOCK = 96;                                    // string nock, in bow viewBox units
const nockProxy = { val: REST_NOCK };

function applyNock(){
  const y = nockProxy.val;
  strL.setAttribute('y2', y); strR.setAttribute('y2', y); serving.setAttribute('cy', y);
}

function refreshRig(){
  // the grip is anchored here, and the heart sits at its layout centre (33% down,
  // centred) — using the layout point, not a live rect, keeps the aim steady even
  // while the heart is scaling in.
  const gripX = W * 0.24, gripY = H * 0.76;
  const heartX = W * 0.5, heartY = H * 0.33;
  // rotation so local "up" (0,-1) maps to the grip→heart direction
  const aimRad = Math.atan2(heartX - gripX, gripY - heartY);
  pullUX = -Math.sin(aimRad); pullUY = Math.cos(aimRad);  // opposite of aim = pull-back

  // #bow / #arrow are SVG — no offset* — so measure rects in the rig's LOCAL
  // frame: neutralise the rig transform first (getBBox-style, sync, no paint).
  nockProxy.val = REST_NOCK; applyNock();
  gsap.set(archery, { rotation: 0, scale: 1, x: 0, y: 0 });
  archery.style.left = '0px'; archery.style.top = '0px';
  gsap.set(arrow, { x: 0, y: 0 });
  const aR = archery.getBoundingClientRect();
  const bR = bow.getBoundingClientRect();
  const sR = serving.getBoundingClientRect();
  const rR = arrow.getBoundingClientRect();
  svgScale = bR.width / 460;
  const gripLX = (bR.left - aR.left) + 0.5 * bR.width;
  const gripLY = (bR.top  - aR.top ) + (240 / 300) * bR.height;   // grip ~y240 in viewBox
  const nockLX = (sR.left - aR.left) + 0.5 * sR.width;
  const nockLY = (sR.top  - aR.top ) + 0.5 * sR.height;
  arrowBaseX = nockLX - ((rR.left - aR.left) + 0.5 * rR.width);
  arrowBaseY = nockLY - ((rR.top  - aR.top ) + (205 / 220) * rR.height);

  // anchor the grip at (gripX,gripY) and rotate the rig around it
  archery.style.left = (gripX - gripLX) + 'px';
  archery.style.top  = (gripY - gripLY) + 'px';
  gsap.set(archery, { transformOrigin: `${gripLX}px ${gripLY}px`, rotation: aimRad * 180 / Math.PI });
  gsap.set(arrow, { x: arrowBaseX, y: arrowBaseY });
  maxDraw = Math.min(bR.height * 0.72, H * 0.16, 132);
  curDraw = 0;
}

function setDraw(d){
  curDraw = clamp(d, 0, maxDraw);
  gsap.set(arrow, { x: arrowBaseX, y: arrowBaseY + curDraw });   // local +Y = pull back
  nockProxy.val = REST_NOCK + curDraw / svgScale; applyNock();
  gsap.set(aim, { opacity: 0.55 * (curDraw / maxDraw) });
}

/* the target heart's beat — gentle, alive; killed the instant we fire */
let beatTL = null;
function startBeat(){
  gsap.set(targetHeart, { scale: 1 });
  gsap.set(heartGlow, { scale: 1, opacity: 0.7 });
  beatTL = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
  beatTL.to(targetHeart, { scale: 1.07, duration: 0.13, ease: 'power2.out' }, 0)
        .to(heartGlow,   { scale: 1.15, opacity: 0.9, duration: 0.13, ease: 'power2.out' }, 0)
        .to(targetHeart, { scale: 1.0, duration: 0.2, ease: 'power2.in' }, 0.13)
        .to(targetHeart, { scale: 1.05, duration: 0.12, ease: 'power2.out' }, 0.3)
        .to(targetHeart, { scale: 1.0, duration: 0.5, ease: 'power2.inOut' }, 0.42)
        .to(heartGlow,   { scale: 1.0, opacity: 0.7, duration: 0.7, ease: 'power2.inOut' }, 0.3);
}
function stopBeat(){ if (beatTL){ beatTL.kill(); beatTL = null; } gsap.set(targetHeart, { scale: 1 }); }

/* a little burst of hearts + sparks where the arrow strikes */
function miniHeartSVG(fill){
  return `<svg viewBox="0 0 24 22" width="100%" height="100%"><path d="M12 20C5.5 15 1.5 11.4 1.5 6.9 1.5 3.6 4 1.5 7 1.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3 0 5.5 2.1 5.5 5.4C23.5 11.4 19.5 15 12 20Z" fill="${fill}"/></svg>`;
}
function burstHearts(){
  const r = target.getBoundingClientRect();
  const hr = hero.getBoundingClientRect();
  const ox = r.left - hr.left + r.width / 2;
  const oy = r.top - hr.top + r.height * 0.42;
  const cols = ['#ff6f97', '#ffb14e', '#ff8fae', '#ffd36a', '#e23b67'];
  const frag = document.createDocumentFragment();
  const nodes = [];
  for (let i = 0; i < 12; i++){
    const heart = i < 8;
    const el = document.createElement('span');
    el.className = 'burst';
    const s = heart ? rand(12, 22) : rand(4, 8);
    el.style.cssText = `position:absolute;left:${ox}px;top:${oy}px;width:${s}px;height:${s}px;margin:${-s / 2}px 0 0 ${-s / 2}px;pointer-events:none;z-index:4;`;
    if (heart) el.innerHTML = miniHeartSVG(pick(cols));
    else { el.style.borderRadius = '50%'; el.style.background = 'radial-gradient(circle,#fff,rgba(255,210,150,0) 70%)'; }
    frag.appendChild(el); nodes.push({ el, heart });
  }
  hero.appendChild(frag);
  nodes.forEach(({ el, heart }) => {
    const ang = rand(-Math.PI, 0);                       // fan upward + out
    const dist = rand(heart ? 70 : 40, heart ? 190 : 120);
    gsap.to(el, {
      x: Math.cos(ang) * dist, y: Math.sin(ang) * dist - rand(10, 50),
      rotation: rand(-120, 120), scale: heart ? rand(0.7, 1.2) : rand(0.4, 1),
      duration: rand(0.7, 1.15), ease: 'power2.out',
    });
    gsap.to(el, { opacity: 0, duration: 0.5, delay: rand(0.35, 0.6), ease: 'power1.in', onComplete: () => el.remove() });
  });
}

/* --- the shot + Acts 2–3 timeline ------------------------------------------ */
function shotGeom(){
  // flight distance = straight-line from the arrow tip to the heart (measured on
  // screen, rotation-aware). Moving the arrow that far along its local "up" axis
  // — which is aimed at the heart — lands the tip dead-centre on it.
  const tipR = tip.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();
  const tipX = tipR.left + tipR.width / 2, tipY = tipR.top + tipR.height / 2;
  const tcx = tRect.left + tRect.width / 2, tcy = tRect.top + tRect.height / 2;
  const flightDist = Math.hypot(tcx - tipX, tcy - tipY);
  const fallPx = Math.min(H * 0.26, H - tcy - tRect.height * 0.4);
  const impactX = tcx, impactY = tcy + fallPx;
  const distC = Math.hypot(Math.max(impactX, W - impactX), Math.max(impactY, H - impactY));
  const reach = Math.hypot(W / 2, H / 2);
  return {
    arrowStartY: arrowBaseY + curDraw,
    arrowFlyY:   arrowBaseY + curDraw - flightDist,       // local -Y = toward the heart
    drawnNock:   REST_NOCK + curDraw / svgScale,
    fallPx, fx: impactX - W / 2, fy: impactY - H / 2,
    floodScale: (distC * 1.12) / 70, bloomScale: (reach * 1.2) / 30,
  };
}

let filmTL = null;
function buildFilm(m){
  const t = gsap.timeline({
    paused: true,
    onComplete: () => {
      gsap.set(field, { autoAlpha: 0 });
      treeStart();
      // fade promptly so the growing tree is revealed with no white hold
      gsap.to(bloom, { autoAlpha: 0, duration: 1.15, ease: 'power2.out' });
    },
  });

  // reset (t=0)
  t.set(target, { y: 0, scaleX: 1, scaleY: 1, opacity: 1 })
   .set(arrow, { opacity: 1, x: arrowBaseX, y: m.arrowStartY, scaleY: 1 })
   .set([flood, bloom], { autoAlpha: 0, scale: 0.001, x: 0, y: 0 })
   .set(flood, { x: m.fx, y: m.fy })
   .set(field, { autoAlpha: 0 })
   .set('.blob', { opacity: 0 })
   .set(camera, { scale: 1, yPercent: 0 })
   .set(fgrid, { xPercent: 0, yPercent: 0 })
   .set(barTop, { yPercent: -100 })
   .set(barBot, { yPercent: 100 })
   .set(kEyebrow, { opacity: 0, y: 12 })
   .set(kSub, { opacity: 0, y: 12 })
   .set(kFinal, { autoAlpha: 0, y: 12 })
   .set(kFinalLines, { autoAlpha: 0, y: 14 })
   .set(kChars, { transformPerspective: 620, transformOrigin: '50% 100%', yPercent: 135, rotationX: -82 })
   .set(uline, { drawn: 0 });

  // --- the shot: string snaps (twang), arrow flies up into the heart --------
  t.fromTo(nockProxy, { val: m.drawnNock }, { val: REST_NOCK, duration: 0.5, ease: 'elastic.out(1,0.34)', onUpdate: applyNock }, 0)
   .to(arrow, { y: m.arrowFlyY, duration: 0.26, ease: 'power2.in' }, 0)
   .to(arrow, { scaleY: 1.16, duration: 0.14, ease: 'power2.in' }, 0)
   .to(arrow, { scaleY: 1.0, duration: 0.1, ease: 'power1.out' }, 0.16)
   .to(aim, { opacity: 0, duration: 0.18 }, 0)
   .to([eyebrow, hint], { opacity: 0, duration: 0.2, ease: 'power1.out' }, 0);

  // --- the strike: the arrow embeds, the heart recoils, then holds pierced --
  t.add(burstHearts, 0.26)
   // recoil along the arrow's line (up + right), springing back
   .to(target, { x: 7, y: -9, duration: 0.06, ease: 'power2.out' }, 0.26)
   .to(target, { x: 0, y: 0, duration: 0.32, ease: 'power2.out' }, 0.32)
   .to(target, { scale: 1.14, duration: 0.06, ease: 'power2.out' }, 0.26)
   .to(target, { scale: 1.0, duration: 0.26, ease: 'power2.inOut' }, 0.32)
   // the arrow shudders in the wound, holds embedded so the hit reads, then sinks in
   .to(arrow, { rotation: '+=4', duration: 0.05, yoyo: true, repeat: 4, ease: 'sine.inOut' }, 0.27)
   .set(arrow, { rotation: 0 }, 0.52)
   .to(arrow, { opacity: 0, duration: 0.16, ease: 'power1.out' }, 0.56);

  // --- the fall + the burst / flood -----------------------------------------
  t.to(target, { y: m.fallPx, scaleX: 0.84, scaleY: 1.3, duration: 0.34, ease: 'power1.in' }, 0.64)
   .to(target, { scaleX: 1.4, scaleY: 0.6, duration: 0.07, ease: 'power2.out' }, 0.98)
   .set(flood, { autoAlpha: 1 }, 1.00)
   .fromTo(flood, { scale: 0.02 }, { scale: m.floodScale, duration: 0.34, ease: 'power2.in' }, 1.00)
   .to(target, { opacity: 0, duration: 0.12, ease: 'power1.out' }, 1.06);

  // seam: the field is the same rose as the flood
  t.set(field, { autoAlpha: 1 }, 1.32)
   .set(hero, { autoAlpha: 0 }, 1.33)
   .to('.blob', { opacity: 1, duration: 0.6, ease: 'power2.out' }, 1.34)
   .set(flood, { autoAlpha: 0 }, 1.36);

  // --- the camera push -------------------------------------------------------
  // duration matched to when the bloom covers (3.98) — a longer push used to
  // keep the timeline (and a white bloom) alive after the tree should already
  // be growing, which read as dead time before the tree appeared.
  t.fromTo(camera, { scale: 1.0, yPercent: 0 }, { scale: 1.07, yPercent: -1.3, duration: 8.4, ease: 'none' }, 1.38)
   .fromTo(fgrid, { xPercent: 0, yPercent: 0 }, { xPercent: -1.5, yPercent: -1.0, duration: 8.4, ease: 'none' }, 1.38);

  // beat markers for the recorder's soundtrack (no-ops off ?record)
  t.call(cue, ['hit'], 0.26)
   .call(cue, ['flood'], 1.00)
   .call(cue, ['wish'], 1.68)
   .call(cue, ['wish2'], 2.06)
   .call(cue, ['bloom'], 3.42);

  // cinema bars ease into a letterbox
  t.to(barTop, { yPercent: 0, duration: 0.6, ease: 'power2.out' }, 1.5)
   .to(barBot, { yPercent: 0, duration: 0.6, ease: 'power2.out' }, 1.5);

  // --- the kinetic wish ------------------------------------------------------
  t.to(kEyebrow, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 1.54)
   .to(line1Chars, { yPercent: 0, rotationX: 0, duration: 0.55, ease: 'power3.out', stagger: 0.033 }, 1.68)
   .to(line2Chars, { yPercent: 0, rotationX: 0, duration: 0.62, ease: 'power3.out', stagger: 0.033 }, 2.6)
   .to(uline, { drawn: 1, duration: 0.45, ease: 'power2.inOut' }, 3.55)
   .to(kSub, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 4.0)
   .to(kFinal, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 5.05)
   .to(kFinalLines, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.75 }, 5.2);

  // --- the handoff bloom -----------------------------------------------------
  t.to(barTop, { yPercent: -100, duration: 0.5, ease: 'power2.in' }, 9.35)
   .to(barBot, { yPercent: 100, duration: 0.5, ease: 'power2.in' }, 9.35)
   .set(bloom, { autoAlpha: 1 }, 9.45)
   .fromTo(bloom, { scale: 0.02 }, { scale: m.bloomScale, duration: 0.58, ease: 'power2.in' }, 9.45);

  return t;
}

/* --- draw / release interaction -------------------------------------------- */
let played = false, drawing = false, startPX = 0, startPY = 0, startDraw = 0;

function fire(){
  if (played) return;
  played = true;
  drawing = false;
  stopBeat();
  cue('release'); cue('whoosh');
  filmTL = buildFilm(shotGeom());
  filmTL.play(0);
}

function springBack(){
  const from = curDraw;
  gsap.to({ d: from }, { d: 0, duration: 0.55, ease: 'elastic.out(1,0.4)', onUpdate() { setDraw(this.targets()[0].d); } });
}

function autoFire(){
  if (played) return;
  recT0 = performance.now(); cue('draw');       // t=0 of the soundtrack
  gsap.to({ d: curDraw }, {
    d: maxDraw * 0.94, duration: 0.62, ease: 'power2.inOut',
    onUpdate() { setDraw(this.targets()[0].d); },
    onComplete: () => gsap.delayedCall(0.16, fire),
  });
}

archery.addEventListener('pointerdown', (e) => {
  if (played) return;
  drawing = true;
  try { archery.setPointerCapture(e.pointerId); } catch (_) {}
  startPX = e.clientX; startPY = e.clientY; startDraw = curDraw;
  e.preventDefault();
});
archery.addEventListener('pointermove', (e) => {
  if (!drawing) return;
  // project the drag onto the pull-back axis, so dragging back along the aim
  // (down + away from the heart) draws the string — on any shot angle.
  const proj = (e.clientX - startPX) * pullUX + (e.clientY - startPY) * pullUY;
  setDraw(startDraw + proj);
});
function endDraw(){
  if (!drawing) return;
  drawing = false;
  if (curDraw > maxDraw * 0.26) fire(); else springBack();
}
archery.addEventListener('pointerup', endDraw);
archery.addEventListener('pointercancel', endDraw);
archery.addEventListener('keydown', (e) => {
  if (played) return;
  if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); autoFire(); }
});

/* boot Act 1: reveal the target + bow + hint, then start the beat */
function enter(){
  gsap.set(hero, { autoAlpha: 1 });
  refreshRig();
  setDraw(0);
  gsap.set([eyebrow, hint], { opacity: 0, y: 14 });
  gsap.set(target, { opacity: 0, y: 10, scaleX: 0.9, scaleY: 0.9 });
  gsap.set(archery, { opacity: 0, scale: 0.85 });        // scale from the grip; keeps rotation
  gsap.set(heartGlow, { opacity: 0, scale: 1 });
  gsap.set(arrow, { opacity: 1 });

  const tl = gsap.timeline({ onComplete: startBeat });
  tl.to(target,   { opacity: 1, y: 0, scaleX: 1, scaleY: 1, duration: 0.8, ease: 'power3.out' }, 0.1)
    .to(heartGlow,{ opacity: 0.7, duration: 0.8, ease: 'power2.out' }, 0.2)
    .to(archery,  { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0.28)
    .to(eyebrow,  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.4)
    .to(hint,     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.7);
}

/* ============================================================
   SIZING + BOOT
   ============================================================ */
function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.clientWidth; H = canvas.clientHeight;
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildSprites();
  buildScene();
  if (reduceMotion){ drawFinal(); return; }
  if (played && filmTL){
    const at = filmTL.time(); const active = filmTL.isActive();
    filmTL = buildFilm(shotGeom());
    filmTL.pause(at);
    if (active) filmTL.play(at);
  } else {
    refreshRig(); setDraw(0);
  }
}
let resizeRAF = 0;
window.addEventListener('resize', () => { if (resizeRAF) return; resizeRAF = requestAnimationFrame(() => { resizeRAF = 0; resize(); }); });

resize();
renderBalloonChoices();
makeWishButton.addEventListener('click', activateWish);
continueToBalloons.addEventListener('click', continueToBalloonScene);
openStoryButton.addEventListener('click', openPhaseThree);
['photoIndexContinue','photoGalleryContinue'].forEach((id) => $(id).addEventListener('click', startPhaseFive));
$("p5DevBypass").addEventListener('click', () => { if (import.meta.env.DEV) p5GoToQuestion(); });
$("p5Yes").addEventListener('click', p5BeginGiftMessage);
$("p5No").addEventListener('click', p5AnimateNo);
$("p5MessageContinue").addEventListener('click', () => {
  if (p5Transitioning) return;
  p5MessageIndex += 1;
  if (p5MessageIndex >= phase5GiftMessages.length) p5BeginReveal();
  else { p5RenderGiftMessage(); $('p5MessageText').focus({preventScroll:true}); birthdayExperience.scrollTop = 0; phaseFive.scrollTop = 0; }
});
$("p5RevealContinue").addEventListener('click', () => {
  if (p5Transitioning) return;
  p5RevealIndex += 1;
  if (p5RevealIndex >= 3 + phase5RevealMessages.length) p5BeginPhotos();
  else { p5RenderReveal(); p5RevealText.focus({preventScroll:true}); birthdayExperience.scrollTop = 0; phaseFive.scrollTop = 0; }
});
$("p5PhotoContinue").addEventListener('click', () => { if (p5Transitioning) return; p5PhotoIndex += 1; p5RenderPhoto(); birthdayExperience.scrollTop = 0; phaseFive.scrollTop = 0; });
$("p5FinalVideoContinue").addEventListener('click', p5BeginFinalVideo);
let p5FinalVideoCompletionHandled = false;
p5FinalVideo.addEventListener('loadeddata', () => {
  p5FinalVideoRetry.hidden = true;
  p5FinalVideoStatus.textContent = 'Your final birthday film is ready. ❤️';
});
p5FinalVideo.addEventListener('error', () => {
  p5FinalVideoStatus.textContent = 'The final birthday film could not be loaded. Please retry when you’re ready.';
  p5FinalVideoRetry.hidden = false;
});
p5FinalVideoRetry.addEventListener('click', () => {
  p5FinalVideoRetry.hidden = true;
  p5FinalVideoStatus.textContent = 'Retrying your final birthday film… ❤️';
  p5FinalVideo.load();
  const playback = p5FinalVideo.play();
  if (playback && typeof playback.catch === 'function') playback.catch(() => {
    p5FinalVideoStatus.textContent = 'The film is ready to try again with the play control. ❤️';
  });
});
p5FinalVideo.addEventListener('ended', () => {
  if (p5CurrentScreen !== 'final-video' || p5FinalVideoCompletionHandled || !p5VideoWasWatchedThrough(p5FinalVideo)) return;
  p5FinalVideoCompletionHandled = true;
  p5ShowScreen('closing','#p5ClosingTitle');
  const lines = [...document.querySelectorAll('.p5-closing-line, .p5-closing-verse, .p5-closing-conclusion')];
  gsap.fromTo(lines, { autoAlpha:0, y:reduceMotion ? 0 : 12 }, {
    autoAlpha:1, y:0, duration:reduceMotion ? .01 : .7, stagger:reduceMotion ? 0 : .32, ease:'power2.out', delay:reduceMotion ? 0 : .12,
  });
});
let p5VideoCompletionHandled = false;
p5Video.addEventListener('loadeddata', () => { p5RetryVideo.hidden = true; p5VideoStatus.textContent = 'Your birthday wish is ready when you are. ❤️'; });
p5Video.addEventListener('loadedmetadata', () => {
  p5RetryVideo.hidden = true;
  p5VideoStatus.textContent = 'Your birthday wish is ready when you are. ❤️';
});
p5Video.addEventListener('play', () => {
  p5VideoStatus.textContent = 'A little message from your Maga… ❤️';
});
p5Video.addEventListener('ended', () => {
  if (p5CurrentScreen !== 'video' || p5VideoCompletionHandled) return;
  const duration = p5Video.duration;
  const played = p5Video.played;
  let watchedThrough = 0;
  let watchedFromBeginning = Number.isFinite(duration) && duration > 0;
  for (let index = 0; watchedFromBeginning && index < played.length; index += 1) {
    const start = played.start(index);
    const end = played.end(index);
    if (start > watchedThrough + 0.15) watchedFromBeginning = false;
    else watchedThrough = Math.max(watchedThrough, end);
  }
  if (!watchedFromBeginning || watchedThrough < duration - 0.25) {
    p5VideoStatus.textContent = 'Please watch the birthday wish from the beginning to continue. ❤️';
    return;
  }
  p5VideoCompletionHandled = true;
  p5VideoStatus.textContent = 'Birthday wish complete. ❤️';
  p5Continue.hidden = false;
  gsap.fromTo(p5Continue,
    { autoAlpha:0, y:12, scale:.98 },
    { autoAlpha:1, y:0, scale:1, duration:reduceMotion ? .01 : .55, ease:'power3.out' }
  );
});
p5Continue.addEventListener('click', p5GoToQuestion);
p5Video.addEventListener('error', () => {
  p5VideoStatus.textContent = 'The birthday video could not be loaded. Please try again; the surprise has not been skipped.';
  p5RetryVideo.hidden = false;
});
p5RetryVideo.addEventListener('click', () => {
  if (p5CurrentScreen !== 'video') return;
  p5RetryVideo.hidden = true;
  p5VideoStatus.textContent = 'Retrying your birthday wish… ❤️';
  p5Video.load();
});
storyContinue.addEventListener('click', continueStory);
photoFeature.addEventListener('click', () => {
  photoCollectionId = 'moments-together';
  photoCollectionItems = photoManifest?.photos.filter((photo) => photo.collection === photoCollectionId) || [];
  openPhotoViewer(0, photoFeature);
});
photoCollections.addEventListener('click', (event) => {
  const button = event.target.closest('[data-collection]');
  if (button && photoCollections.contains(button)) openPhotoCollection(button.dataset.collection);
});
photoGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-photo-index]');
  if (button && photoGrid.contains(button)) openPhotoViewer(Number(button.dataset.photoIndex), button);
});
photoSequence.addEventListener('click', (event) => {
  const button = event.target.closest('[data-collection]');
  if (button && photoSequence.contains(button) && button.dataset.collection !== photoCollectionId) openPhotoCollection(button.dataset.collection);
});
photoBack.addEventListener('click', showPhotoIndex);
photoBackBottom.addEventListener('click', showPhotoIndex);
photoViewerClose.addEventListener('click', () => photoViewer.close());
photoViewerPrev.addEventListener('click', () => stepPhotoViewer(-1));
photoViewerNext.addEventListener('click', () => stepPhotoViewer(1));
photoViewer.addEventListener('click', (event) => { if (event.target === photoViewer) photoViewer.close(); });
photoViewer.addEventListener('close', () => {
  if (photoViewerReturnFocus?.isConnected) photoViewerReturnFocus.focus({ preventScroll:true });
  photoViewerReturnFocus = null;
});
photoViewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); stepPhotoViewer(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); stepPhotoViewer(1); }
});
balloonGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.balloon-button');
  if (button && balloonGrid.contains(button)) popBalloon(button);
});

/* The passcode is an opening gate only; the existing four-phase sequence
   starts at its original Phase 1 entry point after a successful unlock. */

/* ============================================================
   RECORDING HOOK — the rig draws + fires after its pre-roll
   ============================================================ */
if (isRecord){
  window.bdayAPI = {
    start(){ autoFire(); },
  };
}
