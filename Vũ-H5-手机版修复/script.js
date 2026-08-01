const $ = (selector, scope = document) => scope.querySelector(selector);
const scenes = [...document.querySelectorAll('.scene')];
const music = $('#music');
const startDate = new Date('2025-08-03T08:00:00+07:00');
const memories = [
  { src: 'assets/memory-1.jpg', caption: 'Một khoảnh khắc thật gần gũi. ♥' },
  { src: 'assets/memory-2.jpg', caption: 'Em bé Vũ ơi, xinh quá. ♥' },
  { src: 'assets/memory-3.jpg', caption: 'Dáng vẻ nghiêm túc của em thật đẹp, tựa như một bức tranh. ♥' },
  { src: 'assets/memory-4.jpg', caption: 'Cô gái hoạt bát, chú chim cánh cụt vui vẻ. ♥' },
  { src: 'assets/memory-5.jpg', caption: 'Em bé Vũ thật đáng yêu. ♥' },
];

let sceneIndex = 0;
let typeStarted = false;
let selectedMemory = 0;

function showScene(index) {
  scenes[sceneIndex].classList.remove('scene--active');
  sceneIndex = index;
  scenes[sceneIndex].classList.add('scene--active');
  scenes[sceneIndex].scrollTop = 0;
  if (sceneIndex === 1 && !typeStarted) typeWriter();
  if (sceneIndex === 5) celebrate();
}

function playMusic() {
  music.play().then(() => { $('#soundToggle').textContent = '♫'; }).catch(() => {});
}

document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => {
  if (sceneIndex === 0) playMusic();
  showScene(Math.min(sceneIndex + 1, scenes.length - 1));
}));
$('#restart').addEventListener('click', () => showScene(0));
$('#soundToggle').addEventListener('click', () => {
  if (music.paused) playMusic();
  else { music.pause(); $('#soundToggle').textContent = '♩'; }
});

const message = 'Chào em... Ngày đầu tiên gặp em, anh không nghĩ rằng mình sẽ thích em nhiều đến vậy. Nhưng mọi chuyện đã thay đổi từ nụ cười đầu tiên của em. ♥';
function typeWriter() {
  let i = 0;
  typeStarted = true;
  const target = $('#typeText');
  const timer = setInterval(() => {
    target.textContent = message.slice(0, ++i);
    if (i === message.length) clearInterval(timer);
  }, 32);
}

function updateCounter() {
  const seconds = Math.max(0, Math.floor((Date.now() - startDate.getTime()) / 1000));
  const values = [
    ['ngày', Math.floor(seconds / 86400)],
    ['giờ', Math.floor((seconds % 86400) / 3600)],
    ['phút', Math.floor((seconds % 3600) / 60)],
    ['giây', seconds % 60],
  ];
  $('#counter').innerHTML = values.map(([label, value]) => `<span class="unit"><b>${String(value).padStart(2, '0')}</b><small>${label}</small></span>`).join('');
}
updateCounter();
setInterval(updateCounter, 1000);

const envelope = $('#envelope');
envelope.addEventListener('click', () => {
  envelope.classList.add('open');
  setTimeout(() => {
    $('#loveLetter').style.display = 'block';
    $('#question').style.display = 'block';
  }, 520);
});

const no = $('#no');
function moveNo() {
  const horizontalRange = Math.min(62, Math.max(30, (innerWidth - no.offsetWidth) / 4));
  const verticalRange = Math.min(30, Math.max(16, innerHeight * 0.04));
  const x = (Math.random() * 2 - 1) * horizontalRange;
  const y = (Math.random() * 2 - 1) * verticalRange;
  no.style.transform = `translate(${x}px, ${y}px)`;
}
no.addEventListener('pointerenter', moveNo);
no.addEventListener('click', moveNo);
$('#yes').addEventListener('click', () => showScene(5));

function showMemory(index) {
  selectedMemory = (index + memories.length) % memories.length;
  const memory = memories[selectedMemory];
  $('#lightboxContent').innerHTML = `<img src="${memory.src}" alt="Kỷ niệm ${selectedMemory + 1}" /><figcaption>${memory.caption}</figcaption>`;
  $('#lightbox').classList.add('show');
  $('#lightbox').setAttribute('aria-hidden', 'false');
}
$('#polaroids').addEventListener('click', event => {
  const photo = event.target.closest('[data-photo]');
  if (photo) showMemory(Number(photo.dataset.photo) - 1);
});
$('#previousPhoto').addEventListener('click', () => showMemory(selectedMemory - 1));
$('#nextPhoto').addEventListener('click', () => showMemory(selectedMemory + 1));
$('#closeLightbox').addEventListener('click', () => {
  $('#lightbox').classList.remove('show');
  $('#lightbox').setAttribute('aria-hidden', 'true');
});

const sky = $('#sky');
const ctx = sky.getContext('2d');
const fireworkCanvas = $('#fireworks');
const fctx = fireworkCanvas.getContext('2d');
let stars = [];
let particles = [];

function resize() {
  [sky, fireworkCanvas].forEach(canvas => {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
  });
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  fctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  stars = Array.from({ length: Math.min(160, Math.floor(innerWidth / 5)) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.4 + 0.2, a: Math.random() }));
}
function drawSky() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  stars.forEach(star => {
    star.a += 0.014;
    ctx.fillStyle = `rgba(255,245,255,${0.25 + (Math.sin(star.a) + 1) * 0.28})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawSky);
}
function petals() {
  const petal = document.createElement('i');
  petal.className = 'petal';
  petal.textContent = Math.random() > 0.5 ? '♥' : '✦';
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
  petal.style.animationDuration = `${6 + Math.random() * 6}s`;
  $('#petals').append(petal);
  setTimeout(() => petal.remove(), 12500);
}
function burst(x, y) {
  for (let i = 0; i < 80; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 5;
    particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: `hsl(${Math.random() * 60 + 320},100%,70%)` });
  }
}
function animateFireworks() {
  fctx.clearRect(0, 0, innerWidth, innerHeight);
  particles = particles.filter(particle => particle.life > 0.02);
  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.045;
    particle.life *= 0.975;
    fctx.fillStyle = particle.color;
    fctx.globalAlpha = particle.life;
    fctx.fillRect(particle.x, particle.y, 3, 3);
  });
  fctx.globalAlpha = 1;
  requestAnimationFrame(animateFireworks);
}
function celebrate() {
  let count = 0;
  const interval = setInterval(() => {
    burst(innerWidth * (0.2 + Math.random() * 0.6), innerHeight * (0.18 + Math.random() * 0.46));
    if (++count === 8) clearInterval(interval);
  }, 520);
}
resize();
addEventListener('resize', resize);
drawSky();
animateFireworks();
setInterval(petals, 680);
