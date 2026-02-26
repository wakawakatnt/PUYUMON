// =====================================================
// ぷゆモン - アイテムデータ
// =====================================================

const ITEMS = {
  // ===== ぷゆボール系 =====
  'ぷゆボール': {
    name: 'ぷゆボール', icon: '🟣', category: 'ball',
    price: 200, catchRate: 1.0,
    desc: '普通のぷゆボール。捕獲率×1.0。',
  },
  'スーパーぷゆボール': {
    name: 'スーパーぷゆボール', icon: '🔵', category: 'ball',
    price: 350, catchRate: 1.5,
    desc: '少し性能が良いぷゆボール。捕獲率×1.5。',
  },
  'ハイパーぷゆボール': {
    name: 'ハイパーぷゆボール', icon: '🟡', category: 'ball',
    price: 550, catchRate: 2.0,
    desc: '高性能ぷゆボール。捕獲率×2.0。',
  },
  'マスターぷゆボール': {
    name: 'マスターぷゆボール', icon: '⭐', category: 'ball',
    price: 0, catchRate: 255,
    desc: '絶対に逃さないぷゆボール。捕獲率MAX（入手困難）。',
  },
  'くらやみボール': {
    name: 'くらやみボール', icon: '⬛', category: 'ball',
    price: 1000, catchRate: 1.0,
    desc: '洞窟や夜は捕獲率×3.5。',
    specialCatch: 'dark'
  },
  'ネットボール': {
    name: 'ネットボール', icon: '🕸️', category: 'ball',
    price: 1000, catchRate: 1.0,
    desc: 'みず・むしタイプは捕獲率×3.5。',
    specialCatch: 'net'
  },
  'ラブラブボール': {
    name: 'ラブラブボール', icon: '💕', category: 'ball',
    price: 1000, catchRate: 8.0,
    desc: '同じ種族なら捕獲率×8.0。',
    specialCatch: 'love'
  },
  'タイマーボール': {
    name: 'タイマーボール', icon: '⏱️', category: 'ball',
    price: 1000, catchRate: 1.0,
    desc: 'ターンが経過するほど捕獲率UP（最大×4）。',
    specialCatch: 'timer'
  },
  'クイックボール': {
    name: 'クイックボール', icon: '💨', category: 'ball',
    price: 1000, catchRate: 1.0,
    desc: '最初のターンに使うと捕獲率×5。',
    specialCatch: 'quick'
  },
  'ぷゆぷゆボール': {
    name: 'ぷゆぷゆボール', icon: '🌸', category: 'ball',
    price: 3000, catchRate: 3.0,
    desc: 'ぷゆタイプには捕獲率×5。他は×3。',
    specialCatch: 'puyutype'
  },

  // ===== 回復薬 =====
  'キズぐすり': {
    name: 'キズぐすり', icon: '💊', category: 'medicine',
    price: 300,
    desc: 'HPを20回復する。',
    effect: { type: 'heal', amount: 20 }
  },
  'いいキズぐすり': {
    name: 'いいキズぐすり', icon: '💊', category: 'medicine',
    price: 700,
    desc: 'HPを60回復する。',
    effect: { type: 'heal', amount: 60 }
  },
  'すごいキズぐすり': {
    name: 'すごいキズぐすり', icon: '💊', category: 'medicine',
    price: 1500,
    desc: 'HPを120回復する。',
    effect: { type: 'heal', amount: 120 }
  },
    // ===== 努力値(EV)アップアイテム =====
  'マックスアップ': {
    name: 'マックスアップ', icon: '💊', category: 'medicine',
    price: 1000, desc: 'HPの努力値を10上げる。'
  },
  'タウリン': {
    name: 'タウリン', icon: '💊', category: 'medicine',
    price: 1000, desc: 'こうげきの努力値を10上げる。'
  },
  'ブロムヘキシン': {
    name: 'ブロムヘキシン', icon: '💊', category: 'medicine',
    price: 1000, desc: 'ぼうぎょの努力値を10上げる。'
  },
  'リゾチウム': {
    name: 'リゾチウム', icon: '💊', category: 'medicine',
    price: 1000, desc: 'とくこうの努力値を10上げる。'
  },
  'キトサン': {
    name: 'キトサン', icon: '💊', category: 'medicine',
    price: 1000, desc: 'とくぼうの努力値を10上げる。'
  },
  'インドメタシン': {
    name: 'インドメタシン', icon: '💊', category: 'medicine',
    price: 1000, desc: 'すばやさの努力値を10上げる。'
  },
  'まんたんのくすり': {
    name: 'まんたんのくすり', icon: '💉', category: 'medicine',
    price: 2000,
    desc: 'HPを全回復する。',
    effect: { type: 'healFull' }
  },
  'げんきのかたまり': {
    name: 'げんきのかたまり', icon: '⚡', category: 'medicine',
    price: 1000,
    desc: '瀕死のぷゆモンを起こし、HPを半分回復。',
    effect: { type: 'revive', amount: 0.5 }
  },
  'げんきのもと': {
    name: 'げんきのもと', icon: '✨', category: 'medicine',
    price: 3000,
    desc: '瀕死のぷゆモンを起こし、HPを全回復。',
    effect: { type: 'revive', amount: 1.0 }
  },
  'どうぐなおし': {
    name: 'どうぐなおし', icon: '🍶', category: 'medicine',
    price: 200,
    desc: '状態異常（まひ、やけど、どく、こおり）を治す。',
    effect: { type: 'cureStatus', statuses: ['par', 'brn', 'psn', 'frz', 'tox'] }
  },
  'ねむけざまし': {
    name: 'ねむけざまし', icon: '🫖', category: 'medicine',
    price: 250,
    desc: 'ねむり状態を治す。',
    effect: { type: 'cureStatus', statuses: ['slp'] }
  },
  'まひなおし': {
    name: 'まひなおし', icon: '⚡', category: 'medicine',
    price: 200,
    desc: 'まひを治す。',
    effect: { type: 'cureStatus', statuses: ['par'] }
  },
  'やけどなおし': {
    name: 'やけどなおし', icon: '🔥', category: 'medicine',
    price: 250,
    desc: 'やけどを治す。',
    effect: { type: 'cureStatus', statuses: ['brn'] }
  },
  'どくなおし': {
    name: 'どくなおし', icon: '💜', category: 'medicine',
    price: 300,
    desc: 'どく・もうどくを治す。',
    effect: { type: 'cureStatus', statuses: ['psn', 'tox'] }
  },
  'こおりなおし': {
    name: 'こおりなおし', icon: '🧊', category: 'medicine',
    price: 250,
    desc: 'こおりを治す。',
    effect: { type: 'cureStatus', statuses: ['frz'] }
  },
  'かいふくのくすり': {
    name: 'かいふくのくすり', icon: '🌟', category: 'medicine',
    price: 1500,
    desc: 'HP全回復＆全ての状態異常を治す。',
    effect: { type: 'healFull', cureAll: true }
  },

  // ===== PPアイテム =====
  'ぷゆぷゆエイド': {
    name: 'ぷゆぷゆエイド', icon: '🔷', category: 'medicine',
    price: 1000,
    desc: '1つの技のPPを10回復する。',
    effect: { type: 'healPP', amount: 10 }
  },
  'ぷゆぷゆリカバー': {
    name: 'ぷゆぷゆリカバー', icon: '💠', category: 'medicine',
    price: 2000,
    desc: '1つの技のPPを全回復する。',
    effect: { type: 'healPPFull' }
  },
  'ぷゆぷゆマックス': {
    name: 'ぷゆぷゆマックス', icon: '🔹', category: 'medicine',
    price: 6500,
    desc: '全ての技のPPを全回復する。',
    effect: { type: 'healAllPP' }
  },

  // ===== 戦闘用アイテム =====
  'キャップをなげる': {
    name: 'キャップをなげる', icon: '🧢', category: 'battle',
    price: 500,
    desc: '相手の攻撃を1段階下げる。',
    effect: { type: 'statDown', stat: 'atk', stage: 1, target: 'enemy' }
  },
  'ひのたま': {
    name: 'ひのたま', icon: '🔥', category: 'battle',
    price: 800,
    desc: '相手をやけど状態にする。',
    effect: { type: 'inflictStatus', status: 'brn', target: 'enemy' }
  },
  'こおりのいし': {
    name: 'こおりのいし', icon: '🧊', category: 'battle',
    price: 800,
    desc: '相手をこおり状態にする。',
    effect: { type: 'inflictStatus', status: 'frz', target: 'enemy' }
  },
  'ほえる': {
    name: 'ほえる', icon: '📣', category: 'battle',
    price: 500,
    desc: '相手の能力変化を全てリセットする。',
    effect: { type: 'clearEnemyStats' }
  },
  'ぷゆぷゆパワー': {
    name: 'ぷゆぷゆパワー', icon: '💪', category: 'battle',
    price: 1000,
    desc: '自分の攻撃を1段階上げる。',
    effect: { type: 'statUp', stat: 'atk', stage: 1, target: 'self' }
  },
  'ぷゆぷゆシールド': {
    name: 'ぷゆぷゆシールド', icon: '🛡️', category: 'battle',
    price: 1000,
    desc: '自分の防御を1段階上げる。',
    effect: { type: 'statUp', stat: 'def', stage: 1, target: 'self' }
  },

  // ===== 持ち物（パッシブ） =====
  'たべのこし': {
    name: 'たべのこし', icon: '🍖', category: 'held',
    price: 2000,
    desc: '毎ターン終了時にHPを1/16回復する。',
    effect: { type: 'endTurnHeal', fraction: 16 }
  },
  'じゃくてんほけん': {
    name: 'じゃくてんほけん', icon: '📋', category: 'held',
    price: 3000,
    desc: '効果抜群のダメージを受けると、攻撃・特攻が2段階UP。1回限り。',
    effect: { type: 'weaknessPolicy' }
  },
  'こだわりハチマキ': {
    name: 'こだわりハチマキ', icon: '🎽', category: 'held',
    price: 3000,
    desc: '攻撃が1.5倍になるが、1つの技しか使えない。',
    effect: { type: 'choiceBand', stat: 'atk', mult: 1.5 }
  },
  'こだわりメガネ': {
    name: 'こだわりメガネ', icon: '👓', category: 'held',
    price: 3000,
    desc: '特攻が1.5倍になるが、1つの技しか使えない。',
    effect: { type: 'choiceSpecs', stat: 'spa', mult: 1.5 }
  },
  'こだわりスカーフ': {
    name: 'こだわりスカーフ', icon: '🧣', category: 'held',
    price: 3000,
    desc: '素早さが1.5倍になるが、1つの技しか使えない。',
    effect: { type: 'choiceScarf', stat: 'spe', mult: 1.5 }
  },
  'いのちのたま': {
    name: 'いのちのたま', icon: '💎', category: 'held',
    price: 5000,
    desc: '技の威力が1.3倍になるが、毎ターンHPが1/10削れる。',
    effect: { type: 'lifeOrb', mult: 1.3 }
  },
  'きあいのタスキ': {
    name: 'きあいのタスキ', icon: '🎀', category: 'held',
    price: 4000,
    desc: 'HP満タン時に一撃で倒されそうになるとHP1で生き残る。',
    effect: { type: 'focusSash' }
  },
  'しんかのきせき': {
    name: 'しんかのきせき', icon: '💫', category: 'held',
    price: 4000,
    desc: '防御・特防が1.5倍になる（進化前のみ）。',
    effect: { type: 'eviolite' }
  },
  'ラムのみ': {
    name: 'ラムのみ', icon: '🍒', category: 'held',
    price: 500,
    desc: '状態異常になると自動で回復する（1回限り）。',
    effect: { type: 'lum' }
  },
  'オボンのみ': {
    name: 'オボンのみ', icon: '🍊', category: 'held',
    price: 500,
    desc: 'HP50%以下になると自動でHP25%回復（1回限り）。',
    effect: { type: 'sitrusberry' }
  },
  'チイラのみ': {
    name: 'チイラのみ', icon: '🍎', category: 'held',
    price: 800,
    desc: 'HP25%以下になると攻撃が1段階UP（1回限り）。',
    effect: { type: 'berry', stat: 'atk', pinch: true }
  },
  'ヤチェのみ': {
    name: 'ヤチェのみ', icon: '🫐', category: 'held',
    price: 800,
    desc: 'こおり技のダメージを半減する（1回限り）。',
    effect: { type: 'resistBerry', type_resist: 'こおり' }
  },
  'ゴツゴツメット': {
    name: 'ゴツゴツメット', icon: '⚙️', category: 'held',
    price: 3000,
    desc: '接触技を受けると相手がHPの1/6ダメージを受ける。',
    effect: { type: 'rockyHelmet' }
  },
  'くろいヘドロ': {
    name: 'くろいヘドロ', icon: '🖤', category: 'held',
    price: 2000,
    desc: 'どくタイプは毎ターンHP1/16回復。他は1/8削れる。',
    effect: { type: 'blackSludge' }
  },
  'ぷゆぷゆのたま': {
    name: 'ぷゆぷゆのたま', icon: '🔮', category: 'held',
    price: 5000,
    desc: 'ぷゆタイプの技の威力が1.5倍になる。',
    effect: { type: 'plateMult', ptype: 'ぷゆ', mult: 1.5 }
  },

  // ===== 進化の石 =====
  'ほのおのいし': {
    name: 'ほのおのいし', icon: '🔴', category: 'stone',
    price: 2000, evolveType: 'fire',
    desc: 'ほのおタイプのぷゆモンが進化することがある。'
  },
  'みずのいし': {
    name: 'みずのいし', icon: '🔵', category: 'stone',
    price: 2000, evolveType: 'water',
    desc: 'みずタイプのぷゆモンが進化することがある。'
  },
  'いかずちのいし': {
    name: 'いかずちのいし', icon: '🟡', category: 'stone',
    price: 2000, evolveType: 'thunder',
    desc: 'でんきタイプのぷゆモンが進化することがある。'
  },
  'くさのいし': {
    name: 'くさのいし', icon: '🟢', category: 'stone',
    price: 2000, evolveType: 'leaf',
    desc: 'くさタイプのぷゆモンが進化することがある。'
  },
  'ぷゆのいし': {
    name: 'ぷゆのいし', icon: '🌸', category: 'stone',
    price: 5000, evolveType: 'puyu',
    desc: 'ぷゆタイプのぷゆモンが進化することがある。'
  },
  'やみのいし': {
    name: 'やみのいし', icon: '⬛', category: 'stone',
    price: 3000, evolveType: 'dark',
    desc: 'あく・ゴーストタイプのぷゆモンが進化することがある。'
  },
  'ひかりのいし': {
    name: 'ひかりのいし', icon: '⬜', category: 'stone',
    price: 3000, evolveType: 'light',
    desc: 'フェアリー・エスパータイプのぷゆモンが進化することがある。'
  },
};

/**
 * カテゴリ別アイテム取得
 */
function getItemsByCategory(category) {
  return Object.values(ITEMS).filter(item => item.category === category);
}

/**
 * アイテム名一覧
 */
function getItemNames() {
  return Object.keys(ITEMS);
}

/**
 * バッグを操作するユーティリティ
 */
function addItemToBag(bag, itemName, amount = 1) {
  if (bag[itemName] === undefined) bag[itemName] = 0;
  bag[itemName] += amount;
}

function removeItemFromBag(bag, itemName, amount = 1) {
  if (!bag[itemName]) return false;
  bag[itemName] -= amount;
  if (bag[itemName] <= 0) delete bag[itemName];
  return true;
}
