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
  <meta charset="utf-8" />
  <title>ガルパ 9周年 振り返り</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
      color: #333;
      line-height: 1.6;
    }
    h1 { font-size: 20px; margin-bottom: 20px; }
    h2 { font-size: 14px; color: #666; margin: 24px 0 8px; }
    .user-name { font-size: 24px; font-weight: bold; }
    .user-id { color: #999; font-size: 12px; }
    .user-date { color: #666; font-size: 14px; }
    .char-id { color: #999; font-size: 12px; }
    .stat { margin: 8px 0; }
    .stat-label { color: #666; }
    .stat-value { font-weight: bold; }
    .song-list { margin: 0; padding: 0; list-style: none; }
    .song-list li { padding: 4px 0; border-bottom: 1px solid #eee; }
    .song-list li:last-child { border-bottom: none; }
    .difficulty { display: inline-block; min-width: 100px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <script>
    window.garupa9thData = <?php echo json_encode($parsedData, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
    console.log('garupa9thData:', JSON.stringify(window.garupa9thData, null, 2));
  </script>
  <h1>ガルパ 9周年 振り返り</h1>

  <div class="user-name"><?php echo htmlspecialchars($user['2'] ?? '---', ENT_QUOTES, 'UTF-8'); ?></div>
    <div class="user-id">ID: <?php echo htmlspecialchars($user['1'] ?? '---', ENT_QUOTES, 'UTF-8'); ?></div>
    <div class="user-date"><?php echo formatDate($user['3'] ?? ''); ?> から</div>

    <h2>プレイ記録</h2>
    <div class="stat"><span class="stat-label">ログイン日数：</span><span class="stat-value"><?php echo number_format($d['1'] ?? 0); ?> 日</span></div>
    <?php if (!empty($d['9'])): ?>
    <div class="stat"><span class="stat-label">読破済みストーリー：</span></div>
    <ul class="song-list">
      <?php foreach ($d['9'] as $type => $count): ?>
      <li><span class="difficulty"><?php echo getStoryTypeName((int)$type); ?></span><?php echo number_format((int)$count); ?> 話</li>
      <?php endforeach; ?>
    </ul>
    <?php endif; ?>
    <div class="stat"><span class="stat-label">ラウンジ会話視聴：</span><span class="stat-value"><?php echo number_format($d['10'] ?? 0); ?> 回</span></div>

    <h2>カード</h2>
    <div class="stat"><span class="stat-label">集めたカード：</span><span class="stat-value"><?php echo number_format($d['4']['1'] ?? 0); ?> / <?php echo number_format($d['4']['2'] ?? 0); ?></span></div>

    <?php if (isset($d['5'])): ?>
    <h2>一番集めているキャラ</h2>
    <div class="stat">
      <?php echo htmlspecialchars(getCharacterName((int)$d['5']), ENT_QUOTES, 'UTF-8'); ?>
      <span class="char-id">（キャラID: <?php echo (int)$d['5']; ?>）</span>
    </div>
    <?php endif; ?>

    <?php if (!empty($d['2'])): ?>
    <h2>最初に引いたキャラ</h2>
    <div class="stat">
      <?php echo htmlspecialchars(getCharacterName((int)($d['2']['2'] ?? 0)), ENT_QUOTES, 'UTF-8'); ?>
      （<?php echo str_repeat('★', $d['2']['1'] ?? 0); ?>）
      <span class="char-id">（キャラID: <?php echo (int)($d['2']['2'] ?? 0); ?>）</span>
    </div>
    <div class="stat"><span class="stat-label">シチュエーション：</span><?php echo htmlspecialchars($d['2']['3'] ?? '---', ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <?php if (!empty($d['6'])): ?>
    <h2>楽曲クリア率</h2>
    <ul class="song-list">
      <?php foreach ($d['6'] as $level => $data): ?>
      <?php
        $cleared = (int)($data['1'] ?? 0);
        $total = (int)($data['2'] ?? 1);
        $rate = $total > 0 ? round(($cleared / $total) * 100, 1) : 0;
      ?>
      <li><span class="difficulty"><?php echo getDifficultyName((int)$level); ?></span><?php echo number_format($cleared); ?> / <?php echo number_format($total); ?> 曲（<?php echo $rate; ?>%）</li>
      <?php endforeach; ?>
    </ul>
    <?php endif; ?>


    <?php if (!empty($d['3'])): ?>
    <h2>最初にフルコンボした楽曲</h2>
    <ul class="song-list">
      <?php foreach ($d['3'] as $level => $song): ?>
      <li><span class="difficulty"><?php echo getDifficultyName((int)$level); ?></span><?php echo htmlspecialchars($song, ENT_QUOTES, 'UTF-8'); ?></li>
      <?php endforeach; ?>
    </ul>
    <?php endif; ?>

    <?php if (!empty($d['8'])): ?>
    <h2>初めてTOP 10,000入りしたイベント</h2>
    <div class="stat"><?php echo htmlspecialchars($d['8']['1'] ?? '---', ENT_QUOTES, 'UTF-8'); ?>（<?php echo number_format($d['8']['2'] ?? 0); ?> 位）</div>
    <?php endif; ?>

    <?php if (!empty($d['11'])): ?>
    <h2>あなたと同期の楽曲</h2>
    <div class="stat"><?php echo htmlspecialchars($d['11'], ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

</body>
</html>
