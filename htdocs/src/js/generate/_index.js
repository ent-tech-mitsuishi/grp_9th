import './device.js';
import $ from 'jquery';

$(function () {
  const cardImg = new Image();
  cardImg.crossOrigin = 'anonymous';
  cardImg.src = './assets/img/card.jpg';

  // カード画像サイズ (1920x1080)
  const CANVAS_W = 1920;
  const CANVAS_H = 1080;

  // 右側4枠のテキスト描画座標 (左寄せ)
  const BASE_FONT_SIZE = 28;
  const LABEL_FONT_SIZE = 24;
  const TEXT_LEFT_X = 1052;
  const BOXES = [
    { y: 214, labelY: 147, maxWidth: 700 },  // テキスト1
    { y: 370, labelY: 302, maxWidth: 700 },  // テキスト2
    { y: 526, labelY: 458, maxWidth: 700 },  // テキスト3
    { labelY: 612, maxWidth: 700, multiline: true, maxLines: 6, boxTop: 640, boxBottom: 990 }, // テキスト4
  ];

  function generateImage() {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext('2d');

    // 背景カード画像を描画
    ctx.drawImage(cardImg, 0, 0, CANVAS_W, CANVAS_H);

    // フォント共通設定
    ctx.fillStyle = '#1f1f1f';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // ラベル描画 (黒エリア)
    ctx.font = `bold ${LABEL_FONT_SIZE}px "Noto Sans", "Noto Sans JP", sans-serif`;
    ctx.fillStyle = '#fafafa';
    $('.top--form__item label p').each(function (i) {
      if (BOXES[i]) {
        ctx.fillText($(this).text(), TEXT_LEFT_X, BOXES[i].labelY);
      }
    });

    // テキスト描画の共通設定に戻す
    ctx.fillStyle = '#1f1f1f';

    // 4つの入力値を取得
    const text1 = $('input[name="text1"]').val() || '';
    const text2 = $('input[name="text2"]').val() || '';
    const text3 = $('input[name="text3"]').val() || '';
    // textareaは改行を取り除いて1つに詰める
    const text4 = ($('textarea[name="text4"]').val() || '').replace(/\r?\n/g, '');
    const texts = [text1, text2, text3, text4];

    texts.forEach(function (text, i) {
      const box = BOXES[i];
      ctx.font = `bold ${BASE_FONT_SIZE}px "Noto Sans", "Noto Sans JP", sans-serif`;

      if (box.multiline) {
        // 複数行描画 (テキスト4用 - 上から詰め、maxLines時に上下余白均等)
        const lines = wrapText(ctx, text, box.maxWidth, box.maxLines);
        const boxHeight = box.boxBottom - box.boxTop;
        // lineHeight = 枠高さからフォント分を引いてmaxLinesで等分
        // → maxLines時: 上余白 = 下余白 = lineHeight / 2
        const lineHeight = (boxHeight - BASE_FONT_SIZE) / (box.maxLines + 1);
        const startY = box.boxTop + lineHeight / 2 + BASE_FONT_SIZE / 2;
        lines.forEach(function (line, j) {
          ctx.fillText(line, TEXT_LEFT_X, startY + j * lineHeight, box.maxWidth);
        });
      } else {
        ctx.fillText(text, TEXT_LEFT_X, box.y, box.maxWidth);
      }
    });

    // Canvas→画像に変換してimgに設定
    canvas.toBlob(function (blob) {
      const url = URL.createObjectURL(blob);
      $('.result--content__item img').attr('src', url);
      // topを非表示、resultを表示
      $('.top--wrap').removeClass('js--show');
      $('.result--wrap').addClass('js--show');
    }, 'image/png');
  }

  // テキストを指定幅で折り返す
  function wrapText(ctx, text, maxWidth, maxLines) {
    if (!text) return [''];
    const chars = Array.from(text);
    const lines = [];
    let line = '';

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (ch === '\n') {
        lines.push(line);
        line = '';
        if (lines.length >= maxLines) break;
        continue;
      }
      const testLine = line + ch;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        lines.push(line);
        line = ch;
        if (lines.length >= maxLines) break;
      } else {
        line = testLine;
      }
    }
    if (line && lines.length < maxLines) {
      lines.push(line);
    }
    return lines.length ? lines : [''];
  }

  // 「この内容で作成する」ボタン
  $('.top--form__create').on('click', function (e) {
    e.preventDefault();
    if (!cardImg.complete) {
      cardImg.onload = function () {
        generateImage();
      };
    } else {
      generateImage();
    }
  });

  // 「作成画面に戻る」ボタン
  $('.result--back').on('click', function () {
    $('.result--wrap').removeClass('js--show');
    $('.top--wrap').addClass('js--show');
  });
});
