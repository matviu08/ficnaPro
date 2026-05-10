// ============================================================
//  auth.js — Auth modal: Вхід / Реєстрація / Забув пароль
//  + Header sync (аватар, dropdown меню)
// ============================================================
import {
  getCurrentUser, clearSession,
  loginUser, registerUser, requestPasswordReset,
  getInitials, getAvatarColor,
} from '../data/users.js';

// Поточний таб: 'login' | 'register' | 'forgot'
let activeTab = 'login';

// ══════════════════════════════════════════════════════════
//  BUILD MODAL
// ══════════════════════════════════════════════════════════
function buildModal() {
  if (document.getElementById('authModal')) return;

  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal-overlay" id="authOverlay"></div>
  <div class="auth-modal" id="authModal" role="dialog" aria-label="Авторизація">
    <button class="auth-modal__close" id="authClose" aria-label="Закрити">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <div class="auth-modal__inner" id="authInner"></div>
  </div>`);

  document.getElementById('authClose').addEventListener('click', closeModal);
  document.getElementById('authOverlay').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// ══════════════════════════════════════════════════════════
//  OPEN / CLOSE
// ══════════════════════════════════════════════════════════
export function openAuthModal(tab = 'login') {
  buildModal();
  activeTab = tab;
  renderModal();
  document.getElementById('authModal').classList.add('auth-modal--open');
  document.getElementById('authOverlay').classList.add('modal-overlay--visible');
  document.body.style.overflow = 'hidden';
  // Фокус на перше поле
  setTimeout(() => document.querySelector('.auth-input')?.focus(), 50);
}

function closeModal() {
  document.getElementById('authModal')?.classList.remove('auth-modal--open');
  document.getElementById('authOverlay')?.classList.remove('modal-overlay--visible');
  document.body.style.overflow = '';
}

// ══════════════════════════════════════════════════════════
//  RENDER
// ══════════════════════════════════════════════════════════
function renderModal() {
  const inner = document.getElementById('authInner');
  if (!inner) return;

  const tabs = `
    <div class="auth-tabs" id="authTabs">
      <button class="auth-tab${activeTab === 'login'    ? ' auth-tab--active' : ''}" data-tab="login">Увійти</button>
      <button class="auth-tab${activeTab === 'register' ? ' auth-tab--active' : ''}" data-tab="register">Реєстрація</button>
    </div>`;

  const forms = {
    login:    renderLogin(),
    register: renderRegister(),
    forgot:   renderForgot(),
  };

  inner.innerHTML = `
    <div class="auth-modal__logo">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" stroke-width="2"/>
        <line x1="16" y1="2" x2="16" y2="30" stroke="currentColor" stroke-width="2"/>
        <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Вікна<strong>Про</strong></span>
    </div>
    ${activeTab !== 'forgot' ? tabs : ''}
    <div class="auth-form-wrap" id="authFormWrap">
      ${forms[activeTab] || forms.login}
    </div>`;

  attachTabEvents();
  attachFormEvents();
}

function renderLogin() {
  return `
  <form class="auth-form" id="authForm" novalidate>
    <div class="auth-form__header">
      <h2 class="auth-form__title">З поверненням! 👋</h2>
      <p class="auth-form__sub">Увійдіть у свій обліковий запис</p>
    </div>

    <div class="auth-field">
      <label class="auth-label" for="loginEmail">Email</label>
      <div class="auth-input-wrap">
        <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <input type="email" id="loginEmail" class="auth-input" placeholder="your@email.com" autocomplete="email" />
      </div>
      <span class="auth-error" id="loginEmailErr"></span>
    </div>

    <div class="auth-field">
      <div class="auth-label-row">
        <label class="auth-label" for="loginPassword">Пароль</label>
        <button type="button" class="auth-link" id="goForgot">Забули пароль?</button>
      </div>
      <div class="auth-input-wrap">
        <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
        <input type="password" id="loginPassword" class="auth-input" placeholder="••••••••" autocomplete="current-password" />
        <button type="button" class="auth-eye" data-target="loginPassword" aria-label="Показати пароль">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <span class="auth-error" id="loginPasswordErr"></span>
    </div>

    <div class="auth-field auth-field--row">
      <label class="checkbox-label">
        <input type="checkbox" class="checkbox-input" id="rememberMe" />
        <span class="checkbox-custom"></span>
        <span class="checkbox-text">Запам'ятати мене</span>
      </label>
    </div>

    <span class="auth-error auth-error--global" id="loginGlobalErr"></span>

    <button type="submit" class="btn btn--primary btn--full auth-submit">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
        <polyline points="10 17 15 12 10 7"/>
        <line x1="15" y1="12" x2="3" y2="12"/>
      </svg>
      Увійти
    </button>

    <div class="auth-divider"><span>або</span></div>

    <div class="auth-social">
      <button type="button" class="auth-social-btn" aria-label="Google">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Google
      </button>
      <button type="button" class="auth-social-btn" aria-label="Facebook">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Facebook
      </button>
    </div>

    <p class="auth-switch">
      Ще немає акаунту?
      <button type="button" class="auth-link" data-tab="register">Зареєструватися</button>
    </p>
  </form>`;
}

function renderRegister() {
  return `
  <form class="auth-form" id="authForm" novalidate>
    <div class="auth-form__header">
      <h2 class="auth-form__title">Створити акаунт ✨</h2>
      <p class="auth-form__sub">Реєстрація займе менше хвилини</p>
    </div>

    <div class="auth-field">
      <label class="auth-label" for="regName">Повне ім'я *</label>
      <div class="auth-input-wrap">
        <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <input type="text" id="regName" class="auth-input" placeholder="Іван Петренко" autocomplete="name" />
      </div>
      <span class="auth-error" id="regNameErr"></span>
    </div>

    <div class="auth-field">
      <label class="auth-label" for="regEmail">Email *</label>
      <div class="auth-input-wrap">
        <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <input type="email" id="regEmail" class="auth-input" placeholder="your@email.com" autocomplete="email" />
      </div>
      <span class="auth-error" id="regEmailErr"></span>
    </div>

    <div class="auth-field">
      <label class="auth-label" for="regPhone">Телефон</label>
      <div class="auth-input-wrap">
        <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.2 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16z"/></svg>
        <input type="tel" id="regPhone" class="auth-input" placeholder="+380 __ ___ __ __" autocomplete="tel" />
      </div>
    </div>

    <div class="auth-field">
      <label class="auth-label" for="regPassword">Пароль *</label>
      <div class="auth-input-wrap">
        <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        <input type="password" id="regPassword" class="auth-input" placeholder="Мінімум 6 символів" autocomplete="new-password" />
        <button type="button" class="auth-eye" data-target="regPassword" aria-label="Показати пароль">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <div class="password-strength" id="passwordStrength">
        <div class="strength-bar"><div class="strength-fill" id="strengthFill"></div></div>
        <span class="strength-label" id="strengthLabel"></span>
      </div>
      <span class="auth-error" id="regPasswordErr"></span>
    </div>

    <div class="auth-field">
      <label class="auth-label" for="regPassword2">Підтвердження пароля *</label>
      <div class="auth-input-wrap">
        <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        <input type="password" id="regPassword2" class="auth-input" placeholder="Повторіть пароль" autocomplete="new-password" />
        <button type="button" class="auth-eye" data-target="regPassword2" aria-label="Показати пароль">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <span class="auth-error" id="regPassword2Err"></span>
    </div>

    <div class="auth-field">
      <label class="checkbox-label">
        <input type="checkbox" class="checkbox-input" id="agreeTerms" required />
        <span class="checkbox-custom"></span>
        <span class="checkbox-text">Погоджуюсь з <a href="#" class="auth-link">умовами використання</a></span>
      </label>
      <span class="auth-error" id="agreeTermsErr"></span>
    </div>

    <span class="auth-error auth-error--global" id="regGlobalErr"></span>

    <button type="submit" class="btn btn--primary btn--full auth-submit">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      Зареєструватися
    </button>

    <p class="auth-switch">
      Вже є акаунт?
      <button type="button" class="auth-link" data-tab="login">Увійти</button>
    </p>
  </form>`;
}

function renderForgot() {
  return `
  <form class="auth-form" id="authForm" novalidate>
    <button type="button" class="auth-back" id="authBack">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Назад до входу
    </button>
    <div class="auth-form__header">
      <h2 class="auth-form__title">Відновити пароль 🔑</h2>
      <p class="auth-form__sub">Введіть email — надішлемо інструкції</p>
    </div>

    <div class="auth-field">
      <label class="auth-label" for="forgotEmail">Email</label>
      <div class="auth-input-wrap">
        <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <input type="email" id="forgotEmail" class="auth-input" placeholder="your@email.com" autocomplete="email" />
      </div>
      <span class="auth-error" id="forgotEmailErr"></span>
    </div>

    <span class="auth-error auth-error--global" id="forgotGlobalErr"></span>
    <div class="auth-success" id="forgotSuccess" hidden>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      <span id="forgotSuccessMsg"></span>
    </div>

    <button type="submit" class="btn btn--primary btn--full auth-submit">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      Надіслати інструкції
    </button>
  </form>`;
}

// ══════════════════════════════════════════════════════════
//  EVENTS
// ══════════════════════════════════════════════════════════
function attachTabEvents() {
  // Tab switch
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      renderModal();
      setTimeout(() => document.querySelector('.auth-input')?.focus(), 50);
    });
  });

  // Back button in forgot
  document.getElementById('authBack')?.addEventListener('click', () => {
    activeTab = 'login';
    renderModal();
  });

  // Forgot link
  document.getElementById('goForgot')?.addEventListener('click', () => {
    activeTab = 'forgot';
    renderModal();
  });

  // Eye toggle
  document.querySelectorAll('.auth-eye').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.style.color = show ? 'var(--color-primary)' : '';
    });
  });

  // Password strength
  document.getElementById('regPassword')?.addEventListener('input', e => {
    updateStrength(e.target.value);
  });

  // Phone mask
  document.getElementById('regPhone')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.startsWith('380')) v = '+' + v;
    else if (v.startsWith('80')) v = '+3' + v;
    e.target.value = v;
  });
}

function updateStrength(pwd) {
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!fill || !label) return;

  let score = 0;
  if (pwd.length >= 6)  score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const levels = [
    { pct: 0,   color: '',                    text: ''          },
    { pct: 20,  color: 'var(--color-sale)',   text: 'Дуже слабкий' },
    { pct: 40,  color: '#f97316',             text: 'Слабкий'   },
    { pct: 60,  color: '#eab308',             text: 'Середній'  },
    { pct: 80,  color: 'var(--color-new)',    text: 'Надійний'  },
    { pct: 100, color: 'var(--color-new)',    text: 'Відмінний' },
  ];

  const lvl = levels[Math.min(score, 5)];
  fill.style.width      = lvl.pct + '%';
  fill.style.background = lvl.color;
  label.textContent     = lvl.text;
  label.style.color     = lvl.color;
}

function attachFormEvents() {
  const form = document.getElementById('authForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();

    const btn = form.querySelector('.auth-submit');
    btn.disabled = true;
    btn.innerHTML = '<span class="auth-spinner"></span> Зачекайте...';

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    if (activeTab === 'login')    handleLogin();
    if (activeTab === 'register') handleRegister();
    if (activeTab === 'forgot')   handleForgot();

    btn.disabled = false;
  });
}

function handleLogin() {
  const email    = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  let valid = true;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('loginEmailErr', 'Введіть коректний email');
    valid = false;
  }
  if (!password || password.length < 1) {
    showError('loginPasswordErr', 'Введіть пароль');
    valid = false;
  }
  if (!valid) { resetSubmitBtn(); return; }

  const result = loginUser(email, password);
  if (!result.ok) {
    showError('loginGlobalErr', result.error);
    resetSubmitBtn();
    return;
  }

  closeModal();
  syncHeaderUser(result.user);
  showAuthToast(`Вітаємо, ${result.user.name.split(' ')[0]}! 👋`);
}

function handleRegister() {
  const name      = document.getElementById('regName')?.value.trim();
  const email     = document.getElementById('regEmail')?.value.trim();
  const phone     = document.getElementById('regPhone')?.value.trim();
  const password  = document.getElementById('regPassword')?.value;
  const password2 = document.getElementById('regPassword2')?.value;
  const agreed    = document.getElementById('agreeTerms')?.checked;
  let valid = true;

  if (!name || name.length < 2) {
    showError('regNameErr', "Ім'я має бути мінімум 2 символи"); valid = false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('regEmailErr', 'Введіть коректний email'); valid = false;
  }
  if (!password || password.length < 6) {
    showError('regPasswordErr', 'Пароль мінімум 6 символів'); valid = false;
  }
  if (password !== password2) {
    showError('regPassword2Err', 'Паролі не збігаються'); valid = false;
  }
  if (!agreed) {
    showError('agreeTermsErr', 'Прийміть умови використання'); valid = false;
  }
  if (!valid) { resetSubmitBtn(); return; }

  const result = registerUser({ name, email, phone, password });
  if (!result.ok) {
    showError('regGlobalErr', result.error);
    resetSubmitBtn();
    return;
  }

  closeModal();
  syncHeaderUser(result.user);
  showAuthToast(`Акаунт створено! Ласкаво просимо, ${result.user.name.split(' ')[0]}! 🎉`);
}

function handleForgot() {
  const email = document.getElementById('forgotEmail')?.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('forgotEmailErr', 'Введіть коректний email');
    resetSubmitBtn();
    return;
  }

  const result = requestPasswordReset(email);
  const successEl = document.getElementById('forgotSuccess');
  const msgEl     = document.getElementById('forgotSuccessMsg');

  if (!result.ok) {
    showError('forgotGlobalErr', result.error);
    resetSubmitBtn();
    return;
  }

  if (successEl) { successEl.hidden = false; }
  if (msgEl) msgEl.textContent = result.message;
  resetSubmitBtn();
}

// ── Helpers ───────────────────────────────────────────────
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function clearErrors() {
  document.querySelectorAll('.auth-error').forEach(e => {
    e.textContent = '';
    e.style.display = '';
  });
}

function resetSubmitBtn() {
  const btn = document.querySelector('.auth-submit');
  if (!btn) return;
  btn.disabled = false;
  const labels = { login: 'Увійти', register: 'Зареєструватися', forgot: 'Надіслати інструкції' };
  btn.innerHTML = labels[activeTab] || 'Відправити';
}

function showAuthToast(msg) {
  let c = document.getElementById('toastContainer');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>${msg}</span>`;
  c.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast--visible'));
  setTimeout(() => { t.classList.remove('toast--visible'); setTimeout(() => t.remove(), 300); }, 4000);
}

// ══════════════════════════════════════════════════════════
//  HEADER SYNC
// ══════════════════════════════════════════════════════════
export function syncHeaderUser(user) {
  const btn = document.getElementById('profileBtn');
  if (!btn) return;

  if (!user) {
    btn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>`;
    btn.title = 'Увійти';
    btn.onclick = () => openAuthModal('login');
    destroyDropdown();
    return;
  }

  const color    = getAvatarColor(user.name);
  const initials = getInitials(user.name);

  btn.innerHTML = `
    <span class="user-avatar" style="background:${color}">${initials}</span>
    <span class="user-name">${user.name.split(' ')[0]}</span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="user-chevron"><polyline points="6 9 12 15 18 9"/></svg>`;
  btn.title = user.name;
  btn.onclick = toggleDropdown;
}

function toggleDropdown() {
  const existing = document.getElementById('userDropdown');
  if (existing) { destroyDropdown(); return; }

  const btn  = document.getElementById('profileBtn');
  const rect = btn.getBoundingClientRect();
  const user = getCurrentUser();

  const drop = document.createElement('div');
  drop.id        = 'userDropdown';
  drop.className = 'user-dropdown';
  drop.style.top   = rect.bottom + 8 + 'px';
  drop.style.right = (window.innerWidth - rect.right) + 'px';

  drop.innerHTML = `
    <div class="user-dropdown__header">
      <span class="user-dropdown__name">${user?.name || ''}</span>
      <span class="user-dropdown__email">${user?.email || ''}</span>
    </div>
    <ul class="user-dropdown__menu">
      <li><button class="user-dropdown__item" id="ddOrders">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
        Мої замовлення
        <span class="user-dropdown__badge">0</span>
      </button></li>
      <li><button class="user-dropdown__item" id="ddWishlist">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        Вибране
      </button></li>
      <li><button class="user-dropdown__item" id="ddCompare">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Порівняння
      </button></li>
      <li class="user-dropdown__divider"></li>
      <li><button class="user-dropdown__item user-dropdown__item--danger" id="ddLogout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Вийти
      </button></li>
    </ul>`;

  document.body.appendChild(drop);
  requestAnimationFrame(() => drop.classList.add('user-dropdown--visible'));

  document.getElementById('ddOrders')?.addEventListener('click',  () => { destroyDropdown(); /* TODO: orders page */ });
  document.getElementById('ddWishlist')?.addEventListener('click', () => {
    destroyDropdown();
    import('./wishlist.js').then(m => m.openWishlistDrawer());
  });
  document.getElementById('ddCompare')?.addEventListener('click',  () => {
    destroyDropdown();
    import('./compare.js').then(m => m.openCompareModal());
  });
  document.getElementById('ddLogout')?.addEventListener('click', () => {
    destroyDropdown();
    clearSession();
    syncHeaderUser(null);
    showAuthToast('До зустрічі! 👋');
  });

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', outsideClick);
  }, 10);
}

function outsideClick(e) {
  if (!document.getElementById('userDropdown')?.contains(e.target) &&
      e.target !== document.getElementById('profileBtn')) {
    destroyDropdown();
  }
}

function destroyDropdown() {
  const d = document.getElementById('userDropdown');
  if (d) d.remove();
  document.removeEventListener('click', outsideClick);
}

// ── Init ─────────────────────────────────────────────────
export function initAuth() {
  buildModal();

  // Прибираємо старий onclick з HTML і вішаємо правильний
  const btn = document.getElementById('profileBtn');
  if (btn) {
    btn.onclick = null; // очистимо
    const user = getCurrentUser();
    if (user) {
      syncHeaderUser(user);
    } else {
      btn.addEventListener('click', () => openAuthModal('login'));
    }
  }
}