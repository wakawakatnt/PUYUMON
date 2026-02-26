// =====================================================
// ぷゆモン - ボックスUI
// =====================================================

let boxCurrentPage = 0;
let boxSelectedSlot = -1;

function showBoxScreen() {
  showScreen('box');
  boxCurrentPage = 0;
  boxSelectedSlot = -1;
  renderBoxGrid();
  updateBoxPageNum();
}

function renderBoxGrid() {
  const grid = document.getElementById('box-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const page = Game.box[boxCurrentPage] || [];

  for (let i = 0; i < BOX_SIZE; i++) {
    const mon = page[i];
    const slot = document.createElement('div');
    slot.className = 'box-slot' + (mon ? '' : ' empty') + (i === boxSelectedSlot ? ' selected' : '');

    if (mon) {
      const base = getPuyuMonBase(mon.speciesId);
      slot.textContent = base ? base.icon : '❓';
      slot.title = `${mon.name} Lv.${mon.level}`;
      slot.onclick = () => onBoxSlotClick(i, mon);
    } else {
      slot.textContent = '';
    }
    grid.appendChild(slot);
  }
}

function onBoxSlotClick(slotIndex, mon) {
  if (!mon) return;
  boxSelectedSlot = slotIndex;
  renderBoxGrid();
  renderBoxInfo(mon);
  document.getElementById('box-actions').style.display = 'flex';
}

function renderBoxInfo(mon) {
  const infoEl = document.getElementById('box-info');
  if (!infoEl || !mon) return;

  const base = getPuyuMonBase(mon.speciesId);
  const icon = base ? base.icon : '❓';
  const types = mon.types.map(t =>
    `<span class="type-badge ${getTypeClass(t)}">${t}</span>`
  ).join(' ');

  infoEl.innerHTML = `
    <div style="display:flex;gap:10px;align-items:center">
      <div style="font-size:32px">${icon}</div>
      <div>
        <div style="font-size:15px;font-weight:700">${mon.name}</div>
        <div style="font-size:12px;color:var(--text-sub)">Lv.${mon.level} ${getGenderSymbol(mon.gender)} ${mon.isShiny ? '✨' : ''}</div>
        <div style="margin-top:4px">${types}</div>
        <div style="font-size:12px;margin-top:4px">特性: ${mon.ability}</div>
        <div style="font-size:12px">性格: ${mon.nature}</div>
        <div style="font-size:12px;margin-top:4px">HP: ${mon.currentHp}/${mon.maxHp}</div>
      </div>
    </div>
  `;
}

function updateBoxPageNum() {
  const el = document.getElementById('box-page-num');
  if (el) el.textContent = boxCurrentPage + 1;
}

function setupBoxEvents() {
  document.getElementById('btn-box-back')?.addEventListener('click', () => {
    showScreen('main');
    updateMainMenu();
  });

  document.getElementById('btn-box-prev-page')?.addEventListener('click', () => {
    if (boxCurrentPage > 0) {
      boxCurrentPage--;
      boxSelectedSlot = -1;
      renderBoxGrid();
      updateBoxPageNum();
      document.getElementById('box-info').innerHTML = '<p>ぷゆモンをえらんでください</p>';
      document.getElementById('box-actions').style.display = 'none';
    }
  });

  document.getElementById('btn-box-next-page')?.addEventListener('click', () => {
    if (boxCurrentPage < MAX_BOX_PAGES - 1) {
      boxCurrentPage++;
      boxSelectedSlot = -1;
      renderBoxGrid();
      updateBoxPageNum();
      document.getElementById('box-info').innerHTML = '<p>ぷゆモンをえらんでください</p>';
      document.getElementById('box-actions').style.display = 'none';
    }
  });

  document.getElementById('btn-box-to-party')?.addEventListener('click', () => {
    if (boxSelectedSlot < 0) return;
    const result = moveBoxToParty(boxCurrentPage, boxSelectedSlot);
    if (result) {
      showOverlayMsg('てもちに加えた！');
      document.getElementById('overlay-ok').onclick = () => {
        hideOverlay('overlay-msg');
      };
      boxSelectedSlot = -1;
      renderBoxGrid();
      document.getElementById('box-info').innerHTML = '<p>ぷゆモンをえらんでください</p>';
      document.getElementById('box-actions').style.display = 'none';
    } else {
      showOverlayMsg('てもちがいっぱい！（最大6匹）');
      document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
    }
  });

  document.getElementById('btn-box-status')?.addEventListener('click', () => {
    if (boxSelectedSlot < 0) return;
    const mon = Game.box[boxCurrentPage][boxSelectedSlot];
    if (!mon) return;
    // 一時的にパーティ最後に追加して閲覧
    statusScreenMonList = [mon];
    statusScreenIndex = 0;
    showScreen('status');
    renderStatusContent();
  });

  document.getElementById('btn-box-cancel')?.addEventListener('click', () => {
    boxSelectedSlot = -1;
    renderBoxGrid();
    document.getElementById('box-info').innerHTML = '<p>ぷゆモンをえらんでください</p>';
    document.getElementById('box-actions').style.display = 'none';
  });
}
