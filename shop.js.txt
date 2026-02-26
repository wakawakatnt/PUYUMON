// =====================================================
// ぷゆモン - ショップUI
// =====================================================

let shopCurrentTab = 'ball';

function showShopScreen() {
  showScreen('shop');
  shopCurrentTab = 'ball';
  document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.shop-tab[data-tab="ball"]')?.classList.add('active');
  renderShopList();
  renderBagOwned();
  updateShopMoney();
}

function renderShopList() {
  const listEl = document.getElementById('shop-list');
  if (!listEl) return;

  const tabCatMap = {
    'ball':     ['ball'],
    'medicine': ['medicine'],
    'battle':   ['battle'],
    'stone':    ['stone'],
  };
  const cats = tabCatMap[shopCurrentTab] || ['ball'];

  listEl.innerHTML = '';
  const items = Object.values(ITEMS).filter(item => cats.includes(item.category) && item.price > 0);

  if (items.length === 0) {
    listEl.innerHTML = '<div style="padding:16px;color:var(--text-sub)">ここには商品がない…</div>';
    return;
  }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'shop-item';

    const owned = Game.bag[item.name] || 0;
    div.innerHTML = `
      <div class="shop-item-icon">${item.icon || '📦'}</div>
      <div class="shop-item-info">
        <div class="shop-item-name">${item.name} ${owned > 0 ? `<span style="color:var(--accent2);font-size:11px">×${owned}</span>` : ''}</div>
        <div class="shop-item-desc">${item.desc || ''}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <div class="shop-item-price">💰 ${item.price}P</div>
        <button class="shop-buy-btn" onclick="buyItem('${item.name}', 1)">1個買う</button>
        <button class="shop-buy-btn" onclick="buyItem('${item.name}', 5)" style="font-size:11px;padding:3px 8px;background:linear-gradient(135deg,#2266aa,#113366)">5個買う</button>
      </div>
    `;
    listEl.appendChild(div);
  });
}

function buyItem(itemName, count) {
  const item = ITEMS[itemName];
  if (!item) return;

  const totalCost = item.price * count;
  if (!spendMoney(totalCost)) {
    showOverlayMsg('お金が足りない！');
    document.getElementById('overlay-ok').onclick = () => hideOverlay('overlay-msg');
    return;
  }

  addItemToBag(Game.bag, itemName, count);
  showOverlayMsg(`${itemName} × ${count} を購入した！\n残り: ${Game.player.money} Pコイン`);
  document.getElementById('overlay-ok').onclick = () => {
    hideOverlay('overlay-msg');
    renderShopList();
    renderBagOwned();
    updateShopMoney();
    updateMainMenu();
  };
}

function renderBagOwned() {
  const listEl = document.getElementById('bag-owned-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  Object.entries(Game.bag).forEach(([name, count]) => {
    if (count <= 0) return;
    const item = ITEMS[name];
    const chip = document.createElement('div');
    chip.className = 'owned-item-chip';
    chip.textContent = `${item?.icon || '📦'} ${name} ×${count}`;
    listEl.appendChild(chip);
  });

  if (listEl.children.length === 0) {
    listEl.innerHTML = '<span style="color:var(--text-sub);font-size:12px">まだ何も持っていない…</span>';
  }
}

function updateShopMoney() {
  const el = document.getElementById('shop-money');
  if (el) el.textContent = Game.player.money.toLocaleString();
}

function setupShopEvents() {
  document.getElementById('btn-shop')?.addEventListener('click', () => {
    showShopScreen();
  });

  document.getElementById('btn-shop-back')?.addEventListener('click', () => {
    showScreen('main');
    updateMainMenu();
  });

  document.querySelectorAll('.shop-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      shopCurrentTab = tab.dataset.tab;
      renderShopList();
    });
  });
}
