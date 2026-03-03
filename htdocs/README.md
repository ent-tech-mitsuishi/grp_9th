# ガルパ 9周年 振り返りページ

## 概要

バンドリ！ガールズバンドパーティ！（ガルパ）の9周年を記念した振り返りページです。

## 起動方法

```bash
docker compose up -d
```

## アクセスURL

```
http://localhost:8081/?json_param=<暗号化されたパラメータ>
```

サンプル:
```
http://localhost:8081/?json_param=0zBvh32KroK1vS-tb4rXCfFPlWcwkiX3wWxlUuhLy4SjAxQ3oojtFWvC5dZmHlt63NoePBIhC-_LJxAszm0pH86qr6lzQtc1UrmETGtArdIh_qdYq88qDlRlybnPnlqIgzIQmd0cwxwu3mfm0OK81MK6YBXZBs-NRLkILwsOODg9fYfcnkvvdc3HeW5XTG8l7UUgcyh8Uwup2zbTsFHqIpP0k17yccn0rNtdRL75nvLilK814D--HAm9nzloputSgOKC-t6LFkY62tPVsBQF6wen4EsRgmQQ4lL6TcsbsjJ5dnx5L_qE5a0wqXOfWioeL0I7c4zFw5b3UetJMgOIsD0WUNHlwKwf-l3r9fvr8dKxbQg8S-gqfNvr4vY2SZVEDwnjKP7adiFHwEsDuWe5YoYl3YV-2in-lDP6rIJB5H30V-gyPyfmVZxxRZy22f62ye3nvyrsypBly1t75lER8Z1t3RNmznjoeF2nXkWsijl8HBUjwgFdQiNXJf5FSYPlHY-m5SqfKWdRz4fA2mKkvQX1NnSAzqr74WL8NHsVB5UKvVA_aPTRwJx1NtQAI9TX
```

## ファイル構成

```
php/
├── index.php      # メインページ
├── error/
│   └── index.php  # エラーページ
└── sample.json    # サンプルデータ
```

## データフロー

1. GETパラメータ `json_param` を受け取る
2. パラメータがない場合 → エラーページへリダイレクト
3. デコード処理:
   - Base64 URL デコード
   - AES-128-CBC 復号
   - bzip2 解凍
4. JSONパース後、振り返りデータを表示

## 暗号化設定

| 項目 | 値 |
|-----|-----|
| 暗号方式 | AES-128-CBC |
| キー | `gbp_9th_Z2JwXzl0` |
| IV | `gbp_9th_oAa0lzXw` |

## JSONデータ構造

| インデックス | 内容 | 型 |
|------------|------|-----|
| `[0]` | ユーザー情報 | object |
| `[0]["1"]` | ユーザーID | number |
| `[0]["2"]` | ユーザー名 | string |
| `[0]["3"]` | 開始日（YYYYMMDD） | string |
| `[1]` | ログイン日数 | number |
| `[2]` | 最初に引いたキャラ | object |
| `[2]["1"]` | レアリティ（★の数） | number |
| `[2]["2"]` | キャラID | number |
| `[2]["3"]` | シチュエーション | string |
| `[3]` | 初フルコンボ曲（難易度別） | object |
| `[3]["1"]`〜`[3]["5"]` | EASY〜SPECIALの楽曲名 | string |
| `[4]` | カード収集 | object |
| `[4]["1"]` | 集めた数 | number |
| `[4]["2"]` | 全体数 | number |
| `[5]` | 一番集めているキャラID | number |
| `[6]` | 楽曲クリア率（難易度別） | object |
| `[6]["1"]`〜`[6]["5"]` | 各難易度のクリア数/総数 | object |
| `[7]` | 最もプレイした楽曲 | object |
| `[7]["1"]` | 楽曲名 | string |
| `[7]["2"]` | プレイ回数 | number |
| `[8]` | 初TOP10,000イベント | object |
| `[8]["1"]` | イベント名 | string |
| `[8]["2"]` | 順位 | number |
| `[9]` | 読破済みストーリー | object |
| `[9]["1"]` | メインストーリー話数 | number |
| `[9]["2"]` | バンドストーリー話数 | number |
| `[9]["3"]` | イベントストーリー話数 | number |
| `[10]` | ラウンジ会話視聴回数 | number |
| `[11]` | 同期の楽曲 | string |

## JavaScript連携

復号されたデータは `window.garupa9thData` でアクセス可能です。

```javascript
// 全データ
console.log(window.garupa9thData);

// ユーザー名
console.log(window.garupa9thData[0]["2"]);

// ログイン日数
console.log(window.garupa9thData[1]);
```

## キャラクターID対応表

| ID | キャラクター | バンド |
|----|------------|--------|
| 1-5 | 戸山香澄, 花園たえ, 牛込りみ, 山吹沙綾, 市ヶ谷有咲 | Poppin'Party |
| 6-10 | 美竹蘭, 青葉モカ, 上原ひまり, 宇田川巴, 羽沢つぐみ | Afterglow |
| 11-15 | 弦巻こころ, 瀬田薫, 北沢はぐみ, 松原花音, 奥沢美咲 | ハロー、ハッピーワールド！ |
| 16-20 | 丸山彩, 氷川日菜, 白鷺千聖, 大和麻弥, 若宮イヴ | Pastel＊Palettes |
| 21-25 | 湊友希那, 氷川紗夜, 今井リサ, 宇田川あこ, 白金燐子 | Roselia |
| 26-30 | 倉田ましろ, 桐ヶ谷透子, 広町七深, 二葉つくし, 八潮瑠唯 | Morfonica |
| 31-35 | レイヤ, ロック, マスキング, パレオ, チュチュ | RAISE A SUILEN |
| 36-40 | 高松燈, 千早愛音, 要楽奈, 長崎そよ, 椎名立希 | MyGO!!!!! |
