// ============================================================
//  sidebar.js — фільтри: категорії, ціна, бренд, скло, колір
// ============================================================
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { renderProducts }        from './catalog.js';

// ── Стан фільтрів ─────────────────────────────────────────
const state = {
  category : 'all',
  priceMin : 0,
  priceMax : Infinity,
  brands   : [],      // порожній = всі
  glass    : [],
  colors   : [],
  sort     : 'popular',
  search   : '',
};

// ── Фільтрація ────────────────────────────────────────────
export function applyFilters(silent = false) {
  let result = PRODUCTS.filter(p => {
    if (state.category !== 'all' && p.category !== state.category) return false;
    if (p.price < state.priceMin || p.price > state.priceMax)       return false;
    if (state.brands.length && !state.brands.includes(p.brand.toLowerCase())) return false;
    if (state.glass.length  && !state.glass.includes(p.glass))      return false;
    if (state.colors.length && !state.colors.includes(p.color))     return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Сортування
  switch (state.sort) {
    case 'price-asc':  result.sort((a, b) => a.price - b.price);      break;
    case 'price-desc': result.sort((a, b) => b.price - a.price);      break;
    case 'rating':     result.sort((a, b) => b.rating - a.rating);    break;
    case 'new':        result.sort((a, b) => b.id - a.id);            break;
    default:           result.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  if (!silent) {
    renderProducts(result, 1, state.search);
    renderActiveTags();
  }
  return result;
}

// ── Active-теги фільтрів ──────────────────────────────────
function renderActiveTags() {
  const wrap = document.getElementById('activeFilters');
  if (!wrap) return;

  const tags = [];

  if (state.category !== 'all') {
    const cat = CATEGORIES.find(c => c.id === state.category);
    if (cat) tags.push({ label: cat.label, clear: () => { state.category = 'all'; refreshCategoryUI(); } });
  }
  state.brands.forEach(b => {
    tags.push({ label: b.toUpperCase(), clear: () => { state.brands = state.brands.filter(x => x !== b); syncBrandUI(b); } });
  });
  state.glass.forEach(g => {
    const labels = { double:'Двокамерний', triple:'Трикамерний', energy:'Енергозберігаючий' };
    tags.push({ label: labels[g] || g, clear: () => { state.glass = state.glass.filter(x => x !== g); syncGlassUI(g); } });
  });
  state.colors.forEach(c => {
    const labels = { white:'Білий', oak:'Дуб', teak:'Тік', walnut:'Горіх', anthracite:'Антрацит', black:'Чорний' };
    tags.push({ label: labels[c] || c, clear: () => { state.colors = state.colors.filter(x => x !== c); syncColorUI(c); } });
  });
  if (state.priceMin > 0 || state.priceMax < Infinity) {
    const maxLabel = state.priceMax === Infinity ? '∞' : state.priceMax.toLocaleString('uk-UA');
    tags.push({
      label: `${state.priceMin.toLocaleString('uk-UA')} — ${maxLabel} ₴`,
      clear: () => { state.priceMin = 0; state.priceMax = Infinity; resetPriceUI(); }
    });
  }

  wrap.innerHTML = tags.map(t => `
    <span class="active-filter-tag" data-tag>
      ${t.label}
      <button class="active-filter-tag__remove" aria-label="Видалити">×</button>
    </span>`).join('');

  wrap.querySelectorAll('[data-tag]').forEach((el, i) => {
    el.querySelector('button').addEventListener('click', () => {
      tags[i].clear();
      applyFilters();
    });
  });
}

// ── Категорії ─────────────────────────────────────────────
function initCategories() {
  const list = document.getElementById('categoryList');
  if (!list) return;

  list.querySelectorAll('.category-item__link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const item = link.closest('.category-item');
      // Знайти категорію за текстом
      const label = link.textContent.trim().replace(/\d+/, '').trim();
      const cat   = CATEGORIES.find(c => c.label === label) || { id: 'all' };
      state.category = cat.id;
      refreshCategoryUI();
      applyFilters();
    });
  });
}

function refreshCategoryUI() {
  document.querySelectorAll('.category-item').forEach(item => {
    const link  = item.querySelector('.category-item__link');
    const label = link.textContent.trim().replace(/\d+/, '').trim();
    const cat   = CATEGORIES.find(c => c.label === label) || { id: 'all' };
    item.classList.toggle('category-item--active', cat.id === state.category);
  });
}

// ── Ціновий діапазон ─────────────────────────────────────
function initPriceRange() {
  const minEl = document.getElementById('priceMin');
  const maxEl = document.getElementById('priceMax');
  if (!minEl || !maxEl) return;

  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const update   = debounce(() => {
    state.priceMin = Number(minEl.value) || 0;
    state.priceMax = Number(maxEl.value) || Infinity;
    updateRangeFill();
    applyFilters();
  }, 500);

  minEl.addEventListener('input', update);
  maxEl.addEventListener('input', update);
}

function updateRangeFill() {
  const fill   = document.getElementById('rangeFill');
  const minEl  = document.getElementById('priceMin');
  const maxEl  = document.getElementById('priceMax');
  if (!fill || !minEl || !maxEl) return;

  const prices = PRODUCTS.map(p => p.price);
  const absMin = Math.min(...prices);
  const absMax = Math.max(...prices);
  const curMin = Number(minEl.value) || absMin;
  const curMax = Number(maxEl.value) || absMax;
  const left   = ((curMin - absMin) / (absMax - absMin)) * 100;
  const width  = ((curMax - curMin) / (absMax - absMin)) * 100;
  fill.style.left  = Math.max(0, left)  + '%';
  fill.style.width = Math.max(0, width) + '%';
}

function resetPriceUI() {
  const minEl = document.getElementById('priceMin');
  const maxEl = document.getElementById('priceMax');
  if (minEl) minEl.value = 0;
  if (maxEl) maxEl.value = '';
  state.priceMin = 0;
  state.priceMax = Infinity;
  updateRangeFill();
}

// ── Бренди ────────────────────────────────────────────────
function initBrands() {
  document.querySelectorAll('#brandFilter .checkbox-input').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!state.brands.includes(cb.value)) state.brands.push(cb.value);
      } else {
        state.brands = state.brands.filter(b => b !== cb.value);
      }
      applyFilters();
    });
  });
}

function syncBrandUI(brand) {
  const cb = document.querySelector(`#brandFilter .checkbox-input[value="${brand}"]`);
  if (cb) cb.checked = false;
}

// ── Тип скла ─────────────────────────────────────────────
function initGlass() {
  document.querySelectorAll('#glassFilter .checkbox-input').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!state.glass.includes(cb.value)) state.glass.push(cb.value);
      } else {
        state.glass = state.glass.filter(g => g !== cb.value);
      }
      applyFilters();
    });
  });
}

function syncGlassUI(glass) {
  const cb = document.querySelector(`#glassFilter .checkbox-input[value="${glass}"]`);
  if (cb) cb.checked = false;
}

// ── Колір ────────────────────────────────────────────────
function initColors() {
  document.querySelectorAll('#colorFilter .color-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      const isActive = btn.classList.contains('color-swatch--active');
      if (isActive) {
        state.colors = state.colors.filter(c => c !== color);
        btn.classList.remove('color-swatch--active');
      } else {
        if (!state.colors.includes(color)) state.colors.push(color);
        btn.classList.add('color-swatch--active');
      }
      applyFilters();
    });
  });
}

function syncColorUI(color) {
  const btn = document.querySelector(`#colorFilter .color-swatch[data-color="${color}"]`);
  if (btn) btn.classList.remove('color-swatch--active');
}

// ── Сортування ────────────────────────────────────────────
export function initSort() {
  const sel = document.getElementById('sortSelect');
  if (!sel) return;
  sel.addEventListener('change', () => {
    state.sort = sel.value;
    applyFilters();
  });
}

// ── Скинути всі фільтри ───────────────────────────────────
function resetAll() {
  state.category = 'all';
  state.brands   = [];
  state.glass    = [];
  state.colors   = [];
  state.priceMin = 0;
  state.priceMax = Infinity;
  state.search   = '';

  // UI reset
  document.querySelectorAll('.checkbox-input').forEach(cb => cb.checked = false);
  document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('color-swatch--active'));
  resetPriceUI();
  refreshCategoryUI();
  const searchEl = document.getElementById('searchInput');
  if (searchEl) searchEl.value = '';

  applyFilters();
}

// ── Пошук ────────────────────────────────────────────────
export function setSearch(query) {
  state.search = query;
  applyFilters();
}

// ── Ініціалізація ─────────────────────────────────────────
export function initSidebar() {
  initCategories();
  initPriceRange();
  initBrands();
  initGlass();
  initColors();
  updateRangeFill();

  document.getElementById('applyFilters')?.addEventListener('click',  () => applyFilters());
  document.getElementById('resetFilters')?.addEventListener('click', resetAll);
}