// ============================================================
//  calculator-data.js — Цінові таблиці та коефіцієнти
//  для розрахунку вартості вікна
// ============================================================

// ── Профільні системи ──────────────────────────────────────
export const PROFILES = [
  {
    id: 'rehau-delight',
    brand: 'REHAU',
    name: 'REHAU Delight',
    depth: 70, chambers: 5,
    basePrice: 1800,   // грн/м²  (без скла)
    description: 'Оптимальне співвідношення ціни та якості',
    badge: 'Популярний',
    badgeColor: '#1a56db',
  },
  {
    id: 'rehau-geneo',
    brand: 'REHAU',
    name: 'REHAU Geneo',
    depth: 86, chambers: 6,
    basePrice: 2600,
    description: 'Преміум профіль зі склопластиковим армуванням',
    badge: 'Преміум',
    badgeColor: '#7c3aed',
  },
  {
    id: 'veka-softline',
    brand: 'VEKA',
    name: 'VEKA Softline 70',
    depth: 70, chambers: 5,
    basePrice: 1750,
    description: 'Класична надійна система VEKA',
    badge: null,
    badgeColor: null,
  },
  {
    id: 'veka-softline82',
    brand: 'VEKA',
    name: 'VEKA Softline 82',
    depth: 82, chambers: 6,
    basePrice: 2400,
    description: 'Підвищена теплоізоляція для холодних регіонів',
    badge: null,
    badgeColor: null,
  },
  {
    id: 'salamander-blue',
    brand: 'Salamander',
    name: 'Salamander Blue Evo',
    depth: 76, chambers: 6,
    basePrice: 2100,
    description: 'Екологічно чистий профіль без свинцю',
    badge: 'Еко',
    badgeColor: '#16a34a',
  },
  {
    id: 'aluplast-4000',
    brand: 'Aluplast',
    name: 'Aluplast Ideal 4000',
    depth: 70, chambers: 4,
    basePrice: 1600,
    description: 'Бюджетне рішення від німецького виробника',
    badge: 'Бюджет',
    badgeColor: '#f97316',
  },
  {
    id: 'kbe-expert',
    brand: 'KBE',
    name: 'KBE Expert 58',
    depth: 58, chambers: 3,
    basePrice: 1400,
    description: 'Економ-клас для дач та нежитлових приміщень',
    badge: 'Економ',
    badgeColor: '#059669',
  },
];

// ── Типи скла (склопакети) ─────────────────────────────────
export const GLASS_TYPES = [
  {
    id: 'single-2k',
    name: 'Двокамерний 4-10-4-10-4',
    description: 'Стандарт. Достатньо для більшості квартир',
    pricePerM2: 650,
    thermalRes: '0.56 м²·К/Вт',
    soundDb: 28,
    popular: true,
  },
  {
    id: 'single-2k-sp',
    name: 'Двокамерний енергозберігаючий',
    description: 'З Low-E покриттям. Менше тепловтрат взимку',
    pricePerM2: 880,
    thermalRes: '0.72 м²·К/Вт',
    soundDb: 30,
    popular: false,
  },
  {
    id: 'triple-3k',
    name: 'Трикамерний 4-10-4-10-4-10-4',
    description: 'Максимальне тепло. Рекомендовано для будинків',
    pricePerM2: 1050,
    thermalRes: '0.82 м²·К/Вт',
    soundDb: 33,
    popular: false,
  },
  {
    id: 'sound-2k',
    name: 'Шумозахисний 6-16-6',
    description: 'Для жвавих вулиць, залізниць, аеропортів',
    pricePerM2: 1200,
    thermalRes: '0.60 м²·К/Вт',
    soundDb: 42,
    popular: false,
  },
  {
    id: 'triple-3k-sp',
    name: 'Трикамерний енергозберігаючий',
    description: 'Найвищий клас. Low-E + аргон + 3 камери',
    pricePerM2: 1450,
    thermalRes: '1.05 м²·К/Вт',
    soundDb: 35,
    popular: false,
  },
];

// ── Типи відкривання ───────────────────────────────────────
export const OPENING_TYPES = [
  { id: 'fixed',     name: 'Глухе (нерухоме)',           coeff: 0.85, icon: '▪', desc: 'Не відкривається. Найдешевше, максимальне скло' },
  { id: 'tilt',      name: 'Поворотно-відкидне',         coeff: 1.00, icon: '↗', desc: 'Класичне. Відкривається вбік та нахиляється' },
  { id: 'tilt-only', name: 'Тільки відкидне (нахил)',    coeff: 0.95, icon: '↑', desc: 'Мікровентиляція без повного відкривання' },
  { id: 'slide',     name: 'Розсувне (слайдер)',         coeff: 1.20, icon: '⇄', desc: 'Для великих прорізів та балконів' },
  { id: 'lift-slide',name: 'Підйомно-розсувне HST',      coeff: 1.65, icon: '⇅', desc: 'Преміум для терас і панорамних вікон' },
];

// ── Конфігурація стулок ────────────────────────────────────
export const SASH_CONFIGS = [
  { id: '1s-fixed',  name: '1 стулка (глуха)',           sashes: 0, coeff: 0.90, preview: '□' },
  { id: '1s-open',   name: '1 стулка (відкривна)',       sashes: 1, coeff: 1.00, preview: '▦' },
  { id: '2s-1open',  name: '2 стулки (1 відкривна)',     sashes: 1, coeff: 1.10, preview: '⊞' },
  { id: '2s-2open',  name: '2 стулки (2 відкривні)',     sashes: 2, coeff: 1.20, preview: '⊡' },
  { id: '3s-1open',  name: '3 стулки (1 відкривна)',     sashes: 1, coeff: 1.18, preview: '⊟' },
  { id: '3s-2open',  name: '3 стулки (2 відкривні)',     sashes: 2, coeff: 1.32, preview: '⊠' },
  { id: 'balcony',   name: 'Балконний блок (двері+вікно)',sashes: 2, coeff: 1.45, preview: '🚪' },
];

// ── Кольори ───────────────────────────────────────────────
export const COLORS = [
  { id: 'white',      name: 'Білий',        hex: '#ffffff', coeff: 1.00 },
  { id: 'laminate',   name: 'Ламінація (дуб, горіх, вишня)', hex: '#c8a882', coeff: 1.18 },
  { id: 'anthracite', name: 'Антрацит',     hex: '#424242', coeff: 1.22 },
  { id: 'black',      name: 'Чорний',       hex: '#1a1a1a', coeff: 1.25 },
  { id: 'bronze',     name: 'Бронза',       hex: '#8B6914', coeff: 1.20 },
  { id: 'bicolor',    name: 'Двоколірний',  hex: 'linear-gradient(90deg,#fff 50%,#424242 50%)', coeff: 1.30 },
];

// ── Додаткові опції ────────────────────────────────────────
export const EXTRAS = [
  { id: 'mosquito',    name: 'Москітна сітка',          price: 650,  unit: 'шт',  icon: '🪟' },
  { id: 'blinds',      name: 'Жалюзі між склами',       price: 1800, unit: 'шт',  icon: '📐' },
  { id: 'roller',      name: 'Рулонна штора',            price: 1200, unit: 'шт',  icon: '🎞' },
  { id: 'sill-pvc',    name: 'Підвіконня ПВХ (пог.м)',  price: 420,  unit: 'пог.м', icon: '📏' },
  { id: 'sill-stone',  name: 'Підвіконня мармур/граніт',price: 1800, unit: 'пог.м', icon: '🪨' },
  { id: 'ebb',         name: 'Відлив (пог.м)',           price: 180,  unit: 'пог.м', icon: '💧' },
  { id: 'install',     name: 'Монтаж',                   price: 1200, unit: 'шт',  icon: '🔧' },
  { id: 'demolition',  name: 'Демонтаж старого вікна',  price: 400,  unit: 'шт',  icon: '🔨' },
  { id: 'slopes',      name: 'Укіс ПВХ (комплект)',     price: 1800, unit: 'шт',  icon: '🏠' },
  { id: 'child-lock',  name: 'Дитячий замок',            price: 350,  unit: 'шт',  icon: '🔒' },
];

// ── Коефіцієнти поверхів та типу об'єкта ─────────────────
export const OBJECT_TYPES = [
  { id: 'apartment', name: 'Квартира',          coeff: 1.00 },
  { id: 'house',     name: 'Приватний будинок', coeff: 1.05 },
  { id: 'office',    name: 'Офіс/Комерція',     coeff: 1.08 },
  { id: 'cottage',   name: 'Котедж/Таунхаус',   coeff: 1.10 },
];

// ── Мінімальна площа вікна ─────────────────────────────────
export const MIN_AREA_M2 = 0.4;
export const MIN_PRICE    = 3500;   // грн — мінімальна ціна однієї одиниці

// ── Знижки за кількістю ────────────────────────────────────
export const QTY_DISCOUNTS = [
  { from: 1,  to: 2,  discount: 0    },
  { from: 3,  to: 4,  discount: 0.03 },
  { from: 5,  to: 9,  discount: 0.05 },
  { from: 10, to: 19, discount: 0.07 },
  { from: 20, to: Infinity, discount: 0.10 },
];

export function getQtyDiscount(qty) {
  const tier = QTY_DISCOUNTS.find(t => qty >= t.from && qty <= t.to);
  return tier ? tier.discount : 0;
}