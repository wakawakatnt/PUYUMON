// =====================================================
// ぷゆモン - 図鑑UI
// =====================================================

let pokedexSelectedId = null;

function showPokedexScreen() {
  showScreen('pokedex');
  renderPokedexTypeFilter();
  renderPokedexList();
  document.getElementById('pokedex-detail').innerHTML = '<p style="color:var(--text-sub);padding:8px;">ぷゆモンをえらんでください</p>';
}

function renderPokedexTypeFilter() {
  const sel = document.getElementById('pokedex-type-filter');
  if (!sel || sel.children.length > 1) return;
  TYPES.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  });
}

function renderPokedexList() {
  const container = document.getElementById('pokedex-list');
  if (!container || typeof PUYUMON_DATA === 'undefined') return;

  const search = document.getElementById('pokedex-search')?.value?.toLowerCase() || '';
  const typeFilter = document.getElementById('pokedex-type-filter')?.value || '';
  const capturedOnly = document.getElementById('pokedex-captured-only')?.checked || false;

  container.innerHTML = '';

  const entries = Object.entries(PUYUMON_DATA);
  entries.sort((a, b) => (a[1].id || 0) - (b[1].id || 0));

  entries.forEach(([id, base]) => {
    const dexEntry = Game.pokedex[id] || { seen: false, caught: false };
    if (capturedOnly && !dexEntry.caught) return;

    const matchSearch = !search ||
      base.name.toLowerCase().includes(search) ||
      (base.id || '').toString().includes(search);
    if (!matchSearch) return;

    if (typeFilter && !base.types.includes(typeFilter)) return;

    const card = document.createElement('div');
    card.className = 'dex-card' +
      (!dexEntry.seen ? ' unseen' : '') +
      (id === pokedexSelectedId ? ' selected' : '');

    const icon = dexEntry.seen ? (base.icon || '❓') : '❓';
    const name = dexEntry.seen ? base.name : '？？？';
    const numStr = String(base.id || 0).padStart(3, '0');

    card.innerHTML = `
      <div class="dex-icon">${icon}</div>
      <div class="dex-num">No.${numStr}</div>
      <div class="dex-name">${name}</div>
      ${dexEntry.caught ? '<div style="font-size:9px;color:#44dd44">✓ゲット</div>' : ''}
    `;

    card.onclick = () => onPokedexCardClick(id, base, dexEntry);
    container.appendChild(card);
  });
}

function onPokedexCardClick(id, base, dexEntry) {
  pokedexSelectedId = id;
  renderPokedexList();
  renderPokedexDetail(id, base, dexEntry);
}

function renderPokedexDetail(id, base, dexEntry) {
  const detail = document.getElementById('pokedex-detail');
  if (!detail) return;

  if (!dexEntry.seen) {
    detail.innerHTML = '<p style="color:var(--text-sub);padding:8px;">まだ見たことがない…</p>';
    return;
  }

  const types = base.types.map(t =>
    `<span class="type-badge ${getTypeClass(t)}">${t}</span>`
  ).join(' ');

  const statsHtml = base.baseStats ? Object.entries(base.baseStats).map(([key, val]) => {
    const barW = getStatBarWidth(key, val);
    return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
      <span style="min-width:56px;font-size:11px;color:var(--text-sub)">${STAT_NAMES[key]}</span>
      <div style="flex:1;height:5px;background:rgba(255,255,255,0.15);border-radius:3px;">
        <div style="width:${barW}%;height:100%;background:var(--accent2);border-radius:3px;"></div>
      </div>
      <span style="min-width:30px;font-size:12px;text-align:right;font-weight:700;color:var(--accent2)">${val}</span>
    </div>`;
  }).join('') : '';

  const totalBst = base.baseStats ? Object.values(base.baseStats).reduce((a, b) => a + b, 0) : 0;

  const abilitiesHtml = (base.abilities || []).map(a => {
    const ab = ABILITIES[a];
    return `<div style="margin-bottom:4px;">
      <span style="color:var(--accent3);font-weight:700">${a}</span>
      <span style="font-size:11px;color:var(--text-sub)"> - ${ab?.desc || ''}</span>
    </div>`;
  }).join('');

  detail.innerHTML = `
    <div class="dex-detail-inner">
      <div class="dex-detail-sprite">${base.icon || '❓'}${dexEntry.caught ? '<div style="font-size:12px;color:#44dd44;text-align:center">ゲット済</div>' : ''}</div>
      <div class="dex-detail-info">
        <div class="dex-detail-name">No.${String(base.id||0).padStart(3,'0')} ${base.name}</div>
        <div style="margin:4px 0">${types}</div>
        <div class="dex-detail-flavor">${base.flavor || ''}</div>
      </div>
    </div>
    <div style="margin-top:8px">
      <div style="font-size:12px;color:var(--text-sub);margin-bottom:4px">種族値（合計: <strong>${totalBst}</strong>）</div>
      ${statsHtml}
    </div>
    <div style="margin-top:8px">
      <div style="font-size:12px;color:var(--text-sub);margin-bottom:4px">特性</div>
      ${abilitiesHtml}
    </div>
    ${base.catchRate !== undefined ? `<div style="font-size:11px;color:var(--text-sub);margin-top:4px">捕獲率: ${base.catchRate} / 経験値グループ: ${base.expGroup}</div>` : ''}
  `;
}

function setupPokedexEvents() {
  document.getElementById('btn-pokedex-back')?.addEventListener('click', () => {
    showScreen('main');
    updateMainMenu();
  });

  document.getElementById('btn-pokedex-title')?.addEventListener('click', () => {
    showPokedexScreen();
  });

  document.getElementById('btn-pokedex')?.addEventListener('click', () => {
    showPokedexScreen();
  });

  document.getElementById('pokedex-search')?.addEventListener('input', () => {
    renderPokedexList();
  });

  document.getElementById('pokedex-type-filter')?.addEventListener('change', () => {
    renderPokedexList();
  });

  document.getElementById('pokedex-captured-only')?.addEventListener('change', () => {
    renderPokedexList();
  });
}
