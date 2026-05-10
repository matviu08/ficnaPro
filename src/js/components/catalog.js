// ============================================================
//  catalog.js — рендер карток товарів та пагінація
// ============================================================
import { addToCart } from './cart.js';
import { GLASS_LABEL } from '../data/products.js';
import { toggleWishlist, isInWishlist, syncAllHeartButtons } from './wishlist.js';
import { toggleCompare, isInCompare, syncAllCompareButtons } from './compare.js';
import { openQuickView } from './quick-view.js';

const ITEMS_PER_PAGE = 9;

let _currentProducts = [];
let _currentPage     = 1;
let _viewMode        = 'grid'; // 'grid' | 'list'

// ── Stars helper ──────────────────────────────────────────
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ── Форматування ─────────────────────────────────────────
function fmt(n) {
  return n.toLocaleString('uk-UA') + ' ₴';
}

// ── Шаблон картки ────────────────────────────────────────
function cardTemplate(p) {
  const badgeHtml = p.badge ? `
    <span class="product-card__badge product-card__badge--${p.badge === 'sale' ? 'sale' : 'new'}">
      ${p.badgeLabel}
    </span>` : '';

  const oldPriceHtml = p.oldPrice
    ? `<span class="product-card__price-old">${fmt(p.oldPrice)}</span>`
    : '';

  const specsProfile = p.profileDepth
    ? `<li><span>Профіль:</span> ${p.profileDepth} мм, ${p.profileChambers} кам.</li>`
    : '';

  return `
  <article class="product-card" data-id="${p.id}">
    <div class="product-card__image-wrap">
      ${badgeHtml}
      <div class="product-card__image product-card__image--placeholder">
        ${p.svg}
      </div>
      <div class="product-card__actions">
        <button class="product-card__action-btn btn-wishlist" data-id="${p.id}" title="В обране">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <button class="product-card__action-btn btn-compare" data-id="${p.id}" title="Порівняти">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </button>
        <button class="product-card__action-btn btn-quickview" data-id="${p.id}" title="Швидкий перегляд">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
    </div>
    <div class="product-card__body">
      <p class="product-card__brand">${p.brand}</p>
      <h2 class="product-card__title">${p.title}</h2>
      <div class="product-card__rating">
        <span class="stars" title="${p.rating}">${renderStars(p.rating)}</span>
        <span class="rating-value">${p.rating.toFixed(1)}</span>
        <span class="rating-count">(${p.reviewCount} відг.)</span>
      </div>
      <ul class="product-card__specs">
        <li><span>Скло:</span> ${GLASS_LABEL[p.glass] || p.glass}</li>
        ${specsProfile}
        <li><span>Гарантія:</span> ${p.guarantee} р.</li>
      </ul>
      <div class="product-card__footer">
        <div class="product-card__price-wrap">
          <span class="product-card__price">${fmt(p.price)}</span>
          ${oldPriceHtml}
        </div>
        <button class="btn btn--primary btn--sm product-card__buy-btn" data-id="${p.id}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          Купити
        </button>
      </div>
    </div>
  </article>`;
}

// ── Порожній стан ────────────────────────────────────────
function emptyState(query = '') {
  return `
  <div class="catalog-empty">
    <svg width="80" height="80" viewBox="0 0 200 200" fill="none" opacity="0.18">
      <rect x="24" y="20" width="152" height="160" rx="8" stroke="#1a56db" stroke-width="6" fill="none"/>
      <line x1="100" y1="20" x2="100" y2="180" stroke="#1a56db" stroke-width="4"/>
      <line x1="24" y1="100" x2="176" y2="100" stroke="#1a56db" stroke-width="4"/>
      <line x1="60" y1="60" x2="140" y2="140" stroke="#e63946" stroke-width="5" stroke-linecap="round"/>
      <line x1="140" y1="60" x2="60" y2="140" stroke="#e63946" stroke-width="5" stroke-linecap="round"/>
    </svg>
    <p>Товарів не знайдено</p>
    <span>${query ? `За запитом «${query}» нічого не знайдено.` : 'Спробуйте змінити фільтри.'}</span>
  </div>`;
}

// ── Пагінація ────────────────────────────────────────────
function renderPagination(total, page) {
  const nav = document.querySelector('.pagination');
  if (!nav) return;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  if (totalPages <= 1) { nav.style.display = 'none'; return; }
  nav.style.display = 'flex';

  const prevDisabled = page === 1 ? 'disabled' : '';
  const nextDisabled = page === totalPages ? 'disabled' : '';

  let pages = '';
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || i === totalPages ||
      (i >= page - 1 && i <= page + 1)
    ) {
      pages += `<button class="pagination__page${i === page ? ' pagination__page--active' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === page - 2 || i === page + 2) {
      pages += `<span class="pagination__ellipsis">…</span>`;
    }
  }

  nav.innerHTML = `
    <button class="pagination__btn pagination__btn--prev" ${prevDisabled} data-page="${page - 1}" aria-label="Попередня">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    ${pages}
    <button class="pagination__btn pagination__btn--next" ${nextDisabled} data-page="${page + 1}" aria-label="Наступна">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </button>`;

  nav.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const p = Number(btn.dataset.page);
      if (p < 1 || p > totalPages) return;
      renderProducts(_currentProducts, p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ── Головна функція рендеру ───────────────────────────────
export function renderProducts(products, page = 1, searchQuery = '') {
  _currentProducts = products;
  _currentPage     = page;

  const grid  = document.getElementById('productsGrid');
  const count = document.getElementById('catalogCount');
  if (!grid) return;

  // Оновлення лічильника
  if (count) {
    count.textContent = `${products.length} ${pluralUa(products.length, 'товар', 'товари', 'товарів')}`;
  }

  if (products.length === 0) {
    grid.innerHTML = emptyState(searchQuery);
    renderPagination(0, 1);
    return;
  }

  const start    = (page - 1) * ITEMS_PER_PAGE;
  const pageData = products.slice(start, start + ITEMS_PER_PAGE);

  grid.innerHTML = pageData.map(cardTemplate).join('');

  // View mode
  grid.className = `products-grid${_viewMode === 'list' ? ' products-grid--list' : ''}`;

  // Анімація з затримкою
  grid.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.05}s`;
  });

  // Кнопки купити
  grid.querySelectorAll('.product-card__buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const p  = products.find(pr => pr.id === id);
      if (p) addToCart(p);
    });
  });

  // Wishlist
  grid.querySelectorAll('.btn-wishlist').forEach(btn => {
    const id = Number(btn.dataset.id);
    const active = isInWishlist(id);
    btn.classList.toggle('btn-wishlist--active', active);
    const path = btn.querySelector('path');
    if (path) path.setAttribute('fill', active ? '#e63946' : 'none');

    btn.addEventListener('click', () => {
      const p = products.find(pr => pr.id === id);
      if (p) toggleWishlist(p);
    });
  });

  // Compare
  grid.querySelectorAll('.btn-compare').forEach(btn => {
    const id = Number(btn.dataset.id);
    btn.classList.toggle('btn-compare--active', isInCompare(id));
    btn.addEventListener('click', () => {
      const p = products.find(pr => pr.id === id);
      if (p) toggleCompare(p);
    });
  });

  // Quick View
  grid.querySelectorAll('.btn-quickview').forEach(btn => {
    btn.addEventListener('click', () => {
      openQuickView(Number(btn.dataset.id));
    });
  });

  renderPagination(products.length, page);
}

// ── Перемикання виду ─────────────────────────────────────
export function initViewToggle() {
  document.getElementById('gridView')?.addEventListener('click', () => setView('grid'));
  document.getElementById('listView')?.addEventListener('click', () => setView('list'));
}

function setView(mode) {
  _viewMode = mode;
  const grid = document.getElementById('productsGrid');
  const btnGrid = document.getElementById('gridView');
  const btnList = document.getElementById('listView');
  if (grid) grid.className = `products-grid${mode === 'list' ? ' products-grid--list' : ''}`;
  btnGrid?.classList.toggle('view-toggle__btn--active', mode === 'grid');
  btnList?.classList.toggle('view-toggle__btn--active', mode === 'list');
}

// ── Утиліта: відмінювання ─────────────────────────────────
function pluralUa(n, one, few, many) {
  const mod10  = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return `${n} ${few}`;
  return `${n} ${many}`;
}