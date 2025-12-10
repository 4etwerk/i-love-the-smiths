// Инициализация частиц
particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: ["#00f3ff", "#ff00ff", "#ff5500", "#9d00ff", "#00ff88"] },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    }
  },
  retina_detect: true
});

// Основные элементы
const audio = document.getElementById('audio');
const lines = [
  { text: "take me out tonight", time: 32 },
  { text: "because i want to see people", time: 38 },
  { text: "and i want to see life", time: 40 },
  { text: "driving in your car", time: 45 },
  { text: "oh please don't drop me home", time: 49 },
  { text: "because it's not my home, it's their home", time: 52 },
  { text: "and i'm welcome no more", time: 54 },
  { text: "and if a double-decker bus crashes into us", time: 63 },
  { text: "to die by your side is such a heavenly way to die ♥♥♥", time: 70 }
];

let index = 0;
const lyricEl = document.getElementById('lyric');
const hintEl = document.getElementById('hint');
const carEl = document.getElementById('car');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const volumeSlider = document.getElementById('volumeSlider');

// Начальные настройки аудио
audio.volume = 0.1;
audio.currentTime = 28;

// Автозапуск музыки
setTimeout(() => {
  audio.play().catch(e => {
    console.log("Autoplay blocked. Click play button.");
    playBtn.style.display = 'flex';
  });
}, 500);

// Показать подсказку в 31 секунду
audio.addEventListener('timeupdate', () => {
  if (audio.currentTime >= 31 && !hintEl.classList.contains('show')) {
    hintEl.classList.add('show');
  }
});

// Клик на машину – движение + усиление звука
let isMoving = false;
carEl.addEventListener('click', () => {
  if (!isMoving) {
    isMoving = true;
    carEl.classList.add('moving');
    
    // Включить анимацию колес
    const wheels = document.querySelectorAll('.car-wheel');
    wheels.forEach(wheel => wheel.classList.add('wheel-spin'));
    
    // Показать выхлоп
    const exhaustSmoke = document.querySelectorAll('.exhaust-smoke');
    exhaustSmoke.forEach(smoke => smoke.style.opacity = '1');
    
    // Показать луч фары
    const lightBeam = document.querySelector('.light-beam');
    lightBeam.style.opacity = '0.6';
    
    // Показать свечение машины
    const carGlow = document.querySelector('.car-glow');
    carGlow.style.opacity = '0.3';
    
    // Запустить дорогу
    const road = document.querySelector('.road');
    road.style.animationPlayState = 'running';
    
    // Плавно усиливаем громкость до 0.4
    let step = (0.4 - audio.volume) / 60;
    let fade = setInterval(() => {
      if (audio.volume + step < 0.4) {
        audio.volume += step;
      } else {
        audio.volume = 0.4;
        clearInterval(fade);
      }
    }, 50);
    
    // Задержка перед остановкой анимации
    setTimeout(() => {
      isMoving = false;
      carEl.classList.remove('moving');
      wheels.forEach(wheel => wheel.classList.remove('wheel-spin'));
      exhaustSmoke.forEach(smoke => smoke.style.opacity = '0');
      lightBeam.style.opacity = '0';
      road.style.animationPlayState = 'paused';
      carGlow.style.opacity = '0';
    }, 3000);
  }
});

// Строки появляются в такт
audio.addEventListener('timeupdate', () => {
  const ct = audio.currentTime;
  if (index < lines.length && ct >= lines[index].time) {
    lyricEl.classList.remove('show');
    
    // Случайный цвет для текста
    const colors = ['#DFA346', '#FFD700', '#FFA500', '#FF8C00', '#FF6B35'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setTimeout(() => {
      lyricEl.textContent = lines[index].text;
      lyricEl.style.color = randomColor;
      lyricEl.classList.add('show');
      index++;
      
      // Добавить свечение тексту
      lyricEl.style.textShadow = `0 0 10px ${randomColor}40, 0 0 20px ${randomColor}20`;
    }, 200);
  }
});

// Контролы аудио
playBtn.addEventListener('click', () => {
  audio.play();
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'flex';
});

pauseBtn.addEventListener('click', () => {
  audio.pause();
  pauseBtn.style.display = 'none';
  playBtn.style.display = 'flex';
});

restartBtn.addEventListener('click', () => {
  audio.currentTime = 28;
  audio.play();
  index = 0;
  lyricEl.textContent = '';
  lyricEl.classList.remove('show');
  hintEl.classList.remove('show');
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'flex';
});

volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

// Эффекты при наведении
carEl.addEventListener('mouseenter', () => {
  if (!isMoving) {
    carEl.style.transform = 'scale(1.05)';
    const carGlow = document.querySelector('.car-glow');
    carGlow.style.opacity = '0.1';
  }
});

carEl.addEventListener('mouseleave', () => {
  if (!isMoving) {
    carEl.style.transform = 'scale(1)';
    const carGlow = document.querySelector('.car-glow');
    carGlow.style.opacity = '0';
  }
});

// Эффект радуги для заголовка
const rainbowTitle = document.querySelector('.rainbow-title');
let hue = 0;
setInterval(() => {
  hue = (hue + 1) % 360;
  rainbowTitle.style.background = `linear-gradient(90deg,
    hsl(${hue}, 100%, 50%),
    hsl(${(hue + 60) % 360}, 100%, 50%),
    hsl(${(hue + 120) % 360}, 100%, 50%),
    hsl(${(hue + 180) % 360}, 100%, 50%),
    hsl(${(hue + 240) % 360}, 100%, 50%),
    hsl(${(hue + 300) % 360}, 100%, 50%),
    hsl(${hue}, 100%, 50%)
  )`;
  rainbowTitle.style.backgroundSize = '400% 100%';
}, 50);

// Случайное мерцание элементов
setInterval(() => {
  const randomElements = [
    ...document.querySelectorAll('.cassette-button'),
    ...document.querySelectorAll('.car-light'),
    ...document.querySelectorAll('.title-decoration span')
  ];
  
  if (randomElements.length > 0) {
    const randomEl = randomElements[Math.floor(Math.random() * randomElements.length)];
    randomEl.style.opacity = '0.5';
    
    setTimeout(() => {
      randomEl.style.opacity = '1';
    }, 200);
  }
}, 1000);

// Эффект при клике на кассету
const cassette = document.querySelector('.cassette');
cassette.addEventListener('click', () => {
  cassette.style.transform = 'scale(0.95)';
  setTimeout(() => {
    cassette.style.transform = 'scale(1)';
  }, 200);
  
  // Запустить/остановить анимацию ленты
  const tapeReels = document.querySelectorAll('.tape-reel');
  tapeReels.forEach(reel => {
    if (reel.style.animationPlayState === 'paused') {
      reel.style.animationPlayState = 'running';
    } else {
      reel.style.animationPlayState = 'paused';
    }
  });
});

// Эффект при клике на винил
const vinyl = document.querySelector('.vinyl');
vinyl.addEventListener('click', () => {
  if (vinyl.style.animationPlayState === 'paused') {
    vinyl.style.animationPlayState = 'running';
    document.querySelector('.tonearm').style.animationPlayState = 'running';
  } else {
    vinyl.style.animationPlayState = 'paused';
    document.querySelector('.tonearm').style.animationPlayState = 'paused';
  }
  
  vinyl.style.transform = 'scale(0.95)';
  setTimeout(() => {
    vinyl.style.transform = 'scale(1)';
  }, 200);
});

setInterval(() => {
  const vinyl = document.querySelector('.vinyl');
  if (vinyl) {
    const speed = 8 + (audio.volume * 4);
    vinyl.style.animationDuration = `${speed}s`;
  }
  
  // Менять яркость свечения элементов
  const glowElements = document.querySelectorAll('.player-glow, .vinyl-glow, .car-glow, .text-box-glow');
  glowElements.forEach(el => {
    el.style.opacity = 0.1 + (audio.volume * 0.3);
  });
}, 100);