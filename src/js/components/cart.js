// ============================================================
//  cart.js — кошик: стан, збереження, UI, drawer
// ============================================================

const STORAGE_KEY = 'viknapro_cart';

// ── стан ──────────────────────────────────────────────────
let cartItems = loadCart();   // [{ product, qty }]

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
}

// ── API ───────────────────────────────────────────────────
export function addToCart(product) {
  const existing = cartItems.find(i => i.product.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({ product, qty: 1 });
  }
  saveCart();
  syncCartUI();
  showAddedFeedback(product.id);
  openDrawer();
}

export function removeFromCart(productId) {
  cartItems = cartItems.filter(i => i.product.id !== productId);
  saveCart();
  syncCartUI();
  renderDrawerItems();
}

export function changeQty(productId, delta) {
  const item = cartItems.find(i => i.product.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  syncCartUI();
  renderDrawerItems();
}

export function getCartCount() {
  return cartItems.reduce((s, i) => s + i.qty, 0);
}

export function getCartTotal() {
  return cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
}

// ── Форматування ──────────────────────────────────────────
function fmt(n) {
  return n.toLocaleString('uk-UA') + ' ₴';
}

// ── Синхронізація header-кнопки ──────────────────────────
export function syncCartUI() {
  const badge = document.getElementById('cartBadge');
  const total = document.getElementById('cartTotal');
  const count = getCartCount();

  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('action-btn__badge--visible', count > 0);
    // Пульс-анімація
    badge.classList.remove('badge-pop');
    void badge.offsetWidth; // reflow
    badge.classList.add('badge-pop');
  }
  if (total) {
    total.textContent = count > 0 ? fmt(getCartTotal()) : '0 ₴';
  }
}

// ── Feedback на кнопці "Купити" ───────────────────────────
function showAddedFeedback(productId) {
  const btn = document.querySelector(`.product-card__buy-btn[data-id="${productId}"]`);
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Додано!`;
  btn.classList.add('btn--added');
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.classList.remove('btn--added');
  }, 1800);
}

// ══════════════════════════════════════════════════════════
//  CART DRAWER
// ══════════════════════════════════════════════════════════
function buildDrawer() {
  if (document.getElementById('cartDrawer')) return;

  const html = `
  <div class="cart-overlay" id="cartOverlay"></div>
  <aside class="cart-drawer" id="cartDrawer" aria-label="Кошик">
    <div class="cart-drawer__header">
      <h2 class="cart-drawer__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        Кошик
        <span class="cart-drawer__count" id="drawerCount">0</span>
      </h2>
      <button class="cart-drawer__close" id="cartClose" aria-label="Закрити кошик">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="cart-drawer__body" id="drawerBody"></div>
    <div class="cart-drawer__footer" id="drawerFooter"></div>
  </aside>`;

  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('cartClose').addEventListener('click', closeDrawer);
  document.getElementById('cartOverlay').addEventListener('click', closeDrawer);
}

function openDrawer() {
  buildDrawer();
  renderDrawerItems();
  document.getElementById('cartDrawer').classList.add('cart-drawer--open');
  document.getElementById('cartOverlay').classList.add('cart-overlay--visible');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('cart-drawer--open');
  document.getElementById('cartOverlay')?.classList.remove('cart-overlay--visible');
  document.body.style.overflow = '';
}

function renderDrawerItems() {
  const body   = document.getElementById('drawerBody');
  const footer = document.getElementById('drawerFooter');
  const count  = document.getElementById('drawerCount');
  if (!body) return;

  const total = getCartTotal();
  const itemCount = getCartCount();
  if (count) count.textContent = itemCount;

  if (cartItems.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.25"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Кошик порожній</p>
        <span>Оберіть товар із каталогу</span>
      </div>`;
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = cartItems.map(({ product, qty }) => `
    <div class="cart-item" data-id="${product.id}">
      <div class="cart-item__img">${product.svg}</div>
      <div class="cart-item__info">
        <p class="cart-item__brand">${product.brand}</p>
        <p class="cart-item__title">${product.title}</p>
        <div class="cart-item__controls">
          <button class="qty-btn" data-action="dec" data-id="${product.id}">−</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${product.id}">+</button>
        </div>
      </div>
      <div class="cart-item__right">
        <span class="cart-item__price">${fmt(product.price * qty)}</span>
        <button class="cart-item__remove" data-id="${product.id}" aria-label="Видалити">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    </div>`).join('');

  footer.innerHTML = `
    <div class="cart-summary">
      <div class="cart-summary__row">
        <span>Товарів: ${itemCount} шт.</span>
        <span>Сума: <strong>${fmt(total)}</strong></span>
      </div>
      <button class="btn btn--primary btn--full cart-checkout-btn">
        Оформити замовлення
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <button class="btn btn--ghost btn--full" id="clearCartBtn">Очистити кошик</button>
    </div>`;

  // Events on drawer items
  body.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id    = Number(btn.dataset.id);
      const delta = btn.dataset.action === 'inc' ? 1 : -1;
      changeQty(id, delta);
    });
  });
  body.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
  });
  footer.querySelector('#clearCartBtn')?.addEventListener('click', () => {
    cartItems = [];
    saveCart();
    syncCartUI();
    renderDrawerItems();
  });
}

// ── Ініціалізація ─────────────────────────────────────────
export function initCart() {
  buildDrawer();
  syncCartUI();

  // Відкрити drawer кліком на кнопку кошика в header
  document.getElementById('cartBtn')?.addEventListener('click', openDrawer);
}