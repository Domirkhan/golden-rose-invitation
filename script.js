const EVENT_DATE = new Date('2026-08-21T17:00:00+06:00').getTime();

// Telegram setup:
// 1. Create a bot via @BotFather and paste its token below.
// 2. Paste your chat_id below. For a group, add the bot to the group first.
const TELEGRAM_BOT_TOKEN = '8917420972:AAFXy6IMBJckDWqNjnpLFzAYkF3r5iUhf3Y';
const TELEGRAM_CHAT_ID = '6689461397 ';

const timerElements = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};

const previousValues = {};
const pad = (value) => String(Math.max(0, value)).padStart(2, '0');

function setTimerValue(key, value) {
  const element = timerElements[key];
  if (!element || previousValues[key] === value) return;

  element.textContent = value;
  element.classList.remove('is-changing');
  void element.offsetWidth;
  element.classList.add('is-changing');
  previousValues[key] = value;
}

function updateCountdown() {
  const distance = EVENT_DATE - Date.now();

  if (distance <= 0) {
    Object.keys(timerElements).forEach((key) => setTimerValue(key, '00'));
    return;
  }

  setTimerValue('days', pad(Math.floor(distance / 86400000)));
  setTimerValue('hours', pad(Math.floor((distance % 86400000) / 3600000)));
  setTimerValue('minutes', pad(Math.floor((distance % 3600000) / 60000)));
  setTimerValue('seconds', pad(Math.floor((distance % 60000) / 1000)));
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('is-visible', entry.isIntersecting);
  });
}, {
  threshold: 0.18,
  rootMargin: '-8% 0px -8% 0px',
});

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const musicButton = document.getElementById('musicButton');
const weddingMusic = document.getElementById('weddingMusic');

musicButton.addEventListener('click', () => {
  if (weddingMusic.paused) {
    weddingMusic.play();
  } else {
    weddingMusic.pause();
  }
});

weddingMusic.addEventListener('play', () => {
  musicButton.classList.add('is-playing');
  musicButton.setAttribute('aria-pressed', 'true');
  musicButton.setAttribute('aria-label', 'Музыканы тоқтату');
});

weddingMusic.addEventListener('pause', () => {
  musicButton.classList.remove('is-playing');
  musicButton.setAttribute('aria-pressed', 'false');
  musicButton.setAttribute('aria-label', 'Музыканы қосу');
});

const form = document.getElementById('rsvpForm');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('nameError');
const formMessage = document.getElementById('formMessage');
const guestsInput = document.getElementById('guests');
const wishInput = document.getElementById('wish');
const submitButton = form.querySelector('button[type="submit"]');

function isTelegramConfigured() {
  return TELEGRAM_BOT_TOKEN !== 'PASTE_BOT_TOKEN_HERE'
    && TELEGRAM_CHAT_ID !== 'PASTE_CHAT_ID_HERE';
}

function buildTelegramMessage({ name, attend, guests, wish }) {
  const attendText = attend === 'yes' ? 'Келемін' : 'Келе алмаймын';

  return [
    'Жаңа RSVP жауап',
    '',
    `Аты-жөні: ${name}`,
    `Қатысуы: ${attendText}`,
    `Қонақ саны: ${guests}`,
    `Тілегі: ${wish || 'Жазылмады'}`,
    '',
    'Қыз ұзату: Інжу',
    'Күні: 21 тамыз 2026, 17:00',
  ].join('\n');
}

async function sendToTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error('Telegram message was not sent');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const attend = form.querySelector('input[name="attend"]:checked').value;
  const guests = guestsInput.value;
  const wish = wishInput.value.trim();
  nameError.textContent = '';
  formMessage.hidden = true;

  if (name.length < 2) {
    nameError.textContent = 'Өтінеміз, есіміңізді жазыңыз.';
    nameInput.focus();
    return;
  }

  if (!isTelegramConfigured()) {
    formMessage.textContent = 'Telegram бапталмаған: script.js ішінде BOT_TOKEN және CHAT_ID қойыңыз.';
    formMessage.hidden = false;
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Жіберілуде...';

  try {
    await sendToTelegram(buildTelegramMessage({ name, attend, guests, wish }));

    formMessage.textContent = attend === 'yes'
      ? `Рақмет, ${name}! Сізді ${guests} қонақ ретінде қуанышымызда күтеміз.`
      : `Рақмет, ${name}. Жауабыңыз қабылданды.`;

    formMessage.hidden = false;
    form.reset();
  } catch (error) {
    formMessage.textContent = 'Жауап жіберілмеді. Интернетті немесе Telegram баптауларын тексеріңіз.';
    formMessage.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Жіберу';
  }
});
