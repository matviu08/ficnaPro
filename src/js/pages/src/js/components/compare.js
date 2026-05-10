// ============================================================
//  compare.js — Порівняння товарів (до 4 шт.)
//  ВИПРАВЛЕНО: items більше не кешується в пам'яті —
//  кожна операція читає/пише напряму з localStorage
// ============================================================

const STORAGE_KEY = 'viknapro_compare';
const MAX = 4;

// ── Storage helpers ───────────────────────────────────────
function getItems() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function setItems(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// ── API ───────────────────────────────────────────────────
export function toggleCompare(product) {
  const items = getItems();
  const idx   = items.findIndex(p => p.id === product.id);
  if (idx >= 0) {
    items.splice(idx, 1);
    setItems(items);
    showToast(`«${product.brand}» видалено з порівняння`);
  } else {
    if (items.length >= MAX) {
      showToast(`Можна порівнювати до ${MAX} товарів`, 'warn');
      return;
    }
    items.push(product);
    setItems(items);
    showToast(`«${product.brand}» додано до порівняння`);
  }
  syncCompareUI();
  syncAllCompareButtons();
}

export function isInCompare(productId) {
  return getItems().some(p => p.id === productId);
}

// ── Header badge ─────────────────────────────────────────
export function syncCompareUI() {
  const badge = document.getElementById('compareBadge');
  if (!badge) return;
  const count = getItems().length;
  badge.textContent = count;
  badge.classList.toggle('action-btn__badge--visible', count > 0);
}

export function syncAllCompareButtons() {
  document.querySelectorAll('.btn-compare').forEach(btn => {
    btn.classList.toggle('btn-compare--active', isInCompare(Number(btn.dataset.id)));
  });
}

// ── Toast ─────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      ${type === 'warn'
        ? '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
        : '<polyline points="20 6 9 17 4 12"/>'}
    </svg>
    <span>${msg}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast--visible'));
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ══════════════════════════════════════════════════════════
//  COMPARE MODAL
// ══════════════════════════════════════════════════════════
const GLASS_LABEL = { double: 'Двокамерний', triple: 'Трикамерний', energy: 'Енергозберігаючий' };
const COLOR_LABEL = { white: 'Білий', oak: 'Дуб золотий', teak: 'Тік', walnut: 'Горіх', anthracite: 'Антрацит', black: 'Чорний' };

const SPECS = [
  { key: 'brand',           label: 'Виробник'                                                          },
  { key: 'price',           label: 'Ціна',           fmt: p => p.price.toLocaleString('uk-UA') + ' ₴' },
  { key: 'glass',           label: 'Тип скла',        fmt: p => GLASS_LABEL[p.glass] || p.glass        },
  { key: 'profileDepth',    label: 'Глибина профілю', fmt: p => p.profileDepth ? p.profileDepth + ' мм' : '—' },
  { key: 'profileChambers', label: 'Камери профілю',  fmt: p => p.profileChambers || '—'               },
  { key: 'color',           label: 'Колір профілю',   fmt: p => COLOR_LABEL[p.color] || p.color        },
  { key: 'guarantee',       label: 'Гарантія',        fmt: p => p.guarantee + ' р.'                    },
  { key: 'rating',          label: 'Рейтинг',         fmt: p => `⭐ ${p.rating.toFixed(1)} (${p.reviewCount} відг.)` },
];

function buildModal() {
  if (document.getElementById('compareModal')) return;
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal-overlay" id="compareOverlay"></div>
  <div class="compare-modal" id="compareModal" role="dialog" aria-label="Порівняння товарів">
    <div class="compare-modal__header">
      <h2 class="compare-modal__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        Порівняння товарів
      </h2>
      <button class="cart-drawer__close" id="compareClose" aria-label="Закрити">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="compare-modal__body" id="compareBody"></div>
  </div>`);

  document.getElementById('compareClose').addEventListener('click', closeCompareModal);
  document.getElementById('compareOverlay').addEventListener('click', closeCompareModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCompareModal(); });
}

export function openCompareModal() {
  const items = getItems();
  if (items.length === 0) {
    showToast('Додайте товари для порівняння', 'warn');
    return;
  }
  buildModal();
  renderCompareTable();
  document.getElementById('compareModal').classList.add('compare-modal--open');
  document.getElementById('compareOverlay').classList.add('modal-overlay--visible');
  document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
  document.getElementById('compareModal')?.classList.remove('compare-modal--open');
  document.getElementById('compareOverlay')?.classList.remove('modal-overlay--visible');
  document.body.style.overflow = '';
}

function renderCompareTable() {
  const body  = document.getElementById('compareBody');
  const items = getItems(); // ← завжди свіжі
  if (!body || items.length === 0) return;

  const prices   = items.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const headerCols = items.map(p => `
    <div class="compare-col" style="min-width:180px; flex:1">
      <div class="compare-product-img">${p.svg}</div>
      <p class="compare-product-brand">${p.brand}</p>
      <p class="compare-product-title">${p.title}</p>
      <button class="compare-remove-btn" data-id="${p.id}" title="Видалити">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>`).join('');

  const specRows = SPECS.map(spec => {
    const cells = items.map(p => {
      const val = spec.fmt ? spec.fmt(p) : (p[spec.key] || '—');
      let cls = '';
      if (spec.key === 'price') {
        if (p.price === minPrice)                      cls = 'compare-cell--best';
        if (p.price === maxPrice && items.length > 1)  cls = 'compare-cell--worst';
      }
      if (spec.key === 'rating') {
        const maxR = Math.max(...items.map(x => x.rating));
        if (p.rating === maxR) cls = 'compare-cell--best';
      }
      if (spec.key === 'guarantee') {
        const maxG = Math.max(...items.map(x => x.guarantee));
        if (p.guarantee === maxG) cls = 'compare-cell--best';
      }
      return `<td class="compare-cell ${cls}">${val}</td>`;
    }).join('');
    return `<tr><th class="compare-spec-label">${spec.label}</th>${cells}</tr>`;
  }).join('');

  const buyRow = items.map(p => `
    <td class="compare-cell compare-cell--action">
      <button class="btn btn--primary btn--sm compare-buy-btn" data-id="${p.id}">В кошик</button>
    </td>`).join('');

  body.innerHTML = `
    <div class="compare-header-row">
      <div class="compare-spec-label compare-label-cell">Характеристика</div>
      ${headerCols}
    </div>
    <div class="compare-table-wrap">
      <table class="compare-table">
        <tbody>
          ${specRows}
          <tr><th class="compare-spec-label">Дія</th>${buyRow}</tr>
        </tbody>
      </table>
    </div>`;

  // Events
  body.querySelectorAll('.compare-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = Number(btn.dataset.id);
      const curr = getItems().filter(p => p.id !== id);
      setItems(curr);
      syncCompareUI();
      syncAllCompareButtons();
      if (getItems().length === 0) closeCompareModal();
      else renderCompareTable();
    });
  });

  body.querySelectorAll('.compare-buy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      const p  = getItems().find(x => x.id === id);
      if (!p) return;
      const { addToCart } = await import('./cart.js');
      addToCart(p);
      closeCompareModal();
    });
  });
}

// ── Init ─────────────────────────────────────────────────
export function initCompare() {
  buildModal();
  syncCompareUI();
  document.getElementById('compareBtn')?.addEventListener('click', () => {
    if (getItems().length === 0) showToast('Додайте товари для порівняння', 'warn');
    else openCompareModal();
  });
}