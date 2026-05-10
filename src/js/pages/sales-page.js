// ============================================================
//  sales-page.js — сторінка «Акції та знижки»
// ============================================================
import { PRODUCTS } from '../data/products.js';
import { addToCart } from '../components/cart.js';

const SALES = [
  {
    id: 'summer',
    title: 'Літній розпродаж',
    subtitle: 'Металопластикові вікна REHAU та Salamander',
    discount: 20,
    color: '#1a56db',
    bg: 'linear-gradient(135deg, #1a56db 0%, #3b82f6 100%)',
    icon: '☀️',
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 днів
    productIds: [1, 3, 9, 18],
  },
  {
    id: 'balcony',
    title: 'Балконний сезон',
    subtitle: 'Балконні блоки та розсувні системи',
    discount: 15,
    color: '#f97316',
    bg: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    icon: '🏠',
    endsAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    productIds: [2, 10, 17],
  },
  {
    id: 'premium',
    title: 'Преміум-колекція',
    subtitle: 'Алюмінієві та дерев\'яні вікна',
    discount: 10,
    color: '#16a34a',
    bg: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
    icon: '🌿',
    endsAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    productIds: [7, 8, 12, 14],
  },
  {
    id: 'mansard',
    title: 'Мансардні вікна — хіт',
    subtitle: 'Velux та Fakro зі знижкою',
    discount: 12,
    color: '#7c3aed',
    bg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    icon: '🔺',
    endsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    productIds: [4, 13],
  },
];

function fmt(n) { return n.toLocaleString('uk-UA') + ' ₴'; }

function timeLeft(date) {
  const diff = date - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n) { return String(n).padStart(2, '0'); }

function countdownHtml(saleId, endsAt) {
  const t = timeLeft(endsAt);
  return `
    <div class="sale-countdown" id="countdown-${saleId}">
      <span class="countdown-label">Закінчується через:</span>
      <div class="countdown-units">
        <div class="countdown-unit"><span class="countdown-val" data-unit="d">${pad(t.d)}</span><span class="countdown-name">дн</span></div>
        <span class="countdown-sep">:</span>
        <div class="countdown-unit"><span class="countdown-val" data-unit="h">${pad(t.h)}</span><span class="countdown-name">год</span></div>
        <span class="countdown-sep">:</span>
        <div class="countdown-unit"><span class="countdown-val" data-unit="m">${pad(t.m)}</span><span class="countdown-name">хв</span></div>
        <span class="countdown-sep">:</span>
        <div class="countdown-unit"><span class="countdown-val" data-unit="s">${pad(t.s)}</span><span class="countdown-name">сек</span></div>
      </div>
    </div>`;
}

function saleProductCard(p, discount) {
  const discPrice = Math.round(p.price * (1 - discount / 100));
  return `
    <div class="sale-product-card" data-id="${p.id}">
      <div class="sale-product-img">${p.svg}</div>
      <div class="sale-product-info">
        <p class="sale-product-brand">${p.brand}</p>
        <p class="sale-product-title">${p.title}</p>
        <div class="sale-product-price">
          <span class="sale-price-new">${fmt(discPrice)}</span>
          <span class="sale-price-old">${fmt(p.price)}</span>
          <span class="sale-discount-badge">-${discount}%</span>
        </div>
      </div>
      <button class="btn btn--primary btn--sm sale-add-cart" data-id="${p.id}" data-disc-price="${discPrice}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        Купити
      </button>
    </div>`;
}

export const salesPage = {
  render() {
    return `
    <div class="page-content">
      <!-- Hero -->
      <div class="sales-hero">
        <div class="sales-hero__text">
          <span class="sales-hero__eyebrow">🔥 Гарячі пропозиції</span>
          <h1 class="sales-hero__title">Акції та знижки</h1>
          <p class="sales-hero__sub">Вибрані товари зі знижками до 25% — обмежений час</p>
        </div>
      </div>

      <!-- Акції -->
      ${SALES.map(sale => {
        const prods = PRODUCTS.filter(p => sale.productIds.includes(p.id));
        return `
        <section class="sale-section" id="sale-${sale.id}">
          <div class="sale-banner" style="background: ${sale.bg}">
            <div class="sale-banner__left">
              <span class="sale-banner__icon">${sale.icon}</span>
              <div>
                <h2 class="sale-banner__title">${sale.title}</h2>
                <p class="sale-banner__sub">${sale.subtitle}</p>
              </div>
              <span class="sale-banner__disc">−${sale.discount}%</span>
            </div>
            ${countdownHtml(sale.id, sale.endsAt)}
          </div>
          <div class="sale-products" id="sale-products-${sale.id}">
            ${prods.map(p => saleProductCard(p, sale.discount)).join('')}
          </div>
        </section>`;
      }).join('')}
    </div>`;
  },

  init() {
    // Buy buttons
    document.querySelectorAll('.sale-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id        = Number(btn.dataset.id);
        const discPrice = Number(btn.dataset.discPrice);
        const product   = PRODUCTS.find(p => p.id === id);
        if (product) addToCart({ ...product, price: discPrice });
      });
    });

    // Countdown timers
    SALES.forEach(sale => {
      const el = document.getElementById(`countdown-${sale.id}`);
      if (!el) return;
      const tick = () => {
        const t = timeLeft(sale.endsAt);
        el.querySelector('[data-unit="d"]').textContent = pad(t.d);
        el.querySelector('[data-unit="h"]').textContent = pad(t.h);
        el.querySelector('[data-unit="m"]').textContent = pad(t.m);
        el.querySelector('[data-unit="s"]').textContent = pad(t.s);
      };
      setInterval(tick, 1000);
    });
  },
};