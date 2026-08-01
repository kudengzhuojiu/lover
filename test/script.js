const $ = (selector, scope = document) => scope.querySelector(selector);
const scenes = [...document.querySelectorAll('.scene')];
let sceneIndex = 0;
let typeStarted = false;
const startDate = new Date('2025-07-12T00:00:00+07:00'); // 修改为你们认识的日期
const music = $('#music');
const memories = [
  { src: 'assets/memory-1.jpg', caption: 'Một khoảnh khắc thật gần gũi. ♥' },
  { src: 'assets/memory-2.jpg', caption: 'Những điều giản dị cũng trở nên đẹp hơn vì có em.' },
  { src: 'assets/memory-3.jpg', caption: 'Một ngày em đang tạo nên điều thật đẹp.' },
  { src: 'assets/memory-4.jpg', caption: 'Nụ cười của em làm cả ngày trở nên rực rỡ.' },
  { src: 'assets/memory-5.jpg', caption: 'Và mọi khoảnh khắc của em đều rất đặc biệt với anh.' },
];

function showScene(index) {
  scenes[sceneIndex].classList.remove('scene--active');
  sceneIndex = index;
  scenes[sceneIndex].classList.add('scene--active');
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

const message = 'Chào em... Ngày đầu tiên gặp em, anh không nghĩ rằng mình sẽ thích em nhiều đến vậy. Nhưng mọi chuyện đã thay đổi từ nụ cười đầu tiên của em. ♥';
function typeWriter() { let i = 0; typeStarted = true; const target = $('#typeText'); const timer = setInterval(() => { target.textContent = message.slice(0, ++i); if (i === message.length) clearInterval(timer); }, 32); }

function updateCounter() {
  let seconds = Math.max(0, Math.floor((Date.now() - startDate.getTime()) / 1000));
  const values = [['ngày', Math.floor(seconds / 86400)], ['giờ', Math.floor(seconds % 86400 / 3600)], ['phút', Math.floor(seconds % 3600 / 60)], ['giây', seconds % 60]];
  $('#counter').innerHTML = values.map(([label, value]) => `<span class="unit"><b>${String(value).padStart(2, '0')}</b><small>${label}</small></span>`).join('');
}
updateCounter(); setInterval(updateCounter, 1000);

const envelope = $('#envelope');
envelope.addEventListener('click', () => { envelope.classList.add('open'); setTimeout(() => { $('#loveLetter').style.display = 'block'; $('#question').style.display = 'block'; }, 520); });
const no = $('#no');
function moveNo() { const x = Math.random() * 170 - 85; const y = Math.random() * 90 - 45; no.style.transform = `translate(${x}px, ${y}px)`; }
no.addEventListener('pointerenter', moveNo); no.addEventListener('click', moveNo);
$('#yes').addEventListener('click', () => showScene(5));

let selectedMemory = 0;
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
$('#closeLightbox').addEventListener('click', () => { $('#lightbox').classList.remove('show'); $('#lightbox').setAttribute('aria-hidden', 'true'); });

$('#soundToggle').addEventListener('click', () => { if (music.paused) { playMusic(); } else { music.pause(); $('#soundToggle').textContent = '♩'; } });

const sky = $('#sky'), ctx = sky.getContext('2d'), fireworkCanvas = $('#fireworks'), fctx = fireworkCanvas.getContext('2d'); let stars = [], particles = [];
function resize() { [sky, fireworkCanvas].forEach(c => { c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio; c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px'; }); ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); fctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); stars = Array.from({length:Math.min(160, Math.floor(innerWidth / 5))}, () => ({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.2,a:Math.random()})); }
function drawSky() { ctx.clearRect(0,0,innerWidth,innerHeight); stars.forEach(s => { s.a += .014; ctx.fillStyle=`rgba(255,245,255,${.25 + (Math.sin(s.a)+1)*.28})`; ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill(); }); requestAnimationFrame(drawSky); }
function petals() { const p = document.createElement('i'); p.className='petal'; p.textContent=Math.random()>.5?'♥':'✦'; p.style.left=Math.random()*100+'vw'; p.style.setProperty('--drift',(Math.random()*180-90)+'px'); p.style.animationDuration=(6+Math.random()*6)+'s'; $('#petals').append(p); setTimeout(()=>p.remove(),12500); } setInterval(petals,680);
function burst(x,y) { for(let i=0;i<80;i++){ const angle=Math.random()*Math.PI*2, speed=1+Math.random()*5; particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,color:`hsl(${Math.random()*60+320},100%,70%)`}); } }
function animateFireworks() { fctx.clearRect(0,0,innerWidth,innerHeight); particles = particles.filter(p => p.life>.02); particles.forEach(p => { p.x+=p.vx;p.y+=p.vy;p.vy+=.045;p.life*=.975;fctx.fillStyle=p.color;fctx.globalAlpha=p.life;fctx.fillRect(p.x,p.y,3,3); }); fctx.globalAlpha=1; requestAnimationFrame(animateFireworks); }
function celebrate() { let count=0; const interval=setInterval(()=>{ burst(innerWidth*(.2+Math.random()*.6),innerHeight*(.18+Math.random()*.46)); if(++count===8) clearInterval(interval); },520); }
resize(); addEventListener('resize', resize); drawSky(); animateFireworks();
