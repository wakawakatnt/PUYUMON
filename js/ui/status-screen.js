// =====================================================
// ぷゆモン - ステータス詳細 & 全体一覧 & 育成画面
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
  const nextLvExp = calcExpForLevel(group, mon.level + 1);
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
      <button class="menu-btn" onclick="showEditScreen(${statusScreenIndex})" style="width:100%">⚙️ 育成・技いれかえ</button>
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
// 育成設定（技入れ替え・EV強化）独自UI
// =====================================================
let editSelectedMoveSlot = -1;

function showEditScreen(partyIndex) {
  showScreen('edit');
  editSelectedMoveSlot = -1;
  renderEditContent(partyIndex);
}

function renderEditContent(partyIndex) {
  const mon = Game.party[partyIndex];
  if (!mon) return;

  const content = document.getElementById('edit-content');
  if (!content) return;

  const base = getPuyuMonBase(mon.speciesId);
  if (!base) return;

  // 習得可能な技リストを取得（現在のレベルまでに覚えられる技のみ）
  const learnableMoves = getLearnableMoves(base, mon.level);

  // 個体値(IV)表示
  const ivHtml = ['hp','atk','def','spa','spd','spe']
    .map(key => `<span style="display:inline-block;width:30px">${mon.ivs[key]}</span>`)
    .join(' ');

  // 努力値(EV)とドーピングアイテムボタン
  const evHtml = ['hp','atk','def','spa','spd','spe'].map(key => {
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:6px 10px; border-radius:6px;">
        <span style="font-size:13px; font-weight:bold; width:70px;">${STAT_NAMES[key]}</span>
        <span style="font-size:14px; font-weight:bold; color:var(--accent2); width:40px; text-align:right;">${mon.evs[key]||0}</span>
        <span style="font-size:11px; color:var(--text-sub); width:50px; text-align:right;">(実:${mon.stats[key]})</span>
        <div style="flex:1; text-align:right;">
          ${getEvItemButtonHtml(partyIndex, key)}
        </div>
      </div>
    `;
  }).join('');

  // 独自UI: 技スロット
  const moveSlotsHtml = [0,1,2,3].map(i => {
    const m = mon.moves[i];
    const isSelected = editSelectedMoveSlot === i;
    return `
      <div class="edit-move-slot ${isSelected ? 'selected' : ''} ${!m ? 'empty' : ''}" onclick="selectEditMoveSlot(${partyIndex}, ${i})">
        ${m ? `<strong>${m}</strong><br><span style="font-size:11px; color:var(--text-sub);">${MOVES[m]?.type || '?'} / PP ${MOVES[m]?.pp || '?'}</span>` : '（スロットあき）'}
      </div>
    `;
  }).join('');

  // 独自UI: 習得可能な技プール
  const movePoolHtml = learnableMoves.map(m => {
    const isEquipped = mon.moves.includes(m);
    return `
      <button class="edit-pool-btn ${isEquipped ? 'equipped' : ''}" onclick="learnMoveToSlot(${partyIndex}, '${m}')" ${isEquipped ? 'disabled' : ''}>
        ${m} <span style="font-size:10px">(${MOVES[m]?.type || 'ノーマル'})</span>
      </button>
    `;
  }).join('');

  content.innerHTML = `
    <div class="edit-section">
      <h3>🐾 個体情報 (固定)</h3>
      <div style="font-size:13px; line-height:1.6;">
        <span style="color:var(--accent3)">Lv.${mon.level}</span> ${base.icon} ${mon.name} <br>
        特性: <strong>${mon.ability}</strong> / 性格: <strong>${mon.nature}</strong><br>
        <span style="font-size:11px; color:var(--text-sub);">個体値(IV): ${ivHtml}</span>
      </div>
    </div>

    <div class="edit-section">
      <h3>⚔️ 技のいれかえ</h3>
      <p style="font-size:11px; color:var(--text-sub); margin-bottom:8px;">
        入れ替えたいスロットをタップして選択し、下のリストから技を選んでください。
      </p>
      <div class="edit-move-slots-grid">
        ${moveSlotsHtml}
      </div>
      <div class="edit-move-pool">
        ${movePoolHtml}
      </div>
    </div>

    <div class="edit-section">
      <h3>💪 努力値(EV)の強化 <span style="font-size:12px; color:var(--text-sub);">合計: ${Object.values(mon.evs).reduce((a,b)=>a+b,0)}/510</span></h3>
      <p style="font-size:11px; color:var(--text-sub); margin-bottom:8px;">ショップで買った薬を使ってステータスの基礎値を上げます。</p>
      <div style="display:flex; flex-direction:column; gap:4px;">
        ${evHtml}
      </div>
    </div>

    <div style="padding:0 0 8px; margin-top:10px;">
      <button class="edit-save-btn" onclick="saveEditAndReturn(${partyIndex})">✅ おわる</button>
    </div>
  `;
}

// EVアップアイテムボタン生成
function getEvItemButtonHtml(partyIndex, statKey) {
  const itemMap = { hp: 'マックスアップ', atk: 'タウリン', def: 'ブロムヘキシン', spa: 'リゾチウム', spd: 'キトサン', spe: 'インドメタシン' };
  const itemName = itemMap[statKey];
  const count = Game.bag[itemName] || 0;
  if (count > 0) {
    return `<button class="ev-up-btn" onclick="useEvItem(${partyIndex}, '${itemName}', '${statKey}')">${itemName}使う(持:${count})</button>`;
  } else {
    return `<button class="ev-up-btn disabled" disabled>${itemName}なし</button>`;
  }
}

// 努力値アイテム使用ロジック
function useEvItem(partyIndex, itemName, statKey) {
  const mon = Game.party[partyIndex];
  if (!mon || !Game.bag[itemName]) return;
  
  const currentTotal = Object.values(mon.evs).reduce((a, b) => a + b, 0);
  if (currentTotal >= 510) {
    showOverlayMsg('努力値の合計が限界(510)に達しています！');
    return;
  }
  if (mon.evs[statKey] >= 252) {
    showOverlayMsg('このステータスはこれ以上薬で上がりません！');
    return;
  }

  // アイテム消費
  Game.bag[itemName]--;
  
  // 上昇量計算 (最大10。ただし上限252、合計上限510を超えないように調整)
  let gain = 10;
  if (mon.evs[statKey] + gain > 252) gain = 252 - mon.evs[statKey];
  if (currentTotal + gain > 510) gain = 510 - currentTotal;
  
  mon.evs[statKey] += gain;
  recalcMonStats(partyIndex);
  
  renderEditContent(partyIndex);
}

// 技スロット選択
function selectEditMoveSlot(partyIndex, slotIndex) {
  editSelectedMoveSlot = slotIndex;
  renderEditContent(partyIndex);
}

// 技のセット
function learnMoveToSlot(partyIndex, moveName) {
  if (editSelectedMoveSlot < 0 || editSelectedMoveSlot > 3) {
    showOverlayMsg('まずは上の4つの枠から\n入れ替えたい場所をタップしてください。');
    return;
  }
  const mon = Game.party[partyIndex];
  if (!mon) return;

  if (mon.moves.includes(moveName)) return;

  mon.moves[editSelectedMoveSlot] = moveName;
  mon.movePPs[moveName] = MOVES[moveName]?.pp || 10;

  // 空きを詰める
  mon.moves = mon.moves.filter(Boolean);

  editSelectedMoveSlot = -1;
  renderEditContent(partyIndex);
}

function recalcMonStats(partyIndex) {
  const mon = Game.party[partyIndex];
  if (!mon) return;
  mon.stats = calcStats(mon.baseStats, mon.level, mon.ivs, mon.evs, mon.nature);
  mon.maxHp = mon.stats.hp;
  mon.currentHp = Math.min(mon.maxHp, mon.currentHp);
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
