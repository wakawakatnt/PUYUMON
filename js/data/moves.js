// =====================================================
// ぷゆモン - 技データ (構造化エフェクト版)
// =====================================================
//
// effect は配列で、各要素は以下のキーを持つオブジェクト:
//   trigger: 'hit' | 'use' | 'always'  (ダメージ命中時/使用時/常時)
//   chance: 0~100 (発動確率%, 100=確定)
//   target: 'self' | 'enemy' | 'field'
//   action: 文字列 (処理ID)
//   value: 任意の値
//
// 変化技は category='status' で、effect 配列のみで処理。
// ダメージ技は power>0 で、追加効果として effect 配列を持つ。
//
// drain: number (与ダメの何%を吸収するか, 例: 50)
// recoil: number (最大HPの何分の1を反動ダメージとして受けるか, 例: 4 → 1/4)
// recoilDamage: number (与ダメの何分の1を反動, 例: 3 → 1/3)
// contact: boolean (接触技かどうか)
// sound: boolean (音技かどうか)
// punch: boolean (パンチ技かどうか)
// bite: boolean (噛みつき技かどうか)
// priority: number (優先度, デフォルト0)
// critRateBonus: number (急所ランク追加, 例: 1)
// alwaysCrit: boolean (確定急所)
// multiHit: [min, max] (連続技の回数範囲)
// fixedHits: number (固定回数技)
// twoTurn: boolean (2ターン技)
// pierceSub: boolean (みがわり貫通)
// pierceProtect: boolean (まもる貫通)
// pierceResistance: boolean (耐性無視)
// hpScaling: 'reversal' | 'maxHpPower' (HP依存威力)

const MOVES = {

  // =============================================================
  //  ぷゆタイプ
  // =============================================================
  'ぷゆぷゆビーム': {
    name: 'ぷゆぷゆビーム', type: 'ぷゆ', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: 'ぷゆぷゆエネルギーを収束して放つ。10%で混乱。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'confuse' }
    ]
  },
  'ぷゆぷゆキャノン': {
    name: 'ぷゆぷゆキャノン', type: 'ぷゆ', category: 'special',
    power: 120, accuracy: 90, pp: 5,
    desc: '全力のぷゆ砲。使用後とくこうが2段階下がる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: -2 }
    ]
  },
  'ぷゆぷゆスマッシュ': {
    name: 'ぷゆぷゆスマッシュ', type: 'ぷゆ', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: 'ぷゆパワーで叩く。50%でぼうぎょ1段階DOWN。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },
  'ぷゆぷゆシールド': {
    name: 'ぷゆぷゆシールド', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: 'ぷゆオーラの盾。ぼうぎょ・とくぼう1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 1 }
    ]
  },
  'ぷゆぷゆアロー': {
    name: 'ぷゆぷゆアロー', type: 'ぷゆ', category: 'special',
    power: 40, accuracy: 100, pp: 30, priority: 1,
    desc: '先制で放つぷゆの矢。優先度+1。',
    effect: []
  },
  'えがおアタック': {
    name: 'えがおアタック', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: '笑顔で相手のこうげき・とくこうを1段階下げる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 },
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },
  'よみがえりのひかり': {
    name: 'よみがえりのひかり', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: 'HP50%回復し状態異常も治す。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 50 },
      { trigger: 'use', chance: 100, target: 'self', action: 'cureStatus' }
    ]
  },
  'ぷゆぷゆのあらし': {
    name: 'ぷゆぷゆのあらし', type: 'ぷゆ', category: 'special',
    power: 110, accuracy: 70, pp: 5,
    desc: 'ぷゆエネルギーの嵐。高火力だが命中不安。',
    effect: []
  },
  'ぷゆぷゆダンス': {
    name: 'ぷゆぷゆダンス', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '全能力を1段階上げる踊り。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'ぷゆゆキック': {
    name: 'ぷゆゆキック', type: 'ぷゆ', category: 'physical',
    power: 75, accuracy: 100, pp: 20, contact: true,
    desc: 'ぷゆゆ流の蹴り。急所に当たりやすい。',
    critRateBonus: 1,
    effect: []
  },
  'ぷゆコメット': {
    name: 'ぷゆコメット', type: 'ぷゆ', category: 'special',
    power: 25, accuracy: 90, pp: 15,
    desc: 'ぷゆの星くずを2〜5回飛ばす。',
    multiHit: [2, 5],
    effect: []
  },
  'ぷゆゆドレイン': {
    name: 'ぷゆゆドレイン', type: 'ぷゆ', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: 'ぷゆオーラを吸い取る。与えたダメージの50%HP回復。',
    drain: 50,
    effect: []
  },
  'ぷゆフレア': {
    name: 'ぷゆフレア', type: 'ぷゆ', category: 'special',
    power: 65, accuracy: 100, pp: 15,
    desc: 'ぷゆの炎で包む。20%でやけど。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'ぷゆバリア': {
    name: 'ぷゆバリア', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '5ターンの間とくしゅダメージを半減する壁を張る。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setField', field: 'lightScreen', value: 5 }
    ]
  },
  'ぷゆリフレクト': {
    name: 'ぷゆリフレクト', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '5ターンの間ぶつりダメージを半減する壁を張る。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setField', field: 'reflect', value: 5 }
    ]
  },
  'ぷゆウェーブ': {
    name: 'ぷゆウェーブ', type: 'ぷゆ', category: 'special',
    power: 0, accuracy: 100, pp: 15,
    desc: 'ぷゆの波動。HPが少ないほど威力UP（最大200）。',
    hpScaling: 'reversal',
    effect: []
  },
  'ぷゆブレイド': {
    name: 'ぷゆブレイド', type: 'ぷゆ', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true,
    desc: 'ぷゆオーラの刃で斬る。急所に当たりやすい。',
    critRateBonus: 1,
    effect: []
  },
  'ぷゆオーバードライブ': {
    name: 'ぷゆオーバードライブ', type: 'ぷゆ', category: 'special',
    power: 140, accuracy: 85, pp: 5,
    desc: '限界突破のぷゆ砲。使うと全能力1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: -1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: -1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: -1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: -1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'ぷゆムーンライト': {
    name: 'ぷゆムーンライト', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '月の光を浴びてHP回復。晴れなら2/3回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'moonlight' }
    ]
  },
  'ぷゆぷゆのあまえ': {
    name: 'ぷゆぷゆのあまえ', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: 'あまえて相手のこうげきを2段階下げる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'atk', stage: -2 }
    ]
  },
  'ぷゆニードル': {
    name: 'ぷゆニードル', type: 'ぷゆ', category: 'physical',
    power: 25, accuracy: 100, pp: 25,
    desc: 'ぷゆの針を2〜5回刺す。',
    multiHit: [2, 5],
    effect: []
  },
  'ぷゆトルネード': {
    name: 'ぷゆトルネード', type: 'ぷゆ', category: 'special',
    power: 85, accuracy: 95, pp: 10,
    desc: 'ぷゆの竜巻。相手のみがわりを破壊する。',
    pierceSub: true,
    effect: []
  },
  'ぷゆぷゆのいのり': {
    name: 'ぷゆぷゆのいのり', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '祈りの力でHP2/3回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 66 }
    ]
  },
  'ぷゆスパーク': {
    name: 'ぷゆスパーク', type: 'ぷゆ', category: 'special',
    power: 55, accuracy: 100, pp: 20,
    desc: 'ぷゆの火花。10%でまひ。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'par' }
    ]
  },
  'ぷゆチャージ': {
    name: 'ぷゆチャージ', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: 'ぷゆのエネルギーをためる。次のぷゆ技の威力2倍。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'setFlag', flag: 'puyuCharge', value: true }
    ]
  },
  'えへへのわらい': {
    name: 'えへへのわらい', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: '笑わせて同じ技しか出せなくする（3ターン）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'encore', value: 3 }
    ]
  },
  'くすくすわらい': {
    name: 'くすくすわらい', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 85, pp: 20,
    desc: 'くすくす笑って相手を100%混乱させる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'confuse' }
    ]
  },
  'およよのさけび': {
    name: 'およよのさけび', type: 'ぷゆ', category: 'special',
    power: 50, accuracy: 100, pp: 25, sound: true,
    desc: '驚きの叫び。20%でひるむ。音技。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'flinch' }
    ]
  },
  'てりりのいかり': {
    name: 'てりりのいかり', type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: '怒りの力で攻撃。',
    effect: []
  },
  'おんたこのいかり': {
    name: 'おんたこのいかり', type: 'ぷゆ', category: 'special',
    power: 100, accuracy: 90, pp: 10,
    desc: '怒り狂って攻撃。使うたびこうげき・とくこう1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 }
    ]
  },
  'マルクのたいほう': {
    name: 'マルクのたいほう', type: 'ぷゆ', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: 'ぷゆ大砲。30%で混乱。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'confuse' }
    ]
  },
  'ゴシゴシあらう': {
    name: 'ゴシゴシあらう', type: 'ぷゆ', category: 'physical',
    power: 65, accuracy: 100, pp: 20, contact: true,
    desc: 'ゴシゴシ洗い落とす。100%で相手の能力変化をリセット。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'clearStatChanges' }
    ]
  },
  'おちていくさだめ': {
    name: 'おちていくさだめ', type: 'ぷゆ', category: 'physical',
    power: 80, accuracy: 90, pp: 15,
    desc: '落ち続ける。使うたびに威力+10（最大200）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'growingPower', value: 10, max: 200 }
    ]
  },
  'げきおこメテオ': {
    name: 'げきおこメテオ', type: 'ぷゆ', category: 'special',
    power: 120, accuracy: 85, pp: 5,
    desc: '激怒の隕石。30%でひるみ。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'flinch' }
    ]
  },
  'ゼロポイントバースト': {
    name: 'ゼロポイントバースト', type: 'ぷゆ', category: 'special',
    power: 150, accuracy: 90, pp: 5,
    desc: '全てをゼロにする爆発。自分の最大HP1/2の反動。',
    recoil: 2,
    effect: []
  },
  'ゼロカノン': {
    name: 'ゼロカノン', type: 'ぷゆ', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: 'ゼロに帰す砲撃。100%で相手の能力変化リセット+ダメージ。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'clearStatChanges' }
    ]
  },
  'ヨーヨーアタック': {
    name: 'ヨーヨーアタック', type: 'ぷゆ', category: 'physical',
    power: 65, accuracy: 100, pp: 20,
    desc: 'ヨーヨーで2回攻撃。',
    fixedHits: 2,
    effect: []
  },
  'タイヤスピン': {
    name: 'タイヤスピン', type: 'ぷゆ', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '高速回転で攻撃。100%で使用者すばやさ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'ちいさなきずぐち': {
    name: 'ちいさなきずぐち', type: 'ぷゆ', category: 'physical',
    power: 40, accuracy: 100, pp: 35, priority: 2,
    desc: '小さな傷。優先度+2。',
    effect: []
  },
  'スケルトンアタック': {
    name: 'スケルトンアタック', type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 100, pp: 20,
    desc: '骨格で攻撃。みがわり貫通。',
    pierceSub: true,
    effect: []
  },
  'いんようのかい': {
    name: 'いんようのかい', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '陰陽の調和。こうげき・とくこう・ぼうぎょ・とくぼう1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 1 }
    ]
  },
  'パンケーキプレス': {
    name: 'パンケーキプレス', type: 'ぷゆ', category: 'physical',
    power: 90, accuracy: 95, pp: 10, contact: true,
    desc: '重さで押しつぶす。30%ですばやさDOWN。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'ミイラまき': {
    name: 'ミイラまき', type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 95, pp: 15, contact: true,
    desc: '包帯で巻きつける。50%ですばやさDOWN。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'ぷゆへんしん': {
    name: 'ぷゆへんしん', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'ぷゆ+あくタイプに変身しこうげき2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'typeChange', types: ['ぷゆ', 'あく'] },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 2 }
    ]
  },
  'すやすやレスト': {
    name: 'すやすやレスト', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '深く眠りHP全回復+全能力1段階UP。3ターン眠る。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'inflictStatus', status: 'slp', turns: 3 },
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 100 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'ムジュラのうた': {
    name: 'ムジュラのうた', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 85, pp: 5, sound: true,
    desc: '滅びの歌。3ターン後に相手は確定ひんし。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'countdown', value: 3 }
    ]
  },
  'おでビーム': {
    name: 'おでビーム', type: 'ぷゆ', category: 'special',
    power: 110, accuracy: 95, pp: 10,
    desc: '地上最強のビーム。壁を貫通する。',
    pierceResistance: true,
    effect: [
      { trigger: 'hit', chance: 100, target: 'field', action: 'breakScreens' }
    ]
  },
  'エグザイルの花道': {
    name: 'エグザイルの花道', type: 'ぷゆ', category: 'special',
    power: 85, accuracy: 95, pp: 10,
    desc: '移民の誇り。100%で相手のぼうぎょ・とくぼう1段階DOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 },
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'しんかのちから': {
    name: 'しんかのちから', type: 'ぷゆ', category: 'special',
    power: 60, accuracy: 100, pp: 20,
    desc: '進化のエネルギー。急所率UP。',
    critRateBonus: 1,
    effect: []
  },

  // =============================================================
  //  ノーマルタイプ
  // =============================================================
  'たいあたり': {
    name: 'たいあたり', type: 'ノーマル', category: 'physical',
    power: 35, accuracy: 95, pp: 35, contact: true,
    desc: 'からだをぶつける基本技。',
    effect: []
  },
  'ひっかきまわす': {
    name: 'ひっかきまわす', type: 'ノーマル', category: 'physical',
    power: 40, accuracy: 100, pp: 35, contact: true,
    desc: '爪で引っかく。',
    effect: []
  },
  'とっしんアタック': {
    name: 'とっしんアタック', type: 'ノーマル', category: 'physical',
    power: 90, accuracy: 85, pp: 20, contact: true,
    desc: '全力で突進。最大HPの1/4反動ダメージ。',
    recoil: 4,
    effect: []
  },
  'にらみつけ': {
    name: 'にらみつけ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 30,
    desc: '鋭い目つきで100%ぼうぎょ1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },
  'イノチノカガヤキ': {
    name: 'イノチノカガヤキ', type: 'ノーマル', category: 'special',
    power: 150, accuracy: 90, pp: 5,
    desc: '命の輝きを放つ究極光線。次ターン動けない。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'recharge' }
    ]
  },
  'フルスイング': {
    name: 'フルスイング', type: 'ノーマル', category: 'physical',
    power: 150, accuracy: 90, pp: 5, contact: true,
    desc: '渾身の一撃。次ターン動けない。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'recharge' }
    ]
  },
  'おんがえしパンチ': {
    name: 'おんがえしパンチ', type: 'ノーマル', category: 'physical',
    power: 102, accuracy: 100, pp: 15, contact: true, punch: true,
    desc: '感謝の拳。なつき度で威力変動。',
    effect: []
  },
  'みがわりにんぎょう': {
    name: 'みがわりにんぎょう', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'HP25%消費して身代わりを出す。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'substitute' }
    ]
  },
  'かそく': {
    name: 'かそく', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 30,
    desc: '100%ですばやさ2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 2 }
    ]
  },
  'ぼうぎょきょうか': {
    name: 'ぼうぎょきょうか', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '100%でぼうぎょ2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 2 }
    ]
  },
  'なきわめく': {
    name: 'なきわめく', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 40, sound: true,
    desc: '泣きわめいて100%こうげき1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 }
    ]
  },
  'ねむりにつく': {
    name: 'ねむりにつく', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '眠りHP全回復。2ターン眠る。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'inflictStatus', status: 'slp', turns: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 100 }
    ]
  },
  'のしかかりプレス': {
    name: 'のしかかりプレス', type: 'ノーマル', category: 'physical',
    power: 85, accuracy: 100, pp: 15, contact: true,
    desc: 'のしかかる。30%まひ。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'par' }
    ]
  },
  'すてみダイブ': {
    name: 'すてみダイブ', type: 'ノーマル', category: 'physical',
    power: 120, accuracy: 100, pp: 15, contact: true,
    desc: '捨て身のダイブ。与ダメージの1/3反動。',
    recoilDamage: 3,
    effect: []
  },
  'とくぼうきょうか': {
    name: 'とくぼうきょうか', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '100%でとくぼう2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 2 }
    ]
  },
  'さけびごえ': {
    name: 'さけびごえ', type: 'ノーマル', category: 'special',
    power: 90, accuracy: 100, pp: 10, sound: true,
    desc: '大声で攻撃。みがわり貫通。音技。',
    pierceSub: true,
    effect: []
  },
  'みちづれアタック': {
    name: 'みちづれアタック', type: 'ノーマル', category: 'physical',
    power: 0, accuracy: 90, pp: 5,
    desc: '自分のHP全消費で同じダメージを相手に。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'destiny' }
    ]
  },
  'コピーフォルム': {
    name: 'コピーフォルム', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '相手の姿に変身する。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'transform' }
    ]
  },
  'チーギュウアタック': {
    name: 'チーギュウアタック', type: 'ノーマル', category: 'physical',
    power: 60, accuracy: 90, pp: 20, contact: true,
    desc: 'チー牛の生き様をぶつける。',
    effect: []
  },
  'ジョンソンぎり': {
    name: 'ジョンソンぎり', type: 'ノーマル', category: 'physical',
    power: 80, accuracy: 90, pp: 15, contact: true,
    desc: 'ジョンソン流の切り技。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'こうげきといで': {
    name: 'こうげきといで', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '100%でこうげきと命中率を1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'acc', stage: 1 }
    ]
  },
  'ふんきアップ': {
    name: 'ふんきアップ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 30,
    desc: '100%でこうげきととくこうを1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 }
    ]
  },
  'きりつける': {
    name: 'きりつける', type: 'ノーマル', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: '鋭く切りつける。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'メガトンシュート': {
    name: 'メガトンシュート', type: 'ノーマル', category: 'physical',
    power: 120, accuracy: 75, pp: 5, contact: true,
    desc: '強烈な蹴り。命中が低い。',
    effect: []
  },
  'ほしのかけら': {
    name: 'ほしのかけら', type: 'ノーマル', category: 'special',
    power: 60, accuracy: 0, pp: 20,
    desc: '星のかけらを放つ必中技。',
    effect: []
  },
  'からげんきパンチ': {
    name: 'からげんきパンチ', type: 'ノーマル', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true, punch: true,
    desc: '状態異常のとき威力2倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'doubleWhenStatus' }
    ]
  },
  'じたばたもがき': {
    name: 'じたばたもがき', type: 'ノーマル', category: 'physical',
    power: 0, accuracy: 100, pp: 15, contact: true,
    desc: 'HPが少ないほど威力UP（最大200）。',
    hpScaling: 'reversal',
    effect: []
  },
  'しんそくラッシュ': {
    name: 'しんそくラッシュ', type: 'ノーマル', category: 'physical',
    power: 80, accuracy: 100, pp: 5, priority: 2, contact: true,
    desc: '神速の一撃。優先度+2。',
    effect: []
  },
  'せんこうだん': {
    name: 'せんこうだん', type: 'ノーマル', category: 'physical',
    power: 40, accuracy: 100, pp: 30, priority: 1, contact: true,
    desc: '閃光の突進。必ず先制。',
    effect: []
  },
  'だいばくはつ': {
    name: 'だいばくはつ', type: 'ノーマル', category: 'physical',
    power: 250, accuracy: 100, pp: 5,
    desc: '大爆発。使用後自分はひんし。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'selfDestruct' }
    ]
  },
  'はらだいこ': {
    name: 'はらだいこ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'HP半分消費してこうげきを最大（+6）まで上げる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'bellyDrum' }
    ]
  },
  'ぜったいぼうぎょ': {
    name: 'ぜったいぼうぎょ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10, priority: 4,
    desc: 'そのターン攻撃を完全に防ぐ。連続で失敗しやすい。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'protect' }
    ]
  },
  'こんじょうがまん': {
    name: 'こんじょうがまん', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10, priority: 4,
    desc: 'そのターンの攻撃をHP1で耐える。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'endure' }
    ]
  },
  'ものまねコピー': {
    name: 'ものまねコピー', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '100%で相手の能力変化をそのままコピーする。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'copyStatChanges' }
    ]
  },
  'のうりょくリセット': {
    name: 'のうりょくリセット', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '100%で自分と相手の全能力変化をリセットする。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'clearStatChanges' },
      { trigger: 'use', chance: 100, target: 'enemy', action: 'clearStatChanges' }
    ]
  },
  'ギャンブルパンチ': {
    name: 'ギャンブルパンチ', type: 'ノーマル', category: 'physical',
    power: 1, accuracy: 100, pp: 10, contact: true, punch: true,
    desc: '威力が40〜200のランダム。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'randomPower', min: 40, max: 200 }
    ]
  },
  'にどうちアタック': {
    name: 'にどうちアタック', type: 'ノーマル', category: 'physical',
    power: 35, accuracy: 90, pp: 15, contact: true,
    desc: '2回連続で攻撃する。',
    fixedHits: 2,
    effect: []
  },
  'トリプルアタック': {
    name: 'トリプルアタック', type: 'ノーマル', category: 'physical',
    power: 20, accuracy: 100, pp: 10,
    desc: '3回攻撃。各10%でまひ・やけど・こおり。',
    fixedHits: 3,
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'par' },
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'brn' },
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'frz' }
    ]
  },
  'ふきとばしウインド': {
    name: 'ふきとばしウインド', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 20, priority: -6,
    desc: '100%で相手を強制交代させる。優先度-6。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'forceSwitch' }
    ]
  },
  'いかくボイス': {
    name: 'いかくボイス', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 30, sound: true,
    desc: '威嚇の声で100%とくこう1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },

  // =============================================================
  //  ほのおタイプ
  // =============================================================
  'ちいさなひ': {
    name: 'ちいさなひ', type: 'ほのお', category: 'special',
    power: 40, accuracy: 100, pp: 25,
    desc: '小さな火。10%やけど。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'えんねつほうしゃ': {
    name: 'えんねつほうしゃ', type: 'ほのお', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: '炎を放射。10%やけど。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'ごうかえんじん': {
    name: 'ごうかえんじん', type: 'ほのお', category: 'special',
    power: 110, accuracy: 85, pp: 5,
    desc: '轟炎の大文字。10%やけど。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'ほのおのまきつき': {
    name: 'ほのおのまきつき', type: 'ほのお', category: 'special',
    power: 35, accuracy: 85, pp: 15,
    desc: '炎で縛る。2〜5ターン束縛。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'trap', min: 2, max: 5 }
    ]
  },
  'ひざしをよぶ': {
    name: 'ひざしをよぶ', type: 'ほのお', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '天気を晴れにする（5ターン）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setWeather', weather: 'sunny', turns: 5 }
    ]
  },
  'しゃくねつドライブ': {
    name: 'しゃくねつドライブ', type: 'ほのお', category: 'physical',
    power: 120, accuracy: 100, pp: 15, contact: true,
    desc: '炎突進。与ダメ1/3反動。10%やけど。',
    recoilDamage: 3,
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'ばくねつフルバースト': {
    name: 'ばくねつフルバースト', type: 'ほのお', category: 'special',
    power: 130, accuracy: 90, pp: 5,
    desc: '全力炎。使用後とくこう2段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: -2 }
    ]
  },
  'ホッティバーン': {
    name: 'ホッティバーン', type: 'ほのお', category: 'special',
    power: 85, accuracy: 100, pp: 10,
    desc: '灼熱の炎。100%やけど。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'えんねつパンチ': {
    name: 'えんねつパンチ', type: 'ほのお', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true, punch: true,
    desc: '炎のパンチ。10%やけど。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'ごうえんキック': {
    name: 'ごうえんキック', type: 'ほのお', category: 'physical',
    power: 85, accuracy: 90, pp: 10, contact: true,
    desc: '炎の蹴り。急所率UP。10%やけど。',
    critRateBonus: 1,
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'マグマストリーム': {
    name: 'マグマストリーム', type: 'ほのお', category: 'special',
    power: 100, accuracy: 75, pp: 5,
    desc: '溶岩流で包む。4〜5ターン束縛。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'trap', min: 4, max: 5 }
    ]
  },
  'ふんかバースト': {
    name: 'ふんかバースト', type: 'ほのお', category: 'special',
    power: 150, accuracy: 100, pp: 5,
    desc: '自分のHPが多いほど威力が高い。',
    hpScaling: 'maxHpPower',
    effect: []
  },
  'えんごくのほのお': {
    name: 'えんごくのほのお', type: 'ほのお', category: 'special',
    power: 100, accuracy: 50, pp: 5,
    desc: '地獄の炎。100%やけどだが命中極低。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'おにびだま': {
    name: 'おにびだま', type: 'ほのお', category: 'status',
    power: 0, accuracy: 85, pp: 15,
    desc: '不気味な火で100%やけどにする。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'えんねつのまい': {
    name: 'えんねつのまい', type: 'ほのお', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '炎の舞。50%でとくこう1段階UP。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'self', action: 'statChange', stat: 'spa', stage: 1 }
    ]
  },
  'ねっぷうかぜ': {
    name: 'ねっぷうかぜ', type: 'ほのお', category: 'special',
    power: 95, accuracy: 90, pp: 10,
    desc: '熱風。10%やけど。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'しゃくねつボール': {
    name: 'しゃくねつボール', type: 'ほのお', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: '灼熱の火球。30%やけど。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'かえんぐるま': {
    name: 'かえんぐるま', type: 'ほのお', category: 'physical',
    power: 60, accuracy: 100, pp: 25, contact: true,
    desc: '炎の車輪で突撃。10%やけど。こおり状態でも使用可。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'brn' },
      { trigger: 'always', chance: 100, target: 'self', action: 'thawSelf' }
    ]
  },
  'もえつきバーン': {
    name: 'もえつきバーン', type: 'ほのお', category: 'special',
    power: 130, accuracy: 100, pp: 5,
    desc: '全力で燃え尽きる。使用後ほのおタイプを失う。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'loseType', loseType: 'ほのお' }
    ]
  },
  'えんねつれんだ': {
    name: 'えんねつれんだ', type: 'ほのお', category: 'physical',
    power: 25, accuracy: 100, pp: 15, contact: true,
    desc: '炎の連続パンチ。必ず3回当たる。',
    fixedHits: 3,
    effect: []
  },
  'フレイムチャージ': {
    name: 'フレイムチャージ', type: 'ほのお', category: 'physical',
    power: 50, accuracy: 100, pp: 20, contact: true,
    desc: '炎をまとって突撃。100%すばやさ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'にどひばしら': {
    name: 'にどひばしら', type: 'ほのお', category: 'special',
    power: 30, accuracy: 100, pp: 30,
    desc: '火柱を2回上げる。',
    fixedHits: 2,
    effect: []
  },

  // =============================================================
  //  みずタイプ
  // =============================================================
  'みずでっぽう': {
    name: 'みずでっぽう', type: 'みず', category: 'special',
    power: 40, accuracy: 100, pp: 25,
    desc: '水鉄砲を発射。',
    effect: []
  },
  'おおなみ': {
    name: 'おおなみ', type: 'みず', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: '大波でダメージ。',
    effect: []
  },
  'ばくりゅうほう': {
    name: 'ばくりゅうほう', type: 'みず', category: 'special',
    power: 110, accuracy: 80, pp: 5,
    desc: '爆流砲。高威力だが命中不安。',
    effect: []
  },
  'アクアダッシュ': {
    name: 'アクアダッシュ', type: 'みず', category: 'physical',
    power: 40, accuracy: 100, pp: 20, priority: 1, contact: true,
    desc: '水をまとって先制。優先度+1。',
    effect: []
  },
  'あめをよぶ': {
    name: 'あめをよぶ', type: 'みず', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '天気を雨にする（5ターン）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setWeather', weather: 'rain', turns: 5 }
    ]
  },
  'びえんのなみだ': {
    name: 'びえんのなみだ', type: 'みず', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '大粒の涙。100%でとくこう1段階DOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },
  'たきのぼりアタック': {
    name: 'たきのぼりアタック', type: 'みず', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '滝を登る勢いで攻撃。20%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'flinch' }
    ]
  },
  'みずのしっぽ': {
    name: 'みずのしっぽ', type: 'みず', category: 'physical',
    power: 90, accuracy: 90, pp: 10, contact: true,
    desc: '水をまとった尻尾で殴る。',
    effect: []
  },
  'すいあつクラッシュ': {
    name: 'すいあつクラッシュ', type: 'みず', category: 'physical',
    power: 85, accuracy: 100, pp: 10, contact: true,
    desc: '水圧で砕く。20%ぼうぎょDOWN。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },
  'しおふきスプラッシュ': {
    name: 'しおふきスプラッシュ', type: 'みず', category: 'special',
    power: 150, accuracy: 100, pp: 5,
    desc: 'HP割合で威力変動。最大150。',
    hpScaling: 'maxHpPower',
    effect: []
  },
  'ねっとうシャワー': {
    name: 'ねっとうシャワー', type: 'みず', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '熱い湯で攻撃。30%やけど。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'からをやぶるダンス': {
    name: 'からをやぶるダンス', type: 'みず', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '殻を破る。こうげき・とくこう・すばやさ2段階UP、ぼうぎょ・とくぼう1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: -1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'みずのはもん': {
    name: 'みずのはもん', type: 'みず', category: 'special',
    power: 60, accuracy: 100, pp: 20,
    desc: '水の波紋。20%混乱。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'confuse' }
    ]
  },
  'うずまきトラップ': {
    name: 'うずまきトラップ', type: 'みず', category: 'special',
    power: 35, accuracy: 85, pp: 15,
    desc: '渦に閉じ込める。2〜5ターン束縛。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'trap', min: 2, max: 5 }
    ]
  },
  'せんすいアタック': {
    name: 'せんすいアタック', type: 'みず', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '水中に潜って次ターン攻撃。',
    twoTurn: true,
    effect: []
  },
  'インクショット': {
    name: 'インクショット', type: 'みず', category: 'special',
    power: 65, accuracy: 85, pp: 10,
    desc: '墨を撃つ。50%命中率DOWN。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'statChange', stat: 'acc', stage: -1 }
    ]
  },
  'ハサミハンマー': {
    name: 'ハサミハンマー', type: 'みず', category: 'physical',
    power: 100, accuracy: 90, pp: 10, contact: true,
    desc: '巨大ハサミで叩く。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'みずしゅりけん': {
    name: 'みずしゅりけん', type: 'みず', category: 'special',
    power: 15, accuracy: 100, pp: 20, priority: 1,
    desc: '水の手裏剣。2〜5回先制攻撃。',
    multiHit: [2, 5],
    effect: []
  },
  'じょうきバースト': {
    name: 'じょうきバースト', type: 'みず', category: 'special',
    power: 110, accuracy: 95, pp: 5,
    desc: '高温蒸気。30%やけど。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'アクアドレイン': {
    name: 'アクアドレイン', type: 'みず', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '水分を吸い取る。与ダメージの50%HP回復。',
    drain: 50,
    effect: []
  },
  'こおるしずく': {
    name: 'こおるしずく', type: 'みず', category: 'special',
    power: 55, accuracy: 100, pp: 20,
    desc: '冷たい雫。10%こおり。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'frz' }
    ]
  },
  'トレントウェーブ': {
    name: 'トレントウェーブ', type: 'みず', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '激流の波。HP1/3以下で威力1.5倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'pinchBoost', threshold: 0.333, mult: 1.5 }
    ]
  },

  // =============================================================
  //  くさタイプ
  // =============================================================
  'はっぱブレード': {
    name: 'はっぱブレード', type: 'くさ', category: 'physical',
    power: 55, accuracy: 95, pp: 25,
    desc: '鋭い葉の刃。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'たいようこうせん': {
    name: 'たいようこうせん', type: 'くさ', category: 'special',
    power: 120, accuracy: 100, pp: 10,
    desc: '太陽光を集めて放つ。晴れなら溜め不要。',
    twoTurn: true,
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'sunSkipCharge' }
    ]
  },
  'しょくぶつエナジー': {
    name: 'しょくぶつエナジー', type: 'くさ', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '植物の気。10%とくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'きせいのたね': {
    name: 'きせいのたね', type: 'くさ', category: 'status',
    power: 0, accuracy: 90, pp: 10,
    desc: '寄生の種を植え毎ターンHPを吸収。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'leechSeed' }
    ]
  },
  'にんじゃのもみじ': {
    name: 'にんじゃのもみじ', type: 'くさ', category: 'special',
    power: 70, accuracy: 100, pp: 20,
    desc: '忍法紅葉隠れ。100%命中率1段階DOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'acc', stage: -1 }
    ]
  },
  'つるのブレード': {
    name: 'つるのブレード', type: 'くさ', category: 'physical',
    power: 90, accuracy: 100, pp: 15, contact: true,
    desc: 'ツルの刀で斬る。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'タネマシンガン': {
    name: 'タネマシンガン', type: 'くさ', category: 'physical',
    power: 25, accuracy: 100, pp: 30,
    desc: '種を2〜5発連射。',
    multiHit: [2, 5],
    effect: []
  },
  'ドレインリーフ': {
    name: 'ドレインリーフ', type: 'くさ', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '養分を吸い取る。与ダメの50%回復。',
    drain: 50,
    effect: []
  },
  'こうごうせいのひかり': {
    name: 'こうごうせいのひかり', type: 'くさ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '光合成でHP回復。晴れなら2/3回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'moonlight' }
    ]
  },
  'つるのムチ': {
    name: 'つるのムチ', type: 'くさ', category: 'physical',
    power: 120, accuracy: 85, pp: 10, contact: true,
    desc: '力任せにツルで叩く。',
    effect: []
  },
  'リーフストーム': {
    name: 'リーフストーム', type: 'くさ', category: 'special',
    power: 130, accuracy: 90, pp: 5,
    desc: '葉の嵐。使用後とくこう2段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: -2 }
    ]
  },
  'ほうしのねむり': {
    name: 'ほうしのねむり', type: 'くさ', category: 'status',
    power: 0, accuracy: 100, pp: 15,
    desc: '胞子で100%確実に眠らせる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'slp' }
    ]
  },
  'ねむりのこな': {
    name: 'ねむりのこな', type: 'くさ', category: 'status',
    power: 0, accuracy: 75, pp: 15,
    desc: '粉で100%眠らせる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'slp' }
    ]
  },
  'しびれのこな': {
    name: 'しびれのこな', type: 'くさ', category: 'status',
    power: 0, accuracy: 75, pp: 30,
    desc: '粉で100%まひにする。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'par' }
    ]
  },
  'ウッドクラッシュ': {
    name: 'ウッドクラッシュ', type: 'くさ', category: 'physical',
    power: 120, accuracy: 100, pp: 15, contact: true,
    desc: '丸太で殴る。与ダメ1/3反動。',
    recoilDamage: 3,
    effect: []
  },
  'タネばくだん': {
    name: 'タネばくだん', type: 'くさ', category: 'physical',
    power: 80, accuracy: 100, pp: 15,
    desc: '硬い種を投げつける。',
    effect: []
  },
  'くさのフィールド': {
    name: 'くさのフィールド', type: 'くさ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '5ターン草のフィールド。くさ技1.3倍・毎ターンHP1/16回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setTerrain', terrain: 'grass', turns: 5 }
    ]
  },
  'フローラルアロマ': {
    name: 'フローラルアロマ', type: 'くさ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '花の香りでHP25%回復し状態異常も治す。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 25 },
      { trigger: 'use', chance: 100, target: 'self', action: 'cureStatus' }
    ]
  },

  // =============================================================
  //  でんきタイプ
  // =============================================================
  'スパークショック': {
    name: 'スパークショック', type: 'でんき', category: 'special',
    power: 40, accuracy: 100, pp: 30,
    desc: '電気を浴びせる。10%まひ。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'par' }
    ]
  },
  'イナズマフォール': {
    name: 'イナズマフォール', type: 'でんき', category: 'special',
    power: 110, accuracy: 70, pp: 10,
    desc: '落雷。30%まひ。雨で必中。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'par' }
    ]
  },
  'ライトニングボルト': {
    name: 'ライトニングボルト', type: 'でんき', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: '高圧電流。10%まひ。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'par' }
    ]
  },
  'でんじフィールド': {
    name: 'でんじフィールド', type: 'でんき', category: 'status',
    power: 0, accuracy: 90, pp: 20,
    desc: '電磁波で100%まひにする。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'par' }
    ]
  },
  'かみなりパンチ': {
    name: 'かみなりパンチ', type: 'でんき', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true, punch: true,
    desc: '帯電パンチ。10%まひ。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'par' }
    ]
  },
  'ワイルドスパーク': {
    name: 'ワイルドスパーク', type: 'でんき', category: 'physical',
    power: 90, accuracy: 100, pp: 15, contact: true,
    desc: '電撃突進。最大HPの1/4反動。',
    recoil: 4,
    effect: []
  },
  'ボルトスイッチ': {
    name: 'ボルトスイッチ', type: 'でんき', category: 'special',
    power: 70, accuracy: 100, pp: 20,
    desc: '攻撃後ひかえに交代。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'self', action: 'switchAfter' }
    ]
  },
  'エレキネット': {
    name: 'エレキネット', type: 'でんき', category: 'special',
    power: 55, accuracy: 95, pp: 15,
    desc: '電気の網。100%すばやさ1段階DOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'ほうでんバースト': {
    name: 'ほうでんバースト', type: 'でんき', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '電気放出。30%まひ。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'par' }
    ]
  },
  'でんげきは': {
    name: 'でんげきは', type: 'でんき', category: 'special',
    power: 60, accuracy: 0, pp: 20,
    desc: '電撃波。必中技。',
    effect: []
  },
  'らいめいキック': {
    name: 'らいめいキック', type: 'でんき', category: 'physical',
    power: 90, accuracy: 95, pp: 10, contact: true,
    desc: '雷を纏った蹴り。100%ぼうぎょDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },
  'プラズマフィスト': {
    name: 'プラズマフィスト', type: 'でんき', category: 'physical',
    power: 100, accuracy: 100, pp: 15, contact: true, punch: true,
    desc: 'プラズマの拳。',
    effect: []
  },
  'エレキチャージ': {
    name: 'エレキチャージ', type: 'でんき', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '電気をためる。100%とくぼう1段階UP。次のでんき技威力2倍。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'setFlag', flag: 'electricCharge', value: true }
    ]
  },
  'パラボラチャージ': {
    name: 'パラボラチャージ', type: 'でんき', category: 'special',
    power: 65, accuracy: 100, pp: 20,
    desc: '電気で攻撃し与ダメの50%回復。',
    drain: 50,
    effect: []
  },
  'エレキフィールド': {
    name: 'エレキフィールド', type: 'でんき', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '5ターン電気のフィールド。でんき技1.3倍・ねむり無効。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setTerrain', terrain: 'electric', turns: 5 }
    ]
  },
  'かいでんぱ': {
    name: 'かいでんぱ', type: 'でんき', category: 'status',
    power: 0, accuracy: 100, pp: 15,
    desc: '電磁波で100%相手のとくこう2段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'spa', stage: -2 }
    ]
  },
  'ちょうでんじほう': {
    name: 'ちょうでんじほう', type: 'でんき', category: 'special',
    power: 120, accuracy: 50, pp: 5,
    desc: '超電磁砲。100%まひだが命中極低。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'par' }
    ]
  },
  'スパークニードル': {
    name: 'スパークニードル', type: 'でんき', category: 'physical',
    power: 20, accuracy: 100, pp: 20,
    desc: '電気の針を2〜5回刺す。',
    multiHit: [2, 5],
    effect: []
  },

  // =============================================================
  //  こおりタイプ
  // =============================================================
  'こなゆきショット': {
    name: 'こなゆきショット', type: 'こおり', category: 'special',
    power: 40, accuracy: 100, pp: 25,
    desc: '粉雪を浴びせる。10%こおり。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'frz' }
    ]
  },
  'れいとうビーム': {
    name: 'れいとうビーム', type: 'こおり', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '冷凍光線。10%こおり。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'frz' }
    ]
  },
  'ブリザードストーム': {
    name: 'ブリザードストーム', type: 'こおり', category: 'special',
    power: 110, accuracy: 70, pp: 5,
    desc: '猛吹雪。30%こおり。あられで必中。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'frz' }
    ]
  },
  'こおりのつぶて': {
    name: 'こおりのつぶて', type: 'こおり', category: 'physical',
    power: 40, accuracy: 100, pp: 30, priority: 1,
    desc: '氷の塊を先制で投げる。',
    effect: []
  },
  'カチコチフリーズ': {
    name: 'カチコチフリーズ', type: 'こおり', category: 'physical',
    power: 85, accuracy: 95, pp: 10, contact: true,
    desc: '凍った体で攻撃。50%こおり。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'inflictStatus', status: 'frz' }
    ]
  },
  'れいとうパンチ': {
    name: 'れいとうパンチ', type: 'こおり', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true, punch: true,
    desc: '凍てつく拳。10%こおり。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'frz' }
    ]
  },
  'つららおとし': {
    name: 'つららおとし', type: 'こおり', category: 'physical',
    power: 85, accuracy: 90, pp: 10,
    desc: '巨大な氷柱を落とす。30%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'flinch' }
    ]
  },
  'つららばり': {
    name: 'つららばり', type: 'こおり', category: 'physical',
    power: 25, accuracy: 100, pp: 30,
    desc: '氷の針を2〜5回飛ばす。',
    multiHit: [2, 5],
    effect: []
  },
  'フリーズドライ': {
    name: 'フリーズドライ', type: 'こおり', category: 'special',
    power: 70, accuracy: 100, pp: 20,
    desc: '急速冷凍。みずタイプにも抜群。10%こおり。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'frz' },
      { trigger: 'always', chance: 100, target: 'self', action: 'superEffectiveVsType', vsType: 'みず' }
    ]
  },
  'ぜったいれいど': {
    name: 'ぜったいれいど', type: 'こおり', category: 'special',
    power: 0, accuracy: 30, pp: 5,
    desc: '当たれば一撃ひんし。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'ohko' }
    ]
  },
  'あられをよぶ': {
    name: 'あられをよぶ', type: 'こおり', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '天気をあられにする（5ターン）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setWeather', weather: 'hail', turns: 5 }
    ]
  },
  'オーロラベール': {
    name: 'オーロラベール', type: 'こおり', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: 'あられ時のみ使用可。5ターン物理・特殊ダメージ半減。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'auroraVeil', turns: 5 }
    ]
  },
  'フロストブレス': {
    name: 'フロストブレス', type: 'こおり', category: 'special',
    power: 60, accuracy: 90, pp: 10,
    desc: '凍てつく息。確定急所。',
    alwaysCrit: true,
    effect: []
  },
  'こごえるかぜ': {
    name: 'こごえるかぜ', type: 'こおり', category: 'special',
    power: 55, accuracy: 95, pp: 15,
    desc: '冷たい風。100%すばやさDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'アイスハンマー': {
    name: 'アイスハンマー', type: 'こおり', category: 'physical',
    power: 100, accuracy: 90, pp: 10, contact: true, punch: true,
    desc: '氷の鉄槌。100%自分のすばやさ1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'こおりのいぶき': {
    name: 'こおりのいぶき', type: 'こおり', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '極寒の吐息。20%こおり。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'inflictStatus', status: 'frz' }
    ]
  },

  // =============================================================
  //  かくとうタイプ
  // =============================================================
  'かかとおとし': {
    name: 'かかとおとし', type: 'かくとう', category: 'physical',
    power: 65, accuracy: 100, pp: 25, contact: true,
    desc: 'かかとで踏みつける。',
    effect: []
  },
  'きしかいせいパンチ': {
    name: 'きしかいせいパンチ', type: 'かくとう', category: 'physical',
    power: 0, accuracy: 100, pp: 10, contact: true, punch: true,
    desc: 'HPが低いほど威力UP（最大200）。',
    hpScaling: 'reversal',
    effect: []
  },
  'クロスファイト': {
    name: 'クロスファイト', type: 'かくとう', category: 'physical',
    power: 100, accuracy: 80, pp: 5, contact: true,
    desc: '交差する拳。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'ラッシュコンボ': {
    name: 'ラッシュコンボ', type: 'かくとう', category: 'physical',
    power: 120, accuracy: 100, pp: 5, contact: true,
    desc: '激しい接近戦。100%で使用後ぼうぎょ・とくぼう1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: -1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'こんらんパンチ': {
    name: 'こんらんパンチ', type: 'かくとう', category: 'physical',
    power: 100, accuracy: 100, pp: 5, contact: true, punch: true,
    desc: '100%混乱。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'confuse' }
    ]
  },
  'ぼくちんパンチ': {
    name: 'ぼくちんパンチ', type: 'かくとう', category: 'physical',
    power: 50, accuracy: 100, pp: 30, contact: true, punch: true, priority: 1,
    desc: '先制の拳。優先度+1。',
    effect: []
  },
  'うわんスラップ': {
    name: 'うわんスラップ', type: 'かくとう', category: 'physical',
    power: 85, accuracy: 95, pp: 15, contact: true,
    desc: '腕ビンタ。100%ぼうぎょDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },
  'しょうりゅうけん': {
    name: 'しょうりゅうけん', type: 'かくとう', category: 'physical',
    power: 70, accuracy: 100, pp: 10, contact: true, punch: true, priority: 1,
    desc: '昇り龍の拳。優先度+1。10%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'flinch' }
    ]
  },
  'ドレインナックル': {
    name: 'ドレインナックル', type: 'かくとう', category: 'physical',
    power: 75, accuracy: 100, pp: 10, contact: true, punch: true,
    desc: '気を吸い取るパンチ。与ダメの50%回復。100%こうげきUP。',
    drain: 50,
    effect: [
      { trigger: 'hit', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 }
    ]
  },
  'フライングニー': {
    name: 'フライングニー', type: 'かくとう', category: 'physical',
    power: 130, accuracy: 90, pp: 10, contact: true,
    desc: '跳び膝蹴り。外すと自分が最大HPの1/2ダメージ。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'crashDamage', fraction: 2 }
    ]
  },
  'しっぷうけん': {
    name: 'しっぷうけん', type: 'かくとう', category: 'physical',
    power: 40, accuracy: 100, pp: 30, contact: true, punch: true,
    desc: '疾風の拳。2回攻撃。',
    fixedHits: 2,
    effect: []
  },
  'カウンターブロウ': {
    name: 'カウンターブロウ', type: 'かくとう', category: 'physical',
    power: 0, accuracy: 100, pp: 20, priority: -5,
    desc: '受けた物理ダメージを2倍返し。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'counter' }
    ]
  },
  'せいけんづき': {
    name: 'せいけんづき', type: 'かくとう', category: 'physical',
    power: 150, accuracy: 100, pp: 5, contact: true, punch: true,
    desc: '会心の正拳。確定急所。使用後動けない。',
    alwaysCrit: true,
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'recharge' }
    ]
  },
  'ローキック': {
    name: 'ローキック', type: 'かくとう', category: 'physical',
    power: 65, accuracy: 100, pp: 20, contact: true,
    desc: '低い蹴り。100%すばやさDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'ビルドアップ': {
    name: 'ビルドアップ', type: 'かくとう', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '100%でこうげき・ぼうぎょ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 1 }
    ]
  },
  'れんぞくパンチ': {
    name: 'れんぞくパンチ', type: 'かくとう', category: 'physical',
    power: 18, accuracy: 85, pp: 15, contact: true, punch: true,
    desc: '2〜5回連続パンチ。',
    multiHit: [2, 5],
    effect: []
  },
  'ばくれつきゃく': {
    name: 'ばくれつきゃく', type: 'かくとう', category: 'physical',
    power: 30, accuracy: 100, pp: 10, contact: true,
    desc: '3回連続蹴り。必ず3回当たる。',
    fixedHits: 3,
    effect: []
  },
  'きあいだま': {
    name: 'きあいだま', type: 'かくとう', category: 'special',
    power: 120, accuracy: 70, pp: 5,
    desc: '気合の塊。10%とくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },

  // =============================================================
  //  どくタイプ
  // =============================================================
  'もうどくえき': {
    name: 'もうどくえき', type: 'どく', category: 'status',
    power: 0, accuracy: 90, pp: 10,
    desc: '100%で相手をもうどく状態にする。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'tox' }
    ]
  },
  'どくショック': {
    name: 'どくショック', type: 'どく', category: 'special',
    power: 65, accuracy: 100, pp: 10,
    desc: 'どく状態の相手には威力2倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'doubleVsStatus', statuses: ['psn', 'tox'] }
    ]
  },
  'ヘドロばくだん': {
    name: 'ヘドロばくだん', type: 'どく', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '汚泥の爆弾。30%どく。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'psn' }
    ]
  },
  'げゆゆボム': {
    name: 'げゆゆボム', type: 'どく', category: 'special',
    power: 90, accuracy: 85, pp: 10,
    desc: '毒の爆弾。100%どく。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'psn' }
    ]
  },
  'うんこボム': {
    name: 'うんこボム', type: 'どく', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: '巨大な爆弾。100%どく。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'psn' }
    ]
  },
  'どくのいばら': {
    name: 'どくのいばら', type: 'どく', category: 'physical',
    power: 60, accuracy: 100, pp: 25,
    desc: '毒の棘。30%どく。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'psn' }
    ]
  },
  'どくづき': {
    name: 'どくづき', type: 'どく', category: 'physical',
    power: 80, accuracy: 100, pp: 20, contact: true,
    desc: '毒の突き。30%どく。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'psn' }
    ]
  },
  'ヘドロウェーブ': {
    name: 'ヘドロウェーブ', type: 'どく', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '汚泥の波。10%どく。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'psn' }
    ]
  },
  'どくガス': {
    name: 'どくガス', type: 'どく', category: 'status',
    power: 0, accuracy: 90, pp: 40,
    desc: '毒ガスで100%どくにする。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'psn' }
    ]
  },
  'どくのそこ': {
    name: 'どくのそこ', type: 'どく', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '毒の棘を撒く。相手が交代時にどく。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setField', field: 'toxicSpikes', value: 1 }
    ]
  },
  'ベノムトラップ': {
    name: 'ベノムトラップ', type: 'どく', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: 'どく状態の相手のこうげき・とくこう・すばやさ100%で1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'venomTrap' }
    ]
  },
  'アシッドスプレー': {
    name: 'アシッドスプレー', type: 'どく', category: 'special',
    power: 40, accuracy: 100, pp: 20,
    desc: '強酸を浴びせる。100%とくぼう2段階DOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spd', stage: -2 }
    ]
  },
  'どくのしっぽ': {
    name: 'どくのしっぽ', type: 'どく', category: 'physical',
    power: 50, accuracy: 100, pp: 25, contact: true,
    desc: '毒の尻尾で叩く。50%どく。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'inflictStatus', status: 'psn' }
    ]
  },
  'クロスポイズン': {
    name: 'クロスポイズン', type: 'どく', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: '毒の十字斬り。急所率UP。10%どく。',
    critRateBonus: 1,
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'psn' }
    ]
  },

  // =============================================================
  //  じめんタイプ
  // =============================================================
  'だいちのゆれ': {
    name: 'だいちのゆれ', type: 'じめん', category: 'physical',
    power: 100, accuracy: 100, pp: 10,
    desc: '大地を揺らす。ひこうタイプには無効。',
    effect: []
  },
  'だいちのエネルギー': {
    name: 'だいちのエネルギー', type: 'じめん', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '大地の力。10%とくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'マッドショット': {
    name: 'マッドショット', type: 'じめん', category: 'special',
    power: 55, accuracy: 95, pp: 15,
    desc: '泥を撃つ。100%すばやさDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'パブロのほりあげ': {
    name: 'パブロのほりあげ', type: 'じめん', category: 'physical',
    power: 80, accuracy: 100, pp: 15,
    desc: 'スコップで掘り上げる。',
    effect: []
  },
  'じならし': {
    name: 'じならし', type: 'じめん', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '地面を踏む。100%すばやさDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'あなをほる': {
    name: 'あなをほる', type: 'じめん', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '地中に潜り次ターン攻撃。',
    twoTurn: true,
    effect: []
  },
  'すなかけ': {
    name: 'すなかけ', type: 'じめん', category: 'status',
    power: 0, accuracy: 100, pp: 15,
    desc: '砂をかけて100%命中率1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'acc', stage: -1 }
    ]
  },
  'すなあらしをよぶ': {
    name: 'すなあらしをよぶ', type: 'じめん', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '天気を砂嵐にする（5ターン）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setWeather', weather: 'sandstorm', turns: 5 }
    ]
  },
  'がんせきクローズ': {
    name: 'がんせきクローズ', type: 'じめん', category: 'physical',
    power: 60, accuracy: 95, pp: 15,
    desc: '岩で塞ぐ。100%すばやさDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'どろばくだん': {
    name: 'どろばくだん', type: 'じめん', category: 'special',
    power: 65, accuracy: 85, pp: 10,
    desc: '泥の爆弾。30%命中率DOWN。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'statChange', stat: 'acc', stage: -1 }
    ]
  },
  'こうちだいち': {
    name: 'こうちだいち', type: 'じめん', category: 'physical',
    power: 95, accuracy: 95, pp: 10, contact: true,
    desc: '地面を砕く猛攻。20%ぼうぎょDOWN。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },
  'ボーンラッシュ': {
    name: 'ボーンラッシュ', type: 'じめん', category: 'physical',
    power: 25, accuracy: 90, pp: 10,
    desc: '骨で2〜5回殴る。',
    multiHit: [2, 5],
    effect: []
  },
  'サウザンエッジ': {
    name: 'サウザンエッジ', type: 'じめん', category: 'physical',
    power: 75, accuracy: 100, pp: 10,
    desc: '大地の千の刃。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'だいちのカーテン': {
    name: 'だいちのカーテン', type: 'じめん', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '100%とくぼうを2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 2 }
    ]
  },

  // =============================================================
  //  ひこうタイプ
  // =============================================================
  'そらからのこうげき': {
    name: 'そらからのこうげき', type: 'ひこう', category: 'physical',
    power: 90, accuracy: 95, pp: 15,
    desc: '空から急降下攻撃。2ターン技。',
    twoTurn: true,
    effect: []
  },
  'ぼうふうブラスト': {
    name: 'ぼうふうブラスト', type: 'ひこう', category: 'special',
    power: 110, accuracy: 70, pp: 10,
    desc: '暴風。30%混乱。雨で必中。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'confuse' }
    ]
  },
  'ゆうかんなとびこみ': {
    name: 'ゆうかんなとびこみ', type: 'ひこう', category: 'physical',
    power: 120, accuracy: 100, pp: 15, contact: true,
    desc: '勇敢な飛翔突撃。与ダメ1/3反動。',
    recoilDamage: 3,
    effect: []
  },
  'たかしのひこう': {
    name: 'たかしのひこう', type: 'ひこう', category: 'physical',
    power: 80, accuracy: 100, pp: 10,
    desc: '宇宙人の力で飛行して攻撃。',
    effect: []
  },
  'ほしになったぼくちん': {
    name: 'ほしになったぼくちん', type: 'ひこう', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '星になった光で攻撃。20%メロメロ。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'infatuate' }
    ]
  },
  'むげんのひかり': {
    name: 'むげんのひかり', type: 'ひこう', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '無限の光。5ターンとくしゅダメ半減の壁。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setField', field: 'lightScreen', value: 5 }
    ]
  },
  'バードアタック': {
    name: 'バードアタック', type: 'ひこう', category: 'physical',
    power: 60, accuracy: 100, pp: 25, contact: true,
    desc: '鳥の爪で攻撃。',
    effect: []
  },
  'エアスラッシュ': {
    name: 'エアスラッシュ', type: 'ひこう', category: 'special',
    power: 75, accuracy: 95, pp: 15,
    desc: '鋭い空気の刃。30%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'flinch' }
    ]
  },
  'つばめブレード': {
    name: 'つばめブレード', type: 'ひこう', category: 'physical',
    power: 60, accuracy: 0, pp: 20, contact: true,
    desc: '燕返し。必中。',
    effect: []
  },
  'はねやすめ': {
    name: 'はねやすめ', type: 'ひこう', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'HP50%回復。そのターンひこうタイプを失う。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 50 },
      { trigger: 'use', chance: 100, target: 'self', action: 'loseTypeForTurn', loseType: 'ひこう' }
    ]
  },
    'おいかぜ': {
    name: 'おいかぜ', type: 'ひこう', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '4ターンの間味方のすばやさ2倍。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setField', field: 'tailwind', value: 4 }
    ]
  },
  'はがねのつばさ': {
    name: 'はがねのつばさ', type: 'ひこう', category: 'physical',
    power: 70, accuracy: 90, pp: 25, contact: true,
    desc: '鋼の翼。10%ぼうぎょUP（自分）。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'self', action: 'statChange', stat: 'def', stage: 1 }
    ]
  },
  'アクロバットフライ': {
    name: 'アクロバットフライ', type: 'ひこう', category: 'physical',
    power: 55, accuracy: 100, pp: 15, contact: true,
    desc: '持ち物がないと威力2倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'noItemDoublePower' }
    ]
  },
  'ゴッドバード': {
    name: 'ゴッドバード', type: 'ひこう', category: 'physical',
    power: 140, accuracy: 90, pp: 5,
    desc: '1ターン溜めて攻撃。急所率UP。30%ひるみ。',
    twoTurn: true,
    critRateBonus: 1,
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'flinch' }
    ]
  },

  // =============================================================
  //  エスパータイプ
  // =============================================================
  'ねんりきビーム': {
    name: 'ねんりきビーム', type: 'エスパー', category: 'special',
    power: 50, accuracy: 100, pp: 25,
    desc: '念力攻撃。10%混乱。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'confuse' }
    ]
  },
  'サイコウェーブ': {
    name: 'サイコウェーブ', type: 'エスパー', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '念動攻撃。10%とくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'サイコインパクト': {
    name: 'サイコインパクト', type: 'エスパー', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: 'ぼうぎょで計算するとくしゅ技。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'useDefense' }
    ]
  },
  'みらいのこうげき': {
    name: 'みらいのこうげき', type: 'エスパー', category: 'special',
    power: 120, accuracy: 100, pp: 10,
    desc: '2ターン後にダメージを与える。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'futureAttack', turns: 2, power: 120 }
    ]
  },
  'サイコバースト': {
    name: 'サイコバースト', type: 'エスパー', category: 'special',
    power: 140, accuracy: 90, pp: 5,
    desc: '全力のサイコ。使用後とくこう2段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: -2 }
    ]
  },
  'テレポートスイッチ': {
    name: 'テレポートスイッチ', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 20, priority: -6,
    desc: 'ひかえと交代。優先度-6。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'switchAfter' }
    ]
  },
  'てんさいのひらめき': {
    name: 'てんさいのひらめき', type: 'エスパー', category: 'special',
    power: 100, accuracy: 95, pp: 10,
    desc: '天才の閃き。確定急所。',
    alwaysCrit: true,
    effect: []
  },
  'まつもとのちえ': {
    name: 'まつもとのちえ', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '知恵で100%とくこう・とくぼう2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 2 }
    ]
  },
  'にゃざーるビーム': {
    name: 'にゃざーるビーム', type: 'エスパー', category: 'special',
    power: 100, accuracy: 95, pp: 10,
    desc: '神秘の目から放つビーム。20%メロメロ。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'infatuate' }
    ]
  },
  'コンパスしじ': {
    name: 'コンパスしじ', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '方向指示。100%こうげき・すばやさ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'ロールシャッハテスト': {
    name: 'ロールシャッハテスト', type: 'エスパー', category: 'status',
    power: 0, accuracy: 85, pp: 10,
    desc: '心理を読む。50%混乱 or 50%こうげき1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 50, target: 'enemy', action: 'confuse' },
      { trigger: 'use', chance: 50, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 }
    ]
  },
  'はかせのかいせき': {
    name: 'はかせのかいせき', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '相手のステータス・技・特性を解析する。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'revealAll' }
    ]
  },
  'じかんのやじるし': {
    name: 'じかんのやじるし', type: 'エスパー', category: 'special',
    power: 70, accuracy: 100, pp: 15, priority: 2,
    desc: '時の矢。優先度+2。',
    effect: []
  },
  'めいそう': {
    name: 'めいそう', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '100%でとくこう・とくぼう1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 1 }
    ]
  },
  'サイドチェンジ': {
    name: 'サイドチェンジ', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 15, priority: 1,
    desc: '自分と味方の位置を入れ替える。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'sideChange' }
    ]
  },
  'トリックルーム': {
    name: 'トリックルーム', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 5, priority: -7,
    desc: '5ターンの間すばやさが低い方が先に行動。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'trickRoom', turns: 5 }
    ]
  },
  'しゃくねつのめ': {
    name: 'しゃくねつのめ', type: 'エスパー', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '灼熱の目。30%混乱。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'confuse' }
    ]
  },
  'サイコドレイン': {
    name: 'サイコドレイン', type: 'エスパー', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '精神を吸い取る。与ダメの50%回復。',
    drain: 50,
    effect: []
  },

  // =============================================================
  //  むしタイプ
  // =============================================================
  'むしのさざめき': {
    name: 'むしのさざめき', type: 'むし', category: 'special',
    power: 90, accuracy: 100, pp: 10, sound: true,
    desc: '虫の声。10%とくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'シザークロス': {
    name: 'シザークロス', type: 'むし', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: 'ハサミで切る。',
    effect: []
  },
  'むしくいアタック': {
    name: 'むしくいアタック', type: 'むし', category: 'physical',
    power: 60, accuracy: 100, pp: 20, contact: true,
    desc: '噛みつく。100%相手のきのみを奪う。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'stealBerry' }
    ]
  },
  'とんぼスイッチ': {
    name: 'とんぼスイッチ', type: 'むし', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: '攻撃後ひかえと交代。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'self', action: 'switchAfter' }
    ]
  },
  'ミサイルニードル': {
    name: 'ミサイルニードル', type: 'むし', category: 'physical',
    power: 25, accuracy: 95, pp: 20,
    desc: '針を2〜5本飛ばす。',
    multiHit: [2, 5],
    effect: []
  },
  'メガホーン': {
    name: 'メガホーン', type: 'むし', category: 'physical',
    power: 120, accuracy: 85, pp: 10, contact: true,
    desc: '巨大な角で突撃。',
    effect: []
  },
  'ほたるのひかり': {
    name: 'ほたるのひかり', type: 'むし', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '蛍の光でHP50%回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 50 }
    ]
  },
  'ちょうのまい': {
    name: 'ちょうのまい', type: 'むし', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '蝶の舞。100%とくこう・とくぼう・すばやさ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'いとをはく': {
    name: 'いとをはく', type: 'むし', category: 'status',
    power: 0, accuracy: 95, pp: 40,
    desc: '糸でまとわりつく。100%すばやさ2段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'spe', stage: -2 }
    ]
  },
  'きゅうけつアタック': {
    name: 'きゅうけつアタック', type: 'むし', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '吸血。与ダメの50%回復。',
    drain: 50,
    effect: []
  },

  // =============================================================
  //  いわタイプ
  // =============================================================
  'がんせきブレード': {
    name: 'がんせきブレード', type: 'いわ', category: 'physical',
    power: 100, accuracy: 80, pp: 5,
    desc: '岩の刃。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'がんせきトラップ': {
    name: 'がんせきトラップ', type: 'いわ', category: 'physical',
    power: 60, accuracy: 95, pp: 15,
    desc: '岩で塞ぐ。100%すばやさDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'いわなだれ': {
    name: 'いわなだれ', type: 'いわ', category: 'physical',
    power: 75, accuracy: 90, pp: 10,
    desc: '岩を落とす。30%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'flinch' }
    ]
  },
  'ロックブラスト': {
    name: 'ロックブラスト', type: 'いわ', category: 'physical',
    power: 25, accuracy: 90, pp: 10,
    desc: '岩を2〜5個投げる。',
    multiHit: [2, 5],
    effect: []
  },
  'パワージェム': {
    name: 'パワージェム', type: 'いわ', category: 'special',
    power: 80, accuracy: 100, pp: 20,
    desc: '宝石の輝きで攻撃。',
    effect: []
  },
  'ステルストラップ': {
    name: 'ステルストラップ', type: 'いわ', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '岩の罠を撒く。相手交代時に岩ダメージ。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setField', field: 'stealthRock', value: true }
    ]
  },
  'ワイドクラッシュ': {
    name: 'ワイドクラッシュ', type: 'いわ', category: 'physical',
    power: 110, accuracy: 80, pp: 5, contact: true,
    desc: '全身で岩を砕く突撃。最大HPの1/4反動。',
    recoil: 4,
    effect: []
  },
  'メテオフォール': {
    name: 'メテオフォール', type: 'いわ', category: 'physical',
    power: 150, accuracy: 90, pp: 5,
    desc: '隕石落とし。100%こうげき・ぼうぎょ1段階DOWN（自分）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: -1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },
  'ダイヤストーム': {
    name: 'ダイヤストーム', type: 'いわ', category: 'physical',
    power: 100, accuracy: 95, pp: 5,
    desc: 'ダイヤの嵐。50%ぼうぎょUP（自分）。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'self', action: 'statChange', stat: 'def', stage: 1 }
    ]
  },
  'がんせきスプリット': {
    name: 'がんせきスプリット', type: 'いわ', category: 'physical',
    power: 75, accuracy: 100, pp: 15,
    desc: '岩を割りぶつける。',
    effect: []
  },
  'すなのからだ': {
    name: 'すなのからだ', type: 'いわ', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '100%ぼうぎょ2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 2 }
    ]
  },
  'ジュエルレーザー': {
    name: 'ジュエルレーザー', type: 'いわ', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '宝石のレーザー。10%とくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },

  // =============================================================
  //  ゴーストタイプ
  // =============================================================
  'シャドーショット': {
    name: 'シャドーショット', type: 'ゴースト', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '影の弾丸。20%とくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'のろいのことば': {
    name: 'のろいのことば', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'HP1/2消費し呪いをかける。毎ターン1/4ダメージ。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'selfDamagePercent', value: 50 },
      { trigger: 'use', chance: 100, target: 'enemy', action: 'curse' }
    ]
  },
  'たたりめのひ': {
    name: 'たたりめのひ', type: 'ゴースト', category: 'special',
    power: 65, accuracy: 100, pp: 10,
    desc: '状態異常の相手に威力2倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'doubleVsAnyStatus' }
    ]
  },
  'やみのはどう': {
    name: 'やみのはどう', type: 'ゴースト', category: 'special',
    power: 0, accuracy: 100, pp: 15,
    desc: '自分のレベルと同じ固定ダメージ。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'levelDamage' }
    ]
  },
  'したいのゆうき': {
    name: 'したいのゆうき', type: 'ゴースト', category: 'physical',
    power: 80, accuracy: 100, pp: 15,
    desc: '死体の力。100%一度だけひんしを回避するフラグを立てる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'setFlag', flag: 'surviveOnce', value: true }
    ]
  },
  'ホラービジョン': {
    name: 'ホラービジョン', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 100, pp: 15,
    desc: '恐怖映像。100%こうげき・とくこう・すばやさ1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 },
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 },
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'くろきりのとばり': {
    name: 'くろきりのとばり', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '黒い霧。100%回避率1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'eva', stage: 1 }
    ]
  },
  'ゴーストクロー': {
    name: 'ゴーストクロー', type: 'ゴースト', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '幽霊の爪。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'ファントムフォース': {
    name: 'ファントムフォース', type: 'ゴースト', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true,
    desc: '姿を消して次ターン攻撃。まもるを貫通。',
    twoTurn: true,
    pierceProtect: true,
    effect: []
  },
  'みちづれのうた': {
    name: 'みちづれのうた', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '次ターンにたおされたら相手も道連れ。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'setFlag', flag: 'destinyBond', value: true }
    ]
  },
  'おにびシュート': {
    name: 'おにびシュート', type: 'ゴースト', category: 'special',
    power: 60, accuracy: 100, pp: 15,
    desc: '幽火を飛ばす。30%やけど。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'あくむのささやき': {
    name: 'あくむのささやき', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 85, pp: 10, sound: true,
    desc: '悪夢の囁き。100%眠りにする。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'slp' }
    ]
  },
  'シャドードレイン': {
    name: 'シャドードレイン', type: 'ゴースト', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '影から吸い取る。与ダメの50%回復。',
    drain: 50,
    effect: []
  },
  'ポルターガイスト': {
    name: 'ポルターガイスト', type: 'ゴースト', category: 'physical',
    power: 110, accuracy: 90, pp: 5,
    desc: '持ち物を操って攻撃。持ち物がないと失敗。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'requireEnemyItem' }
    ]
  },
  'シャドーパンチ': {
    name: 'シャドーパンチ', type: 'ゴースト', category: 'physical',
    power: 60, accuracy: 0, pp: 20, contact: true, punch: true,
    desc: '影のパンチ。必中。',
    effect: []
  },
  'のろいのしるし': {
    name: 'のろいのしるし', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 90, pp: 10,
    desc: '呪いの印を刻む。毎ターンHP1/8ダメージ。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'curse' }
    ]
  },

  // =============================================================
  //  ドラゴンタイプ
  // =============================================================
  'りゅうせいぐん': {
    name: 'りゅうせいぐん', type: 'ドラゴン', category: 'special',
    power: 130, accuracy: 90, pp: 5,
    desc: '隕石の嵐。使用後とくこう2段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: -2 }
    ]
  },
  'げきりんラッシュ': {
    name: 'げきりんラッシュ', type: 'ドラゴン', category: 'physical',
    power: 120, accuracy: 100, pp: 10, contact: true,
    desc: '2〜3ターン攻撃し続け、終了後混乱。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'thrash', minTurns: 2, maxTurns: 3 }
    ]
  },
  'ドラゴンクロー': {
    name: 'ドラゴンクロー', type: 'ドラゴン', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '鋭い竜の爪。',
    effect: []
  },
  'ドラゴンパルス': {
    name: 'ドラゴンパルス', type: 'ドラゴン', category: 'special',
    power: 85, accuracy: 100, pp: 10,
    desc: '竜の波動で攻撃。',
    effect: []
  },
  'りゅうのまい': {
    name: 'りゅうのまい', type: 'ドラゴン', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '竜の舞。100%こうげき・すばやさ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'ドラゴンテール': {
    name: 'ドラゴンテール', type: 'ドラゴン', category: 'physical',
    power: 60, accuracy: 90, pp: 10, contact: true, priority: -6,
    desc: '竜の尾で弾く。100%相手を強制交代。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'forceSwitch' }
    ]
  },
  'ドラゴンダイブ': {
    name: 'ドラゴンダイブ', type: 'ドラゴン', category: 'physical',
    power: 100, accuracy: 75, pp: 10, contact: true,
    desc: '竜の急降下。20%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'flinch' }
    ]
  },
  'コアドラゴンパンチ': {
    name: 'コアドラゴンパンチ', type: 'ドラゴン', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true, punch: true,
    desc: '竜の拳。竜の力を拳に凝縮。',
    effect: []
  },
  'ワイドブレイカー': {
    name: 'ワイドブレイカー', type: 'ドラゴン', category: 'physical',
    power: 60, accuracy: 100, pp: 15, contact: true,
    desc: '広範囲攻撃。100%こうげきDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 }
    ]
  },
  'スケイルショット': {
    name: 'スケイルショット', type: 'ドラゴン', category: 'physical',
    power: 25, accuracy: 90, pp: 20,
    desc: '鱗を2〜5枚飛ばす。使用後100%すばやさUP・ぼうぎょDOWN。',
    multiHit: [2, 5],
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },
  'ドラゴンエナジー': {
    name: 'ドラゴンエナジー', type: 'ドラゴン', category: 'special',
    power: 150, accuracy: 100, pp: 5,
    desc: '自分のHP割合で威力変動。最大150。',
    hpScaling: 'maxHpPower',
    effect: []
  },
  'クラッシュドラゴン': {
    name: 'クラッシュドラゴン', type: 'ドラゴン', category: 'physical',
    power: 100, accuracy: 100, pp: 5, contact: true,
    desc: '竜の全身突撃。20%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'flinch' }
    ]
  },

  // =============================================================
  //  あくタイプ
  // =============================================================
  'あくのはどう': {
    name: 'あくのはどう', type: 'あく', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '悪のエネルギー。20%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'flinch' }
    ]
  },
  'かみくだく': {
    name: 'かみくだく', type: 'あく', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true, bite: true,
    desc: '噛み砕く。20%ぼうぎょDOWN。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },
  'イカサマバースト': {
    name: 'イカサマバースト', type: 'あく', category: 'physical',
    power: 95, accuracy: 100, pp: 15,
    desc: '相手のこうげきで計算する。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'useEnemyAtk' }
    ]
  },
  'やみのなみ': {
    name: 'やみのなみ', type: 'あく', category: 'special',
    power: 95, accuracy: 95, pp: 10,
    desc: '暗黒波。100%壁を破壊する。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'field', action: 'breakScreens' }
    ]
  },
  'はんざいのいぬ': {
    name: 'はんざいのいぬ', type: 'あく', category: 'physical',
    power: 80, accuracy: 90, pp: 10, contact: true,
    desc: '犯人追跡。確定急所。',
    alwaysCrit: true,
    effect: []
  },
  'あくまのけいやく': {
    name: 'あくまのけいやく', type: 'あく', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '悪魔との契約。全能力2段階UP。HP50%消費。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'selfDamagePercent', value: 50 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 2 }
    ]
  },
  'ふいうちダガー': {
    name: 'ふいうちダガー', type: 'あく', category: 'physical',
    power: 70, accuracy: 100, pp: 5, priority: 1, contact: true,
    desc: '不意打ち。相手が攻撃技を選んでいるときのみ成功。優先度+1。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'suckerPunch' }
    ]
  },
  'つじぎり': {
    name: 'つじぎり', type: 'あく', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '辻斬り。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'はたきおとし': {
    name: 'はたきおとし', type: 'あく', category: 'physical',
    power: 65, accuracy: 100, pp: 20, contact: true,
    desc: '持ち物を叩き落とす。持ち物があると威力1.5倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'knockOffBoost' },
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'knockOff' }
    ]
  },
  'バークアウト': {
    name: 'バークアウト', type: 'あく', category: 'special',
    power: 55, accuracy: 95, pp: 15, sound: true,
    desc: '吠える。100%とくこうDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },
  'ちょうはつ': {
    name: 'ちょうはつ', type: 'あく', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: '挑発。3ターンの間攻撃技しか出せなくする。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'taunt', value: 3 }
    ]
  },
  'わるだくみ': {
    name: 'わるだくみ', type: 'あく', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '悪巧み。100%とくこう2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 2 }
    ]
  },
  'ダークバインド': {
    name: 'ダークバインド', type: 'あく', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '闇で縛る。2〜5ターン束縛。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'trap', min: 2, max: 5 }
    ]
  },
  'ぺゆゆのうそ': {
    name: 'ぺゆゆのうそ', type: 'あく', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '嘘で100%ぼうぎょ・とくぼう1段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 },
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'くろいまなざし': {
    name: 'くろいまなざし', type: 'あく', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '黒い眼差し。相手は逃げられない。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'setFlag', flag: 'trapped', value: true }
    ]
  },
  'ナイトスラッシュ': {
    name: 'ナイトスラッシュ', type: 'あく', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '闇の斬撃。急所率UP。',
    critRateBonus: 1,
    effect: []
  },

  // =============================================================
  //  はがねタイプ
  // =============================================================
  'アイアンヘッド': {
    name: 'アイアンヘッド', type: 'はがね', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '金属の頭突き。30%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'flinch' }
    ]
  },
  'コメットパンチ': {
    name: 'コメットパンチ', type: 'はがね', category: 'physical',
    power: 90, accuracy: 90, pp: 10, contact: true, punch: true,
    desc: '流星パンチ。20%こうげきUP（自分）。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'self', action: 'statChange', stat: 'atk', stage: 1 }
    ]
  },
  'ラスターキャノン': {
    name: 'ラスターキャノン', type: 'はがね', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '光の砲撃。10%とくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'バレットパンチ': {
    name: 'バレットパンチ', type: 'はがね', category: 'physical',
    power: 40, accuracy: 100, pp: 30, priority: 1, contact: true, punch: true,
    desc: '弾丸の拳。優先度+1。',
    effect: []
  },
  'メタルクロー': {
    name: 'メタルクロー', type: 'はがね', category: 'physical',
    power: 50, accuracy: 95, pp: 35, contact: true,
    desc: '金属の爪。10%こうげきUP（自分）。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'self', action: 'statChange', stat: 'atk', stage: 1 }
    ]
  },
  'ヘビーボンバー': {
    name: 'ヘビーボンバー', type: 'はがね', category: 'physical',
    power: 1, accuracy: 100, pp: 10, contact: true,
    desc: '自分が重いほど威力UP（最大120）。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'heavySlam' }
    ]
  },
  'ジャイロスピン': {
    name: 'ジャイロスピン', type: 'はがね', category: 'physical',
    power: 1, accuracy: 100, pp: 5, contact: true,
    desc: '遅いほど威力UP（最大150）。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'gyroBall' }
    ]
  },
  'はがねのつるぎ': {
    name: 'はがねのつるぎ', type: 'はがね', category: 'physical',
    power: 90, accuracy: 100, pp: 15, contact: true,
    desc: '鋼の剣で斬る。',
    effect: []
  },
  'てっていバリア': {
    name: 'てっていバリア', type: 'はがね', category: 'status',
    power: 0, accuracy: 0, pp: 15, priority: 4,
    desc: '鉄壁の守り。そのターン攻撃を防ぎ接触した相手のこうげき2段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'protectSpiky' }
    ]
  },
  'メタルバースト': {
    name: 'メタルバースト', type: 'はがね', category: 'physical',
    power: 0, accuracy: 100, pp: 10,
    desc: '受けたダメージを1.5倍にして返す。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'metalBurst' }
    ]
  },
  'はがねのフィールド': {
    name: 'はがねのフィールド', type: 'はがね', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '100%ぼうぎょ・とくぼう1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 1 }
    ]
  },
  'ギアチェンジ': {
    name: 'ギアチェンジ', type: 'はがね', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'ギアを変えて100%こうげき1段階UP・すばやさ2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 2 }
    ]
  },
  'メタルレイン': {
    name: 'メタルレイン', type: 'はがね', category: 'special',
    power: 95, accuracy: 90, pp: 10,
    desc: '鋼の雨。10%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'flinch' }
    ]
  },
  'スチールフィスト': {
    name: 'スチールフィスト', type: 'はがね', category: 'physical',
    power: 100, accuracy: 100, pp: 5, contact: true, punch: true,
    desc: '鋼鉄の拳。10%ぼうぎょDOWN。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },

  // =============================================================
  //  フェアリータイプ
  // =============================================================
  'ムーンブラスト': {
    name: 'ムーンブラスト', type: 'フェアリー', category: 'special',
    power: 95, accuracy: 100, pp: 15,
    desc: '月の力。30%とくこうDOWN。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },
  'マジカルフラッシュ': {
    name: 'マジカルフラッシュ', type: 'フェアリー', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '魔法の光で攻撃。',
    effect: []
  },
  'マジカルフレイム': {
    name: 'マジカルフレイム', type: 'フェアリー', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '魔法の炎。100%とくこうDOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },
  'チャームボイス': {
    name: 'チャームボイス', type: 'フェアリー', category: 'special',
    power: 40, accuracy: 0, pp: 15, sound: true,
    desc: '可愛い声。必中技。',
    effect: []
  },
  'なやみのタネ': {
    name: 'なやみのタネ', type: 'フェアリー', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '100%相手の特性を無効化する。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'setFlag', flag: 'abilityDisabled', value: true }
    ]
  },
  'みゆゆステップ': {
    name: 'みゆゆステップ', type: 'フェアリー', category: 'physical',
    power: 65, accuracy: 100, pp: 20, contact: true,
    desc: '軽やかなステップ。100%すばやさ1段階UP（自分）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'かみのおくりもの': {
    name: 'かみのおくりもの', type: 'フェアリー', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '天使の加護。HP全回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 100 }
    ]
  },
  'ドレインキッス': {
    name: 'ドレインキッス', type: 'フェアリー', category: 'special',
    power: 50, accuracy: 100, pp: 10,
    desc: 'キスで吸い取る。与ダメの75%回復。',
    drain: 75,
    effect: []
  },
  'フェアリーウインド': {
    name: 'フェアリーウインド', type: 'フェアリー', category: 'special',
    power: 40, accuracy: 100, pp: 30,
    desc: '妖精の風。',
    effect: []
  },
  'じゃれつくアタック': {
    name: 'じゃれつくアタック', type: 'フェアリー', category: 'physical',
    power: 90, accuracy: 90, pp: 10, contact: true,
    desc: 'じゃれついて攻撃。10%こうげきDOWN（相手）。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 }
    ]
  },
  'ミストフィールド': {
    name: 'ミストフィールド', type: 'フェアリー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '5ターン霧のフィールド。状態異常無効・ドラゴン技半減。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setTerrain', terrain: 'misty', turns: 5 }
    ]
  },
  'フラワーフォース': {
    name: 'フラワーフォース', type: 'フェアリー', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: '花の力で攻撃。晴れだと威力1.5倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'sunBoost', mult: 1.5 }
    ]
  },
  'スターアサルト': {
    name: 'スターアサルト', type: 'フェアリー', category: 'physical',
    power: 150, accuracy: 100, pp: 5, contact: true,
    desc: '星の全力突撃。次ターン動けない。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'recharge' }
    ]
  },
  'いやしのはどう': {
    name: 'いやしのはどう', type: 'フェアリー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '癒しの波動。HP50%回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 50 }
    ]
  },

  // =============================================================
  //  ハイパータイプ
  // =============================================================
  'はかいのさけび': {
    name: 'はかいのさけび', type: 'ハイパー', category: 'special',
    power: 120, accuracy: 80, pp: 5, sound: true,
    desc: '破壊神の叫び。全耐性を無視する貫通ダメージ。',
    pierceResistance: true,
    effect: []
  },
  'おでゴッドパンチ': {
    name: 'おでゴッドパンチ', type: 'ハイパー', category: 'physical',
    power: 140, accuracy: 85, pp: 5, contact: true, punch: true,
    desc: '神の拳。10%一撃ひんし。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'ohko' }
    ]
  },
  'うちゅうエネルギー': {
    name: 'うちゅうエネルギー', type: 'ハイパー', category: 'special',
    power: 100, accuracy: 100, pp: 5,
    desc: '宇宙の力で攻撃。全耐性貫通。',
    pierceResistance: true,
    effect: []
  },
  'ハイパーノヴァ': {
    name: 'ハイパーノヴァ', type: 'ハイパー', category: 'special',
    power: 160, accuracy: 80, pp: 5,
    desc: '超新星爆発。使用後とくこう3段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: -3 }
    ]
  },
  'デストロイビーム': {
    name: 'デストロイビーム', type: 'ハイパー', category: 'special',
    power: 130, accuracy: 90, pp: 5,
    desc: '破壊光線。次ターン動けない。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'recharge' }
    ]
  },
  'メガクラッシュ': {
    name: 'メガクラッシュ', type: 'ハイパー', category: 'physical',
    power: 130, accuracy: 90, pp: 5, contact: true,
    desc: '圧倒的な力で叩きつける。与ダメ1/3反動。',
    recoilDamage: 3,
    effect: []
  },
  'ハイパーチャージ': {
    name: 'ハイパーチャージ', type: 'ハイパー', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '全能力2段階UP。次ターン動けない。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'recharge' }
    ]
  },
  'ジャッジメントレイ': {
    name: 'ジャッジメントレイ', type: 'ハイパー', category: 'special',
    power: 100, accuracy: 100, pp: 10,
    desc: '裁きの光。使用者のタイプで技タイプが変わる。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'judgment' }
    ]
  },
  'ハイパーインパクト': {
    name: 'ハイパーインパクト', type: 'ハイパー', category: 'physical',
    power: 110, accuracy: 95, pp: 10, contact: true,
    desc: '超破壊力の一撃。20%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'flinch' }
    ]
  },
  'しゅくふくのひかり': {
    name: 'しゅくふくのひかり', type: 'ハイパー', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '祝福の光でHP全回復+状態異常回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 100 },
      { trigger: 'use', chance: 100, target: 'self', action: 'cureStatus' }
    ]
  },

  // =============================================================
  //  カオスタイプ
  // =============================================================
  'カオスエネルギー': {
    name: 'カオスエネルギー', type: 'カオス', category: 'special',
    power: 1, accuracy: 100, pp: 10,
    desc: 'ランダムタイプのエネルギー（威力50〜150）。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'randomPower', min: 50, max: 150 },
      { trigger: 'always', chance: 100, target: 'self', action: 'randomMoveType' }
    ]
  },
  'カオスバースト': {
    name: 'カオスバースト', type: 'カオス', category: 'special',
    power: 100, accuracy: 85, pp: 5,
    desc: '混沌の爆発。ランダムで追加効果が発動。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'randomSecondary' }
    ]
  },
  'じくうのひずみ': {
    name: 'じくうのひずみ', type: 'カオス', category: 'special',
    power: 80, accuracy: 90, pp: 10,
    desc: '時空を歪める。20%混乱。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'confuse' }
    ]
  },
  'カオスフィールド': {
    name: 'カオスフィールド', type: 'カオス', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '5ターンの間全技のタイプがランダムに変わる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setTerrain', terrain: 'chaos', turns: 5 }
    ]
  },
  'むちつじょのかぜ': {
    name: 'むちつじょのかぜ', type: 'カオス', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '無秩序の風。100%ランダムで能力1段階UP/DOWN。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'randomStatChange', stage: 1 }
    ]
  },
  'げんそうほうかい': {
    name: 'げんそうほうかい', type: 'カオス', category: 'special',
    power: 120, accuracy: 75, pp: 5,
    desc: '幻想を崩壊させる。50%混乱。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'confuse' }
    ]
  },
  'カオスシード': {
    name: 'カオスシード', type: 'カオス', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '混沌の種。100%相手のランダムな能力を2段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'randomStatChange', stage: -2 }
    ]
  },
  'エントロピーウェーブ': {
    name: 'エントロピーウェーブ', type: 'カオス', category: 'special',
    power: 90, accuracy: 95, pp: 10,
    desc: 'エントロピーの波。100%全場の能力変化をリセット。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'self', action: 'clearStatChanges' },
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'clearStatChanges' }
    ]
  },

  // =============================================================
  //  しれいタイプ
  // =============================================================
  'こうしんのぐんぜい': {
    name: 'こうしんのぐんぜい', type: 'しれい', category: 'physical',
    power: 25, accuracy: 100, pp: 20,
    desc: '兵士を4〜5体呼んで連続攻撃。',
    multiHit: [4, 5],
    effect: []
  },
  'ぐんだんのさけび': {
    name: 'ぐんだんのさけび', type: 'しれい', category: 'special',
    power: 90, accuracy: 100, pp: 10, sound: true,
    desc: '軍団の雄叫び。20%こうげきDOWN。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 }
    ]
  },
  'しれいかんのめい': {
    name: 'しれいかんのめい', type: 'しれい', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '司令官の命令。100%こうげき・ぼうぎょ・すばやさ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'いちげきりだつ': {
    name: 'いちげきりだつ', type: 'しれい', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: '一撃離脱。攻撃後ひかえと交代。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'self', action: 'switchAfter' }
    ]
  },
  'てきじんとっぱ': {
    name: 'てきじんとっぱ', type: 'しれい', category: 'physical',
    power: 120, accuracy: 90, pp: 5, contact: true,
    desc: '敵陣突破。100%ぼうぎょ・とくぼう1段階DOWN（自分）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: -1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'ぼうえいたいせい': {
    name: 'ぼうえいたいせい', type: 'しれい', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '防衛態勢。100%ぼうぎょ・とくぼう2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 2 }
    ]
  },
  'サツガイキャノン': {
    name: 'サツガイキャノン', type: 'しれい', category: 'special',
    power: 110, accuracy: 85, pp: 5,
    desc: 'サツガイ兄弟の合体砲。10%全能力DOWN（相手）。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 },
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 },
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 },
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 },
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'せんりゃくてったい': {
    name: 'せんりゃくてったい', type: 'しれい', category: 'status',
    power: 0, accuracy: 0, pp: 20, priority: -6,
    desc: '戦略的撤退。交代時にHP1/4回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 25 },
      { trigger: 'use', chance: 100, target: 'self', action: 'switchAfter' }
    ]
  },

  // =============================================================
  //  げんそうタイプ
  // =============================================================
  'ゆめみちらし': {
    name: 'ゆめみちらし', type: 'げんそう', category: 'special',
    power: 85, accuracy: 90, pp: 10,
    desc: '夢の欠片を撒く。眠りの相手に威力2倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'doubleVsStatus', statuses: ['slp'] }
    ]
  },
  'ゆばばのじゅもん': {
    name: 'ゆばばのじゅもん', type: 'げんそう', category: 'special',
    power: 80, accuracy: 90, pp: 10,
    desc: '強力な呪文。50%混乱。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'confuse' }
    ]
  },
  'チーばのかんとく': {
    name: 'チーばのかんとく', type: 'げんそう', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '状態異常回復+HP25%回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'cureStatus' },
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 25 }
    ]
  },
  'よびこみのじゅもん': {
    name: 'よびこみのじゅもん', type: 'げんそう', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '呪いのフィールド。毎ターン全員1/16ダメージ。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setField', field: 'hazard', value: true }
    ]
  },
  'ふうじられたわざ': {
    name: 'ふうじられたわざ', type: 'げんそう', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '100%相手の技を1つ3ターン封じる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'disable', value: 3 }
    ]
  },
  'げんそうのきり': {
    name: 'げんそうのきり', type: 'げんそう', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '幻想の霧。30%混乱。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'confuse' }
    ]
  },
  '5おくねんのあくむ': {
    name: '5おくねんのあくむ', type: 'げんそう', category: 'status',
    power: 0, accuracy: 90, pp: 5,
    desc: '5億年の恐怖。100%1〜3ターン眠らせる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'slp' }
    ]
  },
  'げんそうバースト': {
    name: 'げんそうバースト', type: 'げんそう', category: 'special',
    power: 110, accuracy: 85, pp: 5,
    desc: '幻想の爆発。20%とくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'まぼろしのひかり': {
    name: 'まぼろしのひかり', type: 'げんそう', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '幻の光で100%相手を混乱させる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'confuse' }
    ]
  },
  'げんそうドレイン': {
    name: 'げんそうドレイン', type: 'げんそう', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '幻想の力を吸い取る。与ダメの50%回復。',
    drain: 50,
    effect: []
  },

  // =============================================================
  //  しゃっきんタイプ
  // =============================================================
  'しゃっきんとりたて': {
    name: 'しゃっきんとりたて', type: 'しゃっきん', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '借金を取り立てる。30%こうげきDOWN。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 }
    ]
  },
  'りそくがふえる': {
    name: 'りそくがふえる', type: 'しゃっきん', category: 'special',
    power: 40, accuracy: 100, pp: 20,
    desc: '利息増加。使うたびに威力が倍（最大640）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'growingPower', value: 0, mult: 2, max: 640 }
    ]
  },
  'ふさいのくさり': {
    name: 'ふさいのくさり', type: 'しゃっきん', category: 'status',
    power: 0, accuracy: 90, pp: 10,
    desc: '負債の鎖。100%相手は逃げられず毎ターンHP1/8ダメージ。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'setFlag', flag: 'trapped', value: true },
      { trigger: 'use', chance: 100, target: 'enemy', action: 'curse' }
    ]
  },
  'さいむちょうかくレイ': {
    name: 'さいむちょうかくレイ', type: 'しゃっきん', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: '債務超過の光。使用後とくこう2段階DOWN（自分）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: -2 }
    ]
  },
  'たんぽアタック': {
    name: 'たんぽアタック', type: 'しゃっきん', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '担保を回収する一撃。100%持ち物を奪う。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'knockOff' }
    ]
  },
  'ばくさいバースト': {
    name: 'ばくさいバースト', type: 'しゃっきん', category: 'special',
    power: 150, accuracy: 80, pp: 5,
    desc: '爆砕。使用後HPが1になる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'setHp', value: 1 }
    ]
  },

  // =============================================================
  //  しゃかいタイプ
  // =============================================================
  'しゃかいのあつりょく': {
    name: 'しゃかいのあつりょく', type: 'しゃかい', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '社会的圧力。30%とくこうDOWN。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },
  'どうちょうあつりょく': {
    name: 'どうちょうあつりょく', type: 'しゃかい', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '同調圧力。100%相手は3ターンの間変化技を使えない。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'taunt', value: 3 }
    ]
  },
  'コンプライアンス': {
    name: 'コンプライアンス', type: 'しゃかい', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '法令遵守。100%ぼうぎょ・とくぼう2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 2 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 2 }
    ]
  },
  'ざんぎょうアタック': {
    name: 'ざんぎょうアタック', type: 'しゃかい', category: 'physical',
    power: 90, accuracy: 95, pp: 10, contact: true,
    desc: '残業のストレス。100%すばやさDOWN（自分）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'しゃかいのかべ': {
    name: 'しゃかいのかべ', type: 'しゃかい', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '社会の壁。5ターン物理・特殊ダメ半減。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'auroraVeil', turns: 5 }
    ]
  },
  'けいざいはたん': {
    name: 'けいざいはたん', type: 'しゃかい', category: 'special',
    power: 120, accuracy: 85, pp: 5,
    desc: '経済破綻。100%全場の能力変化リセット+ダメージ。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'self', action: 'clearStatChanges' },
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'clearStatChanges' }
    ]
  },

  // =============================================================
  //  キャラ固有技・汎用追加技
  // =============================================================
  'いっぴつがきアタック': {
    name: 'いっぴつがきアタック', type: 'ぷゆ', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '一筆書きの全身攻撃。',
    effect: []
  },
  'せんべいスロー': {
    name: 'せんべいスロー', type: 'ノーマル', category: 'physical',
    power: 50, accuracy: 100, pp: 25,
    desc: 'せんべいを投げつける。',
    effect: []
  },
  'クッキークラッシュ': {
    name: 'クッキークラッシュ', type: 'ノーマル', category: 'physical',
    power: 65, accuracy: 100, pp: 20,
    desc: 'クッキーで殴る。10%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'flinch' }
    ]
  },
  'レモンスプラッシュ': {
    name: 'レモンスプラッシュ', type: 'くさ', category: 'special',
    power: 55, accuracy: 100, pp: 20,
    desc: 'レモン汁を浴びせる。30%命中率DOWN。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'statChange', stat: 'acc', stage: -1 }
    ]
  },
  'コインフリップ': {
    name: 'コインフリップ', type: 'ノーマル', category: 'special',
    power: 1, accuracy: 100, pp: 10,
    desc: 'コイントス。表なら威力100、裏なら自分に50ダメージ。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'coinFlip', hitPower: 100, missDamage: 50 }
    ]
  },
  'バスケットシュート': {
    name: 'バスケットシュート', type: 'ノーマル', category: 'physical',
    power: 80, accuracy: 85, pp: 15,
    desc: 'ボールをシュート。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'フラワーバースト': {
    name: 'フラワーバースト', type: 'くさ', category: 'special',
    power: 75, accuracy: 100, pp: 15,
    desc: '花弁を飛ばす。相手がくさタイプなら威力2倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'doubleVsType', vsType: 'くさ' }
    ]
  },
  'クロックストライク': {
    name: 'クロックストライク', type: 'ノーマル', category: 'physical',
    power: 1, accuracy: 100, pp: 5,
    desc: '時計の針。ターン数×15のダメージ。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'turnDamage', multiplier: 15 }
    ]
  },
  'ディスクスラッシュ': {
    name: 'ディスクスラッシュ', type: 'はがね', category: 'physical',
    power: 70, accuracy: 95, pp: 15,
    desc: 'ディスクを飛ばす。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'おうかんのいちげき': {
    name: 'おうかんのいちげき', type: 'ぷゆ', category: 'physical',
    power: 100, accuracy: 100, pp: 5, contact: true,
    desc: '王冠の一撃。20%全能力1段階DOWN（相手）。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 },
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 },
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 },
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 },
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'spe', stage: -1 }
    ]
  },
  'クイーンズコマンド': {
    name: 'クイーンズコマンド', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '女王の命令。100%こうげき・とくこう・すばやさ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'レンジャーストライク': {
    name: 'レンジャーストライク', type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: 'レンジャーの一撃。',
    effect: []
  },
  'レンジャーコンボ': {
    name: 'レンジャーコンボ', type: 'ぷゆ', category: 'physical',
    power: 25, accuracy: 100, pp: 10,
    desc: 'レンジャー連携。6回攻撃。',
    fixedHits: 6,
    effect: []
  },
  'きずのいたみ': {
    name: 'きずのいたみ', type: 'ぷゆ', category: 'physical',
    power: 60, accuracy: 100, pp: 20, contact: true,
    desc: '傷の痛みで攻撃。',
    effect: []
  },
  'ミステリアスショット': {
    name: 'ミステリアスショット', type: 'げんそう', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '不思議な弾。追加効果がランダム。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'randomSecondary' }
    ]
  },
  'ふういんかいほう': {
    name: 'ふういんかいほう', type: 'げんそう', category: 'special',
    power: 100, accuracy: 95, pp: 5,
    desc: '封印を解放して攻撃。使用後100%全能力1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'なるとスピン': {
    name: 'なるとスピン', type: 'ぷゆ', category: 'physical',
    power: 50, accuracy: 100, pp: 25,
    desc: '渦巻き回転攻撃。まきびし・ステルストラップを除去。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'field', action: 'rapidSpin' }
    ]
  },
  '5おくねんボタン': {
    name: '5おくねんボタン', type: 'エスパー', category: 'status',
    power: 0, accuracy: 100, pp: 5,
    desc: '5億年ボタン。相手を1ターン行動不能にするが自分も動けない。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'setFlag', flag: 'flinch', value: true },
      { trigger: 'use', chance: 100, target: 'self', action: 'recharge' }
    ]
  },
  'にゃざーるのまもり': {
    name: 'にゃざーるのまもり', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '邪視のお守り。5ターンの間状態異常を防ぐ。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setField', field: 'safeguard', value: 5 }
    ]
  },
  'くろぷゆアタック': {
    name: 'くろぷゆアタック', type: 'しれい', category: 'physical',
    power: 40, accuracy: 100, pp: 20,
    desc: '黒ぷゆ兵士の突撃。2回攻撃。',
    fixedHits: 2,
    effect: []
  },
  '3Dプリント': {
    name: '3Dプリント', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '自分の分身を作る（みがわり）。HP1/4消費。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'substitute' }
    ]
  },
  'コンパスナビ': {
    name: 'コンパスナビ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '方角を読む。100%命中率・回避率1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'acc', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'eva', stage: 1 }
    ]
  },
  'けんえつビーム': {
    name: 'けんえつビーム', type: 'あく', category: 'special',
    power: 75, accuracy: 100, pp: 15,
    desc: '検閲の光。100%相手の最後の技を3ターン封印。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'disable', value: 3 }
    ]
  },
  'ちんもくのくうかん': {
    name: 'ちんもくのくうかん', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '沈黙の空間。5ターン音技を無効化。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setField', field: 'soundproof', value: 5 }
    ]
  },
  'はかせのこうぎ': {
    name: 'はかせのこうぎ', type: 'エスパー', category: 'special',
    power: 60, accuracy: 100, pp: 20,
    desc: '博士の講義。100%とくこうUP（自分）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 }
    ]
  },
  'スモールショット': {
    name: 'スモールショット', type: 'ぷゆ', category: 'special',
    power: 30, accuracy: 100, pp: 35, priority: 1,
    desc: '小さな弾。必ず先制。',
    effect: []
  },
  'とうめいアタック': {
    name: 'とうめいアタック', type: 'ゴースト', category: 'physical',
    power: 70, accuracy: 0, pp: 20, contact: true,
    desc: '透明からの攻撃。必中。',
    effect: []
  },
  'クリーチャーハウル': {
    name: 'クリーチャーハウル', type: 'ぷゆ', category: 'special',
    power: 90, accuracy: 95, pp: 10, sound: true,
    desc: 'クリーチャーの咆哮。20%ひるみ。音技。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'flinch' }
    ]
  },
  'せんのうウェーブ': {
    name: 'せんのうウェーブ', type: 'エスパー', category: 'special',
    power: 65, accuracy: 90, pp: 15,
    desc: '洗脳の波。50%混乱。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'confuse' }
    ]
  },
  'しゃりんのいかり': {
    name: 'しゃりんのいかり', type: 'はがね', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '車輪の回転攻撃。100%使用後すばやさ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'はぐるまかみあい': {
    name: 'はぐるまかみあい', type: 'はがね', category: 'physical',
    power: 50, accuracy: 100, pp: 20, contact: true,
    desc: '歯車の噛み合い。100%で2〜5ターン束縛。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'trap', min: 2, max: 5 }
    ]
  },
  'しょっかくセンサー': {
    name: 'しょっかくセンサー', type: 'むし', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '触覚で偵察。100%相手の情報を全て見る+回避率UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'revealAll' },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'eva', stage: 1 }
    ]
  },
  'ぼうけんのきぼう': {
    name: 'ぼうけんのきぼう', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '冒険の希望。100%こうげき・すばやさ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'ハジハジプレス': {
    name: 'ハジハジプレス', type: 'ぷゆ', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true,
    desc: 'はじはじの力で押しつぶす。100%こうげき・とくこうDOWN（相手）。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 },
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },
  'ぴえんボイス': {
    name: 'ぴえんボイス', type: 'ぷゆ', category: 'special',
    power: 55, accuracy: 100, pp: 20, sound: true,
    desc: 'ぴえんの声。100%とくこうDOWN（相手）。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },
  'とくこアタック': {
    name: 'とくこアタック', type: 'ぷゆ', category: 'physical',
    power: 60, accuracy: 100, pp: 25, contact: true,
    desc: '徹子の突進。100%こうげき1段階UP（自分）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 }
    ]
  },
  'ペンギンスライド': {
    name: 'ペンギンスライド', type: 'こおり', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: 'ペンギンのスライディング。100%すばやさUP（自分）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'はっこうパルス': {
    name: 'はっこうパルス', type: 'でんき', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: 'ひらめきの光。50%とくこうUP（自分）。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'self', action: 'statChange', stat: 'spa', stage: 1 }
    ]
  },
  'ハロウィンフレイム': {
    name: 'ハロウィンフレイム', type: 'ゴースト', category: 'special',
    power: 85, accuracy: 100, pp: 10,
    desc: 'ハロウィンの炎。20%やけど。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'サイクロプスビーム': {
    name: 'サイクロプスビーム', type: 'ほのお', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: '一つ目から放つ灼熱光線。30%やけど。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'inflictStatus', status: 'brn' }
    ]
  },
  'くさったいき': {
    name: 'くさったいき', type: 'どく', category: 'special',
    power: 70, accuracy: 90, pp: 15,
    desc: '腐った息。50%どく。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'inflictStatus', status: 'psn' }
    ]
  },
  'まっぷたつ': {
    name: 'まっぷたつ', type: 'ノーマル', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '真っ二つに斬る。ぼうぎょを無視してダメージ。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'ignoreDefense' }
    ]
  },
  'ひみつのちから': {
    name: 'ひみつのちから', type: 'げんそう', category: 'special',
    power: 70, accuracy: 100, pp: 20,
    desc: '秘密の力。30%で追加効果ランダム。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'randomSecondary' }
    ]
  },
  'おじょうさまビーム': {
    name: 'おじょうさまビーム', type: 'フェアリー', category: 'special',
    power: 85, accuracy: 100, pp: 10,
    desc: 'お嬢様の優雅な光線。30%とくこうDOWN（相手）。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },
  'ぶらうざクラッシュ': {
    name: 'ぶらうざクラッシュ', type: 'カオス', category: 'special',
    power: 75, accuracy: 80, pp: 10,
    desc: 'ブラウザがクラッシュする衝撃。30%混乱。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'confuse' }
    ]
  },
  'うまのいななき': {
    name: 'うまのいななき', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 20, sound: true,
    desc: '馬のいななき。100%こうげき1段階UP（自分）+こうげきDOWN（相手）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 }
    ]
  },
  'くりのからショット': {
    name: 'くりのからショット', type: 'くさ', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '栗のイガを飛ばす。',
    effect: []
  },
  'えがおのちから': {
    name: 'えがおのちから', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '笑顔の力。100%全能力1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'def', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spd', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'ODブレイク': {
    name: 'ODブレイク', type: 'ノーマル', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true,
    desc: 'O.D.の突撃。20%こうげきUP（自分）。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'self', action: 'statChange', stat: 'atk', stage: 1 }
    ]
  },
  'たかしのテレパシー': {
    name: 'たかしのテレパシー', type: 'エスパー', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '宇宙人のテレパシー。20%とくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'シコリエルのつばさ': {
    name: 'シコリエルのつばさ', type: 'ひこう', category: 'physical',
    power: 85, accuracy: 100, pp: 10, contact: true,
    desc: '天使の翼で打つ。10%全能力UP（自分）。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'hit', chance: 10, target: 'self', action: 'statChange', stat: 'def', stage: 1 },
      { trigger: 'hit', chance: 10, target: 'self', action: 'statChange', stat: 'spa', stage: 1 },
      { trigger: 'hit', chance: 10, target: 'self', action: 'statChange', stat: 'spd', stage: 1 },
      { trigger: 'hit', chance: 10, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'あくまのツメ': {
    name: 'あくまのツメ', type: 'あく', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '悪魔の爪。20%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'flinch' }
    ]
  },
  'サツガイラッシュ': {
    name: 'サツガイラッシュ', type: 'しれい', category: 'physical',
    power: 30, accuracy: 100, pp: 15, contact: true,
    desc: 'サツガイの連撃。3回攻撃。',
    fixedHits: 3,
    effect: []
  },
  'ジェネリックコピー': {
    name: 'ジェネリックコピー', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '相手の技を1つコピーして使う（PP5）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'mimic' }
    ]
  },
  'ダークサイドフォース': {
    name: 'ダークサイドフォース', type: 'あく', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '暗黒面の力。HP1/2以下で威力2倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'pinchBoost', threshold: 0.5, mult: 2.0 }
    ]
  },
  'ライトニングオーラ': {
    name: 'ライトニングオーラ', type: 'でんき', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '光のオーラで攻撃。10%まひ。10%自分すばやさUP。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'inflictStatus', status: 'par' },
      { trigger: 'hit', chance: 10, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'リングスロー': {
    name: 'リングスロー', type: 'ノーマル', category: 'physical',
    power: 55, accuracy: 90, pp: 20,
    desc: 'リングを投げつける。2回攻撃。',
    fixedHits: 2,
    effect: []
  },
  'ホワイトリング': {
    name: 'ホワイトリング', type: 'フェアリー', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '白い輪の光。20%とくぼうUP（自分）。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'self', action: 'statChange', stat: 'spd', stage: 1 }
    ]
  },
  'ぱくちんパンチ': {
    name: 'ぱくちんパンチ', type: 'かくとう', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true, punch: true,
    desc: '朴ちんの怒りのパンチ。10%混乱。',
    effect: [
      { trigger: 'hit', chance: 10, target: 'enemy', action: 'confuse' }
    ]
  },
  'ひらめきフラッシュ': {
    name: 'ひらめきフラッシュ', type: 'でんき', category: 'special',
    power: 75, accuracy: 100, pp: 15,
    desc: 'ひらめきの閃光。50%とくこうUP（自分）。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'self', action: 'statChange', stat: 'spa', stage: 1 }
    ]
  },
  'さつじんきのナイフ': {
    name: 'さつじんきのナイフ', type: 'あく', category: 'physical',
    power: 90, accuracy: 95, pp: 10, contact: true,
    desc: '殺人鬼のナイフ。確定急所。',
    alwaysCrit: true,
    effect: []
  },
  'マツモトキック': {
    name: 'マツモトキック', type: 'かくとう', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: 'まつもとさんのキック。',
    effect: []
  },
  'マツモトおばちゃんビンタ': {
    name: 'マツモトおばちゃんビンタ', type: 'ノーマル', category: 'physical',
    power: 25, accuracy: 85, pp: 10, contact: true,
    desc: '2〜5回ビンタ。',
    multiHit: [2, 5],
    effect: []
  },
  'はかいしんのけん': {
    name: 'はかいしんのけん', type: 'ハイパー', category: 'physical',
    power: 120, accuracy: 90, pp: 5, contact: true,
    desc: '破壊神の拳。20%ぼうぎょDOWN（相手）。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'def', stage: -1 }
    ]
  },
  'さとりのいちげき': {
    name: 'さとりのいちげき', type: 'エスパー', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true,
    desc: '悟りの一撃。相手の回避率無視。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'ignoreEvasion' }
    ]
  },
  'たいようのめぐみ': {
    name: 'たいようのめぐみ', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '太郎の恵み。HP1/2回復し状態異常も治す。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 50 },
      { trigger: 'use', chance: 100, target: 'self', action: 'cureStatus' }
    ]
  },
  'トランスチェンジ': {
    name: 'トランスチェンジ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'こうげきととくこうの実数値を入れ替える。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'swapAtkSpa' }
    ]
  },
  'しゃかいじんのつとめ': {
    name: 'しゃかいじんのつとめ', type: 'しゃかい', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true,
    desc: '社会人の務め。毎ターン使うと威力+10（最大200）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'growingPower', value: 10, max: 200 }
    ]
  },
  'アンノーンパルス': {
    name: 'アンノーンパルス', type: 'げんそう', category: 'special',
    power: 60, accuracy: 100, pp: 20,
    desc: '未知の波動。タイプがランダムに変わる。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'randomMoveType' }
    ]
  },
  'うゆゆのうた': {
    name: 'うゆゆのうた', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 55, pp: 15, sound: true,
    desc: '不思議な歌で相手を眠らせる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'slp' }
    ]
  },
  'にせものアタック': {
    name: 'にせものアタック', type: 'あく', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '偽物の攻撃。相手の最後に使った技をコピー。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'self', action: 'copyLastMove' }
    ]
  },
  'ほんもののちから': {
    name: 'ほんもののちから', type: 'ぷゆ', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '本物の力。効果抜群の倍率がさらにUP。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'superEffectBoost', mult: 1.5 }
    ]
  },
  'きょうふのかお': {
    name: 'きょうふのかお', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '恐怖の顔。すばやさ2段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'spe', stage: -2 }
    ]
  },
  'むてきのえがお': {
    name: 'むてきのえがお', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '無敵の笑顔。相手のこうげき2段階DOWN。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'statChange', stat: 'atk', stage: -2 }
    ]
  },
  'ぼくちんのゆうき': {
    name: 'ぼくちんのゆうき', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: 'ぼくちんの勇気。HP1/4以下で全能力2段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'pinchAllUp', threshold: 0.25, stage: 2 }
    ]
  },
  'おうごんパンチ': {
    name: 'おうごんパンチ', type: 'ぷゆ', category: 'physical',
    power: 100, accuracy: 95, pp: 5, contact: true, punch: true,
    desc: '黄金の拳。20%でこうげきUP（自分）。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'self', action: 'statChange', stat: 'atk', stage: 1 }
    ]
  },
  'パブロのほりあげ': {
    name: 'パブロのほりあげ', type: 'じめん', category: 'physical',
    power: 80, accuracy: 100, pp: 15,
    desc: 'スコップで掘り上げる。空を飛んでいる相手にも当たる。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'hitFlying' }
    ]
  },
  'しんかのひかり': {
    name: 'しんかのひかり', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '進化の光。こうげき・とくこう・すばやさ1段階UP。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'atk', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spa', stage: 1 },
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'にんじゃきりさき': {
    name: 'にんじゃきりさき', type: 'あく', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '忍者の斬撃。急所率UP。100%すばやさ1段階UP（自分）。',
    critRateBonus: 1,
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'にんじゃしゅりけん': {
    name: 'にんじゃしゅりけん', type: 'あく', category: 'physical',
    power: 15, accuracy: 100, pp: 20, priority: 1,
    desc: '忍者の手裏剣。2〜5回先制攻撃。',
    multiHit: [2, 5],
    effect: []
  },
  'さいぼうぶんれつ': {
    name: 'さいぼうぶんれつ', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '自分のHP30%を消費してみがわりを作る。みがわりのHPは消費分と同じ。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'cellSplitSub', value: 30 }
    ]
  },
  'じかんのほうてき': {
    name: 'じかんのほうてき', type: 'エスパー', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '時間の法則。ターン数に応じて威力UP（最大200）。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'turnDamage', multiplier: 10, base: 80, max: 200 }
    ]
  },
  'ぷゆゆゼロ': {
    name: 'ぷゆゆゼロ', type: 'ぷゆ', category: 'special',
    power: 100, accuracy: 100, pp: 5,
    desc: 'ゼロの力で攻撃。100%相手と自分の能力変化リセット。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'self', action: 'clearStatChanges' },
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'clearStatChanges' }
    ]
  },
  'ぷゆムーンレイ': {
    name: 'ぷゆムーンレイ', type: 'ぷゆ', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '月光のビーム。30%でとくぼうDOWN（相手）。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'ロールシャッハインク': {
    name: 'ロールシャッハインク', type: 'エスパー', category: 'special',
    power: 65, accuracy: 100, pp: 15,
    desc: 'インクを投げつける。50%で混乱 or 50%でこうげきDOWN。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'confuse' },
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 }
    ]
  },
  'くろきりのいちげき': {
    name: 'くろきりのいちげき', type: 'ゴースト', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '黒霧からの一撃。100%回避率1段階UP（自分）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'eva', stage: 1 }
    ]
  },
  'だれのこうげき': {
    name: 'だれのこうげき', type: 'ゴースト', category: 'special',
    power: 75, accuracy: 100, pp: 15,
    desc: '正体不明の攻撃。追加効果がランダム。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'randomSecondary' }
    ]
  },
  'ぷゆばばのじゅもん': {
    name: 'ぷゆばばのじゅもん', type: 'げんそう', category: 'special',
    power: 85, accuracy: 90, pp: 10,
    desc: 'ぷ湯婆婆の呪文。50%で混乱。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'confuse' }
    ]
  },
  'うんこスプラッシュ': {
    name: 'うんこスプラッシュ', type: 'どく', category: 'special',
    power: 85, accuracy: 90, pp: 10,
    desc: '汚物攻撃。100%どく。フィールドにどくびしを1枚まく。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'inflictStatus', status: 'psn' },
      { trigger: 'hit', chance: 100, target: 'field', action: 'setField', field: 'toxicSpikes', value: 1 }
    ]
  },
  'たかしのUFO': {
    name: 'たかしのUFO', type: 'ひこう', category: 'special',
    power: 90, accuracy: 95, pp: 10,
    desc: 'UFOからのビーム。20%で混乱。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'confuse' }
    ]
  },
  'てんしのはね': {
    name: 'てんしのはね', type: 'フェアリー', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '天使の羽根。HP1/2回復し状態異常も治す。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'healPercent', value: 50 },
      { trigger: 'use', chance: 100, target: 'self', action: 'cureStatus' }
    ]
  },
  'あくまのけいやくしょ': {
    name: 'あくまのけいやくしょ', type: 'あく', category: 'special',
    power: 110, accuracy: 90, pp: 5,
    desc: '悪魔の契約書。50%で相手の特性を無効化する。',
    effect: [
      { trigger: 'hit', chance: 50, target: 'enemy', action: 'setFlag', flag: 'abilityDisabled', value: true }
    ]
  },
  'くりのいがショット': {
    name: 'くりのいがショット', type: 'くさ', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '栗のイガを飛ばす。接触した相手に追加ダメージ。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'contactDamage', value: 8 }
    ]
  },
  'にっけいぷゆキック': {
    name: 'にっけいぷゆキック', type: 'かくとう', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true,
    desc: '日系人の蹴り。',
    effect: []
  },
  'ぼうつきぷゆアタック': {
    name: 'ぼうつきぷゆアタック', type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '棒つきの全身攻撃。急所率UP。',
    critRateBonus: 1,
    effect: []
  },
  'ファンタストビーム': {
    name: 'ファンタストビーム', type: 'げんそう', category: 'special',
    power: 90, accuracy: 95, pp: 10,
    desc: 'ファンタストの光線。20%でとくぼうDOWN。',
    effect: [
      { trigger: 'hit', chance: 20, target: 'enemy', action: 'statChange', stat: 'spd', stage: -1 }
    ]
  },
  'にんにくバースト': {
    name: 'にんにくバースト', type: 'くさ', category: 'special',
    power: 80, accuracy: 95, pp: 10,
    desc: 'にんにくの臭気で攻撃。30%でこうげきDOWN（相手）。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'statChange', stat: 'atk', stage: -1 }
    ]
  },
  'ペンギンダイブ': {
    name: 'ペンギンダイブ', type: 'こおり', category: 'physical',
    power: 85, accuracy: 100, pp: 10, contact: true,
    desc: 'ペンギン博士の飛び込み。100%すばやさ1段階UP（自分）。',
    effect: [
      { trigger: 'use', chance: 100, target: 'self', action: 'statChange', stat: 'spe', stage: 1 }
    ]
  },
  'ぼうしトリック': {
    name: 'ぼうしトリック', type: 'エスパー', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '帽子を使ったトリック。100%相手と自分の持ち物を入れ替える。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'swapItems' }
    ]
  },
  'いみんのちから': {
    name: 'いみんのちから', type: 'かくとう', category: 'physical',
    power: 85, accuracy: 100, pp: 10, contact: true,
    desc: '移民の底力。HP1/2以下で威力1.5倍。',
    effect: [
      { trigger: 'always', chance: 100, target: 'self', action: 'pinchBoost', threshold: 0.5, mult: 1.5 }
    ]
  },
  'ふういんのもんしょう': {
    name: 'ふういんのもんしょう', type: 'げんそう', category: 'status',
    power: 0, accuracy: 100, pp: 5,
    desc: '封印の紋章。100%相手の技を2つ3ターン封じる。',
    effect: [
      { trigger: 'use', chance: 100, target: 'enemy', action: 'disableTwo', value: 3 }
    ]
  },
  'ぴえんのなみだ': {
    name: 'ぴえんのなみだ', type: 'みず', category: 'special',
    power: 75, accuracy: 100, pp: 15,
    desc: 'ぴえんの大粒の涙。100%とくこうDOWN（相手）。',
    effect: [
      { trigger: 'hit', chance: 100, target: 'enemy', action: 'statChange', stat: 'spa', stage: -1 }
    ]
  },
  'とくこのへや': {
    name: 'とくこのへや', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '徹子の部屋。5ターンの間味方のHP1/16毎ターン回復。',
    effect: [
      { trigger: 'use', chance: 100, target: 'field', action: 'setField', field: 'healingRoom', value: 5 }
    ]
  },
  'うまのひづめ': {
    name: 'うまのひづめ', type: 'じめん', category: 'physical',
    power: 85, accuracy: 95, pp: 10, contact: true,
    desc: '馬の蹄で蹴る。30%ひるみ。',
    effect: [
      { trigger: 'hit', chance: 30, target: 'enemy', action: 'flinch' }
    ]
  },
};

// =====================================================
// ユーティリティ
// =====================================================
function getMoveNames() {
  return Object.keys(MOVES);
}
