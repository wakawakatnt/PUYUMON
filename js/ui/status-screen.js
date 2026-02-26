// =====================================================
// ぷゆモン - ステータス詳細 & 全体一覧画面
// =====================================================

let statusScreenMonList = [];
let statusScreenIndex = 0;

// =====================================================
// 個別ステータス画面
// =====================================================
function showStatusScreen(partyIndexOrMon) {
  showScreen('status');
  // パーティ全体リスト
  statusScreenMonList = Game.party.filter(Boolean);
  if (typeof partyIndexOrMon === 'number') {
    statusScreenIndex = partyIndexOrMon;
  } else {
    const idx = statusScreenMonList.findIndex(m => m === partyIndexOrMon);
    statusScreenIndex = idx >= 0 ? idx : 0;
  }
  renderStatusContent();
}

function renderStatusContent() {
  const mon = statusScreenMonList[statusScreenIndex];
  if (!mon) return;

  const content = document.getElementById('status-content');
  if (!content) return;

  const base = getPuyuMonBase(mon.speciesId);
  const icon = base ? base.icon : '❓';
  const ability = ABILITIES[mon.ability];
  const types = mon.types.map(t =>
    `<span class="type-badge ${getTypeClass(t)}">${t}</span>`
  ).join(' ');

  // EV / IV 表示
  const statsRows = ['hp','atk','def','spa','spd','spe'].map(key => {
    const base_v = mon.baseStats[key] || 0;
    const stat_v = mon.stats[key] || 0;
    const iv_v   = mon.ivs[key] || 0;
    const ev_v   = mon.evs[key] || 0;
    const barW   = getStatBarWidth(key, stat_v);
    // 性格補正カラー
    const natMult = getNatureMultiplier(mon.nature, key);
    const color = natMult > 1 ? '#ff8866' : natMult < 1 ? '#88aaff' : 'var(--accent2)';
    return `
      <div class="stat-item">
        <div class="stat-name">${STAT_NAMES[key]}</div>
        <div class="stat-value" style="color:${color}">${stat_v}</div>
        <div class="stat-bar-outer"><div class="stat-bar-inner" style="width:${barW}%;background:${color}"></div></div>
        <div style="font-size:9px;color:var(--text-sub);margin-top:2px">種:${base_v} IV:${iv_v} EV:${ev_v}</div>
      </div>
    `;
  }).join('');

  // 技リスト
  const movesHtml = mon.moves.map(moveName => {
    const move = MOVES[moveName];
    if (!move) return '';
    const pp = mon.movePPs[moveName] || 0;
    return `
      <div class="status-move-item">
        <div class="move-name-badge">${moveName}</div>
        <div class="move-detail">
          <span class="type-badge ${getTypeClass(move.type)}" style="font-size:9px">${move.type}</span>
          <span style="margin-left:4px">${move.category==='physical'?'物理':move.category==='special'?'特殊':'変化'}</span>
          <span style="margin-left:4px">威力:${move.power||'---'}</span>
          <span style="margin-left:4px">PP:${pp}/${move.pp}</span>
        </div>
        <div style="font-size:10px;color:var(--text-sub);margin-top:2px">${move.desc||''}</div>
      </div>
    `;
  }).join('');

  // 経験値情報
  const expGroup = base ? base.expGroup : 'medium';
  const expToNext = mon.level < 100 ? calcExpToNextLevel(expGroup, mon.level) : 0;
  const currentLvExp = calcExpForLevel(expGroup, mon.level);
  const nextLvExp = calcExpForLevel(expGroup, mon.level + 1);
  const expProgress = mon.level >= 100 ? 100 :
    nextLvExp > currentLvExp ? Math.round((mon.exp - currentLvExp) / (nextLvExp - currentLvExp) * 100) : 0;

  content.innerHTML = `
    <div class="status-card">
      <div class="status-top">
        <div class="status-sprite-box">${icon}${mon.isShiny ? '\n✨' : ''}</div>
        <div class="status-name-box">
          <div class="status-name">${mon.nickname ? `${mon.nickname} <span style="font-size:14px;color:var(--text-sub)">(${mon.name})</span>` : mon.name}</div>
          <div class="status-types">${types}</div>
          <div class="status-level">Lv.${mon.level} ${getGenderSymbol(mon.gender)}</div>
          ${mon.status ? `<div><span class="status-badge ${getStatusClass(mon.status)}">${getStatusText(mon.status)}</span></div>` : ''}
          ${mon.item ? `<div style="font-size:12px;margin-top:4px">🎒 ${mon.item}</div>` : ''}
        </div>
      </div>

      <div style="margin:10px 0;padding:8px;background:rgba(255,255,255,0.05);border-radius:8px;font-size:12px">
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <div>OT: ${mon.originalTrainer || '---'} #${mon.originalTrainerId || '---'}</div>
          <div>性格: ${mon.nature}</div>
          <div>幸福度: ${mon.happiness || 0}</div>
          ${mon.caughtAt ? `<div>捕獲: Lv.${mon.caughtLevel}</div>` : ''}
        </div>
      </div>

      <div style="margin:6px 0;font-size:12px">
        ${mon.level < 100 ? `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span style="color:var(--text-sub)">次のレベルまで</span>
          <div style="flex:1;height:6px;background:rgba(255,255,255,0.15);border-radius:3px">
            <div style="width:${expProgress}%;height:100%;background:var(--exp-blue);border-radius:3px;transition:width 0.5s"></div>
          </div>
          <span style="color:var(--accent2)">${expToNext}EXP</span>
        </div>` : '<div style="color:var(--accent3)">★ レベルMAX！</div>'}
      </div>
    </div>

    <div class="status-card">
      <div style="font-size:13px;font-weight:700;color:var(--accent2);margin-bottom:8px">📊 種族値・実数値</div>
      <div class="status-stats-grid">${statsRows}</div>
      <div style="text-align:right;font-size:12px;margin-top:8px;color:var(--text-sub)">
        合計BST: <strong style="color:var(--text-main)">${Object.values(mon.baseStats).reduce((a,b)=>a+b,0)}</strong>
      </div>
    </div>

    <div class="status-card">
      <div style="font-size:13px;font-weight:700;color:var(--accent2);margin-bottom:8px">⚔️ わざ</div>
      <div class="status-moves-grid">${movesHtml || '<div style="color:var(--text-sub)">技なし</div>'}</div>
    </div>

    <div class="status-card">
      <div style="font-size:13px;font-weight:700;color:var(--accent3);margin-bottom:8px">✨ 特性</div>
      <div class="status-ability-box">
        <div class="ability-name">${mon.ability}</div>
        <div class="ability-desc">${ability?.desc || '詳細不明'}</div>
      </div>
    </div>

    <div style="margin-bottom:8px">
      <button class="menu-btn" onclick="showEditScreen(${statusScreenIndex})" style="width:100%">⚙️ 育成設定を変更</button>
    </div>
  `;
}

function setupStatusScreenEvents() {
  document.getElementById('btn-status-back')?.addEventListener('click', () => {
    showScreen('party');
    renderPartySlots();
  });

  document.getElementById('btn-status-prev')?.addEventListener('click', () => {
    if (statusScreenIndex > 0) {
      statusScreenIndex--;
      renderStatusContent();
    }
  });

  document.getElementById('btn-status-next')?.addEventListener('click', () => {
    if (statusScreenIndex < statusScreenMonList.length - 1) {
      statusScreenIndex++;
      renderStatusContent();
    }
  });
}

// =====================================================
// 全体ステータス一覧（スクショ用）
// =====================================================
function showStatusAllScreen() {
  showScreen('status-all');
  renderStatusAllTable('id');
}

function renderStatusAllTable(sortKey = 'id') {
  if (typeof PUYUMON_DATA === 'undefined') return;

  const tbody = document.getElementById('status-all-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let entries = Object.entries(PUYUMON_DATA);

  // ソート
  entries.sort((a, b) => {
    const ba = a[1], bb = b[1];
    switch(sortKey) {
      case 'id':    return (ba.id || 0) - (bb.id || 0);
      case 'name':  return ba.name.localeCompare(bb.name, 'ja');
      case 'hp':    return (bb.baseStats?.hp || 0) - (ba.baseStats?.hp || 0);
      case 'atk':   return (bb.baseStats?.atk || 0) - (ba.baseStats?.atk || 0);
      case 'total': {
        const ta = Object.values(ba.baseStats || {}).reduce((a,b)=>a+b,0);
        const tb = Object.values(bb.baseStats || {}).reduce((a,b)=>a+b,0);
        return tb - ta;
      }
      default: return (ba.id || 0) - (bb.id || 0);
    }
  });

  entries.forEach(([id, base]) => {
    const dexEntry = Game.pokedex[id] || { seen: false, caught: false };
    const bs = base.baseStats || {};
    const total = Object.values(bs).reduce((a, b) => a + b, 0);
    const types = base.types || [];

    const row = document.createElement('tr');

    // 捕獲済みは強調
    if (dexEntry.caught) row.style.color = '#aaffaa';
    else if (dexEntry.seen) row.style.color = 'inherit';
    else row.style.opacity = '0.5';

    row.innerHTML = `
      <td>${String(base.id || 0).padStart(3, '0')}</td>
      <td style="text-align:left;white-space:nowrap">
        ${base.icon || '❓'} ${base.name}
        ${dexEntry.caught ? '<span style="color:#44dd44;font-size:10px">✓</span>' : ''}
      </td>
      <td><span class="type-badge ${getTypeClass(types[0] || 'ノーマル')}">${types[0] || '---'}</span></td>
      <td>${types[1] ? `<span class="type-badge ${getTypeClass(types[1])}">${types[1]}</span>` : '---'}</td>
      <td class="stat-cell-hp">${bs.hp || 0}</td>
      <td class="stat-cell-atk">${bs.atk || 0}</td>
      <td class="stat-cell-def">${bs.def || 0}</td>
      <td class="stat-cell-spa">${bs.spa || 0}</td>
      <td class="stat-cell-spd">${bs.spd || 0}</td>
      <td class="stat-cell-spe">${bs.spe || 0}</td>
      <td class="stat-cell-total">${total}</td>
      <td style="font-size:11px;text-align:left">${(base.abilities || []).join(' / ')}</td>
      <td style="font-size:11px">${dexEntry.caught ? 'ゲット' : dexEntry.seen ? '発見' : '未発見'}</td>
    `;

    // クリックで詳細
    row.style.cursor = 'pointer';
    row.onclick = () => {
      if (dexEntry.seen) {
        showPokedexScreen();
        setTimeout(() => onPokedexCardClick(id, base, dexEntry), 100);
      }
    };

    tbody.appendChild(row);
  });
}

function setupStatusAllEvents() {
  document.getElementById('btn-status-all')?.addEventListener('click', () => {
    showStatusAllScreen();
  });

  document.getElementById('btn-status-all-back')?.addEventListener('click', () => {
    showScreen('main');
    updateMainMenu();
  });

  document.getElementById('btn-status-all-print')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('status-all-sort')?.addEventListener('change', (e) => {
    renderStatusAllTable(e.target.value);
  });

  // テーブルヘッダークリックソート
  document.querySelectorAll('.status-all-table th').forEach((th, index) => {
    const sortKeys = ['id', 'name', null, null, 'hp', 'atk', 'def', 'spa', 'spd', 'spe', 'total', null, null];
    const key = sortKeys[index];
    if (key) {
      th.onclick = () => {
        document.getElementById('status-all-sort').value = key;
        renderStatusAllTable(key);
      };
    }
  });
}

// =====================================================
// 育成設定（技・EV・特性・持ち物）編集
// =====================================================
function showEditScreen(partyIndex) {
  showScreen('edit');
  renderEditContent(partyIndex);
}

function renderEditContent(partyIndex) {
  const mon = Game.party[partyIndex];
  if (!mon) return;

  const content = document.getElementById('edit-content');
  if (!content) return;

  const base = getPuyuMonBase(mon.speciesId);
  if (!base) return;

  // 技選択オプション
  const moveOptions = getMoveNames().map(m =>
    `<option value="${m}" ${mon.moves.includes(m) ? '' : ''}>${m}</option>`
  ).join('');

  // 特性オプション
  const abilityOptions = (base.abilities || []).concat(getAbilityNames().filter(a => !(base.abilities || []).includes(a)))
    .map(a => `<option value="${a}" ${mon.ability === a ? 'selected' : ''}>${a}</option>`).join('');

  // アイテムオプション
  const itemOptions = `<option value="">（なし）</option>` + getItemNames().map(i =>
    `<option value="${i}" ${mon.item === i ? 'selected' : ''}>${ITEMS[i]?.icon || ''} ${i}</option>`
  ).join('');

  // 性格オプション
  const natureOptions = Object.keys(NATURES).map(n =>
    `<option value="${n}" ${mon.nature === n ? 'selected' : ''}>${n}</option>`
  ).join('');

  // EV入力 (合計510まで)
  const evFields = ['hp','atk','def','spa','spd','spe'].map(key => `
    <div class="stat-edit-row">
      <label>${STAT_NAMES[key]}</label>
      <input type="range" min="0" max="252" value="${mon.evs[key]||0}"
        oninput="updateEV(${partyIndex},'${key}',this.value);document.getElementById('ev-${key}-${partyIndex}').textContent=this.value"
        style="flex:1">
      <span id="ev-${key}-${partyIndex}">${mon.evs[key]||0}</span>
      <span style="font-size:11px;color:var(--text-sub)">(実:${mon.stats[key]})</span>
    </div>
  `).join('');

  // IV入力
  const ivFields = ['hp','atk','def','spa','spd','spe'].map(key => `
    <div class="stat-edit-row">
      <label>${STAT_NAMES[key]}</label>
      <input type="range" min="0" max="31" value="${mon.ivs[key]||0}"
        oninput="updateIV(${partyIndex},'${key}',this.value);document.getElementById('iv-${key}-${partyIndex}').textContent=this.value">
      <span id="iv-${key}-${partyIndex}">${mon.ivs[key]||0}</span>
    </div>
  `).join('');

  content.innerHTML = `
    <div class="edit-section">
      <h3>🐾 基本情報 - ${base.icon || '❓'} ${mon.name}</h3>
      <div class="stat-edit-row">
        <label>ニックネーム</label>
        <input type="text" maxlength="12" value="${mon.nickname || ''}" placeholder="${mon.name}"
          style="flex:1;background:rgba(255,255,255,0.1);border:1px solid var(--border-color);border-radius:6px;color:white;font-size:14px;padding:6px"
          oninput="Game.party[${partyIndex}].nickname = this.value || null">
      </div>
      <div class="stat-edit-row">
        <label>レベル</label>
        <input type="number" min="1" max="100" value="${mon.level}"
          style="width:70px;background:rgba(255,255,255,0.1);border:1px solid var(--border-color);border-radius:6px;color:white;font-size:14px;padding:6px;text-align:center"
          onchange="setMonLevel(${partyIndex}, parseInt(this.value))">
        <button onclick="setMonLevel(${partyIndex}, Math.min(100,Game.party[${partyIndex}].level+1))"
          style="background:var(--accent1);border:none;border-radius:6px;color:white;padding:4px 10px;cursor:pointer">+1</button>
        <button onclick="setMonLevel(${partyIndex}, 100)"
          style="background:var(--accent3);border:none;border-radius:6px;color:var(--text-dark);padding:4px 10px;cursor:pointer">MAX</button>
      </div>
    </div>

    <div class="edit-section">
      <h3>⚙️ 特性・性格・持ち物</h3>
      <div class="stat-edit-row">
        <label>特性</label>
        <select class="ability-select" onchange="Game.party[${partyIndex}].ability = this.value">${abilityOptions}</select>
      </div>
      <div class="stat-edit-row">
        <label>性格</label>
        <select class="nature-select" onchange="setMonNature(${partyIndex}, this.value)">${natureOptions}</select>
      </div>
      <div class="stat-edit-row">
        <label>持ち物</label>
        <select class="item-select" onchange="Game.party[${partyIndex}].item = this.value || null">${itemOptions}</select>
      </div>
    </div>

    <div class="edit-section">
      <h3>⚔️ わざ設定</h3>
      <div class="move-slot-edit" id="move-slots-${partyIndex}">
        ${[0,1,2,3].map(i => `
          <div>
            <div style="font-size:11px;color:var(--text-sub);margin-bottom:3px">わざ${i+1}</div>
            <select class="move-select" onchange="setMonMove(${partyIndex},${i},this.value)">
              <option value="">（なし）</option>
              ${getMoveNames().map(m => `<option value="${m}" ${mon.moves[i]===m?'selected':''}>${m}</option>`).join('')}
            </select>
          </div>
        `).join('')}
      </div>
      <button onclick="learnAllMoves(${partyIndex})" style="margin-top:8px;background:rgba(255,255,255,0.1);border:1px solid var(--border-color);border-radius:8px;color:white;padding:6px 12px;cursor:pointer;font-size:12px">
        🎓 習得可能な技をランダムにセット
      </button>
    </div>

    <div class="edit-section">
      <h3>💪 努力値（EV）<span id="ev-total-${partyIndex}" style="font-size:12px;color:var(--text-sub)"> 合計: ${Object.values(mon.evs).reduce((a,b)=>a+b,0)}/510</span></h3>
      ${evFields}
      <button onclick="resetEVs(${partyIndex})" style="margin-top:6px;background:rgba(255,0,0,0.2);border:1px solid #ff4444;border-radius:6px;color:#ff4444;padding:5px 12px;cursor:pointer;font-size:12px">EVリセット</button>
      <button onclick="maxEVs(${partyIndex})" style="margin-top:6px;margin-left:6px;background:rgba(0,255,100,0.15);border:1px solid #44ff88;border-radius:6px;color:#44ff88;padding:5px 12px;cursor:pointer;font-size:12px">EV最大化（252×2）</button>
    </div>

    <div class="edit-section">
      <h3>🧬 個体値（IV）</h3>
      ${ivFields}
      <button onclick="maxIVs(${partyIndex})" style="margin-top:6px;background:rgba(0,200,255,0.15);border:1px solid #44aaff;border-radius:6px;color:#44aaff;padding:5px 12px;cursor:pointer;font-size:12px">IV全MAX（31）</button>
    </div>

    <div style="padding:0 0 8px">
      <button class="edit-save-btn" onclick="saveEditAndReturn(${partyIndex})">✅ 保存してもどる</button>
    </div>
  `;
}

function updateEV(partyIndex, stat, value) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  const v = parseInt(value) || 0;
  const total = Object.values(mon.evs).reduce((a,b) => a+b, 0) - (mon.evs[stat] || 0) + v;
  if (total > 510) return;
  mon.evs[stat] = v;
  recalcMonStats(partyIndex);
  const totalEl = document.getElementById(`ev-total-${partyIndex}`);
  if (totalEl) totalEl.textContent = ` 合計: ${Object.values(mon.evs).reduce((a,b)=>a+b,0)}/510`;
}

function updateIV(partyIndex, stat, value) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  mon.ivs[stat] = clamp(parseInt(value) || 0, 0, 31);
  recalcMonStats(partyIndex);
}

function setMonLevel(partyIndex, level) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  mon.level = clamp(level, 1, 100);
  const base = getPuyuMonBase(mon.speciesId);
  mon.exp = calcExpForLevel(base?.expGroup || 'medium', mon.level);
  recalcMonStats(partyIndex);
  renderEditContent(partyIndex);
}

function setMonNature(partyIndex, nature) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  mon.nature = nature;
  recalcMonStats(partyIndex);
}

function setMonMove(partyIndex, slot, moveName) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  if (moveName) {
    mon.moves[slot] = moveName;
    if (!mon.movePPs[moveName]) mon.movePPs[moveName] = MOVES[moveName]?.pp || 10;
  } else {
    mon.moves.splice(slot, 1);
    mon.moves = mon.moves.filter(Boolean).slice(0, 4);
  }
}

function recalcMonStats(partyIndex) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  mon.stats = calcStats(mon.baseStats, mon.level, mon.ivs, mon.evs, mon.nature);
  mon.maxHp = mon.stats.hp;
  mon.currentHp = Math.min(mon.maxHp, mon.currentHp);
}

function resetEVs(partyIndex) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  mon.evs = { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 };
  recalcMonStats(partyIndex);
  renderEditContent(partyIndex);
}

function maxEVs(partyIndex) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  // 最も有効な2つのステータスに252ずつ
  const types = mon.types;
  let primaryStat = 'atk', secondaryStat = 'spe';
  if (types.includes('エスパー') || types.includes('げんそう')) {
    primaryStat = 'spa'; secondaryStat = 'spe';
  } else if (types.includes('みず') || types.includes('ほのお')) {
    primaryStat = 'spa'; secondaryStat = 'spe';
  }
  mon.evs = { hp:6, atk:0, def:0, spa:0, spd:0, spe:0 };
  mon.evs[primaryStat] = 252;
  mon.evs[secondaryStat] = 252;
  mon.evs.hp = 4;
  recalcMonStats(partyIndex);
  renderEditContent(partyIndex);
}

function maxIVs(partyIndex) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  mon.ivs = { hp:31, atk:31, def:31, spa:31, spd:31, spe:31 };
  recalcMonStats(partyIndex);
  renderEditContent(partyIndex);
}

function learnAllMoves(partyIndex) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  const base = getPuyuMonBase(mon.speciesId);
  const learnableMoves = getLearnableMoves(base, mon.level);
  const shuffled = shuffleArray(learnableMoves);
  const selected = shuffled.slice(0, 4);
  mon.moves = selected;
  mon.movePPs = {};
  selected.forEach(m => { mon.movePPs[m] = MOVES[m]?.pp || 10; });
  renderEditContent(partyIndex);
}

function saveEditAndReturn(partyIndex) {
  recalcMonStats(partyIndex);
  showScreen('party');
  renderPartySlots();
}

function setupEditEvents() {
  document.getElementById('btn-edit-back')?.addEventListener('click', () => {
    showScreen('party');
    renderPartySlots();
  });
}
