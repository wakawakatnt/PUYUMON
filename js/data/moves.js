// =====================================================
// ぷゆモン - 技データ
// =====================================================

/**
 * 技カテゴリ: physical(物理), special(特殊), status(変化)
 * priority: 優先度 (normal=0, +1, +2, -1等)
 * effect: 追加効果ID
 * target: self / enemy / all / field
 */
const MOVES = {
  // ===== ぷゆタイプ =====
  'ぷゆぷゆビーム': {
    name: 'ぷゆぷゆビーム',
    type: 'ぷゆ', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '強力なぷゆぷゆエネルギーを放つ。10%で相手を混乱させる。',
    effect: 'confuse10'
  },
  'ぷゆぷゆキャノン': {
    name: 'ぷゆぷゆキャノン',
    type: 'ぷゆ', category: 'special',
    power: 120, accuracy: 90, pp: 5,
    desc: '最大威力のぷゆぷゆ砲。使った後、ぷゆタイプ技の威力が下がる。',
    effect: 'recoilSpaDrop'
  },
  'ぷゆぷゆスマッシュ': {
    name: 'ぷゆぷゆスマッシュ',
    type: 'ぷゆ', category: 'physical',
    power: 80, accuracy: 100, pp: 15,
    desc: 'ぷゆぷゆパワーで殴る。50%で防御を1段階下げる。',
    effect: 'defDrop50'
  },
  'ぷゆぷゆシールド': {
    name: 'ぷゆぷゆシールド',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '自分のぷゆオーラで守る。防御・特防1段階UP。',
    effect: 'raiseBothDef', target: 'self'
  },
  'ぷゆぷゆアロー': {
    name: 'ぷゆぷゆアロー',
    type: 'ぷゆ', category: 'special',
    power: 40, accuracy: 100, pp: 30, priority: 1,
    desc: '先制で放つぷゆぷゆの矢。優先度+1。',
  },
  'えがおアタック': {
    name: 'えがおアタック',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: '笑顔で相手の攻撃・特攻を1段階下げる。',
    effect: 'lowerAtkSpa1', target: 'enemy'
  },
  'よみがえりのひかり': {
    name: 'よみがえりのひかり',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: 'HP50%回復し、状態異常を治す。',
    effect: 'healHalf', target: 'self'
  },
  'ぷゆぷゆのあらし': {
    name: 'ぷゆぷゆのあらし',
    type: 'ぷゆ', category: 'special',
    power: 110, accuracy: 70, pp: 5,
    desc: '嵐のようなぷゆエネルギー。高威力だが命中不安定。',
  },
  'ぷゆぷゆダンス': {
    name: 'ぷゆぷゆダンス',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '全能力ランクを1段階上げる。',
    effect: 'raiseAll1', target: 'self'
  },

  // ===== ノーマルタイプ =====
  'たいあたり': {
    name: 'たいあたり',
    type: 'ノーマル', category: 'physical',
    power: 35, accuracy: 95, pp: 35,
    desc: 'からだをぶつけてダメージを与える。',
  },
  'はかいこうせん': {
    name: 'はかいこうせん',
    type: 'ノーマル', category: 'special',
    power: 150, accuracy: 90, pp: 5,
    desc: 'ものすごい破壊光線。次のターン休む。',
    effect: 'recharge'
  },
  'ギガインパクト': {
    name: 'ギガインパクト',
    type: 'ノーマル', category: 'physical',
    power: 150, accuracy: 90, pp: 5,
    desc: '全力で体当たりする。次のターン休む。',
    effect: 'recharge'
  },
  'おんがえし': {
    name: 'おんがえし',
    type: 'ノーマル', category: 'physical',
    power: 102, accuracy: 100, pp: 15,
    desc: 'なつき度が高いほど威力が上がる。',
  },
  'みがわり': {
    name: 'みがわり',
    type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'HP25%を消費して身代わり人形を作る。',
    effect: 'substitute', target: 'self'
  },
  'こうそくいどう': {
    name: 'こうそくいどう',
    type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 30,
    desc: '素早さを2段階上げる。',
    effect: 'raiseSpe2', target: 'self'
  },
  'てっぺき': {
    name: 'てっぺき',
    type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '防御を2段階上げる。',
    effect: 'raiseDef2', target: 'self'
  },
  'なきごえ': {
    name: 'なきごえ',
    type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 40,
    desc: '相手の攻撃を1段階下げる。',
    effect: 'lowerAtk1', target: 'enemy'
  },
  'ねむる': {
    name: 'ねむる',
    type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '眠ることでHP全回復。2ターン眠る。',
    effect: 'sleep', target: 'self'
  },
  'じこあんじ': {
    name: 'じこあんじ',
    type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '相手の能力ランク変化をコピーする。',
    effect: 'copyStatChanges', target: 'self'
  },
  'のしかかり': {
    name: 'のしかかり',
    type: 'ノーマル', category: 'physical',
    power: 85, accuracy: 100, pp: 15,
    desc: 'のしかかってダメージ。30%でまひ。',
    effect: 'paralyze30'
  },
  'すてみタックル': {
    name: 'すてみタックル',
    type: 'ノーマル', category: 'physical',
    power: 120, accuracy: 100, pp: 15,
    desc: '全力タックル。ダメージの1/3が自分に返ってくる。',
    effect: 'recoil33'
  },
  'どわすれ': {
    name: 'どわすれ',
    type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '特防を2段階上げる。',
    effect: 'raiseSpd2', target: 'self'
  },
  'ハイパーボイス': {
    name: 'ハイパーボイス',
    type: 'ノーマル', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '大きな声でダメージ。防音状態でも通る音技。',
    sound: true
  },
  'いのちがけ': {
    name: 'いのちがけ',
    type: 'ノーマル', category: 'physical',
    power: 0, accuracy: 90, pp: 5,
    desc: '自分のHPを全て消費して相手を道連れにする。',
    effect: 'destiny'
  },
  'へんしん': {
    name: 'へんしん',
    type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '相手の姿に完全に変身する。',
    effect: 'transform', target: 'self'
  },

  // ===== ほのおタイプ =====
  'かえんほうしゃ': {
    name: 'かえんほうしゃ',
    type: 'ほのお', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: '炎を放つ。10%でやけど。',
    effect: 'burn10'
  },
  'だいもんじ': {
    name: 'だいもんじ',
    type: 'ほのお', category: 'special',
    power: 110, accuracy: 85, pp: 5,
    desc: '巨大な炎。10%でやけど。',
    effect: 'burn10'
  },
  'ほのおのうず': {
    name: 'ほのおのうず',
    type: 'ほのお', category: 'special',
    power: 35, accuracy: 85, pp: 15,
    desc: '炎の渦で2〜5ターン攻撃し続ける。',
    effect: 'trap25'
  },
  'にほんばれ': {
    name: 'にほんばれ',
    type: 'ほのお', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '天気を晴れにする（5ターン）。',
    effect: 'sunny', target: 'field'
  },
  'フレアドライブ': {
    name: 'フレアドライブ',
    type: 'ほのお', category: 'physical',
    power: 120, accuracy: 100, pp: 15,
    desc: '炎を纏って突進。反動ダメージあり。10%でやけど。',
    effect: 'recoil33_burn10'
  },
  'オーバーヒート': {
    name: 'オーバーヒート',
    type: 'ほのお', category: 'special',
    power: 130, accuracy: 90, pp: 5,
    desc: '全力炎攻撃。使った後、特攻が2段階下がる。',
    effect: 'spaDrop2'
  },

  // ===== みずタイプ =====
  'なみのり': {
    name: 'なみのり',
    type: 'みず', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: '大波でダメージを与える。',
  },
  'ハイドロポンプ': {
    name: 'ハイドロポンプ',
    type: 'みず', category: 'special',
    power: 110, accuracy: 80, pp: 5,
    desc: '強力な水流。高威力。',
  },
  'アクアジェット': {
    name: 'アクアジェット',
    type: 'みず', category: 'physical',
    power: 40, accuracy: 100, pp: 20, priority: 1,
    desc: '水をまとって先制攻撃する。',
  },
  'あまごい': {
    name: 'あまごい',
    type: 'みず', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '天気を雨にする（5ターン）。',
    effect: 'rain', target: 'field'
  },

  // ===== くさタイプ =====
  'ソーラービーム': {
    name: 'ソーラービーム',
    type: 'くさ', category: 'special',
    power: 120, accuracy: 100, pp: 10,
    desc: '光を吸収して次のターンに放つ。晴れなら即発動。',
    effect: 'twoTurn_sunny'
  },
  'エナジーボール': {
    name: 'エナジーボール',
    type: 'くさ', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: 'エネルギーの塊。10%で特防1段階ダウン。',
    effect: 'spdefDrop10'
  },
  'やどりぎのたね': {
    name: 'やどりぎのたね',
    type: 'くさ', category: 'status',
    power: 0, accuracy: 90, pp: 10,
    desc: '種を植えて毎ターンHPを奪う。',
    effect: 'leechSeed', target: 'enemy'
  },

  // ===== でんきタイプ =====
  'かみなり': {
    name: 'かみなり',
    type: 'でんき', category: 'special',
    power: 110, accuracy: 70, pp: 10,
    desc: '強力な雷。30%でまひ。雨なら必中、晴れなら命中が下がる。',
    effect: 'paralyze30'
  },
  '10まんボルト': {
    name: '10まんボルト',
    type: 'でんき', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: 'でんき攻撃。10%でまひ。',
    effect: 'paralyze10'
  },
  'でんじは': {
    name: 'でんじは',
    type: 'でんき', category: 'status',
    power: 0, accuracy: 90, pp: 20,
    desc: '電磁波でまひにする。',
    effect: 'paralyze', target: 'enemy'
  },
  'かみなりパンチ': {
    name: 'かみなりパンチ',
    type: 'でんき', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true,
    desc: '電気をまとったパンチ。10%でまひ。',
    effect: 'paralyze10'
  },

  // ===== こおりタイプ =====
  'れいとうビーム': {
    name: 'れいとうビーム',
    type: 'こおり', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '冷凍ビーム。10%でこおり。',
    effect: 'freeze10'
  },
  'ふぶき': {
    name: 'ふぶき',
    type: 'こおり', category: 'special',
    power: 110, accuracy: 70, pp: 5,
    desc: '猛吹雪。30%でこおり。吹雪なら必中。',
    effect: 'freeze30'
  },
  'こおりのつぶて': {
    name: 'こおりのつぶて',
    type: 'こおり', category: 'physical',
    power: 40, accuracy: 100, pp: 30, priority: 1,
    desc: '氷の塊を先制で投げる。',
  },

  // ===== かくとうタイプ =====
  'きしかいせい': {
    name: 'きしかいせい',
    type: 'かくとう', category: 'physical',
    power: 0, accuracy: 100, pp: 10,
    desc: 'HPが少ないほど威力が上がる（最大200）。',
    effect: 'reversal'
  },
  'かかとおとし': {
    name: 'かかとおとし',
    type: 'かくとう', category: 'physical',
    power: 65, accuracy: 100, pp: 25, contact: true,
    desc: 'かかとで踏みつける。',
  },
  'クロスチョップ': {
    name: 'クロスチョップ',
    type: 'かくとう', category: 'physical',
    power: 100, accuracy: 80, pp: 5, contact: true,
    desc: '強烈チョップ。急所に当たりやすい。',
    effect: 'highCrit'
  },
  'インファイト': {
    name: 'インファイト',
    type: 'かくとう', category: 'physical',
    power: 120, accuracy: 100, pp: 5, contact: true,
    desc: '激しい接近戦。使った後、防御・特防が1段階下がる。',
    effect: 'defSpdefDrop1'
  },
  'ばくれつパンチ': {
    name: 'ばくれつパンチ',
    type: 'かくとう', category: 'physical',
    power: 100, accuracy: 100, pp: 5, contact: true,
    desc: '必ず混乱させる。',
    effect: 'confuse100'
  },

  // ===== どくタイプ =====
  'どくどく': {
    name: 'どくどく',
    type: 'どく', category: 'status',
    power: 0, accuracy: 90, pp: 10,
    desc: '相手をもうどく状態にする。',
    effect: 'toxicPoison', target: 'enemy'
  },
  'ベノムショック': {
    name: 'ベノムショック',
    type: 'どく', category: 'special',
    power: 65, accuracy: 100, pp: 10,
    desc: 'どく状態の相手には威力が2倍。',
    effect: 'doubleVsPoison'
  },
  'ヘドロばくだん': {
    name: 'ヘドロばくだん',
    type: 'どく', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '汚泥の爆弾。30%でどく。',
    effect: 'poison30'
  },

  // ===== じめんタイプ =====
  'じしん': {
    name: 'じしん',
    type: 'じめん', category: 'physical',
    power: 100, accuracy: 100, pp: 10,
    desc: '地震。全ての相手に当たる。',
  },
  'だいちのちから': {
    name: 'だいちのちから',
    type: 'じめん', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '大地の力。10%で特防1段階ダウン。',
    effect: 'spdefDrop10'
  },

  // ===== ひこうタイプ =====
  'そらをとぶ': {
    name: 'そらをとぶ',
    type: 'ひこう', category: 'physical',
    power: 90, accuracy: 95, pp: 15,
    desc: '空に飛び上がり次のターンに攻撃。',
    effect: 'twoTurn'
  },
  'ぼうふう': {
    name: 'ぼうふう',
    type: 'ひこう', category: 'special',
    power: 110, accuracy: 70, pp: 10,
    desc: '暴風。30%で混乱。雨なら必中。',
    effect: 'confuse30'
  },
  'ブレイブバード': {
    name: 'ブレイブバード',
    type: 'ひこう', category: 'physical',
    power: 120, accuracy: 100, pp: 15, contact: true,
    desc: '全力飛翔攻撃。ダメージの1/3が自分に返る。',
    effect: 'recoil33'
  },

  // ===== エスパータイプ =====
  'サイコキネシス': {
    name: 'サイコキネシス',
    type: 'エスパー', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '念力攻撃。10%で特防1段階ダウン。',
    effect: 'spdefDrop10'
  },
  'サイコショック': {
    name: 'サイコショック',
    type: 'エスパー', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '防御で計算する特殊技。',
    effect: 'useDefense'
  },
  'みらいよち': {
    name: 'みらいよち',
    type: 'エスパー', category: 'special',
    power: 120, accuracy: 100, pp: 10,
    desc: '2ターン後にダメージを与える。',
    effect: 'futureAttack2'
  },
  'サイコブースト': {
    name: 'サイコブースト',
    type: 'エスパー', category: 'special',
    power: 140, accuracy: 90, pp: 5,
    desc: '全力サイコ攻撃。特攻が2段階下がる。',
    effect: 'spaDrop2'
  },
  'テレポート': {
    name: 'テレポート',
    type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 20, priority: -6,
    desc: 'ひかえに交代する（優先度-6）。',
    effect: 'switch', target: 'self'
  },

  // ===== むしタイプ =====
  'むしのさざめき': {
    name: 'むしのさざめき',
    type: 'むし', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '虫の声。50%で特防1段階ダウン。',
    effect: 'spdefDrop50'
  },
  'シザークロス': {
    name: 'シザークロス',
    type: 'むし', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: 'ハサミで切る。急所率UP。',
    effect: 'highCrit'
  },

  // ===== いわタイプ =====
  'ストーンエッジ': {
    name: 'ストーンエッジ',
    type: 'いわ', category: 'physical',
    power: 100, accuracy: 80, pp: 5,
    desc: '岩の刃で攻撃。急所率UP。',
    effect: 'highCrit'
  },
  'がんせきふうじ': {
    name: 'がんせきふうじ',
    type: 'いわ', category: 'physical',
    power: 60, accuracy: 95, pp: 15,
    desc: '岩で攻撃。必ず素早さ1段階DOWN。',
    effect: 'speDrop100'
  },

  // ===== ゴーストタイプ =====
  'シャドーボール': {
    name: 'シャドーボール',
    type: 'ゴースト', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '影の塊を投げる。20%で特防1段階DOWN。',
    effect: 'spdefDrop20'
  },
  'のろい': {
    name: 'のろい',
    type: 'ゴースト', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'HP1/2を消費して呪いをかける。毎ターン1/4ダメージ。',
    effect: 'curse', target: 'enemy'
  },
  'たたりめ': {
    name: 'たたりめ',
    type: 'ゴースト', category: 'special',
    power: 65, accuracy: 100, pp: 10,
    desc: '状態異常の相手には威力2倍。',
    effect: 'doubleVsStatus'
  },
  'ナイトヘッド': {
    name: 'ナイトヘッド',
    type: 'ゴースト', category: 'special',
    power: 0, accuracy: 100, pp: 15,
    desc: '自分のレベルと同じダメージを与える（固定ダメージ）。',
    effect: 'levelDamage'
  },

  // ===== ドラゴンタイプ =====
  'りゅうせいぐん': {
    name: 'りゅうせいぐん',
    type: 'ドラゴン', category: 'special',
    power: 130, accuracy: 90, pp: 5,
    desc: '隕石の嵐。特攻が2段階ダウン。',
    effect: 'spaDrop2'
  },
  'げきりん': {
    name: 'げきりん',
    type: 'ドラゴン', category: 'physical',
    power: 120, accuracy: 100, pp: 10, contact: true,
    desc: '2〜3ターン攻撃し続け、終わると混乱する。',
    effect: 'thrash'
  },
  'ドラゴンクロー': {
    name: 'ドラゴンクロー',
    type: 'ドラゴン', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '鋭い爪でダメージ。',
  },

  // ===== あくタイプ =====
  'あくのはどう': {
    name: 'あくのはどう',
    type: 'あく', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '悪のエネルギー。20%で怯み。',
    effect: 'flinch20'
  },
  'かみくだく': {
    name: 'かみくだく',
    type: 'あく', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '噛みつく。20%で防御1段階DOWN。',
    effect: 'defDrop20'
  },
  'イカサマ': {
    name: 'イカサマ',
    type: 'あく', category: 'physical',
    power: 95, accuracy: 100, pp: 15,
    desc: '相手の攻撃力を使って計算する。',
    effect: 'useEnemyAtk'
  },

  // ===== はがねタイプ =====
  'アイアンヘッド': {
    name: 'アイアンヘッド',
    type: 'はがね', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '金属の頭で攻撃。30%で怯み。',
    effect: 'flinch30'
  },
  'コメットパンチ': {
    name: 'コメットパンチ',
    type: 'はがね', category: 'physical',
    power: 85, accuracy: 90, pp: 5, contact: true,
    desc: '3〜5回連続で攻撃。命中するたびに威力UP。',
    effect: 'multihit35'
  },
  'ラスターカノン': {
    name: 'ラスターカノン',
    type: 'はがね', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '光を凝縮して放つ。10%で特防1段階DOWN。',
    effect: 'spdefDrop10'
  },

  // ===== フェアリータイプ =====
  'ムーンフォース': {
    name: 'ムーンフォース',
    type: 'フェアリー', category: 'special',
    power: 95, accuracy: 100, pp: 15,
    desc: '月の力。30%で特攻1段階DOWN。',
    effect: 'spaDrop30'
  },
  'マジカルシャイン': {
    name: 'マジカルシャイン',
    type: 'フェアリー', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '魔法の輝き。',
  },
  'マジカルフレイム': {
    name: 'マジカルフレイム',
    type: 'フェアリー', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '魔法の炎。100%で特攻1段階DOWN。',
    effect: 'spaDrop100'
  },
  'チャームボイス': {
    name: 'チャームボイス',
    type: 'フェアリー', category: 'special',
    power: 40, accuracy: 0, pp: 15,
    desc: '必中の可愛い声攻撃。',
  },
  'なやみのたね': {
    name: 'なやみのたね',
    type: 'フェアリー', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '相手の特性を「なやみのたね（無効）」に変える。',
    effect: 'disableAbility', target: 'enemy'
  },

  // ===== 固有技（オリジナル） =====
  'ぷゆゆキック': {
    name: 'ぷゆゆキック',
    type: 'ぷゆ', category: 'physical',
    power: 75, accuracy: 100, pp: 20, contact: true,
    desc: 'ぷゆゆ独特のキック。急所率が高い。',
    effect: 'highCrit'
  },
  'うゆゆのうた': {
    name: 'うゆゆのうた',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 55, pp: 15,
    desc: '不思議な歌で相手を眠らせる。',
    effect: 'sleep', target: 'enemy', sound: true
  },
  'いっぴつがきアタック': {
    name: 'いっぴつがきアタック',
    type: 'ぷゆ', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '一筆書きで全身を使って攻撃する。',
  },
  'ぺゆゆのうそ': {
    name: 'ぺゆゆのうそ',
    type: 'カオス', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '嘘をついて相手の防御・特防を1段階ずつ下げる。',
    effect: 'lowerDefSpdef', target: 'enemy'
  },
  'およよのさけび': {
    name: 'およよのさけび',
    type: 'ぷゆ', category: 'special',
    power: 50, accuracy: 100, pp: 25,
    desc: '驚いた声でダメージ。20%でひるむ。音技。',
    effect: 'flinch20', sound: true
  },
  'チーギュウアタック': {
    name: 'チーギュウアタック',
    type: 'ノーマル', category: 'physical',
    power: 60, accuracy: 90, pp: 20, contact: true,
    desc: 'チー牛の生き様をぶつける。',
  },
  'ぼくちんパンチ': {
    name: 'ぼくちんパンチ',
    type: 'かくとう', category: 'physical',
    power: 50, accuracy: 100, pp: 30, contact: true, priority: 1,
    desc: '先制で殴る。',
  },
  'したいのゆうき': {
    name: 'したいのゆうき',
    type: 'ゴースト', category: 'physical',
    power: 80, accuracy: 100, pp: 15,
    desc: '死体の力で攻撃。使用後、自分はひんし状態にならない（一度だけ）。',
    effect: 'surviveOnce'
  },
  'えへへのわらい': {
    name: 'えへへのわらい',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: '相手を笑わせて行動不能にする（1ターン）。',
    effect: 'encore', target: 'enemy'
  },
  'くすくすわらい': {
    name: 'くすくすわらい',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 85, pp: 20,
    desc: 'くすくす笑って相手を混乱させる。',
    effect: 'confuse100', target: 'enemy'
  },
  'びえんのなみだ': {
    name: 'びえんのなみだ',
    type: 'みず', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '大粒の涙でダメージ。100%で相手の特攻1段階DOWN。',
    effect: 'spaDrop100'
  },
  'ゆめみちらし': {
    name: 'ゆめみちらし',
    type: 'げんそう', category: 'special',
    power: 85, accuracy: 90, pp: 10,
    desc: '夢の欠片を撒き散らす。眠り状態の相手には威力2倍。',
    effect: 'doubleVsSleep'
  },
  'げゆゆボム': {
    name: 'げゆゆボム',
    type: 'どく', category: 'special',
    power: 90, accuracy: 85, pp: 10,
    desc: '毒の爆弾を投げる。100%でどく状態にする。',
    effect: 'poison100'
  },
  'カチコチフリーズ': {
    name: 'カチコチフリーズ',
    type: 'こおり', category: 'physical',
    power: 85, accuracy: 95, pp: 10,
    desc: '凍りついた体で攻撃。50%でこおり状態にする。',
    effect: 'freeze50'
  },
  'ホッティバーン': {
    name: 'ホッティバーン',
    type: 'ほのお', category: 'special',
    power: 85, accuracy: 100, pp: 10,
    desc: '灼熱の炎。必ずやけどにする。',
    effect: 'burn100'
  },
  'マルクのたいほう': {
    name: 'マルクのたいほう',
    type: 'ぷゆ', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: 'ぷゆゆ大砲。30%で混乱させる。',
    effect: 'confuse30'
  },
  'ジョンソンぎり': {
    name: 'ジョンソンぎり',
    type: 'ノーマル', category: 'physical',
    power: 80, accuracy: 90, pp: 15, contact: true,
    desc: 'ジョンソン流の切り技。',
  },
  'てんさいのひらめき': {
    name: 'てんさいのひらめき',
    type: 'エスパー', category: 'special',
    power: 100, accuracy: 95, pp: 10,
    desc: '天才の閃きで攻撃。必ず急所に当たる。',
    effect: 'alwaysCrit'
  },
  'てりりのいかり': {
    name: 'てりりのいかり',
    type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 100, pp: 20,
    desc: '怒りのパワーで攻撃。',
  },
  'おんたこのいかり': {
    name: 'おんたこのいかり',
    type: 'ぷゆ', category: 'special',
    power: 100, accuracy: 90, pp: 10,
    desc: '怒り狂った力で攻撃。使うたびに攻撃・特攻が1段階上がる。',
    effect: 'rageAtk'
  },
  'まつもとのちえ': {
    name: 'まつもとのちえ',
    type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '知恵で特防と特攻を2段階上げる。',
    effect: 'raiseSpaSpd', target: 'self'
  },
  'はかいのさけび': {
    name: 'はかいのさけび',
    type: 'ハイパー', category: 'special',
    power: 120, accuracy: 80, pp: 5,
    desc: '破壊神の叫び。全ステータスを無視する貫通ダメージ。',
    effect: 'pierce'
  },
  'ゴシゴシあらう': {
    name: 'ゴシゴシあらう',
    type: 'ぷゆ', category: 'physical',
    power: 65, accuracy: 100, pp: 20, contact: true,
    desc: 'ゴシゴシ洗う。相手の能力変化を全てリセットする。',
    effect: 'clearStatChanges'
  },
  'おちていくさだめ': {
    name: 'おちていくさだめ',
    type: 'ぷゆ', category: 'physical',
    power: 80, accuracy: 90, pp: 15,
    desc: 'どんどん落ちていく。使うたびに威力が10ずつ上がる（最大200）。',
    effect: 'growingPower'
  },
  'ホラービジョン': {
    name: 'ホラービジョン',
    type: 'ゴースト', category: 'status',
    power: 0, accuracy: 100, pp: 15,
    desc: 'ホラーな姿で相手を脅かす。相手の攻撃・特攻・素早さを1段階下げる。',
    effect: 'lowerAtkSpaSpeed', target: 'enemy'
  },
  'げきおこメテオ': {
    name: 'げきおこメテオ',
    type: 'ぷゆ', category: 'special',
    power: 120, accuracy: 85, pp: 5,
    desc: '激怒メテオ。相手のHPが少ないほど威力が下がる（逆きしかいせい）。',
    effect: 'crescentPower'
  },
  'カオスエネルギー': {
    name: 'カオスエネルギー',
    type: 'カオス', category: 'special',
    power: 0, accuracy: 100, pp: 10,
    desc: 'ランダムなタイプのエネルギーでダメージ（威力50〜150）。',
    effect: 'chaos'
  },
  'ゼロポイントバースト': {
    name: 'ゼロポイントバースト',
    type: 'ぷゆ', category: 'special',
    power: 150, accuracy: 90, pp: 5,
    desc: '全てをゼロにする爆発。反動で自分のHPが半分になる。',
    effect: 'recoilHalf'
  },
  'むげんのひかり': {
    name: 'むげんのひかり',
    type: 'ひこう', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '無限の光。5ターン「ひかりのかべ」効果を発動する。',
    effect: 'lightScreen5'
  },
  'みゆゆステップ': {
    name: 'みゆゆステップ',
    type: 'フェアリー', category: 'physical',
    power: 65, accuracy: 100, pp: 20, contact: true,
    desc: '軽やかなステップ。使うたびに素早さが1段階上がる。',
    effect: 'speedUpEachUse'
  },
  'すやすやレスト': {
    name: 'すやすやレスト',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '深く眠ってHP全回復＋全能力1段階UP。3ターン眠る。',
    effect: 'deepSleep', target: 'self'
  },
  'ムジュラのうた': {
    name: 'ムジュラのうた',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 85, pp: 5,
    desc: '全てを滅ぼす歌。相手を3ターン後に確定瀕死にする。',
    effect: 'countdown3',
    sound: true
  },
  'やみのはどう': {
    name: 'やみのはどう',
    type: 'あく', category: 'special',
    power: 95, accuracy: 95, pp: 10,
    desc: '暗黒の波動。光を全て吸収する。ひかりのかべ・リフレクターを無効化。',
    effect: 'breakScreens'
  },
  'はんざいのいぬ': {
    name: 'はんざいのいぬ',
    type: 'あく', category: 'physical',
    power: 80, accuracy: 90, pp: 10,
    desc: '犯人を追い詰める。急所率MAX。',
    effect: 'alwaysCrit'
  },
  'よびこみのじゅもん': {
    name: 'よびこみのじゅもん',
    type: 'げんそう', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: 'フィールドに呪いをかける。毎ターン全員に1/16ダメージ。',
    effect: 'hazardField', target: 'field'
  },
  'ほしになったぼくちん': {
    name: 'ほしになったぼくちん',
    type: 'ひこう', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '星になったぼくちんの光で攻撃。相手を魅了状態にする（20%）。',
    effect: 'attract20'
  },
  'さいぼうぶんれつ': {
    name: 'さいぼうぶんれつ',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '自分をHP25%消費してHP25%のコピーを1体呼び出す。',
    effect: 'cellDivide', target: 'self'
  },
  'じかんのやじるし': {
    name: 'じかんのやじるし',
    type: 'エスパー', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '時の矢で攻撃。この技はターン中最初に発動する（優先度+2）。',
    priority: 2
  },
  '5おくねんのあくむ': {
    name: '5おくねんのあくむ',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 90, pp: 5,
    desc: '5億年後の恐怖を見せる。相手を1〜3ターン眠らせる。',
    effect: 'sleep', target: 'enemy'
  },
  'ヨーヨーアタック': {
    name: 'ヨーヨーアタック',
    type: 'ぷゆ', category: 'physical',
    power: 65, accuracy: 100, pp: 20,
    desc: 'ヨーヨーで攻撃。2回命中する。',
    effect: 'twiceHit'
  },
  'にゃざーるビーム': {
    name: 'にゃざーるビーム',
    type: 'エスパー', category: 'special',
    power: 100, accuracy: 95, pp: 10,
    desc: '神秘的な目から放つビーム。20%で相手を魅了する。',
    effect: 'attract20'
  },
  'こうしんのぐんぜい': {
    name: 'こうしんのぐんぜい',
    type: 'しれい', category: 'physical',
    power: 25, accuracy: 100, pp: 20,
    desc: '兵士を4〜5体呼んで連続攻撃する。',
    effect: 'multihit45'
  },
  'ぷゆへんしん': {
    name: 'ぷゆへんしん',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'ぷゆタイプ+あくタイプに変身し、攻撃が大幅UP。',
    effect: 'typeChange', target: 'self'
  },
  'ミイラまき': {
    name: 'ミイラまき',
    type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 95, pp: 15, contact: true,
    desc: '包帯で巻き付ける。相手の行動速度を下げ、50%で行動不能にする。',
    effect: 'wrap_slow'
  },
  'コンパスしじ': {
    name: 'コンパスしじ',
    type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '正確な方向指示で攻撃・素早さを1段階UP。',
    effect: 'raiseAtkSpe', target: 'self'
  },
  'ぷゆムーンライト': {
    name: 'ぷゆムーンライト',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '月の光を浴びてHP回復。夜は1/2、昼は1/4回復。',
    effect: 'moonlight', target: 'self'
  },
  'ゼロカノン': {
    name: 'ゼロカノン',
    type: 'ぷゆ', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: 'ゼロに帰す砲撃。相手の能力変化を全てリセットしてダメージ。',
    effect: 'clearAndDmg'
  },
  'ロールシャッハテスト': {
    name: 'ロールシャッハテスト',
    type: 'エスパー', category: 'status',
    power: 0, accuracy: 85, pp: 10,
    desc: '相手の心理を読み、混乱か恐怖（攻撃DOWN）のどちらかを与える。',
    effect: 'confuseOrDown', target: 'enemy'
  },
  'くろきりのとばり': {
    name: 'くろきりのとばり',
    type: 'ゴースト', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '黒い霧で自分の命中回避を1段階ずつ操作する。',
    effect: 'mist', target: 'self'
  },
  'ふうじられたわざ': {
    name: 'ふうじられたわざ',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '相手の技を1つ封じる（3ターン使えなくする）。',
    effect: 'disable', target: 'enemy'
  },
  'はかせのかいせき': {
    name: 'はかせのかいせき',
    type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '相手のステータス・技・特性を完全に解析する。',
    effect: 'revealAll', target: 'enemy'
  },
  'タイヤスピン': {
    name: 'タイヤスピン',
    type: 'ぷゆ', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '高速回転で攻撃。使うたびに素早さが1段階上がる。',
    effect: 'speedUpEachUse'
  },
  'ちいさなきずぐち': {
    name: 'ちいさなきずぐち',
    type: 'ぷゆ', category: 'physical',
    power: 40, accuracy: 100, pp: 35, priority: 2,
    desc: '小さな傷で攻撃。優先度+2。',
  },
  'スケルトンアタック': {
    name: 'スケルトンアタック',
    type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 100, pp: 20,
    desc: '骨組みで攻撃。みがわりを貫通する。',
    effect: 'pierceSub'
  },
  'いんようのかい': {
    name: 'いんようのかい',
    type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '陰陽のバランスを整え、攻撃・特攻・防御・特防を1段階ずつ上げる。',
    effect: 'raiseAtkDefSpaSped', target: 'self'
  },
  'パンケーキプレス': {
    name: 'パンケーキプレス',
    type: 'ぷゆ', category: 'physical',
    power: 90, accuracy: 95, pp: 10, contact: true,
    desc: '重さで押しつぶす。相手の重さが重いほど威力UP（最大120）。',
    effect: 'weightBased'
  },
  'にんじゃのもみじ': {
    name: 'にんじゃのもみじ',
    type: 'くさ', category: 'special',
    power: 70, accuracy: 100, pp: 20,
    desc: '忍法もみじがくれ。相手の命中率を1段階下げる。',
    effect: 'accDrop1', target: 'enemy'
  },
  'バードアタック': {
    name: 'バードアタック',
    type: 'ひこう', category: 'physical',
    power: 60, accuracy: 100, pp: 25, contact: true,
    desc: '鳥の爪で攻撃。',
  },
  'うわんスラップ': {
    name: 'うわんスラップ',
    type: 'かくとう', category: 'physical',
    power: 85, accuracy: 95, pp: 15, contact: true,
    desc: '腕でビンタ。相手の防御を1段階下げる。',
    effect: 'defDrop100'
  },
  'ゆばばのじゅもん': {
    name: 'ゆばばのじゅもん',
    type: 'げんそう', category: 'special',
    power: 80, accuracy: 90, pp: 10,
    desc: '強力な呪文。相手の名前を変えて（スタック）混乱させる。',
    effect: 'confuse50'
  },
  'チーばのかんとく': {
    name: 'チーばのかんとく',
    type: 'げんそう', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '全ての状態異常を回復し、味方全員のHPを1/8回復する。',
    effect: 'healAll', target: 'self'
  },
  'パブロのほりあげ': {
    name: 'パブロのほりあげ',
    type: 'じめん', category: 'physical',
    power: 80, accuracy: 100, pp: 15,
    desc: 'スコップで掘り上げる。じめん技が無効の相手にも当たる。',
    effect: 'pierceFly'
  },
  'うんこボム': {
    name: 'うんこボム',
    type: 'どく', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: '巨大なうんこ爆弾。100%でどく状態にする。',
    effect: 'poison100'
  },
  'うちゅうエネルギー': {
    name: 'うちゅうエネルギー',
    type: 'ハイパー', category: 'special',
    power: 100, accuracy: 100, pp: 5,
    desc: '宇宙のエネルギーで攻撃。どんな耐性も貫通する。',
    effect: 'pierceAll'
  },
  'かみのおくりもの': {
    name: 'かみのおくりもの',
    type: 'フェアリー', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '天使の加護で自分・仲間のHP全回復。',
    effect: 'healAll', target: 'self'
  },
  'あくまのけいやく': {
    name: 'あくまのけいやく',
    type: 'あく', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '悪魔との契約で全能力2段階UP。HP半分を消費する。',
    effect: 'sacrificeRaiseAll', target: 'self'
  },
  'たかしのひこう': {
    name: 'たかしのひこう',
    type: 'ひこう', category: 'physical',
    power: 80, accuracy: 100, pp: 10,
    desc: '宇宙人の力で飛行して攻撃。',
  },
  'エグザイルの花道': {
    name: 'エグザイルの花道',
    type: 'ぷゆ', category: 'special',
    power: 85, accuracy: 95, pp: 10,
    desc: '移民の誇りで攻撃。相手の防御・特防を同時に1段階下げる。',
    effect: 'lowerDefSpdef'
  },
  'しんかのちから': {
    name: 'しんかのちから',
    type: 'ぷゆ', category: 'special',
    power: 60, accuracy: 100, pp: 20,
    desc: '進化のエネルギーで攻撃。急所率UP。使うたびに強くなる。',
    effect: 'highCrit'
  },
  'おでビーム': {
    name: 'おでビーム',
    type: 'ぷゆ', category: 'special',
    power: 110, accuracy: 95, pp: 10,
    desc: '地上最強のビーム。貫通性能あり。',
    effect: 'pierce'
  },
  'おでゴッドパンチ': {
    name: 'おでゴッドパンチ',
    type: 'ハイパー', category: 'physical',
    power: 140, accuracy: 85, pp: 5, contact: true,
    desc: '神の拳。一撃の可能性がある。',
    effect: 'ohko10'
  },
};

function getMoveNames() {
  return Object.keys(MOVES);
}
