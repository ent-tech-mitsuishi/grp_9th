<?php
// パラメータがない場合はエラーページにリダイレクト
if (!isset($_GET['json_param']) || $_GET['json_param'] === '') {
  header('Location: ./error/');
  exit;
}

// json_param を復号・展開して PHP 配列として取得
$rawJson      = null;
$parsedData   = null;
$decodeError  = null;

function base64url_decode(string $data)
{
  $b64 = strtr($data, '-_', '+/');
  $pad = strlen($b64) % 4;
  if ($pad > 0) {
    $b64 .= str_repeat('=', 4 - $pad);
  }
  return base64_decode($b64, true);
}

function decode_json_param(string $param)
{
  $cipher = base64url_decode($param);
  if ($cipher === false) {
    throw new Exception('Base64 URL デコードに失敗しました。');
  }

  $key = 'gbp_9th_Z2JwXzl0';
  $iv  = 'gbp_9th_oAa0lzXw';

  while (openssl_error_string() !== false) {}

  $plain = openssl_decrypt($cipher, 'AES-128-CBC', $key, OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING, $iv);

  if ($plain === false) {
    throw new Exception('AES 復号に失敗しました。');
  }

  if (!function_exists('bzdecompress')) {
    throw new Exception('bzip2(bz2) 拡張が有効ではありません。');
  }

  $decompressed = bzdecompress($plain);
  if (!is_string($decompressed)) {
    throw new Exception("bzip2 解凍に失敗しました。");
  }

  return $decompressed;
}

function formatDate(string $dateStr): string
{
  if (strlen($dateStr) !== 8) return $dateStr;
  return substr($dateStr, 0, 4) . '年' . substr($dateStr, 4, 2) . '月' . substr($dateStr, 6, 2) . '日';
}

function getDifficultyName(int $level): string
{
  $names = [1 => 'EASY', 2 => 'NORMAL', 3 => 'HARD', 4 => 'EXPERT', 5 => 'SPECIAL'];
  return $names[$level] ?? "Lv.{$level}";
}

function getStoryTypeName(int $type): string
{
  $names = [1 => 'メインストーリー', 2 => 'バンドストーリー', 3 => 'イベントストーリー'];
  return $names[$type] ?? "種別{$type}";
}

function getCharacterName(int $id): string
{
  $characters = [
    1 => '戸山 香澄',
    2 => '花園 たえ',
    3 => '牛込 りみ',
    4 => '山吹 沙綾',
    5 => '市ヶ谷 有咲',
    6 => '美竹 蘭',
    7 => '青葉 モカ',
    8 => '上原 ひまり',
    9 => '宇田川 巴',
    10 => '羽沢 つぐみ',
    11 => '弦巻 こころ',
    12 => '瀬田 薫',
    13 => '北沢 はぐみ',
    14 => '松原 花音',
    15 => '奥沢 美咲',
    16 => '丸山 彩',
    17 => '氷川 日菜',
    18 => '白鷺 千聖',
    19 => '大和 麻弥',
    20 => '若宮 イヴ',
    21 => '湊 友希那',
    22 => '氷川 紗夜',
    23 => '今井 リサ',
    24 => '宇田川 あこ',
    25 => '白金 燐子',
    26 => '倉田 ましろ',
    27 => '桐ヶ谷 透子',
    28 => '広町 七深',
    29 => '二葉 つくし',
    30 => '八潮 瑠唯',
    31 => 'レイヤ',
    32 => 'ロック',
    33 => 'マスキング',
    34 => 'パレオ',
    35 => 'チュチュ',
    36 => '高松 燈',
    37 => '千早 愛音',
    38 => '要 楽奈',
    39 => '長崎 そよ',
    40 => '椎名 立希',
  ];
  return $characters[$id] ?? "キャラID:{$id}";
}

try {
  $rawJson = decode_json_param($_GET['json_param']);
  $parsedData = json_decode($rawJson, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    throw new Exception('JSON デコードに失敗しました: ' . json_last_error_msg());
  }
} catch (Throwable $e) {
  header('Location: ./error/?msg=' . urlencode($e->getMessage()));
  exit;
}

$d = $parsedData;
$user = $d['0'] ?? [];
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <!-- Google Tag Manager -->
  <script>
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-WKM95WS');
  </script>
  <!-- End Google Tag Manager -->
  <!-- title -->
  <title>バンドリ！ ガールズバンドパーティ！「CIRCLE社内報」</title>
  <meta name="viewport" content="width=device-width">
  <meta name="description" content="バンドリ！ ガールズバンドパーティ！リリース9周年記念サイト「CiRCLE社内報」です。">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="バンドリ！ ガールズバンドパーティ！「CIRCLE社内報」">
  <meta name="twitter:description" content="バンドリ！ ガールズバンドパーティ！リリース9周年記念サイト「CiRCLE社内報」です。">
  <meta name="twitter:url" content="https://bang-dream.bushimo.jp/circle-newsletter/">
  <meta name="twitter:image" content="https://bang-dream.bushimo.jp/circle-newsletter/assets/img/ogp.png">
  <meta name="twitter:site" content="@bang_dream_gbp">
  <meta property="og:site_name" content="バンドリ！ ガールズバンドパーティ！「CIRCLE社内報」">
  <meta property="og:title" content="バンドリ！ ガールズバンドパーティ！「CIRCLE社内報」">
  <meta property="og:description" content="バンドリ！ ガールズバンドパーティ！リリース9周年記念サイト「CiRCLE社内報」です。">
  <meta property="og:url" content="https://bang-dream.bushimo.jp/circle-newsletter/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://bang-dream.bushimo.jp/circle-newsletter/assets/img/ogp.png">
  <!-- font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400..700&family=Noto+Sans+JP:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Zen+Kaku+Gothic+Antique:wght@300;400;500;700;900&display=swap"
    rel="stylesheet"
  >
  <!-- favicon -->
  <link rel="shortcut icon" href="./assets/img/favicon.ico">
  <link
    rel="apple-touch-icon"
    href="assets/img/webclip.png"
  >
  <!-- css -->
  <link rel="stylesheet" href="./assets/css/share.css">
</head>
<script>
    window.garupa9thData = <?php echo json_encode($parsedData, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
  </script>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WKM95WS" height="0" width="0" style="display: none; visibility: hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <div class="common__lock">
    <div class="common__lock-inner">
      <img src="./assets/img/common/popup.png" alt="スマートフォンを縦向きにして閲覧してください">
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
  <script src="./assets/js/project.js?v=1773630187966"></script>
</body>
</html>