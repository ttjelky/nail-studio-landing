const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const mobileBook = document.querySelector('.mobile-book');
const hero = document.querySelector('.hero');
const booking = document.getElementById('booking');
const form = document.getElementById('booking-form');
const colorField = document.getElementById('color-field');
const colorOut = document.getElementById('color-out');
const chips = [...document.querySelectorAll('.chip')];

// ---- Мобільне меню
function setMenu(open) {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.textContent = open ? 'Закрити' : 'Меню';
  document.body.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

// ---- Липка кнопка запису на телефоні
function onScroll() {
  const pastHero = window.scrollY > hero.offsetHeight * 0.7;
  const b = booking.getBoundingClientRect();
  mobileBook.classList.toggle('is-visible', pastHero && !(b.top < window.innerHeight && b.bottom > 0));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Палітра: обраний зразок іде в заявку
function pickColor(chip) {
  chips.forEach((c) => c.classList.toggle('is-picked', c === chip));
  if (!chip) {
    colorField.value = '';
    colorOut.innerHTML = 'не обрано — <a href="#colors">палітра</a>';
    return;
  }
  colorField.value = `${chip.dataset.code} ${chip.dataset.name}`;
  colorOut.innerHTML = `${chip.dataset.code} ${chip.dataset.name} · <a href="#colors">змінити</a>`;
}
chips.forEach((chip) => chip.addEventListener('click', () => pickColor(chip.classList.contains('is-picked') ? null : chip)));

// ---- Дні: наступні 5 днів
const days = document.getElementById('days');
const wd = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const now = new Date();
for (let i = 0; i < 5; i++) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const label = i === 0 ? 'Сьогодні' : i === 1 ? 'Завтра' : wd[d.getDay()];
  days.insertAdjacentHTML('beforeend',
    `<label class="day"><input type="radio" name="date" value="${iso}"${i === 1 ? ' checked' : ''} required><span><b>${d.getDate()}</b><small>${label}</small></span></label>`);
}

// ---- Форма
const err = document.getElementById('form-error');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const missing = [];
  if (!data.get('service')) missing.push('послугу');
  if (!data.get('date')) missing.push('день');
  if (!data.get('time')) missing.push('час');
  const name = form.elements.name;
  const phone = form.elements.phone;
  const nameOk = name.value.trim().length > 0;
  const phoneOk = phone.value.replace(/\D/g, '').length >= 10;
  name.classList.toggle('is-invalid', !nameOk);
  phone.classList.toggle('is-invalid', !phoneOk);
  if (!nameOk) missing.push('ім’я');
  if (!phoneOk) missing.push('телефон');

  if (missing.length) {
    err.textContent = `Оберіть або заповніть: ${missing.join(', ')}.`;
    err.hidden = false;
    return;
  }
  err.hidden = true;
  // Демо: у робочій версії тут відправка заявки в Telegram-бот студії
  console.info('Нова заявка (демо):', Object.fromEntries(data));
  form.reset();
  pickColor(null);
  document.getElementById('form-success').hidden = false;
});
form.addEventListener('input', (e) => e.target.classList?.remove('is-invalid'));
