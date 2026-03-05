(() => {
  'use strict';

  // -------------------------
  // Data source（var data / window.garupa9thData 両対応）
  // -------------------------
  const src =
    typeof window.data !== 'undefined' && Array.isArray(window.data)
      ? window.data
      : Array.isArray(window.garupa9thData)
        ? window.garupa9thData
        : null;

  if (!src) return;

  // -------------------------
  // Helpers（落ちない最小）
  // -------------------------
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const setText = (sel, v, root = document) => {
    const el = qs(sel, root);
    if (!el) return;
    el.textContent = v == null ? '' : String(v);
  };
  const setAttr = (sel, attr, v, root = document) => {
    const el = qs(sel, root);
    if (!el) return;
    el.setAttribute(attr, v == null ? '' : String(v));
  };
  const safeStr = (v) => (v == null ? '' : String(v));
  const safeNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // YYYYMMDD -> YYYY.MM.DD
  const formatYmdDot = (ymd) => {
    const s = safeStr(ymd);
    if (!/^\d{8}$/.test(s)) return s;
    return `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)}`;
  };

  const stars = (n) => '★'.repeat(Math.max(0, safeNum(n)));

  // キャラID -> 表示名（最小：名前だけ）
  const charNameById = (id) => {
    const cid = safeNum(id);
    const table = {
      1: '戸山 香澄',
      2: '花園 たえ',
      3: '牛込 りみ',
      4: '山吹 沙綾',
      5: '市ヶ谷 有咲',
      6: '美竹 蘭',
      7: '青葉 モカ',
      8: '上原 ひまり',
      9: '宇田川 巴',
      10: '羽沢 つぐみ',
      11: '弦巻 こころ',
      12: '瀬田 薫',
      13: '北沢 はぐみ',
      14: '松原 花音',
      15: '奥沢 美咲',
      16: '丸山 彩',
      17: '氷川 日菜',
      18: '白鷺 千聖',
      19: '大和 麻弥',
      20: '若宮 イヴ',
      21: '湊 友希那',
      22: '氷川 紗夜',
      23: '今井 リサ',
      24: '宇田川 あこ',
      25: '白金 燐子',
      26: '倉田 ましろ',
      27: '桐ヶ谷 透子',
      28: '広町 七深',
      29: '二葉 つくし',
      30: '八潮 瑠唯',
      31: 'レイヤ',
      32: 'ロック',
      33: 'マスキング',
      34: 'パレオ',
      35: 'チュチュ',
      36: '高松 燈',
      37: '千早 愛音',
      38: '要 楽奈',
      39: '長崎 そよ',
      40: '椎名 立希',
    };
    return table[cid] || '';
  };

  // クリア率：対象DOM(.top-player__graph-item...)に反映
  const setGraph = (selector, cleared, total) => {
    const el = qs(selector);
    if (!el) return;

    const c = safeNum(cleared);
    const t = safeNum(total);
    const pct = t > 0 ? (c / t) * 100 : 0;

    el.style.height = `${pct.toFixed(1)}%`;

    const spans = el.querySelectorAll('.top-player__graph-score span');
    if (spans[0]) spans[0].textContent = String(c);
    if (spans[1]) spans[1].textContent = String(t);

    const p = el.querySelector('.top-player__graph-percent');
    if (p) p.textContent = `${pct.toFixed(1)}%`;
  };

  // -------------------------
  // Extract
  // -------------------------
  const user = src[0] || {};
  const loginDays = src[1];
  const first = src[2] || {}; // { "1": stars, "2": charId, "3": cardName }
  const fullcombo = src[3] || {}; // { "1".."5": song }
  const cards = src[4] || {}; // { "1": collected, "2": total }
  const mostCharId = src[5]; // number
  const clear = src[6] || {}; // { "1".."5": { "1": cleared, "2": total } }
  const topEvent = src[8] || {}; // { "1": eventName, "2": rank }
  const story = src[9] || {}; // { "1": main, "2": band, "3": event }
  const lounge = src[10];
  const syncSong = src[11];

  // -------------------------
  // 既存HTMLの差し替え
  // -------------------------

  // PLAYER PASS
  setText('.top-player__identity-id', user['1']);
  setText('.top-player__identity-name', user['2']);
  setText('.top-player__identity-join span', formatYmdDot(user['3']));

  // DATA01（ブロック順固定：1つ目）
  const blocks = qsa('.top-player__data-block');
  const block01 = blocks[0];
  if (block01) {
    const items = qsa('.top-player__data-item', block01);

    // 1) ログイン日数
    if (items[0]) setText('.number', loginDays, items[0]);

    // 2) 読了済みストーリー（3つの.number）
    if (items[1]) {
      const nums = qsa('.number', items[1]);
      if (nums[0]) nums[0].textContent = safeStr(story['1']);
      if (nums[1]) nums[1].textContent = safeStr(story['2']);
      if (nums[2]) nums[2].textContent = safeStr(story['3']);
    }

    // 3) ラウンジ会話視聴
    if (items[2]) setText('.number', lounge, items[2]);
  }

  // DATA02（ブロック順固定：2つ目）
  const block02 = blocks[1];
  if (block02) {
    const items = qsa('.top-player__data-item', block02);

    // 1) 集めたメンバー 512 / 780
    if (items[0])
      setText(
        '.number',
        `${safeStr(cards['1'])} / ${safeStr(cards['2'])}`,
        items[0]
      );

    // 2) 一番集めているキャラクター（名前）
    if (items[1])
      setText('.top-player__data-name', charNameById(mostCharId), items[1]);

    // 3) 最初に引いたメンバー（名前 / ★ / カード名）
    if (items[2]) {
      setText('.top-player__data-name', charNameById(first['2']), items[2]);
      setText('.card-star', stars(first['1']), items[2]);
      setText('.card-name', first['3'], items[2]);
    }

    // 下部のキャラ画像（最も集めているキャラ）
    const id = safeNum(mostCharId);
    if (id > 0) {
      setAttr(
        '.top-player__data-chara span img',
        'src',
        `./assets/img/member/${id}/member.png`,
        block02
      );
      setAttr(
        '.top-player__data-chara span img',
        'alt',
        charNameById(id),
        block02
      );
    }
  }

  // DATA03 クリア率グラフ
  const getPair = (obj) =>
    obj && typeof obj === 'object'
      ? { c: obj['1'], t: obj['2'] }
      : { c: 0, t: 0 };

  const e = getPair(clear['1']);
  const n = getPair(clear['2']);
  const h = getPair(clear['3']);
  const ex = getPair(clear['4']);
  const sp = getPair(clear['5']);

  setGraph('.top-player__graph-item.is-easy', e.c, e.t);
  setGraph('.top-player__graph-item.is-normal', n.c, n.t);
  setGraph('.top-player__graph-item.is-hard', h.c, h.t);
  setGraph('.top-player__graph-item.is-expert', ex.c, ex.t);
  setGraph('.top-player__graph-item.is-special', sp.c, sp.t);

  // DATA04（ブロック順固定：4つ目）
  const block04 = blocks[3];
  if (block04) {
    // data-level一致でpを書き換え
    const songWrap = qs('.top-player__data-song', block04);
    if (songWrap) {
      const setSong = (level, key) => {
        const p = qs(`.level[data-level="${level}"] p`, songWrap);
        if (p) p.textContent = safeStr(fullcombo[key]);
      };
      setSong('EASY', '1');
      setSong('NORMAL', '2');
      setSong('HARD', '3');
      setSong('EXPERT', '4');
      setSong('SPECIAL', '5');
    }

    // 初TOP10000（pを作り直さず、テキスト + span を整形）
    const topItem = qsa('.top-player__data-item', block04).find((item) =>
      safeStr(qs('h3', item)?.textContent).includes('TOP10000')
    );
    if (topItem) {
      const p = qs('.top-player__data-txt', topItem);
      if (p) {
        p.textContent = ` ${safeStr(topEvent['1'])} `;
        const spn = document.createElement('span');
        spn.textContent = `（${safeStr(topEvent['2'])}位）`;
        p.appendChild(spn);
      }
    }

    // 同期の楽曲
    const syncItem = qsa('.top-player__data-item', block04).find((item) =>
      safeStr(qs('h3', item)?.textContent).includes('同期')
    );
    if (syncItem)
      setText('.top-player__data-txt', ` ${safeStr(syncSong)} `, syncItem);
  }
})();
