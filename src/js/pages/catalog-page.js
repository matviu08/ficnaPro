// ============================================================
//  catalog-page.js — обгортка каталогу для роутера
// ============================================================
import { PRODUCTS }   from '../data/products.js';
import { renderProducts, initViewToggle } from '../components/catalog.js';
import { initSidebar, initSort }          from '../components/sidebar.js';

export const catalogPage = {
  render() {
    // Повертаємо тільки toolbar + grid + pagination
    // Sidebar залишається у DOM завжди (його лише show/hide роутер)
    return `
      <div class="catalog-toolbar">
        <div class="catalog-toolbar__left">
          <h1 class="catalog-title">Каталог вікон</h1>
          <span class="catalog-count" id="catalogCount">${PRODUCTS.length} товарів</span>
        </div>
        <div class="catalog-toolbar__right">
          <div class="active-filters" id="activeFilters"></div>
          <div class="sort-wrap">
            <label class="sort-label" for="sortSelect">Сортувати:</label>
            <select class="sort-select" id="sortSelect">
              <option value="popular">За популярністю</option>
              <option value="price-asc">Ціна: від дешевих</option>
              <option value="price-desc">Ціна: від дорогих</option>
              <option value="rating">За рейтингом</option>
              <option value="new">Новинки</option>
            </select>
          </div>
          <div class="view-toggle">
            <button class="view-toggle__btn view-toggle__btn--active" id="gridView" aria-label="Сітка">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="0" width="6" height="6" rx="1"/><rect x="10" y="0" width="6" height="6" rx="1"/><rect x="0" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/></svg>
            </button>
            <button class="view-toggle__btn" id="listView" aria-label="Список">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="0" width="16" height="3" rx="1"/><rect x="0" y="6.5" width="16" height="3" rx="1"/><rect x="0" y="13" width="16" height="3" rx="1"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="promo-banner" id="promoBanner">
        <div class="promo-banner__content">
          <span class="promo-banner__badge">🔥 Акція</span>
          <p class="promo-banner__text">Знижки до <strong>-25%</strong> на всі металопластикові вікна REHAU до кінця місяця!</p>
        </div>
        <button class="promo-banner__close" id="closeBanner" aria-label="Закрити банер">×</button>
      </div>

      <div class="products-grid" id="productsGrid"></div>

      <nav class="pagination" aria-label="Сторінки каталогу"></nav>`;
  },

  init() {
    // Переініціалізуємо компоненти, що залежать від DOM
    initSort();
    initViewToggle();
    renderProducts(PRODUCTS, 1);

    // Промо-банер
    const banner   = document.getElementById('promoBanner');
    const closeBtn = document.getElementById('closeBanner');
    if (banner && closeBtn) {
      if (sessionStorage.getItem('promo_closed')) banner.style.display = 'none';
      closeBtn.addEventListener('click', () => {
        banner.style.transition = 'max-height .3s ease, opacity .3s ease';
        banner.style.maxHeight  = banner.scrollHeight + 'px';
        requestAnimationFrame(() => { banner.style.maxHeight = '0'; banner.style.opacity = '0'; });
        setTimeout(() => banner.remove(), 350);
        sessionStorage.setItem('promo_closed', '1');
      });
    }
  },
};