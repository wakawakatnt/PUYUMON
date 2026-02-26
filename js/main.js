// =====================================================
// ぷゆモン - エントリーポイント (main.js)
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  function checkSystemStatus() {
    const statusEl = document.getElementById('system-status');
    if (!statusEl) return;
    
    let errors = [];
    if (typeof TYPES === 'undefined') errors.push('タイプ(types.js)');
    if (typeof ABILITIES === 'undefined') errors.push('特性(abilities.js)');
    if (typeof MOVES === 'undefined') errors.push('技(moves.js)');
    if (typeof ITEMS === 'undefined') errors.push('アイテム(items.js)');
    if (typeof PUYUMON_DATA === 'undefined') errors.push('キャラ(characters.js)');
    
    if (errors.length > 0) {
      statusEl.innerHTML = `<span style="color: #ff6666; font-weight: bold; text-shadow: 1px 1px 2px #000;">⚠️ エラー: 以下のデータが未読み込みです<br>${errors.join(', ')}</span>`;
      console.error('読み込みエラー:', errors);
    } else {
      statusEl.innerHTML = `<span style="color: #66ff66; text-shadow: 1px 1px 2px #000;">✅ 全データ正常に読み込み完了</span>`;
    }
  }
  // システムチェックを実行
  checkSystemStatus();
  // ローディング表示
  const loading = document.getElementById('loading');

  // 全イベント設定
  setupTitleEvents();
  setupMainMenuEvents();
  setupBattleUIEvents();
  setupPartyEvents();
  setupPokedexEvents();
  setupStatusScreenEvents();
  setupStatusAllEvents();
  setupBoxEvents();
  setupShopEvents();
  setupEditEvents();

  // ローディング終了 → タイトル画面へ
  setTimeout(() => {
    if (loading) {
      loading.classList.add('fade-out');
      setTimeout(() => {
        loading.style.display = 'none';
        showScreen('title');
      }, 400);
    } else {
      showScreen('title');
    }
  }, 800);

  // プレイ時間カウント
  setInterval(() => {
    if (Game.player) {
      Game.player.playTime = (Game.player.playTime || 0) + 1;
    }
  }, 1000);

  // 自動セーブ（5分ごと）
  setInterval(() => {
    if (Game.party.length > 0) {
      saveGame(0);
      console.log('自動セーブしました');
    }
  }, 5 * 60 * 1000);
});
