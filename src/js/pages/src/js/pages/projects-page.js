// ============================================================
//  projects-page.js — Реалізовані проєкти
// ============================================================

const PROJECTS = [
  {
    id: 1, type: 'Житловий будинок',
    title: 'ЖК «Зелений квартал», Київ',
    desc: '240 вікон REHAU Geneo встановлено у 12-поверховому будинку. Енергозберігаючі трикамерні склопакети знизили тепловтрати на 38%.',
    windows: 240, area: 480, months: 3, year: 2024,
    tags: ['REHAU', 'Трикамерний', 'Масштабний'],
    color: '#1a56db',
    svg: `<svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="280" height="180" rx="12" fill="#eef2f9"/>
      <!-- building -->
      <rect x="60" y="30" width="160" height="130" rx="4" fill="#d4dff0" stroke="#b8c8df" stroke-width="2"/>
      <rect x="60" y="30" width="160" height="20" rx="4" fill="#b8c8df"/>
      <!-- windows grid -->
      ${[80,120,160,200].map(x => [60,90,120].map(y =>
        `<rect x="${x}" y="${y}" width="20" height="18" rx="2" fill="#7fa8d4" opacity="0.6" stroke="#5a8ab8" stroke-width="1"/>`
      ).join('')).join('')}
      <!-- door -->
      <rect x="120" y="120" width="40" height="40" rx="3" fill="#9aafc0" stroke="#7a90a8" stroke-width="1.5"/>
      <circle cx="152" cy="140" r="2.5" fill="#5a7090"/>
    </svg>`,
  },
  {
    id: 2, type: 'Приватний будинок',
    title: 'Котедж «Лісова садиба», Буча',
    desc: 'Дерев\'яні вікна Internorm з теплим алюмінієвим профілем. Панорамне засклення вітальні 4×2.4 м стало центральним архітектурним рішенням.',
    windows: 18, area: 62, months: 1, year: 2024,
    tags: ['Internorm', 'Дерево+Алюміній', 'Панорамне'],
    color: '#16a34a',
    svg: `<svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="280" height="180" rx="12" fill="#f0fdf4"/>
      <!-- roof -->
      <polygon points="30,80 140,20 250,80" fill="#c4a882" stroke="#b89060" stroke-width="2"/>
      <!-- walls -->
      <rect x="50" y="78" width="180" height="82" rx="3" fill="#fdf6ed" stroke="#c4a882" stroke-width="2"/>
      <!-- big panoramic window -->
      <rect x="70" y="90" width="80" height="50" rx="4" fill="#b8d4e8" opacity="0.8" stroke="#8ab8d8" stroke-width="2"/>
      <line x1="110" y1="90" x2="110" y2="140" stroke="#8ab8d8" stroke-width="1.5"/>
      <line x1="70" y1="115" x2="150" y2="115" stroke="#8ab8d8" stroke-width="1.5"/>
      <!-- small windows -->
      <rect x="170" y="90" width="30" height="25" rx="3" fill="#b8d4e8" opacity="0.7" stroke="#8ab8d8" stroke-width="1.5"/>
      <rect x="210" y="90" width="30" height="25" rx="3" fill="#b8d4e8" opacity="0.7" stroke="#8ab8d8" stroke-width="1.5"/>
      <!-- door -->
      <rect x="120" y="118" width="40" height="42" rx="3" fill="#c4a882" stroke="#a08050" stroke-width="1.5"/>
      <circle cx="152" cy="139" r="2.5" fill="#806040"/>
      <!-- trees -->
      <circle cx="24" cy="100" r="18" fill="#86c98a" opacity="0.7"/>
      <rect x="22" y="115" width="4" height="15" fill="#7a6050"/>
      <circle cx="258" cy="98" r="16" fill="#86c98a" opacity="0.7"/>
      <rect x="256" y="112" width="4" height="18" fill="#7a6050"/>
    </svg>`,
  },
  {
    id: 3, type: 'Офісний центр',
    title: 'БЦ «Скай Тауер», Львів',
    desc: 'Алюмінієве фасадне засклення Schüco на 8 поверхах. Системні рішення з тепловим розривом, стійкість до вітрового навантаження клас C5.',
    windows: 380, area: 1200, months: 6, year: 2023,
    tags: ['Schüco', 'Алюміній', 'Фасад'],
    color: '#7c3aed',
    svg: `<svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="280" height="180" rx="12" fill="#f5f0fe"/>
      <!-- tower -->
      <rect x="90" y="10" width="100" height="155" rx="3" fill="#d8d0f0" stroke="#b8a8e0" stroke-width="2"/>
      <!-- facade glazing grid -->
      ${[4,5,6,7,8,9,10,11].map((row, ri) =>
        [3,4,5].map((col, ci) => {
          const x = 98 + ci * 28;
          const y = 18 + ri * 17;
          return `<rect x="${x}" y="${y}" width="20" height="12" rx="1" fill="#9aaed4" opacity="${0.4 + ci * 0.15}" stroke="#7a8ec4" stroke-width="0.8"/>`;
        }).join('')
      ).join('')}
      <!-- roof detail -->
      <rect x="90" y="10" width="100" height="14" rx="3" fill="#b8a8e0"/>
      <!-- side buildings -->
      <rect x="30" y="60" width="58" height="105" rx="3" fill="#e8e0f4" stroke="#c8c0e4" stroke-width="1.5"/>
      <rect x="192" y="75" width="58" height="90" rx="3" fill="#e8e0f4" stroke="#c8c0e4" stroke-width="1.5"/>
      ${[70,85,100,115,130,145].map(y =>
        [38,52].map(x => `<rect x="${x}" y="${y}" width="12" height="9" rx="1" fill="#9aaed4" opacity="0.5" stroke="#7a8ec4" stroke-width="0.6"/>`).join('')
      ).join('')}
    </svg>`,
  },
  {
    id: 4, type: 'Школа',
    title: 'Гімназія №12, Харків',
    desc: 'Заміна застарілих деревʼяних вікон на металопластикові VEKA Softline з ламінацією. Антивандальне загартоване скло, клас взломостійкості RC2.',
    windows: 160, area: 320, months: 2, year: 2024,
    tags: ['VEKA', 'RC2', 'Антивандальне'],
    color: '#f97316',
    svg: `<svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="280" height="180" rx="12" fill="#fff7f0"/>
      <!-- main building -->
      <rect x="20" y="50" width="240" height="115" rx="3" fill="#ffe8d6" stroke="#f4a070" stroke-width="2"/>
      <!-- roof / portico -->
      <polygon points="100,50 140,15 180,50" fill="#f4a070" stroke="#e07040" stroke-width="2"/>
      <rect x="20" y="50" width="240" height="14" rx="3" fill="#f4a070"/>
      <!-- columns -->
      <rect x="110" y="50" width="8" height="40" fill="#e8c0a0"/>
      <rect x="162" y="50" width="8" height="40" fill="#e8c0a0"/>
      <!-- windows in rows -->
      ${[70,100,130].map(y =>
        [35,75,115,155,195,230].map(x =>
          `<rect x="${x}" y="${y}" width="28" height="22" rx="2" fill="#b8d4e8" opacity="0.8" stroke="#8ab0d0" stroke-width="1.5"/>
           <line x1="${x+14}" y1="${y}" x2="${x+14}" y2="${y+22}" stroke="#8ab0d0" stroke-width="1"/>
           <line x1="${x}" y1="${y+11}" x2="${x+28}" y2="${y+11}" stroke="#8ab0d0" stroke-width="1"/>`
        ).join('')
      ).join('')}
      <!-- entrance door -->
      <rect x="120" y="130" width="40" height="35" rx="3" fill="#f4a070" stroke="#e07040" stroke-width="1.5"/>
      <line x1="140" y1="130" x2="140" y2="165" stroke="#e07040" stroke-width="1"/>
      <circle cx="132" cy="148" r="2.5" fill="#e07040"/>
    </svg>`,
  },
  {
    id: 5, type: 'Апартаменти',
    title: 'Апарт-готель «Panorama», Одеса',
    desc: 'Мансардні вікна Velux на 40 номерів із виходом на дах-тераси. Системи електричного відкриття та дистанційне управління жалюзі.',
    windows: 80, area: 160, months: 2, year: 2023,
    tags: ['Velux', 'Мансарда', 'Автоматика'],
    color: '#0891b2',
    svg: `<svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="280" height="180" rx="12" fill="#f0f9ff"/>
      <!-- building body -->
      <rect x="40" y="60" width="200" height="105" rx="3" fill="#dbeafe" stroke="#93c5fd" stroke-width="2"/>
      <!-- mansard roof -->
      <path d="M30,60 L140,8 L250,60 Z" fill="#b8d4f0" stroke="#78b0e0" stroke-width="2"/>
      <path d="M70,60 L140,22 L210,60 Z" fill="#93c5fd" stroke="#78b0e0" stroke-width="1.5"/>
      <!-- mansard windows on roof -->
      ${[-40,-13,14,41].map((offset, i) =>
        `<rect x="${140 + offset}" y="28" width="22" height="18" rx="3" fill="#7fa8d4" opacity="0.8" stroke="#5a88c0" stroke-width="1.5"/>
         <line x1="${140 + offset + 11}" y1="28" x2="${140 + offset + 11}" y2="46" stroke="#5a88c0" stroke-width="1"/>
         <line x1="${140 + offset}" y1="37" x2="${140 + offset + 22}" y2="37" stroke="#5a88c0" stroke-width="1"/>`
      ).join('')}
      <!-- floor windows -->
      ${[75,110,145].map(y =>
        [55,100,145,185].map(x =>
          `<rect x="${x}" y="${y}" width="32" height="24" rx="2" fill="#b8d4e8" opacity="0.8" stroke="#8ab0d0" stroke-width="1.5"/>
           <line x1="${x+16}" y1="${y}" x2="${x+16}" y2="${y+24}" stroke="#8ab0d0" stroke-width="1"/>`
        ).join('')
      ).join('')}
    </svg>`,
  },
  {
    id: 6, type: 'Медичний центр',
    title: 'Клініка «Медіком», Дніпро',
    desc: 'Алюмінієві вікна Reynaers із шумоізоляцією Rw=42 дБ. Спеціальне антибактеріальне покриття профілю, безпечне триплекс-скло в дитячих палатах.',
    windows: 95, area: 210, months: 3, year: 2024,
    tags: ['Reynaers', 'Шумоізоляція', 'Медицина'],
    color: '#059669',
    svg: `<svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="280" height="180" rx="12" fill="#ecfdf5"/>
      <!-- building -->
      <rect x="35" y="40" width="210" height="125" rx="4" fill="#d1fae5" stroke="#6ee7b7" stroke-width="2"/>
      <rect x="35" y="40" width="210" height="18" rx="4" fill="#6ee7b7"/>
      <!-- cross symbol on facade -->
      <rect x="128" y="55" width="24" height="8" rx="2" fill="#ffffff" opacity="0.9"/>
      <rect x="136" y="47" width="8" height="24" rx="2" fill="#ffffff" opacity="0.9"/>
      <!-- windows -->
      ${[72,100,128].map(y =>
        [48,90,132,174,210].map(x =>
          `<rect x="${x}" y="${y}" width="30" height="22" rx="2" fill="#7dd3c0" opacity="0.7" stroke="#34b0a0" stroke-width="1.5"/>
           <line x1="${x+15}" y1="${y}" x2="${x+15}" y2="${y+22}" stroke="#34b0a0" stroke-width="1"/>
           <line x1="${x}" y1="${y+11}" x2="${x+30}" y2="${y+11}" stroke="#34b0a0" stroke-width="1"/>`
        ).join('')
      ).join('')}
      <!-- entrance -->
      <rect x="115" y="130" width="50" height="35" rx="3" fill="#a7f3d0" stroke="#34b0a0" stroke-width="1.5"/>
      <line x1="140" y1="130" x2="140" y2="165" stroke="#34b0a0" stroke-width="1"/>
    </svg>`,
  },
];

export const projectsPage = {
  render() {
    return `
    <div class="page-content">
      <!-- Hero -->
      <div class="projects-hero">
        <span class="projects-hero__eyebrow">📐 Наш досвід</span>
        <h1 class="projects-hero__title">Реалізовані проєкти</h1>
        <p class="projects-hero__sub">Понад 2400 об'єктів по всій Україні — від котеджів до хмарочосів</p>
        <!-- Stats -->
        <div class="projects-stats">
          <div class="stat-item"><span class="stat-val">2 400+</span><span class="stat-label">Об'єктів</span></div>
          <div class="stat-item"><span class="stat-val">180 000+</span><span class="stat-label">Вікон встановлено</span></div>
          <div class="stat-item"><span class="stat-val">12</span><span class="stat-label">Років на ринку</span></div>
          <div class="stat-item"><span class="stat-val">4.9 ⭐</span><span class="stat-label">Середній рейтинг</span></div>
        </div>
      </div>

      <!-- Filter tabs -->
      <div class="projects-tabs" id="projectsTabs">
        <button class="projects-tab projects-tab--active" data-filter="all">Всі</button>
        <button class="projects-tab" data-filter="Житловий будинок">Житлові</button>
        <button class="projects-tab" data-filter="Приватний будинок">Приватні</button>
        <button class="projects-tab" data-filter="Офісний центр">Офіси</button>
        <button class="projects-tab" data-filter="Школа">Освіта</button>
        <button class="projects-tab" data-filter="Медичний центр">Медицина</button>
      </div>

      <!-- Projects grid -->
      <div class="projects-grid" id="projectsGrid">
        ${PROJECTS.map(p => projectCard(p)).join('')}
      </div>
    </div>`;
  },

  init() {
    // Filter tabs
    document.querySelectorAll('.projects-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.projects-tab').forEach(t => t.classList.remove('projects-tab--active'));
        tab.classList.add('projects-tab--active');
        const filter = tab.dataset.filter;
        filterProjects(filter);
      });
    });
  },
};

function filterProjects(filter) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = PROJECTS
    .filter(p => filter === 'all' || p.type === filter)
    .map(p => projectCard(p)).join('');

  // Re-animate
  grid.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.07}s`;
  });
}

function projectCard(p) {
  return `
  <article class="project-card" data-id="${p.id}">
    <div class="project-card__img" style="background: ${p.color}18; border-color: ${p.color}30">
      ${p.svg}
      <span class="project-card__type" style="background:${p.color}">${p.type}</span>
    </div>
    <div class="project-card__body">
      <h3 class="project-card__title">${p.title}</h3>
      <p class="project-card__desc">${p.desc}</p>
      <div class="project-card__meta">
        <span class="project-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
          ${p.windows} вікон
        </span>
        <span class="project-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          ${p.area} м²
        </span>
        <span class="project-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${p.months} міс.
        </span>
        <span class="project-meta-item project-meta-year">${p.year}</span>
      </div>
      <div class="project-card__tags">
        ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
    </div>
  </article>`;
}