// ============================================================
//  mobile.js — Мобільна навігація
//  ВИПРАВЛЕНО:
//  1. search-toggle вставляється в header__actions (не між nav і search)
//  2. sidebar display конфлікт — використовуємо клас sidebar--open
//  3. MutationObserver — фільтр-кнопка вставляється надійно
//  4. Синхронізація bottom-nav з роутером
// ============================================================
import { getCurrentUser, getInitials, getAvatarColor } from '../data/users.js';
import { openAuthModal }      from './auth.js';
import { openWishlistDrawer } from './wishlist.js';
import { openCompareModal }   from './compare.js';

const ROUTES = [
  {
    id: 'catalog',
    label: 'Каталог',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  },
  {
    id: 'sales',
    label: 'Акції',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  },
  {
    id: 'calculator',
    label: 'Калькулятор',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10" stroke-width="3"/><line x1="12" y1="10" x2="12.01" y2="10" stroke-width="3"/><line x1="16" y1="10" x2="16.01" y2="10" stroke-width="3"/><line x1="8" y1="14" x2="8.01" y2="14" stroke-width="3"/><line x1="12" y1="14" x2="12.01" y2="14" stroke-width="3"/><line x1="16" y1="14" x2="16.01" y2="14" stroke-width="3"/><line x1="8" y1="18" x2="16" y2="18" stroke-width="2"/></svg>`,
  },
  {
    id: 'projects',
    label: 'Проєкти',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    id: 'contacts',
    label: 'Контакти',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.2 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16z"/></svg>`,
  },
];

function currentRoute() {
  return window.location.hash.replace('#', '') || 'catalog';
}

// ══════════════════════════════════════════════════════════
//  BOTTOM NAV BAR
// ══════════════════════════════════════════════════════════
function buildBottomNav() {
  if (document.getElementById('bottomNav')) return;

  const html = `
  <nav class="bottom-nav" id="bottomNav" aria-label="Навігація">
    ${ROUTES.map(r => `
      <button class="bottom-nav__item${currentRoute() === r.id ? ' active' : ''}"
        data-route="${r.id}" aria-label="${r.label}">
        ${r.icon}
        <span>${r.label}</span>
      </button>`).join('')}
  </nav>`;

  document.body.insertAdjacentHTML('beforeend', html);

  document.querySelectorAll('.bottom-nav__item').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = btn.dataset.route;
    });
  });
}

function updateBottomNavActive(route) {
  document.querySelectorAll('.bottom-nav__item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });
  // Також оновити мобільне меню якщо відкрите
  document.querySelectorAll('.mobile-menu__nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });
}

// ══════════════════════════════════════════════════════════
//  MOBILE MENU DRAWER
// ══════════════════════════════════════════════════════════
let menuBuilt = false;

function buildMobileMenu() {
  if (menuBuilt) return;
  menuBuilt = true;

  document.body.insertAdjacentHTML('beforeend', `
  <div class="mobile-menu__overlay" id="menuOverlay"></div>
  <nav class="mobile-menu" id="mobileMenu" aria-label="Мобільне меню">
    <div class="mobile-menu__header">
      <div class="mobile-menu__logo">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="28" height="28" rx="4"/>
          <line x1="16" y1="2" x2="16" y2="30"/>
          <line x1="2" y1="16" x2="30" y2="16"/>
        </svg>
        Вікна<strong>Про</strong>
      </div>
      <button class="mobile-menu__close" id="menuClose" aria-label="Закрити">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="mobile-menu__user" id="menuUserBlock">${renderMenuUserBlock()}</div>
    <div class="mobile-menu__nav">
      ${ROUTES.map(r => `
        <button class="mobile-menu__nav-item${currentRoute() === r.id ? ' active' : ''}" data-route="${r.id}">
          ${r.icon} ${r.label}
        </button>`).join('')}
    </div>
    <div class="mobile-menu__actions">
      <button class="mobile-menu__action-btn" id="menuWishlist">
        <span style="display:flex;align-items:center;gap:10px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>Вибране
        </span>
        <span class="action-btn__badge action-btn__badge--visible" id="menuWishBadge"
          style="position:static;min-width:18px;height:18px;display:none">0</span>
      </button>
      <button class="mobile-menu__action-btn" id="menuCompare">
        <span style="display:flex;align-items:center;gap:10px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>Порівняння
        </span>
        <span class="action-btn__badge action-btn__badge--visible" id="menuCompBadge"
          style="position:static;min-width:18px;height:18px;display:none">0</span>
      </button>
    </div>
  </nav>`);

  // Events
  document.getElementById('menuClose').addEventListener('click', closeMenu);
  document.getElementById('menuOverlay').addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-menu__nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = btn.dataset.route;
      closeMenu();
    });
  });

  document.getElementById('menuWishlist')?.addEventListener('click', () => {
    closeMenu(); openWishlistDrawer();
  });
  document.getElementById('menuCompare')?.addEventListener('click', () => {
    closeMenu(); openCompareModal();
  });

  // Login btn (якщо є)
  attachMenuLoginBtn();

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

function renderMenuUserBlock() {
  const user = getCurrentUser();
  if (user) {
    const color = getAvatarColor(user.name);
    return `
    <div class="mobile-menu__user-logged">
      <div class="mobile-menu__avatar" style="background:${color}">${getInitials(user.name)}</div>
      <div class="mobile-menu__user-info">
        <div class="mobile-menu__user-name">${user.name}</div>
        <div class="mobile-menu__user-email">${user.email}</div>
      </div>
    </div>`;
  }
  return `
  <button class="mobile-menu__login-btn" id="menuLoginBtn">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
    Увійти в акаунт
  </button>`;
}

function attachMenuLoginBtn() {
  document.getElementById('menuLoginBtn')?.addEventListener('click', () => {
    closeMenu();
    openAuthModal('login');
  });
}

export function syncMobileMenuUser() {
  const block = document.getElementById('menuUserBlock');
  if (block) {
    block.innerHTML = renderMenuUserBlock();
    attachMenuLoginBtn();
  }
}

export function openMenu() {
  buildMobileMenu();
  document.getElementById('mobileMenu')?.classList.add('mobile-menu--open');
  document.getElementById('menuOverlay')?.classList.add('mobile-menu__overlay--visible');
  document.body.style.overflow = 'hidden';
  syncMenuBadges();
}

function closeMenu() {
  document.getElementById('mobileMenu')?.classList.remove('mobile-menu--open');
  document.getElementById('menuOverlay')?.classList.remove('mobile-menu__overlay--visible');
  document.body.style.overflow = '';
}

function syncMenuBadges() {
  try {
    const w = JSON.parse(localStorage.getItem('viknapro_wishlist') || '[]').length;
    const c = JSON.parse(localStorage.getItem('viknapro_compare')  || '[]').length;
    const wb = document.getElementById('menuWishBadge');
    const cb = document.getElementById('menuCompBadge');
    if (wb) { wb.textContent = w; wb.style.display = w > 0 ? 'inline-flex' : 'none'; }
    if (cb) { cb.textContent = c; cb.style.display = c > 0 ? 'inline-flex' : 'none'; }
  } catch {}
}

// ══════════════════════════════════════════════════════════
//  SIDEBAR DRAWER (mobile)
// ══════════════════════════════════════════════════════════
function buildSidebarOverlay() {
  if (document.getElementById('sidebarOverlay')) return;
  document.body.insertAdjacentHTML('beforeend',
    `<div class="sidebar-overlay" id="sidebarOverlay"></div>`
  );
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
}

export function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  buildSidebarOverlay();

  // Додаємо кнопку закриття якщо немає
  if (!sidebar.querySelector('.sidebar__close-btn')) {
    sidebar.insertAdjacentHTML('afterbegin', `
      <button class="sidebar__close-btn" id="sidebarCloseBtn" aria-label="Закрити">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
        Закрити фільтри
      </button>`);
    document.getElementById('sidebarCloseBtn')?.addEventListener('click', closeSidebar);
  }

  sidebar.classList.add('sidebar--open');
  document.getElementById('sidebarOverlay')?.classList.add('sidebar-overlay--visible');
  document.body.style.overflow = 'hidden';
}

export function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('sidebar--open');
  document.getElementById('sidebarOverlay')?.classList.remove('sidebar-overlay--visible');
  document.body.style.overflow = '';
}

// ══════════════════════════════════════════════════════════
//  SEARCH TOGGLE
// ══════════════════════════════════════════════════════════
function buildSearchToggle() {
  if (document.getElementById('searchToggle')) return;

  const headerActions = document.querySelector('.header__actions');
  const headerSearch  = document.querySelector('.header__search');
  if (!headerActions || !headerSearch) return;

  // Вставляємо кнопку пошуку ПЕРЕД кошиком
  headerActions.insertAdjacentHTML('afterbegin', `
    <button class="header__search-toggle" id="searchToggle" aria-label="Пошук" title="Пошук">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </button>`);

  let searchOpen = false;

  document.getElementById('searchToggle')?.addEventListener('click', e => {
    e.stopPropagation();
    searchOpen = !searchOpen;
    headerSearch.classList.toggle('search--open', searchOpen);
    if (searchOpen) {
      setTimeout(() => document.getElementById('searchInput')?.focus(), 50);
    }
  });

  document.addEventListener('click', e => {
    if (!searchOpen) return;
    if (!headerSearch.contains(e.target) && e.target.id !== 'searchToggle') {
      searchOpen = false;
      headerSearch.classList.remove('search--open');
    }
  });

  document.getElementById('searchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchOpen = false;
      headerSearch.classList.remove('search--open');
      document.getElementById('searchToggle')?.focus();
    }
  });
}

// ══════════════════════════════════════════════════════════
//  FILTER BUTTON (catalog page)
// ══════════════════════════════════════════════════════════
function injectFilterButton() {
  // Перевіряємо тільки на мобільному
  if (window.innerWidth > 768) return;
  if (document.getElementById('mobileFilterBtn')) return;

  const toolbar = document.querySelector('.catalog-toolbar__right');
  const sidebar = document.getElementById('sidebar');
  if (!toolbar || !sidebar) return;

  toolbar.insertAdjacentHTML('afterbegin', `
    <button class="mobile-filter-btn" id="mobileFilterBtn" aria-label="Відкрити фільтри">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="4"  y1="6"  x2="20" y2="6"/>
        <line x1="8"  y1="12" x2="16" y2="12"/>
        <line x1="11" y1="18" x2="13" y2="18"/>
      </svg>
      Фільтри
    </button>`);

  document.getElementById('mobileFilterBtn')?.addEventListener('click', openSidebar);
}

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════
export function initMobile() {
  // Bottom nav
  buildBottomNav();

  // Burger
  document.getElementById('burgerBtn')?.addEventListener('click', openMenu);

  // Search toggle
  buildSearchToggle();

  // Синхронізація при зміні маршруту
  window.addEventListener('hashchange', () => {
    const route = currentRoute();
    updateBottomNavActive(route);
  });

  // MutationObserver для filter button
  // Спрацьовує коли роутер рендерить catalog-toolbar
  const observer = new MutationObserver(() => {
    injectFilterButton();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Resize: прибираємо sidebar--open якщо переходимо на десктоп
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeSidebar();
      document.getElementById('mobileMenu')?.classList.remove('mobile-menu--open');
      document.getElementById('menuOverlay')?.classList.remove('mobile-menu__overlay--visible');
      document.body.style.overflow = '';
    }
  });
}      <line x1="12" y1="10" x2="12.01" y2="10" stroke-width="3"/>
      <line x1="16" y1="10" x2="16.01" y2="10" stroke-width="3"/>
      <line x1="8" y1="14" x2="8.01" y2="14" stroke-width="3"/>
      <line x1="12" y1="14" x2="12.01" y2="14" stroke-width="3"/>
      <line x1="16" y1="14" x2="16.01" y2="14" stroke-width="3"/>
      <line x1="8" y1="18" x2="16" y2="18" stroke-width="3"/>
    </svg>`,
  },
  {
    id: 'projects',
    label: 'Проєкти',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`,
  },
  {
    id: 'contacts',
    label: 'Контакти',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.2 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16z"/>
    </svg>`,
  },
];

// Поточний маршрут
function currentRoute() {
  return window.location.hash.replace('#', '') || 'catalog';
}

// ══════════════════════════════════════════════════════════
//  BOTTOM NAV BAR
// ══════════════════════════════════════════════════════════
function buildBottomNav() {
  if (document.getElementById('bottomNav')) return;

  // Bottom nav показує тільки 5 основних маршрутів
  const navRoutes = ROUTES.slice(0, 5);

  const html = `
  <nav class="bottom-nav" id="bottomNav">
    ${navRoutes.map(r => `
      <button class="bottom-nav__item${currentRoute() === r.id ? ' active' : ''}"
        data-route="${r.id}"
        aria-label="${r.label}">
        ${r.icon}
        <span>${r.label}</span>
        ${r.id === 'catalog' ? `<span class="bottom-nav__badge" id="bnCartBadge"></span>` : ''}
      </button>`).join('')}
  </nav>`;

  document.body.insertAdjacentHTML('beforeend', html);

  // Events
  document.querySelectorAll('.bottom-nav__item').forEach(btn => {
    btn.addEventListener('click', () => {
      const route = btn.dataset.route;
      window.location.hash = route;
      updateBottomNavActive(route);
    });
  });
}

function updateBottomNavActive(route) {
  document.querySelectorAll('.bottom-nav__item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });
}

// ══════════════════════════════════════════════════════════
//  MOBILE MENU DRAWER
// ══════════════════════════════════════════════════════════
function buildMobileMenu() {
  if (document.getElementById('mobileMenu')) return;

  document.body.insertAdjacentHTML('beforeend', `
  <div class="mobile-menu__overlay" id="menuOverlay"></div>
  <nav class="mobile-menu" id="mobileMenu" aria-label="Мобільне меню">
    <div class="mobile-menu__header">
      <div class="mobile-menu__logo">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="28" height="28" rx="4"/>
          <line x1="16" y1="2" x2="16" y2="30"/>
          <line x1="2" y1="16" x2="30" y2="16"/>
        </svg>
        Вікна<strong>Про</strong>
      </div>
      <button class="mobile-menu__close" id="menuClose" aria-label="Закрити меню">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="mobile-menu__user" id="menuUserBlock">
      ${renderMenuUserBlock()}
    </div>

    <div class="mobile-menu__nav">
      ${ROUTES.map(r => `
        <button class="mobile-menu__nav-item${currentRoute() === r.id ? ' active' : ''}" data-route="${r.id}">
          ${r.icon}
          ${r.label}
        </button>`).join('')}
    </div>

    <div class="mobile-menu__actions">
      <button class="mobile-menu__action-btn" id="menuWishlist">
        <span style="display:flex;align-items:center;gap:10px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          Вибране
        </span>
        <span class="action-btn__badge action-btn__badge--visible" id="menuWishBadge" style="position:static;min-width:20px;height:20px" hidden>0</span>
      </button>
      <button class="mobile-menu__action-btn" id="menuCompare">
        <span style="display:flex;align-items:center;gap:10px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          Порівняння
        </span>
        <span class="action-btn__badge action-btn__badge--visible" id="menuCompBadge" style="position:static;min-width:20px;height:20px" hidden>0</span>
      </button>
      ${getCurrentUser() ? `
      <button class="mobile-menu__action-btn" id="menuLogout" style="color:var(--color-sale)">
        <span style="display:flex;align-items:center;gap:10px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Вийти
        </span>
      </button>` : ''}
    </div>
  </nav>`);

  // Events
  document.getElementById('menuClose').addEventListener('click', closeMenu);
  document.getElementById('menuOverlay').addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-menu__nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const route = btn.dataset.route;
      window.location.hash = route;
      updateBottomNavActive(route);
      closeMenu();
    });
  });

  document.getElementById('menuWishlist')?.addEventListener('click', () => {
    closeMenu();
    openWishlistDrawer();
  });
  document.getElementById('menuCompare')?.addEventListener('click', () => {
    closeMenu();
    openCompareModal();
  });
  document.getElementById('menuLogout')?.addEventListener('click', () => {
    closeMenu();
    import('../data/users.js').then(m => {
      m.clearSession();
      import('./auth.js').then(a => a.syncHeaderUser(null));
      syncMenuUserBlock();
    });
  });

  // Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

function renderMenuUserBlock() {
  const user = getCurrentUser();
  if (user) {
    const color = getAvatarColor(user.name);
    return `
    <div class="mobile-menu__user-logged">
      <div class="mobile-menu__avatar" style="background:${color}">
        ${getInitials(user.name)}
      </div>
      <div class="mobile-menu__user-info">
        <div class="mobile-menu__user-name">${user.name}</div>
        <div class="mobile-menu__user-email">${user.email}</div>
      </div>
    </div>`;
  }
  return `
  <button class="mobile-menu__login-btn" id="menuLoginBtn">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
    Увійти в акаунт
  </button>`;
}

function syncMenuUserBlock() {
  const block = document.getElementById('menuUserBlock');
  if (block) {
    block.innerHTML = renderMenuUserBlock();
    document.getElementById('menuLoginBtn')?.addEventListener('click', () => {
      closeMenu();
      openAuthModal('login');
    });
  }
}

export function openMenu() {
  buildMobileMenu();
  const menu    = document.getElementById('mobileMenu');
  const overlay = document.getElementById('menuOverlay');
  menu?.classList.add('mobile-menu--open');
  overlay?.classList.add('mobile-menu__overlay--visible');
  document.body.style.overflow = 'hidden';

  // Підвантажити бейджі
  syncMenuBadges();
}

function closeMenu() {
  document.getElementById('mobileMenu')?.classList.remove('mobile-menu--open');
  document.getElementById('menuOverlay')?.classList.remove('mobile-menu__overlay--visible');
  document.body.style.overflow = '';
}

function syncMenuBadges() {
  try {
    const wishItems = JSON.parse(localStorage.getItem('viknapro_wishlist') || '[]');
    const compItems = JSON.parse(localStorage.getItem('viknapro_compare')  || '[]');
    const wishBadge = document.getElementById('menuWishBadge');
    const compBadge = document.getElementById('menuCompBadge');
    if (wishBadge) {
      wishBadge.textContent = wishItems.length;
      wishBadge.hidden = wishItems.length === 0;
    }
    if (compBadge) {
      compBadge.textContent = compItems.length;
      compBadge.hidden = compItems.length === 0;
    }
  } catch {}
}

// ══════════════════════════════════════════════════════════
//  SIDEBAR DRAWER (mobile)
// ══════════════════════════════════════════════════════════
function buildSidebarOverlay() {
  if (document.getElementById('sidebarOverlay')) return;
  document.body.insertAdjacentHTML('beforeend',
    `<div class="sidebar-overlay" id="sidebarOverlay"></div>`
  );
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
}

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  buildSidebarOverlay();

  // Додаємо кнопку закриття всередині sidebar якщо її немає
  if (sidebar && !sidebar.querySelector('.sidebar__close-btn')) {
    sidebar.insertAdjacentHTML('afterbegin', `
      <button class="sidebar__close-btn" id="sidebarCloseBtn" aria-label="Закрити фільтри">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
        Закрити фільтри
      </button>`);
    document.getElementById('sidebarCloseBtn')?.addEventListener('click', closeSidebar);
  }

  sidebar?.classList.add('sidebar--open');
  overlay?.classList.add('sidebar-overlay--visible');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('sidebar--open');
  document.getElementById('sidebarOverlay')?.classList.remove('sidebar-overlay--visible');
  document.body.style.overflow = '';
}

// ══════════════════════════════════════════════════════════
//  SEARCH TOGGLE
// ══════════════════════════════════════════════════════════
function buildSearchToggle() {
  if (document.getElementById('searchToggle')) return;

  // Вставляємо кнопку пошуку між logo і actions
  const headerInner = document.querySelector('.header__inner');
  const headerSearch = document.querySelector('.header__search');
  if (!headerInner || !headerSearch) return;

  // Додаємо кнопку ПЕРЕД search
  headerSearch.insertAdjacentHTML('beforebegin', `
    <button class="header__search-toggle" id="searchToggle" aria-label="Пошук">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </button>`);

  let searchOpen = false;

  document.getElementById('searchToggle')?.addEventListener('click', () => {
    searchOpen = !searchOpen;
    headerSearch.classList.toggle('search--open', searchOpen);
    if (searchOpen) {
      document.getElementById('searchInput')?.focus();
    }
  });

  // Закрити при кліку поза
  document.addEventListener('click', e => {
    if (searchOpen && !headerSearch.contains(e.target) &&
        e.target.id !== 'searchToggle') {
      searchOpen = false;
      headerSearch.classList.remove('search--open');
    }
  });

  // Закрити при Escape
  document.getElementById('searchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchOpen = false;
      headerSearch.classList.remove('search--open');
    }
  });
}

// ══════════════════════════════════════════════════════════
//  FILTER BUTTON (catalog page)
// ══════════════════════════════════════════════════════════
function buildFilterButton() {
  // Спостерігаємо за змінами DOM — кнопку треба додати після рендеру каталогу
  const observer = new MutationObserver(() => {
    const toolbar = document.querySelector('.catalog-toolbar__right');
    if (toolbar && !document.getElementById('mobileFilterBtn') &&
        document.getElementById('sidebar')) {
      toolbar.insertAdjacentHTML('afterbegin', `
        <button class="mobile-filter-btn" id="mobileFilterBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Фільтри
        </button>`);
      document.getElementById('mobileFilterBtn')?.addEventListener('click', openSidebar);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════
export function initMobile() {
  // Burger button
  const burger = document.getElementById('burgerBtn');
  if (burger) {
    burger.addEventListener('click', openMenu);
  }

  // Bottom nav
  buildBottomNav();

  // Search toggle
  buildSearchToggle();

  // Filter button (observer)
  buildFilterButton();

  // Sync bottom nav при зміні маршруту
  window.addEventListener('hashchange', () => {
    const route = window.location.hash.replace('#', '') || 'catalog';
    updateBottomNavActive(route);

    // Оновити активний пункт у мобільному меню
    document.querySelectorAll('.mobile-menu__nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === route);
    });
  });

  // При зміні авторизації — оновлюємо меню
  document.addEventListener('auth:changed', syncMenuUserBlock);
}

export { closeSidebar, syncMenuBadges };
