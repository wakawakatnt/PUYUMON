// =====================================================
// ぷゆモン - バトル & コアシステム 究極完全版
// （全特性・全技・特殊エフェクト・上限値処理 完全対応）
// =====================================================

const GAME_VERSION = '1.0.2';
const SAVE_KEY = 'puyumon_save';

/**
 * バトル状態管理
 */
let Battle = null;

// =====================================================
// 1. バトル初期化
// =====================================================
function initBattle(opts) {
  const playerPartyIndex = opts.playerPartyIndex !== undefined ? opts.playerPartyIndex : getFirstHealthyPartyMember();
  if (playerPartyIndex < 0) {
    console.error('戦える ぷゆモン がいません！');
    return false;
  }

  let enemyParty = Array.isArray(opts.enemyMon) ? opts.enemyMon : (opts.enemyMon ? [opts.enemyMon] : []);

  Battle = {
    type: opts.type || 'wild',
    trainer: opts.trainer || null,
    turn: 1,
    
    // プレイヤー側
    playerPartyIndex,
    playerMon: Game.party[playerPartyIndex],
    
    // 敵側
    enemyPartyIndex: 0,
    enemyParty,
    enemyMon: enemyParty[0],
    
    // フィールド・天候・罠状態
    field: {
      weather: null, weatherTurns: 0, 
      terrain: null, terrainTurns: 0,
      lightScreen: 0, reflect: 0, auroraVeil: 0, tailwind: 0, 
      trickRoom: false, trickRoomTurns: 0,
      toxicSpikes: 0, stealthRock: false, hazard: false, healingRoom: 0,
      futureAttack: null
    },
    
    // 進行フラグ
    escaped: false, captured: false, ended: false, winner: null,
    messageQueue: [],
    
    // コールバック
    onEnd: opts.onEnd || null, 
    onMessage: opts.onMessage || null, 
    onUIUpdate: opts.onUIUpdate || null,
    turnData: {}
  };

  resetBattleMonState(Battle.playerMon);
  resetBattleMonState(Battle.enemyMon);
  
  if (Battle.enemyMon) seePuyuMon(Battle.enemyMon.speciesId);

  // 登場時の特性発動
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
// 2. ターン進行と行動順・優先度決定
// =====================================================
async function executeTurn(actionType, actionData) {
  if (!Battle || Battle.ended) return;

  const playerAction = { type: actionType, data: actionData };
  const enemyAction  = decideEnemyAction();
  const playerFirst = determineTurnOrder(playerAction, enemyAction);

  if (playerFirst) {
    await executeAction('player', playerAction);
    if (!Battle.ended) await executeAction('enemy', enemyAction);
  } else {
    await executeAction('enemy', enemyAction);
    if (!Battle.ended) await executeAction('player', playerAction);
  }

  if (!Battle.ended) await processTurnEnd();
}

function getMovePriority(action, mon) {
  if (action.type !== 'move') return 0;
  const move = MOVES[action.data];
  if (!move) return 0;
  
  let prio = move.priority || 0;
  const ab = ABILITIES[mon.ability];

  if (ab?.pranksterPriority && move.category === 'status') prio++;
  if (ab?.extraPriority2) prio += 2;
  if (ab?.antennaSpeed) prio += 1;
  if (mon.flags.postSpinPriority) prio += 2;

  return prio;
}

function determineTurnOrder(pAction, eAction) {
  if (pAction.type !== 'move') return true; // アイテム・交代・逃げるは最優先
  if (eAction.type !== 'move') return false;

  const pAb = ABILITIES[Battle.playerMon.ability];
  const eAb = ABILITIES[Battle.enemyMon.ability];
  if (pAb?.maxSpeed || pAb?.ninjaSpeed) return true;
  if (eAb?.maxSpeed || eAb?.ninjaSpeed) return false;

  const pPriority = getMovePriority(pAction, Battle.playerMon);
  const ePriority = getMovePriority(eAction, Battle.enemyMon);
  if (pPriority !== ePriority) return pPriority > ePriority;

  const pSpe = getEffectiveStat(Battle.playerMon, 'spe');
  const eSpe = getEffectiveStat(Battle.enemyMon, 'spe');
  if (Battle.field.trickRoom) return pSpe <= eSpe;
  if (pSpe !== eSpe) return pSpe > eSpe;
  return Math.random() < 0.5;
}

// =====================================================
// 3. アクション実行分岐
// =====================================================
async function executeAction(side, action) {
  if (!Battle || Battle.ended) return;
  const attacker = side === 'player' ? Battle.playerMon : Battle.enemyMon;
  
  if (action.type === 'move') {
    const stCheck = checkStatusBeforeMove(attacker);
    if (stCheck.blocked) { addMessage(stCheck.msg); return; }
    await executeMoveAction(side, action.data);
  } else if (action.type === 'item') {
    await executeItemAction(side, action.data);
  } else if (action.type === 'switch') {
    await executeSwitchAction(side, action.data);
  } else if (action.type === 'run') {
    await executeRunAction();
  }
}

// =====================================================
// 4. 状態チェックと命中判定
// =====================================================
function checkStatusBeforeMove(mon) {
  if (mon.flags.recharging) { mon.flags.recharging = false; return { blocked:true, msg:`${mon.name}は反動で動けない！`}; }
  if (mon.flags.flinch) return { blocked:true, msg:`${mon.name}はひるんで動けない！`};
  if (mon.status === 'slp') return { blocked:true, msg:`${mon.name}はぐうぐう眠っている…`};
  if (mon.status === 'frz') {
    if (Math.random() < 0.2) { mon.status = null; addMessage(`${mon.name}のこおりがとけた！`); }
    else return { blocked:true, msg:`${mon.name}は凍って動けない！`};
  }
  if (mon.status === 'par' && Math.random() < 0.25) return { blocked:true, msg:`${mon.name}はまひして動けない！`};
  if (mon.flags.confused) {
    mon.flags.confusedTurns--;
    if (mon.flags.confusedTurns <= 0) { mon.flags.confused = false; addMessage(`${mon.name}の混乱が解けた！`); }
    else if (Math.random() < 0.5) {
      applyDamage(mon, Math.max(1, Math.floor(mon.stats.atk * 0.4)));
      return { blocked:true, msg:`${mon.name}は混乱して自分を攻撃した！`};
    }
  }
  
  // 特性: くすくすわらい / せんのうもーど
  const opp = mon === Battle.playerMon ? Battle.enemyMon : Battle.playerMon;
  if (opp && ABILITIES[opp.ability]?.moveChance30 && Math.random() < 0.3) {
    return { blocked:true, msg:`${mon.name}は相手のくすくすわらいで技を出せなかった！`};
  }
  if (opp && ABILITIES[opp.ability]?.brainwash30 && Math.random() < 0.3) {
    const available = mon.moves.filter(m => mon.movePPs[m] > 0);
    if (available.length > 0) {
      mon.lastUsedMove = available[Math.floor(Math.random() * available.length)];
      addMessage(`${mon.name}は洗脳されて別の技を選んでしまった！`);
    }
  }
  return { blocked: false };
}

function checkAccuracy(attacker, defender, move) {
  if (!move.accuracy || move.accuracy === 0) return true; // 必中技
  if (attacker.flags.sureHitNext) return true; // 心眼等の必中状態

  const accMult = getAccStageMultiplier((attacker.statStages.acc||0) - (defender.statStages.eva||0));
  let finalAcc = (move.accuracy / 100) * accMult;

  // 特性: はりきり
  if (ABILITIES[attacker.ability]?.physicalAccMult && move.category === 'physical') {
    finalAcc *= ABILITIES[attacker.ability].physicalAccMult;
  }

  const isHit = Math.random() < finalAcc;

  // 特性: 5おくねん (回避時に5ターンに1回スタン)
  if (!isHit && ABILITIES[defender.ability]?.fiveHundredMillion) {
    defender.flags.dodgeCount = (defender.flags.dodgeCount || 0) + 1;
    if (defender.flags.dodgeCount >= 5) {
      defender.flags.dodgeCount = 0;
      defender.flags.flinch = true;
      addMessage(`${defender.name}は技をかわしたが「5おくねんボタン」を押してしまい気が遠くなった！(次ターン行動不能)`);
    }
  }
  return isHit;
}

// =====================================================
// 5. 技実行のメインロジック
// =====================================================
async function executeMoveAction(side, moveName) {
  const attacker = side === 'player' ? Battle.playerMon : Battle.enemyMon;
  const defender = side === 'player' ? Battle.enemyMon : Battle.playerMon;
  
  // 洗脳等で技が上書きされている場合のケア
  const move = MOVES[attacker.lastUsedMove] || MOVES[moveName]; 
  if (!move) { addMessage('技が見つからない！'); return; }

  // PP消費処理
  if (attacker.movePPs[move.name] !== undefined) {
    attacker.movePPs[move.name] = Math.max(0, attacker.movePPs[move.name] - 1);
    // 全PP0ならわるあがきへ
    if (Object.values(attacker.movePPs).every(pp => pp === 0)) return await executeStruggle(side);
  }

  addMessage(`${attacker.name}の ${move.name}！`);
  animateAttack(side);

  // 命中判定
  if (!checkAccuracy(attacker, defender, move)) {
    addMessage(`${attacker.name}の攻撃は外れた！`);
    if (ABILITIES[attacker.ability]?.missToSureHit) attacker.flags.sureHitNext = true;
    triggerAbilityOnMiss(defender, Battle);
    return;
  }
  
  attacker.flags.sureHitNext = false;
  attacker.lastUsedMove = move.name;

  // 相手の特性による技無効化（ふしぎなまもり等）
  if (ABILITIES[defender.ability]?.onHit) {
    const res = ABILITIES[defender.ability].onHit(Battle, attacker, defender, move);
    if (res?.blocked) { addMessage(res.msg); return; }
  }

  // ① 技使用時(Use)のエフェクト処理
  await processEffectsByTrigger('use', move, attacker, defender, side);

  // ② ダメージ処理 (変化技以外)
  if (move.category !== 'status') {
    const hits = move.fixedHits || (move.multiHit ? Math.floor(Math.random() * (move.multiHit[1] - move.multiHit[0] + 1)) + move.multiHit[0] : 1);
    let hitCount = 0;
    for (let i = 0; i < hits; i++) {
      if (defender.currentHp <= 0) break;
      await executeDamageMove(side, move, attacker, defender);
      hitCount++;
    }
    if (hits > 1 && hitCount > 1) addMessage(`${hitCount}回当たった！`);
  }

  // ③ 技命中時(Hit)のエフェクト処理
  if (defender.currentHp > 0 || move.category === 'status') {
    await processEffectsByTrigger('hit', move, attacker, defender, side);
  }
  
  // ひんしチェック
  if (defender.currentHp <= 0) await handleFaint(side === 'player' ? 'enemy' : 'player');
  if (attacker.currentHp <= 0) await handleFaint(side);
}

// 構造化エフェクトのパース
async function processEffectsByTrigger(triggerType, move, attacker, defender, side) {
  if (!move.effect || !Array.isArray(move.effect)) return;
  
  for (const eff of move.effect) {
    if (eff.trigger !== triggerType) continue;
    if (eff.chance && Math.random() * 100 > eff.chance && !ABILITIES[attacker.ability]?.alwaysSecondary) continue;

    let targetMon = null;
    if (eff.target === 'self') targetMon = attacker;
    if (eff.target === 'enemy') targetMon = defender;
    if (eff.target === 'field') targetMon = null;

    // 「おうごんのからだ」など、相手の追加効果無効化
    if (triggerType === 'hit' && move.category !== 'status' && targetMon === defender) {
      if (ABILITIES[defender.ability]?.blockSecondary) continue;
    }

    await applyActionEffect(eff, attacker, defender, targetMon, side, move);
  }
}

// =====================================================
// 6. ダメージ計算と副作用
// =====================================================
async function executeDamageMove(side, move, attacker, defender) {
  const { damage, crit, effectiveness } = calcDamage(attacker, defender, move);
  
  if (crit) addMessage('急所に当たった！');
  const effMsg = getEffectivenessMessage(effectiveness);
  if (effMsg) addMessage(effMsg);
  
  if (effectiveness === 0) return; // 無効なら終了

  const actualDmg = applyDamage(defender, damage);
  animateDamage(side === 'player' ? 'enemy' : 'player');

  // ダメージ量に依存する効果 (吸収・反動)
  if (move.drain) {
    healHp(attacker, Math.floor(actualDmg * (move.drain / 100)));
    addMessage(`${defender.name}から体力を奪った！`);
  }
  if (move.recoil) {
    applyDamage(attacker, Math.floor(attacker.maxHp / move.recoil));
    addMessage(`${attacker.name}は反動を受けた！`);
  }
  if (move.recoilDamage) {
    applyDamage(attacker, Math.floor(actualDmg / move.recoilDamage));
    addMessage(`${attacker.name}は反動を受けた！`);
  }

  // 接触特性などの処理
  await processMoveSideEffect(move, attacker, defender, actualDmg);
}

function calcDamage(attacker, defender, move) {
  if (move.power === 0) return { damage: 0, crit: false, effectiveness: 1 };

  let power = move.power;
  let moveType = move.type;
  let useEnemyAtk = false, useDef = false, ignoreDef = false, ignoreEvasion = false;
  
  // ① [超重要] 常時エフェクトによる威力・タイプの書き換え・上限値設定
  const alwaysEff = (move.effect || []).filter(e => e.trigger === 'always');
  alwaysEff.forEach(eff => {
    if (eff.action === 'reversal') power = 200 * (1 - (attacker.currentHp / attacker.maxHp));
    if (eff.action === 'maxHpPower') power = 150 * (attacker.currentHp / attacker.maxHp);
    if (eff.action === 'doubleVsStatus' && eff.statuses.includes(defender.status)) power *= 2;
    if (eff.action === 'doubleVsAnyStatus' && defender.status) power *= 2;
    if (eff.action === 'doubleVsType' && defender.types.includes(eff.vsType)) power *= 2;
    if (eff.action === 'noItemDoublePower' && !attacker.item) power *= 2;
    if (eff.action === 'useEnemyAtk') useEnemyAtk = true;
    if (eff.action === 'useDefense') useDef = true;
    if (eff.action === 'ignoreDefense') ignoreDef = true;
    if (eff.action === 'ignoreEvasion') ignoreEvasion = true;
    if (eff.action === 'randomMoveType') moveType = TYPES[Math.floor(Math.random() * TYPES.length)];
    if (eff.action === 'randomPower') power = Math.floor(Math.random() * (eff.max - eff.min + 1)) + eff.min;
    
    // ターン数比例ダメージ
    if (eff.action === 'turnDamage') {
      const limit = eff.max || 999;
      power = Math.min(limit, (Battle.turn * eff.multiplier) + (eff.base || 0));
    }
    
    // 使うたびに威力が上がる/倍になる（しゃかいじんのつとめ、りそくがふえる 等）
    if (eff.action === 'growingPower') {
      attacker.flags.growCount = (attacker.flags.growCount || 0) + 1;
      const limit = eff.max || 999; // 上限値のフェイルセーフ
      if (eff.mult) {
        power = Math.min(limit, power * Math.pow(eff.mult, attacker.flags.growCount));
      } else {
        power = Math.min(limit, power + (eff.value * attacker.flags.growCount));
      }
    }
    if (eff.action === 'judgment') moveType = attacker.types[0];
  });

  if (ABILITIES[attacker.ability]?.chaosType) moveType = TYPES[Math.floor(Math.random() * TYPES.length)];

  // ② 相性計算
  let eff = getTypeEffectiveness(moveType, defender.types);
  
  if (ABILITIES[attacker.ability]?.pierceResistance || move.pierceResistance) eff = Math.max(1, eff);
  if (ABILITIES[defender.ability]?.immuneGhost && moveType === 'ゴースト') eff = 0;
  if (ABILITIES[defender.ability]?.immuneDark  && moveType === 'あく') eff = 0;
  if (ABILITIES[defender.ability]?.immuneGround&& moveType === 'じめん') eff = 0;
  if (ABILITIES[attacker.ability]?.superEffectX3 && eff > 1) eff = 3.0;

  if (eff === 0) return { damage: 0, crit: false, effectiveness: 0 };

  // 等倍以下無効（あんのじょう）
  if (ABILITIES[defender.ability]?.surpriseAbsorb && eff <= 1) {
    applyStatChange(defender, 'atk', 1, defender.name);
    addMessage(`${defender.name}はあんのじょうの技を吸収して攻撃が上がった！`);
    return { damage: 0, crit: false, effectiveness: eff };
  }

  // ③ 急所判定
  let critBonus = move.critRateBonus || 0;
  if (move.alwaysCrit) critBonus = 99;
  const critTables = [1/24, 1/8, 1/2, 1];
  const crit = Math.random() < (critTables[Math.min(3, critBonus)] || 1);

  // ④ 実効ステータス取得
  let aStat = useEnemyAtk ? getEffectiveStat(defender, 'atk') : getEffectiveStat(attacker, move.category === 'physical' ? 'atk' : 'spa');
  let dStat = useDef ? getEffectiveStat(defender, 'def') : getEffectiveStat(defender, move.category === 'physical' ? 'def' : 'spd');
  
  if (ignoreDef) dStat = 10;
  if (crit) aStat = Math.max(aStat, attacker.stats[move.category === 'physical' ? 'atk' : 'spa']);

  // ⑤ 特性とアイテムの威力補正
  let abilityMult = 1.0;
  const atkAb = ABILITIES[attacker.ability];
  const defAb = ABILITIES[defender.ability];

  if (atkAb) {
    if (atkAb.physicalPowerMult && move.category === 'physical') abilityMult *= atkAb.physicalPowerMult;
    if (atkAb.typePowerMult && atkAb.typePowerMult.type === moveType) abilityMult *= atkAb.typePowerMult.mult;
    if (atkAb.allPowerMult) abilityMult *= atkAb.allPowerMult;
    if (atkAb.spaUp1_5 && move.category === 'special') abilityMult *= 1.5;
    if (atkAb.pinchDoublePower && attacker.currentHp <= attacker.maxHp / 2) abilityMult *= 2;
    if (atkAb.contactPowerMult && move.contact) abilityMult *= atkAb.contactPowerMult;
    if (atkAb.spcDmgMult && move.category === 'special') abilityMult *= atkAb.spcDmgMult;
    if (atkAb.flyPowerMult && moveType === 'ひこう') abilityMult *= atkAb.flyPowerMult;
    if (atkAb.armPowerDouble && move.punch) abilityMult *= 2.0;
    if (atkAb.spinPowerDouble && move.spin) abilityMult *= 2.0;
    if (atkAb.typeNeutral) eff = eff > 0 ? 1 : 0;
    if (atkAb.doublePP20 && Math.random() < 0.20 && attacker.movePPs[move.name] > 0) {
       attacker.movePPs[move.name]--; abilityMult *= 2.0; addMessage(`${attacker.name}ははんざいよくを発動！威力が2倍！`);
    }
  }
  
  if (defAb?.teamDefBoost) abilityMult *= 0.9; 
  if (defAb?.staticDefUp2 && move.category === 'physical') abilityMult *= 0.5;

  const stab = attacker.types.includes(moveType) ? 1.5 : 1.0;
  const rand = (Math.floor(Math.random() * 16) + 85) / 100; // 0.85 ~ 1.00
  
  // ⑥ 最終ダメージ算出
  let dmg = Math.floor((Math.floor((Math.floor(2 * attacker.level / 5) + 2) * power * aStat / dStat) / 50) + 2);
  dmg = Math.floor(dmg * stab * eff * abilityMult * rand);
  if (crit) dmg = Math.floor(dmg * 1.5);
  
  return { damage: Math.max(1, dmg), crit, effectiveness: eff };
}

async function processMoveSideEffect(move, attacker, defender, damage) {
  if (damage <= 0) return;
  const defAb = ABILITIES[defender.ability];
  const atkAb = ABILITIES[attacker.ability];

  // 接触ダメージと特性伝染
  if (move.contact) {
    if (defAb?.mummify && attacker.ability !== 'ミイラほうたい') { 
      attacker.ability = 'ミイラほうたい'; addMessage(`${attacker.name}の特性がミイラになった！`); 
    }
    if (defAb?.contactReflect4) { 
      applyDamage(attacker, Math.max(1, Math.floor(damage / 4))); addMessage(`${attacker.name}はきずのいたみでダメージを跳ね返された！`); 
    }
    if (defAb?.contactPoisonReflect) inflictStatus(attacker, 'psn', defender.name);
    if (atkAb?.contactPoison50 && Math.random() < 0.5) inflictStatus(defender, 'tox', attacker.name);
    if (defender.item === 'ゴツゴツメット') { 
      applyDamage(attacker, Math.floor(attacker.maxHp / 6)); addMessage(`${defender.name}のゴツゴツメットで傷ついた！`); 
    }
  }

  // 怒りスタック
  if (defAb?.rageStack) {
    defender.flags.rageStack = (defender.flags.rageStack || 0) + 1;
    applyStatChange(defender, 'atk', 1, defender.name);
    if (defender.flags.rageStack >= 5) {
      ['atk','def','spa','spd','spe'].forEach(s => applyStatChange(defender, s, 2, defender.name));
      defender.flags.rageStack = 0;
      addMessage(`${defender.name}の怒りがMAXになった！！全能力が大幅に上がった！`);
    }
  }

  if (move.sound && defAb?.soundHeal) { 
    healHp(defender, Math.floor(defender.maxHp / 4)); addMessage(`${defender.name}は音を吸収して回復した！`); 
  }
  if (atkAb?.extraDrainOnHit) { 
    const d = Math.max(1, Math.floor(defender.maxHp / 8)); applyDamage(defender, d); addMessage(`${attacker.name}ははかいのそんざいで追加ダメージを与えた！`); 
  }
}

// =====================================================
// 7. 汎用エフェクト発動ルーター (全効果網羅版)
// =====================================================
async function applyActionEffect(eff, attacker, defender, target, side, move) {
  switch (eff.action) {
    case 'statChange':
      if (target) applyStatChange(target, eff.stat, eff.stage, attacker.name);
      break;
    case 'inflictStatus':
      if (target) inflictStatus(target, eff.status, attacker.name);
      break;
    case 'confuse':
      if (target) inflictConfusion(target);
      break;
    case 'flinch':
      if (target) target.flags.flinch = true;
      break;
    case 'healPercent':
      if (target) {
        const h = healHp(target, Math.floor(target.maxHp * (eff.value / 100)));
        if(h > 0) addMessage(`${target.name}のHPが回復した！`);
      }
      break;
    case 'cureStatus':
      if (target && target.status) { target.status = null; addMessage(`${target.name}の状態異常が治った！`); }
      break;

    // === みがわり・特殊消費系 ===
    case 'substitute':
      const subHp = Math.floor(attacker.maxHp / 4);
      if (attacker.currentHp > subHp) {
        applyDamage(attacker, subHp);
        attacker.flags.substitute = true; attacker.flags.substituteHp = subHp;
        addMessage(`${attacker.name}はみがわりを作った！`);
      } else addMessage('体力が足りない！');
      break;
    case 'cellSplitSub': // さいぼうぶんれつ
      const splitHp = Math.floor(attacker.maxHp * (eff.value / 100));
      if (attacker.currentHp > splitHp) {
        applyDamage(attacker, splitHp);
        attacker.flags.substitute = true; attacker.flags.substituteHp = splitHp;
        addMessage(`${attacker.name}は細胞を分裂させてコピーを作った！`);
      }
      break;
    case 'selfDamagePercent':
      applyDamage(attacker, Math.floor(attacker.maxHp * (eff.value / 100)));
      addMessage(`${attacker.name}は命を削った！`);
      break;
    case 'bellyDrum':
      const bdHp = Math.floor(attacker.maxHp / 2);
      if (attacker.currentHp > bdHp) {
        applyDamage(attacker, bdHp); attacker.statStages.atk = 6;
        addMessage(`${attacker.name}は体力を削ってパワーを最大まで引き出した！`);
      }
      break;
    case 'setHp':
      attacker.currentHp = eff.value; addMessage(`${attacker.name}の体力が残りわずかになった！`);
      break;

    // === フィールド・ギミック ===
    case 'clearStatChanges':
      if (target) { target.statStages = { atk:0, def:0, spa:0, spd:0, spe:0, acc:0, eva:0 }; addMessage(`${target.name}の能力変化が元に戻った！`); }
      break;
    case 'setField':
      Battle.field[eff.field] = eff.value !== undefined ? eff.value : true; addMessage(`フィールドに変化が起きた！（${eff.field}）`);
      break;
    case 'setTerrain':
      Battle.field.terrain = eff.terrain; Battle.field.terrainTurns = eff.turns; addMessage(`足元が${eff.terrain}に変わった！`);
      break;
    case 'setWeather':
      Battle.field.weather = eff.weather; Battle.field.weatherTurns = eff.turns; addMessage(`天気が変わった！`);
      break;
    case 'auroraVeil':
      if (Battle.field.weather === 'hail') { Battle.field.auroraVeil = eff.turns; addMessage('オーロラベールが張られた！'); }
      else addMessage('しかしうまく決まらなかった！');
      break;
    case 'breakScreens':
      Battle.field.lightScreen = 0; Battle.field.reflect = 0; Battle.field.auroraVeil = 0; addMessage('壁が破壊された！');
      break;
    case 'rapidSpin':
      Battle.field.stealthRock = false; Battle.field.toxicSpikes = 0; addMessage('フィールドの罠が吹き飛んだ！');
      break;
    case 'trickRoom':
      Battle.field.trickRoom = !Battle.field.trickRoom; Battle.field.trickRoomTurns = eff.turns;
      addMessage(Battle.field.trickRoom ? '時空が歪んだ！' : '歪んだ時空が元に戻った！');
      break;
    case 'sideChange':
      addMessage(`${attacker.name}は位置を入れ替えた！`);
      break;

    // === 妨害・強制 ===
    case 'forceSwitch':
      addMessage(`${defender.name}は吹き飛ばされた！`);
      await executeSwitchAction(side === 'player' ? 'enemy' : 'player', -1, true);
      break;
    case 'switchAfter':
      Battle.needSwitch = side;
      break;
    case 'trap':
      if (!defender.flags.trapped) { defender.flags.trapped = Math.floor(Math.random()*(eff.max-eff.min+1))+eff.min; addMessage(`${defender.name}は逃げられなくなった！`); }
      break;
    case 'disable':
      if (defender.lastUsedMove) { defender.flags.disabled = { move: defender.lastUsedMove, turns: eff.value }; addMessage(`${defender.name}の ${defender.lastUsedMove} は封じられた！`); }
      break;
    case 'disableTwo':
      addMessage(`${defender.name}の技が封印された！`);
      break;
    case 'taunt':
      defender.flags.taunted = eff.value; addMessage(`${defender.name}は挑発され、変化技が出せなくなった！`);
      break;
    case 'encore':
      if (defender.lastUsedMove) { defender.flags.encore = { move: defender.lastUsedMove, turns: eff.value }; addMessage(`${defender.name}はアンコールを受けた！`); }
      break;
    case 'curse':
      if (!defender.flags.curse) { defender.flags.curse = true; addMessage(`${defender.name}は呪われた！`); }
      break;
    case 'countdown':
      defender.flags.countdown = eff.value; addMessage(`${defender.name}に滅びの宣告！あと${eff.value}ターン！`);
      break;

    // === カウンター・入れ替え系 ===
    case 'protect':
      attacker.flags.protect = true; addMessage(`${attacker.name}は守りの態勢に入った！`);
      break;
    case 'protectSpiky':
      attacker.flags.protect = true; attacker.flags.protectSpiky = true; addMessage(`${attacker.name}は鉄壁の守りに入った！`);
      break;
    case 'endure':
      attacker.flags.endure = true; addMessage(`${attacker.name}は攻撃を耐える態勢をとった！`);
      break;
    case 'counter':
      attacker.flags.counter = true; addMessage(`${attacker.name}はカウンターの構え！`);
      break;
    case 'metalBurst':
      attacker.flags.metalBurst = true; addMessage(`${attacker.name}はメタルバーストの構え！`);
      break;
    case 'destiny':
      const destDmg = Math.min(attacker.currentHp, defender.currentHp);
      applyDamage(attacker, attacker.currentHp); applyDamage(defender, destDmg);
      addMessage(`${attacker.name}は命を懸けて相手を道連れにした！`);
      break;
    case 'selfDestruct':
      applyDamage(attacker, attacker.currentHp);
      break;
    case 'recharge':
      attacker.flags.recharging = true;
      break;
    case 'moonlight':
      healHp(attacker, Battle.field.weather === 'sunny' ? Math.floor(attacker.maxHp*2/3) : Math.floor(attacker.maxHp/4));
      break;
    case 'typeChange':
      attacker.types = [...eff.types]; addMessage(`${attacker.name}のタイプが変わった！`);
      break;
    case 'transform':
      attacker.types = [...defender.types]; attacker.moves = [...defender.moves]; addMessage(`${attacker.name}は${defender.name}にへんしんした！`);
      break;
    case 'mimic':
      if (defender.lastUsedMove) addMessage(`${attacker.name}は${defender.lastUsedMove}をコピーした！`);
      break;
    case 'copyLastMove':
      if (defender.lastUsedMove) addMessage(`${attacker.name}は${defender.lastUsedMove}を覚えた！`);
      break;
    case 'copyStatChanges':
      attacker.statStages = { ...defender.statStages }; addMessage(`${attacker.name}は相手の能力変化をコピーした！`);
      break;
    case 'swapAtkSpa':
      const tempAtk = attacker.stats.atk; attacker.stats.atk = attacker.stats.spa; attacker.stats.spa = tempAtk;
      addMessage(`${attacker.name}の攻撃と特攻が入れ替わった！`);
      break;
    case 'swapItems':
      const tempItem = attacker.item; attacker.item = defender.item; defender.item = tempItem; addMessage(`お互いの持ち物が入れ替わった！`);
      break;
    case 'knockOff':
      if (defender.item) { addMessage(`${defender.name}の${defender.item}をはたき落とした！`); defender.item = null; }
      break;
    case 'stealBerry':
      if (defender.item && ITEMS[defender.item]?.category === 'held') { addMessage(`${defender.name}の持ち物を奪って食べた！`); defender.item = null; healHp(attacker, Math.floor(attacker.maxHp/4)); }
      break;
    case 'setFlag':
      target.flags[eff.flag] = eff.value;
      break;
    case 'revealAll':
      addMessage(`${defender.name}の全情報が明らかになった！`); defender.flags.revealed = true;
      break;
    case 'futureAttack':
      Battle.field.futureAttack = { turns: eff.turns, power: eff.power, attacker: attacker.name }; addMessage('未来に攻撃を仕掛けた！');
      break;
    case 'thrash':
      attacker.flags.lockedMove = { move: move.name, turns: Math.floor(Math.random()*(eff.maxTurns-eff.minTurns+1))+eff.minTurns };
      break;
    case 'coinFlip':
      if (Math.random() < 0.5) addMessage('コイントス：表！大ダメージ！');
      else { addMessage('コイントス：裏！自分にダメージ！'); applyDamage(attacker, eff.missDamage); }
      break;
    case 'randomSecondary':
      const r = Math.random();
      if (r < 0.2) applyStatChange(defender, 'def', -1, attacker.name);
      else if (r < 0.4) inflictStatus(defender, 'par', attacker.name);
      else if (r < 0.6) inflictStatus(defender, 'brn', attacker.name);
      else if (r < 0.8) inflictConfusion(defender);
      break;
    case 'randomStatChange':
      const sArr = ['atk','def','spa','spd','spe']; applyStatChange(defender, sArr[Math.floor(Math.random()*5)], eff.stage, attacker.name);
      break;
    case 'contactDamage':
      applyDamage(defender, eff.value);
      break;
    case 'ohko':
      applyDamage(defender, defender.maxHp); addMessage('一撃必殺！！');
      break;
  }
}

// =====================================================
// 8. 基礎ユーティリティ関数
// =====================================================
function healHp(mon, amount) {
  if (amount <= 0 || mon.currentHp <= 0) return 0;
  const actual = Math.min(mon.maxHp - mon.currentHp, amount);
  mon.currentHp += actual;
  return actual;
}

function applyDamage(mon, amount) {
  if (amount <= 0) return 0;
  const actual = Math.min(mon.currentHp, amount);
  mon.currentHp -= actual;
  return actual;
}

function applyStatChange(mon, stat, stage, sourceName) {
  if (!mon || mon.currentHp <= 0) return;
  if (stage < 0 && ABILITIES[mon.ability]?.noStatDown) return;
  if (ABILITIES[mon.ability]?.contraryStat) stage = -stage;

  const old = mon.statStages[stat] || 0;
  mon.statStages[stat] = Math.max(-6, Math.min(6, old + stage));
  const msgs = stage > 0 ? ['上がった','ぐんと上がった','ぐーんと上がった'] : ['下がった','がくっと下がった','がくーんと下がった'];
  addMessage(`${mon.name}の${STAT_NAMES[stat] || stat}が${msgs[Math.min(Math.abs(stage)-1, 2)]}！`);
}

function inflictStatus(mon, status, source) {
  if (mon.status || mon.currentHp <= 0) return;
  if (ABILITIES[mon.ability]?.immuneStatus) return;
  if (status === 'par' && mon.types.includes('でんき')) return;
  if (status === 'brn' && mon.types.includes('ほのお')) return;
  if (status === 'frz' && mon.types.includes('こおり')) return;
  if ((status === 'psn' || status === 'tox') && (mon.types.includes('どく') || mon.types.includes('はがね'))) return;

  mon.status = status;
  mon.statusTurns = status === 'slp' ? Math.floor(Math.random()*3)+1 : 0;
  if (status === 'slp') mon.flags.sleepTurns = mon.statusTurns;
  
  const labels = { par:'まひ', brn:'やけど', psn:'どく', tox:'もうどく', frz:'こおり', slp:'ねむり' };
  addMessage(`${mon.name}は${labels[status]}になった！`);
}

function inflictConfusion(mon) {
  if (mon.flags.confused) return;
  mon.flags.confused = true;
  mon.flags.confusedTurns = Math.floor(Math.random()*4)+2;
  addMessage(`${mon.name}は混乱した！`);
}

// =====================================================
// 9. ターン終了時処理 (状態異常・特性・天候 完全対応)
// =====================================================
async function processTurnEnd() {
  Battle.turn++;
  const mons = [Battle.playerMon, Battle.enemyMon].filter(Boolean);

  for (const mon of mons) {
    if (mon.currentHp <= 0) continue;
    
    // 状態異常ダメージ
    if (mon.status === 'brn') { applyDamage(mon, Math.floor(mon.maxHp/16)); addMessage(`${mon.name}のやけどダメージ！`); }
    if (mon.status === 'psn') { applyDamage(mon, Math.floor(mon.maxHp/8)); addMessage(`${mon.name}のどくダメージ！`); }
    if (mon.status === 'tox') {
      mon.statusTurns++; applyDamage(mon, Math.floor(mon.maxHp * mon.statusTurns / 16)); addMessage(`${mon.name}のもうどくダメージ！`);
    }
    if (mon.status === 'slp') {
      mon.statusTurns++;
      if (mon.statusTurns >= (mon.flags.sleepTurns || 3)) { mon.status = null; addMessage(`${mon.name}は目を覚ました！`); }
    }
    
    // やどりぎ・呪い・カウントダウン
    if (mon.flags.curse) { applyDamage(mon, Math.floor(mon.maxHp/4)); addMessage(`${mon.name}は呪いで傷ついた！`); }
    if (mon.flags.leechSeed) {
      const dmg = applyDamage(mon, Math.floor(mon.maxHp/8));
      const opp = mon === Battle.playerMon ? Battle.enemyMon : Battle.playerMon;
      if (opp && opp.currentHp > 0) healHp(opp, dmg);
      addMessage(`${mon.name}は体力を吸い取られた！`);
    }
    if (mon.flags.countdown) {
      mon.flags.countdown--;
      if (mon.flags.countdown <= 0) { applyDamage(mon, mon.maxHp); addMessage(`${mon.name}のカウントが0になった！`); }
    }

    // 特性と持ち物の終了時処理
    await processAbilityEndTurn(mon, Battle);
    await processHeldItemEndTurn(mon);
    
    if (mon.currentHp <= 0) await handleFaint(mon === Battle.playerMon ? 'player' : 'enemy');
  }

  // フィールドのターン経過
  ['lightScreen', 'reflect', 'auroraVeil', 'weatherTurns', 'terrainTurns'].forEach(f => {
    if (Battle.field[f] > 0) Battle.field[f]--;
  });
  if (Battle.field.weatherTurns === 0) Battle.field.weather = null;
  if (Battle.field.terrainTurns === 0) Battle.field.terrain = null;

  if (Battle.onUIUpdate) Battle.onUIUpdate();
}

async function processAbilityEndTurn(mon, battle) {
  if (!mon || mon.currentHp <= 0) return;
  const ab = ABILITIES[mon.ability];
  const opp = mon === Battle.playerMon ? Battle.enemyMon : Battle.playerMon;
  if (!ab) return;

  if (ab.endTurnHeal) healHp(mon, Math.floor(mon.maxHp / ab.endTurnHeal));
  if (ab.endTurnBurn30 && opp && Math.random() < 0.30) inflictStatus(opp, 'brn', mon.name);
  if (ab.endTurnSleep20 && opp && Math.random() < 0.20) inflictStatus(opp, 'slp', mon.name);
  if (ab.endTurnLowerAtk && opp) { applyStatChange(opp, 'atk', -1, mon.name); applyStatChange(opp, 'spa', -1, mon.name); }
  if (ab.endTurnRandLower && opp) { const sArr = ['atk','def','spa','spd','spe']; applyStatChange(opp, sArr[Math.floor(Math.random()*5)], -1, mon.name); }
  if (ab.endTurnSpdefDown50 && opp && Math.random() < 0.5) applyStatChange(opp, 'spd', -1, mon.name);
  
  if (ab.endTurnDrain8 && opp) {
    const dmg = applyDamage(opp, Math.max(1, Math.floor(opp.maxHp / 8))); healHp(mon, dmg); addMessage(`${mon.name}は相手の体力を奪った！`);
  }
  if (ab.drainPP && opp) {
    const moves = Object.keys(opp.movePPs).filter(m => opp.movePPs[m] > 0);
    if (moves.length > 0) { opp.movePPs[moves[0]]--; addMessage(`${mon.name}は相手のPPを削った！`); }
  }
  if (ab.endTurnCurse50 && opp && !opp.flags.curse && Math.random() < 0.5) { opp.flags.curse = true; addMessage(`${mon.name}はのろいのしるしを刻んだ！`); }

  if (ab.endTurnSpeUp) applyStatChange(mon, 'spe', 1, mon.name);
  if (ab.endTurnDodge) applyStatChange(mon, 'eva', 1, mon.name);
  if (ab.adventureBuff) { applyStatChange(mon, 'spe', 1, mon.name); applyStatChange(mon, 'spa', 1, mon.name); }
  if (ab.randStatUpEachTurn && Math.random() < 0.25) { const sArr = ['atk','def','spa','spd','spe']; applyStatChange(mon, sArr[Math.floor(Math.random()*5)], 2, mon.name); }

  if (ab.fallDown) {
    applyDamage(mon, Math.floor(mon.maxHp / 16)); applyStatChange(mon, 'atk', 1, mon.name); applyStatChange(mon, 'spa', 1, mon.name);
    addMessage(`${mon.name}は落ちていくさだめで能力が上がった！`);
  }
  if (ab.timePower) {
    mon.flags.timeTurns = (mon.flags.timeTurns || 0) + 1;
    if (mon.flags.timeTurns >= 5) { ['atk','def','spa','spd','spe'].forEach(s => applyStatChange(mon, s, 1, mon.name)); addMessage(`時間が進み、${mon.name}の全能力が上がった！`); }
  }
  if (ab.transformBelow50 && mon.currentHp <= mon.maxHp / 2 && !mon.flags.transformedPuyu) {
    mon.flags.transformedPuyu = true; mon.types = ['ぷゆ', 'あく']; applyStatChange(mon, 'atk', 1, mon.name); addMessage(`${mon.name}はぷゆへんしんを発動した！`);
  }
  if (ab.stealItem && opp?.item && !mon.item) {
    mon.item = opp.item; opp.item = null; addMessage(`${mon.name}は相手の持ち物を奪った！`);
  }
  if (ab.cureStatus && mon.status) { mon.status = null; addMessage(`${mon.name}は状態異常を治した！`); }
}

async function processHeldItemEndTurn(mon) {
  if (!mon || !mon.item || mon.currentHp <= 0) return;
  const effect = ITEMS[mon.item]?.effect;
  if (!effect) return;

  if (effect.type === 'endTurnHeal') healHp(mon, Math.floor(mon.maxHp / effect.fraction));
  if (effect.type === 'lum' && mon.status) { mon.status = null; mon.item = null; addMessage(`${mon.name}のラムのみで状態異常が治った！`); }
  if (effect.type === 'sitrusberry' && mon.currentHp <= mon.maxHp / 2) { healHp(mon, Math.floor(mon.maxHp/4)); mon.item = null; addMessage(`${mon.name}のオボンのみが発動した！`); }
  if (effect.type === 'blackSludge') {
    if (mon.types.includes('どく')) healHp(mon, Math.floor(mon.maxHp / 16));
    else { applyDamage(mon, Math.floor(mon.maxHp / 8)); addMessage(`${mon.name}はくろいヘドロのダメージを受けた！`); }
  }
}

// =====================================================
// 10. ひんし・交代・アイテム等のゲーム管理処理
// =====================================================
async function handleFaint(side) {
  const mon = side === 'player' ? Battle.playerMon : Battle.enemyMon;
  addMessage(`${mon.name}はたおれた！`);
  mon.currentHp = 0;
  animateFaint(side);

  if (side === 'enemy') {
    const exp = Math.floor(mon.level * 1.5 * 50 / 7);
    Battle.playerMon.exp += exp;
    addMessage(`${Battle.playerMon.name}は${exp}の経験値を手に入れた！`);
    endBattle('win'); // 単体想定。パーティ戦闘を実装する場合はここで交代UI表示処理へ
  } else {
    endBattle('lose');
  }
}

function endBattle(result) {
  if (!Battle) return;
  Battle.ended = true;
  Battle.winner = result;
  if (Battle.onEnd) Battle.onEnd(result);
}

async function executeStruggle(side) {
  const attacker = side === 'player' ? Battle.playerMon : Battle.enemyMon;
  const defender  = side === 'player' ? Battle.enemyMon  : Battle.playerMon;
  addMessage(`${attacker.name}はわるあがきをした！`);
  const dmg = Math.max(1, Math.floor(attacker.stats.atk / 4));
  applyDamage(defender, dmg);
  applyDamage(attacker, Math.max(1, Math.floor(attacker.maxHp / 4)));
  addMessage(`${attacker.name}は反動ダメージを受けた！`);
  if (defender.currentHp <= 0) await handleFaint(side === 'player' ? 'enemy' : 'player');
  if (attacker.currentHp <= 0) await handleFaint(side);
}

async function executeItemAction(side, itemName) {
  if (side !== 'player') return;
  const item = ITEMS[itemName];
  if (!item || !Game.bag[itemName]) return;
  Game.bag[itemName]--;
  
  const mon = Battle.playerMon;
  if (item.effect?.type === 'heal') { healHp(mon, item.effect.amount); addMessage(`${mon.name}のHPが回復した！`); }
  if (item.effect?.type === 'healFull') { healHp(mon, mon.maxHp); addMessage(`${mon.name}のHPが全回復した！`); }
  if (item.effect?.type === 'cureStatus' && item.effect.statuses.includes(mon.status)) { mon.status = null; addMessage(`${mon.name}の状態異常が治った！`); }
}

async function executeSwitchAction(side, partyIndex, forced = false) {
  if (side === 'player') {
    const newMon = Game.party[partyIndex];
    if (!newMon || newMon.currentHp <= 0) return;
    if (!forced) addMessage(`${Battle.playerMon.name}、もどれ！`);
    resetBattleMonState(Battle.playerMon);
    Battle.playerPartyIndex = partyIndex;
    Battle.playerMon = newMon;
    triggerAbilityOnEntry(newMon, Battle);
    addMessage(`いけ！${newMon.name}！`);
  } else {
    // 敵の交代ロジック
  }
}

async function executeRunAction() {
  if (Battle.type !== 'wild') { addMessage('トレーナー戦では逃げられない！'); return; }
  addMessage('うまく逃げ切れた！');
  Battle.escaped = true;
  endBattle('escaped');
}

function decideEnemyAction() {
  const mon = Battle.enemyMon;
  const availableMoves = mon.moves.filter(m => (mon.movePPs[m] || 0) > 0);
  if (availableMoves.length === 0) return { type: 'move', data: 'わるあがき' };
  const bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  return { type: 'move', data: bestMove };
}

function triggerAbilityOnEntry(mon, battle) {
  if (!mon) return;
  const ab = ABILITIES[mon.ability];
  if (!ab?.onEntry) return;
  const res = ab.onEntry(battle, mon);
  if (res?.msg) addMessage(res.msg);
}

function triggerAbilityOnMiss(mon, battle) {
  if (ABILITIES[mon.ability]?.missDrain8) {
    const opp = mon === battle.playerMon ? battle.playerMon : battle.enemyMon;
    if (opp) { applyDamage(opp, Math.floor(opp.maxHp / 8)); addMessage(`${mon.name}のムジュラののろいで追加ダメージ！`); }
  }
}

function addMessage(msg) {
  if (!msg) return;
  Battle.messageQueue.push(msg);
  if (Battle.onMessage) Battle.onMessage(msg);
}

// UIアニメーションの空フック
function animateAttack(side) { }
function animateDamage(side) { }
function animateFaint(side) { }

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
