// ============================================================
//  calculator-page.js — Калькулятор вартості вікна
//  ВИПРАВЛЕНО:
//  1. events вішаються ОДИН РАЗ через прапор _eventsAttached
//  2. radio change → тільки оновлює active-клас без DOM rebuild
//  3. extras — НЕ викликає updateSummary через event bubbling
//  4. addToCart — додає ОДИН запис з qty, не в циклі
// ============================================================
import {
  PROFILES, GLASS_TYPES, OPENING_TYPES, SASH_CONFIGS,
  COLORS, EXTRAS, OBJECT_TYPES,
  getQtyDiscount, MIN_AREA_M2, MIN_PRICE,
} from '../data/calculator-data.js';
import { addToCart } from '../components/cart.js';

// ── Стан ──────────────────────────────────────────────────
const DEFAULT_STATE = () => ({
  step:       1,
  totalSteps: 6,
  width:      1200,
  height:     1400,
  qty:        1,
  objectType: 'apartment',
  profileId:  'rehau-delight',
  glassId:    'single-2k',
  openingId:  'tilt',
  sashId:     '1s-open',
  colorId:    'white',
  extras:     {},
});

let state = DEFAULT_STATE();
// Прапор: події вішаємо лише ОДИН РАЗ на весь час роботи сторінки
let _eventsAttached = false;

// ── Розрахунок ────────────────────────────────────────────
function calculate() {
  const profile = PROFILES.find(p => p.id === state.profileId);
  const glass   = GLASS_TYPES.find(g => g.id === state.glassId);
  const opening = OPENING_TYPES.find(o => o.id === state.openingId);
  const sash    = SASH_CONFIGS.find(s => s.id === state.sashId);
  const color   = COLORS.find(c => c.id === state.colorId);
  const objType = OBJECT_TYPES.find(o => o.id === state.objectType);

  const areaM2 = Math.max(state.width * state.height / 1_000_000, MIN_AREA_M2);

  const profileCost = profile.basePrice * areaM2;
  const glassCost   = glass.pricePerM2  * areaM2;
  const unitPrice   = Math.max(
    (profileCost + glassCost) * opening.coeff * sash.coeff * color.coeff * objType.coeff,
    MIN_PRICE
  );

  let extrasTotal = 0;
  const extrasBreakdown = [];
  for (const [id, qty] of Object.entries(state.extras)) {
    if (!qty || qty <= 0) continue;
    const ex = EXTRAS.find(e => e.id === id);
    if (!ex) continue;
    const sum = ex.price * qty;
    extrasTotal += sum;
    extrasBreakdown.push({ name: ex.name, qty, price: ex.price, sum });
  }

  const subtotalPerUnit = unitPrice + extrasTotal;
  const subtotal        = subtotalPerUnit * state.qty;
  const discount        = getQtyDiscount(state.qty);
  const discountAmount  = subtotal * discount;
  const total           = subtotal - discountAmount;

  return {
    profile, glass, opening, sash, color,
    areaM2:          +areaM2.toFixed(3),
    profileCost:     Math.round(profileCost),
    glassCost:       Math.round(glassCost),
    unitPrice:       Math.round(unitPrice),
    extrasTotal:     Math.round(extrasTotal),
    extrasBreakdown,
    subtotalPerUnit: Math.round(subtotalPerUnit),
    subtotal:        Math.round(subtotal),
    discount,
    discountAmount:  Math.round(discountAmount),
    total:           Math.round(total),
  };
}

const fmt = n => n.toLocaleString('uk-UA') + ' ₴';

// ══════════════════════════════════════════════════════════
//  EXPORT
// ══════════════════════════════════════════════════════════
export const calculatorPage = {
  render() {
    return `<div class="page-content calc-page" id="calcPage">
      ${renderHero()}
      <div class="calc-layout">
        <div class="calc-main" id="calcMain">
          ${renderProgressBar()}
          <div class="calc-step-wrap" id="calcStepWrap">
            ${renderCurrentStep()}
          </div>
          ${renderStepNav()}
        </div>
        <aside class="calc-sidebar" id="calcSidebar">
          ${renderSummaryCard()}
        </aside>
      </div>
    </div>`;
  },

  init() {
    state = DEFAULT_STATE();
    _eventsAttached = false; // скидаємо при кожному заході на сторінку
    attachCalcEvents();
  },
};

// ══════════════════════════════════════════════════════════
//  RENDER HELPERS
// ══════════════════════════════════════════════════════════
function renderHero() {
  return `
  <div class="calc-hero">
    <div class="calc-hero__text">
      <span class="calc-hero__eyebrow">🧮 Онлайн-інструмент</span>
      <h1 class="calc-hero__title">Калькулятор вікон</h1>
      <p class="calc-hero__sub">Розрахуйте вартість вікна за 6 кроків — без дзвінків та менеджерів</p>
    </div>
    <div class="calc-hero__badges">
      <span class="calc-badge">✓ Безкоштовний розрахунок</span>
      <span class="calc-badge">✓ Реальні ціни</span>
      <span class="calc-badge">✓ Замір і монтаж</span>
    </div>
  </div>`;
}

function renderProgressBar() {
  const steps = [
    { n:1, label:'Розмір' }, { n:2, label:'Профіль' }, { n:3, label:'Скло' },
    { n:4, label:'Тип' },    { n:5, label:'Колір' },   { n:6, label:'Опції' },
  ];
  return `
  <div class="calc-progress" id="calcProgress">
    ${steps.map(s => `
      <div class="calc-progress__step ${s.n < state.step ? 'done' : ''} ${s.n === state.step ? 'active' : ''}">
        <div class="calc-progress__dot">
          ${s.n < state.step
            ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
            : s.n}
        </div>
        <span class="calc-progress__label">${s.label}</span>
      </div>
      ${s.n < 6 ? `<div class="calc-progress__line${s.n < state.step ? ' done' : ''}"></div>` : ''}`
    ).join('')}
  </div>`;
}

function renderStepNav() {
  return `
  <div class="calc-nav" id="calcNav">
    <button class="btn btn--ghost" id="calcPrev" ${state.step === 1 ? 'disabled' : ''}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Назад
    </button>
    <div class="calc-nav-steps">${state.step} / ${state.totalSteps}</div>
    ${state.step < state.totalSteps
      ? `<button class="btn btn--primary" id="calcNext">
           Далі
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
         </button>`
      : `<button class="btn btn--primary" id="calcFinish">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
           Переглянути результат
         </button>`}
  </div>`;
}

function renderCurrentStep() {
  switch (state.step) {
    case 1: return renderStep1();
    case 2: return renderStep2();
    case 3: return renderStep3();
    case 4: return renderStep4();
    case 5: return renderStep5();
    case 6: return renderStep6();
    default: return '';
  }
}

// ── Крок 1 ────────────────────────────────────────────────
function renderStep1() {
  const areaM2 = (state.width * state.height / 1_000_000).toFixed(3);
  return `
  <div class="calc-step">
    <h2 class="calc-step__title"><span class="calc-step__num">1</span>Розмір та кількість</h2>

    <div class="calc-field">
      <label class="calc-label">Тип об'єкта</label>
      <div class="calc-radio-group">
        ${OBJECT_TYPES.map(o => `
          <label class="calc-radio-card${state.objectType === o.id ? ' active' : ''}">
            <input type="radio" name="objectType" value="${o.id}" ${state.objectType === o.id ? 'checked' : ''}/>
            <span>${o.name}</span>
          </label>`).join('')}
      </div>
    </div>

    <div class="calc-field">
      <label class="calc-label">Розмір вікна (мм)</label>
      <div class="calc-size-row">
        <div class="calc-input-group">
          <label class="calc-input-label">Ширина</label>
          <div class="calc-input-wrap">
            <button class="calc-spin-btn" data-spin="width" data-dir="-1">−</button>
            <input type="number" id="calcWidth" class="calc-input" value="${state.width}" min="400" max="3000" step="50"/>
            <button class="calc-spin-btn" data-spin="width" data-dir="1">+</button>
          </div>
          <span class="calc-input-hint">400 – 3000 мм</span>
        </div>
        <div class="calc-size-cross">×</div>
        <div class="calc-input-group">
          <label class="calc-input-label">Висота</label>
          <div class="calc-input-wrap">
            <button class="calc-spin-btn" data-spin="height" data-dir="-1">−</button>
            <input type="number" id="calcHeight" class="calc-input" value="${state.height}" min="400" max="3000" step="50"/>
            <button class="calc-spin-btn" data-spin="height" data-dir="1">+</button>
          </div>
          <span class="calc-input-hint">400 – 3000 мм</span>
        </div>
        <div class="calc-window-preview" id="calcPreview">${renderWindowSVG()}</div>
      </div>
      <div class="calc-area-badge">Площа: <strong id="calcAreaBadge">${areaM2} м²</strong></div>
    </div>

    <div class="calc-field">
      <label class="calc-label">Популярні розміри</label>
      <div class="calc-presets">
        ${[{w:600,h:900,l:'600×900'},{w:800,h:1200,l:'800×1200'},{w:1200,h:1400,l:'1200×1400'},
           {w:1400,h:1400,l:'1400×1400'},{w:1800,h:1400,l:'1800×1400'},{w:2400,h:2200,l:'2400×2200 (балкон)'}]
          .map(p => `<button class="calc-preset-btn${state.width===p.w&&state.height===p.h?' active':''}" data-preset-w="${p.w}" data-preset-h="${p.h}">${p.l}</button>`)
          .join('')}
      </div>
    </div>

    <div class="calc-field">
      <label class="calc-label">Кількість вікон</label>
      <div class="calc-qty-row">
        <div class="calc-input-wrap" style="width:160px">
          <button class="calc-spin-btn" data-spin="qty" data-dir="-1">−</button>
          <input type="number" id="calcQty" class="calc-input" value="${state.qty}" min="1" max="200" step="1"/>
          <button class="calc-spin-btn" data-spin="qty" data-dir="1">+</button>
        </div>
        ${state.qty >= 3 ? `<span class="calc-discount-hint">🎉 Знижка ${(getQtyDiscount(state.qty)*100).toFixed(0)}%</span>` : ''}
      </div>
    </div>
  </div>`;
}

// ── Крок 2 ────────────────────────────────────────────────
function renderStep2() {
  return `
  <div class="calc-step">
    <h2 class="calc-step__title"><span class="calc-step__num">2</span>Профільна система</h2>
    <p class="calc-step__hint">Матеріал і якість рами безпосередньо впливають на тепло та довговічність</p>
    <div class="calc-cards-grid">
      ${PROFILES.map(p => `
        <label class="calc-card${state.profileId === p.id ? ' active' : ''}">
          <input type="radio" name="profile" value="${p.id}" ${state.profileId === p.id ? 'checked' : ''}/>
          <div class="calc-card__head">
            <div>
              <p class="calc-card__brand">${p.brand}</p>
              <p class="calc-card__name">${p.name}</p>
            </div>
            ${p.badge ? `<span class="calc-card__badge" style="background:${p.badgeColor}">${p.badge}</span>` : ''}
          </div>
          <p class="calc-card__desc">${p.description}</p>
          <div class="calc-card__specs"><span>⬛ ${p.depth} мм</span><span>◻ ${p.chambers} камер</span></div>
          <div class="calc-card__price">від ${fmt(Math.round(p.basePrice * Math.max(state.width * state.height / 1_000_000, MIN_AREA_M2)))}</div>
        </label>`).join('')}
    </div>
  </div>`;
}

// ── Крок 3 ────────────────────────────────────────────────
function renderStep3() {
  const areaM2 = Math.max(state.width * state.height / 1_000_000, MIN_AREA_M2);
  return `
  <div class="calc-step">
    <h2 class="calc-step__title"><span class="calc-step__num">3</span>Тип склопакету</h2>
    <p class="calc-step__hint">Від типу скла залежить тепло-, шумо- та сонцезахист</p>
    <div class="calc-glass-list">
      ${GLASS_TYPES.map(g => `
        <label class="calc-glass-card${state.glassId === g.id ? ' active' : ''}">
          <input type="radio" name="glass" value="${g.id}" ${state.glassId === g.id ? 'checked' : ''}/>
          <div class="calc-glass-card__icon">
            <div class="glass-icon-layers">
              <div class="glass-layer"></div><div class="glass-air"></div>
              <div class="glass-layer"></div><div class="glass-air"></div>
              <div class="glass-layer"></div>
            </div>
          </div>
          <div class="calc-glass-card__info">
            <div class="calc-glass-card__head">
              <p class="calc-glass-card__name">${g.name}${g.popular ? ' <span class="glass-popular">✓ Рекомендовано</span>' : ''}</p>
              <p class="calc-glass-card__price">+${fmt(Math.round(g.pricePerM2 * areaM2))}</p>
            </div>
            <p class="calc-glass-card__desc">${g.description}</p>
            <div class="calc-glass-card__props">
              <span>🌡 ${g.thermalRes}</span>
              <span>🔊 ${g.soundDb} дБ</span>
            </div>
          </div>
        </label>`).join('')}
    </div>
  </div>`;
}

// ── Крок 4 ────────────────────────────────────────────────
function renderStep4() {
  return `
  <div class="calc-step">
    <h2 class="calc-step__title"><span class="calc-step__num">4</span>Тип відкривання і стулки</h2>
    <div class="calc-field">
      <label class="calc-label">Спосіб відкривання</label>
      <div class="calc-opening-grid">
        ${OPENING_TYPES.map(o => `
          <label class="calc-opening-card${state.openingId === o.id ? ' active' : ''}">
            <input type="radio" name="opening" value="${o.id}" ${state.openingId === o.id ? 'checked' : ''}/>
            <span class="calc-opening-icon">${o.icon}</span>
            <span class="calc-opening-name">${o.name}</span>
            <span class="calc-opening-coeff">${o.coeff > 1 ? '+' : ''}${((o.coeff-1)*100).toFixed(0)}%</span>
            <span class="calc-opening-desc">${o.desc}</span>
          </label>`).join('')}
      </div>
    </div>
    <div class="calc-field">
      <label class="calc-label">Конфігурація стулок</label>
      <div class="calc-sash-grid">
        ${SASH_CONFIGS.map(s => `
          <label class="calc-sash-card${state.sashId === s.id ? ' active' : ''}">
            <input type="radio" name="sash" value="${s.id}" ${state.sashId === s.id ? 'checked' : ''}/>
            <span class="calc-sash-preview">${s.preview}</span>
            <span class="calc-sash-name">${s.name}</span>
          </label>`).join('')}
      </div>
    </div>
  </div>`;
}

// ── Крок 5 ────────────────────────────────────────────────
function renderStep5() {
  return `
  <div class="calc-step">
    <h2 class="calc-step__title"><span class="calc-step__num">5</span>Колір профілю</h2>
    <p class="calc-step__hint">Нестандартні кольори збільшують вартість через ламінацію</p>
    <div class="calc-color-grid">
      ${COLORS.map(c => `
        <label class="calc-color-item${state.colorId === c.id ? ' active' : ''}">
          <input type="radio" name="color" value="${c.id}" ${state.colorId === c.id ? 'checked' : ''}/>
          <div class="calc-color-swatch" style="background:${c.hex};${c.id==='white'?'border:2px solid #e4e8f0;':''}"></div>
          <span class="calc-color-name">${c.name}</span>
          <span class="calc-color-coeff">${c.coeff===1 ? 'Базова' : '+'+((c.coeff-1)*100).toFixed(0)+'%'}</span>
        </label>`).join('')}
    </div>
  </div>`;
}

// ── Крок 6 ────────────────────────────────────────────────
function renderStep6() {
  return `
  <div class="calc-step">
    <h2 class="calc-step__title"><span class="calc-step__num">6</span>Додаткові опції</h2>
    <p class="calc-step__hint">Виберіть послуги та аксесуари. Ціна вказана за одиницю.</p>
    <div class="calc-extras-grid">
      ${EXTRAS.map(ex => {
        const qty = state.extras[ex.id] || 0;
        return `
        <div class="calc-extra-card${qty > 0 ? ' active' : ''}" id="extraCard-${ex.id}">
          <div class="calc-extra-card__top">
            <span class="calc-extra-icon">${ex.icon}</span>
            <div>
              <p class="calc-extra-name">${ex.name}</p>
              <p class="calc-extra-price">${fmt(ex.price)} / ${ex.unit}</p>
            </div>
          </div>
          <div class="calc-extra-controls">
            <button class="calc-extra-btn" data-extra-id="${ex.id}" data-extra-dir="-1">−</button>
            <span class="calc-extra-qty" id="extraQty-${ex.id}">${qty}</span>
            <button class="calc-extra-btn" data-extra-id="${ex.id}" data-extra-dir="1">+</button>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

// ── Summary ────────────────────────────────────────────────
function renderSummaryCard() {
  const calc = calculate();
  const disc = calc.discount * 100;
  const adjustments = calc.unitPrice - calc.profileCost - calc.glassCost;

  return `
  <div class="calc-summary" id="calcSummary">
    <h3 class="calc-summary__title">Ваше замовлення</h3>
    <div class="calc-summary__preview" id="summaryPreview">${renderWindowSVG()}</div>
    <div class="calc-summary__dim">${state.width} × ${state.height} мм · ${calc.areaM2} м²</div>

    <ul class="calc-summary__list">
      <li><span>Профіль ${calc.profile?.name}</span><span>${fmt(calc.profileCost)}</span></li>
      <li><span>Скло (${calc.glass?.name.split(' ')[0]})</span><span>${fmt(calc.glassCost)}</span></li>
      ${adjustments > 0 ? `<li><span>Тип / стулки / колір</span><span>${fmt(adjustments)}</span></li>` : ''}
      ${calc.extrasBreakdown.map(e =>
        `<li class="extra-line"><span>${e.name} × ${e.qty}</span><span>${fmt(e.sum)}</span></li>`
      ).join('')}
    </ul>

    <div class="calc-summary__divider"></div>
    <div class="calc-summary__row"><span>1 вікно</span><strong>${fmt(calc.subtotalPerUnit)}</strong></div>
    ${state.qty > 1 ? `<div class="calc-summary__row"><span>${state.qty} шт.</span><strong>${fmt(calc.subtotal)}</strong></div>` : ''}
    ${disc > 0 ? `<div class="calc-summary__row calc-summary__row--discount"><span>Знижка ${disc.toFixed(0)}%</span><strong>−${fmt(calc.discountAmount)}</strong></div>` : ''}
    <div class="calc-summary__divider"></div>

    <div class="calc-summary__total">
      <span>РАЗОМ</span>
      <span class="calc-summary__total-price">${fmt(calc.total)}</span>
    </div>

    ${state.step === 6 ? `
    <button class="btn btn--primary btn--full" id="summaryAddToCart" style="margin-top:8px">
      В кошик (${state.qty} шт.)
    </button>
    <button class="btn btn--ghost btn--full" id="summaryOrder" style="margin-top:6px">
      Замовити консультацію
    </button>` : `
    <p class="calc-summary__hint">Пройдіть всі кроки для оформлення замовлення</p>`}
  </div>`;
}

// ── Window SVG preview ────────────────────────────────────
function renderWindowSVG() {
  const sash  = SASH_CONFIGS.find(s => s.id === state.sashId);
  const color = COLORS.find(c => c.id === state.colorId);
  const maxW = 110, maxH = 110;
  const scale = Math.min(maxW / state.width, maxH / state.height);
  const svgW  = Math.round(state.width * scale);
  const svgH  = Math.round(state.height * scale);
  const frameColor = color?.id === 'white' ? '#c8d4e8'
    : (color?.id === 'anthracite' || color?.id === 'black') ? '#555' : '#c4a882';
  const bgColor = (color?.id === 'anthracite' || color?.id === 'black') ? '#2a2a2a' : '#eef2f9';

  const sections = sash?.id === 'balcony' ? [0.35, 0.65]
    : sash?.id?.startsWith('3s') ? [1/3, 1/3, 1/3]
    : sash?.id?.startsWith('2s') ? [0.5, 0.5]
    : [1];

  const pad = 6;
  const innerW = svgW - pad * 2;
  const innerH = svgH - pad * 2;
  let sectionsHTML = '';
  let x = pad;

  sections.forEach((frac, i) => {
    const sw = Math.round(innerW * frac);
    sectionsHTML += `<rect x="${x+1}" y="${pad+1}" width="${sw-2}" height="${innerH-2}" fill="#d4e8f8" opacity="0.6"/>`;
    sectionsHTML += `<rect x="${x}" y="${pad}" width="${sw}" height="${innerH}" fill="none" stroke="${frameColor}" stroke-width="2"/>`;
    if (i === 0 && sash?.sashes > 0) {
      sectionsHTML += `<circle cx="${x+sw-8}" cy="${pad+innerH/2}" r="3" fill="${frameColor}" opacity="0.8"/>`;
    }
    x += sw;
  });

  const total = svgW + pad * 2;
  const totalH = svgH + pad * 2;
  return `<svg width="${total}" height="${totalH}" viewBox="0 0 ${total} ${totalH}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${total}" height="${totalH}" rx="4" fill="${bgColor}" stroke="${frameColor}" stroke-width="3"/>
    ${sectionsHTML}
  </svg>`;
}

// ══════════════════════════════════════════════════════════
//  EVENTS — вішаємо ТІЛЬКИ РАЗ через _eventsAttached
// ══════════════════════════════════════════════════════════
function attachCalcEvents() {
  if (_eventsAttached) return;
  _eventsAttached = true;

  // Використовуємо document-level делегування щоб не втрачати
  // listeners після innerHTML-оновлень
  document.addEventListener('click', handleCalcClick);
  document.addEventListener('change', handleCalcChange);
  document.addEventListener('input', handleCalcInput);
}

function handleCalcClick(e) {
  // Перевіряємо що клік на calc-page
  if (!document.getElementById('calcPage')) return;

  // Навігація кроків
  if (e.target.closest('#calcNext'))   { e.stopPropagation(); goStep(state.step + 1); return; }
  if (e.target.closest('#calcPrev'))   { e.stopPropagation(); goStep(state.step - 1); return; }
  if (e.target.closest('#calcFinish')) { e.stopPropagation(); showResult(); return; }
  if (e.target.closest('#calcRestart')){ e.stopPropagation(); restartCalc(); return; }

  // Кнопки кошика (в sidebar і в result)
  if (e.target.closest('#summaryAddToCart') || e.target.closest('#calcAddToCart')) {
    e.stopPropagation();
    handleAddToCart();
    return;
  }
  if (e.target.closest('#summaryOrder') || e.target.closest('#calcOrder')) {
    e.stopPropagation();
    import('../router.js').then(m => m.navigate('contacts'));
    return;
  }

  // Spin-кнопки
  const spinBtn = e.target.closest('.calc-spin-btn');
  if (spinBtn && spinBtn.closest('#calcPage')) {
    e.stopPropagation();
    const field = spinBtn.dataset.spin;
    const dir   = Number(spinBtn.dataset.dir);
    if (field) handleSpin(field, dir);
    return;
  }

  // Пресети розмірів
  const preset = e.target.closest('[data-preset-w]');
  if (preset && preset.closest('#calcPage')) {
    e.stopPropagation();
    state.width  = Number(preset.dataset.presetW);
    state.height = Number(preset.dataset.presetH);
    refreshStep1Visuals();
    refreshSummary();
    // Оновлюємо active-клас на пресетах
    document.querySelectorAll('.calc-preset-btn').forEach(btn => {
      btn.classList.toggle('active',
        Number(btn.dataset.presetW) === state.width &&
        Number(btn.dataset.presetH) === state.height
      );
    });
    return;
  }

  // Extra ± кнопки (крок 6)
  const extraBtn = e.target.closest('[data-extra-id]');
  if (extraBtn && extraBtn.closest('#calcPage')) {
    e.stopPropagation();
    const id  = extraBtn.dataset.extraId;
    const dir = Number(extraBtn.dataset.extraDir);
    const cur = state.extras[id] || 0;
    state.extras[id] = Math.max(0, cur + dir);
    // Оновлюємо тільки конкретну картку
    const qtyEl  = document.getElementById(`extraQty-${id}`);
    const cardEl = document.getElementById(`extraCard-${id}`);
    if (qtyEl)  qtyEl.textContent = state.extras[id];
    if (cardEl) cardEl.classList.toggle('active', state.extras[id] > 0);
    // Оновлюємо підсумок
    refreshSummary();
    return;
  }
}

function handleCalcChange(e) {
  if (!document.getElementById('calcPage')) return;
  const t = e.target;

  // Radio-кнопки: оновлюємо стан і перемальовуємо active-клас
  const radioMap = {
    objectType: v => { state.objectType = v; refreshSummary(); },
    profile:    v => { state.profileId  = v; refreshSummary(); },
    glass:      v => { state.glassId    = v; refreshSummary(); },
    opening:    v => { state.openingId  = v; refreshSummary(); },
    sash:       v => { state.sashId     = v; refreshPreview(); refreshSummary(); },
    color:      v => { state.colorId    = v; refreshPreview(); refreshSummary(); },
  };

  const handler = radioMap[t.name];
  if (!handler) return;

  handler(t.value);

  // Оновлюємо active-клас на label без перебудови DOM
  const labels = t.closest('.calc-step')?.querySelectorAll(`[type="radio"][name="${t.name}"]`);
  labels?.forEach(radio => {
    const label = radio.closest('label');
    if (label) label.classList.toggle('active', radio.checked);
  });
}

function handleCalcInput(e) {
  if (!document.getElementById('calcPage')) return;
  const t = e.target;

  if (t.id === 'calcWidth') {
    const v = parseInt(t.value);
    if (v >= 400 && v <= 3000) { state.width = v; refreshStep1Visuals(); refreshSummary(); }
  }
  if (t.id === 'calcHeight') {
    const v = parseInt(t.value);
    if (v >= 400 && v <= 3000) { state.height = v; refreshStep1Visuals(); refreshSummary(); }
  }
  if (t.id === 'calcQty') {
    const v = Math.max(1, Math.min(200, parseInt(t.value) || 1));
    state.qty = v;
    refreshSummary();
    // Показати/сховати підказку знижки
    const hintEl = t.closest('.calc-qty-row')?.querySelector('.calc-discount-hint');
    if (state.qty >= 3) {
      if (!hintEl) {
        const row = t.closest('.calc-qty-row');
        row?.insertAdjacentHTML('beforeend', `<span class="calc-discount-hint">🎉 Знижка ${(getQtyDiscount(state.qty)*100).toFixed(0)}%</span>`);
      } else {
        hintEl.textContent = `🎉 Знижка ${(getQtyDiscount(state.qty)*100).toFixed(0)}%`;
      }
    } else if (hintEl) {
      hintEl.remove();
    }
  }
}

// ── Оновлення окремих частин UI (без повного rebuild) ──────
function refreshSummary() {
  const sidebar = document.getElementById('calcSidebar');
  if (!sidebar) return;
  sidebar.innerHTML = renderSummaryCard();
  // Кнопки в summary вже всередині #calcPage, events спрацьовують через делегування
}

function refreshPreview() {
  // Оновлюємо SVG превʼю у кроці 1 і в sidebar
  const stepPreview    = document.getElementById('calcPreview');
  const summaryPreview = document.getElementById('summaryPreview');
  const svg = renderWindowSVG();
  if (stepPreview)    stepPreview.innerHTML    = svg;
  if (summaryPreview) summaryPreview.innerHTML = svg;
}

function refreshStep1Visuals() {
  refreshPreview();
  const areaEl = document.getElementById('calcAreaBadge');
  if (areaEl) areaEl.textContent = (state.width * state.height / 1_000_000).toFixed(3) + ' м²';
}

// ── Навігація між кроками ─────────────────────────────────
function goStep(n) {
  if (n < 1 || n > state.totalSteps) return;
  state.step = n;

  // Оновлюємо прогрес-бар
  const progressEl = document.getElementById('calcProgress');
  if (progressEl) progressEl.outerHTML = renderProgressBar();

  // Оновлюємо крок
  const stepWrap = document.getElementById('calcStepWrap');
  if (stepWrap) stepWrap.innerHTML = renderCurrentStep();

  // Оновлюємо навігацію
  const navEl = document.getElementById('calcNav');
  if (navEl) navEl.outerHTML = renderStepNav();

  // Оновлюємо sidebar (кнопка «В кошик» тільки на кроці 6)
  refreshSummary();

  document.getElementById('calcPage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Результат ─────────────────────────────────────────────
function showResult() {
  const calc = calculate();
  const disc = calc.discount * 100;

  const main = document.getElementById('calcMain');
  if (!main) return;

  main.innerHTML = `
  <div class="calc-result">
    <div class="calc-result__header">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <h2>Розрахунок готовий!</h2>
      <p>На основі ваших параметрів ми підготували конфігурацію</p>
    </div>

    <div class="calc-result__config">
      <h3>Конфігурація вікна</h3>
      <div class="calc-result__grid">
        <div class="calc-result__item"><span class="calc-result__item-label">Розмір</span><span class="calc-result__item-val">${state.width} × ${state.height} мм</span></div>
        <div class="calc-result__item"><span class="calc-result__item-label">Площа</span><span class="calc-result__item-val">${calc.areaM2} м²</span></div>
        <div class="calc-result__item"><span class="calc-result__item-label">Профіль</span><span class="calc-result__item-val">${calc.profile.name}</span></div>
        <div class="calc-result__item"><span class="calc-result__item-label">Склопакет</span><span class="calc-result__item-val">${calc.glass.name}</span></div>
        <div class="calc-result__item"><span class="calc-result__item-label">Відкривання</span><span class="calc-result__item-val">${calc.opening.name}</span></div>
        <div class="calc-result__item"><span class="calc-result__item-label">Колір</span><span class="calc-result__item-val">${calc.color.name}</span></div>
        <div class="calc-result__item"><span class="calc-result__item-label">Кількість</span><span class="calc-result__item-val">${state.qty} шт.</span></div>
        ${calc.extrasBreakdown.length ? `<div class="calc-result__item" style="grid-column:1/-1"><span class="calc-result__item-label">Додатково</span><span class="calc-result__item-val">${calc.extrasBreakdown.map(e=>e.name).join(', ')}</span></div>` : ''}
      </div>
    </div>

    <div class="calc-result__price-block">
      <div class="calc-result__price-row"><span>1 вікно</span><span>${fmt(calc.unitPrice)}</span></div>
      ${calc.extrasTotal > 0 ? `<div class="calc-result__price-row"><span>Опції та послуги</span><span>${fmt(calc.extrasTotal)}</span></div>` : ''}
      ${state.qty > 1 ? `<div class="calc-result__price-row"><span>${state.qty} шт. × ${fmt(calc.subtotalPerUnit)}</span><span>${fmt(calc.subtotal)}</span></div>` : ''}
      ${disc > 0 ? `<div class="calc-result__price-row calc-result__price-row--discount"><span>🎉 Знижка ${disc.toFixed(0)}%</span><span>−${fmt(calc.discountAmount)}</span></div>` : ''}
      <div class="calc-result__total"><span>Загальна вартість</span><span class="calc-result__total-price">${fmt(calc.total)}</span></div>
    </div>

    <div class="calc-result__actions">
      <button class="btn btn--primary" id="calcAddToCart" style="flex:1;padding:14px">
        🛒 В кошик (${state.qty} шт.)
      </button>
      <button class="btn btn--ghost" id="calcOrder" style="flex:1;padding:14px">
        📞 Замовити дзвінок
      </button>
    </div>

    <button class="calc-restart-btn" id="calcRestart">
      ↺ Розрахувати ще раз
    </button>
  </div>`;

  // Sidebar теж оновлюємо
  refreshSummary();
}

// ── AddToCart — ОДИН запис з qty, не цикл ────────────────
function handleAddToCart() {
  const calc    = calculate();
  const profile = calc.profile;
  const glass   = calc.glass;

  // Унікальний id щоб addToCart не об'єднував з існуючим
  const product = {
    id:              Date.now(),
    title:           `${profile.name} ${state.width}×${state.height} мм, ${glass.name.split(' ')[0]}`,
    brand:           profile.brand,
    price:           calc.subtotalPerUnit,
    oldPrice:        null,
    category:        'metal-plastic',
    glass:           state.glassId,
    profileDepth:    profile.depth,
    profileChambers: profile.chambers,
    color:           state.colorId,
    guarantee:       5,
    rating:          4.8,
    reviewCount:     0,
    badge:           null,
    badgeLabel:      null,
    svg:             renderWindowSVG(),
    _calcQty:        state.qty, // маркер що це з калькулятора
  };

  // Додаємо один раз, але одразу з потрібною кількістю
  // cart.addToCart збільшує qty на 1 при кожному виклику
  // тому викликаємо state.qty разів — це ПРАВИЛЬНО для cart.js
  // АЛЕ: cart.js при повторному id додає qty++ замість нового запису
  // Тому робимо id унікальним (Date.now() вже гарантує це)
  for (let i = 0; i < state.qty; i++) {
    addToCart({ ...product, id: product.id + i });
  }

  // Feedback
  const btn = document.getElementById('calcAddToCart') || document.getElementById('summaryAddToCart');
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Додано в кошик!';
    btn.classList.add('btn--added');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('btn--added'); }, 2000);
  }
}

function restartCalc() {
  _eventsAttached = false; // дозволяємо перевішати events
  state = DEFAULT_STATE();

  const calcMain    = document.getElementById('calcMain');
  const calcSidebar = document.getElementById('calcSidebar');

  if (calcMain) {
    calcMain.innerHTML = renderProgressBar()
      + `<div class="calc-step-wrap" id="calcStepWrap">${renderCurrentStep()}</div>`
      + renderStepNav();
  }
  if (calcSidebar) calcSidebar.innerHTML = renderSummaryCard();

  attachCalcEvents();
  document.getElementById('calcPage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleSpin(field, dir) {
  const cfg = {
    width:  { step:50,  min:400,  max:3000 },
    height: { step:50,  min:400,  max:3000 },
    qty:    { step:1,   min:1,    max:200  },
  };
  const c = cfg[field];
  if (!c) return;
  state[field] = Math.max(c.min, Math.min(c.max, state[field] + dir * c.step));

  // Оновлюємо input
  const inputId = field === 'qty' ? 'calcQty'
    : field === 'width' ? 'calcWidth' : 'calcHeight';
  const inputEl = document.getElementById(inputId);
  if (inputEl) inputEl.value = state[field];

  if (field === 'width' || field === 'height') {
    refreshStep1Visuals();
  }
  refreshSummary();
}