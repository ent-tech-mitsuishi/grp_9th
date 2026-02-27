<?php
$errorMsg = $_GET['msg'] ?? null;
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>エラー | ガルパ 9周年 振り返り</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fff;
      color: #333;
      text-align: center;
    }
    h1 { font-size: 20px; margin-bottom: 16px; }
    p { color: #666; }
    .error-detail { margin-top: 16px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <h1>ページを表示できません</h1>
  <p>アプリからアクセスしてください。</p>
  <?php if ($errorMsg): ?>
  <p class="error-detail"><?php echo htmlspecialchars($errorMsg, ENT_QUOTES, 'UTF-8'); ?></p>
  <?php endif; ?>
</body>
</html>
