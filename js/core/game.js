// =====================================================
// ぷゆモン - ゲームコアシステム & セーブ/ロード
// =====================================================

const GAME_VERSION = '1.0.0';
const SAVE_KEY = 'puyumon_save';
const MAX_PARTY = 6;
const MAX_BOX_PAGES = 20;
const BOX_SIZE = 30; // 1ページあたり

// =====================================================
// ゲーム状態 (グローバル)
// =====================================================
let Game = {
  // プレイヤー情報
  player: {
    name: 'トレーナー',
    id: 0,
    trainerLevel: 1,
    trainerExp: 0,
    money: 3000,
    badges: [],       // ジムバッジ一覧
    playTime: 0,      // 秒数
  },

  // バッグ { itemName: count }
  bag: {
    'ぷゆボール': 5,
    'キズぐすり': 5,
    'どうぐなおし': 3,
  },

  // パーティ (PuyuMon インスタンス or null, 最大6匹)
  party: [],

  // ボックス [ [PuyuMon or null, ...] * BOX_SIZE ] * MAX_BOX_PAGES
  box: Array.from({ length: MAX_BOX_PAGES }, () => Array(BOX_SIZE).fill(null)),

  // 図鑑情報 { monsterId: { seen: bool, caught: bool } }
  pokedex: {},

  // フラグ
  flags: {},

  // 開始時刻
  startTime: Date.now(),

  // 設定
  settings: {
    bgmVolume: 0.5,
    sfxVolume: 0.8,
    textSpeed: 'normal', // slow/normal/fast
    battleAnimation: true,
  },

  // バトル統計
  stats: {
    battles: 0,
    wins: 0,
    captures: 0,
    stepsWalked: 0,
  },
};

// =====================================================
// ぷゆモン インスタンス作成
// =====================================================
/**
 * ベースデータから実際のぷゆモンを生成する
 * @param {string} speciesId - PUYUMON_DATA のキー
 * @param {number} level - レベル(1~100)
 * @param {Object} opts - 追加オプション
 */
function createPuyuMon(speciesId, level, opts = {}) {
  const base = getPuyuMonBase(speciesId);
  if (!base) {
    console.error('Unknown species:', speciesId);
    return null;
  }

  // IVs (個体値 0~31 ランダム)
  const ivs = opts.ivs || {
    hp:  opts.perfectIV ? 31 : randInt(0, 31),
    atk: opts.perfectIV ? 31 : randInt(0, 31),
    def: opts.perfectIV ? 31 : randInt(0, 31),
    spa: opts.perfectIV ? 31 : randInt(0, 31),
    spd: opts.perfectIV ? 31 : randInt(0, 31),
    spe: opts.perfectIV ? 31 : randInt(0, 31),
  };

  // EVs (努力値 0~252, 合計510まで)
  const evs = opts.evs || { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 };

  // 性格
  const natureKeys = Object.keys(NATURES);
  const nature = opts.nature || natureKeys[randInt(0, natureKeys.length - 1)];

  // 特性
  const abilities = base.abilities || ['ぷゆぷゆオーラ'];
  const ability = opts.ability || abilities[randInt(0, abilities.length - 1)];

  // 技（レベルに応じた技を自動セット）
  const moves = opts.moves || getLearnableMoves(base, level).slice(0, 4);
  const movePPs = {};
  moves.forEach(m => {
    movePPs[m] = MOVES[m] ? MOVES[m].pp : 10;
  });

  // ステータス計算
  const stats = calcStats(base.baseStats, level, ivs, evs, nature);

  // 現在HP
  const currentHp = opts.currentHp !== undefined ? opts.currentHp : stats.hp;

  const mon = {
    uid: generateUID(),
    speciesId,
    name: opts.name || base.name,
    nickname: opts.nickname || null,
    level,
    exp: opts.exp || calcExpForLevel(base.expGroup, level),
    nature,
    ability,
    item: opts.item || null,
    moves: moves.slice(0, 4),
    movePPs,
    ivs,
    evs,
    baseStats: base.baseStats,
    stats,
    maxHp: stats.hp,
    currentHp,
    status: opts.status || null,    // null/par/brn/psn/tox/frz/slp
    statusTurns: 0,
    happiness: opts.happiness !== undefined ? opts.happiness : 70,
    gender: opts.gender || determineGender(base.genderRatio),
    isShiny: opts.isShiny || (Math.random() < 0.001), // 1/1000
    types: [...base.types],
    // 戦闘中ステータス
    statStages: { atk:0, def:0, spa:0, spd:0, spe:0, acc:0, eva:0 },
    flags: {},
    // フレーバー情報
    caughtAt: opts.caughtAt || null,
    caughtLevel: opts.caughtLevel || level,
    originalTrainer: opts.originalTrainer || Game.player.name,
    originalTrainerId: opts.originalTrainerId || Game.player.id,
  };

  return mon;
}

/**
 * ぷゆモン基本データ取得 (characters.js に依存)
 */
function getPuyuMonBase(speciesId) {
  if (typeof PUYUMON_DATA === 'undefined') return null;
  return PUYUMON_DATA[speciesId] || null;
}

// =====================================================
// ステータス計算
// =====================================================
function calcStats(base, level, ivs, evs, nature) {
  return {
    hp:  calcHPStat(base.hp,  level, ivs.hp,  evs.hp),
    atk: calcStat(base.atk, level, ivs.atk, evs.atk, getNatureMultiplier(nature, 'atk')),
    def: calcStat(base.def, level, ivs.def, evs.def, getNatureMultiplier(nature, 'def')),
    spa: calcStat(base.spa, level, ivs.spa, evs.spa, getNatureMultiplier(nature, 'spa')),
    spd: calcStat(base.spd, level, ivs.spd, evs.spd, getNatureMultiplier(nature, 'spd')),
    spe: calcStat(base.spe, level, ivs.spe, evs.spe, getNatureMultiplier(nature, 'spe')),
  };
}

function calcHPStat(base, level, iv, ev) {
  return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
}

function calcStat(base, level, iv, ev, natureMult) {
  return Math.floor((Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureMult);
}

/**
 * ステージ補正込みの実際のステータスを取得
 */
function getEffectiveStat(mon, statName) {
  const base = mon.stats[statName];
  const stage = mon.statStages[statName] || 0;
  return Math.max(1, Math.floor(base * getStageMultiplier(stage)));
}

function getStageMultiplier(stage) {
  const table = [2/8, 2/7, 2/6, 2/5, 2/4, 2/3, 2/2, 3/2, 4/2, 5/2, 6/2, 7/2, 8/2];
  return table[stage + 6] || 1;
}

function getAccStageMultiplier(stage) {
  const table = [3/9, 3/8, 3/7, 3/6, 3/5, 3/4, 3/3, 4/3, 5/3, 6/3, 7/3, 8/3, 9/3];
  return table[stage + 6] || 1;
}

// =====================================================
// 経験値・レベルシステム
// =====================================================
const EXP_GROUPS = {
  fast:     level => Math.floor(4 * level ** 3 / 5),
  medium:   level => level ** 3,
  slow:     level => Math.floor(5 * level ** 3 / 4),
  erratic:  level => {
    if (level < 50)  return Math.floor(level ** 3 * (100 - level) / 50);
    if (level < 68)  return Math.floor(level ** 3 * (150 - level) / 100);
    if (level < 98)  return Math.floor(level ** 3 * Math.floor((1911 - 10 * level) / 3) / 500);
    return Math.floor(level ** 3 * (160 - level) / 100);
  },
  fluctuating: level => {
    if (level < 15) return Math.floor(level ** 3 * (Math.floor((level + 1) / 3) + 24) / 50);
    if (level < 36) return Math.floor(level ** 3 * (level + 14) / 50);
    return Math.floor(level ** 3 * (Math.floor(level / 2) + 32) / 50);
  },
};

function calcExpForLevel(group, level) {
  if (level <= 1) return 0;
  const fn = EXP_GROUPS[group] || EXP_GROUPS.medium;
  return fn(level);
}

function calcExpToNextLevel(group, level) {
  if (level >= 100) return 0;
  const fn = EXP_GROUPS[group] || EXP_GROUPS.medium;
  return fn(level + 1) - fn(level);
}

/**
 * 経験値加算 & レベルアップ処理
 * @returns {Array} レベルアップイベントの配列
 */
function addExp(mon, amount) {
  if (mon.level >= 100) return [];
  const base = getPuyuMonBase(mon.speciesId);
  const group = base ? base.expGroup : 'medium';
  const events = [];

  mon.exp += amount;
  while (mon.level < 100) {
    const needed = calcExpForLevel(group, mon.level + 1);
    if (mon.exp >= needed) {
      mon.level++;
      const oldStats = { ...mon.stats };
      mon.stats = calcStats(mon.baseStats, mon.level, mon.ivs, mon.evs, mon.nature);
      const hpIncrease = mon.stats.hp - oldStats.hp;
      mon.maxHp = mon.stats.hp;
      mon.currentHp = Math.min(mon.maxHp, mon.currentHp + hpIncrease);

      // 技習得チェック
      const newMoves = getLevelUpMoves(base, mon.level);
      events.push({ type: 'levelUp', level: mon.level, newMoves });

      if (mon.level >= 100) break;
    } else {
      break;
    }
  }
  return events;
}

/**
 * 経験値計算（バトル後）
 */
function calcBattleExp(defeatedMon, isWild, participantCount) {
  const base = getPuyuMonBase(defeatedMon.speciesId);
  const baseExp = base ? (base.baseExp || 50) : 50;
  const a = isWild ? 1 : 1.5;
  return Math.max(1, Math.floor((a * baseExp * defeatedMon.level) / (7 * participantCount)));
}

// =====================================================
// 技習得システム
// =====================================================
function getLearnableMoves(base, level) {
  if (!base || !base.levelMoves) return ['たいあたり'];
  const learned = [];
  for (let lv = 1; lv <= level; lv++) {
    if (base.levelMoves[lv]) {
      base.levelMoves[lv].forEach(m => {
        if (!learned.includes(m)) learned.push(m);
      });
    }
  }
  if (learned.length === 0) learned.push('たいあたり');
  return learned.slice(-8); // 最大8技記憶（セットは4つまで）
}

function getLevelUpMoves(base, level) {
  if (!base || !base.levelMoves) return [];
  return base.levelMoves[level] || [];
}

// =====================================================
// 性別判定
// =====================================================
function determineGender(ratio) {
  if (ratio === null || ratio === undefined) return null; // 性別不明
  if (ratio === 0) return 'female';
  if (ratio === 1) return 'male';
  return Math.random() < ratio ? 'male' : 'female';
}

// =====================================================
// 図鑑更新
// =====================================================
function seePuyuMon(speciesId) {
  if (!Game.pokedex[speciesId]) Game.pokedex[speciesId] = { seen: false, caught: false };
  Game.pokedex[speciesId].seen = true;
}

function catchPuyuMon(speciesId) {
  if (!Game.pokedex[speciesId]) Game.pokedex[speciesId] = { seen: false, caught: false };
  Game.pokedex[speciesId].seen = true;
  Game.pokedex[speciesId].caught = true;
}

function getPokedexCount() {
  const total = typeof PUYUMON_DATA !== 'undefined' ? Object.keys(PUYUMON_DATA).length : 0;
  const seen = Object.values(Game.pokedex).filter(d => d.seen).length;
  const caught = Object.values(Game.pokedex).filter(d => d.caught).length;
  return { total, seen, caught };
}

// =====================================================
// パーティ操作
// =====================================================
function addToParty(mon) {
  if (Game.party.length >= MAX_PARTY) return false;
  Game.party.push(mon);
  return true;
}

function removeFromParty(index) {
  if (index < 0 || index >= Game.party.length) return null;
  return Game.party.splice(index, 1)[0];
}

function swapParty(i, j) {
  [Game.party[i], Game.party[j]] = [Game.party[j], Game.party[i]];
}

function getFirstHealthyPartyMember(excludeIndex = -1) {
  for (let i = 0; i < Game.party.length; i++) {
    if (i === excludeIndex) continue;
    if (Game.party[i] && Game.party[i].currentHp > 0) return i;
  }
  return -1;
}

function isPartyAlive() {
  return Game.party.some(m => m && m.currentHp > 0);
}

// =====================================================
// ボックス操作
// =====================================================
function addToBox(mon) {
  for (let page = 0; page < MAX_BOX_PAGES; page++) {
    for (let slot = 0; slot < BOX_SIZE; slot++) {
      if (!Game.box[page][slot]) {
        Game.box[page][slot] = mon;
        return { page, slot };
      }
    }
  }
  return null; // ボックスが満杯
}

function removeFromBox(page, slot) {
  const mon = Game.box[page][slot];
  Game.box[page][slot] = null;
  return mon;
}

function movePartyToBox(partyIndex) {
  if (Game.party.length <= 1) return false; // 最後の1匹は出せない
  const mon = removeFromParty(partyIndex);
  if (!mon) return false;
  const result = addToBox(mon);
  if (!result) {
    Game.party.splice(partyIndex, 0, mon); // 失敗したら戻す
    return false;
  }
  return true;
}

function moveBoxToParty(page, slot) {
  if (Game.party.length >= MAX_PARTY) return false;
  const mon = removeFromBox(page, slot);
  if (!mon) return false;
  Game.party.push(mon);
  return true;
}

// =====================================================
// お金
// =====================================================
function addMoney(amount) {
  Game.player.money = Math.min(999999, Game.player.money + amount);
}

function spendMoney(amount) {
  if (Game.player.money < amount) return false;
  Game.player.money -= amount;
  return true;
}

// =====================================================
// セーブ / ロード
// =====================================================
function saveGame(slot = 0) {
  try {
    // playTimeを更新
    Game.player.playTime += Math.floor((Date.now() - Game.startTime) / 1000);
    Game.startTime = Date.now();

    const saveData = {
      version: GAME_VERSION,
      savedAt: new Date().toISOString(),
      slot,
      player: Game.player,
      bag: Game.bag,
      party: Game.party,
      box: Game.box,
      pokedex: Game.pokedex,
      flags: Game.flags,
      stats: Game.stats,
      settings: Game.settings,
    };

    const key = `${SAVE_KEY}_${slot}`;
    localStorage.setItem(key, JSON.stringify(saveData));
    localStorage.setItem(`${SAVE_KEY}_lastSlot`, String(slot));
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

function loadGame(slot = 0) {
  try {
    const key = `${SAVE_KEY}_${slot}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;

    const data = JSON.parse(raw);
    if (!data || !data.player) return false;

    Game.player  = data.player;
    Game.bag     = data.bag || {};
    Game.party   = data.party || [];
    Game.box     = data.box || Array.from({ length: MAX_BOX_PAGES }, () => Array(BOX_SIZE).fill(null));
    Game.pokedex = data.pokedex || {};
    Game.flags   = data.flags || {};
    Game.stats   = data.stats || Game.stats;
    Game.settings= data.settings || Game.settings;
    Game.startTime = Date.now();

    // stats/maxHp の再計算（保存データの互換性）
    Game.party.forEach(mon => {
      if (mon) repairMon(mon);
    });
    Game.box.forEach(page => {
      page.forEach(mon => { if (mon) repairMon(mon); });
    });

    return true;
  } catch (e) {
    console.error('Load failed:', e);
    return false;
  }
}

/**
 * セーブデータのモンスターデータを修復（バージョン差異対応）
 */
function repairMon(mon) {
  const base = getPuyuMonBase(mon.speciesId);
  if (!base) return;
  if (!mon.ivs) mon.ivs = { hp:31, atk:31, def:31, spa:31, spd:31, spe:31 };
  if (!mon.evs) mon.evs = { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 };
  // statsを再計算
  mon.stats = calcStats(base.baseStats, mon.level, mon.ivs, mon.evs, mon.nature);
  mon.maxHp = mon.stats.hp;
  if (mon.currentHp === undefined) mon.currentHp = mon.maxHp;
  if (!mon.statStages) mon.statStages = { atk:0, def:0, spa:0, spd:0, spe:0, acc:0, eva:0 };
  if (!mon.flags) mon.flags = {};
  if (!mon.movePPs) {
    mon.movePPs = {};
    (mon.moves || []).forEach(m => { mon.movePPs[m] = MOVES[m] ? MOVES[m].pp : 10; });
  }
}

/**
 * セーブスロット一覧を取得
 */
function getSaveSlots() {
  const slots = [];
  for (let i = 0; i < 3; i++) {
    const raw = localStorage.getItem(`${SAVE_KEY}_${i}`);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        slots.push({
          slot: i,
          playerName: d.player.name,
          savedAt: d.savedAt,
          playTime: d.player.playTime || 0,
          partyCount: (d.party || []).filter(Boolean).length,
          badges: (d.player.badges || []).length,
        });
      } catch { slots.push(null); }
    } else {
      slots.push(null);
    }
  }
  return slots;
}

function deleteSave(slot) {
  localStorage.removeItem(`${SAVE_KEY}_${slot}`);
}

function hasSaveData() {
  for (let i = 0; i < 3; i++) {
    if (localStorage.getItem(`${SAVE_KEY}_${i}`)) return true;
  }
  return false;
}

// =====================================================
// 新規ゲーム初期化
// =====================================================
function initNewGame(playerName) {
  Game.player = {
    name: playerName,
    id: randInt(10000, 99999),
    trainerLevel: 1,
    trainerExp: 0,
    money: 3000,
    badges: [],
    playTime: 0,
  };
  Game.bag = {
    'ぷゆボール': 5,
    'キズぐすり': 5,
    'どうぐなおし': 2,
    'ぴーぴーえいど': 1,
  };
  Game.party = [];
  Game.box = Array.from({ length: MAX_BOX_PAGES }, () => Array(BOX_SIZE).fill(null));
  Game.pokedex = {};
  Game.flags = {};
  Game.stats = { battles: 0, wins: 0, captures: 0, stepsWalked: 0 };
  Game.startTime = Date.now();
  if (typeof PUYUMON_DATA !== 'undefined') {
    if (PUYUMON_DATA['puyuyu']) {
      const starter = createPuyuMon('puyuyu', 5); // ぷゆゆ、レベル5を指定
      if (starter) {
        starter.currentHp = starter.maxHp; // HPを確実に満タンにする
        addToParty(starter);
      }
    } else {
      console.error('エラー: ぷゆゆ(puyuyu)のデータが見つかりません。');
    }
  }
}

// =====================================================
// ユーティリティ
// =====================================================
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatPlayTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function getGenderSymbol(gender) {
  if (gender === 'male') return '♂';
  if (gender === 'female') return '♀';
  return '';
}

function getStatusText(status) {
  const map = { par:'まひ', brn:'やけど', psn:'どく', tox:'もうどく', frz:'こおり', slp:'ねむり' };
  return map[status] || '';
}

function getStatusClass(status) {
  const map = { par:'par', brn:'brn', psn:'psn', tox:'psn', frz:'frz', slp:'slp' };
  return map[status] || '';
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ステータス名 日本語
const STAT_NAMES = { hp:'HP', atk:'こうげき', def:'ぼうぎょ', spa:'とくこう', spd:'とくぼう', spe:'すばやさ' };

// タイプの色クラス用
function getTypeClass(type) {
  return `type-${type}`;
}

// HPバーの色クラス
function getHpBarClass(ratio) {
  if (ratio > 0.5) return '';
  if (ratio > 0.25) return 'yellow';
  return 'red';
}

// ステータスの最大値（表示用バー計算）
const STAT_MAX = { hp:714, atk:526, def:526, spa:526, spd:526, spe:526 };

function getStatBarWidth(statName, value) {
  const max = STAT_MAX[statName] || 500;
  return Math.min(100, Math.round((value / max) * 100));
}

// 捕獲判定
function calcCatchProbability(mon, ball, turnCount = 1) {
  const item = ITEMS[ball];
  if (!item) return 0;

  let rate = item.catchRate || 1.0;

  // 特殊ボール補正
  if (item.specialCatch === 'quick' && turnCount === 1) rate = 5.0;
  if (item.specialCatch === 'timer') rate = Math.min(4.0, 1.0 + (turnCount * 0.3));
  if (item.specialCatch === 'dark')  rate = 3.5; // 簡略化
  if (item.specialCatch === 'puyutype' && mon.types.includes('ぷゆ')) rate = 5.0;

  const base = getPuyuMonBase(mon.speciesId);
  const catchBaseRate = base ? (base.catchRate || 45) : 45;

  // ステータス補正（HPが低いほど捕まりやすい）
  const hpRatio = mon.currentHp / mon.maxHp;
  const hpBonus = hpRatio < 0.1 ? 2.5 : hpRatio < 0.25 ? 2.0 : hpRatio < 0.5 ? 1.5 : 1.0;

  // 状態異常補正
  const statusBonus = (mon.status === 'slp' || mon.status === 'frz') ? 2.5 :
                      (mon.status === 'par' || mon.status === 'brn' || mon.status === 'psn' || mon.status === 'tox') ? 1.5 : 1.0;

  // 最終計算
  const finalRate = Math.min(1.0, (catchBaseRate * rate * hpBonus * statusBonus) / 255);
  return finalRate;
}

// トレーナーレベルアップ
function addTrainerExp(amount) {
  Game.player.trainerExp += amount;
  const needed = Game.player.trainerLevel * 100;
  if (Game.player.trainerExp >= needed) {
    Game.player.trainerLevel++;
    Game.player.trainerExp -= needed;
    return true;
  }
  return false;
}

// =====================================================
// ワイルドぷゆモン生成
// =====================================================
function generateWildMon(areaLevel) {
  if (typeof PUYUMON_DATA === 'undefined') return null;
  const ids = Object.keys(PUYUMON_DATA);
  if (ids.length === 0) return null;
  // レアリティ考慮（catchRateが低いほどレア）
  const weights = ids.map(id => {
    const base = PUYUMON_DATA[id];
    return base.catchRate || 45;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  let chosen = ids[0];
  for (let i = 0; i < ids.length; i++) {
    r -= weights[i];
    if (r <= 0) { chosen = ids[i]; break; }
  }
  const lvVariance = randInt(-3, 3);
  const lv = Math.max(1, Math.min(100, areaLevel + lvVariance));
  return createPuyuMon(chosen, lv);
}

// =====================================================
// トレーナーデータ（簡易）
// =====================================================
const TRAINERS = [
  {
    id: 'trainer_001',
    name: 'ぷゆトレーナー・タロウ',
    icon: '🧑',
    level: 5,
    reward: 500,
    party: [
      { speciesId: 'puyuyu', level: 5 },
      { speciesId: 'uyuyu', level: 4 },
    ],
  },
  {
    id: 'trainer_002',
    name: 'ぷゆガール・ハナコ',
    icon: '👧',
    level: 8,
    reward: 800,
    party: [
      { speciesId: 'miyuyu', level: 7 },
      { speciesId: 'peyuyu', level: 8 },
    ],
  },
  {
    id: 'trainer_003',
    name: 'おじさんトレーナー・マツモト',
    icon: '👴',
    level: 15,
    reward: 1500,
    party: [
      { speciesId: 'matsumoto', level: 15 },
      { speciesId: 'matsumoto_wife', level: 13 },
      { speciesId: 'chiefu', level: 12 },
    ],
  },
  {
    id: 'trainer_004',
    name: 'エリートトレーナー・ジョンソン',
    icon: '🕴️',
    level: 30,
    reward: 3000,
    party: [
      { speciesId: 'johnson', level: 30 },
      { speciesId: 'rangerred', level: 28 },
      { speciesId: 'rangeryellow', level: 28 },
    ],
  },
  {
    id: 'trainer_005',
    name: '破壊神・ハマタ',
    icon: '💀',
    level: 60,
    reward: 8000,
    party: [
      { speciesId: 'hamata', level: 60 },
      { speciesId: 'darkpuyuyu', level: 55 },
      { speciesId: 'gekioko', level: 55 },
    ],
  },
  {
    id: 'trainer_006',
    name: '最強トレーナー・おで',
    icon: '😃',
    level: 100,
    reward: 99999,
    party: [
      { speciesId: 'ode', level: 100 },
      { speciesId: 'od', level: 98 },
      { speciesId: 'puyumon2099', level: 95 },
      { speciesId: 'kingpuyu', level: 95 },
      { speciesId: 'queenpuyu', level: 95 },
      { speciesId: 'hamata', level: 90 },
    ],
  },
];

/**
 * トレーナーのパーティを実際のぷゆモンに変換
 */
function buildTrainerParty(trainer) {
  return trainer.party
    .map(p => createPuyuMon(p.speciesId, p.level, { originalTrainer: trainer.name }))
    .filter(Boolean);
}

// =====================================================
// ジムデータ
// =====================================================
const GYMS = [
  {
    id: 'gym_1', name: 'ぷゆぷゆジム', icon: '🥺',
    leader: { name: 'ジムリーダー・ぷゆちゃん', icon: '🏆' },
    badge: '🥺バッジ', reward: 2000,
    specialtyType: 'ぷゆ',
    leaderParty: [
      { speciesId: 'puyuyu', level: 14 },
      { speciesId: 'puyuyu', level: 16 },
    ]
  },
  {
    id: 'gym_2', name: 'ハイパージム', icon: '😱',
    leader: { name: 'ジムリーダー・ハマタ', icon: '🏆' },
    badge: '💥バッジ', reward: 5000,
    specialtyType: 'ハイパー',
    leaderParty: [
      { speciesId: 'oyoyo', level: 30 },
      { speciesId: 'hamata', level: 35 },
    ]
  },
  {
    id: 'gym_3', name: 'カオスジム', icon: '🤡',
    leader: { name: 'ジムリーダー・マルク', icon: '🏆' },
    badge: '🌀バッジ', reward: 8000,
    specialtyType: 'カオス',
    leaderParty: [
      { speciesId: 'maruku', level: 45 },
      { speciesId: 'kaonashi', level: 48 },
      { speciesId: 'gekioko', level: 50 },
    ]
  },
];
