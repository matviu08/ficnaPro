// ============================================================
//  wishlist.js — Вибране
//  ВИПРАВЛЕНО: items більше не кешується в пам'яті —
//  кожна операція читає/пише напряму з localStorage
// ============================================================
import { addToCart } from './cart.js';

const STORAGE_KEY = 'viknapro_wishlist';

// ── Storage helpers (завжди читаємо свіжо) ────────────────
function getItems() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function setItems(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// ── API ───────────────────────────────────────────────────
export function toggleWishlist(product) {
  const items = getItems();
  const idx   = items.findIndex(p => p.id === product.id);
  if (idx >= 0) {
    items.splice(idx, 1);
  } else {
    items.push(product);
  }
  setItems(items);
  syncWishlistUI();
  syncAllHeartButtons();
  if (getItems().length > 0) openWishlistDrawer();
}

export function isInWishlist(productId) {
  return getItems().some(p => p.id === productId);
}

export function getWishlistItems() {
  return getItems();
}

// ── Header badge ─────────────────────────────────────────
export function syncWishlistUI() {
  const badge = document.getElementById('wishlistBadge');
  if (!badge) return;
  const count = getItems().length;
  badge.textContent = count;
  badge.classList.toggle('action-btn__badge--visible', count > 0);
}

// ── Sync ♥ buttons on cards ──────────────────────────────
export function syncAllHeartButtons() {
  document.querySelectorAll('.btn-wishlist').forEach(btn => {
    const id     = Number(btn.dataset.id);
    const active = isInWishlist(id);
    btn.classList.toggle('btn-wishlist--active', active);
    const path = btn.querySelector('path');
    if (path) path.setAttribute('fill', active ? '#e63946' : 'none');
  });
}

// ══════════════════════════════════════════════════════════
//  WISHLIST DRAWER
// ══════════════════════════════════════════════════════════
function buildDrawer() {
  if (document.getElementById('wishlistDrawer')) return;
  document.body.insertAdjacentHTML('beforeend', `
  <div class="cart-overlay" id="wishlistOverlay"></div>
  <aside class="cart-drawer" id="wishlistDrawer" aria-label="Вибране">
    <div class="cart-drawer__header">
      <h2 class="cart-drawer__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        Вибране
        <span class="cart-drawer__count" id="wishlistDrawerCount">0</span>
      </h2>
      <button class="cart-drawer__close" id="wishlistClose" aria-label="Закрити">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="cart-drawer__body" id="wishlistBody"></div>
    <div class="cart-drawer__footer" id="wishlistFooter"></div>
  </aside>`);

  document.getElementById('wishlistClose').addEventListener('click', closeWishlistDrawer);
  document.getElementById('wishlistOverlay').addEventListener('click', closeWishlistDrawer);
}

export function openWishlistDrawer() {
  buildDrawer();
  renderWishlistItems();
  document.getElementById('wishlistDrawer').classList.add('cart-drawer--open');
  document.getElementById('wishlistOverlay').classList.add('cart-overlay--visible');
  document.body.style.overflow = 'hidden';
}

function closeWishlistDrawer() {
  document.getElementById('wishlistDrawer')?.classList.remove('cart-drawer--open');
  document.getElementById('wishlistOverlay')?.classList.remove('cart-overlay--visible');
  document.body.style.overflow = '';
}

function fmt(n) { return n.toLocaleString('uk-UA') + ' ₴'; }

function renderWishlistItems() {
  const body   = document.getElementById('wishlistBody');
  const footer = document.getElementById('wishlistFooter');
  const count  = document.getElementById('wishlistDrawerCount');
  if (!body) return;

  const items = getItems(); // ← завжди свіжі дані
  if (count) count.textContent = items.length;

  if (items.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.25">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <p>Список порожній</p>
        <span>Натисніть ♥ на товарі, щоб зберегти</span>
      </div>`;
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = items.map(p => `
    <div class="cart-item wishlist-item" data-id="${p.id}">
      <div class="cart-item__img">${p.svg}</div>
      <div class="cart-item__info">
        <p class="cart-item__brand">${p.brand}</p>
        <p class="cart-item__title">${p.title}</p>
        <span class="cart-item__price">${fmt(p.price)}</span>
      </div>
      <div class="cart-item__right">
        <button class="product-card__action-btn wishlist-to-cart" data-id="${p.id}" title="В кошик">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </button>
        <button class="cart-item__remove wishlist-remove" data-id="${p.id}" aria-label="Видалити">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>`).join('');

  footer.innerHTML = `
    <div class="cart-summary">
      <button class="btn btn--primary btn--full wishlist-all-to-cart">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        Додати все в кошик
      </button>
      <button class="btn btn--ghost btn--full wishlist-clear">Очистити список</button>
    </div>`;

  // Events
  body.querySelectorAll('.wishlist-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = Number(btn.dataset.id);
      const curr = getItems().filter(p => p.id !== id);
      setItems(curr);
      syncWishlistUI();
      syncAllHeartButtons();
      renderWishlistItems();
    });
  });

  body.querySelectorAll('.wishlist-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const p  = getItems().find(x => x.id === id);
      if (p) { addToCart(p); closeWishlistDrawer(); }
    });
  });

  footer.querySelector('.wishlist-all-to-cart')?.addEventListener('click', () => {
    getItems().forEach(p => addToCart(p));
    closeWishlistDrawer();
  });

  footer.querySelector('.wishlist-clear')?.addEventListener('click', () => {
    setItems([]);
    syncWishlistUI();
    syncAllHeartButtons();
    renderWishlistItems();
  });
}

// ── Init ─────────────────────────────────────────────────
export function initWishlist() {
  buildDrawer();
  syncWishlistUI();
  document.getElementById('wishlistBtn')?.addEventListener('click', openWishlistDrawer);
}