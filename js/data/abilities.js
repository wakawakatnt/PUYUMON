// =====================================================
// ぷゆモン - 特性データ
// =====================================================

const ABILITIES = {
  // ===== 汎用特性 =====
  'もらいび': {
    name: 'もらいび',
    desc: 'ほのお技を受けると無効化し、自分のほのお技が1.5倍になる。',
    onHit: (battle, attacker, defender, move) => {
      if (move.type === 'ほのお') {
        defender.flags.moraibiFire = true;
        return { blocked: true, msg: `${defender.name}はもらいびを発動！ほのお技の威力が上がった！` };
      }
    }
  },
  'おうごんのからだ': {
    name: 'おうごんのからだ',
    desc: '追加効果を受けない。',
    blockSecondary: true
  },
  'ふしぎなまもり': {
    name: 'ふしぎなまもり',
    desc: '効果抜群の技しか受けない。',
    onHit: (battle, attacker, defender, move) => {
      const eff = getTypeEffectiveness(move.type, defender.types);
      if (eff <= 1) return { blocked: true, msg: `${defender.name}にはふしぎなまもりでダメージが通らない！` };
    }
  },
  'すながくれ': {
    name: 'すながくれ',
    desc: 'すなあらしで特防が1.5倍になる。',
    sandstormSpdef: true
  },
  'ちくでん': {
    name: 'ちくでん',
    desc: 'でんき技を受けるとHPが回復する。',
    onHit: (battle, attacker, defender, move) => {
      if (move.type === 'でんき') {
        const heal = Math.floor(defender.maxHp / 4);
        defender.currentHp = Math.min(defender.maxHp, defender.currentHp + heal);
        return { blocked: true, msg: `${defender.name}はちくでんで電気を吸収してHPが回復した！` };
      }
    }
  },
  'すいすい': {
    name: 'すいすい',
    desc: 'あめのとき素早さが2倍になる。',
    rainSpeed: true
  },
  'ようりょくそ': {
    name: 'ようりょくそ',
    desc: 'にほんばれのとき素早さが2倍。',
    sunSpeed: true
  },
  'はりきり': {
    name: 'はりきり',
    desc: '物理技の威力が1.5倍になるが命中が0.8倍。',
    physicalPowerMult: 1.5,
    physicalAccMult: 0.8
  },
  'ちからもち': {
    name: 'ちからもち',
    desc: '物理技の威力が2倍になる。',
    physicalPowerMult: 2.0
  },
  'てんねん': {
    name: 'てんねん',
    desc: '相手の能力ランク変化を無視する。',
    ignoreStatChanges: true
  },
  'マジックガード': {
    name: 'マジックガード',
    desc: '技以外のダメージを受けない。',
    noIndirectDamage: true
  },
  'がんじょう': {
    name: 'がんじょう',
    desc: 'HPが満タンのとき、一撃で倒されない。',
    onHit: (battle, attacker, defender, move) => {
      if (defender.currentHp === defender.maxHp) {
        return { minHp: 1, msg: `${defender.name}はがんじょうでたえた！` };
      }
    }
  },
  'しんかのきせき': {
    name: 'しんかのきせき',
    desc: '防御・特防が1.5倍になる。（進化前のみ）',
    defMult: 1.5,
    spdefMult: 1.5
  },
  'どんかん': {
    name: 'どんかん',
    desc: '状態異常にならない。',
    immuneStatus: true
  },
  'めんえき': {
    name: 'めんえき',
    desc: 'どく・もうどくにならない。',
    immunePoison: true
  },
  'ぜったいねむり': {
    name: 'ぜったいねむり',
    desc: 'ねむり状態にならない。',
    immuneSleep: true
  },
  'クリアボディ': {
    name: 'クリアボディ',
    desc: '相手の技・特性によって能力が下がらない。',
    noStatDown: true
  },
  'スロースタート': {
    name: 'スロースタート',
    desc: '登場から5ターン、攻撃・素早さが半減。',
    slowStart: true
  },
  'いたずらごころ': {
    name: 'いたずらごころ',
    desc: '変化技の優先度が+1になる。',
    pranksterPriority: true
  },

  // ===== ぷゆゆ固有特性 =====
  'ぷゆぷゆオーラ': {
    name: 'ぷゆぷゆオーラ',
    desc: 'ぷゆタイプの技の威力が1.5倍になる。自分のHPが1/3以下のとき、更に1.5倍。',
    typePowerMult: { type: 'ぷゆ', mult: 1.5 },
    onTurnStart: (battle, mon) => {
      if (mon.currentHp <= mon.maxHp / 3) {
        mon.flags.puyuAuraPinch = true;
      }
    }
  },
  'ぷゆゆパワー': {
    name: 'ぷゆゆパワー',
    desc: '毎ターン終了時にHPが少し回復する（最大HPの1/16）。',
    endTurnHeal: 16
  },
  'えりまきシールド': {
    name: 'えりまきシールド',
    desc: '初めてダメージを受けたとき防御が大幅に上がる。',
    onFirstHit: true
  },
  'よみがえり': {
    name: 'よみがえり',
    desc: '瀕死になったとき、一度だけHP50%で復活する。',
    resurrect: true
  },
  'かみのてさばき': {
    name: 'かみのてさばき',
    desc: '攻撃を外したとき、次の攻撃が必中になる。',
    missToSureHit: true
  },
  'にせもの': {
    name: 'にせもの',
    desc: '相手の最後に使った技をコピーして使える（PP1）。',
    copyLastMove: true
  },
  'きょうふのあまのじゃく': {
    name: 'きょうふのあまのじゃく',
    desc: '能力が下がると逆に上がる。',
    contraryStat: true
  },
  'うゆゆのこころ': {
    name: 'うゆゆのこころ',
    desc: '味方の技の優先度が+1になる。（ダブルバトルで効果あり）',
    allyPriority: true
  },
  'いっぴつがき': {
    name: 'いっぴつがき',
    desc: '毎ターン、自分の技の威力がランダムに1.0〜2.0倍変動する。',
    randomPowerMult: true
  },
  'ほんもの': {
    name: 'ほんもの',
    desc: '相手の「にせもの」「コピー」系特性を無効化する。効果抜群の倍率が×3になる。',
    superEffectX3: true
  },
  'もうどくのき': {
    name: 'もうどくのき',
    desc: '接触技を当てた相手を50%の確率でもうどくにする。',
    contactPoison50: true
  },
  'ホッティフレア': {
    name: 'ホッティフレア',
    desc: '自分のほのお技が1.5倍。毎ターン相手にやけど（30%）を与える。',
    typePowerMult: { type: 'ほのお', mult: 1.5 },
    endTurnBurn30: true
  },
  'カチコチアーマー': {
    name: 'カチコチアーマー',
    desc: '防御が常に2段階上昇した状態に。こおり状態にならない。',
    staticDefUp2: true,
    immuneFreeze: true
  },
  'むてきのえがお': {
    name: 'むてきのえがお',
    desc: '毎ターン相手の攻撃・特攻を1段階下げる。',
    endTurnLowerAtk: true
  },
  'くすくすわらい': {
    name: 'くすくすわらい',
    desc: '相手が技を選択するとき、30%の確率で技をキャンセルさせる。',
    moveChance30: true
  },
  'ぽぽなみだ': {
    name: 'ぽぽなみだ',
    desc: '瀕死になったとき、相手の攻撃・特攻を2段階下げる。',
    onFaint: (battle, mon) => {
      return { lowerAtk: 2, lowerSpa: 2, msg: `${mon.name}のぽぽなみだで相手ののうりょくがさがった！` };
    }
  },
  'ゆめみごこち': {
    name: 'ゆめみごこち',
    desc: '相手を毎ターン20%の確率でねむり状態にする。',
    endTurnSleep20: true
  },
  'げゆゆのどく': {
    name: 'げゆゆのどく',
    desc: '接触技を受けたとき100%の確率でどくになる。自分は受けない。',
    contactPoisonReflect: true
  },
  'てんさいのひらめき': {
    name: 'てんさいのひらめき',
    desc: '特攻が1.5倍。技を使うとき、30%の確率で相手の特防を1段階下げる。',
    spaUp1_5: true,
    spdefDown30: true
  },
  'おんたこのいかり': {
    name: 'おんたこのいかり',
    desc: 'HPが半分以下のとき、攻撃・特攻が2倍になる。',
    pinchDoublePower: true
  },
  'まつもとのちえ': {
    name: 'まつもとのちえ',
    desc: '毎ターン开始時に相手の技PPを1削る。',
    drainPP: true
  },
  'はかいのそんざい': {
    name: 'はかいのそんざい',
    desc: 'ダメージを与えるとき、相手のHPを1/8削る追加効果。',
    extraDrainOnHit: 8
  },
  'さとりのめ': {
    name: 'さとりのめ',
    desc: '相手の特性・技の効果を完全に見通す。特殊技ダメージが1.2倍。',
    seeThrough: true,
    spcDamageMult: 1.2
  },
  'ゴシゴシこすり': {
    name: 'ゴシゴシこすり',
    desc: '接触技の威力が1.3倍。毎ターン相手の能力ランクを1段階ランダムに下げる。',
    contactPowerMult: 1.3,
    endTurnRandLower: true
  },
  'ぼくちんのゆうき': {
    name: 'ぼくちんのゆうき',
    desc: 'HPが1/4以下のとき全ステータスが1.5倍になる。',
    pinchAllStatsUp: true
  },
  'おちていくさだめ': {
    name: 'おちていくさだめ',
    desc: 'ターン経過ごとにHPは減るが、攻撃・特攻が毎ターン上がる。',
    fallDown: true
  },
  'ホラーフェイス': {
    name: 'ホラーフェイス',
    desc: '登場時、相手の攻撃を2段階下げる。',
    onEntry: (battle, mon) => {
      return { lowerAtk: 2, target: 'enemy', msg: `${mon.name}のホラーフェイスで相手がおびえた！` };
    }
  },
  'げきおこモード': {
    name: 'げきおこモード',
    desc: 'ダメージを受けるたびに攻撃が1段階上がる。怒りがMAXになると（5回）全能力2倍。',
    rageStack: true
  },
  'カオスふぃーるど': {
    name: 'カオスふぃーるど',
    desc: '全ての技のタイプがランダムに変わる。効果は等倍以上にしかならない。',
    chaosType: true
  },
  'ゼロポイント': {
    name: 'ゼロポイント',
    desc: 'HPが0になったとき、一度だけHP1で踏みとどまり次のターンHP全快する。',
    zeroPointRevive: true
  },
  'むげんのひかり': {
    name: 'むげんのひかり',
    desc: 'ひこう技の威力2倍。登場時フィールドを「ひかりのかべ」「リフレクター」状態にする。',
    onEntry: (battle, mon) => {
      battle.field.lightScreen = 5;
      battle.field.reflect = 5;
      return { msg: `${mon.name}のむげんのひかりでバリアが張られた！` };
    }
  },
  'みゆゆダンス': {
    name: 'みゆゆダンス',
    desc: '毎ターン、1/4の確率でランダムな能力が2段階上がる。',
    randStatUpEachTurn: true
  },
  'すやすやのちから': {
    name: 'すやすやのちから',
    desc: 'ねむり状態のとき、防御・特防が2倍になり毎ターン回復。',
    sleepDefenseBoost: true
  },
  'ムジュラののろい': {
    name: 'ムジュラののろい',
    desc: '毎ターン相手のHPを1/8削る。相手が技を外したとき追加で1/8削る。',
    endTurnDrain8: true,
    missDrain8: true
  },
  'やみのおうじ': {
    name: 'やみのおうじ',
    desc: 'あく技の威力2倍。光が関係する技・特性を完全に無効化。',
    typePowerMult: { type: 'あく', mult: 2.0 },
    blockLight: true
  },
  'はんざいよく': {
    name: 'はんざいよく',
    desc: '攻撃するとき、20%の確率で技のPPを2回消費して威力を2倍にする。',
    doublePP20: true
  },
  'ていれいのいしき': {
    name: 'ていれいのいしき',
    desc: 'ゴーストタイプ技を受けない。呪い技を受けない。',
    immuneGhost: true,
    immuneCurse: true
  },
  'レンジャーパワー': {
    name: 'レンジャーパワー',
    desc: '同じタイプの仲間がいるとき（ぷゆレンジャー）全能力1.2倍。',
    rangerPower: true
  },
  'きずのいたみ': {
    name: 'きずのいたみ',
    desc: '毎ターン接触を受けると相手も同じダメージの1/4を受ける。',
    contactReflect4: true
  },
  'ミイラほうたい': {
    name: 'ミイラほうたい',
    desc: '接触技を受けると相手の特性を「ミイラ」に変える（行動不能化）。',
    mummify: true
  },
  'みすてりーあら': {
    name: 'みすてりーあら',
    desc: '技の追加効果がすべて必ず発動する。',
    alwaysSecondary: true
  },
  'のろいのしるし': {
    name: 'のろいのしるし',
    desc: '毎ターン相手に「のろい」状態を付与しようとする（50%）。ゴーストなので通る。',
    endTurnCurse50: true
  },
  'ぷゆへんしん': {
    name: 'ぷゆへんしん',
    desc: 'HPが半分以下になるとタイプが「ぷゆ+あく」に変わり、技の威力が1.5倍。',
    transformBelow50: true
  },
  'さいぼうぶんれつ': {
    name: 'さいぼうぶんれつ',
    desc: '瀕死になったとき、HP30%のコピーを1体フィールドに出す。',
    cellSplit: true
  },
  'じかんのほうてき': {
    name: 'じかんのほうてき',
    desc: '毎ターン、時間が1つ進む（バトルが長くなると強化）。5ターン後から全能力1.1倍ずつ積み重なる。',
    timePower: true
  },
  '5おくねん': {
    name: '5おくねん',
    desc: '相手の技をかわすとき、5ターンに1回「5おくねんボタン」を押したことになり気が遠くなる（行動不能1ターン）。',
    fiveHundredMillion: true
  },
  'ヨーヨースピン': {
    name: 'ヨーヨースピン',
    desc: '素早さが常に最大。先制技を無効化する。',
    maxSpeed: true,
    blockPriority: true
  },
  'しゃくねつのめ': {
    name: 'しゃくねつのめ',
    desc: 'エスパー技を使ったとき、30%で相手を混乱させる。特攻が1.2倍。',
    esper30confuse: true,
    spaDmgMult: 1.2
  },
  'へいしのきりつ': {
    name: 'へいしのきりつ',
    desc: '同じタイプのぷゆモンが場に出ているとき、防御・特防が1.5倍。',
    allyDefenseBoost: true
  },
  'スリーディーすきゃん': {
    name: 'スリーディーすきゃん',
    desc: '相手のHPを正確に把握し、最もダメージが出る技を自動で選ぶ。',
    autoOptimalMove: true
  },
  'かんぱんのじょうほう': {
    name: 'かんぱんのじょうほう',
    desc: '相手の全情報を公開する（ステータス・技・特性）。',
    revealAll: true
  },
  'だんじきのちから': {
    name: 'だんじきのちから',
    desc: 'HPを消費して技を出すとき（はらだいこ等）ダメージが2倍。',
    hpCostDouble: true
  },
  'あんのじょう': {
    name: 'あんのじょう',
    desc: '予想外の技を受けたとき（等倍以下）、ダメージを0にして攻撃を1段階上げる。',
    surpriseAbsorb: true
  },
  'しゃかいのかべ': {
    name: 'しゃかいのかべ',
    desc: '仲間全員の防御・特防を1.1倍にする（パッシブ）。',
    teamDefBoost: true
  },
  'たいやパワー': {
    name: 'たいやパワー',
    desc: '回転系の技の威力が2倍。毎ターン素早さが1段階上がる。',
    spinPowerDouble: true,
    endTurnSpeUp: true
  },
  'ちいさなこえ': {
    name: 'ちいさなこえ',
    desc: '最大HP・攻撃は低いが、先制技の優先度が+2になる。',
    extraPriority2: true
  },
  'スケルトンボディ': {
    name: 'スケルトンボディ',
    desc: '防御が非常に高い。「みがわり」状態でもダメージを通す。',
    pierceSubstitute: true
  },
  'いんようのわ': {
    name: 'いんようのわ',
    desc: '攻撃と特攻のランクが常に連動する（片方が上がると両方上がる）。',
    atkSpaSynergy: true
  },
  'パンケーキそう': {
    name: 'パンケーキそう',
    desc: 'じめん技・いわ技を無効化する。毎ターンHPが1/8回復。',
    immuneGround: true,
    immuneRock: true,
    endTurnHeal: 8
  },
  'くりーちゃーふぉーす': {
    name: 'くりーちゃーふぉーす',
    desc: 'フィールドの全技の威力を1.1倍にする（自分も含む）。',
    fieldPowerBoost: true
  },
  'せんのうもーど': {
    name: 'せんのうもーど',
    desc: '相手の技選択をランダムに変更する（30%）。',
    brainwash30: true
  },
  'しゃりんのいかり': {
    name: 'しゃりんのいかり',
    desc: '回転系技の後、次の技の優先度が+2になる。素早さが常に高い。',
    postSpinPriority: true
  },
  'はぐるまのうた': {
    name: 'はぐるまのうた',
    desc: '音技を受けると逆にHPが回復する（1/4）。',
    soundHeal: true
  },
  'しょっかくセンサー': {
    name: 'しょっかくセンサー',
    desc: '相手の行動を1ターン前に察知し、先制できる確率が上がる（+1優先度）。',
    antennaSpeed: true
  },
  'ぼうけんのきぼう': {
    name: 'ぼうけんのきぼう',
    desc: '毎ターン冒険者として強くなる（素早さ+特攻が1段階ずつ上がる）。',
    adventureBuff: true
  },
  'にんじゃのすばやさ': {
    name: 'にんじゃのすばやさ',
    desc: '素早さが最大値の1.5倍。回避率が1段階上がった状態で登場する。',
    ninjaSpeed: true,
    onEntry: (battle, mon) => {
      return { raiseDodge: 1, msg: `${mon.name}のにんじゃのすばやさで回避率が上がった！` };
    }
  },
  'はじはじパワー': {
    name: 'はじはじパワー',
    desc: '相手を見て恥をかかせる（攻撃・特攻1段階ダウン）特性。自分も楽しむ（攻撃1段階UP）。',
    onEntry: (battle, mon) => {
      return { lowerEnemyAtk: 1, lowerEnemySpa: 1, raiseAtk: 1, msg: `${mon.name}のはじはじパワー！` };
    }
  },
  'とりのこころ': {
    name: 'とりのこころ',
    desc: 'ひこう技の威力1.5倍。毎ターン回避率が上がりやすい。',
    flyPowerMult: 1.5,
    endTurnDodge: true
  },
  'うわんのちから': {
    name: 'うわんのちから',
    desc: '腕力系の技の威力2倍。かくとう技も1.5倍。',
    armPowerDouble: true
  },
  'はかせのけいさん': {
    name: 'はかせのけいさん',
    desc: '特殊技ダメージが1.3倍。相手の特防を毎ターン1段階下げる試みをする（50%）。',
    spcDmgMult: 1.3,
    endTurnSpdefDown50: true
  },
  'ゆばばのてんせん': {
    name: 'ゆばばのてんせん',
    desc: '相手の持ち物を奪う（ターン開始時）。奪った持ち物の効果を自分が使う。',
    stealItem: true
  },
  'チーばのかんり': {
    name: 'チーばのかんり',
    desc: '全ての状態異常を治す。毎ターン味方のHPを1/12回復する。',
    cureStatus: true,
    allyHeal: 12
  },
  'えがおのひかり': {
    name: 'えがおのひかり',
    desc: '登場するだけで全員の戦意が上がる（全能力1段階UP）。',
    onEntry: (battle, mon) => {
      return { raiseAll: 1, target: 'self', msg: `${mon.name}の笑顔で戦意が高まった！` };
    }
  },
  'うちゅうさいきょう': {
    name: 'うちゅうさいきょう',
    desc: '全ての技の威力が1.5倍。全ての相性が等倍になる（無効は除く）。',
    allPowerMult: 1.5,
    typeNeutral: true
  },
  'ODほんのう': {
    name: 'ODほんのう',
    desc: '本能で最適な技を選ぶ。ランダムに「どうぐ」効果を発動することがある。',
    autoOptimalMove: true,
    randItemEffect: true
  },
  'うんこのちから': {
    name: 'うんこのちから',
    desc: 'どく技の威力2倍。フィールドを「どくびし」状態にする。',
    typePowerMult: { type: 'どく', mult: 2.0 },
    onEntry: (battle, mon) => {
      battle.field.toxicSpikes = (battle.field.toxicSpikes || 0) + 2;
      return { msg: `${mon.name}のうんこのちからでどくびしが2枚まかれた！` };
    }
  },
  'うちゅうじん': {
    name: 'うちゅうじん',
    desc: '全ての状態異常を無効化。全タイプに等倍でダメージを与える（耐性無視は除く）。',
    immuneAllStatus: true,
    pierceResistance: true
  },
  'かみのこのちから': {
    name: 'かみのこのちから',
    desc: '天使として生まれた加護で「ゴースト」「あく」技を無効化する。毎ターンHP1/8回復。',
    immuneGhost: true,
    immuneDark: true,
    endTurnHeal: 8
  },
  'あくまのちから': {
    name: 'あくまのちから',
    desc: 'あく技の威力2倍。毎ターン相手のHPを1/8奪う（すいとり）。',
    typePowerMult: { type: 'あく', mult: 2.0 },
    endTurnDrain8: true
  },
};

// 特性名一覧を取得
function getAbilityNames() {
  return Object.keys(ABILITIES);
}
