// === Countdown timer ===
const EVENT_DATE = new Date('2026-08-15T18:00:00+06:00').getTime();

const els = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};

const pad = n => String(Math.max(0, n)).padStart(2, '0');

function tick() {
  const diff = EVENT_DATE - Date.now();
  if (diff <= 0) {
    Object.values(els).forEach(el => el.textContent = '00');
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  els.days.textContent = pad(d);
  els.hours.textContent = pad(h);
  els.minutes.textContent = pad(m);
  els.seconds.textContent = pad(s);
}
tick();
setInterval(tick, 1000);

// === Scroll reveal ===
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// === RSVP form validation ===
const form = document.getElementById('rsvpForm');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('nameError');
const success = document.getElementById('success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  nameError.textContent = '';
  success.hidden = true;

  const name = nameInput.value.trim();
  if (name.length < 2) {
    nameError.textContent = 'Өтінеміз, аты-жөніңізді толық жазыңыз';
    nameInput.focus();
    return;
  }

  const attend = form.querySelector('input[name="attend"]:checked').value;
  const guests = document.getElementById('guests').value;

  const msg = attend === 'yes'
    ? `Рақмет, ${name}! Сізді (${guests} қонақ) күтеміз 💛`
    : `Рақмет, ${name}. Жауабыңыз қабылданды.`;

  success.textContent = msg;
  success.hidden = false;
  form.reset();
});

// === Smooth nav highlight on scroll (subtle parallax for hero bg) ===
const heroBg = document.querySelector('.hero__bg');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroBg && y < window.innerHeight) {
    heroBg.style.transform = `scale(1.1) translateY(${y * 0.15}px)`;
  }
}, { passive: true });
