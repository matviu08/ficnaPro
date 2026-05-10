// ============================================================
//  header.js — пошук (debounce), промо-банер
// ============================================================
import { setSearch } from './sidebar.js';

function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

export function initHeader() {
  // ── Пошук ────────────────────────────────────────────────
  const searchInput = document.getElementById('searchInput');
  const searchBtn   = document.querySelector('.search__btn');

  if (searchInput) {
    const doSearch = debounce((val) => setSearch(val.trim()), 350);
    searchInput.addEventListener('input', e => doSearch(e.target.value));
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        setSearch(e.target.value.trim());
      }
      if (e.key === 'Escape') {
        searchInput.value = '';
        setSearch('');
        searchInput.blur();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      setSearch(searchInput?.value.trim() || '');
    });
  }

  // ── Промо-банер ──────────────────────────────────────────
  const banner   = document.getElementById('promoBanner');
  const closeBtn = document.getElementById('closeBanner');

  if (banner && closeBtn) {
    // Якщо вже закривали — не показувати
    if (sessionStorage.getItem('promo_closed')) {
      banner.style.display = 'none';
    }
    closeBtn.addEventListener('click', () => {
      banner.style.maxHeight = banner.scrollHeight + 'px';
      requestAnimationFrame(() => {
        banner.style.transition = 'max-height 0.35s ease, opacity 0.3s ease, margin 0.35s ease';
        banner.style.maxHeight  = '0';
        banner.style.opacity    = '0';
        banner.style.marginBottom = '0';
      });
      setTimeout(() => banner.remove(), 400);
      sessionStorage.setItem('promo_closed', '1');
    });
  }
}