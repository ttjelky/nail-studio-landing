const header = document.querySelector('.header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const mobileBook = document.querySelector('.mobile-book');
const hero = document.querySelector('.hero');
const booking = document.getElementById('booking');
const form = document.getElementById('booking-form');
const colorField = document.getElementById('color-field');

// Мобільне меню
function setMenu(open) {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
  document.body.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

// Лінія під шапкою + липка кнопка запису на телефоні
function onScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
  const pastHero = window.scrollY > hero.offsetHeight * 0.6;
  const b = booking.getBoundingClientRect();
  const atBooking = b.top < window.innerHeight && b.bottom > 0;
  mobileBook.classList.toggle('is-visible', pastHero && !atBooking);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Палітра: обраний колір іде в заявку
document.querySelectorAll('.swatch').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('is-picked', s === btn));
    colorField.value = btn.dataset.color;
  });
});
colorField.addEventListener('input', () => {
  document.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('is-picked', s.dataset.color === colorField.value));
});

// Форма запису
const pad = (n) => String(n).padStart(2, '0');
const today = new Date();
form.elements.date.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  let firstInvalid = null;
  [...form.elements].forEach((el) => {
    if (!el.name) return;
    let ok = el.checkValidity();
    if (el.name === 'phone') ok = el.value.replace(/\D/g, '').length >= 10;
    el.classList.toggle('is-invalid', !ok);
    if (!ok && !firstInvalid) firstInvalid = el;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }
  // Демо: у робочій версії тут відправка заявки в Telegram-бот студії
  console.info('Нова заявка (демо):', Object.fromEntries(new FormData(form)));
  form.reset();
  document.querySelectorAll('.swatch').forEach((s) => s.classList.remove('is-picked'));
  document.getElementById('form-success').hidden = false;
});
form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));
form.addEventListener('change', (e) => e.target.classList.remove('is-invalid'));
