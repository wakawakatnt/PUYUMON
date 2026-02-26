// =====================================================
// ぷゆモン - エントリーポイント (main.js)
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
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
