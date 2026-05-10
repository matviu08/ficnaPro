// ============================================================
//  main.js — точка входу
// ============================================================
import { initCart }      from './js/components/cart.js';
import { initWishlist }  from './js/components/wishlist.js';
import { initCompare }   from './js/components/compare.js';
import { initHeader }    from './js/components/header.js';
import { initSidebar }   from './js/components/sidebar.js';
import { initAuth }      from './js/components/auth.js';
import { initQuickView } from './js/components/quick-view.js';
import { seedDemoUser }  from './js/data/users.js';

import { registerRoute, initRouter } from './js/router.js';
import { catalogPage }    from './js/pages/catalog-page.js';
import { salesPage }      from './js/pages/sales-page.js';
import { projectsPage }   from './js/pages/projects-page.js';
import { contactsPage }   from './js/pages/contacts-page.js';
import { calculatorPage } from './js/pages/calculator-page.js';

document.addEventListener('DOMContentLoaded', () => {
  // ── Демо-дані ─────────────────────────────────────────────
  seedDemoUser(); // створює demo@viknapro.ua / demo123 при першому запуску

  // ── Маршрути ─────────────────────────────────────────────
  registerRoute('catalog',    catalogPage);
  registerRoute('sales',      salesPage);
  registerRoute('projects',   projectsPage);
  registerRoute('contacts',   contactsPage);
  registerRoute('calculator', calculatorPage);

  // ── Постійні модулі ──────────────────────────────────────
  initCart();
  initWishlist();
  initCompare();
  initAuth();        // ← Авторизація
  initQuickView();   // ← Швидкий перегляд
  initHeader();
  initSidebar();

  // ── Роутер ───────────────────────────────────────────────
  initRouter();

  console.log('ВікнаПро ✓ повністю ініціалізовано');
  console.log('🔑 Demo: demo@viknapro.ua / demo123');
});