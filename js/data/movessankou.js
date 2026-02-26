 // =====================================================
// ぷゆモン - 技データ (完全オリジナル版)
// =====================================================

const MOVES = {

  // =============================================================
  //  ぷゆタイプ (50技)
  // =============================================================
  'ぷゆぷゆビーム': {
    name: 'ぷゆぷゆビーム', type: 'ぷゆ', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: 'ぷゆぷゆエネルギーを収束して放つ。10%で混乱。',
    effect: 'confuse10'
  },
  'ぷゆぷゆキャノン': {
    name: 'ぷゆぷゆキャノン', type: 'ぷゆ', category: 'special',
    power: 120, accuracy: 90, pp: 5,
    desc: '全力のぷゆ砲。使用後とくこうが2段階下がる。',
    effect: 'spaDrop2'
  },
  'ぷゆぷゆスマッシュ': {
    name: 'ぷゆぷゆスマッシュ', type: 'ぷゆ', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: 'ぷゆパワーで叩く。50%でぼうぎょ1段階DOWN。',
    effect: 'defDrop50'
  },
  'ぷゆぷゆシールド': {
    name: 'ぷゆぷゆシールド', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: 'ぷゆオーラの盾。ぼうぎょ・とくぼう1段階UP。',
    effect: 'raiseBothDef', target: 'self'
  },
  'ぷゆぷゆアロー': {
    name: 'ぷゆぷゆアロー', type: 'ぷゆ', category: 'special',
    power: 40, accuracy: 100, pp: 30, priority: 1,
    desc: '先制で放つぷゆの矢。優先度+1。',
  },
  'えがおアタック': {
    name: 'えがおアタック', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: '笑顔で相手のこうげき・とくこうを1段階下げる。',
    effect: 'lowerAtkSpa1', target: 'enemy'
  },
  'よみがえりのひかり': {
    name: 'よみがえりのひかり', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: 'HP50%回復し状態異常も治す。',
    effect: 'healHalf', target: 'self'
  },
  'ぷゆぷゆのあらし': {
    name: 'ぷゆぷゆのあらし', type: 'ぷゆ', category: 'special',
    power: 110, accuracy: 70, pp: 5,
    desc: 'ぷゆエネルギーの嵐。高火力だが命中不安。',
  },
  'ぷゆぷゆダンス': {
    name: 'ぷゆぷゆダンス', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '全能力を1段階上げる踊り。',
    effect: 'raiseAll1', target: 'self'
  },
  'ぷゆゆキック': {
    name: 'ぷゆゆキック', type: 'ぷゆ', category: 'physical',
    power: 75, accuracy: 100, pp: 20, contact: true,
    desc: 'ぷゆゆ流の蹴り。急所に当たりやすい。',
    effect: 'highCrit'
  },
  'ぷゆコメット': {
    name: 'ぷゆコメット', type: 'ぷゆ', category: 'special',
    power: 25, accuracy: 90, pp: 15,
    desc: 'ぷゆの星くずを3〜5回飛ばす。',
    effect: 'multihit35'
  },
  'ぷゆゆドレイン': {
    name: 'ぷゆゆドレイン', type: 'ぷゆ', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: 'ぷゆオーラを吸い取る。与えたダメージの半分HP回復。',
    drain: 50
  },
  'ぷゆフレア': {
    name: 'ぷゆフレア', type: 'ぷゆ', category: 'special',
    power: 65, accuracy: 100, pp: 15,
    desc: 'ぷゆの炎で包む。20%でやけど。',
    effect: 'burn20'
  },
  'ぷゆバリア': {
    name: 'ぷゆバリア', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '5ターンの間とくしゅダメージを半減する壁を張る。',
    effect: 'lightScreen5', target: 'field'
  },
  'ぷゆリフレクト': {
    name: 'ぷゆリフレクト', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '5ターンの間ぶつりダメージを半減する壁を張る。',
    effect: 'reflect5', target: 'field'
  },
  'ぷゆウェーブ': {
    name: 'ぷゆウェーブ', type: 'ぷゆ', category: 'special',
    power: 0, accuracy: 100, pp: 15,
    desc: 'ぷゆの波動。HPが少ないほど威力UP（最大200）。',
    effect: 'reversal'
  },
  'ぷゆブレイド': {
    name: 'ぷゆブレイド', type: 'ぷゆ', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true,
    desc: 'ぷゆオーラの刃で斬る。急所に当たりやすい。',
    effect: 'highCrit'
  },
  'ぷゆオーバードライブ': {
    name: 'ぷゆオーバードライブ', type: 'ぷゆ', category: 'special',
    power: 140, accuracy: 85, pp: 5,
    desc: '限界突破のぷゆ砲。使うと全能力1段階DOWN。',
    effect: 'lowerAllSelf1'
  },
  'ぷゆムーンライト': {
    name: 'ぷゆムーンライト', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '月の光を浴びてHP回復。晴れなら2/3回復。',
    effect: 'moonlight', target: 'self'
  },
  'ぷゆぷゆのあまえ': {
    name: 'ぷゆぷゆのあまえ', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: 'あまえて相手のこうげきを2段階下げる。',
    effect: 'lowerAtk2', target: 'enemy'
  },
  'ぷゆニードル': {
    name: 'ぷゆニードル', type: 'ぷゆ', category: 'physical',
    power: 25, accuracy: 100, pp: 25,
    desc: 'ぷゆの針を2〜5回刺す。',
    effect: 'multihit25'
  },
  'ぷゆトルネード': {
    name: 'ぷゆトルネード', type: 'ぷゆ', category: 'special',
    power: 85, accuracy: 95, pp: 10,
    desc: 'ぷゆの竜巻。相手のみがわりを破壊する。',
    effect: 'pierceSub'
  },
  'ぷゆぷゆのいのり': {
    name: 'ぷゆぷゆのいのり', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '祈りの力でHP2/3回復。',
    effect: 'healTwoThird', target: 'self'
  },
  'ぷゆスパーク': {
    name: 'ぷゆスパーク', type: 'ぷゆ', category: 'special',
    power: 55, accuracy: 100, pp: 20,
    desc: 'ぷゆの火花。10%でまひ。',
    effect: 'paralyze10'
  },
  'ぷゆチャージ': {
    name: 'ぷゆチャージ', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: 'ぷゆのエネルギーをためる。次のぷゆ技の威力2倍。',
    effect: 'chargeNext', target: 'self'
  },

  // --- ぷゆタイプ：キャラ固有技 ---
  'えへへのわらい': {
    name: 'えへへのわらい', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: '笑わせて同じ技しか出せなくする（3ターン）。',
    effect: 'encore', target: 'enemy'
  },
  'くすくすわらい': {
    name: 'くすくすわらい', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 85, pp: 20,
    desc: 'くすくす笑って相手を混乱させる。',
    effect: 'confuse100', target: 'enemy'
  },
  'およよのさけび': {
    name: 'およよのさけび', type: 'ぷゆ', category: 'special',
    power: 50, accuracy: 100, pp: 25, sound: true,
    desc: '驚きの叫び。20%でひるむ。音技。',
    effect: 'flinch20'
  },
  'てりりのいかり': {
    name: 'てりりのいかり', type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: '怒りの力で攻撃。',
  },
  'おんたこのいかり': {
    name: 'おんたこのいかり', type: 'ぷゆ', category: 'special',
    power: 100, accuracy: 90, pp: 10,
    desc: '怒り狂って攻撃。使うたびこうげき・とくこう1段階UP。',
    effect: 'rageAtk'
  },
  'マルクのたいほう': {
    name: 'マルクのたいほう', type: 'ぷゆ', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: 'ぷゆ大砲。30%で混乱。',
    effect: 'confuse30'
  },
  'ゴシゴシあらう': {
    name: 'ゴシゴシあらう', type: 'ぷゆ', category: 'physical',
    power: 65, accuracy: 100, pp: 20, contact: true,
    desc: 'ゴシゴシ洗い落とす。相手の能力変化をリセット。',
    effect: 'clearStatChanges'
  },
  'おちていくさだめ': {
    name: 'おちていくさだめ', type: 'ぷゆ', category: 'physical',
    power: 80, accuracy: 90, pp: 15,
    desc: '落ち続ける。使うたびに威力+10（最大200）。',
    effect: 'growingPower'
  },
  'げきおこメテオ': {
    name: 'げきおこメテオ', type: 'ぷゆ', category: 'special',
    power: 120, accuracy: 85, pp: 5,
    desc: '激怒の隕石。30%でひるみ。',
    effect: 'flinch30'
  },
  'ゼロポイントバースト': {
    name: 'ゼロポイントバースト', type: 'ぷゆ', category: 'special',
    power: 150, accuracy: 90, pp: 5,
    desc: '全てをゼロにする爆発。自分のHP半分が反動。',
    effect: 'recoilHalf'
  },
  'ゼロカノン': {
    name: 'ゼロカノン', type: 'ぷゆ', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: 'ゼロに帰す砲撃。相手の能力変化リセット+ダメージ。',
    effect: 'clearAndDmg'
  },
  'ヨーヨーアタック': {
    name: 'ヨーヨーアタック', type: 'ぷゆ', category: 'physical',
    power: 65, accuracy: 100, pp: 20,
    desc: 'ヨーヨーで2回攻撃。',
    effect: 'twiceHit'
  },
  'タイヤスピン': {
    name: 'タイヤスピン', type: 'ぷゆ', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '高速回転で攻撃。使うたびすばやさ1段階UP。',
    effect: 'speedUpEachUse'
  },
  'ちいさなきずぐち': {
    name: 'ちいさなきずぐち', type: 'ぷゆ', category: 'physical',
    power: 40, accuracy: 100, pp: 35, priority: 2,
    desc: '小さな傷。優先度+2。',
  },
  'スケルトンアタック': {
    name: 'スケルトンアタック', type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 100, pp: 20,
    desc: '骨格で攻撃。みがわり貫通。',
    effect: 'pierceSub'
  },
  'いんようのかい': {
    name: 'いんようのかい', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '陰陽の調和。こうげき・とくこう・ぼうぎょ・とくぼう1段階UP。',
    effect: 'raiseAtkDefSpaSped', target: 'self'
  },
  'パンケーキプレス': {
    name: 'パンケーキプレス', type: 'ぷゆ', category: 'physical',
    power: 90, accuracy: 95, pp: 10, contact: true,
    desc: '重さで押しつぶす。30%ですばやさDOWN。',
    effect: 'speDrop30'
  },
  'ミイラまき': {
    name: 'ミイラまき', type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 95, pp: 15, contact: true,
    desc: '包帯で巻きつける。50%ですばやさDOWN。',
    effect: 'speDrop50'
  },
  'ぷゆへんしん': {
    name: 'ぷゆへんしん', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'ぷゆ+あくタイプに変身しこうげき大幅UP。',
    effect: 'typeChange', target: 'self'
  },
  'すやすやレスト': {
    name: 'すやすやレスト', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '深く眠りHP全回復+全能力1段階UP。3ターン眠る。',
    effect: 'deepSleep', target: 'self'
  },
  'ムジュラのうた': {
    name: 'ムジュラのうた', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 85, pp: 5, sound: true,
    desc: '滅びの歌。3ターン後に相手は確定ひんし。',
    effect: 'countdown3'
  },
  'おでビーム': {
    name: 'おでビーム', type: 'ぷゆ', category: 'special',
    power: 110, accuracy: 95, pp: 10,
    desc: '地上最強のビーム。壁を貫通する。',
    effect: 'pierce'
  },
  'エグザイルの花道': {
    name: 'エグザイルの花道', type: 'ぷゆ', category: 'special',
    power: 85, accuracy: 95, pp: 10,
    desc: '移民の誇り。相手のぼうぎょ・とくぼう同時に1段階DOWN。',
    effect: 'lowerDefSpdef'
  },
  'しんかのちから': {
    name: 'しんかのちから', type: 'ぷゆ', category: 'special',
    power: 60, accuracy: 100, pp: 20,
    desc: '進化のエネルギー。急所率UP。',
    effect: 'highCrit'
  },

  // =============================================================
  //  ノーマルタイプ (40技)
  // =============================================================
  'たいあたり': {
    name: 'たいあたり', type: 'ノーマル', category: 'physical',
    power: 35, accuracy: 95, pp: 35, contact: true,
    desc: 'からだをぶつける基本技。',
  },
  'ひっかきまわす': {
    name: 'ひっかきまわす', type: 'ノーマル', category: 'physical',
    power: 40, accuracy: 100, pp: 35, contact: true,
    desc: '爪で引っかく。',
  },
  'とっしんアタック': {
    name: 'とっしんアタック', type: 'ノーマル', category: 'physical',
    power: 90, accuracy: 85, pp: 20, contact: true,
    desc: '全力で突進。反動ダメージ1/4。',
    effect: 'recoil25'
  },
  'にらみつけ': {
    name: 'にらみつけ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 30,
    desc: '鋭い目つきでぼうぎょ1段階DOWN。',
    effect: 'defDrop100', target: 'enemy'
  },
  'イノチノカガヤキ': {
    name: 'イノチノカガヤキ', type: 'ノーマル', category: 'special',
    power: 150, accuracy: 90, pp: 5,
    desc: '命の輝きを放つ究極光線。次ターン動けない。',
    effect: 'recharge'
  },
  'フルスイング': {
    name: 'フルスイング', type: 'ノーマル', category: 'physical',
    power: 150, accuracy: 90, pp: 5, contact: true,
    desc: '渾身の一撃。次ターン動けない。',
    effect: 'recharge'
  },
  'おんがえしパンチ': {
    name: 'おんがえしパンチ', type: 'ノーマル', category: 'physical',
    power: 102, accuracy: 100, pp: 15, contact: true, punch: true,
    desc: '感謝の拳。なつき度で威力変動。',
  },
  'みがわりにんぎょう': {
    name: 'みがわりにんぎょう', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'HP25%消費して身代わりを出す。',
    effect: 'substitute', target: 'self'
  },
  'かそく': {
    name: 'かそく', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 30,
    desc: 'すばやさ2段階UP。',
    effect: 'raiseSpe2', target: 'self'
  },
  'ぼうぎょきょうか': {
    name: 'ぼうぎょきょうか', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: 'ぼうぎょ2段階UP。',
    effect: 'raiseDef2', target: 'self'
  },
  'なきわめく': {
    name: 'なきわめく', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 40, sound: true,
    desc: '泣きわめいてこうげき1段階DOWN。',
    effect: 'lowerAtk1', target: 'enemy'
  },
  'ねむりにつく': {
    name: 'ねむりにつく', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '眠りHP全回復。2ターン眠る。',
    effect: 'sleep', target: 'self'
  },
  'のしかかりプレス': {
    name: 'のしかかりプレス', type: 'ノーマル', category: 'physical',
    power: 85, accuracy: 100, pp: 15, contact: true,
    desc: 'のしかかる。30%まひ。',
    effect: 'paralyze30'
  },
  'すてみダイブ': {
    name: 'すてみダイブ', type: 'ノーマル', category: 'physical',
    power: 120, accuracy: 100, pp: 15, contact: true,
    desc: '捨て身のダイブ。1/3反動。',
    effect: 'recoil33'
  },
  'とくぼうきょうか': {
    name: 'とくぼうきょうか', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: 'とくぼう2段階UP。',
    effect: 'raiseSpd2', target: 'self'
  },
  'さけびごえ': {
    name: 'さけびごえ', type: 'ノーマル', category: 'special',
    power: 90, accuracy: 100, pp: 10, sound: true,
    desc: '大声で攻撃。みがわり貫通。音技。',
  },
  'みちづれアタック': {
    name: 'みちづれアタック', type: 'ノーマル', category: 'physical',
    power: 0, accuracy: 90, pp: 5,
    desc: '自分のHP全消費で同じダメージを相手に。',
    effect: 'destiny'
  },
  'コピーフォルム': {
    name: 'コピーフォルム', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '相手の姿に変身する。',
    effect: 'transform', target: 'self'
  },
  'チーギュウアタック': {
    name: 'チーギュウアタック', type: 'ノーマル', category: 'physical',
    power: 60, accuracy: 90, pp: 20, contact: true,
    desc: 'チー牛の生き様をぶつける。',
  },
  'ジョンソンぎり': {
    name: 'ジョンソンぎり', type: 'ノーマル', category: 'physical',
    power: 80, accuracy: 90, pp: 15, contact: true,
    desc: 'ジョンソン流の切り技。急所率UP。',
    effect: 'highCrit'
  },
  'こうげきといで': {
    name: 'こうげきといで', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: 'こうげきと命中率を1段階UP。',
    effect: 'raiseAtkAcc', target: 'self'
  },
  'ふんきアップ': {
    name: 'ふんきアップ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 30,
    desc: 'こうげきととくこうを1段階UP。',
    effect: 'raiseAtkSpa', target: 'self'
  },
  'きりつける': {
    name: 'きりつける', type: 'ノーマル', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: '鋭く切りつける。急所率UP。',
    effect: 'highCrit'
  },
  'メガトンシュート': {
    name: 'メガトンシュート', type: 'ノーマル', category: 'physical',
    power: 120, accuracy: 75, pp: 5, contact: true,
    desc: '強烈な蹴り。命中が低い。',
  },
  'ほしのかけら': {
    name: 'ほしのかけら', type: 'ノーマル', category: 'special',
    power: 60, accuracy: 0, pp: 20,
    desc: '星のかけらを放つ必中技。',
  },
  'からげんきパンチ': {
    name: 'からげんきパンチ', type: 'ノーマル', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true, punch: true,
    desc: '状態異常のとき威力2倍。',
    effect: 'doubleWhenStatus'
  },
  'じたばたもがき': {
    name: 'じたばたもがき', type: 'ノーマル', category: 'physical',
    power: 0, accuracy: 100, pp: 15, contact: true,
    desc: 'HPが少ないほど威力UP（最大200）。',
    effect: 'reversal'
  },
  'しんそくラッシュ': {
    name: 'しんそくラッシュ', type: 'ノーマル', category: 'physical',
    power: 80, accuracy: 100, pp: 5, priority: 2, contact: true,
    desc: '神速の一撃。優先度+2。',
  },
  'せんこうだん': {
    name: 'せんこうだん', type: 'ノーマル', category: 'physical',
    power: 40, accuracy: 100, pp: 30, priority: 1, contact: true,
    desc: '閃光の突進。必ず先制。',
  },
  'だいばくはつ': {
    name: 'だいばくはつ', type: 'ノーマル', category: 'physical',
    power: 250, accuracy: 100, pp: 5,
    desc: '大爆発。使用後自分はひんし。',
    effect: 'selfDestruct'
  },
  'はらだいこ': {
    name: 'はらだいこ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'HP半分消費してこうげきを最大まで上げる。',
    effect: 'bellyDrum', target: 'self'
  },
  'ぜったいぼうぎょ': {
    name: 'ぜったいぼうぎょ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10, priority: 4,
    desc: 'そのターン攻撃を完全に防ぐ。連続で失敗しやすい。',
    effect: 'protect', target: 'self'
  },
  'こんじょうがまん': {
    name: 'こんじょうがまん', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10, priority: 4,
    desc: 'そのターンの攻撃をHP1で耐える。',
    effect: 'endure', target: 'self'
  },
  'ものまねコピー': {
    name: 'ものまねコピー', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '相手の能力変化をそのままコピーする。',
    effect: 'copyStatChanges', target: 'self'
  },
  'のうりょくリセット': {
    name: 'のうりょくリセット', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '自分と相手の全能力変化をリセットする。',
    effect: 'resetAll', target: 'field'
  },
  'ギャンブルパンチ': {
    name: 'ギャンブルパンチ', type: 'ノーマル', category: 'physical',
    power: 0, accuracy: 100, pp: 10, contact: true, punch: true,
    desc: '威力が40〜200のランダム。',
    effect: 'randomPower'
  },
  'にどうちアタック': {
    name: 'にどうちアタック', type: 'ノーマル', category: 'physical',
    power: 35, accuracy: 90, pp: 15, contact: true,
    desc: '2回連続で攻撃する。',
    effect: 'twiceHit'
  },
  'トリプルアタック': {
    name: 'トリプルアタック', type: 'ノーマル', category: 'physical',
    power: 20, accuracy: 100, pp: 10,
    desc: '3回攻撃。各10%でまひ・やけど・こおり。',
    effect: 'triAttack'
  },
  'ふきとばしウインド': {
    name: 'ふきとばしウインド', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 20, priority: -6,
    desc: '相手を強制交代させる。優先度-6。',
    effect: 'forceSwitch', target: 'enemy'
  },
  'いかくボイス': {
    name: 'いかくボイス', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 30, sound: true,
    desc: '威嚇の声でとくこう1段階DOWN。',
    effect: 'spaDrop1', target: 'enemy'
  },

  // =============================================================
  //  ほのおタイプ (22技)
  // =============================================================
  'ちいさなひ': {
    name: 'ちいさなひ', type: 'ほのお', category: 'special',
    power: 40, accuracy: 100, pp: 25,
    desc: '小さな火。10%やけど。',
    effect: 'burn10'
  },
  'えんねつほうしゃ': {
    name: 'えんねつほうしゃ', type: 'ほのお', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: '炎を放射。10%やけど。',
    effect: 'burn10'
  },
  'ごうかえんじん': {
    name: 'ごうかえんじん', type: 'ほのお', category: 'special',
    power: 110, accuracy: 85, pp: 5,
    desc: '轟炎の大文字。10%やけど。',
    effect: 'burn10'
  },
  'ほのおのまきつき': {
    name: 'ほのおのまきつき', type: 'ほのお', category: 'special',
    power: 35, accuracy: 85, pp: 15,
    desc: '炎で縛る。2〜5ターン束縛。',
    effect: 'trap25'
  },
  'ひざしをよぶ': {
    name: 'ひざしをよぶ', type: 'ほのお', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '天気を晴れにする（5ターン）。',
    effect: 'sunny', target: 'field'
  },
  'しゃくねつドライブ': {
    name: 'しゃくねつドライブ', type: 'ほのお', category: 'physical',
    power: 120, accuracy: 100, pp: 15, contact: true,
    desc: '炎突進。1/3反動。10%やけど。',
    effect: 'recoil33_burn10'
  },
  'ばくねつフルバースト': {
    name: 'ばくねつフルバースト', type: 'ほのお', category: 'special',
    power: 130, accuracy: 90, pp: 5,
    desc: '全力炎。使用後とくこう2段階DOWN。',
    effect: 'spaDrop2'
  },
  'ホッティバーン': {
    name: 'ホッティバーン', type: 'ほのお', category: 'special',
    power: 85, accuracy: 100, pp: 10,
    desc: '灼熱の炎。確定やけど。',
    effect: 'burn100'
  },
  'えんねつパンチ': {
    name: 'えんねつパンチ', type: 'ほのお', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true, punch: true,
    desc: '炎のパンチ。10%やけど。',
    effect: 'burn10'
  },
  'ごうえんキック': {
    name: 'ごうえんキック', type: 'ほのお', category: 'physical',
    power: 85, accuracy: 90, pp: 10, contact: true,
    desc: '炎の蹴り。急所率UP。10%やけど。',
    effect: 'burn10_highCrit'
  },
  'マグマストリーム': {
    name: 'マグマストリーム', type: 'ほのお', category: 'special',
    power: 100, accuracy: 75, pp: 5,
    desc: '溶岩流で包む。4〜5ターン束縛。',
    effect: 'trap45'
  },
  'ふんかバースト': {
    name: 'ふんかバースト', type: 'ほのお', category: 'special',
    power: 150, accuracy: 100, pp: 5,
    desc: '自分のHPが多いほど威力が高い。',
    effect: 'maxHpPower'
  },
  'えんごくのほのお': {
    name: 'えんごくのほのお', type: 'ほのお', category: 'special',
    power: 100, accuracy: 50, pp: 5,
    desc: '地獄の炎。確定やけどだが命中極低。',
    effect: 'burn100'
  },
  'おにびだま': {
    name: 'おにびだま', type: 'ほのお', category: 'status',
    power: 0, accuracy: 85, pp: 15,
    desc: '不気味な火でやけどにする。',
    effect: 'burn', target: 'enemy'
  },
  'えんねつのまい': {
    name: 'えんねつのまい', type: 'ほのお', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '炎の舞。50%でとくこう1段階UP。',
    effect: 'spaUp50self'
  },
  'ねっぷうかぜ': {
    name: 'ねっぷうかぜ', type: 'ほのお', category: 'special',
    power: 95, accuracy: 90, pp: 10,
    desc: '熱風。10%やけど。',
    effect: 'burn10'
  },
  'しゃくねつボール': {
    name: 'しゃくねつボール', type: 'ほのお', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: '灼熱の火球。30%やけど。',
    effect: 'burn30'
  },
  'かえんぐるま': {
    name: 'かえんぐるま', type: 'ほのお', category: 'physical',
    power: 60, accuracy: 100, pp: 25, contact: true,
    desc: '炎の車輪で突撃。10%やけど。こおり状態でも使用可。',
    effect: 'burn10'
  },
  'もえつきバーン': {
    name: 'もえつきバーン', type: 'ほのお', category: 'special',
    power: 130, accuracy: 100, pp: 5,
    desc: '全力で燃え尽きる。使用後ほのおタイプを失う。',
    effect: 'loseFireType'
  },
  'えんねつれんだ': {
    name: 'えんねつれんだ', type: 'ほのお', category: 'physical',
    power: 25, accuracy: 100, pp: 15, contact: true,
    desc: '炎の連続パンチ。必ず3回当たる。',
    effect: 'hit3'
  },
  'フレイムチャージ': {
    name: 'フレイムチャージ', type: 'ほのお', category: 'physical',
    power: 50, accuracy: 100, pp: 20, contact: true,
    desc: '炎をまとって突撃。すばやさ1段階UP。',
    effect: 'speedUpEachUse'
  },
  'にどひばしら': {
    name: 'にどひばしら', type: 'ほのお', category: 'special',
    power: 30, accuracy: 100, pp: 30,
    desc: '火柱を2回上げる。',
    effect: 'twiceHit'
  },

  // =============================================================
  //  みずタイプ (22技)
  // =============================================================
  'みずでっぽう': {
    name: 'みずでっぽう', type: 'みず', category: 'special',
    power: 40, accuracy: 100, pp: 25,
    desc: '水鉄砲を発射。',
  },
  'おおなみ': {
    name: 'おおなみ', type: 'みず', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: '大波でダメージ。',
  },
  'ばくりゅうほう': {
    name: 'ばくりゅうほう', type: 'みず', category: 'special',
    power: 110, accuracy: 80, pp: 5,
    desc: '爆流砲。高威力だが命中不安。',
  },
  'アクアダッシュ': {
    name: 'アクアダッシュ', type: 'みず', category: 'physical',
    power: 40, accuracy: 100, pp: 20, priority: 1, contact: true,
    desc: '水をまとって先制。優先度+1。',
  },
  'あめをよぶ': {
    name: 'あめをよぶ', type: 'みず', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '天気を雨にする（5ターン）。',
    effect: 'rain', target: 'field'
  },
  'びえんのなみだ': {
    name: 'びえんのなみだ', type: 'みず', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '大粒の涙。100%でとくこう1段階DOWN。',
    effect: 'spaDrop100'
  },
  'たきのぼりアタック': {
    name: 'たきのぼりアタック', type: 'みず', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '滝を登る勢いで攻撃。20%ひるみ。',
    effect: 'flinch20'
  },
  'みずのしっぽ': {
    name: 'みずのしっぽ', type: 'みず', category: 'physical',
    power: 90, accuracy: 90, pp: 10, contact: true,
    desc: '水をまとった尻尾で殴る。',
  },
  'すいあつクラッシュ': {
    name: 'すいあつクラッシュ', type: 'みず', category: 'physical',
    power: 85, accuracy: 100, pp: 10, contact: true,
    desc: '水圧で砕く。20%ぼうぎょDOWN。',
    effect: 'defDrop20'
  },
  'しおふきスプラッシュ': {
    name: 'しおふきスプラッシュ', type: 'みず', category: 'special',
    power: 150, accuracy: 100, pp: 5,
    desc: 'HP割合で威力変動。最大150。',
    effect: 'maxHpPower'
  },
  'ねっとうシャワー': {
    name: 'ねっとうシャワー', type: 'みず', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '熱い湯で攻撃。30%やけど。',
    effect: 'burn30'
  },
  'からをやぶるダンス': {
    name: 'からをやぶるダンス', type: 'みず', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '殻を破る。こうげき・とくこう・すばやさ2段階UP、ぼうぎょ・とくぼう1段階DOWN。',
    effect: 'shellSmash', target: 'self'
  },
  'みずのはもん': {
    name: 'みずのはもん', type: 'みず', category: 'special',
    power: 60, accuracy: 100, pp: 20,
    desc: '水の波紋。20%混乱。',
    effect: 'confuse20'
  },
  'うずまきトラップ': {
    name: 'うずまきトラップ', type: 'みず', category: 'special',
    power: 35, accuracy: 85, pp: 15,
    desc: '渦に閉じ込める。2〜5ターン束縛。',
    effect: 'trap25'
  },
  'せんすいアタック': {
    name: 'せんすいアタック', type: 'みず', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '水中に潜って次ターン攻撃。',
    effect: 'twoTurn'
  },
  'インクショット': {
    name: 'インクショット', type: 'みず', category: 'special',
    power: 65, accuracy: 85, pp: 10,
    desc: '墨を撃つ。50%命中率DOWN。',
    effect: 'accDrop50'
  },
  'ハサミハンマー': {
    name: 'ハサミハンマー', type: 'みず', category: 'physical',
    power: 100, accuracy: 90, pp: 10, contact: true,
    desc: '巨大ハサミで叩く。急所率UP。',
    effect: 'highCrit'
  },
  'みずしゅりけん': {
    name: 'みずしゅりけん', type: 'みず', category: 'special',
    power: 15, accuracy: 100, pp: 20, priority: 1,
    desc: '水の手裏剣。2〜5回先制攻撃。',
    effect: 'multihit25_priority'
  },
  'じょうきバースト': {
    name: 'じょうきバースト', type: 'みず', category: 'special',
    power: 110, accuracy: 95, pp: 5,
    desc: '高温蒸気。30%やけど。',
    effect: 'burn30'
  },
  'アクアドレイン': {
    name: 'アクアドレイン', type: 'みず', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '水分を吸い取る。与ダメージの半分回復。',
    drain: 50
  },
  'こおるしずく': {
    name: 'こおるしずく', type: 'みず', category: 'special',
    power: 55, accuracy: 100, pp: 20,
    desc: '冷たい雫。10%こおり。',
    effect: 'freeze10'
  },
  'トレントウェーブ': {
    name: 'トレントウェーブ', type: 'みず', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '激流の波。HP1/3以下で威力1.5倍。',
    effect: 'torrentBoost'
  },

  // =============================================================
  //  くさタイプ (18技)
  // =============================================================
  'はっぱブレード': {
    name: 'はっぱブレード', type: 'くさ', category: 'physical',
    power: 55, accuracy: 95, pp: 25,
    desc: '鋭い葉の刃。急所率UP。',
    effect: 'highCrit'
  },
  'たいようこうせん': {
    name: 'たいようこうせん', type: 'くさ', category: 'special',
    power: 120, accuracy: 100, pp: 10,
    desc: '太陽光を集めて放つ。晴れなら溜め不要。',
    effect: 'twoTurn_sunny'
  },
  'しょくぶつエナジー': {
    name: 'しょくぶつエナジー', type: 'くさ', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '植物の気。10%とくぼうDOWN。',
    effect: 'spdefDrop10'
  },
  'きせいのたね': {
    name: 'きせいのたね', type: 'くさ', category: 'status',
    power: 0, accuracy: 90, pp: 10,
    desc: '寄生の種を植え毎ターンHPを吸収。',
    effect: 'leechSeed', target: 'enemy'
  },
  'にんじゃのもみじ': {
    name: 'にんじゃのもみじ', type: 'くさ', category: 'special',
    power: 70, accuracy: 100, pp: 20,
    desc: '忍法紅葉隠れ。命中率1段階DOWN。',
    effect: 'accDrop1'
  },
  'つるのブレード': {
    name: 'つるのブレード', type: 'くさ', category: 'physical',
    power: 90, accuracy: 100, pp: 15, contact: true,
    desc: 'ツルの刀で斬る。急所率UP。',
    effect: 'highCrit'
  },
  'タネマシンガン': {
    name: 'タネマシンガン', type: 'くさ', category: 'physical',
    power: 25, accuracy: 100, pp: 30,
    desc: '種を2〜5発連射。',
    effect: 'multihit25'
  },
  'ドレインリーフ': {
    name: 'ドレインリーフ', type: 'くさ', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '養分を吸い取る。与ダメの半分回復。',
    drain: 50
  },
  'こうごうせいのひかり': {
    name: 'こうごうせいのひかり', type: 'くさ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '光合成でHP回復。晴れなら2/3回復。',
    effect: 'moonlight', target: 'self'
  },
  'つるのムチ': {
    name: 'つるのムチ', type: 'くさ', category: 'physical',
    power: 120, accuracy: 85, pp: 10, contact: true,
    desc: '力任せにツルで叩く。',
  },
  'リーフストーム': {
    name: 'リーフストーム', type: 'くさ', category: 'special',
    power: 130, accuracy: 90, pp: 5,
    desc: '葉の嵐。使用後とくこう2段階DOWN。',
    effect: 'spaDrop2'
  },
  'ほうしのねむり': {
    name: 'ほうしのねむり', type: 'くさ', category: 'status',
    power: 0, accuracy: 100, pp: 15,
    desc: '胞子で確実に眠らせる。',
    effect: 'sleep', target: 'enemy'
  },
  'ねむりのこな': {
    name: 'ねむりのこな', type: 'くさ', category: 'status',
    power: 0, accuracy: 75, pp: 15,
    desc: '粉で眠らせる。',
    effect: 'sleep', target: 'enemy'
  },
  'しびれのこな': {
    name: 'しびれのこな', type: 'くさ', category: 'status',
    power: 0, accuracy: 75, pp: 30,
    desc: '粉でまひにする。',
    effect: 'paralyze', target: 'enemy'
  },
  'ウッドクラッシュ': {
    name: 'ウッドクラッシュ', type: 'くさ', category: 'physical',
    power: 120, accuracy: 100, pp: 15, contact: true,
    desc: '丸太で殴る。1/3反動。',
    effect: 'recoil33'
  },
  'タネばくだん': {
    name: 'タネばくだん', type: 'くさ', category: 'physical',
    power: 80, accuracy: 100, pp: 15,
    desc: '硬い種を投げつける。',
  },
  'くさのフィールド': {
    name: 'くさのフィールド', type: 'くさ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '5ターン草のフィールド。くさ技1.3倍・毎ターンHP1/16回復。',
    effect: 'grassTerrain', target: 'field'
  },
  'フローラルアロマ': {
    name: 'フローラルアロマ', type: 'くさ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '花の香りでHP1/4回復し状態異常も治す。',
    effect: 'healQuarterCure', target: 'self'
  },

  // =============================================================
  //  でんきタイプ (18技)
  // =============================================================
  'スパークショック': {
    name: 'スパークショック', type: 'でんき', category: 'special',
    power: 40, accuracy: 100, pp: 30,
    desc: '電気を浴びせる。10%まひ。',
    effect: 'paralyze10'
  },
  'イナズマフォール': {
    name: 'イナズマフォール', type: 'でんき', category: 'special',
    power: 110, accuracy: 70, pp: 10,
    desc: '落雷。30%まひ。雨で必中。',
    effect: 'paralyze30'
  },
  'ライトニングボルト': {
    name: 'ライトニングボルト', type: 'でんき', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: '高圧電流。10%まひ。',
    effect: 'paralyze10'
  },
  'でんじフィールド': {
    name: 'でんじフィールド', type: 'でんき', category: 'status',
    power: 0, accuracy: 90, pp: 20,
    desc: '電磁波でまひにする。',
    effect: 'paralyze', target: 'enemy'
  },
  'かみなりパンチ': {
    name: 'かみなりパンチ', type: 'でんき', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true, punch: true,
    desc: '帯電パンチ。10%まひ。',
    effect: 'paralyze10'
  },
  'ワイルドスパーク': {
    name: 'ワイルドスパーク', type: 'でんき', category: 'physical',
    power: 90, accuracy: 100, pp: 15, contact: true,
    desc: '電撃突進。1/4反動。',
    effect: 'recoil25'
  },
  'ボルトスイッチ': {
    name: 'ボルトスイッチ', type: 'でんき', category: 'special',
    power: 70, accuracy: 100, pp: 20,
    desc: '攻撃後ひかえに交代。',
    effect: 'switchAfter'
  },
  'エレキネット': {
    name: 'エレキネット', type: 'でんき', category: 'special',
    power: 55, accuracy: 95, pp: 15,
    desc: '電気の網。100%すばやさ1段階DOWN。',
    effect: 'speDrop100'
  },
  'ほうでんバースト': {
    name: 'ほうでんバースト', type: 'でんき', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '電気放出。30%まひ。',
    effect: 'paralyze30'
  },
  'でんげきは': {
    name: 'でんげきは', type: 'でんき', category: 'special',
    power: 60, accuracy: 0, pp: 20,
    desc: '電撃波。必中技。',
  },
  'らいめいキック': {
    name: 'らいめいキック', type: 'でんき', category: 'physical',
    power: 90, accuracy: 95, pp: 10, contact: true,
    desc: '雷を纏った蹴り。100%ぼうぎょDOWN。',
    effect: 'defDrop100'
  },
  'プラズマフィスト': {
    name: 'プラズマフィスト', type: 'でんき', category: 'physical',
    power: 100, accuracy: 100, pp: 15, contact: true, punch: true,
    desc: 'プラズマの拳。そのターンノーマル技がでんき技になる。',
    effect: 'normalToElectric'
  },
  'エレキチャージ': {
    name: 'エレキチャージ', type: 'でんき', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '電気をためる。とくぼう1段階UP。次のでんき技威力2倍。',
    effect: 'chargeElectric', target: 'self'
  },
  'パラボラチャージ': {
    name: 'パラボラチャージ', type: 'でんき', category: 'special',
    power: 65, accuracy: 100, pp: 20,
    desc: '電気で攻撃し与ダメの半分回復。',
    drain: 50
  },
  'エレキフィールド': {
    name: 'エレキフィールド', type: 'でんき', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '5ターン電気のフィールド。でんき技1.3倍・ねむり無効。',
    effect: 'electricTerrain', target: 'field'
  },
  'かいでんぱ': {
    name: 'かいでんぱ', type: 'でんき', category: 'status',
    power: 0, accuracy: 100, pp: 15,
    desc: '電磁波で相手のとくこう2段階DOWN。',
    effect: 'spaDrop2', target: 'enemy'
  },
  'ちょうでんじほう': {
    name: 'ちょうでんじほう', type: 'でんき', category: 'special',
    power: 120, accuracy: 50, pp: 5,
    desc: '超電磁砲。確定まひだが命中極低。',
    effect: 'paralyze100'
  },
  'スパークニードル': {
    name: 'スパークニードル', type: 'でんき', category: 'physical',
    power: 20, accuracy: 100, pp: 20,
    desc: '電気の針を2〜5回刺す。',
    effect: 'multihit25'
  },

  // =============================================================
  //  こおりタイプ (16技)
  // =============================================================
  'こなゆきショット': {
    name: 'こなゆきショット', type: 'こおり', category: 'special',
    power: 40, accuracy: 100, pp: 25,
    desc: '粉雪を浴びせる。10%こおり。',
    effect: 'freeze10'
  },
  'れいとうビーム': {
    name: 'れいとうビーム', type: 'こおり', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '冷凍光線。10%こおり。',
    effect: 'freeze10'
  },
  'ブリザードストーム': {
    name: 'ブリザードストーム', type: 'こおり', category: 'special',
    power: 110, accuracy: 70, pp: 5,
    desc: '猛吹雪。30%こおり。あられで必中。',
    effect: 'freeze30'
  },
  'こおりのつぶて': {
    name: 'こおりのつぶて', type: 'こおり', category: 'physical',
    power: 40, accuracy: 100, pp: 30, priority: 1,
    desc: '氷の塊を先制で投げる。',
  },
  'カチコチフリーズ': {
    name: 'カチコチフリーズ', type: 'こおり', category: 'physical',
    power: 85, accuracy: 95, pp: 10, contact: true,
    desc: '凍った体で攻撃。50%こおり。',
    effect: 'freeze50'
  },
  'れいとうパンチ': {
    name: 'れいとうパンチ', type: 'こおり', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true, punch: true,
    desc: '凍てつく拳。10%こおり。',
    effect: 'freeze10'
  },
  'つららおとし': {
    name: 'つららおとし', type: 'こおり', category: 'physical',
    power: 85, accuracy: 90, pp: 10,
    desc: '巨大な氷柱を落とす。30%ひるみ。',
    effect: 'flinch30'
  },
  'つららばり': {
    name: 'つららばり', type: 'こおり', category: 'physical',
    power: 25, accuracy: 100, pp: 30,
    desc: '氷の針を2〜5回飛ばす。',
    effect: 'multihit25'
  },
  'フリーズドライ': {
    name: 'フリーズドライ', type: 'こおり', category: 'special',
    power: 70, accuracy: 100, pp: 20,
    desc: '急速冷凍。みずタイプにも抜群。10%こおり。',
    effect: 'freeze10_superWater'
  },
  'ぜったいれいど': {
    name: 'ぜったいれいど', type: 'こおり', category: 'special',
    power: 0, accuracy: 30, pp: 5,
    desc: '当たれば一撃ひんし。自分より低レベルに無効。',
    effect: 'ohko'
  },
  'あられをよぶ': {
    name: 'あられをよぶ', type: 'こおり', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '天気をあられにする（5ターン）。',
    effect: 'hail', target: 'field'
  },
  'オーロラベール': {
    name: 'オーロラベール', type: 'こおり', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: 'あられ時のみ使用可。5ターン物理・特殊ダメージ半減。',
    effect: 'auroraVeil', target: 'field'
  },
  'フロストブレス': {
    name: 'フロストブレス', type: 'こおり', category: 'special',
    power: 60, accuracy: 90, pp: 10,
    desc: '凍てつく息。確定急所。',
    effect: 'alwaysCrit'
  },
  'こごえるかぜ': {
    name: 'こごえるかぜ', type: 'こおり', category: 'special',
    power: 55, accuracy: 95, pp: 15,
    desc: '冷たい風。100%すばやさDOWN。',
    effect: 'speDrop100'
  },
  'アイスハンマー': {
    name: 'アイスハンマー', type: 'こおり', category: 'physical',
    power: 100, accuracy: 90, pp: 10, contact: true, punch: true,
    desc: '氷の鉄槌。自分のすばやさ1段階DOWN。',
    effect: 'selfSpeDrop1'
  },
  'こおりのいぶき': {
    name: 'こおりのいぶき', type: 'こおり', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '極寒の吐息。20%こおり。',
    effect: 'freeze20'
  },

  // =============================================================
  //  かくとうタイプ (18技)
  // =============================================================
  'かかとおとし': {
    name: 'かかとおとし', type: 'かくとう', category: 'physical',
    power: 65, accuracy: 100, pp: 25, contact: true,
    desc: 'かかとで踏みつける。',
  },
  'きしかいせいパンチ': {
    name: 'きしかいせいパンチ', type: 'かくとう', category: 'physical',
    power: 0, accuracy: 100, pp: 10, contact: true, punch: true,
    desc: 'HPが低いほど威力UP（最大200）。',
    effect: 'reversal'
  },
  'クロスファイト': {
    name: 'クロスファイト', type: 'かくとう', category: 'physical',
    power: 100, accuracy: 80, pp: 5, contact: true,
    desc: '交差する拳。急所率UP。',
    effect: 'highCrit'
  },
  'ラッシュコンボ': {
    name: 'ラッシュコンボ', type: 'かくとう', category: 'physical',
    power: 120, accuracy: 100, pp: 5, contact: true,
    desc: '激しい接近戦。使用後ぼうぎょ・とくぼう1段階DOWN。',
    effect: 'defSpdefDrop1'
  },
  'こんらんパンチ': {
    name: 'こんらんパンチ', type: 'かくとう', category: 'physical',
    power: 100, accuracy: 100, pp: 5, contact: true, punch: true,
    desc: '確定混乱。',
    effect: 'confuse100'
  },
  'ぼくちんパンチ': {
    name: 'ぼくちんパンチ', type: 'かくとう', category: 'physical',
    power: 50, accuracy: 100, pp: 30, contact: true, punch: true, priority: 1,
    desc: '先制の拳。優先度+1。',
  },
  'うわんスラップ': {
    name: 'うわんスラップ', type: 'かくとう', category: 'physical',
    power: 85, accuracy: 95, pp: 15, contact: true,
    desc: '腕ビンタ。100%ぼうぎょDOWN。',
    effect: 'defDrop100'
  },
  'しょうりゅうけん': {
    name: 'しょうりゅうけん', type: 'かくとう', category: 'physical',
    power: 70, accuracy: 100, pp: 10, contact: true, punch: true, priority: 1,
    desc: '昇り龍の拳。優先度+1。10%ひるみ。',
    effect: 'flinch10'
  },
  'ドレインナックル': {
    name: 'ドレインナックル', type: 'かくとう', category: 'physical',
    power: 75, accuracy: 100, pp: 10, contact: true, punch: true,
    desc: '気を吸い取るパンチ。与ダメの半分回復。こうげきUP。',
    drain: 50, effect: 'atkUp1self'
  },
  'フライングニー': {
    name: 'フライングニー', type: 'かくとう', category: 'physical',
    power: 130, accuracy: 90, pp: 10, contact: true,
    desc: '跳び膝蹴り。外すと自分が大ダメージ。',
    effect: 'crashDamage'
  },
  'しっぷうけん': {
    name: 'しっぷうけん', type: 'かくとう', category: 'physical',
    power: 40, accuracy: 100, pp: 30, contact: true, punch: true,
    desc: '疾風の拳。2回攻撃。',
    effect: 'twiceHit'
  },
  'カウンターブロウ': {
    name: 'カウンターブロウ', type: 'かくとう', category: 'physical',
    power: 0, accuracy: 100, pp: 20, priority: -5,
    desc: '受けた物理ダメージを2倍返し。',
    effect: 'counter'
  },
  'せいけんづき': {
    name: 'せいけんづき', type: 'かくとう', category: 'physical',
    power: 150, accuracy: 100, pp: 5, contact: true, punch: true,
    desc: '会心の正拳。確定急所。使用後動けない。',
    effect: 'alwaysCrit_recharge'
  },
  'ローキック': {
    name: 'ローキック', type: 'かくとう', category: 'physical',
    power: 65, accuracy: 100, pp: 20, contact: true,
    desc: '低い蹴り。100%すばやさDOWN。',
    effect: 'speDrop100'
  },
  'ビルドアップ': {
    name: 'ビルドアップ', type: 'かくとう', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: 'こうげき・ぼうぎょ1段階UP。',
    effect: 'raiseAtkDef', target: 'self'
  },
  'れんぞくパンチ': {
    name: 'れんぞくパンチ', type: 'かくとう', category: 'physical',
    power: 18, accuracy: 85, pp: 15, contact: true, punch: true,
    desc: '2〜5回連続パンチ。',
    effect: 'multihit25'
  },
  'ばくれつきゃく': {
    name: 'ばくれつきゃく', type: 'かくとう', category: 'physical',
    power: 30, accuracy: 100, pp: 10, contact: true,
    desc: '3回連続蹴り。必ず3回当たる。',
    effect: 'hit3'
  },
  'きあいだま': {
    name: 'きあいだま', type: 'かくとう', category: 'special',
    power: 120, accuracy: 70, pp: 5,
    desc: '気合の塊。10%とくぼうDOWN。',
    effect: 'spdefDrop10'
  },

  // =============================================================
  //  どくタイプ (14技)
  // =============================================================
  'もうどくえき': {
    name: 'もうどくえき', type: 'どく', category: 'status',
    power: 0, accuracy: 90, pp: 10,
    desc: '相手をもうどく状態にする。',
    effect: 'toxicPoison', target: 'enemy'
  },
  'どくショック': {
    name: 'どくショック', type: 'どく', category: 'special',
    power: 65, accuracy: 100, pp: 10,
    desc: 'どく状態の相手には威力2倍。',
    effect: 'doubleVsPoison'
  },
  'ヘドロばくだん': {
    name: 'ヘドロばくだん', type: 'どく', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '汚泥の爆弾。30%どく。',
    effect: 'poison30'
  },
  'げゆゆボム': {
    name: 'げゆゆボム', type: 'どく', category: 'special',
    power: 90, accuracy: 85, pp: 10,
    desc: '毒の爆弾。100%どく。',
    effect: 'poison100'
  },
  'うんこボム': {
    name: 'うんこボム', type: 'どく', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: '巨大な爆弾。100%どく。',
    effect: 'poison100'
  },
  'どくのいばら': {
    name: 'どくのいばら', type: 'どく', category: 'physical',
    power: 60, accuracy: 100, pp: 25,
    desc: '毒の棘。30%どく。',
    effect: 'poison30'
  },
  'どくづき': {
    name: 'どくづき', type: 'どく', category: 'physical',
    power: 80, accuracy: 100, pp: 20, contact: true,
    desc: '毒の突き。30%どく。',
    effect: 'poison30'
  },
  'ヘドロウェーブ': {
    name: 'ヘドロウェーブ', type: 'どく', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '汚泥の波。10%どく。',
    effect: 'poison10'
  },
  'どくガス': {
    name: 'どくガス', type: 'どく', category: 'status',
    power: 0, accuracy: 90, pp: 40,
    desc: '毒ガスでどくにする。',
    effect: 'poison', target: 'enemy'
  },
  'どくのそこ': {
    name: 'どくのそこ', type: 'どく', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '毒の棘を撒く。相手が交代時にどく。',
    effect: 'toxicSpikes', target: 'field'
  },
  'ベノムトラップ': {
    name: 'ベノムトラップ', type: 'どく', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: 'どく状態の相手のこうげき・とくこう・すばやさ1段階DOWN。',
    effect: 'venomTrap', target: 'enemy'
  },
  'アシッドスプレー': {
    name: 'アシッドスプレー', type: 'どく', category: 'special',
    power: 40, accuracy: 100, pp: 20,
    desc: '強酸を浴びせる。100%とくぼう2段階DOWN。',
    effect: 'spdefDrop2_100'
  },
  'どくのしっぽ': {
    name: 'どくのしっぽ', type: 'どく', category: 'physical',
    power: 50, accuracy: 100, pp: 25, contact: true,
    desc: '毒の尻尾で叩く。50%どく。',
    effect: 'poison50'
  },
  'クロスポイズン': {
    name: 'クロスポイズン', type: 'どく', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: '毒の十字斬り。急所率UP。10%どく。',
    effect: 'poison10_highCrit'
  },

  // =============================================================
  //  じめんタイプ (14技)
  // =============================================================
  'だいちのゆれ': {
    name: 'だいちのゆれ', type: 'じめん', category: 'physical',
    power: 100, accuracy: 100, pp: 10,
    desc: '大地を揺らす。ひこうタイプには無効。',
  },
  'だいちのエネルギー': {
    name: 'だいちのエネルギー', type: 'じめん', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '大地の力。10%とくぼうDOWN。',
    effect: 'spdefDrop10'
  },
  'マッドショット': {
    name: 'マッドショット', type: 'じめん', category: 'special',
    power: 55, accuracy: 95, pp: 15,
    desc: '泥を撃つ。100%すばやさDOWN。',
    effect: 'speDrop100'
  },
  'パブロのほりあげ': {
    name: 'パブロのほりあげ', type: 'じめん', category: 'physical',
    power: 80, accuracy: 100, pp: 15,
    desc: 'スコップで掘り上げる。空を飛んでいる相手にも当たる。',
    effect: 'pierceFly'
  },
  'じならし': {
    name: 'じならし', type: 'じめん', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '地面を踏む。100%すばやさDOWN。',
    effect: 'speDrop100'
  },
  'あなをほる': {
    name: 'あなをほる', type: 'じめん', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '地中に潜り次ターン攻撃。',
    effect: 'twoTurn'
  },
  'すなかけ': {
    name: 'すなかけ', type: 'じめん', category: 'status',
    power: 0, accuracy: 100, pp: 15,
    desc: '砂をかけて命中率1段階DOWN。',
    effect: 'accDrop1', target: 'enemy'
  },
  'すなあらしをよぶ': {
    name: 'すなあらしをよぶ', type: 'じめん', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '天気を砂嵐にする（5ターン）。',
    effect: 'sandstorm', target: 'field'
  },
  'がんせきクローズ': {
    name: 'がんせきクローズ', type: 'じめん', category: 'physical',
    power: 60, accuracy: 95, pp: 15,
    desc: '岩で塞ぐ。100%すばやさDOWN。',
    effect: 'speDrop100'
  },
  'どろばくだん': {
    name: 'どろばくだん', type: 'じめん', category: 'special',
    power: 65, accuracy: 85, pp: 10,
    desc: '泥の爆弾。30%命中率DOWN。',
    effect: 'accDrop30'
  },
  'こうちだいち': {
    name: 'こうちだいち', type: 'じめん', category: 'physical',
    power: 95, accuracy: 95, pp: 10, contact: true,
    desc: '地面を砕く猛攻。20%ぼうぎょDOWN。',
    effect: 'defDrop20'
  },
  'ボーンラッシュ': {
    name: 'ボーンラッシュ', type: 'じめん', category: 'physical',
    power: 25, accuracy: 90, pp: 10,
    desc: '骨で2〜5回殴る。',
    effect: 'multihit25'
  },
  'サウザンエッジ': {
    name: 'サウザンエッジ', type: 'じめん', category: 'physical',
    power: 75, accuracy: 100, pp: 10,
    desc: '大地の千の刃。急所率UP。',
    effect: 'highCrit'
  },
  'だいちのカーテン': {
    name: 'だいちのカーテン', type: 'じめん', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'とくぼうを2段階UP。',
    effect: 'raiseSpd2', target: 'self'
  },

  // =============================================================
  //  ひこうタイプ (14技)
  // =============================================================
  'そらからのこうげき': {
    name: 'そらからのこうげき', type: 'ひこう', category: 'physical',
    power: 90, accuracy: 95, pp: 15,
    desc: '空から急降下攻撃。次ターン攻撃。',
    effect: 'twoTurn'
  },
  'ぼうふうブラスト': {
    name: 'ぼうふうブラスト', type: 'ひこう', category: 'special',
    power: 110, accuracy: 70, pp: 10,
    desc: '暴風。30%混乱。雨で必中。',
    effect: 'confuse30'
  },
  'ゆうかんなとびこみ': {
    name: 'ゆうかんなとびこみ', type: 'ひこう', category: 'physical',
    power: 120, accuracy: 100, pp: 15, contact: true,
    desc: '勇敢な飛翔突撃。1/3反動。',
    effect: 'recoil33'
  },
  'たかしのひこう': {
    name: 'たかしのひこう', type: 'ひこう', category: 'physical',
    power: 80, accuracy: 100, pp: 10,
    desc: '宇宙人の力で飛行して攻撃。',
  },
  'ほしになったぼくちん': {
    name: 'ほしになったぼくちん', type: 'ひこう', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '星になった光で攻撃。20%メロメロ。',
    effect: 'attract20'
  },
  'むげんのひかり': {
    name: 'むげんのひかり', type: 'ひこう', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '無限の光。5ターンとくしゅダメ半減の壁。',
    effect: 'lightScreen5'
  },
  'バードアタック': {
    name: 'バードアタック', type: 'ひこう', category: 'physical',
    power: 60, accuracy: 100, pp: 25, contact: true,
    desc: '鳥の爪で攻撃。',
  },
  'エアスラッシュ': {
    name: 'エアスラッシュ', type: 'ひこう', category: 'special',
    power: 75, accuracy: 95, pp: 15,
    desc: '鋭い空気の刃。30%ひるみ。',
    effect: 'flinch30'
  },
  'つばめブレード': {
    name: 'つばめブレード', type: 'ひこう', category: 'physical',
    power: 60, accuracy: 0, pp: 20, contact: true,
    desc: '燕返し。必中。',
  },
  'はねやすめ': {
    name: 'はねやすめ', type: 'ひこう', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'HP半分回復。そのターンひこうタイプを失う。',
    effect: 'roost', target: 'self'
  },
  'おいかぜ': {
    name: 'おいかぜ', type: 'ひこう', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '4ターンの間味方のすばやさ2倍。',
    effect: 'tailwind', target: 'field'
  },
  'はがねのつばさ': {
    name: 'はがねのつばさ', type: 'ひこう', category: 'physical',
    power: 70, accuracy: 90, pp: 25, contact: true,
    desc: '鋼の翼。10%ぼうぎょUP。',
    effect: 'selfDefUp10'
  },
  'アクロバットフライ': {
    name: 'アクロバットフライ', type: 'ひこう', category: 'physical',
    power: 55, accuracy: 100, pp: 15, contact: true,
    desc: '持ち物がないと威力2倍。',
    effect: 'noItemDouble'
  },
  'ゴッドバード': {
    name: 'ゴッドバード', type: 'ひこう', category: 'physical',
    power: 140, accuracy: 90, pp: 5,
    desc: '1ターン溜めて攻撃。急所率UP。30%ひるみ。',
    effect: 'twoTurn_crit_flinch30'
  },

  // =============================================================
  //  エスパータイプ (18技)
  // =============================================================
  'ねんりきビーム': {
    name: 'ねんりきビーム', type: 'エスパー', category: 'special',
    power: 50, accuracy: 100, pp: 25,
    desc: '念力攻撃。10%混乱。',
    effect: 'confuse10'
  },
  'サイコウェーブ': {
    name: 'サイコウェーブ', type: 'エスパー', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '念動攻撃。10%とくぼうDOWN。',
    effect: 'spdefDrop10'
  },
  'サイコインパクト': {
    name: 'サイコインパクト', type: 'エスパー', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: 'ぼうぎょで計算するとくしゅ技。',
    effect: 'useDefense'
  },
  'みらいのこうげき': {
    name: 'みらいのこうげき', type: 'エスパー', category: 'special',
    power: 120, accuracy: 100, pp: 10,
    desc: '2ターン後にダメージを与える。',
    effect: 'futureAttack2'
  },
  'サイコバースト': {
    name: 'サイコバースト', type: 'エスパー', category: 'special',
    power: 140, accuracy: 90, pp: 5,
    desc: '全力のサイコ。とくこう2段階DOWN。',
    effect: 'spaDrop2'
  },
  'テレポートスイッチ': {
    name: 'テレポートスイッチ', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 20, priority: -6,
    desc: 'ひかえと交代。優先度-6。',
    effect: 'switch', target: 'self'
  },
  'てんさいのひらめき': {
    name: 'てんさいのひらめき', type: 'エスパー', category: 'special',
    power: 100, accuracy: 95, pp: 10,
    desc: '天才の閃き。確定急所。',
    effect: 'alwaysCrit'
  },
  'まつもとのちえ': {
    name: 'まつもとのちえ', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '知恵でとくこう・とくぼう2段階UP。',
    effect: 'raiseSpaSpd', target: 'self'
  },
  'にゃざーるビーム': {
    name: 'にゃざーるビーム', type: 'エスパー', category: 'special',
    power: 100, accuracy: 95, pp: 10,
    desc: '神秘の目から放つビーム。20%メロメロ。',
    effect: 'attract20'
  },
  'コンパスしじ': {
    name: 'コンパスしじ', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '方向指示。こうげき・すばやさ1段階UP。',
    effect: 'raiseAtkSpe', target: 'self'
  },
  'ロールシャッハテスト': {
    name: 'ロールシャッハテスト', type: 'エスパー', category: 'status',
    power: 0, accuracy: 85, pp: 10,
    desc: '心理を読む。混乱かこうげきDOWNをランダムに。',
    effect: 'confuseOrDown', target: 'enemy'
  },
  'はかせのかいせき': {
    name: 'はかせのかいせき', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '相手のステータス・技・特性を解析する。',
    effect: 'revealAll', target: 'enemy'
  },
  'じかんのやじるし': {
    name: 'じかんのやじるし', type: 'エスパー', category: 'special',
    power: 70, accuracy: 100, pp: 15, priority: 2,
    desc: '時の矢。優先度+2。',
  },
  'めいそう': {
    name: 'めいそう', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: 'とくこう・とくぼう1段階UP。',
    effect: 'raiseSpaSpd1', target: 'self'
  },
  'サイドチェンジ': {
    name: 'サイドチェンジ', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 15, priority: 1,
    desc: '自分と味方の位置を入れ替える。',
    effect: 'sideChange', target: 'self'
  },
  'トリックルーム': {
    name: 'トリックルーム', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 5, priority: -7,
    desc: '5ターンの間すばやさが低い方が先に行動。',
    effect: 'trickRoom', target: 'field'
  },
  'しゃくねつのめ': {
    name: 'しゃくねつのめ', type: 'エスパー', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '灼熱の目。30%混乱。',
    effect: 'confuse30'
  },
  'サイコドレイン': {
    name: 'サイコドレイン', type: 'エスパー', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '精神を吸い取る。与ダメの半分回復。',
    drain: 50
  },

  // =============================================================
  //  むしタイプ (10技)
  // =============================================================
  'むしのさざめき': {
    name: 'むしのさざめき', type: 'むし', category: 'special',
    power: 90, accuracy: 100, pp: 10, sound: true,
    desc: '虫の声。10%とくぼうDOWN。',
    effect: 'spdefDrop10'
  },
  'シザークロス': {
    name: 'シザークロス', type: 'むし', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: 'ハサミで切る。',
  },
  'むしくいアタック': {
    name: 'むしくいアタック', type: 'むし', category: 'physical',
    power: 60, accuracy: 100, pp: 20, contact: true,
    desc: '噛みつく。相手のきのみを奪う。',
    effect: 'stealBerry'
  },
  'とんぼスイッチ': {
    name: 'とんぼスイッチ', type: 'むし', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: '攻撃後ひかえと交代。',
    effect: 'switchAfter'
  },
  'ミサイルニードル': {
    name: 'ミサイルニードル', type: 'むし', category: 'physical',
    power: 25, accuracy: 95, pp: 20,
    desc: '針を2〜5本飛ばす。',
    effect: 'multihit25'
  },
  'メガホーン': {
    name: 'メガホーン', type: 'むし', category: 'physical',
    power: 120, accuracy: 85, pp: 10, contact: true,
    desc: '巨大な角で突撃。',
  },
  'ほたるのひかり': {
    name: 'ほたるのひかり', type: 'むし', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '蛍の光でHP半分回復。',
    effect: 'healHalf', target: 'self'
  },
  'ちょうのまい': {
    name: 'ちょうのまい', type: 'むし', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '蝶の舞。とくこう・とくぼう・すばやさ1段階UP。',
    effect: 'butterflyDance', target: 'self'
  },
  'いとをはく': {
    name: 'いとをはく', type: 'むし', category: 'status',
    power: 0, accuracy: 95, pp: 40,
    desc: '糸でまとわりつく。すばやさ2段階DOWN。',
    effect: 'speDrop2', target: 'enemy'
  },
  'きゅうけつアタック': {
    name: 'きゅうけつアタック', type: 'むし', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '吸血。与ダメの半分回復。',
    drain: 50
  },

  // =============================================================
  //  いわタイプ (12技)
  // =============================================================
  'がんせきブレード': {
    name: 'がんせきブレード', type: 'いわ', category: 'physical',
    power: 100, accuracy: 80, pp: 5,
    desc: '岩の刃。急所率UP。',
    effect: 'highCrit'
  },
  'がんせきトラップ': {
    name: 'がんせきトラップ', type: 'いわ', category: 'physical',
    power: 60, accuracy: 95, pp: 15,
    desc: '岩で塞ぐ。100%すばやさDOWN。',
    effect: 'speDrop100'
  },
  'いわなだれ': {
    name: 'いわなだれ', type: 'いわ', category: 'physical',
    power: 75, accuracy: 90, pp: 10,
    desc: '岩を落とす。30%ひるみ。',
    effect: 'flinch30'
  },
  'ロックブラスト': {
    name: 'ロックブラスト', type: 'いわ', category: 'physical',
    power: 25, accuracy: 90, pp: 10,
    desc: '岩を2〜5個投げる。',
    effect: 'multihit25'
  },
  'パワージェム': {
    name: 'パワージェム', type: 'いわ', category: 'special',
    power: 80, accuracy: 100, pp: 20,
    desc: '宝石の輝きで攻撃。',
  },
  'ステルストラップ': {
    name: 'ステルストラップ', type: 'いわ', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '岩の罠を撒く。相手交代時に岩ダメージ。',
    effect: 'stealthRock', target: 'field'
  },
  'ワイドクラッシュ': {
    name: 'ワイドクラッシュ', type: 'いわ', category: 'physical',
    power: 110, accuracy: 80, pp: 5, contact: true,
    desc: '全身で岩を砕く突撃。反動1/4。',
    effect: 'recoil25'
  },
  'メテオフォール': {
    name: 'メテオフォール', type: 'いわ', category: 'physical',
    power: 150, accuracy: 90, pp: 5,
    desc: '隕石落とし。こうげき・ぼうぎょ1段階DOWN。',
    effect: 'selfAtkDefDrop1'
  },
  'ダイヤストーム': {
    name: 'ダイヤストーム', type: 'いわ', category: 'physical',
    power: 100, accuracy: 95, pp: 5,
    desc: 'ダイヤの嵐。50%ぼうぎょUP。',
    effect: 'selfDefUp50'
  },
  'がんせきスプリット': {
    name: 'がんせきスプリット', type: 'いわ', category: 'physical',
    power: 75, accuracy: 100, pp: 15,
    desc: '岩を割りぶつける。ぼうぎょ等化。',
    effect: 'splitDef'
  },
  'すなのからだ': {
    name: 'すなのからだ', type: 'いわ', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: 'ぼうぎょ2段階UP。',
    effect: 'raiseDef2', target: 'self'
  },
  'ジュエルレーザー': {
    name: 'ジュエルレーザー', type: 'いわ', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '宝石のレーザー。10%とくぼうDOWN。',
    effect: 'spdefDrop10'
  },

  // =============================================================
  //  ゴーストタイプ (16技)
  // =============================================================
  'シャドーショット': {
    name: 'シャドーショット', type: 'ゴースト', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '影の弾丸。20%とくぼうDOWN。',
    effect: 'spdefDrop20'
  },
  'のろいのことば': {
    name: 'のろいのことば', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'HP1/2消費し呪いをかける。毎ターン1/4ダメージ。',
    effect: 'curse', target: 'enemy'
  },
  'たたりめのひ': {
    name: 'たたりめのひ', type: 'ゴースト', category: 'special',
    power: 65, accuracy: 100, pp: 10,
    desc: '状態異常の相手に威力2倍。',
    effect: 'doubleVsStatus'
  },
  'やみのはどう': {
    name: 'やみのはどう', type: 'ゴースト', category: 'special',
    power: 0, accuracy: 100, pp: 15,
    desc: '自分のレベルと同じ固定ダメージ。',
    effect: 'levelDamage'
  },
  'したいのゆうき': {
    name: 'したいのゆうき', type: 'ゴースト', category: 'physical',
    power: 80, accuracy: 100, pp: 15,
    desc: '死体の力。一度だけひんしを回避。',
    effect: 'surviveOnce'
  },
  'ホラービジョン': {
    name: 'ホラービジョン', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 100, pp: 15,
    desc: '恐怖映像。こうげき・とくこう・すばやさ1段階DOWN。',
    effect: 'lowerAtkSpaSpeed', target: 'enemy'
  },
  'くろきりのとばり': {
    name: 'くろきりのとばり', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '黒い霧。回避率1段階UP。',
    effect: 'raiseEva', target: 'self'
  },
  'ゴーストクロー': {
    name: 'ゴーストクロー', type: 'ゴースト', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '幽霊の爪。急所率UP。',
    effect: 'highCrit'
  },
  'ファントムフォース': {
    name: 'ファントムフォース', type: 'ゴースト', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true,
    desc: '姿を消して次ターン攻撃。まもるを貫通。',
    effect: 'twoTurn_pierceProtect'
  },
  'みちづれのうた': {
    name: 'みちづれのうた', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '次ターンにたおされたら相手も道連れ。',
    effect: 'destinybond', target: 'self'
  },
  'おにびシュート': {
    name: 'おにびシュート', type: 'ゴースト', category: 'special',
    power: 60, accuracy: 100, pp: 15,
    desc: '幽火を飛ばす。30%やけど。',
    effect: 'burn30'
  },
  'あくむのささやき': {
    name: 'あくむのささやき', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 85, pp: 10, sound: true,
    desc: '悪夢の囁き。眠りにする。',
    effect: 'sleep', target: 'enemy'
  },
  'シャドードレイン': {
    name: 'シャドードレイン', type: 'ゴースト', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '影から吸い取る。与ダメの半分回復。',
    drain: 50
  },
  'ポルターガイスト': {
    name: 'ポルターガイスト', type: 'ゴースト', category: 'physical',
    power: 110, accuracy: 90, pp: 5,
    desc: '持ち物を操って攻撃。持ち物がないと失敗。',
    effect: 'poltergeist'
  },
  'シャドーパンチ': {
    name: 'シャドーパンチ', type: 'ゴースト', category: 'physical',
    power: 60, accuracy: 0, pp: 20, contact: true, punch: true,
    desc: '影のパンチ。必中。',
  },
  'のろいのしるし': {
    name: 'のろいのしるし', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 90, pp: 10,
    desc: '呪いの印を刻む。毎ターンHP1/8ダメージ。',
    effect: 'curseMarked', target: 'enemy'
  },

  // =============================================================
  //  ドラゴンタイプ (12技)
  // =============================================================
  'りゅうせいぐん': {
    name: 'りゅうせいぐん', type: 'ドラゴン', category: 'special',
    power: 130, accuracy: 90, pp: 5,
    desc: '隕石の嵐。とくこう2段階DOWN。',
    effect: 'spaDrop2'
  },
  'げきりんラッシュ': {
    name: 'げきりんラッシュ', type: 'ドラゴン', category: 'physical',
    power: 120, accuracy: 100, pp: 10, contact: true,
    desc: '2〜3ターン攻撃し続け混乱。',
    effect: 'thrash'
  },
  'ドラゴンクロー': {
    name: 'ドラゴンクロー', type: 'ドラゴン', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '鋭い竜の爪。',
  },
  'ドラゴンパルス': {
    name: 'ドラゴンパルス', type: 'ドラゴン', category: 'special',
    power: 85, accuracy: 100, pp: 10,
    desc: '竜の波動で攻撃。',
  },
  'りゅうのまい': {
    name: 'りゅうのまい', type: 'ドラゴン', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '竜の舞。こうげき・すばやさ1段階UP。',
    effect: 'raiseAtkSpe', target: 'self'
  },
  'ドラゴンテール': {
    name: 'ドラゴンテール', type: 'ドラゴン', category: 'physical',
    power: 60, accuracy: 90, pp: 10, contact: true, priority: -6,
    desc: '竜の尾で弾く。相手を強制交代。',
    effect: 'forceSwitch'
  },
  'ドラゴンダイブ': {
    name: 'ドラゴンダイブ', type: 'ドラゴン', category: 'physical',
    power: 100, accuracy: 75, pp: 10, contact: true,
    desc: '竜の急降下。20%ひるみ。',
    effect: 'flinch20'
  },
  'コアドラゴンパンチ': {
    name: 'コアドラゴンパンチ', type: 'ドラゴン', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true, punch: true,
    desc: '竜の拳。竜の力を拳に凝縮。',
  },
  'ワイドブレイカー': {
    name: 'ワイドブレイカー', type: 'ドラゴン', category: 'physical',
    power: 60, accuracy: 100, pp: 15, contact: true,
    desc: '広範囲攻撃。100%こうげきDOWN。',
    effect: 'atkDrop100'
  },
  'スケイルショット': {
    name: 'スケイルショット', type: 'ドラゴン', category: 'physical',
    power: 25, accuracy: 90, pp: 20,
    desc: '鱗を2〜5枚飛ばす。使用後すばやさUP・ぼうぎょDOWN。',
    effect: 'multihit25_spe_def'
  },
  'ドラゴンエナジー': {
    name: 'ドラゴンエナジー', type: 'ドラゴン', category: 'special',
    power: 150, accuracy: 100, pp: 5,
    desc: '自分のHP割合で威力変動。最大150。',
    effect: 'maxHpPower'
  },
  'クラッシュドラゴン': {
    name: 'クラッシュドラゴン', type: 'ドラゴン', category: 'physical',
    power: 100, accuracy: 100, pp: 5, contact: true,
    desc: '竜の全身突撃。20%ひるみ。',
    effect: 'flinch20'
  },

  // =============================================================
  //  あくタイプ (16技)
  // =============================================================
  'あくのはどう': {
    name: 'あくのはどう', type: 'あく', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '悪のエネルギー。20%ひるみ。',
    effect: 'flinch20'
  },
  'かみくだく': {
    name: 'かみくだく', type: 'あく', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true, bite: true,
    desc: '噛み砕く。20%ぼうぎょDOWN。',
    effect: 'defDrop20'
  },
  'イカサマバースト': {
    name: 'イカサマバースト', type: 'あく', category: 'physical',
    power: 95, accuracy: 100, pp: 15,
    desc: '相手のこうげきで計算する。',
    effect: 'useEnemyAtk'
  },
  'やみのなみ': {
    name: 'やみのなみ', type: 'あく', category: 'special',
    power: 95, accuracy: 95, pp: 10,
    desc: '暗黒波。壁を破壊する。',
    effect: 'breakScreens'
  },
  'はんざいのいぬ': {
    name: 'はんざいのいぬ', type: 'あく', category: 'physical',
    power: 80, accuracy: 90, pp: 10, contact: true,
    desc: '犯人追跡。確定急所。',
    effect: 'alwaysCrit'
  },
  'あくまのけいやく': {
    name: 'あくまのけいやく', type: 'あく', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '悪魔との契約。全能力2段階UP。HP半分消費。',
    effect: 'sacrificeRaiseAll', target: 'self'
  },
  'ふいうちダガー': {
    name: 'ふいうちダガー', type: 'あく', category: 'physical',
    power: 70, accuracy: 100, pp: 5, priority: 1, contact: true,
    desc: '不意打ち。相手が攻撃技を選んでいるときのみ成功。優先度+1。',
    effect: 'sucker'
  },
  'つじぎり': {
    name: 'つじぎり', type: 'あく', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '辻斬り。急所率UP。',
    effect: 'highCrit'
  },
  'はたきおとし': {
    name: 'はたきおとし', type: 'あく', category: 'physical',
    power: 65, accuracy: 100, pp: 20, contact: true,
    desc: '持ち物を叩き落とす。持ち物があると威力1.5倍。',
    effect: 'knockOff'
  },
  'バークアウト': {
    name: 'バークアウト', type: 'あく', category: 'special',
    power: 55, accuracy: 95, pp: 15, sound: true,
    desc: '吠える。100%とくこうDOWN。',
    effect: 'spaDrop100'
  },
  'ちょうはつ': {
    name: 'ちょうはつ', type: 'あく', category: 'status',
    power: 0, accuracy: 100, pp: 20,
    desc: '挑発。3ターンの間攻撃技しか出せなくする。',
    effect: 'taunt', target: 'enemy'
  },
  'わるだくみ': {
    name: 'わるだくみ', type: 'あく', category: 'status',
    power: 0, accuracy: 0, pp: 20,
    desc: '悪巧み。とくこう2段階UP。',
    effect: 'raiseSpa2', target: 'self'
  },
  'ダークバインド': {
    name: 'ダークバインド', type: 'あく', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '闇で縛る。2〜5ターン束縛。',
    effect: 'trap25'
  },
  'ぺゆゆのうそ': {
    name: 'ぺゆゆのうそ', type: 'あく', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '嘘でぼうぎょ・とくぼう1段階DOWN。',
    effect: 'lowerDefSpdef', target: 'enemy'
  },
  'くろいまなざし': {
    name: 'くろいまなざし', type: 'あく', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '黒い眼差し。相手は逃げられない。',
    effect: 'meanLook', target: 'enemy'
  },
  'ナイトスラッシュ': {
    name: 'ナイトスラッシュ', type: 'あく', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '闇の斬撃。急所率UP。',
    effect: 'highCrit'
  },

  // =============================================================
  //  はがねタイプ (14技)
  // =============================================================
  'アイアンヘッド': {
    name: 'アイアンヘッド', type: 'はがね', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '金属の頭突き。30%ひるみ。',
    effect: 'flinch30'
  },
  'コメットパンチ': {
    name: 'コメットパンチ', type: 'はがね', category: 'physical',
    power: 90, accuracy: 90, pp: 10, contact: true, punch: true,
    desc: '流星パンチ。20%こうげきUP。',
    effect: 'selfAtkUp20'
  },
  'ラスターキャノン': {
    name: 'ラスターキャノン', type: 'はがね', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '光の砲撃。10%とくぼうDOWN。',
    effect: 'spdefDrop10'
  },
  'バレットパンチ': {
    name: 'バレットパンチ', type: 'はがね', category: 'physical',
    power: 40, accuracy: 100, pp: 30, priority: 1, contact: true, punch: true,
    desc: '弾丸の拳。優先度+1。',
  },
  'メタルクロー': {
    name: 'メタルクロー', type: 'はがね', category: 'physical',
    power: 50, accuracy: 95, pp: 35, contact: true,
    desc: '金属の爪。10%こうげきUP。',
    effect: 'selfAtkUp10'
  },
  'ヘビーボンバー': {
    name: 'ヘビーボンバー', type: 'はがね', category: 'physical',
    power: 0, accuracy: 100, pp: 10, contact: true,
    desc: '自分が重いほど威力UP（最大120）。',
    effect: 'heavySlam'
  },
  'ジャイロスピン': {
    name: 'ジャイロスピン', type: 'はがね', category: 'physical',
    power: 0, accuracy: 100, pp: 5, contact: true,
    desc: '遅いほど威力UP（最大150）。',
    effect: 'gyro'
  },
  'はがねのつるぎ': {
    name: 'はがねのつるぎ', type: 'はがね', category: 'physical',
    power: 90, accuracy: 100, pp: 15, contact: true,
    desc: '鋼の剣で斬る。',
  },
  'てっていバリア': {
    name: 'てっていバリア', type: 'はがね', category: 'status',
    power: 0, accuracy: 0, pp: 15, priority: 4,
    desc: '鉄壁の守り。そのターン攻撃を防ぎ接触した相手のこうげき2段階DOWN。',
    effect: 'protectSpiky', target: 'self'
  },
  'メタルバースト': {
    name: 'メタルバースト', type: 'はがね', category: 'physical',
    power: 0, accuracy: 100, pp: 10,
    desc: '受けたダメージを1.5倍にして返す。',
    effect: 'metalBurst'
  },
  'はがねのフィールド': {
    name: 'はがねのフィールド', type: 'はがね', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'ぼうぎょ・とくぼう1段階UP。',
    effect: 'raiseBothDef', target: 'self'
  },
  'ギアチェンジ': {
    name: 'ギアチェンジ', type: 'はがね', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'ギアを変えてこうげき1段階UP・すばやさ2段階UP。',
    effect: 'gearShift', target: 'self'
  },
  'メタルレイン': {
    name: 'メタルレイン', type: 'はがね', category: 'special',
    power: 95, accuracy: 90, pp: 10,
    desc: '鋼の雨。10%ひるみ。',
    effect: 'flinch10'
  },
  'スチールフィスト': {
    name: 'スチールフィスト', type: 'はがね', category: 'physical',
    power: 100, accuracy: 100, pp: 5, contact: true, punch: true,
    desc: '鋼鉄の拳。10%ぼうぎょDOWN。',
    effect: 'defDrop10'
  },

  // =============================================================
  //  フェアリータイプ (14技)
  // =============================================================
  'ムーンブラスト': {
    name: 'ムーンブラスト', type: 'フェアリー', category: 'special',
    power: 95, accuracy: 100, pp: 15,
    desc: '月の力。30%とくこうDOWN。',
    effect: 'spaDrop30'
  },
  'マジカルフラッシュ': {
    name: 'マジカルフラッシュ', type: 'フェアリー', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '魔法の光で攻撃。',
  },
  'マジカルフレイム': {
    name: 'マジカルフレイム', type: 'フェアリー', category: 'special',
    power: 75, accuracy: 100, pp: 10,
    desc: '魔法の炎。100%とくこうDOWN。',
    effect: 'spaDrop100'
  },
  'チャームボイス': {
    name: 'チャームボイス', type: 'フェアリー', category: 'special',
    power: 40, accuracy: 0, pp: 15, sound: true,
    desc: '可愛い声。必中技。',
  },
  'なやみのタネ': {
    name: 'なやみのタネ', type: 'フェアリー', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '相手の特性を無効化する。',
    effect: 'disableAbility', target: 'enemy'
  },
  'みゆゆステップ': {
    name: 'みゆゆステップ', type: 'フェアリー', category: 'physical',
    power: 65, accuracy: 100, pp: 20, contact: true,
    desc: '軽やかなステップ。すばやさ1段階UP。',
    effect: 'speedUpEachUse'
  },
  'かみのおくりもの': {
    name: 'かみのおくりもの', type: 'フェアリー', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '天使の加護。HP全回復。',
    effect: 'healAll', target: 'self'
  },
  'ドレインキッス': {
    name: 'ドレインキッス', type: 'フェアリー', category: 'special',
    power: 50, accuracy: 100, pp: 10,
    desc: 'キスで吸い取る。与ダメの75%回復。',
    drain: 75
  },
  'フェアリーウインド': {
    name: 'フェアリーウインド', type: 'フェアリー', category: 'special',
    power: 40, accuracy: 100, pp: 30,
    desc: '妖精の風。',
  },
  'じゃれつくアタック': {
    name: 'じゃれつくアタック', type: 'フェアリー', category: 'physical',
    power: 90, accuracy: 90, pp: 10, contact: true,
    desc: 'じゃれついて攻撃。10%こうげきDOWN。',
    effect: 'atkDrop10'
  },
  'ミストフィールド': {
    name: 'ミストフィールド', type: 'フェアリー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '5ターン霧のフィールド。状態異常無効・ドラゴン技半減。',
    effect: 'mistyTerrain', target: 'field'
  },
  'フラワーフォース': {
    name: 'フラワーフォース', type: 'フェアリー', category: 'special',
    power: 90, accuracy: 100, pp: 15,
    desc: '花の力で攻撃。晴れだと威力1.5倍。',
    effect: 'sunBoost'
  },
  'スターアサルト': {
    name: 'スターアサルト', type: 'フェアリー', category: 'physical',
    power: 150, accuracy: 100, pp: 5, contact: true,
    desc: '星の全力突撃。次ターン動けない。',
    effect: 'recharge'
  },
  'いやしのはどう': {
    name: 'いやしのはどう', type: 'フェアリー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '癒しの波動。味方のHP半分回復。',
    effect: 'healAllyHalf', target: 'self'
  },

  // =============================================================
  //  ハイパータイプ (10技)
  // =============================================================
  'はかいのさけび': {
    name: 'はかいのさけび', type: 'ハイパー', category: 'special',
    power: 120, accuracy: 80, pp: 5, sound: true,
    desc: '破壊神の叫び。全耐性を無視する貫通ダメージ。',
    effect: 'pierce'
  },
  'おでゴッドパンチ': {
    name: 'おでゴッドパンチ', type: 'ハイパー', category: 'physical',
    power: 140, accuracy: 85, pp: 5, contact: true, punch: true,
    desc: '神の拳。10%一撃ひんし。',
    effect: 'ohko10'
  },
  'うちゅうエネルギー': {
    name: 'うちゅうエネルギー', type: 'ハイパー', category: 'special',
    power: 100, accuracy: 100, pp: 5,
    desc: '宇宙の力で攻撃。全耐性貫通。',
    effect: 'pierceAll'
  },
  'ハイパーノヴァ': {
    name: 'ハイパーノヴァ', type: 'ハイパー', category: 'special',
    power: 160, accuracy: 80, pp: 5,
    desc: '超新星爆発。使用後とくこう3段階DOWN。',
    effect: 'spaDrop3'
  },
  'デストロイビーム': {
    name: 'デストロイビーム', type: 'ハイパー', category: 'special',
    power: 130, accuracy: 90, pp: 5,
    desc: '破壊光線。次ターン動けない。',
    effect: 'recharge'
  },
  'メガクラッシュ': {
    name: 'メガクラッシュ', type: 'ハイパー', category: 'physical',
    power: 130, accuracy: 90, pp: 5, contact: true,
    desc: '圧倒的な力で叩きつける。1/3反動。',
    effect: 'recoil33'
  },
  'ハイパーチャージ': {
    name: 'ハイパーチャージ', type: 'ハイパー', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '全能力2段階UP。次ターン動けない。',
    effect: 'raiseAll2_recharge', target: 'self'
  },
  'ジャッジメントレイ': {
    name: 'ジャッジメントレイ', type: 'ハイパー', category: 'special',
    power: 100, accuracy: 100, pp: 10,
    desc: '裁きの光。使用者のタイプで技タイプが変わる。',
    effect: 'judgment'
  },
  'ハイパーインパクト': {
    name: 'ハイパーインパクト', type: 'ハイパー', category: 'physical',
    power: 110, accuracy: 95, pp: 10, contact: true,
    desc: '超破壊力の一撃。20%ひるみ。',
    effect: 'flinch20'
  },
  'しゅくふくのひかり': {
    name: 'しゅくふくのひかり', type: 'ハイパー', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '祝福の光でHP全回復+状態異常回復。',
    effect: 'healAll', target: 'self'
  },

  // =============================================================
  //  カオスタイプ (8技)
  // =============================================================
  'カオスエネルギー': {
    name: 'カオスエネルギー', type: 'カオス', category: 'special',
    power: 0, accuracy: 100, pp: 10,
    desc: 'ランダムタイプのエネルギー（威力50〜150）。',
    effect: 'chaos'
  },
  'カオスバースト': {
    name: 'カオスバースト', type: 'カオス', category: 'special',
    power: 100, accuracy: 85, pp: 5,
    desc: '混沌の爆発。ランダムで追加効果が発動。',
    effect: 'chaosRandom'
  },
  'じくうのひずみ': {
    name: 'じくうのひずみ', type: 'カオス', category: 'special',
    power: 80, accuracy: 90, pp: 10,
    desc: '時空を歪める。20%混乱。',
    effect: 'confuse20'
  },
  'カオスフィールド': {
    name: 'カオスフィールド', type: 'カオス', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '5ターンの間全技のタイプがランダムに変わる。',
    effect: 'chaosField', target: 'field'
  },
  'むちつじょのかぜ': {
    name: 'むちつじょのかぜ', type: 'カオス', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '無秩序の風。ランダムで能力1段階UP/DOWN。',
    effect: 'chaosWind'
  },
  'げんそうほうかい': {
    name: 'げんそうほうかい', type: 'カオス', category: 'special',
    power: 120, accuracy: 75, pp: 5,
    desc: '幻想を崩壊させる。50%混乱。',
    effect: 'confuse50'
  },
  'カオスシード': {
    name: 'カオスシード', type: 'カオス', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '混沌の種。相手のランダムな能力を2段階DOWN。',
    effect: 'randomStatDrop2', target: 'enemy'
  },
  'エントロピーウェーブ': {
    name: 'エントロピーウェーブ', type: 'カオス', category: 'special',
    power: 90, accuracy: 95, pp: 10,
    desc: 'エントロピーの波。全場の能力変化をリセット。',
    effect: 'resetAll'
  },

  // =============================================================
  //  しれいタイプ (8技)
  // =============================================================
  'こうしんのぐんぜい': {
    name: 'こうしんのぐんぜい', type: 'しれい', category: 'physical',
    power: 25, accuracy: 100, pp: 20,
    desc: '兵士を4〜5体呼んで連続攻撃。',
    effect: 'multihit45'
  },
  'ぐんだんのさけび': {
    name: 'ぐんだんのさけび', type: 'しれい', category: 'special',
    power: 90, accuracy: 100, pp: 10, sound: true,
    desc: '軍団の雄叫び。20%こうげきDOWN。',
    effect: 'atkDrop20'
  },
  'しれいかんのめい': {
    name: 'しれいかんのめい', type: 'しれい', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '司令官の命令。こうげき・ぼうぎょ・すばやさ1段階UP。',
    effect: 'raiseAtkDefSpe', target: 'self'
  },
  'いちげきりだつ': {
    name: 'いちげきりだつ', type: 'しれい', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: '一撃離脱。攻撃後ひかえと交代。',
    effect: 'switchAfter'
  },
  'てきじんとっぱ': {
    name: 'てきじんとっぱ', type: 'しれい', category: 'physical',
    power: 120, accuracy: 90, pp: 5, contact: true,
    desc: '敵陣突破。ぼうぎょ・とくぼう1段階DOWN（自分）。',
    effect: 'defSpdefDrop1'
  },
  'ぼうえいたいせい': {
    name: 'ぼうえいたいせい', type: 'しれい', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '防衛態勢。ぼうぎょ・とくぼう2段階UP。',
    effect: 'raiseBothDef2', target: 'self'
  },
  'サツガイキャノン': {
    name: 'サツガイキャノン', type: 'しれい', category: 'special',
    power: 110, accuracy: 85, pp: 5,
    desc: 'サツガイ兄弟の合体砲。10%全能力DOWN。',
    effect: 'allStatDrop10'
  },
  'せんりゃくてったい': {
    name: 'せんりゃくてったい', type: 'しれい', category: 'status',
    power: 0, accuracy: 0, pp: 20, priority: -6,
    desc: '戦略的撤退。交代時にHP1/4回復。',
    effect: 'healSwitch', target: 'self'
  },

  // =============================================================
  //  げんそうタイプ (10技)
  // =============================================================
  'ゆめみちらし': {
    name: 'ゆめみちらし', type: 'げんそう', category: 'special',
    power: 85, accuracy: 90, pp: 10,
    desc: '夢の欠片を撒く。眠りの相手に威力2倍。',
    effect: 'doubleVsSleep'
  },
  'ゆばばのじゅもん': {
    name: 'ゆばばのじゅもん', type: 'げんそう', category: 'special',
    power: 80, accuracy: 90, pp: 10,
    desc: '強力な呪文。50%混乱。',
    effect: 'confuse50'
  },
  'チーばのかんとく': {
    name: 'チーばのかんとく', type: 'げんそう', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '状態異常回復+HP1/4回復。',
    effect: 'healQuarterCure', target: 'self'
  },
  'よびこみのじゅもん': {
    name: 'よびこみのじゅもん', type: 'げんそう', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '呪いのフィールド。毎ターン全員1/16ダメージ。',
    effect: 'hazardField', target: 'field'
  },
  'ふうじられたわざ': {
    name: 'ふうじられたわざ', type: 'げんそう', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '相手の技を1つ3ターン封じる。',
    effect: 'disable', target: 'enemy'
  },
  'げんそうのきり': {
    name: 'げんそうのきり', type: 'げんそう', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '幻想の霧。30%混乱。',
    effect: 'confuse30'
  },
  '5おくねんのあくむ': {
    name: '5おくねんのあくむ', type: 'げんそう', category: 'status',
    power: 0, accuracy: 90, pp: 5,
    desc: '5億年の恐怖。1〜3ターン眠らせる。',
    effect: 'sleep', target: 'enemy'
  },
  'げんそうバースト': {
    name: 'げんそうバースト', type: 'げんそう', category: 'special',
    power: 110, accuracy: 85, pp: 5,
    desc: '幻想の爆発。20%とくぼうDOWN。',
    effect: 'spdefDrop20'
  },
  'まぼろしのひかり': {
    name: 'まぼろしのひかり', type: 'げんそう', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '幻の光で相手を混乱させる。',
    effect: 'confuse100', target: 'enemy'
  },
  'げんそうドレイン': {
    name: 'げんそうドレイン', type: 'げんそう', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '幻想の力を吸い取る。与ダメの半分回復。',
    drain: 50
  },

  // =============================================================
  //  しゃっきんタイプ (6技)
  // =============================================================
  'しゃっきんとりたて': {
    name: 'しゃっきんとりたて', type: 'しゃっきん', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '借金を取り立てる。30%こうげきDOWN。',
    effect: 'atkDrop30'
  },
  'りそくがふえる': {
    name: 'りそくがふえる', type: 'しゃっきん', category: 'special',
    power: 40, accuracy: 100, pp: 20,
    desc: '利息増加。使うたびに威力が倍（最大640）。',
    effect: 'doubleEachUse'
  },
  'ふさいのくさり': {
    name: 'ふさいのくさり', type: 'しゃっきん', category: 'status',
    power: 0, accuracy: 90, pp: 10,
    desc: '負債の鎖。相手は逃げられず毎ターンHP1/8ダメージ。',
    effect: 'debtChain', target: 'enemy'
  },
  'さいむちょうかくレイ': {
    name: 'さいむちょうかくレイ', type: 'しゃっきん', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: '債務超過の光。とくこう2段階DOWN（自分）。',
    effect: 'spaDrop2'
  },
  'たんぽアタック': {
    name: 'たんぽアタック', type: 'しゃっきん', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '担保を回収する一撃。持ち物を奪う。',
    effect: 'knockOff'
  },
  'ばくさいバースト': {
    name: 'ばくさいバースト', type: 'しゃっきん', category: 'special',
    power: 150, accuracy: 80, pp: 5,
    desc: '爆砕。使用後HPが1になる。',
    effect: 'setHp1self'
  },

  // =============================================================
  //  しゃかいタイプ (6技)
  // =============================================================
  'しゃかいのあつりょく': {
    name: 'しゃかいのあつりょく', type: 'しゃかい', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '社会的圧力。30%とくこうDOWN。',
    effect: 'spaDrop30'
  },
  'どうちょうあつりょく': {
    name: 'どうちょうあつりょく', type: 'しゃかい', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '同調圧力。相手は3ターンの間変化技を使えない。',
    effect: 'taunt', target: 'enemy'
  },
  'コンプライアンス': {
    name: 'コンプライアンス', type: 'しゃかい', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '法令遵守。ぼうぎょ・とくぼう2段階UP。',
    effect: 'raiseBothDef2', target: 'self'
  },
  'ざんぎょうアタック': {
    name: 'ざんぎょうアタック', type: 'しゃかい', category: 'physical',
    power: 90, accuracy: 95, pp: 10, contact: true,
    desc: '残業のストレス。100%すばやさDOWN（自分）。',
    effect: 'selfSpeDrop1'
  },
  'しゃかいのかべ': {
    name: 'しゃかいのかべ', type: 'しゃかい', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '社会の壁。5ターン物理・特殊ダメ半減。',
    effect: 'auroraVeil', target: 'field'
  },
  'けいざいはたん': {
    name: 'けいざいはたん', type: 'しゃかい', category: 'special',
    power: 120, accuracy: 85, pp: 5,
    desc: '経済破綻。全場の能力変化リセット+ダメージ。',
    effect: 'clearAndDmg'
  },

  // =============================================================
  //  追加キャラ固有技・汎用技
  // =============================================================
  'いっぴつがきアタック': {
    name: 'いっぴつがきアタック', type: 'ぷゆ', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '一筆書きの全身攻撃。',
  },
  'せんべいスロー': {
    name: 'せんべいスロー', type: 'ノーマル', category: 'physical',
    power: 50, accuracy: 100, pp: 25,
    desc: 'せんべいを投げつける。',
  },
  'クッキークラッシュ': {
    name: 'クッキークラッシュ', type: 'ノーマル', category: 'physical',
    power: 65, accuracy: 100, pp: 20,
    desc: 'クッキーで殴る。10%ひるみ。',
    effect: 'flinch10'
  },
  'レモンスプラッシュ': {
    name: 'レモンスプラッシュ', type: 'くさ', category: 'special',
    power: 55, accuracy: 100, pp: 20,
    desc: 'レモン汁を浴びせる。30%命中率DOWN。',
    effect: 'accDrop30'
  },
  'コインフリップ': {
    name: 'コインフリップ', type: 'ノーマル', category: 'special',
    power: 0, accuracy: 100, pp: 10,
    desc: 'コイントス。表なら威力100、裏なら自分に50ダメージ。',
    effect: 'coinFlip'
  },
  'バスケットシュート': {
    name: 'バスケットシュート', type: 'ノーマル', category: 'physical',
    power: 80, accuracy: 85, pp: 15,
    desc: 'ボールをシュート。急所率UP。',
    effect: 'highCrit'
  },
  'フラワーバースト': {
    name: 'フラワーバースト', type: 'くさ', category: 'special',
    power: 75, accuracy: 100, pp: 15,
    desc: '花弁を飛ばす。相手がくさタイプなら威力2倍。',
    effect: 'doubleVsGrass'
  },
  'クロックストライク': {
    name: 'クロックストライク', type: 'ノーマル', category: 'physical',
    power: 0, accuracy: 100, pp: 5,
    desc: '時計の針。ターン数×15のダメージ。',
    effect: 'turnDamage'
  },
  'ディスクスラッシュ': {
    name: 'ディスクスラッシュ', type: 'はがね', category: 'physical',
    power: 70, accuracy: 95, pp: 15,
    desc: 'ディスクを飛ばす。急所率UP。',
    effect: 'highCrit'
  },
  'おうかんのいちげき': {
    name: 'おうかんのいちげき', type: 'ぷゆ', category: 'physical',
    power: 100, accuracy: 100, pp: 5, contact: true,
    desc: '王冠の一撃。王の威厳。20%全能力1段階DOWN（相手）。',
    effect: 'allStatDrop20'
  },
  'クイーンズコマンド': {
    name: 'クイーンズコマンド', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '女王の命令。こうげき・とくこう・すばやさ1段階UP。',
    effect: 'raiseAtkSpaSpe', target: 'self'
  },
  'レンジャーストライク': {
    name: 'レンジャーストライク', type: 'ぷゆ', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: 'レンジャーの一撃。仲間がいると威力1.5倍。',
    effect: 'allyBoost'
  },
  'レンジャーコンボ': {
    name: 'レンジャーコンボ', type: 'ぷゆ', category: 'physical',
    power: 25, accuracy: 100, pp: 10,
    desc: 'レンジャー連携。6回攻撃。',
    effect: 'hit6'
  },
  'きずのいたみ': {
    name: 'きずのいたみ', type: 'ぷゆ', category: 'physical',
    power: 60, accuracy: 100, pp: 20, contact: true,
    desc: '傷の痛みで攻撃。接触するたび相手にもダメージ。',
    effect: 'contactRecoilEnemy'
  },
  'ミステリアスショット': {
    name: 'ミステリアスショット', type: 'げんそう', category: 'special',
    power: 80, accuracy: 100, pp: 15,
    desc: '不思議な弾。追加効果がランダム。',
    effect: 'randomEffect'
  },
  'ふういんかいほう': {
    name: 'ふういんかいほう', type: 'げんそう', category: 'special',
    power: 100, accuracy: 95, pp: 5,
    desc: '封印を解放して攻撃。使用後全能力1段階UP。',
    effect: 'raiseAll1after'
  },
  'なるとスピン': {
    name: 'なるとスピン', type: 'ぷゆ', category: 'physical',
    power: 50, accuracy: 100, pp: 25,
    desc: '渦巻き回転攻撃。まきびし・ステルストラップを除去。',
    effect: 'rapidSpin'
  },
  '5おくねんボタン': {
    name: '5おくねんボタン', type: 'エスパー', category: 'status',
    power: 0, accuracy: 100, pp: 5,
    desc: '5億年ボタン。相手を1ターン行動不能にするが自分も動けない。',
    effect: 'mutualStun', target: 'enemy'
  },
  'にゃざーるのまもり': {
    name: 'にゃざーるのまもり', type: 'エスパー', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '邪視のお守り。5ターンの間状態異常を防ぐ。',
    effect: 'safeguard', target: 'field'
  },
  'くろぷゆアタック': {
    name: 'くろぷゆアタック', type: 'しれい', category: 'physical',
    power: 40, accuracy: 100, pp: 20,
    desc: '黒ぷゆ兵士の突撃。2回攻撃。',
    effect: 'twiceHit'
  },
  '3Dプリント': {
    name: '3Dプリント', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '自分の分身を作る（みがわり）。HP1/4消費。',
    effect: 'substitute', target: 'self'
  },
  'コンパスナビ': {
    name: 'コンパスナビ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '方角を読む。命中率・回避率1段階UP。',
    effect: 'raiseAccEva', target: 'self'
  },
  'けんえつビーム': {
    name: 'けんえつビーム', type: 'あく', category: 'special',
    power: 75, accuracy: 100, pp: 15,
    desc: '検閲の光。相手の最後の技を3ターン封印。',
    effect: 'disable'
  },
  'ちんもくのくうかん': {
    name: 'ちんもくのくうかん', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '沈黙の空間。5ターン音技を無効化。',
    effect: 'soundproof', target: 'field'
  },
  'はかせのこうぎ': {
    name: 'はかせのこうぎ', type: 'エスパー', category: 'special',
    power: 60, accuracy: 100, pp: 20,
    desc: '博士の講義。100%とくこうUP（自分）。',
    effect: 'spaUp100self'
  },
  'スモールショット': {
    name: 'スモールショット', type: 'ぷゆ', category: 'special',
    power: 30, accuracy: 100, pp: 35,
    desc: '小さな弾。必ず先制。',
    priority: 1
  },
  'とうめいアタック': {
    name: 'とうめいアタック', type: 'ゴースト', category: 'physical',
    power: 70, accuracy: 0, pp: 20, contact: true,
    desc: '透明からの攻撃。必中。',
  },
  'クリーチャーハウル': {
    name: 'クリーチャーハウル', type: 'ぷゆ', category: 'special',
    power: 90, accuracy: 95, pp: 10, sound: true,
    desc: 'クリーチャーの咆哮。20%ひるみ。音技。',
    effect: 'flinch20'
  },
  'せんのうウェーブ': {
    name: 'せんのうウェーブ', type: 'エスパー', category: 'special',
    power: 65, accuracy: 90, pp: 15,
    desc: '洗脳の波。50%混乱。',
    effect: 'confuse50'
  },
  'しゃりんのいかり': {
    name: 'しゃりんのいかり', type: 'はがね', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '車輪の回転攻撃。使用後すばやさ1段階UP。',
    effect: 'speedUpEachUse'
  },
  'はぐるまかみあい': {
    name: 'はぐるまかみあい', type: 'はがね', category: 'physical',
    power: 50, accuracy: 100, pp: 20, contact: true,
    desc: '歯車の噛み合い。2ターン束縛。',
    effect: 'trap25'
  },
  'しょっかくセンサー': {
    name: 'しょっかくセンサー', type: 'むし', category: 'status',
    power: 0, accuracy: 0, pp: 15,
    desc: '触覚で偵察。相手の情報を全て見る+回避率UP。',
    effect: 'revealAndEva', target: 'self'
  },
  'ぼうけんのきぼう': {
    name: 'ぼうけんのきぼう', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: '冒険の希望。こうげき・すばやさ1段階UP。',
    effect: 'raiseAtkSpe', target: 'self'
  },
  'ハジハジプレス': {
    name: 'ハジハジプレス', type: 'ぷゆ', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true,
    desc: 'はじはじの力で押しつぶす。こうげき・とくこうDOWN（相手）。',
    effect: 'lowerAtkSpa1'
  },
  'ぴえんボイス': {
    name: 'ぴえんボイス', type: 'ぷゆ', category: 'special',
    power: 55, accuracy: 100, pp: 20, sound: true,
    desc: 'ぴえんの声。100%とくこうDOWN（相手）。',
    effect: 'spaDrop100'
  },
  'とくこアタック': {
    name: 'とくこアタック', type: 'ぷゆ', category: 'physical',
    power: 60, accuracy: 100, pp: 25, contact: true,
    desc: '徹子の突進。こうげき1段階UP（自分）。',
    effect: 'atkUp1self'
  },
  'ペンギンスライド': {
    name: 'ペンギンスライド', type: 'こおり', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: 'ペンギンのスライディング。すばやさUP。',
    effect: 'speedUpEachUse'
  },
  'はっこうパルス': {
    name: 'はっこうパルス', type: 'でんき', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: 'ひらめきの光。50%とくこうUP（自分）。',
    effect: 'spaUp50self'
  },
  'ハロウィンフレイム': {
    name: 'ハロウィンフレイム', type: 'ゴースト', category: 'special',
    power: 85, accuracy: 100, pp: 10,
    desc: 'ハロウィンの炎。20%やけど。',
    effect: 'burn20'
  },
  'サイクロプスビーム': {
    name: 'サイクロプスビーム', type: 'ほのお', category: 'special',
    power: 100, accuracy: 90, pp: 5,
    desc: '一つ目から放つ灼熱光線。30%やけど。',
    effect: 'burn30'
  },
  'くさったいき': {
    name: 'くさったいき', type: 'どく', category: 'special',
    power: 70, accuracy: 90, pp: 15,
    desc: '腐った息。50%どく。',
    effect: 'poison50'
  },
  'まっぷたつ': {
    name: 'まっぷたつ', type: 'ノーマル', category: 'physical',
    power: 80, accuracy: 100, pp: 10, contact: true,
    desc: '真っ二つに斬る。ぼうぎょを無視してダメージ。',
    effect: 'ignoreDefense'
  },
  'ひみつのちから': {
    name: 'ひみつのちから', type: 'げんそう', category: 'special',
    power: 70, accuracy: 100, pp: 20,
    desc: '秘密の力。フィールドに応じて追加効果変化。',
    effect: 'fieldEffect'
  },
  'おじょうさまビーム': {
    name: 'おじょうさまビーム', type: 'フェアリー', category: 'special',
    power: 85, accuracy: 100, pp: 10,
    desc: 'お嬢様の優雅な光線。30%とくこうDOWN（相手）。',
    effect: 'spaDrop30'
  },
  'ぶらうざクラッシュ': {
    name: 'ぶらうざクラッシュ', type: 'カオス', category: 'special',
    power: 75, accuracy: 80, pp: 10,
    desc: 'ブラウザがクラッシュする衝撃。30%混乱。',
    effect: 'confuse30'
  },
  'うまのいななき': {
    name: 'うまのいななき', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 100, pp: 20, sound: true,
    desc: '馬のいななき。こうげき1段階UP（自分）+こうげきDOWN（相手）。',
    effect: 'selfAtkUpEnemyAtkDown'
  },
  'くりのからショット': {
    name: 'くりのからショット', type: 'くさ', category: 'physical',
    power: 60, accuracy: 100, pp: 20,
    desc: '栗のイガを飛ばす。接触すると相手にダメージ。',
    effect: 'contactDamage'
  },
  'えがおのちから': {
    name: 'えがおのちから', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '笑顔の力。全能力1段階UP。',
    effect: 'raiseAll1', target: 'self'
  },
  'ODブレイク': {
    name: 'ODブレイク', type: 'ノーマル', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true,
    desc: 'O.D.の突撃。20%こうげきUP（自分）。',
    effect: 'selfAtkUp20'
  },
  'たかしのテレパシー': {
    name: 'たかしのテレパシー', type: 'エスパー', category: 'special',
    power: 80, accuracy: 100, pp: 10,
    desc: '宇宙人のテレパシー。20%とくぼうDOWN。',
    effect: 'spdefDrop20'
  },
  'シコリエルのつばさ': {
    name: 'シコリエルのつばさ', type: 'ひこう', category: 'physical',
    power: 85, accuracy: 100, pp: 10, contact: true,
    desc: '天使の翼で打つ。10%全能力UP（自分）。',
    effect: 'allStatUp10self'
  },
  'あくまのツメ': {
    name: 'あくまのツメ', type: 'あく', category: 'physical',
    power: 80, accuracy: 100, pp: 15, contact: true,
    desc: '悪魔の爪。20%ひるみ。',
    effect: 'flinch20'
  },
  'サツガイラッシュ': {
    name: 'サツガイラッシュ', type: 'しれい', category: 'physical',
    power: 30, accuracy: 100, pp: 15, contact: true,
    desc: 'サツガイの連撃。3回攻撃。',
    effect: 'hit3'
  },
  'ジェネリックコピー': {
    name: 'ジェネリックコピー', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '相手の技を1つコピーして使う（PP5）。',
    effect: 'mimic', target: 'enemy'
  },
  'ダークサイドフォース': {
    name: 'ダークサイドフォース', type: 'あく', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '暗黒面の力。HP1/2以下で威力2倍。',
    effect: 'pinchDouble'
  },
  'ライトニングオーラ': {
    name: 'ライトニングオーラ', type: 'でんき', category: 'special',
    power: 90, accuracy: 100, pp: 10,
    desc: '光のオーラで攻撃。10%まひ。10%自分すばやさUP。',
    effect: 'paralyze10_selfSpeUp10'
  },
  'リングスロー': {
    name: 'リングスロー', type: 'ノーマル', category: 'physical',
    power: 55, accuracy: 90, pp: 20,
    desc: 'リングを投げつける。2回攻撃。',
    effect: 'twiceHit'
  },
  'ホワイトリング': {
    name: 'ホワイトリング', type: 'フェアリー', category: 'special',
    power: 70, accuracy: 100, pp: 15,
    desc: '白い輪の光。20%とくぼうUP（自分）。',
    effect: 'selfSpdUp20'
  },
  'ぱくちんパンチ': {
    name: 'ぱくちんパンチ', type: 'かくとう', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true, punch: true,
    desc: '朴ちんの怒りのパンチ。10%混乱。',
    effect: 'confuse10'
  },
  'ひらめきフラッシュ': {
    name: 'ひらめきフラッシュ', type: 'でんき', category: 'special',
    power: 75, accuracy: 100, pp: 15,
    desc: 'ひらめきの閃光。50%とくこうUP（自分）。',
    effect: 'spaUp50self'
  },
  'さつじんきのナイフ': {
    name: 'さつじんきのナイフ', type: 'あく', category: 'physical',
    power: 90, accuracy: 95, pp: 10, contact: true,
    desc: '殺人鬼のナイフ。急所率MAX。',
    effect: 'alwaysCrit'
  },
  'マツモトキック': {
    name: 'マツモトキック', type: 'かくとう', category: 'physical',
    power: 70, accuracy: 100, pp: 20, contact: true,
    desc: 'まつもとさんのキック。',
  },
  'マツモトおばちゃんビンタ': {
    name: 'マツモトおばちゃんビンタ', type: 'ノーマル', category: 'physical',
    power: 25, accuracy: 85, pp: 10, contact: true,
    desc: '2〜5回ビンタ。',
    effect: 'multihit25'
  },
  'はかいしんのけん': {
    name: 'はかいしんのけん', type: 'ハイパー', category: 'physical',
    power: 120, accuracy: 90, pp: 5, contact: true,
    desc: '破壊神の拳。20%ぼうぎょDOWN（相手）。',
    effect: 'defDrop20'
  },
  'さとりのいちげき': {
    name: 'さとりのいちげき', type: 'エスパー', category: 'physical',
    power: 90, accuracy: 100, pp: 10, contact: true,
    desc: '悟りの一撃。相手の回避率無視。',
    effect: 'ignoreEvasion'
  },
  'たいようのめぐみ': {
    name: 'たいようのめぐみ', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: '太郎の恵み。HP1/2回復し状態異常も治す。',
    effect: 'healHalf', target: 'self'
  },
  'トランスチェンジ': {
    name: 'トランスチェンジ', type: 'ノーマル', category: 'status',
    power: 0, accuracy: 0, pp: 10,
    desc: 'こうげきととくこうの実数値を入れ替える。',
    effect: 'swapAtkSpa', target: 'self'
  },
  'しゃかいじんのつとめ': {
    name: 'しゃかいじんのつとめ', type: 'しゃかい', category: 'physical',
    power: 75, accuracy: 100, pp: 15, contact: true,
    desc: '社会人の務め。毎ターン使うと威力+10。',
    effect: 'growingPower'
  },
  'アンノーンパルス': {
    name: 'アンノーンパルス', type: 'げんそう', category: 'special',
    power: 60, accuracy: 100, pp: 20,
    desc: '未知の波動。タイプがランダムに変わる。',
    effect: 'randomType'
  },
  'うゆゆのうた': {
    name: 'うゆゆのうた', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 55, pp: 15, sound: true,
    desc: '不思議な歌で相手を眠らせる。',
    effect: 'sleep', target: 'enemy'
  },
  'にせものアタック': {
    name: 'にせものアタック', type: 'あく', category: 'physical',
    power: 70, accuracy: 100, pp: 15, contact: true,
    desc: '偽物の攻撃。相手の最後に使った技をコピー。',
    effect: 'copyLastMove'
  },
  'ほんもののちから': {
    name: 'ほんもののちから', type: 'ぷゆ', category: 'special',
    power: 95, accuracy: 100, pp: 10,
    desc: '本物の力。効果抜群の倍率がさらにUP。',
    effect: 'superEffectBoost'
  },
  'きょうふのかお': {
    name: 'きょうふのかお', type: 'ゴースト', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '恐怖の顔。すばやさ2段階DOWN。',
    effect: 'speDrop2', target: 'enemy'
  },
  'むてきのえがお': {
    name: 'むてきのえがお', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 100, pp: 10,
    desc: '無敵の笑顔。相手のこうげき2段階DOWN。',
    effect: 'lowerAtk2', target: 'enemy'
  },
  'ぼくちんのゆうき': {
    name: 'ぼくちんのゆうき', type: 'ぷゆ', category: 'status',
    power: 0, accuracy: 0, pp: 5,
    desc: 'ぼくちんの勇気。HP1/4以下で全能力2段階UP。',
    effect: 'pinchAllUp2', target: 'self'
  },
  'おうごんパンチ': {
    name: 'おうごんパンチ', type: 'ぷゆ', category: 'physical',
    power: 100, accuracy: 95, pp: 5, contact: true, punch: true,
    desc: '黄金の拳。20%こうげきUP（自分）。',
    effect: 'selfAtkUp20'
  },
};

// =====================================================
// ユーティリティ
// =====================================================
function getMoveNames() {
  return Object.keys(MOVES);
}
