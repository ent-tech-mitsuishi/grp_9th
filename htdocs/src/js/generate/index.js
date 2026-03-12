import './device.js';

const DIFFICULTY_LABELS = {
  1: 'EASY',
  2: 'NORMAL',
  3: 'HARD',
  4: 'EXPERT',
  5: 'SPECIAL',
};

const CHARACTER_NAMES = {
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

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 1600;
const HIGH_QUALITY_MODE = true;
const RENDER_SCALE = HIGH_QUALITY_MODE ? 2 : 1;
const EXPORT_MIME_TYPE = HIGH_QUALITY_MODE ? 'image/png' : 'image/jpeg';

const GRAPH_STYLE = {
  chartLeft: 704,
  chartTop: 835,
  chartRight: 1105,
  chartBottom: 1125,
  barWidth: 50,
  barGap: 38,
  colors: ['#a6c4ff', '#93ffc1', '#ffeb97', '#ffc4c4', '#ffa9e8'],
  value: {
    color: '#222',
    size: 24,
    weight: 700,
    align: 'center',
    family: '"Roboto", "Noto Sans", sans-serif',
    letterSpacing: 0,
  },
  rate: {
    color: '#222',
    size: 30,
    weight: 700,
    align: 'center',
    family: '"Roboto", "Noto Sans", sans-serif',
    letterSpacing: 0,
    symbolLetterSpacing: 0,
  },
  fraction: {
    lineWidth: 3,
    lineHalfWidth: 24,
    numeratorOffsetY: -44,
    denominatorOffsetY: -15,
    barOffsetY: -32,
  },
  tenPercentCenterOffsetY: 180,
  labelBounds: {
    top: 56,
    bottom: 24,
  },
  rateBounds: {
    top: 20,
    bottom: 0,
  },
};

const detectAssetBasePath = () => {
  const marker = 'assets/img/';
  const imageWithAssetPath = document.querySelector(`img[src*="${marker}"]`);
  const src = imageWithAssetPath?.getAttribute('src') || '';
  const markerIndex = src.indexOf(marker);
  if (markerIndex < 0) return './assets';
  return src.slice(0, markerIndex + 'assets'.length);
};

const ASSET_BASE_PATH = detectAssetBasePath();
const BASE_IMAGE_PATH = `${ASSET_BASE_PATH}/img/generate/base/base.jpg`;
const CATCH_IMAGE_PATH = `${ASSET_BASE_PATH}/img/generate/base/catch.png`;
const CHARACTER_IMAGE_BASE = `${ASSET_BASE_PATH}/img/generate/chara`;
const DOWNLOAD_FILE_PREFIX = 'garupa9th_flyer';
const FONT_FACE_ROBOTO = '"Roboto"';
const FONT_FACE_ZEN_KAKU = '"Zen Kaku Gothic Antique"';
const FONT_FAMILY_DEFAULT = '"Noto Sans", "Noto Sans JP", sans-serif';
const FONT_FAMILY_ROBOTO = '"Roboto", "Noto Sans", sans-serif';
const FONT_FAMILY_ZEN_KAKU =
  '"Zen Kaku Gothic Antique", "Noto Sans JP", sans-serif';
const PLAYER_PASS_ANGLE = -4.2;

const TEXT_LAYOUT = {
  playerPass: {
    id: {
      x: 170,
      y: 385,
      size: 28,
      weight: 500,
      family: FONT_FAMILY_ROBOTO,
      letterSpacing: 0,
    },
    name: {
      x: 175,
      y: 427,
      size: 36,
      weight: 500,
      family: FONT_FAMILY_ZEN_KAKU,
      letterSpacing: 0,
    },
    since: {
      x: 175,
      y: 499,
      size: 28,
      weight: 500,
      family: FONT_FAMILY_ROBOTO,
      letterSpacing: 0,
    },
  },
  playRecord: {
    // Right edge 기준 (number area). Keep align:'right' for all values.
    loginDays: {
      x: 1106,
      y: DEVICE.isIos ? 280 : 286,
      size: 56,
      weight: 600,
      family: FONT_FAMILY_ROBOTO,
      color: '#e34557',
      align: 'right',
      letterSpacing: 0,
    },
    storyMain: {
      x: 1065,
      y: DEVICE.isIos ? 405 : 407,
      size: 28,
      weight: 500,
      family: FONT_FAMILY_ROBOTO,
      color: '#e34557',
      align: 'right',
      letterSpacing: 0,
    },
    storyBand: {
      x: 1065,
      y: DEVICE.isIos ? 448 : 450,
      size: 28,
      weight: 500,
      family: FONT_FAMILY_ROBOTO,
      color: '#e34557',
      align: 'right',
      letterSpacing: 0,
    },
    storyEvent: {
      x: 1065,
      y: DEVICE.isIos ? 491 : 493,
      size: 28,
      weight: 500,
      family: FONT_FAMILY_ROBOTO,
      color: '#e34557',
      align: 'right',
      letterSpacing: 0,
    },
    lounge: {
      x: 1136,
      y: DEVICE.isIos ? 573 : 576,
      size: 56,
      weight: 600,
      family: FONT_FAMILY_ROBOTO,
      color: '#e34557',
      align: 'right',
      letterSpacing: -2,
    },
  },
  member: {
    cardCount: {
      x: 42,
      y: DEVICE.isIos ? 782 : 787,
      size: 56,
      weight: 600,
      family: FONT_FAMILY_ROBOTO,
      color: '#e34557',
      letterSpacing: -4,
    },
    mostCollectedName: {
      x: 42,
      y: 912,
      size: 56,
      weight: 800,
      family: FONT_FAMILY_ZEN_KAKU,
      color: '#e34557',
      letterSpacing: 0,
    },
    firstMemberName: {
      x: 42,
      y: 1046,
      size: 56,
      weight: 800,
      family: FONT_FAMILY_ZEN_KAKU,
      color: '#e34557',
      letterSpacing: 0,
    },
    firstMemberStar: {
      x: 44,
      y: 1094,
      size: 24,
      weight: 600,
      family: FONT_FAMILY_ZEN_KAKU,
      letterSpacing: 0,
    },
    firstMemberTitle: {
      x: 42,
      y: 1132,
      size: 28,
      weight: 600,
      family: FONT_FAMILY_ZEN_KAKU,
      letterSpacing: 0,
    },
  },
};

const MEMBER_CATCH_STYLE = {
  x: 312,
  y: 1040,
  width: 336,
  height: 106,
  rotation: 0,
};

const SONG_STYLE = {
  x: 296,
  startY: DEVICE.isIos ? 1290 : 1292,
  stepY: 53,
  maxWidth: 476,
  size: 28,
  wrappedSize: 25,
  wrappedLineStep: 24,
  weight: 500,
  family: FONT_FAMILY_ZEN_KAKU,
  color: '#222',
  letterSpacing: -0.5,
};

const TEXT_STYLE = {
  event: {
    x: 748,
    y: DEVICE.isIos ? 1286 : 1290,
    lineStep: 39,
    maxWidth: 420,
    size: 28,
    weight: 500,
    family: FONT_FAMILY_ZEN_KAKU,
    letterSpacing: -1,
  },
  eventRank: {
    x: 748,
    y: DEVICE.isIos ? 1368 : 1372,
    size: 28,
    weight: 500,
    family: FONT_FAMILY_ZEN_KAKU,
    letterSpacing: -1,
  },
  syncedSong: {
    x: 748,
    y: DEVICE.isIos ? 1481 : 1485,
    maxWidth: 420,
    size: 28,
    weight: 500,
    family: FONT_FAMILY_ZEN_KAKU,
    letterSpacing: -2,
  },
};

const getCharacterName = (id) => CHARACTER_NAMES[id] || `-`;
const getDifficultyName = (level) => DIFFICULTY_LABELS[level] || `Lv.${level}`;

const formatDate = (raw) => {
  const value = String(raw || '');
  if (!/^\d{8}$/.test(value)) return value;
  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}-`;
};

const safeNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const normalizeSpecialSongPrefix = (text) => {
  const value = String(text ?? '');
  if (!value.startsWith('甅')) return value;
  const trimmed = value.replace(/^甅[\s\u3000]*/, '');
  return trimmed ? `【FULL】 ${trimmed}` : '【FULL】';
};

const cloneData = (source) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(source);
  }
  return JSON.parse(JSON.stringify(source));
};

const deepFreeze = (target) => {
  if (!target || typeof target !== 'object' || Object.isFrozen(target))
    return target;
  Object.freeze(target);
  Object.keys(target).forEach((key) => {
    deepFreeze(target[key]);
  });
  return target;
};

let garupaDataSnapshot = null;

const captureGarupaDataSnapshot = () => {
  if (garupaDataSnapshot) return garupaDataSnapshot;
  if (!window.garupa9thData) return null;
  garupaDataSnapshot = deepFreeze(cloneData(window.garupa9thData));
  return garupaDataSnapshot;
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const loadCanvasFonts = async () => {
  if (!document.fonts || !document.fonts.load) return;

  try {
    await Promise.all([
      document.fonts.load(`400 48px ${FONT_FACE_ROBOTO}`, '0123456789/().'),
      document.fonts.load(`500 48px ${FONT_FACE_ROBOTO}`, '0123456789/().'),
      document.fonts.load(`700 64px ${FONT_FACE_ROBOTO}`, '0123456789/().'),
      document.fonts.load(`900 64px ${FONT_FACE_ROBOTO}`, '0123456789/().'),
      document.fonts.load(
        `400 44px ${FONT_FACE_ZEN_KAKU}`,
        'ID NAME SINCE 山田太郎 20170316'
      ),
      document.fonts.load(
        `500 44px ${FONT_FACE_ZEN_KAKU}`,
        'ID NAME SINCE 山田太郎 20170316'
      ),
      document.fonts.load(
        `700 52px ${FONT_FACE_ZEN_KAKU}`,
        'ID NAME SINCE 山田太郎 20170316'
      ),
      document.fonts.load(
        `900 52px ${FONT_FACE_ZEN_KAKU}`,
        'ID NAME SINCE 山田太郎 20170316'
      ),
    ]);
    await document.fonts.ready;
    // Ensure browser applies loaded webfonts before canvas drawing.
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
  } catch (error) {
    console.warn('フォントの事前読込に失敗しました', error);
  }
};

const setFont = (ctx, weight, size, family = FONT_FAMILY_DEFAULT) => {
  ctx.font = `${weight} ${size}px ${family}`;
};

const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;

const normalizeLetterSpacing = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isSpacingSensitiveSymbol = (char) => /[.%]/.test(char);

const getSpacingBetweenChars = (
  currentChar,
  nextChar,
  letterSpacing,
  symbolLetterSpacing = null
) => {
  const baseSpacing = normalizeLetterSpacing(letterSpacing);
  if (symbolLetterSpacing === null) return baseSpacing;
  if (
    isSpacingSensitiveSymbol(currentChar) ||
    isSpacingSensitiveSymbol(nextChar)
  ) {
    return normalizeLetterSpacing(symbolLetterSpacing);
  }
  return baseSpacing;
};

const measureTextWidth = (
  ctx,
  text,
  letterSpacing = 0,
  symbolLetterSpacing = null
) => {
  const value = String(text ?? '');
  if (!value) return 0;

  const spacing = normalizeLetterSpacing(letterSpacing);
  if (spacing === 0) return ctx.measureText(value).width;

  const chars = Array.from(value);
  let width = 0;
  chars.forEach((char, index) => {
    width += ctx.measureText(char).width;
    if (index < chars.length - 1) {
      width += getSpacingBetweenChars(
        char,
        chars[index + 1],
        spacing,
        symbolLetterSpacing
      );
    }
  });
  return width;
};

const drawTextSpaced = (
  ctx,
  text,
  x,
  y,
  align = 'left',
  letterSpacing = 0,
  symbolLetterSpacing = null
) => {
  const value = String(text ?? '');
  const spacing = normalizeLetterSpacing(letterSpacing);
  if (!value) return;
  if (spacing === 0) {
    ctx.fillText(value, x, y);
    return;
  }

  const chars = Array.from(value);
  const totalWidth = measureTextWidth(ctx, value, spacing, symbolLetterSpacing);
  let currentX = x;
  if (align === 'center') currentX -= totalWidth / 2;
  if (align === 'right') currentX -= totalWidth;

  chars.forEach((char, index) => {
    ctx.fillText(char, currentX, y);
    currentX += ctx.measureText(char).width;
    if (index < chars.length - 1) {
      currentX += getSpacingBetweenChars(
        char,
        chars[index + 1],
        spacing,
        symbolLetterSpacing
      );
    }
  });
};

const drawText = (ctx, text, x, y, options = {}) => {
  const {
    color = '#222',
    weight = 700,
    size = 32,
    align = 'left',
    family = FONT_FAMILY_DEFAULT,
    symbolLetterSpacing = null,
  } = options;
  const letterSpacing = options.letterSpacing ?? options.letterspacing ?? 0;
  setFont(ctx, weight, size, family);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  drawTextSpaced(ctx, text, x, y, align, letterSpacing, symbolLetterSpacing);
};

const drawRotatedText = (ctx, text, x, y, options = {}) => {
  const { rotation = 0, ...rest } = options;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(degreesToRadians(rotation));
  drawText(ctx, text, 0, 0, rest);
  ctx.restore();
};

const drawRotatedImage = (ctx, image, x, y, width, height, rotation = 0) => {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(degreesToRadians(rotation));
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
};

const drawTextWithEllipsis = (ctx, text, x, y, maxWidth, options = {}) => {
  const {
    color = '#222',
    weight = 700,
    size = 32,
    align = 'left',
    family = FONT_FAMILY_DEFAULT,
    symbolLetterSpacing = null,
  } = options;
  const letterSpacing = options.letterSpacing ?? options.letterspacing ?? 0;
  const value = String(text ?? '');
  const ellipsis = '...';
  setFont(ctx, weight, size, family);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  const ellipsisWidth = measureTextWidth(
    ctx,
    ellipsis,
    letterSpacing,
    symbolLetterSpacing
  );

  if (
    measureTextWidth(ctx, value, letterSpacing, symbolLetterSpacing) <= maxWidth
  ) {
    drawTextSpaced(ctx, value, x, y, align, letterSpacing, symbolLetterSpacing);
    return;
  }

  let clipped = value;
  while (
    clipped.length > 0 &&
    measureTextWidth(ctx, clipped, letterSpacing, symbolLetterSpacing) +
      ellipsisWidth >
      maxWidth
  ) {
    clipped = clipped.slice(0, -1);
  }
  drawTextSpaced(
    ctx,
    `${clipped}${ellipsis}`,
    x,
    y,
    align,
    letterSpacing,
    symbolLetterSpacing
  );
};

const wrapText = (ctx, text, maxWidth, maxLines, letterSpacing = 0) => {
  const chars = Array.from(String(text ?? ''));
  const lines = [];
  let line = '';

  for (let i = 0; i < chars.length; i += 1) {
    const next = line + chars[i];
    if (
      measureTextWidth(ctx, next, letterSpacing) > maxWidth &&
      line.length > 0
    ) {
      lines.push(line);
      line = chars[i];
      if (lines.length >= maxLines) break;
    } else {
      line = next;
    }
  }
  if (line && lines.length < maxLines) {
    lines.push(line);
  }
  return lines;
};

const drawSongs = (ctx, songs) => {
  const trimWrappedLineStart = (text) =>
    String(text ?? '').replace(/^[\s\u3000]+/, '');
  const getVisualLeftInset = (text, weight, size, family) => {
    setFont(ctx, weight, size, family);
    const metrics = ctx.measureText(String(text ?? ''));
    return Number.isFinite(metrics.actualBoundingBoxLeft)
      ? Math.max(0, metrics.actualBoundingBoxLeft)
      : 0;
  };

  [1, 2, 3, 4, 5].forEach((level, index) => {
    const songName = normalizeSpecialSongPrefix(songs[level] || '');
    const y = SONG_STYLE.startY + index * SONG_STYLE.stepY;
    const baseOptions = {
      color: SONG_STYLE.color,
      weight: SONG_STYLE.weight,
      family: SONG_STYLE.family,
      align: 'left',
      letterSpacing: SONG_STYLE.letterSpacing,
    };

    setFont(ctx, SONG_STYLE.weight, SONG_STYLE.size, SONG_STYLE.family);
    const linesAtDefaultSize = wrapText(
      ctx,
      songName,
      SONG_STYLE.maxWidth,
      2,
      SONG_STYLE.letterSpacing
    );

    if (linesAtDefaultSize.length <= 1) {
      drawText(ctx, songName, SONG_STYLE.x, y, {
        ...baseOptions,
        size: SONG_STYLE.size,
      });
      return;
    }

    // Keep wrap points decided at 28px to avoid collapsing back to 1 line at 25px.
    const wrappedLines = linesAtDefaultSize
      .slice(0, 2)
      .map((line, lineIndex) =>
        lineIndex === 0 ? line : trimWrappedLineStart(line)
      );
    const firstLineY = y - SONG_STYLE.wrappedLineStep / 2;
    wrappedLines.forEach((line, lineIndex) => {
      const visualInset = getVisualLeftInset(
        line,
        SONG_STYLE.weight,
        SONG_STYLE.wrappedSize,
        SONG_STYLE.family
      );
      drawText(
        ctx,
        line,
        SONG_STYLE.x - visualInset,
        firstLineY + lineIndex * SONG_STYLE.wrappedLineStep,
        {
          ...baseOptions,
          size: SONG_STYLE.wrappedSize,
        }
      );
    });
  });
};

const drawFraction = (ctx, numerator, denominator, x, y) => {
  const { fraction, value } = GRAPH_STYLE;
  drawText(ctx, String(numerator), x, y + fraction.numeratorOffsetY, value);
  drawText(ctx, String(denominator), x, y + fraction.denominatorOffsetY, value);

  ctx.save();
  ctx.strokeStyle = value.color;
  ctx.lineWidth = fraction.lineWidth;
  ctx.beginPath();
  ctx.moveTo(x - fraction.lineHalfWidth, y + fraction.barOffsetY);
  ctx.lineTo(x + fraction.lineHalfWidth, y + fraction.barOffsetY);
  ctx.stroke();
  ctx.restore();
};

const drawGraph = (ctx, clearRateData = {}) => {
  const { chartLeft, chartTop, chartBottom, barWidth, barGap, colors } =
    GRAPH_STYLE;
  const levels = [1, 2, 3, 4, 5];
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  levels.forEach((level, index) => {
    const raw = clearRateData[level] || {};
    const cleared = safeNumber(raw[1]);
    const total = safeNumber(raw[2]);
    const rate = total > 0 ? (cleared / total) * 100 : 0;
    const clampedRate = Math.max(0, Math.min(rate, 100));
    const renderedRate = clampedRate;

    const barHeight = ((chartBottom - chartTop) * renderedRate) / 100;
    const x = chartLeft + 27 + index * (barWidth + barGap);
    const y = chartBottom - barHeight;

    ctx.fillStyle = colors[index];
    ctx.fillRect(x, y, barWidth, barHeight);

    const tenPercentTopY = chartBottom - ((chartBottom - chartTop) * 10) / 100;
    const fractionYSafeForLowRate = clamp(
      tenPercentTopY,
      chartTop + GRAPH_STYLE.labelBounds.top,
      chartBottom - GRAPH_STYLE.labelBounds.bottom
    );
    const fractionY = clampedRate <= 10 ? fractionYSafeForLowRate : y;
    drawFraction(ctx, cleared, total, x + barWidth / 2, fractionY);
    // Keep % at bar center, but pin only <10% to 10% center.
    const centerYForRate = y + barHeight / 2;
    const tenPercentCenterY =
      chartBottom -
      ((chartBottom - chartTop) * 10) / 200 +
      GRAPH_STYLE.tenPercentCenterOffsetY;
    const rateLabelBaseY = clampedRate < 10 ? tenPercentCenterY : centerYForRate;
    // Keep the label center above chart bottom line.
    const rateBottomLimit = chartBottom - GRAPH_STYLE.rate.size / 2;
    const rateY = clamp(
      rateLabelBaseY,
      chartTop + GRAPH_STYLE.rateBounds.top,
      rateBottomLimit - GRAPH_STYLE.rateBounds.bottom
    );
    drawText(
      ctx,
      `${rate.toFixed(1)}%`,
      x + barWidth / 2,
      rateY,
      GRAPH_STYLE.rate
    );
  });
};

const drawGeneratedImage = async () => {
  const data = captureGarupaDataSnapshot();
  if (!data) return;
  await loadCanvasFonts();

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH * RENDER_SCALE;
  canvas.height = CANVAS_HEIGHT * RENDER_SCALE;
  canvas.style.width = `${CANVAS_WIDTH}px`;
  canvas.style.height = `${CANVAS_HEIGHT}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const baseImage = await loadImage(BASE_IMAGE_PATH);
  ctx.drawImage(baseImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const user = data[0] || {};
  const cardData = data[4] || {};
  const firstDraw = data[2] || {};
  const topEvent = data[8] || {};

  drawRotatedText(
    ctx,
    user[1] || '',
    TEXT_LAYOUT.playerPass.id.x,
    TEXT_LAYOUT.playerPass.id.y,
    {
      ...TEXT_LAYOUT.playerPass.id,
      rotation: PLAYER_PASS_ANGLE,
    }
  );
  drawRotatedText(
    ctx,
    user[2] || '',
    TEXT_LAYOUT.playerPass.name.x,
    TEXT_LAYOUT.playerPass.name.y,
    {
      ...TEXT_LAYOUT.playerPass.name,
      rotation: PLAYER_PASS_ANGLE,
    }
  );
  drawRotatedText(
    ctx,
    formatDate(user[3]),
    TEXT_LAYOUT.playerPass.since.x,
    TEXT_LAYOUT.playerPass.since.y,
    {
      ...TEXT_LAYOUT.playerPass.since,
      rotation: PLAYER_PASS_ANGLE,
    }
  );

  drawText(
    ctx,
    safeNumber(data[1]),
    TEXT_LAYOUT.playRecord.loginDays.x,
    TEXT_LAYOUT.playRecord.loginDays.y,
    TEXT_LAYOUT.playRecord.loginDays
  );
  drawText(
    ctx,
    safeNumber(data[9]?.[1]),
    TEXT_LAYOUT.playRecord.storyMain.x,
    TEXT_LAYOUT.playRecord.storyMain.y,
    TEXT_LAYOUT.playRecord.storyMain
  );
  drawText(
    ctx,
    safeNumber(data[9]?.[2]),
    TEXT_LAYOUT.playRecord.storyBand.x,
    TEXT_LAYOUT.playRecord.storyBand.y,
    TEXT_LAYOUT.playRecord.storyBand
  );
  drawText(
    ctx,
    safeNumber(data[9]?.[3]),
    TEXT_LAYOUT.playRecord.storyEvent.x,
    TEXT_LAYOUT.playRecord.storyEvent.y,
    TEXT_LAYOUT.playRecord.storyEvent
  );
  drawText(
    ctx,
    safeNumber(data[10]),
    TEXT_LAYOUT.playRecord.lounge.x,
    TEXT_LAYOUT.playRecord.lounge.y,
    TEXT_LAYOUT.playRecord.lounge
  );

  drawText(
    ctx,
    `${safeNumber(cardData[1])} / ${safeNumber(cardData[2])}`,
    TEXT_LAYOUT.member.cardCount.x,
    TEXT_LAYOUT.member.cardCount.y,
    TEXT_LAYOUT.member.cardCount
  );

  const mostCollectedCharacterId = safeNumber(data[5]);
  const mostCollectedName = getCharacterName(mostCollectedCharacterId);
  drawText(
    ctx,
    mostCollectedName,
    TEXT_LAYOUT.member.mostCollectedName.x,
    TEXT_LAYOUT.member.mostCollectedName.y,
    TEXT_LAYOUT.member.mostCollectedName
  );
  drawText(
    ctx,
    getCharacterName(safeNumber(firstDraw[2])),
    TEXT_LAYOUT.member.firstMemberName.x,
    TEXT_LAYOUT.member.firstMemberName.y,
    TEXT_LAYOUT.member.firstMemberName
  );
  drawText(
    ctx,
    `${'★'.repeat(Math.min(5, Math.max(0, safeNumber(firstDraw[1]))))}`,
    TEXT_LAYOUT.member.firstMemberStar.x,
    TEXT_LAYOUT.member.firstMemberStar.y,
    TEXT_LAYOUT.member.firstMemberStar
  );
  const firstMemberTitle = String(firstDraw[3] || '');
  if (firstMemberTitle !== '-') {
    drawText(
      ctx,
      firstMemberTitle,
      TEXT_LAYOUT.member.firstMemberTitle.x,
      TEXT_LAYOUT.member.firstMemberTitle.y,
      TEXT_LAYOUT.member.firstMemberTitle
    );
  }

  const firstTopEventName = topEvent[1] || '';
  setFont(
    ctx,
    TEXT_STYLE.event.weight,
    TEXT_STYLE.event.size,
    TEXT_STYLE.event.family
  );
  ctx.fillStyle = '#222';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const eventLines = wrapText(
    ctx,
    firstTopEventName,
    TEXT_STYLE.event.maxWidth,
    2,
    TEXT_STYLE.event.letterSpacing
  );
  eventLines.forEach((line, index) => {
    drawTextWithEllipsis(
      ctx,
      line,
      TEXT_STYLE.event.x,
      TEXT_STYLE.event.y + index * TEXT_STYLE.event.lineStep,
      TEXT_STYLE.event.maxWidth,
      TEXT_STYLE.event
    );
  });
  const eventLineCount = Math.max(1, Math.min(eventLines.length, 2));
  const eventRankY =
    TEXT_STYLE.eventRank.y - (2 - eventLineCount) * TEXT_STYLE.event.lineStep;
  const eventRank = safeNumber(topEvent[2]);
  if (eventRank > 0) {
    drawText(
      ctx,
      `(${eventRank}位)`,
      TEXT_STYLE.eventRank.x,
      eventRankY,
      TEXT_STYLE.eventRank
    );
  }

  drawTextWithEllipsis(
    ctx,
    normalizeSpecialSongPrefix(data[11] || ''),
    TEXT_STYLE.syncedSong.x,
    TEXT_STYLE.syncedSong.y,
    TEXT_STYLE.syncedSong.maxWidth,
    TEXT_STYLE.syncedSong
  );

  drawSongs(ctx, data[3] || {});
  drawGraph(ctx, data[6] || {});

  if (mostCollectedCharacterId > 0) {
    try {
      const [charaImage, catchImage] = await Promise.all([
        loadImage(
          `${CHARACTER_IMAGE_BASE}/${mostCollectedCharacterId}/member_thumb.png`
        ),
        loadImage(CATCH_IMAGE_PATH),
      ]);
      ctx.drawImage(charaImage, 364, 582, 235, 575);
      drawRotatedImage(
        ctx,
        catchImage,
        MEMBER_CATCH_STYLE.x,
        MEMBER_CATCH_STYLE.y,
        MEMBER_CATCH_STYLE.width,
        MEMBER_CATCH_STYLE.height,
        MEMBER_CATCH_STYLE.rotation
      );
    } catch (error) {
      console.warn('キャラクター画像の読込に失敗しました', error);
    }
  }

  const generatedImageSrc = canvas.toDataURL(EXPORT_MIME_TYPE, 0.95);
  const flyerImage = document.querySelector('.top-flyer__img img');
  const flyerImageWrap = document.querySelector('.top-flyer__img');
  if (flyerImageWrap) {
    flyerImageWrap.classList.add('js--show');
  }
  if (flyerImage) {
    flyerImage.src = generatedImageSrc;
  }
  return generatedImageSrc;
};

const getDownloadFileExtension = () =>
  EXPORT_MIME_TYPE === 'image/png' ? 'png' : 'jpg';

const buildDownloadFileName = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `${DOWNLOAD_FILE_PREFIX}_${timestamp}.${getDownloadFileExtension()}`;
};

const triggerImageDownload = (imageSrc) => {
  if (!imageSrc) return;
  const downloadLink = document.createElement('a');
  downloadLink.href = imageSrc;
  downloadLink.download = buildDownloadFileName();
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const handleFlyerDownloadClick = async (event) => {
  event.preventDefault();
  if (!captureGarupaDataSnapshot()) return;
  const generatedImageSrc = await drawGeneratedImage();
  triggerImageDownload(generatedImageSrc);
};

window.addEventListener('load', () => {
  if (!captureGarupaDataSnapshot()) return;
  const downloadButton = document.querySelector('.top-flyer__btn');
  if (downloadButton) {
    downloadButton.addEventListener('click', (event) => {
      handleFlyerDownloadClick(event).catch((error) => {
        console.warn('画像ダウンロード処理に失敗しました', error);
      });
    });
  }
  drawGeneratedImage().catch((error) => {
    console.warn('画像生成の初期表示に失敗しました', error);
  });
});

// Capture a local immutable snapshot as early as possible.
captureGarupaDataSnapshot();
