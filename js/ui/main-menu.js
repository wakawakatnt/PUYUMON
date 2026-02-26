// =====================================================
// ぷゆモン - メインメニューUI
// =====================================================

// =====================================================
// 画面切り替え
// =====================================================
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${screenId}`);
  if (target) target.classList.add('active');
}

// =====================================================
// メインメニュー更新
// =====================================================
function updateMainMenu() {
  // プレイヤー名
  const nameEl = document.getElementById('main-player-name');
  if (nameEl) nameEl.textContent = Game.player.name;

  // トレーナーレベル
  const lvEl = document.getElementById('main-trainer-level');
  if (lvEl) lvEl.textContent = Game.player.trainerLevel;

  // 所持金
  const moneyEl = document.getElementById('main-money');
  if (moneyEl) moneyEl.textContent = Game.player.money.toLocaleString();

  // バッジ
  const badgeEl = document.getElementById('badge-display');
  if (badgeEl) {
    badgeEl.innerHTML = Game.player.badges.map(b =>
      `<span class="gym-badge" title="${b}">${b}</span>`
    ).join('');
  }
}

// =====================================================
// オーバーレイ / ダイアログ
// =====================================================
function showOverlayMsg(text) {
  const overlay = document.getElementById('overlay-msg');
  const textEl = document.getElementById('overlay-text');
  if (overlay) overlay.classList.remove('hidden');
  if (textEl) textEl.textContent = text;
}

function hideOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

function showConfirm(text, onYes, onNo) {
  const overlay = document.getElementById('overlay-confirm');
  const textEl = document.getElementById('confirm-text');
  if (!overlay || !textEl) return;

  textEl.textContent = text;
  overlay.classList.remove('hidden');

  document.getElementById('confirm-yes').onclick = () => {
    overlay.classList.add('hidden');
    if (onYes) onYes();
  };
  document.getElementById('confirm-no').onclick = () => {
    overlay.classList.add('hidden');
    if (onNo) onNo();
  };
}

// =====================================================
// セーブ/ロードUI
// =====================================================
function showSaveUI() {
  const result = saveGame(0);
  if (result) {
    showOverlayMsg('💾 セーブしました！');
    document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
  } else {
    showOverlayMsg('セーブに失敗しました…');
    document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
  }
}

function showLoadUI() {
  const slots = getSaveSlots();
  const slotInfo = slots.map((s, i) => {
    if (!s) return `スロット${i+1}: データなし`;
    return `スロット${i+1}: ${s.playerName} | バッジ×${s.badges} | ${formatPlayTime(s.playTime)}`;
  }).join('\n');

  showConfirm(`ロードしますか？\n（スロット1からロード）\n\n${slotInfo}`,
    () => {
      const result = loadGame(0);
      if (result) {
        showOverlayMsg('📂 ロードしました！');
        document.getElementById('overlay-ok').onclick = () => {
          hideOverlay('overlay-msg');
          showScreen('main');
          updateMainMenu();
        };
      } else {
        showOverlayMsg('ロードに失敗しました。\nセーブデータが見つからない？');
        document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
      }
    },
    null
  );
}

// =====================================================
// バトル選択UI
// =====================================================
function showBattleSelectScreen() {
  showScreen('battle-select');
}

function startWildBattle() {
  if (Game.party.length === 0) {
    showOverlayMsg('てもちにぷゆモンがいない！');
    document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
    return;
  }

  // レベルゾーンはバッジ数で決まる
  const badgeCount = Game.player.badges.length;
  const areaLevel = Math.max(3, badgeCount * 8 + 5);

  const wildMon = generateWildMon(areaLevel);
  if (!wildMon) {
    showOverlayMsg('野生のぷゆモンが見つからない…\n（データが読み込まれていない可能性あり）');
    document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
    return;
  }

  startBattleScreen({
    type: 'wild',
    enemyMon: wildMon,
  });
}

function startTrainerBattle(trainerIndex) {
  if (Game.party.length === 0) {
    showOverlayMsg('てもちにぷゆモンがいない！');
    document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
    return;
  }

  const trainer = TRAINERS[trainerIndex] || TRAINERS[0];
  const enemyParty = buildTrainerParty(trainer);

  if (enemyParty.length === 0) {
    showOverlayMsg('トレーナーのぷゆモンが見つからない…');
    document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
    return;
  }

  startBattleScreen({
    type: 'trainer',
    trainer,
    enemyMon: enemyParty,
  });
}

function startGymBattle(gymIndex) {
  if (Game.party.length === 0) {
    showOverlayMsg('てもちにぷゆモンがいない！');
    document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
    return;
  }

  const gym = GYMS[gymIndex];
  if (!gym) return;

  const enemyParty = gym.leaderParty.map(p =>
    createPuyuMon(p.speciesId, p.level, { originalTrainer: gym.leader.name })
  ).filter(Boolean);

  if (enemyParty.length === 0) {
    showOverlayMsg('ジムリーダーのぷゆモンが見つからない…');
    document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
    return;
  }

  startBattleScreen({
    type: 'gym',
    trainer: { name: gym.leader.name, reward: gym.reward },
    gym,
    enemyMon: enemyParty,
  });
}

// =====================================================
// バトル選択ダイアログ（トレーナー選択）
// =====================================================
function showTrainerSelectDialog() {
  const overlay = document.getElementById('overlay-msg');
  const textEl = document.getElementById('overlay-text');
  const okBtn = document.getElementById('overlay-ok');
  if (!overlay) return;

  overlay.classList.remove('hidden');

  // カスタムコンテンツ
  const content = TRAINERS.map((t, i) =>
    `<button onclick="hideOverlay('overlay-msg');startTrainerBattle(${i})"
      style="display:block;width:100%;margin-bottom:6px;padding:8px;background:rgba(255,255,255,0.1);border:1px solid var(--border-color);border-radius:8px;color:white;cursor:pointer;text-align:left;font-family:inherit;font-size:13px">
      ${t.icon} Lv.${t.level} ${t.name}<br>
      <span style="font-size:11px;color:var(--text-sub)">${t.party.length}匹 / 報酬 ${t.reward}P</span>
    </button>`
  ).join('');

  if (textEl) textEl.innerHTML = `<div style="font-size:15px;font-weight:700;margin-bottom:10px">🧑 トレーナーを選ぼう</div>${content}`;
  if (okBtn) {
    okBtn.textContent = 'キャンセル';
    okBtn.onclick = () => {
      hideOverlay('overlay-msg');
      okBtn.textContent = 'OK';
    };
  }
}

function showGymSelectDialog() {
  const overlay = document.getElementById('overlay-msg');
  const textEl = document.getElementById('overlay-text');
  const okBtn = document.getElementById('overlay-ok');
  if (!overlay) return;

  overlay.classList.remove('hidden');

  const content = GYMS.map((g, i) => {
    const hasBadge = Game.player.badges.includes(g.badge);
    return `<button onclick="hideOverlay('overlay-msg');startGymBattle(${i})"
      style="display:block;width:100%;margin-bottom:6px;padding:8px;background:${hasBadge?'rgba(100,200,100,0.1)':'rgba(255,255,255,0.1)'};border:1px solid ${hasBadge?'#44aa44':'var(--border-color)'};border-radius:8px;color:white;cursor:pointer;text-align:left;font-family:inherit;font-size:13px">
      ${g.icon} ${g.name}<br>
      <span style="font-size:11px;color:var(--text-sub)">タイプ: ${g.specialtyType} / バッジ: ${g.badge} ${hasBadge?'✅':''}</span>
    </button>`;
  }).join('');

  if (textEl) textEl.innerHTML = `<div style="font-size:15px;font-weight:700;margin-bottom:10px">🏛️ ジムを選ぼう</div>${content}`;
  if (okBtn) {
    okBtn.textContent = 'キャンセル';
    okBtn.onclick = () => {
      hideOverlay('overlay-msg');
      okBtn.textContent = 'OK';
    };
  }
}

// =====================================================
// メインメニューイベント設定
// =====================================================
function setupMainMenuEvents() {
  // バトルボタン
  document.getElementById('btn-battle')?.addEventListener('click', showBattleSelectScreen);

  // バトル選択
  document.getElementById('btn-wild-battle')?.addEventListener('click', () => {
    showScreen('main');
    startWildBattle();
  });
  document.getElementById('btn-trainer-battle')?.addEventListener('click', () => {
    showScreen('main');
    showTrainerSelectDialog();
  });
  document.getElementById('btn-gym-battle')?.addEventListener('click', () => {
    showScreen('main');
    showGymSelectDialog();
  });
  document.getElementById('btn-battle-back')?.addEventListener('click', () => {
    showScreen('main');
  });

  // パーティ
  document.getElementById('btn-party')?.addEventListener('click', showPartyScreen);

  // ボックス
  document.getElementById('btn-box')?.addEventListener('click', showBoxScreen);

  // 図鑑
  document.getElementById('btn-pokedex')?.addEventListener('click', showPokedexScreen);

  // ショップ
  document.getElementById('btn-shop')?.addEventListener('click', showShopScreen);

  // 全体ステータス
  document.getElementById('btn-status-all')?.addEventListener('click', showStatusAllScreen);

  // セーブ
  document.getElementById('btn-save')?.addEventListener('click', showSaveUI);

  // ロード
  document.getElementById('btn-load')?.addEventListener('click', showLoadUI);

  // オーバーレイ
  document.getElementById('overlay-ok')?.addEventListener('click', () => {
    hideOverlay('overlay-msg');
  });
}

// =====================================================
// タイトル画面
// =====================================================
function setupTitleEvents() {
  document.getElementById('btn-new-game')?.addEventListener('click', () => {
    showScreen('name-input');
    document.getElementById('player-name-input').focus();
  });

  document.getElementById('btn-continue')?.addEventListener('click', () => {
    if (!hasSaveData()) {
      showOverlayMsg('セーブデータが見つかりません…');
      document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
      return;
    }
    const result = loadGame(0);
    if (result) {
      showScreen('main');
      updateMainMenu();
    } else {
      showOverlayMsg('ロードに失敗しました。');
      document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
    }
  });

  document.getElementById('btn-pokedex-title')?.addEventListener('click', () => {
    showPokedexScreen();
  });

  // 名前入力
  document.getElementById('btn-name-ok')?.addEventListener('click', () => {
    const name = document.getElementById('player-name-input')?.value?.trim() || 'トレーナー';
    if (name.length === 0) {
      showOverlayMsg('なまえをいれてください！');
      document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
      return;
    }
    initNewGame(name);
    showScreen('main');
    updateMainMenu();
    // スターター選択メッセージ
    setTimeout(() => {
      showOverlayMsg(`ようこそ、${name}さん！\nぷゆゆが仲間に加わった！\nバトルに挑戦しよう！`);
      document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
    }, 300);
  });

  document.getElementById('btn-name-back')?.addEventListener('click', () => {
    showScreen('title');
  });

  document.getElementById('player-name-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('btn-name-ok')?.click();
  });
}
