const START = 28; 

const LINES = [
  { time: 32, text: "take me out tonight" },
  { time: 38, text: "because i want to see people" },
  { time: 40, text: "and i want to see life" },
  { time: 45, text: "driving in your car" },
  { time: 49, text: "oh please don't drop me home" },
  { time: 52, text: "because it's not my home, it's their home" },
  { time: 54, text: "and i'm welcome no more" },
  { time: 63, text: "and if a double-decker bus crashes into us" },
  { time: 70, text: "to die by your side is such a heavenly way to die ♥♥♥" }
];

const $ = id => document.getElementById(id);
const audio = $('audio'), lyric = $('lyric'), scene = $('scene'), bus = $('bus');
const intro = $('intro'), hint = $('hint'), vol = $('vol');

let current = -1, swapTimer, boostTimer, fadeFrame, baseVolume = +vol.value;

function showLine(i) {
  if (i === current) return;
  current = i;
  lyric.classList.remove('in');
  clearTimeout(swapTimer);
  swapTimer = setTimeout(() => {
    lyric.textContent = i < 0 ? '' : LINES[i].text;
    if (i >= 0) { void lyric.offsetWidth; lyric.classList.add('in'); }
  }, 220);
}

audio.addEventListener('timeupdate', () => {
  const t = audio.currentTime;
  let i = -1;
  for (let k = 0; k < LINES.length; k++) if (t >= LINES[k].time) i = k;
  showLine(i);
  if (t >= 31 && !hint.dataset.done) hint.classList.add('show');
});

const setRate = r => scene.getAnimations({ subtree: true }).forEach(a => a.updatePlaybackRate(r));

function fadeTo(target, ms = 700) {
  cancelAnimationFrame(fadeFrame);
  const from = audio.volume, t0 = performance.now();
  (function step(now) {
    const k = Math.min((now - t0) / ms, 1);
    audio.volume = from + (target - from) * k;
    if (k < 1) fadeFrame = requestAnimationFrame(step);
  })(t0);
}

bus.addEventListener('click', () => {
  if (audio.paused) return;
  hint.classList.remove('show');
  hint.dataset.done = '1';
  bus.classList.add('boost');
  setRate(2.2);
  fadeTo(Math.min(baseVolume + 0.3, 1));
  clearTimeout(boostTimer);
  boostTimer = setTimeout(() => {
    bus.classList.remove('boost');
    setRate(1);
    fadeTo(baseVolume);
  }, 3500);
});

audio.addEventListener('play', () => {
  scene.classList.add('driving');
  document.body.classList.add('playing');
});
['pause', 'ended'].forEach(ev => audio.addEventListener(ev, () => {
  scene.classList.remove('driving');
  document.body.classList.remove('playing');
}));

audio.addEventListener('error', () => {
  $('introNote').textContent = "Can't load the mp3 — check the file name and folder.";
  intro.classList.remove('hidden');
});

$('start').addEventListener('click', () => {
  audio.volume = baseVolume;
  audio.currentTime = START;
  audio.play().then(() => {
    document.body.classList.add('started');
    intro.classList.add('hidden');
  }).catch(() => {
    $('introNote').textContent = "Playback was blocked — tap Play again.";
  });
});

$('toggle').addEventListener('click', () => audio.paused ? audio.play() : audio.pause());

$('restart').addEventListener('click', () => {
  audio.currentTime = START;
  showLine(-1);
  hint.dataset.done = '';
  audio.play();
});

vol.addEventListener('input', () => {
  baseVolume = +vol.value;
  if (!bus.classList.contains('boost')) audio.volume = baseVolume;
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) scene.classList.remove('driving');
  else if (!audio.paused) scene.classList.add('driving');
});
