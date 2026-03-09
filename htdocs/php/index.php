<?php
// パラメータがない場合はエラーページにリダイレクト
if (!isset($_GET['json_param']) || $_GET['json_param'] === '') {
  header('Location: ./error/');
  exit;
}

// json_param を復号・展開して PHP 配列として取得
$rawJson = null;
$parsedData = null;
$decodeError = null;

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
  $iv = 'gbp_9th_oAa0lzXw';

  while (openssl_error_string() !== false) {
  }

  $plain = openssl_decrypt(
    $cipher,
    'AES-128-CBC',
    $key,
    OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING,
    $iv
  );
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
  if (strlen($dateStr) !== 8) {
    return $dateStr;
  }
  return substr($dateStr, 0, 4) . '年' . substr($dateStr, 4, 2) . '月' . substr($dateStr, 6, 2) . '日';
}

function getDifficultyName(int $level): string
{
  $names = [
    1 => 'EASY',
    2 => 'NORMAL',
    3 => 'HARD',
    4 => 'EXPERT',
    5 => 'SPECIAL',
  ];
  return $names[$level] ?? "Lv.{$level}";
}

function getStoryTypeName(int $type): string
{
  $names = [
    1 => 'メインストーリー',
    2 => 'バンドストーリー',
    3 => 'イベントストーリー',
  ];
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
  <meta name="description" content="バンドリ！ ガールズバンドパーティ！リリース9周年記念サイトです。CIRCLE社内報の簡単な説明～～～～～～～～～。">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="バンドリ！ ガールズバンドパーティ！「CIRCLE社内報」">
  <meta name="twitter:description" content="バンドリ！ ガールズバンドパーティ！リリース9周年記念サイトです。CIRCLE社内報の簡単な説明～～～～～～～～～。">
  <meta name="twitter:url" content="https://bang-dream.bushimo.jp/circle-newsletter/">
  <meta name="twitter:image" content="https://bang-dream.bushimo.jp/circle-newsletter/assets/img/ogp.png">
  <meta name="twitter:site" content="@bang_dream_gbp">
  <meta property="og:site_name" content="バンドリ！ ガールズバンドパーティ！「CIRCLE社内報」">
  <meta property="og:title" content="バンドリ！ ガールズバンドパーティ！「CIRCLE社内報」">
  <meta property="og:description" content="バンドリ！ ガールズバンドパーティ！リリース9周年記念サイトです。CIRCLE社内報の簡単な説明～～～～～～～～～。">
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
<body data-page="top">
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WKM95WS" height="0" width="0" style="display: none; visibility: hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <div class="common__lock">
    <div class="common__lock-inner">
      <img src="./assets/img/common/popup.png" alt="スマートフォンを縦向きにして閲覧してください">
    </div>
  </div>
  <main class="common__main">
    <div class="common__bg sp-none"></div>
    <div class="common__loading">
      <span class="common__loading-item"></span>
    </div>
    <article class="common__article">
      <div class="common__wrap">
        <div class="common__container">
          <div class="common__label">
            <p class="common__label-name">NEWSLETTER</p>
            <p class="common__label-date">2026.3.16</p>
          </div>
          <span class="common__line rotate"></span>
          <h1 class="common__h1">
            <img
                src="./assets/img/common/img_mv.png"
                alt="9周年 PROJECT LIVEHOUSE CIRCLE 社内報 NEWSLETTER"
              >
          </h1>
          <span class="common__line"></span>
          <section class="top-player">
            <h2 class="top-player__ttl">
              <img
                  src="./assets/img/ttl_history.png"
                  alt="これまでの活動履歴をお届け！"
                >
            </h2>
            <div class="common__inner">
              <div class="top-player__pass">
                <p class="top-player__pass-ttl">PLAYER PASS</p>
                <dl class="top-player__identity">
                  <dt>ID</dt>
                  <dd class="top-player__identity-id"></dd>
                  <dt>NAME</dt>
                  <dd class="top-player__identity-name"></dd>
                </dl>
                <dl class="top-player__identity">
                  <dt>SINCE</dt>
                  <dd class="top-player__identity-join"><span></span> -</dd>
                </dl>
              </div>
            </div>
            <div class="top-player__data">
              <div class="top-player__data-block">
                <h2 class="top-player__data-h2">
                  <img
                      src="./assets/img/ttl_data_1.png"
                      alt="DATA 01 プレイ記録"
                    >
                </h2>
                <div class="top-player__data-inner">
                  <div class="top-player__data-item">
                    <h3>ログイン日数</h3>
                    <div class="top-player__data-dtl">
                      <p class="top-player__data-txt">
                        <span class="number"></span> 日
                      </p>
                    </div>
                  </div>
                  <div class="top-player__data-item">
                    <h3>読了済みストーリー</h3>
                    <div class="top-player__data-dtl">
                      <ul class="top-player__data-list">
                        <li>
                          <p>メイン<br>ストーリー</p>
                          <p><span class="number"></span> 話</p>
                        </li>
                        <li>
                          <p>バンド<br>ストーリー</p>
                          <p><span class="number"></span> 話</p>
                        </li>
                        <li>
                          <p>イベント<br>ストーリー</p>
                          <p><span class="number"></span> 話</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="top-player__data-item">
                    <h3>ラウンジ会話視聴</h3>
                    <div class="top-player__data-dtl">
                      <p class="top-player__data-txt">
                        <span class="number"></span> 回
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="top-player__data-block">
                <h2 class="top-player__data-h2">
                  <img
                      src="./assets/img/ttl_data_2.png"
                      alt="DATA 02 キャラクター&メンバー"
                    >
                </h2>
                <div class="top-player__data-inner">
                  <div class="top-player__data-item">
                    <h3>集めたメンバー</h3>
                    <div class="top-player__data-dtl">
                      <p class="top-player__data-txt">
                        <span class="number"></span> 枚
                      </p>
                    </div>
                  </div>
                  <div class="top-player__data-item">
                    <h3>一番集めているキャラクター</h3>
                    <div class="top-player__data-dtl">
                      <p class="top-player__data-name"></p>
                    </div>
                  </div>
                  <div class="top-player__data-item">
                    <h3>最初に引いたメンバー</h3>
                    <div class="top-player__data-dtl">
                      <p class="top-player__data-name"></p>
                      <div class="top-player__data-card">
                        <span class="card-star"></span>
                        <p class="card-name"></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="top-player__data-chara">
                  <span>
                    <img src="" alt="">
                  </span>
                  <p>
                    <img
                        src="./assets/img/member_copy.png"
                        alt="あなたが一番集めているのはこのキャラクター！"
                      >
                  </p>
                </div>
              </div>
              <div class="top-player__data-block">
                <h2 class="top-player__data-h2">
                  <img
                      src="./assets/img/ttl_data_3.png"
                      alt="DATA 03 楽曲クリア率"
                    >
                </h2>
                <div class="common__inner">
                  <div class="top-player__graph">
                    <div class="top-player__graph-wrap">
                      <div class="top-player__graph-item is-easy">
                        <p class="top-player__graph-score">
                          <span></span>
                          <span></span>
                        </p>
                        <p class="top-player__graph-percent"></p>
                      </div>
                      <div class="top-player__graph-item is-normal">
                        <p class="top-player__graph-score">
                          <span></span><span></span>
                        </p>
                        <p class="top-player__graph-percent"></p>
                      </div>
                      <div class="top-player__graph-item is-hard">
                        <p class="top-player__graph-score">
                          <span></span><span></span>
                        </p>
                        <p class="top-player__graph-percent"></p>
                      </div>
                      <div class="top-player__graph-item is-expert">
                        <p class="top-player__graph-score">
                          <span></span><span></span>
                        </p>
                        <p class="top-player__graph-percent"></p>
                      </div>
                      <div class="top-player__graph-item is-special">
                        <p class="top-player__graph-score">
                          <span></span><span></span>
                        </p>
                        <p class="top-player__graph-percent"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="top-player__data-block">
                <h2 class="top-player__data-h2">
                  <img
                      src="./assets/img/ttl_data_4.png"
                      alt="DATA 04 その他"
                    >
                </h2>
                <div class="top-player__data-inner">
                  <div class="top-player__data-item">
                    <h3>最初にフルコンボした楽曲</h3>
                    <div class="top-player__data-dtl">
                      <div class="top-player__data-song">
                        <div class="level" data-level="EASY">
                          <p></p>
                        </div>
                        <div class="level" data-level="NORMAL">
                          <p></p>
                        </div>
                        <div class="level" data-level="HARD">
                          <p></p>
                        </div>
                        <div class="level" data-level="EXPERT">
                          <p></p>
                        </div>
                        <div class="level" data-level="SPECIAL">
                          <p></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="top-player__data-item">
                    <h3>初めてTOP10000入りしたイベント</h3>
                    <div class="top-player__data-dtl">
                      <p class="top-player__data-txt txt-medium">
                        <span></span>
                      </p>
                    </div>
                  </div>
                  <div class="top-player__data-item">
                    <h3>あなたと同期の楽曲</h3>
                    <div class="top-player__data-dtl">
                      <p class="top-player__data-txt txt-medium">
                        <span></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="top-flyer">
            <span class="common__line"></span>
            <div class="common__inner">
              <h2 class="top-flyer__h2"> あなたの<span>社内報</span>はこちら！ </h2>
              <div class="top-flyer__img">
                <img src="" alt="あなたの社内報はこちら！">
              </div>
              <button class="top-flyer__btn">
                <span>画像をダウンロード</span>
              </button>
            </div>
          </section>
          <div class="top__share">
            <h2>
              <img
                  src="./assets/img/ttl_share.png"
                  alt="あなたの社内報をXでシェアしよう！"
                >
            </h2>
            <a href="" target="_blank" class="top__share-btn">
              <span>
                <img src="./assets/img/icon_x.png" alt="X">
              </span> でシェアする </a>
            <p class="top__share-txt"> ※画像は自動でポストに反映されません。<br>カードを添付してポストしてください。 </p>
          </div>
          <footer class="footer">
            <span class="common__line"></span>
            <div class="footer__app">
              <div class="common__inner">
                <div class="footer__app-wrap">
                  <div class="footer__app-icon">
                    <img src="./assets/img/common/icon_app.png" alt="">
                  </div>
                  <ul class="footer__app-download">
                    <a href="https://app.adjust.com/xf8xmuy?redirect=https%3A%2F%2Fapps.apple.com%2Fjp%2Fapp%2Fid1195834442" target="_blank">
                      <img
              src="./assets/img/common/btn_store_apple.png"
              alt="App Storeからダウンロード"
            >
                    </a>
                    <a href="https://app.adjust.com/i6ek911?redirect=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fhl%3Dja%26id%3Djp.co.craftegg.band" target="_blank">
                      <img
              src="./assets/img/common/btn_store_google.png"
              alt="Google Playで手に入れよう"
            >
                    </a>
                  </ul>
                </div>
                <dl class="footer__app-spec">
                  <dt>タイトル</dt>
                  <dd>バンドリ！ ガールズバンドパーティ！</dd>
                  <dt>ジャンル</dt>
                  <dd>リズム＆アドベンチャーゲーム</dd>
                  <dt>プレイ料金</dt>
                  <dd>基本プレイ無料</dd>
                  <dt>対応OS</dt>
                  <dd>iPhone8以降かつiOS13以上、Android10.0以上</dd>
                </dl>
                <ul class="footer__app-notes">
                  <li> ※Android、Google PlayおよびGoogle Playロゴは、Google LLCの商標です。 </li>
                  <li> ※iPhone、iTunesおよびApp Storeは、米国およびその他の国々で登録されたApple Inc.の商標です。 </li>
                </ul>
              </div>
            </div>
            <nav class="footer__nav">
              <a href="https://bang-dream.bushimo.jp/rule/">利用規約</a>
              <a href="https://bang-dream.bushimo.jp/privacy/"> プライバシーポリシー </a>
              <a href="https://bang-dream.bushimo.jp/external_transmission/"> 利用者情報の外部送信について </a>
              <a href="https://bang-dream.bushimo.jp/contact/faq/"> お問い合わせ </a>
            </nav>
            <div class="footer__btm">
              <div class="footer__btm-logo">
                <a href="https://bang-dream.bushimo.jp/">
                  <img
          src="./assets/img/common/logo_garupa.png"
          alt="BanG Dream!バンドリ！ ガールズバンドパーティ！"
        >
                </a>
                <a href="https://game.bushiroad.com/" target="_blank">
                  <img
          src="./assets/img/common/logo_bushimo.png"
          alt="ブシモ"
        >
                </a>
                <a href="https://bushiroad.com/" target="_blank">
                  <img
          src="./assets/img/common/logo_bushiroad.png"
          alt="BUSHIROAD"
        >
                </a>
              </div>
              <p class="footer__btm-copy"> 掲載の記事・写真・イラスト等すべてのコンテンツの無断複写・転載を禁じます。 <span>&copy;BanG Dream! Project</span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </article>
  </main>
  <script>
      var data = [
        {
          1: 1001,
          2: '新人スタッフ',
          3: '20160108',
        },
        3052,
        {
          1: 3,
          2: 1,
          3: '約束のキャンディ',
        },
        {
          1: 'ときめきエクスペリエンス！',
          2: 'キラキラだとか夢だとか ～Sing Girls～',
          3: 'YAPPY！SCHOOL CARNIVAL☆彡',
          4: "What's the POPIPA!?",
          5: '誓いのWingbeat',
        },
        {
          1: 512,
          2: 780,
        },
        1,
        {
          1: {
            1: 740,
            2: 752,
          },
          2: {
            1: 651,
            2: 752,
          },
          3: {
            1: 501,
            2: 752,
          },
          4: {
            1: 97,
            2: 752,
          },
          5: {
            1: 15,
            2: 431,
          },
        },
        {
          1: 'ときめきエクスペリエンス！',
          2: 52,
        },
        {
          1: 'パスパレ探検隊～無人島を征くアイドル～',
          2: 4192,
        },
        {
          1: 40,
          2: 5,
          3: 442,
        },
        72,
        'オトモダチフィルム',
      ];
    </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
  <script src="./assets/js/project.js"></script>
</body>
</html>