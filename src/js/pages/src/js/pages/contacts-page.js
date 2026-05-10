// ============================================================
//  contacts-page.js — Контакти
// ============================================================

const OFFICES = [
  {
    city: 'Київ (головний офіс)',
    address: 'вул. Хрещатик, 22, оф. 301',
    phone: '+380 44 123-45-67',
    email: 'kyiv@viknapro.ua',
    hours: 'Пн–Пт: 9:00–19:00, Сб: 10:00–17:00',
    mapUrl: 'https://maps.google.com/?q=Kyiv+Khreschatyk',
    color: '#1a56db',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    city: 'Львів',
    address: 'пл. Ринок, 1, оф. 5',
    phone: '+380 32 987-65-43',
    email: 'lviv@viknapro.ua',
    hours: 'Пн–Пт: 9:00–18:00, Сб: 10:00–16:00',
    mapUrl: 'https://maps.google.com/?q=Lviv+Rynok+Square',
    color: '#f97316',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    city: 'Дніпро',
    address: 'пр. Яворницького, 67, оф. 12',
    phone: '+380 56 234-56-78',
    email: 'dnipro@viknapro.ua',
    hours: 'Пн–Пт: 9:00–18:30, Сб: 10:00–15:00',
    mapUrl: 'https://maps.google.com/?q=Dnipro+Yavornytskyi',
    color: '#16a34a',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    city: 'Одеса',
    address: 'вул. Дерибасівська, 10',
    phone: '+380 48 345-67-89',
    email: 'odesa@viknapro.ua',
    hours: 'Пн–Пт: 9:00–19:00, Сб: 10:00–17:00',
    mapUrl: 'https://maps.google.com/?q=Odesa+Derybasivska',
    color: '#7c3aed',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
];

const SERVICES_INFO = [
  { icon: '📏', title: 'Безкоштовний замір', desc: 'Виїзд майстра у зручний час. Точні виміри для ідеального замовлення.' },
  { icon: '🚚', title: 'Доставка по Україні', desc: 'Власний автопарк. Доставка на об\'єкт або на склад клієнта.' },
  { icon: '🔧', title: 'Монтаж «під ключ»', desc: 'Бригади сертифікованих монтажників. Гарантія на встановлення 3 роки.' },
  { icon: '🛡️', title: 'Гарантійний сервіс', desc: 'Регулювання, ремонт, заміна ущільнювачів протягом гарантійного строку.' },
];

export const contactsPage = {
  render() {
    return `
    <div class="page-content contacts-page">

      <!-- Hero -->
      <div class="contacts-hero">
        <span class="contacts-hero__eyebrow">📍 Зв'яжіться з нами</span>
        <h1 class="contacts-hero__title">Контакти</h1>
        <p class="contacts-hero__sub">Ми готові відповісти на всі питання щодо вибору, замовлення та монтажу вікон</p>
      </div>

      <!-- Гаряча лінія -->
      <div class="hotline-banner">
        <div class="hotline-banner__content">
          <span class="hotline-banner__label">Гаряча лінія (безкоштовно)</span>
          <a href="tel:+380800123456" class="hotline-banner__phone">0 800 123-456</a>
          <span class="hotline-banner__hours">Пн–Пт: 8:00–20:00 · Сб–Нд: 9:00–18:00</span>
        </div>
        <div class="hotline-banner__actions">
          <a href="tel:+380800123456" class="btn btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.2 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
            Зателефонувати
          </a>
          <a href="https://t.me/viknapro_bot" target="_blank" class="btn btn--ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Telegram
          </a>
        </div>
      </div>

      <!-- Офіси -->
      <section class="contacts-section">
        <h2 class="contacts-section__title">Наші офіси</h2>
        <div class="offices-grid">
          ${OFFICES.map(o => `
          <div class="office-card">
            <div class="office-card__header" style="border-left: 4px solid ${o.color}">
              <span class="office-card__icon" style="color: ${o.color}">${o.icon}</span>
              <h3 class="office-card__city">${o.city}</h3>
            </div>
            <ul class="office-card__info">
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${o.address}
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.2 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16z"/></svg>
                <a href="tel:${o.phone.replace(/\s|-/g, '')}">${o.phone}</a>
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:${o.email}">${o.email}</a>
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${o.hours}
              </li>
            </ul>
            <a href="${o.mapUrl}" target="_blank" class="office-card__map-btn btn btn--ghost btn--sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              На карті
            </a>
          </div>`).join('')}
        </div>
      </section>

      <!-- Сервіси -->
      <section class="contacts-section">
        <h2 class="contacts-section__title">Наші послуги</h2>
        <div class="services-grid">
          ${SERVICES_INFO.map(s => `
          <div class="service-card">
            <span class="service-card__icon">${s.icon}</span>
            <h3 class="service-card__title">${s.title}</h3>
            <p class="service-card__desc">${s.desc}</p>
          </div>`).join('')}
        </div>
      </section>

      <!-- Форма зворотнього зв'язку -->
      <section class="contacts-section">
        <h2 class="contacts-section__title">Написати нам</h2>
        <div class="contact-form-wrap">
          <div class="contact-form-info">
            <p>Залиште заявку — ми зв'яжемося з вами протягом <strong>30 хвилин</strong> у робочий час.</p>
            <ul class="contact-form-benefits">
              <li>✅ Безкоштовна консультація</li>
              <li>✅ Розрахунок вартості без зобов'язань</li>
              <li>✅ Виїзд замірника зручного дня</li>
            </ul>
          </div>
          <form class="contact-form" id="contactForm" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="contactName">Ім'я *</label>
                <input type="text" id="contactName" class="form-input" placeholder="Іван Петренко" required />
                <span class="form-error" id="nameError"></span>
              </div>
              <div class="form-group">
                <label class="form-label" for="contactPhone">Телефон *</label>
                <input type="tel" id="contactPhone" class="form-input" placeholder="+380 __ ___ __ __" required />
                <span class="form-error" id="phoneError"></span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="contactCity">Місто</label>
              <select id="contactCity" class="form-input sort-select">
                <option value="">Оберіть місто...</option>
                <option>Київ</option><option>Львів</option><option>Дніпро</option>
                <option>Одеса</option><option>Харків</option><option>Інше</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="contactMsg">Повідомлення</label>
              <textarea id="contactMsg" class="form-input form-textarea" rows="4" placeholder="Опишіть ваше завдання або питання..."></textarea>
            </div>
            <div class="form-group form-group--checkbox">
              <label class="checkbox-label">
                <input type="checkbox" class="checkbox-input" id="privacyCheck" required />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">Я погоджуюсь з <a href="#" class="link">політикою конфіденційності</a></span>
              </label>
            </div>
            <button type="submit" class="btn btn--primary contact-submit-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Надіслати заявку
            </button>
          </form>
        </div>
      </section>

    </div>`;
  },

  init() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const name  = document.getElementById('contactName');
      const phone = document.getElementById('contactPhone');
      const privacy = document.getElementById('privacyCheck');

      document.getElementById('nameError').textContent  = '';
      document.getElementById('phoneError').textContent = '';

      if (!name.value.trim() || name.value.trim().length < 2) {
        document.getElementById('nameError').textContent = "Введіть ім'я (мін. 2 символи)";
        name.classList.add('form-input--error');
        valid = false;
      } else name.classList.remove('form-input--error');

      const phoneVal = phone.value.replace(/\s|-|\(|\)/g, '');
      if (!/^\+?380\d{9}$/.test(phoneVal) && !/^0\d{9}$/.test(phoneVal)) {
        document.getElementById('phoneError').textContent = 'Введіть коректний номер телефону';
        phone.classList.add('form-input--error');
        valid = false;
      } else phone.classList.remove('form-input--error');

      if (!privacy.checked) {
        privacy.closest('.checkbox-label').style.color = 'var(--color-sale)';
        valid = false;
      } else privacy.closest('.checkbox-label').style.color = '';

      if (!valid) return;

      // Success state
      const btn = form.querySelector('.contact-submit-btn');
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Заявку надіслано!`;
      btn.classList.add('btn--added');
      btn.disabled = true;
      form.querySelectorAll('.form-input').forEach(el => el.disabled = true);
    });

    // Phone mask
    const phoneInput = document.getElementById('contactPhone');
    phoneInput?.addEventListener('input', () => {
      let val = phoneInput.value.replace(/\D/g, '');
      if (val.startsWith('380')) val = '+' + val;
      else if (val.startsWith('80')) val = '+3' + val;
      phoneInput.value = val;
    });
  },
};