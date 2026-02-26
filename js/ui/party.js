// =====================================================
// ぷゆモン - パーティ管理UI
// =====================================================

let selectedPartyIndex = -1;
let switchFromIndex = -1;

function showPartyScreen() {
  showScreen('party');
  selectedPartyIndex = -1;
  renderPartySlots();
  document.getElementById('party-detail').innerHTML = '<p class="hint" style="color:var(--text-sub);padding:8px;">ぷゆモンをえらんでください</p>';
  document.getElementById('party-actions').style.display = 'none';
}

function renderPartySlots() {
  const container = document.getElementById('party-slots');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < MAX_PARTY; i++) {
    const mon = Game.party[i];
    const slot = document.createElement('div');
    slot.className = 'party-slot' + (mon ? '' : ' empty') + (i === selectedPartyIndex ? ' selected' : '');

    if (mon) {
      const hpRatio = mon.maxHp > 0 ? mon.currentHp / mon.maxHp : 0;
      const base = getPuyuMonBase(mon.speciesId);
      const icon = base ? base.icon : '❓';
      const hpColor = hpRatio > 0.5 ? 'var(--hp-green)' : hpRatio > 0.25 ? 'var(--hp-yellow)' : 'var(--hp-red)';

      slot.innerHTML = `
        <div class="slot-icon">${icon}${mon.isShiny ? ' ✨' : ''}</div>
        <div class="slot-info">
          <div class="slot-name">${mon.nickname || mon.name} ${getGenderSymbol(mon.gender)}</div>
          <div class="slot-level">Lv.${mon.level} ${mon.status ? `<span class="status-badge ${getStatusClass(mon.status)}">${getStatusText(mon.status)}</span>` : ''}</div>
          <div class="slot-status">
            <div class="slot-hp-bar"><div class="slot-hp-fill" style="width:${hpRatio*100}%;background:${hpColor}"></div></div>
            <span class="slot-hp-text">${mon.currentHp}/${mon.maxHp}</span>
          </div>
        </div>
        <div style="font-size:12px;color:var(--text-sub);text-align:right">
          ${mon.types.map(t=>`<span class="type-badge ${getTypeClass(t)}">${t}</span>`).join('')}
        </div>
      `;

      slot.onclick = () => onPartySlotClick(i);
    } else {
      slot.innerHTML = `<div class="slot-icon" style="opacity:0.3">➕</div><div class="slot-info" style="color:var(--text-sub)">（あきスペース）</div>`;
    }
    container.appendChild(slot);
  }
}

function onPartySlotClick(index) {
  const mon = Game.party[index];
  if (!mon) return;

  if (switchFromIndex >= 0) {
    // 入れ替えモード
    if (switchFromIndex !== index) {
      swapParty(switchFromIndex, index);
      renderPartySlots();
      addMessage && addMessage(`${Game.party[index].name}と${Game.party[switchFromIndex] ? Game.party[switchFromIndex].name : ''}を入れ替えた！`);
    }
    switchFromIndex = -1;
    selectedPartyIndex = -1;
    renderPartySlots();
    document.getElementById('party-actions').style.display = 'none';
    return;
  }

  selectedPartyIndex = index;
  renderPartySlots();
  showPartyMonDetail(mon);
  document.getElementById('party-actions').style.display = 'flex';
}

function showPartyMonDetail(mon) {
  const detail = document.getElementById('party-detail');
  if (!detail) return;
  const base = getPuyuMonBase(mon.speciesId);
  const icon = base ? base.icon : '❓';

  const types = mon.types.map(t => `<span class="type-badge ${getTypeClass(t)}">${t}</span>`).join(' ');

  const statsHtml = Object.entries(mon.stats).map(([key, val]) => {
    if (key === 'hp') return '';
    const barW = getStatBarWidth(key, val);
    return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
      <span style="min-width:56px;font-size:11px;color:var(--text-sub)">${STAT_NAMES[key]}</span>
      <div style="flex:1;height:5px;background:rgba(255,255,255,0.15);border-radius:3px;">
        <div style="width:${barW}%;height:100%;background:var(--accent2);border-radius:3px;"></div>
      </div>
      <span style="min-width:30px;font-size:12px;text-align:right;font-weight:700">${val}</span>
    </div>`;
  }).join('');

  detail.innerHTML = `
    <div style="display:flex;gap:12px;align-items:flex-start;">
      <div style="font-size:40px;line-height:1">${icon}</div>
      <div style="flex:1">
        <div style="font-size:16px;font-weight:800;">${mon.nickname || mon.name}</div>
        <div style="font-size:12px;color:var(--text-sub);">No.${base?.id || '?'} / Lv.${mon.level}</div>
        <div style="margin:4px 0">${types}</div>
        <div style="font-size:12px;color:var(--text-sub)">特性: ${mon.ability} / 性格: ${mon.nature}</div>
        <div style="font-size:12px;color:var(--text-sub)">HP: ${mon.currentHp} / ${mon.maxHp}</div>
      </div>
    </div>
    <div style="margin-top:8px">${statsHtml}</div>
    <div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap">
      ${mon.moves.map(m => {
        const move = MOVES[m];
        return `<span style="background:rgba(255,255,255,0.08);border-radius:6px;padding:3px 8px;font-size:11px;">
          ${m} <span class="type-badge ${getTypeClass(move?.type||'ノーマル')}" style="font-size:9px">${move?.type||'?'}</span>
          <span style="color:var(--text-sub)">${mon.movePPs[m]||0}/${move?.pp||'?'}PP</span>
        </span>`;
      }).join('')}
    </div>
  `;
}

function setupPartyEvents() {
  document.getElementById('btn-party-back')?.addEventListener('click', () => {
    showScreen('main');
    updateMainMenu();
  });

  document.getElementById('btn-party-status')?.addEventListener('click', () => {
    if (selectedPartyIndex < 0) return;
    showStatusScreen(selectedPartyIndex);
  });

  document.getElementById('btn-party-moves')?.addEventListener('click', () => {
    if (selectedPartyIndex < 0) return;
    showEditScreen(selectedPartyIndex);
  });

  document.getElementById('btn-party-switch')?.addEventListener('click', () => {
    if (selectedPartyIndex < 0) return;
    switchFromIndex = selectedPartyIndex;
    showOverlayMsg(`入れ替え先のぷゆモンを\n選んでください`);
    document.getElementById('overlay-ok').onclick = () => {
      hideOverlay('overlay-msg');
    };
  });

  document.getElementById('btn-party-cancel')?.addEventListener('click', () => {
    selectedPartyIndex = -1;
    switchFromIndex = -1;
    renderPartySlots();
    document.getElementById('party-actions').style.display = 'none';
  });
}
