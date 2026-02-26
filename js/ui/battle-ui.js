// =====================================================
// ぷゆモン - バトルUI制御
// =====================================================

let battleMessageTimer = null;
let battleInputLock = false;
let messageQueue = [];
let isShowingMessage = false;

// =====================================================
// バトル画面起動
// =====================================================
function startBattleScreen(opts) {
  showScreen('battle');
  battleInputLock = true;
  messageQueue = [];
  isShowingMessage = false;

  // バトル初期化
  const success = initBattle({
    ...opts,
    onMessage: enqueueBattleMessage,
    onUIUpdate: updateBattleUI,
    onEnd: handleBattleEnd,
  });

  if (!success) {
    showScreen('main');
    return;
  }

  // UI初期化
  updateBattleUI();
  updateBattleBg();

  // バトル開始メッセージ
  const msg = opts.type === 'wild'
    ? `やせいの ${Battle.enemyMon.name} があらわれた！`
    : `${opts.trainer?.name || 'トレーナー'} が勝負を挑んできた！`;
  enqueueBattleMessage(msg);
  enqueueBattleMessage(`いけ！ ${Battle.playerMon.name}！`);

  // コマンド表示処理へ
  startMessageProcessing();
}

// =====================================================
// メッセージキュー管理
// =====================================================
function enqueueBattleMessage(msg) {
  if (!msg) return;
  messageQueue.push(msg);
  if (!isShowingMessage) processNextMessage();
}

function processNextMessage() {
  if (messageQueue.length === 0) {
    isShowingMessage = false;
    // 全メッセージ表示完了後、コマンド表示
    if (Battle && !Battle.ended) {
      if (Battle.needSwitch) {
        showSwitchCommand();
      } else {
        battleInputLock = false;
        showMainCommand();
      }
    }
    return;
  }

  isShowingMessage = true;
  const msg = messageQueue.shift();
  showBattleMessage(msg);

  // テキストスピード
  const speed = Game.settings.textSpeed === 'fast' ? 800 :
                Game.settings.textSpeed === 'slow' ? 2500 : 1400;

  battleMessageTimer = setTimeout(processNextMessage, speed);
}

function startMessageProcessing() {
  battleInputLock = true;
  setTimeout(() => {
    processNextMessage();
  }, 500);
}

function showBattleMessage(msg) {
  const el = document.getElementById('battle-message');
  if (el) el.textContent = msg;
  // カーソル
  const cursor = document.getElementById('battle-cursor');
  if (cursor) cursor.style.display = messageQueue.length > 0 ? 'block' : 'none';
}

// =====================================================
// バトルUI更新
// =====================================================
function updateBattleUI() {
  if (!Battle) return;
  updateMonUI('enemy', Battle.enemyMon);
  updateMonUI('player', Battle.playerMon);
}

function updateMonUI(side, mon) {
  if (!mon) return;

  const isEnemy = side === 'enemy';
  const prefix = isEnemy ? 'enemy' : 'player';

  // 名前
  const nameEl = document.getElementById(`${prefix}-name${isEnemy ? '' : '-battle'}`);
  if (nameEl) nameEl.textContent = mon.name;

  // レベル
  const lvEl = document.getElementById(`${prefix}-level${isEnemy ? '' : '-battle'}`);
  if (lvEl) lvEl.textContent = mon.level;

  // 性別
  const genderEl = document.getElementById(`${prefix}-gender`);
  if (genderEl) genderEl.textContent = getGenderSymbol(mon.gender);

  // 状態異常バッジ
  const statusEl = document.getElementById(`${prefix}-status${isEnemy ? '' : '-badge'}`);
  if (statusEl) {
    statusEl.textContent = getStatusText(mon.status);
    statusEl.className = 'status-badge ' + getStatusClass(mon.status);
  }

  // HPバー
  const hpRatio = mon.maxHp > 0 ? mon.currentHp / mon.maxHp : 0;
  const hpBar = document.getElementById(`${prefix}-hp-bar`);
  if (hpBar) {
    hpBar.style.width = `${Math.max(0, hpRatio * 100)}%`;
    hpBar.className = 'hp-bar-inner ' + getHpBarClass(hpRatio);
  }

  // HPテキスト
  const hpText = document.getElementById(`${prefix}-hp-text`);
  if (hpText) {
    if (!isEnemy) hpText.textContent = `HP: ${mon.currentHp} / ${mon.maxHp}`;
    else hpText.textContent = '';
  }

  // 経験値バー（プレイヤーのみ）
  if (!isEnemy) {
    const base = getPuyuMonBase(mon.speciesId);
    const expBar = document.getElementById('player-exp-bar');
    if (expBar && base) {
      const group = base.expGroup || 'medium';
      const currentLvExp = calcExpForLevel(group, mon.level);
      const nextLvExp = calcExpForLevel(group, mon.level + 1);
      const progress = mon.level >= 100 ? 1 :
        (nextLvExp > currentLvExp) ? (mon.exp - currentLvExp) / (nextLvExp - currentLvExp) : 0;
      expBar.style.width = `${Math.max(0, Math.min(100, progress * 100))}%`;
    }
  }

  // スプライト（絵文字）
  const spriteEl = document.getElementById(`${prefix}-sprite`);
  if (spriteEl) {
    const base = getPuyuMonBase(mon.speciesId);
    spriteEl.textContent = base ? base.icon : '❓';
    // シャイニーエフェクト
    if (mon.isShiny) spriteEl.style.filter = 'hue-rotate(180deg) brightness(1.2)';
    else spriteEl.style.filter = '';
  }
}

// =====================================================
// コマンド表示
// =====================================================
function showMainCommand() {
  hideAllCommandPanels();
  document.getElementById('cmd-main').classList.remove('hidden');
  const cursor = document.getElementById('battle-cursor');
  if (cursor) cursor.style.display = 'none';
}

function hideAllCommandPanels() {
  ['cmd-main','cmd-fight-panel','cmd-bag-panel','cmd-pokemon-panel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

function showSwitchCommand() {
  hideAllCommandPanels();
  renderPartyBattleList(true); // 強制交代モード
  document.getElementById('cmd-pokemon-panel').classList.remove('hidden');
}

// =====================================================
// たたかうコマンド
// =====================================================
function renderFightPanel() {
  const grid = document.getElementById('moves-grid');
  if (!grid || !Battle?.playerMon) return;
  grid.innerHTML = '';

  const mon = Battle.playerMon;
  const moves = mon.moves.slice(0, 4);

  if (moves.length === 0) {
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.textContent = 'わるあがき';
    btn.onclick = () => onMoveSelect('わるあがき');
    grid.appendChild(btn);
    return;
  }

  moves.forEach(moveName => {
    const move = MOVES[moveName];
    const pp = mon.movePPs[moveName] || 0;
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.disabled = pp <= 0;

    const typeBadge = move ? `<span class="type-badge ${getTypeClass(move.type)}">${move.type}</span>` : '';
    btn.innerHTML = `${moveName}<br><small>${typeBadge} PP:${pp}/${move?.pp || '?'}</small>`;

    if (move) {
      const typeColors = {
        'ぷゆ':'#ff6ec7','ほのお':'#e8602c','みず':'#4c90d2','くさ':'#62b945',
        'でんき':'#f4d23c','こおり':'#7dd8fb','かくとう':'#ce4265','どく':'#9f5ccf',
        'じめん':'#d97845','ひこう':'#8fa8dd','エスパー':'#f85888','むし':'#90c12c',
        'いわ':'#c7b78b','ゴースト':'#616ead','ドラゴン':'#0f6ac0','あく':'#595761',
        'はがね':'#5a8ea1','フェアリー':'#ef70ef','ノーマル':'#9899a1',
        'ハイパー':'#ff3300','カオス':'#333','しれい':'#8b0000','げんそう':'#9966cc',
      };
      btn.style.borderColor = typeColors[move.type] || '#9966cc';
    }

    btn.onclick = () => onMoveSelect(moveName, move);
    grid.appendChild(btn);
  });
}

function onMoveSelect(moveName, move) {
  if (move) {
    document.getElementById('move-type-display').textContent = move.type;
    document.getElementById('move-pp-display').textContent = `${Battle.playerMon.movePPs[moveName] || 0}/${move.pp}`;
    document.getElementById('move-power-display').textContent = move.power > 0 ? move.power : '---';
  }
  if (Battle._selectedMove === moveName) {
    executePlayerMove(moveName);
  } else {
    Battle._selectedMove = moveName;
    setTimeout(() => {
      if (Battle._selectedMove === moveName) executePlayerMove(moveName);
    }, 600);
  }
}

async function executePlayerMove(moveName) {
  if (battleInputLock || !Battle || Battle.ended) return;
  battleInputLock = true;
  Battle._selectedMove = null;
  hideAllCommandPanels();
  await executeTurn('move', moveName);
  if (!Battle?.ended) processNextMessage();
}

// =====================================================
// どうぐコマンド
// =====================================================
function renderBagPanel() {
  const listEl = document.getElementById('bag-list');
  if (!listEl) return;

  const activeTab = document.querySelector('.bag-tab.active')?.dataset?.tab || 'medicine';
  const catMap = { battle: ['battle'], medicine: ['medicine'], ball: ['ball'], other: ['held','stone','other'] };
  const cats = catMap[activeTab] || ['medicine'];

  listEl.innerHTML = '';
  let hasItems = false;

  Object.entries(Game.bag).forEach(([itemName, count]) => {
    if (count <= 0) return;
    const item = ITEMS[itemName];
    if (!item || !cats.includes(item.category)) return;
    hasItems = true;

    const btn = document.createElement('button');
    btn.className = 'bag-item-btn';
    btn.innerHTML = `<span>${item.icon || '📦'} ${itemName}</span><span>×${count}</span>`;
    btn.onclick = () => onBagItemSelect(itemName);
    listEl.appendChild(btn);
  });

  if (!hasItems) {
    listEl.innerHTML = '<div style="padding:8px;color:#888;">アイテムがない</div>';
  }
}

function onBagItemSelect(itemName) {
  const item = ITEMS[itemName];
  if (!item) return;

  if (item.category === 'ball') {
    executePlayerBall(itemName);
  } else {
    executePlayerItem(itemName);
  }
}

async function executePlayerItem(itemName) {
  if (battleInputLock || !Battle) return;
  battleInputLock = true;
  hideAllCommandPanels();
  await executeTurn('item', itemName);
  if (!Battle?.ended) processNextMessage();
}

// =====================================================
// ボール投擲・捕獲処理
// =====================================================
async function executePlayerBall(ballName) {
  if (battleInputLock || !Battle) return;
  battleInputLock = true;
  hideAllCommandPanels();

  const item = ITEMS[ballName];
  if (!item || !Game.bag[ballName]) {
    battleInputLock = false;
    return;
  }
  
  Game.bag[ballName]--;
  enqueueBattleMessage(`${Game.player.name} は ${ballName} を投げた！`);

  const catchRate = calcCatchProbability(Battle.enemyMon, ballName, Battle.turn);
  let caught = true;
  
  // 3回揺れる判定のシミュレート
  for(let i=0; i<3; i++) {
     if (Math.random() > catchRate && catchRate < 1) {
         caught = false;
         break;
     }
  }

  if (!caught) {
     enqueueBattleMessage('だめだ！ ぷゆモンが ボールから抜け出した！');
     // 捕獲失敗時は敵のターンを実行する
     const enemyAction = decideEnemyAction();
     await executeAction('enemy', enemyAction);
     if (!Battle.ended) await processTurnEnd();
  } else {
     enqueueBattleMessage(`やったー！ ${Battle.enemyMon.name} を捕まえたぞ！`);
     catchPuyuMon(Battle.enemyMon.speciesId);
     const result = addToBox(Battle.enemyMon);
     if (result) {
         enqueueBattleMessage(`${Battle.enemyMon.name} は ボックスに転送された！`);
     } else {
         enqueueBattleMessage(`ボックスがいっぱいで 逃がしてしまった…`);
     }
     Battle.captured = true;
     endBattle('captured');
  }

  if (!Battle?.ended) processNextMessage();
}

// =====================================================
// ぷゆモン交代コマンド
// =====================================================
function renderPartyBattleList(forceSwitch = false) {
  const listEl = document.getElementById('party-battle-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  Game.party.forEach((mon, index) => {
    if (!mon) return;
    const btn = document.createElement('button');
    btn.className = 'party-battle-slot';
    const hpRatio = mon.maxHp > 0 ? mon.currentHp / mon.maxHp : 0;
    const base = getPuyuMonBase(mon.speciesId);
    const icon = base ? base.icon : '❓';

    const isCurrent = index === Battle.playerPartyIndex;
    const isFainted = mon.currentHp <= 0;

    if (isCurrent || isFainted) btn.disabled = true;
    btn.style.opacity = (isCurrent || isFainted) ? '0.5' : '1';

    btn.innerHTML = `
      <span class="pbs-icon">${icon}</span>
      <div class="pbs-info">
        <div>${mon.name}${mon.isShiny ? ' ✨' : ''} ${isCurrent ? '（バトル中）' : isFainted ? '（ひんし）' : ''}</div>
        <div class="pbs-hp">Lv.${mon.level} HP:${mon.currentHp}/${mon.maxHp}</div>
        <div style="width:80px;height:4px;background:#ddd;border-radius:2px;margin-top:2px;">
          <div style="width:${hpRatio*100}%;height:100%;border-radius:2px;background:${hpRatio>0.5?'#44dd44':hpRatio>0.25?'#ffdd00':'#ff3344'}"></div>
        </div>
      </div>
      <span class="status-badge ${getStatusClass(mon.status)}">${getStatusText(mon.status)}</span>
    `;

    btn.onclick = () => onPartySwitchSelect(index, forceSwitch);
    listEl.appendChild(btn);
  });
}

async function onPartySwitchSelect(partyIndex, forceSwitch) {
  if (!Battle) return;
  if (Battle.party?.[partyIndex]?.currentHp <= 0) return;
  if (battleInputLock && !forceSwitch) return;

  battleInputLock = true;
  hideAllCommandPanels();

  if (forceSwitch) {
    const newMon = Game.party[partyIndex];
    resetBattleMonState(Battle.playerMon);
    Battle.playerPartyIndex = partyIndex;
    Battle.playerMon = newMon;
    triggerAbilityOnEntry(newMon, Battle);
    enqueueBattleMessage(`いけ！${newMon.name}！`);
    Battle.needSwitch = false;
    updateBattleUI();
    processNextMessage();
  } else {
    await executeTurn('switch', partyIndex);
    if (!Battle?.ended) processNextMessage();
  }
}

// =====================================================
// にげるコマンド
// =====================================================
async function executeRun() {
  if (battleInputLock || !Battle) return;
  battleInputLock = true;
  hideAllCommandPanels();
  await executeTurn('run', null);
  if (!Battle?.ended) processNextMessage();
}

// =====================================================
// バトル背景とアニメーション
// =====================================================
function updateBattleBg() {
  const bg = document.getElementById('battle-bg');
  if (!bg) return;
  const bgs = [
    'linear-gradient(180deg, #87CEEB 0%, #87CEEB 50%, #4a7a2a 50%, #3a5a1a 100%)',
    'linear-gradient(180deg, #1a1a2e 0%, #1a1a2e 50%, #2a2a1a 50%, #1a1a0a 100%)',
    'linear-gradient(180deg, #ffd700 0%, #87CEEB 40%, #c8a050 60%, #8b6914 100%)',
    'linear-gradient(180deg, #4466aa 0%, #334488 45%, #4a5a6a 45%, #3a4a5a 100%)',
  ];
  const idx = Math.floor(Math.random() * bgs.length);
  bg.style.background = bgs[idx];
}

function animateAttack(side) {
  const el = document.getElementById(side === 'player' ? 'player-sprite' : 'enemy-sprite');
  if (el) {
    el.classList.add('attacking');
    setTimeout(() => el.classList.remove('attacking'), 400);
  }
}

function animateDamage(side) {
  const el = document.getElementById(side === 'player' ? 'player-sprite' : 'enemy-sprite');
  if (el) {
    el.classList.add('taking-damage');
    setTimeout(() => el.classList.remove('taking-damage'), 400);
  }
}

function animateFaint(side) {
  const el = document.getElementById(side === 'player' ? 'player-sprite' : 'enemy-sprite');
  if (el) {
    el.classList.add('fainting');
  }
}

// =====================================================
// バトル終了処理
// =====================================================
function handleBattleEnd(result) {
  battleInputLock = true;

  const checkEnd = () => {
    if (messageQueue.length > 0 || isShowingMessage) {
      setTimeout(checkEnd, 500);
      return;
    }
    
    hideAllCommandPanels();
    if (result === 'win') {
      showOverlayMsg(`🎉 バトルに勝った！\n${Battle.trainer ? `${Battle.trainer.name}に勝利！` : ''}`);
    } else if (result === 'lose') {
      showOverlayMsg(`😭 全てのぷゆモンがたおれた…\nお金が少し減った。\nぷゆモンは全回復した。`);
      Game.party.forEach(m => { if(m) m.currentHp = m.maxHp; });
    } else if (result === 'escaped') {
      showOverlayMsg('💨 逃げ出した！');
    } else if (result === 'captured') {
      const mon = Battle.enemyMon;
      showOverlayMsg(`🎉 ${mon.name} を捕まえた！\n図鑑に登録された！`);
    }

    document.getElementById('overlay-ok').onclick = () => {
      hideOverlay('overlay-msg');
      // 倒れたスプライトをリセット
      document.querySelectorAll('.battle-sprite').forEach(el => el.classList.remove('fainting'));
      showScreen('main');
      updateMainMenu();
      Battle = null;
    };
  };

  setTimeout(checkEnd, 500);
}

// =====================================================
// バトルUI イベントリスナー設定
// =====================================================
function setupBattleUIEvents() {
  document.getElementById('cmd-fight')?.addEventListener('click', () => {
    if (battleInputLock || !Battle?.playerMon) return;
    renderFightPanel();
    hideAllCommandPanels();
    document.getElementById('cmd-fight-panel').classList.remove('hidden');
  });

  document.getElementById('cmd-fight-back')?.addEventListener('click', () => {
    hideAllCommandPanels();
    showMainCommand();
  });

  document.getElementById('cmd-bag')?.addEventListener('click', () => {
    if (battleInputLock) return;
    renderBagPanel();
    hideAllCommandPanels();
    document.getElementById('cmd-bag-panel').classList.remove('hidden');
  });

  document.getElementById('cmd-bag-back')?.addEventListener('click', () => {
    hideAllCommandPanels();
    showMainCommand();
  });

  document.querySelectorAll('.bag-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.bag-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderBagPanel();
    });
  });

  document.getElementById('cmd-pokemon')?.addEventListener('click', () => {
    if (battleInputLock) return;
    renderPartyBattleList(false);
    hideAllCommandPanels();
    document.getElementById('cmd-pokemon-panel').classList.remove('hidden');
  });

  document.getElementById('cmd-pokemon-back')?.addEventListener('click', () => {
    hideAllCommandPanels();
    showMainCommand();
  });

  document.getElementById('cmd-run')?.addEventListener('click', () => {
    if (battleInputLock) return;
    executeRun();
  });

  document.getElementById('battle-message-box')?.addEventListener('click', () => {
    if (battleMessageTimer) {
      clearTimeout(battleMessageTimer);
      processNextMessage();
    }
  });
}
