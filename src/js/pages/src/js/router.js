// ============================================================
//  router.js — SPA hash-роутер
//  Формат URL: /#catalog  /#sales  /#projects  /#contacts
// ============================================================

const routes = {};  // { hash: { render, init } }
let currentHash = '';

export function registerRoute(hash, { render, init }) {
  routes[hash] = { render, init };
}

export function navigate(hash) {
  window.location.hash = hash;
}

function resolveHash() {
  return window.location.hash.replace('#', '') || 'catalog';
}

async function renderPage() {
  const hash   = resolveHash();
  const route  = routes[hash] || routes['catalog'];

  if (hash === currentHash) return;
  currentHash = hash;

  // Оновити активне посилання у nav
  document.querySelectorAll('.nav__link[data-route]').forEach(a => {
    a.classList.toggle('nav__link--active', a.dataset.route === hash);
  });

  // Показати / сховати sidebar (тільки для каталогу)
  const sidebar = document.getElementById('sidebar');
  const layout  = document.querySelector('.layout');
  if (sidebar) {
    const showSidebar = hash === 'catalog';
    sidebar.style.display = showSidebar ? '' : 'none';
    layout?.classList.toggle('layout--no-sidebar', !showSidebar);
  }

  // Контейнер контенту
  const main = document.getElementById('mainContent');
  if (!main || !route) return;

  // Анімація fade-out
  main.style.opacity = '0';
  main.style.transform = 'translateY(6px)';
  main.style.transition = 'opacity 0.18s ease, transform 0.18s ease';

  await new Promise(r => setTimeout(r, 180));

  main.innerHTML = await route.render();

  // Анімація fade-in
  requestAnimationFrame(() => {
    main.style.opacity = '1';
    main.style.transform = 'translateY(0)';
  });

  if (route.init) route.init();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Breadcrumb
  updateBreadcrumb(hash);
}

function updateBreadcrumb(hash) {
  const labels = {
    catalog:    'Каталог вікон',
    sales:      'Акції та знижки',
    projects:   'Реалізовані проєкти',
    contacts:   'Контакти',
    calculator: 'Калькулятор вікон',
  };
  const el = document.querySelector('.breadcrumb__current');
  if (el) el.textContent = labels[hash] || 'Каталог';
}

export function initRouter() {
  window.addEventListener('hashchange', renderPage);
  renderPage(); // Початковий рендер

  // Клік на nav-посилання
  document.querySelectorAll('.nav__link[data-route]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigate(a.dataset.route);
    });
  });
}