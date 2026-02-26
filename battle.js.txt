// =====================================================
// ぷゆモン - バトルシステム (完全版)
// =====================================================

/**
 * バトル状態
 */
let Battle = null;

/**
 * バトル初期化
 * @param {Object} opts
 *   type: 'wild' | 'trainer' | 'gym'
 *   playerMon: 使用するパーティインデックス
 *   enemyMon: ぷゆモンインスタンス or 配列
 *   trainer: トレーナーデータ（任意）
 *   onEnd: バトル終了コールバック
 */
function initBattle(opts) {
  const playerPartyIndex = opts.playerPartyIndex !== undefined ? opts.playerPartyIndex : getFirstHealthyPartyMember();
  if (playerPartyIndex < 0) {
    console.error('No healthy party member!');
    return false;
  }

  // 敵パーティを作成
  let enemyParty = [];
  if (Array.isArray(opts.enemyMon)) {
    enemyParty = opts.enemyMon;
  } else if (opts.enemyMon) {
    enemyParty = [opts.enemyMon];
  }

  Battle = {
    type: opts.type || 'wild',
    trainer: opts.trainer || null,
    turn: 1,

    // プレイヤー側
    playerPartyIndex,
    playerMon: Game.party[playerPartyIndex],
    playerUsedMoves: [],    // このバトルで使った技（こだわり用）

    // 敵側
    enemyPartyIndex: 0,
    enemyParty,
    enemyMon: enemyParty[0],

    // フィールド状態
    field: {
      weather: null,      // 'sunny'/'rain'/'sandstorm'/'hail'/null
      weatherTurns: 0,
      terrain: null,
      lightScreen: 0,     // 残りターン
      reflect: 0,
      tailwind: 0,
      trickRoom: false,
      trickRoomTurns: 0,
      toxicSpikes: 0,
      stealthRock: false,
    },

    // バトル中フラグ
    escaped: false,
    captured: false,
    ended: false,
    winner: null,   // 'player' / 'enemy'

    // キュー（メッセージ・アニメ待ち）
    messageQueue: [],
    waitingInput: false,
    inputCallback: null,

    // 実績
    participantExp: {},   // uid: 獲得予定exp

    // コールバック
    onEnd: opts.onEnd || null,
    onMessage: opts.onMessage || null,
    onUIUpdate: opts.onUIUpdate || null,

    // 連続技カウンタ等
    turnData: {},
  };

  // 状態異常などのフラグをリセット
  resetBattleMonState(Battle.playerMon);
  resetBattleMonState(Battle.enemyMon);

  // 図鑑に「見た」を記録
  if (Battle.enemyMon) seePuyuMon(Battle.enemyMon.speciesId);

  // 登場時特性
  triggerAbilityOnEntry(Battle.playerMon, Battle);
  triggerAbilityOnEntry(Battle.enemyMon, Battle);

  Game.stats.battles++;
  return true;
}

function resetBattleMonState(mon) {
  if (!mon) return;
  mon.statStages = { atk:0, def:0, spa:0, spd:0, spe:0, acc:0, eva:0 };
  mon.flags = {};
}

// =====================================================
// ターン処理
// =====================================================
/**
 * プレイヤーのアクション実行
 * @param {string} actionType 'move'|'item'|'switch'|'run'
 * @param {*} actionData 技名 or アイテム名 or パーティインデックス
 */
async function executeTurn(actionType, actionData) {
  if (!Battle || Battle.ended) return;

  const playerAction = { type: actionType, data: actionData };
  const enemyAction  = decideEnemyAction();

  // 優先度判定
  const playerFirst = determineTurnOrder(playerAction, enemyAction);

  if (playerFirst) {
    await executeAction('player', playerAction);
    if (!Battle.ended) await executeAction('enemy', enemyAction);
  } else {
    await executeAction('enemy', enemyAction);
    if (!Battle.ended) await executeAction('player', playerAction);
  }

  if (!Battle.ended) {
    await processTurnEnd();
  }
}

/**
 * 行動順決定
 */
function determineTurnOrder(playerAction, enemyAction) {
  // にげる / アイテム / 交代は常に先行
  if (playerAction.type === 'run')    return true;
  if (playerAction.type === 'item')   return true;
  if (playerAction.type === 'switch') return true;
  if (enemyAction.type  === 'switch') return false;

  // 技の優先度
  const playerPriority = getMovePriority(playerAction, Battle.playerMon);
  const enemyPriority  = getMovePriority(enemyAction,  Battle.enemyMon);

  if (playerPriority !== enemyPriority) return playerPriority > enemyPriority;

  // トリックルーム中は逆
  const playerSpe = getEffectiveStat(Battle.playerMon, 'spe');
  const enemySpe  = getEffectiveStat(Battle.enemyMon,  'spe');

  if (Battle.field.trickRoom) return playerSpe <= enemySpe;
  if (playerSpe !== enemySpe) return playerSpe > enemySpe;

  return Math.random() < 0.5;
}

function getMovePriority(action, mon) {
  if (action.type !== 'move') return 0;
  const move = MOVES[action.data];
  if (!move) return 0;
  let priority = move.priority || 0;
  // いたずらごころ
  if (ABILITIES[mon.ability]?.pranksterPriority && move.category === 'status') priority++;
  return priority;
}

// =====================================================
// アクション実行
// =====================================================
async function executeAction(side, action) {
  if (!Battle) return;
  const attacker = side === 'player' ? Battle.playerMon : Battle.enemyMon;
  const defender  = side === 'player' ? Battle.enemyMon  : Battle.playerMon;

  // まひ・こんらん・ねむりチェック
  if (action.type === 'move') {
    const statusResult = checkStatusBeforeMove(attacker);
    if (statusResult.blocked) {
      addMessage(statusResult.msg);
      return;
    }
  }

  switch (action.type) {
    case 'move':   await executeMoveAction(side, action.data); break;
    case 'item':   await executeItemAction(side, action.data); break;
    case 'switch': await executeSwitchAction(side, action.data); break;
    case 'run':    await executeRunAction(); break;
  }
}

// =====================================================
// 技実行
// =====================================================
async function executeMoveAction(side, moveName) {
  const attacker = side === 'player' ? Battle.playerMon : Battle.enemyMon;
  const defender  = side === 'player' ? Battle.enemyMon  : Battle.playerMon;

  const move = MOVES[moveName];
  if (!move) {
    addMessage('技が見つからない！');
    return;
  }

  // PP消費
  if (attacker.movePPs[moveName] !== undefined) {
    attacker.movePPs[moveName] = Math.max(0, attacker.movePPs[moveName] - 1);
    if (attacker.movePPs[moveName] === 0 && Object.values(attacker.movePPs).every(pp => pp === 0)) {
      // PP全切れ → わるあがき
      return await executeStruggle(side);
    }
  }

  addMessage(`${attacker.name}の ${moveName}！`);
  animateAttack(side);

  // 命中判定
  if (!checkAccuracy(attacker, defender, move)) {
    addMessage(`${attacker.name}の攻撃はそれた！`);
    // missDrainチェック
    triggerAbilityOnMiss(defender, Battle);
    return;
  }

  // 特性による技ブロックチェック
  if (ABILITIES[defender.ability]?.onHit) {
    const result = ABILITIES[defender.ability].onHit(Battle, attacker, defender, move);
    if (result?.blocked) {
      addMessage(result.msg || '技が無効化された！');
      return;
    }
  }

  if (move.category === 'status') {
    // 変化技
    await executeStatusMove(side, move, attacker, defender);
  } else {
    // ダメージ技
    await executeDamageMove(side, move, attacker, defender);
  }

  // 追加効果
  await processSecondaryEffect(move, attacker, defender, side);
}

/**
 * ダメージ計算 & 適用
 */
async function executeDamageMove(side, move, attacker, defender) {
  const { damage, crit, effectiveness } = calcDamage(attacker, defender, move);

  // 急所メッセージ
  if (crit) addMessage('急所に当たった！');

  // 相性メッセージ
  const effMsg = getEffectivenessMessage(effectiveness);
  if (effMsg) addMessage(effMsg);

  if (effectiveness === 0) return; // 無効

  // ダメージ適用
  applyDamage(defender, damage);

  animateDamage(side === 'player' ? 'enemy' : 'player');

  // 特殊効果 (反動, 吸収等)
  await processMoveSideEffect(move, attacker, defender, damage);

  // 瀕死チェック
  if (defender.currentHp <= 0) {
    await handleFaint(side === 'player' ? 'enemy' : 'player');
  }
}

/**
 * ダメージ計算
 */
function calcDamage(attacker, defender, move) {
  if (move.power === 0) return { damage: 0, crit: false, effectiveness: 1 };

  // タイプ相性
  let effectiveness = getTypeEffectiveness(move.type, defender.types);

  // タイプ無効特性チェック
  if (ABILITIES[defender.ability]?.immuneGhost && move.type === 'ゴースト') effectiveness = 0;
  if (ABILITIES[defender.ability]?.immuneDark  && move.type === 'あく')     effectiveness = 0;
  if (ABILITIES[defender.ability]?.immuneGround&& move.type === 'じめん')   effectiveness = 0;
  if (effectiveness === 0) return { damage: 0, crit: false, effectiveness: 0 };

  // 急所判定
  const critStage = (move.effect === 'highCrit' || move.effect === 'alwaysCrit') ? 3 : 0;
  const critTable = [1/24, 1/8, 1/2, 1, 1];
  const crit = move.effect === 'alwaysCrit' || Math.random() < critTable[Math.min(4, critStage)];

  // 実効ステータス取得
  let atkStat, defStat;
  if (move.category === 'physical') {
    atkStat = getEffectiveStat(attacker, 'atk');
    defStat = crit ? defender.stats.def : getEffectiveStat(defender, 'def');
    if (move.effect === 'useEnemyAtk') atkStat = getEffectiveStat(defender, 'atk');
  } else {
    atkStat = getEffectiveStat(attacker, 'spa');
    defStat = crit ? defender.stats.spd : getEffectiveStat(defender, 'spd');
    if (move.effect === 'useDefense') defStat = crit ? defender.stats.def : getEffectiveStat(defender, 'def');
  }

  // 急所: 攻撃側の補正を無視して、防御側の負補正も無視
  if (crit) {
    atkStat = Math.max(atkStat, attacker.stats[move.category === 'physical' ? 'atk' : 'spa']);
  }

  // 特性補正
  let abilityMult = 1;
  const atkAbility = ABILITIES[attacker.ability];
  if (atkAbility) {
    if (atkAbility.physicalPowerMult && move.category === 'physical') abilityMult *= atkAbility.physicalPowerMult;
    if (atkAbility.typePowerMult && atkAbility.typePowerMult.type === move.type) abilityMult *= atkAbility.typePowerMult.mult;
    if (atkAbility.allPowerMult) abilityMult *= atkAbility.allPowerMult;
    if (atkAbility.spaUp1_5 && move.category === 'special') abilityMult *= 1.5;
    if (atkAbility.pinchDoublePower && attacker.currentHp <= attacker.maxHp / 2) abilityMult *= 2;
    if (attacker.flags.puyuAuraPinch && atkAbility.typePowerMult?.type === 'ぷゆ') abilityMult *= 1.5;
  }

  // 持ち物補正
  if (attacker.item) {
    const itemData = ITEMS[attacker.item];
    if (itemData?.effect?.type === 'lifeOrb') abilityMult *= itemData.effect.mult;
    if (itemData?.effect?.type === 'plateMult' && itemData.effect.ptype === move.type) abilityMult *= itemData.effect.mult;
    if (itemData?.effect?.type === 'choiceBand' && move.category === 'physical') abilityMult *= itemData.effect.mult;
    if (itemData?.effect?.type === 'choiceSpecs' && move.category === 'special') abilityMult *= itemData.effect.mult;
  }

  // 天気補正
  if (Battle.field.weather === 'sunny') {
    if (move.type === 'ほのお') abilityMult *= 1.5;
    if (move.type === 'みず')   abilityMult *= 0.5;
  }
  if (Battle.field.weather === 'rain') {
    if (move.type === 'みず')   abilityMult *= 1.5;
    if (move.type === 'ほのお') abilityMult *= 0.5;
  }

  // 壁補正
  if (Battle.field.reflect > 0 && move.category === 'physical' && !crit) abilityMult *= 0.5;
  if (Battle.field.lightScreen > 0 && move.category === 'special'  && !crit) abilityMult *= 0.5;

  // STAB (Same Type Attack Bonus)
  const stab = attacker.types.includes(move.type) ? 1.5 : 1.0;

  // 乱数 (85%~100%)
  const random = (randInt(85, 100)) / 100;

  // 技の実効威力
  let power = move.power;
  if (move.effect === 'reversal') {
    const ratio = attacker.currentHp / attacker.maxHp;
    power = ratio <= 0.0417 ? 200 : ratio <= 0.1042 ? 150 : ratio <= 0.2083 ? 100 : ratio <= 0.3542 ? 80 : ratio <= 0.6875 ? 40 : 20;
  }
  if (move.effect === 'doubleVsPoison' && (defender.status === 'psn' || defender.status === 'tox')) power *= 2;
  if (move.effect === 'doubleVsStatus' && defender.status) power *= 2;
  if (move.effect === 'doubleVsSleep'  && defender.status === 'slp') power *= 2;

  // スロースタート
  if (atkAbility?.slowStart && (attacker.flags.battleTurns || 0) < 5) {
    if (move.category === 'physical') abilityMult *= 0.5;
  }

  // やけどで物理ダメージ半減
  if (attacker.status === 'brn' && move.category === 'physical' && !ABILITIES[attacker.ability]?.immuneStatus) {
    abilityMult *= 0.5;
  }

  // 基本ダメージ計算式
  let dmg = Math.floor((Math.floor((Math.floor(2 * attacker.level / 5) + 2) * power * atkStat / defStat) / 50) + 2);
  dmg = Math.floor(dmg * stab * effectiveness * abilityMult * random);
  if (crit) dmg = Math.floor(dmg * 1.5);

  // 最低ダメージは1
  dmg = Math.max(1, dmg);

  // みがわりへのダメージ
  if (defender.flags.substitute && !move.effect?.includes('pierceSub') && !move.effect?.includes('pierceAll')) {
    defender.flags.substituteHp -= dmg;
    if (defender.flags.substituteHp <= 0) {
      delete defender.flags.substitute;
      delete defender.flags.substituteHp;
      addMessage(`${defender.name}のみがわりが壊れた！`);
    }
    return { damage: 0, crit, effectiveness };
  }

  return { damage: dmg, crit, effectiveness };
}

/**
 * ダメージ適用
 */
function applyDamage(mon, damage) {
  if (damage <= 0) return 0;
  const actual = Math.min(mon.currentHp, damage);
  mon.currentHp = Math.max(0, mon.currentHp - actual);
  if (Battle.onUIUpdate) Battle.onUIUpdate();
  return actual;
}

/**
 * HP回復
 */
function healHp(mon, amount) {
  const actual = Math.min(mon.maxHp - mon.currentHp, amount);
  mon.currentHp = Math.min(mon.maxHp, mon.currentHp + actual);
  if (Battle.onUIUpdate) Battle.onUIUpdate();
  return actual;
}

// =====================================================
// 変化技
// =====================================================
async function executeStatusMove(side, move, attacker, defender) {
  const target = move.target === 'self' ? attacker : defender;
  const effect = move.effect;

  switch (effect) {
    case 'substitute':
      const subHp = Math.floor(attacker.maxHp / 4);
      if (attacker.currentHp <= subHp) {
        addMessage('HPが足りない！'); return;
      }
      applyDamage(attacker, subHp);
      attacker.flags.substitute = true;
      attacker.flags.substituteHp = subHp;
      addMessage(`${attacker.name}はみがわりを作った！`);
      break;

    case 'raiseDef2':
      applyStatChange(attacker, 'def', 2, attacker.name);
      break;
    case 'raiseSpd2':
      applyStatChange(attacker, 'spd', 2, attacker.name);
      break;
    case 'raiseSpe2':
      applyStatChange(attacker, 'spe', 2, attacker.name);
      break;
    case 'raiseAll1':
    case 'raiseAll':
      ['atk','def','spa','spd','spe'].forEach(s => applyStatChange(attacker, s, 1, attacker.name));
      break;
    case 'raiseBothDef':
      applyStatChange(attacker, 'def', 1, attacker.name);
      applyStatChange(attacker, 'spd', 1, attacker.name);
      break;
    case 'raiseAtkSpe':
      applyStatChange(attacker, 'atk', 1, attacker.name);
      applyStatChange(attacker, 'spe', 1, attacker.name);
      break;
    case 'raiseSpaSpd':
      applyStatChange(attacker, 'spa', 2, attacker.name);
      applyStatChange(attacker, 'spd', 2, attacker.name);
      break;
    case 'raiseAtkDefSpaSped':
      ['atk','def','spa','spd'].forEach(s => applyStatChange(attacker, s, 1, attacker.name));
      break;

    case 'lowerAtk1':
      applyStatChange(defender, 'atk', -1, attacker.name);
      break;
    case 'lowerAtkSpa':
      applyStatChange(defender, 'atk', -1, attacker.name);
      applyStatChange(defender, 'spa', -1, attacker.name);
      break;
    case 'lowerDefSpdef':
      applyStatChange(defender, 'def', -1, attacker.name);
      applyStatChange(defender, 'spd', -1, attacker.name);
      break;
    case 'lowerAtkSpaSpeed':
      applyStatChange(defender, 'atk', -1, attacker.name);
      applyStatChange(defender, 'spa', -1, attacker.name);
      applyStatChange(defender, 'spe', -1, attacker.name);
      break;
    case 'lowerAtkSpa1':
      applyStatChange(defender, 'atk', -1, attacker.name);
      applyStatChange(defender, 'spa', -1, attacker.name);
      break;

    case 'sleep':
      if (target === defender) inflictStatus(defender, 'slp', attacker.name);
      else inflictStatus(attacker, 'slp', attacker.name);
      break;
    case 'paralyze':
      inflictStatus(defender, 'par', attacker.name);
      break;
    case 'toxicPoison':
      inflictStatus(defender, 'tox', attacker.name);
      break;

    case 'healHalf':
      const h = Math.floor(attacker.maxHp / 2);
      healHp(attacker, h);
      attacker.status = null;
      addMessage(`${attacker.name}のHPが${h}回復した！状態異常が治った！`);
      break;

    case 'deepSleep':
      attacker.status = 'slp';
      attacker.statusTurns = 3;
      healHp(attacker, attacker.maxHp);
      ['atk','def','spa','spd','spe'].forEach(s => applyStatChange(attacker, s, 1, attacker.name));
      addMessage(`${attacker.name}は深く眠って全回復した！`);
      break;

    case 'moonlight':
      const moonHeal = Battle.field.weather === 'sunny' ? Math.floor(attacker.maxHp * 2/3) : Math.floor(attacker.maxHp / 4);
      healHp(attacker, moonHeal);
      addMessage(`${attacker.name}は月の光でHP${moonHeal}回復！`);
      break;

    case 'leechSeed':
      if (defender.types.includes('くさ')) {
        addMessage('くさタイプには効かない！');
      } else {
        defender.flags.leechSeed = true;
        addMessage(`${defender.name}にやどりぎのたねが植えられた！`);
      }
      break;

    case 'disable':
      // 最後に使った技を封じる
      if (defender.lastUsedMove) {
        defender.flags.disabled = { move: defender.lastUsedMove, turns: 3 };
        addMessage(`${defender.name}の ${defender.lastUsedMove} は封じられた！`);
      }
      break;

    case 'copyStatChanges':
      attacker.statStages = { ...defender.statStages };
      addMessage(`${attacker.name}はじこあんじをした！`);
      break;

    case 'clearStatChanges':
      defender.statStages = { atk:0, def:0, spa:0, spd:0, spe:0, acc:0, eva:0 };
      addMessage(`${defender.name}の能力変化がリセットされた！`);
      break;

    case 'clearAndDmg':
      defender.statStages = { atk:0, def:0, spa:0, spd:0, spe:0, acc:0, eva:0 };
      addMessage(`${defender.name}の能力変化がリセットされた！`);
      break;

    case 'lightScreen5':
      Battle.field.lightScreen = 5;
      addMessage('ひかりのかべが張られた！（5ターン）');
      break;

    case 'confuse100':
      inflictConfusion(defender);
      break;

    case 'switch':
      // テレポート等
      addMessage(`${attacker.name}は交代しようとした！`);
      break;

    case 'encore':
      if (defender.lastUsedMove) {
        defender.flags.encore = { move: defender.lastUsedMove, turns: 3 };
        addMessage(`${defender.name}はあんこ～るを受けた！`);
      }
      break;

    case 'transform':
      addMessage(`${attacker.name}は ${defender.name} に変身した！`);
      attacker.flags.transformed = true;
      // 簡易: ステータス・技をコピー
      attacker.stats = { ...defender.stats };
      attacker.moves = [...defender.moves];
      attacker.movePPs = {};
      defender.moves.forEach(m => { attacker.movePPs[m] = Math.min(5, MOVES[m]?.pp || 5); });
      break;

    case 'typeChange':
      attacker.types = ['ぷゆ', 'あく'];
      applyStatChange(attacker, 'atk', 2, attacker.name);
      addMessage(`${attacker.name}はぷゆ・あくタイプに変身した！攻撃が上がった！`);
      break;

    case 'sacrificeRaiseAll':
      applyDamage(attacker, Math.floor(attacker.maxHp / 2));
      ['atk','def','spa','spd','spe'].forEach(s => applyStatChange(attacker, s, 2, attacker.name));
      addMessage(`${attacker.name}は悪魔と契約した！全能力が大幅UP！`);
      break;

    case 'hazardField':
      Battle.field.hazard = true;
      addMessage('フィールドに呪いがかけられた！');
      break;

    case 'revealAll':
      addMessage(`${defender.name}の全情報が明らかになった！`);
      Battle.enemyMon.flags.revealed = true;
      break;

    case 'confuseOrDown':
      if (Math.random() < 0.5) {
        inflictConfusion(defender);
      } else {
        applyStatChange(defender, 'atk', -1, attacker.name);
      }
      break;

    case 'countdown3':
      defender.flags.countdown = 3;
      addMessage(`${defender.name}にムジュラの歌が！3ターン後に…！`);
      break;

    case 'future':
    case 'futureAttack2':
      Battle.field.futureAttack = { turns: 2, power: 120, attacker: attacker.name };
      addMessage(`${attacker.name}は未来を予知した！`);
      break;

    case 'sunny':
      Battle.field.weather = 'sunny';
      Battle.field.weatherTurns = 5;
      addMessage('ひざしがつよくなった！');
      break;

    case 'rain':
      Battle.field.weather = 'rain';
      Battle.field.weatherTurns = 5;
      addMessage('あめがふりはじめた！');
      break;

    case 'disableAbility':
      addMessage(`${defender.name}の特性が無効化された！`);
      defender.flags.abilityDisabled = true;
      break;

    case 'healAll':
      healHp(attacker, attacker.maxHp);
      attacker.status = null;
      addMessage(`${attacker.name}のHPが全回復した！`);
      break;

    default:
      addMessage(`${attacker.name}の技が発動した！`);
  }
}

// =====================================================
// 追加効果
// =====================================================
async function processSecondaryEffect(move, attacker, defender, side) {
  if (!move.effect || move.category === 'status') return;
  if (ABILITIES[defender.ability]?.blockSecondary) return; // おうごんのからだ

  const eff = move.effect;

  if (eff === 'burn10'   && Math.random() < 0.10) inflictStatus(defender, 'brn', attacker.name);
  if (eff === 'burn100'  || eff === 'burn')        inflictStatus(defender, 'brn', attacker.name);
  if (eff === 'paralyze10' && Math.random() < 0.10) inflictStatus(defender, 'par', attacker.name);
  if (eff === 'paralyze30' && Math.random() < 0.30) inflictStatus(defender, 'par', attacker.name);
  if (eff === 'paralyze' || eff === 'paralyze100')  inflictStatus(defender, 'par', attacker.name);
  if (eff === 'freeze10'  && Math.random() < 0.10) inflictStatus(defender, 'frz', attacker.name);
  if (eff === 'freeze30'  && Math.random() < 0.30) inflictStatus(defender, 'frz', attacker.name);
  if (eff === 'freeze50'  && Math.random() < 0.50) inflictStatus(defender, 'frz', attacker.name);
  if (eff === 'poison30'  && Math.random() < 0.30) inflictStatus(defender, 'psn', attacker.name);
  if (eff === 'poison100')                          inflictStatus(defender, 'psn', attacker.name);
  if (eff === 'confuse10' && Math.random() < 0.10) inflictConfusion(defender);
  if (eff === 'confuse30' && Math.random() < 0.30) inflictConfusion(defender);
  if (eff === 'confuse50' && Math.random() < 0.50) inflictConfusion(defender);
  if (eff === 'flinch20'  && Math.random() < 0.20) defender.flags.flinch = true;
  if (eff === 'flinch30'  && Math.random() < 0.30) defender.flags.flinch = true;

  if (eff === 'defDrop20'   && Math.random() < 0.20) applyStatChange(defender, 'def', -1, attacker.name);
  if (eff === 'defDrop50'   && Math.random() < 0.50) applyStatChange(defender, 'def', -1, attacker.name);
  if (eff === 'defDrop100')                           applyStatChange(defender, 'def', -1, attacker.name);
  if (eff === 'spdefDrop10' && Math.random() < 0.10) applyStatChange(defender, 'spd', -1, attacker.name);
  if (eff === 'spdefDrop20' && Math.random() < 0.20) applyStatChange(defender, 'spd', -1, attacker.name);
  if (eff === 'spdefDrop50' && Math.random() < 0.50) applyStatChange(defender, 'spd', -1, attacker.name);
  if (eff === 'spaDrop30'   && Math.random() < 0.30) applyStatChange(defender, 'spa', -1, attacker.name);
  if (eff === 'spaDrop100')                           applyStatChange(defender, 'spa', -1, attacker.name);
  if (eff === 'spaDrop2')                             applyStatChange(attacker, 'spa', -2, attacker.name);
  if (eff === 'speDrop100')                           applyStatChange(defender, 'spe', -1, attacker.name);
  if (eff === 'defSpdefDrop1') { applyStatChange(attacker,'def',-1,attacker.name); applyStatChange(attacker,'spd',-1,attacker.name); }

  if (eff === 'recoil33') {
    const recoil = Math.max(1, Math.floor(attacker.maxHp / 4));
    applyDamage(attacker, recoil);
    addMessage(`${attacker.name}は反動ダメージを受けた！`);
  }
  if (eff === 'recoil33_burn10') {
    const recoil = Math.max(1, Math.floor(attacker.maxHp / 4));
    applyDamage(attacker, recoil);
    addMessage(`${attacker.name}は反動ダメージを受けた！`);
    if (Math.random() < 0.10) inflictStatus(defender, 'brn', attacker.name);
  }
  if (eff === 'recoilHalf') {
    applyDamage(attacker, Math.floor(attacker.maxHp / 2));
    addMessage(`${attacker.name}は大きな反動ダメージを受けた！`);
  }
  if (eff === 'recoilSpaDrop') {
    applyStatChange(attacker, 'spa', -2, attacker.name);
  }

  if (eff === 'rageAtk') {
    applyStatChange(attacker, 'atk', 1, attacker.name);
    applyStatChange(attacker, 'spa', 1, attacker.name);
  }
  if (eff === 'speedUpEachUse') applyStatChange(attacker, 'spe', 1, attacker.name);
  if (eff === 'highCrit') { /* 急所率は calcDamage で処理 */ }
  if (eff === 'recharge') attacker.flags.recharging = true;

  if (eff === 'destiny') {
    const destDmg = Math.min(attacker.currentHp, defender.currentHp);
    applyDamage(attacker, attacker.currentHp);
    applyDamage(defender, destDmg);
    addMessage(`${attacker.name}はいのちがけをした！`);
  }

  if (eff === 'levelDamage') {
    applyDamage(defender, attacker.level);
    addMessage(`${defender.name}に${attacker.level}ダメージ！`);
  }

  if (eff === 'ohko10' && Math.random() < 0.10) {
    applyDamage(defender, defender.currentHp);
    addMessage('一撃必殺！！');
  }

  if (eff === 'multihit35' || eff === 'multihit45') {
    const count = eff === 'multihit45' ? randInt(4, 5) : randInt(2, 5);
    for (let i = 1; i < count; i++) {
      const { damage } = calcDamage(attacker, defender, Battle.currentMove || {type:'ノーマル', category:'physical', power: 25});
      applyDamage(defender, damage);
    }
    addMessage(`${count}回ヒット！`);
  }

  if (eff === 'twiceHit') {
    const { damage } = calcDamage(attacker, defender, { type: attacker.types[0], category:'physical', power:65 });
    applyDamage(defender, damage);
    addMessage('2回ヒット！');
  }

  if (eff === 'attract20' && Math.random() < 0.20) {
    defender.flags.infatuated = true;
    addMessage(`${defender.name}はメロメロになった！`);
  }

  if (eff === 'breakScreens') {
    Battle.field.lightScreen = 0;
    Battle.field.reflect = 0;
    addMessage('ひかりのかべとリフレクターが壊れた！');
  }

  if (eff === 'surviveOnce' && !attacker.flags.survived) {
    attacker.flags.survived = true;
    addMessage(`${attacker.name}は次のひんし状態を1回無効化する！`);
  }

  if (eff === 'pierce' || eff === 'pierceAll') {
    // 耐性無視は calcDamage 内で effectiveness を1にする処理で対応済み
  }
}

// =====================================================
// 技の副作用処理
// =====================================================
async function processMoveSideEffect(move, attacker, defender, damage) {
  // 吸収
  if (move.type === 'くさ' && move.name === 'メガドレイン') {
    const heal = Math.floor(damage / 2);
    healHp(attacker, heal);
    addMessage(`${attacker.name}はHPを${heal}吸収した！`);
  }
  // いのちのたま反動
  if (attacker.item === 'いのちのたま' && damage > 0) {
    const recoil = Math.max(1, Math.floor(attacker.maxHp / 10));
    applyDamage(attacker, recoil);
  }
  // ゴツゴツメット
  if (defender.item === 'ゴツゴツメット' && move.contact) {
    const contactDmg = Math.floor(attacker.maxHp / 6);
    applyDamage(attacker, contactDmg);
    addMessage(`${defender.name}のゴツゴツメットで${attacker.name}が傷ついた！`);
  }
  // はりきり反動
  if (ABILITIES[attacker.ability]?.physicalAccMult) {
    // 命中率は既に判定済み
  }
}

// =====================================================
// わるあがき
// =====================================================
async function executeStruggle(side) {
  const attacker = side === 'player' ? Battle.playerMon : Battle.enemyMon;
  const defender  = side === 'player' ? Battle.enemyMon  : Battle.playerMon;
  addMessage(`${attacker.name}はわるあがきをした！`);
  const dmg = Math.max(1, Math.floor(attacker.stats.atk / 4));
  applyDamage(defender, dmg);
  const selfDmg = Math.max(1, Math.floor(attacker.maxHp / 4));
  applyDamage(attacker, selfDmg);
  addMessage(`${attacker.name}は反動ダメージを受けた！`);
  if (defender.currentHp <= 0) await handleFaint(side === 'player' ? 'enemy' : 'player');
  if (attacker.currentHp <= 0) await handleFaint(side);
}

// =====================================================
// アイテム使用（バトル中）
// =====================================================
async function executeItemAction(side, itemName) {
  if (side !== 'player') return;
  const item = ITEMS[itemName];
  if (!item) return;

  if (!removeItemFromBag(Game.bag, itemName)) {
    addMessage('アイテムが見つからない！');
    return;
  }

  const mon = Battle.playerMon;
  const effect = item.effect;
  if (!effect) return;

  switch (effect.type) {
    case 'heal':
      const healed = healHp(mon, effect.amount);
      addMessage(`${mon.name}のHPが${healed}回復した！`);
      break;
    case 'healFull':
      healHp(mon, mon.maxHp);
      if (effect.cureAll) mon.status = null;
      addMessage(`${mon.name}のHPが全回復した！`);
      break;
    case 'revive':
      if (mon.currentHp > 0) { addMessage('ひんし状態じゃない！'); break; }
      mon.currentHp = Math.max(1, Math.floor(mon.maxHp * effect.amount));
      addMessage(`${mon.name}が復活した！`);
      break;
    case 'cureStatus':
      if (effect.statuses.includes(mon.status)) {
        mon.status = null;
        addMessage(`${mon.name}の状態異常が治った！`);
      }
      break;
    case 'statUp':
      if (effect.target === 'self') applyStatChange(mon, effect.stat, effect.stage, mon.name);
      else applyStatChange(Battle.enemyMon, effect.stat, -effect.stage, mon.name);
      break;
    case 'clearEnemyStats':
      Battle.enemyMon.statStages = {atk:0,def:0,spa:0,spd:0,spe:0,acc:0,eva:0};
      addMessage('敵の能力変化がリセットされた！');
      break;
    case 'inflictStatus':
      if (effect.target === 'enemy') inflictStatus(Battle.enemyMon, effect.status, 'アイテム');
      break;
    default:
      addMessage(`${itemName}を使った！`);
  }
}

// =====================================================
// 交代
// =====================================================
async function executeSwitchAction(side, partyIndex) {
  if (side === 'player') {
    const newMon = Game.party[partyIndex];
    if (!newMon || newMon.currentHp <= 0) {
      addMessage('そのぷゆモンは戦えない！');
      return;
    }
    addMessage(`${Battle.playerMon.name}、もどれ！`);
    resetBattleMonState(Battle.playerMon);
    Battle.playerPartyIndex = partyIndex;
    Battle.playerMon = newMon;
    resetBattleMonState(newMon);
    triggerAbilityOnEntry(newMon, Battle);
    addMessage(`いけ！${newMon.name}！`);
  } else {
    // 敵の交代
    const nextIndex = (Battle.enemyPartyIndex + 1) < Battle.enemyParty.length
      ? Battle.enemyPartyIndex + 1 : Battle.enemyPartyIndex;
    const newMon = Battle.enemyParty[nextIndex];
    if (!newMon || newMon.currentHp <= 0) return;
    addMessage(`${Battle.trainer?.name || '相手'}は ${newMon.name} を出した！`);
    Battle.enemyPartyIndex = nextIndex;
    Battle.enemyMon = newMon;
    resetBattleMonState(newMon);
    seePuyuMon(newMon.speciesId);
    triggerAbilityOnEntry(newMon, Battle);
  }
  if (Battle.onUIUpdate) Battle.onUIUpdate();
}

// =====================================================
// にげる
// =====================================================
async function executeRunAction() {
  if (Battle.type !== 'wild') {
    addMessage('トレーナーバトルからは逃げられない！');
    return;
  }
  // 逃げる判定
  const playerSpe = getEffectiveStat(Battle.playerMon, 'spe');
  const enemySpe  = getEffectiveStat(Battle.enemyMon, 'spe');
  if (playerSpe >= enemySpe || Math.random() < 0.5) {
    addMessage('うまく逃げ切れた！');
    Battle.escaped = true;
    endBattle('escaped');
  } else {
    addMessage('逃げることができなかった！');
  }
}

// =====================================================
// ぷゆボール投げ
// =====================================================
async function throwBall(ballName) {
  if (Battle.type !== 'wild') {
    addMessage('トレーナーのぷゆモンは捕まえられない！');
    return;
  }
  if (!removeItemFromBag(Game.bag, ballName)) {
    addMessage(`${ballName}が見つからない！`);
    return;
  }

  addMessage(`${ballName}を投げた！`);
  const prob = calcCatchProbability(Battle.enemyMon, ballName, Battle.turn);

  // ボール揺れアニメ（3回揺れるか判定）
  const shakes = [];
  for (let i = 0; i < 4; i++) {
    if (Math.random() < prob) shakes.push(true);
    else { shakes.push(false); break; }
  }

  const caught = shakes.length === 4;

  if (caught) {
    addMessage(`捕まえた！${Battle.enemyMon.name}をゲットした！`);
    Battle.captured = true;
    Game.stats.captures++;
    catchPuyuMon(Battle.enemyMon.speciesId);
    const mon = Battle.enemyMon;
    mon.caughtAt = new Date().toISOString();
    mon.caughtLevel = mon.level;
    mon.originalTrainer = Game.player.name;
    mon.originalTrainerId = Game.player.id;

    if (!addToParty(mon)) {
      addToBox(mon);
      addMessage(`パーティがいっぱいなのでボックスに送った！`);
    }
    endBattle('captured');
  } else {
    const shakeCount = shakes.filter(Boolean).length;
    const msgs = ['あと少しだったのに！', 'もう少し！', '惜しい！', 'ダメだった…'];
    addMessage(msgs[Math.min(shakeCount, msgs.length - 1)]);
    // 敵のターン継続
    const enemyAction = decideEnemyAction();
    await executeAction('enemy', enemyAction);
    if (!Battle.ended) await processTurnEnd();
  }
}

// =====================================================
// ターン終了処理
// =====================================================
async function processTurnEnd() {
  Battle.turn++;

  // 天気ダメージ
  await processWeatherEnd();

  // やどりぎのたね
  await processLeechSeed(Battle.playerMon, Battle.enemyMon);
  await processLeechSeed(Battle.enemyMon, Battle.playerMon);

  // 状態異常ダメージ
  await processStatusDamage(Battle.playerMon);
  await processStatusDamage(Battle.enemyMon);

  // 持ち物効果（たべのこし等）
  await processHeldItemEndTurn(Battle.playerMon);
  await processHeldItemEndTurn(Battle.enemyMon);

  // 特性（毎ターン効果）
  await processAbilityEndTurn(Battle.playerMon, Battle);
  await processAbilityEndTurn(Battle.enemyMon, Battle);

  // カウントダウン
  await processCountdown(Battle.playerMon);
  await processCountdown(Battle.enemyMon);

  // 封じ・アンコールターン数
  if (Battle.playerMon.flags.disabled) {
    Battle.playerMon.flags.disabled.turns--;
    if (Battle.playerMon.flags.disabled.turns <= 0) delete Battle.playerMon.flags.disabled;
  }

  // 壁ターン数
  if (Battle.field.lightScreen > 0) Battle.field.lightScreen--;
  if (Battle.field.reflect > 0) Battle.field.reflect--;
  if (Battle.field.weatherTurns > 0) {
    Battle.field.weatherTurns--;
    if (Battle.field.weatherTurns <= 0) {
      addMessage('天気がもとに戻った。');
      Battle.field.weather = null;
    }
  }
  if (Battle.field.trickRoom && Battle.field.trickRoomTurns > 0) {
    Battle.field.trickRoomTurns--;
    if (Battle.field.trickRoomTurns <= 0) Battle.field.trickRoom = false;
  }

  // 未来予知
  if (Battle.field.futureAttack) {
    Battle.field.futureAttack.turns--;
    if (Battle.field.futureAttack.turns <= 0) {
      const fa = Battle.field.futureAttack;
      addMessage(`${fa.attacker}のみらいよちが発動した！`);
      const dmg = Math.floor(Battle.enemyMon.maxHp * 0.25);
      applyDamage(Battle.enemyMon, dmg);
      delete Battle.field.futureAttack;
      if (Battle.enemyMon.currentHp <= 0) await handleFaint('enemy');
    }
  }

  // バトルターン数カウント
  if (Battle.playerMon) Battle.playerMon.flags.battleTurns = (Battle.playerMon.flags.battleTurns || 0) + 1;
  if (Battle.enemyMon)  Battle.enemyMon.flags.battleTurns  = (Battle.enemyMon.flags.battleTurns  || 0) + 1;

  // フリンチリセット
  if (Battle.playerMon) Battle.playerMon.flags.flinch = false;
  if (Battle.enemyMon)  Battle.enemyMon.flags.flinch  = false;

  if (Battle.onUIUpdate) Battle.onUIUpdate();
}

async function processWeatherEnd() {
  if (!Battle.field.weather) return;
  const weather = Battle.field.weather;
  const applyWeatherDmg = (mon) => {
    if (!mon || mon.currentHp <= 0) return;
    if (weather === 'sandstorm' && !mon.types.some(t => ['いわ','はがね','じめん'].includes(t))) {
      const dmg = Math.floor(mon.maxHp / 16);
      applyDamage(mon, dmg);
      addMessage(`${mon.name}はすなあらしでダメージを受けた！`);
    }
    if (weather === 'hail' && !mon.types.includes('こおり')) {
      const dmg = Math.floor(mon.maxHp / 16);
      applyDamage(mon, dmg);
      addMessage(`${mon.name}はひょうがすでダメージを受けた！`);
    }
  };
  applyWeatherDmg(Battle.playerMon);
  applyWeatherDmg(Battle.enemyMon);
}

async function processLeechSeed(planted, host) {
  if (!planted?.flags?.leechSeed || !host || planted.currentHp <= 0) return;
  if (host.currentHp <= 0) return;
  const dmg = Math.max(1, Math.floor(host.maxHp / 8));
  applyDamage(host, dmg);
  healHp(planted, dmg);
  addMessage(`${host.name}はやどりぎのたねで体力を奪われた！`);
  if (host.currentHp <= 0) {
    await handleFaint(host === Battle.playerMon ? 'player' : 'enemy');
  }
}

async function processStatusDamage(mon) {
  if (!mon || mon.currentHp <= 0) return;
  // マジックガード特性チェック
  if (ABILITIES[mon.ability]?.noIndirectDamage) return;

  if (mon.status === 'brn') {
    const dmg = Math.max(1, Math.floor(mon.maxHp / 16));
    applyDamage(mon, dmg);
    addMessage(`${mon.name}はやけどのダメージを受けた！`);
    if (mon.currentHp <= 0) await handleFaint(mon === Battle.playerMon ? 'player' : 'enemy');
  }
  if (mon.status === 'psn') {
    const dmg = Math.max(1, Math.floor(mon.maxHp / 8));
    applyDamage(mon, dmg);
    addMessage(`${mon.name}はどくのダメージを受けた！`);
    if (mon.currentHp <= 0) await handleFaint(mon === Battle.playerMon ? 'player' : 'enemy');
  }
  if (mon.status === 'tox') {
    mon.statusTurns = (mon.statusTurns || 1);
    const dmg = Math.max(1, Math.floor(mon.maxHp * mon.statusTurns / 16));
    applyDamage(mon, dmg);
    mon.statusTurns++;
    addMessage(`${mon.name}はもうどくのダメージを受けた！`);
    if (mon.currentHp <= 0) await handleFaint(mon === Battle.playerMon ? 'player' : 'enemy');
  }
  if (mon.status === 'slp') {
    mon.statusTurns = (mon.statusTurns || 0) + 1;
    if (mon.statusTurns >= (mon.flags.sleepTurns || 3)) {
      mon.status = null;
      mon.statusTurns = 0;
      addMessage(`${mon.name}は目を覚ました！`);
    }
  }
}

async function processHeldItemEndTurn(mon) {
  if (!mon || !mon.item || mon.currentHp <= 0) return;
  const item = ITEMS[mon.item];
  if (!item?.effect) return;

  if (item.effect.type === 'endTurnHeal') {
    const heal = Math.floor(mon.maxHp / item.effect.fraction);
    if (mon.currentHp < mon.maxHp) {
      healHp(mon, heal);
    }
  }
  if (item.effect.type === 'lum' && mon.status) {
    mon.status = null;
    addMessage(`${mon.name}のラムのみが発動した！状態異常が治った！`);
    mon.item = null;
  }
  if (item.effect.type === 'sitrusberry' && mon.currentHp <= mon.maxHp / 2 && !mon.flags.sitrusUsed) {
    const heal = Math.floor(mon.maxHp / 4);
    healHp(mon, heal);
    addMessage(`${mon.name}のオボンのみが発動！HP${heal}回復！`);
    mon.flags.sitrusUsed = true;
    mon.item = null;
  }
  if (item.effect.type === 'lifeOrb') {
    const recoil = Math.max(1, Math.floor(mon.maxHp / 10));
    if (mon.flags.lifeOrbUsed) {
      applyDamage(mon, recoil);
      mon.flags.lifeOrbUsed = false;
    }
  }
  if (item.effect.type === 'weaknessPolicy' && mon.flags.weaknessPolicyTriggered) {
    applyStatChange(mon, 'atk', 2, mon.name + '(じゃくてんほけん)');
    applyStatChange(mon, 'spa', 2, mon.name + '(じゃくてんほけん)');
    mon.item = null;
    mon.flags.weaknessPolicyTriggered = false;
  }
  if (item.effect.type === 'berry' && mon.currentHp <= mon.maxHp / 4 && !mon.flags.berryUsed) {
    applyStatChange(mon, item.effect.stat, 1, mon.name);
    addMessage(`${mon.name}の${mon.item}が発動！`);
    mon.flags.berryUsed = true;
    mon.item = null;
  }
  if (item.effect.type === 'blackSludge') {
    if (mon.types.includes('どく')) {
      healHp(mon, Math.floor(mon.maxHp / 16));
    } else {
      applyDamage(mon, Math.floor(mon.maxHp / 8));
      addMessage(`${mon.name}はくろいヘドロのダメージを受けた！`);
    }
  }
}

async function processAbilityEndTurn(mon, battle) {
  if (!mon || mon.currentHp <= 0) return;
  const ab = ABILITIES[mon.ability];
  if (!ab) return;

  if (ab.endTurnHeal) {
    healHp(mon, Math.floor(mon.maxHp / ab.endTurnHeal));
  }
  if (ab.endTurnBurn30 && Battle.enemyMon && Math.random() < 0.30) {
    const target = mon === Battle.playerMon ? Battle.enemyMon : Battle.playerMon;
    inflictStatus(target, 'brn', mon.name);
  }
  if (ab.endTurnSleep20 && Battle.enemyMon && Math.random() < 0.20) {
    const target = mon === Battle.playerMon ? Battle.enemyMon : Battle.playerMon;
    inflictStatus(target, 'slp', mon.name);
  }
  if (ab.endTurnLowerAtk) {
    const target = mon === Battle.playerMon ? Battle.enemyMon : Battle.playerMon;
    if (target) applyStatChange(target, 'atk', -1, mon.name);
    if (target) applyStatChange(target, 'spa', -1, mon.name);
  }
  if (ab.endTurnDrain8) {
    const target = mon === Battle.playerMon ? Battle.enemyMon : Battle.playerMon;
    if (target) {
      const dmg = Math.floor(target.maxHp / 8);
      applyDamage(target, dmg);
      healHp(mon, dmg);
    }
  }
  if (ab.endTurnSpeUp) applyStatChange(mon, 'spe', 1, mon.name);
  if (ab.adventureBuff) {
    applyStatChange(mon, 'spe', 1, mon.name);
    applyStatChange(mon, 'spa', 1, mon.name);
  }
  if (ab.fallDown) {
    applyDamage(mon, Math.floor(mon.maxHp / 16));
    applyStatChange(mon, 'atk', 1, mon.name);
    applyStatChange(mon, 'spa', 1, mon.name);
  }
}

async function processCountdown(mon) {
  if (!mon?.flags?.countdown) return;
  mon.flags.countdown--;
  addMessage(`${mon.name}のカウントダウン：あと${mon.flags.countdown}ターン…`);
  if (mon.flags.countdown <= 0) {
    applyDamage(mon, mon.currentHp);
    delete mon.flags.countdown;
    addMessage(`${mon.name}はムジュラの歌によってひんしになった！`);
    await handleFaint(mon === Battle.playerMon ? 'player' : 'enemy');
  }
}

// =====================================================
// 状態異常
// =====================================================
function inflictStatus(mon, status, attackerName) {
  if (mon.status) return false; // 既に状態異常
  if (ABILITIES[mon.ability]?.immuneStatus) return false;
  if (ABILITIES[mon.ability]?.immunePoison && (status === 'psn' || status === 'tox')) return false;
  if (ABILITIES[mon.ability]?.immuneSleep && status === 'slp') return false;
  if (ABILITIES[mon.ability]?.immuneFreeze && status === 'frz') return false;
  if (ABILITIES[mon.ability]?.immuneAllStatus) return false;

  // タイプ免疫
  if (status === 'brn' && mon.types.includes('ほのお')) return false;
  if (status === 'frz' && mon.types.includes('こおり')) return false;
  if ((status === 'psn' || status === 'tox') && (mon.types.includes('どく') || mon.types.includes('はがね'))) return false;
  if (status === 'par' && mon.types.includes('でんき')) return false;

  // 起こり得る
  mon.status = status;
  mon.statusTurns = status === 'slp' ? randInt(1, 3) : 0;
  if (status === 'slp') mon.flags.sleepTurns = mon.statusTurns;

  const msgs = { par:'まひ', brn:'やけど', psn:'どく', tox:'もうどく', frz:'こおり', slp:'ねむり' };
  addMessage(`${mon.name}は${msgs[status]}状態になった！`);

  if (Battle.onUIUpdate) Battle.onUIUpdate();
  return true;
}

function inflictConfusion(mon) {
  if (mon.flags.confused) return;
  mon.flags.confused = true;
  mon.flags.confusedTurns = randInt(2, 5);
  addMessage(`${mon.name}は混乱した！`);
}

// =====================================================
// ステータス変化
// =====================================================
function applyStatChange(mon, stat, stage, sourceName) {
  if (!mon || !mon.statStages) return;

  // クリアボディ・反転特性チェック
  if (stage < 0 && ABILITIES[mon.ability]?.noStatDown) {
    addMessage(`${mon.name}はクリアボディで能力が下がらない！`);
    return;
  }
  if (ABILITIES[mon.ability]?.contraryStat) stage = -stage;

  const old = mon.statStages[stat] || 0;
  const newStage = clamp(old + stage, -6, 6);
  mon.statStages[stat] = newStage;

  const statLabel = STAT_NAMES[stat] || stat;
  if (stage > 0) {
    const msgs = ['上がった', 'ぐんと上がった', 'ぐーんと上がった'];
    addMessage(`${mon.name}の${statLabel}が${msgs[Math.min(stage - 1, 2)]}！`);
  } else if (stage < 0) {
    const msgs = ['下がった', 'がくっと下がった', 'がくーんと下がった'];
    addMessage(`${mon.name}の${statLabel}が${msgs[Math.min(-stage - 1, 2)]}！`);
  }

  if (Battle.onUIUpdate) Battle.onUIUpdate();
}

// =====================================================
// 命中判定
// =====================================================
function checkAccuracy(attacker, defender, move) {
  if (!move.accuracy || move.accuracy === 0) return true; // 必中

  const baseAcc = move.accuracy / 100;
  const accStage = (attacker.statStages?.acc || 0) - (defender.statStages?.eva || 0);
  const accMult = getAccStageMultiplier(accStage);

  // 霧・やるき特性等
  let finalAcc = baseAcc * accMult;

  // はりきり命中補正
  if (ABILITIES[attacker.ability]?.physicalAccMult && move.category === 'physical') {
    finalAcc *= ABILITIES[attacker.ability].physicalAccMult;
  }

  // 天気（かみなり等）
  if (move.name === 'かみなり' && Battle.field.weather === 'rain') return true;
  if (move.name === 'かみなり' && Battle.field.weather === 'sunny') finalAcc *= 0.5;
  if (move.name === 'ふぶき'   && Battle.field.weather === 'hail')  return true;
  if (move.name === 'ぼうふう' && Battle.field.weather === 'rain')  return true;

  return Math.random() < finalAcc;
}

// =====================================================
// 行動前ステータスチェック
// =====================================================
function checkStatusBeforeMove(mon) {
  // 再充電中
  if (mon.flags.recharging) {
    mon.flags.recharging = false;
    return { blocked: true, msg: `${mon.name}は充電中だ！` };
  }
  // ひるみ
  if (mon.flags.flinch) {
    return { blocked: true, msg: `${mon.name}はひるんで動けない！` };
  }
  // ねむり
  if (mon.status === 'slp') {
    return { blocked: true, msg: `${mon.name}はぐうぐう眠っている…` };
  }
  // まひ（25%で行動不能）
  if (mon.status === 'par' && Math.random() < 0.25) {
    return { blocked: true, msg: `${mon.name}はまひして動けない！` };
  }
  // こおり（20%で溶ける）
  if (mon.status === 'frz') {
    if (Math.random() < 0.2) {
      mon.status = null;
      addMessage(`${mon.name}のこおりがとけた！`);
    } else {
      return { blocked: true, msg: `${mon.name}はこおっていて動けない！` };
    }
  }
  // こんらん
  if (mon.flags.confused) {
    mon.flags.confusedTurns--;
    if (mon.flags.confusedTurns <= 0) {
      mon.flags.confused = false;
      addMessage(`${mon.name}のこんらんが治った！`);
    } else if (Math.random() < 0.5) {
      const dmg = Math.max(1, Math.floor(mon.stats.atk * 0.4));
      applyDamage(mon, dmg);
      addMessage(`${mon.name}はこんらんして自分を傷つけた！`);
      if (mon.currentHp <= 0) {
        const side = mon === Battle.playerMon ? 'player' : 'enemy';
        handleFaint(side);
      }
      return { blocked: true, msg: '' };
    }
  }
  // めろめろ
  if (mon.flags.infatuated && Math.random() < 0.5) {
    return { blocked: true, msg: `${mon.name}はめろめろで動けない！` };
  }
  return { blocked: false };
}

// =====================================================
// 瀕死処理
// =====================================================
async function handleFaint(side) {
  const faintedMon = side === 'player' ? Battle.playerMon : Battle.enemyMon;

  // よみがえり特性
  if (ABILITIES[faintedMon.ability]?.resurrect && !faintedMon.flags.resurrected) {
    faintedMon.currentHp = Math.floor(faintedMon.maxHp / 2);
    faintedMon.flags.resurrected = true;
    addMessage(`${faintedMon.name}はよみがえりで復活した！`);
    if (Battle.onUIUpdate) Battle.onUIUpdate();
    return;
  }

  // ぽぽなみだ特性
  if (ABILITIES[faintedMon.ability]?.onFaint) {
    const result = ABILITIES[faintedMon.ability].onFaint(Battle, faintedMon);
    if (result?.msg) addMessage(result.msg);
    const target = side === 'player' ? Battle.enemyMon : Battle.playerMon;
    if (result?.lowerAtk && target) applyStatChange(target, 'atk', -result.lowerAtk, faintedMon.name);
    if (result?.lowerSpa && target) applyStatChange(target, 'spa', -result.lowerSpa, faintedMon.name);
  }

  animateFaint(side);
  addMessage(`${faintedMon.name}はたおれた！`);
  faintedMon.currentHp = 0;

  if (side === 'enemy') {
    // 経験値計算
    const expGained = calcBattleExp(faintedMon, Battle.type === 'wild', 1);
    const lvEvents = addExp(Battle.playerMon, expGained);
    addMessage(`${Battle.playerMon.name}は${expGained}の経験値を得た！`);

    lvEvents.forEach(ev => {
      if (ev.type === 'levelUp') {
        addMessage(`${Battle.playerMon.name}はレベル${ev.level}に上がった！`);
        Battle.playerMon.flags.levelUpAnim = true;
      }
    });

    // 次の敵がいるか
    const nextEnemyIndex = Battle.enemyParty.findIndex((m, i) => i > Battle.enemyPartyIndex && m && m.currentHp > 0);
    if (nextEnemyIndex >= 0) {
      Battle.enemyPartyIndex = nextEnemyIndex;
      Battle.enemyMon = Battle.enemyParty[nextEnemyIndex];
      resetBattleMonState(Battle.enemyMon);
      seePuyuMon(Battle.enemyMon.speciesId);
      addMessage(`${Battle.trainer?.name || '相手'}は ${Battle.enemyMon.name} を出した！`);
      triggerAbilityOnEntry(Battle.enemyMon, Battle);
    } else {
      // 敵全滅 → プレイヤー勝利
      endBattle('win');
    }
  } else {
    // プレイヤー側ひんし → 次のぷゆモンを選ぶ
    const nextParty = getFirstHealthyPartyMember(Battle.playerPartyIndex);
    if (nextParty < 0) {
      endBattle('lose');
    } else {
      addMessage('次のぷゆモンを選んでください！');
      Battle.needSwitch = true;
    }
  }

  if (Battle.onUIUpdate) Battle.onUIUpdate();
}

// =====================================================
// バトル終了
// =====================================================
function endBattle(result) {
  if (!Battle) return;
  Battle.ended = true;
  Battle.winner = result;

  // バトル後処理
  if (result === 'win') {
    Game.stats.wins++;
    let reward = 0;
    if (Battle.trainer) {
      reward = Battle.trainer.reward || 500;
      addMoney(reward);
      addMessage(`${Battle.trainer.name}に勝った！${reward}Pコインをもらった！`);
    } else if (Battle.gym) {
      reward = Battle.gym.reward || 1000;
      addMoney(reward);
      if (!Game.player.badges.includes(Battle.gym.badge)) {
        Game.player.badges.push(Battle.gym.badge);
        addMessage(`${Battle.gym.badge}をゲットした！`);
      }
    }
    addTrainerExp(50);
  } else if (result === 'lose') {
    addMessage('全てのぷゆモンがたおれた…');
    addMessage(`${Game.player.name}は負けた！`);
    // お金半減
    Game.player.money = Math.floor(Game.player.money / 2);
    // パーティ全回復
    Game.party.forEach(m => {
      if (m) {
        m.currentHp = m.maxHp;
        m.status = null;
      }
    });
  }

  // パーティ状態異常をリセット（バトル外では消える）
  Game.party.forEach(m => {
    if (m) {
      m.statStages = { atk:0, def:0, spa:0, spd:0, spe:0, acc:0, eva:0 };
      m.flags = {};
    }
  });

  if (Battle.onEnd) Battle.onEnd(result);
}

// =====================================================
// 敵AI
// =====================================================
function decideEnemyAction() {
  if (!Battle.enemyMon) return { type: 'move', data: 'たいあたり' };

  const mon = Battle.enemyMon;
  const availableMoves = mon.moves.filter(m => (mon.movePPs[m] || 0) > 0 && !mon.flags.disabled?.move === m);

  if (availableMoves.length === 0) return { type: 'move', data: 'わるあがき' };

  // 交代判定（ピンチなら25%で交代）
  if (Battle.type !== 'wild' && Battle.enemyParty.length > 1 &&
      mon.currentHp <= mon.maxHp * 0.25 && Math.random() < 0.25) {
    const nextIndex = Battle.enemyParty.findIndex((m, i) => i !== Battle.enemyPartyIndex && m && m.currentHp > 0);
    if (nextIndex >= 0) return { type: 'switch', data: nextIndex };
  }

  // 最もダメージが出る技を選ぶ（簡易AI）
  let bestMove = availableMoves[0];
  let bestScore = 0;

  availableMoves.forEach(moveName => {
    const move = MOVES[moveName];
    if (!move) return;
    let score = move.power || 0;
    // タイプ一致ボーナス
    if (mon.types.includes(move.type)) score *= 1.5;
    // 相性ボーナス
    const eff = getTypeEffectiveness(move.type, Battle.playerMon.types);
    score *= eff;
    // ランダム性
    score *= (0.8 + Math.random() * 0.4);

    if (score > bestScore) {
      bestScore = score;
      bestMove = moveName;
    }
  });

  return { type: 'move', data: bestMove };
}

// =====================================================
// 特性トリガー（登場時）
// =====================================================
function triggerAbilityOnEntry(mon, battle) {
  if (!mon) return;
  const ab = ABILITIES[mon.ability];
  if (!ab?.onEntry) return;
  const result = ab.onEntry(battle, mon);
  if (result?.msg) addMessage(result.msg);
  if (result?.lowerAtk !== undefined) {
    const target = mon === battle.playerMon ? battle.enemyMon : battle.playerMon;
    if (target) applyStatChange(target, 'atk', -result.lowerAtk, mon.name);
  }
  if (result?.raiseAll !== undefined) {
    ['atk','def','spa','spd','spe'].forEach(s => applyStatChange(mon, s, result.raiseAll, mon.name));
  }
  if (result?.raiseDodge !== undefined) applyStatChange(mon, 'eva', result.raiseDodge, mon.name);
  if (result?.raiseAtk !== undefined) applyStatChange(mon, 'atk', result.raiseAtk, mon.name);
  if (result?.lowerEnemyAtk !== undefined) {
    const target = mon === battle.playerMon ? battle.enemyMon : battle.playerMon;
    if (target) applyStatChange(target, 'atk', -result.lowerEnemyAtk, mon.name);
  }
  if (result?.lowerEnemySpa !== undefined) {
    const target = mon === battle.playerMon ? battle.enemyMon : battle.playerMon;
    if (target) applyStatChange(target, 'spa', -result.lowerEnemySpa, mon.name);
  }
}

function triggerAbilityOnMiss(mon, battle) {
  if (!mon) return;
  const ab = ABILITIES[mon.ability];
  if (!ab?.missDrain8) return;
  const target = mon === battle.playerMon ? battle.playerMon : battle.enemyMon;
  if (target) {
    const dmg = Math.floor(target.maxHp / 8);
    applyDamage(target, dmg);
    addMessage(`${mon.name}のムジュラののろいで追加ダメージ！`);
  }
}

// =====================================================
// メッセージ管理
// =====================================================
function addMessage(msg) {
  if (!msg) return;
  Battle.messageQueue.push(msg);
  if (Battle.onMessage) Battle.onMessage(msg);
}

// =====================================================
// アニメーション
// =====================================================
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
