// ============================================================
//  quick-view.js — Швидкий перегляд товару
//  Повна інформація про товар без переходу на окрему сторінку
// ============================================================
import { PRODUCTS, GLASS_LABEL } from '../data/products.js';
import { addToCart }              from './cart.js';
import { toggleWishlist, isInWishlist } from './wishlist.js';
import { toggleCompare, isInCompare }   from './compare.js';

// Додаткові SVG-види для галереї (вид зсередини / збоку)
function getExtraViews(product) {
  const base = product.svg;

  // "Вид збоку" — профіль вікна
  const sideView = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="80" y="20" width="40" height="160" rx="4" fill="#eef2f9" stroke="#b8c8df" stroke-width="3"/>
    <rect x="85" y="25" width="30" height="150" rx="2" fill="#d4e4f4" stroke="#8ab0d0" stroke-width="1.5" opacity="0.7"/>
    <rect x="80" y="20" width="40" height="8" rx="2" fill="#b8c8df"/>
    <rect x="80" y="172" width="40" height="8" rx="2" fill="#b8c8df"/>
    <line x1="80" y1="100" x2="120" y2="100" stroke="#b8c8df" stroke-width="1.5"/>
    <text x="50" y="105" font-size="9" fill="#8a96a8" font-family="sans-serif">Профіль</text>
    <text x="125" y="105" font-size="9" fill="#8a96a8" font-family="sans-serif">Скло</text>
    <line x1="70" y1="55" x2="80" y2="55" stroke="#b8c8df" stroke-width="1" stroke-dasharray="3"/>
    <line x1="70" y1="145" x2="80" y2="145" stroke="#b8c8df" stroke-width="1" stroke-dasharray="3"/>
  </svg>`;

  // "Вид встановленого" — вікно у стіні
  const wallView = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="200" height="200" fill="#f5ede4"/>
    <rect x="0" y="0" width="200" height="40" fill="#e8ddd4"/>
    <rect x="0" y="160" width="200" height="40" fill="#e8ddd4"/>
    <rect x="40" y="40" width="120" height="120" rx="4" fill="#eef2f9" stroke="#b8c8df" stroke-width="4"/>
    <line x1="100" y1="40" x2="100" y2="160" stroke="#b8c8df" stroke-width="2"/>
    <line x1="40" y1="100" x2="160" y2="100" stroke="#b8c8df" stroke-width="2"/>
    <rect x="36" y="36" width="128" height="128" rx="6" fill="none" stroke="#8a9ab0" stroke-width="2" stroke-dasharray="4 3" opacity="0.4"/>
    <circle cx="100" cy="100" r="6" fill="#8aaed4" opacity="0.5"/>
    <text x="75" y="185" font-size="9" fill="#8a96a8" font-family="sans-serif">Встановлено</text>
  </svg>`;

  return [base, sideView, wallView];
}

const COLOR_NAMES = {
  white:      'Білий',
  oak:        'Дуб золотий',
  teak:       'Тік',
  walnut:     'Горіх темний',
  anthracite: 'Антрацит',
  black:      'Чорний',
};
const COLOR_HEX = {
  white: '#ffffff', oak: '#c8a882', teak: '#8b6f5e',
  walnut: '#5c4033', anthracite: '#424242', black: '#212121',
};

// Доступні кольори для кожного бренду (спрощена логіка)
const BRAND_COLORS = {
  'REHAU':     ['white', 'oak', 'walnut', 'anthracite'],
  'VEKA':      ['white', 'oak', 'anthracite'],
  'Salamander':['white', 'oak', 'anthracite', 'black'],
  'Aluplast':  ['white', 'anthracite'],
  'KBE':       ['white', 'oak'],
  'Reynaers':  ['white', 'anthracite', 'black'],
  'Schüco':    ['white', 'anthracite', 'black'],
  'Velux':     ['white', 'oak'],
  'Fakro':     ['white', 'oak'],
  'Internorm': ['white', 'oak', 'walnut'],
  'Elwin':     ['white', 'oak', 'walnut'],
  'Provedal':  ['white', 'anthracite'],
};

// Типові розміри
const SIZES = ['600×900', '800×1200', '900×1200', '1000×1400', '1200×1400', '1400×1400', '1500×1800'];

// ══════════════════════════════════════════════════════════
//  BUILD MODAL
// ══════════════════════════════════════════════════════════
function buildModal() {
  if (document.getElementById('quickViewModal')) return;

  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal-overlay" id="qvOverlay"></div>
  <div class="qv-modal" id="quickViewModal" role="dialog" aria-label="Швидкий перегляд">
    <button class="qv-modal__close" id="qvClose" aria-label="Закрити">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <div class="qv-modal__inner" id="qvInner"></div>
  </div>`);

  document.getElementById('qvClose').addEventListener('click', closeQuickView);
  document.getElementById('qvOverlay').addEventListener('click', closeQuickView);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuickView(); });
}

// ── Open / Close ──────────────────────────────────────────
export function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === Number(productId));
  if (!product) return;

  buildModal();
  renderQuickView(product);

  document.getElementById('quickViewModal').classList.add('qv-modal--open');
  document.getElementById('qvOverlay').classList.add('modal-overlay--visible');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  document.getElementById('quickViewModal')?.classList.remove('qv-modal--open');
  document.getElementById('qvOverlay')?.classList.remove('modal-overlay--visible');
  document.body.style.overflow = '';
}

// ── Render ────────────────────────────────────────────────
function renderQuickView(product) {
  const inner = document.getElementById('qvInner');
  if (!inner) return;

  const views   = getExtraViews(product);
  const colors  = BRAND_COLORS[product.brand] || ['white'];
  const inWish  = isInWishlist(product.id);
  const inComp  = isInCompare(product.id);

  const badgeHtml = product.badge
    ? `<span class="qv-badge qv-badge--${product.badge === 'sale' ? 'sale' : 'new'}">${product.badgeLabel}</span>`
    : '';

  const oldPriceHtml = product.oldPrice
    ? `<span class="qv-price-old">${product.oldPrice.toLocaleString('uk-UA')} ₴</span>
       <span class="qv-discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% знижка</span>`
    : '';

  inner.innerHTML = `
  <div class="qv-gallery" id="qvGallery">
    <div class="qv-gallery__main" id="qvMainImg">
      ${views[0]}
    </div>
    <div class="qv-gallery__thumbs" id="qvThumbs">
      ${views.map((v, i) => `
        <button class="qv-thumb${i === 0 ? ' qv-thumb--active' : ''}" data-index="${i}">
          ${v}
        </button>`).join('')}
    </div>
  </div>

  <div class="qv-info">
    <!-- Brand + badges -->
    <div class="qv-info__top">
      <span class="qv-brand">${product.brand}</span>
      ${badgeHtml}
    </div>

    <!-- Title -->
    <h2 class="qv-title">${product.title}</h2>

    <!-- Rating -->
    <div class="qv-rating">
      <span class="stars">${renderStars(product.rating)}</span>
      <span class="rating-value">${product.rating.toFixed(1)}</span>
      <span class="rating-count">(${product.reviewCount} відгуків)</span>
      <a href="#" class="qv-rating__link">Читати відгуки</a>
    </div>

    <!-- Price -->
    <div class="qv-price-block">
      <span class="qv-price">${product.price.toLocaleString('uk-UA')} ₴</span>
      ${oldPriceHtml}
    </div>

    <!-- Color picker -->
    <div class="qv-option-group">
      <div class="qv-option-label">
        Колір профілю: <strong id="qvColorName">${COLOR_NAMES[product.color] || product.color}</strong>
      </div>
      <div class="qv-colors" id="qvColors">
        ${colors.map(c => `
          <button
            class="qv-color-swatch${c === product.color ? ' qv-color-swatch--active' : ''}"
            style="--swatch: ${COLOR_HEX[c] || '#fff'}"
            data-color="${c}"
            title="${COLOR_NAMES[c] || c}">
          </button>`).join('')}
      </div>
    </div>

    <!-- Size picker -->
    <div class="qv-option-group">
      <div class="qv-option-label">Розмір (Ш×В): <strong id="qvSizeName">${SIZES[3]}</strong></div>
      <div class="qv-sizes" id="qvSizes">
        ${SIZES.map((s, i) => `
          <button class="qv-size-btn${i === 3 ? ' qv-size-btn--active' : ''}" data-size="${s}">
            ${s}
          </button>`).join('')}
      </div>
    </div>

    <!-- Specs table -->
    <div class="qv-specs">
      <div class="qv-specs__row"><span>Тип скла</span><span>${GLASS_LABEL[product.glass] || product.glass}</span></div>
      ${product.profileDepth ? `<div class="qv-specs__row"><span>Глибина профілю</span><span>${product.profileDepth} мм</span></div>` : ''}
      ${product.profileChambers ? `<div class="qv-specs__row"><span>Камери профілю</span><span>${product.profileChambers}</span></div>` : ''}
      <div class="qv-specs__row"><span>Гарантія</span><span>${product.guarantee} років</span></div>
      <div class="qv-specs__row"><span>Категорія</span><span>${getCategoryLabel(product.category)}</span></div>
    </div>

    <!-- Quantity -->
    <div class="qv-qty-row">
      <div class="qv-qty">
        <button class="qty-btn qv-qty-dec">−</button>
        <span class="qty-val" id="qvQtyVal">1</span>
        <button class="qty-btn qv-qty-inc">+</button>
      </div>
      <div class="qv-availability">
        <span class="qv-in-stock">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Є в наявності
        </span>
      </div>
    </div>

    <!-- CTA buttons -->
    <div class="qv-actions">
      <button class="btn btn--primary qv-add-cart" data-id="${product.id}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        В кошик
      </button>
      <button class="qv-icon-btn qv-wishlist-btn${inWish ? ' btn-wishlist--active' : ''}" data-id="${product.id}" title="В вибране">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="${inWish ? '#e63946' : 'none'}" stroke="${inWish ? '#e63946' : 'currentColor'}" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>
      <button class="qv-icon-btn qv-compare-btn${inComp ? ' btn-compare--active' : ''}" data-id="${product.id}" title="Порівняти">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </button>
    </div>

    <!-- Extra info -->
    <div class="qv-perks">
      <div class="qv-perk">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        Безкоштовний замір
      </div>
      <div class="qv-perk">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/></svg>
        Монтаж під ключ
      </div>
      <div class="qv-perk">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Гарантія ${product.guarantee} р.
      </div>
    </div>
  </div>`;

  attachQVEvents(product, views);
}

// ── Attach events ─────────────────────────────────────────
function attachQVEvents(product, views) {
  let currentQty = 1;

  // Gallery thumbnails
  document.querySelectorAll('.qv-thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      document.getElementById('qvMainImg').innerHTML = views[idx];
      document.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('qv-thumb--active'));
      btn.classList.add('qv-thumb--active');
    });
  });

  // Color picker
  document.querySelectorAll('.qv-color-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.qv-color-swatch').forEach(b => b.classList.remove('qv-color-swatch--active'));
      btn.classList.add('qv-color-swatch--active');
      document.getElementById('qvColorName').textContent = COLOR_NAMES[btn.dataset.color] || btn.dataset.color;
    });
  });

  // Size picker
  document.querySelectorAll('.qv-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.qv-size-btn').forEach(b => b.classList.remove('qv-size-btn--active'));
      btn.classList.add('qv-size-btn--active');
      document.getElementById('qvSizeName').textContent = btn.dataset.size;
    });
  });

  // Quantity
  document.querySelector('.qv-qty-dec')?.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      document.getElementById('qvQtyVal').textContent = currentQty;
    }
  });
  document.querySelector('.qv-qty-inc')?.addEventListener('click', () => {
    currentQty++;
    document.getElementById('qvQtyVal').textContent = currentQty;
  });

  // Add to cart
  document.querySelector('.qv-add-cart')?.addEventListener('click', () => {
    for (let i = 0; i < currentQty; i++) addToCart(product);
    const btn = document.querySelector('.qv-add-cart');
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Додано!`;
    btn.classList.add('btn--added');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('btn--added'); }, 1800);
  });

  // Wishlist
  document.querySelector('.qv-wishlist-btn')?.addEventListener('click', btn => {
    toggleWishlist(product);
    const el    = btn.currentTarget;
    const inW   = isInWishlist(product.id);
    const svg   = el.querySelector('svg');
    el.classList.toggle('btn-wishlist--active', inW);
    svg?.setAttribute('fill', inW ? '#e63946' : 'none');
    svg?.setAttribute('stroke', inW ? '#e63946' : 'currentColor');
  });

  // Compare
  document.querySelector('.qv-compare-btn')?.addEventListener('click', btn => {
    toggleCompare(product);
    const el  = btn.currentTarget;
    el.classList.toggle('btn-compare--active', isInCompare(product.id));
  });
}

// ── Helpers ───────────────────────────────────────────────
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function getCategoryLabel(id) {
  const map = {
    'metal-plastic': 'Металопластикові',
    'wooden':        "Дерев'яні",
    'aluminum':      'Алюмінієві',
    'balcony':       'Балконні двері',
    'mansard':       'Мансардні',
  };
  return map[id] || id;
}

// ── Init ─────────────────────────────────────────────────
export function initQuickView() {
  buildModal();
}